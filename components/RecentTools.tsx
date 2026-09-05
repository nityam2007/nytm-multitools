// Recently visited tool shortcuts | TypeScript
"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getToolBySlug } from "@/lib/tools-config";
import { readToolList, writeToolList } from "@/lib/tool-history";

export function RecentTools() {
  const [slugs, setSlugs] = useState<string[]>([]);
  useEffect(() => {
    const refresh = () => setSlugs(readToolList("recentTools"));
    refresh();
    window.addEventListener("toolPreferencesChanged", refresh);
    return () => window.removeEventListener("toolPreferencesChanged", refresh);
  }, []);
  const tools = slugs.map(getToolBySlug).filter((t) => t !== undefined);
  if (!tools.length) return null;
  return (
    <section
      className="recent-tools"
      aria-label="Recently used tools"
    >
      <div className="flex items-center justify-between gap-3 mb-3">
        <h2 className="text-sm font-semibold">Recently used</h2>
        <button
          className="btn btn-secondary"
          onClick={() => {
            writeToolList("recentTools", []);
            setSlugs([]);
          }}
        >
          Clear history
        </button>
      </div>
      <div className="recent-links">
        {tools.map((tool) => (
          <Link
            key={tool.slug}
            href={`/tools/${tool.slug}`}
            className="btn btn-secondary"
          >
            {tool.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
