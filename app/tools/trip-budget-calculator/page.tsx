// Trip Budget Calculator Tool | TypeScript
"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("trip-budget-calculator")!;
const similarTools = getToolsByCategory("misc").filter(t => t.slug !== "trip-budget-calculator");

interface Expense {
  id: string;
  category: string;
  description: string;
  amount: number;
  perPerson: boolean;
}

const categoryOptions = [
  { value: "transport", label: "Transportation" },
  { value: "accommodation", label: "Accommodation" },
  { value: "food", label: "Food & Dining" },
  { value: "activities", label: "Activities & Tours" },
  { value: "shopping", label: "Shopping" },
  { value: "misc", label: "Miscellaneous" },
];

const currencyOptions = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "INR", label: "INR (₹)" },
  { value: "JPY", label: "JPY (¥)" },
  { value: "AUD", label: "AUD ($)" },
  { value: "CAD", label: "CAD ($)" },
];

const currencySymbols: Record<string, string> = {
  USD: "$", EUR: "€", GBP: "£", INR: "₹", JPY: "¥", AUD: "A$", CAD: "C$"
};

export default function TripBudgetCalculatorPage() {
  const [tripName, setTripName] = useState("");
  const [travelers, setTravelers] = useState("2");
  const [days, setDays] = useState("5");
  const [currency, setCurrency] = useState("USD");
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [newExpense, setNewExpense] = useState({
    category: "transport",
    description: "",
    amount: "",
    perPerson: false,
  });

  const addExpense = useCallback(() => {
    if (!newExpense.description || !newExpense.amount) return;
    
    const expense: Expense = {
      id: Date.now().toString(),
      category: newExpense.category,
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      perPerson: newExpense.perPerson,
    };
    
    setExpenses([...expenses, expense]);
    setNewExpense({ category: "transport", description: "", amount: "", perPerson: false });
  }, [expenses, newExpense]);

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id));
  };

  const summary = useMemo(() => {
    const numTravelers = parseInt(travelers) || 1;
    const numDays = parseInt(days) || 1;
    
    let totalTrip = 0;
    const byCategory: Record<string, number> = {};
    
    expenses.forEach(exp => {
      const amount = exp.perPerson ? exp.amount * numTravelers : exp.amount;
      totalTrip += amount;
      byCategory[exp.category] = (byCategory[exp.category] || 0) + amount;
    });
    
    return {
      totalTrip,
      perPerson: totalTrip / numTravelers,
      perDay: totalTrip / numDays,
      perPersonPerDay: totalTrip / numTravelers / numDays,
      byCategory,
    };
  }, [expenses, travelers, days]);

  const formatCurrency = (amount: number): string => {
    return `${currencySymbols[currency]}${amount.toFixed(2)}`;
  };

  const getCategoryLabel = (cat: string): string => {
    return categoryOptions.find(c => c.value === cat)?.label || cat;
  };

  const getCategoryColor = (cat: string): string => {
    const colors: Record<string, string> = {
      transport: "bg-blue-500",
      accommodation: "bg-purple-500",
      food: "bg-orange-500",
      activities: "bg-green-500",
      shopping: "bg-pink-500",
      misc: "bg-gray-500",
    };
    return colors[cat] || "bg-gray-500";
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        {/* Trip Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Input
            label="Trip Name"
            value={tripName}
            onChange={(e) => setTripName(e.target.value)}
            placeholder="Summer Vacation"
          />
          <Input
            label="Number of Travelers"
            type="number"
            value={travelers}
            onChange={(e) => setTravelers(e.target.value)}
            min="1"
          />
          <Input
            label="Number of Days"
            type="number"
            value={days}
            onChange={(e) => setDays(e.target.value)}
            min="1"
          />
          <Select
            label="Currency"
            options={currencyOptions}
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
          />
        </div>

        {/* Add Expense Form */}
        <div className="p-4 bg-[var(--muted)] rounded-xl border border-[var(--border)]">
          <h3 className="font-semibold mb-4 text-sm">Add Expense</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Select
              label="Category"
              options={categoryOptions}
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
            />
            <Input
              label="Description"
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              placeholder="Flight tickets"
            />
            <Input
              label="Amount"
              type="number"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              placeholder="0.00"
              min="0"
              step="0.01"
            />
            <div className="flex items-end gap-2">
              <label className="flex items-center gap-2 cursor-pointer pb-3">
                <input
                  type="checkbox"
                  checked={newExpense.perPerson}
                  onChange={(e) => setNewExpense({ ...newExpense, perPerson: e.target.checked })}
                  className="w-4 h-4 rounded border-[var(--border)] text-violet-500 focus:ring-violet-500"
                />
                <span className="text-sm">Per Person</span>
              </label>
            </div>
          </div>
          <Button onClick={addExpense} className="mt-4">
            Add Expense
          </Button>
        </div>

        {/* Expense List */}
        {expenses.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold text-sm">Expenses ({expenses.length})</h3>
            <div className="space-y-2">
              {expenses.map((exp) => (
                <div
                  key={exp.id}
                  className="flex items-center justify-between p-3 bg-[var(--card)] rounded-lg border border-[var(--border)]"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getCategoryColor(exp.category)}`} />
                    <div>
                      <span className="font-medium">{exp.description}</span>
                      <span className="text-xs text-[var(--muted-foreground)] ml-2">
                        {getCategoryLabel(exp.category)}
                        {exp.perPerson && " (per person)"}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-medium">
                      {formatCurrency(exp.amount)}
                    </span>
                    <button
                      onClick={() => removeExpense(exp.id)}
                      className="text-red-500 hover:text-red-600 p-1"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Summary Cards */}
        {expenses.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-xl border border-violet-500/20">
              <div className="text-xs text-[var(--muted-foreground)] mb-1">Total Trip Cost</div>
              <div className="text-xl font-bold text-violet-500">{formatCurrency(summary.totalTrip)}</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
              <div className="text-xs text-[var(--muted-foreground)] mb-1">Per Person</div>
              <div className="text-xl font-bold text-green-500">{formatCurrency(summary.perPerson)}</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
              <div className="text-xs text-[var(--muted-foreground)] mb-1">Per Day</div>
              <div className="text-xl font-bold text-blue-500">{formatCurrency(summary.perDay)}</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/20">
              <div className="text-xs text-[var(--muted-foreground)] mb-1">Per Person/Day</div>
              <div className="text-xl font-bold text-amber-500">{formatCurrency(summary.perPersonPerDay)}</div>
            </div>
          </div>
        )}

        {/* Category Breakdown */}
        {Object.keys(summary.byCategory).length > 0 && (
          <div className="p-4 bg-[var(--muted)] rounded-xl border border-[var(--border)]">
            <h3 className="font-semibold mb-4 text-sm">Breakdown by Category</h3>
            <div className="space-y-3">
              {Object.entries(summary.byCategory).map(([cat, amount]) => {
                const percentage = (amount / summary.totalTrip) * 100;
                return (
                  <div key={cat}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{getCategoryLabel(cat)}</span>
                      <span className="font-mono">{formatCurrency(amount)} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="h-2 bg-[var(--card)] rounded-full overflow-hidden">
                      <div
                        className={`h-full ${getCategoryColor(cat)} transition-all duration-300`}
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
