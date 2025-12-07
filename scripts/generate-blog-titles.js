// Blog Title Generator Script | JavaScript
// Generates SEO-optimized blog titles from tools-config.ts

const fs = require('fs');
const path = require('path');

// Title templates - Natural language people actually search with
const titleTemplates = {
  converter: [
    "Free {name} Online",
    "{name} No Download",
    "{name} Without Installing",
    "How to Use {name}",
    "{name} Free Tool",
  ],
  image: [
    "Free {name} Online",
    "{name} No Sign Up",
    "{name} Without Photoshop",
    "How to Use {name}",
    "{name} Photo Editor",
  ],
  text: [
    "Free {name} Online",
    "{name} No Registration",
    "{name} Copy Paste",
    "How to Use {name}",
    "{name} Text Tool",
  ],
  dev: [
    "Free {name} Online",
    "{name} For Coding",
    "{name} Developer Tool",
    "How to Use {name}",
    "{name} Programming",
  ],
  generator: [
    "Free {name} Online",
    "{name} No Sign Up",
    "{name} Instant",
    "How to Use {name}",
    "{name} Generator Free",
  ],
  security: [
    "Free {name} Online",
    "{name} Safe and Private",
    "{name} No Upload",
    "How to Use {name}",
    "{name} Secure Tool",
  ],
  network: [
    "Free {name} Online",
    "{name} Check Now",
    "{name} Network Tool",
    "How to Use {name}",
    "{name} Free Check",
  ],
  misc: [
    "Free {name} Online",
    "{name} No Download",
    "{name} Any Device",
    "How to Use {name}",
    "{name} Simple Tool",
  ],
};

// Additional keyword-based modifiers (not used anymore to reduce routes)
const keywordModifiers = {
  convert: ["converter", "conversion", "transform"],
  image: ["photo", "picture", "image"],
  text: ["text", "string", "content"],
  free: ["free", "gratis", "no cost"],
  online: ["online", "web-based", "browser"],
  fast: ["fast", "quick", "instant"],
  secure: ["secure", "private", "safe"],
  easy: ["easy", "simple", "effortless"],
};

// Generate slug from title
function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// Parse tools-config.ts to extract tool data
function parseToolsConfig() {
  const configPath = path.join(__dirname, '..', 'lib', 'tools-config.ts');
  const content = fs.readFileSync(configPath, 'utf-8');
  
  const tools = [];
  const toolRegex = /\{\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*description:\s*"([^"]+)",\s*category:\s*"([^"]+)"[^}]*keywords:\s*\[([^\]]*)\]/g;
  
  let match;
  while ((match = toolRegex.exec(content)) !== null) {
    const keywords = match[5]
      .split(',')
      .map(k => k.trim().replace(/"/g, ''))
      .filter(k => k.length > 0);
    
    tools.push({
      slug: match[1],
      name: match[2],
      description: match[3],
      category: match[4],
      keywords: keywords,
    });
  }
  
  // Also match tools without keywords
  const toolRegexNoKeywords = /\{\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*description:\s*"([^"]+)",\s*category:\s*"([^"]+)"/g;
  
  while ((match = toolRegexNoKeywords.exec(content)) !== null) {
    const existing = tools.find(t => t.slug === match[1]);
    if (!existing) {
      tools.push({
        slug: match[1],
        name: match[2],
        description: match[3],
        category: match[4],
        keywords: [],
      });
    }
  }
  
  return tools;
}

// Generate titles for a tool
function generateTitlesForTool(tool) {
  const templates = titleTemplates[tool.category] || titleTemplates.misc;
  const titles = [];
  
  // Generate from templates (reduced to stay under 2048 route limit)
  templates.forEach(template => {
    const title = template.replace(/\{name\}/g, tool.name);
    titles.push({
      title,
      slug: generateSlug(title),
    });
  });
  
  // Removed keyword variations to reduce total routes
  // Previous: ~18 titles per tool (15 + 3 keyword)
  // Now: ~5 titles per tool (5 templates only)
  
  // Remove duplicates by slug
  const seen = new Set();
  return titles.filter(t => {
    if (seen.has(t.slug)) return false;
    seen.add(t.slug);
    return true;
  });
}

// Generate the blog-info.ts file
function generateBlogInfo() {
  const tools = parseToolsConfig();
  console.log(`Found ${tools.length} tools`);
  
  const blogEntries = [];
  
  tools.forEach(tool => {
    const titles = generateTitlesForTool(tool);
    titles.forEach(({ title, slug }) => {
      blogEntries.push({
        blogSlug: slug,
        toolSlug: tool.slug,
        title: title,
        description: tool.description,
        category: tool.category,
      });
    });
  });
  
  console.log(`Generated ${blogEntries.length} blog entries`);
  
  // Generate TypeScript file
  const tsContent = `// Auto-generated Blog Info | TypeScript
// Generated on: ${new Date().toISOString()}
// DO NOT EDIT MANUALLY - Run: node scripts/generate-blog-titles.js

export interface BlogEntry {
  blogSlug: string;
  toolSlug: string;
  title: string;
  description: string;
  category: string;
}

export const blogEntries: BlogEntry[] = ${JSON.stringify(blogEntries, null, 2)};

// Quick lookup map
export const blogSlugToTool: Record<string, string> = {
${blogEntries.map(e => `  "${e.blogSlug}": "${e.toolSlug}"`).join(',\n')}
};

// Get all blog entries for a tool
export function getBlogEntriesForTool(toolSlug: string): BlogEntry[] {
  return blogEntries.filter(e => e.toolSlug === toolSlug);
}

// Get blog entry by slug
export function getBlogEntryBySlug(blogSlug: string): BlogEntry | undefined {
  return blogEntries.find(e => e.blogSlug === blogSlug);
}

// Get tool slug from blog slug
export function getToolSlugFromBlogSlug(blogSlug: string): string | undefined {
  return blogSlugToTool[blogSlug];
}

// Get all unique blog slugs
export function getAllBlogSlugs(): string[] {
  return blogEntries.map(e => e.blogSlug);
}

// Total count
export const totalBlogEntries = ${blogEntries.length};
`;

  const outputPath = path.join(__dirname, '..', 'lib', 'blog-info.ts');
  fs.writeFileSync(outputPath, tsContent);
  console.log(`Written to ${outputPath}`);
  
  return blogEntries;
}

// Run
generateBlogInfo();
