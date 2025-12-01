"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("file-hash")!;
const similarTools = getToolsByCategory("security").filter(t => t.slug !== "file-hash");

type Algorithm = "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512";

export default function FileHashPage() {
  const [file, setFile] = useState<File | null>(null);
  const [hashes, setHashes] = useState<Record<Algorithm, string>>({
    "SHA-1": "",
    "SHA-256": "",
    "SHA-384": "",
    "SHA-512": "",
  });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  const calculateHashes = useCallback(async (file: File) => {
    setLoading(true);
    setProgress(0);
    
    const algorithms: Algorithm[] = ["SHA-1", "SHA-256", "SHA-384", "SHA-512"];
    const results: Record<Algorithm, string> = {
      "SHA-1": "",
      "SHA-256": "",
      "SHA-384": "",
      "SHA-512": "",
    };
    
    const arrayBuffer = await file.arrayBuffer();
    
    for (let i = 0; i < algorithms.length; i++) {
      const algo = algorithms[i];
      try {
        const hashBuffer = await crypto.subtle.digest(algo, arrayBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        results[algo] = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
      } catch {
        results[algo] = "Error computing hash";
      }
      setProgress(((i + 1) / algorithms.length) * 100);
    }
    
    setHashes(results);
    setLoading(false);
  }, []);

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      setFile(droppedFile);
      calculateHashes(droppedFile);
    }
  }, [calculateHashes]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      calculateHashes(selectedFile);
    }
  }, [calculateHashes]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
    return `${(bytes / 1024 / 1024 / 1024).toFixed(2)} GB`;
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div
          onDrop={handleFileDrop}
          onDragOver={(e) => e.preventDefault()}
          className="border-2 border-dashed border-[var(--border)] rounded-xl p-12 text-center hover:border-[var(--primary)] transition-colors"
        >
          <input
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            id="file-input"
          />
          <label htmlFor="file-input" className="cursor-pointer">
            <div className="text-4xl mb-4">📁</div>
            <div className="text-lg font-medium mb-2">
              Drop a file here or click to select
            </div>
            <div className="text-sm text-[var(--muted-foreground)]">
              Supports any file type
            </div>
          </label>
        </div>

        {file && (
          <div className="bg-[var(--muted)] rounded-xl p-4">
            <div className="flex items-center gap-4">
              <div className="text-3xl">📄</div>
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{file.name}</div>
                <div className="text-sm text-[var(--muted-foreground)]">
                  {formatFileSize(file.size)} • {file.type || "Unknown type"}
                </div>
              </div>
            </div>
          </div>
        )}

        {loading && (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Computing hashes...</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-[var(--muted)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--primary)] transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {hashes["SHA-256"] && !loading && (
          <div className="space-y-4">
            {(Object.entries(hashes) as [Algorithm, string][]).map(([algo, hash]) => (
              <div key={algo} className="bg-[var(--card)] rounded-xl p-4 border border-[var(--border)]">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{algo}</span>
                  <button
                    onClick={() => copyToClipboard(hash)}
                    className="px-3 py-1 text-sm rounded-lg bg-[var(--muted)] hover:bg-[var(--accent)]"
                  >
                    Copy
                  </button>
                </div>
                <div className="font-mono text-xs break-all text-[var(--muted-foreground)]">
                  {hash}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="bg-[var(--card)] rounded-xl p-6 border border-[var(--border)]">
          <h3 className="font-semibold mb-3">About File Hashing</h3>
          <div className="space-y-2 text-sm text-[var(--muted-foreground)]">
            <p>• File hashes create a unique &quot;fingerprint&quot; for any file</p>
            <p>• Even a tiny change in the file produces a completely different hash</p>
            <p>• Use hashes to verify file integrity after downloads</p>
            <p>• All processing happens in your browser - files are not uploaded</p>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
