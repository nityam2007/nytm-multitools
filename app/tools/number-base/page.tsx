"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("number-base")!;
const similarTools = getToolsByCategory("converter").filter(t => t.slug !== "number-base");

type Base = "binary" | "octal" | "decimal" | "hex";

const bases: Record<Base, { radix: number; prefix: string; label: string }> = {
  binary: { radix: 2, prefix: "0b", label: "Binary (Base 2)" },
  octal: { radix: 8, prefix: "0o", label: "Octal (Base 8)" },
  decimal: { radix: 10, prefix: "", label: "Decimal (Base 10)" },
  hex: { radix: 16, prefix: "0x", label: "Hexadecimal (Base 16)" },
};

export default function NumberBasePage() {
  const [input, setInput] = useState("255");
  const [inputBase, setInputBase] = useState<Base>("decimal");

  const convert = (toBase: Base): string => {
    if (!input.trim()) return "";
    
    try {
      // Remove any prefix
      let cleanInput = input.trim().toLowerCase();
      cleanInput = cleanInput.replace(/^(0b|0o|0x)/, "");
      
      // Parse the number
      const num = parseInt(cleanInput, bases[inputBase].radix);
      if (isNaN(num)) return "Invalid";
      
      // Convert to target base
      return bases[toBase].prefix + num.toString(bases[toBase].radix).toUpperCase();
    } catch {
      return "Invalid";
    }
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Input Base</label>
          <div className="flex flex-wrap gap-2">
            {(Object.keys(bases) as Base[]).map((base) => (
              <button
                key={base}
                onClick={() => setInputBase(base)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  inputBase === base
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "bg-[var(--muted)] hover:bg-[var(--accent)]"
                }`}
              >
                {bases[base].label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Input Number</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter a number..."
            className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)] font-mono text-xl"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(Object.keys(bases) as Base[]).map((base) => (
            <div key={base} className="bg-[var(--muted)] rounded-xl p-4">
              <div className="text-sm text-[var(--muted-foreground)] mb-1">{bases[base].label}</div>
              <div className="font-mono text-lg break-all flex items-center justify-between gap-2">
                <span>{convert(base)}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(convert(base))}
                  className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)] shrink-0"
                >
                  Copy
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[var(--muted)]/50 rounded-xl p-4 text-sm">
          <h3 className="font-semibold mb-2">Quick Reference</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-[var(--muted-foreground)]">
            <div>Binary: 0, 1</div>
            <div>Octal: 0-7</div>
            <div>Decimal: 0-9</div>
            <div>Hex: 0-9, A-F</div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
