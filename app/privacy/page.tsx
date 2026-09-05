// Privacy notice based on deployed data flows and India's phased DPDP framework | TypeScript
import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo";
import LegalPage, { type LegalSection } from "@/components/LegalPage";

export const metadata = generatePageMetadata("privacy");

const sections: LegalSection[] = [
  { id: "operator", title: "Who this notice covers", content: <>
    <p>Nityam Sheth operates NYTM MULTITOOLS at nytm.in. This notice covers the website, its tools, usage analytics and messages sent to us. It does not replace the notices of websites you choose to visit through external links, including NSheth.</p>
    <p>You do not need an ordinary user account to use the tools. <strong>Browser-based processing does not mean that the website makes no network requests or collects no personal data.</strong></p>
  </> },
  { id: "data", title: "Data, purposes and recipients", content: <>
    <ul>
      <li><strong>Tool processing:</strong> many conversions and file operations run on your device. Some existing tools also send a usage request to our server containing input text, output text, filenames or settings, depending on the tool. The server computes input length and sends tool name, category, input type, timing and supplied metadata to PostHog. Raw input and output fields are not deliberately included in that server analytics event, but they have reached our server.</li>
      <li><strong>Usage and diagnostics:</strong> when configured, PostHog receives page URLs including query strings, referrers, device/browser details, interaction and error events, identifiers, and tool/download/referral events. Server usage events use an identifier derived from your IP address; this is not anonymous data. These records help us understand usage, troubleshoot faults and measure referrals.</li>
      <li><strong>Interaction capture:</strong> depending on which analytics configuration initializes and the project settings, autocapture or session replay may collect page content and interactions. One configuration permits recording of non-password inputs. Do not assume that text displayed or entered on the site is excluded from analytics.</li>
      <li><strong>Website delivery:</strong> Vercel and network infrastructure process connection data such as IP address, URL, user agent and request timing to deliver, secure and diagnose the service.</li>
      <li><strong>Support and business enquiries:</strong> if you email us, we receive your email address, message and any details you include, to answer that enquiry. A contact or NSheth link does not by itself subscribe you to marketing.</li>
      <li><strong>Voluntary support:</strong> an external payment provider processes payment details if you follow a donation link. We may receive transaction confirmations and donor details provided by that service for reconciliation or resolving payment issues. Do not send payment credentials to NYTM.</li>
    </ul>
  </> },
  { id: "network", title: "Tools that contact other services", content: <>
    <p>IP Lookup sends the queried IP to ipinfo.io. My IP calls ipify. DNS Lookup sends the domain and record type to Google DNS. The URL mode of HTML to Text sends the entered URL to AllOrigins. HTTP Headers sends the entered URL to our server, which contacts the destination website. Those providers or destinations can receive the relevant request and connection information.</p>
    <p>Some AI tools download models or runtime files from third-party hosts before processing locally. Model downloads expose connection data to the host; this does not by itself mean your selected file is uploaded. Self-hosted OCR and PDF assets are served from NYTM.</p>
    <p>Only query addresses you are authorised to use. Avoid personal details, credentials or private tokens in URLs, filenames and sample content.</p>
  </> },
  { id: "storage", title: "Cookies, local storage and choices", content: <>
    <p>Browser storage holds preferences such as theme, recent and pinned tools, update status, and explicitly saved checklist progress. The service worker caches website resources for performance and offline use. Clearing site data removes these local items; it does not erase records already received by our servers or providers.</p>
    <p>Configured PostHog analytics can use cookies and local storage for visitor/session identifiers. This release does not provide a site-wide analytics consent or withdrawal switch. Browser Do Not Track is respected by one initialization path but is not a guarantee that all analytics, including server usage events, stops.</p>
    <p>You can manage storage and tracking restrictions in your browser and contact us about processing or deletion. These browser controls do not replace any consent mechanism required by applicable law. <strong>This notice and acceptance of the Terms are not consent to optional analytics.</strong></p>
  </> },
  { id: "retention", title: "Retention, transfers and security", content: <>
    <p>Tool state held only in page memory is normally lost when the page is closed or reset. Downloads remain wherever you save them; browser caches and saved preferences remain until cleared or evicted. Browser session restoration may preserve some state.</p>
    <p>Hosting logs, analytics records, email and payment records have different retention settings. We have not published a verified, fixed retention period for all these systems. Contact us for information about the records relevant to you or to request deletion. Records may need to be retained for legal obligations, security investigations or resolving a dispute; we will explain an applicable reason when responding.</p>
    <p>Data may be processed outside India. The analytics proxy and server logger target PostHog&apos;s EU service; hosting, email, payment and other providers may use other locations and subprocessors. Applicable transfer restrictions still apply. We do not offer a guarantee that all processing stays in India.</p>
    <p>No website or device can guarantee absolute security. Keep your browser updated, use a trusted device, retain originals and avoid confidential or regulated material where these data flows are unsuitable. Report suspected exposure privately using the contact below.</p>
  </> },
  { id: "dpdp", title: "India: DPDP Act and phased commencement", content: <>
    <p>The Digital Personal Data Protection Act, 2023 and the final DPDP Rules, 2025 have phased commencement. As of this notice date, the core processing duties and individual-rights provisions are in the eighteen-month phase under the November 2025 notifications; consent-manager registration has a separate one-year phase. This page does not claim that every provision is already in force or that NYTM is certified compliant.</p>
    <p>When applicable, the framework provides for access to processing information, correction and erasure, consent withdrawal, grievance redressal and nomination of another individual to exercise rights after death or incapacity. Legal exceptions and commencement dates affect those rights. Contact us now about your information; you need not wait to raise a concern.</p>
    <p>Official references: <a href="https://www.meity.gov.in/static/uploads/2024/06/2bf1f0e9f04e6fb4f8fef35e82c42aa5.pdf">DPDP Act, 2023</a>, <a href="https://www.meity.gov.in/static/uploads/2025/11/c56ceae6c383460ca69577428d36828b.pdf">Act commencement notification</a>, and <a href="https://www.meity.gov.in/documents/act-and-policies/digital-personal-data-protection-rules-2025-gDOxUjMtQWa?pageTitle=Digital-Personal-Data-Protection-Rules-2025">MeitY rules, timeline and corrigendum</a>.</p>
  </> },
  { id: "requests", title: "Privacy requests and grievances", content: <>
    <p><strong>Contact: Nityam Sheth, operator and privacy contact.</strong> Email hello@nytm.in, or hello@nsheth.in if needed, with the subject “NYTM privacy request” or “NYTM privacy grievance”. This contact is not a claim of formal Data Protection Officer or Consent Manager registration.</p>
    <p>Tell us what you want reviewed and, if relevant, the tool, approximate visit date and the email address used to contact us. We may ask for proportionate information to locate a record and verify authority. Do not send Aadhaar, passwords, payment credentials or full confidential files as initial proof.</p>
    <p>We will assess and respond to requests under applicable law, explain any information needed or lawful refusal, and aim to resolve grievances within 30 days. Where applicable DPDP Rules require a published grievance period, that period will not exceed 90 days; any shorter mandatory deadline takes precedence. We cannot retrieve or delete files that exist only on your device.</p>
    <p>When the relevant provisions and complaint process apply, you may approach the Data Protection Board of India after first using our grievance process. Other available statutory remedies remain unaffected.</p>
    <div className="action-row"><a className="btn btn-primary" href="mailto:hello@nytm.in?subject=NYTM%20privacy%20request">Make a privacy request</a><a className="btn btn-secondary" href="mailto:hello@nytm.in?subject=NYTM%20privacy%20grievance">Raise a grievance</a></div>
  </> },
  { id: "children", title: "Children and other people's information", content: <>
    <p>NYTM is intended for adults aged 18 or over. We do not currently provide a verified parental-consent flow. If you are under 18, please do not submit personal information or use the service; a parent or guardian can contact us about information already provided. An age statement alone does not verify age or satisfy child-data obligations.</p>
    <p>Under the DPDP framework, children are generally people under 18; when applicable, child-data processing requires safeguards including verifiable parental consent, subject to legal exceptions. Do not enter children&apos;s records or another person&apos;s personal data unless you have appropriate authority and have assessed the processing described here.</p>
  </> },
  { id: "updates", title: "Changes and safe use", content: <>
    <p>This notice replaces the previous blanket claims that no information ever leaves your device and that NYTM uses no tracking. The update explains existing data flows; it does not make a retroactive consent request. We will revise the notice when our practices materially change and obtain consent where required.</p>
    <Link className="btn btn-secondary" href="/terms#precautions">Read tool-use precautions</Link>
  </> },
];

export default function PrivacyPage() {
  return <LegalPage title="Privacy & data requests" summary="Most tools work in your browser. Website delivery, analytics, some tool-usage requests and network utilities still send data off your device. Here is what that means and how to contact us." sections={sections} />;
}
