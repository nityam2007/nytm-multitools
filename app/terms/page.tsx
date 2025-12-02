import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata("terms");

const sections = [
  {
    title: "Acceptance of Terms",
    content: "By accessing and using NYTM MULTITOOLS (\"the Service\"), you acknowledge that you have read, understood, and agree to be bound by these Terms of Service. If you do not agree to these terms, you must discontinue use of the Service immediately.",
  },
  {
    title: "Description of Service",
    content: "NYTM MULTITOOLS provides a collection of free online utilities including text manipulation, image editing, code formatting, data conversion, and other developer tools. The Service is provided \"as is\" and \"as available\" without warranties of any kind, express or implied.",
  },
  {
    title: "Intellectual Property",
    content: "The Service, including all source code, design, graphics, and functionality, is the proprietary property of Nityam Sheth and is protected under the NYTM Source Available License (NSAL) v1.0. The source code is publicly viewable but NOT open source. Copying, modification, distribution, or commercial use is strictly prohibited. Content you create using our tools remains your property.",
  },
  {
    title: "Data Processing",
    content: "All tools process data locally in your browser. We do not store, transmit, or have access to the content you process through our tools. Your data never leaves your device.",
    link: { href: "/privacy", text: "Privacy Policy" },
  },
  {
    title: "Disclaimer of Warranties",
    content: "THE SERVICE IS PROVIDED \"AS IS\" AND \"AS AVAILABLE\" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. NITYAM SHETH DOES NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE, OR THAT DEFECTS WILL BE CORRECTED.",
    isWarning: true,
  },
  {
    title: "Limitation of Liability",
    content: "IN NO EVENT SHALL NITYAM SHETH OR NYTM BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING BUT NOT LIMITED TO LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR RELATING TO YOUR USE OF THE SERVICE. TOTAL LIABILITY SHALL NOT EXCEED ONE HUNDRED UNITED STATES DOLLARS (USD $100.00).",
    isWarning: true,
  },
  {
    title: "Nature of NYTM",
    content: "NYTM is a project name only. It is NOT a registered organization, company, corporation, or legal entity of any kind. NYTM is a personal project operated by Nityam Sheth as an individual.",
    isWarning: true,
  },
  {
    title: "Third-Party Services",
    content: "NYTM uses third-party services including but not limited to: payment processors (e.g., Razorpay), DNS providers (e.g., Cloudflare), analytics services (e.g., PostHog), hosting platforms, and domain registrars. These are independent entities. NYTM AND ITS OWNER ASSUME NO LIABILITY FOR THE ACTIONS, POLICIES, DATA HANDLING, SERVICE INTERRUPTIONS, OR ANY OTHER ASPECTS OF THESE THIRD-PARTY SERVICES. By using NYTM, you acknowledge that interactions with these services are subject to their respective terms and privacy policies.",
    isWarning: true,
  },
  {
    title: "Donations",
    content: "Donations to NYTM are entirely voluntary, non-refundable, and do not constitute payment for goods or services. Donations do not grant any special access, features, or privileges. Donations are not tax-deductible. The owner is not obligated to use donations in any particular way.",
  },
  {
    title: "Service Modifications",
    content: "We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any time without prior notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuation of the Service.",
  },
  {
    title: "No Premium Services",
    content: "NYTM MULTITOOLS is and will remain completely free. There are no premium tiers, paid features, or subscription plans. All 136 tools are available to everyone without restriction.",
  },
  {
    title: "Termination",
    content: "We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, including breach of these Terms. Upon termination, your right to use the Service will cease immediately.",
  },
  {
    title: "Governing Law",
    content: "These Terms shall be governed by and construed in accordance with applicable laws of the jurisdiction in which the Service owner is domiciled, without regard to conflict of law principles.",
  },
  {
    title: "Changes to Terms",
    content: "We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the Service after changes constitutes acceptance of the revised Terms.",
  },
];

const prohibitedActions = [
  "Using the Service for any illegal or unauthorized purpose",
  "Attempting to interfere with or disrupt the Service",
  "Uploading malicious code, viruses, or harmful content",
  "Attempting to gain unauthorized access to our systems",
  "Using automated tools to scrape or overload the Service",
  "Copying or redistributing the source code",
  "Creating derivative works based on the Service",
  "Using the Service for commercial purposes without authorization",
];

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto py-16 px-4">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
          Legal information
        </div>
        <h1 className="text-5xl md:text-6xl font-bold mb-6 tracking-tight">
          Terms of <span className="gradient-text">Service</span>
        </h1>
        <p className="text-lg text-[var(--muted-foreground)]">
          Last updated: December 1, 2025
        </p>
      </div>

      {/* Content Card */}
      <div className="relative rounded-3xl bg-[var(--card)] border border-[var(--border)] p-8 md:p-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative space-y-10">
          
          {/* Section 1 & 2 */}
          {sections.slice(0, 2).map((section, i) => (
            <section key={i} className="group">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center text-lg font-bold text-violet-400 flex-shrink-0">{i + 1}</div>
                <div>
                  <h2 className="text-xl font-bold mb-4 tracking-tight group-hover:text-violet-400 transition-colors">{section.title}</h2>
                  <p className="text-[var(--muted-foreground)] leading-relaxed">{section.content}</p>
                </div>
              </div>
            </section>
          ))}

          {/* User Responsibilities - Special Section */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center text-lg font-bold text-violet-400 flex-shrink-0">3</div>
              <div className="flex-1">
                <h2 className="text-xl font-bold mb-4 tracking-tight group-hover:text-violet-400 transition-colors">User Responsibilities</h2>
                <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">You agree to use the Service only for lawful purposes. You are prohibited from:</p>
                <div className="grid sm:grid-cols-2 gap-2">
                  {prohibitedActions.map((action, j) => (
                    <div key={j} className="flex items-start gap-2 p-3 rounded-xl bg-red-500/5 border border-red-500/10 text-sm text-[var(--muted-foreground)]">
                      <svg className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      {action}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Remaining sections */}
          {sections.slice(2).map((section, i) => (
            <section key={i + 3} className="group">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center text-lg font-bold text-violet-400 flex-shrink-0">{i + 4}</div>
                <div>
                  <h2 className="text-xl font-bold mb-4 tracking-tight group-hover:text-violet-400 transition-colors">{section.title}</h2>
                  {section.isWarning ? (
                    <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-sm text-[var(--muted-foreground)] flex items-start gap-2">
                      <svg className="w-4 h-4 text-amber-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
                      </svg>
                      <span>{section.content}</span>
                    </div>
                  ) : (
                    <p className="text-[var(--muted-foreground)] leading-relaxed">
                      {section.content}
                      {section.link && (
                        <>
                          {" "}For more information, see our{" "}
                          <a href={section.link.href} className="text-violet-400 hover:text-violet-300 transition-colors">
                            {section.link.text}
                          </a>.
                        </>
                      )}
                    </p>
                  )}
                </div>
              </div>
            </section>
          ))}

          {/* Contact Section */}
          <section className="group">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center text-lg font-bold text-violet-400 flex-shrink-0">16</div>
              <div>
                <h2 className="text-xl font-bold mb-4 tracking-tight group-hover:text-violet-400 transition-colors">Contact Information</h2>
                <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">
                  For questions about these Terms of Service, please contact:
                </p>
                <div className="space-y-2">
                  <p className="text-sm text-[var(--muted-foreground)]"><strong className="text-[var(--foreground)]">Owner:</strong> Nityam Sheth</p>
                  <a 
                    href="mailto:hello@nytm.in" 
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500/20 transition-colors font-medium"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
                    </svg>
                    hello@nytm.in
                  </a>
                </div>
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* Bottom CTA */}
      <div className="mt-12 text-center">
        <p className="text-[var(--muted-foreground)] mb-4">Have questions about our terms?</p>
        <a 
          href="/contact" 
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--muted)] border border-[var(--border)] hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-300 font-medium"
        >
          Contact Us
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
          </svg>
        </a>
      </div>
    </div>
  );
}
