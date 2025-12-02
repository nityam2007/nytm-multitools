"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("tip-calculator")!;
const similarTools = getToolsByCategory("misc").filter(t => t.slug !== "tip-calculator");

export default function TipCalculatorPage() {
  const [billAmount, setBillAmount] = useState("");
  const [tipPercent, setTipPercent] = useState(15);
  const [customTip, setCustomTip] = useState("");
  const [numPeople, setNumPeople] = useState(1);
  const [roundUp, setRoundUp] = useState(false);

  const calculation = useMemo(() => {
    const bill = parseFloat(billAmount) || 0;
    const tip = customTip ? parseFloat(customTip) : tipPercent;
    
    if (bill <= 0 || tip < 0 || numPeople < 1) {
      return null;
    }

    let tipAmount = (bill * tip) / 100;
    let total = bill + tipAmount;

    if (roundUp) {
      total = Math.ceil(total);
      tipAmount = total - bill;
    }

    const tipPerPerson = tipAmount / numPeople;
    const totalPerPerson = total / numPeople;

    return {
      tipAmount: tipAmount.toFixed(2),
      total: total.toFixed(2),
      tipPerPerson: tipPerPerson.toFixed(2),
      totalPerPerson: totalPerPerson.toFixed(2),
      effectiveTipPercent: ((tipAmount / bill) * 100).toFixed(1),
    };
  }, [billAmount, tipPercent, customTip, numPeople, roundUp]);

  const quickTips = [10, 15, 18, 20, 25];

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Bill Amount ($)</label>
          <input
            type="number"
            value={billAmount}
            onChange={(e) => setBillAmount(e.target.value)}
            placeholder="0.00"
            min="0"
            step="0.01"
            className="w-full px-4 py-4 text-2xl font-mono rounded-lg bg-[var(--background)] border border-[var(--border)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Tip Percentage</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {quickTips.map((tip) => (
              <button
                key={tip}
                onClick={() => {
                  setTipPercent(tip);
                  setCustomTip("");
                }}
                className={`px-4 py-2 rounded-lg font-medium ${
                  tipPercent === tip && !customTip
                    ? "bg-[var(--foreground)] text-[var(--background)]"
                    : "bg-[var(--muted)] hover:bg-[var(--accent)]"
                }`}
              >
                {tip}%
              </button>
            ))}
            <input
              type="number"
              value={customTip}
              onChange={(e) => setCustomTip(e.target.value)}
              placeholder="Custom %"
              min="0"
              className="w-24 px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            />
          </div>
          <input
            type="range"
            value={customTip || tipPercent}
            onChange={(e) => {
              setTipPercent(parseInt(e.target.value));
              setCustomTip("");
            }}
            min="0"
            max="50"
            className="w-full h-2 bg-[var(--muted)] rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-xs text-[var(--muted-foreground)] mt-1">
            <span>0%</span>
            <span>25%</span>
            <span>50%</span>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Number of People</label>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setNumPeople(Math.max(1, numPeople - 1))}
              className="w-12 h-12 rounded-full bg-[var(--muted)] hover:bg-[var(--accent)] text-xl font-bold"
            >
              −
            </button>
            <input
              type="number"
              value={numPeople}
              onChange={(e) => setNumPeople(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              className="w-20 px-4 py-3 text-center text-xl font-mono rounded-lg bg-[var(--background)] border border-[var(--border)]"
            />
            <button
              onClick={() => setNumPeople(numPeople + 1)}
              className="w-12 h-12 rounded-full bg-[var(--muted)] hover:bg-[var(--accent)] text-xl font-bold"
            >
              +
            </button>
          </div>
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={roundUp}
            onChange={(e) => setRoundUp(e.target.checked)}
            className="w-5 h-5 rounded"
          />
          <span>Round up total to nearest dollar</span>
        </label>

        {calculation && parseFloat(billAmount) > 0 && (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white">
                <div className="text-sm opacity-80 mb-1">Tip Amount</div>
                <div className="text-4xl font-bold">${calculation.tipAmount}</div>
                <div className="text-sm opacity-80 mt-1">
                  {calculation.effectiveTipPercent}% of bill
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-500 to-teal-600 rounded-xl p-6 text-white">
                <div className="text-sm opacity-80 mb-1">Total</div>
                <div className="text-4xl font-bold">${calculation.total}</div>
                <div className="text-sm opacity-80 mt-1">
                  Bill + Tip
                </div>
              </div>
            </div>

            {numPeople > 1 && (
              <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
                <h3 className="font-semibold mb-4">Split Between {numPeople} People</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-[var(--muted)] rounded-lg p-4 text-center">
                    <div className="text-sm text-[var(--muted-foreground)]">Tip Per Person</div>
                    <div className="text-2xl font-bold">${calculation.tipPerPerson}</div>
                  </div>
                  <div className="bg-[var(--muted)] rounded-lg p-4 text-center">
                    <div className="text-sm text-[var(--muted-foreground)]">Total Per Person</div>
                    <div className="text-2xl font-bold">${calculation.totalPerPerson}</div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
              <h3 className="font-semibold mb-4 flex items-center gap-2"><svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>Summary</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between py-2 border-b border-[var(--border)]">
                  <span className="text-[var(--muted-foreground)]">Bill Amount</span>
                  <span className="font-mono">${parseFloat(billAmount).toFixed(2)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[var(--border)]">
                  <span className="text-[var(--muted-foreground)]">
                    Tip ({customTip || tipPercent}%)
                  </span>
                  <span className="font-mono">${calculation.tipAmount}</span>
                </div>
                <div className="flex justify-between py-2 font-bold">
                  <span>Total</span>
                  <span className="font-mono">${calculation.total}</span>
                </div>
              </div>
            </div>
          </>
        )}

        <div className="bg-[var(--muted)] rounded-xl p-4 text-sm text-[var(--muted-foreground)]">
          <h4 className="font-medium mb-2 flex items-center gap-2"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>Tipping Guidelines (US):</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>15% - Standard service</li>
            <li>18-20% - Good service</li>
            <li>20-25% - Excellent service</li>
            <li>10% or less - Poor service (consider feedback)</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
