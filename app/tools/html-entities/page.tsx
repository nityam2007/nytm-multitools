"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("html-entities")!;
const similarTools = getToolsByCategory("dev").filter(t => t.slug !== "html-entities");

const entities: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
  "©": "&copy;",
  "®": "&reg;",
  "™": "&trade;",
  "€": "&euro;",
  "£": "&pound;",
  "¥": "&yen;",
  "—": "&mdash;",
  "–": "&ndash;",
  "…": "&hellip;",
  " ": "&nbsp;",
};

export default function HtmlEntitiesPage() {
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [encodeAll, setEncodeAll] = useState(false);

  const encode = (text: string): string => {
    if (encodeAll) {
      return text.split("").map(char => `&#${char.charCodeAt(0)};`).join("");
    }
    return text.replace(/[&<>"'©®™€£¥—–… ]/g, char => entities[char] || char);
  };

  const decode = (text: string): string => {
    const reverseEntities = Object.fromEntries(
      Object.entries(entities).map(([k, v]) => [v, k])
    );
    return text
      .replace(/&[a-zA-Z]+;/g, entity => reverseEntities[entity] || entity)
      .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(parseInt(code)))
      .replace(/&#x([0-9a-fA-F]+);/g, (_, code) => String.fromCharCode(parseInt(code, 16)));
  };

  const process = (): string => {
    if (!input) return "";
    return mode === "encode" ? encode(input) : decode(input);
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="flex flex-wrap gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => setMode("encode")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === "encode"
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "bg-[var(--muted)] hover:bg-[var(--accent)]"
              }`}
            >
              Encode
            </button>
            <button
              onClick={() => setMode("decode")}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                mode === "decode"
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "bg-[var(--muted)] hover:bg-[var(--accent)]"
              }`}
            >
              Decode
            </button>
          </div>
          
          {mode === "encode" && (
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={encodeAll}
                onChange={(e) => setEncodeAll(e.target.checked)}
                className="rounded"
              />
              <span className="text-sm">Encode all characters (numeric)</span>
            </label>
          )}
        </div>

        <TextArea
          label={mode === "encode" ? "Text to Encode" : "HTML Entities to Decode"}
          placeholder={mode === "encode" ? "Enter text..." : "Enter HTML entities like &amp;lt;div&amp;gt;..."}
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <OutputBox label={mode === "encode" ? "HTML Entities" : "Decoded Text"} value={process()} />

        <div className="bg-[var(--muted)] rounded-xl p-4">
          <h3 className="font-semibold mb-2">Common HTML Entities</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm font-mono">
            {Object.entries(entities).slice(0, 12).map(([char, entity]) => (
              <div key={entity} className="flex justify-between bg-[var(--background)] rounded p-2">
                <span>{char === " " ? "space" : char}</span>
                <span className="text-[var(--muted-foreground)]">{entity}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
