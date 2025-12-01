"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("iban-generator")!;
const similarTools = getToolsByCategory("generator").filter(t => t.slug !== "iban-generator");

const countries = [
  { code: "DE", name: "Germany", length: 22, format: "DEkk bbbb bbbb cccc cccc cc" },
  { code: "FR", name: "France", length: 27, format: "FRkk bbbb bggg ggcc cccc cccc cxx" },
  { code: "GB", name: "United Kingdom", length: 22, format: "GBkk bbbb ssss sscc cccc cc" },
  { code: "ES", name: "Spain", length: 24, format: "ESkk bbbb gggg xxcc cccc cccc" },
  { code: "IT", name: "Italy", length: 27, format: "ITkk xbbb bbgg gggc cccc cccc ccc" },
  { code: "NL", name: "Netherlands", length: 18, format: "NLkk bbbb cccc cccc cc" },
  { code: "BE", name: "Belgium", length: 16, format: "BEkk bbbc cccc ccxx" },
  { code: "AT", name: "Austria", length: 20, format: "ATkk bbbb bccc cccc cccc" },
  { code: "CH", name: "Switzerland", length: 21, format: "CHkk bbbb bccc cccc cccc c" },
  { code: "PL", name: "Poland", length: 28, format: "PLkk bbbs sssx cccc cccc cccc cccc" },
];

const mod97 = (str: string): number => {
  let remainder = str;
  while (remainder.length > 2) {
    const block = remainder.slice(0, 9);
    remainder = (parseInt(block, 10) % 97).toString() + remainder.slice(9);
  }
  return parseInt(remainder, 10) % 97;
};

const calculateCheckDigits = (countryCode: string, bban: string): string => {
  const rearranged = bban + countryCode + "00";
  const numericStr = rearranged.split("").map(char => {
    const code = char.charCodeAt(0);
    if (code >= 65 && code <= 90) return (code - 55).toString();
    return char;
  }).join("");
  
  const checkDigits = 98 - mod97(numericStr);
  return checkDigits.toString().padStart(2, "0");
};

export default function IBANGeneratorPage() {
  const [country, setCountry] = useState("DE");
  const [count, setCount] = useState(5);
  const [results, setResults] = useState<{iban: string; formatted: string}[]>([]);

  const randomDigit = () => Math.floor(Math.random() * 10).toString();
  const randomLetter = () => String.fromCharCode(65 + Math.floor(Math.random() * 26));

  const generateBBAN = (countryCode: string): string => {
    const countryConfig = countries.find(c => c.code === countryCode);
    if (!countryConfig) return "";
    
    const bbanLength = countryConfig.length - 4; // Minus country code and check digits
    let bban = "";
    
    // Generate random BBAN (simplified - in reality, structure varies by country)
    for (let i = 0; i < bbanLength; i++) {
      bban += randomDigit();
    }
    
    return bban;
  };

  const generate = () => {
    const ibans: {iban: string; formatted: string}[] = [];
    
    for (let i = 0; i < count; i++) {
      const bban = generateBBAN(country);
      const checkDigits = calculateCheckDigits(country, bban);
      const iban = country + checkDigits + bban;
      const formatted = iban.match(/.{1,4}/g)?.join(" ") || iban;
      
      ibans.push({ iban, formatted });
    }
    
    setResults(ibans);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const copyAll = () => {
    navigator.clipboard.writeText(results.map(r => r.iban).join("\n"));
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-xl p-4 text-yellow-500 text-sm">
          ⚠️ <strong>Disclaimer:</strong> These are randomly generated IBANs for testing purposes only. They pass checksum validation but are not real bank accounts.
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Country</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            >
              {countries.map(c => (
                <option key={c.code} value={c.code}>{c.name} ({c.code})</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Count</label>
            <input
              type="number"
              min="1"
              max="20"
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value) || 1)}
              className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            />
          </div>
        </div>

        <button
          onClick={generate}
          className="w-full py-3 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-medium hover:opacity-90 transition-opacity"
        >
          🏦 Generate IBANs
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
            <div className="space-y-2">
              {results.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-3 bg-[var(--muted)] rounded-lg"
                >
                  <code className="flex-1 font-mono tracking-wider">{item.formatted}</code>
                  <button
                    onClick={() => copyToClipboard(item.iban)}
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
          <h3 className="font-semibold mb-3">IBAN Structure</h3>
          <div className="space-y-2 text-sm">
            <div className="flex gap-4">
              <span className="text-[var(--muted-foreground)] w-32">Country Code:</span>
              <span>2 letters (ISO 3166-1)</span>
            </div>
            <div className="flex gap-4">
              <span className="text-[var(--muted-foreground)] w-32">Check Digits:</span>
              <span>2 digits (MOD 97)</span>
            </div>
            <div className="flex gap-4">
              <span className="text-[var(--muted-foreground)] w-32">BBAN:</span>
              <span>Up to 30 alphanumeric characters</span>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
