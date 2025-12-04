import { MetadataRoute } from "next";
import { toolsConfig } from "@/lib/tools-config";
import { blogEntries } from "@/lib/blog-info";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || "https://nytm.in";

export default function sitemap(): MetadataRoute.Sitemap {
  const currentDate = new Date();

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
  ];

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

  return [...staticPages, ...toolPages, ...blogPages];
}
