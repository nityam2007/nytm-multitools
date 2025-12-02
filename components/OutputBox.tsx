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
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-semibold text-[var(--foreground)]">{label}</label>
        <div className="flex gap-2">
          {copyable && value && (
            <button
              onClick={handleCopy}
              className="group relative text-sm px-3 py-1.5 rounded-lg bg-[var(--muted)] hover:bg-violet-500 hover:text-white border border-[var(--border)] hover:border-violet-500 transition-all duration-300 flex items-center gap-2 font-medium hover:shadow-md hover:shadow-violet-500/20"
              data-tooltip={copied ? "Copied!" : "Click to copy"}
            >
              {copied ? (
                <>
                  <CheckIcon className="w-4 h-4 text-green-500 group-hover:text-white" />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <CopySimpleIcon className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
              {!copied && (
                <span className="tooltip-text absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[var(--foreground)] text-[var(--background)] text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                  Click to copy
                </span>
              )}
            </button>
          )}
          {downloadable && value && (
            <button
              onClick={handleDownload}
              className="group relative text-sm px-3 py-1.5 rounded-lg bg-[var(--muted)] hover:bg-violet-500 hover:text-white border border-[var(--border)] hover:border-violet-500 transition-all duration-300 flex items-center gap-2 font-medium hover:shadow-md hover:shadow-violet-500/20"
            >
              <DownloadSimpleIcon className="w-4 h-4" />
              <span>Download</span>
              <span className="tooltip-text absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-[var(--foreground)] text-[var(--background)] text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                Download file
              </span>
            </button>
          )}
        </div>
      </div>
      
      <div className="relative">
        <div className="w-full min-h-[240px] p-4 rounded-2xl bg-[var(--card)] border-2 border-[var(--border)] overflow-auto font-mono text-sm whitespace-pre-wrap shadow-sm transition-all duration-300 hover:shadow-md">
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
            <div className="flex flex-col items-center justify-center h-[220px] text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 flex items-center justify-center text-2xl mb-3">
                ✨
              </div>
              <span className="text-[var(--muted-foreground)] font-sans">Output will appear here...</span>
              <span className="text-xs text-[var(--muted-foreground)] mt-1 font-sans">Process your input to see results</span>
            </div>
          )}
        </div>
        {/* Decorative corner accent */}
        <div className="absolute bottom-3 right-3 w-4 h-4 border-r-2 border-b-2 border-[var(--border)] rounded-br-lg opacity-30 pointer-events-none" />
      </div>

      {/* Stats bar */}
      {(value || stats.length > 0) && (
        <div className="mt-3 flex flex-wrap gap-3 text-xs">
          {value && (
            <div className="px-3 py-1.5 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-[var(--muted-foreground)] font-mono tabular-nums">
              {value.length.toLocaleString()} characters
            </div>
          )}
          {stats.map((stat, idx) => (
            <div
              key={idx}
              className="px-3 py-1.5 rounded-lg bg-[var(--muted)] border border-[var(--border)] text-[var(--muted-foreground)] font-mono tabular-nums"
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
