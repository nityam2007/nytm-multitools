// Compatibility wrapper for single-file upload tools | TypeScript
"use client";
import { FilePicker } from "@/components/FilePicker";

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
  maxSize = 10 * 1024 * 1024, label = "Select a file", helperText, preview = true,
}: FileUploadProps) {
  return <FilePicker label={label} accept={Object.entries(accept).flatMap(([mime, extensions]) => [mime, ...extensions]).join(",")}
    maxSize={maxSize} helperText={helperText} preview={preview}
    onChange={e => { const file = e.target.files?.[0]; if (file) onFileSelect(file); }} />;
}
