// Break-Even Calculator Tool | TypeScript
"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("break-even-calculator")!;
const similarTools = getToolsByCategory("misc").filter(t => t.slug !== "break-even-calculator");

export default function BreakEvenCalculatorPage() {
  const [fixedCosts, setFixedCosts] = useState("10000");
  const [variableCost, setVariableCost] = useState("25");
  const [sellingPrice, setSellingPrice] = useState("50");

  const results = useMemo(() => {
    const fixed = parseFloat(fixedCosts) || 0;
    const variable = parseFloat(variableCost) || 0;
    const price = parseFloat(sellingPrice) || 0;

    if (price <= variable) {
      return null;
    }

    const contributionMargin = price - variable;
    const contributionMarginRatio = (contributionMargin / price) * 100;
    const breakEvenUnits = Math.ceil(fixed / contributionMargin);
    const breakEvenRevenue = breakEvenUnits * price;

    // Generate data points for chart
    const chartData = [];
    const maxUnits = breakEvenUnits * 2;
    for (let units = 0; units <= maxUnits; units += Math.ceil(maxUnits / 10)) {
      const revenue = units * price;
      const totalCost = fixed + units * variable;
      const profit = revenue - totalCost;
      chartData.push({ units, revenue, totalCost, profit });
    }

    return {
      breakEvenUnits,
      breakEvenRevenue,
      contributionMargin,
      contributionMarginRatio,
      chartData,
    };
  }, [fixedCosts, variableCost, sellingPrice]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const maxY = results ? Math.max(...results.chartData.map(d => Math.max(d.revenue, d.totalCost))) : 0;
  const chartHeight = 200;

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Fixed Costs ($)"
            type="number"
            value={fixedCosts}
            onChange={(e) => setFixedCosts(e.target.value)}
            placeholder="Rent, salaries, etc."
            min="0"
            helperText="Monthly fixed expenses"
          />
          <Input
            label="Variable Cost per Unit ($)"
            type="number"
            value={variableCost}
            onChange={(e) => setVariableCost(e.target.value)}
            placeholder="Cost per unit"
            min="0"
            step="0.01"
            helperText="Materials, labor per item"
          />
          <Input
            label="Selling Price per Unit ($)"
            type="number"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            placeholder="Price per unit"
            min="0"
            step="0.01"
            helperText="Price you charge customers"
          />
        </div>

        {/* Error State */}
        {parseFloat(sellingPrice) <= parseFloat(variableCost) && parseFloat(sellingPrice) > 0 && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
            Selling price must be greater than variable cost to calculate break-even point.
          </div>
        )}

        {/* Results */}
        {results && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 sm:p-6 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-xl border border-violet-500/20">
                <div className="text-xs text-[var(--muted-foreground)] mb-1">Break-Even Units</div>
                <div className="text-xl sm:text-2xl font-bold text-violet-500">
                  {results.breakEvenUnits.toLocaleString()}
                </div>
              </div>
              <div className="p-4 sm:p-6 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
                <div className="text-xs text-[var(--muted-foreground)] mb-1">Break-Even Revenue</div>
                <div className="text-xl sm:text-2xl font-bold text-green-500">
                  {formatCurrency(results.breakEvenRevenue)}
                </div>
              </div>
              <div className="p-4 sm:p-6 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
                <div className="text-xs text-[var(--muted-foreground)] mb-1">Contribution Margin</div>
                <div className="text-xl sm:text-2xl font-bold text-blue-500">
                  {formatCurrency(results.contributionMargin)}
                </div>
              </div>
              <div className="p-4 sm:p-6 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/20">
                <div className="text-xs text-[var(--muted-foreground)] mb-1">Margin Ratio</div>
                <div className="text-xl sm:text-2xl font-bold text-amber-500">
                  {results.contributionMarginRatio.toFixed(1)}%
                </div>
              </div>
            </div>

            {/* Simple Chart */}
            <div className="p-4 sm:p-6 bg-[var(--muted)] rounded-xl border border-[var(--border)]">
              <h3 className="font-semibold mb-4 text-sm">Break-Even Chart</h3>
              <div className="relative" style={{ height: chartHeight + 40 }}>
                {/* Y-axis labels */}
                <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-xs text-[var(--muted-foreground)] w-16">
                  <span>{formatCurrency(maxY)}</span>
                  <span>{formatCurrency(maxY / 2)}</span>
                  <span>$0</span>
                </div>
                
                {/* Chart area */}
                <div className="ml-16 relative" style={{ height: chartHeight }}>
                  {/* Grid lines */}
                  <div className="absolute inset-0 flex flex-col justify-between">
                    {[0, 1, 2].map(i => (
                      <div key={i} className="border-t border-[var(--border)]" />
                    ))}
                  </div>
                  
                  {/* Break-even point line */}
                  <div 
                    className="absolute top-0 bottom-0 border-l-2 border-dashed border-violet-500"
                    style={{ left: `${(results.breakEvenUnits / (results.breakEvenUnits * 2)) * 100}%` }}
                  >
                    <div className="absolute -top-1 left-1 text-xs text-violet-500 whitespace-nowrap">
                      Break-even
                    </div>
                  </div>

                  {/* Revenue line (simplified) */}
                  <svg className="absolute inset-0 overflow-visible" preserveAspectRatio="none">
                    <polyline
                      fill="none"
                      stroke="#22c55e"
                      strokeWidth="2"
                      points={results.chartData.map((d, i) => {
                        const x = (i / (results.chartData.length - 1)) * 100;
                        const y = ((maxY - d.revenue) / maxY) * 100;
                        return `${x}%,${y}%`;
                      }).join(" ")}
                    />
                    <polyline
                      fill="none"
                      stroke="#ef4444"
                      strokeWidth="2"
                      points={results.chartData.map((d, i) => {
                        const x = (i / (results.chartData.length - 1)) * 100;
                        const y = ((maxY - d.totalCost) / maxY) * 100;
                        return `${x}%,${y}%`;
                      }).join(" ")}
                    />
                  </svg>
                </div>

                {/* X-axis labels */}
                <div className="ml-16 flex justify-between text-xs text-[var(--muted-foreground)] mt-2">
                  <span>0</span>
                  <span>{results.breakEvenUnits} units</span>
                  <span>{results.breakEvenUnits * 2}</span>
                </div>
              </div>

              {/* Legend */}
              <div className="flex gap-6 mt-4 justify-center">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-green-500" />
                  <span className="text-xs">Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-0.5 bg-red-500" />
                  <span className="text-xs">Total Costs</span>
                </div>
              </div>
            </div>

            {/* Profit Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    <th className="text-left py-2 px-2 font-semibold">Units Sold</th>
                    <th className="text-right py-2 px-2 font-semibold">Revenue</th>
                    <th className="text-right py-2 px-2 font-semibold">Total Costs</th>
                    <th className="text-right py-2 px-2 font-semibold">Profit/Loss</th>
                  </tr>
                </thead>
                <tbody>
                  {results.chartData.map((row) => (
                    <tr 
                      key={row.units} 
                      className={`border-b border-[var(--border)] ${row.units === results.breakEvenUnits ? 'bg-violet-500/10' : ''}`}
                    >
                      <td className="py-2 px-2">{row.units.toLocaleString()}</td>
                      <td className="text-right py-2 px-2 text-green-500">{formatCurrency(row.revenue)}</td>
                      <td className="text-right py-2 px-2 text-red-500">{formatCurrency(row.totalCost)}</td>
                      <td className={`text-right py-2 px-2 font-medium ${row.profit >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {formatCurrency(row.profit)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Info */}
        <div className="p-4 bg-violet-500/10 rounded-xl border border-violet-500/20">
          <h3 className="font-semibold mb-2 text-sm">Break-Even Formula</h3>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] font-mono mb-2">
            Break-Even Units = Fixed Costs ÷ (Selling Price - Variable Cost)
          </p>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)]">
            The break-even point is where total revenue equals total costs, resulting in zero profit or loss.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
