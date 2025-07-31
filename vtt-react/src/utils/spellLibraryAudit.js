/**
 * Comprehensive Spell Library Audit Tool
 * 
 * This utility audits the entire spell library to ensure compliance with
 * spell wizard validation rules and formatting standards.
 */

import { LIBRARY_SPELLS } from '../data/spellLibraryData';
import { DAMAGE_TYPES } from '../data/damageTypes';
import { EFFECT_TYPES } from '../components/spellcrafting-wizard/data/enhancedEffectSystemData';

// Valid D&D damage types (from the wizard system)
const VALID_DAMAGE_TYPES = [
  'acid', 'bludgeoning', 'cold', 'fire', 'force', 'lightning', 'necrotic',
  'piercing', 'poison', 'psychic', 'radiant', 'slashing', 'thunder'
];

// Valid spell types from the wizard
const VALID_SPELL_TYPES = ['ACTION', 'CHANNELED', 'PASSIVE', 'REACTION', 'TRAP', 'STATE'];

// Valid effect types from the wizard
const VALID_EFFECT_TYPES = [
  'damage', 'healing', 'buff', 'debuff', 'control', 'utility', 
  'summoning', 'transformation', 'purification', 'restoration'
];

// Required fields for wizard compliance
const REQUIRED_FIELDS = ['id', 'name', 'description', 'spellType', 'effectTypes'];

// Deprecated fields that should not exist
const DEPRECATED_FIELDS = [
  'effectType', 'primaryDamage', 'healing', 'diceConfig', 'manaCost', 
  'range', 'cooldown', 'areaType', 'areaSize', 'targetingMode', 'validTargets', 'charges'
];

// Valid wizard fields
const VALID_WIZARD_FIELDS = [
  'id', 'name', 'description', 'icon', 'level', 'school', 'spellType', 'tags', 'effectTypes',
  'damageTypes', 'damageConfig', 'healingConfig', 'buffConfig', 'debuffConfig', 'controlConfig',
  'utilityConfig', 'summonConfig', 'transformConfig', 'purificationConfig', 'restorationConfig',
  'targetingConfig', 'durationConfig', 'resourceCost', 'resourceConfig', 'cooldownConfig',
  'triggerConfig', 'trapConfig', 'channelingConfig', 'criticalConfig', 'procConfig',
  'rollableTable', 'resolution', 'cardConfig', 'coinConfig', 'dateCreated', 'lastModified',
  'categoryIds', 'visualTheme', 'castingDescription', 'effectDescription', 'impactDescription',
  'mechanicsConfig', 'enhancementConfig'
];

/**
 * Audit a single spell for compliance issues
 */
export function auditSpell(spell) {
  const issues = {
    critical: [],
    warnings: [],
    suggestions: [],
    formatting: []
  };

  // Check required fields
  REQUIRED_FIELDS.forEach(field => {
    if (!spell[field]) {
      issues.critical.push(`Missing required field: ${field}`);
    }
  });

  // Check for deprecated fields
  DEPRECATED_FIELDS.forEach(field => {
    if (spell.hasOwnProperty(field)) {
      issues.warnings.push(`Contains deprecated field: ${field}`);
    }
  });

  // Check for invalid fields
  Object.keys(spell).forEach(field => {
    if (!VALID_WIZARD_FIELDS.includes(field)) {
      issues.warnings.push(`Contains non-wizard field: ${field}`);
    }
  });

  // Validate spell type
  if (spell.spellType && !VALID_SPELL_TYPES.includes(spell.spellType)) {
    issues.critical.push(`Invalid spell type: ${spell.spellType}`);
  }

  // Validate effect types
  if (spell.effectTypes && Array.isArray(spell.effectTypes)) {
    spell.effectTypes.forEach(effectType => {
      if (!VALID_EFFECT_TYPES.includes(effectType)) {
        issues.critical.push(`Invalid effect type: ${effectType}`);
      }
    });
  }

  // Validate damage types
  if (spell.damageTypes && Array.isArray(spell.damageTypes)) {
    spell.damageTypes.forEach(damageType => {
      if (!VALID_DAMAGE_TYPES.includes(damageType)) {
        issues.critical.push(`Invalid damage type: ${damageType} (not a valid D&D damage type)`);
      }
    });
  }

  // Check for CAPS_UNDERSCORE formatting issues in formulas
  const formulaFields = ['damageConfig', 'healingConfig', 'cardConfig', 'coinConfig'];
  formulaFields.forEach(configField => {
    if (spell[configField] && spell[configField].formula) {
      const formula = spell[configField].formula;
      if (typeof formula === 'string') {
        // Check for CAPS_UNDERSCORE patterns that should be converted to readable format
        const capsUnderscorePattern = /\b[A-Z][A-Z_]+[A-Z]\b/g;
        const matches = formula.match(capsUnderscorePattern);
        if (matches) {
          // Filter out known valid technical variables
          const validTechnicalVars = [
            'HEADS_COUNT', 'TAILS_COUNT', 'ALL_HEADS', 'ALL_TAILS', 'CARD_VALUE', 
            'FACE_CARD_COUNT', 'SAME_SUIT_COUNT', 'HEALTH_SACRIFICED', 'DAMAGE_DEALT'
          ];
          const invalidMatches = matches.filter(match => !validTechnicalVars.includes(match));
          if (invalidMatches.length > 0) {
            issues.formatting.push(`Formula contains unrecognized CAPS_UNDERSCORE variables: ${invalidMatches.join(', ')}`);
          }
        }

        // Check for complex conditional expressions that need plain English
        if (formula.includes('?') && formula.includes(':')) {
          const conditionalPattern = /\d+:\d+/g;
          if (conditionalPattern.test(formula)) {
            issues.formatting.push(`Formula contains complex conditional notation that should be converted to plain English`);
          }
        }
      }
    }
  });

  // Check for missing timestamps
  if (!spell.dateCreated) {
    issues.suggestions.push('Missing dateCreated timestamp');
  }
  if (!spell.lastModified) {
    issues.suggestions.push('Missing lastModified timestamp');
  }

  // Check for missing targeting configuration
  if (!spell.targetingConfig) {
    issues.warnings.push('Missing targeting configuration');
  }

  // Check for missing resource costs
  if (!spell.resourceCost && !spell.resourceConfig) {
    issues.warnings.push('Missing resource cost configuration');
  }

  return issues;
}

/**
 * Audit the entire spell library
 */
export function auditSpellLibrary() {
  const auditResults = {
    totalSpells: LIBRARY_SPELLS.length,
    validSpells: 0,
    spellsWithIssues: 0,
    criticalIssues: 0,
    warnings: 0,
    suggestions: 0,
    formattingIssues: 0,
    spellDetails: [],
    summary: {
      duplicateIds: [],
      invalidDamageTypes: new Set(),
      invalidEffectTypes: new Set(),
      invalidSpellTypes: new Set(),
      deprecatedFields: new Set(),
      missingRequiredFields: new Set()
    }
  };

  const seenIds = new Set();

  LIBRARY_SPELLS.forEach((spell, index) => {
    const spellIssues = auditSpell(spell);
    const hasIssues = Object.values(spellIssues).some(issueArray => issueArray.length > 0);

    // Check for duplicate IDs
    if (seenIds.has(spell.id)) {
      auditResults.summary.duplicateIds.push(spell.id);
      spellIssues.critical.push('Duplicate spell ID');
    } else {
      seenIds.add(spell.id);
    }

    if (hasIssues) {
      auditResults.spellsWithIssues++;
    } else {
      auditResults.validSpells++;
    }

    auditResults.criticalIssues += spellIssues.critical.length;
    auditResults.warnings += spellIssues.warnings.length;
    auditResults.suggestions += spellIssues.suggestions.length;
    auditResults.formattingIssues += spellIssues.formatting.length;

    // Collect summary data
    spellIssues.critical.forEach(issue => {
      if (issue.includes('Invalid damage type:')) {
        const damageType = issue.split(':')[1].trim().split(' ')[0];
        auditResults.summary.invalidDamageTypes.add(damageType);
      }
      if (issue.includes('Invalid effect type:')) {
        const effectType = issue.split(':')[1].trim();
        auditResults.summary.invalidEffectTypes.add(effectType);
      }
      if (issue.includes('Invalid spell type:')) {
        const spellType = issue.split(':')[1].trim();
        auditResults.summary.invalidSpellTypes.add(spellType);
      }
      if (issue.includes('Missing required field:')) {
        const field = issue.split(':')[1].trim();
        auditResults.summary.missingRequiredFields.add(field);
      }
    });

    spellIssues.warnings.forEach(issue => {
      if (issue.includes('Contains deprecated field:')) {
        const field = issue.split(':')[1].trim();
        auditResults.summary.deprecatedFields.add(field);
      }
    });

    auditResults.spellDetails.push({
      index,
      id: spell.id,
      name: spell.name,
      issues: spellIssues,
      hasIssues
    });
  });

  // Convert Sets to Arrays for easier consumption
  auditResults.summary.invalidDamageTypes = Array.from(auditResults.summary.invalidDamageTypes);
  auditResults.summary.invalidEffectTypes = Array.from(auditResults.summary.invalidEffectTypes);
  auditResults.summary.invalidSpellTypes = Array.from(auditResults.summary.invalidSpellTypes);
  auditResults.summary.deprecatedFields = Array.from(auditResults.summary.deprecatedFields);
  auditResults.summary.missingRequiredFields = Array.from(auditResults.summary.missingRequiredFields);

  return auditResults;
}

/**
 * Generate a human-readable audit report
 */
export function generateAuditReport() {
  const results = auditSpellLibrary();

  let report = `
# Spell Library Audit Report
Generated: ${new Date().toISOString()}

## Summary
- Total Spells: ${results.totalSpells}
- Valid Spells: ${results.validSpells}
- Spells with Issues: ${results.spellsWithIssues}
- Critical Issues: ${results.criticalIssues}
- Warnings: ${results.warnings}
- Suggestions: ${results.suggestions}
- Formatting Issues: ${results.formattingIssues}

## Critical Issues Summary
`;

  if (results.summary.duplicateIds.length > 0) {
    report += `\n### Duplicate IDs\n${results.summary.duplicateIds.map(id => `- ${id}`).join('\n')}`;
  }

  if (results.summary.invalidDamageTypes.length > 0) {
    report += `\n### Invalid Damage Types\n${results.summary.invalidDamageTypes.map(type => `- ${type}`).join('\n')}`;
  }

  if (results.summary.invalidEffectTypes.length > 0) {
    report += `\n### Invalid Effect Types\n${results.summary.invalidEffectTypes.map(type => `- ${type}`).join('\n')}`;
  }

  if (results.summary.invalidSpellTypes.length > 0) {
    report += `\n### Invalid Spell Types\n${results.summary.invalidSpellTypes.map(type => `- ${type}`).join('\n')}`;
  }

  if (results.summary.deprecatedFields.length > 0) {
    report += `\n### Deprecated Fields Found\n${results.summary.deprecatedFields.map(field => `- ${field}`).join('\n')}`;
  }

  if (results.summary.missingRequiredFields.length > 0) {
    report += `\n### Missing Required Fields\n${results.summary.missingRequiredFields.map(field => `- ${field}`).join('\n')}`;
  }

  // Add detailed spell issues
  const spellsWithIssues = results.spellDetails.filter(spell => spell.hasIssues);
  if (spellsWithIssues.length > 0) {
    report += `\n## Detailed Spell Issues\n`;
    spellsWithIssues.forEach(spell => {
      report += `\n### ${spell.name} (${spell.id})\n`;
      if (spell.issues.critical.length > 0) {
        report += `**Critical Issues:**\n${spell.issues.critical.map(issue => `- ${issue}`).join('\n')}\n`;
      }
      if (spell.issues.warnings.length > 0) {
        report += `**Warnings:**\n${spell.issues.warnings.map(issue => `- ${issue}`).join('\n')}\n`;
      }
      if (spell.issues.formatting.length > 0) {
        report += `**Formatting Issues:**\n${spell.issues.formatting.map(issue => `- ${issue}`).join('\n')}\n`;
      }
      if (spell.issues.suggestions.length > 0) {
        report += `**Suggestions:**\n${spell.issues.suggestions.map(issue => `- ${issue}`).join('\n')}\n`;
      }
    });
  }

  return report;
}

export default {
  auditSpell,
  auditSpellLibrary,
  generateAuditReport
};
