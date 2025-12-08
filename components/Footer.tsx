"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { GitHubIcon } from "@/assets/icons";
import { SITE_TAGLINE } from "@/lib/site-config";

export function Footer() {
  const [currentYear, setCurrentYear] = useState(2025);

  useEffect(() => {
    setCurrentYear(new Date().getFullYear());
  }, []);

  const footerSections = [
    {
      title: "Tools",
      links: [
        { href: "/tools?category=text", label: "Text Tools" },
        { href: "/tools?category=dev", label: "Developer" },
        { href: "/tools?category=image", label: "Image" },
        { href: "/tools?category=converter", label: "Converters" },
        { href: "/tools?category=generator", label: "Generators" },
      ],
    },
    {
      title: "Popular",
      links: [
        { href: "/tools/json-pretty", label: "JSON Formatter" },
        { href: "/tools/base64-encode", label: "Base64 Encode" },
        { href: "/tools/password-generator", label: "Password Gen" },
        { href: "/tools/hash-generator", label: "Hash Generator" },
        { href: "/tools/uuid-generator", label: "UUID Generator" },
      ],
    },
    {
      title: "Company",
      links: [
        { href: "/about", label: "About" },
        { href: "/contact", label: "Contact" },
        { href: "/pricing", label: "Donate" },
        { href: "/privacy", label: "Privacy" },
        { href: "/terms", label: "Terms" },
      ],
    },
  ];

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--background)] mt-auto">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        {/* Main Footer */}
        <div className="py-10 sm:py-12 md:py-16 lg:py-20">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 md:gap-10 lg:gap-16">
            {/* Brand Column */}
            <div className="col-span-2 sm:col-span-2 md:col-span-1 mb-4 sm:mb-0">
              <Link href="/" className="inline-flex items-center gap-2 sm:gap-3 mb-4 sm:mb-5 group">
                <div className="w-8 h-8 sm:w-9 sm:h-9 bg-gradient-to-br from-violet-500 to-purple-600 rounded-lg sm:rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25 transition-transform duration-300 group-hover:scale-105">
                  <span className="text-white font-bold text-xs sm:text-sm">N</span>
                </div>
                <span className="font-bold text-lg sm:text-xl tracking-tight">
                  <span className="gradient-text">NYTM</span>
                </span>
              </Link>
              <p className="text-xs sm:text-sm text-[var(--muted-foreground)] leading-relaxed max-w-xs mb-4 sm:mb-6">
                Free online tools for developers, designers, and everyone. No signup required.
              </p>
              {/* Tagline */}
              <p className="text-[10px] sm:text-xs text-violet-400 font-medium mb-4 sm:mb-6">
                {SITE_TAGLINE}
              </p>
              {/* Social Links */}
              <div className="flex items-center gap-2 sm:gap-3">
                <a 
                  href="https://github.com/nityam2007/nytm-multitools" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[var(--muted)] flex items-center justify-center text-[var(--muted-foreground)] hover:bg-violet-500/10 hover:text-violet-400 transition-all duration-300 active:scale-95"
                  title="GitHub"
                >
                  <GitHubIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </a>
                <a 
                  href="https://twitter.com/intent/tweet?text=Check%20out%20NYTM%20Tools%20-%20173%20free%20online%20tools!&url=https://nytm.in" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[var(--muted)] flex items-center justify-center text-[var(--muted-foreground)] hover:bg-blue-500/10 hover:text-blue-400 transition-all duration-300 active:scale-95"
                  title="Share on Twitter"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
                <a 
                  href="https://www.linkedin.com/sharing/share-offsite/?url=https://nytm.in" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[var(--muted)] flex items-center justify-center text-[var(--muted-foreground)] hover:bg-blue-600/10 hover:text-blue-600 transition-all duration-300 active:scale-95"
                  title="Share on LinkedIn"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                  </svg>
                </a>
                <a 
                  href="https://www.facebook.com/sharer/sharer.php?u=https://nytm.in" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[var(--muted)] flex items-center justify-center text-[var(--muted-foreground)] hover:bg-blue-700/10 hover:text-blue-700 transition-all duration-300 active:scale-95"
                  title="Share on Facebook"
                >
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                {process.env.NEXT_PUBLIC_DONATION_URL && (
                  <a 
                    href={process.env.NEXT_PUBLIC_DONATION_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl bg-[var(--muted)] flex items-center justify-center text-[var(--muted-foreground)] hover:bg-pink-500/10 hover:text-pink-400 transition-all duration-300 active:scale-95"
                    title="Support"
                  >
                    <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                    </svg>
                  </a>
                )}
              </div>
            </div>

            {/* Link Columns */}
            {footerSections.map((section) => (
              <div key={section.title}>
                <h3 className="text-[10px] sm:text-xs font-semibold uppercase tracking-wider text-[var(--foreground)] mb-3 sm:mb-5">
                  {section.title}
                </h3>
                <ul className="space-y-2 sm:space-y-3">
                  {section.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-xs sm:text-sm text-[var(--muted-foreground)] hover:text-violet-400 transition-colors duration-300"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="py-4 sm:py-6 border-t border-[var(--border)] flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4">
          <p className="text-[10px] sm:text-xs text-[var(--muted-foreground)] flex items-center gap-1">
            © {currentYear} NYTM Tools. Made with <svg className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-violet-500" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" /></svg> for everyone.
          </p>
          <div className="flex items-center gap-4 sm:gap-6">
            <Link 
              href="/privacy" 
              className="text-[10px] sm:text-xs text-[var(--muted-foreground)] hover:text-violet-400 transition-colors duration-300"
            >
              Privacy
            </Link>
            <Link 
              href="/terms" 
              className="text-[10px] sm:text-xs text-[var(--muted-foreground)] hover:text-violet-400 transition-colors duration-300"
            >
              Terms
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
