"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("text-trim")!;
const similarTools = getToolsByCategory("text").filter(t => t.slug !== "text-trim");

type TrimMode = "both" | "start" | "end" | "all-whitespace" | "each-line";

export default function TextTrimPage() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<TrimMode>("both");

  const trimText = (): string => {
    if (!input) return "";
    
    switch (mode) {
      case "both":
        return input.trim();
      case "start":
        return input.trimStart();
      case "end":
        return input.trimEnd();
      case "all-whitespace":
        return input.replace(/\s+/g, " ").trim();
      case "each-line":
        return input.split("\n").map(line => line.trim()).join("\n");
      default:
        return input;
    }
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "both", label: "Trim Both Ends" },
            { id: "start", label: "Trim Start" },
            { id: "end", label: "Trim End" },
            { id: "all-whitespace", label: "Collapse Whitespace" },
            { id: "each-line", label: "Trim Each Line" },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setMode(option.id as TrimMode)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === option.id
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "bg-[var(--muted)] hover:bg-[var(--accent)]"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>

        <TextArea
          label="Input Text"
          placeholder="Enter text with whitespace to trim..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <OutputBox label="Trimmed Text" value={trimText()} />
      </div>
    </ToolLayout>
  );
}
