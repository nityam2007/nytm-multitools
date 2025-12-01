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
            { id: "emails", label: "📧 Emails" },
            { id: "urls", label: "🔗 URLs" },
            { id: "numbers", label: "🔢 Numbers" },
            { id: "hashtags", label: "#️⃣ Hashtags" },
            { id: "mentions", label: "@ Mentions" },
            { id: "ips", label: "🌐 IP Addresses" },
            { id: "phones", label: "📱 Phone Numbers" },
          ].map((option) => (
            <button
              key={option.id}
              onClick={() => setExtractType(option.id as ExtractType)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                extractType === option.id
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "bg-[var(--muted)] hover:bg-[var(--accent)]"
              }`}
            >
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
