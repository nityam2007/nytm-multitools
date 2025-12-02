"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("morse-code")!;
const similarTools = getToolsByCategory("misc").filter(t => t.slug !== "morse-code");

const morseCodeMap: Record<string, string> = {
  "A": ".-", "B": "-...", "C": "-.-.", "D": "-..", "E": ".", "F": "..-.",
  "G": "--.", "H": "....", "I": "..", "J": ".---", "K": "-.-", "L": ".-..",
  "M": "--", "N": "-.", "O": "---", "P": ".--.", "Q": "--.-", "R": ".-.",
  "S": "...", "T": "-", "U": "..-", "V": "...-", "W": ".--", "X": "-..-",
  "Y": "-.--", "Z": "--..",
  "0": "-----", "1": ".----", "2": "..---", "3": "...--", "4": "....-",
  "5": ".....", "6": "-....", "7": "--...", "8": "---..", "9": "----.",
  ".": ".-.-.-", ",": "--..--", "?": "..--..", "'": ".----.", "!": "-.-.--",
  "/": "-..-.", "(": "-.--.", ")": "-.--.-", "&": ".-...", ":": "---...",
  ";": "-.-.-.", "=": "-...-", "+": ".-.-.", "-": "-....-", "_": "..--.-",
  "\"": ".-..-.", "$": "...-..-", "@": ".--.-.", " ": "/",
};

const reverseMorseMap: Record<string, string> = Object.fromEntries(
  Object.entries(morseCodeMap).map(([k, v]) => [v, k])
);

export default function MorseCodePage() {
  const [textInput, setTextInput] = useState("");
  const [morseInput, setMorseInput] = useState("");
  const [mode, setMode] = useState<"textToMorse" | "morseToText">("textToMorse");

  const textToMorse = (text: string): string => {
    return text
      .toUpperCase()
      .split("")
      .map(char => morseCodeMap[char] || char)
      .join(" ");
  };

  const morseToText = (morse: string): string => {
    return morse
      .split(" ")
      .map(code => {
        if (code === "/") return " ";
        return reverseMorseMap[code] || code;
      })
      .join("");
  };

  const handleTextChange = (text: string) => {
    setTextInput(text);
    setMorseInput(textToMorse(text));
  };

  const handleMorseChange = (morse: string) => {
    setMorseInput(morse);
    setTextInput(morseToText(morse));
  };

  const playMorse = () => {
    if (!morseInput) return;
    
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const dotDuration = 0.1; // seconds
    const dashDuration = 0.3;
    const pauseDuration = 0.1;
    const letterPause = 0.3;
    const wordPause = 0.7;

    let currentTime = audioContext.currentTime;

    const playTone = (duration: number) => {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      oscillator.frequency.value = 600;
      oscillator.type = "sine";
      gainNode.gain.setValueAtTime(0.5, currentTime);
      oscillator.start(currentTime);
      oscillator.stop(currentTime + duration);
      currentTime += duration + pauseDuration;
    };

    morseInput.split("").forEach(char => {
      if (char === ".") {
        playTone(dotDuration);
      } else if (char === "-") {
        playTone(dashDuration);
      } else if (char === " ") {
        currentTime += letterPause;
      } else if (char === "/") {
        currentTime += wordPause;
      }
    });
  };

  const copyMorse = async () => {
    await navigator.clipboard.writeText(morseInput);
  };

  const copyText = async () => {
    await navigator.clipboard.writeText(textInput);
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="flex gap-2 justify-center">
          <button
            onClick={() => setMode("textToMorse")}
            className={`px-4 py-2 rounded-lg font-medium ${
              mode === "textToMorse"
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "bg-[var(--muted)]"
            }`}
          >
            Text → Morse
          </button>
          <button
            onClick={() => setMode("morseToText")}
            className={`px-4 py-2 rounded-lg font-medium ${
              mode === "morseToText"
                ? "bg-[var(--foreground)] text-[var(--background)]"
                : "bg-[var(--muted)]"
            }`}
          >
            Morse → Text
          </button>
        </div>

        {mode === "textToMorse" ? (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Text Input</label>
              <textarea
                value={textInput}
                onChange={(e) => handleTextChange(e.target.value)}
                placeholder="Enter text to convert to Morse code..."
                className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)] min-h-[100px]"
              />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Morse Code</label>
                <div className="flex gap-2">
                  <button
                    onClick={playMorse}
                    disabled={!morseInput}
                    className="text-sm px-3 py-1 rounded bg-[var(--muted)] hover:bg-[var(--accent)] disabled:opacity-50 inline-flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" /></svg>
                    Play
                  </button>
                  <button
                    onClick={copyMorse}
                    disabled={!morseInput}
                    className="text-sm px-3 py-1 rounded bg-[var(--muted)] hover:bg-[var(--accent)] disabled:opacity-50 inline-flex items-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                    Copy
                  </button>
                </div>
              </div>
              <div className="w-full px-4 py-3 rounded-lg bg-[var(--muted)] border border-[var(--border)] min-h-[100px] font-mono text-lg tracking-wider break-all">
                {morseInput || <span className="text-[var(--muted-foreground)]">Morse code will appear here...</span>}
              </div>
            </div>
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Morse Code Input</label>
              <textarea
                value={morseInput}
                onChange={(e) => handleMorseChange(e.target.value)}
                placeholder="Enter Morse code (use dots, dashes, spaces, and / for word breaks)..."
                className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)] min-h-[100px] font-mono"
              />
              <p className="text-xs text-[var(--muted-foreground)] mt-1">
                Use &quot;.&quot; for dot, &quot;-&quot; for dash, space between letters, &quot;/&quot; between words
              </p>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Text Output</label>
                <button
                  onClick={copyText}
                  disabled={!textInput}
                  className="text-sm px-3 py-1 rounded bg-[var(--muted)] hover:bg-[var(--accent)] disabled:opacity-50 inline-flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                  Copy
                </button>
              </div>
              <div className="w-full px-4 py-3 rounded-lg bg-[var(--muted)] border border-[var(--border)] min-h-[100px]">
                {textInput || <span className="text-[var(--muted-foreground)]">Decoded text will appear here...</span>}
              </div>
            </div>
          </>
        )}

        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-4 flex items-center gap-2"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>Morse Code Reference</h3>
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-9 gap-2 text-sm">
            {Object.entries(morseCodeMap)
              .filter(([char]) => char !== " ")
              .slice(0, 36)
              .map(([char, code]) => (
                <div key={char} className="bg-[var(--muted)] rounded p-2 text-center">
                  <div className="font-bold">{char}</div>
                  <div className="font-mono text-xs text-[var(--muted-foreground)]">{code}</div>
                </div>
              ))}
          </div>
        </div>

        <div className="bg-[var(--muted)] rounded-xl p-4 text-sm text-[var(--muted-foreground)]">
          <h4 className="font-medium mb-2">Timing in Morse Code:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Dot (dit): 1 unit</li>
            <li>Dash (dah): 3 units</li>
            <li>Space between parts of same letter: 1 unit</li>
            <li>Space between letters: 3 units</li>
            <li>Space between words: 7 units</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
