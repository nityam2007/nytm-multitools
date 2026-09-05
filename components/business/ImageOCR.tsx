// English OCR with a self-hosted local engine | TypeScript
"use client";
import { useEffect, useRef, useState } from "react";
import type { Worker } from "tesseract.js";
import { Workspace, Result, Notice } from "./ToolUI";
export default function ImageOCR() {
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("");
  const [ready, setReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [progress, setProgress] = useState(0);
  const worker = useRef<Worker | null>(null);
  const generation = useRef(0);
  useEffect(
    () => () => {
      generation.current++;
      void worker.current?.terminate();
    },
    [],
  );
  async function prepare() {
    const id = ++generation.current;
    setBusy(true);
    setNotice("Loading the English OCR engine from NYTM...");
    try {
      const { createWorker } = await import("tesseract.js");
      const w = await createWorker("eng", 1, {
        workerPath: "/ocr/worker.min.js",
        corePath: "/ocr/core",
        langPath: "/ocr",
        logger: (event) => {
          if (generation.current === id) {
            setProgress(Math.round(event.progress * 100));
            setNotice(event.status);
          }
        },
      });
      if (generation.current !== id) {
        await w.terminate();
        return;
      }
      worker.current = w;
      setReady(true);
      setNotice(
        "English OCR is ready. Recognition runs locally. Offline use is verified in Chrome.",
      );
    } catch {
      if (generation.current === id)
        setNotice(
          "Could not load OCR. Check your connection for the first engine download and try again.",
        );
    } finally {
      if (generation.current === id) setBusy(false);
    }
  }
  return (
    <Workspace
      slug="image-ocr"
      help="English printed-text recognition using Tesseract. Load the engine first (several MB, served by NYTM), then extract text locally. Offline use is verified in Chrome. If Safari cannot read a file offline, reconnect and retry; recognition still runs locally. Best with clear, upright scans; handwriting and complex layouts may need correction. Up to 15 MB and 20 megapixels. The model may be cached on this device; uploaded images and results are kept in memory by this tool."
    >
      <div className="flex flex-wrap gap-3">
        <button
          className="btn btn-secondary"
          disabled={ready || busy}
          onClick={prepare}
        >
          {ready ? "OCR engine ready" : "Load English OCR engine"}
        </button>
        {busy && (
          <button
            className="btn btn-secondary"
            onClick={() => {
              generation.current++;
              void worker.current?.terminate();
              worker.current = null;
              setBusy(false);
              setReady(false);
              setNotice("Cancelled. Reload the engine to try again.");
            }}
          >
            Cancel
          </button>
        )}
      </div>
      <label className="block text-sm font-medium">
        Image with printed English text
        <input
          className="block mt-2"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          disabled={busy}
          onChange={(e) => {
            setFile(e.target.files?.[0] || null);
            setText("");
          }}
        />
      </label>
      <button
        className="btn btn-primary"
        disabled={!file || !ready || busy}
        onClick={async () => {
          if (!file || !worker.current) return;
          const id = generation.current;
          setBusy(true);
          setText("");
          try {
            if (file.size > 15 * 1024 * 1024)
              throw Error("Use an image smaller than 15 MB.");
            // Materialise the file before decoding so WebKit does not need to
            // resolve a file-backed Blob URL while this tab is offline.
            const bytes = new Uint8Array(await file.arrayBuffer());
            const image = new Blob([bytes], { type: file.type });
            const bitmap = await createImageBitmap(image);
            const pixels = bitmap.width * bitmap.height;
            bitmap.close();
            if (pixels > 20000000)
              throw Error("Use an image under 20 megapixels.");
            const result = await worker.current.recognize(image);
            if (generation.current === id) {
              setText(result.data.text);
              setNotice(
                result.data.text.trim()
                  ? `Recognition complete. Engine confidence: ${result.data.confidence.toFixed(0)}%. Review the extracted text.`
                  : "No text found. Try a clearer, upright image.",
              );
            }
          } catch (e) {
            if (generation.current === id) setNotice((e as Error).message);
          } finally {
            if (generation.current === id) setBusy(false);
          }
        }}
      >
        {busy ? "Working..." : "Extract text"}
      </button>
      {busy && (
        <progress
          className="w-full"
          max={100}
          value={progress}
          aria-label="OCR progress"
        />
      )}
      <Notice>{notice}</Notice>
      <Result
        text={text}
        filename="extracted-text.txt"
        label="Extracted text"
      />
    </Workspace>
  );
}
