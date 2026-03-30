/**
 * Spell Component System
 * 
 * Provides support for spell components:
 * - Verbal components (spoken words)
 * - Somatic components (gestures)
 * - Material components (physical items)
 * - Focus components (special items)
 */

// Component types
export const COMPONENT_TYPES = {
  VERBAL: {
    id: 'verbal',
    name: 'Verbal',
    description: 'Spoken words or incantations required to cast the spell',
    icon: 'spell_icon_verbal',
    restrictions: {
      silenced: true,
      gagged: true,
      underwater: true
    }
  },
  
  SOMATIC: {
    id: 'somatic',
    name: 'Somatic',
    description: 'Specific hand gestures required to cast the spell',
    icon: 'spell_icon_somatic',
    restrictions: {
      restrained: true,
      handsOccupied: true,
      heavyArmor: false
    }
  },
  
  MATERIAL: {
    id: 'material',
    name: 'Material',
    description: 'Physical substances or objects required to cast the spell',
    icon: 'spell_icon_material',
    restrictions: {
      noComponents: true,
      specificItem: true
    }
  },
  
  FOCUS: {
    id: 'focus',
    name: 'Focus',
    description: 'Special object that channels magical energy but is not consumed',
    icon: 'spell_icon_focus',
    restrictions: {
      noComponents: true,
      specificItem: true
    }
  },
  
  DIVINE_FOCUS: {
    id: 'divine_focus',
    name: 'Divine Focus',
    description: 'Holy symbol or other divine object required for divine spells',
    icon: 'spell_icon_divine_focus',
    restrictions: {
      noComponents: true,
      specificItem: true
    }
  }
};

// Special component rules
export const COMPONENT_RULES = {
  // Feats that affect components
  FEATS: {
    WAR_CASTER: {
      id: 'war_caster',
      name: 'War Caster',
      description: 'You can perform the somatic components of spells even when you have weapons or a shield in one or both hands.',
      affectedComponents: ['somatic']
    },
    SUBTLE_SPELL: {
      id: 'subtle_spell',
      name: 'Subtle Spell',
      description: 'When you cast a spell, you can spend 1 sorcery point to cast it without any somatic or verbal components.',
      affectedComponents: ['verbal', 'somatic'],
      cost: {
        resource: 'sorcery_points',
        amount: 1
      }
    },
    ESCHEW_MATERIALS: {
      id: 'eschew_materials',
      name: 'Eschew Materials',
      description: 'You can cast any spell with a material component costing 1 gp or less without needing that component.',
      affectedComponents: ['material'],
      costThreshold: 1
    },
    STILL_SPELL: {
      id: 'still_spell',
      name: 'Still Spell',
      description: 'You can cast a spell without the somatic component, but at a higher spell level.',
      affectedComponents: ['somatic'],
      spellLevelIncrease: 1
    },
    SILENT_SPELL: {
      id: 'silent_spell',
      name: 'Silent Spell',
      description: 'You can cast a spell without the verbal component, but at a higher spell level.',
      affectedComponents: ['verbal'],
      spellLevelIncrease: 1
    }
  },
  
  // Class features that affect components
  CLASS_FEATURES: {
    NATURAL_RECOVERY: {
      id: 'natural_recovery',
      name: 'Natural Recovery',
      description: 'You can use natural materials as a spellcasting focus for your druid spells.',
      affectedComponents: ['material'],
      substitutes: ['natural_materials']
    },
    ARCANE_BOND: {
      id: 'arcane_bond',
      name: 'Arcane Bond',
      description: 'You can use your bonded object as a focus for any spell that requires a focus component.',
      affectedComponents: ['focus'],
      substitutes: ['bonded_object']
    }
  }
};

// Material component database (common components)
export const MATERIAL_COMPONENTS = {
  FIREFLY: {
    id: 'firefly',
    name: 'Firefly',
    description: 'A firefly or a piece of phosphorescent moss',
    cost: 0,
    spells: ['light', 'dancing_lights'],
    consumed: false
  },
  DIAMOND_DUST: {
    id: 'diamond_dust',
    name: 'Diamond Dust',
    description: 'Diamond dust worth at least 25 gp',
    cost: 25,
    spells: ['chromatic_orb'],
    consumed: false
  },
  RUBY_DUST: {
    id: 'ruby_dust',
    name: 'Ruby Dust',
    description: 'Ruby dust worth 50 gp',
    cost: 50,
    spells: ['continual_flame'],
    consumed: true
  },
  DIAMOND: {
    id: 'diamond',
    name: 'Diamond',
    description: 'A diamond worth at least 500 gp',
    cost: 500,
    spells: ['raise_dead'],
    consumed: true
  },
  BAT_GUANO: {
    id: 'bat_guano',
    name: 'Bat Guano',
    description: 'A tiny ball of bat guano and sulfur',
    cost: 0,
    spells: ['fireball'],
    consumed: true
  },
  PEARL: {
    id: 'pearl',
    name: 'Pearl',
    description: 'A pearl worth at least 100 gp',
    cost: 100,
    spells: ['identify'],
    consumed: false
  }
};

/**
 * Get a component type by ID
 * @param {string} componentId - The ID of the component to retrieve
 * @returns {Object} The component type configuration
 */
export function getComponentType(componentId) {
  return COMPONENT_TYPES[componentId.toUpperCase()] || null;
}

/**
 * Get component rules for a specific feature
 * @param {string} featureId - The ID of the feature to retrieve rules for
 * @returns {Object} The component rules for the specified feature
 */
export function getComponentRules(featureId) {
  // Check feats
  for (const featId in COMPONENT_RULES.FEATS) {
    if (featId === featureId.toUpperCase()) {
      return COMPONENT_RULES.FEATS[featId];
    }
  }
  
  // Check class features
  for (const classFeatureId in COMPONENT_RULES.CLASS_FEATURES) {
    if (classFeatureId === featureId.toUpperCase()) {
      return COMPONENT_RULES.CLASS_FEATURES[classFeatureId];
    }
  }
  
  return null;
}

/**
 * Get a material component by ID
 * @param {string} componentId - The ID of the material component to retrieve
 * @returns {Object} The material component configuration
 */
export function getMaterialComponent(componentId) {
  return MATERIAL_COMPONENTS[componentId.toUpperCase()] || null;
}

/**
 * Check if a spell can be cast with the given components and conditions
 * @param {Array} requiredComponents - Array of required component IDs
 * @param {Object} conditions - Object describing current casting conditions
 * @param {Object} casterAbilities - Object describing caster's abilities that might affect components
 * @returns {Object} Result of the check with success flag and reasons
 */
export function checkComponentRequirements(requiredComponents, conditions, casterAbilities) {
  const result = {
    canCast: true,
    reasons: [],
    modifiedSpellLevel: 0
  };
  
  // Check each required component
  for (const componentId of requiredComponents) {
    const component = getComponentType(componentId);
    if (!component) continue;
    
    // Check if component is restricted by conditions
    for (const [restriction, restricted] of Object.entries(component.restrictions)) {
      if (restricted && conditions[restriction]) {
        result.canCast = false;
        result.reasons.push(`Cannot provide ${component.name} component due to ${restriction} condition`);
      }
    }
    
    // Check if component can be substituted or bypassed by abilities
    let componentBypassed = false;
    
    // Check feats
    for (const featId in COMPONENT_RULES.FEATS) {
      const feat = COMPONENT_RULES.FEATS[featId];
      if (casterAbilities.feats?.includes(featId.toLowerCase()) && feat.affectedComponents.includes(componentId)) {
        componentBypassed = true;
        
        // Some feats increase spell level
        if (feat.spellLevelIncrease) {
          result.modifiedSpellLevel += feat.spellLevelIncrease;
        }
        
        // Some feats have a cost
        if (feat.cost) {
          result.cost = feat.cost;
        }
        
        break;
      }
    }
    
    // Check class features
    for (const featureId in COMPONENT_RULES.CLASS_FEATURES) {
      const feature = COMPONENT_RULES.CLASS_FEATURES[featureId];
      if (casterAbilities.classFeatures?.includes(featureId.toLowerCase()) && feature.affectedComponents.includes(componentId)) {
        componentBypassed = true;
        break;
      }
    }
    
    // If component is material with cost, check if it can be substituted
    if (componentId === 'material' && conditions.materialCost) {
      // Check if cost exceeds threshold for substitution
      const eschewMaterials = COMPONENT_RULES.FEATS.ESCHEW_MATERIALS;
      if (casterAbilities.feats?.includes('eschew_materials') && conditions.materialCost <= eschewMaterials.costThreshold) {
        componentBypassed = true;
      } else if (!conditions.hasSpecificMaterial) {
        result.canCast = false;
        result.reasons.push(`Missing required material component costing ${conditions.materialCost} gp`);
      }
    }
    
    // If component is not bypassed and is restricted, spell cannot be cast
    if (!componentBypassed && !result.canCast) {
      return result;
    }
  }
  
  return result;
}

/**
 * Generate default components for a spell based on its characteristics
 * @param {Object} spellConfig - Configuration of the spell
 * @returns {Array} Array of component IDs required for the spell
 */
export function generateDefaultComponents(spellConfig) {
  const components = [];
  
  // Most spells have verbal and somatic components
  components.push('verbal');
  components.push('somatic');
  
  // Add material components based on spell characteristics
  const { effectTypes, damageConfig, targetingConfig, durationConfig } = spellConfig;
  
  // Damage spells often have material components
  if (effectTypes.includes('damage') && damageConfig) {
    // Elemental damage often has thematic material components
    if (damageConfig.elementType) {
      components.push('material');
    }
  }
  
  // Area effect spells often have material components
  if (targetingConfig && targetingConfig.targetingType === 'area') {
    components.push('material');
  }
  
  // Long duration spells might have focus components
  if (durationConfig && ['minutes', 'hours', 'days'].includes(durationConfig.durationType)) {
    components.push('focus');
  }
  
  // Divine spells often require divine focus
  if (spellConfig.spellTypes && spellConfig.spellTypes.includes('divine')) {
    components.push('divine_focus');
  }
  
  return components;
}

/**
 * Get a suggested material component for a spell
 * @param {Object} spellConfig - Configuration of the spell
 * @returns {Object} Suggested material component
 */
export function getSuggestedMaterialComponent(spellConfig) {
  // Check if the spell is in the material components database
  for (const componentId in MATERIAL_COMPONENTS) {
    const component = MATERIAL_COMPONENTS[componentId];
    if (component.spells.includes(spellConfig.id)) {
      return component;
    }
  }
  
  // If not found, suggest a component based on spell characteristics
  const { effectTypes, damageConfig } = spellConfig;
  
  // Damage spells
  if (effectTypes.includes('damage') && damageConfig) {
    switch (damageConfig.elementType) {
      case 'fire':
        return {
          name: 'Sulfur and Bat Guano',
          description: 'A tiny ball of bat guano and sulfur',
          cost: 0,
          consumed: true
        };
      case 'frost':
      case 'ice':
        return {
          name: 'Crystal Shard',
          description: 'A small crystal shard',
          cost: 0,
          consumed: true
        };
      case 'lightning':
      case 'thunder':
        return {
          name: 'Fur and Amber Rod',
          description: 'A bit of fur and an amber, crystal, or glass rod',
          cost: 0,
          consumed: true
        };
      case 'acid':
        return {
          name: 'Powdered Rhubarb Leaf and Adder Stomach',
          description: 'Powdered rhubarb leaf and an adder\'s stomach',
          cost: 0,
          consumed: true
        };
      case 'necrotic':
      case 'shadow':
        return {
          name: 'Grave Dirt',
          description: 'A pinch of dirt from a grave',
          cost: 0,
          consumed: true
        };
      default:
        return {
          name: 'Iron Filings',
          description: 'A pinch of iron filings',
          cost: 0,
          consumed: true
        };
    }
  }
  
  // Healing spells
  if (effectTypes.includes('healing')) {
    return {
      name: 'Healing Herbs',
      description: 'A sprig of mistletoe and a healing herb',
      cost: 0,
      consumed: true
    };
  }
  
  // Utility spells
  if (effectTypes.includes('utility')) {
    return {
      name: 'Quartz Crystal',
      description: 'A small quartz crystal',
      cost: 0,
      consumed: false
    };
  }
  
  // Default
  return {
    name: 'Arcane Dust',
    description: 'A pinch of fine dust made from a rare mineral',
    cost: 0,
    consumed: true
  };
}
