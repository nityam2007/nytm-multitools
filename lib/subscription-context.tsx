"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from "react";

// Subscription Tiers - Donation based
export type SubscriptionTier = "free" | "supporter" | "champion" | "legend";

export interface SubscriptionFeatures {
  adsEnabled: boolean;
  badge: string;
  badgeColor: string;
  thankYouMessage: string;
}

export interface UserSubscription {
  tier: SubscriptionTier;
  isActive: boolean;
  expiresAt: Date | null;
  features: SubscriptionFeatures;
}

// Feature configuration for each tier
export const tierFeatures: Record<SubscriptionTier, SubscriptionFeatures> = {
  free: {
    adsEnabled: true,
    badge: "",
    badgeColor: "",
    thankYouMessage: "",
  },
  supporter: {
    adsEnabled: false,
    badge: "⭐ Supporter",
    badgeColor: "from-blue-500/20 to-cyan-500/20 border-blue-500/30 text-blue-400",
    thankYouMessage: "Thank you for supporting NYTM Tools!",
  },
  champion: {
    adsEnabled: false,
    badge: "💎 Champion",
    badgeColor: "from-purple-500/20 to-pink-500/20 border-purple-500/30 text-purple-400",
    thankYouMessage: "You're amazing! Thank you for being a Champion!",
  },
  legend: {
    adsEnabled: false,
    badge: "🔥 Legend",
    badgeColor: "from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-400",
    thankYouMessage: "Legendary support! You're helping us build something great!",
  },
};

// Pricing information - Donation tiers
export interface PricingPlan {
  tier: SubscriptionTier;
  name: string;
  price: number;
  billingPeriod: "monthly" | "yearly" | "one-time";
  description: string;
  features: string[];
  highlighted?: boolean;
  emoji: string;
}

export const pricingPlans: PricingPlan[] = [
  {
    tier: "free",
    name: "Free",
    price: 0,
    billingPeriod: "monthly",
    emoji: "🆓",
    description: "Full access, forever free",
    features: [
      "Access to all 130+ tools",
      "Unlimited usage",
      "No registration required",
      "Community support",
    ],
  },
  {
    tier: "supporter",
    name: "Supporter",
    price: 3,
    billingPeriod: "monthly",
    emoji: "⭐",
    description: "Support our mission",
    features: [
      "Everything in Free",
      "No advertisements",
      "⭐ Supporter badge",
      "Support indie development",
      "Good karma points ✨",
    ],
  },
  {
    tier: "champion",
    name: "Champion",
    price: 7,
    billingPeriod: "monthly",
    emoji: "💎",
    description: "Champion the cause",
    features: [
      "Everything in Supporter",
      "💎 Champion badge",
      "Early access to new tools",
      "Priority feature requests",
      "Extra good karma points ✨✨",
    ],
    highlighted: true,
  },
  {
    tier: "legend",
    name: "Legend",
    price: 15,
    billingPeriod: "monthly",
    emoji: "🔥",
    description: "Become a legend",
    features: [
      "Everything in Champion",
      "🔥 Legend badge",
      "Name in credits page",
      "Direct Discord access",
      "Maximum karma points ✨✨✨",
    ],
  },
];

// Context
interface SubscriptionContextType {
  subscription: UserSubscription;
  isSupporter: boolean;
  setSubscription: (sub: UserSubscription) => void;
  features: SubscriptionFeatures;
}

const defaultSubscription: UserSubscription = {
  tier: "free",
  isActive: true,
  expiresAt: null,
  features: tierFeatures.free,
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// Storage keys
const SUBSCRIPTION_KEY = "nytm-subscription";

// Provider Component
export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const [subscription, setSubscriptionState] = useState<UserSubscription>(defaultSubscription);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Load subscription from storage
    const storedSub = localStorage.getItem(SUBSCRIPTION_KEY);
    if (storedSub) {
      try {
        const parsed = JSON.parse(storedSub);
        // Check if subscription is still valid
        if (parsed.expiresAt && new Date(parsed.expiresAt) < new Date()) {
          // Subscription expired, revert to free
          setSubscriptionState(defaultSubscription);
          localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(defaultSubscription));
        } else {
          setSubscriptionState({
            ...parsed,
            features: tierFeatures[parsed.tier as SubscriptionTier],
          });
        }
      } catch {
        setSubscriptionState(defaultSubscription);
      }
    }
  }, []);

  const setSubscription = (sub: UserSubscription) => {
    const fullSub = {
      ...sub,
      features: tierFeatures[sub.tier],
    };
    setSubscriptionState(fullSub);
    localStorage.setItem(SUBSCRIPTION_KEY, JSON.stringify(fullSub));
  };

  const isSupporter = subscription.tier !== "free" && subscription.isActive;

  const features = subscription.features;

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        isSupporter,
        setSubscription,
        features,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  );
}

// Hook
export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error("useSubscription must be used within a SubscriptionProvider");
  }
  return context;
}

// Helper to check if user is a supporter
export function hasSupport(subscription: UserSubscription): boolean {
  return subscription.tier !== "free" && subscription.isActive;
}
