// Thumbnail-based PDF page reorder and extraction | TypeScript
"use client";
import { useEffect, useRef, useState } from "react";
import { Workspace, Notice } from "./ToolUI";
import { downloadBlob } from "@/lib/browser-files";
import type { PDFDocument } from "pdf-lib";
interface Page {
  index: number;
  selected: boolean;
  thumbnail: string;
}
export default function PDFOrganizer() {
  const [pages, setPages] = useState<Page[]>([]);
  const [name, setName] = useState("document");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const documentRef = useRef<PDFDocument | null>(null);
  const run = useRef(0);
  const dragged = useRef<number | null>(null);
  useEffect(
    () => () => {
      run.current++;
    },
    [],
  );
  const move = (from: number, to: number) => {
    const next = [...pages];
    const [page] = next.splice(from, 1);
    next.splice(to, 0, page);
    setPages(next);
  };
  return (
    <Workspace
      slug="pdf-organizer"
      help="Drag pages or use Move up / Move down to reorder. Uncheck pages to leave them out of the export. Maximum 25 MB and 100 pages. Encrypted PDFs must be unlocked first. Document-level forms, bookmarks, attachments, and digital signatures may not survive page copying; this tool is for page content."
    >
      <label className="block text-sm font-medium">
        Choose PDF
        <input
          type="file"
          accept="application/pdf,.pdf"
          className="block mt-2"
          disabled={busy}
          onChange={async (e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const id = ++run.current;
            setPages([]);
            documentRef.current = null;
            if (file.size > 25 * 1024 * 1024) {
              setNotice("Choose a PDF smaller than 25 MB.");
              return;
            }
            setBusy(true);
            setNotice("Reading PDF pages...");
            let preview: import("pdfjs-dist").PDFDocumentProxy | undefined;
            let task: import("pdfjs-dist").PDFDocumentLoadingTask | undefined;
            try {
              const [{ PDFDocument }, pdfjs] = await Promise.all([
                import("pdf-lib"),
                import("pdfjs-dist"),
              ]);
              const bytes = await file.arrayBuffer();
              const doc = await PDFDocument.load(bytes);
              if (doc.getPageCount() > 100)
                throw Error("Choose a PDF with at most 100 pages.");
              pdfjs.GlobalWorkerOptions.workerSrc = "/workers/pdf.worker.mjs";
              task = pdfjs.getDocument({
                data: new Uint8Array(bytes.slice(0)),
              });
              preview = await task.promise;
              const next: Page[] = [];
              for (let i = 0; i < doc.getPageCount(); i++) {
                if (run.current !== id) return;
                const page = await preview.getPage(i + 1);
                const base = page.getViewport({ scale: 1 });
                const viewport = page.getViewport({
                  scale: Math.min(160 / base.width, 220 / base.height),
                });
                const canvas = document.createElement("canvas");
                canvas.width = Math.ceil(viewport.width);
                canvas.height = Math.ceil(viewport.height);
                const ctx = canvas.getContext("2d")!;
                await page.render({ canvas, canvasContext: ctx, viewport })
                  .promise;
                next.push({
                  index: i,
                  selected: true,
                  thumbnail: canvas.toDataURL("image/png"),
                });
                page.cleanup();
                setNotice(`Preparing page ${i + 1}/${doc.getPageCount()}`);
              }
              if (run.current === id) {
                documentRef.current = doc;
                setPages(next);
                setName(file.name.replace(/\.pdf$/i, ""));
                setNotice(
                  `${next.length} pages loaded. Select and arrange the pages to keep.`,
                );
              }
            } catch (error) {
              if (run.current === id) setNotice((error as Error).message);
            } finally {
              await task?.destroy();
              if (run.current === id) setBusy(false);
            }
          }}
        />
      </label>
      {busy && !pages.length && (
        <button
          className="btn btn-secondary"
          onClick={() => {
            run.current++;
            setBusy(false);
            setNotice("Cancelled.");
          }}
        >
          Cancel loading
        </button>
      )}
      <Notice>{notice}</Notice>
      {pages.length > 0 && (
        <>
          <div className="flex flex-wrap gap-3">
            <button
              className="btn btn-secondary"
              onClick={() =>
                setPages(pages.map((p) => ({ ...p, selected: true })))
              }
            >
              Select all
            </button>
            <button
              className="btn btn-secondary"
              onClick={() =>
                setPages(pages.map((p) => ({ ...p, selected: false })))
              }
            >
              Select none
            </button>
            <button
              className="btn btn-secondary"
              onClick={() =>
                setPages([...pages].sort((a, b) => a.index - b.index))
              }
            >
              Original order
            </button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {pages.map((page, i) => (
              <article
                key={page.index}
                draggable
                onDragStart={() => {
                  dragged.current = i;
                }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (dragged.current !== null) move(dragged.current, i);
                  dragged.current = null;
                }}
                className={`border rounded-lg p-3 ${page.selected ? "border-[var(--primary)]" : "border-[var(--border)] opacity-60"}`}
              >
                <label className="flex items-center gap-2 text-sm mb-3">
                  <input
                    type="checkbox"
                    checked={page.selected}
                    onChange={(e) =>
                      setPages(
                        pages.map((p, j) =>
                          i === j ? { ...p, selected: e.target.checked } : p,
                        ),
                      )
                    }
                  />
                  Page {page.index + 1}
                </label>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={page.thumbnail}
                  alt={`Preview of original page ${page.index + 1}`}
                  className="w-full h-44 object-contain bg-white"
                />
                <div className="flex flex-wrap gap-2 mt-3">
                  <button
                    className="text-xs underline py-2"
                    disabled={i === 0}
                    aria-label={`Move page ${page.index + 1} up`}
                    onClick={() => move(i, i - 1)}
                  >
                    Move up
                  </button>
                  <button
                    className="text-xs underline py-2"
                    disabled={i === pages.length - 1}
                    aria-label={`Move page ${page.index + 1} down`}
                    onClick={() => move(i, i + 1)}
                  >
                    Move down
                  </button>
                </div>
              </article>
            ))}
          </div>
          <button
            className="btn btn-primary"
            disabled={busy || !pages.some((p) => p.selected)}
            onClick={async () => {
              setBusy(true);
              try {
                const { PDFDocument } = await import("pdf-lib");
                const out = await PDFDocument.create();
                const selected = pages.filter((p) => p.selected);
                const copied = await out.copyPages(
                  documentRef.current!,
                  selected.map((p) => p.index),
                );
                copied.forEach((page) => out.addPage(page));
                downloadBlob(
                  new Blob([new Uint8Array(await out.save())], {
                    type: "application/pdf",
                  }),
                  `${name}-organized.pdf`,
                );
                setNotice(
                  `Exported ${selected.length} pages in the chosen order.`,
                );
              } catch (e) {
                setNotice((e as Error).message);
              } finally {
                setBusy(false);
              }
            }}
          >
            Download {pages.filter((p) => p.selected).length} selected pages
          </button>
        </>
      )}
    </Workspace>
  );
}
