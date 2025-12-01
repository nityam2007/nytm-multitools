"use client";

import { useRouter } from "next/navigation";
import { logoutAction } from "./login/actions";
import { toolsConfig } from "@/lib/tools-config";

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await logoutAction();
    router.push("/nytm-ctrl-x9k7/login");
    router.refresh();
  };

  // Calculate tool stats from config
  const totalTools = toolsConfig.length;
  const categories = [...new Set(toolsConfig.map(t => t.category))];
  const categoryStats = categories.map(cat => ({
    category: cat,
    count: toolsConfig.filter(t => t.category === cat).length,
  }));

  return (
    <div className="space-y-6">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[var(--admin-text)]">Welcome back, Admin 👋</h2>
          <p className="text-[var(--admin-muted)]">Analytics are now tracked via PostHog.</p>
        </div>
        <div className="flex gap-2">
          <a 
            href="https://eu.posthog.com"
            target="_blank"
            rel="noopener noreferrer"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 text-white font-medium hover:opacity-90 transition-opacity flex items-center gap-2"
          >
            📊 Open PostHog Dashboard
          </a>
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-xl bg-[var(--admin-card)] border border-[var(--admin-border)] hover:bg-[var(--admin-hover)] transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      {/* PostHog Info Card */}
      <div className="bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 rounded-2xl p-6">
        <div className="flex items-start gap-4">
          <div className="text-4xl">🦔</div>
          <div>
            <h3 className="text-lg font-semibold text-[var(--admin-text)] mb-2">Analytics Moved to PostHog</h3>
            <p className="text-[var(--admin-muted)] mb-4">
              Your tool usage analytics are now being tracked via PostHog. This enables:
            </p>
            <ul className="text-sm text-[var(--admin-muted)] space-y-1 mb-4">
              <li>✅ Real-time event tracking</li>
              <li>✅ Custom dashboards & insights</li>
              <li>✅ User journey analysis</li>
              <li>✅ Feature flags & A/B testing</li>
              <li>✅ Session recordings (if enabled)</li>
              <li>✅ Works with Cloudflare Pages 🎉</li>
            </ul>
            <a 
              href="https://eu.posthog.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-medium"
            >
              View your analytics dashboard →
            </a>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-violet-500/20 to-purple-500/20 border-violet-500/30 rounded-2xl border p-5">
          <p className="text-sm text-[var(--admin-muted)] mb-1">Total Tools</p>
          <p className="text-3xl font-bold text-[var(--admin-text)]">{totalTools}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border-blue-500/30 rounded-2xl border p-5">
          <p className="text-sm text-[var(--admin-muted)] mb-1">Categories</p>
          <p className="text-3xl font-bold text-[var(--admin-text)]">{categories.length}</p>
        </div>
        <div className="bg-gradient-to-br from-emerald-500/20 to-green-500/20 border-emerald-500/30 rounded-2xl border p-5">
          <p className="text-sm text-[var(--admin-muted)] mb-1">Tracking</p>
          <p className="text-3xl font-bold text-[var(--admin-text)]">PostHog</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500/20 to-amber-500/20 border-orange-500/30 rounded-2xl border p-5">
          <p className="text-sm text-[var(--admin-muted)] mb-1">Hosting</p>
          <p className="text-3xl font-bold text-[var(--admin-text)]">CF Ready</p>
        </div>
      </div>

      {/* Categories */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-[var(--admin-card)] rounded-2xl border border-[var(--admin-border)] p-5">
          <h3 className="font-semibold text-[var(--admin-text)] mb-4">📁 Tool Categories</h3>
          <div className="space-y-3">
            {categoryStats.map((stat) => {
              const percentage = (stat.count / totalTools) * 100;
              return (
                <div key={stat.category}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-[var(--admin-text)] capitalize">{stat.category}</span>
                    <span className="text-xs text-[var(--admin-muted)]">{stat.count} tools ({percentage.toFixed(0)}%)</span>
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
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-[var(--admin-card)] rounded-2xl border border-[var(--admin-border)] p-5">
          <h3 className="font-semibold text-[var(--admin-text)] mb-4">⚡ Quick Actions</h3>
          <div className="space-y-3">
            <a 
              href="https://eu.posthog.com/insights"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--admin-hover)] transition-colors"
            >
              <span className="text-2xl">📈</span>
              <div>
                <p className="font-medium text-[var(--admin-text)]">View Insights</p>
                <p className="text-xs text-[var(--admin-muted)]">See tool usage trends</p>
              </div>
            </a>
            <a 
              href="https://eu.posthog.com/events"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--admin-hover)] transition-colors"
            >
              <span className="text-2xl">📋</span>
              <div>
                <p className="font-medium text-[var(--admin-text)]">Event Stream</p>
                <p className="text-xs text-[var(--admin-muted)]">Real-time activity log</p>
              </div>
            </a>
            <a 
              href="https://eu.posthog.com/dashboard"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--admin-hover)] transition-colors"
            >
              <span className="text-2xl">🎯</span>
              <div>
                <p className="font-medium text-[var(--admin-text)]">Dashboards</p>
                <p className="text-xs text-[var(--admin-muted)]">Custom analytics views</p>
              </div>
            </a>
            <a 
              href="/tools"
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-[var(--admin-hover)] transition-colors"
            >
              <span className="text-2xl">🛠️</span>
              <div>
                <p className="font-medium text-[var(--admin-text)]">Browse Tools</p>
                <p className="text-xs text-[var(--admin-muted)]">View all {totalTools} tools</p>
              </div>
            </a>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-[var(--admin-card)] rounded-2xl border border-[var(--admin-border)] p-5">
        <h3 className="font-semibold text-[var(--admin-text)] mb-4">🟢 System Status</h3>
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-sm text-[var(--admin-text)]">All systems operational</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-sm text-[var(--admin-text)]">PostHog tracking active</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-sm text-[var(--admin-text)]">Cloudflare Pages compatible</span>
          </div>
        </div>
      </div>
    </div>
  );
}
