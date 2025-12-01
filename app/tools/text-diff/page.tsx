"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("text-diff")!;
const similarTools = getToolsByCategory("text").filter(t => t.slug !== "text-diff");

interface DiffLine {
  type: "add" | "remove" | "same";
  content: string;
  lineNum1?: number;
  lineNum2?: number;
}

export default function TextDiffPage() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");

  const computeDiff = (): DiffLine[] => {
    const lines1 = text1.split("\n");
    const lines2 = text2.split("\n");
    const result: DiffLine[] = [];
    
    let i = 0, j = 0;
    
    while (i < lines1.length || j < lines2.length) {
      if (i >= lines1.length) {
        result.push({ type: "add", content: lines2[j], lineNum2: j + 1 });
        j++;
      } else if (j >= lines2.length) {
        result.push({ type: "remove", content: lines1[i], lineNum1: i + 1 });
        i++;
      } else if (lines1[i] === lines2[j]) {
        result.push({ type: "same", content: lines1[i], lineNum1: i + 1, lineNum2: j + 1 });
        i++;
        j++;
      } else {
        // Simple diff: mark as removed then added
        result.push({ type: "remove", content: lines1[i], lineNum1: i + 1 });
        result.push({ type: "add", content: lines2[j], lineNum2: j + 1 });
        i++;
        j++;
      }
    }
    
    return result;
  };

  const diff = computeDiff();
  const additions = diff.filter(d => d.type === "add").length;
  const deletions = diff.filter(d => d.type === "remove").length;

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-4">
          <TextArea
            label="Original Text"
            placeholder="Paste original text here..."
            value={text1}
            onChange={(e) => setText1(e.target.value)}
          />
          <TextArea
            label="Modified Text"
            placeholder="Paste modified text here..."
            value={text2}
            onChange={(e) => setText2(e.target.value)}
          />
        </div>

        {(text1 || text2) && (
          <>
            <div className="flex items-center gap-4">
              <span className="text-sm">
                <span className="inline-block w-3 h-3 bg-green-500/30 rounded mr-1"></span>
                {additions} additions
              </span>
              <span className="text-sm">
                <span className="inline-block w-3 h-3 bg-red-500/30 rounded mr-1"></span>
                {deletions} deletions
              </span>
            </div>

            <div className="bg-[var(--muted)] rounded-xl p-4 overflow-x-auto">
              <pre className="text-sm font-mono">
                {diff.map((line, i) => (
                  <div
                    key={i}
                    className={`px-2 py-0.5 ${
                      line.type === "add"
                        ? "bg-green-500/20 text-green-400"
                        : line.type === "remove"
                        ? "bg-red-500/20 text-red-400"
                        : ""
                    }`}
                  >
                    <span className="inline-block w-8 text-[var(--muted-foreground)]">
                      {line.lineNum1 || line.lineNum2 || ""}
                    </span>
                    <span className="inline-block w-4">
                      {line.type === "add" ? "+" : line.type === "remove" ? "-" : " "}
                    </span>
                    {line.content || " "}
                  </div>
                ))}
              </pre>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
