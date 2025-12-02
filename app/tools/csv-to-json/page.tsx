"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("csv-to-json")!;
const similarTools = getToolsByCategory("converter").filter(t => t.slug !== "csv-to-json");

function parseCSV(csv: string): { headers: string[]; rows: string[][] } {
  const lines = csv.trim().split("\n");
  const headers = lines[0].split(",").map(h => h.trim().replace(/^["']|["']$/g, ""));
  const rows = lines.slice(1).map(line => {
    const values: string[] = [];
    let current = "";
    let inQuotes = false;
    
    for (const char of line) {
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(current.trim().replace(/^["']|["']$/g, ""));
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim().replace(/^["']|["']$/g, ""));
    return values;
  });
  
  return { headers, rows };
}

export default function CsvToJsonPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [arrayFormat, setArrayFormat] = useState(true);

  const handleConvert = async () => {
    if (!input.trim()) return;
    setError("");
    const startTime = Date.now();

    try {
      const { headers, rows } = parseCSV(input);
      
      let result;
      if (arrayFormat) {
        result = rows.map(row => {
          const obj: Record<string, string> = {};
          headers.forEach((h, i) => {
            obj[h] = row[i] || "";
          });
          return obj;
        });
      } else {
        result = { headers, data: rows };
      }

      const json = JSON.stringify(result, null, 2);
      setOutput(json);

      await logToolUsage({
        toolName: tool.name,
        toolCategory: tool.category,
        inputType: "text",
        rawInput: input,
        outputResult: json,
        processingDuration: Date.now() - startTime,
      });
    } catch (e) {
      setError("Failed to parse CSV. Please check the format.");
    }
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <TextArea
          label="CSV Input"
          placeholder={"name,age,city\nJohn,30,New York\nJane,25,Los Angeles"}
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(""); }}
          error={error}
          rows={8}
        />

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={arrayFormat}
            onChange={(e) => setArrayFormat(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm">Output as array of objects</span>
        </label>

        <button
          onClick={handleConvert}
          disabled={!input.trim()}
          className="btn btn-primary w-full py-3"
        >
          Convert to JSON
        </button>

        <OutputBox label="JSON Output" value={output} downloadFileName="data.json" />
      </div>
    </ToolLayout>
  );
}
