import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import UnifiedSpellCard from '../spellcrafting-wizard/components/common/UnifiedSpellCard';
import { isPassiveStatModifier } from '../../utils/raceDisciplineSpellUtils';
import { getRacialBaseStats, getRacialSavingThrowModifiers } from '../../data/raceData';
import { getIconUrl } from '../../utils/assetManager';
import RaceEpicLore from './RaceEpicLore';
import './RaceSelector.css';

// Race data loader utility
const raceDataCache = new Map();

// Lazy load race data - temporarily disabled individual race files due to incomplete data
const loadRaceData = async (raceId) => {
  if (raceDataCache.has(raceId)) {
    return raceDataCache.get(raceId);
  }

  try {
    // Load from main raceData.js for now (individual files are incomplete)
    const { RACE_DATA } = await import('../../data/raceData');
    const raceData = RACE_DATA[raceId];
    if (raceData) {
      raceDataCache.set(raceId, raceData);
      return raceData;
    }
  } catch (error) {
    console.error(`Failed to load race data for ${raceId}:`, error);
  }

  return null;
};

// Get basic race list without full data
const getRaceList = async () => {
  try {
    const { RACE_DATA } = await import('../../data/raceData');
    return Object.values(RACE_DATA).map(race => ({
      id: race.id,
      name: race.name,
      description: race.description,
      icon: race.icon,
      variantCount: Object.keys(race.subraces || {}).length
    }));
  } catch (error) {
    console.error('Failed to load race list:', error);
    return [];
  }
};

// Cache for transformed traits to avoid recomputation
const traitTransformCache = new Map();

// Transform race trait to spell format expected by UnifiedSpellCard
const transformTraitToSpell = (trait) => {
  if (!trait) return {};

  // If trait already has the new spell format (effectTypes array exists), use it directly
  // This includes traits with empty effectTypes - they just show description without effect sections
  if (Array.isArray(trait.effectTypes)) {
    const spell = {
      id: trait.id || `trait_${trait.name?.toLowerCase().replace(/\s+/g, '_') || 'unknown'}`,
      name: trait.name || 'Unknown Trait',
      description: trait.description || '',
      level: trait.level || 0,
      spellType: trait.spellType || 'PASSIVE',
      effectTypes: trait.effectTypes,
      tags: trait.typeConfig?.tags || ['racial', 'trait'],
      damageTypes: trait.damageTypes || [],
      icon: trait.icon || trait.typeConfig?.icon || 'inv_misc_questionmark',
      typeConfig: trait.typeConfig,
      targetingConfig: trait.targetingConfig || { targetingType: 'self', rangeType: 'self' },
      resourceCost: trait.resourceCost,
      cooldownConfig: trait.cooldownConfig,
      triggerConfig: trait.triggerConfig,
      // Pass through all effect configs
      buffConfig: trait.buffConfig,
      debuffConfig: trait.debuffConfig,
      damageConfig: trait.damageConfig,
      healingConfig: trait.healingConfig,
      utilityConfig: trait.utilityConfig,
      controlConfig: trait.controlConfig,
      transformationConfig: trait.transformationConfig,
      summonConfig: trait.summonConfig,
      restorationConfig: trait.restorationConfig,
      purificationConfig: trait.purificationConfig
    };
    
    // Return directly without caching (new format traits are already properly structured)
    return spell;
  }

  // Legacy fallback: Base spell structure for old-format traits
  const cacheKey = `${trait.id}-${trait.name}`;
  if (traitTransformCache.has(cacheKey)) {
    return traitTransformCache.get(cacheKey);
  }
  const spell = {
    id: `trait_${trait.name?.toLowerCase().replace(/\s+/g, '_') || 'unknown'}`,
    name: trait.name || 'Unknown Trait',
    description: trait.description || '',
    level: 0, // Racial traits are level 0
    spellType: 'PASSIVE', // Most racial traits are passive
    effectTypes: [],
    tags: ['racial', 'trait'],
    damageTypes: [],
    icon: 'inv_misc_questionmark'
  };

  // Map trait type to effect types and configurations (legacy format)
  switch (trait.type) {
    case 'divination':
      spell.effectTypes = ['utility'];
      spell.utilityConfig = {
        utilityType: 'information',
        selectedEffects: [
          {
            id: 'detect_magic',
            name: 'Detect Magic',
            description: 'Can detect magical auras and effects within range'
          },
          {
            id: 'truesight',
            name: 'True Sight',
            description: 'Can see through illusions and detect hidden magical effects'
          }
        ],
        power: 'minor',
        duration: 0, // Permanent
        durationUnit: 'instant',
        concentration: false
      };
      spell.tags.push('divination');
      spell.icon = 'spell_holy_divinepurpose';
      break;

    case 'perception':
      spell.effectTypes = ['buff'];
      spell.buffConfig = {
        buffType: 'statEnhancement',
        statModifiers: [{
          id: 'perception_bonus',
          name: 'perception',
          magnitude: 0, // Advantage, not a numeric bonus
          magnitudeType: 'flat',
          description: 'Advantage on Perception checks'
        }],
        durationValue: 0,
        durationType: 'permanent',
        concentrationRequired: false,
        canBeDispelled: false
      };
      spell.tags.push('perception', 'senses');
      spell.icon = 'ability_hunter_pathfinding';
      break;

    case 'damage':
    case 'attack':
      spell.effectTypes = ['damage'];
      spell.spellType = 'ACTION';
      spell.damageConfig = {
        formula: trait.damageFormula || '1d6',
        elementType: trait.damageType || 'physical',
        damageType: 'direct',
        canCrit: true,
        critMultiplier: 2
      };
      spell.targetingConfig = {
        targetingType: 'single',
        rangeType: trait.range || 'ranged',
        rangeDistance: trait.rangeDistance || 30,
        targetRestrictions: ['enemy']
      };
      spell.resourceCost = {
        resourceTypes: ['action_points'],
        resourceValues: { action_points: 1 },
        useFormulas: {}
      };
      spell.tags.push('combat', 'damage');
      spell.icon = 'ability_warrior_charge';
      break;

    case 'healing':
      spell.effectTypes = ['healing'];
      spell.spellType = 'ACTION';
      spell.healingConfig = {
        formula: trait.healingFormula || '1d8',
        healingType: 'direct',
        hasHotEffect: false
      };
      spell.targetingConfig = {
        targetingType: 'single',
        rangeType: 'touch',
        targetRestrictions: ['ally', 'self']
      };
      spell.resourceCost = {
        resourceTypes: ['action_points'],
        resourceValues: { action_points: 1 },
        useFormulas: {}
      };
      spell.tags.push('healing', 'restoration');
      spell.icon = 'spell_holy_flashheal';
      break;

    case 'movement':
      spell.effectTypes = ['utility'];
      spell.utilityConfig = {
        utilityType: 'movement',
        selectedEffects: [{
          id: 'speed_boost',
          name: 'Speed Boost',
          description: `Increases movement speed by ${trait.speedBonus || 10} feet`
        }],
        enhancementType: 'speed',
        enhancementValue: trait.speedBonus || 10,
        power: 'minor',
        duration: trait.duration || 10,
        durationUnit: 'minutes',
        concentration: false
      };
      spell.tags.push('movement', 'mobility');
      spell.icon = 'ability_rogue_sprint';
      break;

    case 'stealth':
      spell.effectTypes = ['buff'];
      spell.buffConfig = {
        buffType: 'statEnhancement',
        statModifiers: [{
          id: 'stealth_bonus',
          name: 'stealth',
          magnitude: trait.stealthBonus || 0,
          magnitudeType: 'flat',
          description: trait.stealthDescription || 'Bonus to stealth checks'
        }],
        durationValue: 0,
        durationType: 'permanent',
        concentrationRequired: false,
        canBeDispelled: false
      };
      spell.tags.push('stealth', 'subterfuge');
      spell.icon = 'ability_stealth';
      break;

    case 'resistance':
    case 'vulnerability':
      // Parse damage types from description
      const parseDamageTypes = (description) => {
        const damageTypes = [];
        const lowerDesc = description.toLowerCase();

        // Common damage types to check for
        const typeMap = {
          'fire': 'fire',
          'cold': 'cold',
          'lightning': 'lightning',
          'acid': 'acid',
          'poison': 'poison',
          'necrotic': 'necrotic',
          'psychic': 'psychic',
          'radiant': 'radiant',
          'force': 'force',
          'thunder': 'thunder',
          'slashing': 'slashing',
          'piercing': 'piercing',
          'bludgeoning': 'bludgeoning',
          'physical': 'physical'
        };

        Object.entries(typeMap).forEach(([key, value]) => {
          if (lowerDesc.includes(key)) {
            damageTypes.push(value);
          }
        });

        return damageTypes.length > 0 ? damageTypes : ['physical'];
      };

      const damageTypes = parseDamageTypes(trait.description);

      if (trait.type === 'resistance') {
        spell.effectTypes = ['buff'];
        spell.buffConfig = {
          buffType: 'statModifier',
          statModifiers: damageTypes.map(type => ({
            id: `${type}_resistance`,
            name: type,
            category: 'resistance',
            magnitude: 50, // 50% resistance = takes half damage
            magnitudeType: 'percentage'
          })),
          durationValue: 0,
          durationType: 'permanent',
          concentrationRequired: false,
          canBeDispelled: false
        };
        spell.tags.push('resistance', 'protection');
        spell.icon = 'spell_holy_devotionaura';
      } else {
        spell.effectTypes = ['debuff'];
        spell.debuffConfig = {
          debuffType: 'statPenalty',
          statPenalties: damageTypes.map(type => ({
            id: `${type}_vulnerability`,
            name: type,
            category: 'resistance',
            magnitude: 150, // +50% damage = 150% total damage taken
            magnitudeType: 'percentage'
          })),
          durationValue: 0,
          durationType: 'permanent',
          concentrationRequired: false,
          canBeDispelled: false
        };
        spell.tags.push('vulnerability', 'weakness');
        spell.icon = 'spell_shadow_shadowwordpain';
      }
      break;

    case 'regeneration':
      spell.effectTypes = ['healing'];
      spell.healingConfig = {
        formula: trait.regenFormula || '1',
        healingType: 'hot',
        hasHotEffect: true,
        hotFormula: trait.regenFormula || '1',
        hotDuration: 10,
        hotTickType: 'turn'
      };
      spell.tags.push('regeneration', 'healing');
      spell.icon = 'spell_nature_rejuvenation';
      break;

    case 'telepathy':
    case 'communication':
      spell.effectTypes = ['utility'];
      spell.utilityConfig = {
        utilityType: 'information',
        selectedEffects: [
          {
            id: 'telepathy',
            name: 'Telepathy',
            description: 'Can communicate telepathically with others'
          },
          {
            id: 'detect_thoughts',
            name: 'Detect Thoughts',
            description: 'Can detect surface thoughts of creatures'
          }
        ],
        power: 'minor',
        duration: trait.commRange ? 0 : 10,
        durationUnit: trait.commRange ? 'instant' : 'minutes',
        concentration: false
      };
      if (trait.commRange) {
        spell.utilityConfig.range = trait.commRange;
      }
      spell.tags.push('communication', 'telepathy');
      spell.icon = 'spell_shadow_mindsteal';
      break;

    case 'transformation':
      spell.effectTypes = ['transformation'];
      spell.transformationConfig = {
        transformationType: trait.transformType || 'physical',
        targetType: 'self',
        duration: trait.transformDuration || 10,
        durationUnit: 'minutes',
        power: 'minor'
      };
      spell.tags.push('transformation', 'shapechanging');
      spell.icon = 'spell_nature_polymorph';
      break;

    case 'summoning':
      spell.effectTypes = ['summoning'];
      spell.summoningConfig = {
        creatureType: trait.summonType || 'elemental',
        creatureStrength: 'weak',
        duration: trait.summonDuration || 10,
        durationUnit: 'minutes',
        minions: 1,
        controlType: 'mental'
      };
      spell.tags.push('summoning', 'conjuration');
      spell.icon = 'spell_shadow_summonimp';
      break;

    case 'combat':
      spell.effectTypes = ['damage'];
      spell.spellType = 'ACTION';
      spell.damageConfig = {
        formula: '1d8',
        elementType: 'physical',
        damageType: 'direct',
        canCrit: true,
        critMultiplier: 2
      };
      spell.targetingConfig = {
        targetingType: 'single',
        rangeType: 'melee',
        targetRestrictions: ['enemy']
      };
      spell.resourceCost = {
        resourceTypes: ['action_points'],
        resourceValues: { action_points: 1 },
        useFormulas: {}
      };
      spell.tags.push('combat', 'damage');
      spell.icon = 'ability_warrior_charge';
      break;

    case 'defense':
      spell.effectTypes = ['buff'];
      spell.buffConfig = {
        buffType: 'statEnhancement',
        statModifiers: [{
          id: 'defense_bonus',
          name: 'armor_class',
          magnitude: trait.defenseBonus || 2,
          magnitudeType: 'flat',
          description: 'Bonus to armor class'
        }],
        durationValue: 0,
        durationType: 'permanent',
        concentrationRequired: false,
        canBeDispelled: false
      };
      spell.tags.push('defense', 'protection');
      spell.icon = 'spell_holy_devotionaura';
      break;

    case 'luck':
      spell.effectTypes = ['buff'];
      spell.buffConfig = {
        buffType: 'statusEffect',
        statusEffects: [{
          id: 'luck_bonus',
          name: 'Lucky',
          description: 'Luck on ability checks and saving throws',
          level: 'minor',
          saveType: 'none'
        }],
        durationValue: 0,
        durationType: 'permanent',
        concentrationRequired: false,
        canBeDispelled: false
      };
      spell.tags.push('luck', 'fortune');
      spell.icon = 'spell_misc_drink';
      break;

    case 'crafting':
      spell.effectTypes = ['utility'];
      spell.utilityConfig = {
        utilityType: 'creation',
        selectedEffects: [{
          id: 'craft_item',
          name: 'Craft Item',
          description: 'Can craft items with enhanced skill'
        }],
        power: 'minor',
        duration: 0,
        durationUnit: 'instant',
        concentration: false
      };
      spell.tags.push('crafting', 'creation');
      spell.icon = 'trade_engineering';
      break;

    case 'knowledge':
      spell.effectTypes = ['utility'];
      spell.utilityConfig = {
        utilityType: 'information',
        selectedEffects: [
          {
            id: 'identify',
            name: 'Identify',
            description: 'Can identify magical items and effects'
          },
          {
            id: 'lore',
            name: 'Lore Knowledge',
            description: 'Has extensive knowledge of history and lore'
          }
        ],
        power: 'minor',
        duration: 0,
        durationUnit: 'instant',
        concentration: false
      };
      spell.tags.push('knowledge', 'lore');
      spell.icon = 'inv_misc_book_01';
      break;

    case 'undead':
      spell.effectTypes = ['control'];
      spell.controlConfig = {
        controlType: 'mental',
        strength: 'moderate',
        duration: 10,
        saveDC: 13,
        saveType: 'spirit'
      };
      spell.tags.push('undead', 'control');
      spell.icon = 'spell_shadow_animatedead';
      break;

    case 'social':
      spell.effectTypes = ['buff'];
      spell.buffConfig = {
        buffType: 'statEnhancement',
        statModifiers: [{
          id: 'social_bonus',
          name: 'charisma',
          magnitude: trait.socialBonus || 2,
          magnitudeType: 'flat',
          description: 'Bonus to social interactions'
        }],
        durationValue: 0,
        durationType: 'permanent',
        concentrationRequired: false,
        canBeDispelled: false
      };
      spell.tags.push('social', 'charisma');
      spell.icon = 'spell_holy_prayerofspirit';
      break;

    case 'adaptive':
      spell.effectTypes = ['utility'];
      spell.utilityConfig = {
        utilityType: 'transformation',
        selectedEffects: [{
          id: 'adapt_environment',
          name: 'Environmental Adaptation',
          description: 'Can adapt to different environmental conditions'
        }],
        power: 'minor',
        duration: 60,
        durationUnit: 'minutes',
        concentration: false
      };
      spell.tags.push('adaptive', 'environment');
      spell.icon = 'spell_nature_naturetouchgrow';
      break;

    case 'spiritual':
      spell.effectTypes = ['buff'];
      spell.buffConfig = {
        buffType: 'statEnhancement',
        statModifiers: [{
          id: 'spirit_bonus',
          name: 'spirit',
          magnitude: trait.spiritBonus || 2,
          magnitudeType: 'flat',
          description: 'Bonus to spiritual abilities'
        }],
        durationValue: 0,
        durationType: 'permanent',
        concentrationRequired: false,
        canBeDispelled: false
      };
      spell.tags.push('spiritual', 'divine');
      spell.icon = 'spell_holy_holybolt';
      break;

    case 'elemental':
      spell.effectTypes = ['damage'];
      spell.spellType = 'ACTION';
      spell.damageConfig = {
        formula: '1d6',
        elementType: trait.elementType || 'fire',
        damageType: 'direct',
        canCrit: true,
        critMultiplier: 2
      };
      spell.targetingConfig = {
        targetingType: 'single',
        rangeType: 'ranged',
        rangeDistance: 30,
        targetRestrictions: ['enemy']
      };
      spell.resourceCost = {
        resourceTypes: ['action_points'],
        resourceValues: { action_points: 1 },
        useFormulas: {}
      };
      spell.tags.push('elemental', 'damage');
      spell.icon = 'spell_fire_firebolt02';
      break;

    case 'mental':
      spell.effectTypes = ['control'];
      spell.controlConfig = {
        controlType: 'mental',
        strength: 'moderate',
        duration: 10,
        saveDC: 13,
        saveType: 'spirit'
      };
      spell.tags.push('mental', 'control');
      spell.icon = 'spell_shadow_mindsteal';
      break;

    case 'illusion':
      spell.effectTypes = ['utility'];
      spell.utilityConfig = {
        utilityType: 'illusion',
        selectedEffects: [{
          id: 'visual_illusion',
          name: 'Visual Illusion',
          description: 'Can create convincing visual illusions'
        }],
        power: 'minor',
        duration: 10,
        durationUnit: 'minutes',
        concentration: true
      };
      spell.tags.push('illusion', 'deception');
      spell.icon = 'spell_shadow_unstableaffliction';
      break;

    case 'nature':
      spell.effectTypes = ['utility'];
      spell.utilityConfig = {
        utilityType: 'information',
        selectedEffects: [
          {
            id: 'detect_animals',
            name: 'Detect Animals',
            description: 'Can detect and communicate with animals'
          },
          {
            id: 'detect_plants',
            name: 'Detect Plants',
            description: 'Can detect and communicate with plants'
          }
        ],
        power: 'minor',
        duration: 10,
        durationUnit: 'minutes',
        concentration: false
      };
      spell.tags.push('nature', 'druidic');
      spell.icon = 'spell_nature_naturetouchgrow';
      break;

    case 'protection':
      spell.effectTypes = ['buff'];
      spell.buffConfig = {
        buffType: 'statusEffect',
        statusEffects: [{
          id: 'protection_bonus',
          name: 'Protected',
          description: 'Bonus to saving throws',
          level: 'minor',
          saveType: 'none'
        }],
        durationValue: 0,
        durationType: 'permanent',
        concentrationRequired: false,
        canBeDispelled: false
      };
      spell.tags.push('protection', 'wards');
      spell.icon = 'spell_holy_sealofprotection';
      break;

    default:
      // Default to utility effect for unknown types
      spell.effectTypes = ['utility'];
      spell.utilityConfig = {
        utilityType: 'information',
        selectedEffects: [{
          id: 'unknown_utility',
          name: 'Utility Effect',
          description: 'Provides unspecified utility benefits'
        }],
        power: 'minor',
        duration: 0,
        durationUnit: 'instant',
        concentration: false
      };
      spell.tags.push('utility');
      spell.icon = 'inv_misc_questionmark';
      break;
  }

  // Add targeting for applicable effects
  if (!spell.targetingConfig) {
    spell.targetingConfig = {
      targetingType: 'self',
      rangeType: 'self'
    };
  }

  // Add basic resource cost for active abilities
  if (!spell.resourceCost && spell.spellType !== 'PASSIVE') {
    spell.resourceCost = {
      resourceTypes: ['action_points'],
      resourceValues: { action_points: 1 },
      useFormulas: {}
    };
  }

  // Cache the transformed spell
  traitTransformCache.set(cacheKey, spell);

  return spell;
};


// Memoized Race Card Component
const RaceCard = React.memo(({ race, isSelected, onSelect }) => (
    <div
        className={`race-card ${isSelected ? 'selected' : ''}`}
        onClick={() => onSelect(race.id)}
        style={{ '--race-gradient': race.gradient }}
    >
        <div className="race-card-icon">
            <i className={race.icon}></i>
        </div>
        <h4 className="race-card-name">{race.name}</h4>
        {race.essence && <p className="race-card-essence">{race.essence}</p>}
        <div className="race-card-info">
            <span className="info-badge">
                <i className="fas fa-users"></i>
                {race.variantCount} Variants
            </span>
        </div>
    </div>
));

// Memoized Variant Card Component
const VariantCard = React.memo(({ variantId, variant, isSelected, onSelect }) => (
    <div
        className={`variant-card ${isSelected ? 'selected' : ''}`}
        onClick={() => onSelect(variantId)}
    >
        <h4 className="variant-card-name">{variant.name}</h4>
        <p className="variant-card-description">{variant.description}</p>
        <StatModifiersMini statModifiers={variant.statModifiers} />
    </div>
));

// Memoized Stat Modifiers Mini Component
const StatModifiersMini = React.memo(({ statModifiers }) => (
    <div className="stat-modifiers-mini">
        {Object.entries(statModifiers).map(([stat, modifier]) => {
            if (modifier === 0) return null;
            return (
                <span key={stat} className={`stat-mod ${modifier > 0 ? 'positive' : 'negative'}`}>
                    {stat.substring(0, 3).toUpperCase()} {modifier > 0 ? '+' : ''}{modifier}
                </span>
            );
        })}
    </div>
));

// Memoized Stat Modifiers Full Component
const StatModifiersFull = React.memo(({ statModifiers }) => (
    <div className="stat-block">
        <h4 className="stat-block-title">STAT MODIFIERS</h4>
        <div className="stat-modifiers-row">
            {Object.entries(statModifiers).map(([stat, modifier]) => (
                <span key={stat} className={`stat-modifier ${modifier > 0 ? 'positive' : modifier < 0 ? 'negative' : 'neutral'}`}>
                    {stat.substring(0, 3).toUpperCase()} {modifier > 0 ? '+' : ''}{modifier}
                </span>
            ))}
        </div>
    </div>
));

// Derive concise passive summaries: 1 line flavor text, then game mechanics
const getPassiveSummary = (trait = {}) => {
    const parts = [];
    
    // Extract first sentence of description as flavor text
    if (trait.description) {
        const firstSentence = trait.description.split(/[.!?]+/)[0].trim();
        if (firstSentence) parts.push(firstSentence + '.');
    }

    // Extract condition from triggerConfig if present
    let conditionText = '';
    if (trait.triggerConfig?.global?.compoundTriggers) {
        const healthTrigger = trait.triggerConfig.global.compoundTriggers.find(t => t.id === 'health_threshold');
        if (healthTrigger?.parameters) {
            const percentage = healthTrigger.parameters.percentage;
            const comparison = healthTrigger.parameters.comparison;
            if (percentage && comparison) {
                if (comparison === 'less_than' || comparison === 'below') {
                    conditionText = `when below ${percentage}% HP`;
                } else if (comparison === 'greater_than' || comparison === 'above') {
                    conditionText = `when above ${percentage}% HP`;
                }
            }
        }
    }

    const formatStatMod = (mod = {}) => {
        const stat = (mod.stat || 'stat').replace(/_/g, ' ');
        const mag = mod.magnitudeType === 'percentage'
            ? `${mod.magnitude}%`
            : `${mod.magnitude > 0 ? '+' : ''}${mod.magnitude}`;
        return `${stat} ${mag}`;
    };

    // Group stat modifiers together
    const statMods = [];
    const otherEffects = [];

    // Process buff effects
    if (trait.buffConfig?.effects) {
        trait.buffConfig.effects.forEach(effect => {
            if (effect.statModifier) {
                statMods.push(formatStatMod(effect.statModifier));
            } else if (effect.statusEffect) {
                otherEffects.push(effect.name || effect.statusEffect.type || 'Status effect');
            }
        });
    }

    // Process debuff effects
    if (trait.debuffConfig?.effects) {
        trait.debuffConfig.effects.forEach(effect => {
            if (effect.statModifier) {
                statMods.push(formatStatMod(effect.statModifier));
            } else if (effect.statusEffect) {
                otherEffects.push(effect.name || effect.statusEffect.type || 'Status effect');
            }
        });
    }

    // Add healing config
    if (trait.healingConfig) {
        const { formula = 'healing', hotTickInterval, hotDuration, durationType } = trait.healingConfig;
        const intervalText = hotTickInterval
            ? ` every ${hotTickInterval} round${hotTickInterval > 1 ? 's' : ''}`
            : '';
        const durationText = hotDuration
            ? ` while ${hotDuration}`
            : durationType === 'permanent'
                ? ' continuously'
                : '';
        parts.push(`Regenerates ${formula}${intervalText}${durationText}`.trim() + '.');
    }

    // Add stat modifiers (grouped together)
    if (statMods.length > 0) {
        const modText = statMods.join(', ');
        parts.push(conditionText ? `${modText} ${conditionText}` : modText);
    }

    // Add other effects
    if (otherEffects.length > 0) {
        parts.push(otherEffects.join(', '));
    }

    return parts.length ? parts.join(' ') : 'No description available';
};

// Memoized Trait Icon Component
const TraitIcon = React.memo(({ trait, isSelected, onTraitClick }) => (
    <div
        className={`trait-icon-item ${isSelected ? 'selected' : ''}`}
        onClick={() => onTraitClick(trait)}
        title={trait.name}
    >
        {trait.icon && (
            <img
                src={getIconUrl(trait.icon, 'abilities')}
                alt={trait.name}
                className="trait-icon"
                onError={(e) => {
                    e.target.src = getIconUrl('Utility/Utility', 'abilities');
                }}
            />
        )}
    </div>
));

const RaceSelector = () => {
    const [selectedRace, setSelectedRace] = useState(null);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [selectedTrait, setSelectedTrait] = useState(null);
    const [loadedRaceData, setLoadedRaceData] = useState(new Map());
    const [allRaces, setAllRaces] = useState([]);
    const [racesLoading, setRacesLoading] = useState(true);
    const [visibleRaceCount, setVisibleRaceCount] = useState(24); // Start with 24 races
    const [showEpicLore, setShowEpicLore] = useState(false);
    const raceGridRef = useRef(null);

    // Load race list on component mount
    useEffect(() => {
        const loadRaces = async () => {
            try {
                const raceList = await getRaceList();
                setAllRaces(raceList);
                setRacesLoading(false);
            } catch (error) {
                console.error('Failed to load race list:', error);
                setRacesLoading(false);
            }
        };

        loadRaces();
    }, []);

    // Only show visible races for performance
    const races = useMemo(() => {
        return allRaces.slice(0, visibleRaceCount);
    }, [allRaces, visibleRaceCount]);

    // Load more races when scrolling near the bottom
    const loadMoreRaces = useCallback(() => {
        setVisibleRaceCount(prev => Math.min(prev + 24, allRaces.length));
    }, [allRaces.length]);

    // Intersection observer to load more races when approaching the bottom
    useEffect(() => {
        if (!raceGridRef.current || visibleRaceCount >= allRaces.length || racesLoading) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    loadMoreRaces();
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        );

        // Observe the last race card
        const lastCard = raceGridRef.current.lastElementChild;
        if (lastCard) {
            observer.observe(lastCard);
        }

        return () => observer.disconnect();
    }, [visibleRaceCount, allRaces.length, loadMoreRaces, racesLoading]);

    // Lazy load full race data only when needed
    const raceData = useMemo(() => {
        if (!selectedRace) return null;

        // Check if already loaded
        if (loadedRaceData.has(selectedRace)) {
            return loadedRaceData.get(selectedRace);
        }

        // Trigger async loading
        loadRaceData(selectedRace).then(fullData => {
            if (fullData) {
                setLoadedRaceData(prev => new Map(prev).set(selectedRace, fullData));
            }
        });

        return null; // Return null while loading
    }, [selectedRace, loadedRaceData]);

    // Memoize variant data to prevent unnecessary lookups
    const variantData = useMemo(() =>
        selectedVariant && raceData ? raceData.subraces[selectedVariant] : null,
        [selectedVariant, raceData]
    );

    const handleRaceSelect = useCallback((raceId) => {
        setSelectedRace(raceId);
        setSelectedVariant(null); // Reset variant when race changes

        // Preload adjacent races for better UX
        const currentIndex = allRaces.findIndex(r => r.id === raceId);
        if (currentIndex !== -1) {
            // Preload next and previous races
            const preloadIndices = [
                currentIndex - 1,
                currentIndex + 1,
                currentIndex - 2,
                currentIndex + 2
            ].filter(idx => idx >= 0 && idx < allRaces.length);

            preloadIndices.forEach(idx => {
                const preloadRaceId = allRaces[idx].id;
                if (!loadedRaceData.has(preloadRaceId)) {
                    loadRaceData(preloadRaceId).then(fullData => {
                        if (fullData) {
                            setLoadedRaceData(prev => new Map(prev).set(preloadRaceId, fullData));
                        }
                    }).catch(() => {
                        // Silently fail preloading - not critical
                    });
                }
            });
        }
    }, [allRaces, loadedRaceData]);

    const handleVariantSelect = (variantId) => {
        setSelectedVariant(variantId);
    };

    const handleTraitClick = (trait) => {
        setSelectedTrait(trait);
    };

    // Determine current step for conditional rendering
    const currentStep = !selectedRace ? 'race' : !selectedVariant ? 'variant' : 'details';

    return (
        <div className="race-selector-container">
            {/* Step 1: Race Selection - Always shown */}
            <div className="race-selection-step">
                <h3 className="step-title">
                    Select a Race
                </h3>
                {racesLoading ? (
                    <div className="race-loading">
                        <i className="fas fa-spinner fa-spin"></i>
                        <p>Loading races...</p>
                    </div>
                ) : (
                    <div className="race-grid" ref={raceGridRef}>
                        {races.map(race => (
                            <RaceCard
                                key={race.id}
                                race={race}
                                isSelected={selectedRace === race.id}
                                onSelect={handleRaceSelect}
                            />
                        ))}
                        {visibleRaceCount < allRaces.length && (
                            <div className="loading-more-races">
                                <i className="fas fa-spinner fa-spin"></i>
                                Loading more races...
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Step 2: Variant Selection - Only shown when race is selected */}
            {currentStep === 'variant' && (
                raceData ? (
                <div className="variant-selection-step">
                    <h3 className="step-title">
                        Select a Variant for {raceData.name}
                    </h3>
                    <div className="variant-grid">
                        {Object.entries(raceData.subraces).map(([variantId, variant]) => (
                            <VariantCard
                                key={variantId}
                                variantId={variantId}
                                variant={variant}
                                isSelected={selectedVariant === variantId}
                                onSelect={handleVariantSelect}
                            />
                        ))}
                    </div>
                    <div className="empty-state">
                        <i className="fas fa-hand-pointer"></i>
                        <p>Select a variant to view detailed information</p>
                    </div>
                </div>
                ) : (
                    <div className="race-loading">
                        <i className="fas fa-spinner fa-spin"></i>
                        <p>Loading race details...</p>
                    </div>
                )
            )}

            {/* Step 3: Detailed View - Only shown when variant is selected */}
            {currentStep === 'details' && variantData && raceData && (
                <div className="variant-details-view">
                    <h3 className="step-title">
                        {variantData.name} Details
                    </h3>

                    <div className="details-layout">
                        {/* Left Column: Stats & Basic Info */}
                        <div className="details-left">
                            {/* Stat Block */}
                            <StatModifiersFull statModifiers={variantData.statModifiers} />

                            {/* Base Stats Block */}
                            {(() => {
                                const baseStats = getRacialBaseStats(raceData.id, variantData.id);
                                if (baseStats && Object.keys(baseStats).length > 0) {
                                    return (
                                        <div className="info-block">
                                            <h4 className="info-block-title">BASE STATS</h4>
                                            <div className="info-grid">
                                                {baseStats.armor !== undefined && (
                                                    <div className="info-row info-row-no-bg">
                                                        <span className="info-label">ARMOR:</span>
                                                        <span className="info-value">{baseStats.armor}</span>
                                                    </div>
                                                )}
                                                {baseStats.hp !== undefined && baseStats.hp !== 0 && (
                                                    <div className="info-row info-row-no-bg">
                                                        <span className="info-label">HP:</span>
                                                        <span className="info-value">{baseStats.hp > 0 ? '+' : ''}{baseStats.hp}</span>
                                                    </div>
                                                )}
                                                {baseStats.mana !== undefined && baseStats.mana !== 0 && (
                                                    <div className="info-row info-row-no-bg">
                                                        <span className="info-label">MANA:</span>
                                                        <span className="info-value">{baseStats.mana > 0 ? '+' : ''}{baseStats.mana}</span>
                                                    </div>
                                                )}
                                                {baseStats.ap !== undefined && (
                                                    <div className="info-row info-row-no-bg">
                                                        <span className="info-label">ACTION POINTS:</span>
                                                        <span className="info-value">{baseStats.ap}</span>
                                                    </div>
                                                )}
                                                {baseStats.passivePerception !== undefined && baseStats.passivePerception !== 0 && (
                                                    <div className="info-row info-row-no-bg">
                                                        <span className="info-label">PASSIVE PERCEPTION:</span>
                                                        <span className="info-value">{baseStats.passivePerception > 0 ? '+' : ''}{baseStats.passivePerception}</span>
                                                    </div>
                                                )}
                                                {baseStats.swimSpeed !== undefined && baseStats.swimSpeed !== 0 && (
                                                    <div className="info-row info-row-no-bg">
                                                        <span className="info-label">SWIM SPEED:</span>
                                                        <span className="info-value">{baseStats.swimSpeed > 0 ? '+' : ''}{baseStats.swimSpeed} ft</span>
                                                    </div>
                                                )}
                                                {baseStats.climbSpeed !== undefined && baseStats.climbSpeed !== 0 && (
                                                    <div className="info-row info-row-no-bg">
                                                        <span className="info-label">CLIMB SPEED:</span>
                                                        <span className="info-value">{baseStats.climbSpeed > 0 ? '+' : ''}{baseStats.climbSpeed} ft</span>
                                                    </div>
                                                )}
                                                {baseStats.visionRange !== undefined && baseStats.visionRange !== 60 && (
                                                    <div className="info-row info-row-no-bg">
                                                        <span className="info-label">VISION RANGE:</span>
                                                        <span className="info-value">{baseStats.visionRange} ft</span>
                                                    </div>
                                                )}
                                                {baseStats.darkvision !== undefined && baseStats.darkvision !== 0 && (
                                                    <div className="info-row info-row-no-bg">
                                                        <span className="info-label">DARKVISION:</span>
                                                        <span className="info-value">{baseStats.darkvision} ft</span>
                                                    </div>
                                                )}
                                                {baseStats.initiative !== undefined && baseStats.initiative !== 0 && (
                                                    <div className="info-row info-row-no-bg">
                                                        <span className="info-label">INITIATIVE:</span>
                                                        <span className="info-value">{baseStats.initiative > 0 ? '+' : ''}{baseStats.initiative}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            })()}

                            {/* Saving Throw Modifiers Block */}
                            {(() => {
                                const savingThrowMods = getRacialSavingThrowModifiers(raceData.id, variantData.id);
                                if (savingThrowMods && (savingThrowMods.advantage || savingThrowMods.disadvantage)) {
                                    return (
                                        <div className="info-block">
                                            <h4 className="info-block-title">SAVING THROW MODIFIERS</h4>
                                            <div className="info-grid">
                                                {savingThrowMods.advantage && Array.isArray(savingThrowMods.advantage) && savingThrowMods.advantage.length > 0 && (
                                                    <div className="info-row info-row-full info-row-no-bg">
                                                        <span className="info-label">ADVANTAGE:</span>
                                                        <span className="info-value">{savingThrowMods.advantage.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}</span>
                                                    </div>
                                                )}
                                                {savingThrowMods.disadvantage && Array.isArray(savingThrowMods.disadvantage) && savingThrowMods.disadvantage.length > 0 && (
                                                    <div className="info-row info-row-full info-row-no-bg">
                                                        <span className="info-label">DISADVANTAGE:</span>
                                                        <span className="info-value">{savingThrowMods.disadvantage.map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ')}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    );
                                }
                                return null;
                            })()}

                            {/* Basic Information */}
                            <div className="info-block">
                                <h4 className="info-block-title">BASIC INFORMATION</h4>
                                <div className="info-grid">
                                    <div className="info-row info-row-no-bg">
                                        <span className="info-label">SIZE:</span>
                                        <span className="info-value">{raceData.baseTraits.size}</span>
                                    </div>
                                    <div className="info-row info-row-no-bg">
                                        <span className="info-label">HEIGHT:</span>
                                        <span className="info-value">{raceData.baseTraits.height || 'MISSING'}</span>
                                    </div>
                                    <div className="info-row info-row-no-bg">
                                        <span className="info-label">WEIGHT:</span>
                                        <span className="info-value">{raceData.baseTraits.weight || 'MISSING'}</span>
                                    </div>
                                    <div className="info-row info-row-no-bg">
                                        <span className="info-label">BUILD:</span>
                                        <span className="info-value">{raceData.baseTraits.build || 'MISSING'}</span>
                                    </div>
                                    <div className="info-row info-row-no-bg">
                                        <span className="info-label">SPEED:</span>
                                        <span className="info-value">{raceData.baseTraits.baseSpeed} ft</span>
                                    </div>
                                    <div className="info-row info-row-no-bg">
                                        <span className="info-label">LIFESPAN:</span>
                                        <span className="info-value">{raceData.baseTraits.lifespan}</span>
                                    </div>
                                    <div className="info-row info-row-full info-row-no-bg">
                                        <span className="info-label">LANGUAGES:</span>
                                        <span className="info-value">{raceData.baseTraits.languages.join(', ')}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Traits */}
                        <div className="details-right">
                            <div className="traits-block">
                                <h4 className="traits-block-title">Racial Traits</h4>
                                <div className="traits-icons">
                                    {variantData.traits.map((trait, index) => (
                                        <TraitIcon
                                            key={`${trait.name}-${index}`}
                                            trait={trait}
                                            isSelected={selectedTrait && selectedTrait.id === trait.id}
                                            onTraitClick={handleTraitClick}
                                        />
                                    ))}
                                </div>
                                {selectedTrait && (
                                    isPassiveStatModifier(selectedTrait) ? (
                                        <div className="passive-display">
                                            <div className="passive-summary-item">
                                                <div className="passive-summary-icon-wrapper">
                                                    <img
                                                        src={getIconUrl(selectedTrait.icon || 'spell_holy_devotion', 'abilities')}
                                                        alt={selectedTrait.name}
                                                        className="passive-summary-icon"
                                                        onError={(e) => e.target.src = getIconUrl('ui_icon_questionmark', 'ui')}
                                                    />
                                                </div>
                                                <div className="passive-summary-details">
                                                    <div className="passive-summary-name">{selectedTrait.name}</div>
                                                    <div className="passive-summary-description">{getPassiveSummary(selectedTrait)}</div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <UnifiedSpellCard
                                            spell={transformTraitToSpell(selectedTrait)}
                                            variant="rules"
                                            showDescription={true}
                                        />
                                    )
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Cultural Background */}
                    {raceData.culturalBackground && (
                        <div className="cultural-section">
                            <h4 className="cultural-title">
                                <i className="fas fa-book"></i> Cultural Background
                            </h4>
                            <p className="cultural-text">{raceData.culturalBackground}</p>
                        </div>
                    )}

                     {/* Integration Notes */}
                    {raceData.integrationNotes && (
                        <div className="integration-section">
                            <h4 className="integration-title">
                                <i className="fas fa-link"></i> Integration with Game Systems
                            </h4>
                            <div className="integration-grid">
                                {raceData.integrationNotes.actionPointSystem && (
                                    <div className="integration-card">
                                        <h5>Action Points</h5>
                                        <p>{raceData.integrationNotes.actionPointSystem}</p>
                                    </div>
                                )}
                                {raceData.integrationNotes.backgroundSynergy && (
                                    <div className="integration-card">
                                        <h5>Background Synergy</h5>
                                        <p>{raceData.integrationNotes.backgroundSynergy}</p>
                                    </div>
                                )}
                                {raceData.integrationNotes.classCompatibility && (
                                    <div className="integration-card">
                                        <h5>Class Compatibility</h5>
                                        <p>{raceData.integrationNotes.classCompatibility}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Epic Lore Button */}
                    {variantData && raceData.epicHistory && (
                        <div className="epic-lore-trigger">
                            <button 
                                className="epic-lore-button"
                                onClick={() => setShowEpicLore(true)}
                            >
                                <i className="fas fa-book-open"></i>
                                View Epic Lore
                            </button>
                        </div>
                    )}
                </div>
            )}

             {/* Initial Empty State */}
            {currentStep === 'race' && (
                <div className="empty-state">
                    <i className="fas fa-hand-pointer"></i>
                    <p>Select a race above to view variants and details</p>
                </div>
            )}

            {/* Epic Lore Modal/Overlay */}
            {showEpicLore && raceData && (
                <div className="epic-lore-overlay">
                    <RaceEpicLore
                        raceData={raceData}
                        availableTabs={['history', 'figures', 'locations', 'crisis', 'practices']}
                        onClose={() => setShowEpicLore(false)}
                    />
                </div>
            )}

        </div>
    );
};

export default RaceSelector;

