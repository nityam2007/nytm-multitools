// Loan EMI Calculator Tool | TypeScript
"use client";

import { useState, useCallback, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("loan-emi-calculator")!;
const similarTools = getToolsByCategory("misc").filter(t => t.slug !== "loan-emi-calculator");

interface EMIResult {
  emi: number;
  totalPayment: number;
  totalInterest: number;
  schedule: {
    month: number;
    emi: number;
    principal: number;
    interest: number;
    balance: number;
  }[];
}

export default function LoanEMICalculatorPage() {
  const [principal, setPrincipal] = useState<string>("100000");
  const [rate, setRate] = useState<string>("10");
  const [tenure, setTenure] = useState<string>("12");
  const [tenureType, setTenureType] = useState<"months" | "years">("months");
  const [result, setResult] = useState<EMIResult | null>(null);
  const [showSchedule, setShowSchedule] = useState(false);

  const calculateEMI = useCallback(async () => {
    const startTime = Date.now();
    
    const P = parseFloat(principal);
    const annualRate = parseFloat(rate);
    const tenureValue = parseFloat(tenure);

    if (isNaN(P) || isNaN(annualRate) || isNaN(tenureValue) || P <= 0 || annualRate <= 0 || tenureValue <= 0) {
      return;
    }

    const months = tenureType === "years" ? tenureValue * 12 : tenureValue;
    const monthlyRate = annualRate / 12 / 100;

    // EMI Formula: [P x R x (1+R)^N] / [(1+R)^N-1]
    const emi = (P * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
    const totalPayment = emi * months;
    const totalInterest = totalPayment - P;

    // Generate amortization schedule
    const schedule: EMIResult["schedule"] = [];
    let balance = P;

    for (let i = 1; i <= months; i++) {
      const interestPayment = balance * monthlyRate;
      const principalPayment = emi - interestPayment;
      balance -= principalPayment;

      schedule.push({
        month: i,
        emi: Math.round(emi * 100) / 100,
        principal: Math.round(principalPayment * 100) / 100,
        interest: Math.round(interestPayment * 100) / 100,
        balance: Math.max(0, Math.round(balance * 100) / 100),
      });
    }

    setResult({ emi, totalPayment, totalInterest, schedule });

    await logToolUsage({
      toolName: tool.name,
      toolCategory: tool.category,
      inputType: "text",
      outputResult: `EMI: ${emi.toFixed(2)}`,
      processingDuration: Date.now() - startTime,
      metadata: { principal: P, rate: annualRate, tenure: months },
    });
  }, [principal, rate, tenure, tenureType]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  const pieData = useMemo(() => {
    if (!result) return null;
    const principalPercent = (parseFloat(principal) / result.totalPayment) * 100;
    const interestPercent = (result.totalInterest / result.totalPayment) * 100;
    return { principalPercent, interestPercent };
  }, [result, principal]);

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        {/* Input Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Loan Amount"
            type="number"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            placeholder="Enter loan amount"
            min="0"
          />

          <Input
            label="Interest Rate (% per year)"
            type="number"
            value={rate}
            onChange={(e) => setRate(e.target.value)}
            placeholder="Annual interest rate"
            min="0"
            step="0.1"
          />

          <div>
            <label className="block text-xs sm:text-sm font-semibold text-[var(--foreground)] mb-1.5 sm:mb-2">
              Loan Tenure
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={tenure}
                onChange={(e) => setTenure(e.target.value)}
                className="flex-1 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base bg-[var(--card)] border-2 border-[var(--border)] focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300"
                min="1"
              />
              <select
                value={tenureType}
                onChange={(e) => setTenureType(e.target.value as "months" | "years")}
                className="px-3 py-2 rounded-xl bg-[var(--card)] border-2 border-[var(--border)] text-sm focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all duration-300"
              >
                <option value="months">Months</option>
                <option value="years">Years</option>
              </select>
            </div>
          </div>
        </div>

        {/* Calculate Button */}
        <Button onClick={calculateEMI} size="lg" fullWidth>
          Calculate EMI
        </Button>

        {/* Results */}
        {result && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 sm:p-6 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-xl border border-violet-500/20">
                <div className="text-xs sm:text-sm text-[var(--muted-foreground)] mb-1">Monthly EMI</div>
                <div className="text-xl sm:text-2xl font-bold text-violet-500">{formatCurrency(result.emi)}</div>
              </div>
              
              <div className="p-4 sm:p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                <div className="text-xs sm:text-sm text-[var(--muted-foreground)] mb-1">Total Payment</div>
                <div className="text-xl sm:text-2xl font-bold text-green-500">{formatCurrency(result.totalPayment)}</div>
              </div>
              
              <div className="p-4 sm:p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/20">
                <div className="text-xs sm:text-sm text-[var(--muted-foreground)] mb-1">Total Interest</div>
                <div className="text-xl sm:text-2xl font-bold text-amber-500">{formatCurrency(result.totalInterest)}</div>
              </div>
            </div>

            {/* Visual Breakdown */}
            {pieData && (
              <div className="p-4 sm:p-6 bg-[var(--muted)] rounded-xl border border-[var(--border)]">
                <h3 className="font-semibold mb-4">Payment Breakdown</h3>
                <div className="flex flex-col sm:flex-row items-center gap-6">
                  {/* Simple Bar Chart */}
                  <div className="w-full sm:w-1/2">
                    <div className="h-8 rounded-lg overflow-hidden flex">
                      <div 
                        className="bg-violet-500 transition-all duration-500"
                        style={{ width: `${pieData.principalPercent}%` }}
                      />
                      <div 
                        className="bg-amber-500 transition-all duration-500"
                        style={{ width: `${pieData.interestPercent}%` }}
                      />
                    </div>
                  </div>
                  
                  {/* Legend */}
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-violet-500" />
                      <span className="text-sm">
                        Principal ({pieData.principalPercent.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded bg-amber-500" />
                      <span className="text-sm">
                        Interest ({pieData.interestPercent.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Amortization Schedule Toggle */}
            <div>
              <Button
                variant="secondary"
                onClick={() => setShowSchedule(!showSchedule)}
                fullWidth
              >
                {showSchedule ? "Hide" : "Show"} Amortization Schedule
              </Button>
            </div>

            {/* Amortization Schedule Table */}
            {showSchedule && (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-[var(--border)]">
                      <th className="text-left py-3 px-2 font-semibold">Month</th>
                      <th className="text-right py-3 px-2 font-semibold">EMI</th>
                      <th className="text-right py-3 px-2 font-semibold">Principal</th>
                      <th className="text-right py-3 px-2 font-semibold">Interest</th>
                      <th className="text-right py-3 px-2 font-semibold">Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.slice(0, showSchedule ? undefined : 12).map((row) => (
                      <tr key={row.month} className="border-b border-[var(--border)] hover:bg-[var(--muted)]">
                        <td className="py-2 px-2">{row.month}</td>
                        <td className="text-right py-2 px-2">{formatCurrency(row.emi)}</td>
                        <td className="text-right py-2 px-2 text-violet-500">{formatCurrency(row.principal)}</td>
                        <td className="text-right py-2 px-2 text-amber-500">{formatCurrency(row.interest)}</td>
                        <td className="text-right py-2 px-2">{formatCurrency(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Info */}
        <div className="p-4 bg-violet-500/10 rounded-xl border border-violet-500/20">
          <h3 className="font-semibold mb-2 text-sm">EMI Formula</h3>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] font-mono">
            EMI = [P × R × (1+R)^N] / [(1+R)^N - 1]
          </p>
          <ul className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-2 space-y-1">
            <li>• P = Principal loan amount</li>
            <li>• R = Monthly interest rate</li>
            <li>• N = Number of monthly installments</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
