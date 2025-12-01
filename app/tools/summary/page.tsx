"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("summary")!;
const similarTools = getToolsByCategory("text").filter(t => t.slug !== "summary");

export default function SummaryPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const generateSummary = (text: string): string => {
    if (!text.trim()) return "";

    // Split into sentences
    const sentences = text
      .replace(/([.!?])\s*(?=[A-Z])/g, "$1|")
      .split("|")
      .filter(s => s.trim().length > 0);

    if (sentences.length <= 2) {
      return text.trim();
    }

    // Score sentences based on various factors
    const wordFrequency: Record<string, number> = {};
    const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    
    // Calculate word frequency
    words.forEach(word => {
      if (!["the", "and", "for", "are", "but", "not", "you", "all", "can", "had", "her", "was", "one", "our", "out", "has", "have", "been", "were", "said", "each", "she", "which", "their", "will", "other", "about", "many", "then", "them", "these", "some", "would", "make", "like", "into", "time", "very", "when", "come", "made", "find", "more", "long", "way", "could", "people", "than", "first", "water", "been", "call", "who", "oil", "now", "find", "long", "down", "day", "did", "get", "come", "made", "may", "part"].includes(word)) {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      }
    });

    // Score each sentence
    const scoredSentences = sentences.map((sentence, index) => {
      let score = 0;
      const sentenceWords = sentence.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
      
      // Position scoring (first and last sentences are important)
      if (index === 0) score += 2;
      if (index === sentences.length - 1) score += 1;
      
      // Word frequency scoring
      sentenceWords.forEach(word => {
        score += wordFrequency[word] || 0;
      });
      
      // Normalize by sentence length
      score = score / Math.sqrt(sentenceWords.length || 1);
      
      return { sentence: sentence.trim(), score, index };
    });

    // Sort by score and take top sentences
    const numSentences = Math.max(2, Math.ceil(sentences.length * 0.3));
    const topSentences = scoredSentences
      .sort((a, b) => b.score - a.score)
      .slice(0, numSentences)
      .sort((a, b) => a.index - b.index)
      .map(s => s.sentence);

    return topSentences.join(" ");
  };

  const handleProcess = async () => {
    if (!input.trim()) return;

    setLoading(true);
    const startTime = Date.now();

    try {
      const result = generateSummary(input);
      setOutput(result);

      // Log to archive
      await logToolUsage({
        toolName: tool.name,
        toolCategory: tool.category,
        inputType: "text",
        rawInput: input,
        outputResult: result,
        processingDuration: Date.now() - startTime,
      });
    } catch (error) {
      console.error("Error generating summary:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <TextArea
          label="Input Text"
          placeholder="Paste your text here to generate a summary..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={handleProcess}
          disabled={loading || !input.trim()}
          className="btn btn-primary w-full py-3"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="spinner" />
              Generating Summary...
            </span>
          ) : (
            "Generate Summary"
          )}
        </button>

        <OutputBox
          label="Summary"
          value={output}
          downloadFileName="summary.txt"
        />

        {output && (
          <div className="text-sm text-[var(--muted-foreground)] flex gap-4">
            <span>Original: {input.length} chars</span>
            <span>Summary: {output.length} chars</span>
            <span>Reduced by: {Math.round((1 - output.length / input.length) * 100)}%</span>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
