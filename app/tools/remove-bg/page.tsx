// Magic Background Remover | TypeScript
"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUpload } from "@/components/FileUpload";
import { CoffeePrompt } from "@/components/CoffeePrompt";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("remove-bg")!;
const similarTools = getToolsByCategory("image").filter(t => t.slug !== "remove-bg");

export default function RemoveBgPage() {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [processedUrl, setProcessedUrl] = useState<string | null>(null);
  const [processedBlob, setProcessedBlob] = useState<Blob | null>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState("");
  const [pasteStatus, setPasteStatus] = useState<string | null>(null);
  const [showOriginal, setShowOriginal] = useState(false);
  const [bgColor, setBgColor] = useState<string | null>(null);
  const [modelLoaded, setModelLoaded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [removeBackgroundFn, setRemoveBackgroundFn] = useState<any>(null);

  useEffect(() => {
    const loadLibrary = async () => {
      try {
        const module = await import("@imgly/background-removal");
        setRemoveBackgroundFn(() => module.removeBackground);
      } catch (error) {
        console.error("Failed to load background removal library:", error);
      }
    };
    loadLibrary();
  }, []);

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
            setProcessedBlob(null);
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
            setProcessedBlob(null);
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
      setProcessedBlob(null);
      return () => URL.revokeObjectURL(url);
    }
  }, [imageFile]);

  const handleFileSelect = (file: File) => {
    setImageFile(file);
    setProcessedUrl(null);
    setProcessedBlob(null);
  };

  const removeBackground = useCallback(async () => {
    if (!imageUrl || !removeBackgroundFn) {
      setPasteStatus("AI model not loaded yet. Please wait...");
      setTimeout(() => setPasteStatus(null), 3000);
      return;
    }

    setLoading(true);
    setProgress(0);
    setProgressMessage("Initializing...");
    const startTime = Date.now();

    try {
      setProgress(5);
      setProgressMessage("Loading AI model (first time: ~40MB download)...");

      const blob = await removeBackgroundFn(imageUrl, {
        progress: (key: string, current: number, total: number) => {
          const percent = Math.round((current / total) * 100);

          if (key === "fetch:model") {
            setProgressMessage(`Downloading AI model... ${percent}%`);
            setProgress(5 + (percent * 0.4));
          } else if (key === "compute:inference") {
            setProgressMessage("AI processing image...");
            setProgress(45 + (percent * 0.5));
          } else {
            setProgressMessage("Processing...");
            setProgress(Math.min(95, 50 + (percent * 0.4)));
          }
        },
        output: {
          format: "image/png",
          quality: 1.0,
        },
      });

      if (!modelLoaded) {
        setModelLoaded(true);
      }

      setProgress(95);
      setProgressMessage("Finalizing...");

      const url = URL.createObjectURL(blob);
      setProcessedBlob(blob);
      setProcessedUrl(url);
      setProgress(100);
      setProgressMessage("Complete!");

      await logToolUsage({
        toolName: tool?.name || "Magic Background Remover",
        toolCategory: tool?.category || "image",
        inputType: "file",
        rawInput: imageFile?.name || "image",
        outputResult: "Background removed with AI",
        processingDuration: Date.now() - startTime,
        metadata: { modelLoaded, aiPowered: true },
      });
    } catch (error) {
      console.error("Error removing background:", error);
      setProgressMessage("Error processing image. Please try again.");
      setPasteStatus("Failed to process image. Try a different image.");
      setTimeout(() => setPasteStatus(null), 5000);
    } finally {
      setLoading(false);
      setTimeout(() => setProgressMessage(""), 2000);
    }
  }, [imageUrl, imageFile, removeBackgroundFn, modelLoaded]);

  const applyBackground = useCallback(() => {
    if (!processedBlob || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      if (bgColor) {
        ctx.fillStyle = bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      } else {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }

      ctx.drawImage(img, 0, 0);

      const newUrl = canvas.toDataURL("image/png");
      if (processedUrl) {
        URL.revokeObjectURL(processedUrl);
      }
      setProcessedUrl(newUrl);
    };
    img.src = URL.createObjectURL(processedBlob);
  }, [processedBlob, bgColor, processedUrl]);

  useEffect(() => {
    if (processedBlob && bgColor !== null) {
      applyBackground();
    }
  }, [bgColor, processedBlob, applyBackground]);

  const handleDownload = () => {
    if (!processedUrl) return;
    const link = document.createElement("a");
    link.download = imageFile?.name.replace(/\.[^.]+$/, "-no-bg.png") || "removed-bg.png";
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
    { name: "Purple", value: "#a855f7" },
  ];

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
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
            {processedUrl && (
              <div className="p-6 rounded-xl bg-[var(--card)] border border-[var(--border)]">
                <label className="block text-sm font-medium mb-3">Background Color</label>
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
                  <input aria-label="Custom background color"
                    type="color"
                    value={bgColor || "#ffffff"}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer border border-[var(--border)]"
                    title="Custom color"
                  />
                </div>
              </div>
            )}

            <button
              onClick={removeBackground}
              disabled={loading || !removeBackgroundFn}
              className="btn btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="spinner" />
                  {progressMessage || "Processing..."} {progress > 0 && `${Math.round(progress)}%`}
                </span>
              ) : !removeBackgroundFn ? (
                "Loading AI model..."
              ) : (
                <>
                  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                  Remove Background with AI
                </>
              )}
            </button>

            {loading && (
              <div className="w-full bg-[var(--muted)] rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 via-purple-600 to-fuchsia-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}

            {(imageUrl || processedUrl) && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">Preview</h3>
                  {processedUrl && (
                    <button
                      onClick={() => setShowOriginal(!showOriginal)}
                      className="text-sm text-violet-400 hover:text-violet-300 transition-colors"
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

            <canvas ref={canvasRef} className="hidden" />

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

            {processedUrl && <CoffeePrompt />}
          </>
        )}

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 text-sm">
            <p className="font-medium text-violet-400 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI-Powered Magic
            </p>
            <ul className="space-y-1 text-[var(--muted-foreground)]">
              <li className="flex items-start gap-2">
                <span className="text-violet-400 mt-0.5">•</span>
                <span>First use downloads ~40MB AI model to your browser cache</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400 mt-0.5">•</span>
                <span>After cached, works 100% offline on your device</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400 mt-0.5">•</span>
                <span>Uses GPU/CPU acceleration for fast processing</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400 mt-0.5">•</span>
                <span>No uploads — your images never leave your browser</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-[var(--muted-foreground)]">
            <p className="font-medium text-blue-400 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              Pro Tips
            </p>
            <ul className="space-y-1">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Works with complex backgrounds, hair, and fine details</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Best results with clear subject and good lighting</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Add custom background color after removal</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Use Ctrl+V to paste screenshots directly</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
