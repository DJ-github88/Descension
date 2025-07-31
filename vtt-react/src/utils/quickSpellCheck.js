/**
 * Quick check of specific spells mentioned as having issues
 */

import { LIBRARY_SPELLS } from '../data/spellLibraryData';

// Check specific spells
const spellsToCheck = ['slow', 'hold-person', 'mage-armor-001', 'shield-of-faith-001'];

console.log('=== QUICK SPELL CHECK ===\n');

spellsToCheck.forEach(spellId => {
  const spell = LIBRARY_SPELLS.find(s => s.id === spellId);
  
  if (spell) {
    console.log(`\n${spell.name} (${spell.id}):`);
    console.log(`  Effect Types: ${spell.effectTypes?.join(', ') || 'none'}`);
    console.log(`  Has durationConfig: ${!!spell.durationConfig}`);
    console.log(`  Has cooldownConfig: ${!!spell.cooldownConfig}`);
    console.log(`  Has targetingConfig: ${!!spell.targetingConfig}`);
    console.log(`  Has resourceCost: ${!!spell.resourceCost}`);
    console.log(`  Has resolution: ${!!spell.resolution}`);
    
    // Effect-specific configs
    if (spell.effectTypes?.includes('damage')) {
      console.log(`  Has damageConfig: ${!!spell.damageConfig}`);
    }
    if (spell.effectTypes?.includes('healing')) {
      console.log(`  Has healingConfig: ${!!spell.healingConfig}`);
    }
    if (spell.effectTypes?.includes('buff')) {
      console.log(`  Has buffConfig: ${!!spell.buffConfig}`);
    }
    if (spell.effectTypes?.includes('debuff')) {
      console.log(`  Has debuffConfig: ${!!spell.debuffConfig}`);
    }
    if (spell.effectTypes?.includes('control')) {
      console.log(`  Has controlConfig: ${!!spell.controlConfig}`);
    }
    
    // Show what configs exist
    const configs = [];
    if (spell.damageConfig) configs.push('damageConfig');
    if (spell.healingConfig) configs.push('healingConfig');
    if (spell.buffConfig) configs.push('buffConfig');
    if (spell.debuffConfig) configs.push('debuffConfig');
    if (spell.controlConfig) configs.push('controlConfig');
    if (spell.durationConfig) configs.push('durationConfig');
    if (spell.cooldownConfig) configs.push('cooldownConfig');
    if (spell.targetingConfig) configs.push('targetingConfig');
    if (spell.resourceCost) configs.push('resourceCost');
    
    console.log(`  Existing configs: ${configs.join(', ') || 'none'}`);
    
  } else {
    console.log(`\n${spellId}: NOT FOUND`);
  }
});

console.log('\n=== END CHECK ===');
