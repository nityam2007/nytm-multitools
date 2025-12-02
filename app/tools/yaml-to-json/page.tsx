"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("yaml-to-json")!;
const similarTools = getToolsByCategory("converter").filter(t => t.slug !== "yaml-to-json");

// Simple YAML parser for common cases
function parseYaml(yaml: string): unknown {
  const lines = yaml.split("\n");
  const result: Record<string, unknown> = {};
  const stack: { obj: Record<string, unknown>; indent: number }[] = [{ obj: result, indent: -1 }];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const indent = line.search(/\S/);
    const match = trimmed.match(/^([^:]+):\s*(.*)$/);
    
    if (!match) continue;
    
    const [, key, value] = match;
    const cleanKey = key.trim();
    
    // Pop stack until we find parent
    while (stack.length > 1 && stack[stack.length - 1].indent >= indent) {
      stack.pop();
    }
    
    const parent = stack[stack.length - 1].obj;
    
    if (value.trim()) {
      // Has value
      parent[cleanKey] = parseValue(value.trim());
    } else {
      // Nested object
      const newObj: Record<string, unknown> = {};
      parent[cleanKey] = newObj;
      stack.push({ obj: newObj, indent });
    }
  }

  return result;
}

function parseValue(value: string): unknown {
  // Handle strings
  if ((value.startsWith('"') && value.endsWith('"')) || 
      (value.startsWith("'") && value.endsWith("'"))) {
    return value.slice(1, -1);
  }
  
  // Handle booleans
  if (value.toLowerCase() === "true") return true;
  if (value.toLowerCase() === "false") return false;
  
  // Handle null
  if (value.toLowerCase() === "null" || value === "~") return null;
  
  // Handle numbers
  if (/^-?\d+$/.test(value)) return parseInt(value, 10);
  if (/^-?\d*\.\d+$/.test(value)) return parseFloat(value);
  
  // Handle arrays
  if (value.startsWith("[") && value.endsWith("]")) {
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
  
  return value;
}

export default function YamlToJsonPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleConvert = async () => {
    if (!input.trim()) return;
    setError("");
    const startTime = Date.now();

    try {
      const json = parseYaml(input);
      const result = JSON.stringify(json, null, 2);
      setOutput(result);

      await logToolUsage({
        toolName: tool.name,
        toolCategory: tool.category,
        inputType: "text",
        rawInput: input,
        outputResult: result,
        processingDuration: Date.now() - startTime,
      });
    } catch (e) {
      setError("Failed to parse YAML. Please check your input.");
    }
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <TextArea
          label="YAML Input"
          placeholder={"name: John\nage: 30\ncity: New York"}
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(""); }}
          error={error}
          rows={8}
        />

        <button
          onClick={handleConvert}
          disabled={!input.trim()}
          className="btn btn-primary w-full py-3"
        >
          Convert to JSON
        </button>

        <OutputBox label="JSON Output" value={output} downloadFileName="data.json" />

        <div className="text-sm text-muted-foreground">
          <p>Note: This is a basic YAML parser. For complex YAML with anchors, aliases, or multi-document support, consider using a dedicated YAML library.</p>
        </div>
      </div>
    </ToolLayout>
  );
}
