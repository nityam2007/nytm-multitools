"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("unicode-converter")!;
const similarTools = getToolsByCategory("converter").filter(t => t.slug !== "unicode-converter");

export default function UnicodeConverterPage() {
  const [text, setText] = useState("");
  const [format, setFormat] = useState<"unicode" | "html" | "css" | "js">("unicode");

  const textToUnicode = (str: string): string => {
    return str.split("").map(char => {
      const code = char.charCodeAt(0);
      switch (format) {
        case "unicode":
          return `U+${code.toString(16).toUpperCase().padStart(4, "0")}`;
        case "html":
          return `&#${code};`;
        case "css":
          return `\\${code.toString(16).toUpperCase()}`;
        case "js":
          return `\\u${code.toString(16).padStart(4, "0")}`;
      }
    }).join(" ");
  };

  const getCharacterInfo = (char: string) => {
    const code = char.charCodeAt(0);
    return {
      char,
      decimal: code,
      hex: code.toString(16).toUpperCase().padStart(4, "0"),
      unicode: `U+${code.toString(16).toUpperCase().padStart(4, "0")}`,
      html: `&#${code};`,
      htmlHex: `&#x${code.toString(16).toUpperCase()};`,
      css: `\\${code.toString(16).toUpperCase()}`,
      js: `\\u${code.toString(16).padStart(4, "0")}`,
    };
  };

  const output = textToUnicode(text);
  const characters = text.split("").map(getCharacterInfo);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output);
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Input Text</label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text or paste emojis..."
            className="w-full h-24 px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)] resize-none text-xl"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {(["unicode", "html", "css", "js"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                format === f
                  ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                  : "bg-[var(--muted)] hover:bg-[var(--accent)]"
              }`}
            >
              {f.toUpperCase()}
            </button>
          ))}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Output ({format.toUpperCase()})</label>
            <button
              onClick={copyToClipboard}
              disabled={!output}
              className="px-3 py-1 text-sm rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] disabled:opacity-50"
            >
              Copy
            </button>
          </div>
          <textarea
            value={output}
            readOnly
            placeholder="Output will appear here..."
            className="w-full h-24 px-4 py-3 rounded-lg bg-[var(--muted)] border border-[var(--border)] resize-none font-mono text-sm"
          />
        </div>

        {characters.length > 0 && characters.length <= 20 && (
          <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
            <h3 className="font-semibold mb-4">Character Details</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-[var(--muted)]">
                  <tr>
                    <th className="px-3 py-2 text-left">Char</th>
                    <th className="px-3 py-2 text-left">Dec</th>
                    <th className="px-3 py-2 text-left">Hex</th>
                    <th className="px-3 py-2 text-left">Unicode</th>
                    <th className="px-3 py-2 text-left">HTML</th>
                    <th className="px-3 py-2 text-left">JS</th>
                  </tr>
                </thead>
                <tbody>
                  {characters.map((c, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "" : "bg-[var(--muted)]/30"}>
                      <td className="px-3 py-2 text-2xl">{c.char}</td>
                      <td className="px-3 py-2 font-mono">{c.decimal}</td>
                      <td className="px-3 py-2 font-mono">{c.hex}</td>
                      <td className="px-3 py-2 font-mono">{c.unicode}</td>
                      <td className="px-3 py-2 font-mono">{c.html}</td>
                      <td className="px-3 py-2 font-mono">{c.js}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        <div className="bg-[var(--muted)] rounded-xl p-6">
          <h3 className="font-semibold mb-3">Format Examples</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm font-mono">
            <div>
              <span className="text-[var(--muted-foreground)]">Unicode:</span> U+0041
            </div>
            <div>
              <span className="text-[var(--muted-foreground)]">HTML:</span> &amp;#65;
            </div>
            <div>
              <span className="text-[var(--muted-foreground)]">CSS:</span> \41
            </div>
            <div>
              <span className="text-[var(--muted-foreground)]">JS:</span> \u0041
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
