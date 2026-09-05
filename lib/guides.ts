// Practical guides for business tool workflows | TypeScript
export const guides = [
  {
    slug: "prepare-product-photos", title: "Prepare product photos for your online store", description: "Choose a consistent image shape, prepare a batch, and check the results before publishing.", tool: "product-photos", related: ["catalogue-maker", "image-compress", "image-resize"],
    steps: [
      { title: "Start with the originals", text: "Keep an untouched folder of original photos. Choose clear images with consistent lighting and enough space around each product. A larger export cannot restore details missing from a small or blurry original." },
      { title: "Choose the shape your store needs", text: "Check the image area in your store theme before choosing dimensions. For a square product grid, 1200 × 1200 px is a useful starting example, not a universal requirement. Use Contain to keep the full product with a background, or Cover when cropping the edges is acceptable." },
      { title: "Process a small sample", text: "Open Product Photo Batch Processor and select two or three JPEG, PNG, or WebP files. Choose your output dimensions, background, and format. Start around 80–85% quality for JPEG or WebP, then inspect fine text, edges, and textures. PNG does not use this quality slider." },
      { title: "Export a consistently named batch", text: "Use a short filename prefix, such as ceramic-mug. NYTM adds sequential numbers and the correct extension. Download the ZIP, extract it, and associate each file with the correct product. The original files are not modified." },
      { title: "Check the real product page", text: "Open the exported images at normal viewing size and on a phone. Check that labels are readable and that the background and crop are consistent. Add useful alt text in your store, and check loading on a slower connection. File size alone does not tell you whether an image is good enough." },
    ], example: "Example setup: square product grid → 1200 × 1200 px → Contain → white background → WebP at 82% → ceramic-mug-001.webp. Review the result before applying those settings to every photo.",
  },
  {
    slug: "whatsapp-enquiry-qr", title: "Create a WhatsApp enquiry link and QR code", description: "Make it easier for customers to start a relevant conversation from a brochure, sign, or website.", tool: "whatsapp-link", related: ["contact-card", "utm-builder", "website-brief"],
    steps: [
      { title: "Use the number customers should reach", text: "Enter the business number with its country code. The builder validates the format, but it cannot confirm that the number has an active WhatsApp account. Test with the actual business account before sharing or printing." },
      { title: "Write a useful opening message", text: "Give people a starting point without assuming what they want. For a service brochure, try: Hello, I saw your brochure and would like to discuss a project. For a product label, name the product. The customer can edit the message before sending it." },
      { title: "Download and test the QR", text: "Download the SVG QR and scan it with more than one phone. Check the number and message. Keep the blank margin around the code, preserve its square shape, and use strong contrast. Test at the actual printed size and viewing distance." },
      { title: "Place it beside a clear invitation", text: "Tell people what happens when they scan: Ask about this product on WhatsApp is clearer than Scan me. Offer a visible website or phone number as an alternative for people who cannot scan the code." },
      { title: "Measure conversations rather than scans alone", text: "Use a different opening message for each placement to help identify where enquiries came from. A link click or QR scan does not mean a message was sent. Record the resulting qualified conversations and projects separately." },
    ], example: "Brochure message: Hello, I saw your September service brochure and would like to discuss a website. The destination number is encoded in the QR itself; generate and print a new QR if that number changes.",
  },
  {
    slug: "clean-recurring-csv", title: "Clean a recurring CSV without losing useful rows", description: "Handle quoted fields, choose the right duplicate rule, and export a checked file for the next step.", tool: "csv-cleanup", related: ["csv-chart-builder", "automation-savings", "csv-to-json"],
    steps: [
      { title: "Keep a source copy", text: "Start from the original UTF-8 CSV export. NYTM works on a copy in memory. If your data contains names with accents and they appear corrupted, re-export with UTF-8 encoding instead of cleaning an already damaged file." },
      { title: "Match the delimiter and header", text: "Choose comma, semicolon, or tab to match the export. Mark First row is header only if the first row contains column names. Quoted commas and line breaks inside fields are supported. An inconsistent column-count error usually means the delimiter or source needs checking." },
      { title: "Choose what a duplicate means", text: "Whole-row deduplication removes exact matching rows after the selected trimming step. A column rule instead keeps the first occurrence of each value in that column. For example, using a customer ID can discard later updates for the same customer. Review whether that is appropriate before exporting." },
      { title: "Inspect the preview and columns", text: "Check the row count, keep the columns needed downstream, and rename headers for your destination system. The preview shows a sample; the download includes the complete cleaned output. Preserve leading zeros in identifiers by importing those columns as text in your spreadsheet." },
      { title: "Export for the destination", text: "Spreadsheet-safe export prefixes values that may be interpreted as formulas with an apostrophe. This can also turn negative numbers into text. Keep it on for unfamiliar spreadsheet data; consider disabling it only when you understand the data and the destination requires the original values." },
    ], example: "Example: 500 rows from a weekly export → trim cells → remove empty rows → dedupe entire rows → keep customer ID, name, and city → export. If the same cleanup is repeated every week, the Automation Savings Calculator can help estimate whether a custom workflow is worthwhile.",
  },
  {
    slug: "write-a-website-brief", title: "Write a website brief that makes a project easier to quote", description: "Describe the customer, the job your website needs to do, and the features that matter.", tool: "website-brief", related: ["website-checklist", "quotation-maker", "seo-preview"],
    steps: [
      { title: "Describe the business and customer", text: "State what you sell, where you work, and who should use the website. A booking site for a local service business has different requirements from a product catalogue for wholesale buyers." },
      { title: "Choose the main action", text: "Decide what a useful visit should lead to: a call, a booking, an order, or a quote request. Explain what happens after that action, including who receives the enquiry and how your team follows up." },
      { title: "List pages and working features separately", text: "Pages describe information. Features describe behaviour. Services and About are pages; online payment, booking availability, and a customer dashboard are features. Mention any existing software the website must connect to." },
      { title: "Include constraints early", text: "Add a realistic timeline, a budget range if known, and who will provide copy and photos. Identify any launch date that cannot move. These details help a developer suggest a scope that fits the project." },
      { title: "Export and start a conversation", text: "Review the generated brief and download it. You can share it with your chosen developer. To discuss it with the studio behind NYTM, copy the brief, visit NSheth, and paste or attach it when you choose to make contact." },
    ], example: "Example goal: Help local customers request a service appointment. Pages: Home, Services, Work, About, Contact. Features: enquiry form and WhatsApp link. Follow-up: the business owner replies within their normal working hours. This is more actionable than simply asking for a modern website.",
  },
];
