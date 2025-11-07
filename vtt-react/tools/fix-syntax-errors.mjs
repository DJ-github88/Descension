#!/usr/bin/env node

/**
 * Fix Syntax Errors from Cleanup Script
 * 
 * The cleanup script accidentally removed commas after lines that had
 * dateCreated/lastModified/categoryIds removed. This fixes those.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILES_TO_FIX = [
  'src/data/additionalSpells.js',
  'src/data/customSpellLibraryData.js'
];

function fixFile(filePath) {
  console.log(`\n📄 Fixing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changeCount = 0;
  
  // Fix: resolution: 'DICE'\n    visualTheme
  // Should be: resolution: 'DICE',\n    visualTheme
  const patterns = [
    {
      regex: /resolution: 'DICE'\s*\n(\s+)(visualTheme|castingDescription|effectDescription)/g,
      replacement: "resolution: 'DICE',\n$1$2",
      name: "resolution: 'DICE' missing comma"
    },
    {
      regex: /resolution: 'CARDS'\s*\n(\s+)(visualTheme|castingDescription|effectDescription)/g,
      replacement: "resolution: 'CARDS',\n$1$2",
      name: "resolution: 'CARDS' missing comma"
    },
    {
      regex: /resolution: 'COINS'\s*\n(\s+)(visualTheme|castingDescription|effectDescription)/g,
      replacement: "resolution: 'COINS',\n$1$2",
      name: "resolution: 'COINS' missing comma"
    }
  ];
  
  for (const pattern of patterns) {
    const matches = content.match(pattern.regex);
    if (matches) {
      content = content.replace(pattern.regex, pattern.replacement);
      changeCount += matches.length;
      console.log(`  ✓ Fixed ${matches.length} instances of ${pattern.name}`);
    }
  }
  
  if (changeCount > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✅ Saved ${filePath} with ${changeCount} fixes`);
    return changeCount;
  } else {
    console.log(`  ℹ️  No fixes needed`);
    return 0;
  }
}

console.log('🔧 Syntax Error Fix Script');
console.log('===========================\n');
console.log('Fixing missing commas from cleanup script...\n');

let totalFixes = 0;

for (const file of FILES_TO_FIX) {
  const fullPath = path.join(__dirname, file);
  
  if (fs.existsSync(fullPath)) {
    const fixes = fixFile(fullPath);
    totalFixes += fixes;
  } else {
    console.log(`\n⚠️  File not found: ${file}`);
  }
}

console.log('\n' + '='.repeat(50));
console.log(`\n✅ Fix complete!`);
console.log(`   Total fixes: ${totalFixes}`);
console.log(`   Files processed: ${FILES_TO_FIX.length}\n`);

