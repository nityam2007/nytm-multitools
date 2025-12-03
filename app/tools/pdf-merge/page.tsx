// PDF Merge Tool | TypeScript
"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("pdf-merge")!;
const similarTools = getToolsByCategory("converter").filter(t => t.slug !== "pdf-merge");

interface PDFFile {
  id: string;
  file: File;
  name: string;
  size: number;
}

export default function PDFMergePage() {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [merging, setMerging] = useState(false);
  const [error, setError] = useState("");

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;

    const newFiles: PDFFile[] = Array.from(uploadedFiles)
      .filter(f => f.type === "application/pdf")
      .map(f => ({
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        file: f,
        name: f.name,
        size: f.size,
      }));

    if (newFiles.length === 0) {
      setError("Please select PDF files only");
      return;
    }

    setFiles(prev => [...prev, ...newFiles]);
    setError("");
    e.target.value = "";
  }, []);

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const moveFile = (index: number, direction: "up" | "down") => {
    const newFiles = [...files];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= files.length) return;
    [newFiles[index], newFiles[newIndex]] = [newFiles[newIndex], newFiles[index]];
    setFiles(newFiles);
  };

  const mergePDFs = async () => {
    if (files.length < 2) {
      setError("Please add at least 2 PDF files to merge");
      return;
    }

    setMerging(true);
    setError("");

    try {
      // Dynamic import pdf-lib
      const { PDFDocument } = await import("pdf-lib");
      
      const mergedPdf = await PDFDocument.create();

      for (const pdfFile of files) {
        const arrayBuffer = await pdfFile.file.arrayBuffer();
        const pdf = await PDFDocument.load(arrayBuffer);
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices());
        copiedPages.forEach(page => mergedPdf.addPage(page));
      }

      const mergedPdfBytes = await mergedPdf.save();
      const blob = new Blob([new Uint8Array(mergedPdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = "merged.pdf";
      link.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to merge PDFs");
    } finally {
      setMerging(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  const totalSize = files.reduce((acc, f) => acc + f.size, 0);

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Upload Area */}
        <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center hover:border-red-500/50 transition-colors">
          <input
            type="file"
            accept=".pdf,application/pdf"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="pdf-upload"
          />
          <label htmlFor="pdf-upload" className="cursor-pointer">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-red-500/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <p className="font-semibold text-lg mb-1">Drop PDF files here</p>
            <p className="text-sm text-[var(--muted-foreground)]">or click to browse</p>
          </label>
        </div>

        {/* Error */}
        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
            {error}
          </div>
        )}

        {/* File List */}
        {files.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">{files.length} PDF{files.length > 1 ? "s" : ""} selected</h3>
              <span className="text-sm text-[var(--muted-foreground)]">Total: {formatSize(totalSize)}</span>
            </div>

            <div className="space-y-2">
              {files.map((file, index) => (
                <div
                  key={file.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-[var(--card)] border border-[var(--border)]"
                >
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveFile(index, "up")}
                      disabled={index === 0}
                      className="p-1 rounded hover:bg-[var(--muted)] disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => moveFile(index, "down")}
                      disabled={index === files.length - 1}
                      className="p-1 rounded hover:bg-[var(--muted)] disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>

                  <div className="w-8 h-8 rounded bg-red-500/10 flex items-center justify-center flex-shrink-0">
                    <svg className="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{file.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{formatSize(file.size)}</p>
                  </div>

                  <span className="text-sm text-[var(--muted-foreground)] px-2">#{index + 1}</span>

                  <button
                    onClick={() => removeFile(file.id)}
                    className="p-1.5 rounded-lg hover:bg-red-500/10 text-[var(--muted-foreground)] hover:text-red-500 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>

            <p className="text-xs text-center text-[var(--muted-foreground)]">
              Drag to reorder • PDFs will be merged in the order shown
            </p>
          </div>
        )}

        {/* Merge Button */}
        <button
          onClick={mergePDFs}
          disabled={files.length < 2 || merging}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold shadow-lg shadow-red-500/25 hover:shadow-red-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {merging ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Merging...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Merge {files.length} PDFs
            </>
          )}
        </button>

        {/* Info */}
        <div className="p-4 rounded-xl bg-[var(--muted)] text-sm text-[var(--muted-foreground)]">
          <p className="flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            All processing happens in your browser. Files never leave your device.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
