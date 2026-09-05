// PNG to JPG Converter | TypeScript
"use client";

import { FilePicker } from "@/components/FilePicker";
import { useState, useRef, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("png-to-jpg")!;
const similarTools = getToolsByCategory("converter").filter(t => t.slug !== "png-to-jpg");

export default function PNGToJPGPage() {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [quality, setQuality] = useState(90);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [originalSize, setOriginalSize] = useState(0);
  const [convertedSize, setConvertedSize] = useState(0);
  const [converting, setConverting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.includes("png")) {
      alert("Please select a PNG file");
      return;
    }

    setFileName(file.name.replace(/\.[^/.]+$/, ""));
    setOriginalSize(file.size);
    setConvertedSize(0);

    const reader = new FileReader();
    reader.onload = (event) => setImage(event.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const convert = useCallback(() => {
    if (!image || !canvasRef.current) return;
    setConverting(true);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;

      canvas.width = img.width;
      canvas.height = img.height;

      // Fill background (JPG doesn't support transparency)
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          setConvertedSize(blob.size);

          const link = document.createElement("a");
          link.download = `${fileName}.jpg`;
          link.href = URL.createObjectURL(blob);
          link.click();
          URL.revokeObjectURL(link.href);
          setConverting(false);
        },
        "image/jpeg",
        quality / 100
      );
    };
    img.src = image;
  }, [image, quality, fileName, bgColor]);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="max-w-xl mx-auto space-y-6">
        {/* Upload */}
        <FilePicker label="Select an image"
        accept="image/png"
        onChange={handleFileUpload}
        id="file-upload"
      />

        {image && (
          <>
            {/* Preview */}
            <div className="rounded-xl overflow-hidden border border-[var(--border)]">
              <img src={image} alt="Preview" className="w-full max-h-64 object-contain bg-[var(--muted)]" />
            </div>

            {/* Quality Slider */}
            <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)]">
              <div className="flex justify-between mb-2">
                <span className="font-medium">Quality</span>
                <span className="font-bold text-amber-500">{quality}%</span>
              </div>
              <input aria-label="JPEG quality percentage"
                type="range"
                value={quality}
                onChange={(e) => setQuality(parseInt(e.target.value))}
                min="10"
                max="100"
                className="w-full h-2 bg-[var(--muted)] rounded-lg appearance-none cursor-pointer accent-amber-500"
              />
            </div>

            {/* Background Color */}
            <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)]">
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium">Background Color</span>
                  <p className="text-xs text-[var(--muted-foreground)]">Replaces transparency</p>
                </div>
                <div className="flex items-center gap-2">
                  <input aria-label="Choose background color"
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0"
                  />
                  <div className="flex gap-1">
                    {["#ffffff", "#000000", "#f0f0f0"].map(color => (
                      <button
                        key={color}
                        onClick={() => setBgColor(color)}
                        className={`w-8 h-8 rounded border-2 ${bgColor === color ? "border-amber-500" : "border-[var(--border)]"}`}
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            {convertedSize > 0 && (
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[var(--muted)]">
                <div className="text-center">
                  <div className="text-xs text-[var(--muted-foreground)]">Original PNG</div>
                  <div className="font-bold">{formatSize(originalSize)}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-[var(--muted-foreground)]">Converted JPG</div>
                  <div className="font-bold">{formatSize(convertedSize)}</div>
                </div>
              </div>
            )}

            {/* Convert Button */}
            <button
              onClick={convert}
              disabled={converting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
            >
              {converting ? (
                <>
                  <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Converting...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Convert to JPG
                </>
              )}
            </button>
          </>
        )}

        <canvas ref={canvasRef} className="hidden" />

        <div className="p-4 rounded-xl bg-[var(--muted)] text-sm text-[var(--muted-foreground)]">
          <p>JPG is ideal for photos. Note: Transparency will be replaced with the background color you choose.</p>
        </div>
      </div>
    </ToolLayout>
  );
}
