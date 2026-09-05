// Complete tool library page | TypeScript
import Link from "next/link";
import { Suspense } from "react";
import { ToolLibrary } from "@/components/ToolLibrary";
import { RecentTools } from "@/components/RecentTools";
import { toolsConfig } from "@/lib/tools-config";
import { discoveryCategories } from "@/lib/tool-discovery";
import { ToolCard } from "@/components/ToolCard";
export default function ToolsPage() {
  return (
    <div className="discovery-page">
      <header className="library-header">
        <div>
          <p className="eyebrow">YOUR EVERYDAY TOOLBOX</p>
          <h1>Find the right tool.</h1>
          <p>
            Explore {toolsConfig.length} free tools for PDFs, images, text,
            code, and business. Search by what you want to do, then get straight
            to work.
          </p>
        </div>
        <div className="action-row">
          <Link className="btn btn-secondary" href="/business-tools">
            Business tools →
          </Link>
          <Link className="btn btn-secondary" href="/guides">
            How-to guides →
          </Link>
        </div>
      </header>
      <Suspense
        fallback={
          <div>
            <p role="status" className="py-4">
              Loading search controls. You can open a tool below.
            </p>
            <div className="tool-grid">
              {toolsConfig.slice(0, 24).map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </div>
        }
      >
        <ToolLibrary />
      </Suspense>
      <RecentTools />
      <section className="home-section">
        <div className="section-heading">
          <h2>Explore the complete categories</h2>
        </div>
        <nav className="action-row" aria-label="Tool category pages">
          {discoveryCategories.map((category) => (
            <Link
              className="btn btn-secondary"
              key={category.id}
              href={`/categories/${category.id}`}
            >
              {category.name} →
            </Link>
          ))}
          <Link className="btn btn-secondary" href="/categories/pdf">
            PDF tools →
          </Link>
        </nav>
      </section>
    </div>
  );
}
