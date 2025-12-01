"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("hash-identifier")!;
const similarTools = getToolsByCategory("security").filter(t => t.slug !== "hash-identifier");

interface HashType {
  name: string;
  length: number;
  pattern: RegExp;
  description: string;
}

const hashTypes: HashType[] = [
  { name: "MD5", length: 32, pattern: /^[a-f0-9]{32}$/i, description: "128-bit hash, commonly used but insecure" },
  { name: "SHA-1", length: 40, pattern: /^[a-f0-9]{40}$/i, description: "160-bit hash, deprecated for security use" },
  { name: "SHA-224", length: 56, pattern: /^[a-f0-9]{56}$/i, description: "224-bit truncated SHA-256" },
  { name: "SHA-256", length: 64, pattern: /^[a-f0-9]{64}$/i, description: "256-bit SHA-2 hash, widely used" },
  { name: "SHA-384", length: 96, pattern: /^[a-f0-9]{96}$/i, description: "384-bit truncated SHA-512" },
  { name: "SHA-512", length: 128, pattern: /^[a-f0-9]{128}$/i, description: "512-bit SHA-2 hash, strongest" },
  { name: "RIPEMD-160", length: 40, pattern: /^[a-f0-9]{40}$/i, description: "160-bit hash, used in Bitcoin" },
  { name: "CRC32", length: 8, pattern: /^[a-f0-9]{8}$/i, description: "32-bit checksum, not cryptographic" },
  { name: "Bcrypt", length: 60, pattern: /^\$2[aby]?\$\d{2}\$.{53}$/, description: "Password hashing with salt" },
  { name: "Argon2", length: 0, pattern: /^\$argon2(i|d|id)\$/, description: "Modern password hashing" },
  { name: "NTLM", length: 32, pattern: /^[a-f0-9]{32}$/i, description: "Windows NT hash" },
  { name: "MySQL (OLD)", length: 16, pattern: /^[a-f0-9]{16}$/i, description: "MySQL 4.x password hash" },
  { name: "MySQL5", length: 40, pattern: /^\*[A-F0-9]{40}$/, description: "MySQL 5.x password hash" },
];

export default function HashIdentifierPage() {
  const [hash, setHash] = useState("");
  const [matches, setMatches] = useState<HashType[]>([]);

  const identify = () => {
    const cleanHash = hash.trim();
    const identified: HashType[] = [];
    
    for (const type of hashTypes) {
      if (type.pattern.test(cleanHash)) {
        identified.push(type);
      }
    }
    
    // Sort by likelihood (exact length match first)
    identified.sort((a, b) => {
      const aExact = a.length === cleanHash.length ? 1 : 0;
      const bExact = b.length === cleanHash.length ? 1 : 0;
      return bExact - aExact;
    });
    
    setMatches(identified);
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Hash to Identify</label>
          <textarea
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            placeholder="Paste a hash to identify its type..."
            className="w-full h-24 px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)] resize-none font-mono"
          />
        </div>

        <button
          onClick={identify}
          disabled={!hash.trim()}
          className="w-full py-3 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          🔍 Identify Hash Type
        </button>

        {hash.trim() && (
          <div className="bg-[var(--muted)] rounded-xl p-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[var(--muted-foreground)]">Length:</span>
                <span className="ml-2 font-mono">{hash.trim().length}</span>
              </div>
              <div>
                <span className="text-[var(--muted-foreground)]">Hex only:</span>
                <span className="ml-2">{/^[a-f0-9]+$/i.test(hash.trim()) ? "Yes" : "No"}</span>
              </div>
            </div>
          </div>
        )}

        {matches.length > 0 ? (
          <div className="space-y-3">
            <h3 className="font-semibold">Possible Hash Types ({matches.length})</h3>
            {matches.map((type, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-xl border ${
                  idx === 0
                    ? "bg-green-500/10 border-green-500/50"
                    : "bg-[var(--card)] border-[var(--border)]"
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-semibold flex items-center gap-2">
                      {type.name}
                      {idx === 0 && <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded">Most Likely</span>}
                    </div>
                    <div className="text-sm text-[var(--muted-foreground)]">{type.description}</div>
                  </div>
                  <div className="text-sm font-mono text-[var(--muted-foreground)]">
                    {type.length > 0 ? `${type.length} chars` : "Variable"}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : hash.trim() && (
          <div className="p-6 rounded-xl bg-yellow-500/10 border border-yellow-500/50 text-center">
            <div className="text-2xl mb-2">🤔</div>
            <div className="font-semibold text-yellow-500">Unknown Hash Type</div>
            <div className="text-sm text-[var(--muted-foreground)]">
              The hash doesn&apos;t match any known patterns
            </div>
          </div>
        )}

        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-3">Common Hash Lengths</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
            {[
              { name: "MD5", len: 32 },
              { name: "SHA-1", len: 40 },
              { name: "SHA-256", len: 64 },
              { name: "SHA-384", len: 96 },
              { name: "SHA-512", len: 128 },
              { name: "Bcrypt", len: 60 },
            ].map(h => (
              <div key={h.name} className="flex justify-between p-2 bg-[var(--muted)] rounded">
                <span>{h.name}</span>
                <span className="font-mono text-[var(--muted-foreground)]">{h.len}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
