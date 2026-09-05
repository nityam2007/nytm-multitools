// Site Configuration | TypeScript
// Centralized configuration for NYTM MULTITOOLS
// Update values here and they will reflect across the entire site

import { toolsConfig } from "./tools-config";

// Computed values from tools config
export const TOTAL_TOOLS = toolsConfig.length;
export const TOTAL_CATEGORIES = new Set(toolsConfig.map(tool => tool.category)).size;

// Site metadata
export const SITE_NAME = "NYTM Tools";
export const SITE_TAGLINE = "Small tasks. Sorted.";
export const SITE_TITLE = "Free Online Tools for PDFs, Images, Text & Code | NYTM";
export const SITE_DESCRIPTION = `${TOTAL_TOOLS} free online tools to merge PDFs, resize images, format JSON, clean CSV files and more. No signup or installation. Pick a tool and get it done.`;
export const SOCIAL_TITLE = `${SITE_NAME} — ${SITE_TAGLINE}`;
export const SOCIAL_IMAGE = {
  url: "https://nytm.in/og",
  width: 1200,
  height: 630,
  alt: `${SITE_NAME}. ${SITE_TAGLINE} ${TOTAL_TOOLS} free online tools for PDFs, images, text, code and business.`,
  type: "image/png",
};
export const SOCIAL_CREATOR = "@nityam2007";

// Owner information
export const OWNER_NAME = "Nityam Sheth";
export const OWNER_EMAIL = "hello@nytm.in";
export const OWNER_ALT_EMAIL = "hello@nsheth.in";

// GitHub
export const GITHUB_REPO = "https://github.com/nityam2007/nytm-multitools";

// Helper function to get tools count minus exceptions (e.g., IP Lookup)
export const getOtherToolsCount = (exceptCount: number = 1) => TOTAL_TOOLS - exceptCount;

// Formatted strings for common use cases
export const getToolsTagline = () => SITE_TAGLINE;
export const getAllToolsIncluded = () => `All ${TOTAL_TOOLS} tools included`;
export const getAllToolsProcessLocally = () => `Most tool processing runs in your browser; analytics and network features can send data to servers.`;
export const getToolsNoLimits = () => `${TOTAL_TOOLS} tools. No subscription. No sign-up required.`;
