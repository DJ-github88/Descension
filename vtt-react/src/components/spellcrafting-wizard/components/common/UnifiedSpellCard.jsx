import React, { useState, useRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBolt, faGem, faFire, faRunning, faEye, faHeart,
  faStar, faSun, faSnowflake, faGhost, faMoon, faWind,
  faBrain, faFistRaised, faSkull, faAtom, faHourglass,
  faClock, faBatteryFull, faCoins, faComment, faHandSparkles, faFlask,
  faArrowUp, faLeaf, faExclamationTriangle, faShield, faRandom, faScroll, faDice, faPaw, faCrosshairs, faTint, faBalanceScale,
  faCircleDot, faPlusCircle
} from '@fortawesome/free-solid-svg-icons';
import { formatFormulaToPlainEnglish } from './SpellCardUtils';
import {
  getInfernoStageName,
  getInfernoStageNameWithSuffix,
  formatResourceName,
  cleanFormula,
  mapSpellIcon,
  extractDamageTypeFromResistanceName,
  getThematicResistanceDescription,
  formatAoeShape,
  formatDurationText,
  formatComponentName,
  normalizeSaveType,
  getEnhancedStatName,
  getStatType
} from './spellFormatterUtils';
import useSpellMeta from './useSpellMeta';
import useTargetingFormatters from './useTargetingFormatters';
import useResourceFormatters from './useResourceFormatters';
import useComponentFormatters from './useComponentFormatters';
import useTriggerFormatters from './useTriggerFormatters';
import useDamageHealingFormatters from './useDamageHealingFormatters';
import useStatusEffectFormatters from './useStatusEffectFormatters';
import CompactSpellCard from './CompactSpellCard';
import SpellCardHeader from './SpellCardHeader';
import RollableTableSummary from './RollableTableSummary';
import ProphecySummary from './ProphecySummary';
import { useSpellLibrary } from '../../context/SpellLibraryContext';
const SpellTooltip = React.lazy(() => import('./SpellTooltip'));
import { calculateManaCost } from '../../core/mechanics/resourceManager';
import { normalizeSpell } from '../../core/utils/spellNormalizer';
import useCharacterStore from '../../../../store/characterStore';
import { getAbilityIconUrl, getCustomIconUrl } from '../../../../utils/assetManager';
// Pathfinder styles imported via main.css

// Comprehensive mapping of internal stat keys to user-friendly labels
const GLOBAL_STAT_MAP = {
  // Primary stats
  'strength': 'Strength', 'agility': 'Agility', 'constitution': 'Constitution',
  'intelligence': 'Intelligence', 'spirit': 'Spirit', 'charisma': 'Charisma',
  'str': 'Strength', 'agi': 'Agility', 'con': 'Constitution',
  'int': 'Intelligence', 'spi': 'Spirit', 'spir': 'Spirit', 'cha': 'Charisma',
  // Combat stats
  'speed': 'Speed', 'attack': 'Attack', 'damage': 'Damage', 
  'crit_range': 'Critical Range', 'crit_multiplier': 'Critical Multiplier', 
  'attackdamagebonus': 'Attack and Damage', 'attackDamageBonus': 'Attack and Damage', 'attack_damage_bonus': 'Attack and Damage', 
  'maxhitpoints': 'Maximum Hit Points', 'max_hit_points': 'Maximum Hit Points', 'hitpoints': 'Hit Points',
  'hp_regen': 'Health Regeneration', 'mp_regen': 'Mana Regeneration',
  'healing_power': 'Healing Power', 'initiative': 'Initiative', 'lifesteal': 'Lifesteal',
  'damage_reflection': 'Damage Reflection', 'actionpoints': 'Action Points', 'action_points': 'Action Points',
  'damagereduction': 'Damage Reduction', 'damage_reduction': 'Damage Reduction',
  'savingthrows': 'Saving Throws', 'saving_throws': 'Saving Throws',
  'healingperkill': 'Healing Per Kill', 'healing_per_kill': 'Healing Per Kill',
  'ragegeneration': 'Rage Generation', 'rage_generation': 'Rage Generation', 'rage generation': 'Rage Generation',
  'momentumgeneration': 'Momentum Generation', 'momentum_generation': 'Momentum Generation', 'momentum generation': 'Momentum Generation',
  'all_resistances': 'All Resistances', 'all_primary_stats': 'All Primary Stats',
  // Spell power stats (canonical 8 + legacy aliases for backward compat)
  'ember_spell_power': 'Ember Spell Power', 'fire_spell_power': 'Fire Spell Power',
  'rime_spell_power': 'Rime Spell Power', 'frost_spell_power': 'Frost Spell Power', 'cold_spell_power': 'Cold Spell Power', 'ice_spell_power': 'Ice Spell Power',
  'storm_spell_power': 'Storm Spell Power', 'lightning_spell_power': 'Lightning Spell Power', 'thunder_spell_power': 'Thunder Spell Power', 'force_spell_power': 'Force Spell Power',
  'arcane_spell_power': 'Arcane Spell Power',
  'primal_spell_power': 'Primal Spell Power', 'nature_spell_power': 'Nature Spell Power',
  'blight_spell_power': 'Blight Spell Power', 'necrotic_spell_power': 'Necrotic Spell Power', 'poison_spell_power': 'Poison Spell Power', 'acid_spell_power': 'Acid Spell Power', 'shadow_spell_power': 'Shadow Spell Power', 'void_spell_power': 'Void Spell Power',
  'wyrd_spell_power': 'Wyrd Spell Power', 'psychic_spell_power': 'Psychic Spell Power', 'chaos_spell_power': 'Chaos Spell Power',
  // Transition/Stance stats
  'multistancebenefits': 'Multi-Stance Benefits', 'multiStanceBenefits': 'Multi-Stance Benefits', 'multi_stance_benefits': 'Multi-Stance Benefits',
  'multistanceecho': 'Multi-Stance Echo', 'multiStanceEcho': 'Multi-Stance Echo', 'multi_stance_echo': 'Multi-Stance Echo',
  'stancepower': 'Stance Power', 'stancePower': 'Stance Power', 'stance_power': 'Stance Power',
  'transitioncostreduction': 'Transition Cost Reduction', 'transition_cost_reduction': 'Transition Cost Reduction',
  'movementspeed': 'Movement Speed', 'movement_speed': 'Movement Speed'
};

// Helper to map stat key to a premium, user-friendly label
const mapStatKeyToLabel = (key) => {
  if (!key) return 'Stat';
  const lower = key.toLowerCase();
  
  // Custom mappings for advantage/disadvantage stats and composite rolls
  const customMap = {
    'all_rolls': 'All Rolls',
    'all rolls': 'All Rolls',
    'attack_and_saves': 'Attack Rolls and Saving Throws',
    'attack and saves': 'Attack Rolls and Saving Throws',
    'saves_and_dodge': 'Saving Throws and Dodge checks',
    'saves and dodge': 'Saving Throws and Dodge checks',
    'dodge_and_saves': 'Dodge and Saving Throws',
    'dodge and saves': 'Dodge and Saving Throws',
    'saves_and_dodge_checks': 'Saving Throws and Dodge checks',
    'savingthrows': 'Saving Throws',
    'saving_throws': 'Saving Throws',
    'all_primary_stats': 'All Primary Stats',
    'all_resistances': 'All Resistances'
  };
  
  if (customMap[lower]) return customMap[lower];
  
  // Fall back to GLOBAL_STAT_MAP
  if (GLOBAL_STAT_MAP[lower]) return GLOBAL_STAT_MAP[lower];
  
  // Fallback conversion from snake_case or camelCase to Title Case
  return key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
};

// Helper to identify and format Advantage/Disadvantage modifiers
const getAdvantageDisadvantageText = (statKey, magnitude, magnitudeType) => {
  const lowerType = (magnitudeType || '').toLowerCase();
  const val = parseInt(magnitude, 10);
  const isAdvantage = val === 99 || lowerType === 'advantage';
  const isDisadvantage = val === -99 || lowerType === 'disadvantage';
  
  if (isAdvantage) {
    return {
      text: `Advantage on ${mapStatKeyToLabel(statKey)}`,
      isAdvDis: true,
      type: 'advantage'
    };
  }
  if (isDisadvantage) {
    return {
      text: `Disadvantage on ${mapStatKeyToLabel(statKey)}`,
      isAdvDis: true,
      type: 'disadvantage'
    };
  }
  return {
    isAdvDis: false
  };
};

/**
 * TRUE Unified Spell Card Component
 * Consolidates ALL spell card implementations with consistent Pathfinder styling
 * Handles: SpellbookWindow, Library, Collections, Wizard, Selection - EVERYTHING
 */
const UnifiedSpellCard = ({
  spell: spellProp,
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
  
  // Get character stats for dynamic calculations (e.g., Dodge = Agility Ã· 3)
  const characterStats = useCharacterStore((state) => ({
    agility: state.stats?.agility || state.stats?.agi || 10,
    derivedStats: state.derivedStats || {}
  }));
  
  
  // NORMALIZE SPELL DATA - Transform from any format into complete wizard format
  // This ensures spells from class data, manual JSON, or legacy formats all work
  // All references to 'spell' in this component will now use the normalized version
  const spell = (() => {
    try {
      if (!spellProp) {
        return {};
      }
      if (typeof normalizeSpell === 'function') {
        const normalized = normalizeSpell(spellProp) || spellProp || {};
        return normalized;
      } else {
        console.warn('normalizeSpell is not available, using spellProp directly');
        return spellProp || {};
      }
    } catch (error) {
      console.error('Error normalizing spell in UnifiedSpellCard:', error, spellProp);
      // Fallback to original spell if normalization fails
      return spellProp || {};
    }
  })();

  // State for hover tooltips (only used in compact variant)
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const itemRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  const { enhanceFormulaDisplay, getRarityClass, getSpellSchoolClass, getBorderColor, getSpellIcon } = useSpellMeta({ spell });
  const { formatCastTime, formatRange, formatEffectTargeting, formatTargetingType, formatPropagation, formatDuration, formatCooldown, formatTypeSpecificBullets } = useTargetingFormatters({ spell });
  const { getResourceIcon, getResourceColor, formatResourceCosts } = useResourceFormatters({ spell, variant, className, library });
  const { formatSpellComponents, formatMaterialComponentsText, formatMechanics, formatGraduatedEffects, processMechanicConfig } = useComponentFormatters({ spell, className });
  const { formatChanceOnHit, formatTriggerId, formatTriggerText, formatTriggerForConditionalDisplay } = useTriggerFormatters({ spell, library });
  const { getDamageTypeSuffix, formatCriticalHit, formatSavingThrow, formatDamage, formatHealing, formatCombinedHealing, getDamageTypes, getSpellTags } = useDamageHealingFormatters({ spell, variant, enhanceFormulaDisplay });
  const { formatStatusEffectDetails, formatBuffEffects, formatPurificationEffects, formatDebuffEffects } = useStatusEffectFormatters({ spell, library, categories, formatSavingThrow });

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
      // Transfer complete spell data to preserve all formatting and details
      const spellData = {
        // Complete spell object with all properties for rich tooltip display
        ...spell,
        // Ensure action bar compatibility fields are present
        id: spell.id,
        name: spell.name,
        icon: spell.icon || 'spell_holy_holybolt',
        cooldown: spell.cooldown || 0,
        level: spell.level || 1,
        spellType: spell.spellType || 'ACTION',
        type: 'spell' // Ensure action bar identifies this as a spell for tooltip handling
      };
      e.dataTransfer.setData('application/json', JSON.stringify(spellData));
      e.dataTransfer.effectAllowed = 'copy';
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

    // Store the current mouse position for initial tooltip placement
    const currentMouseX = e.clientX;
    const currentMouseY = e.clientY;

    // Set show timeout
    hoverTimeoutRef.current = setTimeout(() => {
      // Use mouse position for tooltip placement - this follows the cursor
      // and works correctly regardless of window position or scroll
      const tooltipX = currentMouseX + 15;
      const tooltipY = currentMouseY - 10;
      setTooltipPosition({ x: tooltipX, y: tooltipY });
      setShowTooltip(true);
    }, 300); // 300ms delay before showing tooltip
  }, [variant]);

  // Handle mouse move to update tooltip position
  const handleMouseMove = useCallback((e) => {
    if (variant !== 'compact' || !showTooltip) return;

    // Update tooltip position to follow the mouse cursor
    // This ensures the tooltip stays with the cursor even when windows move
    const mouseX = e.clientX;
    const mouseY = e.clientY;

    // Position tooltip relative to mouse cursor
    const tooltipX = mouseX + 15;
    const tooltipY = mouseY - 10;

    setTooltipPosition({ x: tooltipX, y: tooltipY });
  }, [variant, showTooltip]);

  // Add effect to handle window movement and ensure tooltip stays visible
  useEffect(() => {
    if (!showTooltip) return;

    // Listen for window movement events to update tooltip position
    const handleWindowMove = () => {
      // Force a re-render of the tooltip to ensure it stays on top
      setTooltipPosition(prev => ({ ...prev }));
    };

    // Listen for various events that might affect window positioning
    window.addEventListener('resize', handleWindowMove);
    document.addEventListener('scroll', handleWindowMove, true);

    return () => {
      window.removeEventListener('resize', handleWindowMove);
      document.removeEventListener('scroll', handleWindowMove, true);
    };
  }, [showTooltip]);

  // Handle mouse leave with immediate hide (unless moving to tooltip)
  const handleMouseLeave = useCallback(() => {
    if (variant !== 'compact') return;

    // Clear show timeout
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
      hoverTimeoutRef.current = null;
    }

    // Hide tooltip immediately when leaving the spell
    hideTimeoutRef.current = setTimeout(() => {
      setShowTooltip(false);
    }, 50); // Very short delay to allow moving to tooltip
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
      <CompactSpellCard
        spell={spell}
        isSelected={isSelected}
        isDraggable={isDraggable}
        className={className}
        rollableTableData={rollableTableData}
        onSelect={onSelect}
        onClick={onClick}
        onContextMenu={onContextMenu}
        props={props}
        getRarityClass={getRarityClass}
        getSpellIcon={getSpellIcon}
        handleClick={handleClick}
        handleKeyDown={handleKeyDown}
        handleDragStart={handleDragStart}
        handleMouseEnter={handleMouseEnter}
        handleMouseMove={handleMouseMove}
        handleMouseLeave={handleMouseLeave}
        showTooltip={showTooltip}
        tooltipPosition={tooltipPosition}
        itemRef={itemRef}
        hideTimeoutRef={hideTimeoutRef}
      />
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
      <SpellCardHeader
        spell={spell}
        variant={variant}
        library={library}
        className={className}
        categories={categories}
        getSpellIcon={getSpellIcon}
        formatCastTime={formatCastTime}
        formatRange={formatRange}
        formatTargetingType={formatTargetingType}
        formatPropagation={formatPropagation}
        formatTypeSpecificBullets={formatTypeSpecificBullets}
        formatResourceCosts={formatResourceCosts}
        formatSpellComponents={formatSpellComponents}
        getDamageTypes={getDamageTypes}
      />

      {/* Card Body */}
      {(showDescription || (showStats && spell?.effectTypes && spell.effectTypes.length > 0)) && (
        <div className="pf-spell-card-body wow-spell-card-body">
          {/* Description - First element in body */}
          {spell?.description && (
            <div className="item-description">
              {spell.description}
            </div>
          )}

          {/* Global Triggers/Required Conditions - Will wrap effects below */}

          {/* Stats (varies by variant) - Only show if step 3 (Effects) has been completed */}
          {showStats && spell?.effectTypes && spell.effectTypes.length > 0 && (() => {
            // Check for global triggers or required conditions
            const hasTriggerConfig = spell?.triggerConfig;
            const globalTriggersEnabled = hasTriggerConfig?.global?.enabled !== false;
            const hasGlobalTriggers = hasTriggerConfig?.global?.compoundTriggers?.length > 0;
            const hasRequiredConditions = hasTriggerConfig?.requiredConditions?.enabled && 
                                         hasTriggerConfig.requiredConditions.conditions?.length > 0;
            const hasGlobalTriggerOrRequired = (globalTriggersEnabled && hasGlobalTriggers) || hasRequiredConditions;

            // Check for effect-specific triggers - check all possible subtypes
            // Damage subtypes: damage, damage_direct, damage_dot, damage_area, damage_combined
            // Healing subtypes: healing, healing_direct, healing_hot, healing_shield
            const getEffectTriggersForType = (baseType) => {
              const subtypes = baseType === 'damage' 
                ? ['damage', 'damage_direct', 'damage_dot', 'damage_area', 'damage_combined']
                : ['healing', 'healing_direct', 'healing_hot', 'healing_shield'];
              
              // Check all subtypes and return the first one that has triggers
              for (const subtype of subtypes) {
                const triggers = spell?.triggerConfig?.effectTriggers?.[subtype];
                if (triggers?.compoundTriggers?.length > 0) {
                  return triggers;
                }
              }
              return null;
            };
            
            const damageEffectTriggers = getEffectTriggersForType('damage');
            const healingEffectTriggers = getEffectTriggersForType('healing');
            const isDamageConditional = spell?.triggerConfig?.conditionalEffects?.damage?.isConditional;
            const isHealingConditional = spell?.triggerConfig?.conditionalEffects?.healing?.isConditional;
            // Effect-specific triggers should display regardless of conditional status
            const hasDamageEffectTriggers = damageEffectTriggers?.compoundTriggers?.length > 0;
            const hasHealingEffectTriggers = healingEffectTriggers?.compoundTriggers?.length > 0;

            // Build trigger/required state header if needed
            let triggerHeader = null;
            if (hasGlobalTriggerOrRequired) {
              if (hasRequiredConditions) {
                const logicBadge = hasTriggerConfig.requiredConditions.conditions.length > 1
                  ? (hasTriggerConfig.requiredConditions.logicType === 'AND' ? 'ALL' : 'ANY')
                  : '';
                triggerHeader = (
                  <div className="healing-effect-item" style={{ marginBottom: '8px', borderBottom: '1px solid rgba(139, 115, 85, 0.3)', paddingBottom: '8px' }}>
                    <div className="healing-effect">
                      <span className="healing-effect-name">Required</span>
                      {logicBadge && (
                        <span className="healing-effect-description">
                          {' '}<span className="diamond-symbol">â—†</span> {logicBadge}
                        </span>
                      )}
                    </div>
                    <div className="healing-effect-details">
                      <div className="healing-effect-mechanics">
                        {hasTriggerConfig.requiredConditions.conditions.map((condition, index) => {
                          const conditionText = formatTriggerText(condition);
                          return (
                            <div key={index}>
                              {conditionText}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              } else if (hasGlobalTriggers) {
                // Check if any effects have conditional formulas that use these global triggers
                // If they do, don't show standalone trigger header (triggers will be shown with formulas)
                const globalTriggerIds = hasTriggerConfig.global.compoundTriggers.map(t => t.id);
                let hasGlobalConditionals = false;
                
                // Check damage conditional formulas
                const damageConditionals = spell?.triggerConfig?.conditionalEffects?.damage?.conditionalFormulas ||
                                         spell?.triggerConfig?.conditionalEffects?.damage_direct?.conditionalFormulas ||
                                         spell?.triggerConfig?.conditionalEffects?.damage_dot?.conditionalFormulas ||
                                         spell?.triggerConfig?.conditionalEffects?.damage_area?.conditionalFormulas;
                if (damageConditionals) {
                  hasGlobalConditionals = globalTriggerIds.some(id => damageConditionals[id] && id !== 'default');
                }
                
                // Check healing conditional formulas if not found in damage
                if (!hasGlobalConditionals) {
                  const healingConditionals = spell?.triggerConfig?.conditionalEffects?.healing?.conditionalFormulas ||
                                           spell?.triggerConfig?.conditionalEffects?.healing_direct?.conditionalFormulas ||
                                           spell?.triggerConfig?.conditionalEffects?.healing_hot?.conditionalFormulas ||
                                           spell?.triggerConfig?.conditionalEffects?.healing_shield?.conditionalFormulas;
                  if (healingConditionals) {
                    hasGlobalConditionals = globalTriggerIds.some(id => healingConditionals[id] && id !== 'default');
                  }
                }
                
                // Only show standalone trigger header if there are no conditional formulas using these triggers
                // Display global triggers in an intuitive way - as a clear section
                if (!hasGlobalConditionals) {
                  const triggerTexts = hasTriggerConfig.global.compoundTriggers.map(trigger => formatTriggerForConditionalDisplay(trigger));
                  triggerHeader = (
                    <div className="healing-effect-item" style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '2px solid rgba(139, 115, 85, 0.4)' }}>
                      <div className="healing-effect">
                        <span className="healing-effect-name" style={{ fontSize: '0.95em', fontWeight: '600', color: 'rgba(139, 115, 85, 0.9)' }}>
                          Spell Triggers
                        </span>
                      </div>
                      <div className="damage-effect-details" style={{ marginTop: '8px' }}>
                        {triggerTexts.map((text, index) => (
                          <div key={index} className="damage-effect-mechanics" style={{ fontSize: '0.9em', marginTop: index > 0 ? '4px' : '0' }}>
                            <strong>{text}</strong>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
              }
            }

            // Check if damage should be rendered
            const hasPrimaryDamage = spell?.primaryDamage?.dice && spell.primaryDamage.dice !== '6d6';
            const hasDamageFormula = spell?.damageConfig?.formula && spell.damageConfig.formula.trim();
            const hasCardDamage = spell?.resolution === 'CARDS' && spell?.cardConfig && spell?.damageConfig && spell?.effectTypes?.includes('damage');
            const hasCoinDamage = spell?.resolution === 'COINS' && spell?.coinConfig && spell?.damageConfig && spell?.effectTypes?.includes('damage');
            const hasDiceDamage = spell?.resolution === 'DICE' && spell?.diceConfig?.formula && spell.diceConfig.formula.trim() && spell?.damageConfig && spell?.effectTypes?.includes('damage');
            const hasDotDamage = spell?.damageConfig?.hasDotEffect || spell?.damageConfig?.damageType === 'dot';
            const isProphecySpell = spell?.resolution === 'PROPHECY';
            const shouldRenderDamage = !isProphecySpell && (hasPrimaryDamage || hasDamageFormula || hasCardDamage || hasCoinDamage || hasDiceDamage || hasDotDamage);

            // Check if healing should be rendered
            const healingData = spell?.healingConfig || (spell?.effects?.healing ? {
              formula: spell.effects.healing.instant?.formula || spell.effects.healing.hot?.formula,
              healingType: spell.effects.healing.hot ? 'hot' : 'instant'
            } : null);
            const shouldRenderHealing = !!healingData;

            // Effect-specific triggers are now integrated into each effect item, so no standalone headers needed

            // Determine if we need to wrap effects in a border container
            // Wrap together if there are global triggers/required that affect multiple effects
            // Otherwise, wrap individually if effect-specific triggers exist
            // NOTE: hasEffectsToWrap is disabled to prevent silently dropping buff/debuff/utility/control/
            // summoning/transformation/purification/restoration/rollable-table/prophecy sections when a
            // spell has both global triggers AND damage/healing. The wrapping is purely visual;
            // forcing false ensures ALL effect sections always render via the else branch.
            const hasEffectsToWrap = false;
            const shouldWrapDamageIndividually = hasDamageEffectTriggers && !hasGlobalTriggerOrRequired;
            const shouldWrapHealingIndividually = hasHealingEffectTriggers && !hasGlobalTriggerOrRequired;

            const hasStatusEffects = (spell?.statusEffectsConfig || []).length > 0;
            const hasRollableTable = (rollableTableData || spell?.mechanicsConfig?.rollableTable || spell?.rollableTable)?.enabled;
            const hasProphecy = !!(spell?.prophecyConfig || (Array.isArray(spell?.mechanicsConfig) && spell.mechanicsConfig.find(m => m.system === 'PROPHECY')?.prophecy));

            const hasBuffContent = spell?.effectTypes?.includes('buff') && (
              spell?.buffConfig?.statModifiers?.length > 0 ||
              spell?.buffConfig?.statusEffects?.length > 0 ||
              spell?.buffConfig?.effects?.length > 0 ||
              spell?.effects?.buff
            );
            const hasDebuffContent = !!(spell?.debuffConfig && (
              spell.debuffConfig.statPenalties?.length > 0 ||
              spell.debuffConfig.statModifiers?.length > 0 ||
              spell.debuffConfig.statusEffects?.length > 0 ||
              spell.debuffConfig.effects?.length > 0 ||
              spell.debuffConfig.duration ||
              spell.debuffConfig.durationType ||
              spell.debuffConfig.durationValue
            ));
            const hasDuration = (spell?.durationType && spell.durationType !== 'instant') ||
              (spell?.effectTypes?.includes('buff') && spell?.buffConfig?.durationType && spell.buffConfig.durationType !== 'instant');
            const hasUtility = spell?.effectTypes?.includes('utility') && (spell?.utilityConfig || spell?.effects?.utility);
            const hasControl = spell?.effectTypes?.includes('control') || spell?.controlConfig;
            const hasTerrain = spell?.effectTypes?.includes('terrain') || spell?.terrainConfig || spell?.effects?.terrain;
            const hasSummoning = spell?.effectTypes?.includes('summoning') && (spell?.summoningConfig || spell?.summonConfig);
            const hasTransformation = spell?.effectTypes?.includes('transformation') && (spell?.transformationConfig || spell?.transformConfig);
            const hasPurification = spell?.effectTypes?.includes('purification') && spell?.purificationConfig;
            const hasRestoration = spell?.effectTypes?.includes('restoration') && spell?.restorationConfig;

            const hasAnyStatContent = shouldRenderDamage || shouldRenderHealing || hasGlobalTriggerOrRequired ||
              hasBuffContent || hasDebuffContent || hasDuration || hasUtility || hasControl ||
              hasTerrain || hasSummoning || hasTransformation || hasPurification || hasRestoration;

            const statContent = (
              <>
                {hasEffectsToWrap ? (
                  <div className="healing-effects" style={{ marginTop: '2px', marginBottom: '0px' }}>
                    <div className="healing-effects-section">
                      {/* Global trigger/required state header */}
                      {hasGlobalTriggerOrRequired && triggerHeader && (
                        triggerHeader
                      )}

                      {/* Damage Display - Only show if damage is actually configured */}
                      {shouldRenderDamage && (
                        <>
                          <div className="damage-effects">
                            <div className="damage-effects-section">
                            {(() => {
                              const damageData = spell?.damageConfig;
                              if (!damageData) return null;

                              const effects = [];

                              // Helper to get effect-specific triggers and conditional formulas
                              const getEffectTriggersAndFormulas = (effectSubType) => {
                                // Check both the specific subtype (e.g., damage_direct) and the base type (e.g., damage)
                                const baseType = effectSubType.includes('_') ? effectSubType.split('_')[0] : effectSubType;
                                const effectTriggers = spell?.triggerConfig?.effectTriggers?.[effectSubType] || 
                                                       spell?.triggerConfig?.effectTriggers?.[baseType];
                                const conditionalFormulas = spell?.triggerConfig?.conditionalEffects?.[effectSubType]?.conditionalFormulas ||
                                                           spell?.triggerConfig?.conditionalEffects?.[baseType]?.conditionalFormulas;
                                const hasConditionals = conditionalFormulas && Object.keys(conditionalFormulas).length > 0 && Object.keys(conditionalFormulas).some(k => k !== 'default');
                                
                                // Get triggers (for display when no conditionals)
                                const triggers = effectTriggers?.compoundTriggers || [];
                                const triggerTexts = triggers.map(t => formatTriggerForConditionalDisplay(t));
                                
                                // Get conditional formulas if they exist
                                const formulas = hasConditionals ? Object.entries(conditionalFormulas)
                                  .filter(([triggerId]) => triggerId !== 'default')
                                  .map(([triggerId, formula]) => {
                                    const trigger = effectTriggers?.compoundTriggers?.find(t => t.id === triggerId);
                                    const triggerName = trigger ? formatTriggerForConditionalDisplay(trigger) : formatTriggerId(triggerId);
                                    return { triggerId, formula, triggerName };
                                  }) : [];
                                
                                return { triggers: triggerTexts, formulas };
                              };

                              // Main instant damage effect
                              const damageResult = formatDamage();
                              if (damageResult) {
                                if (typeof damageResult === 'object' && damageResult.instant && damageResult.dot) {
                                  // Instant damage
                                  const instantTriggers = getEffectTriggersAndFormulas('damage_direct');
                                  const instantTargeting = formatEffectTargeting('damage', 'damage_direct');
                                  effects.push({
                                    name: 'Instant Damage',
                                    description: '',
                                    mechanicsText: damageResult.instant,
                                    conditionalFormulas: instantTriggers?.formulas || [],
                                    triggers: instantTriggers?.triggers || [],
                                    targeting: instantTargeting
                                  });

                                  // DoT damage
                                  const dotTriggers = getEffectTriggersAndFormulas('damage_dot');
                                  const dotTargeting = formatEffectTargeting('damage', 'damage_dot');
                                  effects.push({
                                    name: 'Damage Over Time',
                                    description: '',
                                    mechanicsText: damageResult.dot,
                                    conditionalFormulas: dotTriggers?.formulas || [],
                                    triggers: dotTriggers?.triggers || [],
                                    targeting: dotTargeting
                                  });
                                } else {
                                  // Single damage effect
                                  const isDotOnly = damageData?.damageType === 'dot' && !damageData?.hasDotEffect;
                                  const isAreaDamage = damageData?.damageType === 'area';
                                  const effectSubType = isDotOnly ? 'damage_dot' : (isAreaDamage ? 'damage_area' : 'damage_direct');
                                  const effectTriggers = getEffectTriggersAndFormulas(effectSubType);
                                  const effectTargeting = formatEffectTargeting('damage', effectSubType);

                                  let effectName = isDotOnly ? 'Damage Over Time' : (isAreaDamage ? 'Area Damage' : 'Instant Damage');

                                  // Build mechanics text for area damage with triggers
                                  let mechanicsText = damageResult;

                                  // For area damage with triggers, format mechanics text with trigger description
                                  // Name stays as "Area Damage" per template - trigger info goes in mechanics text
                                  if (isAreaDamage && damageData?.triggerDescription) {
                                    mechanicsText = `${damageResult} - ${damageData.triggerDescription}`;
                                  }

                                  // Add chance on hit to instant damage mechanics text if enabled
                                  // Skip if there's a saving throw config (saving throw entry will show the chance info)
                                  if (!isDotOnly && !isAreaDamage && damageData?.chanceOnHitConfig?.enabled && !damageData?.savingThrowConfig?.enabled) {
                                    const chanceInfo = formatChanceOnHit();
                                    if (chanceInfo) {
                                      mechanicsText = mechanicsText ? `${mechanicsText} â€¢ ${chanceInfo}` : chanceInfo;
                                    }
                                  }

                                  effects.push({
                                    name: effectName,
                                    description: damageData?.description || '',
                                    mechanicsText: mechanicsText,
                                    conditionalFormulas: effectTriggers?.formulas || [],
                                    triggers: effectTriggers?.triggers || [],
                                    targeting: effectTargeting,
                                    triggerCondition: damageData?.triggerCondition,
                                    isTriggeredArea: false
                                  });
                                }
                              }

                              // Add saving throw info
                              if (damageData?.savingThrowConfig?.enabled) {
                                const saveInfo = formatSavingThrow(damageData.savingThrowConfig, 'damage');
                                if (saveInfo) {
                                  // Check if this is for a chance-on-hit effect
                                  const chanceConfig = damageData?.chanceOnHitConfig;
                                  let effectName = 'Saving Throw';
                                  let chanceText = '';
                                  
                                  if (chanceConfig?.enabled && chanceConfig?.customEffects?.length > 0) {
                                    // Use the first custom effect name (capitalized)
                                    const effectId = chanceConfig.customEffects[0];
                                    effectName = effectId.split('_').map(word => 
                                      word.charAt(0).toUpperCase() + word.slice(1)
                                    ).join(' ');
                                    
                                    // Format chance information
                                    if (chanceConfig.procType === 'dice') {
                                      chanceText = ` (${chanceConfig.diceThreshold}+ on d20 (${chanceConfig.procChance}%))`;
                                    } else if (chanceConfig.procType === 'cards') {
                                      let cardChance = '';
                                      if (chanceConfig.cardProcRule === 'face_cards') cardChance = '23%';
                                      else if (chanceConfig.cardProcRule === 'aces') cardChance = '8%';
                                      else if (chanceConfig.cardProcRule === 'specific_suit') cardChance = '25%';
                                      else if (chanceConfig.cardProcRule === 'red_cards' || chanceConfig.cardProcRule === 'black_cards') cardChance = '50%';
                                      else if (chanceConfig.cardProcRule === 'pairs') cardChance = '6%';
                                      else cardChance = '25%';
                                      chanceText = ` (${cardChance} chance)`;
                                    } else if (chanceConfig.procType === 'coins') {
                                      const coinChance = (Math.pow(0.5, chanceConfig.coinCount || 3) * 100).toFixed(1);
                                      chanceText = ` (${coinChance}% chance)`;
                                    }
                                  }
                                  
                                  // Format outcome as "Negates on fail" instead of just "negate"
                                  const saveOutcome = damageData.savingThrowConfig?.saveOutcome;
                                  const outcomeText = saveOutcome === 'negates' 
                                    ? 'Negates on fail' 
                                    : (saveInfo.outcome || 'Negates on fail');
                                  
                                  effects.push({
                                    name: effectName,
                                    description: `${saveInfo.saveType} save DC ${saveInfo.dc}${chanceText} (${outcomeText})`,
                                    mechanicsText: ''
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
                                    mechanicsText: ''
                                  });
                                }
                              }

                              // Note: Effect-specific triggers are shown as headers when wrapped, not in the effects list
                              // Note: Chance on hit is now integrated into instant damage mechanics text, not shown as separate effect

                              return effects.length > 0 ? (
                                <div className="damage-formula-line">
                                  <div className="damage-effects-list">
                                    {effects.map((effect, index) => (
                                      <div key={`damage-${index}`} className="damage-effect-item">
                                        <div className="damage-effect">
                                          <span className="damage-effect-name">
                                            {effect.name}
                                            {spell?.effectResolutions?.damage?.type && spell.effectResolutions.damage.type !== spell?.resolution && (
                                              <span className="targeting-badge" style={{
                                                marginLeft: '6px', fontSize: '0.7em', padding: '1px 5px',
                                                background: 'rgba(100,149,237,0.15)', border: '1px solid rgba(100,149,237,0.4)',
                                                borderRadius: '3px', color: '#6495ED'
                                              }}>
                                                {spell.effectResolutions.damage.type}
                                              </span>
                                            )}
                                            {effect.isTriggeredArea && (
                                              <span className="trigger-badge" style={{
                                                marginLeft: '8px',
                                                fontSize: '0.75em',
                                                padding: '2px 6px',
                                                background: 'rgba(255, 140, 0, 0.15)',
                                                border: '1px solid rgba(255, 140, 0, 0.4)',
                                                borderRadius: '4px',
                                                color: '#ff8c00',
                                                fontWeight: '600'
                                              }}>
                                                <i className="fas fa-bolt" style={{ marginRight: '4px' }}></i>
                                                Triggered
                                              </span>
                                            )}
                                          </span>
                                          {effect.description && effect.description !== effect.name && (
                                            <span className="damage-effect-description">
                                              {" "}<span className="diamond-symbol">â—†</span>{" "}{effect.description}
                                            </span>
                                          )}
                                          {/* Targeting/Range badges */}
                                          {effect.targeting && (
                                            <div className="damage-effect-targeting">
                                              {effect.targeting.range && (
                                                <span className="targeting-badge range-badge">
                                                  {effect.targeting.range}
                                                </span>
                                              )}
                                              {effect.targeting.targeting && (
                                                <span className="targeting-badge targeting-info-badge">
                                                  {effect.targeting.targeting}
                                                </span>
                                              )}
                                              {effect.targeting.restrictions && (
                                                <span className="targeting-badge restrictions-badge">
                                                  {effect.targeting.restrictions}
                                                </span>
                                              )}
                                              {effect.targeting.propagation && (
                                                <span className="targeting-badge propagation-badge">
                                                  {effect.targeting.propagation}
                                                </span>
                                              )}
                                              {spell?.targetingTags?.damage?.targetOption && (
                                                <span className="targeting-badge" style={{
                                                  background: 'rgba(220,20,60,0.1)', border: '1px solid rgba(220,20,60,0.3)',
                                                  color: '#dc143c', fontSize: '0.85em'
                                                }}>
                                                  {spell.targetingTags.damage.targetOption === 'enemy' ? 'Enemies' :
                                                   spell.targetingTags.damage.targetOption === 'ally' ? 'Allies' :
                                                   spell.targetingTags.damage.targetOption === 'self' ? 'Self' :
                                                   spell.targetingTags.damage.targetOption}
                                                </span>
                                              )}
                                            </div>
                                          )}
                                        </div>
                                        {effect.mechanicsText && (
                                          <div className="damage-effect-details">
                                            <div className={`damage-effect-mechanics ${effect.isTriggeredArea ? 'triggered-area-damage' : ''}`}>
                                              {effect.mechanicsText}
                                            </div>
                                          </div>
                                        )}
                                        {/* Conditional formulas - triggers shown with formulas */}
                                        {effect.conditionalFormulas && effect.conditionalFormulas.length > 0 && (
                                          <div className="damage-effect-details" style={{ marginTop: '4px', paddingTop: '4px', borderTop: '1px solid rgba(139, 115, 85, 0.2)' }}>
                                            {effect.conditionalFormulas.map((cf, cfIndex) => {
                                              const formattedFormula = formatFormulaToPlainEnglish(cf.formula, 'damage');
                                              const damageTypeSuffix = getDamageTypeSuffix();
                                              // triggerName is already formatted with formatTriggerForConditionalDisplay, so it's already in "If..." format
                                              // Don't add another "If" if it already starts with "If"
                                              const triggerText = cf.triggerName.startsWith('If ') ? cf.triggerName : (cf.triggerName.startsWith('When ') ? cf.triggerName.replace('When ', 'If ') : `If ${cf.triggerName}`);
                                              return (
                                                <div key={cfIndex} className="damage-effect-mechanics" style={{ fontSize: '0.9em', marginTop: cfIndex > 0 ? '4px' : '0' }}>
                                                  <strong>{triggerText}:</strong> {formattedFormula}{damageTypeSuffix}
                                                </div>
                                              );
                                            })}
                                          </div>
                                        )}
                                        {/* Standalone triggers (when no conditional formulas) - show below effect with divider */}
                                        {(!effect.conditionalFormulas || effect.conditionalFormulas.length === 0) && effect.triggers && effect.triggers.length > 0 && (
                                          <div className="damage-effect-details" style={{ marginTop: '4px', paddingTop: '4px', borderTop: '1px solid rgba(139, 115, 85, 0.2)' }}>
                                            {effect.triggers.map((triggerText, idx) => (
                                              <div key={idx} className="damage-effect-mechanics" style={{ fontSize: '0.9em', marginTop: idx > 0 ? '4px' : '0' }}>
                                                <strong>{triggerText}</strong>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              ) : null;
                            })()}
                          </div>
                        </div>
                        </>
                      )}

                      {/* Healing Display - Only show if healing is actually configured */}
                      {shouldRenderDamage && shouldRenderHealing && (
                        <div style={{ marginTop: '8px' }}></div>
                      )}
                      {shouldRenderHealing && (() => {
                        if (!healingData) return null;

                        const effects = [];

                        // Helper to get effect-specific triggers and conditional formulas for healing
                        const getHealingTriggersAndFormulas = (effectSubType) => {
                          // Check both the specific subtype (e.g., healing_direct) and the base type (e.g., healing)
                          const baseType = effectSubType.includes('_') ? effectSubType.split('_')[0] : effectSubType;
                          const effectTriggers = spell?.triggerConfig?.effectTriggers?.[effectSubType] || 
                                                 spell?.triggerConfig?.effectTriggers?.[baseType];
                          const conditionalFormulas = spell?.triggerConfig?.conditionalEffects?.[effectSubType]?.conditionalFormulas ||
                                                     spell?.triggerConfig?.conditionalEffects?.[baseType]?.conditionalFormulas;
                          const hasConditionals = conditionalFormulas && Object.keys(conditionalFormulas).length > 0 && Object.keys(conditionalFormulas).some(k => k !== 'default');
                          
                          // Only return if we have conditional formulas (triggers are shown via conditional formulas)
                          if (!hasConditionals) return null;
                          
                          const formulas = Object.entries(conditionalFormulas)
                            .filter(([triggerId]) => triggerId !== 'default')
                            .map(([triggerId, formula]) => {
                              const trigger = effectTriggers?.compoundTriggers?.find(t => t.id === triggerId);
                              const triggerName = trigger ? formatTriggerForConditionalDisplay(trigger) : formatTriggerId(triggerId);
                              return { triggerId, formula, triggerName };
                            });
                          
                          return { formulas };
                        };

                        // Main healing effect
                        const healingResult = formatHealing();
                        if (healingResult) {
                          if (typeof healingResult === 'object' && healingResult.description) {
                            // Shield healing
                            const shieldTriggers = getHealingTriggersAndFormulas('healing_shield');
                            effects.push({
                              name: 'Shield Absorption',
                              description: '', // Empty description - all info in mechanicsText
                              mechanicsText: healingResult.description,
                              conditionalFormulas: shieldTriggers?.formulas || []
                            });

                            // Add shield properties as separate effects
                            if (healingResult.bullets && healingResult.bullets.length > 0) {
                              healingResult.bullets.forEach((bullet, index) => {
                                effects.push({
                                  name: `  â”” Shield Property`,
                                  description: bullet,
                                  mechanicsText: 'Special shield behavior'
                                });
                              });
                            }
                          } else {
                            // Regular healing
                            const healingType = healingData.healingType;
                            const effectSubType = healingType === 'hot' ? 'healing_hot' : 
                                                   healingType === 'shield' ? 'healing_shield' : 'healing_direct';
                            const healingTriggers = getHealingTriggersAndFormulas(effectSubType);
                            const healingTargeting = formatEffectTargeting('healing', effectSubType);

                            // Determine description based on formula type
                            effects.push({
                              name: healingType === 'hot' ? 'Healing Over Time' :
                                    healingType === 'shield' ? 'Shield Absorption' : 'Healing',
                              description: '',
                              mechanicsText: healingResult,
                              conditionalFormulas: healingTriggers?.formulas || [],
                              targeting: healingTargeting
                            });
                          }
                        }

                        // Add HoT effect if it's an additional effect
                        if (healingData.hasHotEffect && healingData.hotFormula && healingData.healingType !== 'hot') {
                          const duration = healingData.hotDuration || 3;
                          const tickFrequency = healingData.hotTickType || 'round';
                          const durationText = duration === 1 ? `1 ${tickFrequency}` : `${duration} ${tickFrequency}s`;
                          effects.push({
                            name: 'Healing Over Time',
                            description: '',
                            mechanicsText: `${cleanFormula(healingData.hotFormula)} hit points restored per ${tickFrequency} for ${durationText}`
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

                        // Check for effect-specific triggers or required states for healing
                        const healingEffectTriggers = spell?.triggerConfig?.effectTriggers?.healing;
                        const healingHasTriggers = healingEffectTriggers?.compoundTriggers?.length > 0;
                        const healingHasRequiredState = false; // TODO: Add support for effect-specific required state

                        // Early return if no effects to render - prevents empty blocks
                        if (effects.length === 0) return null;

                        return (
                          <div className="healing-effects">
                            <div className="healing-effects-section">
                              {/* Show trigger/required state header if applicable */}
                              {(healingHasTriggers || healingHasRequiredState) && (
                                <div className="damage-effect-details" style={{ marginTop: '4px', paddingTop: '4px', borderTop: '1px solid rgba(139, 115, 85, 0.2)' }}>
                                  {healingHasTriggers && healingEffectTriggers.compoundTriggers.length > 0 && (
                                    <>
                                      {healingEffectTriggers.compoundTriggers.map((trigger, idx) => (
                                        <div key={idx} className="damage-effect-mechanics" style={{ fontSize: '0.9em', marginTop: idx > 0 ? '4px' : '0' }}>
                                          <strong>{formatTriggerForConditionalDisplay(trigger)}</strong>
                                        </div>
                                      ))}
                                    </>
                                  )}
                                </div>
                              )}
                              <div className="healing-formula-line">
                                <div className="healing-effects-list">
                                  {effects.map((effect, index) => (
                                    <div key={`healing-${index}`} className="healing-effect-item">
                                      <div className="healing-effect">
                                        <span className="healing-effect-name">
                                          {effect.name}
                                        </span>
                                        {/* Description removed - already shown in UnifiedSpellCard main description */}
                                        {/* Targeting/Range badges */}
                                        {effect.targeting && (
                                          <div className="healing-effect-targeting">
                                            {effect.targeting.range && (
                                              <span className="targeting-badge range-badge">
                                                {effect.targeting.range}
                                              </span>
                                            )}
                                            {effect.targeting.targeting && (
                                              <span className="targeting-badge targeting-info-badge">
                                                {effect.targeting.targeting}
                                              </span>
                                            )}
                                            {effect.targeting.restrictions && (
                                              <span className="targeting-badge restrictions-badge">
                                                {effect.targeting.restrictions}
                                              </span>
                                            )}
                                            {effect.targeting.propagation && (
                                              <span className="targeting-badge propagation-badge">
                                                {effect.targeting.propagation}
                                              </span>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                      {effect.mechanicsText && (
                                        <div className="healing-effect-details">
                                          <div className="healing-effect-mechanics">
                                            {effect.mechanicsText}
                                          </div>
                                        </div>
                                      )}
                                      {/* Conditional formulas */}
                                      {effect.conditionalFormulas && effect.conditionalFormulas.length > 0 && (
                                        <div className="healing-effect-details" style={{ marginTop: '4px', paddingTop: '4px', borderTop: '1px solid rgba(139, 115, 85, 0.2)' }}>
                                          {effect.conditionalFormulas.map((cf, cfIndex) => {
                                            const formattedFormula = formatFormulaToPlainEnglish(cf.formula, 'healing');
                                            // Convert "When" to "If" for conditional display, and handle plain text triggers
                                            let triggerText = cf.triggerName;
                                            if (triggerText.startsWith('When ')) {
                                              triggerText = triggerText.replace('When ', 'If ');
                                            } else if (!triggerText.startsWith('If ')) {
                                              triggerText = `If ${triggerText}`;
                                            }
                                            return (
                                              <div key={cfIndex} className="healing-effect-mechanics" style={{ fontSize: '0.9em', marginTop: cfIndex > 0 ? '4px' : '0' }}>
                                                <strong>{triggerText}:</strong> {formattedFormula} Healing
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })()}

                      {/* Mechanics Display - Same section as damage/healing */}
                      {(() => {
                        const mechanics = formatMechanics();
                        return mechanics && mechanics.length > 0 ? (
                          <>
                            {(shouldRenderDamage || shouldRenderHealing) && (
                              <div style={{ marginTop: '8px' }}></div>
                            )}
                            <div className="damage-formula-line">
                              <div className="damage-effects-list">
                                {mechanics.map((mechanic, index) => {
                                  // Determine which effect class to use based on effect name
                                  const isHealingEffect = mechanic.effectName === 'Healing';
                                  const effectClass = isHealingEffect ? 'healing-effect' : 'damage-effect';
                                  const effectItemClass = isHealingEffect ? 'healing-effect-item' : 'damage-effect-item';
                                  const effectNameClass = isHealingEffect ? 'healing-effect-name' : 'damage-effect-name';
                                  const effectDetailsClass = isHealingEffect ? 'healing-effect-details' : 'damage-effect-details';
                                  const effectMechanicsClass = isHealingEffect ? 'healing-effect-mechanics' : 'damage-effect-mechanics';
                                  
                                  return (
                                    <div key={index} className={effectItemClass}>
                                      <div className={effectClass}>
                                        <span className={effectNameClass}>
                                          {mechanic.systemType}
                                        </span>
                                      </div>
                                      {mechanic.mechanicsText && (
                                        <div className={effectDetailsClass}>
                                          <div className={effectMechanicsClass}>
                                            {mechanic.mechanicsText}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </>
                        ) : null;
                      })()}
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Render trigger header separately if no effects to wrap */}
                    {hasGlobalTriggerOrRequired && triggerHeader && (
                      <div className="healing-effects" style={{ marginTop: '2px', marginBottom: '0px' }}>
                        <div className="healing-effects-section">
                          {triggerHeader}
                        </div>
                      </div>
                    )}

                    {/* Damage Display - Wrap individually if it has effect-specific triggers */}
                    {shouldRenderDamage && (shouldWrapDamageIndividually ? (
                      <div className="healing-effects" style={{ marginTop: '2px', marginBottom: '0px' }}>
                        <div className="healing-effects-section">
                          {/* Effect-specific trigger header */}
                          <div className="damage-effects">
                            <div className="damage-effects-section">
                              {(() => {
                                const damageData = spell?.damageConfig;
                                if (!damageData) return null;

                                const effects = [];

                                // Helper to get effect-specific triggers and conditional formulas
                                const getEffectTriggersAndFormulas = (effectSubType) => {
                                  // Check both the specific subtype (e.g., damage_direct) and the base type (e.g., damage)
                                  const baseType = effectSubType.includes('_') ? effectSubType.split('_')[0] : effectSubType;
                                  const effectTriggers = spell?.triggerConfig?.effectTriggers?.[effectSubType] || 
                                                         spell?.triggerConfig?.effectTriggers?.[baseType];
                                  const conditionalFormulas = spell?.triggerConfig?.conditionalEffects?.[effectSubType]?.conditionalFormulas ||
                                                             spell?.triggerConfig?.conditionalEffects?.[baseType]?.conditionalFormulas;
                                  const hasTriggers = effectTriggers?.compoundTriggers?.length > 0;
                                  const hasConditionals = conditionalFormulas && Object.keys(conditionalFormulas).length > 0 && Object.keys(conditionalFormulas).some(k => k !== 'default');
                                  
                                  // Return triggers even if no conditionals - just need one or the other
                                  if (!hasTriggers && !hasConditionals) return null;
                                  
                                  // If we have triggers, always return them (even without conditionals)
                                  const triggerTexts = hasTriggers ? effectTriggers.compoundTriggers.map(t => formatTriggerForConditionalDisplay(t)) : [];
                                  const formulas = hasConditionals ? Object.entries(conditionalFormulas)
                                    .filter(([triggerId]) => triggerId !== 'default')
                                    .map(([triggerId, formula]) => {
                                      const trigger = effectTriggers?.compoundTriggers?.find(t => t.id === triggerId);
                                      const triggerName = trigger ? formatTriggerForConditionalDisplay(trigger) : formatTriggerId(triggerId);
                                      return { triggerId, formula, triggerName };
                                    }) : [];
                                  
                                  return { triggers: triggerTexts, formulas };
                                };

                                // Main instant damage effect
                                const damageResult = formatDamage();
                                if (damageResult) {
                                  if (typeof damageResult === 'object' && damageResult.instant && damageResult.dot) {
                                    // Instant damage
                                    const instantTriggers = getEffectTriggersAndFormulas('damage_direct');
                                    const instantTargeting = formatEffectTargeting('damage', 'damage_direct');
                                    effects.push({
                                      name: 'Instant Damage',
                                      description: '',
                                      mechanicsText: damageResult.instant,
                                      conditionalFormulas: instantTriggers?.formulas || [],
                                      triggers: instantTriggers?.triggers || [],
                                      targeting: instantTargeting
                                    });

                                    // DoT damage
                                    const dotTriggers = getEffectTriggersAndFormulas('damage_dot');
                                    const dotTargeting = formatEffectTargeting('damage', 'damage_dot');
                                    effects.push({
                                      name: 'Damage Over Time',
                                      description: '',
                                      mechanicsText: damageResult.dot,
                                      conditionalFormulas: dotTriggers?.formulas || [],
                                      triggers: dotTriggers?.triggers || [],
                                      targeting: dotTargeting
                                    });
                                  } else {
                                    // Single damage effect
                                  const isDotOnly = damageData?.damageType === 'dot' && !damageData?.formula;
                                    const isAreaDamage = damageData?.damageType === 'area';
                                    const effectSubType = isDotOnly ? 'damage_dot' : (isAreaDamage ? 'damage_area' : 'damage_direct');
                                    const effectTriggers = getEffectTriggersAndFormulas(effectSubType);
                                    const effectTargeting = formatEffectTargeting('damage', effectSubType);
                                    
                                    // âš ï¸ CRITICAL: All information must be in description (grey cursive text)
                                    // Use damageConfig.description if provided, otherwise build from damageResult
                                    // Build mechanics text for area damage with triggers
                                    let mechanicsText = damageResult;
                                    let effectName = isDotOnly ? 'Damage Over Time' : (isAreaDamage ? 'Area Damage' : 'Instant Damage');

                                    // For area damage with triggers, format mechanics text with trigger description
                                    if (isAreaDamage && damageData?.triggerDescription) {
                                      mechanicsText = `${damageResult} - ${damageData.triggerDescription}`;
                                    }

                                    // Add chance on hit to instant damage mechanics text if enabled
                                    // Skip if there's a saving throw config (saving throw entry will show the chance info)
                                    if (!isDotOnly && !isAreaDamage && damageData?.chanceOnHitConfig?.enabled && !damageData?.savingThrowConfig?.enabled) {
                                      const chanceInfo = formatChanceOnHit();
                                      if (chanceInfo) {
                                        mechanicsText = mechanicsText ? `${mechanicsText} â€¢ ${chanceInfo}` : chanceInfo;
                                      }
                                    }

                                    // âš ï¸ CRITICAL: Damage should be in bold text (mechanicsText), NOT in grey italic description
                                    // Description should be empty for damage effects - range/area info is already in header tags
                                    effects.push({
                                      name: effectName,
                                      description: '', // Always empty for damage - info is in mechanicsText and header tags
                                      mechanicsText: mechanicsText,
                                      conditionalFormulas: effectTriggers?.formulas || [],
                                      targeting: effectTargeting,
                                      triggerCondition: damageData?.triggerCondition,
                                      isTriggeredArea: false
                                    });
                                  }
                                }

                                // Add saving throw info
                                if (damageData?.savingThrowConfig?.enabled) {
                                  const saveInfo = formatSavingThrow(damageData.savingThrowConfig, 'damage');
                                  if (saveInfo) {
                                    // Check if this is for a chance-on-hit effect
                                    const chanceConfig = damageData?.chanceOnHitConfig;
                                    let effectName = 'Saving Throw';
                                    let chanceText = '';
                                    
                                    if (chanceConfig?.enabled && chanceConfig?.customEffects?.length > 0) {
                                      // Use the first custom effect name (capitalized)
                                      const effectId = chanceConfig.customEffects[0];
                                      effectName = effectId.split('_').map(word => 
                                        word.charAt(0).toUpperCase() + word.slice(1)
                                      ).join(' ');
                                      
                                      // Format chance information
                                      if (chanceConfig.procType === 'dice') {
                                        chanceText = ` (${chanceConfig.diceThreshold}+ on d20 (${chanceConfig.procChance}%))`;
                                      } else if (chanceConfig.procType === 'cards') {
                                        let cardChance = '';
                                        if (chanceConfig.cardProcRule === 'face_cards') cardChance = '23%';
                                        else if (chanceConfig.cardProcRule === 'aces') cardChance = '8%';
                                        else if (chanceConfig.cardProcRule === 'specific_suit') cardChance = '25%';
                                        else if (chanceConfig.cardProcRule === 'red_cards' || chanceConfig.cardProcRule === 'black_cards') cardChance = '50%';
                                        else if (chanceConfig.cardProcRule === 'pairs') cardChance = '6%';
                                        else cardChance = '25%';
                                        chanceText = ` (${cardChance} chance)`;
                                      } else if (chanceConfig.procType === 'coins') {
                                        const coinChance = (Math.pow(0.5, chanceConfig.coinCount || 3) * 100).toFixed(1);
                                        chanceText = ` (${coinChance}% chance)`;
                                      }
                                    }
                                    
                                    // Format outcome as "Negates on fail" instead of just "negate"
                                    const saveOutcome = damageData.savingThrowConfig?.saveOutcome;
                                    const outcomeText = saveOutcome === 'negates' 
                                      ? 'Negates on fail' 
                                      : (saveInfo.outcome || 'Negates on fail');
                                    
                                    effects.push({
                                      name: effectName,
                                      description: `${saveInfo.saveType} save DC ${saveInfo.dc}${chanceText} (${outcomeText})`,
                                      mechanicsText: ''
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
                                      mechanicsText: ''
                                    });
                                  }
                                }

                                // Note: Effect-specific triggers are shown as headers when wrapped individually, not in the effects list
                                // Note: Chance on hit is integrated into damage mechanicsText or saving throw entry, not shown as separate effect

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
                                                {" "}<span className="diamond-symbol">â—†</span>{" "}{effect.description}
                                              </span>
                                            )}
                                            {/* Targeting/Range badges */}
                                            {effect.targeting && (
                                              <div className="damage-effect-targeting">
                                                {effect.targeting.range && (
                                                  <span className="targeting-badge range-badge">
                                                    {effect.targeting.range}
                                                  </span>
                                                )}
                                                {effect.targeting.targeting && (
                                                  <span className="targeting-badge targeting-info-badge">
                                                    {effect.targeting.targeting}
                                                  </span>
                                                )}
                                                {effect.targeting.restrictions && (
                                                  <span className="targeting-badge restrictions-badge">
                                                    {effect.targeting.restrictions}
                                                  </span>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                          {effect.mechanicsText && (
                                            <div className="damage-effect-details">
                                              <div className="damage-effect-mechanics">
                                                {effect.mechanicsText}
                                              </div>
                                            </div>
                                          )}
                                          {/* Conditional formulas */}
                                          {effect.conditionalFormulas && effect.conditionalFormulas.length > 0 && (
                                            <div className="damage-effect-details" style={{ marginTop: '4px', paddingTop: '4px', borderTop: '1px solid rgba(139, 115, 85, 0.2)' }}>
                                              {effect.conditionalFormulas.map((cf, cfIndex) => {
                                                const formattedFormula = formatFormulaToPlainEnglish(cf.formula, 'damage');
                                                const damageTypeSuffix = getDamageTypeSuffix();
                                                // triggerName is already formatted with formatTriggerForConditionalDisplay, so it's already in "If..." format
                                                // Don't add another "If" if it already starts with "If"
                                                const triggerText = cf.triggerName.startsWith('If ') ? cf.triggerName : (cf.triggerName.startsWith('When ') ? cf.triggerName.replace('When ', 'If ') : `If ${cf.triggerName}`);
                                                return (
                                                  <div key={cfIndex} className="damage-effect-mechanics" style={{ fontSize: '0.9em', marginTop: cfIndex > 0 ? '4px' : '0' }}>
                                                    <strong>{triggerText}:</strong> {formattedFormula}{damageTypeSuffix}
                                                  </div>
                                                );
                                              })}
                                            </div>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ) : null;
                              })()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="damage-effects">
                        <div className="damage-effects-section">
                          {(() => {
                            const damageData = spell?.damageConfig;
                            if (!damageData) return null;

                            const effects = [];

                            // Helper to get effect-specific triggers and conditional formulas
                            const getEffectTriggersAndFormulas = (effectSubType) => {
                              // Check both the specific subtype (e.g., damage_direct) and the base type (e.g., damage)
                              const baseType = effectSubType.includes('_') ? effectSubType.split('_')[0] : effectSubType;
                              const effectTriggers = spell?.triggerConfig?.effectTriggers?.[effectSubType] || 
                                                     spell?.triggerConfig?.effectTriggers?.[baseType];
                              const conditionalFormulas = spell?.triggerConfig?.conditionalEffects?.[effectSubType]?.conditionalFormulas ||
                                                         spell?.triggerConfig?.conditionalEffects?.[baseType]?.conditionalFormulas;
                                  const hasConditionals = conditionalFormulas && Object.keys(conditionalFormulas).length > 0 && Object.keys(conditionalFormulas).some(k => k !== 'default');
                                  
                                  if (!hasConditionals) return null;
                                  
                                  const formulas = Object.entries(conditionalFormulas)
                                    .filter(([triggerId]) => triggerId !== 'default')
                                    .map(([triggerId, formula]) => {
                                      const trigger = effectTriggers?.compoundTriggers?.find(t => t.id === triggerId);
                                      const triggerName = trigger ? formatTriggerForConditionalDisplay(trigger) : formatTriggerId(triggerId);
                                      return { triggerId, formula, triggerName };
                                    });
                                  
                                  return { formulas };
                            };

                            // Main instant damage effect
                            const damageResult = formatDamage();
                            if (damageResult) {
                              if (typeof damageResult === 'object' && damageResult.instant && damageResult.dot) {
                                // Instant damage
                                const instantTriggers = getEffectTriggersAndFormulas('damage_direct');
                                const instantTargeting = formatEffectTargeting('damage', 'damage_direct');
                                effects.push({
                                  name: 'Instant Damage',
                                  description: '',
                                  mechanicsText: damageResult.instant,
                                  conditionalFormulas: instantTriggers?.formulas || [],
                                  targeting: instantTargeting
                                });

                                // DoT damage
                                const dotTriggers = getEffectTriggersAndFormulas('damage_dot');
                                const dotTargeting = formatEffectTargeting('damage', 'damage_dot');
                                effects.push({
                                  name: 'Damage Over Time',
                                  description: '',
                                  mechanicsText: damageResult.dot,
                                  conditionalFormulas: dotTriggers?.formulas || [],
                                  targeting: dotTargeting
                                });
                              } else {
                                // Single damage effect
                                const isDotOnly = damageData?.damageType === 'dot' && !damageData?.formula;
                                const isAreaDamage = damageData?.damageType === 'area';
                                const effectSubType = isDotOnly ? 'damage_dot' : (isAreaDamage ? 'damage_area' : 'damage_direct');
                                const effectTriggers = getEffectTriggersAndFormulas(effectSubType);
                                const effectTargeting = formatEffectTargeting('damage', effectSubType);

                                    // Build mechanics text for area damage with triggers
                                    let mechanicsText = damageResult;
                                    let effectName = isDotOnly ? 'Damage Over Time' : (isAreaDamage ? 'Area Damage' : 'Instant Damage');

                                    // For area damage with triggers, format mechanics text with trigger description
                                    if (isAreaDamage && damageData?.triggerDescription) {
                                      mechanicsText = `${damageResult} - ${damageData.triggerDescription}`;
                                    }

                                    // Add chance on hit to instant damage mechanics text if enabled
                                    // Skip if there's a saving throw config (saving throw entry will show the chance info)
                                    if (!isDotOnly && !isAreaDamage && damageData?.chanceOnHitConfig?.enabled && !damageData?.savingThrowConfig?.enabled) {
                                      const chanceInfo = formatChanceOnHit();
                                      if (chanceInfo) {
                                        mechanicsText = mechanicsText ? `${mechanicsText} â€¢ ${chanceInfo}` : chanceInfo;
                                      }
                                    }

                                    // âš ï¸ CRITICAL: Damage should be in bold text (mechanicsText), NOT in grey italic description
                                    // Description should be empty for damage effects - range/area info is already in header tags
                                    effects.push({
                                      name: effectName,
                                      description: '', // Always empty for damage - info is in mechanicsText and header tags
                                      mechanicsText: mechanicsText,
                                      conditionalFormulas: effectTriggers?.formulas || [],
                                      targeting: effectTargeting,
                                      triggerCondition: damageData?.triggerCondition,
                                      isTriggeredArea: false
                                    });
                              }
                            }

                            // Add saving throw info
                            if (damageData?.savingThrowConfig?.enabled) {
                              const saveInfo = formatSavingThrow(damageData.savingThrowConfig, 'damage');
                              if (saveInfo) {
                                // Check if this is for a chance-on-hit effect
                                const chanceConfig = damageData?.chanceOnHitConfig;
                                let effectName = 'Saving Throw';
                                let chanceText = '';
                                
                                if (chanceConfig?.enabled && chanceConfig?.customEffects?.length > 0) {
                                  // Use the first custom effect name (capitalized)
                                  const effectId = chanceConfig.customEffects[0];
                                  effectName = effectId.split('_').map(word => 
                                    word.charAt(0).toUpperCase() + word.slice(1)
                                  ).join(' ');
                                  
                                  // Format chance information
                                  if (chanceConfig.procType === 'dice') {
                                    chanceText = ` (${chanceConfig.diceThreshold}+ on d20 (${chanceConfig.procChance}%))`;
                                  } else if (chanceConfig.procType === 'cards') {
                                    let cardChance = '';
                                    if (chanceConfig.cardProcRule === 'face_cards') cardChance = '23%';
                                    else if (chanceConfig.cardProcRule === 'aces') cardChance = '8%';
                                    else if (chanceConfig.cardProcRule === 'specific_suit') cardChance = '25%';
                                    else if (chanceConfig.cardProcRule === 'red_cards' || chanceConfig.cardProcRule === 'black_cards') cardChance = '50%';
                                    else if (chanceConfig.cardProcRule === 'pairs') cardChance = '6%';
                                    else cardChance = '25%';
                                    chanceText = ` (${cardChance} chance)`;
                                  } else if (chanceConfig.procType === 'coins') {
                                    const coinChance = (Math.pow(0.5, chanceConfig.coinCount || 3) * 100).toFixed(1);
                                    chanceText = ` (${coinChance}% chance)`;
                                  }
                                }
                                
                                // Format outcome as "Negates on fail" instead of just "negate"
                                const saveOutcome = damageData.savingThrowConfig?.saveOutcome;
                                const outcomeText = saveOutcome === 'negates' 
                                  ? 'Negates on fail' 
                                  : (saveInfo.outcome || 'Negates on fail');
                                
                                effects.push({
                                  name: effectName,
                                  description: `${saveInfo.saveType} save DC ${saveInfo.dc}${chanceText} (${outcomeText})`,
                                  mechanicsText: ''
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
                                  mechanicsText: ''
                                });
                              }
                            }

                            // Note: Effect-specific triggers are shown as headers when wrapped individually, not in the effects list

                            // Note: Chance on hit is now integrated into instant damage mechanics text, not shown as separate effect

                            return effects.length > 0 ? (
                              <div className="damage-formula-line">
                                <div className="damage-effects-list">
                                      {effects.map((effect, index) => (
                                        <div key={`damage-${index}`} className="damage-effect-item">
                                          <div className="damage-effect">
                                            <span className="damage-effect-name">
                                              {effect.name}
                                              {effect.isTriggeredArea && (
                                                <span className="trigger-badge" style={{
                                                  marginLeft: '8px',
                                                  fontSize: '0.75em',
                                                  padding: '2px 6px',
                                                  background: 'rgba(255, 140, 0, 0.15)',
                                                  border: '1px solid rgba(255, 140, 0, 0.4)',
                                                  borderRadius: '4px',
                                                  color: '#ff8c00',
                                                  fontWeight: '600'
                                                }}>
                                                  <i className="fas fa-bolt" style={{ marginRight: '4px' }}></i>
                                                  Triggered
                                                </span>
                                              )}
                                            </span>
                                            {effect.description && effect.description !== effect.name && (
                                              <span className="damage-effect-description">
                                                {" "}<span className="diamond-symbol">â—†</span>{" "}{effect.description}
                                              </span>
                                            )}
                                            {/* Targeting/Range badges */}
                                            {effect.targeting && (
                                              <div className="damage-effect-targeting">
                                                {effect.targeting.range && (
                                                  <span className="targeting-badge range-badge">
                                                    {effect.targeting.range}
                                                  </span>
                                                )}
                                                {effect.targeting.targeting && (
                                                  <span className="targeting-badge targeting-info-badge">
                                                    {effect.targeting.targeting}
                                                  </span>
                                                )}
                                                {effect.targeting.restrictions && (
                                                  <span className="targeting-badge restrictions-badge">
                                                    {effect.targeting.restrictions}
                                                  </span>
                                                )}
                                                {effect.targeting.propagation && (
                                                  <span className="targeting-badge propagation-badge">
                                                    {effect.targeting.propagation}
                                                  </span>
                                                )}
                                              </div>
                                            )}
                                          </div>
                                          {effect.mechanicsText && (
                                            <div className="damage-effect-details">
                                              <div className={`damage-effect-mechanics ${effect.isTriggeredArea ? 'triggered-area-damage' : ''}`}>
                                                {effect.mechanicsText}
                                              </div>
                                            </div>
                                          )}
                                      {/* Conditional formulas */}
                                      {effect.conditionalFormulas && effect.conditionalFormulas.length > 0 && (
                                        <div className="damage-effect-details" style={{ marginTop: '4px', paddingTop: '4px', borderTop: '1px solid rgba(139, 115, 85, 0.2)' }}>
                                          {effect.conditionalFormulas.map((cf, cfIndex) => {
                                            const formattedFormula = formatFormulaToPlainEnglish(cf.formula, 'damage');
                                            const damageTypeSuffix = getDamageTypeSuffix();
                                            // triggerName is already formatted with formatTriggerForConditionalDisplay, so it's already in "If..." format
                                            // Don't add another "If" if it already starts with "If"
                                            const triggerText = cf.triggerName.startsWith('If ') ? cf.triggerName : (cf.triggerName.startsWith('When ') ? cf.triggerName.replace('When ', 'If ') : `If ${cf.triggerName}`);
                                            return (
                                              <div key={cfIndex} className="damage-effect-mechanics" style={{ fontSize: '0.9em', marginTop: cfIndex > 0 ? '4px' : '0' }}>
                                                <strong>{triggerText}:</strong> {formattedFormula}{damageTypeSuffix}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ) : null;
                          })()}
                        </div>
                      </div>
                    ))}

                    {/* Note Generation Display - Removed (now shown in header as resource cost) */}

                    {/* Healing Display - Wrap individually if it has effect-specific triggers */}
                    {shouldRenderHealing && (shouldWrapHealingIndividually ? (
                      <div className="healing-effects" style={{ marginTop: '2px', marginBottom: '0px' }}>
                        <div className="healing-effects-section">
                          {/* Effect-specific trigger header */}
                          {/* Healing effects content */}
                          <div className="healing-formula-line">
                            <div className="healing-effects-list">
                              {(() => {
                                if (!healingData) return null;

                                const effects = [];

                                // Helper to get effect-specific triggers and conditional formulas for healing
                                const getHealingTriggersAndFormulas = (effectSubType) => {
                                  // Check both the specific subtype (e.g., healing_direct) and the base type (e.g., healing)
                                  const baseType = effectSubType.includes('_') ? effectSubType.split('_')[0] : effectSubType;
                                  const effectTriggers = spell?.triggerConfig?.effectTriggers?.[effectSubType] || 
                                                         spell?.triggerConfig?.effectTriggers?.[baseType];
                                  const conditionalFormulas = spell?.triggerConfig?.conditionalEffects?.[effectSubType]?.conditionalFormulas ||
                                                             spell?.triggerConfig?.conditionalEffects?.[baseType]?.conditionalFormulas;
                                  const hasConditionals = conditionalFormulas && Object.keys(conditionalFormulas).length > 0 && Object.keys(conditionalFormulas).some(k => k !== 'default');
                                  
                                  // Only return if we have conditional formulas (triggers are shown via conditional formulas)
                                  if (!hasConditionals) return null;
                                  
                                  const formulas = Object.entries(conditionalFormulas)
                                    .filter(([triggerId]) => triggerId !== 'default')
                                    .map(([triggerId, formula]) => {
                                      const trigger = effectTriggers?.compoundTriggers?.find(t => t.id === triggerId);
                                      const triggerName = trigger ? formatTriggerForConditionalDisplay(trigger) : formatTriggerId(triggerId);
                                      return { triggerId, formula, triggerName };
                                    });
                                  
                                  return { formulas };
                                };

                                // Main healing effect
                                const healingResult = formatHealing();
                                if (healingResult) {
                                  if (typeof healingResult === 'object' && healingResult.description) {
                                    // Shield healing
                                    const shieldTriggers = getHealingTriggersAndFormulas('healing_shield');
                                    effects.push({
                                      name: 'Shield Absorption',
                                      description: '', // Empty description - all info in mechanicsText
                                      mechanicsText: healingResult.description,
                                      conditionalFormulas: shieldTriggers?.formulas || []
                                    });

                                    // Add shield properties as separate effects
                                    if (healingResult.bullets && healingResult.bullets.length > 0) {
                                      healingResult.bullets.forEach((bullet, index) => {
                                        effects.push({
                                          name: `  â”” Shield Property`,
                                          description: bullet,
                                          mechanicsText: 'Special shield behavior'
                                        });
                                      });
                                    }
                                  } else {
                                    // Regular healing
                                    const healingType = healingData.healingType;
                                    const effectSubType = healingType === 'hot' ? 'healing_hot' : 
                                                           healingType === 'shield' ? 'healing_shield' : 'healing_direct';
                                    const healingTriggers = getHealingTriggersAndFormulas(effectSubType);
                                    const healingTargeting = formatEffectTargeting('healing', effectSubType);

                                    // Determine description based on formula type
                                    effects.push({
                                      name: healingType === 'hot' ? 'Healing Over Time' :
                                            healingType === 'shield' ? 'Shield Absorption' : 'Healing',
                                      description: '',
                                      mechanicsText: healingResult,
                                      conditionalFormulas: healingTriggers?.formulas || [],
                                      targeting: healingTargeting
                                    });
                                  }
                                }

                                // Add HoT effect if it's an additional effect
                                if (healingData.hasHotEffect && healingData.hotFormula && healingData.healingType !== 'hot') {
                                  const duration = healingData.hotDuration || 3;
                                  const tickFrequency = healingData.hotTickType || 'round';
                                  const durationText = duration === 1 ? `1 ${tickFrequency}` : `${duration} ${tickFrequency}s`;
                                  effects.push({
                                    name: 'Healing Over Time',
                                    description: '',
                                    mechanicsText: `${cleanFormula(healingData.hotFormula)} hit points restored per ${tickFrequency} for ${durationText}`
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

                                // Early return if no effects to render - prevents empty blocks
                                if (effects.length === 0) return null;

                                return (
                                  <>
                                    {effects.map((effect, index) => (
                                      <div key={`healing-${index}`} className="healing-effect-item">
                                        <div className="healing-effect">
                                        <span className="healing-effect-name">
                                          {effect.name}
                                          {spell?.effectResolutions?.healing?.type && spell.effectResolutions.healing.type !== spell?.resolution && (
                                            <span className="targeting-badge" style={{
                                              marginLeft: '6px', fontSize: '0.7em', padding: '1px 5px',
                                              background: 'rgba(100,149,237,0.15)', border: '1px solid rgba(100,149,237,0.4)',
                                              borderRadius: '3px', color: '#6495ED'
                                            }}>
                                              {spell.effectResolutions.healing.type}
                                            </span>
                                          )}
                                        </span>
                                          {/* Description removed - already shown in UnifiedSpellCard main description */}
                                        </div>
                                  {effect.mechanicsText && (
                                    <div className="healing-effect-details">
                                      <div className="healing-effect-mechanics">
                                        {effect.mechanicsText}
                                      </div>
                                    </div>
                                  )}
                                  {effect.abilities && effect.abilities.length > 0 && (
                                    <div className="summon-creature-abilities" style={{ marginTop: '4px', paddingTop: '4px', borderTop: '1px solid rgba(139, 115, 85, 0.2)' }}>
                                      {effect.abilities.map((ab, abIdx) => {
                                        const apCost = ab.resourceCost?.actionPoints ?? ab.castingConfig?.actionPointCost ?? ab.actionPointCost;
                                        const manaCost = ab.resourceCost?.resourceValues?.mana;
                                        const metaParts = [];
                                        if (apCost > 0) metaParts.push(`${apCost} AP`);
                                        if (manaCost > 0) metaParts.push(`${manaCost} Mana`);
                                        const effectParts = [];
                                        if (ab.damageConfig?.formula) {
                                          let dmgText = ab.damageConfig.formula;
                                          if (ab.damageConfig.elementType) dmgText += ` ${ab.damageConfig.elementType}`;
                                          effectParts.push(dmgText + ' damage');
                                        }
                                        if (ab.healingConfig?.formula) {
                                          effectParts.push(ab.healingConfig.formula + ' healing');
                                        }
                                        if (ab.buffConfig?.effects?.length) {
                                          const buffs = ab.buffConfig.effects.map(e => {
                                            if (e.type === 'vulnerability' || e.type === 'resistance' || e.type === 'immunity') {
                                              return `${e.type} to ${e.element || e.stat || 'damage'}`;
                                            }
                                            const val = e.magnitude > 0 ? `+${e.magnitude}` : e.magnitude;
                                            return `${e.stat || 'stat'} ${val}`;
                                          });
                                          effectParts.push(buffs.join(', '));
                                        }
                                        if (ab.debuffConfig?.effects?.length) {
                                          const debuffs = ab.debuffConfig.effects.map(e => {
                                            if (e.type === 'vulnerability' || e.type === 'resistance' || e.type === 'immunity') {
                                              return `${e.type} to ${e.element || e.stat || 'damage'}`;
                                            }
                                            const val = e.magnitude < 0 ? e.magnitude : `-${Math.abs(e.magnitude)}`;
                                            return `${e.stat || 'stat'} ${val}`;
                                          });
                                          effectParts.push(debuffs.join(', '));
                                          if (ab.debuffConfig.saveDC) {
                                            effectParts.push(`DC ${ab.debuffConfig.saveDC} ${ab.debuffConfig.saveType || ''} save`);
                                          }
                                        }
                                        if (ab.controlConfig) {
                                          const ctrlMap = { forcedMovement: 'Push/Pull', incapacitation: 'Stun', restraint: 'Restrain', knockdown: 'Knockdown' };
                                          effectParts.push(ctrlMap[ab.controlConfig.controlType] || ab.controlConfig.controlType || 'Control');
                                          if (ab.controlConfig.saveDC) {
                                            effectParts.push(`DC ${ab.controlConfig.saveDC} ${ab.controlConfig.saveType || ''} save`);
                                          }
                                        }
                                        return (
                                          <div key={abIdx} className="summon-ability-entry" style={{ fontSize: '0.88em', marginTop: abIdx > 0 ? '3px' : '0', display: 'flex', gap: '6px', alignItems: 'baseline', flexWrap: 'wrap' }}>
                                            <span style={{ color: '#6b4226', fontWeight: 600, whiteSpace: 'nowrap' }}>{ab.name || 'Ability'}</span>
                                            {metaParts.length > 0 && (
                                              <span style={{ color: '#8b7355', fontSize: '0.9em' }}>[{metaParts.join(' \u2022 ')}]</span>
                                            )}
                                            {effectParts.length > 0 && (
                                              <span style={{ color: '#5a4a3a' }}>{effectParts.join(' \u2022 ')}</span>
                                            )}
                                            {ab.description && (
                                              <span style={{ color: '#5a4a3a', fontStyle: 'italic' }}>&#8212; {ab.description}</span>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                        {/* Conditional formulas with trigger display */}
                                        {/* Conditional formulas */}
                                        {effect.conditionalFormulas && effect.conditionalFormulas.length > 0 && (
                                          <div className="healing-effect-details" style={{ marginTop: '4px', paddingTop: '4px', borderTop: '1px solid rgba(139, 115, 85, 0.2)' }}>
                                            {effect.conditionalFormulas.map((cf, cfIndex) => {
                                              const formattedFormula = formatFormulaToPlainEnglish(cf.formula, 'healing');
                                              // Convert "When" to "If" for conditional display, and handle plain text triggers
                                              let triggerText = cf.triggerName;
                                              if (triggerText.startsWith('When ')) {
                                                triggerText = triggerText.replace('When ', 'If ');
                                              } else if (!triggerText.startsWith('If ')) {
                                                triggerText = `If ${triggerText}`;
                                              }
                                              return (
                                                <div key={cfIndex} className="healing-effect-mechanics" style={{ fontSize: '0.9em', marginTop: cfIndex > 0 ? '4px' : '0' }}>
                                                  <strong>{triggerText}:</strong> {formattedFormula} Healing
                                                </div>
                                              );
                                            })}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </>
                                );
                              })()}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      (() => {
                        if (!healingData) return null;

                        const effects = [];

                        // Helper to get effect-specific triggers and conditional formulas for healing
                        const getHealingTriggersAndFormulas = (effectSubType) => {
                          const baseType = effectSubType.includes('_') ? effectSubType.split('_')[0] : effectSubType;
                          const effectTriggers = spell?.triggerConfig?.effectTriggers?.[effectSubType] || 
                                                 spell?.triggerConfig?.effectTriggers?.[baseType];
                          const conditionalFormulas = spell?.triggerConfig?.conditionalEffects?.[effectSubType]?.conditionalFormulas ||
                                                     spell?.triggerConfig?.conditionalEffects?.[baseType]?.conditionalFormulas;
                          const hasConditionals = conditionalFormulas && Object.keys(conditionalFormulas).length > 0 && Object.keys(conditionalFormulas).some(k => k !== 'default');
                          
                          if (!hasConditionals) return null;
                          
                          const formulas = Object.entries(conditionalFormulas)
                            .filter(([triggerId]) => triggerId !== 'default')
                            .map(([triggerId, formula]) => {
                              const trigger = effectTriggers?.compoundTriggers?.find(t => t.id === triggerId);
                              const triggerName = trigger ? formatTriggerForConditionalDisplay(trigger) : formatTriggerId(triggerId);
                              return { triggerId, formula, triggerName };
                            });
                          
                          return { formulas };
                        };

                        // Main healing effect
                        const healingResult = formatHealing();
                        if (healingResult) {
                          if (typeof healingResult === 'object' && healingResult.description) {
                            // Shield healing
                            const shieldTriggers = getHealingTriggersAndFormulas('healing_shield');
                            effects.push({
                              name: 'Shield Absorption',
                              description: '', // Empty description - all info in mechanicsText
                              mechanicsText: healingResult.description,
                              conditionalFormulas: shieldTriggers?.formulas || []
                            });

                            // Add shield properties as separate effects
                            if (healingResult.bullets && healingResult.bullets.length > 0) {
                              healingResult.bullets.forEach((bullet, index) => {
                                effects.push({
                                  name: `  â”” Shield Property`,
                                  description: bullet,
                                  mechanicsText: 'Special shield behavior'
                                });
                              });
                            }
                          } else {
                            // Regular healing
                            const healingType = healingData.healingType;
                            const effectSubType = healingType === 'hot' ? 'healing_hot' : 
                                                   healingType === 'shield' ? 'healing_shield' : 'healing_direct';
                            const healingTriggers = getHealingTriggersAndFormulas(effectSubType);
                            const healingTargeting = formatEffectTargeting('healing', effectSubType);

                            // Determine description based on formula type
                            effects.push({
                              name: healingType === 'hot' ? 'Healing Over Time' :
                                    healingType === 'shield' ? 'Shield Absorption' : 'Healing',
                              description: '',
                              mechanicsText: healingResult,
                              conditionalFormulas: healingTriggers?.formulas || [],
                              targeting: healingTargeting
                            });
                          }
                        }

                        // Add HoT effect if it's an additional effect
                        if (healingData.hasHotEffect && healingData.hotFormula && healingData.healingType !== 'hot') {
                          const duration = healingData.hotDuration || 3;
                          const tickFrequency = healingData.hotTickType || 'round';
                          const durationText = duration === 1 ? `1 ${tickFrequency}` : `${duration} ${tickFrequency}s`;
                          effects.push({
                            name: 'Healing Over Time',
                            description: '',
                            mechanicsText: `${cleanFormula(healingData.hotFormula)} hit points restored per ${tickFrequency} for ${durationText}`
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

                        // Check for effect-specific triggers or required states for healing
                        const healingEffectTriggers = spell?.triggerConfig?.effectTriggers?.healing;
                        const healingHasTriggers = healingEffectTriggers?.compoundTriggers?.length > 0;
                        const healingHasRequiredState = false; // TODO: Add support for effect-specific required state

                        // Early return if no effects to render - prevents empty blocks
                        if (effects.length === 0) return null;

                        return (
                          <div className="healing-effects">
                            <div className="healing-effects-section">
                              {/* Show trigger/required state header if applicable */}
                              {(healingHasTriggers || healingHasRequiredState) && (
                                <div className="damage-effect-details" style={{ marginTop: '4px', paddingTop: '4px', borderTop: '1px solid rgba(139, 115, 85, 0.2)' }}>
                                  {healingHasTriggers && healingEffectTriggers.compoundTriggers.length > 0 && (
                                    <>
                                      {healingEffectTriggers.compoundTriggers.map((trigger, idx) => (
                                        <div key={idx} className="damage-effect-mechanics" style={{ fontSize: '0.9em', marginTop: idx > 0 ? '4px' : '0' }}>
                                          <strong>{formatTriggerForConditionalDisplay(trigger)}</strong>
                                        </div>
                                      ))}
                                    </>
                                  )}
                                </div>
                              )}
                              <div className="healing-formula-line">
                                <div className="healing-effects-list">
                                  {effects.map((effect, index) => (
                                    <div key={`healing-${index}`} className="healing-effect-item">
                                      <div className="healing-effect">
                                        <span className="healing-effect-name">
                                          {effect.name}
                                        </span>
                                        {/* Description removed - already shown in UnifiedSpellCard main description */}
                                        {/* Targeting/Range badges */}
                                        {effect.targeting && (
                                          <div className="healing-effect-targeting">
                                            {effect.targeting.range && (
                                              <span className="targeting-badge range-badge">
                                                {effect.targeting.range}
                                              </span>
                                            )}
                                            {effect.targeting.targeting && (
                                              <span className="targeting-badge targeting-info-badge">
                                                {effect.targeting.targeting}
                                              </span>
                                            )}
                                            {effect.targeting.restrictions && (
                                              <span className="targeting-badge restrictions-badge">
                                                {effect.targeting.restrictions}
                                              </span>
                                            )}
                                            {effect.targeting.propagation && (
                                              <span className="targeting-badge propagation-badge">
                                                {effect.targeting.propagation}
                                              </span>
                                            )}
                                          </div>
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
                            </div>
                          </div>
                        );
                      })()
                    ))}

                    {/* Mechanics Display - Same section as damage/healing (for unwrapped case) */}
                    {(() => {
                      const mechanics = formatMechanics();
                      return mechanics && mechanics.length > 0 ? (
                        <div className="healing-effects" style={{ marginTop: '2px', marginBottom: '0px' }}>
                          <div className="healing-effects-section">
                            <div className="damage-formula-line">
                              <div className="damage-effects-list">
                                {mechanics.map((mechanic, index) => {
                                  // Determine which effect class to use based on effect name
                                  const isHealingEffect = mechanic.effectName === 'Healing';
                                  const effectClass = isHealingEffect ? 'healing-effect' : 'damage-effect';
                                  const effectItemClass = isHealingEffect ? 'healing-effect-item' : 'damage-effect-item';
                                  const effectNameClass = isHealingEffect ? 'healing-effect-name' : 'damage-effect-name';
                                  const effectDetailsClass = isHealingEffect ? 'healing-effect-details' : 'damage-effect-details';
                                  const effectMechanicsClass = isHealingEffect ? 'healing-effect-mechanics' : 'damage-effect-mechanics';
                                  
                                  return (
                                    <div key={index} className={effectItemClass}>
                                      <div className={effectClass}>
                                        <span className={effectNameClass}>
                                          {mechanic.systemType}
                                        </span>
                                      </div>
                                      {mechanic.mechanicsText && (
                                        <div className={effectDetailsClass}>
                                          <div className={effectMechanicsClass}>
                                            {mechanic.mechanicsText}
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : null;
                    })()}
                  </>
                )}

              {/* Combined Effects Section */}
              {spell?.combinedEffects && spell.combinedEffects.length > 0 && (
                <div className="damage-effects" style={{ marginTop: '4px' }}>
                  <div className="damage-effects-section">
                    <div className="damage-effects-list">
                      {spell.combinedEffects.map((combo, index) => (
                        <div key={`combo-${index}`} className="damage-effect-item">
                          <div className="damage-effect">
                            <span className="damage-effect-name">
                              Combo{combo.name ? `: ${combo.name}` : ` ${index + 1}`}
                            </span>
                          </div>
                          {(combo.description || combo.effect) && (
                            <div className="damage-effect-details">
                              <div className="damage-effect-mechanics">
                                {combo.description || combo.effect}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Persistent Effect Configuration */}
              {spell?.persistentConfig?.isPersistent && (() => {
                const config = spell.persistentConfig;
                let text = '';
                if (config.persistentType === 'dot' && config.tickDamage) {
                  text = `${config.tickDamage} damage per tick`;
                  if (config.tickFrequency) text += `, ${config.tickFrequency.replace(/_/g, ' ')}`;
                  if (config.tickDuration) text += ` for ${config.tickDuration} round${config.tickDuration !== 1 ? 's' : ''}`;
                } else if (config.persistentType === 'hot' && config.tickHealing) {
                  text = `${config.tickHealing} healing per tick`;
                  if (config.tickFrequency) text += `, ${config.tickFrequency.replace(/_/g, ' ')}`;
                  if (config.tickDuration) text += ` for ${config.tickDuration} round${config.tickDuration !== 1 ? 's' : ''}`;
                } else if (config.persistentType === 'trigger') {
                  if (config.triggerCondition) text += `Triggers on ${config.triggerCondition.replace(/_/g, ' ')}`;
                  if (config.triggerEffect) text += `${text ? ', ' : ''}causes ${config.triggerEffect.replace(/_/g, ' ')}`;
                }
                return text ? (
                  <div className="damage-effects" style={{ marginTop: '4px' }}>
                    <div className="damage-effects-section">
                      <div className="damage-effects-list">
                        <div className="damage-effect-item">
                          <div className="damage-effect">
                            <span className="damage-effect-name">Persistent Effect</span>
                          </div>
                          <div className="damage-effect-details">
                            <div className="damage-effect-mechanics">{text}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Buff/Debuff Trigger Chains */}
              {spell?.triggerConfig?.buffDebuffTriggers && (() => {
                const bdt = spell.triggerConfig.buffDebuffTriggers;
                const chains = [];
                for (const [effectType, chainData] of Object.entries(bdt)) {
                  if (chainData.triggersEffect) {
                    const sourceName = effectType.charAt(0).toUpperCase() + effectType.slice(1);
                    const targetName = chainData.triggersEffect.replace(/_/g, ' ');
                    chains.push({ source: sourceName, target: targetName });
                  }
                }
                if (chains.length === 0) return null;
                return (
                  <div className="damage-effects" style={{ marginTop: '4px' }}>
                    <div className="damage-effects-section">
                      <div className="damage-effects-list">
                        {chains.map((chain, i) => (
                          <div key={`chain-${i}`} className="damage-effect-item">
                            <div className="damage-effect">
                              <span className="damage-effect-name">Trigger Chain</span>
                            </div>
                            <div className="damage-effect-details">
                              <div className="damage-effect-mechanics">
                                <span style={{ color: '#ff8c00' }}>{chain.source}</span>
                                {" â†’ "}
                                <span style={{ color: '#6495ED' }}>{chain.target}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Mechanics Available Effects (for card-based mechanics) */}
              {spell?.mechanicsAvailableEffects && spell.mechanicsAvailableEffects.length > 0 && (
                <div style={{ marginTop: '4px', paddingLeft: '4px' }}>
                  <span style={{ fontSize: '0.8em', color: 'rgba(139,115,85,0.7)' }}>Available Effects: </span>
                  {spell.mechanicsAvailableEffects.map((effect, i) => (
                    <span key={effect.id || i} className="targeting-badge" style={{
                      marginLeft: '4px', fontSize: '0.7em',
                      background: 'rgba(255,215,0,0.1)', border: '1px solid rgba(255,215,0,0.3)',
                      borderRadius: '3px', color: '#DAA520', padding: '1px 5px'
                    }}>
                      {effect.name}
                    </span>
                  ))}
                </div>
              )}



              {/* Duration (if not instant) - exclude CHANNELED, ZONE, BUFF, and DEBUFF which show duration in their effect sections */}
              {((spell?.durationType && spell.durationType !== 'instant') ||
                (spell?.durationConfig?.durationType && spell.durationConfig.durationType !== 'instant')) &&
               (!spell?.spellType || !['CHANNELED', 'ZONE'].includes(spell.spellType)) &&
               (!spell?.effectTypes?.includes('buff') && !spell?.effectTypes?.includes('debuff')) ? (
                <div className="unified-spell-stat">
                  <span className="unified-stat-label">Duration:</span>
                  <span className="unified-stat-value">
                    {formatDuration()}
                  </span>
                </div>
              ) : null}

              {/* Buff Effects Section */}
              {(() => {
                const hasBuffType = spell?.effectTypes?.includes('buff');
                const hasBuffConfig = spell?.buffConfig;
                const hasEffectsBuff = spell?.effects?.buff || spellProp?.effects?.buff;
                
                // Check for buffConfig with actual content
                const hasStatModifiers = hasBuffConfig && Array.isArray(spell?.buffConfig?.statModifiers) && spell.buffConfig.statModifiers.length > 0;
                const hasStatusEffects = hasBuffConfig && Array.isArray(spell?.buffConfig?.statusEffects) && spell.buffConfig.statusEffects.length > 0;
                const hasEffectsArray = hasBuffConfig && Array.isArray(spell?.buffConfig?.effects) && spell.buffConfig.effects.length > 0;
                const hasDurationOnly = hasBuffConfig && (spell?.buffConfig?.duration || spell?.buffConfig?.durationType || spell?.buffConfig?.durationValue) && !hasStatModifiers && !hasStatusEffects && !hasEffectsArray;
                
                const hasAnyBuffConfiguration = hasStatModifiers || hasStatusEffects || hasEffectsArray;
                
                // Check for legacy effects.buff format with actual content
                const legacyBuff = hasEffectsBuff || spellProp?.effects?.buff;
                const hasLegacyResistance = legacyBuff?.resistance;
                const hasLegacyTemporaryHP = legacyBuff?.temporaryHP;
                const hasLegacyImmunity = legacyBuff?.immunity;
                const hasLegacyDamageRedirection = legacyBuff?.damageRedirection;
                const hasLegacyActionPoints = legacyBuff?.actionPoints;
                const hasLegacyAttackBonus = legacyBuff?.attackBonus;
                const hasLegacyStatModifiers = legacyBuff?.statModifiers && typeof legacyBuff.statModifiers === 'object' && !Array.isArray(legacyBuff.statModifiers) && Object.keys(legacyBuff.statModifiers).length > 0;
                
                const hasLegacyBuff = hasLegacyResistance || hasLegacyTemporaryHP || hasLegacyImmunity || 
                                     hasLegacyDamageRedirection || hasLegacyActionPoints || hasLegacyAttackBonus ||
                                     hasLegacyStatModifiers;

                // Don't render if no actual buff content exists (don't render empty sections)
                // Only render if we have buff type OR actual buff configuration OR legacy buff data
                if (!hasBuffType && !hasAnyBuffConfiguration && !hasLegacyBuff) return null;

                // Helper functions for triggers and formulas (accessible to both buff and debuff processing)
                const getBuffTriggersAndFormulas = (effectSubType) => {
                  const baseType = effectSubType.includes('_') ? effectSubType.split('_')[0] : effectSubType;
                  const effectTriggers = spell?.triggerConfig?.effectTriggers?.[effectSubType] ||
                                         spell?.triggerConfig?.effectTriggers?.[baseType];
                  const conditionalFormulas = spell?.triggerConfig?.conditionalEffects?.[effectSubType]?.conditionalFormulas ||
                                             spell?.triggerConfig?.conditionalEffects?.[baseType]?.conditionalFormulas;
                  const hasConditionals = conditionalFormulas && Object.keys(conditionalFormulas).length > 0 && Object.keys(conditionalFormulas).some(k => k !== 'default');

                  if (!hasConditionals) return null;

                  const formulas = Object.entries(conditionalFormulas)
                    .filter(([triggerId]) => triggerId !== 'default')
                    .map(([triggerId, formula]) => {
                      const trigger = effectTriggers?.compoundTriggers?.find(t => t.id === triggerId);
                      return { triggerId, formula, triggerName: trigger ? formatTriggerText(trigger) : triggerId };
                    });

                  return { formulas };
                };

                // Process buff effects first to check if we have anything to show
                const buffData = spell?.buffConfig;
                const legacyBuffData = spell?.effects?.buff || spellProp?.effects?.buff;

                // Early return if no buff data at all
                if (!buffData && !hasBuffType && !legacyBuffData) return null;

                // Pre-process effects to determine if section should render
                const buffEffectsToRender = [];

                // Handle legacy effects.buff format
                // Check both normalized spell and original prop
                const actualLegacyBuff = legacyBuffData || spellProp?.effects?.buff;
                if (actualLegacyBuff && (!buffData || (buffData && !buffData.statModifiers?.length && !buffData.statusEffects?.length && !buffData.effects?.length))) {
                  // Handle resistance buffs
                  if (actualLegacyBuff.resistance) {
                            const resistanceType = actualLegacyBuff.resistance.type || 'all_damage';
                            const duration = actualLegacyBuff.resistance.duration || spell?.durationConfig?.duration || spell?.duration || 1;
                            const durationUnit = actualLegacyBuff.resistance.durationUnit || spell?.durationConfig?.durationUnit || spell?.durationConfig?.durationUnit || 'minutes';
                            const durationText = `${duration} ${durationUnit}`;
                            
                            const resistanceName = resistanceType === 'all_damage' ? 'All Damage' :
                                                   resistanceType === 'physical_damage' ? 'Physical Damage' :
                                                   resistanceType.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                            
                            buffEffectsToRender.push({
                              name: 'Resistance',
                              description: durationText,
                              mechanicsText: `Grants resistance to ${resistanceName}`
                            });
                          }
                          
                          // Handle temporary HP
                          if (actualLegacyBuff.temporaryHP) {
                            const formula = actualLegacyBuff.temporaryHP.formula || '1d6';
                            const duration = actualLegacyBuff.temporaryHP.duration || spell?.durationConfig?.duration || spell?.duration || 1;
                            const durationUnit = actualLegacyBuff.temporaryHP.durationUnit || spell?.durationConfig?.durationUnit || 'minutes';
                            const durationText = `${duration} ${durationUnit}`;
                            
                            buffEffectsToRender.push({
                              name: 'Temporary HP',
                              description: durationText,
                              mechanicsText: `Grants ${cleanFormula(formula)} temporary hit points`
                            });
                          }
                          
                          // Handle immunity
                          if (actualLegacyBuff.immunity) {
                            const immunityType = actualLegacyBuff.immunity.type || 'all_damage';
                            const duration = actualLegacyBuff.immunity.duration || spell?.durationConfig?.duration || spell?.duration || 1;
                            const durationUnit = actualLegacyBuff.immunity.durationUnit || spell?.durationConfig?.durationUnit || 'minutes';
                            const durationText = `${duration} ${durationUnit}`;
                            
                            const immunityName = immunityType === 'all_damage' ? 'All Damage' :
                                                immunityType.replace(/_/g, ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                            
                            buffEffectsToRender.push({
                              name: 'Immunity',
                              description: durationText,
                              mechanicsText: `Grants immunity to ${immunityName}`
                            });
                          }
                          
                          // Handle action points
                          if (actualLegacyBuff.actionPoints) {
                            const bonus = actualLegacyBuff.actionPoints.bonus || 1;
                            const duration = actualLegacyBuff.actionPoints.duration || spell?.durationConfig?.duration || spell?.duration || 1;
                            const durationUnit = actualLegacyBuff.actionPoints.durationUnit || spell?.durationConfig?.durationUnit || 'minutes';
                            const durationText = `${duration} ${durationUnit}`;
                            
                            buffEffectsToRender.push({
                              name: 'Action Points',
                              description: durationText,
                              mechanicsText: `Grants +${bonus} action point${bonus > 1 ? 's' : ''}`
                            });
                          }
                          
                  // Handle attack bonus
                  if (actualLegacyBuff.attackBonus) {
                    const formula = actualLegacyBuff.attackBonus.formula || '2d6';
                    const duration = actualLegacyBuff.attackBonus.duration || spell?.durationConfig?.duration || spell?.duration || 1;
                    const durationUnit = actualLegacyBuff.attackBonus.durationUnit || spell?.durationConfig?.durationUnit || 'minutes';
                    const durationText = `${duration} ${durationUnit}`;
                    
                    buffEffectsToRender.push({
                      name: 'Attack Bonus',
                      description: durationText,
                      mechanicsText: `Adds ${cleanFormula(formula)} to melee attacks`
                    });
                  }
                  
                  // Handle armor buff
                  if (actualLegacyBuff.armor) {
                    const acBonus = actualLegacyBuff.armor;
                    const duration = actualLegacyBuff.duration || spell?.durationConfig?.duration || spell?.duration || 1;
                    const durationUnit = actualLegacyBuff.durationUnit || spell?.durationConfig?.durationUnit || 'minutes';
                    const durationText = `${duration} ${durationUnit}`;
                    
                    buffEffectsToRender.push({
                      name: 'Armor',
                      description: durationText,
                      mechanicsText: `Grants +${acBonus} Armor`
                    });
                  }
                  
                  // Handle legacy statModifiers object (not array)
                  if (actualLegacyBuff.statModifiers && typeof actualLegacyBuff.statModifiers === 'object' && !Array.isArray(actualLegacyBuff.statModifiers)) {
                    const statEntries = Object.entries(actualLegacyBuff.statModifiers);
                    if (statEntries.length > 0) {
                      const statTexts = statEntries.map(([stat, value]) => {
                        const statName = stat.charAt(0).toUpperCase() + stat.slice(1);
                        return `+${value} ${statName}`;
                      });
                      const duration = actualLegacyBuff.duration || spell?.durationConfig?.duration || spell?.duration || 1;
                      const durationUnit = actualLegacyBuff.durationUnit || spell?.durationConfig?.durationUnit || 'minutes';
                      const durationText = `${duration} ${durationUnit}`;
                      
                      buffEffectsToRender.push({
                        name: 'Stat Enhancement',
                        description: durationText,
                        mechanicsText: statTexts.join(', ')
                      });
                    }
                  }
                  
                  // Handle damage redirection
                  if (actualLegacyBuff.damageRedirection) {
                    const from = actualLegacyBuff.damageRedirection.from || 'allies';
                    const to = actualLegacyBuff.damageRedirection.to || 'self';
                    const duration = actualLegacyBuff.damageRedirection.duration || spell?.durationConfig?.duration || spell?.duration || 1;
                    const durationUnit = actualLegacyBuff.damageRedirection.durationUnit || spell?.durationConfig?.durationUnit || 'minutes';
                    const durationText = `${duration} ${durationUnit}`;
                    
                    buffEffectsToRender.push({
                      name: 'Damage Redirection',
                      description: durationText,
                      mechanicsText: `Redirects damage from ${from} to ${to}`
                    });
                  }

                  // Handle generic buff types (stealth_bonus, speed_bonus, etc.)
                  if (actualLegacyBuff.type && !actualLegacyBuff.resistance && !actualLegacyBuff.temporaryHP && !actualLegacyBuff.immunity && !actualLegacyBuff.damageRedirection && !actualLegacyBuff.actionPoints && !actualLegacyBuff.attackBonus && !actualLegacyBuff.armor && !actualLegacyBuff.statModifiers) {
                    const buffTypeLabels = {
                      'stealth_bonus': 'Stealth Bonus',
                      'speed_bonus': 'Speed Bonus',
                      'damage_bonus': 'Damage Bonus',
                      'defense_bonus': 'Defense Bonus',
                      'initiative_bonus': 'Initiative Bonus',
                      'perception_bonus': 'Perception Bonus',
                      'saving_throw_bonus': 'Saving Throw Bonus',
                      'skill_bonus': 'Skill Bonus',
                      'flight': 'Flight',
                      'water_breathing': 'Water Breathing',
                      'water_walking': 'Water Walking',
                      'darkvision': 'Darkvision',
                      'truesight': 'Truesight',
                      'telepathy': 'Telepathy',
                      'ethereal': 'Ethereal',
                      'freedom_of_movement': 'Freedom of Movement'
                    };

                    const buffLabel = buffTypeLabels[actualLegacyBuff.type] || actualLegacyBuff.type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                    const duration = actualLegacyBuff.duration || spell?.durationConfig?.durationAmount || spell?.durationConfig?.duration || 1;
                    const durationUnit = actualLegacyBuff.durationUnit || spell?.durationConfig?.durationType || 'minutes';
                    const unitMap = { 'rounds': 'rounds', 'minutes': 'min', 'hours': 'hrs', 'days': 'days' };
                    const durationText = `${duration} ${unitMap[durationUnit] || durationUnit}`;

                    let mechanicsText = `Grants ${buffLabel.toLowerCase()}`;
                    if (actualLegacyBuff.value) {
                      mechanicsText += ` +${actualLegacyBuff.value}`;
                    }

                    buffEffectsToRender.push({
                      name: buffLabel,
                      description: durationText,
                      mechanicsText: mechanicsText
                    });
                  }
                }
                
                // Handle buffConfig.effects array (new structure with statModifier)
                if (buffData?.effects && Array.isArray(buffData.effects) && buffData.effects.length > 0) {
                  const statEffects = [];
                  const otherEffects = [];

                  buffData.effects.forEach(effect => {
                    // Use mechanicsText if provided, otherwise build from stat modifier
                    let mechanicsText = effect.mechanicsText || '';
                    
                    // Check if this effect has statModifier (stat enhancement) and no mechanicsText provided
                    if (!mechanicsText && effect.statModifier) {
                      const statMod = effect.statModifier;
                      const statMap = GLOBAL_STAT_MAP;

                      // Get stat name from map, or format the stat name properly
                      const rawStat = statMod.stat?.toLowerCase() || '';
                      const statName = statMap[rawStat] ||
                                       (statMod.stat ? statMod.stat.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Stat');
                      const magnitude = statMod.magnitude || 0;
                      const magnitudeType = statMod.magnitudeType || 'flat';
                      const isDiceFormula = magnitudeType === 'dice' && statMod.formula;
                      const typeText = magnitudeType === 'percentage' ? '%' : '';

                      // Check if this is a resistance stat (from statModifier category or stat name)
                      const statNameLower = statName.toLowerCase();
                      const isResistanceStat = statMod.category === 'resistance' ||
                                            statNameLower.includes('resistance') ||
                                            statNameLower.includes('resist') ||
                                            statNameLower.includes('all_resistances') ||
                                            statMod.stat?.toLowerCase().includes('resistance') ||
                                            statMod.stat?.toLowerCase().includes('resist');

                      // Check if description already contains the stat modifier information
                      const description = effect.description || '';
                      const descriptionLower = description.toLowerCase();
                      
                      // Normalize stat names for comparison (handle spaces, camelCase, etc.)
                      const normalizedStatName = statNameLower.replace(/\s+/g, '').replace(/([a-z])([A-Z])/g, '$1 $2').toLowerCase();
                      const normalizedDescription = descriptionLower.replace(/\s+/g, ' ');
                      
                      // Special handling for rageGeneration - if description mentions rage generation, suppress mechanicsText
                      const isRageGeneration = statNameLower.includes('ragegeneration') || statNameLower.includes('rage generation');
                      const descriptionMentionsRage = descriptionLower.includes('rage') && (descriptionLower.includes('generate') || descriptionLower.includes('generation'));
                      
                      // Check for patterns like "+2 armor", "armor +2", "+2 armor class", "grants +2 armor", etc.
                      const hasMagnitudeAndStat = (
                        descriptionLower.includes(`+${magnitude}`) || 
                        descriptionLower.includes(`${magnitude}${typeText.replace('%', '')}`) ||
                        descriptionLower.includes(`+ ${magnitude}`) ||
                        descriptionLower.includes(`- +${magnitude}`) // Handle "- +1 Rage Generation" format
                      ) && (
                        descriptionLower.includes(statNameLower) ||
                        descriptionLower.includes(normalizedStatName) ||
                        // Handle stat names with spaces (e.g., "Rage Generation" vs "RageGeneration")
                        (statNameLower.includes('ragegeneration') && descriptionLower.includes('rage generation')) ||
                        (statNameLower.includes('ragegeneration') && descriptionLower.includes('ragegeneration')) ||
                        (statNameLower === 'armor' && (descriptionLower.includes('armor class') || descriptionLower.includes('armor')))
                      );
                      
                      // Also check for percentage patterns
                      const hasPercentagePattern = magnitudeType === 'percentage' && 
                        descriptionLower.includes(`${magnitude}%`) &&
                        (descriptionLower.includes(statNameLower) || descriptionLower.includes(normalizedStatName));

                      // Generate formatted stat modifier text for display
                      // This ensures stat values are always visible even if description is flavor text
                      // Only build if mechanicsText wasn't already provided
                      if (!mechanicsText) {
                        // If description already clearly contains the stat modifier info, don't duplicate
                        const hasStatInDescription = hasMagnitudeAndStat || hasPercentagePattern;
                        
                        // For rage generation and similar special stats that are mentioned in description, suppress
                        const suppressMechanicsText = (isRageGeneration && descriptionMentionsRage) || hasStatInDescription;
                        
                        const advDis = getAdvantageDisadvantageText(statMod.stat || statMod.id, magnitude, statMod.magnitudeType);
                        if (advDis.isAdvDis) {
                          mechanicsText = advDis.text;
                        } else if (!suppressMechanicsText && !isResistanceStat) {
                          if (isDiceFormula) {
                            mechanicsText = cleanFormula(statMod.formula);
                          } else {
                            const sign = magnitude >= 0 ? '+' : '';
                            mechanicsText = `${sign}${cleanFormula(magnitude)}${typeText} ${statName}`;
                          }
                        } else if (hasStatInDescription) {
                          mechanicsText = (effect.description || '').trim().replace(/^-\s*/, '').trim();
                        }
                      }

                      // Strip leading dashes and whitespace from descriptions to prevent double dashes
                      let cleanDescription = (effect.description || '').trim();
                      // Remove leading dash followed by space or just dash
                      cleanDescription = cleanDescription.replace(/^-\s*/, '').trim();
                      
                      // For resistance stats, format with thematic description
                      if (isResistanceStat && magnitudeType === 'percentage') {
                        const percentage = Math.round(parseFloat(magnitude) || 0);
                        const damageType = statMod.resistanceType === 'general' ? 'all damage' : 
                                         statMod.stat?.replace(/_/g, ' ').toLowerCase() || 'damage';
                        
                        // Use thematic resistance description
                        let resistanceText = '';
                        if (percentage === 0) {
                          resistanceText = getThematicResistanceDescription('immune', damageType);
                        } else if (percentage === 25) {
                          resistanceText = getThematicResistanceDescription('highly_resistant', damageType);
                        } else if (percentage === 50) {
                          resistanceText = getThematicResistanceDescription('resistant', damageType);
                        } else if (percentage === 75) {
                          resistanceText = getThematicResistanceDescription('guarded', damageType);
                        } else {
                          resistanceText = `${damageType.charAt(0).toUpperCase() + damageType.slice(1)} resistance (takes ${percentage}% damage)`;
                        }
                        
                        // Use the thematic description if description doesn't already have it
                        if (!cleanDescription || (cleanDescription.length < 40 && (cleanDescription.toLowerCase().includes('resistance') || cleanDescription.toLowerCase().includes('damage reduction')))) {
                          cleanDescription = resistanceText;
                        }
                      }
                      
                      statEffects.push({
                        name: effect.name || statName,
                        description: cleanDescription,
                        mechanicsText: mechanicsText,
                        isResistance: isResistanceStat,
                        statModifier: statMod // Store for later grouping
                      });
                    } else {
                      // Handle other effect types (custom effects, status effects, etc.)
                      const duration = buffData.durationValue || buffData.duration || spell?.durationConfig?.duration || 1;
                      const durationType = buffData.durationType || spell?.durationConfig?.durationType || 'rounds';
                      let durationText = '';

                      if (durationType !== 'instant') {
                        if (durationType === 'permanent') {
                          durationText = 'Permanent';
                        } else if (durationType === 'rounds') {
                          durationText = `${duration} ${duration === 1 ? 'round' : 'rounds'}`;
                        } else if (durationType === 'turns') {
                          durationText = `${duration} ${duration === 1 ? 'turn' : 'turns'}`;
                        } else if (durationType === 'minutes') {
                          durationText = `${duration} ${duration === 1 ? 'minute' : 'minutes'}`;
                        } else if (durationType === 'hours') {
                          durationText = `${duration} ${duration === 1 ? 'hour' : 'hours'}`;
                        } else {
                          durationText = `${duration} ${durationType}`;
                        }
                      }

                      // Use mechanicsText if provided, otherwise use customDescription or description
                      // Strip leading dashes and whitespace from descriptions to prevent double dashes
                      let rawDescription = effect.mechanicsText || effect.customDescription || effect.description || '';
                      let cleanDescription = rawDescription.trim().replace(/^-\s*/, '').trim();
                      
                      // Use customName from buffConfig if effect doesn't have its own name
                      const defaultBuffName = buffData?.customName || spell?.buffConfig?.customName || 'Buff Effect';
                      
                      // Don't show duration as separate line - it should be in the description text
                      buffEffectsToRender.push({
                        name: effect.name || defaultBuffName,
                        description: '', // No separate duration line
                        mechanicsText: cleanDescription
                      });
                    }
                  });

                  // Consolidate stat effects into a single buff entry with duration
                  if (statEffects.length > 0) {
                    const durationValue = buffData.durationValue || buffData.duration;
                    let durationText = '';
                    if (durationValue && buffData.durationType !== 'instant') {
                      if (buffData.durationType === 'permanent') {
                        durationText = 'Permanent';
                      } else if (buffData.durationType === 'rounds') {
                        durationText = `${durationValue} ${durationValue === 1 ? 'Round' : 'Rounds'}`;
                      } else if (buffData.durationType === 'turns') {
                        durationText = `${durationValue} ${durationValue === 1 ? 'Turn' : 'Turns'}`;
                      } else if (buffData.durationType === 'rest') {
                        const restType = buffData.restType || 'long';
                        durationText = `Until ${restType.charAt(0).toUpperCase() + restType.slice(1)} Rest`;
                      } else if (buffData.durationType === 'minutes') {
                        durationText = `${durationValue} ${durationValue === 1 ? 'Minute' : 'Minutes'}`;
                      } else if (buffData.durationType === 'hours') {
                        durationText = `${durationValue} ${durationValue === 1 ? 'Hour' : 'Hours'}`;
                      } else if (buffData.durationType === 'time' && durationValue) {
                        const unit = buffData.durationUnit || 'rounds';
                        durationText = `${durationValue} ${unit.charAt(0).toUpperCase() + unit.slice(1)}`;
                      } else if (durationValue) {
                        durationText = `${durationValue} Rounds`;
                      }
                    }
                    if (buffData.concentrationRequired && durationText) {
                      durationText += ' (Concentration)';
                    }
                    if (buffData.durationType === 'permanent') {
                      if (buffData.canBeDispelled === false) {
                        durationText += ' (Cannot be dispelled)';
                      } else if (buffData.canBeDispelled === true) {
                        durationText += ' (Dispellable)';
                      }
                    }

                    const statMechanics = statEffects
                      .map(effect => effect.mechanicsText || effect.description)
                      .filter(Boolean)
                      .join(', ');

                    let mechanicsText = statMechanics;

                    // If this is a progressive buff, show stage-by-stage stat modifiers
                    if (buffData.isProgressive && buffData.progressiveStages && buffData.progressiveStages.length > 0) {
                      const getTriggerUnit = () => {
                        const durationType = buffData?.durationType || 'rounds';
                        if (durationType === 'time') {
                          return buffData?.durationUnit || 'rounds';
                        } else if (durationType === 'rest') {
                          return buffData?.restType === 'short' ? 'short rest' : 'long rest';
                        } else if (durationType === 'permanent') {
                          return 'permanent';
                        }
                        return 'round';
                      };

                      const triggerUnit = getTriggerUnit();
                      const unitLabel = triggerUnit === 'round' ? 'Round' :
                                        triggerUnit === 'turn' ? 'Turn' :
                                        triggerUnit.charAt(0).toUpperCase() + triggerUnit.slice(1);

                      const progressiveStagesText = buffData.progressiveStages.map((stage, stageIndex) => {
                        const triggerAt = stage.triggerAt || (stageIndex + 1);
                        const stageStatTexts = stage.statModifiers?.map(stat => {
                          const rawId = stat.id?.toLowerCase() || '';
                          const statName = stat.name || GLOBAL_STAT_MAP[rawId] ||
                            (stat.id ? stat.id.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Stat');
                          const value = Number(stat.magnitude || stat.value || 0);
                          const sign = value >= 0 ? '+' : '';
                          const typeText = stat.magnitudeType === 'percentage' ? '%' : '';
                          return `${sign}${value}${typeText} ${statName}`;
                        }).join(', ') || '';

                        if (!stageStatTexts) return null;
                        return `${unitLabel} ${triggerAt}: ${stageStatTexts}`;
                      }).filter(Boolean).join(' â†’ ');

                      if (progressiveStagesText) {
                        mechanicsText = progressiveStagesText;
                      }
                    }

                    const baseName = buffData?.customName || spell?.buffConfig?.customName || 'Buff Effect';
                    buffEffectsToRender.push({
                      name: baseName,
                      description: durationText,
                      mechanicsText: mechanicsText
                    });
                  }
                  
                  // Add other effects (non-statModifier effects)
                  otherEffects.forEach(effect => {
                    // Use customName from buffConfig if effect doesn't have its own name
                    const otherDefaultName = buffData?.customName || spell?.buffConfig?.customName || 'Buff Effect';
                    buffEffectsToRender.push({
                      name: effect.name || otherDefaultName,
                      description: effect.description,
                      mechanicsText: effect.mechanicsText
                    });
                  });
                  
                  // Duration is now shown in the description field (cursive format)
                  // NOT appended to the name header to avoid duplication
                }

                // Handle stat modifiers with proper formatting - consolidate into single block
                // Only process statModifiers if we haven't already processed effects array (effects array takes priority)
                if (buffData?.statModifiers?.length > 0 && (!buffData?.effects || buffData.effects.length === 0)) {
                  const statModifierTexts = [];

                  buffData.statModifiers.forEach(modifier => {
                            // Comprehensive stat name mapping
                            const statMap = {
                              'strength': 'Strength', 'agility': 'Agility', 'constitution': 'Constitution',
                              'intelligence': 'Intelligence', 'spirit': 'Spirit', 'charisma': 'Charisma',
                              'str': 'Strength', 'agi': 'Agility', 'con': 'Constitution',
                              'int': 'Intelligence', 'spi': 'Spirit', 'spir': 'Spirit', 'cha': 'Charisma',
                              'speed': 'Speed', 'attack': 'Attack', 'damage': 'Damage', 'crit_range': 'Critical Range', 'crit_multiplier': 'Critical Multiplier', 'attackdamagebonus': 'Attack and Damage', 'attackDamageBonus': 'Attack and Damage', 'attack_damage_bonus': 'Attack and Damage', 'maxhitpoints': 'Maximum Hit Points', 'max_hit_points': 'Maximum Hit Points', 'hitpoints': 'Hit Points',
                              'hp_regen': 'Health Regeneration', 'mp_regen': 'Mana Regeneration',
                              'healing_power': 'Healing Power', 'initiative': 'Initiative', 'lifesteal': 'Lifesteal',
                              'damage_reflection': 'Damage Reflection', 'actionpoints': 'Action Points',
                              'action_points': 'Action Points', 'damagereduction': 'Damage Reduction',
                              'damage_reduction': 'Damage Reduction', 'healingperkill': 'Healing Per Kill',
                              'healing_per_kill': 'Healing Per Kill', 'ragegeneration': 'Rage Generation',
                              'rage_generation': 'Rage Generation', 'rage generation': 'Rage Generation', 'all_resistances': 'All Resistances',
                              'all_primary_stats': 'All Primary Stats'
                            };

                            // Use the correct property names: name/id for stat, magnitude for value, magnitudeType for percentage
                            const rawId = modifier.id?.toLowerCase() || '';
                            let statName = modifier.name || statMap[rawId] || 
                                          (modifier.id ? modifier.id.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Stat');

                            // Check for incomplete stat names and show warning
                            const hasIncompleteName = !modifier.name || (statName.toLowerCase().includes('stat') && !statName.toLowerCase().includes('strength') && !statName.toLowerCase().includes('agility'));
                            if (hasIncompleteName) {
                              statName = 'INCOMPLETE: Specify stat name';
                            }

                            const value = modifier.magnitude || modifier.value || 0;
                            const sign = value >= 0 ? '+' : '';
                            const typeText = modifier.magnitudeType === 'percentage' ? '%' : '';

                            // Check if this is a resistance stat
                            const modifierName = (modifier.name || modifier.id || '').toLowerCase();
                            const isResistanceStat = modifier.category === 'resistance' ||
                                                    modifierName.includes('resistance') ||
                                                    modifierName.includes('resist') ||
                                                    modifierName.includes('ember') ||
                                                    modifierName.includes('rime') ||
                                                    modifierName.includes('storm') ||
                                                    modifierName.includes('blight') ||
                                                    modifierName.includes('blight') ||
                                                    modifierName.includes('blight') ||
                                                    modifierName.includes('ember') ||
                                                    modifierName.includes('wyrd') ||
                                                    modifierName.includes('storm') ||
                                                    modifierName.includes('arcane') ||
                                                    modifierName.includes('physical') ||
                                                    modifierName.includes('physical') ||
                                                    modifierName.includes('physical') ||
                                                    modifierName.includes('physical');

                            if (isResistanceStat) {
                              // Handle resistance stats with thematic descriptions
                              const percentage = Math.round(parseFloat(value) || 0);
                              const damageType = extractDamageTypeFromResistanceName(modifier.name || modifier.id);

                              if (percentage === -200) {
                                statModifierTexts.push(getThematicResistanceDescription('vampiric', damageType));
                              } else if (percentage === -100) {
                                statModifierTexts.push(getThematicResistanceDescription('absorbing', damageType));
                              } else if (percentage === -50) {
                                statModifierTexts.push(getThematicResistanceDescription('draining', damageType));
                              } else if (percentage === -25) {
                                statModifierTexts.push(getThematicResistanceDescription('siphoning', damageType));
                              } else if (percentage === 0) {
                                statModifierTexts.push(getThematicResistanceDescription('immune', damageType));
                              } else if (percentage === 25) {
                                statModifierTexts.push(getThematicResistanceDescription('highly_resistant', damageType));
                              } else if (percentage === 50) {
                                statModifierTexts.push(getThematicResistanceDescription('resistant', damageType));
                              } else if (percentage === 75) {
                                statModifierTexts.push(getThematicResistanceDescription('guarded', damageType));
                              } else if (percentage === 100) {
                                statModifierTexts.push(getThematicResistanceDescription('nullified', damageType));
                              } else if (percentage === 125) {
                                statModifierTexts.push(getThematicResistanceDescription('susceptible', damageType));
                              } else if (percentage === 150) {
                                statModifierTexts.push(getThematicResistanceDescription('exposed', damageType));
                              } else if (percentage === 200) {
                                statModifierTexts.push(getThematicResistanceDescription('vulnerable', damageType));
                              } else {
                                // Fallback for other percentages
                                if (percentage > 100) {
                                  statModifierTexts.push(`Increased ${damageType} vulnerability (takes ${percentage}% damage)`);
                                } else if (percentage < 0) {
                                  statModifierTexts.push(`Absorbs ${damageType} damage (heals for ${Math.abs(percentage)}% of damage taken)`);
                                } else {
                                  statModifierTexts.push(`${damageType.charAt(0).toUpperCase() + damageType.slice(1)} resistance (takes ${percentage}% damage)`);
                                }
                              }
                            } else {
                              const advDis = getAdvantageDisadvantageText(modifier.stat || modifier.id, value, modifier.magnitudeType);
                              if (advDis.isAdvDis) {
                                statModifierTexts.push(advDis.text);
                              } else if (modifier.stat === 'damage_reduction' || modifierName.includes('damage_reduction') || modifierName.includes('damage reduction')) {
                                if (modifier.magnitudeType === 'dice' && modifier.formula) {
                                  statModifierTexts.push(`Reduces incoming damage by ${modifier.formula}`);
                                } else {
                                  statModifierTexts.push(`Reduces incoming damage by ${value}`);
                                }
                              } else {
                                // Simple formatting for all other stats
                                statModifierTexts.push(`${sign}${value}${typeText} ${statName}`);
                              }
                            }
                          });

                          if (statModifierTexts.length > 0) {
                            let mechanicsText = statModifierTexts.join(', ');

                            // Create duration text for description line
                            let durationText = '';
                            const durationValue = buffData.durationValue || buffData.duration;
                            if (durationValue && buffData.durationType !== 'instant') {
                              if (buffData.durationType === 'permanent') {
                                durationText = 'Permanent';
                              } else if (buffData.durationType === 'rounds') {
                                durationText = `${durationValue} ${durationValue === 1 ? 'Round' : 'Rounds'}`;
                              } else if (buffData.durationType === 'turns') {
                                durationText = `${durationValue} ${durationValue === 1 ? 'Turn' : 'Turns'}`;
                              } else if (buffData.durationType === 'rest') {
                                const restType = buffData.restType || 'long';
                                durationText = `Until ${restType.charAt(0).toUpperCase() + restType.slice(1)} Rest`;
                              } else if (buffData.durationType === 'minutes') {
                                durationText = `${durationValue} ${durationValue === 1 ? 'Minute' : 'Minutes'}`;
                              } else if (buffData.durationType === 'hours') {
                                durationText = `${durationValue} ${durationValue === 1 ? 'Hour' : 'Hours'}`;
                              } else if (buffData.durationType === 'time' && durationValue) {
                                const unit = buffData.durationUnit || 'rounds';
                                const capitalizedUnit = unit.charAt(0).toUpperCase() + unit.slice(1);
                                durationText = `${durationValue} ${capitalizedUnit}`;
                              } else if (durationValue) {
                                durationText = `${durationValue} Rounds`;
                              }
                            }

                            // Add concentration requirement if applicable
                            if (buffData.concentrationRequired && durationText) {
                              durationText += ' (Concentration)';
                            }

                            // Add dispellable information for permanent effects
                            if (buffData.durationType === 'permanent') {
                              if (buffData.canBeDispelled === false) {
                                durationText += ' (Cannot be dispelled)';
                              } else if (buffData.canBeDispelled === true) {
                                durationText += ' (Dispellable)';
                              }
                            }

                            // Check if this is a progressive buff
                            const isProgressive = buffData.isProgressive && buffData.progressiveStages && buffData.progressiveStages.length > 0;

                            // For progressive effects, format description and mechanics
                            let finalDescription = durationText || 'Stat bonus';
                            // For progressive effects, include stat modifiers in description (e.g., "3 Rounds +2 Strength")
                            if (isProgressive && statModifierTexts.length > 0) {
                              finalDescription = durationText ? `${durationText} ${statModifierTexts.join(' ')}` : statModifierTexts.join(' ');
                            }
                            
                            let finalMechanicsText = mechanicsText;
                            
                            if (isProgressive && buffData.progressiveStages && buffData.progressiveStages.length > 0) {
                              // Format progressive stages as compact text (similar to progressive HoT)
                              const getTriggerUnit = () => {
                                const durationType = buffData?.durationType || 'rounds';
                                if (durationType === 'time') {
                                  return buffData?.durationUnit || 'rounds';
                                } else if (durationType === 'rest') {
                                  return buffData?.restType === 'short' ? 'short rest' : 'long rest';
                                } else if (durationType === 'permanent') {
                                  return 'permanent';
                                }
                                return 'round';
                              };

                              const triggerUnit = getTriggerUnit();
                              const unitLabel = triggerUnit === 'round' ? 'Round' :
                                               triggerUnit === 'turn' ? 'Turn' :
                                               triggerUnit.charAt(0).toUpperCase() + triggerUnit.slice(1);

                              // Format each stage with stat modifiers - comprehensive stat name mapping
                              const statMap = {
                                'strength': 'Strength', 'agility': 'Agility', 'constitution': 'Constitution',
                                'intelligence': 'Intelligence', 'spirit': 'Spirit', 'charisma': 'Charisma',
                                'str': 'Strength', 'agi': 'Agility', 'con': 'Constitution',
                                'int': 'Intelligence', 'spi': 'Spirit', 'spir': 'Spirit', 'cha': 'Charisma',
                                'speed': 'Speed', 'attack': 'Attack', 'damage': 'Damage', 'crit_range': 'Critical Range', 'crit_multiplier': 'Critical Multiplier', 'attackdamagebonus': 'Attack and Damage', 'attackDamageBonus': 'Attack and Damage', 'attack_damage_bonus': 'Attack and Damage', 'maxhitpoints': 'Maximum Hit Points', 'max_hit_points': 'Maximum Hit Points', 'hitpoints': 'Hit Points',
                                'hp_regen': 'Health Regeneration', 'mp_regen': 'Mana Regeneration',
                                'healing_power': 'Healing Power', 'initiative': 'Initiative', 'lifesteal': 'Lifesteal',
                                'damage_reflection': 'Damage Reflection', 'actionpoints': 'Action Points',
                                'action_points': 'Action Points', 'damagereduction': 'Damage Reduction',
                                'damage_reduction': 'Damage Reduction', 'all_resistances': 'All Resistances',
                                'all_primary_stats': 'All Primary Stats', 'ragegeneration': 'Rage Generation',
                                'rage_generation': 'Rage Generation', 'rage generation': 'Rage Generation'
                              };

                              const progressiveStagesText = buffData.progressiveStages.map((stage, stageIndex) => {
                                const triggerAt = stage.triggerAt || (stageIndex + 1);
                                
                                // Format stat modifiers with actual numbers for this stage
                                const stageStatTexts = stage.statModifiers?.map(stat => {
                                  const rawId = stat.id?.toLowerCase() || '';
                                  const statName = stat.name || statMap[rawId] || 
                                                  (stat.id ? stat.id.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Stat');
                                  const value = Number(stat.magnitude || stat.value || 0);
                                  const sign = value >= 0 ? '+' : '';
                                  const typeText = stat.magnitudeType === 'percentage' ? '%' : '';
                                  return `${sign}${value}${typeText} ${statName}`;
                                }).join(', ') || '';

                                // Only show stages that have stat modifiers configured
                                if (!stageStatTexts) return null;
                                return `${unitLabel} ${triggerAt}: ${stageStatTexts}`;
                              }).filter(Boolean).join(' â†’ ');

                              finalMechanicsText = progressiveStagesText || mechanicsText;
                            }

                            // Use customName from buffConfig if provided
                            const baseName = buffData?.customName || spell?.buffConfig?.customName || 'Buff Effect';
                            // Show duration in description for all buff effects
                            buffEffectsToRender.push({
                              name: baseName,
                              description: durationText,
                              mechanicsText: finalMechanicsText || (isProgressive ? '' : mechanicsText)
                            });
                          }
                }

              // Handle status effects with enhanced formatting
              if (buffData?.statusEffects?.length > 0) {
                buffData.statusEffects.forEach(status => {
                  // Format status effect based on its configuration
                  const formattedEffect = formatStatusEffectDetails(status, 'buff');

                  buffEffectsToRender.push({
                    name: formattedEffect.name,
                    description: formattedEffect.description,
                    mechanicsText: formattedEffect.mechanicsText
                  });
                });
              }

              // Handle custom buffs with customDescription
              // Only add this fallback when no other buff effects were generated to avoid duplicate lines
              if (buffData?.buffType === 'custom' && buffData?.customDescription && buffEffectsToRender.length === 0) {
                const durationValue = buffData.durationValue || buffData.duration;
                const durationParts = [];
                
                if (durationValue && buffData.durationType !== 'instant') {
                  if (buffData.durationType === 'permanent') {
                    durationParts.push('Permanent');
                  } else if (buffData.durationType === 'rounds') {
                    durationParts.push(`${durationValue} ${durationValue === 1 ? 'round' : 'rounds'}`);
                  } else if (buffData.durationType === 'turns') {
                    durationParts.push(`${durationValue} ${durationValue === 1 ? 'turn' : 'turns'}`);
                  } else if (buffData.durationType === 'rest') {
                    const restType = buffData.restType || 'long';
                    durationParts.push(`Until ${restType.charAt(0).toUpperCase() + restType.slice(1)} Rest`);
                  } else if (buffData.durationType === 'minutes') {
                    durationParts.push(`${durationValue} ${durationValue === 1 ? 'minute' : 'minutes'}`);
                  } else if (buffData.durationType === 'hours') {
                    durationParts.push(`${durationValue} ${durationValue === 1 ? 'hour' : 'hours'}`);
                  } else if (buffData.durationType === 'time' && durationValue) {
                    const unit = buffData.durationUnit || 'rounds';
                    durationParts.push(`${durationValue} ${unit}`);
                  } else if (durationValue) {
                    durationParts.push(`${durationValue} rounds`);
                  }
                }

                if (buffData.concentrationRequired) {
                  durationParts.push('Concentration');
                }

                const durationText = durationParts.length > 0 ? `(${durationParts.join(' â€¢ ')})` : '';
                // Use customName from buffConfig if provided, otherwise fallback to 'Buff Effect'
                const baseName = buffData?.customName || spell?.buffConfig?.customName || 'Buff Effect';
                // Don't show duration as separate line - it's in the customDescription
                buffEffectsToRender.push({
                  name: baseName,
                  description: '', // No separate duration line
                  mechanicsText: buffData.customDescription
                });
              }
                // If spell has buff effect type but no config, show a basic effect with duration if available
                else if ((hasBuffType || legacyBuffData) && buffEffectsToRender.length === 0) {
                  let effectName = buffData?.customName || spell?.buffConfig?.customName || 'Buff Effect';
                  let durationDesc = '';

                  // Build duration description
                  if (buffData) {
                    const durationValue = buffData.durationValue || buffData.duration;
                    const durationParts = [];

                    if (durationValue && buffData.durationType !== 'instant') {
                      if (buffData.durationType === 'permanent') {
                        durationParts.push('Permanent');
                      } else if (buffData.durationType === 'rounds') {
                        durationParts.push(`${durationValue} ${durationValue === 1 ? 'round' : 'rounds'}`);
                      } else if (buffData.durationType === 'turns') {
                        durationParts.push(`${durationValue} ${durationValue === 1 ? 'turn' : 'turns'}`);
                      } else if (buffData.durationType === 'rest') {
                        const restType = buffData.restType || 'long';
                        durationParts.push(`Until ${restType.charAt(0).toUpperCase() + restType.slice(1)} Rest`);
                      } else if (buffData.durationType === 'minutes') {
                        durationParts.push(`${durationValue} ${durationValue === 1 ? 'minute' : 'minutes'}`);
                      } else if (buffData.durationType === 'hours') {
                        durationParts.push(`${durationValue} ${durationValue === 1 ? 'hour' : 'hours'}`);
                      } else if (buffData.durationType === 'time' && durationValue) {
                        const unit = buffData.durationUnit || 'rounds';
                        durationParts.push(`${durationValue} ${unit}`);
                      } else if (durationValue) {
                        durationParts.push(`${durationValue} rounds`);
                      }
                    }

                    if (buffData.concentrationRequired && durationParts.length > 0) {
                      durationParts.push('Concentration');
                    }

                    if (buffData.durationType === 'permanent') {
                      if (buffData.canBeDispelled === false) {
                        durationParts.push('Cannot be dispelled');
                      } else if (buffData.canBeDispelled === true) {
                        durationParts.push('Dispellable');
                      }
                    }

                    durationDesc = durationParts.join(', ');
                  }

                  buffEffectsToRender.push({
                    name: effectName,
                    description: durationDesc,
                    mechanicsText: buffData?.statModifiers?.length > 0 ? '' : 'No stats configured yet'
                  });
                }

              // Attach conditional formulas and targeting to buff effects
              const buffTriggers = getBuffTriggersAndFormulas('buff');
              const buffTargeting = formatEffectTargeting('buff');
              buffEffectsToRender.forEach(effect => {
                effect.conditionalFormulas = buffTriggers?.formulas || [];
                effect.targeting = buffTargeting;
              });

              // Early return if no effects to render - prevents empty blocks
              if (buffEffectsToRender.length === 0) return null;

              // Check for effect-specific triggers or required states for buffs
              const buffEffectTriggers = spell?.triggerConfig?.effectTriggers?.buff;
              const buffHasTriggers = buffEffectTriggers?.compoundTriggers?.length > 0;
              const buffHasRequiredState = false; // TODO: Add support for effect-specific required state

              return (
                <div className="healing-effects">
                  <div className="healing-effects-section">
                    {/* Show trigger/required state header if applicable */}
                    {(buffHasTriggers || buffHasRequiredState) && (
                      <div className="damage-effect-details" style={{ marginTop: '4px', paddingTop: '4px', borderTop: '1px solid rgba(139, 115, 85, 0.2)' }}>
                        {buffHasTriggers && buffEffectTriggers.compoundTriggers.length > 0 && (
                          <>
                            {buffEffectTriggers.compoundTriggers.map((trigger, idx) => (
                              <div key={idx} className="damage-effect-mechanics" style={{ fontSize: '0.9em', marginTop: idx > 0 ? '4px' : '0' }}>
                                <strong>{formatTriggerForConditionalDisplay(trigger)}</strong>
                              </div>
                            ))}
                          </>
                        )}
                      </div>
                    )}
                    <div className="healing-formula-line">
                      <div className="healing-effects-list">
                        {buffEffectsToRender.map((effect, index) => (
                          <div key={`buff-${index}`} className="healing-effect-item">
                            <div className="healing-effect">
                              <span className="healing-effect-name">
                                {effect.name}
                              </span>
                              {effect.description && effect.description !== effect.name && (
                                <span className="healing-effect-description">
                                  {" "}<span className="diamond-symbol">â—†</span>{" "}{effect.description}
                                </span>
                              )}
                              {/* Targeting/Range badges */}
                              {effect.targeting && (
                                <div className="healing-effect-targeting">
                                  {effect.targeting.range && (
                                    <span className="targeting-badge range-badge">
                                      {effect.targeting.range}
                                    </span>
                                  )}
                                  {effect.targeting.targeting && (
                                    <span className="targeting-badge targeting-info-badge">
                                      {effect.targeting.targeting}
                                    </span>
                                  )}
                                  {effect.targeting.restrictions && (
                                    <span className="targeting-badge restrictions-badge">
                                      {effect.targeting.restrictions}
                                    </span>
                                  )}
                                  {effect.targeting.propagation && (
                                    <span className="targeting-badge propagation-badge">
                                      {effect.targeting.propagation}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            {effect.mechanicsText && (
                              <div className="healing-effect-details">
                                <div className="healing-effect-mechanics">
                                  {effect.mechanicsText}
                                </div>
                              </div>
                            )}
                            {/* Conditional formulas */}
                            {effect.conditionalFormulas && effect.conditionalFormulas.length > 0 && (
                              <div className="healing-effect-details" style={{ marginTop: '4px', paddingTop: '4px', borderTop: '1px solid rgba(139, 115, 85, 0.2)' }}>
                                {effect.conditionalFormulas.map((cf, cfIndex) => {
                                  const triggerText = cf.triggerName.startsWith('When ') ? cf.triggerName.replace('When ', 'If ') : `If ${cf.triggerName}`;
                                  return (
                                    <div key={cfIndex} className="healing-effect-mechanics" style={{ fontSize: '0.9em', marginTop: cfIndex > 0 ? '4px' : '0' }}>
                                      <strong>{triggerText}:</strong> Enhanced effect
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
              })()}
              {/* Debuff Effects Section */}
              {(() => {
                const hasDebuffType = spell?.effectTypes?.includes('debuff');
                const hasDebuffConfig = spell?.debuffConfig;
                const hasAnyDebuffConfiguration = hasDebuffConfig && (
                  spell.debuffConfig.statPenalties?.length > 0 ||
                  spell.debuffConfig.statModifiers?.length > 0 ||
                  spell.debuffConfig.statusEffects?.length > 0 ||
                  spell.debuffConfig.effects?.length > 0 ||
                  spell.debuffConfig.duration ||
                  spell.debuffConfig.durationType ||
                  spell.debuffConfig.durationValue ||
                  spell.debuffConfig.difficultyClass ||
                  spell.debuffConfig.savingThrow ||
                  spell.debuffConfig.saveType ||
                  spell.debuffConfig.saveOutcome ||
                  spell.debuffConfig.magnitude
                );

                if (!hasAnyDebuffConfiguration) return null;

                const legacyDebuff = spell?.effects?.debuff || spellProp?.effects?.debuff;

                if (variant === 'rules' && spell?.description && (
                  spell.description.toLowerCase().includes('frailty') ||
                  spell.description.toLowerCase().includes('vulnerability') ||
                  spell.description.toLowerCase().includes('weakness')
                )) {
                } else if (variant === 'rules') {
                  return null;
                }

                return (
                  <div className="healing-effects">
                    <div className="healing-effects-section">
                      {(() => {
                        const debuffData = spell?.debuffConfig;
                        if (!debuffData && !hasDebuffType && !legacyDebuff) return null;

                        // Helper function for debuff triggers and formulas
                        const getDebuffTriggersAndFormulas = (effectSubType) => {
                          const baseType = effectSubType.includes('_') ? effectSubType.split('_')[0] : effectSubType;
                          const effectTriggers = spell?.triggerConfig?.effectTriggers?.[effectSubType] ||
                                                 spell?.triggerConfig?.effectTriggers?.[baseType];
                          const conditionalFormulas = spell?.triggerConfig?.conditionalEffects?.[effectSubType]?.conditionalFormulas ||
                                                     spell?.triggerConfig?.conditionalEffects?.[baseType]?.conditionalFormulas;
                          const hasConditionals = conditionalFormulas && Object.keys(conditionalFormulas).length > 0 && Object.keys(conditionalFormulas).some(k => k !== 'default');

                          if (!hasConditionals) return null;

                          const formulas = Object.entries(conditionalFormulas)
                            .filter(([triggerId]) => triggerId !== 'default')
                            .map(([triggerId, formula]) => {
                              const trigger = effectTriggers?.compoundTriggers?.find(t => t.id === triggerId);
                              return { triggerId, formula, triggerName: trigger ? formatTriggerText(trigger) : triggerId };
                            });

                          return { formulas };
                        };

                        const effects = [];

                        // Always show duration/save information if configured, even without stat penalties
                        const hasDurationConfig = debuffData && (
                          debuffData.durationType ||
                          debuffData.durationValue ||
                          debuffData.duration ||
                          debuffData.savingThrow ||
                          debuffData.difficultyClass
                        );

                        // Handle stat penalties and modifiers - consolidate into single blocks
                        const allStatChanges = [];

                        // Collect stat penalties
                        if (debuffData?.statPenalties?.length > 0) {
                          debuffData.statPenalties.forEach(penalty => {
                            // Comprehensive stat name mapping
                            const statMap = {
                              'strength': 'Strength', 'agility': 'Agility', 'constitution': 'Constitution',
                              'intelligence': 'Intelligence', 'spirit': 'Spirit', 'charisma': 'Charisma',
                              'str': 'Strength', 'agi': 'Agility', 'con': 'Constitution',
                              'int': 'Intelligence', 'spi': 'Spirit', 'spir': 'Spirit', 'cha': 'Charisma',
                              'speed': 'Speed', 'attack': 'Attack', 'damage': 'Damage', 'crit_range': 'Critical Range', 'crit_multiplier': 'Critical Multiplier', 'attackdamagebonus': 'Attack and Damage', 'attackDamageBonus': 'Attack and Damage', 'attack_damage_bonus': 'Attack and Damage', 'maxhitpoints': 'Maximum Hit Points', 'max_hit_points': 'Maximum Hit Points', 'hitpoints': 'Hit Points',
                              'hp_regen': 'Health Regeneration', 'mp_regen': 'Mana Regeneration',
                              'healing_power': 'Healing Power', 'initiative': 'Initiative', 'lifesteal': 'Lifesteal',
                              'damage_reflection': 'Damage Reflection', 'actionpoints': 'Action Points',
                              'action_points': 'Action Points', 'damagereduction': 'Damage Reduction',
                              'damage_reduction': 'Damage Reduction', 'all_resistances': 'All Resistances',
                              'all_primary_stats': 'All Primary Stats'
                            };

                            // Get stat name from either penalty.name or penalty.stat
                            const rawStatName = penalty.name || penalty.stat || 'Stat';
                            const statName = statMap[rawStatName.toLowerCase()] || 
                                            rawStatName.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                            const value = penalty.value || penalty.magnitude || penalty.amount || 0;
                            const amount = Math.abs(value);
                            const typeText = penalty.isPercentage || penalty.type === 'percentage' || penalty.magnitudeType === 'percentage' ? '%' : '';

                            // Check if this is a resistance stat
                            const penaltyName = (penalty.name || penalty.stat || penalty.id || '').toLowerCase();
                            const isResistanceStat = penalty.category === 'resistance' ||
                                                    penaltyName.includes('resistance') ||
                                                    penaltyName.includes('resist') ||
                                                    penaltyName.includes('ember') ||
                                                    penaltyName.includes('rime') ||
                                                    penaltyName.includes('storm') ||
                                                    penaltyName.includes('blight') ||
                                                    penaltyName.includes('blight') ||
                                                    penaltyName.includes('blight') ||
                                                    penaltyName.includes('ember') ||
                                                    penaltyName.includes('wyrd') ||
                                                    penaltyName.includes('storm') ||
                                                    penaltyName.includes('arcane') ||
                                                    penaltyName.includes('physical') ||
                                                    penaltyName.includes('physical') ||
                                                    penaltyName.includes('physical') ||
                                                    penaltyName.includes('physical');

                            if (isResistanceStat) {
                              // Handle resistance penalties with thematic descriptions
                              // For debuffs, we need to invert the logic since penalties reduce resistance
                              const percentage = Math.round(parseFloat(amount) || 0);
                              const damageType = extractDamageTypeFromResistanceName(penalty.stat || penalty.name || penalty.id);

                              // Resistance penalties make the target more vulnerable
                              // Map based on the absolute value
                              if (percentage === 200) {
                                allStatChanges.push(getThematicResistanceDescription('vulnerable', damageType));
                              } else if (percentage === 150) {
                                allStatChanges.push(getThematicResistanceDescription('exposed', damageType));
                              } else if (percentage === 125) {
                                allStatChanges.push(getThematicResistanceDescription('susceptible', damageType));
                              } else if (percentage === 100) {
                                allStatChanges.push(getThematicResistanceDescription('nullified', damageType));
                              } else if (percentage === 75) {
                                allStatChanges.push(getThematicResistanceDescription('guarded', damageType));
                              } else if (percentage === 50) {
                                allStatChanges.push(getThematicResistanceDescription('resistant', damageType));
                              } else if (percentage === 25) {
                                allStatChanges.push(getThematicResistanceDescription('highly_resistant', damageType));
                              } else if (percentage === 0) {
                                allStatChanges.push(getThematicResistanceDescription('immune', damageType));
                              } else {
                                // Fallback for other percentages
                                allStatChanges.push(`Reduced ${damageType} resistance (takes ${percentage}% more damage)`);
                              }
                            } else {
                              const advDis = getAdvantageDisadvantageText(penalty.stat || penalty.name || penalty.id, value, penalty.magnitudeType);
                              if (advDis.isAdvDis) {
                                allStatChanges.push(advDis.text);
                              } else {
                                // Use generic formatting for non-resistance stats
                                allStatChanges.push(`-${amount}${typeText} ${statName}`);
                              }
                            }
                          });
                        }

                        // Collect stat modifiers
                        if (debuffData?.statModifiers?.length > 0) {
                          debuffData.statModifiers.forEach(modifier => {
                            // Comprehensive stat name mapping
                            const statMap = {
                              'strength': 'Strength', 'agility': 'Agility', 'constitution': 'Constitution',
                              'intelligence': 'Intelligence', 'spirit': 'Spirit', 'charisma': 'Charisma',
                              'str': 'Strength', 'agi': 'Agility', 'con': 'Constitution',
                              'int': 'Intelligence', 'spi': 'Spirit', 'spir': 'Spirit', 'cha': 'Charisma',
                              'speed': 'Speed', 'attack': 'Attack', 'damage': 'Damage', 'crit_range': 'Critical Range', 'crit_multiplier': 'Critical Multiplier', 'attackdamagebonus': 'Attack and Damage', 'attackDamageBonus': 'Attack and Damage', 'attack_damage_bonus': 'Attack and Damage', 'maxhitpoints': 'Maximum Hit Points', 'max_hit_points': 'Maximum Hit Points', 'hitpoints': 'Hit Points',
                              'hp_regen': 'Health Regeneration', 'mp_regen': 'Mana Regeneration',
                              'healing_power': 'Healing Power', 'initiative': 'Initiative', 'lifesteal': 'Lifesteal',
                              'damage_reflection': 'Damage Reflection', 'actionpoints': 'Action Points',
                              'action_points': 'Action Points', 'damagereduction': 'Damage Reduction',
                              'damage_reduction': 'Damage Reduction', 'all_resistances': 'All Resistances',
                              'all_primary_stats': 'All Primary Stats'
                            };

                            const rawId = modifier.id?.toLowerCase() || '';
                            const statName = modifier.name || statMap[rawId] || 
                                            (modifier.id ? modifier.id.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Stat');
                            const value = modifier.magnitude || modifier.value || 0;
                            const sign = value >= 0 ? '+' : '';
                            const typeText = modifier.magnitudeType === 'percentage' ? '%' : '';

                            // Check if this is a resistance stat
                            const modifierName = (modifier.name || modifier.id || '').toLowerCase();
                            const isResistanceStat = modifier.category === 'resistance' ||
                                                    modifierName.includes('resistance') ||
                                                    modifierName.includes('resist') ||
                                                    modifierName.includes('ember') ||
                                                    modifierName.includes('rime') ||
                                                    modifierName.includes('storm') ||
                                                    modifierName.includes('blight') ||
                                                    modifierName.includes('blight') ||
                                                    modifierName.includes('blight') ||
                                                    modifierName.includes('ember') ||
                                                    modifierName.includes('wyrd') ||
                                                    modifierName.includes('storm') ||
                                                    modifierName.includes('arcane') ||
                                                    modifierName.includes('physical') ||
                                                    modifierName.includes('physical') ||
                                                    modifierName.includes('physical') ||
                                                    modifierName.includes('physical');

                            if (isResistanceStat) {
                              // Handle resistance modifiers with thematic descriptions
                              const percentage = Math.round(parseFloat(value) || 0);
                              const damageType = extractDamageTypeFromResistanceName(modifier.name || modifier.id);

                              // For debuff modifiers, negative values mean reduced resistance (more vulnerability)
                              // Map the value to the appropriate resistance level
                              if (percentage === -200 || percentage === 200) {
                                allStatChanges.push(getThematicResistanceDescription('vulnerable', damageType));
                              } else if (percentage === -150 || percentage === 150) {
                                allStatChanges.push(getThematicResistanceDescription('exposed', damageType));
                              } else if (percentage === -125 || percentage === 125) {
                                allStatChanges.push(getThematicResistanceDescription('susceptible', damageType));
                              } else if (percentage === -100 || percentage === 100) {
                                allStatChanges.push(getThematicResistanceDescription('nullified', damageType));
                              } else if (percentage === -75 || percentage === 75) {
                                allStatChanges.push(getThematicResistanceDescription('guarded', damageType));
                              } else if (percentage === -50 || percentage === 50) {
                                allStatChanges.push(getThematicResistanceDescription('resistant', damageType));
                              } else if (percentage === -25 || percentage === 25) {
                                allStatChanges.push(getThematicResistanceDescription('highly_resistant', damageType));
                              } else if (percentage === 0) {
                                allStatChanges.push(getThematicResistanceDescription('immune', damageType));
                              } else if (percentage < 0) {
                                allStatChanges.push(`Reduced ${damageType} resistance (takes ${Math.abs(percentage)}% more damage)`);
                              } else {
                                allStatChanges.push(`Increased ${damageType} vulnerability (takes ${percentage}% more damage)`);
                              }
                            } else {
                              const advDis = getAdvantageDisadvantageText(modifier.stat || modifier.id, value, modifier.magnitudeType);
                              if (advDis.isAdvDis) {
                                allStatChanges.push(advDis.text);
                              } else {
                                // Use generic formatting for non-resistance stats
                                allStatChanges.push(`${sign}${cleanFormula(value)}${typeText} ${statName}`);
                              }
                            }
                          });
                        }

                        // Add consolidated stat changes if any exist
                        if (allStatChanges.length > 0) {
                          let mechanicsText = allStatChanges.join(', ');

                          // Build save information for description line
                          let saveText = '';
                          const isSaveObj = debuffData.savingThrow && typeof debuffData.savingThrow === 'object';
                          const saveType = (isSaveObj ? debuffData.savingThrow.ability : debuffData.savingThrow) || debuffData.saveType;
                          const saveDC = (isSaveObj ? debuffData.savingThrow.difficultyClass : null) || debuffData.difficultyClass || debuffData.saveDC || 15;
                          const saveOutcome = (isSaveObj ? debuffData.savingThrow.saveOutcome : null) || debuffData.saveOutcome || 'negates';

                          if (saveType && saveType !== 'none') {
                            const outcomeMap = {
                              'negates': 'negate',
                              'halves_effects': 'halves',
                              'halves': 'halves',
                              'none': 'no save'
                            };

                            const saveTypeName = normalizeSaveType(saveType);
                            const outcomeText = outcomeMap[saveOutcome] || 'negate';
                            saveText = `${saveTypeName} DC ${saveDC} (${outcomeText})`;
                          }

                          // Create duration text for description line
                          let durationText = '';
                          const durationValue = debuffData.durationValue || debuffData.duration;
                          if (durationValue && debuffData.durationType !== 'instant') {
                            if (debuffData.durationType === 'permanent') {
                              durationText = 'Permanent';
                            } else if (debuffData.durationType === 'rounds') {
                              durationText = `${durationValue} ${durationValue === 1 ? 'Round' : 'Rounds'}`;
                            } else if (debuffData.durationType === 'turns') {
                              durationText = `${durationValue} ${durationValue === 1 ? 'Turn' : 'Turns'}`;
                            } else if (debuffData.durationType === 'minutes') {
                              durationText = `${durationValue} ${durationValue === 1 ? 'Minute' : 'Minutes'}`;
                            } else if (debuffData.durationType === 'hours') {
                              durationText = `${durationValue} ${durationValue === 1 ? 'Hour' : 'Hours'}`;
                            } else if (debuffData.durationType === 'rest') {
                              durationText = `Until ${(debuffData.restType || 'long').charAt(0).toUpperCase().charAt(0).toUpperCase() + (debuffData.restType || 'long').slice(1)} Rest`;
                            } else if (debuffData.durationType === 'time' && durationValue) {
                              const unit = debuffData.durationUnit || 'rounds';
                              durationText = `${durationValue} ${unit}`;
                            } else if (durationValue) {
                              durationText = `${durationValue} ${durationValue === 1 ? 'turn' : 'turns'}`;
                            }
                          }

                          // Combine save and duration text
                          let descriptionParts = [];
                          if (saveText) descriptionParts.push(saveText);
                          if (durationText) descriptionParts.push(durationText);
                          const descriptionText = descriptionParts.length > 0 ? descriptionParts.join(' | ') : 'Stat reduction';

                          const debuffTargeting = formatEffectTargeting('debuff');
                          effects.push({
                            name: `Stat Penalty`,
                            description: descriptionText,
                            mechanicsText: mechanicsText,
                            targeting: debuffTargeting
                          });
                        }

                        // Handle debuffConfig.effects array (new structure)
                        if (debuffData?.effects?.length > 0) {
                          debuffData.effects.forEach(effect => {
                            // Use mechanicsText if provided, otherwise build from stat modifier
                            let mechanicsText = effect.mechanicsText || '';
                            
                            // Check if this effect has statModifier (stat reduction) and no mechanicsText provided
                            if (!mechanicsText && effect.statModifier) {
                              const statMod = effect.statModifier;
                              const statMap = {
                                'strength': 'Strength', 'agility': 'Agility', 'constitution': 'Constitution',
                                'intelligence': 'Intelligence', 'spirit': 'Spirit', 'charisma': 'Charisma',
                                'str': 'Strength', 'agi': 'Agility', 'con': 'Constitution',
                                'int': 'Intelligence', 'spi': 'Spirit', 'spir': 'Spirit', 'cha': 'Charisma',
                                'speed': 'Speed', 'attack': 'Attack', 'damage': 'Damage', 'crit_range': 'Critical Range', 'crit_multiplier': 'Critical Multiplier', 'attackdamagebonus': 'Attack and Damage', 'attackDamageBonus': 'Attack and Damage', 'attack_damage_bonus': 'Attack and Damage', 'maxhitpoints': 'Maximum Hit Points', 'max_hit_points': 'Maximum Hit Points', 'hitpoints': 'Hit Points',
                                'hp_regen': 'Health Regeneration', 'mp_regen': 'Mana Regeneration',
                                'healing_power': 'Healing Power', 'initiative': 'Initiative', 'lifesteal': 'Lifesteal',
                                'damage_reflection': 'Damage Reflection', 'actionpoints': 'Action Points',
                                'action_points': 'Action Points', 'damagereduction': 'Damage Reduction',
                                'damage_reduction': 'Damage Reduction', 'all_resistances': 'All Resistances',
                                'all_primary_stats': 'All Primary Stats'
                              };

                              const rawStat = statMod.stat?.toLowerCase() || '';
                              const statName = statMap[rawStat] || 
                                             (statMod.stat ? statMod.stat.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Stat');
                              const magnitude = statMod.magnitude || 0;
                              const magnitudeType = statMod.magnitudeType || 'flat';
                              const typeText = magnitudeType === 'percentage' ? '%' : '';
                              
                              // Check if description already explains the stat modifier
                              const effectDescription = effect.description || '';
                              const descriptionLower = effectDescription.toLowerCase();
                              const statNameLower = statName.toLowerCase();
                              
                              const absMagnitude = Math.abs(magnitude);
                              const hasMagnitude = descriptionLower.includes(`${magnitude}`) || 
                                                   descriptionLower.includes(`${magnitude} `) ||
                                                   descriptionLower.includes(`-${magnitude}`) ||
                                                   descriptionLower.includes(`- ${magnitude}`) ||
                                                   descriptionLower.includes(`${absMagnitude}`) ||
                                                   descriptionLower.includes(`-${absMagnitude}`) ||
                                                   descriptionLower.includes(`reduced by ${absMagnitude}`) ||
                                                   descriptionLower.includes(`decreased by ${absMagnitude}`) ||
                                                   descriptionLower.includes(`loses ${absMagnitude}`) ||
                                                   descriptionLower.includes(`lose ${absMagnitude}`);
                              
                              const hasStatName = descriptionLower.includes(statNameLower);
                              
                              // If description already has both magnitude and stat name, don't add mechanicsText
                              const descriptionHasStatReduction = hasMagnitude && hasStatName;
                              
                              const sign = magnitude >= 0 ? '+' : '';
                              mechanicsText = descriptionHasStatReduction ? '' : `${sign}${cleanFormula(magnitude)}${typeText} ${statName}`;
                              
                              // Build description with duration and save
                              // Check if description already includes duration information
                              // Check if description has duration info - look for patterns like "for X rounds", "-X for Y", etc.
                              const hasDurationInDescription = effectDescription.toLowerCase().includes('for') && 
                                                               (effectDescription.toLowerCase().includes('round') || 
                                                                effectDescription.toLowerCase().includes('turn') ||
                                                                effectDescription.toLowerCase().includes('minute')) ||
                                                               /-?\d+\s+(armor|strength|constitution|etc)\s+for\s+\d+/i.test(effectDescription) ||
                                                               /for\s+\d+\s+rounds?/i.test(effectDescription);
                              
                              const descriptionParts = [];
                              
                              // Strip leading "-" from description if present (used for indentation but shouldn't display)
                              const cleanDescription = effectDescription.trim().replace(/^-\s*/, '');
                              
                              // If description already has duration, use it as-is (don't add duration again)
                              if (hasDurationInDescription && cleanDescription) {
                                descriptionParts.push(cleanDescription);
                              } else {
                                // Build description from parts - start with the effect description if it exists
                                if (cleanDescription) {
                                  descriptionParts.push(cleanDescription);
                                }
                                
                                // Add save info if available
                                const isSaveObj = debuffData.savingThrow && typeof debuffData.savingThrow === 'object';
                                const saveType = (isSaveObj ? debuffData.savingThrow.ability : debuffData.savingThrow) || debuffData.saveType || debuffData.savingThrowType;
                                const saveDC = (isSaveObj ? debuffData.savingThrow.difficultyClass : null) || debuffData.difficultyClass || debuffData.saveDC;
                                if (saveType && saveType !== 'none' && saveDC) {
                                  const saveTypeName = normalizeSaveType(saveType);
                                  descriptionParts.push(`DC ${saveDC} ${saveTypeName} save`);
                                }
                                
                                // Add duration if not already in description
                                const durationValue = debuffData.durationValue || debuffData.duration;
                                if (durationValue && debuffData.durationType && debuffData.durationType !== 'instant') {
                                  if (debuffData.durationType === 'rounds') {
                                    descriptionParts.push(`for ${durationValue} ${durationValue === 1 ? 'round' : 'rounds'}`);
                                  } else if (debuffData.durationType === 'turns') {
                                    descriptionParts.push(`for ${durationValue} ${durationValue === 1 ? 'turn' : 'turns'}`);
                                  } else {
                                    descriptionParts.push(`for ${durationValue} ${debuffData.durationType}`);
                                  }
                                }
                                
                                // If no description parts and no effect description, use fallback
                                if (descriptionParts.length === 0) {
                                  descriptionParts.push(effect.name || 'Stat reduction');
                                }
                              }
                              
                              // Strip leading "-" from final description if present
                              const rawDescription = descriptionParts.length > 0 ? descriptionParts.join(' â€¢ ') : 
                                                     (effect.description || effect.name || 'Stat reduction');
                              const description = rawDescription.replace(/^-\s*/, '');
                              
                              const debuffTargeting = formatEffectTargeting('debuff');
                              effects.push({
                                name: effect.name || effect.id || 'Stat Reduction',
                                description: description,
                                mechanicsText: mechanicsText,
                                targeting: debuffTargeting
                              });
                            } 
                            // Check if this is a status effect
                            else if (effect.id || effect.name || effect.statusType) {
                              // Format as status effect with improved duration formatting
                              const formattedEffect = formatStatusEffectDetails(effect, 'debuff', debuffData);
                              const debuffTargeting = formatEffectTargeting('debuff');

                              // Build better description format for status effects
                              // Strip leading "-" from description if present (used for indentation but shouldn't display)
                              const rawEffectDescription = effect.description || formattedEffect.description;
                              const cleanEffectDescription = rawEffectDescription.replace(/^-\s*/, '');
                              let descriptionParts = [cleanEffectDescription];

                              // Add save info if available
                              const isSaveObj = debuffData.savingThrow && typeof debuffData.savingThrow === 'object';
                              const saveType = (isSaveObj ? debuffData.savingThrow.ability : debuffData.savingThrow) || debuffData.saveType || debuffData.savingThrowType;
                              const saveDC = (isSaveObj ? debuffData.savingThrow.difficultyClass : null) || debuffData.difficultyClass || debuffData.saveDC;
                              if (saveType && saveType !== 'none' && saveDC) {
                                const saveTypeName = normalizeSaveType(saveType);

                                // Determine save outcome
                                let outcomeText = '';
                                if (debuffData.saveOutcome) {
                                  const outcomeMap = {
                                    'negates': 'negates',
                                    'halves_effects': 'halves',
                                    'halves': 'halves',
                                    'ends_early': 'ends next turn on save',
                                    'resists_commands': 'can resist commands on save',
                                    'broken': 'broken on save',
                                    'overcome': 'overcome on save'
                                  };
                                  outcomeText = outcomeMap[debuffData.saveOutcome] || 'negates';
                                } else {
                                  // Default outcome for debuff effects
                                  outcomeText = 'negates';
                                }

                                descriptionParts.push(`DC ${saveDC} ${saveTypeName} save (${outcomeText})`);
                              }

                              // Add duration in a more natural format
                              const durationValue = debuffData.durationValue || debuffData.duration;
                              if (durationValue && debuffData.durationType && debuffData.durationType !== 'instant') {
                                if (debuffData.durationType === 'rounds') {
                                  descriptionParts.push(`for ${durationValue} ${durationValue === 1 ? 'round' : 'rounds'}`);
                                } else if (debuffData.durationType === 'turns') {
                                  descriptionParts.push(`for ${durationValue} ${durationValue === 1 ? 'turn' : 'turns'}`);
                                } else {
                                  descriptionParts.push(`for ${durationValue} ${debuffData.durationType}`);
                                }
                              }

                              const finalDescription = descriptionParts.join(' â€¢ ');

                              effects.push({
                                name: formattedEffect.name,
                                description: finalDescription,
                                mechanicsText: formattedEffect.mechanicsText,
                                targeting: debuffTargeting
                              });
                            }
                            // Generic effect with description
                            else if (effect.description || effect.name) {
                              // Check if description already includes duration information
                              const effectDescription = effect.description || '';
                              const hasDurationInDescription = effectDescription.toLowerCase().includes('for') && 
                                                               (effectDescription.toLowerCase().includes('round') || 
                                                                effectDescription.toLowerCase().includes('turn') ||
                                                                effectDescription.toLowerCase().includes('minute'));
                              
                              const descriptionParts = [];
                              
                              // If description already has duration, use it as-is (don't add duration again)
                              if (hasDurationInDescription && effectDescription.trim()) {
                                descriptionParts.push(effectDescription);
                              } else {
                                // Build description from parts
                                // Add save info if available
                                const isSaveObj = debuffData.savingThrow && typeof debuffData.savingThrow === 'object';
                                const saveType = (isSaveObj ? debuffData.savingThrow.ability : debuffData.savingThrow) || debuffData.saveType || debuffData.savingThrowType;
                                const saveDC = (isSaveObj ? debuffData.savingThrow.difficultyClass : null) || debuffData.difficultyClass || debuffData.saveDC;
                                if (saveType && saveType !== 'none' && saveDC) {
                                  const saveTypeName = normalizeSaveType(saveType);
                                  descriptionParts.push(`DC ${saveDC} ${saveTypeName} save`);
                                }
                                
                                // Add duration if not already in description
                                const durationValue = debuffData.durationValue || debuffData.duration;
                                if (durationValue && debuffData.durationType && debuffData.durationType !== 'instant') {
                                  if (debuffData.durationType === 'rounds') {
                                    descriptionParts.push(`${durationValue} ${durationValue === 1 ? 'Round' : 'Rounds'}`);
                                  } else if (debuffData.durationType === 'turns') {
                                    descriptionParts.push(`${durationValue} ${durationValue === 1 ? 'Turn' : 'Turns'}`);
                                  } else {
                                    descriptionParts.push(`${durationValue} ${debuffData.durationType}`);
                                  }
                                }
                                
                                // If no description parts and no effect description, use fallback
                                if (descriptionParts.length === 0 && !effectDescription.trim()) {
                                  descriptionParts.push(effect.name || 'Debuff effect');
                                }
                              }
                              
                              const description = descriptionParts.length > 0 ? descriptionParts.join(' â€¢ ') : 
                                                 (effect.description || 'Debuff effect');
                              
                              const debuffTargeting = formatEffectTargeting('debuff');
                              // Use customName from debuffConfig if effect doesn't have its own name
                              const defaultName = debuffData?.customName || spell?.debuffConfig?.customName || 'Debuff Effect';
                              effects.push({
                                name: effect.name || effect.id || defaultName,
                                description: description,
                                mechanicsText: effect.mechanicsText || effect.description || '',
                                targeting: debuffTargeting
                              });
                            }
                          });
                        }

                        // Handle status effects with enhanced formatting (legacy structure)
                        if (debuffData?.statusEffects?.length > 0) {
                          // Build global save and duration text for status effects
                          const isSaveObj = debuffData.savingThrow && typeof debuffData.savingThrow === 'object';
                          const globalSaveType = (isSaveObj ? debuffData.savingThrow.ability : debuffData.savingThrow) || debuffData.saveType;
                          const globalSaveDC = (isSaveObj ? debuffData.savingThrow.difficultyClass : null) || debuffData.difficultyClass || debuffData.saveDC;

                          debuffData.statusEffects.forEach(status => {
                            // Format status effect based on its configuration
                            const formattedEffect = formatStatusEffectDetails(status, 'debuff', debuffData);

                            // Build save/duration info for this status effect
                            let configParts = [];

                            // Use effect-specific save if available, otherwise fall back to global
                            const effSaveType = status.saveType || globalSaveType;
                            const effSaveDC = status.saveDC || globalSaveDC;
                            if (effSaveType && effSaveType !== 'none') {
                              const outcomeText = status.saveOutcome === 'negates' ? 'to shake it off' :
                                                  status.saveOutcome === 'ends_early' ? 'ends on success' :
                                                  status.saveOutcome === 'reduces_level' ? 'reduces severity on success' :
                                                  '';
                              configParts.push(`${normalizeSaveType(effSaveType)} DC ${effSaveDC}${outcomeText ? ' ' + outcomeText : ''}`);
                            }

                            // Add duration info
                            const durVal = status.durationValue || debuffData.durationValue || debuffData.duration;
                            const durType = status.durationType || debuffData.durationType;
                            if (durVal && durType !== 'instant' && durType !== 'permanent') {
                              const unitMap = { 'turns': durVal === 1 ? 'turn' : 'turns', 'rounds': durVal === 1 ? 'round' : 'rounds', 'minutes': durVal === 1 ? 'minute' : 'minutes', 'hours': durVal === 1 ? 'hour' : 'hours', 'time': debuffData.durationUnit || 'rounds' };
                              const unit = unitMap[durType] || durType || 'rounds';
                              configParts.push(`for ${durVal} ${unit}`);
                            } else if (durType === 'permanent') {
                              configParts.push('Permanent');
                            }

                            // Add concentration
                            if (status.concentrationRequired || debuffData.concentrationRequired) {
                              configParts.push('concentration');
                            }

                            const configText = configParts.length > 0 ? ` (${configParts.join(', ')})` : '';
                            const fullMechanics = formattedEffect.mechanicsText + configText;

                          const debuffTargeting = formatEffectTargeting('debuff');
                          effects.push({
                            name: formattedEffect.name,
                            description: formattedEffect.description,
                            mechanicsText: fullMechanics,
                            targeting: debuffTargeting
                          });
                          });
                        }

                        // If we still have no effects but have save/duration config, show a basic entry
                        if (effects.length === 0) {
                          let configParts = [];
                          const isSaveObj = debuffData.savingThrow && typeof debuffData.savingThrow === 'object';
                          const saveType = (isSaveObj ? debuffData.savingThrow.ability : debuffData.savingThrow) || debuffData.saveType;
                          const saveDC = (isSaveObj ? debuffData.savingThrow.difficultyClass : null) || debuffData.difficultyClass || debuffData.saveDC;
                          if (saveType && saveType !== 'none' && saveDC) {
                            configParts.push(`${normalizeSaveType(saveType)} DC ${saveDC}`);
                          }
                          const durVal = debuffData.durationValue || debuffData.duration;
                          const durType = debuffData.durationType;
                          if (durVal && durType !== 'instant' && durType !== 'permanent') {
                            const unitMap = { 'turns': durVal === 1 ? 'turn' : 'turns', 'rounds': durVal === 1 ? 'round' : 'rounds', 'minutes': durVal === 1 ? 'minute' : 'minutes', 'hours': durVal === 1 ? 'hour' : 'hours' };
                            const unit = unitMap[durType] || durType || 'rounds';
                            configParts.push(`for ${durVal} ${unit}`);
                          }
                          if (configParts.length > 0) {
                            const debuffTargeting = formatEffectTargeting('debuff');
                            effects.push({
                              name: debuffData?.customName || 'Debuff Effect',
                              description: configParts.join(' â€¢ '),
                              mechanicsText: '',
                              targeting: debuffTargeting
                            });
                          }
                        }

                        // REMOVED: Fallback debuff effects - individual effects should handle all cases

                        // Handle legacy effects.debuff format (e.g. { type: 'speed_reduction', value: -10, duration: 2 })
                        if (legacyDebuff && effects.length === 0) {
                          const debuffTypeLabels = {
                            'speed_reduction': 'Speed Reduction',
                            'slow': 'Slow',
                            'attack_penalty': 'Attack Penalty',
                            'defense_penalty': 'Defense Penalty',
                            'accuracy_reduction': 'Accuracy Reduction',
                            'damage_reduction': 'Damage Reduction',
                            'blind': 'Blind',
                            'deafen': 'Deafen',
                            'silence': 'Silence',
                            'paralyze': 'Paralyze',
                            'stun': 'Stun',
                            'restrain': 'Restrain',
                            'prone': 'Prone',
                            'frighten': 'Frighten',
                            'charm': 'Charm',
                            'confusion': 'Confusion',
                            'blight': 'blight',
                            'disease': 'Disease',
                            'exhaustion': 'Exhaustion',
                            'weaken': 'Weaken',
                            'vulnerability': 'Vulnerability'
                          };

                          const debuffLabel = debuffTypeLabels[legacyDebuff.type] || legacyDebuff.type.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
                          const duration = legacyDebuff.duration || spell?.durationConfig?.durationAmount || spell?.durationConfig?.duration || 1;
                          const durationUnit = spell?.durationConfig?.durationType || 'rounds';
                          const unitMap = { 'rounds': 'rounds', 'minutes': 'min', 'hours': 'hrs', 'days': 'days' };
                          const durationText = `${duration} ${unitMap[durationUnit] || durationUnit}`;

                          let mechanicsText = `Applies ${debuffLabel.toLowerCase()}`;
                          if (legacyDebuff.value) {
                            const absVal = Math.abs(legacyDebuff.value);
                            mechanicsText = `Target speed reduced by ${absVal} ft`;
                          }

                          effects.push({
                            name: debuffLabel,
                            description: durationText,
                            mechanicsText: mechanicsText
                          });
                        }

                        return effects.length > 0 ? (
                          <div className="healing-formula-line">
                            <div className="healing-effects-list">
                              {effects.map((effect, index) => (
                                <div key={`debuff-${index}`} className="healing-effect-item">
                                  <div className="healing-effect">
                                    <span className="healing-effect-name">
                                      {effect.name}
                                    </span>
                                    {effect.description && effect.description !== effect.name && (
                                      <span className="healing-effect-description">
                                        {" "}<span className="diamond-symbol">â—†</span>{" "}{effect.description}
                                      </span>
                                    )}
                                    {/* Targeting/Range badges */}
                                    {effect.targeting && (
                                      <div className="healing-effect-targeting">
                                        {effect.targeting.range && (
                                          <span className="targeting-badge range-badge">
                                            {effect.targeting.range}
                                          </span>
                                        )}
                                        {effect.targeting.targeting && (
                                          <span className="targeting-badge targeting-info-badge">
                                            {effect.targeting.targeting}
                                          </span>
                                        )}
                                        {effect.targeting.restrictions && (
                                          <span className="targeting-badge restrictions-badge">
                                            {effect.targeting.restrictions}
                                          </span>
                                        )}
                                        {effect.targeting.propagation && (
                                          <span className="targeting-badge propagation-badge">
                                            {effect.targeting.propagation}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  {effect.mechanicsText && (
                                    <div className="healing-effect-details">
                                      <div className="healing-effect-mechanics">
                                        {effect.mechanicsText}
                                      </div>
                                    </div>
                                  )}
                                  {/* Conditional formulas */}
                                  {effect.conditionalFormulas && effect.conditionalFormulas.length > 0 && (
                                    <div className="healing-effect-details" style={{ marginTop: '4px', paddingTop: '4px', borderTop: '1px solid rgba(139, 115, 85, 0.2)' }}>
                                      {effect.conditionalFormulas.map((cf, cfIndex) => {
                                        const triggerText = cf.triggerName.startsWith('When ') ? cf.triggerName.replace('When ', 'If ') : `If ${cf.triggerName}`;
                                        return (
                                          <div key={cfIndex} className="healing-effect-mechanics" style={{ fontSize: '0.9em', marginTop: cfIndex > 0 ? '4px' : '0' }}>
                                            <strong>{triggerText}:</strong> Enhanced effect
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null;
                      })()}
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
                  spell.utilityConfig.durationType ||
                  spell.utilityConfig.enhancementType ||
                  spell.utilityConfig.enhancementValue ||
                  spell.utilityConfig.utilityType ||
                  spell.utilityConfig.choiceConfig
                );

                // Show utility section if utility effect type is selected or any utility config exists
                if (!hasUtilityType && !hasAnyUtilityConfiguration) return null;

                const utilityData = spell?.utilityConfig;
                const effects = [];

                // Legacy utility effects (effects.utility) support
                const legacyUtility = spell?.effects?.utility || spellProp?.effects?.utility;
                if (legacyUtility) {
                  // Damage redirection (e.g., Intervene)
                  if (legacyUtility.damageRedirection) {
                    const from = legacyUtility.damageRedirection.from || 'ally';
                    const to = legacyUtility.damageRedirection.to || 'self';
                    const description = 'Redirect damage';
                    const mechanicsText = `Redirects damage from ${from} to ${to}`;
                    effects.push({
                      name: 'Damage Redirection',
                      description,
                      mechanicsText
                    });
                  }
                }

                // Handle choiceConfig â€” renders as a "Choose One" options table
                if (utilityData?.choiceConfig?.options?.length > 0) {
                  const choiceMode = utilityData.choiceConfig.mode || 'pick_one';
                  const pickCount = utilityData.choiceConfig.pickCount || 1;
                  const choiceLabel = pickCount === 1 ? 'Choose One' : `Choose ${pickCount}`;
                  const choiceHeader = utilityData.choiceConfig.label || choiceLabel;
                  const choiceNote = utilityData.choiceConfig.note || null;
                  const utilityTargeting = formatEffectTargeting('utility');

                  effects.push({
                    name: choiceHeader,
                    description: '',
                    mechanicsText: choiceNote || '',
                    targeting: null,
                    isChoiceHeader: true
                  });

                  utilityData.choiceConfig.options.forEach((option, idx) => {
                    effects.push({
                      name: `${idx + 1}. ${option.name}`,
                      description: '',
                      mechanicsText: option.description || '',
                      targeting: utilityTargeting,
                      isChoice: true
                    });
                  });
                }

                // Handle selected effects
                if (utilityData?.selectedEffects?.length > 0) {
                  utilityData.selectedEffects.forEach(effect => {
                    // Build effect name with duration info
                    const duration = utilityData.duration || 3;
                    const durationUnit = utilityData.durationUnit || 'minutes';
                    const concentration = utilityData.concentration;

                    // Format duration unit for display
                    const formatDurationUnit = (unit) => {
                      const unitMap = {
                        'instant': 'Instantaneous',
                        'rounds': 'rounds',
                        'minutes': 'min',
                        'hours': 'hrs',
                        'days': 'days'
                      };
                      return unitMap[unit] || unit;
                    };

                    // Build the effect name line
                    let effectName = effect.customName || effect.name || effect;

                    // Add duration info
                    let durationText = '';
                    if (durationUnit !== 'instant') {
                      durationText = `${duration} ${formatDurationUnit(durationUnit)}`;
                      if (concentration) {
                        durationText += ' (Concentration)';
                      }
                    }

                    // Build mechanics text from effect configuration
                    let mechanicsText = '';

                    // Format effect-specific configuration details
                    if (effect.id === 'fly') {
                      // Flight effect
                      const flightType = effect.flightType || 'flying';
                      const flightSpeed = effect.flightSpeed || 30;
                      const maxAltitude = effect.maxAltitude || 100;
                      const potency = effect.potency ? `${effect.potency.charAt(0).toUpperCase() + effect.potency.slice(1)}: ` : '';

                      mechanicsText = `${potency}${flightType.charAt(0).toUpperCase() + flightType.slice(1)} at ${flightSpeed} ft/round, max altitude ${maxAltitude} ft`;
                    } else if (effect.id === 'teleport') {
                      // Teleportation effect
                      const distance = effect.distance || 30;
                      const needsLineOfSight = effect.needsLineOfSight ? 'requires line of sight' : 'no line of sight required';
                      const takesOthers = effect.takesOthers ? ', can teleport others' : '';
                      const potency = effect.potency ? `${effect.potency.charAt(0).toUpperCase() + effect.potency.slice(1)}: ` : '';

                      mechanicsText = `${potency}Teleport up to ${distance} ft (${needsLineOfSight}${takesOthers})`;
                    } else if (effect.id === 'phasing') {
                      // Phasing effect - pass through solid objects
                      const phasingDuration = effect.phasingDuration || utilityData.duration || 1;
                      const canAttack = effect.canAttack !== false;
                      const canInteract = effect.canInteract !== false;
                      const maxThickness = effect.maxThickness || 'unlimited';
                      const potency = effect.potency ? `${effect.potency.charAt(0).toUpperCase() + effect.potency.slice(1)}: ` : '';
                      
                      // Use description if provided and detailed, otherwise build from parameters
                      if (effect.description && effect.description.length > 50) {
                        mechanicsText = `${potency}${effect.description}`;
                      } else {
                        let phasingDetails = `Pass through non-magical barriers and obstacles`;
                        if (maxThickness !== 'unlimited' && typeof maxThickness === 'number') {
                          phasingDetails += ` up to ${maxThickness} ft thick`;
                        }
                        if (canAttack) {
                          phasingDetails += `. Can attack while phasing`;
                        } else {
                          phasingDetails += `. Cannot attack while phasing`;
                        }
                        if (!canInteract) {
                          phasingDetails += `. Cannot interact with physical objects`;
                        }
                        
                        mechanicsText = `${potency}${phasingDetails}`;
                      }
                    } else if (!mechanicsText && effect.id === 'invisibility') {
                      // Invisibility effect
                      const potency = effect.potency ? `${effect.potency.charAt(0).toUpperCase() + effect.potency.slice(1)}: ` : '';
                      const breaksOnAttack = effect.breaksOnAttack !== false ? 'breaks on attack' : 'persists through attacks';

                      mechanicsText = `${potency}Become invisible (${breaksOnAttack})`;
                    } else if (!mechanicsText && effect.id === 'water_breathing') {
                      // Water breathing effect
                      const potency = effect.potency ? `${effect.potency.charAt(0).toUpperCase() + effect.potency.slice(1)}: ` : '';

                      mechanicsText = `${potency}Breathe underwater for the duration`;
                    } else if (!mechanicsText && effect.id === 'water_walking') {
                      // Water walking effect
                      const potency = effect.potency ? `${effect.potency.charAt(0).toUpperCase() + effect.potency.slice(1)}: ` : '';

                      mechanicsText = `${potency}Walk on water as if it were solid ground`;
                    } else if (!mechanicsText) {
                      // Fall back to description only if mechanicsText not provided
                      mechanicsText = effect.description || '';

                      // Add potency information if available
                      if (effect.potency) {
                        const potencyName = effect.potency.charAt(0).toUpperCase() + effect.potency.slice(1);
                        mechanicsText = mechanicsText ? `${potencyName}: ${mechanicsText}` : potencyName;
                      }
                    }

                    // Build inline description with duration
                    const inlineDescription = durationText || (effect.customDescription || '');

                    const utilityTargeting = formatEffectTargeting('utility');
                    effects.push({
                      name: effectName,
                      description: inlineDescription,
                      mechanicsText: mechanicsText || 'Provides utility effects',
                      targeting: utilityTargeting
                    });
                  });
                }

                // Handle enhanced spell library format utility effects
                if (utilityData?.enhancementType && utilityData?.enhancementValue) {
                  const enhancementName = utilityData.enhancementType.replace(/_/g, ' ')
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                  const utilityTargeting = formatEffectTargeting('utility');
                  effects.push({
                    name: `${enhancementName} Enhancement`,
                    description: `+${utilityData.enhancementValue}`,
                    mechanicsText: `Increases ${enhancementName} by ${utilityData.enhancementValue}`,
                    targeting: utilityTargeting
                  });
                }

                // Handle utility type without enhancement
                if (utilityData?.utilityType && !utilityData?.enhancementType && effects.length === 0) {
                  const utilityName = utilityData.utilityType.replace(/_/g, ' ')
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                  
                  // Format duration info from utilityConfig
                  const duration = utilityData.duration || 3;
                  const durationUnit = utilityData.durationUnit || 'minutes';
                  const concentration = utilityData.concentration;

                  // Format duration unit for display
                  const formatDurationUnit = (unit) => {
                    const unitMap = {
                      'instant': 'Instantaneous',
                      'rounds': 'rounds',
                      'minutes': 'min',
                      'hours': 'hrs',
                      'days': 'days'
                    };
                    return unitMap[unit] || unit;
                  };

                  // Build duration info
                  let durationText = '';
                  if (durationUnit !== 'instant') {
                    durationText = `${duration} ${formatDurationUnit(durationUnit)}`;
                    if (concentration) {
                      durationText += ' (Concentration)';
                    }
                  }

                  // Build inline description with duration
                  const inlineDescription = durationText || 'Utility effect';

                  const utilityTargeting = formatEffectTargeting('utility');
                  effects.push({
                    name: utilityName,
                    description: inlineDescription,
                    mechanicsText: 'Provides utility benefits',
                    targeting: utilityTargeting
                  });
                }

                // If spell has utility effect type but no config or legacy details, show a basic effect
                if (hasUtilityType && effects.length === 0) {
                  // Still try to show duration if utilityConfig exists
                  let inlineDescription = 'Provides utility benefits';
                  
                  if (utilityData) {
                    const duration = utilityData.duration || 3;
                    const durationUnit = utilityData.durationUnit || 'minutes';
                    const concentration = utilityData.concentration;

                    // Format duration unit for display
                    const formatDurationUnit = (unit) => {
                      const unitMap = {
                        'instant': 'Instantaneous',
                        'rounds': 'rounds',
                        'minutes': 'min',
                        'hours': 'hrs',
                        'days': 'days'
                      };
                      return unitMap[unit] || unit;
                    };

                    // Build duration info
                    let durationText = '';
                    if (durationUnit !== 'instant') {
                      durationText = `${duration} ${formatDurationUnit(durationUnit)}`;
                      if (concentration) {
                        durationText += ' (Concentration)';
                      }
                    }

                    inlineDescription = durationText || 'Provides utility benefits';
                  }

                  const utilityTargeting = formatEffectTargeting('utility');
                  effects.push({
                    name: 'Utility Effect',
                    description: inlineDescription,
                    mechanicsText: 'Effect details not configured',
                    targeting: utilityTargeting
                  });
                }

                return effects.length > 0 ? (
                  <div className="healing-effects">
                    <div className="healing-effects-section">
                      <div className="healing-formula-line">
                        <div className="healing-effects-list">
                          {effects.map((effect, index) => (
                            <div key={`utility-${index}`} className={`healing-effect-item${effect.isChoiceHeader ? ' choice-header' : ''}${effect.isChoice ? ' choice-option' : ''}`}>
                              <div className="healing-effect">
                                {effect.isChoiceHeader ? (
                                  <div>
                                    <div className="choice-header-label">{effect.name}</div>
                                    {effect.mechanicsText && (
                                      <div className="choice-header-note">{effect.mechanicsText}</div>
                                    )}
                                  </div>
                                ) : (
                                  <span className="healing-effect-name">{effect.name}</span>
                                )}
                                {/* Description removed - already shown in UnifiedSpellCard main description */}
                                {/* Targeting/Range badges */}
                                {effect.targeting && (
                                  <div className="healing-effect-targeting">
                                    {effect.targeting.range && (
                                      <span className="targeting-badge range-badge">
                                        {effect.targeting.range}
                                      </span>
                                    )}
                                    {effect.targeting.targeting && (
                                      <span className="targeting-badge targeting-info-badge">
                                        {effect.targeting.targeting}
                                      </span>
                                    )}
                                    {effect.targeting.restrictions && (
                                      <span className="targeting-badge restrictions-badge">
                                        {effect.targeting.restrictions}
                                      </span>
                                    )}
                                    {effect.targeting.propagation && (
                                      <span className="targeting-badge propagation-badge">
                                        {effect.targeting.propagation}
                                      </span>
                                    )}
                                  </div>
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
                    </div>
                  </div>
                ) : null;
              })()}

              {/* Control Effects Section */}
              {(() => {
                const hasControlType = spell?.effectTypes?.includes('control');
                const hasControlConfig = spell?.controlConfig;
                const hasSelectedEffects = spell?.controlConfig?.effects?.length > 0;

                // Show control effects if control type is selected OR control config exists
                if (!hasControlType && !hasControlConfig) return null;

                return (
                  <div className="healing-effects">
                    <div className="healing-effects-section">
                      {(() => {
                        const controlData = spell?.controlConfig;
                        if (!controlData && !hasControlType) return null;

                        const effects = [];

                        // Build duration text to append to effect descriptions
                        let durationText = '';
                        if (controlData?.duration !== null && controlData?.duration !== undefined) {
                          const durationUnit = controlData.durationUnit || 'rounds';
                          // Skip "0 instant" - don't show duration for instant effects
                          if (controlData.duration !== 0 || durationUnit !== 'instant') {
                            durationText = `${controlData.duration} ${durationUnit}`;
                            if (controlData.concentration === true) {
                              durationText += ' (Concentration)';
                            }
                          }
                        }

                        // Build saving throw text to append to effect descriptions
                        // Support both difficultyClass and saveDC field names
                        const isControlSaveObj = controlData?.savingThrow && typeof controlData.savingThrow === 'object';
                        const controlDC = (isControlSaveObj ? controlData.savingThrow.difficultyClass : null) || 
                                          (controlData?.difficultyClass !== null && controlData?.difficultyClass !== undefined ? controlData.difficultyClass : controlData?.saveDC);
                        const controlSaveType = (isControlSaveObj ? controlData.savingThrow.ability : null) || 
                                                controlData?.savingThrowType || 
                                                controlData?.saveType;
                        let saveText = '';
                        const hasControlSavingThrow = controlData?.savingThrow !== null && controlData?.savingThrow !== false;
                        if (hasControlSavingThrow && controlSaveType) {
                          const saveType = normalizeSaveType(controlSaveType);
                          if (controlDC) {
                            saveText = `DC ${controlDC} ${saveType} save`;
                          } else {
                            saveText = `${saveType} save`;
                          }
                        }

                        // Handle selected effects with their individual configurations
                        if (controlData?.effects?.length > 0) {
                          controlData.effects.forEach(effect => {
                            // Start with mechanicsText from effect if provided, otherwise build from config
                            let mechanicsText = effect.mechanicsText || '';

                            // Use individual effect config if available, otherwise use top-level control config
                            const effectConfig = effect.config || {};
                            const effectDuration = effectConfig.duration !== null && effectConfig.duration !== undefined ? effectConfig.duration : controlData.duration;
                            const effectDurationUnit = effectConfig.durationUnit !== null && effectConfig.durationUnit !== undefined ? effectConfig.durationUnit : (controlData.durationUnit || 'rounds');
                            const effectConcentration = effectConfig.concentration !== null && effectConfig.concentration !== undefined ? effectConfig.concentration : (controlData.concentration !== undefined ? controlData.concentration : false);
                            
                            const fallbackSaveType = (isControlSaveObj ? controlData.savingThrow.ability : null) || controlData.savingThrowType || controlData.saveType || 'strength';
                            const fallbackDC = (isControlSaveObj ? controlData.savingThrow.difficultyClass : null) || controlData.difficultyClass || controlData.saveDC;

                            const effectSavingThrowType = effectConfig.savingThrowType !== null && effectConfig.savingThrowType !== undefined ? effectConfig.savingThrowType : fallbackSaveType;
                            // Support both difficultyClass and saveDC field names
                            const effectDifficultyClass = effectConfig.difficultyClass !== null && effectConfig.difficultyClass !== undefined ? effectConfig.difficultyClass : 
                                                          (effectConfig.saveDC !== null && effectConfig.saveDC !== undefined ? effectConfig.saveDC :
                                                          fallbackDC);
                            const effectSavingThrow = effectConfig.savingThrow !== null && effectConfig.savingThrow !== undefined ? effectConfig.savingThrow : (controlData.savingThrow !== null && controlData.savingThrow !== false ? controlData.savingThrow : null);

                            // Build duration text for this effect
                            // âš ï¸ CRITICAL: Forced movement effects (push/pull) don't need duration
                            // Also prevent double formatting by only using effect-level duration if available
                            let effectDurationText = '';
                            const isForcedMovement = controlData?.controlType === 'forcedMovement';
                            
                            if (!isForcedMovement) {
                              // Only use effect-level duration if explicitly set, otherwise use top-level
                              if (effectDuration !== null && effectDuration !== undefined && effectConfig.duration !== undefined) {
                                // Skip "0 instant" - don't show duration for instant effects
                                if (effectDuration !== 0 || effectDurationUnit !== 'instant') {
                                  const durationLabel = effectDuration === 1 && effectDurationUnit === 'rounds' ? 'round' : 
                                                       effectDuration === 1 && effectDurationUnit === 'turns' ? 'turn' :
                                                       effectDurationUnit;
                                  effectDurationText = `Duration: ${effectDuration} ${durationLabel}`;
                                  if (effectConcentration === true) {
                                    effectDurationText += ' (Concentration)';
                                  }
                                }
                              } else if (durationText && !effectDurationText) {
                                // Use top-level duration only if effect-level wasn't set
                                // Also skip "0 instant" from top-level duration
                                if (!durationText.includes('0 instant')) {
                                  const durationValue = controlData?.duration;
                                  const durationLabel = durationValue === 1 && controlData.durationUnit === 'rounds' ? 'round' :
                                                       durationValue === 1 && controlData.durationUnit === 'turns' ? 'turn' :
                                                       controlData.durationUnit || 'rounds';
                                  effectDurationText = `Duration: ${durationValue} ${durationLabel}`;
                                }
                              }
                            }

                            // Build saving throw text for this effect
                            let effectSaveText = '';
                            if (effectSavingThrow && effectSavingThrow !== false && effectSavingThrowType && effectDifficultyClass) {
                              const saveType = normalizeSaveType(effectSavingThrowType);
                              effectSaveText = `DC ${effectDifficultyClass} ${saveType} save`;
                            } else if (saveText) {
                              effectSaveText = saveText;
                            }

                            // Add effect-specific configuration details (NOT duration/save/DC/distance)
                            // Distance should be in description, not mechanicsText
                            const configDetails = [];

                            if (effect.config) {
                              // Distance for forced movement - REMOVED: Should be in description only, not mechanicsText

                              // Movement type for forced movement - REMOVED: Already shown in description
                              // Don't add movement type to mechanicsText as it's redundant with the description

                              // Stat modifiers
                              if (effect.config.statModifiers && effect.config.statModifiers.length > 0) {
                                const modText = effect.config.statModifiers.map(mod =>
                                  `${mod.value > 0 ? '+' : ''}${mod.value}% ${mod.stat.charAt(0).toUpperCase() + mod.stat.slice(1)}`
                                ).join(', ');
                                configDetails.push(modText);
                              }

                              // Additional properties
                              if (effect.config.properties && effect.config.properties.length > 0) {
                                configDetails.push(effect.config.properties.join(', '));
                              }
                            }

                            // Only set mechanicsText if we have config details (NOT duration/save/DC)
                            // But only if mechanicsText wasn't already provided
                            if (!mechanicsText && configDetails.length > 0) {
                              mechanicsText = configDetails.join(' â€¢ ');
                            }

                            // Build the inline description with duration and save
                            // âš ï¸ CRITICAL: Check if description already contains duration/save info to avoid duplication
                            let baseDescription = effect.customDescription || effect.description || '';
                            const inlineDetails = [];
                            
                            // Only add duration if not already in description and not a forced movement effect
                            if (effectDurationText && !isForcedMovement) {
                              // Check if description already contains duration info
                              const hasDurationInDesc = baseDescription.toLowerCase().includes('duration') || 
                                                       baseDescription.toLowerCase().includes('round') ||
                                                       baseDescription.toLowerCase().includes('turn');
                              if (!hasDurationInDesc) {
                                inlineDetails.push(effectDurationText);
                              }
                            }
                            
                            // Only add save info if not already in description
                            if (effectSaveText) {
                              const hasSaveInDesc = baseDescription.toLowerCase().includes('dc ') || 
                                                   baseDescription.toLowerCase().includes('save');
                              if (!hasSaveInDesc) {
                                inlineDetails.push(effectSaveText);
                              }
                            }

                            // Combine base description with duration/save info (only if not already present)
                            let inlineDescription = '';
                            if (inlineDetails.length > 0) {
                              if (baseDescription) {
                                inlineDescription = baseDescription + ' - ' + inlineDetails.join(' - ');
                              } else {
                                inlineDescription = inlineDetails.join(' - ');
                              }
                            } else {
                              inlineDescription = baseDescription;
                            }

                            // Build effect name without DC (DC info goes in description)
                            let effectName = effect.customName || effect.name || 'Control Effect';

                            const controlTargeting = formatEffectTargeting('control');
                            effects.push({
                              name: effectName,
                              description: inlineDescription,
                              // Only show mechanicsText if we have config details, otherwise leave empty (don't show DC/save here)
                              mechanicsText: mechanicsText,
                              targeting: controlTargeting
                            });
                          });
                        }

                        // If spell has control effect type but no effects configured, show config if available
                        if (hasControlType && effects.length === 0) {
                          const inlineDetails = [];
                          if (durationText) inlineDetails.push(durationText);
                          if (saveText) inlineDetails.push(saveText);
                          
                          let description = 'Provides control over targets';
                          if (inlineDetails.length > 0) {
                            description = description + ' - ' + inlineDetails.join(' - ');
                          } else if (controlData && (controlData.duration || controlData.difficultyClass || controlData.concentration)) {
                            // Has some config but no effects - show basic config
                            description = 'Provides control over targets';
                          } else {
                            description = 'Effect details not configured';
                          }

                          const controlTargeting = formatEffectTargeting('control');
                          effects.push({
                            name: 'Control Effect',
                            description: description,
                            // Don't put duration/save in mechanicsText - it's already in description
                            mechanicsText: '',
                            targeting: controlTargeting
                          });
                        }

                        return effects.length > 0 ? (
                          <div className="healing-formula-line">
                            <div className="healing-effects-list">
                              {effects.map((effect, index) => (
                                <div key={`control-${index}`} className="healing-effect-item">
                                  <div className="healing-effect">
                                    <span className="healing-effect-name">
                                      {effect.name}
                                    </span>
                                    {effect.description && effect.description !== effect.name && (
                                      <span className="healing-effect-description">
                                        {" "}<span className="diamond-symbol">â—†</span>{" "}{effect.description}
                                      </span>
                                    )}
                                    {/* Targeting/Range badges */}
                                    {effect.targeting && (
                                      <div className="healing-effect-targeting">
                                        {effect.targeting.range && (
                                          <span className="targeting-badge range-badge">
                                            {effect.targeting.range}
                                          </span>
                                        )}
                                        {effect.targeting.targeting && (
                                          <span className="targeting-badge targeting-info-badge">
                                            {effect.targeting.targeting}
                                          </span>
                                        )}
                                        {effect.targeting.restrictions && (
                                          <span className="targeting-badge restrictions-badge">
                                            {effect.targeting.restrictions}
                                          </span>
                                        )}
                                        {effect.targeting.propagation && (
                                          <span className="targeting-badge propagation-badge">
                                            {effect.targeting.propagation}
                                          </span>
                                        )}
                                      </div>
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
                        ) : null;
                      })()}
                    </div>
                  </div>
                );
              })()}
              {/* Terrain Effects Section */}
              {(() => {
                const hasTerrainType = spell?.effectTypes?.includes('terrain');
                const terrainData = spell?.terrainConfig;
                const legacyTerrain = spell?.effects?.terrain || spellProp?.effects?.terrain;
                const hasTerrainConfig = !!terrainData;

                if (!hasTerrainType && !hasTerrainConfig && !legacyTerrain) return null;

                const effects = [];
                const durationConfig = spell?.durationConfig || terrainData?.durationConfig;

                if (legacyTerrain) {
                  const terrainType = legacyTerrain.type || 'difficult_terrain';
                  const terrainDuration = legacyTerrain.duration || durationConfig?.durationAmount || durationConfig?.duration;
                  const durationUnit = durationConfig?.durationType || 'minutes';

                  const terrainTypeLabels = {
                    'difficult_terrain': 'Difficult Terrain',
                    'difficult': 'Difficult Terrain',
                    'rough': 'Rough Terrain',
                    'hazardous': 'Hazardous Terrain',
                    'obstructed': 'Obstructed Terrain',
                    'entangling': 'Entangling Terrain',
                    'concealing': 'Concealing Terrain'
                  };

                  const label = terrainTypeLabels[terrainType] || terrainType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

                  let durationText = '';
                  if (terrainDuration) {
                    const unitMap = { 'rounds': 'rounds', 'minutes': 'min', 'hours': 'hrs', 'days': 'days' };
                    durationText = `${terrainDuration} ${unitMap[durationUnit] || durationUnit}`;
                  }

                  effects.push({
                    name: label,
                    description: `Area becomes ${label.toLowerCase()}`,
                    mechanicsText: durationText ? `Creatures in area have halved movement (${durationText})` : 'Creatures in area have halved movement'
                  });
                }

                if (terrainData?.effects?.length > 0) {
                  terrainData.effects.forEach(effect => {
                    effects.push({
                      name: effect.name || 'Terrain Effect',
                      description: effect.description || '',
                      mechanicsText: effect.mechanicsText || ''
                    });
                  });
                }

                return effects.length > 0 ? (
                  <div className="healing-effects">
                    <div className="healing-effects-section">
                      <div className="healing-formula-line">
                        <div className="healing-effects-list">
                          {effects.map((effect, index) => (
                            <div key={`terrain-${index}`} className="healing-effect-item">
                              <div className="healing-effect">
                                <span className="healing-effect-name">{effect.name}</span>
                                {effect.description && (
                                  <div className="healing-effect-description">
                                    {effect.description}
                                  </div>
                                )}
                                {effect.mechanicsText && (
                                  <div className="healing-effect-details">
                                    <div className="healing-effect-mechanics">
                                      {effect.mechanicsText}
                                    </div>
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : null;
              })()}
              {/* Summoning Effects Section */}
              {(() => {
                const hasSummoningType = spell?.effectTypes?.includes('summoning');
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

                if (!hasSummoningType && !hasAnySummoningConfiguration) return null;

                return (
                  <div className="healing-effects">
                    <div className="healing-effects-section">
                      {(() => {
                        if (!summoningData && !hasSummoningType) return null;

                        const effects = [];

                        // Handle selected creatures with individual configurations
                        if (summoningData?.creatures?.length > 0) {
                          summoningData.creatures.forEach(creature => {
                            const creatureConfig = creature.config || {};
                            const quantity = creatureConfig.quantity || 1;
                            const quantityText = quantity > 1 ? ` (Ã—${quantity})` : '';

                            // Build control type text from creature config
                            let controlTypeText = '';
                            if (creatureConfig.controlType) {
                              const controlTypeMap = {
                                'verbal': 'Verbal Commands',
                                'mental': 'Mental Link',
                                'empathic': 'Empathic Bond',
                                'autonomous': 'Autonomous'
                              };
                              controlTypeText = controlTypeMap[creatureConfig.controlType] ||
                                creatureConfig.controlType.charAt(0).toUpperCase() + creatureConfig.controlType.slice(1);

                              if (creatureConfig.controlRange !== undefined) {
                                const rangeText = creatureConfig.controlRange === 0 ? 'Unlimited' : `${creatureConfig.controlRange}ft`;
                                controlTypeText += ` (${rangeText})`;
                              }
                            }

                            // Build inline description with size, type, duration, and control
                            const inlineDetails = [];

                            // Add size and type
                            if (creature.size && creature.type) {
                              inlineDetails.push(`${creature.size} ${creature.type}`);
                            }

                            // Add duration
                            if (creatureConfig.hasDuration !== false) {
                              const duration = creatureConfig.duration || 10;
                              const unit = creatureConfig.durationUnit || 'minutes';
                              let durationText = `${duration} ${unit}`;
                              if (creatureConfig.concentration) {
                                durationText += ' (Concentration)';
                              }
                              inlineDetails.push(durationText);
                            } else {
                              inlineDetails.push('Permanent');
                            }

                            // Add control type
                            if (controlTypeText) {
                              inlineDetails.push(controlTypeText);
                            }

                            // Build enhanced creature stats text with AP
                            const stats = [];
                            if (creature.stats?.maxHp || creature.stats?.hp) {
                              stats.push(`HP: ${creature.stats.maxHp || creature.stats.hp}`);
                            }
                            if (creature.stats?.maxMana) {
                              stats.push(`Mana: ${creature.stats.maxMana}`);
                            }
                            if (creature.stats?.maxAp || creature.stats?.ap) {
                              stats.push(`AP: ${creature.stats.maxAp || creature.stats.ap}`);
                            }

                            // Build enhanced mechanics text with proper hierarchy
                            let mechanicsText = '';
                            if (creature.description) {
                              mechanicsText = creature.description;
                              if (stats.length > 0) {
                                mechanicsText += ' â€¢ ' + stats.join(' â€¢ ');
                              }
                            } else {
                              mechanicsText = stats.length > 0 ? stats.join(' â€¢ ') : `Summons ${creature.name}`;
                            }

                            // Add attached effects to mechanics text
                            if (creatureConfig.attachedEffects) {
                              const attachedMechanics = [];

                              Object.entries(creatureConfig.attachedEffects).forEach(([effectKey, effectData]) => {
                                if (!effectData) return;

                              let attachedText = '';
                              switch (effectData.effectType) {
                                case 'damage':
                                  attachedText = `${effectData.formula} ${effectData.elementType || 'arcane'} damage in ${effectData.areaRadius || 10}ft radius`;
                                  if (effectData.tickRate && effectData.tickRate > 1) {
                                    attachedText += ` every ${effectData.tickRate} ${effectData.tickUnit || 'rounds'}`;
                                  }
                                  break;
                                case 'healing':
                                  attachedText = `${effectData.formula} healing in ${effectData.areaRadius || 10}ft radius`;
                                  if (effectData.tickRate && effectData.tickRate > 1) {
                                    attachedText += ` every ${effectData.tickRate} ${effectData.tickUnit || 'rounds'}`;
                                  }
                                  break;
                                case 'buff':
                                  const buffValue = effectData.magnitudeType === 'multiplier' ? `x${effectData.magnitude}` :
                                                   effectData.magnitudeType === 'percentage' ? `${effectData.magnitude}%` :
                                                   `${effectData.magnitude > 0 ? '+' : ''}${effectData.magnitude}`;
                                  attachedText = `${effectData.stat || 'stat'} ${buffValue} in ${effectData.areaRadius || 10}ft radius`;
                                  break;
                                case 'debuff':
                                  const debuffValue = effectData.magnitudeType === 'multiplier' ? `x${effectData.magnitude}` :
                                                     effectData.magnitudeType === 'percentage' ? `${effectData.magnitude}%` :
                                                     `${effectData.magnitude}`;
                                  attachedText = `${effectData.stat || 'stat'} ${debuffValue} in ${effectData.areaRadius || 10}ft radius`;
                                  if (effectData.saveDC) {
                                    attachedText += ` â€¢ DC ${effectData.saveDC} ${effectData.saveType} save (${effectData.saveOutcome})`;
                                  }
                                  break;
                                case 'control':
                                  let controlDesc = '';
                                  switch (effectData.controlType) {
                                    case 'push':
                                      controlDesc = `Push ${effectData.distance || 10}ft`;
                                      break;
                                    case 'pull':
                                      controlDesc = `Pull ${effectData.distance || 10}ft`;
                                      break;
                                    case 'incapacitation':
                                      controlDesc = 'Stun';
                                      break;
                                    case 'knockdown':
                                      controlDesc = 'Knock prone';
                                      break;
                                    case 'restraint':
                                      controlDesc = 'Restrain';
                                      break;
                                    default:
                                      controlDesc = 'Control effect';
                                  }
                                  attachedText = `${controlDesc} in ${effectData.areaRadius || 10}ft radius`;
                                  if (effectData.saveDC) {
                                    attachedText += ` â€¢ DC ${effectData.saveDC} ${effectData.saveType} save (${effectData.saveOutcome})`;
                                  }
                                  break;
                                default:
                                  attachedText = 'Attached effect';
                              }

                                if (attachedText) {
                                  attachedMechanics.push(attachedText);
                                }
                              });

                              if (attachedMechanics.length > 0) {
                                mechanicsText += (mechanicsText ? ' â€¢ ' : '') + attachedMechanics.join(' â€¢ ');
                              }
                            }

                            // Will attach conditional formulas after helper is defined
                            effects.push({
                              name: `Summon ${creature.name}${quantityText}`,
                              description: inlineDetails.join(' - '),
                              mechanicsText: mechanicsText || 'Summoned creature',
                              abilities: creature.abilities || []
                            });
                          });
                        }

                        // Helper to get effect-specific triggers and conditional formulas for summoning
                        const getSummoningTriggersAndFormulas = (effectSubType) => {
                          const baseType = effectSubType.includes('_') ? effectSubType.split('_')[0] : effectSubType;
                          const effectTriggers = spell?.triggerConfig?.effectTriggers?.[effectSubType] || 
                                                 spell?.triggerConfig?.effectTriggers?.[baseType];
                          const conditionalFormulas = spell?.triggerConfig?.conditionalEffects?.[effectSubType]?.conditionalFormulas ||
                                                     spell?.triggerConfig?.conditionalEffects?.[baseType]?.conditionalFormulas;
                          const hasConditionals = conditionalFormulas && Object.keys(conditionalFormulas).length > 0 && Object.keys(conditionalFormulas).some(k => k !== 'default');
                          
                          if (!hasConditionals) return null;
                          
                          const formulas = Object.entries(conditionalFormulas)
                            .filter(([triggerId]) => triggerId !== 'default')
                            .map(([triggerId, formula]) => {
                              const trigger = effectTriggers?.compoundTriggers?.find(t => t.id === triggerId);
                              const triggerName = trigger ? formatTriggerForConditionalDisplay(trigger) : formatTriggerId(triggerId);
                              return { triggerId, formula, triggerName };
                            });
                          
                          return { formulas };
                        };

                        // Attach conditional formulas to all summoning effects
                        const summoningTriggers = getSummoningTriggersAndFormulas('summoning');
                        effects.forEach(effect => {
                          effect.conditionalFormulas = summoningTriggers?.formulas || [];
                        });

                        // Handle flat structure (legacy format with creatureName, creatureStats, etc.)
                        if (effects.length === 0 && summoningData?.creatureName) {
                          const quantity = summoningData.maxSummons || 1;
                          const quantityText = quantity > 1 ? ` (Ã—${quantity})` : '';

                          // Build inline details for duration, control type, etc.
                          const inlineDetails = [];

                          // Add creature type if available
                          if (summoningData.creatureType) {
                            inlineDetails.push(summoningData.creatureType.replace(/_/g, ' '));
                          }

                          // Add duration
                          if (summoningData.duration !== undefined && summoningData.duration !== null) {
                            const durationUnit = summoningData.durationType || 'minutes';
                            let durationText = `${summoningData.duration} ${durationUnit}`;
                            if (spell?.durationConfig?.requiresConcentration) {
                              durationText += ' (Concentration)';
                            }
                            inlineDetails.push(durationText);
                          }

                          // Add control type
                          if (summoningData.controlType) {
                            const controlTypeMap = {
                              'full': 'Full Control',
                              'limited': 'Limited Control',
                              'autonomous': 'Autonomous',
                              'friendly': 'Friendly'
                            };
                            inlineDetails.push(controlTypeMap[summoningData.controlType] || summoningData.controlType);
                          }

                          // Build creature stats text
                          const stats = [];
                          const creatureStats = summoningData.creatureStats || {};
                          if (creatureStats.health) {
                            stats.push(`HP: ${creatureStats.health}`);
                          }
                          if (creatureStats.damage) {
                            stats.push(`Damage: ${creatureStats.damage}`);
                          }
                          if (creatureStats.attackBonus) {
                            stats.push(`Attack: +${creatureStats.attackBonus}`);
                          }

                          // Add abilities if present
                          let mechanicsText = stats.join(' â€¢ ');
                          if (creatureStats.abilities?.length > 0) {
                            const abilitiesText = `Abilities: ${creatureStats.abilities.join(', ')}`;
                            mechanicsText = mechanicsText ? `${mechanicsText} â€¢ ${abilitiesText}` : abilitiesText;
                          }

                          const summoningTriggers = getSummoningTriggersAndFormulas('summoning');
                          effects.push({
                            name: `Summon ${summoningData.creatureName}${quantityText}`,
                            description: inlineDetails.join(' - '),
                            mechanicsText: mechanicsText || 'Summoned creature',
                            conditionalFormulas: summoningTriggers?.formulas || []
                          });
                        }

                        // If spell has summoning effect type but no config, show a basic effect
                        if (hasSummoningType && effects.length === 0) {
                          const summoningTriggers = getSummoningTriggersAndFormulas('summoning');
                          effects.push({
                            name: 'Summoning Effect',
                            description: 'Summons creatures or objects',
                            mechanicsText: 'Effect details not configured',
                            conditionalFormulas: summoningTriggers?.formulas || []
                          });
                        }

                        return effects.length > 0 ? (
                          <div className="healing-formula-line">
                            <div className="healing-effects-list">
                              {effects.map((effect, index) => (
                                <div key={`summoning-${index}`} className="healing-effect-item">
                                  <div className="healing-effect">
                                    <span className="healing-effect-name">
                                      {effect.name}
                                    </span>
                                    {effect.description && effect.description !== effect.name && (
                                      <span className="healing-effect-description">
                                        {" "}<span className="diamond-symbol">â—†</span>{" "}{effect.description}
                                      </span>
                                    )}
                                    {/* Targeting/Range badges */}
                                    {effect.targeting && (
                                      <div className="healing-effect-targeting">
                                        {effect.targeting.range && (
                                          <span className="targeting-badge range-badge">
                                            {effect.targeting.range}
                                          </span>
                                        )}
                                        {effect.targeting.targeting && (
                                          <span className="targeting-badge targeting-info-badge">
                                            {effect.targeting.targeting}
                                          </span>
                                        )}
                                        {effect.targeting.restrictions && (
                                          <span className="targeting-badge restrictions-badge">
                                            {effect.targeting.restrictions}
                                          </span>
                                        )}
                                        {effect.targeting.propagation && (
                                          <span className="targeting-badge propagation-badge">
                                            {effect.targeting.propagation}
                                          </span>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                  {effect.mechanicsText && (
                                    <div className="healing-effect-details">
                                      <div className="healing-effect-mechanics">
                                        {effect.mechanicsText}
                                      </div>
                                    </div>
                                  )}
                                  {effect.abilities && effect.abilities.length > 0 && (
                                    <div className="summon-creature-abilities" style={{ marginTop: '4px', paddingTop: '4px', borderTop: '1px solid rgba(139, 115, 85, 0.2)' }}>
                                      {effect.abilities.map((ab, abIdx) => {
                                        const apCost = ab.resourceCost?.actionPoints ?? ab.castingConfig?.actionPointCost ?? ab.actionPointCost;
                                        const manaCost = ab.resourceCost?.resourceValues?.mana;
                                        const metaParts = [];
                                        if (apCost > 0) metaParts.push(`${apCost} AP`);
                                        if (manaCost > 0) metaParts.push(`${manaCost} Mana`);
                                        const effectParts = [];
                                        if (ab.damageConfig?.formula) {
                                          let dmgText = ab.damageConfig.formula;
                                          if (ab.damageConfig.elementType) dmgText += ` ${ab.damageConfig.elementType}`;
                                          effectParts.push(dmgText + ' damage');
                                        }
                                        if (ab.healingConfig?.formula) {
                                          effectParts.push(ab.healingConfig.formula + ' healing');
                                        }
                                        if (ab.buffConfig?.effects?.length) {
                                          const buffs = ab.buffConfig.effects.map(e => {
                                            if (e.type === 'vulnerability' || e.type === 'resistance' || e.type === 'immunity') {
                                              return `${e.type} to ${e.element || e.stat || 'damage'}`;
                                            }
                                            const val = e.magnitude > 0 ? `+${e.magnitude}` : e.magnitude;
                                            return `${e.stat || 'stat'} ${val}`;
                                          });
                                          effectParts.push(buffs.join(', '));
                                        }
                                        if (ab.debuffConfig?.effects?.length) {
                                          const debuffs = ab.debuffConfig.effects.map(e => {
                                            if (e.type === 'vulnerability' || e.type === 'resistance' || e.type === 'immunity') {
                                              return `${e.type} to ${e.element || e.stat || 'damage'}`;
                                            }
                                            const val = e.magnitude < 0 ? e.magnitude : `-${Math.abs(e.magnitude)}`;
                                            return `${e.stat || 'stat'} ${val}`;
                                          });
                                          effectParts.push(debuffs.join(', '));
                                          if (ab.debuffConfig.saveDC) {
                                            effectParts.push(`DC ${ab.debuffConfig.saveDC} ${ab.debuffConfig.saveType || ''} save`);
                                          }
                                        }
                                        if (ab.controlConfig) {
                                          const ctrlMap = { forcedMovement: 'Push/Pull', incapacitation: 'Stun', restraint: 'Restrain', knockdown: 'Knockdown' };
                                          effectParts.push(ctrlMap[ab.controlConfig.controlType] || ab.controlConfig.controlType || 'Control');
                                          if (ab.controlConfig.saveDC) {
                                            effectParts.push(`DC ${ab.controlConfig.saveDC} ${ab.controlConfig.saveType || ''} save`);
                                          }
                                        }
                                        return (
                                          <div key={abIdx} className="summon-ability-entry" style={{ fontSize: '0.88em', marginTop: abIdx > 0 ? '3px' : '0', display: 'flex', gap: '6px', alignItems: 'baseline', flexWrap: 'wrap' }}>
                                            <span style={{ color: '#6b4226', fontWeight: 600, whiteSpace: 'nowrap' }}>{ab.name || 'Ability'}</span>
                                            {metaParts.length > 0 && (
                                              <span style={{ color: '#8b7355', fontSize: '0.9em' }}>[{metaParts.join(' \u2022 ')}]</span>
                                            )}
                                            {effectParts.length > 0 && (
                                              <span style={{ color: '#5a4a3a' }}>{effectParts.join(' \u2022 ')}</span>
                                            )}
                                            {ab.description && (
                                              <span style={{ color: '#5a4a3a', fontStyle: 'italic' }}>&#8212; {ab.description}</span>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                  {/* Conditional formulas */}
                                  {effect.conditionalFormulas && effect.conditionalFormulas.length > 0 && (
                                    <div className="healing-effect-details" style={{ marginTop: '4px', paddingTop: '4px', borderTop: '1px solid rgba(139, 115, 85, 0.2)' }}>
                                      {effect.conditionalFormulas.map((cf, cfIndex) => {
                                        const triggerText = cf.triggerName.startsWith('When ') ? cf.triggerName.replace('When ', 'If ') : `If ${cf.triggerName}`;
                                        return (
                                          <div key={cfIndex} className="healing-effect-mechanics" style={{ fontSize: '0.9em', marginTop: cfIndex > 0 ? '4px' : '0' }}>
                                            <strong>{triggerText}:</strong> Enhanced effect
                                          </div>
                                        );
                                      })}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : null;
                      })()}
                    </div>
                  </div>
                );
              })()}

              {/* Transformation Effects Section */}
              {(() => {
                const hasTransformationType = spell?.effectTypes?.includes('transformation');
                const transformationData = spell?.transformationConfig || spell?.transformConfig;
                const hasTransformationConfig = !!transformationData;
                const hasSelectedCreature = transformationData?.selectedCreature || transformationData?.formId;

                if (!hasTransformationType && !hasTransformationConfig) return null;

                return (
                  <div className="healing-effects">
                    <div className="healing-effects-section">
                      {(() => {
                        if (!transformationData && !hasTransformationType) return null;

                        const effects = [];

                        // Helper to get effect-specific triggers and conditional formulas for transformation
                        const getTransformationTriggersAndFormulas = (effectSubType) => {
                          const baseType = effectSubType.includes('_') ? effectSubType.split('_')[0] : effectSubType;
                          const effectTriggers = spell?.triggerConfig?.effectTriggers?.[effectSubType] || 
                                                 spell?.triggerConfig?.effectTriggers?.[baseType];
                          const conditionalFormulas = spell?.triggerConfig?.conditionalEffects?.[effectSubType]?.conditionalFormulas ||
                                                     spell?.triggerConfig?.conditionalEffects?.[baseType]?.conditionalFormulas;
                          const hasConditionals = conditionalFormulas && Object.keys(conditionalFormulas).length > 0 && Object.keys(conditionalFormulas).some(k => k !== 'default');
                          
                          if (!hasConditionals) return null;
                          
                          const formulas = Object.entries(conditionalFormulas)
                            .filter(([triggerId]) => triggerId !== 'default')
                            .map(([triggerId, formula]) => {
                              const trigger = effectTriggers?.compoundTriggers?.find(t => t.id === triggerId);
                              const triggerName = trigger ? formatTriggerForConditionalDisplay(trigger) : formatTriggerId(triggerId);
                              return { triggerId, formula, triggerName };
                            });
                          
                          return { formulas };
                        };

                        // Build inline details for duration, target type, and saving throw
                        const inlineDetails = [];

                        // Add duration
                        if (transformationData?.duration) {
                          const durationUnit = transformationData.durationUnit || 'minutes';
                          let durationText = `${transformationData.duration} ${durationUnit}`;
                          if (transformationData.concentration) {
                            durationText += ' (Concentration)';
                          }
                          inlineDetails.push(durationText);
                        }

                        // Add target type
                        if (transformationData?.targetType) {
                          const targetTypeMap = {
                            'self': 'Self',
                            'willing': 'Willing Target',
                            'unwilling': 'Unwilling Target'
                          };
                          const targetText = targetTypeMap[transformationData.targetType] || transformationData.targetType;
                          inlineDetails.push(targetText);
                        }

                        // Add saving throw for unwilling targets
                        if (transformationData?.targetType === 'unwilling' && transformationData?.saveType) {
                          const saveTypeMap = {
                            'con': 'Constitution',
                            'str': 'Strength',
                            'agi': 'Agility',
                            'int': 'Intelligence',
                            'spirit': 'Spirit',
                            'cha': 'Charisma'
                          };
                          const saveTypeText = saveTypeMap[transformationData.saveType] || normalizeSaveType(transformationData.saveType);
                          const dc = transformationData.difficultyClass || 15;
                          inlineDetails.push(`DC ${dc} ${saveTypeText}`);
                        }

                        // Handle transformation with targetForm or selectedCreature (creature library)
                        if (transformationData?.targetForm || transformationData?.selectedCreature) {
                          const creature = transformationData.selectedCreature;
                          const targetForm = transformationData.targetForm;
                          const transformationType = transformationData.transformationType || 'creature';

                          // Build enhanced stats text
                          const stats = [];

                          if (creature) {
                            // Full creature data available with enhanced stat display
                            if (creature.stats?.maxHp || creature.stats?.hp) {
                              stats.push(`HP: ${creature.stats.maxHp || creature.stats.hp}`);
                            }
                            if (creature.stats?.maxMana || creature.stats?.mana) {
                              stats.push(`Mana: ${creature.stats.maxMana || creature.stats.mana}`);
                            }
                            if (creature.stats?.maxAp || creature.stats?.ap) {
                              stats.push(`AP: ${creature.stats.maxAp || creature.stats.ap}`);
                            }
                           }
                           if (transformationData.maintainEquipment === true) {
                            stats.push('Equipment maintained');
                          } else if (transformationData.maintainEquipment === false) {
                            stats.push('Equipment lost');
                          }
                          if (transformationData.retainsAbilities === false) {
                            stats.push('Loses original abilities');
                          }

                          // Enhanced saving throw info with proper normalization
                          if (transformationData.targetType === 'unwilling' && transformationData.saveType && transformationData.difficultyClass) {
                            const saveType = normalizeSaveType(transformationData.saveType);
                            stats.push(`${saveType} save DC ${transformationData.difficultyClass}`);
                          }

                          // Build mechanics text with proper hierarchy
                          let mechanicsText = '';
                          if (creature?.description) {
                            mechanicsText = creature.description;
                            if (stats.length > 0) {
                              mechanicsText += ' â€¢ ' + stats.join(' â€¢ ');
                            }
                          } else {
                            mechanicsText = stats.length > 0 ? stats.join(' â€¢ ') : `Transform into ${transformationType}`;
                          }

                          const formName = creature?.name || (targetForm ? targetForm.charAt(0).toUpperCase() + targetForm.slice(1) : 'creature');
                          const formType = creature ? `${creature.size} ${creature.type}` : transformationType;

                          const transformationTriggers = getTransformationTriggersAndFormulas('transformation');
                          effects.push({
                            name: `Transform into ${formName}`,
                            description: `${formType}${inlineDetails.length > 0 ? ' - ' + inlineDetails.join(' - ') : ''}`,
                            mechanicsText: mechanicsText || 'Transform into creature',
                            conditionalFormulas: transformationTriggers?.formulas || []
                          });
                        }
                        // Handle CUSTOM transformations (enhanced custom mode with isCustom flag or transformationType + form name)
                        else if (transformationData?.isCustom || transformationData?.transformationType || transformationData?.newForm || transformationData?.formName || transformationData?.customName || transformationData?.transformType || transformationData?.form) {
                          // Get the form/transformation name from various possible fields
                          const formName = transformationData.newForm ||
                                          transformationData.formName ||
                                          transformationData.customName ||
                                          transformationData.form ||
                                          null;
                          
                          // Get the transformation type
                          const transformationType = transformationData.transformationType || 
                                                    transformationData.transformType || 
                                                    'physical';
                          
                          // Format transformation type for display
                          const formatTransformType = (type) => {
                            if (!type) return 'Transformation';
                            const typeMap = {
                              'physical': 'Physical Transformation',
                              'elemental': 'Elemental Transformation',
                              'mental': 'Mental Transformation',
                              'shapechange': 'Shapechange',
                              'ascended': 'Ascended Form',
                              'spectral': 'Spectral Form',
                              'phaseshift': 'Phase Shift',
                              'stance_mastery': 'Stance Mastery',
                              'arcane': 'Arcane Transformation',
                              'celestial': 'Celestial Transformation',
                              'divine': 'Divine Transformation',
                              'full': 'Full Transformation'
                            };
                            return typeMap[type] || type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                          };

                          // Build the description with inline details
                          let description = formatTransformType(transformationType);
                          if (inlineDetails.length > 0) {
                            description += ' - ' + inlineDetails.join(' - ');
                          }
                          
                          // Get power level if specified
                          const power = transformationData.power;
                          const powerText = power ? ` (${power.charAt(0).toUpperCase() + power.slice(1)})` : '';

                          // Build mechanics text from description field if available
                          let mechanicsText = transformationData.description || '';

                          const transformationTriggers = getTransformationTriggersAndFormulas('transformation');
                          
                          // Only add the main transformation effect if we have a form name
                          if (formName) {
                            effects.push({
                              name: formName + powerText,
                              description: description,
                              mechanicsText: mechanicsText || `Transforms into ${formName}`,
                              conditionalFormulas: transformationTriggers?.formulas || []
                            });
                          } else {
                            // No specific form name, just show the transformation type
                            effects.push({
                              name: formatTransformType(transformationType) + powerText,
                              description: inlineDetails.length > 0 ? inlineDetails.join(' - ') : '',
                              mechanicsText: mechanicsText || 'Enhances your physical form',
                              conditionalFormulas: transformationTriggers?.formulas || []
                            });
                          }
                        }

                        // Add resistance effect for unwilling targets
                        if (transformationData?.targetType === 'unwilling' && transformationData?.saveType && transformationData?.difficultyClass) {
                          effects.push({
                            name: 'Transformation Resistance',
                            description: `${normalizeSaveType(transformationData.saveType)} save DC ${transformationData.difficultyClass}`,
                            mechanicsText: 'Target can resist transformation with a successful saving throw'
                          });
                        }

                        // Handle granted abilities (enhanced with categories and better formatting)
                        if (transformationData?.grantedAbilities?.length > 0) {
                          transformationData.grantedAbilities.forEach(ability => {
                            const categoryText = ability.category ? `${ability.category.charAt(0).toUpperCase() + ability.category.slice(1)} Ability` : 'Special Ability';
                            effects.push({
                              name: `Granted: ${ability.name}`,
                              description: categoryText,
                              mechanicsText: ability.description || `Grants ${ability.name.toLowerCase()}`
                            });
                          });
                        }

                        // Handle special effects - convert to "Granted:" entries like grantedAbilities
                        // Only process if grantedAbilities don't exist (to avoid duplicates)
                        if (transformationData?.specialEffects?.length > 0 && !transformationData?.grantedAbilities?.length) {
                          // Map special effect IDs to proper names and concrete TTRPG descriptions
                          const specialEffectMap = {
                            'shadow_entity': {
                              name: 'Shadow Entity',
                              description: 'Physical damage reduced by 50%. Your form becomes partially incorporeal, allowing physical attacks to pass through you with reduced effectiveness.'
                            },
                            'teleportation': {
                              name: 'Teleportation',
                              description: 'Teleport up to 30 feet as a bonus action. You can move through shadows and darkness instantly.'
                            },
                            'damage_reduction': {
                              name: 'Necrotic Resilience',
                              description: 'Reduce all incoming damage by 1d6 (flat reduction per hit). Your shadow form absorbs and disperses incoming attacks.'
                            },
                            'wall_phasing': {
                              name: 'Wall Phasing',
                              description: 'Pass through non-magical barriers and obstacles. You can move through walls, doors, and other solid objects that are not magically warded.'
                            },
                            'flight': {
                              name: 'Flight',
                              description: 'Gain fly speed 30 feet. You can hover and move through the air with ease.'
                            },
                            'invisibility': {
                              name: 'Invisibility',
                              description: 'Become invisible. Attacks against you have disadvantage, and you have advantage on stealth checks.'
                            },
                            'invisibility_to_enemies': {
                              name: 'Invisibility to Enemies',
                              description: 'Enemies cannot see you. You have advantage on stealth checks and attacks against you have disadvantage.'
                            },
                            'ethereal': {
                              name: 'Ethereal Form',
                              description: 'Pass through solid objects and barriers. You cannot interact with physical objects while ethereal.'
                            },
                            'incorporeal': {
                              name: 'Incorporeal',
                              description: 'Immune to bludgeoning, piercing, and slashing damage from non-magical sources. Physical attacks pass through you.'
                            },
                            'regeneration': {
                              name: 'Regeneration',
                              description: 'Regain 1d6 + Constitution modifier HP at the start of each turn. This healing cannot exceed your maximum HP.'
                            },
                            'damage_immunity': {
                              name: 'Damage Immunity',
                              description: 'Immune to specific damage types. All damage of the specified type is reduced to 0.'
                            },
                            'complete_immunity': {
                              name: 'Complete Immunity',
                              description: 'Immune to all damage. You take no damage from any source.'
                            },
                            'resistance': {
                              name: 'Resistance',
                              description: 'Reduce incoming damage by 50%. You take half damage from the specified damage types.'
                            },
                            'enhanced_senses': {
                              name: 'Enhanced Senses',
                              description: '+5 to Perception and Investigation checks. You can detect hidden entities and see through illusions.'
                            },
                            'supernatural_senses': {
                              name: 'Supernatural Senses',
                              description: 'Detect hidden entities within 60 feet. You can see through illusions and detect invisible creatures.'
                            },
                            'enhanced_speed': {
                              name: 'Enhanced Speed',
                              description: '+10 feet movement speed. Your movement is faster and more agile.'
                            },
                            'natural_weapons': {
                              name: 'Natural Weapons',
                              description: 'Claw attacks deal 1d6 + Strength modifier slashing damage. You gain natural melee weapons.'
                            },
                            'size_change': {
                              name: 'Size Change',
                              description: 'Size increases or decreases by one category. Your physical dimensions change accordingly.'
                            },
                            'elemental_form': {
                              name: 'Elemental Form',
                              description: 'Become an elemental. Gain elemental immunities and vulnerabilities based on element type.'
                            },
                            'phase_shift': {
                              name: 'Phase Shift',
                              description: 'Shift partially between planes. Gain ethereal properties and can pass through solid matter.'
                            },
                            'shadow_step': {
                              name: 'Shadow Step',
                              description: 'Teleport up to 30 feet through shadows as a bonus action. Requires shadows or darkness at destination.'
                            },
                            'shadow_manipulation': {
                              name: 'Shadow Manipulation',
                              description: 'Control and shape shadows within 30 feet. Create shadow barriers, weapons, or other constructs.'
                            },
                            'damage_absorption': {
                              name: 'Damage Absorption',
                              description: 'Absorb up to 2d6 damage, convert to temporary HP. Excess damage beyond absorption still applies.'
                            },
                            'spell_resistance': {
                              name: 'Spell Resistance',
                              description: 'Advantage on saving throws against spells. You are more resistant to magical effects.'
                            },
                            'magic_immunity': {
                              name: 'Magic Immunity',
                              description: 'Immune to spells and magical effects. Spells cannot target or affect you.'
                            },
                            'void_existence': {
                              name: 'Void Existence',
                              description: 'Exist between planes. Difficult to target, attacks against you have disadvantage.'
                            },
                            'teleport_anywhere': {
                              name: 'Teleport Anywhere',
                              description: 'Teleport to any location you can see or have visited. Range unlimited, requires line of sight or previous visit.'
                            },
                            'instant_teleport': {
                              name: 'Instant Teleport',
                              description: 'Teleport up to 60 feet as free action, no action point cost. Can be used multiple times per turn.'
                            },
                            'ignore_defenses': {
                              name: 'Ignore Defenses',
                              description: 'Attacks bypass armor class and damage resistances. Your attacks ignore target defenses.'
                            },
                            'instant_death_zone': {
                              name: 'Instant Death Zone',
                              description: 'Creatures with less than 50 HP die instantly in area. No saving throw, instant death.'
                            },
                            'complete_evil_immunity': {
                              name: 'Complete Evil Immunity',
                              description: 'Immune to all evil-aligned spells and effects. Evil creatures cannot harm you with magic.'
                            },
                            'necrotic_judgment': {
                              name: 'Necrotic Judgment',
                              description: 'Deal 2d8 necrotic damage to evil creatures. This damage cannot be reduced or resisted.'
                            },
                            'truth_compulsion': {
                              name: 'Truth Compulsion',
                              description: 'Targets must make DC 15 Charisma save or speak only truth. Cannot tell lies while affected.'
                            },
                            'zone_of_decay': {
                              name: 'Zone of Decay',
                              description: 'Creatures in area take 1d6 necrotic damage per round. Area persists for duration of transformation.'
                            },
                            'auto_crit': {
                              name: 'Auto Crit',
                              description: 'All attacks automatically score critical hits. Roll damage dice twice and add modifiers once.'
                            },
                            'evil_banishment': {
                              name: 'Evil Banishment',
                              description: 'Banish evil creatures. DC 17 Charisma save negates. On failure, creature is banished to another plane.'
                            }
                          };

                          transformationData.specialEffects.forEach(effectId => {
                            // Check if it's already a formatted string
                            if (effectId.includes('(') || effectId.includes(':') || effectId.includes('+') || effectId.includes('d')) {
                              // Already formatted, use as-is
                              effects.push({
                                name: `Granted: Special Effect`,
                                description: 'Transformation Ability',
                                mechanicsText: effectId
                              });
                            } else {
                              // Look up in map or convert ID to readable format
                              const effectData = specialEffectMap[effectId];
                              if (effectData) {
                                effects.push({
                                  name: `Granted: ${effectData.name}`,
                                  description: 'Transformation Ability',
                                  mechanicsText: effectData.description
                                });
                              } else {
                                // Fallback: convert ID to readable format
                                const readableName = effectId.split('_').map(word => 
                                  word.charAt(0).toUpperCase() + word.slice(1)
                                ).join(' ');
                                effects.push({
                                  name: `Granted: ${readableName}`,
                                  description: 'Transformation Ability',
                                  mechanicsText: `Grants ${readableName.toLowerCase()}`
                                });
                              }
                            }
                          });
                        }

                        // If spell has transformation effect type but no config, show a basic effect
                        if (hasTransformationType && effects.length === 0) {
                          const transformationTriggers = getTransformationTriggersAndFormulas('transformation');
                          effects.push({
                            name: 'Transformation Effect',
                            description: 'Changes form or shape',
                            mechanicsText: 'Effect details not configured',
                            conditionalFormulas: transformationTriggers?.formulas || []
                          });
                        }

                        return effects.length > 0 ? (
                          <div className="healing-formula-line">
                            <div className="healing-effects-list">
                              {effects.map((effect, index) => (
                                <div key={`transformation-${index}`} className="healing-effect-item">
                                  <div className="healing-effect">
                                    <span className="healing-effect-name">
                                      {effect.name}
                                    </span>
                                    {effect.description && effect.description !== effect.name && (
                                      <span className="healing-effect-description">
                                        {" "}<span className="diamond-symbol">â—†</span>{" "}{effect.description}
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
                        ) : null;
                      })()}
                    </div>
                  </div>
                );
              })()}

              {/* Purification Effects Section */}
              {(() => {
                const hasPurificationType = spell?.effectTypes?.includes('purification');
                const purificationData = spell?.purificationConfig;
                const hasPurificationConfig = !!purificationData;
                const activeEffects = purificationData?.selectedEffects || purificationData?.effects || [];
                const hasSelectedEffects = activeEffects.length > 0;
                const hasAnyPurificationConfiguration = hasPurificationConfig && (
                  purificationData.purificationType ||
                  purificationData.resolution ||
                  purificationData.resurrectionFormula ||
                  hasSelectedEffects
                );

                if (!hasPurificationType && !hasAnyPurificationConfiguration) return null;

                return (
                  <div className="healing-effects">
                    <div className="healing-effects-section">
                      {(() => {
                        if (!purificationData && !hasPurificationType) return null;

                        const effects = [];

                        // Build inline details for duration and difficulty
                        const inlineDetails = [];

                        // Add duration (purification is usually instant)
                        if (purificationData?.duration && purificationData.duration !== 'instant') {
                          const durationUnit = purificationData.durationUnit || 'rounds';
                          inlineDetails.push(`${purificationData.duration} ${durationUnit}`);
                        } else {
                          inlineDetails.push('Instantaneous');
                        }

                        // Add difficulty class if present, but only if no effects are selected and no resurrection is configured
                        const hasResurrection = !!purificationData?.resurrectionFormula;
                        if (purificationData?.difficultyClass && !hasSelectedEffects && !hasResurrection) {
                          const saveType = purificationData.abilitySave || 'spirit';
                          const saveTypeMap = {
                            'str': 'Strength',
                            'agi': 'Agility',
                            'con': 'Constitution',
                            'int': 'Intelligence',
                            'spi': 'Spirit',
                            'cha': 'Charisma'
                          };
                          const saveText = saveTypeMap[saveType] || normalizeSaveType(saveType);
                          inlineDetails.push(`DC ${purificationData.difficultyClass} ${saveText}`);
                        }

                        // Handle purification type and target effects
                        if (purificationData?.purificationType || purificationData?.targetEffects) {
                          const purificationType = purificationData.purificationType || 'cleanse';
                          const targetEffects = purificationData.targetEffects || [];
                          const strength = purificationData.strength || 'moderate';

                          // Format purification type name
                          const typeMap = {
                            'cleanse_all': 'Cleanse All',
                            'cleanse_specific': 'Cleanse Specific',
                            'dispel_magic': 'Dispel Magic',
                            'remove_curse': 'Remove Curse',
                            'neutralize_poison': 'Neutralize Poison',
                            'cure_disease': 'Cure Disease'
                          };
                          const typeName = typeMap[purificationType] || purificationType.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

                          // Build mechanics text
                          let mechanicsText = '';
                          if (targetEffects.length > 0) {
                            const effectsList = targetEffects.map(e => {
                              const spaced = e.replace(/([A-Z])/g, ' $1').trim();
                              return spaced.charAt(0).toUpperCase() + spaced.slice(1);
                            }).join(', ');
                            mechanicsText = `Removes: ${effectsList}`;
                          } else {
                            mechanicsText = 'Removes all negative effects';
                          }

                          // Add strength info
                          if (strength && strength !== 'moderate') {
                            mechanicsText += ` (${strength.charAt(0).toUpperCase() + strength.slice(1)} strength)`;
                          }

                          effects.push({
                            name: typeName,
                            description: inlineDetails.length > 0 ? inlineDetails.join(' - ') : 'Purification effect',
                            mechanicsText: mechanicsText
                          });
                        }

                        // Handle selected effects (alternative format)
                        if (activeEffects.length > 0) {
                          activeEffects.forEach(effect => {
                            const effectName = typeof effect === 'string' ? effect : (effect.name || effect.id || 'Purification Effect');
                            const effectDesc = typeof effect === 'object' ? effect.description : '';

                            effects.push({
                              name: effectName.charAt(0).toUpperCase() + effectName.slice(1),
                              description: `${effectDesc}${inlineDetails.length > 0 ? ' - ' + inlineDetails.join(' - ') : ''}`,
                              mechanicsText: effect.mechanicsText || 'Removes specified effects or conditions'
                            });
                          });
                        }

                        // Handle resurrection formula
                        if (purificationData?.resurrectionFormula) {
                          const resolutionMap = {
                            'DICE': 'Roll dice',
                            'CARDS': 'Draw cards',
                            'COINS': 'Flip coins'
                          };
                          const resolutionText = resolutionMap[purificationData.resolution] || 'Roll dice';

                          effects.push({
                            name: 'Resurrection',
                            description: `${resolutionText} - ${inlineDetails.join(' - ')}`,
                            mechanicsText: `Restoration formula: ${purificationData.resurrectionFormula}`
                          });
                        }

                        // If spell has purification effect type but no config, show a basic effect
                        if (hasPurificationType && effects.length === 0) {
                          effects.push({
                            name: 'Purification Effect',
                            description: 'Cleanses and purifies',
                            mechanicsText: 'Effect details not configured'
                          });
                        }

                        return effects.length > 0 ? (
                          <div className="healing-formula-line">
                            <div className="healing-effects-list">
                              {effects.map((effect, index) => (
                                <div key={`purification-${index}`} className="healing-effect-item">
                                  <div className="healing-effect">
                                    <span className="healing-effect-name">
                                      {effect.name}
                                    </span>
                                    {effect.description && effect.description !== effect.name && (
                                      <span className="healing-effect-description">
                                        {" "}<span className="diamond-symbol">â—†</span>{" "}{effect.description}
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
                        ) : null;
                      })()}
                    </div>
                  </div>
                );
              })()}

              {/* Restoration Effects */}
              {(() => {
                const hasRestorationType = spell?.effectTypes?.includes('restoration');
                const restorationData = spell?.restorationConfig;
                const hasRestorationConfig = !!restorationData;
                const hasResourceType = restorationData?.resourceType;
                const hasFormula = restorationData?.formula;
                const hasOverTime = restorationData?.isOverTime;

                if (!hasRestorationType && !hasRestorationConfig) return null;

                return (
                  <div className="healing-effects">
                    <div className="healing-effects-section">
                      {(() => {
                        if (!restorationData && !hasRestorationType) return null;

                        const effects = [];

                        // Handle resurrection
                        if (restorationData?.restorationType === 'resurrection' || restorationData?.targetState === 'dead') {
                          const mechanicsParts = [];

                          // Add restored resources
                          if (restorationData.restoredHealth) {
                            mechanicsParts.push(`Restores ${cleanFormula(restorationData.restoredHealth)} health`);
                          }
                          if (restorationData.restoredMana) {
                            mechanicsParts.push(`${cleanFormula(restorationData.restoredMana)} mana`);
                          }

                          // Add removed conditions
                          if (restorationData.removesConditions?.length > 0) {
                            mechanicsParts.push(`Removes: ${restorationData.removesConditions.join(', ')}`);
                          }

                          // Add casting time
                          if (restorationData.castingTime) {
                            const timeUnit = restorationData.castingTimeUnit || 'seconds';
                            mechanicsParts.push(`Casting time: ${restorationData.castingTime} ${timeUnit}`);
                          }

                          // Add time limit
                          if (restorationData.timeLimit) {
                            const limitUnit = restorationData.timeLimitUnit || 'seconds';
                            mechanicsParts.push(`Must be cast within ${restorationData.timeLimit} ${limitUnit} of death`);
                          }

                          // Add penalty
                          if (restorationData.penaltyOnRevive) {
                            const penalty = restorationData.penaltyOnRevive;
                            mechanicsParts.push(`Penalty: ${penalty.type} level ${penalty.level}`);
                          }

                          effects.push({
                            name: 'Resurrection',
                            description: 'Brings the dead back to life',
                            mechanicsText: mechanicsParts.join(' â€¢ ')
                          });
                        }

                        // Get resource name for inline display
                        const resourceName = formatResourceName(restorationData?.resourceType) || restorationData?.resourceType || 'resource';
                        const resourceDisplayName = resourceName.charAt(0).toUpperCase() + resourceName.slice(1);

                        // Handle instant restoration (non-resurrection)
                        if (restorationData?.formula && restorationData?.restorationType !== 'resurrection') {
                          const hasInstantRestoration = restorationData.duration === 'instant' || !restorationData.duration;
                          if (hasInstantRestoration) {
                            // Format the restoration display as "Formula Resource Restored"
                            const formulaText = cleanFormula(restorationData.formula);
                            const restoredText = `${formulaText} ${resourceDisplayName} Restored`;

                            effects.push({
                              name: `${resourceDisplayName} Restoration`,
                              description: '',
                              mechanicsText: restoredText
                            });
                          }
                        }

                        // Handle over time restoration
                        if (restorationData?.isOverTime && restorationData?.overTimeFormula) {
                          const duration = restorationData.overTimeDuration || 3;
                          const frequency = restorationData.tickFrequency || 'round';
                          const application = restorationData.application || 'start';
                          const applicationText = application === 'start' ? 'Start of turn' : 'End of turn';

                          // Check if progressive
                          const isProgressive = restorationData.isProgressiveOverTime && restorationData.overTimeProgressiveStages?.length > 0;

                          effects.push({
                            name: `${resourceDisplayName} Over Time`,
                            description: `Every ${frequency} for ${duration} ${frequency}s - ${applicationText}`,
                            mechanicsText: isProgressive
                              ? `Progressive restoration (${restorationData.overTimeProgressiveStages.length} stages)`
                              : `${cleanFormula(restorationData.overTimeFormula)} ${resourceName} per ${frequency}`
                          });
                        }

                        // If spell has restoration effect type but no config, show a basic effect
                        if (hasRestorationType && effects.length === 0) {
                          effects.push({
                            name: 'Restoration Effect',
                            description: 'Restores resources or abilities',
                            mechanicsText: 'Effect details not configured'
                          });
                        }

                        return effects.length > 0 ? (
                          <div className="healing-formula-line">
                            <div className="healing-effects-list">
                              {effects.map((effect, index) => (
                                <div key={`restoration-${index}`} className="healing-effect-item">
                                  <div className="healing-effect">
                                    <span className="healing-effect-name">
                                      {effect.name}
                                    </span>
                                    {effect.description && effect.description !== effect.name && (
                                      <span className="healing-effect-description">
                                        {" "}<span className="diamond-symbol">â—†</span>{" "}{effect.description}
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
                        ) : null;
                      })()}
                    </div>
                  </div>
                );
              })()}

              {/* Display triggers attached to effects on the spell card - Removed, now shown inline with effects */}

              {/* Status Effects Section (Manual/General) */}
              {(() => {
                const statusEffects = spell?.statusEffectsConfig || [];
                if (!statusEffects || statusEffects.length === 0) return null;

                return (
                  <div className="healing-effects status-effects-container">
                    <div className="healing-effects-section">
                      <div className="healing-formula-line">
                        <div className="healing-effects-list">
                          {statusEffects.map((effect, index) => (
                            <div key={`status-${index}`} className="healing-effect-item status-effect-item">
                              <div className="healing-effect">
                                <span className="healing-effect-name">
                                  {effect.name}
                                </span>
                                {effect.duration && (
                                  <span className="healing-effect-description">
                                    {" "}<span className="diamond-symbol">â—†</span>{" "}{effect.duration} {effect.unit || 'rounds'}
                                  </span>
                                )}
                              </div>
                              {(effect.description || (effect.statModifiers && effect.statModifiers.length > 0)) && (
                                <div className="healing-effect-details">
                                  {effect.description && (
                                    <div className="healing-effect-description effect-main-description">
                                      {effect.description}
                                    </div>
                                  )}
                                  {effect.statModifiers && effect.statModifiers.length > 0 && (
                                    <div className="status-stat-mods-list">
                                      {effect.statModifiers.map((mod, i) => (
                                        <span key={i} className="pf-stat-mod-badge">
                                          {mod.stat} {mod.value > 0 ? '+' : ''}{mod.value}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Poker Hand Scaling Table (Fate Weaver) */}
              {(() => {
                const pokerHands = spell?.specialMechanics?.pokerHandScaling?.hands;
                if (!pokerHands || !Array.isArray(pokerHands) || pokerHands.length === 0) return null;

                return (
                  <div className="healing-effects" style={{ marginTop: '6px' }}>
                    <div className="healing-effects-section">
                      <div className="healing-effect-item" style={{ borderBottom: '1px solid rgba(139, 115, 85, 0.3)', paddingBottom: '6px', marginBottom: '6px' }}>
                        <div className="healing-effect" style={{ marginBottom: '4px' }}>
                          <span className="healing-effect-name" style={{ fontSize: '0.85em', color: '#5a3a1a' }}>
                            Poker Hand Scaling
                          </span>
                          <span className="healing-effect-description" style={{ fontSize: '0.75em', color: '#8b7355', marginLeft: '6px' }}>
                            Higher hand = more damage + debt
                          </span>
                        </div>
                        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78em' }}>
                          <thead>
                            <tr style={{ borderBottom: '1px solid rgba(139, 115, 85, 0.4)' }}>
                              <th style={{ textAlign: 'left', padding: '2px 6px', color: '#5a3a1a', fontWeight: '600' }}>Hand</th>
                              <th style={{ textAlign: 'left', padding: '2px 6px', color: '#5a3a1a', fontWeight: '600' }}>Damage</th>
                              <th style={{ textAlign: 'center', padding: '2px 6px', color: '#5a3a1a', fontWeight: '600' }}>Debt</th>
                            </tr>
                          </thead>
                          <tbody>
                            {pokerHands.map((hand, idx) => (
                              <tr key={idx} style={{ borderBottom: '1px solid rgba(139, 115, 85, 0.15)' }}>
                                <td style={{ padding: '2px 6px', color: idx < 3 ? '#8b4513' : idx < 7 ? '#4a3020' : '#6b5a4a', fontWeight: idx < 3 ? '600' : '400' }}>{hand.name}</td>
                                <td style={{ padding: '2px 6px', color: '#3a2010' }}>{hand.damage}</td>
                                <td style={{ padding: '2px 6px', textAlign: 'center', color: hand.debtGain >= 3 ? '#8b1a1a' : hand.debtGain >= 2 ? '#a0522d' : '#6b5a4a' }}>+{hand.debtGain}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Threads of Destiny (Fate Weaver) */}
              {(() => {
                const threads = spell?.specialMechanics?.threadsOfDestiny;
                if (!threads) return null;

                return (
                  <div className="healing-effects" style={{ marginTop: '6px' }}>
                    <div className="healing-effects-section">
                      <div className="healing-effect-item" style={{ 
                        borderLeft: '3px solid #8b1a1a', 
                        background: 'rgba(139, 26, 26, 0.04)', 
                        padding: '6px 10px', 
                        borderRadius: '0 4px 4px 0', 
                        marginBottom: '6px' 
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          marginBottom: '4px',
                          color: '#8b1a1a',
                          fontWeight: 'bold',
                          fontSize: '0.82em',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          <i className="fas fa-scroll" style={{ fontSize: '0.9em' }}></i>
                          Threads of Destiny
                        </div>
                        {threads.generation && (
                          <div style={{ fontSize: '0.78em', color: '#4a3020', marginBottom: threads.usage ? '3px' : '0', lineHeight: '1.3' }}>
                            <strong style={{ color: '#8b1a1a' }}>Generation:</strong> {threads.generation}
                          </div>
                        )}
                        {threads.usage && (
                          <div style={{ fontSize: '0.78em', color: '#4a3020', lineHeight: '1.3' }}>
                            <strong style={{ color: '#5a3a1a' }}>Usage:</strong> {threads.usage}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Sanguine Blackjack Rules (Fate Weaver) */}
              {(() => {
                const rules = spell?.specialMechanics?.blackjackRules || spell?.specialMechanics?.blackjackAdvancedRules;
                if (!rules) return null;

                const isAdvanced = !!spell?.specialMechanics?.blackjackAdvancedRules;

                return (
                  <div className="healing-effects" style={{ marginTop: '6px' }}>
                    <div className="healing-effects-section">
                      <div className="healing-effect-item" style={{ 
                        borderLeft: '3px solid #1b5e20', 
                        background: 'rgba(27, 94, 32, 0.04)', 
                        padding: '6px 10px', 
                        borderRadius: '0 4px 4px 0', 
                        marginBottom: '6px' 
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          marginBottom: '6px',
                          color: '#1b5e20',
                          fontWeight: 'bold',
                          fontSize: '0.82em',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          <i className="fas fa-clubs" style={{ fontSize: '0.9em' }}></i>
                          {isAdvanced ? 'Sanguine Blackjack (Advanced)' : 'Sanguine Blackjack'}
                        </div>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '4px 8px', fontSize: '0.78em', lineHeight: '1.3' }}>
                          {isAdvanced ? (
                            <>
                              <div style={{ color: '#4a3020' }}>
                                <strong style={{ color: '#1b5e20' }}>Max Targets:</strong> {rules.maxTargets}
                              </div>
                              <div style={{ color: '#4a3020' }}>
                                <strong style={{ color: '#1b5e20' }}>Hit Limit:</strong> {rules.hitLimitPerTarget} / target
                              </div>
                              <div style={{ color: '#4a3020', gridColumn: 'span 2' }}>
                                <strong style={{ color: '#1b5e20' }}>21 Natural Bonus:</strong> {rules.blackjackBonus}
                              </div>
                              <div style={{ color: '#4a3020', gridColumn: 'span 2' }}>
                                <strong style={{ color: '#8b1a1a' }}>Bust Penalty:</strong> {rules.bustSelfDamage} + 2 Debt
                              </div>
                            </>
                          ) : (
                            <>
                              <div style={{ color: '#4a3020' }}>
                                <strong style={{ color: '#1b5e20' }}>Hit Limit:</strong> {rules.hitLimit} cards
                              </div>
                              <div style={{ color: '#4a3020' }}>
                                <strong style={{ color: '#1b5e20' }}>Bust Limit:</strong> &gt; {rules.bustThreshold}
                              </div>
                              <div style={{ color: '#4a3020', gridColumn: 'span 2' }}>
                                <strong style={{ color: '#8b1a1a' }}>Bust Penalty:</strong> {rules.bustSelfDamage} &amp; +{rules.bustDebtGain} Debt
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* War of Wills Duel Panel (Fate Weaver) */}
              {(() => {
                const duel = spell?.specialMechanics?.warOfWills;
                if (!duel) return null;

                return (
                  <div className="healing-effects" style={{ marginTop: '6px' }}>
                    <div className="healing-effects-section">
                      <div className="healing-effect-item" style={{ 
                        borderLeft: '3px solid #4a148c', 
                        background: 'rgba(74, 20, 140, 0.04)', 
                        padding: '6px 10px', 
                        borderRadius: '0 4px 4px 0', 
                        marginBottom: '6px' 
                      }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                          marginBottom: '4px',
                          color: '#4a148c',
                          fontWeight: 'bold',
                          fontSize: '0.82em',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          <i className="fas fa-brain" style={{ fontSize: '0.9em' }}></i>
                          Duel of Flayed Wills
                        </div>
                        <div style={{ fontSize: '0.78em', color: '#4a3020', marginBottom: '4px', lineHeight: '1.3' }}>
                          <strong style={{ color: '#4a148c' }}>Duel:</strong> {duel.description}
                        </div>
                        {duel.failureOutcome && (
                          <div style={{ fontSize: '0.78em', color: '#4a3020', lineHeight: '1.3' }}>
                            <strong style={{ color: '#8b1a1a' }}>Failure Penalty:</strong> {duel.failureOutcome}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* Rollable Table Summary */}
              {(() => {
                // Extract rollable table data from spell if not provided as prop
                const tableData = rollableTableData || spell?.mechanicsConfig?.rollableTable || spell?.rollableTable;

                if (!tableData || !tableData.enabled) return null;

                return (
                  <div className="healing-effects">
                    <div className="healing-effects-section">
                      <RollableTableSummary
                        rollableTableData={tableData}
                        variant="compact"
                        showExpandButton={true}
                      />
                    </div>
                  </div>
                );
              })()}

              {/* Prophecy Summary (Harbinger) */}
              {(() => {
                // Support both top-level prophecyConfig and mechanicsConfig-nested prophecy
                const prophecyData = spell?.prophecyConfig || 
                                    (Array.isArray(spell?.mechanicsConfig) ? 
                                      spell.mechanicsConfig.find(m => m.system === 'PROPHECY')?.prophecy : 
                                      spell?.mechanicsConfig?.prophecy);

                if (!prophecyData) return null;

                // Merge top-level tableConfig into prophecyData so ProphecySummary can render it
                if (spell?.tableConfig && !prophecyData.tableConfig) {
                  prophecyData.tableConfig = spell.tableConfig;
                }

                return (
                  <div className="healing-effects prophecy-effects-container">
                    <div className="healing-effects-section">
                      <ProphecySummary 
                        prophecyData={prophecyData} 
                        damageType={getDamageTypes()[0] || 'blight'}
                      />
                    </div>
                  </div>
                );
              })()}


              </>
            );

            return hasAnyStatContent ? (
              <div className="pf-spell-stats wow-spell-stats">
                {statContent}
              </div>
            ) : (
              statContent
            );
          })()}
        </div>
      )}

      {/* Tags and Cooldown (at bottom of card) */}
      {(() => {
        const tags = getSpellTags();
        const shouldShowTags = (variant === 'spellbook' || variant === 'wizard' || variant === 'library' || variant === 'collection' || variant === 'rules') && showTags;
        const cooldownText = formatCooldown();
        const shouldShowCooldown = (variant === 'spellbook' || variant === 'wizard' || variant === 'library' || variant === 'collection' || variant === 'rules') && cooldownText;

        // For rules variant (racial traits), always show tags even if empty, and add level info
        const forceShowTagsSection = variant === 'rules';

        return (shouldShowTags && tags.length > 0) || shouldShowCooldown || forceShowTagsSection ? (
          <>
            {/* Divider bar before tags */}
            <div className="spell-divider"></div>
            
            <div className="unified-spell-tags-footer">
              {/* Tags on the left */}
              {(shouldShowTags || forceShowTagsSection) && (
                <div className="unified-spell-tags">
                  {/* Show level for rules variant */}
                  {variant === 'rules' && spell?.level !== undefined && spell.level >= 0 && (
                    <span className="unified-spell-tag trait-level">
                      Level {spell.level}
                    </span>
                  )}
                  {/* Show tags */}
                  {tags.map((tag, index) => (
                    <span key={index} className="unified-spell-tag">
                      {tag}
                    </span>
                  ))}
                  {/* Show default racial/trait tags if no other tags */}
                  {tags.length === 0 && variant === 'rules' && (
                    <>
                      <span className="unified-spell-tag">racial</span>
                      <span className="unified-spell-tag">trait</span>
                    </>
                  )}
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
          </>
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
  variant: PropTypes.oneOf(['spellbook', 'library', 'collection', 'wizard', 'compact', 'preview', 'rules']),
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