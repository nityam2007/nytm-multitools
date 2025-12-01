"use client";

import { useState, useEffect, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("keyboard-tester")!;
const similarTools = getToolsByCategory("misc").filter(t => t.slug !== "keyboard-tester");

interface KeyPress {
  key: string;
  code: string;
  timestamp: number;
}

const keyboardLayout = [
  ["Escape", "F1", "F2", "F3", "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12"],
  ["Backquote", "Digit1", "Digit2", "Digit3", "Digit4", "Digit5", "Digit6", "Digit7", "Digit8", "Digit9", "Digit0", "Minus", "Equal", "Backspace"],
  ["Tab", "KeyQ", "KeyW", "KeyE", "KeyR", "KeyT", "KeyY", "KeyU", "KeyI", "KeyO", "KeyP", "BracketLeft", "BracketRight", "Backslash"],
  ["CapsLock", "KeyA", "KeyS", "KeyD", "KeyF", "KeyG", "KeyH", "KeyJ", "KeyK", "KeyL", "Semicolon", "Quote", "Enter"],
  ["ShiftLeft", "KeyZ", "KeyX", "KeyC", "KeyV", "KeyB", "KeyN", "KeyM", "Comma", "Period", "Slash", "ShiftRight"],
  ["ControlLeft", "MetaLeft", "AltLeft", "Space", "AltRight", "MetaRight", "ContextMenu", "ControlRight"],
];

const keyLabels: Record<string, string> = {
  "Escape": "Esc",
  "Backquote": "`",
  "Digit1": "1", "Digit2": "2", "Digit3": "3", "Digit4": "4", "Digit5": "5",
  "Digit6": "6", "Digit7": "7", "Digit8": "8", "Digit9": "9", "Digit0": "0",
  "Minus": "-", "Equal": "=", "Backspace": "⌫",
  "Tab": "Tab",
  "KeyQ": "Q", "KeyW": "W", "KeyE": "E", "KeyR": "R", "KeyT": "T",
  "KeyY": "Y", "KeyU": "U", "KeyI": "I", "KeyO": "O", "KeyP": "P",
  "BracketLeft": "[", "BracketRight": "]", "Backslash": "\\",
  "CapsLock": "Caps",
  "KeyA": "A", "KeyS": "S", "KeyD": "D", "KeyF": "F", "KeyG": "G",
  "KeyH": "H", "KeyJ": "J", "KeyK": "K", "KeyL": "L",
  "Semicolon": ";", "Quote": "'", "Enter": "Enter",
  "ShiftLeft": "Shift", "ShiftRight": "Shift",
  "KeyZ": "Z", "KeyX": "X", "KeyC": "C", "KeyV": "V", "KeyB": "B",
  "KeyN": "N", "KeyM": "M",
  "Comma": ",", "Period": ".", "Slash": "/",
  "ControlLeft": "Ctrl", "ControlRight": "Ctrl",
  "MetaLeft": "⌘", "MetaRight": "⌘",
  "AltLeft": "Alt", "AltRight": "Alt",
  "Space": "Space",
  "ContextMenu": "Menu",
  "F1": "F1", "F2": "F2", "F3": "F3", "F4": "F4", "F5": "F5", "F6": "F6",
  "F7": "F7", "F8": "F8", "F9": "F9", "F10": "F10", "F11": "F11", "F12": "F12",
};

const wideKeys = ["Backspace", "Tab", "CapsLock", "Enter", "ShiftLeft", "ShiftRight", "Space", "ControlLeft", "ControlRight"];

export default function KeyboardTesterPage() {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [testedKeys, setTestedKeys] = useState<Set<string>>(new Set());
  const [keyHistory, setKeyHistory] = useState<KeyPress[]>([]);
  const [lastKey, setLastKey] = useState<{ key: string; code: string } | null>(null);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    const code = e.code;
    
    setPressedKeys(prev => new Set([...prev, code]));
    setTestedKeys(prev => new Set([...prev, code]));
    setLastKey({ key: e.key, code });
    setKeyHistory(prev => [{
      key: e.key,
      code,
      timestamp: Date.now(),
    }, ...prev].slice(0, 20));
  }, []);

  const handleKeyUp = useCallback((e: KeyboardEvent) => {
    e.preventDefault();
    setPressedKeys(prev => {
      const newSet = new Set(prev);
      newSet.delete(e.code);
      return newSet;
    });
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [handleKeyDown, handleKeyUp]);

  const resetTest = () => {
    setPressedKeys(new Set());
    setTestedKeys(new Set());
    setKeyHistory([]);
    setLastKey(null);
  };

  const totalKeys = keyboardLayout.flat().length;
  const testedCount = keyboardLayout.flat().filter(k => testedKeys.has(k)).length;
  const progress = Math.round((testedCount / totalKeys) * 100);

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="bg-[var(--muted)] rounded-xl p-4 text-center">
          <p className="text-[var(--muted-foreground)]">Press any key to test your keyboard</p>
        </div>

        {lastKey && (
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)] text-center">
              <div className="text-sm text-[var(--muted-foreground)] mb-1">Key</div>
              <div className="text-3xl font-mono font-bold">{lastKey.key || "N/A"}</div>
            </div>
            <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)] text-center">
              <div className="text-sm text-[var(--muted-foreground)] mb-1">Code</div>
              <div className="text-lg font-mono">{lastKey.code}</div>
            </div>
          </div>
        )}

        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Keyboard Layout</h3>
            <div className="flex items-center gap-4">
              <span className="text-sm text-[var(--muted-foreground)]">
                {testedCount}/{totalKeys} keys tested ({progress}%)
              </span>
              <button
                onClick={resetTest}
                className="text-sm px-3 py-1 rounded bg-[var(--muted)] hover:bg-[var(--accent)]"
              >
                Reset
              </button>
            </div>
          </div>
          
          <div className="space-y-2 overflow-x-auto">
            {keyboardLayout.map((row, rowIdx) => (
              <div key={rowIdx} className="flex gap-1 justify-center">
                {row.map(keyCode => {
                  const isPressed = pressedKeys.has(keyCode);
                  const isTested = testedKeys.has(keyCode);
                  const isWide = wideKeys.includes(keyCode);
                  const isSpace = keyCode === "Space";
                  
                  return (
                    <div
                      key={keyCode}
                      className={`
                        flex items-center justify-center rounded-lg border text-sm font-medium transition-all
                        ${isSpace ? "w-48" : isWide ? "w-20" : "w-10"} h-10
                        ${isPressed 
                          ? "bg-blue-500 text-white border-blue-600 scale-95" 
                          : isTested 
                            ? "bg-green-500/20 border-green-500 text-green-700 dark:text-green-400" 
                            : "bg-[var(--muted)] border-[var(--border)]"
                        }
                      `}
                    >
                      {keyLabels[keyCode] || keyCode}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {keyHistory.length > 0 && (
          <div className="bg-[var(--card)] rounded-xl border border-[var(--border)]">
            <div className="p-4 border-b border-[var(--border)] flex justify-between items-center">
              <h3 className="font-semibold">Key History</h3>
              <button
                onClick={() => setKeyHistory([])}
                className="text-sm text-red-500 hover:text-red-600"
              >
                Clear
              </button>
            </div>
            <div className="p-4 max-h-48 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {keyHistory.map((press, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 rounded bg-[var(--muted)] text-sm font-mono"
                    title={press.code}
                  >
                    {press.key || press.code}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 rounded bg-[var(--muted)] border border-[var(--border)]" />
            <span>Not tested</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 rounded bg-green-500/20 border border-green-500" />
            <span>Tested</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-4 h-4 rounded bg-blue-500 border border-blue-600" />
            <span>Currently pressed</span>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
