#!/usr/bin/env node
// Update Changelog Script | JavaScript
// Usage: node scripts/update-changelog.js
// Interactive CLI to add new changelog entries without destroying existing code

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const CHANGELOG_FILE = path.join(__dirname, '..', 'components', 'Changelog.tsx');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (prompt) => new Promise((resolve) => rl.question(prompt, resolve));

async function main() {
  console.log('\n📝 NYTM Changelog Updater\n');
  console.log('─'.repeat(40));

  // Read current file
  if (!fs.existsSync(CHANGELOG_FILE)) {
    console.error('❌ Changelog.tsx not found at:', CHANGELOG_FILE);
    rl.close();
    process.exit(1);
  }

  const content = fs.readFileSync(CHANGELOG_FILE, 'utf8');

  // Extract existing changelog array
  const changelogMatch = content.match(/const changelog: ChangelogEntry\[\] = \[([\s\S]*?)\n\];/);
  if (!changelogMatch) {
    console.error('❌ Could not find changelog array in file');
    rl.close();
    process.exit(1);
  }

  console.log('\n📋 Options:');
  console.log('  1. Add new version entry');
  console.log('  2. Add change to latest version');
  console.log('  3. View current changelog');
  console.log('  4. Exit\n');

  const choice = await question('Select option (1-4): ');

  switch (choice.trim()) {
    case '1':
      await addNewVersion(content);
      break;
    case '2':
      await addToLatest(content);
      break;
    case '3':
      viewChangelog(content);
      break;
    case '4':
      console.log('\n👋 Bye!\n');
      break;
    default:
      console.log('\n❌ Invalid option\n');
  }

  rl.close();
}

async function addNewVersion(content) {
  console.log('\n📦 Create New Version Entry\n');

  // Get version
  const version = await question('Version (e.g., 1.6.0): ');
  if (!version.trim()) {
    console.log('❌ Version is required');
    return;
  }

  // Get date
  const today = new Date();
  const defaultDate = today.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const dateInput = await question(`Date (${defaultDate}): `);
  const date = dateInput.trim() || defaultDate;

  // Get changes
  console.log('\n📝 Add changes (empty line to finish):');
  console.log('   Format: type:description');
  console.log('   Types: new, improved, fixed\n');

  const changes = [];
  while (true) {
    const changeInput = await question(`  Change ${changes.length + 1}: `);
    if (!changeInput.trim()) break;

    const [type, ...descParts] = changeInput.split(':');
    const desc = descParts.join(':').trim();

    if (!['new', 'improved', 'fixed'].includes(type.trim().toLowerCase())) {
      console.log('    ⚠️  Invalid type. Use: new, improved, or fixed');
      continue;
    }

    if (!desc) {
      console.log('    ⚠️  Description is required');
      continue;
    }

    changes.push({
      type: type.trim().toLowerCase(),
      text: desc
    });
    console.log(`    ✅ Added: [${type.trim()}] ${desc}`);
  }

  if (changes.length === 0) {
    console.log('\n❌ No changes added. Aborting.\n');
    return;
  }

  // Build new entry
  const changesStr = changes.map(c => 
    `      { type: "${c.type}", text: "${escapeString(c.text)}" }`
  ).join(',\n');

  const newEntry = `  {
    date: "${date}",
    version: "${version}",
    changes: [
${changesStr},
    ],
  },
  `;

  // Insert after "const changelog: ChangelogEntry[] = ["
  const insertPoint = content.indexOf('const changelog: ChangelogEntry[] = [') + 'const changelog: ChangelogEntry[] = ['.length;
  const newContent = content.slice(0, insertPoint) + '\n' + newEntry + content.slice(insertPoint);

  // Write file
  fs.writeFileSync(CHANGELOG_FILE, newContent, 'utf8');

  console.log(`\n✅ Added version ${version} with ${changes.length} change(s)`);
  console.log('📁 File updated:', CHANGELOG_FILE);
  console.log('\n💡 Don\'t forget to commit and push!\n');
}

async function addToLatest(content) {
  console.log('\n➕ Add Change to Latest Version\n');

  // Find latest version info
  const versionMatch = content.match(/date: "([^"]+)",\s*\n\s*version: "([^"]+)"/);
  if (versionMatch) {
    console.log(`Current latest: v${versionMatch[2]} (${versionMatch[1]})\n`);
  }

  console.log('Format: type:description');
  console.log('Types: new, improved, fixed\n');

  const changeInput = await question('Change: ');
  if (!changeInput.trim()) {
    console.log('❌ No change provided');
    return;
  }

  const [type, ...descParts] = changeInput.split(':');
  const desc = descParts.join(':').trim();

  if (!['new', 'improved', 'fixed'].includes(type.trim().toLowerCase())) {
    console.log('❌ Invalid type. Use: new, improved, or fixed');
    return;
  }

  if (!desc) {
    console.log('❌ Description is required');
    return;
  }

  // Find first "changes: [" and add after it
  const changesIndex = content.indexOf('changes: [');
  if (changesIndex === -1) {
    console.log('❌ Could not find changes array');
    return;
  }

  const insertPoint = changesIndex + 'changes: ['.length;
  const newChange = `\n      { type: "${type.trim().toLowerCase()}", text: "${escapeString(desc)}" },`;

  const newContent = content.slice(0, insertPoint) + newChange + content.slice(insertPoint);

  fs.writeFileSync(CHANGELOG_FILE, newContent, 'utf8');

  console.log(`\n✅ Added: [${type.trim()}] ${desc}`);
  console.log('📁 File updated:', CHANGELOG_FILE);
  console.log('\n💡 Don\'t forget to commit and push!\n');
}

function viewChangelog(content) {
  console.log('\n📋 Current Changelog Entries:\n');

  // Parse entries (simple regex extraction)
  const dateMatches = [...content.matchAll(/date: "([^"]+)"/g)];
  const versionMatches = [...content.matchAll(/version: "([^"]+)"/g)];

  for (let i = 0; i < dateMatches.length; i++) {
    const date = dateMatches[i]?.[1] || 'Unknown';
    const version = versionMatches[i]?.[1] || '';
    console.log(`  ${i + 1}. ${version ? `v${version}` : ''} - ${date}`);
  }

  console.log('\n');
}

function escapeString(str) {
  return str.replace(/\\/g, '\\\\').replace(/"/g, '\\"').replace(/'/g, "\\'");
}

main().catch(console.error);
