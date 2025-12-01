"use client";

import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("base64-to-image")!;
const similarTools = getToolsByCategory("converter").filter(t => t.slug !== "base64-to-image");

export default function Base64ToImagePage() {
  const [input, setInput] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [imageInfo, setImageInfo] = useState<{ width: number; height: number; type: string } | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleConvert = async () => {
    if (!input.trim()) return;
    setError("");
    const startTime = Date.now();

    let base64 = input.trim();
    
    // Add data URI prefix if not present
    if (!base64.startsWith("data:")) {
      // Try to detect image type
      if (base64.startsWith("/9j/")) {
        base64 = `data:image/jpeg;base64,${base64}`;
      } else if (base64.startsWith("iVBOR")) {
        base64 = `data:image/png;base64,${base64}`;
      } else if (base64.startsWith("R0lGO")) {
        base64 = `data:image/gif;base64,${base64}`;
      } else if (base64.startsWith("UklGR")) {
        base64 = `data:image/webp;base64,${base64}`;
      } else {
        base64 = `data:image/png;base64,${base64}`;
      }
    }

    // Validate by loading image
    const img = new Image();
    img.onload = async () => {
      setPreview(base64);
      const type = base64.match(/data:image\/(\w+);/)?.[1] || "unknown";
      setImageInfo({ width: img.width, height: img.height, type });

      await logToolUsage({
        toolName: tool.name,
        toolCategory: tool.category,
        inputType: "text",
        rawInput: `Base64 string (${input.length} chars)`,
        outputResult: `Image ${img.width}x${img.height} (${type})`,
        processingDuration: Date.now() - startTime,
      });
    };
    img.onerror = () => {
      setError("Invalid base64 image data");
      setPreview(null);
      setImageInfo(null);
    };
    img.src = base64;
  };

  const handleDownload = () => {
    if (!preview) return;
    const link = document.createElement("a");
    link.download = `image.${imageInfo?.type || "png"}`;
    link.href = preview;
    link.click();
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <TextArea
          label="Base64 Input"
          placeholder="Paste base64 string here (with or without data:image prefix)..."
          value={input}
          onChange={(e) => { setInput(e.target.value); setError(""); }}
          error={error}
          rows={6}
        />

        <button
          onClick={handleConvert}
          disabled={!input.trim()}
          className="btn btn-primary w-full py-3"
        >
          Convert to Image
        </button>

        {preview && (
          <div className="card p-4">
            <div className="flex justify-between items-center mb-4">
              <div>
                <h3 className="font-medium">Preview</h3>
                {imageInfo && (
                  <p className="text-sm text-muted-foreground">
                    {imageInfo.width} × {imageInfo.height}px • {imageInfo.type.toUpperCase()}
                  </p>
                )}
              </div>
              <button onClick={handleDownload} className="btn btn-secondary">
                Download
              </button>
            </div>
            <img ref={imgRef} src={preview} alt="Converted" className="max-w-full h-auto rounded" />
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
