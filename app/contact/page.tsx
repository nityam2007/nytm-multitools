// Direct contact routes without a simulated message submission | TypeScript
import Link from "next/link";
import { generatePageMetadata } from "@/lib/seo";

export const metadata = generatePageMetadata("contact");
const contacts = [
  { title: "Questions & feedback", text: "Ask about a tool, suggest an improvement or report a problem. Use a non-sensitive example.", subject: "NYTM enquiry", label: "Email a question" },
  { title: "Privacy & data requests", text: "Request information, correction or deletion, or raise a privacy grievance with Nityam Sheth.", subject: "NYTM privacy request", label: "Email a privacy request" },
  { title: "Security reports", text: "Describe the affected page and a safe way to reproduce the issue. Do not include passwords or other people's data.", subject: "NYTM private security report", label: "Report a security issue" },
  { title: "Licensing & payment help", text: "Ask about source reuse or a donation problem. For payments include only the date and transaction reference.", subject: "NYTM licensing or payment enquiry", label: "Email for help" },
];

export default function ContactPage() {
  return <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
    <header className="max-w-3xl mb-10">
      <p className="text-sm text-[var(--muted-foreground)] mb-3">Contact NYTM</p>
      <h1 className="text-4xl sm:text-5xl font-bold tracking-tight mb-5">Talk to the person behind the tools.</h1>
      <p className="text-lg leading-relaxed text-[var(--muted-foreground)]">NYTM is operated by Nityam Sheth. Email <a href="mailto:hello@nytm.in" className="underline underline-offset-4">hello@nytm.in</a>, or <a href="mailto:hello@nsheth.in" className="underline underline-offset-4">hello@nsheth.in</a> if needed.</p>
      <p className="mt-4 text-sm text-[var(--muted-foreground)]">The buttons below open your email app with a subject. Write, review and send your message there. If no app opens, copy the address into your email service. This page does not submit a web form.</p>
    </header>
    <div className="grid sm:grid-cols-2 gap-5">
      {contacts.map(item => <section className="guide-card" key={item.title}>
        <h2 className="font-semibold mb-3">{item.title}</h2>
        <p className="text-[var(--muted-foreground)] leading-7 mb-6">{item.text}</p>
        <a className="btn btn-primary" href={`mailto:hello@nytm.in?subject=${encodeURIComponent(item.subject)}`}>{item.label}</a>
      </section>)}
    </div>
    <section className="mt-10 border-t border-[var(--border)] pt-8">
      <h2 className="text-2xl font-semibold mb-3">Build something for your business</h2>
      <p className="text-[var(--muted-foreground)] leading-7 mb-5">Need a website, custom workflow or automation? See the services offered by NSheth and start a separate project enquiry.</p>
      <div className="action-row"><Link href="/work-with-nsheth" className="btn btn-primary">Explore NSheth services</Link><Link href="/privacy#requests" className="btn btn-secondary">Privacy request process</Link></div>
    </section>
    <section className="mt-10 border-t border-[var(--border)] pt-8">
      <h2 className="text-xl font-semibold mb-3">Public bug reports &amp; suggestions</h2>
      <p className="text-[var(--muted-foreground)] mb-5">GitHub issues and discussions are public. Keep private data and security vulnerabilities in email.</p>
      <div className="action-row"><a href="https://github.com/nityam2007/nytm-multitools/issues" className="btn btn-secondary">Open GitHub issues</a><a href="https://github.com/nityam2007/nytm-multitools/discussions" className="btn btn-secondary">Open discussions</a></div>
    </section>
  </div>;
}
