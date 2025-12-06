// Embed Layout Component | TypeScript
"use client";

import { useEffect } from "react";
import { ToolConfig } from "@/lib/tools-config";
import { getToolIcon } from "@/assets/icons";

interface EmbedLayoutProps {
  tool: ToolConfig;
  children: React.ReactNode;
}

export function EmbedLayout({ tool, children }: EmbedLayoutProps) {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-6 p-4 rounded-xl bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-pink-500/10 border border-violet-500/20">
          <div className="flex items-start gap-3 mb-2">
            <div className="p-2 rounded-lg bg-white/50 dark:bg-black/20 backdrop-blur-sm border border-white/20 flex-shrink-0">
              {(() => {
                const IconComponent = getToolIcon(tool.icon || "document");
                return <IconComponent className="w-6 h-6 text-violet-500" />;
              })()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl font-bold">{tool.name}</h1>
                {tool.isNew && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-gradient-to-r from-green-500/20 to-emerald-500/20 border border-green-500/30 text-xs font-medium text-green-600 dark:text-green-400">
                    <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse" />
                    New
                  </span>
                )}
              </div>
              <p className="text-sm text-[var(--muted-foreground)]">{tool.description}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-xs px-2 py-1 rounded-lg bg-white/60 dark:bg-black/30 backdrop-blur-sm border border-violet-500/20 font-medium capitalize">
              <span className="w-1 h-1 rounded-full bg-violet-500" />
              {tool.category}
            </span>
            <a
              href={`https://nytm.tools/tools/${tool.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs px-2 py-1 rounded-lg bg-white/60 dark:bg-black/30 backdrop-blur-sm border border-violet-500/20 text-violet-400 hover:text-violet-300 transition-colors"
            >
              Open on NYTM Tools →
            </a>
          </div>
        </div>

        <div className="tool-container">
          {children}
        </div>

        <div className="mt-6 pt-4 border-t border-[var(--border)] text-center">
          <p className="text-xs text-[var(--muted-foreground)]">
            Powered by{" "}
            <a
              href="https://nytm.tools"
              target="_blank"
              rel="noopener noreferrer"
              className="text-violet-400 hover:text-violet-300 transition-colors font-medium"
            >
              NYTM Tools
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
