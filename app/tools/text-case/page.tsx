"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("text-case")!;
const similarTools = getToolsByCategory("text").filter(t => t.slug !== "text-case");

type CaseType = "upper" | "lower" | "title" | "sentence" | "camel" | "pascal" | "snake" | "kebab" | "constant" | "toggle";

export default function TextCasePage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const convertCase = async (type: CaseType) => {
    if (!input.trim()) return;

    let result = "";
    const startTime = Date.now();

    switch (type) {
      case "upper":
        result = input.toUpperCase();
        break;
      case "lower":
        result = input.toLowerCase();
        break;
      case "title":
        result = input.replace(/\w\S*/g, (txt) =>
          txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
        );
        break;
      case "sentence":
        result = input.toLowerCase().replace(/(^\s*\w|[.!?]\s*\w)/g, (c) =>
          c.toUpperCase()
        );
        break;
      case "camel":
        result = input
          .toLowerCase()
          .replace(/[^a-zA-Z0-9]+(.)/g, (_, char) => char.toUpperCase());
        break;
      case "pascal":
        result = input
          .toLowerCase()
          .replace(/(?:^|[^a-zA-Z0-9]+)(.)/g, (_, char) => char.toUpperCase());
        break;
      case "snake":
        result = input
          .replace(/\W+/g, " ")
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "_");
        break;
      case "kebab":
        result = input
          .replace(/\W+/g, " ")
          .trim()
          .toLowerCase()
          .replace(/\s+/g, "-");
        break;
      case "constant":
        result = input
          .replace(/\W+/g, " ")
          .trim()
          .toUpperCase()
          .replace(/\s+/g, "_");
        break;
      case "toggle":
        result = input
          .split("")
          .map((char) =>
            char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
          )
          .join("");
        break;
    }

    setOutput(result);

    await logToolUsage({
      toolName: tool.name,
      toolCategory: tool.category,
      inputType: "text",
      rawInput: input,
      outputResult: result,
      processingDuration: Date.now() - startTime,
      metadata: { caseType: type },
    });
  };

  const caseButtons: { type: CaseType; label: string; example: string }[] = [
    { type: "upper", label: "UPPERCASE", example: "HELLO WORLD" },
    { type: "lower", label: "lowercase", example: "hello world" },
    { type: "title", label: "Title Case", example: "Hello World" },
    { type: "sentence", label: "Sentence case", example: "Hello world. How are you?" },
    { type: "camel", label: "camelCase", example: "helloWorld" },
    { type: "pascal", label: "PascalCase", example: "HelloWorld" },
    { type: "snake", label: "snake_case", example: "hello_world" },
    { type: "kebab", label: "kebab-case", example: "hello-world" },
    { type: "constant", label: "CONSTANT_CASE", example: "HELLO_WORLD" },
    { type: "toggle", label: "tOGGLE cASE", example: "hELLO wORLD" },
  ];

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <TextArea
          label="Input Text"
          placeholder="Enter your text here..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div>
          <label className="block text-sm font-medium mb-3">Select Case Type</label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {caseButtons.map(({ type, label, example }) => (
              <button
                key={type}
                onClick={() => convertCase(type)}
                disabled={!input.trim()}
                className="p-3 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--primary)]/5 transition-all text-left disabled:opacity-50"
                title={example}
              >
                <div className="font-medium text-sm">{label}</div>
              </button>
            ))}
          </div>
        </div>

        <OutputBox
          label="Output"
          value={output}
          downloadFileName="converted-text.txt"
        />
      </div>
    </ToolLayout>
  );
}
