// Business workflow guide index | TypeScript
import Link from "next/link";
import type { Metadata } from "next";
import { guides } from "@/lib/guides";
export const metadata: Metadata = {
  title: "Practical business tool guides | NYTM",
  description:
    "Step-by-step guides for product photos, WhatsApp enquiries, CSV cleanup, and website planning.",
  alternates: { canonical: "https://nytm.in/guides" },
};
export default function Guides() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <p className="text-xs font-mono text-[var(--primary)] uppercase tracking-wider">
        FROM TASK TO RESULT
      </p>
      <h1 className="text-4xl font-semibold tracking-tight mt-4">
        A useful place to start.
      </h1>
      <p className="text-lg text-[var(--muted-foreground)] mt-4 mb-10">
        Practical guides to getting good results from your tools.
      </p>
      <div className="grid md:grid-cols-2 gap-8">
        {guides.map((guide) => (
          <article
            key={guide.slug}
            className="border-t border-[var(--border)] pt-6"
          >
            <h2 className="text-2xl font-semibold">
              <Link href={`/guides/${guide.slug}`}>{guide.title}</Link>
            </h2>
            <p className="text-sm leading-relaxed text-[var(--muted-foreground)] my-4">
              {guide.description}
            </p>
            <Link
              className="underline underline-offset-4 text-sm"
              href={`/guides/${guide.slug}`}
            >
              Read the guide →
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
