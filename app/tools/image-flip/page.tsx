"use client";

import { useState, useRef, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("image-flip")!;
const similarTools = getToolsByCategory("image").filter(t => t.slug !== "image-flip");

export default function ImageFlipPage() {
  const [image, setImage] = useState<string | null>(null);
  const [flipMode, setFlipMode] = useState<"horizontal" | "vertical" | "both" | "none">("none");
  const [fileName, setFileName] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setFlipMode("none");
    };
    reader.readAsDataURL(file);
  }, []);

  const getTransformStyle = () => {
    switch (flipMode) {
      case "horizontal": return "scaleX(-1)";
      case "vertical": return "scaleY(-1)";
      case "both": return "scale(-1, -1)";
      default: return "none";
    }
  };

  const downloadImage = useCallback(() => {
    if (!image || !canvasRef.current) return;

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;

      canvas.width = img.width;
      canvas.height = img.height;

      // Apply flip transformations
      ctx.translate(canvas.width / 2, canvas.height / 2);
      
      const scaleX = flipMode === "horizontal" || flipMode === "both" ? -1 : 1;
      const scaleY = flipMode === "vertical" || flipMode === "both" ? -1 : 1;
      ctx.scale(scaleX, scaleY);
      
      ctx.drawImage(img, -img.width / 2, -img.height / 2);

      // Download
      const link = document.createElement("a");
      link.download = `flipped_${fileName || "image.png"}`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = image;
  }, [image, flipMode, fileName]);

  const flipOptions = [
    { mode: "none" as const, label: "Original", icon: "📷" },
    { mode: "horizontal" as const, label: "Horizontal", icon: "↔️" },
    { mode: "vertical" as const, label: "Vertical", icon: "↕️" },
    { mode: "both" as const, label: "Both", icon: "🔄" },
  ];

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="text-4xl mb-2">📷</div>
            <p className="font-medium">Click to upload an image</p>
            <p className="text-sm text-[var(--muted-foreground)]">
              Supports JPG, PNG, GIF, WebP
            </p>
          </label>
        </div>

        {image && (
          <>
            <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
              <div className="flex justify-center mb-6">
                <div className="relative bg-[var(--muted)] p-4 rounded-lg">
                  <img
                    src={image}
                    alt="Preview"
                    className="max-w-full max-h-80 object-contain transition-transform duration-300"
                    style={{ transform: getTransformStyle() }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {flipOptions.map((option) => (
                  <button
                    key={option.mode}
                    onClick={() => setFlipMode(option.mode)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      flipMode === option.mode
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-[var(--border)] hover:border-[var(--accent)]"
                    }`}
                  >
                    <div className="text-2xl mb-1">{option.icon}</div>
                    <div className="text-sm font-medium">{option.label}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
              <h3 className="font-semibold mb-4">Preview Comparison</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-sm text-[var(--muted-foreground)] mb-2">Original</div>
                  <div className="bg-[var(--muted)] p-2 rounded-lg inline-block">
                    <img
                      src={image}
                      alt="Original"
                      className="max-h-40 object-contain"
                    />
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-sm text-[var(--muted-foreground)] mb-2">Flipped</div>
                  <div className="bg-[var(--muted)] p-2 rounded-lg inline-block">
                    <img
                      src={image}
                      alt="Flipped"
                      className="max-h-40 object-contain"
                      style={{ transform: getTransformStyle() }}
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={downloadImage}
              disabled={flipMode === "none"}
              className="w-full py-4 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ⬇ Download Flipped Image
            </button>
          </>
        )}

        <canvas ref={canvasRef} className="hidden" />

        <div className="bg-[var(--muted)] rounded-xl p-4 text-sm text-[var(--muted-foreground)]">
          <h4 className="font-medium mb-2">Flip Types:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li><strong>Horizontal:</strong> Mirror the image left-to-right</li>
            <li><strong>Vertical:</strong> Mirror the image top-to-bottom</li>
            <li><strong>Both:</strong> Mirror both directions (180° rotation)</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
