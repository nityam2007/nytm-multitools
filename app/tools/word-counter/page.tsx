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
            { label: "Words", value: stats.words, icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg> },
            { label: "Characters", value: stats.characters, icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg> },
            { label: "Characters (no spaces)", value: stats.charactersNoSpaces, icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
            { label: "Sentences", value: stats.sentences, icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg> },
            { label: "Paragraphs", value: stats.paragraphs, icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg> },
            { label: "Lines", value: stats.lines, icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg> },
            { label: "Reading Time", value: stats.readingTime, icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> },
            { label: "Speaking Time", value: stats.speakingTime, icon: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg> },
          ].map((stat) => (
            <div
              key={stat.label}
              className="bg-[var(--muted)] rounded-xl p-4 text-center"
            >
              <div className="flex justify-center mb-1 text-[var(--foreground)]">{stat.icon}</div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-[var(--muted-foreground)]">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </ToolLayout>
  );
}
