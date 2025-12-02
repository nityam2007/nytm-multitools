"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { Button } from "@/components/Button";
import { useToast } from "@/components/Toast";
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
  const toast = useToast();

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
        toast.success("JSON formatted successfully!");
        
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
        toast.error(parseError || "Invalid JSON format");
      }
    } catch (err) {
      console.error("Error prettifying JSON:", err);
      setError("An error occurred while processing");
      toast.error("An error occurred while processing");
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
      toast.success("JSON minified successfully!");

      await logToolUsage({
        toolName: tool.name + " (Minify)",
        toolCategory: tool.category,
        inputType: "text",
        rawInput: input,
        outputResult: minified,
        processingDuration: Date.now() - startTime,
        metadata: { action: "minify" },
      });
    } catch (e) {
      const errorMessage = e instanceof Error ? e.message : "Invalid JSON";
      setError(errorMessage);
      setOutput("");
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
    toast.info("Cleared all fields");
  };

  const getIndentLabel = (size: number) => {
    if (size === 2) return 'Compact';
    if (size === 4) return 'Standard';
    return 'Wide';
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        {/* Info Alert */}
        <div className="alert alert-info">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-sm" style={{ lineHeight: '1.5' }}>
            Format and validate your JSON data with customizable indentation. Your data is processed locally in your browser.
          </div>
        </div>

        <TextArea
          label="Input JSON"
          placeholder='{"example": "Paste your JSON here..."}'
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setError("");
          }}
          error={error}
          charCount
        />

        {/* Settings Section */}
        <div className="tool-section">
          <label className="block text-sm font-semibold text-[var(--foreground)] mb-3">
            Indentation Settings
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[2, 4, 8].map((size) => (
              <button
                key={size}
                onClick={() => setIndentSize(size)}
                className={`option-card ${indentSize === size ? 'active' : ''}`}
              >
                <div className="text-center">
                  <div className="text-sm font-semibold text-[var(--foreground)]">
                    {size} spaces
                  </div>
                  <div className="text-xs text-[var(--muted-foreground)] mt-1">
                    {getIndentLabel(size)}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={handleProcess}
            disabled={loading || !input.trim()}
            loading={loading}
            variant="primary"
            size="lg"
            fullWidth
          >
            {loading ? "Processing..." : "Beautify JSON"}
          </Button>
          <Button
            onClick={handleMinify}
            disabled={loading || !input.trim()}
            variant="secondary"
            size="lg"
            fullWidth
          >
            Minify JSON
          </Button>
          <Button
            onClick={handleClear}
            disabled={loading || (!input && !output)}
            variant="ghost"
            size="lg"
          >
            Clear
          </Button>
        </div>

        <OutputBox
          label="Output"
          value={output}
          format="json"
          stats={output ? [
            { label: "Lines", value: output.split('\n').length },
            { label: "Size", value: `${(output.length / 1024).toFixed(2)} KB` }
          ] : []}
        />
      </div>
    </ToolLayout>
  );
}
