// PWA Manifest | TypeScript
// Next-native manifest route — served at /manifest.webmanifest

import type { MetadataRoute } from "next";
import { TOTAL_TOOLS } from "@/lib/site-config";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NYTM Tools",
    short_name: "NYTM",
    description: `${TOTAL_TOOLS} free, private, browser-based tools. No ads, no sign-ups, works offline.`,
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
