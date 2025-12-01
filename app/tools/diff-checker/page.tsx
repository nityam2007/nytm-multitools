"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("diff-checker")!;
const similarTools = getToolsByCategory("dev").filter(t => t.slug !== "diff-checker");

interface DiffLine {
  type: "added" | "removed" | "unchanged";
  content: string;
  lineNumber: { left?: number; right?: number };
}

function computeDiff(text1: string, text2: string): DiffLine[] {
  const lines1 = text1.split("\n");
  const lines2 = text2.split("\n");
  const result: DiffLine[] = [];
  
  // Simple LCS-based diff
  const lcs = computeLCS(lines1, lines2);
  let i = 0, j = 0, k = 0;
  
  while (i < lines1.length || j < lines2.length) {
    if (k < lcs.length && i < lines1.length && lines1[i] === lcs[k]) {
      if (j < lines2.length && lines2[j] === lcs[k]) {
        result.push({
          type: "unchanged",
          content: lines1[i],
          lineNumber: { left: i + 1, right: j + 1 },
        });
        i++; j++; k++;
      } else {
        result.push({
          type: "added",
          content: lines2[j],
          lineNumber: { right: j + 1 },
        });
        j++;
      }
    } else if (i < lines1.length) {
      result.push({
        type: "removed",
        content: lines1[i],
        lineNumber: { left: i + 1 },
      });
      i++;
    } else {
      result.push({
        type: "added",
        content: lines2[j],
        lineNumber: { right: j + 1 },
      });
      j++;
    }
  }
  
  return result;
}

function computeLCS(a: string[], b: string[]): string[] {
  const m = a.length, n = b.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      if (a[i - 1] === b[j - 1]) {
        dp[i][j] = dp[i - 1][j - 1] + 1;
      } else {
        dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
      }
    }
  }
  
  const lcs: string[] = [];
  let i = m, j = n;
  while (i > 0 && j > 0) {
    if (a[i - 1] === b[j - 1]) {
      lcs.unshift(a[i - 1]);
      i--; j--;
    } else if (dp[i - 1][j] > dp[i][j - 1]) {
      i--;
    } else {
      j--;
    }
  }
  
  return lcs;
}

export default function DiffCheckerPage() {
  const [text1, setText1] = useState("");
  const [text2, setText2] = useState("");
  const [diff, setDiff] = useState<DiffLine[]>([]);
  const [stats, setStats] = useState({ added: 0, removed: 0, unchanged: 0 });

  const handleCompare = async () => {
    if (!text1 && !text2) return;
    const startTime = Date.now();

    const result = computeDiff(text1, text2);
    setDiff(result);
    
    const newStats = result.reduce(
      (acc, line) => {
        acc[line.type]++;
        return acc;
      },
      { added: 0, removed: 0, unchanged: 0 }
    );
    setStats(newStats);

    await logToolUsage({
      toolName: tool.name,
      toolCategory: tool.category,
      inputType: "text",
      rawInput: `Text 1: ${text1.length} chars, Text 2: ${text2.length} chars`,
      outputResult: `+${newStats.added} -${newStats.removed} =${newStats.unchanged}`,
      processingDuration: Date.now() - startTime,
    });
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <TextArea
            label="Original Text"
            placeholder="Enter original text..."
            value={text1}
            onChange={(e) => setText1(e.target.value)}
            rows={10}
          />
          <TextArea
            label="Modified Text"
            placeholder="Enter modified text..."
            value={text2}
            onChange={(e) => setText2(e.target.value)}
            rows={10}
          />
        </div>

        <button
          onClick={handleCompare}
          disabled={!text1 && !text2}
          className="btn btn-primary w-full py-3"
        >
          Compare
        </button>

        {diff.length > 0 && (
          <>
            <div className="flex gap-4 justify-center">
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-green-200 dark:bg-green-900 rounded" />
                <span className="text-sm">Added ({stats.added})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-red-200 dark:bg-red-900 rounded" />
                <span className="text-sm">Removed ({stats.removed})</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-4 h-4 bg-gray-200 dark:bg-gray-700 rounded" />
                <span className="text-sm">Unchanged ({stats.unchanged})</span>
              </div>
            </div>

            <div className="card overflow-hidden">
              <div className="max-h-96 overflow-y-auto font-mono text-sm">
                {diff.map((line, i) => (
                  <div
                    key={i}
                    className={`flex px-4 py-1 ${
                      line.type === "added"
                        ? "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                        : line.type === "removed"
                        ? "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                        : ""
                    }`}
                  >
                    <span className="w-10 text-muted-foreground text-right pr-2 select-none">
                      {line.lineNumber.left || ""}
                    </span>
                    <span className="w-10 text-muted-foreground text-right pr-2 select-none border-r border-border mr-2">
                      {line.lineNumber.right || ""}
                    </span>
                    <span className="w-4 select-none">
                      {line.type === "added" ? "+" : line.type === "removed" ? "-" : " "}
                    </span>
                    <span className="flex-1 whitespace-pre">{line.content}</span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
