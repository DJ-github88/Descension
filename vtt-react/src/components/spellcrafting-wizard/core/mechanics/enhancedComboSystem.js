/**
 * Enhanced Combo System
 * 
 * Provides comprehensive support for various combo point and resource accumulation systems
 * from World of Warcraft, D&D, Pathfinder, and custom game systems.
 */

// Game-specific combo point systems
export const GAME_SPECIFIC_SYSTEMS = {
  // World of Warcraft systems
  WOW: {
    ROGUE_COMBO_POINTS: {
      id: 'wow_rogue_combo',
      name: "Rogue Combo Points",
      description: "WoW-style combo points that build on the target and enable finishers",
      maxPoints: 5,
      targetBased: true, // Points are on the target, not the player
      generationMethods: ["sinister_strike", "backstab", "mutilate", "hemorrhage"],
      consumptionRules: {
        partial: false,      // Must consume all points
        minimum: 1,          // Minimum points needed for consumption
        thresholds: [1, 2, 3, 4, 5]   // Each point increases effect
      },
      decay: {
        enabled: true,
        trigger: "target_change", // Points are lost when changing targets
        outOfCombatLoss: true     // All points lost when leaving combat
      },
      visual: {
        type: "points",
        colors: ["#FF5555", "#FF7755", "#FFAA55", "#FFDD55", "#FFFF55"],
        animation: "pulse"
      }
    },
    HOLY_POWER: {
      id: 'wow_holy_power',
      name: "Holy Power",
      description: "Paladin resource that builds up to 5 points for powerful holy abilities",
      maxPoints: 5,
      targetBased: false, // Points are on the player
      generationMethods: ["crusader_strike", "blade_of_justice", "wake_of_ashes"],
      consumptionRules: {
        partial: true,       // Can consume partial points
        minimum: 1,          // Minimum points needed for consumption
        thresholds: [1, 3, 5]   // Thresholds for enhanced effects
      },
      decay: {
        enabled: false,      // Does not decay over time
        outOfCombatLoss: false // Persists outside of combat
      },
      visual: {
        type: "points",
        colors: ["#FFDD55", "#FFEE77", "#FFFFAA", "#FFFFCC", "#FFFFFF"],
        animation: "glow"
      }
    },
    SOUL_SHARDS: {
      id: 'wow_soul_shards',
      name: "Soul Shards",
      description: "Warlock resource used for powerful shadow magic",
      maxPoints: 5,
      targetBased: false,
      generationMethods: ["drain_soul", "shadow_bolt", "agony_tick"],
      consumptionRules: {
        partial: true,
        minimum: 1,
        thresholds: [1, 2, 3, 4, 5]
      },
      decay: {
        enabled: false,
        outOfCombatLoss: false
      },
      visual: {
        type: "shards",
        colors: ["#9966CC", "#AA77DD", "#BB88EE", "#CC99FF", "#DDAAFF"],
        animation: "float"
      }
    },
    ARCANE_CHARGES: {
      id: 'wow_arcane_charges',
      name: "Arcane Charges",
      description: "Mage resource that increases arcane damage but also mana cost",
      maxPoints: 4,
      targetBased: false,
      generationMethods: ["arcane_blast", "arcane_barrage", "arcane_missiles"],
      consumptionRules: {
        partial: false,
        minimum: 1,
        thresholds: [1, 2, 3, 4]
      },
      decay: {
        enabled: true,
        trigger: "time",
        rate: 30, // 30 seconds
        outOfCombatLoss: true
      },
      visual: {
        type: "orbs",
        colors: ["#77AAFF", "#88BBFF", "#99CCFF", "#AADDFF"],
        animation: "orbit"
      },
      // Special: increases damage but also mana cost
      specialEffects: {
        damageIncrease: [0.10, 0.20, 0.30, 0.40], // 10% per stack
        manaCostIncrease: [0.15, 0.30, 0.45, 0.60] // 15% per stack
      }
    }
  },
  
  // D&D 5e systems
  DND5E: {
    KI_POINTS: {
      id: 'dnd_ki_points',
      name: "Ki Points",
      description: "Monk resource for special abilities",
      maxPoints: "level", // Scales with character level
      targetBased: false,
      generationMethods: ["short_rest", "long_rest"],
      consumptionRules: {
        partial: true,
        minimum: 1,
        variableCost: true // Different abilities cost different amounts
      },
      decay: {
        enabled: false,
        outOfCombatLoss: false
      },
      visual: {
        type: "energy",
        colors: ["#66CCFF"],
        animation: "pulse"
      },
      // Special: recharges on short rest
      specialEffects: {
        shortRestRecharge: true
      }
    },
    SORCERY_POINTS: {
      id: 'dnd_sorcery_points',
      name: "Sorcery Points",
      description: "Sorcerer resource for metamagic and spell slot conversion",
      maxPoints: "level", // Scales with character level
      targetBased: false,
      generationMethods: ["long_rest", "convert_spell_slot"],
      consumptionRules: {
        partial: true,
        minimum: 1,
        variableCost: true,
        conversionRules: {
          // Spell slot level to sorcery point cost
          toSpellSlot: {1: 2, 2: 3, 3: 5, 4: 6, 5: 7},
          // Sorcery points gained from spell slot
          fromSpellSlot: {1: 2, 2: 3, 3: 5, 4: 6, 5: 7, 6: 8, 7: 9, 8: 10, 9: 11}
        }
      },
      decay: {
        enabled: false,
        outOfCombatLoss: false
      },
      visual: {
        type: "points",
        colors: ["#FF66CC"],
        animation: "sparkle"
      }
    },
    SUPERIORITY_DICE: {
      id: 'dnd_superiority_dice',
      name: "Superiority Dice",
      description: "Fighter (Battle Master) resource for combat maneuvers",
      maxPoints: "level_based", // 4 at level 3, increases at higher levels
      diceType: "d8", // d8 initially, can increase to d10, d12
      targetBased: false,
      generationMethods: ["short_rest", "long_rest"],
      consumptionRules: {
        partial: true,
        minimum: 1,
        maximum: 1, // Only use one die at a time
        addToDamage: true // Add to damage or other rolls
      },
      decay: {
        enabled: false,
        outOfCombatLoss: false
      },
      visual: {
        type: "dice",
        colors: ["#CC3333"],
        animation: "roll"
      }
    }
  },
  
  // Pathfinder systems
  PATHFINDER: {
    GRIT_POINTS: {
      id: 'pf_grit_points',
      name: "Grit Points",
      description: "Gunslinger resource for special firearm abilities",
      maxPoints: "wisdom_mod", // Based on Wisdom modifier
      targetBased: false,
      generationMethods: ["critical_hit", "killing_blow", "rest"],
      consumptionRules: {
        partial: true,
        minimum: 1,
        variableCost: true
      },
      decay: {
        enabled: false,
        outOfCombatLoss: false
      },
      visual: {
        type: "points",
        colors: ["#DDAA33"],
        animation: "flash"
      }
    },
    ARCANE_POOL: {
      id: 'pf_arcane_pool',
      name: "Arcane Pool",
      description: "Magus resource for enhancing weapons and casting",
      maxPoints: "level_plus_int", // Level + Int modifier
      targetBased: false,
      generationMethods: ["rest"],
      consumptionRules: {
        partial: true,
        minimum: 1,
        variableCost: true,
        enhanceWeapon: true // Can enhance weapons
      },
      decay: {
        enabled: false,
        outOfCombatLoss: false
      },
      visual: {
        type: "pool",
        colors: ["#3366FF"],
        animation: "ripple"
      }
    },
    RAGE_ROUNDS: {
      id: 'pf_rage_rounds',
      name: "Rage Rounds",
      description: "Barbarian resource for maintaining rage",
      maxPoints: "constitution_based", // Based on Constitution
      targetBased: false,
      generationMethods: ["rest"],
      consumptionRules: {
        partial: true,
        minimum: 1,
        perRound: true, // Consumes 1 per round while raging
        mustAttack: true // Must attack or be damaged to maintain
      },
      decay: {
        enabled: true,
        trigger: "end_of_turn",
        conditionalMaintain: "attack_or_damaged"
      },
      visual: {
        type: "flames",
        colors: ["#FF3300"],
        animation: "flicker"
      }
    }
  },
  
  // Custom game systems
  CUSTOM: {
    MOMENTUM: {
      id: 'custom_momentum',
      name: "Momentum",
      description: "Building speed and flow through continued movement",
      maxPoints: 100,
      targetBased: false,
      generationMethods: ["movement", "dash", "dodge"],
      consumptionRules: {
        partial: true,
        minimum: 25,
        thresholds: [25, 50, 75, 100],
        percentageBased: true
      },
      decay: {
        enabled: true,
        trigger: "no_movement",
        rate: 5, // 5 points per second of no movement
        outOfCombatLoss: true
      },
      visual: {
        type: "trail",
        colors: ["#33CC33", "#66DD66", "#99EE99", "#CCFFCC"],
        animation: "flow"
      }
    },
    MANA_CRYSTALS: {
      id: 'custom_mana_crystals',
      name: "Mana Crystals",
      description: "Crystallized magical energy that powers spells",
      maxPoints: 10,
      targetBased: false,
      generationMethods: ["meditation", "absorb_magic", "rest"],
      consumptionRules: {
        partial: true,
        minimum: 1,
        variableCost: true,
        overloadOption: true // Can use more for greater effect
      },
      decay: {
        enabled: false,
        outOfCombatLoss: false
      },
      visual: {
        type: "crystals",
        colors: ["#66FFFF", "#77FFFF", "#88FFFF", "#99FFFF", "#AAFFFF"],
        animation: "shimmer"
      }
    },
    FOCUS_POINTS: {
      id: 'custom_focus_points',
      name: "Focus Points",
      description: "Mental concentration that enhances spell precision",
      maxPoints: 5,
      targetBased: false,
      generationMethods: ["concentration", "meditation", "successful_cast"],
      consumptionRules: {
        partial: true,
        minimum: 1,
        thresholds: [1, 2, 3, 4, 5],
        enhanceAccuracy: true // Increases spell hit chance
      },
      decay: {
        enabled: true,
        trigger: "damage_taken",
        rate: 1, // Lose 1 point when damaged
        outOfCombatLoss: false
      },
      visual: {
        type: "orbs",
        colors: ["#FFCC00", "#FFDD33", "#FFEE66", "#FFFF99", "#FFFFCC"],
        animation: "pulse"
      }
    },
    BLOOD_RUNES: {
      id: 'custom_blood_runes',
      name: "Blood Runes",
      description: "Runes inscribed with blood that power dark magic",
      maxPoints: 3,
      targetBased: false,
      generationMethods: ["sacrifice_health", "kill", "blood_ritual"],
      consumptionRules: {
        partial: true,
        minimum: 1,
        thresholds: [1, 2, 3],
        healthCost: true // Costs health to generate
      },
      decay: {
        enabled: true,
        trigger: "time",
        rate: 60, // 60 seconds
        outOfCombatLoss: true
      },
      visual: {
        type: "runes",
        colors: ["#990000", "#CC0000", "#FF0000"],
        animation: "pulse"
      }
    },
    ELEMENTAL_ATTUNEMENT: {
      id: 'custom_elemental_attunement',
      name: "Elemental Attunement",
      description: "Attunement to elemental forces that enhances elemental spells",
      maxPoints: 4,
      targetBased: false,
      generationMethods: ["cast_elemental_spell", "elemental_environment", "meditation"],
      consumptionRules: {
        partial: false,
        minimum: 1,
        thresholds: [1, 2, 3, 4],
        elementalEnhancement: true // Enhances spells of attuned element
      },
      decay: {
        enabled: true,
        trigger: "cast_opposing_element",
        rate: 1, // Lose 1 point when casting opposing element
        outOfCombatLoss: false
      },
      visual: {
        type: "aura",
        colors: ["#FF3300", "#33CCFF", "#33CC33", "#CC9900"], // Fire, Water, Air, Earth
        animation: "swirl"
      }
    }
  }
};

/**
 * Get a combo point system by ID
 * @param {string} systemId - The ID of the system to retrieve
 * @returns {Object} The combo point system configuration
 */
export function getComboSystem(systemId) {
  // Search through all game systems
  for (const gameSystem in GAME_SPECIFIC_SYSTEMS) {
    for (const systemKey in GAME_SPECIFIC_SYSTEMS[gameSystem]) {
      const system = GAME_SPECIFIC_SYSTEMS[gameSystem][systemKey];
      if (system.id === systemId) {
        return system;
      }
    }
  }
  
  // Return default if not found
  return GAME_SPECIFIC_SYSTEMS.WOW.ROGUE_COMBO_POINTS;
}

/**
 * Get all combo systems for a specific game
 * @param {string} gameSystem - The game system to retrieve combo systems for
 * @returns {Array} Array of combo systems for the specified game
 */
export function getComboSystemsForGame(gameSystem) {
  if (GAME_SPECIFIC_SYSTEMS[gameSystem]) {
    return Object.values(GAME_SPECIFIC_SYSTEMS[gameSystem]);
  }
  return [];
}

/**
 * Get all available combo systems
 * @returns {Array} Array of all combo systems
 */
export function getAllComboSystems() {
  const allSystems = [];
  
  for (const gameSystem in GAME_SPECIFIC_SYSTEMS) {
    for (const systemKey in GAME_SPECIFIC_SYSTEMS[gameSystem]) {
      allSystems.push(GAME_SPECIFIC_SYSTEMS[gameSystem][systemKey]);
    }
  }
  
  return allSystems;
}

/**
 * Calculate effect scaling based on combo points
 * @param {Object} system - The combo system configuration
 * @param {number} points - Current number of points
 * @param {Object} baseEffect - The base effect to scale
 * @returns {Object} The scaled effect
 */
export function calculateComboEffect(system, points, baseEffect) {
  if (!system || !baseEffect) return baseEffect;
  
  const scaledEffect = { ...baseEffect };
  const { consumptionRules } = system;
  
  // Find the highest threshold that the current points meet
  let thresholdIndex = -1;
  if (consumptionRules.thresholds) {
    for (let i = consumptionRules.thresholds.length - 1; i >= 0; i--) {
      if (points >= consumptionRules.thresholds[i]) {
        thresholdIndex = i;
        break;
      }
    }
  }
  
  // Apply scaling based on threshold
  if (thresholdIndex >= 0) {
    const scalingFactor = (thresholdIndex + 1) / consumptionRules.thresholds.length;
    
    // Scale damage
    if (scaledEffect.damage) {
      if (consumptionRules.scaling === 'linear') {
        scaledEffect.damage *= (1 + scalingFactor);
      } else if (consumptionRules.scaling === 'exponential') {
        scaledEffect.damage *= Math.pow(1.5, scalingFactor);
      } else if (consumptionRules.scaling === 'threshold') {
        // Use specific multiplier for this threshold
        const multipliers = [1, 1.5, 2, 3, 5]; // Example multipliers
        scaledEffect.damage *= multipliers[Math.min(thresholdIndex, multipliers.length - 1)];
      }
    }
    
    // Scale duration
    if (scaledEffect.duration) {
      scaledEffect.duration *= (1 + (scalingFactor * 0.5)); // 50% increase at max threshold
    }
    
    // Scale range
    if (scaledEffect.range) {
      scaledEffect.range *= (1 + (scalingFactor * 0.3)); // 30% increase at max threshold
    }
    
    // Apply special effects at certain thresholds
    if (system.specialEffects && system.specialEffects.thresholdEffects) {
      const thresholdEffects = system.specialEffects.thresholdEffects[thresholdIndex];
      if (thresholdEffects) {
        // Apply additional effects
        scaledEffect.additionalEffects = [
          ...(scaledEffect.additionalEffects || []),
          ...thresholdEffects
        ];
      }
    }
  }
  
  return scaledEffect;
}

/**
 * Generate suggestions for using combo points
 * @param {Object} system - The combo system configuration
 * @param {number} currentPoints - Current number of points
 * @returns {Array} Array of suggestions
 */
export function generateComboSuggestions(system, currentPoints) {
  if (!system || currentPoints === undefined) return [];
  
  const suggestions = [];
  const { consumptionRules } = system;
  
  if (consumptionRules.thresholds) {
    // Generate suggestions for each threshold
    for (let i = 0; i < consumptionRules.thresholds.length; i++) {
      const threshold = consumptionRules.thresholds[i];
      const nextThreshold = consumptionRules.thresholds[i + 1];
      
      const suggestion = {
        name: `${threshold}-Point ${system.name} Effect`,
        available: currentPoints >= threshold,
        description: `Use ${threshold} ${system.name} for enhanced effect`,
        potency: i + 1
      };
      
      // Add efficiency note
      if (nextThreshold && currentPoints >= threshold && currentPoints < nextThreshold) {
        suggestion.optimal = true;
        suggestion.description += " (Optimal)";
      } else if (currentPoints >= threshold && i === consumptionRules.thresholds.length - 1) {
        suggestion.optimal = true;
        suggestion.description += " (Maximum Effect)";
      }
      
      suggestions.push(suggestion);
    }
  }
  
  return suggestions;
}

/**
 * Get visual representation data for combo points
 * @param {Object} system - The combo system configuration
 * @param {number} currentPoints - Current number of points
 * @returns {Object} Visual representation data
 */
export function getComboVisualData(system, currentPoints) {
  if (!system) return null;
  
  const { visual, maxPoints } = system;
  const actualMax = typeof maxPoints === 'number' ? maxPoints : 5;
  
  return {
    type: visual.type || 'points',
    colors: visual.colors || ['#FF5555'],
    animation: visual.animation || 'pulse',
    current: currentPoints,
    max: actualMax,
    filled: Array(actualMax).fill(false).map((_, i) => i < currentPoints)
  };
}
