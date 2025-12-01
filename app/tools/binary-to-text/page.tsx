"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("binary-to-text")!;
const similarTools = getToolsByCategory("converter").filter(t => t.slug !== "binary-to-text");

export default function BinaryToTextPage() {
  const [binary, setBinary] = useState("");

  const { text, error } = useMemo(() => {
    // Remove all non-binary characters and split by common separators
    const cleaned = binary.replace(/[^01\s]/g, "").trim();
    if (!cleaned) return { text: "", error: "" };
    
    // Split into 8-bit chunks
    const chunks = cleaned.split(/\s+/).join("").match(/.{1,8}/g);
    if (!chunks) return { text: "", error: "" };
    
    try {
      const result = chunks.map(chunk => {
        if (chunk.length < 8) {
          chunk = chunk.padStart(8, "0");
        }
        const charCode = parseInt(chunk, 2);
        if (isNaN(charCode)) throw new Error("Invalid binary");
        return String.fromCharCode(charCode);
      }).join("");
      return { text: result, error: "" };
    } catch {
      return { text: "", error: "Invalid binary input" };
    }
  }, [binary]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Binary Input</label>
          <textarea
            value={binary}
            onChange={(e) => setBinary(e.target.value)}
            placeholder="Enter binary (e.g., 01001000 01100101 01101100 01101100 01101111)..."
            className="w-full h-32 px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)] resize-none font-mono"
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Text Output</label>
            <button
              onClick={copyToClipboard}
              disabled={!text}
              className="px-3 py-1 text-sm rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] disabled:opacity-50"
            >
              Copy
            </button>
          </div>
          <textarea
            value={text}
            readOnly
            placeholder="Text output will appear here..."
            className="w-full h-32 px-4 py-3 rounded-lg bg-[var(--muted)] border border-[var(--border)] resize-none"
          />
        </div>

        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-3">Examples</h3>
          <div className="space-y-2 text-sm font-mono">
            <div className="flex flex-wrap gap-2">
              <span className="text-[var(--muted-foreground)]">Hello =</span>
              <span>01001000 01100101 01101100 01101100 01101111</span>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="text-[var(--muted-foreground)]">A =</span>
              <span>01000001</span>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
