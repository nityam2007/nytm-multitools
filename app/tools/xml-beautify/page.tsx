"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("xml-beautify")!;
const similarTools = getToolsByCategory("dev").filter(t => t.slug !== "xml-beautify");

export default function XmlBeautifyPage() {
  const [input, setInput] = useState("");
  const [indentSize, setIndentSize] = useState(2);

  const beautify = (): string => {
    if (!input.trim()) return "";
    
    const indent = " ".repeat(indentSize);
    let result = "";
    let level = 0;
    
    // Split by tags while keeping them
    const parts = input.replace(/>\s*</g, ">\n<").split("\n");
    
    for (const part of parts) {
      const trimmed = part.trim();
      if (!trimmed) continue;
      
      // Closing tag
      if (trimmed.startsWith("</")) {
        level = Math.max(0, level - 1);
        result += indent.repeat(level) + trimmed + "\n";
      }
      // Self-closing tag or declaration
      else if (trimmed.endsWith("/>") || trimmed.startsWith("<?") || trimmed.startsWith("<!")) {
        result += indent.repeat(level) + trimmed + "\n";
      }
      // Opening tag
      else if (trimmed.startsWith("<")) {
        result += indent.repeat(level) + trimmed + "\n";
        if (!trimmed.includes("</")) {
          level++;
        }
      }
      // Text content
      else {
        result += indent.repeat(level) + trimmed + "\n";
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
          label="Input XML"
          placeholder="Paste your XML here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <OutputBox label="Beautified XML" value={beautify()} />
      </div>
    </ToolLayout>
  );
}
