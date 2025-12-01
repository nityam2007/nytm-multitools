"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("url-decode")!;
const similarTools = getToolsByCategory("dev").filter(t => t.slug !== "url-decode");

export default function UrlDecodePage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleDecode = async () => {
    if (!input.trim()) return;
    const startTime = Date.now();
    setError("");

    try {
      const decoded = decodeURIComponent(input);
      setOutput(decoded);

      await logToolUsage({
        toolName: tool.name,
        toolCategory: tool.category,
        inputType: "text",
        rawInput: input,
        outputResult: decoded,
        processingDuration: Date.now() - startTime,
      });
    } catch (e) {
      setError("Invalid URL-encoded string");
      setOutput("");
    }
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <TextArea
          label="URL Encoded Input"
          placeholder="Enter URL encoded text to decode..."
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(""); }}
          error={error}
        />

        <button
          onClick={handleDecode}
          disabled={!input.trim()}
          className="btn btn-primary w-full py-3"
        >
          Decode URL
        </button>

        <OutputBox label="Decoded Output" value={output} downloadFileName="decoded-url.txt" />
      </div>
    </ToolLayout>
  );
}
