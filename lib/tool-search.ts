// Ranked, multi-word search for the browser tool registry | TypeScript
import type { ToolConfig } from "./tools-config";
const aliases: Record<string, string[]> = {
  "pdf-merge": ["combine pdf", "join pdf files"],
  "pdf-split": ["extract pdf pages", "separate pdf"],
  "pdf-organizer": [
    "reorder pdf pages",
    "rearrange pdf",
    "organise pdf",
    "organize pdf",
  ],
  "image-compress": [
    "reduce image size",
    "make photo smaller",
    "compress jpg",
    "compress png",
  ],
  "image-resize": ["resize photo", "change image dimensions"],
  "product-photos": [
    "batch resize images",
    "ecommerce product photos",
    "bulk image converter",
  ],
  "remove-bg": [
    "remove background",
    "transparent background",
    "background remover",
  ],
  "image-ocr": [
    "image to text",
    "extract text from image",
    "photo to text",
    "ocr english",
  ],
  "json-pretty": [
    "json formatter",
    "pretty print json",
    "beautify json",
    "format json",
  ],
  "csv-cleanup": [
    "remove duplicate csv rows",
    "clean spreadsheet",
    "deduplicate csv",
    "csv cleaner",
  ],
  "whatsapp-link": [
    "whatsapp link generator",
    "click to chat",
    "whatsapp qr code",
    "wa me",
  ],
  "quotation-maker": ["quote maker", "estimate builder", "business quotation"],
  "metadata-remover": [
    "remove exif",
    "remove gps photo",
    "strip image metadata",
  ],
  "utm-builder": [
    "campaign url builder",
    "utm link generator",
    "marketing tracking links",
  ],
  "contact-card": ["vcard generator", "digital business card", "vcf file"],
  "website-brief": ["website project brief", "web design questionnaire"],
  "website-checklist": ["website launch checklist", "pre launch checks"],
  "seo-preview": [
    "google search preview",
    "serp snippet",
    "meta title preview",
  ],
  "social-meta": ["open graph generator", "social share preview", "og tags"],
  "schema-generator": ["json ld generator", "structured data generator"],
  "contrast-checker": [
    "wcag contrast",
    "colour contrast",
    "color contrast",
    "accessible colours",
  ],
  "email-signature": [
    "html email signature",
    "gmail signature",
    "outlook signature",
  ],
  "catalogue-maker": ["product catalog", "catalog maker", "catalogue pdf"],
  "automation-savings": ["automation roi", "time savings calculator"],
};
export function searchKeywords(tool: ToolConfig) {
  return [
    ...new Set([...(tool.keywords || []), ...(aliases[tool.slug] || [])]),
  ];
}
function normalise(text: string) {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/jpeg/g, "jpg")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}
export function rankTools(tools: ToolConfig[], query: string) {
  const phrase = normalise(query);
  if (!phrase) return [...tools];
  const words = phrase
    .split(" ")
    .filter(
      (word) =>
        !["a", "an", "the", "online", "free", "tool", "tools"].includes(word),
    );
  const terms = words.length ? words : phrase.split(" ");
  return tools
    .map((tool) => {
      const name = normalise(tool.name),
        keywords = normalise(searchKeywords(tool).join(" "));
      const haystack = `${name} ${normalise(tool.slug)} ${keywords} ${normalise(tool.description)}`;
      if (!terms.every((term) => haystack.includes(term)))
        return { tool, score: 0 };
      return {
        tool,
        score:
          1 +
          (name === phrase ? 100 : 0) +
          (name.includes(phrase) ? 40 : 0) +
          (keywords.includes(phrase) ? 30 : 0) +
          terms.filter((term) => name.includes(term)).length * 5,
      };
    })
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score || a.tool.name.localeCompare(b.tool.name))
    .map(({ tool }) => tool);
}
