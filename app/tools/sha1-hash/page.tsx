"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("sha1-hash")!;
const similarTools = getToolsByCategory("security").filter(t => t.slug !== "sha1-hash");

async function sha1(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-1", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export default function SHA1HashPage() {
  const [input, setInput] = useState("");
  const [hash, setHash] = useState("");
  const [uppercase, setUppercase] = useState(false);

  const generateHash = async () => {
    const result = await sha1(input);
    setHash(uppercase ? result.toUpperCase() : result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hash);
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-xl p-4 text-yellow-500 text-sm">
          ⚠️ <strong>Warning:</strong> SHA-1 is considered cryptographically weak. For security applications, use SHA-256 or SHA-512.
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Input Text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to hash..."
            className="w-full h-32 px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)] resize-none"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Uppercase output</span>
          </label>
        </div>

        <button
          onClick={generateHash}
          className="w-full py-3 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-medium hover:opacity-90 transition-opacity"
        >
          Generate SHA-1 Hash
        </button>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">SHA-1 Hash (160-bit / 40 hex characters)</label>
            <button
              onClick={copyToClipboard}
              disabled={!hash}
              className="px-3 py-1 text-sm rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] disabled:opacity-50"
            >
              Copy
            </button>
          </div>
          <div className="px-4 py-3 rounded-lg bg-[var(--muted)] border border-[var(--border)] font-mono break-all min-h-[48px]">
            {hash || <span className="text-[var(--muted-foreground)]">Hash will appear here...</span>}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
