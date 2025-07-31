import React, { useState, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBolt, faGem, faFire, faRunning, faEye, faHeart,
  faStar, faSun, faSnowflake, faGhost, faMoon, faWind,
  faBrain, faFistRaised, faSkull, faAtom, faHourglass,
  faClock, faBatteryFull, faCoins, faComment, faHandSparkles, faFlask
} from '@fortawesome/free-solid-svg-icons';
import { formatFormulaToPlainEnglish } from './SpellCardUtils';
import RollableTableSummary from './RollableTableSummary';
import { formatRollableTableForCard } from '../../core/utils/spellCardTransformer';
import { useSpellLibrary } from '../../context/SpellLibraryContext';
import SpellTooltip from './SpellTooltip';
import '../../../../styles/item-tooltip.css';

/**
 * TRUE Unified Spell Card Component
 * Consolidates ALL spell card implementations with consistent Pathfinder styling
 * Handles: SpellbookWindow, Library, Collections, Wizard, Selection - EVERYTHING
 */
const UnifiedSpellCard = ({
  spell,
  variant = 'spellbook', // 'spellbook', 'library', 'collection', 'wizard', 'compact', 'preview'
  showActions = false,
  showDescription = true,
  showStats = true,
  showTags = true,
  onEdit = null,
  onDelete = null,
  onDuplicate = null,
  onSelect = null,
  onClick = null,
  onContextMenu = null,
  isSelected = false,
  isDraggable = false,
  className = '',
  rollableTableData = null,
  categories = [],
  ...props
}) => {
  // Get library context for proc system spell lookup
  const library = useSpellLibrary();

  // State for hover tooltips (only used in compact variant)
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const itemRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  // ===== COMPREHENSIVE HELPER FUNCTIONS =====

  // Format resource names properly (convert snake_case to proper names)
  const formatResourceName = (resourceType) => {
    if (!resourceType) return '';

    // Handle specific resource types with proper names
    const resourceNameMap = {
      'action_points': 'Action Points',
      'astral_power': 'Astral Power',
      'runic_power': 'Runic Power',
      'soul_power': 'Soul Power',
      'arcane_power': 'Arcane Power',
      'combo_points': 'Combo Points',
      'soul_shards': 'Soul Shards',
      'holy_power': 'Holy Power',
      'health': 'Health',
      'mana': 'Mana',
      'inferno': 'Inferno',
      'rage': 'Rage',
      'energy': 'Energy',
      'focus': 'Focus',
      'chi': 'Chi'
    };

    // Return mapped name if available, otherwise convert snake_case to Title Case
    return resourceNameMap[resourceType] || resourceType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Enhanced formula cleaning function that properly formats resource names
  const cleanFormula = (formula) => {
    if (!formula || typeof formula !== 'string') return '';

    let cleanedFormula = formula
      .replace(/\s*\+\s*/g, ' + ')
      .replace(/\s*\-\s*/g, ' - ')
      .replace(/\s*\*\s*/g, ' * ')
      .replace(/\s*\/\s*/g, ' / ')
      .replace(/\s+/g, ' ')
      .trim();

    // Replace specific resource variable names with proper formatting
    const resourceVariableMap = {
      'action_points': 'Action Points',
      'astral_power': 'Astral Power',
      'runic_power': 'Runic Power',
      'soul_power': 'Soul Power',
      'arcane_power': 'Arcane Power',
      'combo_points': 'Combo Points',
      'soul_shards': 'Soul Shards',
      'holy_power': 'Holy Power',
      'max_health': 'Max Health',
      'current_health': 'Current Health',
      'max_mana': 'Max Mana',
      'current_mana': 'Current Mana',
      'max_action_points': 'Max Action Points',
      'current_action_points': 'Current Action Points',
      'health_regen': 'Health Regen',
      'mana_regen': 'Mana Regen'
    };

    // Replace resource variables in the formula
    Object.entries(resourceVariableMap).forEach(([variable, properName]) => {
      const regex = new RegExp(`\\b${variable}\\b`, 'gi');
      cleanedFormula = cleanedFormula.replace(regex, properName);
    });

    // Handle remaining underscores for any missed variables
    cleanedFormula = cleanedFormula.replace(/_/g, ' ');

    // Handle camelCase conversion
    cleanedFormula = cleanedFormula.replace(/([a-z])([A-Z])/g, '$1 $2');

    return cleanedFormula;
  };

  // Debug logging for resolution method changes (commented out to avoid browser issues)
  // if (spell?.name && spell?.resolution) {
  //   console.log('UnifiedSpellCard - Resolution Method:', {
  //     spellName: spell.name,
  //     resolution: spell.resolution,
  //     cardConfig: spell.cardConfig,
  //     coinConfig: spell.coinConfig,
  //     damageConfig: spell.damageConfig,
  //     chanceOnHitConfig: spell.chanceOnHitConfig || spell.damageConfig?.chanceOnHitConfig,
  //     criticalConfig: spell.criticalConfig || spell.damageConfig?.criticalConfig
  //   });
  // }

  const getRarityClass = () => {
    const rarityMap = {
      'common': 'rarity-common',
      'uncommon': 'rarity-uncommon',
      'rare': 'rarity-rare',
      'epic': 'rarity-epic',
      'legendary': 'rarity-legendary'
    };
    return rarityMap[spell?.rarity] || 'rarity-common';
  };

  const getSpellSchoolClass = () => {
    const schoolMap = {
      'fire': 'spell-fire',
      'frost': 'spell-frost',
      'ice': 'spell-frost',
      'cold': 'spell-frost',
      'arcane': 'spell-arcane',
      'force': 'spell-arcane',
      'nature': 'spell-nature',
      'shadow': 'spell-shadow',
      'necrotic': 'spell-shadow',
      'holy': 'spell-holy',
      'radiant': 'spell-holy',
      'lightning': 'spell-lightning',
      'thunder': 'spell-lightning',
      'electric': 'spell-lightning',
      'physical': 'spell-physical'
    };
    const school = spell?.school || spell?.damageTypes?.[0] || spell?.elementType || 'arcane';
    return schoolMap[school.toLowerCase()] || 'spell-arcane';
  };

  const getBorderColor = () => {
    const rarityColors = {
      'common': '#9d9d9d',
      'uncommon': '#1eff00',
      'rare': '#0070dd',
      'epic': '#a335ee',
      'legendary': '#ff8000'
    };
    return rarityColors[spell?.rarity] || '#9d9d9d';
  };

  const getSpellIcon = () => {
    return spell?.icon || 'inv_misc_questionmark';
  };

  // ===== RESISTANCE HELPER FUNCTIONS =====

  const extractDamageTypeFromResistanceName = (resistanceName) => {
    if (!resistanceName) return 'damage';

    const name = resistanceName.toLowerCase();
    if (name.includes('fire')) return 'fire';
    if (name.includes('cold') || name.includes('frost') || name.includes('ice')) return 'cold';
    if (name.includes('lightning') || name.includes('electric')) return 'lightning';
    if (name.includes('acid')) return 'acid';
    if (name.includes('poison')) return 'poison';
    if (name.includes('necrotic') || name.includes('death')) return 'necrotic';
    if (name.includes('radiant') || name.includes('holy')) return 'radiant';
    if (name.includes('psychic') || name.includes('mental')) return 'psychic';
    if (name.includes('thunder') || name.includes('sonic')) return 'thunder';
    if (name.includes('force')) return 'force';
    if (name.includes('slashing')) return 'slashing';
    if (name.includes('piercing')) return 'piercing';
    if (name.includes('bludgeoning')) return 'bludgeoning';
    if (name.includes('physical')) return 'physical';
    if (name.includes('all')) return 'all damage';

    return 'damage';
  };

  const getThematicResistanceDescription = (resistanceLevel, damageType) => {
    const thematicDescriptions = {
      vampiric: {
        fire: 'Flame Feast (heals for 200% of fire damage taken)',
        cold: 'Frost Drain (heals for 200% of cold damage taken)',
        lightning: 'Storm Siphon (heals for 200% of lightning damage taken)',
        acid: 'Corrosive Feed (heals for 200% of acid damage taken)',
        poison: 'Toxin Feast (heals for 200% of poison damage taken)',
        necrotic: 'Death Feast (heals for 200% of necrotic damage taken)',
        radiant: 'Light Drain (heals for 200% of radiant damage taken)',
        psychic: 'Mind Feast (heals for 200% of psychic damage taken)',
        thunder: 'Sound Drain (heals for 200% of thunder damage taken)',
        force: 'Energy Feast (heals for 200% of force damage taken)',
        physical: 'Blood Feast (heals for 200% of physical damage taken)',
        slashing: 'Wound Feast (heals for 200% of slashing damage taken)',
        piercing: 'Pierce Drain (heals for 200% of piercing damage taken)',
        bludgeoning: 'Impact Feed (heals for 200% of bludgeoning damage taken)',
        'all damage': 'Life Feast (heals for 200% of all damage taken)',
        damage: 'Vampiric (heals for 200% of damage taken)'
      },
      absorbing: {
        fire: 'Flame Absorb (heals for 100% of fire damage taken)',
        cold: 'Frost Absorb (heals for 100% of cold damage taken)',
        lightning: 'Storm Absorb (heals for 100% of lightning damage taken)',
        acid: 'Acid Absorb (heals for 100% of acid damage taken)',
        poison: 'Toxin Absorb (heals for 100% of poison damage taken)',
        necrotic: 'Death Absorb (heals for 100% of necrotic damage taken)',
        radiant: 'Light Absorb (heals for 100% of radiant damage taken)',
        psychic: 'Mind Absorb (heals for 100% of psychic damage taken)',
        thunder: 'Sound Absorb (heals for 100% of thunder damage taken)',
        force: 'Force Absorb (heals for 100% of force damage taken)',
        physical: 'Impact Absorb (heals for 100% of physical damage taken)',
        slashing: 'Cut Absorb (heals for 100% of slashing damage taken)',
        piercing: 'Pierce Absorb (heals for 100% of piercing damage taken)',
        bludgeoning: 'Crush Absorb (heals for 100% of bludgeoning damage taken)',
        'all damage': 'Full Absorb (heals for 100% of all damage taken)',
        damage: 'Absorbing (heals for 100% of damage taken)'
      },
      draining: {
        fire: 'Flame Sap (heals for 50% of fire damage taken)',
        cold: 'Frost Sap (heals for 50% of cold damage taken)',
        lightning: 'Storm Sap (heals for 50% of lightning damage taken)',
        acid: 'Acid Sap (heals for 50% of acid damage taken)',
        poison: 'Toxin Sap (heals for 50% of poison damage taken)',
        necrotic: 'Death Sap (heals for 50% of necrotic damage taken)',
        radiant: 'Light Sap (heals for 50% of radiant damage taken)',
        psychic: 'Mind Sap (heals for 50% of psychic damage taken)',
        thunder: 'Sound Sap (heals for 50% of thunder damage taken)',
        force: 'Force Sap (heals for 50% of force damage taken)',
        physical: 'Vigor Sap (heals for 50% of physical damage taken)',
        slashing: 'Cut Sap (heals for 50% of slashing damage taken)',
        piercing: 'Pierce Sap (heals for 50% of piercing damage taken)',
        bludgeoning: 'Crush Sap (heals for 50% of bludgeoning damage taken)',
        'all damage': 'Life Sap (heals for 50% of all damage taken)',
        damage: 'Draining (heals for 50% of damage taken)'
      },
      siphoning: {
        fire: 'Flame Siphon (heals for 25% of fire damage taken)',
        cold: 'Frost Siphon (heals for 25% of cold damage taken)',
        lightning: 'Storm Siphon (heals for 25% of lightning damage taken)',
        acid: 'Acid Siphon (heals for 25% of acid damage taken)',
        poison: 'Toxin Siphon (heals for 25% of poison damage taken)',
        necrotic: 'Death Siphon (heals for 25% of necrotic damage taken)',
        radiant: 'Light Siphon (heals for 25% of radiant damage taken)',
        psychic: 'Mind Siphon (heals for 25% of psychic damage taken)',
        thunder: 'Sound Siphon (heals for 25% of thunder damage taken)',
        force: 'Force Siphon (heals for 25% of force damage taken)',
        physical: 'Blood Siphon (heals for 25% of physical damage taken)',
        slashing: 'Cut Siphon (heals for 25% of slashing damage taken)',
        piercing: 'Pierce Siphon (heals for 25% of piercing damage taken)',
        bludgeoning: 'Crush Siphon (heals for 25% of bludgeoning damage taken)',
        'all damage': 'Life Siphon (heals for 25% of all damage taken)',
        damage: 'Siphoning (heals for 25% of damage taken)'
      },
      immune: {
        fire: 'Flame Immunity (takes no fire damage)',
        cold: 'Frost Immunity (takes no cold damage)',
        lightning: 'Storm Immunity (takes no lightning damage)',
        acid: 'Acid Immunity (takes no acid damage)',
        poison: 'Toxin Immunity (takes no poison damage)',
        necrotic: 'Death Immunity (takes no necrotic damage)',
        radiant: 'Light Immunity (takes no radiant damage)',
        psychic: 'Mind Immunity (takes no psychic damage)',
        thunder: 'Sound Immunity (takes no thunder damage)',
        force: 'Force Immunity (takes no force damage)',
        physical: 'Physical Immunity (takes no physical damage)',
        slashing: 'Cut Immunity (takes no slashing damage)',
        piercing: 'Pierce Immunity (takes no piercing damage)',
        bludgeoning: 'Crush Immunity (takes no bludgeoning damage)',
        'all damage': 'Full Immunity (takes no damage)',
        damage: 'Immune (takes no damage)'
      },
      resistant: {
        fire: 'Flame Ward (takes half fire damage)',
        cold: 'Frost Ward (takes half cold damage)',
        lightning: 'Storm Ward (takes half lightning damage)',
        acid: 'Acid Ward (takes half acid damage)',
        poison: 'Toxin Ward (takes half poison damage)',
        necrotic: 'Death Ward (takes half necrotic damage)',
        radiant: 'Light Ward (takes half radiant damage)',
        psychic: 'Mind Ward (takes half psychic damage)',
        thunder: 'Sound Ward (takes half thunder damage)',
        force: 'Force Ward (takes half force damage)',
        physical: 'Iron Skin (takes half physical damage)',
        slashing: 'Cut Ward (takes half slashing damage)',
        piercing: 'Pierce Ward (takes half piercing damage)',
        bludgeoning: 'Crush Ward (takes half bludgeoning damage)',
        'all damage': 'Full Ward (takes half damage)',
        damage: 'Resistant (takes half damage)'
      },
      highly_resistant: {
        fire: 'Flame Barrier (takes 25% fire damage)',
        cold: 'Frost Barrier (takes 25% cold damage)',
        lightning: 'Storm Barrier (takes 25% lightning damage)',
        acid: 'Acid Barrier (takes 25% acid damage)',
        poison: 'Toxin Barrier (takes 25% poison damage)',
        necrotic: 'Death Barrier (takes 25% necrotic damage)',
        radiant: 'Light Barrier (takes 25% radiant damage)',
        psychic: 'Mind Barrier (takes 25% psychic damage)',
        thunder: 'Sound Barrier (takes 25% thunder damage)',
        force: 'Force Barrier (takes 25% force damage)',
        physical: 'Adamant Skin (takes 25% physical damage)',
        slashing: 'Cut Barrier (takes 25% slashing damage)',
        piercing: 'Pierce Barrier (takes 25% piercing damage)',
        bludgeoning: 'Crush Barrier (takes 25% bludgeoning damage)',
        'all damage': 'Full Barrier (takes 25% damage)',
        damage: 'Highly Resistant (takes 25% damage)'
      },
      guarded: {
        fire: 'Flame Guard (takes 75% fire damage)',
        cold: 'Frost Guard (takes 75% cold damage)',
        lightning: 'Storm Guard (takes 75% lightning damage)',
        acid: 'Acid Guard (takes 75% acid damage)',
        poison: 'Toxin Guard (takes 75% poison damage)',
        necrotic: 'Death Guard (takes 75% necrotic damage)',
        radiant: 'Light Guard (takes 75% radiant damage)',
        psychic: 'Mind Guard (takes 75% psychic damage)',
        thunder: 'Sound Guard (takes 75% thunder damage)',
        force: 'Force Guard (takes 75% force damage)',
        physical: 'Steel Skin (takes 75% physical damage)',
        slashing: 'Cut Guard (takes 75% slashing damage)',
        piercing: 'Pierce Guard (takes 75% piercing damage)',
        bludgeoning: 'Crush Guard (takes 75% bludgeoning damage)',
        'all damage': 'Full Guard (takes 75% damage)',
        damage: 'Guarded (takes 75% damage)'
      },
      slight_reduction: {
        fire: 'Flame Reduction (reduces fire resistance by 25%)',
        cold: 'Frost Reduction (reduces cold resistance by 25%)',
        lightning: 'Storm Reduction (reduces lightning resistance by 25%)',
        acid: 'Acid Reduction (reduces acid resistance by 25%)',
        poison: 'Toxin Reduction (reduces poison resistance by 25%)',
        necrotic: 'Death Reduction (reduces necrotic resistance by 25%)',
        radiant: 'Light Reduction (reduces radiant resistance by 25%)',
        psychic: 'Mind Reduction (reduces psychic resistance by 25%)',
        thunder: 'Sound Reduction (reduces thunder resistance by 25%)',
        force: 'Force Reduction (reduces force resistance by 25%)',
        physical: 'Armor Breach (reduces physical resistance by 25%)',
        slashing: 'Cut Breach (reduces slashing resistance by 25%)',
        piercing: 'Pierce Breach (reduces piercing resistance by 25%)',
        bludgeoning: 'Crush Breach (reduces bludgeoning resistance by 25%)',
        'all damage': 'Resistance Breach (reduces all resistances by 25%)',
        damage: 'Slight Reduction (reduces resistance by 25%)'
      },
      nullified: {
        fire: 'Flame Nullification (removes all fire resistance)',
        cold: 'Frost Nullification (removes all cold resistance)',
        lightning: 'Storm Nullification (removes all lightning resistance)',
        acid: 'Acid Nullification (removes all acid resistance)',
        poison: 'Toxin Nullification (removes all poison resistance)',
        necrotic: 'Death Nullification (removes all necrotic resistance)',
        radiant: 'Light Nullification (removes all radiant resistance)',
        psychic: 'Mind Nullification (removes all psychic resistance)',
        thunder: 'Sound Nullification (removes all thunder resistance)',
        force: 'Force Nullification (removes all force resistance)',
        physical: 'Armor Nullification (removes all physical resistance)',
        slashing: 'Cut Nullification (removes all slashing resistance)',
        piercing: 'Pierce Nullification (removes all piercing resistance)',
        bludgeoning: 'Crush Nullification (removes all bludgeoning resistance)',
        'all damage': 'Full Nullification (removes all resistances)',
        damage: 'Nullified (removes all resistance)'
      },
      susceptible: {
        fire: 'Flame Weakness (takes 125% fire damage)',
        cold: 'Frost Weakness (takes 125% cold damage)',
        lightning: 'Storm Weakness (takes 125% lightning damage)',
        acid: 'Acid Weakness (takes 125% acid damage)',
        poison: 'Toxin Weakness (takes 125% poison damage)',
        necrotic: 'Death Weakness (takes 125% necrotic damage)',
        radiant: 'Light Weakness (takes 125% radiant damage)',
        psychic: 'Mind Weakness (takes 125% psychic damage)',
        thunder: 'Sound Weakness (takes 125% thunder damage)',
        force: 'Force Weakness (takes 125% force damage)',
        physical: 'Soft Skin (takes 125% physical damage)',
        slashing: 'Cut Weakness (takes 125% slashing damage)',
        piercing: 'Pierce Weakness (takes 125% piercing damage)',
        bludgeoning: 'Crush Weakness (takes 125% bludgeoning damage)',
        'all damage': 'Full Weakness (takes 125% damage)',
        damage: 'Susceptible (takes 125% damage)'
      },
      exposed: {
        fire: 'Flame Exposure (takes 150% fire damage)',
        cold: 'Frost Exposure (takes 150% cold damage)',
        lightning: 'Storm Exposure (takes 150% lightning damage)',
        acid: 'Acid Exposure (takes 150% acid damage)',
        poison: 'Toxin Exposure (takes 150% poison damage)',
        necrotic: 'Death Exposure (takes 150% necrotic damage)',
        radiant: 'Light Exposure (takes 150% radiant damage)',
        psychic: 'Mind Exposure (takes 150% psychic damage)',
        thunder: 'Sound Exposure (takes 150% thunder damage)',
        force: 'Force Exposure (takes 150% force damage)',
        physical: 'Tender Flesh (takes 150% physical damage)',
        slashing: 'Cut Exposure (takes 150% slashing damage)',
        piercing: 'Pierce Exposure (takes 150% piercing damage)',
        bludgeoning: 'Crush Exposure (takes 150% bludgeoning damage)',
        'all damage': 'Full Exposure (takes 150% damage)',
        damage: 'Exposed (takes 150% damage)'
      },
      vulnerable: {
        fire: 'Flame Curse (takes double fire damage)',
        cold: 'Frost Curse (takes double cold damage)',
        lightning: 'Storm Curse (takes double lightning damage)',
        acid: 'Acid Curse (takes double acid damage)',
        poison: 'Toxin Curse (takes double poison damage)',
        necrotic: 'Death Curse (takes double necrotic damage)',
        radiant: 'Light Curse (takes double radiant damage)',
        psychic: 'Mind Curse (takes double psychic damage)',
        thunder: 'Sound Curse (takes double thunder damage)',
        force: 'Force Curse (takes double force damage)',
        physical: 'Brittle Bones (takes double physical damage)',
        slashing: 'Cut Curse (takes double slashing damage)',
        piercing: 'Pierce Curse (takes double piercing damage)',
        bludgeoning: 'Crush Curse (takes double bludgeoning damage)',
        'all damage': 'Full Curse (takes double damage)',
        damage: 'Vulnerable (takes double damage)'
      }
    };

    return thematicDescriptions[resistanceLevel]?.[damageType] ||
           thematicDescriptions[resistanceLevel]?.damage ||
           resistanceLevel;
  };

  // ===== COMPREHENSIVE FORMATTING FUNCTIONS =====

  const formatCastTime = () => {
    if (!spell) return 'Instant';

    // Handle different casting time formats
    if (spell.actionType === 'channeled') return 'Channeled';
    if (spell.spellType === 'CHANNELED') return 'Channeled';
    if (spell.spellType === 'REACTION') return 'Reaction';
    if (spell.spellType === 'PASSIVE') return 'Passive';
    if (spell.spellType === 'TRAP') return 'Trap';
    if (spell.spellType === 'STATE') return 'State';
    if (spell.spellType === 'ZONE') return 'Zone';

    // Get cast time from typeConfig
    const castTime = spell.castTime ||
                    spell.castingTime ||
                    (spell.castingConfig && spell.castingConfig.castTime) ||
                    (spell.typeConfig && spell.typeConfig.castTime);

    if (castTime && castTime > 0) {
      const timeType = spell.typeConfig?.castTimeType || 'IMMEDIATE';
      if (timeType === 'IMMEDIATE') {
        return castTime === 1 ? '1 Turn' : `${castTime} Turns`;
      } else {
        return `${castTime} Turn${castTime > 1 ? 's' : ''} (${timeType.replace(/_/g, ' ').toLowerCase()})`;
      }
    }

    return 'Instant';
  };

  const formatRange = () => {
    if (!spell) return 'Self';

    // Handle different range formats
    if (spell.targetingMode === 'self') return 'Self';
    if (spell.targetingConfig?.targetingType === 'self') return 'Self';

    const config = spell.targetingConfig;
    if (!config) {
      // Fallback to legacy range property
      const range = spell.range || 'Touch';
      if (typeof range === 'number') return `${range} ft`;
      return range;
    }

    // Format based on targeting configuration
    const { targetingType, rangeType, rangeDistance, aoeShape, aoeParameters } = config;

    // Handle self-targeting
    if (targetingType === 'self') return 'Self';

    // Build range string based on range type
    let rangeStr = '';
    switch (rangeType) {
      case 'touch':
        rangeStr = 'Touch';
        break;
      case 'ranged':
        rangeStr = `${rangeDistance || 30} ft`;
        break;
      case 'sight':
        rangeStr = 'Sight';
        break;
      case 'unlimited':
        rangeStr = 'Unlimited';
        break;
      case 'self_centered':
        rangeStr = 'Self';
        break;
      default:
        rangeStr = 'Touch';
    }

    // Add targeting type information for area effects
    if (targetingType === 'area' && aoeShape) {
      const shapeInfo = formatAoeShape(aoeShape, aoeParameters);
      if (shapeInfo) {
        rangeStr += ` (${shapeInfo})`;
      }
    } else if (targetingType === 'multi') {
      const maxTargets = config.maxTargets || 3;
      const selectionMethod = config.targetSelectionMethod || config.selectionMethod;
      if (selectionMethod && selectionMethod !== 'manual') {
        const methodName = selectionMethod === 'random' ? 'Random' :
                          selectionMethod === 'closest' ? 'Closest' :
                          selectionMethod === 'furthest' ? 'Furthest' :
                          selectionMethod === 'lowest_health' ? 'Lowest HP' :
                          selectionMethod === 'highest_health' ? 'Highest HP' : '';
        rangeStr += ` (${maxTargets} ${methodName})`;
      } else {
        rangeStr += ` (${maxTargets} targets)`;
      }
    } else if (targetingType === 'chain') {
      rangeStr += ' (Chain)';
    }

    // Don't add propagation information to range since we have a separate propagation badge
    // This prevents duplication like "TOUCH + 20FT CHAIN" in range AND "CHAIN EFFECT X3, 20FT, 40%" in propagation

    return rangeStr;
  };

  const formatAoeShape = (shape, parameters = {}) => {
    if (!shape) return '';

    switch (shape) {
      case 'circle':
        return `${parameters.radius || 10}ft radius`;
      case 'square':
        return `${parameters.size || 10}ft square`;
      case 'rectangle':
        return `${parameters.width || 10}×${parameters.height || 20}ft`;
      case 'line':
        return `${parameters.length || 30}ft line`;
      case 'cone':
        return `${parameters.length || 15}ft cone`;
      case 'cylinder':
        return `${parameters.radius || 10}ft radius, ${parameters.height || 20}ft high`;
      case 'sphere':
        return `${parameters.radius || 10}ft sphere`;
      case 'wall':
        return `${parameters.length || 60}ft wall`;
      default:
        return shape;
    }
  };

  const formatTargetingType = () => {
    if (!spell?.targetingConfig) return '';

    const {
      targetingType,
      maxTargets,
      selectionMethod,
      targetSelectionMethod,
      targetRestrictions
    } = spell.targetingConfig;

    let baseText = '';
    let methodText = '';
    let restrictionText = '';

    // Format base targeting type
    switch (targetingType) {
      case 'single':
        baseText = 'Single Target';
        break;
      case 'multi':
        const targets = maxTargets || 3;
        baseText = `${targets} Targets`;
        break;
      case 'area':
        baseText = 'Area Effect';
        break;
      case 'chain':
        baseText = 'Chain Effect';
        break;
      case 'self':
        baseText = 'Self';
        break;
      default:
        baseText = '';
    }

    // Format selection method for single/multi targets
    if ((targetingType === 'single' || targetingType === 'multi') &&
        (selectionMethod || targetSelectionMethod)) {
      const method = targetSelectionMethod || selectionMethod;
      switch (method) {
        case 'manual':
          methodText = 'Manual';
          break;
        case 'random':
          methodText = 'Random';
          break;
        case 'closest':
          methodText = 'Closest';
          break;
        case 'furthest':
          methodText = 'Furthest';
          break;
        case 'lowest_health':
          methodText = 'Lowest HP';
          break;
        case 'highest_health':
          methodText = 'Highest HP';
          break;
        default:
          methodText = method;
      }
    }

    // Format target restrictions
    if (targetRestrictions && targetRestrictions.length > 0) {
      const restrictions = targetRestrictions.map(restriction => {
        switch (restriction) {
          case 'enemy':
            return 'Enemies';
          case 'ally':
            return 'Allies';
          case 'self':
            return 'Self';
          case 'object':
            return 'Objects';
          case 'creature':
            return 'Creatures';
          default:
            return restriction;
        }
      });

      if (restrictions.length === 1) {
        restrictionText = restrictions[0];
      } else if (restrictions.length === 2) {
        restrictionText = restrictions.join(' & ');
      } else {
        restrictionText = restrictions.slice(0, -1).join(', ') + ' & ' + restrictions[restrictions.length - 1];
      }
    }

    // Combine all parts
    let result = baseText;
    if (methodText && (targetingType === 'single' || targetingType === 'multi')) {
      result += ` (${methodText})`;
    }
    if (restrictionText && targetingType !== 'self') {
      result += ` - ${restrictionText}`;
    }

    return result;
  };

  // ===== PROPAGATION FORMATTING =====

  const formatPropagation = () => {
    if (!spell?.propagation || spell.propagation.method === 'none') {
      return '';
    }

    const { method, behavior, parameters } = spell.propagation;

    // Define propagation method names
    const propagationMethods = {
      'chain': 'Chain Effect',
      'bounce': 'Bounce Effect',
      'seeking': 'Seeking Effect',
      'explosion': 'Explosion on Impact',
      'spreading': 'Spreading Effect',
      'forking': 'Forking Effect'
    };

    // Define behavior names
    const behaviorNames = {
      // Chain behaviors
      'nearest': 'Nearest',
      'farthest': 'Farthest',
      'random': 'Random',
      'lowest_health': 'Lowest HP',
      'highest_health': 'Highest HP',

      // Bounce behaviors
      'ricocheting': 'Ricocheting',
      'accelerating': 'Accelerating',
      'decelerating': 'Decelerating',

      // Seeking behaviors
      'smart': 'Smart Seeking',
      'persistent': 'Persistent',
      'phase_through': 'Phase Through',

      // Explosion behaviors
      'delayed': 'Delayed',
      'instant': 'Instant',
      'chain_reaction': 'Chain Reaction',

      // Spreading behaviors
      'radial': 'Radial',
      'directional': 'Directional',
      'viral': 'Viral',

      // Forking behaviors
      'equal_power': 'Equal Power',
      'diminishing': 'Diminishing',
      'focused': 'Focused'
    };

    let result = propagationMethods[method] || method;

    // Add parameter information in a cleaner format
    if (parameters) {
      const parts = [];

      if (method === 'chain' || method === 'bounce') {
        if (parameters.count) parts.push(`x${parameters.count}`);
        if (parameters.range) parts.push(`${parameters.range}ft`);
        if (parameters.decay && parameters.decay > 0) parts.push(`-${parameters.decay}%`);
      } else if (method === 'explosion') {
        if (parameters.secondaryRadius) parts.push(`${parameters.secondaryRadius}ft`);
      } else if (method === 'forking') {
        if (parameters.forkCount) parts.push(`x${parameters.forkCount}`);
      } else if (method === 'spreading') {
        if (parameters.spreadRate) parts.push(`${parameters.spreadRate}ft/s`);
      } else if (method === 'seeking') {
        if (parameters.range) parts.push(`${parameters.range}ft`);
      }

      if (parts.length > 0) {
        result += ` ${parts.join(' ')}`;
      }
    }

    // Add behavior in parentheses if there's space
    if (behavior && behaviorNames[behavior]) {
      const withBehavior = `${result} (${behaviorNames[behavior]})`;
      // Only add behavior if the total length is reasonable
      if (withBehavior.length <= 25) {
        result = withBehavior;
      }
    }

    return result;
  };

  const formatDuration = () => {
    if (!spell) return 'Instant';

    // Handle different duration formats
    if (spell.durationType === 'instant') return 'Instant';
    if (spell.durationType === 'permanent') {
      const dispellable = spell.canBeDispelled ? ' (Dispellable)' : '';
      return `Permanent${dispellable}`;
    }

    // Handle type-specific durations
    if (spell.spellType === 'CHANNELED' && spell.typeConfig) {
      const maxDuration = spell.typeConfig.maxChannelDuration || 3;
      const unit = spell.typeConfig.durationUnit || 'TURNS';
      return `Up to ${maxDuration} ${unit.toLowerCase()}`;
    }

    if (spell.spellType === 'ZONE' && spell.typeConfig) {
      const zoneDuration = spell.typeConfig.zoneDuration || 60;
      const unit = spell.typeConfig.zoneDurationUnit || 'seconds';
      return `${zoneDuration} ${unit}`;
    }

    const duration = spell.duration ||
                     (spell.durationConfig && spell.durationConfig.duration) ||
                     (spell.typeConfig && spell.typeConfig.duration) ||
                     'Instant';

    return duration;
  };

  // Format cooldown from wizard cooldownConfig
  const formatCooldown = () => {
    if (!spell?.cooldownConfig) return null;

    const config = spell.cooldownConfig;

    // Handle different cooldown types
    switch (config.type) {
      case 'turn_based':
        if (!config.value || config.value === 0) return 'No cooldown';
        return `${config.value} turn${config.value > 1 ? 's' : ''}`;

      case 'short_rest':
        if (!config.value || config.value === 0) return 'No uses';
        return `${config.value} use${config.value > 1 ? 's' : ''}/short rest`;

      case 'long_rest':
        if (!config.value || config.value === 0) return 'No uses';
        return `${config.value} use${config.value > 1 ? 's' : ''}/long rest`;

      case 'charge_based':
        const charges = config.charges || 1;
        const recovery = config.recovery || 1;
        return `${charges} charge${charges > 1 ? 's' : ''} (${recovery} turn${recovery > 1 ? 's' : ''}/charge)`;

      case 'dice_based':
        return config.value ? `${config.value} cooldown` : 'Dice-based cooldown';

      default:
        return null;
    }
  };

  // Format type-specific configuration as subtle bullet points
  const formatTypeSpecificBullets = () => {
    if (!spell || !spell.typeConfig) return [];

    const bullets = [];
    const typeConfig = spell.typeConfig;

    switch (spell.spellType) {
      case 'CHANNELED':
        // Add duration as first bullet point for channeled spells
        const maxDuration = typeConfig.maxChannelDuration || 3;
        const unit = typeConfig.durationUnit || 'TURNS';
        bullets.push(`Up to ${maxDuration} ${unit.toLowerCase()}`);

        // Show concentration DC (including base DC 10)
        if (typeConfig.concentrationDC !== undefined) {
          bullets.push(`DC ${typeConfig.concentrationDC} ${typeConfig.dcType || 'Spirit'}`);
        }

        // Show tick frequency (including end of turn)
        if (typeConfig.tickFrequency) {
          bullets.push(`${typeConfig.tickFrequency.replace(/_/g, ' ').toLowerCase()}`);
        }

        if (typeConfig.breakEffect && typeConfig.breakEffect !== 'none') {
          bullets.push(`break: ${typeConfig.breakEffect}`);
        }
        break;

      case 'REACTION':
        // Show availability (default to "always available")
        const availability = typeConfig.availabilityType && typeConfig.availabilityType !== 'ALWAYS'
          ? typeConfig.availabilityType.replace(/_/g, ' ').toLowerCase()
          : 'always available';
        bullets.push(availability);

        // Show uses per turn if limited
        if (typeConfig.limitUsesPerTurn && typeConfig.usesPerTurn) {
          bullets.push(`${typeConfig.usesPerTurn}/turn`);
        }

        // Show reaction window if not immediate
        if (typeConfig.reactionWindow && typeConfig.reactionWindow !== 'immediate') {
          bullets.push(`${typeConfig.reactionWindow} window`);
        }

        // Show cooldown (format 0 as "no cooldown")
        if (typeConfig.cooldownAfterTrigger !== undefined) {
          if (typeConfig.cooldownAfterTrigger === 0) {
            bullets.push('no cooldown');
          } else {
            const unit = typeConfig.cooldownUnit || 'seconds';
            bullets.push(`${typeConfig.cooldownAfterTrigger} ${unit} cooldown`);
          }
        }

        // Show max triggers (format -1 as "unlimited triggers", 1 as "single use")
        if (typeConfig.maxTriggers !== undefined) {
          if (typeConfig.maxTriggers === -1) {
            bullets.push('unlimited triggers');
          } else if (typeConfig.maxTriggers === 1) {
            bullets.push('single use');
          } else if (typeConfig.maxTriggers > 1) {
            bullets.push(`max ${typeConfig.maxTriggers} triggers`);
          }
        }
        break;

      case 'TRAP':
        // Check both typeConfig and trapConfig for trap properties
        const trapConfig = spell.trapConfig || {};

        // Show placement time if more than 1 turn
        const placementTime = typeConfig.placementTime || trapConfig.placementTime;
        if (placementTime && placementTime > 1) {
          bullets.push(`${placementTime} turns to place`);
        }

        // Show visibility (default to "visible to all")
        const visibility = typeConfig.visibility || trapConfig.visibility || 'visible';
        if (visibility === 'hidden') {
          bullets.push('hidden');
        } else if (visibility === 'magical') {
          bullets.push('magical aura');
        } else {
          bullets.push('visible to all');
        }

        // Show cooldown (format 0 as "no cooldown")
        const cooldown = typeConfig.cooldownAfterTrigger !== undefined ? typeConfig.cooldownAfterTrigger : trapConfig.resetTime;
        if (cooldown !== undefined) {
          if (cooldown === 0) {
            bullets.push('no cooldown');
          } else {
            const unit = typeConfig.cooldownUnit || trapConfig.cooldownUnit || 'seconds';
            bullets.push(`${cooldown} ${unit} cooldown`);
          }
        }

        // Show max triggers (format -1 as "unlimited triggers", 1 as "single use")
        const maxTriggers = typeConfig.maxTriggers !== undefined ? typeConfig.maxTriggers : trapConfig.maxTriggers;
        if (maxTriggers !== undefined) {
          if (maxTriggers === -1) {
            bullets.push('unlimited triggers');
          } else if (maxTriggers === 1) {
            bullets.push('single use');
          } else if (maxTriggers > 1) {
            bullets.push(`max ${maxTriggers} triggers`);
          }
        }
        break;

      case 'ZONE':
        // Show zone duration
        if (typeConfig.zoneDuration) {
          const unit = typeConfig.zoneDurationUnit || 'seconds';
          bullets.push(`${typeConfig.zoneDuration} ${unit}`);
        }

        if (typeConfig.leaveTrail) {
          bullets.push('leaves trail');
          if (typeConfig.trailDuration) {
            bullets.push(`trail: ${typeConfig.trailDuration} ${typeConfig.trailDurationUnit || 'rounds'}`);
          }
        }
        break;

      case 'STATE':
        // Show visibility (default to "visible to all")
        const stateVisibility = typeConfig.stateVisibility || 'visible';
        if (stateVisibility === 'hidden') {
          bullets.push('hidden');
        } else if (stateVisibility === 'magical') {
          bullets.push('magical aura');
        } else {
          bullets.push('visible to all');
        }

        // Show cooldown (format 0 as "no cooldown")
        if (typeConfig.cooldownAfterTrigger !== undefined) {
          if (typeConfig.cooldownAfterTrigger === 0) {
            bullets.push('no cooldown');
          } else {
            const unit = typeConfig.cooldownUnit || 'seconds';
            bullets.push(`${typeConfig.cooldownAfterTrigger} ${unit} cooldown`);
          }
        }

        // Show max triggers (format -1 as "unlimited triggers", 1 as "single use")
        if (typeConfig.maxTriggers !== undefined) {
          if (typeConfig.maxTriggers === -1) {
            bullets.push('unlimited triggers');
          } else if (typeConfig.maxTriggers === 1) {
            bullets.push('single use');
          } else if (typeConfig.maxTriggers > 1) {
            bullets.push(`max ${typeConfig.maxTriggers} triggers`);
          }
        }
        break;

      case 'PASSIVE':
        if (typeConfig.toggleable) {
          bullets.push('toggleable');
        }
        break;

      case 'ACTION':
        const actionBullets = [];

        // Show cast time type if not immediate (fix underscore formatting)
        if (typeConfig.castTimeType && typeConfig.castTimeType !== 'IMMEDIATE') {
          actionBullets.push(typeConfig.castTimeType.replace(/_/g, ' ').toLowerCase());
        }

        // Removed interruptible and castingVisibility as requested
        // Removed partialEffectOnInterrupt as requested

        bullets.push(...actionBullets);
        break;
    }

    // Add propagation information as bullets (applies to all spell types)
    if (spell?.propagation && spell.propagation.method !== 'none') {
      const { method, behavior, parameters } = spell.propagation;

      // Add method-specific bullets
      switch (method) {
        case 'chain':
          if (parameters?.count) {
            bullets.push(`chains to ${parameters.count} targets`);
          }
          if (parameters?.decay && parameters.decay > 0) {
            bullets.push(`${parameters.decay}% decay per jump`);
          }
          break;

        case 'bounce':
          if (parameters?.count) {
            bullets.push(`bounces ${parameters.count} times`);
          }
          break;

        case 'explosion':
          if (parameters?.secondaryRadius) {
            bullets.push(`${parameters.secondaryRadius}ft explosion on impact`);
          }
          break;

        case 'forking':
          if (parameters?.forkCount) {
            bullets.push(`splits into ${parameters.forkCount} forks`);
          }
          break;

        case 'spreading':
          if (parameters?.spreadRate) {
            bullets.push(`spreads at ${parameters.spreadRate}ft/s`);
          }
          break;

        case 'seeking':
          if (parameters?.range) {
            bullets.push(`seeks targets within ${parameters.range}ft`);
          }
          break;
      }

      // Add behavior-specific information
      if (behavior) {
        switch (behavior) {
          case 'nearest':
            bullets.push('targets nearest');
            break;
          case 'farthest':
            bullets.push('targets farthest');
            break;
          case 'random':
            bullets.push('targets randomly');
            break;
          case 'lowest_health':
            bullets.push('targets lowest HP');
            break;
          case 'highest_health':
            bullets.push('targets highest HP');
            break;
          case 'accelerating':
            bullets.push('accelerates with each bounce');
            break;
          case 'decelerating':
            bullets.push('slows with each bounce');
            break;
          case 'ricocheting':
            bullets.push('ricochets off surfaces');
            break;
        }
      }
    }

    return bullets;
  };

  // Helper function to get resource icon and color
  const getResourceIcon = (resourceType) => {
    const resourceTypeMap = {
      'mana': faGem,
      'rage': faFire,
      'energy': faRunning,
      'focus': faEye,
      'health': faHeart,
      'combo_points': faStar,
      'holy_power': faSun,
      'runic_power': faSnowflake,
      'soul_shards': faGhost,
      'astral_power': faMoon,
      'maelstrom': faWind,
      'insanity': faBrain,
      'fury': faFistRaised,
      'pain': faSkull,
      'chi': faAtom,
      'cooldown': faHourglass,
      'uses': faClock,
      'charges': faBatteryFull,
      'ap': faBolt,
      'actionpoints': faBolt,
      'action_points': faBolt,
      'action-points': faBolt,
      'holypower': faSun,
      'holy-power': faSun,
      'astralpower': faMoon,
      'astral-power': faMoon
    };
    return resourceTypeMap[resourceType?.toLowerCase().replace(/\s+/g, '')] || faCoins;
  };

  const getResourceColor = (resourceType) => {
    const resourceColorMap = {
      'mana': '#4A90E2',
      'rage': '#E74C3C',
      'energy': '#F39C12',
      'focus': '#9B59B6',
      'health': '#E74C3C',
      'combo_points': '#F1C40F',
      'holy_power': '#F1C40F',
      'runic_power': '#3498DB',
      'soul_shards': '#8E44AD',
      'astral_power': '#9B59B6',
      'maelstrom': '#1ABC9C',
      'insanity': '#8E44AD',
      'fury': '#E74C3C',
      'pain': '#34495E',
      'chi': '#27AE60',
      'cooldown': '#95A5A6',
      'uses': '#95A5A6',
      'charges': '#3498DB',
      'ap': '#E67E22',
      'actionpoints': '#E67E22',
      'action_points': '#E67E22',
      'action-points': '#E67E22',
      'holypower': '#F1C40F',
      'holy-power': '#F1C40F',
      'astralpower': '#9B59B6',
      'astral-power': '#9B59B6'
    };
    return resourceColorMap[resourceType?.toLowerCase().replace(/\s+/g, '')] || '#95A5A6';
  };

  const formatResourceCosts = () => {
    if (!spell) return null;

    const resources = [];

    // Check for resource config (wizard format)
    if (spell.resourceConfig) {
      const { resourceType = 'Mana', resourceAmount = 0 } = spell.resourceConfig;
      if (resourceAmount > 0) {
        resources.push({
          type: resourceType.toLowerCase().replace(/\s+/g, '-'),
          amount: resourceAmount,
          name: formatResourceName(resourceType),
          icon: getResourceIcon(resourceType),
          color: getResourceColor(resourceType)
        });
      }
    }

    // Check for wizard format resource costs
    if (spell.resourceCost) {
      // Check all selected resource types
      const selectedTypes = spell.resourceCost.resourceTypes || [];

      selectedTypes.forEach(type => {
        const useFormula = spell.resourceCost.useFormulas && spell.resourceCost.useFormulas[type];
        const formula = spell.resourceCost.resourceFormulas && spell.resourceCost.resourceFormulas[type];
        const amount = spell.resourceCost.resourceValues && spell.resourceCost.resourceValues[type];

        // Show resource if it uses a formula OR has a value > 0
        if ((useFormula && formula) || (amount > 0)) {
          resources.push({
            type: type.toLowerCase().replace(/\s+/g, '-'),
            amount: useFormula ? formula : amount,
            name: formatResourceName(type),
            icon: getResourceIcon(type),
            color: getResourceColor(type),
            isFormula: useFormula
          });
        }
      });
    }

    // Check for legacy resource costs (spellbook format) - only for actual spellbook spells
    // Only show spellbook resources if the spell has been saved to spellbook (has createdAt)
    if (spell.resourceCost && variant === 'spellbook' && spell.createdAt) {
      Object.entries(spell.resourceCost).forEach(([type, amount]) => {
        if (amount > 0 && type !== 'components' && type !== 'materialComponents' && type !== 'verbalText' && type !== 'somaticText' && type !== 'resourceValues' && type !== 'resourceTypes' && type !== 'resourceFormulas' && type !== 'useFormulas' && type !== 'actionPointsSelected' && type !== 'primaryResourceType' && type !== 'classResourceCost') {
          // Don't add if already added from resourceValues
          if (!resources.some(r => r.type === type.toLowerCase().replace(/\s+/g, '-'))) {
            resources.push({
              type: type.toLowerCase().replace(/\s+/g, '-'),
              amount: amount,
              name: type.charAt(0).toUpperCase() + type.slice(1),
              icon: getResourceIcon(type),
              color: getResourceColor(type)
            });
          }
        }
      });
    }

    // Check for simple mana cost (only for legacy spells or when mana is explicitly selected)
    if (spell.manaCost && spell.manaCost > 0 && !resources.some(r => r.type === 'mana')) {
      // Only add mana if it's a legacy spell (no resourceCost.resourceTypes) or if mana is selected
      const selectedTypes = spell.resourceCost?.resourceTypes || [];
      const isLegacySpell = !spell.resourceCost?.resourceTypes;
      const manaSelected = selectedTypes.includes('mana');

      if (isLegacySpell || manaSelected) {
        resources.push({
          type: 'mana',
          amount: spell.manaCost,
          name: 'Mana',
          icon: getResourceIcon('mana'),
          color: getResourceColor('mana')
        });
      }
    }

    if (resources.length === 0) return null;

    return (
      <div className="pf-spell-resources">
        {resources.map((resource, index) => (
          <div
            key={index}
            className={`pf-resource-cost ${resource.type} ${resource.isFormula ? 'formula' : ''}`}
            title={`${resource.name}: ${resource.isFormula ? `Formula: ${resource.amount}` : resource.amount}`}
          >
            <FontAwesomeIcon
              icon={resource.icon}
              className="pf-resource-icon"
              style={{ color: '#ffffff' }}
            />
            <span className="pf-resource-amount">
              {resource.isFormula ? resource.amount : resource.amount}
            </span>
            <span className="pf-resource-name">
              {resource.name}
            </span>
          </div>
        ))}
      </div>
    );
  };

  // Format spell components for display below spell name
  const formatSpellComponents = () => {
    if (!spell || !spell.resourceCost) return null;

    const components = [];

    // Check for spell components in resourceCost
    if (spell.resourceCost.components && spell.resourceCost.components.length > 0) {
      spell.resourceCost.components.forEach(component => {
        switch(component) {
          case 'verbal':
            components.push({
              type: 'verbal',
              symbol: 'V',
              name: 'Verbal',
              description: spell.resourceCost.verbalText || 'Requires speaking magical words',
              customText: spell.resourceCost.verbalText
            });
            break;
          case 'somatic':
            components.push({
              type: 'somatic',
              symbol: 'S',
              name: 'Somatic',
              description: spell.resourceCost.somaticText || 'Requires specific hand gestures',
              customText: spell.resourceCost.somaticText
            });
            break;
          case 'material':
            components.push({
              type: 'material',
              symbol: 'M',
              name: 'Material',
              description: spell.resourceCost.materialComponents || 'Requires specific materials',
              customText: spell.resourceCost.materialComponents
            });
            break;
        }
      });
    }

    if (components.length === 0) {
      return null;
    }

    return (
      <div className="pf-spell-components">
        {components.map((component, index) => (
          <div key={index} className="pf-component-row">
            <span
              className={`pf-component ${component.type}`}
              title={component.customText || component.description}
            >
              <FontAwesomeIcon
                icon={component.type === 'verbal' ? faComment :
                      component.type === 'somatic' ? faHandSparkles :
                      component.type === 'material' ? faFlask : faComment}
                style={{
                  color: '#FFFFFF',
                  textShadow: '-0.5px -0.5px 0 #000, 0.5px -0.5px 0 #000, -0.5px 0.5px 0 #000, 0.5px 0.5px 0 #000'
                }}
              />
            </span>
            {component.customText && (
              <span className="component-custom-text">
                {component.customText}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Format material components as text
  const formatMaterialComponentsText = () => {
    if (!spell || !spell.resourceCost) return null;

    // Check for material components in resourceCost
    const materialComponents = [];

    if (spell.resourceCost.materialComponents && Array.isArray(spell.resourceCost.materialComponents)) {
      materialComponents.push(...spell.resourceCost.materialComponents.map(item => item.name || item));
    } else if (spell.resourceCost.materialComponents && typeof spell.resourceCost.materialComponents === 'string') {
      materialComponents.push(spell.resourceCost.materialComponents);
    }

    if (materialComponents.length === 0) return null;

    return (
      <div className="pf-spell-material-components">
        <span className="material-label">Materials: </span>
        <span className="material-list">{materialComponents.join(', ')}</span>
      </div>
    );
  };

  // ===== MECHANICS FORMATTING =====
  const formatMechanics = () => {
    const mechanicsElements = [];

    // Process effect-specific mechanics
    if (spell.effectMechanicsConfigs) {
      Object.entries(spell.effectMechanicsConfigs).forEach(([effectId, config]) => {
        if (!config?.enabled) return;

        let effectName = 'Effect';
        if (effectId === 'effect_damage') effectName = 'Damage';
        else if (effectId === 'effect_healing') effectName = 'Healing';
        else if (effectId === 'effect_buff') effectName = 'Buff';
        else if (effectId === 'effect_debuff') effectName = 'Debuff';
        else if (effectId === 'effect_utility') effectName = 'Utility';
        else if (effectId === 'effect_control') effectName = 'Control';

        const mechanicData = processMechanicConfig(config, effectName);
        if (mechanicData) {
          mechanicsElements.push(mechanicData);
        }
      });
    }

    // Process global mechanics (mechanicsConfig array)
    if (spell.mechanicsConfig && Array.isArray(spell.mechanicsConfig)) {
      spell.mechanicsConfig.forEach((config) => {
        if (!config?.enabled) return;

        const mechanicData = processMechanicConfig(config, 'Global');
        if (mechanicData) {
          mechanicsElements.push(mechanicData);
        }
      });
    }

    // Process graduated effects
    const graduatedEffects = formatGraduatedEffects();
    if (graduatedEffects && graduatedEffects.length > 0) {
      mechanicsElements.push(...graduatedEffects);
    }

    return mechanicsElements.length > 0 ? mechanicsElements : null;
  };

  // ===== GRADUATED EFFECTS FORMATTING =====
  const formatGraduatedEffects = () => {
    const graduatedElements = [];

    // Check for graduated effects in toxic system mechanics
    if (spell.effectMechanicsConfigs) {
      Object.entries(spell.effectMechanicsConfigs).forEach(([, config]) => {
        if (!config?.enabled || config.system !== 'TOXIC_SYSTEM' || config.type !== 'toxic_consumer') return;

        const graduatedEffects = config.toxicOptions?.graduatedEffects;
        if (!graduatedEffects || Object.keys(graduatedEffects).length === 0) return;

        // Sort levels numerically
        const sortedLevels = Object.keys(graduatedEffects)
          .map(Number)
          .sort((a, b) => a - b);

        sortedLevels.forEach(level => {
          const effect = graduatedEffects[level];
          if (!effect) return;

          let mechanicsText = '';
          const requiredToxics = effect.requiredToxicTypes || {};
          const requiredCount = Object.values(requiredToxics).reduce((sum, count) => sum + count, 0);

          if (requiredCount > 0) {
            const toxicNames = Object.entries(requiredToxics)
              .filter(([_, count]) => count > 0)
              .map(([type, count]) => {
                const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
                return count > 1 ? `${count}x ${capitalizedType}` : capitalizedType;
              });

            mechanicsText = `${requiredCount} Toxic${requiredCount > 1 ? 's' : ''} (${toxicNames.join(', ')})`;
          } else {
            mechanicsText = `${level} Toxic${level > 1 ? 's' : ''}`;
          }

          if (effect.formula && effect.formula !== 'damage') {
            mechanicsText += `: ${effect.formula}`;
          }

          if (effect.description && effect.description !== mechanicsText) {
            mechanicsText += ` - ${effect.description}`;
          }

          graduatedElements.push({
            effectName: 'Toxic Consumer',
            mechanicsText: mechanicsText,
            systemType: 'Graduated Effects',
            system: 'graduated_effects'
          });
        });
      });
    }

    // Check for graduated effects in chord and toxic system mechanics
    if (spell.effectMechanicsConfigs) {
      Object.entries(spell.effectMechanicsConfigs).forEach(([, config]) => {
        if (!config?.enabled) return;

        // Handle Chord System graduated effects
        if (config.system === 'CHORD_SYSTEM' && config.type === 'chord') {
          const graduatedEffects = config.chordOptions?.graduatedEffects;
          if (!graduatedEffects || Object.keys(graduatedEffects).length === 0) return;

          // Sort levels numerically
          const sortedLevels = Object.keys(graduatedEffects)
            .map(Number)
            .sort((a, b) => a - b);

          sortedLevels.forEach(level => {
            const effect = graduatedEffects[level];
            if (!effect) return;

            let mechanicsText = '';

            // Determine match type and requirements
            const requiredChords = effect.requiredToxicTypes || {};
            const requiredChordNames = Object.keys(requiredChords).map(chordId => {
              const chordName = chordId.charAt(0).toUpperCase() + chordId.slice(1);
              const count = requiredChords[chordId];
              return count > 1 ? `${chordName} (${count})` : chordName;
            });

            // Always show specific chord functions if they are configured
            if (requiredChordNames.length > 0) {
              mechanicsText = `${requiredChordNames.join(', ')}`;
            } else {
              mechanicsText = `${level} Chord Function${level > 1 ? 's' : ''}`;
            }

            if (effect.formula && effect.formula !== 'damage') {
              mechanicsText += `: ${effect.formula}`;
            }

            if (effect.description && effect.description !== mechanicsText) {
              mechanicsText += ` - ${effect.description}`;
            }

            graduatedElements.push({
              effectName: 'Chord System',
              mechanicsText: mechanicsText,
              systemType: 'Graduated Effects',
              system: 'graduated_effects'
            });
          });
        }

        // Handle Toxic System graduated effects
        if (config.system === 'TOXIC_SYSTEM' && (config.type === 'toxic_applier' || config.type === 'toxic_consumer')) {
          const graduatedEffects = config.toxicOptions?.toxicEffects;
          if (!graduatedEffects || Object.keys(graduatedEffects).length === 0) return;

          // Sort levels numerically
          const sortedLevels = Object.keys(graduatedEffects)
            .map(Number)
            .sort((a, b) => a - b);

          sortedLevels.forEach(level => {
            const effect = graduatedEffects[level];
            if (!effect) return;

            let mechanicsText = '';

            // Determine match type and requirements
            const matchType = effect.matchType || 'count';
            const requiredToxics = effect.requiredToxicTypes || {};
            const requiredToxicNames = Object.keys(requiredToxics).map(toxicId => {
              const toxicName = toxicId.charAt(0).toUpperCase() + toxicId.slice(1);
              const count = requiredToxics[toxicId];
              return count > 1 ? `${toxicName} (${count})` : toxicName;
            });

            // Always show specific toxic types if they are configured
            if (requiredToxicNames.length > 0) {
              mechanicsText = `${requiredToxicNames.join(', ')}`;
            } else {
              mechanicsText = `${level} Toxic Type${level > 1 ? 's' : ''}`;
            }

            if (effect.formula && effect.formula !== 'damage') {
              mechanicsText += `: ${effect.formula}`;
            }

            if (effect.description && effect.description !== mechanicsText) {
              mechanicsText += ` - ${effect.description}`;
            }

            graduatedElements.push({
              effectName: 'Toxic System',
              mechanicsText: mechanicsText,
              systemType: 'Graduated Effects',
              system: 'graduated_effects'
            });
          });
        }
      });
    }

    return graduatedElements;
  };

  // Helper function to process individual mechanic configurations
  const processMechanicConfig = (config, effectName) => {
    let mechanicsText = '';
    let systemType = '';

    switch (config.system) {
      case 'COMBO_POINTS':
        systemType = 'Combo Points';
        if (config.type === 'builder') {
          mechanicsText = 'Generates 1 combo point';
        } else if (config.type === 'spender') {
          mechanicsText = `Requires ${config.thresholdValue} combo points`;
          if (config.comboOptions?.consumptionRule === 'all') {
            mechanicsText += ' (consumes all)';
          } else if (config.comboOptions?.consumptionRule === 'none') {
            mechanicsText += ' (no consumption)';
          }
        }
        break;

        case 'PROC_SYSTEM':
          systemType = 'Proc System';
          mechanicsText = `${config.procOptions?.procChance || 15}% chance to trigger`;
          if (config.procOptions?.spellId) {
            // Try to find the spell name from the library context
            const linkedSpell = library?.spells?.find(s => s.id === config.procOptions.spellId);
            if (linkedSpell) {
              // Create a simple spell description
              let spellDesc = linkedSpell.name;

              // Add basic damage/healing info if available
              if (linkedSpell.damageConfig?.formula) {
                spellDesc += ` (${linkedSpell.damageConfig.formula} damage)`;
              } else if (linkedSpell.healingConfig?.formula) {
                spellDesc += ` (${linkedSpell.healingConfig.formula} healing)`;
              } else if (linkedSpell.buffConfig?.formula) {
                spellDesc += ` (${linkedSpell.buffConfig.formula} buff)`;
              }

              mechanicsText += ` ${spellDesc}`;
            } else {
              mechanicsText += ' linked spell';
            }
          } else {
            mechanicsText += ' additional effect';
          }
          if (config.procOptions?.triggerLimit > 1) {
            mechanicsText += ` (max ${config.procOptions.triggerLimit}/round)`;
          }
          break;

        case 'TOXIC_SYSTEM':
          systemType = 'Toxic System';
          if (config.type === 'toxic_applier') {
            const toxicTypes = config.toxicOptions?.selectedToxicTypes || {};
            const duration = config.toxicOptions?.duration || 3;
            const durationType = config.toxicOptions?.durationType || 'rounds';

            // Create detailed toxic effects list
            const toxicEffects = [];
            Object.entries(toxicTypes).forEach(([type, count]) => {
              if (count > 0) {
                const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
                toxicEffects.push(`${count}x ${capitalizedType}`);
              }
            });

            if (toxicEffects.length > 0) {
              mechanicsText = `Applies ${toxicEffects.join(', ')} for ${duration} ${durationType}`;
            } else {
              mechanicsText = 'Applies toxic effects (not configured)';
            }
          } else if (config.type === 'toxic_consumer') {
            const toxicTypes = config.toxicOptions?.selectedToxicTypes || {};
            const consumptionRule = config.toxicOptions?.consumptionRule || 'all';
            const updateFormula = config.toxicOptions?.updateFormula;

            // Create detailed consumption description
            const consumedEffects = [];
            Object.entries(toxicTypes).forEach(([type, count]) => {
              if (count > 0) {
                const capitalizedType = type.charAt(0).toUpperCase() + type.slice(1);
                consumedEffects.push(`${count}x ${capitalizedType}`);
              }
            });

            if (consumedEffects.length > 0) {
              mechanicsText = `Consumes ${consumedEffects.join(', ')}`;
              if (updateFormula) {
                mechanicsText += ' for enhanced effects';
              }
            } else {
              const ruleText = consumptionRule === 'all' ? 'all toxics' :
                             consumptionRule === 'specific' ? 'specific toxics' :
                             'threshold-based toxics';
              mechanicsText = `Consumes ${ruleText} for enhanced effects`;
            }
          }
          break;

        case 'CHORD_SYSTEM':
          systemType = 'Chord System';
          if (config.type === 'chord') {
            const recipeDisplay = config.chordOptions?.recipeDisplay || [];
            if (recipeDisplay.length > 0) {
              const recipeNames = recipeDisplay.map(chord => chord.name).join(' → ');
              mechanicsText = `Requires chord: ${recipeNames}`;
              if (config.chordOptions?.improvisationWindow) {
                mechanicsText += ` (${config.chordOptions.improvisationWindow} rounds)`;
              }
            } else {
              mechanicsText = 'Requires chord sequence (not configured)';
            }
          } else if (config.type === 'note') {
            const chordFunction = config.chordOptions?.chordFunction || 'tonic';
            // Capitalize the chord function name
            const functionName = chordFunction.charAt(0).toUpperCase() + chordFunction.slice(1).replace('_', ' ');
            mechanicsText = `Plays ${functionName} note`;
          } else if (config.type === 'wildcard') {
            mechanicsText = 'Wildcard note (any chord function)';
          } else if (config.type === 'extender') {
            const duration = config.chordOptions?.extendDuration || 1;
            mechanicsText = `Extends improvisation window by ${duration} round${duration !== 1 ? 's' : ''}`;
          }
          break;

        case 'STATE_REQUIREMENTS':
          systemType = 'State Requirements';
          const resourceType = config.stateOptions?.resourceType || 'health';
          const thresholdType = config.stateOptions?.thresholdType || 'below';
          const thresholdValue = config.stateOptions?.thresholdValue || 50;
          const modifiedFormula = config.stateOptions?.modifiedFormula;
          const capitalizedResource = resourceType.charAt(0).toUpperCase() + resourceType.slice(1);

          mechanicsText = `Enhanced when target ${capitalizedResource} is ${thresholdType} ${thresholdValue}%`;
          if (modifiedFormula) {
            mechanicsText += ` (formula becomes: ${modifiedFormula})`;
          }
          break;

        case 'FORM_SYSTEM':
          systemType = 'Form System';
          const formType = config.formOptions?.formType?.replace('_', ' ') || 'specific form';
          const requiresForm = config.formOptions?.requiresForm;
          const bonusType = config.formOptions?.bonusType || 'damage';
          const bonusAmount = config.formOptions?.bonusAmount || 20;
          const formSpellId = config.formOptions?.formSpellId;

          const capitalizedForm = formType.split(' ').map(word =>
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' ');

          mechanicsText = `${requiresForm ? 'Requires' : 'Enhanced by'} ${capitalizedForm}`;

          // Add bonus information
          mechanicsText += ` (+${bonusAmount}% ${bonusType})`;

          // Add form spell information if available
          if (formSpellId) {
            const formSpell = library?.spells?.find(s => s.id === formSpellId);
            if (formSpell) {
              mechanicsText += ` using ${formSpell.name}`;
            } else {
              mechanicsText += ` using linked form spell`;
            }
          }
          break;

        default:
          systemType = config.system.replace('_', ' ');
          mechanicsText = `${config.system.replace('_', ' ').toLowerCase()} mechanic`;
    }

    if (mechanicsText) {
      return {
        effectName,
        mechanicsText,
        systemType,
        system: config.system
      };
    }

    return null;
  };

  // ===== CHANCE ON HIT FORMATTING =====
  const formatChanceOnHit = () => {
    const chanceConfig = spell.damageConfig?.chanceOnHitConfig || spell.healingConfig?.chanceOnHitConfig || spell.chanceOnHitConfig;
    if (!chanceConfig?.enabled) return null;

    const { procType, procChance, diceThreshold, cardProcRule, coinProcRule, coinCount,
            spellEffect, useRollableTable, procSuit, customEffects } = chanceConfig;

    let procText = '';
    let effectText = '';

    // Determine what effect happens
    if (useRollableTable) {
      effectText = 'triggers rollable table';
    } else if (spellEffect) {
      // Try to get spell name from library or use ID
      effectText = `casts ${spellEffect}`;
    } else if (customEffects && customEffects.length > 0) {
      // Format custom effects (like burning, stun, knockback, etc.)
      const formattedEffects = customEffects.map(effect => {
        return effect.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
      }).join(', ');
      effectText = formattedEffects;
    } else {
      effectText = 'triggers effect';
    }

    // Format based on resolution type
    switch (procType) {
      case 'dice':
        procText = `Roll d20: ${diceThreshold}+ (${procChance}%) ${effectText}`;
        break;
      case 'cards':
        let cardRule = '';
        let cardChance = '';

        if (cardProcRule === 'face_cards') {
          cardRule = 'Face Cards (J,Q,K)';
          cardChance = '23%';
        } else if (cardProcRule === 'aces') {
          cardRule = 'Aces';
          cardChance = '8%';
        } else if (cardProcRule === 'specific_suit') {
          cardRule = `${procSuit?.charAt(0).toUpperCase() + procSuit?.slice(1) || 'Hearts'} suit`;
          cardChance = '25%';
        } else if (cardProcRule === 'red_cards') {
          cardRule = 'Red Cards';
          cardChance = '50%';
        } else if (cardProcRule === 'black_cards') {
          cardRule = 'Black Cards';
          cardChance = '50%';
        } else if (cardProcRule === 'pairs') {
          cardRule = 'Pairs';
          cardChance = '6%';
        } else {
          cardRule = cardProcRule.replace('_', ' ');
          cardChance = '25%';
        }

        procText = `Draw card: ${cardRule} (${cardChance}) ${effectText}`;
        break;
      case 'coins':
        let coinRule = '';
        let coinChance = '';

        if (coinProcRule === 'all_heads') {
          coinRule = 'All Heads';
          coinChance = (Math.pow(0.5, coinCount) * 100).toFixed(1) + '%';
        } else if (coinProcRule === 'all_tails') {
          coinRule = 'All Tails';
          coinChance = (Math.pow(0.5, coinCount) * 100).toFixed(1) + '%';
        } else if (coinProcRule === 'sequence') {
          coinRule = 'Specific Sequence';
          coinChance = (Math.pow(0.5, coinCount) * 100).toFixed(1) + '%';
        } else if (coinProcRule === 'pattern') {
          coinRule = 'Pattern Match';
          coinChance = '25%';
        } else {
          coinRule = coinProcRule.replace('_', ' ');
          coinChance = '50%';
        }

        procText = `Flip ${coinCount} coins: ${coinRule} (${coinChance}) ${effectText}`;
        break;
      default:
        procText = `${procChance}% chance ${effectText}`;
    }

    return procText;
  };

  // ===== TRIGGER FORMATTING HELPER =====
  const formatTriggerText = (trigger) => {
    if (!trigger) return trigger?.name || 'Unknown trigger';

    let displayText = trigger.name;

    // Handle all trigger types with comprehensive parameter support
    if (trigger.id === 'damage_taken') {
      const amount = trigger.parameters?.amount;
      const damageType = trigger.parameters?.damage_type;
      const perspective = trigger.parameters?.perspective || 'self';

      const whoMap = {
        'self': 'I take',
        'target': 'my target takes',
        'ally': 'an ally takes',
        'enemy': 'an enemy takes',
        'any': 'anyone takes'
      };

      displayText = `When ${whoMap[perspective]}`;
      if (amount) displayText += ` ${amount} pts of`;
      if (damageType && damageType !== 'any') {
        displayText += ` ${damageType}`;
      }
      displayText += ' damage';
    } else if (trigger.id === 'damage_dealt') {
      const perspective = trigger.parameters?.perspective || 'self';
      const amount = trigger.parameters?.amount || '';
      const damageType = trigger.parameters?.damage_type || 'any';

      const whoMap = {
        'self': 'I deal',
        'target': 'my target deals',
        'ally': 'an ally deals',
        'enemy': 'an enemy deals',
        'any': 'anyone deals'
      };

      displayText = `When ${whoMap[perspective] || 'I deal'}`;
      if (amount) displayText += ` ${amount} pts of`;
      if (damageType && damageType !== 'any') displayText += ` ${damageType}`;
      displayText += ' damage';
    } else if (trigger.id === 'critical_hit') {
      const perspective = trigger.parameters?.perspective || 'self';
      const whoMap = {
        'self': 'I land',
        'target': 'my target lands',
        'ally': 'an ally lands',
        'enemy': 'an enemy lands',
        'any': 'anyone lands'
      };
      displayText = `When ${whoMap[perspective]} a critical hit`;
    } else if (trigger.id === 'critical_hit_taken') {
      const perspective = trigger.parameters?.perspective || 'self';
      const whoMap = {
        'self': 'I receive',
        'target': 'my target receives',
        'ally': 'an ally receives',
        'enemy': 'an enemy receives',
        'any': 'anyone receives'
      };
      displayText = `When ${whoMap[perspective]} a critical hit`;
    } else if (trigger.id === 'miss') {
      const perspective = trigger.parameters?.perspective || 'self';
      const whoMap = {
        'self': 'When an enemy\'s attack misses me',
        'target': 'When my target\'s attack misses',
        'ally': 'When an ally\'s attack misses',
        'enemy': 'When an enemy\'s attack misses',
        'any': 'When anyone\'s attack misses'
      };
      displayText = whoMap[perspective] || 'When an enemy\'s attack misses me';
    } else if (trigger.id === 'dodge') {
      const perspective = trigger.parameters?.perspective || 'self';
      const whoMap = {
        'self': 'When I dodge an attack',
        'target': 'When my target dodges an attack',
        'ally': 'When an ally dodges an attack',
        'enemy': 'When an enemy dodges an attack',
        'any': 'When anyone dodges an attack'
      };
      displayText = whoMap[perspective] || 'When I dodge an attack';
    } else if (trigger.id === 'parry') {
      const perspective = trigger.parameters?.perspective || 'self';
      const whoMap = {
        'self': 'When I parry an attack',
        'target': 'When my target parries an attack',
        'ally': 'When an ally parries an attack',
        'enemy': 'When an enemy parries an attack',
        'any': 'When anyone parries an attack'
      };
      displayText = whoMap[perspective] || 'When I parry an attack';
    } else if (trigger.id === 'block') {
      const perspective = trigger.parameters?.perspective || 'self';
      const whoMap = {
        'self': 'When I block an attack',
        'target': 'When my target blocks an attack',
        'ally': 'When an ally blocks an attack',
        'enemy': 'When an enemy blocks an attack',
        'any': 'When anyone blocks an attack'
      };
      displayText = whoMap[perspective] || 'When I block an attack';
    } else if (trigger.id === 'leave_area') {
      const perspective = trigger.parameters?.perspective || 'self';
      const areaType = trigger.parameters?.area_type || 'area';
      const whoMap = {
        'self': 'I leave',
        'target': 'my target leaves',
        'ally': 'an ally leaves',
        'enemy': 'an enemy leaves',
        'any': 'anyone leaves'
      };
      displayText = `When ${whoMap[perspective] || 'I leave'} ${areaType}`;
    } else if (trigger.id === 'enter_area') {
      const perspective = trigger.parameters?.perspective || 'self';
      const areaType = trigger.parameters?.area_type || 'area';
      const whoMap = {
        'self': 'I enter',
        'target': 'my target enters',
        'ally': 'an ally enters',
        'enemy': 'an enemy enters',
        'any': 'anyone enters'
      };
      displayText = `When ${whoMap[perspective] || 'I enter'} ${areaType}`;
    } else if (trigger.id === 'proximity') {
      const distance = trigger.parameters?.distance || 30;
      const entityType = trigger.parameters?.entity_type || 'any';
      const entityMap = {
        'any': 'anyone',
        'ally': 'an ally',
        'enemy': 'an enemy',
        'self': 'I'
      };
      displayText = `When ${entityMap[entityType] || 'anyone'} comes within ${distance} ft`;
    } else if (trigger.id === 'health_threshold') {
      const perspective = trigger.parameters?.perspective || 'self';
      const percentage = trigger.parameters?.percentage || 50;
      const comparison = trigger.parameters?.comparison || 'below';
      const whoMap = {
        'self': 'my health',
        'target': 'target\'s health',
        'ally': 'ally\'s health',
        'enemy': 'enemy\'s health',
        'any': 'anyone\'s health'
      };
      const compMap = {
        'below': 'falls below',
        'above': 'rises above',
        'equals': 'equals'
      };
      displayText = `When ${whoMap[perspective] || 'my health'} ${compMap[comparison] || 'falls below'} ${percentage}%`;
    } else if (trigger.id === 'spell_cast') {
      const spellName = trigger.parameters?.spell_name || 'a spell';
      const perspective = trigger.parameters?.perspective || 'self';
      const whoMap = {
        'self': 'I cast',
        'target': 'my target casts',
        'ally': 'an ally casts',
        'enemy': 'an enemy casts',
        'any': 'anyone casts'
      };
      displayText = `When ${whoMap[perspective]} ${spellName}`;
    } else if (trigger.id === 'turn_start') {
      const perspective = trigger.parameters?.perspective || 'self';
      const whoMap = {
        'self': 'my turn starts',
        'target': 'target\'s turn starts',
        'ally': 'ally\'s turn starts',
        'enemy': 'enemy\'s turn starts',
        'any': 'anyone\'s turn starts'
      };
      displayText = `When ${whoMap[perspective] || 'my turn starts'}`;
    } else if (trigger.id === 'turn_end') {
      const perspective = trigger.parameters?.perspective || 'self';
      const whoMap = {
        'self': 'my turn ends',
        'target': 'target\'s turn ends',
        'ally': 'ally\'s turn ends',
        'enemy': 'enemy\'s turn ends',
        'any': 'anyone\'s turn ends'
      };
      displayText = `When ${whoMap[perspective] || 'my turn ends'}`;
    } else if (trigger.id === 'combat_start') {
      displayText = 'When combat starts';
    } else if (trigger.id === 'combat_end') {
      displayText = 'When combat ends';
    } else if (trigger.id === 'low_health') {
      const threshold = trigger.parameters?.threshold || 25;
      displayText = `When below ${threshold}% health`;
    } else if (trigger.id === 'movement_start') {
      const perspective = trigger.parameters?.perspective || 'self';
      const whoMap = {
        'self': 'When I start moving',
        'target': 'When my target starts moving',
        'ally': 'When an ally starts moving',
        'enemy': 'When an enemy starts moving',
        'any': 'When anyone starts moving'
      };
      displayText = whoMap[perspective] || 'When I start moving';
    } else if (trigger.id === 'movement_end') {
      const perspective = trigger.parameters?.perspective || 'self';
      const whoMap = {
        'self': 'When I stop moving',
        'target': 'When my target stops moving',
        'ally': 'When an ally stops moving',
        'enemy': 'When an enemy stops moving',
        'any': 'When anyone stops moving'
      };
      displayText = whoMap[perspective] || 'When I stop moving';
    } else if (trigger.id === 'effect_applied') {
      const perspective = trigger.parameters?.perspective || 'self';
      const effectType = trigger.parameters?.effect_type || 'effect';
      const whoMap = {
        'self': 'I gain',
        'target': 'my target gains',
        'ally': 'an ally gains',
        'enemy': 'an enemy gains',
        'any': 'anyone gains'
      };
      displayText = `When ${whoMap[perspective] || 'I gain'} ${effectType}`;
    } else if (trigger.id === 'effect_removed') {
      const perspective = trigger.parameters?.perspective || 'self';
      const effectType = trigger.parameters?.effect_type || 'effect';
      const whoMap = {
        'self': 'I lose',
        'target': 'my target loses',
        'ally': 'an ally loses',
        'enemy': 'an enemy loses',
        'any': 'anyone loses'
      };
      displayText = `When ${whoMap[perspective] || 'I lose'} ${effectType}`;
    } else if (trigger.id === 'on_death') {
      const targetType = trigger.parameters?.target_type || 'any';
      const targetMap = {
        'self': 'I die',
        'ally': 'an ally dies',
        'enemy': 'an enemy dies',
        'any': 'anyone dies'
      };
      displayText = `When ${targetMap[targetType] || 'anyone dies'}`;
    } else if (trigger.id === 'near_death') {
      const threshold = trigger.parameters?.health_threshold || 10;
      const targetType = trigger.parameters?.target_type || 'self';
      const targetMap = {
        'self': 'I am',
        'ally': 'an ally is',
        'enemy': 'an enemy is',
        'any': 'anyone is'
      };
      displayText = `When ${targetMap[targetType] || 'I am'} near death (${threshold}% health)`;
    } else if (trigger.id === 'stepped_on') {
      const creatureType = trigger.parameters?.creature_type || 'any';
      const creatureMap = {
        'any': 'any creature',
        'enemy': 'an enemy',
        'ally': 'an ally',
        'player': 'a player',
        'npc': 'an NPC'
      };
      displayText = `When ${creatureMap[creatureType] || 'any creature'} steps on the trap`;
    } else if (trigger.id === 'timer') {
      const seconds = trigger.parameters?.seconds || trigger.parameters?.time || 10;
      displayText = `After ${seconds} seconds`;
    } else if (trigger.id === 'weather_change') {
      const weatherType = trigger.parameters?.weather_type || 'rain';
      displayText = `When weather changes to ${weatherType}`;
    } else if (trigger.id === 'day_night') {
      const isDay = trigger.parameters?.is_day !== false;
      displayText = `When it becomes ${isDay ? 'day' : 'night'}`;
    } else if (trigger.id === 'underwater') {
      displayText = 'When underwater';
    } else if (trigger.id === 'in_darkness') {
      displayText = 'When in darkness or dim light';
    } else if (trigger.id === 'in_bright_light') {
      displayText = 'When in bright light';
    } else if (trigger.id === 'round_start') {
      displayText = 'When a combat round starts';
    } else if (trigger.id === 'round_end') {
      displayText = 'When a combat round ends';
    } else if (trigger.id === 'first_strike') {
      const perspective = trigger.parameters?.perspective || 'self';
      const whoMap = {
        'self': 'I make the first attack',
        'target': 'my target makes the first attack',
        'ally': 'an ally makes the first attack',
        'enemy': 'an enemy makes the first attack',
        'any': 'anyone makes the first attack'
      };
      displayText = `When ${whoMap[perspective] || 'I make the first attack'}`;
    } else if (trigger.id === 'last_stand' || trigger.id === 'last_ally_standing') {
      displayText = 'When I am the last ally standing';
    } else if (trigger.id === 'outnumbered') {
      const ratio = trigger.parameters?.ratio || 2;
      displayText = `When outnumbered ${ratio}:1`;
    } else if (trigger.id === 'forced_movement') {
      const perspective = trigger.parameters?.perspective || 'self';
      const whoMap = {
        'self': 'I am forcibly moved',
        'target': 'my target is forcibly moved',
        'ally': 'an ally is forcibly moved',
        'enemy': 'an enemy is forcibly moved',
        'any': 'anyone is forcibly moved'
      };
      displayText = `When ${whoMap[perspective] || 'I am forcibly moved'}`;
    } else if (trigger.id === 'falling') {
      const perspective = trigger.parameters?.perspective || 'self';
      const whoMap = {
        'self': 'I am falling',
        'target': 'my target is falling',
        'ally': 'an ally is falling',
        'enemy': 'an enemy is falling',
        'any': 'anyone is falling'
      };
      displayText = `When ${whoMap[perspective] || 'I am falling'}`;
    }
    // Handle any remaining triggers with fallback logic

    return displayText;
  };

  // ===== CRITICAL HIT FORMATTING =====
  const formatCriticalHit = () => {
    const critConfig = spell.damageConfig?.criticalConfig || spell.healingConfig?.criticalConfig || spell.criticalConfig;
    if (!critConfig?.enabled) return null;

    if (critConfig.critOnlyEffect) {
      // Include special effects in effect-only mode
      const effects = critConfig.critEffects || [];
      if (effects.length > 0) {
        const effectNames = effects.map(effect => {
          // Format effect names nicely
          return effect.charAt(0).toUpperCase() + effect.slice(1);
        }).join(', ');
        return `Effect only: ${effectNames}`;
      }
      return 'Effect only on critical hit';
    }

    const { critType, critMultiplier, extraDice, cardCritRule, coinCritRule, coinCount,
            cardCritResolution, coinCritResolution, extraCardDraw, extraCoinFlips,
            explodingDice, explodingDiceType, critEffects } = critConfig;

    let critText = '';

    // Format based on resolution type
    if (critType === 'cards') {
      const rule = cardCritRule === 'face_cards' ? 'Face Cards (J,Q,K)' :
                   cardCritRule === 'aces' ? 'Aces' :
                   cardCritRule === 'specific_suit' ? 'Specific Suit' :
                   cardCritRule === 'red_cards' ? 'Red Cards' :
                   cardCritRule === 'black_cards' ? 'Black Cards' : 'Face Cards';

      if (cardCritResolution === 'draw_add') {
        critText = `${rule}: ${critMultiplier}x damage + draw ${extraCardDraw} extra cards`;
      } else if (cardCritResolution === 'multiply_value') {
        critText = `${rule}: multiply card values by ${critMultiplier}`;
      } else {
        critText = `${rule}: ${critMultiplier}x damage`;
      }

      if (extraDice) {
        critText += ` + ${extraDice}`;
      }
    } else if (critType === 'coins') {
      const rule = coinCritRule === 'all_heads' ? 'All Heads' :
                   coinCritRule === 'all_tails' ? 'All Tails' :
                   coinCritRule === 'sequence' ? 'Specific Sequence' :
                   coinCritRule === 'majority' ? 'Majority' : 'All Heads';

      if (coinCritResolution === 'flip_add') {
        critText = `${rule} (${coinCount} coins): ${critMultiplier}x damage + flip ${extraCoinFlips} extra coins`;
      } else if (coinCritResolution === 'multiply_value') {
        critText = `${rule} (${coinCount} coins): multiply heads by ${critMultiplier}`;
      } else {
        critText = `${rule} (${coinCount} coins): ${critMultiplier}x damage`;
      }

      if (extraDice) {
        critText += ` + ${extraDice}`;
      }
    } else {
      // Dice-based critical
      critText = `Max roll: ${critMultiplier}x damage`;
      if (extraDice) {
        critText += ` + ${extraDice}`;
      }
    }

    // Add exploding dice information if enabled
    if (explodingDice) {
      const explodingText = explodingDiceType === 'reroll_add' ? 'exploding dice' :
                           explodingDiceType === 'double_value' ? 'double max values' :
                           explodingDiceType === 'add_max' ? 'add max on max' : 'exploding';
      critText += ` (${explodingText})`;
    }

    // Add special effects if any are selected
    if (critEffects && critEffects.length > 0) {
      const effectNames = critEffects.map(effect => {
        // Format effect names nicely
        return effect.charAt(0).toUpperCase() + effect.slice(1);
      }).join(', ');
      critText += ` + ${effectNames}`;
    }

    return critText;
  };

  // ===== STANDARDIZED SAVING THROW FORMATTING =====
  const formatSavingThrow = (config = null, effectType = 'damage') => {
    // Handle different config sources
    let saveConfig = config;
    if (!saveConfig) {
      saveConfig = spell.damageConfig?.savingThrowConfig ||
                   spell.debuffConfig ||
                   spell.controlConfig ||
                   spell.savingThrowConfig;
    }

    if (!saveConfig?.enabled && !saveConfig?.savingThrow && !saveConfig?.difficultyClass) return null;

    // Determine save type with fallbacks
    const saveType = saveConfig.savingThrowType ||
                     saveConfig.savingThrow ||
                     'constitution';

    const formattedSaveType = saveType.charAt(0).toUpperCase() + saveType.slice(1);
    const dc = saveConfig.difficultyClass || 15;

    // Determine save outcome based on effect type and config
    let outcomeText = '';
    if (saveConfig.partialEffect) {
      const formula = saveConfig.partialEffectFormula || 'damage/2';
      outcomeText = ` (${formula} on save)`;
    } else if (saveConfig.saveOutcome) {
      const outcomeMap = {
        'negates': 'negated on save',
        'halves_duration': 'duration halved on save',
        'halves_effects': 'effects halved on save',
        'reduces_level': 'level reduced on save',
        'ends_early': 'ends next turn on save',
        'resists_commands': 'can resist commands on save',
        'broken': 'broken on save',
        'overcome': 'overcome on save'
      };
      outcomeText = ` (${outcomeMap[saveConfig.saveOutcome] || 'modified on save'})`;
    } else {
      // Default outcomes based on effect type
      const defaultOutcomes = {
        'damage': 'negated on save',
        'debuff': 'negated on save',
        'control': 'negated on save',
        'status': 'overcome on save'
      };
      outcomeText = ` (${defaultOutcomes[effectType] || 'negated on save'})`;
    }

    return {
      formatted: `DC ${dc} ${formattedSaveType}${outcomeText}`,
      saveType: formattedSaveType,
      dc: dc,
      outcome: outcomeText.replace(/[()]/g, '').trim()
    };
  };

  const formatDamage = () => {
    if (!spell || !spell.damageConfig) return null;

    // Debug logging for external preview (commented out to avoid browser issues)
    // if (variant === 'wizard') {
    //   console.log('UnifiedSpellCard formatDamage:', {
    //     spellName: spell.name,
    //     resolution: spell.resolution,
    //     cardConfig: spell.cardConfig,
    //     coinConfig: spell.coinConfig,
    //     damageConfig: spell.damageConfig,
    //     effectTypes: spell.effectTypes,
    //     tags: spell.tags
    //   });
    // }



    let damageText = '';
    let dotText = '';

    // Check if this is a pure DoT spell (no instant damage)
    const isPureDoT = spell.damageConfig?.damageType === 'dot' && !spell.damageConfig?.hasDotEffect;

    // Only show instant damage if it's NOT a pure DoT spell
    if (!isPureDoT) {
      // Handle card/coin resolution display - always show for CARDS/COINS resolution
      if (spell.resolution === 'CARDS') {
          const cardConfig = spell.cardConfig || spell.damageConfig?.cardConfig;
          // Always show the draw count, even if it's the default (consistent with ExternalLivePreview)
          const drawCount = cardConfig?.drawCount !== undefined ? cardConfig.drawCount : 3;
          const formula = cardConfig?.formula || spell.damageConfig?.formula || 'CARD_VALUE + POKER_HAND_RANK * 3';
          // Just clean up spacing and formatting, don't convert to readable text
          const cleanedFormula = cleanFormula(formula);
          damageText = `Draw ${drawCount} cards: ${cleanedFormula}`;
      } else if (spell.resolution === 'COINS') {
          const coinConfig = spell.coinConfig || spell.damageConfig?.coinConfig;
          // Always show the flip count, even if it's the default (consistent with ExternalLivePreview)
          const flipCount = coinConfig?.flipCount !== undefined ? coinConfig.flipCount : 4;
          const formula = coinConfig?.formula || spell.damageConfig?.formula || 'HEADS_COUNT * 6 + LONGEST_STREAK * 2';
          // Just clean up spacing and formatting, don't convert to readable text
          const cleanedFormula = cleanFormula(formula);
          damageText = `Flip ${flipCount} coins: ${cleanedFormula}`;
      } else if (spell.resolution === 'DICE' && (spell.diceConfig?.formula || spell.damageConfig?.formula)) {
          const formula = spell.diceConfig?.formula || spell.damageConfig?.formula || '1d6 + intelligence';
          // Just clean up spacing and formatting, don't convert to readable text
          damageText = cleanFormula(formula);
      } else if (spell.damageConfig?.formula) {
          // Just clean up spacing and formatting, don't convert to readable text
          damageText = cleanFormula(spell.damageConfig.formula);
      } else if (spell.primaryDamage?.dice) {
          const dice = spell.primaryDamage.dice;
          const flat = spell.primaryDamage.flat > 0 ? ` + ${spell.primaryDamage.flat}` : '';
          // Just clean up spacing and formatting, don't convert to readable text
          damageText = cleanFormula(`${dice}${flat}`);
      }
    }

    // Handle DoT (Damage over Time)
    if (spell.damageConfig?.hasDotEffect || spell.damageConfig?.damageType === 'dot') {
      const duration = spell.damageConfig?.dotConfig?.duration || 3;
      const tickFrequency = spell.damageConfig?.dotConfig?.tickFrequency || 'round';

      // Format duration text
      const durationText = duration === 1 ? `1 ${tickFrequency}` : `${duration} ${tickFrequency}s`;

      // Check if this is progressive DoT
      const isProgressiveDot = spell.damageConfig?.dotConfig?.isProgressiveDot &&
                               spell.damageConfig?.dotConfig?.progressiveStages?.length > 0;

      if (isProgressiveDot) {
        // Format progressive DoT stages showing all formulas with arrows
        const stages = spell.damageConfig.dotConfig.progressiveStages;

        // Check if using card/coin resolution for progressive DoT
        const cardConfig = spell.cardConfig;
        const coinConfig = spell.coinConfig;

        if (stages.length === 1) {
          // Single stage - just show the formula with special effect if present
          const stage = stages[0];
          const cleanedFormula = cleanFormula(stage.formula);
          const effectText = stage.spellEffect ? ` (${stage.spellEffect})` : '';

          // Add card/coin info if applicable
          if (spell.resolution === 'CARDS' && cardConfig) {
            const drawCount = cardConfig.drawCount || 3;
            dotText = `Draw ${drawCount} cards: ${cleanedFormula}${effectText} per ${tickFrequency} for ${durationText}`;
          } else if (spell.resolution === 'COINS' && coinConfig) {
            const flipCount = coinConfig.flipCount || 4;
            dotText = `Flip ${flipCount} coins: ${cleanedFormula}${effectText} per ${tickFrequency} for ${durationText}`;
          } else {
            dotText = `${cleanedFormula}${effectText} per ${tickFrequency} for ${durationText}`;
          }
        } else {
          // Multiple stages - show all formulas with arrows and special effects
          const formulas = stages.map(stage => {
            const cleanedFormula = cleanFormula(stage.formula);

            // Add special effect if present
            if (stage.spellEffect) {
              return `${cleanedFormula} (${stage.spellEffect})`;
            }
            return cleanedFormula;
          });

          // Add card/coin info if applicable
          if (spell.resolution === 'CARDS' && cardConfig) {
            const drawCount = cardConfig.drawCount || 3;
            dotText = `Draw ${drawCount} cards: ${formulas.join(' → ')} over ${durationText}`;
          } else if (spell.resolution === 'COINS' && coinConfig) {
            const flipCount = coinConfig.flipCount || 4;
            dotText = `Flip ${flipCount} coins: ${formulas.join(' → ')} over ${durationText}`;
          } else {
            dotText = `${formulas.join(' → ')} over ${durationText}`;
          }
        }
      } else if (spell.resolution === 'CARDS') {
        // Use dotConfig cardConfig if available, otherwise fall back to main cardConfig
        const cardConfig = spell.damageConfig?.dotConfig?.cardConfig || spell.cardConfig;
        const drawCount = cardConfig?.drawCount !== undefined ? cardConfig.drawCount : 3;
        const formula = cardConfig?.formula || 'CARD_VALUE/2 + intelligence/3';
        const cleanedFormula = cleanFormula(formula);
        dotText = `Draw ${drawCount} cards: ${cleanedFormula} per ${tickFrequency} for ${durationText}`;
      } else if (spell.resolution === 'COINS') {
        // Use dotConfig coinConfig if available, otherwise fall back to main coinConfig
        const coinConfig = spell.damageConfig?.dotConfig?.coinConfig || spell.coinConfig;
        const flipCount = coinConfig?.flipCount !== undefined ? coinConfig.flipCount : 4;
        const formula = coinConfig?.formula || 'HEADS_COUNT * 2 + intelligence/3';
        const cleanedFormula = cleanFormula(formula);
        dotText = `Flip ${flipCount} coins: ${cleanedFormula} per ${tickFrequency} for ${durationText}`;
      } else {
        // Standard dice-based DoT
        const dotFormula = spell.damageConfig?.dotConfig?.dotFormula || spell.damageConfig?.formula || '1d4 + intelligence/2';
        const cleanedDotFormula = cleanFormula(dotFormula);
        dotText = `${cleanedDotFormula} per ${tickFrequency} for ${durationText}`;
      }
    }





    // Combine damage and DoT text intelligently
    let finalText = null;

    // Legacy damage + DoT combination logic for backwards compatibility
    if (damageText && dotText) {
      // Check if both use the same resolution method to avoid redundancy
      const bothUseCards = spell.resolution === 'CARDS' && damageText.includes('Draw') && dotText.includes('Draw');
      const bothUseCoins = spell.resolution === 'COINS' && damageText.includes('Flip') && dotText.includes('Flip');
      const bothUseDice = spell.resolution === 'DICE' || (!bothUseCards && !bothUseCoins);

      if (bothUseCards) {
        // Extract formulas from both instant and DoT
        const instantMatch = damageText.match(/Draw (\d+) cards: (.+)/);
        const dotMatch = dotText.match(/Draw (\d+) cards: (.+?) per .+ for (.+)/);

        if (instantMatch && dotMatch) {
          const [, instantCardCount, instantFormula] = instantMatch;
          const [, dotCardCount, dotFormula, durationText] = dotMatch;

          // Check if formulas are the same
          if (instantFormula.trim() === dotFormula.trim() && instantCardCount === dotCardCount) {
            finalText = `Draw ${instantCardCount} cards: ${instantFormula} (instant + DoT for ${durationText})`;
          } else {
            // Different formulas, show both clearly on separate lines
            finalText = {
              instant: `Draw ${instantCardCount} cards: ${instantFormula}`,
              dot: `Draw ${dotCardCount} cards: ${dotFormula} per round for ${durationText}`
            };
          }
        } else {
          finalText = { combined: `${damageText}. Then ${dotText}` };
        }
      } else if (bothUseCoins) {
        // Extract formulas from both instant and DoT
        const instantMatch = damageText.match(/Flip (\d+) coins: (.+)/);
        const dotMatch = dotText.match(/Flip (\d+) coins: (.+?) per .+ for (.+)/);

        if (instantMatch && dotMatch) {
          const [, instantCoinCount, instantFormula] = instantMatch;
          const [, dotCoinCount, dotFormula, durationText] = dotMatch;

          // Check if formulas are the same
          if (instantFormula.trim() === dotFormula.trim() && instantCoinCount === dotCoinCount) {
            finalText = `Flip ${instantCoinCount} coins: ${instantFormula} (instant + DoT for ${durationText})`;
          } else {
            // Different formulas, show both clearly on separate lines
            finalText = {
              instant: `Flip ${instantCoinCount} coins: ${instantFormula}`,
              dot: `Flip ${dotCoinCount} coins: ${dotFormula} per round for ${durationText}`
            };
          }
        } else {
          finalText = { combined: `${damageText}. Then ${dotText}` };
        }
      } else {
        // Different resolution methods or dice-based, show both on separate lines
        finalText = {
          instant: damageText,
          dot: dotText
        };
      }
    } else if (damageText) {
      finalText = damageText;
    } else if (dotText) {
      finalText = dotText;
    }

    // Return the formatted text - handle both string and object formats
    if (typeof finalText === 'object' && finalText !== null) {
      if (finalText.combined) {
        return finalText.combined;
      } else if (finalText.instant && finalText.dot) {
        return { instant: finalText.instant, dot: finalText.dot };
      }
    }

    // Debug logging for final result (commented out to avoid browser issues)
    // if (variant === 'wizard') {
    //   console.log('UnifiedSpellCard Final Damage Text:', {
    //     damageText,
    //     dotText,
    //     finalText,
    //     resolution: spell.resolution,
    //     cardConfig: spell.cardConfig,
    //     coinConfig: spell.coinConfig
    //   });
    // }

    // Return the final text (string case)
    return finalText;



    return finalText;
  };

  const formatHealing = () => {
    if (!spell) return null;

    // Use the main cleanFormula function defined above



    // Check for healingConfig-based healing first (new system)
    if (spell.healingConfig) {
      const healingType = spell.healingConfig.healingType;

      // Handle different healing types
      if (healingType === 'direct') {
        // Direct healing - check resolution method
        if (spell.resolution === 'CARDS' && spell.healingConfig.cardConfig?.formula) {
          const cardConfig = spell.healingConfig.cardConfig;
          const drawCount = cardConfig.drawCount !== undefined ? cardConfig.drawCount : 3;
          return `Draw ${drawCount} cards: ${cleanFormula(cardConfig.formula)}`;
        } else if (spell.resolution === 'COINS' && spell.healingConfig.coinConfig?.formula) {
          const coinConfig = spell.healingConfig.coinConfig;
          const flipCount = coinConfig.flipCount !== undefined ? coinConfig.flipCount : 4;
          return `Flip ${flipCount} coins: ${cleanFormula(coinConfig.formula)}`;
        } else if (spell.healingConfig.formula) {
          // Dice-based direct healing
          return cleanFormula(spell.healingConfig.formula);
        }
      } else if (healingType === 'hot') {
        // HoT healing - check resolution method
        if (spell.resolution === 'CARDS' && spell.healingConfig.hotCardConfig?.formula) {
          const cardConfig = spell.healingConfig.hotCardConfig;
          const drawCount = cardConfig.drawCount !== undefined ? cardConfig.drawCount : 3;
          const duration = spell.healingConfig.hotDuration || 3;
          const tickFrequency = spell.healingConfig.hotTickType || 'round';
          const durationText = duration === 1 ? `1 ${tickFrequency}` : `${duration} ${tickFrequency}s`;

          // Check if progressive HoT is enabled
          if (spell.healingConfig.isProgressiveHot && spell.healingConfig.hotProgressiveStages?.length > 0) {
            const unitLabel = tickFrequency === 'round' ? 'Round' :
                             tickFrequency === 'turn' ? 'Turn' :
                             tickFrequency.charAt(0).toUpperCase() + tickFrequency.slice(1);

            const progressiveText = spell.healingConfig.hotProgressiveStages
              .map(stage => `${unitLabel} ${stage.turn}: Draw ${drawCount} cards: ${cleanFormula(stage.formula)}`)
              .join(' → ');

            return progressiveText;
          } else {
            return `Draw ${drawCount} cards: ${cleanFormula(cardConfig.formula)} per ${tickFrequency} for ${durationText}`;
          }
        } else if (spell.resolution === 'COINS' && spell.healingConfig.hotCoinConfig?.formula) {
          const coinConfig = spell.healingConfig.hotCoinConfig;
          const flipCount = coinConfig.flipCount !== undefined ? coinConfig.flipCount : 4;
          const duration = spell.healingConfig.hotDuration || 3;
          const tickFrequency = spell.healingConfig.hotTickType || 'round';
          const durationText = duration === 1 ? `1 ${tickFrequency}` : `${duration} ${tickFrequency}s`;

          // Check if progressive HoT is enabled
          if (spell.healingConfig.isProgressiveHot && spell.healingConfig.hotProgressiveStages?.length > 0) {
            const unitLabel = tickFrequency === 'round' ? 'Round' :
                             tickFrequency === 'turn' ? 'Turn' :
                             tickFrequency.charAt(0).toUpperCase() + tickFrequency.slice(1);

            const progressiveText = spell.healingConfig.hotProgressiveStages
              .map(stage => `${unitLabel} ${stage.turn}: Flip ${flipCount} coins: ${cleanFormula(stage.formula)}`)
              .join(' → ');

            return progressiveText;
          } else {
            return `Flip ${flipCount} coins: ${cleanFormula(coinConfig.formula)} per ${tickFrequency} for ${durationText}`;
          }
        } else if (spell.healingConfig.hotFormula) {
          const duration = spell.healingConfig.hotDuration || 3;
          const tickFrequency = spell.healingConfig.hotTickType || 'round';
          const durationText = duration === 1 ? `1 ${tickFrequency}` : `${duration} ${tickFrequency}s`;

          // Check if progressive HoT is enabled
          if (spell.healingConfig.isProgressiveHot && spell.healingConfig.hotProgressiveStages?.length > 0) {
            const unitLabel = tickFrequency === 'round' ? 'Round' :
                             tickFrequency === 'turn' ? 'Turn' :
                             tickFrequency.charAt(0).toUpperCase() + tickFrequency.slice(1);

            const progressiveText = spell.healingConfig.hotProgressiveStages
              .map(stage => `${unitLabel} ${stage.turn}: ${cleanFormula(stage.formula)}`)
              .join(' → ');

            return progressiveText;
          } else {
            return `${cleanFormula(spell.healingConfig.hotFormula)} per ${tickFrequency} for ${durationText}`;
          }
        }
      } else if (healingType === 'shield') {
        // Shield healing - check resolution method
        const shieldDuration = spell.healingConfig.shieldDuration || 3;
        const damageTypes = spell.healingConfig.shieldDamageTypes || 'all';
        const overflow = spell.healingConfig.shieldOverflow || 'dissipate';
        const breakBehavior = spell.healingConfig.shieldBreakBehavior || 'fade';

        let baseDescription = '';

        // Handle different resolution types for shield
        if (spell.resolution === 'CARDS' && spell.healingConfig.shieldCardConfig?.formula) {
          const cardConfig = spell.healingConfig.shieldCardConfig;
          const drawCount = cardConfig.drawCount !== undefined ? cardConfig.drawCount : 3;
          baseDescription = `Draw ${drawCount} cards: ${cleanFormula(cardConfig.formula)} absorption`;
        } else if (spell.resolution === 'COINS' && spell.healingConfig.shieldCoinConfig?.formula) {
          const coinConfig = spell.healingConfig.shieldCoinConfig;
          const flipCount = coinConfig.flipCount !== undefined ? coinConfig.flipCount : 4;
          baseDescription = `Flip ${flipCount} coins: ${cleanFormula(coinConfig.formula)} absorption`;
        } else if (spell.healingConfig.shieldFormula) {
          baseDescription = `${cleanFormula(spell.healingConfig.shieldFormula)} absorption`;
        }

        if (baseDescription) {
          // Add duration
          baseDescription += ` for ${shieldDuration} round${shieldDuration !== 1 ? 's' : ''}`;

          // Build bullet points for shield properties
          const shieldBullets = [];

          // Add damage type if not all types
          if (damageTypes !== 'all') {
            const typeText = damageTypes === 'physical' ? 'Physical' :
                            damageTypes === 'magical' ? 'Magical' :
                            damageTypes === 'fire' ? 'Fire' :
                            damageTypes === 'cold' ? 'Cold' :
                            damageTypes === 'lightning' ? 'Lightning' :
                            damageTypes === 'acid' ? 'Acid' :
                            damageTypes === 'poison' ? 'Poison' :
                            damageTypes === 'necrotic' ? 'Necrotic' :
                            damageTypes === 'radiant' ? 'Radiant' :
                            damageTypes === 'force' ? 'Force' :
                            damageTypes.charAt(0).toUpperCase() + damageTypes.slice(1);
            shieldBullets.push(`${typeText} only`);
          }

          // Add overflow behavior if not default
          if (overflow === 'convert_to_healing') {
            shieldBullets.push('Excess → Healing');
          }

          // Add break behavior if not default
          if (breakBehavior === 'shatter') {
            shieldBullets.push('Shatters');
          } else if (breakBehavior === 'fade') {
            shieldBullets.push('Fades');
          }

          // Return the description and bullets as an object so we can handle them separately
          return {
            description: baseDescription,
            bullets: shieldBullets
          };
        }
      }
    }

    // Fallback to legacy healing system
    if (spell.healing) {
      // Check if healing uses card or coin resolution (legacy)
      if (spell.resolution === 'CARDS' && (spell.healingCardConfig?.formula || spell.healingConfig?.cardConfig?.formula)) {
        const cardConfig = spell.healingCardConfig || spell.healingConfig?.cardConfig;
        const drawCount = cardConfig?.drawCount !== undefined ? cardConfig.drawCount : 3;
        const formula = cardConfig?.formula || 'CARD_VALUE + POKER_HAND_RANK * 3';
        const cleanedFormula = cleanFormula(formula);
        return `Draw ${drawCount} cards: ${cleanedFormula}`;
      } else if (spell.resolution === 'COINS' && (spell.healingCoinConfig?.formula || spell.healingConfig?.coinConfig?.formula)) {
        const coinConfig = spell.healingCoinConfig || spell.healingConfig?.coinConfig;
        const flipCount = coinConfig?.flipCount !== undefined ? coinConfig.flipCount : 4;
        const formula = coinConfig?.formula || 'HEADS_COUNT * 6 + LONGEST_STREAK * 2';
        const cleanedFormula = cleanFormula(formula);
        return `Flip ${flipCount} coins: ${cleanedFormula}`;
      } else {
        // Standard dice-based healing (legacy)
        const dice = spell.healing.dice || '';
        const flat = spell.healing.flat > 0 ? ` + ${spell.healing.flat}` : '';
        const healingFormula = `${dice}${flat}`;
        return cleanFormula(healingFormula);
      }
    }

    return null;
  };

  const formatCombinedHealing = () => {
    if (!spell?.healingConfig) return null;

    // Use the main cleanFormula function defined above

    const effects = [];

    // Check for additional HoT effect
    if (spell.healingConfig.hasHotEffect && spell.healingConfig.hotFormula) {
      const duration = spell.healingConfig.hotDuration || 3;
      const tickFrequency = spell.healingConfig.hotTickType || 'round';
      const durationText = duration === 1 ? `1 ${tickFrequency}` : `${duration} ${tickFrequency}s`;
      effects.push(`${cleanFormula(spell.healingConfig.hotFormula)} per ${tickFrequency} for ${durationText}`);
    }

    // Check for additional shield effect
    if (spell.healingConfig.hasShieldEffect && spell.healingConfig.shieldFormula) {
      const shieldDuration = spell.healingConfig.shieldDuration || 3;
      const damageTypes = spell.healingConfig.shieldDamageTypes || 'all';

      let shieldText = `${cleanFormula(spell.healingConfig.shieldFormula)} absorption for ${shieldDuration} round${shieldDuration !== 1 ? 's' : ''}`;

      // Add damage type absorption if not all types
      if (damageTypes !== 'all') {
        const typeText = damageTypes === 'physical' ? 'physical damage' :
                        damageTypes === 'magical' ? 'magical damage' :
                        damageTypes === 'fire' ? 'fire damage' :
                        damageTypes === 'cold' ? 'cold damage' :
                        damageTypes === 'lightning' ? 'lightning damage' :
                        damageTypes === 'acid' ? 'acid damage' :
                        damageTypes === 'poison' ? 'poison damage' :
                        damageTypes === 'necrotic' ? 'necrotic damage' :
                        damageTypes === 'radiant' ? 'radiant damage' :
                        damageTypes === 'force' ? 'force damage' :
                        damageTypes;
        shieldText += ` (${typeText} only)`;
      }

      effects.push(shieldText);
    }

    return effects.length > 0 ? effects.join('. ') : null;
  };



  const getDamageTypes = () => {
    if (!spell) return [];

    // Use a Set to automatically handle duplicates
    const damageTypesSet = new Set();

    // Priority order: damageTypes array first, then other sources
    if (spell.damageTypes && Array.isArray(spell.damageTypes) && spell.damageTypes.length > 0) {
      spell.damageTypes.forEach(type => {
        if (type && type.trim()) {
          damageTypesSet.add(type.toLowerCase().trim());
        }
      });
    }

    // Only add elementType if we don't have explicit damage types
    // NEVER use school as damage type - schools and damage types are completely separate
    if (damageTypesSet.size === 0) {
      // Only use elementType if it's explicitly set, different from school, and not a magic school
      if (spell.elementType && spell.elementType.trim()) {
        const elementType = spell.elementType.toLowerCase().trim();
        const school = (spell.school || '').toLowerCase().trim();
        const magicSchools = ['arcane', 'divine', 'primal', 'occult', 'evocation', 'necromancy', 'enchantment', 'illusion', 'transmutation', 'conjuration', 'abjuration', 'divination'];

        // Only add if it's not the same as school and not a magic school
        if (elementType !== school && !magicSchools.includes(elementType)) {
          damageTypesSet.add(elementType);
        }
      }

      // Only use damageConfig elementType if it's explicitly set and not a magic school
      if (spell.damageConfig?.elementType && spell.damageConfig.elementType.trim()) {
        const elementType = spell.damageConfig.elementType.toLowerCase().trim();
        const magicSchools = ['arcane', 'divine', 'primal', 'occult', 'evocation', 'necromancy', 'enchantment', 'illusion', 'transmutation', 'conjuration', 'abjuration', 'divination'];

        if (!magicSchools.includes(elementType)) {
          damageTypesSet.add(elementType);
        }
      }
    }

    // Valid damage types (normalize cold/ice/frost to just 'cold')
    const validDamageTypes = ['fire', 'cold', 'lightning', 'thunder', 'electric',
                             'poison', 'acid', 'necrotic', 'shadow', 'radiant', 'holy',
                             'arcane', 'force', 'physical', 'slashing', 'piercing', 'bludgeoning',
                             'nature', 'void', 'psychic'];

    // Normalize similar types
    const normalizedTypes = Array.from(damageTypesSet).map(type => {
      if (type === 'ice' || type === 'frost') return 'cold';
      if (type === 'electric') return 'lightning';
      return type;
    });

    // Filter valid types and remove duplicates again after normalization
    const finalTypes = [...new Set(normalizedTypes)]
      .filter(type => validDamageTypes.includes(type))
      .slice(0, 2); // Limit to 2 damage types for cleaner display

    return finalTypes;
  };

  const getSpellTags = () => {
    if (!spell) return [];

    const tags = [];

    // Add spell tags (only explicit tags, not auto-generated ones)
    if (spell.tags && Array.isArray(spell.tags)) {
      tags.push(...spell.tags);
    }

    // Add effect types as tags, but filter out unwanted ones
    if (spell.effectTypes && Array.isArray(spell.effectTypes)) {
      const filteredEffectTypes = spell.effectTypes.filter(effectType => {
        // Filter out effect types that shouldn't be shown as tags
        const unwantedEffects = ['debuff']; // Add more here if needed
        return !unwantedEffects.includes(effectType.toLowerCase());
      });
      tags.push(...filteredEffectTypes);
    }

    return [...new Set(tags)].slice(0, 6); // Limit tags for space
  };

  // ===== BUFF/DEBUFF FORMATTING FUNCTIONS =====

  const formatBuffEffects = () => {
    if (!spell?.buffConfig) return null;

    const { buffConfig } = spell;
    const effects = [];

    // Format stat modifiers with special handling for resistance and absorption
    if (buffConfig.statModifiers && buffConfig.statModifiers.length > 0) {
      const regularStats = [];
      const resistanceStats = [];
      const absorptionStats = [];

      buffConfig.statModifiers.forEach(stat => {
        // Check if this is a resistance stat with special scaling
        const isResistanceStat = stat.name && stat.name.toLowerCase().includes('resistance');
        const isAbsorptionStat = stat.name && stat.name.toLowerCase().includes('absorption');

        let statDisplay = {
          name: stat.name || 'Stat Modifier',
          value: '',
          class: ''
        };

        if (typeof stat.magnitude === 'string') {
          // It's a dice formula - could be absorption or regular stat
          if (isAbsorptionStat) {
            const damageType = stat.name.toLowerCase().replace(/\s*absorption\s*/, '').trim();
            statDisplay.value = `Absorbs ${stat.magnitude} damage per hit`;
            if (damageType && damageType !== 'damage' && damageType !== 'all damage') {
              statDisplay.value += ` (${damageType} only)`;
            }
            statDisplay.class = 'absorption-formula';
          } else {
            statDisplay.value = stat.magnitude;
            statDisplay.class = 'formula';
          }
        } else if (isAbsorptionStat) {
          // Handle flat absorption
          const damageType = stat.name.toLowerCase().replace(/\s*absorption\s*/, '').trim();
          statDisplay.value = `Absorbs up to ${Math.abs(stat.magnitude)} damage total`;
          if (damageType && damageType !== 'damage' && damageType !== 'all damage') {
            statDisplay.value += ` (${damageType} only)`;
          }
          statDisplay.class = 'absorption-flat';
        } else if (isResistanceStat && stat.magnitudeType === 'percentage') {
          // Handle resistance percentage values with thematic descriptions
          const percentage = stat.magnitude;
          const damageType = extractDamageTypeFromResistanceName(stat.name);

          if (percentage === -200) {
            statDisplay.value = getThematicResistanceDescription('vampiric', damageType);
            statDisplay.class = 'vampiric';
          } else if (percentage === -100) {
            statDisplay.value = getThematicResistanceDescription('absorbing', damageType);
            statDisplay.class = 'absorbing';
          } else if (percentage === -50) {
            statDisplay.value = getThematicResistanceDescription('draining', damageType);
            statDisplay.class = 'draining';
          } else if (percentage === -25) {
            statDisplay.value = getThematicResistanceDescription('siphoning', damageType);
            statDisplay.class = 'siphoning';
          } else if (percentage === 0) {
            statDisplay.value = getThematicResistanceDescription('immune', damageType);
            statDisplay.class = 'immune';
          } else if (percentage === 25) {
            statDisplay.value = getThematicResistanceDescription('resistant', damageType);
            statDisplay.class = 'resistant';
          } else if (percentage === 50) {
            statDisplay.value = getThematicResistanceDescription('highly_resistant', damageType);
            statDisplay.class = 'highly_resistant';
          } else if (percentage === 75) {
            statDisplay.value = getThematicResistanceDescription('guarded', damageType);
            statDisplay.class = 'guarded';
          } else {
            // Fallback to percentage display
            const sign = percentage >= 0 ? '+' : '';
            statDisplay.value = `${sign}${percentage}% resistance`;
            statDisplay.class = 'percentage';
          }
        } else {
          // Standard number or percentage display
          const magnitude = stat.magnitude || 0;
          const sign = magnitude >= 0 ? '+' : '';
          const displayValue = stat.magnitudeType === 'percentage'
            ? `${sign}${magnitude}%`
            : `${sign}${magnitude}`;
          statDisplay.value = displayValue;
          statDisplay.class = 'regular';
        }

        // Group stats by type
        if (isResistanceStat) {
          resistanceStats.push(statDisplay);
        } else if (isAbsorptionStat) {
          absorptionStats.push(statDisplay);
        } else {
          regularStats.push(statDisplay);
        }
      });

      // Add grouped stat effects
      if (regularStats.length > 0) {
        effects.push({
          name: 'Stat Modifiers',
          description: '',
          mechanicsText: regularStats.map(stat => `${stat.name}: ${stat.value}`).join(', '),
          type: 'stats',
          data: regularStats
        });
      }

      if (resistanceStats.length > 0) {
        effects.push({
          name: 'Resistances',
          description: '',
          mechanicsText: '',
          type: 'resistance',
          data: resistanceStats
        });
      }

      if (absorptionStats.length > 0) {
        effects.push({
          name: 'Damage Absorption',
          description: '',
          mechanicsText: '',
          type: 'absorption',
          data: absorptionStats
        });
      }
    }

    // Format status effects
    if (buffConfig.statusEffects && buffConfig.statusEffects.length > 0) {
      buffConfig.statusEffects.forEach(effect => {
        let effectName = effect.name || effect.id || 'Status Effect';
        effectName = effectName.charAt(0).toUpperCase() + effectName.slice(1);

        let mechanicsText = '';
        const mechanicsParts = [];

        // Add level information
        if (effect.level && effect.level !== 'moderate') {
          const levelMap = {
            'minor': 'Minor',
            'major': 'Major',
            'severe': 'Severe',
            'extreme': 'Extreme'
          };
          const levelDisplay = levelMap[effect.level] || effect.level;
          effectName = `${levelDisplay} ${effectName}`;
        }

        // Add save information if applicable
        if (effect.saveType && effect.saveType !== 'none') {
          let saveText = `${effect.saveType.charAt(0).toUpperCase() + effect.saveType.slice(1)} save`;
          if (effect.saveDC) {
            saveText += ` DC ${effect.saveDC}`;
          }
          mechanicsParts.push(saveText);
        }

        // Add duration if specified
        if (effect.duration && effect.duration !== 'default') {
          mechanicsParts.push(`${effect.duration} duration`);
        }

        mechanicsText = mechanicsParts.join(', ');

        effects.push({
          name: effectName,
          description: effect.description || '',
          mechanicsText: mechanicsText
        });
      });
    }

    return effects.length > 0 ? effects : null;
  };







  const formatPurificationEffects = () => {
    if (!spell?.purificationConfig) return null;

    const { purificationConfig } = spell;
    const effects = [];

    // Handle different purification types
    if (purificationConfig.purificationType === 'dispel') {
      // Format dispel effects - only show if there are selected effects
      if (purificationConfig.selectedEffects && purificationConfig.selectedEffects.length > 0) {
        // Filter effects to only show those that match the current purification type
        const dispelEffects = purificationConfig.selectedEffects.filter(effect =>
          !effect.purificationType || effect.purificationType === 'dispel'
        );

        dispelEffects.forEach(effect => {
          const effectName = effect.name || 'Unknown Effect';
          let effectDescription = effect.description || '';

          // Add specific effect types if available
          if (effect.specificEffectTypes && effect.specificEffectTypes.length > 0) {
            const specificTypes = effect.specificEffectTypes.join(', ');
            effectDescription += effectDescription ? ` (${specificTypes})` : `Targets: ${specificTypes}`;
          }

          // Add custom effects count if specified
          let mechanicsText = '';
          if (effect.customEffects && effect.customEffects > 1) {
            mechanicsText = `Removes up to ${effect.customEffects} effects`;
          }

          effects.push({
            name: effectName,
            description: effectDescription,
            mechanicsText: mechanicsText
          });
        });
      }
    } else if (purificationConfig.purificationType === 'resurrection') {
      // Format resurrection effects
      if (purificationConfig.selectedEffects && purificationConfig.selectedEffects.length > 0) {
        // Filter effects to only show those that match the current purification type
        const resurrectionEffects = purificationConfig.selectedEffects.filter(effect =>
          !effect.purificationType || effect.purificationType === 'resurrection'
        );

        resurrectionEffects.forEach(effect => {
          const resolution = effect.resolution || purificationConfig.resolution || 'DICE';
          const formula = effect.resurrectionFormula || purificationConfig.resurrectionFormula || '2d8 + SPI';

          let resolutionText = '';
          switch (resolution) {
            case 'CARDS':
              resolutionText = 'Draw cards';
              break;
            case 'COINS':
              resolutionText = 'Flip coins';
              break;
            case 'DICE':
            default:
              resolutionText = 'Roll dice';
              break;
          }

          effects.push({
            name: effect.name || 'Resurrection',
            description: resolutionText,
            mechanicsText: `${cleanFormula(formula)} health restored`
          });
        });
      } else {
        // Show default resurrection effect if no specific effects are selected
        const resolution = purificationConfig.resolution || 'DICE';
        const formula = purificationConfig.resurrectionFormula || '2d8 + SPI';

        let resolutionText = '';
        switch (resolution) {
          case 'CARDS':
            resolutionText = 'Draw cards';
            break;
          case 'COINS':
            resolutionText = 'Flip coins';
            break;
          case 'DICE':
          default:
            resolutionText = 'Roll dice';
            break;
        }

        effects.push({
          name: 'Resurrection',
          description: resolutionText,
          mechanicsText: `${cleanFormula(formula)} health restored`
        });
      }
    }

    return effects.length > 0 ? effects : null;
  };

  const formatDebuffEffects = () => {
    if (!spell?.debuffConfig) return null;

    const { debuffConfig } = spell;
    const effects = [];

    // Format stat modifiers with special handling for resistance and absorption
    if (debuffConfig.statPenalties && debuffConfig.statPenalties.length > 0) {
      const regularStats = [];
      const resistanceStats = [];
      const absorptionStats = [];

      debuffConfig.statPenalties.forEach(stat => {
        // Check if this is a resistance stat with special scaling
        const isResistanceStat = stat.name && stat.name.toLowerCase().includes('resistance');
        const isAbsorptionStat = stat.name && stat.name.toLowerCase().includes('absorption');

        let statDisplay = {
          name: stat.name || 'Stat Penalty',
          value: '',
          class: ''
        };

        if (typeof stat.magnitude === 'string') {
          // It's a dice formula - could be absorption or regular stat
          if (isAbsorptionStat) {
            const damageType = stat.name.toLowerCase().replace(/\s*absorption\s*/, '').trim();
            const typeText = damageType && damageType !== 'damage' && damageType !== 'all damage' ? ` ${damageType}` : '';
            statDisplay.value = `Weakens${typeText} absorption barriers, reducing protection by ${stat.magnitude} per impact`;
            statDisplay.class = 'absorption-formula';
          } else {
            statDisplay.value = stat.magnitude;
            statDisplay.class = 'formula';
          }
        } else if (isAbsorptionStat) {
          // Handle flat absorption reduction
          const damageType = stat.name.toLowerCase().replace(/\s*absorption\s*/, '').trim();
          const typeText = damageType && damageType !== 'damage' && damageType !== 'all damage' ? ` ${damageType}` : '';
          statDisplay.value = `Shatters${typeText} absorption barriers, permanently reducing protection by ${Math.abs(stat.magnitude)} points`;
          statDisplay.class = 'absorption-flat';
        } else if (isResistanceStat && stat.magnitudeType === 'percentage') {
          // Handle resistance percentage values with thematic descriptions
          const percentage = stat.magnitude;
          const damageType = extractDamageTypeFromResistanceName(stat.name);

          // Handle all resistance percentage values with thematic descriptions
          if (percentage === -200) {
            statDisplay.value = getThematicResistanceDescription('vampiric', damageType);
            statDisplay.class = 'vampiric';
          } else if (percentage === -100) {
            statDisplay.value = getThematicResistanceDescription('absorbing', damageType);
            statDisplay.class = 'absorbing';
          } else if (percentage === -50) {
            statDisplay.value = getThematicResistanceDescription('draining', damageType);
            statDisplay.class = 'draining';
          } else if (percentage === -25) {
            statDisplay.value = getThematicResistanceDescription('siphoning', damageType);
            statDisplay.class = 'siphoning';
          } else if (percentage === 0) {
            statDisplay.value = getThematicResistanceDescription('immune', damageType);
            statDisplay.class = 'immune';
          } else if (percentage === 25) {
            statDisplay.value = getThematicResistanceDescription('slight_reduction', damageType);
            statDisplay.class = 'slight_reduction';
          } else if (percentage === 50) {
            statDisplay.value = getThematicResistanceDescription('resistant', damageType);
            statDisplay.class = 'resistant';
          } else if (percentage === 75) {
            statDisplay.value = getThematicResistanceDescription('guarded', damageType);
            statDisplay.class = 'guarded';
          } else if (percentage === 100) {
            statDisplay.value = getThematicResistanceDescription('nullified', damageType);
            statDisplay.class = 'nullified';
          } else if (percentage === 125) {
            statDisplay.value = getThematicResistanceDescription('susceptible', damageType);
            statDisplay.class = 'susceptible';
          } else if (percentage === 150) {
            statDisplay.value = getThematicResistanceDescription('exposed', damageType);
            statDisplay.class = 'exposed';
          } else if (percentage === 200) {
            statDisplay.value = getThematicResistanceDescription('vulnerable', damageType);
            statDisplay.class = 'vulnerable';
          } else {
            // Fallback to percentage display for any other values
            const sign = percentage >= 0 ? '+' : '';
            statDisplay.value = `${sign}${percentage}% resistance`;
            statDisplay.class = 'percentage';
          }
        } else {
          // Standard number or percentage display
          const magnitude = stat.magnitude || 0;
          const sign = magnitude >= 0 ? '+' : '';
          const displayValue = stat.magnitudeType === 'percentage'
            ? `${sign}${magnitude}%`
            : `${sign}${magnitude}`;
          statDisplay.value = displayValue;
          statDisplay.class = 'regular';
        }

        // Group stats by type
        if (isResistanceStat) {
          resistanceStats.push(statDisplay);
        } else if (isAbsorptionStat) {
          absorptionStats.push(statDisplay);
        } else {
          regularStats.push(statDisplay);
        }
      });

      // Add grouped stat effects
      if (regularStats.length > 0) {
        effects.push({
          name: 'Stat Penalties',
          description: '',
          mechanicsText: regularStats.map(stat => `${stat.name}: ${stat.value}`).join(', '),
          type: 'stats',
          data: regularStats
        });
      }

      if (resistanceStats.length > 0) {
        effects.push({
          name: 'Resistance Penalties',
          description: '',
          mechanicsText: '',
          type: 'resistance',
          data: resistanceStats
        });
      }

      if (absorptionStats.length > 0) {
        effects.push({
          name: 'Absorption Penalties',
          description: '',
          mechanicsText: '',
          type: 'absorption',
          data: absorptionStats
        });
      }
    }

    // Helper function to get default save type for status effects
    const getDefaultSaveType = (effectId) => {
      const defaultSaves = {
        'charmed': 'wisdom',
        'frightened': 'wisdom',
        'fear': 'wisdom',

        'blinded': 'constitution',
        'blind': 'constitution',
        'paralyzed': 'constitution',
        'poisoned': 'constitution',
        'restrained': 'strength',
        'silenced': 'constitution',

        'weakened': 'constitution',
        'confused': 'wisdom',
        'diseased': 'constitution',
        'bleeding': 'constitution',
        'cursed': 'wisdom'
      };
      return defaultSaves[effectId] || 'constitution';
    };

    // Format status effects with detailed display
    if (debuffConfig.statusEffects && debuffConfig.statusEffects.length > 0) {
      debuffConfig.statusEffects.forEach(effect => {
        // Handle both string and object effects
        let displayName;
        if (typeof effect === 'string') {
          displayName = effect;
        } else {
          displayName = effect.name || effect.id || effect;
        }

        // Ensure displayName is a string before calling charAt
        if (displayName && typeof displayName === 'string') {
          displayName = displayName.charAt(0).toUpperCase() + displayName.slice(1);
        } else {
          displayName = 'Unknown Effect';
        }

        // Initialize description and mechanicsText variables
        let description = '';
        let mechanicsText = '';

        // Add level information if it's not 'moderate' (default)
        let levelDisplay = '';
        if (effect.level && effect.level !== 'moderate' && effect.level !== 'medium') {
          const levelMap = {
            'minor': 'Minor',
            'major': 'Major',
            'severe': 'Severe',
            'extreme': 'Extreme'
          };
          levelDisplay = levelMap[effect.level] || effect.level;
          if (levelDisplay) {
            displayName = `${levelDisplay} ${displayName}`;
          }
        }

        // Enhanced formatting for charmed effect
        if (effect.id === 'charmed' || effect.id === 'charm') {
          const charmType = effect.charmType || effect.option || 'friendly';
          const charmDescriptions = {
            'friendly': 'regards you as a friend but maintains free will',
            'dominated': 'must obey your commands without question',
            'infatuated': 'is devoted to you and will protect you at all costs'
          };

          description = `${displayName} (${charmType}) - target ${charmDescriptions[charmType] || 'is charmed'}`;

          // Add restrictions based on configuration
          const restrictions = [];
          if (effect.canAttackCharmer === false) {
            restrictions.push('cannot attack charmer');
          } else if (effect.canAttackCharmer === true) {
            restrictions.push('can attack charmer');
          }

          if (effect.canSelfHarm === false) {
            restrictions.push('cannot be commanded to self-harm');
          }

          if (effect.retainsMemory === true) {
            restrictions.push('retains memory of actions');
          }

          if (restrictions.length > 0) {
            description += ` (${restrictions.join(', ')})`;
          }

          // Add save information - prioritize status effect's own saveDC, then debuff config
          const saveDC = effect.saveDC || debuffConfig.difficultyClass || 15;
          const saveType = effect.saveType || 'wisdom';

          if (saveType && saveType !== 'none') {
            const saveConfig = {
              savingThrowType: saveType,
              difficultyClass: saveDC,
              saveOutcome: effect.saveOutcome || 'broken'
            };
            const saveInfo = formatSavingThrow(saveConfig, 'status');
            if (saveInfo) {
              mechanicsText = `${saveInfo.saveType} save DC ${saveInfo.dc} (${saveInfo.outcome})`;
            }
          }
        } else {
          // General status effect formatting
          description = displayName;

          // Add specific type information and descriptions based on effect
          if (effect.id === 'frightened' || effect.id === 'fear') {
            if (effect.option) {
              const typeMap = {
                'shaken': 'Shaken - disadvantage on ability checks while fear source is visible',
                'terrified': 'Terrified - cannot willingly move closer to the source of fear',
                'panicked': 'Panicked - must use actions to flee from source of fear'
              };
              description = typeMap[effect.option] || `${effect.option} Fear`;
            } else {
              description = 'Fear - target is overcome with dread and terror';
            }

          } else if (effect.id === 'blinded' || effect.id === 'blind') {
            if (effect.blindType) {
              const typeMap = {
                'full': 'Blinded - cannot see, automatically fails sight-based checks, attacks have disadvantage',
                'partial': 'Partially Blinded - limited vision, disadvantage on perception and attacks',
                'darkness': 'Magical Darkness - surrounded by supernatural darkness that blocks all vision'
              };
              description = typeMap[effect.blindType] || 'Blinded';
            } else {
              description = 'Blinded - cannot see and has disadvantage on attacks';
            }
          } else if (effect.id === 'paralyzed' || effect.id === 'paralyze') {
            if (effect.option) {
              const typeMap = {
                'partial': 'Partially Paralyzed - some limbs affected, reduced movement and actions',
                'complete': 'Completely Paralyzed - cannot move or take actions, attacks against have advantage',
                'magical': 'Magical Paralysis - held by supernatural forces, aware but unable to act'
              };
              description = typeMap[effect.option] || 'Paralyzed';
            } else {
              description = 'Paralyzed - cannot move or take actions';
            }
          } else if (effect.id === 'poisoned' || effect.id === 'poison') {
            if (effect.option) {
              const typeMap = {
                'weakening': 'Weakening Poison - reduces physical capabilities and stamina',
                'nauseating': 'Nauseating Poison - causes sickness and disadvantage on actions',
                'lethal': 'Lethal Poison - deals ongoing damage and threatens life'
              };
              description = typeMap[effect.option] || 'Poisoned';
            } else {
              description = 'Poisoned - disadvantage on attack rolls and ability checks';
            }
          } else if (effect.id === 'restrained') {
            description = 'Restrained - speed becomes 0, attacks have disadvantage, attacks against have advantage';
          } else if (effect.id === 'silenced') {
            description = 'Silenced - cannot speak or cast spells with verbal components';

          } else if (effect.id === 'weakened') {
            description = 'Weakened - reduced physical strength and damage output';
          } else if (effect.id === 'confused') {
            description = 'Confused - cannot distinguish friend from foe, actions are unpredictable';
          } else if (effect.id === 'diseased') {
            description = 'Diseased - suffering from illness that weakens the body';
          } else if (effect.id === 'bleeding') {
            description = 'Bleeding - loses health over time from open wounds';
          } else if (effect.id === 'cursed') {
            description = 'Cursed - afflicted by dark magic that brings misfortune';
          } else if (effect.id === 'invisible') {
            if (effect.option) {
              const typeMap = {
                'partial': 'Partially Invisible - heavily obscured, harder to detect',
                'full': 'Fully Invisible - completely invisible until you attack',
                'selective': 'Selectively Invisible - invisible to specific creatures'
              };
              description = typeMap[effect.option] || 'Invisible';
            } else {
              description = 'Invisible - cannot be seen by normal sight';
            }
          } else if (effect.id === 'haste') {
            if (effect.option) {
              const typeMap = {
                'movement': 'Enhanced Movement - double movement speed',
                'action': 'Extra Action - gain an additional action each turn',
                'casting': 'Quick Casting - cast spells more quickly'
              };
              description = typeMap[effect.option] || 'Haste';
            } else {
              description = 'Haste - move and act more quickly';
            }
          } else if (effect.id === 'flying') {
            if (effect.option) {
              const typeMap = {
                'hover': 'Hovering - float a few feet off the ground',
                'wings': 'Winged Flight - grow or manifest wings for true flight',
                'levitation': 'Magical Levitation - float without physical means'
              };
              description = typeMap[effect.option] || 'Flying';
            } else {
              description = 'Flying - gain the ability to fly';
            }
          } else if (effect.id === 'resistance') {
            if (effect.option) {
              const typeMap = {
                'elemental': 'Elemental Resistance - resistance to fire, cold, lightning, etc.',
                'physical': 'Physical Resistance - resistance to bludgeoning, piercing, slashing',
                'magical': 'Magical Resistance - resistance to magical damage types'
              };
              description = typeMap[effect.option] || 'Resistance';
            } else {
              description = 'Resistance - take reduced damage from specific sources';
            }
          } else if (effect.id === 'vulnerability' || effect.id === 'damage_vulnerability') {
            if (effect.option) {
              const typeMap = {
                'physical': 'Physical Vulnerability - take increased damage from physical attacks',
                'elemental': 'Elemental Vulnerability - take increased damage from elemental attacks',
                'magical': 'Magical Vulnerability - take increased damage from magical attacks'
              };
              description = typeMap[effect.option] || 'Vulnerability';
            } else {
              description = 'Vulnerability - take increased damage from specific sources';
            }
          } else if (effect.id === 'advantage_attack') {
            if (effect.option) {
              const typeMap = {
                'all': 'Advantage on All Attacks - roll twice and take higher result on all attack rolls',
                'melee': 'Advantage on Melee Attacks - roll twice and take higher result on melee attacks',
                'ranged': 'Advantage on Ranged Attacks - roll twice and take higher result on ranged attacks',
                'spell': 'Advantage on Spell Attacks - roll twice and take higher result on spell attacks'
              };
              description = typeMap[effect.option] || 'Advantage on Attacks';
            } else {
              description = 'Advantage on Attacks - roll twice and take the higher result on attack rolls';
            }
          } else if (effect.id === 'disadvantage_attack') {
            if (effect.option) {
              const typeMap = {
                'all': 'Disadvantage on All Attacks - roll twice and take lower result on all attack rolls',
                'melee': 'Disadvantage on Melee Attacks - roll twice and take lower result on melee attacks',
                'ranged': 'Disadvantage on Ranged Attacks - roll twice and take lower result on ranged attacks',
                'spell': 'Disadvantage on Spell Attacks - roll twice and take lower result on spell attacks'
              };
              description = typeMap[effect.option] || 'Disadvantage on Attacks';
            } else {
              description = 'Disadvantage on Attacks - roll twice and take the lower result on attack rolls';
            }
          } else if (effect.option) {
            // Generic option handling for other effects
            const optionName = effect.option.charAt(0).toUpperCase() + effect.option.slice(1);
            description = `${description} (${optionName})`;
          }

          // Add save information for any status effect with save configuration
          const saveDC = effect.saveDC || debuffConfig.difficultyClass || 15;
          const saveType = effect.saveType || getDefaultSaveType(effect.id);

          if (saveType && saveType !== 'none') {
            const saveConfig = {
              savingThrowType: saveType,
              difficultyClass: saveDC,
              saveOutcome: effect.saveOutcome || 'overcome'
            };
            const saveInfo = formatSavingThrow(saveConfig, 'status');
            if (saveInfo) {
              mechanicsText = `${saveInfo.saveType} save DC ${saveInfo.dc} (${saveInfo.outcome})`;

              // Add save frequency information
              if (effect.saveFrequency && effect.saveFrequency !== 'initial') {
                const frequencyMap = {
                  'end_of_turn': 'save each turn',
                  'when_damaged': 'save when damaged',
                  'out_of_sight': 'save when out of sight',
                  'ally_help': 'save when ally helps',
                  'special_trigger': 'save on special trigger'
                };
                mechanicsText += `, ${frequencyMap[effect.saveFrequency] || 'repeated saves'}`;
              }
            }
          }
        }

        // Add the status effect to the effects array
        effects.push({
          name: displayName,
          description: description,
          mechanicsText: mechanicsText
        });
      });
    }

    // Add saving throw information
    if (debuffConfig.savingThrow && debuffConfig.difficultyClass) {
      const saveInfo = formatSavingThrow(debuffConfig, 'debuff');
      if (saveInfo) {
        effects.push({
          name: 'Saving Throw',
          description: `${saveInfo.saveType} save DC ${saveInfo.dc}`,
          mechanicsText: saveInfo.outcome
        });
      }
    }

    // Add stacking rule information
    if (debuffConfig.stackingRule && debuffConfig.stackingRule !== 'replace') {
      const stackingRules = {
        'selfStacking': 'Self-stacking',
        'cumulative': 'Cumulative',
        'progressive': 'Progressive',
        'diminishing': 'Diminishing returns'
      };
      const stackingName = stackingRules[debuffConfig.stackingRule] || debuffConfig.stackingRule;

      let stackingDescription = stackingName;
      if (debuffConfig.maxStacks && debuffConfig.maxStacks > 1) {
        stackingDescription += ` (max ${debuffConfig.maxStacks} stacks)`;
      }

      effects.push({
        name: 'Stacking Rules',
        description: stackingDescription,
        mechanicsText: ''
      });
    }

    // Add dispellable information for permanent effects
    if (debuffConfig.durationType === 'permanent') {
      if (debuffConfig.canBeDispelled === false) {
        effects.push({
          name: 'Dispel Resistance',
          description: 'Cannot be dispelled',
          mechanicsText: ''
        });
      } else if (debuffConfig.canBeDispelled === true) {
        effects.push({
          name: 'Dispellable',
          description: 'Can be dispelled',
          mechanicsText: ''
        });
      }
    }

    return effects.length > 0 ? effects : null;
  };

  // ===== EVENT HANDLERS =====

  const handleClick = (e) => {
    if (onClick) onClick(spell.id || spell);
    if (onSelect) onSelect(spell);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick(e);
      e.preventDefault();
    } else if (e.key === 'Delete' && isSelected && onDelete) {
      onDelete(spell);
      e.preventDefault();
    } else if (e.key === 'c' && e.ctrlKey && isSelected && onDuplicate) {
      onDuplicate(spell);
      e.preventDefault();
    }
  };

  const handleDragStart = (e) => {
    if (isDraggable) {
      // Format spell data for action bar compatibility
      const spellData = {
        id: spell.id,
        name: spell.name,
        icon: spell.icon || 'spell_holy_holybolt',
        cooldown: spell.cooldown || 0,
        level: spell.level || 1,
        spellType: spell.spellType || 'ACTION'
      };
      e.dataTransfer.setData('application/json', JSON.stringify(spellData));
      e.dataTransfer.effectAllowed = 'copy';
      console.log('Dragging spell from UnifiedSpellCard:', spellData);
    }
  };

  // ===== HOVER TOOLTIP HANDLERS (for compact variant) =====

  // Handle mouse enter with delay
  const handleMouseEnter = useCallback((e) => {
    if (variant !== 'compact') return;

    // Clear any existing hide timeout
    if (hideTimeoutRef.current) {
      clearTimeout(hideTimeoutRef.current);
      hideTimeoutRef.current = null;
    }

    // Set show timeout
    hoverTimeoutRef.current = setTimeout(() => {
      if (itemRef.current) {
        const rect = itemRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        // Calculate tooltip position
        let x = rect.right + 10; // Default to right side
        let y = rect.top;

        // If tooltip would go off right edge, show on left
        if (x + 400 > viewportWidth) {
          x = rect.left - 410;
        }

        // If tooltip would go off bottom, adjust upward
        if (y + 500 > viewportHeight) {
          y = viewportHeight - 510;
        }

        // Ensure tooltip doesn't go off top
        if (y < 10) {
          y = 10;
        }

        setTooltipPosition({ x, y });
        setShowTooltip(true);
      }
    }, 300); // 300ms delay before showing tooltip
  }, [variant]);

  // Handle mouse leave with delay
  const handleMouseLeave = useCallback(() => {
    if (variant !== 'compact') return;

    // Clear show timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    // Set hide timeout
    hideTimeoutRef.current = setTimeout(() => {
      setShowTooltip(false);
    }, 100); // 100ms delay before hiding tooltip
  }, [variant]);

  // Cleanup timeouts on unmount
  React.useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
      if (hideTimeoutRef.current) {
        clearTimeout(hideTimeoutRef.current);
      }
    };
  }, []);

  // ===== MAIN RENDER FUNCTION =====

  // Special compact variant rendering (like CompactSpellItem)
  if (variant === 'compact') {
    return (
      <>
        <div
          ref={itemRef}
          className={`compact-spell-item ${getRarityClass()} ${isSelected ? 'selected' : ''} ${className}`}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onContextMenu={onContextMenu}
          onDragStart={handleDragStart}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          draggable={isDraggable}
          tabIndex={onClick || onSelect ? "0" : undefined}
          role={onClick || onSelect ? "button" : undefined}
          aria-selected={isSelected}
          data-spell-id={spell?.id}
          title="Drag to action bar to add spell"
          {...props}
        >
        {/* Spell Icon */}
        <div className="compact-spell-icon">
          <img
            src={`https://wow.zamimg.com/images/wow/icons/large/${getSpellIcon()}.jpg`}
            alt={spell?.name || 'Spell'}
            onError={(e) => {
              e.target.onerror = null;
              // Try a few fallback icons before using the question mark
              const fallbacks = [
                'spell_arcane_arcanetorrent',
                'spell_fire_fireball02',
                'spell_holy_heal',
                'spell_nature_lightning',
                'inv_misc_questionmark'
              ];
              const currentSrc = e.target.src;
              const currentIcon = currentSrc.split('/').pop().replace('.jpg', '');
              const currentIndex = fallbacks.indexOf(currentIcon);
              if (currentIndex < fallbacks.length - 1) {
                e.target.src = `https://wow.zamimg.com/images/wow/icons/large/${fallbacks[currentIndex + 1]}.jpg`;
              }
            }}
          />
        </div>

        {/* Spell Name Only */}
        <div className="compact-spell-name">
          {spell?.name || 'Unnamed Spell'}
        </div>
      </div>

      {/* Tooltip */}
      {showTooltip && (
        <SpellTooltip
          spell={spell}
          rollableTableData={rollableTableData}
          position={tooltipPosition}
          onMouseEnter={() => {
            // Keep tooltip visible when hovering over it
            if (hideTimeoutRef.current) {
              clearTimeout(hideTimeoutRef.current);
              hideTimeoutRef.current = null;
            }
          }}
          onMouseLeave={handleMouseLeave}
        />
      )}
    </>
    );
  }

  // Regular spell card rendering for all other variants
  return (
    <div
      className={`pf-spell-card wow-spell-card ${variant} ${getRarityClass()} ${getSpellSchoolClass()} ${isSelected ? 'selected' : ''} ${className}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      onContextMenu={onContextMenu}
      onDragStart={handleDragStart}
      draggable={isDraggable}
      tabIndex={onClick || onSelect ? "0" : undefined}
      role={onClick || onSelect ? "button" : undefined}
      aria-selected={isSelected}
      style={{
        boxShadow: `0 4px 8px rgba(0, 0, 0, 0.5), 0 0 10px ${getBorderColor()}40`
      }}
      {...props}
    >
      {/* Card Gloss Effect */}
      <div className="spell-card-gloss"></div>

      {/* Category Indicators (for library/collection variants) */}
      {(variant === 'library' || variant === 'collection') && categories && categories.length > 0 && (
        <div className="spell-card-categories">
          {categories.slice(0, 3).map((category, index) => (
            <div
              key={index}
              className="spell-card-category-indicator"
              style={{ backgroundColor: category.color || '#3b82f6' }}
            />
          ))}
        </div>
      )}

      {/* Card Header */}
      <div className="pf-spell-card-header wow-spell-card-header">
        {/* Header Main Row - Icon, Name, Resource Cost, Damage Types */}
        <div className="unified-spell-header-main">
          <div className="pf-spell-icon-container">
            <img
              src={`https://wow.zamimg.com/images/wow/icons/large/${getSpellIcon()}.jpg`}
              alt={spell?.name || 'Spell'}
              className="pf-spell-icon"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg";
              }}
            />

            {/* Spell Type Badge (for spellbook variant only) */}
            {variant === 'spellbook' && (
              <div className="spell-type-badge">
                {spell?.spellType || 'ACTION'}
              </div>
            )}
          </div>

          <div className="unified-spell-info">
            <h3 className="pf-spell-name">{spell?.name || 'Unnamed Spell'}</h3>

            {/* Separator line below spell title for wizard variant */}
            {variant === 'wizard' && (
              <div className="unified-spell-title-separator"></div>
            )}

            {/* Resource costs below separator for wizard variant */}
            {variant === 'wizard' && formatResourceCosts() && (
              <div className="unified-spell-wizard-meta">
                <div className="unified-spell-resource-costs">
                  {formatResourceCosts()}
                </div>
              </div>
            )}

            {/* Meta information varies by variant */}
            <div className="unified-spell-meta">
              {variant === 'spellbook' && (
                <>
                  <span className="spell-cast-time">{formatCastTime()}</span>
                  <span className="spell-range">{formatRange()}</span>
                </>
              )}

            </div>
          </div>

          {/* Right side container for Resource Cost and Damage Types */}
          <div className="unified-spell-header-right">
            {/* Combined damage types and spell components box for wizard variant */}
            {variant === 'wizard' && (getDamageTypes().length > 0 || formatSpellComponents()) && (
              <div className="pf-damage-spell-box">
                {/* Damage Types - Top row */}
                {getDamageTypes().length > 0 && (
                  <div className="pf-damage-types-header">
                    {getDamageTypes().map((damageType, index) => (
                      <div key={index} className={`pf-damage-type-badge ${damageType.toLowerCase()}`}>
                        <div className="pf-damage-type-icon"></div>
                        <span className="pf-damage-type-text">{damageType}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Spell Components - Bottom row, starting beneath leftmost damage type */}
                {formatSpellComponents() && (
                  <div className="unified-spell-components-header">
                    {formatSpellComponents()}
                  </div>
                )}
              </div>
            )}

            {/* Damage Types only for non-wizard variants */}
            {(variant === 'library' || variant === 'collection') && getDamageTypes().length > 0 && (
              <div className="pf-damage-types-header">
                {getDamageTypes().map((damageType, index) => (
                  <div key={index} className={`pf-damage-type-badge ${damageType.toLowerCase()}`}>
                    <div className="pf-damage-type-icon"></div>
                    <span className="pf-damage-type-text">{damageType}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Resource Cost - Only show for spellbook variant */}
            {variant === 'spellbook' && (
              <div className="unified-spell-cost">
                {formatResourceCosts()}
              </div>
            )}
          </div>
        </div>

        {/* Header Details Row - Action Type, Range, Targeting */}
        {(variant === 'library' || variant === 'wizard' || variant === 'collection') && (
          <div className="unified-spell-header-details">
            {/* Main badges row - action type, range, targeting */}
            <div className="unified-spell-badges-row">
              {/* Action Type Badge - simplified without bullets */}
              <div className={`pf-action-type-badge ${(spell?.spellType || 'action').toLowerCase()}`}>
                <div className="pf-action-type-content">
                  <span className="pf-action-type-name">{spell?.spellType || 'Action'}</span>
                </div>
              </div>

              {/* Range Badge */}
              <div className="pf-range-badge">
                <div className="pf-range-icon"></div>
                <span>{formatRange()}</span>
              </div>

              {/* Targeting Type Badge */}
              {formatTargetingType() && (
                <div
                  className="pf-targeting-badge"
                  style={{
                    fontSize: formatTargetingType().length > 30 ? '9px' :
                             formatTargetingType().length > 25 ? '10px' :
                             formatTargetingType().length > 20 ? '11px' :
                             '12px'
                  }}
                >
                  <span>{formatTargetingType()}</span>
                </div>
              )}

              {/* Propagation Badge */}
              {formatPropagation() && (
                <div
                  className="pf-propagation-badge"
                  style={{
                    fontSize: formatPropagation().length > 30 ? '9px' :
                             formatPropagation().length > 25 ? '10px' :
                             formatPropagation().length > 20 ? '11px' :
                             '12px'
                  }}
                >
                  <div className="pf-propagation-icon"></div>
                  <span>{formatPropagation()}</span>
                </div>
              )}
            </div>

            {/* Bullet points row - appears below the badges */}
            {formatTypeSpecificBullets().length > 0 && (
              <div className="unified-spell-bullets-row">
                {formatTypeSpecificBullets().map((bullet, index) => (
                  <span key={index} className="unified-spell-bullet">• {bullet}</span>
                ))}
              </div>
            )}
          </div>
        )}
      </div>



      {/* Card Body */}
      {showDescription && (
        <div className="pf-spell-card-body wow-spell-card-body">
          {/* Global Triggers - Move to top with minimal spacing */}
          {(() => {
            const hasTriggerConfig = spell?.triggerConfig;
            const hasGlobalTriggers = hasTriggerConfig?.global?.compoundTriggers?.length > 0;
            const hasTriggerRole = hasTriggerConfig?.triggerRole?.mode && hasTriggerConfig.triggerRole.mode !== 'CONDITIONAL';

            const shouldShowGlobalTriggers = hasGlobalTriggers || hasTriggerRole ||
              (hasTriggerConfig && ['REACTION', 'PASSIVE', 'TRAP', 'STATE'].includes(spell?.spellType));

            if (!shouldShowGlobalTriggers) return null;

            return (
              <div className="unified-spell-stat global-triggers-compact">
                <div className="trigger-compact-header">
                  <span className="trigger-compact-label">TRIGGERS</span>
                  <div className="trigger-compact-modes">
                    {hasTriggerRole && (
                      <span className="trigger-compact-mode">
                        {hasTriggerConfig.triggerRole.mode === 'AUTO_CAST' ? 'Auto-Cast' :
                         hasTriggerConfig.triggerRole.mode === 'BOTH' ? 'Auto + Manual' : 'Conditional'}
                      </span>
                    )}
                    {hasGlobalTriggers && hasTriggerConfig.global.compoundTriggers.length > 1 && (
                      <span className="trigger-compact-logic">
                        {hasTriggerConfig.global.logicType === 'AND' ? 'ALL' : 'ANY'}
                      </span>
                    )}
                  </div>
                </div>
                {hasGlobalTriggers && (
                  <div className="trigger-compact-conditions">
                    {hasTriggerConfig.global.compoundTriggers.map((trigger, index) => {
                      // Format trigger for compact display with natural, flowing text
                      let displayText = trigger.name;

                      if (trigger.id === 'damage_taken') {
                        const amount = trigger.parameters?.amount;
                        const damageType = trigger.parameters?.damage_type;
                        const perspective = trigger.parameters?.perspective || 'self';

                        const whoMap = {
                          'self': 'I take',
                          'target': 'my target takes',
                          'ally': 'an ally takes',
                          'enemy': 'an enemy takes',
                          'any': 'anyone takes'
                        };

                        displayText = `When ${whoMap[perspective]}`;
                        if (amount) displayText += ` ${amount} pts of`;
                        if (damageType && damageType !== 'any') {
                          displayText += ` ${damageType}`;
                        }
                        displayText += ' damage';

                      } else if (trigger.id === 'critical_hit_taken') {
                        const perspective = trigger.parameters?.perspective || 'self';
                        const whoMap = {
                          'self': 'I receive',
                          'target': 'my target receives',
                          'ally': 'an ally receives',
                          'enemy': 'an enemy receives',
                          'any': 'anyone receives'
                        };
                        displayText = `When ${whoMap[perspective]} a critical hit`;

                      } else if (trigger.id === 'critical_hit_dealt') {
                        const perspective = trigger.parameters?.perspective || 'self';
                        const whoMap = {
                          'self': 'I deal',
                          'target': 'my target deals',
                          'ally': 'an ally deals',
                          'enemy': 'an enemy deals',
                          'any': 'anyone deals'
                        };
                        displayText = `When ${whoMap[perspective]} a critical hit`;

                      } else if (trigger.id === 'distance_moved') {
                        const distance = trigger.parameters?.distance || 30;
                        const perspective = trigger.parameters?.perspective || 'self';
                        const whoMap = {
                          'self': 'I move',
                          'target': 'my target moves',
                          'ally': 'an ally moves',
                          'enemy': 'an enemy moves',
                          'any': 'anyone moves'
                        };
                        displayText = `When ${whoMap[perspective]} ${distance} ft`;

                      } else if (trigger.id === 'spell_cast') {
                        const spellLevel = trigger.parameters?.spell_level;
                        const perspective = trigger.parameters?.perspective || 'self';
                        const whoMap = {
                          'self': 'I cast',
                          'target': 'my target casts',
                          'ally': 'an ally casts',
                          'enemy': 'an enemy casts',
                          'any': 'anyone casts'
                        };
                        displayText = `When ${whoMap[perspective]}`;
                        if (spellLevel) {
                          displayText += ` a level ${spellLevel} spell`;
                        } else {
                          displayText += ' a spell';
                        }

                      } else if (trigger.id === 'resource_threshold') {
                        const resourceType = trigger.parameters?.resource_type || 'health';
                        const thresholdValue = trigger.parameters?.threshold_value || 50;
                        const thresholdType = trigger.parameters?.threshold_type || 'percentage';
                        const perspective = trigger.parameters?.perspective || 'self';

                        const whoMap = {
                          'self': 'my',
                          'target': "my target's",
                          'ally': "an ally's",
                          'enemy': "an enemy's",
                          'any': "anyone's"
                        };

                        const suffix = thresholdType === 'percentage' ? '%' : ' pts';
                        const resourceName = resourceType.charAt(0).toUpperCase() + resourceType.slice(1);
                        const operator = thresholdType === 'percentage' && thresholdValue <= 50 ? 'drops below' : 'reaches';

                        displayText = `When ${whoMap[perspective]} ${resourceName.toLowerCase()} ${operator} ${thresholdValue}${suffix}`;

                      } else if (trigger.id === 'terrain_type') {
                        const terrainType = trigger.parameters?.terrain_type;
                        if (terrainType) {
                          displayText = `When on ${terrainType} terrain`;
                        }
                      } else if (trigger.id === 'proximity' || trigger.id === 'enter_range') {
                        const distance = trigger.parameters?.distance || trigger.parameters?.range || 30;
                        const entityType = trigger.parameters?.entity_type || trigger.parameters?.entitiesAffected || 'any';
                        const entityMap = {
                          'any': 'anyone',
                          'allies': 'an ally',
                          'enemies': 'an enemy',
                          'self': 'I'
                        };
                        displayText = `When ${entityMap[entityType] || 'anyone'} enters within ${distance} ft`;
                      } else if (trigger.id === 'exit_range') {
                        const distance = trigger.parameters?.distance || trigger.parameters?.range || 30;
                        const entityType = trigger.parameters?.entity_type || trigger.parameters?.entitiesAffected || 'any';
                        const entityMap = {
                          'any': 'anyone',
                          'allies': 'an ally',
                          'enemies': 'an enemy',
                          'self': 'I'
                        };
                        displayText = `When ${entityMap[entityType] || 'anyone'} exits ${distance} ft range`;
                      } else if (trigger.id === 'last_ally_standing') {
                        displayText = "When I'm the last ally standing";
                      } else if (trigger.id === 'outnumbered') {
                        const ratio = trigger.parameters?.ratio || 2;
                        displayText = `When outnumbered ${ratio}:1`;
                      } else if (trigger.id === 'low_health') {
                        const threshold = trigger.parameters?.threshold || 25;
                        displayText = `When below ${threshold}% health`;
                      } else if (trigger.id === 'critical_hit') {
                        const perspective = trigger.parameters?.perspective || 'self';
                        const whoMap = {
                          'self': 'I land',
                          'target': 'my target lands',
                          'ally': 'an ally lands',
                          'enemy': 'an enemy lands',
                          'any': 'anyone lands'
                        };
                        displayText = `When ${whoMap[perspective]} a critical hit`;
                      } else if (trigger.id === 'critical_hit_taken') {
                        const perspective = trigger.parameters?.perspective || 'self';
                        const whoMap = {
                          'self': 'I receive',
                          'target': 'my target receives',
                          'ally': 'an ally receives',
                          'enemy': 'an enemy receives',
                          'any': 'anyone receives'
                        };
                        displayText = `When ${whoMap[perspective]} a critical hit`;
                      } else if (trigger.id === 'miss') {
                        const perspective = trigger.parameters?.perspective || 'self';
                        const whoMap = {
                          'self': 'When an enemy\'s attack misses me',
                          'target': 'When my target\'s attack misses',
                          'ally': 'When an ally\'s attack misses',
                          'enemy': 'When an enemy\'s attack misses',
                          'any': 'When anyone\'s attack misses'
                        };
                        displayText = whoMap[perspective] || 'When an enemy\'s attack misses me';
                      } else if (trigger.id === 'dodge') {
                        const perspective = trigger.parameters?.perspective || 'self';
                        const whoMap = {
                          'self': 'When I dodge an attack',
                          'target': 'When my target dodges an attack',
                          'ally': 'When an ally dodges an attack',
                          'enemy': 'When an enemy dodges an attack',
                          'any': 'When anyone dodges an attack'
                        };
                        displayText = whoMap[perspective] || 'When I dodge an attack';
                      } else if (trigger.id === 'parry') {
                        const perspective = trigger.parameters?.perspective || 'self';
                        const whoMap = {
                          'self': 'When I parry an attack',
                          'target': 'When my target parries an attack',
                          'ally': 'When an ally parries an attack',
                          'enemy': 'When an enemy parries an attack',
                          'any': 'When anyone parries an attack'
                        };
                        displayText = whoMap[perspective] || 'When I parry an attack';
                      } else if (trigger.id === 'block') {
                        const perspective = trigger.parameters?.perspective || 'self';
                        const whoMap = {
                          'self': 'When I block an attack',
                          'target': 'When my target blocks an attack',
                          'ally': 'When an ally blocks an attack',
                          'enemy': 'When an enemy blocks an attack',
                          'any': 'When anyone blocks an attack'
                        };
                        displayText = whoMap[perspective] || 'When I block an attack';
                      } else if (trigger.id === 'leave_area') {
                        const perspective = trigger.parameters?.perspective || 'self';
                        const areaType = trigger.parameters?.area_type || 'area';
                        const whoMap = {
                          'self': 'I leave',
                          'target': 'my target leaves',
                          'ally': 'an ally leaves',
                          'enemy': 'an enemy leaves',
                          'any': 'anyone leaves'
                        };
                        displayText = `When ${whoMap[perspective] || 'I leave'} ${areaType}`;
                      } else if (trigger.id === 'enter_area') {
                        const perspective = trigger.parameters?.perspective || 'self';
                        const areaType = trigger.parameters?.area_type || 'area';
                        const whoMap = {
                          'self': 'I enter',
                          'target': 'my target enters',
                          'ally': 'an ally enters',
                          'enemy': 'an enemy enters',
                          'any': 'anyone enters'
                        };
                        displayText = `When ${whoMap[perspective] || 'I enter'} ${areaType}`;
                      } else if (trigger.id === 'proximity') {
                        const distance = trigger.parameters?.distance || 30;
                        const entityType = trigger.parameters?.entity_type || 'any';
                        const entityMap = {
                          'any': 'anyone',
                          'ally': 'an ally',
                          'enemy': 'an enemy',
                          'self': 'I'
                        };
                        displayText = `When ${entityMap[entityType] || 'anyone'} comes within ${distance} ft`;
                      } else if (trigger.id === 'movement_start') {
                        const perspective = trigger.parameters?.perspective || 'self';
                        const whoMap = {
                          'self': 'When I start moving',
                          'target': 'When my target starts moving',
                          'ally': 'When an ally starts moving',
                          'enemy': 'When an enemy starts moving',
                          'any': 'When anyone starts moving'
                        };
                        displayText = whoMap[perspective] || 'When I start moving';
                      } else if (trigger.id === 'movement_end') {
                        const perspective = trigger.parameters?.perspective || 'self';
                        const whoMap = {
                          'self': 'When I stop moving',
                          'target': 'When my target stops moving',
                          'ally': 'When an ally stops moving',
                          'enemy': 'When an enemy stops moving',
                          'any': 'When anyone stops moving'
                        };
                        displayText = whoMap[perspective] || 'When I stop moving';
                      } else if (trigger.id === 'health_threshold') {
                        const perspective = trigger.parameters?.perspective || 'self';
                        const percentage = trigger.parameters?.percentage || 50;
                        const comparison = trigger.parameters?.comparison || 'below';
                        const whoMap = {
                          'self': 'my health',
                          'target': 'target\'s health',
                          'ally': 'ally\'s health',
                          'enemy': 'enemy\'s health',
                          'any': 'anyone\'s health'
                        };
                        const compMap = {
                          'below': 'falls below',
                          'above': 'rises above',
                          'equals': 'equals'
                        };
                        displayText = `When ${whoMap[perspective] || 'my health'} ${compMap[comparison] || 'falls below'} ${percentage}%`;
                      }

                      return (
                        <span key={index} className="trigger-compact-condition">
                          {displayText}
                          {index < hasTriggerConfig.global.compoundTriggers.length - 1 && (
                            <span className="trigger-logic"> {hasTriggerConfig.global.logicType === 'AND' ? ' and ' : ' or '} </span>
                          )}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })()}

          {/* Description - Positioned after triggers with minimal spacing */}
          {spell?.description && (
            <div className="item-description">
              "{spell.description}"
            </div>
          )}

          {/* Stats (varies by variant) */}
          {showStats && (
            <div className="pf-spell-stats wow-spell-stats">
              {/* Damage Display - Only show if damage is actually configured */}
              {(() => {
                // Check if there's actual damage configuration (not healing)
                const hasPrimaryDamage = spell?.primaryDamage?.dice && spell.primaryDamage.dice !== '6d6';
                const hasDamageFormula = spell?.damageConfig?.formula && spell.damageConfig.formula.trim();
                // Only check for card/coin damage if there's actual damage config AND damage effect type
                const hasCardDamage = spell?.resolution === 'CARDS' && spell?.cardConfig && spell?.damageConfig && spell?.effectTypes?.includes('damage');
                const hasCoinDamage = spell?.resolution === 'COINS' && spell?.coinConfig && spell?.damageConfig && spell?.effectTypes?.includes('damage');
                const hasDiceDamage = spell?.resolution === 'DICE' && spell?.diceConfig?.formula && spell.diceConfig.formula.trim() && spell?.damageConfig && spell?.effectTypes?.includes('damage');
                const hasDamageEffect = spell?.effectTypes?.includes('damage');

                return hasPrimaryDamage || hasDamageFormula || hasCardDamage || hasCoinDamage || hasDiceDamage || hasDamageEffect;
              })() && (
                <div className="damage-effects">
                  <div className="damage-effects-section">
                    <div className="damage-header">
                      <span className="damage-label">DAMAGE</span>
                    </div>
                    <div className="damage-separator"></div>
                    {(() => {
                      const damageData = spell?.damageConfig;
                      if (!damageData) return null;

                      const effects = [];

                      // Main instant damage effect
                      const damageResult = formatDamage();
                      if (damageResult) {
                        if (typeof damageResult === 'object' && damageResult.instant && damageResult.dot) {
                          // Instant damage
                          effects.push({
                            name: 'Instant Damage',
                            description: 'Roll dice',
                            mechanicsText: damageResult.instant
                          });

                          // DoT damage
                          effects.push({
                            name: 'Damage Over Time',
                            description: `Per round for ${damageData?.dotConfig?.duration || 3} rounds`,
                            mechanicsText: damageResult.dot
                          });
                        } else {
                          // Single damage effect
                          const isDotOnly = damageData?.damageType === 'dot' && !damageData?.hasDotEffect;
                          effects.push({
                            name: isDotOnly ? 'Damage Over Time' : 'Instant Damage',
                            description: isDotOnly ? `Per round for ${damageData?.dotConfig?.duration || 3} rounds` : 'Roll dice',
                            mechanicsText: damageResult
                          });
                        }
                      }

                      // Add saving throw info
                      if (damageData?.savingThrowConfig?.enabled) {
                        const saveInfo = formatSavingThrow(damageData.savingThrowConfig, 'damage');
                        if (saveInfo) {
                          effects.push({
                            name: 'Saving Throw',
                            description: `${saveInfo.saveType} save DC ${saveInfo.dc}`,
                            mechanicsText: saveInfo.outcome
                          });
                        }
                      }

                      // Add critical hit info
                      if (damageData?.criticalConfig?.enabled) {
                        const critInfo = formatCriticalHit();
                        if (critInfo) {
                          effects.push({
                            name: 'Critical Hit',
                            description: critInfo,
                            mechanicsText: 'Enhanced damage on critical'
                          });
                        }
                      }

                      // Add effect-specific triggers for damage (only if conditional activation is enabled)
                      const damageEffectTriggers = spell?.triggerConfig?.effectTriggers?.damage;
                      const isDamageConditional = spell?.conditionalEffects?.damage?.isConditional;
                      if (damageEffectTriggers?.compoundTriggers?.length > 0 && isDamageConditional) {
                        // Format trigger names with natural, flowing text
                        const triggerTexts = damageEffectTriggers.compoundTriggers.map(trigger => {
                          let displayText = trigger.name;

                          // Use same natural formatting as global triggers
                          if (trigger.id === 'damage_taken') {
                            const amount = trigger.parameters?.amount;
                            const damageType = trigger.parameters?.damage_type;
                            const perspective = trigger.parameters?.perspective || 'self';

                            const whoMap = {
                              'self': 'I take',
                              'target': 'my target takes',
                              'ally': 'an ally takes',
                              'enemy': 'an enemy takes',
                              'any': 'anyone takes'
                            };

                            displayText = `When ${whoMap[perspective]}`;
                            if (amount) displayText += ` ${amount} pts of`;
                            if (damageType && damageType !== 'any') {
                              displayText += ` ${damageType}`;
                            }
                            displayText += ' damage';

                          } else if (trigger.id === 'critical_hit_taken') {
                            const perspective = trigger.parameters?.perspective || 'self';
                            const whoMap = {
                              'self': 'I receive',
                              'target': 'my target receives',
                              'ally': 'an ally receives',
                              'enemy': 'an enemy receives',
                              'any': 'anyone receives'
                            };
                            displayText = `When ${whoMap[perspective]} a critical hit`;

                          } else if (trigger.id === 'distance_moved') {
                            const perspective = trigger.parameters?.perspective || 'self';
                            const distance = trigger.parameters?.distance || 30;
                            const whoMap = {
                              'self': 'I move',
                              'target': 'my target moves',
                              'ally': 'an ally moves',
                              'enemy': 'an enemy moves',
                              'any': 'anyone moves'
                            };
                            displayText = `When ${whoMap[perspective]} ${distance} ft`;
                          } else if (trigger.id === 'proximity' || trigger.id === 'enter_range') {
                            const distance = trigger.parameters?.distance || trigger.parameters?.range || 30;
                            const entityType = trigger.parameters?.entity_type || trigger.parameters?.entitiesAffected || 'any';
                            const entityMap = {
                              'any': 'anyone',
                              'allies': 'an ally',
                              'enemies': 'an enemy',
                              'self': 'I'
                            };
                            displayText = `When ${entityMap[entityType] || 'anyone'} enters within ${distance} ft`;
                          } else if (trigger.id === 'exit_range') {
                            const distance = trigger.parameters?.distance || trigger.parameters?.range || 30;
                            const entityType = trigger.parameters?.entity_type || trigger.parameters?.entitiesAffected || 'any';
                            const entityMap = {
                              'any': 'anyone',
                              'allies': 'an ally',
                              'enemies': 'an enemy',
                              'self': 'I'
                            };
                            displayText = `When ${entityMap[entityType] || 'anyone'} exits ${distance} ft range`;
                          } else if (trigger.id === 'last_ally_standing') {
                            displayText = "When I'm the last ally standing";
                          } else if (trigger.id === 'outnumbered') {
                            const ratio = trigger.parameters?.ratio || 2;
                            displayText = `When outnumbered ${ratio}:1`;
                          } else if (trigger.id === 'low_health') {
                            const threshold = trigger.parameters?.threshold || 25;
                            displayText = `When below ${threshold}% health`;
                          } else if (trigger.id === 'critical_hit') {
                            const perspective = trigger.parameters?.perspective || 'self';
                            const whoMap = {
                              'self': 'I land',
                              'target': 'my target lands',
                              'ally': 'an ally lands',
                              'enemy': 'an enemy lands',
                              'any': 'anyone lands'
                            };
                            displayText = `When ${whoMap[perspective]} a critical hit`;
                          } else if (trigger.id === 'critical_hit_taken') {
                            const perspective = trigger.parameters?.perspective || 'self';
                            const whoMap = {
                              'self': 'I receive',
                              'target': 'my target receives',
                              'ally': 'an ally receives',
                              'enemy': 'an enemy receives',
                              'any': 'anyone receives'
                            };
                            displayText = `When ${whoMap[perspective]} a critical hit`;
                          } else if (trigger.id === 'miss') {
                            const perspective = trigger.parameters?.perspective || 'self';
                            const whoMap = {
                              'self': 'When an enemy\'s attack misses me',
                              'target': 'When my target\'s attack misses',
                              'ally': 'When an ally\'s attack misses',
                              'enemy': 'When an enemy\'s attack misses',
                              'any': 'When anyone\'s attack misses'
                            };
                            displayText = whoMap[perspective] || 'When an enemy\'s attack misses me';
                          } else if (trigger.id === 'dodge') {
                            const perspective = trigger.parameters?.perspective || 'self';
                            const whoMap = {
                              'self': 'When I dodge an attack',
                              'target': 'When my target dodges an attack',
                              'ally': 'When an ally dodges an attack',
                              'enemy': 'When an enemy dodges an attack',
                              'any': 'When anyone dodges an attack'
                            };
                            displayText = whoMap[perspective] || 'When I dodge an attack';
                          } else if (trigger.id === 'parry') {
                            const perspective = trigger.parameters?.perspective || 'self';
                            const whoMap = {
                              'self': 'When I parry an attack',
                              'target': 'When my target parries an attack',
                              'ally': 'When an ally parries an attack',
                              'enemy': 'When an enemy parries an attack',
                              'any': 'When anyone parries an attack'
                            };
                            displayText = whoMap[perspective] || 'When I parry an attack';
                          } else if (trigger.id === 'block') {
                            const perspective = trigger.parameters?.perspective || 'self';
                            const whoMap = {
                              'self': 'When I block an attack',
                              'target': 'When my target blocks an attack',
                              'ally': 'When an ally blocks an attack',
                              'enemy': 'When an enemy blocks an attack',
                              'any': 'When anyone blocks an attack'
                            };
                            displayText = whoMap[perspective] || 'When I block an attack';
                          } else if (trigger.id === 'leave_area') {
                            const perspective = trigger.parameters?.perspective || 'self';
                            const areaType = trigger.parameters?.area_type || 'area';
                            const whoMap = {
                              'self': 'I leave',
                              'target': 'my target leaves',
                              'ally': 'an ally leaves',
                              'enemy': 'an enemy leaves',
                              'any': 'anyone leaves'
                            };
                            displayText = `When ${whoMap[perspective] || 'I leave'} ${areaType}`;
                          } else if (trigger.id === 'enter_area') {
                            const perspective = trigger.parameters?.perspective || 'self';
                            const areaType = trigger.parameters?.area_type || 'area';
                            const whoMap = {
                              'self': 'I enter',
                              'target': 'my target enters',
                              'ally': 'an ally enters',
                              'enemy': 'an enemy enters',
                              'any': 'anyone enters'
                            };
                            displayText = `When ${whoMap[perspective] || 'I enter'} ${areaType}`;
                          } else if (trigger.id === 'proximity') {
                            const distance = trigger.parameters?.distance || 30;
                            const entityType = trigger.parameters?.entity_type || 'any';
                            const entityMap = {
                              'any': 'anyone',
                              'ally': 'an ally',
                              'enemy': 'an enemy',
                              'self': 'I'
                            };
                            displayText = `When ${entityMap[entityType] || 'anyone'} comes within ${distance} ft`;
                          } else if (trigger.id === 'movement_start') {
                            const perspective = trigger.parameters?.perspective || 'self';
                            const whoMap = {
                              'self': 'When I start moving',
                              'target': 'When my target starts moving',
                              'ally': 'When an ally starts moving',
                              'enemy': 'When an enemy starts moving',
                              'any': 'When anyone starts moving'
                            };
                            displayText = whoMap[perspective] || 'When I start moving';
                          } else if (trigger.id === 'movement_end') {
                            const perspective = trigger.parameters?.perspective || 'self';
                            const whoMap = {
                              'self': 'When I stop moving',
                              'target': 'When my target stops moving',
                              'ally': 'When an ally stops moving',
                              'enemy': 'When an enemy stops moving',
                              'any': 'When anyone stops moving'
                            };
                            displayText = whoMap[perspective] || 'When I stop moving';
                          } else if (trigger.id === 'health_threshold') {
                            const perspective = trigger.parameters?.perspective || 'self';
                            const percentage = trigger.parameters?.percentage || 50;
                            const comparison = trigger.parameters?.comparison || 'below';
                            const whoMap = {
                              'self': 'my health',
                              'target': 'target\'s health',
                              'ally': 'ally\'s health',
                              'enemy': 'enemy\'s health',
                              'any': 'anyone\'s health'
                            };
                            const compMap = {
                              'below': 'falls below',
                              'above': 'rises above',
                              'equals': 'equals'
                            };
                            displayText = `When ${whoMap[perspective] || 'my health'} ${compMap[comparison] || 'falls below'} ${percentage}%`;
                          }

                          return displayText;
                        });

                        const logicType = damageEffectTriggers.logicType || 'AND';
                        const triggerText = triggerTexts.length === 1
                          ? triggerTexts[0]
                          : `${triggerTexts.slice(0, -1).join(', ')} ${logicType.toLowerCase()} ${triggerTexts[triggerTexts.length - 1]}`;

                        effects.push({
                          name: 'Damage Triggers',
                          description: triggerText,
                          mechanicsText: `Damage activates ${triggerText.toLowerCase()}`
                        });
                      }

                      // Add chance on hit info
                      if (damageData?.chanceOnHitConfig?.enabled) {
                        const chanceInfo = formatChanceOnHit();
                        if (chanceInfo) {
                          effects.push({
                            name: 'Chance Effect',
                            description: chanceInfo,
                            mechanicsText: 'Additional effect on trigger'
                          });
                        }
                      }

                      return effects.length > 0 ? (
                        <div className="damage-formula-line">
                          <div className="damage-effects-list">
                            {effects.map((effect, index) => (
                              <div key={`damage-${index}`} className="damage-effect-item">
                                <div className="damage-effect">
                                  <span className="damage-effect-name">
                                    {effect.name}
                                  </span>
                                  {effect.description && effect.description !== effect.name && (
                                    <span className="damage-effect-description">
                                      {" - "}{effect.description}
                                    </span>
                                  )}
                                </div>
                                {effect.mechanicsText && (
                                  <div className="damage-effect-details">
                                    <div className="damage-effect-mechanics">
                                      {effect.mechanicsText}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="damage-formula-line">
                          <span className="damage-formula-value">Configure damage effects in the spellcrafting wizard</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}



              {/* Healing Display - Only show if healing is actually configured */}
              {(() => {
                // Check if there's actual healing configuration (more specific check)
                const hasDirectHealingFormula = spell?.healingConfig?.healingType === 'direct' && (
                  (spell.resolution === 'CARDS' && spell.healingConfig?.cardConfig?.formula) ||
                  (spell.resolution === 'COINS' && spell.healingConfig?.coinConfig?.formula) ||
                  (spell.resolution === 'DICE' && spell.healingConfig?.formula)
                );

                const hasHotHealingFormula = spell?.healingConfig?.healingType === 'hot' && (
                  (spell.resolution === 'CARDS' && spell.healingConfig?.hotCardConfig?.formula) ||
                  (spell.resolution === 'COINS' && spell.healingConfig?.hotCoinConfig?.formula) ||
                  (spell.resolution === 'DICE' && spell.healingConfig?.hotFormula)
                );

                const hasShieldHealingFormula = spell?.healingConfig?.healingType === 'shield' && (
                  (spell.resolution === 'CARDS' && spell.healingConfig?.shieldCardConfig?.formula) ||
                  (spell.resolution === 'COINS' && spell.healingConfig?.shieldCoinConfig?.formula) ||
                  (spell.resolution === 'DICE' && spell.healingConfig?.shieldFormula)
                );

                const hasLegacyHealing = spell?.healing && (spell.healing.dice || spell.healing.flat > 0);
                const hasHealingEffect = spell?.effectTypes?.includes('healing');

                return hasDirectHealingFormula || hasHotHealingFormula || hasShieldHealingFormula || hasLegacyHealing || hasHealingEffect;
              })() && (
                <div className="healing-effects">
                  <div className="healing-effects-section">
                    <div className="healing-header">
                      <span className="healing-label">HEALING</span>
                      <span className="healing-type">
                        {spell?.healingConfig?.healingType === 'hot' ? 'Over Time' :
                         spell?.healingConfig?.healingType === 'shield' ? 'Shield' : 'Hit Points'}
                      </span>
                    </div>
                    <div className="healing-separator"></div>
                    {(() => {
                      const healingData = spell?.healingConfig;
                      if (!healingData) return null;

                      const effects = [];

                      // Main healing effect
                      const healingResult = formatHealing();
                      if (healingResult) {
                        if (typeof healingResult === 'object' && healingResult.description) {
                          // Shield healing
                          effects.push({
                            name: 'Shield Absorption',
                            description: 'Absorbs damage',
                            mechanicsText: healingResult.description
                          });

                          // Add shield properties as separate effects
                          if (healingResult.bullets && healingResult.bullets.length > 0) {
                            healingResult.bullets.forEach((bullet, index) => {
                              effects.push({
                                name: `  └ Shield Property`,
                                description: bullet,
                                mechanicsText: 'Special shield behavior'
                              });
                            });
                          }
                        } else {
                          // Regular healing
                          const healingType = healingData.healingType;
                          effects.push({
                            name: healingType === 'hot' ? 'Healing Over Time' :
                                  healingType === 'shield' ? 'Shield Absorption' : 'Instant Healing',
                            description: healingType === 'hot' ? `Per round for ${healingData.hotDuration || 3} rounds` : 'Roll dice',
                            mechanicsText: healingResult
                          });
                        }
                      }

                      // Add HoT effect if it's an additional effect
                      if (healingData.hasHotEffect && healingData.hotFormula && healingData.healingType !== 'hot') {
                        const duration = healingData.hotDuration || 3;
                        effects.push({
                          name: 'Healing Over Time',
                          description: `Per round for ${duration} rounds`,
                          mechanicsText: `${cleanFormula(healingData.hotFormula)} hit points restored`
                        });
                      }

                      // Add shield effect if it's an additional effect
                      if (healingData.hasShieldEffect && healingData.shieldFormula && healingData.healingType !== 'shield') {
                        const duration = healingData.shieldDuration || 3;
                        effects.push({
                          name: 'Shield Absorption',
                          description: `For ${duration} rounds`,
                          mechanicsText: `${cleanFormula(healingData.shieldFormula)} absorption`
                        });
                      }

                      // Add critical healing info
                      if (healingData?.criticalConfig?.enabled) {
                        const critInfo = formatCriticalHit();
                        if (critInfo) {
                          effects.push({
                            name: 'Critical Healing',
                            description: critInfo,
                            mechanicsText: 'Enhanced healing on critical'
                          });
                        }
                      }

                      // Add chance on heal info
                      if (healingData?.chanceOnHitConfig?.enabled) {
                        const chanceInfo = formatChanceOnHit();
                        if (chanceInfo) {
                          effects.push({
                            name: 'Chance Effect',
                            description: chanceInfo,
                            mechanicsText: 'Additional effect on trigger'
                          });
                        }
                      }

                      // Add effect-specific triggers for healing (only if conditional activation is enabled)
                      const healingEffectTriggers = spell?.triggerConfig?.effectTriggers?.healing;
                      const isHealingConditional = spell?.conditionalEffects?.healing?.isConditional;
                      if (healingEffectTriggers?.compoundTriggers?.length > 0 && isHealingConditional) {
                        // Format trigger names with natural, flowing text
                        const triggerTexts = healingEffectTriggers.compoundTriggers.map(trigger => {
                          let displayText = trigger.name;

                          // Use same natural formatting as global triggers
                          if (trigger.id === 'damage_taken') {
                            const amount = trigger.parameters?.amount;
                            const damageType = trigger.parameters?.damage_type;
                            const perspective = trigger.parameters?.perspective || 'self';

                            const whoMap = {
                              'self': 'I take',
                              'target': 'my target takes',
                              'ally': 'an ally takes',
                              'enemy': 'an enemy takes',
                              'any': 'anyone takes'
                            };

                            displayText = `When ${whoMap[perspective]}`;
                            if (amount) displayText += ` ${amount} pts of`;
                            if (damageType && damageType !== 'any') {
                              displayText += ` ${damageType}`;
                            }
                            displayText += ' damage';

                          } else if (trigger.id === 'critical_hit_taken') {
                            const perspective = trigger.parameters?.perspective || 'self';
                            const whoMap = {
                              'self': 'I receive',
                              'target': 'my target receives',
                              'ally': 'an ally receives',
                              'enemy': 'an enemy receives',
                              'any': 'anyone receives'
                            };
                            displayText = `When ${whoMap[perspective]} a critical hit`;

                          } else if (trigger.id === 'distance_moved') {
                            const perspective = trigger.parameters?.perspective || 'self';
                            const distance = trigger.parameters?.distance || 30;
                            const whoMap = {
                              'self': 'I move',
                              'target': 'my target moves',
                              'ally': 'an ally moves',
                              'enemy': 'an enemy moves',
                              'any': 'anyone moves'
                            };
                            displayText = `When ${whoMap[perspective]} ${distance} ft`;
                          } else if (trigger.id === 'proximity' || trigger.id === 'enter_range') {
                            const distance = trigger.parameters?.distance || trigger.parameters?.range || 30;
                            const entityType = trigger.parameters?.entity_type || trigger.parameters?.entitiesAffected || 'any';
                            const entityMap = {
                              'any': 'anyone',
                              'allies': 'an ally',
                              'enemies': 'an enemy',
                              'self': 'I'
                            };
                            displayText = `When ${entityMap[entityType] || 'anyone'} enters within ${distance} ft`;
                          } else if (trigger.id === 'exit_range') {
                            const distance = trigger.parameters?.distance || trigger.parameters?.range || 30;
                            const entityType = trigger.parameters?.entity_type || trigger.parameters?.entitiesAffected || 'any';
                            const entityMap = {
                              'any': 'anyone',
                              'allies': 'an ally',
                              'enemies': 'an enemy',
                              'self': 'I'
                            };
                            displayText = `When ${entityMap[entityType] || 'anyone'} exits ${distance} ft range`;
                          } else if (trigger.id === 'last_ally_standing') {
                            displayText = "When I'm the last ally standing";
                          } else if (trigger.id === 'outnumbered') {
                            const ratio = trigger.parameters?.ratio || 2;
                            displayText = `When outnumbered ${ratio}:1`;
                          } else if (trigger.id === 'low_health') {
                            const threshold = trigger.parameters?.threshold || 25;
                            displayText = `When below ${threshold}% health`;
                          } else if (trigger.id === 'critical_hit') {
                            const perspective = trigger.parameters?.perspective || 'self';
                            const whoMap = {
                              'self': 'I land',
                              'target': 'my target lands',
                              'ally': 'an ally lands',
                              'enemy': 'an enemy lands',
                              'any': 'anyone lands'
                            };
                            displayText = `When ${whoMap[perspective]} a critical hit`;
                          } else if (trigger.id === 'critical_hit_taken') {
                            const perspective = trigger.parameters?.perspective || 'self';
                            const whoMap = {
                              'self': 'I receive',
                              'target': 'my target receives',
                              'ally': 'an ally receives',
                              'enemy': 'an enemy receives',
                              'any': 'anyone receives'
                            };
                            displayText = `When ${whoMap[perspective]} a critical hit`;
                          } else if (trigger.id === 'miss') {
                            const perspective = trigger.parameters?.perspective || 'self';
                            const whoMap = {
                              'self': 'When an enemy\'s attack misses me',
                              'target': 'When my target\'s attack misses',
                              'ally': 'When an ally\'s attack misses',
                              'enemy': 'When an enemy\'s attack misses',
                              'any': 'When anyone\'s attack misses'
                            };
                            displayText = whoMap[perspective] || 'When an enemy\'s attack misses me';
                          } else if (trigger.id === 'dodge') {
                            const perspective = trigger.parameters?.perspective || 'self';
                            const whoMap = {
                              'self': 'When I dodge an attack',
                              'target': 'When my target dodges an attack',
                              'ally': 'When an ally dodges an attack',
                              'enemy': 'When an enemy dodges an attack',
                              'any': 'When anyone dodges an attack'
                            };
                            displayText = whoMap[perspective] || 'When I dodge an attack';
                          } else if (trigger.id === 'parry') {
                            const perspective = trigger.parameters?.perspective || 'self';
                            const whoMap = {
                              'self': 'When I parry an attack',
                              'target': 'When my target parries an attack',
                              'ally': 'When an ally parries an attack',
                              'enemy': 'When an enemy parries an attack',
                              'any': 'When anyone parries an attack'
                            };
                            displayText = whoMap[perspective] || 'When I parry an attack';
                          } else if (trigger.id === 'block') {
                            const perspective = trigger.parameters?.perspective || 'self';
                            const whoMap = {
                              'self': 'When I block an attack',
                              'target': 'When my target blocks an attack',
                              'ally': 'When an ally blocks an attack',
                              'enemy': 'When an enemy blocks an attack',
                              'any': 'When anyone blocks an attack'
                            };
                            displayText = whoMap[perspective] || 'When I block an attack';
                          } else if (trigger.id === 'leave_area') {
                            const perspective = trigger.parameters?.perspective || 'self';
                            const areaType = trigger.parameters?.area_type || 'area';
                            const whoMap = {
                              'self': 'I leave',
                              'target': 'my target leaves',
                              'ally': 'an ally leaves',
                              'enemy': 'an enemy leaves',
                              'any': 'anyone leaves'
                            };
                            displayText = `When ${whoMap[perspective] || 'I leave'} ${areaType}`;
                          } else if (trigger.id === 'enter_area') {
                            const perspective = trigger.parameters?.perspective || 'self';
                            const areaType = trigger.parameters?.area_type || 'area';
                            const whoMap = {
                              'self': 'I enter',
                              'target': 'my target enters',
                              'ally': 'an ally enters',
                              'enemy': 'an enemy enters',
                              'any': 'anyone enters'
                            };
                            displayText = `When ${whoMap[perspective] || 'I enter'} ${areaType}`;
                          } else if (trigger.id === 'proximity') {
                            const distance = trigger.parameters?.distance || 30;
                            const entityType = trigger.parameters?.entity_type || 'any';
                            const entityMap = {
                              'any': 'anyone',
                              'ally': 'an ally',
                              'enemy': 'an enemy',
                              'self': 'I'
                            };
                            displayText = `When ${entityMap[entityType] || 'anyone'} comes within ${distance} ft`;
                          } else if (trigger.id === 'movement_start') {
                            const perspective = trigger.parameters?.perspective || 'self';
                            const whoMap = {
                              'self': 'When I start moving',
                              'target': 'When my target starts moving',
                              'ally': 'When an ally starts moving',
                              'enemy': 'When an enemy starts moving',
                              'any': 'When anyone starts moving'
                            };
                            displayText = whoMap[perspective] || 'When I start moving';
                          } else if (trigger.id === 'movement_end') {
                            const perspective = trigger.parameters?.perspective || 'self';
                            const whoMap = {
                              'self': 'When I stop moving',
                              'target': 'When my target stops moving',
                              'ally': 'When an ally stops moving',
                              'enemy': 'When an enemy stops moving',
                              'any': 'When anyone stops moving'
                            };
                            displayText = whoMap[perspective] || 'When I stop moving';
                          } else if (trigger.id === 'health_threshold') {
                            const perspective = trigger.parameters?.perspective || 'self';
                            const percentage = trigger.parameters?.percentage || 50;
                            const comparison = trigger.parameters?.comparison || 'below';
                            const whoMap = {
                              'self': 'my health',
                              'target': 'target\'s health',
                              'ally': 'ally\'s health',
                              'enemy': 'enemy\'s health',
                              'any': 'anyone\'s health'
                            };
                            const compMap = {
                              'below': 'falls below',
                              'above': 'rises above',
                              'equals': 'equals'
                            };
                            displayText = `When ${whoMap[perspective] || 'my health'} ${compMap[comparison] || 'falls below'} ${percentage}%`;
                          }

                          return displayText;
                        });

                        const logicType = healingEffectTriggers.logicType || 'AND';
                        const triggerText = triggerTexts.length === 1
                          ? triggerTexts[0]
                          : `${triggerTexts.slice(0, -1).join(', ')} ${logicType.toLowerCase()} ${triggerTexts[triggerTexts.length - 1]}`;

                        effects.push({
                          name: 'Healing Triggers',
                          description: triggerText,
                          mechanicsText: `Healing activates ${triggerText.toLowerCase()}`
                        });
                      }

                      return effects.length > 0 ? (
                        <div className="healing-formula-line">
                          <div className="healing-effects-list">
                            {effects.map((effect, index) => (
                              <div key={`healing-${index}`} className="healing-effect-item">
                                <div className="healing-effect">
                                  <span className="healing-effect-name">
                                    {effect.name}
                                  </span>
                                  {effect.description && effect.description !== effect.name && (
                                    <span className="healing-effect-description">
                                      {" - "}{effect.description}
                                    </span>
                                  )}
                                </div>
                                {effect.mechanicsText && (
                                  <div className="healing-effect-details">
                                    <div className="healing-effect-mechanics">
                                      {effect.mechanicsText}
                                    </div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="healing-formula-line">
                          <span className="healing-formula-value">Configure healing effects in the spellcrafting wizard</span>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              )}



              {/* Duration (if not instant) - exclude CHANNELED and ZONE since they're shown in bullets */}
              {(spell?.durationType && spell.durationType !== 'instant') &&
               (!spell?.spellType || !['CHANNELED', 'ZONE'].includes(spell.spellType)) ? (
                <div className="unified-spell-stat">
                  <span className="unified-stat-label">Duration:</span>
                  <span className="unified-stat-value">
                    {formatDuration()}
                  </span>
                </div>
              ) : null}

              {/* Buff Effects Section */}
              {(() => {
                const buffEffects = formatBuffEffects();
                const hasBuffType = spell?.effectTypes?.includes('buff');
                const hasBuffConfig = spell?.buffConfig;
                const hasAnyBuffConfiguration = hasBuffConfig && (
                  spell.buffConfig.statModifiers?.length > 0 ||
                  spell.buffConfig.statusEffects?.length > 0 ||
                  spell.buffConfig.duration ||
                  spell.buffConfig.durationType
                );

                return (hasBuffType || hasAnyBuffConfiguration) && (
                  <div className="unified-spell-stat buff-effects">
                    <div className="buff-effects-section">
                      <div className="buff-header">
                        <span className="buff-label">BUFF</span>
                        <span className="buff-type">Enhancement</span>
                        {(() => {
                          // Calculate duration text for buff header
                          let durationText = '';
                          if (spell?.buffConfig?.durationType) {
                            const buffConfig = spell.buffConfig;
                            switch (buffConfig.durationType) {
                              case 'turns':
                                durationText = `${buffConfig.durationValue || 3} turns`;
                                break;
                              case 'rounds':
                                durationText = `${buffConfig.durationValue || 3} rounds`;
                                break;
                              case 'time':
                                if (buffConfig.durationValue && buffConfig.durationUnit) {
                                  durationText = `${buffConfig.durationValue} ${buffConfig.durationUnit}`;
                                }
                                break;
                              case 'rest':
                                if (buffConfig.restType === 'short') {
                                  durationText = 'Until short rest';
                                } else if (buffConfig.restType === 'long') {
                                  durationText = 'Until long rest';
                                }
                                break;
                              case 'permanent':
                                durationText = 'Permanent';
                                break;
                            }
                          }

                          // Add concentration requirement to duration text if applicable
                          if (durationText && spell?.buffConfig?.concentrationRequired) {
                            durationText = `${durationText} (Concentration)`;
                          }

                          return durationText && (
                            <span className="buff-duration">{durationText}</span>
                          );
                        })()}
                      </div>
                      <div className="buff-formula-container">
                        {(() => {
                          const buffEffects = formatBuffEffects();

                          return buffEffects && buffEffects.length > 0 ? (
                            <div className="buff-formula-line">
                              <div className="buff-effects-list">
                                {buffEffects.map((effect, index) => {
                                  if (effect.type === 'stats' || effect.type === 'resistance' || effect.type === 'absorption') {
                                    return (
                                      <div key={`buff-${index}`} className="buff-effect-item">
                                        <div className="buff-effect">
                                          <span className="buff-effect-name">{effect.name}</span>
                                        </div>
                                        <div className="buff-effect-details">
                                          <div className="buff-effect-mechanics">
                                            {effect.data.map((stat, statIndex) => (
                                              <span key={`stat-${statIndex}`} className={`buff-stat-text ${stat.class}`}>
                                                {effect.type === 'stats' ? `${stat.name}: ${stat.value}` : stat.value}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  } else {
                                    return (
                                      <div key={`buff-${index}`} className="buff-effect-item">
                                        <div className="buff-effect">
                                          <span className="buff-effect-name">{effect.name || effect}</span>
                                          {effect.description && effect.description !== effect.name && (
                                            <span className="buff-effect-description"> - {effect.description}</span>
                                          )}
                                        </div>
                                        {effect.mechanicsText && (
                                          <div className="buff-effect-details">
                                            <div className="buff-effect-mechanics">{effect.mechanicsText}</div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  }
                                })}
                              </div>
                            </div>
                          ) : (
                            <div className="buff-formula-line">
                              <span className="buff-formula-value">Configure buff effects in the spellcrafting wizard</span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })()}
              {/* Debuff Effects Section */}
              {(() => {
                const debuffEffects = formatDebuffEffects();
                const hasDebuffType = spell?.effectTypes?.includes('debuff');
                const hasDebuffConfig = spell?.debuffConfig;
                const hasAnyDebuffConfiguration = hasDebuffConfig && (
                  spell.debuffConfig.statPenalties?.length > 0 ||
                  spell.debuffConfig.statModifiers?.length > 0 ||
                  spell.debuffConfig.statusEffects?.length > 0 ||
                  spell.debuffConfig.duration ||
                  spell.debuffConfig.durationType
                );

                return (hasDebuffType || hasAnyDebuffConfiguration) && (
                  <div className="unified-spell-stat debuff-effects">
                    <div className="debuff-effects-section">
                      <div className="debuff-header">
                        <span className="debuff-label">DEBUFF</span>
                        <span className="debuff-type">Penalty</span>
                        {(() => {
                          // Calculate duration text for debuff header
                          let durationText = '';
                          if (spell?.debuffConfig?.durationType) {
                            const debuffConfig = spell.debuffConfig;
                            switch (debuffConfig.durationType) {
                              case 'turns':
                                durationText = `${debuffConfig.durationValue || 3} turns`;
                                break;
                              case 'rounds':
                                durationText = `${debuffConfig.durationValue || 3} rounds`;
                                break;
                              case 'time':
                                if (debuffConfig.durationValue && debuffConfig.durationUnit) {
                                  durationText = `${debuffConfig.durationValue} ${debuffConfig.durationUnit}`;
                                }
                                break;
                              case 'rest':
                                if (debuffConfig.restType === 'short') {
                                  durationText = 'Until short rest';
                                } else if (debuffConfig.restType === 'long') {
                                  durationText = 'Until long rest';
                                }
                                break;
                              case 'permanent':
                                durationText = 'Permanent';
                                break;
                            }
                          }

                          // Add concentration requirement to duration text if applicable
                          if (durationText && spell?.debuffConfig?.concentrationRequired) {
                            durationText = `${durationText} (Concentration)`;
                          }

                          return durationText && (
                            <span className="debuff-duration">{durationText}</span>
                          );
                        })()}
                      </div>
                      <div className="debuff-separator"></div>
                      <div className="debuff-formula-container">
                        {(() => {
                          const debuffEffects = formatDebuffEffects();

                          return debuffEffects && debuffEffects.length > 0 ? (
                            <div className="debuff-formula-line">
                              <div className="debuff-effects-list">
                                {debuffEffects.map((effect, index) => {
                                  if (effect.type === 'stats' || effect.type === 'resistance' || effect.type === 'absorption') {
                                    return (
                                      <div key={`debuff-${index}`} className="debuff-effect-item">
                                        <div className="debuff-effect">
                                          <span className="debuff-effect-name">{effect.name}</span>
                                        </div>
                                        <div className="debuff-effect-details">
                                          <div className="debuff-effect-mechanics">
                                            {effect.data.map((stat, statIndex) => (
                                              <span key={`stat-${statIndex}`} className={`debuff-stat-text ${stat.class}`}>
                                                {effect.type === 'stats' ? `${stat.name}: ${stat.value}` : stat.value}
                                              </span>
                                            ))}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  } else {
                                    return (
                                      <div key={`debuff-${index}`} className="debuff-effect-item">
                                        <div className="debuff-effect">
                                          <span className="debuff-effect-name">{effect.name || effect}</span>
                                          {effect.description && effect.description !== effect.name && (
                                            <span className="debuff-effect-description"> - {effect.description}</span>
                                          )}
                                        </div>
                                        {effect.mechanicsText && (
                                          <div className="debuff-effect-details">
                                            <div className="debuff-effect-mechanics">{effect.mechanicsText}</div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  }
                                })}
                              </div>
                            </div>
                          ) : (
                            <div className="debuff-formula-line">
                              <span className="debuff-formula-value">Configure debuff effects in the spellcrafting wizard</span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Utility Effects Section */}
              {(() => {
                const hasUtilityType = spell?.effectTypes?.includes('utility');
                const hasUtilityConfig = spell?.utilityConfig;
                const hasSelectedEffects = spell?.utilityConfig?.selectedEffects?.length > 0;
                const hasAnyUtilityConfiguration = hasUtilityConfig && (
                  hasSelectedEffects ||
                  spell.utilityConfig.duration ||
                  spell.utilityConfig.utilityType
                );

                // Only show utility effects if utility is selected AND has configuration
                return hasUtilityType && hasAnyUtilityConfiguration && (
                  <div className="unified-spell-stat utility-effects">
                    <div className="utility-effects-section">
                      <div className="utility-header">
                        <span className="utility-label">UTILITY</span>
                        <span className="utility-type">
                          {spell.utilityConfig?.utilityType ?
                            spell.utilityConfig.utilityType.charAt(0).toUpperCase() + spell.utilityConfig.utilityType.slice(1) :
                            'Movement'}
                        </span>
                        {(() => {
                          const duration = spell.utilityConfig?.duration;
                          const durationUnit = spell.utilityConfig?.durationUnit || 'minutes';
                          let durationText = '';

                          if (duration && duration > 0) {
                            durationText = duration === 1 ? `1 ${durationUnit.slice(0, -1)}` : `${duration} ${durationUnit}`;
                          }

                          // Add concentration if required
                          if (durationText && spell?.utilityConfig?.concentration) {
                            durationText = `${durationText} (Concentration)`;
                          }

                          return durationText && (
                            <span className="utility-duration">{durationText}</span>
                          );
                        })()}
                      </div>
                      <div className="utility-separator"></div>
                      <div className="utility-formula-container">
                        {(() => {
                          const effects = spell.utilityConfig?.selectedEffects || [];
                          return effects.length > 0 ? (
                            <div className="utility-formula-line">
                              <div className="utility-effects-list">
                                {effects.map((effect, index) => (
                                  <div key={`utility-${index}`} className="utility-effect-item">
                                    <div className="utility-effect">
                                      <span className="utility-effect-name">{effect.name || effect}</span>
                                      {effect.description && (
                                        <span className="utility-effect-description"> - {effect.description}</span>
                                      )}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="utility-formula-line">
                              <span className="utility-formula-value">Configure utility effects in the spellcrafting wizard</span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Control Effects Section */}
              {(() => {
                const hasControlType = spell?.effectTypes?.includes('control');
                const hasControlConfig = spell?.controlConfig;
                const hasSelectedEffects = spell?.controlConfig?.effects?.length > 0;
                const hasAnyControlConfiguration = hasControlConfig && (
                  spell.controlConfig.duration !== null ||
                  spell.controlConfig.durationUnit !== 'rounds' ||
                  spell.controlConfig.savingThrow !== null ||
                  spell.controlConfig.savingThrowType !== 'strength' ||
                  spell.controlConfig.difficultyClass !== 15 ||
                  spell.controlConfig.concentration ||
                  spell.controlConfig.controlType ||
                  hasSelectedEffects
                );

                // Only show control effects if control is selected AND has configuration
                return hasControlType && hasAnyControlConfiguration && (
                  <div className="unified-spell-stat control-effects">
                    <div className="control-effects-section">
                      <div className="control-header">
                        <span className="control-label">Control</span>
                        {(() => {
                          // Check if instant effect is enabled
                          if (spell.controlConfig?.instant) {
                            return <span className="control-duration">Instant</span>;
                          }

                          const duration = spell.controlConfig?.duration;
                          const durationUnit = spell.controlConfig?.durationUnit || 'rounds';
                          let durationText = '';

                          if (duration && duration > 0) {
                            durationText = duration === 1 ? `1 ${durationUnit.slice(0, -1)}` : `${duration} ${durationUnit}`;
                          }

                          // Add concentration if required
                          if (durationText && spell?.controlConfig?.concentration) {
                            durationText = `${durationText} (Concentration)`;
                          }

                          return durationText && (
                            <span className="control-duration">{durationText}</span>
                          );
                        })()}
                      </div>
                      <div className="control-separator"></div>
                      <div className="control-formula-container">
                        {(() => {
                          const effects = spell.controlConfig?.effects || [];

                          return effects.length > 0 ? (
                            <div className="control-formula-line">
                              <div className="control-effects-list">
                                {effects.map((effect, index) => (
                                  <div key={`control-${index}`} className="control-effect-item">
                                    <div className="control-effect">
                                      <span className="control-effect-name">{effect.name}</span>
                                      {effect.description && effect.description !== effect.name && (
                                        <span className="control-effect-description"> - {effect.description}</span>
                                      )}
                                    </div>
                                    {(effect.flavorText || effect.mechanicsText) && (
                                      <div className="control-effect-details">
                                        {effect.flavorText && (
                                          <div className="control-effect-flavor">{effect.flavorText}</div>
                                        )}
                                        {effect.mechanicsText && !effect.flavorText && (
                                          <div className="control-effect-mechanics">{effect.mechanicsText}</div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="control-formula-line">
                              <span className="control-formula-value">Configure control effects in the spellcrafting wizard</span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })()}



              {/* Summoning Effects Section */}
              {(() => {
                const hasSummoningType = spell?.effectTypes?.includes('summoning');
                // Check both summoningConfig (library format) and summonConfig (wizard format)
                const summoningData = spell?.summoningConfig || spell?.summonConfig;
                const hasSummoningConfig = !!summoningData;
                const hasSelectedCreatures = summoningData?.creatures?.length > 0;
                const hasAnySummoningConfiguration = hasSummoningConfig && (
                  summoningData.duration !== null ||
                  summoningData.durationUnit !== 'minutes' ||
                  summoningData.concentration ||
                  summoningData.controlType ||
                  summoningData.quantity > 1 ||
                  hasSelectedCreatures
                );



                return (hasSummoningType || hasAnySummoningConfiguration) && (
                  <div className="unified-spell-stat summoning-effects">
                    <div className="summoning-effects-section">
                      <div className="summoning-header">
                        <span className="summoning-label">Summoning</span>
                        {(() => {
                          const creatures = summoningData?.creatures || [];

                          // If no creatures, show global settings
                          if (creatures.length === 0) {
                            if (!summoningData?.hasDuration) {
                              return <span className="summoning-duration">Permanent</span>;
                            }
                            const duration = summoningData?.duration || 10;
                            const durationUnit = summoningData?.durationUnit || 'minutes';
                            let durationText = duration === 1 ? `1 ${durationUnit.slice(0, -1)}` : `${duration} ${durationUnit}`;
                            if (summoningData?.concentration) {
                              durationText = `${durationText} (Concentration)`;
                            }
                            return <span className="summoning-duration">{durationText}</span>;
                          }

                          // For multiple creatures, just show a generic label
                          return <span className="summoning-duration">Multiple Creatures</span>;
                        })()}
                      </div>
                      <div className="summoning-content">
                        {(() => {
                          const creatures = summoningData?.creatures || [];

                          if (creatures.length === 0) {
                            return (
                              <div className="summoning-placeholder">
                                <span className="summoning-placeholder-text">No creatures selected</span>
                              </div>
                            );
                          }

                          return (
                            <div className="summoning-creatures-list">
                              {creatures.map((creature, index) => (
                                <div key={`summon-${index}`} className="summoning-creature-item">
                                  <div className="summoning-creature-header">
                                    <div className="summoning-creature-icon">
                                      <img
                                        src={`https://wow.zamimg.com/images/wow/icons/large/${creature.tokenIcon || 'inv_misc_questionmark'}.jpg`}
                                        alt={creature.name}
                                        onError={(e) => {
                                          e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                                        }}
                                      />
                                    </div>
                                    <div className="summoning-creature-info">
                                      <div className="summoning-creature-name">{creature.name}</div>
                                      <div className="summoning-creature-type">
                                        {creature.size} {creature.type}
                                        {creature.config?.quantity > 1 && (
                                          <span className="summoning-quantity"> × {creature.config.quantity}</span>
                                        )}
                                      </div>
                                    </div>
                                    <div className="summoning-creature-meta">
                                      {(() => {
                                        const controlType = creature.config?.controlType || summoningData?.controlType;
                                        const controlRange = creature.config?.controlRange !== undefined
                                          ? creature.config.controlRange
                                          : summoningData?.controlRange;

                                        const formatControlType = (type) => {
                                          const typeMap = {
                                            'verbal': 'Verbal',
                                            'mental': 'Mental',
                                            'empathic': 'Empathic',
                                            'autonomous': 'Autonomous'
                                          };
                                          return typeMap[type] || type.charAt(0).toUpperCase() + type.slice(1);
                                        };

                                        const formatControlRange = (range) => {
                                          if (range === 0) return 'Unlimited';
                                          return `${range} ft`;
                                        };

                                        const formatDuration = () => {
                                          const config = creature.config;
                                          if (!config?.hasDuration) return 'Permanent';

                                          const duration = config?.duration || 10;
                                          const durationUnit = config?.durationUnit || 'minutes';
                                          let durationText = duration === 1 ? `1 ${durationUnit.slice(0, -1)}` : `${duration} ${durationUnit}`;

                                          if (config?.concentration) {
                                            durationText = `${durationText} (C)`;
                                          }

                                          return durationText;
                                        };

                                        return (
                                          <div className="summoning-creature-control-info">
                                            {controlType && (
                                              <div className="creature-control-line">
                                                {formatControlType(controlType)}
                                                {controlRange !== undefined && (
                                                  <span> ({formatControlRange(controlRange)})</span>
                                                )}
                                              </div>
                                            )}
                                            <div className="creature-duration-line">
                                              {formatDuration()}
                                            </div>
                                          </div>
                                        );
                                      })()}
                                    </div>
                                  </div>
                                  <div className="summoning-creature-stats">
                                    <div className="summoning-stat-group">
                                      <span className="summoning-stat-label">HP:</span>
                                      <span className="summoning-stat-value">{creature.stats?.maxHp || creature.stats?.hp || 'Unknown'}</span>
                                    </div>
                                    <div className="summoning-stat-group">
                                      <span className="summoning-stat-label">AC:</span>
                                      <span className="summoning-stat-value">{creature.stats?.armorClass || creature.stats?.armor || 'Unknown'}</span>
                                    </div>
                                    <div className="summoning-stat-group">
                                      <span className="summoning-stat-label">Speed:</span>
                                      <span className="summoning-stat-value">{creature.stats?.speed || '30'} ft</span>
                                    </div>
                                  </div>
                                  {creature.description && (
                                    <div className="summoning-creature-description">
                                      {creature.description.length > 100
                                        ? `${creature.description.substring(0, 100)}...`
                                        : creature.description}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          );
                        })()}


                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Transformation Effects Section */}
              {(() => {
                const hasTransformationType = spell?.effectTypes?.includes('transformation');
                // Check both transformationConfig (library format) and transformConfig (wizard format)
                const transformationData = spell?.transformationConfig || spell?.transformConfig;
                const hasTransformationConfig = !!transformationData;
                const hasSelectedCreature = transformationData?.selectedCreature || transformationData?.formId;

                // Show transformation effects if transformation type is selected OR if there's transformation config
                return (hasTransformationType || hasTransformationConfig) && (
                  <div className="unified-spell-stat transformation-effects">
                    <div className="transformation-effects-section">
                      <div className="transformation-header">
                        <span className="transformation-label">Transformation</span>
                        {(() => {
                          const creature = transformationData?.selectedCreature;
                          const targetType = transformationData?.targetType || 'self';
                          const duration = transformationData?.duration || 10;
                          const durationUnit = transformationData?.durationUnit || 'minutes';

                          // Format target type for display
                          const targetText = targetType === 'self' ? 'Self' :
                                           targetType === 'willing' ? 'Willing Target' :
                                           'Unwilling Target';

                          // Format duration
                          let durationText = duration === 1 ? `1 ${durationUnit.slice(0, -1)}` : `${duration} ${durationUnit}`;
                          if (transformationData?.concentration) {
                            durationText = `${durationText} (Concentration)`;
                          }

                          return (
                            <div className="transformation-meta">
                              <span className="transformation-target">{targetText}</span>
                              <span className="transformation-duration">{durationText}</span>
                            </div>
                          );
                        })()}
                      </div>
                      <div className="transformation-content">
                        {(() => {
                          const creature = transformationData?.selectedCreature;

                          if (!creature) {
                            return (
                              <div className="transformation-placeholder">
                                <span className="transformation-placeholder-text">No transformation target selected</span>
                              </div>
                            );
                          }

                          return (
                            <div className="transformation-creature-item">
                              <div className="transformation-creature-header">
                                <div className="transformation-creature-icon">
                                  <img
                                    src={`https://wow.zamimg.com/images/wow/icons/large/${creature.tokenIcon || 'inv_misc_questionmark'}.jpg`}
                                    alt={creature.name}
                                    onError={(e) => {
                                      e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                                    }}
                                  />
                                </div>
                                <div className="transformation-creature-info">
                                  <div className="transformation-creature-name">{creature.name}</div>
                                  <div className="transformation-creature-type">
                                    {creature.size} {creature.type}
                                  </div>
                                </div>
                                <div className="transformation-creature-meta">
                                  {(() => {
                                    const targetType = transformationData?.targetType || 'self';
                                    const saveType = transformationData?.saveType;
                                    const difficultyClass = transformationData?.difficultyClass || 15;

                                    if (targetType === 'unwilling' && saveType) {
                                      // Map save type abbreviations to full names
                                      const saveTypeMap = {
                                        'con': 'Constitution',
                                        'str': 'Strength',
                                        'agi': 'Agility',
                                        'int': 'Intelligence',
                                        'spirit': 'Spirit',
                                        'cha': 'Charisma'
                                      };
                                      const saveTypeText = saveTypeMap[saveType] || saveType.charAt(0).toUpperCase() + saveType.slice(1);
                                      return (
                                        <div className="transformation-save-info">
                                          <span className="transformation-save-type">DC {difficultyClass} {saveTypeText}</span>
                                        </div>
                                      );
                                    }
                                    return null;
                                  })()}
                                </div>
                              </div>
                              <div className="transformation-creature-stats">
                                <div className="transformation-stat-group">
                                  <span className="transformation-stat-label">HP:</span>
                                  <span className="transformation-stat-value">{creature.stats?.maxHp || creature.stats?.hp || 'Unknown'}</span>
                                </div>
                                <div className="transformation-stat-group">
                                  <span className="transformation-stat-label">AC:</span>
                                  <span className="transformation-stat-value">{creature.stats?.armorClass || creature.stats?.armor || 'Unknown'}</span>
                                </div>
                                <div className="transformation-stat-group">
                                  <span className="transformation-stat-label">Speed:</span>
                                  <span className="transformation-stat-value">{creature.stats?.speed || '30'} ft</span>
                                </div>
                              </div>
                              {creature.description && (
                                <div className="transformation-creature-description">
                                  {creature.description.length > 100
                                    ? `${creature.description.substring(0, 100)}...`
                                    : creature.description}
                                </div>
                              )}
                              {/* Granted Abilities */}
                              {transformationData?.grantedAbilities?.length > 0 && (
                                <div className="transformation-abilities">
                                  <div className="transformation-abilities-label">Granted Abilities:</div>
                                  <div className="transformation-abilities-list">
                                    {transformationData.grantedAbilities.map((ability, index) => (
                                      <span key={index} className="transformation-ability">
                                        {ability.name}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Purification Effects Section */}
              {(() => {
                const hasPurificationType = spell?.effectTypes?.includes('purification');
                const purificationData = spell?.purificationConfig;
                const hasPurificationConfig = !!purificationData;
                const hasSelectedEffects = purificationData?.selectedEffects?.length > 0;
                const hasAnyPurificationConfiguration = hasPurificationConfig && (
                  purificationData.purificationType ||
                  purificationData.resolution ||
                  purificationData.resurrectionFormula ||
                  hasSelectedEffects
                );



                return (hasPurificationType || hasAnyPurificationConfiguration) && (
                  <div className="unified-spell-stat purification-effects">
                    <div className="purification-effects-section">
                      <div className="purification-header">
                        <span className="purification-label">
                          {purificationData?.purificationType === 'resurrection' ? 'Resurrection' : 'Purification'}
                        </span>
                        <span className="purification-type">
                          {purificationData?.purificationType === 'dispel' ? 'Dispel' :
                           purificationData?.purificationType === 'resurrection' ? 'Revival' : 'Cleanse'}
                        </span>
                      </div>
                      <div className="purification-formula-container">
                        {(() => {
                          const purificationEffects = formatPurificationEffects();

                          return purificationEffects && purificationEffects.length > 0 ? (
                            <div className="purification-formula-line">
                              <div className="purification-effects-list">
                                {purificationEffects.map((effect, index) => (
                                  <div key={`purification-${index}`} className="purification-effect-item">
                                    <div className="purification-effect">
                                      <span className="purification-effect-name">{effect.name}</span>
                                      {effect.description && effect.description !== effect.name && (
                                        <span className="purification-effect-description"> - {effect.description}</span>
                                      )}
                                    </div>
                                    {effect.mechanicsText && (
                                      <div className="purification-effect-details">
                                        <div className="purification-effect-mechanics">{effect.mechanicsText}</div>
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="purification-formula-line">
                              <span className="purification-formula-value">Configure purification effects in the spellcrafting wizard</span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Restoration Effects */}
              {(() => {
                const restorationData = spell?.restorationConfig;
                const hasRestorationConfig = !!restorationData;
                const hasResourceType = restorationData?.resourceType;
                const hasFormula = restorationData?.formula;
                const hasOverTime = restorationData?.isOverTime;

                // Show restoration effects if there's any restoration configuration
                return (hasRestorationConfig && (hasResourceType || hasFormula)) && (
                  <div className="unified-spell-stat restoration-effects">
                    <div className="restoration-effects-section">
                      <div className="restoration-header">
                        <span className="restoration-label">RESTORATION</span>
                        <span className="restoration-type">
                          {restorationData?.resourceType ?
                            formatResourceName(restorationData.resourceType) :
                            'Resource'}
                        </span>
                      </div>
                      <div className="restoration-separator"></div>
                      <div className="restoration-formula-container">
                        {(() => {
                          const effects = [];

                          // Main restoration effect (only if instant restoration is enabled)
                          const hasInstantRestoration = restorationData.duration === 'instant' || !restorationData.duration;
                          if (hasFormula && hasInstantRestoration) {
                            const formula = restorationData.formula;
                            const resolution = restorationData.resolution || 'DICE';

                            let resolutionText = '';
                            switch (resolution) {
                              case 'CARDS':
                                resolutionText = 'Draw cards';
                                break;
                              case 'COINS':
                                resolutionText = 'Flip coins';
                                break;
                              case 'DICE':
                              default:
                                resolutionText = 'Roll dice';
                                break;
                            }

                            const instantEffect = {
                              name: 'Instant Restoration',
                              description: resolutionText,
                              mechanicsText: `${cleanFormula(formula)} ${formatResourceName(restorationData.resourceType) || 'resource'} restored`
                            };
                            effects.push(instantEffect);
                          }

                          // Check if custom formula per stage is enabled (this can work independently)
                          const hasCustomFormula = restorationData.isProgressiveOverTime;

                          // Over time restoration effect OR progressive stages
                          if ((hasOverTime && restorationData.overTimeFormula) || hasCustomFormula) {
                            const overTimeFormula = restorationData.overTimeFormula;
                            const duration = restorationData.overTimeDuration || 3;
                            const frequency = restorationData.tickFrequency || 'round';

                            // Build description based on application timing and trigger type
                            let description = '';
                            let mechanicsText = `${cleanFormula(overTimeFormula)} ${formatResourceName(restorationData.resourceType) || 'resource'} restored`;

                            // Show application timing and trigger type details
                            const applicationTiming = restorationData.tickFrequency || 'round'; // 'round' or 'turn'
                            const triggerType = restorationData.application || 'start'; // 'start' or 'end'
                            const overTimeTriggerType = restorationData.overTimeTriggerType || 'periodic'; // 'periodic' or 'trigger'

                            // Format application timing
                            let timingText = '';
                            if (overTimeTriggerType === 'periodic') {
                              if (applicationTiming === 'round') {
                                timingText = triggerType === 'start' ? 'Start of Round' : 'End of Round';
                              } else if (applicationTiming === 'turn') {
                                timingText = triggerType === 'start' ? 'Start of Turn' : 'End of Turn';
                              }
                            } else if (overTimeTriggerType === 'trigger') {
                              timingText = 'Trigger-Based';
                            }

                            // Always show the main restoration over time effect first
                            if (overTimeTriggerType === 'periodic') {
                              description = `${timingText} for ${duration} ${frequency}s`;
                            } else if (overTimeTriggerType === 'trigger') {
                              description = `Trigger-Based for ${duration} ${frequency}s`;
                            } else {
                              description = `Every ${frequency} for ${duration} ${frequency}s`;
                            }

                            // Show main restoration over time effect
                            const mainEffectName = hasCustomFormula ? 'Restoration Over Time (Progressive)' : 'Restoration Over Time';
                            const mainMechanicsText = hasCustomFormula ?
                              `${cleanFormula(overTimeFormula)} ${formatResourceName(restorationData.resourceType) || 'resource'} restored (see stages below)` :
                              `${cleanFormula(overTimeFormula)} ${formatResourceName(restorationData.resourceType) || 'resource'} restored`;

                            effects.push({
                              name: mainEffectName,
                              description: description,
                              mechanicsText: mainMechanicsText
                            });

                            // If custom formula is enabled, also show individual stages
                            if (hasCustomFormula && restorationData.overTimeProgressiveStages?.length > 0) {
                              // Show detailed stage info
                              const stages = restorationData.overTimeProgressiveStages;

                              // Create separate effect entries for each stage
                              stages.forEach((stage, index) => {
                                const stageNumber = stage.triggerAt || (index + 1);
                                const stageFormula = stage.formula || overTimeFormula || '1d4 + INT/2';
                                const stageDescription = stage.description || '';

                                let stageName = `  └ Stage ${stageNumber} (${frequency} ${stageNumber})`;
                                let stageDesc = `${timingText}`;

                                if (stageDescription) {
                                  stageDesc += ` - ${stageDescription}`;
                                }

                                const effectToAdd = {
                                  name: stageName,
                                  description: stageDesc,
                                  mechanicsText: `${cleanFormula(stageFormula)} ${formatResourceName(restorationData.resourceType) || 'resource'} restored`,
                                  isStage: true // Flag to identify stage effects for special styling
                                };

                                effects.push(effectToAdd);
                              });
                            } else if (hasCustomFormula) {
                              // Progressive is enabled but no stages configured yet - show placeholder
                              effects.push({
                                name: `  └ Configure Stages`,
                                description: `Add stages in the spellcrafting wizard`,
                                mechanicsText: `Custom formulas per stage`,
                                isStage: true
                              });
                            }
                          }

                          return effects.length > 0 ? (
                            <div className="restoration-formula-line">
                              <div className="restoration-effects-list">
                                {effects.map((effect, index) => (
                                    <div key={`restoration-${index}`} className="restoration-effect-item">
                                      <div className="restoration-effect">
                                        <span className={effect.isStage ? "restoration-stage-name" : "restoration-effect-name"}>
                                          {effect.name}
                                        </span>
                                        {effect.description && effect.description !== effect.name && (
                                          <span className={effect.isStage ? "restoration-stage-description" : "restoration-effect-description"}>
                                            {" - "}{effect.description}
                                          </span>
                                        )}
                                      </div>
                                      {effect.mechanicsText && (
                                        <div className="restoration-effect-details">
                                          <div className={effect.isStage ? "restoration-stage-mechanics" : "restoration-effect-mechanics"}>
                                            {effect.mechanicsText}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )
                                )}
                              </div>
                            </div>
                          ) : (
                            <div className="restoration-formula-line">
                              <span className="restoration-formula-value">Configure restoration effects in the spellcrafting wizard</span>
                            </div>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                );
              })()}



            </div>
          )}
        </div>
      )}

      {/* Rollable Table Summary */}
      {rollableTableData && rollableTableData.enabled && (
        <div className="unified-spell-rollable-table">
          {(() => {
            // Determine the best display variant based on card variant and table complexity
            const entryCount = rollableTableData.entries ? rollableTableData.entries.length : 0;
            const isComplexTable = entryCount > 5;

            // For compact variants or simple tables, use inline display
            if (variant === 'compact' || variant === 'preview' || (!isComplexTable && entryCount <= 3)) {
              const formattedText = formatRollableTableForCard(rollableTableData);
              return formattedText ? (
                <div className="rollable-table-inline-display">
                  <span className="rollable-table-inline-label">Random Effects:</span>
                  <span className="rollable-table-inline-text">{formattedText}</span>
                </div>
              ) : null;
            }

            // For other variants, use the full component
            return (
              <RollableTableSummary
                rollableTableData={rollableTableData}
                variant={variant === 'wizard' ? 'detailed' : 'compact'}
                showExpandButton={variant !== 'library'}
                className="spell-card-rollable-table"
              />
            );
          })()}
        </div>
      )}

      {/* Mechanics Display */}
      {(() => {
        const mechanics = formatMechanics();
        return mechanics && mechanics.length > 0 ? (
          <div className="unified-spell-mechanics">
            <div className="mechanics-list">
              {mechanics.map((mechanic, index) => (
                <div key={index} className={`pf-mechanic-line ${mechanic.system.toLowerCase().replace('_', '-')}`}>
                  <span className="pf-mechanic-system">{mechanic.systemType}:</span>
                  <span className="pf-mechanic-text">{mechanic.mechanicsText}</span>
                </div>
              ))}
            </div>
          </div>
        ) : null;
      })()}

      {/* Tags and Cooldown (at bottom of card) */}
      {(() => {
        const tags = getSpellTags();
        const shouldShowTags = (variant === 'spellbook' || variant === 'wizard') && showTags;
        const cooldownText = formatCooldown();
        const shouldShowCooldown = (variant === 'spellbook' || variant === 'wizard') && cooldownText;

        return (shouldShowTags && tags.length > 0) || shouldShowCooldown ? (
          <div className="unified-spell-tags-footer">
            {/* Tags on the left */}
            {shouldShowTags && tags.length > 0 && (
              <div className="unified-spell-tags">
                {tags.map((tag, index) => (
                  <span key={index} className="unified-spell-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Cooldown on the right */}
            {shouldShowCooldown && (
              <div className="unified-spell-cooldown">
                <span className="cooldown-label">Cooldown:</span>
                <span className="cooldown-value">{cooldownText}</span>
              </div>
            )}
          </div>
        ) : null;
      })()}

      {/* Card Actions */}
      {showActions && (
        <div className="unified-spell-card-actions">
          {onDuplicate && (
            <button
              className="spell-action-button duplicate-button"
              onClick={(e) => {
                e.stopPropagation();
                onDuplicate(spell);
              }}
              title="Duplicate spell"
            >
              <i className="fas fa-copy"></i>
            </button>
          )}
          {onEdit && (
            <button
              className="spell-action-button edit-button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(spell);
              }}
              title="Edit spell"
            >
              <i className="fas fa-edit"></i>
            </button>
          )}
          {onDelete && (
            <button
              className="spell-action-button delete-button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete(spell);
              }}
              title="Delete spell"
            >
              <i className="fas fa-trash"></i>
            </button>
          )}
        </div>
      )}
    </div>
  );
};

UnifiedSpellCard.propTypes = {
  spell: PropTypes.object.isRequired,
  variant: PropTypes.oneOf(['spellbook', 'library', 'collection', 'wizard', 'compact', 'preview']),
  showActions: PropTypes.bool,
  showDescription: PropTypes.bool,
  showStats: PropTypes.bool,
  showTags: PropTypes.bool,
  onEdit: PropTypes.func,
  onDelete: PropTypes.func,
  onDuplicate: PropTypes.func,
  onSelect: PropTypes.func,
  onClick: PropTypes.func,
  onContextMenu: PropTypes.func,
  isSelected: PropTypes.bool,
  isDraggable: PropTypes.bool,
  className: PropTypes.string,
  rollableTableData: PropTypes.object,
  categories: PropTypes.array
};



export default UnifiedSpellCard;
