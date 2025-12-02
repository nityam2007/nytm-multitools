import Link from "next/link";
import { toolsConfig, getToolsByCategory } from "@/lib/tools-config";
import { InteractiveGrid } from "@/components/InteractiveGrid";
import { ArrowRightIcon, ChevronDownIcon, ArrowUpRightIcon, getCategoryIcon } from "@/assets/icons";

export default function Home() {
  const categories = [
    { id: "text", name: "Text", count: getToolsByCategory("text").length },
    { id: "dev", name: "Developer", count: getToolsByCategory("dev").length },
    { id: "image", name: "Image", count: getToolsByCategory("image").length },
    { id: "converter", name: "Converters", count: getToolsByCategory("converter").length },
    { id: "generator", name: "Generators", count: getToolsByCategory("generator").length },
    { id: "security", name: "Security", count: getToolsByCategory("security").length },
  ];

  const featuredTools = [
    { slug: "json-pretty", name: "JSON Formatter", desc: "Format and validate JSON", uses: "12.5k" },
    { slug: "base64-encode", name: "Base64 Encode", desc: "Encode text to Base64", uses: "8.2k" },
    { slug: "password-generator", name: "Password Gen", desc: "Generate secure passwords", uses: "15.1k" },
    { slug: "hash-generator", name: "Hash Generator", desc: "MD5, SHA-1, SHA-256", uses: "6.8k" },
    { slug: "uuid-generator", name: "UUID Generator", desc: "Generate unique IDs", uses: "9.4k" },
    { slug: "color-converter", name: "Color Converter", desc: "HEX, RGB, HSL conversion", uses: "5.2k" },
    { slug: "image-compress", name: "Image Compress", desc: "Reduce image file size", uses: "18.7k" },
    { slug: "markdown-preview", name: "Markdown Preview", desc: "Live markdown editor", uses: "4.9k" },
  ];

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
      {/* Hero - Split Layout with Animations */}
      <section className="py-10 sm:py-16 md:py-20 lg:py-24 xl:py-32 border-b border-[var(--border)]">
        <div className="grid lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 xl:gap-20 items-center">
          {/* Left - Content with staggered animations */}
          <div>
            {/* Badge with pulse glow */}
            <div 
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-gradient-to-r from-violet-500/10 to-purple-500/10 border border-violet-500/20 text-[10px] sm:text-xs font-mono text-[var(--primary)] mb-4 sm:mb-6 animate-fade-slide-up animate-pulse-glow"
              style={{ opacity: 0, animationFillMode: 'forwards' }}
            >
              <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-violet-500 animate-pulse" />
              {toolsConfig.length} tools available
            </div>
            
            {/* Heading with animation */}
            <h1 
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-[-0.03em] leading-[1.08] mb-3 sm:mb-4 animate-fade-slide-up animate-delay-100"
              style={{ opacity: 0, animationFillMode: 'forwards' }}
            >
              Online Tools
              <br />
              <span className="gradient-text">for Everyone</span>
            </h1>
            
            {/* Tagline */}
            <p 
              className="text-base sm:text-lg md:text-xl font-medium text-[var(--foreground)] mb-2 sm:mb-3 animate-fade-slide-up animate-delay-200"
              style={{ opacity: 0, animationFillMode: 'forwards' }}
            >
              {toolsConfig.length} tools. Zero friction. Built for everyone.
            </p>
            
            {/* Description */}
            <p 
              className="text-sm sm:text-base text-[var(--muted-foreground)] max-w-lg leading-relaxed mb-6 sm:mb-8 md:mb-10 animate-fade-slide-up animate-delay-300"
              style={{ opacity: 0, animationFillMode: 'forwards', lineHeight: '1.7' }}
            >
              A curated collection of free online tools for developers, designers, and creators. 
              No signup. No ads for supporters. Just tools.
            </p>
            
            {/* Buttons with better spacing and hover effects */}
            <div 
              className="flex flex-col xs:flex-row flex-wrap gap-3 sm:gap-4 animate-fade-slide-up animate-delay-400"
              style={{ opacity: 0, animationFillMode: 'forwards' }}
            >
              <Link
                href="/tools"
                className="group inline-flex items-center justify-center gap-2 sm:gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-medium text-sm transition-all duration-300 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 active:scale-[0.98] sm:hover:-translate-y-1 sm:hover:scale-[1.02]"
              >
                <span>Explore Tools</span>
                <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
              <Link
                href="#categories"
                className="group inline-flex items-center justify-center gap-2 sm:gap-2.5 px-5 sm:px-6 py-2.5 sm:py-3 border border-[var(--border)] rounded-xl font-medium text-sm transition-all duration-300 hover:border-violet-500/50 hover:bg-violet-500/5 active:scale-[0.98] sm:hover:-translate-y-0.5"
              >
                Browse Categories
                <ChevronDownIcon className="w-4 h-4 text-[var(--muted-foreground)] transition-all duration-300 group-hover:text-violet-400 group-hover:translate-y-0.5" />
              </Link>
            </div>
          </div>

          {/* Right - Interactive Element with float animation */}
          <div className="hidden lg:flex justify-center items-center animate-float">
            <InteractiveGrid />
          </div>
        </div>
      </section>

      {/* Category Grid - Swiss Style with improved spacing */}
      <section id="categories" className="py-10 sm:py-16 md:py-20 border-t border-[var(--border)]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 mb-6 sm:mb-8 md:mb-10">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-[-0.02em]">Categories</h2>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1 sm:mt-2" style={{ lineHeight: '1.6' }}>Browse tools by type</p>
          </div>
          <Link 
            href="/tools" 
            className="text-xs sm:text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors duration-300 flex items-center gap-1 group w-fit"
          >
            View all 
            <ArrowRightIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3 md:gap-4">
          {categories.map((category) => {
            const CategoryIcon = getCategoryIcon(category.id);
            return (
              <Link
                key={category.id}
                href={`/tools?category=${category.id}`}
                className="group p-4 sm:p-5 md:p-6 bg-[var(--card)] border border-[var(--border)] rounded-xl sm:rounded-2xl hover:border-violet-500/50 hover:bg-gradient-to-br hover:from-violet-500/5 hover:to-purple-500/5 transition-all duration-300 active:scale-[0.98] sm:hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-500/10"
              >
                <div className="mb-2 sm:mb-3 md:mb-4 text-violet-500 group-hover:text-violet-400 transition-all duration-300 group-hover:scale-110 inline-block">
                  <CategoryIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <h3 className="font-semibold text-xs sm:text-sm mb-0.5 sm:mb-1">{category.name}</h3>
                <p className="text-[10px] sm:text-xs text-[var(--muted-foreground)] tabular-nums">{category.count} tools</p>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Tools - Enhanced cards with metadata */}
      <section className="py-10 sm:py-16 md:py-20 border-t border-[var(--border)]">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 sm:gap-4 mb-6 sm:mb-8 md:mb-10">
          <div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-[-0.02em]">Featured</h2>
            <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1 sm:mt-2" style={{ lineHeight: '1.6' }}>Most popular tools</p>
          </div>
          <span className="text-[10px] sm:text-xs text-[var(--muted-foreground)] tabular-nums font-mono bg-[var(--muted)] px-2 py-1 rounded-md w-fit">{featuredTools.length} tools</span>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {featuredTools.map((tool) => (
            <Link
              key={tool.slug}
              href={`/tools/${tool.slug}`}
              className="group p-4 sm:p-5 bg-[var(--card)] border border-[var(--border)] rounded-xl sm:rounded-2xl hover:border-violet-500/50 transition-all duration-300 active:scale-[0.98] sm:hover:-translate-y-1 hover:shadow-lg hover:shadow-violet-500/10"
            >
              <div className="flex items-start justify-between mb-3 sm:mb-5">
                <h3 className="font-semibold text-xs sm:text-sm group-hover:text-violet-400 transition-colors duration-300">{tool.name}</h3>
                <ArrowUpRightIcon 
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--muted-foreground)] opacity-0 group-hover:opacity-100 group-hover:text-violet-400 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" 
                />
              </div>
              <p className="text-[11px] sm:text-sm text-[var(--muted-foreground)] mb-3 sm:mb-4" style={{ lineHeight: '1.5' }}>{tool.desc}</p>
              <div className="flex items-center gap-2 text-[9px] sm:text-[10px] text-[var(--muted-foreground)]">
                <span className="px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md bg-[var(--muted)]">{tool.uses} uses</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* All Tools Preview - Better spacing */}
      <section className="py-10 sm:py-16 md:py-20 border-t border-[var(--border)]">
        <div className="mb-6 sm:mb-8 md:mb-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-[-0.02em]">All Tools</h2>
          <p className="text-xs sm:text-sm text-[var(--muted-foreground)] mt-1 sm:mt-2" style={{ lineHeight: '1.6' }}>Complete collection by category</p>
        </div>

        <div className="space-y-8 sm:space-y-10 md:space-y-12">
          {categories.slice(0, 4).map((category) => {
            const tools = getToolsByCategory(category.id as any).slice(0, 6);
            if (tools.length === 0) return null;
            const CategoryIcon = getCategoryIcon(category.id);

            return (
              <div key={category.id}>
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <CategoryIcon className="w-4 h-4 sm:w-5 sm:h-5 text-violet-500" />
                    <h3 className="font-semibold text-xs sm:text-sm">{category.name}</h3>
                    <span className="text-[9px] sm:text-[10px] text-[var(--muted-foreground)] bg-[var(--muted)] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded-md tabular-nums">
                      {category.count}
                    </span>
                  </div>
                  <Link
                    href={`/tools?category=${category.id}`}
                    className="text-[10px] sm:text-xs text-[var(--muted-foreground)] hover:text-violet-400 transition-colors duration-300 flex items-center gap-1 group"
                  >
                    View all 
                    <ArrowRightIcon className="w-3 h-3 transition-transform duration-300 group-hover:translate-x-0.5" />
                  </Link>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
                  {tools.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={`/tools/${tool.slug}`}
                      className="px-3 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm border border-[var(--border)] rounded-lg sm:rounded-xl hover:border-violet-500/50 hover:bg-violet-500/5 hover:text-violet-400 transition-all duration-300 truncate active:scale-[0.98] sm:hover:-translate-y-0.5"
                    >
                      {tool.name}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-8 sm:mt-10 md:mt-12 text-center">
          <Link
            href="/tools"
            className="group inline-flex items-center gap-2 sm:gap-2.5 px-5 sm:px-7 py-2.5 sm:py-3 border border-[var(--border)] rounded-xl font-medium text-xs sm:text-sm hover:border-violet-500/50 hover:bg-violet-500/5 hover:text-violet-400 transition-all duration-300 active:scale-[0.98] sm:hover:-translate-y-0.5"
          >
            Browse All {toolsConfig.length} Tools
            <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Features - Better spacing and visual hierarchy */}
      <section className="py-10 sm:py-16 md:py-20 border-t border-[var(--border)]">
        <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 xl:gap-16">
          {[
            { icon: "bolt", title: "Fast & Private", desc: "Tools run in your browser. Your data stays on your device." },
            { icon: "spark", title: "No Signup", desc: "Use any tool instantly. No account or registration required." },
            { icon: "heart", title: "Always Free", desc: "All tools are free forever. Support us to remove ads." },
          ].map((feature, index) => (
            <div key={feature.title} className="text-center md:text-left group">
              <div className="inline-flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 border border-violet-500/20 text-lg sm:text-xl mb-3 sm:mb-4 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-violet-500/20">
                {feature.icon === "bolt" && (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-violet-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                )}
                {feature.icon === "spark" && (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-violet-400" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
                  </svg>
                )}
                {feature.icon === "heart" && (
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-violet-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
                  </svg>
                )}
              </div>
              <h3 className="font-semibold text-sm sm:text-base mb-1.5 sm:mb-2">{feature.title}</h3>
              <p className="text-xs sm:text-sm text-[var(--muted-foreground)]" style={{ lineHeight: '1.6' }}>{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA - Enhanced gradient and spacing */}
      <section className="py-10 sm:py-16 md:py-20 border-t border-[var(--border)]">
        <div className="p-6 sm:p-8 md:p-10 lg:p-12 rounded-2xl sm:rounded-3xl bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-pink-500/10 border border-violet-500/20 relative overflow-hidden">
          {/* Decorative gradient orb */}
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-48 sm:h-48 md:w-64 md:h-64 bg-gradient-to-br from-violet-500/20 to-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 sm:gap-6 md:gap-8">
            <div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold mb-1.5 sm:mb-2 tracking-[-0.02em]">Start using tools now</h2>
              <p className="text-sm sm:text-base text-[var(--muted-foreground)]" style={{ lineHeight: '1.6' }}>
                Jump right in — no signup required
              </p>
            </div>
            <Link
              href="/tools"
              className="group inline-flex items-center justify-center gap-2 sm:gap-2.5 px-5 sm:px-7 py-3 sm:py-3.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-medium text-sm transition-all duration-300 shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 active:scale-[0.98] sm:hover:-translate-y-1 sm:hover:scale-[1.02] w-full md:w-fit"
            >
              <span>Get Started</span>
              <ArrowRightIcon className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
