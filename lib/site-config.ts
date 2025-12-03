// Site Configuration | TypeScript
// Centralized configuration for NYTM MULTITOOLS
// Update values here and they will reflect across the entire site

import { toolsConfig } from "./tools-config";

// Computed values from tools config
export const TOTAL_TOOLS = toolsConfig.length;
export const TOTAL_CATEGORIES = 7; // text, dev, image, converter, generator, security, misc

// Site metadata
export const SITE_NAME = "NYTM MULTITOOLS";
export const SITE_TAGLINE = `${TOTAL_TOOLS} tools. Zero friction. Built for everyone.`;
export const SITE_DESCRIPTION = `${TOTAL_TOOLS} tools across text manipulation, converters, generators, security, dev utilities, image processing, and more. Everything runs in your browser - your data stays with you.`;

// Owner information
export const OWNER_NAME = "Nityam Sheth";
export const OWNER_EMAIL = "hello@nytm.in";
export const OWNER_ALT_EMAIL = "hello@nsheth.in";

// GitHub
export const GITHUB_REPO = "https://github.com/nityam2007/nytm-multitools";

// Helper function to get tools count minus exceptions (e.g., IP Lookup)
export const getOtherToolsCount = (exceptCount: number = 1) => TOTAL_TOOLS - exceptCount;

// Formatted strings for common use cases
export const getToolsTagline = () => `${TOTAL_TOOLS} tools. Zero friction. Built for everyone.`;
export const getAllToolsIncluded = () => `All ${TOTAL_TOOLS} tools included`;
export const getAllToolsProcessLocally = () => `All ${TOTAL_TOOLS} tools process data entirely in your browser.`;
export const getToolsNoLimits = () => `${TOTAL_TOOLS} tools. No ads. No tracking. No limits. No catch.`;
