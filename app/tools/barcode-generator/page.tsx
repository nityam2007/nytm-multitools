"use client";

import { useState, useRef } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("barcode-generator")!;
const similarTools = getToolsByCategory("generator").filter(t => t.slug !== "barcode-generator");

// Simple Code128 implementation
const CODE128_START_B = 104;
const CODE128_STOP = 106;

const code128Patterns: { [key: number]: string } = {
  0: "11011001100", 1: "11001101100", 2: "11001100110", 3: "10010011000", 4: "10010001100",
  5: "10001001100", 6: "10011001000", 7: "10011000100", 8: "10001100100", 9: "11001001000",
  10: "11001000100", 11: "11000100100", 12: "10110011100", 13: "10011011100", 14: "10011001110",
  15: "10111001100", 16: "10011101100", 17: "10011100110", 18: "11001110010", 19: "11001011100",
  20: "11001001110", 21: "11011100100", 22: "11001110100", 23: "11101101110", 24: "11101001100",
  25: "11100101100", 26: "11100100110", 27: "11101100100", 28: "11100110100", 29: "11100110010",
  30: "11011011000", 31: "11011000110", 32: "11000110110", 33: "10100011000", 34: "10001011000",
  35: "10001000110", 36: "10110001000", 37: "10001101000", 38: "10001100010", 39: "11010001000",
  40: "11000101000", 41: "11000100010", 42: "10110111000", 43: "10110001110", 44: "10001101110",
  45: "10111011000", 46: "10111000110", 47: "10001110110", 48: "11101110110", 49: "11010001110",
  50: "11000101110", 51: "11011101000", 52: "11011100010", 53: "11011101110", 54: "11101011000",
  55: "11101000110", 56: "11100010110", 57: "11101101000", 58: "11101100010", 59: "11100011010",
  60: "11101111010", 61: "11001000010", 62: "11110001010", 63: "10100110000", 64: "10100001100",
  65: "10010110000", 66: "10010000110", 67: "10000101100", 68: "10000100110", 69: "10110010000",
  70: "10110000100", 71: "10011010000", 72: "10011000010", 73: "10000110100", 74: "10000110010",
  75: "11000010010", 76: "11001010000", 77: "11110111010", 78: "11000010100", 79: "10001111010",
  80: "10100111100", 81: "10010111100", 82: "10010011110", 83: "10111100100", 84: "10011110100",
  85: "10011110010", 86: "11110100100", 87: "11110010100", 88: "11110010010", 89: "11011011110",
  90: "11011110110", 91: "11110110110", 92: "10101111000", 93: "10100011110", 94: "10001011110",
  95: "10111101000", 96: "10111100010", 97: "11110101000", 98: "11110100010", 99: "10111011110",
  100: "10111101110", 101: "11101011110", 102: "11110101110", 103: "11010000100", 104: "11010010000",
  105: "11010011100", 106: "1100011101011",
};

export default function BarcodeGeneratorPage() {
  const [text, setText] = useState("Hello123");
  const [height, setHeight] = useState(100);
  const [showText, setShowText] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateCode128 = (data: string): string => {
    let pattern = code128Patterns[CODE128_START_B];
    let checksum = CODE128_START_B;
    
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i) - 32;
      if (charCode >= 0 && charCode < 96) {
        pattern += code128Patterns[charCode];
        checksum += charCode * (i + 1);
      }
    }
    
    checksum = checksum % 103;
    pattern += code128Patterns[checksum];
    pattern += code128Patterns[CODE128_STOP];
    
    return pattern;
  };

  const drawBarcode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    
    const pattern = generateCode128(text);
    const barWidth = 2;
    const padding = 20;
    
    canvas.width = pattern.length * barWidth + padding * 2;
    canvas.height = height + (showText ? 30 : 0) + padding * 2;
    
    // White background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw bars
    ctx.fillStyle = "#000000";
    let x = padding;
    
    for (const bit of pattern) {
      if (bit === "1") {
        ctx.fillRect(x, padding, barWidth, height);
      }
      x += barWidth;
    }
    
    // Draw text
    if (showText) {
      ctx.font = "14px monospace";
      ctx.textAlign = "center";
      ctx.fillText(text, canvas.width / 2, height + padding + 20);
    }
  };

  const downloadBarcode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const link = document.createElement("a");
    link.download = `barcode-${text}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  useState(() => {
    drawBarcode();
  });

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Text / Data</label>
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text to encode..."
            className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
          />
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Height (px)</label>
            <input
              type="number"
              min="50"
              max="300"
              value={height}
              onChange={(e) => setHeight(parseInt(e.target.value) || 100)}
              className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            />
          </div>
          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={showText}
                onChange={(e) => setShowText(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm">Show text below barcode</span>
            </label>
          </div>
        </div>

        <button
          onClick={drawBarcode}
          className="w-full py-3 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-medium hover:opacity-90 transition-opacity"
        >
          Generate Barcode
        </button>

        <div className="bg-white rounded-xl p-6 flex justify-center">
          <canvas ref={canvasRef} className="max-w-full" />
        </div>

        <button
          onClick={downloadBarcode}
          className="w-full py-2 rounded-lg bg-[var(--muted)] hover:bg-[var(--accent)] transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download PNG
        </button>

        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-3">About Code 128</h3>
          <div className="space-y-2 text-sm text-[var(--muted-foreground)]">
            <p>• High-density linear barcode symbology</p>
            <p>• Supports ASCII characters 0-127</p>
            <p>• Includes built-in checksum for validation</p>
            <p>• Commonly used in shipping and packaging</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
