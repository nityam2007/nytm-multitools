import { Metadata } from "next";
import { ArrowRightIcon, HeartIcon } from "@/assets/icons";
import { generatePageMetadata } from "@/lib/seo";
import ScrollToTop from "@/components/ScrollToTop";

export const metadata: Metadata = generatePageMetadata("about");

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
    <div className="max-w-5xl mx-auto py-8 sm:py-12 md:py-16 px-3 sm:px-4">
      <ScrollToTop />
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
              { name: "Next.js 16", icon: "nextjs" },
              { name: "React 19.2", icon: "react" },
              { name: "TypeScript 5.9", icon: "ts" },
              { name: "Tailwind 4", icon: "tailwind" },
              { name: "Turbopack", icon: "turbo" },
            ].map((tech) => (
              <span 
                key={tech.name}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--muted)] hover:bg-violet-500/10 border border-transparent hover:border-violet-500/20 text-sm font-medium transition-all duration-300 cursor-default"
              >
                {tech.icon === "nextjs" && (
                  <svg className="w-4 h-4 text-violet-500" viewBox="0 0 24 24" fill="currentColor"><path d="M11.572 0c-.176 0-.31.001-.358.007a19.76 19.76 0 01-.364.033C7.443.346 4.25 2.185 2.228 5.012a11.875 11.875 0 00-2.119 5.243c-.096.659-.108.854-.108 1.747s.012 1.089.108 1.748c.652 4.506 3.86 8.292 8.209 9.695.779.251 1.6.422 2.534.525.363.04 1.935.04 2.299 0 1.611-.178 2.977-.577 4.323-1.264.207-.106.247-.134.219-.158-.02-.013-.9-1.193-1.955-2.62l-1.919-2.592-2.404-3.558a338.739 338.739 0 00-2.422-3.556c-.009-.002-.018 1.579-.023 3.51-.007 3.38-.01 3.515-.052 3.595a.426.426 0 01-.206.214c-.075.037-.14.044-.495.044H7.81l-.108-.068a.438.438 0 01-.157-.171l-.05-.106.006-4.703.007-4.705.072-.092a.645.645 0 01.174-.143c.096-.047.134-.051.54-.051.478 0 .558.018.682.154.035.038 1.337 1.999 2.895 4.361a10760.433 10760.433 0 004.735 7.17l1.9 2.879.096-.063a12.317 12.317 0 002.466-2.163 11.944 11.944 0 002.824-6.134c.096-.66.108-.854.108-1.748 0-.893-.012-1.088-.108-1.747-.652-4.506-3.859-8.292-8.208-9.695a12.597 12.597 0 00-2.499-.523A33.119 33.119 0 0011.572 0zm4.069 7.217c.347 0 .408.005.486.047a.473.473 0 01.237.277c.018.06.023 1.365.018 4.304l-.006 4.218-.744-1.14-.746-1.14v-3.066c0-1.982.01-3.097.023-3.15a.478.478 0 01.233-.296c.096-.05.13-.054.5-.054z"/></svg>
                )}
                {tech.icon === "react" && (
                  <svg className="w-4 h-4 text-violet-500" viewBox="0 0 24 24" fill="currentColor"><path d="M14.23 12.004a2.236 2.236 0 01-2.235 2.236 2.236 2.236 0 01-2.236-2.236 2.236 2.236 0 012.235-2.236 2.236 2.236 0 012.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38a2.167 2.167 0 00-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44a23.476 23.476 0 00-3.107-.534A23.892 23.892 0 0012.769 4.7c1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442a22.73 22.73 0 00-3.113.538 15.02 15.02 0 01-.254-1.42c-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87a25.64 25.64 0 01-4.412.005 26.64 26.64 0 01-1.183-1.86c-.372-.64-.71-1.29-1.018-1.946a25.17 25.17 0 011.013-1.954c.38-.66.773-1.286 1.18-1.868A25.245 25.245 0 0112 8.098zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933a25.952 25.952 0 00-1.345-2.32zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493a23.966 23.966 0 00-1.1-2.98c.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98a23.142 23.142 0 00-1.086 2.964c-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39a25.819 25.819 0 001.341-2.338zm-9.945.02c.22.38.447.763.688 1.14.225.39.444.776.665 1.153a25.1 25.1 0 01-2.003-.385 24.478 24.478 0 01.647-1.91zm4.962 3.467c.45-.468.902-.992 1.35-1.56.464.02.93.035 1.395.035.47 0 .935-.01 1.39-.033-.443.566-.892 1.09-1.34 1.558-.513-.492-1.05-1.054-1.597-1.667a.977.977 0 00-.198.667c-.555.614-1.1 1.18-1.625 1.68-.462-.47-.912-.993-1.35-1.564-.463-.02-.927-.035-1.39-.035-.465 0-.93.01-1.39.033.443-.568.89-1.09 1.34-1.558.446.463.896.983 1.35 1.554.516.5 1.077 1.073 1.663 1.683.456.47.905.993 1.35 1.564z"/></svg>
                )}
                {tech.icon === "ts" && (
                  <span className="text-violet-500 font-mono text-xs font-bold">TS</span>
                )}
                {tech.icon === "tailwind" && (
                  <svg className="w-4 h-4 text-violet-500" viewBox="0 0 24 24" fill="currentColor"><path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z"/></svg>
                )}
                {tech.icon === "turbo" && (
                  <svg className="w-4 h-4 text-violet-500" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
                  </svg>
                )}
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
