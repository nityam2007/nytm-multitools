"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("character-counter")!;
const similarTools = getToolsByCategory("text").filter(t => t.slug !== "character-counter");

export default function CharacterCounterPage() {
  const [input, setInput] = useState("");

  const stats = {
    total: input.length,
    noSpaces: input.replace(/\s/g, "").length,
    letters: (input.match(/[a-zA-Z]/g) || []).length,
    digits: (input.match(/[0-9]/g) || []).length,
    spaces: (input.match(/\s/g) || []).length,
    special: input.replace(/[a-zA-Z0-9\s]/g, "").length,
    uppercase: (input.match(/[A-Z]/g) || []).length,
    lowercase: (input.match(/[a-z]/g) || []).length,
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <TextArea
          label="Enter your text"
          placeholder="Start typing or paste your text here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Total Characters", value: stats.total, color: "text-blue-500" },
            { label: "Without Spaces", value: stats.noSpaces, color: "text-green-500" },
            { label: "Letters", value: stats.letters, color: "text-purple-500" },
            { label: "Digits", value: stats.digits, color: "text-orange-500" },
            { label: "Spaces", value: stats.spaces, color: "text-cyan-500" },
            { label: "Special Chars", value: stats.special, color: "text-pink-500" },
            { label: "Uppercase", value: stats.uppercase, color: "text-red-500" },
            { label: "Lowercase", value: stats.lowercase, color: "text-yellow-500" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[var(--muted)] rounded-xl p-4 text-center"
            >
              <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
              <div className="text-sm text-[var(--muted-foreground)]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
