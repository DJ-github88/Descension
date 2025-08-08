import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import WowWindow from '../../../windows/WowWindow';
import LootItemTooltip from '../loot/LootItemTooltip';
import TooltipPortal from '../../../tooltips/TooltipPortal';
import StatTooltip from '../../../tooltips/StatTooltip';
import GeneralStatTooltip from '../../../tooltips/GeneralStatTooltip';
import ResistanceTooltip from '../../../tooltips/ResistanceTooltip';
import { DAMAGE_TYPES } from '../../../spellcrafting-wizard/core/data/damageTypes';
import { WOW_ICON_BASE_URL } from '../../../item-generation/wowIcons';
import { getQualityColor } from '../../../../constants/itemConstants';
import useCreatureStore from '../../../../store/creatureStore';
import { processCreatureLoot } from '../../../../utils/lootItemUtils';
import './EnhancedCreatureInspectView.css';

// Helper function to calculate ability modifier
const calculateModifier = (value) => {
  return Math.floor((value - 10) / 2);
};

// Helper function to format modifier with + or - sign
const formatModifier = (mod) => {
  return mod >= 0 ? `+${mod}` : `${mod}`;
};

// Helper function to get icon URL
const getIconUrl = (iconId) => {
  return `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`;
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
    'shadow': 'Shadow',
    'holy': 'Holy',
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
    slashing: '#B22222'
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
  const [activeSection, setActiveSection] = useState('statistics');
  const [mounted, setMounted] = useState(false);
  const windowRef = useRef(null);
  const [hoveredItem, setHoveredItem] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [hoveredStat, setHoveredStat] = useState(null);
  const [statTooltipPosition, setStatTooltipPosition] = useState({ x: 0, y: 0 });
  const [selectedStatGroup, setSelectedStatGroup] = useState('summary');

  // Process the creature's loot items
  const creature = processCreatureLoot(initialCreature);

  // Helper function to calculate tooltip position
  const calculateTooltipPosition = (e) => {
    // Get window dimensions
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    // Default position
    let x = e.clientX + 15;
    let y = e.clientY - 10;

    // Adjust if tooltip would go off screen (assuming tooltip width ~300px and height ~400px)
    const tooltipWidth = 300;
    const tooltipHeight = 400;

    // Check right edge
    if (x + tooltipWidth > windowWidth - 20) {
      x = e.clientX - tooltipWidth - 15;
    }

    // Check bottom edge
    if (y + tooltipHeight > windowHeight - 20) {
      y = windowHeight - tooltipHeight - 20;
    }

    // Ensure tooltip is not positioned off-screen
    x = Math.max(20, x);
    y = Math.max(20, y);

    return { x, y };
  };

  // Debug logging for component lifecycle
  useEffect(() => {
    if (isOpen && creature) {
      console.log('EnhancedCreatureInspectView opened for:', creature.name);
      setMounted(true);
    }

    return () => {
      if (isOpen && creature) {
        console.log('EnhancedCreatureInspectView closing for:', creature.name);
      }
    };
  }, [isOpen, creature]);

  // Early return if no creature or not open
  if (!creature || !isOpen) return null;

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
      base: creature.stats[statName] || 0,
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
      icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg'
    },
    abilities: {
      title: 'Abilities & Spells',
      icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_magicalsentry.jpg'
    },
    skills: {
      title: 'Skills',
      icon: 'https://wow.zamimg.com/images/wow/icons/large/trade_engineering.jpg'
    },
    loot: {
      title: 'Loot Table',
      icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_coin_02.jpg'
    },
    description: {
      title: 'Description & Lore',
      icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_note_05.jpg'
    }
  };

  // Render the content based on the active section
  const renderContent = () => {
    switch (activeSection) {
      case 'statistics':
        return renderStatsSection();
      case 'abilities':
        return renderAbilitiesSection();
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
    // Define stat groups similar to character sheet
    const statGroups = {
      summary: {
        title: 'Combat Summary',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_book_11.jpg',
        description: 'Quick overview of combat statistics',
        stats: [
          {
            label: 'Health',
            value: token ? `${token.state.currentHp}/${creature.stats.maxHp}` : creature.stats.maxHp,
            baseValue: creature.stats.maxHp,
            tooltip: true,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_potion_54.jpg',
            color: '#ff4444',
            description: 'Current and maximum hit points'
          },
          {
            label: 'Mana',
            value: token ? `${token.state.currentMana}/${creature.stats.maxMana}` : creature.stats.maxMana,
            baseValue: creature.stats.maxMana,
            tooltip: creature.stats.maxMana > 0,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_potion_72.jpg',
            color: '#4444ff',
            description: 'Current and maximum mana points'
          },
          {
            label: 'Armor',
            value: creature.stats.armorClass || 10,
            tooltip: true,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_chest_plate09.jpg',
            color: '#888888',
            description: 'Defense against physical attacks'
          },
          {
            label: 'Initiative',
            value: formatModifier(creature.stats.initiative || 0),
            tooltip: true,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
            color: '#00ff00',
            description: 'Combat turn order modifier'
          }
        ].filter(stat => stat.tooltip !== false)
      },
      attributes: {
        title: 'Core Attributes',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofstamina.jpg',
        description: 'Base character attributes',
        stats: [
          { label: 'Strength', statName: 'strength', value: creature.stats.strength || 10, tooltip: true, modifier: calculateModifier(creature.stats.strength || 10) },
          { label: 'Agility', statName: 'agility', value: creature.stats.agility || 10, tooltip: true, modifier: calculateModifier(creature.stats.agility || 10) },
          { label: 'Constitution', statName: 'constitution', value: creature.stats.constitution || 10, tooltip: true, modifier: calculateModifier(creature.stats.constitution || 10) },
          { label: 'Intelligence', statName: 'intelligence', value: creature.stats.intelligence || 10, tooltip: true, modifier: calculateModifier(creature.stats.intelligence || 10) },
          { label: 'Spirit', statName: 'spirit', value: creature.stats.spirit || 10, tooltip: true, modifier: calculateModifier(creature.stats.spirit || 10) },
          { label: 'Charisma', statName: 'charisma', value: creature.stats.charisma || 10, tooltip: true, modifier: calculateModifier(creature.stats.charisma || 10) }
        ]
      },
      movement: {
        title: 'Movement & Senses',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_sprint.jpg',
        description: 'Movement speeds and sensory abilities',
        stats: [
          { label: 'Speed', value: `${creature.stats.speed || 30} ft`, tooltip: true },
          ...(creature.stats.flying > 0 ? [{ label: 'Flying Speed', value: `${creature.stats.flying} ft`, tooltip: true }] : []),
          ...(creature.stats.swimming > 0 ? [{ label: 'Swimming Speed', value: `${creature.stats.swimming} ft`, tooltip: true }] : []),
          ...(creature.stats.darkvision > 0 ? [{ label: 'Darkvision', value: `${creature.stats.darkvision} ft`, tooltip: true }] : []),
          {
            label: 'Passive Perception',
            value: 10 + calculateModifier(creature.stats.spirit || 10),
            tooltip: true,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_sealofwisdom.jpg',
            color: '#FFD700',
            description: 'Passive awareness of surroundings (10 + Spirit modifier)'
          }
        ]
      },
      combat: {
        title: 'Combat Statistics',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_savageblow.jpg',
        description: 'Combat capabilities and damage output',
        stats: [
          {
            label: 'Slashing Damage',
            value: Math.round(creature.stats.damage || Math.floor((creature.stats.strength || 10) / 2) || 0),
            tooltip: true,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_cleave.jpg',
            color: '#8B4513',
            description: 'Damage with swords, axes, and slashing weapons'
          },
          {
            label: 'Bludgeoning Damage',
            value: Math.round(creature.stats.damage || Math.floor((creature.stats.strength || 10) / 2) || 0),
            tooltip: true,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_mace_02.jpg',
            color: '#8B4513',
            description: 'Damage with maces, clubs, and bludgeoning weapons'
          },
          {
            label: 'Piercing Damage',
            value: Math.round(creature.stats.rangedDamage || Math.floor((creature.stats.agility || 10) / 2) || 0),
            tooltip: true,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_sword_33.jpg',
            color: '#8B4513',
            description: 'Damage with spears, daggers, and piercing weapons'
          },
          {
            label: 'Ranged Damage',
            value: Math.round(creature.stats.rangedDamage || Math.floor((creature.stats.agility || 10) / 2) || 0),
            tooltip: true,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_hunter_aimedshot.jpg',
            color: '#228B22',
            description: 'Damage with bows, crossbows, and thrown weapons'
          }
        ]
      },
      defensive: {
        title: 'Defensive Statistics',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_chest_plate02.jpg',
        description: 'Defensive capabilities and survivability',
        stats: [
          {
            label: 'Armor',
            value: Math.round(creature.stats.armor || creature.stats.armorClass || Math.floor((creature.stats.agility || 10) / 2) || 0),
            tooltip: true,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_chest_plate02.jpg',
            color: '#C0C0C0',
            description: 'Physical damage reduction'
          },
          {
            label: 'Dodge',
            value: Math.round(Math.floor((creature.stats.agility || 10) / 3) || 0),
            tooltip: true,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_rogue_evasion.jpg',
            color: '#AAD372',
            description: 'Chance to avoid attacks entirely'
          },
          {
            label: 'Max Health',
            value: Math.round(creature.stats.maxHp || creature.stats.hitPoints || 0),
            tooltip: true,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_potion_54.jpg',
            color: '#ff4444',
            description: 'Maximum hit points'
          },
          {
            label: 'Max Mana',
            value: Math.round(creature.stats.maxMana || creature.stats.manaPoints || 0),
            tooltip: true,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/inv_potion_72.jpg',
            color: '#4444ff',
            description: 'Maximum mana points'
          }
        ]
      },
      regeneration: {
        title: 'Regeneration & Healing',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_rejuvenation.jpg',
        description: 'Recovery and healing capabilities',
        stats: [
          {
            label: 'Health Regeneration',
            value: Math.round(creature.stats.healthRegen || Math.floor((creature.stats.constitution || 10) / 2) || 0),
            tooltip: true,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_nature_rejuvenation.jpg',
            color: '#44ff44',
            description: 'Health recovered per turn'
          },
          {
            label: 'Mana Regeneration',
            value: Math.round(creature.stats.manaRegen || Math.floor(((creature.stats.intelligence || 10) + (creature.stats.spirit || 10)) / 4) || 0),
            tooltip: true,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_magic_managain.jpg',
            color: '#6666ff',
            description: 'Mana recovered per turn'
          },
          {
            label: 'Healing Power',
            value: Math.round(creature.stats.healingPower || Math.floor((creature.stats.spirit || 10) / 2) || 0),
            tooltip: true,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_flashheal.jpg',
            color: '#ffff44',
            description: 'Bonus to healing spells and abilities'
          }
        ]
      },
      utility: {
        title: 'Utility & Senses',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_sealofwisdom.jpg',
        description: 'Sensory and utility capabilities',
        stats: [
          {
            label: 'Vision Range',
            value: `${Math.round(creature.stats.visionRange || 60)} ft`,
            tooltip: true,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_sealofwisdom.jpg',
            color: '#ffff44',
            description: 'Normal vision range in feet'
          },
          {
            label: 'Darkvision',
            value: `${Math.round(creature.stats.darkvision || 0)} ft`,
            tooltip: true,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_shadow_detectinvisibility.jpg',
            color: '#9370DB',
            description: 'Dark vision range in feet'
          },
          {
            label: 'Initiative',
            value: formatModifier(creature.stats.initiative || Math.floor((creature.stats.agility || 10) / 5) || 0),
            tooltip: true,
            icon: 'https://wow.zamimg.com/images/wow/icons/large/ability_warrior_charge.jpg',
            color: '#ff4444',
            description: 'Initiative bonus for combat order'
          }
        ]
      },
      resistances: {
        title: 'Damage Resistances',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_devotion.jpg',
        description: 'Resistance to different damage types',
        stats: [] // Will be populated with resistance data
      },
      savingThrows: {
        title: 'Saving Throws',
        icon: 'https://wow.zamimg.com/images/wow/icons/large/spell_holy_blessingofprotection.jpg',
        description: 'Proficiency in saving throws',
        stats: [] // Will be populated with saving throw data
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

          const getWowIconUrl = (damageTypeId) => {
            const iconMap = {
              fire: 'spell_fire_flamebolt',
              frost: 'spell_frost_frostbolt02',
              arcane: 'spell_nature_starfall',
              nature: 'spell_nature_acid_01',
              shadow: 'spell_shadow_shadowbolt',
              holy: 'spell_holy_holybolt',
              physical: 'ability_warrior_savageblow',
              bludgeoning: 'ability_warrior_punishingblow',
              piercing: 'ability_impalingbolt',
              slashing: 'ability_warrior_riposte',
              poison: 'spell_nature_corrosivebreath',
              acid: 'spell_nature_acid_01',
              lightning: 'spell_nature_lightning',
              thunder: 'spell_nature_thunderclap',
              radiant: 'spell_holy_searinglight',
              necrotic: 'spell_shadow_raisedead',
              psychic: 'spell_shadow_mindsteal',
              force: 'spell_nature_wispsplode'
            };
            return `https://wow.zamimg.com/images/wow/icons/large/${iconMap[damageTypeId] || 'inv_misc_questionmark'}.jpg`;
          };

            resistanceStats.push({
              label: damageType.name,
              value: getResistanceValue(levelStr),
              tooltip: true,
              icon: getWowIconUrl(damageTypeId),
              color: getResistanceColor(levelStr),
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
                strength: 'ability_warrior_savageblow',
                agility: 'ability_rogue_sprint',
                constitution: 'spell_holy_blessingofstamina',
                intelligence: 'spell_holy_magicalsentry',
                spirit: 'spell_holy_sealofwisdom',
                charisma: 'spell_holy_blessingofwisdom'
              };
              return `https://wow.zamimg.com/images/wow/icons/large/${iconMap[ability] || 'inv_misc_questionmark'}.jpg`;
            };

            savingThrowStats.push({
              label: `${ability.charAt(0).toUpperCase() + ability.slice(1)} Save`,
              value: formatModifier(totalBonus),
              tooltip: true,
              icon: getAbilityIcon(ability),
              color: '#4CAF50',
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

    const renderStatBlock = () => {
      const currentGroup = statGroups[selectedStatGroup];

      return (
        <div className="stats-content">
          {currentGroup.stats.map((stat, index) => (
            <div key={index} className="stat-row">
              <div className="stat-label-container">
                {stat.icon && (
                  <img
                    src={stat.icon}
                    alt={stat.label}
                    className="stat-icon"
                    style={stat.color ? { borderColor: stat.color } : {}}
                  />
                )}
                <div className="stat-info">
                  <span className="stat-label">{stat.label}:</span>
                  {stat.description && (
                    <span className="stat-description">{stat.description}</span>
                  )}
                </div>
              </div>
              <span className="stat-value" style={stat.color ? { color: stat.color } : {}}>
                {stat.value}
                {stat.modifier !== undefined && (
                  <span className="stat-modifier">
                    ({stat.modifier >= 0 ? '+' : ''}{stat.modifier})
                  </span>
                )}
              </span>
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
                      zIndex: 99999999
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
      <div className="stats-container">
        {/* Left sidebar with stat groups - these become the new left navigation */}
        <div className="stats-navigation">
          {Object.entries(statGroups).map(([key, group]) => (
            <button
              key={key}
              className={`stats-nav-button ${selectedStatGroup === key ? 'active' : ''}`}
              onClick={() => setSelectedStatGroup(key)}
            >
              <img src={group.icon} alt="" className="stats-nav-icon" />
              <span className="stats-nav-text">{group.title}</span>
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

  // Render the Skills section
  const renderSkillsSection = () => {
    if (!creature.stats.skills || Object.keys(creature.stats.skills).length === 0) {
      return (
        <div className="creature-inspect-section empty-section">
          <p>This creature has no special skills.</p>
        </div>
      );
    }

    return (
      <div className="stats-section">
        <h3>Skills</h3>
        <div className="stats-content">
          {Object.entries(creature.stats.skills).map(([skillId, bonus]) => {
            // Convert skill ID to display name
            const skillName = skillId.charAt(0).toUpperCase() + skillId.slice(1).replace(/([A-Z])/g, ' $1');

            // Handle both old proficiency system and new flat bonus system
            let skillBonus = 0;
            if (typeof bonus === 'number') {
              // New system: flat bonus
              skillBonus = bonus;
            } else if (typeof bonus === 'string') {
              // Old system: convert proficiency to flat bonus
              const abilityScore = creature.stats.spirit || 10; // Default to spirit for most skills
              const modifier = calculateModifier(abilityScore);
              const profBonus = creature.stats.proficiencyBonus || 2;

              if (bonus === 'proficient') {
                skillBonus = modifier + profBonus;
              } else if (bonus === 'expert') {
                skillBonus = modifier + (profBonus * 2);
              } else {
                skillBonus = modifier;
              }
            }

            const getSkillIcon = (skillId) => {
              const iconMap = {
                acrobatics: 'ability_rogue_sprint',
                animalHandling: 'ability_hunter_beastmastery',
                arcana: 'spell_holy_magicalsentry',
                athletics: 'ability_warrior_savageblow',
                deception: 'ability_rogue_disguise',
                history: 'inv_misc_book_11',
                insight: 'spell_holy_sealofwisdom',
                intimidation: 'ability_warrior_warcry',
                investigation: 'spell_holy_detectundead',
                medicine: 'spell_holy_flashheal',
                nature: 'spell_nature_rejuvenation',
                perception: 'ability_hunter_senseundead',
                performance: 'spell_holy_blessingofwisdom',
                persuasion: 'spell_holy_blessingofwisdom',
                religion: 'spell_holy_holybolt',
                sleightOfHand: 'ability_rogue_pickpocket',
                stealth: 'ability_stealth',
                survival: 'ability_hunter_pathfinding'
              };
              return `https://wow.zamimg.com/images/wow/icons/large/${iconMap[skillId] || 'trade_engineering'}.jpg`;
            };

            return (
              <div key={skillId} className="stat-row">
                <div className="stat-label-container">
                  <img
                    src={getSkillIcon(skillId)}
                    alt={skillName}
                    className="stat-icon"
                  />
                  <div className="stat-info">
                    <span className="stat-label">{skillName}:</span>
                    <span className="stat-description">Skill bonus modifier</span>
                  </div>
                </div>
                <span className="stat-value" style={{ color: '#2196F3' }}>
                  {formatModifier(skillBonus)}
                </span>
                <div
                  className="tooltip-trigger"
                  onMouseEnter={(e) => handleStatHover(e, skillName)}
                  onMouseMove={updateStatTooltipPosition}
                  onMouseLeave={handleStatLeave}
                />
                {hoveredStat === skillName && (
                  <TooltipPortal>
                    <div
                      className="equipment-slot-tooltip"
                      style={{
                        position: 'fixed',
                        left: statTooltipPosition.x,
                        top: statTooltipPosition.y,
                        transform: 'translate(10px, -50%)',
                        pointerEvents: 'none',
                        zIndex: 99999999
                      }}
                    >
                      <GeneralStatTooltip
                        stat={skillName}
                        value={skillBonus}
                        baseValue={skillBonus}
                        description={`Skill bonus for ${skillName.toLowerCase()}`}
                      />
                    </div>
                  </TooltipPortal>
                )}
              </div>
            );
          })}
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

  // Simple spell card component that doesn't require SpellLibraryProvider
  const SimpleSpellCard = ({ spell, onClick }) => {
    const getRarityClass = () => {
      const rarity = (spell.rarity || 'common').toLowerCase();
      return `spell-card-${rarity}`;
    };

    const getSchoolColor = () => {
      const school = (spell.school || 'evocation').toLowerCase();
      const schoolColors = {
        abjuration: '#4a90e2',
        conjuration: '#7b68ee',
        divination: '#ffd700',
        enchantment: '#ff69b4',
        evocation: '#ff4500',
        illusion: '#9370db',
        necromancy: '#8b0000',
        transmutation: '#32cd32'
      };
      return schoolColors[school] || '#ff4500';
    };

    return (
      <div
        className={`simple-spell-card ${getRarityClass()}`}
        onClick={onClick}
        style={{ borderColor: getSchoolColor() }}
      >
        <div className="spell-card-header">
          <img
            src={`https://wow.zamimg.com/images/wow/icons/large/${spell.icon || 'spell_holy_magicalsentry'}.jpg`}
            alt={spell.name}
            className="spell-card-icon"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg";
            }}
          />
          <div className="spell-card-info">
            <h4 className="spell-card-name">{spell.name}</h4>
            <div className="spell-card-meta">
              <span className="spell-level">Level {spell.level}</span>
              <span className="spell-school">{spell.school}</span>
            </div>
          </div>
        </div>

        <div className="spell-card-body">
          <div className="spell-card-details">
            <div className="spell-detail">
              <strong>Cast Time:</strong> {spell.castTime}
            </div>
            <div className="spell-detail">
              <strong>Range:</strong> {spell.range}
            </div>
            <div className="spell-detail">
              <strong>Duration:</strong> {spell.duration}
            </div>
            {spell.manaCost && (
              <div className="spell-detail">
                <strong>Cost:</strong> {spell.manaCost} {typeof spell.manaCost === 'number' ? 'Mana' : ''}
              </div>
            )}
          </div>

          {spell.description && (
            <div className="spell-card-description">
              {spell.description}
            </div>
          )}

          {spell.damage && (
            <div className="spell-card-damage">
              <strong>Damage:</strong> {typeof spell.damage === 'object'
                ? `${spell.damage.diceCount}d${spell.damage.diceType}${spell.damage.bonus > 0 ? `+${spell.damage.bonus}` : ''}`
                : spell.damage
              }
            </div>
          )}
        </div>
      </div>
    );
  };

  // Transform ability to spell format for spell cards
  const transformAbilityToSpell = (ability) => {
    return {
      id: ability.id || `ability-${ability.name}`,
      name: ability.name,
      level: ability.level || 1,
      school: ability.school || 'Evocation',
      rarity: ability.rarity || 'Common',
      icon: ability.icon || 'spell_holy_magicalsentry',
      description: ability.description,
      castTime: ability.castTime || 'Action',
      range: ability.range || '30 feet',
      duration: ability.duration || 'Instantaneous',
      components: ability.components || ['V', 'S'],
      manaCost: ability.manaCost || ability.actionPointCost || 1,
      damage: ability.damage,
      effects: ability.effects || []
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

    // Separate spells from regular abilities
    const spells = creature.abilities.filter(isSpellAbility);
    const regularAbilities = creature.abilities.filter(ability => !isSpellAbility(ability));

    return (
      <>
        {/* Spells Section */}
        {spells.length > 0 && (
          <div className="stats-section">
            <h3>Spells</h3>
            <div className="spell-cards-container">
              {spells.map((spell, index) => {
                const transformedSpell = transformAbilityToSpell(spell);
                return (
                  <div key={index} className="spell-card-wrapper">
                    <SimpleSpellCard
                      spell={transformedSpell}
                      onClick={() => {/* Spell interaction functionality can be added here */}}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Regular Abilities Section */}
        {regularAbilities.length > 0 && (
          <div className="stats-section">
            <h3>Abilities</h3>
            <div className="creature-abilities-list">
              {regularAbilities.map((ability, index) => (
            <div key={index} className="creature-ability-card">
              <div className="ability-header">
                <div className="ability-title-area">
                  <h3 className="ability-name">{ability.name}</h3>
                  <div className="ability-type-badge">
                    {formatAbilityType(ability.type)}
                  </div>
                </div>
                {ability.damage && (
                  <div className="ability-damage-badge">
                    {typeof ability.damage === 'object'
                      ? `${ability.damage.diceCount}d${ability.damage.diceType}${ability.damage.bonus > 0 ? `+${ability.damage.bonus}` : ''} ${formatDamageType(ability.damage.damageType || '')}`
                      : `${ability.damage} ${formatDamageType(ability.damageType || '')}`
                    }
                  </div>
                )}
              </div>

              <div className="ability-description">{ability.description}</div>

              <div className="ability-details">
                {(ability.actionPointCost || ability.apCost) && (
                  <div className="ability-stat">
                    <span className="ability-stat-label">Cost:</span>
                    <span className="ability-stat-value">{ability.actionPointCost || ability.apCost} AP</span>
                  </div>
                )}
                {ability.cooldown > 0 && (
                  <div className="ability-stat">
                    <span className="ability-stat-label">Cooldown:</span>
                    <span className="ability-stat-value">{ability.cooldown} rounds</span>
                  </div>
                )}
                {ability.range && (
                  <div className="ability-stat">
                    <span className="ability-stat-label">Range:</span>
                    <span className="ability-stat-value">{ability.range} ft.</span>
                  </div>
                )}
              </div>

              {ability.effects && ability.effects.length > 0 && (
                <div className="ability-effects">
                  <h4 className="effects-title">Effects</h4>
                  <ul className="effects-list">
                    {ability.effects.map((effect, effectIndex) => (
                      <li key={effectIndex} className="effect-item">
                        {effect.type === 'DAMAGE' || effect.type === 'damage' ? (
                          <span>
                            <span className="effect-type">Damage:</span> {effect.formula} {formatDamageType(effect.damageType)}
                          </span>
                        ) : effect.type === 'CONDITION' || effect.type === 'condition' ? (
                          <span>
                            <span className="effect-type">Condition:</span> {effect.condition} for {effect.duration} {effect.duration === 1 ? 'round' : 'rounds'}
                          </span>
                        ) : effect.type === 'SAVE' || effect.type === 'save' ? (
                          <span>
                            <span className="effect-type">Save:</span> DC {effect.dc} {effect.attribute} {effect.success ? `(${effect.success} damage on success)` : ''}
                          </span>
                        ) : effect.type === 'AREA' || effect.type === 'area' ? (
                          <span>
                            <span className="effect-type">Area:</span> {effect.shape} with {effect.size} ft. radius
                          </span>
                        ) : (
                          <span>{JSON.stringify(effect)}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
            </div>
          </div>
        )}
      </>
    );
  };

  // Handle loot drop functionality
  const handleDropLoot = () => {
    // TODO: Implement actual loot drop mechanics
    // This could involve:
    // 1. Rolling for each item based on drop chance
    // 2. Rolling currency amounts within min/max ranges
    // 3. Creating loot items on the game grid
    // 4. Notifying players of dropped loot
    alert(`Loot dropped for ${creature.name}! (Feature coming soon)`);
  };

  // Render the Loot section
  const renderLootSection = () => {
    if (!creature.lootTable) {
      return (
        <div className="creature-inspect-section empty-section">
          <p>This creature has no loot.</p>
        </div>
      );
    }

    const hasCurrency = creature.lootTable.currency?.gold?.max > 0 ||
                        creature.lootTable.currency?.silver?.max > 0 ||
                        creature.lootTable.currency?.copper?.max > 0;

    const hasItems = creature.lootTable.items && creature.lootTable.items.length > 0;

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
              src="https://wow.zamimg.com/images/wow/icons/large/inv_misc_coin_02.jpg"
              alt="Treasure"
              className="loot-header-icon"
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
            title="Roll for loot from this creature's treasure hoard"
          >
            <img
              src="https://wow.zamimg.com/images/wow/icons/large/inv_misc_dice_02.jpg"
              alt="Roll"
              className="button-icon"
            />
            <span>Roll for Loot</span>
          </button>
        </div>

        {/* Currency Section */}
        {hasCurrency && (
          <div className="pathfinder-loot-section">
            <div className="pathfinder-section-header">
              <img
                src="https://wow.zamimg.com/images/wow/icons/large/inv_misc_coin_01.jpg"
                alt="Currency"
                className="section-header-icon"
              />
              <h3 className="pathfinder-section-title">Currency</h3>
            </div>
            <div className="pathfinder-currency-grid">
              {creature.lootTable.currency.gold?.max > 0 && (
                <div className="pathfinder-currency-item">
                  <div className="currency-icon-container">
                    <img
                      src={`${WOW_ICON_BASE_URL}inv_misc_coin_01.jpg`}
                      alt="Gold"
                      className="pathfinder-coin-icon gold"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="%23ffd700" stroke="%23b8860b" stroke-width="2"/></svg>';
                      }}
                    />
                  </div>
                  <div className="currency-details">
                    <span className="currency-type">Gold Pieces</span>
                    <span className="currency-amount">
                      {creature.lootTable.currency.gold.min === creature.lootTable.currency.gold.max
                        ? creature.lootTable.currency.gold.min
                        : `${creature.lootTable.currency.gold.min}-${creature.lootTable.currency.gold.max}`
                      }
                    </span>
                  </div>
                </div>
              )}
              {creature.lootTable.currency.silver?.max > 0 && (
                <div className="pathfinder-currency-item">
                  <div className="currency-icon-container">
                    <img
                      src={`${WOW_ICON_BASE_URL}inv_misc_coin_03.jpg`}
                      alt="Silver"
                      className="pathfinder-coin-icon silver"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="%23c0c0c0" stroke="%23a0a0a0" stroke-width="2"/></svg>';
                      }}
                    />
                  </div>
                  <div className="currency-details">
                    <span className="currency-type">Silver Pieces</span>
                    <span className="currency-amount">
                      {creature.lootTable.currency.silver.min === creature.lootTable.currency.silver.max
                        ? creature.lootTable.currency.silver.min
                        : `${creature.lootTable.currency.silver.min}-${creature.lootTable.currency.silver.max}`
                      }
                    </span>
                  </div>
                </div>
              )}
              {creature.lootTable.currency.copper?.max > 0 && (
                <div className="pathfinder-currency-item">
                  <div className="currency-icon-container">
                    <img
                      src={`${WOW_ICON_BASE_URL}inv_misc_coin_05.jpg`}
                      alt="Copper"
                      className="pathfinder-coin-icon copper"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32"><circle cx="16" cy="16" r="14" fill="%23cd7f32" stroke="%23a0522d" stroke-width="2"/></svg>';
                      }}
                    />
                  </div>
                  <div className="currency-details">
                    <span className="currency-type">Copper Pieces</span>
                    <span className="currency-amount">
                      {creature.lootTable.currency.copper.min === creature.lootTable.currency.copper.max
                        ? creature.lootTable.currency.copper.min
                        : `${creature.lootTable.currency.copper.min}-${creature.lootTable.currency.copper.max}`
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
                src="https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_08.jpg"
                alt="Items"
                className="section-header-icon"
              />
              <h3 className="pathfinder-section-title">Magical Items & Equipment</h3>
            </div>
            <div className="pathfinder-items-grid">
              {creature.lootTable.items.map((item, index) => (
                <div
                  key={index}
                  className="pathfinder-loot-item"
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
                  <div className="pathfinder-item-header">
                    <div className="pathfinder-item-icon" style={{
                      backgroundImage: `url(${getIconUrl(item.iconId || 'inv_misc_questionmark')})`,
                      borderColor: getQualityColor(item.quality || item.rarity || 'common'),
                      boxShadow: `0 0 8px ${getQualityColor(item.quality || item.rarity || 'common')}60`
                    }}></div>
                    <div className="pathfinder-item-title-area">
                      <div className="pathfinder-item-name" style={{
                        color: getQualityColor(item.quality || item.rarity || 'common'),
                        textShadow: `0 0 4px ${getQualityColor(item.quality || item.rarity || 'common')}40`
                      }}>
                        {item.name || `Item #${index + 1}`}
                      </div>
                      <div className="pathfinder-item-type">
                        {item.type === 'weapon' ? (
                          <span>
                            {item.weaponSlot === 'TWO_HANDED' ? 'Two-Handed' :
                             item.weaponSlot === 'RANGED' ? 'Ranged' :
                             item.weaponSlot === 'ONE_HANDED' && item.hand === 'OFF_HAND' ? 'Off Hand' :
                             item.weaponSlot === 'ONE_HANDED' && item.hand === 'ONE_HAND' ? 'One Hand' :
                             item.weaponSlot === 'ONE_HANDED' && item.hand === 'MAIN_HAND' ? 'Main Hand' :
                             'Main Hand'} {item.subtype?.charAt(0).toUpperCase() + item.subtype?.slice(1).toLowerCase() || 'Weapon'}
                          </span>
                        ) : item.type === 'armor' ? (
                          <span>
                            {item.slots?.[0] === 'off_hand' ? 'Off Hand' :
                             item.slots?.[0]?.split('_').map(word =>
                                word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
                            ).join(' ') || 'Armor'} {item.subtype?.charAt(0).toUpperCase() + item.subtype?.slice(1).toLowerCase() || 'Armor'}
                          </span>
                        ) : (
                          <span>
                            {item.type && item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                            {item.subtype && ` • ${item.subtype.charAt(0).toUpperCase() + item.subtype.slice(1).toLowerCase()}`}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="pathfinder-item-stats">
                    {/* Show weapon damage for weapons */}
                    {item.type === 'weapon' && (
                      <div className="pathfinder-item-stat">
                        <span className="stat-label">Damage:</span>
                        <span className="stat-value">
                          {item.weaponStats?.baseDamage ? (
                            <>
                              {item.weaponStats.baseDamage.display?.base ||
                                `${item.weaponStats.baseDamage.diceCount || 1}d${item.weaponStats.baseDamage.diceType || 6}`.replace('dd', 'd')}
                              {item.weaponStats.baseDamage.bonusDamage > 0 && (
                                <span> +{item.weaponStats.baseDamage.bonusDamage}</span>
                              )}
                              {item.weaponStats.baseDamage.damageType && (
                                <span style={{
                                  color: getDamageTypeColor(item.weaponStats.baseDamage.damageType.toLowerCase())
                                }}> {item.weaponStats.baseDamage.damageType.toLowerCase()}</span>
                              )}
                            </>
                          ) : item.damage ? (
                            <>
                              {typeof item.damage === 'string' ? item.damage :
                               typeof item.damage === 'object' ?
                                `${item.damage.diceCount || 1}d${item.damage.diceType || 6}${item.damage.bonus > 0 ? ` +${item.damage.bonus}` : ''}` :
                                '1d6'}
                              {item.damageType && (
                                <span style={{
                                  color: getDamageTypeColor(item.damageType.toLowerCase())
                                }}> {item.damageType.toLowerCase()}</span>
                              )}
                            </>
                          ) : (
                            <>
                              1d6 <span style={{ color: getDamageTypeColor('physical') }}>physical</span>
                            </>
                          )}
                        </span>
                      </div>
                    )}

                    {/* Show armor for armor */}
                    {item.type === 'armor' && (
                      <div className="pathfinder-item-stat">
                        <span className="stat-label">Armor:</span>
                        <span className="stat-value">
                          {typeof item.armorClass === 'number' ? item.armorClass :
                           typeof item.combatStats?.armorClass === 'number' ? item.combatStats.armorClass :
                           typeof item.combatStats?.armorClass?.value === 'number' ? item.combatStats.armorClass.value :
                           10}
                        </span>
                      </div>
                    )}

                    {/* Show a primary stat if available */}
                    {item.baseStats && Object.keys(item.baseStats).length > 0 && (
                      <div className="pathfinder-item-stat">
                        <span className="stat-label">Bonus:</span>
                        <span className="stat-value">
                          {typeof Object.entries(item.baseStats)[0][1] === 'number' ? (
                            <>
                              {Object.entries(item.baseStats)[0][1] > 0 ? '+' : ''}
                              {Object.entries(item.baseStats)[0][1]} {Object.entries(item.baseStats)[0][0].charAt(0).toUpperCase() + Object.entries(item.baseStats)[0][0].slice(1)}
                            </>
                          ) : (
                            <>
                              {Object.entries(item.baseStats)[0][1].value > 0 ? '+' : ''}
                              {Object.entries(item.baseStats)[0][1].value} {Object.entries(item.baseStats)[0][0].charAt(0).toUpperCase() + Object.entries(item.baseStats)[0][0].slice(1)}
                              {Object.entries(item.baseStats)[0][1].isPercentage ? '%' : ''}
                            </>
                          )}
                        </span>
                      </div>
                    )}

                    {/* Show value for all items */}
                    <div className="pathfinder-item-stat">
                      <span className="stat-label">Value:</span>
                      <span className="stat-value pathfinder-item-value">
                        {item.value ? (
                          typeof item.value === 'object' ? (
                            <>
                              {item.value.gold > 0 && <span className="gold-value">{item.value.gold}g</span>}
                              {item.value.silver > 0 && <span className="silver-value">{item.value.silver}s</span>}
                              {item.value.copper > 0 && <span className="copper-value">{item.value.copper}c</span>}
                              {(!item.value.gold && !item.value.silver && !item.value.copper) && <span className="copper-value">0c</span>}
                            </>
                          ) : (
                            <span className="copper-value">{typeof item.value === 'string' || typeof item.value === 'number' ? item.value : '0c'}</span>
                          )
                        ) : <span className="copper-value">0c</span>}
                      </span>
                    </div>
                  </div>

                  <div className="pathfinder-item-footer">
                    <div className="pathfinder-drop-info">
                      <span className="drop-chance">
                        <img
                          src="https://wow.zamimg.com/images/wow/icons/large/inv_misc_dice_02.jpg"
                          alt="Drop Chance"
                          className="drop-icon"
                        />
                        {item.dropChance || 100}% chance
                      </span>
                      <span className="drop-quantity">
                        <img
                          src="https://wow.zamimg.com/images/wow/icons/large/inv_misc_bag_08.jpg"
                          alt="Quantity"
                          className="quantity-icon"
                        />
                        {item.quantity?.min === item.quantity?.max
                          ? `${item.quantity?.min || 1} item${(item.quantity?.min || 1) > 1 ? 's' : ''}`
                          : `${item.quantity?.min || 1}-${item.quantity?.max || 1} items`
                        }
                      </span>
                    </div>
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
        <div className="spellbook-tab-headers">
          {Object.entries(sections).map(([key, section]) => (
            <button
              key={key}
              className={`spellbook-tab ${activeSection === key ? 'active' : ''}`}
              onClick={() => setActiveSection(key)}
            >
              <img src={section.icon} alt="" className="tab-icon-img" />
              <span>{section.title}</span>
            </button>
          ))}
        </div>
      }
    >
      <div className="creature-inspect-container">
        {/* Show stat groups navigation for Statistics section, otherwise show regular content */}
        {activeSection === 'statistics' ? (
          renderStatsSection()
        ) : (
          <div className="creature-content-area">
            <div className="creature-section-header">
              <img
                src={sections[activeSection].icon}
                alt=""
                className="creature-section-icon"
              />
              <h2 className="creature-section-title">{sections[activeSection].title}</h2>
            </div>

            <div className="creature-section-content">
              {renderContent()}
            </div>
          </div>
        )}

        {/* Item Tooltip */}
        {hoveredItem && createPortal(
          <div
            className="loot-item-tooltip-wrapper"
            style={{
              position: 'fixed',
              left: tooltipPosition.x,
              top: tooltipPosition.y,
              zIndex: 10002, // Higher than the window
              pointerEvents: 'none'
            }}
          >
            <LootItemTooltip
              item={hoveredItem}
              dropChance={hoveredItem.dropChance || 100}
            />
          </div>,
          document.body
        )}
      </div>
    </WowWindow>,
    document.body
  );
};

export default EnhancedCreatureInspectView;
