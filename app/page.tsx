// Task-first homepage for everyday browser tools | TypeScript
import Link from "next/link";
import { toolsConfig } from "@/lib/tools-config";
import { TOTAL_TOOLS, SITE_TITLE, SITE_DESCRIPTION, SOCIAL_TITLE } from "@/lib/site-config";
import { HomeSearch } from "@/components/HomeSearch";
import { RecentTools } from "@/components/RecentTools";
import { HomeToolPicker } from "@/components/ToolCard";
import { discoveryCategories } from "@/lib/tool-discovery";
import { guides } from "@/lib/guides";
import {
  categoryIconMap,
  CircleIcon,
  CheckIcon,
  ArrowRightIcon,
  ArrowUpRightIcon,
  StarIcon,
} from "@/assets/icons";
import { generateCollectionMetadata } from "@/lib/seo";

export const metadata = generateCollectionMetadata({
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  socialTitle: SOCIAL_TITLE,
  path: "/",
  keywords: [
    "free online tools",
    "pdf tools",
    "image compressor",
    "json formatter",
    "csv cleaner",
    "whatsapp link generator",
    "business tools",
  ],
});

export default function Home() {
  return (
    <div className="discovery-page home-page">
      <section className="homepage-hero" aria-labelledby="homepage-title">
        <p className="homepage-eyebrow">{TOTAL_TOOLS} free online tools</p>
        <h1 id="homepage-title">Small tasks. <span>Sorted.</span></h1>
        <p className="homepage-intro">
          Merge PDFs, resize images, format code, and get on with your day.
        </p>
        <HomeSearch />
        <ul className="homepage-benefits" aria-label="Using NYTM">
          {["Free to use", "No signup", "No installation"].map((benefit) => (
            <li key={benefit}>
              <span aria-hidden="true"><CheckIcon className="w-4 h-4" /></span>
              {benefit}
            </li>
          ))}
        </ul>
      </section>
      <RecentTools />
      <section className="homepage-section homepage-shortcuts" id="workflows" aria-labelledby="featured">
        <div className="homepage-section-heading">
          <div>
            <h2 id="featured">What do you need to do?</h2>
            <p>Pick a tool. Get straight to work.</p>
          </div>
          <Link className="homepage-text-link homepage-pinned-link" href="/tools?scope=pinned">
            <StarIcon className="w-4 h-4" /> Your pinned tools
          </Link>
        </div>
        <HomeToolPicker />
      </section>
      <section className="homepage-section homepage-categories" id="categories" aria-labelledby="categories-heading">
        <div className="homepage-section-heading">
          <div>
            <h2 id="categories-heading">There’s more in the toolbox.</h2>
            <p>Explore all {TOTAL_TOOLS} tools by category.</p>
          </div>
          <Link className="homepage-text-link" href="/tools">
            Browse all tools <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
        <div className="homepage-category-grid">
          {discoveryCategories.map((category) => {
            const Icon = categoryIconMap[category.id] || CircleIcon;
            const count = toolsConfig.filter((tool) => tool.category === category.id).length;
            return (
              <Link className="homepage-category" key={category.id} href={`/categories/${category.id}`}>
                <span className="homepage-category-icon" aria-hidden="true"><Icon className="w-5 h-5" /></span>
                <span className="homepage-category-copy">
                  <strong>{category.name}</strong>
                  <small>{count} tools</small>
                </span>
                <ArrowRightIcon className="homepage-category-arrow w-4 h-4" />
              </Link>
            );
          })}
        </div>
      </section>
      <section className="homepage-business" aria-labelledby="business-heading">
        <div className="homepage-business-tools">
          <p className="homepage-eyebrow">For your business, too</p>
          <h2 id="business-heading">Less admin.<br />More time for your business.</h2>
          <p>Create a quotation, prepare product photos, or make it easier for customers to reach you.</p>
          <Link href="/business-tools" className="homepage-text-link">
            Explore free business tools <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
        <div className="homepage-maker">
          <p className="homepage-maker-label">Built by NSheth</p>
          <h3>Need something made for you?</h3>
          <p>Websites, online stores, and custom tools built around the way you work.</p>
          <Link href="/work-with-nsheth?from=homepage" className="btn btn-primary">
            Work with NSheth <ArrowUpRightIcon className="w-4 h-4" />
          </Link>
          <Link href="/tools/website-brief" className="homepage-text-link">
            Or start with a free website brief <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </section>
      <section className="homepage-guides" aria-labelledby="guides-heading">
        <div className="homepage-section-heading">
          <h2 id="guides-heading">A little help along the way.</h2>
          <Link href="/guides" className="homepage-text-link">All guides <ArrowRightIcon className="w-4 h-4" /></Link>
        </div>
        <div className="homepage-guide-links">
          {guides.slice(0, 2).map((guide) => (
            <Link key={guide.slug} href={`/guides/${guide.slug}`}>
              <span>{guide.title}</span>
              <ArrowUpRightIcon className="w-5 h-5" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
