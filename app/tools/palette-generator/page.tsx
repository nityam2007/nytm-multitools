"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("palette-generator")!;
const similarTools = getToolsByCategory("image").filter(t => t.slug !== "palette-generator");

interface ColorInfo {
  hex: string;
  rgb: string;
  count: number;
}

export default function PaletteGeneratorPage() {
  const [image, setImage] = useState<string | null>(null);
  const [colors, setColors] = useState<ColorInfo[]>([]);
  const [numColors, setNumColors] = useState(5);
  const [isExtracting, setIsExtracting] = useState(false);
  const [copiedColor, setCopiedColor] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setColors([]);
    };
    reader.readAsDataURL(file);
  }, []);

  const extractColors = useCallback(() => {
    if (!image || !canvasRef.current) return;

    setIsExtracting(true);
    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;
      
      // Resize for faster processing
      const maxSize = 100;
      const scale = Math.min(maxSize / img.width, maxSize / img.height);
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      
      // Count colors
      const colorMap = new Map<string, number>();
      
      for (let i = 0; i < data.length; i += 4) {
        const r = Math.round(data[i] / 16) * 16;
        const g = Math.round(data[i + 1] / 16) * 16;
        const b = Math.round(data[i + 2] / 16) * 16;
        const key = `${r},${g},${b}`;
        colorMap.set(key, (colorMap.get(key) || 0) + 1);
      }
      
      // Sort by frequency and get top colors
      const sortedColors = Array.from(colorMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, numColors * 3) // Get more to filter similar colors
        .map(([rgb, count]) => {
          const [r, g, b] = rgb.split(",").map(Number);
          const hex = `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
          return { hex, rgb: `rgb(${r}, ${g}, ${b})`, count };
        });
      
      // Filter similar colors
      const distinctColors: ColorInfo[] = [];
      for (const color of sortedColors) {
        const [r, g, b] = color.rgb.match(/\d+/g)!.map(Number);
        const isSimilar = distinctColors.some(c => {
          const [cr, cg, cb] = c.rgb.match(/\d+/g)!.map(Number);
          const diff = Math.abs(r - cr) + Math.abs(g - cg) + Math.abs(b - cb);
          return diff < 60;
        });
        
        if (!isSimilar) {
          distinctColors.push(color);
          if (distinctColors.length >= numColors) break;
        }
      }
      
      setColors(distinctColors);
      setIsExtracting(false);
    };
    img.src = image;
  }, [image, numColors]);

  useEffect(() => {
    if (image) {
      extractColors();
    }
  }, [image, numColors]);

  const copyColor = async (color: string) => {
    await navigator.clipboard.writeText(color);
    setCopiedColor(color);
    setTimeout(() => setCopiedColor(null), 1500);
  };

  const getContrastColor = (hex: string) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.5 ? "#000000" : "#ffffff";
  };

  const exportPalette = (formatType: "css" | "scss" | "json" | "tailwind") => {
    let content = "";
    const colorNames = ["primary", "secondary", "tertiary", "quaternary", "quinary", "senary", "septenary", "octonary", "nonary", "denary"];
    
    switch (formatType) {
      case "css":
        content = `:root {\n${colors.map((c, i) => `  --color-${colorNames[i] || i}: ${c.hex};`).join("\n")}\n}`;
        break;
      case "scss":
        content = colors.map((c, i) => `$color-${colorNames[i] || i}: ${c.hex};`).join("\n");
        break;
      case "json":
        content = JSON.stringify(Object.fromEntries(colors.map((c, i) => [colorNames[i] || `color${i}`, c.hex])), null, 2);
        break;
      case "tailwind":
        content = `module.exports = {\n  colors: {\n${colors.map((c, i) => `    '${colorNames[i] || i}': '${c.hex}',`).join("\n")}\n  }\n}`;
        break;
    }
    
    navigator.clipboard.writeText(content);
    alert(`${formatType.toUpperCase()} palette copied to clipboard!`);
  };

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
            <div className="text-4xl mb-2">🎨</div>
            <p className="font-medium">Click to upload an image</p>
            <p className="text-sm text-[var(--muted-foreground)]">
              Extract color palette from any image
            </p>
          </label>
        </div>

        {image && (
          <>
            <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
              <img
                src={image}
                alt="Uploaded"
                className="max-w-full max-h-64 mx-auto rounded-lg object-contain"
              />
            </div>

            <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-medium">Number of Colors: {numColors}</label>
                <button
                  onClick={extractColors}
                  disabled={isExtracting}
                  className="text-sm px-3 py-1 rounded bg-[var(--muted)] hover:bg-[var(--accent)]"
                >
                  ↻ Re-extract
                </button>
              </div>
              <input
                type="range"
                value={numColors}
                onChange={(e) => setNumColors(parseInt(e.target.value))}
                min="3"
                max="10"
                className="w-full"
              />
            </div>

            {isExtracting ? (
              <div className="text-center py-8">
                <div className="text-4xl animate-pulse">🎨</div>
                <p className="mt-2 text-[var(--muted-foreground)]">Extracting colors...</p>
              </div>
            ) : colors.length > 0 && (
              <>
                <div className="bg-[var(--card)] rounded-xl overflow-hidden border border-[var(--border)]">
                  <div className="flex h-24">
                    {colors.map((color, idx) => (
                      <div
                        key={idx}
                        className="flex-1 flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity relative"
                        style={{ backgroundColor: color.hex }}
                        onClick={() => copyColor(color.hex)}
                      >
                        {copiedColor === color.hex && (
                          <span 
                            className="absolute text-sm font-bold"
                            style={{ color: getContrastColor(color.hex) }}
                          >
                            Copied!
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {colors.map((color, idx) => (
                    <div
                      key={idx}
                      className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)] flex items-center gap-3"
                    >
                      <div
                        className="w-12 h-12 rounded-lg flex-shrink-0 cursor-pointer"
                        style={{ backgroundColor: color.hex }}
                        onClick={() => copyColor(color.hex)}
                      />
                      <div className="flex-1 min-w-0">
                        <div 
                          className="font-mono text-sm font-bold cursor-pointer hover:underline"
                          onClick={() => copyColor(color.hex)}
                        >
                          {color.hex}
                        </div>
                        <div 
                          className="font-mono text-xs text-[var(--muted-foreground)] cursor-pointer hover:underline"
                          onClick={() => copyColor(color.rgb)}
                        >
                          {color.rgb}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
                  <h3 className="font-semibold mb-3">Export Palette</h3>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => exportPalette("css")}
                      className="px-4 py-2 rounded bg-[var(--muted)] hover:bg-[var(--accent)]"
                    >
                      CSS Variables
                    </button>
                    <button
                      onClick={() => exportPalette("scss")}
                      className="px-4 py-2 rounded bg-[var(--muted)] hover:bg-[var(--accent)]"
                    >
                      SCSS Variables
                    </button>
                    <button
                      onClick={() => exportPalette("json")}
                      className="px-4 py-2 rounded bg-[var(--muted)] hover:bg-[var(--accent)]"
                    >
                      JSON
                    </button>
                    <button
                      onClick={() => exportPalette("tailwind")}
                      className="px-4 py-2 rounded bg-[var(--muted)] hover:bg-[var(--accent)]"
                    >
                      Tailwind Config
                    </button>
                  </div>
                </div>
              </>
            )}
          </>
        )}

        <canvas ref={canvasRef} className="hidden" />

        <div className="bg-[var(--muted)] rounded-xl p-4 text-sm text-[var(--muted-foreground)]">
          <h4 className="font-medium mb-2">💡 Tips:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>Click on any color to copy it</li>
            <li>Works best with photos that have distinct colors</li>
            <li>Export palettes for use in your design projects</li>
          </ul>
        </div>
      </div>
    </ToolLayout>
  );
}
