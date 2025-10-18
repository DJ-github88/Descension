#!/usr/bin/env node

/**
 * Fix Bonus Action References
 * 
 * The game uses an Action Point system, not D&D's bonus action system.
 * This script fixes all instances of BONUS_ACTION and FREE_ACTION to use
 * the proper Action Point system with IMMEDIATE cast time.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILES_TO_FIX = [
  'src/data/classes/bladedancerData.js',
  'src/data/classes/chronarchData.js',
  'src/data/classes/covenbaneData.js',
  'src/data/classes/deathcallerData.js',
  'src/data/classes/exorcistData.js',
  'src/data/classes/huntressData.js',
  'src/data/classes/lichborneData.js',
  'src/data/classes/lunarchData.js',
  'src/data/classes/oracleData.js',
  'src/data/classes/primalistData.js',
  'src/data/classes/titanData.js',
  'src/data/classes/toxicologistData.js',
  'src/data/classes/wardenData.js'
];

function fixFile(filePath) {
  console.log(`\n📄 Fixing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changeCount = 0;
  
  // Fix 1: Change spellType: 'BONUS_ACTION' to spellType: 'ACTION'
  const spellTypePattern = /spellType:\s*'BONUS_ACTION'/g;
  const spellTypeMatches = content.match(spellTypePattern);
  if (spellTypeMatches) {
    content = content.replace(spellTypePattern, "spellType: 'ACTION'");
    changeCount += spellTypeMatches.length;
    console.log(`  ✓ Fixed ${spellTypeMatches.length} spellType: 'BONUS_ACTION' → 'ACTION'`);
  }
  
  // Fix 2: Change spellType: 'FREE_ACTION' to spellType: 'ACTION'
  const freeActionPattern = /spellType:\s*'FREE_ACTION'/g;
  const freeActionMatches = content.match(freeActionPattern);
  if (freeActionMatches) {
    content = content.replace(freeActionPattern, "spellType: 'ACTION'");
    changeCount += freeActionMatches.length;
    console.log(`  ✓ Fixed ${freeActionMatches.length} spellType: 'FREE_ACTION' → 'ACTION'`);
  }
  
  // Fix 3: Change castTimeType: 'BONUS_ACTION' to castTimeType: 'IMMEDIATE'
  const castTimePattern = /castTimeType:\s*'BONUS_ACTION'/g;
  const castTimeMatches = content.match(castTimePattern);
  if (castTimeMatches) {
    content = content.replace(castTimePattern, "castTimeType: 'IMMEDIATE'");
    changeCount += castTimeMatches.length;
    console.log(`  ✓ Fixed ${castTimeMatches.length} castTimeType: 'BONUS_ACTION' → 'IMMEDIATE'`);
  }
  
  // Fix 4: Change castTimeType: 'FREE_ACTION' to castTimeType: 'IMMEDIATE'
  const freeCastTimePattern = /castTimeType:\s*'FREE_ACTION'/g;
  const freeCastTimeMatches = content.match(freeCastTimePattern);
  if (freeCastTimeMatches) {
    content = content.replace(freeCastTimePattern, "castTimeType: 'IMMEDIATE'");
    changeCount += freeCastTimeMatches.length;
    console.log(`  ✓ Fixed ${freeCastTimeMatches.length} castTimeType: 'FREE_ACTION' → 'IMMEDIATE'`);
  }
  
  // Fix 5: Ensure actionPoints is set in resourceCost (add if missing)
  // Look for resourceCost blocks that have actionPoints: 0 and might need updating
  // This is more complex, so we'll just report on it
  const zeroAPPattern = /actionPoints:\s*0/g;
  const zeroAPMatches = content.match(zeroAPPattern);
  if (zeroAPMatches) {
    console.log(`  ℹ️  Found ${zeroAPMatches.length} spells with actionPoints: 0 (may need manual review)`);
  }
  
  if (changeCount > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✅ Saved ${changeCount} changes to ${filePath}`);
  } else {
    console.log(`  ⏭️  No changes needed`);
  }
  
  return changeCount;
}

console.log('🔧 Fixing BONUS_ACTION and FREE_ACTION references...\n');
console.log('=' .repeat(60));

let totalChanges = 0;

for (const file of FILES_TO_FIX) {
  const fullPath = path.join(__dirname, file);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`\n⚠️  File not found: ${file}`);
    continue;
  }
  
  const changes = fixFile(fullPath);
  totalChanges += changes;
}

console.log('\n' + '='.repeat(60));
console.log(`\n✅ Complete! Fixed ${totalChanges} total instances across ${FILES_TO_FIX.length} files.`);
console.log('\n📝 Note: Spells with actionPoints: 0 may need manual review.');
console.log('   Quick actions should cost 1 AP, standard actions 2 AP.');
console.log('   Only REACTION spells should have 0 AP cost.\n');

