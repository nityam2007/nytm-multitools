"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("json-validator")!;
const similarTools = getToolsByCategory("dev").filter(t => t.slug !== "json-validator");

interface ValidationResult {
  valid: boolean;
  error?: string;
  line?: number;
  column?: number;
}

export default function JsonValidatorPage() {
  const [input, setInput] = useState("");

  const validate = (): ValidationResult => {
    if (!input.trim()) return { valid: true };
    
    try {
      JSON.parse(input);
      return { valid: true };
    } catch (e) {
      const error = e as SyntaxError;
      const match = error.message.match(/position (\d+)/);
      if (match) {
        const position = parseInt(match[1]);
        const lines = input.substring(0, position).split("\n");
        return {
          valid: false,
          error: error.message,
          line: lines.length,
          column: lines[lines.length - 1].length + 1,
        };
      }
      return { valid: false, error: error.message };
    }
  };

  const result = validate();

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <TextArea
          label="JSON to Validate"
          placeholder="Paste your JSON here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        {input.trim() && (
          <div
            className={`p-4 rounded-xl ${
              result.valid
                ? "bg-green-500/10 border border-green-500/30"
                : "bg-red-500/10 border border-red-500/30"
            }`}
          >
            <div className="flex items-center gap-2">
              <span className="text-2xl">{result.valid ? "✅" : "❌"}</span>
              <div>
                <p className={`font-semibold ${result.valid ? "text-green-500" : "text-red-500"}`}>
                  {result.valid ? "Valid JSON" : "Invalid JSON"}
                </p>
                {result.error && (
                  <p className="text-sm text-red-400 mt-1">
                    {result.error}
                    {result.line && ` (Line ${result.line}, Column ${result.column})`}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {input.trim() && result.valid && (
          <div className="bg-[var(--muted)] rounded-xl p-4">
            <h3 className="font-semibold mb-2">JSON Statistics</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-[var(--muted-foreground)]">Size:</span>{" "}
                {input.length} characters
              </div>
              <div>
                <span className="text-[var(--muted-foreground)]">Minified:</span>{" "}
                {JSON.stringify(JSON.parse(input)).length} characters
              </div>
              <div>
                <span className="text-[var(--muted-foreground)]">Type:</span>{" "}
                {Array.isArray(JSON.parse(input)) ? "Array" : "Object"}
              </div>
              <div>
                <span className="text-[var(--muted-foreground)]">Keys:</span>{" "}
                {Object.keys(JSON.parse(input)).length}
              </div>
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
