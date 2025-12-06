"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUpload } from "@/components/FileUpload";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("remove-bg")!;
const similarTools = getToolsByCategory("image").filter(t => t.slug !== "remove-bg");

export default function RemoveBgPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pasteStatus, setPasteStatus] = useState<string | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const [threshold, setThreshold] = useState(30);
  const [edgeSmoothing, setEdgeSmoothing] = useState(2);
  const [bgColor, setBgColor] = useState<string | null>(null); // null = transparent
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const workerCanvasRef = useRef<HTMLCanvasElement>(null);

  // Handle paste from clipboard
  const handlePaste = useCallback(async (e?: ClipboardEvent) => {
    try {
      let items: DataTransferItemList | undefined;
      
      if (e) {
        items = e.clipboardData?.items;
      } else {
        const clipboardItems = await navigator.clipboard.read();
        for (const item of clipboardItems) {
          const imageType = item.types.find(type => type.startsWith("image/"));
          if (imageType) {
            const blob = await item.getType(imageType);
            const file = new File([blob], "pasted-image.png", { type: imageType });
            setImageFile(file);
            setProcessedUrl(null);
            setPasteStatus("Image pasted from clipboard!");
            setTimeout(() => setPasteStatus(null), 2000);
            return;
          }
        }
        setPasteStatus("No image found in clipboard");
        setTimeout(() => setPasteStatus(null), 2000);
        return;
      }

      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.type.startsWith("image/")) {
          const file = item.getAsFile();
          if (file) {
            setImageFile(file);
            setProcessedUrl(null);
            setPasteStatus("Image pasted from clipboard!");
            setTimeout(() => setPasteStatus(null), 2000);
            return;
          }
        }
      }
    } catch (error) {
      console.error("Error pasting from clipboard:", error);
      setPasteStatus("Failed to paste. Try Ctrl+V instead.");
      setTimeout(() => setPasteStatus(null), 3000);
    }
  }, []);

  // Listen for paste events
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      handlePaste(e);
    };
    document.addEventListener("paste", onPaste);
    return () => document.removeEventListener("paste", onPaste);
  }, [handlePaste]);

  useEffect(() => {
    if (imageFile) {
      const url = URL.createObjectURL(imageFile);
      setImageUrl(url);
      setProcessedUrl(null);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  const handleFileSelect = (file: File) => {
    setImageFile(file);
    setProcessedUrl(null);
  };

  // Simple client-side background removal using color detection
  const removeBackground = useCallback(async () => {
    if (!imageUrl || !canvasRef.current || !workerCanvasRef.current) return;

    setLoading(true);
    setProgress(0);
    const startTime = Date.now();

    try {
      const canvas = canvasRef.current;
      const workerCanvas = workerCanvasRef.current;
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      const workerCtx = workerCanvas.getContext("2d", { willReadFrequently: true });
      
      if (!ctx || !workerCtx) return;

      const img = new Image();
      img.crossOrigin = "anonymous";
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = reject;
        img.src = imageUrl;
      });

      setProgress(10);

      canvas.width = img.width;
      canvas.height = img.height;
      workerCanvas.width = img.width;
      workerCanvas.height = img.height;

      // Draw original image
      ctx.drawImage(img, 0, 0);
      workerCtx.drawImage(img, 0, 0);

      setProgress(20);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Sample corners to detect background color
      const samples: number[][] = [];
      const samplePositions = [
        [0, 0], [canvas.width - 1, 0],
        [0, canvas.height - 1], [canvas.width - 1, canvas.height - 1],
        [Math.floor(canvas.width / 2), 0],
        [Math.floor(canvas.width / 2), canvas.height - 1],
        [0, Math.floor(canvas.height / 2)],
        [canvas.width - 1, Math.floor(canvas.height / 2)],
      ];

      for (const [x, y] of samplePositions) {
        const idx = (y * canvas.width + x) * 4;
        samples.push([data[idx], data[idx + 1], data[idx + 2]]);
      }

      // Find most common background color
      const bgColorCounts = new Map<string, { count: number; color: number[] }>();
      for (const sample of samples) {
        const key = `${Math.round(sample[0] / 10)}-${Math.round(sample[1] / 10)}-${Math.round(sample[2] / 10)}`;
        const existing = bgColorCounts.get(key);
        if (existing) {
          existing.count++;
        } else {
          bgColorCounts.set(key, { count: 1, color: sample });
        }
      }

      let detectedBg = [255, 255, 255];
      let maxCount = 0;
      for (const [, value] of bgColorCounts) {
        if (value.count > maxCount) {
          maxCount = value.count;
          detectedBg = value.color;
        }
      }

      setProgress(30);

      // Process pixels
      const totalPixels = canvas.width * canvas.height;
      const chunkSize = Math.ceil(totalPixels / 10);
      
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Calculate color distance from detected background
        const distance = Math.sqrt(
          Math.pow(r - detectedBg[0], 2) +
          Math.pow(g - detectedBg[1], 2) +
          Math.pow(b - detectedBg[2], 2)
        );

        // If close to background color, make transparent
        if (distance < threshold * 4) {
          // Gradual transparency based on distance
          const alpha = Math.min(255, Math.max(0, (distance / (threshold * 4)) * 255));
          data[i + 3] = Math.round(alpha);
        }

        // Update progress
        if ((i / 4) % chunkSize === 0) {
          setProgress(30 + Math.floor(((i / 4) / totalPixels) * 50));
        }
      }

      setProgress(80);

      // Apply edge smoothing
      if (edgeSmoothing > 0) {
        const tempData = new Uint8ClampedArray(data);
        const radius = edgeSmoothing;
        
        for (let y = radius; y < canvas.height - radius; y++) {
          for (let x = radius; x < canvas.width - radius; x++) {
            const idx = (y * canvas.width + x) * 4;
            
            // Only smooth edge pixels (semi-transparent)
            if (tempData[idx + 3] > 0 && tempData[idx + 3] < 255) {
              let sumAlpha = 0;
              let count = 0;
              
              for (let dy = -radius; dy <= radius; dy++) {
                for (let dx = -radius; dx <= radius; dx++) {
                  const nidx = ((y + dy) * canvas.width + (x + dx)) * 4;
                  sumAlpha += tempData[nidx + 3];
                  count++;
                }
              }
              
              data[idx + 3] = Math.round(sumAlpha / count);
            }
          }
        }
      }

      setProgress(90);

      // Apply new background color if specified
      if (bgColor) {
        const hex = bgColor.replace("#", "");
        const newBgR = parseInt(hex.substr(0, 2), 16);
        const newBgG = parseInt(hex.substr(2, 2), 16);
        const newBgB = parseInt(hex.substr(4, 2), 16);

        for (let i = 0; i < data.length; i += 4) {
          const alpha = data[i + 3] / 255;
          data[i] = Math.round(data[i] * alpha + newBgR * (1 - alpha));
          data[i + 1] = Math.round(data[i + 1] * alpha + newBgG * (1 - alpha));
          data[i + 2] = Math.round(data[i + 2] * alpha + newBgB * (1 - alpha));
          data[i + 3] = 255;
        }
      }

      ctx.putImageData(imageData, 0, 0);
      setProcessedUrl(canvas.toDataURL("image/png"));
      setProgress(100);

      await logToolUsage({
        toolName: tool?.name || "Remove Background",
        toolCategory: tool?.category || "image",
        inputType: "file",
        rawInput: imageFile?.name || "image",
        outputResult: "Background removed",
        processingDuration: Date.now() - startTime,
        metadata: { threshold, edgeSmoothing, bgColor },
      });
    } catch (error) {
      console.error("Error removing background:", error);
    } finally {
      setLoading(false);
    }
  }, [imageUrl, threshold, edgeSmoothing, bgColor, imageFile]);

  const handleDownload = () => {
    if (!processedUrl) return;
    const link = document.createElement("a");
    link.download = "removed-bg.png";
    link.href = processedUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const presetBgColors = [
    { name: "Transparent", value: null },
    { name: "White", value: "#ffffff" },
    { name: "Black", value: "#000000" },
    { name: "Red", value: "#ef4444" },
    { name: "Green", value: "#22c55e" },
    { name: "Blue", value: "#3b82f6" },
  ];

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        {/* Paste from clipboard hint */}
        <div className="flex flex-col sm:flex-row items-center gap-3 p-4 rounded-xl bg-[var(--muted)] border border-[var(--border)]">
          <div className="flex items-center gap-2 text-sm text-[var(--muted-foreground)]">
            <kbd className="px-2 py-1 rounded bg-[var(--card)] border border-[var(--border)] text-xs font-mono">Ctrl</kbd>
            <span>+</span>
            <kbd className="px-2 py-1 rounded bg-[var(--card)] border border-[var(--border)] text-xs font-mono">V</kbd>
            <span>to paste from clipboard</span>
          </div>
          <span className="text-[var(--muted-foreground)]">or</span>
          <button
            onClick={() => handlePaste()}
            className="px-4 py-2 rounded-lg bg-violet-500/10 border border-violet-500/30 text-violet-400 hover:bg-violet-500/20 transition-colors text-sm font-medium flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Paste from Clipboard
          </button>
          {pasteStatus && (
            <span className={`text-sm ${pasteStatus.includes("pasted") ? "text-emerald-400" : "text-amber-400"}`}>
              {pasteStatus}
            </span>
          )}
        </div>

        <FileUpload
          onFileSelect={handleFileSelect}
          accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp"] }}
          label="Upload Image"
          helperText="PNG, JPG, or WebP up to 10MB"
        />

        {imageUrl && (
          <>
            {/* Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 rounded-xl bg-[var(--card)] border border-[var(--border)]">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Sensitivity: {threshold}
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="80"
                    value={threshold}
                    onChange={(e) => setThreshold(parseInt(e.target.value))}
                    className="w-full"
                  />
                  <p className="text-xs text-[var(--muted-foreground)] mt-1">
                    Higher = removes more background
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Edge Smoothing: {edgeSmoothing}px
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={edgeSmoothing}
                    onChange={(e) => setEdgeSmoothing(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">New Background</label>
                <div className="flex flex-wrap gap-2">
                  {presetBgColors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setBgColor(color.value)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                        bgColor === color.value
                          ? "ring-2 ring-violet-500 ring-offset-2 ring-offset-[var(--background)]"
                          : "hover:bg-[var(--muted)]"
                      }`}
                      style={{
                        background: color.value || "repeating-conic-gradient(#808080 0% 25%, transparent 0% 50%) 50% / 16px 16px",
                        color: color.value === "#000000" ? "#fff" : color.value === "#ffffff" ? "#000" : undefined,
                        border: `1px solid ${color.value || "var(--border)"}`,
                      }}
                    >
                      {color.name}
                    </button>
                  ))}
                  <input
                    type="color"
                    value={bgColor || "#ffffff"}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-[var(--border)]"
                    title="Custom color"
                  />
                </div>
              </div>
            </div>

            {/* Process Button */}
            <button
              onClick={removeBackground}
              disabled={loading}
              className="btn btn-primary w-full py-3"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="spinner" />
                  Processing... {progress}%
                </span>
              ) : (
                "Remove Background"
              )}
            </button>

            {/* Progress bar */}
            {loading && (
              <div className="w-full bg-[var(--muted)] rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 to-purple-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            {/* Preview */}
            {(imageUrl || processedUrl) && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Preview</h3>
                  {processedUrl && (
                    <button
                      onClick={() => setShowOriginal(!showOriginal)}
                      className="text-sm text-violet-400 hover:text-violet-300"
                    >
                      {showOriginal ? "Show Result" : "Show Original"}
                    </button>
                  )}
                </div>
                
                <div
                  className="relative rounded-xl overflow-hidden border border-[var(--border)]"
                  style={{
                    background: processedUrl && !showOriginal && !bgColor
                      ? "repeating-conic-gradient(#404040 0% 25%, #606060 0% 50%) 50% / 20px 20px"
                      : "var(--muted)",
                  }}
                >
                  <img
                    src={showOriginal || !processedUrl ? imageUrl : processedUrl}
                    alt="Preview"
                    className="max-w-full h-auto mx-auto max-h-[500px] object-contain"
                  />
                </div>
              </div>
            )}

            {/* Hidden canvases */}
            <canvas ref={canvasRef} className="hidden" />
            <canvas ref={workerCanvasRef} className="hidden" />

            {/* Download Button */}
            {processedUrl && (
              <button
                onClick={handleDownload}
                className="btn btn-primary w-full py-3 flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PNG
              </button>
            )}
          </>
        )}

        {/* Info */}
        <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-[var(--muted-foreground)]">
          <p className="font-medium text-blue-400 mb-2 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Tips
          </p>
          <ul className="space-y-1 list-disc list-inside">
            <li>Works best with solid color backgrounds</li>
            <li>Adjust sensitivity for better edge detection</li>
            <li>Use edge smoothing to reduce jagged edges</li>
            <li>All processing happens in your browser — your images stay private</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
