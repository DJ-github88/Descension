#!/usr/bin/env node

/**
 * Cleanup Spell Metadata Script
 * 
 * Removes redundant metadata from spell data files:
 * - dateCreated
 * - lastModified
 * - categoryIds (when empty)
 * - Simplifies instant duration configs
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILES_TO_CLEAN = [
  'src/data/additionalSpells.js',
  'src/data/customSpellLibraryData.js',
  'src/data/classSpellTemplates.js',
  'src/data/enhancedBackgroundData.js',
  'src/data/enhancedPathData.js',
  'src/data/generalSpellsData.js'
];

function cleanupFile(filePath) {
  console.log(`\n📄 Processing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changeCount = 0;
  
  // Remove dateCreated lines
  const dateCreatedRegex = /,?\s*dateCreated:\s*new Date\(\)\.toISOString\(\),?\s*\n/g;
  const dateCreatedMatches = content.match(dateCreatedRegex);
  if (dateCreatedMatches) {
    content = content.replace(dateCreatedRegex, '\n');
    changeCount += dateCreatedMatches.length;
    console.log(`  ✓ Removed ${dateCreatedMatches.length} dateCreated lines`);
  }
  
  // Remove lastModified lines
  const lastModifiedRegex = /,?\s*lastModified:\s*new Date\(\)\.toISOString\(\),?\s*\n/g;
  const lastModifiedMatches = content.match(lastModifiedRegex);
  if (lastModifiedMatches) {
    content = content.replace(lastModifiedRegex, '\n');
    changeCount += lastModifiedMatches.length;
    console.log(`  ✓ Removed ${lastModifiedMatches.length} lastModified lines`);
  }
  
  // Remove empty categoryIds lines
  const categoryIdsRegex = /,?\s*categoryIds:\s*\[\],?\s*\n/g;
  const categoryIdsMatches = content.match(categoryIdsRegex);
  if (categoryIdsMatches) {
    content = content.replace(categoryIdsRegex, '\n');
    changeCount += categoryIdsMatches.length;
    console.log(`  ✓ Removed ${categoryIdsMatches.length} empty categoryIds lines`);
  }
  
  // Simplify instant duration configs
  // Before: durationConfig: { durationType: 'instant', durationValue: 0 }
  // After: durationConfig: { durationType: 'instant' }
  const instantDurationRegex = /durationConfig:\s*\{\s*durationType:\s*['"]instant['"],\s*durationValue:\s*0\s*\}/g;
  const instantDurationMatches = content.match(instantDurationRegex);
  if (instantDurationMatches) {
    content = content.replace(instantDurationRegex, "durationConfig: { durationType: 'instant' }");
    changeCount += instantDurationMatches.length;
    console.log(`  ✓ Simplified ${instantDurationMatches.length} instant duration configs`);
  }
  
  // Clean up multiple consecutive blank lines (more than 2)
  content = content.replace(/\n\n\n+/g, '\n\n');
  
  if (changeCount > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✅ Saved ${filePath} with ${changeCount} changes`);
    return changeCount;
  } else {
    console.log(`  ℹ️  No changes needed`);
    return 0;
  }
}

console.log('🧹 Spell Metadata Cleanup Script');
console.log('=================================\n');
console.log('Removing redundant metadata from spell files...\n');

let totalChanges = 0;

for (const file of FILES_TO_CLEAN) {
  const fullPath = path.join(__dirname, file);
  
  if (fs.existsSync(fullPath)) {
    const changes = cleanupFile(fullPath);
    totalChanges += changes;
  } else {
    console.log(`\n⚠️  File not found: ${file}`);
  }
}

console.log('\n' + '='.repeat(50));
console.log(`\n✅ Cleanup complete!`);
console.log(`   Total changes: ${totalChanges}`);
console.log(`   Files processed: ${FILES_TO_CLEAN.length}\n`);

