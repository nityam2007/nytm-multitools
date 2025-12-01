"use client";

import Link from "next/link";
import { useSubscription, SubscriptionTier, tierFeatures } from "@/lib/subscription-context";

// Supporter Badge Component
export function SupporterBadge({ tier, className = "" }: { tier?: SubscriptionTier; className?: string }) {
  const { subscription } = useSubscription();
  const currentTier = tier || subscription.tier;
  
  if (currentTier === "free") return null;
  
  const features = tierFeatures[currentTier];
  if (!features) return null;
  
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r ${features.badgeColor} text-xs font-medium ${className}`}>
      {features.badge}
    </span>
  );
}

// Thank You Message (show to supporters)
export function ThankYouBanner() {
  const { subscription, isSupporter } = useSubscription();
  
  if (!isSupporter) return null;
  
  const features = tierFeatures[subscription.tier];
  if (!features || !features.badgeColor) return null;
  
  return (
    <div className={`p-4 rounded-xl bg-gradient-to-r ${features.badgeColor} border`}>
      <div className="flex items-center gap-3">
        <span className="text-2xl">💜</span>
        <div>
          <p className="font-medium">{features.thankYouMessage}</p>
          <p className="text-sm opacity-80">Your support keeps NYTM Tools free for everyone.</p>
        </div>
      </div>
    </div>
  );
}

// Support CTA Banner (show to free users)
export function SupportBanner({ compact = false }: { compact?: boolean }) {
  const { isSupporter } = useSubscription();
  
  if (isSupporter) return null;
  
  if (compact) {
    return (
      <Link 
        href="/pricing"
        className="flex items-center gap-2 p-3 rounded-xl bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 hover:border-violet-500/40 transition-all group"
      >
        <span className="text-lg">💜</span>
        <span className="text-sm">Love NYTM Tools? <span className="font-medium text-violet-400 group-hover:text-violet-300">Support us →</span></span>
      </Link>
    );
  }
  
  return (
    <div className="p-6 rounded-xl bg-gradient-to-br from-violet-500/10 via-purple-500/10 to-pink-500/10 border border-violet-500/20">
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="text-4xl">💜</div>
        <div className="flex-1 text-center md:text-left">
          <h3 className="font-semibold text-lg mb-1">Enjoying NYTM Tools?</h3>
          <p className="text-sm text-[var(--muted-foreground)]">
            Support indie development and get an ad-free experience with a cool badge!
          </p>
        </div>
        <Link
          href="/pricing"
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-medium hover:opacity-90 transition-all whitespace-nowrap"
        >
          Support Us ✨
        </Link>
      </div>
    </div>
  );
}

// Subscription Status Bar (for header) - Simplified
export function SubscriptionStatusBar() {
  const { subscription, isSupporter } = useSubscription();

  if (isSupporter) {
    return <SupporterBadge />;
  }

  return (
    <Link 
      href="/pricing"
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--muted)] hover:bg-violet-500/20 transition-colors group text-sm"
    >
      <span>💜</span>
      <span className="text-[var(--muted-foreground)] group-hover:text-violet-400">Support</span>
    </Link>
  );
}

// Remove unused components - keeping file cleaner
export function UsageLimitWarning() {
  // No usage limits anymore - return null
  return null;
}
