import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata("pricing");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
