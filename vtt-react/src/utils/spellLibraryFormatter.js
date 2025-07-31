/**
 * Spell Library Formatter
 *
 * This utility ensures all spells in the library are properly formatted
 * for the UnifiedSpellCard component and current wizard standards.
 */

import { getCreatureById } from '../data/creatureLibraryData';

/**
 * Resolve summoning creature IDs to full creature objects
 */
function resolveSummoningCreatures(summoningConfig) {
  if (!summoningConfig) return summoningConfig;

  const resolved = { ...summoningConfig };

  // Handle selectedCreature (single creature ID)
  if (resolved.selectedCreature && typeof resolved.selectedCreature === 'string') {
    const creature = getCreatureById(resolved.selectedCreature);
    if (creature) {
      // Convert single creature to creatures array format
      resolved.creatures = [{
        ...creature,
        config: {
          quantity: resolved.summonQuantity || resolved.quantity || 1,
          duration: resolved.duration || 10,
          durationUnit: resolved.durationUnit || 'minutes',
          hasDuration: resolved.hasDuration !== false,
          concentration: resolved.concentration || false,
          controlType: resolved.controlType || 'verbal',
          controlRange: resolved.controlRange || 60
        }
      }];
      // Keep the selectedCreature for backward compatibility
      resolved.selectedCreature = creature;
    }
  }

  // Handle creatures array - resolve any string IDs to full objects
  if (resolved.creatures && Array.isArray(resolved.creatures)) {
    resolved.creatures = resolved.creatures.map(creature => {
      if (typeof creature === 'string') {
        const fullCreature = getCreatureById(creature);
        return fullCreature ? {
          ...fullCreature,
          config: {
            quantity: 1,
            duration: resolved.duration || 10,
            durationUnit: resolved.durationUnit || 'minutes',
            hasDuration: resolved.hasDuration !== false,
            concentration: resolved.concentration || false,
            controlType: resolved.controlType || 'verbal',
            controlRange: resolved.controlRange || 60
          }
        } : creature;
      }
      return creature;
    }).filter(Boolean); // Remove any null/undefined creatures
  }

  return resolved;
}

/**
 * Format a single spell to ensure it meets all requirements
 */
export function formatSpellForLibrary(spell) {
  const formatted = { ...spell };

  // Ensure required basic fields
  if (!formatted.id) {
    formatted.id = `spell-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
  
  if (!formatted.name || formatted.name.trim() === '') {
    formatted.name = 'Unnamed Spell';
  }
  
  if (!formatted.description) {
    formatted.description = 'A magical spell with mysterious effects.';
  }

  // Ensure spell type is valid
  const validSpellTypes = ['ACTION', 'REACTION', 'PASSIVE', 'CHANNELED', 'TRAP', 'STATE'];
  if (!formatted.spellType || !validSpellTypes.includes(formatted.spellType)) {
    formatted.spellType = 'ACTION';
  }

  // Ensure effect types array exists and is valid
  const validEffectTypes = ['damage', 'healing', 'buff', 'debuff', 'control', 'utility', 'summoning', 'summon', 'transformation', 'transform', 'purification', 'restoration'];
  if (!formatted.effectTypes || !Array.isArray(formatted.effectTypes) || formatted.effectTypes.length === 0) {
    formatted.effectTypes = ['utility']; // Default fallback
  } else {
    // Filter out invalid effect types
    formatted.effectTypes = formatted.effectTypes.filter(type => validEffectTypes.includes(type));
    if (formatted.effectTypes.length === 0) {
      formatted.effectTypes = ['utility'];
    }
  }

  // Ensure timestamps exist
  if (!formatted.dateCreated) {
    formatted.dateCreated = new Date().toISOString();
  }
  
  if (!formatted.lastModified) {
    formatted.lastModified = new Date().toISOString();
  }

  // Ensure visual theme exists
  if (!formatted.visualTheme) {
    if (formatted.effectTypes.includes('damage')) {
      formatted.visualTheme = 'arcane';
    } else if (formatted.effectTypes.includes('healing')) {
      formatted.visualTheme = 'holy';
    } else {
      formatted.visualTheme = 'neutral';
    }
  }

  // Ensure tags array exists
  if (!formatted.tags || !Array.isArray(formatted.tags)) {
    formatted.tags = [];
  }

  // Ensure categoryIds array exists
  if (!formatted.categoryIds || !Array.isArray(formatted.categoryIds)) {
    formatted.categoryIds = [];
  }

  // Format damage configuration
  if (formatted.effectTypes.includes('damage')) {
    if (!formatted.damageConfig) {
      formatted.damageConfig = {
        damageType: 'direct',
        elementType: formatted.damageTypes?.[0] || 'force',
        formula: '1d6',
        hasDotEffect: false
      };
    }
    
    // Ensure damage types array exists
    if (!formatted.damageTypes || !Array.isArray(formatted.damageTypes)) {
      formatted.damageTypes = [formatted.damageConfig.elementType || 'force'];
    }
  }

  // Format healing configuration
  if (formatted.effectTypes.includes('healing')) {
    if (!formatted.healingConfig) {
      formatted.healingConfig = {
        healingType: 'direct',
        formula: '1d4',
        hasHotEffect: false
      };
    }
  }

  // Format buff configuration
  if (formatted.effectTypes.includes('buff')) {
    if (!formatted.buffConfig) {
      formatted.buffConfig = {
        effects: [{
          type: 'stat',
          target: 'strength',
          value: 2,
          duration: 1
        }]
      };
    }
  }

  // Format debuff configuration
  if (formatted.effectTypes.includes('debuff')) {
    if (!formatted.debuffConfig) {
      formatted.debuffConfig = {
        effects: [{
          type: 'stat',
          target: 'strength',
          value: -2,
          duration: 1
        }]
      };
    }
  }

  // Format control configuration
  if (formatted.effectTypes.includes('control')) {
    if (!formatted.controlConfig) {
      formatted.controlConfig = {
        controlType: 'stun',
        duration: 1,
        saveType: 'constitution'
      };
    }
  }

  // Format summoning configuration and resolve creature IDs
  if (formatted.effectTypes.includes('summoning') || formatted.effectTypes.includes('summon')) {
    // Handle both summonConfig and summoningConfig
    const summoningConfig = formatted.summonConfig || formatted.summoningConfig;

    if (summoningConfig) {
      // Resolve creature IDs to full creature objects
      const resolvedConfig = resolveSummoningCreatures(summoningConfig);

      // Update both possible config names for compatibility
      formatted.summonConfig = resolvedConfig;
      formatted.summoningConfig = resolvedConfig;
    } else {
      // Create default summoning config if none exists
      formatted.summonConfig = {
        creatures: [],
        duration: 10,
        durationUnit: 'minutes',
        hasDuration: true,
        concentration: false,
        quantity: 1,
        controlType: 'verbal',
        controlRange: 60
      };
      formatted.summoningConfig = formatted.summonConfig;
    }
  }

  // Ensure targeting configuration exists
  if (!formatted.targetingConfig) {
    formatted.targetingConfig = {
      targetType: 'single',
      range: 'touch',
      areaOfEffect: null,
      requiresLineOfSight: true,
      canTargetSelf: true,
      canTargetAllies: true,
      canTargetEnemies: true
    };
  }

  // Ensure resource configuration exists
  if (!formatted.resourceCost && !formatted.resourceConfig) {
    formatted.resourceConfig = {
      manaCost: 1,
      staminaCost: 0,
      healthCost: 0,
      focusCost: 0
    };
  }

  // Ensure duration configuration exists
  if (!formatted.durationConfig) {
    formatted.durationConfig = {
      type: 'instant',
      value: 0,
      unit: 'seconds',
      concentration: false,
      dispellable: false
    };
  }

  // Fix invalid resolution types
  if (formatted.resolution && !['DICE', 'CARDS', 'COINS'].includes(formatted.resolution)) {
    formatted.resolution = 'DICE';
  }

  // Remove deprecated fields
  const deprecatedFields = ['effectType', 'primaryDamage', 'healing', 'diceConfig'];
  deprecatedFields.forEach(field => {
    if (formatted.hasOwnProperty(field)) {
      delete formatted[field];
    }
  });

  return formatted;
}

/**
 * Format an entire spell library
 */
export function formatSpellLibrary(spells) {
  return spells.map(spell => formatSpellForLibrary(spell));
}

/**
 * Validate that a spell is properly formatted for UnifiedSpellCard
 */
export function validateSpellFormat(spell) {
  const issues = [];

  // Check required fields
  if (!spell.id) issues.push('Missing ID');
  if (!spell.name) issues.push('Missing name');
  if (!spell.spellType) issues.push('Missing spell type');
  if (!spell.effectTypes || !Array.isArray(spell.effectTypes) || spell.effectTypes.length === 0) {
    issues.push('Missing or invalid effect types');
  }

  // Check configurations based on effect types
  if (spell.effectTypes?.includes('damage') && !spell.damageConfig) {
    issues.push('Missing damage configuration for damage spell');
  }
  
  if (spell.effectTypes?.includes('healing') && !spell.healingConfig) {
    issues.push('Missing healing configuration for healing spell');
  }

  return {
    isValid: issues.length === 0,
    issues
  };
}

/**
 * Generate a report of library formatting status
 */
export function generateLibraryReport(spells) {
  const report = {
    totalSpells: spells.length,
    validSpells: 0,
    invalidSpells: 0,
    issues: []
  };

  spells.forEach(spell => {
    const validation = validateSpellFormat(spell);
    if (validation.isValid) {
      report.validSpells++;
    } else {
      report.invalidSpells++;
      report.issues.push({
        spellName: spell.name || 'Unnamed',
        spellId: spell.id || 'No ID',
        issues: validation.issues
      });
    }
  });

  return report;
}
