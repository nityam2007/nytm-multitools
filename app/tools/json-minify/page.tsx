"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("json-minify")!;
const similarTools = getToolsByCategory("dev").filter(t => t.slug !== "json-minify");

export default function JsonMinifyPage() {
  const [input, setInput] = useState("");

  const { output, error, savedBytes, savedPercent } = useMemo(() => {
    if (!input.trim()) return { output: "", error: "", savedBytes: 0, savedPercent: "0" };
    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      const bytes = input.length - minified.length;
      const percent = input.length > 0 ? ((bytes / input.length) * 100).toFixed(1) : "0";
      return { output: minified, error: "", savedBytes: bytes, savedPercent: percent };
    } catch (e) {
      return { output: "", error: "Invalid JSON", savedBytes: 0, savedPercent: "0" };
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

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 text-red-500 text-sm">
            {error}
          </div>
        )}

        {output && (
          <div className="text-sm text-green-500">
            Saved {savedBytes} bytes ({savedPercent}% reduction)
          </div>
        )}

        <OutputBox label="Minified JSON" value={output} />
      </div>
    </ToolLayout>
  );
}
