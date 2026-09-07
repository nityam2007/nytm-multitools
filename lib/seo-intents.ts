// Editorial search phrases based on each tool's implemented features | TypeScript
export const toolSearchTitles: Record<string, string> = {
  "directory-tree-visualizer": "Directory Tree Generator for README Files",
  "bullet-points": "Text to Bullet Points & Numbered Lists",
  "markdown-clean": "Markdown Cleaner & Formatter",
  "image-upscaler": "Image Upscaler: Enlarge Images 2x, 3x or 4x",
  "text-repeat": "Text Repeater with Custom Separators",
  "optical-illusion-generator": "Optical Illusion Generator",
  "iban-generator": "Test IBAN Generator",
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

export interface ToolAdvice {
  heading: string;
  answer: string;
  steps: string[];
  example: { input: string; output: string };
  limitations: string;
  questions: { question: string; answer: string }[];
  related: string[];
}

// Handwritten guidance checked against each tool, shared by visible copy and metadata.
export const toolAdvice: Record<string, ToolAdvice> = {
  "directory-tree-visualizer": {
    heading: "How do I create a folder tree for a README?",
    answer: "Enter one file or folder per line, indent children with two spaces, and copy the generated directory tree into a fenced text block in your README. Use Simple style when you need ASCII-only connectors.",
    steps: ["Replace the sample with your project folders and files.", "Indent child entries beneath their parent. Disable file icons for plain text output.", "Choose a connector style, then copy the result or download directory-tree.txt."],
    example: { input: "src\n  components\n    Button.tsx\nREADME.md", output: "├── src\n│   └── components\n│       └── Button.tsx\n└── README.md" },
    limitations: "The example uses the default thin connectors with file icons disabled. This tool reads an indented list; it does not scan your disk or verify that files exist. File and folder counts are estimated from dots in names, so extensionless files and dotted folders can be misclassified.",
    questions: [
      { question: "Which tree style uses only ASCII characters?", answer: "Choose Simple for |-- and `-- connectors. The thin and heavy line styles use Unicode box-drawing characters. Turn off file icons if you need entirely plain output." },
      { question: "Why does the tree lose alignment in Markdown?", answer: "Wrap it in a fenced code block with three backticks before and after the tree. A monospace code block preserves spaces and connector alignment." },
    ],
    related: ["markdown-clean", "markdown-preview", "markdown-to-html", "text-diff", "json-pretty", "html-to-markdown"],
  },
  "bullet-points": {
    heading: "How do I turn a paragraph into bullet points?",
    answer: "Paste your text, choose sentence splitting for a paragraph or line splitting for an existing list, and choose bullets or numbering. The converter keeps the wording, capitalization and punctuation inside each item.",
    steps: ["Paste a paragraph or one item per line.", "Choose how to split the text and whether to add bullets, number items or remove list markers.", "Convert, review the item boundaries, then copy or download the text."],
    example: { input: "Draft the README. Review the examples. Publish the update.", output: "• Draft the README.\n• Review the examples.\n• Publish the update." },
    limitations: "This is a list formatter, not an AI summarizer. Sentence splitting uses punctuation followed by whitespace and can split abbreviations such as Dr. Smith; choose lines for precise boundaries. Blank lines and outer item whitespace are removed.",
    questions: [
      { question: "Can I remove bullets from an existing list?", answer: "Yes. Select Remove list markers and split by lines. Leading bullet markers and numbering followed by whitespace are removed; the item text stays intact." },
      { question: "Does this rewrite or shorten my text?", answer: "No. It changes list formatting and item boundaries. It does not summarize, paraphrase, capitalize text or remove sentence punctuation." },
    ],
    related: ["sort-lines", "remove-duplicates", "text-repeat", "word-counter", "text-diff", "summary"],
  },
  "markdown-clean": {
    heading: "How do I clean Markdown without changing code blocks?",
    answer: "Paste your Markdown, select the cleanup rules you want, and run Clean Markdown. Fenced code, indented code and inline code spans are preserved while the selected rules tidy surrounding text.",
    steps: ["Paste Markdown and keep a copy of the original.", "Choose heading, list, link, blank-line and trailing-whitespace cleanup independently.", "Clean the text, compare the input and output, then download cleaned.md. Open Markdown Preview to check rendering."],
    example: { input: "#Project\n\n-item one\n\n\n```js\nconst label = '( keep spaces )';\n```", output: "# Project\n\n- item one\n\n```js\nconst label = '( keep spaces )';\n```" },
    limitations: "This is a conservative line-based formatter, not a full Markdown parser. Indented lines are left untouched to protect code. Complex nested lists, HTML blocks and dialect-specific syntax may need manual review. Existing two-space Markdown line breaks are preserved.",
    questions: [
      { question: "Does cleaning Markdown remove its formatting?", answer: "No. Headings, lists, links and emphasis remain Markdown. Cleaning standardizes selected spacing rules; it does not convert a document to plain text." },
      { question: "Can I keep blank lines and trailing spaces?", answer: "Yes. Turn off those options. The formatter always preserves code regions and keeps two-space hard line breaks when trimming normal text." },
    ],
    related: ["markdown-preview", "directory-tree-visualizer", "markdown-to-html", "html-to-markdown", "text-diff", "bullet-points"],
  },
  "image-compress": {
    heading: "How do I reduce an image file size?",
    answer: "Choose your image, select JPEG or WebP, and lower quality or resize the width. Compress the image and compare the resulting bytes and preview with your original before downloading.",
    steps: ["Choose a PNG, JPG, JPEG, WebP or GIF file up to 50 MB.", "Select JPEG or WebP, set quality, and optionally reduce the width.", "Compress, inspect fine text and edges, and compare the measured file size. Adjust the settings and repeat if needed."],
    example: { input: "A 2400 × 1600 px photograph; JPEG output; quality 80%; resize width 1200 px.", output: "A 1200 × 800 px JPEG. The result reports its actual file size; the number of KB depends on the picture and browser encoder." },
    limitations: "A quality percentage is not a target file size. A 20 KB, 50 KB or 100 KB application limit may require several adjustments. Output is lossy JPEG or WebP, not PNG. JPEG cannot retain transparency, and animated inputs become a still image. Check the receiving portal's format and dimension requirements.",
    questions: [
      { question: "Can I compress a photo to 20 KB or 50 KB?", answer: "Try a smaller width and lower quality, then check the actual byte count. This page currently uses manual quality and resize controls; it does not guarantee a specific KB limit or application acceptance." },
      { question: "Why is the compressed file larger?", answer: "Re-encoding an already optimized image, or changing its format, can increase size. Compare the reported sizes and keep the original when the result is larger or looks worse." },
    ],
    related: ["image-resize", "image-crop", "image-convert", "metadata-remover", "product-photos", "image-upscaler"],
  },
  "image-upscaler": {
    heading: "How do I enlarge an image 2x or 4x?",
    answer: "Choose an image, select a 2x, 3x or 4x scale factor, and download the enlarged PNG. Both width and height are multiplied by that factor using the browser's image smoothing.",
    steps: ["Select an image and check its original dimensions.", "Choose 2x, 3x or 4x and review the resulting dimensions.", "Run the upscaler and inspect the downloaded PNG at its intended display size."],
    example: { input: "An 800 × 600 px image at 2x.", output: "A 1600 × 1200 px PNG. At 4x, the same input becomes 3200 × 2400 px." },
    limitations: "This tool uses canvas interpolation, not AI detail reconstruction. It cannot recover detail absent from the source. A 4x enlargement creates 16 times as many pixels and can require substantial memory. PNG output can be larger than the original JPEG.",
    questions: [
      { question: "Will enlarging fix a blurry photo?", answer: "It increases pixel dimensions and smooths scaling, but does not reconstruct missing detail. Start with the sharpest, largest original you have." },
      { question: "Should I upscale before compressing?", answer: "Use the dimensions required for the final placement, then compress if the exported file is too large. Avoid enlargement when the original already has enough pixels." },
    ],
    related: ["image-resize", "image-compress", "image-crop", "image-convert", "product-photos", "image-ocr"],
  },
  "text-repeat": {
    heading: "How do I repeat text with a separator?",
    answer: "Enter the text, set a repeat count from 1 to 1,000, and choose the separator. Generate the output, then copy it or download repeated-text.txt.",
    steps: ["Enter the word, sentence or multiline block you want to repeat.", "Set a count and choose a separator preset, or type your own separator.", "Generate and check the output. Use Copy or Download to save it."],
    example: { input: "Text: hello\nCount: 3\nSeparator: comma and space", output: "hello, hello, hello" },
    limitations: "The entire input is repeated, including existing line breaks. The separator is inserted only between copies. Literal \\n and \\t in the separator become newlines and tabs. Large inputs multiplied by a large count may be slow on your device.",
    questions: [
      { question: "How do I repeat text on separate lines?", answer: "Choose the New Line preset or enter \\n in Separator. Each copy starts on a new line without adding a separator after the final copy." },
      { question: "Can I repeat without any spaces?", answer: "Choose None, or leave Separator empty. For example, repeating ha three times gives hahaha." },
    ],
    related: ["bullet-points", "word-counter", "character-counter", "sort-lines", "remove-duplicates", "lorem-ipsum"],
  },
  "optical-illusion-generator": {
    heading: "How do I make an optical illusion pattern?",
    answer: "Choose one of six patterns and change its two colors to compare the effect. Spiral and Motion patterns also have an animation-speed control; the other patterns are static.",
    steps: ["Select Checkerboard, Rotating Spiral, Hermann Grid, Café Wall, Motion or Concentric Circles.", "Adjust the two colors and observe how the contrast changes the pattern.", "For Spiral or Motion, adjust the animation duration in seconds."],
    example: { input: "Pattern: Café Wall\nColor 1: black\nColor 2: white", output: "Offset rows of contrasting blocks with horizontal gray lines. Compare the apparent line directions while changing the colors." },
    limitations: "This page displays SVG patterns in the browser and currently has no image-download or print preset. Spiral and Motion use real animation, so their movement is not solely a static visual illusion. Appearance varies with screen size, contrast and the viewer.",
    questions: [
      { question: "Is the rotating spiral actually moving?", answer: "Yes. The spiral uses a CSS rotation animation. Its speed control sets the duration of a rotation in seconds." },
      { question: "Which patterns can I compare without animation?", answer: "Checkerboard, Hermann Grid, Café Wall and Concentric Circles are static. Use them to compare color and contrast without the animated patterns." },
    ],
    related: ["color-picker", "color-converter", "palette-generator", "contrast-checker", "image-resize", "image-convert"],
  },
  "iban-generator": {
    heading: "How do I generate a test IBAN?",
    answer: "Select a supported country and the number of samples, then generate and copy the IBAN strings for test fixtures. The generator computes the international check digits over a randomly generated account portion.",
    steps: ["Choose Germany, France, United Kingdom, Spain, Italy, Netherlands, Belgium, Austria, Switzerland or Poland.", "Choose a sample count and generate the strings.", "Copy an individual result or all results into your software test fixtures."],
    example: { input: "Country: Germany (DE)\nCount: 1", output: "One random 22-character string beginning DE, displayed in groups of four. Generated values vary each time." },
    limitations: "The simplified generator uses a numeric account portion for every country. It can therefore fail national structure rules, such as required bank letters, even when the international checksum passes. Account existence is not checked; random values are not guaranteed to be unassigned. Never use them for payments.",
    questions: [
      { question: "Does a valid checksum mean an IBAN is a real account?", answer: "No. The international checksum detects some typing errors. It does not verify account existence, ownership, bank details or a country's additional checks." },
      { question: "Why can a generated sample fail another validator?", answer: "A validator may check national field structure and domestic checksums in addition to the international checksum. This simplified generator does not implement every national rule." },
    ],
    related: ["fake-data", "uuid-generator", "random-number", "json-pretty", "text-diff", "password-generator"],
  },
  "image-ocr": {
    heading: "How do I extract text from a screenshot?",
    answer: "Load the English OCR engine, choose a clear JPG, PNG or WebP screenshot, and select Extract text. Review the recognized words and numbers before copying or downloading the text.",
    steps: ["Load the English OCR engine; its initial files are served by NYTM.", "Choose a clear, upright image under 15 MB and 20 megapixels.", "Extract the text, correct recognition errors, and copy or download extracted-text.txt."],
    example: { input: "A clear screenshot containing printed text: Order total: 1250", output: "Expected text: Order total: 1250\nActual recognition can differ; compare it with the original image." },
    limitations: "The bundled model supports printed English. Hindi and other scripts are not supported by this page. Handwriting, skew, small text and complex columns can cause errors. PDF input is not accepted. Load the OCR assets before offline recognition; browser support can vary.",
    questions: [
      { question: "Can it read Hindi or a multilingual document?", answer: "This page loads only the English model. It does not offer Hindi or other language selection; do not rely on it to recognize unsupported scripts." },
      { question: "Why are words missing from my image?", answer: "Try an upright image with larger, sharper text and less background clutter. Crop to the text region and review the output manually, especially numbers and punctuation." },
    ],
    related: ["image-crop", "image-rotate", "image-resize", "pdf-to-images", "word-counter", "text-diff"],
  },
  "whatsapp-link": {
    heading: "How do I make a WhatsApp link with a message?",
    answer: "Enter the destination number with its country code and write an opening message. Copy the generated wa.me link or download its SVG QR code, then test it with the intended WhatsApp account.",
    steps: ["Enter your country code and phone number. For India, use +91 followed by your number.", "Write a message, such as Hello, I would like a quote for your services.", "Copy the link or download the SVG QR. Check the destination and message on a phone before publishing."],
    example: { input: "Message: Hello, I would like a quote.", output: "The link's text parameter is Hello%2C%20I%20would%20like%20a%20quote.\nThe chosen phone number appears in the wa.me path." },
    limitations: "The builder checks a 7–15 digit international number format, not whether a WhatsApp account exists. The customer still decides whether to send the message. The SVG QR encodes the destination; changing your number requires generating and replacing the QR.",
    questions: [
      { question: "Does opening the link send a message automatically?", answer: "No. It opens the conversation with the message pre-filled. The visitor can edit it and must send it themselves." },
      { question: "Can I print the WhatsApp QR code?", answer: "Yes. Download the SVG, preserve its square shape and blank margin, and test a print at the intended size. The code contains the same destination and message as the link." },
    ],
    related: ["contact-card", "qr-code-generator", "utm-builder", "quotation-maker", "email-signature", "catalogue-maker"],
  },
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
