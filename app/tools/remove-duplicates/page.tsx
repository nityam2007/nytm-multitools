"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("remove-duplicates")!;
const similarTools = getToolsByCategory("text").filter(t => t.slug !== "remove-duplicates");

export default function RemoveDuplicatesPage() {
  const [input, setInput] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(true);
  const [trimLines, setTrimLines] = useState(true);

  const removeDuplicates = (): string => {
    if (!input.trim()) return "";
    
    let lines = input.split("\n");
    if (trimLines) lines = lines.map(l => l.trim());
    
    const seen = new Set<string>();
    const result: string[] = [];
    
    for (const line of lines) {
      const key = caseSensitive ? line : line.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        result.push(line);
      }
    }
    
    return result.join("\n");
  };

  const output = removeDuplicates();
  const originalCount = input.split("\n").length;
  const resultCount = output ? output.split("\n").length : 0;
  const removedCount = originalCount - resultCount;

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={caseSensitive}
              onChange={(e) => setCaseSensitive(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Case sensitive</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={trimLines}
              onChange={(e) => setTrimLines(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Trim whitespace</span>
          </label>
        </div>

        <TextArea
          label="Input Text"
          placeholder="Enter text with duplicate lines..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {input && (
          <div className="flex gap-4 text-sm">
            <span>Original: {originalCount} lines</span>
            <span>Result: {resultCount} lines</span>
            <span className="text-green-500">Removed: {removedCount} duplicates</span>
          </div>
        )}

        <OutputBox label="Unique Lines" value={output} />
      </div>
    </ToolLayout>
  );
}
