"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("line-counter")!;
const similarTools = getToolsByCategory("text").filter(t => t.slug !== "line-counter");

export default function LineCounterPage() {
  const [input, setInput] = useState("");

  const lines = input.split("\n");
  const stats = {
    total: lines.length,
    nonEmpty: lines.filter(l => l.trim()).length,
    empty: lines.filter(l => !l.trim()).length,
    avgChars: lines.length > 0 ? Math.round(input.length / lines.length) : 0,
    maxChars: Math.max(...lines.map(l => l.length), 0),
    minChars: lines.filter(l => l.trim()).length > 0 
      ? Math.min(...lines.filter(l => l.trim()).map(l => l.length)) 
      : 0,
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <TextArea
          label="Enter your text"
          placeholder="Enter text with multiple lines..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { label: "Total Lines", value: stats.total, iconPath: "M3 4.5h14.25M3 9h9.75M3 13.5h9.75m4.5-4.5v12m0 0l-3.75-3.75M17.25 21L21 17.25" },
            { label: "Non-Empty Lines", value: stats.nonEmpty, iconPath: "M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" },
            { label: "Empty Lines", value: stats.empty, iconPath: "M5.25 7.5A2.25 2.25 0 017.5 5.25h9a2.25 2.25 0 012.25 2.25v9a2.25 2.25 0 01-2.25 2.25h-9a2.25 2.25 0 01-2.25-2.25v-9z" },
            { label: "Avg Chars/Line", value: stats.avgChars, iconPath: "M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" },
            { label: "Max Line Length", value: stats.maxChars, iconPath: "M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" },
            { label: "Min Line Length", value: stats.minChars, iconPath: "M2.25 6L9 12.75l4.286-4.286a11.948 11.948 0 014.306 6.43l.776 2.898m0 0l3.182-5.511m-3.182 5.51l-5.511-3.181" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[var(--muted)] rounded-xl p-4 text-center"
            >
              <div className="flex justify-center mb-1">
                <svg className="w-6 h-6 text-[var(--muted-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d={stat.iconPath} />
                </svg>
              </div>
              <div className="text-3xl font-bold">{stat.value}</div>
              <div className="text-sm text-[var(--muted-foreground)]">{stat.label}</div>
            </div>
          ))}
        </div>

        {input && (
          <div className="bg-[var(--muted)] rounded-xl p-4">
            <h3 className="font-semibold mb-2">Line Details</h3>
            <div className="max-h-60 overflow-y-auto space-y-1">
              {lines.map((line, i) => (
                <div key={i} className="flex items-center gap-3 text-sm py-1 border-b border-[var(--border)] last:border-0">
                  <span className="w-8 text-[var(--muted-foreground)]">{i + 1}</span>
                  <span className="flex-1 truncate font-mono">{line || "(empty)"}</span>
                  <span className="text-[var(--muted-foreground)]">{line.length} chars</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
