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
}

export function OutputBox({
  value,
  label = "Output",
  format = "text",
  downloadable = true,
  downloadFileName = "output.txt",
  copyable = true,
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
        <label className="text-sm font-medium">{label}</label>
        <div className="flex gap-2">
          {copyable && value && (
            <button
              onClick={handleCopy}
              className="text-sm px-3 py-1 rounded-lg bg-[var(--muted)] hover:bg-[var(--accent)] transition-colors flex items-center gap-1"
            >
              {copied ? (
                <>
                  <CheckIcon className="w-4 h-4 text-green-500" />
                  Copied!
                </>
              ) : (
                <>
                  <CopySimpleIcon className="w-4 h-4" />
                  Copy
                </>
              )}
            </button>
          )}
          {downloadable && value && (
            <button
              onClick={handleDownload}
              className="text-sm px-3 py-1 rounded-lg bg-[var(--muted)] hover:bg-[var(--accent)] transition-colors flex items-center gap-1"
            >
              <DownloadSimpleIcon className="w-4 h-4" />
              Download
            </button>
          )}
        </div>
      </div>
      
      <div className="w-full min-h-[200px] p-4 rounded-xl bg-[var(--card)] border border-[var(--border)] overflow-auto font-mono text-sm whitespace-pre-wrap">
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
          <span className="text-[var(--muted-foreground)]">Output will appear here...</span>
        )}
      </div>
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
