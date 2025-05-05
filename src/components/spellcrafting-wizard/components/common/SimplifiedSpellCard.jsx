import React from 'react';
import PropTypes from 'prop-types';
import '../../../../styles/wow-classic.css';
import '../../styles/ConsolidatedSpellCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSpellLibrary } from '../../context/SpellLibraryContext';
import {
  faBolt, faTint, faHourglass, faLayerGroup, faBatteryFull, faFire, faEye,
  faFlask, faDragon, faMoon, faSun, faGem, faCoins, faHeart, faShieldAlt,
  faRunning, faMagic, faStar, faWandMagicSparkles, faSnowflake, faAtom,
  faSkull, faBrain, faFistRaised, faHandSparkles, faFeather, faWind,
  faRadiation, faVial, faLeaf, faSpider, faGhost, faDumbbell, faMountain,
  faDroplet, faInfoCircle, faQuestionCircle, faExpandAlt, faChartLine,
  faWalking, faHandPaper, faClock, faPlay, faDice, faClone, faRulerCombined,
  faSearch, faUnlock, faCloud
} from '@fortawesome/free-solid-svg-icons';

/**
 * Simplified Spell Card Component
 * Displays a spell card with a consistent style using CSS classes instead of inline styles
 */
const SimplifiedSpellCard = ({ spell, rollableTableData }) => {
  // Get access to the spell library
  const spellLibrary = useSpellLibrary();

  // Helper function to get spell school color class
  const getSpellSchoolClass = () => {
    const schoolMap = {
      'arcane': 'spell-arcane',
      'fire': 'spell-fire',
      'frost': 'spell-frost',
      'nature': 'spell-nature',
      'shadow': 'spell-shadow',
      'holy': 'spell-holy',
      'physical': 'spell-physical',
      'chaos': 'spell-chaos'
    };

    // Try to determine the school from various properties
    const school = spell.school ||
                  (spell.damageType && schoolMap[spell.damageType]) ||
                  (spell.elementType && schoolMap[spell.elementType]) ||
                  'arcane'; // Default to arcane

    return schoolMap[school] || 'spell-arcane';
  };

  // Helper function to get rarity class
  const getRarityClass = () => {
    const rarityMap = {
      'common': 'rarity-common',
      'uncommon': 'rarity-uncommon',
      'rare': 'rarity-rare',
      'epic': 'rarity-epic',
      'legendary': 'rarity-legendary'
    };

    return rarityMap[spell.rarity] || 'rarity-common';
  };

  // Helper function to format cast time
  const formatCastTime = () => {
    if (!spell) return 'Instant';

    // Check all possible properties
    const castTime = spell.castTime ||
                    spell.castingTime ||
                    (spell.typeConfig && spell.typeConfig.castTime) ||
                    'Instant';

    return castTime;
  };

  // Helper function to format range
  const formatRange = () => {
    if (!spell) return '30 ft';

    // Check all possible properties
    const range = spell.range ||
                 (spell.targetingConfig && `${spell.targetingConfig.rangeDistance} ft`) ||
                 '30 ft';

    return range;
  };

  // Helper function to format resource cost
  const formatResourceCost = () => {
    if (!spell || !spell.resourceConfig) return null;

    const resourceConfig = spell.resourceConfig;
    const resourceType = resourceConfig.resourceType || 'Mana';
    const resourceAmount = resourceConfig.resourceAmount || 0;

    if (resourceAmount <= 0) return 'No Cost';

    return `${resourceAmount} ${resourceType}`;
  };

  // Helper function to format damage or healing
  const formatDamageOrHealing = (type) => {
    if (!spell) return '';

    // Handle different resolution types
    if (type === 'damage') {
      if (spell.resolution === 'COINS' && spell.coinConfig) {
        const flipCount = spell.coinConfig.flipCount || 5;
        return `Flip ${flipCount}: ${spell.coinConfig.formula || 'HEADS_COUNT * 8 + (ALL_HEADS ? 15 : 0)'}`;
      } else if (spell.resolution === 'CARDS' && spell.cardConfig) {
        const drawCount = spell.cardConfig.drawCount || 3;
        return `Draw ${drawCount}: ${spell.cardConfig.formula || 'CARD_VALUE + FACE_CARD_COUNT * 5'}`;
      } else {
        return spell.formula || spell.damageFormula || '1d6 + INT';
      }
    } else if (type === 'healing') {
      if (spell.resolution === 'COINS' && spell.healingCoinConfig) {
        const flipCount = spell.healingCoinConfig.flipCount || 5;
        return `Flip ${flipCount}: ${spell.healingCoinConfig.formula || 'HEADS_COUNT * 7 + (LONGEST_STREAK > 2 ? LONGEST_STREAK * 5 : 0)'}`;
      } else if (spell.resolution === 'CARDS' && spell.healingCardConfig) {
        const drawCount = spell.healingCardConfig.drawCount || 3;
        return `Draw ${drawCount}: ${spell.healingCardConfig.formula || 'CARD_VALUE + FACE_CARD_COUNT * 3'}`;
      } else {
        return spell.healingFormula || spell.formula || '1d8 + HEA';
      }
    }

    return '';
  };

  // Helper function to format cooldown
  const formatCooldown = () => {
    if (!spell || !spell.cooldownConfig) return null;

    const cooldownConfig = spell.cooldownConfig;
    const cooldownTime = cooldownConfig.cooldownTime || '';
    const charges = cooldownConfig.charges || 1;

    if (!cooldownTime) return null;

    if (charges > 1) {
      return `${cooldownTime} (${charges} charges)`;
    }

    return cooldownTime;
  };

  // Helper function to format duration
  const formatDuration = () => {
    if (!spell || !spell.durationConfig) return 'Instant';

    const durationConfig = spell.durationConfig;
    const durationType = durationConfig.durationType || 'instant';

    if (durationType === 'instant') return 'Instant';

    const durationAmount = durationConfig.durationAmount || 0;
    const durationUnit = durationConfig.durationUnit || 'rounds';

    if (durationType === 'concentration') {
      return `Concentration, up to ${durationAmount} ${durationUnit}`;
    }

    return `${durationAmount} ${durationUnit}`;
  };

  // Helper function to get damage type icon
  const getDamageTypeIcon = (damageType) => {
    const iconMap = {
      'fire': faFire,
      'frost': faSnowflake,
      'arcane': faAtom,
      'nature': faLeaf,
      'shadow': faGhost,
      'holy': faSun,
      'physical': faFistRaised,
      'force': faMagic,
      'lightning': faBolt,
      'thunder': faCloud,
      'poison': faFlask,
      'acid': faVial,
      'necrotic': faSkull,
      'radiant': faSun,
      'psychic': faBrain
    };

    return iconMap[damageType] || faQuestionCircle;
  };

  // Helper function to get damage type color
  const getDamageTypeColor = (damageType) => {
    const colorMap = {
      'fire': '#ef4444',
      'frost': '#3b82f6',
      'arcane': '#a855f7',
      'nature': '#22c55e',
      'shadow': '#6b7280',
      'holy': '#eab308',
      'physical': '#78716c',
      'force': '#8b5cf6',
      'lightning': '#3b82f6',
      'thunder': '#6366f1',
      'poison': '#16a34a',
      'acid': '#65a30d',
      'necrotic': '#475569',
      'radiant': '#f59e0b',
      'psychic': '#ec4899'
    };

    return colorMap[damageType] || '#6b7280';
  };

  // Helper function to check if the spell has a specific effect type
  const hasEffectType = (type) => {
    if (!spell) return false;

    // Check if the spell has this effect type
    if (spell.effectType === type) return true;
    if (spell.effectTypes && spell.effectTypes.includes(type)) return true;

    // Check if the spell has a configuration for this effect type
    if (type === 'damage' && spell.damageConfig) return true;
    if (type === 'healing' && spell.healingConfig) return true;
    if (type === 'buff' && spell.buffConfig) return true;
    if (type === 'debuff' && spell.debuffConfig) return true;
    if (type === 'utility' && spell.utilityConfig) return true;
    if (type === 'control' && spell.controlConfig) return true;
    if (type === 'summon' && spell.summonConfig) return true;
    if (type === 'transform' && spell.transformConfig) return true;
    if (type === 'purification' && spell.purificationConfig) return true;
    if (type === 'restoration' && spell.restorationConfig) return true;

    return false;
  };

  // Helper function to format targeting information
  const formatTargeting = () => {
    if (!spell || !spell.targetingConfig) return null;

    const targetingConfig = spell.targetingConfig;
    const targetingType = targetingConfig.targetingType || 'single';

    let targetingInfo = {
      type: targetingType,
      description: '',
      details: []
    };

    // Format based on targeting type
    if (targetingType === 'single') {
      targetingInfo.description = 'Single Target';
    } else if (targetingType === 'multi') {
      targetingInfo.description = `Multi Target (${targetingConfig.maxTargets || 3} targets)`;
    } else if (targetingType === 'area') {
      const shape = targetingConfig.aoeShape || 'circle';
      const size = targetingConfig.aoeParameters?.radius ||
                  targetingConfig.aoeParameters?.size ||
                  targetingConfig.aoeParameters?.length || 20;

      targetingInfo.description = `Area: ${shape.charAt(0).toUpperCase() + shape.slice(1)} (${size} ft)`;

      // Add movement behavior if present
      if (targetingConfig.movementBehavior && targetingConfig.movementBehavior !== 'static') {
        targetingInfo.details.push(`Movement: ${targetingConfig.movementBehavior}`);
      }
    } else if (targetingType === 'self') {
      targetingInfo.description = 'Self';
    } else if (targetingType === 'emanation') {
      const radius = targetingConfig.aoeParameters?.radius || 10;
      targetingInfo.description = `Emanation (${radius} ft radius)`;
    }

    // Add target restrictions if present
    if (targetingConfig.targetRestrictions && targetingConfig.targetRestrictions.length > 0) {
      targetingInfo.details.push(`Targets: ${targetingConfig.targetRestrictions.join(', ')}`);
    } else if (targetingConfig.targetRestriction) {
      targetingInfo.details.push(`Target: ${targetingConfig.targetRestriction}`);
    }

    // Add selection method if present
    if (targetingConfig.selectionMethod && targetingConfig.selectionMethod !== 'manual') {
      targetingInfo.details.push(`Selection: ${targetingConfig.selectionMethod}`);
    }

    return targetingInfo;
  };

  // Helper function to format propagation information
  const formatPropagation = () => {
    if (!spell || !spell.propagation) return null;

    const propagation = spell.propagation;
    const method = propagation.method || 'none';

    if (method === 'none') return null;

    let propagationInfo = {
      method: method,
      description: '',
      details: []
    };

    // Format based on propagation method
    if (method === 'chain') {
      propagationInfo.description = `Chain (${propagation.parameters?.count || 3} targets)`;
      if (propagation.parameters?.range) {
        propagationInfo.details.push(`Range: ${propagation.parameters.range} ft`);
      }
      if (propagation.parameters?.decay) {
        propagationInfo.details.push(`Decay: ${propagation.parameters.decay}%`);
      }
    } else if (method === 'splash') {
      propagationInfo.description = `Splash (${propagation.parameters?.secondaryRadius || 10} ft)`;
      if (propagation.parameters?.decay) {
        propagationInfo.details.push(`Decay: ${propagation.parameters.decay}%`);
      }
    } else if (method === 'spread') {
      propagationInfo.description = `Spread (${propagation.parameters?.spreadRate || 5} ft/round)`;
      if (propagation.parameters?.maxRadius) {
        propagationInfo.details.push(`Max Radius: ${propagation.parameters.maxRadius} ft`);
      }
    } else if (method === 'fork') {
      propagationInfo.description = `Fork (${propagation.parameters?.forkCount || 2} paths)`;
      if (propagation.parameters?.range) {
        propagationInfo.details.push(`Range: ${propagation.parameters.range} ft`);
      }
    }

    return propagationInfo;
  };

  // Determine if the spell has a rollable table for critical hits
  const usingRollableTableForCritical = spell.criticalConfig &&
                                      spell.criticalConfig.enabled &&
                                      spell.criticalConfig.useRollableTable;

  // Determine if the spell has a rollable table for chance on hit
  const usingRollableTableForProc = spell.procConfig &&
                                  spell.procConfig.enabled &&
                                  spell.procConfig.useRollableTable;

  // Helper function to format trap configuration
  const formatTrapConfig = () => {
    if (!spell || !spell.trapConfig || spell.spellType !== 'TRAP') return null;

    const trapConfig = spell.trapConfig;

    let trapInfo = {
      description: 'Trap',
      details: []
    };

    // Add physical properties
    if (trapConfig.size) {
      trapInfo.details.push(`Size: ${trapConfig.size}`);
    }

    if (trapConfig.visibility) {
      trapInfo.details.push(`Visibility: ${trapConfig.visibility}`);
    }

    if (trapConfig.durability) {
      trapInfo.details.push(`Durability: ${trapConfig.durability} HP`);
    }

    if (trapConfig.disarmDC) {
      trapInfo.details.push(`Disarm DC: ${trapConfig.disarmDC}`);
    }

    // Add trigger conditions
    if (trapConfig.triggerType) {
      trapInfo.details.push(`Trigger: ${trapConfig.triggerType}`);
    }

    // Add effects
    if (trapConfig.effectOnTrigger) {
      trapInfo.details.push(`Effect: ${trapConfig.effectOnTrigger}`);
    }

    return trapInfo;
  };

  // Helper function to format channeling configuration
  const formatChannelingConfig = () => {
    if (!spell || !spell.channelingConfig || spell.spellType !== 'CHANNELED') return null;

    const channelingConfig = spell.channelingConfig;

    let channelingInfo = {
      description: `Channeled (${channelingConfig.maxDuration || 3} ${channelingConfig.durationUnit || 'turns'})`,
      details: []
    };

    // Add channeling type
    if (channelingConfig.type) {
      const typeMap = {
        'power_up': 'Power escalation',
        'persistent': 'Persistent effect',
        'staged': 'Staged effect',
        'area_expansion': 'Area expansion'
      };

      channelingInfo.details.push(`Type: ${typeMap[channelingConfig.type] || channelingConfig.type}`);
    }

    // Add movement allowed
    channelingInfo.details.push(`Movement: ${channelingConfig.movementAllowed ? 'Allowed' : 'Not allowed'}`);

    // Add interruptible
    channelingInfo.details.push(`Interruptible: ${channelingConfig.interruptible ? 'Yes' : 'No'}`);

    // Add cost per turn if present
    if (channelingConfig.costValue && channelingConfig.costType) {
      channelingInfo.details.push(`Cost: ${channelingConfig.costValue} ${channelingConfig.costType} ${channelingConfig.costTrigger || 'per turn'}`);
    }

    // Add per-round formulas if present
    if (channelingConfig.perRoundFormulas) {
      // Check for damage formulas
      if (channelingConfig.perRoundFormulas.damage && channelingConfig.perRoundFormulas.damage.length > 0) {
        channelingInfo.details.push('Damage scaling:');
        channelingConfig.perRoundFormulas.damage.forEach(round => {
          channelingInfo.details.push(`  Round ${round.round}: ${round.formula}`);
        });
      }

      // Check for healing formulas
      if (channelingConfig.perRoundFormulas.healing && channelingConfig.perRoundFormulas.healing.length > 0) {
        channelingInfo.details.push('Healing scaling:');
        channelingConfig.perRoundFormulas.healing.forEach(round => {
          channelingInfo.details.push(`  Round ${round.round}: ${round.formula}`);
        });
      }

      // Check for DoT formulas
      if (channelingConfig.perRoundFormulas.dot_damage && channelingConfig.perRoundFormulas.dot_damage.length > 0) {
        channelingInfo.details.push('DoT scaling:');
        channelingConfig.perRoundFormulas.dot_damage.forEach(round => {
          channelingInfo.details.push(`  Round ${round.round}: ${round.formula}`);
        });
      }

      // Check for HoT formulas
      if (channelingConfig.perRoundFormulas.hot_healing && channelingConfig.perRoundFormulas.hot_healing.length > 0) {
        channelingInfo.details.push('HoT scaling:');
        channelingConfig.perRoundFormulas.hot_healing.forEach(round => {
          channelingInfo.details.push(`  Round ${round.round}: ${round.formula}`);
        });
      }
    }

    // Add area expansion details if present
    if (channelingConfig.type === 'area_expansion') {
      channelingInfo.details.push(`Initial radius: ${channelingConfig.initialRadius || 5} ft`);
      channelingInfo.details.push(`Max radius: ${channelingConfig.maxRadius || 30} ft`);
      channelingInfo.details.push(`Expansion rate: ${channelingConfig.expansionRate || 5} ft/round`);
    }

    // Add staged effect details if present
    if (channelingConfig.type === 'staged' && channelingConfig.stages && channelingConfig.stages.length > 0) {
      channelingInfo.details.push('Stages:');
      channelingConfig.stages.forEach((stage, index) => {
        channelingInfo.details.push(`  Stage ${index + 1}: ${stage.description || 'No description'}`);
        if (stage.formula) {
          channelingInfo.details.push(`    Formula: ${stage.formula}`);
        }
      });
    }

    return channelingInfo;
  };

  // Helper function to format trigger configuration
  const formatTriggerConfig = () => {
    if (!spell || !spell.triggerConfig ||
        (spell.spellType !== 'REACTION' &&
         spell.spellType !== 'PASSIVE' &&
         spell.spellType !== 'STATE')) return null;

    const triggerConfig = spell.triggerConfig;

    if (!triggerConfig.global || !triggerConfig.global.compoundTriggers ||
        triggerConfig.global.compoundTriggers.length === 0) return null;

    let triggerInfo = {
      description: 'Trigger Conditions',
      details: []
    };

    // Add logic type
    triggerInfo.details.push(`Logic: ${triggerConfig.global.logicType || 'AND'}`);

    // Add compound triggers
    triggerConfig.global.compoundTriggers.forEach((trigger, index) => {
      let triggerText = '';

      if (trigger.triggerId === 'health_threshold') {
        triggerText = `Health ${trigger.parameters?.comparison || '<'} ${trigger.parameters?.threshold || 30}%`;
      } else if (trigger.triggerId === 'resource_threshold') {
        triggerText = `${trigger.parameters?.resourceType || 'Mana'} ${trigger.parameters?.comparison || '<'} ${trigger.parameters?.threshold || 30}%`;
      } else if (trigger.triggerId === 'damage_taken') {
        triggerText = `When taking damage`;
        if (trigger.parameters?.damageType) {
          triggerText += ` (${trigger.parameters.damageType})`;
        }
      } else if (trigger.triggerId === 'status_effect') {
        triggerText = `When affected by ${trigger.parameters?.statusEffect || 'a status effect'}`;
      } else if (trigger.triggerId === 'proximity') {
        triggerText = `When within ${trigger.parameters?.distance || 5} ft of ${trigger.parameters?.entityType || 'any entity'}`;
      } else {
        triggerText = trigger.triggerId.replace(/_/g, ' ');
      }

      triggerInfo.details.push(triggerText);
    });

    return triggerInfo;
  };

  return (
    <div className={`wow-spell-card ${getSpellSchoolClass()} ${getRarityClass()}`}>
      {/* Card header with icon, name, and resources */}
      <div className="wow-spell-card-header">
        {/* Top row with icon and name */}
        <div className="wow-spell-card-title">
          {/* Spell icon */}
          <div className="wow-spell-card-icon">
            <img
              src={`https://wow.zamimg.com/images/wow/icons/large/${spell.icon || 'inv_misc_questionmark'}.jpg`}
              alt={spell.name}
            />
          </div>

          {/* Spell name and meta */}
          <div className="wow-spell-card-name">
            <h3>{spell.name}</h3>
            <div className="wow-spell-card-meta">
              <span>{formatCastTime()}</span>
              <span>{formatRange()}</span>
              <span>{spell.level ? `Level ${spell.level}` : 'Level 1'}</span>
            </div>
          </div>
        </div>

        {/* Resource cost */}
        {formatResourceCost() && (
          <div className="wow-spell-card-resources">
            <div className="wow-spell-card-resource">
              <FontAwesomeIcon icon={faBatteryFull} />
              <span>{formatResourceCost()}</span>
            </div>
          </div>
        )}
      </div>

      {/* Card content */}
      <div className="wow-spell-card-content">
        {/* Description */}
        <div className="wow-spell-card-description">
          {spell.description}
        </div>

        {/* Tags */}
        {spell.tags && spell.tags.length > 0 && (
          <div className="wow-spell-card-tags">
            {spell.tags.map((tag, index) => (
              <span key={index} className="wow-spell-card-tag">{tag}</span>
            ))}
          </div>
        )}

        {/* Damage effects */}
        {hasEffectType('damage') && (
          <div className="wow-spell-card-effect wow-spell-card-damage">
            <div className="wow-spell-card-effect-header">
              <FontAwesomeIcon icon={faFire} />
              <span>Damage</span>
            </div>
            <div className="wow-spell-card-effect-content">
              {/* Direct damage */}
              <div className="wow-spell-card-damage-direct">
                <span className="wow-spell-card-damage-type" style={{ color: getDamageTypeColor(spell.elementType || 'arcane') }}>
                  <FontAwesomeIcon icon={getDamageTypeIcon(spell.elementType || 'arcane')} />
                  {spell.elementType ? spell.elementType.charAt(0).toUpperCase() + spell.elementType.slice(1) : 'Arcane'}
                </span>
                <span className="wow-spell-card-damage-formula">
                  {formatDamageOrHealing('damage')}
                </span>
              </div>

              {/* Damage over time */}
              {spell.hasDotEffect && (
                <div className="wow-spell-card-damage-dot">
                  <span className="wow-spell-card-damage-type" style={{ color: getDamageTypeColor(spell.elementType || 'arcane') }}>
                    <FontAwesomeIcon icon={faHourglass} />
                    DoT ({spell.dotDuration} {spell.dotTickType || 'rounds'})
                  </span>
                  <span className="wow-spell-card-damage-formula">
                    {spell.dotFormula || '1d4 + INT/2'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Healing effects */}
        {hasEffectType('healing') && (
          <div className="wow-spell-card-effect wow-spell-card-healing">
            <div className="wow-spell-card-effect-header">
              <FontAwesomeIcon icon={faHeart} />
              <span>Healing</span>
            </div>
            <div className="wow-spell-card-effect-content">
              {/* Direct healing */}
              <div className="wow-spell-card-healing-direct">
                <span className="wow-spell-card-healing-type">
                  <FontAwesomeIcon icon={faSun} />
                  Holy (Healing)
                </span>
                <span className="wow-spell-card-healing-formula">
                  {formatDamageOrHealing('healing')}
                </span>
              </div>

              {/* Healing over time */}
              {spell.hasHotEffect && (
                <div className="wow-spell-card-healing-hot">
                  <span className="wow-spell-card-healing-type">
                    <FontAwesomeIcon icon={faHourglass} />
                    HoT ({spell.hotDuration} {spell.hotTickType || 'rounds'})
                  </span>
                  <span className="wow-spell-card-healing-formula">
                    {spell.hotFormula || '1d4 + HEA/2'}
                  </span>
                </div>
              )}

              {/* Shield */}
              {spell.hasShieldEffect && (
                <div className="wow-spell-card-healing-shield">
                  <span className="wow-spell-card-healing-type">
                    <FontAwesomeIcon icon={faShieldAlt} />
                    Shield ({spell.shieldDuration} {spell.hotTickType || 'rounds'})
                  </span>
                  <span className="wow-spell-card-healing-formula">
                    {spell.shieldFormula || '2d6 + HEA'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Buff effects */}
        {hasEffectType('buff') && spell.buffConfig && (
          <div className="wow-spell-card-effect wow-spell-card-buff">
            <div className="wow-spell-card-effect-header">
              <FontAwesomeIcon icon={faWandMagicSparkles} />
              <span>Buff</span>
            </div>
            <div className="wow-spell-card-effect-content">
              {/* Duration */}
              <div className="wow-spell-card-buff-duration">
                <FontAwesomeIcon icon={faClock} />
                <span>
                  {spell.buffConfig.durationValue || spell.buffConfig.duration || 3} {spell.buffConfig.durationUnit || 'rounds'}
                </span>
              </div>

              {/* Stat modifiers */}
              {spell.buffConfig.statModifiers && spell.buffConfig.statModifiers.length > 0 && (
                <div className="wow-spell-card-buff-stats">
                  {spell.buffConfig.statModifiers.map((stat, index) => (
                    <div key={index} className="wow-spell-card-buff-stat">
                      <span className="wow-spell-card-buff-stat-name">{stat.name || stat.statId || 'Stat'}</span>
                      <span className="wow-spell-card-buff-stat-value">
                        {stat.value > 0 ? '+' : ''}{stat.value}{stat.isPercentage ? '%' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Status effects */}
              {spell.buffConfig.statusEffects && spell.buffConfig.statusEffects.length > 0 && (
                <div className="wow-spell-card-buff-status">
                  {spell.buffConfig.statusEffects.map((effect, index) => (
                    <div key={index} className="wow-spell-card-buff-status-effect">
                      {effect.name || effect.id || 'Effect'}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Debuff effects */}
        {hasEffectType('debuff') && spell.debuffConfig && (
          <div className="wow-spell-card-effect wow-spell-card-debuff">
            <div className="wow-spell-card-effect-header">
              <FontAwesomeIcon icon={faSkull} />
              <span>Debuff</span>
            </div>
            <div className="wow-spell-card-effect-content">
              {/* Duration */}
              <div className="wow-spell-card-debuff-duration">
                <FontAwesomeIcon icon={faClock} />
                <span>
                  {spell.debuffConfig.durationValue || spell.debuffConfig.duration || 3} {spell.debuffConfig.durationUnit || 'rounds'}
                </span>
              </div>

              {/* Saving throw */}
              {spell.debuffConfig.savingThrow && (
                <div className="wow-spell-card-debuff-save">
                  <FontAwesomeIcon icon={faShieldAlt} />
                  <span>
                    DC {spell.debuffConfig.savingThrow.dc || 10} {spell.debuffConfig.savingThrow.attribute || 'Constitution'} save
                  </span>
                </div>
              )}

              {/* Stat modifiers */}
              {spell.debuffConfig.statModifiers && spell.debuffConfig.statModifiers.length > 0 && (
                <div className="wow-spell-card-debuff-stats">
                  {spell.debuffConfig.statModifiers.map((stat, index) => (
                    <div key={index} className="wow-spell-card-debuff-stat">
                      <span className="wow-spell-card-debuff-stat-name">{stat.name || stat.statId || 'Stat'}</span>
                      <span className="wow-spell-card-debuff-stat-value">
                        {stat.value > 0 ? '+' : ''}{stat.value}{stat.isPercentage ? '%' : ''}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              {/* Status effects */}
              {spell.debuffConfig.statusEffects && spell.debuffConfig.statusEffects.length > 0 && (
                <div className="wow-spell-card-debuff-status">
                  {spell.debuffConfig.statusEffects.map((effect, index) => (
                    <div key={index} className="wow-spell-card-debuff-status-effect">
                      {effect.name || effect.id || 'Effect'}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Rollable table */}
        {rollableTableData && rollableTableData.enabled && (
          <div className="wow-spell-card-rollable-table">
            <div className="wow-spell-card-rollable-table-header">
              <FontAwesomeIcon icon={
                rollableTableData.resolutionType === 'DICE' ? faDice :
                rollableTableData.resolutionType === 'CARDS' ? faClone :
                rollableTableData.resolutionType === 'COINS' ? faCoins : faDice
              } />
              <span>{rollableTableData.name || 'Random Effects'}</span>
            </div>

            {/* Table entries */}
            {rollableTableData.entries && rollableTableData.entries.length > 0 && (
              <div className="wow-spell-card-rollable-table-entries">
                {rollableTableData.entries.slice(0, 3).map((entry, index) => (
                  <div key={index} className="wow-spell-card-rollable-table-entry">
                    <span className="wow-spell-card-rollable-table-entry-roll">
                      {entry.roll || entry.range || `${index + 1}`}
                    </span>
                    <span className="wow-spell-card-rollable-table-entry-effect">
                      {entry.name || entry.effect || 'Effect'}
                    </span>
                  </div>
                ))}
                {rollableTableData.entries.length > 3 && (
                  <div className="wow-spell-card-rollable-table-more">
                    +{rollableTableData.entries.length - 3} more entries
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Critical hit configuration */}
        {spell.criticalConfig && spell.criticalConfig.enabled && (
          <div className="wow-spell-card-critical">
            <div className="wow-spell-card-critical-header">
              <FontAwesomeIcon icon={faStar} />
              <span>Critical Hit</span>
            </div>
            <div className="wow-spell-card-critical-content">
              {spell.criticalConfig.useRollableTable ? (
                <div className="wow-spell-card-critical-rollable">
                  <span>On Natural 20: Roll on table</span>
                </div>
              ) : (
                <div className="wow-spell-card-critical-standard">
                  <span>
                    On Natural 20: {spell.criticalConfig.critMultiplier || 2}x damage
                    {spell.criticalConfig.critDiceOnly ? ' (dice only)' : ''}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Chance on hit configuration */}
        {spell.procConfig && spell.procConfig.enabled && (
          <div className="wow-spell-card-proc">
            <div className="wow-spell-card-proc-header">
              <FontAwesomeIcon icon={faBolt} />
              <span>Chance on Hit</span>
            </div>
            <div className="wow-spell-card-proc-content">
              <span>
                {spell.procConfig.procChance || 15}% chance to
                {spell.procConfig.useRollableTable ? (
                  ' roll on table'
                ) : (
                  spell.procConfig.spellEffect ? (
                    ` trigger ${spell.procConfig.spellEffect}`
                  ) : (
                    ' trigger additional effect'
                  )
                )}
              </span>
            </div>
          </div>
        )}

        {/* Targeting information */}
        {formatTargeting() && (
          <div className="wow-spell-card-effect wow-spell-card-targeting">
            <div className="wow-spell-card-effect-header">
              <FontAwesomeIcon icon={faSearch} />
              <span>Targeting</span>
            </div>
            <div className="wow-spell-card-effect-content">
              <div className="wow-spell-card-targeting-type">
                <span>{formatTargeting().description}</span>
              </div>
              {formatTargeting().details.length > 0 && (
                <div className="wow-spell-card-targeting-details">
                  {formatTargeting().details.map((detail, index) => (
                    <div key={index} className="wow-spell-card-targeting-detail">
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Propagation information */}
        {formatPropagation() && (
          <div className="wow-spell-card-effect wow-spell-card-propagation">
            <div className="wow-spell-card-effect-header">
              <FontAwesomeIcon icon={faExpandAlt} />
              <span>Propagation</span>
            </div>
            <div className="wow-spell-card-effect-content">
              <div className="wow-spell-card-propagation-type">
                <span>{formatPropagation().description}</span>
              </div>
              {formatPropagation().details.length > 0 && (
                <div className="wow-spell-card-propagation-details">
                  {formatPropagation().details.map((detail, index) => (
                    <div key={index} className="wow-spell-card-propagation-detail">
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Trap configuration */}
        {formatTrapConfig() && (
          <div className="wow-spell-card-effect wow-spell-card-trap">
            <div className="wow-spell-card-effect-header">
              <FontAwesomeIcon icon={faUnlock} />
              <span>Trap</span>
            </div>
            <div className="wow-spell-card-effect-content">
              {formatTrapConfig().details.map((detail, index) => (
                <div key={index} className="wow-spell-card-trap-detail">
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Trigger configuration */}
        {formatTriggerConfig() && (
          <div className="wow-spell-card-effect wow-spell-card-trigger">
            <div className="wow-spell-card-effect-header">
              <FontAwesomeIcon icon={faBolt} />
              <span>Trigger Conditions</span>
            </div>
            <div className="wow-spell-card-effect-content">
              {formatTriggerConfig().details.map((detail, index) => (
                <div key={index} className="wow-spell-card-trigger-detail">
                  <span>{detail}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Channeling configuration */}
        {formatChannelingConfig() && (
          <div className="wow-spell-card-effect wow-spell-card-channeling">
            <div className="wow-spell-card-effect-header">
              <FontAwesomeIcon icon={faPlay} />
              <span>Channeling</span>
            </div>
            <div className="wow-spell-card-effect-content">
              <div className="wow-spell-card-channeling-type">
                <span>{formatChannelingConfig().description}</span>
              </div>
              {formatChannelingConfig().details.length > 0 && (
                <div className="wow-spell-card-channeling-details">
                  {formatChannelingConfig().details.map((detail, index) => (
                    <div key={index} className="wow-spell-card-channeling-detail">
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Mechanics configuration */}
        {spell.mechanicsConfig && spell.mechanicsConfig.enabled && (
          <div className="wow-spell-card-mechanics">
            <div className="wow-spell-card-mechanics-header">
              <span className="mechanics-icon">
                {spell.mechanicsConfig.system === 'CHORD_SYSTEM' && '🎵'}
                {spell.mechanicsConfig.system === 'TOXIC_SYSTEM' && '☣️'}
                {spell.mechanicsConfig.system === 'COMBO_POINTS' && '⚔️'}
                {spell.mechanicsConfig.system === 'PROC_SYSTEM' && '✨'}
                {spell.mechanicsConfig.system === 'STATE_REQUIREMENTS' && '📊'}
                {spell.mechanicsConfig.system === 'FORM_SYSTEM' && '🐻'}
              </span>
              <span className="mechanics-title">
                {spell.mechanicsConfig.system === 'CHORD_SYSTEM' && 'Chord System'}
                {spell.mechanicsConfig.system === 'TOXIC_SYSTEM' && 'Toxic System'}
                {spell.mechanicsConfig.system === 'COMBO_POINTS' && 'Combo Points'}
                {spell.mechanicsConfig.system === 'PROC_SYSTEM' && 'Proc System'}
                {spell.mechanicsConfig.system === 'STATE_REQUIREMENTS' && 'State Requirements'}
                {spell.mechanicsConfig.system === 'FORM_SYSTEM' && 'Form System'}
              </span>
            </div>

            <div className="wow-spell-card-mechanics-content">
              {/* Combo Points */}
              {spell.mechanicsConfig.system === 'COMBO_POINTS' && (
                <div className="wow-spell-card-combo-points">
                  {spell.mechanicsConfig.type === 'builder' ? (
                    <span>Generates 1 combo point</span>
                  ) : (
                    <span>
                      Requires {spell.mechanicsConfig.thresholdValue || 1} combo points
                      {spell.mechanicsConfig.comboOptions?.consumptionRule === 'all' && ' (consumes all)'}
                      {spell.mechanicsConfig.comboOptions?.consumptionRule === 'threshold' && ` (consumes ${spell.mechanicsConfig.thresholdValue || 1})`}
                      {spell.mechanicsConfig.comboOptions?.consumptionRule === 'none' && ' (does not consume)'}
                    </span>
                  )}
                </div>
              )}

              {/* State Requirements */}
              {spell.mechanicsConfig.system === 'STATE_REQUIREMENTS' && (
                <div className="wow-spell-card-state-requirements">
                  <span>
                    When {spell.mechanicsConfig.stateOptions?.resourceType || 'health'} is
                    {spell.mechanicsConfig.stateOptions?.thresholdType || 'below'}
                    {' '}{spell.mechanicsConfig.stateOptions?.thresholdValue || 20}%
                  </span>
                </div>
              )}

              {/* Form System */}
              {spell.mechanicsConfig.system === 'FORM_SYSTEM' && (
                <div className="wow-spell-card-form-system">
                  <span>
                    {spell.mechanicsConfig.formOptions?.requiresForm ? 'Requires' : 'Enhanced by'}
                    {' '}{spell.mechanicsConfig.formOptions?.formType?.replace('_', ' ') || 'bear form'}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Card footer */}
      <div className="wow-spell-card-footer">
        {/* Cooldown */}
        {formatCooldown() && (
          <div className="wow-spell-card-cooldown">
            <FontAwesomeIcon icon={faClock} />
            <span>{formatCooldown()}</span>
          </div>
        )}

        {/* Duration */}
        <div className="wow-spell-card-duration">
          <FontAwesomeIcon icon={faHourglass} />
          <span>{formatDuration()}</span>
        </div>
      </div>
    </div>
  );
};

SimplifiedSpellCard.propTypes = {
  spell: PropTypes.object.isRequired,
  rollableTableData: PropTypes.object
};

export default SimplifiedSpellCard;
