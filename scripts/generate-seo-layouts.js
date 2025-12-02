const fs = require('fs');
const path = require('path');

// Read tools config to get all slugs
const configPath = path.join(__dirname, '../lib/tools-config.ts');
const configContent = fs.readFileSync(configPath, 'utf-8');

// Extract all slug values
const slugMatches = configContent.matchAll(/slug:\s*["']([^"']+)["']/g);
const slugs = [...slugMatches].map(m => m[1]);

console.log('Found', slugs.length, 'tools');

// Template for layout.tsx
const layoutTemplate = (slug) => `import { Metadata } from "next";
import { generateToolMetadata, generateToolJsonLd } from "@/lib/seo";
import { getToolBySlug } from "@/lib/tools-config";

export async function generateMetadata(): Promise<Metadata> {
  return generateToolMetadata("${slug}");
}

export default function Layout({ children }: { children: React.ReactNode }) {
  const tool = getToolBySlug("${slug}");
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
`;

// Create layout.tsx for each tool
let created = 0;
let skipped = 0;
for (const slug of slugs) {
  const toolDir = path.join(__dirname, '../app/tools', slug);
  const layoutPath = path.join(toolDir, 'layout.tsx');
  
  if (fs.existsSync(toolDir)) {
    if (!fs.existsSync(layoutPath)) {
      fs.writeFileSync(layoutPath, layoutTemplate(slug));
      created++;
    } else {
      skipped++;
    }
  } else {
    console.log('Directory not found:', slug);
  }
}

console.log('Created', created, 'layout.tsx files');
console.log('Skipped', skipped, 'existing files');
