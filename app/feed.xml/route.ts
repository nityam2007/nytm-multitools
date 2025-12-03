import { toolsConfig } from "@/lib/tools-config";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://nytm.in";
const SITE_NAME = "NYTM MultiTools";
const SITE_DESCRIPTION = "Free online tools for developers, designers, and everyone. Text tools, image tools, converters, generators, and more.";

export async function GET() {
  const currentDate = new Date().toUTCString();

  // Group tools by category for better organization
  const categories = [...new Set(toolsConfig.map((tool) => tool.category))];

  const rssItems = toolsConfig
    .map((tool) => {
      const categoryLabel = getCategoryLabel(tool.category);
      return `
    <item>
      <title><![CDATA[${tool.name}]]></title>
      <link>${BASE_URL}/tools/${tool.slug}</link>
      <guid isPermaLink="true">${BASE_URL}/tools/${tool.slug}</guid>
      <description><![CDATA[${tool.description}]]></description>
      <category><![CDATA[${categoryLabel}]]></category>
      <pubDate>${currentDate}</pubDate>
    </item>`;
    })
    .join("");

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${SITE_NAME}</title>
    <link>${BASE_URL}</link>
    <description>${SITE_DESCRIPTION}</description>
    <language>en-us</language>
    <lastBuildDate>${currentDate}</lastBuildDate>
    <atom:link href="${BASE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <generator>Next.js</generator>
    <ttl>60</ttl>
    <image>
      <url>${BASE_URL}/favicon.ico</url>
      <title>${SITE_NAME}</title>
      <link>${BASE_URL}</link>
    </image>
    ${rssItems}
  </channel>
</rss>`;

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}

function getCategoryLabel(category: string): string {
  const labels: Record<string, string> = {
    text: "Text Tools",
    image: "Image Tools",
    dev: "Code & Dev Tools",
    converter: "Converters",
    generator: "Generators",
    security: "Security Tools",
    misc: "Miscellaneous Tools",
  };
  return labels[category] || "Tools";
}
