"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("text-extract")!;
const similarTools = getToolsByCategory("text").filter(t => t.slug !== "text-extract");

type ExtractType = "emails" | "urls" | "numbers" | "hashtags" | "mentions" | "ips" | "phones";

const patterns: Record<ExtractType, RegExp> = {
  emails: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g,
  urls: /https?:\/\/[^\s<>"{}|\\^`\[\]]+/g,
  numbers: /-?\d+\.?\d*/g,
  hashtags: /#[\w\u0080-\uFFFF]+/g,
  mentions: /@[\w]+/g,
  ips: /\b(?:\d{1,3}\.){3}\d{1,3}\b/g,
  phones: /[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}/g,
};

export default function TextExtractPage() {
  const [input, setInput] = useState("");
  const [extractType, setExtractType] = useState<ExtractType>("emails");
  const [unique, setUnique] = useState(true);

  const extract = (): string[] => {
    if (!input) return [];
    const matches = input.match(patterns[extractType]) || [];
    return unique ? [...new Set(matches)] : matches;
  };

  const results = extract();

  const copyAll = () => {
    navigator.clipboard.writeText(results.join("\n"));
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {[
            { id: "emails", label: "Emails", icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>' },
            { id: "urls", label: "URLs", icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>' },
            { id: "numbers", label: "Numbers", icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>' },
            { id: "hashtags", label: "Hashtags", icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>' },
            { id: "mentions", label: "Mentions", icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>' },
            { id: "ips", label: "IP Addresses", icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>' },
            { id: "phones", label: "Phone Numbers", icon: '<svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>' },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setExtractType(option.id as ExtractType)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors inline-flex items-center gap-2 ${
                extractType === option.id
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "bg-[var(--muted)] hover:bg-[var(--accent)]"
              }`}
            >
              <span dangerouslySetInnerHTML={{ __html: option.icon }} />
              {option.label}
            </button>
          ))}
        </div>

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={unique}
            onChange={(e) => setUnique(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Show unique only</span>
        </label>

        <TextArea
          label="Input Text"
          placeholder="Paste your text to extract data from..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">
              Extracted ({results.length} found)
            </label>
            {results.length > 0 && (
              <button
                onClick={copyAll}
                className="text-sm text-[var(--primary)] hover:underline"
              >
                Copy all
              </button>
            )}
          </div>
          <div className="bg-[var(--muted)] rounded-xl p-4 min-h-[150px] max-h-[300px] overflow-y-auto">
            {results.length > 0 ? (
              <div className="space-y-1">
                {results.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded bg-[var(--background)] hover:bg-[var(--accent)] group"
                  >
                    <span className="font-mono text-sm break-all">{item}</span>
                    <button
                      onClick={() => navigator.clipboard.writeText(item)}
                      className="opacity-0 group-hover:opacity-100 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                    >
                      Copy
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[var(--muted-foreground)] text-center py-8">
                {input ? `No ${extractType} found` : "Enter text to extract from"}
              </p>
            )}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
