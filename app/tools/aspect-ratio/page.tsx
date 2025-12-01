"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("aspect-ratio")!;
const similarTools = getToolsByCategory("misc").filter(t => t.slug !== "aspect-ratio");

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

function calculateAspectRatio(width: number, height: number): string {
  if (!width || !height) return "—";
  const divisor = gcd(width, height);
  return `${width / divisor}:${height / divisor}`;
}

const commonRatios = [
  { ratio: "1:1", name: "Square", examples: "Instagram, Profile pictures" },
  { ratio: "4:3", name: "Standard", examples: "Old TVs, Presentations" },
  { ratio: "16:9", name: "Widescreen", examples: "YouTube, HD TV" },
  { ratio: "16:10", name: "Computer", examples: "MacBook, Monitors" },
  { ratio: "21:9", name: "Ultra-wide", examples: "Cinema, Gaming" },
  { ratio: "9:16", name: "Vertical", examples: "TikTok, Stories" },
  { ratio: "3:2", name: "Classic", examples: "35mm Film, Photography" },
  { ratio: "2:1", name: "Univisium", examples: "Netflix originals" },
];

export default function AspectRatioPage() {
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [lockedRatio, setLockedRatio] = useState<string | null>(null);

  const aspectRatio = calculateAspectRatio(width, height);

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (lockedRatio) {
      const [w, h] = lockedRatio.split(":").map(Number);
      setHeight(Math.round(newWidth * (h / w)));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    if (lockedRatio) {
      const [w, h] = lockedRatio.split(":").map(Number);
      setWidth(Math.round(newHeight * (w / h)));
    }
  };

  const applyRatio = (ratio: string) => {
    const [w, h] = ratio.split(":").map(Number);
    setWidth(Math.round(height * (w / h)));
    setLockedRatio(ratio);
  };

  const swapDimensions = () => {
    const temp = width;
    setWidth(height);
    setHeight(temp);
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Width (px)</label>
            <input
              type="number"
              value={width}
              onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Height (px)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
              className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            />
          </div>
        </div>

        <button
          onClick={swapDimensions}
          className="w-full py-2 rounded-lg bg-[var(--muted)] hover:bg-[var(--accent)] transition-colors"
        >
          🔄 Swap Dimensions
        </button>

        <div className="bg-[var(--muted)] rounded-xl p-6 text-center">
          <div className="text-sm text-[var(--muted-foreground)] mb-1">Aspect Ratio</div>
          <div className="text-4xl font-bold text-[var(--primary)]">{aspectRatio}</div>
          {lockedRatio && (
            <div className="mt-2">
              <span className="px-2 py-1 bg-[var(--primary)] text-[var(--primary-foreground)] text-xs rounded">
                Locked to {lockedRatio}
              </span>
              <button
                onClick={() => setLockedRatio(null)}
                className="ml-2 text-xs text-[var(--muted-foreground)] hover:text-[var(--foreground)]"
              >
                Unlock
              </button>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <div
            className="border-2 border-[var(--primary)] bg-[var(--primary)]/10 rounded-lg flex items-center justify-center transition-all"
            style={{
              width: Math.min(300, width / Math.max(width, height) * 300),
              height: Math.min(200, height / Math.max(width, height) * 200),
            }}
          >
            <span className="text-xs text-[var(--muted-foreground)]">{width} × {height}</span>
          </div>
        </div>

        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-4">Common Aspect Ratios</h3>
          <div className="grid sm:grid-cols-2 gap-3">
            {commonRatios.map((item) => (
              <button
                key={item.ratio}
                onClick={() => applyRatio(item.ratio)}
                className={`p-3 rounded-lg text-left transition-colors ${
                  aspectRatio === item.ratio
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "bg-[var(--muted)] hover:bg-[var(--accent)]"
                }`}
              >
                <div className="font-mono font-bold">{item.ratio}</div>
                <div className="text-sm opacity-70">{item.name}</div>
                <div className="text-xs opacity-50">{item.examples}</div>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-3">Quick Resolutions</h3>
          <div className="flex flex-wrap gap-2">
            {[
              { w: 1920, h: 1080, name: "1080p" },
              { w: 2560, h: 1440, name: "1440p" },
              { w: 3840, h: 2160, name: "4K" },
              { w: 1280, h: 720, name: "720p" },
              { w: 1080, h: 1080, name: "Square" },
              { w: 1080, h: 1920, name: "Vertical" },
            ].map((res) => (
              <button
                key={res.name}
                onClick={() => { setWidth(res.w); setHeight(res.h); setLockedRatio(null); }}
                className="px-3 py-1 text-sm rounded-lg bg-[var(--muted)] hover:bg-[var(--accent)]"
              >
                {res.name} ({res.w}×{res.h})
              </button>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
