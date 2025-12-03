// JPG to PDF Tool | TypeScript
"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("jpg-to-pdf")!;
const similarTools = getToolsByCategory("converter").filter(t => t.slug !== "jpg-to-pdf");

interface ImageFile {
  id: string;
  file: File;
  name: string;
  preview: string;
}

export default function JPGToPDFPage() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState("");
  const [pageSize, setPageSize] = useState<"fit" | "a4" | "letter">("fit");

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;

    Array.from(uploadedFiles).forEach(file => {
      if (!file.type.match(/image\/(jpeg|jpg)/)) {
        setError("Please select JPG/JPEG files only");
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setImages(prev => [...prev, {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          file,
          name: file.name,
          preview: event.target?.result as string,
        }]);
      };
      reader.readAsDataURL(file);
    });

    setError("");
    e.target.value = "";
  }, []);

  const removeImage = (id: string) => {
    setImages(prev => prev.filter(img => img.id !== id));
  };

  const convertToPDF = async () => {
    if (images.length === 0) {
      setError("Please add at least one JPG image");
      return;
    }

    setConverting(true);
    setError("");

    try {
      const { jsPDF } = await import("jspdf");

      let pdf: InstanceType<typeof jsPDF>;
      
      if (pageSize === "a4") {
        pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      } else if (pageSize === "letter") {
        pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
      } else {
        pdf = new jsPDF({ orientation: "portrait", unit: "px" });
      }

      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        
        const imgElement = new Image();
        imgElement.src = img.preview;
        await new Promise(resolve => imgElement.onload = resolve);

        if (i > 0) pdf.addPage();

        if (pageSize === "fit") {
          pdf = new jsPDF({
            orientation: imgElement.width > imgElement.height ? "landscape" : "portrait",
            unit: "px",
            format: [imgElement.width, imgElement.height]
          });
          if (i > 0) {
            pdf.addPage([imgElement.width, imgElement.height], imgElement.width > imgElement.height ? "landscape" : "portrait");
          }
          pdf.addImage(img.preview, "JPEG", 0, 0, imgElement.width, imgElement.height);
        } else {
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          const margin = pageSize === "a4" ? 10 : 12.7;

          const maxWidth = pageWidth - margin * 2;
          const maxHeight = pageHeight - margin * 2;

          let width = imgElement.width;
          let height = imgElement.height;

          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;

          const x = (pageWidth - width) / 2;
          const y = (pageHeight - height) / 2;

          pdf.addImage(img.preview, "JPEG", x, y, width, height);
        }
      }

      pdf.save("images.pdf");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create PDF");
    } finally {
      setConverting(false);
    }
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="border-2 border-dashed border-[var(--border)] rounded-xl p-8 text-center hover:border-orange-500/50 transition-colors">
          <input
            type="file"
            accept="image/jpeg,image/jpg"
            multiple
            onChange={handleFileUpload}
            className="hidden"
            id="jpg-upload"
          />
          <label htmlFor="jpg-upload" className="cursor-pointer">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-orange-500/10 flex items-center justify-center">
              <svg className="w-8 h-8 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
            </div>
            <p className="font-semibold text-lg mb-1">Drop JPG images here</p>
            <p className="text-sm text-[var(--muted-foreground)]">or click to browse</p>
          </label>
        </div>

        {error && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-500 text-sm">
            {error}
          </div>
        )}

        {images.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-semibold">{images.length} image{images.length > 1 ? "s" : ""} selected</h3>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {images.map((img, index) => (
                <div key={img.id} className="relative group rounded-lg overflow-hidden border border-[var(--border)]">
                  <img src={img.preview} alt={img.name} className="w-full h-32 object-cover" />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => removeImage(img.id)}
                      className="p-2 rounded-full bg-red-500 text-white"
                    >
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-xs p-1 truncate">
                    #{index + 1} {img.name}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {images.length > 0 && (
          <div className="p-4 rounded-xl bg-[var(--card)] border border-[var(--border)]">
            <h3 className="font-semibold mb-3">Page Size</h3>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "fit", label: "Fit to Image" },
                { value: "a4", label: "A4" },
                { value: "letter", label: "Letter" },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setPageSize(option.value as typeof pageSize)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all ${
                    pageSize === option.value
                      ? "bg-orange-500 text-white"
                      : "bg-[var(--muted)] hover:bg-[var(--muted)]/80"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        <button
          onClick={convertToPDF}
          disabled={images.length === 0 || converting}
          className="w-full py-4 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-white font-semibold shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          {converting ? (
            <>
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Converting...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Convert to PDF
            </>
          )}
        </button>

        <div className="p-4 rounded-xl bg-[var(--muted)] text-sm text-[var(--muted-foreground)]">
          <p className="flex items-center gap-2">
            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            All processing happens in your browser. Files never leave your device.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
