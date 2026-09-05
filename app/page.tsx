// Search-first homepage for the complete tool library | TypeScript
import Link from "next/link";
import { toolsConfig, getToolBySlug } from "@/lib/tools-config";
import { HomeSearch } from "@/components/HomeSearch";
import { RecentTools } from "@/components/RecentTools";
import { ToolCard } from "@/components/ToolCard";
import {
  discoveryCategories,
  workflows,
  featuredSlugs,
} from "@/lib/tool-discovery";
import { guides } from "@/lib/guides";
import { categoryIconMap, CircleIcon } from "@/assets/icons";
export default function Home() {
  return (
    <div className="discovery-page">
      <section className="home-hero">
        <div className="home-hero-main">
          <p className="eyebrow">
            THE EVERYDAY TOOLBOX <span>{toolsConfig.length} free tools</span>
          </p>
          <h1>
            Free online tools.
            <br />
            <span>One useful place.</span>
          </h1>
          <p className="home-intro">
            A smaller PDF. A cleaner spreadsheet. A photo ready to share. Find
            the right tool and get on with your day.
          </p>
          <HomeSearch />
          <div className="quick-starts" aria-label="Common searches">
            <span>Jump to</span>
            {[
              ["PDF tools", "/tools?file=pdf"],
              ["Image tools", "/tools?category=image"],
              ["JSON formatter", "/tools/json-pretty"],
            ].map(([name, href]) => (
              <Link key={href} href={href}>
                {name} <span aria-hidden="true">↗</span>
              </Link>
            ))}
          </div>
        </div>
        <aside className="hero-directory" aria-label="Browse the library">
          <div className="hero-directory-heading">
            <span className="eyebrow">FIND YOUR STARTING POINT</span>
            <span className="directory-count">
              {toolsConfig.length}
              <small>tools, ready when you are</small>
            </span>
          </div>
          {[
            [
              "Documents & PDFs",
              "Merge, split, organise & convert",
              "/tools?file=pdf",
            ],
            [
              "Photos & images",
              "Compress, resize & prepare",
              "/tools?category=image",
            ],
            [
              "Code & data",
              "Format, validate & clean up",
              "/tools?category=dev",
            ],
            [
              "Business essentials",
              "Plan, promote & present",
              "/business-tools",
            ],
          ].map(([title, text, href], index) => (
            <Link className="hero-directory-link" href={href} key={href}>
              <span className="directory-index">0{index + 1}</span>
              <span>
                <strong>{title}</strong>
                <small>{text}</small>
              </span>
              <span className="directory-arrow" aria-hidden="true">
                →
              </span>
            </Link>
          ))}
          <Link href="/tools" className="btn btn-secondary">
            Browse all {toolsConfig.length} tools →
          </Link>
        </aside>
      </section>
      <div className="home-facts">
        <span>No account needed</span>
        <span>Free to use</span>
        <Link href="/tools?scope=pinned">Pin your go-to tools →</Link>
        <Link href="/work-with-nsheth">Built by NSheth ↗</Link>
      </div>
      <RecentTools />
      <section className="home-section" id="workflows">
        <div className="section-heading">
          <div>
            <p className="eyebrow">START WITH YOUR TASK</p>
            <h2>What’s on your list?</h2>
          </div>
          <Link className="btn btn-secondary" href="/business-tools">
            Business tools →
          </Link>
        </div>
        <div className="workflow-grid">
          {workflows.map((flow, index) => (
            <article className="workflow-card" key={flow.id}>
              <span className="workflow-number">0{index + 1}</span>
              <h3>{flow.title}</h3>
              <p>{flow.description}</p>
              <ul>
                {flow.slugs.map((slug) => {
                  const tool = getToolBySlug(slug)!;
                  return (
                    <li key={slug}>
                      <Link href={`/tools/${slug}`}>
                        {tool.name}
                        <span aria-hidden="true">→</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
              <Link className="btn btn-secondary" href={flow.href}>
                Explore{" "}
                {flow.id === "pdf"
                  ? "PDF tools"
                  : flow.id === "images"
                    ? "image tools"
                    : "business tools"}{" "}
                →
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="home-section" id="categories">
        <div className="section-heading">
          <div>
            <p className="eyebrow">THE COMPLETE LIBRARY</p>
            <h2>Browse by category</h2>
          </div>
          <Link className="btn btn-secondary" href="/tools">
            View all tools →
          </Link>
        </div>
        <div className="category-grid">
          {discoveryCategories.map((category) => {
            const Icon = categoryIconMap[category.id] || CircleIcon;
            return (
              <Link
                key={category.id}
                className="category-tile"
                href={`/tools?category=${category.id}`}
              >
                <span className="category-tile-icon" aria-hidden="true">
                  <Icon className="w-5 h-5" />
                </span>
                <span>
                  <strong>{category.name}</strong>
                  <small>
                    {
                      toolsConfig.filter(
                        (tool) => tool.category === category.id,
                      ).length
                    }{" "}
                    tools
                  </small>
                </span>
                <span aria-hidden="true">→</span>
              </Link>
            );
          })}
        </div>
      </section>
      <section className="home-section" id="featured">
        <div className="section-heading">
          <div>
            <p className="eyebrow">GOOD PLACES TO BEGIN</p>
            <h2>Everyday favourites</h2>
            <p>A few useful picks from across the collection.</p>
          </div>
          <Link href="/tools?scope=new" className="btn btn-secondary">
            Recently added tools →
          </Link>
        </div>
        <div className="tool-grid">
          {featuredSlugs.map((slug) => (
            <ToolCard tool={getToolBySlug(slug)!} key={slug} />
          ))}
        </div>
      </section>
      <section className="home-section">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A LITTLE GUIDANCE</p>
            <h2>From first step to finished task</h2>
          </div>
          <Link href="/guides" className="btn btn-secondary">
            View all guides →
          </Link>
        </div>
        <div className="grid md:grid-cols-2 gap-5">
          {guides.slice(0, 2).map((guide) => (
            <article className="guide-card" key={guide.slug}>
              <h3 className="text-xl font-semibold">{guide.title}</h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed mt-3 mb-5">
                {guide.description}
              </p>
              <Link
                className="btn btn-secondary"
                href={`/guides/${guide.slug}`}
              >
                Read the guide →
              </Link>
            </article>
          ))}
        </div>
      </section>
      <section className="home-nsheth">
        <div>
          <p className="eyebrow">MADE BY NSHETH</p>
          <h2>Need something built for your business?</h2>
          <p>
            Websites, online stores, and custom tools—built around the way you
            work.
          </p>
        </div>
        <div className="action-row">
          <Link
            href="/work-with-nsheth?from=homepage"
            className="btn btn-primary"
          >
            Explore NSheth services →
          </Link>
          <Link href="/tools/website-brief" className="btn btn-secondary">
            Create a website brief
          </Link>
        </div>
      </section>
    </div>
  );
}
