"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("number-lines")!;
const similarTools = getToolsByCategory("text").filter(t => t.slug !== "number-lines");

export default function NumberLinesPage() {
  const [input, setInput] = useState("");
  const [startNumber, setStartNumber] = useState(1);
  const [separator, setSeparator] = useState(". ");
  const [padNumbers, setPadNumbers] = useState(false);

  const numberLines = (): string => {
    if (!input) return "";
    const lines = input.split("\n");
    const maxDigits = String(startNumber + lines.length - 1).length;
    
    return lines
      .map((line, i) => {
        const num = startNumber + i;
        const numStr = padNumbers ? String(num).padStart(maxDigits, "0") : String(num);
        return `${numStr}${separator}${line}`;
      })
      .join("\n");
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Start Number</label>
            <input
              type="number"
              value={startNumber}
              onChange={(e) => setStartNumber(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Separator</label>
            <input
              type="text"
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
              placeholder=". "
              className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={padNumbers}
            onChange={(e) => setPadNumbers(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Pad numbers with zeros (01, 02, 03...)</span>
        </label>

        <TextArea
          label="Input Text"
          placeholder="Enter your text..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <OutputBox label="Numbered Lines" value={numberLines()} />
      </div>
    </ToolLayout>
  );
}
