// Pricing Calculator Tool | TypeScript
"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("pricing-calculator")!;
const similarTools = getToolsByCategory("misc").filter(t => t.slug !== "pricing-calculator");

const marginTypeOptions = [
  { value: "markup", label: "Markup %" },
  { value: "margin", label: "Profit Margin %" },
];

const currencyOptions = [
  { value: "USD", label: "USD ($)" },
  { value: "EUR", label: "EUR (€)" },
  { value: "GBP", label: "GBP (£)" },
  { value: "INR", label: "INR (₹)" },
];

const currencySymbols: Record<string, string> = {
  USD: "$", EUR: "€", GBP: "£", INR: "₹"
};

export default function PricingCalculatorPage() {
  const [baseCost, setBaseCost] = useState("50");
  const [laborCost, setLaborCost] = useState("20");
  const [overheadCost, setOverheadCost] = useState("10");
  const [marginType, setMarginType] = useState("markup");
  const [marginPercent, setMarginPercent] = useState("30");
  const [discount, setDiscount] = useState("0");
  const [taxRate, setTaxRate] = useState("10");
  const [quantity, setQuantity] = useState("1");
  const [currency, setCurrency] = useState("USD");

  const calculations = useMemo(() => {
    const base = parseFloat(baseCost) || 0;
    const labor = parseFloat(laborCost) || 0;
    const overhead = parseFloat(overheadCost) || 0;
    const margin = parseFloat(marginPercent) || 0;
    const disc = parseFloat(discount) || 0;
    const tax = parseFloat(taxRate) || 0;
    const qty = parseInt(quantity) || 1;

    const totalCost = base + labor + overhead;
    
    let sellingPrice: number;
    let profit: number;
    let actualMargin: number;

    if (marginType === "markup") {
      // Markup: price = cost * (1 + markup%)
      sellingPrice = totalCost * (1 + margin / 100);
      profit = sellingPrice - totalCost;
      actualMargin = totalCost > 0 ? (profit / sellingPrice) * 100 : 0;
    } else {
      // Profit Margin: price = cost / (1 - margin%)
      if (margin >= 100) {
        sellingPrice = totalCost * 10; // Cap at 10x
      } else {
        sellingPrice = totalCost / (1 - margin / 100);
      }
      profit = sellingPrice - totalCost;
      actualMargin = margin;
    }

    const discountAmount = sellingPrice * (disc / 100);
    const priceAfterDiscount = sellingPrice - discountAmount;
    const taxAmount = priceAfterDiscount * (tax / 100);
    const finalPrice = priceAfterDiscount + taxAmount;

    const totalRevenue = finalPrice * qty;
    const totalProfit = (priceAfterDiscount - totalCost) * qty;
    const roi = totalCost > 0 ? ((priceAfterDiscount - totalCost) / totalCost) * 100 : 0;

    return {
      totalCost,
      sellingPrice,
      profit,
      actualMargin,
      discountAmount,
      priceAfterDiscount,
      taxAmount,
      finalPrice,
      totalRevenue,
      totalProfit,
      roi,
    };
  }, [baseCost, laborCost, overheadCost, marginType, marginPercent, discount, taxRate, quantity]);

  const formatCurrency = (value: number): string => {
    return `${currencySymbols[currency]}${value.toFixed(2)}`;
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        {/* Cost Inputs */}
        <div className="p-4 bg-[var(--muted)] rounded-xl border border-[var(--border)]">
          <h3 className="font-semibold mb-4 text-sm">Cost Components</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Input
              label="Base/Material Cost"
              type="number"
              value={baseCost}
              onChange={(e) => setBaseCost(e.target.value)}
              min="0"
              step="0.01"
            />
            <Input
              label="Labor Cost"
              type="number"
              value={laborCost}
              onChange={(e) => setLaborCost(e.target.value)}
              min="0"
              step="0.01"
            />
            <Input
              label="Overhead Cost"
              type="number"
              value={overheadCost}
              onChange={(e) => setOverheadCost(e.target.value)}
              min="0"
              step="0.01"
            />
            <Select
              label="Currency"
              options={currencyOptions}
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
            />
          </div>
        </div>

        {/* Pricing Strategy */}
        <div className="p-4 bg-[var(--muted)] rounded-xl border border-[var(--border)]">
          <h3 className="font-semibold mb-4 text-sm">Pricing Strategy</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <Select
              label="Margin Type"
              options={marginTypeOptions}
              value={marginType}
              onChange={(e) => setMarginType(e.target.value)}
            />
            <Input
              label={marginType === "markup" ? "Markup %" : "Profit Margin %"}
              type="number"
              value={marginPercent}
              onChange={(e) => setMarginPercent(e.target.value)}
              min="0"
              max={marginType === "margin" ? "99" : undefined}
              step="1"
            />
            <Input
              label="Discount %"
              type="number"
              value={discount}
              onChange={(e) => setDiscount(e.target.value)}
              min="0"
              max="100"
              step="1"
            />
            <Input
              label="Tax Rate %"
              type="number"
              value={taxRate}
              onChange={(e) => setTaxRate(e.target.value)}
              min="0"
              step="0.5"
            />
          </div>
        </div>

        {/* Quantity */}
        <Input
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          min="1"
        />

        {/* Results */}
        <div className="space-y-4">
          {/* Pricing Breakdown */}
          <div className="p-4 sm:p-6 bg-[var(--card)] rounded-xl border border-[var(--border)]">
            <h3 className="font-semibold mb-4 text-sm">Pricing Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between py-2 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Total Cost</span>
                <span className="font-mono">{formatCurrency(calculations.totalCost)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">+ Profit ({marginType === "markup" ? `${marginPercent}% markup` : `${marginPercent}% margin`})</span>
                <span className="font-mono text-green-500">+{formatCurrency(calculations.profit)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[var(--border)]">
                <span className="text-[var(--muted-foreground)]">Selling Price</span>
                <span className="font-mono font-medium">{formatCurrency(calculations.sellingPrice)}</span>
              </div>
              {parseFloat(discount) > 0 && (
                <div className="flex justify-between py-2 border-b border-[var(--border)]">
                  <span className="text-[var(--muted-foreground)]">- Discount ({discount}%)</span>
                  <span className="font-mono text-red-500">-{formatCurrency(calculations.discountAmount)}</span>
                </div>
              )}
              {parseFloat(taxRate) > 0 && (
                <div className="flex justify-between py-2 border-b border-[var(--border)]">
                  <span className="text-[var(--muted-foreground)]">+ Tax ({taxRate}%)</span>
                  <span className="font-mono">+{formatCurrency(calculations.taxAmount)}</span>
                </div>
              )}
              <div className="flex justify-between py-2 text-lg font-bold">
                <span>Final Price</span>
                <span className="text-violet-500">{formatCurrency(calculations.finalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-xl border border-violet-500/20">
              <div className="text-xs text-[var(--muted-foreground)] mb-1">Final Price</div>
              <div className="text-xl font-bold text-violet-500">{formatCurrency(calculations.finalPrice)}</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
              <div className="text-xs text-[var(--muted-foreground)] mb-1">Profit Margin</div>
              <div className="text-xl font-bold text-green-500">{calculations.actualMargin.toFixed(1)}%</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
              <div className="text-xs text-[var(--muted-foreground)] mb-1">Total Revenue (x{quantity})</div>
              <div className="text-xl font-bold text-blue-500">{formatCurrency(calculations.totalRevenue)}</div>
            </div>
            <div className="p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/20">
              <div className="text-xs text-[var(--muted-foreground)] mb-1">Total Profit (x{quantity})</div>
              <div className="text-xl font-bold text-amber-500">{formatCurrency(calculations.totalProfit)}</div>
            </div>
          </div>

          {/* ROI */}
          <div className="p-4 bg-[var(--muted)] rounded-xl border border-[var(--border)]">
            <div className="flex items-center justify-between">
              <span className="text-sm">Return on Investment (ROI)</span>
              <span className={`text-lg font-bold ${calculations.roi >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                {calculations.roi.toFixed(1)}%
              </span>
            </div>
            <div className="h-2 bg-[var(--card)] rounded-full mt-2 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-300 ${calculations.roi >= 0 ? 'bg-green-500' : 'bg-red-500'}`}
                style={{ width: `${Math.min(Math.abs(calculations.roi), 100)}%` }}
              />
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="p-4 bg-violet-500/10 rounded-xl border border-violet-500/20">
          <h3 className="font-semibold mb-2 text-sm">Markup vs Margin</h3>
          <ul className="text-xs sm:text-sm text-[var(--muted-foreground)] space-y-1">
            <li><strong>Markup:</strong> Price = Cost × (1 + Markup%) — Adds percentage to cost</li>
            <li><strong>Margin:</strong> Price = Cost ÷ (1 - Margin%) — Sets profit as % of selling price</li>
            <li>Example: 30% markup on $100 = $130, but 30% margin on $100 = $142.86</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
