"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("random-string")!;
const similarTools = getToolsByCategory("generator").filter(t => t.slug !== "random-string");

const charsets = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()_+-=[]{}|;:,.<>?",
  similar: "il1Lo0O",
  ambiguous: "{}[]()/\\'\"`~,;:.<>",
};

export default function RandomStringPage() {
  const [length, setLength] = useState(16);
  const [count, setCount] = useState(5);
  const [includeLower, setIncludeLower] = useState(true);
  const [includeUpper, setIncludeUpper] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(false);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [results, setResults] = useState<string[]>([]);

  const generate = () => {
    let charset = "";
    if (includeLower) charset += charsets.lowercase;
    if (includeUpper) charset += charsets.uppercase;
    if (includeNumbers) charset += charsets.numbers;
    if (includeSymbols) charset += charsets.symbols;
    
    if (excludeSimilar) {
      charset = charset.split("").filter(c => !charsets.similar.includes(c)).join("");
    }
    
    if (!charset) {
      alert("Please select at least one character set");
      return;
    }
    
    const strings: string[] = [];
    for (let i = 0; i < count; i++) {
      let str = "";
      for (let j = 0; j < length; j++) {
        str += charset[Math.floor(Math.random() * charset.length)];
      }
      strings.push(str);
    }
    
    setResults(strings);
  };

  const copyToClipboard = (str: string) => {
    navigator.clipboard.writeText(str);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(results.join("\n"));
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Length</label>
            <input
              type="number"
              min="1"
              max="256"
              value={length}
              onChange={(e) => setLength(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Count</label>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            />
          </div>
        </div>

        <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
          <h3 className="font-semibold mb-3">Character Sets</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={includeLower} onChange={(e) => setIncludeLower(e.target.checked)} className="w-4 h-4" />
              <span className="text-sm">Lowercase (a-z)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={includeUpper} onChange={(e) => setIncludeUpper(e.target.checked)} className="w-4 h-4" />
              <span className="text-sm">Uppercase (A-Z)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={includeNumbers} onChange={(e) => setIncludeNumbers(e.target.checked)} className="w-4 h-4" />
              <span className="text-sm">Numbers (0-9)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={includeSymbols} onChange={(e) => setIncludeSymbols(e.target.checked)} className="w-4 h-4" />
              <span className="text-sm">Symbols (!@#$...)</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer sm:col-span-2">
              <input type="checkbox" checked={excludeSimilar} onChange={(e) => setExcludeSimilar(e.target.checked)} className="w-4 h-4" />
              <span className="text-sm">Exclude similar characters (i, l, 1, L, o, 0, O)</span>
            </label>
          </div>
        </div>

        <button
          onClick={generate}
          className="w-full py-3 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          Generate Random Strings
        </button>

        {results.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Results</label>
              <button
                onClick={copyAll}
                className="px-3 py-1 text-sm rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)]"
              >
                Copy All
              </button>
            </div>
            <div className="space-y-2">
              {results.map((str, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-3 bg-[var(--muted)] rounded-lg"
                >
                  <code className="flex-1 font-mono text-sm break-all">{str}</code>
                  <button
                    onClick={() => copyToClipboard(str)}
                    className="px-2 py-1 text-xs rounded bg-[var(--background)] hover:bg-[var(--accent)] transition-colors"
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-[var(--muted)] rounded-xl p-6">
          <h3 className="font-semibold mb-3">Quick Presets</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "Password (16)", length: 16, symbols: true },
              { label: "API Key (32)", length: 32, symbols: false },
              { label: "Short ID (8)", length: 8, symbols: false },
              { label: "Token (64)", length: 64, symbols: false },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => { 
                  setLength(preset.length); 
                  setIncludeSymbols(preset.symbols);
                }}
                className="px-3 py-1 text-sm rounded-lg bg-[var(--background)] hover:bg-[var(--accent)] transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
