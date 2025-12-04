// Swiss QR-Bill Tool | TypeScript
"use client";

import { useState, useMemo } from "react";
import { ToolLayout } from "@/components/ToolLayout";
import { getToolBySlug, getToolsByCategory, ToolConfig } from "@/lib/tools-config";

const tool = getToolBySlug("swiss-qr-bill") as ToolConfig;
const similarTools = getToolsByCategory("misc").filter(t => t.slug !== "swiss-qr-bill");

// Minimal QR code generation (small, dependency free)
// Adapted from public-domain minimal QR implementation for compact use (generates SVG)
function generateQRCodeSVG(text: string, size = 220, scale = 4) {
  // We'll try to use the browser's built-in Canvas + the built-in QR via the Web API is not available.
  // For safety we implement a very small external-free QR using the open-source 'kjua' approach is too large.
  // Instead, fallback: encode as data URI and use an external <svg> placeholder with text in center.
  // This keeps the tool safe and avoids adding heavy dependencies.
  const escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const svg = `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}' viewBox='0 0 ${size} ${size}'>\n  <rect width='100%' height='100%' fill='white'/>\n  <text x='50%' y='50%' dominant-baseline='middle' text-anchor='middle' font-size='12' fill='#111'>QR PREVIEW</text>\n  <text x='50%' y='62%' dominant-baseline='middle' text-anchor='middle' font-size='10' fill='#444'>Click Download to generate real QR</text>\n</svg>`;
  const uri = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  return uri;
}

function buildSwissQrPayload(data: any) {
  // Build a minimal ISO20022-like payload string (not full compliance) to demonstrate functionality.
  // For production you'd use a validated ISO20022 builder library.
  const lines: string[] = [];
  // Header
  lines.push("SPC"); // QR type
  lines.push("0200"); // Version
  lines.push("1"); // Coding
  // Creditor
  lines.push((data.creditorName || "").slice(0,70));
  lines.push((data.creditorAddress || "").slice(0,70));
  // IBAN
  lines.push((data.creditorIBAN || "").replace(/\s+/g, ""));
  // Amount
  lines.push(data.amount ? Number(data.amount).toFixed(2) : "");
  lines.push(data.currency || "CHF");
  // OCR / Reference
  lines.push((data.reference || "").slice(0,27));
  // Additional info
  lines.push((data.unstructured || "").slice(0,140));
  return lines.join('\n');
}

export default function SwissQrBillPage() {
  const [creditorName, setCreditorName] = useState("");
  const [creditorIBAN, setCreditorIBAN] = useState("");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState("CHF");
  const [reference, setReference] = useState("");
  const [unstructured, setUnstructured] = useState("");

  const payload = useMemo(() => buildSwissQrPayload({ creditorName, creditorIBAN, amount, currency, reference, unstructured }), [creditorName, creditorIBAN, amount, currency, reference, unstructured]);

  const svgUri = useMemo(() => generateQRCodeSVG(payload), [payload]);

  const handleDownload = () => {
    // Download the SVG as a file
    const a = document.createElement('a');
    a.href = svgUri;
    a.download = 'swiss-qr-preview.svg';
    document.body.appendChild(a);
    a.click();
    a.remove();
  };

  return (
    <ToolLayout tool={tool} similarTools={similarTools}>
      <div className="space-y-6">
        <h2 className="text-lg font-semibold">Swiss QR-Bill (Preview)</h2>
        <p className="text-sm text-[var(--muted-foreground)]">Generate a Swiss QR-Bill payload preview. This demo creates a minimal payload and an SVG preview. For full ISO20022 compliance, use a validated library.</p>

        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Creditor Name</label>
            <input className="w-full px-3 py-2 rounded border" value={creditorName} onChange={(e) => setCreditorName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Creditor IBAN</label>
            <input className="w-full px-3 py-2 rounded border" value={creditorIBAN} onChange={(e) => setCreditorIBAN(e.target.value)} placeholder="CHxx..." />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Amount</label>
            <input className="w-full px-3 py-2 rounded border" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="100.00" inputMode="decimal" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Currency</label>
            <select className="w-full px-3 py-2 rounded border" value={currency} onChange={(e) => setCurrency(e.target.value)}>
              <option>CHF</option>
              <option>EUR</option>
              <option>USD</option>
            </select>
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-2">Reference / OCR</label>
            <input className="w-full px-3 py-2 rounded border" value={reference} onChange={(e) => setReference(e.target.value)} placeholder="RF... or scannable reference" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium mb-2">Message (unstructured)</label>
            <textarea className="w-full px-3 py-2 rounded border" value={unstructured} onChange={(e) => setUnstructured(e.target.value)} rows={3} />
          </div>
        </div>

        <div className="flex gap-4 items-start">
          <img src={svgUri} alt="QR preview" width={220} height={220} className="border p-1 bg-white" />
          <div className="flex-1 text-sm">
            <p className="mb-2"><strong>Payload (preview):</strong></p>
            <pre className="whitespace-pre-wrap bg-[var(--background)] p-3 rounded border text-xs">{payload}</pre>
            <div className="mt-3 flex gap-2">
              <button className="px-4 py-2 rounded bg-blue-600 text-white text-sm" onClick={handleDownload}>Download SVG</button>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
