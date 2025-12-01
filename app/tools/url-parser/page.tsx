"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("url-parser")!;
const similarTools = getToolsByCategory("dev").filter(t => t.slug !== "url-parser");

interface ParsedUrl {
  protocol: string;
  host: string;
  hostname: string;
  port: string;
  pathname: string;
  search: string;
  hash: string;
  origin: string;
  params: Record<string, string>;
}

export default function UrlParserPage() {
  const [input, setInput] = useState("https://example.com:8080/path/to/page?name=John&age=30#section");

  const parseUrl = (): ParsedUrl | null => {
    if (!input.trim()) return null;
    
    try {
      const url = new URL(input);
      const params: Record<string, string> = {};
      url.searchParams.forEach((value, key) => {
        params[key] = value;
      });
      
      return {
        protocol: url.protocol,
        host: url.host,
        hostname: url.hostname,
        port: url.port,
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        origin: url.origin,
        params,
      };
    } catch {
      return null;
    }
  };

  const parsed = parseUrl();

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">URL</label>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter URL to parse..."
            className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)] font-mono"
          />
        </div>

        {parsed ? (
          <div className="space-y-4">
            <div className="bg-[var(--muted)] rounded-xl p-4">
              <h3 className="font-semibold mb-3">URL Components</h3>
              <div className="grid gap-2">
                {[
                  { label: "Protocol", value: parsed.protocol },
                  { label: "Host", value: parsed.host },
                  { label: "Hostname", value: parsed.hostname },
                  { label: "Port", value: parsed.port || "(default)" },
                  { label: "Origin", value: parsed.origin },
                  { label: "Pathname", value: parsed.pathname },
                  { label: "Search", value: parsed.search || "(none)" },
                  { label: "Hash", value: parsed.hash || "(none)" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-4 py-2 border-b border-[var(--border)] last:border-0">
                    <span className="w-24 text-sm text-[var(--muted-foreground)]">{item.label}</span>
                    <span className="font-mono text-sm flex-1 break-all">{item.value}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(item.value)}
                      className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {Object.keys(parsed.params).length > 0 && (
              <div className="bg-[var(--muted)] rounded-xl p-4">
                <h3 className="font-semibold mb-3">Query Parameters</h3>
                <div className="grid gap-2">
                  {Object.entries(parsed.params).map(([key, value]) => (
                    <div key={key} className="flex items-center gap-4 py-2 border-b border-[var(--border)] last:border-0">
                      <span className="font-mono text-sm text-[var(--primary)]">{key}</span>
                      <span className="text-[var(--muted-foreground)]">=</span>
                      <span className="font-mono text-sm flex-1 break-all">{value}</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(value)}
                        className="text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                      >
                        Copy
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : input.trim() ? (
          <div className="p-4 rounded-lg bg-red-500/10 text-red-500">
            Invalid URL format
          </div>
        ) : null}
      </div>
    </ToolLayout>
  );
}
