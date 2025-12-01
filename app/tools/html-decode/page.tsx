"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("html-decode")!;
const similarTools = getToolsByCategory("dev").filter(t => t.slug !== "html-decode");

export default function HtmlDecodePage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleDecode = async () => {
    if (!input.trim()) return;
    const startTime = Date.now();

    const decoded = input
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'")
      .replace(/&#x27;/g, "'")
      .replace(/&#x2F;/g, "/")
      .replace(/&nbsp;/g, " ");

    setOutput(decoded);

    await logToolUsage({
      toolName: tool.name,
      toolCategory: tool.category,
      inputType: "text",
      rawInput: input,
      outputResult: decoded,
      processingDuration: Date.now() - startTime,
    });
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <TextArea
          label="HTML Encoded Input"
          placeholder="Enter HTML entities to decode..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={handleDecode}
          disabled={!input.trim()}
          className="btn btn-primary w-full py-3"
        >
          Decode HTML
        </button>

        <OutputBox label="Decoded Output" value={output} downloadFileName="html-decoded.txt" />
      </div>
    </ToolLayout>
  );
}
