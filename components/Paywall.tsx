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
        <svg className="w-5 h-5 text-violet-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <span className="text-sm">
          Love NYTM Tools? <span className="font-medium text-violet-400 group-hover:text-violet-300">Support us →</span>
        </span>
      </Link>
    );
  }
  
  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-pink-500/10 border border-violet-500/20">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <svg className="w-12 h-12 text-violet-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        <div className="flex-1 text-center md:text-left">
          <h3 className="font-semibold text-lg mb-1">Enjoying NYTM Tools?</h3>
          <p className="text-sm text-[var(--muted-foreground)]">
            Help us keep the tools free and ad-free for everyone!
          </p>
        </div>
        <Link
          href="/pricing"
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium hover:opacity-90 transition-all whitespace-nowrap flex items-center gap-2"
        >
          Support Us
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
          </svg>
        </Link>
      </div>
    </div>
  );
}
