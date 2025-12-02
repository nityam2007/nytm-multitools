"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("text-repeat")!;
const similarTools = getToolsByCategory("text").filter(t => t.slug !== "text-repeat");

export default function TextRepeatPage() {
  const [input, setInput] = useState("");
  const [count, setCount] = useState(3);
  const [separator, setSeparator] = useState("\\n");
  const [output, setOutput] = useState("");

  const repeatText = (): string => {
    if (!input || count < 1) return "";
    const sep = separator.replace(/\\n/g, "\n").replace(/\\t/g, "\t");
    return Array(count).fill(input).join(sep);
  };

  const handleGenerate = () => {
    setOutput(repeatText());
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setCount(3);
    setSeparator("\\n");
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
            Repeat any text multiple times with custom separators. Use <code className="px-1 py-0.5 bg-black/10 dark:bg-white/10 rounded text-xs">\n</code> for new lines and <code className="px-1 py-0.5 bg-black/10 dark:bg-white/10 rounded text-xs">\t</code> for tabs.
          </div>
        </div>

        <TextArea
          label="Text to Repeat"
          placeholder="Enter text to repeat..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          charCount
          helperText="The text you want to repeat multiple times"
        />

        {/* Settings Section */}
        <div className="tool-section">
          <label className="block text-sm font-semibold text-[var(--foreground)] mb-3">
            Repeat Settings
          </label>
          <div className="grid md:grid-cols-2 gap-4">
            <Input
              label="Repeat Count"
              type="number"
              min={1}
              max={1000}
              value={count}
              onChange={(e) => setCount(Math.min(1000, Math.max(1, parseInt(e.target.value) || 1)))}
              helperText="How many times to repeat (max 1000)"
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14" /></svg>}
            />
            <Input
              label="Separator"
              type="text"
              value={separator}
              onChange={(e) => setSeparator(e.target.value)}
              placeholder="e.g., \n or , or space"
              helperText="Text to insert between repetitions"
              icon={<svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>}
            />
          </div>
        </div>

        {/* Quick presets */}
        <div>
          <label className="block text-sm font-semibold text-[var(--foreground)] mb-3">
            Quick Separator Presets
          </label>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "New Line", value: "\\n" },
              { label: "Space", value: " " },
              { label: "Comma", value: ", " },
              { label: "Tab", value: "\\t" },
              { label: "None", value: "" },
            ].map((preset) => (
              <button
                key={preset.label}
                onClick={() => setSeparator(preset.value)}
                className={`option-card px-3 py-2 ${separator === preset.value ? 'active' : ''}`}
              >
                <span className="text-xs font-medium">{preset.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            variant="primary"
            size="lg"
            onClick={handleGenerate}
            disabled={!input}
            fullWidth
          >
            Generate Repeated Text
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={handleClear}
            disabled={!input && !output}
          >
            Clear
          </Button>
        </div>

        <OutputBox
          label={`Output ${output ? `(repeated ${count}x)` : ''}`}
          value={output}
          downloadFileName="repeated-text.txt"
          stats={output ? [
            { label: "Lines", value: output.split('\n').length },
            { label: "Words", value: output.split(/\s+/).filter(Boolean).length },
          ] : []}
        />

        {/* Success message */}
        {output && (
          <div className="alert alert-success">
            <svg className="w-5 h-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div className="text-sm font-medium">
              Text repeated successfully!
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
