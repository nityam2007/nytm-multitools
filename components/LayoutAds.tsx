"use client";

import { HeaderAd, MobileHeaderAd, FooterAd } from "@/components/AdUnit";

// Client-side wrapper components for layout ads
// These are separate to avoid hydration issues in the server-rendered layout

export function HeaderAdWrapper() {
  return <HeaderAd />;
}

export function MobileHeaderAdWrapper() {
  return <MobileHeaderAd />;
}

export function FooterAdWrapper() {
  return <FooterAd />;
}
