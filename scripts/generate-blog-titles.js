// Blog Title Generator Script | JavaScript
// Generates SEO-optimized blog titles from tools-config.ts

const fs = require('fs');
const path = require('path');

// Title templates for different tool categories
const titleTemplates = {
  converter: [
    "Free {name} Online - No Sign Up Required",
    "{name} - 100% Free, No Registration",
    "Best Free {name} Tool Online",
    "{name} Instantly - Free & Fast",
    "Online {name} - No Download Needed",
    "Free {name} Without Watermark",
    "{name} in Seconds - Completely Free",
    "Quick {name} Online Tool",
    "{name} - Free Browser-Based Tool",
    "Convert Files Free with {name}",
    "Instant {name} - No Email Required",
    "{name} Tool - Fast & Secure",
    "Free Online {name} - Works on Any Device",
    "{name} Without Registration",
    "Best {name} Tool 2025",
  ],
  image: [
    "Free {name} Online - No Sign Up",
    "{name} - 100% Free Tool",
    "Best Free {name} Online",
    "{name} Instantly - No Registration",
    "Online {name} - No Download Required",
    "Free {name} - No Watermark",
    "{name} in Seconds - Free",
    "Quick {name} Tool Online",
    "{name} - Browser-Based & Free",
    "Free {name} Without Email",
    "{name} - Fast & Secure",
    "Online {name} for Free",
    "{name} Without Account",
    "Easy {name} Tool - Free",
    "Best {name} 2025",
  ],
  text: [
    "Free {name} Online Tool",
    "{name} - No Sign Up Needed",
    "Best {name} Tool Free",
    "{name} Instantly Online",
    "Online {name} - 100% Free",
    "Free {name} - No Registration",
    "{name} Tool - Fast & Easy",
    "Quick {name} Online",
    "{name} - Free Browser Tool",
    "Free Online {name}",
    "{name} Without Login",
    "{name} - Secure & Private",
    "Easy {name} Tool Online",
    "{name} Free - No Download",
    "Best Free {name} 2025",
  ],
  dev: [
    "Free {name} for Developers",
    "{name} Online - No Install",
    "Best {name} Tool Free",
    "{name} - Developer Tool Online",
    "Online {name} - Free & Fast",
    "Free {name} - No Sign Up",
    "{name} Tool for Programmers",
    "Quick {name} Online",
    "{name} - Free Dev Tool",
    "Free Online {name} Tool",
    "{name} Without Registration",
    "{name} - Browser-Based",
    "Easy {name} for Coding",
    "Best {name} Online 2025",
    "{name} - Free for Everyone",
  ],
  generator: [
    "Free {name} Online",
    "{name} - No Registration",
    "Best Free {name} Tool",
    "{name} Instantly - Free",
    "Online {name} Generator Free",
    "Free {name} - No Sign Up",
    "{name} Tool - Quick & Easy",
    "Generate with {name} Free",
    "{name} - Free Online Tool",
    "Free {name} Without Email",
    "{name} - Fast Generator",
    "Online {name} for Free",
    "{name} Without Account",
    "Easy {name} Generator",
    "Best {name} Generator 2025",
  ],
  security: [
    "Free {name} Online - Secure",
    "{name} - 100% Private & Free",
    "Best Free {name} Tool",
    "{name} - No Data Stored",
    "Online {name} - Client-Side Only",
    "Free {name} - No Registration",
    "{name} Tool - Secure & Fast",
    "Private {name} Online",
    "{name} - Free & Encrypted",
    "Free Secure {name}",
    "{name} Without Sign Up",
    "{name} - Browser-Based Security",
    "Safe {name} Tool Online",
    "Best Secure {name} 2025",
    "{name} - Your Data Stays Private",
  ],
  network: [
    "Free {name} Online Tool",
    "{name} - No Sign Up Required",
    "Best Free {name}",
    "{name} - Instant Results",
    "Online {name} - 100% Free",
    "Free {name} Checker",
    "{name} Tool - Fast & Easy",
    "Quick {name} Online",
    "{name} - Free Network Tool",
    "Free Online {name}",
    "{name} Without Registration",
    "{name} - Browser-Based",
    "Easy {name} Tool",
    "Best {name} Tool 2025",
    "{name} - Free for Everyone",
  ],
  misc: [
    "Free {name} Online",
    "{name} - No Registration Needed",
    "Best Free {name} Tool",
    "{name} - Quick & Easy",
    "Online {name} - 100% Free",
    "Free {name} - No Sign Up",
    "{name} Tool - Instant",
    "Fast {name} Online",
    "{name} - Free Browser Tool",
    "Free Online {name}",
    "{name} Without Login",
    "{name} - Simple & Free",
    "Easy {name} Tool Online",
    "Best {name} 2025",
    "{name} - Free Forever",
  ],
};

// Additional keyword-based modifiers
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
  
  // Generate from templates
  templates.forEach(template => {
    const title = template.replace(/\{name\}/g, tool.name);
    titles.push({
      title,
      slug: generateSlug(title),
    });
  });
  
  // Add keyword variations
  if (tool.keywords && tool.keywords.length > 0) {
    const keywordTitles = [
      `Free ${tool.name} - ${tool.keywords[0]} Made Easy`,
      `${tool.name} Online - Best ${tool.keywords[0]} Tool`,
      `${tool.keywords[0].charAt(0).toUpperCase() + tool.keywords[0].slice(1)} with ${tool.name} Free`,
    ];
    
    keywordTitles.forEach(title => {
      titles.push({
        title,
        slug: generateSlug(title),
      });
    });
  }
  
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
