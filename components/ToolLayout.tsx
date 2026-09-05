// Shared tool shell | TypeScript
"use client";

import { NShethPromotion } from "@/components/NShethPromotion";
import { readToolList, writeToolList } from "@/lib/tool-history";
import Link from "next/link";
import { useEffect, useState } from "react";
import * as React from "react";
import { ToolConfig } from "@/lib/tools-config";
import { ArrowUpRightIcon, getToolIcon } from "@/assets/icons";
import { EmbedButton } from "@/components/EmbedButton";
import { ShareButton } from "@/components/ShareButton";

interface ToolLayoutProps {
  tool: ToolConfig;
  children: React.ReactNode;
  similarTools?: ToolConfig[];
  embedMode?: boolean;
}

export function ToolLayout({ tool, children, similarTools = [], embedMode = false }: ToolLayoutProps) {
  const [isEmbedMode, setIsEmbedMode] = React.useState(embedMode);

  // Auto-detect embed mode from body class
  React.useEffect(() => {
    const checkEmbedMode = () => {
      const hasEmbedClass = document.body.classList.contains('embed-mode');
      setIsEmbedMode(embedMode || hasEmbedClass);
    };
    
    checkEmbedMode();
    
    // Watch for class changes
    const observer = new MutationObserver(checkEmbedMode);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    
    return () => observer.disconnect();
  }, [embedMode]);

  // Scroll to top on mount
  useEffect(() => {
    if (!isEmbedMode) {
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [isEmbedMode]);

  useEffect(() => {
    if (!isEmbedMode) writeToolList("recentTools", [tool.slug, ...readToolList("recentTools").filter(s => s !== tool.slug)].slice(0, 6));
  }, [tool.slug, isEmbedMode]);

  // In embed mode, just render the tool content without extra UI
  if (isEmbedMode) {
    return (
      <div className="max-w-full">
        {children}
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-2 sm:px-4 lg:px-8">
      {/* Breadcrumb - Swiss style */}
      <nav className="flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[var(--muted-foreground)] mb-4 sm:mb-6 md:mb-8 py-2 sm:py-4 overflow-x-auto">
        <Link href="/" className="hover:text-violet-400 transition-colors duration-300 whitespace-nowrap">Home</Link>
        <span className="text-[var(--border)]">/</span>
        <Link href="/tools" className="hover:text-violet-400 transition-colors duration-300 whitespace-nowrap">Tools</Link>
        <span className="text-[var(--border)]">/</span>
        <span className="text-[var(--foreground)] font-medium truncate max-w-[150px] sm:max-w-none">{tool.name}</span>
      </nav>

      <header className="mb-6 border-b border-[var(--border)] pb-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">{tool.name}</h1>
          <div className="flex gap-2"><ShareButton slug={tool.slug} toolName={tool.name} /><EmbedButton slug={tool.slug} toolName={tool.name} /></div>
        </div>
        <p className="mt-3 text-sm text-[var(--muted-foreground)] max-w-3xl leading-relaxed">{tool.description}</p>
        <p className="mt-3 text-xs font-mono text-[var(--primary)]">Free · No signup</p>
      </header>

      {/* Tool Content - Enhanced container */}
      <div className="tool-container mb-8 sm:mb-10 md:mb-12">
        {children}
      </div>

      <NShethPromotion tool={tool} />

      {/* Similar Tools - Enhanced cards */}
      {similarTools.length > 0 && (
        <div className="border-t border-[var(--border)] pt-8 sm:pt-10 md:pt-12 pb-6 sm:pb-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 mb-4 sm:mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold tracking-[-0.02em]">Similar Tools</h2>
              <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1" style={{ lineHeight: '1.6' }}>
                You might also be interested in
              </p>
            </div>
            <span className="text-[10px] sm:text-xs text-[var(--muted-foreground)] tabular-nums font-mono bg-[var(--muted)] px-2 py-1 rounded-md w-fit">
              {similarTools.length} tools
            </span>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {similarTools.slice(0, 6).map((similarTool) => (
              <Link
                key={similarTool.slug}
                href={`/tools/${similarTool.slug}`}
                className="group p-4 sm:p-5 bg-[var(--card)] border border-[var(--border)] rounded-xl sm:rounded-2xl hover:border-violet-500/50 hover:bg-gradient-to-br hover:from-violet-500/5 hover:to-purple-500/5 transition-all duration-300 active:scale-[0.98] sm:hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-500/10"
              >
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
                    {(() => {
                      const IconComponent = getToolIcon(similarTool.icon || "document");
                      return <IconComponent className="w-4 h-4 sm:w-5 sm:h-5 text-violet-500 flex-shrink-0" />;
                    })()}
                    <span className="font-semibold text-xs sm:text-sm group-hover:text-violet-400 transition-colors duration-300 truncate">
                      {similarTool.name}
                    </span>
                  </div>
                  <ArrowUpRightIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 group-hover:text-violet-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 flex-shrink-0" />
                </div>
                <p className="text-xs sm:text-sm text-[var(--muted-foreground)] line-clamp-2" style={{ lineHeight: '1.6' }}>
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
