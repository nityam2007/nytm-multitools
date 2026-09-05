// Editorial search phrases based on each tool's implemented features | TypeScript
export const toolSearchTitles: Record<string, string> = {
  "json-pretty": "JSON Formatter & Validator",
  "image-compress": "Image Compressor for JPG, PNG & WebP",
  "image-resize": "Image Resizer",
  "pdf-merge": "Merge PDF Files",
  "pdf-split": "Split PDF & Extract Pages",
  "pdf-compress": "Lossless PDF Compressor",
  "pdf-lock": "Password Protect PDF",
  "pdf-unlock": "Unlock PDF with Password",
  "pdf-organizer": "Reorder & Extract PDF Pages",
  "whatsapp-link": "WhatsApp Link & QR Code Generator",
  "utm-builder": "UTM Campaign URL Builder",
  "contact-card": "vCard & Contact QR Code Generator",
  "website-brief": "Website Project Brief Builder",
  "website-checklist": "Website Launch Checklist",
  "automation-savings": "Automation Time & Cost Savings Calculator",
  "quotation-maker": "Quotation & Estimate Maker",
  "email-signature": "HTML Email Signature Generator",
  "seo-preview": "Google Search Snippet Preview",
  "social-meta": "Open Graph & Social Meta Tag Generator",
  "schema-generator": "JSON-LD Schema Markup Generator",
  "contrast-checker": "WCAG Colour Contrast Checker",
  "csv-cleanup": "CSV Cleaner & Duplicate Row Remover",
  "product-photos": "Batch Product Photo Resizer",
  "catalogue-maker": "Product Catalogue Maker",
  "metadata-remover": "Image EXIF & Metadata Remover",
  "image-ocr": "Image to Text OCR in English",
};
export const categoryAdvice: Record<string, { heading: string; text: string }> =
  {
    text: {
      heading: "Choose a tool for the change you need",
      text: "Use counters to check length, a diff tool to compare drafts, or cleanup tools to remove duplicate lines and extra spaces. Keep a copy of the original when making several edits, then copy or download the result.",
    },
    image: {
      heading: "Start with size, then choose a format",
      text: "Resize an image when its dimensions are too large. Compress it when you need a smaller file. JPG suits photographs, PNG supports transparency, and WebP is useful for web delivery. Check the preview before downloading; the product photo tool can prepare a whole batch.",
    },
    dev: {
      heading: "Format, inspect, then validate",
      text: "A formatter makes code and data easier to read. A validator helps identify syntax errors, while a decoder lets you inspect an encoded value. Choose the tool that matches your file or language and review the result before using it in a project.",
    },
    converter: {
      heading: "Match the input and output formats",
      text: "Choose a converter for the file or data you have and the format you need. Structured data, dates, colours, and images have different conversion rules. Review the output, especially when a format change may affect transparency, layout, or numeric values.",
    },
    generator: {
      heading: "Create a starting point, then verify it",
      text: "Build a QR code, campaign link, contact card, password, or sample dataset. Check the settings before exporting. Scan QR codes and open generated links yourself before sharing them with customers or putting them into print.",
    },
    security: {
      heading: "Hashing and encryption solve different tasks",
      text: "A hash helps compare files or verify that content has not changed. Encryption makes content unreadable without the right key or password. Choose the matching operation and preserve the information required to decrypt anything you encrypt.",
    },
    network: {
      heading: "Inspect the part of the connection you need",
      text: "Use IP and DNS tools for addressing information, HTTP header inspection for website responses, or a subnet calculator for network ranges. Live lookup tools require a connection; read each tool's instructions for its data source and limitations.",
    },
    misc: {
      heading: "Find an everyday task, not just a category",
      text: "This collection includes calculators, timers, planning tools, OCR, CSV cleanup, and business utilities. Search the full library for a specific task, or pin the tools you use repeatedly. Calculations depend on the values and assumptions you enter.",
    },
    pdf: {
      heading: "Choose a PDF tool by the result you want",
      text: "Merge PDFs to combine documents. Split or organise them to choose and reorder pages. Convert pages to images when you need a visual export. Lossless compression can optimise file structure, but scanned or already compressed PDFs may not get smaller. Keep your original when editing signed documents.",
    },
  };
