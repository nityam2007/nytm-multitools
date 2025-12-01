"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("loan-calculator")!;
const similarTools = getToolsByCategory("misc").filter(t => t.slug !== "loan-calculator");

export default function LoanCalculatorPage() {
  const [principal, setPrincipal] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [loanTerm, setLoanTerm] = useState("");
  const [termUnit, setTermUnit] = useState<"years" | "months">("years");
  const [extraPayment, setExtraPayment] = useState("");

  const calculation = useMemo(() => {
    const P = parseFloat(principal) || 0;
    const annualRate = parseFloat(interestRate) || 0;
    const term = parseFloat(loanTerm) || 0;
    const extra = parseFloat(extraPayment) || 0;

    if (P <= 0 || annualRate < 0 || term <= 0) {
      return null;
    }

    const monthlyRate = annualRate / 100 / 12;
    const totalMonths = termUnit === "years" ? term * 12 : term;

    // Standard monthly payment (using amortization formula)
    let monthlyPayment: number;
    if (monthlyRate === 0) {
      monthlyPayment = P / totalMonths;
    } else {
      monthlyPayment = P * (monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) / 
                       (Math.pow(1 + monthlyRate, totalMonths) - 1);
    }

    const totalPayment = monthlyPayment * totalMonths;
    const totalInterest = totalPayment - P;

    // Calculate with extra payments
    let remainingBalance = P;
    let totalPaidWithExtra = 0;
    let totalInterestWithExtra = 0;
    let monthsWithExtra = 0;

    while (remainingBalance > 0 && monthsWithExtra < 1000) {
      const interestPayment = remainingBalance * monthlyRate;
      let principalPayment = monthlyPayment - interestPayment + extra;
      
      if (principalPayment > remainingBalance) {
        principalPayment = remainingBalance;
      }
      
      totalPaidWithExtra += interestPayment + principalPayment;
      totalInterestWithExtra += interestPayment;
      remainingBalance -= principalPayment;
      monthsWithExtra++;
    }

    // Generate amortization schedule (first 12 months)
    const schedule: Array<{
      month: number;
      payment: number;
      principal: number;
      interest: number;
      balance: number;
    }> = [];

    let balance = P;
    for (let i = 1; i <= Math.min(12, totalMonths) && balance > 0; i++) {
      const interestPmt = balance * monthlyRate;
      let principalPmt = monthlyPayment - interestPmt;
      if (principalPmt > balance) principalPmt = balance;
      balance -= principalPmt;
      
      schedule.push({
        month: i,
        payment: monthlyPayment,
        principal: principalPmt,
        interest: interestPmt,
        balance: Math.max(0, balance),
      });
    }

    return {
      monthlyPayment: monthlyPayment.toFixed(2),
      totalPayment: totalPayment.toFixed(2),
      totalInterest: totalInterest.toFixed(2),
      totalMonths,
      monthsWithExtra,
      totalPaidWithExtra: totalPaidWithExtra.toFixed(2),
      totalInterestWithExtra: totalInterestWithExtra.toFixed(2),
      interestSaved: (totalInterest - totalInterestWithExtra).toFixed(2),
      monthsSaved: totalMonths - monthsWithExtra,
      schedule,
    };
  }, [principal, interestRate, loanTerm, termUnit, extraPayment]);

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Loan Amount ($)</label>
            <input
              type="number"
              value={principal}
              onChange={(e) => setPrincipal(e.target.value)}
              placeholder="e.g., 200000"
              min="0"
              className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Annual Interest Rate (%)</label>
            <input
              type="number"
              value={interestRate}
              onChange={(e) => setInterestRate(e.target.value)}
              placeholder="e.g., 6.5"
              min="0"
              step="0.1"
              className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Loan Term</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={loanTerm}
                onChange={(e) => setLoanTerm(e.target.value)}
                placeholder="e.g., 30"
                min="0"
                className="flex-1 px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
              />
              <select
                value={termUnit}
                onChange={(e) => setTermUnit(e.target.value as "years" | "months")}
                className="px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
              >
                <option value="years">Years</option>
                <option value="months">Months</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Extra Monthly Payment ($)</label>
            <input
              type="number"
              value={extraPayment}
              onChange={(e) => setExtraPayment(e.target.value)}
              placeholder="Optional"
              min="0"
              className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            />
          </div>
        </div>

        {calculation && (
          <>
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl p-6 text-white text-center">
              <div className="text-sm opacity-80 mb-1">Monthly Payment</div>
              <div className="text-5xl font-bold">${calculation.monthlyPayment}</div>
              <div className="text-sm opacity-80 mt-2">
                for {calculation.totalMonths} months ({Math.floor(calculation.totalMonths / 12)} years {calculation.totalMonths % 12} months)
              </div>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)] text-center">
                <div className="text-sm text-[var(--muted-foreground)]">Principal</div>
                <div className="text-xl font-bold">${parseFloat(principal).toLocaleString()}</div>
              </div>
              <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)] text-center">
                <div className="text-sm text-[var(--muted-foreground)]">Total Interest</div>
                <div className="text-xl font-bold text-red-500">${parseFloat(calculation.totalInterest).toLocaleString()}</div>
              </div>
              <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)] text-center">
                <div className="text-sm text-[var(--muted-foreground)]">Total Payment</div>
                <div className="text-xl font-bold">${parseFloat(calculation.totalPayment).toLocaleString()}</div>
              </div>
            </div>

            {parseFloat(extraPayment) > 0 && (
              <div className="bg-green-500/10 border border-green-500 rounded-xl p-6">
                <h3 className="font-semibold text-green-700 dark:text-green-400 mb-4">
                  💰 With ${extraPayment}/month Extra Payment
                </h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-[var(--muted-foreground)]">New Payoff Time</div>
                    <div className="font-bold">
                      {Math.floor(calculation.monthsWithExtra / 12)} years {calculation.monthsWithExtra % 12} months
                    </div>
                    <div className="text-sm text-green-600">
                      ({calculation.monthsSaved} months earlier!)
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-[var(--muted-foreground)]">Interest Saved</div>
                    <div className="font-bold text-green-600">
                      ${parseFloat(calculation.interestSaved).toLocaleString()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
              <h3 className="font-semibold mb-4">📊 Payment Breakdown</h3>
              <div className="relative h-8 rounded-full overflow-hidden bg-[var(--muted)]">
                <div 
                  className="absolute h-full bg-blue-500"
                  style={{ width: `${(parseFloat(principal) / parseFloat(calculation.totalPayment)) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-sm mt-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-500" />
                  <span>Principal ({((parseFloat(principal) / parseFloat(calculation.totalPayment)) * 100).toFixed(1)}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-[var(--muted)]" />
                  <span>Interest ({((parseFloat(calculation.totalInterest) / parseFloat(calculation.totalPayment)) * 100).toFixed(1)}%)</span>
                </div>
              </div>
            </div>

            <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] overflow-hidden">
              <div className="p-4 border-b border-[var(--border)]">
                <h3 className="font-semibold">📅 Amortization Schedule (First 12 Months)</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[var(--muted)]">
                      <th className="text-left py-2 px-3">Month</th>
                      <th className="text-right py-2 px-3">Payment</th>
                      <th className="text-right py-2 px-3">Principal</th>
                      <th className="text-right py-2 px-3">Interest</th>
                      <th className="text-right py-2 px-3">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculation.schedule.map((row) => (
                      <tr key={row.month} className="border-b border-[var(--border)]">
                        <td className="py-2 px-3">{row.month}</td>
                        <td className="py-2 px-3 text-right font-mono">${row.payment.toFixed(2)}</td>
                        <td className="py-2 px-3 text-right font-mono text-blue-500">${row.principal.toFixed(2)}</td>
                        <td className="py-2 px-3 text-right font-mono text-red-500">${row.interest.toFixed(2)}</td>
                        <td className="py-2 px-3 text-right font-mono">${row.balance.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        <div className="bg-[var(--muted)] rounded-xl p-4 text-sm text-[var(--muted-foreground)]">
          <p>💡 This calculator uses standard amortization formula. Actual loan payments may vary based on additional factors like PMI, insurance, and taxes.</p>
        </div>
      </div>
    </ToolLayout>
  );
}
