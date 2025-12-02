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
  title: "NYTM Tools — Next-Gen Yield Tools & Modules",
  description: "A modern, production-ready multi-tool web application featuring paste tools, upload tools, beautifiers, and text transformers. Fast, anonymous, and free to use.",
  keywords: ["tools", "utilities", "text tools", "image tools", "developer tools", "json beautifier", "markdown", "converter"],
  authors: [{ name: "NYTM" }],
  openGraph: {
    title: "NYTM Tools — Next-Gen Yield Tools & Modules",
    description: "A modern, production-ready multi-tool web application featuring paste tools, upload tools, beautifiers, and text transformers.",
    url: "https://nytm.in",
    siteName: "NYTM Tools",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "NYTM Tools — Next-Gen Yield Tools & Modules",
    description: "A modern, production-ready multi-tool web application",
  },
  metadataBase: new URL("https://nytm.in"),
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
                    <main className="flex-1 p-4 md:p-6 lg:p-8 overflow-auto">
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
