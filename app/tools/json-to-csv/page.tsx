"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("json-to-csv")!;
const similarTools = getToolsByCategory("converter").filter(t => t.slug !== "json-to-csv");

function escapeCSV(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export default function JsonToCsvPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [includeHeaders, setIncludeHeaders] = useState(true);

  const handleConvert = async () => {
    if (!input.trim()) return;
    setError("");
    const startTime = Date.now();

    try {
      const data = JSON.parse(input);
      
      let array: Record<string, unknown>[];
      if (Array.isArray(data)) {
        array = data;
      } else if (typeof data === "object" && data !== null) {
        // If it's an object with a data array, use that
        if (Array.isArray(data.data)) {
          array = data.data;
        } else {
          // Wrap single object in array
          array = [data];
        }
      } else {
        throw new Error("Input must be an array or object");
      }

      if (array.length === 0) {
        setOutput("");
        return;
      }

      // Get all unique headers
      const headers = [...new Set(array.flatMap(obj => Object.keys(obj)))];
      
      const rows: string[] = [];
      
      if (includeHeaders) {
        rows.push(headers.map(escapeCSV).join(","));
      }

      for (const obj of array) {
        const row = headers.map(h => {
          const val = obj[h];
          if (val === null || val === undefined) return "";
          if (typeof val === "object") return escapeCSV(JSON.stringify(val));
          return escapeCSV(String(val));
        });
        rows.push(row.join(","));
      }

      const csv = rows.join("\n");
      setOutput(csv);

      await logToolUsage({
        toolName: tool.name,
        toolCategory: tool.category,
        inputType: "text",
        rawInput: input,
        outputResult: csv,
        processingDuration: Date.now() - startTime,
      });
    } catch (e) {
      setError("Invalid JSON. Please check your input.");
    }
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <TextArea
          label="JSON Input"
          placeholder='[{"name": "John", "age": 30}, {"name": "Jane", "age": 25}]'
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(""); }}
          error={error}
          rows={8}
        />

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includeHeaders}
            onChange={(e) => setIncludeHeaders(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm">Include header row</span>
        </label>

        <button
          onClick={handleConvert}
          disabled={!input.trim()}
          className="btn btn-primary w-full py-3"
        >
          Convert to CSV
        </button>

        <OutputBox label="CSV Output" value={output} downloadFileName="data.csv" />
      </div>
    </ToolLayout>
  );
}
