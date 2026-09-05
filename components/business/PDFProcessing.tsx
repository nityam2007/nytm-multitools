// Verified PDF password and compression controls | TypeScript
"use client";
import { useEffect, useRef, useState } from "react";
import { Workspace, Field, Notice } from "./ToolUI";
import { downloadBlob } from "@/lib/browser-files";

export default function PDFProcessing({ mode }: { mode: "lock" | "unlock" | "compress" }) {
  const [file, setFile] = useState<File | null>(null); const [password, setPassword] = useState(""); const [confirm, setConfirm] = useState(""); const [ready, setReady] = useState(false); const [busy, setBusy] = useState(false); const [notice, setNotice] = useState(""); const [output, setOutput] = useState<Blob | null>(null);
  const worker = useRef<Worker | null>(null);
  useEffect(() => () => worker.current?.terminate(), []);
  function prepare() {
    setBusy(true); setNotice("Loading the PDF engine from NYTM..."); worker.current?.terminate();
    try {
      const next = new Worker("/workers/pdf-tools.worker.js", { type: "module" }); worker.current = next;
      next.onmessage = ({ data }) => { setBusy(false); if (data.ready) { setReady(true); setNotice("PDF engine ready. Processing now runs locally in this tab."); } else if (data.error) { setNotice(data.error); setOutput(null); } else { setOutput(new Blob([data.bytes], { type: "application/pdf" })); setNotice(data.unchanged ? "No size reduction found. The download preserves your original file." : `Verified ${data.pages} pages. ${mode === "lock" ? "AES-256 password protection applied." : mode === "unlock" ? "Password protection removed." : "PDF streams recompressed without rasterising pages."}`); } };
      next.onerror = () => { setBusy(false); setReady(false); setNotice("The PDF worker failed. Reload the engine and try again."); next.terminate(); };
    } catch { setBusy(false); setNotice("Could not start the PDF worker in this browser."); }
  }
  const valid = !!file && file.size <= 25 * 1024 * 1024 && (mode === "compress" || (mode === "unlock" ? !!password : password.length >= 8 && password === confirm));
  return <Workspace slug={`pdf-${mode}`} help={mode === "compress" ? "Recompresses PDF streams and packs objects with qpdf. Image quality and page text are preserved; already compressed PDFs may not shrink. This does not downsample scanned pages. Maximum 25 MB. First engine load is about 2 MB." : "Uses qpdf in a local WebAssembly worker. Lock applies AES-256 and verifies the result; unlock requires the existing password. PDFs are rewritten, so digital signatures may no longer validate. Keep the original file and store your password securely. Maximum 25 MB."}>
    <div className="flex gap-3"><button className="btn btn-secondary" disabled={ready || busy} onClick={prepare}>{ready ? "PDF engine ready" : "Load PDF engine"}</button>{busy && <button className="btn btn-secondary" onClick={() => { worker.current?.terminate(); worker.current = null; setReady(false); setBusy(false); setNotice("Cancelled. Load the engine again to continue."); }}>Cancel</button>}</div>
    <label className="block text-sm font-medium">Choose PDF (up to 25 MB)<input className="block mt-2" type="file" accept="application/pdf,.pdf" disabled={busy} onChange={e => { setFile(e.target.files?.[0] || null); setOutput(null); setNotice(""); }} /></label>
    <fieldset disabled={busy} className="grid sm:grid-cols-2 gap-5">{mode !== "compress" && <Field label={mode === "lock" ? "New password (at least 8 characters)" : "Existing PDF password"} type="password" value={password} onChange={v => { setPassword(v); setOutput(null); }} />}{mode === "lock" && <Field label="Confirm new password" type="password" value={confirm} onChange={v => { setConfirm(v); setOutput(null); }} />}</fieldset>
    <button className="btn btn-primary" disabled={!ready || !valid || busy} onClick={() => { setBusy(true); setOutput(null); setNotice("Processing PDF..."); worker.current?.postMessage({ mode, file, password }); }}>{mode === "lock" ? "Lock PDF" : mode === "unlock" ? "Unlock PDF" : "Compress PDF"}</button>
    {file && file.size > 25 * 1024 * 1024 && <Notice>Please use a file smaller than 25 MB.</Notice>}{mode === "lock" && confirm && confirm !== password && <Notice>The passwords do not match.</Notice>}<Notice>{notice}</Notice>
    {output && file && <section className="space-y-3"><p className="text-sm">Original: {(file.size / 1024).toFixed(1)} KB · Result: {(output.size / 1024).toFixed(1)} KB</p><button className="btn btn-primary" onClick={() => downloadBlob(output, `${file.name.replace(/\.pdf$/i, "")}-${mode === "lock" ? "locked" : mode === "unlock" ? "unlocked" : "compressed"}.pdf`)}>Download PDF</button></section>}
  </Workspace>;
}
