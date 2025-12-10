// Image Upscaler Tool | TypeScript
"use client";

import { useState, useCallback, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/Button";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("image-upscaler")!;
const similarTools = getToolsByCategory("image").filter(t => t.slug !== "image-upscaler");

export default function ImageUpscalerPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [upscaling, setUpscaling] = useState(false);
  const [error, setError] = useState("");
  const [scaleFactor, setScaleFactor] = useState<2 | 3 | 4>(2);
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = useCallback((uploadedFile: File) => {
    if (!uploadedFile.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    setFile(uploadedFile);
    setError("");

    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        setOriginalSize({ width: img.width, height: img.height });
        setPreview(e.target?.result as string);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(uploadedFile);
  }, []);

  const upscaleImage = async () => {
    if (!file || !preview) {
      setError("Please upload an image");
      return;
    }

    setUpscaling(true);
    setError("");

    try {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Calculate new dimensions
        const newWidth = img.width * scaleFactor;
        const newHeight = img.height * scaleFactor;

        canvas.width = newWidth;
        canvas.height = newHeight;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Use bicubic interpolation for better quality
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        // Draw upscaled image
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // Convert to blob and download
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              setError("Failed to create upscaled image");
              setUpscaling(false);
              return;
            }

            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = file.name.replace(/\.[^.]+$/, `_upscaled_${scaleFactor}x.png`);
            link.click();

            URL.revokeObjectURL(url);
            setUpscaling(false);
          },
          "image/png",
          1.0
        );
      };

      img.onerror = () => {
        setError("Failed to load image");
        setUpscaling(false);
      };

      img.src = preview;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upscale image");
      setUpscaling(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4">Upload Image</h3>
          <FileUpload
            accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif", ".bmp", ".svg"] }}
            onFileSelect={handleFileUpload}
            label="Choose image file"
          />

          {preview && (
            <div className="mt-4 space-y-3">
              <div className="relative rounded-xl overflow-hidden border border-[var(--border)]">
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-auto max-h-64 object-contain bg-[var(--muted)]"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-[var(--muted)] rounded-xl">
                <div className="text-xs text-[var(--muted-foreground)]">
                  <div className="font-medium mb-1">{file?.name}</div>
                  <div>Original: {originalSize.width} × {originalSize.height}px</div>
                  <div>Size: {file && formatSize(file.size)}</div>
                </div>
                <button
                  onClick={() => {
                    setFile(null);
                    setPreview("");
                  }}
                  className="text-xs text-red-500 hover:text-red-600 px-3 py-1.5 rounded-lg bg-red-500/10"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>

        {file && (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
            <h3 className="text-sm font-semibold mb-4">Upscale Factor</h3>
            <div className="grid grid-cols-3 gap-3">
              {([2, 3, 4] as const).map((factor) => (
                <button
                  key={factor}
                  onClick={() => setScaleFactor(factor)}
                  className={`px-4 py-4 rounded-xl text-sm font-medium transition-all ${
                    scaleFactor === factor
                      ? "bg-violet-500 text-white"
                      : "bg-[var(--muted)] hover:bg-[var(--muted)]/80"
                  }`}
                >
                  <div className="text-lg font-bold mb-1">{factor}×</div>
                  <div className="text-xs opacity-80">
                    {originalSize.width * factor} × {originalSize.height * factor}px
                  </div>
                </button>
              ))}
            </div>
            <p className="text-xs text-[var(--muted-foreground)] mt-3 text-center">
              Output resolution: {originalSize.width * scaleFactor} × {originalSize.height * scaleFactor}px
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        <Button
          onClick={upscaleImage}
          disabled={!file || upscaling}
          className="w-full"
        >
          {upscaling ? "Upscaling..." : `Upscale Image ${scaleFactor}×`}
        </Button>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <p className="text-sm text-blue-400 mb-2">
            <strong>Note:</strong> This tool uses browser-based interpolation for upscaling. 
            For best results with photos, consider AI-powered upscaling services.
          </p>
          <p className="text-xs text-blue-400/80">
            • Works best for graphics, screenshots, and illustrations
            <br />• Uses high-quality bicubic interpolation
            <br />• Processing happens entirely in your browser
          </p>
        </div>

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </ToolLayout>
  );
}
