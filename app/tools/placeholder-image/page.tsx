"use client";

import { useState, useRef, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("placeholder-image")!;
const similarTools = getToolsByCategory("image").filter(t => t.slug !== "placeholder-image");

export default function PlaceholderImagePage() {
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [bgColor, setBgColor] = useState("#cccccc");
  const [textColor, setTextColor] = useState("#666666");
  const [text, setText] = useState("");
  const [fontSize, setFontSize] = useState(32);
  const [format, setFormat] = useState<"png" | "jpeg" | "svg">("png");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const presets = [
    { name: "Square", w: 500, h: 500 },
    { name: "HD", w: 1280, h: 720 },
    { name: "Full HD", w: 1920, h: 1080 },
    { name: "4K", w: 3840, h: 2160 },
    { name: "Instagram Post", w: 1080, h: 1080 },
    { name: "Instagram Story", w: 1080, h: 1920 },
    { name: "Facebook Cover", w: 820, h: 312 },
    { name: "Twitter Header", w: 1500, h: 500 },
    { name: "YouTube Thumbnail", w: 1280, h: 720 },
    { name: "LinkedIn Banner", w: 1584, h: 396 },
  ];

  const displayText = text || `${width} × ${height}`;

  const generateImage = useCallback(() => {
    if (format === "svg") {
      const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
        <rect width="100%" height="100%" fill="${bgColor}"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${fontSize}" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">${displayText}</text>
      </svg>`;
      
      const blob = new Blob([svgContent], { type: "image/svg+xml" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.download = `placeholder-${width}x${height}.svg`;
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
      return;
    }

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    
    canvas.width = width;
    canvas.height = height;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, width, height);

    // Text
    ctx.fillStyle = textColor;
    ctx.font = `${fontSize}px Arial, sans-serif`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(displayText, width / 2, height / 2);

    // Download
    const mime = format === "jpeg" ? "image/jpeg" : "image/png";
    const link = document.createElement("a");
    link.download = `placeholder-${width}x${height}.${format}`;
    link.href = canvas.toDataURL(mime, 0.9);
    link.click();
  }, [width, height, bgColor, textColor, displayText, fontSize, format]);

  const copyUrl = async () => {
    const url = `https://via.placeholder.com/${width}x${height}/${bgColor.slice(1)}/${textColor.slice(1)}?text=${encodeURIComponent(displayText)}`;
    await navigator.clipboard.writeText(url);
    alert("URL copied to clipboard!");
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-4">Preview</h3>
          <div 
            className="mx-auto flex items-center justify-center overflow-hidden"
            style={{ 
              maxWidth: "100%",
              aspectRatio: `${width}/${height}`,
              maxHeight: 300,
              backgroundColor: bgColor,
              color: textColor,
              fontSize: `${Math.min(fontSize, 48)}px`,
              fontFamily: "Arial, sans-serif",
            }}
          >
            {displayText}
          </div>
          <div className="text-center mt-3 text-sm text-[var(--muted-foreground)]">
            {width} × {height}px
          </div>
        </div>

        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-4">Size Presets</h3>
          <div className="flex flex-wrap gap-2">
            {presets.map((preset) => (
              <button
                key={preset.name}
                onClick={() => {
                  setWidth(preset.w);
                  setHeight(preset.h);
                }}
                className={`px-3 py-1 rounded text-sm ${
                  width === preset.w && height === preset.h
                    ? "bg-blue-500 text-white"
                    : "bg-[var(--muted)] hover:bg-[var(--accent)]"
                }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Width (px)</label>
            <input
              type="number"
              value={width}
              onChange={(e) => setWidth(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              max="10000"
              className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Height (px)</label>
            <input
              type="number"
              value={height}
              onChange={(e) => setHeight(Math.max(1, parseInt(e.target.value) || 1))}
              min="1"
              max="10000"
              className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            />
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Background Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-12 h-12 rounded cursor-pointer"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="flex-1 px-3 py-2 rounded bg-[var(--background)] border border-[var(--border)] font-mono"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Text Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="w-12 h-12 rounded cursor-pointer"
              />
              <input
                type="text"
                value={textColor}
                onChange={(e) => setTextColor(e.target.value)}
                className="flex-1 px-3 py-2 rounded bg-[var(--background)] border border-[var(--border)] font-mono"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Custom Text (optional)</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={`Default: ${width} × ${height}`}
            className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Font Size: {fontSize}px</label>
          <input
            type="range"
            value={fontSize}
            onChange={(e) => setFontSize(parseInt(e.target.value))}
            min="8"
            max="200"
            className="w-full"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Format</label>
          <div className="flex gap-2">
            {(["png", "jpeg", "svg"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFormat(f)}
                className={`px-4 py-2 rounded uppercase ${
                  format === f
                    ? "bg-blue-500 text-white"
                    : "bg-[var(--muted)] hover:bg-[var(--accent)]"
                }`}
              >
                {f}
              </button>
            ))}
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <button
            onClick={generateImage}
            className="py-4 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700"
          >
            ⬇ Download {format.toUpperCase()}
          </button>
          <button
            onClick={copyUrl}
            className="py-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
          >
            📋 Copy Placeholder URL
          </button>
        </div>

        <canvas ref={canvasRef} className="hidden" />

        <div className="bg-[var(--muted)] rounded-xl p-4 text-sm text-[var(--muted-foreground)]">
          <h4 className="font-medium mb-2">💡 Common Use Cases:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Mockups and wireframes</li>
            <li>Website development placeholders</li>
            <li>Image dimension testing</li>
            <li>Social media template previews</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
