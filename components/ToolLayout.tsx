"use client";

import Link from "next/link";
import { ToolConfig } from "@/lib/tools-config";
import { ArrowUpRightIcon, getToolIcon } from "@/assets/icons";

interface ToolLayoutProps {
  tool: ToolConfig;
  children: React.ReactNode;
  similarTools?: ToolConfig[];
}

export function ToolLayout({ tool, children, similarTools = [] }: ToolLayoutProps) {
  return (
    <div className="max-w-6xl mx-auto px-6 lg:px-8">
      {/* Breadcrumb - Swiss style */}
      <nav className="flex items-center gap-2 text-sm text-[var(--muted-foreground)] mb-8 py-4">
        <Link href="/" className="hover:text-violet-400 transition-colors duration-300">Home</Link>
        <span className="text-[var(--border)]">/</span>
        <Link href="/tools" className="hover:text-violet-400 transition-colors duration-300">Tools</Link>
        <span className="text-[var(--border)]">/</span>
        <span className="text-[var(--foreground)] font-medium">{tool.name}</span>
      </nav>

      {/* Hero Header - Modern card with gradient */}
      <div className="mb-10 p-8 md:p-10 rounded-3xl bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-pink-500/10 border border-violet-500/20 relative overflow-hidden">
        {/* Decorative gradient orb */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-violet-500/20 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        
        <div className="relative">
          <div className="flex items-start gap-4 mb-4">
            <div className="p-4 rounded-2xl bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-white/20 shadow-lg">
              {(() => {
                const IconComponent = getToolIcon(tool.icon || "document");
                return <IconComponent className="w-10 h-10 text-violet-500" />;
              })()}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl md:text-4xl font-bold tracking-[-0.02em]">{tool.name}</h1>
                {tool.isNew && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-xs font-medium text-green-600 dark:text-green-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    New
                  </span>
                )}
              </div>
              <p className="text-base md:text-lg text-[var(--muted-foreground)] max-w-2xl" style={{ lineHeight: '1.6' }}>
                {tool.description}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-4">
            <span className="inline-flex items-center gap-2 text-xs px-3 py-1.5 rounded-lg bg-white/60 dark:bg-black/30 backdrop-blur-sm border border-violet-500/20 text-[var(--foreground)] font-medium capitalize">
              <span className="w-1.5 h-1.5 rounded-full bg-violet-500" />
              {tool.category}
            </span>
            <span className="text-xs px-3 py-1.5 rounded-lg bg-white/60 dark:bg-black/30 backdrop-blur-sm border border-violet-500/20 text-[var(--muted-foreground)] font-mono">
              Free • No signup
            </span>
          </div>
        </div>
      </div>

      {/* Tool Content - Enhanced container */}
      <div className="tool-container mb-12">
        {children}
      </div>

      {/* Similar Tools - Enhanced cards */}
      {similarTools.length > 0 && (
        <div className="border-t border-[var(--border)] pt-12 pb-8">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold tracking-[-0.02em]">Similar Tools</h2>
              <p className="text-sm text-[var(--muted-foreground)] mt-1" style={{ lineHeight: '1.6' }}>
                You might also be interested in
              </p>
            </div>
            <span className="text-xs text-[var(--muted-foreground)] tabular-nums font-mono bg-[var(--muted)] px-2 py-1 rounded-md">
              {similarTools.length} tools
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {similarTools.slice(0, 6).map((similarTool) => (
              <Link
                key={similarTool.slug}
                href={`/tools/${similarTool.slug}`}
                className="group p-5 bg-[var(--card)] border border-[var(--border)] rounded-2xl hover:border-violet-500/50 hover:bg-gradient-to-br hover:from-violet-500/5 hover:to-purple-500/5 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-500/10"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    {(() => {
                      const IconComponent = getToolIcon(similarTool.icon || "document");
                      return <IconComponent className="w-5 h-5 text-violet-500" />;
                    })()}
                    <span className="font-semibold text-sm group-hover:text-violet-400 transition-colors duration-300">
                      {similarTool.name}
                    </span>
                  </div>
                  <ArrowUpRightIcon className="w-4 h-4 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 group-hover:text-violet-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
                <p className="text-sm text-[var(--muted-foreground)] line-clamp-2" style={{ lineHeight: '1.6' }}>
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
