"use client";

import { useState, useEffect } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUpload } from "@/components/FileUpload";
import { OutputBox } from "@/components/OutputBox";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";
import { logToolUsage } from "@/lib/actions";

const tool = getToolBySlug("image-to-base64")!;
const similarTools = getToolsByCategory("converter").filter(t => t.slug !== "image-to-base64");

export default function ImageToBase64Page() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [output, setOutput] = useState("");
  const [includePrefix, setIncludePrefix] = useState(true);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      setOutput("");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreview(url);

    return () => URL.revokeObjectURL(url);
  }, [file]);

  const handleConvert = async () => {
    if (!file) return;
    const startTime = Date.now();

    const reader = new FileReader();
    reader.onload = async () => {
      const base64 = reader.result as string;
      const result = includePrefix ? base64 : base64.split(",")[1];
      setOutput(result);

      await logToolUsage({
        toolName: tool.name,
        toolCategory: tool.category,
        inputType: "file",
        rawInput: file.name,
        outputResult: `Base64 string (${result.length} chars)`,
        processingDuration: Date.now() - startTime,
      });
    };
    reader.readAsDataURL(file);
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <FileUpload
          accept={{ "image/*": [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg", ".ico"] }}
          onFileSelect={setFile}
          maxSize={10 * 1024 * 1024}
        />

        {preview && (
          <div className="card p-4">
            <h3 className="font-medium mb-2">Preview</h3>
            <img src={preview} alt="Preview" className="max-w-full max-h-64 h-auto rounded" />
            <p className="text-sm text-muted-foreground mt-2">
              {file?.name} ({(file?.size || 0 / 1024).toFixed(2)} KB)
            </p>
          </div>
        )}

        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={includePrefix}
            onChange={(e) => setIncludePrefix(e.target.checked)}
            className="w-4 h-4"
          />
          <span className="text-sm">Include data URI prefix (data:image/...)</span>
        </label>

        <button
          onClick={handleConvert}
          disabled={!file}
          className="btn btn-primary w-full py-3"
        >
          Convert to Base64
        </button>

        <OutputBox label="Base64 Output" value={output} downloadFileName="base64.txt" />

        {output && (
          <div className="card p-4">
            <h3 className="font-medium mb-2">Usage Example</h3>
            <pre className="bg-muted p-3 rounded text-xs overflow-x-auto">
              {`<img src="${output.substring(0, 50)}..." alt="Image" />`}
            </pre>
          </div>
        )}
      </div>
    </ToolLayout>
  );
}
