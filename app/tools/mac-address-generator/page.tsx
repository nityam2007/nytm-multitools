"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("mac-address-generator")!;
const similarTools = getToolsByCategory("generator").filter(t => t.slug !== "mac-address-generator");

type MACFormat = "colon" | "dash" | "dot" | "none";

const formatMAC = (bytes: string[], format: MACFormat): string => {
  switch (format) {
    case "colon":
      return bytes.join(":");
    case "dash":
      return bytes.join("-");
    case "dot":
      return `${bytes[0]}${bytes[1]}.${bytes[2]}${bytes[3]}.${bytes[4]}${bytes[5]}`;
    case "none":
      return bytes.join("");
    default:
      return bytes.join(":");
  }
};

export default function MACAddressGeneratorPage() {
  const [format, setFormat] = useState<MACFormat>("colon");
  const [uppercase, setUppercase] = useState(true);
  const [unicast, setUnicast] = useState(true);
  const [localAdmin, setLocalAdmin] = useState(false);
  const [count, setCount] = useState(10);
  const [results, setResults] = useState<string[]>([]);

  const generateMAC = (): string => {
    const bytes: string[] = [];
    
    for (let i = 0; i < 6; i++) {
      let byte = Math.floor(Math.random() * 256);
      
      // First byte special handling
      if (i === 0) {
        if (unicast) {
          byte = byte & 0xFE; // Clear least significant bit (unicast)
        } else {
          byte = byte | 0x01; // Set least significant bit (multicast)
        }
        
        if (localAdmin) {
          byte = byte | 0x02; // Set second least significant bit (locally administered)
        } else {
          byte = byte & 0xFD; // Clear second least significant bit (universally administered)
        }
      }
      
      const hex = byte.toString(16).padStart(2, "0");
      bytes.push(uppercase ? hex.toUpperCase() : hex);
    }
    
    return formatMAC(bytes, format);
  };

  const generate = () => {
    const macs: string[] = [];
    for (let i = 0; i < count; i++) {
      macs.push(generateMAC());
    }
    setResults(macs);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(results.join("\n"));
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Format</label>
            <select
              value={format}
              onChange={(e) => setFormat(e.target.value as MACFormat)}
              className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            >
              <option value="colon">Colon (00:1A:2B:3C:4D:5E)</option>
              <option value="dash">Dash (00-1A-2B-3C-4D-5E)</option>
              <option value="dot">Dot (001A.2B3C.4D5E)</option>
              <option value="none">None (001A2B3C4D5E)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Count</label>
            <input
              type="number"
              min="1"
              max="100"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Uppercase</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={unicast}
              onChange={(e) => setUnicast(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Unicast (device address)</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={localAdmin}
              onChange={(e) => setLocalAdmin(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Locally Administered</span>
          </label>
        </div>

        <button
          onClick={generate}
          className="w-full py-3 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" />
          </svg>
          Generate MAC Addresses
        </button>

        {results.length > 0 && (
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-medium">Results ({results.length})</label>
              <button
                onClick={copyAll}
                className="px-3 py-1 text-sm rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)]"
              >
                Copy All
              </button>
            </div>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {results.map((mac, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-3 bg-[var(--muted)] rounded-lg"
                >
                  <code className="flex-1 font-mono">{mac}</code>
                  <button
                    onClick={() => copyToClipboard(mac)}
                    className="px-2 py-1 text-xs rounded bg-[var(--background)] hover:bg-[var(--accent)] transition-colors"
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-3">About MAC Addresses</h3>
          <div className="space-y-2 text-sm text-[var(--muted-foreground)]">
            <p>• MAC (Media Access Control) addresses are 48-bit hardware identifiers</p>
            <p>• First 3 bytes (OUI) identify the manufacturer</p>
            <p>• Last 3 bytes are device-specific</p>
            <p>• Unicast addresses are for single devices, multicast for groups</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
