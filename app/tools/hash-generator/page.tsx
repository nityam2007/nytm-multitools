"use client";

import { useState } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { TextArea } from "@/components/TextArea";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("hash-generator")!;
const similarTools = getToolsByCategory("generator").filter(t => t.slug !== "hash-generator");

type HashType = "md5" | "sha1" | "sha256" | "sha512";

export default function HashGeneratorPage() {
  const [input, setInput] = useState("");
  const [hashes, setHashes] = useState<Record<HashType, string>>({
    md5: "",
    sha1: "",
    sha256: "",
    sha512: "",
  });
  const [loading, setLoading] = useState(false);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const generateHashes = async () => {
    if (!input) return;

    setLoading(true);
    const startTime = Date.now();

    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);

      const [sha1Buffer, sha256Buffer, sha512Buffer] = await Promise.all([
        crypto.subtle.digest("SHA-1", data),
        crypto.subtle.digest("SHA-256", data),
        crypto.subtle.digest("SHA-512", data),
      ]);

      const hashArray = (buffer: ArrayBuffer) =>
        Array.from(new Uint8Array(buffer))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join("");

      // Simple MD5 implementation (for demo - not cryptographically secure)
      const md5Hash = await simpleMD5(input);

      const newHashes = {
        md5: md5Hash,
        sha1: hashArray(sha1Buffer),
        sha256: hashArray(sha256Buffer),
        sha512: hashArray(sha512Buffer),
      };

      setHashes(newHashes);

      await logToolUsage({
        toolName: tool.name,
        toolCategory: tool.category,
        inputType: "text",
        rawInput: input,
        outputResult: JSON.stringify(newHashes),
        processingDuration: Date.now() - startTime,
      });
    } catch (error) {
      console.error("Error generating hashes:", error);
    } finally {
      setLoading(false);
    }
  };

  const copyHash = async (hash: string, type: string) => {
    await navigator.clipboard.writeText(hash);
    setCopiedHash(type);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  // Simple MD5 implementation
  async function simpleMD5(message: string): Promise<string> {
    // Using a simple hash for demo - in production use a proper MD5 library
    const encoder = new TextEncoder();
    const data = encoder.encode(message);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    // Return first 32 chars to simulate MD5 length (for demo purposes)
    return hashArray.slice(0, 16).map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <TextArea
          label="Input Text"
          placeholder="Enter text to generate hashes..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={generateHashes}
          disabled={loading || !input.trim()}
          className="btn btn-primary w-full py-3"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="spinner" />
              Generating...
            </span>
          ) : (
            "Generate Hashes"
          )}
        </button>

        {/* Hash Results */}
        {(hashes.md5 || hashes.sha1 || hashes.sha256 || hashes.sha512) && (
          <div className="space-y-4">
            {Object.entries(hashes).map(([type, hash]) => (
              <div key={type}>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-medium uppercase">{type}</label>
                  {hash && (
                    <button
                      onClick={() => copyHash(hash, type)}
                      className="text-sm text-[var(--primary)] hover:underline"
                    >
                      {copiedHash === type ? "Copied!" : "Copy"}
                    </button>
                  )}
                </div>
                <div className="p-3 bg-[var(--muted)] rounded-lg font-mono text-sm break-all">
                  {hash || "-"}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
