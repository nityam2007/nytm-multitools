// GIF to PNG Converter | TypeScript
"use client";

import { useState, useRef, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("gif-to-png")!;
const similarTools = getToolsByCategory("converter").filter(t => t.slug !== "gif-to-png");

export default function GIFToPNGPage() {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [convertedSize, setConvertedSize] = useState(0);
  const [converting, setConverting] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.includes("gif")) {
      alert("Please select a GIF file");
      return;
    }

    setFileName(file.name.replace(/\.[^/.]+$/, ""));
    setOriginalSize(file.size);
    setConvertedSize(0);
    
    const reader = new FileReader();
    reader.onload = (event) => setImage(event.target?.result as string);
    reader.readAsDataURL(file);
  }, []);

  const convert = useCallback(() => {
    if (!image || !canvasRef.current) return;
    setConverting(true);

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;

      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          setConvertedSize(blob.size);

          const link = document.createElement("a");
          link.download = `${fileName}.png`;
          link.href = URL.createObjectURL(blob);
          link.click();
          URL.revokeObjectURL(link.href);
          setConverting(false);
        },
        "image/png"
      );
    };
    img.src = image;
  }, [image, fileName]);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="max-w-xl mx-auto space-y-6">
        {/* Upload */}
        <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center hover:border-cyan-500/50 transition-colors">
          <input
            type="file"
            accept="image/gif"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cyan-500/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <p className="font-semibold mb-1">Drop GIF file here</p>
            <p className="text-sm text-[var(--muted-foreground)]">or click to browse</p>
          </label>
        </div>

        {image && (
          <>
            {/* Preview */}
            <div className="rounded-xl overflow-hidden border border-[var(--border)]">
              <img src={image} alt="Preview" className="w-full max-h-64 object-contain bg-[var(--muted)]" />
            </div>

            {/* Stats */}
            {convertedSize > 0 && (
              <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-[var(--muted)]">
                <div className="text-center">
                  <div className="text-xs text-[var(--muted-foreground)]">Original GIF</div>
                  <div className="font-bold">{formatSize(originalSize)}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-[var(--muted-foreground)]">Converted PNG</div>
                  <div className="font-bold">{formatSize(convertedSize)}</div>
                </div>
              </div>
            )}

            {/* Convert Button */}
            <button
              onClick={convert}
              disabled={converting}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
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
                  Convert to PNG
                </>
              )}
            </button>
          </>
        )}

        <canvas ref={canvasRef} className="hidden" />

        <div className="p-4 rounded-xl bg-[var(--muted)] text-sm text-[var(--muted-foreground)]">
          <p>Extracts the first frame from animated GIFs. PNG preserves transparency.</p>
        </div>
      </div>
    </ToolLayout>
  );
}
