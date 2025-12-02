"use client";

import { useState, useRef, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("svg-to-png")!;
const similarTools = getToolsByCategory("image").filter(t => t.slug !== "svg-to-png");

export default function SvgToPngPage() {
  const [svgContent, setSvgContent] = useState("");
  const [svgFile, setSvgFile] = useState<string | null>(null);
  const [scale, setScale] = useState(1);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);
  const [bgColor, setBgColor] = useState("transparent");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setSvgContent(content);
      parseSvgDimensions(content);
    };
    reader.readAsText(file);
  }, []);

  const parseSvgDimensions = (svg: string) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(svg, "image/svg+xml");
    const svgEl = doc.querySelector("svg");
    
    if (svgEl) {
      let w = parseFloat(svgEl.getAttribute("width") || "0");
      let h = parseFloat(svgEl.getAttribute("height") || "0");
      
      if (!w || !h) {
        const viewBox = svgEl.getAttribute("viewBox");
        if (viewBox) {
          const parts = viewBox.split(/\s+/);
          w = parseFloat(parts[2]) || 100;
          h = parseFloat(parts[3]) || 100;
        }
      }
      
      setWidth(w || 100);
      setHeight(h || 100);
      
      // Create blob URL for preview
      const blob = new Blob([svg], { type: "image/svg+xml" });
      setSvgFile(URL.createObjectURL(blob));
    }
  };

  const handleSvgInput = (content: string) => {
    setSvgContent(content);
    if (content.trim().startsWith("<svg")) {
      parseSvgDimensions(content);
    }
  };

  const convertToPng = useCallback(() => {
    if (!svgContent || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d")!;
    
    const finalWidth = Math.round(width * scale);
    const finalHeight = Math.round(height * scale);
    
    canvas.width = finalWidth;
    canvas.height = finalHeight;

    // Fill background
    if (bgColor !== "transparent") {
      ctx.fillStyle = bgColor;
      ctx.fillRect(0, 0, finalWidth, finalHeight);
    }

    // Convert SVG to image
    const img = new Image();
    const blob = new Blob([svgContent], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    img.onload = () => {
      ctx.drawImage(img, 0, 0, finalWidth, finalHeight);
      URL.revokeObjectURL(url);

      // Download
      const link = document.createElement("a");
      link.download = `converted_${finalWidth}x${finalHeight}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };

    img.onerror = () => {
      alert("Error converting SVG. Please check if the SVG is valid.");
      URL.revokeObjectURL(url);
    };

    img.src = url;
  }, [svgContent, width, height, scale, bgColor]);

  const scalePresets = [0.5, 1, 2, 3, 4];

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center">
          <input
            type="file"
            accept=".svg"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload" className="cursor-pointer">
            <div className="text-4xl mb-2 flex justify-center"><svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
            <p className="font-medium">Click to upload an SVG file</p>
            <p className="text-sm text-[var(--muted-foreground)]">
              Or paste SVG code below
            </p>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">SVG Code</label>
          <textarea
            value={svgContent}
            onChange={(e) => handleSvgInput(e.target.value)}
            placeholder='Paste SVG code here (e.g., <svg xmlns="http://www.w3.org/2000/svg" ...>)'
            className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)] font-mono text-sm min-h-[150px]"
          />
        </div>

        {svgFile && (
          <>
            <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
              <h3 className="font-semibold mb-4">Preview</h3>
              <div 
                className="flex justify-center p-4 rounded-lg"
                style={{ 
                  background: bgColor === "transparent" 
                    ? "repeating-conic-gradient(#80808020 0% 25%, transparent 0% 50%) 50% / 20px 20px" 
                    : bgColor 
                }}
              >
                <img
                  src={svgFile}
                  alt="SVG Preview"
                  className="max-w-full max-h-64 object-contain"
                />
              </div>
              <div className="text-center mt-3 text-sm text-[var(--muted-foreground)]">
                Original: {width} × {height}px
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
                <h3 className="font-semibold mb-3">Scale</h3>
                <div className="flex flex-wrap gap-2 mb-3">
                  {scalePresets.map((s) => (
                    <button
                      key={s}
                      onClick={() => setScale(s)}
                      className={`px-3 py-1 rounded ${
                        scale === s
                          ? "bg-blue-500 text-white"
                          : "bg-[var(--muted)] hover:bg-[var(--accent)]"
                      }`}
                    >
                      {s}x
                    </button>
                  ))}
                </div>
                <input
                  type="range"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  min="0.1"
                  max="10"
                  step="0.1"
                  className="w-full"
                />
                <div className="text-sm text-center mt-2">
                  Output: {Math.round(width * scale)} × {Math.round(height * scale)}px
                </div>
              </div>

              <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
                <h3 className="font-semibold mb-3">Background</h3>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setBgColor("transparent")}
                    className={`px-3 py-1 rounded ${
                      bgColor === "transparent"
                        ? "bg-blue-500 text-white"
                        : "bg-[var(--muted)]"
                    }`}
                    style={{ background: bgColor === "transparent" ? undefined : "repeating-conic-gradient(#80808040 0% 25%, transparent 0% 50%) 50% / 10px 10px" }}
                  >
                    Transparent
                  </button>
                  <button
                    onClick={() => setBgColor("#ffffff")}
                    className={`px-3 py-1 rounded border ${
                      bgColor === "#ffffff" ? "ring-2 ring-blue-500" : ""
                    }`}
                    style={{ background: "#ffffff", color: "#000" }}
                  >
                    White
                  </button>
                  <button
                    onClick={() => setBgColor("#000000")}
                    className={`px-3 py-1 rounded ${
                      bgColor === "#000000" ? "ring-2 ring-blue-500" : ""
                    }`}
                    style={{ background: "#000000", color: "#fff" }}
                  >
                    Black
                  </button>
                  <input
                    type="color"
                    value={bgColor === "transparent" ? "#ffffff" : bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="w-8 h-8 rounded cursor-pointer"
                    title="Custom color"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={convertToPng}
              className="w-full py-4 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700"
            >
              ⬇ Convert to PNG ({Math.round(width * scale)} × {Math.round(height * scale)}px)
            </button>
          </>
        )}

        <canvas ref={canvasRef} className="hidden" />

        <div className="bg-[var(--muted)] rounded-xl p-4 text-sm text-[var(--muted-foreground)]">
          <h4 className="font-medium mb-2 flex items-center gap-2"><svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>Tips:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Use higher scale for better quality when printing</li>
            <li>SVG preserves quality at any size - scale up without blur</li>
            <li>Transparent background is useful for logos and icons</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
