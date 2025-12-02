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
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25 transition-all duration-300 group-hover:scale-105 group-hover:shadow-violet-500/40">
              <span className="text-white font-bold text-sm">N</span>
            </div>
            <span className="font-bold text-lg tracking-tight">
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
          <div className="flex items-center gap-3">
            {/* Support Badge - Desktop */}
            <Link
              href="/pricing"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 hover:border-violet-500/40 transition-all text-sm group"
            >
              <span>💜</span>
              <span className="text-violet-400 group-hover:text-violet-300 font-medium">Support</span>
            </Link>

            {/* Theme Toggle */}
            <button
              onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
              className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-violet-500/10 transition-all duration-300 group"
              aria-label="Toggle theme"
            >
              {resolvedTheme === "dark" ? (
                <SunIcon className="w-5 h-5 transition-transform duration-300 group-hover:rotate-45 group-hover:text-violet-400" />
              ) : (
                <MoonIcon className="w-5 h-5 transition-transform duration-300 group-hover:-rotate-12 group-hover:text-violet-400" />
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl hover:bg-violet-500/10 transition-all duration-300"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? (
                <CloseIcon className="w-5 h-5" />
              ) : (
                <MenuIcon className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[var(--border)] bg-[var(--background)]/95 backdrop-blur-xl animate-fade-slide-up" style={{ animationDuration: '0.2s' }}>
          <nav className="px-6 py-5 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-3 px-4 rounded-xl text-[var(--muted-foreground)] hover:text-violet-400 hover:bg-violet-500/10 transition-all duration-300 font-medium"
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-[var(--border)]">
              <Link
                href="/pricing"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20"
              >
                <span>💜</span>
                <span className="text-violet-400 font-medium">Support Us</span>
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
