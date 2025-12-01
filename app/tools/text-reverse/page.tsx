"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("text-reverse")!;
const similarTools = getToolsByCategory("text").filter(t => t.slug !== "text-reverse");

type ReverseMode = "characters" | "words" | "lines";

export default function TextReversePage() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<ReverseMode>("characters");

  const reverseText = (text: string, mode: ReverseMode): string => {
    switch (mode) {
      case "characters":
        return text.split("").reverse().join("");
      case "words":
        return text.split(/(\s+)/).reverse().join("");
      case "lines":
        return text.split("\n").reverse().join("\n");
      default:
        return text;
    }
  };

  const output = reverseText(input, mode);

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "characters", label: "Reverse Characters" },
            { id: "words", label: "Reverse Words" },
            { id: "lines", label: "Reverse Lines" },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setMode(option.id as ReverseMode)}
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
          placeholder="Enter text to reverse..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <OutputBox label="Reversed Text" value={output} />
      </div>
    </ToolLayout>
  );
}
