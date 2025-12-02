import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Sidebar, SidebarProvider } from "@/components/Sidebar";
import { Footer } from "@/components/Footer";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SubscriptionProvider } from "@/lib/subscription-context";
import { PostHogProvider } from "@/components/PostHogProvider";
import { ToastProvider } from "@/components/Toast";
import { generateWebsiteJsonLd } from "@/lib/seo";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "NYTM Tools — 136 Free Developer & Productivity Tools",
    template: "%s | NYTM Tools",
  },
  description: "136 free online tools for developers and creators. Text manipulation, converters, generators, image editing, and more. No ads, no sign-ups, 100% client-side processing. Your data never leaves your device.",
  keywords: [
    "free online tools",
    "developer tools",
    "text tools",
    "image tools",
    "json formatter",
    "base64 encoder",
    "hash generator",
    "uuid generator",
    "markdown editor",
    "code beautifier",
    "color converter",
    "unit converter",
    "qr code generator",
    "password generator",
    "regex tester",
    "jwt decoder",
    "timestamp converter",
    "privacy-focused tools",
    "client-side tools",
    "no tracking tools",
  ],
  authors: [{ name: "Nityam Sheth", url: "https://nsheth.in" }],
  creator: "Nityam Sheth",
  publisher: "NYTM",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://nytm.in",
    siteName: "NYTM Tools",
    title: "NYTM Tools — 136 Free Developer & Productivity Tools",
    description: "136 free online tools for developers and creators. Text manipulation, converters, generators, image editing, and more. No ads, no sign-ups, 100% client-side. Your data stays on your device.",
    images: [
      {
        url: "/metaimg.png",
        width: 1200,
        height: 630,
        alt: "NYTM Tools — 136 Free Developer & Productivity Tools",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NYTM Tools — 136 Free Developer & Productivity Tools",
    description: "136 free online tools. No ads, no tracking, 100% client-side. Text tools, converters, generators, image editing & more.",
    images: ["/metaimg.png"],
    creator: "@nityam2007",
  },
  metadataBase: new URL("https://nytm.in"),
  alternates: {
    canonical: "https://nytm.in",
  },
  category: "technology",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(generateWebsiteJsonLd()) }}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  if (theme === 'light') {
                    document.documentElement.classList.remove('dark');
                    document.documentElement.classList.add('light');
                  }
                } catch (e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased min-h-screen`}>
        <PostHogProvider>
          <ThemeProvider>
            <SubscriptionProvider>
              <ToastProvider>
                <SidebarProvider>
                  <div className="flex flex-col min-h-screen">
                    <Header />
                    <Sidebar />
                    <main className="flex-1 px-3 py-4 sm:px-4 sm:py-5 md:px-6 md:py-6 lg:px-8 lg:py-8 overflow-auto scroll-smooth">
                      {children}
                    </main>
                    <Footer />
                  </div>
                </SidebarProvider>
              </ToastProvider>
            </SubscriptionProvider>
          </ThemeProvider>
        </PostHogProvider>
      </body>
    </html>
  );
}
