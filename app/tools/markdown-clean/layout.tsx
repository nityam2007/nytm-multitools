import { Metadata } from "next";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-config";

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata("markdown-clean");
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const tool = getToolBySlug("markdown-clean");
  const jsonLd = tool ? generateToolJsonLd(tool) : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      {children}
    </>
  );
}
