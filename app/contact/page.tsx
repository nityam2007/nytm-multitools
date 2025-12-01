"use client";

import { useState } from "react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "general",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // In production, you would send this to your backend
    console.log("Form submitted:", formData);
    
    setStatus("success");
    setFormData({ name: "", email: "", subject: "general", message: "" });
    
    setTimeout(() => setStatus("idle"), 5000);
  };

  return (
    <div className="max-w-5xl mx-auto py-16 px-4">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-8">
          <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
          We're here to help
        </div>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 tracking-tight">
          Get in <span className="gradient-text">Touch</span>
        </h1>
        <p className="text-xl md:text-2xl text-[var(--muted-foreground)] max-w-2xl mx-auto leading-relaxed">
          Have a question, suggestion, or just want to say hello? We'd love to hear from you.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Contact Cards */}
        <div className="space-y-4">
          {[
            {
              icon: "📧",
              gradient: "from-blue-500 to-cyan-500",
              title: "Email Us",
              description: "For general inquiries",
              link: "mailto:hello@nytmtools.com",
              linkText: "hello@nytmtools.com",
            },
            {
              icon: "🐛",
              gradient: "from-violet-500 to-purple-500",
              title: "Report a Bug",
              description: "Found something broken?",
              link: "mailto:bugs@nytmtools.com",
              linkText: "bugs@nytmtools.com",
            },
            {
              icon: "💡",
              gradient: "from-emerald-500 to-green-500",
              title: "Feature Request",
              description: "Have an idea for a new tool?",
              link: "mailto:ideas@nytmtools.com",
              linkText: "ideas@nytmtools.com",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="group relative rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 overflow-hidden hover:border-violet-500/30 transition-all duration-300 hover:-translate-y-0.5"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-violet-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative flex items-start gap-4">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${item.gradient} flex items-center justify-center text-2xl shadow-lg`}>
                  {item.icon}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold mb-1 tracking-tight">{item.title}</h3>
                  <p className="text-sm text-[var(--muted-foreground)] mb-2">
                    {item.description}
                  </p>
                  <a href={item.link} className="text-violet-400 hover:text-violet-300 text-sm font-medium transition-colors">
                    {item.linkText}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2">
          <div className="relative rounded-3xl bg-[var(--card)] border border-[var(--border)] p-8 md:p-10 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="relative">
              <span className="text-xs font-mono text-violet-400 tracking-widest uppercase">Contact Form</span>
              <h2 className="text-2xl font-bold mt-2 mb-8 tracking-tight">Send us a message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2 text-[var(--muted-foreground)]">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full px-4 py-3.5 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all placeholder:text-[var(--muted-foreground)]/50"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-2 text-[var(--muted-foreground)]">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full px-4 py-3.5 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all placeholder:text-[var(--muted-foreground)]/50"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium mb-2 text-[var(--muted-foreground)]">
                    Subject
                  </label>
                  <select
                    id="subject"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-3.5 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all"
                  >
                    <option value="general">General Inquiry</option>
                    <option value="bug">Bug Report</option>
                    <option value="feature">Feature Request</option>
                    <option value="feedback">Feedback</option>
                    <option value="business">Business Inquiry</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium mb-2 text-[var(--muted-foreground)]">
                    Message
                  </label>
                  <textarea
                    id="message"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    required
                    rows={6}
                    className="w-full px-4 py-3.5 rounded-xl bg-[var(--background)] border border-[var(--border)] focus:outline-none focus:border-violet-500/50 focus:ring-2 focus:ring-violet-500/20 transition-all resize-none placeholder:text-[var(--muted-foreground)]/50"
                    placeholder="Tell us what's on your mind..."
                  />
                </div>

                <button
                  type="submit"
                  disabled={status === "loading"}
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                >
                  {status === "loading" ? (
                    <span className="flex items-center justify-center gap-2">
                      <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      Send Message
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  )}
                </button>

                {status === "success" && (
                  <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">✓</div>
                    Message sent successfully! We'll get back to you soon.
                  </div>
                )}

                {status === "error" && (
                  <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">⚠️</div>
                    Something went wrong. Please try again.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <section className="mt-20">
        <div className="text-center mb-12">
          <span className="text-xs font-mono text-violet-400 tracking-widest uppercase">FAQ</span>
          <h2 className="text-3xl md:text-4xl font-bold mt-3 tracking-tight">Frequently Asked Questions</h2>
        </div>
        <div className="grid md:grid-cols-2 gap-4">
          {[
            {
              q: "Are all tools really free?",
              a: "Yes! All our tools are completely free to use. No hidden costs, no premium tiers for basic features.",
            },
            {
              q: "Do you store my data?",
              a: "No. Most tools run entirely in your browser. We don't store your personal data or the content you process.",
            },
            {
              q: "Can I request a new tool?",
              a: "Absolutely! We love hearing new ideas. Use the form above or email us at ideas@nytmtools.com.",
            },
            {
              q: "How often do you add new tools?",
              a: "We're constantly working on new tools. Follow us on social media to stay updated on new releases.",
            },
          ].map((faq, i) => (
            <div 
              key={i}
              className="group rounded-2xl bg-[var(--card)] border border-[var(--border)] p-6 hover:border-violet-500/30 transition-all duration-300"
            >
              <h3 className="font-semibold mb-2 tracking-tight group-hover:text-violet-400 transition-colors">{faq.q}</h3>
              <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
