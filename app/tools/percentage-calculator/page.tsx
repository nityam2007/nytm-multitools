"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("percentage-calculator")!;
const similarTools = getToolsByCategory("misc").filter(t => t.slug !== "percentage-calculator");

export default function PercentageCalculatorPage() {
  const [calc1, setCalc1] = useState({ percentage: 20, of: 100 });
  const [calc2, setCalc2] = useState({ is: 25, of: 100 });
  const [calc3, setCalc3] = useState({ from: 50, to: 75 });
  const [calc4, setCalc4] = useState({ value: 100, percentage: 15, operation: "increase" as "increase" | "decrease" });

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        {/* What is X% of Y? */}
        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-4">What is X% of Y?</h3>
          <div className="flex flex-wrap items-center gap-2">
            <span>What is</span>
            <input
              type="number"
              value={calc1.percentage}
              onChange={(e) => setCalc1({ ...calc1, percentage: parseFloat(e.target.value) || 0 })}
              className="w-20 px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-center"
            />
            <span>% of</span>
            <input
              type="number"
              value={calc1.of}
              onChange={(e) => setCalc1({ ...calc1, of: parseFloat(e.target.value) || 0 })}
              className="w-24 px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-center"
            />
            <span>=</span>
            <span className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg font-bold">
              {((calc1.percentage / 100) * calc1.of).toFixed(2)}
            </span>
          </div>
        </div>

        {/* X is what % of Y? */}
        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-4">X is what % of Y?</h3>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="number"
              value={calc2.is}
              onChange={(e) => setCalc2({ ...calc2, is: parseFloat(e.target.value) || 0 })}
              className="w-24 px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-center"
            />
            <span>is what % of</span>
            <input
              type="number"
              value={calc2.of}
              onChange={(e) => setCalc2({ ...calc2, of: parseFloat(e.target.value) || 0 })}
              className="w-24 px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-center"
            />
            <span>=</span>
            <span className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg font-bold">
              {calc2.of !== 0 ? ((calc2.is / calc2.of) * 100).toFixed(2) : 0}%
            </span>
          </div>
        </div>

        {/* Percentage change from X to Y */}
        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-4">Percentage Change</h3>
          <div className="flex flex-wrap items-center gap-2">
            <span>From</span>
            <input
              type="number"
              value={calc3.from}
              onChange={(e) => setCalc3({ ...calc3, from: parseFloat(e.target.value) || 0 })}
              className="w-24 px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-center"
            />
            <span>to</span>
            <input
              type="number"
              value={calc3.to}
              onChange={(e) => setCalc3({ ...calc3, to: parseFloat(e.target.value) || 0 })}
              className="w-24 px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-center"
            />
            <span>=</span>
            <span className={`px-4 py-2 rounded-lg font-bold ${
              calc3.to >= calc3.from
                ? "bg-green-500/20 text-green-500"
                : "bg-red-500/20 text-red-500"
            }`}>
              {calc3.from !== 0
                ? `${calc3.to >= calc3.from ? "+" : ""}${(((calc3.to - calc3.from) / calc3.from) * 100).toFixed(2)}%`
                : "0%"
              }
            </span>
          </div>
        </div>

        {/* Increase/Decrease by percentage */}
        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-4">Increase/Decrease by Percentage</h3>
          <div className="flex flex-wrap items-center gap-2">
            <input
              type="number"
              value={calc4.value}
              onChange={(e) => setCalc4({ ...calc4, value: parseFloat(e.target.value) || 0 })}
              className="w-24 px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-center"
            />
            <select
              value={calc4.operation}
              onChange={(e) => setCalc4({ ...calc4, operation: e.target.value as "increase" | "decrease" })}
              className="px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            >
              <option value="increase">increased by</option>
              <option value="decrease">decreased by</option>
            </select>
            <input
              type="number"
              value={calc4.percentage}
              onChange={(e) => setCalc4({ ...calc4, percentage: parseFloat(e.target.value) || 0 })}
              className="w-20 px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-center"
            />
            <span>% =</span>
            <span className="px-4 py-2 bg-[var(--primary)] text-[var(--primary-foreground)] rounded-lg font-bold">
              {calc4.operation === "increase"
                ? (calc4.value * (1 + calc4.percentage / 100)).toFixed(2)
                : (calc4.value * (1 - calc4.percentage / 100)).toFixed(2)
              }
            </span>
          </div>
        </div>

        <div className="bg-[var(--muted)] rounded-xl p-6">
          <h3 className="font-semibold mb-3">Common Percentages</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[10, 15, 20, 25, 33.33, 50, 75, 100].map(p => (
              <div key={p} className="bg-[var(--background)] rounded-lg p-3">
                <div className="text-lg font-bold">{p}%</div>
                <div className="text-xs text-[var(--muted-foreground)]">= {p/100} or 1/{(100/p).toFixed(p % 1 === 0 && 100 % p === 0 ? 0 : 2)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
