"use client";

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("date-calculator")!;
const similarTools = getToolsByCategory("misc").filter(t => t.slug !== "date-calculator");

export default function DateCalculatorPage() {
  const [mode, setMode] = useState<"difference" | "add">("difference");
  
  // Difference mode
  const [date1, setDate1] = useState(new Date().toISOString().split("T")[0]);
  const [date2, setDate2] = useState("");
  const [diff, setDiff] = useState<{ days: number; weeks: number; months: number; years: number } | null>(null);
  
  // Add/subtract mode
  const [startDate, setStartDate] = useState(new Date().toISOString().split("T")[0]);
  const [amount, setAmount] = useState(7);
  const [unit, setUnit] = useState<"days" | "weeks" | "months" | "years">("days");
  const [operation, setOperation] = useState<"add" | "subtract">("add");
  const [resultDate, setResultDate] = useState<string>("");

  useEffect(() => {
    if (date1 && date2) {
      const d1 = new Date(date1);
      const d2 = new Date(date2);
      const diffTime = Math.abs(d2.getTime() - d1.getTime());
      const days = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      
      const weeks = Math.floor(days / 7);
      const months = Math.floor(days / 30.44);
      const years = Math.floor(days / 365.25);
      
      setDiff({ days, weeks, months, years });
    } else {
      setDiff(null);
    }
  }, [date1, date2]);

  useEffect(() => {
    if (startDate && amount) {
      const date = new Date(startDate);
      const multiplier = operation === "add" ? 1 : -1;
      
      switch (unit) {
        case "days":
          date.setDate(date.getDate() + amount * multiplier);
          break;
        case "weeks":
          date.setDate(date.getDate() + amount * 7 * multiplier);
          break;
        case "months":
          date.setMonth(date.getMonth() + amount * multiplier);
          break;
        case "years":
          date.setFullYear(date.getFullYear() + amount * multiplier);
          break;
      }
      
      setResultDate(date.toISOString().split("T")[0]);
    }
  }, [startDate, amount, unit, operation]);

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="flex gap-2">
          <button
            onClick={() => setMode("difference")}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              mode === "difference"
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "bg-[var(--muted)] hover:bg-[var(--accent)]"
            }`}
          >
            Date Difference
          </button>
          <button
            onClick={() => setMode("add")}
            className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
              mode === "add"
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "bg-[var(--muted)] hover:bg-[var(--accent)]"
            }`}
          >
            Add/Subtract
          </button>
        </div>

        {mode === "difference" ? (
          <>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Start Date</label>
                <input
                  type="date"
                  value={date1}
                  onChange={(e) => setDate1(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">End Date</label>
                <input
                  type="date"
                  value={date2}
                  onChange={(e) => setDate2(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
                />
              </div>
            </div>

            {diff && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="bg-[var(--muted)] rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-[var(--primary)]">{diff.days}</div>
                  <div className="text-sm text-[var(--muted-foreground)]">Days</div>
                </div>
                <div className="bg-[var(--muted)] rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-[var(--primary)]">{diff.weeks}</div>
                  <div className="text-sm text-[var(--muted-foreground)]">Weeks</div>
                </div>
                <div className="bg-[var(--muted)] rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-[var(--primary)]">{diff.months}</div>
                  <div className="text-sm text-[var(--muted-foreground)]">Months</div>
                </div>
                <div className="bg-[var(--muted)] rounded-xl p-4 text-center">
                  <div className="text-3xl font-bold text-[var(--primary)]">{diff.years}</div>
                  <div className="text-sm text-[var(--muted-foreground)]">Years</div>
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div>
              <label className="block text-sm font-medium mb-2">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Operation</label>
                <select
                  value={operation}
                  onChange={(e) => setOperation(e.target.value as "add" | "subtract")}
                  className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
                >
                  <option value="add">Add (+)</option>
                  <option value="subtract">Subtract (−)</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Amount</label>
                <input
                  type="number"
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Unit</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as "days" | "weeks" | "months" | "years")}
                  className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
                >
                  <option value="days">Days</option>
                  <option value="weeks">Weeks</option>
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                </select>
              </div>
            </div>

            {resultDate && (
              <div className="bg-[var(--muted)] rounded-xl p-6 text-center">
                <div className="text-sm text-[var(--muted-foreground)] mb-1">Result Date</div>
                <div className="text-2xl font-bold">
                  {new Date(resultDate).toLocaleDateString(undefined, {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            )}
          </>
        )}

        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-3">Quick References</h3>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <div className="font-medium">Days in a...</div>
              <div className="text-[var(--muted-foreground)]">Week: 7</div>
              <div className="text-[var(--muted-foreground)]">Month: 28-31 (avg 30.44)</div>
              <div className="text-[var(--muted-foreground)]">Year: 365 (366 leap)</div>
            </div>
            <div className="space-y-1">
              <div className="font-medium">Common intervals</div>
              <div className="text-[var(--muted-foreground)]">Fortnight: 14 days</div>
              <div className="text-[var(--muted-foreground)]">Quarter: ~91 days</div>
              <div className="text-[var(--muted-foreground)]">Decade: 3,652 days</div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
