// Centralized Ad Configuration
// This file manages all ad placements across the site

export type AdSize = 
  | "banner"        // 728x90 - Leaderboard
  | "rectangle"     // 300x250 - Medium Rectangle
  | "skyscraper"    // 160x600 - Wide Skyscraper
  | "mobile"        // 320x50 - Mobile Banner
  | "large-banner"  // 970x90 - Large Leaderboard
  | "billboard"     // 970x250 - Billboard
  | "square"        // 250x250 - Square
  | "custom";       // Custom size

export type AdPosition = 
  | "header"
  | "footer"
  | "sidebar"
  | "in-content"
  | "tool-top"
  | "tool-bottom"
  | "between-sections";

export interface AdSlot {
  id: string;
  name: string;
  size: AdSize;
  position: AdPosition;
  enabled: boolean;
  code: string;        // Iframe, script tag, or HTML code
  fallbackHtml?: string; // Fallback content if ad fails to load
  width?: number;
  height?: number;
  showOnMobile?: boolean;
  showOnDesktop?: boolean;
  priority?: number;   // Higher priority ads show first
}

export interface AdConfig {
  globalEnabled: boolean;
  showToFreeUsers: boolean;
  showToPremiumUsers: boolean;
  testMode: boolean;
  slots: AdSlot[];
}

// Default ad dimensions for each size type
export const adDimensions: Record<AdSize, { width: number; height: number }> = {
  banner: { width: 728, height: 90 },
  rectangle: { width: 300, height: 250 },
  skyscraper: { width: 160, height: 600 },
  mobile: { width: 320, height: 50 },
  "large-banner": { width: 970, height: 90 },
  billboard: { width: 970, height: 250 },
  square: { width: 250, height: 250 },
  custom: { width: 300, height: 250 },
};

// Default ad configuration - this would be loaded from database/admin in production
export const defaultAdConfig: AdConfig = {
  globalEnabled: true,
  showToFreeUsers: true,
  showToPremiumUsers: false,
  testMode: true, // Set to true to show placeholder ads
  slots: [
    {
      id: "header-banner",
      name: "Header Banner",
      size: "banner",
      position: "header",
      enabled: true,
      code: "",
      showOnMobile: false,
      showOnDesktop: true,
      priority: 10,
    },
    {
      id: "mobile-header",
      name: "Mobile Header",
      size: "mobile",
      position: "header",
      enabled: true,
      code: "",
      showOnMobile: true,
      showOnDesktop: false,
      priority: 10,
    },
    {
      id: "sidebar-rectangle",
      name: "Sidebar Rectangle",
      size: "rectangle",
      position: "sidebar",
      enabled: true,
      code: "",
      showOnMobile: false,
      showOnDesktop: true,
      priority: 8,
    },
    {
      id: "tool-top-banner",
      name: "Tool Page Top Banner",
      size: "banner",
      position: "tool-top",
      enabled: true,
      code: "",
      showOnMobile: false,
      showOnDesktop: true,
      priority: 9,
    },
    {
      id: "tool-bottom-rectangle",
      name: "Tool Page Bottom",
      size: "rectangle",
      position: "tool-bottom",
      enabled: true,
      code: "",
      showOnMobile: true,
      showOnDesktop: true,
      priority: 7,
    },
    {
      id: "in-content-rectangle",
      name: "In-Content Ad",
      size: "rectangle",
      position: "in-content",
      enabled: true,
      code: "",
      showOnMobile: true,
      showOnDesktop: true,
      priority: 6,
    },
    {
      id: "footer-banner",
      name: "Footer Banner",
      size: "large-banner",
      position: "footer",
      enabled: true,
      code: "",
      showOnMobile: false,
      showOnDesktop: true,
      priority: 5,
    },
  ],
};

// Get ad slot by position
export function getAdSlotsByPosition(
  config: AdConfig, 
  position: AdPosition,
  isMobile: boolean = false
): AdSlot[] {
  if (!config.globalEnabled) return [];
  
  return config.slots
    .filter(slot => {
      if (!slot.enabled) return false;
      if (slot.position !== position) return false;
      if (isMobile && !slot.showOnMobile) return false;
      if (!isMobile && !slot.showOnDesktop) return false;
      return true;
    })
    .sort((a, b) => (b.priority || 0) - (a.priority || 0));
}

// Get ad slot by ID
export function getAdSlotById(config: AdConfig, id: string): AdSlot | undefined {
  return config.slots.find(slot => slot.id === id);
}

// Check if ads should be shown to user
export function shouldShowAds(config: AdConfig, isSupporter: boolean): boolean {
  if (!config.globalEnabled) return false;
  if (isSupporter && !config.showToPremiumUsers) return false;
  if (!isSupporter && !config.showToFreeUsers) return false;
  return true;
}

// Storage key for ad config
export const AD_CONFIG_STORAGE_KEY = "nytm-ad-config";

// Save ad config to storage (for admin panel)
export function saveAdConfig(config: AdConfig): void {
  if (typeof window !== "undefined") {
    localStorage.setItem(AD_CONFIG_STORAGE_KEY, JSON.stringify(config));
  }
}

// Load ad config from storage
export function loadAdConfig(): AdConfig {
  if (typeof window !== "undefined") {
    const stored = localStorage.getItem(AD_CONFIG_STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored) as AdConfig;
      } catch {
        return defaultAdConfig;
      }
    }
  }
  return defaultAdConfig;
}
