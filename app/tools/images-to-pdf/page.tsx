// Images to PDF Tool | TypeScript
"use client";

import { useState, useCallback } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { FileUpload } from "@/components/FileUpload";
import { Button } from "@/components/Button";
import { getToolBySlug, getToolsByCategory } from "@/lib/tools-config";

const tool = getToolBySlug("images-to-pdf")!;
const similarTools = getToolsByCategory("converter").filter(t => t.slug !== "images-to-pdf");

interface ImageFile {
  id: string;
  file: File;
  name: string;
  preview: string;
}

export default function ImagesToPDFPage() {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [converting, setConverting] = useState(false);
  const [error, setError] = useState("");
  const [pageSize, setPageSize] = useState<"fit" | "a4" | "letter">("fit");

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = e.target.files;
    if (!uploadedFiles) return;

    const validFiles = Array.from(uploadedFiles).filter(file => 
      file.type.startsWith("image/")
    );

    if (validFiles.length === 0) {
      setError("Please select image files (PNG, JPG, WebP, GIF, etc.)");
      return;
    }

    validFiles.forEach(file => {
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

  const moveImage = (index: number, direction: "up" | "down") => {
    const newImages = [...images];
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= images.length) return;
    [newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]];
    setImages(newImages);
  };

  const convertToPDF = async () => {
    if (images.length === 0) {
      setError("Please add at least one image");
      return;
    }

    setConverting(true);
    setError("");

    try {
      const { jsPDF } = await import("jspdf");

      let pdf: InstanceType<typeof jsPDF>;
      
      // Initialize PDF
      if (pageSize === "a4") {
        pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      } else if (pageSize === "letter") {
        pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
      } else {
        pdf = new jsPDF({ orientation: "portrait", unit: "px" });
      }

      for (let i = 0; i < images.length; i++) {
        const img = images[i];
        
        // Load image dimensions
        const imgElement = new Image();
        imgElement.src = img.preview;
        await new Promise(resolve => imgElement.onload = resolve);

        if (i > 0) pdf.addPage();

        if (pageSize === "fit") {
          // Fit page to image
          if (i === 0) {
            pdf = new jsPDF({
              orientation: imgElement.width > imgElement.height ? "landscape" : "portrait",
              unit: "px",
              format: [imgElement.width, imgElement.height]
            });
          } else {
            pdf.addPage([imgElement.width, imgElement.height], imgElement.width > imgElement.height ? "landscape" : "portrait");
          }
          pdf.addImage(img.preview, "PNG", 0, 0, imgElement.width, imgElement.height);
        } else {
          // Fit image to page
          const pageWidth = pdf.internal.pageSize.getWidth();
          const pageHeight = pdf.internal.pageSize.getHeight();
          
          const ratio = Math.min(
            pageWidth / imgElement.width,
            pageHeight / imgElement.height
          );
          
          const width = imgElement.width * ratio;
          const height = imgElement.height * ratio;
          const x = (pageWidth - width) / 2;
          const y = (pageHeight - height) / 2;

          pdf.addImage(img.preview, "PNG", x, y, width, height);
        }
      }

      pdf.save("images.pdf");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to convert images to PDF");
    } finally {
      setConverting(false);
    }
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
          <h3 className="text-sm font-semibold mb-4">Upload Images</h3>
          <div className="w-full">
            <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-1 xs:gap-2 mb-2">
              <label className="text-xs sm:text-sm font-semibold text-[var(--foreground)]">Choose images (PNG, JPG, WebP, GIF, etc.)</label>
              <span className="text-[10px] sm:text-xs text-[var(--muted-foreground)] font-mono">Multiple files</span>
            </div>
            <label className="relative overflow-hidden border-2 border-dashed rounded-xl sm:rounded-2xl p-6 sm:p-10 text-center cursor-pointer transition-all duration-300 hover:border-violet-500/50 hover:bg-gradient-to-br hover:from-violet-500/5 hover:to-purple-500/5 shadow-sm hover:shadow-md flex flex-col items-center gap-3 sm:gap-4 border-[var(--border)]">
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                onChange={handleFileUpload}
                className="sr-only"
              />
              <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-xl sm:rounded-2xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 sm:w-10 sm:h-10 text-violet-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <div className="space-y-1.5 sm:space-y-2">
                <p className="font-semibold text-sm sm:text-base text-[var(--foreground)]">Drag & drop or tap to upload</p>
                <p className="text-[10px] sm:text-sm text-[var(--muted-foreground)]">Supports: .png, .jpg, .jpeg, .webp, .gif, .bmp, .svg</p>
              </div>
            </label>
          </div>

          {images.length > 0 && (
            <div className="mt-4 space-y-2 max-h-96 overflow-y-auto">
              {images.map((img, index) => (
                <div key={img.id} className="flex items-center gap-3 p-3 bg-[var(--muted)] rounded-xl">
                  <img src={img.preview} alt={img.name} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{img.name}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">
                      {(img.file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => moveImage(index, "up")}
                      disabled={index === 0}
                      className="p-1.5 rounded-lg hover:bg-[var(--background)] disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move up"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => moveImage(index, "down")}
                      disabled={index === images.length - 1}
                      className="p-1.5 rounded-lg hover:bg-[var(--background)] disabled:opacity-30 disabled:cursor-not-allowed"
                      title="Move down"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                    <button
                      onClick={() => removeImage(img.id)}
                      className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-500"
                      title="Remove"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {images.length > 0 && (
          <div className="bg-[var(--card)] border border-[var(--border)] rounded-2xl p-6">
            <h3 className="text-sm font-semibold mb-4">Page Size</h3>
            <div className="grid grid-cols-3 gap-3">
              {(["fit", "a4", "letter"] as const).map((size) => (
                <button
                  key={size}
                  onClick={() => setPageSize(size)}
                  className={`px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    pageSize === size
                      ? "bg-violet-500 text-white"
                      : "bg-[var(--muted)] hover:bg-[var(--muted)]/80"
                  }`}
                >
                  {size === "fit" && "Fit to Image"}
                  {size === "a4" && "A4"}
                  {size === "letter" && "Letter"}
                </button>
              ))}
            </div>
            <p className="text-xs text-[var(--muted-foreground)] mt-3 text-center">
              {pageSize === "fit" && "Each page sized to match image dimensions"}
              {pageSize === "a4" && "Standard A4 paper size (210 × 297 mm)"}
              {pageSize === "letter" && "US Letter size (8.5 × 11 in)"}
            </p>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
            <p className="text-sm text-red-500">{error}</p>
          </div>
        )}

        <Button
          onClick={convertToPDF}
          disabled={images.length === 0 || converting}
          className="w-full"
        >
          {converting ? "Converting..." : `Convert ${images.length} Image${images.length !== 1 ? "s" : ""} to PDF`}
        </Button>

        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
          <p className="text-sm text-blue-400">
            <strong>Supported Formats:</strong> PNG, JPG/JPEG, WebP, GIF, SVG, BMP, and more.
            All processing happens in your browser.
          </p>
        </div>
      </div>
    </ToolLayout>
  );
}
