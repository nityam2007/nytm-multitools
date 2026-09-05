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
  const tools = slugs.map(getToolBySlug).filter(t => t !== undefined);
  if (!tools.length) return null;
  return <section className="my-6 border-b border-[var(--border)] pb-6" aria-label="Recently used tools">
    <div className="flex items-center justify-between gap-3 mb-3"><h2 className="text-sm font-semibold">Recently used</h2><button className="text-xs underline" onClick={() => { writeToolList("recentTools", []); setSlugs([]); }}>Clear history</button></div>
    <div className="flex flex-wrap gap-2">{tools.map(tool => <Link key={tool.slug} href={`/tools/${tool.slug}`} className="px-3 py-2 text-sm rounded-lg border border-[var(--border)] hover:border-violet-500">{tool.name}</Link>)}</div>
  </section>;
}
