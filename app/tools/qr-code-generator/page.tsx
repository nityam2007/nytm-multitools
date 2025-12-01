"use client";

import { useState, useEffect, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";
import QRCode from "qrcode";

const tool = getToolBySlug("qr-code-generator")!;
const similarTools = getToolsByCategory("generator").filter(t => t.slug !== "qr-code-generator");

export default function QrCodeGeneratorPage() {
  const [input, setInput] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [error, setError] = useState("");
  const [options, setOptions] = useState({
    size: 256,
    errorCorrectionLevel: "M" as "L" | "M" | "Q" | "H",
    margin: 4,
    darkColor: "#000000",
    lightColor: "#ffffff",
  });
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    generateQR();
  }, [input, options]);

  const generateQR = async () => {
    if (!input.trim()) {
      setQrDataUrl("");
      setError("");
      return;
    }

    try {
      const dataUrl = await QRCode.toDataURL(input, {
        width: options.size,
        margin: options.margin,
        errorCorrectionLevel: options.errorCorrectionLevel,
        color: {
          dark: options.darkColor,
          light: options.lightColor,
        },
      });
      setQrDataUrl(dataUrl);
      setError("");
    } catch (e) {
      setError("Failed to generate QR code. Text might be too long.");
      setQrDataUrl("");
    }
  };

  const handleDownload = async () => {
    if (!qrDataUrl) return;

    const link = document.createElement("a");
    link.download = "qrcode.png";
    link.href = qrDataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    await logToolUsage({
      toolName: tool.name,
      toolCategory: tool.category,
      inputType: "text",
      rawInput: input,
      outputResult: "QR Code PNG",
      metadata: options,
    });
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <TextArea
          label="Content"
          placeholder="Enter text or URL to generate QR code..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          error={error}
          className="min-h-[100px]"
        />

        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Size: {options.size}px</label>
            <input
              type="range"
              min="128"
              max="512"
              step="32"
              value={options.size}
              onChange={(e) => setOptions((prev) => ({ ...prev, size: parseInt(e.target.value) }))}
              className="w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Error Correction</label>
            <select
              value={options.errorCorrectionLevel}
              onChange={(e) => setOptions((prev) => ({ ...prev, errorCorrectionLevel: e.target.value as any }))}
              className="w-full px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            >
              <option value="L">Low (7%)</option>
              <option value="M">Medium (15%)</option>
              <option value="Q">Quartile (25%)</option>
              <option value="H">High (30%)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Dark Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={options.darkColor}
                onChange={(e) => setOptions((prev) => ({ ...prev, darkColor: e.target.value }))}
                className="w-12 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={options.darkColor}
                onChange={(e) => setOptions((prev) => ({ ...prev, darkColor: e.target.value }))}
                className="flex-1 px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Light Color</label>
            <div className="flex gap-2">
              <input
                type="color"
                value={options.lightColor}
                onChange={(e) => setOptions((prev) => ({ ...prev, lightColor: e.target.value }))}
                className="w-12 h-10 rounded cursor-pointer"
              />
              <input
                type="text"
                value={options.lightColor}
                onChange={(e) => setOptions((prev) => ({ ...prev, lightColor: e.target.value }))}
                className="flex-1 px-3 py-2 rounded-lg bg-[var(--background)] border border-[var(--border)] font-mono"
              />
            </div>
          </div>
        </div>

        {/* QR Code Preview */}
        {qrDataUrl && (
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-white rounded-xl">
              <img src={qrDataUrl} alt="QR Code" className="max-w-full" />
            </div>
            <canvas ref={canvasRef} className="hidden" />
            <button onClick={handleDownload} className="btn btn-primary">
              Download PNG
            </button>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
