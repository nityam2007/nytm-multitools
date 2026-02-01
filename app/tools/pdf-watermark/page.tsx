// PDF Watermark Tool | TypeScript
"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUpload } from "@/components/FileUpload";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("pdf-watermark")!;
const similarTools = getToolsByCategory("converter").filter(t => t.slug !== "pdf-watermark");

type WatermarkType = "text" | "image";
type Position = "center" | "top-left" | "top-right" | "bottom-left" | "bottom-right" | "diagonal";
type FontFamily = "HelveticaBold" | "Helvetica" | "Courier" | "CourierBold" | "TimesRoman" | "TimesRomanBold";

interface WatermarkSettings {
  type: WatermarkType;
  text: string;
  fontSize: number;
  fontFamily: FontFamily;
  opacity: number;
  rotation: number;
  position: Position;
  padding: number;
  color: { r: number; g: number; b: number };
}

const defaultSettings: WatermarkSettings = {
  type: "text",
  text: "CONFIDENTIAL",
  fontSize: 60,
  fontFamily: "HelveticaBold",
  opacity: 0.3,
  rotation: -45,
  position: "center",
  padding: 50,
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

const fonts: { value: FontFamily; label: string }[] = [
  { value: "HelveticaBold", label: "Helvetica Bold" },
  { value: "Helvetica", label: "Helvetica" },
  { value: "CourierBold", label: "Courier Bold" },
  { value: "Courier", label: "Courier" },
  { value: "TimesRomanBold", label: "Times Bold" },
  { value: "TimesRoman", label: "Times Roman" },
];

const presetTexts = ["CONFIDENTIAL", "DRAFT", "SAMPLE", "COPY", "DO NOT COPY", "APPROVED"];

export default function PDFWatermarkPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState<WatermarkSettings>(defaultSettings);
  const [watermarkImage, setWatermarkImage] = useState<ArrayBuffer | null>(null);
  const [watermarkImageName, setWatermarkImageName] = useState("");

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
    } catch {
      setError("Failed to read PDF file");
    }
  }, []);

  const handleWatermarkImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = e.target.files?.[0];
    if (!uploadedFile) return;
    
    if (!uploadedFile.type.startsWith("image/")) {
      setError("Please select an image file (PNG, JPG)");
      return;
    }

    setWatermarkImageName(uploadedFile.name);
    const reader = new FileReader();
    reader.onload = () => {
      setWatermarkImage(reader.result as ArrayBuffer);
    };
    reader.readAsArrayBuffer(uploadedFile);
    e.target.value = "";
  }, []);

  const addWatermark = async () => {
    if (!file) {
      setError("Please upload a PDF file");
      return;
    }

    if (settings.type === "text" && !settings.text.trim()) {
      setError("Please enter watermark text");
      return;
    }

    if (settings.type === "image" && !watermarkImage) {
      setError("Please upload a watermark image");
      return;
    }

    setProcessing(true);
    setError("");

    try {
      const { PDFDocument, rgb, degrees, StandardFonts } = await import("pdf-lib");
      
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const pages = pdfDoc.getPages();

      const { type, text, fontSize, fontFamily, opacity, rotation, position, padding, color } = settings;

      if (type === "text") {
        const fontMap: Record<FontFamily, keyof typeof StandardFonts> = {
          HelveticaBold: "HelveticaBold",
          Helvetica: "Helvetica",
          Courier: "Courier",
          CourierBold: "CourierBold",
          TimesRoman: "TimesRoman",
          TimesRomanBold: "TimesRomanBold",
        };
        const font = await pdfDoc.embedFont(StandardFonts[fontMap[fontFamily]]);
        const textWidth = font.widthOfTextAtSize(text, fontSize);
        const textHeight = fontSize;

        for (const page of pages) {
          const { width, height } = page.getSize();

          if (position === "diagonal") {
            const spacing = Math.max(textWidth, textHeight) * 2;
            for (let y = -height; y < height * 2; y += spacing) {
              for (let x = -width; x < width * 2; x += spacing) {
                page.drawText(text, {
                  x,
                  y,
                  size: fontSize,
                  font,
                  color: rgb(color.r / 255, color.g / 255, color.b / 255),
                  opacity,
                  rotate: degrees(rotation),
                });
              }
            }
          } else {
            let x = (width - textWidth) / 2;
            let y = (height - textHeight) / 2;

            switch (position) {
              case "top-left":
                x = padding;
                y = height - padding - textHeight;
                break;
              case "top-right":
                x = width - textWidth - padding;
                y = height - padding - textHeight;
                break;
              case "bottom-left":
                x = padding;
                y = padding;
                break;
              case "bottom-right":
                x = width - textWidth - padding;
                y = padding;
                break;
            }

            page.drawText(text, {
              x,
              y,
              size: fontSize,
              font,
              color: rgb(color.r / 255, color.g / 255, color.b / 255),
              opacity,
              rotate: degrees(rotation),
            });
          }
        }
      } else if (type === "image" && watermarkImage) {
        const imageBytes = new Uint8Array(watermarkImage);
        const isPng = watermarkImageName.toLowerCase().endsWith(".png");
        const embeddedImage = isPng
          ? await pdfDoc.embedPng(imageBytes)
          : await pdfDoc.embedJpg(imageBytes);

        const scale = fontSize / 60;
        const imgWidth = embeddedImage.width * scale;
        const imgHeight = embeddedImage.height * scale;

        for (const page of pages) {
          const { width, height } = page.getSize();

          if (position === "diagonal") {
            const spacing = Math.max(imgWidth, imgHeight) * 2.5;
            for (let y = 0; y < height; y += spacing) {
              for (let x = 0; x < width; x += spacing) {
                page.drawImage(embeddedImage, {
                  x: x - imgWidth / 2,
                  y: y - imgHeight / 2,
                  width: imgWidth,
                  height: imgHeight,
                  opacity,
                  rotate: degrees(rotation),
                });
              }
            }
          } else {
            let x = (width - imgWidth) / 2;
            let y = (height - imgHeight) / 2;

            switch (position) {
              case "top-left":
                x = padding;
                y = height - padding - imgHeight;
                break;
              case "top-right":
                x = width - imgWidth - padding;
                y = height - padding - imgHeight;
                break;
              case "bottom-left":
                x = padding;
                y = padding;
                break;
              case "bottom-right":
                x = width - imgWidth - padding;
                y = padding;
                break;
            }

            page.drawImage(embeddedImage, {
              x,
              y,
              width: imgWidth,
              height: imgHeight,
              opacity,
              rotate: degrees(rotation),
            });
          }
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

          {/* Type Toggle */}
          <div className="flex gap-2">
            <button
              onClick={() => updateSetting("type", "text")}
              className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${
                settings.type === "text" ? "bg-violet-500 text-white" : "bg-[var(--muted)] hover:bg-violet-500/10"
              }`}
            >
              Text Watermark
            </button>
            <button
              onClick={() => updateSetting("type", "image")}
              className={`flex-1 py-2.5 rounded-xl font-medium transition-all ${
                settings.type === "image" ? "bg-violet-500 text-white" : "bg-[var(--muted)] hover:bg-violet-500/10"
              }`}
            >
              Image Watermark
            </button>
          </div>

          {/* Text Watermark Settings */}
          {settings.type === "text" && (
            <>
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

              {/* Font Selection */}
              <div className="space-y-2">
                <label className="text-sm text-[var(--muted-foreground)]">Font Family</label>
                <select
                  value={settings.fontFamily}
                  onChange={(e) => updateSetting("fontFamily", e.target.value as FontFamily)}
                  className="w-full px-4 py-3 rounded-xl bg-[var(--muted)] border border-[var(--border)] focus:border-violet-500/50 focus:outline-none"
                >
                  {fonts.map(f => (
                    <option key={f.value} value={f.value}>{f.label}</option>
                  ))}
                </select>
              </div>
            </>
          )}

          {/* Image Watermark Upload */}
          {settings.type === "image" && (
            <div className="space-y-2">
              <label className="text-sm text-[var(--muted-foreground)]">Watermark Image</label>
              <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-6 text-center hover:border-violet-500/50 transition-colors">
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={handleWatermarkImageUpload}
                  className="hidden"
                  id="watermark-img-upload"
                />
                <label htmlFor="watermark-img-upload" className="cursor-pointer block">
                  <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-orange-500/10 flex items-center justify-center">
                    <svg className="w-6 h-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                    </svg>
                  </div>
                  {watermarkImage ? (
                    <p className="font-medium text-sm text-green-500">{watermarkImageName}</p>
                  ) : (
                    <>
                      <p className="font-medium mb-1">Upload Logo or Stamp</p>
                      <p className="text-xs text-[var(--muted-foreground)]">PNG (with transparency) or JPG</p>
                    </>
                  )}
                </label>
              </div>
              {watermarkImage && (
                <button
                  onClick={() => { setWatermarkImage(null); setWatermarkImageName(""); }}
                  className="text-sm text-red-500 hover:underline"
                >
                  Remove image
                </button>
              )}
            </div>
          )}

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Size */}
            <div className="space-y-2">
              <label className="text-sm text-[var(--muted-foreground)]">
                {settings.type === "text" ? "Font Size" : "Size"}: {settings.fontSize}px
              </label>
              <input
                type="range"
                min="20"
                max="200"
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

            {/* Padding */}
            <div className="space-y-2">
              <label className="text-sm text-[var(--muted-foreground)]">Edge Padding: {settings.padding}px</label>
              <input
                type="range"
                min="10"
                max="200"
                value={settings.padding}
                onChange={(e) => updateSetting("padding", parseInt(e.target.value))}
                className="w-full accent-violet-500"
              />
            </div>

            {/* Color (text only) */}
            {settings.type === "text" && (
              <div className="space-y-2 sm:col-span-2">
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
            )}
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
          disabled={!file || processing || (settings.type === "image" && !watermarkImage)}
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
