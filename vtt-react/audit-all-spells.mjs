#!/usr/bin/env node

/**
 * Comprehensive Spell Audit Script
 * 
 * Checks all spell data files for:
 * - Incomplete stat modifiers
 * - String-based status effects
 * - Missing scaling on damage/healing
 * - Missing saving throws
 * - Missing action points
 * - Redundant metadata
 * - Bloated descriptions
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SPELL_FILES = [
  'src/data/additionalSpells.js',
  'src/data/customSpellLibraryData.js',
  'src/data/enhancedSpellLibrary.js',
  'src/data/enhancedPathData.js',
  'src/data/enhancedBackgroundData.js',
  'src/data/classSpellTemplates.js',
  'src/data/generalSpellsData.js'
];

function auditFile(filePath) {
  const fileName = path.basename(filePath);
  console.log(`\n${'='.repeat(60)}`);
  console.log(`📄 ${fileName}`);
  console.log('='.repeat(60));
  
  if (!fs.existsSync(filePath)) {
    console.log('  ⚠️  File not found');
    return null;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const issues = {
    bloatedDescriptions: 0,
    incompleteStatModifiers: 0,
    stringStatusEffects: 0,
    missingScaling: 0,
    missingSavingThrows: 0,
    missingActionPoints: 0,
    redundantMetadata: 0,
    totalSpells: 0
  };
  
  // Count bloated descriptions
  const bloatedMatches = content.match(/You focus your will and speak the incantation/g);
  if (bloatedMatches) {
    issues.bloatedDescriptions = bloatedMatches.length;
  }
  
  // Count incomplete stat modifiers (missing magnitude or magnitudeType)
  const statModifierMatches = content.match(/stat:\s*['"][a-z]+['"]\s*,\s*value:\s*-?\d+(?!\s*,\s*magnitude)/g);
  if (statModifierMatches) {
    issues.incompleteStatModifiers = statModifierMatches.length;
  }
  
  // Count string-based status effects
  const stringEffectMatches = content.match(/statusEffects:\s*\[\s*['"][a-z_]+['"]/g);
  if (stringEffectMatches) {
    issues.stringStatusEffects = stringEffectMatches.length;
  }
  
  // Count damage configs without scaling
  const damageNoScalingMatches = content.match(/formula:\s*['"][^'"]+['"]\s*,(?!\s*scaling)/g);
  if (damageNoScalingMatches) {
    // Filter out formulas that already have + stat
    const actuallyMissing = damageNoScalingMatches.filter(match => 
      !match.includes('+ intelligence') && 
      !match.includes('+ spirit') && 
      !match.includes('+ strength') &&
      !match.includes('+ agility') &&
      !match.includes('+ constitution') &&
      !match.includes('+ charisma')
    );
    issues.missingScaling = actuallyMissing.length;
  }
  
  // Count damage configs without saving throws
  const damageNoSaveMatches = content.match(/damageConfig:\s*\{[^}]*elementType:[^}]*\}/gs);
  if (damageNoSaveMatches) {
    const withoutSaves = damageNoSaveMatches.filter(match => !match.includes('savingThrow'));
    issues.missingSavingThrows = withoutSaves.length;
  }
  
  // Count spells without action points
  const resourceCostMatches = content.match(/resourceCost:\s*\{[^}]*\}/gs);
  if (resourceCostMatches) {
    const withoutAP = resourceCostMatches.filter(match => !match.includes('actionPoints'));
    issues.missingActionPoints = withoutAP.length;
  }
  
  // Count redundant metadata
  const dateCreatedMatches = content.match(/dateCreated:/g);
  const lastModifiedMatches = content.match(/lastModified:/g);
  const categoryIdsMatches = content.match(/categoryIds:\s*\[\]/g);
  
  issues.redundantMetadata = 
    (dateCreatedMatches?.length || 0) + 
    (lastModifiedMatches?.length || 0) + 
    (categoryIdsMatches?.length || 0);
  
  // Estimate total spells (count spell objects)
  const spellMatches = content.match(/\{\s*id:\s*['"][^'"]+['"]/g);
  if (spellMatches) {
    issues.totalSpells = spellMatches.length;
  }
  
  // Print results
  console.log(`\n📊 Statistics:`);
  console.log(`  Total Spells/Abilities: ${issues.totalSpells}`);
  
  console.log(`\n⚠️  Issues Found:`);
  
  if (issues.bloatedDescriptions > 0) {
    console.log(`  ❌ Bloated Descriptions: ${issues.bloatedDescriptions}`);
  } else {
    console.log(`  ✅ Bloated Descriptions: 0`);
  }
  
  if (issues.incompleteStatModifiers > 0) {
    console.log(`  ❌ Incomplete Stat Modifiers: ${issues.incompleteStatModifiers}`);
  } else {
    console.log(`  ✅ Incomplete Stat Modifiers: 0`);
  }
  
  if (issues.stringStatusEffects > 0) {
    console.log(`  ❌ String Status Effects: ${issues.stringStatusEffects}`);
  } else {
    console.log(`  ✅ String Status Effects: 0`);
  }
  
  if (issues.missingScaling > 0) {
    console.log(`  ⚠️  Missing Scaling: ${issues.missingScaling}`);
  } else {
    console.log(`  ✅ Missing Scaling: 0`);
  }
  
  if (issues.missingSavingThrows > 0) {
    console.log(`  ⚠️  Missing Saving Throws: ${issues.missingSavingThrows}`);
  } else {
    console.log(`  ✅ Missing Saving Throws: 0`);
  }
  
  if (issues.missingActionPoints > 0) {
    console.log(`  ⚠️  Missing Action Points: ${issues.missingActionPoints}`);
  } else {
    console.log(`  ✅ Missing Action Points: 0`);
  }
  
  if (issues.redundantMetadata > 0) {
    console.log(`  ⚠️  Redundant Metadata: ${issues.redundantMetadata} lines`);
  } else {
    console.log(`  ✅ Redundant Metadata: 0`);
  }
  
  const totalIssues = 
    issues.bloatedDescriptions + 
    issues.incompleteStatModifiers + 
    issues.stringStatusEffects;
  
  const totalWarnings = 
    issues.missingScaling + 
    issues.missingSavingThrows + 
    issues.missingActionPoints + 
    issues.redundantMetadata;
  
  console.log(`\n📈 Summary:`);
  if (totalIssues === 0 && totalWarnings === 0) {
    console.log(`  ✅ File is clean!`);
  } else {
    console.log(`  Critical Issues: ${totalIssues}`);
    console.log(`  Warnings: ${totalWarnings}`);
  }
  
  return issues;
}

console.log('🔍 Comprehensive Spell Audit');
console.log('============================\n');
console.log('Checking all spell files for formatting issues...\n');

const allIssues = {};
let totalSpells = 0;

for (const file of SPELL_FILES) {
  const fullPath = path.join(__dirname, file);
  const issues = auditFile(fullPath);
  if (issues) {
    allIssues[file] = issues;
    totalSpells += issues.totalSpells;
  }
}

console.log(`\n${'='.repeat(60)}`);
console.log('📊 OVERALL SUMMARY');
console.log('='.repeat(60));
console.log(`\nTotal Spells/Abilities Across All Files: ${totalSpells}`);

const totals = {
  bloatedDescriptions: 0,
  incompleteStatModifiers: 0,
  stringStatusEffects: 0,
  missingScaling: 0,
  missingSavingThrows: 0,
  missingActionPoints: 0,
  redundantMetadata: 0
};

for (const issues of Object.values(allIssues)) {
  totals.bloatedDescriptions += issues.bloatedDescriptions;
  totals.incompleteStatModifiers += issues.incompleteStatModifiers;
  totals.stringStatusEffects += issues.stringStatusEffects;
  totals.missingScaling += issues.missingScaling;
  totals.missingSavingThrows += issues.missingSavingThrows;
  totals.missingActionPoints += issues.missingActionPoints;
  totals.redundantMetadata += issues.redundantMetadata;
}

console.log(`\n⚠️  Total Issues:`);
console.log(`  Bloated Descriptions: ${totals.bloatedDescriptions}`);
console.log(`  Incomplete Stat Modifiers: ${totals.incompleteStatModifiers}`);
console.log(`  String Status Effects: ${totals.stringStatusEffects}`);
console.log(`  Missing Scaling: ${totals.missingScaling}`);
console.log(`  Missing Saving Throws: ${totals.missingSavingThrows}`);
console.log(`  Missing Action Points: ${totals.missingActionPoints}`);
console.log(`  Redundant Metadata: ${totals.redundantMetadata} lines`);

const criticalTotal = 
  totals.bloatedDescriptions + 
  totals.incompleteStatModifiers + 
  totals.stringStatusEffects;

console.log(`\n${'='.repeat(60)}`);
if (criticalTotal === 0) {
  console.log('✅ All critical issues resolved!');
} else {
  console.log(`❌ ${criticalTotal} critical issues remaining`);
}
console.log('='.repeat(60) + '\n');

