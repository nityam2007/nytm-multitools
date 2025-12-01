"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("text-to-binary")!;
const similarTools = getToolsByCategory("converter").filter(t => t.slug !== "text-to-binary");

export default function TextToBinaryPage() {
  const [text, setText] = useState("");
  const [separator, setSeparator] = useState(" ");

  const textToBinary = (str: string): string => {
    return str.split("").map(char => {
      return char.charCodeAt(0).toString(2).padStart(8, "0");
    }).join(separator);
  };

  const binary = textToBinary(text);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(binary);
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Input Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to convert..."
            className="w-full h-32 px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)] resize-none"
          />
        </div>

        <div className="flex gap-4 items-center">
          <label className="text-sm font-medium">Separator:</label>
          <select
            value={separator}
            onChange={(e) => setSeparator(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)]"
          >
            <option value=" ">Space</option>
            <option value="">None</option>
            <option value="-">Dash</option>
            <option value="\n">New Line</option>
          </select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Binary Output</label>
            <button
              onClick={copyToClipboard}
              disabled={!binary}
              className="px-3 py-1 text-sm rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] disabled:opacity-50"
            >
              Copy
            </button>
          </div>
          <textarea
            value={binary}
            readOnly
            placeholder="Binary output will appear here..."
            className="w-full h-48 px-4 py-3 rounded-lg bg-[var(--muted)] border border-[var(--border)] resize-none font-mono text-sm"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-[var(--muted)] rounded-lg p-4">
            <div className="text-[var(--muted-foreground)]">Input Characters</div>
            <div className="text-2xl font-bold">{text.length}</div>
          </div>
          <div className="bg-[var(--muted)] rounded-lg p-4">
            <div className="text-[var(--muted-foreground)]">Binary Bits</div>
            <div className="text-2xl font-bold">{text.length * 8}</div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
