import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service - NYTM Tools",
  description: "Terms of Service for NYTM Tools - Read our terms and conditions.",
};

const sections = [
  {
    title: "Acceptance of Terms",
    content: "By accessing and using NYTM Tools (\"the Service\"), you accept and agree to be bound by the terms and provisions of this agreement. If you do not agree to these terms, please do not use our Service.",
  },
  {
    title: "Description of Service",
    content: "NYTM Tools provides a collection of free online utilities including text manipulation, image editing, code formatting, data conversion, and other tools. The Service is provided \"as is\" and \"as available\" without warranties of any kind.",
  },
  {
    title: "Intellectual Property",
    content: "The Service and its original content, features, and functionality are owned by NYTM Tools and are protected by international copyright, trademark, and other intellectual property laws. Content you create using our tools remains your property.",
  },
  {
    title: "Data and Privacy",
    content: "Most tools on our platform process data locally in your browser. We do not store the content you process through our tools.",
    link: { href: "/privacy", text: "Privacy Policy" },
  },
  {
    title: "Disclaimer of Warranties",
    content: "THE SERVICE IS PROVIDED \"AS IS\" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED. WE DO NOT WARRANT THAT THE SERVICE WILL BE UNINTERRUPTED, SECURE, OR ERROR-FREE.",
    isWarning: true,
  },
  {
    title: "Limitation of Liability",
    content: "IN NO EVENT SHALL NYTM TOOLS BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES ARISING OUT OF OR RELATING TO YOUR USE OF THE SERVICE.",
    isWarning: true,
  },
  {
    title: "Service Modifications",
    content: "We reserve the right to modify, suspend, or discontinue the Service (or any part thereof) at any time without notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuation of the Service.",
  },
  {
    title: "Premium Services",
    content: "We may offer premium or paid services in the future. Any paid services will be subject to additional terms and conditions that will be presented at the time of purchase. Premium features may include ad-free experience, additional tools, or enhanced functionality.",
  },
  {
    title: "Termination",
    content: "We may terminate or suspend your access to the Service immediately, without prior notice or liability, for any reason, including breach of these Terms.",
  },
  {
    title: "Governing Law",
    content: "These Terms shall be governed by and construed in accordance with applicable laws, without regard to conflict of law principles.",
  },
  {
    title: "Changes to Terms",
    content: "We reserve the right to modify these Terms at any time. Changes will be effective immediately upon posting to the website. Your continued use of the Service after changes constitutes acceptance of the new Terms.",
  },
];

const prohibitedActions = [
  "Using the Service for any illegal or unauthorized purpose",
  "Attempting to interfere with or disrupt the Service",
  "Uploading malicious code or content",
  "Attempting to gain unauthorized access to our systems",
  "Using automated tools to scrape or overload the Service",
  "Violating any applicable laws or regulations",
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
                      <span className="text-red-400 mt-0.5">✗</span> {action}
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
                    <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/20 text-sm text-[var(--muted-foreground)]">
                      <span className="text-amber-400">⚠️</span> {section.content}
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
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center text-lg font-bold text-violet-400 flex-shrink-0">13</div>
              <div>
                <h2 className="text-xl font-bold mb-4 tracking-tight group-hover:text-violet-400 transition-colors">Contact Information</h2>
                <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">
                  For questions about these Terms of Service, please contact us:
                </p>
                <a 
                  href="mailto:legal@nytmtools.com" 
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500/20 transition-colors font-medium"
                >
                  <span>📧</span>
                  legal@nytmtools.com
                </a>
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
