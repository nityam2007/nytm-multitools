"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("json-to-xml")!;
const similarTools = getToolsByCategory("converter").filter(t => t.slug !== "json-to-xml");

function jsonToXml(obj: unknown, rootName = "root", indent = 0): string {
  const spaces = "  ".repeat(indent);
  
  if (obj === null || obj === undefined) {
    return `${spaces}<${rootName}></${rootName}>`;
  }
  
  if (typeof obj !== "object") {
    return `${spaces}<${rootName}>${escapeXml(String(obj))}</${rootName}>`;
  }
  
  if (Array.isArray(obj)) {
    return obj.map(item => jsonToXml(item, rootName, indent)).join("\n");
  }
  
  const record = obj as Record<string, unknown>;
  let attrs = "";
  const children: string[] = [];
  
  for (const [key, value] of Object.entries(record)) {
    if (key === "@attributes" && typeof value === "object" && value !== null) {
      attrs = Object.entries(value as Record<string, string>)
        .map(([k, v]) => ` ${k}="${escapeXml(v)}"`)
        .join("");
    } else if (key === "#text") {
      children.push(escapeXml(String(value)));
    } else {
      children.push(jsonToXml(value, key, indent + 1));
    }
  }
  
  if (children.length === 0) {
    return `${spaces}<${rootName}${attrs}/>`;
  }
  
  const hasOnlyText = children.length === 1 && !children[0].includes("<");
  if (hasOnlyText) {
    return `${spaces}<${rootName}${attrs}>${children[0]}</${rootName}>`;
  }
  
  return `${spaces}<${rootName}${attrs}>\n${children.join("\n")}\n${spaces}</${rootName}>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export default function JsonToXmlPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [rootElement, setRootElement] = useState("root");

  const handleConvert = async () => {
    if (!input.trim()) return;
    setError("");
    const startTime = Date.now();

    try {
      const json = JSON.parse(input);
      const xml = `<?xml version="1.0" encoding="UTF-8"?>\n${jsonToXml(json, rootElement)}`;
      setOutput(xml);

      await logToolUsage({
        toolName: tool.name,
        toolCategory: tool.category,
        inputType: "text",
        rawInput: input,
        outputResult: xml,
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
          placeholder='{"name": "John", "age": 30}'
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(""); }}
          error={error}
          rows={8}
        />

        <div>
          <label className="block text-sm font-medium mb-1">Root Element Name</label>
          <input
            type="text"
            value={rootElement}
            onChange={(e) => setRootElement(e.target.value || "root")}
            className="input w-full md:w-64"
            placeholder="root"
          />
        </div>

        <button
          onClick={handleConvert}
          disabled={!input.trim()}
          className="btn btn-primary w-full py-3"
        >
          Convert to XML
        </button>

        <OutputBox label="XML Output" value={output} downloadFileName="data.xml" />
      </div>
    </ToolLayout>
  );
}
