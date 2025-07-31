/**
 * Spell Configuration Check
 * 
 * This script checks what configurations might be missing from spells
 * that could cause functionality issues.
 */

import { LIBRARY_SPELLS } from '../data/spellLibraryData';

/**
 * Check for missing configurations across all spells
 */
export function checkMissingConfigurations() {
  const results = {
    totalSpells: LIBRARY_SPELLS.length,
    missingConfigs: {
      durationConfig: [],
      cooldownConfig: [],
      targetingConfig: [],
      resourceCost: [],
      resolution: [],
      effectConfigs: []
    },
    spellsByType: {
      damage: [],
      healing: [],
      buff: [],
      debuff: [],
      control: [],
      utility: [],
      summoning: [],
      transformation: [],
      purification: [],
      restoration: []
    }
  };

  // Checking spells for missing configurations

  LIBRARY_SPELLS.forEach(spell => {
    // Categorize spells by effect type
    if (spell.effectTypes && Array.isArray(spell.effectTypes)) {
      spell.effectTypes.forEach(effectType => {
        if (results.spellsByType[effectType]) {
          results.spellsByType[effectType].push({
            id: spell.id,
            name: spell.name,
            spell: spell
          });
        }
      });
    }

    // Check for missing configurations
    if (!spell.durationConfig) {
      results.missingConfigs.durationConfig.push({
        id: spell.id,
        name: spell.name,
        effectTypes: spell.effectTypes
      });
    }

    if (!spell.cooldownConfig) {
      results.missingConfigs.cooldownConfig.push({
        id: spell.id,
        name: spell.name,
        effectTypes: spell.effectTypes
      });
    }

    if (!spell.targetingConfig) {
      results.missingConfigs.targetingConfig.push({
        id: spell.id,
        name: spell.name,
        effectTypes: spell.effectTypes
      });
    }

    if (!spell.resourceCost) {
      results.missingConfigs.resourceCost.push({
        id: spell.id,
        name: spell.name,
        effectTypes: spell.effectTypes
      });
    }

    if (!spell.resolution) {
      results.missingConfigs.resolution.push({
        id: spell.id,
        name: spell.name,
        effectTypes: spell.effectTypes
      });
    }

    // Check for missing effect-specific configurations
    const effectConfigIssues = [];
    
    if (spell.effectTypes?.includes('damage') && !spell.damageConfig) {
      effectConfigIssues.push('Missing damageConfig for damage spell');
    }
    
    if (spell.effectTypes?.includes('healing') && !spell.healingConfig) {
      effectConfigIssues.push('Missing healingConfig for healing spell');
    }
    
    if (spell.effectTypes?.includes('buff') && !spell.buffConfig) {
      effectConfigIssues.push('Missing buffConfig for buff spell');
    }
    
    if (spell.effectTypes?.includes('debuff') && !spell.debuffConfig) {
      effectConfigIssues.push('Missing debuffConfig for debuff spell');
    }
    
    if (spell.effectTypes?.includes('control') && !spell.controlConfig) {
      effectConfigIssues.push('Missing controlConfig for control spell');
    }

    if (effectConfigIssues.length > 0) {
      results.missingConfigs.effectConfigs.push({
        id: spell.id,
        name: spell.name,
        effectTypes: spell.effectTypes,
        issues: effectConfigIssues
      });
    }
  });

  return results;
}

/**
 * Generate a report of missing configurations
 */
export function generateConfigurationReport() {
  const results = checkMissingConfigurations();
  
  let report = `
# Spell Configuration Analysis Report
Generated: ${new Date().toISOString()}

## Summary
- Total Spells: ${results.totalSpells}

## Spells by Effect Type
`;

  Object.entries(results.spellsByType).forEach(([effectType, spells]) => {
    if (spells.length > 0) {
      report += `\n### ${effectType.charAt(0).toUpperCase() + effectType.slice(1)} Spells (${spells.length})\n`;
      spells.forEach(spell => {
        report += `- ${spell.name} (${spell.id})\n`;
      });
    }
  });

  report += `\n## Missing Configurations\n`;

  // Duration Config
  if (results.missingConfigs.durationConfig.length > 0) {
    report += `\n### Missing Duration Config (${results.missingConfigs.durationConfig.length})\n`;
    results.missingConfigs.durationConfig.forEach(spell => {
      report += `- ${spell.name} (${spell.id}) - Effects: ${spell.effectTypes?.join(', ') || 'none'}\n`;
    });
  }

  // Cooldown Config
  if (results.missingConfigs.cooldownConfig.length > 0) {
    report += `\n### Missing Cooldown Config (${results.missingConfigs.cooldownConfig.length})\n`;
    results.missingConfigs.cooldownConfig.forEach(spell => {
      report += `- ${spell.name} (${spell.id}) - Effects: ${spell.effectTypes?.join(', ') || 'none'}\n`;
    });
  }

  // Targeting Config
  if (results.missingConfigs.targetingConfig.length > 0) {
    report += `\n### Missing Targeting Config (${results.missingConfigs.targetingConfig.length})\n`;
    results.missingConfigs.targetingConfig.forEach(spell => {
      report += `- ${spell.name} (${spell.id}) - Effects: ${spell.effectTypes?.join(', ') || 'none'}\n`;
    });
  }

  // Resource Cost
  if (results.missingConfigs.resourceCost.length > 0) {
    report += `\n### Missing Resource Cost (${results.missingConfigs.resourceCost.length})\n`;
    results.missingConfigs.resourceCost.forEach(spell => {
      report += `- ${spell.name} (${spell.id}) - Effects: ${spell.effectTypes?.join(', ') || 'none'}\n`;
    });
  }

  // Resolution
  if (results.missingConfigs.resolution.length > 0) {
    report += `\n### Missing Resolution (${results.missingConfigs.resolution.length})\n`;
    results.missingConfigs.resolution.forEach(spell => {
      report += `- ${spell.name} (${spell.id}) - Effects: ${spell.effectTypes?.join(', ') || 'none'}\n`;
    });
  }

  // Effect Configs
  if (results.missingConfigs.effectConfigs.length > 0) {
    report += `\n### Missing Effect-Specific Configs (${results.missingConfigs.effectConfigs.length})\n`;
    results.missingConfigs.effectConfigs.forEach(spell => {
      report += `- ${spell.name} (${spell.id})\n`;
      spell.issues.forEach(issue => {
        report += `  * ${issue}\n`;
      });
    });
  }

  return report;
}

/**
 * Check specific spells for completeness
 */
export function checkSpecificSpells(spellIds) {
  const results = {};
  
  spellIds.forEach(spellId => {
    const spell = LIBRARY_SPELLS.find(s => s.id === spellId);
    if (spell) {
      results[spellId] = {
        name: spell.name,
        effectTypes: spell.effectTypes,
        hasConfigs: {
          durationConfig: !!spell.durationConfig,
          cooldownConfig: !!spell.cooldownConfig,
          targetingConfig: !!spell.targetingConfig,
          resourceCost: !!spell.resourceCost,
          resolution: !!spell.resolution,
          damageConfig: !!spell.damageConfig,
          healingConfig: !!spell.healingConfig,
          buffConfig: !!spell.buffConfig,
          debuffConfig: !!spell.debuffConfig,
          controlConfig: !!spell.controlConfig
        },
        missingConfigs: []
      };

      // Check what's missing
      if (!spell.durationConfig) results[spellId].missingConfigs.push('durationConfig');
      if (!spell.cooldownConfig) results[spellId].missingConfigs.push('cooldownConfig');
      if (!spell.targetingConfig) results[spellId].missingConfigs.push('targetingConfig');
      if (!spell.resourceCost) results[spellId].missingConfigs.push('resourceCost');
      if (!spell.resolution) results[spellId].missingConfigs.push('resolution');

      // Effect-specific configs
      if (spell.effectTypes?.includes('damage') && !spell.damageConfig) {
        results[spellId].missingConfigs.push('damageConfig');
      }
      if (spell.effectTypes?.includes('healing') && !spell.healingConfig) {
        results[spellId].missingConfigs.push('healingConfig');
      }
      if (spell.effectTypes?.includes('buff') && !spell.buffConfig) {
        results[spellId].missingConfigs.push('buffConfig');
      }
      if (spell.effectTypes?.includes('debuff') && !spell.debuffConfig) {
        results[spellId].missingConfigs.push('debuffConfig');
      }
      if (spell.effectTypes?.includes('control') && !spell.controlConfig) {
        results[spellId].missingConfigs.push('controlConfig');
      }
    } else {
      results[spellId] = { error: 'Spell not found' };
    }
  });

  return results;
}

export default {
  checkMissingConfigurations,
  generateConfigurationReport,
  checkSpecificSpells
};
