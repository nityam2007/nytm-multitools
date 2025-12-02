import { Metadata } from "next";
import { ArrowRightIcon, HeartIcon } from "@/assets/icons";

export const metadata: Metadata = {
  title: "About - NYTM MULTITOOLS",
  description: "Learn more about NYTM MULTITOOLS - Next-Gen Yield Tools & Modules. A modern collection of free online tools.",
};

// SVG Icons for this page
function TargetIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 12h.01" />
    </svg>
  );
}

function TelescopeIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function BoltIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
    </svg>
  );
}

function ShieldCheckIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
    </svg>
  );
}

function GiftIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 11.25v8.25a1.5 1.5 0 01-1.5 1.5H5.25a1.5 1.5 0 01-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 109.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1114.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z" />
    </svg>
  );
}

function SparklesIcon({ className = "w-6 h-6" }: { className?: string }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
    </svg>
  );
}

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto py-16 px-4">
      {/* Hero Section */}
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
          Crafted with precision
        </div>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
          About <span className="gradient-text">NYTM</span>
        </h1>
        <p className="text-xl md:text-2xl text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
          Next-Gen Yield Tools & Modules — precision engineering meets intuitive simplicity
        </p>
      </div>

      {/* Story Section - Glass card */}
      <section className="mb-20">
        <div className="relative rounded-3xl bg-gradient-to-br from-violet-500/5 via-transparent to-purple-500/5 border border-violet-500/10 p-10 md:p-14 overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-violet-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          <div className="relative">
            <span className="inline-block text-xs font-mono text-violet-400 tracking-widest uppercase mb-4">Our Story</span>
            <h2 className="text-3xl md:text-4xl font-bold mb-8 tracking-tight">
              Born from frustration.<br />Built for <span className="gradient-text">simplicity</span>.
            </h2>
            <div className="space-y-6 text-lg text-[var(--muted-foreground)] leading-relaxed max-w-3xl">
              <p>
                NYTM MULTITOOLS emerged from a simple frustration: juggling multiple websites for basic text transformations, image edits, and code formatting. We knew there had to be a better way.
              </p>
              <p>
                So we built it. A single, unified platform bringing together <strong className="text-[var(--foreground)]">136 essential tools</strong> for developers, designers, content creators, and everyday users. No ads. No sign-ups. No paywalls. Ever.
              </p>
              <p>
                Every tool is designed to be fast, intuitive, and privacy-first. <strong className="text-[var(--foreground)]">All operations happen entirely in your browser</strong> — your data never leaves your device.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission & Vision - Bento grid */}
      <section className="grid md:grid-cols-2 gap-6 mb-20">
        <div className="group relative rounded-3xl bg-[var(--card)] border border-[var(--border)] p-8 md:p-10 overflow-hidden hover:border-violet-500/30 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mb-6 shadow-lg shadow-violet-500/20">
              <TargetIcon className="w-8 h-8 text-white" />
            </div>
            <span className="text-xs font-mono text-violet-400 tracking-widest uppercase">Mission</span>
            <h3 className="text-2xl font-bold mt-2 mb-4 tracking-tight">Simplify the web</h3>
            <p className="text-[var(--muted-foreground)] leading-relaxed">
              To provide fast, free, and privacy-focused online tools that help people get things done without complicated software or unnecessary sign-ups.
            </p>
          </div>
        </div>
        <div className="group relative rounded-3xl bg-[var(--card)] border border-[var(--border)] p-8 md:p-10 overflow-hidden hover:border-violet-500/30 transition-all duration-500">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center mb-6 shadow-lg shadow-emerald-500/20">
              <TelescopeIcon className="w-8 h-8 text-white" />
            </div>
            <span className="text-xs font-mono text-emerald-400 tracking-widest uppercase">Vision</span>
            <h3 className="text-2xl font-bold mt-2 mb-4 tracking-tight">Your go-to toolbox</h3>
            <p className="text-[var(--muted-foreground)] leading-relaxed">
              To become the definitive platform for anyone who needs quick, reliable tools — whether you're a developer debugging code, a student formatting an essay, or anyone in between.
            </p>
          </div>
        </div>
      </section>

      {/* Values - Grid */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <span className="text-xs font-mono text-violet-400 tracking-widest uppercase">Our Values</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 tracking-tight">What we stand for</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: BoltIcon, title: "Speed", description: "Instant results, zero waiting", color: "amber" },
            { icon: ShieldCheckIcon, title: "Privacy", description: "Your data stays with you", color: "blue" },
            { icon: GiftIcon, title: "Free", description: "No hidden costs ever", color: "emerald" },
            { icon: SparklesIcon, title: "Quality", description: "Tools that just work", color: "violet" },
          ].map((value) => (
            <div 
              key={value.title}
              className="group relative rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 text-center hover:border-violet-500/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 mx-auto rounded-xl bg-${value.color}-500/10 flex items-center justify-center text-${value.color}-400 mb-4`}>
                <value.icon className="w-6 h-6" />
              </div>
              <h3 className="font-semibold mb-1 tracking-tight">{value.title}</h3>
              <p className="text-sm text-[var(--muted-foreground)]">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="mb-20">
        <div className="relative rounded-3xl bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-pink-500/10 border border-violet-500/20 p-10 md:p-14 overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-violet-500/10 via-transparent to-transparent" />
          <div className="relative">
            <div className="text-center mb-10">
              <span className="text-xs font-mono text-violet-400 tracking-widest uppercase">The Numbers</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-3 tracking-tight">Built to scale</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { value: "136", label: "Tools" },
                { value: "7", label: "Categories" },
                { value: "100%", label: "Free" },
                { value: "∞", label: "Usage" },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="text-4xl md:text-5xl lg:text-6xl font-bold gradient-text mb-2 tracking-tight">{stat.value}</div>
                  <div className="text-sm text-[var(--muted-foreground)] font-medium uppercase tracking-wider">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack - Modern badges */}
      <section className="mb-20">
        <div className="rounded-3xl bg-[var(--card)] border border-[var(--border)] p-10 md:p-14">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-10">
            <div>
              <span className="text-xs font-mono text-violet-400 tracking-widest uppercase">Technology</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-3 tracking-tight">Built with modern tech</h2>
            </div>
            <p className="text-[var(--muted-foreground)] max-w-md leading-relaxed">
              Cutting-edge technologies for the best performance and user experience.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              { name: "Next.js 16", icon: "▲" },
              { name: "React 19.2", icon: "⚛" },
              { name: "TypeScript 5.9", icon: "TS" },
              { name: "Tailwind 4", icon: "◐" },
              { name: "Turbopack", icon: "⚡" },
            ].map((tech) => (
              <span 
                key={tech.name}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--muted)] hover:bg-violet-500/10 border border-transparent hover:border-violet-500/20 text-sm font-medium transition-all duration-300 cursor-default"
              >
                <span className="text-violet-500 font-mono">{tech.icon}</span>
                {tech.name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Data Privacy Notice */}
      <section className="mb-20">
        <div className="rounded-3xl bg-emerald-500/5 border border-emerald-500/20 p-8 md:p-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center flex-shrink-0">
              <ShieldCheckIcon className="w-6 h-6 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">100% Client-Side Processing</h3>
              <p className="text-[var(--muted-foreground)] leading-relaxed">
                <strong className="text-[var(--foreground)]">All 136 tools process data entirely in your browser.</strong> Your text, images, 
                code, and files never leave your device. We have no servers storing your data because there's 
                nothing to store. The only external service used is <strong className="text-[var(--foreground)]">IP Lookup</strong> which 
                requires an API call to ipinfo.io — this is clearly disclosed on that tool's page.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Legal Disclaimer */}
      <section className="mb-20">
        <div className="rounded-3xl bg-amber-500/5 border border-amber-500/20 p-8 md:p-10">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-amber-400" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-3">Legal Notice</h3>
              <div className="space-y-3 text-sm text-[var(--muted-foreground)]">
                <p>
                  <strong className="text-[var(--foreground)]">NYTM</strong> is a project name only — not a registered organization, company, or legal entity.
                </p>
                <p>
                  <strong className="text-[var(--foreground)]">Nityam Sheth</strong> (the owner/operator) is not liable for any damages, losses, or issues arising from use of this service. All tools are provided "as-is" without warranty.
                </p>
                <p>
                  Third-party services (payment processors, DNS providers, hosting, analytics) are independent entities. Neither NYTM nor its owner are liable for their actions or policies.
                </p>
                <p className="text-xs pt-2 border-t border-amber-500/20">
                  See our <a href="/terms" className="text-amber-400 hover:underline">Terms of Service</a> and <a href="/privacy" className="text-amber-400 hover:underline">Privacy Policy</a> for full details.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Support Section */}
      <section className="mb-20">
        <div className="rounded-3xl bg-pink-500/5 border border-pink-500/20 p-8 md:p-10 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-pink-500/10 flex items-center justify-center mb-4">
            <HeartIcon className="w-8 h-8 text-pink-400" />
          </div>
          <h3 className="text-2xl font-bold mb-2">Support NYTM</h3>
          <p className="text-[var(--muted-foreground)] max-w-lg mx-auto mb-6">
            NYTM runs on donations and is self-funded by Nityam Sheth when needed. 
            If you find these tools useful, consider supporting the project.
          </p>
          <a 
            href="/pricing" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-pink-500/10 border border-pink-500/30 text-pink-400 font-medium hover:bg-pink-500/20 transition-all"
          >
            <HeartIcon className="w-5 h-5" />
            Learn More
          </a>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <div className="relative rounded-3xl bg-gradient-to-br from-violet-500/5 via-transparent to-purple-500/5 border border-violet-500/10 p-12 md:p-16 overflow-hidden">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-violet-500/10 rounded-full blur-3xl -translate-y-1/2" />
          <div className="relative">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 tracking-tight">Ready to get started?</h2>
            <p className="text-lg text-[var(--muted-foreground)] mb-10 max-w-lg mx-auto">
              Explore our collection of tools and find exactly what you need.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="/tools" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 hover:-translate-y-0.5">
                Browse All Tools
                <ArrowRightIcon className="w-5 h-5" />
              </a>
              <a href="/contact" className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-[var(--muted)] border border-[var(--border)] font-semibold hover:border-violet-500/30 hover:bg-violet-500/5 transition-all duration-300">
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
