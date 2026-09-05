// Crawlable category collections with a complete server-rendered tool list | TypeScript
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { discoveryCategories } from "@/lib/tool-discovery";
import { toolsConfig } from "@/lib/tools-config";
import { ToolCard } from "@/components/ToolCard";
import { categoryAdvice } from "@/lib/seo-intents";
import { generateToolsListMetadata } from "@/lib/seo";
const collections = [
  ...discoveryCategories,
  {
    id: "pdf",
    name: "PDF tools",
    description:
      "Merge, split, organise, compress, and convert PDFs. Choose the tool that matches your document task.",
  },
];
export function generateStaticParams() {
  return collections.map((c) => ({ category: c.id }));
}
export const dynamicParams = false;
export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  return generateToolsListMetadata(category);
}
export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const collection = collections.find((c) => c.id === category);
  if (!collection) notFound();
  const tools = toolsConfig
    .filter((tool) =>
      category === "pdf"
        ? tool.fileTypes?.includes("pdf")
        : tool.category === category,
    )
    .sort((a, b) => a.name.localeCompare(b.name));
  const advice = categoryAdvice[category];
  const structured = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: collection.name,
        description: collection.description,
        url: `https://nytm.in/categories/${category}`,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: tools.length,
          itemListElement: tools.map((tool, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: tool.name,
            url: `https://nytm.in/tools/${tool.slug}`,
          })),
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://nytm.in/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "All tools",
            item: "https://nytm.in/tools",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: collection.name,
            item: `https://nytm.in/categories/${category}`,
          },
        ],
      },
    ],
  };
  return (
    <div className="discovery-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structured).replace(/</g, "\\u003c"),
        }}
      />
      <Link className="btn btn-secondary" href="/tools">
        ← All tools
      </Link>
      <header className="library-header">
        <div>
          <p className="eyebrow">{tools.length} FREE TOOLS · NO SIGNUP</p>
          <h1>{collection.name}</h1>
          <p>{collection.description}</p>
        </div>
        <Link
          className="btn btn-primary"
          href={
            category === "pdf"
              ? "/tools?file=pdf"
              : `/tools?category=${category}`
          }
        >
          Search this collection →
        </Link>
      </header>
      <section className="category-advice">
        <h2>{advice.heading}</h2>
        <p>{advice.text}</p>
      </section>
      <section
        aria-label={`${collection.name} collection`}
        className="tool-grid"
      >
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </section>
      <section className="home-section">
        <div className="section-heading">
          <h2>Explore another category</h2>
          <Link className="btn btn-secondary" href="/business-tools">
            Business tools →
          </Link>
        </div>
        <nav className="action-row" aria-label="Other tool categories">
          {collections
            .filter((c) => c.id !== category)
            .map((c) => (
              <Link
                key={c.id}
                className="btn btn-secondary"
                href={`/categories/${c.id}`}
              >
                {c.name} →
              </Link>
            ))}
        </nav>
      </section>
    </div>
  );
}
