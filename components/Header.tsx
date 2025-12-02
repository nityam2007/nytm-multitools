"use client";

import Link from "next/link";
import { useState } from "react";
import { useTheme } from "./ThemeProvider";
import { SunIcon, MoonIcon, MenuIcon, CloseIcon } from "@/assets/icons";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { setTheme, resolvedTheme } = useTheme();

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/tools", label: "Tools" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
  ];

  return (
    <header className="sticky top-0 z-50 bg-[var(--background)]/80 backdrop-blur-2xl backdrop-saturate-150 border-b border-[var(--border)]/50 shadow-sm shadow-black/5">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
            <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25 transition-all duration-300 group-hover:scale-105 group-hover:shadow-violet-500/40">
              <span className="text-white font-bold text-xs sm:text-sm">N</span>
            </div>
            <span className="font-bold text-base sm:text-lg tracking-tight">
              <span className="gradient-text">NYTM</span>
            </span>
          </Link>

          {/* Desktop Navigation - Center */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="px-4 py-2 text-sm text-[var(--muted-foreground)] hover:text-violet-400 transition-all duration-300 rounded-xl hover:bg-violet-500/10 font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Right Section */}
          <div className="flex items-center gap-1 sm:gap-3">
            {/* Support Badge - Desktop */}
            <Link
              href="/pricing"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 hover:border-violet-500/40 transition-all text-sm group"
            >
              <svg className="w-4 h-4 text-violet-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
              <span className="text-violet-400 group-hover:text-violet-300 font-medium">Support</span>
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg sm:rounded-xl hover:bg-violet-500/10 transition-all duration-300 group active:scale-95"
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? (
                <SunIcon className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:rotate-45 group-hover:text-violet-400" />
              ) : (
                <MoonIcon className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:-rotate-12 group-hover:text-violet-400" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg sm:rounded-xl hover:bg-violet-500/10 transition-all duration-300 active:scale-95"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <CloseIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              ) : (
                <MenuIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-xl animate-fade-slide-up" style={{ animationDuration: '0.2s' }}>
          <nav className="px-3 sm:px-6 py-4 sm:py-5 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 px-4 rounded-xl text-[var(--muted-foreground)] hover:text-violet-400 hover:bg-violet-500/10 transition-all duration-300 font-medium text-sm sm:text-base active:scale-[0.98]"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 sm:pt-4 mt-3 sm:mt-4 border-t border-[var(--border)]">
              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 active:scale-[0.98] transition-transform"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 text-violet-500" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                </svg>
                <span className="text-violet-400 font-medium text-sm sm:text-base">Support Us</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
