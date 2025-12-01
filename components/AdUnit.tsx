"use client";

import { useEffect, useState, useRef } from "react";
import { 
  AdSlot, 
  AdConfig, 
  adDimensions, 
  loadAdConfig, 
  getAdSlotsByPosition,
  shouldShowAds,
  AdPosition,
  AdSize
} from "@/lib/ads-config";
import { useSubscription } from "@/lib/subscription-context";

interface AdUnitProps {
  slotId?: string;
  position?: AdPosition;
  size?: AdSize;
  className?: string;
  showLabel?: boolean;
}

// Test/placeholder ad content for development
function PlaceholderAd({ 
  width, 
  height, 
  label 
}: { 
  width: number; 
  height: number; 
  label: string;
}) {
  return (
    <div 
      className="bg-gradient-to-br from-[var(--muted)] to-[var(--border)] border-2 border-dashed border-[var(--border)] rounded-lg flex flex-col items-center justify-center text-[var(--muted-foreground)] overflow-hidden"
      style={{ width: `${width}px`, height: `${height}px`, maxWidth: "100%" }}
    >
      <span className="text-2xl mb-1">📢</span>
      <span className="text-xs font-medium">AD SPACE</span>
      <span className="text-[10px] opacity-70">{label}</span>
      <span className="text-[10px] opacity-50">{width}x{height}</span>
    </div>
  );
}

// Main Ad Unit Component
export function AdUnit({ 
  slotId, 
  position = "in-content", 
  size = "rectangle",
  className = "",
  showLabel = true
}: AdUnitProps) {
  const [config, setConfig] = useState<AdConfig | null>(null);
  const [slot, setSlot] = useState<AdSlot | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const adRef = useRef<HTMLDivElement>(null);
  const { isSupporter } = useSubscription();

  useEffect(() => {
    setMounted(true);
    setIsMobile(window.innerWidth < 768);
    
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    
    const loadedConfig = loadAdConfig();
    setConfig(loadedConfig);

    // Find the appropriate slot
    if (slotId) {
      const foundSlot = loadedConfig.slots.find(s => s.id === slotId);
      setSlot(foundSlot || null);
    } else {
      const slots = getAdSlotsByPosition(loadedConfig, position, window.innerWidth < 768);
      setSlot(slots[0] || null);
    }

    return () => window.removeEventListener("resize", handleResize);
  }, [slotId, position]);

  // Don't render if not mounted (SSR)
  if (!mounted || !config) return null;

  // Check if ads should show
  if (!shouldShowAds(config, isSupporter)) return null;

  // Get dimensions
  const dimensions = slot 
    ? { width: slot.width || adDimensions[slot.size].width, height: slot.height || adDimensions[slot.size].height }
    : adDimensions[size];

  // Check mobile/desktop visibility
  if (slot) {
    if (isMobile && !slot.showOnMobile) return null;
    if (!isMobile && !slot.showOnDesktop) return null;
    if (!slot.enabled) return null;
  }

  return (
    <div 
      className={`ad-unit flex flex-col items-center ${className}`}
      data-slot-id={slotId || position}
    >
      {showLabel && (
        <span className="text-[10px] text-[var(--muted-foreground)] uppercase tracking-wider mb-1">
          Advertisement
        </span>
      )}
      <div ref={adRef} className="ad-content">
        {config.testMode || !slot?.code ? (
          // Show placeholder in test mode or if no ad code configured
          <PlaceholderAd 
            width={dimensions.width} 
            height={dimensions.height} 
            label={slot?.name || position}
          />
        ) : (
          // Render actual ad code
          <div 
            dangerouslySetInnerHTML={{ __html: slot.code }}
            style={{ width: dimensions.width, height: dimensions.height }}
          />
        )}
      </div>
    </div>
  );
}

// Preset Ad Components for common placements
export function HeaderAd({ className = "" }: { className?: string }) {
  return (
    <div className={`hidden md:flex justify-center py-2 ${className}`}>
      <AdUnit position="header" slotId="header-banner" showLabel={false} />
    </div>
  );
}

export function MobileHeaderAd({ className = "" }: { className?: string }) {
  return (
    <div className={`md:hidden flex justify-center py-2 ${className}`}>
      <AdUnit position="header" slotId="mobile-header" showLabel={false} />
    </div>
  );
}

export function SidebarAd({ className = "" }: { className?: string }) {
  return (
    <div className={`hidden lg:block ${className}`}>
      <AdUnit position="sidebar" slotId="sidebar-rectangle" />
    </div>
  );
}

export function ToolTopAd({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center my-4 ${className}`}>
      <AdUnit position="tool-top" slotId="tool-top-banner" />
    </div>
  );
}

export function ToolBottomAd({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center my-6 ${className}`}>
      <AdUnit position="tool-bottom" slotId="tool-bottom-rectangle" />
    </div>
  );
}

export function InContentAd({ className = "" }: { className?: string }) {
  return (
    <div className={`flex justify-center my-8 ${className}`}>
      <AdUnit position="in-content" slotId="in-content-rectangle" />
    </div>
  );
}

export function FooterAd({ className = "" }: { className?: string }) {
  return (
    <div className={`hidden md:flex justify-center py-4 ${className}`}>
      <AdUnit position="footer" slotId="footer-banner" />
    </div>
  );
}

// Responsive Ad that switches based on screen size
export function ResponsiveAd({ 
  mobileSlotId = "mobile-header",
  desktopSlotId = "header-banner",
  className = ""
}: { 
  mobileSlotId?: string;
  desktopSlotId?: string;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="md:hidden">
        <AdUnit slotId={mobileSlotId} />
      </div>
      <div className="hidden md:block">
        <AdUnit slotId={desktopSlotId} />
      </div>
    </div>
  );
}
