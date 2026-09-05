// Readable tool card with separate open and pin actions | TypeScript
"use client";
import Link from "next/link";
import { readToolList, writeToolList, usePreference } from "@/lib/tool-history";
import type { ToolConfig } from "@/lib/tools-config";
import { categoryIconMap, CircleIcon, ArrowRightIcon } from "@/assets/icons";
const labels: Record<ToolConfig["category"], string> = { text: "Text", image: "Images", dev: "Developer", converter: "Converters", generator: "Generators", security: "Security", network: "Network", misc: "Everyday utilities" };
export function ToolCard({ tool }: { tool: ToolConfig }) {
  const saved = usePreference("pinnedTools", "[]");
  let pinned = false;
  try { const parsed: unknown = JSON.parse(saved); pinned = Array.isArray(parsed) && parsed.includes(tool.slug); } catch {}
  const Icon = categoryIconMap[tool.category] || CircleIcon;
  return (
    <article className="discovery-card">
      <div className="discovery-card-head">
        <span className="discovery-card-icon" aria-hidden="true"><Icon className="w-5 h-5" /></span>
        <h3><Link href={`/tools/${tool.slug}`}>{tool.name}</Link></h3>
      </div>
      <p>{tool.description}</p>
      <div className="discovery-card-meta"><span>{labels[tool.category]}</span>{tool.isNew && <span className="new-label">Recently added</span>}</div>
      <div className="discovery-card-actions">
        <Link className="btn btn-secondary" href={`/tools/${tool.slug}`} aria-label={`Open ${tool.name}`}>Open tool <span aria-hidden="true"><ArrowRightIcon className="w-4 h-4" /></span></Link>
        <button type="button" className="pin-button" aria-label={pinned ? `Unpin ${tool.name}` : `Pin ${tool.name}`} aria-pressed={pinned} onClick={() => {
          const current = readToolList("pinnedTools");
          writeToolList("pinnedTools", pinned ? current.filter(s => s !== tool.slug) : [...new Set([...current, tool.slug])]);
          window.dispatchEvent(new Event("pinnedToolsChanged"));
        }}>
          <svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill={pinned ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.6"><path strokeLinejoin="round" d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z" /></svg>
          {pinned ? "Pinned" : "Pin"}
        </button>
      </div>
    </article>
  );
}
