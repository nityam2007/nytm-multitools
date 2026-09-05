// PWA Manifest | TypeScript
// Next-native manifest route — served at /manifest.webmanifest

import type { MetadataRoute } from "next";
import { SITE_NAME, SITE_DESCRIPTION } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_NAME,
    short_name: "NYTM",
    description: SITE_DESCRIPTION,
    start_url: "/",
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#8b5cf6",
    categories: ["productivity", "utilities"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
      { src: "/apple-touch-icon.png", sizes: "180x180", type: "image/png", purpose: "maskable" },
    ],
  };
}
