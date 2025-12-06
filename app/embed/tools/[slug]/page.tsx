// Dynamic Embed Tool Page | TypeScript
"use client";

import { useParams } from "next/navigation";
import { getToolBySlug } from "@/lib/tools-config";
import { EmbedLayout } from "@/components/EmbedLayout";
import { useEffect, useState } from "react";

export default function EmbedToolPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const tool = getToolBySlug(slug);
  const [ToolComponent, setToolComponent] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const loadTool = async () => {
      try {
        setLoading(true);
        const module = await import(`@/app/tools/${slug}/page`);
        setToolComponent(() => module.default);
        setLoading(false);
      } catch (err) {
        console.error(`Failed to load tool: ${slug}`, err);
        setError(true);
        setLoading(false);
      }
    };

    loadTool();
  }, [slug]);

  if (!tool || error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)] p-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Tool Not Found</h1>
          <p className="text-[var(--muted-foreground)] mb-4">
            The tool <code className="px-2 py-1 bg-[var(--muted)] rounded">{slug}</code> could not be loaded.
          </p>
          <a
            href="https://nytm.tools/tools"
            className="text-violet-400 hover:text-violet-300 transition-colors"
          >
            Browse all tools →
          </a>
        </div>
      </div>
    );
  }

  if (loading || !ToolComponent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
        <div className="text-center">
          <div className="spinner w-8 h-8 mx-auto mb-3" />
          <p className="text-[var(--muted-foreground)]">Loading {tool.name}...</p>
        </div>
      </div>
    );
  }

  return (
    <EmbedLayout tool={tool}>
      <ToolComponent embedMode={true} />
    </EmbedLayout>
  );
}
