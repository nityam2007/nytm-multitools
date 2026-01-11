// TXT to PDF Converter | TypeScript
"use client";

import { useState, useCallback, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("txt-to-pdf")!;
const similarTools = getToolsByCategory("converter").filter(t => t.slug !== "txt-to-pdf");

type FontFamily = "helvetica" | "times" | "courier";
type PageSize = "a4" | "letter" | "legal";

interface Settings {
  fontSize: number;
  lineHeight: number;
  fontFamily: FontFamily;
  pageSize: PageSize;
  margin: number;
}

export default function TxtToPdfPage() {
  const [textContent, setTextContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState("");
  const [settings, setSettings] = useState<Settings>({
    fontSize: 12,
    lineHeight: 1.5,
    fontFamily: "helvetica",
    pageSize: "a4",
    margin: 20,
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".txt") && file.type !== "text/plain") {
      setError("Please select a .txt file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setTextContent(content);
      setFileName(file.name.replace(/\.txt$/i, ""));
      setError("");
    };
    reader.onerror = () => {
      setError("Failed to read file");
    };
    reader.readAsText(file);

    e.target.value = "";
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    if (!file.name.endsWith(".txt") && file.type !== "text/plain") {
      setError("Please drop a .txt file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setTextContent(content);
      setFileName(file.name.replace(/\.txt$/i, ""));
      setError("");
    };
    reader.readAsText(file);
  }, []);

  const convertToPDF = async () => {
    if (!textContent.trim()) {
      setError("Please add some text content");
      return;
    }

    setConverting(true);
    setError("");

    try {
      const { jsPDF } = await import("jspdf");

      const pdf = new jsPDF({
        orientation: "portrait",
        unit: "mm",
        format: settings.pageSize,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = settings.margin;
      const maxWidth = pageWidth - margin * 2;
      const lineHeightMm = (settings.fontSize * 0.3528) * settings.lineHeight;

      pdf.setFont(settings.fontFamily);
      pdf.setFontSize(settings.fontSize);

      const lines = pdf.splitTextToSize(textContent, maxWidth);
      let y = margin;

      for (let i = 0; i < lines.length; i++) {
        if (y + lineHeightMm > pageHeight - margin) {
          pdf.addPage();
          y = margin;
        }
        pdf.text(lines[i], margin, y);
        y += lineHeightMm;
      }

      const outputName = fileName || "document";
      pdf.save(`${outputName}.pdf`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create PDF");
    } finally {
      setConverting(false);
    }
  };

  const clearContent = () => {
    setTextContent("");
    setFileName("");
    setError("");
  };

  const wordCount = textContent.trim() ? textContent.trim().split(/\s+/).length : 0;
  const charCount = textContent.length;

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* File Upload Zone */}
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center hover:border-violet-500/50 transition-colors"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".txt,text/plain"
            onChange={handleFileUpload}
            className="hidden"
            id="txt-upload"
          />
          <label htmlFor="txt-upload" className="cursor-pointer">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-violet-500/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <p className="font-semibold text-lg mb-1">Drop a .txt file here</p>
            <p className="text-sm text-[var(--muted-foreground)]">or click to browse</p>
          </label>
        </div>

        {/* Text Input Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium">Or paste/type your text:</label>
            {textContent && (
              <button
                onClick={clearContent}
                className="text-xs text-[var(--muted-foreground)] hover:text-red-500 transition-colors"
              >
                Clear
              </button>
            )}
          </div>
          <textarea
            value={textContent}
            onChange={(e) => setTextContent(e.target.value)}
            placeholder="Paste or type your text here..."
            className="w-full h-64 p-4 rounded-xl bg-[var(--muted)] border border-[var(--border)] focus:border-violet-500/50 focus:outline-none resize-none font-mono text-sm"
          />
          {textContent && (
            <div className="flex gap-4 text-xs text-[var(--muted-foreground)]">
              <span>{wordCount.toLocaleString()} words</span>
              <span>{charCount.toLocaleString()} characters</span>
            </div>
          )}
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
            {error}
          </div>
        )}

        {/* Settings Panel */}
        <div className="p-5 rounded-xl bg-[var(--card)] border border-[var(--border)] space-y-4">
          <h3 className="font-semibold">PDF Settings</h3>
          
          <div className="grid sm:grid-cols-2 gap-4">
            {/* Font Size */}
            <div className="space-y-2">
              <label className="text-sm text-[var(--muted-foreground)]">Font Size: {settings.fontSize}pt</label>
              <input
                type="range"
                min="8"
                max="24"
                value={settings.fontSize}
                onChange={(e) => setSettings(s => ({ ...s, fontSize: parseInt(e.target.value) }))}
                className="w-full accent-violet-500"
              />
            </div>

            {/* Line Height */}
            <div className="space-y-2">
              <label className="text-sm text-[var(--muted-foreground)]">Line Height: {settings.lineHeight}x</label>
              <input
                type="range"
                min="1"
                max="2.5"
                step="0.1"
                value={settings.lineHeight}
                onChange={(e) => setSettings(s => ({ ...s, lineHeight: parseFloat(e.target.value) }))}
                className="w-full accent-violet-500"
              />
            </div>

            {/* Font Family */}
            <div className="space-y-2">
              <label className="text-sm text-[var(--muted-foreground)]">Font</label>
              <div className="flex gap-2">
                {([
                  { value: "helvetica", label: "Sans-serif" },
                  { value: "times", label: "Serif" },
                  { value: "courier", label: "Monospace" },
                ] as const).map(font => (
                  <button
                    key={font.value}
                    onClick={() => setSettings(s => ({ ...s, fontFamily: font.value }))}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      settings.fontFamily === font.value
                        ? "bg-violet-500 text-white"
                        : "bg-[var(--muted)] hover:bg-[var(--muted)]/80"
                    }`}
                  >
                    {font.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Page Size */}
            <div className="space-y-2">
              <label className="text-sm text-[var(--muted-foreground)]">Page Size</label>
              <div className="flex gap-2">
                {([
                  { value: "a4", label: "A4" },
                  { value: "letter", label: "Letter" },
                  { value: "legal", label: "Legal" },
                ] as const).map(size => (
                  <button
                    key={size.value}
                    onClick={() => setSettings(s => ({ ...s, pageSize: size.value }))}
                    className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                      settings.pageSize === size.value
                        ? "bg-violet-500 text-white"
                        : "bg-[var(--muted)] hover:bg-[var(--muted)]/80"
                    }`}
                  >
                    {size.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Margin */}
          <div className="space-y-2">
            <label className="text-sm text-[var(--muted-foreground)]">Margin: {settings.margin}mm</label>
            <input
              type="range"
              min="10"
              max="40"
              value={settings.margin}
              onChange={(e) => setSettings(s => ({ ...s, margin: parseInt(e.target.value) }))}
              className="w-full accent-violet-500"
            />
          </div>
        </div>

        {/* Convert Button */}
        <button
          onClick={convertToPDF}
          disabled={!textContent.trim() || converting}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-500 to-purple-500 text-white font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {converting ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Converting...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Convert to PDF
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
