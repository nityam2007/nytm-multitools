"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("css-beautify")!;
const similarTools = getToolsByCategory("dev").filter(t => t.slug !== "css-beautify");

export default function CssBeautifyPage() {
  const [input, setInput] = useState("");
  const [indentSize, setIndentSize] = useState(2);

  const beautify = (): string => {
    if (!input.trim()) return "";
    
    const indent = " ".repeat(indentSize);
    
    return input
      // Add newline after {
      .replace(/\{/g, " {\n" + indent)
      // Add newline before }
      .replace(/\}/g, "\n}\n\n")
      // Add newline after ;
      .replace(/;/g, ";\n" + indent)
      // Clean up extra whitespace
      .replace(/\n\s*\n\s*\n/g, "\n\n")
      .replace(/\{\s*\n\s*\n/g, "{\n" + indent)
      .replace(/\n\s*\}/g, "\n}")
      // Trim trailing indent before }
      .replace(new RegExp(indent + "}", "g"), "}")
      .trim();
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
          label="Input CSS"
          placeholder="Paste your CSS here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <OutputBox label="Beautified CSS" value={beautify()} />
      </div>
    </ToolLayout>
  );
}
