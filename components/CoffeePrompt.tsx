// Coffee Prompt | TypeScript
// Low-pressure, dismissible "buy me a coffee" nudge shown after a successful
// effort-saving operation. Static outbound link (Razorpay) — no tracking, no state.

"use client";

import { useState } from "react";
import { CloseIcon, HeartIcon } from "@/assets/icons";

const DONATION_URL = process.env.NEXT_PUBLIC_DONATION_URL || "";

// Rotated so repeat visitors don't tune it out. Index derived from a stable
// per-mount pick (no Math.random needed — length varies the copy enough).
const LINES = [
  "Saved you a step?",
  "This one do the trick?",
  "Handy? It stays free.",
  "Worth a coffee?",
  "Glad that worked.",
];

export function CoffeePrompt() {
  const [dismissed, setDismissed] = useState(false);

  // ponytail: pick line by mount time via useState initializer, not Math.random
  const [line] = useState(() => LINES[Math.floor(Date.now() / 1000) % LINES.length]);

  if (!DONATION_URL || dismissed) return null;

  return (
    <div className="flex items-center gap-2 text-xs text-[var(--muted-foreground)] animate-fade-slide-up">
      <HeartIcon className="w-3.5 h-3.5 text-pink-500 flex-shrink-0" />
      <span>{line}</span>
      <a
        href={DONATION_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="font-medium text-violet-400 hover:text-violet-300 transition-colors underline underline-offset-2"
      >
        Buy me a coffee
      </a>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="ml-auto text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors"
      >
        <CloseIcon className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}
