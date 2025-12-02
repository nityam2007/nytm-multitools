"use client";

import { useState, useRef, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("image-filters")!;
const similarTools = getToolsByCategory("image").filter(t => t.slug !== "image-filters");

interface Filters {
  brightness: number;
  contrast: number;
  saturation: number;
  blur: number;
  grayscale: number;
  sepia: number;
  hueRotate: number;
  invert: number;
}

const defaultFilters: Filters = {
  brightness: 100,
  contrast: 100,
  saturation: 100,
  blur: 0,
  grayscale: 0,
  sepia: 0,
  hueRotate: 0,
  invert: 0,
};

const presets: { name: string; filters: Filters }[] = [
  { name: "Normal", filters: defaultFilters },
  { name: "Vintage", filters: { ...defaultFilters, sepia: 40, saturation: 80, contrast: 110 } },
  { name: "B&W", filters: { ...defaultFilters, grayscale: 100 } },
  { name: "High Contrast", filters: { ...defaultFilters, contrast: 150, saturation: 120 } },
  { name: "Fade", filters: { ...defaultFilters, brightness: 110, saturation: 80, contrast: 90 } },
  { name: "Warm", filters: { ...defaultFilters, sepia: 20, saturation: 110, brightness: 105 } },
  { name: "Cool", filters: { ...defaultFilters, hueRotate: 180, saturation: 90 } },
  { name: "Dramatic", filters: { ...defaultFilters, contrast: 140, brightness: 90, saturation: 130 } },
];

export default function ImageFiltersPage() {
  const [image, setImage] = useState<string | null>(null);
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const [fileName, setFileName] = useState("");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setFilters(defaultFilters);
    };
    reader.readAsDataURL(file);
  }, []);

  const getFilterStyle = () => {
    return `
      brightness(${filters.brightness}%)
      contrast(${filters.contrast}%)
      saturate(${filters.saturation}%)
      blur(${filters.blur}px)
      grayscale(${filters.grayscale}%)
      sepia(${filters.sepia}%)
      hue-rotate(${filters.hueRotate}deg)
      invert(${filters.invert}%)
    `.trim();
  };

  const downloadImage = useCallback(() => {
    if (!image || !canvasRef.current) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;

      canvas.width = img.width;
      canvas.height = img.height;

      // Apply CSS filters via canvas
      ctx.filter = getFilterStyle();
      ctx.drawImage(img, 0, 0);

      // Download
      const link = document.createElement("a");
      link.download = `filtered_${fileName || "image.png"}`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = image;
  }, [image, filters, fileName]);

  const updateFilter = (key: keyof Filters, value: number) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filterControls: { key: keyof Filters; label: string; min: number; max: number; unit: string }[] = [
    { key: "brightness", label: "Brightness", min: 0, max: 200, unit: "%" },
    { key: "contrast", label: "Contrast", min: 0, max: 200, unit: "%" },
    { key: "saturation", label: "Saturation", min: 0, max: 200, unit: "%" },
    { key: "blur", label: "Blur", min: 0, max: 20, unit: "px" },
    { key: "grayscale", label: "Grayscale", min: 0, max: 100, unit: "%" },
    { key: "sepia", label: "Sepia", min: 0, max: 100, unit: "%" },
    { key: "hueRotate", label: "Hue Rotate", min: 0, max: 360, unit: "°" },
    { key: "invert", label: "Invert", min: 0, max: 100, unit: "%" },
  ];

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
              <svg className="w-12 h-12 text-[var(--muted-foreground)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
              </svg>
            </div>
            <p className="font-medium">Click to upload an image</p>
            <p className="text-sm text-[var(--muted-foreground)]">
              Apply filters and effects to your image
            </p>
          </label>
        </div>

        {image && (
          <>
            <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
              <div className="flex justify-center mb-4">
                <img
                  src={image}
                  alt="Preview"
                  className="max-w-full max-h-80 object-contain rounded-lg"
                  style={{ filter: getFilterStyle() }}
                />
              </div>
            </div>

            <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
              <h3 className="font-semibold mb-4">Presets</h3>
              <div className="flex flex-wrap gap-2">
                {presets.map((preset) => (
                  <button
                    key={preset.name}
                    onClick={() => setFilters(preset.filters)}
                    className="px-4 py-2 rounded-lg bg-[var(--muted)] hover:bg-[var(--accent)] text-sm font-medium"
                  >
                    {preset.name}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-semibold">Adjustments</h3>
                <button
                  onClick={() => setFilters(defaultFilters)}
                  className="text-sm px-3 py-1 rounded bg-[var(--muted)] hover:bg-[var(--accent)]"
                >
                  Reset All
                </button>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                {filterControls.map(({ key, label, min, max, unit }) => (
                  <div key={key}>
                    <div className="flex justify-between text-sm mb-1">
                      <label>{label}</label>
                      <span className="text-[var(--muted-foreground)]">
                        {filters[key]}{unit}
                      </span>
                    </div>
                    <input
                      type="range"
                      value={filters[key]}
                      onChange={(e) => updateFilter(key, parseInt(e.target.value))}
                      min={min}
                      max={max}
                      className="w-full h-2 bg-[var(--muted)] rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={downloadImage}
              className="w-full py-4 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700"
            >
              ⬇ Download Filtered Image
            </button>
          </>
        )}

        <canvas ref={canvasRef} className="hidden" />

        <div className="bg-[var(--muted)] rounded-xl p-4 text-sm text-[var(--muted-foreground)] flex items-start gap-2">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m3.75 2.383a14.406 14.406 0 01-3 0M14.25 18v-.192c0-.983.658-1.823 1.508-2.316a7.5 7.5 0 10-7.517 0c.85.493 1.509 1.333 1.509 2.316V18" />
          </svg>
          <p>All filters are applied in real-time using CSS filters. Download to save with filters applied.</p>
        </div>
      </div>
    </ToolLayout>
  );
}
