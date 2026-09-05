// Readable tool card with separate open and pin actions | TypeScript
"use client";
import Link from "next/link";
import { useState } from "react";
import { readToolList, writeToolList, usePreference } from "@/lib/tool-history";
import { getToolBySlug, type ToolConfig } from "@/lib/tools-config";
import { featuredSlugs } from "@/lib/tool-discovery";
import { TOTAL_TOOLS } from "@/lib/site-config";
import { categoryIconMap, CircleIcon, ArrowRightIcon, ArrowUpRightIcon, StarIcon, getToolIcon } from "@/assets/icons";
const labels: Record<ToolConfig["category"], string> = {
  text: "Text",
  image: "Images",
  dev: "Developer",
  converter: "Converters",
  generator: "Generators",
  security: "Security",
  network: "Network",
  misc: "Everyday utilities",
};
export function ToolCard({ tool }: { tool: ToolConfig }) {
  const saved = usePreference("pinnedTools", "[]");
  let pinned = false;
  try {
    const parsed: unknown = JSON.parse(saved);
    pinned = Array.isArray(parsed) && parsed.includes(tool.slug);
  } catch {}
  const Icon = categoryIconMap[tool.category] || CircleIcon;
  return (
    <article className="discovery-card">
      <div className="discovery-card-head">
        <span className="discovery-card-icon" aria-hidden="true">
          <Icon className="w-5 h-5" />
        </span>
        <h3>
          <Link href={`/tools/${tool.slug}`}>{tool.name}</Link>
        </h3>
      </div>
      <p>{tool.description}</p>
      <div className="discovery-card-meta">
        <span>{labels[tool.category]}</span>
        {tool.isNew && <span className="new-label">Recently added</span>}
      </div>
      <div className="discovery-card-actions">
        <Link
          className="btn btn-secondary"
          href={`/tools/${tool.slug}`}
          aria-label={`Open ${tool.name}`}
        >
          Open tool{" "}
          <span aria-hidden="true">
            <ArrowRightIcon className="w-4 h-4" />
          </span>
        </Link>
        <button
          type="button"
          className="pin-button"
          aria-label={pinned ? `Unpin ${tool.name}` : `Pin ${tool.name}`}
          aria-pressed={pinned}
          onClick={() => {
            const current = readToolList("pinnedTools");
            writeToolList(
              "pinnedTools",
              pinned
                ? current.filter((s) => s !== tool.slug)
                : [...new Set([...current, tool.slug])],
            );
            window.dispatchEvent(new Event("pinnedToolsChanged"));
          }}
        >
          <svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill={pinned ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path
              strokeLinejoin="round"
              d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.6l6.2-.9Z"
            />
          </svg>
          {pinned ? "Pinned" : "Pin"}
        </button>
      </div>
    </article>
  );
}

const homeToolGroups = [
  { label: "Quick picks", countLabel: "quick picks", href: "/tools", linkLabel: `View all ${TOTAL_TOOLS} tools`, slugs: featuredSlugs },
  {
    label: "PDFs", countLabel: "PDF tools", href: "/tools?file=pdf", linkLabel: "View all PDF tools",
    slugs: ["pdf-merge", "pdf-compress", "pdf-split", "pdf-organizer", "pdf-rotate", "images-to-pdf", "pdf-to-images", "pdf-lock"],
  },
  {
    label: "Images", countLabel: "image tools", href: "/tools?category=image", linkLabel: "View all image tools",
    slugs: ["image-compress", "image-resize", "image-crop", "image-convert", "remove-bg", "product-photos", "metadata-remover", "image-watermark"],
  },
  {
    label: "Text", countLabel: "text tools", href: "/tools?category=text", linkLabel: "View all text tools",
    slugs: ["word-counter", "text-case", "text-diff", "remove-duplicates", "find-replace", "sort-lines", "text-trim", "lorem-ipsum"],
  },
  {
    label: "Code & data", countLabel: "code & data tools", href: "/tools?category=dev", linkLabel: "View all developer tools",
    slugs: ["json-pretty", "json-validator", "csv-cleanup", "csv-to-json", "json-to-csv", "regex-tester", "jwt-decoder", "sql-formatter"],
  },
  {
    label: "Business", countLabel: "business tools", href: "/business-tools", linkLabel: "View all business tools",
    slugs: ["quotation-maker", "whatsapp-link", "email-signature", "contact-card", "utm-builder", "website-brief", "catalogue-maker", "seo-preview"],
  },
];

const homeToolDescriptions: Record<string, string> = {
  "pdf-merge": "Combine several PDFs into one document.",
  "pdf-compress": "Try lossless compression for a smaller PDF.",
  "pdf-split": "Extract the pages you need from a PDF.",
  "pdf-organizer": "Preview, reorder, and extract PDF pages.",
  "pdf-rotate": "Turn PDF pages the right way around.",
  "images-to-pdf": "Bring your images together in a PDF.",
  "pdf-to-images": "Save PDF pages as individual images.",
  "pdf-lock": "Protect a PDF with a password.",
  "image-compress": "Make image files smaller for easy sharing.",
  "image-resize": "Set the width and height you need.",
  "image-crop": "Keep the part of your photo that matters.",
  "image-convert": "Switch between PNG, JPG, WebP, and more.",
  "remove-bg": "Remove a photo background in your browser.",
  "product-photos": "Resize and prepare a whole batch of photos.",
  "metadata-remover": "Remove hidden metadata from JPEGs and PNGs.",
  "image-watermark": "Add your name or logo to an image.",
  "word-counter": "Count words, characters, and sentences.",
  "text-case": "Switch between title case, capitals, and more.",
  "text-diff": "See what changed between two pieces of text.",
  "remove-duplicates": "Clean repeated lines out of your text.",
  "find-replace": "Find and replace words or patterns.",
  "sort-lines": "Put lines in alphabetical or numeric order.",
  "text-trim": "Tidy up unwanted spaces in your text.",
  "lorem-ipsum": "Generate placeholder text for your layout.",
  "json-pretty": "Format messy JSON so it is easy to read.",
  "json-validator": "Check JSON syntax and find errors.",
  "csv-cleanup": "Trim cells and remove duplicate CSV rows.",
  "csv-to-json": "Turn spreadsheet data into JSON.",
  "json-to-csv": "Convert JSON into spreadsheet-ready CSV.",
  "regex-tester": "Test patterns and see matching text.",
  "jwt-decoder": "Read the contents of a JWT token.",
  "sql-formatter": "Make SQL queries easier to read.",
  "qr-code-generator": "Create a QR code for a link or text.",
  "password-generator": "Generate a strong, random password.",
  "quotation-maker": "Prepare an itemised estimate for a client.",
  "whatsapp-link": "Make a chat link with a ready-to-send message.",
  "email-signature": "Build an email signature with your details.",
  "contact-card": "Share your contact details as a card or QR.",
  "utm-builder": "Add campaign tracking to your links.",
  "website-brief": "Turn your website plans into a clear brief.",
  "catalogue-maker": "Create a product catalogue with your photos.",
  "seo-preview": "Preview a page title and description in search.",
};

export function HomeToolPicker() {
  const [activeGroup, setActiveGroup] = useState(0);
  const [announcement, setAnnouncement] = useState("");
  const saved = usePreference("pinnedTools", "[]");
  let pinnedSlugs: string[] = [];
  try {
    const parsed: unknown = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      pinnedSlugs = parsed.filter((slug): slug is string => typeof slug === "string");
    }
  } catch {}
  const group = homeToolGroups[activeGroup];
  const tools = group.slugs.map(getToolBySlug).filter((tool): tool is ToolConfig => Boolean(tool));

  return (
    <div className="homepage-tool-picker">
      <div className="homepage-tool-filters" role="group" aria-label="Filter tool shortcuts">
        {homeToolGroups.map((filter, index) => (
          <button
            key={filter.label}
            type="button"
            className="homepage-tool-filter"
            aria-pressed={activeGroup === index}
            onClick={() => {
              if (index !== activeGroup) {
                setActiveGroup(index);
                setAnnouncement(`Showing ${filter.slugs.length} ${filter.countLabel}.`);
              }
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>
      <p className="sr-only" role="status">{announcement}</p>
      <div className="homepage-tool-grid">
        {tools.map((tool) => {
          const Icon = getToolIcon(tool.icon || "document-text");
          const pinned = pinnedSlugs.includes(tool.slug);
          return (
            <article className="homepage-tool-card" key={tool.slug}>
              <Link className="homepage-tool-link" href={`/tools/${tool.slug}`}>
                <span className="homepage-tool-icon" aria-hidden="true"><Icon className="w-5 h-5" /></span>
                <h3 className="homepage-tool-title">{tool.name}</h3>
                <p className="homepage-tool-description">{homeToolDescriptions[tool.slug] || tool.description}</p>
                <span className="homepage-tool-arrow" aria-hidden="true"><ArrowUpRightIcon className="w-4 h-4" /></span>
              </Link>
              <button
                type="button"
                className="homepage-tool-pin"
                aria-label={pinned ? `Unpin ${tool.name}` : `Pin ${tool.name}`}
                aria-pressed={pinned}
                title={pinned ? `Unpin ${tool.name}` : `Pin ${tool.name}`}
                onClick={() => {
                  const current = readToolList("pinnedTools");
                  writeToolList(
                    "pinnedTools",
                    current.includes(tool.slug)
                      ? current.filter((slug) => slug !== tool.slug)
                      : [...current, tool.slug],
                  );
                  window.dispatchEvent(new Event("pinnedToolsChanged"));
                }}
              >
                <span aria-hidden="true"><StarIcon className="w-4 h-4" /></span>
              </button>
            </article>
          );
        })}
      </div>
      <div className="homepage-tool-picker-footer">
        <span>{tools.length} {group.countLabel}</span>
        <Link href={group.href}>
          {group.linkLabel}
          <span aria-hidden="true"><ArrowRightIcon className="w-4 h-4" /></span>
        </Link>
      </div>
    </div>
  );
}