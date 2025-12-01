"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("remove-empty-lines")!;
const similarTools = getToolsByCategory("text").filter(t => t.slug !== "remove-empty-lines");

export default function RemoveEmptyLinesPage() {
  const [input, setInput] = useState("");
  const [removeWhitespaceOnly, setRemoveWhitespaceOnly] = useState(true);
  const [consolidateMultiple, setConsolidateMultiple] = useState(false);

  const removeEmptyLines = (): string => {
    if (!input) return "";
    
    if (consolidateMultiple) {
      // Replace multiple empty lines with single empty line
      return input.replace(/(\r?\n\s*){3,}/g, "\n\n");
    }
    
    return input
      .split("\n")
      .filter(line => removeWhitespaceOnly ? line.trim() : line)
      .join("\n");
  };

  const originalLines = input.split("\n").length;
  const resultLines = removeEmptyLines().split("\n").length;

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={removeWhitespaceOnly}
              onChange={(e) => setRemoveWhitespaceOnly(e.target.checked)}
              className="rounded"
              disabled={consolidateMultiple}
            />
            <span className="text-sm">Remove whitespace-only lines</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={consolidateMultiple}
              onChange={(e) => setConsolidateMultiple(e.target.checked)}
              className="rounded"
            />
            <span className="text-sm">Consolidate multiple empty lines to one</span>
          </label>
        </div>

        <TextArea
          label="Input Text"
          placeholder="Enter text with empty lines..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {input && (
          <div className="text-sm text-[var(--muted-foreground)]">
            {originalLines} lines → {resultLines} lines ({originalLines - resultLines} removed)
          </div>
        )}

        <OutputBox label="Result" value={removeEmptyLines()} />
      </div>
    </ToolLayout>
  );
}
