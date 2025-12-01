"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("url-encode")!;
const similarTools = getToolsByCategory("dev").filter(t => t.slug !== "url-encode");

export default function UrlEncodePage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [encodeType, setEncodeType] = useState<"component" | "full">("component");

  const handleEncode = async () => {
    if (!input.trim()) return;
    const startTime = Date.now();

    const encoded = encodeType === "component" 
      ? encodeURIComponent(input)
      : encodeURI(input);
    
    setOutput(encoded);

    await logToolUsage({
      toolName: tool.name,
      toolCategory: tool.category,
      inputType: "text",
      rawInput: input,
      outputResult: encoded,
      processingDuration: Date.now() - startTime,
      metadata: { encodeType },
    });
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <TextArea
          label="Input Text"
          placeholder="Enter text to URL encode..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <div className="flex gap-2">
          {(["component", "full"] as const).map((type) => (
            <button
              key={type}
              onClick={() => setEncodeType(type)}
              className={`px-4 py-2 rounded-lg border transition-colors ${
                encodeType === type
                  ? "border-[var(--primary)] bg-[var(--primary)]/10 text-[var(--primary)]"
                  : "border-[var(--border)] hover:border-[var(--primary)]/50"
              }`}
            >
              {type === "component" ? "encodeURIComponent" : "encodeURI"}
            </button>
          ))}
        </div>

        <button
          onClick={handleEncode}
          disabled={!input.trim()}
          className="btn btn-primary w-full py-3"
        >
          Encode URL
        </button>

        <OutputBox label="Encoded Output" value={output} downloadFileName="encoded-url.txt" />
      </div>
    </ToolLayout>
  );
}
