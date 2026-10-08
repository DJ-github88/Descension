import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import SpellTooltip from '../spellcrafting-wizard/components/common/SpellTooltip';
import { isPassiveStatModifier } from '../../utils/raceDisciplineSpellUtils';
import { getRacialBaseStats, getRacialSavingThrowModifiers, formatSavingThrowModifier, getFullRaceData } from '../../data/raceData';
import { getIconUrl } from '../../utils/assetManager';
import RaceEpicLore from './RaceEpicLore';
import LoreLink from '../common/LoreLink';
import { autoLinkTerminology } from '../../utils/loreAutoLinker';
import { HERITAGE_TRADITIONS } from '../../data/classHeritageRegistry';
import { BACKGROUND_DATA } from '../../data/backgroundData';

import './RaceSelector.css';

const PUB = process.env.PUBLIC_URL || '';

const RACE_WATERCOLOR = {
  myrathil: 'watercolor_compass',
  mimir: 'watercolor_void',
  florae: 'watercolor_tree',
  groven: 'watercolor_shield',
  solari: 'watercolor_campfire',
  vreken: 'watercolor_candle',
  neth: 'watercolor_scales',
  astril: 'watercolor_crystal',
  fexrick: 'watercolor_anvil',
  human: 'watercolor_map'
};

// Parses lore text to render recognised dictionary terms as interactive LoreLink popups
const renderLoreText = (text) => {
  if (!text || typeof text !== 'string') return text;
  const processed = autoLinkTerminology(text);
  const regex = /(<LoreLink termId="([^"]+)">([\s\S]*?)<\/LoreLink>)/g;
  const result = [];
  let lastIndex = 0;
  let match;
  let key = 0;
  while ((match = regex.exec(processed)) !== null) {
    if (match.index > lastIndex) result.push(processed.substring(lastIndex, match.index));
    result.push(
      <LoreLink key={`lore-${key++}`} termId={match[2]}>{match[3]}</LoreLink>
    );
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < processed.length) result.push(processed.substring(lastIndex));
  return result.length > 0 ? result : text;
};

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
      cardFlavor: race.cardFlavor,
      essence: race.essence,
      gradient: race.gradient,
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
        elementType: trait.damageType || 'smashing',
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
          'physical': 'smashing'
        };

        Object.entries(typeMap).forEach(([key, value]) => {
          if (lowerDesc.includes(key)) {
            damageTypes.push(value);
          }
        });

        return damageTypes.length > 0 ? damageTypes : ['smashing'];
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
        elementType: 'smashing',
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
      spell.tags.push('spiritual', 'sacred');
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
const RaceCard = React.memo(({ race, isSelected, onSelect }) => {
  const displayText = race.cardFlavor || race.description;
  const truncatedDesc = displayText
    ? displayText.length > 220
      ? displayText.substring(0, 220).trim() + '...'
      : displayText
    : null;

  return (
    <button
      type="button"
      className={`race-card race-card-${race.id} ${isSelected ? 'selected' : ''}`}
      onClick={() => onSelect(race.id)}
      aria-pressed={isSelected}
      aria-label={`Select ${race.name}`}
      style={{ '--race-gradient': race.gradient }}
    >
        <span className="race-card-bg-effects" aria-hidden="true"></span>
        <span className="race-card-fx" aria-hidden="true"></span>
        {RACE_WATERCOLOR[race.id] && (
          <img
            className="race-card-watermark"
            src={`${PUB}/assets/images/${RACE_WATERCOLOR[race.id]}.png`}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            onError={(e) => { e.target.style.display = 'none'; }}
          />
        )}
        <span className="race-card-header">
          <span className="race-card-icon" aria-hidden="true">
            <i className={race.icon}></i>
          </span>
          <span className="race-card-title-area">
            <span className="race-card-name">{race.name}</span>
            {race.essence && <span className="race-card-essence">{race.essence}</span>}
          </span>
        </span>
        {truncatedDesc && (
          <span className="race-card-description">{truncatedDesc}</span>
        )}
        <span className="race-card-info">
          <span className="info-badge">
            <i className="fas fa-users" aria-hidden="true"></i>
            {race.variantCount} {race.variantCount === 1 ? 'Variant' : 'Variants'}
          </span>
        </span>
    </button>
  );
});

// Crest-led rows keep variants comparable without turning the page into a card wall.
const VariantCard = React.memo(({ variantId, variant, onSelect }) => {
  return (
    <button
      type="button"
      className="race-variant-option"
      onClick={() => onSelect(variantId)}
      aria-label={`View ${variant.name} variant details`}
    >
      <span className="race-variant-emblem" aria-hidden="true">
        {variant.crest ? <img src={variant.crest} alt="" /> : <i className="fas fa-shield-alt"></i>}
      </span>
      <span className="race-variant-copy">
        <span className="race-variant-name">{variant.name}</span>
        <span className="race-variant-description">{variant.tooltipSummary || (variant.description?.length > 160 ? variant.description.substring(0, 160).trim() + '...' : variant.description)}</span>
        {variant.statModifiers && Object.keys(variant.statModifiers).length > 0 && (
          <StatModifiersMini statModifiers={variant.statModifiers} />
        )}
      </span>
      <span className="race-variant-open" aria-hidden="true">
        <i className="fas fa-arrow-right"></i>
      </span>
    </button>
  );
});

// Memoized Stat Modifiers Mini Component
const StatModifiersMini = React.memo(({ statModifiers }) => (
  <span className="race-variant-modifiers">
    {Object.entries(statModifiers).map(([stat, modifier]) => {
      if (modifier === 0) return null;
      return (
        <span key={stat} className={`race-variant-modifier ${modifier > 0 ? 'positive' : 'negative'}`}>
          <span>{stat.substring(0, 3).toUpperCase()}</span> <strong>{modifier > 0 ? '+' : ''}{modifier}</strong>
        </span>
      );
    })}
  </span>
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
    let mag;
    if (mod.magnitudeType === 'dice' && mod.formula) {
      mag = mod.formula;
    } else if (mod.magnitudeType === 'percentage') {
      mag = `${mod.magnitude}%`;
    } else {
      mag = `${mod.magnitude > 0 ? '+' : ''}${mod.magnitude}`;
    }
    return `${stat} ${mag}`;
  };

  const getEffectLabel = (effect = {}) => {
    if (effect.statModifier) return formatStatMod(effect.statModifier);
    if (effect.mechanicsText) return effect.mechanicsText.replace(/\.$/, '');
    if (effect.statusEffect?.description) return effect.statusEffect.description.replace(/\.$/, '');
    return effect.name || effect.statusEffect?.type || 'Status effect';
  };

  // Group benefits and drawbacks separately for clarity
  const benefits = [];
  const drawbacks = [];

  // Process buff effects
  if (trait.buffConfig?.effects) {
    trait.buffConfig.effects.forEach(effect => {
      if (effect.statModifier || effect.statusEffect) {
        benefits.push(getEffectLabel(effect));
      }
    });
  }

  // Process debuff effects
  if (trait.debuffConfig?.effects) {
    trait.debuffConfig.effects.forEach(effect => {
      if (effect.statModifier || effect.statusEffect) {
        drawbacks.push(getEffectLabel(effect));
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
    benefits.push(`Regenerates ${formula}${intervalText}${durationText}`.trim());
  }

  // Add benefits (grouped together)
  if (benefits.length > 0) {
    parts.push('Benefit: ' + benefits.join(', ') + (conditionText ? ` ${conditionText}` : '') + '.');
  }

  // Add drawbacks
  if (drawbacks.length > 0) {
    parts.push('Drawback: ' + drawbacks.join(', ') + '.');
  }

  return parts.length ? parts.join(' ') : 'No description available';
};

// Memoized Trait Icon Component
const TraitIcon = React.memo(({ trait, isSelected, onTraitClick }) => (
  <button
    type="button"
    className={`trait-icon-item ${isSelected ? 'selected' : ''}`}
    onClick={(e) => onTraitClick(trait, e)}
    aria-label={trait.name}
    aria-pressed={Boolean(isSelected)}
    title={trait.name}
  >
    {trait.icon && (
      <img
        src={getIconUrl(trait.icon, 'abilities')}
        alt={trait.name}
        className="trait-icon"
        onError={(e) => {
          e.target.src = getIconUrl('Arcane/Abstract Rune', 'abilities');
        }}
      />
    )}
  </button>
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
  const [descriptionExpanded, setDescriptionExpanded] = useState(true);
  const [customIllustration, setCustomIllustration] = useState(null);
  const [subraceImageIndex, setSubraceImageIndex] = useState(0);
  const [traitTooltip, setTraitTooltip] = useState({ show: false, spell: null, x: 0, y: 0 });
  const [imageErrors, setImageErrors] = useState({});
  const [lightboxImage, setLightboxImage] = useState(null);
  const raceGridRef = useRef(null);

  // Close lightbox on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setLightboxImage(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Reset subrace image index when the selection changes
  useEffect(() => {
    setSubraceImageIndex(0);
  }, [selectedVariant, selectedRace]);

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

  // Native classes + available backgrounds for the selected subrace (shown inline).
  // (class callings & backgrounds panel)
  const callingsAndBackgrounds = useMemo(() => {
    const heritageId = variantData?.id || selectedVariant;
    const heritage = heritageId ? HERITAGE_TRADITIONS[heritageId] : null;
    const classes = heritage ? heritage.classes : [];
    const all = Object.values(BACKGROUND_DATA);
    const backgrounds = heritageId
      ? all.filter(bg => (bg.restrictions?.allowedSubraces || []).includes(heritageId)).map(bg => bg.name)
      : [];
    const universal = all.filter(bg => !(bg.restrictions?.allowedSubraces || []).length).map(bg => bg.name);
    return { classes, backgrounds, universal };
  }, [selectedVariant, variantData]);

  // Memoize subrace images list to support multiple illustrations
  const subraceImages = useMemo(() => {
    if (!variantData) return [];
    if (variantData.illustrations && Array.isArray(variantData.illustrations)) {
      return variantData.illustrations;
    }
    const images = [];
    if (variantData.illustration) {
      images.push({
        src: variantData.illustration,
        caption: variantData.illustrationCaption || variantData.name
      });
    }
    if (variantData.illustration2) {
      images.push({
        src: variantData.illustration2,
        caption: variantData.illustration2Caption || variantData.name
      });
    }
    if (variantData.cultureIllustration) {
      images.push({
        src: variantData.cultureIllustration,
        caption: variantData.cultureIllustrationCaption || variantData.name
      });
    }
    if (variantData.domesticIllustration) {
      images.push({
        src: variantData.domesticIllustration,
        caption: variantData.domesticIllustrationCaption || variantData.name
      });
    }
    return images;
  }, [variantData]);


  // Helper to gather all unique illustrations for cycling
  const gatherIllustrations = useCallback(() => {
    if (!raceData) return [];
    const images = [];
    // Always include the base race illustration as the general image option
    if (raceData.illustration) {
      images.push({
        src: raceData.illustration,
        name: raceData.name,
        caption: raceData.illustrationCaption || raceData.name
      });
    }
    if (raceData.subraces) {
      Object.values(raceData.subraces).forEach(sub => {
        if (sub.illustration) {
          if (!images.some(img => img.src === sub.illustration)) {
            images.push({
              src: sub.illustration,
              name: sub.name,
              caption: sub.illustrationCaption || sub.name
            });
          }
        }
      });
    }
    return images;
  }, [raceData]);

  // Keep gallery order stable and skip unavailable artwork.
  const handleIllustrationClick = useCallback((direction) => {
    if (!raceData) return;
    const allImages = gatherIllustrations().filter(image => !imageErrors[image.src]);
    if (allImages.length <= 1) return;

    const currentIndex = Math.max(0, allImages.findIndex(image => image.src === customIllustration?.src));
    setCustomIllustration(allImages[(currentIndex + direction + allImages.length) % allImages.length]);
  }, [raceData, customIllustration, gatherIllustrations, imageErrors]);

  const handleRaceSelect = useCallback((raceId) => {
    setSelectedRace(raceId);
    setSelectedVariant(null);
    setCustomIllustration(null); // Reset when active race changes

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

  // Effect to close trait tooltip when clicking outside
  useEffect(() => {
    if (!traitTooltip.show) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest('.trait-icon-item') && !e.target.closest('.spell-tooltip-container')) {
        setTraitTooltip({ show: false, spell: null, x: 0, y: 0 });
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [traitTooltip.show]);

  const handleVariantSelect = (variantId) => {
    setSelectedVariant(variantId);
    setSelectedTrait(null);
    setTraitTooltip({ show: false, spell: null, x: 0, y: 0 });
    setDescriptionExpanded(false);
  };

  const handleTraitClick = (trait, event) => {
    if (isPassiveStatModifier(trait)) {
      setSelectedTrait(prev => prev?.id === trait.id ? null : trait);
      setTraitTooltip({ show: false, spell: null, x: 0, y: 0 });
      return;
    }
    const spell = transformTraitToSpell(trait);
    const rect = event?.currentTarget?.getBoundingClientRect();
    if (rect) {
      setTraitTooltip({
        show: true,
        spell: spell,
        x: rect.left + rect.width / 2,
        y: rect.top
      });
    } else {
      setTraitTooltip({ show: true, spell, x: 0, y: 0 });
    }
  };

  const handleTraitTooltipClose = () => {
    setTraitTooltip({ show: false, spell: null, x: 0, y: 0 });
  };

  // Determine current step for conditional rendering
  const currentStep = !selectedRace ? 'race' : !selectedVariant ? 'variant' : 'details';
  const raceIllustrations = gatherIllustrations().filter(image => !imageErrors[image.src]);
  const overviewImageIndex = Math.max(0, raceIllustrations.findIndex(image => image.src === customIllustration?.src));
  const overviewImage = raceIllustrations[overviewImageIndex];
  const overviewIllustration = overviewImage?.src;
  const overviewIllustrationCaption = overviewImage?.caption;

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

      {/* Step 2: Race Info + Variant Selection */}
      {currentStep === 'variant' && (
        raceData ? (
          <div className="variant-selection-step">
            {/* Race Info Panel */}
            <div className="race-info-panel" key={selectedRace}>
              <div className="race-info-header">
                <div className="race-info-title-row">
                  <div className="race-info-title-area">
                    <h3 className="race-info-name">{raceData.name}</h3>
                    {raceData.essence && <p className="race-info-essence">{raceData.essence}</p>}
                  </div>
                  {raceData.epicHistory && (
                    <button
                      type="button"
                      className="epic-lore-button"
                      onClick={() => setShowEpicLore(true)}
                    >
                      <i className="fas fa-book-open"></i>
                      Lore
                    </button>
                  )}
                </div>
                {raceData.cardFlavor && <p className="race-info-intro">{renderLoreText(raceData.cardFlavor)}</p>}
              </div>

              <div className="race-info-layout">
                <div className="race-selection-content">
                  <section className="race-variant-options" aria-labelledby="race-variant-heading">
                    <div className="race-variant-heading">
                      <h3 className="step-title" id="race-variant-heading">Choose a Variant</h3>
                      <span className="race-variant-count">
                        {Object.keys(raceData.subraces).length} {Object.keys(raceData.subraces).length === 1 ? 'variant' : 'variants'}
                      </span>
                    </div>
                    <p className="race-selection-hint">Compare their strengths, then explore the full traits and callings.</p>
                    <div className="race-variant-list">
                      {Object.entries(raceData.subraces).map(([variantId, variant]) => (
                        <VariantCard
                          key={variantId}
                          variantId={variantId}
                          variant={variant}
                          onSelect={handleVariantSelect}
                        />
                      ))}
                    </div>
                  </section>

                  <div className="race-reading-sections">
                    {[
                      { title: `About ${raceData.name}`, text: raceData.overview },
                      { title: 'Variant overview', text: raceData.variantDiversity },
                      { title: 'Appearance', text: raceData.visualDescription }
                    ].filter(section => section.text).map(section => (
                      <details className="race-reading-section" key={section.title}>
                        <summary>{section.title}<i className="fas fa-chevron-down" aria-hidden="true"></i></summary>
                        <div className="race-reading-text">
                          {section.text.split(/\n\s*\n/).map((paragraph, index) => (
                            <p key={index}>{renderLoreText(paragraph)}</p>
                          ))}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>

                <aside className="race-selection-sidebar" aria-label={`${raceData.name} portrait and shared traits`}>
                  {overviewIllustration && (
                    <figure className="race-selection-artwork">
                      <button
                        type="button"
                        className="guide-illustration-frame interactive-illustration"
                        aria-label={`Enlarge ${raceData.name} illustration`}
                        onClick={() => setLightboxImage({
                          src: overviewIllustration,
                          caption: overviewIllustrationCaption,
                          images: raceIllustrations,
                          index: overviewImageIndex
                        })}
                      >
                        <img
                          src={overviewIllustration}
                          alt={overviewIllustrationCaption}
                          className="guide-illustration-image"
                          onError={() => setImageErrors(prev => ({ ...prev, [overviewIllustration]: true }))}
                        />
                        <span className="race-artwork-enlarge">
                          <i className="fas fa-search-plus" aria-hidden="true"></i> Enlarge
                        </span>
                      </button>
                      <figcaption className="race-artwork-toolbar">
                        <span className="race-artwork-caption" aria-live="polite">
                          {overviewImage.name}
                          <span>{overviewImageIndex + 1} / {raceIllustrations.length}</span>
                        </span>
                        {raceIllustrations.length > 1 && (
                          <span className="race-artwork-navigation">
                            <button type="button" aria-label="Previous race artwork" onClick={() => handleIllustrationClick(-1)}>
                              <i className="fas fa-chevron-left" aria-hidden="true"></i>
                            </button>
                            <button type="button" aria-label="Next race artwork" onClick={() => handleIllustrationClick(1)}>
                              <i className="fas fa-chevron-right" aria-hidden="true"></i>
                            </button>
                          </span>
                        )}
                      </figcaption>
                    </figure>
                  )}

                  <div className="race-shared-traits">
                    <h4 className="content-section-title">At a Glance</h4>
                    <dl className="race-base-traits-compact">
                      <div className="base-trait-chip">
                        <dt><i className="fas fa-ruler-vertical" aria-hidden="true"></i> Size</dt>
                        <dd>{raceData.baseTraits.size}</dd>
                      </div>
                      <div className="base-trait-chip">
                        <dt><i className="fas fa-shoe-prints" aria-hidden="true"></i> Speed</dt>
                        <dd>{raceData.baseTraits.baseSpeed} ft</dd>
                      </div>
                      <div className="base-trait-chip">
                        <dt><i className="fas fa-hourglass-half" aria-hidden="true"></i> Lifespan</dt>
                        <dd>{raceData.baseTraits.lifespan}</dd>
                      </div>
                      <div className="base-trait-chip">
                        <dt><i className="fas fa-globe" aria-hidden="true"></i> Languages</dt>
                        <dd>{raceData.baseTraits.languages.join(', ')}</dd>
                      </div>
                    </dl>
                  </div>
                </aside>
              </div>
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
          <div className="variant-details-header">
            <div className="variant-details-identity">
              {variantData.crest && (
                <img src={variantData.crest} alt="" className="variant-details-crest-hero" />
              )}
              <div>
                <h3 className="variant-details-title">{variantData.name} Details</h3>
                <p className="variant-details-race">{raceData.name}{raceData.essence && ` · ${raceData.essence}`}</p>
              </div>
            </div>
            <div className="variant-details-actions">
              <button
                type="button"
                className="variant-back-button"
                onClick={() => handleVariantSelect(null)}
              >
                <i className="fas fa-arrow-left" aria-hidden="true"></i> All variants
              </button>
              {(raceData.epicHistory || raceData.description || raceData.overview) && (
                <button
                  type="button"
                  className="epic-lore-button"
                  onClick={() => setShowEpicLore(true)}
                >
                  <i className="fas fa-book-open" aria-hidden="true"></i> Lore
                </button>
              )}
            </div>
          </div>

          {/* Quick-Switch Subrace/Variant Bar */}
          {raceData.subraces && Object.keys(raceData.subraces).length > 1 && (
            <div className="variant-details-switcher">
              <span className="switcher-label">
                <i className="fas fa-exchange-alt"></i> Variants of {raceData.name}:
              </span>
              <div className="switcher-buttons">
                {Object.entries(raceData.subraces).map(([variantId, variant]) => {
                  const isSelected = selectedVariant === variantId;
                  return (
                    <button
                      key={variantId}
                      type="button"
                      className={`switcher-btn ${isSelected ? 'active' : ''}`}
                      aria-pressed={isSelected}
                      onClick={() => handleVariantSelect(variantId)}
                    >
                      {variant.crest && (
                        <img src={variant.crest} alt="" className="switcher-btn-crest" />
                      )}
                      <span className="switcher-btn-label">
                        <span className="variant-name">{variant.name}</span>
                        {variant.statModifiers && Object.keys(variant.statModifiers).length > 0 && (
                          <span className="variant-stats">
                            {Object.entries(variant.statModifiers)
                              .filter(([_, mod]) => mod !== 0)
                              .map(([stat, mod]) => `${stat.slice(0, 3).toUpperCase()} ${mod > 0 ? '+' : ''}${mod}`)
                              .join(' · ')}
                          </span>
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ===== MAIN BODY: Sidebar (illus+stats) + Content flow ===== */}
          <div className="details-body">

            {/* LEFT SIDEBAR: Illustration + Stats */}
            <aside className="details-sidebar">
              {(subraceImages.length > 0 || raceData.illustration) && !imageErrors[subraceImages.length > 0 ? subraceImages[subraceImageIndex]?.src : raceData.illustration] && (
                <div className="sidebar-illustration">
                  <div className="guide-illustration-frame">
                    <button
                      type="button"
                      className="race-detail-artwork"
                      onClick={() => {
                        const currentSrc = subraceImages.length > 0 ? subraceImages[subraceImageIndex]?.src : raceData.illustration;
                        const currentCaption = subraceImages.length > 0 ? (subraceImages[subraceImageIndex]?.caption || variantData?.name) : (raceData.illustrationCaption || raceData.name);
                        setLightboxImage({
                          src: currentSrc,
                          caption: currentCaption,
                          images: subraceImages.length > 0 ? subraceImages : [{ src: raceData.illustration, caption: raceData.illustrationCaption }],
                          index: subraceImages.length > 0 ? subraceImageIndex : 0
                        });
                      }}
                      aria-label={`Enlarge ${variantData.name} illustration`}
                    >
                      <img
                        src={subraceImages.length > 0 ? subraceImages[subraceImageIndex]?.src : raceData.illustration}
                        alt={subraceImages.length > 0 ? (subraceImages[subraceImageIndex]?.caption || variantData.name) : (raceData.illustrationCaption || raceData.name)}
                        className="guide-illustration-image"
                        onError={() => {
                          const src = subraceImages.length > 0 ? subraceImages[subraceImageIndex]?.src : raceData.illustration;
                          setImageErrors(prev => ({ ...prev, [src]: true }));
                        }}
                      />
                      <span className="race-artwork-enlarge">
                        <i className="fas fa-search-plus" aria-hidden="true"></i> {subraceImages.length > 1 ? `Image ${subraceImageIndex + 1}/${subraceImages.length} · Enlarge` : 'Enlarge'}
                      </span>
                    </button>
                    {subraceImages.length > 1 && (
                      <>
                        <button
                          type="button"
                          className="illustration-nav-btn prev"
                          onClick={() => setSubraceImageIndex(prev => (prev - 1 + subraceImages.length) % subraceImages.length)}
                          aria-label="Previous image"
                        >
                          <i className="fas fa-chevron-left" aria-hidden="true"></i>
                        </button>
                        <button
                          type="button"
                          className="illustration-nav-btn next"
                          onClick={() => setSubraceImageIndex(prev => (prev + 1) % subraceImages.length)}
                          aria-label="Next image"
                        >
                          <i className="fas fa-chevron-right" aria-hidden="true"></i>
                        </button>
                      </>
                    )}
                    {((subraceImages.length > 0 ? subraceImages[subraceImageIndex]?.caption : raceData.illustrationCaption)) && (
                      <div className="guide-illustration-caption">
                        {subraceImages.length > 0 ? subraceImages[subraceImageIndex]?.caption : raceData.illustrationCaption}
                      </div>
                    )}
                  </div>
                  {subraceImages.length > 1 && (
                    <div className="illustration-dots">
                      {subraceImages.map((_, idx) => (
                        <button
                          type="button"
                          key={idx} 
                          className={`illustration-dot ${idx === subraceImageIndex ? 'active' : ''}`}
                          aria-label={`View artwork ${idx + 1}`}
                          aria-pressed={idx === subraceImageIndex}
                          onClick={() => setSubraceImageIndex(idx)}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )}

              <StatModifiersFull statModifiers={variantData.statModifiers} />

              {(() => {
                const baseStats = getRacialBaseStats(raceData.id, variantData.id);
                if (baseStats && Object.keys(baseStats).length > 0) {
                  return (
                    <div className="info-block">
                      <h4 className="info-block-title">BASE STATS</h4>
                      <div className="info-grid">
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
                            <span className="info-label">PASSIVE PERC.:</span>
                            <span className="info-value">{baseStats.passivePerception > 0 ? '+' : ''}{baseStats.passivePerception}</span>
                          </div>
                        )}
                        {baseStats.swimSpeed !== undefined && baseStats.swimSpeed !== 0 && (
                          <div className="info-row info-row-no-bg">
                            <span className="info-label">SWIM:</span>
                            <span className="info-value">{baseStats.swimSpeed > 0 ? '+' : ''}{baseStats.swimSpeed} ft</span>
                          </div>
                        )}
                        {baseStats.climbSpeed !== undefined && baseStats.climbSpeed !== 0 && (
                          <div className="info-row info-row-no-bg">
                            <span className="info-label">CLIMB:</span>
                            <span className="info-value">{baseStats.climbSpeed > 0 ? '+' : ''}{baseStats.climbSpeed} ft</span>
                          </div>
                        )}
                        {baseStats.visionRange !== undefined && baseStats.visionRange !== 60 && (
                          <div className="info-row info-row-no-bg">
                            <span className="info-label">VISION:</span>
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

              {(() => {
                const savingThrowMods = getRacialSavingThrowModifiers(raceData.id, variantData.id);
                if (savingThrowMods && (savingThrowMods.advantage || savingThrowMods.disadvantage)) {
                  return (
                    <div className="info-block">
                      <h4 className="info-block-title">SAVE MODIFIERS</h4>
                      <div className="info-grid">
                        {savingThrowMods.advantage && Array.isArray(savingThrowMods.advantage) && savingThrowMods.advantage.length > 0 && (
                          <div className="info-row info-row-full info-row-no-bg">
                            <span className="info-label">ADVANTAGE:</span>
                            <span className="info-value">{savingThrowMods.advantage.map(formatSavingThrowModifier).join(', ')}</span>
                          </div>
                        )}
                        {savingThrowMods.disadvantage && Array.isArray(savingThrowMods.disadvantage) && savingThrowMods.disadvantage.length > 0 && (
                          <div className="info-row info-row-full info-row-no-bg">
                            <span className="info-label">DISADV.:</span>
                            <span className="info-value">{savingThrowMods.disadvantage.map(formatSavingThrowModifier).join(', ')}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                }
                return null;
              })()}

              {(() => {
                if (!raceData.baseTraits) return null;
                const displayedTraits = (() => {
                  const full = (selectedRace && selectedVariant) ? getFullRaceData(selectedRace, selectedVariant) : null;
                  const ct = full?.combinedTraits || {};
                  return {
                    ...raceData.baseTraits,
                    ...(variantData?.baseTraits || {}),
                    ...ct,
                    // combinedTraits exposes `speed`; the sidebar expects `baseSpeed`.
                    baseSpeed: ct.speed ?? variantData?.speed ?? raceData.baseTraits?.baseSpeed,
                    languages: ct.languages || variantData?.languages || raceData.baseTraits?.languages
                  };
                })();
                return (
                <div className="sidebar-physical">
                  {displayedTraits.size && <div className="sidebar-stat-row"><span>Size</span><strong>{displayedTraits.size}</strong></div>}
                  {displayedTraits.height && <div className="sidebar-stat-row"><span>Height</span><strong>{displayedTraits.height}</strong></div>}
                  {displayedTraits.weight && <div className="sidebar-stat-row"><span>Weight</span><strong>{displayedTraits.weight}</strong></div>}
                  {displayedTraits.baseSpeed && <div className="sidebar-stat-row"><span>Speed</span><strong>{displayedTraits.baseSpeed} ft</strong></div>}
                  {displayedTraits.lifespan && <div className="sidebar-stat-row"><span>Lifespan</span><strong>{displayedTraits.lifespan}</strong></div>}
                  {displayedTraits.languages && <div className="sidebar-stat-row sidebar-stat-row-full"><span>Languages</span><strong>{displayedTraits.languages.join(', ')}</strong></div>}
                </div>
                );
              })()}
            </aside>

            {/* RIGHT CONTENT: Subrace + Appearance + Traits + Lore */}
            <div className="details-content">

              {variantData?.description && (() => {
                const fullText = variantData.description;
                // Split on sentence boundary — show first 2 sentences as the intro
                const sentenceEnd = (() => {
                  let count = 0;
                  for (let i = 0; i < fullText.length; i++) {
                    if (fullText[i] === '.' && fullText[i + 1] === ' ') {
                      count++;
                      if (count === 2) return i + 1;
                    }
                  }
                  return fullText.length;
                })();
                const intro = fullText.slice(0, sentenceEnd).trim();
                const remainder = fullText.slice(sentenceEnd).trim();
                const hasMore = remainder.length > 0;
                return (
                  <div className="content-section">
                    <h4 className="content-section-title">
                      <i className="fas fa-dna"></i> {variantData.name}
                    </h4>
                    <p className="content-section-text description-intro">{renderLoreText(intro)}</p>
                    {hasMore && descriptionExpanded && (
                      <p className="content-section-text description-remainder">{renderLoreText(remainder)}</p>
                    )}
                    {hasMore && (
                      <button
                        type="button"
                        className="description-expand-toggle"
                        aria-expanded={descriptionExpanded}
                        onClick={() => setDescriptionExpanded(prev => !prev)}
                      >
                        {descriptionExpanded ? '▲ Show less' : '▼ Read more'}
                      </button>
                    )}
                  </div>
                );
              })()}

              {(variantData.visualDescription || raceData.visualDescription) && (
                <div className="content-section">
                  <h4 className="content-section-title">
                    <i className="fas fa-eye"></i> Appearance
                  </h4>
                  <p className="content-section-text">{renderLoreText(variantData.visualDescription || raceData.visualDescription)}</p>
                </div>
              )}

              {(variantData.culturalBackground || raceData.culturalBackground) && (
                <div className="content-section content-section--culture">
                  <h4 className="content-section-title">
                    <i className="fas fa-users"></i> Culture
                  </h4>
                  <p className="content-section-text">{renderLoreText(variantData.culturalBackground || raceData.culturalBackground)}</p>
                </div>
              )}

              {selectedVariant && (callingsAndBackgrounds.classes.length > 0 || callingsAndBackgrounds.backgrounds.length > 0) && (
                <div className="content-section content-section--callings">
                  <h4 className="content-section-title">
                    <i className="fas fa-hat-wizard"></i> Callings &amp; Backgrounds
                  </h4>
                  {callingsAndBackgrounds.classes.length > 0 && (
                    <p className="content-section-text">
                      <strong>Native Classes:</strong> {callingsAndBackgrounds.classes.join(', ')}
                    </p>
                  )}
                  {callingsAndBackgrounds.backgrounds.length > 0 && (
                    <p className="content-section-text">
                      <strong>Backgrounds:</strong> {callingsAndBackgrounds.backgrounds.join(', ')}
                      {callingsAndBackgrounds.universal.length > 0 ? ` · open to all: ${callingsAndBackgrounds.universal.join(', ')}` : ''}
                    </p>
                  )}
                </div>
              )}

              <div className="content-section">
                <h4 className="content-section-title">
                  <i className="fas fa-star"></i> Racial Traits
                </h4>
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
                {selectedTrait && isPassiveStatModifier(selectedTrait) && (
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
                )}
              </div>


            </div>
          </div>

          {traitTooltip.show && traitTooltip.spell && (
            <SpellTooltip
              spell={traitTooltip.spell}
              fullscreenMode={true}
              onMouseEnter={() => {}}
              onMouseLeave={handleTraitTooltipClose}
            />
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
            subraceId={variantData?.id || selectedVariant}
            availableTabs={['history', 'figures', 'locations', 'crisis', 'practices', 'culture']}
            onClose={() => setShowEpicLore(false)}
          />
        </div>
      )}

      {/* Enlarged Artwork Lightbox Modal */}
      {lightboxImage && (
        <div className="race-lightbox-overlay" onClick={() => setLightboxImage(null)}>
          <div className="race-lightbox-modal" onClick={e => e.stopPropagation()}>
            <button className="race-lightbox-close" onClick={() => setLightboxImage(null)} title="Close (Esc)">
              <i className="fas fa-times"></i>
            </button>
            <div className="race-lightbox-content">
              {lightboxImage.images && lightboxImage.images.length > 1 && (
                <button 
                  className="race-lightbox-nav prev"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newIdx = (lightboxImage.index - 1 + lightboxImage.images.length) % lightboxImage.images.length;
                    setLightboxImage({
                      ...lightboxImage,
                      index: newIdx,
                      src: lightboxImage.images[newIdx].src,
                      caption: lightboxImage.images[newIdx].caption
                    });
                    if (selectedVariant) setSubraceImageIndex(newIdx);
                  }}
                  aria-label="Previous image"
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
              )}
              <img 
                src={lightboxImage.src} 
                alt={lightboxImage.caption || 'Enlarged Race Illustration'} 
                className="race-lightbox-image" 
              />
              {lightboxImage.images && lightboxImage.images.length > 1 && (
                <button 
                  className="race-lightbox-nav next"
                  onClick={(e) => {
                    e.stopPropagation();
                    const newIdx = (lightboxImage.index + 1) % lightboxImage.images.length;
                    setLightboxImage({
                      ...lightboxImage,
                      index: newIdx,
                      src: lightboxImage.images[newIdx].src,
                      caption: lightboxImage.images[newIdx].caption
                    });
                    if (selectedVariant) setSubraceImageIndex(newIdx);
                  }}
                  aria-label="Next image"
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              )}
            </div>
            {lightboxImage.caption && (
              <div className="race-lightbox-caption">
                {lightboxImage.caption}
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
};

export default RaceSelector;

