// NSheth services on NYTM | TypeScript
import type { Metadata } from "next";
import Link from "next/link";
import { nshethUrl } from "@/lib/nsheth";

export const metadata: Metadata = { title: "Websites & custom tools by NSheth | NYTM", description: "Meet the studio behind NYTM. Discuss a business website, online store, booking flow, or custom automation with NSheth.", alternates: { canonical: "https://nytm.in/work-with-nsheth" } };

export default async function WorkWithNSheth({ searchParams }: { searchParams: Promise<{ service?: string; from?: string }> }) {
  const params = await searchParams;
  const service = ["websites", "ecommerce", "automation"].includes(params.service || "") ? params.service! : "websites";
  const source = /^[a-z0-9-]{1,80}$/.test(params.from || "") ? params.from! : "services";
  return <div className="max-w-5xl mx-auto px-4 py-10 sm:py-16 space-y-12">
    <section className="max-w-3xl"><p className="text-sm font-mono text-[var(--primary)] mb-4">THE PEOPLE BEHIND NYTM</p><h1 className="text-4xl sm:text-5xl font-semibold tracking-tight leading-tight">Useful tools here.<br />Thoughtful websites for your business.</h1><p className="mt-6 text-lg text-[var(--muted-foreground)] leading-relaxed">NSheth builds websites, online stores, booking experiences, and custom software. If NYTM helped with a small task, we can help think through the bigger one.</p><div className="mt-7 flex flex-wrap gap-3"><a className="btn btn-primary" href={nshethUrl(source, service)} target="_blank" rel="noopener noreferrer">Discuss your project at NSheth <span aria-hidden="true">↗</span></a><Link className="btn btn-secondary" href="/business-tools">Explore business tools</Link></div></section>
    <section className="grid md:grid-cols-3 gap-6">{[
      ["Websites", "A clear home for your business", "Explain your services, show your work, and help visitors take the next step.", "websites"],
      ["Commerce & booking", "Turn interest into action", "Product catalogues, online stores, and booking journeys built around your customers.", "ecommerce"],
      ["Tools & automation", "Make repeated work easier", "Custom dashboards, document workflows, and tools for the way your team operates.", "automation"],
    ].map(([label, title, text, id]) => <article key={id} className="border-t border-[var(--border)] py-6"><p className="text-xs uppercase tracking-wider text-[var(--primary)]">{label}</p><h2 className="text-xl font-semibold my-3">{title}</h2><p className="text-sm text-[var(--muted-foreground)] leading-relaxed mb-5">{text}</p><a className="text-sm underline underline-offset-4" href={nshethUrl(source, id)} target="_blank" rel="noopener noreferrer">Talk about {label.toLowerCase()} ↗</a></article>)}</section>
    <section className="border-y border-[var(--border)] py-8"><h2 className="text-2xl font-semibold">Try our work before we talk.</h2><p className="my-4 max-w-2xl text-[var(--muted-foreground)]">NYTM is a working NSheth project: browser utilities, reusable interfaces, downloads, and tools that solve everyday problems. Explore the tools, then visit NSheth to see more work and start a conversation.</p><Link className="underline" href="/tools">Browse the tool collection →</Link></section>
    <p className="text-sm text-[var(--muted-foreground)]">Contact opens nsheth.in. No NYTM account or email gate is required to use or download your tool results.</p>
  </div>;
}
