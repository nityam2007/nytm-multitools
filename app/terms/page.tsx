// Hosted service terms, output rights and practical precautions | TypeScript
import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo";
import LegalPage, { type LegalSection } from "@/components/LegalPage";

export const metadata = generatePageMetadata("terms");
const sections: LegalSection[] = [
  { id: "service", title: "The service and its operator", content: <>
    <p>NYTM MULTITOOLS at nytm.in is a collection of free utilities operated by Nityam Sheth as an individual. NYTM is a project name, not a separate incorporated entity. These terms govern use of the hosted service. Please read them before using it; if you do not agree, do not use the service.</p>
    <p>The service is intended for adults aged 18 or over. Tools may change, be unavailable or be discontinued. There is no uptime or ongoing support guarantee. We may restrict access reasonably to address misuse, security risks or legal requirements.</p>
  </> },
  { id: "permissions", title: "Personal use, business use and ownership", content: <>
    <p>You may use the official hosted tools for lawful personal, educational and commercial work, including work for clients. You keep your existing rights in your inputs. NYTM does not claim ownership of your outputs merely because you used a tool; third-party rights may still apply.</p>
    <p>The original source code and design are governed by NSAL v1.1. Publicly viewable code is not unrestricted open source. Evaluation and contribution permissions are described in the licence; rehosting, redistribution, product reuse and rebranding generally require separate written permission. Ordinary output use does not require a source-code licence or NYTM attribution, except where third-party terms require it.</p>
    <Link href="/license" className="btn btn-secondary">Read source-code permissions</Link>
  </> },
  { id: "conduct", title: "Responsible and authorised use", content: <>
    <ul>
      <li>Use only files, text, images, URLs and personal data that you are authorised to process. Respect copyright, confidentiality, privacy and applicable laws.</li>
      <li>Do not use the tools for fraud, impersonation, unlawful surveillance, spam, unauthorised access or interference with a service.</li>
      <li>Network tools and password/PDF utilities do not authorise you to bypass another person&apos;s restrictions. Query or unlock only resources you have permission to access.</li>
      <li>Do not overload the website or intentionally submit malicious content to attack it. Ordinary search indexing and reasonable authorised testing are not a general grant of permission for intrusive testing.</li>
      <li>Send security reports privately. Do not publish another person&apos;s data, secrets or an exploitable vulnerability in a public issue.</li>
    </ul>
  </> },
  { id: "precautions", title: "Before you rely on a result", content: <>
    <ul>
      <li><strong>Preserve originals:</strong> work on copies and verify downloads before deleting source files. Conversion, compression and editing can change quality, formatting, accessibility, forms or digital signatures.</li>
      <li><strong>Check extracted and generated content:</strong> OCR, AI, calculations and document generators can make mistakes. Review names, totals, dates, links, quoted prices and exported data before publishing or sending them.</li>
      <li><strong>Protect secrets:</strong> avoid credentials, identity documents, medical records and confidential client material where the processing described in our privacy notice is unsuitable. Metadata removal does not guarantee anonymity or remove identifying details visible in an image.</li>
      <li><strong>Verify security:</strong> encoding is not encryption; PDF restrictions are not a complete access-control system. Keep strong passwords securely and independently assess security-sensitive outputs.</li>
      <li><strong>Review spreadsheet exports:</strong> untrusted CSV cells can be interpreted as formulas by spreadsheet apps. Use available formula-protection options and inspect exports before opening or sharing.</li>
      <li><strong>Use professional judgement:</strong> tools, guides, calculators, quotes and generated templates are general utilities, not legal, tax, medical, financial or other professional advice. They do not certify statutory invoices, accessibility, SEO results or DPDP compliance.</li>
    </ul>
  </> },
  { id: "privacy", title: "Privacy and external services", content: <>
    <p>Local processing is not a promise of zero collection. Analytics, some usage requests and network tools transmit information as described in our Privacy Policy. Accepting these terms is not consent to optional personal-data processing and does not waive your statutory rights.</p>
    <p>External services and websites have their own terms. Review them before sending data or making a payment. Links to NSheth offer a way to enquire about separate services; NYTM does not guarantee a project, quotation or business outcome. Paid client work requires a separate agreement.</p>
    <Link href="/privacy" className="btn btn-secondary">Review data flows and privacy rights</Link>
  </> },
  { id: "support", title: "Donations and payment problems", content: <>
    <p>Donations are voluntary support, not the purchase of a subscription, priority support or additional tool access. Review the amount, currency and recipient on the external payment page. NYTM does not promise charitable status or tax deductibility.</p>
    <p>Contact hello@nytm.in about mistaken, duplicate or unauthorised payments with the date and transaction reference, never full card details or an OTP. Refund requests are reviewed individually with the payment provider. Refunds are not automatic; any statutory refund or dispute rights remain available.</p>
  </> },
  { id: "liability", title: "Availability, warranties and liability", content: <>
    <p>To the extent permitted by law, tools are provided “as is” and “as available”, without guarantees of accuracy, fitness for your purpose, uninterrupted availability or non-infringement. Independently verify results appropriate to your use.</p>
    <p>To the extent permitted by law, Nityam Sheth and contributors exclude liability for indirect or consequential loss, and aggregate liability arising under these service terms is limited to USD 100 or its local currency equivalent.</p>
    <p><strong>These limits do not apply to fraud, wilful misconduct, gross negligence or any liability that cannot lawfully be limited.</strong> Nothing here removes mandatory consumer or data-protection rights, limits a regulator&apos;s powers or statutory penalties, or exempts us from duties relating to service providers. The project name does not shield the individual operator from legal responsibility.</p>
  </> },
  { id: "law", title: "Law, changes and complaints", content: <>
    <p>Indian law governs these terms, subject to mandatory protections that apply to you. Disputes may be taken to a court or statutory forum with lawful jurisdiction. We do not require mandatory arbitration or waive access to a consumer forum or data-protection complaint process.</p>
    <p>Material changes will be reflected in the updated date and brought to users&apos; attention where required. Changes do not retroactively remove accrued rights. If a term is unenforceable, the remaining terms apply to the extent lawful. Contact the operator about service concerns; for personal-data concerns use the privacy request or grievance buttons.</p>
    <Link href="/privacy#requests" className="btn btn-secondary">Privacy requests &amp; grievances</Link>
  </> },
];
export default function TermsPage() {
  return <LegalPage title="Terms & precautions" summary="Use NYTM's hosted tools for personal projects and client work. Keep originals, check results and understand the data flows before using sensitive information." sections={sections} />;
}
