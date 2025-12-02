import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = generatePageMetadata("privacy");

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 sm:py-12 md:py-16 px-3 sm:px-4">
      <ScrollToTop />
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
                    <p className="text-[var(--foreground)] font-medium mb-1 flex items-center gap-2">
                      <svg className="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                      </svg>
                      Your Tool Data
                    </p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      <strong>All 136 tools process data entirely in your browser.</strong> Text, images, code, and any other content you input is processed locally on your device. It never touches our servers. We cannot see it. We do not store it.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                    <p className="text-[var(--foreground)] font-medium mb-1 flex items-center gap-2">
                      <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                      Personal Information
                    </p>
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
                  <p className="text-[var(--foreground)] font-medium mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                    </svg>
                    What we might collect:
                  </p>
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
                  <li className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-emerald-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                    </svg>
                    Theme preference (dark/light mode)
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    No tracking cookies
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    No advertising cookies
                  </li>
                  <li className="flex items-start gap-3">
                    <svg className="w-4 h-4 text-red-400 mt-1 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                    No third-party cookies
                  </li>
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
                    <p className="text-[var(--foreground)] font-medium mb-1">IP Lookup Tool</p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Uses ipinfo.io API. Your IP address is sent to ipinfo.io servers for geolocation lookup.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20">
                    <p className="text-[var(--foreground)] font-medium mb-1">Text to Speech Tool</p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Downloads AI voice model (~100MB) from Hugging Face on first use. After download, all processing is local. No text or audio is sent externally.
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
                  <p className="text-[var(--foreground)] font-medium mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-amber-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                    </svg>
                    Important Disclosure
                  </p>
                  <p className="text-sm text-[var(--muted-foreground)] mb-3">
                    NYTM uses third-party services that have their own privacy policies and terms:
                  </p>
                  <ul className="space-y-2 text-sm text-[var(--muted-foreground)]">
                    <li className="flex items-start gap-2"><span className="text-amber-400">•</span> <strong>Payment processors</strong> (e.g., Razorpay) — for donations</li>
                    <li className="flex items-start gap-2"><span className="text-amber-400">•</span> <strong>DNS/CDN</strong> (e.g., Cloudflare) — for site delivery</li>
                    <li className="flex items-start gap-2"><span className="text-amber-400">•</span> <strong>Analytics</strong> (e.g., PostHog) — for anonymous usage stats</li>
                    <li className="flex items-start gap-2"><span className="text-amber-400">•</span> <strong>Model hosting</strong> (e.g., Hugging Face) — for AI model downloads</li>
                    <li className="flex items-start gap-2"><span className="text-amber-400">•</span> <strong>IP Geolocation</strong> (e.g., ipinfo.io) — for IP lookup tool</li>
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
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
                      hello@nytm.in
                    </a>
                    <a 
                      href="mailto:hello@nsheth.in" 
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500/20 transition-colors font-medium"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                      </svg>
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
