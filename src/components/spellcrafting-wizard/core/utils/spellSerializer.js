/**
 * Spell Serializer
 *
 * Handles serialization and deserialization of spell configurations,
 * creation of templates, and generation of human-readable descriptions.
 */

import {
    EFFECT_TYPES,
    ENHANCED_EFFECT_TYPES,
    TARGETING_TYPES,
    DURATION_TYPES,
    SPELL_TEMPLATES,
    EnhancedEffectUtils,
    isValidDiceNotation,
    DAMAGE_TYPES,
    AOE_SHAPES,
    CRITICAL_EFFECT_MODIFIERS,
    ABSORPTION_SHIELD_TYPES,
    REFLECTION_DAMAGE_TYPES,
    COMBAT_STAT_MODIFIERS,
    POSITIVE_STATUS_EFFECTS,
    NEGATIVE_STATUS_EFFECTS,
    UTILITY_EFFECT_TYPES,
    getAverageRoll
  } from '../../data/enhancedEffectSystemData';

  import { calculateTotalResources } from '../mechanics/resourceManager';
  import { validateSpellConfig } from './spellValidator';

  /**
   * Serialize a spell configuration to JSON
   */
  export function serializeSpell(config) {
    try {
      // Create a clean copy of the config
      const cleanConfig = cleanConfigForSerialization(config);

      // Convert to JSON string
      return JSON.stringify(cleanConfig, null, 2);
    } catch (error) {
      console.error('Error serializing spell:', error);
      return null;
    }
  }

  /**
   * Deserialize a JSON string to a spell configuration
   */
  export function deserializeSpell(jsonString) {
    try {
      // Parse JSON string
      const config = JSON.parse(jsonString);

      // Validate the configuration
      const validation = validateSpellConfig(config);

      // Add validation results to the config
      config._validation = validation;

      return config;
    } catch (error) {
      console.error('Error deserializing spell:', error);
      return null;
    }
  }

  /**
   * Create a reusable template from a spell configuration
   */
  export function createSpellTemplate(config, templateName = null) {
    try {
      // Create a clean copy of the config
      const cleanConfig = cleanConfigForSerialization(config);

      // Add template metadata
      const template = {
        ...cleanConfig,
        _isTemplate: true,
        _templateName: templateName || `${config.name}_template`,
        _dateCreated: new Date().toISOString(),
        _parameterOptions: generateTemplateParameters(config)
      };

      return template;
    } catch (error) {
      console.error('Error creating spell template:', error);
      return null;
    }
  }

  /**
   * Generate a new spell from a template with modifications
   */
  export function generateSpellFromTemplate(template, modifications = {}) {
    try {
      // If the template is a string (JSON), parse it
      const templateConfig = typeof template === 'string' ? JSON.parse(template) : template;

      // Create a clean copy of the template
      const baseConfig = { ...templateConfig };

      // Remove template metadata
      delete baseConfig._isTemplate;
      delete baseConfig._templateName;
      delete baseConfig._dateCreated;
      delete baseConfig._parameterOptions;

      // Apply modifications
      for (const [key, value] of Object.entries(modifications)) {
        // Handle nested keys like "damageConfig.diceNotation"
        if (key.includes('.')) {
          const [parentKey, childKey] = key.split('.');
          if (!baseConfig[parentKey]) {
            baseConfig[parentKey] = {};
          }
          baseConfig[parentKey][childKey] = value;
        } else {
          baseConfig[key] = value;
        }
      }

      // Validate the modified config
      const validation = validateSpellConfig(baseConfig);

      // Add validation results to the config
      baseConfig._validation = validation;

      return baseConfig;
    } catch (error) {
      console.error('Error generating spell from template:', error);
      return null;
    }
  }

  /**
   * Generate a human-readable description of the spell
   * @param {Object} spellConfig - The spell configuration
   * @returns {string} - Human-readable description
   */
  export function generateHumanReadable(spellConfig) {
    if (!spellConfig) return '';

    let description = `${spellConfig.name} is a ${spellConfig.level ? `level ${spellConfig.level}` : ''} ${spellConfig.school || 'arcane'} spell. `;

    // Add casting time
    description += `It has a casting time of ${spellConfig.castingTime || '1 action'}. `;

    // Add range
    description += `The spell has a range of ${spellConfig.range || '30 feet'}. `;

    // Add components
    if (spellConfig.components) {
      const componentList = [];
      if (spellConfig.components.verbal) componentList.push('verbal');
      if (spellConfig.components.somatic) componentList.push('somatic');
      if (spellConfig.components.material) {
        componentList.push(`material (${spellConfig.components.materials || 'unspecified'})`);
      }

      if (componentList.length > 0) {
        description += `It requires ${componentList.join(', ')} components. `;
      }
    }

    // Add duration
    description += `The spell's duration is ${spellConfig.duration || 'instantaneous'}. `;

    // Add effect description
    if (spellConfig.description) {
      description += `\n\n${spellConfig.description}`;
    }

    return description;
  }

  /**
   * Generate game code for the spell
   */
  export function generateGameCode(spellConfig) {
    if (!spellConfig) return '';

    // Calculate resource costs
    const resources = calculateTotalResources(spellConfig);

    // Create a clean version of the spell for the game engine
    const gameSpell = {
      id: spellConfig.id || `spell_${Date.now()}`,
      name: spellConfig.name || 'Unnamed Spell',
      description: spellConfig.description || '',
      level: spellConfig.level || 1,
      school: spellConfig.school || 'arcane',
      castingTime: spellConfig.castingTime || '1 action',
      range: spellConfig.range || '30 feet',
      components: spellConfig.components || {
        verbal: true,
        somatic: true,
        material: false,
        materials: ''
      },
      duration: spellConfig.duration || 'Instantaneous',
      resources: resources,
      effects: serializeEffects(spellConfig),
      targeting: serializeTargeting(spellConfig),
      tags: spellConfig.tags || []
    };

    // Return formatted JSON
    return JSON.stringify(gameSpell, null, 2);
  }

  /**
   * Generate a human-readable description of the spell
   */
  export function generateHumanReadableDescription(config) {
    let description = '';

    // Start with spell name and level
    description += `${config.name}`;
    if (config.level !== undefined) {
      description += ` (Level ${config.level})`;
    }
    description += '\n\n';

    // Add spell description if available
    if (config.description) {
      description += `${config.description}\n\n`;
    }

    // Add resource costs
    const resources = calculateTotalResources(config);
    description += `Cost: ${resources.actionPoints} action point${resources.actionPoints !== 1 ? 's' : ''}`;

    if (resources.mana > 0) {
      description += `, ${resources.mana} mana`;
    }

    if (resources.classResources) {
      description += `, ${resources.classResources.cost} ${formatResourceName(resources.classResources.type)}`;
    }

    if (resources.cooldown > 0) {
      description += `\nCooldown: ${resources.cooldown} round${resources.cooldown !== 1 ? 's' : ''}`;
    }

    description += '\n\n';

    // Add targeting information
    if (config.targetingConfig) {
      const targeting = TARGETING_TYPES.find(t => t.id === config.targetingConfig.targetingType);
      description += `Targeting: ${targeting ? targeting.name : config.targetingConfig.targetingType}`;

      if (config.targetingConfig.targetingType === 'area') {
        const shape = AOE_SHAPES.find(s => s.id === config.targetingConfig.areaShape);
        description += ` (${shape ? shape.name : config.targetingConfig.areaShape}, ${config.targetingConfig.areaSize} ft)`;
      } else if (config.targetingConfig.targetingType === 'multi') {
        description += ` (${config.targetingConfig.targetCount} targets)`;
      }

      description += '\n';
    }

    // Add duration information
    if (config.durationConfig) {
      const duration = DURATION_TYPES.find(d => d.id === config.durationConfig.durationType);
      description += `Duration: ${duration ? duration.name : config.durationConfig.durationType}`;

      if (config.durationConfig.durationType !== 'instant') {
        description += ` (${config.durationConfig.durationValue} ${config.durationConfig.durationType})`;
      }

      if (config.durationConfig.requiresConcentration) {
        description += ' (Concentration)';
      }

      description += '\n\n';
    }

    // Add effect descriptions
    if (config.effectTypes && config.effectTypes.length > 0) {
      description += 'Effects:\n';

      // Damage effects
      if (config.effectTypes.includes('damage') && config.damageConfig) {
        description += '• Damage: ';

        // Damage type
        if (config.damageConfig.damageTypes && config.damageConfig.damageTypes.length > 0) {
          const damageTypeNames = config.damageConfig.damageTypes.map(id => {
            const damageType = DAMAGE_TYPES.find(dt => dt.id === id);
            return damageType ? damageType.name : id;
          });

          description += damageTypeNames.join(' and ');
        }

        // Damage amount
        if (config.damageConfig.diceNotation) {
          const avgDamage = getAverageRoll(config.damageConfig.diceNotation);
          description += ` (${config.damageConfig.diceNotation}, avg. ${avgDamage.toFixed(1)})`;
        }

        // Chain effects
        if (config.damageConfig.useChainEffect && config.damageConfig.chainConfig) {
          description += `\n  - Chains to up to ${config.damageConfig.chainConfig.targets} additional targets`;

          if (config.damageConfig.chainConfig.falloffType) {
            description += ` with ${config.damageConfig.chainConfig.falloffType} damage reduction`;
          }
        }

        // Critical effects
        if (config.damageConfig.useCriticalEffect && config.damageConfig.criticalConfig) {
          description += `\n  - Critical hits deal ${config.damageConfig.criticalConfig.criticalMultiplier}× damage`;

          if (config.damageConfig.criticalConfig.effects && config.damageConfig.criticalConfig.effects.length > 0) {
            const critEffectNames = config.damageConfig.criticalConfig.effects.map(id => {
              const effect = CRITICAL_EFFECT_MODIFIERS.find(ce => ce.id === id);
              return effect ? effect.name : id;
            });

            description += ` and may cause ${critEffectNames.join(' or ')}`;
          }
        }

        description += '\n';
      }

      // Healing effects
      if (config.effectTypes.includes('healing') && config.healingConfig) {
        description += '• Healing: ';

        // Healing type
        if (config.healingConfig.healingType) {
          description += `${config.healingConfig.healingType} healing`;
        }

        // Healing amount
        if (config.healingConfig.diceNotation) {
          const avgHealing = getAverageRoll(config.healingConfig.diceNotation);
          description += ` (${config.healingConfig.diceNotation}, avg. ${avgHealing.toFixed(1)})`;
        }

        // Absorption shield
        if (config.healingConfig.useAbsorptionShield && config.healingConfig.shieldConfig) {
          const shieldType = ABSORPTION_SHIELD_TYPES.find(s => s.id === config.healingConfig.shieldConfig.shieldType);

          description += `\n  - Applies ${shieldType ? shieldType.name : 'absorption shield'}`;

          if (config.healingConfig.shieldConfig.shieldAmount) {
            const avgShield = getAverageRoll(config.healingConfig.shieldConfig.shieldAmount);
            description += ` (${config.healingConfig.shieldConfig.shieldAmount}, avg. ${avgShield.toFixed(1)})`;
          }

          if (config.healingConfig.shieldConfig.reflectionType) {
            const reflectionType = REFLECTION_DAMAGE_TYPES.find(r => r.id === config.healingConfig.shieldConfig.reflectionType);
            description += `\n  - Shield reflects damage (${reflectionType ? reflectionType.name : 'reflection'})`;
          }
        }

        description += '\n';
      }

      // Buff effects
      if (config.effectTypes.includes('buff') && config.buffConfig) {
        description += '• Buffs:\n';

        // Stat modifiers
        if (config.buffConfig.statModifiers && Object.keys(config.buffConfig.statModifiers).length > 0) {
          description += '  - Stat Modifiers:\n';

          for (const [statId, value] of Object.entries(config.buffConfig.statModifiers)) {
            const stat = COMBAT_STAT_MODIFIERS.find(cs => cs.id === statId);
            description += `    • ${stat ? stat.name : statId}: ${value > 0 ? '+' : ''}${value}\n`;
          }
        }

        // Status effects
        if (config.buffConfig.statusEffects && config.buffConfig.statusEffects.length > 0) {
          description += '  - Status Effects:\n';

          for (const effectId of config.buffConfig.statusEffects) {
            const effect = POSITIVE_STATUS_EFFECTS.find(pse => pse.id === effectId);
            description += `    • ${effect ? effect.name : effectId}\n`;
          }
        }
      }

      // Debuff effects
      if (config.effectTypes.includes('debuff') && config.debuffConfig) {
        description += '• Debuffs:\n';

        // Stat modifiers
        if (config.debuffConfig.statModifiers && Object.keys(config.debuffConfig.statModifiers).length > 0) {
          description += '  - Stat Modifiers:\n';

          for (const [statId, value] of Object.entries(config.debuffConfig.statModifiers)) {
            const stat = COMBAT_STAT_MODIFIERS.find(cs => cs.id === statId);
            description += `    • ${stat ? stat.name : statId}: ${value > 0 ? '+' : ''}${value}\n`;
          }
        }

        // Status effects
        if (config.debuffConfig.statusEffects && config.debuffConfig.statusEffects.length > 0) {
          description += '  - Status Effects:\n';

          for (const effectId of config.debuffConfig.statusEffects) {
            const effect = NEGATIVE_STATUS_EFFECTS.find(nse => nse.id === effectId);
            description += `    • ${effect ? effect.name : effectId}\n`;
          }
        }
      }

      // Utility effects
      if (config.effectTypes.includes('utility') && config.utilityConfig) {
        description += '• Utility: ';

        const utilityType = UTILITY_EFFECT_TYPES.find(ut => ut.id === config.utilityConfig.utilityType);

        if (utilityType) {
          description += utilityType.name;

          const subtype = utilityType.subtypes.find(st => st.id === config.utilityConfig.utilitySubtype);
          if (subtype) {
            description += ` (${subtype.name})`;
          }

          if (config.utilityConfig.parameters) {
            description += '\n  - Parameters:';

            for (const [key, value] of Object.entries(config.utilityConfig.parameters)) {
              description += `\n    • ${formatParameterName(key)}: ${value}`;
            }
          }
        } else {
          description += config.utilityConfig.utilityType;
        }

        description += '\n';
      }

      // Other effect types
      const otherEffects = config.effectTypes.filter(type =>
        !['damage', 'healing', 'buff', 'debuff', 'utility'].includes(type)
      );

      if (otherEffects.length > 0) {
        for (const effectType of otherEffects) {
          const effect = EFFECT_TYPES.find(et => et.id === effectType);
          description += `• ${effect ? effect.name : effectType}\n`;
        }
      }
    }

    // Add persistent effect information
    if (config.persistentConfig && config.persistentConfig.isPersistent) {
      description += '\nPersistent Effects:\n';

      if (config.persistentConfig.persistentType === 'dot') {
        description += '• Damage Over Time: ';

        if (config.persistentConfig.tickDamage) {
          const avgTickDamage = getAverageRoll(config.persistentConfig.tickDamage);
          description += `${config.persistentConfig.tickDamage} (avg. ${avgTickDamage.toFixed(1)}) per tick`;
        }

        if (config.persistentConfig.tickFrequency) {
          description += `, occurs ${config.persistentConfig.tickFrequency}`;
        }

        if (config.persistentConfig.tickDuration) {
          description += ` for ${config.persistentConfig.tickDuration} rounds`;
        }

        description += '\n';
      } else if (config.persistentConfig.persistentType === 'hot') {
        description += '• Healing Over Time: ';

        if (config.persistentConfig.tickHealing) {
          const avgTickHealing = getAverageRoll(config.persistentConfig.tickHealing);
          description += `${config.persistentConfig.tickHealing} (avg. ${avgTickHealing.toFixed(1)}) per tick`;
        }

        if (config.persistentConfig.tickFrequency) {
          description += `, occurs ${config.persistentConfig.tickFrequency}`;
        }

        if (config.persistentConfig.tickDuration) {
          description += ` for ${config.persistentConfig.tickDuration} rounds`;
        }

        description += '\n';
      } else if (config.persistentConfig.persistentType === 'trigger') {
        description += '• Trigger Effect: ';

        if (config.persistentConfig.triggerCondition) {
          description += `Triggers on ${config.persistentConfig.triggerCondition}`;
        }

        if (config.persistentConfig.triggerEffect) {
          description += `, causes ${config.persistentConfig.triggerEffect}`;
        }

        description += '\n';
      }
    }

    // Add validation information if available
    if (config._validation) {
      if (!config._validation.valid) {
        description += '\nConfiguration Errors:\n';

        for (const [key, value] of Object.entries(config._validation.errors)) {
          description += `• ${key}: ${value}\n`;
        }
      }

      if (Object.keys(config._validation.warnings).length > 0) {
        description += '\nWarnings:\n';

        for (const [key, value] of Object.entries(config._validation.warnings)) {
          description += `• ${value}\n`;
        }
      }

      if (config._validation.suggestions && config._validation.suggestions.length > 0) {
        description += '\nSuggestions:\n';

        for (const suggestion of config._validation.suggestions) {
          description += `• ${suggestion}\n`;
        }
      }
    }

    return description;
  }

  /**
   * Extract an appropriate spell icon based on the configuration
   */
  export function extractSpellIcon(config) {
    // Default icon if none specified
    if (config.icon) {
      return config.icon;
    }

    // Select icon based on effect types
    if (!config.effectTypes || config.effectTypes.length === 0) {
      return 'spell_magic_polymorphrapid';
    }

    const primaryEffect = config.effectTypes[0];

    switch (primaryEffect) {
      case 'damage':
        if (config.damageConfig && config.damageConfig.damageTypes) {
          const damageType = config.damageConfig.damageTypes[0];

          switch (damageType) {
            case 'fire':
              return 'spell_fire_fireball02';
            case 'frost':
            case 'cold':
              return 'spell_frost_frostbolt02';
            case 'lightning':
              return 'spell_lightning_lightningbolt01';
            case 'poison':
              return 'spell_nature_corrosivebreath';
            case 'acid':
              return 'spell_nature_acid_01';
            case 'necrotic':
              return 'spell_shadow_shadowbolt';
            case 'radiant':
              return 'spell_holy_holysmite';
            case 'force':
              return 'spell_arcane_blast';
            case 'psychic':
              return 'spell_shadow_mindflay';
            default:
              return 'spell_fire_flamebolt';
          }
        }
        return 'spell_fire_flamebolt';

      case 'healing':
        if (config.healingConfig && config.healingConfig.useAbsorptionShield) {
          return 'spell_holy_powerwordshield';
        }
        return 'spell_holy_heal02';

      case 'buff':
        return 'spell_holy_divineillumination';

      case 'debuff':
        return 'spell_shadow_curseofsargeras';

      case 'utility':
        if (config.utilityConfig && config.utilityConfig.utilityType) {
          switch (config.utilityConfig.utilityType) {
            case 'movement':
              return 'ability_rogue_sprint';
            case 'illusion':
              return 'spell_shadow_teleport';
            case 'detection':
              return 'spell_holy_mindsooth';
            default:
              return 'spell_nature_earthbind';
          }
        }
        return 'spell_nature_earthbind';

      case 'control':
        return 'spell_frost_chainsofice';

      case 'summoning':
        return 'spell_shadow_summoninfernal';

      case 'transformation':
        return 'spell_nature_polymorph';

      default:
        return 'spell_magic_polymorphrapid';
    }
  }

  // =====================================================================
  // HELPER FUNCTIONS
  // =====================================================================

  /**
   * Clean a configuration object for serialization
   */
  function cleanConfigForSerialization(config) {
    // Create a deep copy of the config
    const cleanConfig = JSON.parse(JSON.stringify(config));

    // Remove any private fields (starting with _)
    for (const key in cleanConfig) {
      if (key.startsWith('_')) {
        delete cleanConfig[key];
      }
    }

    // Remove any calculated fields that should be recomputed
    delete cleanConfig.resourceCost;

    return cleanConfig;
  }

  /**
   * Generate template parameters for a spell configuration
   */
  function generateTemplateParameters(config) {
    const params = {
      name: {
        type: 'string',
        description: 'Spell name',
        default: config.name
      },
      level: {
        type: 'number',
        description: 'Spell level (1-10)',
        default: config.level || 1,
        min: 1,
        max: 10
      }
    };

    // Add damage parameters if applicable
    if (config.effectTypes && config.effectTypes.includes('damage') && config.damageConfig) {
      params.damageTypes = {
        type: 'array',
        description: 'Damage types',
        default: config.damageConfig.damageTypes || ['fire'],
        options: DAMAGE_TYPES.map(dt => ({ value: dt.id, label: dt.name }))
      };

      params['damageConfig.diceNotation'] = {
        type: 'string',
        description: 'Damage dice notation',
        default: config.damageConfig.diceNotation || '2d6'
      };
    }

    // Add healing parameters if applicable
    if (config.effectTypes && config.effectTypes.includes('healing') && config.healingConfig) {
      params['healingConfig.diceNotation'] = {
        type: 'string',
        description: 'Healing dice notation',
        default: config.healingConfig.diceNotation || '2d8'
      };

      params['healingConfig.useAbsorptionShield'] = {
        type: 'boolean',
        description: 'Apply absorption shield',
        default: config.healingConfig.useAbsorptionShield || false
      };
    }

    // Add targeting parameters
    if (config.targetingConfig) {
      params['targetingConfig.targetingType'] = {
        type: 'string',
        description: 'Targeting type',
        default: config.targetingConfig.targetingType || 'single',
        options: TARGETING_TYPES.map(tt => ({ value: tt.id, label: tt.name }))
      };

      if (config.targetingConfig.targetingType === 'area') {
        params['targetingConfig.areaShape'] = {
          type: 'string',
          description: 'Area shape',
          default: config.targetingConfig.areaShape || 'circle',
          options: AOE_SHAPES.map(shape => ({ value: shape.id, label: shape.name }))
        };

        params['targetingConfig.areaSize'] = {
          type: 'number',
          description: 'Area size (feet)',
          default: config.targetingConfig.areaSize || 20,
          min: 5,
          max: 100
        };
      } else if (config.targetingConfig.targetingType === 'multi') {
        params['targetingConfig.targetCount'] = {
          type: 'number',
          description: 'Target count',
          default: config.targetingConfig.targetCount || 3,
          min: 1,
          max: 10
        };
      }
    }

    // Add duration parameters
    if (config.durationConfig) {
      params['durationConfig.durationType'] = {
        type: 'string',
        description: 'Duration type',
        default: config.durationConfig.durationType || 'instant',
        options: DURATION_TYPES.map(dt => ({ value: dt.id, label: dt.name }))
      };

      if (config.durationConfig.durationType !== 'instant') {
        params['durationConfig.durationValue'] = {
          type: 'number',
          description: `Duration value (${config.durationConfig.durationType})`,
          default: config.durationConfig.durationValue || 1,
          min: 1
        };

        params['durationConfig.requiresConcentration'] = {
          type: 'boolean',
          description: 'Requires concentration',
          default: config.durationConfig.requiresConcentration || false
        };
      }
    }

    return params;
  }

  /**
   * Serialize effects for game code
   * @param {Object} spellConfig - The spell configuration
   * @returns {Object} - Serialized effects
   */
  function serializeEffects(spellConfig) {
    if (!spellConfig) return {};

    const effects = {};
    const { targetingMode, targetingTags } = spellConfig;

    // Add damage effects
    if (spellConfig.damageConfig && spellConfig.damageConfig.diceNotation) {
      effects.damage = {
        formula: spellConfig.damageConfig.diceNotation,
        types: spellConfig.damageConfig.damageTypes || [],
        critical: spellConfig.damageConfig.useCriticalEffect ?
          spellConfig.damageConfig.criticalConfig?.criticalMultiplier || '2x' : null
      };

      // Add targeting information if using tag-based targeting
      if (targetingMode === 'tagged' && targetingTags && targetingTags.damage) {
        effects.damage.targeting = {
          target: targetingTags.damage.targetOption || 'target'
        };
      }
    }

    // Add healing effects
    if (spellConfig.healingConfig && spellConfig.healingConfig.diceNotation) {
      effects.healing = {
        formula: spellConfig.healingConfig.diceNotation,
        type: spellConfig.healingConfig.healingType || 'Standard',
        shield: spellConfig.healingConfig.useAbsorptionShield ?
          spellConfig.healingConfig.shieldConfig?.shieldAmount || true : false
      };

      // Add targeting information if using tag-based targeting
      if (targetingMode === 'tagged' && targetingTags && targetingTags.healing) {
        effects.healing.targeting = {
          target: targetingTags.healing.targetOption || 'self'
        };
      }
    }

    // Add buff effects
    if (spellConfig.buffConfig) {
      effects.buff = {
        statModifiers: spellConfig.buffConfig.statModifiers || {},
        statusEffects: spellConfig.buffConfig.statusEffects || []
      };

      // Add targeting information if using tag-based targeting
      if (targetingMode === 'tagged' && targetingTags && targetingTags.buff) {
        effects.buff.targeting = {
          target: targetingTags.buff.targetOption || 'self'
        };
      }
    }

    // Add debuff effects
    if (spellConfig.debuffConfig) {
      effects.debuff = {
        statModifiers: spellConfig.debuffConfig.statModifiers || {},
        statusEffects: spellConfig.debuffConfig.statusEffects || []
      };

      // Add targeting information if using tag-based targeting
      if (targetingMode === 'tagged' && targetingTags && targetingTags.debuff) {
        effects.debuff.targeting = {
          target: targetingTags.debuff.targetOption || 'target'
        };
      }
    }

    // Add control effects
    if (spellConfig.controlConfig) {
      effects.control = {
        controlType: spellConfig.controlConfig.controlType || 'stun',
        duration: spellConfig.controlConfig.duration || 1
      };

      // Add targeting information if using tag-based targeting
      if (targetingMode === 'tagged' && targetingTags && targetingTags.control) {
        effects.control.targeting = {
          target: targetingTags.control.targetOption || 'target'
        };
      }
    }

    // Add utility effects
    if (spellConfig.utilityConfig) {
      effects.utility = {
        utilityType: spellConfig.utilityConfig.utilityType || 'movement'
      };

      // Add targeting information if using tag-based targeting
      if (targetingMode === 'tagged' && targetingTags && targetingTags.utility) {
        effects.utility.targeting = {
          target: targetingTags.utility.targetOption || 'target'
        };
      }
    }

    return effects;
  }

  /**
   * Serialize targeting for game code
   * @param {Object} spellConfig - The spell configuration
   * @returns {Object} - Serialized targeting
   */
  function serializeTargeting(spellConfig) {
    if (!spellConfig || !spellConfig.targetingConfig) return {};

    const targeting = {
      type: spellConfig.targetingConfig.targetingType || 'single',
      range: spellConfig.targetingConfig.rangeDistance || 30,
      restrictions: spellConfig.targetingConfig.targetRestrictions || ['any']
    };

    // Add area of effect details if applicable
    if (spellConfig.targetingConfig.targetingType === 'area' && spellConfig.targetingConfig.aoeShape) {
      targeting.aoe = {
        shape: spellConfig.targetingConfig.aoeShape || 'circle',
        size: spellConfig.targetingConfig.aoeParameters?.radius || 10
      };
    }

    // Add information about tag-based targeting
    if (spellConfig.targetingMode === 'tagged' && spellConfig.targetingTags) {
      targeting.mode = 'tagged';
      targeting.effectTargets = {};

      // Add a summary of which effects have custom targeting
      Object.entries(spellConfig.targetingTags).forEach(([effectType, config]) => {
        if (config && config.targetOption) {
          targeting.effectTargets[effectType] = {
            target: config.targetOption
          };
        }
      });
    }

    return targeting;
  }

  /**
   * Format a resource name for display
   */
  function formatResourceName(resourceType) {
    switch (resourceType) {
      case 'action_points':
        return 'Action Points';
      case 'combo_points':
        return 'Combo Points';
      case 'soul_shards':
        return 'Soul Shards';
      case 'holy_power':
        return 'Holy Power';
      case 'astral_power':
        return 'Astral Power';
      default:
        // Convert snake_case to Title Case
        return resourceType
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
    }
  }

  /**
   * Format a parameter name for display
   */
  function formatParameterName(paramName) {
    // Convert camelCase or snake_case to Title Case
    return paramName
      .replace(/([A-Z])/g, ' $1') // Insert space before capital letters
      .replace(/_/g, ' ') // Replace underscores with spaces
      .replace(/^\w/, c => c.toUpperCase()) // Capitalize first letter
      .trim();
  }

  /**
   * Convert a string to camelCase
   */
  function camelCase(str) {
    return str
      .replace(/[^\w\s]/g, '') // Remove special characters
      .replace(/\s+(.)/g, (match, chr) => chr.toUpperCase()) // Convert spaces + next char to upper case
      .replace(/\s/g, '') // Remove remaining spaces
      .replace(/^(.)/, match => match.toLowerCase()); // Make first char lowercase
  }

  /**
   * Convert a string to slug format (lowercase with hyphens)
   */
  function slugify(str) {
    return str
      .toLowerCase()
      .replace(/[^\w\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .trim();
  }