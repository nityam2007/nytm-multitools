"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("markdown-clean")!;
const similarTools = getToolsByCategory("dev").filter(t => t.slug !== "markdown-clean");

export default function MarkdownCleanPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);
  const [options, setOptions] = useState({
    normalizeHeaders: true,
    fixListFormatting: true,
    removeExtraBlankLines: true,
    normalizeLinks: true,
    trimWhitespace: true,
  });

  const cleanMarkdown = (text: string): string => {
    if (!text.trim()) return "";

    let result = text;

    // Trim whitespace from each line
    if (options.trimWhitespace) {
      result = result.split("\n").map(line => line.trimEnd()).join("\n");
    }

    // Normalize headers (ensure space after #)
    if (options.normalizeHeaders) {
      result = result.replace(/^(#{1,6})([^\s#])/gm, "$1 $2");
      // Remove extra # at end of headers
      result = result.replace(/^(#{1,6}\s.+?)\s*#+\s*$/gm, "$1");
    }

    // Fix list formatting (ensure space after - or *)
    if (options.fixListFormatting) {
      result = result.replace(/^(\s*[-*+])([^\s])/gm, "$1 $2");
      // Numbered lists
      result = result.replace(/^(\s*\d+\.)([^\s])/gm, "$1 $2");
    }

    // Normalize links
    if (options.normalizeLinks) {
      // Remove extra spaces in links
      result = result.replace(/\[\s+/g, "[");
      result = result.replace(/\s+\]/g, "]");
      result = result.replace(/\(\s+/g, "(");
      result = result.replace(/\s+\)/g, ")");
    }

    // Remove extra blank lines (more than 2 consecutive)
    if (options.removeExtraBlankLines) {
      result = result.replace(/\n{3,}/g, "\n\n");
    }

    // Ensure file ends with single newline
    result = result.trimEnd() + "\n";

    return result;
  };

  const handleProcess = async () => {
    if (!input.trim()) return;

    setLoading(true);
    const startTime = Date.now();

    try {
      const result = cleanMarkdown(input);
      setOutput(result);

      await logToolUsage({
        toolName: tool.name,
        toolCategory: tool.category,
        inputType: "text",
        rawInput: input,
        outputResult: result,
        processingDuration: Date.now() - startTime,
        metadata: options,
      });
    } catch (error) {
      console.error("Error cleaning markdown:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <TextArea
          label="Input Markdown"
          placeholder="Paste your markdown here to clean and standardize..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium mb-3">Options</label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { key: "normalizeHeaders", label: "Normalize Headers" },
              { key: "fixListFormatting", label: "Fix List Formatting" },
              { key: "removeExtraBlankLines", label: "Remove Extra Blank Lines" },
              { key: "normalizeLinks", label: "Normalize Links" },
              { key: "trimWhitespace", label: "Trim Whitespace" },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options[key as keyof typeof options]}
                  onChange={(e) =>
                    setOptions((prev) => ({ ...prev, [key]: e.target.checked }))
                  }
                  className="w-4 h-4 rounded border-[var(--border)]"
                />
                <span className="text-sm">{label}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          onClick={handleProcess}
          disabled={loading || !input.trim()}
          className="btn btn-primary w-full py-3"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="spinner" />
              Cleaning...
            </span>
          ) : (
            "Clean Markdown"
          )}
        </button>

        <OutputBox
          label="Cleaned Markdown"
          value={output}
          downloadFileName="cleaned.md"
        />
      </div>
    </ToolLayout>
  );
}
