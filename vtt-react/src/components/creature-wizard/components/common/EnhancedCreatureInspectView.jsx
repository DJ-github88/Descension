import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import MythrillWindow from '../../../windows/MythrillWindow';
import useTabOverflow from '../../../common/useTabOverflow';
import ItemTooltip from '../../../item-generation/ItemTooltip';
import TooltipPortal from '../../../tooltips/TooltipPortal';
import { useTooltipPosition } from '../../../common/useTooltipPosition';
import StatTooltip from '../../../tooltips/StatTooltip';
import GeneralStatTooltip from '../../../tooltips/GeneralStatTooltip';
import ResistanceTooltip from '../../../tooltips/ResistanceTooltip';
import UnifiedSpellCard from '../../../spellcrafting-wizard/components/common/UnifiedSpellCard';
import SmartTabButton from '../../../common/SmartTabButton';
import InlineMarkdown from '../../../common/InlineMarkdown';
import { DAMAGE_TYPES, normalizeDamageType } from '../../../spellcrafting-wizard/core/data/damageTypes';
import { getQualityColor } from '../../../../constants/itemConstants';
import { getAbilityIconUrl, getCustomIconUrl, getIconUrl, getCreatureTokenIconUrl } from '../../../../utils/assetManager';
import { transformAbilityToSpell, resolveCreatureAbilityIcon, PLACEHOLDER_ABILITY_ICONS } from '../../../../utils/creatureAbilityUtils';
import { SKILL_DEFINITIONS, SKILL_CATEGORIES, SKILL_RANKS } from '../../../../constants/skillDefinitions';
import { ROLLABLE_TABLES } from '../../../../constants/rollableTables';
import BESTIARY_DATA from '../../../../data/creatureData.json';
import { calculateStatModifier } from '../../../../utils/characterUtils';
import useCreatureStore, { getCreatureSizeMapping } from '../../../../store/creatureStore';
import useGridItemStore, { showNothingDroppedNotification } from '../../../../store/gridItemStore';
import useSettingsStore from '../../../../store/settingsStore';
import { startLocalLootRoll, getTestPlayers } from '../../../../services/localLootRollService';
import useInventoryStore from '../../../../store/inventoryStore';
import useItemStore from '../../../../store/itemStore';
import useDiceStore from '../../../../store/diceStore';
import ChargeableRollButton from '../../../dice/ChargeableRollButton';
import { getGridSystem } from '../../../../utils/InfiniteGridSystem';
import { findLootDropTiles } from '../../../../utils/lootDropPlacement';
import { getStore } from '../../../../store/storeRegistry';
import useChatStore from '../../../../store/chatStore';
import { processCreatureLoot } from '../../../../utils/lootItemUtils';
import { calculateEffectiveMovementSpeed, movementSpeedBreakdown, movementBreakdownText } from '../../../../utils/conditionUtils';
import '../../../spellcrafting-wizard/styles/pathfinder/main.css';
import '../../../../styles/skills.css';
import '../../../../styles/character-sheet.css';
import './EnhancedCreatureInspectView.css';
import { CreatureAbilityDetails } from './CreatureAuthoredAbility';

// Helper function to calculate ability modifier
const calculateModifier = (value) => {
  return Math.floor((value - 10) / 2);
};

const formatModifier = (mod) => {
  const num = Number(mod) || 0;
  return num >= 0 ? `+${num}` : `${num}`;
};

// Pre-index bestiary creatures by ID and lowercase name for O(1) lookups
const BESTIARY_LOOKUP_MAP = new Map();
if (BESTIARY_DATA?.regions) {
  for (const region of BESTIARY_DATA.regions) {
    for (const c of (region.creatures || [])) {
      const entry = {
        illustration: c.illustration,
        illustrationCaption: c.illustrationCaption,
        name: c.name,
        region: region.name,
        role: c.role,
        dangerLevel: c.dangerLevel,
        folkloreInspiration: c.folkloreInspiration,
        loreClassification: c.loreClassification,
        loreCanon: c.loreCanon,
        loreNote: c.loreNote
      };
      if (c.id) BESTIARY_LOOKUP_MAP.set(c.id, entry);
      if (c.name) BESTIARY_LOOKUP_MAP.set(c.name.toLowerCase(), entry);
    }
  }
}

// Look up a creature's illustration from BESTIARY_DATA by id / creatureId / name in O(1) time.
// Bestiary-sourced creatures carry rich lore (origin, nature, habitat, depth) but
// the library/token copies don't include the illustration, so we resolve it here.
const findBestiaryIllustration = (creature) => {
  if (!creature) return null;
  const id = creature.id || creature.creatureId;
  if (id && BESTIARY_LOOKUP_MAP.has(id)) {
    return BESTIARY_LOOKUP_MAP.get(id);
  }
  const name = creature.name ? String(creature.name).toLowerCase() : null;
  if (name && BESTIARY_LOOKUP_MAP.has(name)) {
    return BESTIARY_LOOKUP_MAP.get(name);
  }
  return null;
};

const getCreatureThumb = (illustration) => {
  if (!illustration || typeof illustration !== 'string') return illustration;
  return illustration
    .replace('/creatures/', '/creatures/thumbs/')
    .replace(/\.png$/i, '.jpg');
};

// Resolves the primary visual artwork for a creature (icon, token, or bestiary portrait)
const resolveCreaturePortrait = (creature, token) => {
  if (!creature && !token) return null;
  // 1. Direct custom token icon from token state
  if (token?.state?.customIcon) return token.state.customIcon;
  // 2. Custom token image
  if (creature?.customTokenImage) return creature.customTokenImage;
  // 3. Bestiary illustration or creature illustration
  const bestiaryMatch = findBestiaryIllustration(creature);
  if (creature?.illustration) return creature.illustration;
  if (bestiaryMatch?.illustration) return bestiaryMatch.illustration;
  // 4. Creature tokenIcon / icon
  const iconId = creature?.tokenIcon || creature?.icon || creature?.image;
  if (iconId) {
    if (typeof iconId === 'string' && (iconId.startsWith('http') || iconId.startsWith('/assets/'))) {
      return iconId;
    }
    return getCreatureTokenIconUrl(iconId, creature?.type);
  }
  return null;
};

const readLoreText = (value) => {
  if (Array.isArray(value)) return value.filter(Boolean).map(String).join(', ');
  if (value === null || value === undefined) return '';
  return String(value).trim();
};

const isCosmicWyrdCreature = (classification = {}) => {
  const originClass = readLoreText(classification.originClass).toLowerCase();
  const status = readLoreText(classification.status).toLowerCase();
  return originClass === 'ancient-cosmic-wyrdkin'
    || originClass === 'keth-spawn'
    || status.includes('cosmic-wyrd')
    || status.includes('wyrdspawn');
};

// Helper to resolve ability icon URLs - converts WoW icons to local ability icons
const getAbilityIconUrlLocal = (icon) => {
  if (!icon) return getCustomIconUrl('Utility/Utility', 'abilities');
  
  // If it's already a full URL (ability icon path), return as-is
  if (typeof icon === 'string' && icon.startsWith('/assets/')) {
    return icon;
  }
  
  // If it's a full HTTP URL (legacy WoW URL), try to extract the icon ID and convert
  if (typeof icon === 'string' && icon.startsWith('http')) {
    const match = icon.match(/(?:spell_|ability_|inv_|achievement_)([^/]+)\.jpg/);
    if (match) {
      const iconId = match[0].replace('.jpg', '');
      return getAbilityIconUrl(iconId);
    }
    return icon; // Return as-is if we can't convert
  }
  
  // If it's a WoW icon ID (starts with inv_, spell_, ability_, etc.), convert it
  if (typeof icon === 'string' && (icon.startsWith('inv_') || icon.startsWith('spell_') || icon.startsWith('ability_') || icon.startsWith('achievement_'))) {
    return getAbilityIconUrl(icon);
  }
  
  // If it's already an ability icon path (e.g., "combat/sword"), convert it
  if (typeof icon === 'string' && icon.includes('/') && !icon.startsWith('http')) {
    return getAbilityIconUrl(icon);
  }
  
  // Default fallback
  return getCustomIconUrl('Utility/Utility', 'abilities');
};

// Helper function to handle image errors with fallback
const handleImageError = (e, fallbackIcon = 'Utility/Utility') => {
  // Prevent infinite loop - if we're already showing the fallback, don't try again
  const fallbackUrl = getCustomIconUrl(fallbackIcon, 'abilities');
  const currentSrc = e.target.src || '';
  
  // Check if we're already showing the fallback icon
  if (currentSrc.includes('Utility/Utility') || currentSrc === fallbackUrl) {
    e.target.onerror = null;
    return;
  }
  
  // Only set fallback if the image actually failed to load
  // Set onerror to null first to prevent infinite loop
  e.target.onerror = null;
  
  // Only change src if it's different from fallback
  if (currentSrc !== fallbackUrl) {
    e.target.src = fallbackUrl;
  }
};

// Helper function to get skill icon URL - converts skill icon names to proper paths
const getSkillIconUrl = (iconName, skillId) => {
  if (!iconName) {
    // If no icon name, try to get icon from skill ID mapping
    const skillIconMap = {
      acrobatics: 'Utility/Upward Jump',
      athletics: 'General/Strength',
      investigation: 'Nature/World Map',
      perception: 'Utility/All Seeing Eye',
      stealth: 'Utility/Hide',
      survival: 'Nature/Sense',
      animalHandling: 'Nature/Wolf Dash',
      nature: 'Nature/Nature Natural',
      persuasion: 'Social/Hand Shake',
      deception: 'Utility/Peep',
      intimidation: 'Utility/Roaring Beast Head',
      performance: 'Social/Golden Harp',
      arcana: 'Arcane/Magical Staff',
      history: 'Utility/Ornate Symbol',
      insight: 'Utility/All Seeing Eye',
      medicine: 'Healing/Armored Healing',
      religion: 'Radiant/Prayer of the Desperate',
      sleightOfHand: 'Utility/Grab'
    };
    const mappedIcon = skillIconMap[skillId];
    return mappedIcon ? getCustomIconUrl(mappedIcon, 'abilities') : getCustomIconUrl('Utility/Utility', 'abilities');
  }
  
  // If iconName is already a full URL, return as-is
  if (typeof iconName === 'string' && iconName.startsWith('/assets/')) {
    return iconName;
  }
  
  // If iconName is already a proper path (e.g., "Utility/Icon Name"), use it
  if (typeof iconName === 'string' && iconName.includes('/')) {
    return getCustomIconUrl(iconName, 'abilities');
  }
  
  // If iconName is just a name (e.g., "Leap Mountain"), try to find it
  // Some icons like "Leap Mountain.png" are in the root of abilities folder
  // getCustomIconUrl can handle root-level icons by passing just the name
  if (typeof iconName === 'string' && !iconName.includes('/') && !iconName.startsWith('http')) {
    // Try root level first (for icons like "Leap Mountain.png" in abilities root)
    // getCustomIconUrl will construct: /assets/icons/abilities/Leap Mountain.png
    return getCustomIconUrl(iconName, 'abilities');
  }
  
  // Fallback
  return getCustomIconUrl('Utility/Utility', 'abilities');
};

// Format damage type for display
const formatDamageType = (type) => {
  if (!type) return 'Smashing';

  const typeMap = {
    'smashing': 'Smashing',
    'stabbing': 'Stabbing',
    'slicing': 'Slicing',
    'ranged': 'Stabbing',
    'ember': 'Ember',
    'rime': 'Rime',
    'storm': 'Storm',
    'primal': 'Primal',
    'arcane': 'Arcane',
    'blight': 'Blight',
    'wyrd': 'Wyrd',
    'sacred': 'Sacred',
    'healing': 'Healing',
    'physical': 'Smashing',
    'fire': 'Ember',
    'frost': 'Rime',
    'cold': 'Rime',
    'nature': 'Primal',
    'necrotic': 'Blight',
    'radiant': 'Sacred',
    'poison': 'Blight',
    'acid': 'Blight',
    'psychic': 'Wyrd',
    'slashing': 'Slicing',
    'piercing': 'Stabbing',
    'bludgeoning': 'Smashing'
  };

  return typeMap[type.toLowerCase()] || type.charAt(0).toUpperCase() + type.slice(1);
};

// Helper function to get color based on damage type
const getDamageTypeColor = (damageType) => {
  const damageColors = {
    smashing: '#8B5A2B',
    stabbing: '#704214',
    slicing: '#5C3317',
    ranged: '#704214',
    ember: '#D4380D',
    rime: '#2C5F7C',
    storm: '#8B7328',
    primal: '#2D5A1E',
    arcane: '#5B3A8C',
    blight: '#3D1F4E',
    wyrd: '#7A2040',
    sacred: '#DAA520',
    healing: '#1E7D34',
    fire: '#D4380D',
    frost: '#2C5F7C',
    nature: '#2D5A1E',
    necrotic: '#3D1F4E',
    radiant: '#DAA520',
    physical: '#8B5A2B',
    poison: '#3D1F4E',
    lightning: '#8B7328',
    force: '#5B3A8C',
    psychic: '#7A2040',
    bludgeoning: '#8B5A2B',
    piercing: '#704214',
    slashing: '#5C3317',
    chaos: '#7A2040'
  };

  return damageColors[damageType?.toLowerCase()] || '#FFFFFF';
};

// Format ability type for display
const formatAbilityType = (type) => {
  if (!type) return 'Unknown';

  const typeMap = {
    'attack': 'Attack',
    'spell': 'Spell',
    'trait': 'Trait',
    'reaction': 'Reaction',
    'melee': 'Melee',
    'ranged': 'Ranged',
    'special': 'Special'
  };

  return typeMap[type.toLowerCase()] || type.charAt(0).toUpperCase() + type.slice(1);
};






const EnhancedCreatureInspectView = ({ creature: initialCreature, token, isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState(initialCreature?._summonMeta?.sourceType === 'summon' ? 'summon' : 'statistics');
  const [openDropdown, setOpenDropdown] = useState(null);
  const [dropdownPos, setDropdownPos] = useState(null);
  const closeTimerRef = useRef(null);
  const [selectedSkillCategory, setSelectedSkillCategory] = useState('combat');
  const [mounted, setMounted] = useState(false);
  const windowRef = useRef(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const { adjustedPosition, tooltipRef } = useTooltipPosition(mousePosition, !!hoveredItem);
  const [hoveredStat, setHoveredStat] = useState(null);
  const [statTooltipPosition, setStatTooltipPosition] = useState({ x: 0, y: 0 });
  const [selectedStatGroup, setSelectedStatGroup] = useState('summary');
  // Selected index for combined Abilities & Spells icon strip
  const [selectedAbilityIndex, setSelectedAbilityIndex] = useState(0);
  // Skills section state
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const [selectedDie, setSelectedDie] = useState('d20');
  // Stats navigation state for label toggle
  const [showLabels, setShowLabels] = useState(false); // Start with icons only

  // Store hooks for loot drop functionality
  const { addItemToGrid } = useGridItemStore();
  const { tokens } = useCreatureStore();
  const itemStore = useItemStore(state => ({ items: state.items }));
  let gridSystem = null;
  try {
    gridSystem = getGridSystem();
  } catch (e) {
    // Grid system may not be initialized yet outside an active grid session
  }

  // Process the creature's loot items - use useMemo to avoid reprocessing on every render
  const creature = useMemo(() => {
    // Only process if we have items in the store (avoid timing issues)
    let processed = null;
    if (!itemStore.items || itemStore.items.length === 0) {
      processed = initialCreature; // Return unprocessed creature if store isn't ready
    } else {
      processed = processCreatureLoot(initialCreature, itemStore);
    }
    
    // Ensure stats always exists to prevent null errors
    if (processed && !processed.stats) {
      processed = { ...processed, stats: {} };
    }
    
    return processed;
  }, [initialCreature, itemStore.items]);

  // Get all skills grouped by category (static, doesn't depend on creature)
  const skillsByCategory = useMemo(() => {
    return Object.entries(SKILL_DEFINITIONS).reduce((acc, [skillId, skill]) => {
      if (!acc[skill.category]) {
        acc[skill.category] = [];
      }
      acc[skill.category].push({ id: skillId, ...skill });
      return acc;
    }, {});
  }, []);

  // Get skills that the creature knows (from skillRanks or legacy skills format)
  const getCreatureSkills = useCallback(() => {
    const skills = new Set();
    
    // Check if creature and stats exist before accessing
    if (!creature || !creature.stats) {
      return Array.from(skills);
    }
    
    // New format: skillRanks
    if (creature.stats.skillRanks) {
      Object.keys(creature.stats.skillRanks).forEach(skillId => {
        skills.add(skillId);
      });
    }
    
    // Legacy format: skills (old bonus system)
    if (creature.stats.skills) {
      Object.keys(creature.stats.skills).forEach(skillId => {
        skills.add(skillId);
      });
    }
    
    return Array.from(skills);
  }, [creature?.stats?.skillRanks, creature?.stats?.skills]);

  // Filter to only show skills the creature knows
  const creatureSkills = useMemo(() => {
    const knownSkills = getCreatureSkills();
    const filtered = {};
    
    Object.entries(skillsByCategory).forEach(([categoryName, skills]) => {
      const creatureSkillsInCategory = skills.filter(skill => knownSkills.includes(skill.id));
      if (creatureSkillsInCategory.length > 0) {
        filtered[categoryName] = creatureSkillsInCategory;
      }
    });
    
    return filtered;
  }, [getCreatureSkills, skillsByCategory]);

  // Get skill rank for a creature skill
  const getSkillRank = useCallback((skillId) => {
    // Check if creature and stats exist before accessing
    if (!creature || !creature.stats) {
      return { key: 'UNTRAINED', ...SKILL_RANKS.UNTRAINED };
    }
    
    // Check new format first
    if (creature.stats.skillRanks && creature.stats.skillRanks[skillId]) {
      const rankKey = creature.stats.skillRanks[skillId];
      return { key: rankKey, ...SKILL_RANKS[rankKey] };
    }
    
    // Fallback to legacy format or default to UNTRAINED
    return { key: 'UNTRAINED', ...SKILL_RANKS.UNTRAINED };
  }, [creature?.stats?.skillRanks]);

  // Calculate skill modifier for creature
  const calculateSkillModifier = useCallback((skill, skillId) => {
    // Check if creature and stats exist before accessing
    if (!creature || !creature.stats) {
      const rank = getSkillRank(skillId);
      const rankBonus = rank.statBonus || 0;
      return Math.floor(calculateStatModifier(10) / 2) + rankBonus;
    }
    
    const primaryMod = calculateStatModifier(creature.stats[skill.primaryStat] || 10);
    const secondaryMod = calculateStatModifier(creature.stats[skill.secondaryStat] || 10);
    const rank = getSkillRank(skillId);
    const rankBonus = rank.statBonus || 0;

    return primaryMod + Math.floor(secondaryMod / 2) + rankBonus;
  }, [creature?.stats, getSkillRank]);

  // Auto-select first skill when skills section is viewed
  useEffect(() => {
    if (activeSection === 'skills') {
      const knownSkills = getCreatureSkills();
      if (knownSkills.length > 0 && !selectedSkill) {
        // Auto-select first skill
        setSelectedSkill(knownSkills[0]);
      } else if (knownSkills.length === 0) {
        setSelectedSkill(null);
      }
    }
  }, [activeSection, getCreatureSkills, selectedSkill]);

  // Component lifecycle management
  useEffect(() => {
    if (isOpen && creature) {
      setMounted(true);
    }
  }, [isOpen, creature]);

  // The tab dropdown menus are portaled to <body> so they are not clipped by
  // the header's scroll container (.window-header .spellbook-tab-container uses
  // overflow-x:auto to let tabs scroll, which would otherwise hide the menus).
  const openTabDropdown = useCallback((key, el) => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setOpenDropdown(key);
    if (el) {
      const r = el.getBoundingClientRect();
      setDropdownPos({ left: r.left, top: r.bottom, width: r.width });
    }
  }, []);

  const scheduleCloseTabDropdown = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    closeTimerRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 150);
  }, []);

  const cancelCloseTabDropdown = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  // (early return lives below the last hook)

  // Process creature loot to ensure itemId references are resolved
  // Note: creature is already processed at line 118, so we use it directly
  const processedCreature = creature;

  // Handle section change
  const handleSectionChange = (sectionId) => {
    setActiveSection(sectionId);
  };

  // Tooltip helper functions
  const handleStatHover = (e, statName) => {
    setHoveredStat(statName);
    updateStatTooltipPosition(e);
  };

  const updateStatTooltipPosition = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setStatTooltipPosition({
      x: rect.right + 10,
      y: rect.top + rect.height / 2
    });
  };

  const handleStatLeave = () => {
    setHoveredStat(null);
  };

  // Check if a stat is a base stat (for tooltip type determination)
  const isBaseStat = (statName) => {
    const baseStats = ['strength', 'agility', 'constitution', 'intelligence', 'spirit', 'charisma'];
    return baseStats.includes(statName.toLowerCase());
  };

  // Get stat components for tooltips (similar to character sheet)
  const getStatComponents = (statName) => {
    const components = {
      base: (creature && creature.stats) ? (creature.stats[statName] || 0) : 0,
      equipment: 0, // Creatures don't have equipment bonuses
      buffs: 0,     // Could be extended for creature buffs
      debuffs: 0    // Could be extended for creature debuffs
    };

    return components;
  };

  const isSummon = !!(creature?._summonMeta?.sourceType === 'summon');

  const categoryNameToId = useMemo(() => ({
    'Combat Mastery': 'combat',
    'Exploration & Survival': 'exploration',
    'Social & Influence': 'social',
    'Arcane Studies': 'arcane'
  }), []);

  const creatureSkillItems = useMemo(() => {
    const items = {
      combat: [],
      exploration: [],
      social: [],
      arcane: []
    };
    Object.entries(creatureSkills || {}).forEach(([catName, skills]) => {
      const catId = categoryNameToId[catName];
      if (catId && items[catId]) {
        items[catId] = skills.map(skill => ({
          id: skill.id,
          label: skill.name,
          icon: skill.icon || 'fas fa-dice-d20'
        }));
      }
    });
    return items;
  }, [creatureSkills, categoryNameToId]);

  // Summoned tokens (totems, traps, specters, companions, etc.) are simple
  // placeable tokens — they have no attributes, skills, loot tables, or tactics
  // of their own. Show ONLY the tailored Summon sheet so they read as distinct
  // tokens rather than full creature character sheets.
  const sections = useMemo(() => isSummon
    ? {
        summon: {
          title: 'Summon',
          icon: 'fas fa-sun'
        }
      }
    : {
        statistics: {
          title: 'Statistics',
          icon: 'fas fa-chart-bar',
          subSections: [
            { id: 'summary', label: 'Combat Summary', icon: 'fas fa-id-card' },
            { id: 'attributes', label: 'Core Attributes', icon: 'fas fa-dumbbell' },
            { id: 'combat', label: 'Combat Statistics', icon: 'fas fa-fist-raised' },
            { id: 'spellpower', label: 'Spell Power', icon: 'fas fa-hat-wizard' },
            { id: 'defensive', label: 'Resources', icon: 'fas fa-heart' },
            { id: 'movement', label: 'Movement & Senses', icon: 'fas fa-running' },
            { id: 'immunities', label: 'Damage Immunities', icon: 'fas fa-shield-alt' },
            { id: 'conditions', label: 'Condition Resistances', icon: 'fas fa-biohazard' }
          ]
        },
        abilities: {
          title: 'Abilities & Spells',
          icon: 'fas fa-wand-magic-sparkles'
        },
        tactics: {
          title: 'Tactics & Behavior',
          icon: 'fas fa-chess'
        },
        skills: {
          title: 'Skills',
          icon: 'fas fa-scroll',
          subSections: [
            { id: 'combat', label: 'Combat Mastery', icon: 'fas fa-fist-raised' },
            { id: 'exploration', label: 'Exploration & Survival', icon: 'fas fa-compass' },
            { id: 'social', label: 'Social & Influence', icon: 'fas fa-users' },
            { id: 'arcane', label: 'Arcane Studies', icon: 'fas fa-hat-wizard' }
          ],
          skillItems: creatureSkillItems
        },
        loot: {
          title: 'Loot Table',
          icon: 'fas fa-coins'
        },
        description: {
          title: 'Description & Lore',
          icon: 'fas fa-book-open'
        }
      }, [isSummon, creatureSkillItems]);

  const sectionKeys = useMemo(() => Object.keys(sections), [sections]);
  const { containerRef: tabsTrackRef, hiddenIds: hiddenTabIds } = useTabOverflow({
    itemIds: sectionKeys,
    triggerWidth: 36
  });
  const [tabOverflowOpen, setTabOverflowOpen] = useState(false);
  const [tabOverflowPos, setTabOverflowPos] = useState(null);
  const tabOverflowBtnRef = useRef(null);
  const tabOverflowMenuRef = useRef(null);
  const overflowCloseTimerRef = useRef(null);

  const openTabOverflowMenu = useCallback((rect) => {
    if (overflowCloseTimerRef.current) {
      clearTimeout(overflowCloseTimerRef.current);
      overflowCloseTimerRef.current = null;
    }
    setTabOverflowPos({
      top: rect.bottom + 4,
      left: Math.max(8, Math.min(rect.left, window.innerWidth - 230))
    });
    setTabOverflowOpen(true);
  }, []);

  const scheduleCloseTabOverflow = useCallback(() => {
    if (overflowCloseTimerRef.current) return;
    overflowCloseTimerRef.current = setTimeout(() => {
      overflowCloseTimerRef.current = null;
      setTabOverflowOpen(false);
    }, 150);
  }, []);

  const cancelCloseTabOverflow = useCallback(() => {
    if (overflowCloseTimerRef.current) {
      clearTimeout(overflowCloseTimerRef.current);
      overflowCloseTimerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (!tabOverflowOpen) return undefined;
    const handlePointerDown = (e) => {
      if (tabOverflowBtnRef.current && tabOverflowBtnRef.current.contains(e.target)) return;
      if (tabOverflowMenuRef.current && tabOverflowMenuRef.current.contains(e.target)) return;
      setTabOverflowOpen(false);
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setTabOverflowOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown, true);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown, true);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [tabOverflowOpen]);

  useEffect(() => () => {
    if (overflowCloseTimerRef.current) clearTimeout(overflowCloseTimerRef.current);
  }, []);

  // Early return if no creature, no stats, or not open (must stay below all hooks)
  if (!creature || !creature.stats || !isOpen) return null;

  // Render the content based on the active section
  // Render the Tactics & Behavior section
  const renderTacticsSection = () => {
    const tactics = creature.tactics || {
      combatStyle: 'balanced',
      targetPriority: 'balanced',
      abilityUsage: 'strategic',
      retreatThreshold: 30,
      notes: ''
    };

    const formatTacticValue = (value) => {
      const formatMap = {
        'passive': 'Passive',
        'defensive': 'Defensive',
        'balanced': 'Balanced',
        'aggressive': 'Aggressive',
        'frontline': 'Front Line',
        'weakest': 'Weakest',
        'strongest': 'Strongest',
        'nearest': 'Nearest',
        'random': 'Random',
        'conservative': 'Conservative',
        'strategic': 'Strategic',
        'desperate': 'Desperate'
      };
      return formatMap[value] || value;
    };

    return (
      <div className="creature-inspect-section">
        <div className="tactics-display-grid">
          <div className="tactics-display-item">
            <div className="tactics-display-label">
              <i className="fas fa-shield-alt"></i> Combat Style
            </div>
            <div className="tactics-display-value">
              {formatTacticValue(tactics.combatStyle)}
            </div>
          </div>

          <div className="tactics-display-item">
            <div className="tactics-display-label">
              <i className="fas fa-crosshairs"></i> Target Priority
            </div>
            <div className="tactics-display-value">
              {formatTacticValue(tactics.targetPriority)}
            </div>
          </div>

          <div className="tactics-display-item">
            <div className="tactics-display-label">
              <i className="fas fa-magic"></i> Ability Usage
            </div>
            <div className="tactics-display-value">
              {formatTacticValue(tactics.abilityUsage)}
            </div>
          </div>

          <div className="tactics-display-item">
            <div className="tactics-display-label">
              <i className="fas fa-running"></i> Retreat Threshold
            </div>
            <div className="tactics-display-value">
              {tactics.retreatThreshold}% HP
            </div>
          </div>

          {tactics.notes && (
            <div className="tactics-display-item full-width">
              <div className="tactics-display-label">
                <i className="fas fa-sticky-note"></i> Tactical Notes
              </div>
              <div className="tactics-display-notes">
                {tactics.notes}
              </div>
            </div>
          )}
        </div>

        {/* Ability Priority Reference */}
        {creature.abilities && creature.abilities.length > 0 && (
          <div className="tactics-ability-priority-section">
            <h4 className="tactics-subsection-title">
              <i className="fas fa-dice-d20"></i> Ability Priority Ranges
            </h4>
            <div className="tactics-ability-priority-list">
              {creature.abilities.map((ability, idx) => {
                const priorityRange = ability.priorityRange || { min: 1, max: 20 };
                return (
                  <div key={idx} className="tactics-ability-priority-item">
                    <div className="tactics-ability-name">
                      <img 
                        src={getAbilityIconUrlLocal(ability.icon)} 
                        alt={ability.name} 
                        className="tactics-ability-icon"
                        onError={(e) => handleImageError(e, 'Utility/Utility')}
                      />
                      <span>{ability.name || 'Unnamed Ability'}</span>
                    </div>
                    <div className="tactics-ability-range">
                      <span className="tactics-range-badge">{priorityRange.min}-{priorityRange.max}</span>
                      <span className="tactics-range-hint">Roll {priorityRange.min}-{priorityRange.max} to use</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render the type-aware Summon inspection panel for summoned creatures.
  // Layout adapts to the summon family (totem / beast / fiend / undead /
  // elemental / construct / companion) using _summonMeta + creature data.
  const renderSummonSection = () => {
    const meta = creature._summonMeta || {};
    const type = (creature.type || '').toLowerCase();
    const isStationary = (creature.stats?.speed || 0) === 0;

    // Resolve the summon family/category. Templates set `category`; otherwise
    // derive it (a speed-0 CONSTRUCT is treated as a totem).
    const category = meta.category || (
      type === 'construct'
        ? (isStationary ? 'totem' : 'construct')
        : (type || 'summon')
    );

    const CATEGORY_INFO = {
      totem: { label: 'Totem', accent: '#4ade80', blurb: 'A stationary pillar that radiates its effect in an aura each turn.' },
      beast: { label: 'Beast', accent: '#8B4513', blurb: 'A mobile creature that fights at your command.' },
      fiend: { label: 'Fiend', accent: '#8B0000', blurb: 'A bound otherworldly creature under your command.' },
      undead: { label: 'Undead', accent: '#4B0082', blurb: 'A risen servant bound to your will.' },
      elemental: { label: 'Elemental', accent: '#20B2AA', blurb: 'A manifested force of nature.' },
      construct: { label: 'Construct', accent: '#708090', blurb: 'A built engine of war.' },
      companion: { label: 'Companion', accent: '#22c55e', blurb: 'A loyal ally bonded to you.' },
    };
    const cat = CATEGORY_INFO[category] || { label: (category || type || 'summon').toUpperCase(), accent: '#7a3b2e', blurb: '' };

    const controlType = meta.controlType || 'autonomous';
    const CONTROL_INFO = {
      mental: { label: 'Mental Command', desc: 'You directly control its movement and actions each turn.' },
      autonomous: { label: 'Autonomous', desc: 'Acts on its own each turn following its tactics.' },
      verbal: { label: 'Verbal Command', desc: 'Controlled by spoken command within range.' },
      empathic: { label: 'Empathic Bond', desc: 'Linked to you emotionally; acts on shared intent.' },
    };
    const control = CONTROL_INFO[controlType] || { label: controlType, desc: '' };

    const duration = meta.duration || { value: 0, unit: 'permanent' };
    const isPermanent = duration.unit === 'permanent';
    const roundsRemaining = meta.roundsRemaining;
    const durationText = isPermanent
      ? 'Permanent'
      : duration.unit === 'rounds'
        ? `${roundsRemaining != null ? roundsRemaining : duration.value} rounds remaining`
        : `${duration.value} ${duration.unit}`;

    const auraRadius = meta.auraRadius;
    const abilities = creature.abilities || [];

    const maxHp = creature.stats?.maxHp || 0;
    const curHp = token?.state?.currentHp != null ? token.state.currentHp : maxHp;

    const propCard = (label, value, sub) => (
      <div key={label} style={{
        background: 'rgba(240, 230, 210, 0.6)',
        border: '1px solid rgba(160, 140, 112, 0.5)',
        borderRadius: '6px',
        padding: '8px 10px',
        minWidth: '120px',
        flex: '1 1 140px',
      }}>
        <div style={{ fontSize: '12px', color: '#5a3a20', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: '600' }}>{label}</div>
        <div style={{ fontSize: '16px', color: '#2a1a0a', fontWeight: 'bold', marginTop: '2px' }}>{value}</div>
        {sub && <div style={{ fontSize: '12px', color: '#3a2a1a', marginTop: '2px', lineHeight: '1.3' }}>{sub}</div>}
      </div>
    );

    const propCards = [
      ...(maxHp > 0 ? [propCard('Health', token ? `${curHp} / ${maxHp}` : `${maxHp}`, 'Hit points')] : []),
      propCard('Control', control.label, control.desc),
      propCard('Duration', durationText, isPermanent ? 'Lasts until dismissed' : 'Counts down each round'),
    ];
    if (meta.ownerName) propCards.push(propCard('Summoner', meta.ownerName, 'Owns this summon'));
    if (meta.concentration) propCards.push(propCard('Concentration', 'Required', 'Breaks if you lose concentration'));
    if (auraRadius) propCards.push(propCard('Aura', `${auraRadius} ft`, 'Effect radiates from this point'));
    if (isStationary) propCards.push(propCard('Mobility', 'Stationary', 'Cannot move from its placement'));
    if (creature.stats?.speed > 0) propCards.push(propCard('Speed', `${creature.stats.speed} ft`, 'Movement per turn'));
    if (meta.spellId) propCards.push(propCard('Source', meta.templateName || meta.spellId, `Spell id: ${meta.spellId}`));

    return (
      <div className="creature-inspect-section summon-inspect-section">
        {/* Summoned banner */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '10px',
          padding: '8px 12px', marginBottom: '12px',
          background: `linear-gradient(135deg, ${cat.accent}22, rgba(240,230,210,0.6))`,
          border: `1px solid ${cat.accent}`,
          borderRadius: '8px',
        }}>
          <span style={{
            fontSize: '11px', fontWeight: 'bold', letterSpacing: '1px',
            color: '#fff', background: cat.accent,
            padding: '3px 8px', borderRadius: '4px', textTransform: 'uppercase',
          }}>
            Summoned {cat.label}
          </span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '18px', color: '#2a1a0a', fontWeight: 'bold', fontFamily: "'Bookman Old Style', serif" }}>
              {creature.name}
            </div>
            {cat.blurb && <div style={{ fontSize: '13px', color: '#3a2a1a', fontStyle: 'italic' }}>{cat.blurb}</div>}
          </div>
        </div>

        {/* Property grid */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '14px' }}>
          {propCards}
        </div>

        {/* Family-specific behavior card */}
        {category === 'totem' ? (
          <div className="summon-family-card" style={{
            background: 'rgba(74, 222, 128, 0.08)', border: '1px solid rgba(74,222,128,0.4)',
            borderRadius: '8px', padding: '10px 12px', marginBottom: '14px',
          }}>
            <h4 style={{ margin: '0 0 6px', fontSize: '15px', color: '#1f7a44' }}>
              <i className="fas fa-broadcast-tower" style={{ marginRight: '6px' }}></i>
              Aura & Zone
            </h4>
            <div style={{ fontSize: '14px', color: '#2a1a0a', lineHeight: '1.5' }}>
              This totem is <b>stationary</b> and radiates its effect{auraRadius ? ` in a <b>${auraRadius} ft</b> radius` : ''} each turn.
              It cannot be moved once placed. {controlType === 'autonomous' && 'It acts automatically with no command needed.'}
            </div>
          </div>
        ) : (
          <div className="summon-family-card" style={{
            background: 'rgba(160, 140, 112, 0.08)', border: '1px solid rgba(160, 140, 112, 0.4)',
            borderRadius: '8px', padding: '10px 12px', marginBottom: '14px',
          }}>
            <h4 style={{ margin: '0 0 6px', fontSize: '15px', color: '#4a2010' }}>
              <i className="fas fa-paw" style={{ marginRight: '6px' }}></i>
              Command & Combat
            </h4>
            <div style={{ fontSize: '14px', color: '#2a1a0a', lineHeight: '1.5' }}>
              {control.desc} {isStationary ? 'It is stationary.' : `It can move up to <b>${creature.stats?.speed} ft</b> per turn.`}
              {meta.concentration && ' Its presence requires your concentration.'}
            </div>
          </div>
        )}

        {/* Abilities / Effects */}
        {abilities.length > 0 && (
          <div style={{ marginTop: '4px' }}>
            <h4 style={{ margin: '0 0 8px', fontSize: '15px', color: '#4a2010', fontFamily: "'Bookman Old Style', serif" }}>
              <i className="fas fa-bolt" style={{ marginRight: '6px', color: '#d4af37' }}></i>
              Abilities & Effects
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {abilities.map((ability, idx) => {
                const name = typeof ability === 'string' ? ability : (ability.name || 'Ability');
                const desc = typeof ability === 'string' ? '' : (ability.description || '');
                return (
                  <div key={idx} style={{
                    display: 'flex', gap: '8px', alignItems: 'flex-start',
                    background: 'rgba(240, 230, 210, 0.6)',
                    border: '1px solid rgba(160, 140, 112, 0.4)',
                    borderRadius: '6px', padding: '7px 9px',
                  }}>
                    <i className="fas fa-circle" style={{ fontSize: '8px', color: cat.accent, marginTop: '5px' }}></i>
                    <div>
                      <div style={{ fontSize: '14px', color: '#2a1a0a', fontWeight: 'bold' }}>{name}</div>
                      {desc && <div style={{ fontSize: '13px', color: '#3a2a1a', lineHeight: '1.35', marginTop: '1px' }}>{desc}</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div style={{
          marginTop: '14px', padding: '8px 10px', fontSize: '13px',
          color: '#3a2a1a', fontStyle: 'italic', borderTop: '1px solid rgba(160,140,112,0.4)', lineHeight: '1.5',
        }}>
          {creature.description}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case 'summon':
        return renderSummonSection();
      case 'statistics':
        return renderStatsSection();
      case 'abilities':
        return renderAbilitiesSection();
      case 'tactics':
        return renderTacticsSection();
      case 'skills':
        return renderSkillsSection();
      case 'loot':
        return renderLootSection();
      case 'description':
        return renderDescriptionSection();
      default:
        return renderStatsSection();
    }
  };

  // Render the Statistics section - matching character sheet exactly
  const renderStatsSection = () => {
    // Safety check - should not happen due to early return, but just in case
    if (!creature || !creature.stats) {
      return null;
    }
    
    // Get token for condition-based calculations
    const creatureToken = token || tokens.find(t => t.creatureId === creature.id);
    const conditions = creatureToken?.state?.conditions || [];
    const baseSpeed = creature.stats.speed || 30;
    const effectiveSpeed = calculateEffectiveMovementSpeed(baseSpeed, conditions);
    
    // Define stat groups similar to character sheet
    const statGroups = {
      summary: {
        title: 'Combat Summary',
            icon: getCustomIconUrl('Social/Golden Crown', 'abilities'),
        description: 'Quick overview of combat statistics',
        stats: [
          {
            label: 'Health',
            value: token ? `${token.state.currentHp}/${creature.stats.maxHp}` : creature.stats.maxHp,
            baseValue: creature.stats.maxHp,
            tooltip: true,
            icon: getCustomIconUrl('Healing/Red Heart', 'abilities'),
            description: 'Current and maximum hit points'
          },
          {
            label: 'Mana',
            value: token ? `${token.state.currentMana}/${creature.stats.maxMana}` : creature.stats.maxMana,
            baseValue: creature.stats.maxMana,
            tooltip: creature.stats.maxMana > 0,
            icon: getCustomIconUrl('Utility/Glowing Orb', 'abilities'),
            description: 'Current and maximum mana points'
          }
        ].filter(stat => stat.tooltip !== false)
      },
      attributes: {
        title: 'Core Attributes',
        icon: getCustomIconUrl('General/Strength', 'abilities'),
        description: 'Base character attributes',
        stats: [
          {
            label: 'Strength',
            statName: 'strength',
            value: creature.stats.strength || 10,
            tooltip: true,
            modifier: calculateModifier(creature.stats.strength || 10),
            icon: getCustomIconUrl('General/Strength', 'abilities'),
            description: 'Physical power and muscle'
          },
          {
            label: 'Agility',
            statName: 'agility',
            value: creature.stats.agility || 10,
            tooltip: true,
            modifier: calculateModifier(creature.stats.agility || 10),
            icon: getCustomIconUrl('Utility/Speed Dash', 'abilities'),
            description: 'Agility and reflexes'
          },
          {
            label: 'Constitution',
            statName: 'constitution',
            value: creature.stats.constitution || 10,
            tooltip: true,
            modifier: calculateModifier(creature.stats.constitution || 10),
            icon: getCustomIconUrl('Healing/Heart Shield', 'abilities'),
            description: 'Health and stamina'
          },
          {
            label: 'Intelligence',
            statName: 'intelligence',
            value: creature.stats.intelligence || 10,
            tooltip: true,
            modifier: calculateModifier(creature.stats.intelligence || 10),
            icon: getCustomIconUrl('Psychic/Brain Psionics', 'abilities'),
            description: 'Reasoning and memory'
          },
          {
            label: 'Spirit',
            statName: 'spirit',
            value: creature.stats.spirit || 10,
            tooltip: true,
            modifier: calculateModifier(creature.stats.spirit || 10),
            icon: getCustomIconUrl('Radiant/Radiant Aura', 'abilities'),
            description: 'Awareness and insight'
          },
          {
            label: 'Charisma',
            statName: 'charisma',
            value: creature.stats.charisma || 10,
            tooltip: true,
            modifier: calculateModifier(creature.stats.charisma || 10),
            icon: getCustomIconUrl('Radiant/Radiant Aura', 'abilities'),
            description: 'Force of personality'
          }
        ]
      },
      movement: {
        title: 'Movement & Senses',
        icon: getCustomIconUrl('Arcane/Swift Boot', 'abilities'),
        description: 'Movement capabilities and sensory abilities',
        stats: [
          {
            label: 'Movement Speed',
            value: `${effectiveSpeed} ft${effectiveSpeed !== baseSpeed ? ` (base: ${baseSpeed} ft)` : ''}`,
            tooltip: true,
            icon: getCustomIconUrl('Utility/Speed Dash', 'abilities'),
            description: effectiveSpeed !== baseSpeed || movementSpeedBreakdown(baseSpeed, conditions).effects.length
              ? `Effective walking speed in feet per turn: ${movementBreakdownText(movementSpeedBreakdown(baseSpeed, conditions))}`
              : 'Base walking speed in feet per turn'
          },
          {
            label: 'Initiative',
            value: formatModifier(creature.stats.initiative || 0),
            tooltip: true,
            icon: getCustomIconUrl('Utility/Dynamic Lunge', 'abilities'),
            description: 'Combat turn order modifier'
          },
          ...(creature.stats.flying > 0 ? [{
            label: 'Flying Speed',
            value: `${creature.stats.flying} ft`,
            tooltip: true,
            icon: getCustomIconUrl('Piercing/Upward Arrow', 'abilities'),
            description: 'Flying movement speed'
          }] : []),
          ...(creature.stats.swimming > 0 ? [{
            label: 'Swimming Speed',
            value: `${creature.stats.swimming} ft`,
            tooltip: true,
            icon: getAbilityIconUrl('utility/underwater-bubbles'),
            description: 'Swimming movement speed'
          }] : []),
          ...(creature.stats.climbing > 0 ? [{
            label: 'Climbing Speed',
            value: `${creature.stats.climbing} ft`,
            tooltip: true,
            icon: getCustomIconUrl('Utility/Speed Dash', 'abilities'),
            description: 'Climbing movement speed'
          }] : []),
          ...(creature.stats.darkvision > 0 ? [{
            label: 'Darkvision',
            value: `${creature.stats.darkvision} ft`,
            tooltip: true,
            icon: getAbilityIconUrl('utility/close-up-eye'),
            description: 'Dark vision range in feet'
          }] : []),
          ...(creature.stats.tremorsense > 0 ? [{
            label: 'Tremorsense',
            value: `${creature.stats.tremorsense} ft`,
            tooltip: true,
            icon: getCustomIconUrl('Lightning/Lightning Storm', 'abilities'),
            description: 'Vibration sense range in feet'
          }] : []),
          ...(creature.stats.blindsight > 0 ? [{
            label: 'Blindsight',
            value: `${creature.stats.blindsight} ft`,
            tooltip: true,
            icon: getCustomIconUrl('Utility/All Seeing Eye', 'abilities'),
            description: 'Blind sight range in feet'
          }] : []),
          {
            label: 'Passive Perception',
            value: 10 + calculateModifier(creature.stats.spirit || 10),
            tooltip: true,
            icon: getCustomIconUrl('Radiant/Radiant Aura', 'abilities'),
            description: 'Passive awareness of surroundings (10 + Spirit modifier)'
          }
        ].filter(stat => stat.tooltip !== false)
      },
      combat: {
        title: 'Combat Statistics',
        icon: getCustomIconUrl('General/Sword', 'abilities'),
        description: 'Combat capabilities and damage output',
        stats: [
          {
            label: 'Slashing Damage',
            value: Math.round(creature.stats.slashingDamage || creature.stats.damage || Math.floor((creature.stats.strength || 10) / 2) || 0),
            tooltip: true,
            icon: getCustomIconUrl('Slashing/Bloody Meat Cleaver', 'abilities'),
            description: 'Damage with swords, axes, and slashing weapons'
          },
          {
            label: 'Bludgeoning Damage',
            value: Math.round(creature.stats.bludgeoningDamage || creature.stats.damage || Math.floor((creature.stats.strength || 10) / 2) || 0),
            tooltip: true,
            icon: getCustomIconUrl('General/Strength', 'abilities'),
            description: 'Damage with maces, clubs, and bludgeoning weapons'
          },
          {
            label: 'Piercing Damage',
            value: Math.round(creature.stats.piercingDamage || creature.stats.rangedDamage || Math.floor((creature.stats.agility || 10) / 2) || 0),
            tooltip: true,
            icon: getCustomIconUrl('Piercing/Scatter Shot', 'abilities'),
            description: 'Damage with spears, daggers, and piercing weapons'
          },
          {
            label: 'Ranged Damage',
            value: Math.round(creature.stats.rangedDamage || Math.floor((creature.stats.agility || 10) / 2) || 0),
            tooltip: true,
            icon: getCustomIconUrl('Piercing/Bow Arrow', 'abilities'),
            description: 'Damage with bows, crossbows, and thrown weapons'
          }
        ]
      },
      spellpower: {
        title: 'Spell Power',
        icon: getCustomIconUrl('Arcane/Magical Staff', 'abilities'),
        description: 'Magical damage capabilities',
        stats: DAMAGE_TYPES
          .filter(dt => !['smashing', 'stabbing', 'slicing'].includes(dt.id)) // Exclude physical/weapon damage types
          .map(dt => {
            // Map damage type IDs to local ability icons (matching character sheet)
            const iconMap = {
              ember: 'Fire/Burning Ember',
              fire: 'Fire/Burning Ember',
              rime: 'Frost/Dripping Ice',
              cold: 'Frost/Dripping Ice',
              frost: 'Frost/Dripping Ice',
              storm: 'Lightning/Lightning Bolt',
              lightning: 'Lightning/Lightning Bolt',
              thunder: 'Lightning/Lightning Bolt',
              primal: 'Nature/Beast Mark',
              nature: 'Nature/Beast Mark',
              arcane: 'Arcane/Ebon Blaze',
              blight: 'Necrotic/Blood Book',
              necrotic: 'Necrotic/Blood Book',
              sacred: 'Radiant/Radiant Sunburst',
              radiant: 'Radiant/Radiant Sunburst',
              holy: 'Radiant/Radiant Sunburst',
              force: 'Force/Force Touch',
              poison: 'Poison/Poison Venom',
              acid: 'Poison/Poison Venom',
              wyrd: 'Psychic/Psychic Mind',
              psychic: 'Psychic/Psychic Mind',
              chaos: 'Chaos/Chaotic Shuffle',
              void: 'Necrotic/Blood Book',
              healing: 'Healing/Golden Heart'
            };
            const iconPath = iconMap[dt.id ? dt.id.toLowerCase() : ''] || 'Utility/Utility';
            return {
              label: `${dt.name} Power`,
              value: Math.round(creature.stats[`${dt.id}SpellPower`] || creature.stats.spellDamage || 0),
              tooltip: true,
              icon: getCustomIconUrl(iconPath, 'abilities'),
              description: `Spell damage bonus for ${dt.name.toLowerCase()} spells`
            };
          })
      },
      defensive: {
        title: 'Resources',
            icon: getCustomIconUrl('Healing/Red Heart', 'abilities'),
        description: 'Vital resources and survivability',
        stats: [
          {
            label: 'Max Health',
            value: Math.round(creature.stats.maxHp || creature.stats.hitPoints || 0),
            tooltip: true,
            icon: getCustomIconUrl('Healing/Red Heart', 'abilities'),
            description: 'Maximum hit points'
          },
          {
            label: 'Max Mana',
            value: Math.round(creature.stats.maxMana || creature.stats.manaPoints || 0),
            tooltip: true,
            icon: getCustomIconUrl('Utility/Glowing Orb', 'abilities'),
            description: 'Maximum mana points'
          },
          {
            label: 'Max Action Points',
            value: Math.round(creature.stats.maxActionPoints || creature.stats.actionPoints || 0),
            tooltip: true,
            icon: getCustomIconUrl('General/Sword', 'abilities'),
            description: 'Maximum action points per turn'
          }
        ]
      },
      regeneration: {
        title: 'Regeneration & Healing',
        icon: getCustomIconUrl('Healing/Golden Heart', 'abilities'),
        description: 'Recovery and healing capabilities',
        stats: [
          {
            label: 'Health Regeneration',
            value: Math.round(creature.stats.healthRegen || Math.floor((creature.stats.constitution || 10) / 2) || 0),
            tooltip: true,
            icon: getCustomIconUrl('Healing/Golden Heart', 'abilities'),
            description: 'Health recovered per turn'
          },
          {
            label: 'Mana Regeneration',
            value: Math.round(creature.stats.manaRegen || Math.floor(((creature.stats.intelligence || 10) + (creature.stats.spirit || 10)) / 4) || 0),
            tooltip: true,
            icon: getCustomIconUrl('Arcane/Orb Manipulation', 'abilities'),
            description: 'Mana recovered per turn'
          },
          {
            label: 'Healing Power',
            value: Math.round(creature.stats.healingPower || Math.floor((creature.stats.spirit || 10) / 2) || 0),
            tooltip: true,
            icon: getCustomIconUrl('Healing/Armored Healing', 'abilities'),
            description: 'Bonus to healing spells and abilities'
          }
        ]
      },
      utility: {
        title: 'Utility & Senses',
        icon: getCustomIconUrl('Utility/All Seeing Eye', 'abilities'),
        description: 'Sensory and utility capabilities',
        stats: [
          {
            label: 'Vision Range',
            value: `${Math.round(creature.stats.visionRange || 60)} ft`,
            tooltip: true,
            icon: getCustomIconUrl('Radiant/Radiant Aura', 'abilities'),
            description: 'Normal vision range in feet'
          },
          {
            label: 'Initiative',
            value: formatModifier(creature.stats.initiative || Math.floor((creature.stats.agility || 10) / 5) || 0),
            tooltip: true,
            icon: getCustomIconUrl('Utility/Dynamic Lunge', 'abilities'),
            description: 'Initiative bonus for combat order'
          }
        ]
      },
      resistances: {
        title: 'Damage Resistances',
        icon: getCustomIconUrl('Utility/Barred Shield', 'abilities'),
        description: 'Resistance to different damage types',
        stats: [] // Will be populated with resistance data
      },
      savingThrows: {
        title: 'Saving Throws',
        icon: getCustomIconUrl('Utility/Bound Shield', 'abilities'),
        description: 'Proficiency in saving throws',
        stats: [] // Will be populated with saving throw data
      },
      immunities: {
        title: 'Damage Immunities',
        icon: getCustomIconUrl('Utility/Deflecting Shield', 'abilities'),
        description: 'Damage types the creature is completely immune to',
        stats: [] // Will be populated with immunity data
      },
      conditions: {
        title: 'Condition Resistances',
        icon: getCustomIconUrl('Arcane/Magical Cross Emblem 2', 'abilities'),
        description: 'Resistance to various conditions and status effects',
        stats: [] // Will be populated with condition resistance data
      }
    };

    // Process resistances and vulnerabilities into stats format
    const processResistanceStats = () => {
      const resistanceStats = [];

      // Safely get resistances and vulnerabilities
      const resistances = creature.resistances || {};
      const vulnerabilities = creature.vulnerabilities || {};
      const allResistances = { ...resistances, ...vulnerabilities };

      // Get all damage types that have resistances/vulnerabilities
      Object.entries(allResistances).forEach(([rawTypeId, level]) => {
        try {
          // Saved creature data may still carry legacy ids (cold, fire, ...)
          const damageTypeId = normalizeDamageType(rawTypeId);
          const damageType = DAMAGE_TYPES.find(dt => dt.id === damageTypeId);

          // Ensure level is a string and not empty/none
          const levelStr = level != null ? String(level).toLowerCase() : '';
          if (damageType && levelStr && levelStr !== 'none' && levelStr !== 'null' && levelStr !== 'undefined' && levelStr !== '') {
          const getResistanceValue = (levelStr) => {
            switch (levelStr.toLowerCase()) {
              case 'immune': return 'Immune';
              case 'resistant': return 'Resistant (-50%)';
              case 'exposed': return 'Exposed (+50%)';
              case 'vulnerable': return 'Vulnerable (+100%)';
              case 'guarded': return 'Guarded (-25%)';
              case 'susceptible': return 'Susceptible (+25%)';
              default: return 'Normal';
            }
          };

          const getResistanceColor = (levelStr) => {
            switch (levelStr.toLowerCase()) {
              case 'immune': return '#506e30';
              case 'resistant': return '#4a6a8a';
              case 'guarded': return '#3a8a8a';
              case 'exposed': return '#9a5e15';
              case 'susceptible': return '#8b3a2a';
              case 'vulnerable': return '#8b3a2a';
              default: return '#8b7d6b';
            }
          };

          const getDamageTypeIcon = (damageTypeId) => {
            // Use ability icons for damage types
            const abilityIconMap = {
              smashing: 'Bludgeoning/Hammer',
              stabbing: 'Piercing/Piercing Shot',
              slicing: 'Slashing/Bloody Meat Cleaver',
              ember: 'Fire/Flame Burst',
              rime: 'Frost/Dripping Ice',
              storm: 'Lightning/Lightning Bolt',
              primal: 'Nature/Nature Natural',
              arcane: 'Arcane/Orb Manipulation',
              blight: 'Necrotic/Necrotic Skull',
              wyrd: 'Psychic/Brain Psionics',
              sacred: 'Radiant/Radiant Sunburst',
              healing: 'Healing/Golden Heart',
              fire: 'Fire/Flame Burst',
              frost: 'Frost/Dripping Ice',
              cold: 'Frost/Dripping Ice',
              nature: 'Nature/Nature Natural',
              shadow: 'Shadow/Shadow Darkness',
              holy: 'Radiant/Radiant Sunburst',
              physical: 'Bludgeoning/Hammer',
              bludgeoning: 'Bludgeoning/Hammer',
              piercing: 'Piercing/Piercing Shot',
              slashing: 'Slashing/Bloody Meat Cleaver',
              poison: 'Poison/Poison Venom',
              acid: 'Force/Force Touch',
              lightning: 'Lightning/Lightning Bolt',
              thunder: 'Lightning/Lightning Storm',
              radiant: 'Radiant/Radiant Sunburst',
              necrotic: 'Necrotic/Necrotic Skull',
              psychic: 'Psychic/Brain Psionics',
              force: 'Force/Force Touch',
              ranged: 'Piercing/Piercing Shot'
            };
            return getCustomIconUrl(abilityIconMap[damageTypeId] || 'Utility/Utility', 'abilities');
          };

            resistanceStats.push({
              label: damageType.name,
              value: getResistanceValue(levelStr),
              tooltip: true,
              icon: getDamageTypeIcon(damageTypeId),
              description: `${levelStr.charAt(0).toUpperCase() + levelStr.slice(1)} to ${damageType.name.toLowerCase()} damage`,
              resistanceLevel: levelStr,
              damageType: damageType
            });
          }
        } catch (error) {
          console.warn('Error processing resistance for', rawTypeId, ':', error);
        }
      });

      return resistanceStats;
    };

    // Add resistance stats to the resistances group
    statGroups.resistances.stats = processResistanceStats();

    // Process saving throws into stats format
    const processSavingThrowStats = () => {
      const savingThrowStats = [];

      if (creature.stats.savingThrows && Object.keys(creature.stats.savingThrows).length > 0) {
        ['strength', 'agility', 'constitution', 'intelligence', 'spirit', 'charisma'].forEach(ability => {
          const abilityScore = creature.stats[ability] || 10;
          const modifier = calculateModifier(abilityScore);
          const isProficient = creature.stats.savingThrows && creature.stats.savingThrows[ability];
          const profBonus = creature.stats.proficiencyBonus || 2;
          const totalBonus = isProficient ? modifier + profBonus : modifier;

          if (isProficient) { // Only show proficient saves
            const getAbilityIcon = (ability) => {
              const iconMap = {
                strength: 'General/Strength',
                agility: 'Piercing/Scatter Shot',
                constitution: 'Healing/Heart Shield',
                intelligence: 'Psychic/Brain Psionics',
                spirit: 'Radiant/Radiant Aura',
                charisma: 'Radiant/Radiant Aura'
              };
              return getCustomIconUrl(iconMap[ability] || 'Utility/Utility', 'abilities');
            };

            savingThrowStats.push({
              label: `${ability.charAt(0).toUpperCase() + ability.slice(1)} Save`,
              value: formatModifier(totalBonus),
              tooltip: true,
              icon: getAbilityIcon(ability),
              description: `Proficient saving throw (${formatModifier(modifier)} ability + ${profBonus} proficiency)`,
              statName: ability,
              baseValue: modifier
            });
          }
        });
      }

      return savingThrowStats;
    };

    // Add saving throw stats to the saving throws group
    statGroups.savingThrows.stats = processSavingThrowStats();

    // Process immunities into stats format
    const processImmunityStats = () => {
      const immunityStats = [];

      // Map damage type IDs to local ability icons (matching character sheet)
      const getDamageTypeIcon = (damageTypeId) => {
        const iconMap = {
          smashing: 'Bludgeoning/Hammer',
          stabbing: 'Piercing/Piercing Thrust 3',
          slicing: 'Slashing/Slashing Slash',
          bludgeoning: 'Bludgeoning/Hammer',
          piercing: 'Piercing/Piercing Thrust 3',
          slashing: 'Slashing/Slashing Slash',
          ranged: 'Piercing/Piercing Thrust 3',
          meleeweapon: 'Slashing/Crossed Swords',
          physical: 'Bludgeoning/Hammer',
          ember: 'Fire/Burning Ember',
          fire: 'Fire/Burning Ember',
          rime: 'Frost/Dripping Ice',
          cold: 'Frost/Dripping Ice',
          frost: 'Frost/Dripping Ice',
          storm: 'Lightning/Lightning Bolt',
          lightning: 'Lightning/Lightning Bolt',
          thunder: 'Lightning/Lightning Bolt',
          primal: 'Nature/Beast Mark',
          nature: 'Nature/Beast Mark',
          arcane: 'Arcane/Ebon Blaze',
          blight: 'Necrotic/Blood Book',
          necrotic: 'Necrotic/Blood Book',
          shadow: 'Necrotic/Blood Book',
          poison: 'Poison/Poison Venom',
          acid: 'Poison/Poison Venom',
          wyrd: 'Psychic/Psychic Mind',
          psychic: 'Psychic/Psychic Mind',
          chaos: 'Chaos/Chaotic Shuffle',
          sacred: 'Radiant/Radiant Sunburst',
          radiant: 'Radiant/Radiant Sunburst',
          holy: 'Radiant/Radiant Sunburst',
          force: 'Force/Force Touch',
          healing: 'Healing/Golden Heart'
        };
        const key = damageTypeId ? damageTypeId.toLowerCase() : '';
        return getCustomIconUrl(iconMap[key] || 'Utility/Utility', 'abilities');
      };

      if (creature.immunities && creature.immunities.length > 0) {
        creature.immunities.forEach(rawImmunity => {
          try {
            const immunity = normalizeDamageType(typeof rawImmunity === 'string' ? rawImmunity : rawImmunity?.id || '');
            const damageType = DAMAGE_TYPES.find(dt => dt.id === immunity || dt.name.toLowerCase() === immunity.toLowerCase());

            if (damageType) {
              immunityStats.push({
                label: damageType.name,
                value: 'Immune',
                tooltip: true,
                icon: getDamageTypeIcon(damageType.id),
                description: `Completely immune to ${damageType.name.toLowerCase()} damage`,
                immunityType: immunity,
                damageType: damageType
              });
            }
          } catch (error) {
            console.warn('Error processing immunity for', rawImmunity, ':', error);
          }
        });
      }

      return immunityStats;
    };

    // Process condition resistances into stats format
    const processConditionStats = () => {
      const conditionStats = [];

      if (creature.conditionResistances && creature.conditionResistances.length > 0) {
        creature.conditionResistances.forEach(condition => {
          try {
            // Map condition names to appropriate icons
            const conditionIconMap = {
              fear: getCustomIconUrl('Fire/Fiery Skull', 'abilities'),
              charm: getCustomIconUrl('Psychic/Hypnotic Eye', 'abilities'),
              stun: getCustomIconUrl('Utility/Stun', 'abilities'),
              paralyze: getCustomIconUrl('Lightning/Lightning Bolt', 'abilities'),
              poison: getCustomIconUrl('Poison/Poison Venom', 'abilities'),
              disease: getCustomIconUrl('Necrotic/Decayed Skull', 'abilities'),
              sleep: getCustomIconUrl('Utility/Sleep', 'abilities'),
              petrify: getCustomIconUrl('Necrotic/Shattering Crystal', 'abilities'),
              blinded: getCustomIconUrl('Utility/Bloodshot Eye', 'abilities'),
              deafened: getCustomIconUrl('Lightning/Lightning Storm', 'abilities'),
              prone: getCustomIconUrl('Utility/Dynamic Lunge', 'abilities')
            };

            const icon = conditionIconMap[condition.toLowerCase()] || getCustomIconUrl('Utility/Golden Shield', 'abilities');

            conditionStats.push({
              label: condition.charAt(0).toUpperCase() + condition.slice(1),
              value: 'Resistant',
              tooltip: true,
              icon: icon,
              description: `Resistant to the ${condition} condition`,
              conditionType: condition
            });
          } catch (error) {
            console.warn('Error processing condition resistance for', condition, ':', error);
          }
        });
      }

      return conditionStats;
    };

    // Add immunity and condition stats to their respective groups
    statGroups.immunities.stats = processImmunityStats();
    statGroups.conditions.stats = processConditionStats();

    const renderStatBlock = () => {
      const currentGroup = statGroups[selectedStatGroup];

      return (
        <div className="stats-content">
          {currentGroup.stats.map((stat, index) => (
            <div key={index} className="stat-row enhanced-stat-row">
              {/* Apply same layout to all stats: icon/label on left, value on right, description footer */}
              <>
                <div className="level-experience-top-row">
                  <div className="stat-label-container">
                    {stat.icon && (
                      <img
                        src={stat.icon}
                        alt={stat.label}
                        className="stat-icon"
                        style={stat.color ? { borderColor: stat.color } : {}}
                        onError={(e) => handleImageError(e, 'Utility/Utility')}
                      />
                    )}
                    <div className="stat-info">
                      <span className="stat-label">{stat.label}:</span>
                    </div>
                  </div>
                  <div className="stat-value-container">
                    <span className="stat-value">
                      {stat.value}
                    </span>
                    {stat.modifier !== undefined && (
                      <span className="stat-modifier">
                        ({stat.modifier >= 0 ? '+' : ''}{stat.modifier})
                      </span>
                    )}
                  </div>
                </div>
                {stat.description && (
                  <div className="stat-description-footer">
                    <span className="stat-description">{stat.description}</span>
                  </div>
                )}
              </>
              {stat.tooltip && (
                <div
                  className="tooltip-trigger"
                  onMouseEnter={(e) => handleStatHover(e, stat.label)}
                  onMouseMove={updateStatTooltipPosition}
                  onMouseLeave={handleStatLeave}
                />
              )}
              {hoveredStat === stat.label && (
                <TooltipPortal>
                  <div
                    className="equipment-slot-tooltip"
                    style={{
                      position: 'fixed',
                      left: statTooltipPosition.x,
                      top: statTooltipPosition.y,
                      transform: 'translate(10px, -50%)',
                      pointerEvents: 'none',
                      zIndex: 2147483647 // Maximum z-index to ensure tooltips always appear above windows
                    }}
                  >
                    {stat.resistanceLevel ? (
                      <ResistanceTooltip
                        damageType={stat.damageType.name}
                        resistanceLevel={stat.resistanceLevel}
                        value={stat.value}
                      />
                    ) : isBaseStat(stat.label.toLowerCase()) ? (
                      <StatTooltip
                        stat={stat.statName}
                        value={stat.value}
                        components={getStatComponents(stat.statName)}
                      />
                    ) : (
                      <GeneralStatTooltip
                        stat={stat.label}
                        value={stat.value}
                        baseValue={stat.baseValue || stat.value}
                        description={stat.description}
                      />
                    )}
                  </div>
                </TooltipPortal>
              )}
            </div>
          ))}
        </div>
      );
    };

    return (
      <div className="stats-container creature-stats">
        {/* Content area showing selected stat group */}
        <div className="stats-content-area">
          <div className="stats-section-header">
            <div className="stats-header-icon-box">
              <img
                src={statGroups[selectedStatGroup]?.icon}
                alt=""
                className="stats-section-icon"
                onError={(e) => handleImageError(e, 'Utility/Utility')}
              />
            </div>
            <div className="stats-header-text">
              <h2 className="stats-section-title">{statGroups[selectedStatGroup]?.title}</h2>
              {statGroups[selectedStatGroup]?.description && (
                <span className="stats-section-subtitle">{statGroups[selectedStatGroup]?.description}</span>
              )}
            </div>
          </div>

          <div className="stats-fields">
            {renderStatBlock()}
          </div>
        </div>
      </div>
    );
  };

  // Get current rollable table for skill based on rank and selected die
  const getCurrentRollableTable = (skill, skillId) => {
    const rank = getSkillRank(skillId);
    if (skill.rollableTables) {
      const rankTables = skill.rollableTables[rank.key] || skill.rollableTables.UNTRAINED;
      if (typeof rankTables === 'object' && rankTables[selectedDie]) {
        const tableId = rankTables[selectedDie];
        if (!ROLLABLE_TABLES[tableId]) {
          return null;
        }
        return tableId;
      }
      return rankTables;
    }
    return skill.rollableTable;
  };
  // Roll on a skill table
  const rollSkillTable = (skill, skillId, throwPower = 1.0, throwDirection = { x: 0, z: 0 }) => {
    const tableId = getCurrentRollableTable(skill, skillId);
    if (!tableId) return;

    const diceStore = useDiceStore.getState();
    diceStore.clearSelectedDice();
    diceStore.addDice(selectedDie, 1);
    diceStore.startRoll({
      type: 'skill',
      skillId,
      skillName: skill.name,
      rollType: 'table',
      tableId,
      dieKey: selectedDie,
      characterName: creature?.name || 'Creature',
      throwPower,
      throwDirection
    });
  };

  // Toggle category collapse state
  const toggleCategory = (categoryName) => {
    setCollapsedCategories(prev => ({
      ...prev,
      [categoryName]: !prev[categoryName]
    }));
  };

  // Render skill detail view (without quests)
  const renderSkillDetail = () => {
    if (!selectedSkill) {
      return (
        <div className="no-skill-selected">
          <img 
            src={getIconUrl('Misc/Profession Resources/Gems/resource-block-purple-spotted-beige-face', 'items')}
            alt="Dice"
            className="dice-icon"
            style={{ width: '48px', height: '48px', marginBottom: '20px' }}
          />
          <p>Select a skill from the list to view details</p>
        </div>
      );
    }

    const skill = SKILL_DEFINITIONS[selectedSkill];
    if (!skill) return null;

    const rank = getSkillRank(selectedSkill);
    const modifier = calculateSkillModifier(skill, selectedSkill);

    // Check if skill has rollable tables
    const rankTables = skill.rollableTables?.[rank.key] || skill.rollableTables?.UNTRAINED;
    const hasMultiDieTables = rankTables && typeof rankTables === 'object' && rankTables.d4;
    const currentTableId = getCurrentRollableTable(skill, selectedSkill);
    const currentTable = currentTableId ? ROLLABLE_TABLES[currentTableId] : null;

    return (
      <div className="skill-detail-view">
        <div className="skill-detail-header">
          <img 
            src={getSkillIconUrl(skill.icon, selectedSkill)} 
            alt={skill.name} 
            className="skill-detail-icon"
            onError={(e) => {
              handleImageError(e, 'Utility/Utility');
            }}
          />
          <div className="skill-detail-title-section">
            <h2 className="skill-detail-name" style={{ color: rank.color }}>
              {skill.name}
            </h2>
            <p className="skill-detail-description">{skill.description}</p>
            <div className="skill-detail-stats">
              <span className="skill-rank">{rank.name}</span>
              <span className="skill-modifier">+{modifier}</span>
              <span className="skill-primary-stat">
                {skill.primaryStat.charAt(0).toUpperCase() + skill.primaryStat.slice(1)}
              </span>
            </div>
          </div>
          {(skill.rollableTable || skill.rollableTables) && (
            <ChargeableRollButton
              className="roll-table-btn"
              onRoll={(power, dir) => rollSkillTable(skill, selectedSkill, power, dir)}
              title="Click or Hold & Release to throw dice with velocity"
            >
              <i className="fas fa-dice"></i> Roll
            </ChargeableRollButton>
          )}
        </div>

        {currentTable && (
          <div className="table-section">
            {hasMultiDieTables && (
              <div className="die-selector-section">
                <h4>Difficulty (Die Type)</h4>
                <div className="die-selector-strip">
                  {['d4', 'd6', 'd8', 'd10', 'd12', 'd20'].map(die => (
                    <div
                      key={die}
                      className={`die-selector-icon ${selectedDie === die ? 'selected' : ''}`}
                      onClick={() => setSelectedDie(die)}
                      title={`${die.toUpperCase()} - ${
                        die === 'd4' ? 'Very Easy' :
                        die === 'd6' ? 'Easy' :
                        die === 'd8' ? 'Moderate' :
                        die === 'd10' ? 'Challenging' :
                        die === 'd12' ? 'Difficult' :
                        'Very Difficult'
                      }`}
                    >
                      <span className="die-number">{die.substring(1)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <h3>Rollable Table ({rank.name}): {currentTable.name}</h3>
            <p>{currentTable.description}</p>
            <div className="table-entries">
              {currentTable.table.map((entry, index) => (
                <div key={index} className={`table-entry ${entry.type}`}>
                  <span className="roll-range">
                    {entry.roll[0] === entry.roll[1]
                      ? entry.roll[0]
                      : `${entry.roll[0]}-${entry.roll[1]}`}
                  </span>
                  <span className="roll-result">{entry.result}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render the Skills section
  const renderSkillsSection = () => {
    const knownSkills = getCreatureSkills();
    
    if (knownSkills.length === 0) {
      return (
        <div className="skills-container">
          <div className="no-skill-selected">
            <img 
              src={getIconUrl('Misc/Profession Resources/Gems/resource-block-purple-spotted-beige-face', 'items')}
              alt="Dice"
              className="dice-icon"
              style={{ width: '48px', height: '48px', marginBottom: '20px' }}
            />
            <p>This creature has no skills.</p>
          </div>
        </div>
      );
    }

    return (
      <div className="skills-container">
        <div className="skills-sidebar">
          {Object.entries(creatureSkills).map(([categoryName, skills]) => {
            const categoryData = Object.values(SKILL_CATEGORIES || {}).find(cat => cat.name === categoryName);
            const isCollapsed = collapsedCategories[categoryName];

            // Map skill categories to gem icons for the right side
            const getCategoryGemIcon = (categoryName) => {
              const gemMap = {
                'Combat Mastery': 'Misc/Profession Resources/Gems/resource-orange-red-diamond-gem-fiery-glow',
                'Exploration & Survival': 'Misc/Profession Resources/Gems/resource-green-faceted-gem-crystal',
                'Social & Influence': 'Misc/Profession Resources/Gems/resource-golden-orange-diamond-crystal-ore',
                'Arcane Studies': 'Misc/Profession Resources/Gems/resource-purple-gem-crystal-shiny'
              };
              return gemMap[categoryName] || 'Misc/Profession Resources/Gems/resource-block-purple-spotted-beige-face';
            };

            return (
              <div key={categoryName} className="skill-category-section">
                <div
                  className="skill-category-header"
                  onClick={() => toggleCategory(categoryName)}
                  style={{ cursor: 'pointer' }}
                >
                  <img 
                    src={categoryData?.icon} 
                    alt="" 
                    className="skill-category-icon"
                    onError={(e) => handleImageError(e, 'Utility/Utility')}
                  />
                  <span className="skill-category-name">{categoryName}</span>
                  <img 
                    src={getIconUrl(getCategoryGemIcon(categoryName), 'items')} 
                    alt="" 
                    className="category-toggle-icon"
                    style={{ width: '16px', height: '16px', marginLeft: 'auto' }}
                    onError={(e) => {
                      e.target.src = getIconUrl('Misc/Profession Resources/Gems/resource-block-purple-spotted-beige-face', 'items');
                    }}
                  />
                </div>
                {!isCollapsed && (
                  <div className="skill-list">
                    {skills.map(skill => {
                      const rank = getSkillRank(skill.id);
                      const isSelected = selectedSkill === skill.id;

                      return (
                        <div
                          key={skill.id}
                          className={`skill-list-item ${isSelected ? 'selected' : ''}`}
                          onClick={() => setSelectedSkill(skill.id)}
                        >
                          <div className="skill-list-name" style={{ color: rank.color }}>
                            {skill.name} <span className="skill-rank-label">({rank.name})</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="skills-content">
          {renderSkillDetail()}
        </div>
      </div>
    );
  };



  // Helper function to check if an ability is a spell
  const isSpellAbility = (ability) => {
    return ability.type === 'spell' ||
           ability.spellData ||
           (ability.school && ability.level !== undefined);
  };

  // NOTE: Removed duplicate SimpleSpellCard component - now using UnifiedSpellCard for consistency

  // Render the Abilities section
  const renderAbilitiesSection = () => {
    if (!Array.isArray(creature.abilities) || creature.abilities.length === 0) {
      return (
        <div className="creature-inspect-section empty-section">
          <p>This creature has no abilities.</p>
        </div>
      );
    }

    // Combine spells and abilities into one unified list, preserving original order
    const allPowers = creature.abilities.filter(a => a && typeof a === 'object' && !Array.isArray(a));
    if (!allPowers.length) return <p role="status">Unsupported/manual legacy ability entries are preserved; inspect the original definition with the GM.</p>;
    const currentPower = allPowers[selectedAbilityIndex] || allPowers[0];
    const currentIndex = allPowers[selectedAbilityIndex] ? selectedAbilityIndex : 0;
    const currentIcon = currentPower ? resolveCreatureAbilityIcon(currentPower, currentIndex) : null;
    const currentSpell = currentPower ? transformAbilityToSpell({
      ...currentPower,
      icon: currentPower.icon && !PLACEHOLDER_ABILITY_ICONS.has(currentPower.icon) ? currentPower.icon : currentIcon
    }) : null;

    return (
      <div className="creature-abilities-inspect-panel">
        {/* Ability selector bar */}
        <div className="ability-selector-bar">
          <div className="ability-icon-strip" role="tablist" aria-label="Creature abilities">
            {allPowers.map((power, idx) => {
              const iconPath = resolveCreatureAbilityIcon(power, idx);
              const isSelected = selectedAbilityIndex === idx;
              return (
                <button
                  key={idx}
                  role="tab"
                  aria-selected={isSelected}
                  className={`ability-icon-btn ${isSelected ? 'selected' : ''}`}
                  onClick={() => setSelectedAbilityIndex(idx)}
                  title={power.name}
                >
                  <img 
                    src={getAbilityIconUrlLocal(iconPath)} 
                    alt={power.name}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = getAbilityIconUrl('utility/question-mark');
                    }}
                  />
                </button>
              );
            })}
          </div>
          {currentPower && (
            <div className="selected-ability-meta">
              <span className="selected-ability-label">Ability:</span>
              <span className="selected-ability-name">{currentPower.name}</span>
            </div>
          )}
        </div>

        {/* Single card view for the selected power */}
        {currentSpell && (
          <div className="spell-card-wrapper single">
            <UnifiedSpellCard
              spell={currentSpell}
              variant="wizard"
              showActions={false}
              showDescription={true}
              showStats={true}
              showTags={false}
            />
          </div>
        )}
      </div>
    );
  };

  // Roll this creature's loot table and drop the results as loot orbs around it.
  // Always announces the roll (GM + players) - including when nothing dropped.
  const handleDropLoot = () => {
    const lootTable = processedCreature?.lootTable;
    if (!lootTable || !token) {
      return;
    }

    const creatureName = creature?.name || 'creature';
    const gameState = getStore('gameStore')?.getState?.();
    const roller = gameState?.isGMMode === false
      ? (useInventoryStore.getState().characterName || 'Player')
      : 'GM';

    // The token being inspected (a creature type can have several tokens on the map)
    const creatureToken =
      (token?.id && tokens.find(t => t.id === token.id)) ||
      tokens.find(t => t.creatureId === creature.id) ||
      token;
    if (!creatureToken?.position) {
      console.warn(`[Loot] No token position for ${creatureName}; cannot drop loot.`);
      return;
    }

    let gs = gridSystem;
    if (!gs) {
      try { gs = getGridSystem(); } catch (e) { gs = null; }
    }
    if (!gs) {
      console.warn('[Loot] Grid system not ready; cannot drop loot.');
      return;
    }

    const uniq = () => `${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

    // Group loot rolls (Settings → Group Loot Rolls): item drops are locked on the
    // grid until the players have rolled Need / Greed / Pass for them. Only works
    // with a live room - solo/local play keeps the old free-for-all behaviour.
    const lootSettings = useSettingsStore.getState();
    const mpSocket = gameState?.multiplayerSocket;
    const mpRoomId = gameState?.multiplayerRoom?.id;
    const rollDurationSec = Math.max(10, Math.min(120, Number(lootSettings.lootRollDuration) || 30));
    const isOnlineRoll = !!(lootSettings.lootRollEnabled && gameState?.isInMultiplayer && mpSocket?.connected && mpRoomId);
    // Offline: roll locally against the party's test players (party HUD → Add Test Player).
    const isLocalRoll = !!(lootSettings.lootRollEnabled && !gameState?.isInMultiplayer && getTestPlayers().length > 0);
    const rollSessionId = (isOnlineRoll || isLocalRoll) ? `lootroll_${uniq()}` : null;
    // Creature token art for the popups / roll frames (same source the grid token uses).
    let creaturePortrait = null;
    try {
      creaturePortrait = creatureToken?.state?.customIcon
        || creature?.customTokenImage
        || getCreatureTokenIconUrl(creature?.tokenIcon || creature?.icon, creature?.type)
        || resolveCreaturePortrait(creature, creatureToken)
        || null;
    } catch (e) {
      creaturePortrait = null;
    }
    const rollLock = rollSessionId
      ? {
        lootRollLocked: true,
        lootRollSessionId: rollSessionId,
        // Safety valve in case the roll never finishes (server restart etc.)
        lootRollExpiresAt: Date.now() + (rollDurationSec + 300) * 1000
      }
      : {};

    // Settings → Group Loot Rolls → quality: items below the threshold aren't rolled for.
    const QUALITY_ORDER = ['poor', 'common', 'uncommon', 'rare', 'epic', 'legendary', 'artifact'];
    const minQualityIndex = Math.max(0, QUALITY_ORDER.indexOf(lootSettings.lootRollMinQuality || 'poor'));
    const meetsRollQuality = (it) => {
      const idx = QUALITY_ORDER.indexOf(String(it?.quality || it?.rarity || 'common').toLowerCase());
      return (idx === -1 ? 1 : idx) >= minQualityIndex;
    };

    const rollRange = (range) => {
      if (!range || !(range.max > 0)) return 0;
      const min = Math.max(0, range.min || 0);
      return Math.floor(Math.random() * (range.max - min + 1)) + min;
    };

    // ---- 1. Roll everything first (so we know how many orbs we need) ----
    const drops = []; // { label, gridItem }
    const currency = lootTable.currency || {};
    [
      { key: 'gold', name: 'Gold', iconId: 'inv_misc_coin_01', unitValue: 1 },
      { key: 'silver', name: 'Silver', iconId: 'inv_misc_coin_02', unitValue: 0.1 },
      { key: 'copper', name: 'Copper', iconId: 'inv_misc_coin_03', unitValue: 0.01 }
    ].forEach(({ key, name, iconId, unitValue }) => {
      const amount = rollRange(currency[key]);
      if (amount <= 0) return;
      drops.push({
        label: `${amount} ${name}`,
        gridItem: {
          id: `${key}_${uniq()}`,
          name: `${amount} ${name}`,
          type: 'currency',
          subtype: key,
          iconId,
          quantity: 1, // Currency orbs are always quantity 1
          quality: 'poor',
          value: amount * unitValue,
          description: `${amount} ${key} pieces`,
          source: `Dropped by ${creatureName}`,
          isCurrency: true,
          currencyType: key,
          currencyValue: amount,
          noStack: true
        }
      });
    });

    (lootTable.items || []).forEach(item => {
      const dropChance = item.dropChance ?? 30;
      if (Math.random() * 100 >= dropChance) return;

      // Every drop gets its own orb id. Re-using the library id made a second roll
      // move the first orb instead of creating a new one.
      const baseId = item.id ? String(item.id) : `inline_${uniq()}`;
      const isInline = baseId.startsWith('inline_');
      const quantity = typeof item.quantity === 'number' ? item.quantity : 1;
      const rollThisItem = !!rollSessionId && meetsRollQuality(item);
      drops.push({
        label: quantity > 1 ? `${item.name} ×${quantity}` : item.name,
        rolled: rollThisItem,
        gridItem: {
          ...item,
          ...(rollThisItem ? rollLock : {}),
          id: `${baseId}__drop_${uniq()}`,
          // Library items keep pointing at their item-store entry for looting;
          // inline items are looked up by their own (unique) temporary id.
          ...(isInline ? {} : { itemId: baseId, originalItemId: baseId }),
          source: `Dropped by ${creatureName}`,
          width: item.width || 1,
          height: item.height || 1,
          stackable: item.stackable || (item.type === 'miscellaneous' || item.type === 'consumable'),
          maxStackSize: item.maxStackSize || (item.stackable ? 5 : 1),
          weight: item.weight || 1,
          noStack: true
        }
      });
    });

    // ---- 2. Place orbs around the creature ----
    const placedLabels = [];
    const rolledDrops = [];
    const mapId = getStore('mapStore')?.getState?.()?.currentMapId || 'default';
    if (drops.length > 0) {
      const blockedKeys = new Set();
      useGridItemStore.getState().gridItems.forEach(gi => {
        if (gi?.gridPosition && (gi.mapId || 'default') === mapId) {
          blockedKeys.add(`${gi.gridPosition.col},${gi.gridPosition.row}`);
        }
      });
      tokens.forEach(t => {
        if (!t?.position || t.id === creatureToken.id) return;
        if ((t.mapId || 'default') !== mapId) return;
        const g = gs.worldToGrid(t.position.x, t.position.y);
        blockedKeys.add(`${g.x},${g.y}`);
      });

      const sizeMapping = getCreatureSizeMapping(creature?.size);
      const tiles = findLootDropTiles({
        gridSystem: gs,
        tokenWorldPos: creatureToken.position,
        footprint: { width: sizeMapping?.width || 1, height: sizeMapping?.height || 1 },
        count: drops.length,
        blockedKeys
      });

      if (tiles.length < drops.length) {
        console.warn(`[Loot] Only ${tiles.length} free tiles near ${creatureName} for ${drops.length} drops.`);
      }

      drops.slice(0, tiles.length).forEach((drop, i) => {
        const tile = tiles[i];
        addItemToGrid(drop.gridItem, {
          x: tile.worldPos.x,
          y: tile.worldPos.y,
          gridPosition: { row: tile.gridY, col: tile.gridX }
        }, true);
        placedLabels.push(drop.label);
        if (drop.rolled) {
          const rawId = String(drop.gridItem.id);
          rolledDrops.push({
            gridItemId: rawId.startsWith('grid-item-') ? rawId : `grid-item-${rawId}`,
            name: drop.gridItem.customName || drop.gridItem.name,
            quality: drop.gridItem.quality || drop.gridItem.rarity || 'common',
            iconId: drop.gridItem.iconId || '',
            quantity: typeof drop.gridItem.quantity === 'number' ? drop.gridItem.quantity : 1
          });
        }
      });
    }

    // ---- 2b. Start the Need / Greed / Pass roll for the locked item orbs ----
    if (isLocalRoll && rolledDrops.length > 0) {
      const started = startLocalLootRoll({
        sessionId: rollSessionId,
        creatureName,
        creatureImage: creaturePortrait,
        durationSec: rollDurationSec,
        items: rolledDrops
      });
      if (!started) {
        const store = useGridItemStore.getState();
        rolledDrops.forEach(d => store.updateGridItemProperties(d.gridItemId, {
          lootRollLocked: false, lootRollSessionId: null, lootRollExpiresAt: null
        }, false));
      }
    } else if (rollSessionId && rolledDrops.length > 0) {
      const unlockAll = () => {
        const store = useGridItemStore.getState();
        rolledDrops.forEach(d => {
          if ((store.gridItems || []).some(gi => gi?.id === d.gridItemId)) {
            store.updateGridItemProperties(d.gridItemId, {
              lootRollLocked: false,
              lootRollSessionId: null,
              lootRollExpiresAt: null
            }, true);
          }
        });
      };
      let settled = false;
      // If the server never answers (e.g. it predates loot rolls) don't leave the loot locked.
      const fallbackTimer = setTimeout(() => {
        if (settled) return;
        settled = true;
        console.warn('[Loot] Loot roll did not start (no server response); loot left free to take.');
        unlockAll();
      }, 10000);
      mpSocket.emit('loot_roll_start', {
        roomId: mpRoomId,
        sessionId: rollSessionId,
        mapId,
        creatureName,
        creatureImage: creaturePortrait,
        durationSec: rollDurationSec,
        items: rolledDrops
      }, (ack) => {
        if (settled) return;
        settled = true;
        clearTimeout(fallbackTimer);
        if (!ack || ack.success === false) {
          console.warn('[Loot] Loot roll rejected; loot left free to take.', ack?.error);
          unlockAll();
          return;
        }
        if (ack.noRollers) {
          // The server already unlocked the orbs.
          useChatStore.getState().addSocialNotification?.({
            sender: { name: 'Loot', class: 'system', level: 0 },
            content: `No players in the room to roll for ${creatureName}'s loot — it's free to take.`,
            type: 'system'
          });
        }
      });
    }

    // Small popup for the roller when the creature had nothing on it
    // (other players get theirs when the announcement below reaches them).
    if (placedLabels.length === 0) {
      showNothingDroppedNotification(creatureName, creaturePortrait);
    }

    // ---- 3. Tell the GM and players what happened (also when nothing dropped) ----
    useChatStore.getState().addLootRollNotification({
      creatureName,
      dropped: placedLabels,
      roller,
      creatureImage: creaturePortrait
    });
  };

  // Render the Loot section
  const renderLootSection = () => {
    const loot = processedCreature.lootTable;
    const cur = loot?.currency || {};
    const coinRows = [
      { key: 'gold', label: 'Gold', cls: 'gold' },
      { key: 'silver', label: 'Silver', cls: 'silver' },
      { key: 'copper', label: 'Copper', cls: 'copper' }
    ].filter(c => cur[c.key]?.max > 0);
    const rawItems = initialCreature?.lootTable?.items || [];
    const lootItems = (loot?.items || []).map((it, i) => ({ it, raw: rawItems[i] || {} }));

    if (!loot || (coinRows.length === 0 && lootItems.length === 0)) {
      return (
        <div className="creature-inspect-section empty-section">
          <p>This creature carries nothing of worth.</p>
        </div>
      );
    }

    const rangeText = (q) => {
      if (q && typeof q === 'object' && q.max > 1) return q.min === q.max ? `×${q.max}` : `×${q.min}–${q.max}`;
      if (typeof q === 'number' && q > 1) return `×${q}`;
      return '';
    };
    const chanceWord = (c) => {
      if (c === undefined || c === null) return '';
      if (c >= 75) return 'Usual';
      if (c >= 40) return 'Common';
      if (c >= 15) return 'Uncommon';
      if (c >= 6) return 'Rare';
      return 'Very rare';
    };
    const sorted = [...lootItems].sort((a, b) => (b.it.dropChance || 0) - (a.it.dropChance || 0));

    return (
      <div className="calm-loot">
        <div className="calm-loot-head">
          <div>
            <h3 className="calm-loot-title">Spoils</h3>
            <p className="calm-loot-sub">What may be found on this creature when it falls.</p>
          </div>
          {token && (
            <button type="button" className="calm-loot-roll" onClick={handleDropLoot}
              title="Roll this creature's loot and drop it on adjacent tiles">
              Roll for loot
            </button>
          )}
        </div>

        {coinRows.length > 0 && (
          <section className="calm-loot-block">
            <h4 className="calm-loot-label">Coin carried</h4>
            <ul className="calm-coin-list">
              {coinRows.map(c => {
                const r = cur[c.key];
                return (
                  <li key={c.key} className="calm-coin-row">
                    <span className={`calm-coin-dot ${c.cls}`} aria-hidden="true" />
                    <span className="calm-coin-name">{c.label}</span>
                    <span className="calm-coin-amt">{r.min === r.max ? r.min : `${r.min}–${r.max}`}</span>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {sorted.length > 0 && (
          <section className="calm-loot-block">
            <h4 className="calm-loot-label">Items</h4>
            <ul className="calm-loot-list">
              {sorted.map(({ it, raw }, index) => {
                const chance = it.dropChance ?? raw.dropChance;
                const qty = rangeText(raw.quantity);
                return (
                  <li
                    key={index}
                    className="calm-loot-row"
                    onMouseEnter={(e) => { setHoveredItem(it); setMousePosition({ x: e.clientX, y: e.clientY }); }}
                    onMouseMove={(e) => { if (hoveredItem) setMousePosition({ x: e.clientX, y: e.clientY }); }}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <img
                      className="calm-loot-icon"
                      src={getIconUrl(it.iconId || 'Misc/Books/book-brown-teal-question-mark', 'items')}
                      alt=""
                      onError={(e) => { e.target.onerror = null; e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items'); }}
                    />
                    <span className="calm-loot-name" style={{ color: getQualityColor(it.quality || it.rarity || 'common') }}>
                      {it.name || `Item ${index + 1}`}
                    </span>
                    {qty && <span className="calm-loot-qty">{qty}</span>}
                    <span className="calm-loot-chance" title={`${chance}% chance`}>
                      <span className="calm-loot-bar"><span style={{ width: `${Math.min(100, chance || 0)}%` }} /></span>
                      <span className="calm-loot-pct">{chance}%</span>
                      <span className="calm-loot-word">{chanceWord(chance)}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </section>
        )}
      </div>
    );
  };

  // Render the Description section
  const renderDescriptionSection = () => {
    // Resolve bestiary artwork + meta: prefer fields carried on the token/creature,
    // otherwise look them up in BESTIARY_DATA by id/name (bestiary-sourced creatures).
    const bestiaryMatch = findBestiaryIllustration(creature);
    const illustration = resolveCreaturePortrait(creature, token) || creature?.illustration || bestiaryMatch?.illustration || null;
    const illustrationCaption = creature?.illustrationCaption || bestiaryMatch?.illustrationCaption || null;
    const region = creature?.region || bestiaryMatch?.region || null;
    const role = creature?.role || bestiaryMatch?.role || null;
    const dangerLevel = creature?.dangerLevel || bestiaryMatch?.dangerLevel || null;
    const loreClassification = creature?.loreClassification || bestiaryMatch?.loreClassification || {};
    const loreCanon = creature?.loreCanon || bestiaryMatch?.loreCanon || {};
    const loreNote = readLoreText(creature?.loreNote || bestiaryMatch?.loreNote);
    const cosmicWyrd = isCosmicWyrdCreature(loreClassification);
    const layerSummary = [
      readLoreText(loreClassification.status),
      readLoreText(loreClassification.originClass),
      readLoreText(loreClassification.wyrdRelationship)
    ].filter(Boolean).join(' | ');
    const hasMeta = region || role || dangerLevel || layerSummary;
    const loreOrigin = readLoreText(loreCanon.trueOrigin) || readLoreText(creature?.origin);
    const loreFolklore = readLoreText(loreCanon.folklore) || readLoreText(creature?.heritage);
    const loreFunction = readLoreText(loreCanon.function) || readLoreText(creature?.nature);
    const loreValues = readLoreText(loreCanon.values);
    const loreBindingEffect = readLoreText(loreCanon.bindingEffect);
    const loreWyrdRelationship = readLoreText(loreCanon.wyrdRelationship)
      || readLoreText(loreClassification.wyrdRelationship)
      || readLoreText(creature?.depth);
    const cosmicDetails = cosmicWyrd ? [
      ['Cosmic provenance', loreCanon.cosmicProvenance],
      ['Wyrd function', loreCanon.wyrdFunction],
      ['Mythrill anchor', loreCanon.anchor],
      ['Keth Amar relationship', loreCanon.kethRelationship],
      ['Current independence', loreCanon.independence],
      ['Countermeasure', loreCanon.countermeasure]
    ]
      .map(([label, value]) => `${label}: ${readLoreText(value)}`)
      .filter((entry) => !entry.endsWith(': '))
      .join('\n') : '';

    const folkloreInspiration = creature?.folkloreInspiration || bestiaryMatch?.folkloreInspiration;

    const loreEntries = [
      layerSummary && { icon: 'fa-layer-group', title: 'Mythrill Layer', text: `${layerSummary}${loreNote ? `\n${loreNote}` : ''}` },
      loreOrigin && { icon: 'fa-feather-pointed', title: 'Mythic Provenance', text: loreOrigin },
      loreFolklore && { icon: 'fa-book-open', title: 'Folklore Record', text: loreFolklore },
      folkloreInspiration && {
        icon: 'fa-book-journal-whills',
        title: 'Real-World Folklore & Cryptid Roots',
        text: [
          folkloreInspiration.primaryMyth && `Mythological Root: ${folkloreInspiration.primaryMyth}`,
          folkloreInspiration.traditions?.length > 0 && `Traditions: ${folkloreInspiration.traditions.join(', ')}`,
          folkloreInspiration.cryptidRoots && `Archetype: ${folkloreInspiration.cryptidRoots}`,
          folkloreInspiration.description,
          folkloreInspiration.settingAdaptation && `Mythrill Adaptation: ${folkloreInspiration.settingAdaptation}`
        ].filter(Boolean).join('\n\n')
      },
      loreFunction && { icon: 'fa-dragon', title: 'Nature & World Function', text: loreFunction },
      creature?.habitat && { icon: 'fa-map-location-dot', title: 'Habitat', text: creature.habitat },
      loreValues && { icon: 'fa-shield-heart', title: 'Values & Guardianship', text: loreValues },
      loreBindingEffect && { icon: 'fa-temperature-half', title: 'Binding & Warmth History', text: loreBindingEffect },
      (loreWyrdRelationship || cosmicDetails) && {
        icon: cosmicWyrd ? 'fa-sparkles' : 'fa-mask-cat',
        title: cosmicWyrd ? 'Wyrd Ecology' : 'The Truth Beneath',
        text: [loreWyrdRelationship, cosmicDetails].filter(Boolean).join('\n'),
        depth: true
      },
    ].filter(Boolean);

    return (
      <div className="creature-inspect-section creature-lore-page">
        {/* ===== Masthead: portrait + meta + lead paragraph ===== */}
        <div className={`creature-lore-masthead ${illustration ? 'has-portrait' : 'no-portrait'}`}>
          {illustration && (
            <div className="creature-lore-portrait">
              <div className="creature-lore-portrait-frame">
                <img
                  src={getCreatureThumb(illustration)}
                  alt={illustrationCaption || creature?.name || 'Creature'}
                  loading="lazy"
                  decoding="async"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = illustration;
                    e.target.onerror = () => {
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                    };
                  }}
                />
              </div>
              {illustrationCaption && (
                <div className="creature-lore-caption">
                  <i className="fas fa-camera-retro"></i> {illustrationCaption}
                </div>
              )}
            </div>
          )}
          <div className="creature-lore-lead">
            {hasMeta && (
              <div className="creature-lore-meta">
                {region && (
                  <span className="lore-meta-chip"><i className="fas fa-book-open"></i> {region}</span>
                )}
                {role && (
                  <span className="lore-meta-chip"><i className="fas fa-shield-halved"></i> {role}</span>
                )}
                {dangerLevel && (
                  <span className={`lore-meta-chip danger ${dangerLevel.toLowerCase().replace(/\s+/g, '-')}`}>
                    <i className="fas fa-skull"></i> {dangerLevel} Danger
                  </span>
                )}
              </div>
            )}
            <p className="creature-lore-lead-text">
              {creature?.description || "No description available."}
            </p>
          </div>
        </div>

        {/* ===== Ornamental divider ===== */}
        {loreEntries.length > 0 && (
          <div className="creature-lore-divider" aria-hidden="true">
            <span></span>
            <i className="fas fa-feather"></i>
            <span></span>
          </div>
        )}

        {/* ===== Lore body: two-column codex grid ===== */}
        {loreEntries.length > 0 && (
          <div className="creature-lore-grid">
            {loreEntries.map((entry, i) => (
              <div
                key={i}
                className={`creature-lore-section ${entry.depth ? 'creature-lore-depth' : ''}`}
              >
                <h4 className="creature-lore-title">
                  <i className={`fas ${entry.icon}`}></i> {entry.title}
                </h4>
                <div className="creature-lore-content"><InlineMarkdown text={entry.text} /></div>
              </div>
            ))}
          </div>
        )}

        {/* ===== Tags ===== */}
        {creature?.tags && creature.tags.length > 0 && (
          <div className="creature-tags-section">
            <h3 className="section-title">Tags</h3>
            <div className="creature-tags">
              {creature.tags.map((tag, index) => (
                <span key={index} className="creature-tag">{tag}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Define a custom close handler to ensure proper cleanup
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  // Use createPortal to render at document body level
  // This ensures the window is not constrained within parent containers
  return createPortal(
    <MythrillWindow
      isOpen={true} // Always true since we're already checking isOpen above
      onClose={handleClose}
      title={creature?.name || 'Creature Sheet'}
      defaultSize={{ width: 900, height: 700 }}
      defaultPosition={{ x: 100, y: 100 }} // Fixed position instead of calculated center
      centered={false} // Disable centering to prevent repositioning
      zIndex={20000} // Increased z-index to ensure it's above all other elements including the grid
      bounds="body"
      customHeader={
        <div className="spellbook-tab-container tab-overflow-root character-sheet-tabs creature-sheet-tabs" ref={tabsTrackRef}>
          {sectionKeys.filter(key => !hiddenTabIds.includes(key)).map(key => {
            const section = sections[key];
            if (!section) return null;
            const isActive = activeSection === key;
            const isDropdownOpen = openDropdown === key;
            return (
              <div 
                key={key} 
                data-overflow-id={key}
                className="tab-dropdown-wrapper" 
                style={{ position: 'relative' }}
                onMouseLeave={scheduleCloseTabDropdown}
              >
                <button
                  type="button"
                  className={`spellbook-tab-button ${isActive ? 'active' : ''}`}
                  title={isDropdownOpen ? undefined : section.title}
                  aria-label={section.title}
                  aria-pressed={isActive}
                  aria-expanded={isDropdownOpen}
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveSection(key);
                    if (section.subSections) {
                      if (openDropdown === key) {
                        setOpenDropdown(null);
                      } else {
                        openTabDropdown(key, e.currentTarget);
                      }
                    } else {
                      setOpenDropdown(null);
                    }
                  }}
                  onMouseEnter={(e) => {
                    if (section.subSections) {
                      openTabDropdown(key, e.currentTarget);
                    } else {
                      scheduleCloseTabDropdown();
                    }
                  }}
                >
                  {section.icon && (
                    typeof section.icon === 'string' && (section.icon.startsWith('fa-') || section.icon.startsWith('fas ') || section.icon.startsWith('far ')) ? (
                      <i className={`${section.icon} tab-icon-glyph`} aria-hidden="true" style={{ marginRight: '6px' }} />
                    ) : (
                      <img src={section.icon} alt="" className="tab-icon-img" style={{ width: 16, height: 16, marginRight: '6px', objectFit: 'contain' }} />
                    )
                  )}
                  <span className="tab-text">{section.title}</span>
                  {section.subSections && (
                    <i 
                      className={`fas fa-chevron-${isDropdownOpen ? 'up' : 'down'} tab-chevron`} 
                      style={{ marginLeft: '4px', fontSize: '8px', opacity: 0.8 }} 
                    />
                  )}
                </button>

                {isDropdownOpen && section.subSections && dropdownPos && createPortal(
                  <div
                    className="tab-dropdown-menu tab-dropdown-menu-scrollable adventurer-menu creature-tab-menu"
                    style={{ position: 'fixed', left: dropdownPos.left, top: dropdownPos.top, minWidth: Math.max(220, dropdownPos.width), marginTop: 4 }}
                    onMouseEnter={cancelCloseTabDropdown}
                    onMouseLeave={scheduleCloseTabDropdown}
                  >
                    {key === 'skills' ? (
                      section.subSections.map(sub => {
                        const skillsForCat = section.skillItems?.[sub.id] || [];
                        const isCatActive = isActive && selectedSkillCategory === sub.id;
                        return (
                          <div key={sub.id} className="tab-dropdown-section">
                            <div
                              className={`tab-dropdown-section-header ${isCatActive ? 'active' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveSection('skills');
                                setSelectedSkillCategory(sub.id);
                                if (skillsForCat.length > 0) {
                                  setSelectedSkill(skillsForCat[0].id);
                                }
                                setOpenDropdown(null);
                              }}
                              title={`View ${sub.label}`}
                            >
                              <i className={sub.icon} style={{ width: '16px', textAlign: 'center', marginRight: '8px' }}></i>
                              <span className="tab-dropdown-section-title">{sub.label}</span>
                              <span className="tab-dropdown-section-count">({skillsForCat.length})</span>
                            </div>
                            {skillsForCat.length > 0 && (
                              <div className="tab-dropdown-section-items">
                                {skillsForCat.map(skill => {
                                  const isSkillActive = isActive && selectedSkillCategory === sub.id && selectedSkill === skill.id;
                                  return (
                                    <button
                                      key={skill.id}
                                      type="button"
                                      className={`tab-dropdown-item tab-dropdown-skill-item ${isSkillActive ? 'active' : ''}`}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveSection('skills');
                                        setSelectedSkillCategory(sub.id);
                                        setSelectedSkill(skill.id);
                                        setOpenDropdown(null);
                                      }}
                                    >
                                      <i className={skill.icon} style={{ width: '14px', textAlign: 'center', marginRight: '6px', fontSize: '10px' }}></i>
                                      <span>{skill.label}</span>
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      })
                    ) : (
                      section.subSections.map(sub => {
                        const isSubActive = isActive && (
                          (key === 'statistics' && selectedStatGroup === sub.id) ||
                          (key === 'skills' && selectedSkillCategory === sub.id)
                        );
                        return (
                          <div
                            key={sub.id}
                            className="tab-dropdown-item-wrapper"
                            style={{ position: 'relative' }}
                          >
                            <button
                              type="button"
                              className={`tab-dropdown-item ${isSubActive ? 'active' : ''}`}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveSection(key);
                                if (key === 'statistics') {
                                  setSelectedStatGroup(sub.id);
                                } else if (key === 'skills') {
                                  setSelectedSkillCategory(sub.id);
                                }
                                setOpenDropdown(null);
                              }}
                            >
                              <i className={sub.icon} style={{ width: '16px', textAlign: 'center', marginRight: '8px' }}></i>
                              <span>{sub.label}</span>
                            </button>
                          </div>
                        );
                      })
                    )}
                  </div>,
                  document.body
                )}
              </div>
            );
          })}

          {hiddenTabIds.length > 0 && (
            <button
              type="button"
              ref={tabOverflowBtnRef}
              className={`tab-overflow-trigger ${tabOverflowOpen ? 'open' : ''} ${hiddenTabIds.includes(activeSection) ? 'has-active' : ''}`}
              data-overflow-trigger=""
              onClick={(e) => {
                if (tabOverflowOpen) {
                  setTabOverflowOpen(false);
                } else {
                  openTabOverflowMenu(e.currentTarget.getBoundingClientRect());
                }
              }}
              onMouseEnter={(e) => openTabOverflowMenu(e.currentTarget.getBoundingClientRect())}
              onMouseLeave={scheduleCloseTabOverflow}
              aria-haspopup="menu"
              aria-expanded={tabOverflowOpen}
              aria-label="More sections"
              title="More sections"
            >
              ⋮
            </button>
          )}

          {tabOverflowOpen && hiddenTabIds.length > 0 && tabOverflowPos && createPortal(
            <div
              ref={tabOverflowMenuRef}
              className="tab-dropdown-menu tab-dropdown-menu-scrollable tab-overflow-menu adventurer-menu creature-tab-menu"
              style={{
                position: 'fixed',
                top: tabOverflowPos.top,
                left: tabOverflowPos.left,
                minWidth: 200
              }}
              onMouseEnter={cancelCloseTabOverflow}
              onMouseLeave={scheduleCloseTabOverflow}
              role="menu"
            >
              {hiddenTabIds.map(id => {
                const sec = sections[id];
                if (!sec) return null;
                const isActive = id === activeSection;
                return (
                  <button
                    key={id}
                    type="button"
                    className={`tab-dropdown-item ${isActive ? 'active' : ''}`}
                    onClick={() => {
                      setActiveSection(id);
                      setTabOverflowOpen(false);
                    }}
                    role="menuitem"
                  >
                    {sec.icon && (
                      typeof sec.icon === 'string' && (sec.icon.startsWith('fa-') || sec.icon.startsWith('fas ') || sec.icon.startsWith('far ')) ? (
                        <i className={`${sec.icon} tab-icon-glyph`} aria-hidden="true" style={{ marginRight: '8px' }} />
                      ) : (
                        <img src={sec.icon} alt="" className="tab-icon-img" style={{ width: 16, height: 16, marginRight: '8px', objectFit: 'contain' }} />
                      )
                    )}
                    <span>{sec.title}</span>
                  </button>
                );
              })}
            </div>,
            document.body
          )}
        </div>
      }
    >
      <div className="creature-inspect-container">
        {/* Show stat groups navigation for Statistics section, otherwise show regular content */}
        {activeSection === 'statistics' ? (
          renderStatsSection()
        ) : (
          <div className="creature-content-area-full">
            {Object.keys(sections).length > 1 && (
              <div className="creature-section-header">
                {sections[activeSection]?.icon && (
                  typeof sections[activeSection].icon === 'string' &&
                  (sections[activeSection].icon.startsWith('fa-') || sections[activeSection].icon.startsWith('fas ') || sections[activeSection].icon.startsWith('far ')) ? (
                    <div className="creature-section-icon-box">
                      <i className={`${sections[activeSection].icon} creature-section-icon-glyph`} />
                    </div>
                  ) : (
                    <img
                      src={sections[activeSection].icon}
                      alt=""
                      className="creature-section-icon"
                      onError={(e) => handleImageError(e, 'Utility/Utility')}
                    />
                  )
                )}
                <h2 className="creature-section-title">{sections[activeSection]?.title}</h2>
              </div>
            )}

            <div className="creature-section-content">
              {activeSection === 'abilities' && <CreatureAbilityDetails association={token ? token.authoredAbility : creature.authoredAbility} token={token} saved />}
              {renderContent()}
            </div>
          </div>
        )}

        {/* Item Tooltip - Using TooltipPortal for highest z-index */}
        {hoveredItem && (
          <TooltipPortal>
            <div
              ref={tooltipRef}
              className="loot-item-tooltip-wrapper"
              style={{
                position: 'fixed',
                left: adjustedPosition.x,
                top: adjustedPosition.y,
                pointerEvents: 'none'
              }}
            >
              <ItemTooltip
                item={hoveredItem}
              />
            </div>
          </TooltipPortal>
        )}
      </div>
    </MythrillWindow>,
    document.body
  );
};

export default EnhancedCreatureInspectView;
