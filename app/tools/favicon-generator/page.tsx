"use client";

import { useState, useRef, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("favicon-generator")!;
const similarTools = getToolsByCategory("image").filter(t => t.slug !== "favicon-generator");

const faviconSizes = [16, 32, 48, 64, 96, 128, 192, 256, 512];
const appleSizes = [57, 60, 72, 76, 114, 120, 144, 152, 180];

export default function FaviconGeneratorPage() {
  const [image, setImage] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<number[]>([16, 32, 180, 192, 512]);
  const [bgColor, setBgColor] = useState("#ffffff");
  const [borderRadius, setBorderRadius] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const toggleSize = (size: number) => {
    setSelectedSizes((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size].sort((a, b) => a - b)
    );
  };

  const generateFavicon = useCallback((size: number) => {
    if (!image || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    
    canvas.width = size;
    canvas.height = size;

    // Fill background
    ctx.fillStyle = bgColor;
    if (borderRadius > 0) {
      const radius = (borderRadius / 100) * (size / 2);
      ctx.beginPath();
      ctx.roundRect(0, 0, size, size, radius);
      ctx.fill();
      ctx.clip();
    } else {
      ctx.fillRect(0, 0, size, size);
    }

    const img = new Image();
    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);

      const link = document.createElement("a");
      link.download = `favicon-${size}x${size}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = image;
  }, [image, bgColor, borderRadius]);

  const downloadAll = useCallback(async () => {
    if (!image || !canvasRef.current) return;

    for (const size of selectedSizes) {
      await new Promise<void>((resolve) => {
        const canvas = canvasRef.current!;
        const ctx = canvas.getContext("2d")!;
        
        canvas.width = size;
        canvas.height = size;

        ctx.fillStyle = bgColor;
        if (borderRadius > 0) {
          const radius = (borderRadius / 100) * (size / 2);
          ctx.beginPath();
          ctx.roundRect(0, 0, size, size, radius);
          ctx.fill();
          ctx.save();
          ctx.clip();
        } else {
          ctx.fillRect(0, 0, size, size);
        }

        const img = new Image();
        img.onload = () => {
          ctx.drawImage(img, 0, 0, size, size);
          
          const link = document.createElement("a");
          link.download = `favicon-${size}x${size}.png`;
          link.href = canvas.toDataURL("image/png");
          link.click();
          
          setTimeout(resolve, 300);
        };
        img.src = image;
      });
    }
  }, [image, selectedSizes, bgColor, borderRadius]);

  const selectAll = () => setSelectedSizes([...faviconSizes, ...appleSizes].filter((v, i, a) => a.indexOf(v) === i).sort((a, b) => a - b));
  const selectNone = () => setSelectedSizes([]);
  const selectCommon = () => setSelectedSizes([16, 32, 180, 192, 512]);

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="flex justify-center mb-2">
              <svg className="w-10 h-10 text-[var(--muted-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <p className="font-medium">Click to upload an image</p>
            <p className="text-sm text-[var(--muted-foreground)]">
              Square images work best (512x512 or larger)
            </p>
          </label>
        </div>

        {image && (
          <>
            <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
              <h3 className="font-semibold mb-4">Preview</h3>
              <div className="flex flex-wrap justify-center gap-4 items-end">
                {[16, 32, 64, 128].map((size) => (
                  <div key={size} className="text-center">
                    <div 
                      className="mx-auto mb-2 overflow-hidden"
                      style={{ 
                        width: size, 
                        height: size,
                        borderRadius: `${(borderRadius / 100) * (size / 2)}px`,
                        backgroundColor: bgColor,
                      }}
                    >
                      <img
                        src={image}
                        alt={`${size}px`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-xs text-[var(--muted-foreground)]">{size}px</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
                <h3 className="font-semibold mb-3">Background Color</h3>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-12 h-12 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="flex-1 px-3 py-2 rounded bg-[var(--background)] border border-[var(--border)] font-mono"
                  />
                </div>
              </div>

              <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
                <h3 className="font-semibold mb-3">Border Radius: {borderRadius}%</h3>
                <input
                  type="range"
                  value={borderRadius}
                  onChange={(e) => setBorderRadius(parseInt(e.target.value))}
                  min="0"
                  max="50"
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-[var(--muted-foreground)] mt-1">
                  <span>Square</span>
                  <span>Circle</span>
                </div>
              </div>
            </div>

            <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <h3 className="font-semibold">Sizes to Generate</h3>
                <div className="flex gap-2">
                  <button
                    onClick={selectCommon}
                    className="text-xs px-2 py-1 rounded bg-[var(--muted)] hover:bg-[var(--accent)]"
                  >
                    Common
                  </button>
                  <button
                    onClick={selectAll}
                    className="text-xs px-2 py-1 rounded bg-[var(--muted)] hover:bg-[var(--accent)]"
                  >
                    All
                  </button>
                  <button
                    onClick={selectNone}
                    className="text-xs px-2 py-1 rounded bg-[var(--muted)] hover:bg-[var(--accent)]"
                  >
                    None
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <div className="text-sm text-[var(--muted-foreground)] mb-2">Standard Favicon</div>
                  <div className="flex flex-wrap gap-2">
                    {faviconSizes.map((size) => (
                      <button
                        key={size}
                        onClick={() => toggleSize(size)}
                        className={`px-3 py-1 rounded text-sm ${
                          selectedSizes.includes(size)
                            ? "bg-blue-500 text-white"
                            : "bg-[var(--muted)] hover:bg-[var(--accent)]"
                        }`}
                      >
                        {size}px
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-[var(--muted-foreground)] mb-2">Apple Touch Icons</div>
                  <div className="flex flex-wrap gap-2">
                    {appleSizes.map((size) => (
                      <button
                        key={`apple-${size}`}
                        onClick={() => toggleSize(size)}
                        className={`px-3 py-1 rounded text-sm ${
                          selectedSizes.includes(size)
                            ? "bg-blue-500 text-white"
                            : "bg-[var(--muted)] hover:bg-[var(--accent)]"
                        }`}
                      >
                        {size}px
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <button
                onClick={downloadAll}
                disabled={selectedSizes.length === 0}
                className="py-4 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700 disabled:opacity-50"
              >
                ⬇ Download All ({selectedSizes.length} sizes)
              </button>
              <button
                onClick={() => generateFavicon(32)}
                className="py-4 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700"
              >
                ⬇ Download 32x32 Only
              </button>
            </div>
          </>
        )}

        <canvas ref={canvasRef} className="hidden" />

        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            Favicon Size Guide
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-2 px-3">Size</th>
                  <th className="text-left py-2 px-3">Usage</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-2 px-3">16×16</td>
                  <td className="py-2 px-3">Browser tab</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-2 px-3">32×32</td>
                  <td className="py-2 px-3">Standard favicon</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-2 px-3">180×180</td>
                  <td className="py-2 px-3">Apple Touch Icon</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-2 px-3">192×192</td>
                  <td className="py-2 px-3">Android Chrome</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">512×512</td>
                  <td className="py-2 px-3">PWA splash screen</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
