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
              className="mt-4 px-4 py-2 rounded-lg bg-[var(--background)] hover:bg-[var(--accent)] flex items-center gap-2 mx-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              Copy Result
            </button>
          </div>
        )}

        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Roman Numeral Reference
          </h3>
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
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Quick Examples
          </h3>
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
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
            </svg>
            Conversion Rules
          </h3>
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
          <p className="flex items-start gap-2">
            <svg className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Roman numerals can only represent numbers from 1 to 3999. For larger numbers, various notation systems exist using bars over letters.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
