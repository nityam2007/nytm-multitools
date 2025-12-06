// Code to Image | TypeScript
"use client";

import { useState, useRef, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("code-to-image")!;
const similarTools = getToolsByCategory("dev").filter(t => t.slug !== "code-to-image");

const themes = {
  "Dracula": { bg: "#282a36", text: "#f8f8f2", keyword: "#ff79c6", string: "#f1fa8c", comment: "#6272a4", number: "#bd93f9" },
  "One Dark": { bg: "#282c34", text: "#abb2bf", keyword: "#c678dd", string: "#98c379", comment: "#5c6370", number: "#d19a66" },
  "Nord": { bg: "#2e3440", text: "#d8dee9", keyword: "#81a1c1", string: "#a3be8c", comment: "#616e88", number: "#b48ead" },
  "Monokai": { bg: "#272822", text: "#f8f8f2", keyword: "#f92672", string: "#e6db74", comment: "#75715e", number: "#ae81ff" },
  "GitHub Dark": { bg: "#0d1117", text: "#c9d1d9", keyword: "#ff7b72", string: "#a5d6ff", comment: "#8b949e", number: "#79c0ff" },
  "Solarized": { bg: "#002b36", text: "#839496", keyword: "#859900", string: "#2aa198", comment: "#586e75", number: "#d33682" },
};

const languages = ["javascript", "typescript", "python", "html", "css", "json", "bash", "sql", "go", "rust"];

const paddings = [16, 32, 48, 64, 96];

export default function CodeToImagePage({ embedMode = false }: { embedMode?: boolean }) {
  const [code, setCode] = useState(`function greet(name) {
  // Say hello
  const message = "Hello, " + name + "!";
  console.log(message);
  return message;
}`);
  const [theme, setTheme] = useState<keyof typeof themes>("Dracula");
  const [language, setLanguage] = useState("javascript");
  const [padding, setPadding] = useState(48);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [showWindowControls, setShowWindowControls] = useState(true);
  const [fileName, setFileName] = useState("example.js");
  const [fontSize, setFontSize] = useState(14);
  const [borderRadius, setBorderRadius] = useState(12);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateImage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d")!;
    const colors = themes[theme];
    const lines = code.split("\n");
    const lineHeight = fontSize * 1.6;
    const lineNumberWidth = showLineNumbers ? 50 : 0;
    const headerHeight = showWindowControls ? 40 : 0;
    
    // Calculate dimensions
    ctx.font = `${fontSize}px "Fira Code", "SF Mono", Monaco, monospace`;
    const maxLineWidth = Math.max(...lines.map(line => ctx.measureText(line).width));
    const contentWidth = maxLineWidth + lineNumberWidth + 40;
    const contentHeight = lines.length * lineHeight + 20;
    
    const width = contentWidth + padding * 2;
    const height = contentHeight + padding * 2 + headerHeight;
    
    canvas.width = width * 2; // 2x for retina
    canvas.height = height * 2;
    ctx.scale(2, 2);

    // Background
    ctx.fillStyle = colors.bg;
    ctx.beginPath();
    ctx.roundRect(0, 0, width, height, borderRadius);
    ctx.fill();

    // Window controls
    if (showWindowControls) {
      const controlY = padding + 15;
      const controlColors = ["#ff5f56", "#ffbd2e", "#27c93f"];
      controlColors.forEach((color, i) => {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(padding + 20 + i * 20, controlY, 6, 0, Math.PI * 2);
        ctx.fill();
      });

      // File name
      if (fileName) {
        ctx.fillStyle = colors.comment;
        ctx.font = `${fontSize - 2}px -apple-system, BlinkMacSystemFont, sans-serif`;
        ctx.textAlign = "center";
        ctx.fillText(fileName, width / 2, controlY + 4);
        ctx.textAlign = "left";
      }
    }

    // Code
    ctx.font = `${fontSize}px "Fira Code", "SF Mono", Monaco, monospace`;
    const startY = padding + headerHeight + fontSize;

    lines.forEach((line, i) => {
      const y = startY + i * lineHeight;

      // Line numbers
      if (showLineNumbers) {
        ctx.fillStyle = colors.comment;
        ctx.textAlign = "right";
        ctx.fillText(String(i + 1), padding + lineNumberWidth - 10, y);
        ctx.textAlign = "left";
      }

      // Syntax highlighting (basic)
      const x = padding + lineNumberWidth + 10;
      let currentX = x;
      
      // Simple tokenization
      const tokens = tokenize(line, language);
      tokens.forEach(token => {
        ctx.fillStyle = getTokenColor(token.type, colors);
        ctx.fillText(token.value, currentX, y);
        currentX += ctx.measureText(token.value).width;
      });
    });

    // Download
    canvas.toBlob(blob => {
      if (!blob) return;
      const link = document.createElement("a");
      link.download = `code-${Date.now()}.png`;
      link.href = URL.createObjectURL(blob);
      link.click();
      URL.revokeObjectURL(link.href);
    }, "image/png");
  }, [code, theme, padding, showLineNumbers, showWindowControls, fileName, fontSize, borderRadius, language]);

  return (
    <ToolLayout tool={tool} similarTools={similarTools} embedMode={embedMode}>
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Editor */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Code</label>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-64 p-4 rounded-xl bg-[var(--muted)] border border-[var(--border)] font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              placeholder="Paste your code here..."
              spellCheck={false}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Theme</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value as keyof typeof themes)}
                className="w-full p-3 rounded-xl bg-[var(--muted)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              >
                {Object.keys(themes).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="w-full p-3 rounded-xl bg-[var(--muted)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              >
                {languages.map(l => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Padding: {padding}px</label>
              <div className="flex gap-2">
                {paddings.map(p => (
                  <button
                    key={p}
                    onClick={() => setPadding(p)}
                    className={`flex-1 py-2 rounded-lg text-sm ${padding === p ? "bg-cyan-500 text-white" : "bg-[var(--muted)]"}`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Font Size: {fontSize}px</label>
              <input
                type="range"
                min="10"
                max="20"
                value={fontSize}
                onChange={(e) => setFontSize(parseInt(e.target.value))}
                className="w-full h-2 bg-[var(--border)] rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">File Name</label>
              <input
                type="text"
                value={fileName}
                onChange={(e) => setFileName(e.target.value)}
                className="w-full p-3 rounded-xl bg-[var(--muted)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
                placeholder="example.js"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Border Radius: {borderRadius}px</label>
              <input
                type="range"
                min="0"
                max="24"
                value={borderRadius}
                onChange={(e) => setBorderRadius(parseInt(e.target.value))}
                className="w-full h-2 bg-[var(--border)] rounded-lg appearance-none cursor-pointer accent-cyan-500"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showLineNumbers}
                onChange={(e) => setShowLineNumbers(e.target.checked)}
                className="w-4 h-4 rounded accent-cyan-500"
              />
              <span className="text-sm">Line Numbers</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showWindowControls}
                onChange={(e) => setShowWindowControls(e.target.checked)}
                className="w-4 h-4 rounded accent-cyan-500"
              />
              <span className="text-sm">Window Controls</span>
            </label>
          </div>
        </div>

        {/* Preview */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Preview</label>
            <div 
              className="rounded-xl overflow-hidden"
              style={{ 
                backgroundColor: themes[theme].bg,
                padding: `${padding}px`,
                borderRadius: `${borderRadius}px`
              }}
            >
              {showWindowControls && (
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-3 h-3 rounded-full bg-[#ff5f56]" />
                  <div className="w-3 h-3 rounded-full bg-[#ffbd2e]" />
                  <div className="w-3 h-3 rounded-full bg-[#27c93f]" />
                  {fileName && (
                    <span 
                      className="flex-1 text-center text-xs"
                      style={{ color: themes[theme].comment }}
                    >
                      {fileName}
                    </span>
                  )}
                </div>
              )}
              <pre
                className="font-mono overflow-x-auto"
                style={{ 
                  fontSize: `${fontSize}px`,
                  lineHeight: 1.6,
                  color: themes[theme].text 
                }}
              >
                {code.split("\n").map((line, i) => (
                  <div key={i} className="flex">
                    {showLineNumbers && (
                      <span 
                        className="select-none w-8 text-right pr-4"
                        style={{ color: themes[theme].comment }}
                      >
                        {i + 1}
                      </span>
                    )}
                    <span>{line || " "}</span>
                  </div>
                ))}
              </pre>
            </div>
          </div>

          <button
            onClick={generateImage}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download Image
          </button>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </ToolLayout>
  );
}

// Simple tokenizer for syntax highlighting
interface Token {
  type: "keyword" | "string" | "comment" | "number" | "text";
  value: string;
}

function tokenize(line: string, lang: string): Token[] {
  const tokens: Token[] = [];
  const keywords: Record<string, string[]> = {
    javascript: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "class", "import", "export", "from", "async", "await", "try", "catch", "throw", "new", "this", "true", "false", "null", "undefined"],
    typescript: ["const", "let", "var", "function", "return", "if", "else", "for", "while", "class", "import", "export", "from", "async", "await", "try", "catch", "throw", "new", "this", "true", "false", "null", "undefined", "interface", "type", "extends", "implements"],
    python: ["def", "class", "return", "if", "else", "elif", "for", "while", "import", "from", "try", "except", "with", "as", "True", "False", "None", "and", "or", "not", "in", "is", "lambda", "yield", "async", "await"],
    default: ["function", "return", "if", "else", "for", "while", "class", "true", "false", "null"],
  };

  const langKeywords = keywords[lang] || keywords.default;
  
  // Check for comment
  if (line.trim().startsWith("//") || line.trim().startsWith("#")) {
    return [{ type: "comment", value: line }];
  }

  let remaining = line;
  while (remaining.length > 0) {
    // Check for string
    const stringMatch = remaining.match(/^(["'`])((?:\\.|(?!\1)[^\\])*)\1/);
    if (stringMatch) {
      tokens.push({ type: "string", value: stringMatch[0] });
      remaining = remaining.slice(stringMatch[0].length);
      continue;
    }

    // Check for number
    const numberMatch = remaining.match(/^\d+(\.\d+)?/);
    if (numberMatch) {
      tokens.push({ type: "number", value: numberMatch[0] });
      remaining = remaining.slice(numberMatch[0].length);
      continue;
    }

    // Check for keyword
    const wordMatch = remaining.match(/^[a-zA-Z_]\w*/);
    if (wordMatch) {
      const word = wordMatch[0];
      const type = langKeywords.includes(word) ? "keyword" : "text";
      tokens.push({ type, value: word });
      remaining = remaining.slice(word.length);
      continue;
    }

    // Default: single character
    tokens.push({ type: "text", value: remaining[0] });
    remaining = remaining.slice(1);
  }

  return tokens;
}

function getTokenColor(type: Token["type"], colors: typeof themes[keyof typeof themes]): string {
  switch (type) {
    case "keyword": return colors.keyword;
    case "string": return colors.string;
    case "comment": return colors.comment;
    case "number": return colors.number;
    default: return colors.text;
  }
}
