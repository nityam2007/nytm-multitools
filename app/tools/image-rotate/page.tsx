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
            <div className="text-5xl mb-4">🔄</div>
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
                <span>📁 {fileName}</span>
                <span>📐 Original: {originalSize.width} × {originalSize.height}px</span>
                <span>🔄 Rotation: {rotation}°</span>
              </div>
            </div>

            {/* Preview Grid */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Original */}
              <div className="bg-[var(--card)] rounded-xl border border-[var(--border)] p-4">
                <h3 className="font-medium mb-3 flex items-center gap-2">
                  <span>📷</span> Original
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
                  <span>🔄</span> Rotated ({rotation}°)
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
                className="btn btn-primary flex-1"
              >
                ⬇️ Download Rotated Image
              </button>
              <button
                onClick={() => { setRotation(0); if (image) rotateImage(image, 0); }}
                className="btn btn-secondary"
              >
                ↩️ Reset Rotation
              </button>
              <button
                onClick={handleReset}
                className="btn btn-secondary"
              >
                🗑️ Clear
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
