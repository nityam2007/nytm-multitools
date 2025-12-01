"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("aes-decrypt")!;
const similarTools = getToolsByCategory("security").filter(t => t.slug !== "aes-decrypt");

async function aesDecrypt(encryptedBase64: string, password: string): Promise<string> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  
  // Decode base64
  const combined = new Uint8Array(atob(encryptedBase64).split("").map(c => c.charCodeAt(0)));
  
  // Extract salt, iv, and encrypted data
  const salt = combined.slice(0, 16);
  const iv = combined.slice(16, 28);
  const encryptedData = combined.slice(28);
  
  // Derive key from password using PBKDF2
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );
  
  // Derive AES key
  const key = await crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: salt,
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );
  
  // Decrypt
  const decrypted = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv: iv },
    key,
    encryptedData
  );
  
  return decoder.decode(decrypted);
}

export default function AESDecryptPage() {
  const [encrypted, setEncrypted] = useState("");
  const [password, setPassword] = useState("");
  const [decrypted, setDecrypted] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const decrypt = async () => {
    if (!encrypted || !password) return;
    setLoading(true);
    setError("");
    
    try {
      const result = await aesDecrypt(encrypted, password);
      setDecrypted(result);
    } catch {
      setError("Decryption failed. Check the password and encrypted data.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(decrypted);
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Encrypted Data (Base64)</label>
          <textarea
            value={encrypted}
            onChange={(e) => { setEncrypted(e.target.value); setError(""); }}
            placeholder="Paste encrypted data from AES Encrypt tool..."
            className="w-full h-32 px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)] resize-none font-mono text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Password / Key</label>
          <input
            type="password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(""); }}
            placeholder="Enter decryption password..."
            className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
          />
        </div>

        <button
          onClick={decrypt}
          disabled={!encrypted || !password || loading}
          className="w-full py-3 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Decrypting..." : "🔓 Decrypt with AES-256"}
        </button>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-500">
            {error}
          </div>
        )}

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Decrypted Output</label>
            <button
              onClick={copyToClipboard}
              disabled={!decrypted}
              className="px-3 py-1 text-sm rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] disabled:opacity-50"
            >
              Copy
            </button>
          </div>
          <textarea
            value={decrypted}
            readOnly
            placeholder="Decrypted text will appear here..."
            className="w-full h-32 px-4 py-3 rounded-lg bg-[var(--muted)] border border-[var(--border)] resize-none"
          />
        </div>

        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-3">Decryption Info</h3>
          <div className="space-y-2 text-sm text-[var(--muted-foreground)]">
            <p>• Only works with data encrypted by the AES Encrypt tool</p>
            <p>• Password must match exactly</p>
            <p>• Data integrity is verified during decryption (GCM mode)</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
