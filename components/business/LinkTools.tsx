// WhatsApp links, campaign URLs, and downloadable contact cards | TypeScript
"use client";
import { useState } from "react";
import QRCode from "qrcode";
import { Workspace, Field, Result, Notice } from "./ToolUI";
import { downloadText, httpUrl } from "@/lib/browser-files";

function QRExport({ value }: { value: string }) {
  const [error, setError] = useState("");
  return <><button className="btn btn-secondary" disabled={!value} onClick={async () => { try { downloadText(await QRCode.toString(value, { type: "svg", errorCorrectionLevel: "M", margin: 4 }), "qr-code.svg", "image/svg+xml"); setError(""); } catch { setError("This content is too long for a QR code. Shorten it and try again."); } }}>Download QR (SVG)</button><Notice>{error}</Notice></>;
}
export function WhatsAppLink() {
  const [phone, setPhone] = useState(""); const [message, setMessage] = useState("Hello! I would like to know more about your services.");
  const digits = phone.replace(/[\s()+-]/g, ""); const valid = /^[1-9]\d{6,14}$/.test(digits);
  const url = valid ? `https://wa.me/${digits}?text=${encodeURIComponent(message)}` : "";
  return <Workspace slug="whatsapp-link" help="Include your country code, for example +91 followed by your number. The tool checks number format, not whether a WhatsApp account exists. Scan-test the QR before printing. Opening the generated link uses WhatsApp."><div className="grid md:grid-cols-2 gap-5"><Field label="Phone number with country code" value={phone} onChange={setPhone} type="tel" placeholder="+91 98765 43210" /><Field label="Pre-filled message" value={message} onChange={setMessage} multiline /></div>{phone && !valid && <Notice>Enter 7–15 digits including the country code, without a leading zero.</Notice>}<Result text={url} filename="whatsapp-link.txt" label="Your WhatsApp link" /><QRExport value={url} /></Workspace>;
}
export function UTMBuilder() {
  const [url, setUrl] = useState(""); const [source, setSource] = useState(""); const [medium, setMedium] = useState(""); const [campaign, setCampaign] = useState(""); const [content, setContent] = useState(""); const [term, setTerm] = useState(""); const [saved, setSaved] = useState<string[]>([]);
  let output = "";
  if (httpUrl(url) && source.trim() && medium.trim() && campaign.trim()) { const next = new URL(url); for (const [key, value] of Object.entries({ utm_source: source, utm_medium: medium, utm_campaign: campaign, utm_content: content, utm_term: term })) { if (value.trim()) next.searchParams.set(key, value.trim()); else next.searchParams.delete(key); } output = next.toString(); }
  return <Workspace slug="utm-builder" help="Use consistent lower-case campaign names. Existing non-UTM query parameters and the URL fragment are preserved. The campaign list stays in memory until you leave this page."><Field label="Destination URL (https://...)" value={url} onChange={setUrl} type="url" /><div className="grid sm:grid-cols-2 gap-5"><Field label="Source (required)" value={source} onChange={setSource} placeholder="linkedin" /><Field label="Medium (required)" value={medium} onChange={setMedium} placeholder="social" /><Field label="Campaign (required)" value={campaign} onChange={setCampaign} placeholder="september-launch" /><Field label="Content (optional)" value={content} onChange={setContent} placeholder="demo-video" /><Field label="Term (optional)" value={term} onChange={setTerm} /></div><Result text={output} filename="campaign-url.txt" /><div className="flex flex-wrap gap-3"><button className="btn btn-secondary" disabled={!output || saved.includes(output)} onClick={() => setSaved([...saved, output])}>Add to campaign list</button><button className="btn btn-secondary" disabled={!saved.length} onClick={() => downloadText('url\r\n' + saved.map(s => '"' + s.replaceAll('"', '""') + '"').join('\r\n'), "campaign-links.csv", "text/csv;charset=utf-8")}>Download {saved.length} links as CSV</button><button className="btn btn-secondary" disabled={!saved.length} onClick={() => setSaved([])}>Clear list</button></div>{!output && <Notice>Enter an HTTP(S) destination, source, medium, and campaign to generate your link.</Notice>}</Workspace>;
}
export function ContactCard() {
  const [name, setName] = useState(""); const [company, setCompany] = useState(""); const [phone, setPhone] = useState(""); const [email, setEmail] = useState(""); const [website, setWebsite] = useState("");
  const escape = (s: string) => s.replace(/\\/g, "\\\\").replace(/\r?\n/g, "\\n").replace(/;/g,"\\;").replace(/,/g,"\\,");
  const card = name.trim() && (!website || httpUrl(website)) ? ["BEGIN:VCARD", "VERSION:3.0", `N:;${escape(name)};;;`, `FN:${escape(name)}`, `ORG:${escape(company)}`, `TEL;TYPE=WORK:${escape(phone)}`, `EMAIL:${escape(email)}`, ...(website ? [`URL:${httpUrl(website)}`] : []), "END:VCARD"].join("\r\n") : "";
  return <Workspace slug="contact-card" help="Download the .vcf file to import into an address book, or print the QR on a business card. Test scanning on your target phones before printing."><div className="grid sm:grid-cols-2 gap-5"><Field label="Full name (required)" value={name} onChange={setName} /><Field label="Company" value={company} onChange={setCompany} /><Field label="Phone" value={phone} onChange={setPhone} type="tel" /><Field label="Email" value={email} onChange={setEmail} type="email" /><Field label="Website (https://...)" value={website} onChange={setWebsite} type="url" /></div>{website && !httpUrl(website) && <Notice>Enter a complete HTTP(S) website URL.</Notice>}<Result text={card} filename="contact.vcf" label="Contact card" /><QRExport value={card} /></Workspace>;
}
