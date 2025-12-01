"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("word-counter")!;
const similarTools = getToolsByCategory("text").filter(t => t.slug !== "word-counter");

interface Stats {
  characters: number;
  charactersNoSpaces: number;
  words: number;
  sentences: number;
  paragraphs: number;
  lines: number;
  readingTime: string;
  speakingTime: string;
}

export default function WordCounterPage() {
  const [input, setInput] = useState("");

  const calculateStats = (text: string): Stats => {
    const characters = text.length;
    const charactersNoSpaces = text.replace(/\s/g, "").length;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length;
    const paragraphs = text.split(/\n\n+/).filter(p => p.trim()).length;
    const lines = text.split(/\n/).length;
    
    // Average reading speed: 200-250 words per minute
    const readingMinutes = Math.ceil(words / 225);
    const readingTime = readingMinutes < 1 ? "< 1 min" : `${readingMinutes} min`;
    
    // Average speaking speed: 125-150 words per minute
    const speakingMinutes = Math.ceil(words / 137);
    const speakingTime = speakingMinutes < 1 ? "< 1 min" : `${speakingMinutes} min`;

    return {
      characters,
      charactersNoSpaces,
      words,
      sentences,
      paragraphs,
      lines,
      readingTime,
      speakingTime,
    };
  };

  const stats = calculateStats(input);

  const handleInputChange = async (value: string) => {
    setInput(value);
    
    // Log only when there's substantial content
    if (value.length > 100) {
      await logToolUsage({
        toolName: tool.name,
        toolCategory: tool.category,
        inputType: "text",
        rawInput: value.substring(0, 500),
        outputResult: JSON.stringify(calculateStats(value)),
        metadata: { wordCount: calculateStats(value).words },
      });
    }
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <TextArea
          label="Enter your text"
          placeholder="Start typing or paste your text here..."
          value={input}
          onChange={(e) => handleInputChange(e.target.value)}
        />

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Words", value: stats.words, icon: "📝" },
            { label: "Characters", value: stats.characters, icon: "🔤" },
            { label: "Characters (no spaces)", value: stats.charactersNoSpaces, icon: "🔡" },
            { label: "Sentences", value: stats.sentences, icon: "📋" },
            { label: "Paragraphs", value: stats.paragraphs, icon: "📄" },
            { label: "Lines", value: stats.lines, icon: "📏" },
            { label: "Reading Time", value: stats.readingTime, icon: "👁️" },
            { label: "Speaking Time", value: stats.speakingTime, icon: "🎤" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[var(--muted)] rounded-xl p-4 text-center"
            >
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-[var(--muted-foreground)]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
