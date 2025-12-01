"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("json-to-yaml")!;
const similarTools = getToolsByCategory("converter").filter(t => t.slug !== "json-to-yaml");

function jsonToYaml(obj: unknown, indent = 0): string {
  const spaces = "  ".repeat(indent);
  
  if (obj === null) return "null";
  if (obj === undefined) return "";
  if (typeof obj === "boolean") return obj.toString();
  if (typeof obj === "number") return obj.toString();
  if (typeof obj === "string") {
    if (obj.includes("\n") || obj.includes(":") || obj.includes("#") || 
        obj.startsWith(" ") || obj.endsWith(" ")) {
      return `"${obj.replace(/"/g, '\\"')}"`;
    }
    return obj;
  }
  
  if (Array.isArray(obj)) {
    if (obj.length === 0) return "[]";
    return obj.map((item, i) => {
      const itemYaml = jsonToYaml(item, indent + 1);
      if (typeof item === "object" && item !== null && !Array.isArray(item)) {
        return `${i === 0 ? "" : spaces}- ${itemYaml.trim().replace(/^/, "").replace(/\n/g, `\n${spaces}  `)}`;
      }
      return `${i === 0 ? "" : spaces}- ${itemYaml}`;
    }).join("\n");
  }
  
  if (typeof obj === "object") {
    const record = obj as Record<string, unknown>;
    const keys = Object.keys(record);
    if (keys.length === 0) return "{}";
    
    return keys.map((key, i) => {
      const value = record[key];
      const valueYaml = jsonToYaml(value, indent + 1);
      
      if (typeof value === "object" && value !== null) {
        if (Array.isArray(value) && value.length > 0) {
          return `${i === 0 ? "" : spaces}${key}:\n${spaces}  - ${valueYaml.split("\n- ").join(`\n${spaces}  - `)}`;
        }
        if (!Array.isArray(value) && Object.keys(value).length > 0) {
          return `${i === 0 ? "" : spaces}${key}:\n${spaces}  ${valueYaml.replace(/\n/g, `\n${spaces}  `)}`;
        }
      }
      
      return `${i === 0 ? "" : spaces}${key}: ${valueYaml}`;
    }).join("\n");
  }
  
  return String(obj);
}

export default function JsonToYamlPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleConvert = async () => {
    if (!input.trim()) return;
    setError("");
    const startTime = Date.now();

    try {
      const json = JSON.parse(input);
      const yaml = jsonToYaml(json);
      setOutput(yaml);

      await logToolUsage({
        toolName: tool.name,
        toolCategory: tool.category,
        inputType: "text",
        rawInput: input,
        outputResult: yaml,
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
          placeholder='{"name": "John", "age": 30, "hobbies": ["reading", "coding"]}'
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
          Convert to YAML
        </button>

        <OutputBox label="YAML Output" value={output} downloadFileName="data.yaml" />
      </div>
    </ToolLayout>
  );
}
