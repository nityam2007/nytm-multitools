"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("hex-to-text")!;
const similarTools = getToolsByCategory("converter").filter(t => t.slug !== "hex-to-text");

export default function HexToTextPage() {
  const [hex, setHex] = useState("");

  const { text, error } = useMemo(() => {
    // Remove common prefixes and separators
    const cleaned = hex.replace(/0x/gi, "").replace(/[^0-9a-fA-F]/g, "");
    if (!cleaned) return { text: "", error: "" };
    
    if (cleaned.length % 2 !== 0) {
      return { text: "", error: "Hex string must have even number of characters" };
    }
    
    try {
      const chunks = cleaned.match(/.{2}/g);
      if (!chunks) return { text: "", error: "" };
      
      const result = chunks.map(chunk => {
        const charCode = parseInt(chunk, 16);
        if (isNaN(charCode)) throw new Error("Invalid hex");
        return String.fromCharCode(charCode);
      }).join("");
      
      return { text: result, error: "" };
    } catch {
      return { text: "", error: "Invalid hex input" };
    }
  }, [hex]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(text);
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Hex Input</label>
          <textarea
            value={hex}
            onChange={(e) => setHex(e.target.value)}
            placeholder="Enter hex (e.g., 48 65 6C 6C 6F or 48656C6C6F)..."
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
          <h3 className="font-semibold mb-3">Supported Formats</h3>
          <div className="space-y-2 text-sm font-mono">
            <div>48656C6C6F → Hello</div>
            <div>48 65 6C 6C 6F → Hello</div>
            <div>0x48 0x65 0x6C 0x6C 0x6F → Hello</div>
            <div>48-65-6C-6C-6F → Hello</div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
