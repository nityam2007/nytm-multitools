"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("css-minify")!;
const similarTools = getToolsByCategory("dev").filter(t => t.slug !== "css-minify");

export default function CssMinifyPage() {
  const [input, setInput] = useState("");
  const [removeComments, setRemoveComments] = useState(true);

  const minify = (): string => {
    if (!input.trim()) return "";
    
    let result = input;
    
    if (removeComments) {
      result = result.replace(/\/\*[\s\S]*?\*\//g, "");
    }
    
    return result
      // Remove newlines and extra whitespace
      .replace(/\s+/g, " ")
      // Remove space around special characters
      .replace(/\s*([{}:;,>+~])\s*/g, "$1")
      // Remove last semicolon before }
      .replace(/;}/g, "}")
      // Remove leading/trailing whitespace
      .trim();
  };

  const output = minify();
  const savedBytes = input.length - output.length;
  const savedPercent = input.length > 0 ? ((savedBytes / input.length) * 100).toFixed(1) : 0;

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={removeComments}
            onChange={(e) => setRemoveComments(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Remove comments</span>
        </label>

        <TextArea
          label="Input CSS"
          placeholder="Paste your CSS here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {output && (
          <div className="text-sm text-green-500">
            Saved {savedBytes} bytes ({savedPercent}% reduction)
          </div>
        )}

        <OutputBox label="Minified CSS" value={output} />
      </div>
    </ToolLayout>
  );
}
