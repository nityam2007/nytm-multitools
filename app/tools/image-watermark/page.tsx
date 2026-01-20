// Image Watermark Tool | TypeScript
"use client";

import { useState, useRef, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("image-watermark")!;
const similarTools = getToolsByCategory("image").filter(t => t.slug !== "image-watermark");

type WatermarkType = "text" | "image";
type Position = "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "tile";

interface WatermarkSettings {
  type: WatermarkType;
  text: string;
  fontSize: number;
  fontFamily: string;
  color: string;
  opacity: number;
  rotation: number;
  position: Position;
  padding: number;
}

const defaultSettings: WatermarkSettings = {
  type: "text",
  text: "WATERMARK",
  fontSize: 48,
  fontFamily: "Arial",
  color: "#000000",
  opacity: 30,
  rotation: -30,
  position: "center",
  padding: 20,
};

const fonts = ["Arial", "Helvetica", "Times New Roman", "Georgia", "Courier New", "Verdana"];
const positions: { value: Position; label: string }[] = [
  { value: "center", label: "Center" },
  { value: "top-left", label: "Top Left" },
  { value: "top-right", label: "Top Right" },
  { value: "bottom-left", label: "Bottom Left" },
  { value: "bottom-right", label: "Bottom Right" },
  { value: "tile", label: "Tile (Repeat)" },
];

export default function ImageWatermarkPage() {
  const [image, setImage] = useState<string | null>(null);
  const [watermarkImage, setWatermarkImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [settings, setSettings] = useState<WatermarkSettings>(defaultSettings);
  const [processing, setProcessing] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLCanvasElement>(null);

  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name.replace(/\.[^/.]+$/, ""));
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  const handleWatermarkImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setWatermarkImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }, []);

  const drawWatermark = useCallback((ctx: CanvasRenderingContext2D, width: number, height: number, wmImg?: HTMLImageElement) => {
    const { type, text, fontSize, fontFamily, color, opacity, rotation, position, padding } = settings;
    
    ctx.globalAlpha = opacity / 100;
    
    const drawSingleWatermark = (x: number, y: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((rotation * Math.PI) / 180);
      
      if (type === "text") {
        ctx.font = `bold ${fontSize}px ${fontFamily}`;
        ctx.fillStyle = color;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(text, 0, 0);
      } else if (type === "image" && wmImg) {
        const scale = fontSize / 48;
        const wmWidth = wmImg.width * scale;
        const wmHeight = wmImg.height * scale;
        ctx.drawImage(wmImg, -wmWidth / 2, -wmHeight / 2, wmWidth, wmHeight);
      }
      
      ctx.restore();
    };

    if (position === "tile") {
      const spacing = fontSize * 3;
      for (let y = padding; y < height; y += spacing) {
        for (let x = padding; x < width; x += spacing) {
          drawSingleWatermark(x, y);
        }
      }
    } else {
      let x = width / 2;
      let y = height / 2;
      
      switch (position) {
        case "top-left":
          x = padding + fontSize;
          y = padding + fontSize / 2;
          break;
        case "top-right":
          x = width - padding - fontSize;
          y = padding + fontSize / 2;
          break;
        case "bottom-left":
          x = padding + fontSize;
          y = height - padding - fontSize / 2;
          break;
        case "bottom-right":
          x = width - padding - fontSize;
          y = height - padding - fontSize / 2;
          break;
      }
      
      drawSingleWatermark(x, y);
    }
    
    ctx.globalAlpha = 1;
  }, [settings]);

  const processImage = useCallback(async () => {
    if (!image || !canvasRef.current) return;
    
    setProcessing(true);
    
    try {
      const img = new Image();
      img.src = image;
      await new Promise(resolve => img.onload = resolve);
      
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d")!;
      
      canvas.width = img.width;
      canvas.height = img.height;
      
      ctx.drawImage(img, 0, 0);
      
      if (settings.type === "image" && watermarkImage) {
        const wmImg = new Image();
        wmImg.src = watermarkImage;
        await new Promise(resolve => wmImg.onload = resolve);
        drawWatermark(ctx, img.width, img.height, wmImg);
      } else {
        drawWatermark(ctx, img.width, img.height);
      }
      
      const link = document.createElement("a");
      link.download = `${fileName || "image"}_watermarked.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } finally {
      setProcessing(false);
    }
  }, [image, watermarkImage, settings, fileName, drawWatermark]);

  const updateSetting = <K extends keyof WatermarkSettings>(key: K, value: WatermarkSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Upload Section */}
        <div className="grid md:grid-cols-2 gap-4">
          {/* Main Image Upload */}
          <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-6 text-center hover:border-violet-500/50 transition-colors">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <label htmlFor="image-upload" className="cursor-pointer block">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-violet-500/10 flex items-center justify-center">
                <svg className="w-6 h-6 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
              </div>
              <p className="font-medium mb-1">Upload Image</p>
              <p className="text-xs text-[var(--muted-foreground)]">PNG, JPG, WebP</p>
            </label>
          </div>

          {/* Watermark Image Upload (only shown when type is image) */}
          {settings.type === "image" && (
            <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-6 text-center hover:border-violet-500/50 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleWatermarkImageUpload}
                className="hidden"
                id="watermark-upload"
              />
              <label htmlFor="watermark-upload" className="cursor-pointer block">
                <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                </div>
                <p className="font-medium mb-1">Upload Watermark</p>
                <p className="text-xs text-[var(--muted-foreground)]">Logo or stamp image</p>
              </label>
            </div>
          )}
        </div>

        {/* Preview */}
        {image && (
          <div className="relative rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--muted)]">
            <img
              src={image}
              alt="Preview"
              className="max-h-96 mx-auto"
              style={{ opacity: 0.9 }}
            />
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span
                className="font-bold select-none"
                style={{
                  fontSize: `${Math.min(settings.fontSize, 60)}px`,
                  fontFamily: settings.fontFamily,
                  color: settings.color,
                  opacity: settings.opacity / 100,
                  transform: `rotate(${settings.rotation}deg)`,
                }}
              >
                {settings.type === "text" ? settings.text : (watermarkImage ? "🖼️" : "Upload watermark")}
              </span>
            </div>
          </div>
        )}

        {/* Settings */}
        <div className="p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] space-y-5">
          <h3 className="font-semibold">Watermark Settings</h3>

          {/* Type Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => updateSetting("type", "text")}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                settings.type === "text" ? "bg-violet-500 text-white" : "bg-[var(--muted)]"
              }`}
            >
              Text Watermark
            </button>
            <button
              onClick={() => updateSetting("type", "image")}
              className={`flex-1 py-2 rounded-lg font-medium transition-all ${
                settings.type === "image" ? "bg-violet-500 text-white" : "bg-[var(--muted)]"
              }`}
            >
              Image Watermark
            </button>
          </div>

          {/* Text Settings */}
          {settings.type === "text" && (
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-[var(--muted-foreground)]">Watermark Text</label>
                <input
                  type="text"
                  value={settings.text}
                  onChange={(e) => updateSetting("text", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--muted)] border border-[var(--border)] focus:border-violet-500/50 focus:outline-none"
                  placeholder="Enter watermark text"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[var(--muted-foreground)]">Font</label>
                <select
                  value={settings.fontFamily}
                  onChange={(e) => updateSetting("fontFamily", e.target.value)}
                  className="w-full px-3 py-2 rounded-lg bg-[var(--muted)] border border-[var(--border)] focus:border-violet-500/50 focus:outline-none"
                >
                  {fonts.map(f => <option key={f} value={f}>{f}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[var(--muted-foreground)]">Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={settings.color}
                    onChange={(e) => updateSetting("color", e.target.value)}
                    className="w-12 h-10 rounded border-0 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={settings.color}
                    onChange={(e) => updateSetting("color", e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-[var(--muted)] border border-[var(--border)] focus:border-violet-500/50 focus:outline-none font-mono text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Common Settings */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-[var(--muted-foreground)]">Size: {settings.fontSize}px</label>
              <input
                type="range"
                min="12"
                max="200"
                value={settings.fontSize}
                onChange={(e) => updateSetting("fontSize", parseInt(e.target.value))}
                className="w-full accent-violet-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-[var(--muted-foreground)]">Opacity: {settings.opacity}%</label>
              <input
                type="range"
                min="5"
                max="100"
                value={settings.opacity}
                onChange={(e) => updateSetting("opacity", parseInt(e.target.value))}
                className="w-full accent-violet-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-[var(--muted-foreground)]">Rotation: {settings.rotation}°</label>
              <input
                type="range"
                min="-180"
                max="180"
                value={settings.rotation}
                onChange={(e) => updateSetting("rotation", parseInt(e.target.value))}
                className="w-full accent-violet-500"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-[var(--muted-foreground)]">Position</label>
              <select
                value={settings.position}
                onChange={(e) => updateSetting("position", e.target.value as Position)}
                className="w-full px-3 py-2 rounded-lg bg-[var(--muted)] border border-[var(--border)] focus:border-violet-500/50 focus:outline-none"
              >
                {positions.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Download Button */}
        <button
          onClick={processImage}
          disabled={!image || processing || (settings.type === "image" && !watermarkImage)}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Processing...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Download Watermarked Image
            </>
          )}
        </button>

        <canvas ref={canvasRef} className="hidden" />
        <canvas ref={previewRef} className="hidden" />

        {/* Info */}
        <div className="p-4 rounded-xl bg-[var(--muted)] text-sm text-[var(--muted-foreground)]">
          <p className="flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            All processing happens in your browser. Images never leave your device.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
