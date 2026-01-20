// PDF Watermark Tool | TypeScript
"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUpload } from "@/components/FileUpload";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("pdf-watermark")!;
const similarTools = getToolsByCategory("converter").filter(t => t.slug !== "pdf-watermark");

type Position = "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "diagonal";

interface WatermarkSettings {
  text: string;
  fontSize: number;
  opacity: number;
  rotation: number;
  position: Position;
  color: { r: number; g: number; b: number };
}

const defaultSettings: WatermarkSettings = {
  text: "CONFIDENTIAL",
  fontSize: 60,
  opacity: 0.3,
  rotation: -45,
  position: "center",
  color: { r: 128, g: 128, b: 128 },
};

const positions: { value: Position; label: string }[] = [
  { value: "center", label: "Center" },
  { value: "diagonal", label: "Diagonal (Tile)" },
  { value: "top-left", label: "Top Left" },
  { value: "top-right", label: "Top Right" },
  { value: "bottom-left", label: "Bottom Left" },
  { value: "bottom-right", label: "Bottom Right" },
];

const presetTexts = ["CONFIDENTIAL", "DRAFT", "SAMPLE", "COPY", "DO NOT COPY", "APPROVED"];

export default function PDFWatermarkPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState<WatermarkSettings>(defaultSettings);

  const handleFileUpload = useCallback(async (uploadedFile: File) => {
    if (uploadedFile.type !== "application/pdf") {
      setError("Please select a PDF file");
      return;
    }

    setFile(uploadedFile);
    setError("");

    try {
      const { PDFDocument } = await import("pdf-lib");
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      setPageCount(pdfDoc.getPageCount());
    } catch (err) {
      setError("Failed to read PDF file");
    }
  }, []);

  const addWatermark = async () => {
    if (!file) {
      setError("Please upload a PDF file");
      return;
    }

    if (!settings.text.trim()) {
      setError("Please enter watermark text");
      return;
    }

    setProcessing(true);
    setError("");

    try {
      const { PDFDocument, rgb, degrees, StandardFonts } = await import("pdf-lib");
      
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
      const pages = pdfDoc.getPages();

      const { text, fontSize, opacity, rotation, position, color } = settings;
      const textWidth = font.widthOfTextAtSize(text, fontSize);
      const textHeight = fontSize;

      for (const page of pages) {
        const { width, height } = page.getSize();

        if (position === "diagonal") {
          // Tile diagonal watermarks
          const spacing = Math.max(textWidth, textHeight) * 2;
          for (let y = -height; y < height * 2; y += spacing) {
            for (let x = -width; x < width * 2; x += spacing) {
              page.drawText(text, {
                x: x,
                y: y,
                size: fontSize,
                font: font,
                color: rgb(color.r / 255, color.g / 255, color.b / 255),
                opacity: opacity,
                rotate: degrees(rotation),
              });
            }
          }
        } else {
          let x = (width - textWidth) / 2;
          let y = (height - textHeight) / 2;

          switch (position) {
            case "top-left":
              x = 50;
              y = height - 50 - textHeight;
              break;
            case "top-right":
              x = width - textWidth - 50;
              y = height - 50 - textHeight;
              break;
            case "bottom-left":
              x = 50;
              y = 50;
              break;
            case "bottom-right":
              x = width - textWidth - 50;
              y = 50;
              break;
            case "center":
            default:
              // Already centered
              break;
          }

          page.drawText(text, {
            x: x,
            y: y,
            size: fontSize,
            font: font,
            color: rgb(color.r / 255, color.g / 255, color.b / 255),
            opacity: opacity,
            rotate: degrees(rotation),
          });
        }
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = file.name.replace(/\.pdf$/i, "_watermarked.pdf");
      link.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to add watermark");
    } finally {
      setProcessing(false);
    }
  };

  const updateSetting = <K extends keyof WatermarkSettings>(key: K, value: WatermarkSettings[K]) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 128, g: 128, b: 128 };
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Upload Section */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4">Upload PDF</h3>
          <FileUpload
            accept={{ "application/pdf": [".pdf"] }}
            onFileSelect={handleFileUpload}
            label="Drop PDF here or click to browse"
          />
          {file && (
            <div className="mt-4 p-3 rounded-lg bg-[var(--muted)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
                </svg>
                <div>
                  <p className="font-medium text-sm">{file.name}</p>
                  <p className="text-xs text-[var(--muted-foreground)]">{pageCount} page{pageCount !== 1 ? "s" : ""}</p>
                </div>
              </div>
              <button
                onClick={() => { setFile(null); setPageCount(0); }}
                className="p-2 hover:bg-red-500/10 rounded-lg transition-colors"
              >
                <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
        </div>

        {/* Settings */}
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6 space-y-5">
          <h3 className="text-sm font-semibold">Watermark Settings</h3>

          {/* Preset Texts */}
          <div className="space-y-2">
            <label className="text-sm text-[var(--muted-foreground)]">Quick Presets</label>
            <div className="flex flex-wrap gap-2">
              {presetTexts.map(preset => (
                <button
                  key={preset}
                  onClick={() => updateSetting("text", preset)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    settings.text === preset ? "bg-violet-500 text-white" : "bg-[var(--muted)] hover:bg-violet-500/20"
                  }`}
                >
                  {preset}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Text */}
          <div className="space-y-2">
            <label className="text-sm text-[var(--muted-foreground)]">Custom Text</label>
            <input
              type="text"
              value={settings.text}
              onChange={(e) => updateSetting("text", e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-[var(--muted)] border border-[var(--border)] focus:border-violet-500/50 focus:outline-none"
              placeholder="Enter watermark text"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Font Size */}
            <div className="space-y-2">
              <label className="text-sm text-[var(--muted-foreground)]">Font Size: {settings.fontSize}px</label>
              <input
                type="range"
                min="20"
                max="150"
                value={settings.fontSize}
                onChange={(e) => updateSetting("fontSize", parseInt(e.target.value))}
                className="w-full accent-violet-500"
              />
            </div>

            {/* Opacity */}
            <div className="space-y-2">
              <label className="text-sm text-[var(--muted-foreground)]">Opacity: {Math.round(settings.opacity * 100)}%</label>
              <input
                type="range"
                min="5"
                max="100"
                value={settings.opacity * 100}
                onChange={(e) => updateSetting("opacity", parseInt(e.target.value) / 100)}
                className="w-full accent-violet-500"
              />
            </div>

            {/* Rotation */}
            <div className="space-y-2">
              <label className="text-sm text-[var(--muted-foreground)]">Rotation: {settings.rotation}°</label>
              <input
                type="range"
                min="-90"
                max="90"
                value={settings.rotation}
                onChange={(e) => updateSetting("rotation", parseInt(e.target.value))}
                className="w-full accent-violet-500"
              />
            </div>

            {/* Color */}
            <div className="space-y-2">
              <label className="text-sm text-[var(--muted-foreground)]">Color</label>
              <div className="flex gap-2">
                <input
                  type="color"
                  value={rgbToHex(settings.color.r, settings.color.g, settings.color.b)}
                  onChange={(e) => updateSetting("color", hexToRgb(e.target.value))}
                  className="w-12 h-10 rounded border-0 cursor-pointer"
                />
                <input
                  type="text"
                  value={rgbToHex(settings.color.r, settings.color.g, settings.color.b)}
                  onChange={(e) => updateSetting("color", hexToRgb(e.target.value))}
                  className="flex-1 px-3 py-2 rounded-lg bg-[var(--muted)] border border-[var(--border)] focus:border-violet-500/50 focus:outline-none font-mono text-sm"
                />
              </div>
            </div>
          </div>

          {/* Position */}
          <div className="space-y-2">
            <label className="text-sm text-[var(--muted-foreground)]">Position</label>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {positions.map(p => (
                <button
                  key={p.value}
                  onClick={() => updateSetting("position", p.value)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all ${
                    settings.position === p.value ? "bg-violet-500 text-white" : "bg-[var(--muted)] hover:bg-violet-500/20"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
            {error}
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={addWatermark}
          disabled={!file || processing}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {processing ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Adding Watermark...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Add Watermark & Download
            </>
          )}
        </button>

        {/* Info */}
        <div className="p-4 rounded-xl bg-[var(--muted)] text-sm text-[var(--muted-foreground)]">
          <p className="flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            All processing happens in your browser. Files never leave your device.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
