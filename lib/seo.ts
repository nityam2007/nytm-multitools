// Canonical metadata and structured data for NYTM pages | TypeScript
import { Metadata } from "next";
import { toolsConfig, ToolConfig } from "./tools-config";
import { searchKeywords } from "./tool-search";
import { toolSearchTitles } from "./seo-intents";

const BASE_URL = "https://nytm.in";
const SITE_NAME = process.env.NEXT_PUBLIC_APP_NAME || "NYTM Tools";

// Category display names and descriptions
export const categoryMeta: Record<
  string,
  { name: string; description: string }
> = {
  text: {
    name: "Text Tools",
    description:
      "Free text manipulation tools - case conversion, find & replace, word counter, line sorter, and more.",
  },
  image: {
    name: "Image Tools",
    description:
      "Free image editing tools - resize, compress, crop, rotate, filters, format conversion, and more.",
  },
  dev: {
    name: "Code & Dev Tools",
    description:
      "Free coding tools — JSON formatter, code beautifiers, regex tester, JWT decoder, and more.",
  },
  converter: {
    name: "Converters",
    description:
      "Free format converters - JSON to CSV, YAML to JSON, Base64, timestamps, colors, and more.",
  },
  generator: {
    name: "Generators",
    description:
      "Free generators - UUID, passwords, QR codes, fake data, hashes, and more.",
  },
  security: {
    name: "Security Tools",
    description:
      "Free security tools - hash generators, encryption/decryption, password strength checker, and more.",
  },
  network: {
    name: "Network Tools",
    description:
      "Inspect IP addresses, DNS records, HTTP headers, and subnet ranges with free online network utilities.",
  },
  pdf: {
    name: "PDF Tools",
    description:
      "Merge, split, organise, compress, password-protect, and convert PDF files with free browser tools.",
  },
  misc: {
    name: "Miscellaneous Tools",
    description:
      "Free utility tools - calculators, timers, converters, and various productivity tools.",
  },
};

/**
 * Generate metadata for a specific tool page
 */
export function generateCollectionMetadata({
  title,
  description,
  path,
  keywords = [],
  article = false,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  article?: boolean;
}): Metadata {
  const url = new URL(path, BASE_URL).toString();
  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: { canonical: url },
    openGraph: {
      type: article ? "article" : "website",
      locale: "en_US",
      siteName: SITE_NAME,
      url,
      title,
      description,
      images: [
        {
          url: BASE_URL + "/metaimg.png",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [BASE_URL + "/metaimg.png"],
    },
  };
}
export function generateToolMetadata(slug: string): Metadata {
  const tool = toolsConfig.find((t) => t.slug === slug);
  if (!tool) return { title: "Tool Not Found", robots: { index: false } };
  const title = (toolSearchTitles[slug] || tool.name) + " – Free Online | NYTM";
  const description =
    tool.description.length < 138
      ? tool.description + " Free, no signup."
      : tool.description;
  return generateCollectionMetadata({
    title,
    description,
    path: "/tools/" + slug,
    keywords: [
      ...new Set([
        tool.name.toLowerCase(),
        (toolSearchTitles[slug] || tool.name).toLowerCase(),
        ...searchKeywords(tool),
      ]),
    ],
  });
}
export function generateToolsListMetadata(category?: string): Metadata {
  const info = category ? categoryMeta[category] : undefined;
  const title = info
    ? "Free " + info.name + " Online | NYTM"
    : toolsConfig.length + " Free Online Tools: PDF, Image, Text & Code | NYTM";
  const description = info
    ? info.description
    : "Search " +
      toolsConfig.length +
      " free tools for PDFs, images, text, code, and business. Filter by task, pin favourites, and open a tool without signing up.";
  return generateCollectionMetadata({
    title,
    description,
    path: info ? "/categories/" + category : "/tools",
    keywords: info
      ? [info.name.toLowerCase(), "free " + info.name.toLowerCase()]
      : [
          "free online tools",
          "pdf tools",
          "image tools",
          "text tools",
          "developer tools",
          "business tools",
        ],
  });
}

/**
 * Generate metadata for static pages
 */
export function generatePageMetadata(
  page: "home" | "about" | "contact" | "pricing" | "privacy" | "terms",
): Metadata {
  const toolCount = toolsConfig.length;

  const pages: Record<
    string,
    { title: string; description: string; path: string }
  > = {
    home: {
      title: `${SITE_NAME} — ${toolCount} Free Online Tools`,
      description: `${toolCount} free online tools for everyone. Text, images, converters, generators, and more. No ads, no sign-ups, 100% browser-based.`,
      path: "",
    },
    about: {
      title: `About ${SITE_NAME} — Free Online Tools for Everyone`,
      description: `Learn about ${SITE_NAME} — ${toolCount} free online tools for everyone. Privacy-first, no sign-up required, 100% browser-based.`,
      path: "/about",
    },
    contact: {
      title: `Contact Us | ${SITE_NAME}`,
      description: `Get in touch with ${SITE_NAME}. Report bugs, request features, or just say hello. We'd love to hear from you.`,
      path: "/contact",
    },
    pricing: {
      title: `Pricing - Free Forever | ${SITE_NAME}`,
      description: `${SITE_NAME} is completely free. ${toolCount} tools, no ads, no tracking, no limits. Support the project with a donation if you find it useful.`,
      path: "/pricing",
    },
    privacy: {
      title: `Privacy Policy | ${SITE_NAME}`,
      description: `Privacy Policy for ${SITE_NAME}. All tools run in your browser. Your data never leaves your device. We don't track you.`,
      path: "/privacy",
    },
    terms: {
      title: `Terms of Service | ${SITE_NAME}`,
      description: `Terms of Service for ${SITE_NAME}. Read our terms and conditions for using our free online tools.`,
      path: "/terms",
    },
  };

  const pageInfo = pages[page];
  const url = `${BASE_URL}${pageInfo.path}`;

  return {
    title: { absolute: pageInfo.title },
    description: pageInfo.description,
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: SITE_NAME,
      title: pageInfo.title,
      description: pageInfo.description,
      images: [
        {
          url: `${BASE_URL}/metaimg.png`,
          width: 1200,
          height: 630,
          alt: SITE_NAME,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageInfo.title,
      description: pageInfo.description,
      images: [`${BASE_URL}/metaimg.png`],
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * Generate JSON-LD structured data for a tool
 */
export function generateToolJsonLd(tool: ToolConfig): object {
  const application = {
    "@type": "WebApplication",
    name: tool.name,
    description: tool.description,
    url: `${BASE_URL}/tools/${tool.slug}`,
    applicationCategory: "UtilityApplication",
    operatingSystem: "Any",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    author: {
      "@type": "Person",
      name: "Nityam Sheth",
      url: "https://nsheth.in",
    },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: BASE_URL,
    },
  };
  return {
    "@context": "https://schema.org",
    "@graph": [
      application,
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: BASE_URL },
          {
            "@type": "ListItem",
            position: 2,
            name: "Tools",
            item: BASE_URL + "/tools",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: tool.name,
            item: BASE_URL + "/tools/" + tool.slug,
          },
        ],
      },
    ],
  };
}

/**
 * Generate JSON-LD structured data for the website
 */
export function generateWebsiteJsonLd(): object {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: BASE_URL,
    description: `${toolsConfig.length} free online tools for everyone.`,
    author: {
      "@type": "Person",
      name: "Nityam Sheth",
      url: "https://nsheth.in",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/tools?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
