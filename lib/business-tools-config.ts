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
  }
];
