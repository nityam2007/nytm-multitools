"use client";

import { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUpload } from "@/components/FileUpload";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("image-resize")!;
const similarTools = getToolsByCategory("image").filter(t => t.slug !== "image-resize");

export default function ImageResizePage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [format, setFormat] = useState<"jpeg" | "png" | "webp">("jpeg");
  const [quality, setQuality] = useState(90);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      setOutput(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    const img = new Image();
    img.onload = () => {
      setOriginalSize({ width: img.width, height: img.height });
      setWidth(img.width);
      setHeight(img.height);
    };
    img.src = url;

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (maintainAspect && originalSize.width > 0) {
      const ratio = originalSize.height / originalSize.width;
      setHeight(Math.round(newWidth * ratio));
    }
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    if (maintainAspect && originalSize.height > 0) {
      const ratio = originalSize.width / originalSize.height;
      setWidth(Math.round(newHeight * ratio));
    }
  };

  const handleResize = async () => {
    if (!file || !canvasRef.current) return;
    const startTime = Date.now();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = async () => {
      canvas.width = width;
      canvas.height = height;
      ctx.drawImage(img, 0, 0, width, height);

      const mimeType = `image/${format}`;
      const dataUrl = canvas.toDataURL(mimeType, quality / 100);
      setOutput(dataUrl);

      await logToolUsage({
        toolName: tool.name,
        toolCategory: tool.category,
        inputType: "file",
        rawInput: file.name,
        outputResult: `Resized to ${width}x${height}`,
        processingDuration: Date.now() - startTime,
      });
    };
    img.src = URL.createObjectURL(file);
  };

  const handleDownload = () => {
    if (!output) return;
    const link = document.createElement("a");
    link.download = `resized-${width}x${height}.${format}`;
    link.href = output;
    link.click();
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <FileUpload
          accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"] }}
          onFileSelect={setFile}
          maxSize={20 * 1024 * 1024}
        />

        {preview && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-4">
                <h3 className="font-medium mb-2">Original</h3>
                <img src={preview} alt="Original" className="max-w-full h-auto rounded" />
                <p className="text-sm text-muted-foreground mt-2">
                  {originalSize.width} × {originalSize.height}px
                </p>
              </div>

              <div className="card p-4 space-y-4">
                <h3 className="font-medium">Resize Options</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Width (px)</label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Height (px)</label>
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                      className="input w-full"
                    />
                  </div>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={maintainAspect}
                    onChange={(e) => setMaintainAspect(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Maintain aspect ratio</span>
                </label>

                <div>
                  <label className="block text-sm font-medium mb-1">Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as typeof format)}
                    className="input w-full"
                  >
                    <option value="jpeg">JPEG</option>
                    <option value="png">PNG</option>
                    <option value="webp">WebP</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Quality: {quality}%</label>
                  <input
                    type="range"
                    min={10}
                    max={100}
                    value={quality}
                    onChange={(e) => setQuality(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>

                <button onClick={handleResize} className="btn btn-primary w-full">
                  Resize Image
                </button>
              </div>
            </div>

            {output && (
              <div className="card p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Resized Image</h3>
                  <button onClick={handleDownload} className="btn btn-secondary text-sm">
                    Download
                  </button>
                </div>
                <img src={output} alt="Resized" className="max-w-full h-auto rounded" />
                <p className="text-sm text-muted-foreground mt-2">{width} × {height}px</p>
              </div>
            )}
          </>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </ToolLayout>
  );
}
