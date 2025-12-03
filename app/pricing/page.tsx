"use client";

import { useEffect } from "react";
import Link from "next/link";
import { HeartIcon, CheckIcon } from "@/assets/icons";
import { TOTAL_TOOLS, getToolsNoLimits, getAllToolsIncluded } from "@/lib/site-config";

// Donation URL from environment variable (fallback to empty)
const DONATION_URL = process.env.NEXT_PUBLIC_DONATION_URL || "";

// SVG Icons for this page
function FreeIcon({ className = "w-12 h-12" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
    </svg>
  );
}

function DonateIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  );
}

function UserIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
  );
}

function WalletIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a2.25 2.25 0 00-2.25-2.25H15a3 3 0 11-6 0H5.25A2.25 2.25 0 003 12m18 0v6a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18v-6m18 0V9M3 12V9m18 0a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 9m18 0V6a2.25 2.25 0 00-2.25-2.25H5.25A2.25 2.25 0 003 6v3" />
    </svg>
  );
}

function ShieldExclamationIcon({ className = "w-5 h-5" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
    </svg>
  );
}

export default function PricingPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "instant" });
  }, []);

  return (
    <div className="max-w-5xl mx-auto py-8 sm:py-12 md:py-16 px-3 sm:px-4">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
          NYTM is <span className="gradient-text">Free. Forever.</span>
        </h1>
        <p className="text-lg text-[var(--muted-foreground)] max-w-xl mx-auto">
          {getToolsNoLimits()}
        </p>
      </div>

      {/* Side by Side Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-12">
        {/* Free Card */}
        <div className="rounded-2xl border border-violet-500/30 bg-gradient-to-b from-violet-500/10 to-transparent p-8 relative overflow-hidden h-full">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-violet-500 to-transparent" />
          
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-violet-500/10 text-violet-400 mb-3">
              <FreeIcon className="w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold">Everything Included</h2>
            <p className="text-[var(--muted-foreground)] mt-1">No tiers. No upsells.</p>
          </div>

          <div className="text-center mb-6">
            <span className="text-5xl font-bold">$0</span>
            <span className="text-[var(--muted-foreground)]"> / forever</span>
          </div>

          <ul className="space-y-3 mb-8">
            {[
              getAllToolsIncluded(),
              "Unlimited usage",
              "No ads, ever",
              "No account required",
              "No tracking cookies",
              "Client-side processing",
              "Dark mode",
              "Mobile friendly",
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-sm">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <CheckIcon className="w-3 h-3 text-emerald-400" />
                </span>
                <span className="text-[var(--muted-foreground)]">{feature}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/tools"
            className="block w-full py-3 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-center font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 hover:-translate-y-0.5 transition-all duration-300"
          >
            Start Using Tools
          </Link>
        </div>

        {/* Donation Card */}
        <div className="rounded-2xl border border-pink-500/30 bg-gradient-to-b from-pink-500/5 to-transparent p-8 relative overflow-hidden h-full">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-pink-500 to-transparent" />
          
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-pink-500/10 text-pink-400 mb-3">
              <HeartIcon className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold">Support NYTM</h2>
            <p className="text-[var(--muted-foreground)] mt-1">Help keep it running</p>
          </div>

          <div className="text-center mb-6">
            <span className="text-5xl font-bold">Any</span>
            <span className="text-[var(--muted-foreground)]"> amount</span>
          </div>

          <ul className="space-y-3 mb-8">
            {[
              "Support hosting costs",
              "Motivate development",
              "Keep NYTM ad-free",
              "No rewards or perks",
              "100% voluntary",
              "Processed by third-party",
              "Non-refundable",
              "Not tax-deductible",
            ].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-sm">
                <span className="w-5 h-5 rounded-full bg-pink-500/20 flex items-center justify-center flex-shrink-0">
                  <CheckIcon className="w-3 h-3 text-pink-400" />
                </span>
                <span className="text-[var(--muted-foreground)]">{feature}</span>
              </li>
            ))}
          </ul>

          {DONATION_URL ? (
            <a
              href={DONATION_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:-translate-y-0.5 transition-all duration-300"
            >
              <DonateIcon className="w-5 h-5" />
              Donate Now
            </a>
          ) : (
            <a
              href="mailto:hello@nytm.in?subject=NYTM Donation Inquiry"
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-semibold shadow-lg shadow-pink-500/25 hover:shadow-pink-500/40 hover:-translate-y-0.5 transition-all duration-300"
            >
              <DonateIcon className="w-5 h-5" />
              Contact to Donate
            </a>
          )}
        </div>
      </div>

      {/* Why Free */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-8 mb-8">
        <h3 className="font-bold text-xl mb-4 text-center">Why is NYTM free?</h3>
        <div className="grid sm:grid-cols-2 gap-4 text-sm text-[var(--muted-foreground)]">
          <div className="p-4 rounded-xl bg-[var(--muted)]">
            <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center text-pink-400 mb-2">
              <HeartIcon className="w-5 h-5" />
            </div>
            <strong className="text-[var(--foreground)]">Donation-funded</strong>
            <p className="mt-1">NYTM runs on voluntary donations from users who find it useful.</p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--muted)]">
            <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center text-violet-400 mb-2">
              <UserIcon className="w-5 h-5" />
            </div>
            <strong className="text-[var(--foreground)]">Self-funded by owner</strong>
            <p className="mt-1">When donations don't cover costs, Nityam Sheth funds it personally.</p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--muted)]">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 mb-2">
              <WalletIcon className="w-5 h-5" />
            </div>
            <strong className="text-[var(--foreground)]">Minimal costs</strong>
            <p className="mt-1">Tools run in your browser, so server costs are minimal.</p>
          </div>
          <div className="p-4 rounded-xl bg-[var(--muted)]">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 mb-2">
              <ShieldExclamationIcon className="w-5 h-5" />
            </div>
            <strong className="text-[var(--foreground)]">No liability assumed</strong>
            <p className="mt-1">Provided as-is. No warranties. See disclaimer below.</p>
          </div>
        </div>
      </div>

      {/* Liability Disclaimer */}
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-6 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
            <ShieldExclamationIcon className="w-5 h-5 text-amber-400" />
          </div>
          <div className="space-y-3 text-sm text-[var(--muted-foreground)]">
            <h4 className="font-bold text-[var(--foreground)]">Disclaimer & Liability Notice</h4>
            <ul className="space-y-2">
              <li><strong className="text-[var(--foreground)]">NYTM</strong> is a project name only, not a registered organization, company, or legal entity.</li>
              <li><strong className="text-[var(--foreground)]">Nityam Sheth</strong> (the owner/operator) is not liable for any damages, losses, or issues arising from use of this service.</li>
              <li>All tools are provided <strong className="text-[var(--foreground)]">"AS IS"</strong> without warranty of any kind, express or implied.</li>
              <li>Third-party services used (including but not limited to payment processors, DNS providers, domain registrars, hosting services, and analytics) are independent entities. NYTM and its owner assume no liability for their actions, policies, or service interruptions.</li>
              <li>Donations are voluntary, non-refundable, and do not constitute payment for goods or services.</li>
              <li>By using NYTM, you agree that neither the project, its owner, contributors, nor any affiliated third-party services shall be held liable for any claim, damage, or loss.</li>
            </ul>
            <p className="text-xs pt-2 border-t border-amber-500/20">
              For full terms, see our <Link href="/terms" className="text-amber-400 hover:underline">Terms of Service</Link> and <Link href="/privacy" className="text-amber-400 hover:underline">Privacy Policy</Link>.
            </p>
          </div>
        </div>
      </div>

      {/* Back link */}
      <div className="text-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--muted)] border border-[var(--border)] hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-300 font-medium"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
