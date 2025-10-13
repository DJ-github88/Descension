/**
 * Quick check for background ability spells
 * This checks the enhanced background data for common issues
 */

import { ENHANCED_BACKGROUNDS } from './src/data/enhancedBackgroundData.js';

console.log('\n=== CHECKING BACKGROUND ABILITIES ===\n');

let totalAbilities = 0;
let issuesFound = 0;

Object.entries(ENHANCED_BACKGROUNDS).forEach(([bgKey, background]) => {
  console.log(`\n📖 ${background.name}`);
  
  if (background.subBackgrounds) {
    Object.entries(background.subBackgrounds).forEach(([subKey, subBg]) => {
      console.log(`  └─ ${subBg.name}`);
      
      if (subBg.abilities && Array.isArray(subBg.abilities)) {
        subBg.abilities.forEach(ability => {
          totalAbilities++;
          const issues = [];
          
          // Check for damage type
          if (ability.effects?.damage) {
            if (!ability.effects.damage.type) {
              issues.push('Missing damage type');
            }
          }
          
          // Check for buff effects with generic text
          if (ability.effects?.buff) {
            if (Array.isArray(ability.effects.buff.effects)) {
              ability.effects.buff.effects.forEach(effect => {
                if (typeof effect === 'string') {
                  // Check if it's a generic stat modifier
                  if (effect.match(/\+\d+\s+to\s+Stat/i) || effect.match(/\+\d+\s+Stat/i)) {
                    issues.push(`Generic stat text: "${effect}"`);
                  }
                }
              });
            }
          }
          
          if (issues.length > 0) {
            issuesFound++;
            console.log(`     ❌ ${ability.name}`);
            issues.forEach(issue => {
              console.log(`        • ${issue}`);
            });
            
            // Show suggested fix
            if (ability.effects?.damage && !ability.effects.damage.type) {
              const spellText = `${ability.name} ${ability.description}`.toLowerCase();
              let suggestedType = 'force';
              
              if (spellText.includes('holy') || spellText.includes('divine') || spellText.includes('radiant')) {
                suggestedType = 'radiant';
              } else if (spellText.includes('shadow') || spellText.includes('necrotic') || spellText.includes('death')) {
                suggestedType = 'necrotic';
              } else if (spellText.includes('fire') || spellText.includes('flame')) {
                suggestedType = 'fire';
              } else if (spellText.includes('cold') || spellText.includes('frost') || spellText.includes('ice')) {
                suggestedType = 'cold';
              } else if (spellText.includes('lightning') || spellText.includes('electric')) {
                suggestedType = 'lightning';
              }
              
              console.log(`        → Add: type: '${suggestedType}'`);
            }
          } else {
            console.log(`     ✅ ${ability.name}`);
          }
        });
      }
    });
  }
});

console.log(`\n=== SUMMARY ===`);
console.log(`Total Abilities: ${totalAbilities}`);
console.log(`With Issues: ${issuesFound}`);
console.log(`Valid: ${totalAbilities - issuesFound}`);

if (issuesFound > 0) {
  console.log(`\n⚠️  Found ${issuesFound} abilities that need fixing`);
  console.log(`\nTo fix: Edit vtt-react/src/data/enhancedBackgroundData.js`);
  process.exit(1);
} else {
  console.log(`\n✅ All background abilities look good!`);
}

