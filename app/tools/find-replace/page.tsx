"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("find-replace")!;
const similarTools = getToolsByCategory("text").filter(t => t.slug !== "find-replace");

export default function FindReplacePage() {
  const [input, setInput] = useState("");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [useRegex, setUseRegex] = useState(false);
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [replaceAll, setReplaceAll] = useState(true);

  const doReplace = (): { output: string; count: number } => {
    if (!input || !find) return { output: input, count: 0 };
    
    try {
      let count = 0;
      let result = input;
      
      if (useRegex) {
        const flags = replaceAll ? (caseSensitive ? "g" : "gi") : (caseSensitive ? "" : "i");
        const regex = new RegExp(find, flags);
        result = input.replace(regex, () => {
          count++;
          return replace;
        });
      } else {
        if (replaceAll) {
          const escaped = find.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
          const flags = caseSensitive ? "g" : "gi";
          const regex = new RegExp(escaped, flags);
          result = input.replace(regex, () => {
            count++;
            return replace;
          });
        } else {
          const index = caseSensitive ? input.indexOf(find) : input.toLowerCase().indexOf(find.toLowerCase());
          if (index !== -1) {
            result = input.slice(0, index) + replace + input.slice(index + find.length);
            count = 1;
          }
        }
      }
      
      return { output: result, count };
    } catch (e) {
      return { output: "Invalid regex pattern", count: 0 };
    }
  };

  const { output, count } = doReplace();

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Find</label>
            <input
              type="text"
              value={find}
              onChange={(e) => setFind(e.target.value)}
              placeholder="Text to find..."
              className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Replace with</label>
            <input
              type="text"
              value={replace}
              onChange={(e) => setReplace(e.target.value)}
              placeholder="Replacement text..."
              className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={useRegex} onChange={(e) => setUseRegex(e.target.checked)} className="rounded" />
            <span className="text-sm">Use regex</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={caseSensitive} onChange={(e) => setCaseSensitive(e.target.checked)} className="rounded" />
            <span className="text-sm">Case sensitive</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={replaceAll} onChange={(e) => setReplaceAll(e.target.checked)} className="rounded" />
            <span className="text-sm">Replace all</span>
          </label>
        </div>

        <TextArea
          label="Input Text"
          placeholder="Enter your text..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {find && <div className="text-sm text-[var(--muted-foreground)]">{count} replacement(s) made</div>}

        <OutputBox label="Result" value={output} />
      </div>
    </ToolLayout>
  );
}
