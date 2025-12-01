"use client";

import Link from "next/link";
import { ToolConfig } from "@/lib/tools-config";
import { ToolTopAd, ToolBottomAd, SidebarAd } from "@/components/AdUnit";
import { UsageLimitWarning } from "@/components/Paywall";

interface ToolLayoutProps {
  tool: ToolConfig;
  children: React.ReactNode;
  similarTools?: ToolConfig[];
}

export function ToolLayout({ tool, children, similarTools = [] }: ToolLayoutProps) {
  return (
    <div className="max-w-6xl mx-auto">
      {/* Top Ad - Desktop */}
      <ToolTopAd className="mb-4" />
      
      <div className="flex gap-6">
        {/* Main Content */}
        <div className="flex-1 max-w-4xl">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-6">
            <Link href="/" className="hover:text-[var(--foreground)]">Home</Link>
            <span>/</span>
            <Link href="/tools" className="hover:text-[var(--foreground)]">Tools</Link>
            <span>/</span>
            <span className="text-[var(--foreground)]">{tool.name}</span>
          </nav>

          {/* Usage Limit Warning */}
          <UsageLimitWarning />

          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">{tool.icon}</span>
              <h1 className="text-3xl font-bold">{tool.name}</h1>
            </div>
            <p className="text-[var(--muted-foreground)]">{tool.description}</p>
            <div className="mt-3 flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
                {tool.category}
              </span>
              {tool.isNew && (
                <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-500">
                  New
                </span>
              )}
            </div>
          </div>

          {/* Tool Content */}
          <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-6 mb-8">
            {children}
          </div>
          
          {/* Bottom Ad */}
          <ToolBottomAd className="mb-8" />
        </div>
        
        {/* Sidebar Ad - Desktop Only */}
        <aside className="hidden lg:block w-[300px] flex-shrink-0">
          <div className="sticky top-24">
            <SidebarAd />
          </div>
        </aside>
      </div>

      {/* Similar Tools */}
      {similarTools.length > 0 && (
        <div className="border-t border-[var(--border)] pt-8">
          <h2 className="text-xl font-semibold mb-4">Similar Tools</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {similarTools.slice(0, 6).map((similarTool) => (
              <Link
                key={similarTool.slug}
                href={`/tools/${similarTool.slug}`}
                className="p-4 rounded-lg border border-[var(--border)] hover:border-[var(--primary)] transition-colors"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span>{similarTool.icon}</span>
                  <span className="font-medium">{similarTool.name}</span>
                </div>
                <p className="text-sm text-[var(--muted-foreground)] line-clamp-2">
                  {similarTool.description}
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
