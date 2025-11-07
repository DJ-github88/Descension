#!/usr/bin/env node

/**
 * Batch Spell Enhancement Script
 * 
 * Enhances spells by:
 * 1. Replacing bloated descriptions with concise ones
 * 2. Adding stat scaling to damage/healing formulas
 * 3. Adding saving throws to damage/debuff spells
 * 4. Adding action point costs
 * 5. Removing redundant metadata
 * 6. Fixing visualTheme mismatches
 * 7. Adding proper tags
 */

import fs from 'fs';
import path from 'path';

// Description templates based on spell type
const DESCRIPTION_TEMPLATES = {
  damage_fire: (name) => `Hurl flames at your target, dealing fire damage${name.includes('burn') || name.includes('ignite') ? ' and igniting them for additional burning damage over time' : ''}.`,
  damage_cold: (name) => `Freeze enemies with ice, dealing cold damage${name.includes('slow') || name.includes('frost') ? ' and slowing their movement' : ''}.`,
  damage_lightning: (name) => `Strike with lightning, dealing electrical damage${name.includes('chain') ? ' that can chain to nearby enemies' : ''}.`,
  damage_psychic: (name) => `Pierce your enemy's mind with psychic energy, dealing damage${name.includes('confus') || name.includes('thought') ? ' and clouding their thoughts' : ''}.`,
  damage_radiant: (name) => `Smite with holy radiance, dealing radiant damage to enemies.`,
  damage_necrotic: (name) => `Drain life force with necrotic energy, dealing damage${name.includes('drain') || name.includes('wither') ? ' and weakening the target' : ''}.`,
  damage_force: (name) => `Blast with pure arcane force, dealing damage that cannot be resisted.`,
  
  healing: (name) => `Restore health to an ally${name.includes('hot') || name.includes('grace') || name.includes('blessing') ? ', with healing continuing over time' : ''}${name.includes('buff') || name.includes('protect') ? ' and fortifying them against harm' : ''}.`,
  healing_aoe: (name) => `Heal multiple allies in an area, restoring their health${name.includes('hot') ? ' and providing continuous regeneration' : ''}.`,
  
  buff: (name) => `Enhance an ally with magical power${name.includes('arcane') || name.includes('spell') ? ', increasing their spellcasting ability' : ''}${name.includes('strength') || name.includes('might') ? ', increasing their physical prowess' : ''}.`,
  debuff: (name) => `Weaken an enemy${name.includes('slow') ? ', reducing their movement speed' : ''}${name.includes('confus') || name.includes('mind') ? ', clouding their mind' : ''}${name.includes('curse') || name.includes('hex') ? ' with a debilitating curse' : ''}.`,
  
  control: (name) => `Control an enemy${name.includes('stun') || name.includes('stasis') || name.includes('freeze') ? ', preventing them from acting' : ''}${name.includes('root') || name.includes('entangle') ? ', rooting them in place' : ''}.`,
  
  utility_teleport: (name) => `Instantly teleport to a nearby location through magical means.`,
  utility_invisibility: (name) => `Become invisible, hiding from enemies and gaining advantage on attacks.`,
  
  transformation: (name) => `Transform into a powerful form, gaining new abilities and enhanced physical stats.`,
  
  zone: (name) => `Create a magical zone${name.includes('heal') || name.includes('sanctuary') ? ' that heals allies within' : ''}${name.includes('damage') ? ' that damages enemies within' : ''}.`,
  
  channeled: (name) => `Channel continuous magical energy${name.includes('damage') ? ', dealing damage each round' : ''}${name.includes('heal') ? ', healing each round' : ''}.`,
  
  reaction: (name) => `React to an enemy action${name.includes('counter') ? ', countering their spell or attack' : ''}${name.includes('protect') || name.includes('shield') ? ', protecting an ally' : ''}.`
};

// Stat scaling based on damage type
const DAMAGE_TYPE_SCALING = {
  fire: 'intelligence',
  cold: 'intelligence',
  lightning: 'intelligence',
  psychic: 'intelligence',
  radiant: 'spirit',
  necrotic: 'intelligence',
  force: 'intelligence',
  acid: 'intelligence',
  poison: 'intelligence',
  thunder: 'intelligence',
  nature: 'spirit',
  physical: 'strength',
  slashing: 'strength',
  piercing: 'agility',
  bludgeoning: 'strength'
};

// Saving throw attributes based on spell type
const SAVING_THROW_ATTRIBUTES = {
  damage_fire: 'dexterity',
  damage_cold: 'constitution',
  damage_lightning: 'dexterity',
  damage_psychic: 'spirit',
  damage_radiant: 'constitution',
  damage_necrotic: 'constitution',
  damage_force: 'dexterity',
  debuff_slow: 'constitution',
  debuff_mental: 'spirit',
  debuff_physical: 'strength',
  control: 'spirit'
};

// Action point costs based on spell level and type
function calculateActionPoints(level, spellType, effectTypes) {
  let baseAP = 2;
  
  // Adjust for spell level
  if (level >= 7) baseAP = 5;
  else if (level >= 5) baseAP = 4;
  else if (level >= 3) baseAP = 3;
  else if (level >= 1) baseAP = 2;
  
  // Adjust for spell type
  if (spellType === 'REACTION') baseAP = 0;
  else if (spellType === 'CHANNELED') baseAP += 1;
  else if (spellType === 'ZONE') baseAP += 1;
  
  // Adjust for multiple effects
  if (effectTypes && effectTypes.length > 2) baseAP += 1;
  
  return Math.min(baseAP, 5);
}

// Generate concise description
function generateDescription(spell) {
  const name = spell.name.toLowerCase();
  const effectTypes = spell.effectTypes || [];
  const damageTypes = spell.damageTypes || [];
  const spellType = spell.spellType;
  
  // Determine primary effect
  if (effectTypes.includes('damage') && damageTypes.length > 0) {
    const damageType = damageTypes[0];
    const key = `damage_${damageType}`;
    if (DESCRIPTION_TEMPLATES[key]) {
      return DESCRIPTION_TEMPLATES[key](name);
    }
  }
  
  if (effectTypes.includes('healing')) {
    const isAOE = spell.targetingConfig?.targetingType === 'aoe' || spell.targetingConfig?.targetingType === 'area';
    return DESCRIPTION_TEMPLATES[isAOE ? 'healing_aoe' : 'healing'](name);
  }
  
  if (effectTypes.includes('buff')) {
    return DESCRIPTION_TEMPLATES.buff(name);
  }
  
  if (effectTypes.includes('debuff')) {
    return DESCRIPTION_TEMPLATES.debuff(name);
  }
  
  if (effectTypes.includes('control')) {
    return DESCRIPTION_TEMPLATES.control(name);
  }
  
  if (effectTypes.includes('transformation')) {
    return DESCRIPTION_TEMPLATES.transformation(name);
  }
  
  if (spellType === 'ZONE') {
    return DESCRIPTION_TEMPLATES.zone(name);
  }
  
  if (spellType === 'CHANNELED') {
    return DESCRIPTION_TEMPLATES.channeled(name);
  }
  
  if (spellType === 'REACTION') {
    return DESCRIPTION_TEMPLATES.reaction(name);
  }
  
  if (spell.utilityConfig) {
    const utilityType = spell.utilityConfig.utilityType;
    if (utilityType === 'teleportation') return DESCRIPTION_TEMPLATES.utility_teleport(name);
    if (utilityType === 'invisibility') return DESCRIPTION_TEMPLATES.utility_invisibility(name);
  }
  
  // Fallback
  return `A magical spell that ${effectTypes.join(', ').replace(/_/g, ' ')}.`;
}

// Add scaling to damage formula
function addScaling(formula, damageType) {
  if (!formula || formula.includes('+')) return formula; // Already has scaling
  
  const stat = DAMAGE_TYPE_SCALING[damageType] || 'intelligence';
  return `${formula} + ${stat}`;
}

// Add saving throw to damage config
function addSavingThrow(damageConfig, spell) {
  if (damageConfig.savingThrow) return damageConfig; // Already has one
  
  const damageType = spell.damageTypes?.[0];
  const attribute = SAVING_THROW_ATTRIBUTES[`damage_${damageType}`] || 'dexterity';
  const difficulty = 12 + (spell.level || 1);
  
  return {
    ...damageConfig,
    savingThrow: {
      enabled: true,
      attribute,
      difficulty,
      onSuccess: 'half_damage',
      onFailure: 'full_damage'
    }
  };
}

// Fix visual theme based on damage type or spell type
function fixVisualTheme(spell) {
  const damageTypes = spell.damageTypes || [];
  
  if (damageTypes.includes('fire')) return 'fire';
  if (damageTypes.includes('cold')) return 'frost';
  if (damageTypes.includes('lightning')) return 'lightning';
  if (damageTypes.includes('radiant')) return 'holy';
  if (damageTypes.includes('necrotic')) return 'shadow';
  if (damageTypes.includes('psychic')) return 'shadow';
  if (damageTypes.includes('nature')) return 'nature';
  
  if (spell.effectTypes?.includes('healing')) return 'holy';
  
  return spell.visualTheme || 'arcane';
}

// Enhance a single spell
function enhanceSpell(spell) {
  const enhanced = { ...spell };
  
  // 1. Replace bloated description
  if (spell.description && spell.description.includes('You focus your will and speak the incantation')) {
    enhanced.description = generateDescription(spell);
  }
  
  // 2. Add scaling to damage formulas
  if (spell.damageConfig && spell.damageTypes?.[0]) {
    const damageType = spell.damageTypes[0];
    enhanced.damageConfig = {
      ...spell.damageConfig,
      formula: addScaling(spell.damageConfig.formula, damageType),
      scaling: DAMAGE_TYPE_SCALING[damageType] || 'intelligence'
    };
    
    // Add saving throw
    enhanced.damageConfig = addSavingThrow(enhanced.damageConfig, spell);
  }
  
  // 3. Add scaling to healing formulas
  if (spell.healingConfig) {
    enhanced.healingConfig = {
      ...spell.healingConfig,
      formula: spell.healingConfig.formula?.includes('+') ? spell.healingConfig.formula : `${spell.healingConfig.formula} + spirit`,
      scaling: 'spirit'
    };
    
    if (spell.healingConfig.hotFormula && !spell.healingConfig.hotFormula.includes('+')) {
      enhanced.healingConfig.hotFormula = `${spell.healingConfig.hotFormula} + spirit`;
    }
  }
  
  // 4. Add action points
  if (!spell.resourceCost?.actionPoints && spell.spellType !== 'PASSIVE') {
    enhanced.resourceCost = {
      ...spell.resourceCost,
      actionPoints: calculateActionPoints(spell.level, spell.spellType, spell.effectTypes)
    };
    
    if (spell.spellType === 'REACTION') {
      enhanced.resourceCost.reaction = true;
    }
  }
  
  // 5. Remove redundant metadata
  delete enhanced.dateCreated;
  delete enhanced.lastModified;
  delete enhanced.categoryIds;
  
  // 6. Simplify instant duration
  if (spell.durationConfig?.durationType === 'instant') {
    enhanced.durationConfig = { durationType: 'instant' };
  }
  
  // 7. Fix visual theme
  enhanced.visualTheme = fixVisualTheme(spell);
  
  return enhanced;
}

console.log('📦 Batch Spell Enhancement Script');
console.log('==================================\n');
console.log('This script enhances spells with:');
console.log('  ✓ Concise descriptions');
console.log('  ✓ Stat scaling');
console.log('  ✓ Saving throws');
console.log('  ✓ Action points');
console.log('  ✓ Cleaned metadata\n');
console.log('Ready to enhance spells!');
console.log('\nUsage: Import and call enhanceSpell(spell) on each spell object.');

export { enhanceSpell, generateDescription, addScaling, calculateActionPoints };

