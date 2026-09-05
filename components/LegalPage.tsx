// Shared readable legal pages and navigation | TypeScript
import Link from "next/link";
import type { ReactNode } from "react";

export interface LegalSection {
  id: string;
  title: string;
  content: ReactNode;
}

export default function LegalPage({ title, summary, sections }: {
  title: string;
  summary: string;
  sections: LegalSection[];
}) {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16">
      <header className="mb-10">
        <p className="text-sm text-[var(--muted-foreground)] mb-3">NYTM · Legal information</p>
        <h1 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">{title}</h1>
        <p className="text-sm text-[var(--muted-foreground)]">Updated and effective: <time dateTime="2026-09-05">5 September 2026</time></p>
        <p className="text-lg leading-relaxed mt-6 max-w-3xl">{summary}</p>
        <nav aria-label="Legal pages" className="action-row mt-6">
          <Link href="/privacy" className="btn btn-secondary">Privacy &amp; data requests</Link>
          <Link href="/terms" className="btn btn-secondary">Terms &amp; precautions</Link>
          <Link href="/license" className="btn btn-secondary">Source licence</Link>
        </nav>
      </header>
      <nav aria-label="On this page" className="border-y border-[var(--border)] py-6 mb-10">
        <h2 className="font-semibold mb-4">On this page</h2>
        <ol className="grid sm:grid-cols-2 gap-x-6 gap-y-1 list-none">
          {sections.map((section, i) => (
            <li key={section.id}><a href={`#${section.id}`} className="flex items-center gap-3 min-h-11 py-2 text-sm underline underline-offset-4 hover:text-[var(--primary)]">
              <span className="text-[var(--muted-foreground)] tabular-nums">{String(i + 1).padStart(2, "0")}</span>{section.title}
            </a></li>
          ))}
        </ol>
      </nav>
      <div className="space-y-10">
        {sections.map(section => <section key={section.id} id={section.id} aria-labelledby={`${section.id}-heading`}>
          <h2 id={`${section.id}-heading`} className="text-xl sm:text-2xl font-semibold tracking-tight mb-4">{section.title}</h2>
          <div className="space-y-4 text-[var(--muted-foreground)] leading-7 [&_strong]:text-[var(--foreground)] [&_a:not(.btn)]:underline [&_a]:underline-offset-4 [&_li]:mb-2 [&_ul]:list-disc [&_ul]:pl-5 [&_ol]:list-decimal [&_ol]:pl-5 [overflow-wrap:anywhere]">{section.content}</div>
        </section>)}
      </div>
      <aside className="mt-12 border-t border-[var(--border)] pt-8">
        <h2 className="font-semibold text-xl mb-3">Contact the operator</h2>
        <p className="text-[var(--muted-foreground)] mb-5">Nityam Sheth · NYTM is an individually operated project.</p>
        <div className="action-row">
          <a href="mailto:hello@nytm.in" className="btn btn-primary">Email hello@nytm.in</a>
          <Link href="/contact" className="btn btn-secondary">All contact options</Link>
        </div>
        <p className="text-sm text-[var(--muted-foreground)] mt-4">Email buttons open your mail app. Review and send the message there.</p>
      </aside>
    </div>
  );
}
