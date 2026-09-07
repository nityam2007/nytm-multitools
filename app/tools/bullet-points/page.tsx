// Format lists while preserving each item's wording | TypeScript
"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { Select } from "@/components/Select";
import { Button } from "@/components/Button";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("bullet-points")!;
const similarTools = getToolsByCategory("text").filter(t => t.slug !== "bullet-points");

export default function BulletPointsPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [bulletStyle, setBulletStyle] = useState<"•" | "-" | "*" | "→">("•");
  const [mode, setMode] = useState("bullets");
  const [splitBy, setSplitBy] = useState("auto");

  const convertToBulletPoints = (text: string): string => {
    if (!text.trim()) return "";

    // Split by sentences or line breaks
    let items: string[] = [];
    
    // First try splitting by line breaks
    const lines = text.split(/\n+/).filter(l => l.trim());
    
    if (splitBy === "lines" || (splitBy === "auto" && lines.length > 1)) {
      items = lines;
    } else {
      // Split by sentences
      items = text
        .split(/(?<=[.!?])\s+/)
        .filter(s => s.trim().length > 0);
    }

    // Clean and format each item
    const bulletPoints = items
      .map(item => item.trim())
      .filter(item => item.length > 0)
      .map((item, index) => {
        // Remove leading bullet points if they exist
        const clean = item.replace(/^(?:[•\-*+→]|\d+[.)])\s+/, "");
        if (mode === "remove") return clean;
        return mode === "numbered" ? `${index + 1}. ${clean}` : `${bulletStyle} ${clean}`;
      });

    return bulletPoints.join("\n");
  };

  const handleProcess = async () => {
    if (!input.trim()) return;

    setLoading(true);
    const startTime = Date.now();

    try {
      const result = convertToBulletPoints(input);
      setOutput(result);

      void logToolUsage({
        toolName: tool.name,
        toolCategory: tool.category,
        inputType: "text",
        rawInput: input,
        outputResult: result,
        processingDuration: Date.now() - startTime,
        metadata: { bulletStyle, mode, splitBy },
      }).catch(error => console.error("Usage logging failed:", error));
    } catch (error) {
      console.error("Error converting to bullet points:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <Button variant="secondary" onClick={() => { setInput("Draft the README. Review the examples. Publish the update."); setOutput(""); }}>Load example</Button>
        <TextArea
          label="Input Text"
          placeholder="Paste your text here to convert into bullet points..."
          value={input}
          onChange={(e) => { setInput(e.target.value); setOutput(""); }}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <Select label="List format" value={mode} onChange={e => { setMode(e.target.value); setOutput(""); }} options={[
            { value: "bullets", label: "Bullet points" }, { value: "numbered", label: "Numbered list" }, { value: "remove", label: "Remove list markers" },
          ]} />
          <Select label="Split text by" value={splitBy} onChange={e => { setSplitBy(e.target.value); setOutput(""); }} options={[
            { value: "auto", label: "Automatic: lines, otherwise sentences" }, { value: "lines", label: "Line breaks" }, { value: "sentences", label: "Sentences" },
          ]} />
        </div>

        {mode === "bullets" && (
        <div>
          <label className="block text-sm font-medium mb-2">Bullet Style</label>
          <div className="flex gap-2">
            {(["•", "-", "*", "→"] as const).map((style) => (
              <button
                key={style}
                aria-label={`Use ${style} bullets`}
                aria-pressed={bulletStyle === style}
                onClick={() => { setBulletStyle(style); setOutput(""); }}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  bulletStyle === style
                    ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                    : "border-[var(--border)] hover:border-[var(--primary)]/50"
                }`}
              >
                {style}
              </button>
            ))}
          </div>
        </div>
        )}

        <button
          onClick={handleProcess}
          disabled={loading || !input.trim()}
          className="btn btn-primary w-full py-3"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="spinner" />
              Converting...
            </span>
          ) : (
            "Format list"
          )}
        </button>

        <OutputBox
          label="Formatted list"
          value={output}
          downloadFileName="bullet-points.txt"
        />
      </div>
    </ToolLayout>
  );
}
