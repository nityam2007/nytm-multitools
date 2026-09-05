// Keyboard-accessible file chooser with drag/drop, validation and selection feedback | TypeScript
"use client";
import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState, type InputHTMLAttributes } from "react";
import { UploadIcon, CheckCircleIcon } from "@/assets/icons";

interface FilePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "children"> {
  label?: string;
  helperText?: string;
  maxSize?: number;
  maxTotalSize?: number;
  maxFiles?: number;
  preview?: boolean;
}
const sizeLabel = (bytes: number) => bytes >= 1024 * 1024
  ? `${Number((bytes / 1024 / 1024).toFixed(1))} MB`
  : `${Math.max(1, Math.round(bytes / 1024))} KB`;
function acceptsFile(file: File, accept: string) {
  if (!accept) return true;
  const extensions: Record<string, string[]> = {
    "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"], "image/webp": [".webp"],
    "image/gif": [".gif"], "application/pdf": [".pdf"], "text/csv": [".csv"],
    "text/plain": [".txt"], "image/heic": [".heic"], "image/heif": [".heif"],
  };
  return accept.toLowerCase().split(",").some(raw => {
    const rule = raw.trim();
    if (rule.startsWith(".")) return file.name.toLowerCase().endsWith(rule);
    if (rule.endsWith("/*")) return file.type.toLowerCase().startsWith(rule.slice(0, -1));
    return file.type.toLowerCase() === rule || extensions[rule]?.some(ext => file.name.toLowerCase().endsWith(ext));
  });
}
function formatList(accept: string) {
  if (!accept) return "Any file type";
  return [...new Set(accept.split(",").map(rule => rule.trim().startsWith(".")
    ? rule.trim().slice(1).toUpperCase()
    : rule.trim().replace("application/", "").replace("image/", "").replace("text/", "").replace("*", "files").toUpperCase()))].join(", ");
}

export const FilePicker = forwardRef<HTMLInputElement, FilePickerProps>(function FilePicker({
  label = "Select a file", helperText, accept = "", multiple = false, disabled = false,
  maxSize, maxTotalSize, maxFiles, preview = false, id, name, onChange, className = "", ...props
}, ref) {
  const generatedId = useId();
  const inputId = id || generatedId;
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [dragging, setDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");
  useImperativeHandle(ref, () => inputRef.current!);
  useEffect(() => () => { if (previewUrl) URL.revokeObjectURL(previewUrl); }, [previewUrl]);

  const helper = helperText || [
    formatList(accept),
    maxSize ? `Up to ${sizeLabel(maxSize)}${multiple ? " each" : ""}` : "",
    maxFiles ? `Up to ${maxFiles} files` : "",
    maxTotalSize ? `${sizeLabel(maxTotalSize)} total` : "",
  ].filter(Boolean).join(" · ");
  const descriptionIds = [`${inputId}-label`, `${inputId}-help`, `${inputId}-selection`, error ? `${inputId}-error` : "", props["aria-describedby"]].filter(Boolean).join(" ");

  return <div className={`file-picker ${className}`} data-disabled={disabled || undefined}>
    <label id={`${inputId}-label`} htmlFor={inputId} className="file-picker-label">{label}</label>
    <div className="file-dropzone" data-dragging={dragging || undefined} data-invalid={Boolean(error) || undefined}
      onDragEnter={e => { if (!disabled && e.dataTransfer.types.includes("Files")) { e.preventDefault(); setDragging(true); } }}
      onDragOver={e => { if (e.dataTransfer.types.includes("Files")) { e.preventDefault(); e.dataTransfer.dropEffect = disabled ? "none" : "copy"; } }}
      onDragLeave={e => { if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false); }}
      onDrop={e => {
        e.preventDefault(); e.stopPropagation(); setDragging(false);
        const input = inputRef.current;
        if (!input || input.matches(":disabled")) return;
        if (!e.dataTransfer.files.length) { setError("Choose a file from your device. Folders are not supported."); return; }
        try {
          input.files = e.dataTransfer.files;
          input.dispatchEvent(new Event("change", { bubbles: true }));
        } catch { setError("Drag and drop is unavailable here. Use Browse files instead."); }
      }}>
      <span className="file-picker-icon" aria-hidden="true"><UploadIcon className="w-6 h-6" /></span>
      <div className="file-picker-copy">
        <p className="file-picker-prompt">{dragging ? "Drop to select" : multiple ? "Drop files here" : "Drop your file here"}</p>
        <p id={`${inputId}-help`} className="file-picker-hint">{helper}</p>
      </div>
      <input {...props} ref={inputRef} id={inputId} name={name || inputId} type="file" hidden
        accept={accept || undefined} multiple={multiple} disabled={disabled}
        aria-describedby={descriptionIds} aria-invalid={Boolean(error) || undefined}
        onChange={e => {
          const next = Array.from(e.currentTarget.files || []);
          if (!next.length) return;
          const rejection = !multiple && next.length > 1 ? "Choose one file at a time."
            : maxFiles && next.length > maxFiles ? `Choose up to ${maxFiles} files.`
            : next.some(file => !acceptsFile(file, accept)) ? `Choose a supported file: ${formatList(accept)}.`
            : maxSize && next.some(file => file.size > maxSize) ? `Each file must be ${sizeLabel(maxSize)} or smaller.`
            : maxTotalSize && next.reduce((sum, file) => sum + file.size, 0) > maxTotalSize ? `Choose files totalling ${sizeLabel(maxTotalSize)} or less.` : "";
          if (rejection) { setError(rejection); e.currentTarget.value = ""; return; }
          setError(""); setFiles(next);
          setPreviewUrl(preview && next[0].type.startsWith("image/") && !next[0].type.includes("svg") ? URL.createObjectURL(next[0]) : "");
          onChange?.(e);
        }} />
      <button type="button" className="btn btn-primary file-picker-browse" disabled={disabled}
        aria-describedby={descriptionIds}
        onClick={() => { if (inputRef.current) { inputRef.current.value = ""; inputRef.current.click(); } }}>
        Browse files
      </button>
    </div>
    {previewUrl && <div className="file-picker-preview">
      {/* User-selected local image preview. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={previewUrl} alt={`Selected file: ${files[0]?.name || "image"}`} width={320} height={180}
        onError={() => setPreviewUrl("")} />
    </div>}
    <p id={`${inputId}-selection`} role="status" aria-live="polite" className="file-picker-selection">
      {files.length ? <><span aria-hidden="true"><CheckCircleIcon className="w-4 h-4" /></span>
        <span>{files.length === 1 ? files[0].name : `${files.length} files selected`}<span className="file-picker-size"> · {sizeLabel(files.reduce((sum, file) => sum + file.size, 0))}</span></span></>
        : "No file selected yet."}
    </p>
    {error && <p id={`${inputId}-error`} role="alert" className="field-error">{error}</p>}
  </div>;
});
