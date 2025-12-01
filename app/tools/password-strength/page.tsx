"use client";

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("password-strength")!;
const similarTools = getToolsByCategory("security").filter(t => t.slug !== "password-strength");

interface StrengthResult {
  score: number;
  label: string;
  color: string;
  feedback: string[];
  crackTime: string;
}

function analyzePassword(password: string): StrengthResult {
  if (!password) {
    return { score: 0, label: "Empty", color: "gray", feedback: [], crackTime: "Instant" };
  }
  
  const checks = {
    length: password.length,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    numbers: /[0-9]/.test(password),
    symbols: /[^a-zA-Z0-9]/.test(password),
    noRepeating: !/(.)\1{2,}/.test(password),
    noSequential: !/(?:abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz|012|123|234|345|456|567|678|789)/i.test(password),
  };
  
  const feedback: string[] = [];
  let score = 0;
  
  // Length scoring
  if (checks.length < 8) {
    feedback.push("Password should be at least 8 characters");
  } else if (checks.length < 12) {
    score += 1;
    feedback.push("Consider using 12+ characters");
  } else if (checks.length < 16) {
    score += 2;
  } else {
    score += 3;
  }
  
  // Character variety
  if (!checks.lowercase) feedback.push("Add lowercase letters");
  else score += 1;
  
  if (!checks.uppercase) feedback.push("Add uppercase letters");
  else score += 1;
  
  if (!checks.numbers) feedback.push("Add numbers");
  else score += 1;
  
  if (!checks.symbols) feedback.push("Add special characters (!@#$%...)");
  else score += 2;
  
  // Pattern checks
  if (!checks.noRepeating) {
    feedback.push("Avoid repeating characters (aaa, 111)");
    score -= 1;
  }
  
  if (!checks.noSequential) {
    feedback.push("Avoid sequential patterns (abc, 123)");
    score -= 1;
  }
  
  // Common password check (simplified)
  const common = ["password", "123456", "qwerty", "admin", "letmein", "welcome", "monkey"];
  if (common.some(c => password.toLowerCase().includes(c))) {
    feedback.push("Avoid common words");
    score -= 2;
  }
  
  // Normalize score
  score = Math.max(0, Math.min(10, score));
  
  // Determine label and color
  let label: string, color: string;
  if (score <= 2) { label = "Very Weak"; color = "#ef4444"; }
  else if (score <= 4) { label = "Weak"; color = "#f97316"; }
  else if (score <= 6) { label = "Fair"; color = "#eab308"; }
  else if (score <= 8) { label = "Strong"; color = "#22c55e"; }
  else { label = "Very Strong"; color = "#10b981"; }
  
  // Estimate crack time (simplified)
  const charsetSize = (checks.lowercase ? 26 : 0) + (checks.uppercase ? 26 : 0) + 
                      (checks.numbers ? 10 : 0) + (checks.symbols ? 32 : 0);
  const combinations = Math.pow(charsetSize || 1, password.length);
  const guessesPerSecond = 10_000_000_000; // 10 billion (modern GPU)
  const seconds = combinations / guessesPerSecond;
  
  let crackTime: string;
  if (seconds < 1) crackTime = "Instant";
  else if (seconds < 60) crackTime = `${Math.round(seconds)} seconds`;
  else if (seconds < 3600) crackTime = `${Math.round(seconds / 60)} minutes`;
  else if (seconds < 86400) crackTime = `${Math.round(seconds / 3600)} hours`;
  else if (seconds < 31536000) crackTime = `${Math.round(seconds / 86400)} days`;
  else if (seconds < 31536000 * 1000) crackTime = `${Math.round(seconds / 31536000)} years`;
  else crackTime = "Millions of years";
  
  return { score, label, color, feedback, crackTime };
}

export default function PasswordStrengthPage() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [result, setResult] = useState<StrengthResult>(analyzePassword(""));

  useEffect(() => {
    setResult(analyzePassword(password));
  }, [password]);

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password to check..."
              className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)] pr-20"
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--muted-foreground)]"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        <div>
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">Strength</span>
            <span className="text-sm font-bold" style={{ color: result.color }}>{result.label}</span>
          </div>
          <div className="h-3 bg-[var(--muted)] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-300"
              style={{
                width: `${result.score * 10}%`,
                backgroundColor: result.color,
              }}
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div className="bg-[var(--muted)] rounded-xl p-4">
            <div className="text-sm text-[var(--muted-foreground)]">Score</div>
            <div className="text-3xl font-bold" style={{ color: result.color }}>{result.score}/10</div>
          </div>
          <div className="bg-[var(--muted)] rounded-xl p-4">
            <div className="text-sm text-[var(--muted-foreground)]">Estimated Crack Time</div>
            <div className="text-xl font-bold">{result.crackTime}</div>
          </div>
        </div>

        {result.feedback.length > 0 && (
          <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
            <h3 className="font-semibold mb-3">Suggestions</h3>
            <ul className="space-y-2">
              {result.feedback.map((f, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="text-yellow-500">⚠️</span>
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div className={`p-3 rounded-lg text-center ${/[a-z]/.test(password) ? "bg-green-500/20 text-green-500" : "bg-[var(--muted)]"}`}>
            <div className="text-lg">{/[a-z]/.test(password) ? "✓" : "○"}</div>
            <div>Lowercase</div>
          </div>
          <div className={`p-3 rounded-lg text-center ${/[A-Z]/.test(password) ? "bg-green-500/20 text-green-500" : "bg-[var(--muted)]"}`}>
            <div className="text-lg">{/[A-Z]/.test(password) ? "✓" : "○"}</div>
            <div>Uppercase</div>
          </div>
          <div className={`p-3 rounded-lg text-center ${/[0-9]/.test(password) ? "bg-green-500/20 text-green-500" : "bg-[var(--muted)]"}`}>
            <div className="text-lg">{/[0-9]/.test(password) ? "✓" : "○"}</div>
            <div>Numbers</div>
          </div>
          <div className={`p-3 rounded-lg text-center ${/[^a-zA-Z0-9]/.test(password) ? "bg-green-500/20 text-green-500" : "bg-[var(--muted)]"}`}>
            <div className="text-lg">{/[^a-zA-Z0-9]/.test(password) ? "✓" : "○"}</div>
            <div>Symbols</div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
