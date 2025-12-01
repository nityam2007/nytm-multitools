"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("json-pretty")!;
const similarTools = getToolsByCategory("dev").filter(t => t.slug !== "json-pretty");

export default function JsonPrettyPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [indentSize, setIndentSize] = useState(2);

  const prettifyJson = (text: string): { success: boolean; result: string; error?: string } => {
    if (!text.trim()) return { success: false, result: "", error: "Input is empty" };

    try {
      const parsed = JSON.parse(text);
      const formatted = JSON.stringify(parsed, null, indentSize);
      return { success: true, result: formatted };
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Invalid JSON";
      return { success: false, result: "", error: errorMessage };
    }
  };

  const handleProcess = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError("");
    const startTime = Date.now();

    try {
      const { success, result, error: parseError } = prettifyJson(input);
      
      if (success) {
        setOutput(result);
        setError("");
        
        await logToolUsage({
          toolName: tool.name,
          toolCategory: tool.category,
          inputType: "text",
          rawInput: input,
          outputResult: result,
          processingDuration: Date.now() - startTime,
          metadata: { indentSize },
        });
      } else {
        setError(parseError || "Invalid JSON");
        setOutput("");
      }
    } catch (error) {
      console.error("Error prettifying JSON:", error);
      setError("An error occurred while processing");
    } finally {
      setLoading(false);
    }
  };

  const handleMinify = async () => {
    if (!input.trim()) return;

    setLoading(true);
    setError("");
    const startTime = Date.now();

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError("");

      await logToolUsage({
        toolName: tool.name + " (Minify)",
        toolCategory: tool.category,
        inputType: "text",
        rawInput: input,
        outputResult: minified,
        processingDuration: Date.now() - startTime,
      });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Invalid JSON";
      setError(errorMessage);
      setOutput("");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <TextArea
          label="Input JSON"
          placeholder='{"example": "Paste your JSON here..."}'
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError("");
          }}
          error={error}
        />

        <div>
          <label className="block text-sm font-medium mb-2">Indent Size</label>
          <div className="flex gap-2">
            {[2, 4, 8].map((size) => (
              <button
                key={size}
                onClick={() => setIndentSize(size)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  indentSize === size
                    ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                    : "border-[var(--border)] hover:border-[var(--primary)]/50"
                }`}
              >
                {size} spaces
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleProcess}
            disabled={loading || !input.trim()}
            className="btn btn-primary flex-1 py-3"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="spinner" />
                Processing...
              </span>
            ) : (
              "Beautify JSON"
            )}
          </button>
          <button
            onClick={handleMinify}
            disabled={loading || !input.trim()}
            className="btn btn-secondary flex-1 py-3"
          >
            Minify JSON
          </button>
        </div>

        <OutputBox
          label="Output"
          value={output}
          format="json"
          downloadFileName="formatted.json"
        />

        {output && (
          <div className="text-sm text-[var(--muted-foreground)]">
            Size: {output.length} characters
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
