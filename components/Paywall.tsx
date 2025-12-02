"use client";

import Link from "next/link";

// Simple Support Banner - shown optionally on pages
export function SupportBanner({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <Link 
        href="/pricing"
        className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 hover:border-violet-500/40 transition-all group"
      >
        <span className="text-lg">💜</span>
        <span className="text-sm">
          Love NYTM Tools? <span className="font-medium text-violet-400 group-hover:text-violet-300">Support us →</span>
        </span>
      </Link>
    );
  }
  
  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-pink-500/10 border border-violet-500/20">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="text-4xl">💜</div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="font-semibold text-lg mb-1">Enjoying NYTM Tools?</h3>
          <p className="text-sm text-[var(--muted-foreground)]">
            Help us keep the tools free and ad-free for everyone!
          </p>
        </div>
        <Link
          href="/pricing"
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium hover:opacity-90 transition-all whitespace-nowrap"
        >
          Support Us ✨
        </Link>
      </div>
    </div>
  );
}
