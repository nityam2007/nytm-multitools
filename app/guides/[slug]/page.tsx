// Static practical guide pages | TypeScript
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { guides } from "@/lib/guides";
import { getToolBySlug } from "@/lib/tools-config";
import { NShethPromotion } from "@/components/NShethPromotion";
import { generateCollectionMetadata } from "@/lib/seo";
import { SOCIAL_IMAGE } from "@/lib/site-config";
export function generateStaticParams() {
  return guides.map(({ slug }) => ({ slug }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);
  return guide
    ? generateCollectionMetadata({
        title: `${guide.title} | NYTM`,
        description: guide.description,
        path: `/guides/${slug}`,
        article: true,
        keywords: [guide.title.toLowerCase(), guide.tool.replaceAll("-", " ")],
      })
    : {};
}
export default async function Guide({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const guide = guides.find((g) => g.slug === slug);
  if (!guide) notFound();
  const tool = getToolBySlug(guide.tool)!;
  return (
    <article className="max-w-3xl mx-auto px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: guide.title,
            description: guide.description,
            mainEntityOfPage: `https://nytm.in/guides/${slug}`,
            datePublished: "2026-09-05",
            dateModified: "2026-09-05",
            author: {
              "@type": "Organization",
              name: "NYTM",
              url: "https://nytm.in",
            },
            image: SOCIAL_IMAGE.url,
          }).replace(/</g, "\\u003c"),
        }}
      />
      <Link className="btn btn-secondary" href="/guides">
        ← All guides
      </Link>
      <header className="mt-8 mb-10">
        <p className="text-xs font-mono text-[var(--primary)]">
          NYTM GUIDE · SEPTEMBER 2026
        </p>
        <h1 className="text-3xl sm:text-4xl leading-tight font-semibold tracking-tight mt-4">
          {guide.title}
        </h1>
        <p className="mt-5 text-lg text-[var(--muted-foreground)] leading-relaxed">
          {guide.description}
        </p>
        <Link className="btn btn-primary mt-6" href={`/tools/${guide.tool}`}>
          Open {tool.name} →
        </Link>
      </header>
      <div className="space-y-9">
        {guide.steps.map((step, i) => (
          <section key={step.title}>
            <h2 className="text-xl font-semibold">
              {i + 1}. {step.title}
            </h2>
            <p className="mt-3 text-[var(--muted-foreground)] leading-relaxed">
              {step.text}
            </p>
          </section>
        ))}
      </div>
      <aside className="my-10 border-y border-[var(--border)] py-6">
        <h2 className="text-lg font-semibold">A worked example</h2>
        <p className="mt-3 leading-relaxed text-[var(--muted-foreground)]">
          {guide.example}
        </p>
      </aside>
      <section>
        <h2 className="text-xl font-semibold mb-4">Continue the workflow</h2>
        <div className="flex flex-wrap gap-3">
          {guide.related.map((s) => {
            const related = getToolBySlug(s);
            return related ? (
              <Link className="btn btn-secondary" href={`/tools/${s}`} key={s}>
                {related.name}
              </Link>
            ) : null;
          })}
        </div>
      </section>
      <NShethPromotion tool={tool} />
    </article>
  );
}
