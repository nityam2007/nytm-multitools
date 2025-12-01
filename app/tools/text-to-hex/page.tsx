"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("text-to-hex")!;
const similarTools = getToolsByCategory("converter").filter(t => t.slug !== "text-to-hex");

export default function TextToHexPage() {
  const [text, setText] = useState("");
  const [separator, setSeparator] = useState(" ");
  const [prefix, setPrefix] = useState(false);

  const textToHex = (str: string): string => {
    return str.split("").map(char => {
      const hex = char.charCodeAt(0).toString(16).padStart(2, "0").toUpperCase();
      return prefix ? `0x${hex}` : hex;
    }).join(separator);
  };

  const hex = textToHex(text);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hex);
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

        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex gap-2 items-center">
            <label className="text-sm font-medium">Separator:</label>
            <select
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
              className="px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            >
              <option value=" ">Space</option>
              <option value="">None</option>
              <option value="-">Dash</option>
              <option value=":">Colon</option>
            </select>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={prefix}
              onChange={(e) => setPrefix(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Add 0x prefix</span>
          </label>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Hex Output</label>
            <button
              onClick={copyToClipboard}
              disabled={!hex}
              className="px-3 py-1 text-sm rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] disabled:opacity-50"
            >
              Copy
            </button>
          </div>
          <textarea
            value={hex}
            readOnly
            placeholder="Hex output will appear here..."
            className="w-full h-32 px-4 py-3 rounded-lg bg-[var(--muted)] border border-[var(--border)] resize-none font-mono"
          />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="bg-[var(--muted)] rounded-lg p-4">
            <div className="text-[var(--muted-foreground)]">Input Characters</div>
            <div className="text-2xl font-bold">{text.length}</div>
          </div>
          <div className="bg-[var(--muted)] rounded-lg p-4">
            <div className="text-[var(--muted-foreground)]">Hex Bytes</div>
            <div className="text-2xl font-bold">{text.length}</div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
