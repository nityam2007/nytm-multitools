// Shared tool shell | TypeScript
"use client";

import { NShethPromotion } from "@/components/NShethPromotion";
import { readToolList, writeToolList } from "@/lib/tool-history";
import Link from "next/link";
import { useEffect } from "react";
import * as React from "react";
import { ToolConfig } from "@/lib/tools-config";
import { ToolCard } from "@/components/ToolCard";
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

  const guide = ({ "product-photos": "prepare-product-photos", "whatsapp-link": "whatsapp-enquiry-qr", "csv-cleanup": "clean-recurring-csv", "website-brief": "write-a-website-brief" } as Record<string, string>)[tool.slug];

  return (
    <div className="tool-shell max-w-6xl mx-auto">
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

      {guide && <Link className="btn btn-secondary mb-3" href={`/guides/${guide}`}>Read the step-by-step guide →</Link>}
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
            <Link className="btn btn-secondary" href={`/tools?category=${tool.category}`}>Browse this category →</Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {similarTools.slice(0, 6).map((similarTool) => <ToolCard key={similarTool.slug} tool={similarTool} />)}
          </div>
        </div>
      )}
    </div>
  );
}
