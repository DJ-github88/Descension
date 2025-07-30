/**
 * Spell Library Statistics and Analysis
 * 
 * This utility provides comprehensive statistics about the spell library
 * including coverage analysis, quality metrics, and feature utilization.
 */

import { LIBRARY_SPELLS } from '../data/spellLibraryData';

/**
 * Generate comprehensive spell library statistics
 */
export function generateLibraryStats() {
  const stats = {
    overview: {
      totalSpells: LIBRARY_SPELLS.length,
      averageLevel: 0,
      spellsByLevel: {},
      spellsByType: {},
      spellsByTheme: {}
    },
    effectTypes: {
      coverage: {},
      combinations: {},
      mostCommon: [],
      leastCommon: []
    },
    mechanics: {
      advancedMechanics: 0,
      cardMechanics: 0,
      coinMechanics: 0,
      progressiveEffects: 0,
      channeledSpells: 0,
      reactionSpells: 0,
      stateSpells: 0,
      zoneSpells: 0,
      trapSpells: 0
    },
    quality: {
      fullyConfigured: 0,
      missingConfigs: [],
      originalNames: 0,
      thematicConsistency: 0
    },
    targeting: {
      singleTarget: 0,
      areaEffect: 0,
      selfTarget: 0,
      multiTarget: 0
    },
    resources: {
      averageCost: 0,
      costDistribution: {},
      alternativeResources: 0
    }
  };

  // Calculate basic statistics
  let totalLevel = 0;
  const effectTypeCounts = {};
  const spellTypeCounts = {};
  const levelCounts = {};
  const themeCounts = {};

  LIBRARY_SPELLS.forEach(spell => {
    // Level statistics
    const level = spell.level || 1;
    totalLevel += level;
    levelCounts[level] = (levelCounts[level] || 0) + 1;

    // Spell type statistics
    const spellType = spell.spellType || 'ACTION';
    spellTypeCounts[spellType] = (spellTypeCounts[spellType] || 0) + 1;

    // Theme statistics
    const theme = spell.visualTheme || 'neutral';
    themeCounts[theme] = (themeCounts[theme] || 0) + 1;

    // Effect type statistics
    if (spell.effectTypes && Array.isArray(spell.effectTypes)) {
      spell.effectTypes.forEach(effectType => {
        effectTypeCounts[effectType] = (effectTypeCounts[effectType] || 0) + 1;
      });

      // Effect combinations
      if (spell.effectTypes.length > 1) {
        const combination = spell.effectTypes.sort().join('+');
        stats.effectTypes.combinations[combination] = (stats.effectTypes.combinations[combination] || 0) + 1;
      }
    }

    // Advanced mechanics detection
    if (spell.mechanicsConfig) {
      stats.mechanics.advancedMechanics++;
      
      if (spell.mechanicsConfig.cards?.enabled) {
        stats.mechanics.cardMechanics++;
      }
      
      if (spell.mechanicsConfig.coins?.enabled) {
        stats.mechanics.coinMechanics++;
      }
    }

    if (spell.rollableTable?.enabled) {
      stats.mechanics.advancedMechanics++;
    }

    // Progressive effects
    if (spell.damageConfig?.isProgressiveDamage || spell.healingConfig?.isProgressiveHot) {
      stats.mechanics.progressiveEffects++;
    }

    // Spell type mechanics
    switch (spellType) {
      case 'CHANNELED':
        stats.mechanics.channeledSpells++;
        break;
      case 'REACTION':
        stats.mechanics.reactionSpells++;
        break;
      case 'STATE':
        stats.mechanics.stateSpells++;
        break;
      case 'ZONE':
        stats.mechanics.zoneSpells++;
        break;
      case 'TRAP':
        stats.mechanics.trapSpells++;
        break;
    }

    // Targeting analysis
    if (spell.targetingConfig) {
      switch (spell.targetingConfig.targetingType) {
        case 'single':
          stats.targeting.singleTarget++;
          break;
        case 'area':
          stats.targeting.areaEffect++;
          break;
        case 'self':
          stats.targeting.selfTarget++;
          break;
        case 'multi':
          stats.targeting.multiTarget++;
          break;
      }
    }

    // Quality assessment
    const requiredConfigs = [];
    if (spell.effectTypes?.includes('damage') && !spell.damageConfig) {
      requiredConfigs.push('damageConfig');
    }
    if (spell.effectTypes?.includes('healing') && !spell.healingConfig) {
      requiredConfigs.push('healingConfig');
    }
    if (spell.effectTypes?.includes('buff') && !spell.buffConfig) {
      requiredConfigs.push('buffConfig');
    }
    if (spell.effectTypes?.includes('debuff') && !spell.debuffConfig) {
      requiredConfigs.push('debuffConfig');
    }

    if (requiredConfigs.length === 0) {
      stats.quality.fullyConfigured++;
    } else {
      stats.quality.missingConfigs.push({
        spellName: spell.name,
        missing: requiredConfigs
      });
    }

    // Original naming assessment (avoid common fantasy tropes)
    const commonWords = ['fire', 'ice', 'lightning', 'heal', 'magic', 'spell', 'bolt', 'ball'];
    const hasCommonWords = commonWords.some(word => 
      spell.name?.toLowerCase().includes(word)
    );
    if (!hasCommonWords) {
      stats.quality.originalNames++;
    }

    // Resource cost analysis
    if (spell.resourceCost?.mana?.baseAmount) {
      stats.resources.averageCost += spell.resourceCost.mana.baseAmount;
      const costRange = Math.floor(spell.resourceCost.mana.baseAmount / 10) * 10;
      stats.resources.costDistribution[costRange] = (stats.resources.costDistribution[costRange] || 0) + 1;
    }
  });

  // Finalize calculations
  stats.overview.averageLevel = totalLevel / LIBRARY_SPELLS.length;
  stats.overview.spellsByLevel = levelCounts;
  stats.overview.spellsByType = spellTypeCounts;
  stats.overview.spellsByTheme = themeCounts;
  stats.effectTypes.coverage = effectTypeCounts;
  stats.resources.averageCost = stats.resources.averageCost / LIBRARY_SPELLS.length;

  // Sort effect types by frequency
  const sortedEffectTypes = Object.entries(effectTypeCounts)
    .sort(([,a], [,b]) => b - a);
  stats.effectTypes.mostCommon = sortedEffectTypes.slice(0, 5);
  stats.effectTypes.leastCommon = sortedEffectTypes.slice(-5);

  // Quality metrics
  stats.quality.thematicConsistency = (stats.quality.originalNames / LIBRARY_SPELLS.length) * 100;

  return stats;
}

/**
 * Generate a human-readable report from the statistics
 */
export function generateStatsReport(stats) {
  const report = {
    summary: `Spell Library Analysis Report
Generated: ${new Date().toLocaleDateString()}

OVERVIEW:
- Total Spells: ${stats.overview.totalSpells}
- Average Level: ${stats.overview.averageLevel.toFixed(1)}
- Quality Score: ${((stats.quality.fullyConfigured / stats.overview.totalSpells) * 100).toFixed(1)}%
- Originality Score: ${stats.quality.thematicConsistency.toFixed(1)}%`,

    coverage: `EFFECT TYPE COVERAGE:
${Object.entries(stats.effectTypes.coverage)
  .map(([type, count]) => `- ${type}: ${count} spells`)
  .join('\n')}

MOST COMMON COMBINATIONS:
${Object.entries(stats.effectTypes.combinations)
  .sort(([,a], [,b]) => b - a)
  .slice(0, 5)
  .map(([combo, count]) => `- ${combo}: ${count} spells`)
  .join('\n')}`,

    mechanics: `ADVANCED MECHANICS UTILIZATION:
- Spells with Advanced Mechanics: ${stats.mechanics.advancedMechanics}
- Card-based Mechanics: ${stats.mechanics.cardMechanics}
- Coin-based Mechanics: ${stats.mechanics.coinMechanics}
- Progressive Effects: ${stats.mechanics.progressiveEffects}
- Channeled Spells: ${stats.mechanics.channeledSpells}
- Reaction Spells: ${stats.mechanics.reactionSpells}
- State Spells: ${stats.mechanics.stateSpells}
- Zone Spells: ${stats.mechanics.zoneSpells}
- Trap Spells: ${stats.mechanics.trapSpells}`,

    targeting: `TARGETING DISTRIBUTION:
- Single Target: ${stats.targeting.singleTarget}
- Area Effect: ${stats.targeting.areaEffect}
- Self Target: ${stats.targeting.selfTarget}
- Multi Target: ${stats.targeting.multiTarget}`,

    quality: `QUALITY ASSESSMENT:
- Fully Configured Spells: ${stats.quality.fullyConfigured}/${stats.overview.totalSpells}
- Spells with Missing Configs: ${stats.quality.missingConfigs.length}
- Original Names: ${stats.quality.originalNames}/${stats.overview.totalSpells}

${stats.quality.missingConfigs.length > 0 ? 
  `SPELLS NEEDING ATTENTION:\n${stats.quality.missingConfigs
    .slice(0, 10)
    .map(item => `- ${item.spellName}: missing ${item.missing.join(', ')}`)
    .join('\n')}` : 
  'All spells are properly configured!'}`
  };

  return report;
}

/**
 * Get recommendations for improving the spell library
 */
export function getLibraryRecommendations(stats) {
  const recommendations = [];

  // Coverage recommendations
  const effectTypes = Object.entries(stats.effectTypes.coverage);
  const minCoverage = Math.min(...effectTypes.map(([,count]) => count));
  const maxCoverage = Math.max(...effectTypes.map(([,count]) => count));
  
  if (maxCoverage - minCoverage > 5) {
    const underrepresented = effectTypes
      .filter(([,count]) => count < minCoverage + 2)
      .map(([type]) => type);
    
    if (underrepresented.length > 0) {
      recommendations.push({
        type: 'coverage',
        priority: 'medium',
        message: `Consider adding more spells with these effect types: ${underrepresented.join(', ')}`
      });
    }
  }

  // Advanced mechanics recommendations
  const mechanicsUtilization = (stats.mechanics.advancedMechanics / stats.overview.totalSpells) * 100;
  if (mechanicsUtilization < 20) {
    recommendations.push({
      type: 'mechanics',
      priority: 'high',
      message: `Only ${mechanicsUtilization.toFixed(1)}% of spells use advanced mechanics. Consider adding more card/coin/progressive spells.`
    });
  }

  // Quality recommendations
  const qualityScore = (stats.quality.fullyConfigured / stats.overview.totalSpells) * 100;
  if (qualityScore < 90) {
    recommendations.push({
      type: 'quality',
      priority: 'high',
      message: `${stats.quality.missingConfigs.length} spells are missing required configurations. Use auto-fix to resolve.`
    });
  }

  // Originality recommendations
  if (stats.quality.thematicConsistency < 70) {
    recommendations.push({
      type: 'originality',
      priority: 'medium',
      message: `Consider renaming spells to avoid common fantasy tropes and improve originality.`
    });
  }

  // Spell type diversity
  const spellTypes = Object.keys(stats.overview.spellsByType).length;
  if (spellTypes < 4) {
    recommendations.push({
      type: 'diversity',
      priority: 'medium',
      message: `Consider adding more diverse spell types (REACTION, STATE, ZONE, TRAP, etc.)`
    });
  }

  return recommendations;
}
