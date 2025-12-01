"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("html-beautify")!;
const similarTools = getToolsByCategory("dev").filter(t => t.slug !== "html-beautify");

export default function HtmlBeautifyPage() {
  const [input, setInput] = useState("");
  const [indentSize, setIndentSize] = useState(2);

  const beautify = (): string => {
    if (!input.trim()) return "";
    
    const indent = " ".repeat(indentSize);
    let result = "";
    let level = 0;
    
    // Simple HTML formatter
    const lines = input
      .replace(/>\s*</g, ">\n<")
      .replace(/>\s+/g, ">")
      .replace(/\s+</g, "<")
      .split("\n");
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      
      // Decrease level for closing tags
      if (trimmed.match(/^<\/\w/)) {
        level = Math.max(0, level - 1);
      }
      
      result += indent.repeat(level) + trimmed + "\n";
      
      // Increase level for opening tags (not self-closing)
      if (trimmed.match(/^<\w/) && !trimmed.match(/\/>$/) && !trimmed.match(/^<(br|hr|img|input|meta|link)/i)) {
        if (!trimmed.match(/<\/\w+>$/)) {
          level++;
        }
      }
    }
    
    return result.trim();
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Indent Size</label>
          <div className="flex gap-2">
            {[2, 4].map((size) => (
              <button
                key={size}
                onClick={() => setIndentSize(size)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  indentSize === size
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "bg-[var(--muted)] hover:bg-[var(--accent)]"
                }`}
              >
                {size} spaces
              </button>
            ))}
          </div>
        </div>

        <TextArea
          label="Input HTML"
          placeholder="Paste your HTML here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <OutputBox label="Beautified HTML" value={beautify()} />
      </div>
    </ToolLayout>
  );
}
