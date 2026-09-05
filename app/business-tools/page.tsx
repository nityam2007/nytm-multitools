// Business tool collection | TypeScript
import type { Metadata } from "next";
import Link from "next/link";
import { toolsConfig } from "@/lib/tools-config";
import { ToolCard } from "@/components/ToolCard";

export const metadata: Metadata = {
  title: "Free business tools | NYTM",
  description:
    "Prepare product images, clean spreadsheets, create campaign links, and plan your website with free browser-based business tools.",
  alternates: { canonical: "https://nytm.in/business-tools" },
};
export default function BusinessTools() {
  const collections = [
    {
      title: "Launch & promote",
      description: "Prepare your business for its next customer.",
      slugs: [
        "whatsapp-link",
        "website-brief",
        "website-checklist",
        "utm-builder",
        "seo-preview",
        "social-meta",
        "schema-generator",
        "email-signature",
        "contact-card",
        "qr-code-generator",
      ],
    },
    {
      title: "Sell & present",
      description: "Turn products and ideas into something ready to share.",
      slugs: [
        "quotation-maker",
        "product-photos",
        "catalogue-maker",
        "image-compress",
        "image-resize",
        "pricing-calculator",
      ],
    },
    {
      title: "Simplify the work",
      description: "Make recurring document and data tasks easier.",
      slugs: [
        "csv-cleanup",
        "automation-savings",
        "pdf-organizer",
        "image-ocr",
        "metadata-remover",
        "contrast-checker",
        "csv-chart-builder",
        "break-even-calculator",
      ],
    },
  ];
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-12">
      <header>
        <p className="text-xs font-mono uppercase tracking-wider text-[var(--primary)] mb-4">
          NYTM FOR BUSINESS
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Small tools. Useful progress.
        </h1>
        <p className="text-lg text-[var(--muted-foreground)] mt-4 max-w-2xl">
          Prepare a launch, organise your products, or finish the admin. Start
          with the task in front of you.
        </p>
        <Link
          href="/work-with-nsheth"
          className="btn btn-primary mt-5 mr-3"
        >
          Need a website or custom automation? Meet NSheth →
        </Link>
        <Link
          href="/guides"
          className="btn btn-secondary mt-3"
        >
          Read practical workflow guides →
        </Link>
      </header>
      {collections.map((group) => (
        <section key={group.title}>
          <h2 className="text-2xl font-semibold">{group.title}</h2>
          <p className="text-sm text-[var(--muted-foreground)] mt-2 mb-5">
            {group.description}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {group.slugs
              .map((slug) => toolsConfig.find((t) => t.slug === slug))
              .filter((t) => t !== undefined)
              .map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
          </div>
        </section>
      ))}
    </div>
  );
}
