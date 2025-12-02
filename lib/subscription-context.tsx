"use client";

import { createContext, useContext, ReactNode } from "react";

// Simplified - everything is free, no tiers needed
export type SubscriptionTier = "free";

export interface SubscriptionFeatures {
  adsEnabled: boolean;
}

export interface UserSubscription {
  tier: SubscriptionTier;
  isActive: boolean;
  features: SubscriptionFeatures;
}

// Simple feature config - no ads, ever
export const tierFeatures: Record<SubscriptionTier, SubscriptionFeatures> = {
  free: {
    adsEnabled: false,
  },
};

// Context
interface SubscriptionContextType {
  subscription: UserSubscription;
  isSupporter: boolean;
  features: SubscriptionFeatures;
}

const defaultSubscription: UserSubscription = {
  tier: "free",
  isActive: true,
  features: tierFeatures.free,
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

// Provider Component - simplified, no localStorage needed
export function SubscriptionProvider({ children }: { children: ReactNode }) {
  return (
    <SubscriptionContext.Provider
      value={{
        subscription: defaultSubscription,
        isSupporter: false,
        features: tierFeatures.free,
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
