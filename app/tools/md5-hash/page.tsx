"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("md5-hash")!;
const similarTools = getToolsByCategory("security").filter(t => t.slug !== "md5-hash");

// Simple MD5 implementation
async function md5(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  
  // Using SubtleCrypto for modern browsers - fallback to simple implementation
  // Note: MD5 is not available in SubtleCrypto, so we'll use a simple implementation
  
  const md5Hash = (str: string): string => {
    function rotateLeft(value: number, shift: number): number {
      return (value << shift) | (value >>> (32 - shift));
    }
    
    function addUnsigned(x: number, y: number): number {
      return (x + y) >>> 0;
    }
    
    const s = [
      7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22, 7, 12, 17, 22,
      5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20, 5, 9, 14, 20,
      4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23, 4, 11, 16, 23,
      6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21, 6, 10, 15, 21
    ];
    
    const K = [
      0xd76aa478, 0xe8c7b756, 0x242070db, 0xc1bdceee, 0xf57c0faf, 0x4787c62a, 0xa8304613, 0xfd469501,
      0x698098d8, 0x8b44f7af, 0xffff5bb1, 0x895cd7be, 0x6b901122, 0xfd987193, 0xa679438e, 0x49b40821,
      0xf61e2562, 0xc040b340, 0x265e5a51, 0xe9b6c7aa, 0xd62f105d, 0x02441453, 0xd8a1e681, 0xe7d3fbc8,
      0x21e1cde6, 0xc33707d6, 0xf4d50d87, 0x455a14ed, 0xa9e3e905, 0xfcefa3f8, 0x676f02d9, 0x8d2a4c8a,
      0xfffa3942, 0x8771f681, 0x6d9d6122, 0xfde5380c, 0xa4beea44, 0x4bdecfa9, 0xf6bb4b60, 0xbebfbc70,
      0x289b7ec6, 0xeaa127fa, 0xd4ef3085, 0x04881d05, 0xd9d4d039, 0xe6db99e5, 0x1fa27cf8, 0xc4ac5665,
      0xf4292244, 0x432aff97, 0xab9423a7, 0xfc93a039, 0x655b59c3, 0x8f0ccc92, 0xffeff47d, 0x85845dd1,
      0x6fa87e4f, 0xfe2ce6e0, 0xa3014314, 0x4e0811a1, 0xf7537e82, 0xbd3af235, 0x2ad7d2bb, 0xeb86d391
    ];
    
    const bytes: number[] = [];
    for (let i = 0; i < str.length; i++) {
      bytes.push(str.charCodeAt(i) & 0xff);
    }
    
    bytes.push(0x80);
    while ((bytes.length % 64) !== 56) bytes.push(0);
    
    const bitLen = str.length * 8;
    bytes.push(bitLen & 0xff, (bitLen >>> 8) & 0xff, (bitLen >>> 16) & 0xff, (bitLen >>> 24) & 0xff, 0, 0, 0, 0);
    
    let a0 = 0x67452301, b0 = 0xefcdab89, c0 = 0x98badcfe, d0 = 0x10325476;
    
    for (let i = 0; i < bytes.length; i += 64) {
      const M: number[] = [];
      for (let j = 0; j < 16; j++) {
        M[j] = bytes[i + j * 4] | (bytes[i + j * 4 + 1] << 8) | (bytes[i + j * 4 + 2] << 16) | (bytes[i + j * 4 + 3] << 24);
      }
      
      let A = a0, B = b0, C = c0, D = d0;
      
      for (let j = 0; j < 64; j++) {
        let F: number, g: number;
        if (j < 16) { F = (B & C) | ((~B) & D); g = j; }
        else if (j < 32) { F = (D & B) | ((~D) & C); g = (5 * j + 1) % 16; }
        else if (j < 48) { F = B ^ C ^ D; g = (3 * j + 5) % 16; }
        else { F = C ^ (B | (~D)); g = (7 * j) % 16; }
        
        F = addUnsigned(F, addUnsigned(A, addUnsigned(K[j], M[g])));
        A = D; D = C; C = B;
        B = addUnsigned(B, rotateLeft(F, s[j]));
      }
      
      a0 = addUnsigned(a0, A); b0 = addUnsigned(b0, B);
      c0 = addUnsigned(c0, C); d0 = addUnsigned(d0, D);
    }
    
    const toHex = (n: number) => {
      let hex = "";
      for (let i = 0; i < 4; i++) hex += ((n >>> (i * 8)) & 0xff).toString(16).padStart(2, "0");
      return hex;
    };
    
    return toHex(a0) + toHex(b0) + toHex(c0) + toHex(d0);
  };
  
  return md5Hash(message);
}

export default function MD5HashPage() {
  const [input, setInput] = useState("");
  const [hash, setHash] = useState("");
  const [uppercase, setUppercase] = useState(false);

  const generateHash = async () => {
    const result = await md5(input);
    setHash(uppercase ? result.toUpperCase() : result);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(hash);
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-xl p-4 text-yellow-500 text-sm flex items-start gap-2">
          <svg className="w-5 h-5 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
          </svg>
          <span><strong>Warning:</strong> MD5 is considered cryptographically broken. Do not use for security-critical applications. Consider SHA-256 or better.</span>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Input Text</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Enter text to hash..."
            className="w-full h-32 px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)] resize-none"
          />
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(e) => setUppercase(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm">Uppercase output</span>
          </label>
        </div>

        <button
          onClick={generateHash}
          className="w-full py-3 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-medium hover:opacity-90 transition-opacity"
        >
          Generate MD5 Hash
        </button>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">MD5 Hash (128-bit / 32 hex characters)</label>
            <button
              onClick={copyToClipboard}
              disabled={!hash}
              className="px-3 py-1 text-sm rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] disabled:opacity-50"
            >
              Copy
            </button>
          </div>
          <div className="px-4 py-3 rounded-lg bg-[var(--muted)] border border-[var(--border)] font-mono break-all min-h-[48px]">
            {hash || <span className="text-[var(--muted-foreground)]">Hash will appear here...</span>}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
