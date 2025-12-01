"use client";

import { useState } from "react";
import Link from "next/link";
import { pricingPlans, useSubscription, SubscriptionTier, tierFeatures } from "@/lib/subscription-context";
import { SupporterBadge } from "@/components/Paywall";

export default function PricingPage() {
  const { subscription, setSubscription, isSupporter } = useSubscription();
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier | null>(null);

  const handleSupport = (tier: SubscriptionTier) => {
    // In production, this would redirect to payment processor (Stripe, etc.)
    // For demo, we'll just set the subscription
    setSelectedTier(tier);
  };

  const confirmSupport = () => {
    if (selectedTier) {
      setSubscription({
        tier: selectedTier,
        isActive: true,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        features: tierFeatures[selectedTier],
      });
      setSelectedTier(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-16 px-4">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
          Support Indie Development
        </div>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
          Keep NYTM Tools <span className="gradient-text">Free Forever</span>
        </h1>
        <p className="text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
          All tools are completely free with unlimited usage. Support us to remove ads, 
          get a cool badge, and help us build more awesome tools!
        </p>
      </div>

      {/* Current Status */}
      {isSupporter && (
        <div className="mb-12 p-8 rounded-3xl bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-pink-500/10 border border-violet-500/20 text-center">
          <div className="flex items-center justify-center gap-4 mb-3">
            <span className="text-3xl">💜</span>
            <SupporterBadge tier={subscription.tier} className="text-base px-5 py-2" />
          </div>
          <p className="text-lg text-[var(--muted-foreground)]">
            {tierFeatures[subscription.tier]?.thankYouMessage || "Thank you for your support!"}
          </p>
        </div>
      )}

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-20">
        {pricingPlans.map((plan, index) => {
          const isCurrentPlan = subscription.tier === plan.tier;
          
          return (
            <div
              key={plan.tier}
              className={`relative group rounded-3xl border transition-all duration-500 overflow-hidden ${
                plan.highlighted
                  ? "bg-gradient-to-b from-violet-500/10 via-purple-500/5 to-transparent border-violet-500/30 lg:scale-105 lg:-my-2"
                  : "bg-[var(--card)] border-[var(--border)] hover:border-violet-500/30"
              } ${isCurrentPlan ? "ring-2 ring-violet-500 ring-offset-2 ring-offset-[var(--background)]" : ""}`}
            >
              {/* Glow effect */}
              {plan.highlighted && (
                <div className="absolute inset-0 bg-gradient-to-b from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              )}
              
              {plan.highlighted && (
                <div className="absolute -top-px left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
              )}
              
              {plan.highlighted && (
                <div className="absolute top-4 left-1/2 -translate-x-1/2">
                  <span className="px-4 py-1.5 rounded-full bg-gradient-to-r from-violet-500 to-purple-600 text-white text-xs font-semibold shadow-lg shadow-violet-500/30">
                    Most Popular
                  </span>
                </div>
              )}
              
              {isCurrentPlan && (
                <div className="absolute top-4 right-4">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-medium border border-emerald-500/30">
                    Current
                  </span>
                </div>
              )}

              <div className={`relative p-6 ${plan.highlighted ? "pt-14" : ""}`}>
                <div className="text-center mb-6">
                  <span className="text-5xl mb-3 block">{plan.emoji}</span>
                  <h3 className="text-xl font-bold mb-1 tracking-tight">{plan.name}</h3>
                  <p className="text-sm text-[var(--muted-foreground)]">{plan.description}</p>
                </div>

                <div className="text-center mb-8">
                  <span className="text-5xl font-bold tracking-tight">
                    {plan.price === 0 ? "Free" : `$${plan.price}`}
                  </span>
                  {plan.price > 0 && (
                    <span className="text-[var(--muted-foreground)] text-lg">/mo</span>
                  )}
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm">
                      <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-emerald-400 text-xs">✓</span>
                      </span>
                      <span className="text-[var(--muted-foreground)]">{feature}</span>
                    </li>
                  ))}
                </ul>

                {plan.tier === "free" ? (
                  <div className="text-center py-3.5 rounded-xl bg-[var(--muted)] text-[var(--muted-foreground)] text-sm font-medium">
                    Always Free
                  </div>
                ) : isCurrentPlan ? (
                  <div className="text-center py-3.5 rounded-xl bg-emerald-500/20 text-emerald-400 text-sm font-semibold">
                    You&apos;re a {plan.name}! 💜
                  </div>
                ) : (
                  <button
                    onClick={() => handleSupport(plan.tier)}
                    className={`w-full py-3.5 rounded-xl font-semibold transition-all duration-300 ${
                      plan.highlighted
                        ? "bg-gradient-to-r from-violet-500 to-purple-600 text-white shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5"
                        : "bg-[var(--muted)] hover:bg-violet-500/10 text-[var(--foreground)] border border-[var(--border)] hover:border-violet-500/30"
                    }`}
                  >
                    Support with ${plan.price}/mo
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* FAQ Section */}
      <div className="border-t border-[var(--border)] pt-16">
        <div className="text-center mb-12">
          <span className="text-xs font-mono text-violet-400 tracking-widest uppercase">FAQ</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 tracking-tight">Questions? We&apos;ve got answers</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4 max-w-4xl mx-auto">
          {[
            {
              q: "Is everything really free?",
              a: "Yes! All 130+ tools are completely free with unlimited usage. No limits, no restrictions, no catch.",
            },
            {
              q: "Why should I support?",
              a: "Your support helps us keep the site running, build new tools, and stay ad-free for supporters. Plus you get a cool badge!",
            },
            {
              q: "Can I cancel anytime?",
              a: "Absolutely! You can cancel your support anytime. You'll keep your benefits until the end of the billing period.",
            },
            {
              q: "What payment methods?",
              a: "We accept all major credit cards, PayPal, and crypto through our secure payment processor.",
            },
          ].map((faq, i) => (
            <div 
              key={i} 
              className="group rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 hover:border-violet-500/30 transition-all duration-300"
            >
              <h3 className="font-semibold mb-2 tracking-tight group-hover:text-violet-400 transition-colors">{faq.q}</h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-20 text-center">
        <div className="relative rounded-3xl bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-pink-500/10 border border-violet-500/20 p-12 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2" />
          <div className="relative">
            <h3 className="text-3xl font-bold mb-3 tracking-tight">Every bit helps! 💜</h3>
            <p className="text-lg text-[var(--muted-foreground)] mb-8 max-w-lg mx-auto">
              Even if you can&apos;t support financially, sharing NYTM Tools with friends helps us grow!
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[var(--muted)] border border-[var(--border)] hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-300 font-semibold"
            >
              Back to Tools
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </div>

      {/* Demo Modal */}
      {selectedTier && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="relative bg-[var(--card)] rounded-3xl border border-[var(--border)] p-10 max-w-md w-full text-center overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2" />
            <div className="relative">
              <div className="text-6xl mb-6">
                {pricingPlans.find(p => p.tier === selectedTier)?.emoji}
              </div>
              <h3 className="text-2xl font-bold mb-3 tracking-tight">
                Become a {pricingPlans.find(p => p.tier === selectedTier)?.name}!
              </h3>
              <p className="text-[var(--muted-foreground)] mb-8">
                In production, this would redirect to Stripe/PayPal. For demo, click confirm to activate.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedTier(null)}
                  className="flex-1 py-3.5 rounded-xl border border-[var(--border)] hover:bg-[var(--muted)] transition-colors font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmSupport}
                  className="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all"
                >
                  Confirm (Demo)
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
