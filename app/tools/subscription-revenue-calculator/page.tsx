// Subscription Revenue Calculator Tool | TypeScript
"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { Select } from "@/components/Select";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("subscription-revenue-calculator")!;
const similarTools = getToolsByCategory("misc").filter(t => t.slug !== "subscription-revenue-calculator");

interface PricingTier {
  id: string;
  name: string;
  price: number;
  subscribers: number;
  billingCycle: "monthly" | "yearly";
}

export default function SubscriptionRevenueCalculatorPage() {
  const [tiers, setTiers] = useState<PricingTier[]>([
    { id: "1", name: "Basic", price: 9.99, subscribers: 500, billingCycle: "monthly" },
    { id: "2", name: "Pro", price: 29.99, subscribers: 200, billingCycle: "monthly" },
    { id: "3", name: "Enterprise", price: 99.99, subscribers: 50, billingCycle: "monthly" },
  ]);
  const [churnRate, setChurnRate] = useState("5");
  const [growthRate, setGrowthRate] = useState("10");

  const addTier = () => {
    setTiers([
      ...tiers,
      {
        id: Date.now().toString(),
        name: `Tier ${tiers.length + 1}`,
        price: 19.99,
        subscribers: 100,
        billingCycle: "monthly",
      },
    ]);
  };

  const updateTier = (id: string, field: keyof PricingTier, value: string | number) => {
    setTiers(tiers.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const removeTier = (id: string) => {
    if (tiers.length > 1) {
      setTiers(tiers.filter(t => t.id !== id));
    }
  };

  const metrics = useMemo(() => {
    const churn = parseFloat(churnRate) / 100 || 0;
    const growth = parseFloat(growthRate) / 100 || 0;

    let totalMRR = 0;
    let totalSubscribers = 0;

    tiers.forEach(tier => {
      const monthlyPrice = tier.billingCycle === "yearly" ? tier.price / 12 : tier.price;
      totalMRR += monthlyPrice * tier.subscribers;
      totalSubscribers += tier.subscribers;
    });

    const arr = totalMRR * 12;
    const arpu = totalSubscribers > 0 ? totalMRR / totalSubscribers : 0;
    const ltv = churn > 0 ? arpu / churn : arpu * 12;

    // 12-month projections
    const projections = [];
    let currentMRR = totalMRR;
    let currentSubs = totalSubscribers;

    for (let month = 0; month <= 12; month++) {
      projections.push({
        month,
        mrr: currentMRR,
        subscribers: Math.round(currentSubs),
        arr: currentMRR * 12,
      });
      
      const churned = currentSubs * churn;
      const newSubs = currentSubs * growth;
      currentSubs = currentSubs - churned + newSubs;
      currentMRR = currentSubs * arpu;
    }

    return {
      mrr: totalMRR,
      arr,
      totalSubscribers,
      arpu,
      ltv,
      projections,
    };
  }, [tiers, churnRate, growthRate]);

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        {/* Pricing Tiers */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-sm">Pricing Tiers</h3>
            <Button variant="secondary" size="sm" onClick={addTier}>
              Add Tier
            </Button>
          </div>

          {tiers.map((tier, index) => (
            <div
              key={tier.id}
              className="p-4 bg-[var(--muted)] rounded-xl border border-[var(--border)]"
            >
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                <Input
                  label="Plan Name"
                  value={tier.name}
                  onChange={(e) => updateTier(tier.id, "name", e.target.value)}
                  placeholder="Basic"
                />
                <Input
                  label="Price ($)"
                  type="number"
                  value={tier.price.toString()}
                  onChange={(e) => updateTier(tier.id, "price", parseFloat(e.target.value) || 0)}
                  min="0"
                  step="0.01"
                />
                <Input
                  label="Subscribers"
                  type="number"
                  value={tier.subscribers.toString()}
                  onChange={(e) => updateTier(tier.id, "subscribers", parseInt(e.target.value) || 0)}
                  min="0"
                />
                <Select
                  label="Billing"
                  value={tier.billingCycle}
                  onChange={(e) => updateTier(tier.id, "billingCycle", e.target.value)}
                  options={[
                    { value: "monthly", label: "Monthly" },
                    { value: "yearly", label: "Yearly" },
                  ]}
                />
                <div className="flex items-end">
                  {tiers.length > 1 && (
                    <button
                      onClick={() => removeTier(tier.id)}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Growth & Churn */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Monthly Churn Rate (%)"
            type="number"
            value={churnRate}
            onChange={(e) => setChurnRate(e.target.value)}
            min="0"
            max="100"
            step="0.1"
            helperText="Percentage of subscribers who cancel each month"
          />
          <Input
            label="Monthly Growth Rate (%)"
            type="number"
            value={growthRate}
            onChange={(e) => setGrowthRate(e.target.value)}
            min="0"
            step="0.1"
            helperText="Percentage of new subscribers each month"
          />
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="p-4 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-xl border border-violet-500/20">
            <div className="text-xs text-[var(--muted-foreground)] mb-1">MRR</div>
            <div className="text-lg sm:text-xl font-bold text-violet-500">
              {formatCurrency(metrics.mrr)}
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl border border-green-500/20">
            <div className="text-xs text-[var(--muted-foreground)] mb-1">ARR</div>
            <div className="text-lg sm:text-xl font-bold text-green-500">
              {formatCurrency(metrics.arr)}
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-xl border border-blue-500/20">
            <div className="text-xs text-[var(--muted-foreground)] mb-1">Total Subscribers</div>
            <div className="text-lg sm:text-xl font-bold text-blue-500">
              {metrics.totalSubscribers.toLocaleString()}
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-amber-500/10 to-orange-500/10 rounded-xl border border-amber-500/20">
            <div className="text-xs text-[var(--muted-foreground)] mb-1">ARPU</div>
            <div className="text-lg sm:text-xl font-bold text-amber-500">
              {formatCurrency(metrics.arpu)}
            </div>
          </div>
          <div className="p-4 bg-gradient-to-br from-pink-500/10 to-rose-500/10 rounded-xl border border-pink-500/20">
            <div className="text-xs text-[var(--muted-foreground)] mb-1">LTV</div>
            <div className="text-lg sm:text-xl font-bold text-pink-500">
              {formatCurrency(metrics.ltv)}
            </div>
          </div>
        </div>

        {/* 12-Month Projection */}
        <div className="p-4 sm:p-6 bg-[var(--muted)] rounded-xl border border-[var(--border)]">
          <h3 className="font-semibold mb-4 text-sm">12-Month Revenue Projection</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-2 px-2 font-semibold">Month</th>
                  <th className="text-right py-2 px-2 font-semibold">MRR</th>
                  <th className="text-right py-2 px-2 font-semibold">Subscribers</th>
                  <th className="text-right py-2 px-2 font-semibold">ARR</th>
                </tr>
              </thead>
              <tbody>
                {metrics.projections.map((row) => (
                  <tr key={row.month} className="border-b border-[var(--border)]">
                    <td className="py-2 px-2">{row.month === 0 ? "Current" : `Month ${row.month}`}</td>
                    <td className="text-right py-2 px-2 text-violet-500">{formatCurrency(row.mrr)}</td>
                    <td className="text-right py-2 px-2">{row.subscribers.toLocaleString()}</td>
                    <td className="text-right py-2 px-2 text-green-500">{formatCurrency(row.arr)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Definitions */}
        <div className="p-4 bg-violet-500/10 rounded-xl border border-violet-500/20">
          <h3 className="font-semibold mb-2 text-sm">Key Metrics Explained</h3>
          <ul className="text-xs sm:text-sm text-[var(--muted-foreground)] space-y-1">
            <li><strong>MRR</strong> - Monthly Recurring Revenue</li>
            <li><strong>ARR</strong> - Annual Recurring Revenue (MRR × 12)</li>
            <li><strong>ARPU</strong> - Average Revenue Per User</li>
            <li><strong>LTV</strong> - Customer Lifetime Value (ARPU ÷ Churn Rate)</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
