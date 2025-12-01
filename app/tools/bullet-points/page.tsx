"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("bullet-points")!;
const similarTools = getToolsByCategory("text").filter(t => t.slug !== "bullet-points");

export default function BulletPointsPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [bulletStyle, setBulletStyle] = useState<"•" | "-" | "*" | "→">("•");

  const convertToBulletPoints = (text: string): string => {
    if (!text.trim()) return "";

    // Split by sentences or line breaks
    let items: string[] = [];
    
    // First try splitting by line breaks
    const lines = text.split(/\n+/).filter(l => l.trim());
    
    if (lines.length > 1) {
      items = lines;
    } else {
      // Split by sentences
      items = text
        .replace(/([.!?])\s+/g, "$1|||")
        .split("|||")
        .filter(s => s.trim().length > 0);
    }

    // Clean and format each item
    const bulletPoints = items
      .map(item => item.trim())
      .filter(item => item.length > 0)
      .map(item => {
        // Remove leading bullet points if they exist
        let clean = item.replace(/^[\s•\-\*→]+/, "").trim();
        // Capitalize first letter
        clean = clean.charAt(0).toUpperCase() + clean.slice(1);
        // Remove trailing period if exists
        clean = clean.replace(/\.+$/, "");
        return `${bulletStyle} ${clean}`;
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

      await logToolUsage({
        toolName: tool.name,
        toolCategory: tool.category,
        inputType: "text",
        rawInput: input,
        outputResult: result,
        processingDuration: Date.now() - startTime,
        metadata: { bulletStyle },
      });
    } catch (error) {
      console.error("Error converting to bullet points:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <TextArea
          label="Input Text"
          placeholder="Paste your text here to convert into bullet points..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium mb-2">Bullet Style</label>
          <div className="flex gap-2">
            {(["•", "-", "*", "→"] as const).map((style) => (
              <button
                key={style}
                onClick={() => setBulletStyle(style)}
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
            "Convert to Bullet Points"
          )}
        </button>

        <OutputBox
          label="Bullet Points"
          value={output}
          downloadFileName="bullet-points.txt"
        />
      </div>
    </ToolLayout>
  );
}
