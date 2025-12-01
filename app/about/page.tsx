import { Metadata } from "next";
import { ArrowRightIcon } from "@/assets/icons";

export const metadata: Metadata = {
  title: "About - NYTM Tools",
  description: "Learn more about NYTM Tools - Next-Gen Yield Tools & Modules. A modern collection of free online tools.",
};

export default function AboutPage() {
  return (
    <div className="max-w-5xl mx-auto py-16 px-4">
      {/* Hero Section - Apple/Swiss style */}
      <div className="text-center mb-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
          Crafted with precision
        </div>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
          About <span className="gradient-text">NYTM</span>
        </h1>
        <p className="text-xl md:text-2xl text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
          Next-Gen Yield Tools & Modules — where Swiss precision meets Apple simplicity
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
                NYTM Tools emerged from a simple frustration: juggling multiple websites for basic text transformations, image edits, and code formatting. We knew there had to be a better way.
              </p>
              <p>
                So we built it. A single, unified platform bringing together <strong className="text-[var(--foreground)]">130+ essential tools</strong> for developers, designers, content creators, and everyday users. No cluttered ads. No mandatory sign-ups. No premium paywalls for basic features.
              </p>
              <p>
                Every tool is designed to be fast, intuitive, and privacy-first. Most operations happen entirely in your browser — your data never leaves your device.
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-2xl mb-6 shadow-lg shadow-violet-500/20">
              🎯
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
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-green-600 flex items-center justify-center text-2xl mb-6 shadow-lg shadow-emerald-500/20">
              🔭
            </div>
            <span className="text-xs font-mono text-emerald-400 tracking-widest uppercase">Vision</span>
            <h3 className="text-2xl font-bold mt-2 mb-4 tracking-tight">Your go-to toolbox</h3>
            <p className="text-[var(--muted-foreground)] leading-relaxed">
              To become the definitive platform for anyone who needs quick, reliable tools — whether you're a developer debugging code, a student formatting an essay, or anyone in between.
            </p>
          </div>
        </div>
      </section>

      {/* Values - Apple style grid */}
      <section className="mb-20">
        <div className="text-center mb-12">
          <span className="text-xs font-mono text-violet-400 tracking-widest uppercase">Our Values</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 tracking-tight">What we stand for</h2>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { icon: "⚡", title: "Speed", description: "Instant results, zero waiting", color: "amber" },
            { icon: "🔒", title: "Privacy", description: "Your data stays with you", color: "blue" },
            { icon: "◈", title: "Free", description: "No hidden costs ever", color: "emerald" },
            { icon: "✦", title: "Quality", description: "Tools that just work", color: "violet" },
          ].map((value, i) => (
            <div 
              key={value.title}
              className="group relative rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 text-center hover:border-violet-500/30 transition-all duration-300 hover:-translate-y-1"
            >
              <div className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-${value.color}-500/20 to-${value.color}-600/10 flex items-center justify-center text-2xl mb-4`}>
                {value.icon}
              </div>
              <h3 className="font-semibold mb-1 tracking-tight">{value.title}</h3>
              <p className="text-sm text-[var(--muted-foreground)]">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Stats - Apple style */}
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
                { value: "130+", label: "Tools" },
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
              { name: "Next.js 15", icon: "▲" },
              { name: "React 19", icon: "⚛" },
              { name: "TypeScript", icon: "TS" },
              { name: "Tailwind CSS", icon: "◐" },
              { name: "Edge Functions", icon: "λ" },
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

      {/* CTA - Apple style */}
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
