"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("bcrypt-verify")!;
const similarTools = getToolsByCategory("security").filter(t => t.slug !== "bcrypt-verify");

export default function BcryptVerifyPage() {
  const [password, setPassword] = useState("");
  const [hash, setHash] = useState("");
  const [result, setResult] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);

  const verifyHash = async () => {
    if (!password || !hash) return;
    setLoading(true);
    
    // Simulate verification delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Check if hash looks like bcrypt format
    const bcryptPattern = /^\$2[aby]?\$\d{2}\$.{53}$/;
    const isValidFormat = bcryptPattern.test(hash);
    
    // For demo purposes, we can't actually verify bcrypt client-side
    // This would need to be done server-side with a proper bcrypt library
    setResult(isValidFormat ? null : false);
    setLoading(false);
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="bg-blue-500/10 border border-blue-500/50 rounded-xl p-4 text-blue-500 text-sm flex items-start gap-3">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span><strong>Note:</strong> Bcrypt verification requires server-side implementation. This tool validates the hash format only.</span>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <input
            type="text"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setResult(null); }}
            placeholder="Enter password to verify..."
            className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Bcrypt Hash</label>
          <textarea
            value={hash}
            onChange={(e) => { setHash(e.target.value); setResult(null); }}
            placeholder="Paste bcrypt hash (starts with $2a$, $2b$, or $2y$)..."
            className="w-full h-24 px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)] resize-none font-mono text-sm"
          />
        </div>

        <button
          onClick={verifyHash}
          disabled={!password || !hash || loading}
          className="w-full py-3 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Verifying..." : "Verify Password"}
        </button>

        {result !== null && (
          <div className={`p-4 rounded-xl border ${
            result 
              ? "bg-green-500/10 border-green-500/50 text-green-500"
              : "bg-red-500/10 border-red-500/50 text-red-500"
          }`}>
            <div className="text-center">
              <div className="flex justify-center mb-2">
                {result ? (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <div className="font-semibold">
                {result ? "Password matches!" : "Invalid hash format"}
              </div>
            </div>
          </div>
        )}

        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-3">Bcrypt Hash Format</h3>
          <div className="space-y-2 text-sm font-mono">
            <div className="p-3 bg-[var(--muted)] rounded-lg break-all">
              $2a$10$N9qo8uLOickgx2ZMRZoMy.MqrqZqc2tLpS7yrKnZRk0ukn3TyQ0vC
            </div>
            <div className="text-[var(--muted-foreground)] text-xs space-y-1 pt-2">
              <div>• $2a$ - Algorithm identifier (2a, 2b, or 2y)</div>
              <div>• 10 - Cost factor</div>
              <div>• Next 22 chars - Salt</div>
              <div>• Last 31 chars - Hash</div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
