"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("json-escape")!;
const similarTools = getToolsByCategory("dev").filter(t => t.slug !== "json-escape");

export default function JsonEscapePage() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"escape" | "unescape">("escape");

  const process = (): string => {
    if (!input) return "";
    
    if (mode === "escape") {
      return JSON.stringify(input);
    } else {
      try {
        // Remove surrounding quotes if present
        const trimmed = input.trim();
        if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
          return JSON.parse(trimmed);
        }
        return JSON.parse(`"${trimmed}"`);
      } catch {
        return "Invalid escaped string";
      }
    }
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="flex gap-2">
          <button
            onClick={() => setMode("escape")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              mode === "escape"
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "bg-[var(--muted)] hover:bg-[var(--accent)]"
            }`}
          >
            Escape
          </button>
          <button
            onClick={() => setMode("unescape")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              mode === "unescape"
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "bg-[var(--muted)] hover:bg-[var(--accent)]"
            }`}
          >
            Unescape
          </button>
        </div>

        <TextArea
          label={mode === "escape" ? "Text to Escape" : "Escaped String to Unescape"}
          placeholder={mode === "escape" ? "Enter text with special characters..." : 'Enter escaped string like \\"hello\\"...'}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <OutputBox label={mode === "escape" ? "Escaped JSON String" : "Unescaped Text"} value={process()} />
      </div>
    </ToolLayout>
  );
}
