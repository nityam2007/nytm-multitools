import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy - NYTM Tools",
  description: "Privacy Policy for NYTM Tools - Learn how we handle your data.",
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
          Last updated: December 1, 2025
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
                  Welcome to NYTM Tools ("we," "our," or "us"). We are committed to protecting your privacy 
                  and ensuring you have a positive experience when using our website and tools. This Privacy 
                  Policy explains how we collect, use, and safeguard your information.
                </p>
              </div>
            </div>
          </section>

          <section className="group">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center text-lg font-bold text-violet-400 flex-shrink-0">2</div>
              <div>
                <h2 className="text-xl font-bold mb-4 tracking-tight group-hover:text-violet-400 transition-colors">Information We Collect</h2>
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/20">
                    <p className="text-[var(--foreground)] font-medium mb-1">🔒 Data You Process</p>
                    <p className="text-sm text-[var(--muted-foreground)]">
                      Most of our tools process data entirely in your browser. This means text, images, and other content you input into our tools never leaves your device and is not stored on our servers.
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/20">
                    <p className="text-[var(--foreground)] font-medium mb-2">📊 Analytics Data</p>
                    <p className="text-sm text-[var(--muted-foreground)] mb-3">We may collect anonymous usage statistics to improve our services:</p>
                    <ul className="grid grid-cols-2 gap-2 text-sm text-[var(--muted-foreground)]">
                      <li className="flex items-center gap-2"><span className="text-violet-400">◈</span> Pages visited</li>
                      <li className="flex items-center gap-2"><span className="text-violet-400">◈</span> Browser type</li>
                      <li className="flex items-center gap-2"><span className="text-violet-400">◈</span> Device type</li>
                      <li className="flex items-center gap-2"><span className="text-violet-400">◈</span> Country location</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="group">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center text-lg font-bold text-violet-400 flex-shrink-0">3</div>
              <div>
                <h2 className="text-xl font-bold mb-4 tracking-tight group-hover:text-violet-400 transition-colors">How We Use Your Information</h2>
                <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">We use the collected information to:</p>
                <div className="grid sm:grid-cols-2 gap-3">
                  {["Improve and optimize our tools", "Understand user preferences", "Fix bugs and issues", "Develop new features"].map((item, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-[var(--muted)] text-sm">
                      <span className="text-emerald-400">✓</span> {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className="group">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center text-lg font-bold text-violet-400 flex-shrink-0">4</div>
              <div>
                <h2 className="text-xl font-bold mb-4 tracking-tight group-hover:text-violet-400 transition-colors">Cookies</h2>
                <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">We use cookies and similar technologies to:</p>
                <ul className="space-y-2 text-[var(--muted-foreground)]">
                  <li className="flex items-start gap-3"><span className="text-violet-400 mt-1">◈</span> Remember your preferences (like dark mode)</li>
                  <li className="flex items-start gap-3"><span className="text-violet-400 mt-1">◈</span> Understand how you use our site</li>
                  <li className="flex items-start gap-3"><span className="text-violet-400 mt-1">◈</span> Improve your overall experience</li>
                </ul>
                <p className="text-sm text-[var(--muted-foreground)] mt-4 p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                  ⚠️ You can control cookies through your browser settings. Disabling cookies may affect some functionality.
                </p>
              </div>
            </div>
          </section>

          <section className="group">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center text-lg font-bold text-violet-400 flex-shrink-0">5</div>
              <div>
                <h2 className="text-xl font-bold mb-4 tracking-tight group-hover:text-violet-400 transition-colors">Third-Party Services</h2>
                <p className="text-[var(--muted-foreground)] leading-relaxed">
                  We may use third-party services for analytics and advertising. These services may 
                  collect information about your use of our website. We recommend reviewing their 
                  privacy policies for more information.
                </p>
              </div>
            </div>
          </section>

          <section className="group">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center text-lg font-bold text-violet-400 flex-shrink-0">6</div>
              <div>
                <h2 className="text-xl font-bold mb-4 tracking-tight group-hover:text-violet-400 transition-colors">Data Security</h2>
                <p className="text-[var(--muted-foreground)] leading-relaxed">
                  We implement appropriate security measures to protect against unauthorized access, 
                  alteration, disclosure, or destruction of your information. However, no method of 
                  transmission over the Internet is 100% secure.
                </p>
              </div>
            </div>
          </section>

          <section className="group">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center text-lg font-bold text-violet-400 flex-shrink-0">7</div>
              <div>
                <h2 className="text-xl font-bold mb-4 tracking-tight group-hover:text-violet-400 transition-colors">Children's Privacy</h2>
                <p className="text-[var(--muted-foreground)] leading-relaxed">
                  Our services are not directed to individuals under the age of 13. We do not knowingly 
                  collect personal information from children under 13. If we become aware that a child 
                  under 13 has provided us with personal information, we will take steps to delete such 
                  information.
                </p>
              </div>
            </div>
          </section>

          <section className="group">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center text-lg font-bold text-violet-400 flex-shrink-0">8</div>
              <div>
                <h2 className="text-xl font-bold mb-4 tracking-tight group-hover:text-violet-400 transition-colors">Changes to This Policy</h2>
                <p className="text-[var(--muted-foreground)] leading-relaxed">
                  We may update this Privacy Policy from time to time. We will notify you of any changes 
                  by posting the new Privacy Policy on this page and updating the "Last updated" date.
                </p>
              </div>
            </div>
          </section>

          <section className="group">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 flex items-center justify-center text-lg font-bold text-violet-400 flex-shrink-0">9</div>
              <div>
                <h2 className="text-xl font-bold mb-4 tracking-tight group-hover:text-violet-400 transition-colors">Contact Us</h2>
                <p className="text-[var(--muted-foreground)] leading-relaxed mb-4">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <a 
                  href="mailto:privacy@nytmtools.com" 
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400 hover:bg-violet-500/20 transition-colors font-medium"
                >
                  <span>📧</span>
                  privacy@nytmtools.com
                </a>
              </div>
            </div>
          </section>

        </div>
      </div>
    </div>
  );
}
