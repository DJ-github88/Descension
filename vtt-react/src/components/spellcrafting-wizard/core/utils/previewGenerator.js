/**
 * Spell Preview Generator
 * 
 * Utilities for generating different preview formats of spells, specialized preview generators
 * for different spell types, and scenario testing utilities.
 */

// Import required functions and constants
import { formatResourceName } from '../../../../utils/formatUtils';
import { getAverageRoll } from '../../data/enhancedEffectSystemData';
import { 
  COMBAT_STAT_MODIFIERS, 
  POSITIVE_STATUS_EFFECTS, 
  NEGATIVE_STATUS_EFFECTS 
} from '../../data/enhancedEffectSystemData';

import {
    EFFECT_TYPES,
    ENHANCED_EFFECT_TYPES,
    TARGETING_TYPES,
    DURATION_TYPES,
    SPELL_TEMPLATES,
    EnhancedEffectUtils
  } from '../../data/enhancedEffectSystemData';
  
  import { calculateTotalResources } from '../mechanics/resourceManager';
  
  // -------------------------------------------------------------------------
  // Format generators - Different display formats for spells
  // -------------------------------------------------------------------------
  
  /**
   * Generate a formatted spell card representation
   * @param {Object} spellConfig - The spell configuration object
   * @return {Object} Card data with formatted sections
   */
  export function generateSpellCard(spellConfig) {
    if (!spellConfig) return null;
    
    // Calculate resources
    const resources = calculateTotalResources(spellConfig);
    
    return {
      name: spellConfig.name || 'Unnamed Spell',
      level: spellConfig.level || 1,
      icon: spellConfig.icon || extractSpellIcon(spellConfig),
      description: formatCardDescription(spellConfig.description),
      effectSummary: generateEffectSummary(spellConfig),
      resources: generateResourceDisplay(spellConfig),
      targeting: generateTargetingText(spellConfig),
      duration: generateDurationText(spellConfig),
      cooldown: resources.cooldown > 0 ? `${resources.cooldown} rounds` : 'None',
      tooltipText: generateSpellDescription(spellConfig)
    };
  }
  
  /**
   * Generate a plain text description of the spell
   * @param {Object} spellConfig - The spell configuration object
   * @return {string} Plain text description
   */
  export function generateSpellDescription(spellConfig) {
    if (!spellConfig) return '';
    
    let description = '';
    
    // Basic info
    description += `${spellConfig.name || 'Unnamed Spell'} (Level ${spellConfig.level || 1})`;
    description += '\n\n';
    
    // Spell description if available
    if (spellConfig.description) {
      description += `${spellConfig.description}\n\n`;
    }
    
    // Resources and cooldown
    const resources = calculateTotalResources(spellConfig);
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
    
    // Add targeting info
    if (spellConfig.targetingConfig) {
      description += `${generateTargetingText(spellConfig)}\n`;
    }
    
    // Add duration info
    if (spellConfig.durationConfig) {
      description += `${generateDurationText(spellConfig)}\n\n`;
    }
    
    // Effects
    if (spellConfig.effectTypes && spellConfig.effectTypes.length > 0) {
      description += 'Effects:\n';
      description += generateEffectSummary(spellConfig);
    }
    
    return description;
  }
  
  /**
   * Generate game-ready text with formatting codes
   * @param {Object} spellConfig - The spell configuration object
   * @return {string} Formatted text with game markup
   */
  export function generateGameText(spellConfig) {
    if (!spellConfig) return '';
    
    let gameText = '';
    
    // Name and level with blue color
    gameText += `|cff00a0ff${spellConfig.name || 'Unnamed Spell'}|r (Level ${spellConfig.level || 1})`;
    gameText += '\n\n';
    
    // Description in white
    if (spellConfig.description) {
      gameText += `${spellConfig.description}\n\n`;
    }
    
    // Cost in gold
    const resources = calculateTotalResources(spellConfig);
    gameText += `|cffffcc00Cost:|r ${resources.actionPoints} action point${resources.actionPoints !== 1 ? 's' : ''}`;
    
    if (resources.mana > 0) {
      gameText += `, ${resources.mana} mana`;
    }
    
    if (resources.classResources) {
      gameText += `, ${resources.classResources.cost} ${formatResourceName(resources.classResources.type)}`;
    }
    
    if (resources.cooldown > 0) {
      gameText += `\n|cffffcc00Cooldown:|r ${resources.cooldown} round${resources.cooldown !== 1 ? 's' : ''}`;
    }
    
    gameText += '\n\n';
    
    // Targeting in colors
    if (spellConfig.targetingConfig) {
      gameText += applyWowStyling(generateTargetingText(spellConfig), 'label') + '\n';
    }
    
    // Duration in colors
    if (spellConfig.durationConfig) {
      gameText += applyWowStyling(generateDurationText(spellConfig), 'label') + '\n\n';
    }
    
    // Effects with colors
    if (spellConfig.effectTypes && spellConfig.effectTypes.length > 0) {
      gameText += `|cffffcc00Effects:|r\n`;
      
      for (const effectType of spellConfig.effectTypes) {
        const effectText = getEffectText(effectType, spellConfig);
        if (effectText) {
          const coloredText = applyWowStyling(effectText, effectType);
          gameText += `${coloredText}\n`;
        }
      }
    }
    
    return gameText;
  }
  
  /**
   * Generate a concise summary of the spell's effects
   * @param {Object} spellConfig - The spell configuration object
   * @return {string} Effect summary
   */
  export function generateEffectSummary(spellConfig) {
    if (!spellConfig || !spellConfig.effectTypes || spellConfig.effectTypes.length === 0) {
      return 'No effects';
    }
    
    let summary = '';
    
    for (const effectType of spellConfig.effectTypes) {
      const effectText = getEffectText(effectType, spellConfig);
      if (effectText) {
        summary += `• ${effectText}\n`;
      }
    }
    
    // Add persistent effects if any
    if (spellConfig.persistentConfig && spellConfig.persistentConfig.isPersistent) {
      const persistentText = getPersistentEffectText(spellConfig.persistentConfig);
      if (persistentText) {
        summary += `• ${persistentText}\n`;
      }
    }
    
    return summary;
  }
  
  /**
   * Generate a formatted display of the spell's resource costs
   * @param {Object} spellConfig - The spell configuration object
   * @return {string} Formatted resource display
   */
  export function generateResourceDisplay(spellConfig) {
    if (!spellConfig) return 'No cost';
    
    const resources = calculateTotalResources(spellConfig);
    const costParts = [];
    
    if (resources.actionPoints > 0) {
      costParts.push(`${resources.actionPoints} AP`);
    }
    
    if (resources.mana > 0) {
      costParts.push(`${resources.mana} Mana`);
    }
    
    if (resources.classResources) {
      costParts.push(`${resources.classResources.cost} ${formatResourceName(resources.classResources.type)}`);
    }
    
    if (costParts.length === 0) {
      return 'No cost';
    }
    
    return costParts.join(', ');
  }
  
  // -------------------------------------------------------------------------
  // Spell type preview generators - Specialized for different spell types
  // -------------------------------------------------------------------------
  
  /**
   * Generate a preview for standard action spells
   * @param {Object} config - The spell configuration
   * @return {Object} Action spell preview data
   */
  export function generateActionSpellPreview(config) {
    if (!config) return null;
    
    const base = generateSpellCard(config);
    
    return {
      ...base,
      castTime: config.typeConfig?.castTime || 'Instant',
      castIcon: 'bolt',
      castType: 'Action',
      notes: 'Standard actions consume your turn and can be used immediately.'
    };
  }
  
  /**
   * Generate a preview for channeled spells
   * @param {Object} config - The spell configuration
   * @return {Object} Channeled spell preview data
   */
  export function generateChanneledSpellPreview(config) {
    if (!config) return null;
    
    const base = generateSpellCard(config);
    
    // Get channeling-specific details
    const channelTurns = config.typeConfig?.channelTurns || 1;
    const interruptible = config.typeConfig?.interruptible !== false;
    const channelEffects = [];
    
    if (config.persistentConfig && config.persistentConfig.isPersistent) {
      channelEffects.push('Periodic effects while channeling');
    }
    
    if (config.typeConfig?.channelScaling) {
      channelEffects.push('Effects scale with channel duration');
    }
    
    return {
      ...base,
      castTime: `${channelTurns} turn${channelTurns !== 1 ? 's' : ''} (Channeled)`,
      castIcon: 'stream',
      castType: 'Channeled',
      interruptible: interruptible ? 'Can be interrupted' : 'Uninterruptible',
      channelNotes: channelEffects,
      notes: 'Channeled spells require concentration and continue over multiple turns.'
    };
  }
  
  /**
   * Generate a preview for passive abilities
   * @param {Object} config - The spell configuration
   * @return {Object} Passive spell preview data
   */
  export function generatePassiveSpellPreview(config) {
    if (!config) return null;
    
    const base = generateSpellCard(config);
    
    // Get passive-specific details
    const triggers = [];
    
    if (config.triggerConfig && config.triggerConfig.triggerCondition) {
      triggers.push(formatTriggerCondition(config.triggerConfig.triggerCondition));
    }
    
    return {
      ...base,
      castIcon: 'shield-alt',
      castType: 'Passive',
      activationMethod: config.triggerConfig?.activationMode || 'Automatic',
      triggers: triggers,
      notes: 'Passive abilities are always active and do not require an action to use.'
    };
  }
  
  /**
   * Generate a preview for reaction spells
   * @param {Object} config - The spell configuration
   * @return {Object} Reaction spell preview data
   */
  export function generateReactionSpellPreview(config) {
    if (!config) return null;
    
    const base = generateSpellCard(config);
    
    // Get reaction-specific details
    const triggers = [];
    
    if (config.triggerConfig && config.triggerConfig.triggerCondition) {
      triggers.push(formatTriggerCondition(config.triggerConfig.triggerCondition));
    }
    
    return {
      ...base,
      castIcon: 'bolt',
      castType: 'Reaction',
      triggerConditions: triggers,
      reactiveNotes: config.triggerConfig?.usesPerRound ? 
        `Can be used ${config.triggerConfig.usesPerRound} times per round` : 
        'Can be used once per trigger',
      notes: 'Reaction spells are cast automatically in response to specific triggers.'
    };
  }
  
  // -------------------------------------------------------------------------
  // Page content generators - Specialized content for different page types
  // -------------------------------------------------------------------------
  
  /**
   * Generate content for basic info page
   * @param {Object} config - The spell configuration
   * @return {Object} Basic info page content
   */
  export function generateBasicInfoPage(config) {
    if (!config) return null;
    
    // Calculate resources
    const resources = calculateTotalResources(config);
    
    return {
      name: config.name || 'Unnamed Spell',
      level: config.level || 1,
      icon: config.icon || extractSpellIcon(config),
      description: config.description || 'No description',
      spellType: config.spellType || 'ACTION',
      school: config.typeConfig?.school || 'None',
      castTime: getCastTimeText(config),
      resources: {
        actionPoints: resources.actionPoints || 0,
        mana: resources.mana || 0,
        custom: resources.classResources || null
      }
    };
  }
  
  /**
   * Generate content for effects page
   * @param {Object} config - The spell configuration
   * @return {Object} Effects page content
   */
  export function generateEffectsPage(config) {
    if (!config) return { effects: [] };
    
    const effects = [];
    
    if (config.effectTypes && config.effectTypes.length > 0) {
      for (const effectType of config.effectTypes) {
        const effect = {
          type: effectType,
          icon: getEffectIcon(effectType),
          description: getEffectText(effectType, config)
        };
        
        // Add effect-specific details
        switch(effectType) {
          case 'damage':
            if (config.damageConfig) {
              effect.details = {
                formula: config.damageConfig.diceNotation || '',
                average: config.damageConfig.diceNotation ? 
                  getAverageRoll(config.damageConfig.diceNotation).toFixed(1) : '',
                types: config.damageConfig.damageTypes || [],
                critical: config.damageConfig.useCriticalEffect ? 
                  config.damageConfig.criticalConfig?.criticalMultiplier || '2x' : 'None'
              };
            }
            break;
            
          case 'healing':
            if (config.healingConfig) {
              effect.details = {
                formula: config.healingConfig.diceNotation || '',
                average: config.healingConfig.diceNotation ? 
                  getAverageRoll(config.healingConfig.diceNotation).toFixed(1) : '',
                type: config.healingConfig.healingType || 'Standard',
                shield: config.healingConfig.useAbsorptionShield ? 
                  (config.healingConfig.shieldConfig?.shieldAmount || 'Yes') : 'No'
              };
            }
            break;
            
          case 'buff':
          case 'debuff':
            const configKey = `${effectType}Config`;
            if (config[configKey]) {
              const statModifiers = [];
              const statusEffects = [];
              
              if (config[configKey].statModifiers) {
                for (const [stat, value] of Object.entries(config[configKey].statModifiers)) {
                  const statName = COMBAT_STAT_MODIFIERS.find(s => s.id === stat)?.name || stat;
                  statModifiers.push(`${statName}: ${value > 0 ? '+' : ''}${value}`);
                }
              }
              
              if (config[configKey].statusEffects) {
                for (const effectId of config[configKey].statusEffects) {
                  const effectList = effectType === 'buff' ? POSITIVE_STATUS_EFFECTS : NEGATIVE_STATUS_EFFECTS;
                  const effectName = effectList.find(e => e.id === effectId)?.name || effectId;
                  statusEffects.push(effectName);
                }
              }
              
              effect.details = {
                statModifiers,
                statusEffects
              };
            }
            break;
            
          case 'utility':
            if (config.utilityConfig) {
              effect.details = {
                type: config.utilityConfig.utilityType || '',
                subtype: config.utilityConfig.utilitySubtype || '',
                parameters: config.utilityConfig.parameters || {}
              };
            }
            break;
        }
        
        effects.push(effect);
      }
    }
    
    // Add persistent effects if applicable
    if (config.persistentConfig && config.persistentConfig.isPersistent) {
      effects.push({
        type: 'persistent',
        icon: getPersistentEffectIcon(config.persistentConfig.persistentType),
        description: getPersistentEffectText(config.persistentConfig),
        details: {
          type: config.persistentConfig.persistentType || '',
          frequency: config.persistentConfig.tickFrequency || 'start_of_turn',
          duration: config.persistentConfig.tickDuration || 3,
          tickEffect: config.persistentConfig.persistentType === 'dot' ? 
            config.persistentConfig.tickDamage : 
            (config.persistentConfig.persistentType === 'hot' ? 
              config.persistentConfig.tickHealing : '')
        }
      });
    }
    
    return { effects };
  }
  
  /**
   * Generate content for mechanics page
   * @param {Object} config - The spell configuration
   * @return {Object} Mechanics page content
   */
  export function generateMechanicsPage(config) {
    if (!config || !config.mechanicsConfig) return { mechanics: [] };
    
    const mechanics = [];
    
    // Add card mechanics if configured
    if (config.mechanicsConfig.cards) {
      mechanics.push({
        type: 'cards',
        icon: 'address-card',
        title: 'Card System',
        description: `This spell ${config.mechanicsConfig.cards.generatesCards ? 'generates' : 'requires'} cards.`,
        details: {
          required: config.mechanicsConfig.cards.requiredCards || 0,
          generates: config.mechanicsConfig.cards.generatesCards || 0,
          specificTypes: config.mechanicsConfig.cards.cardTypes || [],
          consumeOnCast: config.mechanicsConfig.cards.consumeCards !== false
        }
      });
    }
    
    // Add combo mechanics if configured
    if (config.mechanicsConfig.combos) {
      mechanics.push({
        type: 'combos',
        icon: 'layer-group',
        title: 'Combo Points',
        description: `This spell ${config.mechanicsConfig.combos.type === 'generator' ? 'generates' : 'spends'} combo points.`,
        details: {
          type: config.mechanicsConfig.combos.type || 'spender',
          pointsGenerated: config.mechanicsConfig.combos.type === 'generator' ? 
            (config.mechanicsConfig.combos.points || 1) : 0,
          pointsSpent: config.mechanicsConfig.combos.type === 'spender' ? 
            (config.mechanicsConfig.combos.points || 1) : 0,
          scaling: config.mechanicsConfig.combos.scaling || false
        }
      });
    }
    
    // Add arcane charges mechanics if configured
    if (config.mechanicsConfig.arcaneCharges) {
      mechanics.push({
        type: 'arcaneCharges',
        icon: 'bolt',
        title: 'Arcane Charges',
        description: `This spell interacts with arcane charges.`,
        details: {
          generates: config.mechanicsConfig.arcaneCharges.generates || 0,
          consumes: config.mechanicsConfig.arcaneCharges.consumes || 0,
          scaling: config.mechanicsConfig.arcaneCharges.scaling || false
        }
      });
    }
    
    // Add other class mechanics
    if (config.mechanicsConfig.coins) {
      mechanics.push({
        type: 'coins',
        icon: 'coins',
        title: 'Coin Flips',
        description: 'This spell involves coin flip mechanics.',
        details: {
          flipCount: config.mechanicsConfig.coins.flipCount || 1,
          effectOnHeads: config.mechanicsConfig.coins.effectOnHeads || 'Standard effect',
          effectOnTails: config.mechanicsConfig.coins.effectOnTails || 'Reduced effect'
        }
      });
    }
    
    return { mechanics };
  }
  
  /**
   * Generate content for resource page
   * @param {Object} config - The spell configuration
   * @return {Object} Resource page content
   */
  export function generateResourcePage(config) {
    if (!config) return { resources: [] };
    
    const resources = calculateTotalResources(config);
    const resourcesData = [];
    
    // Action points
    resourcesData.push({
      type: 'actionPoints',
      icon: 'bolt',
      name: 'Action Points',
      value: resources.actionPoints || 0,
      description: 'Action points represent the action economy cost of casting the spell.'
    });
    
    // Mana
    resourcesData.push({
      type: 'mana',
      icon: 'tint',
      name: 'Mana',
      value: resources.mana || 0,
      description: 'Mana is the primary spellcasting resource.'
    });
    
    // Cooldown
    if (resources.cooldown > 0) {
      resourcesData.push({
        type: 'cooldown',
        icon: 'hourglass-half',
        name: 'Cooldown',
        value: `${resources.cooldown} round${resources.cooldown !== 1 ? 's' : ''}`,
        description: 'After casting, the spell cannot be used again until the cooldown expires.'
      });
    }
    
    // Class resources
    if (resources.classResources) {
      const resourceType = resources.classResources.type;
      let icon = 'fire-alt';
      
      switch (resourceType) {
        case 'combo_points':
          icon = 'layer-group';
          break;
        case 'soul_shards':
          icon = 'ghost';
          break;
        case 'holy_power':
          icon = 'sun';
          break;
        case 'arcane_charges':
          icon = 'bolt';
          break;
      }
      
      resourcesData.push({
        type: resourceType,
        icon,
        name: formatResourceName(resourceType),
        value: resources.classResources.cost,
        description: `Class-specific resource required to cast this spell.`
      });
    }
    
    // Additional resource requirements
    if (config.resourceCost) {
      for (const [key, value] of Object.entries(config.resourceCost)) {
        if (!['actionPoints', 'mana', 'cooldown'].includes(key) && 
            typeof value !== 'object' && 
            !resourcesData.some(r => r.type === key)) {
          resourcesData.push({
            type: key,
            icon: 'cog',
            name: formatResourceName(key),
            value,
            description: `Additional resource required for this spell.`
          });
        }
      }
    }
    
    return { resources: resourcesData };
  }
  
  /**
   * Generate content for flavor page
   * @param {Object} config - The spell configuration
   * @return {Object} Flavor page content
   */
  export function generateFlavorPage(config) {
    if (!config) return { flavorText: '', visualization: '' };
    
    // Extract any flavor text from the configuration
    const flavorText = config.typeConfig?.flavorText || '';
    
    // Generate a visualization description based on the spell's effects
    let visualization = '';
    
    if (config.effectTypes && config.effectTypes.length > 0) {
      const primaryEffect = config.effectTypes[0];
      
      switch(primaryEffect) {
        case 'damage':
          if (config.damageConfig && config.damageConfig.damageTypes) {
            const damageType = config.damageConfig.damageTypes[0];
            
            switch(damageType) {
              case 'fire':
                visualization = 'Flames burst from your fingertips, engulfing your target in searing heat.';
                break;
              case 'frost':
              case 'cold':
                visualization = 'Crystalline ice forms in the air, blasting your target with freezing cold.';
                break;
              case 'lightning':
                visualization = 'Crackling energy arcs through the air, striking your target with electric fury.';
                break;
              case 'poison':
                visualization = 'Noxious green vapors seep forth, enveloping your target in toxic clouds.';
                break;
              case 'necrotic':
                visualization = 'Dark energies swirl around your hands, draining the life force from your target.';
                break;
              case 'radiant':
                visualization = 'A brilliant light bursts forth, searing your target with holy energy.';
                break;
              default:
                visualization = 'Mystical energies gather and strike your target with devastating force.';
            }
          } else {
            visualization = 'You channel destructive energies that damage your target.';
          }
          break;
          
        case 'healing':
          visualization = 'Gentle light suffuses your target, closing wounds and restoring vitality.';
          
          if (config.healingConfig && config.healingConfig.useAbsorptionShield) {
            visualization += ' A protective barrier of energy forms around them.';
          }
          break;
          
        case 'buff':
          visualization = 'Mystical energy surrounds your target, enhancing their abilities.';
          break;
          
        case 'debuff':
          visualization = 'Your target is afflicted with a weakening effect.';
          break;
          
        case 'utility':
          if (config.utilityConfig) {
            switch(config.utilityConfig.utilityType) {
              case 'movement':
                visualization = 'You manipulate the fabric of space, allowing rapid movement.';
                break;
              case 'transformation':
                visualization = 'Your form shifts and changes, taking on new properties.';
                break;
              case 'detection':
                visualization = 'Your senses expand beyond normal limitations, revealing what was hidden.';
                break;
              default:
                visualization = 'Mystical forces bend to your will, creating useful effects.';
            }
          } else {
            visualization = 'Mystical forces bend to your will, creating useful effects.';
          }
          break;
          
        default:
          visualization = 'Arcane powers manifest according to your will.';
      }
    } else {
      visualization = 'Mystical energies gather as you cast the spell.';
    }
    
    return {
      flavorText,
      visualization,
      class: config.typeConfig?.characterClass || 'Any',
      rarity: config.level >= 8 ? 'Epic' : (config.level >= 5 ? 'Rare' : 'Common'),
      source: config.typeConfig?.source || 'Standard spellbook'
    };
  }
  
  // -------------------------------------------------------------------------
  // Testing utilities - Functions for simulating and testing spells
  // -------------------------------------------------------------------------
  
  /**
   * Simulate spell use in a given scenario
   * @param {Object} config - The spell configuration
   * @param {Object} scenario - The scenario configuration
   * @return {Object} Simulation results
   */
  export function simulateSpellUse(config, scenario) {
    if (!config || !scenario) return null;
    
    // Default scenario values
    const caster = scenario.caster || {
      level: 1,
      stats: {
        spellPower: 10,
        criticalChance: 5,
        versatility: 0
      }
    };
    
    const targets = scenario.targets || [{
      health: 100,
      maxHealth: 100,
      resistances: {},
      vulnerabilities: {}
    }];
    
    const simulationCount = scenario.simulations || 1000;
    const results = {
      damageResults: [],
      healingResults: [],
      buffResults: [],
      debuffResults: [],
      averageDamage: 0,
      averageHealing: 0,
      criticalRate: 0,
      hitRate: 100,
      resourcesConsumed: calculateTotalResources(config)
    };
    
    // Run multiple simulations
    for (let i = 0; i < simulationCount; i++) {
      // Simulate damage
      if (config.effectTypes && config.effectTypes.includes('damage') && config.damageConfig) {
        const damageResult = simulateDamage(config.damageConfig, caster, targets, scenario);
        results.damageResults.push(damageResult);
      }
      
      // Simulate healing
      if (config.effectTypes && config.effectTypes.includes('healing') && config.healingConfig) {
        const healingResult = simulateHealing(config.healingConfig, caster, targets, scenario);
        results.healingResults.push(healingResult);
      }
      
      // Simulate buffs
      if (config.effectTypes && config.effectTypes.includes('buff') && config.buffConfig) {
        const buffResult = simulateBuffs(config.buffConfig, caster, targets, scenario);
        results.buffResults.push(buffResult);
      }
      
      // Simulate debuffs
      if (config.effectTypes && config.effectTypes.includes('debuff') && config.debuffConfig) {
        const debuffResult = simulateDebuffs(config.debuffConfig, caster, targets, scenario);
        results.debuffResults.push(debuffResult);
      }
    }
    
    // Calculate averages
    if (results.damageResults.length > 0) {
      const totalDamage = results.damageResults.reduce((sum, result) => sum + result.totalDamage, 0);
      results.averageDamage = totalDamage / results.damageResults.length;
      
      const crits = results.damageResults.filter(result => result.isCritical).length;
      results.criticalRate = (crits / results.damageResults.length) * 100;
    }
    
    if (results.healingResults.length > 0) {
      const totalHealing = results.healingResults.reduce((sum, result) => sum + result.totalHealing, 0);
      results.averageHealing = totalHealing / results.healingResults.length;
    }
    
    return results;
  }
  
  /**
   * Calculate average damage for a spell
   * @param {Object} config - The spell configuration
   * @return {Object} Damage calculation results
   */
  export function calculateAverageDamage(config) {
    if (!config || !config.effectTypes || !config.effectTypes.includes('damage') || !config.damageConfig) {
      return { averageDamage: 0 };
    }
    
    const results = {
      baseDamage: 0,
      criticalDamage: 0,
      averageDamage: 0,
      dps: 0
    };
    
    // Calculate base damage from dice notation
    if (config.damageConfig.diceNotation) {
      results.baseDamage = getAverageRoll(config.damageConfig.diceNotation);
    }
    
    // Calculate critical damage
    if (config.damageConfig.useCriticalEffect && config.damageConfig.criticalConfig) {
      const critMultiplier = config.damageConfig.criticalConfig.criticalMultiplier || 2;
      results.criticalDamage = results.baseDamage * critMultiplier;
    } else {
      results.criticalDamage = results.baseDamage * 2; // Default multiplier
    }
    
    // Assume 5% crit chance for average damage calculation
    results.averageDamage = (results.baseDamage * 0.95) + (results.criticalDamage * 0.05);
    
    // Calculate DPS based on resource costs
    const resources = calculateTotalResources(config);
    const actionsPerTurn = 1 / resources.actionPoints;
    const turnsUntilReuse = Math.max(1, resources.cooldown);
    
    results.dps = results.averageDamage * actionsPerTurn / turnsUntilReuse;
    
    // Add DoT damage if applicable
    if (config.persistentConfig && 
        config.persistentConfig.isPersistent && 
        config.persistentConfig.persistentType === 'dot' && 
        config.persistentConfig.tickDamage) {
      
      const tickDamage = getAverageRoll(config.persistentConfig.tickDamage);
      const duration = config.persistentConfig.tickDuration || 3;
      const totalDotDamage = tickDamage * duration;
      
      results.dotDamage = tickDamage;
      results.dotDuration = duration;
      results.totalDotDamage = totalDotDamage;
      results.averageDamage += totalDotDamage;
      results.dps += totalDotDamage / turnsUntilReuse;
    }
    
    return results;
  }
  
  /**
   * Calculate healing efficiency for a spell
   * @param {Object} config - The spell configuration
   * @return {Object} Healing calculation results
   */
  export function calculateHealingEfficiency(config) {
    if (!config || !config.effectTypes || !config.effectTypes.includes('healing') || !config.healingConfig) {
      return { averageHealing: 0 };
    }
    
    const results = {
      baseHealing: 0,
      criticalHealing: 0,
      averageHealing: 0,
      hps: 0,
      efficiency: 0
    };
    
    // Calculate base healing from dice notation
    if (config.healingConfig.diceNotation) {
      results.baseHealing = getAverageRoll(config.healingConfig.diceNotation);
    }
    
    // Calculate critical healing (usually 1.5x in WoW-style games)
    results.criticalHealing = results.baseHealing * 1.5;
    
    // Assume 5% crit chance for average healing calculation
    results.averageHealing = (results.baseHealing * 0.95) + (results.criticalHealing * 0.05);
    
    // Calculate HPS based on resource costs
    const resources = calculateTotalResources(config);
    const actionsPerTurn = 1 / resources.actionPoints;
    const turnsUntilReuse = Math.max(1, resources.cooldown);
    
    results.hps = results.averageHealing * actionsPerTurn / turnsUntilReuse;
    
    // Add HoT healing if applicable
    if (config.persistentConfig && 
        config.persistentConfig.isPersistent && 
        config.persistentConfig.persistentType === 'hot' && 
        config.persistentConfig.tickHealing) {
      
      const tickHealing = getAverageRoll(config.persistentConfig.tickHealing);
      const duration = config.persistentConfig.tickDuration || 3;
      const totalHotHealing = tickHealing * duration;
      
      results.hotHealing = tickHealing;
      results.hotDuration = duration;
      results.totalHotHealing = totalHotHealing;
      results.averageHealing += totalHotHealing;
      results.hps += totalHotHealing / turnsUntilReuse;
    }
    
    // Add shield amount if applicable
    if (config.healingConfig.useAbsorptionShield && 
        config.healingConfig.shieldConfig && 
        config.healingConfig.shieldConfig.shieldAmount) {
      
      const shieldAmount = getAverageRoll(config.healingConfig.shieldConfig.shieldAmount);
      
      results.shieldAmount = shieldAmount;
      results.totalEffectiveHealing = results.averageHealing + shieldAmount;
    } else {
      results.totalEffectiveHealing = results.averageHealing;
    }
    
    // Calculate efficiency (healing per mana)
    if (resources.mana > 0) {
      results.efficiency = results.totalEffectiveHealing / resources.mana;
    } else {
      results.efficiency = Infinity;
    }
    
    return results;
  }
  
  /**
   * Estimate control strength for a spell
   * @param {Object} config - The spell configuration
   * @return {Object} Control strength analysis
   */
  export function estimateControlStrength(config) {
    if (!config) return { controlRating: 0 };
    
    const results = {
      controlRating: 0,
      controlType: 'None',
      duration: 0,
      targets: 1,
      savingThrow: 'None',
      breaksOnDamage: false
    };
    
    // Check for control effects
    let hasControlEffect = false;
    
    if (config.effectTypes && config.effectTypes.includes('debuff') && config.debuffConfig) {
      // Look for control-oriented status effects
      const controlEffects = [
        'stunned', 'frozen', 'incapacitated', 'charmed', 'feared', 
        'silenced', 'rooted', 'slowed', 'disoriented'
      ];
      
      if (config.debuffConfig.statusEffects) {
        for (const effect of config.debuffConfig.statusEffects) {
          if (controlEffects.includes(effect)) {
            hasControlEffect = true;
            results.controlType = effect;
            break;
          }
        }
      }
    }
    
    if (config.effectTypes && config.effectTypes.includes('utility') && 
        config.utilityConfig && config.utilityConfig.utilityType === 'control') {
      hasControlEffect = true;
      results.controlType = config.utilityConfig.utilitySubtype || 'Generic Control';
    }
    
    if (!hasControlEffect) {
      return results;
    }
    
    // Determine duration
    if (config.durationConfig) {
      switch (config.durationConfig.durationType) {
        case 'instant':
          results.duration = 0;
          break;
        case 'permanent':
          results.duration = Infinity;
          break;
        default:
          results.duration = config.durationConfig.durationValue || 1;
      }
    }
    
    // Determine targets
    if (config.targetingConfig) {
      switch (config.targetingConfig.targetingType) {
        case 'single':
          results.targets = 1;
          break;
        case 'multi':
          results.targets = config.targetingConfig.targetCount || 1;
          break;
        case 'area':
          // Estimate targets based on area size and shape
          const areaSize = config.targetingConfig.areaSize || 10;
          switch (config.targetingConfig.areaShape) {
            case 'circle':
            case 'sphere':
              results.targets = Math.ceil(areaSize / 5); // Rough estimate
              break;
            case 'cone':
              results.targets = Math.ceil(areaSize / 8); // Cones typically hit fewer targets
              break;
            case 'line':
              results.targets = Math.ceil(areaSize / 10); // Lines typically hit fewer targets
              break;
            default:
              results.targets = Math.ceil(areaSize / 5);
          }
          break;
      }
    }
    
    // Calculate control rating
    // Base on control type severity, duration, and targets
    let typeFactor = 1;
    switch (results.controlType) {
      case 'stunned':
      case 'incapacitated':
        typeFactor = 5; // Complete control
        results.breaksOnDamage = false;
        break;
      case 'frozen':
      case 'paralyzed':
        typeFactor = 4.5; // Almost complete control, but can be broken
        results.breaksOnDamage = true;
        break;
      case 'charmed':
      case 'feared':
        typeFactor = 4; // Movement control
        results.breaksOnDamage = true;
        break;
      case 'silenced':
        typeFactor = 3; // Ability control
        results.breaksOnDamage = false;
        break;
      case 'rooted':
        typeFactor = 2.5; // Movement restriction
        results.breaksOnDamage = false;
        break;
      case 'slowed':
        typeFactor = 1.5; // Partial movement restriction
        results.breaksOnDamage = false;
        break;
      case 'disoriented':
        typeFactor = 2; // Partial control
        results.breaksOnDamage = true;
        break;
      default:
        typeFactor = 1;
    }
    
    // Calculate control rating
    results.controlRating = typeFactor * Math.min(5, results.duration) * Math.sqrt(results.targets);
    
    // Apply resource cost scaling
    const resources = calculateTotalResources(config);
    if (resources.cooldown > 0) {
      results.controlRating /= Math.sqrt(resources.cooldown);
    }
    
    // Round to one decimal place
    results.controlRating = Math.round(results.controlRating * 10) / 10;
    
    return results;
  }
  
  /**
   * Compare a spell with a baseline
   * @param {Object} config - The spell configuration
   * @param {Object} baseline - The baseline spell configuration
   * @return {Object} Comparison results
   */
  export function compareWithBaseline(config, baseline) {
    if (!config || !baseline) return null;
    
    const results = {
      name: config.name || 'Unnamed Spell',
      baselineName: baseline.name || 'Baseline Spell',
      damageDiff: 0,
      healingDiff: 0,
      resourceDiff: 0,
      cooldownDiff: 0,
      controlDiff: 0,
      overallRating: 0
    };
    
    // Compare damage
    const configDamage = calculateAverageDamage(config);
    const baselineDamage = calculateAverageDamage(baseline);
    
    results.damageDiff = configDamage.averageDamage - baselineDamage.averageDamage;
    results.damagePercent = baselineDamage.averageDamage > 0 ? 
      (configDamage.averageDamage / baselineDamage.averageDamage) * 100 - 100 : 0;
    
    // Compare healing
    const configHealing = calculateHealingEfficiency(config);
    const baselineHealing = calculateHealingEfficiency(baseline);
    
    results.healingDiff = configHealing.averageHealing - baselineHealing.averageHealing;
    results.healingPercent = baselineHealing.averageHealing > 0 ? 
      (configHealing.averageHealing / baselineHealing.averageHealing) * 100 - 100 : 0;
    
    // Compare resources
    const configResources = calculateTotalResources(config);
    const baselineResources = calculateTotalResources(baseline);
    
    results.resourceDiff = {
      actionPoints: configResources.actionPoints - baselineResources.actionPoints,
      mana: configResources.mana - baselineResources.mana,
      cooldown: configResources.cooldown - baselineResources.cooldown
    };
    
    // Compare control strength
    const configControl = estimateControlStrength(config);
    const baselineControl = estimateControlStrength(baseline);
    
    results.controlDiff = configControl.controlRating - baselineControl.controlRating;
    
    // Calculate overall rating (weighted average of differences)
    const weights = {
      damage: 1,
      healing: 1,
      resourceCost: -0.5,
      cooldown: -0.5,
      control: 0.8
    };
    
    let totalWeight = 0;
    let weightedScore = 0;
    
    // Only consider relevant metrics
    if (configDamage.averageDamage > 0 || baselineDamage.averageDamage > 0) {
      weightedScore += results.damagePercent * weights.damage;
      totalWeight += weights.damage;
    }
    
    if (configHealing.averageHealing > 0 || baselineHealing.averageHealing > 0) {
      weightedScore += results.healingPercent * weights.healing;
      totalWeight += weights.healing;
    }
    
    if (configResources.mana > 0 || baselineResources.mana > 0) {
      const manaPercentDiff = baselineResources.mana > 0 ? 
        (configResources.mana / baselineResources.mana) * 100 - 100 : 0;
      weightedScore += manaPercentDiff * weights.resourceCost;
      totalWeight += Math.abs(weights.resourceCost);
    }
    
    if (configResources.cooldown > 0 || baselineResources.cooldown > 0) {
      const cooldownPercentDiff = baselineResources.cooldown > 0 ? 
        (configResources.cooldown / baselineResources.cooldown) * 100 - 100 : 0;
      weightedScore += cooldownPercentDiff * weights.cooldown;
      totalWeight += Math.abs(weights.cooldown);
    }
    
    if (configControl.controlRating > 0 || baselineControl.controlRating > 0) {
      const controlPercentDiff = baselineControl.controlRating > 0 ? 
        (configControl.controlRating / baselineControl.controlRating) * 100 - 100 : 0;
      weightedScore += controlPercentDiff * weights.control;
      totalWeight += weights.control;
    }
    
    results.overallRating = totalWeight > 0 ? weightedScore / totalWeight : 0;
    
    // Add comparative evaluation
    if (results.overallRating > 20) {
      results.evaluation = 'Significantly stronger than baseline';
    } else if (results.overallRating > 5) {
      results.evaluation = 'Stronger than baseline';
    } else if (results.overallRating > -5) {
      results.evaluation = 'Comparable to baseline';
    } else if (results.overallRating > -20) {
      results.evaluation = 'Weaker than baseline';
    } else {
      results.evaluation = 'Significantly weaker than baseline';
    }
    
    return results;
  }
  
  // -------------------------------------------------------------------------
  // Formatting and style utilities
  // -------------------------------------------------------------------------
  
  /**
   * Apply WoW-style formatting to text
   * @param {string} text - Text to format
   * @param {string} type - Type of formatting to apply
   * @return {string} Formatted text
   */
  export function applyWowStyling(text, type) {
    if (!text) return '';
    
    // Color mapping for different types
    const colorMap = {
      damage: '|cffff0000', // Red
      healing: '|cff00ff00', // Green
      buff: '|cff00ffff',   // Light Blue (changed from yellow)
      debuff: '|cffff00ff', // Purple
      utility: '|cff00ffff', // Light Blue (changed from yellow)
      control: '|cffff8000', // Orange
      
      // Labels and other text
      label: '|cff00ffff',   // Light Blue (changed from yellow)
      value: '|cffffffff',   // White
      keyword: '|cff00ffff',  // Light Blue (changed from yellow)
      cooldown: '|cffa0a0a0', // Gray
      default: '|cffffffff'   // White
    };
    
    // Get appropriate color code
    const colorCode = colorMap[type] || colorMap.default;
    
    // Reset code
    const resetCode = '|r';
    
    return `${colorCode}${text}${resetCode}`;
  }
  
  /**
   * Format numbers appropriately for display
   * @param {number} value - Value to format
   * @param {string} type - Type of number
   * @return {string} Formatted number
   */
  export function formatNumbers(value, type = 'default') {
    if (value === undefined || value === null) return '';
    
    switch (type) {
      case 'percent':
        return `${Math.round(value * 10) / 10}%`;
        
      case 'decimal':
        return Math.round(value * 100) / 100;
        
      case 'integer':
        return Math.round(value);
        
      case 'resource':
        return Math.round(value).toLocaleString();
        
      case 'damage':
      case 'healing':
        if (value >= 1000) {
          return `${(Math.round(value / 100) / 10).toFixed(1)}k`;
        } else {
          return Math.round(value).toString();
        }
        
      default:
        return value.toString();
    }
  }
  
  /**
   * Generate icon markup for a spell
   * @param {Object} spellConfig - The spell configuration
   * @return {string} Icon markup
   */
  export function generateIconMarkup(iconClass = 'spell-icon-arcane') {
    return `<div class="spell-icon ${iconClass}"></div>`;
  }
  
  /**
   * Extract an appropriate icon for the spell based on its properties
   * @param {Object} spellConfig - The spell configuration
   * @returns {String} - Icon markup or default icon if none matches
   */
  export function extractSpellIcon(spellConfig) {
    // Default to a generic spell icon if we can't determine a specific one
    let iconClass = 'spell-icon-arcane';
  
    if (!spellConfig || !spellConfig.effectConfig) {
      return generateIconMarkup(iconClass);
    }
  
    const { primaryEffect } = spellConfig.effectConfig;
  
    // Determine icon based on primary effect
    switch (primaryEffect) {
      case 'damage':
        if (spellConfig.effectConfig.damageConfig && spellConfig.effectConfig.damageConfig.damageTypes) {
          const damageType = spellConfig.effectConfig.damageConfig.damageTypes[0];
          if (damageType === 'fire') iconClass = 'spell-icon-fire';
          else if (damageType === 'frost' || damageType === 'cold') iconClass = 'spell-icon-frost';
          else if (damageType === 'nature') iconClass = 'spell-icon-nature';
          else if (damageType === 'shadow' || damageType === 'necrotic') iconClass = 'spell-icon-shadow';
          else if (damageType === 'holy' || damageType === 'radiant') iconClass = 'spell-icon-holy';
        }
        break;
      case 'healing':
        iconClass = 'spell-icon-healing';
        break;
      case 'buff':
        iconClass = 'spell-icon-buff';
        break;
      case 'debuff':
        iconClass = 'spell-icon-debuff';
        break;
      case 'utility':
        iconClass = 'spell-icon-utility';
        break;
      case 'summon':
        iconClass = 'spell-icon-summon';
        break;
      default:
        // Keep default arcane icon
        break;
    }
  
    return generateIconMarkup(iconClass);
  }
  
  /**
   * Format keywords in text for better readability
   * @param {string} text - Text to format
   * @return {string} Text with formatted keywords
   */
  export function formatKeywords(text) {
    if (!text) return '';
    
    // Keywords to highlight
    const keywords = [
      'damage', 'healing', 'buff', 'debuff', 'stun', 'silence',
      'root', 'slow', 'snare', 'fear', 'charm', 'critical', 'shield'
    ];
    
    let formattedText = text;
    
    // Replace keywords with their styled versions
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      formattedText = formattedText.replace(regex, match => applyWowStyling(match, 'keyword'));
    }
    
    return formattedText;
  }
  
  // -------------------------------------------------------------------------
  // Helper functions - Internal utilities
  // -------------------------------------------------------------------------
  
  /**
   * Get appropriate icon for an effect type
   * @param {string} effectType - Type of effect
   * @return {string} FontAwesome icon name
   */
  function getEffectIcon(effectType) {
    switch(effectType.toLowerCase()) {
      case 'damage': return 'fire';
      case 'healing': return 'heart';
      case 'buff': return 'arrow-up';
      case 'debuff': return 'arrow-down';
      case 'utility': return 'magic';
      case 'control': return 'hand-paper';
      case 'summoning': return 'ghost';
      case 'transformation': return 'exchange';
      case 'persistent': return 'clock';
      default: return 'star';
    }
  }
  
  /**
   * Get icon for persistent effect based on type
   * @param {string} persistentType - Type of persistent effect
   * @return {string} FontAwesome icon name
   */
  function getPersistentEffectIcon(persistentType) {
    switch(persistentType) {
      case 'dot': return 'fire';
      case 'hot': return 'heart';
      case 'trigger': return 'bolt';
      default: return 'clock';
    }
  }
  
  /**
   * Format a resource name for display
   * @param {string} resourceType - Resource type identifier
   * @return {string} Formatted resource name
   */
  
  /**
   * Format a trigger condition for display
   * @param {string} condition - Trigger condition identifier
   * @return {string} Formatted trigger condition
   */
  function formatTriggerCondition(condition) {
    if (!condition) return 'Unknown Trigger';
    
    switch (condition) {
      case 'damage_taken':
        return 'When you take damage';
      case 'kill':
        return 'When you kill an enemy';
      case 'crit':
        return 'When you land a critical hit';
      case 'health_below':
        return 'When your health drops below a threshold';
      case 'cast_spell':
        return 'When you cast a spell';
      case 'enemy_cast':
        return 'When an enemy casts a spell';
      default:
        // Convert snake_case to readable format
        return condition
          .split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
    }
  }
  
  /**
   * Format a spell card description
   * @param {string} description - Original description
   * @return {string} Formatted description for card display
   */
  function formatCardDescription(description) {
    if (!description) return '';
    
    // Limit to ~100 characters for card display
    if (description.length > 100) {
      return description.substring(0, 97) + '...';
    }
    
    return description;
  }
  
  /**
   * Get formatted text for a spell's targeting configuration
   * @param {Object} spellConfig - The spell configuration
   * @return {string} Targeting text
   */
  function generateTargetingText(spellConfig) {
    if (!spellConfig || !spellConfig.targetingConfig) return 'Target: Self';
    
    const targetingConfig = spellConfig.targetingConfig;
    let targetText = 'Target: ';
    
    // Get targeting type
    switch (targetingConfig.targetingType) {
      case 'single':
        targetText += 'Single target';
        break;
      case 'multi':
        targetText += `${targetingConfig.targetCount || 'Multiple'} targets`;
        break;
      case 'area':
        const shape = targetingConfig.areaShape || 'circle';
        const size = targetingConfig.areaSize || 10;
        targetText += `${shape.charAt(0).toUpperCase() + shape.slice(1)} (${size} ft)`;
        break;
      case 'self':
        targetText += 'Self';
        break;
      default:
        targetText += 'Single target';
    }
    
    // Add range if specified
    if (targetingConfig.rangeType && targetingConfig.rangeType !== 'touch') {
      const range = targetingConfig.rangeDistance || 30;
      targetText += `, Range: ${range} ft`;
    } else if (targetingConfig.rangeType === 'touch') {
      targetText += ', Range: Touch';
    }
    
    return targetText;
  }
  
  /**
   * Get formatted text for a spell's duration configuration
   * @param {Object} spellConfig - The spell configuration
   * @return {string} Duration text
   */
  function generateDurationText(spellConfig) {
    if (!spellConfig || !spellConfig.durationConfig) return 'Duration: Instant';
    
    const durationConfig = spellConfig.durationConfig;
    let durationText = 'Duration: ';
    
    // Get duration type
    switch (durationConfig.durationType) {
      case 'instant':
        durationText += 'Instant';
        break;
      case 'permanent':
        durationText += 'Permanent';
        break;
      case 'concentration':
        durationText += `Concentration (up to ${durationConfig.durationValue || 1} ${
          durationConfig.durationUnit || 'rounds'
        })`;
        break;
      default:
        durationText += `${durationConfig.durationValue || 1} ${
          durationConfig.durationType || 'rounds'
        }`;
    }
    
    // Add concentration requirement if needed
    if (durationConfig.requiresConcentration && durationConfig.durationType !== 'concentration') {
      durationText += ' (Concentration)';
    }
    
    return durationText;
  }
  
  /**
   * Get formatted text for cast time
   * @param {Object} spellConfig - The spell configuration
   * @return {string} Cast time text
   */
  function getCastTimeText(spellConfig) {
    if (!spellConfig || !spellConfig.spellType) return 'Instant';
    
    switch (spellConfig.spellType) {
      case 'ACTION':
        if (spellConfig.typeConfig && spellConfig.typeConfig.castTime) {
          return `${spellConfig.typeConfig.castTime} ${
            spellConfig.typeConfig.castTime > 1 ? 'turns' : 'turn'
          }`;
        }
        return 'Instant';
        
      case 'CHANNELED':
        const channelTurns = spellConfig.typeConfig?.channelTurns || 1;
        return `${channelTurns} ${channelTurns > 1 ? 'turns' : 'turn'} (channeled)`;
        
      case 'PASSIVE':
        return 'Passive';
        
      case 'REACTION':
        return 'Reaction';
        
      default:
        return 'Instant';
    }
  }
  
  /**
   * Get effect text for a specific effect type
   * @param {string} effectType - Type of effect
   * @param {Object} spellConfig - The spell configuration
   * @return {string} Effect description text
   */
  function getEffectText(effectType, spellConfig) {
    if (!spellConfig) return '';
    
    switch (effectType) {
      case 'damage':
        if (!spellConfig.damageConfig) return 'Deals damage';
        
        let damageText = 'Deals ';
        
        if (spellConfig.damageConfig.diceNotation) {
          const avgDamage = getAverageRoll(spellConfig.damageConfig.diceNotation);
          damageText += `${spellConfig.damageConfig.diceNotation} (avg. ${avgDamage.toFixed(1)}) `;
        }
        
        if (spellConfig.damageConfig.damageTypes && spellConfig.damageConfig.damageTypes.length > 0) {
          damageText += spellConfig.damageConfig.damageTypes.join('/') + ' ';
        }
        
        damageText += 'damage';
        
        return damageText;
        
      case 'healing':
        if (!spellConfig.healingConfig) return 'Heals targets';
        
        let healingText = 'Restores ';
        
        if (spellConfig.healingConfig.diceNotation) {
          const avgHealing = getAverageRoll(spellConfig.healingConfig.diceNotation);
          healingText += `${spellConfig.healingConfig.diceNotation} (avg. ${avgHealing.toFixed(1)}) `;
        }
        
        healingText += 'health';
        
        if (spellConfig.healingConfig.useAbsorptionShield && spellConfig.healingConfig.shieldConfig) {
          healingText += ' and applies a shield';
        }
        
        return healingText;
        
      case 'buff':
        if (!spellConfig.buffConfig) return 'Applies beneficial effects';
        
        let buffText = 'Buffs target with ';
        
        if (spellConfig.buffConfig.statusEffects && spellConfig.buffConfig.statusEffects.length > 0) {
          const effectNames = spellConfig.buffConfig.statusEffects.map(id => {
            const effect = POSITIVE_STATUS_EFFECTS.find(e => e.id === id);
            return effect ? effect.name : id;
          });
          
          buffText += effectNames.join(', ');
        } else if (spellConfig.buffConfig.statModifiers && Object.keys(spellConfig.buffConfig.statModifiers).length > 0) {
          const statModifiers = [];
          
          for (const [stat, value] of Object.entries(spellConfig.buffConfig.statModifiers)) {
            const statName = COMBAT_STAT_MODIFIERS.find(s => s.id === stat)?.name || stat;
            statModifiers.push(`${value > 0 ? '+' : ''}${value} ${statName}`);
          }
          
          buffText += statModifiers.join(', ');
        } else {
          buffText = 'Applies beneficial effects';
        }
        
        return buffText;
        
      case 'debuff':
        if (!spellConfig.debuffConfig) return 'Applies negative effects';
        
        let debuffText = 'Debuffs target with ';
        
        if (spellConfig.debuffConfig.statusEffects && spellConfig.debuffConfig.statusEffects.length > 0) {
          const effectNames = spellConfig.debuffConfig.statusEffects.map(id => {
            const effect = NEGATIVE_STATUS_EFFECTS.find(e => e.id === id);
            return effect ? effect.name : id;
          });
          
          debuffText += effectNames.join(', ');
        } else if (spellConfig.debuffConfig.statModifiers && Object.keys(spellConfig.debuffConfig.statModifiers).length > 0) {
          const statModifiers = [];
          
          for (const [stat, value] of Object.entries(spellConfig.debuffConfig.statModifiers)) {
            const statName = COMBAT_STAT_MODIFIERS.find(s => s.id === stat)?.name || stat;
            statModifiers.push(`${value > 0 ? '+' : ''}${value} ${statName}`);
          }
          
          debuffText += statModifiers.join(', ');
        } else {
          debuffText = 'Applies negative effects';
        }
        
        return debuffText;
        
      case 'utility':
        if (!spellConfig.utilityConfig) return 'Provides utility effects';
        
        let utilityText = 'Provides ';
        
        if (spellConfig.utilityConfig.utilityType) {
          utilityText += spellConfig.utilityConfig.utilityType + ' ';
          
          if (spellConfig.utilityConfig.utilitySubtype) {
            utilityText += `(${spellConfig.utilityConfig.utilitySubtype}) `;
          }
        }
        
        utilityText += 'utility';
        
        return utilityText;
        
      default:
        // For other effect types
        const effect = EFFECT_TYPES.find(e => e.id === effectType);
        return effect ? effect.name : effectType;
    }
  }
  
  /**
   * Get text description for a persistent effect
   * @param {Object} persistentConfig - Configuration for the persistent effect
   * @return {string} Persistent effect description
   */
  function getPersistentEffectText(persistentConfig) {
    if (!persistentConfig || !persistentConfig.isPersistent) return '';
    
    switch (persistentConfig.persistentType) {
      case 'dot':
        let dotText = 'Deals additional ';
        
        if (persistentConfig.tickDamage) {
          const avgTickDamage = getAverageRoll(persistentConfig.tickDamage);
          dotText += `${persistentConfig.tickDamage} (avg. ${avgTickDamage.toFixed(1)}) damage `;
        } else {
          dotText += 'damage ';
        }
        
        if (persistentConfig.tickFrequency) {
          dotText += persistentConfig.tickFrequency.replace(/_/g, ' ') + ' ';
        } else {
          dotText += 'every round ';
        }
        
        if (persistentConfig.tickDuration) {
          dotText += `for ${persistentConfig.tickDuration} rounds`;
        } else {
          dotText += 'while active';
        }
        
        return dotText;
        
      case 'hot':
        let hotText = 'Restores additional ';
        
        if (persistentConfig.tickHealing) {
          const avgTickHealing = getAverageRoll(persistentConfig.tickHealing);
          hotText += `${persistentConfig.tickHealing} (avg. ${avgTickHealing.toFixed(1)}) health `;
        } else {
          hotText += 'health ';
        }
        
        if (persistentConfig.tickFrequency) {
          hotText += persistentConfig.tickFrequency.replace(/_/g, ' ') + ' ';
        } else {
          hotText += 'every round ';
        }
        
        if (persistentConfig.tickDuration) {
          hotText += `for ${persistentConfig.tickDuration} rounds`;
        } else {
          hotText += 'while active';
        }
        
        return hotText;
        
      case 'trigger':
        let triggerText = 'Creates a triggered effect';
        
        if (persistentConfig.triggerCondition) {
          triggerText = `Triggers ${formatTriggerCondition(persistentConfig.triggerCondition)}`;
        }
        
        if (persistentConfig.triggerEffect) {
          triggerText += `, causing ${persistentConfig.triggerEffect.replace(/_/g, ' ')}`;
        }
        
        return triggerText;
        
      default:
        return 'Creates a persistent effect';
    }
  }
  
  /**
   * Simulate damage for a spell
   * @param {Object} damageConfig - Damage configuration
   * @param {Object} caster - Caster data
   * @param {Array} targets - Target data
   * @param {Object} scenario - Scenario configuration
   * @return {Object} Simulation results
   */
  function simulateDamage(damageConfig, caster, targets, scenario) {
    // This is a simplified simulation
    const result = {
      isCritical: false,
      targetDamage: [],
      totalDamage: 0
    };
    
    if (!damageConfig || !damageConfig.diceNotation) return result;
    
    // Roll for critical hit
    const critChance = caster.stats.criticalChance || 5;
    result.isCritical = Math.random() * 100 < critChance;
    
    // Parse dice notation and get average damage
    const baseDamage = getAverageRoll(damageConfig.diceNotation);
    
    // Calculate critical damage if applicable
    let damage = baseDamage;
    if (result.isCritical && damageConfig.useCriticalEffect && damageConfig.criticalConfig) {
      damage *= damageConfig.criticalConfig.criticalMultiplier || 2;
    } else if (result.isCritical) {
      damage *= 2; // Default critical multiplier
    }
    
    // Apply damage to each target
    for (const target of targets) {
      let targetDamage = damage;
      
      // Apply target resistances or vulnerabilities if applicable
      if (damageConfig.damageTypes && damageConfig.damageTypes.length > 0) {
        const damageType = damageConfig.damageTypes[0];
        
        if (target.resistances && target.resistances[damageType]) {
          targetDamage *= (1 - target.resistances[damageType] / 100);
        }
        
        if (target.vulnerabilities && target.vulnerabilities[damageType]) {
          targetDamage *= (1 + target.vulnerabilities[damageType] / 100);
        }
      }
      
      result.targetDamage.push({
        target,
        damage: targetDamage
      });
      
      result.totalDamage += targetDamage;
    }
    
    return result;
  }
  
  /**
   * Simulate healing for a spell
   * @param {Object} healingConfig - Healing configuration
   * @param {Object} caster - Caster data
   * @param {Array} targets - Target data
   * @param {Object} scenario - Scenario configuration
   * @return {Object} Simulation results
   */
  function simulateHealing(healingConfig, caster, targets, scenario) {
    // This is a simplified simulation
    const result = {
      isCritical: false,
      targetHealing: [],
      totalHealing: 0,
      shieldAmount: 0
    };
    
    if (!healingConfig || !healingConfig.diceNotation) return result;
    
    // Roll for critical healing
    const critChance = caster.stats.criticalChance || 5;
    result.isCritical = Math.random() * 100 < critChance;
    
    // Parse dice notation and get average healing
    const baseHealing = getAverageRoll(healingConfig.diceNotation);
    
    // Calculate critical healing if applicable
    let healing = baseHealing;
    if (result.isCritical) {
      healing *= 1.5; // Standard critical healing multiplier
    }
    
    // Apply healing to each target
    for (const target of targets) {
      let targetHealing = healing;
      
      // Cap healing to target's missing health
      const missingHealth = target.maxHealth - target.health;
      if (targetHealing > missingHealth) {
        targetHealing = missingHealth;
      }
      
      result.targetHealing.push({
        target,
        healing: targetHealing
      });
      
      result.totalHealing += targetHealing;
    }
    
    // Calculate shield if applicable
    if (healingConfig.useAbsorptionShield && 
        healingConfig.shieldConfig && 
        healingConfig.shieldConfig.shieldAmount) {
      
      const shieldAmount = getAverageRoll(healingConfig.shieldConfig.shieldAmount);
      
      result.shieldAmount = shieldAmount;
    }
    
    return result;
  }
  
  /**
   * Simulate buffs for a spell
   * @param {Object} buffConfig - Buff configuration
   * @param {Object} caster - Caster data
   * @param {Array} targets - Target data
   * @param {Object} scenario - Scenario configuration
   * @return {Object} Simulation results
   */
  function simulateBuffs(buffConfig, caster, targets, scenario) {
    // This is a simplified simulation
    const result = {
      appliedEffects: []
    };
    
    if (!buffConfig) return result;
    
    // Apply stat modifiers and status effects to each target
    for (const target of targets) {
      const targetEffects = {
        target,
        statModifiers: [],
        statusEffects: []
      };
      
      // Apply stat modifiers
      if (buffConfig.statModifiers) {
        for (const [stat, value] of Object.entries(buffConfig.statModifiers)) {
          targetEffects.statModifiers.push({
            stat,
            value
          });
        }
      }
      
      // Apply status effects
      if (buffConfig.statusEffects) {
        for (const effect of buffConfig.statusEffects) {
          targetEffects.statusEffects.push(effect);
        }
      }
      
      result.appliedEffects.push(targetEffects);
    }
    
    return result;
  }
  
  /**
   * Simulate debuffs for a spell
   * @param {Object} debuffConfig - Debuff configuration
   * @param {Object} caster - Caster data
   * @param {Array} targets - Target data
   * @param {Object} scenario - Scenario configuration
   * @return {Object} Simulation results
   */
  function simulateDebuffs(debuffConfig, caster, targets, scenario) {
    // This is a simplified simulation
    const result = {
      appliedEffects: []
    };
    
    if (!debuffConfig) return result;
    
    // Apply stat modifiers and status effects to each target
    for (const target of targets) {
      const targetEffects = {
        target,
        statModifiers: [],
        statusEffects: []
      };
      
      // Apply stat modifiers
      if (debuffConfig.statModifiers) {
        for (const [stat, value] of Object.entries(debuffConfig.statModifiers)) {
          targetEffects.statModifiers.push({
            stat,
            value
          });
        }
      }
      
      // Apply status effects
      if (debuffConfig.statusEffects) {
        for (const effect of debuffConfig.statusEffects) {
          targetEffects.statusEffects.push(effect);
        }
      }
      
      result.appliedEffects.push(targetEffects);
    }
    
    return result;
  }