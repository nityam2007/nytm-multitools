"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("json-path")!;
const similarTools = getToolsByCategory("dev").filter(t => t.slug !== "json-path");

export default function JsonPathPage() {
  const [input, setInput] = useState("");
  const [path, setPath] = useState("");

  const { output, error } = useMemo(() => {
    if (!input.trim() || !path.trim()) return { output: "", error: "" };
    
    try {
      const data = JSON.parse(input);
      
      // Simple path parser (supports dot notation and array indices)
      const parts = path.replace(/\[(\d+)\]/g, ".$1").split(".").filter(Boolean);
      let result: unknown = data;
      
      for (const part of parts) {
        if (result === null || result === undefined) {
          return { output: "", error: `Path not found: ${path}` };
        }
        result = (result as Record<string, unknown>)[part];
      }
      
      if (result === undefined) {
        return { output: "", error: `Path not found: ${path}` };
      }
      
      const outputStr = typeof result === "object" ? JSON.stringify(result, null, 2) : String(result);
      return { output: outputStr, error: "" };
    } catch (e) {
      return { output: "", error: "Invalid JSON" };
    }
  }, [input, path]);

  // Get available paths from JSON
  const availablePaths = useMemo(() => {
    if (!input.trim()) return [];
    try {
      const data = JSON.parse(input);
      const paths: string[] = [];
      
      const traverse = (obj: unknown, currentPath: string) => {
        if (typeof obj === "object" && obj !== null) {
          Object.keys(obj).forEach((key) => {
            const newPath = currentPath ? `${currentPath}.${key}` : key;
            paths.push(newPath);
            if (paths.length < 20) {
              traverse((obj as Record<string, unknown>)[key], newPath);
            }
          });
        }
      };
      
      traverse(data, "");
      return paths.slice(0, 20);
    } catch {
      return [];
    }
  }, [input]);

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <TextArea
          label="Input JSON"
          placeholder="Paste your JSON here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium mb-2">Path (e.g., user.name or items[0].id)</label>
          <input
            type="text"
            value={path}
            onChange={(e) => setPath(e.target.value)}
            placeholder="Enter path..."
            className="w-full px-4 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)]"
          />
          {availablePaths.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {availablePaths.map((p) => (
                <button
                  key={p}
                  onClick={() => setPath(p)}
                  className="px-2 py-1 text-xs rounded bg-[var(--muted)] hover:bg-[var(--accent)]"
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
            {error}
          </div>
        )}

        <OutputBox label="Result" value={output} />
      </div>
    </ToolLayout>
  );
}
