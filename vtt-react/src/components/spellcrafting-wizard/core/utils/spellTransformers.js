/**
 * Utility functions to transform spell data for various display purposes
 */

/**
 * Transform a spell from the library format to the format expected by spell cards
 * @param {Object} spell - The spell object from the library
 * @returns {Object} - The transformed spell object
 */
export const transformSpellForCard = (spell) => {
  if (!spell) return null;

  // Create a deep copy to avoid modifying the original
  const transformedSpell = JSON.parse(JSON.stringify(spell));

  // Ensure all required properties exist
  transformedSpell.id = transformedSpell.id || 'unknown';
  transformedSpell.name = transformedSpell.name || 'Unnamed Spell';
  transformedSpell.description = transformedSpell.description || '';
  transformedSpell.level = transformedSpell.level || 1;
  transformedSpell.icon = transformedSpell.icon || transformedSpell.typeConfig?.icon || 'inv_misc_questionmark';
  transformedSpell.spellType = transformedSpell.spellType || 'ACTION';
  transformedSpell.effectType = transformedSpell.effectType || 'utility';

  // Ensure type configuration exists
  transformedSpell.typeConfig = transformedSpell.typeConfig || {};

  // Ensure AOE information exists
  transformedSpell.aoeShape = transformedSpell.aoeShape || 'circle';
  transformedSpell.aoeSize = transformedSpell.aoeSize || 20;
  transformedSpell.aoeParameters = transformedSpell.aoeParameters || {};
  transformedSpell.movementBehavior = transformedSpell.movementBehavior || 'static';
  transformedSpell.targetingConfig = transformedSpell.targetingConfig || {};

  // Ensure propagation information exists
  if (!transformedSpell.propagation) {
    transformedSpell.propagation = {
      method: 'none',
      behavior: '',
      count: 0,
      range: 0,
      decay: 0,
      secondaryRadius: 0,
      spreadRate: 0,
      forkCount: 0,
      parameters: {}
    };
  }

  // Ensure damage/healing information exists for damage spells
  if (!transformedSpell.primaryDamage &&
      (transformedSpell.effectTypes?.includes('damage') || transformedSpell.damageTypes?.length > 0)) {
    // Check if we have a damageConfig with a formula
    if (transformedSpell.damageConfig?.formula) {
      const formula = transformedSpell.damageConfig.formula;
      const diceMatch = formula.match(/(\d+d\d+)/);
      const flatMatch = formula.match(/\+\s*(\d+)/);

      transformedSpell.primaryDamage = {
        dice: diceMatch ? diceMatch[1] : formula,
        flat: flatMatch ? parseInt(flatMatch[1]) : 0
      };
    } else if (transformedSpell.formula) {
      // Fallback to formula field, but only for damage spells
      const diceMatch = transformedSpell.formula.match(/(\d+d\d+)/);
      const flatMatch = transformedSpell.formula.match(/\+\s*(\d+)/);

      transformedSpell.primaryDamage = {
        dice: diceMatch ? diceMatch[1] : transformedSpell.formula,
        flat: flatMatch ? parseInt(flatMatch[1]) : 0
      };
    }
  }

  if (!transformedSpell.healing && transformedSpell.effectTypes?.includes('healing')) {
    // Check if we have a healingConfig with a formula
    if (transformedSpell.healingConfig?.formula) {
      const formula = transformedSpell.healingConfig.formula;
      const diceMatch = formula.match(/(\d+d\d+)/);
      const flatMatch = formula.match(/\+\s*(\d+)/);

      transformedSpell.healing = {
        dice: diceMatch ? diceMatch[1] : formula,
        flat: flatMatch ? parseInt(flatMatch[1]) : 0
      };
    } else if (transformedSpell.formula) {
      // Fallback to formula field, but only for healing spells
      const diceMatch = transformedSpell.formula.match(/(\d+d\d+)/);
      const flatMatch = transformedSpell.formula.match(/\+\s*(\d+)/);

      transformedSpell.healing = {
        dice: diceMatch ? diceMatch[1] : transformedSpell.formula,
        flat: flatMatch ? parseInt(flatMatch[1]) : 0
      };
    }
  }

  // Ensure damage types exist
  transformedSpell.damageTypes = transformedSpell.damageTypes || [];

  // If we have a school in typeConfig but no damageTypes, add it
  if (transformedSpell.typeConfig?.school && transformedSpell.damageTypes.length === 0) {
    transformedSpell.damageTypes.push(transformedSpell.typeConfig.school);
  }

  // Ensure resolution method exists for spells that need it
  if (transformedSpell.effectTypes?.includes('damage') ||
      transformedSpell.effectTypes?.includes('healing') ||
      transformedSpell.effectTypes?.includes('control') ||
      transformedSpell.effectTypes?.includes('debuff') ||
      transformedSpell.effectTypes?.includes('utility') ||
      transformedSpell.effectTypes?.includes('summoning') ||
      transformedSpell.effectTypes?.includes('transformation')) {
    transformedSpell.resolution = transformedSpell.resolution || 'DICE';
    // Add formula if the spell has damage or healing configs
    if (transformedSpell.damageConfig?.formula || transformedSpell.healingConfig?.formula) {
      transformedSpell.formula = transformedSpell.formula || transformedSpell.damageConfig?.formula || transformedSpell.healingConfig?.formula;
    }
  }

  // Ensure resource configuration exists
  if (!transformedSpell.resourceCost) {
    transformedSpell.resourceCost = {
      actionPoints: 0,
      primaryResourceType: 'Mana',
      classResourceCost: 0,
      components: [],
      materialComponents: '',
      useFormulas: {},
      resourceFormulas: {},
      resourceValues: {}
    };
  }

  // Ensure cooldown configuration exists
  if (!transformedSpell.cooldownConfig) {
    transformedSpell.cooldownConfig = {
      type: 'turn_based',
      value: 1,
      charges: 1,
      recovery: 1,
      sharesCooldown: false,
      cooldownGroup: ''
    };
  }

  // Ensure tags are properly formatted
  if (!transformedSpell.tags || !Array.isArray(transformedSpell.tags)) {
    transformedSpell.tags = [];
  }

  return transformedSpell;
};

/**
 * Get the rollable table data from a spell
 * @param {Object} spell - The spell object
 * @returns {Object|null} - The rollable table data or null if not found
 */
export const getSpellRollableTable = (spell) => {
  if (!spell) return null;

  // Try to find the rollable table data in various locations
  return spell.rollableTable ||
         spell.rollTable ||
         spell.randomTable ||
         spell.randomEffectsTable ||
         spell.typeConfig?.rollableTable ||
         spell.effectConfig?.rollableTable ||
         spell.mechanicsConfig?.rollableTable ||
         spell.spellConfig?.rollableTable ||
         null;
};

/**
 * Get a WoW-style icon URL for a spell
 * @param {string} iconName - The icon name
 * @returns {string} - The icon URL
 */
export const getSpellIconUrl = (iconName) => {
  if (!iconName) return '';
  return `https://wow.zamimg.com/images/wow/icons/large/${iconName}.jpg`;
};

/**
 * Format a spell type for display
 * @param {string} type - The spell type
 * @returns {string} - The formatted spell type
 */
export const formatSpellType = (type) => {
  if (!type) return '';
  
  return type.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

/**
 * Get a color for a spell type
 * @param {string} type - The spell type
 * @returns {string} - The color hex code
 */
export const getSpellTypeColor = (type) => {
  switch (type) {
    case 'ACTION': return '#f44336';
    case 'PASSIVE': return '#4caf50';
    case 'REACTION': return '#2196f3';
    case 'CHANNELED': return '#9c27b0';
    case 'TRAP': return '#ff9800';
    case 'STATE': return '#607d8b';
    default: return '#888888';
  }
};

/**
 * Get an icon for a spell type
 * @param {string} type - The spell type
 * @returns {string} - The icon class name
 */
export const getSpellTypeIcon = (type) => {
  switch (type) {
    case 'ACTION': return 'bolt';
    case 'PASSIVE': return 'shield-alt';
    case 'REACTION': return 'redo-alt';
    case 'CHANNELED': return 'spinner';
    case 'TRAP': return 'bomb';
    case 'STATE': return 'hourglass-half';
    default: return 'magic';
  }
};

export default {
  transformSpellForCard,
  getSpellRollableTable,
  getSpellIconUrl,
  formatSpellType,
  getSpellTypeColor,
  getSpellTypeIcon
};
