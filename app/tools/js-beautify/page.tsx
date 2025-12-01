"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("js-beautify")!;
const similarTools = getToolsByCategory("dev").filter(t => t.slug !== "js-beautify");

export default function JsBeautifyPage() {
  const [input, setInput] = useState("");
  const [indentSize, setIndentSize] = useState(2);

  const beautify = (): string => {
    if (!input.trim()) return "";
    
    const indent = " ".repeat(indentSize);
    let level = 0;
    let result = "";
    let inString = false;
    let stringChar = "";
    
    for (let i = 0; i < input.length; i++) {
      const char = input[i];
      const prevChar = input[i - 1] || "";
      
      // Track strings
      if ((char === '"' || char === "'" || char === "`") && prevChar !== "\\") {
        if (!inString) {
          inString = true;
          stringChar = char;
        } else if (char === stringChar) {
          inString = false;
        }
      }
      
      if (inString) {
        result += char;
        continue;
      }
      
      if (char === "{" || char === "[") {
        result += " " + char + "\n" + indent.repeat(++level);
      } else if (char === "}" || char === "]") {
        result += "\n" + indent.repeat(--level) + char;
      } else if (char === ";") {
        result += ";\n" + indent.repeat(level);
      } else if (char === ",") {
        result += ",\n" + indent.repeat(level);
      } else if (char === "\n" || char === "\r") {
        // Skip existing newlines
      } else {
        result += char;
      }
    }
    
    return result
      .replace(/\n\s*\n/g, "\n")
      .replace(/{\s+}/g, "{}")
      .replace(/\[\s+\]/g, "[]")
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
          label="Input JavaScript"
          placeholder="Paste your JavaScript here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <OutputBox label="Beautified JavaScript" value={beautify()} />
      </div>
    </ToolLayout>
  );
}
