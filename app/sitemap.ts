// Canonical page sitemap with explicit release modification dates | TypeScript
import { MetadataRoute } from "next";
import { toolsConfig } from "@/lib/tools-config";
import { discoveryCategories } from "@/lib/tool-discovery";
import { guides } from "@/lib/guides";
import { blogEntries } from "@/lib/blog-info";

const BASE_URL = "https://nytm.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date("2026-09-05");

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${BASE_URL}/tools`,
      lastModified: currentDate,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: currentDate,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/pricing`,
      lastModified: currentDate,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: currentDate,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    { url: `${BASE_URL}/license`, lastModified: currentDate, changeFrequency: "yearly", priority: 0.3 },
  ];

  for (const path of ["business-tools", "work-with-nsheth", "guides"])
    staticPages.push({
      url: `${BASE_URL}/${path}`,
      changeFrequency: "monthly",
      priority: 0.8,
    });

  // Tool pages - dynamically generated from tools config
  const toolPages: MetadataRoute.Sitemap = toolsConfig.map((tool) => ({
    url: `${BASE_URL}/tools/${tool.slug}`,
    lastModified: currentDate,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  // Blog pages - SEO alternate entry points
  const blogPages: MetadataRoute.Sitemap = blogEntries.map((entry) => ({
    url: `${BASE_URL}/blog/${entry.blogSlug}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [
    ...staticPages,
    ...[...discoveryCategories.map((c) => c.id), "pdf"].map((category) => ({
      url: `${BASE_URL}/categories/${category}`,
      lastModified: currentDate,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...toolPages,
    ...blogPages,
    ...guides.map((guide) => ({
      url: `${BASE_URL}/guides/${guide.slug}`,
      lastModified: new Date("2026-09-05"),
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}
