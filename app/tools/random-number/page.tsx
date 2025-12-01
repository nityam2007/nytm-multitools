"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("random-number")!;
const similarTools = getToolsByCategory("generator").filter(t => t.slug !== "random-number");

export default function RandomNumberPage() {
  const [min, setMin] = useState(1);
  const [max, setMax] = useState(100);
  const [count, setCount] = useState(1);
  const [unique, setUnique] = useState(true);
  const [sorted, setSorted] = useState(false);
  const [results, setResults] = useState<number[]>([]);

  const generate = () => {
    const numbers: number[] = [];
    const range = max - min + 1;
    
    if (unique && count > range) {
      alert(`Cannot generate ${count} unique numbers in range ${min}-${max}`);
      return;
    }
    
    if (unique) {
      const available = Array.from({ length: range }, (_, i) => min + i);
      for (let i = 0; i < count; i++) {
        const idx = Math.floor(Math.random() * available.length);
        numbers.push(available[idx]);
        available.splice(idx, 1);
      }
    } else {
      for (let i = 0; i < count; i++) {
        numbers.push(Math.floor(Math.random() * range) + min);
      }
    }
    
    if (sorted) {
      numbers.sort((a, b) => a - b);
    }
    
    setResults(numbers);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(results.join(", "));
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="grid sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Minimum</label>
            <input
              type="number"
              value={min}
              onChange={(e) => setMin(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Maximum</label>
            <input
              type="number"
              value={max}
              onChange={(e) => setMax(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Count</label>
            <input
              type="number"
              min="1"
              max="1000"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={unique}
              onChange={(e) => setUnique(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Unique numbers only</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={sorted}
              onChange={(e) => setSorted(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Sort results</span>
          </label>
        </div>

        <button
          onClick={generate}
          className="w-full py-3 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-medium hover:opacity-90 transition-opacity"
        >
          🎲 Generate Random Numbers
        </button>

        {results.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Results ({results.length})</label>
              <button
                onClick={copyToClipboard}
                className="px-3 py-1 text-sm rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)]"
              >
                Copy
              </button>
            </div>
            {results.length === 1 ? (
              <div className="text-center py-8 bg-[var(--muted)] rounded-xl">
                <div className="text-6xl font-bold text-[var(--primary)]">{results[0]}</div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2 p-4 bg-[var(--muted)] rounded-xl max-h-64 overflow-y-auto">
                {results.map((num, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 bg-[var(--background)] rounded-lg font-mono"
                  >
                    {num}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-3">Quick Presets</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "1-10", min: 1, max: 10 },
              { label: "1-100", min: 1, max: 100 },
              { label: "1-1000", min: 1, max: 1000 },
              { label: "Dice (1-6)", min: 1, max: 6 },
              { label: "Coin Flip", min: 0, max: 1 },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => { setMin(preset.min); setMax(preset.max); }}
                className="px-3 py-1 text-sm rounded-lg bg-[var(--muted)] hover:bg-[var(--accent)] transition-colors"
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
