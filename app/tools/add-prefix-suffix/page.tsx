"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("add-prefix-suffix")!;
const similarTools = getToolsByCategory("text").filter(t => t.slug !== "add-prefix-suffix");

export default function AddPrefixSuffixPage() {
  const [input, setInput] = useState("");
  const [prefix, setPrefix] = useState("");
  const [suffix, setSuffix] = useState("");
  const [skipEmpty, setSkipEmpty] = useState(true);

  const addPrefixSuffix = (): string => {
    if (!input) return "";
    return input
      .split("\n")
      .map(line => {
        if (skipEmpty && !line.trim()) return line;
        return `${prefix}${line}${suffix}`;
      })
      .join("\n");
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Prefix</label>
            <input
              type="text"
              value={prefix}
              onChange={(e) => setPrefix(e.target.value)}
              placeholder="Text to add before each line..."
              className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Suffix</label>
            <input
              type="text"
              value={suffix}
              onChange={(e) => setSuffix(e.target.value)}
              placeholder="Text to add after each line..."
              className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            />
          </div>
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={skipEmpty}
            onChange={(e) => setSkipEmpty(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Skip empty lines</span>
        </label>

        <TextArea
          label="Input Text"
          placeholder="Enter your text (one item per line)..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <OutputBox label="Result" value={addPrefixSuffix()} />
      </div>
    </ToolLayout>
  );
}
