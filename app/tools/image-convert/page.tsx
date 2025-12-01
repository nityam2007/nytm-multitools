"use client";

import { useState, useRef, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("image-convert")!;
const similarTools = getToolsByCategory("image").filter(t => t.slug !== "image-convert");

type OutputFormat = "png" | "jpeg" | "webp" | "gif";

const formats: { value: OutputFormat; label: string; mime: string }[] = [
  { value: "png", label: "PNG", mime: "image/png" },
  { value: "jpeg", label: "JPEG", mime: "image/jpeg" },
  { value: "webp", label: "WebP", mime: "image/webp" },
  { value: "gif", label: "GIF", mime: "image/gif" },
];

export default function ImageConvertPage() {
  const [image, setImage] = useState<string | null>(null);
  const [originalFormat, setOriginalFormat] = useState("");
  const [outputFormat, setOutputFormat] = useState<OutputFormat>("png");
  const [quality, setQuality] = useState(90);
  const [fileName, setFileName] = useState("");
  const [originalSize, setOriginalSize] = useState(0);
  const [convertedSize, setConvertedSize] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const extension = file.name.split(".").pop()?.toLowerCase() || "";
    setOriginalFormat(extension);
    setFileName(file.name.replace(/\.[^/.]+$/, ""));
    setOriginalSize(file.size);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      setImage(event.target?.result as string);
      setConvertedSize(0);
    };
    reader.readAsDataURL(file);
  }, []);

  const convertImage = useCallback(() => {
    if (!image || !canvasRef.current) return;

    const img = new Image();
    img.onload = () => {
      const canvas = canvasRef.current!;
      const ctx = canvas.getContext("2d")!;

      canvas.width = img.width;
      canvas.height = img.height;
      
      // For JPEG, fill with white background (no alpha channel)
      if (outputFormat === "jpeg") {
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      }
      
      ctx.drawImage(img, 0, 0);

      const mime = formats.find(f => f.value === outputFormat)?.mime || "image/png";
      const qualityVal = outputFormat === "png" ? undefined : quality / 100;
      const dataUrl = canvas.toDataURL(mime, qualityVal);
      
      // Calculate converted size
      const base64 = dataUrl.split(",")[1];
      const converted = atob(base64).length;
      setConvertedSize(converted);

      // Download
      const link = document.createElement("a");
      link.download = `${fileName}.${outputFormat}`;
      link.href = dataUrl;
      link.click();
    };
    img.src = image;
  }, [image, outputFormat, quality, fileName]);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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
            <div className="text-4xl mb-2">🔄</div>
            <p className="font-medium">Click to upload an image</p>
            <p className="text-sm text-[var(--muted-foreground)]">
              Convert between PNG, JPEG, WebP, and GIF
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
                  className="max-w-full max-h-64 object-contain rounded-lg"
                />
              </div>
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-[var(--muted)] px-4 py-2 rounded-full">
                  <span className="text-sm text-[var(--muted-foreground)]">Original:</span>
                  <span className="font-medium uppercase">{originalFormat}</span>
                  <span className="text-sm text-[var(--muted-foreground)]">
                    ({formatSize(originalSize)})
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
              <h3 className="font-semibold mb-4">Convert To</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {formats.map((format) => (
                  <button
                    key={format.value}
                    onClick={() => setOutputFormat(format.value)}
                    disabled={format.value === originalFormat}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      outputFormat === format.value
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-[var(--border)] hover:border-[var(--accent)]"
                    } ${format.value === originalFormat ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    <div className="text-lg font-bold">.{format.value}</div>
                    <div className="text-xs text-[var(--muted-foreground)]">{format.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {(outputFormat === "jpeg" || outputFormat === "webp") && (
              <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
                <h3 className="font-semibold mb-4">Quality: {quality}%</h3>
                <input
                  type="range"
                  value={quality}
                  onChange={(e) => setQuality(parseInt(e.target.value))}
                  min="10"
                  max="100"
                  className="w-full h-2 bg-[var(--muted)] rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-[var(--muted-foreground)] mt-2">
                  <span>Smaller file</span>
                  <span>Better quality</span>
                </div>
              </div>
            )}

            {convertedSize > 0 && (
              <div className="bg-[var(--muted)] rounded-xl p-4">
                <div className="grid sm:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-sm text-[var(--muted-foreground)]">Original Size</div>
                    <div className="font-bold">{formatSize(originalSize)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-[var(--muted-foreground)]">Converted Size</div>
                    <div className="font-bold">{formatSize(convertedSize)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-[var(--muted-foreground)]">Change</div>
                    <div className={`font-bold ${convertedSize < originalSize ? "text-green-500" : "text-red-500"}`}>
                      {convertedSize < originalSize ? "-" : "+"}
                      {Math.abs(Math.round((1 - convertedSize / originalSize) * 100))}%
                    </div>
                  </div>
                </div>
              </div>
            )}

            <button
              onClick={convertImage}
              className="w-full py-4 rounded-lg bg-green-600 text-white font-medium hover:bg-green-700"
            >
              🔄 Convert & Download as .{outputFormat.toUpperCase()}
            </button>
          </>
        )}

        <canvas ref={canvasRef} className="hidden" />

        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-4">📖 Format Comparison</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-left py-2 px-3">Format</th>
                  <th className="text-left py-2 px-3">Best For</th>
                  <th className="text-left py-2 px-3">Transparency</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-2 px-3 font-medium">PNG</td>
                  <td className="py-2 px-3">Graphics, screenshots, logos</td>
                  <td className="py-2 px-3">✅ Yes</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-2 px-3 font-medium">JPEG</td>
                  <td className="py-2 px-3">Photos, complex images</td>
                  <td className="py-2 px-3">❌ No</td>
                </tr>
                <tr className="border-b border-[var(--border)]">
                  <td className="py-2 px-3 font-medium">WebP</td>
                  <td className="py-2 px-3">Web optimization (modern)</td>
                  <td className="py-2 px-3">✅ Yes</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 font-medium">GIF</td>
                  <td className="py-2 px-3">Simple graphics, animations</td>
                  <td className="py-2 px-3">✅ Limited</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
