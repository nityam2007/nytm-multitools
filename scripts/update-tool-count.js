// Update Tool Count Script | JavaScript
// Reads tools-config.ts and updates hardcoded tool counts in static files

const fs = require('fs');
const path = require('path');

// Read tools config to count tools
const configPath = path.join(__dirname, '../lib/tools-config.ts');
const configContent = fs.readFileSync(configPath, 'utf-8');

// Count all slug entries (each slug = 1 tool)
const slugMatches = configContent.matchAll(/slug:\s*["']([^"']+)["']/g);
const slugs = [...slugMatches].map(m => m[1]);
const toolCount = slugs.length;

console.log(`\n📊 Found ${toolCount} tools in tools-config.ts\n`);

// Files and patterns to update
const updates = [
  {
    file: '../app/layout.tsx',
    patterns: [
      { regex: /const TOOL_COUNT = \d+;/, replacement: `const TOOL_COUNT = ${toolCount};` }
    ]
  },
  {
    file: '../README.md',
    patterns: [
      { regex: /\d+\+ tools across/, replacement: `${toolCount}+ tools across` }
    ]
  },
  {
    file: '../package.json',
    patterns: [
      // Add or update toolCount field
      { regex: /"toolCount":\s*\d+/, replacement: `"toolCount": ${toolCount}` }
    ],
    // Special handling for package.json - add toolCount if missing
    addIfMissing: { key: 'toolCount', value: toolCount }
  }
];

let updatedCount = 0;

for (const update of updates) {
  const filePath = path.join(__dirname, update.file);
  
  if (!fs.existsSync(filePath)) {
    console.log(`⚠️  File not found: ${update.file}`);
    continue;
  }

  let content = fs.readFileSync(filePath, 'utf-8');
  let fileUpdated = false;

  for (const pattern of update.patterns) {
    if (pattern.regex.test(content)) {
      const oldMatch = content.match(pattern.regex)?.[0];
      content = content.replace(pattern.regex, pattern.replacement);
      if (oldMatch !== pattern.replacement) {
        console.log(`✅ ${update.file}: "${oldMatch}" → "${pattern.replacement}"`);
        fileUpdated = true;
      }
    }
  }

  // Special handling for package.json - add toolCount if missing
  if (update.addIfMissing && update.file.includes('package.json')) {
    if (!content.includes('"toolCount"')) {
      // Add toolCount after "private": true
      content = content.replace(
        /"private":\s*true,/,
        `"private": true,\n  "toolCount": ${toolCount},`
      );
      console.log(`✅ ${update.file}: Added "toolCount": ${toolCount}`);
      fileUpdated = true;
    }
  }

  if (fileUpdated) {
    fs.writeFileSync(filePath, content);
    updatedCount++;
  }
}

console.log(`\n✨ Updated ${updatedCount} file(s) with tool count: ${toolCount}\n`);

// Also output for CI/CD or other scripts
console.log(`TOOL_COUNT=${toolCount}`);
