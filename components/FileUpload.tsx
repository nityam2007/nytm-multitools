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
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1 xs:gap-2 mb-2">
          <label className="text-xs sm:text-sm font-semibold text-[var(--foreground)]">{label}</label>
          <span className="text-[10px] sm:text-xs text-[var(--muted-foreground)] font-mono">
            Max {maxSize / 1024 / 1024}MB
          </span>
        </div>
      )}
      
      <div
        {...getRootProps()}
        className={`
          relative overflow-hidden
          border-2 border-dashed rounded-xl sm:rounded-2xl p-6 sm:p-10 text-center cursor-pointer
          transition-all duration-300 active:scale-[0.99]
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
            <div className="space-y-3 sm:space-y-4 animate-fade-slide-up">
              <div className="relative inline-block">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="max-h-48 sm:max-h-64 mx-auto rounded-xl sm:rounded-2xl shadow-lg border-2 border-white/20"
                />
                <div className="absolute inset-0 rounded-xl sm:rounded-2xl bg-gradient-to-t from-black/20 to-transparent pointer-events-none" />
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <p className="text-xs sm:text-sm font-medium text-[var(--foreground)] truncate max-w-[200px] sm:max-w-md mx-auto">
                  {fileName}
                </p>
                <p className="text-xs sm:text-sm text-violet-500 font-medium flex items-center gap-1.5 sm:gap-2 justify-center">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Click or drag to replace
                </p>
              </div>
            </div>
          ) : fileName ? (
            <div className="space-y-2 sm:space-y-3 animate-fade-slide-up">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-xl sm:rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <p className="text-xs sm:text-sm font-medium text-[var(--foreground)] truncate max-w-[200px] sm:max-w-md mx-auto">
                  {fileName}
                </p>
                <p className="text-xs sm:text-sm text-violet-500 font-medium flex items-center gap-1.5 sm:gap-2 justify-center">
                  <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                  </svg>
                  Click or drag to replace
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 sm:space-y-4">
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-xl sm:rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110">
                {isDragActive ? (
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ) : (
                  <svg className="w-8 h-8 sm:w-10 sm:h-10 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                )}
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <p className="font-semibold text-sm sm:text-base text-[var(--foreground)]">
                  {isDragActive ? "Drop your file here" : "Drag & drop or tap to upload"}
                </p>
                <p className="text-[10px] sm:text-sm text-[var(--muted-foreground)]">
                  Supports: {Object.values(accept).flat().slice(0, 4).join(", ")}{Object.values(accept).flat().length > 4 ? '...' : ''}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="mt-2 sm:mt-3 flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm text-[var(--destructive)] animate-fade-slide-up">
          <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}
      {helperText && !error && (
        <p className="mt-2 sm:mt-3 text-xs sm:text-sm text-[var(--muted-foreground)]" style={{ lineHeight: '1.5' }}>
          {helperText}
        </p>
      )}
    </div>
  );
}
