// Business and workflow tool registry | TypeScript
import type { ToolConfig } from "./tools-config";

export const businessTools: ToolConfig[] = [
  {
    slug: "whatsapp-link",
    name: "WhatsApp Link & QR Builder",
    description: "Create a WhatsApp chat link with a pre-filled message and downloadable QR code.",
    category: "generator",
    icon: "document-text",
    inputType: "text",
    keywords: [
      "whatsapp",
      "business",
      "qr",
      "contact"
    ],
    isNew: true
  },
  {
    slug: "utm-builder",
    name: "UTM Campaign Link Builder",
    description: "Build campaign URLs, preserve existing parameters, and export a list as CSV.",
    category: "generator",
    icon: "document-text",
    inputType: "text",
    keywords: [
      "utm",
      "campaign",
      "marketing",
      "url"
    ],
    isNew: true
  },
  {
    slug: "contact-card",
    name: "Digital Contact Card",
    description: "Create a vCard contact file and QR code for your business card.",
    category: "generator",
    icon: "document-text",
    inputType: "text",
    keywords: [
      "vcard",
      "contact",
      "business",
      "qr"
    ],
    isNew: true
  },
  {
    slug: "website-brief",
    name: "Website Project Brief Builder",
    description: "Plan your website goals, pages, features, and timeline in a downloadable brief.",
    category: "misc",
    icon: "document-text",
    inputType: "text",
    keywords: [
      "website",
      "brief",
      "business",
      "planning"
    ],
    isNew: true
  },
  {
    slug: "website-checklist",
    name: "Website Launch Checklist",
    description: "Work through a practical launch checklist with optional local progress saving.",
    category: "misc",
    icon: "document-text",
    inputType: "text",
    keywords: [
      "website",
      "launch",
      "checklist",
      "business"
    ],
    isNew: true
  },
  {
    slug: "automation-savings",
    name: "Automation Savings Calculator",
    description: "Estimate hours saved, recurring value, and setup payback from your own assumptions.",
    category: "misc",
    icon: "document-text",
    inputType: "text",
    keywords: [
      "automation",
      "savings",
      "business",
      "time"
    ],
    isNew: true
  },
  {
    slug: "quotation-maker",
    name: "Quotation & Estimate Maker",
    description: "Create itemised business estimates with discounts, tax, and print-to-PDF export.",
    category: "misc",
    icon: "document-text",
    inputType: "text",
    keywords: [
      "quotation",
      "estimate",
      "pdf",
      "business"
    ],
    isNew: true
  },
  {
    slug: "email-signature",
    name: "Email Signature Generator",
    description: "Build and preview a professional email signature with downloadable HTML.",
    category: "generator",
    icon: "document-text",
    inputType: "text",
    keywords: [
      "email",
      "signature",
      "business",
      "html"
    ],
    isNew: true
  },

  {
    slug: "seo-preview",
    name: "SEO Title & Description Preview",
    description: "Preview search snippets and generate title, description, and canonical tags.",
    category: "generator",
    icon: "document-text",
    inputType: "text",
    keywords: [
      "seo",
      "preview",
      "business"
    ],
    isNew: true
  },
  {
    slug: "social-meta",
    name: "Social Sharing Preview & Meta Tags",
    description: "Prepare Open Graph and social card metadata without fetching a website.",
    category: "generator",
    icon: "document-text",
    inputType: "text",
    keywords: [
      "social",
      "meta",
      "business"
    ],
    isNew: true
  },
  {
    slug: "schema-generator",
    name: "Structured Data Generator",
    description: "Create Organization, LocalBusiness, or Product JSON-LD from your details.",
    category: "generator",
    icon: "document-text",
    inputType: "text",
    keywords: [
      "schema",
      "generator",
      "business"
    ],
    isNew: true
  },
  {
    slug: "contrast-checker",
    name: "Colour Contrast Checker",
    description: "Check WCAG contrast ratios for opaque text and background colours.",
    category: "dev",
    icon: "document-text",
    inputType: "text",
    keywords: [
      "contrast",
      "checker",
      "business"
    ],
    isNew: true
  },
  {
    slug: "csv-cleanup",
    name: "CSV Cleanup Workbench",
    description: "Clean duplicate rows, trim cells, rename columns, and export CSV in your browser.",
    category: "converter",
    icon: "document-text",
    inputType: "text",
    keywords: [
      "csv",
      "cleanup",
      "business"
    ],
    isNew: true
  }
,

  {
    slug: "product-photos",
    name: "Product Photo Batch Processor",
    description: "Resize, crop or pad, compress, convert, and rename product images with ZIP download.",
    category: "image",
    icon: "document-text",
    inputType: "file",
    keywords: [
      "product",
      "photos",
      "business"
    ],
    fileTypes: [
      "image"
    ],
    isNew: true
  },
  {
    slug: "catalogue-maker",
    name: "Product Catalogue Maker",
    description: "Create a branded product catalogue with embedded photos and print-to-PDF export.",
    category: "misc",
    icon: "document-text",
    inputType: "file",
    keywords: [
      "catalogue",
      "maker",
      "business"
    ],
    fileTypes: [
      "image"
    ],
    isNew: true
  },
  {
    slug: "metadata-remover",
    name: "Image Metadata Remover",
    description: "Remove supported EXIF, XMP, IPTC, and text metadata from JPEG and PNG without re-encoding.",
    category: "image",
    icon: "document-text",
    inputType: "file",
    keywords: [
      "metadata",
      "remover",
      "business"
    ],
    fileTypes: [
      "image"
    ],
    isNew: true
  },
  {
    slug: "pdf-organizer",
    name: "PDF Page Organiser",
    description: "Preview, reorder, select, and extract PDF pages in your browser.",
    category: "converter",
    icon: "document-text",
    inputType: "file",
    keywords: [
      "pdf",
      "organizer",
      "business"
    ],
    fileTypes: [
      "pdf"
    ],
    isNew: true
  },
  {
    slug: "image-ocr",
    name: "Image to Text OCR",
    description: "Extract printed English text using a self-hosted OCR engine running in your browser.",
    category: "converter",
    icon: "document-text",
    inputType: "file",
    keywords: [
      "image",
      "ocr",
      "business"
    ],
    fileTypes: [
      "image"
    ],
    isNew: true
  }

];
