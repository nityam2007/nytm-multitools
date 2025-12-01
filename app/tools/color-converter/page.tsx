"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("color-converter")!;
const similarTools = getToolsByCategory("converter").filter(t => t.slug !== "color-converter");

interface ColorValues {
  hex: string;
  rgb: { r: number; g: number; b: number };
  hsl: { h: number; s: number; l: number };
  hsv: { h: number; s: number; v: number };
  cmyk: { c: number; m: number; y: number; k: number };
}

export default function ColorConverterPage() {
  const [color, setColor] = useState<ColorValues>({
    hex: "#3b82f6",
    rgb: { r: 59, g: 130, b: 246 },
    hsl: { h: 217, s: 91, l: 60 },
    hsv: { h: 217, s: 76, v: 96 },
    cmyk: { c: 76, m: 47, y: 0, k: 4 },
  });

  const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16),
    } : null;
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
  };

  const rgbToHsl = (r: number, g: number, b: number): { h: number; s: number; l: number } => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s;
    const l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    } else {
      s = 0;
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
  };

  const hslToRgb = (h: number, s: number, l: number): { r: number; g: number; b: number } => {
    h /= 360; s /= 100; l /= 100;
    let r, g, b;
    if (s === 0) {
      r = g = b = l;
    } else {
      const hue2rgb = (p: number, q: number, t: number) => {
        if (t < 0) t += 1;
        if (t > 1) t -= 1;
        if (t < 1/6) return p + (q - p) * 6 * t;
        if (t < 1/2) return q;
        if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
      };
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }
    return { r: Math.round(r * 255), g: Math.round(g * 255), b: Math.round(b * 255) };
  };

  const rgbToHsv = (r: number, g: number, b: number): { h: number; s: number; v: number } => {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0;
    const v = max;
    const d = max - min;
    const s = max === 0 ? 0 : d / max;
    if (max !== min) {
      switch (max) {
        case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
        case g: h = ((b - r) / d + 2) / 6; break;
        case b: h = ((r - g) / d + 4) / 6; break;
      }
    }
    return { h: Math.round(h * 360), s: Math.round(s * 100), v: Math.round(v * 100) };
  };

  const rgbToCmyk = (r: number, g: number, b: number): { c: number; m: number; y: number; k: number } => {
    r /= 255; g /= 255; b /= 255;
    const k = 1 - Math.max(r, g, b);
    if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
    const c = (1 - r - k) / (1 - k);
    const m = (1 - g - k) / (1 - k);
    const y = (1 - b - k) / (1 - k);
    return { c: Math.round(c * 100), m: Math.round(m * 100), y: Math.round(y * 100), k: Math.round(k * 100) };
  };

  const updateFromHex = (hex: string) => {
    const rgb = hexToRgb(hex);
    if (rgb) {
      setColor({
        hex,
        rgb,
        hsl: rgbToHsl(rgb.r, rgb.g, rgb.b),
        hsv: rgbToHsv(rgb.r, rgb.g, rgb.b),
        cmyk: rgbToCmyk(rgb.r, rgb.g, rgb.b),
      });
    }
  };

  const updateFromRgb = (r: number, g: number, b: number) => {
    setColor({
      hex: rgbToHex(r, g, b),
      rgb: { r, g, b },
      hsl: rgbToHsl(r, g, b),
      hsv: rgbToHsv(r, g, b),
      cmyk: rgbToCmyk(r, g, b),
    });
  };

  const updateFromHsl = (h: number, s: number, l: number) => {
    const rgb = hslToRgb(h, s, l);
    setColor({
      hex: rgbToHex(rgb.r, rgb.g, rgb.b),
      rgb,
      hsl: { h, s, l },
      hsv: rgbToHsv(rgb.r, rgb.g, rgb.b),
      cmyk: rgbToCmyk(rgb.r, rgb.g, rgb.b),
    });
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div
          className="h-32 rounded-xl border border-[var(--border)]"
          style={{ backgroundColor: color.hex }}
        />

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
            <h3 className="font-semibold mb-3">HEX</h3>
            <div className="flex gap-2">
              <input
                type="color"
                value={color.hex}
                onChange={(e) => updateFromHex(e.target.value)}
                className="w-12 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={color.hex}
                onChange={(e) => updateFromHex(e.target.value)}
                className="flex-1 px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] font-mono"
              />
            </div>
          </div>

          <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
            <h3 className="font-semibold mb-3">RGB</h3>
            <div className="grid grid-cols-3 gap-2">
              {(["r", "g", "b"] as const).map((c) => (
                <div key={c}>
                  <label className="text-xs text-[var(--muted-foreground)] uppercase">{c}</label>
                  <input
                    type="number"
                    min="0"
                    max="255"
                    value={color.rgb[c]}
                    onChange={(e) => updateFromRgb(
                      c === "r" ? parseInt(e.target.value) || 0 : color.rgb.r,
                      c === "g" ? parseInt(e.target.value) || 0 : color.rgb.g,
                      c === "b" ? parseInt(e.target.value) || 0 : color.rgb.b
                    )}
                    className="w-full px-2 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] font-mono text-sm"
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs font-mono text-[var(--muted-foreground)]">
              rgb({color.rgb.r}, {color.rgb.g}, {color.rgb.b})
            </div>
          </div>

          <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
            <h3 className="font-semibold mb-3">HSL</h3>
            <div className="grid grid-cols-3 gap-2">
              {(["h", "s", "l"] as const).map((c) => (
                <div key={c}>
                  <label className="text-xs text-[var(--muted-foreground)] uppercase">{c}{c === "h" ? "°" : "%"}</label>
                  <input
                    type="number"
                    min="0"
                    max={c === "h" ? 360 : 100}
                    value={color.hsl[c]}
                    onChange={(e) => updateFromHsl(
                      c === "h" ? parseInt(e.target.value) || 0 : color.hsl.h,
                      c === "s" ? parseInt(e.target.value) || 0 : color.hsl.s,
                      c === "l" ? parseInt(e.target.value) || 0 : color.hsl.l
                    )}
                    className="w-full px-2 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] font-mono text-sm"
                  />
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs font-mono text-[var(--muted-foreground)]">
              hsl({color.hsl.h}, {color.hsl.s}%, {color.hsl.l}%)
            </div>
          </div>

          <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
            <h3 className="font-semibold mb-3">HSV</h3>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div><span className="text-xs text-[var(--muted-foreground)]">H</span><div className="font-mono">{color.hsv.h}°</div></div>
              <div><span className="text-xs text-[var(--muted-foreground)]">S</span><div className="font-mono">{color.hsv.s}%</div></div>
              <div><span className="text-xs text-[var(--muted-foreground)]">V</span><div className="font-mono">{color.hsv.v}%</div></div>
            </div>
          </div>

          <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)] md:col-span-2">
            <h3 className="font-semibold mb-3">CMYK</h3>
            <div className="grid grid-cols-4 gap-4 text-center">
              {(["c", "m", "y", "k"] as const).map((c) => (
                <div key={c}>
                  <span className="text-xs text-[var(--muted-foreground)] uppercase">{c}</span>
                  <div className="font-mono">{color.cmyk[c]}%</div>
                </div>
              ))}
            </div>
            <div className="mt-2 text-xs font-mono text-[var(--muted-foreground)] text-center">
              cmyk({color.cmyk.c}%, {color.cmyk.m}%, {color.cmyk.y}%, {color.cmyk.k}%)
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
