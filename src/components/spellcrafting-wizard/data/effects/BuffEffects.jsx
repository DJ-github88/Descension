import React, { useState, useEffect } from 'react';
import StatusEffectConfigPopup from './StatusEffectConfigPopup';
import DiceFormulaExamples from '../../components/tooltips/DiceFormulaExamples';
import SpellSelector from '../../components/common/SpellSelector';
import './progressive-buff.css';

// Import data from utility files
import {
  BUFF_DURATIONS,
  BUFF_STACKING_RULES
} from '../../core/data/buffTypes';

import {
  PRIMARY_STAT_MODIFIERS,
  SECONDARY_STAT_MODIFIERS,
  COMBAT_STAT_MODIFIERS,
  DAMAGE_TYPE_MODIFIERS,
  RESISTANCE_MODIFIERS,
  UTILITY_STAT_MODIFIERS
} from '../../core/data/statModifier';

import Wc3Tooltip from '../../../tooltips/Wc3Tooltip';

// Status effects with WoW icons
const STATUS_EFFECTS = [
  {
    id: 'combat_advantage',
    name: 'Combat Advantage',
    description: 'Gain advantage on specific combat rolls',
    icon: 'classicon_warrior',
    category: 'combat',
    hasAdvancedConfig: true,
    options: [
      {
        id: 'attack_rolls',
        name: 'Attack Advantage',
        description: 'Gain advantage on attack rolls',
        icon: 'ability_rogue_quickdraw'
      },
      {
        id: 'damage_rolls',
        name: 'Damage Advantage',
        description: 'Gain advantage on damage rolls for specific damage types',
        icon: 'spell_fire_flamebolt',
        hasAdvancedConfig: true
      },
      {
        id: 'healing_rolls',
        name: 'Healing Advantage',
        description: 'Gain advantage on healing rolls',
        icon: 'spell_holy_holybolt',
        hasAdvancedConfig: true
      },
      {
        id: 'saving_throws',
        name: 'Defensive Stance',
        description: 'Gain advantage on saving throws',
        icon: 'ability_paladin_shieldofvengeance'
      },
      {
        id: 'initiative',
        name: 'Combat Readiness',
        description: 'Gain advantage on initiative rolls',
        icon: 'ability_hunter_mastermarksman'
      }
    ]
  },
  {
    id: 'skill_mastery',
    name: 'Skill Mastery',
    description: 'Gain advantage on specific skill checks',
    icon: 'classicon_rogue',
    category: 'skills',
    options: [
      {
        id: 'physical',
        name: 'Physical Prowess',
        description: 'Gain advantage on Strength and Dexterity checks',
        icon: 'inv_sword_04'
      },
      {
        id: 'mental',
        name: 'Mental Acuity',
        description: 'Gain advantage on Intelligence and Wisdom checks',
        icon: 'inv_misc_book_16'
      },
      {
        id: 'social',
        name: 'Social Grace',
        description: 'Gain advantage on Charisma checks',
        icon: 'inv_misc_gem_bloodstone_02'
      }
    ]
  },
  {
    id: 'empower_next',
    name: 'Empower Next',
    description: 'Enhance the power of your next action',
    icon: 'classicon_mage',
    category: 'empowerment',
    options: [
      {
        id: 'spell',
        name: 'Spell Surge',
        description: 'Your next spell deals maximum damage',
        icon: 'spell_fire_firebolt02'
      },
      {
        id: 'heal',
        name: 'Healing Surge',
        description: 'Your next healing spell heals for maximum value',
        icon: 'spell_holy_holybolt'
      },
      {
        id: 'weapon',
        name: 'Weapon Surge',
        description: 'Your next weapon attack deals maximum damage',
        icon: 'inv_sword_27'
      }
    ]
  },
  {
    id: 'damage_shield',
    name: 'Damage Shield',
    description: 'The next X hits against you deal reduced damage',
    icon: 'classicon_paladin',
    category: 'protection',
    options: [
      {
        id: 'physical',
        name: 'Physical Shield',
        description: 'Reduce physical damage from the next 3 hits by 50%',
        icon: 'inv_shield_04'
      },
      {
        id: 'magical',
        name: 'Spell Shield',
        description: 'Reduce magical damage from the next 3 hits by 50%',
        icon: 'spell_holy_magicalsentry'
      },
      {
        id: 'complete',
        name: 'Complete Shield',
        description: 'Reduce all damage from the next 2 hits by 75%',
        icon: 'inv_shield_82'
      }
    ]
  },

  {
    id: 'haste',
    name: 'Haste',
    description: 'Increase speed and reaction time',
    icon: 'ability_rogue_sprint',
    category: 'mobility',
    options: [
      {
        id: 'movement',
        name: 'Swift Movement',
        description: 'Increase movement speed',
        icon: 'ability_rogue_sprint'
      },
      {
        id: 'action',
        name: 'Quick Action',
        description: 'Gain additional action points',
        icon: 'ability_monk_flyingdragonkick'
      },
      {
        id: 'reaction',
        name: 'Fast Reactions',
        description: 'Gain additional reaction per round',
        icon: 'ability_warrior_challange'
      }
    ]
  },
  {
    id: 'elemental_infusion',
    name: 'Elemental Infusion',
    description: 'Infuse attacks with elemental energy',
    icon: 'spell_fire_immolation',
    category: 'empowerment',
    options: [
      {
        id: 'fire',
        name: 'Fire Infusion',
        description: 'Attacks deal additional fire damage',
        icon: 'spell_fire_flamebolt'
      },
      {
        id: 'frost',
        name: 'Frost Infusion',
        description: 'Attacks deal additional cold damage and slow targets',
        icon: 'spell_frost_frostbolt02'
      },
      {
        id: 'lightning',
        name: 'Lightning Infusion',
        description: 'Attacks deal additional lightning damage and may jump to nearby targets',
        icon: 'spell_nature_lightning'
      }
    ]
  },
  {
    id: 'invisibility',
    name: 'Invisibility',
    description: 'Become difficult or impossible to see',
    icon: 'ability_stealth',
    category: 'stealth',
    options: [
      {
        id: 'partial',
        name: 'Camouflage',
        description: 'Advantage on stealth checks, disadvantage on attacks against you',
        icon: 'ability_stealth'
      },
      {
        id: 'complete',
        name: 'Complete Invisibility',
        description: 'Become invisible until you attack or cast a spell',
        icon: 'spell_magic_invisibility'
      },
      {
        id: 'greater',
        name: 'Greater Invisibility',
        description: 'Remain invisible even when attacking',
        icon: 'spell_magic_greatcerinvisibility'
      }
    ]
  },
  {
    id: 'inspiration',
    name: 'Inspiration',
    description: 'Gain creative insight and mental clarity',
    icon: 'spell_holy_divinespirit',
    category: 'mental',
    options: [
      {
        id: 'focus',
        name: 'Mental Focus',
        description: 'Advantage on concentration checks for spells',
        icon: 'spell_arcane_mindmastery'
      },
      {
        id: 'insight',
        name: 'Tactical Insight',
        description: 'Gain advantage on tactics and strategy checks',
        icon: 'spell_holy_innerfire'
      },
      {
        id: 'creativity',
        name: 'Creative Surge',
        description: 'Gain advantage on creative and artistic checks',
        icon: 'inv_misc_book_17'
      }
    ]
  },

  {
    id: 'luck',
    name: 'Luck',
    description: 'Improve your fortune and chance of success',
    icon: 'inv_misc_gem_pearl_06',
    category: 'fortune',
    options: [
      {
        id: 'minor',
        name: 'Lucky Break',
        description: 'Reroll one failed roll',
        icon: 'inv_misc_coin_17'
      },
      {
        id: 'major',
        name: 'Fortune\'s Favor',
        description: 'Reroll any number of failed rolls during the duration',
        icon: 'inv_misc_gem_pearl_06'
      },
      {
        id: 'fate',
        name: 'Fate\'s Hand',
        description: 'Choose the result of one roll instead of rolling',
        icon: 'inv_misc_gem_diamond_03'
      }
    ]
  },
  {
    id: 'lifelink',
    name: 'Lifelink',
    description: 'Create a sympathetic bond that transfers resources between entities',
    icon: 'spell_shadow_lifedrain02',
    category: 'vampiric',
    hasAdvancedConfig: true,
    options: [
      {
        id: 'hp_to_hp',
        name: 'Health Link',
        description: 'Transfer health between entities',
        icon: 'spell_shadow_lifedrain'
      },
      {
        id: 'mana_to_mana',
        name: 'Mana Link',
        description: 'Transfer mana between entities',
        icon: 'spell_shadow_manaburn'
      },
      {
        id: 'hp_to_mana',
        name: 'Life to Mana',
        description: 'Convert health to mana',
        icon: 'spell_shadow_soulleech_2'
      },
      {
        id: 'mana_to_hp',
        name: 'Mana to Life',
        description: 'Convert mana to health',
        icon: 'spell_holy_divineillumination'
      },
      {
        id: 'damage_to_healing',
        name: 'Damage to Healing',
        description: 'Convert damage dealt to healing',
        icon: 'spell_shadow_lifedrain02'
      },
      {
        id: 'healing_to_damage',
        name: 'Healing to Damage',
        description: 'Convert healing done to bonus damage',
        icon: 'spell_shadow_bloodboil'
      }
    ]
  }
];

// Category icons
const CATEGORY_ICONS = {
  combat: 'inv_sword_27',
  skills: 'inv_misc_book_11',
  empowerment: 'spell_arcane_blast',
  protection: 'inv_shield_04',
  mobility: 'ability_rogue_sprint',
  stealth: 'ability_stealth',
  mental: 'spell_arcane_mindmastery',
  fortune: 'inv_misc_gem_pearl_06',
  vampiric: 'spell_shadow_lifedrain02',
  all: 'inv_misc_questionmark'
};

// Stacking rules with their descriptions and icons
const STACKING_RULES = [
  { id: 'exclusive', name: 'Exclusive', description: 'Only one buff of this type can be active at once', icon: 'inv_jewelcrafting_gem_37' },
  { id: 'highestValue', name: 'Highest Value', description: 'Multiple buffs of same type use the highest value only', icon: 'inv_jewelcrafting_gem_32' },
  { id: 'additive', name: 'Additive', description: 'Multiple buffs add their values together', icon: 'inv_jewelcrafting_gem_14' },
  { id: 'multiplicative', name: 'Multiplicative', description: 'Percentage-based effects multiply with each other', icon: 'inv_jewelcrafting_gem_16' },
  { id: 'selfStacking', name: 'Self-Stacking', description: 'Designed to accumulate multiple stacks of the same buff', icon: 'inv_misc_gem_amethyst_02' }
];

// Duration types
const DURATION_TYPES = [
  { id: 'rounds', name: 'Rounds', description: 'Combat rounds (approx. 6 seconds each)', icon: 'inv_misc_pocketwatch_01' },
  { id: 'minutes', name: 'Minutes', description: 'Real-time minutes', icon: 'inv_misc_pocketwatch_02' },
  { id: 'hours', name: 'Hours', description: 'Real-time hours', icon: 'inv_misc_pocketwatch_03' }
];

// Level icons
const LEVEL_ICONS = {
  minor: 'inv_misc_gem_diamond_05',
  moderate: 'inv_misc_gem_diamond_06',
  major: 'inv_misc_gem_diamond_07'
};

// Stat categories for tabs
const STAT_CATEGORIES = {
  primary: 'Primary Stats',
  secondary: 'Secondary Stats',
  combat: 'Combat Stats',
  damage: 'Damage Types',
  resistance: 'Resistances',
  utility: 'Utility'
};

const BuffEffects = ({ state, dispatch, actionCreators }) => {
  const [selectedStatCategory, setSelectedStatCategory] = useState('primary');
  const [selectedStatusCategory, setSelectedStatusCategory] = useState('all');
  const [statPreview, setStatPreview] = useState(null);
  const [statusEffectPreview, setStatusEffectPreview] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [tooltipContent, setTooltipContent] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showDiceExamples, setShowDiceExamples] = useState(false);

  // State for the status effect configuration popup
  const [configPopupOpen, setConfigPopupOpen] = useState(false);
  const [selectedStatusEffect, setSelectedStatusEffect] = useState(null);

  // Default buff configuration
  const defaultBuffConfig = {
    duration: 3, // Legacy field
    durationValue: 3,
    durationType: 'turns',
    durationUnit: 'rounds',
    restType: 'short',
    canBeDispelled: true,
    concentrationRequired: false,
    stackingRule: 'replace',
    maxStacks: 1,
    magnitude: 2,
    magnitudeType: 'flat',
    statModifiers: [],
    statusEffects: [],
    isProgressive: false,
    progressiveStages: []
  };

  // Initialize buff configuration with defaults
  const [buffConfig, setBuffConfig] = useState(state.buffConfig || defaultBuffConfig);

  useEffect(() => {
    // Initialize default buff configuration if not already set
    if (!buffConfig) {
      setBuffConfig(defaultBuffConfig);
    }

    // Always sync with global state
    dispatch(actionCreators.updateBuffConfig(buffConfig));
  }, [buffConfig]);

  // Initialize duration fields if not set
  useEffect(() => {
    // Check if we need to migrate from legacy duration format
    if (buffConfig && buffConfig.duration && !buffConfig.durationType) {
      const updatedConfig = { ...buffConfig };

      // If duration is -1, it means "until dispelled"
      if (buffConfig.duration === -1) {
        updatedConfig.durationType = 'permanent';
        updatedConfig.canBeDispelled = true;
      } else {
        // Otherwise, default to turns/rounds
        updatedConfig.durationType = 'turns';
        updatedConfig.durationValue = buffConfig.duration;
      }

      setBuffConfig(updatedConfig);
    }
  }, []);

  // Update buff configuration state (global settings)
  const updateBuffConfig = (key, value) => {
    setBuffConfig(prev => ({
      ...prev,
      [key]: value
    }));

    // If updating the global magnitude or magnitudeType, don't apply to existing modifiers
    // Each stat now has its own magnitude and type
  };

  // Show tooltip on hover
  const handleMouseEnter = (effect, e) => {
    // Check if this effect is selected/configured
    const isSelected = buffConfig.statusEffects?.some(e => e.id === effect.id);
    const selectedEffect = isSelected ? buffConfig.statusEffects.find(e => e.id === effect.id) : null;

    // Create WoW Classic style tooltip content
    const tooltipContent = (
      <div>
        <div className="tooltip-stat-line">
          {effect.description}
        </div>
        {effect.category === 'primary' && (
          <div className="tooltip-effect">
            Increases your character's {effect.name.toLowerCase()} attribute.
          </div>
        )}
        {effect.category === 'secondary' && (
          <div className="tooltip-effect">
            Enhances your {effect.name.toLowerCase()} stat.
          </div>
        )}
        {effect.category === 'resistance' && (
          <div className="tooltip-effect">
            Provides protection against {effect.name.toLowerCase()} damage.
          </div>
        )}
        {effect.category === 'damage' && (
          <div className="tooltip-effect">
            Increases the damage you deal with {effect.name.toLowerCase()} spells.
          </div>
        )}
        {effect.category === 'utility' && (
          <div className="tooltip-effect">
            Grants utility benefits related to {effect.name.toLowerCase()}.
          </div>
        )}

        {/* Show configured options if this effect is selected */}
        {isSelected && (
          <>
            <div className="tooltip-divider"></div>
            <div className="tooltip-section-header">Current Configuration:</div>

            {/* Show selected option */}
            {selectedEffect.option && effect.options && (
              <div className="tooltip-option">
                <span className="tooltip-bullet"></span>
                <span className="tooltip-gold">Option:</span> {
                  effect.options.find(o => o.id === selectedEffect.option)?.name || 'None'
                }
              </div>
            )}

            {/* Show level if applicable */}
            {selectedEffect.level && (
              <div className="tooltip-option">
                <span className="tooltip-bullet"></span>
                <span className="tooltip-gold">Level:</span> {selectedEffect.level}
              </div>
            )}

            {/* Show lifelink specific configuration */}
            {effect.id === 'lifelink' && (
              <>
                {selectedEffect.direction && (
                  <div className="tooltip-option">
                    <span className="tooltip-bullet"></span>
                    <span className="tooltip-gold">Direction:</span> {
                      selectedEffect.direction === 'caster_to_target' ? 'Caster to Target' :
                      selectedEffect.direction === 'target_to_caster' ? 'Target to Caster' :
                      'Bidirectional'
                    }
                  </div>
                )}

                {selectedEffect.sourceResource && selectedEffect.targetResource && (
                  <div className="tooltip-option">
                    <span className="tooltip-bullet"></span>
                    <span className="tooltip-gold">Resources:</span> {
                      `${selectedEffect.sourceResource} → ${selectedEffect.targetResource}`
                    }
                  </div>
                )}

                {selectedEffect.calculationType && (
                  <div className="tooltip-option">
                    <span className="tooltip-bullet"></span>
                    <span className="tooltip-gold">Calculation:</span> {
                      selectedEffect.calculationType === 'percentage' ? `${selectedEffect.conversionRate || 25}%` :
                      selectedEffect.calculationType === 'fixed' ? `Fixed (${selectedEffect.fixedAmount || 5})` :
                      selectedEffect.calculationType === 'dice' ? `${selectedEffect.diceCount || 1}${selectedEffect.diceType || 'd6'}` :
                      `${selectedEffect.diceCount || 1}${selectedEffect.diceType || 'd6'} per ${selectedEffect.perAmount || 5}`
                    }
                  </div>
                )}
              </>
            )}
          </>
        )}

        {/* Status effect available options (only show if not selected) */}
        {!isSelected && effect.options && (
          <>
            <div className="tooltip-divider"></div>
            <div className="tooltip-section-header">Available Options:</div>
            {effect.options.map((option, index) => (
              <div key={index} className="tooltip-option">
                <span className="tooltip-bullet"></span>
                <span className="tooltip-gold">{option.name}:</span> {option.description}
              </div>
            ))}
          </>
        )}

        {/* Duration information for status effects */}
        {effect.category && ['combat', 'mental', 'physical', 'sensory', 'magical'].includes(effect.category) && (
          <>
            <div className="tooltip-divider"></div>
            <div className="tooltip-casttime">
              <span className="tooltip-gold">Duration:</span> Varies based on spell power
            </div>
            <div className="tooltip-casttime">
              <span className="tooltip-gold">Type:</span> {effect.category.charAt(0).toUpperCase() + effect.category.slice(1)} Effect
            </div>
          </>
        )}
        <div className="tooltip-divider"></div>
        <div className="tooltip-flavor-text">
          {effect.category === 'primary' && "\"The very essence of your being grows stronger.\""}
          {effect.category === 'secondary' && "\"Your capabilities expand beyond normal limits.\""}
          {effect.category === 'resistance' && "\"Your body hardens against harmful energies.\""}
          {effect.category === 'damage' && "\"Your magical attacks surge with newfound power.\""}
          {effect.category === 'utility' && "\"Your adaptability to the world around you improves.\""}
          {effect.category === 'combat' && "\"Your allies stand in awe of your newfound might.\""}
          {effect.category === 'mental' && "\"Your mind transcends its former limitations.\""}
          {effect.category === 'physical' && "\"Your body moves with supernatural grace and power.\""}
          {effect.category === 'sensory' && "\"Your senses sharpen beyond mortal capacity.\""}
          {effect.category === 'magical' && "\"Arcane energy flows through you like never before.\""}
          {effect.category === 'vampiric' && "\"The boundaries between life forces blur at your command.\""}
        </div>
      </div>
    );

    // Store the tooltip data including title and icon
    setTooltipContent({
      content: tooltipContent,
      title: effect.name,
      icon: effect.icon
    });
    setShowTooltip(true);
    // Update position using client coordinates for fixed positioning
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  // Track mouse position during hover
  const handleMouseMove = (e) => {
    if (showTooltip) {
      // Use clientX/Y for fixed positioning relative to the viewport
      setMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  // Helper function to get icon URL
  const getIconUrl = (iconName) => {
    if (!iconName) return '';
    return `https://wow.zamimg.com/images/wow/icons/large/${iconName}.jpg`;
  };

  // Get stat modifiers by category
  const getStatModifiersByCategory = (category) => {
    // Define primary stat modifiers with an All option
    const PRIMARY_STAT_MODIFIERS_EXTENDED = [
      { id: 'all_primary_stats', name: 'All Primary Stats', icon: 'spell_holy_blessingofstrength', description: 'Increases all primary attributes', category: 'primary' },
      ...PRIMARY_STAT_MODIFIERS
    ];

    // Define damage type modifiers with an All option
    const DAMAGE_TYPE_MODIFIERS_EXTENDED = [
      { id: 'all_spell_damage', name: 'All Spell Damage', icon: 'spell_fire_flamebolt', description: 'Increases damage for all spell types', category: 'damage' },
      ...DAMAGE_TYPE_MODIFIERS
    ];

    // Define resistance modifiers specifically for the resistance tab
    const RESISTANCE_MODIFIERS = [
      { id: 'all_resistances', name: 'All Resistances', icon: 'spell_holy_divineshield', description: 'Increases resistance to all damage types', category: 'resistance' },
      { id: 'physical_resistance', name: 'Physical Resistance', icon: 'inv_shield_05', description: 'Increases resistance to physical damage', category: 'resistance' },
      { id: 'fire_resistance', name: 'Fire Resistance', icon: 'spell_fire_firearmor', description: 'Increases resistance to fire damage', category: 'resistance' },
      { id: 'cold_resistance', name: 'Cold Resistance', icon: 'spell_frost_frostarmor', description: 'Increases resistance to cold damage', category: 'resistance' },
      { id: 'lightning_resistance', name: 'Lightning Resistance', icon: 'spell_nature_lightningshield', description: 'Increases resistance to lightning damage', category: 'resistance' },
      { id: 'acid_resistance', name: 'Acid Resistance', icon: 'spell_nature_acid_01', description: 'Increases resistance to acid damage', category: 'resistance' },
      { id: 'necrotic_resistance', name: 'Necrotic Resistance', icon: 'spell_shadow_antishadow', description: 'Increases resistance to necrotic damage', category: 'resistance' },
      { id: 'radiant_resistance', name: 'Radiant Resistance', icon: 'spell_holy_blessingofprotection', description: 'Increases resistance to radiant damage', category: 'resistance' },
      { id: 'poison_resistance', name: 'Poison Resistance', icon: 'ability_creature_poison_02', description: 'Increases resistance to poison damage', category: 'resistance' },
      { id: 'psychic_resistance', name: 'Psychic Resistance', icon: 'spell_shadow_mindtwisting', description: 'Increases resistance to psychic damage', category: 'resistance' },
      { id: 'thunder_resistance', name: 'Thunder Resistance', icon: 'spell_nature_thunderclap', description: 'Increases resistance to thunder damage', category: 'resistance' },
      { id: 'force_resistance', name: 'Force Resistance', icon: 'spell_arcane_blast', description: 'Increases resistance to force damage', category: 'resistance' },
      { id: 'slashing_resistance', name: 'Slashing Resistance', icon: 'inv_sword_04', description: 'Increases resistance to slashing damage', category: 'resistance' },
      { id: 'piercing_resistance', name: 'Piercing Resistance', icon: 'inv_spear_06', description: 'Increases resistance to piercing damage', category: 'resistance' },
      { id: 'bludgeoning_resistance', name: 'Bludgeoning Resistance', icon: 'inv_mace_02', description: 'Increases resistance to bludgeoning damage', category: 'resistance' },
      { id: 'damage_immunity', name: 'Damage Immunity', icon: 'spell_holy_divineprotection', description: 'Grants immunity to all damage types', category: 'resistance' },
      { id: 'magic_immunity', name: 'Magic Immunity', icon: 'spell_arcane_prismaticcloak', description: 'Grants immunity to magical effects', category: 'resistance' },
      { id: 'damage_reduction', name: 'Damage Reduction', icon: 'spell_holy_devotionaura', description: 'Reduces all incoming damage by a percentage', category: 'resistance' }
    ];

    // Define secondary stat modifiers to include healing received
    const SECONDARY_STAT_MODIFIERS_EXTENDED = [
      ...SECONDARY_STAT_MODIFIERS,
      { id: 'healing_received', name: 'Healing Received', icon: 'spell_holy_healingaura', description: 'Increases effectiveness of healing received', category: 'secondary' }
    ];

    // Define utility modifiers
    const UTILITY_STAT_MODIFIERS = [
      { id: 'movement_speed', name: 'Movement Speed', icon: 'ability_rogue_sprint', description: 'Increases movement speed', category: 'utility' },
      { id: 'carrying_capacity', name: 'Carrying Capacity', icon: 'inv_misc_bag_08', description: 'Increases maximum weight you can carry', category: 'utility' },
      { id: 'swim_speed', name: 'Swim Speed', icon: 'ability_druid_aquaticform', description: 'Increases swimming speed', category: 'utility' },

      { id: 'mana_cost_reduction', name: 'Mana Cost Reduction', icon: 'spell_arcane_arcane01', description: 'Reduces mana cost of abilities', category: 'utility' },
      { id: 'vision_range', name: 'Vision Range', icon: 'ability_hunter_eagleeye', description: 'Increases distance at which you can see clearly', category: 'utility' }
    ];

    switch (category) {
      case 'primary':
        return PRIMARY_STAT_MODIFIERS_EXTENDED;
      case 'secondary':
        return SECONDARY_STAT_MODIFIERS_EXTENDED;
      case 'combat':
        return COMBAT_STAT_MODIFIERS;
      case 'damage':
        return DAMAGE_TYPE_MODIFIERS_EXTENDED;
      case 'resistance':
        return RESISTANCE_MODIFIERS;
      case 'utility':
        return UTILITY_STAT_MODIFIERS;
      default:
        return PRIMARY_STAT_MODIFIERS;
    }
  };

  // Function to render the dynamic stat indicator badge
  const renderStatIndicator = (stat) => {
    const selectedStat = buffConfig.statModifiers?.find(modifier => modifier.id === stat.id);

    if (!selectedStat) return null;

    let valueDisplay;
    if (typeof selectedStat.magnitude === 'string') {
      // It's a dice formula
      valueDisplay = selectedStat.magnitude;
    } else {
      // It's a number
      const sign = selectedStat.magnitude >= 0 ? '+' : '';
      valueDisplay = selectedStat.magnitudeType === 'percentage'
        ? `${sign}${selectedStat.magnitude}%`
        : `${sign}${selectedStat.magnitude}`;
    }

    return (
      <div className={`stat-indicator ${typeof selectedStat.magnitude === 'string' ? 'formula' : (selectedStat.magnitude < 0 ? 'negative' : 'positive')}`}>
        {valueDisplay}
      </div>
    );
  };

  // Add a stat modifier
  const addStatModifier = (stat) => {
    const existingModifiers = [...(buffConfig.statModifiers || [])];

    // Add the new modifier with its own magnitude and magnitudeType
    existingModifiers.push({
      ...stat,
      magnitude: buffConfig.magnitude || 2,
      magnitudeType: buffConfig.magnitudeType || 'flat'
    });

    setBuffConfig(prev => ({
      ...prev,
      statModifiers: existingModifiers
    }));
  };

  // Update an existing stat modifier's magnitude
  const updateStatModifierValue = (statId, magnitude) => {
    // Handle both numeric values and dice formula strings
    const updatedModifiers = buffConfig.statModifiers.map(mod => {
      if (mod.id === statId) {
        return {
          ...mod,
          magnitude
        };
      }
      return mod;
    });

    setBuffConfig(prev => ({
      ...prev,
      statModifiers: updatedModifiers
    }));
  };

  // Update an existing stat modifier's magnitude type
  const updateStatModifierType = (statId, magnitudeType) => {
    const updatedModifiers = buffConfig.statModifiers.map(mod => {
      if (mod.id === statId) {
        return {
          ...mod,
          magnitudeType
        };
      }
      return mod;
    });

    setBuffConfig(prev => ({
      ...prev,
      statModifiers: updatedModifiers
    }));
  };

  // Remove stat modifier from buff
  const removeStatModifier = (statId) => {
    if (!statId) return;

    const statModifiers = buffConfig.statModifiers || [];
    const newStatModifiers = statModifiers.filter(mod => mod.id !== statId);
    setBuffConfig(prev => ({
      ...prev,
      statModifiers: newStatModifiers
    }));
  };

  // Add status effect to buff
  const addStatusEffect = (effect) => {
    if (!effect) return;

    const statusEffects = buffConfig.statusEffects || [];
    const exists = statusEffects.some(e => e.id === effect.id);

    if (!exists) {
      // Only include essential properties, not default magnitude or type
      const newStatusEffect = {
        id: effect.id,
        name: effect.name,
        category: effect.category,
        icon: effect.icon || null,
        description: effect.description || '',
        hasAdvancedConfig: effect.hasAdvancedConfig || false,
        options: effect.options || []
      };

      setBuffConfig(prev => ({
        ...prev,
        statusEffects: [...statusEffects, newStatusEffect]
      }));
    }
  };

  // Remove status effect from buff
  const removeStatusEffect = (effectId) => {
    if (!effectId) return;

    const statusEffects = buffConfig.statusEffects || [];
    const newStatusEffects = statusEffects.filter(effect => effect.id !== effectId);
    setBuffConfig(prev => ({
      ...prev,
      statusEffects: newStatusEffects
    }));
  };

  // Open the configuration popup for a status effect
  const openStatusEffectConfig = (effect) => {
    setSelectedStatusEffect(effect);
    setConfigPopupOpen(true);
  };

  // Update status effect option
  const updateStatusEffectOption = (effectId, option) => {
    if (!effectId) return;

    const statusEffects = buffConfig.statusEffects || [];
    const newStatusEffects = statusEffects.map(effect => {
      if (effect.id === effectId) {
        return { ...effect, option };
      }
      return effect;
    });

    setBuffConfig(prev => ({
      ...prev,
      statusEffects: newStatusEffects
    }));
  };

  // Update status effect level
  const updateStatusEffectLevel = (effectId, level) => {
    if (!effectId) return;

    const statusEffects = buffConfig.statusEffects || [];
    const newStatusEffects = statusEffects.map(effect => {
      if (effect.id === effectId) {
        return { ...effect, level };
      }
      return effect;
    });

    setBuffConfig(prev => ({
      ...prev,
      statusEffects: newStatusEffects
    }));
  };

  // Get Status Effects by category
  const getStatusEffectsByCategory = (category) => {
    if (category === 'all') {
      return STATUS_EFFECTS;
    }

    return STATUS_EFFECTS.filter(effect => effect.category === category);
  };

  // Get detailed effect descriptions based on the selected effect type and intensity level
  const getEffectDescription = (effectId, optionId, level) => {
    const effect = STATUS_EFFECTS.find(e => e.id === effectId);
    if (!effect) return '';

    const option = effect.options?.find(o => o.id === optionId);
    if (!option) return effect.description;

    // Enhanced descriptions based on intensity level
    const intensityDescriptions = {
      minor: {
        combat_advantage: {
          attack_rolls: "You have advantage on your next attack roll",
          damage_rolls: "You have advantage on your next damage roll",
          healing_rolls: "You have advantage on your next healing roll",
          saving_throws: "You have advantage on your next saving throw",
          initiative: "You have advantage on your next initiative roll"
        },
        skill_mastery: {
          physical: "You have advantage on your next Strength or Dexterity check",
          mental: "You have advantage on your next Intelligence or Wisdom check",
          social: "You have advantage on your next Charisma check"
        },
        empower_next: {
          spell: "Your next spell deals 10% additional damage",
          heal: "Your next healing spell restores 10% additional hit points",
          weapon: "Your next weapon attack deals 10% additional damage"
        },
        damage_shield: {
          physical: "The next physical attack against you deals 25% less damage",
          magical: "The next magical attack against you deals 25% less damage",
          complete: "The next attack against you deals 25% less damage"
        },

        haste: {
          movement: "Movement speed increases by 10 feet",
          action: "Gain a bonus action once during the duration",
          reaction: "Gain an additional reaction once during the duration"
        },
        elemental_infusion: {
          fire: "Weapon attacks deal +1d4 fire damage",
          frost: "Weapon attacks deal +1d4 cold damage",
          lightning: "Weapon attacks deal +1d4 lightning damage"
        },
        invisibility: {
          partial: "You gain +5 to Stealth checks",
          complete: "You become invisible until you attack or cast a spell",
          greater: "You remain invisible for 1 round even after attacking"
        },
        inspiration: {
          focus: "+2 to concentration checks",
          insight: "+2 to Intelligence checks",
          creativity: "+2 to Charisma (Performance) checks"
        },

        luck: {
          minor: "You may reroll one d20 roll, but must accept the second result",
          major: "You may reroll up to three d20 rolls, but must accept the second results",
          fate: "You may choose the result of one d20 roll instead of rolling"
        }
      },
      moderate: {
        combat_advantage: {
          attack_rolls: "You have advantage on attack rolls",
          damage_rolls: "You have advantage on damage rolls for specific damage types",
          healing_rolls: "You have advantage on healing rolls and gain +1d6 bonus healing",
          saving_throws: "You have advantage on saving throws",
          initiative: "You have advantage on initiative rolls and gain +2 to the roll"
        },
        skill_mastery: {
          physical: "You have advantage on all Strength and Dexterity checks for the duration",
          mental: "You have advantage on all Intelligence and Wisdom checks for the duration",
          social: "You have advantage on all Charisma checks for the duration"
        },
        empower_next: {
          spell: "Your next spell deals 25% additional damage",
          heal: "Your next healing spell restores 25% additional hit points",
          weapon: "Your next weapon attack deals 25% additional damage"
        },
        damage_shield: {
          physical: "The next 2 physical attacks against you deal 50% less damage",
          magical: "The next 2 magical attacks against you deal 50% less damage",
          complete: "The next 2 attacks against you deal 50% less damage"
        },

        haste: {
          movement: "Movement speed doubles and you can take the Dash action as a bonus action",
          action: "Gain a bonus action each turn",
          reaction: "Gain an additional reaction each turn"
        },
        elemental_infusion: {
          fire: "Weapon attacks deal +2d4 fire damage, set targets on fire, and create a 10-foot fire aura",
          frost: "Weapon attacks deal +2d4 cold damage, reduce target's speed to 0, and create a 10-foot cold aura",
          lightning: "Weapon attacks deal +2d4 lightning damage, chain to up to 3 targets, and create a 10-foot lightning aura"
        },
        invisibility: {
          partial: "Attacks against you have disadvantage",
          complete: "You become invisible for the duration or until you attack",
          greater: "You remain invisible for the duration even when attacking once"
        },
        inspiration: {
          focus: "Advantage on concentration checks",
          insight: "Advantage on Intelligence checks and saves",
          creativity: "Advantage on all Charisma checks"
        },

        luck: {
          minor: "You may reroll three d20 rolls, taking the better result each time",
          major: "Any d20 roll of 9 or lower counts as a 10",
          fate: "Choose the result of one d20 roll instead of rolling, including critical hits"
        }
      },
      major: {
        combat_advantage: {
          attack_rolls: "You have advantage on all attack rolls and can reroll 1s",
          damage_rolls: "You have advantage on damage rolls for all physical and magical damage types",
          healing_rolls: "You have advantage on all healing rolls, can reroll 1s, and gain +2d6 bonus healing",
          saving_throws: "You have advantage on all saving throws and can reroll 1s",
          initiative: "You have advantage on initiative rolls and gain +5 to the roll"
        },
        skill_mastery: {
          physical: "You automatically succeed on Strength and Dexterity checks with DC 15 or lower",
          mental: "You automatically succeed on Intelligence and Wisdom checks with DC 15 or lower",
          social: "You automatically succeed on Charisma checks with DC 15 or lower"
        },
        empower_next: {
          spell: "Your next spell deals maximum damage possible",
          heal: "Your next healing spell restores the maximum amount possible",
          weapon: "Your next weapon attack deals maximum damage possible"
        },
        damage_shield: {
          physical: "The next 3 physical attacks against you deal 75% less damage",
          magical: "The next 3 magical attacks against you deal 75% less damage",
          complete: "The next 3 attacks against you deal 75% less damage"
        },

        haste: {
          movement: "Movement speed triples and you can take the Dash action as a bonus action",
          action: "You can take an additional action on each of your turns",
          reaction: "You can take any number of reactions per round"
        },
        elemental_infusion: {
          fire: "Weapon attacks deal +3d6 fire damage, set targets on fire, and create a 10-foot fire aura",
          frost: "Weapon attacks deal +3d6 cold damage, reduce target's speed to 0, and create a 10-foot cold aura",
          lightning: "Weapon attacks deal +3d6 lightning damage, chain to up to 3 targets, and create a 10-foot lightning aura"
        },
        invisibility: {
          partial: "You can Hide as a bonus action and gain +10 to Stealth checks",
          complete: "You and anything you're carrying become completely invisible until you choose to end it",
          greater: "You remain invisible for the duration even when attacking and casting spells"
        },
        inspiration: {
          focus: "You automatically succeed on concentration checks and gain +5 to spell save DC",
          insight: "You can add your proficiency bonus twice to Intelligence checks and saves",
          creativity: "You automatically succeed on Charisma checks with DC 20 or lower"
        },

        luck: {
          minor: "You may reroll five d20 rolls, taking the better result each time",
          major: "Any d20 roll of 9 or lower counts as a 10",
          fate: "Choose the result of three d20 rolls instead of rolling"
        }
      }
    };

    // Return the detailed description based on effect, option, and level
    if (intensityDescriptions[level]?.[effectId]?.[optionId]) {
      return intensityDescriptions[level][effectId][optionId];
    }

    // Fallback to basic description
    return option.description || effect.description;
  };

  // Set stat preview
  const showStatPreview = (stat) => {
    setStatPreview(stat);
  };

  // Clear stat preview
  const clearStatPreview = () => {
    setStatPreview(null);
  };

  return (
    <div className="spell-effects-container">
      <h3>Buff Configuration</h3>

      <div className="buff-config-section">
        <div className="effect-config-section">
          <h4>Duration</h4>

          <div className="effect-config-option">
            <label>Duration Type</label>
            <div className="effect-options">
              <button
                className={`effect-option-button ${buffConfig.durationType === 'turns' ? 'active' : ''}`}
                onClick={() => updateBuffConfig('durationType', 'turns')}
              >
                <span>Turns/Rounds</span>
              </button>
              <button
                className={`effect-option-button ${buffConfig.durationType === 'time' ? 'active' : ''}`}
                onClick={() => updateBuffConfig('durationType', 'time')}
              >
                <span>Time-Based</span>
              </button>
              <button
                className={`effect-option-button ${buffConfig.durationType === 'rest' ? 'active' : ''}`}
                onClick={() => updateBuffConfig('durationType', 'rest')}
              >
                <span>Rest-Based</span>
              </button>
              <button
                className={`effect-option-button ${buffConfig.durationType === 'permanent' ? 'active' : ''}`}
                onClick={() => updateBuffConfig('durationType', 'permanent')}
              >
                <span>Permanent</span>
              </button>
            </div>
          </div>

          {buffConfig.durationType === 'turns' && (
            <div className="effect-config-option">
              <label>Number of Turns/Rounds</label>
              <input
                type="number"
                min="1"
                max="100"
                value={buffConfig.durationValue || 3}
                onChange={(e) => {
                  updateBuffConfig('durationValue', parseInt(e.target.value));
                  // Also update legacy duration field for backward compatibility
                  updateBuffConfig('duration', parseInt(e.target.value));
                }}
              />
            </div>
          )}

          {buffConfig.durationType === 'time' && (
            <div className="effect-config-option">
              <div className="duration-time-input">
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={buffConfig.durationValue || 1}
                  onChange={(e) => {
                    updateBuffConfig('durationValue', parseInt(e.target.value));
                  }}
                />
                <select
                  value={buffConfig.durationUnit || 'minutes'}
                  onChange={(e) => {
                    updateBuffConfig('durationUnit', e.target.value);
                  }}
                >
                  <option value="seconds">Seconds</option>
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
              </div>
            </div>
          )}

          {buffConfig.durationType === 'rest' && (
            <div className="effect-config-option">
              <label>Rest Type</label>
              <div className="effect-options">
                <button
                  className={`effect-option-button ${buffConfig.restType === 'short' ? 'active' : ''}`}
                  onClick={() => updateBuffConfig('restType', 'short')}
                >
                  <span>Until Short Rest</span>
                </button>
                <button
                  className={`effect-option-button ${buffConfig.restType === 'long' ? 'active' : ''}`}
                  onClick={() => updateBuffConfig('restType', 'long')}
                >
                  <span>Until Long Rest</span>
                </button>
              </div>
            </div>
          )}

          {buffConfig.durationType === 'permanent' && (
            <div className="effect-config-option">
              <div className="toggle-options">
                <div className="toggle-option">
                  <button
                    className={`toggle-button ${buffConfig.canBeDispelled ? 'active' : ''}`}
                    onClick={() => updateBuffConfig('canBeDispelled', !buffConfig.canBeDispelled)}
                  >
                    <div className="toggle-icon">
                      {buffConfig.canBeDispelled ? '✓' : ''}
                    </div>
                    <span>Can Be Dispelled</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {(buffConfig.durationType === 'turns' || buffConfig.durationType === 'time') && (
            <div className="effect-config-option">
              <div className="toggle-options">
                <div className="toggle-option">
                  <button
                    className={`toggle-button ${buffConfig.concentrationRequired ? 'active' : ''}`}
                    onClick={() => updateBuffConfig('concentrationRequired', !buffConfig.concentrationRequired)}
                  >
                    <div className="toggle-icon">
                      {buffConfig.concentrationRequired ? '✓' : ''}
                    </div>
                    <span>Requires Concentration</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="config-option">
          <label>Stacking</label>
          <select
            value={buffConfig.stackingRule || 'replace'}
            onChange={(e) => {
              const newStackingRule = e.target.value;
              updateBuffConfig('stackingRule', newStackingRule);

              // Initialize progressiveStages array when selecting progressive stacking rule
              if (newStackingRule === 'progressive' && !buffConfig.progressiveStages) {
                updateBuffConfig('progressiveStages', []);
              }
            }}
            className="buff-dropdown"
          >
            {BUFF_STACKING_RULES.map(rule => (
              <option key={rule.value} value={rule.value}>
                {rule.label}
              </option>
            ))}
          </select>
        </div>

        <div className="config-option">
          <label>Max Stacks</label>
          <input
            type="number"
            value={buffConfig.maxStacks || 1}
            min="1"
            max="10"
            onChange={(e) => updateBuffConfig('maxStacks', parseInt(e.target.value))}
            disabled={buffConfig.stackingRule !== 'selfStacking' && buffConfig.stackingRule !== 'cumulative'}
          />
        </div>

        {/* Progressive buff configuration */}
        {buffConfig.stackingRule === 'progressive' && (
          <div className="progressive-buff-config">
            <div className="config-option">
              <div className="toggle-options">
                <div className="toggle-option">
                  <button
                    className={`toggle-button ${buffConfig.isProgressive ? 'active' : ''}`}
                    onClick={() => updateBuffConfig('isProgressive', !buffConfig.isProgressive)}
                  >
                    <div className="toggle-icon">
                      {buffConfig.isProgressive ? '✓' : ''}
                    </div>
                    <span>Enable Progressive Effect</span>
                  </button>
                </div>
              </div>
            </div>

            {buffConfig.isProgressive && (
              <div className="progressive-stages">
                <h4>Progressive Stages</h4>
                <p className="stage-description">Configure how the buff changes over time</p>

                {buffConfig.progressiveStages && buffConfig.progressiveStages.length > 0 ? (
                  <div className="stages-list">
                    {buffConfig.progressiveStages.map((stage, index) => (
                      <div key={index} className="stage-item">
                        <div className="stage-header">
                          <span className="stage-title">Stage {index + 1}</span>
                          <div className="stage-actions">
                            <button
                              className="stage-action delete"
                              onClick={() => {
                                const updatedStages = [...buffConfig.progressiveStages];
                                updatedStages.splice(index, 1);
                                updateBuffConfig('progressiveStages', updatedStages);
                              }}
                              title="Remove stage"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                        <div className="stage-content">
                          <div className="stage-timing">
                            <label>Trigger at:</label>
                            <div className="stage-timing-inputs">
                              <input
                                type="number"
                                min="1"
                                max={buffConfig.durationValue || 3}
                                value={stage.triggerAt || 1}
                                onChange={(e) => {
                                  const updatedStages = [...buffConfig.progressiveStages];
                                  updatedStages[index] = {
                                    ...updatedStages[index],
                                    triggerAt: parseInt(e.target.value)
                                  };
                                  updateBuffConfig('progressiveStages', updatedStages);
                                }}
                              />
                              <span className="unit-label">
                                {buffConfig.durationType === 'time' ? buffConfig.durationUnit || 'minutes' :
                                 buffConfig.durationType === 'rest' ? (buffConfig.restType === 'short' ? 'short rest' : 'long rest') :
                                 buffConfig.durationType === 'permanent' ? 'permanent' : 'rounds'}
                              </span>
                            </div>
                          </div>
                          <div className="stage-spell-effect">
                            <label>Trigger Spell (optional):</label>
                            <SpellSelector
                              selectedSpellId={stage.spellEffect || null}
                              onSpellSelect={(spellId, spellData) => {
                                console.log('BuffEffects - Received spell data:', spellId, spellData);
                                const updatedStages = [...buffConfig.progressiveStages];
                                updatedStages[index] = {
                                  ...updatedStages[index],
                                  spellEffect: spellId,
                                  spellData: spellData // Store the full spell data
                                };
                                updateBuffConfig('progressiveStages', updatedStages);
                              }}
                              label="Select a spell to trigger at this stage"
                            />
                          </div>

                          <div className="stage-stats">
                            <label>Stats Affected:</label>
                            <div className="stage-stats-selector">
                              {buffConfig.statModifiers && buffConfig.statModifiers.length > 0 ? (
                                <div className="stage-stats-list">
                                  {buffConfig.statModifiers.map(stat => {
                                    // Check if this stat is included in this stage
                                    const isIncluded = stage.statModifiers?.some(mod => mod.id === stat.id);

                                    return (
                                      <div key={stat.id} className={`stage-stat-item ${isIncluded ? 'included' : ''}`}>
                                        <div className="stage-stat-checkbox">
                                          <input
                                            type="checkbox"
                                            checked={isIncluded}
                                            onChange={() => {
                                              const updatedStages = [...buffConfig.progressiveStages];
                                              let updatedStatModifiers = [...(stage.statModifiers || [])];

                                              if (isIncluded) {
                                                // Remove this stat from the stage
                                                updatedStatModifiers = updatedStatModifiers.filter(mod => mod.id !== stat.id);
                                              } else {
                                                // Add this stat to the stage
                                                updatedStatModifiers.push({
                                                  id: stat.id,
                                                  name: stat.name,
                                                  icon: stat.icon,
                                                  magnitude: stage.magnitude || stat.magnitude || 2,
                                                  magnitudeType: stage.magnitudeType || stat.magnitudeType || 'flat'
                                                });
                                              }

                                              updatedStages[index] = {
                                                ...updatedStages[index],
                                                statModifiers: updatedStatModifiers
                                              };
                                              updateBuffConfig('progressiveStages', updatedStages);
                                            }}
                                          />
                                        </div>
                                        <div className="stage-stat-icon">
                                          <img src={getIconUrl(stat.icon)} alt={stat.name} />
                                        </div>
                                        <div className="stage-stat-name">{stat.name}</div>

                                        {isIncluded && (
                                          <div className="stage-stat-value">
                                            <input
                                              type="text"
                                              value={stage.statModifiers.find(mod => mod.id === stat.id)?.magnitude || ''}
                                              onChange={(e) => {
                                                const updatedStages = [...buffConfig.progressiveStages];
                                                const updatedStatModifiers = [...(stage.statModifiers || [])];
                                                const statIndex = updatedStatModifiers.findIndex(mod => mod.id === stat.id);

                                                if (statIndex !== -1) {
                                                  updatedStatModifiers[statIndex] = {
                                                    ...updatedStatModifiers[statIndex],
                                                    magnitude: e.target.value
                                                  };

                                                  updatedStages[index] = {
                                                    ...updatedStages[index],
                                                    statModifiers: updatedStatModifiers
                                                  };
                                                  updateBuffConfig('progressiveStages', updatedStages);
                                                }
                                              }}
                                              placeholder="Value or formula"
                                            />
                                            <select
                                              value={stage.statModifiers.find(mod => mod.id === stat.id)?.magnitudeType || 'flat'}
                                              onChange={(e) => {
                                                const updatedStages = [...buffConfig.progressiveStages];
                                                const updatedStatModifiers = [...(stage.statModifiers || [])];
                                                const statIndex = updatedStatModifiers.findIndex(mod => mod.id === stat.id);

                                                if (statIndex !== -1) {
                                                  updatedStatModifiers[statIndex] = {
                                                    ...updatedStatModifiers[statIndex],
                                                    magnitudeType: e.target.value
                                                  };

                                                  updatedStages[index] = {
                                                    ...updatedStages[index],
                                                    statModifiers: updatedStatModifiers
                                                  };
                                                  updateBuffConfig('progressiveStages', updatedStages);
                                                }
                                              }}
                                            >
                                              <option value="flat">Flat</option>
                                              <option value="percentage">Percentage</option>
                                            </select>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="no-stats-message">
                                  <p>No stats selected. Add stats to the buff first.</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-stages">No stages configured yet</div>
                )}

                <button
                  className="add-stage-button"
                  onClick={() => {
                    const progressiveStages = buffConfig.progressiveStages || [];

                    // Create stat modifiers for the new stage based on selected stats
                    const stageStatModifiers = buffConfig.statModifiers ?
                      buffConfig.statModifiers.map(stat => ({
                        id: stat.id,
                        name: stat.name,
                        icon: stat.icon,
                        magnitude: stat.magnitude || 2,
                        magnitudeType: stat.magnitudeType || 'flat'
                      })) : [];

                    const newStage = {
                      triggerAt: progressiveStages.length + 1,
                      statModifiers: stageStatModifiers,
                      spellEffect: null
                    };
                    updateBuffConfig('progressiveStages', [...progressiveStages, newStage]);
                  }}
                >
                  + Add Stage
                </button>
              </div>
            )}
          </div>
        )}

        {/* Default Magnitude and Default Type fields removed as they are configured when choosing a buff */}
      </div>

      {showDiceExamples && <DiceFormulaExamples />}

      <button
        className="dice-formula-help-button"
        onClick={() => setShowDiceExamples(!showDiceExamples)}
      >
        {showDiceExamples ? 'Hide Dice Formula Examples' : 'Show Dice Formula Examples'}
      </button>

      {buffConfig.statModifiers && buffConfig.statModifiers.length > 0 && (
        <div className="selected-stats">
          <h4>Selected Stats</h4>
          <div className="selected-stats-list">
            {buffConfig.statModifiers.map(stat => (
              <div className="selected-stat" key={stat.id}>
                <div className="stat-icon">
                  <img src={getIconUrl(stat.icon)} alt={stat.name} />
                </div>
                <div className="stat-info">
                  <div className="stat-name">{stat.name}</div>
                  <div className="stat-description">{stat.description}</div>
                </div>
                <div className="stat-value-controls">
                  <input
                    type="text"
                    className={`stat-value-input ${typeof stat.magnitude === 'string' ? 'formula' : (stat.magnitude < 0 ? 'negative' : 'positive')}`}
                    // Use defaultValue instead of value to allow clearing the field
                    defaultValue={typeof stat.magnitude === 'string' ? stat.magnitude : (stat.magnitudeType === 'percentage' ?
                      `${stat.magnitude >= 0 ? '+' : ''}${stat.magnitude}%` :
                      `${stat.magnitude >= 0 ? '+' : ''}${stat.magnitude}`)}
                    onBlur={(e) => {
                      let value = e.target.value;

                      // Handle empty field
                      if (value === '') {
                        updateStatModifierValue(stat.id, 0);
                        return;
                      }

                      // Remove the % sign and + sign for processing
                      if (stat.magnitudeType === 'percentage') {
                        value = value.replace(/%/g, '');
                      }
                      value = value.replace(/^\+/, '');

                      // Check if it's a valid number
                      const isNumber = !isNaN(parseFloat(value)) && isFinite(value);

                      // Check if it's a dice formula
                      // Handle 'd6' format (without a number prefix)
                      const diceRegex = /^-?d\d+|^-?\d+d\d+|^-?\d+d\d+k\d+|^-?\d+d\d+k\d+l/;
                      const isDiceFormula = diceRegex.test(value);

                      if (isNumber) {
                        updateStatModifierValue(stat.id, parseFloat(value));
                      } else if (isDiceFormula) {
                        // If it starts with 'd', add '1' prefix
                        if (value.startsWith('d')) {
                          value = '1' + value;
                        } else if (value.startsWith('-d')) {
                          value = '-1' + value.substring(1);
                        }
                        updateStatModifierValue(stat.id, value);
                      }
                    }}
                    onKeyDown={(e) => {
                      // Handle Enter key
                      if (e.key === 'Enter') {
                        e.target.blur(); // Trigger the onBlur event
                      }
                    }}
                    placeholder="Enter value or formula"
                    title="Examples: 5, 2d6, d20, -d4, 1d8+2"
                  />
                </div>
                <div className="stat-type-toggle">
                  <button
                    className={stat.magnitudeType === 'flat' ? 'active' : ''}
                    onClick={() => updateStatModifierType(stat.id, 'flat')}
                  >
                    Flat
                  </button>
                  <button
                    className={stat.magnitudeType === 'percentage' ? 'active' : ''}
                    onClick={() => updateStatModifierType(stat.id, 'percentage')}
                  >
                    %
                  </button>
                </div>
                <button
                  className="remove-stat"
                  onClick={() => removeStatModifier(stat.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="stat-selector-section">
        <h4>Choose Stats to Buff:</h4>

        <div className="stat-category-tabs">
          <button
            className={selectedStatCategory === 'primary' ? 'active' : ''}
            onClick={() => setSelectedStatCategory('primary')}
          >
            Primary Stats
          </button>
          <button
            className={selectedStatCategory === 'secondary' ? 'active' : ''}
            onClick={() => setSelectedStatCategory('secondary')}
          >
            Secondary Stats
          </button>
          <button
            className={selectedStatCategory === 'combat' ? 'active' : ''}
            onClick={() => setSelectedStatCategory('combat')}
          >
            Combat Stats
          </button>
          <button
            className={selectedStatCategory === 'damage' ? 'active' : ''}
            onClick={() => setSelectedStatCategory('damage')}
          >
            Damage Types
          </button>
          <button
            className={selectedStatCategory === 'resistance' ? 'active' : ''}
            onClick={() => setSelectedStatCategory('resistance')}
          >
            Resistances
          </button>
          <button
            className={selectedStatCategory === 'utility' ? 'active' : ''}
            onClick={() => setSelectedStatCategory('utility')}
          >
            Utility
          </button>
        </div>

        <div className="stat-cards-grid">
          {getStatModifiersByCategory(selectedStatCategory).map(stat => {
            const isSelected = buffConfig.statModifiers?.some(modifier => modifier.id === stat.id);

            return (
              <div
                key={stat.id}
                className={`stat-card ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  if (isSelected) {
                    removeStatModifier(stat.id);
                  } else {
                    addStatModifier(stat);
                  }
                }}
                onMouseEnter={(e) => handleMouseEnter(stat, e)}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={getIconUrl(stat.icon)}
                  alt={stat.name}
                  className="stat-icon"
                />
                <div className="stat-name">{stat.name}</div>
                {renderStatIndicator(stat)}
              </div>
            );
          })}
        </div>
      </div>

      <div className="status-effects-section">
        <h4>Status Effects</h4>

        <div className="status-category-tabs">
          <button
            className={selectedStatusCategory === 'all' ? 'active' : ''}
            onClick={() => setSelectedStatusCategory('all')}
          >
            All Effects
          </button>
          <button
            className={selectedStatusCategory === 'combat' ? 'active' : ''}
            onClick={() => setSelectedStatusCategory('combat')}
          >
            Combat
          </button>
          <button
            className={selectedStatusCategory === 'skills' ? 'active' : ''}
            onClick={() => setSelectedStatusCategory('skills')}
          >
            Skills
          </button>
          <button
            className={selectedStatusCategory === 'empowerment' ? 'active' : ''}
            onClick={() => setSelectedStatusCategory('empowerment')}
          >
            Empowerment
          </button>
          <button
            className={selectedStatusCategory === 'protection' ? 'active' : ''}
            onClick={() => setSelectedStatusCategory('protection')}
          >
            Protection
          </button>
          <button
            className={selectedStatusCategory === 'healing' ? 'active' : ''}
            onClick={() => setSelectedStatusCategory('healing')}
          >
            Healing
          </button>
          <button
            className={selectedStatusCategory === 'mobility' ? 'active' : ''}
            onClick={() => setSelectedStatusCategory('mobility')}
          >
            Mobility
          </button>
          <button
            className={selectedStatusCategory === 'stealth' ? 'active' : ''}
            onClick={() => setSelectedStatusCategory('stealth')}
          >
            Stealth
          </button>
          <button
            className={selectedStatusCategory === 'mental' ? 'active' : ''}
            onClick={() => setSelectedStatusCategory('mental')}
          >
            Mental
          </button>
          <button
            className={selectedStatusCategory === 'fortune' ? 'active' : ''}
            onClick={() => setSelectedStatusCategory('fortune')}
          >
            Fortune
          </button>
          <button
            className={selectedStatusCategory === 'vampiric' ? 'active' : ''}
            onClick={() => setSelectedStatusCategory('vampiric')}
          >
            Lifelink
          </button>
        </div>

        <div className="status-effects-grid">
          {getStatusEffectsByCategory(selectedStatusCategory).map(effect => {
            const isSelected = buffConfig.statusEffects?.some(e => e.id === effect.id);
            const selectedEffect = isSelected ? buffConfig.statusEffects.find(e => e.id === effect.id) : null;

            return (
              <div
                key={effect.id}
                className={`status-effect-card ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  if (isSelected) {
                    // If already selected, open the configuration popup
                    const selectedEffect = buffConfig.statusEffects.find(e => e.id === effect.id);
                    openStatusEffectConfig({
                      ...effect,
                      ...selectedEffect
                    });
                  } else {
                    // If not selected, add it first
                    addStatusEffect(effect);
                    // Then open the configuration popup
                    const newEffect = {
                      ...effect,
                      level: 'moderate',
                      option: effect.options && effect.options.length > 0 ? effect.options[0].id : null
                    };
                    openStatusEffectConfig(newEffect);
                  }
                }}
                onMouseEnter={(e) => handleMouseEnter(effect, e)}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              >
                <div className="status-effect-icon">
                  <img src={getIconUrl(effect.icon)} alt={effect.name} />
                </div>
                <div className="status-effect-name">{effect.name}</div>
                <div className="status-effect-description">{effect.description}</div>

                {isSelected && (
                  <button
                    className="status-effect-remove"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeStatusEffect(effect.id);
                    }}
                    title="Remove effect"
                  >
                    ×
                  </button>
                )}




              </div>
            );
          })}
        </div>
      </div>

      <Wc3Tooltip
        content={tooltipContent?.content}
        title={tooltipContent?.title}
        icon={tooltipContent?.icon}
        position={mousePos}
        isVisible={showTooltip}
      />

      {/* Status Effect Configuration Popup */}
      <StatusEffectConfigPopup
        isOpen={configPopupOpen}
        onClose={() => setConfigPopupOpen(false)}
        effect={selectedStatusEffect}
        selectedEffect={buffConfig}
        updateConfig={updateBuffConfig}
        configType="buff"
      />
    </div>
  );
};

export default BuffEffects;