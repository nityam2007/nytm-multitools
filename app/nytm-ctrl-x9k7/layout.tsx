"use client";

import { createContext, useContext, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

// Admin Theme Context (Independent from main site)
type AdminTheme = "light" | "dark" | "system";

interface AdminThemeContextType {
  theme: AdminTheme;
  setTheme: (theme: AdminTheme) => void;
  resolvedTheme: "light" | "dark";
}

const AdminThemeContext = createContext<AdminThemeContextType | undefined>(undefined);

export function useAdminTheme() {
  const context = useContext(AdminThemeContext);
  if (context === undefined) {
    throw new Error("useAdminTheme must be used within AdminLayout");
  }
  return context;
}

// Admin Sidebar State
interface AdminSidebarContextType {
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
}

const AdminSidebarContext = createContext<AdminSidebarContextType | undefined>(undefined);

export function useAdminSidebar() {
  const context = useContext(AdminSidebarContext);
  if (context === undefined) {
    throw new Error("useAdminSidebar must be used within AdminLayout");
  }
  return context;
}

// Navigation Items
const navItems = [
  { href: "/nytm-ctrl-x9k7", icon: "📊", label: "Dashboard", exact: true },
  { href: "/nytm-ctrl-x9k7/tools", icon: "🛠️", label: "Tools Management" },
  { href: "/nytm-ctrl-x9k7/analytics", icon: "📈", label: "Analytics" },
  { href: "/nytm-ctrl-x9k7/activity", icon: "📋", label: "Activity Log" },
  { href: "/nytm-ctrl-x9k7/ads", icon: "📢", label: "Ads Management" },
  { href: "/nytm-ctrl-x9k7/settings", icon: "⚙️", label: "Settings" },
];

function AdminSidebar() {
  const pathname = usePathname();
  const { collapsed, setCollapsed } = useAdminSidebar();
  const { theme, setTheme } = useAdminTheme();

  const isActive = (href: string, exact?: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  // Cycle through themes when collapsed
  const cycleTheme = () => {
    const themes: AdminTheme[] = ["light", "dark", "system"];
    const currentIndex = themes.indexOf(theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setTheme(themes[nextIndex]);
  };

  // Get theme icon
  const getThemeIcon = () => {
    switch (theme) {
      case "light": return "☀️";
      case "dark": return "🌙";
      case "system": return "💻";
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {!collapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setCollapsed(true)}
        />
      )}

      {/* Mobile Header Bar */}
      <div className="fixed top-0 left-0 right-0 h-14 bg-[var(--admin-sidebar)] border-b border-[var(--admin-border)] flex items-center justify-between px-4 z-30 lg:hidden">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-[var(--admin-hover)] transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <Link href="/nytm-ctrl-x9k7" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">N</span>
          </div>
          <span className="font-bold bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-transparent">
            NYTM Admin
          </span>
        </Link>
        <button
          onClick={cycleTheme}
          className="p-2 rounded-lg hover:bg-[var(--admin-hover)] transition-colors"
          title={`Theme: ${theme}`}
        >
          {getThemeIcon()}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed top-14 lg:top-0 left-0 h-[calc(100%-3.5rem)] lg:h-full z-50 
        bg-[var(--admin-sidebar)] border-r border-[var(--admin-border)]
        transition-all duration-300 ease-in-out
        ${collapsed ? "-translate-x-full lg:translate-x-0 lg:w-20" : "translate-x-0 w-64"}
      `}>
        {/* Logo - Desktop Only */}
        <div className="h-16 hidden lg:flex items-center justify-between px-4 border-b border-[var(--admin-border)]">
          <Link href="/nytm-ctrl-x9k7" className={`flex items-center gap-3 ${collapsed ? "justify-center w-full" : ""}`}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-lg">N</span>
            </div>
            {!collapsed && (
              <div className="overflow-hidden">
                <span className="font-bold text-lg bg-gradient-to-r from-violet-500 to-purple-600 bg-clip-text text-transparent">
                  NYTM
                </span>
                <span className="text-xs text-[var(--admin-muted)] block -mt-1">Admin Panel</span>
              </div>
            )}
          </Link>
          {!collapsed && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="p-2 rounded-lg hover:bg-[var(--admin-hover)] transition-colors"
            >
              ←
            </button>
          )}
        </div>

        {/* Expand button when collapsed - Desktop */}
        {collapsed && (
          <div className="hidden lg:flex justify-center py-2 border-b border-[var(--admin-border)]">
            <button
              onClick={() => setCollapsed(false)}
              className="p-2 rounded-lg hover:bg-[var(--admin-hover)] transition-colors"
              title="Expand sidebar"
            >
              →
            </button>
          </div>
        )}

        {/* Navigation */}
        <nav className={`p-3 space-y-1 ${collapsed ? "lg:mt-0" : ""}`}>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => window.innerWidth < 1024 && setCollapsed(true)}
              title={collapsed ? item.label : undefined}
              className={`
                flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                ${collapsed ? "lg:justify-center" : ""}
                ${isActive(item.href, item.exact)
                  ? "bg-gradient-to-r from-violet-500/20 to-purple-500/20 text-[var(--admin-primary)] border border-violet-500/30"
                  : "hover:bg-[var(--admin-hover)] text-[var(--admin-text)]"
                }
              `}
            >
              <span className="text-xl flex-shrink-0">{item.icon}</span>
              {!collapsed && <span className="font-medium">{item.label}</span>}
            </Link>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-[var(--admin-border)]">
          {/* Theme Toggle */}
          {collapsed ? (
            /* Collapsed: Single button that cycles through themes */
            <button
              onClick={cycleTheme}
              className="w-full flex justify-center p-2.5 rounded-xl hover:bg-[var(--admin-hover)] transition-colors mb-2"
              title={`Theme: ${theme} (click to change)`}
            >
              <span className="text-xl">{getThemeIcon()}</span>
            </button>
          ) : (
            /* Expanded: Full theme toggle */
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-[var(--admin-muted)]">Theme</span>
              <div className="flex gap-1 bg-[var(--admin-hover)] rounded-lg p-1">
                <button
                  onClick={() => setTheme("light")}
                  className={`p-1.5 rounded-md transition-colors ${theme === "light" ? "bg-[var(--admin-card)] shadow-sm" : ""}`}
                  title="Light"
                >
                  ☀️
                </button>
                <button
                  onClick={() => setTheme("dark")}
                  className={`p-1.5 rounded-md transition-colors ${theme === "dark" ? "bg-[var(--admin-card)] shadow-sm" : ""}`}
                  title="Dark"
                >
                  🌙
                </button>
                <button
                  onClick={() => setTheme("system")}
                  className={`p-1.5 rounded-md transition-colors ${theme === "system" ? "bg-[var(--admin-card)] shadow-sm" : ""}`}
                  title="System"
                >
                  💻
                </button>
              </div>
            </div>
          )}

          {/* Back to Site */}
          <Link
            href="/"
            className={`
              flex items-center gap-3 px-3 py-2.5 rounded-xl
              hover:bg-[var(--admin-hover)] text-[var(--admin-muted)] transition-colors
              ${collapsed ? "justify-center" : ""}
            `}
            title={collapsed ? "Back to Site" : undefined}
          >
            <span>🌐</span>
            {!collapsed && <span className="text-sm">Back to Site</span>}
          </Link>
        </div>
      </aside>
    </>
  );
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [theme, setTheme] = useState<AdminTheme>("system");
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("dark");
  const [collapsed, setCollapsed] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("admin-theme") as AdminTheme | null;
    if (stored) setTheme(stored);
    
    // Default to collapsed on mobile
    if (window.innerWidth < 1024) {
      setCollapsed(true);
    } else {
      const sidebarState = localStorage.getItem("admin-sidebar");
      setCollapsed(sidebarState === "collapsed");
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const updateTheme = () => {
      let resolved: "light" | "dark";
      
      if (theme === "system") {
        resolved = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      } else {
        resolved = theme;
      }
      
      setResolvedTheme(resolved);
    };

    updateTheme();
    localStorage.setItem("admin-theme", theme);

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    mediaQuery.addEventListener("change", updateTheme);

    return () => mediaQuery.removeEventListener("change", updateTheme);
  }, [theme, mounted]);

  useEffect(() => {
    if (mounted && window.innerWidth >= 1024) {
      localStorage.setItem("admin-sidebar", collapsed ? "collapsed" : "expanded");
    }
  }, [collapsed, mounted]);

  // Admin-specific CSS variables
  const adminStyles = resolvedTheme === "dark" ? {
    "--admin-bg": "#0a0a0f",
    "--admin-card": "#12121a",
    "--admin-sidebar": "#0d0d14",
    "--admin-border": "#1e1e2e",
    "--admin-hover": "#1a1a28",
    "--admin-text": "#e4e4e7",
    "--admin-muted": "#71717a",
    "--admin-primary": "#a78bfa",
    "--admin-success": "#4ade80",
    "--admin-warning": "#fbbf24",
    "--admin-danger": "#f87171",
  } : {
    "--admin-bg": "#f8fafc",
    "--admin-card": "#ffffff",
    "--admin-sidebar": "#ffffff",
    "--admin-border": "#e2e8f0",
    "--admin-hover": "#f1f5f9",
    "--admin-text": "#1e293b",
    "--admin-muted": "#64748b",
    "--admin-primary": "#7c3aed",
    "--admin-success": "#22c55e",
    "--admin-warning": "#f59e0b",
    "--admin-danger": "#ef4444",
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 animate-pulse"></div>
      </div>
    );
  }

  return (
    <AdminThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      <AdminSidebarContext.Provider value={{ collapsed, setCollapsed }}>
        <div 
          className="min-h-screen transition-colors duration-300"
          style={{ 
            ...adminStyles as React.CSSProperties,
            backgroundColor: "var(--admin-bg)",
            color: "var(--admin-text)",
          }}
        >
          <AdminSidebar />
          
          <main className={`
            pt-14 lg:pt-0 min-h-screen transition-all duration-300
            ${collapsed ? "lg:pl-20" : "lg:pl-64"}
          `}>
            <div className="p-4 lg:p-6">
              {children}
            </div>
          </main>
        </div>
      </AdminSidebarContext.Provider>
    </AdminThemeContext.Provider>
  );
}
