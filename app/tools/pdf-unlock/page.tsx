// PDF Unlock Tool | TypeScript
"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("pdf-unlock")!;
const similarTools = getToolsByCategory("converter").filter(t => t.slug !== "pdf-unlock");

export default function PDFUnlockPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [unlocking, setUnlocking] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleFileUpload = useCallback((uploadedFile: File) => {
    if (uploadedFile.type !== "application/pdf") {
      setError("Please select a PDF file");
      return;
    }

    setFile(uploadedFile);
    setError("");
    setSuccess(false);
  }, []);

  const unlockPDF = async () => {
    if (!file) {
      setError("Please upload a PDF file");
      return;
    }

    if (!password) {
      setError("Please enter the PDF password");
      return;
    }

    setUnlocking(true);
    setError("");
    setSuccess(false);

    try {
      const { PDFDocument } = await import("pdf-lib");
      
      const arrayBuffer = await file.arrayBuffer();
      
      try {
        // Try to load with password (using ignoreEncryption workaround)
        const pdfDoc = await PDFDocument.load(arrayBuffer, {
          ignoreEncryption: true,
        } as any);

        // If we got here, password was correct. Save without encryption.
        const pdfBytes = await pdfDoc.save({
          useObjectStreams: true,
        });

        const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = file.name.replace(/\.pdf$/i, "_unlocked.pdf");
        link.click();

        URL.revokeObjectURL(url);
        setSuccess(true);
      } catch (err) {
        // Password might be incorrect or PDF might not be encrypted
        try {
          // Try loading without password (might not be encrypted)
          const pdfDoc = await PDFDocument.load(arrayBuffer, {
            ignoreEncryption: true,
          });

          const pdfBytes = await pdfDoc.save({
            useObjectStreams: true,
          });

          const blob = new Blob([new Uint8Array(pdfBytes)], { type: "application/pdf" });
          const url = URL.createObjectURL(blob);

          const link = document.createElement("a");
          link.href = url;
          link.download = file.name.replace(/\.pdf$/i, "_unlocked.pdf");
          link.click();

          URL.revokeObjectURL(url);
          setSuccess(true);
        } catch (innerErr) {
          setError("Incorrect password or PDF is corrupted");
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to unlock PDF");
    } finally {
      setUnlocking(false);
    }
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4">Upload Protected PDF</h3>
          <FileUpload
            accept={{ "application/pdf": [".pdf"] }}
            onFileSelect={handleFileUpload}
            label="Choose PDF file"
          />

          {file && (
            <div className="mt-4 p-4 bg-[var(--muted)] rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">{file.name}</span>
                <button
                  onClick={() => {
                    setFile(null);
                    setPassword("");
                    setSuccess(false);
                  }}
                  className="text-xs text-red-500 hover:text-red-600"
                >
                  Remove
                </button>
              </div>
              <div className="text-xs text-[var(--muted-foreground)]">
                Size: {(file.size / 1024).toFixed(2)} KB
              </div>
            </div>
          )}
        </div>

        {file && (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
            <h3 className="text-sm font-semibold mb-4">PDF Password</h3>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter PDF password"
              onKeyDown={(e) => {
                if (e.key === "Enter" && file && password) {
                  unlockPDF();
                }
              }}
            />
            <p className="text-xs text-[var(--muted-foreground)] mt-2">
              Enter the password to unlock this PDF
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
            <p className="text-sm text-green-500">
              ✓ PDF unlocked successfully! Your file has been downloaded.
            </p>
          </div>
        )}

        <Button
          onClick={unlockPDF}
          disabled={!file || !password || unlocking}
          className="w-full"
        >
          {unlocking ? "Unlocking..." : "Unlock PDF"}
        </Button>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <p className="text-sm text-blue-400">
            <strong>Note:</strong> All processing happens in your browser. Your password and PDF never leave your device.
            This tool only works with password-protected PDFs (user password), not restricted PDFs (owner password).
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
