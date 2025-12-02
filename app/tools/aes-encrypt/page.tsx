"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("aes-encrypt")!;
const similarTools = getToolsByCategory("security").filter(t => t.slug !== "aes-encrypt");

async function aesEncrypt(plaintext: string, password: string): Promise<string> {
  const encoder = new TextEncoder();
  
  // Derive key from password using PBKDF2
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits", "deriveKey"]
  );
  
  // Generate random salt and IV
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  
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
    ["encrypt"]
  );
  
  // Encrypt
  const encrypted = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv: iv },
    key,
    encoder.encode(plaintext)
  );
  
  // Combine salt + iv + encrypted data
  const combined = new Uint8Array(salt.length + iv.length + encrypted.byteLength);
  combined.set(salt, 0);
  combined.set(iv, salt.length);
  combined.set(new Uint8Array(encrypted), salt.length + iv.length);
  
  // Return as base64
  let binary = '';
  for (let i = 0; i < combined.length; i++) {
    binary += String.fromCharCode(combined[i]);
  }
  return btoa(binary);
}

export default function AESEncryptPage() {
  const [plaintext, setPlaintext] = useState("");
  const [password, setPassword] = useState("");
  const [encrypted, setEncrypted] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const encrypt = async () => {
    if (!plaintext || !password) {
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const result = await aesEncrypt(plaintext, password);
      setEncrypted(result);
    } catch (err) {
      setError(`Encryption failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(encrypted);
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <form onSubmit={(e) => { e.preventDefault(); encrypt(); }} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Plaintext</label>
          <textarea
            value={plaintext}
            onChange={(e) => setPlaintext(e.target.value)}
            placeholder="Enter text to encrypt..."
            className="w-full h-32 px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)] resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Password / Key</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter encryption password..."
            className="w-full px-4 py-3 rounded-lg bg-[var(--background)] border border-[var(--border)]"
            autoComplete="new-password"
          />
        </div>

        <button
          type="submit"
          disabled={!plaintext || !password || loading}
          className="w-full py-3 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Encrypting..." : "Encrypt with AES-256"}
        </button>

        {error && (
          <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/50 text-red-500">
            {error}
          </div>
        )}

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="text-sm font-medium">Encrypted Output (Base64)</label>
            <button
              type="button"
              onClick={copyToClipboard}
              disabled={!encrypted}
              className="px-3 py-1 text-sm rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] disabled:opacity-50"
            >
              Copy
            </button>
          </div>
          <textarea
            value={encrypted}
            readOnly
            placeholder="Encrypted data will appear here..."
            className="w-full h-32 px-4 py-3 rounded-lg bg-[var(--muted)] border border-[var(--border)] resize-none font-mono text-sm"
          />
        </div>

        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-3">Encryption Details</h3>
          <div className="space-y-2 text-sm text-[var(--muted-foreground)]">
            <p>• Algorithm: AES-256-GCM</p>
            <p>• Key Derivation: PBKDF2 with SHA-256 (100,000 iterations)</p>
            <p>• Random 16-byte salt and 12-byte IV included in output</p>
            <p>• Use the AES Decrypt tool with the same password to decrypt</p>
          </div>
        </div>
      </form>
    </ToolLayout>
  );
}
