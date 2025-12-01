"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUpload } from "@/components/FileUpload";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("beautify-screenshot")!;
const similarTools = getToolsByCategory("image").filter(t => t.slug !== "beautify-screenshot");

interface BeautifyOptions {
  background: string;
  padding: number;
  borderRadius: number;
  shadow: boolean;
  shadowIntensity: number;
}

const gradients = [
  { name: "Purple Blue", value: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" },
  { name: "Orange Pink", value: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" },
  { name: "Green Blue", value: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)" },
  { name: "Yellow Orange", value: "linear-gradient(135deg, #f5af19 0%, #f12711 100%)" },
  { name: "Teal", value: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)" },
  { name: "Dark", value: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)" },
  { name: "Light", value: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" },
  { name: "Rainbow", value: "linear-gradient(135deg, #ff0844 0%, #ffb199 100%)" },
];

export default function BeautifyScreenshotPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  
  const [options, setOptions] = useState<BeautifyOptions>({
    background: gradients[0].value,
    padding: 64,
    borderRadius: 12,
    shadow: true,
    shadowIntensity: 30,
  });

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  const handleFileSelect = (file: File) => {
    setImageFile(file);
  };

  const generateImage = useCallback(async () => {
    if (!imageUrl || !canvasRef.current) return null;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    return new Promise<string>((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => {
        const padding = options.padding;
        const canvasWidth = img.width + padding * 2;
        const canvasHeight = img.height + padding * 2;

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        // Draw gradient background
        if (options.background.includes("gradient")) {
          const gradient = ctx.createLinearGradient(0, 0, canvasWidth, canvasHeight);
          // Parse gradient colors from CSS
          const colors = options.background.match(/#[a-fA-F0-9]{6}/g) || ["#667eea", "#764ba2"];
          gradient.addColorStop(0, colors[0]);
          gradient.addColorStop(1, colors[1] || colors[0]);
          ctx.fillStyle = gradient;
        } else {
          ctx.fillStyle = options.background;
        }
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Draw shadow
        if (options.shadow) {
          ctx.shadowColor = `rgba(0, 0, 0, ${options.shadowIntensity / 100})`;
          ctx.shadowBlur = 40;
          ctx.shadowOffsetX = 0;
          ctx.shadowOffsetY = 20;
        }

        // Draw rounded rectangle for image
        const x = padding;
        const y = padding;
        const width = img.width;
        const height = img.height;
        const radius = options.borderRadius;

        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
        ctx.clip();

        // Reset shadow for image
        ctx.shadowColor = "transparent";
        ctx.shadowBlur = 0;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;

        // Draw image
        ctx.drawImage(img, padding, padding);

        resolve(canvas.toDataURL("image/png"));
      };
      img.onerror = reject;
      img.src = imageUrl;
    });
  }, [imageUrl, options]);

  const handleDownload = async () => {
    setLoading(true);
    const startTime = Date.now();

    try {
      const dataUrl = await generateImage();
      if (!dataUrl) return;

      // Create download link
      const link = document.createElement("a");
      link.download = "beautified-screenshot.png";
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      await logToolUsage({
        toolName: tool.name,
        toolCategory: tool.category,
        inputType: "file",
        rawInput: imageFile?.name || "image",
        outputResult: "PNG image generated",
        processingDuration: Date.now() - startTime,
        metadata: options,
      });
    } catch (error) {
      console.error("Error generating image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <FileUpload
          onFileSelect={handleFileSelect}
          accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
          label="Upload Screenshot"
          helperText="PNG, JPG, or WebP up to 10MB"
        />

        {imageUrl && (
          <>
            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Background Selection */}
              <div>
                <label className="block text-sm font-medium mb-2">Background</label>
                <div className="grid grid-cols-4 gap-2">
                  {gradients.map((gradient) => (
                    <button
                      key={gradient.name}
                      onClick={() => setOptions((prev) => ({ ...prev, background: gradient.value }))}
                      className={`w-full aspect-square rounded-lg border-2 transition-all ${
                        options.background === gradient.value
                          ? "border-[var(--primary)] scale-105"
                          : "border-transparent hover:border-[var(--border)]"
                      }`}
                      style={{ background: gradient.value }}
                      title={gradient.name}
                    />
                  ))}
                </div>
              </div>

              {/* Sliders */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Padding: {options.padding}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="128"
                    value={options.padding}
                    onChange={(e) => setOptions((prev) => ({ ...prev, padding: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Border Radius: {options.borderRadius}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="32"
                    value={options.borderRadius}
                    onChange={(e) => setOptions((prev) => ({ ...prev, borderRadius: parseInt(e.target.value) }))}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={options.shadow}
                      onChange={(e) => setOptions((prev) => ({ ...prev, shadow: e.target.checked }))}
                      className="w-4 h-4 rounded"
                    />
                    <span className="text-sm">Shadow</span>
                  </label>

                  {options.shadow && (
                    <div className="flex-1">
                      <input
                        type="range"
                        min="10"
                        max="60"
                        value={options.shadowIntensity}
                        onChange={(e) => setOptions((prev) => ({ ...prev, shadowIntensity: parseInt(e.target.value) }))}
                        className="w-full"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Preview */}
            <div
              ref={previewRef}
              className="rounded-xl overflow-hidden"
              style={{ background: options.background }}
            >
              <div style={{ padding: options.padding / 2 }}>
                <img
                  src={imageUrl}
                  alt="Preview"
                  className="max-w-full h-auto mx-auto"
                  style={{
                    borderRadius: options.borderRadius,
                    boxShadow: options.shadow
                      ? `0 20px 40px rgba(0, 0, 0, ${options.shadowIntensity / 100})`
                      : "none",
                  }}
                />
              </div>
            </div>

            {/* Hidden canvas for export */}
            <canvas ref={canvasRef} className="hidden" />

            <button
              onClick={handleDownload}
              disabled={loading}
              className="btn btn-primary w-full py-3"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="spinner" />
                  Generating...
                </span>
              ) : (
                "Download PNG"
              )}
            </button>
          </>
        )}
      </div>
    </ToolLayout>
  );
}
