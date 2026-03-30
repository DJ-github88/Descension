/**
 * Mechanics Integration System
 * 
 * Integrates the specialized mechanics systems into a unified interface for the spellcrafting wizard:
 * - Combo point system
 * - Resolution system
 * - Spell component system
 * - Stance/form system
 * - Proc system
 */

// Import all mechanics systems
import { 
  getComboSystem, 
  getAllComboSystems, 
  calculateComboEffect 
} from './enhancedComboSystem';

import { 
  getResolutionSystem, 
  getCriticalHitSystem, 
  generateDefaultFormula 
} from './resolutionSystem';

import { 
  getComponentType, 
  getComponentRules, 
  generateDefaultComponents 
} from './spellComponentSystem';

import { 
  getForm, 
  getFormsForClass, 
  generateFormRequirements 
} from './stanceFormSystem';

import { 
  getProcTrigger, 
  getProcEffect, 
  generateProcConfig 
} from './procSystem';

// Game system identifiers
export const GAME_SYSTEMS = {
  WOW: {
    id: 'WOW',
    name: 'World of Warcraft',
    description: 'Create spells inspired by World of Warcraft mechanics',
    icon: 'spell_arcane_arcane01'
  },
  CUSTOM: {
    id: 'CUSTOM',
    name: 'Custom',
    description: 'Create spells with custom mechanics',
    icon: 'inv_misc_questionmark'
  }
};

/**
 * Get all available game systems
 * @returns {Array} Array of game system objects
 */
export function getAllGameSystems() {
  return Object.values(GAME_SYSTEMS);
}

/**
 * Get a game system by ID
 * @param {string} systemId - The ID of the game system to retrieve
 * @returns {Object} The game system configuration
 */
export function getGameSystem(systemId) {
  return GAME_SYSTEMS[systemId] || GAME_SYSTEMS.CUSTOM;
}

/**
 * Generate a complete spell configuration with game-specific mechanics
 * @param {Object} baseConfig - The base spell configuration
 * @param {string} gameSystem - The game system to use (WOW, CUSTOM)
 * @returns {Object} The complete spell configuration with game-specific mechanics
 */
export function generateGameSpecificSpell(baseConfig, gameSystem = 'CUSTOM') {
  // Start with the base configuration
  const spellConfig = { ...baseConfig };
  
  // Add game system identifier
  spellConfig.gameSystem = gameSystem;
  
  // Generate resolution system configuration
  if (spellConfig.damageConfig) {
    // Set appropriate resolution system
    switch (gameSystem) {
      case 'WOW':
        spellConfig.damageConfig.resolution = 'FIXED';
        break;
      default:
        // Keep existing or default to DICE
        spellConfig.damageConfig.resolution = spellConfig.damageConfig.resolution || 'DICE';
    }
    
    // Generate formula if not provided
    if (!spellConfig.damageConfig.formula) {
      spellConfig.damageConfig.formula = generateDefaultFormula(
        spellConfig.damageConfig.resolution,
        {
          spellLevel: spellConfig.level || 1,
          casterLevel: 1,
          primaryAttribute: gameSystem === 'WOW' ? 'INT' : 'INT',
          damageType: spellConfig.damageConfig.elementType || 'fire',
          isAoe: spellConfig.targetingConfig?.targetingType === 'area',
          isSingleTarget: spellConfig.targetingConfig?.targetingType === 'single',
          isDot: spellConfig.damageConfig.damageType === 'over_time'
        }
      );
    }
    
    // Generate critical hit configuration
    if (!spellConfig.damageConfig.criticalConfig) {
      spellConfig.damageConfig.criticalConfig = {
        enabled: false,
        critType: gameSystem === 'WOW' ? 'percentage' : 'dice',
        critThreshold: 20,
        critRange: 1,
        critMultiplier: 2
      };
    }
  }
  
  // Generate healing configuration
  if (spellConfig.healingConfig && !spellConfig.healingConfig.formula) {
    spellConfig.healingConfig.formula = generateDefaultFormula(
      gameSystem === 'WOW' ? 'FIXED' : 'DICE',
      {
        spellLevel: spellConfig.level || 1,
        casterLevel: 1,
        primaryAttribute: gameSystem === 'WOW' ? 'INT' : 'WIS',
        isAoe: spellConfig.targetingConfig?.targetingType === 'area',
        isSingleTarget: spellConfig.targetingConfig?.targetingType === 'single',
        isDot: spellConfig.healingConfig.healingType === 'over_time'
      }
    );
  }
  
  // Generate spell components
  spellConfig.components = generateDefaultComponents(spellConfig);
  
  // Generate form requirements (WoW)
  if (gameSystem === 'WOW') {
    spellConfig.formRequirements = generateFormRequirements(spellConfig);
  }
  
  // Generate proc configuration
  spellConfig.procConfig = generateProcConfig(spellConfig);
  
  // Generate resource configuration based on game system
  if (!spellConfig.resourceConfig) {
    spellConfig.resourceConfig = {
      primaryResource: gameSystem === 'WOW' ? 'mana' : 'mana',
      cost: gameSystem === 'WOW' ? 100 : 20
    };
  }
  
  // Generate cooldown configuration based on game system
  if (!spellConfig.cooldownConfig) {
    spellConfig.cooldownConfig = {
      cooldownType: gameSystem === 'WOW' ? 'time_based' : 'turn_based',
      cooldownValue: gameSystem === 'WOW' ? 30 : 1
    };
  }
  
  return spellConfig;
}

/**
 * Get all available mechanics for a specific game system
 * @param {string} gameSystem - The game system to get mechanics for
 * @returns {Object} Object containing all available mechanics for the specified game system
 */
export function getAvailableMechanicsForGameSystem(gameSystem) {
  const mechanics = {
    comboSystems: [],
    resolutionSystems: [],
    criticalHitSystems: [],
    forms: [],
    procTriggers: [],
    procEffects: []
  };
  
  // Get combo systems
  if (gameSystem === 'WOW') {
    mechanics.comboSystems = getAllComboSystems().filter(system => 
      system.id.startsWith('wow_')
    );
  } else if (gameSystem === 'CUSTOM') {
    mechanics.comboSystems = getAllComboSystems().filter(system => 
      system.id.startsWith('custom_')
    );
  } else {
    mechanics.comboSystems = getAllComboSystems();
  }
  
  // Get forms
  if (gameSystem === 'WOW') {
    // Flatten the nested structure
    Object.values(getFormsForClass('DRUID', 'WOW')).forEach(form => {
      mechanics.forms.push(form);
    });
    Object.values(getFormsForClass('WARRIOR', 'WOW')).forEach(form => {
      mechanics.forms.push(form);
    });
    Object.values(getFormsForClass('ROGUE', 'WOW')).forEach(form => {
      mechanics.forms.push(form);
    });
    Object.values(getFormsForClass('PRIEST', 'WOW')).forEach(form => {
      mechanics.forms.push(form);
    });
  }
  
  // Get proc triggers
  for (const triggerId in getProcTrigger) {
    mechanics.procTriggers.push(getProcTrigger(triggerId));
  }
  
  // Get proc effects
  for (const effectId in getProcEffect) {
    mechanics.procEffects.push(getProcEffect(effectId));
  }
  
  return mechanics;
}

/**
 * Apply combo point mechanics to a spell effect
 * @param {Object} spellConfig - The spell configuration
 * @param {string} comboSystemId - The ID of the combo system to use
 * @param {number} comboPoints - The number of combo points to apply
 * @returns {Object} The modified spell configuration
 */
export function applyComboPointsToSpell(spellConfig, comboSystemId, comboPoints) {
  if (!spellConfig || !comboSystemId || comboPoints === undefined) {
    return spellConfig;
  }
  
  const comboSystem = getComboSystem(comboSystemId);
  if (!comboSystem) {
    return spellConfig;
  }
  
  const modifiedSpell = { ...spellConfig };
  
  // Apply combo points to damage
  if (modifiedSpell.damageConfig) {
    const baseEffect = {
      damage: modifiedSpell.damageConfig.baseDamage || 0,
      duration: modifiedSpell.damageConfig.duration || 0,
      range: modifiedSpell.targetingConfig?.range || 0
    };
    
    const scaledEffect = calculateComboEffect(comboSystem, comboPoints, baseEffect);
    
    // Apply scaled effect
    if (scaledEffect.damage) {
      modifiedSpell.damageConfig.scaledDamage = scaledEffect.damage;
    }
    
    if (scaledEffect.duration) {
      modifiedSpell.damageConfig.scaledDuration = scaledEffect.duration;
    }
    
    if (scaledEffect.range) {
      modifiedSpell.targetingConfig.scaledRange = scaledEffect.range;
    }
    
    if (scaledEffect.additionalEffects) {
      modifiedSpell.additionalEffects = scaledEffect.additionalEffects;
    }
  }
  
  // Apply combo points to healing
  if (modifiedSpell.healingConfig) {
    const baseEffect = {
      healing: modifiedSpell.healingConfig.baseHealing || 0,
      duration: modifiedSpell.healingConfig.duration || 0,
      range: modifiedSpell.targetingConfig?.range || 0
    };
    
    const scaledEffect = calculateComboEffect(comboSystem, comboPoints, baseEffect);
    
    // Apply scaled effect
    if (scaledEffect.healing) {
      modifiedSpell.healingConfig.scaledHealing = scaledEffect.healing;
    }
    
    if (scaledEffect.duration) {
      modifiedSpell.healingConfig.scaledDuration = scaledEffect.duration;
    }
    
    if (scaledEffect.range) {
      modifiedSpell.targetingConfig.scaledRange = scaledEffect.range;
    }
    
    if (scaledEffect.additionalEffects) {
      modifiedSpell.additionalEffects = scaledEffect.additionalEffects;
    }
  }
  
  return modifiedSpell;
}
