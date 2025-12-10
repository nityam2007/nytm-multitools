// PDF to Images Tool | TypeScript
"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/Button";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("pdf-to-images")!;
const similarTools = getToolsByCategory("converter").filter(t => t.slug !== "pdf-to-images");

type ImageFormat = "png" | "jpg" | "webp";

export default function PDFToImagesPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState("");
  const [format, setFormat] = useState<ImageFormat>("png");
  const [quality, setQuality] = useState(0.95);
  const [progress, setProgress] = useState(0);

  const handleFileUpload = useCallback(async (uploadedFile: File) => {
    if (uploadedFile.type !== "application/pdf") {
      setError("Please select a PDF file");
      return;
    }

    setFile(uploadedFile);
    setError("");

    try {
      const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");
      
      // Use local worker (browser-only, no CDN)
      GlobalWorkerOptions.workerSrc = "/workers/pdf.worker.mjs";

      const arrayBuffer = await uploadedFile.arrayBuffer();
      const pdf = await getDocument({ data: arrayBuffer }).promise;
      setPageCount(pdf.numPages);
    } catch (err) {
      setError("Failed to read PDF file");
    }
  }, []);

  const convertToImages = async () => {
    if (!file) {
      setError("Please upload a PDF file");
      return;
    }

    setConverting(true);
    setError("");
    setProgress(0);

    try {
      const { getDocument, GlobalWorkerOptions } = await import("pdfjs-dist");
      
      // Use local worker (browser-only, no CDN)
      GlobalWorkerOptions.workerSrc = "/workers/pdf.worker.mjs";

      const arrayBuffer = await file.arrayBuffer();
      const pdf = await getDocument({ data: arrayBuffer }).promise;

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2.0 }); // 2x scale for better quality

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        if (!context) continue;

        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({
          canvasContext: context,
          viewport: viewport,
          canvas: canvas,
        }).promise;

        // Convert to selected format
        const mimeType = format === "jpg" ? "image/jpeg" : `image/${format}`;
        const blob = await new Promise<Blob | null>((resolve) => {
          canvas.toBlob(resolve, mimeType, quality);
        });

        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = file.name.replace(/\.pdf$/i, `_page_${i}.${format}`);
          link.click();
          URL.revokeObjectURL(url);

          // Small delay between downloads
          await new Promise((resolve) => setTimeout(resolve, 100));
        }

        setProgress(Math.round((i / pdf.numPages) * 100));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to convert PDF to images");
    } finally {
      setConverting(false);
      setProgress(0);
    }
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4">Upload PDF</h3>
          <FileUpload
            accept={{ "application/pdf": [".pdf"] }}
            onFileSelect={handleFileUpload}
            label="Choose PDF file"
          />

          {file && (
            <div className="mt-4 p-4 bg-[var(--muted)] rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{file.name}</span>
                <button
                  onClick={() => {
                    setFile(null);
                    setPageCount(0);
                  }}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
              <div className="text-xs text-[var(--muted-foreground)]">
                {pageCount} page{pageCount !== 1 ? "s" : ""} • {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
          )}
        </div>

        {file && pageCount > 0 && (
          <>
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
              <h3 className="text-sm font-semibold mb-4">Image Format</h3>
              <div className="grid grid-cols-3 gap-3">
                {(["png", "jpg", "webp"] as const).map((fmt) => (
                  <button
                    key={fmt}
                    onClick={() => setFormat(fmt)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      format === fmt
                        ? "bg-violet-500 text-white"
                        : "bg-[var(--muted)] hover:bg-[var(--muted)]/80"
                    }`}
                  >
                    {fmt.toUpperCase()}
                  </button>
                ))}
              </div>
              <p className="text-xs text-[var(--muted-foreground)] mt-3 text-center">
                {format === "png" && "Lossless, best for screenshots and graphics"}
                {format === "jpg" && "Compressed, best for photos"}
                {format === "webp" && "Modern format, smaller size"}
              </p>
            </div>

            {(format === "jpg" || format === "webp") && (
              <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
                <h3 className="text-sm font-semibold mb-4">Quality: {Math.round(quality * 100)}%</h3>
                <input
                  type="range"
                  min="0.5"
                  max="1"
                  step="0.05"
                  value={quality}
                  onChange={(e) => setQuality(parseFloat(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-[var(--muted-foreground)] mt-2">
                  <span>Smaller size</span>
                  <span>Better quality</span>
                </div>
              </div>
            )}
          </>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {converting && progress > 0 && (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Converting...</span>
              <span className="text-sm text-violet-500">{progress}%</span>
            </div>
            <div className="w-full bg-[var(--muted)] rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-violet-500 to-purple-600 h-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <Button
          onClick={convertToImages}
          disabled={!file || converting}
          className="w-full"
        >
          {converting ? `Converting... ${progress}%` : `Convert to ${format.toUpperCase()} Images`}
        </Button>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <p className="text-sm text-blue-400">
            <strong>Note:</strong> Each PDF page will be converted to a separate image file. 
            All processing happens in your browser using PDF.js.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
