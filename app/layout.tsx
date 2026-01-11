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

// NOTE: This must match toolsConfig.length in lib/tools-config.ts
// Static metadata cannot use dynamic imports, so update this when adding tools
// See lib/site-config.ts for the dynamic version used in components
const TOOL_COUNT = 182;

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
    default: `NYTM Tools — ${TOOL_COUNT} Free Online Tools`,
    template: "%s | NYTM Tools",
  },
  description: `${TOOL_COUNT} free online tools for text, images, converters & generators. No ads for supporters, no sign-ups, 100% browser-based. Privacy-first tools.`,
  keywords: [
    "free online tools",
    "online utilities",
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
    "browser-based tools",
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
    title: `NYTM Tools — ${TOOL_COUNT} Free Online Tools`,
    description: `${TOOL_COUNT} free online tools for text, images, converters & generators. No ads for supporters, no sign-ups, 100% browser-based. Privacy-first tools.`,
    images: [
      {
        url: "/metaimg.png",
        width: 1200,
        height: 630,
        alt: `NYTM Tools — ${TOOL_COUNT} Free Online Tools`,
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `NYTM Tools — ${TOOL_COUNT} Free Online Tools`,
    description: `${TOOL_COUNT} free online tools for text, images, converters & generators. No ads for supporters, no sign-ups. Privacy-first & browser-based.`,
    images: ["/metaimg.png"],
    creator: "@nityam2007",
  },
  metadataBase: new URL("https://nytm.in"),
  alternates: {
    canonical: "https://nytm.in",
  },
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
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
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
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
