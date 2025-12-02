"use client";

import { useState } from "react";
import { CheckIcon, CopySimpleIcon, DownloadSimpleIcon } from "@/assets/icons";

interface OutputBoxProps {
  value: string;
  label?: string;
  format?: "text" | "json" | "html" | "code";
  downloadable?: boolean;
  downloadFileName?: string;
  copyable?: boolean;
  stats?: { label: string; value: string | number }[];
}

export function OutputBox({
  value,
  label = "Output",
  format = "text",
  downloadable = true,
  downloadFileName = "output.txt",
  copyable = true,
  stats = [],
}: OutputBoxProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownload = () => {
    const blob = new Blob([value], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = downloadFileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatValue = (val: string) => {
    if (format === "json") {
      try {
        const parsed = JSON.parse(val);
        return syntaxHighlightJson(JSON.stringify(parsed, null, 2));
      } catch {
        return val;
      }
    }
    return val;
  };

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-4 mb-2">
        <label className="text-xs sm:text-sm font-semibold text-[var(--foreground)]">{label}</label>
        <div className="flex gap-1.5 sm:gap-2">
          {copyable && value && (
            <button
              onClick={handleCopy}
              className="group relative text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 rounded-lg bg-[var(--muted)] hover:bg-violet-500 hover:text-white border border-[var(--border)] hover:border-violet-500 transition-all duration-300 flex items-center gap-1.5 sm:gap-2 font-medium hover:shadow-md hover:shadow-violet-500/20 active:scale-95"
              data-tooltip={copied ? "Copied!" : "Click to copy"}
            >
              {copied ? (
                <>
                  <CheckIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-green-500 group-hover:text-white" />
                  <span className="hidden xs:inline">Copied!</span>
                </>
              ) : (
                <>
                  <CopySimpleIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Copy</span>
                </>
              )}
              {!copied && (
                <span className="tooltip-text absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[var(--foreground)] text-[var(--background)] text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
                  Click to copy
                </span>
              )}
            </button>
          )}
          {downloadable && value && (
            <button
              onClick={handleDownload}
              className="group relative text-xs sm:text-sm px-2.5 sm:px-3 py-1.5 rounded-lg bg-[var(--muted)] hover:bg-violet-500 hover:text-white border border-[var(--border)] hover:border-violet-500 transition-all duration-300 flex items-center gap-1.5 sm:gap-2 font-medium hover:shadow-md hover:shadow-violet-500/20 active:scale-95"
            >
              <DownloadSimpleIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="hidden xs:inline">Download</span>
              <span className="tooltip-text absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[var(--foreground)] text-[var(--background)] text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none hidden sm:block">
                Download file
              </span>
            </button>
          )}
        </div>
      </div>
      
      <div className="relative">
        <div className="w-full min-h-[180px] sm:min-h-[240px] p-3 sm:p-4 rounded-xl sm:rounded-2xl bg-[var(--card)] border-2 border-[var(--border)] overflow-auto font-mono text-xs sm:text-sm whitespace-pre-wrap shadow-sm transition-all duration-300 hover:shadow-md">
          {value ? (
            format === "json" ? (
              <pre
                className="m-0"
                dangerouslySetInnerHTML={{ __html: formatValue(value) }}
              />
            ) : (
              <pre className="m-0">{value}</pre>
            )
          ) : (
            <div className="flex flex-col items-center justify-center h-[160px] sm:h-[220px] text-center px-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 flex items-center justify-center mb-2 sm:mb-3">
                <svg className="w-6 h-6 sm:w-8 sm:h-8 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                </svg>
              </div>
              <span className="text-xs sm:text-sm text-[var(--muted-foreground)] font-sans">Output will appear here...</span>
              <span className="text-[10px] sm:text-xs text-[var(--muted-foreground)] mt-1 font-sans">Process your input to see results</span>
            </div>
          )}
        </div>
        {/* Decorative corner accent */}
        <div className="absolute bottom-2.5 sm:bottom-3 right-2.5 sm:right-3 w-3 h-3 sm:w-4 sm:h-4 border-r-2 border-b-2 border-[var(--border)] rounded-br-lg opacity-30 pointer-events-none" />
      </div>

      {/* Stats bar */}
      {(value || stats.length > 0) && (
        <div className="mt-2 sm:mt-3 flex flex-wrap gap-1.5 sm:gap-3 text-[10px] sm:text-xs">
          {value && (
            <div className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg bg-[var(--muted)] border border-[var(--border)] text-[var(--muted-foreground)] font-mono tabular-nums">
              {value.length.toLocaleString()} chars
            </div>
          )}
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg bg-[var(--muted)] border border-[var(--border)] text-[var(--muted-foreground)] font-mono tabular-nums"
            >
              {stat.label}: <span className="font-semibold text-[var(--foreground)]">{stat.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function syntaxHighlightJson(json: string): string {
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
    (match) => {
      let cls = "syntax-number";
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = "syntax-key";
        } else {
          cls = "syntax-string";
        }
      } else if (/true|false/.test(match)) {
        cls = "syntax-boolean";
      } else if (/null/.test(match)) {
        cls = "syntax-null";
      }
      return `<span class="${cls}">${match}</span>`;
    }
  );
}
