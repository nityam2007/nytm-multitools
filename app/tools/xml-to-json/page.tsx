"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("xml-to-json")!;
const similarTools = getToolsByCategory("converter").filter(t => t.slug !== "xml-to-json");

function xmlToJson(xml: string): unknown {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xml, "text/xml");
  
  const errorNode = doc.querySelector("parsererror");
  if (errorNode) {
    throw new Error("Invalid XML");
  }

  function nodeToJson(node: Element): unknown {
    const obj: Record<string, unknown> = {};

    // Handle attributes
    if (node.attributes.length > 0) {
      obj["@attributes"] = {};
      for (const attr of Array.from(node.attributes)) {
        (obj["@attributes"] as Record<string, string>)[attr.name] = attr.value;
      }
    }

    // Handle children
    for (const child of Array.from(node.children)) {
      const childJson = nodeToJson(child);
      const tagName = child.tagName;

      if (obj[tagName] !== undefined) {
        // Convert to array if multiple same-named children
        if (!Array.isArray(obj[tagName])) {
          obj[tagName] = [obj[tagName]];
        }
        (obj[tagName] as unknown[]).push(childJson);
      } else {
        obj[tagName] = childJson;
      }
    }

    // Handle text content
    if (node.children.length === 0) {
      const text = node.textContent?.trim();
      if (text) {
        if (Object.keys(obj).length === 0) {
          return text;
        }
        obj["#text"] = text;
      }
    }

    return Object.keys(obj).length === 0 ? "" : obj;
  }

  const root = doc.documentElement;
  return { [root.tagName]: nodeToJson(root) };
}

export default function XmlToJsonPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");

  const handleConvert = async () => {
    if (!input.trim()) return;
    setError("");
    const startTime = Date.now();

    try {
      const json = xmlToJson(input);
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
      setError("Invalid XML. Please check your input.");
    }
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <TextArea
          label="XML Input"
          placeholder='<root><item id="1">Hello</item></root>'
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
      </div>
    </ToolLayout>
  );
}
