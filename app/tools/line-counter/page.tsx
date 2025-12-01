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
            { label: "Total Lines", value: stats.total, icon: "📏" },
            { label: "Non-Empty Lines", value: stats.nonEmpty, icon: "📝" },
            { label: "Empty Lines", value: stats.empty, icon: "⬜" },
            { label: "Avg Chars/Line", value: stats.avgChars, icon: "📊" },
            { label: "Max Line Length", value: stats.maxChars, icon: "📈" },
            { label: "Min Line Length", value: stats.minChars, icon: "📉" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[var(--muted)] rounded-xl p-4 text-center"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
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
