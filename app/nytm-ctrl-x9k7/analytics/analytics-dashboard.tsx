"use client";

import { useMemo } from "react";

interface AnalyticsDashboardProps {
  toolStats: { tool: string; count: number }[];
  categoryStats: { category: string; count: number }[];
  totalStats: { totalRecords: number; totalTools: number };
  dailyStats: { date: string; count: number }[];
}

// Bar Chart Component
function BarChart({ 
  data, 
  height = 200,
  barColor = "from-violet-500 to-purple-500" 
}: { 
  data: { label: string; value: number }[];
  height?: number;
  barColor?: string;
}) {
  const maxValue = Math.max(...data.map(d => d.value), 1);

  return (
    <div className="relative" style={{ height }}>
      <div className="flex items-end justify-between gap-1 h-full">
        {data.map((item, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
            <div className="relative w-full flex justify-center mb-1">
              <span className="text-xs text-[var(--admin-muted)] absolute -top-5">
                {item.value > 0 ? item.value : ""}
              </span>
            </div>
            <div 
              className={`w-full max-w-[30px] bg-gradient-to-t ${barColor} rounded-t-md transition-all duration-500 hover:opacity-80`}
              style={{ 
                height: `${Math.max((item.value / maxValue) * 100, item.value > 0 ? 5 : 0)}%`,
              }}
            />
            <span className="text-[10px] text-[var(--admin-muted)] mt-2 truncate w-full text-center">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Pie/Donut Chart Component
function DonutChart({ 
  data 
}: { 
  data: { label: string; value: number; color: string }[];
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0);
  let cumulativePercent = 0;

  const segments = data.map((item) => {
    const percent = total > 0 ? (item.value / total) * 100 : 0;
    const startPercent = cumulativePercent;
    cumulativePercent += percent;
    return { ...item, percent, startPercent };
  });

  return (
    <div className="relative w-40 h-40 mx-auto">
      <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
        {segments.map((segment, i) => {
          const dashArray = `${segment.percent} ${100 - segment.percent}`;
          const dashOffset = 100 - segment.startPercent;
          return (
            <circle
              key={i}
              cx="18"
              cy="18"
              r="15.915"
              fill="transparent"
              stroke={segment.color}
              strokeWidth="3"
              strokeDasharray={dashArray}
              strokeDashoffset={dashOffset}
              className="transition-all duration-500"
            />
          );
        })}
        <circle cx="18" cy="18" r="12" fill="var(--admin-card)" />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-[var(--admin-text)]">{total}</span>
        <span className="text-xs text-[var(--admin-muted)]">Total</span>
      </div>
    </div>
  );
}

// Stat Box Component
function StatBox({ 
  icon, 
  label, 
  value, 
  subtext,
  trend 
}: { 
  icon: string; 
  label: string; 
  value: string | number; 
  subtext?: string;
  trend?: { value: number; isUp: boolean };
}) {
  return (
    <div className="bg-[var(--admin-card)] rounded-2xl border border-[var(--admin-border)] p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[var(--admin-muted)]">{label}</p>
          <p className="text-3xl font-bold text-[var(--admin-text)] mt-1">{value}</p>
          {subtext && <p className="text-xs text-[var(--admin-muted)] mt-1">{subtext}</p>}
          {trend && (
            <p className={`text-xs mt-2 flex items-center gap-1 ${trend.isUp ? "text-emerald-400" : "text-red-400"}`}>
              {trend.isUp ? "↑" : "↓"} {Math.abs(trend.value)}%
              <span className="text-[var(--admin-muted)]">vs last period</span>
            </p>
          )}
        </div>
        <span className="text-3xl">{icon}</span>
      </div>
    </div>
  );
}

export default function AnalyticsDashboard({
  toolStats,
  categoryStats,
  totalStats,
  dailyStats,
}: AnalyticsDashboardProps) {
  // Prepare chart data
  const dailyChartData = useMemo(() => {
    const sorted = [...dailyStats].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return sorted.slice(-14).map(d => ({
      label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value: d.count,
    }));
  }, [dailyStats]);

  const categoryChartData = useMemo(() => {
    const colors = [
      "#8b5cf6", "#a78bfa", "#c4b5fd", "#ddd6fe", 
      "#6366f1", "#818cf8", "#a5b4fc",
    ];
    return categoryStats.map((stat, i) => ({
      label: stat.category,
      value: stat.count,
      color: colors[i % colors.length],
    }));
  }, [categoryStats]);

  // Calculate stats
  const todayCount = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return dailyStats.find(d => d.date === today)?.count || 0;
  }, [dailyStats]);

  const weekCount = useMemo(() => {
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return dailyStats
      .filter(d => new Date(d.date) >= weekAgo)
      .reduce((sum, d) => sum + d.count, 0);
  }, [dailyStats]);

  const monthCount = useMemo(() => {
    return dailyStats.reduce((sum, d) => sum + d.count, 0);
  }, [dailyStats]);

  const avgPerDay = useMemo(() => {
    if (dailyStats.length === 0) return 0;
    return Math.round(dailyStats.reduce((sum, d) => sum + d.count, 0) / dailyStats.length);
  }, [dailyStats]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-[var(--admin-text)]">Analytics Overview</h2>
        <p className="text-[var(--admin-muted)]">
          Detailed statistics and usage insights for the last 30 days
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatBox icon="📊" label="Total Records" value={totalStats.totalRecords} />
        <StatBox icon="🛠️" label="Unique Tools" value={totalStats.totalTools} />
        <StatBox icon="📅" label="Today" value={todayCount} />
        <StatBox icon="📈" label="Avg/Day" value={avgPerDay} />
      </div>

      {/* Time-based Stats */}
      <div className="grid lg:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 rounded-2xl p-5">
          <p className="text-sm text-[var(--admin-muted)]">Today's Usage</p>
          <p className="text-4xl font-bold text-[var(--admin-text)] mt-2">{todayCount}</p>
          <p className="text-xs text-[var(--admin-muted)] mt-1">tool operations</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 rounded-2xl p-5">
          <p className="text-sm text-[var(--admin-muted)]">This Week</p>
          <p className="text-4xl font-bold text-[var(--admin-text)] mt-2">{weekCount}</p>
          <p className="text-xs text-[var(--admin-muted)] mt-1">tool operations</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30 rounded-2xl p-5">
          <p className="text-sm text-[var(--admin-muted)]">This Month</p>
          <p className="text-4xl font-bold text-[var(--admin-text)] mt-2">{monthCount}</p>
          <p className="text-xs text-[var(--admin-muted)] mt-1">tool operations</p>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Daily Usage Chart */}
        <div className="bg-[var(--admin-card)] rounded-2xl border border-[var(--admin-border)] p-5">
          <h3 className="font-semibold text-[var(--admin-text)] mb-4">Daily Usage (Last 14 Days)</h3>
          {dailyChartData.length > 0 ? (
            <BarChart data={dailyChartData} height={180} />
          ) : (
            <div className="h-[180px] flex items-center justify-center text-[var(--admin-muted)]">
              No data available
            </div>
          )}
        </div>

        {/* Category Distribution */}
        <div className="bg-[var(--admin-card)] rounded-2xl border border-[var(--admin-border)] p-5">
          <h3 className="font-semibold text-[var(--admin-text)] mb-4">Category Distribution</h3>
          {categoryChartData.length > 0 ? (
            <div className="flex items-center gap-6">
              <DonutChart data={categoryChartData} />
              <div className="flex-1 space-y-2">
                {categoryChartData.map((item) => (
                  <div key={item.label} className="flex items-center gap-2">
                    <span 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm text-[var(--admin-text)] capitalize flex-1">{item.label}</span>
                    <span className="text-sm font-medium text-[var(--admin-muted)]">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[180px] flex items-center justify-center text-[var(--admin-muted)]">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Top Tools */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top 10 Tools */}
        <div className="bg-[var(--admin-card)] rounded-2xl border border-[var(--admin-border)] p-5">
          <h3 className="font-semibold text-[var(--admin-text)] mb-4">🏆 Top 10 Most Used Tools</h3>
          <div className="space-y-3">
            {toolStats.slice(0, 10).map((stat, i) => {
              const maxCount = toolStats[0]?.count || 1;
              const percentage = (stat.count / maxCount) * 100;
              return (
                <div key={stat.tool}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <span className={`
                        w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold
                        ${i === 0 ? "bg-amber-500/20 text-amber-400" : 
                          i === 1 ? "bg-slate-400/20 text-slate-400" : 
                          i === 2 ? "bg-orange-600/20 text-orange-500" : 
                          "bg-[var(--admin-hover)] text-[var(--admin-muted)]"}
                      `}>
                        {i + 1}
                      </span>
                      <span className="text-sm text-[var(--admin-text)]">{stat.tool}</span>
                    </div>
                    <span className="text-sm font-medium text-[var(--admin-muted)]">{stat.count}</span>
                  </div>
                  <div className="h-2 bg-[var(--admin-hover)] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-violet-500 to-purple-500 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {toolStats.length === 0 && (
              <p className="text-center text-[var(--admin-muted)] py-4">No data available</p>
            )}
          </div>
        </div>

        {/* Tool Usage Stats */}
        <div className="bg-[var(--admin-card)] rounded-2xl border border-[var(--admin-border)] p-5">
          <h3 className="font-semibold text-[var(--admin-text)] mb-4">📊 Usage Statistics</h3>
          <div className="space-y-4">
            <div className="p-4 bg-[var(--admin-bg)] rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--admin-muted)]">Most Active Day</span>
                <span className="font-medium text-[var(--admin-text)]">
                  {dailyStats.length > 0 
                    ? new Date(dailyStats.reduce((max, d) => d.count > max.count ? d : max, dailyStats[0]).date).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
                    : "N/A"
                  }
                </span>
              </div>
            </div>
            <div className="p-4 bg-[var(--admin-bg)] rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--admin-muted)]">Peak Usage</span>
                <span className="font-medium text-[var(--admin-text)]">
                  {dailyStats.length > 0 
                    ? Math.max(...dailyStats.map(d => d.count))
                    : 0
                  } operations/day
                </span>
              </div>
            </div>
            <div className="p-4 bg-[var(--admin-bg)] rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--admin-muted)]">Active Days</span>
                <span className="font-medium text-[var(--admin-text)]">
                  {dailyStats.filter(d => d.count > 0).length} / {dailyStats.length}
                </span>
              </div>
            </div>
            <div className="p-4 bg-[var(--admin-bg)] rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--admin-muted)]">Categories Active</span>
                <span className="font-medium text-[var(--admin-text)]">
                  {categoryStats.length} / 7
                </span>
              </div>
            </div>
            <div className="p-4 bg-[var(--admin-bg)] rounded-xl">
              <div className="flex items-center justify-between">
                <span className="text-sm text-[var(--admin-muted)]">Tools Active</span>
                <span className="font-medium text-[var(--admin-text)]">
                  {toolStats.length} / 131
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
