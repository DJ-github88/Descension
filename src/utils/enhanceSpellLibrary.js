/**
 * Enhance Spell Library
 * 
 * This script automatically adds missing configurations to all spells
 * to bring them up to the full depth that our spell wizard supports.
 */

import { LIBRARY_SPELLS } from '../data/spellLibraryData';

/**
 * Generate appropriate durationConfig based on spell type and effects
 */
function generateDurationConfig(spell) {
  // Instant spells (most damage spells)
  if (spell.effectTypes?.includes('damage') && !spell.effectTypes?.includes('debuff')) {
    return {
      type: 'instant',
      value: 0,
      unit: 'seconds',
      concentration: false,
      dispellable: false
    };
  }

  // Healing spells - usually instant unless they have HoT
  if (spell.effectTypes?.includes('healing')) {
    const hasHoT = spell.healingConfig?.hasHotEffect || spell.healingConfig?.hotConfig;
    if (hasHoT) {
      const duration = spell.healingConfig?.hotConfig?.duration || 30;
      return {
        type: 'timed',
        value: duration,
        unit: 'seconds',
        concentration: false,
        dispellable: true
      };
    } else {
      return {
        type: 'instant',
        value: 0,
        unit: 'seconds',
        concentration: false,
        dispellable: false
      };
    }
  }

  // Buff spells - usually long duration
  if (spell.effectTypes?.includes('buff')) {
    const buffDuration = spell.buffConfig?.duration || 10;
    const durationUnit = spell.buffConfig?.durationUnit || 'minutes';
    return {
      type: 'timed',
      value: buffDuration,
      unit: durationUnit,
      concentration: false,
      dispellable: true
    };
  }

  // Debuff spells - usually medium duration with concentration
  if (spell.effectTypes?.includes('debuff')) {
    return {
      type: 'concentration',
      value: 60,
      unit: 'seconds',
      concentration: true,
      dispellable: true
    };
  }

  // Control spells - usually concentration
  if (spell.effectTypes?.includes('control')) {
    return {
      type: 'concentration',
      value: 60,
      unit: 'seconds',
      concentration: true,
      dispellable: true
    };
  }

  // Utility spells - varies
  if (spell.effectTypes?.includes('utility')) {
    return {
      type: 'timed',
      value: 10,
      unit: 'minutes',
      concentration: false,
      dispellable: true
    };
  }

  // Default for other types
  return {
    type: 'instant',
    value: 0,
    unit: 'seconds',
    concentration: false,
    dispellable: false
  };
}

/**
 * Generate appropriate cooldownConfig based on spell power and type
 */
function generateCooldownConfig(spell) {
  // High-power spells get longer cooldowns
  const manaCost = spell.resourceCost?.mana || 10;
  
  if (manaCost >= 30) {
    return {
      type: 'turn_based',
      value: 3,
      charges: 1,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: ''
    };
  } else if (manaCost >= 20) {
    return {
      type: 'turn_based',
      value: 2,
      charges: 1,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: ''
    };
  } else if (manaCost >= 15) {
    return {
      type: 'turn_based',
      value: 1,
      charges: 1,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: ''
    };
  } else {
    return {
      type: 'turn_based',
      value: 0,
      charges: 1,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: ''
    };
  }
}

/**
 * Enhance targeting config with more detailed information
 */
function enhanceTargetingConfig(spell) {
  if (!spell.targetingConfig) {
    // Generate basic targeting based on effect types
    if (spell.effectTypes?.includes('healing') || spell.effectTypes?.includes('buff')) {
      return {
        targetingType: 'single',
        range: 60,
        validTargets: ['ally', 'self']
      };
    } else if (spell.effectTypes?.includes('damage') || spell.effectTypes?.includes('debuff')) {
      return {
        targetingType: 'single',
        range: 60,
        validTargets: ['enemy']
      };
    } else {
      return {
        targetingType: 'single',
        range: 30,
        validTargets: ['any']
      };
    }
  }

  // Enhance existing targeting config
  const enhanced = { ...spell.targetingConfig };

  // Add missing fields
  if (!enhanced.range) {
    enhanced.range = enhanced.range === 'touch' ? 'touch' : 60;
  }
  
  if (!enhanced.validTargets) {
    if (spell.effectTypes?.includes('healing') || spell.effectTypes?.includes('buff')) {
      enhanced.validTargets = ['ally', 'self'];
    } else if (spell.effectTypes?.includes('damage') || spell.effectTypes?.includes('debuff')) {
      enhanced.validTargets = ['enemy'];
    } else {
      enhanced.validTargets = ['any'];
    }
  }

  return enhanced;
}

/**
 * Enhance a single spell with missing configurations
 */
export function enhanceSpell(spell) {
  const enhanced = { ...spell };

  // Add missing durationConfig
  if (!enhanced.durationConfig) {
    enhanced.durationConfig = generateDurationConfig(spell);
  }

  // Add missing cooldownConfig
  if (!enhanced.cooldownConfig) {
    enhanced.cooldownConfig = generateCooldownConfig(spell);
  }

  // Enhance targetingConfig
  enhanced.targetingConfig = enhanceTargetingConfig(spell);

  // Add missing resourceCost
  if (!enhanced.resourceCost) {
    enhanced.resourceCost = {
      mana: 10,
      health: 0,
      stamina: 0,
      focus: 0
    };
  }

  // Add missing resolution
  if (!enhanced.resolution) {
    enhanced.resolution = 'DICE';
  }

  // Add missing timestamps
  if (!enhanced.dateCreated) {
    enhanced.dateCreated = new Date().toISOString();
  }
  if (!enhanced.lastModified) {
    enhanced.lastModified = new Date().toISOString();
  }

  // Add missing categoryIds
  if (!enhanced.categoryIds) {
    enhanced.categoryIds = [];
  }

  return enhanced;
}

/**
 * Enhance all spells in the library
 */
export function enhanceAllSpells() {
  console.log('🔧 ENHANCING ALL SPELLS WITH MISSING CONFIGURATIONS...\n');
  
  const enhancedSpells = LIBRARY_SPELLS.map(spell => {
    const enhanced = enhanceSpell(spell);
    
    // Log what was added
    const addedConfigs = [];
    if (!spell.durationConfig) addedConfigs.push('durationConfig');
    if (!spell.cooldownConfig) addedConfigs.push('cooldownConfig');
    if (!spell.resourceCost) addedConfigs.push('resourceCost');
    if (!spell.resolution) addedConfigs.push('resolution');
    
    if (addedConfigs.length > 0) {
      console.log(`✅ Enhanced ${spell.name}: Added ${addedConfigs.join(', ')}`);
    }
    
    return enhanced;
  });

  console.log(`\n🎉 Enhanced ${enhancedSpells.length} spells!`);
  return enhancedSpells;
}

/**
 * Generate enhanced spell library file content
 */
export function generateEnhancedSpellFiles() {
  const enhancedSpells = enhanceAllSpells();
  
  // Group spells by their original file
  const customSpells = enhancedSpells.filter(s => s.id.includes('fireball') || s.id.includes('divine') || s.id.includes('chain-lightning'));
  const additionalSpells = enhancedSpells.filter(s => s.id.includes('ice-shard') || s.id.includes('cure-wounds') || s.id.includes('mage-armor'));
  const advancedSpells = enhancedSpells.filter(s => s.id.includes('healing-rain') || s.id.includes('hold-person') || s.id.includes('slow'));
  
  return {
    customSpells,
    additionalSpells,
    advancedSpells,
    allEnhanced: enhancedSpells
  };
}

export default {
  enhanceSpell,
  enhanceAllSpells,
  generateEnhancedSpellFiles
};
