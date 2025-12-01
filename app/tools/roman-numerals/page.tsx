"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("roman-numerals")!;
const similarTools = getToolsByCategory("misc").filter(t => t.slug !== "roman-numerals");

const romanNumerals: [number, string][] = [
  [1000, "M"], [900, "CM"], [500, "D"], [400, "CD"],
  [100, "C"], [90, "XC"], [50, "L"], [40, "XL"],
  [10, "X"], [9, "IX"], [5, "V"], [4, "IV"], [1, "I"],
];

export default function RomanNumeralsPage() {
  const [arabicInput, setArabicInput] = useState("");
  const [romanInput, setRomanInput] = useState("");
  const [mode, setMode] = useState<"toRoman" | "toArabic">("toRoman");
  const [error, setError] = useState("");

  const toRoman = (num: number): string => {
    if (num < 1 || num > 3999) {
      return "Error: Number must be between 1 and 3999";
    }
    let result = "";
    let remaining = num;
    for (const [value, symbol] of romanNumerals) {
      while (remaining >= value) {
        result += symbol;
        remaining -= value;
      }
    }
    return result;
  };

  const toArabic = (roman: string): number | null => {
    const romanMap: Record<string, number> = {
      "I": 1, "V": 5, "X": 10, "L": 50,
      "C": 100, "D": 500, "M": 1000,
    };
    
    const upper = roman.toUpperCase().trim();
    if (!/^[IVXLCDM]+$/.test(upper)) {
      return null;
    }
    
    let result = 0;
    for (let i = 0; i < upper.length; i++) {
      const current = romanMap[upper[i]];
      const next = romanMap[upper[i + 1]];
      if (next && current < next) {
        result -= current;
      } else {
        result += current;
      }
    }
    return result;
  };

  const handleArabicChange = (value: string) => {
    setArabicInput(value);
    setError("");
    const num = parseInt(value);
    if (!value) {
      setRomanInput("");
    } else if (isNaN(num)) {
      setError("Please enter a valid number");
      setRomanInput("");
    } else if (num < 1 || num > 3999) {
      setError("Number must be between 1 and 3999");
      setRomanInput("");
    } else {
      setRomanInput(toRoman(num));
    }
  };

  const handleRomanChange = (value: string) => {
    setRomanInput(value.toUpperCase());
    setError("");
    if (!value) {
      setArabicInput("");
    } else {
      const result = toArabic(value);
      if (result === null) {
        setError("Invalid Roman numeral");
        setArabicInput("");
      } else {
        setArabicInput(result.toString());
      }
    }
  };

  const quickConvert = (num: number) => {
    setMode("toRoman");
    setArabicInput(num.toString());
    setRomanInput(toRoman(num));
    setError("");
  };

  const copyResult = async () => {
    const text = mode === "toRoman" ? romanInput : arabicInput;
    await navigator.clipboard.writeText(text);
  };

  const commonNumbers = [
    { arabic: 1, roman: "I" }, { arabic: 5, roman: "V" },
    { arabic: 10, roman: "X" }, { arabic: 50, roman: "L" },
    { arabic: 100, roman: "C" }, { arabic: 500, roman: "D" },
    { arabic: 1000, roman: "M" }, { arabic: 2024, roman: "MMXXIV" },
  ];

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setMode("toRoman")}
            className={`px-4 py-2 rounded-lg font-medium ${
              mode === "toRoman"
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "bg-[var(--muted)]"
            }`}
          >
            Number → Roman
          </button>
          <button
            onClick={() => setMode("toArabic")}
            className={`px-4 py-2 rounded-lg font-medium ${
              mode === "toArabic"
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "bg-[var(--muted)]"
            }`}
          >
            Roman → Number
          </button>
        </div>

        <div className="grid sm:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Arabic Number</label>
            <input
              type="number"
              value={arabicInput}
              onChange={(e) => handleArabicChange(e.target.value)}
              placeholder="Enter a number (1-3999)"
              min="1"
              max="3999"
              className="w-full px-4 py-4 text-2xl font-mono rounded-lg bg-[var(--background)] border border-[var(--border)]"
              disabled={mode === "toArabic"}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Roman Numeral</label>
            <input
              type="text"
              value={romanInput}
              onChange={(e) => handleRomanChange(e.target.value)}
              placeholder="Enter Roman numeral"
              className="w-full px-4 py-4 text-2xl font-mono rounded-lg bg-[var(--background)] border border-[var(--border)]"
              disabled={mode === "toRoman"}
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 rounded-lg p-3 text-sm">
            {error}
          </div>
        )}

        {(romanInput || arabicInput) && !error && (
          <div className="bg-[var(--muted)] rounded-xl p-6 text-center">
            <div className="text-sm text-[var(--muted-foreground)] mb-2">Result</div>
            <div className="text-4xl font-bold font-mono">
              {mode === "toRoman" ? romanInput : arabicInput}
            </div>
            <button
              onClick={copyResult}
              className="mt-4 px-4 py-2 rounded-lg bg-[var(--background)] hover:bg-[var(--accent)]"
            >
              📋 Copy Result
            </button>
          </div>
        )}

        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-4">📖 Roman Numeral Reference</h3>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
            {romanNumerals
              .filter(([_, symbol]) => symbol.length === 1)
              .map(([value, symbol]) => (
                <div
                  key={symbol}
                  className="bg-[var(--muted)] rounded-lg p-4 text-center cursor-pointer hover:bg-[var(--accent)]"
                  onClick={() => quickConvert(value)}
                >
                  <div className="text-3xl font-bold">{symbol}</div>
                  <div className="text-sm text-[var(--muted-foreground)]">{value}</div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-4">🎯 Quick Examples</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {commonNumbers.map(({ arabic, roman }) => (
              <button
                key={arabic}
                onClick={() => quickConvert(arabic)}
                className="bg-[var(--muted)] rounded-lg p-3 text-center hover:bg-[var(--accent)] transition-colors"
              >
                <div className="font-bold">{roman}</div>
                <div className="text-sm text-[var(--muted-foreground)]">= {arabic}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-4">📏 Conversion Rules</h3>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="bg-[var(--muted)] px-2 py-1 rounded font-mono">IV</span>
              <span>= 4 (5-1): I before V means subtract</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-[var(--muted)] px-2 py-1 rounded font-mono">IX</span>
              <span>= 9 (10-1): I before X means subtract</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-[var(--muted)] px-2 py-1 rounded font-mono">XL</span>
              <span>= 40 (50-10): X before L means subtract</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-[var(--muted)] px-2 py-1 rounded font-mono">XC</span>
              <span>= 90 (100-10): X before C means subtract</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-[var(--muted)] px-2 py-1 rounded font-mono">CD</span>
              <span>= 400 (500-100): C before D means subtract</span>
            </div>
            <div className="flex items-start gap-3">
              <span className="bg-[var(--muted)] px-2 py-1 rounded font-mono">CM</span>
              <span>= 900 (1000-100): C before M means subtract</span>
            </div>
          </div>
        </div>

        <div className="bg-[var(--muted)] rounded-xl p-4 text-sm text-[var(--muted-foreground)]">
          <p>💡 Roman numerals can only represent numbers from 1 to 3999. For larger numbers, various notation systems exist using bars over letters.</p>
        </div>
      </div>
    </ToolLayout>
  );
}
