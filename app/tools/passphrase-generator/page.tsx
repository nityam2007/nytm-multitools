// Passphrase Generator Tool | TypeScript
"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("passphrase-generator")!;
const similarTools = getToolsByCategory("generator").filter(t => t.slug !== "passphrase-generator");

// Common word lists for passphrase generation
const wordLists = {
  common: [
    "apple", "banana", "orange", "grape", "mango", "peach", "lemon", "berry",
    "tiger", "eagle", "shark", "whale", "horse", "zebra", "panda", "koala",
    "river", "ocean", "forest", "mountain", "desert", "island", "valley", "canyon",
    "coffee", "pizza", "pasta", "bread", "cheese", "butter", "honey", "sugar",
    "purple", "golden", "silver", "crimson", "azure", "coral", "amber", "ivory",
    "happy", "brave", "swift", "quiet", "bright", "gentle", "noble", "clever",
    "castle", "bridge", "tower", "garden", "palace", "temple", "harbor", "market",
    "spring", "summer", "autumn", "winter", "sunset", "rainbow", "thunder", "breeze"
  ],
  animals: [
    "elephant", "giraffe", "penguin", "dolphin", "butterfly", "kangaroo", "octopus", "flamingo",
    "hedgehog", "squirrel", "mongoose", "armadillo", "platypus", "raccoon", "wolverine", "cheetah",
    "peacock", "pelican", "toucan", "parrot", "falcon", "condor", "albatross", "nightingale"
  ],
  nature: [
    "meadow", "glacier", "volcano", "waterfall", "lagoon", "prairie", "tundra", "savanna",
    "blossom", "cypress", "willow", "bamboo", "sequoia", "orchid", "jasmine", "lavender",
    "aurora", "eclipse", "comet", "nebula", "galaxy", "meteor", "horizon", "twilight"
  ],
  tech: [
    "quantum", "pixel", "binary", "cipher", "vector", "matrix", "neural", "crypto",
    "kernel", "buffer", "socket", "router", "server", "client", "module", "widget",
    "syntax", "script", "method", "object", "function", "variable", "constant", "boolean"
  ]
};

const separatorOptions = [
  { value: "-", label: "Hyphen (-)" },
  { value: "_", label: "Underscore (_)" },
  { value: ".", label: "Period (.)" },
  { value: " ", label: "Space" },
  { value: "", label: "None" },
];

const wordListOptions = [
  { value: "common", label: "Common Words" },
  { value: "animals", label: "Animals" },
  { value: "nature", label: "Nature" },
  { value: "tech", label: "Tech Terms" },
  { value: "mixed", label: "Mixed (All)" },
];

const caseOptions = [
  { value: "lowercase", label: "lowercase" },
  { value: "uppercase", label: "UPPERCASE" },
  { value: "capitalize", label: "Capitalize Each" },
  { value: "random", label: "rAnDoM cAsE" },
];

export default function PassphraseGeneratorPage() {
  const [passphrase, setPassphrase] = useState("");
  const [wordCount, setWordCount] = useState(4);
  const [separator, setSeparator] = useState("-");
  const [wordList, setWordList] = useState("common");
  const [caseStyle, setCaseStyle] = useState("lowercase");
  const [includeNumber, setIncludeNumber] = useState(false);
  const [includeSymbol, setIncludeSymbol] = useState(false);

  const applyCase = (word: string, style: string): string => {
    switch (style) {
      case "uppercase":
        return word.toUpperCase();
      case "capitalize":
        return word.charAt(0).toUpperCase() + word.slice(1);
      case "random":
        return word
          .split("")
          .map((c) => (Math.random() > 0.5 ? c.toUpperCase() : c.toLowerCase()))
          .join("");
      default:
        return word.toLowerCase();
    }
  };

  const getWords = (): string[] => {
    if (wordList === "mixed") {
      return [
        ...wordLists.common,
        ...wordLists.animals,
        ...wordLists.nature,
        ...wordLists.tech,
      ];
    }
    return wordLists[wordList as keyof typeof wordLists] || wordLists.common;
  };

  const generatePassphrase = useCallback(async () => {
    const startTime = Date.now();
    const words = getWords();
    const selected: string[] = [];

    const randomArray = new Uint32Array(wordCount);
    crypto.getRandomValues(randomArray);

    for (let i = 0; i < wordCount; i++) {
      const index = randomArray[i] % words.length;
      selected.push(applyCase(words[index], caseStyle));
    }

    let result = selected.join(separator);

    if (includeNumber) {
      const numArray = new Uint32Array(1);
      crypto.getRandomValues(numArray);
      result += separator + (numArray[0] % 1000);
    }

    if (includeSymbol) {
      const symbols = "!@#$%^&*";
      const symArray = new Uint32Array(1);
      crypto.getRandomValues(symArray);
      result += symbols[symArray[0] % symbols.length];
    }

    setPassphrase(result);

    await logToolUsage({
      toolName: tool.name,
      toolCategory: tool.category,
      inputType: "none",
      outputResult: `[PASSPHRASE ${wordCount} words]`,
      processingDuration: Date.now() - startTime,
      metadata: { wordCount, separator, wordList, caseStyle, includeNumber, includeSymbol },
    });
  }, [wordCount, separator, wordList, caseStyle, includeNumber, includeSymbol]);

  const getStrength = (): { label: string; color: string; percentage: number; entropy: number } => {
    if (!passphrase) return { label: "N/A", color: "gray", percentage: 0, entropy: 0 };
    
    const words = getWords();
    let entropy = wordCount * Math.log2(words.length);
    if (includeNumber) entropy += Math.log2(1000);
    if (includeSymbol) entropy += Math.log2(8);
    
    if (entropy < 40) return { label: "Weak", color: "#ef4444", percentage: 25, entropy };
    if (entropy < 60) return { label: "Fair", color: "#f59e0b", percentage: 50, entropy };
    if (entropy < 80) return { label: "Strong", color: "#22c55e", percentage: 75, entropy };
    return { label: "Very Strong", color: "#10b981", percentage: 100, entropy };
  };

  const strength = getStrength();

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        {/* Generated Passphrase */}
        <OutputBox
          value={passphrase}
          label="Generated Passphrase"
          downloadFileName="passphrase.txt"
        />

        {/* Strength Indicator */}
        {passphrase && (
          <div className="p-4 bg-[var(--muted)] rounded-xl border border-[var(--border)]">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-[var(--muted-foreground)]">Strength</span>
              <span style={{ color: strength.color }} className="font-medium">{strength.label}</span>
            </div>
            <div className="h-2 bg-[var(--card)] rounded-full overflow-hidden mb-2">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{ width: `${strength.percentage}%`, backgroundColor: strength.color }}
              />
            </div>
            <div className="text-xs text-[var(--muted-foreground)]">
              Entropy: ~{Math.round(strength.entropy)} bits
            </div>
          </div>
        )}

        {/* Configuration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[var(--foreground)] mb-1.5 sm:mb-2">
              Word Count: {wordCount}
            </label>
            <input
              type="range"
              min="3"
              max="8"
              value={wordCount}
              onChange={(e) => setWordCount(parseInt(e.target.value))}
              className="w-full accent-violet-500"
            />
            <div className="flex justify-between text-xs text-[var(--muted-foreground)] mt-1">
              <span>3</span>
              <span>8</span>
            </div>
          </div>

          <Select
            label="Separator"
            options={separatorOptions}
            value={separator}
            onChange={(e) => setSeparator(e.target.value)}
          />

          <Select
            label="Word List"
            options={wordListOptions}
            value={wordList}
            onChange={(e) => setWordList(e.target.value)}
          />

          <Select
            label="Case Style"
            options={caseOptions}
            value={caseStyle}
            onChange={(e) => setCaseStyle(e.target.value)}
          />
        </div>

        {/* Extra Options */}
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeNumber}
              onChange={(e) => setIncludeNumber(e.target.checked)}
              className="w-4 h-4 rounded border-[var(--border)] text-violet-500 focus:ring-violet-500"
            />
            <span className="text-sm">Add Number</span>
          </label>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={includeSymbol}
              onChange={(e) => setIncludeSymbol(e.target.checked)}
              className="w-4 h-4 rounded border-[var(--border)] text-violet-500 focus:ring-violet-500"
            />
            <span className="text-sm">Add Symbol</span>
          </label>
        </div>

        {/* Generate Button */}
        <Button onClick={generatePassphrase} size="lg" fullWidth>
          Generate Passphrase
        </Button>

        {/* Info */}
        <div className="p-4 bg-violet-500/10 rounded-xl border border-violet-500/20">
          <h3 className="font-semibold mb-2 text-sm">Why use passphrases?</h3>
          <ul className="text-xs sm:text-sm text-[var(--muted-foreground)] space-y-1">
            <li>• Easier to remember than random characters</li>
            <li>• High entropy with just 4-6 words</li>
            <li>• Resistant to dictionary attacks when using random words</li>
            <li>• Recommended by security experts (NIST, EFF)</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
