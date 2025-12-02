"use client";

import { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUpload } from "@/components/FileUpload";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("image-compress")!;
const similarTools = getToolsByCategory("image").filter(t => t.slug !== "image-compress");

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

export default function ImageCompressPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [outputSize, setOutputSize] = useState(0);
  const [quality, setQuality] = useState(80);
  const [format, setFormat] = useState<"jpeg" | "webp">("jpeg");
  const [maxWidth, setMaxWidth] = useState(0);
  const [resizeEnabled, setResizeEnabled] = useState(false);
  const [originalDimensions, setOriginalDimensions] = useState({ width: 0, height: 0 });
  const [processing, setProcessing] = useState(false);
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
      setOriginalDimensions({ width: img.width, height: img.height });
      setMaxWidth(img.width);
    };
    img.src = url;

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleCompress = async () => {
    if (!file || !canvasRef.current) return;
    setProcessing(true);
    const startTime = Date.now();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = async () => {
      let targetWidth = img.width;
      let targetHeight = img.height;

      if (resizeEnabled && maxWidth < img.width) {
        const ratio = maxWidth / img.width;
        targetWidth = maxWidth;
        targetHeight = Math.round(img.height * ratio);
      }

      canvas.width = targetWidth;
      canvas.height = targetHeight;
      ctx.drawImage(img, 0, 0, targetWidth, targetHeight);

      const mimeType = `image/${format}`;
      const dataUrl = canvas.toDataURL(mimeType, quality / 100);
      
      // Calculate output size
      const base64 = dataUrl.split(",")[1];
      const bytes = atob(base64).length;
      setOutputSize(bytes);
      
      setOutput(dataUrl);
      setProcessing(false);

      await logToolUsage({
        toolName: tool.name,
        toolCategory: tool.category,
        inputType: "file",
        rawInput: `${file.name} (${formatBytes(file.size)})`,
        outputResult: `Compressed to ${formatBytes(bytes)} (${Math.round((1 - bytes / file.size) * 100)}% reduction)`,
        processingDuration: Date.now() - startTime,
      });
    };
    img.src = URL.createObjectURL(file);
  };

  const handleDownload = () => {
    if (!output) return;
    const link = document.createElement("a");
    link.download = `compressed.${format}`;
    link.href = output;
    link.click();
  };

  const compressionRatio = file && outputSize > 0 ? Math.round((1 - outputSize / file.size) * 100) : 0;

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <FileUpload
          accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"] }}
          onFileSelect={setFile}
          maxSize={50 * 1024 * 1024}
        />

        {preview && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="card p-4">
                <h3 className="font-medium mb-2">Original</h3>
                <img src={preview} alt="Original" className="max-w-full h-auto rounded" />
                <div className="mt-2 text-sm text-muted-foreground">
                  <p>Size: {file && formatBytes(file.size)}</p>
                  <p>Dimensions: {originalDimensions.width} × {originalDimensions.height}px</p>
                </div>
              </div>

              <div className="card p-4 space-y-4">
                <h3 className="font-medium">Compression Options</h3>

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
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Smaller file</span>
                    <span>Better quality</span>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Format</label>
                  <select
                    value={format}
                    onChange={(e) => setFormat(e.target.value as typeof format)}
                    className="input w-full"
                  >
                    <option value="jpeg">JPEG (best compression)</option>
                    <option value="webp">WebP (modern, smaller)</option>
                  </select>
                </div>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={resizeEnabled}
                    onChange={(e) => setResizeEnabled(e.target.checked)}
                    className="w-4 h-4"
                  />
                  <span className="text-sm">Resize image</span>
                </label>

                {resizeEnabled && (
                  <div>
                    <label className="block text-sm font-medium mb-1">Max Width: {maxWidth}px</label>
                    <input
                      type="range"
                      min={100}
                      max={originalDimensions.width}
                      value={maxWidth}
                      onChange={(e) => setMaxWidth(parseInt(e.target.value))}
                      className="w-full"
                    />
                  </div>
                )}

                <button
                  onClick={handleCompress}
                  disabled={processing}
                  className="btn btn-primary w-full"
                >
                  {processing ? "Compressing..." : "Compress Image"}
                </button>
              </div>
            </div>

            {output && (
              <div className="card p-4">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-medium">Compressed Result</h3>
                    <p className="text-sm text-muted-foreground">
                      {formatBytes(outputSize)} ({compressionRatio}% smaller)
                    </p>
                  </div>
                  <button onClick={handleDownload} className="btn btn-secondary">
                    Download
                  </button>
                </div>
                
                <div className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-200 rounded-lg p-3 mb-4">
                  <p className="font-medium flex items-center gap-2">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                    </svg>
                    Saved {formatBytes(file!.size - outputSize)}
                  </p>
                  <p className="text-sm">Original: {formatBytes(file!.size)} → Compressed: {formatBytes(outputSize)}</p>
                </div>

                <img src={output} alt="Compressed" className="max-w-full h-auto rounded" />
              </div>
            )}
          </>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </ToolLayout>
  );
}
