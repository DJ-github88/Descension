import React, { useState, useRef, useCallback, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBolt, faGem, faFire, faRunning, faEye, faHeart,
  faStar, faSun, faSnowflake, faGhost, faMoon, faWind,
  faBrain, faFistRaised, faSkull, faAtom, faHourglass,
  faClock, faBatteryFull, faCoins, faComment, faHandSparkles, faFlask,
  faArrowUp, faLeaf, faExclamationTriangle, faShield, faRandom, faScroll, faDice, faPaw, faCrosshairs, faTint, faBalanceScale
} from '@fortawesome/free-solid-svg-icons';
import { formatFormulaToPlainEnglish } from './SpellCardUtils';
import RollableTableSummary from './RollableTableSummary';
import { useSpellLibrary } from '../../context/SpellLibraryContext';
import SpellTooltip from './SpellTooltip';
import { calculateManaCost } from '../../core/mechanics/resourceManager';
import { normalizeSpell } from '../../core/utils/spellNormalizer';
import useCharacterStore from '../../../../store/characterStore';
import { getAbilityIconUrl, getCustomIconUrl } from '../../../../utils/assetManager';
import '../../../../styles/item-tooltip.css';

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
  
  // Get character stats for dynamic calculations (e.g., Dodge = Agility ÷ 3)
  const characterStats = useCharacterStore((state) => ({
    agility: state.stats?.agility || state.stats?.agi || 10,
    derivedStats: state.derivedStats || {}
  }));
  
  // Calculate current Dodge Rating (every 15 Agility = 1 Dodge Rating)
  const currentDodgeValue = Math.floor((characterStats.agility || 10) / 15);


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

  // ===== COMPREHENSIVE HELPER FUNCTIONS =====

  // Get Inferno stage name by level
  const getInfernoStageName = (level) => {
    const stageNames = {
      0: 'Mortal',
      1: 'Ember',
      2: 'Smolder',
      3: 'Scorch',
      4: 'Blaze',
      5: 'Inferno',
      6: 'Conflagration',
      7: 'Cataclysm',
      8: 'Apocalypse',
      9: 'Oblivion'
    };
    return stageNames[level] || `Level ${level}`;
  };

  // Get Inferno stage name with "ing" suffix for requirements display
  const getInfernoStageNameWithSuffix = (level) => {
    const stageNames = {
      0: 'Mortal',
      1: 'Embering',
      2: 'Smoldering',
      3: 'Scorching',
      4: 'Blazing',
      5: 'Inferno',
      6: 'Conflagration',
      7: 'Cataclysm',
      8: 'Apocalypse',
      9: 'Oblivion'
    };
    return stageNames[level] || `Level ${level}`;
  };

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
      'arcane_energy_points': 'AEP',
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
    // Fate Weaver threads
    if (resourceType === 'threads_spend' || resourceType === 'threads_generate') return 'Threads of Destiny';
    // Chaos resources
    if (resourceType === 'chaos_sphere') return 'Chaos Sphere';

    // Return mapped name if available, otherwise convert snake_case to Title Case
    return resourceNameMap[resourceType] || resourceType
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Enhanced formula cleaning function that properly formats resource names
  const cleanFormula = (formula) => {
    if (!formula || typeof formula !== 'string') return '';

    // Handle special formula keywords first
    if (formula === 'HALF_DAMAGE_DEALT') {
      return 'Damage Dealt/2';
    }
    if (formula === 'DAMAGE_DEALT_TO_SELF' || formula === 'DAMAGE_DEALT') {
      return 'Damage Dealt';
    }
    if (formula === 'FULL_HEALTH' || formula === 'FULL_HP') {
      return 'Full Health';
    }

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
      'mana_regen': 'Mana Regen',
      'damage_dealt': 'Damage Dealt',
      'damage dealt': 'Damage Dealt',
      // Add comprehensive stat names for proper formatting
      'strength': 'Strength',
      'agility': 'Agility',
      'constitution': 'Constitution',
      'intelligence': 'Intelligence',
      'spirit': 'Spirit',
      'charisma': 'Charisma',
      'str': 'Strength',
      'agi': 'Agility',
      'con': 'Constitution',
      'int': 'Intelligence',
      'spi': 'Spirit',
      'spir': 'Spirit',
      'cha': 'Charisma',
      // Handle weapon-related formulas that should not be converted
      'weapon_die': 'weapon_die', // Keep as-is, will be replaced with actual dice in weapon-dependent spells
      'weapon_damage': 'weapon_damage', // Keep as-is
      'attribute_modifier': 'attribute_modifier' // Keep as-is, will be replaced with actual attribute name
    };

    // Replace resource variables in the formula
    Object.entries(resourceVariableMap).forEach(([variable, properName]) => {
      const regex = new RegExp(`\\b${variable}\\b`, 'gi');
      cleanedFormula = cleanedFormula.replace(regex, properName);
    });

    // Convert camelCase to underscores before mapping (currentHealth -> current_health)
    cleanedFormula = cleanedFormula.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();

    // Replace specific resource variable names with proper formatting
    Object.entries(resourceVariableMap).forEach(([variable, properName]) => {
      const regex = new RegExp(`\\b${variable}\\b`, 'gi');
      cleanedFormula = cleanedFormula.replace(regex, properName);
    });

    // Handle remaining underscores for any missed variables (but preserve weapon_die, weapon_damage, attribute_modifier)
    // These are placeholders that should be replaced with actual values, not converted to spaces
    const preservedPlaceholders = ['weapon_die', 'weapon_damage', 'attribute_modifier'];
    let hasPlaceholder = false;
    preservedPlaceholders.forEach(placeholder => {
      if (cleanedFormula.includes(placeholder)) {
        hasPlaceholder = true;
      }
    });
    
    if (!hasPlaceholder) {
      // Only replace underscores if there are no placeholders
      cleanedFormula = cleanedFormula.replace(/_/g, ' ');
    } else {
      // Replace underscores but preserve placeholders
      preservedPlaceholders.forEach(placeholder => {
        cleanedFormula = cleanedFormula.replace(new RegExp(placeholder.replace(/_/g, ' '), 'g'), placeholder);
      });
      cleanedFormula = cleanedFormula.replace(/_/g, ' ');
      // Restore placeholders
      preservedPlaceholders.forEach(placeholder => {
        const spacedPlaceholder = placeholder.replace(/_/g, ' ');
        cleanedFormula = cleanedFormula.replace(new RegExp(spacedPlaceholder, 'g'), placeholder);
      });
    }

    // Handle any remaining camelCase conversion (for display)
    cleanedFormula = cleanedFormula.replace(/([a-z])([A-Z])/g, '$1 $2');

    return cleanedFormula;
  };

  // Enhanced formula display with damage type integration and better formatting
  const enhanceFormulaDisplay = (formula, elementType) => {
    if (!formula) return '';

    const cleanedFormula = cleanFormula(formula);

    // Add damage type context for better readability
    if (elementType && elementType !== 'force') {
      const elementName = elementType.charAt(0).toUpperCase() + elementType.slice(1);
      return `${cleanedFormula} ${elementName} damage`;
    }

    // For basic formulas, add more descriptive text
    if (cleanedFormula.match(/^\d+d\d+(\s*\+\s*\d+)?$/)) {
      return `${cleanedFormula} damage`;
    }

    // For formulas with stats, make them more readable
    if (cleanedFormula.includes('intelligence') || cleanedFormula.includes('strength') ||
        cleanedFormula.includes('agility') || cleanedFormula.includes('constitution') ||
        cleanedFormula.includes('spirit') || cleanedFormula.includes('charisma')) {
      return `${cleanedFormula} damage`;
    }

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
      'frost': 'spell-frost',
      'cold': 'spell-frost',
      'arcane': 'spell-arcane',
      'force': 'spell-arcane',
      'nature': 'spell-nature',
      'necrotic': 'spell-shadow',
      'holy': 'spell-holy',
      'radiant': 'spell-holy',
      'lightning': 'spell-lightning',
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

  // Helper function to map WoW icon IDs to local ability icons for spells
  const mapSpellIcon = (wowIconId) => {
    const iconMapping = {
      // Combat/Attack icons
      'ability_meleedamage': 'General/Combat Downward Strike',
      'ability_warrior_savageblow': 'General/Combat Downward Strike',
      'ability_warrior_charge': 'General/Combat Downward Strike',
      'ability_warrior_revenge': 'General/Combat Downward Strike',
      'ability_warrior_cleave': 'General/Combat Downward Strike',
      'ability_warrior_riposte': 'Utility/Parry',
      'ability_warrior_shieldbash': 'Utility/Shield',
      'ability_rogue_evasion': 'Utility/Speed Dash',
      'ability_rogue_feint': 'Utility/Parry',
      'ability_rogue_sprint': 'Utility/Speed Dash',
      'ability_rogue_tricksofthetrade': 'Utility/Speed Dash',
      'ability_stealth': 'Utility/Hide',
      'ability_hunter_snipershot': 'Utility/Target Crosshair',
      'ability_hunter_markedshot': 'Utility/Target Crosshair',
      'ability_hunter_markedfordeath': 'Utility/Target Crosshair',
      
      // Defensive icons
      'inv_shield_05': 'Utility/Shield',
      'inv_shield_04': 'Utility/Shield',
      'ability_warrior_defensivestance': 'Utility/Shield',
      'spell_holy_powerwordshield': 'Utility/Shield',
      'spell_holy_devotionaura': 'Radiant/Divine Blessing',
      
      // Healing/Support icons
      'spell_holy_greaterheal': 'Healing/Golden Heart',
      'spell_holy_heal02': 'Healing/Golden Heart',
      'spell_holy_flashheal': 'Healing/Golden Heart',
      'spell_holy_renew': 'Healing/Renewal',
      
      // Utility icons
      'spell_arcane_portaldalaran': 'Utility/Utility',
      'spell_arcane_teleportundercity': 'Utility/Utility',
      'spell_arcane_arcanetorrent': 'Arcane/Arcane Blast',
      'inv_misc_questionmark': 'Utility/Utility',
      'inv_misc_book_07': 'Utility/Utility',
      'inv_misc_bag_08': 'Utility/Utility',
      
      // Magic/Damage icons
      'spell_fire_fireball02': 'Fire/Swirling Fireball',
      'spell_fire_flamebolt': 'Fire/Flame Burst',
      'spell_frost_frostbolt02': 'Frost/Frozen in Ice',
      'spell_arcane_blast': 'Arcane/Magical Sword',
      'spell_shadow_shadowbolt': 'Shadow/Shadow Darkness',
      'spell_holy_holysmite': 'Radiant/Divine Blessing',
      'spell_nature_lightning': 'Lightning/Lightning Bolt',
      
      // Control icons
      'spell_frost_chainsofice': 'Frost/Frozen in Ice',
      'spell_shadow_curseofsargeras': 'Necrotic/Necrotic Skull',
      
      // Buff icons
      'spell_holy_divineillumination': 'Radiant/Divine Blessing',
      'spell_holy_blessingofprotection': 'Radiant/Divine Blessing',
      
      // Summoning icons
      'spell_shadow_summonvoidwalker': 'Utility/Summon Minion',
      'spell_shadow_summoninfernal': 'Utility/Summon Minion',
      
      // Transformation icons
      'ability_druid_catform': 'Utility/Utility',
      
      // Trap icons
      'spell_fire_selfdestruct': 'Utility/Explosive Detonation',
      
      // Wild magic icons
      'spell_arcane_arcane04': 'Arcane/Magical Sword'
    };
    
    return iconMapping[wowIconId] || null;
  };

  const getSpellIcon = () => {
    const iconId = spell?.icon || spell?.typeConfig?.icon;
    // If no icon is set, use default
    if (!iconId) {
      return getCustomIconUrl('Utility/Utility', 'abilities');
    }
    // If it's already a full URL (ability icon), return as-is
    if (typeof iconId === 'string' && iconId.startsWith('/assets/')) {
      return iconId;
    }
    // If it's already an ability icon path (e.g., "Fire/Flame Burst"), use it directly
    if (iconId.includes('/') && !iconId.startsWith('http')) {
      // Check if it's using the new folder structure (e.g., "Fire/Flame Burst")
      if (iconId.match(/^[A-Z][a-zA-Z]+\/[A-Z]/)) {
        return getCustomIconUrl(iconId, 'abilities');
      }
      // Otherwise try to use it as-is
      return getCustomIconUrl(iconId, 'abilities');
    }
    // If it's a WoW icon ID, try to map it to a local ability icon
    if (iconId.startsWith('inv_') || iconId.startsWith('spell_') || iconId.startsWith('ability_') || iconId.startsWith('achievement_')) {
      const mappedIcon = mapSpellIcon(iconId);
      if (mappedIcon) {
        return getCustomIconUrl(mappedIcon, 'abilities');
      }
      // If no mapping found, use default instead of getAbilityIconUrl (which adds creature- prefix)
      return getCustomIconUrl('Utility/Utility', 'abilities');
    }
    // Default fallback
    return getCustomIconUrl('Utility/Utility', 'abilities');
  };

  // ===== RESISTANCE HELPER FUNCTIONS =====

  const extractDamageTypeFromResistanceName = (resistanceName) => {
    if (!resistanceName) return 'damage';

    const name = resistanceName.toLowerCase();
    if (name.includes('fire')) return 'fire';
    if (name.includes('frost') || name.includes('cold') || name.includes('ice')) return 'frost';
    if (name.includes('lightning') || name.includes('electric')) return 'lightning';
    if (name.includes('arcane')) return 'arcane';
    if (name.includes('nature')) return 'nature';
    if (name.includes('poison')) return 'poison';
    if (name.includes('necrotic') || name.includes('death')) return 'necrotic';
    if (name.includes('radiant') || name.includes('holy')) return 'radiant';
    if (name.includes('psychic') || name.includes('mental')) return 'psychic';
    if (name.includes('chaos')) return 'chaos';
    if (name.includes('void')) return 'void';
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
        frost: 'Frost Drain (heals for 200% of frost damage taken)',
        lightning: 'Storm Siphon (heals for 200% of lightning damage taken)',
        arcane: 'Arcane Feast (heals for 200% of arcane damage taken)',
        nature: 'Nature Feast (heals for 200% of nature damage taken)',
        poison: 'Toxin Feast (heals for 200% of poison damage taken)',
        necrotic: 'Death Feast (heals for 200% of necrotic damage taken)',
        radiant: 'Light Drain (heals for 200% of radiant damage taken)',
        psychic: 'Mind Feast (heals for 200% of psychic damage taken)',
        chaos: 'Chaos Feast (heals for 200% of chaos damage taken)',
        void: 'Void Feast (heals for 200% of void damage taken)',
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
        frost: 'Frost Absorb (heals for 100% of frost damage taken)',
        lightning: 'Storm Absorb (heals for 100% of lightning damage taken)',
        arcane: 'Arcane Absorb (heals for 100% of arcane damage taken)',
        nature: 'Nature Absorb (heals for 100% of nature damage taken)',
        poison: 'Toxin Absorb (heals for 100% of poison damage taken)',
        necrotic: 'Death Absorb (heals for 100% of necrotic damage taken)',
        radiant: 'Light Absorb (heals for 100% of radiant damage taken)',
        psychic: 'Mind Absorb (heals for 100% of psychic damage taken)',
        chaos: 'Chaos Absorb (heals for 100% of chaos damage taken)',
        void: 'Void Absorb (heals for 100% of void damage taken)',
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
        frost: 'Frost Sap (heals for 50% of frost damage taken)',
        lightning: 'Storm Sap (heals for 50% of lightning damage taken)',
        arcane: 'Arcane Sap (heals for 50% of arcane damage taken)',
        nature: 'Nature Sap (heals for 50% of nature damage taken)',
        poison: 'Toxin Sap (heals for 50% of poison damage taken)',
        necrotic: 'Death Sap (heals for 50% of necrotic damage taken)',
        radiant: 'Light Sap (heals for 50% of radiant damage taken)',
        psychic: 'Mind Sap (heals for 50% of psychic damage taken)',
        chaos: 'Chaos Sap (heals for 50% of chaos damage taken)',
        void: 'Void Sap (heals for 50% of void damage taken)',
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
        frost: 'Frost Siphon (heals for 25% of frost damage taken)',
        lightning: 'Storm Siphon (heals for 25% of lightning damage taken)',
        arcane: 'Arcane Siphon (heals for 25% of arcane damage taken)',
        nature: 'Nature Siphon (heals for 25% of nature damage taken)',
        poison: 'Toxin Siphon (heals for 25% of poison damage taken)',
        necrotic: 'Death Siphon (heals for 25% of necrotic damage taken)',
        radiant: 'Light Siphon (heals for 25% of radiant damage taken)',
        psychic: 'Mind Siphon (heals for 25% of psychic damage taken)',
        chaos: 'Chaos Siphon (heals for 25% of chaos damage taken)',
        void: 'Void Siphon (heals for 25% of void damage taken)',
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
        frost: 'Frost Immunity (takes no frost damage)',
        lightning: 'Storm Immunity (takes no lightning damage)',
        arcane: 'Arcane Immunity (takes no arcane damage)',
        nature: 'Nature Immunity (takes no nature damage)',
        poison: 'Toxin Immunity (takes no poison damage)',
        necrotic: 'Death Immunity (takes no necrotic damage)',
        radiant: 'Light Immunity (takes no radiant damage)',
        psychic: 'Mind Immunity (takes no psychic damage)',
        chaos: 'Chaos Immunity (takes no chaos damage)',
        void: 'Void Immunity (takes no void damage)',
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
        frost: 'Frost Ward (takes half frost damage)',
        lightning: 'Storm Ward (takes half lightning damage)',
        arcane: 'Arcane Ward (takes half arcane damage)',
        nature: 'Nature Ward (takes half nature damage)',
        poison: 'Toxin Ward (takes half poison damage)',
        necrotic: 'Death Ward (takes half necrotic damage)',
        radiant: 'Light Ward (takes half radiant damage)',
        psychic: 'Mind Ward (takes half psychic damage)',
        chaos: 'Chaos Ward (takes half chaos damage)',
        void: 'Void Ward (takes half void damage)',
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
        frost: 'Frost Barrier (takes 25% frost damage)',
        lightning: 'Storm Barrier (takes 25% lightning damage)',
        arcane: 'Arcane Barrier (takes 25% arcane damage)',
        nature: 'Nature Barrier (takes 25% nature damage)',
        poison: 'Toxin Barrier (takes 25% poison damage)',
        necrotic: 'Death Barrier (takes 25% necrotic damage)',
        radiant: 'Light Barrier (takes 25% radiant damage)',
        psychic: 'Mind Barrier (takes 25% psychic damage)',
        chaos: 'Chaos Barrier (takes 25% chaos damage)',
        void: 'Void Barrier (takes 25% void damage)',
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
        frost: 'Frost Guard (takes 75% frost damage)',
        lightning: 'Storm Guard (takes 75% lightning damage)',
        arcane: 'Arcane Guard (takes 75% arcane damage)',
        nature: 'Nature Guard (takes 75% nature damage)',
        poison: 'Toxin Guard (takes 75% poison damage)',
        necrotic: 'Death Guard (takes 75% necrotic damage)',
        radiant: 'Light Guard (takes 75% radiant damage)',
        psychic: 'Mind Guard (takes 75% psychic damage)',
        chaos: 'Chaos Guard (takes 75% chaos damage)',
        void: 'Void Guard (takes 75% void damage)',
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
        frost: 'Frost Reduction (reduces frost resistance by 25%)',
        lightning: 'Storm Reduction (reduces lightning resistance by 25%)',
        arcane: 'Arcane Reduction (reduces arcane resistance by 25%)',
        nature: 'Nature Reduction (reduces nature resistance by 25%)',
        poison: 'Toxin Reduction (reduces poison resistance by 25%)',
        necrotic: 'Death Reduction (reduces necrotic resistance by 25%)',
        radiant: 'Light Reduction (reduces radiant resistance by 25%)',
        psychic: 'Mind Reduction (reduces psychic resistance by 25%)',
        chaos: 'Chaos Reduction (reduces chaos resistance by 25%)',
        void: 'Void Reduction (reduces void resistance by 25%)',
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
        frost: 'Frost Nullification (removes all frost resistance)',
        lightning: 'Storm Nullification (removes all lightning resistance)',
        arcane: 'Arcane Nullification (removes all arcane resistance)',
        nature: 'Nature Nullification (removes all nature resistance)',
        poison: 'Toxin Nullification (removes all poison resistance)',
        necrotic: 'Death Nullification (removes all necrotic resistance)',
        radiant: 'Light Nullification (removes all radiant resistance)',
        psychic: 'Mind Nullification (removes all psychic resistance)',
        chaos: 'Chaos Nullification (removes all chaos resistance)',
        void: 'Void Nullification (removes all void resistance)',
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
        frost: 'Frost Weakness (takes 125% frost damage)',
        lightning: 'Storm Weakness (takes 125% lightning damage)',
        arcane: 'Arcane Weakness (takes 125% arcane damage)',
        nature: 'Nature Weakness (takes 125% nature damage)',
        poison: 'Toxin Weakness (takes 125% poison damage)',
        necrotic: 'Death Weakness (takes 125% necrotic damage)',
        radiant: 'Light Weakness (takes 125% radiant damage)',
        psychic: 'Mind Weakness (takes 125% psychic damage)',
        chaos: 'Chaos Weakness (takes 125% chaos damage)',
        void: 'Void Weakness (takes 125% void damage)',
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
        frost: 'Frost Exposure (takes 150% frost damage)',
        lightning: 'Storm Exposure (takes 150% lightning damage)',
        arcane: 'Arcane Exposure (takes 150% arcane damage)',
        nature: 'Nature Exposure (takes 150% nature damage)',
        poison: 'Toxin Exposure (takes 150% poison damage)',
        necrotic: 'Death Exposure (takes 150% necrotic damage)',
        radiant: 'Light Exposure (takes 150% radiant damage)',
        psychic: 'Mind Exposure (takes 150% psychic damage)',
        chaos: 'Chaos Exposure (takes 150% chaos damage)',
        void: 'Void Exposure (takes 150% void damage)',
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
        frost: 'Frost Curse (takes double frost damage)',
        lightning: 'Storm Curse (takes double lightning damage)',
        arcane: 'Arcane Curse (takes double arcane damage)',
        nature: 'Nature Curse (takes double nature damage)',
        poison: 'Toxin Curse (takes double poison damage)',
        necrotic: 'Death Curse (takes double necrotic damage)',
        radiant: 'Light Curse (takes double radiant damage)',
        psychic: 'Mind Curse (takes double psychic damage)',
        chaos: 'Chaos Curse (takes double chaos damage)',
        void: 'Void Curse (takes double void damage)',
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

    // If in effect-specific targeting mode, don't show unified range in header
    // Individual effects will show their own range badges
    if (spell.targetingMode === 'effect' && spell.effectTargeting && Object.keys(spell.effectTargeting).length > 0) {
      // Show a generic indicator or nothing when using effect-specific targeting
      return 'Varies';
    }

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
    const { targetingType, rangeType, rangeDistance, aoeShape, aoeParameters, aoeType, aoeSize } = config;

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
      case 'cone':
      case 'line':
        // For cone/line spells, the range is the length of the effect
        rangeStr = `${rangeDistance || aoeSize || 30} ft`;
        break;
      default:
        rangeStr = 'Touch';
    }

    // Add targeting type information for area effects
    // Support both aoeShape/aoeParameters (new) and aoeType/aoeSize (legacy)
    if (targetingType === 'area' || targetingType === 'ground' || targetingType === 'cone' || targetingType === 'line') {
      const shape = aoeShape || aoeType;
      const params = aoeParameters || (aoeSize ? { radius: aoeSize, length: aoeSize } : {});

      if (shape) {
        const shapeInfo = formatAoeShape(shape, params);
        if (shapeInfo) {
          // For line/cone effects, if rangeDistance equals the length, replace range with shape info instead of appending
          if ((shape === 'line' || shape === 'cone') && params.length && rangeDistance && 
              Math.abs(rangeDistance - params.length) < 1) {
            rangeStr = shapeInfo; // Replace range with shape info (e.g., "60ft line" instead of "60 ft (60ft line)")
          } else {
            rangeStr += ` (${shapeInfo})`;
          }
        }
      }
    } else if (targetingType === 'area' && aoeShape) {
      const shapeInfo = formatAoeShape(aoeShape, aoeParameters);
      if (shapeInfo) {
        // For line/cone effects, if rangeDistance equals the length, replace range with shape info
        if ((aoeShape === 'line' || aoeShape === 'cone') && aoeParameters?.length && rangeDistance && 
            Math.abs(rangeDistance - aoeParameters.length) < 1) {
          rangeStr = shapeInfo;
        } else {
          rangeStr += ` (${shapeInfo})`;
        }
      }
    } else if (targetingType === 'multi') {
      const maxTargets = config.maxTargets || 3;
      const selectionMethod = config.targetSelectionMethod || config.selectionMethod;
      if (selectionMethod && selectionMethod !== 'manual') {
        const methodName = selectionMethod === 'random' ? 'Random' :
                          selectionMethod === 'closest' || selectionMethod === 'nearest' ? 'Nearest' :
                          selectionMethod === 'furthest' || selectionMethod === 'farthest' ? 'Farthest' :
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
      case 'none':
        return '';
      default:
        return shape;
    }
  };

  // Format targeting/range info for individual effects
  const formatEffectTargeting = (effectType, effectSubType = null) => {
    // In unified mode, don't show targeting badges on individual effects
    // Unified targeting is shown in the header only
    if (spell?.targetingMode === 'unified') {
      return null;
    }
    
    // Only proceed if we're in effect-specific mode
    if (spell?.targetingMode !== 'effect') {
      return null;
    }
    
    let effectConfig = null;
    
    // First, try to get effect-specific targeting
    if (spell?.effectTargeting && spell.effectTargeting[effectType]) {
      const effectSpecificConfig = spell.effectTargeting[effectType];
      // Only use effect-specific config if it has actual targeting data
      // If it's an empty object (cleared), don't use it
      if (effectSpecificConfig && typeof effectSpecificConfig === 'object' && 
          (effectSpecificConfig.rangeType || effectSpecificConfig.targetingType || effectSpecificConfig.rangeDistance)) {
        effectConfig = effectSpecificConfig;
      }
    }
    
    // If still no config, return null
    if (!effectConfig || typeof effectConfig !== 'object') {
      return null;
    }
    
    // Return config if it has ANY targeting info (rangeType OR targetingType)
    // Don't require both - user might set range before targeting type
    if (!effectConfig.rangeType && !effectConfig.targetingType && !effectConfig.rangeDistance) {
      return null;
    }

    const { targetingType, rangeType, rangeDistance, aoeShape, aoeParameters, maxTargets, targetSelectionMethod, selectionMethod, targetRestrictions } = effectConfig;
    
    // Build range string - always show range if rangeType exists
    let rangeStr = '';
    if (rangeType) {
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
          if (rangeDistance && rangeDistance > 0) {
            rangeStr = `${rangeDistance} ft`;
          } else {
            // Fallback: capitalize the rangeType
            rangeStr = rangeType.charAt(0).toUpperCase() + rangeType.slice(1);
          }
      }
    } else if (rangeDistance && rangeDistance > 0) {
      // If no rangeType but we have rangeDistance, show it
      rangeStr = `${rangeDistance} ft`;
    }

    // Add targeting type info
    let targetingInfo = '';
    if (targetingType === 'area' || targetingType === 'ground' || targetingType === 'cone' || targetingType === 'line') {
      const shape = aoeShape || effectConfig.aoeType;
      const params = aoeParameters || (effectConfig.aoeSize ? { radius: effectConfig.aoeSize, length: effectConfig.aoeSize } : {});
      
      // Always show area effect info if targeting type is area-based
      if (shape) {
        const shapeInfo = formatAoeShape(shape, params);
        if (shapeInfo && shapeInfo.trim() !== '') {
          targetingInfo = shapeInfo;
          
          // For line/cone effects, if rangeDistance equals the length, don't show redundant range
          if ((shape === 'line' || shape === 'cone') && params.length && rangeDistance && 
              Math.abs(rangeDistance - params.length) < 1) {
            // Suppress the range string since it's redundant with the line/cone length
            rangeStr = '';
          }
        } else {
          // If shape formatting failed, show generic area with shape name
          const shapeName = shape.charAt(0).toUpperCase() + shape.slice(1).replace(/_/g, ' ');
          targetingInfo = `${shapeName} Area`;
        }
      } else {
        // No shape configured, show generic area effect
        if (targetingType === 'cone') {
          targetingInfo = 'Cone Area';
        } else if (targetingType === 'line') {
          targetingInfo = 'Line Area';
        } else {
          targetingInfo = 'Area Effect';
        }
      }
    } else if (targetingType === 'multi') {
      const method = targetSelectionMethod || selectionMethod;
      if (method && method !== 'manual') {
        const methodName = method === 'random' ? 'Random' :
                          method === 'closest' || method === 'nearest' ? 'Nearest' :
                          method === 'furthest' || method === 'farthest' ? 'Farthest' :
                          method === 'lowest_health' ? 'Lowest HP' :
                          method === 'highest_health' ? 'Highest HP' : '';
        targetingInfo = `${maxTargets || 3} ${methodName}`;
      } else {
        targetingInfo = `${maxTargets || 3} Targets`;
      }
    } else if (targetingType === 'chain') {
      targetingInfo = 'Chain Effect';
    } else if (targetingType === 'single') {
      const method = targetSelectionMethod || selectionMethod;
      if (method && method !== 'manual') {
        const methodName = method === 'random' ? 'Random' :
                          method === 'closest' || method === 'nearest' ? 'Nearest' :
                          method === 'furthest' || method === 'farthest' ? 'Farthest' :
                          method === 'lowest_health' ? 'Lowest HP' :
                          method === 'highest_health' ? 'Highest HP' : '';
        targetingInfo = `Single Target (${methodName})`;
      } else {
        targetingInfo = 'Single Target';
      }
    } else if (targetingType === 'self' || targetingType === 'self_centered') {
      targetingInfo = 'Self';
    } else if (rangeType === 'self_centered' && !targetingInfo) {
      // If range is self-centered but targetingType wasn't set, show Self
      targetingInfo = 'Self';
    }

    // Add target restrictions if they exist and are meaningful
    let restrictionsInfo = '';
    if (targetRestrictions && targetRestrictions.length > 0 && !targetRestrictions.includes('any')) {
      const restrictionNames = targetRestrictions.map(r => {
        return r === 'enemy' ? 'Enemies' :
               r === 'ally' ? 'Allies' :
               r === 'self' ? 'Self' :
               r === 'creature' ? 'Creatures' :
               r === 'object' ? 'Objects' :
               r.charAt(0).toUpperCase() + r.slice(1);
      });
      restrictionsInfo = restrictionNames.join(', ');
    }

    // Add propagation info if it exists (check both effect-specific and unified)
    let propagationInfo = '';
    const propagation = effectConfig.propagation || (spell?.targetingMode === 'unified' ? spell?.propagation : null);
    if (propagation && propagation.method && propagation.method !== 'none') {
      const { method, behavior, parameters } = propagation;
      
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
        'nearest': 'Nearest',
        'farthest': 'Farthest',
        'random': 'Random',
        'lowest_health': 'Lowest HP',
        'highest_health': 'Highest HP',
        'ricocheting': 'Ricocheting',
        'accelerating': 'Accelerating',
        'decelerating': 'Decelerating',
        'smart': 'Smart Seeking',
        'persistent': 'Persistent',
        'phase_through': 'Phase Through',
        'delayed': 'Delayed',
        'instant': 'Instant',
        'chain_reaction': 'Chain Reaction',
        'radial': 'Radial',
        'directional': 'Directional',
        'viral': 'Viral',
        'equal_power': 'Equal Power',
        'diminishing': 'Diminishing',
        'focused': 'Focused'
      };

      // Get method name, with fallback capitalization
      let methodName = propagationMethods[method];
      if (!methodName) {
        // Capitalize and format method name if not in map
        methodName = method.split('_').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ') + ' Effect';
      }
      
      // Build the result string
      let result = methodName;
      
      // Add behavior if present (show behavior prominently)
      if (behavior && behaviorNames[behavior]) {
        result = `${methodName} (${behaviorNames[behavior]})`;
      } else if (behavior) {
        // Fallback if behavior not in map
        const behaviorName = behavior.split('_').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)
        ).join(' ');
        result = `${methodName} (${behaviorName})`;
      }
      
      // Add parameter information
      if (parameters) {
        const parts = [];
        if (method === 'chain' || method === 'bounce') {
          if (parameters.count) parts.push(`x${parameters.count}`);
          if (parameters.range) parts.push(`${parameters.range}ft`);
          if (parameters.decay && parameters.decay > 0) parts.push(`${parameters.decay}% decay`);
        } else if (method === 'seeking') {
          if (parameters.range) parts.push(`${parameters.range}ft`);
        } else if (method === 'explosion') {
          if (parameters.secondaryRadius) parts.push(`${parameters.secondaryRadius}ft radius`);
        } else if (method === 'spreading') {
          if (parameters.spreadRate) parts.push(`${parameters.spreadRate}ft/s`);
        } else if (method === 'forking') {
          if (parameters.forkCount) parts.push(`x${parameters.forkCount}`);
        }
        if (parts.length > 0) {
          result += ` - ${parts.join(', ')}`;
        }
      }
      
      propagationInfo = result;
    }

    // Only return if we have at least one piece of info to display
    if (!rangeStr && !targetingInfo && !restrictionsInfo && !propagationInfo) {
      return null;
    }

    return {
      range: rangeStr || null,
      targeting: targetingInfo || null,
      restrictions: restrictionsInfo || null,
      propagation: propagationInfo || null
    };
  };

  const formatTargetingType = () => {
    // If in effect-specific targeting mode, don't show unified targeting in header
    // Individual effects will show their own targeting badges
    if (spell?.targetingMode === 'effect' && spell.effectTargeting && Object.keys(spell.effectTargeting).length > 0) {
      return '';
    }

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
      case 'ground':
      case 'cone':
      case 'line':
        baseText = 'Area Effect';
        break;
      case 'chain':
        baseText = 'Chain Effect';
        break;
      case 'self_centered':
        // For self-centered effects, show as Self with restrictions
        baseText = 'Self';
        break;
      case 'self':
        // Don't show "Self" here since it's already shown in the range badge
        // This prevents duplicate "Self" badges
        return '';
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
        case 'nearest':
          methodText = 'Nearest';
          break;
        case 'furthest':
        case 'farthest':
          methodText = 'Farthest';
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
      result += baseText ? ` - ${restrictionText}` : restrictionText;
    }

    return result;
  };
  // ===== PROPAGATION FORMATTING =====

  const formatPropagation = () => {
    // If in effect-specific targeting mode, don't show unified propagation in header
    // Individual effects will show their own propagation badges
    if (spell?.targetingMode === 'effect' && spell.effectTargeting && Object.keys(spell.effectTargeting).length > 0) {
      return '';
    }
    
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

    // Check for buff configuration duration first
    if (spell.effectTypes?.includes('buff') && spell.buffConfig) {
      const buffData = spell.buffConfig;
      const durationValue = buffData.durationValue || buffData.duration;

      if (durationValue && buffData.durationType !== 'instant') {
        let durationText = '';

        if (buffData.durationType === 'permanent') {
          durationText = 'Permanent';
        } else if (buffData.durationType === 'rounds') {
          durationText = `${durationValue} ${durationValue === 1 ? 'round' : 'rounds'}`;
        } else if (buffData.durationType === 'turns') {
          durationText = `${durationValue} ${durationValue === 1 ? 'turn' : 'turns'}`;
        } else if (buffData.durationType === 'rest') {
          const restType = buffData.restType || 'long';
          durationText = `Until ${restType.charAt(0).toUpperCase() + restType.slice(1)} Rest`;
        } else if (buffData.durationType === 'minutes') {
          durationText = `${durationValue} ${durationValue === 1 ? 'minute' : 'minutes'}`;
        } else if (buffData.durationType === 'hours') {
          durationText = `${durationValue} ${durationValue === 1 ? 'hour' : 'hours'}`;
        } else if (buffData.durationType === 'time' && durationValue) {
          const unit = buffData.durationUnit || 'rounds';
          durationText = `${durationValue} ${unit}`;
        } else if (durationValue) {
          durationText = `${durationValue} rounds`;
        }

        // Add concentration requirement if applicable
        if (buffData.concentrationRequired) {
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

        return durationText;
      }
    }

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

        // Show interruption status
        if (typeConfig.interruptible !== undefined) {
          bullets.push(typeConfig.interruptible ? 'Can be interrupted' : 'Cannot be interrupted');
        }

        // Show movement restrictions
        if (typeConfig.movementAllowed !== undefined) {
          bullets.push(typeConfig.movementAllowed ? 'Can move while channeling' : 'Must stand still');
        }

        // Note: Resource cost frequency is now shown next to the resource costs, not as a separate bullet

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
        // Show availability only if it's not the default "always available"
        if (typeConfig.availabilityType && typeConfig.availabilityType !== 'ALWAYS') {
          const availability = typeConfig.availabilityType.replace(/_/g, ' ').toLowerCase();
          bullets.push(availability);
        }

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
        // Toggleable is now displayed as part of the "Passive" tag, not as a bullet
        // No bullets for PASSIVE type
        break;

      case 'ACTION':
        // No bullets for ACTION type - removed to reduce header clutter
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
          // Don't add explosion bullet - it's already shown in the propagation badge
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
      'arcane_energy_points': faBolt,
      'arcaneenergypoints': faBolt,
      'aep': faBolt,
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
      'arcane_energy_points': '#4169E1',
      'arcaneenergypoints': '#4169E1',
      'aep': '#4169E1',
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
      // Check all selected resource types and consolidate duplicates
      const selectedTypesRaw = spell.resourceCost.resourceTypes || [];
      
      // Consolidate duplicate resource types - count occurrences and use value from resourceValues
      const resourceTypeCounts = {};
      selectedTypesRaw.forEach(type => {
        resourceTypeCounts[type] = (resourceTypeCounts[type] || 0) + 1;
      });
      
      // Create deduplicated list (keep unique types only)
      const selectedTypes = Object.keys(resourceTypeCounts);

      // List of sphere resource types to skip (they're handled separately below)
      const sphereTypes = ['arcane_sphere', 'holy_sphere', 'shadow_sphere', 'fire_sphere', 'ice_sphere', 'nature_sphere', 'healing_sphere', 'chaos_sphere'];

      // List of Inferno resource types to skip (they're handled separately below)
      const infernoTypes = ['inferno_required', 'inferno_ascend', 'inferno_descend'];

      // List of Chronarch resource types to skip (they're handled separately below)
      const chronarchTypes = ['time_shard_generate', 'time_shard_cost', 'temporal_strain_gain', 'temporal_strain_reduce'];

      // List of Devotion resource types to skip (custom badges below)
      const devotionTypes = ['devotion_required', 'devotion_cost', 'devotion_gain'];

      // List of Chaos Weaver resource types to skip (custom badges below)
      const mayhemTypes = ['mayhem_generate', 'mayhem_spend'];

      // List of Fate Weaver resource types to skip (custom badges below)
      const fateTypes = ['fate_generate', 'fate_spend', 'threads_generate', 'threads_spend'];

      // List of Musical Note resource types to skip (they're handled separately below)
      const musicalNoteTypes = ['note_i', 'note_ii', 'note_iii', 'note_iv', 'note_v', 'note_vi', 'note_vii'];

      // List of Berserker Rage State types to skip (handled separately below)
      const rageStateTypes = ['rage_state'];

      // List of Formbender Wild Instinct types to skip (handled separately below)
      const wildInstinctTypes = ['wild_instinct', 'wild_instinct_generate', 'wild_instinct_cost'];

      // List of Dreadnaught and Deathcaller types to skip (handled separately below)
      const drpTypes = ['drp'];
      const deathcallerTypes = ['bloodTokens', 'ascension_required'];

      // List of Huntress Quarry Mark types to skip (handled separately below)
      const quarryMarkTypes = ['quarry_marks', 'quarry_marks_generate', 'quarry_marks_cost'];

      // List of Warden Vengeance Point types to skip (handled separately below)
      const vengeancePointTypes = ['vengeance_points', 'vengeance_points_generate', 'vengeance_points_cost'];

      selectedTypes.forEach(type => {
        // Skip sphere types - they're handled separately below
        if (sphereTypes.includes(type)) {
          return;
        }

        // Skip Inferno types - they're handled separately below
        if (infernoTypes.includes(type)) {
          return;
        }

        // Skip Chronarch types - they're handled separately below
        if (chronarchTypes.includes(type)) {
          return;
        }

        // Skip Devotion types - handled below
        if (devotionTypes.includes(type)) {
          return;
        }

        // Skip Chaos Weaver Mayhem types - handled below
        if (mayhemTypes.includes(type)) {
          return;
        }

        // Skip Fate Weaver Fate Token types - handled below
        if (fateTypes.includes(type)) {
          return;
        }

        // Skip Musical Note types - handled below
        if (musicalNoteTypes.includes(type)) {
          return;
        }

        // Skip Rage State types - handled below
        if (rageStateTypes.includes(type)) {
          return;
        }

        // Skip Wild Instinct types - handled below
        if (wildInstinctTypes.includes(type)) {
          return;
        }

        // Skip DRP types - handled below
        if (drpTypes.includes(type)) {
          return;
        }

        // Skip Deathcaller types - handled below
        if (deathcallerTypes.includes(type)) {
          return;
        }

        // Skip Quarry Mark types - handled below
        if (quarryMarkTypes.includes(type)) {
          return;
        }

        // Skip Vengeance Point types - handled below
        if (vengeancePointTypes.includes(type)) {
          return;
        }

        const useFormula = spell.resourceCost.useFormulas && spell.resourceCost.useFormulas[type];
        const formula = spell.resourceCost.resourceFormulas && spell.resourceCost.resourceFormulas[type];
        const amount = spell.resourceCost.resourceValues && spell.resourceCost.resourceValues[type];

        // Show resource if it uses a formula OR has a value > 0
        if ((useFormula && formula) || (amount > 0)) {
          // Format the amount with frequency for channeling spells
          let displayAmount = useFormula ? formula : amount;

          // Add frequency for channeling spells
          if (spell.spellType === 'CHANNELED' && spell.resourceCost.channelingFrequency) {
            const frequency = spell.resourceCost.channelingFrequency;
            const frequencyText = frequency === 'per_round' ? '/round' :
                                 frequency === 'per_turn' ? '/turn' :
                                 frequency === 'per_second' ? '/sec' :
                                 frequency === 'atStart' ? ' (at start)' :
                                 frequency === 'atEnd' ? ' (at end)' : '';
            displayAmount = `${displayAmount}${frequencyText}`;
          }

          resources.push({
            type: type.toLowerCase().replace(/\s+/g, '-'),
            amount: displayAmount,
            name: formatResourceName(type),
            icon: getResourceIcon(type),
            color: getResourceColor(type),
            isFormula: useFormula
          });
        }
      });
    }

    // Check for simple resource cost format: { mana: 25, health: 0, stamina: 0, focus: 0, classResource: {...} }
    // This handles class spells, test spells, and any spell with direct resource properties
    if (spell.resourceCost && !spell.resourceCost.resourceTypes) {
      // List of valid resource types to check
      const validResourceTypes = ['mana', 'health', 'stamina', 'focus', 'actionPoints'];

      validResourceTypes.forEach(type => {
        const amount = spell.resourceCost[type];
        if (amount > 0) {
          // Don't add if already added from resourceValues
          if (!resources.some(r => r.type === type.toLowerCase().replace(/\s+/g, '-'))) {
            resources.push({
              type: type.toLowerCase().replace(/\s+/g, '-'),
              amount: amount,
              name: formatResourceName(type),
              icon: getResourceIcon(type),
              color: getResourceColor(type)
            });
          }
        }
      });

      // Check for class resource (e.g., arcane_charges, holy_power, etc.)
      if (spell.resourceCost.classResource && spell.resourceCost.classResource.cost > 0) {
        const classResourceType = spell.resourceCost.classResource.type;
        const classResourceCost = spell.resourceCost.classResource.cost;

        resources.push({
          type: classResourceType.toLowerCase().replace(/\s+/g, '-'),
          amount: classResourceCost,
          name: formatResourceName(classResourceType),
          icon: getResourceIcon(classResourceType),
          color: getResourceColor(classResourceType)
        });
      }
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

    // Check for enhanced spell library format (resourceCost.mana.baseAmount)
    if (spell.resourceCost && spell.resourceCost.mana && !resources.some(r => r.type === 'mana')) {
      let manaAmount = spell.resourceCost.mana.baseAmount || spell.resourceCost.mana;

      // If the mana cost is a generic 25, try to calculate a more appropriate cost
      if (manaAmount === 25 && spell.effectTypes && spell.effectTypes.length > 0) {
        try {
          const calculatedCost = calculateManaCost(spell);
          // Only use calculated cost if it's significantly different and reasonable
          if (calculatedCost !== 25 && calculatedCost >= 5 && calculatedCost <= 100) {
            manaAmount = calculatedCost;
          }
        } catch (error) {
          // Fall back to original cost if calculation fails
          console.warn('Failed to calculate mana cost for spell:', spell.name, error);
        }
      }

      resources.push({
        type: 'mana',
        amount: manaAmount,
        name: 'Mana',
        icon: getResourceIcon('mana'),
        color: getResourceColor('mana')
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

    // Add Action Points (moved here to appear early in resource list, after main resources but before spheres)
    if (spell.resourceCost && spell.resourceCost.actionPoints !== undefined && spell.resourceCost.actionPoints > 0) {
      // Check if actionPoints is already in resourceTypes (wizard format)
      const actionPointsInTypes = spell.resourceCost.resourceTypes && spell.resourceCost.resourceTypes.includes('action_points');

      // Check if already added (check all possible type variations: 'actionpoints', 'action-points', 'action_points')
      const alreadyAdded = resources.some(r =>
        r.type === 'action-points' ||
        r.type === 'action_points' ||
        r.type === 'actionpoints'
      );

      // Only add if:
      // 1. Not in resourceTypes (so it's not being handled by the wizard format loop above)
      // 2. Not already added from legacy format
      // 3. This is a wizard format spell (has resourceTypes) OR legacy format (no resourceTypes but actionPoints exists)
      if (!actionPointsInTypes && !alreadyAdded) {
        resources.push({
          type: 'action-points',
          amount: spell.resourceCost.actionPoints,
          name: 'Action Points',
          icon: faBolt,
          color: '#ffffff' // Use white to match other resources in header
        });
      }
    }

    // Check for sphere resources from wizard (new format) - process this FIRST
    const sphereResourceMap = {
      'arcane_sphere': { name: 'Arcane Sphere', color: '#9370DB', icon: faAtom },
      'holy_sphere': { name: 'Holy Sphere', color: '#FFD700', icon: faSun },
      'shadow_sphere': { name: 'Shadow Sphere', color: '#1C1C1C', icon: faMoon },
      'fire_sphere': { name: 'Fire Sphere', color: '#FF4500', icon: faFire },
      'ice_sphere': { name: 'Ice Sphere', color: '#4169E1', icon: faSnowflake },
      'nature_sphere': { name: 'Nature Sphere', color: '#32CD32', icon: faLeaf },
      'healing_sphere': { name: 'Healing Sphere', color: '#FFFF00', icon: faHeart },
      'chaos_sphere': { name: 'Chaos Sphere', color: '#FF00FF', icon: faBolt }
    };

    if (spell.resourceCost && spell.resourceCost.resourceTypes) {
      // Consolidate duplicate sphere types - deduplicate the resourceTypes array
      const uniqueSphereTypes = [...new Set(spell.resourceCost.resourceTypes.filter(type => sphereResourceMap[type]))];
      
      // Process each unique sphere type once, using the value from resourceValues
      uniqueSphereTypes.forEach(type => {
        const useFormula = spell.resourceCost.useFormulas && spell.resourceCost.useFormulas[type];
        const formula = spell.resourceCost.resourceFormulas && spell.resourceCost.resourceFormulas[type];
        const amount = spell.resourceCost.resourceValues && spell.resourceCost.resourceValues[type];

        if ((useFormula && formula) || (amount > 0)) {
          const sphereInfo = sphereResourceMap[type];
          // Check if already added to avoid duplicates
          if (!resources.some(r => r.type === `sphere-${type}`)) {
            resources.push({
              type: `sphere-${type}`,
              amount: useFormula ? formula : amount,
              name: sphereInfo.name,
              icon: sphereInfo.icon,
              color: sphereInfo.color,
              isSphere: true,
              isFormula: useFormula
            });
          }
        }
      });
    }

    // Check for Arcanoneer sphere costs (legacy array format) - ONLY if new format wasn't processed
    // Only use legacy format if resourceTypes doesn't contain any sphere types
    const hasNewFormatSpheres = spell.resourceCost?.resourceTypes?.some(type => 
      ['arcane_sphere', 'holy_sphere', 'shadow_sphere', 'fire_sphere', 'ice_sphere', 
       'nature_sphere', 'healing_sphere', 'chaos_sphere'].includes(type)
    );

    if (!hasNewFormatSpheres && spell.resourceCost && spell.resourceCost.spheres && Array.isArray(spell.resourceCost.spheres)) {
      // Count sphere types
      const sphereCounts = {};
      spell.resourceCost.spheres.forEach(sphere => {
        sphereCounts[sphere] = (sphereCounts[sphere] || 0) + 1;
      });

      // Add each sphere type as a resource
      Object.entries(sphereCounts).forEach(([sphereType, count]) => {
        const nameMap = {
          'Arcane': 'Arcane Sphere',
          'Fire': 'Fire Sphere',
          'Ice': 'Ice Sphere',
          'Healing': 'Healing Sphere',
          'Nature': 'Nature Sphere',
          'Shadow': 'Shadow Sphere',
          'Chaos': 'Chaos Sphere',
          'Holy': 'Holy Sphere'
        };

        const colorMap = {
          'Arcane': '#9370DB',
          'Fire': '#FF4500',
          'Ice': '#4169E1',
          'Healing': '#FFFF00',
          'Nature': '#32CD32',
          'Shadow': '#1C1C1C',
          'Chaos': '#FF00FF',
          'Holy': '#FFD700'
        };

        const iconMap = {
          'Arcane': faAtom,
          'Fire': faFire,
          'Ice': faSnowflake,
          'Healing': faHeart,
          'Nature': faLeaf,
          'Shadow': faMoon,
          'Chaos': faBolt,
          'Holy': faSun
        };

        // Check if already added to avoid duplicates
        const sphereTypeKey = `sphere-${sphereType.toLowerCase()}`;
        if (!resources.some(r => r.type === sphereTypeKey)) {
          resources.push({
            type: sphereTypeKey,
            amount: count,
            name: nameMap[sphereType] || `${sphereType} Sphere`,
            icon: iconMap[sphereType] || faAtom,
            color: colorMap[sphereType] || '#9370DB',
            isSphere: true
          });
        }
      });
    }


    // Add Pyrofiend Inferno costs - compact display
    const infernoRequired = spell.infernoRequired || spell.resourceCost?.resourceValues?.inferno_required;
    if (infernoRequired !== undefined && infernoRequired > 0) {
      resources.push({
        type: 'inferno-required',
        amount: `[${getInfernoStageNameWithSuffix(infernoRequired).replace(' Inferno', '')}]`,
        name: '',
        icon: faFire,
        color: '#8b0000',
        isInferno: true,
        isRequired: true,
        fullText: `Requires [${getInfernoStageNameWithSuffix(infernoRequired)}]`
      });
    }
    const infernoAscend = spell.infernoAscend || spell.resourceCost?.resourceValues?.inferno_ascend;
    if (infernoAscend !== undefined && infernoAscend > 0) {
      resources.push({
        type: 'inferno-ascend',
        amount: `+${infernoAscend}`,
        name: 'Inferno',
        icon: faFire,
        color: '#ff4500',
        isInferno: true,
        fullText: `Ascend Inferno +${infernoAscend}`
      });
    }
    const infernoDescend = spell.infernoDescend || spell.resourceCost?.resourceValues?.inferno_descend;
    if (infernoDescend !== undefined && infernoDescend !== 0 && infernoDescend !== '0') {
      // Handle both numeric and dice formula descend values
      const descendValue = typeof infernoDescend === 'string' ? infernoDescend : infernoDescend;
      resources.push({
        type: 'inferno-descend',
        amount: `-${descendValue}`,
        name: 'Inferno',
        icon: faFire,
        color: '#4682b4',
        isInferno: true,
        fullText: `Descend Inferno -${descendValue}`
      });
    }

    // Add Martyr Devotion Level costs - check both flat properties and specialMechanics
    const devotionRequired = spell.devotionRequired || spell.specialMechanics?.devotionLevel?.required;
    const devotionCost = spell.devotionCost || spell.specialMechanics?.devotionLevel?.cost || spell.specialMechanics?.devotionLevel?.amplifiedCost;
    const devotionGain = spell.devotionGain || spell.specialMechanics?.devotionLevel?.gain;

    if (devotionRequired !== undefined && devotionRequired > 0) {
      resources.push({
        type: 'devotion-required',
        amount: `Requires Devotion Level ${devotionRequired}`,
        name: '',
        icon: faHeart,
        color: '#FFD700',
        isDevotion: true
      });
    }
    if (devotionCost !== undefined && devotionCost > 0) {
      resources.push({
        type: 'devotion-cost',
        amount: `Costs ${devotionCost} Devotion Level${devotionCost > 1 ? 's' : ''}`,
        name: '',
        icon: faShield,
        color: '#FFD700',
        isDevotion: true
      });
    }
    if (devotionGain !== undefined && devotionGain > 0) {
      resources.push({
        type: 'devotion-gain',
        amount: `+${devotionGain} Devotion Level${devotionGain > 1 ? 's' : ''}`,
        name: '',
        icon: faArrowUp,
        color: '#32CD32',
        isDevotion: true
      });
    }

    // Also check resourceCost.resourceValues for Devotion Level (wizard format)
    if (spell.resourceCost && spell.resourceCost.resourceValues) {
      const resourceValues = spell.resourceCost.resourceValues;
      if (resourceValues.devotion_required !== undefined && resourceValues.devotion_required > 0 && !devotionRequired) {
        resources.push({
          type: 'devotion-required',
          amount: `Requires Devotion Level ${resourceValues.devotion_required}`,
          name: '',
          icon: faHeart,
          color: '#FFD700',
          isDevotion: true
        });
      }
      if (resourceValues.devotion_cost !== undefined && resourceValues.devotion_cost > 0 && !devotionCost) {
        resources.push({
          type: 'devotion-cost',
          amount: `Costs ${resourceValues.devotion_cost} Devotion Level${resourceValues.devotion_cost > 1 ? 's' : ''}`,
          name: '',
          icon: faShield,
          color: '#FFD700',
          isDevotion: true
        });
      }
      if (resourceValues.devotion_gain !== undefined && resourceValues.devotion_gain > 0 && !devotionGain) {
        resources.push({
          type: 'devotion-gain',
          amount: `+${resourceValues.devotion_gain} Devotion Level${resourceValues.devotion_gain > 1 ? 's' : ''}`,
          name: '',
          icon: faArrowUp,
          color: '#32CD32',
          isDevotion: true
        });
      }
    }

    // Add Chronarch resources from wizard format
    if (spell.resourceCost && spell.resourceCost.resourceTypes) {
      const chronarchResourceMap = {
        'time_shard_generate': { name: 'Time Shard', color: '#4169E1', icon: faClock, isGenerate: true },
        'time_shard_cost': { name: 'Time Shard', color: '#4169E1', icon: faHourglass, isConsume: true },
        'temporal_strain_gain': { name: 'Strain', color: '#DC143C', icon: faExclamationTriangle, isStrain: true },
        'temporal_strain_reduce': { name: 'Strain', color: '#32CD32', icon: faHeart, isStrainReduce: true }
      };

      spell.resourceCost.resourceTypes.forEach(type => {
        if (chronarchResourceMap[type]) {
          const useFormula = spell.resourceCost.useFormulas && spell.resourceCost.useFormulas[type];
          const formula = spell.resourceCost.resourceFormulas && spell.resourceCost.resourceFormulas[type];
          const amount = spell.resourceCost.resourceValues && spell.resourceCost.resourceValues[type];

          if ((useFormula && formula) || (amount > 0)) {
            const chronarchInfo = chronarchResourceMap[type];
            const numericAmount = useFormula ? formula : amount;

            // Format with +/- prefix
            let displayAmount;
            if (chronarchInfo.isGenerate || chronarchInfo.isStrain) {
              displayAmount = numericAmount > 1 ? `+${numericAmount}` : '+1';
            } else {
              displayAmount = numericAmount > 1 ? `-${numericAmount}` : '-1';
            }
            // Only push the compact Chronarch badge, skip labeled legacy badge
            resources.push({
              type: `chronarch-${type}`,
              amount: displayAmount,
              name: chronarchInfo.name,
              icon: chronarchInfo.icon,
              color: chronarchInfo.color,
              isChronarch: true,
              isGenerate: chronarchInfo.isGenerate,
              isConsume: chronarchInfo.isConsume,
              isStrain: chronarchInfo.isStrain,
              isStrainReduce: chronarchInfo.isStrainReduce,
              isFormula: useFormula
            });
          }
        }
      });
    }

    // Add Chaos Weaver Mayhem Modifiers (generate/spend) from wizard format
    if (spell.resourceCost && spell.resourceCost.resourceTypes) {
      const mayhemMap = {
        'mayhem_generate': { name: 'Mayhem Modifiers', color: '#8A2BE2', icon: faRandom, sign: '+' },
        'mayhem_spend': { name: 'Mayhem Modifiers', color: '#8A2BE2', icon: faRandom, sign: '-' }
      };

      spell.resourceCost.resourceTypes.forEach(type => {
        if (mayhemMap[type]) {
          const useFormula = spell.resourceCost.useFormulas && spell.resourceCost.useFormulas[type];
          const formula = spell.resourceCost.resourceFormulas && spell.resourceCost.resourceFormulas[type];
          const amount = spell.resourceCost.resourceValues && spell.resourceCost.resourceValues[type];
          if ((useFormula && formula) || (typeof amount === 'number' && amount !== 0)) {
            const info = mayhemMap[type];
            resources.push({
              type,
              amount: useFormula ? `${info.sign}${formula}` : `${info.sign}${amount}`,
              name: info.name,
              icon: info.icon,
              color: info.color,
              isChaosWeaver: true,
              isFormula: useFormula
            });
          }
        }
      });
    }

    // Add Fate Weaver Fate Tokens (generate/spend) from wizard format
    if (spell.resourceCost && spell.resourceCost.resourceTypes) {
      const fateMap = {
        'fate_generate': { name: 'Fate Tokens', color: '#2E86C1', icon: faRandom, sign: '+' },
        'fate_spend': { name: 'Fate Tokens', color: '#2E86C1', icon: faRandom, sign: '-' }
      };

      spell.resourceCost.resourceTypes.forEach(type => {
        if (fateMap[type]) {
          const useFormula = spell.resourceCost.useFormulas && spell.resourceCost.useFormulas[type];
          const formula = spell.resourceCost.resourceFormulas && spell.resourceCost.resourceFormulas[type];
          const amount = spell.resourceCost.resourceValues && spell.resourceCost.resourceValues[type];
          if ((useFormula && formula) || (typeof amount === 'number' && amount !== 0)) {
            const info = fateMap[type];
            resources.push({
              type,
              amount: useFormula ? `${info.sign}${formula}` : `${info.sign}${amount}`,
              name: info.name,
              icon: info.icon,
              color: info.color,
              isFateWeaver: true,
              isFormula: useFormula
            });
          }
        }
      });
    }

    // Add Fate Weaver Threads of Destiny (generate/spend) from wizard format
    if (spell.resourceCost && spell.resourceCost.resourceTypes) {
      const threadsMap = {
        'threads_generate': { name: 'Threads of Destiny', color: '#9370DB', icon: faScroll, sign: '+' },
        'threads_spend': { name: 'Threads of Destiny', color: '#9370DB', icon: faScroll, sign: '-' }
      };

      spell.resourceCost.resourceTypes.forEach(type => {
        if (threadsMap[type]) {
          const useFormula = spell.resourceCost.useFormulas && spell.resourceCost.useFormulas[type];
          const formula = spell.resourceCost.resourceFormulas && spell.resourceCost.resourceFormulas[type];
          const amount = spell.resourceCost.resourceValues && spell.resourceCost.resourceValues[type];
          if ((useFormula && formula) || (typeof amount === 'number' && amount !== 0)) {
            const info = threadsMap[type];
            resources.push({
              type,
              amount: useFormula ? `${info.sign}${formula}` : `${info.sign}${amount}`,
              name: info.name,
              icon: info.icon,
              color: info.color,
              isFateWeaver: true,
              isFormula: useFormula
            });
          }
        }
      });
    }

    // Add Musical Notes from resourceCost.resourceTypes (wizard format)
    if (spell.resourceCost && spell.resourceCost.resourceTypes) {
      const musicalNoteTypeMap = {
        'note_i': { note: 'I', functionName: 'Tonic' },
        'note_ii': { note: 'II', functionName: 'Supertonic' },
        'note_iii': { note: 'III', functionName: 'Mediant' },
        'note_iv': { note: 'IV', functionName: 'Subdominant' },
        'note_v': { note: 'V', functionName: 'Dominant' },
        'note_vi': { note: 'VI', functionName: 'Submediant' },
        'note_vii': { note: 'VII', functionName: 'Leading Tone' }
      };

      spell.resourceCost.resourceTypes.forEach(type => {
        if (musicalNoteTypeMap[type]) {
          const useFormula = spell.resourceCost.useFormulas && spell.resourceCost.useFormulas[type];
          const formula = spell.resourceCost.resourceFormulas && spell.resourceCost.resourceFormulas[type];
          const amount = spell.resourceCost.resourceValues && spell.resourceCost.resourceValues[type];

          if ((useFormula && formula) || (typeof amount === 'number' && amount !== 0)) {
            const noteInfo = musicalNoteTypeMap[type];
            // For formulas, check if formula string starts with '-' to determine consuming
            // For numeric amounts, check the sign directly
            const isGenerating = useFormula 
              ? !formula.trim().startsWith('-')
              : amount > 0;

            // Format display text
            let displayText;
            if (useFormula) {
              // Formula already contains sign, just add function name
              displayText = `${formula} ${noteInfo.functionName} (${noteInfo.note})`;
            } else {
              const absAmount = Math.abs(amount);
              if (absAmount > 1) {
                displayText = `${isGenerating ? '+' : '-'}${absAmount} ${noteInfo.functionName} (${noteInfo.note})`;
              } else {
                displayText = `${isGenerating ? '+' : '-'}${noteInfo.functionName} (${noteInfo.note})`;
              }
            }

            resources.push({
              type: isGenerating ? 'musical-generates' : 'musical-consumes',
              amount: displayText,
              name: '',
              clefSymbol: isGenerating ? '𝄞' : '𝄢', // Treble clef for builder, bass clef for resolver
              color: isGenerating ? '#9370DB' : '#4169E1',
              isMusicalNote: true,
              isGenerate: isGenerating,
              isConsume: !isGenerating,
              isFormula: useFormula
            });
          }
        }
      });
    }

    // Add Berserker Rage State requirements
    if (spell.resourceCost && spell.resourceCost.resourceTypes) {
      spell.resourceCost.resourceTypes.forEach(type => {
        if (type === 'rage_state') {
          const rageState = spell.resourceCost.resourceValues && spell.resourceCost.resourceValues[type];
          if (rageState) {
            resources.push({
              type: 'rage-state',
              amount: `Requires [${rageState}]`,
              name: '',
              icon: faFire,
              color: '#FF4500',
              isRageState: true
            });
          }
        }
      });
    }

    // Add Formbender Wild Instinct (generate/cost)
    if (spell.resourceCost && spell.resourceCost.resourceTypes) {
      const wildInstinctMap = {
        'wild_instinct_generate': { name: 'Wild Instinct', color: '#228B22', icon: faPaw, sign: '+' },
        'wild_instinct_cost': { name: 'Wild Instinct', color: '#228B22', icon: faPaw, sign: '' },
        'wild_instinct': { name: 'Wild Instinct', color: '#228B22', icon: faPaw, sign: '' }
      };

      spell.resourceCost.resourceTypes.forEach(type => {
        if (wildInstinctMap[type]) {
          const useFormula = spell.resourceCost.useFormulas && spell.resourceCost.useFormulas[type];
          const formula = spell.resourceCost.resourceFormulas && spell.resourceCost.resourceFormulas[type];
          const amount = spell.resourceCost.resourceValues && spell.resourceCost.resourceValues[type];
          if ((useFormula && formula) || (typeof amount === 'number' && amount !== 0)) {
            const config = wildInstinctMap[type];
            resources.push({
              type: type,
              amount: `${config.sign}${useFormula ? formula : amount}`,
              name: config.name,
              icon: config.icon,
              color: config.color,
              isFormula: useFormula
            });
          }
        }
      });
    }

    // Add Dreadnaught DRP (Dark Resilience Points)
    if (spell.resourceCost && spell.resourceCost.resourceTypes) {
      spell.resourceCost.resourceTypes.forEach(type => {
        if (type === 'drp') {
          const useFormula = spell.resourceCost.useFormulas && spell.resourceCost.useFormulas[type];
          const formula = spell.resourceCost.resourceFormulas && spell.resourceCost.resourceFormulas[type];
          const amount = spell.resourceCost.resourceValues && spell.resourceCost.resourceValues[type];
          if ((useFormula && formula) || (typeof amount === 'number' && amount !== 0) || amount === 'variable') {
            const displayAmount = amount === 'variable' ? 'Variable' : (useFormula ? formula : amount);
            resources.push({
              type: 'drp',
              amount: displayAmount,
              name: 'DRP',
              icon: faShield,
              color: '#4B0082',
              isFormula: useFormula,
              isDRP: true
            });
          }
        }
      });
    }

    // Add Deathcaller Blood Tokens
    if (spell.resourceCost && spell.resourceCost.resourceTypes) {
      spell.resourceCost.resourceTypes.forEach(type => {
        if (type === 'bloodTokens') {
          const amount = spell.resourceCost.resourceValues && spell.resourceCost.resourceValues[type];
          if (typeof amount === 'number' && amount > 0) {
            resources.push({
              type: 'blood-tokens',
              amount: amount,
              name: 'Blood Tokens',
              icon: faTint,
              color: '#8B0000',
              isBloodTokens: true
            });
          }
        }
      });
    }

    // Add Deathcaller Ascension Path requirements
    if (spell.resourceCost && spell.resourceCost.resourceTypes) {
      spell.resourceCost.resourceTypes.forEach(type => {
        if (type === 'ascension_required') {
          const ascensionPath = spell.resourceCost.resourceValues && spell.resourceCost.resourceValues[type];
          if (ascensionPath) {
            const pathNames = {
              'shrouded_veil': 'Shrouded Veil',
              'crimson_pact': 'Crimson Pact',
              'eternal_hunger': 'Eternal Hunger'
            };
            const displayName = pathNames[ascensionPath] || ascensionPath;
            resources.push({
              type: 'ascension-required',
              amount: `Requires ${displayName}`,
              name: '',
              icon: faSkull,
              color: '#2F4F4F',
              isAscensionRequired: true
            });
          }
        }
      });
    }

    // Add Huntress Quarry Marks (generate/cost)
    if (spell.resourceCost && spell.resourceCost.resourceTypes) {
      const quarryMarkMap = {
        'quarry_marks_generate': { name: 'Quarry Marks', color: '#8B4513', icon: faCrosshairs, sign: '+' },
        'quarry_marks_cost': { name: 'Quarry Marks', color: '#8B4513', icon: faCrosshairs, sign: '' },
        'quarry_marks': { name: 'Quarry Marks', color: '#8B4513', icon: faCrosshairs, sign: '' }
      };

      spell.resourceCost.resourceTypes.forEach(type => {
        if (quarryMarkMap[type]) {
          const useFormula = spell.resourceCost.useFormulas && spell.resourceCost.useFormulas[type];
          const formula = spell.resourceCost.resourceFormulas && spell.resourceCost.resourceFormulas[type];
          const amount = spell.resourceCost.resourceValues && spell.resourceCost.resourceValues[type];
          if ((useFormula && formula) || (typeof amount === 'number' && amount !== 0)) {
            const config = quarryMarkMap[type];
            resources.push({
              type: type,
              amount: `${config.sign}${useFormula ? formula : amount}`,
              name: config.name,
              icon: config.icon,
              color: config.color,
              isFormula: useFormula
            });
          }
        }
      });
    }

    // Add Warden Vengeance Points (generate/cost)
    if (spell.resourceCost && spell.resourceCost.resourceTypes) {
      const vengeancePointMap = {
        'vengeance_points_generate': { name: 'Vengeance Points', color: '#8B0000', icon: faBalanceScale, sign: '+' },
        'vengeance_points_cost': { name: 'Vengeance Points', color: '#8B0000', icon: faBalanceScale, sign: '' },
        'vengeance_points': { name: 'Vengeance Points', color: '#8B0000', icon: faBalanceScale, sign: '' }
      };

      spell.resourceCost.resourceTypes.forEach(type => {
        if (vengeancePointMap[type]) {
          const useFormula = spell.resourceCost.useFormulas && spell.resourceCost.useFormulas[type];
          const formula = spell.resourceCost.resourceFormulas && spell.resourceCost.resourceFormulas[type];
          const amount = spell.resourceCost.resourceValues && spell.resourceCost.resourceValues[type];
          if ((useFormula && formula) || (typeof amount === 'number' && amount !== 0)) {
            const config = vengeancePointMap[type];
            resources.push({
              type: type,
              amount: `${config.sign}${useFormula ? formula : amount}`,
              name: config.name,
              icon: config.icon,
              color: config.color,
              isFormula: useFormula
            });
          }
        }
      });
    }

    // Add Minstrel Musical Combo costs - check both spell.musicalCombo and spell.specialMechanics.musicalCombo
    const musicalCombo = spell.musicalCombo || spell.specialMechanics?.musicalCombo;
    if (musicalCombo) {
      const noteFunctionMap = {
        'I': 'Tonic',
        'II': 'Supertonic',
        'III': 'Mediant',
        'IV': 'Subdominant',
        'V': 'Dominant',
        'VI': 'Submediant',
        'VII': 'Leading Tone'
      };

      if (musicalCombo.type === 'builder' && musicalCombo.generates) {
        // Builder spell - shows treble clef "𝄞 +X Note (I)" format
        musicalCombo.generates.forEach(noteGen => {
          const functionName = noteFunctionMap[noteGen.note] || noteGen.note;
          const displayText = noteGen.count > 1
            ? `+${noteGen.count} ${functionName} (${noteGen.note})`
            : `+${functionName} (${noteGen.note})`;
          resources.push({
            type: 'musical-generates',
            amount: displayText,
            name: '',
            clefSymbol: '𝄞', // Treble clef Unicode
            color: '#9370DB',
            isMusicalNote: true,
            isGenerate: true
          });
        });
      } else if (musicalCombo.type === 'resolver' && musicalCombo.consumes) {
        // Resolver spell - shows bass clef "𝄢 -X Note (I)" format
        musicalCombo.consumes.forEach(noteReq => {
          const functionName = noteFunctionMap[noteReq.note] || noteReq.note;
          const displayText = noteReq.count > 1
            ? `-${noteReq.count} ${functionName} (${noteReq.note})`
            : `-${functionName} (${noteReq.note})`;
          resources.push({
            type: 'musical-consumes',
            amount: displayText,
            name: '',
            clefSymbol: '𝄢', // Bass clef Unicode
            color: '#4169E1',
            isMusicalNote: true,
            isConsume: true
          });
        });
      }
    }

    // Add Chronarch Time Shard resources - supports both generation and consumption
    const timeShardGenerate = spell.timeShardGenerate || spell.specialMechanics?.timeShards?.generated;
    const timeShardCost = spell.timeShardCost || spell.specialMechanics?.temporalFlux?.shardCost;

    if (timeShardGenerate !== undefined && timeShardGenerate > 0) {
      // Time Shard generation (basic spells) - uses clock icon with compact format
      const displayText = timeShardGenerate > 1 ? `+${timeShardGenerate}` : '+1';
      resources.push({
        type: 'time-shards-generate',
        amount: displayText,
        name: 'Time Shard',
        icon: faClock,
        color: '#4169E1',
        isChronarch: true,
        isGenerate: true
      });
    }

    if (timeShardCost !== undefined && timeShardCost > 0) {
      // Time Shard consumption (Flux abilities) - uses hourglass icon with compact format
      const displayText = timeShardCost > 1 ? `-${timeShardCost}` : '-1';
      resources.push({
        type: 'time-shards-cost',
        amount: displayText,
        name: 'Time Shard',
        icon: faHourglass,
        color: '#4169E1',
        isChronarch: true,
        isConsume: true
      });
    }

    // Add Chaos Weaver Mayhem Modifiers - supports both generation and consumption
    const mayhemGenerate = spell.mayhemGenerate || spell.resourceFormulas?.mayhem_generate;
    const mayhemCost = spell.mayhemCost || spell.resourceValues?.mayhem_spend || spell.resourceValues?.mayhem_cost;

    if (mayhemGenerate !== undefined && mayhemGenerate !== null) {
      // Mayhem Modifier generation - uses dice icon with compact format
      resources.push({
        type: 'mayhem-generate',
        amount: `+${mayhemGenerate}`,
        name: 'Mayhem Modifiers',
        icon: faDice,
        color: '#FF6B35',
        isChaosWeaver: true,
        isGenerate: true
      });
    }

    if (mayhemCost !== undefined && mayhemCost > 0) {
      // Mayhem Modifier consumption - uses dice icon with compact format
      const displayText = mayhemCost > 1 ? `-${mayhemCost}` : '-1';
      resources.push({
        type: 'mayhem-cost',
        amount: displayText,
        name: 'Mayhem Modifiers',
        icon: faDice,
        color: '#FF6B35',
        isChaosWeaver: true,
        isConsume: true
      });
    }

    // Add Chronarch Temporal Strain resources - supports both gain and reduction
    const temporalStrainGain = spell.temporalStrainGain || spell.temporalStrainGained || spell.specialMechanics?.temporalFlux?.strainGained;
    const temporalStrainReduce = spell.temporalStrainReduce || spell.specialMechanics?.temporalFlux?.strainReduced;

    if (temporalStrainGain !== undefined && temporalStrainGain > 0) {
      // Temporal Strain gain (Flux abilities) - uses warning triangle with compact format
      const displayText = temporalStrainGain > 1 ? `+${temporalStrainGain}` : '+1';
      resources.push({
        type: 'temporal-strain-gain',
        amount: displayText,
        name: 'Strain',
        icon: faExclamationTriangle,
        color: '#DC143C',
        isChronarch: true,
        isStrain: true
      });
    }

    if (temporalStrainReduce !== undefined && temporalStrainReduce > 0) {
      // Temporal Strain reduction (cleansing spells) - uses check icon with compact format
      const displayText = temporalStrainReduce > 1 ? `-${temporalStrainReduce}` : '-1';
      resources.push({
        type: 'temporal-strain-reduce',
        amount: displayText,
        name: 'Strain',
        icon: faHeart,
        color: '#32CD32',
        isChronarch: true,
        isStrainReduce: true
      });
    }

    if (resources.length === 0) return null;

    return (
      <div className="pf-spell-resources">
        {resources.map((resource, index) => {
          // Special rendering for Inferno costs - compact display
          if (resource.isInferno) {
            return (
              <div
                key={index}
                className={`pf-resource-cost ${resource.type}`}
                title={resource.fullText || resource.amount}
              >
                <FontAwesomeIcon
                  icon={resource.icon}
                  className="pf-resource-icon"
                  style={{ color: resource.color }}
                />
                <span
                  className="pf-resource-amount"
                  style={{
                    color: '#ffffff',
                    fontWeight: resource.isRequired ? 'bold' : 'normal'
                  }}
                >
                  {resource.amount}
                </span>
                {resource.name && !resource.isRequired && (
                  <span className="pf-resource-name" style={{ color: '#ffffff', fontSize: '11px' }}>
                    {resource.name}
                  </span>
                )}
              </div>
            );
          }

          // Special rendering for sphere costs - compact display
          if (resource.isSphere) {
            // Extract sphere type for abbreviation
            const sphereType = resource.name.replace(' Sphere', '').replace(' Spheres', '');
            return (
              <div
                key={index}
                className="pf-resource-cost sphere-cost"
                title={`${resource.amount} ${resource.amount === 1 ? sphereType + ' Sphere' : sphereType + ' Spheres'}`}
                style={{
                  color: '#ffffff',
                  background: 'transparent',
                  border: 'none',
                  padding: '2px 6px'
                }}
              >
                <FontAwesomeIcon
                  icon={resource.icon}
                  className="pf-resource-icon"
                  style={{ color: '#ffffff' }}
                />
                <span className="pf-resource-amount" style={{ color: '#ffffff' }}>
                  {resource.amount}
                </span>
                <span className="pf-resource-name" style={{ color: '#ffffff', fontSize: '11px' }}>
                  {sphereType}
                </span>
              </div>
            );
          }

          // Special rendering for musical notes
          if (resource.isMusicalNote) {
            return (
              <div
                key={index}
                className={`pf-resource-cost ${resource.type}`}
                title={resource.amount}
              >
                <span
                  className="pf-musical-clef-icon"
                  style={{ color: resource.color, fontSize: '20px', marginRight: '4px' }}
                >
                  {resource.clefSymbol}
                </span>
                <span className="pf-resource-amount" style={{ color: '#ffffff' }}>
                  {resource.amount}
                </span>
              </div>
            );
          }

          // Special rendering for Chronarch resources (similar to musical notes)
          if (resource.isChronarch) {
            return (
              <div
                key={index}
                className={`pf-resource-cost ${resource.type}`}
                title={`${resource.amount} ${resource.name}`}
              >
                <FontAwesomeIcon
                  icon={resource.icon}
                  className="pf-chronarch-icon"
                  style={{ color: '#fff', fontSize: '16px', marginRight: '4px' }}
                />
                <span className="pf-resource-amount" style={{ color: '#ffffff', marginRight: '4px' }}>
                  {resource.amount}
                </span>
                <span className="pf-resource-name" style={{ color: '#ffffff', fontSize: '11px' }}>
                  {resource.name}
                </span>
              </div>
            );
          }

          // Special rendering for action points - compact display like spheres
          if (resource.type === 'action-points' || resource.type === 'action_points' || resource.type === 'actionpoints') {
            return (
              <div
                key={index}
                className={`pf-resource-cost ${resource.type} action-point-cost`}
                title={`${resource.amount} ${resource.amount === 1 ? 'Action Point' : 'Action Points'}`}
                style={{
                  color: '#ffffff',
                  background: 'transparent',
                  border: 'none',
                  padding: '2px 4px'
                }}
              >
                <FontAwesomeIcon
                  icon={resource.icon}
                  className="pf-resource-icon"
                  style={{ color: '#ffffff', fontSize: '14px' }}
                />
                <span className="pf-resource-amount" style={{ color: '#ffffff', fontSize: '12px' }}>
                  {resource.amount}
                </span>
                <span className="pf-resource-name" style={{ color: '#ffffff', fontSize: '10px', marginLeft: '1px' }}>
                  AP
                </span>
              </div>
            );
          }

          // Normal resource rendering
          return (
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
          );
        })}
      </div>
    );
  };

  // Format spell components for display below spell name
  const formatSpellComponents = () => {
    if (!spell || !spell.resourceCost) {
      return null;
    }

    const components = [];

    // Check for spell components in resourceCost
    // Only add components if they have actual text - don't show empty components
    if (spell.resourceCost.components && spell.resourceCost.components.length > 0) {
      spell.resourceCost.components.forEach(component => {
        switch(component) {
          case 'verbal':
            // Only add verbal component if there's actual verbalText
            if (spell.resourceCost.verbalText && spell.resourceCost.verbalText.trim()) {
              components.push({
                type: 'verbal',
                symbol: 'V',
                name: 'Verbal',
                description: formatComponentName(spell.resourceCost.verbalText) || 'Requires speaking magical words',
                customText: spell.resourceCost.verbalText
              });
            }
            break;
          case 'somatic':
            // Only add somatic component if there's actual somaticText
            if (spell.resourceCost.somaticText && spell.resourceCost.somaticText.trim()) {
              components.push({
                type: 'somatic',
                symbol: 'S',
                name: 'Somatic',
                description: formatComponentName(spell.resourceCost.somaticText) || 'Requires specific hand gestures',
                customText: spell.resourceCost.somaticText
              });
            }
            break;
          case 'material':
            // Only add material component if there's actual materialComponents
            if (spell.resourceCost.materialComponents && spell.resourceCost.materialComponents.trim()) {
              components.push({
                type: 'material',
                symbol: 'M',
                name: 'Material',
                description: formatComponentName(spell.resourceCost.materialComponents) || 'Requires specific materials',
                customText: spell.resourceCost.materialComponents
              });
            }
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
                {formatComponentName(component.customText)}
              </span>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Helper function to format component names from hyphenated to proper title case
  const formatComponentName = (name) => {
    if (!name || typeof name !== 'string') return name;

    // If it's already properly formatted (contains spaces and capital letters), return as-is
    if (name.includes(' ') && /[A-Z]/.test(name)) {
      return name;
    }

    // Convert hyphenated or underscore names to title case
    return name
      .split(/[-_]/)
      .map(word => {
        // Handle special cases for common words
        const lowerWord = word.toLowerCase();
        if (lowerWord === 'of' || lowerWord === 'the' || lowerWord === 'and' || lowerWord === 'in' || lowerWord === 'on') {
          return lowerWord;
        }
        return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
      })
      .join(' ')
      // Capitalize the first word even if it's a preposition
      .replace(/^[a-z]/, match => match.toUpperCase());
  };

  // Format material components as text
  const formatMaterialComponentsText = () => {
    if (!spell || !spell.resourceCost) return null;

    // Check for material components in resourceCost
    const materialComponents = [];

    if (spell.resourceCost.materialComponents && Array.isArray(spell.resourceCost.materialComponents)) {
      materialComponents.push(...spell.resourceCost.materialComponents.map(item => formatComponentName(item.name || item)));
    } else if (spell.resourceCost.materialComponents && typeof spell.resourceCost.materialComponents === 'string') {
      materialComponents.push(formatComponentName(spell.resourceCost.materialComponents));
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
      // Format custom effects with detailed information
      const formattedEffects = customEffects.map(effect => {
        const effectName = effect.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
        
        // Special handling for slow effect - show detailed information
        if (effect === 'slow' || effect === 'slowed') {
          const slowConfig = chanceConfig.slowConfig || {};
          const speedReduction = slowConfig.speedReduction || slowConfig.slowAmount || 30;
          const speedReductionType = slowConfig.speedReductionType || 'percentage';
          const duration = slowConfig.duration || slowConfig.durationValue || 2;
          const durationUnit = slowConfig.durationUnit || slowConfig.durationType || 'rounds';
          const saveDC = slowConfig.saveDC || slowConfig.difficultyClass || chanceConfig.saveDC;
          const saveType = slowConfig.saveType || slowConfig.savingThrowType || chanceConfig.saveType || 'constitution';
          
          const speedText = speedReductionType === 'flat' 
            ? `${speedReduction} feet speed reduction`
            : `${speedReduction}% speed reduction`;
          
          let slowDetails = `${effectName} (${speedText}`;
          if (duration) {
            const durationText = duration === 1 ? `1 ${durationUnit}` : `${duration} ${durationUnit}`;
            slowDetails += `, ${durationText}`;
          }
          if (saveDC) {
            slowDetails += `, DC ${saveDC} ${saveType} save`;
          }
          slowDetails += ')';
          return slowDetails;
        }
        
        // Special handling for burning effect - show detailed information
        if (effect === 'burning' || effect === 'burn') {
          const burningConfig = chanceConfig.burningConfig || {};
          const damagePerRound = burningConfig.damagePerRound || burningConfig.damage || '1d6';
          const duration = burningConfig.duration || burningConfig.durationValue || 2;
          const durationUnit = burningConfig.durationUnit || burningConfig.durationType || 'rounds';
          const saveDC = burningConfig.saveDC || burningConfig.difficultyClass || chanceConfig.saveDC;
          const saveType = burningConfig.saveType || burningConfig.savingThrowType || chanceConfig.saveType || 'constitution';
          
          let burningDetails = `${effectName} (${damagePerRound} fire damage per round`;
          if (duration) {
            const durationText = duration === 1 ? `1 ${durationUnit}` : `${duration} ${durationUnit}`;
            burningDetails += ` for ${durationText}`;
          }
          if (saveDC) {
            burningDetails += `, DC ${saveDC} ${saveType} save ends early`;
          }
          burningDetails += ')';
          return burningDetails;
        }
        
        // Special handling for stun effect - show detailed information
        if (effect === 'stun' || effect === 'stunned') {
          const stunConfig = chanceConfig.stunConfig || {};
          const duration = stunConfig.duration || stunConfig.durationValue || 1;
          const durationUnit = stunConfig.durationUnit || stunConfig.durationType || 'round';
          const saveDC = stunConfig.saveDC || stunConfig.difficultyClass || chanceConfig.saveDC;
          const saveType = stunConfig.saveType || stunConfig.savingThrowType || chanceConfig.saveType || 'constitution';
          
          let stunDetails = `${effectName} (cannot take actions or reactions`;
          if (duration) {
            // Fix pluralization - don't add 's' if durationUnit already ends with 's' (like 'rounds')
            const durationText = duration === 1 
              ? `1 ${durationUnit.replace(/s$/, '')}` // Remove 's' for singular
              : `${duration} ${durationUnit}`; // Use as-is if already plural
            stunDetails += ` for ${durationText}`;
          }
          if (saveDC) {
            stunDetails += `, DC ${saveDC} ${saveType} save negates`;
          }
          stunDetails += ')';
          return stunDetails;
        }
        
        // Special handling for knockback effect - show detailed information
        if (effect === 'knockback' || effect === 'push') {
          const knockbackConfig = chanceConfig.knockbackConfig || {};
          const distance = knockbackConfig.distance || knockbackConfig.pushDistance || 10;
          
          return `${effectName} (pushed back ${distance} feet)`;
        }
        
        // Special handling for shock effect - show detailed information
        if (effect === 'shock' || effect === 'shocked') {
          const shockConfig = chanceConfig.shockConfig || {};
          const duration = shockConfig.duration || shockConfig.durationValue || 1;
          const durationUnit = shockConfig.durationUnit || shockConfig.durationType || 'round';
          
          let shockDetails = `${effectName} (reduces action economy`;
          if (duration) {
            // Fix pluralization - don't add 's' if durationUnit already ends with 's' (like 'rounds')
            const durationText = duration === 1 
              ? `1 ${durationUnit.replace(/s$/, '')}` // Remove 's' for singular
              : `${duration} ${durationUnit}`; // Use as-is if already plural
            shockDetails += ` for ${durationText}`;
          }
          shockDetails += ')';
          return shockDetails;
        }
        
        // Special handling for freeze effect - show detailed information
        if (effect === 'freeze' || effect === 'frozen') {
          const freezeConfig = chanceConfig.freezeConfig || {};
          const speedReduction = freezeConfig.speedReduction || 50;
          const duration = freezeConfig.duration || freezeConfig.durationValue || 1;
          const durationUnit = freezeConfig.durationUnit || freezeConfig.durationType || 'round';
          const saveDC = freezeConfig.saveDC || freezeConfig.difficultyClass || chanceConfig.saveDC;
          const saveType = freezeConfig.saveType || freezeConfig.savingThrowType || chanceConfig.saveType || 'constitution';
          
          let freezeDetails = `${effectName} (${speedReduction}% speed reduction`;
          if (duration) {
            // Fix pluralization - don't add 's' if durationUnit already ends with 's' (like 'rounds')
            const durationText = duration === 1 
              ? `1 ${durationUnit.replace(/s$/, '')}` // Remove 's' for singular
              : `${duration} ${durationUnit}`; // Use as-is if already plural
            freezeDetails += ` for ${durationText}`;
          }
          if (saveDC) {
            freezeDetails += `, DC ${saveDC} ${saveType} save negates`;
          }
          freezeDetails += ')';
          return freezeDetails;
        }
        
        // Special handling for disarm effect - show detailed information
        if (effect === 'disarm' || effect === 'disarmed') {
          return `${effectName} (target drops their weapon)`;
        }
        
        // Special handling for fear effect - show detailed information
        if (effect === 'fear' || effect === 'frightened') {
          const fearConfig = chanceConfig.fearConfig || {};
          const duration = fearConfig.duration || fearConfig.durationValue || 2;
          const durationUnit = fearConfig.durationUnit || fearConfig.durationType || 'rounds';
          const saveDC = fearConfig.saveDC || fearConfig.difficultyClass || chanceConfig.saveDC;
          const saveType = fearConfig.saveType || fearConfig.savingThrowType || chanceConfig.saveType || 'spirit';
          
          let fearDetails = `${effectName} (target is frightened`;
          if (duration) {
            // Fix pluralization - don't add 's' if durationUnit already ends with 's' (like 'rounds')
            const isPlural = durationUnit.endsWith('s') || duration !== 1;
            const durationText = duration === 1 
              ? `1 ${durationUnit.replace(/s$/, '')}` // Remove 's' for singular
              : `${duration} ${durationUnit}`; // Use as-is if already plural
            fearDetails += ` for ${durationText}`;
          }
          if (saveDC) {
            fearDetails += `, DC ${saveDC} ${saveType} save negates`;
          }
          fearDetails += ')';
          return fearDetails;
        }
        
        // Default: return capitalized effect name
        return effectName;
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
  // Helper to format trigger ID when trigger object isn't available
  const formatTriggerId = (triggerId) => {
    if (!triggerId || triggerId === 'default') return 'Default';
    
    // Handle common trigger IDs with plain English formatting
    const triggerIdMap = {
      'spell_interrupt': 'a spell is interrupted',
      'spell_interrupted': 'a spell is interrupted',
      'last_ally_standing': 'I am the last ally standing',
      'last_stand': 'I am the last ally standing',
      'movement_end': 'movement stops',
      'movement_start': 'movement starts',
      'health_threshold': 'health threshold is reached',
      'damage_taken': 'damage is taken',
      'damage_dealt': 'damage is dealt',
      'critical_hit': 'a critical hit lands',
      'turn_start': 'turn starts',
      'turn_end': 'turn ends',
      'combat_start': 'combat starts',
      'combat_end': 'combat ends'
    };
    
    // Check if we have a mapping
    if (triggerIdMap[triggerId]) {
      return triggerIdMap[triggerId];
    }
    
    // Convert snake_case to readable text
    return triggerId
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatTriggerText = (trigger) => {
    if (!trigger) return 'Unknown trigger';

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
      // Map all possible comparison values (both new format and legacy)
      const compMap = {
        'less_than': 'falls below',
        'greater_than': 'rises above',
        'equal': 'equals',
        'below': 'falls below',  // Legacy support
        'above': 'rises above',  // Legacy support
        'equals': 'equals'      // Legacy support
      };
      displayText = `When ${whoMap[perspective] || 'my health'} ${compMap[comparison] || 'falls below'} ${percentage}%`;
    } else if (trigger.id === 'spell_cast') {
      const spellName = trigger.parameters?.spell_name;
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
      if (spellName) {
        displayText += ` ${spellName}`;
      } else if (spellLevel) {
        displayText += ` a level ${spellLevel} spell`;
      } else {
        displayText += ' a spell';
      }
    } else if (trigger.id === 'spell_interrupt' || trigger.id === 'spell_interrupted') {
      const perspective = trigger.parameters?.perspective || 'self';
      const whoMap = {
        'self': 'a spell I cast is interrupted',
        'target': 'a spell my target casts is interrupted',
        'ally': 'a spell an ally casts is interrupted',
        'enemy': 'a spell an enemy casts is interrupted',
        'any': 'a spell is interrupted'
      };
      displayText = `When ${whoMap[perspective] || 'a spell is interrupted'}`;
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
        'self': 'movement stops',
        'target': 'my target\'s movement stops',
        'ally': 'an ally\'s movement stops',
        'enemy': 'an enemy\'s movement stops',
        'any': 'movement stops'
      };
      displayText = `When ${whoMap[perspective] || 'movement stops'}`;
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
    } else if (trigger.id === 'enter_range') {
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
      displayText = "I am the last ally standing";
    } else if (trigger.id === 'outnumbered') {
      const ratio = trigger.parameters?.ratio || 2;
      displayText = `When outnumbered ${ratio}:1`;
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
      displayText = 'I am the last ally standing';
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
    } else if (trigger.id === 'effect_duration') {
      const perspective = trigger.parameters?.perspective || 'self';
      const effectType = trigger.parameters?.effect_type || 'effect';
      const duration = trigger.parameters?.duration || 5;
      const whoMap = {
        'self': 'my',
        'target': 'target\'s',
        'ally': 'ally\'s',
        'enemy': 'enemy\'s',
        'any': 'anyone\'s'
      };
      displayText = `When ${whoMap[perspective] || 'my'} ${effectType} has ${duration} seconds remaining`;
    } else if (trigger.id === 'dispel') {
      const perspective = trigger.parameters?.perspective || 'self';
      const effectType = trigger.parameters?.effect_type || 'any';
      const whoMap = {
        'self': 'an effect is dispelled from me',
        'target': 'an effect is dispelled from my target',
        'ally': 'an effect is dispelled from an ally',
        'enemy': 'an effect is dispelled from an enemy',
        'any': 'an effect is dispelled'
      };
      if (effectType === 'buff') {
        displayText = `When a buff is dispelled from ${perspective === 'self' ? 'me' : perspective === 'target' ? 'my target' : perspective === 'ally' ? 'an ally' : perspective === 'enemy' ? 'an enemy' : 'anyone'}`;
      } else if (effectType === 'debuff') {
        displayText = `When a debuff is dispelled from ${perspective === 'self' ? 'me' : perspective === 'target' ? 'my target' : perspective === 'ally' ? 'an ally' : perspective === 'enemy' ? 'an enemy' : 'anyone'}`;
      } else {
        displayText = `When ${whoMap[perspective] || whoMap['any']}`;
      }
    } else if (trigger.id === 'cleanse') {
      const perspective = trigger.parameters?.perspective || 'self';
      const effectType = trigger.parameters?.effect_type || 'any';
      const whoMap = {
        'self': 'I am cleansed',
        'target': 'my target is cleansed',
        'ally': 'an ally is cleansed',
        'enemy': 'an enemy is cleansed',
        'any': 'anyone is cleansed'
      };
      if (effectType && effectType !== 'any') {
        displayText = `When ${effectType} is cleansed from ${perspective === 'self' ? 'me' : perspective === 'target' ? 'my target' : perspective === 'ally' ? 'an ally' : perspective === 'enemy' ? 'an enemy' : 'anyone'}`;
      } else {
        displayText = `When ${whoMap[perspective] || whoMap['any']}`;
      }
    } else if (trigger.id === 'immunity') {
      const perspective = trigger.parameters?.perspective || 'self';
      const effectType = trigger.parameters?.effect_type || 'effect';
      const whoMap = {
        'self': 'I am immune to',
        'target': 'my target is immune to',
        'ally': 'an ally is immune to',
        'enemy': 'an enemy is immune to',
        'any': 'anyone is immune to'
      };
      displayText = `When ${whoMap[perspective] || 'I am immune to'} ${effectType}`;
    } else if (trigger.id === 'effect_stack') {
      const perspective = trigger.parameters?.perspective || 'self';
      const effectType = trigger.parameters?.effect_type || 'effect';
      const stackCount = trigger.parameters?.stack_count || 3;
      const whoMap = {
        'self': 'my',
        'target': 'target\'s',
        'ally': 'ally\'s',
        'enemy': 'enemy\'s',
        'any': 'anyone\'s'
      };
      displayText = `When ${whoMap[perspective] || 'my'} ${effectType} reaches ${stackCount} stacks`;
    } else if (trigger.id === 'duration_threshold') {
      const duration = trigger.parameters?.duration || 5;
      const comparison = trigger.parameters?.comparison || 'below';
      // Map all possible comparison values (both new format and legacy)
      const compMap = {
        'less_than': 'falls below',
        'greater_than': 'rises above',
        'equal': 'equals',
        'below': 'falls below',  // Legacy support
        'above': 'rises above',  // Legacy support
        'equals': 'equals'      // Legacy support
      };
      displayText = `When spell duration ${compMap[comparison] || 'falls below'} ${duration} seconds`;
    }
    // Handle any remaining triggers with fallback logic

    // Ensure we always return a string, never undefined or null
    return displayText || trigger.id || 'Unknown trigger';
  };

  // Format trigger text for conditional display (e.g., "If below 50% health" instead of "When my health falls below 50%")
  const formatTriggerForConditionalDisplay = (trigger) => {
    if (!trigger) return 'Unknown trigger';

    // Special handling for health_threshold to make it more concrete
    // Also check if trigger name suggests it's a health threshold trigger
    const isHealthThreshold = trigger.id === 'health_threshold' || 
                              trigger.id?.includes('health_threshold') ||
                              (trigger.name && /low health|health threshold|health.*below|health.*above/i.test(trigger.name));
    
    if (isHealthThreshold) {
      const percentage = trigger.parameters?.percentage || 
                        trigger.parameters?.health_threshold || 
                        50; // Default to 50% if not specified
      const comparison = trigger.parameters?.comparison || 'below';
      const perspective = trigger.parameters?.perspective || 'self';
      
      // Map comparison values
      const compMap = {
        'less_than': 'below',
        'greater_than': 'above',
        'equal': 'at',
        'below': 'below',  // Legacy support
        'above': 'above',  // Legacy support
        'equals': 'at'      // Legacy support
      };
      
      const compText = compMap[comparison] || 'below';
      
      // For self perspective, simplify to just "If below X% health"
      if (perspective === 'self') {
        return `If ${compText} ${percentage}% health`;
      } else {
        // For other perspectives, include the target
        const whoMap = {
          'target': 'target',
          'ally': 'ally',
          'enemy': 'enemy',
          'any': 'anyone'
        };
        return `If ${whoMap[perspective] || 'target'} ${compText} ${percentage}% health`;
      }
    }

    // For all other triggers, convert "When" to "If" and simplify
    let text = formatTriggerText(trigger);
    
    // Safety check: ensure text is a string before calling startsWith
    if (!text || typeof text !== 'string') {
      text = trigger.id || 'Unknown trigger';
    }
    
    // Convert "When" to "If" - but don't add "If" if it already starts with "If"
    if (text.startsWith('When ')) {
      text = 'If ' + text.substring(5);
    } else if (!text.startsWith('If ')) {
      text = 'If ' + text;
    }
    
    // Simplify common patterns
    text = text.replace(/^If I /, 'If ');
    text = text.replace(/^If my /, 'If ');
    
    return text;
  };

  // Helper function to get damage type suffix for conditional formulas
  const getDamageTypeSuffix = () => {
    // Get damage types for appending to formulas
    // Priority: use damageTypes array (from Step 1), then fallback to single damageType
    let damageTypesArray = spell.damageTypes || spell.damageConfig?.damageTypes;
    
    // If no array, try to get from typeConfig (Step 1)
    if (!damageTypesArray || damageTypesArray.length === 0) {
      damageTypesArray = [];
      if (spell.typeConfig?.school && spell.typeConfig.school.toLowerCase() !== 'physical') {
        damageTypesArray.push(spell.typeConfig.school);
      }
      if (spell.typeConfig?.secondaryElement) {
        damageTypesArray.push(spell.typeConfig.secondaryElement);
      }
    }
    
    // If still no array, try single damageType (for DoT spells, use elementType; for instant damage, use damageType)
    const singleDamageType = spell.damageConfig?.damageType ||
                  spell.effects?.damage?.instant?.type ||
                  null;

    // For DoT spells (damageType === 'dot'), use elementType for the suffix
    // For instant damage spells, use damageType
    const effectiveSingleType = singleDamageType === 'dot'
      ? (spell.damageConfig?.elementType || spell.effects?.damage?.dot?.type)
      : singleDamageType;

    // If we have an array, use it; otherwise use single type
    const effectiveDamageTypes = (damageTypesArray && damageTypesArray.length > 0) 
      ? damageTypesArray 
      : (effectiveSingleType ? [effectiveSingleType] : []);

    // Format damage type suffix - handle multiple types
    if (effectiveDamageTypes.length > 0) {
      const formattedTypes = effectiveDamageTypes
        .filter(type => type && type !== 'dot' && type !== 'physical' && type !== 'direct') // Filter out 'dot', 'physical', and 'direct' as they're not specific damage types
        .map(type => {
          // Capitalize first letter and handle special cases
          const capitalized = type.charAt(0).toUpperCase() + type.slice(1);
          return capitalized;
        });
      
      if (formattedTypes.length > 0) {
        if (formattedTypes.length === 1) {
          return ` ${formattedTypes[0]} Damage`;
        } else {
          // Join with "and" for multiple types: "Cold and Lightning Damage"
          return ` ${formattedTypes.join(' and ')} Damage`;
        }
      }
    }
    return '';
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
          // Format effect names nicely - convert underscores to spaces and capitalize each word
          return effect.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');
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
        // Special handling for life_drain - show percentage if configured
        if (effect === 'life_drain' && critConfig.lifeDrainConfig) {
          const lifeDrainConfig = critConfig.lifeDrainConfig;
          if (lifeDrainConfig.percentage) {
            return `Life Drain (restores ${lifeDrainConfig.percentage}% of critical damage)`;
          } else if (lifeDrainConfig.formula) {
            return `Life Drain (restores ${lifeDrainConfig.formula} of critical damage)`;
          }
        }
        
        // Special handling for knockback - show distance if configured
        if (effect === 'knockback' || effect === 'push') {
          const knockbackConfig = critConfig.knockbackConfig || {};
          const distance = knockbackConfig.distance || knockbackConfig.pushDistance || 10;
          return `Knockback (target is pushed back ${distance} feet)`;
        }
        
        // Special handling for stun - show duration and save info if configured
        if (effect === 'stun' || effect === 'stunned') {
          const stunConfig = critConfig.stunConfig || {};
          const duration = stunConfig.duration || stunConfig.durationValue || 1;
          const durationUnit = stunConfig.durationUnit || stunConfig.durationType || 'round';
          const saveDC = stunConfig.saveDC || stunConfig.difficultyClass;
          const saveType = stunConfig.saveType || stunConfig.savingThrowType || 'constitution';
          
          let stunDetails = 'Stun (target cannot take actions or reactions';
          if (duration) {
            const durationText = duration === 1 
              ? `1 ${durationUnit.replace(/s$/, '')}` 
              : `${duration} ${durationUnit}`;
            stunDetails += ` for ${durationText}`;
          }
          if (saveDC) {
            stunDetails += `, DC ${saveDC} ${saveType} save negates`;
          }
          stunDetails += ')';
          return stunDetails;
        }
        
        // Special handling for bleeding - show damage and duration if configured
        if (effect === 'bleeding' || effect === 'bleed') {
          const bleedingConfig = critConfig.bleedingConfig || {};
          const damagePerRound = bleedingConfig.damagePerRound || bleedingConfig.damage || '1d4';
          const duration = bleedingConfig.duration || bleedingConfig.durationValue || 2;
          const durationUnit = bleedingConfig.durationUnit || bleedingConfig.durationType || 'rounds';
          const saveDC = bleedingConfig.saveDC || bleedingConfig.difficultyClass;
          const saveType = bleedingConfig.saveType || bleedingConfig.savingThrowType || 'constitution';
          
          let bleedingDetails = `Bleeding (${damagePerRound} damage per round`;
          if (duration) {
            const durationText = duration === 1 
              ? `1 ${durationUnit.replace(/s$/, '')}` 
              : `${duration} ${durationUnit}`;
            bleedingDetails += ` for ${durationText}`;
          }
          if (saveDC) {
            bleedingDetails += `, DC ${saveDC} ${saveType} save ends early`;
          }
          bleedingDetails += ')';
          return bleedingDetails;
        }
        
        // Special handling for burning - show damage and duration if configured
        if (effect === 'burning' || effect === 'burn') {
          const burningConfig = critConfig.burningConfig || {};
          const damagePerRound = burningConfig.damagePerRound || burningConfig.damage || '1d6';
          const duration = burningConfig.duration || burningConfig.durationValue || 2;
          const durationUnit = burningConfig.durationUnit || burningConfig.durationType || 'rounds';
          const saveDC = burningConfig.saveDC || burningConfig.difficultyClass;
          const saveType = burningConfig.saveType || burningConfig.savingThrowType || 'constitution';
          
          let burningDetails = `Burning (${damagePerRound} fire damage per round`;
          if (duration) {
            const durationText = duration === 1 
              ? `1 ${durationUnit.replace(/s$/, '')}` 
              : `${duration} ${durationUnit}`;
            burningDetails += ` for ${durationText}`;
          }
          if (saveDC) {
            burningDetails += `, DC ${saveDC} ${saveType} save ends early`;
          }
          burningDetails += ')';
          return burningDetails;
        }
        
        // Special handling for disarm - show save info if configured
        if (effect === 'disarm' || effect === 'disarmed') {
          const disarmConfig = critConfig.disarmConfig || {};
          const saveDC = disarmConfig.saveDC || disarmConfig.difficultyClass;
          const saveType = disarmConfig.saveType || disarmConfig.savingThrowType || 'strength';
          
          if (saveDC) {
            return `Disarm (target drops their weapon, DC ${saveDC} ${saveType} save negates)`;
          }
          return 'Disarm (target drops their weapon)';
        }
        
        // Format effect names nicely - convert underscores to spaces and capitalize each word
        return effect.split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      }).join(', ');
      critText += ` + ${effectNames}`;
    }

    return critText;
  };

  // Helper function to normalize and format save types (maps D&D names to our system)
  const normalizeSaveType = (saveType) => {
    if (!saveType) return 'Constitution';
    
    const saveTypeMap = {
      'dexterity': 'agility',
      'dex': 'agility',
      'wisdom': 'spirit',
      'wis': 'spirit',
      'strength': 'strength',
      'str': 'strength',
      'constitution': 'constitution',
      'con': 'constitution',
      'intelligence': 'intelligence',
      'int': 'intelligence',
      'spirit': 'spirit',
      'spi': 'spirit',
      'charisma': 'charisma',
      'cha': 'charisma'
    };
    
    const normalized = saveTypeMap[saveType.toLowerCase()] || saveType.toLowerCase();
    return normalized.charAt(0).toUpperCase() + normalized.slice(1);
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

    const formattedSaveType = normalizeSaveType(saveType);
    const dc = saveConfig.difficultyClass || 15;

    // Determine save outcome based on effect type and config
    let outcomeText = '';
    if (saveConfig.partialEffect) {
      const formula = saveConfig.partialEffectFormula || 'damage/2';
      outcomeText = ` (${formula} on save)`;
    } else if (saveConfig.saveOutcome) {
      const outcomeMap = {
        'negates': 'negate',
        'halves_effects': 'halves',
        'halves': 'halves',
        'ends_early': 'ends next turn on save',
        'resists_commands': 'can resist commands on save',
        'broken': 'broken on save',
        'overcome': 'overcome on save'
      };
      outcomeText = ` (${outcomeMap[saveConfig.saveOutcome] || 'negate'})`;
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
      outcome: outcomeText.replace(/[()]/g, '').trim(),
      saveOutcome: saveConfig.saveOutcome || null
    };
  };
  const formatDamage = () => {
    if (!spell || !spell.damageConfig) return null;

    let damageText = '';
    let dotText = '';

    // Get damage types for appending to formulas
    // Priority: use damageTypes array (from Step 1), then fallback to single damageType
    let damageTypesArray = spell.damageTypes || spell.damageConfig?.damageTypes;
    
    // If no array, try to get from typeConfig (Step 1)
    if (!damageTypesArray || damageTypesArray.length === 0) {
      damageTypesArray = [];
      if (spell.typeConfig?.school && spell.typeConfig.school.toLowerCase() !== 'physical') {
        damageTypesArray.push(spell.typeConfig.school);
      }
      if (spell.typeConfig?.secondaryElement) {
        damageTypesArray.push(spell.typeConfig.secondaryElement);
      }
    }
    
    // If still no array, try single damageType (for DoT spells, use elementType; for instant damage, use damageType)
    const singleDamageType = spell.damageConfig?.damageType ||
                      spell.effects?.damage?.instant?.type ||
                      null;

    // For DoT spells (damageType === 'dot'), use elementType for the suffix
    // For instant damage spells, use damageType (but filter out 'direct' as it's not a specific damage type)
    const effectiveSingleType = singleDamageType === 'dot'
      ? (spell.damageConfig?.elementType || spell.effects?.damage?.dot?.type)
      : (singleDamageType && singleDamageType !== 'direct' ? singleDamageType : null);

    // If we have an array, use it; otherwise use single type
    const effectiveDamageTypes = (damageTypesArray && damageTypesArray.length > 0) 
      ? damageTypesArray 
      : (effectiveSingleType ? [effectiveSingleType] : []);

    // Format damage type suffix - handle multiple types
    let damageTypeSuffix = '';
    if (effectiveDamageTypes.length > 0) {
      const formattedTypes = effectiveDamageTypes
        .filter(type => type && type !== 'dot' && type !== 'physical') // Filter out 'dot' and 'physical' as they're not specific damage types
        .map(type => {
          // Capitalize first letter and handle special cases
          const capitalized = type.charAt(0).toUpperCase() + type.slice(1);
          // Handle lightning -> Lightning (not "Storm" in damage context)
          return capitalized;
        });
      
      if (formattedTypes.length > 0) {
        if (formattedTypes.length === 1) {
          damageTypeSuffix = ` ${formattedTypes[0]} Damage`;
        } else {
          // Join with "and" for multiple types: "Cold and Lightning Damage"
          damageTypeSuffix = ` ${formattedTypes.join(' and ')} Damage`;
        }
      }
    }

    // Check if this is a pure DoT spell (no instant damage)
    // A spell is pure DoT if: damageType is 'dot' AND there's no instant damage formula
    const isPureDoT = spell.damageConfig?.damageType === 'dot' && !spell.damageConfig?.formula;

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
          damageText = `Draw ${drawCount} cards: ${cleanedFormula}${damageTypeSuffix}`;
      } else if (spell.resolution === 'COINS') {
          const coinConfig = spell.coinConfig || spell.damageConfig?.coinConfig;
          // Always show the flip count, even if it's the default (consistent with ExternalLivePreview)
          const flipCount = coinConfig?.flipCount !== undefined ? coinConfig.flipCount : 4;
          const formula = coinConfig?.formula || spell.damageConfig?.formula || 'HEADS_COUNT * 6 + LONGEST_STREAK * 2';
          // Just clean up spacing and formatting, don't convert to readable text
          const cleanedFormula = cleanFormula(formula);
          damageText = `Flip ${flipCount} coins: ${cleanedFormula}${damageTypeSuffix}`;
      } else if (spell.resolution === 'DICE' && (spell.diceConfig?.formula || spell.damageConfig?.formula)) {
          const formula = spell.diceConfig?.formula || spell.damageConfig?.formula || '1d6 + intelligence';

          // Handle weapon-dependent spells that have addAttributeModifier flag
          let finalFormula = formula;
          if (spell.damageConfig?.weaponDependent && spell.damageConfig?.addAttributeModifier && spell.damageConfig?.attributeModifier) {
            // For weapon attacks, combine dice notation with attribute modifier
            const attributeName = spell.damageConfig.attributeModifier.charAt(0).toUpperCase() + spell.damageConfig.attributeModifier.slice(1);
            // Only add attribute if it's not already in the formula
            if (!formula.toLowerCase().includes(attributeName.toLowerCase()) && !formula.toLowerCase().includes(spell.damageConfig.attributeModifier.toLowerCase())) {
              finalFormula = `${formula} + ${attributeName}`;
            }
          }

          // Enhanced formula formatting - don't pass elementType if we have a specific damage type suffix
          const enhancedFormula = damageTypeSuffix ?
            cleanFormula(finalFormula) :
            enhanceFormulaDisplay(finalFormula, spell.damageConfig?.elementType);
          damageText = `${enhancedFormula}${damageTypeSuffix}`;
      } else if (spell.damageConfig?.formula) {
          // Handle weapon-dependent spells that have addAttributeModifier flag
          let finalFormula = spell.damageConfig.formula;
          if (spell.damageConfig?.weaponDependent && spell.damageConfig?.addAttributeModifier && spell.damageConfig?.attributeModifier) {
            // For weapon attacks, combine dice notation with attribute modifier
            const attributeName = spell.damageConfig.attributeModifier.charAt(0).toUpperCase() + spell.damageConfig.attributeModifier.slice(1);
            // Only add attribute if it's not already in the formula
            if (!finalFormula.toLowerCase().includes(attributeName.toLowerCase()) && !finalFormula.toLowerCase().includes(spell.damageConfig.attributeModifier.toLowerCase())) {
              finalFormula = `${finalFormula} + ${attributeName}`;
            }
          }
          // Just clean up spacing and formatting, don't convert to readable text
          damageText = `${cleanFormula(finalFormula)}${damageTypeSuffix}`;
      } else if (spell.primaryDamage?.dice) {
          const dice = spell.primaryDamage.dice;
          const flat = spell.primaryDamage.flat > 0 ? ` + ${spell.primaryDamage.flat}` : '';
          // Just clean up spacing and formatting, don't convert to readable text
          damageText = `${cleanFormula(`${dice}${flat}`)}${damageTypeSuffix}`;
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
        dotText = `${cleanedDotFormula}${damageTypeSuffix} per ${tickFrequency} for ${durationText}`;
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

      // Handle different healing types ('instant' is an alias for 'direct')
      if (healingType === 'direct' || healingType === 'instant') {
        // Direct healing - check resolution method
        if (spell.resolution === 'CARDS' && spell.healingConfig.cardConfig?.formula) {
          const cardConfig = spell.healingConfig.cardConfig;
          const drawCount = cardConfig.drawCount !== undefined ? cardConfig.drawCount : 3;
          return `Draw ${drawCount} cards: ${cleanFormula(cardConfig.formula)} Healing`;
        } else if (spell.resolution === 'COINS' && spell.healingConfig.coinConfig?.formula) {
          const coinConfig = spell.healingConfig.coinConfig;
          const flipCount = coinConfig.flipCount !== undefined ? coinConfig.flipCount : 4;
          return `Flip ${flipCount} coins: ${cleanFormula(coinConfig.formula)} Healing`;
        } else if (spell.healingConfig.formula) {
          // Dice-based direct healing
          return `${cleanFormula(spell.healingConfig.formula)} Healing`;
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

          // Add overflow behavior to description if it converts to healing
          if (overflow === 'convert_to_healing') {
            baseDescription += ' and converts to healing';
          }

          // Build bullet points for shield properties
          const shieldBullets = [];

          // Add damage type if not all types
          if (damageTypes !== 'all') {
            const typeText = damageTypes === 'physical' ? 'Physical' :
                            damageTypes === 'magical' ? 'Magical' :
                            damageTypes === 'fire' ? 'Fire' :
                            damageTypes === 'frost' ? 'Frost' :
                            damageTypes === 'lightning' ? 'Lightning' :
                            damageTypes === 'arcane' ? 'Arcane' :
                            damageTypes === 'nature' ? 'Nature' :
                            damageTypes === 'poison' ? 'Poison' :
                            damageTypes === 'necrotic' ? 'Necrotic' :
                            damageTypes === 'radiant' ? 'Radiant' :
                            damageTypes === 'force' ? 'Force' :
                            damageTypes.charAt(0).toUpperCase() + damageTypes.slice(1);
            shieldBullets.push(`${typeText} only`);
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
                        damageTypes === 'frost' ? 'frost damage' :
                        damageTypes === 'lightning' ? 'lightning damage' :
                        damageTypes === 'arcane' ? 'arcane damage' :
                        damageTypes === 'nature' ? 'nature damage' :
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

    // Do not show damage types for Temporal Flux abilities (support/utility)
    if (spell.specialMechanics?.temporalFlux || spell.specialMechanics?.temporal_flux || spell.id?.endsWith('_flux')) {
      return [];
    }

    // Only show damage types if spell actually has damage configured
    const hasDamageConfig = spell.damageConfig?.formula || spell.damageConfig?.damageType || spell.damageTypes?.length > 0;
    const hasDamageEffect = spell.effects?.damage?.instant?.formula || spell.effects?.damage?.dot?.formula;
    const hasDamageType = spell.effectTypes?.includes('damage');
    
    // If spell has no damage configuration at all, don't infer damage types
    if (!hasDamageConfig && !hasDamageEffect && !hasDamageType) {
      return [];
    }

    // Use a Set to automatically handle duplicates
    const damageTypesSet = new Set();

    // Priority order: damageTypes array -> typeConfig (Step 1) -> other sources
    // Check damageTypes array FIRST (highest priority, especially for weapon-dependent spells)
    const damageTypesArray = spell.damageTypes || spell.damageConfig?.damageTypes;
    if (damageTypesArray && Array.isArray(damageTypesArray) && damageTypesArray.length > 0) {
      damageTypesArray.forEach(type => {
        if (type && type.trim()) {
          damageTypesSet.add(type.toLowerCase().trim());
        }
      });
    }

    // Then check typeConfig.school and typeConfig.secondaryElement (from Step 1 wizard)
    // But exclude 'physical' as it's not a specific damage type (should use bludgeoning/piercing/slashing instead)
    // Only use typeConfig if we don't already have damage types from the array
    if (damageTypesSet.size === 0) {
      const magicSchools = ['arcane', 'divine', 'primal', 'occult', 'evocation', 'necromancy', 'enchantment', 'illusion', 'transmutation', 'conjuration', 'abjuration', 'divination'];
      if (spell.typeConfig?.school && !magicSchools.includes(spell.typeConfig.school.toLowerCase()) && spell.typeConfig.school.toLowerCase() !== 'physical') {
        damageTypesSet.add(spell.typeConfig.school.toLowerCase().trim());
      }
      if (spell.typeConfig?.secondaryElement) {
        damageTypesSet.add(spell.typeConfig.secondaryElement.toLowerCase().trim());
      }
    }

    // Also check for singular damageType if no array found
    // Check damageConfig.damageType (e.g., 'bludgeoning', 'piercing', 'slashing')
    // Filter out 'direct' and 'dot' as they're not actual damage types
    if (damageTypesSet.size === 0 && spell.damageConfig?.damageType) {
      const damageType = spell.damageConfig.damageType;
      if (damageType && damageType.trim() && damageType.toLowerCase() !== 'direct' && damageType.toLowerCase() !== 'dot') {
        damageTypesSet.add(damageType.toLowerCase().trim());
      }
    }
    
    // Also check effects.damage.instant.type as fallback
    if (damageTypesSet.size === 0 && spell.effects?.damage?.instant?.type) {
      const damageType = spell.effects.damage.instant.type;
      if (damageType && damageType.trim()) {
        damageTypesSet.add(damageType.toLowerCase().trim());
      }
    }

    // Only add elementType if we don't have explicit damage types
    // NEVER use school as damage type - schools and damage types are completely separate
    if (damageTypesSet.size === 0) {
      // Only use elementType if it's explicitly set, different from school, and not a magic school
      // Also exclude 'physical' as it's not a specific damage type (should use bludgeoning/piercing/slashing instead)
      if (spell.elementType && spell.elementType.trim()) {
        const elementType = spell.elementType.toLowerCase().trim();
        const school = (spell.school || '').toLowerCase().trim();
        const magicSchools = ['arcane', 'divine', 'primal', 'occult', 'evocation', 'necromancy', 'enchantment', 'illusion', 'transmutation', 'conjuration', 'abjuration', 'divination'];

        // Only add if it's not the same as school, not a magic school, and not 'physical'
        if (elementType !== school && !magicSchools.includes(elementType) && elementType !== 'physical') {
          damageTypesSet.add(elementType);
        }
      }

      // Only use damageConfig elementType if it's explicitly set and not a magic school
      // Also exclude 'physical' as it's not a specific damage type (should use bludgeoning/piercing/slashing instead)
      if (spell.damageConfig?.elementType && spell.damageConfig.elementType.trim()) {
        const elementType = spell.damageConfig.elementType.toLowerCase().trim();
        const magicSchools = ['arcane', 'divine', 'primal', 'occult', 'evocation', 'necromancy', 'enchantment', 'illusion', 'transmutation', 'conjuration', 'abjuration', 'divination'];

        if (!magicSchools.includes(elementType) && elementType !== 'physical') {
          damageTypesSet.add(elementType);
        }
      }
    }

    // Only infer damage type from spell effects if we have damage configuration
    // Don't infer for pure healing/buff/utility spells
    if (damageTypesSet.size === 0 && hasDamageConfig) {
      // Check damage config for type hints
      if (spell.damageConfig?.formula) {
        const formula = spell.damageConfig.formula.toLowerCase();
        if (formula.includes('fire')) damageTypesSet.add('fire');
        else if (formula.includes('frost') || formula.includes('cold') || formula.includes('ice')) damageTypesSet.add('frost');
        else if (formula.includes('lightning') || formula.includes('electric')) damageTypesSet.add('lightning');
        else if (formula.includes('arcane')) damageTypesSet.add('arcane');
        else if (formula.includes('nature')) damageTypesSet.add('nature');
        else if (formula.includes('radiant') || formula.includes('holy')) damageTypesSet.add('radiant');
        else if (formula.includes('necrotic')) damageTypesSet.add('necrotic');
        else if (formula.includes('poison')) damageTypesSet.add('poison');
        else if (formula.includes('psychic')) damageTypesSet.add('psychic');
        else if (formula.includes('chaos')) damageTypesSet.add('chaos');
        else if (formula.includes('void')) damageTypesSet.add('void');
        else if (formula.includes('force')) damageTypesSet.add('force');
      }

      // Only check spell name and description for type hints if we have damage config
      const spellText = `${spell.name || ''} ${spell.description || ''}`.toLowerCase();
      if (spellText.includes('fire') || spellText.includes('flame') || spellText.includes('burn')) damageTypesSet.add('fire');
      else if (spellText.includes('frost') || spellText.includes('cold') || spellText.includes('ice')) damageTypesSet.add('frost');
      else if (spellText.includes('lightning') || spellText.includes('electric')) damageTypesSet.add('lightning');
      else if (spellText.includes('arcane')) damageTypesSet.add('arcane');
      else if (spellText.includes('nature')) damageTypesSet.add('nature');
      else if (spellText.includes('radiant') || spellText.includes('holy') || spellText.includes('divine') || spellText.includes('light')) damageTypesSet.add('radiant');
      else if (spellText.includes('necrotic') || spellText.includes('death') || spellText.includes('decay')) damageTypesSet.add('necrotic');
      else if (spellText.includes('poison') || spellText.includes('venom') || spellText.includes('toxic')) damageTypesSet.add('poison');
      else if (spellText.includes('psychic') || spellText.includes('mind') || spellText.includes('mental')) damageTypesSet.add('psychic');
      else if (spellText.includes('chaos')) damageTypesSet.add('chaos');
      else if (spellText.includes('void')) damageTypesSet.add('void');
      else if (spellText.includes('force') || spellText.includes('arcane')) damageTypesSet.add('force');
      else if (spellText.includes('chaos') || spellText.includes('chaotic') || spellText.includes('unpredictable')) damageTypesSet.add('chaos');

      // Check buff/debuff effects for damage type hints (only if we have damage)
      if (spell.buffConfig?.statusEffects) {
        spell.buffConfig?.statusEffects.forEach(effect => {
          const effectText = `${effect.name || ''} ${effect.description || ''}`.toLowerCase();
          if (effectText.includes('radiant') || effectText.includes('holy')) damageTypesSet.add('radiant');
          else if (effectText.includes('necrotic') || effectText.includes('shadow')) damageTypesSet.add('necrotic');
        });
      }
    }

    // Valid damage types (normalize cold/ice to frost)
    const validDamageTypes = ['fire', 'frost', 'lightning', 'arcane', 'nature', 'poison', 'necrotic', 'radiant', 'psychic', 'chaos', 'void',
                             'force', 'physical', 'slashing', 'piercing', 'bludgeoning',
                             'electric', 'holy', 'magical', 'cold', 'ice'];

    // Normalize similar types
    const normalizedTypes = Array.from(damageTypesSet).map(type => {
      if (type === 'ice' || type === 'cold') return 'frost';
      if (type === 'electric') return 'lightning';
      if (type === 'holy') return 'radiant';
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

  // Helper function to get enhanced stat names with thematic descriptions
  const getEnhancedStatName = (statName, magnitude, magnitudeType) => {
    if (!statName) return 'Stat Modifier';

    const baseName = statName.toLowerCase();
    const isPositive = magnitude > 0;
    const isPercentage = magnitudeType === 'percentage';

    // Enhanced naming for primary stats
    const statEnhancements = {
      'strength': isPositive ? 'Might Enhancement' : 'Strength Drain',
      'agility': isPositive ? 'Grace Enhancement' : 'Agility Drain',
      'constitution': isPositive ? 'Vitality Enhancement' : 'Constitution Drain',
      'intelligence': isPositive ? 'Mental Acuity' : 'Intelligence Drain',
      'spirit': isPositive ? 'Spiritual Power' : 'Spirit Drain',
      'charisma': isPositive ? 'Presence Enhancement' : 'Charisma Drain',

      // Enhanced naming for secondary stats
      'health': isPositive ? 'Vigor Boost' : 'Health Penalty',
      'mana': isPositive ? 'Arcane Reservoir' : 'Mana Drain',
      'stamina': isPositive ? 'Endurance Boost' : 'Stamina Penalty',
      'speed': isPositive ? 'Swiftness' : 'Sluggishness',
      'armor': isPositive ? 'Protective Ward' : 'Armor Reduction',
      'damage': isPositive ? 'Combat Prowess' : 'Damage Penalty',
      'damage_reduction': 'Damage Resistance'
    };

    return statEnhancements[baseName] || (statName.charAt(0).toUpperCase() + statName.slice(1));
  };

  // Helper function to determine stat type for enhanced descriptions
  const getStatType = (statName) => {
    if (!statName) return 'general';

    const baseName = statName.toLowerCase();
    const physicalStats = ['strength', 'agility', 'constitution', 'health', 'stamina', 'armor'];
    const mentalStats = ['intelligence', 'spirit', 'perception'];
    const magicalStats = ['mana', 'spell_power', 'magical_resistance'];

    if (physicalStats.includes(baseName)) return 'physical';
    if (mentalStats.includes(baseName)) return 'mental';
    if (magicalStats.includes(baseName)) return 'magical';
    return 'general';
  };
  // Format status effect details based on configuration
  const formatStatusEffectDetails = (status, effectType = 'buff', parentConfig = null) => {
    const effectName = status.name || status.id || 'Status Effect';

    // Improved fallback descriptions - show warning if incomplete
    let description = status.description;
    if (!description) {
      // Try to infer from status name/id
      const statusId = (status.id || status.name || '').toLowerCase();
      if (statusId.includes('haste') || statusId.includes('speed')) {
        description = 'Increased movement and attack speed';
      } else if (statusId.includes('strength') || statusId.includes('might')) {
        description = 'Enhanced physical power';
      } else if (statusId.includes('intellect') || statusId.includes('spirit')) {
        description = 'Enhanced mental acuity';
      } else if (statusId.includes('shield') || statusId.includes('barrier')) {
        description = 'Protective magical barrier';
      } else if (statusId.includes('regen') || statusId.includes('heal')) {
        description = 'Gradual health restoration';
      } else if (statusId.includes('bless') || statusId.includes('divine')) {
        description = 'Divine blessing and protection';
      } else if (statusId.includes('invisible') || statusId.includes('invisibility')) {
        description = 'Cannot be seen';
      } else if (statusId.includes('flight') || statusId.includes('fly')) {
        description = 'Ability to fly';
      } else if (statusId.includes('stun')) {
        description = 'Unable to act';
      } else if (statusId.includes('charm')) {
        description = 'Magically influenced';
      } else if (statusId.includes('burn')) {
        description = 'Taking fire damage over time';
      } else {
        // Show clear warning for incomplete data
        description = effectType === 'buff'
          ? 'INCOMPLETE: Add description to status effect'
          : 'INCOMPLETE: Add description to status effect';
      }
    }

    let mechanicsText = '';
    const mechanicsParts = [];

    // Format based on specific effect types
    const effectId = (status.id || '').toLowerCase();

    // LUCK EFFECT
    if (effectId === 'luck') {
      const luckType = status.luckType || 'bonus';
      if (luckType === 'bonus') {
        const bonus = status.luckBonus || 1;
        const appliesTo = status.appliesTo || 'all';
        mechanicsParts.push(`+${bonus} bonus to ${appliesTo === 'all' ? 'all dice rolls' : appliesTo === 'd20' ? 'd20 rolls' : appliesTo === 'damage' ? 'damage rolls' : appliesTo}`);
      } else if (luckType === 'reroll') {
        const rerollCount = status.rerollCount || 1;
        const rerollCondition = status.rerollCondition || 'any';
        mechanicsParts.push(`Reroll ${rerollCount === -1 ? 'unlimited' : rerollCount} ${rerollCondition === 'any' ? 'unfavorable' : rerollCondition} ${rerollCount === 1 ? 'roll' : 'rolls'}`);
      } else if (luckType === 'minimum') {
        const minValue = status.minimumValue || 10;
        const appliesTo = status.appliesTo || 'd20';
        mechanicsParts.push(`Minimum roll of ${minValue} on ${appliesTo === 'all' ? 'all dice' : appliesTo === 'd20' ? 'd20 rolls' : appliesTo === 'damage' ? 'damage rolls' : appliesTo}`);
      } else if (luckType === 'choose') {
        const choiceCount = status.choiceCount || 1;
        mechanicsParts.push(`Choose result from ${choiceCount} ${choiceCount === 1 ? 'roll' : 'rolls'}`);
      }
    }

    // HASTE EFFECT
    else if (effectId === 'haste') {
      const speedMultiplier = status.speedMultiplier || 2;
      const extraActions = status.extraActions || 0;
      const extraAttacks = status.extraAttacks || 0;

      mechanicsParts.push(`${speedMultiplier}× movement speed`);
      if (extraActions > 0) mechanicsParts.push(`+${extraActions} ${extraActions === 1 ? 'action' : 'actions'} per turn`);
      if (extraAttacks > 0) mechanicsParts.push(`+${extraAttacks} ${extraAttacks === 1 ? 'attack' : 'attacks'} per turn`);
      if (status.hasLethargy) mechanicsParts.push('Lethargy when ends');
    }

    // REGENERATION EFFECT
    else if (effectId === 'regeneration' || effectId === 'regen') {
      const calculationType = status.calculationType || 'fixed';
      if (calculationType === 'fixed') {
        const healAmount = status.healAmount || 5;
        mechanicsParts.push(`Restore ${healAmount} HP per round`);
      } else if (calculationType === 'percentage') {
        const percentage = status.healPercentage || 5;
        mechanicsParts.push(`Restore ${percentage}% of max HP per round`);
      } else if (calculationType === 'dice') {
        const diceCount = status.diceCount || 1;
        const diceType = status.diceType || 'd6';
        mechanicsParts.push(`Restore ${diceCount}${diceType} HP per round`);
      }

      if (status.canRegrowLimbs) mechanicsParts.push('Can regrow lost limbs');
    }

    // SHIELD/SHIELDED EFFECT
    else if (effectId === 'shielded' || effectId === 'shield') {
      const shieldAmount = status.shieldAmount || 15;
      const shieldType = status.shieldType || 'absorb';

      if (shieldType === 'absorb') {
        mechanicsParts.push(`Absorbs ${shieldAmount} damage`);
      } else if (shieldType === 'reflect') {
        mechanicsParts.push(`Reflects ${shieldAmount} damage back to attacker`);
      } else if (shieldType === 'thorns') {
        mechanicsParts.push(`Deals ${shieldAmount} damage to attackers`);
      }
    }

    // BURNING EFFECT
    else if (effectId === 'burning') {
      const diceCount = status.diceCount || 1;
      const diceType = status.diceType || 'd6';
      const damageType = status.damageType || 'fire';
      mechanicsParts.push(`${diceCount}${diceType} ${damageType} damage per round`);

      if (status.canSpread) mechanicsParts.push('Can spread to nearby targets');
      if (status.extinguishDC) mechanicsParts.push(`DC ${status.extinguishDC} to extinguish`);
    }

    // STUNNED/STUN EFFECT
    else if (effectId === 'stunned' || effectId === 'stun') {
      const stunLevel = status.stunLevel || 'full';
      if (stunLevel === 'full') {
        mechanicsParts.push('Cannot take actions or reactions');
      } else if (stunLevel === 'partial') {
        mechanicsParts.push('Can take limited actions only');
      } else if (stunLevel === 'dazed') {
        mechanicsParts.push('Disadvantage on attacks and ability checks');
      }
    }

    // CHARMED/CHARM EFFECT
    else if (effectId === 'charmed' || effectId === 'charm') {
      const charmLevel = status.charmLevel || 'friendly';
      if (charmLevel === 'dominated') {
        mechanicsParts.push('Caster has full control over actions');
      } else if (charmLevel === 'friendly') {
        mechanicsParts.push('Regards caster as friendly ally');
      } else if (charmLevel === 'suggestion') {
        mechanicsParts.push('Follows reasonable suggestions');
      }

      if (status.saveTrigger) {
        const triggerMap = {
          'harmful': 'save when given harmful command',
          'turn': 'save each turn',
          'damage': 'save when taking damage'
        };
        mechanicsParts.push(triggerMap[status.saveTrigger] || 'periodic saves');
      }
    }

    // INVISIBILITY EFFECT
    else if (effectId === 'invisibility') {
      const invisType = status.invisibilityType || 'standard';
      if (invisType === 'standard') {
        mechanicsParts.push('Invisible to sight');
      } else if (invisType === 'greater') {
        mechanicsParts.push('Invisible to all senses');
      } else if (invisType === 'improved') {
        mechanicsParts.push('Invisible, does not break on attack');
      }

      if (status.breaksOnAttack && invisType !== 'improved') {
        mechanicsParts.push('Breaks when attacking');
      }
    }

    // FLIGHT EFFECT
    else if (effectId === 'flight') {
      const flySpeed = status.flySpeed || 60;
      const maneuverability = status.maneuverability || 'average';
      mechanicsParts.push(`Fly speed ${flySpeed}ft (${maneuverability} maneuverability)`);
    }

    // COMBAT ADVANTAGE EFFECT
    else if (effectId === 'combat_advantage') {
      const advantageType = status.advantageType || 'attack';

      if (advantageType === 'attack') {
        const attackTypes = [];
        if (status.affectsMelee) attackTypes.push('melee');
        if (status.affectsRanged) attackTypes.push('ranged');
        if (status.affectsSpell) attackTypes.push('spell');

        const attackTypeText = attackTypes.length === 0 ? 'all' :
                               attackTypes.length === 3 ? 'all' :
                               attackTypes.join(' and ');
        mechanicsParts.push(`Advantage on ${attackTypeText} attack rolls`);
      } else if (advantageType === 'damage') {
        const diceCount = status.damageBonusDiceCount || 1;
        const diceType = status.damageBonusDiceType || 'd6';
        const damageTypes = [];
        if (status.affectsPhysical) damageTypes.push('physical');
        if (status.affectsMagical) damageTypes.push('magical');
        if (status.affectsAllDamageTypes) damageTypes.push('all');

        const damageTypeText = damageTypes.includes('all') ? 'all' :
                               damageTypes.length === 0 ? 'all' :
                               damageTypes.join(' and ');
        mechanicsParts.push(`+${diceCount}${diceType} bonus to ${damageTypeText} damage rolls`);
      } else if (advantageType === 'healing') {
        const diceCount = status.healingBonusDiceCount || 1;
        const diceType = status.healingBonusDiceType || 'd6';
        mechanicsParts.push(`+${diceCount}${diceType} bonus to healing rolls`);
      } else if (advantageType === 'saving') {
        const saveTypes = [];
        if (status.affectsStrength) saveTypes.push('Strength');
        if (status.affectsAgility) saveTypes.push('Agility');
        if (status.affectsConstitution) saveTypes.push('Constitution');
        if (status.affectsIntelligence) saveTypes.push('Intelligence');
        if (status.affectsSpirit) saveTypes.push('Spirit');
        if (status.affectsCharisma) saveTypes.push('Charisma');

        const saveTypeText = saveTypes.length === 0 ? 'all' :
                            saveTypes.length === 6 ? 'all' :
                            saveTypes.join(', ');
        mechanicsParts.push(`Advantage on ${saveTypeText} saving throws`);
      } else if (advantageType === 'initiative') {
        mechanicsParts.push('Advantage on initiative rolls');
      } else if (advantageType === 'super') {
        mechanicsParts.push('Roll 3 dice, take highest for attacks');
      }
    }

    // ATTACKERS ADVANTAGE EFFECT (BUFF)
    else if (effectId === 'attackers_advantage_buff') {
      const attackType = status.attackType || 'all';
      mechanicsParts.push(`Attackers have advantage against you (${attackType} attacks)`);
    }

    // ATTACKERS DISADVANTAGE EFFECT
    else if (effectId === 'attackers_disadvantage') {
      const attackType = status.attackType || 'all';
      mechanicsParts.push(`Attackers have disadvantage against you (${attackType} attacks)`);
    }

    // SKILL MASTERY EFFECT
    else if (effectId === 'skill_mastery') {
      const skillType = status.skillType || 'physical';
      if (skillType === 'physical') {
        mechanicsParts.push('Advantage on Strength and Agility checks');
      } else if (skillType === 'mental') {
        mechanicsParts.push('Advantage on Intelligence and Spirit checks');
      } else if (skillType === 'social') {
        mechanicsParts.push('Advantage on Charisma checks');
      }
    }

    // EMPOWER NEXT EFFECT
    else if (effectId === 'empower_next') {
      const empowerType = status.empowerType || 'spell';
      const uses = status.uses || 1;
      if (empowerType === 'spell') {
        mechanicsParts.push(`Next ${uses} ${uses === 1 ? 'spell deals' : 'spells deal'} maximum damage`);
      } else if (empowerType === 'heal') {
        mechanicsParts.push(`Next ${uses} healing ${uses === 1 ? 'spell heals' : 'spells heal'} for maximum value`);
      } else if (empowerType === 'weapon') {
        mechanicsParts.push(`Next ${uses} weapon ${uses === 1 ? 'attack deals' : 'attacks deal'} maximum damage`);
      }
    }

    // DAMAGE SHIELD EFFECT
    else if (effectId === 'damage_shield') {
      const shieldType = status.shieldType || 'physical';
      const hitCount = status.hitCount || 3;
      const reduction = status.reductionPercent || 50;
      mechanicsParts.push(`Reduce ${shieldType} damage by ${reduction}% for next ${hitCount} hits`);
    }

    // ELEMENTAL INFUSION EFFECT
    else if (effectId === 'elemental_infusion') {
      const element = status.element || 'fire';
      const bonusDamage = status.bonusDamage || '1d6';
      mechanicsParts.push(`Attacks deal +${bonusDamage} ${element} damage`);
    }

    // INVISIBILITY EFFECT (DETAILED)
    else if (effectId === 'invisible') {
      const invisType = status.invisibilityType || 'standard';
      if (invisType === 'partial') {
        mechanicsParts.push('Heavily obscured, harder to detect');
      } else if (invisType === 'full') {
        mechanicsParts.push('Completely invisible until you attack');
      } else if (invisType === 'selective') {
        mechanicsParts.push('Invisible to specific creatures');
      }
    }

    // INSPIRED EFFECT
    else if (effectId === 'inspired') {
      const inspirationType = status.inspirationType || 'bardic';
      const dieSize = status.inspirationDie || 6;
      mechanicsParts.push(`Add 1d${dieSize} to ability checks, attacks, or saves`);
    }

    // BLESSED EFFECT
    else if (effectId === 'blessed') {
      const blessType = status.blessType || 'protection';
      if (blessType === 'protection') {
        mechanicsParts.push('Gain Armor bonus and resistance to certain damage types');
      } else if (blessType === 'fortune') {
        mechanicsParts.push('Can reroll one die roll per round');
      } else if (blessType === 'life') {
        mechanicsParts.push('Gain bonus to healing received');
      }
    }

    // TEMPORARY HIT POINTS EFFECT
    else if (effectId === 'temporary_hp') {
      const tempHp = status.temporaryHitPoints || status.amount || '1d4';
      mechanicsParts.push(`Gain ${tempHp} temporary hit points`);
    }

    // RESISTANCE EFFECT
    else if (effectId === 'resistance') {
      const resistType = status.resistanceType || status.elementType || 'elemental';
      const amount = status.resistanceAmount || status.magnitude || 50;

      // Use thematic descriptions for standard resistance levels
      if (amount === -200) {
        mechanicsParts.push(getThematicResistanceDescription('vampiric', resistType));
      } else if (amount === -100) {
        mechanicsParts.push(getThematicResistanceDescription('absorbing', resistType));
      } else if (amount === -50) {
        mechanicsParts.push(getThematicResistanceDescription('draining', resistType));
      } else if (amount === -25) {
        mechanicsParts.push(getThematicResistanceDescription('siphoning', resistType));
      } else if (amount === 0) {
        mechanicsParts.push(getThematicResistanceDescription('immune', resistType));
      } else if (amount === 25) {
        mechanicsParts.push(getThematicResistanceDescription('highly_resistant', resistType));
      } else if (amount === 50) {
        mechanicsParts.push(getThematicResistanceDescription('resistant', resistType));
      } else if (amount === 75) {
        mechanicsParts.push(getThematicResistanceDescription('guarded', resistType));
      } else if (amount === 100) {
        mechanicsParts.push(getThematicResistanceDescription('nullified', resistType));
      } else if (amount === 125) {
        mechanicsParts.push(getThematicResistanceDescription('susceptible', resistType));
      } else if (amount === 150) {
        mechanicsParts.push(getThematicResistanceDescription('exposed', resistType));
      } else if (amount === 200) {
        mechanicsParts.push(getThematicResistanceDescription('vulnerable', resistType));
      } else {
        // Fallback for custom percentages
        if (amount > 100) {
          mechanicsParts.push(`Increased ${resistType} vulnerability (takes ${amount}% damage)`);
        } else if (amount < 0) {
          mechanicsParts.push(`Absorbs ${resistType} damage (heals for ${Math.abs(amount)}% of damage taken)`);
        } else {
          mechanicsParts.push(`${resistType.charAt(0).toUpperCase() + resistType.slice(1)} resistance (takes ${amount}% damage)`);
        }
      }
    }

    // FLYING/FLIGHT EFFECT (DETAILED)
    else if (effectId === 'flying') {
      const flySpeed = status.flightSpeed || status.flySpeed || 60;
      const maneuverability = status.maneuverability || 'good';
      mechanicsParts.push(`Fly speed ${flySpeed}ft (${maneuverability} maneuverability)`);
    }

    // TRUESIGHT EFFECT
    else if (effectId === 'truesight') {
      const range = status.truesightRange || 60;
      mechanicsParts.push(`See through illusions and darkness within ${range}ft`);
    }

    // ENERGIZED EFFECT
    else if (effectId === 'energized') {
      const bonusAP = status.bonusActionPoints || 2;
      mechanicsParts.push(`+${bonusAP} action points, improved energy recovery`);
    }

    // EMPOWERED EFFECT
    else if (effectId === 'empowered') {
      const powerIncrease = status.powerIncrease || 25;
      mechanicsParts.push(`+${powerIncrease}% spell power and damage`);
    }

    // LIFELINK EFFECT
    else if (effectId === 'lifelink') {
      const linkType = status.linkType || 'damage_to_healing';
      const percentage = status.percentage || 25;
      if (linkType === 'damage_to_healing') {
        mechanicsParts.push(`Convert ${percentage}% of Damage Dealt to healing`);
      } else if (linkType === 'healing_to_damage') {
        mechanicsParts.push(`Convert ${percentage}% of healing done to bonus damage`);
      }
    }

    // REMOVED: Duration is now included in description, not mechanicsText
    // This prevents duplicate "Duration: X round" display

    // DEBUFF EFFECTS

    // BLINDED EFFECT
    else if (effectId === 'blinded') {
      const blindLevel = status.blindLevel || 'complete';
      if (blindLevel === 'partial') {
        mechanicsParts.push('Vision severely obscured, disadvantage on perception');
      } else if (blindLevel === 'complete') {
        mechanicsParts.push('Cannot see, automatically fail sight-based checks');
      } else if (blindLevel === 'flash') {
        mechanicsParts.push('Temporary blindness that fades over time');
      }
    }

    // FRIGHTENED/FEAR EFFECT
    else if (effectId === 'frightened' || effectId === 'fear') {
      const fearLevel = status.fearLevel || 'shaken';
      if (fearLevel === 'shaken') {
        mechanicsParts.push('Disadvantage on ability checks while fear source is visible');
      } else if (fearLevel === 'terrified') {
        mechanicsParts.push('Cannot willingly move closer to source of fear');
      } else if (fearLevel === 'panicked') {
        mechanicsParts.push('Must use actions to flee from source of fear');
      }
    }

    // PARALYZED EFFECT
    else if (effectId === 'paralyzed') {
      const paralysisLevel = status.paralysisLevel || 'complete';
      if (paralysisLevel === 'partial') {
        mechanicsParts.push('Speed reduced to 0, disadvantage on Agility saves');
      } else if (paralysisLevel === 'complete') {
        mechanicsParts.push('Cannot move or take actions, auto-fail STR and AGI saves');
      } else if (paralysisLevel === 'magical') {
        mechanicsParts.push('Cannot move but can cast non-somatic spells');
      }
    }

    // POISONED EFFECT
    else if (effectId === 'poisoned') {
      const poisonType = status.poisonType || 'weakening';
      const poisonDamage = status.poisonDamage || '1d6';
      if (poisonType === 'weakening') {
        mechanicsParts.push('Disadvantage on STR and CON checks and saves');
      } else if (poisonType === 'debilitating') {
        mechanicsParts.push(`Takes ${poisonDamage} poison damage per round`);
      } else if (poisonType === 'paralyzing') {
        mechanicsParts.push('May cause paralysis on failed save');
      }
    }

    // RESTRAINED EFFECT
    else if (effectId === 'restrained') {
      const restraintType = status.restraintType || 'ensnared';
      if (restraintType === 'ensnared') {
        mechanicsParts.push('Caught in vines/webs, speed becomes 0');
      } else if (restraintType === 'grappled') {
        mechanicsParts.push('Held by creature, can attempt to break free');
      } else if (restraintType === 'bound') {
        mechanicsParts.push('Tied up, very difficult to escape');
      }
    }

    // PRONE EFFECT
    else if (effectId === 'prone') {
      description = 'Knocked prone';
      mechanicsParts.push('Disadvantage on attack rolls');
      mechanicsParts.push('Attacks against target have advantage');
      mechanicsParts.push('Costs half movement to stand up');
    }

    // SILENCED EFFECT
    else if (effectId === 'silenced') {
      const silenceType = status.silenceType || 'magical';
      if (silenceType === 'magical') {
        mechanicsParts.push('No sound can be created, cannot cast verbal spells');
      } else if (silenceType === 'muted') {
        mechanicsParts.push('Cannot speak, verbal spells fail');
      } else if (silenceType === 'temporal') {
        mechanicsParts.push('Speech unreliable, verbal casting may fail');
      }
    }

    // DISADVANTAGE ON ATTACKS EFFECT
    else if (effectId === 'disadvantage_attack' || effectId === 'attackers_advantage') {
      const attackTypes = [];
      if (status.affectsMelee) attackTypes.push('melee');
      if (status.affectsRanged) attackTypes.push('ranged');
      if (status.affectsSpell) attackTypes.push('spell');

      const attackTypeText = attackTypes.length === 0 ? 'all' :
                             attackTypes.length === 3 ? 'all' :
                             attackTypes.join(' and ');
      mechanicsParts.push(`Disadvantage on ${attackTypeText} attack rolls`);
    }

    // DISADVANTAGE ON SAVES EFFECT
    else if (effectId === 'disadvantage_save') {
      const saveTypes = [];
      if (status.affectsStrength) saveTypes.push('Strength');
      if (status.affectsAgility) saveTypes.push('Agility');
      if (status.affectsConstitution) saveTypes.push('Constitution');
      if (status.affectsIntelligence) saveTypes.push('Intelligence');
      if (status.affectsSpirit) saveTypes.push('Spirit');
      if (status.affectsCharisma) saveTypes.push('Charisma');

      const saveTypeText = saveTypes.length === 0 ? 'all' :
                          saveTypes.length === 6 ? 'all' :
                          saveTypes.join(', ');
      mechanicsParts.push(`Disadvantage on ${saveTypeText} saving throws`);
    }

    // DAMAGE VULNERABILITY EFFECT
    else if (effectId === 'damage_vulnerability') {
      const vulnType = status.vulnerabilityType || 'physical';
      const percentage = status.vulnerabilityPercent || 100;
      mechanicsParts.push(`Take ${percentage}% more ${vulnType} damage`);
    }

    // REDUCED SPEED EFFECT
    else if (effectId === 'reduced_speed') {
      const speedReduction = status.speedReduction || 50;
      mechanicsParts.push(`Movement speed reduced by ${speedReduction}%`);
    }

    // REDUCED ARMOR EFFECT
    else if (effectId === 'reduced_armor') {
      const armorReduction = status.armorReduction || 4;
      mechanicsParts.push(`Armor reduced by ${armorReduction}`);
    }

    // STAT REDUCTION EFFECT
    else if (effectId === 'stat_reduction') {
      const statReductions = status.statReductions || {};
      const reductionTexts = [];
      Object.entries(statReductions).forEach(([stat, value]) => {
        if (value > 0) {
          reductionTexts.push(`-${value} ${stat.charAt(0).toUpperCase() + stat.slice(1)}`);
        }
      });
      if (reductionTexts.length > 0) {
        mechanicsParts.push(reductionTexts.join(', '));
      }
    }

    // ACTION POINT DRAIN EFFECT
    else if (effectId === 'action_point_drain') {
      const drainType = status.drainType || 'immediate';
      const amount = status.immediateReduction || status.regenReduction || 2;
      if (drainType === 'immediate') {
        mechanicsParts.push(`Immediately lose ${amount} action points`);
      } else if (drainType === 'sustained') {
        mechanicsParts.push(`Action point regeneration reduced by ${amount}`);
      } else if (drainType === 'increasing') {
        mechanicsParts.push(`Actions cost ${amount} more action points`);
      }
    }

    // SLOWED EFFECT
    // REMOVED: Mechanics text for slowed - description already contains the effect details
    // (e.g., "Movement speed reduced by 10 feet" is in the description)
    else if (effectId === 'slowed' || effectId === 'slow') {
      // Don't add mechanics text - description already has the details
    }

    // FROZEN EFFECT
    else if (effectId === 'frozen') {
      const frozenType = status.frozenType || 'immobilized';
      if (frozenType === 'immobilized') {
        mechanicsParts.push('Cannot move, speed becomes 0');
      } else if (frozenType === 'slowed') {
        const speedReduction = status.speedReduction || 75;
        mechanicsParts.push(`Movement speed reduced by ${speedReduction}%`);
      } else if (frozenType === 'frozen_solid') {
        mechanicsParts.push('Completely frozen, cannot take any actions');
      }
    }

    // WEAKENED EFFECT
    else if (effectId === 'weakened') {
      const weakenType = status.weakenType || 'damage';
      const reduction = status.damageReduction || 50;
      mechanicsParts.push(`Damage output reduced by ${reduction}%`);
    }

    // CONFUSED EFFECT
    else if (effectId === 'confused') {
      const confusionType = status.confusionType || 'random_actions';
      if (confusionType === 'random_actions') {
        mechanicsParts.push('Takes random actions each turn');
      } else if (confusionType === 'attack_allies') {
        mechanicsParts.push('May attack allies instead of enemies');
      } else if (confusionType === 'wander') {
        mechanicsParts.push('Wanders randomly, cannot take purposeful actions');
      }
    }

    // DISEASED EFFECT
    else if (effectId === 'diseased') {
      const diseaseType = status.diseaseType || 'wasting';
      const damageDice = status.diseaseDamage || '1d4';
      mechanicsParts.push(`${diseaseType} disease, takes ${damageDice} damage per round`);
    }

    // BLEEDING EFFECT
    else if (effectId === 'bleeding' || effectId === 'bleed') {
      const bleedDamage = status.bleedDamage || '1d6';
      mechanicsParts.push(`Takes ${bleedDamage} bleeding damage per round`);
      if (status.canStack) mechanicsParts.push('stacks with multiple applications');
    }

    // SLEPT/SLEEP EFFECT
    else if (effectId === 'slept' || effectId === 'sleep') {
      mechanicsParts.push('Unconscious, wakes on damage or loud noise');
    }

    // CURSED EFFECT
    else if (effectId === 'cursed' || effectId === 'curse') {
      const curseType = status.curseType || 'misfortune';
      if (curseType === 'misfortune') {
        mechanicsParts.push('Disadvantage on all rolls');
      } else if (curseType === 'weakness') {
        mechanicsParts.push('All stats reduced by 2');
      } else if (curseType === 'doom') {
        mechanicsParts.push('Takes increasing damage each round');
      }
    }

    // DAZED EFFECT
    else if (effectId === 'dazed') {
      mechanicsParts.push('Can take only limited actions per turn');
    }

    // STRENGTHENED EFFECT
    else if (effectId === 'strengthened') {
      const damageIncrease = status.damageIncrease || 25;
      mechanicsParts.push(`Damage output increased by ${damageIncrease}%`);
    }

    // VULNERABILITY EFFECT
    else if (effectId === 'vulnerability') {
      const vulnType = status.vulnerabilityType || 'all';
      const percentage = status.vulnerabilityPercent || 100;
      mechanicsParts.push(`Take ${percentage}% more ${vulnType} damage`);
    }

    // INSPIRATION EFFECT
    else if (effectId === 'inspiration') {
      const inspirationDie = status.inspirationDie || 'd6';
      mechanicsParts.push(`Add ${inspirationDie} to ability checks, attacks, or saves`);
    }

    // REMOVED: Save information is now included in description, not mechanicsText
    // This prevents duplicate "Constitution save DC X (negate)" display

    // Combine all mechanics parts
    mechanicsText = mechanicsParts.length > 0 ? mechanicsParts.join(', ') : (status.mechanicsText || description);

    return {
      name: effectName,
      description: description,
      mechanicsText: mechanicsText
    };
  };
  const formatBuffEffects = () => {
    if (!spell?.buffConfig) {
      // If spell has buff effect type but no config, show a basic effect
      if (spell?.effectTypes?.includes('buff')) {
        // buffConfig is undefined here, so just use a generic name
        const buffName = 'Buff Effect';
        return [{
          name: buffName,
          description: 'Provides beneficial effects',
          mechanicsText: 'Effect details not configured'
        }];
      }
      return null;
    }

    const { buffConfig } = spell;
    const effects = [];

    // Handle class spell format with statBonuses
    if (buffConfig.statBonuses && buffConfig.statBonuses.length > 0) {
      buffConfig.statBonuses.forEach(bonus => {
        const statName = bonus.stat.charAt(0).toUpperCase() + bonus.stat.slice(1);
        const sign = bonus.amount >= 0 ? '+' : '';
        const typeText = bonus.type === 'percentage' ? '%' : '';
        effects.push({
          name: `${statName} Enhancement`,
          description: `${sign}${bonus.amount}${typeText} ${statName}`,
          mechanicsText: `Increases ${statName} by ${bonus.amount}${typeText}`,
          class: 'stat-bonus'
        });
      });
    }

    // Format stat modifiers with special handling for resistance and absorption
    if (buffConfig?.statModifiers && buffConfig.statModifiers.length > 0) {
      const regularStats = [];
      const resistanceStats = [];
      const absorptionStats = [];

      buffConfig.statModifiers.forEach(stat => {
        // Check if this is a resistance stat with special scaling - be more comprehensive
        const statName = (stat.name || stat.id || '').toLowerCase();
        const isResistanceStat = stat.category === 'resistance' ||
                                statName.includes('resistance') ||
                                statName.includes('resist') ||
                                statName.includes('psychic') ||
                                statName.includes('fire') ||
                                statName.includes('frost') ||
                                statName.includes('cold') ||
                                statName.includes('lightning') ||
                                statName.includes('arcane') ||
                                statName.includes('nature') ||
                                statName.includes('poison') ||
                                statName.includes('necrotic') ||
                                statName.includes('radiant') ||
                                statName.includes('chaos') ||
                                statName.includes('void') ||
                                statName.includes('force') ||
                                statName.includes('slashing') ||
                                statName.includes('piercing') ||
                                statName.includes('bludgeoning') ||
                                statName.includes('physical');

        const isAbsorptionStat = statName.includes('absorption');

        // Check for incomplete stat data and show warning
        const hasIncompleteName = !stat.name || stat.name.toLowerCase().includes('stat') && !stat.name.toLowerCase().includes('strength') && !stat.name.toLowerCase().includes('agility');

        let statDisplay = {
          name: hasIncompleteName ? 'INCOMPLETE: Specify stat name' : (stat.name || 'Stat Modifier'),
          value: '',
          class: hasIncompleteName ? 'incomplete-data' : ''
        };

        // Simple stat name formatting (no verbose descriptions)
        if (!hasIncompleteName) {
          // Use simple capitalized stat name
          statDisplay.name = stat.name.charAt(0).toUpperCase() + stat.name.slice(1);
        }

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
            // Simple dice formula display
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
        } else if (isResistanceStat) {
          // Handle resistance values with thematic descriptions
          const percentage = Math.round(parseFloat(stat.magnitude) || 0);
          const damageType = extractDamageTypeFromResistanceName(stat.name || stat.id);

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
            statDisplay.value = getThematicResistanceDescription('highly_resistant', damageType);
            statDisplay.class = 'highly_resistant';
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
            // Create thematic description for any other percentage values
            const sign = percentage >= 0 ? '' : '';
            if (percentage > 0) {
              // Positive resistance values - create thematic descriptions
              if (percentage < 25) {
                statDisplay.value = `Minor ${damageType === 'lightning' ? 'Storm' : damageType.charAt(0).toUpperCase() + damageType.slice(1)} Protection`;
              } else if (percentage < 50) {
                statDisplay.value = `Moderate ${damageType === 'lightning' ? 'Storm' : damageType.charAt(0).toUpperCase() + damageType.slice(1)} Resistance`;
              } else if (percentage < 75) {
                statDisplay.value = `Strong ${damageType === 'lightning' ? 'Storm' : damageType.charAt(0).toUpperCase() + damageType.slice(1)} Defense`;
              } else if (percentage < 100) {
                statDisplay.value = `Major ${damageType === 'lightning' ? 'Storm' : damageType.charAt(0).toUpperCase() + damageType.slice(1)} Guard`;
              } else {
                statDisplay.value = `Overwhelming ${damageType === 'lightning' ? 'Storm' : damageType.charAt(0).toUpperCase() + damageType.slice(1)} Immunity`;
              }
            } else {
              // Negative resistance values (vulnerabilities)
              statDisplay.value = `${damageType === 'lightning' ? 'Storm' : damageType.charAt(0).toUpperCase() + damageType.slice(1)} Vulnerability`;
            }
            statDisplay.class = 'thematic-resistance';
          }
        } else {
          // Enhanced standard number or percentage display with thematic descriptions
          const magnitude = stat.magnitude || 0;
          const sign = magnitude >= 0 ? '+' : '';
          const isPercentage = stat.magnitudeType === 'percentage';

          if (isPercentage) {
            // Check if this is a resistance stat that should use thematic descriptions
            if (isResistanceStat) {
              // Handle resistance values with thematic descriptions
              const percentage = Math.round(parseFloat(magnitude) || 0);
              const damageType = extractDamageTypeFromResistanceName(stat.name || stat.id);

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
                statDisplay.value = getThematicResistanceDescription('highly_resistant', damageType);
                statDisplay.class = 'highly_resistant';
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
                // Create thematic description for any other percentage values
                if (percentage > 0) {
                  // Positive resistance values - create thematic descriptions
                  if (percentage < 25) {
                    statDisplay.value = `Minor ${damageType === 'lightning' ? 'Storm' : damageType.charAt(0).toUpperCase() + damageType.slice(1)} Protection`;
                  } else if (percentage < 50) {
                    statDisplay.value = `Moderate ${damageType === 'lightning' ? 'Storm' : damageType.charAt(0).toUpperCase() + damageType.slice(1)} Resistance`;
                  } else if (percentage < 75) {
                    statDisplay.value = `Strong ${damageType === 'lightning' ? 'Storm' : damageType.charAt(0).toUpperCase() + damageType.slice(1)} Defense`;
                  } else if (percentage < 100) {
                    statDisplay.value = `Major ${damageType === 'lightning' ? 'Storm' : damageType.charAt(0).toUpperCase() + damageType.slice(1)} Guard`;
                  } else {
                    statDisplay.value = `Overwhelming ${damageType === 'lightning' ? 'Storm' : damageType.charAt(0).toUpperCase() + damageType.slice(1)} Immunity`;
                  }
                } else {
                  // Negative resistance values (vulnerabilities)
                  statDisplay.value = `${damageType === 'lightning' ? 'Storm' : damageType.charAt(0).toUpperCase() + damageType.slice(1)} Vulnerability`;
                }
                statDisplay.class = 'thematic-resistance';
              }
            } else {
              // Simple percentage formatting for non-resistance stats
              const sign = magnitude >= 0 ? '+' : '';
              statDisplay.value = `${sign}${magnitude}%`;
              statDisplay.class = magnitude >= 0 ? 'positive' : 'negative';
            }
          } else {
            // Special handling for damage_reduction stat
            if (stat.stat === 'damage_reduction' || statName.includes('damage_reduction') || statName.includes('damage reduction')) {
              statDisplay.value = `Reduces incoming damage by ${Math.abs(magnitude)}`;
              statDisplay.class = 'damage-reduction';
            } else if (stat.stat === 'armor' || statName.includes('armor')) {
              // Special handling for armor
              statDisplay.value = `+${magnitude} Armor`;
              statDisplay.class = 'armor-bonus';
              } else {
                // Simple flat number formatting for other stats
                // Always use simple format, never use verbose stat descriptions
                const sign = magnitude >= 0 ? '+' : '';
                statDisplay.value = `${sign}${magnitude}`;
                statDisplay.class = magnitude >= 0 ? 'positive' : 'negative';
              }
          }
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
          mechanicsText: absorptionStats.map(stat => stat.value).join(', '),
          type: 'absorption',
          data: absorptionStats
        });
      }
    }
    // Format status effects with enhanced configuration display
    if (buffConfig?.statusEffects && buffConfig.statusEffects.length > 0) {
      buffConfig.statusEffects.forEach(effect => {
        // Handle both string IDs and full effect objects
        let effectName, effectData;

        if (typeof effect === 'string') {
          effectName = effect;
          effectData = {};
        } else {
          effectName = effect.name || effect.id || 'Status Effect';
          effectData = effect;
        }

        effectName = effectName.charAt(0).toUpperCase() + effectName.slice(1);

        let mechanicsText = '';
        const mechanicsParts = [];

        // Add configuration-specific details based on effect type
        if (effectData.option) {
          // For lifelink, use proper formatting
          if (effectData.id === 'lifelink') {
            const optionMap = {
              'hp_to_hp': 'Health Link',
              'mana_to_mana': 'Mana Link',
              'hp_to_mana': 'Life to Mana',
              'mana_to_hp': 'Mana to HP',
              'damage_to_healing': 'Damage to Healing',
              'healing_to_damage': 'Healing to Damage'
            };
            const optionName = optionMap[effectData.option] || effectData.option;
            effectName += ` (${optionName})`;
          } else {
            // For other effects, use standard formatting
            const optionName = effectData.option.charAt(0).toUpperCase() + effectData.option.slice(1);
            effectName += ` (${optionName})`;
          }
        }

        // Add specific effect mechanics based on effect ID with comprehensive configuration details
        if (effectData.id === 'lifelink') {
          // Lifelink configuration details - handle both old and new field naming
          const option = effectData.option; // Old system uses 'option' field

          // Handle old system (CleanStatusEffectConfigPopup) with option-based configuration
          if (option) {
            // Map option to readable format
            const optionMap = {
              'hp_to_hp': 'Health Link',
              'mana_to_mana': 'Mana Link',
              'hp_to_mana': 'Life to Mana',
              'mana_to_hp': 'Mana to HP',
              'damage_to_healing': 'Damage to Healing',
              'healing_to_damage': 'Healing to Damage'
            };
            mechanicsParts.push(optionMap[option] || option);

            // Get transfer ratio (old system uses transferRatio, new system uses percentage)
            const transferRatio = effectData.transferRatio || effectData.percentage || 25;
            mechanicsParts.push(`${transferRatio}% conversion`);

            // Add maximum transfer limit if specified
            if (effectData.maxTransfer && effectData.maxTransfer > 0) {
              mechanicsParts.push(`Max: ${effectData.maxTransfer} per trigger`);
            }
          } else {
            // Handle new system (StatusEffectConfigPopup) with detailed configuration
            const direction = effectData.direction || 'caster_to_target';
            const sourceResource = effectData.sourceResource || 'health';
            const targetResource = effectData.targetResource || 'health';
            const calculationType = effectData.calculationType || 'percentage';

            // Format direction
            const directionMap = {
              'caster_to_target': 'Caster → Target',
              'target_to_caster': 'Target → Caster',
              'bidirectional': 'Bidirectional'
            };
            mechanicsParts.push(directionMap[direction]);

            // Format resource link
            if (sourceResource === targetResource) {
              mechanicsParts.push(`${sourceResource.charAt(0).toUpperCase() + sourceResource.slice(1)} Link`);
            } else {
              mechanicsParts.push(`${sourceResource.charAt(0).toUpperCase() + sourceResource.slice(1)} → ${targetResource.charAt(0).toUpperCase() + targetResource.slice(1)}`);
            }

            // Format conversion details
            if (calculationType === 'percentage') {
              const percentage = effectData.percentage || 25;
              mechanicsParts.push(`${percentage}% conversion`);
            } else if (calculationType === 'fixed_amount') {
              const amount = effectData.fixedAmount || 5;
              mechanicsParts.push(`${amount} points per trigger`);
            } else if (calculationType === 'dice_roll') {
              const dice = effectData.diceFormula || '1d4';
              mechanicsParts.push(`${dice} conversion`);
            } else if (calculationType === 'custom_formula') {
              const formula = effectData.customFormula || 'SOURCE_AMOUNT * 0.25';
              mechanicsParts.push(`Formula: ${formula}`);
            }

            // Add maximum transfer limit if specified
            if (effectData.maxTransfer && effectData.maxTransfer > 0) {
              mechanicsParts.push(`Max: ${effectData.maxTransfer} per trigger`);
            }
          }

          // Add trigger conditions
          if (effectData.triggerCondition) {
            const triggerMap = {
              'damage_taken': 'when damaged',
              'damage_dealt': 'when dealing damage',
              'healing_received': 'when healed',
              'spell_cast': 'when casting spells',
              'continuous': 'continuous effect',
              'area_entry': 'when entering or starting turn in area'
            };
            mechanicsParts.push(triggerMap[effectData.triggerCondition] || effectData.triggerCondition);
          }

        } else if (effectData.id === 'damage_shield' || effectData.id === 'damageshield') {
          // Damage Shield configuration details
          const shieldType = effectData.shieldType || effectData.option || 'reflection';

          // Handle detailed shield types (StatusEffectConfigPopup system)
          if (shieldType === 'reflection') {
            const percentage = effectData.reflectionPercentage || 25;
            mechanicsParts.push(`Reflects ${percentage}% damage back to attacker`);
          } else if (shieldType === 'thorns') {
            // Handle both old format (thornsDamage) and new format (thornsDiceCount + thornsDiceType)
            let damage;
            if (effectData.thornsDiceCount && effectData.thornsDiceType) {
              damage = `${effectData.thornsDiceCount}${effectData.thornsDiceType}`;
            } else {
              damage = effectData.thornsDamage || '1d4';
            }
            mechanicsParts.push(`Deals ${damage} damage to attackers`);
          } else if (shieldType === 'absorption') {
            const amount = effectData.absorptionAmount || 15;
            mechanicsParts.push(`Absorbs ${amount} damage, converts to temporary HP`);
          }
          // Handle simple shield types (CleanStatusEffectConfigPopup system)
          else if (shieldType === 'physical') {
            mechanicsParts.push('Reduces physical damage taken');
          } else if (shieldType === 'magical') {
            mechanicsParts.push('Reduces magical damage taken');
          } else if (shieldType === 'complete') {
            mechanicsParts.push('Reduces all damage taken');
          }

          // Add damage type restrictions
          if (effectData.damageTypes && effectData.damageTypes.length > 0) {
            mechanicsParts.push(`vs ${effectData.damageTypes.join(', ')} damage`);
          }

          // Add shield charges/uses if specified
          if (effectData.charges || effectData.uses) {
            const charges = effectData.charges || effectData.uses;
            mechanicsParts.push(`${charges} charge${charges > 1 ? 's' : ''}`);
          }

        } else if (effectData.id === 'empower_next' || effectData.id === 'empower_next_spell') {
          // Empower Next configuration details
          const empowerType = effectData.option || 'spell';

          const empowerMap = {
            'spell': 'Next spell empowered',
            'heal': 'Next healing empowered',
            'weapon': 'Next weapon attack empowered',
            'ability': 'Next ability empowered'
          };

          mechanicsParts.push(empowerMap[empowerType] || `Next ${empowerType} empowered`);

          // Add empowerment details
          if (effectData.empowerAmount || effectData.bonusAmount) {
            const bonus = effectData.empowerAmount || effectData.bonusAmount;
            mechanicsParts.push(`+${bonus}% effectiveness`);
          }

          if (effectData.maxDamage || effectData.maximumEffect) {
            mechanicsParts.push('maximum effect');
          }

          if (effectData.criticalGuaranteed) {
            mechanicsParts.push('guaranteed critical');
          }

        } else if (effectData.id === 'invisibility' || effectData.id === 'invisible') {
          // Invisibility configuration details
          const invisibilityType = effectData.option || 'complete';

          const invisibilityMap = {
            'partial': 'Camouflage - advantage on stealth checks',
            'complete': 'Complete invisibility - invisible until attacking',
            'greater': 'Greater invisibility - remains invisible when attacking'
          };

          mechanicsParts.push(invisibilityMap[invisibilityType] || `${invisibilityType} invisibility`);

          // Add stealth bonus if specified
          if (effectData.stealthBonus) {
            mechanicsParts.push(`+${effectData.stealthBonus} stealth bonus`);
          }

          // Add detection DC if specified
          if (effectData.detectionDC) {
            mechanicsParts.push(`DC ${effectData.detectionDC} to detect`);
          }

          // Add attack bonus details
          if (effectData.attackBonus && effectData.attackBonusType) {
            if (effectData.attackBonusType === 'advantage') {
              mechanicsParts.push('advantage on attacks while invisible');
            } else {
              mechanicsParts.push(`+${effectData.attackBonus} attack bonus while invisible`);
            }
          }

          // Add breaking conditions
          if (effectData.breaks && effectData.breaks.length > 0) {
            const breakConditions = effectData.breaks.map(condition => {
              const conditionMap = {
                'attack': 'attacking',
                'castSpell': 'casting spells',
                'takeDamage': 'taking damage',
                'move': 'moving',
                'interact': 'interacting with objects'
              };
              return conditionMap[condition] || condition;
            });
            mechanicsParts.push(`breaks on: ${breakConditions.join(', ')}`);
          }

        } else if (effectData.id === 'inspiration' || effectData.id === 'inspire') {
          // Inspiration configuration details
          const inspirationType = effectData.option || 'focus';

          const inspirationMap = {
            'focus': 'Mental focus - bonus to concentration checks',
            'insight': 'Tactical insight - bonus to Intelligence checks',
            'creativity': 'Creative surge - bonus to Charisma checks'
          };

          mechanicsParts.push(inspirationMap[inspirationType] || `${inspirationType} inspiration`);

          // Add inspiration die if specified
          if (effectData.inspirationDie) {
            mechanicsParts.push(`add ${effectData.inspirationDie} to applicable rolls`);
          }

          // Add uses per duration
          if (effectData.usesPerDuration) {
            mechanicsParts.push(`${effectData.usesPerDuration} use${effectData.usesPerDuration > 1 ? 's' : ''} per duration`);
          }

          // Add what it applies to
          if (effectData.appliesTo) {
            mechanicsParts.push(`applies to ${effectData.appliesTo} checks`);
          }

        } else if (effectData.id === 'elemental_infusion' || effectData.id === 'elemental_affinity') {
          // Elemental Infusion configuration details
          const elementType = effectData.option || effectData.elementType || 'fire';

          const elementMap = {
            'fire': 'Fire infusion - weapon attacks deal fire damage',
            'frost': 'Frost infusion - weapon attacks deal cold damage',
            'lightning': 'Lightning infusion - weapon attacks deal lightning damage',
            'earth': 'Earth infusion - weapon attacks deal earth damage',
            'air': 'Air infusion - weapon attacks deal air damage',
            'water': 'Water infusion - weapon attacks deal water damage'
          };

          mechanicsParts.push(elementMap[elementType] || `${elementType} elemental infusion`);

          // Add damage bonus if specified (check multiple possible field names)
          if (effectData.extraDamage || effectData.damageBonus || effectData.bonusDamage) {
            const bonus = effectData.extraDamage || effectData.damageBonus || effectData.bonusDamage;
            mechanicsParts.push(`+${bonus} ${elementType} damage`);
          }

          // Add proc chance if specified
          if (effectData.procChance && effectData.procChance !== '100') {
            mechanicsParts.push(`${effectData.procChance}% chance`);
          }

          // Add aura effects if specified
          if (effectData.auraRadius) {
            mechanicsParts.push(`${effectData.auraRadius} ft ${elementType} aura`);
          }

          // Add special effects
          if (effectData.chainTargets) {
            mechanicsParts.push(`chains to ${effectData.chainTargets} targets`);
          }

          if (effectData.setOnFire && elementType === 'fire') {
            mechanicsParts.push('sets targets on fire');
          }

          if (effectData.freezeTarget && elementType === 'frost') {
            mechanicsParts.push('reduces target speed to 0');
          }

        } else if (effectData.id === 'shielded' || effectData.id === 'shield') {
          // Shield configuration details
          const shieldAmount = effectData.shieldAmount || 15;
          const shieldType = effectData.shieldType || 'absorb';

          if (shieldType === 'absorb') {
            mechanicsParts.push(`${shieldAmount} absorption shield`);
          } else if (shieldType === 'reflect') {
            mechanicsParts.push(`${shieldAmount} HP reflective barrier`);
          } else if (shieldType === 'thorns') {
            mechanicsParts.push(`${shieldAmount} HP thorns barrier`);
          }

        } else if (effectData.id === 'regeneration' || effectData.id === 'regen') {
          // Regeneration configuration details
          const regenType = effectData.regenType || 'health';
          const regenDice = effectData.regenDice || effectData.regenAmount || '1d4';
          const frequency = effectData.frequency || 'start_of_turn';

          const freqMap = {
            'start_of_turn': 'start of turn',
            'end_of_turn': 'end of turn',
            'when_damaged': 'when damaged',
            'when_below_half': 'when below 50% HP'
          };

          mechanicsParts.push(`${regenDice} ${regenType} restored`);
          mechanicsParts.push(freqMap[frequency] || frequency);

          // Add conditions
          if (effectData.condition) {
            mechanicsParts.push(`if ${effectData.condition}`);
          }

        } else if (effectData.id === 'haste') {
          // Haste configuration details
          const speedMultiplier = effectData.speedMultiplier || 2;
          const actionBonus = effectData.actionBonus || false;
          const attackBonus = effectData.attackBonus || false;

          mechanicsParts.push(`${speedMultiplier}× movement speed`);
          if (actionBonus) mechanicsParts.push('extra action');
          if (attackBonus) mechanicsParts.push('extra attack');

        } else if (effectData.id === 'inspired') {
          if (effectData.inspirationDie) {
            mechanicsParts.push(`Add ${effectData.inspirationDie} to rolls`);
          }
          if (effectData.usesPerDuration) {
            mechanicsParts.push(`${effectData.usesPerDuration} use${effectData.usesPerDuration > 1 ? 's' : ''}`);
          }
        } else if (effectData.id === 'blessed') {
          if (effectData.rollBonus) {
            mechanicsParts.push(`+${effectData.rollBonus} bonus`);
          }
          if (effectData.bonusDie) {
            mechanicsParts.push(`+${effectData.bonusDie} to rolls`);
          }
        } else if (effectData.id === 'resistance') {
          if (effectData.damageTypes && effectData.damageTypes.length > 0) {
            mechanicsParts.push(`Resist ${effectData.damageTypes.join(', ')}`);
          }
          if (effectData.resistanceValue) {
            mechanicsParts.push(`${effectData.resistanceValue}% reduction`);
          }
        } else if (effectData.id === 'poisoned' || effectData.id === 'poison') {
          // Poison configuration details
          if (effectData.diceCount && effectData.diceType) {
            mechanicsParts.push(`${effectData.diceCount}${effectData.diceType} poison damage per round`);
          }
          if (effectData.poisonType) {
            mechanicsParts.push(`${effectData.poisonType} poison`);
          }
        } else if (effectData.id === 'energized') {
          // Energized configuration details
          if (effectData.bonusActionPoints) {
            mechanicsParts.push(`+${effectData.bonusActionPoints} action points`);
          }
          if (effectData.actionPointRegeneration) {
            mechanicsParts.push(`+${effectData.actionPointRegeneration} AP regen per turn`);
          }
          if (effectData.costReduction) {
            mechanicsParts.push(`-${effectData.costReduction} AP cost for abilities`);
          }
        } else if (effectData.id === 'damage_bonus') {
          // Damage bonus configuration details
          const option = effectData.option;
          if (option === 'elemental' && effectData.damageType && effectData.damageDice) {
            mechanicsParts.push(`+${effectData.damageDice} ${effectData.damageType} damage`);
          } else if (option === 'weapon' && effectData.effectDice) {
            mechanicsParts.push(`+${effectData.effectDice} weapon damage`);
          } else if (option === 'conditional' && effectData.damageDice) {
            mechanicsParts.push(`+${effectData.damageDice} conditional damage`);
          }
        } else if (effectData.id === 'damage_vulnerability') {
          // Vulnerability configuration details
          const option = effectData.option;
          if (option === 'physical') {
            mechanicsParts.push('Vulnerable to physical damage');
          } else if (option === 'elemental' && effectData.primaryElement) {
            mechanicsParts.push(`Vulnerable to ${effectData.primaryElement} damage`);
          } else if (option === 'magical') {
            mechanicsParts.push('Vulnerable to magical damage');
          }
          if (effectData.primaryStrength) {
            mechanicsParts.push(`+${effectData.primaryStrength}% damage taken`);
          }
        } else if (effectData.id === 'burning') {
          // Burning configuration details
          if (effectData.diceCount && effectData.diceType) {
            mechanicsParts.push(`${effectData.diceCount}${effectData.diceType} fire damage per round`);
          }
          if (effectData.extinguishDC) {
            mechanicsParts.push(`DC ${effectData.extinguishDC} to extinguish`);
          }
          if (effectData.extinguishMethod) {
            const methodMap = {
              'action': 'Action to extinguish',
              'water': 'Water/cold damage extinguishes',
              'dispel': 'Dispel magic removes',
              'special': 'Special method required'
            };
            mechanicsParts.push(methodMap[effectData.extinguishMethod] || effectData.extinguishMethod);
          }
        } else if (effectData.id === 'charmed' || effectData.id === 'charm') {
          // Charm configuration details
          if (effectData.commandComplexity) {
            const complexityMap = {
              'simple': 'Simple commands only',
              'moderate': 'Moderate complexity commands',
              'complex': 'Complex commands allowed',
              'any': 'Any command possible'
            };
            mechanicsParts.push(complexityMap[effectData.commandComplexity]);
          }
          if (effectData.maxCommands) {
            mechanicsParts.push(`Max ${effectData.maxCommands} command${effectData.maxCommands > 1 ? 's' : ''}`);
          }
        } else if (effectData.id === 'disadvantage_attack') {
          // Attack disadvantage configuration details
          const option = effectData.option;
          if (option === 'all') {
            mechanicsParts.push('Disadvantage on all attack rolls');
          } else if (option === 'melee') {
            mechanicsParts.push('Disadvantage on melee attack rolls');
          } else if (option === 'ranged') {
            mechanicsParts.push('Disadvantage on ranged attack rolls');
          } else if (option === 'spell') {
            mechanicsParts.push('Disadvantage on spell attack rolls');
          }
        } else if (effectData.id === 'disadvantage_save') {
          // Save disadvantage configuration details
          if (effectData.saveType) {
            mechanicsParts.push(`Disadvantage on ${effectData.saveType} saves`);
          }
          if (effectData.saveTypes && effectData.saveTypes.length > 0) {
            mechanicsParts.push(`Disadvantage on ${effectData.saveTypes.join(', ')} saves`);
          }
        } else if (effectData.id === 'stunned' || effectData.id === 'stun') {
          // Stun configuration details
          if (effectData.duration) {
            mechanicsParts.push(`${effectData.duration} round${effectData.duration > 1 ? 's' : ''}`);
          }
          if (effectData.untilDispelled) {
            mechanicsParts.push('Until dispelled');
          }
        } else if (effectData.id === 'flight' || effectData.id === 'flying') {
          // Flight configuration details
          const flightSpeed = effectData.flightSpeed || 30;
          const flightType = effectData.flightType || 'magical';
          const maneuverability = effectData.maneuverability || 'average';

          mechanicsParts.push(`${flightSpeed} ft flight speed`);
          mechanicsParts.push(`${flightType} flight`);
          if (maneuverability !== 'average') {
            mechanicsParts.push(`${maneuverability} maneuverability`);
          }
        } else if (effectData.id === 'frightened' || effectData.id === 'fear') {
          // Fear configuration details
          if (effectData.fearType || effectData.option) {
            const fearType = effectData.fearType || effectData.option;
            const typeMap = {
              'shaken': 'Shaken - disadvantage on ability checks while source visible',
              'terrified': 'Terrified - cannot move closer to fear source',
              'panicked': 'Panicked - must flee from fear source'
            };
            mechanicsParts.push(typeMap[fearType] || `${fearType} fear`);
          }
          if (effectData.fearRadius) {
            mechanicsParts.push(`${effectData.fearRadius} ft fear radius`);
          }
        } else if (effectData.id === 'blinded' || effectData.id === 'blind') {
          // Blind configuration details
          if (effectData.blindType || effectData.option) {
            const blindType = effectData.blindType || effectData.option;
            const typeMap = {
              'partial': 'Partially blinded - disadvantage on perception and attacks',
              'complete': 'Completely blinded - cannot see, fails sight-based checks',
              'magical': 'Magical blindness - supernatural darkness'
            };
            mechanicsParts.push(typeMap[blindType] || `${blindType} blindness`);
          }
        } else if (effectData.id === 'paralyzed' || effectData.id === 'paralyze') {
          // Paralysis configuration details
          if (effectData.paralysisType || effectData.option) {
            const paralysisType = effectData.paralysisType || effectData.option;
            const typeMap = {
              'partial': 'Partially paralyzed - reduced movement and actions',
              'complete': 'Completely paralyzed - cannot move or act',
              'magical': 'Magical paralysis - held by supernatural forces'
            };
            mechanicsParts.push(typeMap[paralysisType] || `${paralysisType} paralysis`);
          }
        } else if (effectData.id === 'confused' || effectData.id === 'confusion') {
          // Confusion configuration details
          if (effectData.confusionType || effectData.option) {
            const confusionType = effectData.confusionType || effectData.option;
            const typeMap = {
              'random': 'Random actions - roll for behavior each turn',
              'dazed': 'Dazed - reduced actions available',
              'disoriented': 'Disoriented - disadvantage on navigation and perception'
            };
            mechanicsParts.push(typeMap[confusionType] || `${confusionType} confusion`);
          }
        } else if (effectData.id === 'silenced' || effectData.id === 'silence') {
          // Silence configuration details
          if (effectData.silenceType || effectData.option) {
            const silenceType = effectData.silenceType || effectData.option;
            const typeMap = {
              'verbal': 'Cannot speak - no verbal spells',
              'magical': 'Magical silence - no spellcasting',
              'complete': 'Complete silence - no sound at all'
            };
            mechanicsParts.push(typeMap[silenceType] || `${silenceType} silence`);
          }
        } else if (effectData.id === 'slowed' || effectData.id === 'slow') {
          // Slow configuration details
          if (effectData.slowAmount || effectData.speedReduction) {
            const reduction = effectData.slowAmount || effectData.speedReduction || 50;
            mechanicsParts.push(`${reduction}% speed reduction`);
          }
          if (effectData.affectsActions) {
            mechanicsParts.push('reduced actions per turn');
          }
        }

        // Generic option-based formatting for effects that use the standard option system
        else if (effectData.option && !mechanicsParts.length) {
          // Handle common option patterns for effects not specifically handled above
          const option = effectData.option;

          // Common option mappings for various effect types
          if (effectData.id === 'strengthened' || effectData.id === 'strength_boost') {
            const optionMap = {
              'physical': 'Physical strength enhanced',
              'magical': 'Magical power enhanced',
              'mental': 'Mental fortitude enhanced',
              'all': 'All capabilities enhanced'
            };
            mechanicsParts.push(optionMap[option] || `${option} enhancement`);
          } else if (effectData.id === 'weakened' || effectData.id === 'weakness') {
            const optionMap = {
              'physical': 'Physical weakness - reduced strength and constitution',
              'mental': 'Mental weakness - reduced intelligence and spirit',
              'magical': 'Magical weakness - reduced spellcasting ability',
              'all': 'General weakness - all abilities reduced'
            };
            mechanicsParts.push(optionMap[option] || `${option} weakness`);
          } else if (effectData.id === 'diseased' || effectData.id === 'disease') {
            const optionMap = {
              'wasting': 'Wasting disease - gradual stat reduction',
              'fever': 'Fever - constitution penalties and confusion',
              'plague': 'Plague - contagious and debilitating',
              'magical': 'Magical disease - supernatural affliction'
            };
            mechanicsParts.push(optionMap[option] || `${option} disease`);
          } else if (effectData.id === 'cursed' || effectData.id === 'curse') {
            const optionMap = {
              'weakness': 'Curse of Weakness - reduced physical capabilities',
              'misfortune': 'Curse of Misfortune - disadvantage on rolls',
              'binding': 'Binding Curse - restricted actions',
              'doom': 'Curse of Doom - escalating negative effects'
            };
            mechanicsParts.push(optionMap[option] || `${option} curse`);
          } else if (effectData.id === 'bleeding' || effectData.id === 'bleed') {
            const optionMap = {
              'minor': 'Minor wound - light bleeding',
              'severe': 'Severe wound - heavy bleeding',
              'arterial': 'Arterial bleeding - critical blood loss',
              'internal': 'Internal bleeding - hidden damage'
            };
            mechanicsParts.push(optionMap[option] || `${option} bleeding`);
          } else {
            // Generic fallback - capitalize and format the option
            const formattedOption = option.charAt(0).toUpperCase() + option.slice(1).replace(/_/g, ' ');
            mechanicsParts.push(formattedOption);
          }
        }
        // Add more status effect configurations
        if (effectData.id === 'luck' || effectData.id === 'lucky') {
          // Handle both old and new luck configuration systems
          const luckType = effectData.luckType;
          const option = effectData.option; // Old system uses 'option' field

          // New system (luckType-based)
          if (luckType === 'bonus') {
            const luckBonus = effectData.luckBonus || 1;
            const appliesTo = effectData.appliesTo || 'all';

            if (appliesTo === 'all') {
              mechanicsParts.push(`+${luckBonus} luck bonus to all rolls`);
            } else if (appliesTo === 'd20') {
              mechanicsParts.push(`+${luckBonus} luck bonus to d20 rolls`);
            } else if (appliesTo === 'attack') {
              mechanicsParts.push(`+${luckBonus} luck bonus to attack rolls`);
            } else if (appliesTo === 'damage') {
              mechanicsParts.push(`+${luckBonus} luck bonus to damage rolls`);
            } else if (appliesTo === 'skill') {
              mechanicsParts.push(`+${luckBonus} luck bonus to skill checks`);
            } else if (appliesTo === 'save') {
              mechanicsParts.push(`+${luckBonus} luck bonus to saving throws`);
            } else if (appliesTo === 'custom' && effectData.customRollTypes) {
              mechanicsParts.push(`+${luckBonus} luck bonus to ${effectData.customRollTypes}`);
            } else {
              mechanicsParts.push(`+${luckBonus} luck bonus`);
            }
          } else if (luckType === 'reroll') {
            const rerollCount = effectData.rerollCount || 3;
            const appliesTo = effectData.appliesTo || 'd20';
            mechanicsParts.push(`${rerollCount} rerolls for ${appliesTo} rolls`);
            if (effectData.keepBetter) {
              mechanicsParts.push('keep better result');
            }
          } else if (luckType === 'minimum') {
            const minimumValue = effectData.minimumValue || 10;
            const appliesTo = effectData.appliesTo || 'd20';
            mechanicsParts.push(`minimum ${minimumValue} on ${appliesTo} rolls`);
          } else if (luckType === 'choose') {
            const choiceCount = effectData.choiceCount || 1;
            mechanicsParts.push(`choose result of ${choiceCount} roll${choiceCount > 1 ? 's' : ''}`);
            if (effectData.allowCritical) {
              mechanicsParts.push('can choose critical hits');
            }
          }
          // Old system (option-based) - this is what you're currently using
          else if (option === 'minor') {
            const rerollCount = effectData.rerollCount || 1;
            mechanicsParts.push(`${rerollCount} reroll${rerollCount > 1 ? 's' : ''} on failed rolls`);
          } else if (option === 'major') {
            const rerollCount = effectData.rerollCount || 3;
            mechanicsParts.push(`${rerollCount} reroll${rerollCount > 1 ? 's' : ''} on any rolls`);
          } else if (option === 'fate') {
            mechanicsParts.push('choose the result of one roll');
          }
          // Legacy fallback
          else if (luckType === 'general' || (!luckType && !option)) {
            const luckBonus = effectData.luckBonus || 1;
            mechanicsParts.push(`+${luckBonus} luck bonus to all rolls`);
          } else if (luckType === 'combat') {
            const luckBonus = effectData.luckBonus || 1;
            mechanicsParts.push(`+${luckBonus} luck bonus to combat rolls`);
          } else if (luckType === 'skill') {
            const luckBonus = effectData.luckBonus || 1;
            mechanicsParts.push(`+${luckBonus} luck bonus to skill checks`);
          }

        } else if (effectData.id === 'flight' || effectData.id === 'flying') {
          // Flight configuration details
          const flightSpeed = effectData.flightSpeed || 30;
          const flightType = effectData.flightType || 'magical';
          const maneuverability = effectData.maneuverability || 'average';

          mechanicsParts.push(`${flightSpeed} ft flight speed`);
          mechanicsParts.push(`${flightType} flight`);
          if (maneuverability !== 'average') {
            mechanicsParts.push(`${maneuverability} maneuverability`);
          }

        } else if (effectData.id === 'combat_advantage') {
          // Combat Advantage configuration details
          const advantageType = effectData.advantageType || effectData.option || 'attack';

          if (advantageType === 'attack' || advantageType === 'attack_rolls') {
            mechanicsParts.push('Advantage on attack rolls');

            // Add specific attack types if configured
            const attackTypes = [];
            if (effectData.affectsMelee) attackTypes.push('melee');
            if (effectData.affectsRanged) attackTypes.push('ranged');
            if (effectData.affectsSpell) attackTypes.push('spell');
            if (attackTypes.length > 0 && attackTypes.length < 3) {
              mechanicsParts.push(`(${attackTypes.join(', ')} attacks)`);
            }

          } else if (advantageType === 'damage' || advantageType === 'damage_rolls') {
            mechanicsParts.push('Advantage on damage rolls');

            // Add damage bonus dice if specified
            if (effectData.damageBonusDiceCount && effectData.damageBonusDiceType) {
              mechanicsParts.push(`+${effectData.damageBonusDiceCount}${effectData.damageBonusDiceType} bonus damage`);
            }

            // Add damage categories
            if (effectData.affectsAllDamageTypes) {
              mechanicsParts.push('for all damage types');
            } else {
              const damageCategories = [];
              if (effectData.affectsPhysical) damageCategories.push('physical');
              if (effectData.affectsMagical) damageCategories.push('magical');
              if (damageCategories.length > 0) {
                mechanicsParts.push(`for ${damageCategories.join(', ')} damage`);
              }

              // Add specific physical damage types
              if (effectData.affectsPhysical && !effectData.affectsAllDamageTypes) {
                const physicalTypes = [];
                if (effectData.affectsBludgeoning) physicalTypes.push('bludgeoning');
                if (effectData.affectsPiercing) physicalTypes.push('piercing');
                if (effectData.affectsSlashing) physicalTypes.push('slashing');
                if (physicalTypes.length > 0 && physicalTypes.length < 3) {
                  mechanicsParts.push(`(${physicalTypes.join(', ')})`);
                }
              }

              // Add specific magical damage types
              if (effectData.affectsMagical && !effectData.affectsAllDamageTypes) {
                const magicalTypes = [];
                if (effectData.affectsFire) magicalTypes.push('fire');
                if (effectData.affectsCold) magicalTypes.push('cold');
                if (effectData.affectsLightning) magicalTypes.push('lightning');
                if (effectData.affectsVoid) magicalTypes.push('void');
                if (effectData.affectsArcane) magicalTypes.push('arcane');
                if (magicalTypes.length > 0 && magicalTypes.length < 5) {
                  mechanicsParts.push(`(${magicalTypes.join(', ')})`);
                }
              }
            }

          } else if (advantageType === 'healing' || advantageType === 'healing_rolls') {
            mechanicsParts.push('Advantage on healing rolls');

            // Add healing bonus dice if specified
            if (effectData.healingBonusDiceCount && effectData.healingBonusDiceType) {
              mechanicsParts.push(`+${effectData.healingBonusDiceCount}${effectData.healingBonusDiceType} bonus healing`);
            }

            // Add healing types
            const healingTypes = [];
            if (effectData.affectsDirectHealing) healingTypes.push('direct healing');
            if (effectData.affectsHealingOverTime) healingTypes.push('healing over time');
            if (effectData.affectsAbsorptionShields) healingTypes.push('absorption shields');
            if (healingTypes.length > 0 && healingTypes.length < 3) {
              mechanicsParts.push(`(${healingTypes.join(', ')})`);
            }

          } else if (advantageType === 'critical' || advantageType === 'critical_hits') {
            mechanicsParts.push('Increased critical hit chance');

            if (effectData.criticalReduction) {
              mechanicsParts.push(`critical threshold reduced by ${effectData.criticalReduction}`);
            }

          } else if (advantageType === 'initiative') {
            mechanicsParts.push('Advantage on initiative rolls');

            if (effectData.initiativeBonus) {
              mechanicsParts.push(`+${effectData.initiativeBonus} initiative bonus`);
            }

          } else if (advantageType === 'saving_throws') {
            mechanicsParts.push('Advantage on saving throws');

            if (effectData.saveTypes && effectData.saveTypes.length > 0) {
              mechanicsParts.push(`(${effectData.saveTypes.join(', ')})`);
            }
          }

          // Add condition requirements
          const requirements = [];
          if (effectData.requiresHigherGround) requirements.push('higher ground');
          if (effectData.requiresFlank) requirements.push('flanking');
          if (effectData.requiresHidden) requirements.push('hidden/stealth');
          if (requirements.length > 0) {
            mechanicsParts.push(`requires: ${requirements.join(', ')}`);
          }

          // Add magnitude/bonus value information
          if (effectData.magnitude && effectData.magnitude > 0) {
            const magnitudeType = effectData.magnitudeType || 'flat';
            if (magnitudeType === 'percentage') {
              mechanicsParts.push(`+${effectData.magnitude}% bonus`);
            } else {
              mechanicsParts.push(`+${effectData.magnitude} bonus`);
            }
          }

          // Add duration information
          if (effectData.onlyNextAttack) {
            mechanicsParts.push('next attack only');
          } else if (effectData.duration && effectData.duration !== 3) {
            mechanicsParts.push(`${effectData.duration} rounds`);
          }

        } else if (effectData.id === 'skill_mastery' || effectData.id === 'skillmastery' || effectData.id === 'mastery') {
          // Skill Mastery configuration details
          const masteryType = effectData.masteryType || 'specific';

          if (masteryType === 'specific' && effectData.selectedSkills) {
            mechanicsParts.push(`Mastery in ${effectData.selectedSkills.join(', ')}`);
          } else if (masteryType === 'category' && effectData.skillCategory) {
            mechanicsParts.push(`Mastery in all ${effectData.skillCategory} skills`);
          } else if (masteryType === 'all') {
            mechanicsParts.push('Mastery in all skills');
          }

          const masteryBonus = effectData.masteryBonus || 2;
          mechanicsParts.push(`+${masteryBonus} bonus`);

          // Add additional mastery features
          if (effectData.criticalSuccess) {
            mechanicsParts.push('critical success on natural 20');
          }
          if (effectData.rerollOnes) {
            mechanicsParts.push('reroll natural 1s');
          }
          if (effectData.takeAverage) {
            mechanicsParts.push('can take average result');
          }

        } else if (effectData.id === 'elemental_affinity') {
          // Elemental Affinity configuration details
          const elements = effectData.elements || ['fire'];
          const affinityType = effectData.affinityType || 'damage_bonus';
          const bonusAmount = effectData.bonusAmount || 2;

          if (affinityType === 'damage_bonus') {
            mechanicsParts.push(`+${bonusAmount} ${elements.join('/')} damage`);
          } else if (affinityType === 'resistance') {
            mechanicsParts.push(`Resist ${bonusAmount} ${elements.join('/')} damage`);
          } else if (affinityType === 'spell_power') {
            mechanicsParts.push(`+${bonusAmount} ${elements.join('/')} spell power`);
          }

        } else if (effectData.id === 'flying' || effectData.id === 'flight') {
          // Flight configuration details (enhanced from existing)
          const flightSpeed = effectData.flightSpeed || 30;
          const flightType = effectData.flightType || 'magical';
          const maneuverability = effectData.maneuverability || 'average';

          mechanicsParts.push(`${flightSpeed} ft flight speed`);
          mechanicsParts.push(`${flightType} flight`);
          if (maneuverability !== 'average') {
            mechanicsParts.push(`${maneuverability} maneuverability`);
          }

          // Add altitude limits
          if (effectData.maxAltitude) {
            mechanicsParts.push(`max altitude ${effectData.maxAltitude} ft`);
          }

          // Add hover capability
          if (effectData.canHover) {
            mechanicsParts.push('can hover');
          }

        } else if (effectData.id === 'energized' || effectData.id === 'energy_boost') {
          // Energized configuration details (enhanced from existing)
          if (effectData.bonusActionPoints) {
            mechanicsParts.push(`+${effectData.bonusActionPoints} action points`);
          }
          if (effectData.actionPointRegeneration) {
            mechanicsParts.push(`+${effectData.actionPointRegeneration} AP regen per turn`);
          }
          if (effectData.costReduction) {
            mechanicsParts.push(`-${effectData.costReduction} AP cost for abilities`);
          }
          if (effectData.spellCostReduction) {
            mechanicsParts.push(`-${effectData.spellCostReduction} mana cost for spells`);
          }
        }

        // Add duration information with enhanced formatting (only if effect has specific duration)
        if (effectData.durationType) {
          if (effectData.durationType === 'until_used') {
            mechanicsParts.push('Until used');
          } else if (effectData.durationType === 'permanent') {
            mechanicsParts.push('Permanent');
          } else if (effectData.durationType === 'rest') {
            const restType = effectData.restType || 'long';
            mechanicsParts.push(`Until ${restType.charAt(0).toUpperCase() + restType.slice(1)} Rest`);
          } else if (effectData.durationType === 'time' && effectData.durationValue && effectData.durationUnit) {
            const unit = effectData.durationUnit === 'minutes' ? 'min' :
                        effectData.durationUnit === 'seconds' ? 'sec' :
                        effectData.durationUnit;
            mechanicsParts.push(`${effectData.durationValue} ${unit}`);
          } else if (effectData.durationValue) {
            const unit = effectData.durationType === 'minutes' ? 'min' : effectData.durationType;
            mechanicsParts.push(`${effectData.durationValue} ${unit}`);
          }
        }
        // Note: Removed automatic fallback to buffConfig duration to prevent unwanted duration text

        // Add common configuration details that apply to many effects

        // Add saving throw information
        if (effectData.saveType && effectData.saveType !== 'none') {
          const saveTypeMap = {
            'strength': 'Strength',
            'agility': 'Agility',
            'constitution': 'Constitution',
            'intelligence': 'Intelligence',
            'spirit': 'Spirit',
            'charisma': 'Charisma'
          };
          const saveType = saveTypeMap[effectData.saveType] || effectData.saveType;
          let saveText = `${saveType} save`;

          if (effectData.difficultyClass || effectData.saveDC) {
            const dc = effectData.difficultyClass || effectData.saveDC;
            saveText += ` DC ${dc}`;
          }

          if (effectData.saveOutcome) {
            const outcomeMap = {
              'negates': 'negate',
              'halves_effects': 'halves',
              'halves': 'halves'
            };
            saveText += ` (${outcomeMap[effectData.saveOutcome] || effectData.saveOutcome})`;
          }

          mechanicsParts.push(saveText);
        }

        // Add dispel information
        if (effectData.canBeDispelled === false) {
          mechanicsParts.push('cannot be dispelled');
        }

        // Add concentration requirement if applicable
        if (effectData.concentrationRequired || buffConfig.concentrationRequired) {
          mechanicsParts.push('(Concentration)');
        }

        // Enhanced fallback for any status effects that might not be specifically handled
        if (mechanicsParts.length === 0) {
          // Try to extract meaningful information from common configuration fields
          if (effectData.option) {
            const formattedOption = effectData.option.charAt(0).toUpperCase() + effectData.option.slice(1).replace(/_/g, ' ');
            mechanicsParts.push(formattedOption);
          }

          if (effectData.bonus && typeof effectData.bonus === 'number') {
            mechanicsParts.push(`+${effectData.bonus} bonus`);
          }

          if (effectData.percentage && typeof effectData.percentage === 'number') {
            mechanicsParts.push(`${effectData.percentage}% effect`);
          }

          if (effectData.amount && typeof effectData.amount === 'number') {
            mechanicsParts.push(`${effectData.amount} points`);
          }

          if (effectData.dice) {
            mechanicsParts.push(`${effectData.dice} dice`);
          }

          if (effectData.damageType) {
            mechanicsParts.push(`${effectData.damageType} damage`);
          }

          if (effectData.range && typeof effectData.range === 'number') {
            mechanicsParts.push(`${effectData.range} ft range`);
          }

          if (effectData.radius && typeof effectData.radius === 'number') {
            mechanicsParts.push(`${effectData.radius} ft radius`);
          }

          // If still no mechanics text, use a generic description
          if (mechanicsParts.length === 0) {
            mechanicsParts.push('Status effect active');
          }
        }

        mechanicsText = mechanicsParts.join(', ');

        // Create configuration-specific descriptions for certain effects
        let effectDescription = effectData.description || '';

        if (effectData.id === 'lifelink' && effectData.option) {
          // Provide specific descriptions based on lifelink type
          const descriptionMap = {
            'hp_to_hp': 'Establishes a health link between caster and target, sharing damage and healing',
            'mana_to_mana': 'Creates a mana link that allows sharing magical energy between entities',
            'hp_to_mana': 'Converts the caster\'s life force into magical energy for the target',
            'mana_to_hp': 'Transforms the caster\'s mana into healing energy for the target',
            'damage_to_healing': 'Converts damage dealt by the caster into healing for the target',
            'healing_to_damage': 'Transforms healing done by the caster into bonus damage output'
          };
          effectDescription = descriptionMap[effectData.option] || effectDescription;
        }

        effects.push({
          name: effectName,
          description: effectDescription,
          mechanicsText: mechanicsText,
          class: 'status-effect'
        });
      });
    }

    // Handle buffConfig.buffs array (used by enhanced spell library spells)
    if (buffConfig.buffs && buffConfig.buffs.length > 0) {
      buffConfig.buffs.forEach(buff => {
        // Use customName from buffConfig if buff doesn't have its own name
        const buffName = buff.name || buffConfig?.customName || 'Buff Effect';
        const buffDescription = buff.description || '';
        let mechanicsText = '';
        const mechanicsParts = [];

        // Handle stat modifiers within the buff
        if (buff.effects && buff.effects.statModifiers) {
          Object.entries(buff.effects.statModifiers).forEach(([stat, value]) => {
            const sign = value >= 0 ? '+' : '';
            mechanicsParts.push(`${stat.charAt(0).toUpperCase() + stat.slice(1)}: ${sign}${value}`);
          });
        }

        // Handle special effects
        if (buff.effects) {
          if (buff.effects.temporaryHitPoints) {
            mechanicsParts.push(`+${buff.effects.temporaryHitPoints} temporary hit points`);
          }
          if (buff.effects.damageReduction) {
            mechanicsParts.push(`${buff.effects.damageReduction} damage reduction`);
          }
          if (buff.effects.attackBonus) {
            mechanicsParts.push(`+${buff.effects.attackBonus} attack bonus`);
          }
          if (buff.effects.damageBonus) {
            mechanicsParts.push(`+${buff.effects.damageBonus} damage`);
          }
          if (buff.effects.fearImmunity) {
            mechanicsParts.push('Immune to fear');
          }
          if (buff.effects.redirectAttack) {
            mechanicsParts.push('Redirects attacks to self');
          }
          if (buff.effects.radiantDamage) {
            mechanicsParts.push('Attacks deal radiant damage');
          }
          if (buff.effects.spellPowerBonus) {
            mechanicsParts.push(`Spell Power: +${buff.effects.spellPowerBonus}`);
          }
          if (buff.effects.initiativeBonus) {
            mechanicsParts.push(`Initiative: +${buff.effects.initiativeBonus}`);
          }
          if (buff.effects.surpriseImmunity) {
            mechanicsParts.push('Immune to surprise');
          }
          if (buff.effects.perceptionBonus) {
            mechanicsParts.push(`Perception: +${buff.effects.perceptionBonus}`);
          }
          if (buff.effects.insightBonus) {
            mechanicsParts.push(`Insight: +${buff.effects.insightBonus}`);
          }
          if (buff.effects.advantage && Array.isArray(buff.effects.advantage)) {
            mechanicsParts.push(`Advantage on ${buff.effects.advantage.join(', ')} checks`);
          }
        }

        mechanicsText = mechanicsParts.join(', ');

        effects.push({
          name: buffName,
          description: buffDescription,
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
    } else if (purificationConfig.purificationType === 'cleanse') {
      // Format cleanse effects - only show if there are selected effects
      if (purificationConfig.selectedEffects && purificationConfig.selectedEffects.length > 0) {
        // Filter effects to only show those that match the current purification type
        const cleanseEffects = purificationConfig.selectedEffects.filter(effect =>
          !effect.purificationType || effect.purificationType === 'cleanse'
        );

        cleanseEffects.forEach(effect => {
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
      } else {
        // Show default cleanse effect if no specific effects are selected
        effects.push({
          name: 'Cleanse',
          description: 'Remove physical effects like poison, disease, or bleeds',
          mechanicsText: 'Removes harmful physical effects'
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
    } else {
      // Handle any other purification types or general purification effects
      if (purificationConfig.selectedEffects && purificationConfig.selectedEffects.length > 0) {
        purificationConfig.selectedEffects.forEach(effect => {
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
      } else {
        // Show default purification effect if no specific type or effects are selected
        const purificationType = purificationConfig.purificationType || 'purification';
        const typeName = purificationType.charAt(0).toUpperCase() + purificationType.slice(1);

        effects.push({
          name: typeName,
          description: 'Remove harmful effects from targets',
          mechanicsText: 'Removes negative effects'
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
        // Check if this is a resistance stat with special scaling - be more comprehensive
        const statName = (stat.name || stat.id || '').toLowerCase();
        const isResistanceStat = stat.category === 'resistance' ||
                                statName.includes('resistance') ||
                                statName.includes('resist') ||
                                statName.includes('psychic') ||
                                statName.includes('fire') ||
                                statName.includes('frost') ||
                                statName.includes('cold') ||
                                statName.includes('lightning') ||
                                statName.includes('arcane') ||
                                statName.includes('nature') ||
                                statName.includes('poison') ||
                                statName.includes('necrotic') ||
                                statName.includes('radiant') ||
                                statName.includes('chaos') ||
                                statName.includes('void') ||
                                statName.includes('force') ||
                                statName.includes('slashing') ||
                                statName.includes('piercing') ||
                                statName.includes('bludgeoning') ||
                                statName.includes('physical');

        const isAbsorptionStat = statName.includes('absorption');

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
        } else if (isResistanceStat) {
          // Handle resistance values with thematic descriptions
          const percentage = Math.round(parseFloat(stat.magnitude) || 0);
          const damageType = extractDamageTypeFromResistanceName(stat.name || stat.id);
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
            // Create thematic description for any other percentage values
            if (percentage > 0) {
              // Positive resistance values - create thematic descriptions
              if (percentage < 25) {
                statDisplay.value = `Minor ${damageType === 'lightning' ? 'Storm' : damageType.charAt(0).toUpperCase() + damageType.slice(1)} Protection`;
              } else if (percentage < 50) {
                statDisplay.value = `Moderate ${damageType === 'lightning' ? 'Storm' : damageType.charAt(0).toUpperCase() + damageType.slice(1)} Resistance`;
              } else if (percentage < 75) {
                statDisplay.value = `Strong ${damageType === 'lightning' ? 'Storm' : damageType.charAt(0).toUpperCase() + damageType.slice(1)} Defense`;
              } else if (percentage < 100) {
                statDisplay.value = `Major ${damageType === 'lightning' ? 'Storm' : damageType.charAt(0).toUpperCase() + damageType.slice(1)} Guard`;
              } else {
                statDisplay.value = `Overwhelming ${damageType === 'lightning' ? 'Storm' : damageType.charAt(0).toUpperCase() + damageType.slice(1)} Immunity`;
              }
            } else {
              // Negative resistance values (vulnerabilities)
              statDisplay.value = `${damageType === 'lightning' ? 'Storm' : damageType.charAt(0).toUpperCase() + damageType.slice(1)} Vulnerability`;
            }
            statDisplay.class = 'thematic-resistance';
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
          mechanicsText: absorptionStats.map(stat => stat.value).join(', '),
          type: 'absorption',
          data: absorptionStats
        });
      }
    }

    // Helper function to get default save type for status effects
    const getDefaultSaveType = (effectId) => {
      const defaultSaves = {
        'charmed': 'spirit',
        'frightened': 'spirit',
        'fear': 'spirit',

        'blinded': 'constitution',
        'blind': 'constitution',
        'paralyzed': 'constitution',
        'poisoned': 'constitution',
        'restrained': 'strength',
        'silenced': 'constitution',

        'weakened': 'constitution',
        'confused': 'spirit',
        'diseased': 'constitution',
        'bleeding': 'constitution',
        'cursed': 'spirit'
      };
      return defaultSaves[effectId] || 'constitution';
    };

    // Format status effects with enhanced configuration display
    if (debuffConfig?.statusEffects && debuffConfig.statusEffects.length > 0) {
      debuffConfig.statusEffects.forEach(effect => {
        // Handle both string IDs and full effect objects
        let displayName, effectData;

        if (typeof effect === 'string') {
          displayName = effect;
          effectData = {};
        } else {
          displayName = effect.name || effect.id || effect;
          effectData = effect;
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
        const mechanicsParts = [];

        // Add level information if it's not 'moderate' (default)
        if (effectData.level && effectData.level !== 'moderate' && effectData.level !== 'medium') {
          const levelMap = {
            'minor': 'Minor',
            'major': 'Major',
            'severe': 'Severe',
            'extreme': 'Extreme'
          };
          const levelDisplay = levelMap[effectData.level] || effectData.level;
          if (levelDisplay) {
            displayName = `${levelDisplay} ${displayName}`;
          }
        }

        // Add configuration-specific details
        if (effectData.option) {
          const optionName = effectData.option.charAt(0).toUpperCase() + effectData.option.slice(1);
          displayName += ` (${optionName})`;
        }

        // Enhanced formatting for specific debuff effects
        if (effectData.id === 'charmed' || effectData.id === 'charm') {
          const charmType = effectData.charmType || effectData.option || 'friendly';
          const charmDescriptions = {
            'friendly': 'regards you as a friend but maintains free will',
            'dominated': 'must obey your commands without question',
            'infatuated': 'is devoted to you and will protect you at all costs'
          };

          description = `${displayName} - target ${charmDescriptions[charmType] || 'is charmed'}`;

          // Add restrictions based on configuration
          const restrictions = [];
          if (effectData.canAttackCharmer === false) {
            restrictions.push('cannot attack charmer');
          }
          if (effectData.canSelfHarm === false) {
            restrictions.push('cannot be commanded to self-harm');
          }
          if (effectData.retainsMemory === true) {
            restrictions.push('retains memory of actions');
          }

          if (restrictions.length > 0) {
            description += ` (${restrictions.join(', ')})`;
          }

        } else if (effectData.id === 'blinded' || effectData.id === 'blind') {
          if (effectData.blindType || effectData.option) {
            const blindType = effectData.blindType || effectData.option;
            const typeMap = {
              'partial': 'Partially Blinded - limited vision, disadvantage on perception and attacks',
              'complete': 'Completely Blinded - cannot see, automatically fails sight-based checks',
              'flash': 'Flash Blinded - temporary blindness that fades over time'
            };
            description = typeMap[blindType] || `${displayName} - cannot see and has disadvantage on attacks`;
          } else {
            description = `${displayName} - cannot see and has disadvantage on attacks`;
          }

        } else if (effectData.id === 'paralyzed' || effectData.id === 'paralyze') {
          if (effectData.option) {
            const typeMap = {
              'partial': 'Partially Paralyzed - some limbs affected, reduced movement and actions',
              'complete': 'Completely Paralyzed - cannot move or take actions, attacks against have advantage',
              'magical': 'Magical Paralysis - held by supernatural forces, aware but unable to act'
            };
            description = typeMap[effectData.option] || `${displayName} - cannot move or take actions`;
          } else {
            description = `${displayName} - cannot move or take actions`;
          }

        } else if (effectData.id === 'frightened' || effectData.id === 'fear') {
          if (effectData.option) {
            const typeMap = {
              'shaken': 'Shaken - disadvantage on ability checks while fear source is visible',
              'terrified': 'Terrified - cannot willingly move closer to the source of fear',
              'panicked': 'Panicked - must use actions to flee from source of fear'
            };
            description = typeMap[effectData.option] || `${displayName} - overcome with dread and terror`;
          } else {
            description = `${displayName} - overcome with dread and terror`;
          }

        } else {
          // General status effect formatting
          description = displayName;
        }

        // Add comprehensive effect mechanics based on configuration
        if (effectData.id === 'silenced') {
          if (effectData.silenceRadius && effectData.silenceRadius > 0) {
            mechanicsParts.push(`${effectData.silenceRadius}ft radius`);
          }
          if (effectData.affectsVerbalSpells) {
            mechanicsParts.push('Blocks verbal spells');
          }
          if (effectData.affectsSomatic) {
            mechanicsParts.push('Blocks somatic components');
          }

        } else if (effectData.id === 'poisoned') {
          const poisonType = effectData.option || 'standard';
          if (poisonType === 'lethal') {
            mechanicsParts.push('Lethal poison - ongoing damage');
          } else if (poisonType === 'paralytic') {
            mechanicsParts.push('Paralytic poison - movement impaired');
          } else if (poisonType === 'hallucinogenic') {
            mechanicsParts.push('Hallucinogenic poison - perception altered');
          }

          if (effectData.diceCount && effectData.diceType) {
            mechanicsParts.push(`${effectData.diceCount}${effectData.diceType} damage per round`);
          }

        } else if (effectData.id === 'bleeding') {
          const bleedType = effectData.option || 'minor';
          if (bleedType === 'minor') {
            mechanicsParts.push('Minor wound - light bleeding');
          } else if (bleedType === 'severe') {
            mechanicsParts.push('Severe wound - heavy bleeding');
          } else if (bleedType === 'hemorrhaging') {
            mechanicsParts.push('Hemorrhaging - critical blood loss');
          }

          if (effectData.diceCount && effectData.diceType) {
            mechanicsParts.push(`${effectData.diceCount}${effectData.diceType} damage per round`);
          }

        } else if (effectData.id === 'cursed') {
          const curseType = effectData.option || 'general';
          if (curseType === 'weakness') {
            mechanicsParts.push('Curse of Weakness - reduced physical capabilities');
          } else if (curseType === 'misfortune') {
            mechanicsParts.push('Curse of Misfortune - disadvantage on rolls');
          } else if (curseType === 'vulnerability') {
            mechanicsParts.push('Curse of Vulnerability - increased damage taken');
          }

        } else if (effectData.id === 'diseased') {
          const diseaseType = effectData.option || 'wasting';
          if (diseaseType === 'wasting') {
            mechanicsParts.push('Wasting disease - gradual stat reduction');
          } else if (diseaseType === 'fever') {
            mechanicsParts.push('Fever - constitution penalties');
          } else if (diseaseType === 'plague') {
            mechanicsParts.push('Plague - contagious and debilitating');
          }

        } else if (effectData.id === 'stunned' || effectData.id === 'stun') {
          const stunType = effectData.option || 'physical';
          if (stunType === 'physical') {
            mechanicsParts.push('Physical stun - cannot act or move');
          } else if (stunType === 'mental') {
            mechanicsParts.push('Mental stun - mind overwhelmed');
          } else if (stunType === 'magical') {
            mechanicsParts.push('Magical stun - held by arcane forces');
          }

        } else if (effectData.id === 'confused') {
          const confusionType = effectData.option || 'random';
          if (confusionType === 'random') {
            mechanicsParts.push('Random actions - roll for behavior');
          } else if (confusionType === 'dazed') {
            mechanicsParts.push('Dazed - reduced actions available');
          } else if (confusionType === 'disoriented') {
            mechanicsParts.push('Disoriented - cannot distinguish friend from foe');
          }

        } else if (effectData.id === 'weakened') {
          const weaknessType = effectData.option || 'physical';
          if (weaknessType === 'physical') {
            mechanicsParts.push('Physical weakness - reduced strength and constitution');
          } else if (weaknessType === 'mental') {
            mechanicsParts.push('Mental weakness - reduced intelligence and spirit');
          } else if (weaknessType === 'magical') {
            mechanicsParts.push('Magical weakness - reduced spell effectiveness');
          }
        }

        // Add save information for any status effect with save configuration
        const saveDC = effectData.saveDC || debuffConfig.difficultyClass || 15;
        const saveType = effectData.saveType || getDefaultSaveType(effectData.id || effect);

        if (saveType && saveType !== 'none') {
          mechanicsParts.push(`${normalizeSaveType(saveType)} save DC ${saveDC}`);

          if (effectData.saveOutcome) {
            mechanicsParts.push(`(${effectData.saveOutcome})`);
          }

          // Add save frequency information
          if (effectData.saveFrequency && effectData.saveFrequency !== 'initial') {
            const frequencyMap = {
              'end_of_turn': 'save each turn',
              'when_damaged': 'save when damaged',
              'out_of_sight': 'save when out of sight',
              'ally_help': 'save when ally helps',
              'special_trigger': 'save on special trigger'
            };
            mechanicsParts.push(frequencyMap[effectData.saveFrequency] || 'repeated saves');
          }
        }

        // Add enhanced duration information
        if (effectData.durationType) {
          if (effectData.durationType === 'permanent') {
            mechanicsParts.push('Permanent');
          } else if (effectData.durationType === 'until_dispelled') {
            mechanicsParts.push('Until dispelled');
          } else if (effectData.durationType === 'until_used') {
            mechanicsParts.push('Until used');
          } else if (effectData.durationType === 'rest') {
            const restType = effectData.restType || 'long';
            mechanicsParts.push(`Until ${restType.charAt(0).toUpperCase() + restType.slice(1)} Rest`);
          } else if (effectData.durationType === 'time' && effectData.durationValue && effectData.durationUnit) {
            const unit = effectData.durationUnit === 'minutes' ? 'min' :
                        effectData.durationUnit === 'seconds' ? 'sec' :
                        effectData.durationUnit;
            mechanicsParts.push(`${effectData.durationValue} ${unit}`);
          } else if (effectData.durationValue) {
            const unit = effectData.durationType === 'minutes' ? 'min' : effectData.durationType;
            mechanicsParts.push(`${effectData.durationValue} ${unit}`);
          }
        } else if (debuffConfig.durationType && debuffConfig.durationValue) {
          if (debuffConfig.durationType === 'permanent') {
            mechanicsParts.push('Permanent');
          } else if (debuffConfig.durationType === 'rest') {
            const restType = debuffConfig.restType || 'long';
            mechanicsParts.push(`Until ${restType} rest`);
          } else if (debuffConfig.durationType === 'time' && debuffConfig.durationUnit) {
            const unit = debuffConfig.durationUnit === 'minutes' ? 'min' :
                        debuffConfig.durationUnit === 'seconds' ? 'sec' :
                        debuffConfig.durationUnit;
            mechanicsParts.push(`${debuffConfig.durationValue} ${unit}`);
          } else {
            const unit = debuffConfig.durationType === 'minutes' ? 'min' : debuffConfig.durationType;
            mechanicsParts.push(`${debuffConfig.durationValue} ${unit}`);
          }
        }

        // Add concentration requirement if applicable
        if (effectData.concentrationRequired || debuffConfig.concentrationRequired) {
          mechanicsParts.push('(Concentration)');
        }

        // Add specific effect mechanics
        if (effectData.magnitude) {
          mechanicsParts.push(`Magnitude: ${effectData.magnitude}`);
        }

        if (effectData.diceCount && effectData.diceType) {
          mechanicsParts.push(`${effectData.diceCount}${effectData.diceType} per round`);
        }

        // Enhanced fallback for any debuff status effects that might not be specifically handled
        if (mechanicsParts.length === 0) {
          // Try to extract meaningful information from common configuration fields
          if (effectData.option && !description.includes(effectData.option)) {
            const formattedOption = effectData.option.charAt(0).toUpperCase() + effectData.option.slice(1).replace(/_/g, ' ');
            mechanicsParts.push(formattedOption);
          }

          if (effectData.penalty && typeof effectData.penalty === 'number') {
            mechanicsParts.push(`-${effectData.penalty} penalty`);
          }

          if (effectData.percentage && typeof effectData.percentage === 'number') {
            mechanicsParts.push(`${effectData.percentage}% reduction`);
          }

          if (effectData.amount && typeof effectData.amount === 'number') {
            mechanicsParts.push(`${effectData.amount} points damage`);
          }

          if (effectData.dice) {
            mechanicsParts.push(`${effectData.dice} damage per round`);
          }

          if (effectData.damageType) {
            mechanicsParts.push(`${effectData.damageType} damage`);
          }

          if (effectData.range && typeof effectData.range === 'number') {
            mechanicsParts.push(`${effectData.range} ft range`);
          }

          if (effectData.radius && typeof effectData.radius === 'number') {
            mechanicsParts.push(`${effectData.radius} ft radius`);
          }

          // If still no mechanics text, use a generic description
          if (mechanicsParts.length === 0) {
            mechanicsParts.push('Debuff effect active');
          }
        }

        mechanicsText = mechanicsParts.join(', ');

        // Add the status effect to the effects array
        effects.push({
          name: displayName,
          description: description,
          mechanicsText: mechanicsText,
          class: 'status-effect'
        });
      });
    }

    // Add saving throw information only if not already included in effect descriptions
    const hasSaveInDescription = effects.some(effect =>
      effect.description && (
        effect.description.includes('save DC') ||
        effect.description.includes('save DC') ||
        effect.description.includes('saving throw')
      )
    );

    if (!hasSaveInDescription && debuffConfig.savingThrow && debuffConfig.difficultyClass) {
      const saveInfo = formatSavingThrow(debuffConfig, 'debuff');
      if (saveInfo) {
        effects.push({
          name: 'Saving Throw',
          description: `${saveInfo.saveType} save DC ${saveInfo.dc}`,
          mechanicsText: saveInfo.outcome
        });
      }
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
      <>
        <div
          ref={itemRef}
          className={`compact-spell-item ${getRarityClass()} ${isSelected ? 'selected' : ''} ${className}`}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
          onContextMenu={onContextMenu}
          onDragStart={handleDragStart}
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          draggable={isDraggable}
          tabIndex={onClick || onSelect ? "0" : undefined}
          role={onClick || onSelect ? "button" : undefined}
          aria-selected={isSelected}
          data-spell-id={spell?.id}
          title="Drag to action bar to add spell"
          style={{
            userSelect: 'none',
            WebkitUserSelect: 'none',
            MozUserSelect: 'none',
            msUserSelect: 'none',
            cursor: isDraggable ? 'grab' : 'pointer'
          }}
          {...props}
        >
        {/* Spell Icon */}
        <div className="compact-spell-icon">
          <img
            src={getSpellIcon()}
            alt={spell?.name || 'Spell'}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = getCustomIconUrl('Utility/Utility', 'abilities');
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
        {/* Priority Range Tag - Top Right of Header (for creature abilities) */}
        {spell?.priorityRange && (
          <div className="pf-priority-range-tag-above-header">
            {(() => {
              const { min, max, resolution = 'DICE', cardCount = 1, coinCount = 1, cardPattern = 'any', coinPattern = 'any' } = spell.priorityRange;
              if (resolution === 'DICE') {
                return <span>Roll {min}-{max}</span>;
              } else if (resolution === 'CARDS') {
                const patternText = cardPattern === 'any' ? '' :
                  cardPattern === 'hearts' ? '♥' :
                  cardPattern === 'diamonds' ? '♦' :
                  cardPattern === 'clubs' ? '♣' :
                  cardPattern === 'spades' ? '♠' :
                  cardPattern === 'red' ? 'Red' :
                  cardPattern === 'black' ? 'Black' :
                  cardPattern === 'face' ? 'Face' :
                  cardPattern === 'ace' ? 'Ace' :
                  cardPattern === 'ace_of_hearts' ? 'A♥' :
                  cardPattern === 'ace_of_diamonds' ? 'A♦' :
                  cardPattern === 'ace_of_clubs' ? 'A♣' :
                  cardPattern === 'ace_of_spades' ? 'A♠' :
                  cardPattern;
                return <span>Draw {cardCount}x{patternText ? ` ${patternText}` : ''}</span>;
              } else if (resolution === 'COINS') {
                const patternText = coinPattern === 'any' ? '' :
                  coinPattern === 'heads' ? 'H' :
                  coinPattern === 'tails' ? 'T' :
                  coinPattern === 'all_heads' ? 'All H' :
                  coinPattern === 'all_tails' ? 'All T' :
                  coinPattern === 'majority_heads' ? 'Maj H' :
                  coinPattern === 'majority_tails' ? 'Maj T' :
                  coinPattern;
                return <span>Flip {coinCount}x{patternText ? ` ${patternText}` : ''}</span>;
              }
              return <span>Roll {min}-{max}</span>;
            })()}
          </div>
        )}
        {/* Trigger Condition Tag - Top Right of Header, to the left of priority tag (for creature abilities) */}
        {spell?.triggerCondition && (
          <div className="pf-trigger-condition-tag-above-header">
            {(() => {
              const { type, operator, value, statusEffect, resourceType, threshold, abilityName } = spell.triggerCondition;
              
              if (type === 'hp_percentage' || type === 'hp_percentage_target') {
                if (operator === 'below') {
                  const hpText = value <= 25 ? 'Low HP' : value <= 50 ? `Under ${value}%` : `HP < ${value}%`;
                  return <span>{hpText}</span>;
                } else if (operator === 'above') {
                  return <span>HP > {value}%</span>;
                } else {
                  return <span>HP = {value}%</span>;
                }
              } else if (type === 'enemy_count') {
                if (operator === 'at_least') {
                  return <span>{value}+ Enemies</span>;
                } else if (operator === 'at_most') {
                  return <span>≤{value} Enemies</span>;
                } else {
                  return <span>{value} Enemies</span>;
                }
              } else if (type === 'ally_count') {
                if (operator === 'at_least') {
                  return <span>{value}+ Allies</span>;
                } else if (operator === 'at_most') {
                  return <span>≤{value} Allies</span>;
                } else {
                  return <span>{value} Allies</span>;
                }
              } else if (type === 'round_number') {
                if (operator === 'at_least') {
                  return <span>Round {value}+</span>;
                } else if (operator === 'at_most') {
                  return <span>Round ≤{value}</span>;
                } else {
                  return <span>Round {value}</span>;
                }
              } else if (type === 'turn_number') {
                if (operator === 'at_least') {
                  return <span>Turn {value}+</span>;
                } else if (operator === 'at_most') {
                  return <span>Turn ≤{value}</span>;
                } else {
                  return <span>Turn {value}</span>;
                }
              } else if (type === 'distance') {
                if (operator === 'at_most') {
                  return <span>Within {value}ft</span>;
                } else if (operator === 'at_least') {
                  return <span>Beyond {value}ft</span>;
                } else {
                  return <span>{value}ft away</span>;
                }
              } else if (type === 'status_effect_self' || type === 'status_effect_enemy') {
                const effectName = statusEffect ? statusEffect.substring(0, 10) : 'Has Status';
                return <span>{effectName}</span>;
              } else if (type === 'resource_level') {
                const resource = resourceType ? resourceType.charAt(0).toUpperCase() + resourceType.slice(1) : 'Resource';
                if (operator === 'below') {
                  return <span>Low {resource}</span>;
                } else if (operator === 'above') {
                  return <span>High {resource}</span>;
                } else {
                  return <span>{resource} = {value}%</span>;
                }
              } else if (type === 'action_points') {
                if (operator === 'at_least') {
                  return <span>{value}+ AP</span>;
                } else if (operator === 'at_most') {
                  return <span>≤{value} AP</span>;
                } else {
                  return <span>{value} AP</span>;
                }
              } else if (type === 'enemies_low_hp') {
                const thresholdValue = threshold || 25;
                const enemyText = value === 1 ? 'enemy' : 'enemies';
                if (operator === 'at_least') {
                  return <span>If {value}+ {enemyText} ≤{thresholdValue}% HP</span>;
                } else if (operator === 'at_most') {
                  return <span>If ≤{value} {enemyText} ≤{thresholdValue}% HP</span>;
                } else {
                  return <span>If {value} {enemyText} ≤{thresholdValue}% HP</span>;
                }
              } else if (type === 'surrounded') {
                return <span>Surrounded</span>;
              } else if (type === 'first_turn') {
                return <span>First Turn</span>;
              } else if (type === 'cooldown_ready') {
                return <span>Ready</span>;
              } else if (type === 'phase') {
                const phaseText = value ? value.replace('phase', '').replace('Phase', '').trim() || 'Phase' : 'Phase';
                return <span>{phaseText}</span>;
              } else if (type === 'damage_taken') {
                if (operator === 'at_least') {
                  return <span>Took {value}+</span>;
                } else if (operator === 'at_most') {
                  return <span>Took ≤{value}</span>;
                } else {
                  return <span>Took {value}</span>;
                }
              } else if (type === 'ability_used') {
                const abilName = abilityName ? abilityName.substring(0, 10) : 'Ability';
                return <span>After {abilName}</span>;
              }
              return null;
            })()}
          </div>
        )}
        {/* Header Main Row - Icon, Name, Resource Cost, Damage Types */}
        <div className="unified-spell-header-main">
          <div className="pf-spell-icon-container">
            <img
              src={getSpellIcon()}
              alt={spell?.name || 'Spell'}
              className="pf-spell-icon"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = getCustomIconUrl('Utility/Utility', 'abilities');
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

            {/* Resource costs below title for wizard, library, collection, spellbook, and rules variants */}
            {(variant === 'wizard' || variant === 'library' || variant === 'collection' || variant === 'spellbook' || variant === 'rules') && (formatResourceCosts() || spell?.musicalCombo || spell?.specialMechanics?.musicalCombo) && (
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
                </>
              )}

            </div>
          </div>

          {/* Right side container for Resource Cost and Damage Types */}
          <div className="unified-spell-header-right">
            {/* Combined damage types and spell components box for wizard variant */}
            {(() => {
              const damageTypes = getDamageTypes();
              const spellComponents = formatSpellComponents();
              // Determine if there are any component entries configured on the spell
              const hasComponentData = Array.isArray(spell?.resourceCost?.components) && spell.resourceCost.components.length > 0;
              // Only render when we actually have damage types or configured components to show
              const shouldShow = (variant === 'wizard' || variant === 'library' || variant === 'collection' || variant === 'spellbook' || variant === 'rules') && (damageTypes.length > 0 || hasComponentData);

              return shouldShow && (
                <div className="pf-damage-spell-box">
                  {/* Damage Types - Top row */}
                  {damageTypes.length > 0 && (
                  <div className="pf-damage-types-header">
                    {damageTypes.map((damageType, index) => {
                      // Format damage type name: capitalize first letter
                      const formattedType = damageType.charAt(0).toUpperCase() + damageType.slice(1);
                      return (
                        <div key={index} className={`pf-damage-type-badge ${damageType.toLowerCase()}`}>
                          <div className="pf-damage-type-icon"></div>
                          <span className="pf-damage-type-text">{formattedType}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Spell Components - Bottom row, starting beneath leftmost damage type */}
                {spellComponents && (
                  <div className="unified-spell-components-header">
                    {spellComponents}
                  </div>
                )}
              </div>
              );
            })()}

            {/* Damage Types and Resource Costs for library/collection variants */}
            {/* NOTE: Damage types are already shown in the combined box above, so we don't duplicate them here */}
            {(variant === 'library' || variant === 'collection') && false && (
              <div className="pf-library-header-right">
                {/* Damage Types - REMOVED: Already shown in combined box above to prevent duplication */}
                {/* Resource Costs intentionally not duplicated here; shown under title */}
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
        {(variant === 'library' || variant === 'wizard' || variant === 'collection' || variant === 'spellbook' || variant === 'rules') && (
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
                <span>{formatRange()}</span>
              </div>

              {/* Targeting Type Badge */}
              {formatTargetingType() && (
                <div className="pf-targeting-badge">
                  <span>{formatTargetingType()}</span>
                </div>
              )}

              {/* Cadence Name Badge - for Minstrel resolver spells - styled like action type */}
              {((spell?.musicalCombo?.type === 'resolver' && spell?.musicalCombo?.cadenceName) ||
                (spell?.specialMechanics?.musicalCombo?.type === 'resolver' && spell?.specialMechanics?.musicalCombo?.cadenceName)) && (
                <div className="pf-action-type-badge cadence">
                  <div className="pf-action-type-content">
                    <span className="pf-action-type-name">
                      {(spell?.musicalCombo?.cadenceName || spell?.specialMechanics?.musicalCombo?.cadenceName)?.toUpperCase()}
                    </span>
                  </div>
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
                          {' '}<span className="diamond-symbol">◆</span> {logicBadge}
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
            const shouldRenderDamage = hasPrimaryDamage || hasDamageFormula || hasCardDamage || hasCoinDamage || hasDiceDamage;

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
            const hasEffectsToWrap = hasGlobalTriggerOrRequired && (triggerHeader || shouldRenderDamage || shouldRenderHealing);
            const shouldWrapDamageIndividually = hasDamageEffectTriggers && !hasGlobalTriggerOrRequired;
            const shouldWrapHealingIndividually = hasHealingEffectTriggers && !hasGlobalTriggerOrRequired;

            return (
              <div className="pf-spell-stats wow-spell-stats">
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
                                      mechanicsText = mechanicsText ? `${mechanicsText} • ${chanceInfo}` : chanceInfo;
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
                                              {" "}<span className="diamond-symbol">◆</span>{" "}{effect.description}
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
                                  name: `  └ Shield Property`,
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
                                    const isDotOnly = damageData?.damageType === 'dot' && !damageData?.hasDotEffect;
                                    const isAreaDamage = damageData?.damageType === 'area';
                                    const effectSubType = isDotOnly ? 'damage_dot' : (isAreaDamage ? 'damage_area' : 'damage_direct');
                                    const effectTriggers = getEffectTriggersAndFormulas(effectSubType);
                                    const effectTargeting = formatEffectTargeting('damage', effectSubType);
                                    
                                    // ⚠️ CRITICAL: All information must be in description (grey cursive text)
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
                                        mechanicsText = mechanicsText ? `${mechanicsText} • ${chanceInfo}` : chanceInfo;
                                      }
                                    }

                                    // ⚠️ CRITICAL: Damage should be in bold text (mechanicsText), NOT in grey italic description
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
                                                {" "}<span className="diamond-symbol">◆</span>{" "}{effect.description}
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
                                const isDotOnly = damageData?.damageType === 'dot' && !damageData?.hasDotEffect;
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
                                        mechanicsText = mechanicsText ? `${mechanicsText} • ${chanceInfo}` : chanceInfo;
                                      }
                                    }

                                    // ⚠️ CRITICAL: Damage should be in bold text (mechanicsText), NOT in grey italic description
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
                                                {" "}<span className="diamond-symbol">◆</span>{" "}{effect.description}
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
                                          name: `  └ Shield Property`,
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
                                  name: `  └ Shield Property`,
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



              {/* Duration (if not instant) - exclude CHANNELED, ZONE, and BUFF since buff duration is shown in effect description */}
              {((spell?.durationType && spell.durationType !== 'instant') ||
                (spell?.effectTypes?.includes('buff') && spell?.buffConfig?.durationType && spell.buffConfig.durationType !== 'instant')) &&
               (!spell?.spellType || !['CHANNELED', 'ZONE'].includes(spell.spellType)) &&
               (!spell?.effectTypes?.includes('buff')) ? (
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
                const hasLegacyArmorClass = legacyBuff?.armorClass;
                const hasLegacyStatModifiers = legacyBuff?.statModifiers && typeof legacyBuff.statModifiers === 'object' && !Array.isArray(legacyBuff.statModifiers) && Object.keys(legacyBuff.statModifiers).length > 0;
                
                const hasLegacyBuff = hasLegacyResistance || hasLegacyTemporaryHP || hasLegacyImmunity || 
                                     hasLegacyDamageRedirection || hasLegacyActionPoints || hasLegacyAttackBonus ||
                                     hasLegacyArmorClass || hasLegacyStatModifiers;

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
                  if (actualLegacyBuff.armorClass) {
                    const acBonus = actualLegacyBuff.armorClass;
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
                      const statMap = {
                        // Primary stats
                        'strength': 'Strength',
                        'agility': 'Agility',
                        'constitution': 'Constitution',
                        'intelligence': 'Intelligence',
                        'spirit': 'Spirit',
                        'charisma': 'Charisma',
                        'str': 'Strength',
                        'agi': 'Agility',
                        'con': 'Constitution',
                        'int': 'Intelligence',
                        'spi': 'Spirit',
                        'spir': 'Spirit',
                        'cha': 'Charisma',
                        // Secondary/Combat stats
                        'speed': 'Speed',
                        'armor': 'Armor',
                        'attack': 'Attack',
                        'damage': 'Damage',
                        'dodge': 'Dodge Rating',
                        'hp_regen': 'Health Regeneration',
                        'mp_regen': 'Mana Regeneration',
                        'healing_power': 'Healing Power',
                        'initiative': 'Initiative',
                        'lifesteal': 'Lifesteal',
                        'damage_reflection': 'Damage Reflection',
                        'actionpoints': 'Action Points',
                        'action_points': 'Action Points',
                        'damagereduction': 'Damage Reduction',
                        'damage_reduction': 'Damage Reduction',
                        'healingperkill': 'Healing Per Kill',
                        'healing_per_kill': 'Healing Per Kill',
                        'ragegeneration': 'Rage Generation',
                        'rage_generation': 'Rage Generation',
                        'momentumgeneration': 'Momentum Generation',
                        'momentumGeneration': 'Momentum Generation',
                        'momentum_generation': 'Momentum Generation',
                        'all_resistances': 'All Resistances',
                        'all_primary_stats': 'All Primary Stats',
                        // Spell power stats
                        'fire_spell_power': 'Fire Spell Power',
                        'frost_spell_power': 'Frost Spell Power',
                        'lightning_spell_power': 'Lightning Spell Power',
                        'arcane_spell_power': 'Arcane Spell Power',
                        'nature_spell_power': 'Nature Spell Power',
                        'force_spell_power': 'Force Spell Power',
                        'necrotic_spell_power': 'Necrotic Spell Power',
                        'radiant_spell_power': 'Radiant Spell Power',
                        'poison_spell_power': 'Poison Spell Power',
                        'psychic_spell_power': 'Psychic Spell Power',
                        'chaos_spell_power': 'Chaos Spell Power',
                        'void_spell_power': 'Void Spell Power',
                        // Resistance stats
                        'fire_resistance': 'Fire Resistance',
                        'frost_resistance': 'Frost Resistance',
                        'lightning_resistance': 'Lightning Resistance',
                        'arcane_resistance': 'Arcane Resistance',
                        'nature_resistance': 'Nature Resistance',
                        'force_resistance': 'Force Resistance',
                        'necrotic_resistance': 'Necrotic Resistance',
                        'radiant_resistance': 'Radiant Resistance',
                        'poison_resistance': 'Poison Resistance',
                        'psychic_resistance': 'Psychic Resistance',
                        'chaos_resistance': 'Chaos Resistance',
                        'void_resistance': 'Void Resistance',
                        'physical_resistance': 'Physical Resistance',
                        'damage_immunity': 'Damage Immunity',
                        // Custom class-specific stats
                        'multistancebenefits': 'Multi-Stance Benefits',
                        'multiStanceBenefits': 'Multi-Stance Benefits',
                        'multi_stance_benefits': 'Multi-Stance Benefits',
                        'multistanceecho': 'Multi-Stance Echo',
                        'multiStanceEcho': 'Multi-Stance Echo',
                        'multi_stance_echo': 'Multi-Stance Echo',
                        'stancepower': 'Stance Power',
                        'stancePower': 'Stance Power',
                        'stance_power': 'Stance Power',
                        'transitioncostreduction': 'Stance Transition Cost Reduction',
                        'transitionCostReduction': 'Stance Transition Cost Reduction',
                        'transition_cost_reduction': 'Stance Transition Cost Reduction',
                        'movementspeed': 'Movement Speed',
                        'movementSpeed': 'Movement Speed',
                        'movement_speed': 'Movement Speed'
                      };

                      // Get stat name from map, or format the stat name properly
                      const rawStat = statMod.stat?.toLowerCase() || '';
                      const statName = statMap[rawStat] ||
                                       (statMod.stat ? statMod.stat.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Stat');
                      const magnitude = statMod.magnitude || 0;
                      const magnitudeType = statMod.magnitudeType || 'flat';
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
                        
                        if (!suppressMechanicsText && !isResistanceStat) {
                          // Generate formatted stat modifier: "+2 Armor" or "+50% Damage"
                          const sign = magnitude >= 0 ? '+' : '';
                          mechanicsText = `${sign}${magnitude}${typeText} ${statName}`;
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
                        if (!cleanDescription || cleanDescription.toLowerCase().includes('resistance') || cleanDescription.toLowerCase().includes('damage reduction')) {
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

                  // Add stat effects - each as a separate entry
                  statEffects.forEach((effect) => {
                    buffEffectsToRender.push({
                      name: effect.name,
                      description: '', // Don't show duration separately - it's in mechanicsText
                      mechanicsText: effect.mechanicsText || effect.description
                    });
                  });
                  
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
                              'speed': 'Speed', 'armor': 'Armor', 'attack': 'Attack', 'damage': 'Damage', 'dodge': 'Dodge Rating',
                              'hp_regen': 'Health Regeneration', 'mp_regen': 'Mana Regeneration',
                              'healing_power': 'Healing Power', 'initiative': 'Initiative', 'lifesteal': 'Lifesteal',
                              'damage_reflection': 'Damage Reflection', 'actionpoints': 'Action Points',
                              'action_points': 'Action Points', 'damagereduction': 'Damage Reduction',
                              'damage_reduction': 'Damage Reduction', 'healingperkill': 'Healing Per Kill',
                              'healing_per_kill': 'Healing Per Kill', 'ragegeneration': 'Rage Generation',
                              'rage_generation': 'Rage Generation', 'all_resistances': 'All Resistances',
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
                                                    modifierName.includes('fire') ||
                                                    modifierName.includes('cold') ||
                                                    modifierName.includes('lightning') ||
                                                    modifierName.includes('acid') ||
                                                    modifierName.includes('poison') ||
                                                    modifierName.includes('necrotic') ||
                                                    modifierName.includes('radiant') ||
                                                    modifierName.includes('psychic') ||
                                                    modifierName.includes('thunder') ||
                                                    modifierName.includes('force') ||
                                                    modifierName.includes('slashing') ||
                                                    modifierName.includes('piercing') ||
                                                    modifierName.includes('bludgeoning') ||
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
                              // Special handling for damage_reduction stat
                              if (modifier.stat === 'damage_reduction' || modifierName.includes('damage_reduction') || modifierName.includes('damage reduction')) {
                                statModifierTexts.push(`Reduces incoming damage by ${value}`);
                              } else if (modifier.stat === 'armor' || modifierName.includes('armor')) {
                                // Special handling for armor
                                statModifierTexts.push(`+${value} Armor`);
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
                                'speed': 'Speed', 'armor': 'Armor', 'attack': 'Attack', 'damage': 'Damage', 'dodge': 'Dodge Rating',
                                'hp_regen': 'Health Regeneration', 'mp_regen': 'Mana Regeneration',
                                'healing_power': 'Healing Power', 'initiative': 'Initiative', 'lifesteal': 'Lifesteal',
                                'damage_reflection': 'Damage Reflection', 'actionpoints': 'Action Points',
                                'action_points': 'Action Points', 'damagereduction': 'Damage Reduction',
                                'damage_reduction': 'Damage Reduction', 'all_resistances': 'All Resistances',
                                'all_primary_stats': 'All Primary Stats', 'ragegeneration': 'Rage Generation',
                                'rage_generation': 'Rage Generation'
                              };

                              const progressiveStagesText = buffData.progressiveStages.map((stage, stageIndex) => {
                                const triggerAt = stage.triggerAt || 1;
                                
                                // Format stat modifiers with actual numbers for this stage
                                const stageStatTexts = stage.statModifiers?.map(stat => {
                                  const rawId = stat.id?.toLowerCase() || '';
                                  const statName = stat.name || statMap[rawId] || 
                                                  (stat.id ? stat.id.replace(/_/g, ' ').split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Stat');
                                  const value = stat.magnitude || stat.value || 0;
                                  const sign = value >= 0 ? '+' : '';
                                  const typeText = stat.magnitudeType === 'percentage' ? '%' : '';
                                  return `${sign}${value}${typeText} ${statName}`;
                                }).join(', ') || 'None';

                                return `${unitLabel} ${triggerAt}: ${stageStatTexts}`;
                              }).join(' → ');

                              finalMechanicsText = progressiveStagesText;
                            }

                            // Use customName from buffConfig if provided
                            const progressiveBaseName = buffData?.customName || spell?.buffConfig?.customName || 'Buff Effect';
                            // Don't show duration as separate line
                            buffEffectsToRender.push({
                              name: progressiveBaseName,
                              description: '', // No separate duration line
                              mechanicsText: finalMechanicsText || (isProgressive ? '' : mechanicsText)
                            });
                          }
                }

              // Handle status effects with enhanced formatting
              if (buffData?.statusEffects?.length > 0) {
                buffData.statusEffects.forEach(status => {
                  // Format status effect based on its configuration
                  const formattedEffect = formatStatusEffectDetails(status, 'buff');

                  // For status effects, don't show mechanicsText if description already contains all info
                  // The description already contains all the information (e.g., duration, save info)
                  buffEffectsToRender.push({
                    name: formattedEffect.name,
                    description: formattedEffect.description,
                    mechanicsText: '' // Don't show mechanicsText for status effects - description has everything
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

                const durationText = durationParts.length > 0 ? `(${durationParts.join(' • ')})` : '';
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
                let mechanicsText = 'Effect details not configured';
                // Use customName from buffConfig if provided, otherwise fallback to 'Buff Effect'
                let effectName = buffData?.customName || spell?.buffConfig?.customName || 'Buff Effect';

                // Add duration information if configured
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

                  if (buffData.concentrationRequired) {
                    durationParts.push('Concentration');
                  }

                  if (buffData.durationType === 'permanent') {
                    if (buffData.canBeDispelled === false) {
                      durationParts.push('Cannot be dispelled');
                    } else if (buffData.canBeDispelled === true) {
                      durationParts.push('Dispellable');
                    }
                  }

                }

                // Don't show duration as separate line for fallback buffs either
                buffEffectsToRender.push({
                  name: effectName,
                  description: '', // No separate duration line
                  mechanicsText: mechanicsText
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
                                  {" "}<span className="diamond-symbol">◆</span>{" "}{effect.description}
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
                  spell.debuffConfig.durationValue
                );

                if (!hasDebuffType && !hasAnyDebuffConfiguration) return null;

                // For rules variant (racial traits), only show debuff effects if they provide unique information
                // Hide them if they would just duplicate the description
                if (variant === 'rules' && spell?.description && (
                  spell.description.toLowerCase().includes('frailty') ||
                  spell.description.toLowerCase().includes('vulnerability') ||
                  spell.description.toLowerCase().includes('weakness')
                )) {
                  // For traits like "surface frailty", show the effects as they provide specific mechanical details
                  // Continue to show effects
                } else if (variant === 'rules') {
                  // For other racial traits, hide detailed effects to avoid duplication with description
                  return null;
                }

                return (
                  <div className="healing-effects">
                    <div className="healing-effects-section">
                      {(() => {
                        const debuffData = spell?.debuffConfig;
                        if (!debuffData && !hasDebuffType) return null;

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
                              'speed': 'Speed', 'armor': 'Armor', 'attack': 'Attack', 'damage': 'Damage', 'dodge': 'Dodge Rating',
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
                                                    penaltyName.includes('fire') ||
                                                    penaltyName.includes('cold') ||
                                                    penaltyName.includes('lightning') ||
                                                    penaltyName.includes('acid') ||
                                                    penaltyName.includes('poison') ||
                                                    penaltyName.includes('necrotic') ||
                                                    penaltyName.includes('radiant') ||
                                                    penaltyName.includes('psychic') ||
                                                    penaltyName.includes('thunder') ||
                                                    penaltyName.includes('force') ||
                                                    penaltyName.includes('slashing') ||
                                                    penaltyName.includes('piercing') ||
                                                    penaltyName.includes('bludgeoning') ||
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
                              // Use generic formatting for non-resistance stats
                              allStatChanges.push(`-${amount}${typeText} ${statName}`);
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
                              'speed': 'Speed', 'armor': 'Armor', 'attack': 'Attack', 'damage': 'Damage', 'dodge': 'Dodge Rating',
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
                                                    modifierName.includes('fire') ||
                                                    modifierName.includes('cold') ||
                                                    modifierName.includes('lightning') ||
                                                    modifierName.includes('acid') ||
                                                    modifierName.includes('poison') ||
                                                    modifierName.includes('necrotic') ||
                                                    modifierName.includes('radiant') ||
                                                    modifierName.includes('psychic') ||
                                                    modifierName.includes('thunder') ||
                                                    modifierName.includes('force') ||
                                                    modifierName.includes('slashing') ||
                                                    modifierName.includes('piercing') ||
                                                    modifierName.includes('bludgeoning') ||
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
                              // Use generic formatting for non-resistance stats
                              allStatChanges.push(`${sign}${value}${typeText} ${statName}`);
                            }
                          });
                        }

                        // Add consolidated stat changes if any exist
                        if (allStatChanges.length > 0) {
                          let mechanicsText = allStatChanges.join(', ');

                          // Build save information for description line
                          let saveText = '';
                          const saveType = debuffData.savingThrow || debuffData.saveType;
                          const saveDC = debuffData.difficultyClass || debuffData.saveDC || 15;
                          const saveOutcome = debuffData.saveOutcome || 'negates';

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
                            } else if (debuffData.durationType === 'minutes') {
                              durationText = `${durationValue} ${durationValue === 1 ? 'Minute' : 'Minutes'}`;
                            } else if (debuffData.durationType === 'hours') {
                              durationText = `${durationValue} ${durationValue === 1 ? 'Hour' : 'Hours'}`;
                            } else if (debuffData.durationType === 'time' && durationValue) {
                              const unit = debuffData.durationUnit || 'rounds';
                              durationText = `${durationValue} ${unit}`;
                            } else if (durationValue) {
                              durationText = `${durationValue} rounds`;
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
                                'speed': 'Speed', 'armor': 'Armor', 'attack': 'Attack', 'damage': 'Damage', 'dodge': 'Dodge Rating',
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
                              // Special handling for Dodge reaction: shows total Dodge Rating (base + 1 from reaction)
                              const originalMagnitude = statMod.magnitude || 0;
                              const isDodgeReaction = spell.id === 'universal_dodge' && rawStat === 'dodge';
                              // For Dodge reaction, show total (base Dodge Rating + 1 from reaction)
                              let magnitude = isDodgeReaction ? (currentDodgeValue + originalMagnitude) : originalMagnitude;
                              const magnitudeType = statMod.magnitudeType || 'flat';
                              const typeText = magnitudeType === 'percentage' ? '%' : '';
                              
                              // Check if description already explains the stat modifier
                              const effectDescription = effect.description || '';
                              const descriptionLower = effectDescription.toLowerCase();
                              const statNameLower = statName.toLowerCase();
                              
                              // Check if description already contains the stat reduction info
                              // If description has both the magnitude and stat name, suppress mechanicsText to avoid duplication
                              // This prevents double dashes like "--1 Armor" when description is "-1 Armor for 3 Rounds"
                              const hasMagnitude = descriptionLower.includes(`${magnitude}`) || 
                                                   descriptionLower.includes(`${magnitude} `) ||
                                                   descriptionLower.includes(`-${magnitude}`) ||
                                                   descriptionLower.includes(`- ${magnitude}`);
                              
                              const hasStatName = descriptionLower.includes(statNameLower);
                              
                              // If description already has both magnitude and stat name, don't add mechanicsText
                              const descriptionHasStatReduction = hasMagnitude && hasStatName;
                              
                              // Build mechanics text - suppress if description already explains the effect
                              // For Dodge reaction, show total Dodge Rating (e.g., "+2 Dodge Rating" = 1 base + 1 from reaction)
                              const sign = (isDodgeReaction && magnitude > 0) ? '+' : (magnitude >= 0 ? '' : '');
                              mechanicsText = descriptionHasStatReduction ? '' : `${sign}${magnitude}${typeText} ${statName}`;
                              
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
                                const saveType = debuffData.savingThrow || debuffData.saveType || debuffData.savingThrowType;
                                const saveDC = debuffData.difficultyClass || debuffData.saveDC;
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
                              const rawDescription = descriptionParts.length > 0 ? descriptionParts.join(' • ') : 
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
                              const saveType = debuffData.savingThrow || debuffData.saveType || debuffData.savingThrowType;
                              const saveDC = debuffData.difficultyClass || debuffData.saveDC;
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

                              const finalDescription = descriptionParts.join(' • ');

                              // For status effects with descriptions, don't show mechanicsText
                              // The description already contains all the information (e.g., "Movement speed reduced by 10 feet")
                              // This prevents redundant mechanics text like "Movement speed reduced by 50%"
                              effects.push({
                                name: formattedEffect.name,
                                description: finalDescription,
                                mechanicsText: '', // Don't show mechanicsText for status effects - description has everything
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
                                const saveType = debuffData.savingThrow || debuffData.saveType || debuffData.savingThrowType;
                                const saveDC = debuffData.difficultyClass || debuffData.saveDC;
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
                              
                              const description = descriptionParts.length > 0 ? descriptionParts.join(' • ') : 
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
                          debuffData.statusEffects.forEach(status => {
                            // Format status effect based on its configuration
                            const formattedEffect = formatStatusEffectDetails(status, 'debuff', debuffData);

                          const debuffTargeting = formatEffectTargeting('debuff');
                          effects.push({
                            name: formattedEffect.name,
                            description: formattedEffect.description,
                            mechanicsText: formattedEffect.mechanicsText,
                            targeting: debuffTargeting
                          });
                          });
                        }

                        // REMOVED: Always show duration/save info - now handled by individual effects
                        // This was causing duplicate save/duration display

                        // REMOVED: Fallback debuff effects - individual effects should handle all cases

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
                                        {" "}<span className="diamond-symbol">◆</span>{" "}{effect.description}
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
                  spell.utilityConfig.enhancementType ||
                  spell.utilityConfig.enhancementValue
                );

                // Only show utility section if there are actually configured utility effects
                // Don't show just because utilityType is set - need actual effects or enhancements
                if (!hasUtilityType && !hasAnyUtilityConfiguration) return null;
                
                // If utilityType is set but no actual effects/enhancements, don't show generic utility
                if (hasUtilityType && !hasSelectedEffects && !spell.utilityConfig?.enhancementType && !spell.utilityConfig?.enhancementValue) {
                  return null;
                }

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
                            <div key={`utility-${index}`} className="healing-effect-item">
                              <div className="healing-effect">
                                <span className="healing-effect-name">{effect.name}</span>
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
                        const controlDC = controlData?.difficultyClass !== null && controlData?.difficultyClass !== undefined ? controlData.difficultyClass : controlData?.saveDC;
                        const controlSaveType = controlData?.savingThrowType || controlData?.saveType;
                        let saveText = '';
                        if (controlData?.savingThrow !== null && controlData?.savingThrow !== false && controlSaveType) {
                          const saveType = normalizeSaveType(controlSaveType);
                          saveText = `${saveType}`;
                          if (controlDC) {
                            saveText = `DC ${controlDC} ${saveText} save`;
                          } else {
                            saveText = `${saveType} save`;
                          }
                        } else if (controlDC && controlSaveType) {
                          // Show DC and save type even if savingThrow flag isn't set
                          const saveType = normalizeSaveType(controlSaveType);
                          saveText = `DC ${controlDC} ${saveType} save`;
                        } else if (controlDC) {
                          // Show DC even without saving throws if it exists
                          saveText = `DC ${controlDC}`;
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
                            const effectSavingThrowType = effectConfig.savingThrowType !== null && effectConfig.savingThrowType !== undefined ? effectConfig.savingThrowType : (controlData.savingThrowType || controlData.saveType || 'strength');
                            // Support both difficultyClass and saveDC field names
                            const effectDifficultyClass = effectConfig.difficultyClass !== null && effectConfig.difficultyClass !== undefined ? effectConfig.difficultyClass : 
                                                          (effectConfig.saveDC !== null && effectConfig.saveDC !== undefined ? effectConfig.saveDC :
                                                          (controlData.difficultyClass !== null && controlData.difficultyClass !== undefined ? controlData.difficultyClass : controlData.saveDC));
                            const effectSavingThrow = effectConfig.savingThrow !== null && effectConfig.savingThrow !== undefined ? effectConfig.savingThrow : (controlData.savingThrow !== null && controlData.savingThrow !== false ? controlData.savingThrow : null);

                            // Build duration text for this effect
                            // ⚠️ CRITICAL: Forced movement effects (push/pull) don't need duration
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
                            } else if (effectDifficultyClass && effectSavingThrowType) {
                              // Show DC and save type even if savingThrow flag isn't explicitly set
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
                              mechanicsText = configDetails.join(' • ');
                            }

                            // Build the inline description with duration and save
                            // ⚠️ CRITICAL: Check if description already contains duration/save info to avoid duplication
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
                                        {" "}<span className="diamond-symbol">◆</span>{" "}{effect.description}
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
                            const quantityText = quantity > 1 ? ` (×${quantity})` : '';

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
                            if (creature.stats?.armorClass || creature.stats?.armor) {
                              stats.push(`Armor: ${creature.stats.armorClass || creature.stats.armor}`);
                            }

                            // Build enhanced mechanics text with proper hierarchy
                            let mechanicsText = '';
                            if (creature.description) {
                              mechanicsText = creature.description;
                              if (stats.length > 0) {
                                mechanicsText += ' • ' + stats.join(' • ');
                              }
                            } else {
                              mechanicsText = stats.length > 0 ? stats.join(' • ') : `Summons ${creature.name}`;
                            }

                            // Add attached effects to mechanics text
                            if (creatureConfig.attachedEffects) {
                              const attachedMechanics = [];

                              Object.entries(creatureConfig.attachedEffects).forEach(([effectKey, effectData]) => {
                                if (!effectData) return;

                              let attachedText = '';
                              switch (effectData.effectType) {
                                case 'damage':
                                  attachedText = `${effectData.formula} ${effectData.elementType || 'force'} damage in ${effectData.areaRadius || 10}ft radius`;
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
                                    attachedText += ` • DC ${effectData.saveDC} ${effectData.saveType} save (${effectData.saveOutcome})`;
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
                                    attachedText += ` • DC ${effectData.saveDC} ${effectData.saveType} save (${effectData.saveOutcome})`;
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
                                mechanicsText += (mechanicsText ? ' • ' : '') + attachedMechanics.join(' • ');
                              }
                            }

                            // Will attach conditional formulas after helper is defined
                            effects.push({
                              name: `Summon ${creature.name}${quantityText}`,
                              description: inlineDetails.join(' - '),
                              mechanicsText: mechanicsText || 'Summoned creature'
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
                          const quantityText = quantity > 1 ? ` (×${quantity})` : '';

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
                          if (creatureStats.armor) {
                            stats.push(`Armor: ${creatureStats.armor}`);
                          }
                          if (creatureStats.damage) {
                            stats.push(`Damage: ${creatureStats.damage}`);
                          }
                          if (creatureStats.attackBonus) {
                            stats.push(`Attack: +${creatureStats.attackBonus}`);
                          }

                          // Add abilities if present
                          let mechanicsText = stats.join(' • ');
                          if (creatureStats.abilities?.length > 0) {
                            const abilitiesText = `Abilities: ${creatureStats.abilities.join(', ')}`;
                            mechanicsText = mechanicsText ? `${mechanicsText} • ${abilitiesText}` : abilitiesText;
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
                                        {" "}<span className="diamond-symbol">◆</span>{" "}{effect.description}
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
                            if (creature.stats?.armorClass || creature.stats?.armor) {
                              stats.push(`Armor: ${creature.stats.armorClass || creature.stats.armor}`);
                            }
                          }

                          // Add equipment and ability handling info
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
                              mechanicsText += ' • ' + stats.join(' • ');
                            }
                          } else {
                            mechanicsText = stats.length > 0 ? stats.join(' • ') : `Transform into ${transformationType}`;
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
                                        {" "}<span className="diamond-symbol">◆</span>{" "}{effect.description}
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
                const hasSelectedEffects = purificationData?.selectedEffects?.length > 0;
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
                        const hasSelectedEffects = purificationData?.selectedEffects?.length > 0;
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
                            const effectsList = targetEffects.map(e => e.charAt(0).toUpperCase() + e.slice(1)).join(', ');
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
                        if (purificationData?.selectedEffects?.length > 0) {
                          purificationData.selectedEffects.forEach(effect => {
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
                                        {" "}<span className="diamond-symbol">◆</span>{" "}{effect.description}
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
                            mechanicsParts.push(`Restores ${restorationData.restoredHealth} health`);
                          }
                          if (restorationData.restoredMana) {
                            mechanicsParts.push(`${restorationData.restoredMana} mana`);
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
                            mechanicsText: mechanicsParts.join(' • ')
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
                                        {" "}<span className="diamond-symbol">◆</span>{" "}{effect.description}
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


              </div>
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
