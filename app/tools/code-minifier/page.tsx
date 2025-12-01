"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("code-minifier")!;
const similarTools = getToolsByCategory("dev").filter(t => t.slug !== "code-minifier");

function minifyJS(code: string): string {
  // Remove comments
  let result = code.replace(/\/\*[\s\S]*?\*\//g, "");
  result = result.replace(/\/\/.*$/gm, "");
  
  // Remove whitespace around operators
  result = result.replace(/\s*([+\-*/%=<>!&|^~?:,;{}()[\]])\s*/g, "$1");
  
  // Remove newlines and extra spaces
  result = result.replace(/\s+/g, " ");
  result = result.replace(/;\s*}/g, "}");
  result = result.trim();
  
  return result;
}

function minifyCSS(code: string): string {
  // Remove comments
  let result = code.replace(/\/\*[\s\S]*?\*\//g, "");
  
  // Remove whitespace
  result = result.replace(/\s+/g, " ");
  result = result.replace(/\s*([{};:,>+~])\s*/g, "$1");
  result = result.replace(/;\}/g, "}");
  result = result.trim();
  
  return result;
}

function minifyHTML(code: string): string {
  // Remove HTML comments
  let result = code.replace(/<!--[\s\S]*?-->/g, "");
  
  // Remove whitespace between tags
  result = result.replace(/>\s+</g, "><");
  
  // Remove leading/trailing whitespace
  result = result.replace(/^\s+|\s+$/gm, "");
  
  // Collapse multiple spaces
  result = result.replace(/\s{2,}/g, " ");
  
  return result.trim();
}

function minifyJSON(code: string): string {
  try {
    return JSON.stringify(JSON.parse(code));
  } catch {
    return code;
  }
}

export default function CodeMinifierPage() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState<"javascript" | "css" | "html" | "json">("javascript");
  const [stats, setStats] = useState({ original: 0, minified: 0, saved: 0 });

  const handleMinify = async () => {
    if (!input.trim()) return;
    const startTime = Date.now();

    let minified = "";
    switch (language) {
      case "javascript":
        minified = minifyJS(input);
        break;
      case "css":
        minified = minifyCSS(input);
        break;
      case "html":
        minified = minifyHTML(input);
        break;
      case "json":
        minified = minifyJSON(input);
        break;
    }

    const original = input.length;
    const newSize = minified.length;
    const saved = Math.round(((original - newSize) / original) * 100);
    
    setOutput(minified);
    setStats({ original, minified: newSize, saved });

    await logToolUsage({
      toolName: tool.name,
      toolCategory: tool.category,
      inputType: "text",
      rawInput: `${language}: ${input.length} chars`,
      outputResult: `Minified to ${minified.length} chars (${saved}% saved)`,
      processingDuration: Date.now() - startTime,
    });
  };

  const extensions: Record<string, string> = {
    javascript: "js",
    css: "css",
    html: "html",
    json: "json",
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Language</label>
          <div className="flex gap-2">
            {(["javascript", "css", "html", "json"] as const).map((lang) => (
              <button
                key={lang}
                onClick={() => setLanguage(lang)}
                className={`px-4 py-2 rounded-lg text-sm capitalize ${
                  language === lang
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                {lang}
              </button>
            ))}
          </div>
        </div>

        <TextArea
          label="Input Code"
          placeholder={`Paste your ${language} code here...`}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={10}
        />

        <button
          onClick={handleMinify}
          disabled={!input.trim()}
          className="btn btn-primary w-full py-3"
        >
          Minify Code
        </button>

        {output && (
          <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg p-3">
            <p className="font-medium">
              Reduced from {stats.original.toLocaleString()} to {stats.minified.toLocaleString()} characters
            </p>
            <p className="text-sm">Saved {stats.saved}% ({(stats.original - stats.minified).toLocaleString()} characters)</p>
          </div>
        )}

        <OutputBox
          label="Minified Output"
          value={output}
          downloadFileName={`minified.${extensions[language]}`}
        />
      </div>
    </ToolLayout>
  );
}
