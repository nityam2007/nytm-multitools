// Local file export helpers | TypeScript
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
}
export function downloadText(text: string, filename: string, type = "text/plain;charset=utf-8") { downloadBlob(new Blob([text], { type }), filename); }
export function escapeHtml(text: string) { return text.replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!)); }
export function httpUrl(value: string) {
  try { const url = new URL(value); return ["https:", "http:"].includes(url.protocol) ? url.toString() : ""; } catch { return ""; }
}
export function printableDocument(title: string, body: string) {
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(title)}</title><style>body{font:15px/1.6 system-ui,sans-serif;color:#171717;max-width:900px;margin:40px auto;padding:24px}h1{font-size:32px;line-height:1.2}h2{font-size:20px}table{width:100%;border-collapse:collapse}td,th{border-bottom:1px solid #ddd;padding:12px;text-align:left;overflow-wrap:anywhere}p{white-space:pre-wrap;overflow-wrap:anywhere}img{max-width:100%;object-fit:contain}.grid{display:grid;grid-template-columns:1fr 1fr;gap:24px}.product{break-inside:avoid}.product img{width:100%;height:220px}.muted{color:#666} @media print{body{margin:0;padding:0}a{color:inherit}@page{margin:18mm}}</style></head><body>${body}</body></html>`;
}
export function printDocument(title: string, body: string) {
  const popup = window.open("", "_blank");
  if (!popup) throw new Error("Allow popups for NYTM to open the print preview.");
  popup.opener = null;
  popup.document.open(); popup.document.write(printableDocument(title, body)); popup.document.close();
  popup.addEventListener("load", () => popup.print(), { once: true });
}
