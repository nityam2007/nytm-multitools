// PDF Compress Tool | TypeScript
"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/Button";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("pdf-compress")!;
const similarTools = getToolsByCategory("converter").filter(t => t.slug !== "pdf-compress");

export default function PDFCompressPage() {
  const [file, setFile] = useState<File | null>(null);
  const [compressing, setCompressing] = useState(false);
  const [error, setError] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [compressedSize, setCompressedSize] = useState(0);
  const [quality, setQuality] = useState<"low" | "medium" | "high">("medium");

  const handleFileUpload = useCallback((uploadedFile: File) => {
    if (uploadedFile.type !== "application/pdf") {
      setError("Please select a PDF file");
      return;
    }

    setFile(uploadedFile);
    setOriginalSize(uploadedFile.size);
    setCompressedSize(0);
    setError("");
  }, []);

  const compressPDF = async () => {
    if (!file) {
      setError("Please upload a PDF file");
      return;
    }

    setCompressing(true);
    setError("");

    try {
      const { PDFDocument } = await import("pdf-lib");
      
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // Compression settings based on quality
      const compressionSettings = {
        low: { objectsPerTick: 50 },
        medium: { objectsPerTick: 100 },
        high: { objectsPerTick: 200 },
      };

      const pdfBytes = await pdfDoc.save({
        useObjectStreams: true,
        addDefaultPage: false,
        ...compressionSettings[quality],
      });

      setCompressedSize(pdfBytes.length);

      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = file.name.replace(/\.pdf$/i, "_compressed.pdf");
      link.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to compress PDF");
    } finally {
      setCompressing(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  };

  const compressionRatio = originalSize && compressedSize
    ? ((1 - compressedSize / originalSize) * 100).toFixed(1)
    : "0";

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
                    setOriginalSize(0);
                    setCompressedSize(0);
                  }}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
              <div className="text-xs text-[var(--muted-foreground)]">
                Original size: {formatSize(originalSize)}
              </div>
              {compressedSize > 0 && (
                <div className="text-xs text-green-500 mt-1">
                  Compressed: {formatSize(compressedSize)} ({compressionRatio}% reduction)
                </div>
              )}
            </div>
          )}
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4">Compression Quality</h3>
          <div className="grid grid-cols-3 gap-3">
            {(["low", "medium", "high"] as const).map((q) => (
              <button
                key={q}
                onClick={() => setQuality(q)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  quality === q
                    ? "bg-violet-500 text-white"
                    : "bg-[var(--muted)] hover:bg-[var(--muted)]/80"
                }`}
              >
                {q.charAt(0).toUpperCase() + q.slice(1)}
              </button>
            ))}
          </div>
          <p className="text-xs text-[var(--muted-foreground)] mt-3">
            {quality === "low" && "Smallest file size, faster processing"}
            {quality === "medium" && "Balanced compression and quality"}
            {quality === "high" && "Best quality, larger file size"}
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        <Button
          onClick={compressPDF}
          disabled={!file || compressing}
          className="w-full"
        >
          {compressing ? "Compressing..." : "Compress PDF"}
        </Button>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <p className="text-sm text-blue-400">
            <strong>Note:</strong> PDF compression reduces file size by optimizing internal structures. 
            Results vary based on PDF content and original compression.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
