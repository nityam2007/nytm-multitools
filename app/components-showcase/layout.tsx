// Keep internal UI demonstrations out of search results | TypeScript
import type { Metadata } from "next";
export const metadata: Metadata = { robots: { index: false, follow: true } };
export default function DemoLayout({ children }: { children: React.ReactNode }) { return children; }
