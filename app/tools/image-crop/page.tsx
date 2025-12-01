"use client";

import { useState, useRef, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUpload } from "@/components/FileUpload";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("image-crop")!;
const similarTools = getToolsByCategory("image").filter(t => t.slug !== "image-crop");

export default function ImageCropPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [imgSize, setImgSize] = useState({ width: 0, height: 0 });
  const [crop, setCrop] = useState({ x: 0, y: 0, width: 100, height: 100 });
  const [aspectRatio, setAspectRatio] = useState<string>("free");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      setOutput(null);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    const img = new Image();
    img.onload = () => {
      setImgSize({ width: img.width, height: img.height });
      setCrop({ x: 0, y: 0, width: img.width, height: img.height });
    };
    img.src = url;

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleAspectChange = (ratio: string) => {
    setAspectRatio(ratio);
    if (ratio === "free") return;

    const [w, h] = ratio.split(":").map(Number);
    const targetRatio = w / h;
    
    let newWidth = crop.width;
    let newHeight = crop.width / targetRatio;
    
    if (newHeight > imgSize.height) {
      newHeight = imgSize.height;
      newWidth = newHeight * targetRatio;
    }

    setCrop((prev) => ({
      ...prev,
      width: Math.min(newWidth, imgSize.width),
      height: Math.min(newHeight, imgSize.height),
    }));
  };

  const handleCrop = async () => {
    if (!file || !canvasRef.current) return;
    const startTime = Date.now();

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const img = new Image();
    img.onload = async () => {
      canvas.width = crop.width;
      canvas.height = crop.height;
      ctx.drawImage(img, crop.x, crop.y, crop.width, crop.height, 0, 0, crop.width, crop.height);

      const dataUrl = canvas.toDataURL("image/png");
      setOutput(dataUrl);

      await logToolUsage({
        toolName: tool.name,
        toolCategory: tool.category,
        inputType: "file",
        rawInput: file.name,
        outputResult: `Cropped to ${crop.width}x${crop.height}`,
        processingDuration: Date.now() - startTime,
      });
    };
    img.src = URL.createObjectURL(file);
  };

  const handleDownload = () => {
    if (!output) return;
    const link = document.createElement("a");
    link.download = `cropped-${crop.width}x${crop.height}.png`;
    link.href = output;
    link.click();
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <FileUpload
          accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif"] }}
          onFileSelect={setFile}
          maxSize={20 * 1024 * 1024}
        />

        {preview && (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 card p-4">
                <h3 className="font-medium mb-2">Preview</h3>
                <div className="relative inline-block">
                  <img ref={imgRef} src={preview} alt="Preview" className="max-w-full h-auto rounded" />
                  <div
                    className="absolute border-2 border-primary border-dashed bg-primary/10 pointer-events-none"
                    style={{
                      left: `${(crop.x / imgSize.width) * 100}%`,
                      top: `${(crop.y / imgSize.height) * 100}%`,
                      width: `${(crop.width / imgSize.width) * 100}%`,
                      height: `${(crop.height / imgSize.height) * 100}%`,
                    }}
                  />
                </div>
              </div>

              <div className="card p-4 space-y-4">
                <h3 className="font-medium">Crop Settings</h3>

                <div>
                  <label className="block text-sm font-medium mb-1">Aspect Ratio</label>
                  <select
                    value={aspectRatio}
                    onChange={(e) => handleAspectChange(e.target.value)}
                    className="input w-full"
                  >
                    <option value="free">Free</option>
                    <option value="1:1">1:1 (Square)</option>
                    <option value="4:3">4:3</option>
                    <option value="3:4">3:4</option>
                    <option value="16:9">16:9</option>
                    <option value="9:16">9:16</option>
                    <option value="3:2">3:2</option>
                    <option value="2:3">2:3</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-sm font-medium mb-1">X</label>
                    <input
                      type="number"
                      value={crop.x}
                      onChange={(e) => setCrop((c) => ({ ...c, x: Math.max(0, parseInt(e.target.value) || 0) }))}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Y</label>
                    <input
                      type="number"
                      value={crop.y}
                      onChange={(e) => setCrop((c) => ({ ...c, y: Math.max(0, parseInt(e.target.value) || 0) }))}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Width</label>
                    <input
                      type="number"
                      value={crop.width}
                      onChange={(e) => setCrop((c) => ({ ...c, width: Math.max(1, parseInt(e.target.value) || 1) }))}
                      className="input w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Height</label>
                    <input
                      type="number"
                      value={crop.height}
                      onChange={(e) => setCrop((c) => ({ ...c, height: Math.max(1, parseInt(e.target.value) || 1) }))}
                      className="input w-full"
                    />
                  </div>
                </div>

                <p className="text-xs text-muted-foreground">
                  Original: {imgSize.width} × {imgSize.height}px
                </p>

                <button onClick={handleCrop} className="btn btn-primary w-full">
                  Crop Image
                </button>
              </div>
            </div>

            {output && (
              <div className="card p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">Cropped Result</h3>
                  <button onClick={handleDownload} className="btn btn-secondary text-sm">
                    Download
                  </button>
                </div>
                <img src={output} alt="Cropped" className="max-w-full h-auto rounded" />
                <p className="text-sm text-muted-foreground mt-2">{crop.width} × {crop.height}px</p>
              </div>
            )}
          </>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>
    </ToolLayout>
  );
}
