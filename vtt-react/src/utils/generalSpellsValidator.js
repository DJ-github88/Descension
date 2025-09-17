/**
 * General Spells Validator
 * 
 * Validates that general spells conform to the spell wizard system requirements
 * and are properly formatted for MCP services integration.
 */

import { ALL_GENERAL_SPELLS, GENERAL_CATEGORIES } from '../data/generalSpellsData';
import { SKILL_BASED_ACTIONS } from '../data/skillBasedActionsData';
import { validateSpellAgainstWizard } from './spellLibraryCleanup';

// Required fields for general spells
const REQUIRED_GENERAL_SPELL_FIELDS = [
  'id',
  'name', 
  'description',
  'spellType',
  'source',
  'tags',
  'effectTypes',
  'dateCreated',
  'lastModified',
  'resourceCost',
  'targetingConfig',
  'durationConfig',
  'categoryIds'
];

// Valid spell types for general spells
const VALID_GENERAL_SPELL_TYPES = [
  'ACTION',
  'REACTION', 
  'PASSIVE'
];

// Valid effect types for general spells
const VALID_GENERAL_EFFECT_TYPES = [
  'damage',
  'healing',
  'buff',
  'debuff',
  'utility',
  'movement',
  'defensive',
  'control',
  'skill',
  'enhancement',
  'stealth'
];

/**
 * Validate a single general spell
 * @param {Object} spell - The spell to validate
 * @returns {Object} Validation result
 */
export const validateGeneralSpell = (spell) => {
  const errors = [];
  const warnings = [];

  // Check required fields
  REQUIRED_GENERAL_SPELL_FIELDS.forEach(field => {
    if (!spell[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Validate spell type
  if (spell.spellType && !VALID_GENERAL_SPELL_TYPES.includes(spell.spellType)) {
    errors.push(`Invalid spell type: ${spell.spellType}. Must be one of: ${VALID_GENERAL_SPELL_TYPES.join(', ')}`);
  }

  // Validate source
  if (spell.source !== 'general') {
    errors.push(`Invalid source: ${spell.source}. General spells must have source 'general'`);
  }

  // Validate effect types
  if (spell.effectTypes && Array.isArray(spell.effectTypes)) {
    spell.effectTypes.forEach(effectType => {
      if (!VALID_GENERAL_EFFECT_TYPES.includes(effectType)) {
        warnings.push(`Unknown effect type: ${effectType}`);
      }
    });
  }

  // Validate tags
  if (!spell.tags || !Array.isArray(spell.tags) || !spell.tags.includes('general')) {
    errors.push('General spells must include "general" in tags array');
  }

  // Validate resource cost structure
  if (spell.resourceCost) {
    const requiredResourceFields = ['mana', 'health', 'stamina', 'focus', 'actionPoints'];
    requiredResourceFields.forEach(field => {
      if (spell.resourceCost[field] === undefined) {
        warnings.push(`Missing resource cost field: ${field}`);
      }
    });
  }

  // Validate targeting config
  if (spell.targetingConfig) {
    if (!spell.targetingConfig.targetingType) {
      errors.push('Missing targetingConfig.targetingType');
    }
    if (!spell.targetingConfig.validTargets || !Array.isArray(spell.targetingConfig.validTargets)) {
      errors.push('Missing or invalid targetingConfig.validTargets array');
    }
  }

  // Validate duration config
  if (spell.durationConfig) {
    if (!spell.durationConfig.type) {
      errors.push('Missing durationConfig.type');
    }
  }

  // Validate category IDs
  if (spell.categoryIds && Array.isArray(spell.categoryIds)) {
    const validCategoryIds = GENERAL_CATEGORIES.map(cat => cat.id);
    spell.categoryIds.forEach(catId => {
      if (!validCategoryIds.includes(catId)) {
        warnings.push(`Unknown category ID: ${catId}`);
      }
    });
  }

  // Validate weapon-dependent spells
  if (spell.name === 'Attack' || spell.damageConfig?.weaponDependent) {
    if (!spell.damageConfig) {
      errors.push('Weapon-dependent spells must have damageConfig');
    }
    if (spell.damageConfig && !spell.damageConfig.weaponDependent) {
      warnings.push('Attack spells should have weaponDependent flag set to true');
    }
  }

  // Validate skill-based actions
  if (spell.tags && spell.tags.includes('skill')) {
    if (!spell.mechanicsConfig || !spell.mechanicsConfig.skillCheck) {
      errors.push('Skill-based actions must have mechanicsConfig.skillCheck');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    spellName: spell.name || 'Unknown'
  };
};

/**
 * Validate all general spells
 * @returns {Object} Complete validation results
 */
export const validateAllGeneralSpells = () => {
  const results = {
    valid: true,
    totalSpells: 0,
    validSpells: 0,
    invalidSpells: 0,
    spellResults: [],
    categoryResults: [],
    summary: {
      errors: [],
      warnings: []
    }
  };

  // Validate individual spells
  ALL_GENERAL_SPELLS.forEach(spell => {
    results.totalSpells++;
    
    const spellValidation = validateGeneralSpell(spell);
    results.spellResults.push(spellValidation);
    
    if (spellValidation.valid) {
      results.validSpells++;
    } else {
      results.invalidSpells++;
      results.valid = false;
      results.summary.errors.push(...spellValidation.errors.map(err => 
        `${spell.name || 'Unknown'}: ${err}`
      ));
    }
    
    results.summary.warnings.push(...spellValidation.warnings.map(warn => 
      `${spell.name || 'Unknown'}: ${warn}`
    ));
  });

  // Validate categories
  GENERAL_CATEGORIES.forEach(category => {
    const categoryValidation = validateGeneralCategory(category);
    results.categoryResults.push(categoryValidation);
    
    if (!categoryValidation.valid) {
      results.valid = false;
      results.summary.errors.push(...categoryValidation.errors.map(err => 
        `Category ${category.name}: ${err}`
      ));
    }
  });

  // Validate against wizard system
  ALL_GENERAL_SPELLS.forEach(spell => {
    const wizardValidation = validateSpellAgainstWizard(spell);
    if (!wizardValidation.isValid) {
      results.summary.warnings.push(`${spell.name}: ${wizardValidation.issues.join(', ')}`);
    }
  });

  return results;
};

/**
 * Validate a general spell category
 * @param {Object} category - The category to validate
 * @returns {Object} Validation result
 */
export const validateGeneralCategory = (category) => {
  const errors = [];
  const warnings = [];

  // Check required fields
  const requiredFields = ['id', 'name', 'description', 'icon', 'color', 'spells'];
  requiredFields.forEach(field => {
    if (!category[field]) {
      errors.push(`Missing required field: ${field}`);
    }
  });

  // Validate spells array
  if (category.spells && Array.isArray(category.spells)) {
    const allSpellIds = ALL_GENERAL_SPELLS.map(spell => spell.id);
    category.spells.forEach(spellId => {
      if (!allSpellIds.includes(spellId)) {
        warnings.push(`Category references unknown spell ID: ${spellId}`);
      }
    });
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
    categoryName: category.name || 'Unknown'
  };
};

/**
 * Check MCP services compatibility
 * @returns {Object} Compatibility check results
 */
export const checkMCPCompatibility = () => {
  const results = {
    compatible: true,
    issues: [],
    recommendations: []
  };

  // Check if spells have proper formatting for spell cards
  ALL_GENERAL_SPELLS.forEach(spell => {
    // Check for proper icon format
    if (spell.icon && !spell.icon.includes('wow.zamimg.com') && !spell.icon.startsWith('ability_') && !spell.icon.startsWith('spell_') && !spell.icon.startsWith('inv_')) {
      results.recommendations.push(`${spell.name}: Consider using WoW-style icon naming for consistency`);
    }

    // Check for proper description format
    if (spell.description && spell.description.length < 10) {
      results.recommendations.push(`${spell.name}: Description is very short, consider expanding for better UX`);
    }

    // Check for proper effect configuration
    if (spell.effectTypes.includes('damage') && !spell.damageConfig) {
      results.issues.push(`${spell.name}: Damage spell missing damageConfig`);
      results.compatible = false;
    }
  });

  return results;
};

/**
 * Generate validation report
 * @returns {string} Human-readable validation report
 */
export const generateValidationReport = () => {
  const validation = validateAllGeneralSpells();
  const mcpCheck = checkMCPCompatibility();
  
  let report = '=== General Spells Validation Report ===\n\n';
  
  report += `Total Spells: ${validation.totalSpells}\n`;
  report += `Valid Spells: ${validation.validSpells}\n`;
  report += `Invalid Spells: ${validation.invalidSpells}\n`;
  report += `Overall Status: ${validation.valid ? 'VALID' : 'INVALID'}\n\n`;
  
  if (validation.summary.errors.length > 0) {
    report += 'ERRORS:\n';
    validation.summary.errors.forEach(error => {
      report += `  - ${error}\n`;
    });
    report += '\n';
  }
  
  if (validation.summary.warnings.length > 0) {
    report += 'WARNINGS:\n';
    validation.summary.warnings.forEach(warning => {
      report += `  - ${warning}\n`;
    });
    report += '\n';
  }
  
  report += `MCP Compatibility: ${mcpCheck.compatible ? 'COMPATIBLE' : 'ISSUES FOUND'}\n`;
  
  if (mcpCheck.issues.length > 0) {
    report += 'MCP Issues:\n';
    mcpCheck.issues.forEach(issue => {
      report += `  - ${issue}\n`;
    });
  }
  
  if (mcpCheck.recommendations.length > 0) {
    report += 'MCP Recommendations:\n';
    mcpCheck.recommendations.forEach(rec => {
      report += `  - ${rec}\n`;
    });
  }
  
  return report;
};

// Auto-run validation in development
if (process.env.NODE_ENV === 'development') {
  setTimeout(() => {
    const report = generateValidationReport();
    console.log(report);
  }, 2000);
}
