// Shared category and workflow navigation | TypeScript
import type { ToolConfig } from "./tools-config";
export const discoveryCategories: {
  id: ToolConfig["category"];
  name: string;
  description: string;
}[] = [
  {
    id: "text",
    name: "Text & writing",
    description:
      "Count words, compare text, change case, and clean up writing.",
  },
  {
    id: "image",
    name: "Images & photos",
    description:
      "Resize, compress, crop, convert, and prepare images for the web.",
  },
  {
    id: "dev",
    name: "Developer tools",
    description: "Format JSON, test regex, decode JWTs, and tidy your code.",
  },
  {
    id: "converter",
    name: "File & data converters",
    description:
      "Convert PDFs, images, structured data, colours, and timestamps.",
  },
  {
    id: "generator",
    name: "Generators",
    description:
      "Create QR codes, passwords, UUIDs, contact cards, and sample data.",
  },
  {
    id: "security",
    name: "Security & hashes",
    description:
      "Hash files and text, check passwords, and encrypt or decrypt data.",
  },
  {
    id: "network",
    name: "Network tools",
    description:
      "Inspect IP addresses, DNS records, HTTP headers, and subnets.",
  },
  {
    id: "misc",
    name: "Everyday utilities",
    description:
      "Work with documents, calculators, timers, business plans, and CSV files.",
  },
];
export const workflows = [
  {
    id: "pdf",
    title: "Work with a PDF",
    description: "Merge, organise, compress, or convert your document.",
    href: "/tools?file=pdf",
    icon: "converter",
    slugs: ["pdf-merge", "pdf-organizer", "pdf-compress"],
  },
  {
    id: "images",
    title: "Get images ready",
    description: "Make your next upload smaller, sharper, and the right size.",
    href: "/tools?category=image",
    icon: "image",
    slugs: ["image-compress", "image-resize", "product-photos"],
  },
  {
    id: "business",
    title: "Grow your business",
    description: "Prepare a quotation, a campaign, or your next website.",
    href: "/business-tools",
    icon: "generator",
    slugs: ["quotation-maker", "whatsapp-link", "website-brief"],
  },
];
export const featuredSlugs = [
  "pdf-merge",
  "image-compress",
  "json-pretty",
  "word-counter",
  "qr-code-generator",
  "csv-cleanup",
  "product-photos",
  "password-generator",
];
