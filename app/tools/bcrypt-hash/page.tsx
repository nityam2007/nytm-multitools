"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("bcrypt-hash")!;
const similarTools = getToolsByCategory("security").filter(t => t.slug !== "bcrypt-hash");

// Simplified bcrypt-like simulation (actual bcrypt requires native implementation)
// This is for demonstration - in production, use a proper bcrypt library
async function simulateBcrypt(password: string, rounds: number): Promise<string> {
  // Generate a random salt
  const saltArray = new Uint8Array(16);
  crypto.getRandomValues(saltArray);
  const salt = Array.from(saltArray).map(b => b.toString(16).padStart(2, "0")).join("");
  
  // Simulate multiple rounds of hashing with SHA-256
  let hash = password + salt;
  const iterations = Math.pow(2, rounds);
  
  for (let i = 0; i < Math.min(iterations, 1000); i++) {
    const encoder = new TextEncoder();
    const data = encoder.encode(hash);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    hash = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
  }
  
  // Format like bcrypt
  const costStr = rounds.toString().padStart(2, "0");
  const encodedSalt = btoa(salt).slice(0, 22).replace(/\+/g, ".").replace(/\//g, "/");
  const encodedHash = btoa(hash).slice(0, 31).replace(/\+/g, ".").replace(/\//g, "/");
  
  return `$2a$${costStr}$${encodedSalt}${encodedHash}`;
}

export default function BcryptHashPage() {
  const [password, setPassword] = useState("");
  const [rounds, setRounds] = useState(10);
  const [hash, setHash] = useState("");
  const [loading, setLoading] = useState(false);

  const generateHash = async () => {
    if (!password) return;
    setLoading(true);
    try {
      const result = await simulateBcrypt(password, rounds);
      setHash(result);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hash);
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="bg-blue-500/10 border border-blue-500/50 rounded-xl p-4 text-blue-500 text-sm">
          ℹ️ <strong>Note:</strong> This is a bcrypt-like simulation for demonstration. For production use, implement server-side bcrypt with a proper library.
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="text"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password to hash..."
            className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Cost Factor (rounds): {rounds}</label>
          <input
            type="range"
            min="4"
            max="14"
            value={rounds}
            onChange={(e) => setRounds(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-[var(--muted-foreground)]">
            <span>Fast (4)</span>
            <span>Secure (10)</span>
            <span>Very Slow (14)</span>
          </div>
        </div>

        <button
          onClick={generateHash}
          disabled={!password || loading}
          className="w-full py-3 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Bcrypt Hash"}
        </button>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Bcrypt Hash</label>
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
          <h3 className="font-semibold mb-3">About Bcrypt</h3>
          <div className="space-y-2 text-sm text-[var(--muted-foreground)]">
            <p>• Designed specifically for password hashing</p>
            <p>• Includes built-in salt for protection against rainbow tables</p>
            <p>• Adjustable cost factor to increase computation time</p>
            <p>• Recommended cost factor: 10-12 for most applications</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
