"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("base64-encode")!;
const similarTools = getToolsByCategory("dev").filter(t => t.slug !== "base64-encode");

export default function Base64EncodePage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEncode = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError("");
    const startTime = Date.now();

    try {
      const encoded = btoa(unescape(encodeURIComponent(input)));
      setOutput(encoded);

      await logToolUsage({
        toolName: tool.name,
        toolCategory: tool.category,
        inputType: "text",
        rawInput: input,
        outputResult: encoded,
        processingDuration: Date.now() - startTime,
      });
    } catch (e) {
      setError("Failed to encode. Make sure your input contains valid characters.");
      setOutput("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <TextArea
          label="Input Text"
          placeholder="Enter text to encode to Base64..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError("");
          }}
          error={error}
        />

        <button
          onClick={handleEncode}
          disabled={loading || !input.trim()}
          className="btn btn-primary w-full py-3"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="spinner" />
              Encoding...
            </span>
          ) : (
            "Encode to Base64"
          )}
        </button>

        <OutputBox
          label="Base64 Output"
          value={output}
          downloadFileName="encoded.txt"
        />
      </div>
    </ToolLayout>
  );
}
