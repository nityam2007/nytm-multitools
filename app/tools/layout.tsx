import { Metadata } from "next";
import { generateToolsListMetadata } from "@/lib/seo";

export const metadata: Metadata = generateToolsListMetadata();

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}
