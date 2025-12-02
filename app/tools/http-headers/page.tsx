// HTTP Headers Viewer Tool | TypeScript
"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("http-headers")!;
const similarTools = getToolsByCategory("misc").filter(t => t.slug !== "http-headers");

interface HeaderInfo {
  name: string;
  value: string;
  description?: string;
}

const commonHeaders: Record<string, string> = {
  "content-type": "Indicates the media type of the resource",
  "content-length": "Size of the response body in bytes",
  "cache-control": "Directives for caching mechanisms",
  "content-encoding": "Compression algorithm used",
  "date": "Date and time the message was sent",
  "expires": "Date/time after which the response is stale",
  "last-modified": "Date the resource was last modified",
  "etag": "Unique identifier for a specific version of a resource",
  "server": "Information about the server software",
  "x-powered-by": "Technology powering the server",
  "access-control-allow-origin": "CORS: Allowed origins",
  "access-control-allow-methods": "CORS: Allowed HTTP methods",
  "access-control-allow-headers": "CORS: Allowed request headers",
  "strict-transport-security": "HSTS: Force HTTPS connections",
  "x-content-type-options": "Prevents MIME type sniffing",
  "x-frame-options": "Controls iframe embedding",
  "x-xss-protection": "XSS filter configuration",
  "content-security-policy": "Controls resources the browser can load",
  "referrer-policy": "Controls referrer information sent",
  "set-cookie": "Sets a cookie on the client",
  "location": "URL to redirect to",
  "vary": "Determines how to match future requests",
  "transfer-encoding": "Form of encoding used for transfer",
  "connection": "Control options for the current connection",
  "accept-ranges": "Indicates if partial requests are supported",
  "age": "Time in seconds the object was in a proxy cache",
};

export default function HttpHeadersPage() {
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState<HeaderInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [statusCode, setStatusCode] = useState<number | null>(null);
  const [statusText, setStatusText] = useState("");

  const fetchHeaders = async () => {
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    let targetUrl = url.trim();
    if (!targetUrl.startsWith("http://") && !targetUrl.startsWith("https://")) {
      targetUrl = "https://" + targetUrl;
    }

    setLoading(true);
    setError("");
    setHeaders([]);
    setStatusCode(null);
    setStatusText("");

    try {
      const response = await fetch(`/api/http-headers?url=${encodeURIComponent(targetUrl)}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch headers");
      }

      setStatusCode(data.statusCode);
      setStatusText(data.statusText);
      setHeaders(
        Object.entries(data.headers).map(([name, value]) => ({
          name,
          value: value as string,
          description: commonHeaders[name.toLowerCase()],
        }))
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch headers");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      fetchHeaders();
    }
  };

  const copyHeaders = () => {
    const text = headers.map(h => `${h.name}: ${h.value}`).join("\n");
    navigator.clipboard.writeText(text);
  };

  const copyAsJson = () => {
    const obj = headers.reduce((acc, h) => ({ ...acc, [h.name]: h.value }), {});
    navigator.clipboard.writeText(JSON.stringify(obj, null, 2));
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div>
          <label className="text-sm font-medium mb-2 block">Enter URL</label>
          <div className="flex gap-2">
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="https://example.com"
              className="flex-1 px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)] font-mono text-sm"
            />
            <button
              onClick={fetchHeaders}
              disabled={loading}
              className="px-6 py-3 rounded-lg bg-[var(--foreground)] text-[var(--background)] font-medium hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              {loading ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : (
                "Fetch Headers"
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500">
            {error}
          </div>
        )}

        {statusCode !== null && (
          <div className="flex items-center gap-4">
            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
              statusCode >= 200 && statusCode < 300
                ? "bg-green-500/10 text-green-500"
                : statusCode >= 300 && statusCode < 400
                ? "bg-yellow-500/10 text-yellow-500"
                : "bg-red-500/10 text-red-500"
            }`}>
              {statusCode} {statusText}
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyHeaders}
                className="px-3 py-1 text-sm rounded-lg bg-[var(--muted)] hover:bg-[var(--accent)] transition-colors"
              >
                Copy Raw
              </button>
              <button
                onClick={copyAsJson}
                className="px-3 py-1 text-sm rounded-lg bg-[var(--muted)] hover:bg-[var(--accent)] transition-colors"
              >
                Copy JSON
              </button>
            </div>
          </div>
        )}

        {headers.length > 0 && (
          <div className="space-y-2">
            {headers.map((header, index) => (
              <div
                key={index}
                className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]"
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-2">
                  <span className="font-mono text-sm font-semibold text-[var(--foreground)] min-w-[200px]">
                    {header.name}
                  </span>
                  <span className="font-mono text-sm text-[var(--muted-foreground)] break-all flex-1">
                    {header.value}
                  </span>
                </div>
                {header.description && (
                  <p className="mt-2 text-xs text-[var(--muted-foreground)] opacity-70">
                    {header.description}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {headers.length === 0 && !loading && !error && (
          <div className="bg-[var(--card)] rounded-xl p-8 border border-[var(--border)] text-center">
            <div className="w-12 h-12 mx-auto mb-4 text-[var(--muted-foreground)]">
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-[var(--muted-foreground)]">
              Enter a URL to view its HTTP response headers
            </p>
          </div>
        )}

        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-3">Quick Examples</h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {[
              { label: "Google", url: "https://google.com" },
              { label: "GitHub", url: "https://github.com" },
              { label: "Cloudflare", url: "https://cloudflare.com" },
              { label: "Mozilla", url: "https://mozilla.org" },
            ].map(sample => (
              <button
                key={sample.label}
                onClick={() => {
                  setUrl(sample.url);
                }}
                className="text-left p-3 rounded-lg bg-[var(--muted)] hover:bg-[var(--accent)] text-sm transition-colors"
              >
                <span className="font-medium">{sample.label}</span>
                <span className="text-[var(--muted-foreground)] ml-2 font-mono text-xs">{sample.url}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-3">About HTTP Headers</h3>
          <p className="text-sm text-[var(--muted-foreground)] mb-4">
            HTTP headers allow the client and server to pass additional information with an HTTP request or response. 
            They define the operating parameters of an HTTP transaction.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Common Response Headers</h4>
              <ul className="space-y-1 text-[var(--muted-foreground)]">
                <li>Content-Type - Media type of the body</li>
                <li>Cache-Control - Caching directives</li>
                <li>Set-Cookie - Set cookies on client</li>
                <li>Content-Security-Policy - Security rules</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Security Headers</h4>
              <ul className="space-y-1 text-[var(--muted-foreground)]">
                <li>Strict-Transport-Security - Force HTTPS</li>
                <li>X-Frame-Options - Prevent clickjacking</li>
                <li>X-Content-Type-Options - MIME sniffing</li>
                <li>Referrer-Policy - Control referrer info</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
