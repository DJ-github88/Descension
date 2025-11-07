#!/usr/bin/env node

/**
 * Fix Action Descriptions
 * 
 * Replace all text references to "bonus action" and "free action" with
 * proper Action Point terminology throughout class data files.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const FILES_TO_FIX = [
  'src/data/classes/bladedancerData.js',
  'src/data/classes/chronarchData.js',
  'src/data/classes/deathcallerData.js',
  'src/data/classes/exorcistData.js',
  'src/data/classes/fateWeaverData.js',
  'src/data/classes/huntressData.js',
  'src/data/classes/inscriptorData.js',
  'src/data/classes/lichborneData.js'
];

function fixFile(filePath) {
  console.log(`\n📄 Fixing: ${filePath}`);
  
  let content = fs.readFileSync(filePath, 'utf8');
  let changeCount = 0;
  
  // Fix 1: "as a bonus action" → "for 1 AP"
  const asABonusActionPattern = /as a bonus action/gi;
  const matches1 = content.match(asABonusActionPattern);
  if (matches1) {
    content = content.replace(asABonusActionPattern, 'for 1 AP');
    changeCount += matches1.length;
    console.log(`  ✓ Fixed ${matches1.length} "as a bonus action" → "for 1 AP"`);
  }
  
  // Fix 2: "as a free action" → "for 0 AP (free)"
  const asAFreeActionPattern = /as a free action/gi;
  const matches2 = content.match(asAFreeActionPattern);
  if (matches2) {
    content = content.replace(asAFreeActionPattern, 'for 0 AP (free)');
    changeCount += matches2.length;
    console.log(`  ✓ Fixed ${matches2.length} "as a free action" → "for 0 AP (free)"`);
  }
  
  // Fix 3: "Bonus action" (standalone) → "1 AP"
  const bonusActionStandalonePattern = /\bBonus action\b/g;
  const matches3 = content.match(bonusActionStandalonePattern);
  if (matches3) {
    content = content.replace(bonusActionStandalonePattern, '1 AP');
    changeCount += matches3.length;
    console.log(`  ✓ Fixed ${matches3.length} "Bonus action" → "1 AP"`);
  }
  
  // Fix 4: "bonus action to activate" → "1 AP to activate"
  const bonusActionToActivatePattern = /bonus action to activate/gi;
  const matches4 = content.match(bonusActionToActivatePattern);
  if (matches4) {
    content = content.replace(bonusActionToActivatePattern, '1 AP to activate');
    changeCount += matches4.length;
    console.log(`  ✓ Fixed ${matches4.length} "bonus action to activate" → "1 AP to activate"`);
  }
  
  // Fix 5: "free action to deactivate" → "0 AP to deactivate"
  const freeActionToDeactivatePattern = /free action to deactivate/gi;
  const matches5 = content.match(freeActionToDeactivatePattern);
  if (matches5) {
    content = content.replace(freeActionToDeactivatePattern, '0 AP to deactivate');
    changeCount += matches5.length;
    console.log(`  ✓ Fixed ${matches5.length} "free action to deactivate" → "0 AP to deactivate"`);
  }
  
  // Fix 6: cost: 'Bonus Action' → cost: '1 AP'
  const costBonusActionPattern = /cost:\s*'Bonus Action'/g;
  const matches6 = content.match(costBonusActionPattern);
  if (matches6) {
    content = content.replace(costBonusActionPattern, "cost: '1 AP'");
    changeCount += matches6.length;
    console.log(`  ✓ Fixed ${matches6.length} cost: 'Bonus Action' → cost: '1 AP'`);
  }
  
  // Fix 7: "Commanding a demon is a bonus action" → "Commanding a demon costs 1 AP"
  const commandingPattern = /Commanding a demon is a bonus action/gi;
  const matches7 = content.match(commandingPattern);
  if (matches7) {
    content = content.replace(commandingPattern, 'Commanding a demon costs 1 AP');
    changeCount += matches7.length;
    console.log(`  ✓ Fixed ${matches7.length} demon commanding text`);
  }
  
  // Fix 8: "additional movement or bonus actions" → "additional movement or action points"
  const additionalPattern = /additional movement or bonus actions/gi;
  const matches8 = content.match(additionalPattern);
  if (matches8) {
    content = content.replace(additionalPattern, 'additional movement or action points');
    changeCount += matches8.length;
    console.log(`  ✓ Fixed ${matches8.length} additional movement text`);
  }
  
  // Fix 9: action: 'bonus action' → action: '1 AP'
  const actionBonusActionPattern = /action:\s*'bonus action'/gi;
  const matches9 = content.match(actionBonusActionPattern);
  if (matches9) {
    content = content.replace(actionBonusActionPattern, "action: '1 AP'");
    changeCount += matches9.length;
    console.log(`  ✓ Fixed ${matches9.length} action: 'bonus action' → action: '1 AP'`);
  }
  
  // Fix 10: frequency: 'Bonus action' → frequency: '1 AP'
  const frequencyPattern = /frequency:\s*'Bonus action/gi;
  const matches10 = content.match(frequencyPattern);
  if (matches10) {
    content = content.replace(frequencyPattern, "frequency: '1 AP");
    changeCount += matches10.length;
    console.log(`  ✓ Fixed ${matches10.length} frequency: 'Bonus action' → frequency: '1 AP'`);
  }
  
  if (changeCount > 0) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`  ✅ Saved ${changeCount} changes to ${filePath}`);
  } else {
    console.log(`  ⏭️  No changes needed`);
  }
  
  return changeCount;
}

console.log('🔧 Fixing action description text...\n');
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
console.log(`\n✅ Complete! Fixed ${totalChanges} total text references.`);
console.log('\n📝 All "bonus action" and "free action" text has been converted to AP costs.\n');

