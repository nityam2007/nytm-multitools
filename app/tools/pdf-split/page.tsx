// PDF Split Tool | TypeScript
"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/Button";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("pdf-split")!;
const similarTools = getToolsByCategory("converter").filter(t => t.slug !== "pdf-split");

export default function PDFSplitPage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [splitting, setSplitting] = useState(false);
  const [error, setError] = useState("");
  const [splitMode, setSplitMode] = useState<"all" | "range" | "custom">("all");
  const [rangeStart, setRangeStart] = useState(1);
  const [rangeEnd, setRangeEnd] = useState(1);
  const [customPages, setCustomPages] = useState("");

  const handleFileUpload = useCallback(async (uploadedFile: File) => {
    if (uploadedFile.type !== "application/pdf") {
      setError("Please select a PDF file");
      return;
    }

    setFile(uploadedFile);
    setError("");

    try {
      const { PDFDocument } = await import("pdf-lib");
      const arrayBuffer = await uploadedFile.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const count = pdfDoc.getPageCount();
      setPageCount(count);
      setRangeEnd(count);
    } catch (err) {
      setError("Failed to read PDF file");
    }
  }, []);

  const splitPDF = async () => {
    if (!file) {
      setError("Please upload a PDF file");
      return;
    }

    setSplitting(true);
    setError("");

    try {
      const { PDFDocument } = await import("pdf-lib");
      
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      let pagesToExtract: number[] = [];

      if (splitMode === "all") {
        // Split into individual pages
        pagesToExtract = Array.from({ length: pageCount }, (_, i) => i);
      } else if (splitMode === "range") {
        // Extract range
        const start = Math.max(1, rangeStart);
        const end = Math.min(pageCount, rangeEnd);
        pagesToExtract = Array.from({ length: end - start + 1 }, (_, i) => start - 1 + i);
      } else if (splitMode === "custom") {
        // Parse custom pages (e.g., "1,3,5-7")
        const parts = customPages.split(",").map(p => p.trim());
        for (const part of parts) {
          if (part.includes("-")) {
            const [start, end] = part.split("-").map(n => parseInt(n.trim()));
            if (!isNaN(start) && !isNaN(end)) {
              for (let i = start; i <= end; i++) {
                if (i >= 1 && i <= pageCount) {
                  pagesToExtract.push(i - 1);
                }
              }
            }
          } else {
            const pageNum = parseInt(part);
            if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= pageCount) {
              pagesToExtract.push(pageNum - 1);
            }
          }
        }
        pagesToExtract = [...new Set(pagesToExtract)].sort((a, b) => a - b);
      }

      if (pagesToExtract.length === 0) {
        setError("No pages to extract");
        setSplitting(false);
        return;
      }

      if (splitMode === "all") {
        // Create individual PDFs for each page
        for (let i = 0; i < pagesToExtract.length; i++) {
          const newPdf = await PDFDocument.create();
          const [copiedPage] = await newPdf.copyPages(pdfDoc, [pagesToExtract[i]]);
          newPdf.addPage(copiedPage);

          const pdfBytes = await newPdf.save();
          const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.href = url;
          link.download = file.name.replace(/\.pdf$/i, `_page_${i + 1}.pdf`);
          link.click();

          URL.revokeObjectURL(url);
          await new Promise(resolve => setTimeout(resolve, 100)); // Small delay between downloads
        }
      } else {
        // Create single PDF with selected pages
        const newPdf = await PDFDocument.create();
        const copiedPages = await newPdf.copyPages(pdfDoc, pagesToExtract);
        copiedPages.forEach(page => newPdf.addPage(page));

        const pdfBytes = await newPdf.save();
        const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = file.name.replace(/\.pdf$/i, "_extracted.pdf");
        link.click();

        URL.revokeObjectURL(url);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to split PDF");
    } finally {
      setSplitting(false);
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
                {pageCount} page{pageCount !== 1 ? "s" : ""}
              </div>
            </div>
          )}
        </div>

        {file && pageCount > 0 && (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
            <h3 className="text-sm font-semibold mb-4">Split Mode</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 bg-[var(--muted)] rounded-xl cursor-pointer hover:bg-[var(--muted)]/80">
                <input
                  type="radio"
                  name="splitMode"
                  checked={splitMode === "all"}
                  onChange={() => setSplitMode("all")}
                  className="w-4 h-4"
                />
                <div>
                  <div className="text-sm font-medium">Split All Pages</div>
                  <div className="text-xs text-[var(--muted-foreground)]">Create separate PDF for each page</div>
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-[var(--muted)] rounded-xl cursor-pointer hover:bg-[var(--muted)]/80">
                <input
                  type="radio"
                  name="splitMode"
                  checked={splitMode === "range"}
                  onChange={() => setSplitMode("range")}
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">Extract Range</div>
                  <div className="text-xs text-[var(--muted-foreground)] mb-2">Extract specific page range</div>
                  {splitMode === "range" && (
                    <div className="flex items-center gap-2 mt-2">
                      <input
                        type="number"
                        min={1}
                        max={pageCount}
                        value={rangeStart}
                        onChange={(e) => setRangeStart(parseInt(e.target.value) || 1)}
                        className="w-20 px-3 py-1.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm"
                        placeholder="From"
                      />
                      <span className="text-xs">to</span>
                      <input
                        type="number"
                        min={1}
                        max={pageCount}
                        value={rangeEnd}
                        onChange={(e) => setRangeEnd(parseInt(e.target.value) || pageCount)}
                        className="w-20 px-3 py-1.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm"
                        placeholder="To"
                      />
                    </div>
                  )}
                </div>
              </label>

              <label className="flex items-center gap-3 p-3 bg-[var(--muted)] rounded-xl cursor-pointer hover:bg-[var(--muted)]/80">
                <input
                  type="radio"
                  name="splitMode"
                  checked={splitMode === "custom"}
                  onChange={() => setSplitMode("custom")}
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">Custom Pages</div>
                  <div className="text-xs text-[var(--muted-foreground)] mb-2">e.g., 1,3,5-7,10</div>
                  {splitMode === "custom" && (
                    <input
                      type="text"
                      value={customPages}
                      onChange={(e) => setCustomPages(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-[var(--background)] border border-[var(--border)] text-sm mt-2"
                      placeholder="1,3,5-7,10"
                    />
                  )}
                </div>
              </label>
            </div>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        <Button
          onClick={splitPDF}
          disabled={!file || splitting}
          className="w-full"
        >
          {splitting ? "Splitting..." : "Split PDF"}
        </Button>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <p className="text-sm text-blue-400">
            <strong>Note:</strong> All splitting happens in your browser. Files never leave your device.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
