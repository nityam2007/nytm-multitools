// Verified metadata removal from JPEG and PNG files | TypeScript
"use client";
import { FilePicker } from "@/components/FilePicker";
import { useState } from "react";
import { Workspace, Notice } from "./ToolUI";
import { stripImageMetadata } from "@/lib/image-metadata";
import { downloadBlob } from "@/lib/browser-files";
export default function MetadataRemover() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<Blob | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  return (
    <Workspace
      slug="metadata-remover"
      help="Losslessly removes JPEG EXIF/XMP (APP1), IPTC (APP13), and comments, plus PNG text and EXIF chunks. Colour profiles and image pixels are retained. JPEG orientation metadata is removed, so some photos may display rotated; review the result before sharing. Visible information inside the image is not removed."
    >
      <FilePicker label="JPEG or PNG (up to 25 MB)"
        accept="image/jpeg,image/png"
        disabled={busy}
        onChange={(e) => {
            setFile(e.target.files?.[0] || null);
            setResult(null);
            setNotice("");
          }}
      />
      <button
        className="btn btn-primary"
        disabled={!file || busy}
        onClick={async () => {
          if (!file) return;
          setBusy(true);
          setResult(null);
          try {
            if (file.size > 25 * 1024 * 1024)
              throw Error("Use an image smaller than 25 MB.");
            const clean = stripImageMetadata(
              new Uint8Array(await file.arrayBuffer()),
            );
            const check = stripImageMetadata(clean.bytes);
            if (check.removed !== 0)
              throw Error("Could not verify the output metadata.");
            const blob = new Blob([new Uint8Array(clean.bytes)], {
              type: clean.type,
            });
            const bitmap = await createImageBitmap(blob);
            bitmap.close();
            setResult(blob);
            setNotice(
              `Removed ${clean.removed} supported metadata blocks. Verified: none of those block types remain, and the image still decodes.`,
            );
          } catch (e) {
            setNotice((e as Error).message);
          } finally {
            setBusy(false);
          }
        }}
      >
        {busy ? "Removing metadata..." : "Remove & verify metadata"}
      </button>
      <Notice>{notice}</Notice>
      {result && file && (
        <button
          className="btn btn-secondary"
          onClick={() =>
            downloadBlob(
              result,
              `${file.name.replace(/\.[^.]+$/, "")}-clean.${result.type === "image/png" ? "png" : "jpg"}`,
            )
          }
        >
          Download clean image
        </button>
      )}
    </Workspace>
  );
}
