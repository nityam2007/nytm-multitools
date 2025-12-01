"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("rsa-key-generator")!;
const similarTools = getToolsByCategory("security").filter(t => t.slug !== "rsa-key-generator");

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function formatPEM(base64: string, type: "PUBLIC" | "PRIVATE"): string {
  const lines = base64.match(/.{1,64}/g) || [];
  return `-----BEGIN ${type} KEY-----\n${lines.join("\n")}\n-----END ${type} KEY-----`;
}

export default function RSAKeyGeneratorPage() {
  const [keySize, setKeySize] = useState<2048 | 4096>(2048);
  const [publicKey, setPublicKey] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [loading, setLoading] = useState(false);

  const generateKeys = async () => {
    setLoading(true);
    try {
      const keyPair = await crypto.subtle.generateKey(
        {
          name: "RSA-OAEP",
          modulusLength: keySize,
          publicExponent: new Uint8Array([1, 0, 1]),
          hash: "SHA-256",
        },
        true,
        ["encrypt", "decrypt"]
      );
      
      const publicKeyBuffer = await crypto.subtle.exportKey("spki", keyPair.publicKey);
      const privateKeyBuffer = await crypto.subtle.exportKey("pkcs8", keyPair.privateKey);
      
      setPublicKey(formatPEM(arrayBufferToBase64(publicKeyBuffer), "PUBLIC"));
      setPrivateKey(formatPEM(arrayBufferToBase64(privateKeyBuffer), "PRIVATE"));
    } catch (error) {
      console.error("Key generation failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const downloadKey = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">Key Size</label>
          <div className="flex gap-4">
            {[2048, 4096].map((size) => (
              <button
                key={size}
                onClick={() => setKeySize(size as 2048 | 4096)}
                className={`flex-1 py-3 rounded-lg font-medium transition-colors ${
                  keySize === size
                    ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                    : "bg-[var(--muted)] hover:bg-[var(--accent)]"
                }`}
              >
                {size} bits
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={generateKeys}
          disabled={loading}
          className="w-full py-3 rounded-lg bg-[var(--primary)] text-[var(--primary-foreground)] font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
        >
          {loading ? "Generating..." : "🔑 Generate RSA Key Pair"}
        </button>

        {publicKey && (
          <>
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">Public Key</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(publicKey)}
                    className="px-3 py-1 text-sm rounded-lg bg-[var(--muted)] hover:bg-[var(--accent)]"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => downloadKey(publicKey, "public_key.pem")}
                    className="px-3 py-1 text-sm rounded-lg bg-[var(--muted)] hover:bg-[var(--accent)]"
                  >
                    Download
                  </button>
                </div>
              </div>
              <textarea
                value={publicKey}
                readOnly
                className="w-full h-48 px-4 py-3 rounded-lg bg-[var(--muted)] border border-[var(--border)] resize-none font-mono text-xs"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-sm font-medium">Private Key ⚠️</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(privateKey)}
                    className="px-3 py-1 text-sm rounded-lg bg-[var(--muted)] hover:bg-[var(--accent)]"
                  >
                    Copy
                  </button>
                  <button
                    onClick={() => downloadKey(privateKey, "private_key.pem")}
                    className="px-3 py-1 text-sm rounded-lg bg-[var(--muted)] hover:bg-[var(--accent)]"
                  >
                    Download
                  </button>
                </div>
              </div>
              <textarea
                value={privateKey}
                readOnly
                className="w-full h-64 px-4 py-3 rounded-lg bg-[var(--muted)] border border-[var(--border)] resize-none font-mono text-xs"
              />
            </div>
          </>
        )}

        <div className="bg-yellow-500/10 border border-yellow-500/50 rounded-xl p-4 text-yellow-500 text-sm">
          ⚠️ <strong>Security:</strong> Keep your private key secret. Never share it or commit it to version control.
        </div>

        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-3">About RSA Keys</h3>
          <div className="space-y-2 text-sm text-[var(--muted-foreground)]">
            <p>• RSA is an asymmetric encryption algorithm</p>
            <p>• 2048-bit is minimum recommended for security</p>
            <p>• 4096-bit provides extra security but is slower</p>
            <p>• Public key encrypts, private key decrypts</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
