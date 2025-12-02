import { Metadata } from "next";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-config";

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata("json-escape");
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const tool = getToolBySlug("json-escape");
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
