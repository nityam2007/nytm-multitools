// Conservative Markdown cleanup that protects code regions | TypeScript
"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { Button } from "@/components/Button";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("markdown-clean")!;
const similarTools = getToolsByCategory("dev").filter(t => t.slug !== "markdown-clean");

type CleanOptions = {
  normalizeHeaders: boolean;
  fixListFormatting: boolean;
  removeExtraBlankLines: boolean;
  normalizeLinks: boolean;
  trimWhitespace: boolean;
};

function cleanMarkdown(text: string, options: CleanOptions): string {
  if (!text.trim()) return "";
  let fence: { char: string; length: number } | null = null;
  let inlineRun = 0;
  let blankLines = 0;
  let lastProtected = false;
  const output: string[] = [];
  for (const chunk of text.split(/(?<=\n)/)) {
    const eol = chunk.endsWith("\r\n") ? "\r\n" : chunk.endsWith("\n") ? "\n" : "";
    let line = chunk.slice(0, chunk.length - eol.length);
    const marker = line.match(/^ {0,3}(`{3,}|~{3,})(.*)$/);
    if (fence) {
      if (marker && marker[1][0] === fence.char && marker[1].length >= fence.length && !marker[2].trim()) fence = null;
      output.push(chunk);
      blankLines = 0;
      lastProtected = true;
      continue;
    }
    if (!inlineRun && marker && !(marker[1][0] === "`" && marker[2].includes("`"))) {
      fence = { char: marker[1][0], length: marker[1].length };
      output.push(chunk);
      blankLines = 0;
      lastProtected = true;
      continue;
    }
    // Leave indented code, quoted blocks and lines containing code spans intact.
    const wasInline = inlineRun > 0;
    if (!/^(?: {4}|\t| {0,3}>)/.test(line)) {
      for (const run of line.matchAll(/(?<!\\)`+/g)) {
        if (!inlineRun) inlineRun = run[0].length;
        else if (run[0].length === inlineRun) inlineRun = 0;
      }
    }
    if (wasInline || line.includes("`") || /^(?: {4}|\t| {0,3}>)/.test(line)) {
      output.push(chunk);
      blankLines = 0;
      lastProtected = true;
      continue;
    }
    lastProtected = false;
    if (options.trimWhitespace) line = line.replace(/[\t ]+$/, match => / {2,}$/.test(match) && line.trim() ? "  " : "");
    if (options.normalizeHeaders) {
      line = line.replace(/^( {0,3}#{1,6})([^\s#])/, "$1 $2");
      line = line.replace(/^( {0,3}#{1,6}\s.+?)\s+#+\s*$/, "$1");
    }
    if (options.fixListFormatting && !/^\s*([-*_])(?:\s*\1){2,}\s*$/.test(line) && !/^\s*\*.*\*\s*$/.test(line)) {
      line = line.replace(/^( {0,3}[-*+])(?=[^\s])/, "$1 ");
      line = line.replace(/^( {0,3}\d+[.)])(?=[^\s])/, "$1 ");
    }
    if (options.normalizeLinks) {
      line = line.replace(/\[([^\[\]\n]+)\]\([\t ]*([^()\n]+?)[\t ]*\)/g, (_, label: string, target: string) => `[${label.trim()}](${target.trim()})`);
    }
    blankLines = line.trim() ? 0 : blankLines + 1;
    if (!options.removeExtraBlankLines || blankLines <= 1) output.push(line + eol);
  }
  const result = output.join("");
  return lastProtected || result.endsWith("\n") ? result : result + "\n";
}

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

  const handleProcess = async () => {
    if (!input.trim()) return;

    setLoading(true);
    const startTime = Date.now();

    try {
      const result = cleanMarkdown(input, options);
      setOutput(result);

      void logToolUsage({
        toolName: tool.name,
        toolCategory: tool.category,
        inputType: "text",
        rawInput: input,
        outputResult: result,
        processingDuration: Date.now() - startTime,
        metadata: options,
      }).catch(error => console.error("Usage logging failed:", error));
    } catch (error) {
      console.error("Error cleaning markdown:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <Button variant="secondary" onClick={() => { setInput("#Project\n\n-item one\n\n\n```js\nconst label = '( keep spaces )';\n```"); setOutput(""); }}>Load before/after example</Button>
        <TextArea
          label="Input Markdown"
          placeholder="Paste your markdown here to clean and standardize..."
          value={input}
          onChange={(e) => { setInput(e.target.value); setOutput(""); }}
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
                  onChange={(e) => {
                    setOptions((prev) => ({ ...prev, [key]: e.target.checked }));
                    setOutput("");
                  }}
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
