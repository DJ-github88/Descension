/**
 * Spell Data Validator
 * 
 * Validates spell data to ensure all spells have:
 * 1. Proper damage types (radiant, necrotic, fire, etc.)
 * 2. Complete stat modifier names (not just "Stat")
 * 3. Complete status effect descriptions
 * 
 * Run this to identify spells that need fixing.
 */

/**
 * Validate a single spell object
 * @param {Object} spell - The spell to validate
 * @returns {Object} Validation result with issues array
 */
export const validateSpell = (spell) => {
  const issues = [];
  const warnings = [];
  
  if (!spell) {
    return { valid: false, issues: ['Spell is null or undefined'], warnings: [] };
  }

  const spellName = spell.name || spell.id || 'Unknown Spell';

  // 1. Check for damage types
  const hasDamageConfig = spell.damageConfig && (spell.damageConfig.formula || spell.damageConfig.damageType);
  const hasHealingConfig = spell.healingConfig && spell.healingConfig.formula;
  const hasBuffConfig = spell.buffConfig;
  const hasDebuffConfig = spell.debuffConfig;

  // If spell deals damage, it should have a damage type
  if (hasDamageConfig) {
    const hasDamageTypes = spell.damageTypes && Array.isArray(spell.damageTypes) && spell.damageTypes.length > 0;
    const hasElementType = spell.elementType && spell.elementType.trim();
    const hasDamageConfigElementType = spell.damageConfig?.elementType && spell.damageConfig.elementType.trim();

    if (!hasDamageTypes && !hasElementType && !hasDamageConfigElementType) {
      issues.push(`Missing damage type - spell deals damage but has no damageTypes, elementType, or damageConfig.elementType`);
    }

    // Check if damage type is a magic school instead of actual damage type
    const magicSchools = ['arcane', 'divine', 'primal', 'occult', 'evocation', 'necromancy', 'enchantment', 'illusion', 'transmutation', 'conjuration', 'abjuration', 'divination'];
    const damageType = spell.damageTypes?.[0] || spell.elementType || spell.damageConfig?.elementType;
    if (damageType && magicSchools.includes(damageType.toLowerCase())) {
      warnings.push(`Damage type "${damageType}" is a magic school, not a damage type. Use: fire, cold, lightning, radiant, necrotic, poison, acid, force, psychic, physical, etc.`);
    }
  }

  // 2. Check buff config for incomplete stat modifiers
  if (hasBuffConfig && spell.buffConfig.statModifiers && spell.buffConfig.statModifiers.length > 0) {
    spell.buffConfig.statModifiers.forEach((stat, index) => {
      const statName = stat.name || stat.id || '';
      
      // Check for generic "Stat" names
      if (!statName || statName.toLowerCase() === 'stat' || statName.toLowerCase().includes('stat') && !statName.toLowerCase().includes('strength') && !statName.toLowerCase().includes('agility')) {
        issues.push(`Buff stat modifier #${index + 1} has incomplete name: "${statName}" - specify actual stat (strength, agility, constitution, intelligence, spirit, charisma)`);
      }

      // Check for missing magnitude
      if (stat.magnitude === undefined && stat.value === undefined) {
        issues.push(`Buff stat modifier "${statName}" has no magnitude/value`);
      }
    });
  }

  // 3. Check buff config for incomplete status effects
  if (hasBuffConfig && spell.buffConfig.statusEffects && spell.buffConfig.statusEffects.length > 0) {
    spell.buffConfig.statusEffects.forEach((effect, index) => {
      const effectName = effect.name || effect.id || '';
      const effectDescription = effect.description || '';

      if (!effectName) {
        issues.push(`Buff status effect #${index + 1} has no name`);
      }

      if (!effectDescription || effectDescription.toLowerCase().includes('beneficial status effect')) {
        issues.push(`Buff status effect "${effectName}" has incomplete description - add specific description of what the effect does`);
      }
    });
  }

  // 4. Check debuff config for incomplete stat modifiers
  if (hasDebuffConfig && spell.debuffConfig.statPenalties && spell.debuffConfig.statPenalties.length > 0) {
    spell.debuffConfig.statPenalties.forEach((stat, index) => {
      const statName = stat.stat || stat.name || stat.id || '';
      
      if (!statName || statName.toLowerCase() === 'stat' || statName.toLowerCase().includes('stat') && !statName.toLowerCase().includes('strength') && !statName.toLowerCase().includes('agility')) {
        issues.push(`Debuff stat penalty #${index + 1} has incomplete name: "${statName}" - specify actual stat`);
      }

      if (stat.amount === undefined && stat.magnitude === undefined) {
        issues.push(`Debuff stat penalty "${statName}" has no amount/magnitude`);
      }
    });
  }

  // 5. Check debuff config for incomplete status effects
  if (hasDebuffConfig && spell.debuffConfig.statusEffects && spell.debuffConfig.statusEffects.length > 0) {
    spell.debuffConfig.statusEffects.forEach((effect, index) => {
      const effectName = effect.name || effect.id || '';
      const effectDescription = effect.description || '';

      if (!effectName) {
        issues.push(`Debuff status effect #${index + 1} has no name`);
      }

      if (!effectDescription || effectDescription.toLowerCase().includes('harmful status effect')) {
        issues.push(`Debuff status effect "${effectName}" has incomplete description - add specific description of what the effect does`);
      }
    });
  }

  // 6. Check for healing spells without proper type
  if (hasHealingConfig && !hasDamageConfig) {
    // Healing spells might not need damage types, but should have elementType for theming
    if (!spell.elementType && !spell.damageTypes?.length) {
      warnings.push(`Healing spell has no elementType - consider adding 'radiant', 'nature', or 'divine' for theming`);
    }
  }

  return {
    valid: issues.length === 0,
    spellName,
    issues,
    warnings
  };
};

/**
 * Validate an array of spells
 * @param {Array} spells - Array of spell objects
 * @returns {Object} Summary of validation results
 */
export const validateSpells = (spells) => {
  if (!Array.isArray(spells)) {
    return { valid: false, error: 'Input is not an array' };
  }

  const results = spells.map(spell => validateSpell(spell));
  const invalidSpells = results.filter(r => !r.valid);
  const spellsWithWarnings = results.filter(r => r.warnings.length > 0);

  return {
    total: spells.length,
    valid: results.length - invalidSpells.length,
    invalid: invalidSpells.length,
    withWarnings: spellsWithWarnings.length,
    invalidSpells,
    spellsWithWarnings,
    allResults: results
  };
};

/**
 * Print validation report to console
 * @param {Object} validationResult - Result from validateSpells
 */
export const printValidationReport = (validationResult) => {
  console.log('\n=== SPELL VALIDATION REPORT ===\n');
  console.log(`Total Spells: ${validationResult.total}`);
  console.log(`Valid: ${validationResult.valid}`);
  console.log(`Invalid: ${validationResult.invalid}`);
  console.log(`With Warnings: ${validationResult.withWarnings}`);

  if (validationResult.invalid > 0) {
    console.log('\n--- INVALID SPELLS ---\n');
    validationResult.invalidSpells.forEach(result => {
      console.log(`\n❌ ${result.spellName}`);
      result.issues.forEach(issue => {
        console.log(`   • ${issue}`);
      });
      if (result.warnings.length > 0) {
        result.warnings.forEach(warning => {
          console.log(`   ⚠️  ${warning}`);
        });
      }
    });
  }

  if (validationResult.withWarnings > 0 && validationResult.invalid === 0) {
    console.log('\n--- SPELLS WITH WARNINGS ---\n');
    validationResult.spellsWithWarnings.forEach(result => {
      if (result.valid) { // Only show warnings for otherwise valid spells
        console.log(`\n⚠️  ${result.spellName}`);
        result.warnings.forEach(warning => {
          console.log(`   • ${warning}`);
        });
      }
    });
  }

  console.log('\n=== END REPORT ===\n');
};

/**
 * Get suggested fixes for common issues
 * @param {Object} spell - The spell with issues
 * @param {Array} issues - Array of issue strings
 * @returns {Array} Array of suggested fixes
 */
export const getSuggestedFixes = (spell, issues) => {
  const fixes = [];

  issues.forEach(issue => {
    if (issue.includes('Missing damage type')) {
      // Try to infer damage type from spell name/description
      const spellText = `${spell.name || ''} ${spell.description || ''}`.toLowerCase();
      
      if (spellText.includes('fire') || spellText.includes('flame') || spellText.includes('burn')) {
        fixes.push(`Add damageTypes: ['fire']`);
      } else if (spellText.includes('cold') || spellText.includes('frost') || spellText.includes('ice')) {
        fixes.push(`Add damageTypes: ['cold']`);
      } else if (spellText.includes('lightning') || spellText.includes('electric') || spellText.includes('thunder')) {
        fixes.push(`Add damageTypes: ['lightning']`);
      } else if (spellText.includes('radiant') || spellText.includes('holy') || spellText.includes('divine') || spellText.includes('light')) {
        fixes.push(`Add damageTypes: ['radiant']`);
      } else if (spellText.includes('necrotic') || spellText.includes('shadow') || spellText.includes('death') || spellText.includes('decay')) {
        fixes.push(`Add damageTypes: ['necrotic']`);
      } else if (spellText.includes('poison') || spellText.includes('venom') || spellText.includes('toxic')) {
        fixes.push(`Add damageTypes: ['poison']`);
      } else if (spellText.includes('acid') || spellText.includes('corrosive')) {
        fixes.push(`Add damageTypes: ['acid']`);
      } else if (spellText.includes('psychic') || spellText.includes('mind') || spellText.includes('mental')) {
        fixes.push(`Add damageTypes: ['psychic']`);
      } else if (spellText.includes('force') || spellText.includes('arcane')) {
        fixes.push(`Add damageTypes: ['force']`);
      } else {
        fixes.push(`Add damageTypes: ['force'] (or appropriate type: fire, cold, lightning, radiant, necrotic, poison, acid, psychic, physical)`);
      }
    }

    if (issue.includes('incomplete name')) {
      fixes.push(`Update stat modifier to use specific stat name: strength, agility, constitution, intelligence, spirit, or charisma`);
    }

    if (issue.includes('incomplete description')) {
      fixes.push(`Add specific description explaining what the status effect does`);
    }
  });

  return fixes;
};

export default {
  validateSpell,
  validateSpells,
  printValidationReport,
  getSuggestedFixes
};

