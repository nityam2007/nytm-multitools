"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("xml-minify")!;
const similarTools = getToolsByCategory("dev").filter(t => t.slug !== "xml-minify");

export default function XmlMinifyPage() {
  const [input, setInput] = useState("");
  const [removeComments, setRemoveComments] = useState(true);

  const minify = (): string => {
    if (!input.trim()) return "";
    
    let result = input;
    
    if (removeComments) {
      result = result.replace(/<!--[\s\S]*?-->/g, "");
    }
    
    return result
      // Remove whitespace between tags
      .replace(/>\s+</g, "><")
      // Remove newlines
      .replace(/\n/g, "")
      // Collapse whitespace
      .replace(/\s+/g, " ")
      .trim();
  };

  const output = minify();
  const savedBytes = input.length - output.length;
  const savedPercent = input.length > 0 ? ((savedBytes / input.length) * 100).toFixed(1) : 0;

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={removeComments}
            onChange={(e) => setRemoveComments(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Remove comments</span>
        </label>

        <TextArea
          label="Input XML"
          placeholder="Paste your XML here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {output && (
          <div className="text-sm text-green-500">
            Saved {savedBytes} bytes ({savedPercent}% reduction)
          </div>
        )}

        <OutputBox label="Minified XML" value={output} />
      </div>
    </ToolLayout>
  );
}
