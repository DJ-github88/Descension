/**
 * Spell Library Cleanup Utility
 * 
 * This utility ensures all spells in the library adhere to the spell wizard's validation rules
 * and removes any spells that bypass the wizard system or have formatting issues.
 */

import { ensureReadableFormat } from '../components/spellcrafting-wizard/components/common/SpellCardUtils';

// Valid spell fields that the wizard supports
const VALID_WIZARD_FIELDS = [
  'id', 'name', 'description', 'icon', 'level', 'school', 'spellType', 'tags', 'effectTypes',
  'damageTypes', 'damageConfig', 'healingConfig', 'buffConfig', 'debuffConfig', 'controlConfig',
  'utilityConfig', 'summoningConfig', 'transformConfig', 'purificationConfig', 'restorationConfig',
  'targetingConfig', 'durationConfig', 'resourceCost', 'resourceConfig', 'cooldownConfig',
  'triggerConfig', 'trapConfig', 'channelingConfig', 'criticalConfig', 'procConfig',
  'rollableTable', 'resolution', 'cardConfig', 'coinConfig', 'dateCreated', 'lastModified',
  'categoryIds', 'visualTheme', 'castingDescription', 'effectDescription', 'impactDescription'
];

// Deprecated fields that should be removed
const DEPRECATED_FIELDS = [
  'effectType', 'primaryDamage', 'healing', 'diceConfig', 'manaCost', 'range', 'cooldown',
  'areaType', 'areaSize', 'targetingMode', 'validTargets', 'charges'
];

/**
 * Clean and validate a single spell
 * @param {Object} spell - The spell to clean
 * @returns {Object} - The cleaned spell or null if invalid
 */
export function cleanSpell(spell) {
  if (!spell || typeof spell !== 'object') {
    console.warn('Invalid spell object:', spell);
    return null;
  }

  // Create a clean copy
  const cleanedSpell = {};

  // Copy only valid fields
  VALID_WIZARD_FIELDS.forEach(field => {
    if (spell.hasOwnProperty(field)) {
      cleanedSpell[field] = spell[field];
    }
  });

  // Ensure required fields
  if (!cleanedSpell.id) {
    console.warn('Spell missing required ID:', spell.name || 'Unknown');
    return null;
  }

  if (!cleanedSpell.name) {
    console.warn('Spell missing required name:', cleanedSpell.id);
    return null;
  }

  // Clean up text fields to remove CAPS_UNDERSCORE formatting
  if (cleanedSpell.description) {
    cleanedSpell.description = ensureReadableFormat(cleanedSpell.description);
  }

  if (cleanedSpell.castingDescription) {
    cleanedSpell.castingDescription = ensureReadableFormat(cleanedSpell.castingDescription);
  }

  if (cleanedSpell.effectDescription) {
    cleanedSpell.effectDescription = ensureReadableFormat(cleanedSpell.effectDescription);
  }

  if (cleanedSpell.impactDescription) {
    cleanedSpell.impactDescription = ensureReadableFormat(cleanedSpell.impactDescription);
  }

  // Clean up formulas in damage config
  if (cleanedSpell.damageConfig && cleanedSpell.damageConfig.formula) {
    cleanedSpell.damageConfig.formula = ensureReadableFormat(cleanedSpell.damageConfig.formula);
  }

  // Clean up formulas in healing config
  if (cleanedSpell.healingConfig && cleanedSpell.healingConfig.formula) {
    cleanedSpell.healingConfig.formula = ensureReadableFormat(cleanedSpell.healingConfig.formula);
  }

  // Clean up card config formulas
  if (cleanedSpell.cardConfig && cleanedSpell.cardConfig.formula) {
    cleanedSpell.cardConfig.formula = ensureReadableFormat(cleanedSpell.cardConfig.formula);
  }

  // Clean up coin config formulas
  if (cleanedSpell.coinConfig && cleanedSpell.coinConfig.formula) {
    cleanedSpell.coinConfig.formula = ensureReadableFormat(cleanedSpell.coinConfig.formula);
  }

  // Ensure proper spell type
  if (!cleanedSpell.spellType) {
    cleanedSpell.spellType = 'ACTION';
  }

  // Ensure proper effect types array
  if (!cleanedSpell.effectTypes || !Array.isArray(cleanedSpell.effectTypes)) {
    cleanedSpell.effectTypes = ['damage']; // Default to damage
  }

  // Ensure proper tags array
  if (!cleanedSpell.tags || !Array.isArray(cleanedSpell.tags)) {
    cleanedSpell.tags = [];
  }

  // Ensure proper targeting config
  if (!cleanedSpell.targetingConfig) {
    cleanedSpell.targetingConfig = {
      targetingType: 'single',
      range: 30,
      validTargets: ['enemy']
    };
  }

  // Ensure proper resource cost
  if (!cleanedSpell.resourceCost) {
    cleanedSpell.resourceCost = {
      mana: 10,
      health: 0,
      stamina: 0,
      focus: 0
    };
  }

  // Ensure timestamps
  if (!cleanedSpell.dateCreated) {
    cleanedSpell.dateCreated = new Date().toISOString();
  }

  if (!cleanedSpell.lastModified) {
    cleanedSpell.lastModified = new Date().toISOString();
  }

  // Ensure resolution method
  if (!cleanedSpell.resolution) {
    cleanedSpell.resolution = 'DICE';
  }

  return cleanedSpell;
}

/**
 * Clean an entire spell library
 * @param {Array} spells - Array of spells to clean
 * @returns {Array} - Array of cleaned spells
 */
export function cleanSpellLibrary(spells) {
  if (!Array.isArray(spells)) {
    return [];
  }

  const cleanedSpells = [];
  const seenIds = new Set();

  spells.forEach((spell, index) => {
    const cleaned = cleanSpell(spell);

    if (!cleaned) {
      return;
    }

    // Check for duplicate IDs
    if (seenIds.has(cleaned.id)) {
      return;
    }

    seenIds.add(cleaned.id);
    cleanedSpells.push(cleaned);
  });

  console.log(`Cleaned spell library: ${cleanedSpells.length} valid spells from ${spells.length} original spells`);
  return cleanedSpells;
}

/**
 * Validate that a spell adheres to wizard rules
 * @param {Object} spell - The spell to validate
 * @returns {Object} - Validation result with isValid and issues
 */
export function validateSpellAgainstWizard(spell) {
  const issues = [];
  let isValid = true;

  // Check for deprecated fields
  DEPRECATED_FIELDS.forEach(field => {
    if (spell.hasOwnProperty(field)) {
      issues.push(`Contains deprecated field: ${field}`);
      isValid = false;
    }
  });

  // Check for invalid fields
  Object.keys(spell).forEach(field => {
    if (!VALID_WIZARD_FIELDS.includes(field)) {
      issues.push(`Contains invalid field: ${field}`);
      isValid = false;
    }
  });

  // Check for CAPS_UNDERSCORE formatting in text fields
  const textFields = ['description', 'castingDescription', 'effectDescription', 'impactDescription'];
  textFields.forEach(field => {
    if (spell[field] && typeof spell[field] === 'string') {
      if (/\b[A-Z][A-Z_]+[A-Z]\b/.test(spell[field])) {
        issues.push(`Field ${field} contains CAPS_UNDERSCORE formatting`);
        isValid = false;
      }
    }
  });

  // Check for complex conditional expressions
  const formulaFields = [
    'damageConfig.formula',
    'healingConfig.formula', 
    'cardConfig.formula',
    'coinConfig.formula'
  ];

  formulaFields.forEach(fieldPath => {
    const value = getNestedValue(spell, fieldPath);
    if (value && typeof value === 'string') {
      if (/\d+:0/.test(value) || /\?\s*\d+\s*:/.test(value)) {
        issues.push(`Field ${fieldPath} contains complex conditional expression: ${value}`);
        isValid = false;
      }
    }
  });

  return { isValid, issues };
}

/**
 * Helper function to get nested object values
 * @param {Object} obj - The object
 * @param {string} path - The path (e.g., 'damageConfig.formula')
 * @returns {*} - The value or undefined
 */
function getNestedValue(obj, path) {
  return path.split('.').reduce((current, key) => current && current[key], obj);
}

/**
 * Remove all spells that don't pass wizard validation
 * @param {Array} spells - Array of spells
 * @returns {Array} - Array of valid spells only
 */
export function removeInvalidSpells(spells) {
  return spells.filter(spell => {
    const validation = validateSpellAgainstWizard(spell);
    if (!validation.isValid) {
      return false;
    }
    return true;
  });
}
