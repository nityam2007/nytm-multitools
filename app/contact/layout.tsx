import { Metadata } from "next";
import { generatePageMetadata } from "@/lib/seo";

export const metadata: Metadata = generatePageMetadata("contact");

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
