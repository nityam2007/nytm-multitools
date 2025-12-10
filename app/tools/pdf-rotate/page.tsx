// PDF Rotate Tool | TypeScript
"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/Button";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("pdf-rotate")!;
const similarTools = getToolsByCategory("converter").filter(t => t.slug !== "pdf-rotate");

export default function PDFRotatePage() {
  const [file, setFile] = useState<File | null>(null);
  const [pageCount, setPageCount] = useState(0);
  const [rotating, setRotating] = useState(false);
  const [error, setError] = useState("");
  const [rotation, setRotation] = useState<90 | 180 | 270>(90);
  const [applyTo, setApplyTo] = useState<"all" | "even" | "odd" | "custom">("all");
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
    } catch (err) {
      setError("Failed to read PDF file");
    }
  }, []);

  const rotatePDF = async () => {
    if (!file) {
      setError("Please upload a PDF file");
      return;
    }

    setRotating(true);
    setError("");

    try {
      const { PDFDocument, degrees } = await import("pdf-lib");
      
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      let pagesToRotate: number[] = [];

      if (applyTo === "all") {
        pagesToRotate = Array.from({ length: pageCount }, (_, i) => i);
      } else if (applyTo === "even") {
        pagesToRotate = Array.from({ length: pageCount }, (_, i) => i).filter(i => (i + 1) % 2 === 0);
      } else if (applyTo === "odd") {
        pagesToRotate = Array.from({ length: pageCount }, (_, i) => i).filter(i => (i + 1) % 2 === 1);
      } else if (applyTo === "custom") {
        const parts = customPages.split(",").map(p => p.trim());
        for (const part of parts) {
          if (part.includes("-")) {
            const [start, end] = part.split("-").map(n => parseInt(n.trim()));
            if (!isNaN(start) && !isNaN(end)) {
              for (let i = start; i <= end; i++) {
                if (i >= 1 && i <= pageCount) {
                  pagesToRotate.push(i - 1);
                }
              }
            }
          } else {
            const pageNum = parseInt(part);
            if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= pageCount) {
              pagesToRotate.push(pageNum - 1);
            }
          }
        }
        pagesToRotate = [...new Set(pagesToRotate)].sort((a, b) => a - b);
      }

      if (pagesToRotate.length === 0) {
        setError("No pages selected");
        setRotating(false);
        return;
      }

      const pages = pdfDoc.getPages();
      pagesToRotate.forEach(pageIndex => {
        const page = pages[pageIndex];
        page.setRotation(degrees(rotation));
      });

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = file.name.replace(/\.pdf$/i, "_rotated.pdf");
      link.click();

      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to rotate PDF");
    } finally {
      setRotating(false);
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
          <>
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
              <h3 className="text-sm font-semibold mb-4">Rotation Angle</h3>
              <div className="grid grid-cols-3 gap-3">
                {([90, 180, 270] as const).map((angle) => (
                  <button
                    key={angle}
                    onClick={() => setRotation(angle)}
                    className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                      rotation === angle
                        ? "bg-violet-500 text-white"
                        : "bg-[var(--muted)] hover:bg-[var(--muted)]/80"
                    }`}
                  >
                    {angle}°
                  </button>
                ))}
              </div>
              <p className="text-xs text-[var(--muted-foreground)] mt-3 text-center">
                Rotate {rotation}° clockwise
              </p>
            </div>

            <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
              <h3 className="text-sm font-semibold mb-4">Apply To</h3>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 bg-[var(--muted)] rounded-xl cursor-pointer hover:bg-[var(--muted)]/80">
                  <input
                    type="radio"
                    name="applyTo"
                    checked={applyTo === "all"}
                    onChange={() => setApplyTo("all")}
                    className="w-4 h-4"
                  />
                  <div>
                    <div className="text-sm font-medium">All Pages</div>
                    <div className="text-xs text-[var(--muted-foreground)]">Rotate every page</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-[var(--muted)] rounded-xl cursor-pointer hover:bg-[var(--muted)]/80">
                  <input
                    type="radio"
                    name="applyTo"
                    checked={applyTo === "even"}
                    onChange={() => setApplyTo("even")}
                    className="w-4 h-4"
                  />
                  <div>
                    <div className="text-sm font-medium">Even Pages</div>
                    <div className="text-xs text-[var(--muted-foreground)]">Pages 2, 4, 6, etc.</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-[var(--muted)] rounded-xl cursor-pointer hover:bg-[var(--muted)]/80">
                  <input
                    type="radio"
                    name="applyTo"
                    checked={applyTo === "odd"}
                    onChange={() => setApplyTo("odd")}
                    className="w-4 h-4"
                  />
                  <div>
                    <div className="text-sm font-medium">Odd Pages</div>
                    <div className="text-xs text-[var(--muted-foreground)]">Pages 1, 3, 5, etc.</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3 bg-[var(--muted)] rounded-xl cursor-pointer hover:bg-[var(--muted)]/80">
                  <input
                    type="radio"
                    name="applyTo"
                    checked={applyTo === "custom"}
                    onChange={() => setApplyTo("custom")}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium">Custom Pages</div>
                    <div className="text-xs text-[var(--muted-foreground)] mb-2">e.g., 1,3,5-7,10</div>
                    {applyTo === "custom" && (
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
          </>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        <Button
          onClick={rotatePDF}
          disabled={!file || rotating}
          className="w-full"
        >
          {rotating ? "Rotating..." : "Rotate PDF"}
        </Button>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <p className="text-sm text-blue-400">
            <strong>Note:</strong> All rotation happens in your browser. Files never leave your device.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
