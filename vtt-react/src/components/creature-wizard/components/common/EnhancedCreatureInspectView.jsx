import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import WowWindow from '../../../windows/WowWindow';
import ItemTooltip from '../../../item-generation/ItemTooltip';
import TooltipPortal from '../../../tooltips/TooltipPortal';
import StatTooltip from '../../../tooltips/StatTooltip';
import GeneralStatTooltip from '../../../tooltips/GeneralStatTooltip';
import ResistanceTooltip from '../../../tooltips/ResistanceTooltip';
import UnifiedSpellCard from '../../../spellcrafting-wizard/components/common/UnifiedSpellCard';
import SmartTabButton from '../../../common/SmartTabButton';
import { DAMAGE_TYPES } from '../../../spellcrafting-wizard/core/data/damageTypes';
import { getQualityColor } from '../../../../constants/itemConstants';
import { getAbilityIconUrl, getCustomIconUrl, getIconUrl } from '../../../../utils/assetManager';
import { SKILL_DEFINITIONS, SKILL_CATEGORIES, SKILL_RANKS } from '../../../../constants/skillDefinitions';
import { ROLLABLE_TABLES } from '../../../../constants/rollableTables';
import { calculateStatModifier } from '../../../../utils/characterUtils';
import { showSkillRollNotification } from '../../../../utils/skillRollNotification';
import useCreatureStore from '../../../../store/creatureStore';
import useGridItemStore from '../../../../store/gridItemStore';
import useGameStore from '../../../../store/gameStore';
import useChatStore from '../../../../store/chatStore';
import useInventoryStore from '../../../../store/inventoryStore';
import useItemStore from '../../../../store/itemStore';
import { getGridSystem } from '../../../../utils/InfiniteGridSystem';
import { processCreatureLoot } from '../../../../utils/lootItemUtils';
import { calculateEffectiveMovementSpeed } from '../../../../utils/conditionUtils';
import '../../../spellcrafting-wizard/styles/pathfinder/main.css';
import '../../../../styles/skills.css';
import '../../../../styles/character-sheet.css';
import './EnhancedCreatureInspectView.css';

// Helper function to calculate ability modifier
const calculateModifier = (value) => {
  return Math.floor((value - 10) / 2);
};

// Helper function to format modifier with + or - sign
const formatModifier = (mod) => {
  return mod >= 0 ? `+${mod}` : `${mod}`;
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
  if (!type) return 'Physical';

  const typeMap = {
    'physical': 'Physical',
    'fire': 'Fire',
    'frost': 'Frost',
    'arcane': 'Arcane',
    'nature': 'Nature',
    'shadow': 'Necrotic', // Legacy: shadow -> necrotic
    'holy': 'Radiant', // Legacy: holy -> radiant
    'poison': 'Poison',
    'slashing': 'Slashing',
    'piercing': 'Piercing',
    'bludgeoning': 'Bludgeoning'
  };

  return typeMap[type.toLowerCase()] || type.charAt(0).toUpperCase() + type.slice(1);
};

// Helper function to get color based on damage type
const getDamageTypeColor = (damageType) => {
  const damageColors = {
    fire: '#FF4500',
    frost: '#00BFFF',
    arcane: '#DA70D6',
    nature: '#32CD32',
    shadow: '#9370DB',
    holy: '#FFD700',
    physical: '#CD853F',
    poison: '#008000',
    lightning: '#00FFFF',
    necrotic: '#800080',
    radiant: '#FFFF00',
    acid: '#00FF00',
    psychic: '#FF00FF',
    thunder: '#1E90FF',
    force: '#87CEFA',
    bludgeoning: '#A0522D',
    piercing: '#708090',
    slashing: '#B22222',
    chaos: '#ec4899'
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

// Calculate soak die based on armor value (same logic as character sheet)
const getSoakDieFromArmor = (armorValue = 0) => {
  const armor = Math.max(0, Math.floor(armorValue));
  if (armor < 5) return '—';
  if (armor <= 9) return '1d4';
  if (armor <= 14) return '1d6';
  if (armor <= 19) return '1d8';
  if (armor <= 24) return '1d10';
  if (armor <= 29) return '1d12';
  if (armor <= 34) return '1d12 + 1d4';
  if (armor <= 39) return '1d12 + 1d6';
  if (armor <= 44) return '2d12';
  if (armor <= 49) return '2d12 + 1d4';
  return '2d12 + 1d6';
};




const EnhancedCreatureInspectView = ({ creature: initialCreature, token, isOpen, onClose }) => {
  const [activeSection, setActiveSection] = useState('statistics');
  const [mounted, setMounted] = useState(false);
  const windowRef = useRef(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
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
  const gridSystem = getGridSystem();
  const itemStore = useItemStore(state => ({ items: state.items }));

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

  // Helper function to calculate tooltip position with improved logic
  const calculateTooltipPosition = (e) => {
    // Get window dimensions
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Tooltip dimensions
    const tooltipWidth = 300;
    const tooltipHeight = 400;
    const padding = 20;
    const cursorOffset = 15;

    // Try positioning to the right first (preferred for creature window)
    let x = e.clientX + cursorOffset;
    let y = e.clientY - 10;

    // If tooltip would go off right edge, try left side
    if (x + tooltipWidth > windowWidth - padding) {
      x = e.clientX - tooltipWidth - cursorOffset;

      // If left side also doesn't fit, center it and position above/below
      if (x < padding) {
        // Center horizontally and position above or below
        x = Math.max(padding, Math.min(
          windowWidth - tooltipWidth - padding,
          e.clientX - tooltipWidth / 2
        ));

        // Position above if in bottom half of screen, below if in top half
        if (e.clientY > windowHeight / 2) {
          y = e.clientY - tooltipHeight - cursorOffset; // Above
        } else {
          y = e.clientY + cursorOffset; // Below
        }
      }
    }

    // Final bounds check to ensure tooltip stays on screen
    x = Math.max(padding, Math.min(x, windowWidth - tooltipWidth - padding));
    y = Math.max(padding, Math.min(y, windowHeight - tooltipHeight - padding));

    return { x, y };
  };

  // Component lifecycle management
  useEffect(() => {
    if (isOpen && creature) {
      setMounted(true);
    }
  }, [isOpen, creature]);

  // Early return if no creature, no stats, or not open
  if (!creature || !creature.stats || !isOpen) return null;

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

  // Define sections for the header navigation (matching character sheet style)
  const sections = {
    statistics: {
      title: 'Statistics',
      icon: getCustomIconUrl('Utility/Ornate Symbol', 'abilities')
    },
    abilities: {
      title: 'Abilities & Spells',
      icon: getCustomIconUrl('Radiant/Radiant Aura', 'abilities')
    },
    tactics: {
      title: 'Tactics & Behavior',
      icon: getCustomIconUrl('Arcane/Enchanted Sword', 'abilities')
    },
    skills: {
      title: 'Skills',
      icon: getCustomIconUrl('Utility/All Seeing Eye', 'abilities')
    },
    loot: {
      title: 'Loot Table',
      icon: getCustomIconUrl('Utility/Ornate Symbol', 'abilities')
    },
    description: {
      title: 'Description & Lore',
      icon: getCustomIconUrl('Utility/Ornate Symbol', 'abilities')
    }
  };

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

  const renderContent = () => {
    switch (activeSection) {
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
            description: effectiveSpeed !== baseSpeed 
              ? `Effective walking speed in feet per turn (modified by conditions from base ${baseSpeed} ft)`
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
          .filter(dt => !['bludgeoning', 'piercing', 'slashing'].includes(dt.id)) // Exclude physical damage types
          .map(dt => {
            // Map damage type IDs to local ability icons (matching character sheet)
            const iconMap = {
              fire: 'Fire/Flame Burst',
              frost: 'Frost/Dripping Ice',
              lightning: 'Lightning/Lightning Bolt',
              arcane: 'Arcane/Orb Manipulation',
              nature: 'Nature/Nature Natural',
              force: 'Force/Force Touch',
              necrotic: 'Necrotic/Necrotic Skull',
              radiant: 'Radiant/Radiant Sunburst',
              poison: 'Poison/Poison Venom',
              psychic: 'Psychic/Brain Psionics',
              chaos: 'Chaos/Chaotic Shuffle',
              void: 'Void/Void Portal Mage'
            };
            const iconPath = iconMap[dt.id] || 'Utility/Utility';
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
        title: 'Defensive Statistics',
            icon: getCustomIconUrl('Utility/Scaled Armor', 'abilities'),
        description: 'Defensive capabilities and survivability',
        stats: [
          {
            label: 'Armor',
            value: creature.stats.armorClass || 10,
            tooltip: true,
            icon: getCustomIconUrl('Utility/Scaled Armor', 'abilities'),
            description: 'Defense against physical attacks'
          },
          {
            label: 'Passive DR',
            value: Math.floor((creature.stats.armorClass || 10) / 10),
            tooltip: true,
            icon: getCustomIconUrl('Utility/Golden Shield', 'abilities'),
            description: 'Damage reduced automatically each hit (Armor ÷ 10, rounded down)'
          },
          {
            label: 'Soak Die (Defend)',
            value: getSoakDieFromArmor(creature.stats.armorClass || 10),
            tooltip: true,
            icon: getCustomIconUrl('Utility/Golden Shield', 'abilities'),
            description: 'Bonus reduction you roll when you take the Defend action'
          },
          {
            label: 'Dodge',
            value: Math.round(Math.floor((creature.stats.agility || 10) / 3) || 0),
            tooltip: true,
            icon: getCustomIconUrl('Utility/Speed Dash', 'abilities'),
            description: 'Chance to avoid attacks entirely'
          },
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
      Object.entries(allResistances).forEach(([damageTypeId, level]) => {
        try {
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
              case 'immune': return '#4CAF50';
              case 'resistant': return '#2196F3';
              case 'guarded': return '#00BCD4';
              case 'exposed': return '#FF9800';
              case 'susceptible': return '#FF5722';
              case 'vulnerable': return '#F44336';
              default: return '#9E9E9E';
            }
          };

          const getDamageTypeIcon = (damageTypeId) => {
            // Use ability icons for damage types
            const abilityIconMap = {
              fire: 'Fire/Flame Burst',
              frost: 'Frost/Dripping Ice',
              cold: 'Frost/Dripping Ice',
              arcane: 'Arcane/Orb Manipulation',
              nature: 'Nature/Nature Natural',
              shadow: 'Shadow/Shadow Darkness',
              holy: 'Radiant/Radiant Sunburst',
              physical: 'General/Sword',
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
              force: 'Force/Force Touch'
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
          console.warn('Error processing resistance for', damageTypeId, ':', error);
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
          fire: 'Fire/Flame Burst',
          frost: 'Frost/Dripping Ice',
          cold: 'Frost/Dripping Ice',
          arcane: 'Arcane/Orb Manipulation',
          nature: 'Nature/Nature Natural',
          shadow: 'Shadow/Shadow Darkness',
          holy: 'Radiant/Radiant Sunburst',
          physical: 'General/Sword',
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
          chaos: 'Chaos/Chaotic Shuffle',
          void: 'Void/Void Portal Mage'
        };
        return getCustomIconUrl(iconMap[damageTypeId] || 'Utility/Utility', 'abilities');
      };

      if (creature.immunities && creature.immunities.length > 0) {
        creature.immunities.forEach(immunity => {
          try {
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
            console.warn('Error processing immunity for', immunity, ':', error);
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
            <div key={index} className="enhanced-stat-row">
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
        {/* Left sidebar with stat groups - these become the new left navigation */}
        <div className={`stats-navigation ${showLabels ? 'with-labels' : 'icons-only'}`}>
          <button
            className="stats-label-toggle-button"
            onClick={() => setShowLabels(!showLabels)}
            title={showLabels ? 'Hide Labels' : 'Show Labels'}
          >
            <span className="stats-toggle-icon">{showLabels ? '◀' : '▶'}</span>
          </button>
          {Object.entries(statGroups).map(([key, group]) => (
            <button
              key={key}
              className={`stats-nav-button ${selectedStatGroup === key ? 'active' : ''}`}
              onClick={() => setSelectedStatGroup(key)}
              title={group.title}
            >
              <img 
                src={group.icon} 
                alt="" 
                className="stats-nav-icon" 
                onError={(e) => handleImageError(e, 'Utility/Utility')}
              />
              {showLabels && <span className="stats-nav-text">{group.title}</span>}
            </button>
          ))}
        </div>

        {/* Content area showing selected stat group */}
        <div className="stats-content-area">
          <div className="stats-section-header">
            <img
              src={statGroups[selectedStatGroup].icon}
              alt=""
              className="stats-section-icon"
              onError={(e) => handleImageError(e, 'Utility/Utility')}
            />
            <h2 className="stats-section-title">{statGroups[selectedStatGroup].title}</h2>
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
  const rollSkillTable = (skill, skillId) => {
    const tableId = getCurrentRollableTable(skill, skillId);
    const table = ROLLABLE_TABLES[tableId];
    if (!table) return;

    const dieSize = parseInt(selectedDie.substring(1));
    const roll = Math.floor(Math.random() * dieSize) + 1;
    const result = table.table.find(entry =>
      roll >= entry.roll[0] && roll <= entry.roll[1]
    );

    if (result) {
      showSkillRollNotification(roll, result, skill.name);
    }
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
            <button
              className="roll-table-btn"
              onClick={() => rollSkillTable(skill, selectedSkill)}
            >
              <i className="fas fa-dice"></i> Roll
            </button>
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
            const categoryData = Object.values(SKILL_CATEGORIES).find(cat => cat.name === categoryName);
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

  // Transform ability to spell format for spell cards
  const transformAbilityToSpell = (ability) => {
    // Check if this ability already has the spell wizard format (from BasicAbilityCreator or spell library)
    // If it has damageConfig, healingConfig, buffConfig, etc., it's already in the correct format
    const hasSpellWizardFormat = ability.damageConfig || ability.healingConfig || 
                                  ability.buffConfig || ability.debuffConfig || 
                                  ability.controlConfig || ability.utilityConfig ||
                                  ability.summonConfig || ability.transformationConfig;
    
    if (hasSpellWizardFormat) {
      // Ability is already in spell wizard format - pass it through with minimal transformation
      return {
        id: ability.id || `ability-${ability.name}`,
        name: ability.name,
        description: ability.description || '',
        icon: ability.icon || 'inv_misc_questionmark',
        spellType: ability.spellType || 'ACTION',
        effectTypes: ability.effectTypes || [],
        typeConfig: ability.typeConfig || {},
        damageConfig: ability.damageConfig,
        healingConfig: ability.healingConfig,
        buffConfig: ability.buffConfig,
        debuffConfig: ability.debuffConfig,
        controlConfig: ability.controlConfig,
        utilityConfig: ability.utilityConfig,
        summonConfig: ability.summonConfig,
        transformationConfig: ability.transformationConfig,
        targetingConfig: ability.targetingConfig,
        resourceCost: ability.resourceCost || {
          actionPoints: ability.actionPointCost || ability.apCost || 0
        },
        cooldownConfig: ability.cooldownConfig,
        resolution: ability.resolution || 'DICE',
        tags: ability.tags || [],
        priorityRange: ability.priorityRange // Pass through priority range for badge display
      };
    }

    // Legacy format - transform old ability structure to spell card format
    const ap = ability.actionPointCost || ability.apCost || 0;

    // Build simple resource cost using Action Points (AP)
    const resourceCost = ap > 0 ? { actionPoints: ap } : undefined;

    // Aggregate damage types from primary damage and effects (e.g., piercing + necrotic)
    const damageTypesSet = new Set();
    if (ability.damage?.damageType) damageTypesSet.add(String(ability.damage.damageType).toLowerCase());
    if (ability.damageType) damageTypesSet.add(String(ability.damageType).toLowerCase());
    if (Array.isArray(ability.effects)) {
      ability.effects.forEach(e => {
        const t = (e.damageType || e.type || '').toString().toLowerCase();
        if (e.type === 'DAMAGE' || e.type === 'damage') {
          if (t) damageTypesSet.add(t);
        }
      });
    }
    // Normalize shadow->necrotic, holy->radiant, cold->frost
    const normalize = (t) => {
        if (t === 'shadow') return 'necrotic';
        if (t === 'holy') return 'radiant';
        if (t === 'cold') return 'frost';
        return t;
    };
    const damageTypes = Array.from(damageTypesSet).map(normalize).filter(Boolean);

    // Best-effort damage mapping so the card can show damage context
    let damageConfig;
    if (ability.damage) {
      if (typeof ability.damage === 'object') {
        const bonus = ability.damage.bonus ? `+${ability.damage.bonus}` : '';
        const formula = `${ability.damage.diceCount || 1}d${ability.damage.diceType || 6}${bonus}`;
        damageConfig = {
          formula,
          damageType: 'direct', // Legacy format uses 'direct' for instant damage
          elementType: normalize((ability.damage.damageType || ability.damageType || 'physical').toLowerCase()),
          damageTypes: damageTypes.slice(0, 2)
        };
      } else if (typeof ability.damage === 'string') {
        damageConfig = {
          formula: ability.damage,
          damageType: 'direct',
          elementType: normalize((ability.damageType || 'physical').toLowerCase()),
          damageTypes: damageTypes.slice(0, 2)
        };
      }
    }

    return {
      id: ability.id || `ability-${ability.name}`,
      name: ability.name,
      spellType: ability.spellType || 'ACTION',
      icon: ability.icon || 'inv_sword_04',
      description: ability.description || '',
      castTime: ability.castTime || 'Action',
      range: typeof ability.range === 'number' ? ability.range : (ability.range || undefined),
      duration: ability.duration || undefined,
      resourceCost,
      damageConfig,
      effectTypes: damageConfig ? ['damage'] : undefined,
      // Keep any raw effects for potential future mapping
      effects: ability.effects || [],
      priorityRange: ability.priorityRange // Pass through priority range for badge display
    };
  };

  // Render the Abilities section
  const renderAbilitiesSection = () => {
    if (!creature.abilities || creature.abilities.length === 0) {
      return (
        <div className="creature-inspect-section empty-section">
          <p>This creature has no abilities.</p>
        </div>
      );
    }

    // Combine spells and abilities into one unified list, preserving original order
    const allPowers = Array.isArray(creature.abilities) ? creature.abilities : [];

    return (
      <div className="stats-section">
        <h3>Abilities & Spells</h3>

        {/* Path-style icon strip for all powers */}
        <div className="ability-icon-strip">
          {allPowers.map((power, idx) => (
            <button
              key={idx}
              className={`ability-icon-btn ${selectedAbilityIndex === idx ? 'selected' : ''}`}
              onClick={() => setSelectedAbilityIndex(idx)}
              title={power.name}
            >
              <img 
                src={getAbilityIconUrlLocal(power.icon)} 
                alt={power.name}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = getAbilityIconUrl('utility/question-mark');
                }}
              />
            </button>
          ))}
        </div>

        {/* Single card view for the selected power */}
        {allPowers[selectedAbilityIndex] && (
          <div className="spell-card-wrapper single">
            <UnifiedSpellCard
              spell={transformAbilityToSpell(allPowers[selectedAbilityIndex])}
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

  // Helper function to get adjacent tiles to a token
  const getAdjacentTiles = (tokenPosition) => {
    if (!tokenPosition || !gridSystem) return [];

    // Convert token world position to grid coordinates
    const gridCoords = gridSystem.worldToGrid(tokenPosition.x, tokenPosition.y);

    // Get all 8 adjacent tiles (including diagonals)
    const adjacentOffsets = [
      { x: -1, y: -1 }, { x: 0, y: -1 }, { x: 1, y: -1 },
      { x: -1, y: 0 },                   { x: 1, y: 0 },
      { x: -1, y: 1 },  { x: 0, y: 1 },  { x: 1, y: 1 }
    ];

    return adjacentOffsets.map(offset => ({
      gridX: gridCoords.x + offset.x,
      gridY: gridCoords.y + offset.y,
      worldPos: gridSystem.gridToWorld(gridCoords.x + offset.x, gridCoords.y + offset.y)
    }));
  };

  // Helper function to check if a tile is empty (no existing grid items)
  const isTileEmpty = (gridX, gridY) => {
    const { gridItems } = useGridItemStore.getState();
    return !gridItems.some(item =>
      item.gridPosition &&
      item.gridPosition.col === gridX &&
      item.gridPosition.row === gridY
    );
  };

  // Handle loot drop functionality
  const handleDropLoot = () => {
    if (!processedCreature.lootTable || !token) {
      return;
    }

    // Find the token for this creature
    const creatureToken = tokens.find(t => t.creatureId === creature.id);
    if (!creatureToken || !creatureToken.position) {
      return;
    }

    // Get adjacent tiles
    const adjacentTiles = getAdjacentTiles(creatureToken.position);
    const emptyTiles = adjacentTiles.filter(tile => isTileEmpty(tile.gridX, tile.gridY));

    if (emptyTiles.length === 0) {
      console.log(`No empty tiles around ${creature.name} to drop loot.`);
      return;
    }

    let droppedItems = [];
    let usedTiles = [];
    const currentUser = useInventoryStore.getState().characterName || 'Player';

    // Roll for currency
    if (processedCreature.lootTable.currency) {
      const { gold, silver, copper } = processedCreature.lootTable.currency;

      if (gold && gold.max > 0) {
        const goldAmount = Math.floor(Math.random() * (gold.max - gold.min + 1)) + gold.min;
        if (goldAmount > 0 && usedTiles.length < emptyTiles.length) {
          const tile = emptyTiles[usedTiles.length];
          const goldItem = {
            id: `gold_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
            name: `${goldAmount} Gold`,
            type: 'currency',
            subtype: 'gold',
            iconId: 'inv_misc_coin_01',
            quantity: 1, // Currency orbs are always quantity 1
            quality: 'poor',
            value: goldAmount,
            description: `${goldAmount} gold pieces`,
            source: `Dropped by ${creature.name}`,
            isCurrency: true,
            currencyType: 'gold',
            currencyValue: goldAmount
          };

          addItemToGrid(goldItem, {
            x: tile.worldPos.x,
            y: tile.worldPos.y,
            gridPosition: { row: tile.gridY, col: tile.gridX }
          }, true);

          // Note: Currency will be added to inventory when player clicks the loot orb
          // The loot orb system handles currency addition automatically

          droppedItems.push(`${goldAmount} Gold`);
          usedTiles.push(tile);
        }
      }

      if (silver && silver.max > 0) {
        const silverAmount = Math.floor(Math.random() * (silver.max - silver.min + 1)) + silver.min;
        if (silverAmount > 0 && usedTiles.length < emptyTiles.length) {
          const tile = emptyTiles[usedTiles.length];
          const silverItem = {
            id: `silver_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`,
            name: `${silverAmount} Silver`,
            type: 'currency',
            subtype: 'silver',
            iconId: 'inv_misc_coin_02',
            quantity: 1, // Currency orbs are always quantity 1
            quality: 'poor',
            value: silverAmount * 0.1,
            description: `${silverAmount} silver pieces`,
            source: `Dropped by ${creature.name}`,
            isCurrency: true,
            currencyType: 'silver',
            currencyValue: silverAmount
          };

          addItemToGrid(silverItem, {
            x: tile.worldPos.x,
            y: tile.worldPos.y,
            gridPosition: { row: tile.gridY, col: tile.gridX }
          }, true);

          // Note: Currency will be added to inventory when player clicks the loot orb
          // The loot orb system handles currency addition automatically

          droppedItems.push(`${silverAmount} Silver`);
          usedTiles.push(tile);
        }
      }
    }

    // Roll for items
    if (processedCreature.lootTable.items && processedCreature.lootTable.items.length > 0) {
      processedCreature.lootTable.items.forEach(item => {
        if (usedTiles.length >= emptyTiles.length) return; // No more empty tiles

        // Roll for drop chance
        const roll = Math.random() * 100;
        const dropChance = item.dropChance || 100;

        if (roll <= dropChance) {
          const tile = emptyTiles[usedTiles.length];

          // Create a copy of the item preserving the original ID for item store lookup
          // The grid system will generate its own unique grid item ID
          const droppedItem = {
            ...item,
            // IMPORTANT: Keep the original item ID so the grid system can find it in the item store
            // The grid system will create its own unique grid item ID internally
            source: `Dropped by ${creature.name}`,
            // Ensure essential properties are present
            width: item.width || 1,
            height: item.height || 1,
            stackable: item.stackable || (item.type === 'miscellaneous' || item.type === 'consumable'),
            maxStackSize: item.maxStackSize || (item.stackable ? 5 : 1),
            weight: item.weight || 1
          };

          addItemToGrid(droppedItem, {
            x: tile.worldPos.x,
            y: tile.worldPos.y,
            gridPosition: { row: tile.gridY, col: tile.gridX }
          }, true);

          droppedItems.push(item.name);
          usedTiles.push(tile);
        }
      });
    }

  };

  // Render the Loot section
  const renderLootSection = () => {
    if (!processedCreature.lootTable) {
      return (
        <div className="creature-inspect-section empty-section">
          <p>This creature has no loot.</p>
        </div>
      );
    }

    const hasCurrency = processedCreature.lootTable.currency?.gold?.max > 0 ||
                        processedCreature.lootTable.currency?.silver?.max > 0 ||
                        processedCreature.lootTable.currency?.copper?.max > 0;

    const hasItems = processedCreature.lootTable.items && processedCreature.lootTable.items.length > 0;

    if (!hasCurrency && !hasItems) {
      return (
        <div className="creature-inspect-section empty-section">
          <p>This creature has no loot.</p>
        </div>
      );
    }

    return (
      <div className="pathfinder-loot-container">
        {/* Loot Table Header */}
        <div className="pathfinder-loot-header">
          <div className="loot-header-content">
            <img
              src={getCustomIconUrl('Social/Golden Crown', 'abilities')}
              alt="Treasure"
              className="loot-header-icon"
              onError={(e) => handleImageError(e, 'Utility/Utility')}
            />
            <div className="loot-header-text">
              <h2 className="loot-header-title">Treasure Hoard</h2>
              <p className="loot-header-description">
                Riches and artifacts that may be found upon this creature's defeat
              </p>
            </div>
          </div>
          <button
            className="pathfinder-drop-loot-button"
            onClick={handleDropLoot}
            title="Roll for loot from this creature's treasure hoard and drop items on adjacent tiles"
          >
            <img
              src={getCustomIconUrl('Social/Golden Crown', 'abilities')}
              alt="Roll"
              className="button-icon"
              onError={(e) => handleImageError(e, 'Utility/Utility')}
            />
            <span>Roll for Loot</span>
          </button>
        </div>

        {/* Currency Section */}
        {hasCurrency && (
          <div className="pathfinder-loot-section">
            <div className="pathfinder-section-header">
              <img
                src={getCustomIconUrl('Social/Golden Crown', 'abilities')}
                alt="Currency"
                className="section-header-icon"
                onError={(e) => handleImageError(e, 'Utility/Utility')}
              />
              <h3 className="pathfinder-section-title">Currency</h3>
            </div>
            <div className="pathfinder-currency-grid">
              {processedCreature.lootTable.currency.gold?.max > 0 && (
                <div className="pathfinder-currency-item">
                  <div className="currency-icon-container">
                    <img
                      src={getIconUrl('Container/Coins/golden-coin-single-isometric', 'items')}
                      alt="Gold"
                      className="pathfinder-coin-icon gold"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items');
                      }}
                    />
                  </div>
                  <div className="currency-details">
                    <span className="currency-type">Gold Pieces</span>
                    <span className="currency-amount">
                      {processedCreature.lootTable.currency.gold.min === processedCreature.lootTable.currency.gold.max
                        ? processedCreature.lootTable.currency.gold.min
                        : `${processedCreature.lootTable.currency.gold.min}-${processedCreature.lootTable.currency.gold.max}`
                      }
                    </span>
                  </div>
                </div>
              )}
              {processedCreature.lootTable.currency.silver?.max > 0 && (
                <div className="pathfinder-currency-item">
                  <div className="currency-icon-container">
                    <img
                      src={getIconUrl('Container/Coins/golden-coin-single-isometric', 'items')}
                      alt="Silver"
                      className="pathfinder-coin-icon silver"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items');
                      }}
                    />
                  </div>
                  <div className="currency-details">
                    <span className="currency-type">Silver Pieces</span>
                    <span className="currency-amount">
                      {processedCreature.lootTable.currency.silver.min === processedCreature.lootTable.currency.silver.max
                        ? processedCreature.lootTable.currency.silver.min
                        : `${processedCreature.lootTable.currency.silver.min}-${processedCreature.lootTable.currency.silver.max}`
                      }
                    </span>
                  </div>
                </div>
              )}
              {processedCreature.lootTable.currency.copper?.max > 0 && (
                <div className="pathfinder-currency-item">
                  <div className="currency-icon-container">
                    <img
                      src={getIconUrl('Container/Coins/golden-coin-single-isometric', 'items')}
                      alt="Copper"
                      className="pathfinder-coin-icon copper"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items');
                      }}
                    />
                  </div>
                  <div className="currency-details">
                    <span className="currency-type">Copper Pieces</span>
                    <span className="currency-amount">
                      {processedCreature.lootTable.currency.copper.min === processedCreature.lootTable.currency.copper.max
                        ? processedCreature.lootTable.currency.copper.min
                        : `${processedCreature.lootTable.currency.copper.min}-${processedCreature.lootTable.currency.copper.max}`
                      }
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Items Section */}
        {hasItems && (
          <div className="pathfinder-loot-section">
            <div className="pathfinder-section-header">
              <img
                src={getCustomIconUrl('Utility/Ornate Symbol', 'abilities')}
                alt="Items"
                className="section-header-icon"
                onError={(e) => handleImageError(e, 'Utility/Utility')}
              />
              <h3 className="pathfinder-section-title">Magical Items & Equipment</h3>
            </div>
            <div className="loot-items-grid">
              {processedCreature.lootTable.items.map((item, index) => (
                <div
                  key={index}
                  className="loot-item-card"
                  onMouseEnter={(e) => {
                    setHoveredItem(item);
                    setTooltipPosition(calculateTooltipPosition(e));
                  }}
                  onMouseMove={(e) => {
                    if (hoveredItem && hoveredItem.id === item.id) {
                      setTooltipPosition(calculateTooltipPosition(e));
                    }
                  }}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <div className="loot-item-icon">
                    <img
                      src={getIconUrl(item.iconId || 'Misc/Books/book-brown-teal-question-mark', 'items')}
                      alt={item.name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getIconUrl('Misc/Books/book-brown-teal-question-mark', 'items');
                      }}
                    />
                    {item.quantity && item.quantity > 1 && (
                      <div className="loot-quantity">×{item.quantity}</div>
                    )}
                  </div>
                  <div
                    className="loot-item-name"
                    style={{ color: getQualityColor(item.quality || item.rarity || 'common') }}
                  >
                    {item.name || `Item #${index + 1}`}
                  </div>

                  {/* Drop chance info */}
                  <div className="loot-item-info">
                    {item.dropChance !== undefined && (
                      <div className="loot-drop-chance">{item.dropChance}%</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Close the main container */}
      </div>
    );
  };

  // Render the Description section
  const renderDescriptionSection = () => {
    return (
      <>
        <div className="creature-inspect-section">
          <div className="creature-description">
            {creature.description || "No description available."}
          </div>

          {creature.tags && creature.tags.length > 0 && (
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
      </>
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
    <WowWindow
      isOpen={true} // Always true since we're already checking isOpen above
      onClose={handleClose}
      defaultSize={{ width: 900, height: 700 }}
      defaultPosition={{ x: 100, y: 100 }} // Fixed position instead of calculated center
      centered={false} // Disable centering to prevent repositioning
      zIndex={20000} // Increased z-index to ensure it's above all other elements including the grid
      bounds="body"
      customHeader={
        <div className="spellbook-tab-container">
          {Object.entries(sections).map(([key, section]) => (
            <SmartTabButton
              key={key}
              title={section.title}
              active={activeSection === key}
              onClick={() => setActiveSection(key)}
            />
          ))}
        </div>
      }
    >
      <div className="creature-inspect-container">
        {/* Show stat groups navigation for Statistics section, otherwise show regular content */}
        {activeSection === 'statistics' ? (
          renderStatsSection()
        ) : (
          <div className="creature-content-area-full">
            <div className="creature-section-header">
              {sections[activeSection].icon && (
                <img
                  src={sections[activeSection].icon}
                  alt=""
                  className="creature-section-icon"
                  onError={(e) => handleImageError(e, 'Utility/Utility')}
                />
              )}
              <h2 className="creature-section-title">{sections[activeSection].title}</h2>
            </div>

            <div className="creature-section-content">
              {renderContent()}
            </div>
          </div>
        )}

        {/* Item Tooltip - Using TooltipPortal for highest z-index */}
        {hoveredItem && (
          <TooltipPortal>
            <div
              className="loot-item-tooltip-wrapper"
              style={{
                position: 'fixed',
                left: tooltipPosition.x,
                top: tooltipPosition.y,
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
    </WowWindow>,
    document.body
  );
};

export default EnhancedCreatureInspectView;
