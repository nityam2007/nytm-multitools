"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("password-generator")!;
const similarTools = getToolsByCategory("generator").filter(t => t.slug !== "password-generator");

export default function PasswordGeneratorPage() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState(16);
  const [options, setOptions] = useState({
    uppercase: true,
    lowercase: true,
    numbers: true,
    symbols: true,
    excludeSimilar: false,
    excludeAmbiguous: false,
  });
  const [copied, setCopied] = useState(false);

  const generatePassword = useCallback(async () => {
    let chars = "";
    const startTime = Date.now();

    if (options.lowercase) chars += "abcdefghijklmnopqrstuvwxyz";
    if (options.uppercase) chars += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (options.numbers) chars += "0123456789";
    if (options.symbols) chars += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (options.excludeSimilar) {
      chars = chars.replace(/[ilLI|`oO0]/g, "");
    }
    if (options.excludeAmbiguous) {
      chars = chars.replace(/[{}[\]()/\\'"~,;.<>]/g, "");
    }

    if (!chars) {
      setPassword("");
      return;
    }

    let result = "";
    const array = new Uint32Array(length);
    crypto.getRandomValues(array);
    
    for (let i = 0; i < length; i++) {
      result += chars[array[i] % chars.length];
    }

    setPassword(result);

    await logToolUsage({
      toolName: tool.name,
      toolCategory: tool.category,
      inputType: "none",
      outputResult: `[PASSWORD ${length} chars]`,
      processingDuration: Date.now() - startTime,
      metadata: { length, ...options },
    });
  }, [length, options]);

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPasswordStrength = (): { label: string; color: string; percentage: number } => {
    if (!password) return { label: "N/A", color: "gray", percentage: 0 };
    
    let score = 0;
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^a-zA-Z0-9]/.test(password)) score += 1;

    if (score <= 2) return { label: "Weak", color: "#ef4444", percentage: 25 };
    if (score <= 4) return { label: "Fair", color: "#f59e0b", percentage: 50 };
    if (score <= 5) return { label: "Good", color: "#22c55e", percentage: 75 };
    return { label: "Strong", color: "#10b981", percentage: 100 };
  };

  const strength = getPasswordStrength();

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        {/* Generated Password */}
        <div>
          <label className="block text-sm font-medium mb-2">Generated Password</label>
          <div className="flex gap-2">
            <div className="flex-1 p-4 bg-[var(--muted)] rounded-lg font-mono text-lg break-all min-h-[56px] flex items-center">
              {password || <span className="text-[var(--muted-foreground)]">Click generate to create a password</span>}
            </div>
            {password && (
              <button
                onClick={copyToClipboard}
                className="btn btn-secondary"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            )}
          </div>
          
          {/* Strength Indicator */}
          {password && (
            <div className="mt-2">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-[var(--muted-foreground)]">Strength</span>
                <span style={{ color: strength.color }}>{strength.label}</span>
              </div>
              <div className="h-2 bg-[var(--muted)] rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${strength.percentage}%`, backgroundColor: strength.color }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Length Slider */}
        <div>
          <div className="flex justify-between mb-2">
            <label className="text-sm font-medium">Password Length</label>
            <span className="text-sm font-mono">{length}</span>
          </div>
          <input
            type="range"
            min="4"
            max="64"
            value={length}
            onChange={(e) => setLength(parseInt(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-[var(--muted-foreground)]">
            <span>4</span>
            <span>64</span>
          </div>
        </div>

        {/* Character Options */}
        <div>
          <label className="block text-sm font-medium mb-3">Character Types</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { key: "uppercase", label: "Uppercase (A-Z)" },
              { key: "lowercase", label: "Lowercase (a-z)" },
              { key: "numbers", label: "Numbers (0-9)" },
              { key: "symbols", label: "Symbols (!@#$...)" },
              { key: "excludeSimilar", label: "Exclude Similar (il1Lo0O)" },
              { key: "excludeAmbiguous", label: "Exclude Ambiguous ({}[]()...)" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options[key as keyof typeof options]}
                  onChange={(e) =>
                    setOptions((prev) => ({ ...prev, [key]: e.target.checked }))
                  }
                  className="w-4 h-4 rounded"
                />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={generatePassword}
          disabled={!options.uppercase && !options.lowercase && !options.numbers && !options.symbols}
          className="btn btn-primary w-full py-3"
        >
          Generate Password
        </button>
      </div>
    </ToolLayout>
  );
}
