"use client";

import { useState, useRef, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("image-rotate")!;
const similarTools = getToolsByCategory("image").filter(t => t.slug !== "image-rotate");

export default function ImageRotatePage() {
  const [image, setImage] = useState<string | null>(null);
  const [rotatedImage, setRotatedImage] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [fileName, setFileName] = useState("");
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      setImage(dataUrl);
      
      const img = new Image();
      img.onload = () => {
        setOriginalSize({ width: img.width, height: img.height });
        setRotation(0);
        rotateImage(dataUrl, 0);
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  }, []);

  const rotateImage = useCallback((imageSrc: string, degrees: number) => {
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const radians = (degrees * Math.PI) / 180;
      const sin = Math.abs(Math.sin(radians));
      const cos = Math.abs(Math.cos(radians));

      // Calculate new dimensions
      const newWidth = Math.round(img.width * cos + img.height * sin);
      const newHeight = Math.round(img.width * sin + img.height * cos);

      canvas.width = newWidth;
      canvas.height = newHeight;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      // Clear and set background
      ctx.fillStyle = "transparent";
      ctx.fillRect(0, 0, newWidth, newHeight);

      // Translate to center, rotate, and draw
      ctx.translate(newWidth / 2, newHeight / 2);
      ctx.rotate(radians);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      setRotatedImage(canvas.toDataURL("image/png"));
    };
    img.src = imageSrc;
  }, []);

  const handleRotate = (degrees: number) => {
    if (!image) return;
    const newRotation = (rotation + degrees + 360) % 360;
    setRotation(newRotation);
    rotateImage(image, newRotation);
  };

  const handleCustomRotation = (degrees: number) => {
    if (!image) return;
    setRotation(degrees);
    rotateImage(image, degrees);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDownload = () => {
    if (!rotatedImage) return;
    const link = document.createElement("a");
    const ext = fileName.split(".").pop() || "png";
    link.download = `${fileName.replace(/\.[^/.]+$/, "")}_rotated_${rotation}deg.${ext}`;
    link.href = rotatedImage;
    link.click();
  };

  const handleReset = () => {
    setImage(null);
    setRotatedImage(null);
    setRotation(0);
    setFileName("");
    setOriginalSize({ width: 0, height: 0 });
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const presetRotations = [
    { label: "90° CW", degrees: 90, icon: "↻" },
    { label: "90° CCW", degrees: -90, icon: "↺" },
    { label: "180°", degrees: 180, icon: "⟲" },
    { label: "Flip H", degrees: 0, special: "flipH", icon: "↔" },
    { label: "Flip V", degrees: 0, special: "flipV", icon: "↕" },
  ];

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        {/* Upload Area */}
        {!image ? (
          <div
            onDrop={handleDrop}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-colors ${
              isDragging
                ? "border-[var(--primary)] bg-[var(--primary)]/10"
                : "border-[var(--border)] hover:border-[var(--primary)]"
            }`}
          >
            <div className="flex justify-center mb-4">
              <svg className="w-14 h-14 text-[var(--muted-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </div>
            <p className="text-lg font-medium mb-2">Drop an image here or click to upload</p>
            <p className="text-sm text-[var(--muted-foreground)]">
              Supports JPG, PNG, GIF, WebP, SVG
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              className="hidden"
            />
          </div>
        ) : (
          <>
            {/* Controls */}
            <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-4">
              <div className="flex flex-wrap items-center gap-4">
                {/* Quick Rotation Buttons */}
                <div className="flex gap-2">
                  {presetRotations.slice(0, 3).map((preset) => (
                    <button
                      key={preset.label}
                      onClick={() => handleRotate(preset.degrees)}
                      className="px-4 py-2 rounded-lg bg-[var(--muted)] hover:bg-[var(--accent)] transition-colors flex items-center gap-2"
                    >
                      <span>{preset.icon}</span>
                      <span className="hidden sm:inline">{preset.label}</span>
                    </button>
                  ))}
                </div>

                {/* Custom Rotation Slider */}
                <div className="flex-1 min-w-[200px]">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[var(--muted-foreground)]">Custom:</span>
                    <input
                      type="range"
                      min="0"
                      max="359"
                      value={rotation}
                      onChange={(e) => handleCustomRotation(parseInt(e.target.value))}
                      className="flex-1"
                    />
                    <span className="text-sm font-mono w-12 text-right">{rotation}°</span>
                  </div>
                </div>

                {/* Number Input */}
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="359"
                    value={rotation}
                    onChange={(e) => handleCustomRotation(parseInt(e.target.value) || 0)}
                    className="w-20 px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] text-center"
                  />
                  <span className="text-sm text-[var(--muted-foreground)]">degrees</span>
                </div>
              </div>

              {/* Info */}
              <div className="mt-4 pt-4 border-t border-[var(--border)] flex flex-wrap gap-4 text-sm text-[var(--muted-foreground)]">
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
                  </svg>
                  {fileName}
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                  </svg>
                  Original: {originalSize.width} × {originalSize.height}px
                </span>
                <span className="flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  Rotation: {rotation}°
                </span>
              </div>
            </div>

            {/* Preview Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Original */}
              <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
                  </svg>
                  Original
                </h3>
                <div className="bg-[var(--muted)] rounded-lg p-4 flex items-center justify-center min-h-[300px]"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Crect width='10' height='10' fill='%23ccc'/%3E%3Crect x='10' y='10' width='10' height='10' fill='%23ccc'/%3E%3C/svg%3E\")" }}
                >
                  <img
                    src={image}
                    alt="Original"
                    className="max-w-full max-h-[400px] object-contain"
                  />
                </div>
              </div>

              {/* Rotated */}
              <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
                  </svg>
                  Rotated ({rotation}°)
                </h3>
                <div className="bg-[var(--muted)] rounded-lg p-4 flex items-center justify-center min-h-[300px]"
                  style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Crect width='10' height='10' fill='%23ccc'/%3E%3Crect x='10' y='10' width='10' height='10' fill='%23ccc'/%3E%3C/svg%3E\")" }}
                >
                  {rotatedImage && (
                    <img
                      src={rotatedImage}
                      alt="Rotated"
                      className="max-w-full max-h-[400px] object-contain"
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Hidden Canvas */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-3">
              <button
                onClick={handleDownload}
                disabled={!rotatedImage}
                className="btn btn-primary flex-1 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
                Download Rotated Image
              </button>
              <button
                onClick={() => { setRotation(0); if (image) rotateImage(image, 0); }}
                className="btn btn-secondary flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                </svg>
                Reset Rotation
              </button>
              <button
                onClick={handleReset}
                className="btn btn-secondary flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                </svg>
                Clear
              </button>
            </div>

            {/* Preset Angles */}
            <div className="bg-[var(--muted)] rounded-xl p-4">
              <h3 className="font-medium mb-3">Quick Angles</h3>
              <div className="flex flex-wrap gap-2">
                {[0, 15, 30, 45, 60, 90, 120, 135, 150, 180, 210, 225, 240, 270, 300, 315, 330].map((deg) => (
                  <button
                    key={deg}
                    onClick={() => handleCustomRotation(deg)}
                    className={`px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      rotation === deg
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                        : "bg-[var(--background)] hover:bg-[var(--accent)]"
                    }`}
                  >
                    {deg}°
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
