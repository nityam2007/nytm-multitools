"use client";

import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  label?: string;
  helperText?: string;
  preview?: boolean;
}

export function FileUpload({
  onFileSelect,
  accept = { "image/*": [".png", ".jpg", ".jpeg", ".gif", ".webp"] },
  maxSize = 10 * 1024 * 1024, // 10MB
  label = "Upload File",
  helperText,
  preview = true,
}: FileUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === "file-too-large") {
          setError(`File is too large. Maximum size is ${maxSize / 1024 / 1024}MB`);
        } else {
          setError("Invalid file type");
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        setFileName(file.name);
        setError(null);

        if (preview && file.type.startsWith("image/")) {
          const url = URL.createObjectURL(file);
          setPreviewUrl(url);
        } else {
          setPreviewUrl(null);
        }

        onFileSelect(file);
      }
    },
    [onFileSelect, maxSize, preview]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxSize,
    multiple: false,
  });

  return (
    <div className="w-full">
      {label && (
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-[var(--foreground)]">{label}</label>
          <span className="text-xs text-[var(--muted-foreground)] font-mono">
            Max {maxSize / 1024 / 1024}MB
          </span>
        </div>
      )}
      
      <div
        {...getRootProps()}
        className={`
          relative overflow-hidden
          border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer
          transition-all duration-300
          ${isDragActive 
            ? "border-violet-500 bg-gradient-to-br from-violet-500/10 to-purple-500/10 scale-[1.02]" 
            : "border-[var(--border)] hover:border-violet-500/50 hover:bg-gradient-to-br hover:from-violet-500/5 hover:to-purple-500/5"
          }
          ${error ? "border-[var(--destructive)] bg-red-500/5" : ""}
          shadow-sm hover:shadow-md
        `}
      >
        <input {...getInputProps()} />
        
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-violet-500/10 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="relative">
          {previewUrl ? (
            <div className="space-y-4 animate-fade-slide-up">
              <div className="relative inline-block">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-64 mx-auto rounded-2xl shadow-lg border-2 border-white/20"
                />
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-[var(--foreground)] truncate max-w-md mx-auto">
                  {fileName}
                </p>
                <p className="text-sm text-violet-500 font-medium flex items-center gap-2 justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Click or drag to replace
                </p>
              </div>
            </div>
          ) : fileName ? (
            <div className="space-y-3 animate-fade-slide-up">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 flex items-center justify-center text-4xl shadow-lg">
                📄
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-[var(--foreground)] truncate max-w-md mx-auto">
                  {fileName}
                </p>
                <p className="text-sm text-violet-500 font-medium flex items-center gap-2 justify-center">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Click or drag to replace
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 flex items-center justify-center text-4xl shadow-lg transition-transform duration-300 group-hover:scale-110">
                {isDragActive ? "🎯" : "📁"}
              </div>
              <div className="space-y-2">
                <p className="font-semibold text-[var(--foreground)]">
                  {isDragActive ? "Drop your file here" : "Drag & drop or click to upload"}
                </p>
                <p className="text-sm text-[var(--muted-foreground)]">
                  Supports: {Object.values(accept).flat().join(", ")}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 text-sm text-[var(--destructive)] animate-fade-slide-up">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}
      {helperText && !error && (
        <p className="mt-3 text-sm text-[var(--muted-foreground)]" style={{ lineHeight: '1.5' }}>
          {helperText}
        </p>
      )}
    </div>
  );
}
