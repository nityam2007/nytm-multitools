// Changelog/Updates Component | TypeScript
"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ChangelogEntry {
  date: string;
  version?: string;
  changes: {
    type: "new" | "improved" | "fixed";
    text: string;
  }[];
}

// Static changelog data - update this when adding new features
const changelog: ChangelogEntry[] = [
  {
    date: "Dec 4, 2025",
    version: "1.6.0",
    changes: [
      { type: "new", text: "IRCTC Refund Calculator - Indian Railway ticket refund estimator" },
      { type: "new", text: "DatePicker & TimePicker components with improved UX" },
      { type: "new", text: "Network Tools category with 6 new tools" },
      { type: "new", text: "DNS Lookup - DNS record type reference" },
      { type: "new", text: "My IP - Detect your IP address via WebRTC" },
      { type: "new", text: "Subnet Calculator - IPv4 subnet calculations" },
      { type: "new", text: "Port Info - 500+ common port reference" },
      { type: "new", text: "MAC Lookup - Vendor identification from MAC address" },
      { type: "new", text: "URL Analyzer - Parse and analyze URL components" },
      { type: "new", text: "Paraphraser - Rewrite text with multiple styles" },
      { type: "improved", text: "Simplified calculator layouts for cleaner interface" },
    ],
  },
  {
    date: "Dec 3, 2025",
    version: "1.5.1",
    changes: [
      { type: "improved", text: "Cleaner header & sidebar - removed box icon logo" },
      { type: "improved", text: "Updated site messaging to be inclusive for everyone" },
    ],
  },
  {
    date: "Dec 3, 2025",
    version: "1.5.0",
    changes: [
      { type: "new", text: "PDF Merge - Combine multiple PDFs into one" },
      { type: "new", text: "PNG/JPG to PDF converters" },
      { type: "new", text: "15 image format converters (PNG, JPG, WebP, GIF)" },
      { type: "new", text: "Code to Image - Beautiful code screenshots" },
      { type: "improved", text: "Text to Speech now uses WebGPU for 3-5x speedup" },
    ],
  },
  {
    date: "Dec 2, 2025",
    version: "1.4.0",
    changes: [
      { type: "new", text: "AI Text to Speech - 100% free, unlimited, local processing" },
      { type: "new", text: "Background Remover - Client-side AI processing" },
      { type: "improved", text: "Dynamic tool count system" },
    ],
  },
  {
    date: "1 Dec 2025",
    version: "1.0.0",
    changes: [
      { type: "new", text: "Initial release with 130+ free online tools" },
      { type: "new", text: "Dark/Light theme support" },
      { type: "new", text: "100% client-side processing" },
    ],
  },
];

const STORAGE_KEY = "nytm-last-seen-changelog";
const POPUP_DISMISSED_KEY = "nytm-changelog-popup-dismissed";

export function Changelog() {
  const [isOpen, setIsOpen] = useState(false);
  const [hasNew, setHasNew] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Check if there are new updates since last visit
    const lastSeen = localStorage.getItem(STORAGE_KEY);
    const latestDate = changelog[0]?.date;
    const popupDismissed = localStorage.getItem(POPUP_DISMISSED_KEY);
    
    if (!lastSeen || lastSeen !== latestDate) {
      setHasNew(true);
      // Show popup only if not dismissed for this version
      if (popupDismissed !== latestDate) {
        // Small delay so it doesn't appear immediately on load
        setTimeout(() => setShowPopup(true), 1500);
      }
    }
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleOpen = () => {
    setIsOpen(!isOpen);
    setShowPopup(false);
    if (!isOpen && hasNew) {
      // Mark as seen
      localStorage.setItem(STORAGE_KEY, changelog[0]?.date || "");
      localStorage.setItem(POPUP_DISMISSED_KEY, changelog[0]?.date || "");
      setHasNew(false);
    }
  };

  const dismissPopup = () => {
    setShowPopup(false);
    localStorage.setItem(POPUP_DISMISSED_KEY, changelog[0]?.date || "");
  };

  const getTypeStyle = (type: "new" | "improved" | "fixed") => {
    switch (type) {
      case "new":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/30";
      case "improved":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "fixed":
        return "bg-amber-500/20 text-amber-400 border-amber-500/30";
    }
  };

  const getTypeLabel = (type: "new" | "improved" | "fixed") => {
    switch (type) {
      case "new": return "New";
      case "improved": return "Improved";
      case "fixed": return "Fixed";
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={handleOpen}
        className="relative w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-lg sm:rounded-xl hover:bg-violet-500/10 transition-all duration-300 group active:scale-95"
        aria-label="View updates"
      >
        <svg 
          className="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-300 group-hover:text-violet-400" 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor" 
          strokeWidth={2}
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" 
          />
        </svg>
        
        {/* Notification dot */}
        {hasNew && (
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
        )}
      </button>

      {/* Dropdown - Desktop only */}
      {isOpen && (
        <div className="hidden sm:block absolute right-0 top-full mt-2 w-96 bg-[var(--background)] border border-[var(--border)] rounded-xl shadow-2xl shadow-black/20 overflow-hidden z-50 animate-fade-slide-up" style={{ animationDuration: '0.15s' }}>
          {/* Header */}
          <div className="px-4 py-3 border-b border-[var(--border)] bg-[var(--muted)]">
            <h3 className="font-semibold text-sm">What&apos;s New</h3>
            <p className="text-xs text-[var(--muted-foreground)]">Latest updates and improvements</p>
          </div>

          {/* Changelog entries */}
          <div className="max-h-96 overflow-y-auto">
            {changelog.map((entry, i) => (
              <div key={i} className="p-4 border-b border-[var(--border)] last:border-0">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-[var(--muted-foreground)]">{entry.date}</span>
                  {entry.version && (
                    <span className="text-xs px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-400 font-mono">
                      v{entry.version}
                    </span>
                  )}
                </div>
                <ul className="space-y-1.5">
                  {entry.changes.map((change, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm">
                      <span className={`text-[10px] px-1.5 py-0.5 rounded border font-medium shrink-0 mt-0.5 ${getTypeStyle(change.type)}`}>
                        {getTypeLabel(change.type)}
                      </span>
                      <span className="text-[var(--foreground)]">{change.text}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          {/* Footer */}
          <div className="px-4 py-2 border-t border-[var(--border)] bg-[var(--muted)]">
            <a 
              href="https://github.com/nityam2007/nytm-multitools/commits/main" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1"
            >
              View all commits on GitHub
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      )}

      {/* Mobile fullscreen modal via portal */}
      {mounted && isOpen && createPortal(
        <div className="sm:hidden fixed inset-0 z-[9999]">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal */}
          <div className="absolute inset-x-0 bottom-0 max-h-[85vh] bg-[var(--background)] border-t border-[var(--border)] rounded-t-2xl shadow-2xl shadow-black/40 overflow-hidden animate-slide-up">
            {/* Handle */}
            <div className="flex justify-center py-2">
              <div className="w-10 h-1 rounded-full bg-[var(--border)]" />
            </div>
            
            {/* Header */}
            <div className="px-5 py-3 border-b border-[var(--border)] bg-[var(--muted)] flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-base">What&apos;s New</h3>
                <p className="text-xs text-[var(--muted-foreground)]">Latest updates and improvements</p>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-[var(--background)] rounded-lg transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Changelog entries */}
            <div className="overflow-y-auto" style={{ maxHeight: 'calc(85vh - 180px)' }}>
              {changelog.map((entry, i) => (
                <div key={i} className="p-5 border-b border-[var(--border)] last:border-0">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-medium text-[var(--muted-foreground)]">{entry.date}</span>
                    {entry.version && (
                      <span className="text-xs px-2 py-0.5 rounded bg-violet-500/20 text-violet-400 font-mono">
                        v{entry.version}
                      </span>
                    )}
                  </div>
                  <ul className="space-y-2.5">
                    {entry.changes.map((change, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm">
                        <span className={`text-xs px-2 py-0.5 rounded border font-medium shrink-0 mt-0.5 ${getTypeStyle(change.type)}`}>
                          {getTypeLabel(change.type)}
                        </span>
                        <span className="text-[var(--foreground)]">{change.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="px-5 py-4 border-t border-[var(--border)] bg-[var(--muted)]">
              <a 
                href="https://github.com/nityam2007/nytm-multitools/commits/main" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-violet-400 hover:text-violet-300 transition-colors flex items-center justify-center gap-2"
              >
                View all commits on GitHub
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Popup notification - rendered via portal to body */}
      {mounted && showPopup && createPortal(
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999]" 
            onClick={dismissPopup}
          />
          
          {/* Mobile: Bottom sheet style | Desktop: Centered modal */}
          <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center sm:p-4 pointer-events-none">
            {/* Modal */}
            <div className="pointer-events-auto w-full sm:max-w-md bg-[var(--background)] border-t sm:border border-[var(--border)] rounded-t-2xl sm:rounded-2xl shadow-2xl shadow-black/40 overflow-hidden animate-slide-up sm:animate-fade-slide-up" style={{ animationDuration: '0.2s' }}>
              {/* Mobile Handle */}
              <div className="sm:hidden flex justify-center py-2 bg-gradient-to-r from-violet-500/10 to-purple-500/10">
                <div className="w-10 h-1 rounded-full bg-[var(--border)]" />
              </div>
              
              {/* Header */}
              <div className="p-4 sm:p-5 pb-3 sm:pb-4 border-b border-[var(--border)] bg-gradient-to-r from-violet-500/10 to-purple-500/10">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/20 flex items-center justify-center shrink-0">
                      <svg className="w-5 h-5 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-base sm:text-lg">What&apos;s New!</h4>
                      <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">{changelog[0]?.version ? `Version ${changelog[0].version}` : changelog[0]?.date}</p>
                    </div>
                  </div>
                  <button 
                    onClick={dismissPopup}
                    className="text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors p-1.5 hover:bg-[var(--muted)] rounded-lg shrink-0"
                    aria-label="Dismiss"
                  >
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* Changes list */}
              <div className="p-4 sm:p-5 space-y-2.5 sm:space-y-3 max-h-[50vh] sm:max-h-64 overflow-y-auto">
                {changelog[0]?.changes.map((change, i) => (
                  <div key={i} className="flex items-start gap-2 sm:gap-3">
                    <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md border font-medium shrink-0 ${getTypeStyle(change.type)}`}>
                      {getTypeLabel(change.type)}
                    </span>
                    <span className="text-sm text-[var(--foreground)] leading-relaxed">{change.text}</span>
                  </div>
                ))}
              </div>

              {/* Footer */}
              <div className="p-4 sm:p-5 pt-3 sm:pt-4 border-t border-[var(--border)] bg-[var(--muted)] flex gap-2.5 sm:gap-3">
                <button
                  onClick={dismissPopup}
                  className="flex-1 py-2.5 sm:py-2.5 rounded-xl border border-[var(--border)] text-sm font-medium hover:bg-[var(--background)] transition-colors active:scale-[0.98]"
                >
                  Dismiss
                </button>
                <button
                  onClick={() => {
                    dismissPopup();
                    handleOpen();
                  }}
                  className="flex-1 py-2.5 sm:py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white text-sm font-medium hover:opacity-90 transition-opacity active:scale-[0.98]"
                >
                  View All
                </button>
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </div>
  );
}
