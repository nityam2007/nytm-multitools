"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("nato-alphabet")!;
const similarTools = getToolsByCategory("misc").filter(t => t.slug !== "nato-alphabet");

const natoAlphabet: Record<string, { word: string; pronunciation: string }> = {
  "A": { word: "Alpha", pronunciation: "AL-fah" },
  "B": { word: "Bravo", pronunciation: "BRAH-voh" },
  "C": { word: "Charlie", pronunciation: "CHAR-lee" },
  "D": { word: "Delta", pronunciation: "DELL-tah" },
  "E": { word: "Echo", pronunciation: "ECK-oh" },
  "F": { word: "Foxtrot", pronunciation: "FOKS-trot" },
  "G": { word: "Golf", pronunciation: "GOLF" },
  "H": { word: "Hotel", pronunciation: "hoh-TELL" },
  "I": { word: "India", pronunciation: "IN-dee-ah" },
  "J": { word: "Juliet", pronunciation: "JEW-lee-ETT" },
  "K": { word: "Kilo", pronunciation: "KEY-loh" },
  "L": { word: "Lima", pronunciation: "LEE-mah" },
  "M": { word: "Mike", pronunciation: "MIKE" },
  "N": { word: "November", pronunciation: "no-VEM-ber" },
  "O": { word: "Oscar", pronunciation: "OSS-cah" },
  "P": { word: "Papa", pronunciation: "pah-PAH" },
  "Q": { word: "Quebec", pronunciation: "keh-BECK" },
  "R": { word: "Romeo", pronunciation: "ROW-me-oh" },
  "S": { word: "Sierra", pronunciation: "see-AIR-rah" },
  "T": { word: "Tango", pronunciation: "TANG-go" },
  "U": { word: "Uniform", pronunciation: "YOU-nee-form" },
  "V": { word: "Victor", pronunciation: "VIK-tah" },
  "W": { word: "Whiskey", pronunciation: "WISS-key" },
  "X": { word: "X-ray", pronunciation: "ECKS-ray" },
  "Y": { word: "Yankee", pronunciation: "YANG-key" },
  "Z": { word: "Zulu", pronunciation: "ZOO-loo" },
  "0": { word: "Zero", pronunciation: "ZE-ro" },
  "1": { word: "One", pronunciation: "WUN" },
  "2": { word: "Two", pronunciation: "TOO" },
  "3": { word: "Three", pronunciation: "TREE" },
  "4": { word: "Four", pronunciation: "FOW-er" },
  "5": { word: "Five", pronunciation: "FIFE" },
  "6": { word: "Six", pronunciation: "SIX" },
  "7": { word: "Seven", pronunciation: "SEV-en" },
  "8": { word: "Eight", pronunciation: "AIT" },
  "9": { word: "Nine", pronunciation: "NIN-er" },
};

export default function NatoAlphabetPage() {
  const [input, setInput] = useState("");
  const [showPronunciation, setShowPronunciation] = useState(true);

  const convertedText = useMemo(() => {
    return input
      .toUpperCase()
      .split("")
      .map(char => {
        if (char === " ") return { original: " ", word: "(space)", pronunciation: "" };
        const nato = natoAlphabet[char];
        if (nato) return { original: char, ...nato };
        return { original: char, word: char, pronunciation: "" };
      });
  }, [input]);

  const copyOutput = async () => {
    const text = convertedText.map(c => c.word).join(" ");
    await navigator.clipboard.writeText(text);
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Text Input</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to convert to NATO phonetic alphabet..."
            className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)] min-h-[100px]"
          />
        </div>

        {input && (
          <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">NATO Phonetic Output</h3>
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer text-sm">
                  <input
                    type="checkbox"
                    checked={showPronunciation}
                    onChange={(e) => setShowPronunciation(e.target.checked)}
                    className="rounded"
                  />
                  Show pronunciation
                </label>
                <button
                  onClick={copyOutput}
                  className="text-sm px-3 py-1 rounded bg-[var(--muted)] hover:bg-[var(--accent)]"
                >
                  📋 Copy
                </button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2">
              {convertedText.map((item, idx) => (
                <div
                  key={idx}
                  className={`rounded-lg p-3 text-center ${
                    item.original === " " 
                      ? "bg-transparent w-4" 
                      : "bg-[var(--muted)]"
                  }`}
                >
                  {item.original !== " " && (
                    <>
                      <div className="text-xs text-[var(--muted-foreground)] mb-1">
                        {item.original}
                      </div>
                      <div className="font-bold">{item.word}</div>
                      {showPronunciation && item.pronunciation && (
                        <div className="text-xs text-[var(--muted-foreground)] mt-1">
                          {item.pronunciation}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-[var(--muted)] rounded-lg">
              <div className="text-sm text-[var(--muted-foreground)]">Spoken form:</div>
              <div className="font-medium">{convertedText.map(c => c.word).join(" - ")}</div>
            </div>
          </div>
        )}

        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-4">📖 NATO Phonetic Alphabet Reference</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {Object.entries(natoAlphabet)
              .filter(([key]) => /[A-Z]/.test(key))
              .map(([letter, { word, pronunciation }]) => (
                <div
                  key={letter}
                  className="bg-[var(--muted)] rounded-lg p-3 text-center cursor-pointer hover:bg-[var(--accent)]"
                  onClick={() => setInput(prev => prev + letter)}
                >
                  <div className="text-2xl font-bold">{letter}</div>
                  <div className="font-medium text-sm">{word}</div>
                  <div className="text-xs text-[var(--muted-foreground)]">{pronunciation}</div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-4">🔢 Numbers</h3>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-3">
            {Object.entries(natoAlphabet)
              .filter(([key]) => /[0-9]/.test(key))
              .map(([num, { word, pronunciation }]) => (
                <div
                  key={num}
                  className="bg-[var(--muted)] rounded-lg p-3 text-center cursor-pointer hover:bg-[var(--accent)]"
                  onClick={() => setInput(prev => prev + num)}
                >
                  <div className="text-xl font-bold">{num}</div>
                  <div className="font-medium text-xs">{word}</div>
                  <div className="text-xs text-[var(--muted-foreground)]">{pronunciation}</div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-[var(--muted)] rounded-xl p-4 text-sm text-[var(--muted-foreground)]">
          <h4 className="font-medium mb-2">About the NATO Phonetic Alphabet:</h4>
          <p>
            The NATO phonetic alphabet is a spelling alphabet used by airline pilots, police, 
            military, and other organizations for clear communication. Each letter is represented 
            by a unique word to prevent misunderstanding, especially over radio or telephone.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
