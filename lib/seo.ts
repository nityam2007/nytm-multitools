import { Metadata } from "next";
import { toolsConfig, ToolConfig } from "./tools-config";

const BASE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://nytm.in";
const SITE_NAME = process.env.NEXT_PUBLIC_APP_NAME || "NYTM Tools";

// Category display names and descriptions
export const categoryMeta: Record<string, { name: string; description: string }> = {
  text: {
    name: "Text Tools",
    description: "Free text manipulation tools - case conversion, find & replace, word counter, line sorter, and more.",
  },
  image: {
    name: "Image Tools",
    description: "Free image editing tools - resize, compress, crop, rotate, filters, format conversion, and more.",
  },
  dev: {
    name: "Developer Tools",
    description: "Free developer tools - JSON formatter, code beautifiers, regex tester, JWT decoder, and more.",
  },
  converter: {
    name: "Converters",
    description: "Free format converters - JSON to CSV, YAML to JSON, Base64, timestamps, colors, and more.",
  },
  generator: {
    name: "Generators",
    description: "Free generators - UUID, passwords, QR codes, fake data, hashes, and more.",
  },
  security: {
    name: "Security Tools",
    description: "Free security tools - hash generators, encryption/decryption, password strength checker, and more.",
  },
  misc: {
    name: "Miscellaneous Tools",
    description: "Free utility tools - calculators, timers, converters, and various productivity tools.",
  },
};

/**
 * Generate metadata for a specific tool page
 */
export function generateToolMetadata(slug: string): Metadata {
  const tool = toolsConfig.find((t) => t.slug === slug);
  
  if (!tool) {
    return {
      title: "Tool Not Found",
      description: "The requested tool could not be found.",
    };
  }

  const title = `${tool.name} - Free Online Tool | ${SITE_NAME}`;
  const description = `${tool.description} Free, no sign-up required. Works in your browser - your data stays private.`;
  const url = `${BASE_URL}/tools/${tool.slug}`;
  const category = categoryMeta[tool.category];

  return {
    title,
    description,
    keywords: [
      tool.name.toLowerCase(),
      `${tool.name.toLowerCase()} online`,
      `free ${tool.name.toLowerCase()}`,
      ...(tool.keywords || []),
      category?.name.toLowerCase() || tool.category,
      "online tool",
      "free tool",
      "no signup",
      "browser-based",
    ],
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: SITE_NAME,
      title: `${tool.name} - Free Online Tool`,
      description,
      images: [
        {
          url: `${BASE_URL}/metaimg.png`,
          width: 1200,
          height: 630,
          alt: `${tool.name} - ${SITE_NAME}`,
          type: "image/png",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.name} - Free Online Tool`,
      description,
      images: [`${BASE_URL}/metaimg.png`],
    },
    alternates: {
      canonical: url,
    },
    other: {
      "application-name": SITE_NAME,
    },
  };
}

/**
 * Generate metadata for the tools listing page
 */
export function generateToolsListMetadata(category?: string): Metadata {
  const isAllTools = !category || category === "all";
  const categoryInfo = category ? categoryMeta[category] : null;
  const toolCount = isAllTools 
    ? toolsConfig.length 
    : toolsConfig.filter((t) => t.category === category).length;

  const title = isAllTools
    ? `All ${toolCount} Free Online Tools | ${SITE_NAME}`
    : `${categoryInfo?.name || category} - ${toolCount} Free Tools | ${SITE_NAME}`;

  const description = isAllTools
    ? `Browse ${toolCount} free online tools for developers, designers, and everyone. Text manipulation, image editing, converters, generators, and more. No sign-up required.`
    : categoryInfo?.description || `Free ${category} tools. No sign-up required.`;

  const url = isAllTools ? `${BASE_URL}/tools` : `${BASE_URL}/tools?category=${category}`;

  return {
    title,
    description,
    keywords: [
      "free online tools",
      "developer tools",
      "productivity tools",
      "web tools",
      "no signup tools",
      ...(categoryInfo ? [categoryInfo.name.toLowerCase()] : []),
    ],
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: SITE_NAME,
      title,
      description,
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
      title,
      description,
      images: [`${BASE_URL}/metaimg.png`],
    },
    alternates: {
      canonical: url,
    },
  };
}

/**
 * Generate metadata for static pages
 */
export function generatePageMetadata(
  page: "home" | "about" | "contact" | "pricing" | "privacy" | "terms"
): Metadata {
  const toolCount = toolsConfig.length;

  const pages: Record<string, { title: string; description: string; path: string }> = {
    home: {
      title: `${SITE_NAME} — ${toolCount} Free Developer & Productivity Tools`,
      description: `${toolCount} free online tools for developers and creators. Text manipulation, converters, generators, image editing, and more. No ads, no sign-ups, 100% client-side processing.`,
      path: "",
    },
    about: {
      title: `About ${SITE_NAME} — Free Online Tools for Everyone`,
      description: `Learn about ${SITE_NAME} - ${toolCount} free online tools built for developers, designers, and everyone. Privacy-first, no sign-up required, 100% client-side processing.`,
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
    title: pageInfo.title,
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
  return {
    "@context": "https://schema.org",
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
    description: `${toolsConfig.length} free online tools for developers and creators.`,
    author: {
      "@type": "Person",
      name: "Nityam Sheth",
      url: "https://nsheth.in",
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${BASE_URL}/tools?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}
