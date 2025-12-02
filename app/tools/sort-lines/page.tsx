"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("sort-lines")!;
const similarTools = getToolsByCategory("text").filter(t => t.slug !== "sort-lines");

type SortMode = "alphabetical" | "alphabetical-desc" | "numeric" | "numeric-desc" | "length" | "length-desc" | "random";

export default function SortLinesPage() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<SortMode>("alphabetical");
  const [ignoreCase, setIgnoreCase] = useState(false);

  const sortLines = (): string => {
    if (!input.trim()) return "";
    
    let lines = input.split("\n");
    
    switch (mode) {
      case "alphabetical":
        lines.sort((a, b) => ignoreCase ? a.toLowerCase().localeCompare(b.toLowerCase()) : a.localeCompare(b));
        break;
      case "alphabetical-desc":
        lines.sort((a, b) => ignoreCase ? b.toLowerCase().localeCompare(a.toLowerCase()) : b.localeCompare(a));
        break;
      case "numeric":
        lines.sort((a, b) => parseFloat(a) - parseFloat(b));
        break;
      case "numeric-desc":
        lines.sort((a, b) => parseFloat(b) - parseFloat(a));
        break;
      case "length":
        lines.sort((a, b) => a.length - b.length);
        break;
      case "length-desc":
        lines.sort((a, b) => b.length - a.length);
        break;
      case "random":
        lines = lines.sort(() => Math.random() - 0.5);
        break;
    }
    
    return lines.join("\n");
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "alphabetical", label: "A → Z" },
            { id: "alphabetical-desc", label: "Z → A" },
            { id: "numeric", label: "0 → 9" },
            { id: "numeric-desc", label: "9 → 0" },
            { id: "length", label: "Short → Long" },
            { id: "length-desc", label: "Long → Short" },
            { id: "random", label: "Random", icon: true },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setMode(option.id as SortMode)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-1.5 ${
                mode === option.id
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "bg-[var(--muted)] hover:bg-[var(--accent)]"
              }`}
            >
              {option.icon && (
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              {option.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={ignoreCase}
            onChange={(e) => setIgnoreCase(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Ignore case</span>
        </label>

        <TextArea
          label="Input Text"
          placeholder="Enter lines to sort..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <OutputBox label="Sorted Lines" value={sortLines()} />
      </div>
    </ToolLayout>
  );
}
