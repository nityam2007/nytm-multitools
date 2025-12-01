"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("color-picker")!;
const similarTools = getToolsByCategory("dev").filter(t => t.slug !== "color-picker");

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16),
  } : null;
}

function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
      case g: h = ((b - r) / d + 2) / 6; break;
      case b: h = ((r - g) / d + 4) / 6; break;
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function rgbToCmyk(r: number, g: number, b: number): { c: number; m: number; y: number; k: number } {
  const rr = r / 255, gg = g / 255, bb = b / 255;
  const k = 1 - Math.max(rr, gg, bb);
  if (k === 1) return { c: 0, m: 0, y: 0, k: 100 };
  return {
    c: Math.round(((1 - rr - k) / (1 - k)) * 100),
    m: Math.round(((1 - gg - k) / (1 - k)) * 100),
    y: Math.round(((1 - bb - k) / (1 - k)) * 100),
    k: Math.round(k * 100),
  };
}

export default function ColorPickerPage() {
  const [color, setColor] = useState("#6366f1");
  const [copied, setCopied] = useState<string | null>(null);

  const rgb = hexToRgb(color);
  const hsl = rgb ? rgbToHsl(rgb.r, rgb.g, rgb.b) : null;
  const cmyk = rgb ? rgbToCmyk(rgb.r, rgb.g, rgb.b) : null;

  const formats = [
    { label: "HEX", value: color.toUpperCase() },
    { label: "RGB", value: rgb ? `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` : "" },
    { label: "RGBA", value: rgb ? `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)` : "" },
    { label: "HSL", value: hsl ? `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)` : "" },
    { label: "CMYK", value: cmyk ? `cmyk(${cmyk.c}%, ${cmyk.m}%, ${cmyk.y}%, ${cmyk.k}%)` : "" },
  ];

  const handleCopy = async (value: string, label: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 2000);

    await logToolUsage({
      toolName: tool.name,
      toolCategory: tool.category,
      inputType: "text",
      rawInput: color,
      outputResult: value,
      processingDuration: 0,
    });
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row gap-6 items-center">
          <div
            className="w-48 h-48 rounded-xl shadow-lg border-2 border-border"
            style={{ backgroundColor: color }}
          />
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Pick a Color</label>
              <input
                type="color"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                className="w-full h-12 cursor-pointer rounded-lg border border-border"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Or Enter HEX</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="#6366f1"
                className="input w-full"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formats.map((format) => (
            <div key={format.label} className="card p-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-muted-foreground">{format.label}</p>
                  <p className="font-mono text-sm">{format.value}</p>
                </div>
                <button
                  onClick={() => handleCopy(format.value, format.label)}
                  className="btn btn-secondary text-sm px-3 py-1"
                >
                  {copied === format.label ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="card p-4">
          <h3 className="font-medium mb-3">Color Shades</h3>
          <div className="flex gap-1 rounded-lg overflow-hidden">
            {[0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1].map((opacity) => (
              <div
                key={opacity}
                className="flex-1 h-12 cursor-pointer"
                style={{ backgroundColor: color, opacity }}
                title={`${Math.round(opacity * 100)}%`}
                onClick={() => handleCopy(`${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`, `${Math.round(opacity * 100)}%`)}
              />
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
