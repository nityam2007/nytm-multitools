"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("text-join")!;
const similarTools = getToolsByCategory("text").filter(t => t.slug !== "text-join");

export default function TextJoinPage() {
  const [input, setInput] = useState("");
  const [delimiter, setDelimiter] = useState(", ");

  const joinLines = (): string => {
    if (!input) return "";
    const lines = input.split("\n").filter(line => line.trim());
    const sep = delimiter.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
    return lines.join(sep);
  };

  const presets = [
    { label: "Comma", value: ", " },
    { label: "Semicolon", value: "; " },
    { label: "Pipe", value: " | " },
    { label: "Space", value: " " },
    { label: "Tab", value: "\\t" },
    { label: "Newline", value: "\\n" },
  ];

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Delimiter</label>
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
          label="Lines to Join"
          placeholder="Enter lines to join (one per line)..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <OutputBox label="Joined Text" value={joinLines()} />
      </div>
    </ToolLayout>
  );
}
