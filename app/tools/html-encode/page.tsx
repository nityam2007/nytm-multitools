"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("html-encode")!;
const similarTools = getToolsByCategory("dev").filter(t => t.slug !== "html-encode");

export default function HtmlEncodePage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const handleEncode = async () => {
    if (!input.trim()) return;
    const startTime = Date.now();

    const encoded = input
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");

    setOutput(encoded);

    await logToolUsage({
      toolName: tool.name,
      toolCategory: tool.category,
      inputType: "text",
      rawInput: input,
      outputResult: encoded,
      processingDuration: Date.now() - startTime,
    });
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <TextArea
          label="HTML Input"
          placeholder="Enter HTML/text to encode..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={handleEncode}
          disabled={!input.trim()}
          className="btn btn-primary w-full py-3"
        >
          Encode HTML
        </button>

        <OutputBox label="Encoded Output" value={output} downloadFileName="html-encoded.txt" />
      </div>
    </ToolLayout>
  );
}
