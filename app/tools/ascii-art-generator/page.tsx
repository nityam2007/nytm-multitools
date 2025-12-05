// ASCII Art Generator Tool | TypeScript
"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("ascii-art-generator")!;
const similarTools = getToolsByCategory("generator").filter(t => t.slug !== "ascii-art-generator");

// ASCII Art font patterns
const fonts: Record<string, Record<string, string[]>> = {
  standard: {
    A: ["  █  ", " █ █ ", "█████", "█   █", "█   █"],
    B: ["████ ", "█   █", "████ ", "█   █", "████ "],
    C: [" ████", "█    ", "█    ", "█    ", " ████"],
    D: ["████ ", "█   █", "█   █", "█   █", "████ "],
    E: ["█████", "█    ", "████ ", "█    ", "█████"],
    F: ["█████", "█    ", "████ ", "█    ", "█    "],
    G: [" ████", "█    ", "█  ██", "█   █", " ████"],
    H: ["█   █", "█   █", "█████", "█   █", "█   █"],
    I: ["█████", "  █  ", "  █  ", "  █  ", "█████"],
    J: ["█████", "   █ ", "   █ ", "█  █ ", " ██  "],
    K: ["█   █", "█  █ ", "███  ", "█  █ ", "█   █"],
    L: ["█    ", "█    ", "█    ", "█    ", "█████"],
    M: ["█   █", "██ ██", "█ █ █", "█   █", "█   █"],
    N: ["█   █", "██  █", "█ █ █", "█  ██", "█   █"],
    O: [" ███ ", "█   █", "█   █", "█   █", " ███ "],
    P: ["████ ", "█   █", "████ ", "█    ", "█    "],
    Q: [" ███ ", "█   █", "█ █ █", "█  █ ", " ██ █"],
    R: ["████ ", "█   █", "████ ", "█  █ ", "█   █"],
    S: [" ████", "█    ", " ███ ", "    █", "████ "],
    T: ["█████", "  █  ", "  █  ", "  █  ", "  █  "],
    U: ["█   █", "█   █", "█   █", "█   █", " ███ "],
    V: ["█   █", "█   █", "█   █", " █ █ ", "  █  "],
    W: ["█   █", "█   █", "█ █ █", "██ ██", "█   █"],
    X: ["█   █", " █ █ ", "  █  ", " █ █ ", "█   █"],
    Y: ["█   █", " █ █ ", "  █  ", "  █  ", "  █  "],
    Z: ["█████", "   █ ", "  █  ", " █   ", "█████"],
    "0": [" ███ ", "█  ██", "█ █ █", "██  █", " ███ "],
    "1": ["  █  ", " ██  ", "  █  ", "  █  ", "█████"],
    "2": [" ███ ", "█   █", "  ██ ", " █   ", "█████"],
    "3": ["█████", "   █ ", "  █  ", "   █ ", "████ "],
    "4": ["█   █", "█   █", "█████", "    █", "    █"],
    "5": ["█████", "█    ", "████ ", "    █", "████ "],
    "6": [" ███ ", "█    ", "████ ", "█   █", " ███ "],
    "7": ["█████", "    █", "   █ ", "  █  ", "  █  "],
    "8": [" ███ ", "█   █", " ███ ", "█   █", " ███ "],
    "9": [" ███ ", "█   █", " ████", "    █", " ███ "],
    " ": ["     ", "     ", "     ", "     ", "     "],
    "!": ["  █  ", "  █  ", "  █  ", "     ", "  █  "],
    "?": [" ███ ", "█   █", "  ██ ", "     ", "  █  "],
    ".": ["     ", "     ", "     ", "     ", "  █  "],
    ",": ["     ", "     ", "     ", "  █  ", " █   "],
    "-": ["     ", "     ", "███  ", "     ", "     "],
    "+": ["     ", "  █  ", "█████", "  █  ", "     "],
    "=": ["     ", "█████", "     ", "█████", "     "],
    "@": [" ███ ", "█ █ █", "█ ██ ", "█    ", " ███ "],
    "#": [" █ █ ", "█████", " █ █ ", "█████", " █ █ "],
  },
  block: {
    A: ["▄▀▀▄", "█▄▄█", "█  █"],
    B: ["█▀▀▄", "█▀▀▄", "█▄▄▀"],
    C: ["▄▀▀▀", "█   ", "▀▄▄▄"],
    D: ["█▀▀▄", "█  █", "█▄▄▀"],
    E: ["█▀▀▀", "█▀▀ ", "█▄▄▄"],
    F: ["█▀▀▀", "█▀▀ ", "█   "],
    G: ["▄▀▀▀", "█ ▀█", "▀▄▄█"],
    H: ["█  █", "█▀▀█", "█  █"],
    I: ["▀█▀", " █ ", "▄█▄"],
    J: ["  ▀█", "   █", "▀▄▄▀"],
    K: ["█ ▄▀", "██  ", "█ ▀▄"],
    L: ["█   ", "█   ", "█▄▄▄"],
    M: ["█▄▄█", "█▀▀█", "█  █"],
    N: ["█▄ █", "█ ▀█", "█  █"],
    O: ["▄▀▀▄", "█  █", "▀▄▄▀"],
    P: ["█▀▀▄", "█▀▀ ", "█   "],
    Q: ["▄▀▀▄", "█ ▄█", "▀▄▀█"],
    R: ["█▀▀▄", "█▀▀▄", "█  █"],
    S: ["▄▀▀▀", "▀▀▀▄", "▄▄▄▀"],
    T: ["▀█▀", " █ ", " █ "],
    U: ["█  █", "█  █", "▀▄▄▀"],
    V: ["█  █", "▀▄▄▀", " ▀▀ "],
    W: ["█  █", "█▄▄█", "█▀▀█"],
    X: ["▀▄▄▀", " ▀▀ ", "▄▀▀▄"],
    Y: ["█  █", "▀▄▄▀", " ▀▀ "],
    Z: ["▀▀▀█", " ▄▀ ", "█▄▄▄"],
    " ": ["   ", "   ", "   "],
    "0": ["▄▀▄", "█ █", "▀▄▀"],
    "1": ["▄█ ", " █ ", "▄█▄"],
    "2": ["▀▀▄", "▄▀ ", "█▄▄"],
    "3": ["▀▀▄", " ▀▄", "▄▄▀"],
    "4": ["█ █", "▀▀█", "  █"],
    "5": ["█▀▀", "▀▀▄", "▄▄▀"],
    "6": ["▄▀▀", "█▀▄", "▀▄▀"],
    "7": ["▀▀█", " ▄▀", " █ "],
    "8": ["▄▀▄", "▄▀▄", "▀▄▀"],
    "9": ["▄▀▄", "▀▄█", "▄▄▀"],
    "!": ["█", "█", "▄"],
    "?": ["▀▄", " █", " ▄"],
    ".": ["  ", "  ", " ▄"],
  },
  simple: {
    A: [" /\\ ", "/  \\", "/--\\"],
    B: ["|--\\", "|--/", "|__/"],
    C: [" __", "/  ", "\\__"],
    D: ["|--\\", "|  |", "|__/"],
    E: ["|--", "|--", "|__"],
    F: ["|--", "|--", "|  "],
    G: [" __", "| _", "|__|"],
    H: ["|  |", "|--|", "|  |"],
    I: ["---", " | ", "---"],
    J: ["  |", "  |", "\\_|"],
    K: ["| /", "|< ", "| \\"],
    L: ["|  ", "|  ", "|__"],
    M: ["|\\/|", "|  |", "|  |"],
    N: ["|\\  |", "| \\ |", "|  \\|"],
    O: [" __ ", "/  \\", "\\__/"],
    P: ["|--\\", "|--/", "|   "],
    Q: [" __ ", "/  \\", "\\__\\"],
    R: ["|--\\", "|--/", "|  \\"],
    S: [" __", "(__", "__)"],
    T: ["---", " | ", " | "],
    U: ["|  |", "|  |", "\\__/"],
    V: ["\\  /", " \\/ ", "    "],
    W: ["|  |", "|/\\|", "/  \\"],
    X: ["\\  /", " \\/ ", "/  \\"],
    Y: ["\\  /", " \\/ ", " |  "],
    Z: ["___", " _/", "/__"],
    " ": ["   ", "   ", "   "],
    "0": [" _ ", "| |", "|_|"],
    "1": [" | ", " | ", " | "],
    "2": [" _ ", " _|", "|_ "],
    "3": [" _ ", " _|", " _|"],
    "4": ["| |", "|_|", "  |"],
    "5": [" _ ", "|_ ", " _|"],
    "6": [" _ ", "|_ ", "|_|"],
    "7": [" _ ", "  |", "  |"],
    "8": [" _ ", "|_|", "|_|"],
    "9": [" _ ", "|_|", " _|"],
    "!": ["|", "|", "."],
    "?": ["?", " ", "."],
    ".": [" ", " ", "."],
  },
};

const fontOptions = [
  { value: "standard", label: "Standard (5 lines)" },
  { value: "block", label: "Block (3 lines)" },
  { value: "simple", label: "Simple (3 lines)" },
];

export default function AsciiArtGeneratorPage() {
  const [text, setText] = useState("");
  const [font, setFont] = useState("standard");
  const [output, setOutput] = useState("");

  const generateArt = useCallback(async () => {
    const startTime = Date.now();
    
    if (!text.trim()) {
      setOutput("");
      return;
    }

    const selectedFont = fonts[font];
    const upperText = text.toUpperCase();
    const charHeight = font === "standard" ? 5 : 3;
    const lines: string[] = Array(charHeight).fill("");

    for (const char of upperText) {
      const pattern = selectedFont[char] || selectedFont[" "] || Array(charHeight).fill("     ");
      for (let i = 0; i < charHeight; i++) {
        lines[i] += (pattern[i] || "     ") + " ";
      }
    }

    const result = lines.join("\n");
    setOutput(result);

    await logToolUsage({
      toolName: tool.name,
      toolCategory: tool.category,
      inputType: "text",
      outputResult: `[ASCII ART ${text.length} chars]`,
      processingDuration: Date.now() - startTime,
      metadata: { textLength: text.length, font },
    });
  }, [text, font]);

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        {/* Input */}
        <Input
          label="Enter Text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type your text here..."
          maxLength={20}
          helperText="Max 20 characters. Letters, numbers, and basic punctuation supported."
        />

        {/* Font Selection */}
        <Select
          label="Font Style"
          options={fontOptions}
          value={font}
          onChange={(e) => setFont(e.target.value)}
        />

        {/* Generate Button */}
        <Button onClick={generateArt} size="lg" fullWidth>
          Generate ASCII Art
        </Button>

        {/* Output */}
        {output && (
          <div className="space-y-4">
            <label className="block text-xs sm:text-sm font-semibold text-[var(--foreground)]">
              Generated ASCII Art
            </label>
            <div className="p-4 sm:p-6 bg-[var(--muted)] rounded-xl border border-[var(--border)] overflow-x-auto">
              <pre className="font-mono text-xs sm:text-sm whitespace-pre leading-tight">
                {output}
              </pre>
            </div>
            <OutputBox
              value={output}
              label="Copy or Download"
              downloadFileName="ascii-art.txt"
            />
          </div>
        )}

        {/* Preview Characters */}
        <div className="p-4 bg-violet-500/10 rounded-xl border border-violet-500/20">
          <h3 className="font-semibold mb-2 text-sm">Supported Characters</h3>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] font-mono">
            A-Z, 0-9, space, ! ? . , - + = @ #
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
