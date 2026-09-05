// Shared browser image resizing and encoding | TypeScript
export interface ImageOptions {
  width: number;
  height: number;
  fit: "contain" | "cover";
  type: "image/jpeg" | "image/png" | "image/webp";
  quality: number;
  background: string;
}
export async function transformImage(
  file: Blob,
  options: ImageOptions,
): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  try {
    if (bitmap.width * bitmap.height > 40000000)
      throw Error(
        "Image exceeds 40 megapixels. Resize the original before using this tool.",
      );
    const { width, height, type, quality, background, fit } = options;
    const canvas =
      typeof OffscreenCanvas !== "undefined"
        ? new OffscreenCanvas(width, height)
        : Object.assign(document.createElement("canvas"), { width, height });
    const ctx = canvas.getContext("2d") as
      CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D | null;
    if (!ctx) throw Error("Canvas processing is unavailable in this browser.");
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, width, height);
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = "high";
    const scale =
      fit === "cover"
        ? Math.max(width / bitmap.width, height / bitmap.height)
        : Math.min(width / bitmap.width, height / bitmap.height);
    const w = bitmap.width * scale,
      hh = bitmap.height * scale;
    ctx.drawImage(bitmap, (width - w) / 2, (height - hh) / 2, w, hh);
    const blob =
      "convertToBlob" in canvas
        ? await canvas.convertToBlob({ type, quality })
        : await new Promise<Blob>((resolve, reject) =>
            (canvas as HTMLCanvasElement).toBlob(
              (b) =>
                b ? resolve(b) : reject(Error("Could not encode image.")),
              type,
              quality,
            ),
          );
    if (blob.type !== type)
      throw Error(`This browser cannot export ${type}. Try PNG or JPEG.`);
    return blob;
  } finally {
    bitmap.close();
  }
}
