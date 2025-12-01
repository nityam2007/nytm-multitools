"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("base64-decode")!;
const similarTools = getToolsByCategory("dev").filter(t => t.slug !== "base64-decode");

export default function Base64DecodePage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDecode = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError("");
    const startTime = Date.now();

    try {
      const decoded = decodeURIComponent(escape(atob(input.trim())));
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
      setError("Invalid Base64 string. Please check your input.");
      setOutput("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <TextArea
          label="Base64 Input"
          placeholder="Enter Base64 string to decode..."
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError("");
          }}
          error={error}
        />

        <button
          onClick={handleDecode}
          disabled={loading || !input.trim()}
          className="btn btn-primary w-full py-3"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="spinner" />
              Decoding...
            </span>
          ) : (
            "Decode from Base64"
          )}
        </button>

        <OutputBox
          label="Decoded Text"
          value={output}
          downloadFileName="decoded.txt"
        />
      </div>
    </ToolLayout>
  );
}
