import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - NYTM MULTITOOLS",
  description: "Privacy Policy for NYTM MULTITOOLS - Learn how we handle your data.",
};

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
          Your privacy matters
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
          Privacy <span className="gradient-text">Policy</span>
        </h1>
        <p className="text-lg text-[var(--muted-foreground)]">
          Last updated: December 2, 2025
        </p>
      </div>

      {/* TL;DR Box */}
      <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/5 p-6 mb-8">
        <h3 className="font-bold text-lg mb-2 text-emerald-400">TL;DR</h3>
        <p className="text-[var(--muted-foreground)]">
          All tools run in your browser. Your data never leaves your device. We don't track you. We don't sell data. We don't use cookies for tracking.
        </p>
      </div>

      {/* Content Card */}
      <div className="relative rounded-3xl bg-[var(--card)] border border-[var(--border)] p-8 md:p-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative space-y-12">
          
          <section className="group">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center text-lg font-bold text-violet-400 flex-shrink-0">1</div>
              <div>
                <h2 className="text-xl font-bold mb-4 tracking-tight group-hover:text-violet-400 transition-colors">Introduction</h2>
                <p className="text-[var(--muted-foreground)] leading-relaxed">
                  NYTM MULTITOOLS ("we," "our," or "us"), operated by Nityam Sheth, is committed to protecting your privacy. 
                  This Privacy Policy explains what information we collect (spoiler: almost nothing) and how we handle it.
                </p>
              </div>
            </div>
          </section>

          <section className="group">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center text-lg font-bold text-violet-400 flex-shrink-0">2</div>
              <div>
                <h2 className="text-xl font-bold mb-4 tracking-tight group-hover:text-violet-400 transition-colors">Data We DO NOT Collect</h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                    <p className="text-[var(--foreground)] font-medium mb-1">🔒 Your Tool Data</p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      <strong>All 135 tools process data entirely in your browser.</strong> Text, images, code, and any other content you input is processed locally on your device. It never touches our servers. We cannot see it. We do not store it.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                    <p className="text-[var(--foreground)] font-medium mb-1">🚫 Personal Information</p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      We do not require accounts, sign-ups, or registration. We do not collect names, emails, phone numbers, or any personally identifiable information.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="group">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center text-lg font-bold text-violet-400 flex-shrink-0">3</div>
              <div>
                <h2 className="text-xl font-bold mb-4 tracking-tight group-hover:text-violet-400 transition-colors">Analytics (Optional)</h2>
                <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">
                  We may use privacy-respecting analytics to understand basic usage patterns:
                </p>
                <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                  <p className="text-[var(--foreground)] font-medium mb-2">📊 What we might collect:</p>
                  <ul className="grid grid-cols-2 gap-2 text-sm text-[var(--muted-foreground)]">
                    <li className="flex items-center gap-2"><span className="text-violet-400">◈</span> Page views (anonymous)</li>
                    <li className="flex items-center gap-2"><span className="text-violet-400">◈</span> Country (not city)</li>
                    <li className="flex items-center gap-2"><span className="text-violet-400">◈</span> Browser type</li>
                    <li className="flex items-center gap-2"><span className="text-violet-400">◈</span> Device type</li>
                  </ul>
                  <p className="text-xs text-[var(--muted-foreground)] mt-3">
                    Analytics are processed by PostHog (EU-hosted, privacy-focused). No personal identifiers are collected.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="group">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center text-lg font-bold text-violet-400 flex-shrink-0">4</div>
              <div>
                <h2 className="text-xl font-bold mb-4 tracking-tight group-hover:text-violet-400 transition-colors">Cookies</h2>
                <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">
                  We use minimal cookies for essential functionality only:
                </p>
                <ul className="space-y-2 text-[var(--muted-foreground)]">
                  <li className="flex items-start gap-3"><span className="text-emerald-400 mt-1">✓</span> Theme preference (dark/light mode)</li>
                  <li className="flex items-start gap-3"><span className="text-red-400 mt-1">✗</span> No tracking cookies</li>
                  <li className="flex items-start gap-3"><span className="text-red-400 mt-1">✗</span> No advertising cookies</li>
                  <li className="flex items-start gap-3"><span className="text-red-400 mt-1">✗</span> No third-party cookies</li>
                </ul>
              </div>
            </div>
          </section>

          <section className="group">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center text-lg font-bold text-violet-400 flex-shrink-0">5</div>
              <div>
                <h2 className="text-xl font-bold mb-4 tracking-tight group-hover:text-violet-400 transition-colors">Third-Party Services</h2>
                <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">
                  We do not use advertising networks, social media trackers, or data brokers. 
                  Here's our complete third-party disclosure:
                </p>
                <div className="space-y-3">
                  <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                    <p className="text-[var(--foreground)] font-medium mb-1">Analytics (Optional)</p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      PostHog (EU-hosted, privacy-focused) for anonymous usage statistics. No personal identifiers.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                    <p className="text-[var(--foreground)] font-medium mb-1">IP Lookup Tool Only</p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Uses ipinfo.io API. This is the <strong>only tool</strong> that makes external API calls. Clearly disclosed on the tool page.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                    <p className="text-[var(--foreground)] font-medium mb-1">Fonts & Icons</p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Fonts (Inter, JetBrains Mono) are self-hosted via Next.js — bundled at build time, served from our servers. 
                      All icons are inline SVG. <strong>No external font CDNs or icon services.</strong>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="group">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center text-lg font-bold text-violet-400 flex-shrink-0">6</div>
              <div>
                <h2 className="text-xl font-bold mb-4 tracking-tight group-hover:text-violet-400 transition-colors">Third-Party Service Liability</h2>
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 mb-4">
                  <p className="text-[var(--foreground)] font-medium mb-2">⚠️ Important Disclosure</p>
                  <p className="text-sm text-[var(--muted-foreground)] mb-3">
                    NYTM uses third-party services that have their own privacy policies and terms:
                  </p>
                  <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                    <li className="flex items-start gap-2"><span className="text-amber-400">•</span> <strong>Payment processors</strong> (e.g., Razorpay) — for donations</li>
                    <li className="flex items-start gap-2"><span className="text-amber-400">•</span> <strong>DNS/CDN</strong> (e.g., Cloudflare) — for site delivery</li>
                    <li className="flex items-start gap-2"><span className="text-amber-400">•</span> <strong>Analytics</strong> (e.g., PostHog) — for anonymous usage stats</li>
                    <li className="flex items-start gap-2"><span className="text-amber-400">•</span> <strong>Hosting & Domain</strong> — for infrastructure</li>
                  </ul>
                  <p className="text-xs text-[var(--muted-foreground)] mt-3 pt-3 border-t border-amber-500/20">
                    NYTM and its owner (Nityam Sheth) are not liable for the data practices, policies, or actions of these third-party services.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="group">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center text-lg font-bold text-violet-400 flex-shrink-0">7</div>
              <div>
                <h2 className="text-xl font-bold mb-4 tracking-tight group-hover:text-violet-400 transition-colors">Data Security</h2>
                <p className="text-[var(--muted-foreground)] leading-relaxed">
                  Since we don't collect personal data, there's minimal risk. The site is served 
                  over HTTPS. All tool processing happens client-side. We implement security best 
                  practices for the minimal infrastructure we maintain.
                </p>
              </div>
            </div>
          </section>

          <section className="group">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center text-lg font-bold text-violet-400 flex-shrink-0">8</div>
              <div>
                <h2 className="text-xl font-bold mb-4 tracking-tight group-hover:text-violet-400 transition-colors">Children's Privacy</h2>
                <p className="text-[var(--muted-foreground)] leading-relaxed">
                  Our Service is not directed to children under 13. We do not knowingly collect 
                  information from children. Since we don't collect personal data from anyone, 
                  this is naturally compliant.
                </p>
              </div>
            </div>
          </section>

          <section className="group">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center text-lg font-bold text-violet-400 flex-shrink-0">9</div>
              <div>
                <h2 className="text-xl font-bold mb-4 tracking-tight group-hover:text-violet-400 transition-colors">Changes to This Policy</h2>
                <p className="text-[var(--muted-foreground)] leading-relaxed">
                  We may update this Privacy Policy occasionally. Changes will be posted on this 
                  page with an updated date. Significant changes will be noted prominently.
                </p>
              </div>
            </div>
          </section>

          <section className="group">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center text-lg font-bold text-violet-400 flex-shrink-0">10</div>
              <div>
                <h2 className="text-xl font-bold mb-4 tracking-tight group-hover:text-violet-400 transition-colors">Contact</h2>
                <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">
                  Questions about this Privacy Policy? Contact us:
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-[var(--muted-foreground)]"><strong className="text-[var(--foreground)]">Owner:</strong> Nityam Sheth</p>
                  <div className="flex flex-wrap gap-2">
                    <a 
                      href="mailto:hello@nytm.in" 
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500/20 transition-colors font-medium"
                    >
                      <span>📧</span>
                      hello@nytm.in
                    </a>
                    <a 
                      href="mailto:hello@nsheth.in" 
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500/20 transition-colors font-medium"
                    >
                      <span>📧</span>
                      hello@nsheth.in
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
