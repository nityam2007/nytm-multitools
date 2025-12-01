"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("regex-tester")!;
const similarTools = getToolsByCategory("dev").filter(t => t.slug !== "regex-tester");

interface Match {
  match: string;
  index: number;
  groups: Record<string, string> | undefined;
}

export default function RegexTesterPage() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState("g");
  const [testString, setTestString] = useState("");
  const [matches, setMatches] = useState<Match[]>([]);
  const [error, setError] = useState("");
  const [highlightedText, setHighlightedText] = useState("");

  const handleTest = async () => {
    if (!pattern || !testString) return;
    setError("");
    const startTime = Date.now();

    try {
      const regex = new RegExp(pattern, flags);
      const foundMatches: Match[] = [];
      
      if (flags.includes("g")) {
        let match;
        while ((match = regex.exec(testString)) !== null) {
          foundMatches.push({
            match: match[0],
            index: match.index,
            groups: match.groups,
          });
          if (!flags.includes("g")) break;
        }
      } else {
        const match = regex.exec(testString);
        if (match) {
          foundMatches.push({
            match: match[0],
            index: match.index,
            groups: match.groups,
          });
        }
      }

      setMatches(foundMatches);

      // Create highlighted text
      let highlighted = testString;
      const sortedMatches = [...foundMatches].sort((a, b) => b.index - a.index);
      for (const m of sortedMatches) {
        highlighted = 
          highlighted.substring(0, m.index) +
          `<mark class="bg-yellow-300 dark:bg-yellow-600">${m.match}</mark>` +
          highlighted.substring(m.index + m.match.length);
      }
      setHighlightedText(highlighted);

      await logToolUsage({
        toolName: tool.name,
        toolCategory: tool.category,
        inputType: "text",
        rawInput: `Pattern: ${pattern}, Flags: ${flags}, Test: ${testString}`,
        outputResult: `${foundMatches.length} matches found`,
        processingDuration: Date.now() - startTime,
      });
    } catch (e) {
      setError((e as Error).message || "Invalid regular expression");
      setMatches([]);
      setHighlightedText("");
    }
  };

  const flagOptions = [
    { value: "g", label: "Global (g)", desc: "Find all matches" },
    { value: "i", label: "Case Insensitive (i)", desc: "Ignore case" },
    { value: "m", label: "Multiline (m)", desc: "^ and $ match line boundaries" },
    { value: "s", label: "Dotall (s)", desc: ". matches newlines" },
    { value: "u", label: "Unicode (u)", desc: "Enable unicode support" },
  ];

  const toggleFlag = (flag: string) => {
    if (flags.includes(flag)) {
      setFlags(flags.replace(flag, ""));
    } else {
      setFlags(flags + flag);
    }
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Regular Expression</label>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">/</span>
            <input
              type="text"
              value={pattern}
              onChange={(e) => { setPattern(e.target.value); setError(""); }}
              placeholder="Enter regex pattern..."
              className="input flex-1"
            />
            <span className="text-muted-foreground">/</span>
            <input
              type="text"
              value={flags}
              onChange={(e) => setFlags(e.target.value)}
              className="input w-16 text-center"
              placeholder="flags"
            />
          </div>
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Flags</label>
          <div className="flex flex-wrap gap-2">
            {flagOptions.map((opt) => (
              <button
                key={opt.value}
                onClick={() => toggleFlag(opt.value)}
                className={`px-3 py-1.5 rounded-lg text-sm ${
                  flags.includes(opt.value)
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
                title={opt.desc}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <TextArea
          label="Test String"
          placeholder="Enter text to test against..."
          value={testString}
          onChange={(e) => setTestString(e.target.value)}
          rows={6}
        />

        <button
          onClick={handleTest}
          disabled={!pattern || !testString}
          className="btn btn-primary w-full py-3"
        >
          Test Regex
        </button>

        {highlightedText && (
          <div className="card p-4">
            <h3 className="font-medium mb-2">Highlighted Matches ({matches.length})</h3>
            <div
              className="font-mono text-sm whitespace-pre-wrap p-3 bg-muted rounded"
              dangerouslySetInnerHTML={{ __html: highlightedText }}
            />
          </div>
        )}

        {matches.length > 0 && (
          <div className="card p-4">
            <h3 className="font-medium mb-2">Match Details</h3>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {matches.map((m, i) => (
                <div key={i} className="bg-muted p-3 rounded text-sm">
                  <div className="flex justify-between">
                    <span className="font-medium">Match {i + 1}</span>
                    <span className="text-muted-foreground">Index: {m.index}</span>
                  </div>
                  <code className="block mt-1">{m.match}</code>
                  {m.groups && Object.keys(m.groups).length > 0 && (
                    <div className="mt-2 text-xs">
                      <span className="text-muted-foreground">Groups: </span>
                      {JSON.stringify(m.groups)}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <OutputBox
          label="Regex Pattern (JavaScript)"
          value={pattern ? `const regex = /${pattern}/${flags};` : ""}
          downloadFileName="regex.js"
        />
      </div>
    </ToolLayout>
  );
}
