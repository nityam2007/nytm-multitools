// PDF Lock Tool | TypeScript
"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/Button";
import { Input } from "@/components/Input";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("pdf-lock")!;
const similarTools = getToolsByCategory("converter").filter(t => t.slug !== "pdf-lock");

export default function PDFLockPage() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [locking, setLocking] = useState(false);
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

  const lockPDF = async () => {
    if (!file) {
      setError("Please upload a PDF file");
      return;
    }

    if (!password) {
      setError("Please enter a password");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    setLocking(true);
    setError("");
    setSuccess(false);

    try {
      const { PDFDocument } = await import("pdf-lib");
      
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);

      // Save with encryption (user password)
      const pdfBytes = await pdfDoc.save({
        useObjectStreams: true,
        // Note: pdf-lib doesn't support encryption natively
        // This is a limitation - we'll inform users
      });

      // Since pdf-lib doesn't support encryption, we'll show a message
      setError("PDF encryption is not yet supported by this tool. Consider using desktop software like Adobe Acrobat or online services that support PDF encryption.");
      setLocking(false);
      return;

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to lock PDF");
    } finally {
      setLocking(false);
    }
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 mb-6">
          <p className="text-sm text-yellow-500">
            <strong>⚠️ Feature Limitation:</strong> PDF password encryption requires specialized libraries. 
            This tool is currently in development. For now, please use desktop software like Adobe Acrobat, 
            PDFtk, or online services that support PDF encryption.
          </p>
        </div>

        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4">Upload PDF</h3>
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
                    setConfirmPassword("");
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
            <h3 className="text-sm font-semibold mb-4">Set Password</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs text-[var(--muted-foreground)] mb-2 block">
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password (min. 4 characters)"
                />
              </div>
              <div>
                <label className="text-xs text-[var(--muted-foreground)] mb-2 block">
                  Confirm Password
                </label>
                <Input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter password"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && file && password && confirmPassword) {
                      lockPDF();
                    }
                  }}
                />
              </div>
            </div>
            {password && confirmPassword && password !== confirmPassword && (
              <p className="text-xs text-red-500 mt-2">Passwords do not match</p>
            )}
            {password && password.length > 0 && password.length < 4 && (
              <p className="text-xs text-yellow-500 mt-2">Password should be at least 4 characters</p>
            )}
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
              ✓ PDF locked successfully! Your file has been downloaded.
            </p>
          </div>
        )}

        <Button
          onClick={lockPDF}
          disabled={!file || !password || !confirmPassword || password !== confirmPassword || locking}
          className="w-full"
        >
          {locking ? "Locking..." : "Lock PDF (Coming Soon)"}
        </Button>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <p className="text-sm text-blue-400">
            <strong>Alternative Solutions:</strong>
            <br />• Desktop: Adobe Acrobat, PDFtk, LibreOffice
            <br />• Online: iLovePDF, Smallpdf, PDF24
            <br />• Command Line: qpdf, pdftk
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
