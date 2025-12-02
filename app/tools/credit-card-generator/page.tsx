"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("credit-card-generator")!;
const similarTools = getToolsByCategory("generator").filter(t => t.slug !== "credit-card-generator");

const cardTypes = {
  visa: { prefix: ["4"], length: 16, name: "Visa" },
  mastercard: { prefix: ["51", "52", "53", "54", "55"], length: 16, name: "Mastercard" },
  amex: { prefix: ["34", "37"], length: 15, name: "American Express" },
  discover: { prefix: ["6011", "65"], length: 16, name: "Discover" },
};

type CardType = keyof typeof cardTypes;

const luhnCheck = (num: string): boolean => {
  let sum = 0;
  let isEven = false;
  for (let i = num.length - 1; i >= 0; i--) {
    let digit = parseInt(num[i], 10);
    if (isEven) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
    isEven = !isEven;
  }
  return sum % 10 === 0;
};

const generateLuhnCheckDigit = (partial: string): string => {
  for (let i = 0; i <= 9; i++) {
    if (luhnCheck(partial + i)) return String(i);
  }
  return "0";
};

export default function CreditCardGeneratorPage() {
  const [cardType, setCardType] = useState<CardType>("visa");
  const [count, setCount] = useState(5);
  const [results, setResults] = useState<{number: string; type: string; cvv: string; exp: string}[]>([]);

  const generate = () => {
    const cards: {number: string; type: string; cvv: string; exp: string}[] = [];
    
    for (let i = 0; i < count; i++) {
      const config = cardTypes[cardType];
      const prefix = config.prefix[Math.floor(Math.random() * config.prefix.length)];
      
      // Generate random digits for the middle part
      let number = prefix;
      const remainingLength = config.length - prefix.length - 1; // -1 for check digit
      for (let j = 0; j < remainingLength; j++) {
        number += Math.floor(Math.random() * 10);
      }
      
      // Add Luhn check digit
      number += generateLuhnCheckDigit(number);
      
      // Generate CVV
      const cvvLength = cardType === "amex" ? 4 : 3;
      let cvv = "";
      for (let j = 0; j < cvvLength; j++) {
        cvv += Math.floor(Math.random() * 10);
      }
      
      // Generate expiry date (future date)
      const month = String(Math.floor(Math.random() * 12) + 1).padStart(2, "0");
      const year = String(new Date().getFullYear() + Math.floor(Math.random() * 5) + 1).slice(-2);
      
      cards.push({
        number,
        type: config.name,
        cvv,
        exp: `${month}/${year}`,
      });
    }
    
    setResults(cards);
  };

  const formatCardNumber = (num: string): string => {
    if (num.length === 15) {
      return `${num.slice(0, 4)} ${num.slice(4, 10)} ${num.slice(10)}`;
    }
    return num.match(/.{1,4}/g)?.join(" ") || num;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-xl p-4 text-yellow-500 text-sm flex items-start gap-3">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span><strong>Disclaimer:</strong> These are randomly generated numbers for testing purposes only. They are not real credit card numbers and cannot be used for actual transactions.</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Card Type</label>
            <select
              value={cardType}
              onChange={(e) => setCardType(e.target.value as CardType)}
              className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            >
              {(Object.keys(cardTypes) as CardType[]).map(type => (
                <option key={type} value={type}>{cardTypes[type].name}</option>
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
          className="w-full py-3 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
          </svg>
          Generate Test Cards
        </button>

        {results.length > 0 && (
          <div className="space-y-4">
            {results.map((card, idx) => (
              <div key={idx} className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
                <div className="flex justify-between items-start mb-8">
                  <div className="text-sm opacity-70">{card.type}</div>
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                </div>
                <div 
                  className="text-xl sm:text-2xl font-mono tracking-wider mb-6 cursor-pointer hover:text-blue-400 transition-colors"
                  onClick={() => copyToClipboard(card.number)}
                  title="Click to copy"
                >
                  {formatCardNumber(card.number)}
                </div>
                <div className="flex justify-between text-sm">
                  <div>
                    <div className="opacity-50 text-xs">EXPIRES</div>
                    <div className="font-mono">{card.exp}</div>
                  </div>
                  <div>
                    <div className="opacity-50 text-xs">CVV</div>
                    <div className="font-mono">{card.cvv}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
