"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("sha256-hash")!;
const similarTools = getToolsByCategory("security").filter(t => t.slug !== "sha256-hash");

async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

export default function SHA256HashPage() {
  const [input, setInput] = useState("");
  const [hash, setHash] = useState("");
  const [uppercase, setUppercase] = useState(false);

  const generateHash = async () => {
    const result = await sha256(input);
    setHash(uppercase ? result.toUpperCase() : result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hash);
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
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
          Generate SHA-256 Hash
        </button>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">SHA-256 Hash (256-bit / 64 hex characters)</label>
            <button
              onClick={copyToClipboard}
              disabled={!hash}
              className="px-3 py-1 text-sm rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] disabled:opacity-50"
            >
              Copy
            </button>
          </div>
          <div className="px-4 py-3 rounded-lg bg-[var(--muted)] border border-[var(--border)] font-mono break-all min-h-[48px] text-sm">
            {hash || <span className="text-[var(--muted-foreground)]">Hash will appear here...</span>}
          </div>
        </div>

        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-3">About SHA-256</h3>
          <div className="space-y-2 text-sm text-[var(--muted-foreground)]">
            <p>• Part of the SHA-2 family, designed by the NSA</p>
            <p>• Produces a 256-bit (32-byte) hash value</p>
            <p>• Currently considered cryptographically secure</p>
            <p>• Used in Bitcoin, SSL certificates, and many security protocols</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
