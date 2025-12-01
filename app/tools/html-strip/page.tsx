"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("html-strip")!;
const similarTools = getToolsByCategory("dev").filter(t => t.slug !== "html-strip");

export default function HtmlStripPage() {
  const [input, setInput] = useState("");
  const [preserveLineBreaks, setPreserveLineBreaks] = useState(true);
  const [preserveLinks, setPreserveLinks] = useState(false);

  const stripHtml = (): string => {
    if (!input) return "";
    
    let result = input;
    
    // Extract links if preserving
    const links: string[] = [];
    if (preserveLinks) {
      result = result.replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, (_, href, text) => {
        links.push(`[${text}](${href})`);
        return `__LINK_${links.length - 1}__`;
      });
    }
    
    // Replace line break tags with newlines
    if (preserveLineBreaks) {
      result = result.replace(/<br\s*\/?>/gi, "\n");
      result = result.replace(/<\/p>\s*<p>/gi, "\n\n");
      result = result.replace(/<\/(div|p|h[1-6]|li|tr)>/gi, "\n");
    }
    
    // Remove all HTML tags
    result = result.replace(/<[^>]*>/g, "");
    
    // Restore links
    if (preserveLinks) {
      result = result.replace(/__LINK_(\d+)__/g, (_, i) => links[parseInt(i)]);
    }
    
    // Decode common entities
    result = result
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    
    // Clean up whitespace
    result = result.replace(/\n\s*\n\s*\n/g, "\n\n").trim();
    
    return result;
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={preserveLineBreaks}
              onChange={(e) => setPreserveLineBreaks(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Preserve line breaks</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={preserveLinks}
              onChange={(e) => setPreserveLinks(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Preserve links (markdown format)</span>
          </label>
        </div>

        <TextArea
          label="HTML Input"
          placeholder="Paste HTML content..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <OutputBox label="Plain Text" value={stripHtml()} />
      </div>
    </ToolLayout>
  );
}
