"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("text-repeat")!;
const similarTools = getToolsByCategory("text").filter(t => t.slug !== "text-repeat");

export default function TextRepeatPage() {
  const [input, setInput] = useState("");
  const [count, setCount] = useState(3);
  const [separator, setSeparator] = useState("\\n");

  const repeatText = (): string => {
    if (!input || count < 1) return "";
    const sep = separator.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
    return Array(count).fill(input).join(sep);
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Repeat Count</label>
            <input
              type="number"
              min="1"
              max="1000"
              value={count}
              onChange={(e) => setCount(Math.min(1000, Math.max(1, parseInt(e.target.value) || 1)))}
              className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Separator (use \n for newline)</label>
            <input
              type="text"
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
              placeholder="Separator..."
              className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            />
          </div>
        </div>

        <TextArea
          label="Text to Repeat"
          placeholder="Enter text to repeat..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <OutputBox label={`Repeated ${count} times`} value={repeatText()} />
      </div>
    </ToolLayout>
  );
}
