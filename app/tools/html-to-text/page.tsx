// HTML to Text Converter | TypeScript

"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("html-to-text")!;
const similarTools = getToolsByCategory("converter").filter(t => t.slug !== "html-to-text");

export default function HtmlToTextPage() {
  const [input, setInput] = useState("");
  const [url, setUrl] = useState("");
  const [mode, setMode] = useState<"paste" | "url">("paste");
  const [loading, setLoading] = useState(false);

  const htmlToText = (html: string): string => {
    if (!html) return "";
    
    let result = html;
    
    // Remove script and style elements
    result = result.replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "");
    result = result.replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "");
    result = result.replace(/<noscript[^>]*>[\s\S]*?<\/noscript>/gi, "");
    
    // Remove common non-content elements
    result = result.replace(/<header[^>]*>[\s\S]*?<\/header>/gi, "");
    result = result.replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, "");
    result = result.replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, "");
    result = result.replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, "");
    
    // Convert headings to text with markers
    result = result.replace(/<h1[^>]*>(.*?)<\/h1>/gi, "\n\n## $1 ##\n\n");
    result = result.replace(/<h2[^>]*>(.*?)<\/h2>/gi, "\n\n# $1 #\n\n");
    result = result.replace(/<h[3-6][^>]*>(.*?)<\/h[3-6]>/gi, "\n\n$1\n\n");
    
    // Convert paragraphs and divs
    result = result.replace(/<\/p>\s*<p[^>]*>/gi, "\n\n");
    result = result.replace(/<\/(div|p|article|section)>/gi, "\n");
    
    // Convert line breaks
    result = result.replace(/<br\s*\/?>/gi, "\n");
    
    // Convert lists
    result = result.replace(/<li[^>]*>(.*?)<\/li>/gi, "• $1\n");
    result = result.replace(/<\/(ul|ol)>/gi, "\n");
    
    // Convert links to text with URL
    result = result.replace(/<a[^>]*href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, "$2 [$1]");
    
    // Remove all remaining HTML tags
    result = result.replace(/<[^>]*>/g, "");
    
    // Decode HTML entities
    const textarea = document.createElement("textarea");
    textarea.innerHTML = result;
    result = textarea.value;
    
    // Clean up whitespace
    result = result.replace(/&nbsp;/g, " ");
    result = result.replace(/\n\s*\n\s*\n/g, "\n\n");
    result = result.replace(/[ \t]+/g, " ");
    result = result.trim();
    
    return result;
  };

  const fetchUrl = async () => {
    if (!url) return;
    
    setLoading(true);
    try {
      // Use CORS proxy for client-side fetching
      const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      const data = await response.json();
      setInput(data.contents);
    } catch (error) {
      alert("Error fetching URL. Please check the URL and try again, or paste HTML directly.");
    } finally {
      setLoading(false);
    }
  };

  const output = htmlToText(input);
  const wordCount = output.trim() ? output.trim().split(/\s+/).length : 0;

  const copyAll = () => {
    navigator.clipboard.writeText(output);
  };

  const copySelected = () => {
    const selection = window.getSelection()?.toString();
    if (selection) {
      navigator.clipboard.writeText(selection);
    }
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        {/* Warning Banner for External Calls */}
        {mode === "url" && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-sm">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="font-medium text-amber-400 mb-1">External API Call</p>
                <p className="text-[var(--muted-foreground)]">
                  This tool makes an external request to fetch the URL content through a CORS proxy (allorigins.win). The URL you enter will be sent to this third-party service.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Mode Selection */}
        <div className="flex gap-2">
          <button
            onClick={() => setMode("url")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              mode === "url"
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "bg-[var(--muted)] hover:bg-[var(--accent)]"
            }`}
          >
            Fetch from URL
          </button>
          <button
            onClick={() => setMode("paste")}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              mode === "paste"
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "bg-[var(--muted)] hover:bg-[var(--accent)]"
            }`}
          >
            Paste HTML
          </button>
        </div>

        {mode === "url" && (
          <div className="flex gap-2">
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 px-4 py-2 rounded-lg bg-[var(--muted)] border border-[var(--border)] focus:border-violet-500/50 focus:bg-violet-500/5 transition-all"
              onKeyDown={(e) => e.key === "Enter" && fetchUrl()}
            />
            <button
              onClick={fetchUrl}
              disabled={loading || !url}
              className="px-6 py-2 rounded-lg bg-violet-500 text-white hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Loading..." : "Fetch"}
            </button>
          </div>
        )}

        <TextArea
          label="HTML Input"
          placeholder="Paste HTML content here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={12}
        />

        {/* Output Controls */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-4">
            <span className="text-sm text-[var(--muted-foreground)]">
              Approximate Word Count: <span className="font-medium text-[var(--foreground)]">{wordCount}</span>
            </span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={copySelected}
              disabled={!output}
              className="px-4 py-2 rounded-lg text-sm bg-[var(--muted)] hover:bg-[var(--accent)] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Copy Selected Text
            </button>
            <button
              onClick={copyAll}
              disabled={!output}
              className="px-4 py-2 rounded-lg text-sm bg-violet-500 text-white hover:bg-violet-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Copy ALL Text
            </button>
          </div>
        </div>

        <OutputBox label="Plain Text Output" value={output} />
      </div>
    </ToolLayout>
  );
}
