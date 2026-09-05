// Email signature HTML generator with sandboxed preview | TypeScript
"use client";
import { useState } from "react";
import { Workspace, Field, Result, Notice } from "./ToolUI";
import { escapeHtml as h, httpUrl } from "@/lib/browser-files";

export default function EmailSignature() {
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  const [company, setCompany] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");
  const [color, setColor] = useState("#7c3aed");
  const web = httpUrl(website);
  const valid =
    !!name.trim() &&
    (!website || !!web) &&
    (!email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email));
  const html = valid
    ? `<table cellpadding="0" cellspacing="0" role="presentation" style="font-family:Arial,sans-serif;font-size:14px;color:#222"><tr><td style="border-left:3px solid ${color};padding:4px 0 4px 16px"><strong style="font-size:18px;color:${color}">${h(name)}</strong><br>${h([role, company].filter(Boolean).join(" | "))}${phone ? `<br><a style="color:#333" href="tel:${h(phone.replace(/[^\d+]/g, ""))}">${h(phone)}</a>` : ""}${email ? `<br><a style="color:#333" href="mailto:${h(email)}">${h(email)}</a>` : ""}${web ? `<br><a style="color:${color}" href="${h(web)}">${h(web)}</a>` : ""}</td></tr></table>`
    : "";
  return (
    <Workspace
      slug="email-signature"
      help="Copy the HTML into an editor that accepts HTML signatures. For Gmail or Outlook, copy the rendered signature from the preview and paste into signature settings. Formatting varies by email client; send yourself a test email."
    >
      <div className="grid sm:grid-cols-2 gap-5">
        <Field label="Full name (required)" value={name} onChange={setName} />
        <Field label="Job title" value={role} onChange={setRole} />
        <Field label="Company" value={company} onChange={setCompany} />
        <Field label="Phone" value={phone} onChange={setPhone} type="tel" />
        <Field label="Email" value={email} onChange={setEmail} type="email" />
        <Field
          label="Website (https://...)"
          value={website}
          onChange={setWebsite}
          type="url"
        />
        <Field
          label="Accent colour"
          value={color}
          onChange={setColor}
          type="color"
        />
      </div>
      {!valid && (
        <Notice>
          Enter your name and valid optional email and website details.
        </Notice>
      )}
      <section>
        <h2 className="text-lg font-semibold mb-3">Signature preview</h2>
        <iframe
          title="Email signature preview"
          sandbox=""
          srcDoc={`<!doctype html><html><body style="padding:20px">${html}</body></html>`}
          className="w-full h-56 rounded-lg border border-[var(--border)] bg-white"
        />
      </section>
      <Result
        text={html}
        filename="email-signature.html"
        label="Signature HTML"
      />
    </Workspace>
  );
}
