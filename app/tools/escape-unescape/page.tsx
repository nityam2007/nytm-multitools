"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("escape-unescape")!;
const similarTools = getToolsByCategory("dev").filter(t => t.slug !== "escape-unescape");

type EscapeType = "javascript" | "html" | "url" | "json" | "csv";

export default function EscapeUnescapePage() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"escape" | "unescape">("escape");
  const [type, setType] = useState<EscapeType>("javascript");

  const process = (): string => {
    if (!input) return "";
    
    if (mode === "escape") {
      switch (type) {
        case "javascript":
          return input
            .replace(/\\/g, "\\\\")
            .replace(/'/g, "\\'")
            .replace(/"/g, '\\"')
            .replace(/\n/g, "\\n")
            .replace(/\r/g, "\\r")
            .replace(/\t/g, "\\t");
        case "html":
          return input
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
        case "url":
          return encodeURIComponent(input);
        case "json":
          return JSON.stringify(input).slice(1, -1);
        case "csv":
          return `"${input.replace(/"/g, '""')}"`;
        default:
          return input;
      }
    } else {
      switch (type) {
        case "javascript":
          return input
            .replace(/\\n/g, "\n")
            .replace(/\\r/g, "\r")
            .replace(/\\t/g, "\t")
            .replace(/\\"/g, '"')
            .replace(/\\'/g, "'")
            .replace(/\\\\/g, "\\");
        case "html":
          return input
            .replace(/&amp;/g, "&")
            .replace(/&lt;/g, "<")
            .replace(/&gt;/g, ">")
            .replace(/&quot;/g, '"')
            .replace(/&#39;/g, "'");
        case "url":
          return decodeURIComponent(input);
        case "json":
          try {
            return JSON.parse(`"${input}"`);
          } catch {
            return "Invalid JSON escape sequence";
          }
        case "csv":
          return input.replace(/^"|"$/g, "").replace(/""/g, '"');
        default:
          return input;
      }
    }
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setMode("escape")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === "escape"
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "bg-[var(--muted)] hover:bg-[var(--accent)]"
              }`}
            >
              Escape
            </button>
            <button
              onClick={() => setMode("unescape")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === "unescape"
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "bg-[var(--muted)] hover:bg-[var(--accent)]"
              }`}
            >
              Unescape
            </button>
          </div>
          
          <div className="flex gap-2">
            {[
              { id: "javascript", label: "JavaScript" },
              { id: "html", label: "HTML" },
              { id: "url", label: "URL" },
              { id: "json", label: "JSON" },
              { id: "csv", label: "CSV" },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setType(t.id as EscapeType)}
                className={`px-3 py-1 rounded text-sm transition-colors ${
                  type === t.id
                    ? "bg-[var(--accent)] font-medium"
                    : "text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <TextArea
          label={mode === "escape" ? "Text to Escape" : "Text to Unescape"}
          placeholder="Enter your text..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <OutputBox label={mode === "escape" ? "Escaped Text" : "Unescaped Text"} value={process()} />
      </div>
    </ToolLayout>
  );
}
