// HEIC to JPG Converter | TypeScript
"use client";

import { useState, useRef, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUpload } from "@/components/FileUpload";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("heic-to-jpg")!;
const similarTools = getToolsByCategory("converter").filter(t => t.slug !== "heic-to-jpg");

export default function HeicToJpgPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [convertedImages, setConvertedImages] = useState<{ name: string; url: string; blob: Blob }[]>([]);
  const [quality, setQuality] = useState(0.92);
  const [heic2anyFn, setHeic2anyFn] = useState<any>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useState(() => {
    const loadLibrary = async () => {
      try {
        const module = await import("heic2any");
        setHeic2anyFn(() => module.default);
      } catch (error) {
        console.error("Failed to load heic2any:", error);
      }
    };
    loadLibrary();
  });

  const handleFileSelect = useCallback((file: File) => {
    setFiles(prev => [...prev, file]);
  }, []);

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const convertFiles = async () => {
    if (!files.length || !heic2anyFn || !canvasRef.current) return;

    setConverting(true);
    setProgress(0);
    setConvertedImages([]);
    const startTime = Date.now();

    const results: { name: string; url: string; blob: Blob }[] = [];

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        setProgress(Math.round(((i + 0.5) / files.length) * 100));

        try {
          const convertedBlob = await heic2anyFn({
            blob: file,
            toType: "image/jpeg",
            quality: quality,
          });

          const blob = Array.isArray(convertedBlob) ? convertedBlob[0] : convertedBlob;
          
          const canvas = canvasRef.current;
          const ctx = canvas.getContext("2d");
          if (!ctx) continue;

          const img = new Image();
          await new Promise<void>((resolve, reject) => {
            img.onload = () => {
              canvas.width = img.width;
              canvas.height = img.height;
              ctx.drawImage(img, 0, 0);
              resolve();
            };
            img.onerror = reject;
            img.src = URL.createObjectURL(blob);
          });

          const finalBlob = await new Promise<Blob>((resolve) => {
            canvas.toBlob((b) => resolve(b!), "image/jpeg", quality);
          });

          const url = URL.createObjectURL(finalBlob);
          const name = file.name.replace(/\.heic$/i, ".jpg");

          results.push({ name, url, blob: finalBlob });
        } catch (error) {
          console.error(`Error converting ${file.name}:`, error);
        }

        setProgress(Math.round(((i + 1) / files.length) * 100));
      }

      setConvertedImages(results);

      await logToolUsage({
        toolName: tool?.name || "HEIC to JPG Converter",
        toolCategory: tool?.category || "converter",
        inputType: "file",
        rawInput: `${files.length} HEIC file${files.length > 1 ? "s" : ""}`,
        outputResult: `Converted ${results.length} image${results.length > 1 ? "s" : ""}`,
        processingDuration: Date.now() - startTime,
        metadata: { quality, filesCount: files.length },
      });
    } catch (error) {
      console.error("Conversion error:", error);
    } finally {
      setConverting(false);
    }
  };

  const downloadImage = (image: { name: string; url: string; blob: Blob }) => {
    const link = document.createElement("a");
    link.download = image.name;
    link.href = image.url;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAll = () => {
    convertedImages.forEach(image => downloadImage(image));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <FileUpload
          onFileSelect={handleFileSelect}
          accept={{ "image/heic": [".heic", ".HEIC"] }}
          label="Upload HEIC Image"
          helperText="Upload one HEIC file at a time (can add multiple)"
        />

        {files.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Files to Convert ({files.length})</h3>
              <button
                onClick={() => setFiles([])}
                className="text-sm text-red-400 hover:text-red-300 transition-colors"
              >
                Clear All
              </button>
            </div>

            <div className="grid gap-3">
              {files.map((file, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-[var(--card)] border border-[var(--border)]"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <svg className="w-5 h-5 text-violet-400 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      <p className="text-xs text-[var(--muted-foreground)]">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => removeFile(index)}
                    className="ml-2 text-red-400 hover:text-red-300 transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)]">
              <label className="block text-sm font-medium mb-3">
                Quality: {Math.round(quality * 100)}%
              </label>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.01"
                value={quality}
                onChange={(e) => setQuality(parseFloat(e.target.value))}
                className="w-full"
                disabled={converting}
              />
              <div className="flex justify-between text-xs text-[var(--muted-foreground)] mt-1">
                <span>Smaller file</span>
                <span>Better quality</span>
              </div>
            </div>

            <button
              onClick={convertFiles}
              disabled={converting || !heic2anyFn}
              className="btn btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {converting ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="spinner" />
                  Converting... {progress}%
                </span>
              ) : !heic2anyFn ? (
                "Loading converter..."
              ) : (
                <>
                  <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                  Convert to JPG
                </>
              )}
            </button>

            {converting && (
              <div className="w-full bg-[var(--muted)] rounded-full h-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 via-purple-600 to-fuchsia-500 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        )}

        {convertedImages.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Converted Images ({convertedImages.length})</h3>
              <button
                onClick={downloadAll}
                className="btn btn-secondary text-sm py-2 px-4"
              >
                <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {convertedImages.map((image, index) => (
                <div
                  key={index}
                  className="rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--card)]"
                >
                  <div className="aspect-video relative bg-[var(--muted)]">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div className="p-3 space-y-2">
                    <p className="text-sm font-medium truncate">{image.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {formatFileSize(image.blob.size)}
                    </p>
                    <button
                      onClick={() => downloadImage(image)}
                      className="btn btn-primary w-full text-sm py-2"
                    >
                      <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />

        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 text-sm">
            <p className="font-medium text-violet-400 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              100% Client-Side
            </p>
            <ul className="space-y-1 text-[var(--muted-foreground)]">
              <li className="flex items-start gap-2">
                <span className="text-violet-400 mt-0.5">•</span>
                <span>All conversion happens in your browser using JavaScript</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400 mt-0.5">•</span>
                <span>No uploads — your photos never leave your device</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400 mt-0.5">•</span>
                <span>Works completely offline after page loads</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-violet-400 mt-0.5">•</span>
                <span>Convert multiple HEIC files at once</span>
              </li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 text-sm text-[var(--muted-foreground)]">
            <p className="font-medium text-blue-400 mb-2 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
              About HEIC Format
            </p>
            <ul className="space-y-1">
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>HEIC is Apple's default image format (iPhone, iPad)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Smaller file sizes than JPG with same quality</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Not widely supported on Windows and web</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span>Convert to JPG for universal compatibility</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
