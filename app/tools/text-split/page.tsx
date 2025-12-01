"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("text-split")!;
const similarTools = getToolsByCategory("text").filter(t => t.slug !== "text-split");

export default function TextSplitPage() {
  const [input, setInput] = useState("");
  const [delimiter, setDelimiter] = useState(",");

  const splitText = (): string => {
    if (!input) return "";
    const sep = delimiter.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
    return input.split(sep).map(s => s.trim()).filter(s => s).join("\n");
  };

  const presets = [
    { label: "Comma", value: "," },
    { label: "Semicolon", value: ";" },
    { label: "Pipe", value: "|" },
    { label: "Space", value: " " },
    { label: "Tab", value: "\\t" },
  ];

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Split by</label>
          <div className="flex gap-2 mb-2 flex-wrap">
            {presets.map((preset) => (
              <button
                key={preset.value}
                onClick={() => setDelimiter(preset.value)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  delimiter === preset.value
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "bg-[var(--muted)] hover:bg-[var(--accent)]"
                }`}
              >
                {preset.label}
              </button>
            ))}
          </div>
          <input
            type="text"
            value={delimiter}
            onChange={(e) => setDelimiter(e.target.value)}
            placeholder="Custom delimiter..."
            className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)]"
          />
        </div>

        <TextArea
          label="Text to Split"
          placeholder="Enter text to split..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <OutputBox label="Split Result (one per line)" value={splitText()} />
      </div>
    </ToolLayout>
  );
}
