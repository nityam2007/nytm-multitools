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
      {label && <label className="block text-sm font-medium mb-2">{label}</label>}
      
      <div
        {...getRootProps()}
        className={`
          border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
          transition-all duration-200
          ${isDragActive 
            ? "border-[var(--primary)] bg-[var(--primary)]/10" 
            : "border-[var(--border)] hover:border-[var(--primary)]/50"
          }
          ${error ? "border-[var(--destructive)]" : ""}
        `}
      >
        <input {...getInputProps()} />
        
        {previewUrl ? (
          <div className="space-y-4">
            <img
              src={previewUrl}
              alt="Preview"
              className="max-h-48 mx-auto rounded-lg"
            />
            <p className="text-sm text-[var(--muted-foreground)]">{fileName}</p>
            <p className="text-sm text-[var(--primary)]">Click or drag to replace</p>
          </div>
        ) : fileName ? (
          <div className="space-y-2">
            <div className="text-4xl">📄</div>
            <p className="text-sm font-medium">{fileName}</p>
            <p className="text-sm text-[var(--primary)]">Click or drag to replace</p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="text-4xl">📁</div>
            <p className="font-medium">
              {isDragActive ? "Drop the file here" : "Drag & drop or click to upload"}
            </p>
            <p className="text-sm text-[var(--muted-foreground)]">
              Maximum file size: {maxSize / 1024 / 1024}MB
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="mt-2 text-sm text-[var(--destructive)]">{error}</p>
      )}
      {helperText && !error && (
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">{helperText}</p>
      )}
    </div>
  );
}
