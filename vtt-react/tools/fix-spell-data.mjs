#!/usr/bin/env node

/**
 * Automated Spell Data Fixer
 * 
 * This script fixes common issues in spell data files:
 * 1. Incomplete stat modifiers (adds name, magnitude, magnitudeType)
 * 2. String-based status effects (converts to objects with descriptions)
 * 3. Missing damage types (infers from spell data)
 */

import fs from 'fs';
import path from 'path';

// Status effect descriptions mapping
const STATUS_EFFECT_DESCRIPTIONS = {
  // Buffs
  'blessed': 'Blessed with divine power, granting enhanced combat prowess and resistance to fear',
  'inspired': 'Filled with inspiration, granting enhanced performance and morale',
  'haste': 'Moving with supernatural speed, gaining additional actions',
  'invisibility': 'Rendered invisible, gaining advantage on stealth and attacks',
  'regeneration': 'Rapidly regenerating health each round',
  'shield': 'Protected by a magical barrier that absorbs damage',
  'strength': 'Enhanced physical strength, increasing melee damage and carrying capacity',
  'resistance': 'Resistant to damage, reducing incoming harm',
  'mage_armor': 'Protected by invisible force, increasing armor class',
  'divine_protection': 'Shielded by divine energy, granting damage reduction and saving throw bonuses',
  'spell_reflection': 'Surrounded by a reflective barrier that can deflect spells back at casters',
  'damage_absorption': 'Absorbing incoming damage and converting it to temporary hit points',
  'mirror_images': 'Surrounded by illusory duplicates that confuse attackers',
  'displacement': 'Image displaced, making you harder to hit',
  'empowered': 'Magically empowered, increasing spell damage and effectiveness',
  'disease_immunity': 'Immune to disease and poison effects',
  
  // Debuffs
  'prone': 'Knocked to the ground, attacks against you have advantage and your attacks have disadvantage',
  'blinded': 'Unable to see, attacks have disadvantage and attacks against you have advantage',
  'stunned': 'Stunned and unable to act, automatically failing Strength and Dexterity saves',
  'paralyzed': 'Paralyzed and unable to move or act, attacks against you have advantage',
  'frightened': 'Overcome with fear, unable to move closer to the source and attacks have disadvantage',
  'charmed': 'Charmed and unable to attack the charmer, who has advantage on social checks',
  'poisoned': 'Suffering from poison, attacks and ability checks have disadvantage',
  'burning': 'Engulfed in flames, taking fire damage each round',
  'chilled': 'Slowed by intense cold, movement speed reduced',
  'slowed': 'Movement and reactions slowed, reduced speed and disadvantage on Dexterity saves',
  'weakened': 'Physical strength sapped, reduced damage and carrying capacity',
  'cursed': 'Afflicted by a curse, suffering various penalties',
  'diseased': 'Suffering from disease, reduced Constitution and disadvantage on checks',
  'exhausted': 'Physically exhausted, suffering penalties to all actions',
  'silenced': 'Unable to speak or cast spells with verbal components',
  'deafened': 'Unable to hear, automatically failing Perception checks that rely on hearing',
  'petrified': 'Turned to stone, incapacitated and resistant to all damage',
  'restrained': 'Movement restricted, speed is 0 and attacks have disadvantage',
  'grappled': 'Held in place, speed is 0 and cannot move away',
  'incapacitated': 'Unable to take actions or reactions',
  'unconscious': 'Unconscious and unaware, automatically failing Strength and Dexterity saves',
  'fear': 'Gripped by supernatural fear, unable to move closer to the source',
  'confused': 'Mind clouded with confusion, actions are unpredictable',
  'dazed': 'Disoriented and dazed, reduced actions and reactions',
  'scorched': 'Armor superheated by flames, reducing AC and causing discomfort',
  'corroded': 'Armor corroded by acid, reducing AC',
  'frozen': 'Encased in ice, unable to move or act',
  'shocked': 'Nervous system disrupted by electricity, reduced reactions',
  'bleeding': 'Suffering from blood loss, taking damage each round',
  'marked': 'Marked for death, taking increased damage from attacks',
  'vulnerable': 'Defenses weakened, taking increased damage',
  'hexed': 'Afflicted by a hex, suffering various penalties',
  'doomed': 'Marked for doom, suffering penalties and unable to be healed',
  'banished': 'Temporarily banished to another plane of existence',
  'polymorphed': 'Transformed into another creature, losing access to abilities',
  'dominated': 'Mind controlled, forced to obey commands',
  'sleeping': 'Magically put to sleep, unconscious until awakened',
  'entangled': 'Caught in magical vines or webs, movement restricted',
  'levitating': 'Floating in the air, unable to control movement',
  'falling': 'Knocked into the air and falling',
  'pushed': 'Forcefully pushed away from the source',
  'pulled': 'Forcefully pulled toward the source',
  'rooted': 'Magically rooted in place, unable to move',
  'taunted': 'Magically compelled to attack the taunter',
  'maddened': 'Driven to madness, actions are chaotic and unpredictable'
};

// Stat names mapping
const STAT_ALIASES = {
  'str': 'strength',
  'agi': 'agility',
  'dex': 'agility',
  'con': 'constitution',
  'int': 'intelligence',
  'spi': 'spirit',
  'wis': 'spirit',
  'cha': 'charisma',
  'armor': 'armor',
  'speed': 'speed',
  'ac': 'armor'
};

/**
 * Fix stat modifier format
 */
function fixStatModifier(modifier) {
  if (!modifier) return modifier;
  
  // If it already has name and magnitude, it's probably fine
  if (modifier.name && modifier.magnitude !== undefined) {
    return modifier;
  }
  
  // Get the stat name
  let statName = modifier.name || modifier.stat;
  if (!statName) return modifier;
  
  // Normalize stat name
  statName = STAT_ALIASES[statName.toLowerCase()] || statName.toLowerCase();
  
  // Get the value
  const value = modifier.value !== undefined ? modifier.value : modifier.magnitude;
  
  return {
    name: statName,
    stat: statName,
    value: value,
    magnitude: Math.abs(value),
    magnitudeType: modifier.magnitudeType || (modifier.isPercentage ? 'percentage' : 'flat'),
    isPercentage: modifier.isPercentage || false
  };
}

/**
 * Convert string status effect to object
 */
function fixStatusEffect(effect) {
  if (typeof effect === 'object' && effect.id) {
    // Already an object, just ensure it has description
    if (!effect.description && STATUS_EFFECT_DESCRIPTIONS[effect.id]) {
      return {
        ...effect,
        description: STATUS_EFFECT_DESCRIPTIONS[effect.id]
      };
    }
    return effect;
  }
  
  if (typeof effect === 'string') {
    const id = effect.toLowerCase().replace(/\s+/g, '_');
    const name = effect.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
    
    return {
      id: id,
      name: name,
      description: STATUS_EFFECT_DESCRIPTIONS[id] || `Affected by ${name.toLowerCase()}`
    };
  }
  
  return effect;
}

/**
 * Infer damage types from spell data
 */
function inferDamageTypes(spell) {
  const damageTypes = [];
  
  // Check spell name and description
  const text = `${spell.name || ''} ${spell.description || ''}`.toLowerCase();
  
  const typeKeywords = {
    'fire': ['fire', 'flame', 'burn', 'infernal', 'hellfire', 'ignite', 'scorch'],
    'cold': ['cold', 'ice', 'frost', 'freeze', 'chill', 'glacial', 'arctic'],
    'lightning': ['lightning', 'thunder', 'electric', 'shock', 'storm'],
    'radiant': ['radiant', 'holy', 'divine', 'light', 'sacred', 'celestial', 'blessed'],
    'necrotic': ['necrotic', 'death', 'decay', 'wither', 'drain', 'shadow', 'dark'],
    'poison': ['poison', 'venom', 'toxic', 'acid'],
    'acid': ['acid', 'corrosive', 'dissolve'],
    'psychic': ['psychic', 'mind', 'mental', 'confusion', 'madness'],
    'force': ['force', 'arcane', 'magic', 'energy'],
    'physical': ['physical', 'weapon'],
    'slashing': ['slash', 'cut', 'blade'],
    'piercing': ['pierce', 'stab', 'arrow'],
    'bludgeoning': ['bludgeon', 'crush', 'smash', 'hammer'],
    'nature': ['nature', 'natural', 'primal'],
    'void': ['void', 'chaos', 'eldritch']
  };
  
  for (const [type, keywords] of Object.entries(typeKeywords)) {
    if (keywords.some(keyword => text.includes(keyword))) {
      damageTypes.push(type);
    }
  }
  
  // Check damageConfig
  if (spell.damageConfig?.elementType) {
    const elementType = spell.damageConfig.elementType.toLowerCase();
    if (!damageTypes.includes(elementType)) {
      damageTypes.push(elementType);
    }
  }
  
  return damageTypes.length > 0 ? damageTypes : null;
}

/**
 * Fix a single spell object
 */
function fixSpell(spell) {
  const fixed = { ...spell };
  
  // Fix damage types
  if (spell.damageConfig && !spell.damageTypes) {
    const inferred = inferDamageTypes(spell);
    if (inferred) {
      fixed.damageTypes = inferred;
    }
  }
  
  // Fix buffConfig
  if (spell.buffConfig) {
    const buffConfig = { ...spell.buffConfig };
    
    // Fix stat modifiers
    if (buffConfig.statModifiers) {
      buffConfig.statModifiers = buffConfig.statModifiers.map(fixStatModifier);
    }
    
    // Fix status effects
    if (buffConfig.statusEffects) {
      buffConfig.statusEffects = buffConfig.statusEffects.map(fixStatusEffect);
    }
    
    fixed.buffConfig = buffConfig;
  }
  
  // Fix debuffConfig
  if (spell.debuffConfig) {
    const debuffConfig = { ...spell.debuffConfig };
    
    // Fix stat penalties
    if (debuffConfig.statPenalties) {
      debuffConfig.statPenalties = debuffConfig.statPenalties.map(fixStatModifier);
    }
    
    // Fix stat modifiers (some debuffs use this)
    if (debuffConfig.statModifiers) {
      debuffConfig.statModifiers = debuffConfig.statModifiers.map(fixStatModifier);
    }
    
    // Fix status effects
    if (debuffConfig.statusEffects) {
      debuffConfig.statusEffects = debuffConfig.statusEffects.map(fixStatusEffect);
    }
    
    fixed.debuffConfig = debuffConfig;
  }
  
  return fixed;
}

console.log('🔧 Spell Data Fixer');
console.log('==================\n');
console.log('This script will fix common issues in spell data files.');
console.log('Run this on individual files or use it as a reference for manual fixes.\n');
console.log('Example usage:');
console.log('  node fix-spell-data.mjs\n');
console.log('Status effect descriptions available:', Object.keys(STATUS_EFFECT_DESCRIPTIONS).length);
console.log('\nReady to fix spells!');

