import React, { useState, useEffect } from 'react';
import StatusEffectConfigPopup from './StatusEffectConfigPopup';
import DiceFormulaExamples from '../../components/tooltips/DiceFormulaExamples';
// Remove CSS imports to avoid circular dependencies
import Wc3Tooltip from '../../../tooltips/Wc3Tooltip';
import DebuffTriggerConfig from '../../components/effects/DebuffTriggerConfig';
import SpellSelector from '../../components/common/SpellSelector';
import './progressive-buff.css'; // Reuse the same CSS for progressive debuffs
import '../../styles/debuff-save-config.css'; // Import the saving throw configuration styles

// Import debuff types and status effects
import {
  DEBUFF_DURATIONS,
  DEBUFF_STACKING_RULE_OPTIONS,
  findDebuffCategoryById,
  findDebuffEffectById,
  getDebuffsByCategory
} from '../../core/data/debuffTypes';

import { NEGATIVE_STATUS_EFFECTS, COMBAT_DISADVANTAGES } from '../../core/data/statusEffects';

// Debuff types with WoW icons
const DEBUFF_TYPES = {
  VULNERABILITY: {
    id: 'vulnerability',
    name: 'Vulnerability',
    icon: 'spell_shadow_shadowwordpain',
    description: 'Increases damage taken or reduces resistances',
    category: 'vulnerability'
  },
  WEAKENING: {
    id: 'weakening',
    name: 'Weakening',
    icon: 'spell_shadow_curseofweakness',
    description: 'Reduces damage output or combat effectiveness',
    category: 'statReduction'
  },
  IMPAIRMENT: {
    id: 'impairment',
    name: 'Impairment',
    icon: 'spell_frost_chainsofice',
    description: 'Reduces movement speed or mobility',
    category: 'control'
  },
  CONFUSION: {
    id: 'confusion',
    name: 'Confusion',
    icon: 'spell_shadow_mindshear',
    description: 'Reduces accuracy or spell effectiveness',
    category: 'mental'
  },
  EXPOSURE: {
    id: 'exposure',
    name: 'Exposure',
    icon: 'spell_shadow_antishadow',
    description: 'Reduces armor or defensive capabilities',
    category: 'vulnerability'
  },
  DAMAGE: {
    id: 'damage',
    name: 'Damage Over Time',
    icon: 'spell_fire_immolation',
    description: 'Deals damage over time',
    category: 'damage'
  },
  CONTROL: {
    id: 'control',
    name: 'Control Effect',
    icon: 'spell_frost_stun',
    description: 'Restricts ability to move or act',
    category: 'control'
  },
  CURSE: {
    id: 'curse',
    name: 'Curse/Hex',
    icon: 'spell_shadow_antishadow',
    description: 'Powerful debuff with special removal requirements',
    category: 'cursehex'
  }
};

// Duration types
const DURATION_TYPES = [
  { id: 'rounds', name: 'Rounds', description: 'Combat rounds (approx. 6 seconds each)', icon: 'inv_misc_pocketwatch_01' },
  { id: 'minutes', name: 'Minutes', description: 'Real-time minutes', icon: 'inv_misc_pocketwatch_02' },
  { id: 'hours', name: 'Hours', description: 'Real-time hours', icon: 'inv_misc_pocketwatch_03' },
  { id: 'days', name: 'Days', description: 'In-game days', icon: 'inv_misc_pocketwatch_01' }
];

// Saving throw types with WoW icons
const SAVE_TYPES = [
  { id: 'strength', name: 'Strength', icon: 'spell_nature_strength', description: 'Physical power and force' },
  { id: 'agility', name: 'Agility', icon: 'ability_rogue_quickrecovery', description: 'Reflexes, balance, and coordination' },
  { id: 'constitution', name: 'Constitution', icon: 'spell_holy_devotionaura', description: 'Endurance and physical fortitude' },
  { id: 'intelligence', name: 'Intelligence', icon: 'spell_arcane_arcane02', description: 'Mental acuity and knowledge' },
  { id: 'spirit', name: 'Spirit', icon: 'spell_holy_holyguidance', description: 'Mental fortitude and willpower' },
  { id: 'charisma', name: 'Charisma', icon: 'spell_holy_powerinfusion', description: 'Force of personality' }
];

// Status effect levels
const SEVERITY_LEVELS = [
  { id: 'minor', name: 'Minor', icon: 'inv_misc_gem_diamond_05', description: 'Slight impairment' },
  { id: 'moderate', name: 'Moderate', icon: 'inv_misc_gem_diamond_06', description: 'Noticeable impairment' },
  { id: 'major', name: 'Major', icon: 'inv_misc_gem_diamond_07', description: 'Severe impairment' }
];

const STAT_CATEGORIES = {
  primary: 'Primary Stats',
  secondary: 'Secondary Stats',
  combat: 'Combat Stats',
  damage: 'Damage Types',
  resistance: 'Resistances',
  utility: 'Utility'
};

const DebuffEffects = ({ state, dispatch, actionCreators, getDefaultFormula }) => {
  const [selectedStatCategory, setSelectedStatCategory] = useState('primary');
  const [selectedStatusCategory, setSelectedStatusCategory] = useState('all');
  const [statPreview, setStatPreview] = useState(null);
  const [statusEffectPreview, setStatusEffectPreview] = useState(null);
  const [dotFormulaExamples, setDotFormulaExamples] = useState([]);
  const [debuffConfig, setDebuffConfig] = useState(state.debuffConfig || {});
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [tooltipContent, setTooltipContent] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [showDiceExamples, setShowDiceExamples] = useState(false);

  // State for the status effect configuration popup
  const [configPopupOpen, setConfigPopupOpen] = useState(false);
  const [selectedStatusEffect, setSelectedStatusEffect] = useState(null);

  // Default debuff configuration
  const defaultConfig = {
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
    statPenalties: [],
    statusEffects: [],
    isProgressive: false,
    progressiveStages: [],
    // Saving throw configuration
    difficultyClass: 15,
    savingThrow: 'constitution'
  };

  useEffect(() => {
    // Initialize default debuff configuration if not already set
    if (!debuffConfig) {
      setDebuffConfig(defaultConfig);
    }

    // Always sync with global state
    dispatch(actionCreators.updateDebuffConfig(debuffConfig));
  }, [debuffConfig]);

  // Initialize duration fields if not set
  useEffect(() => {
    // Check if we need to migrate from legacy duration format
    if (debuffConfig && debuffConfig.duration && !debuffConfig.durationType) {
      const updatedConfig = { ...debuffConfig };

      // If duration is -1, it means "until dispelled"
      if (debuffConfig.duration === -1) {
        updatedConfig.durationType = 'permanent';
        updatedConfig.canBeDispelled = true;
      } else {
        // Otherwise, default to turns/rounds
        updatedConfig.durationType = 'turns';
        updatedConfig.durationValue = debuffConfig.duration;
      }

      setDebuffConfig(updatedConfig);
    }
  }, []);

  // Update debuff configuration state (global settings)
  const updateDebuffConfig = (key, value) => {
    setDebuffConfig(prev => ({
      ...prev,
      [key]: value
    }));
    // If updating the global magnitude or magnitudeType, don't apply to existing modifiers
    // Each stat now has its own magnitude and type
  };

  // Add a stat penalty
  const addStatPenalty = (stat) => {
    const existingPenalties = [...(debuffConfig.statPenalties || [])];

    // Add the new penalty with its own magnitude and magnitudeType
    existingPenalties.push({
      ...stat,
      magnitude: debuffConfig.magnitude || 2,
      magnitudeType: debuffConfig.magnitudeType || 'flat'
    });

    setDebuffConfig(prev => ({
      ...prev,
      statPenalties: existingPenalties
    }));
  };

  // Update an existing stat penalty's magnitude
  const updateStatPenaltyValue = (statId, magnitude) => {
    // Handle both numeric values and dice formula strings
    const updatedPenalties = debuffConfig.statPenalties.map(pen => {
      if (pen.id === statId) {
        return {
          ...pen,
          magnitude
        };
      }
      return pen;
    });

    setDebuffConfig(prev => ({
      ...prev,
      statPenalties: updatedPenalties
    }));
  };

  // Update an existing stat penalty's magnitude type
  const updateStatPenaltyType = (statId, magnitudeType) => {
    const updatedPenalties = debuffConfig.statPenalties.map(pen => {
      if (pen.id === statId) {
        return {
          ...pen,
          magnitudeType
        };
      }
      return pen;
    });

    setDebuffConfig(prev => ({
      ...prev,
      statPenalties: updatedPenalties
    }));
  };

  // Remove stat penalty
  const removeStatPenalty = (statId) => {
    const statPenalties = debuffConfig.statPenalties || [];
    const newStatPenalties = statPenalties.filter(pen => pen.id !== statId);

    setDebuffConfig(prev => ({
      ...prev,
      statPenalties: newStatPenalties
    }));
  };

  // Function to render the dynamic stat indicator badge
  const renderStatIndicator = (stat) => {
    const selectedStat = debuffConfig.statPenalties?.find(penalty => penalty.id === stat.id);

    if (!selectedStat) return null;

    let valueDisplay;
    if (typeof selectedStat.magnitude === 'string') {
      // It's a dice formula
      valueDisplay = selectedStat.magnitude;
    } else {
      // It's a number
      // Allow both positive and negative values for debuffs
      const sign = selectedStat.magnitude >= 0 ? '+' : '';
      valueDisplay = selectedStat.magnitudeType === 'percentage'
        ? `${sign}${selectedStat.magnitude}%`
        : `${sign}${selectedStat.magnitude}`;
    }

    return (
      <div className={`stat-indicator ${typeof selectedStat.magnitude === 'string' ? 'formula' : (selectedStat.magnitude >= 0 ? 'positive' : 'negative')}`}>
        {valueDisplay}
      </div>
    );
  };

  // Add status effect to debuff
  const addStatusEffect = (effect) => {
    if (!effect) return;

    const statusEffects = debuffConfig.statusEffects || [];
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

      setDebuffConfig(prev => ({
        ...prev,
        statusEffects: [...statusEffects, newStatusEffect]
      }));
    }
  };

  // Remove status effect
  const removeStatusEffect = (effectId) => {
    const statusEffects = debuffConfig.statusEffects || [];
    const newStatusEffects = statusEffects.filter(effect => effect.id !== effectId);

    setDebuffConfig(prev => ({
      ...prev,
      statusEffects: newStatusEffects
    }));
  };

  // Update status effect option
  const updateStatusEffectOption = (effectId, option) => {
    const statusEffects = debuffConfig.statusEffects || [];
    const newStatusEffects = statusEffects.map(effect => {
      if (effect.id === effectId) {
        return { ...effect, option };
      }
      return effect;
    });

    setDebuffConfig(prev => ({
      ...prev,
      statusEffects: newStatusEffects
    }));
  };

  // Update status effect level
  const updateStatusEffectLevel = (effectId, level) => {
    const statusEffects = debuffConfig.statusEffects || [];
    const newStatusEffects = statusEffects.map(effect => {
      if (effect.id === effectId) {
        return { ...effect, level };
      }
      return effect;
    });

    setDebuffConfig(prev => ({
      ...prev,
      statusEffects: newStatusEffects
    }));
  };

  // Open the configuration popup for a status effect
  const openStatusEffectConfig = (effect) => {
    setSelectedStatusEffect(effect);
    setConfigPopupOpen(true);
  };

  // Show tooltip on hover
  const handleMouseEnter = (effect, e) => {
    // Check if this effect is selected/configured
    const isSelected = debuffConfig.statusEffects?.some(e => e.id === effect.id);
    const selectedEffect = isSelected ? debuffConfig.statusEffects.find(e => e.id === effect.id) : null;

    // Create WoW Classic style tooltip content
    const tooltipContent = (
      <div>
        <div className="tooltip-stat-line">
          {effect.description}
        </div>
        {effect.category === 'primary' && (
          <div className="tooltip-effect">
            <span className="tooltip-red">Reduces</span> your target's {effect.name.toLowerCase()} attribute.
          </div>
        )}
        {effect.category === 'secondary' && (
          <div className="tooltip-effect">
            <span className="tooltip-red">Weakens</span> your target's {effect.name.toLowerCase()} stat.
          </div>
        )}
        {effect.category === 'resistance' && (
          <div className="tooltip-effect">
            <span className="tooltip-red">Decreases</span> protection against {effect.name.toLowerCase()} damage.
          </div>
        )}
        {effect.category === 'damage' && (
          <div className="tooltip-effect">
            <span className="tooltip-red">Reduces</span> the damage dealt with {effect.name.toLowerCase()} spells.
          </div>
        )}
        {effect.category === 'utility' && (
          <div className="tooltip-effect">
            <span className="tooltip-red">Hinders</span> abilities related to {effect.name.toLowerCase()}.
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
            <div className="tooltip-section-header">Effect Variations:</div>
            {effect.options.map((option, index) => (
              <div key={index} className="tooltip-option">
                <span className="tooltip-bullet"></span>
                <span className="tooltip-red">{option.name}:</span> {option.description}
              </div>
            ))}
          </>
        )}

        {/* Duration and save information for status effects */}
        {effect.category && ['combat', 'mental', 'physical', 'sensory', 'magical'].includes(effect.category) && (
          <>
            <div className="tooltip-divider"></div>
            <div className="tooltip-casttime">
              <span className="tooltip-gold">Duration:</span> Varies based on spell power
            </div>
            <div className="tooltip-casttime">
              <span className="tooltip-gold">Type:</span> {effect.category.charAt(0).toUpperCase() + effect.category.slice(1)} Affliction
            </div>
            <div className="tooltip-requirement">
              <span className="tooltip-gold">Save:</span> Target may resist with appropriate saving throw
            </div>
          </>
        )}
        <div className="tooltip-divider"></div>
        <div className="tooltip-flavor-text">
          {effect.category === 'primary' && "\"Their strength fades like a dying flame.\""}
          {effect.category === 'secondary' && "\"Their capabilities diminish before your eyes.\""}
          {effect.category === 'resistance' && "\"Their defenses crumble against harmful forces.\""}
          {effect.category === 'damage' && "\"Their magical potency wanes under your influence.\""}
          {effect.category === 'utility' && "\"Their adaptability to the world falters.\""}
          {effect.category === 'combat' && "\"Their combat effectiveness deteriorates rapidly.\""}
          {effect.category === 'mental' && "\"Their mind clouds with confusion and doubt.\""}
          {effect.category === 'physical' && "\"Their body weakens under your malevolent spell.\""}
          {effect.category === 'sensory' && "\"Their perception of the world becomes distorted.\""}
          {effect.category === 'magical' && "\"Their connection to arcane forces is severed.\""}
          {effect.category === 'vampiric' && "\"Their life force is bound to yours through dark magic.\""}
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

  // Get stat modifiers by category
  const getStatModifiersByCategory = (category) => {
    // Define stat modifiers with proper icon paths and categories
    const PRIMARY_STAT_MODIFIERS = [
      { id: 'all_primary_stats', name: 'All Primary Stats', icon: 'spell_holy_blessingofstrength', description: 'Reduces all primary attributes', category: 'primary' },
      { id: 'strength', name: 'Strength', icon: 'spell_nature_strength', description: 'Reduces physical power and force', category: 'primary' },
      { id: 'agility', name: 'Agility', icon: 'ability_rogue_quickrecovery', description: 'Reduces reflexes, balance, and coordination', category: 'primary' },
      { id: 'constitution', name: 'Constitution', icon: 'spell_holy_devotionaura', description: 'Reduces endurance and physical fortitude', category: 'primary' },
      { id: 'intelligence', name: 'Intelligence', icon: 'spell_arcane_arcane02', description: 'Reduces mental acuity and knowledge', category: 'primary' },
      { id: 'spirit', name: 'Spirit', icon: 'spell_holy_holyguidance', description: 'Reduces mental fortitude and willpower', category: 'primary' },
      { id: 'charisma', name: 'Charisma', icon: 'spell_holy_powerinfusion', description: 'Reduces force of personality', category: 'primary' }
    ];

    const SECONDARY_STAT_MODIFIERS = [
      { id: 'armor_class', name: 'Armor Class', icon: 'inv_shield_04', description: 'Reduces defensive protection against attacks', category: 'secondary' },
      { id: 'initiative', name: 'Initiative', icon: 'ability_hunter_mastermarksman', description: 'Reduces combat reaction speed', category: 'secondary' },
      { id: 'max_health', name: 'Maximum Health', icon: 'inv_alchemy_elixir_04', description: 'Reduces maximum health', category: 'secondary' },
      { id: 'max_mana', name: 'Maximum Mana', icon: 'inv_alchemy_elixir_02', description: 'Reduces maximum mana', category: 'secondary' },
      { id: 'health_regen', name: 'Health Regeneration', icon: 'inv_potion_131', description: 'Reduces health regeneration rate', category: 'secondary' },
      { id: 'mana_regen', name: 'Mana Regeneration', icon: 'inv_potion_81', description: 'Reduces mana regeneration rate', category: 'secondary' },
      { id: 'action_points', name: 'Action Points', icon: 'spell_nature_timestop', description: 'Reduces available action points', category: 'secondary' },
      { id: 'healing_received', name: 'Healing Received', icon: 'spell_holy_healingaura', description: 'Reduces effectiveness of healing received', category: 'secondary' }
    ];

    const COMBAT_STAT_MODIFIERS = [
      { id: 'attack_bonus', name: 'Attack Bonus', icon: 'inv_sword_04', description: 'Reduces accuracy with attacks', category: 'combat' },
      { id: 'damage_bonus', name: 'Damage Bonus', icon: 'ability_warrior_decisivestrike', description: 'Reduces damage dealt with attacks', category: 'combat' },
      { id: 'critical_hit_chance', name: 'Critical Hit Chance', icon: 'ability_rogue_coldblood', description: 'Reduces likelihood of scoring critical hits', category: 'combat' },
      { id: 'critical_hit_damage', name: 'Critical Hit Damage', icon: 'ability_backstab', description: 'Reduces damage dealt by critical hits', category: 'combat' },
      { id: 'spell_penetration', name: 'Spell Penetration', icon: 'spell_arcane_blast', description: 'Reduces ability to penetrate spell resistance', category: 'combat' },
      { id: 'armor_class', name: 'Armor Class', icon: 'inv_shield_04', description: 'Reduces defense against physical attacks', category: 'combat' },
      { id: 'lifesteal', name: 'Lifesteal', icon: 'spell_shadow_lifedrain02', description: 'Reduces percentage of damage dealt converted to healing', category: 'combat' },
      { id: 'damage_reflection', name: 'Damage Reflection', icon: 'spell_fire_fireball02', description: 'Reduces percentage of damage reflected back to attacker', category: 'combat' }
    ];

    const DAMAGE_TYPE_MODIFIERS = [
      { id: 'all_spell_damage', name: 'All Spell Damage', icon: 'spell_fire_flamebolt', description: 'Reduces damage for all spell types', category: 'damage' },
      { id: 'physical_damage', name: 'Physical Damage', icon: 'inv_axe_02', description: 'Reduces physical damage output', category: 'damage' },
      { id: 'fire_damage', name: 'Fire Damage', icon: 'spell_fire_fire', description: 'Reduces fire damage output', category: 'damage' },
      { id: 'cold_damage', name: 'Cold Damage', icon: 'spell_frost_frostbolt', description: 'Reduces cold damage output', category: 'damage' },
      { id: 'lightning_damage', name: 'Lightning Damage', icon: 'spell_nature_lightning', description: 'Reduces lightning damage output', category: 'damage' },
      { id: 'acid_damage', name: 'Acid Damage', icon: 'spell_nature_acid_01', description: 'Reduces acid damage output', category: 'damage' },
      { id: 'necrotic_damage', name: 'Necrotic Damage', icon: 'spell_shadow_shadowbolt', description: 'Reduces necrotic damage output', category: 'damage' },
      { id: 'radiant_damage', name: 'Radiant Damage', icon: 'spell_holy_holybolt', description: 'Reduces radiant damage output', category: 'damage' },
      { id: 'force_damage', name: 'Force Damage', icon: 'spell_arcane_blast', description: 'Reduces force damage output', category: 'damage' },
      { id: 'poison_damage', name: 'Poison Damage', icon: 'ability_creature_poison_02', description: 'Reduces poison damage output', category: 'damage' },
      { id: 'psychic_damage', name: 'Psychic Damage', icon: 'spell_shadow_mindtwisting', description: 'Reduces psychic damage output', category: 'damage' },
      { id: 'thunder_damage', name: 'Thunder Damage', icon: 'spell_nature_thunderclap', description: 'Reduces thunder damage output', category: 'damage' },
      { id: 'slashing_damage', name: 'Slashing Damage', icon: 'inv_sword_04', description: 'Reduces slashing damage output', category: 'damage' },
      { id: 'piercing_damage', name: 'Piercing Damage', icon: 'inv_spear_06', description: 'Reduces piercing damage output', category: 'damage' },
      { id: 'bludgeoning_damage', name: 'Bludgeoning Damage', icon: 'inv_mace_02', description: 'Reduces bludgeoning damage output', category: 'damage' }
    ];

    // Define resistance modifiers specifically for the resistance tab
    const RESISTANCE_MODIFIERS = [
      { id: 'all_resistances', name: 'All Resistances', icon: 'spell_holy_divineshield', description: 'Reduces resistance to all damage types', category: 'resistance' },
      { id: 'physical_resistance', name: 'Physical Resistance', icon: 'inv_shield_05', description: 'Reduces resistance to physical damage', category: 'resistance' },
      { id: 'fire_resistance', name: 'Fire Resistance', icon: 'spell_fire_firearmor', description: 'Reduces resistance to fire damage', category: 'resistance' },
      { id: 'cold_resistance', name: 'Cold Resistance', icon: 'spell_frost_frostarmor', description: 'Reduces resistance to cold damage', category: 'resistance' },
      { id: 'lightning_resistance', name: 'Lightning Resistance', icon: 'spell_nature_lightningshield', description: 'Reduces resistance to lightning damage', category: 'resistance' },
      { id: 'acid_resistance', name: 'Acid Resistance', icon: 'spell_nature_acid_01', description: 'Reduces resistance to acid damage', category: 'resistance' },
      { id: 'necrotic_resistance', name: 'Necrotic Resistance', icon: 'spell_shadow_antishadow', description: 'Reduces resistance to necrotic damage', category: 'resistance' },
      { id: 'radiant_resistance', name: 'Radiant Resistance', icon: 'spell_holy_blessingofprotection', description: 'Reduces resistance to radiant damage', category: 'resistance' },
      { id: 'poison_resistance', name: 'Poison Resistance', icon: 'ability_creature_poison_02', description: 'Reduces resistance to poison damage', category: 'resistance' },
      { id: 'psychic_resistance', name: 'Psychic Resistance', icon: 'spell_shadow_mindtwisting', description: 'Reduces resistance to psychic damage', category: 'resistance' },
      { id: 'thunder_resistance', name: 'Thunder Resistance', icon: 'spell_nature_thunderclap', description: 'Reduces resistance to thunder damage', category: 'resistance' },
      { id: 'force_resistance', name: 'Force Resistance', icon: 'spell_arcane_blast', description: 'Reduces resistance to force damage', category: 'resistance' },
      { id: 'slashing_resistance', name: 'Slashing Resistance', icon: 'inv_sword_04', description: 'Reduces resistance to slashing damage', category: 'resistance' },
      { id: 'piercing_resistance', name: 'Piercing Resistance', icon: 'inv_spear_06', description: 'Reduces resistance to piercing damage', category: 'resistance' },
      { id: 'bludgeoning_resistance', name: 'Bludgeoning Resistance', icon: 'inv_mace_02', description: 'Reduces resistance to bludgeoning damage', category: 'resistance' },
      { id: 'damage_immunity', name: 'Damage Immunity', icon: 'spell_holy_divineprotection', description: 'Removes immunity to all damage types', category: 'resistance' },
      { id: 'magic_immunity', name: 'Magic Immunity', icon: 'spell_arcane_prismaticcloak', description: 'Removes immunity to magical effects', category: 'resistance' },
      { id: 'damage_reduction', name: 'Damage Reduction', icon: 'spell_holy_devotionaura', description: 'Reduces damage reduction percentage', category: 'resistance' }
    ];

    const UTILITY_STAT_MODIFIERS = [
      { id: 'movement_speed', name: 'Movement Speed', icon: 'ability_rogue_sprint', description: 'Reduces movement speed', category: 'utility' },
      { id: 'carrying_capacity', name: 'Carrying Capacity', icon: 'inv_misc_bag_08', description: 'Reduces maximum weight you can carry', category: 'utility' },
      { id: 'swim_speed', name: 'Swim Speed', icon: 'ability_druid_aquaticform', description: 'Reduces swimming speed', category: 'utility' },
      { id: 'flight_speed', name: 'Flight Speed', icon: 'ability_monk_flyingdragonkick', description: 'Reduces flying speed', category: 'utility' },
      { id: 'mana_cost_reduction', name: 'Mana Cost', icon: 'spell_arcane_arcane01', description: 'Increases mana cost of abilities', category: 'utility' },
      { id: 'vision_range', name: 'Vision Range', icon: 'ability_hunter_eagleeye', description: 'Reduces distance at which you can see clearly', category: 'utility' }
    ];

    switch (category) {
      case 'primary':
        return PRIMARY_STAT_MODIFIERS;
      case 'secondary':
        return SECONDARY_STAT_MODIFIERS;
      case 'combat':
        return COMBAT_STAT_MODIFIERS;
      case 'damage':
        return DAMAGE_TYPE_MODIFIERS;
      case 'resistance':
        return RESISTANCE_MODIFIERS;
      case 'utility':
        return UTILITY_STAT_MODIFIERS;
      default:
        return PRIMARY_STAT_MODIFIERS;
    }
  };

  // Get status effects by category
  const getStatusEffectsByCategory = (category) => {
    // Define status effects with proper icon paths and categories
    const STATUS_EFFECTS = [
      // Add combat disadvantages
      ...COMBAT_DISADVANTAGES.map(disadvantage => ({
        ...disadvantage,
        category: 'combat'
      })),
      {
        id: 'blinded',
        name: 'Blinded',
        description: 'Cannot see, automatically fails sight-based checks, disadvantage on attacks',
        icon: 'spell_shadow_eyeofthedarkmoon',
        category: 'sensory',
        options: [
          { id: 'partial', name: 'Partially Blinded', description: 'Vision severely obscured, disadvantage on perception', icon: 'spell_shadow_eyeofthedarkmoon' },
          { id: 'complete', name: 'Completely Blinded', description: 'Cannot see at all, automatically fail sight-based checks', icon: 'spell_shadow_misdirection' },
          { id: 'flash', name: 'Flash Blinded', description: 'Temporary blindness that fades over time', icon: 'spell_fire_fireball' }
        ]
      },
      {
        id: 'charmed',
        name: 'Charmed',
        description: 'Regards the charmer as a friendly acquaintance, cannot attack them',
        icon: 'spell_shadow_mindsteal',
        category: 'mental',
        options: [
          { id: 'friendly', name: 'Friendly Charm', description: 'Regards target as friend, still has free will', icon: 'spell_nature_eyeofthestorm' },
          { id: 'dominated', name: 'Domination', description: 'Must obey charmer\'s commands', icon: 'spell_shadow_mindsteal' },
          { id: 'infatuated', name: 'Infatuation', description: 'Will protect charmer at all costs', icon: 'spell_holy_prayerofspirit' }
        ]
      },
      {
        id: 'frightened',
        name: 'Frightened',
        description: 'Disadvantage on ability checks and attacks while source of fear is in sight',
        icon: 'spell_shadow_possession',
        category: 'mental',
        options: [
          { id: 'shaken', name: 'Shaken', description: 'Disadvantage on ability checks while fear source is visible', icon: 'spell_shadow_possession' },
          { id: 'terrified', name: 'Terrified', description: 'Cannot willingly move closer to the source of fear', icon: 'ability_warrior_warcry' },
          { id: 'panicked', name: 'Panicked', description: 'Must use actions to flee from source of fear', icon: 'spell_shadow_deathscream' }
        ]
      },
      {
        id: 'paralyzed',
        name: 'Paralyzed',
        description: 'Incapacitated, cannot move or speak, auto-fails STR and AGI saves',
        icon: 'spell_nature_stranglevines',
        category: 'physical',
        options: [
          { id: 'partial', name: 'Partially Paralyzed', description: 'Speed reduced to 0, disadvantage on AGI saves', icon: 'ability_rogue_sprint' },
          { id: 'complete', name: 'Completely Paralyzed', description: 'Cannot move or take actions at all', icon: 'spell_nature_stranglevines' },
          { id: 'magical', name: 'Magical Paralysis', description: 'Cannot move but can still cast non-somatic spells', icon: 'spell_arcane_mindmastery' }
        ]
      },
      {
        id: 'poisoned',
        name: 'Poisoned',
        description: 'Disadvantage on attack rolls and ability checks',
        icon: 'ability_rogue_poisonousanimosity',
        category: 'physical',
        options: [
          { id: 'weakening', name: 'Weakening Poison', description: 'Disadvantage on STR and CON checks and saves', icon: 'ability_rogue_poisonousanimosity' },
          { id: 'debilitating', name: 'Debilitating Poison', description: 'Takes damage over time', icon: 'spell_nature_corrosivebreath' },
          { id: 'paralyzing', name: 'Paralyzing Poison', description: 'May cause paralysis on failed save', icon: 'ability_poisonsting' }
        ]
      },
      {
        id: 'stunned',
        name: 'Stunned',
        description: 'Incapacitated, cannot move, auto-fails STR and AGI saves',
        icon: 'spell_frost_stun',
        category: 'physical',
        options: [
          { id: 'dazed', name: 'Dazed', description: 'Disadvantage on attacks and ability checks', icon: 'spell_nature_polymorph' },
          { id: 'unconscious', name: 'Unconscious', description: 'Falls prone, unable to act, attacks have advantage', icon: 'spell_nature_sleep' },
          { id: 'electric', name: 'Electric Stun', description: 'Muscles spasm, may conduct to nearby creatures', icon: 'spell_nature_lightning' }
        ]
      },
      {
        id: 'restrained',
        name: 'Restrained',
        description: 'Speed becomes 0, disadvantage on attacks, advantage on attacks against them',
        icon: 'ability_warrior_throwdown',
        category: 'physical',
        options: [
          { id: 'ensnared', name: 'Ensnared', description: 'Caught in vines, webs, or similar restraints', icon: 'spell_nature_earthbindtotem' },
          { id: 'grappled', name: 'Grappled', description: 'Held by a creature, can attempt to break free', icon: 'ability_warrior_throwdown' },
          { id: 'bound', name: 'Bound', description: 'Tied up with rope or chains, very difficult to escape', icon: 'inv_misc_rope_01' }
        ]
      },
      {
        id: 'silenced',
        name: 'Silenced',
        description: 'Cannot speak or cast spells with verbal components',
        icon: 'spell_holy_silence',
        category: 'magical',
        options: [
          { id: 'magical', name: 'Magical Silence', description: 'No sound can be created within an area', icon: 'spell_holy_silence' },
          { id: 'muted', name: 'Muted', description: 'Individual cannot speak but other sounds function normally', icon: 'spell_holy_sealofsacrifice' },
          { id: 'temporal', name: 'Temporal Stutter', description: 'Speech and verbal casting unreliable, may fail', icon: 'spell_arcane_portalironforge' }
        ]
      },
      {
        id: 'slowed',
        name: 'Slowed',
        description: 'Movement speed and action points reduced',
        icon: 'spell_frost_frostshock',
        category: 'physical',
        options: [
          { id: 'hindered', name: 'Hindered Movement', description: 'Movement speed reduced by half', icon: 'ability_rogue_trip' },
          { id: 'lethargic', name: 'Lethargy', description: 'Action points reduced each round', icon: 'spell_frost_frostshock' },
          { id: 'temporal', name: 'Temporal Slowness', description: 'Actions take longer to perform', icon: 'spell_frost_freezingbreath' }
        ]
      },
      {
        id: 'burning',
        name: 'Burning',
        description: 'Taking continuous fire damage and may spread to nearby flammable objects',
        icon: 'spell_fire_soulburn',
        category: 'elemental',
        options: [
          { id: 'mild', name: 'Mild Burn', description: 'Low damage over time', icon: 'spell_fire_fire' },
          { id: 'intense', name: 'Intense Burn', description: 'Moderate damage with additional effects', icon: 'spell_fire_soulburn' },
          { id: 'magical', name: 'Magical Fire', description: 'Cannot be extinguished by normal means', icon: 'spell_fire_lavaspawn' }
        ]
      },
      {
        id: 'frozen',
        name: 'Frozen',
        description: 'Movement slowed or stopped and taking cold damage',
        icon: 'spell_frost_glacier',
        category: 'elemental',
        options: [
          { id: 'chilled', name: 'Chilled', description: 'Slowed movement and reduced dexterity', icon: 'spell_frost_frostbolt' },
          { id: 'frostbitten', name: 'Frostbitten', description: 'Painful cold damage with lasting effects', icon: 'spell_frost_frostbolt02' },
          { id: 'frozen', name: 'Frozen Solid', description: 'Completely immobilized in ice', icon: 'spell_frost_glacier' }
        ]
      },
      // Additional status effects
      {
        id: 'weakened',
        name: 'Weakened',
        description: 'Physical might is reduced, limiting damage output',
        icon: 'spell_shadow_curseofweakness',
        category: 'physical',
        options: [
          { id: 'fatigued', name: 'Fatigued', description: 'Reduced physical damage and encumbrance', icon: 'spell_shadow_curseofweakness' },
          { id: 'exhausted', name: 'Exhausted', description: 'Severe reduction to physical capabilities', icon: 'ability_creature_poison_03' },
          { id: 'drained', name: 'Drained', description: 'Life force sapped, may collapse from exhaustion', icon: 'spell_shadow_lifedrain02' }
        ]
      },
      {
        id: 'confused',
        name: 'Confused',
        description: 'Mental faculties impaired, may act unpredictably',
        icon: 'spell_shadow_mindtwisting',
        category: 'mental',
        options: [
          { id: 'disoriented', name: 'Disoriented', description: 'Difficulty focusing and reduced accuracy', icon: 'spell_shadow_mindtwisting' },
          { id: 'befuddled', name: 'Befuddled', description: 'Acts randomly, may attack allies', icon: 'spell_nature_polymorph' },
          { id: 'insane', name: 'Insane', description: 'Completely lost control of mental faculties', icon: 'ability_creature_cursed_04' }
        ]
      },
      {
        id: 'diseased',
        name: 'Diseased',
        description: 'Suffering from a disease that weakens over time',
        icon: 'ability_creature_disease_02',
        category: 'physical',
        options: [
          { id: 'infected', name: 'Infected', description: 'Early stages, minor symptoms', icon: 'spell_holy_harmundeadaura' },
          { id: 'contagious', name: 'Contagious', description: 'Can spread to nearby creatures', icon: 'spell_shadow_plaguecloud' },
          { id: 'terminal', name: 'Terminal', description: 'Advanced disease, severe deterioration', icon: 'ability_creature_disease_05' }
        ]
      },
      {
        id: 'bleeding',
        name: 'Bleeding',
        description: 'Losing blood, taking damage over time',
        icon: 'spell_shadow_lifedrain',
        category: 'physical',
        options: [
          { id: 'minor', name: 'Minor Wound', description: 'Small cut, slow blood loss', icon: 'ability_backstab' },
          { id: 'severe', name: 'Severe Wound', description: 'Heavy bleeding, significant damage', icon: 'spell_shadow_lifedrain' },
          { id: 'hemorrhaging', name: 'Hemorrhaging', description: 'Critical blood loss, may cause death', icon: 'spell_deathknight_bloodboil' }
        ]
      },
      {
        id: 'slept',
        name: 'Slept',
        description: 'Magically put to sleep, helpless but can be awakened',
        icon: 'spell_nature_sleep',
        category: 'magical',
        options: [
          { id: 'drowsy', name: 'Drowsy', description: 'Fighting sleep, slower reactions', icon: 'spell_nature_sleep' },
          { id: 'asleep', name: 'Asleep', description: 'Sound asleep but wakes up if they take damage', icon: 'spell_nature_sleep' },
          { id: 'comatose', name: 'Comatose', description: 'Deep magical sleep, difficult to wake', icon: 'spell_shadow_demonicempathy' }
        ]
      },
      {
        id: 'cursed',
        name: 'Cursed',
        description: 'Afflicted by a magical curse causing misfortune',
        icon: 'spell_shadow_antishadow',
        category: 'magical',
        options: [
          { id: 'jinxed', name: 'Jinxed', description: 'Minor bad luck, occasional failures', icon: 'spell_shadow_curseofsargeras' },
          { id: 'hexed', name: 'Hexed', description: 'Significant misfortune and penalties', icon: 'spell_shadow_antishadow' },
          { id: 'doomed', name: 'Doomed', description: 'Severe curse, may lead to death', icon: 'spell_shadow_unholystrength' }
        ]
      },
      {
        id: 'dazed',
        name: 'Dazed',
        description: 'Disoriented and struggling to focus properly',
        icon: 'spell_nature_polymorph',
        category: 'physical',
        options: [
          { id: 'lightheaded', name: 'Lightheaded', description: 'Slight disorientation, minor penalties', icon: 'spell_nature_sleep' },
          { id: 'disoriented', name: 'Disoriented', description: 'Difficulty focusing, significant penalties', icon: 'spell_nature_polymorph' },
          { id: 'concussed', name: 'Concussed', description: 'Severe trauma, major impairment', icon: 'ability_golemthunderclap' }
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
          { id: 'hp_to_hp', name: 'Health Link', description: 'Transfer health between entities', icon: 'spell_shadow_lifedrain' },
          { id: 'mana_to_mana', name: 'Mana Link', description: 'Transfer mana between entities', icon: 'spell_shadow_manaburn' },
          { id: 'hp_to_mana', name: 'Life to Mana', description: 'Convert health to mana', icon: 'spell_shadow_soulleech_2' },
          { id: 'mana_to_hp', name: 'Mana to Life', description: 'Convert mana to health', icon: 'spell_holy_divineillumination' },
          { id: 'damage_to_healing', name: 'Damage to Healing', description: 'Convert damage dealt to healing', icon: 'spell_shadow_lifedrain02' },
          { id: 'healing_to_damage', name: 'Healing to Damage', description: 'Convert healing done to bonus damage', icon: 'spell_shadow_bloodboil' }
        ]
      }
    ];

    if (category === 'all') {
      return STATUS_EFFECTS;
    }

    return STATUS_EFFECTS.filter(effect => effect.category === category);
  };

  // Helper function to get icon URL
  const getIconUrl = (iconName) => {
    if (!iconName) return '';
    return `https://wow.zamimg.com/images/wow/icons/large/${iconName}.jpg`;
  };

  // Add a function to generate detailed effect descriptions based on the selected effect type and intensity level
  const getEffectDescription = (effectId, optionId, level) => {
    const effect = getStatusEffectsByCategory('all').find(e => e.id === effectId);
    if (!effect) return '';

    const option = effect.options.find(o => o.id === optionId);
    if (!option) return effect.description;

    // Base descriptions for each intensity level
    const intensityDescriptions = {
      minor: {
        blinded: {
          partial: "Target has disadvantage on perception checks and attacks",
          total: "Target has disadvantage on all attacks and -5 to Perception",
          flash: "Target is briefly blinded, disadvantage on next attack only"
        },
        charmed: {
          friendly: "Target regards you as a friendly acquaintance for a short time",
          dominated: "Target follows simple, non-harmful suggestions",
          infatuated: "Target is mildly attracted to you and more likely to help"
        },
        frightened: {
          shaken: "Target has disadvantage on ability checks while source is visible",
          terrified: "Target is hesitant to move closer to the fear source",
          panicked: "Target prefers to move away from the source if possible"
        },
        paralyzed: {
          partial: "Target's movement speed is reduced by 10 feet",
          complete: "Target's movement speed is reduced to 0 for 1 round",
          magical: "Target has disadvantage on concentration checks for spells"
        },
        poisoned: {
          weakening: "Target has disadvantage on their next Strength check",
          debilitating: "Target takes 1d4 poison damage",
          paralyzing: "Target feels numbness in extremities, -2 to Dexterity checks"
        },
        stunned: {
          dazed: "Target has disadvantage on their next attack roll",
          unconscious: "Target is disoriented for 1 round",
          electric: "Target experiences a mild shock"
        },
        restrained: {
          ensnared: "Target's movement speed is reduced by half",
          grappled: "Target can be grappled with advantage",
          bound: "Target takes 1 extra round to break restraints"
        },
        silenced: {
          magical: "Target cannot speak loudly for a short time",
          muted: "Target's voice is reduced to a whisper",
          temporal: "Target occasionally stutters when casting verbal spells"
        },
        slowed: {
          hindered: "Target's movement speed is reduced by 5 feet",
          lethargic: "Target loses 1 action point next round",
          temporal: "Target's reaction time slightly increases"
        },
        burning: {
          mild: "Target takes 1d4 fire damage",
          intense: "Target takes 1d6 fire damage",
          magical: "Target takes 1d4 fire damage that ignores resistance"
        },
        frozen: {
          chilled: "Target's movement speed is reduced by 5 feet",
          frostbitten: "Target has disadvantage on Dexterity checks for 1 round",
          frozen: "Parts of target's body are covered in frost, movement reduced by 5 feet"
        },
        weakened: {
          fatigued: "Target deals 2 less damage with strength-based attacks",
          exhausted: "Target has disadvantage on Constitution saving throws",
          drained: "Target's maximum hit points are reduced by 5"
        },
        confused: {
          disoriented: "Target has disadvantage on Intelligence checks",
          befuddled: "5% chance target attacks a random target",
          insane: "Target babbles incoherently on their turn"
        },
        diseased: {
          infected: "Target cannot regain hit points for 1 round",
          contagious: "Target has a 5% chance to spread disease to allies within 5 feet",
          terminal: "Target has disadvantage on Constitution checks"
        },
        bleeding: {
          minor: "Target takes 1 damage at the start of their turn",
          severe: "Target takes 1d4 damage at the start of their turn",
          hemorrhaging: "Target has disadvantage on Constitution saving throws"
        },
        slept: {
          drowsy: "Target has disadvantage on Perception checks",
          asleep: "Target falls asleep but wakes up if they take damage",
          comatose: "Target falls into a light sleep"
        },
        dazed: {
          lightheaded: "Target has -1 to attack rolls",
          disoriented: "Target has disadvantage on Initiative rolls",
          concussed: "Target has disadvantage on concentration checks"
        }
      },
      moderate: {
        blinded: {
          partial: "Target cannot see beyond 10 feet and has disadvantage on attacks",
          total: "Target cannot see at all for the duration",
          flash: "Target is blinded for 1d4 rounds"
        },
        charmed: {
          friendly: "Target regards you as a trusted friend and will assist you",
          dominated: "Target follows your commands if not directly harmful",
          infatuated: "Target is attracted to you and will defend you from harm"
        },
        frightened: {
          shaken: "Target has disadvantage on all ability checks while source is visible",
          terrified: "Target cannot willingly move closer to the source of fear",
          panicked: "Target must use its action to Dash away from the source"
        },
        paralyzed: {
          partial: "Target's movement speed is reduced to 0",
          complete: "Target is incapacitated and cannot take actions or reactions",
          magical: "Target cannot cast spells with somatic components"
        },
        poisoned: {
          weakening: "Target has disadvantage on all Strength checks and saving throws",
          debilitating: "Target takes 2d4 poison damage per round",
          paralyzing: "Target has a 25% chance of being paralyzed for 1 round"
        },
        stunned: {
          dazed: "Target has disadvantage on all attack rolls and ability checks",
          unconscious: "Target falls prone and is incapacitated for 1 round",
          electric: "Target drops held items and is stunned for 1 round"
        },
        restrained: {
          ensnared: "Target's speed becomes 0 and has disadvantage on Dexterity saving throws",
          grappled: "Target is grappled (escape DC equals spell save DC)",
          bound: "Target is restrained and cannot use their hands"
        },
        silenced: {
          magical: "Target cannot cast spells with verbal components",
          muted: "Target cannot speak at all",
          temporal: "Target has a 50% chance to fail when casting verbal spells"
        },
        slowed: {
          hindered: "Target's movement speed is halved",
          lethargic: "Target can take either an action or a bonus action on their turn, not both",
          temporal: "Target acts as if under the Slow spell"
        },
        burning: {
          mild: "Target takes 2d4 fire damage per round",
          intense: "Target takes 2d6 fire damage and may ignite flammable objects",
          magical: "Target takes 2d4 fire damage that ignores resistance"
        },
        frozen: {
          chilled: "Target's movement speed is halved and has disadvantage on Dexterity saves",
          frostbitten: "Target takes 1d6 cold damage and has disadvantage on attack rolls",
          frozen: "Target is partially encased in ice, speed reduced to 0"
        },
        weakened: {
          fatigued: "Target deals 1d4 less damage with all attacks",
          exhausted: "Target has disadvantage on all physical ability checks",
          drained: "Target's maximum hit points are reduced by 15"
        },
        confused: {
          disoriented: "Target has a 25% chance to lose their action",
          befuddled: "25% chance target attacks random creature within range",
          insane: "Target behaves randomly (roll on confusion table)"
        },
        diseased: {
          infected: "Target cannot regain hit points naturally",
          contagious: "25% chance to affect others within 5 feet at end of target's turn",
          terminal: "Target has disadvantage on death saving throws"
        },
        bleeding: {
          minor: "Target takes 1d4 damage at start of their turn",
          severe: "Target takes 2d4 damage at start of their turn",
          hemorrhaging: "Target has disadvantage on Constitution saving throws"
        },
        slept: {
          drowsy: "Target has disadvantage on all ability checks",
          asleep: "Target falls asleep for the duration or until shaken awake",
          comatose: "Target falls into a deep sleep and can only be awakened by magical means"
        },
        dazed: {
          lightheaded: "Target has -2 to all attack rolls and saving throws",
          disoriented: "Target may move in a random direction on their turn",
          concussed: "Target may not take reactions and has disadvantage on Intelligence checks"
        }
      },
      major: {
        blinded: {
          partial: "Target is completely blinded in one eye (-5 to Perception, disadvantage on ranged attacks)",
          total: "Target is completely blind and considered an incapacitated condition",
          flash: "Target is permanently blinded until magical healing is received"
        },
        charmed: {
          friendly: "Target sees you as their closest ally and will follow your suggestions even if dangerous",
          dominated: "Target is under your complete control and will follow any command",
          infatuated: "Target is completely devoted to you and will sacrifice themselves for you"
        },
        frightened: {
          shaken: "Target is frightened and has disadvantage on all rolls while source is visible",
          terrified: "Target is terrified and must use all movement to get away from the source",
          panicked: "Target is panicked and flees at maximum speed, dropping items and unable to take actions"
        },
        paralyzed: {
          partial: "Target is partially paralyzed (incapacitated but aware of surroundings)",
          complete: "Target is completely paralyzed (incapacitated, can't move or speak, auto-fails STR/DEX saves)",
          magical: "Target is magically locked in stasis (cannot be moved, immune to further effects)"
        },
        poisoned: {
          weakening: "Target's Strength and Constitution scores are reduced by 4",
          debilitating: "Target takes 4d4 poison damage per round and is incapacitated",
          paralyzing: "Target is paralyzed and takes 2d4 poison damage per round"
        },
        stunned: {
          dazed: "Target is stunned (can't take actions/reactions, drops everything, can't speak, auto-fails STR/DEX saves)",
          unconscious: "Target falls unconscious for 1d4 hours",
          electric: "Target is stunned and creatures within 5 feet must make a DEX save or be stunned as well"
        },
        restrained: {
          ensnared: "Target is restrained (0 speed, disadvantage on attacks, advantage on attacks against them)",
          grappled: "Target is restrained and being crushed (takes 1d6 damage per round)",
          bound: "Target is completely immobilized and cannot speak or cast spells"
        },
        silenced: {
          magical: "All sound is nullified in a 15-foot radius around the target",
          muted: "Target cannot produce any sound at all, including from objects they interact with",
          temporal: "Target's speech and spellcasting are temporally displaced (always fail verbal components)"
        },
        slowed: {
          hindered: "Target's speed is reduced to 5 feet and they have disadvantage on all DEX saves",
          lethargic: "Target can only take an action OR bonus action once every 2 rounds",
          temporal: "Target is caught in a time distortion (can only take an action every other turn)"
        },
        burning: {
          mild: "Target takes 3d6 fire damage per round and ignites flammable objects",
          intense: "Target takes 4d6 fire damage and spreads to nearby creatures (5-ft radius)",
          magical: "Target takes 3d6 fire damage that ignores resistance and immunity"
        },
        frozen: {
          chilled: "Target's speed is 0 and they have disadvantage on all physical checks",
          frostbitten: "Target takes 2d6 cold damage and parts of their body become brittle",
          frozen: "Target is completely encased in ice (paralyzed condition)"
        },
        weakened: {
          fatigued: "Target deals half damage with all attacks",
          exhausted: "Target gains multiple levels of exhaustion as per PHB",
          drained: "Target's maximum hit points are reduced by half"
        },
        confused: {
          disoriented: "Target acts as if under the Confusion spell",
          befuddled: "Target attacks the nearest creature each turn, regardless of allegiance",
          insane: "Target is permanently insane until cured by Greater Restoration"
        },
        diseased: {
          infected: "Target cannot regain hit points by any means",
          contagious: "Disease spreads to all creatures within 15 feet at end of target's turn",
          terminal: "Target must make a Constitution save each day or gain a level of exhaustion"
        },
        bleeding: {
          minor: "Target takes 2d4 damage at the start of their turn",
          severe: "Target takes 3d6 damage at the start of their turn and leaves a blood trail",
          hemorrhaging: "Target is incapacitated from blood loss and takes 3d8 damage per round"
        },
        slept: {
          drowsy: "Target is incapacitated as they struggle to stay awake",
          asleep: "Target falls into a deep sleep for 8 hours and cannot be awakened normally",
          comatose: "Target falls into a magical coma that lasts until dispelled"
        },
        dazed: {
          lightheaded: "Target has -5 to all rolls and cannot take reactions",
          disoriented: "Target cannot distinguish friend from foe and attacks random targets",
          concussed: "Target is stunned and cannot take any actions for 1d4 rounds"
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

  return (
    <div className="spell-effects-container">
      <h3>Debuff Configuration</h3>

      <div className="buff-config-section">
        <div className="effect-config-section">
          <h4>Duration</h4>

          <div className="effect-config-option">
            <label>Duration Type</label>
            <div className="effect-options">
              <button
                className={`effect-option-button ${debuffConfig.durationType === 'turns' ? 'active' : ''}`}
                onClick={() => updateDebuffConfig('durationType', 'turns')}
              >
                <span>Turns/Rounds</span>
              </button>
              <button
                className={`effect-option-button ${debuffConfig.durationType === 'time' ? 'active' : ''}`}
                onClick={() => updateDebuffConfig('durationType', 'time')}
              >
                <span>Time-Based</span>
              </button>
              <button
                className={`effect-option-button ${debuffConfig.durationType === 'rest' ? 'active' : ''}`}
                onClick={() => updateDebuffConfig('durationType', 'rest')}
              >
                <span>Rest-Based</span>
              </button>
              <button
                className={`effect-option-button ${debuffConfig.durationType === 'permanent' ? 'active' : ''}`}
                onClick={() => updateDebuffConfig('durationType', 'permanent')}
              >
                <span>Permanent</span>
              </button>
            </div>
          </div>

          {debuffConfig.durationType === 'turns' && (
            <div className="effect-config-option">
              <label>Number of Turns/Rounds</label>
              <input
                type="number"
                min="1"
                max="100"
                value={debuffConfig.durationValue || 3}
                onChange={(e) => {
                  updateDebuffConfig('durationValue', parseInt(e.target.value));
                  // Also update legacy duration field for backward compatibility
                  updateDebuffConfig('duration', parseInt(e.target.value));
                }}
              />
            </div>
          )}

          {debuffConfig.durationType === 'time' && (
            <div className="effect-config-option">
              <div className="duration-time-input">
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={debuffConfig.durationValue || 1}
                  onChange={(e) => {
                    updateDebuffConfig('durationValue', parseInt(e.target.value));
                  }}
                />
                <select
                  value={debuffConfig.durationUnit || 'minutes'}
                  onChange={(e) => {
                    updateDebuffConfig('durationUnit', e.target.value);
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

          {debuffConfig.durationType === 'rest' && (
            <div className="effect-config-option">
              <label>Rest Type</label>
              <div className="effect-options">
                <button
                  className={`effect-option-button ${debuffConfig.restType === 'short' ? 'active' : ''}`}
                  onClick={() => updateDebuffConfig('restType', 'short')}
                >
                  <span>Until Short Rest</span>
                </button>
                <button
                  className={`effect-option-button ${debuffConfig.restType === 'long' ? 'active' : ''}`}
                  onClick={() => updateDebuffConfig('restType', 'long')}
                >
                  <span>Until Long Rest</span>
                </button>
              </div>
            </div>
          )}

          {debuffConfig.durationType === 'permanent' && (
            <div className="effect-config-option">
              <div className="toggle-options">
                <div className="toggle-option">
                  <button
                    className={`toggle-button ${debuffConfig.canBeDispelled ? 'active' : ''}`}
                    onClick={() => updateDebuffConfig('canBeDispelled', !debuffConfig.canBeDispelled)}
                  >
                    <div className="toggle-icon">
                      {debuffConfig.canBeDispelled ? '✓' : ''}
                    </div>
                    <span>Can Be Dispelled</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {(debuffConfig.durationType === 'turns' || debuffConfig.durationType === 'time') && (
            <div className="effect-config-option">
              <div className="toggle-options">
                <div className="toggle-option">
                  <button
                    className={`toggle-button ${debuffConfig.concentrationRequired ? 'active' : ''}`}
                    onClick={() => updateDebuffConfig('concentrationRequired', !debuffConfig.concentrationRequired)}
                  >
                    <div className="toggle-icon">
                      {debuffConfig.concentrationRequired ? '✓' : ''}
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
            value={debuffConfig.stackingRule || 'replace'}
            onChange={(e) => {
              const newStackingRule = e.target.value;
              updateDebuffConfig('stackingRule', newStackingRule);

              // Initialize progressiveStages array when selecting progressive stacking rule
              if (newStackingRule === 'progressive' && !debuffConfig.progressiveStages) {
                updateDebuffConfig('progressiveStages', []);
              }
            }}
            className="buff-dropdown"
          >
            {DEBUFF_STACKING_RULE_OPTIONS.map(rule => (
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
            value={debuffConfig.maxStacks || 1}
            min="1"
            max="10"
            onChange={(e) => updateDebuffConfig('maxStacks', parseInt(e.target.value))}
            disabled={debuffConfig.stackingRule !== 'selfStacking' && debuffConfig.stackingRule !== 'cumulative'}
          />
        </div>

        {/* Saving Throw Configuration */}
        <div className="config-section">
          <h4 className="section-header">Saving Throw</h4>

          <div className="config-option">
            <label>Difficulty Class (DC)</label>
            <input
              type="number"
              value={debuffConfig.difficultyClass || 15}
              min="1"
              max="30"
              onChange={(e) => updateDebuffConfig('difficultyClass', parseInt(e.target.value))}
            />
          </div>

          <div className="config-option">
            <label>Save Type</label>
            <div className="effect-options tabs">
              {SAVE_TYPES.map(type => (
                <button
                  key={type.id}
                  className={`effect-option-tab ${debuffConfig.savingThrow === type.id ? 'selected' : ''}`}
                  onClick={() => updateDebuffConfig('savingThrow', type.id)}
                  title={type.description}
                >
                  <span className="effect-option-tab-icon">
                    <img
                      src={getIconUrl(type.icon)}
                      alt={type.name}
                    />
                  </span>
                  {type.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Progressive debuff configuration */}
        {debuffConfig.stackingRule === 'progressive' && (
          <div className="progressive-buff-config">
            <div className="config-option">
              <div className="toggle-options">
                <div className="toggle-option">
                  <button
                    className={`toggle-button ${debuffConfig.isProgressive ? 'active' : ''}`}
                    onClick={() => updateDebuffConfig('isProgressive', !debuffConfig.isProgressive)}
                  >
                    <div className="toggle-icon">
                      {debuffConfig.isProgressive ? '✓' : ''}
                    </div>
                    <span>Enable Progressive Effect</span>
                  </button>
                </div>
              </div>
            </div>

            {debuffConfig.isProgressive && (
              <div className="progressive-stages">
                <h4>Progressive Stages</h4>
                <p className="stage-description">Configure how the debuff changes over time</p>

                {debuffConfig.progressiveStages && debuffConfig.progressiveStages.length > 0 ? (
                  <div className="stages-list">
                    {debuffConfig.progressiveStages.map((stage, index) => (
                      <div key={index} className="stage-item">
                        <div className="stage-header">
                          <span className="stage-title">Stage {index + 1}</span>
                          <div className="stage-actions">
                            <button
                              className="stage-action delete"
                              onClick={() => {
                                const updatedStages = [...debuffConfig.progressiveStages];
                                updatedStages.splice(index, 1);
                                updateDebuffConfig('progressiveStages', updatedStages);
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
                                max={debuffConfig.durationValue || 3}
                                value={stage.triggerAt || 1}
                                onChange={(e) => {
                                  const updatedStages = [...debuffConfig.progressiveStages];
                                  updatedStages[index] = {
                                    ...updatedStages[index],
                                    triggerAt: parseInt(e.target.value)
                                  };
                                  updateDebuffConfig('progressiveStages', updatedStages);
                                }}
                              />
                              <span className="unit-label">{debuffConfig.durationUnit || 'rounds'}</span>
                            </div>
                          </div>
                          <div className="stage-spell-effect">
                            <label>Trigger Spell (optional):</label>
                            <SpellSelector
                              selectedSpellId={stage.spellEffect || null}
                              onSpellSelect={(spellId, spellData) => {
                                console.log('DebuffEffects - Received spell data:', spellId, spellData);
                                const updatedStages = [...debuffConfig.progressiveStages];
                                updatedStages[index] = {
                                  ...updatedStages[index],
                                  spellEffect: spellId,
                                  spellData: spellData // Store the full spell data
                                };
                                updateDebuffConfig('progressiveStages', updatedStages);
                              }}
                              label="Select a spell to trigger at this stage"
                            />
                          </div>

                          {/* Saving throw configuration for this stage */}
                          <div className="stage-save-config">
                            <div className="stage-save-row">
                              <div className="stage-save-dc">
                                <label>DC:</label>
                                <input
                                  type="number"
                                  min="1"
                                  max="30"
                                  value={stage.difficultyClass || 15}
                                  onChange={(e) => {
                                    const updatedStages = [...debuffConfig.progressiveStages];
                                    updatedStages[index] = {
                                      ...updatedStages[index],
                                      difficultyClass: parseInt(e.target.value)
                                    };
                                    updateDebuffConfig('progressiveStages', updatedStages);
                                  }}
                                />
                              </div>

                              <div className="stage-save-type">
                                <label>Save:</label>
                                <select
                                  value={stage.savingThrow || 'constitution'}
                                  onChange={(e) => {
                                    const updatedStages = [...debuffConfig.progressiveStages];
                                    updatedStages[index] = {
                                      ...updatedStages[index],
                                      savingThrow: e.target.value
                                    };
                                    updateDebuffConfig('progressiveStages', updatedStages);
                                  }}
                                >
                                  {SAVE_TYPES.map(type => (
                                    <option key={type.id} value={type.id}>
                                      {type.name}
                                    </option>
                                  ))}
                                </select>
                              </div>
                            </div>
                          </div>

                          <div className="stage-stats">
                            <label>Stats Affected:</label>
                            <div className="stage-stats-selector">
                              {debuffConfig.statPenalties && debuffConfig.statPenalties.length > 0 ? (
                                <div className="stage-stats-list">
                                  {debuffConfig.statPenalties.map(stat => {
                                    // Check if this stat is included in this stage
                                    const isIncluded = stage.statPenalties?.some(mod => mod.id === stat.id);

                                    return (
                                      <div key={stat.id} className={`stage-stat-item ${isIncluded ? 'included' : ''}`}>
                                        <div className="stage-stat-checkbox">
                                          <input
                                            type="checkbox"
                                            checked={isIncluded}
                                            onChange={() => {
                                              const updatedStages = [...debuffConfig.progressiveStages];
                                              let updatedStatPenalties = [...(stage.statPenalties || [])];

                                              if (isIncluded) {
                                                // Remove this stat from the stage
                                                updatedStatPenalties = updatedStatPenalties.filter(mod => mod.id !== stat.id);
                                              } else {
                                                // Add this stat to the stage
                                                updatedStatPenalties.push({
                                                  id: stat.id,
                                                  name: stat.name,
                                                  icon: stat.icon,
                                                  magnitude: stat.magnitude || -2,
                                                  magnitudeType: stat.magnitudeType || 'flat'
                                                });
                                              }

                                              updatedStages[index] = {
                                                ...updatedStages[index],
                                                statPenalties: updatedStatPenalties
                                              };
                                              updateDebuffConfig('progressiveStages', updatedStages);
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
                                              value={stage.statPenalties.find(mod => mod.id === stat.id)?.magnitude || ''}
                                              onChange={(e) => {
                                                const updatedStages = [...debuffConfig.progressiveStages];
                                                const updatedStatPenalties = [...(stage.statPenalties || [])];
                                                const statIndex = updatedStatPenalties.findIndex(mod => mod.id === stat.id);

                                                if (statIndex !== -1) {
                                                  updatedStatPenalties[statIndex] = {
                                                    ...updatedStatPenalties[statIndex],
                                                    magnitude: e.target.value
                                                  };

                                                  updatedStages[index] = {
                                                    ...updatedStages[index],
                                                    statPenalties: updatedStatPenalties
                                                  };
                                                  updateDebuffConfig('progressiveStages', updatedStages);
                                                }
                                              }}
                                              placeholder="Value or formula"
                                            />
                                            <select
                                              value={stage.statPenalties.find(mod => mod.id === stat.id)?.magnitudeType || 'flat'}
                                              onChange={(e) => {
                                                const updatedStages = [...debuffConfig.progressiveStages];
                                                const updatedStatPenalties = [...(stage.statPenalties || [])];
                                                const statIndex = updatedStatPenalties.findIndex(mod => mod.id === stat.id);

                                                if (statIndex !== -1) {
                                                  updatedStatPenalties[statIndex] = {
                                                    ...updatedStatPenalties[statIndex],
                                                    magnitudeType: e.target.value
                                                  };

                                                  updatedStages[index] = {
                                                    ...updatedStages[index],
                                                    statPenalties: updatedStatPenalties
                                                  };
                                                  updateDebuffConfig('progressiveStages', updatedStages);
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
                                  <p>No stats selected. Add stats to the debuff first.</p>
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
                    const progressiveStages = debuffConfig.progressiveStages || [];

                    // Create stat modifiers for the new stage based on selected stats
                    const stageStatPenalties = debuffConfig.statPenalties ?
                      debuffConfig.statPenalties.map(stat => ({
                        id: stat.id,
                        name: stat.name,
                        icon: stat.icon,
                        magnitude: stat.magnitude || -2,
                        magnitudeType: stat.magnitudeType || 'flat'
                      })) : [];

                    const newStage = {
                      triggerAt: progressiveStages.length + 1,
                      statPenalties: stageStatPenalties,
                      spellEffect: null,
                      // Include saving throw information
                      difficultyClass: debuffConfig.difficultyClass || 15,
                      savingThrow: debuffConfig.savingThrow || 'constitution'
                    };
                    updateDebuffConfig('progressiveStages', [...progressiveStages, newStage]);
                  }}
                >
                  + Add Stage
                </button>
              </div>
            )}
          </div>
        )}

        {/* Default Magnitude and Default Type fields removed as they are configured when choosing a debuff */}
      </div>

      {showDiceExamples && <DiceFormulaExamples />}

      <button
        className="dice-formula-help-button"
        onClick={() => setShowDiceExamples(!showDiceExamples)}
      >
        {showDiceExamples ? 'Hide Dice Formula Examples' : 'Show Dice Formula Examples'}
      </button>

      {debuffConfig.statPenalties && debuffConfig.statPenalties.length > 0 && (
        <div className="selected-stats">
          <h4>Selected Stat Penalties</h4>
          <div className="selected-stats-list">
            {debuffConfig.statPenalties.map(stat => (
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
                    className={`stat-value-input ${typeof stat.magnitude === 'string' ? 'formula' : (stat.magnitude >= 0 ? 'positive' : 'negative')}`}
                    // Use defaultValue instead of value to allow clearing the field
                    defaultValue={typeof stat.magnitude === 'string' ? stat.magnitude : (stat.magnitudeType === 'percentage' ?
                      `${stat.magnitude >= 0 ? '+' : ''}${stat.magnitude}%` :
                      `${stat.magnitude >= 0 ? '+' : ''}${stat.magnitude}`)}
                    onBlur={(e) => {
                      let value = e.target.value;

                      // Handle empty field
                      if (value === '') {
                        updateStatPenaltyValue(stat.id, 0);
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
                        updateStatPenaltyValue(stat.id, parseFloat(value));
                      } else if (isDiceFormula) {
                        // If it starts with 'd', add '1' prefix
                        if (value.startsWith('d')) {
                          value = '1' + value;
                        } else if (value.startsWith('-d')) {
                          value = '-1' + value.substring(1);
                        }
                        updateStatPenaltyValue(stat.id, value);
                      }
                    }}
                    onKeyDown={(e) => {
                      // Handle Enter key
                      if (e.key === 'Enter') {
                        e.target.blur(); // Trigger the onBlur event
                      }
                    }}
                    placeholder="Enter value or formula"
                    title="Examples: -5, 2d6, d20, -d4, -1d8+2"
                  />
                </div>
                <div className="stat-type-toggle">
                  <button
                    className={stat.magnitudeType === 'flat' ? 'active' : ''}
                    onClick={() => updateStatPenaltyType(stat.id, 'flat')}
                  >
                    Flat
                  </button>
                  <button
                    className={stat.magnitudeType === 'percentage' ? 'active' : ''}
                    onClick={() => updateStatPenaltyType(stat.id, 'percentage')}
                  >
                    %
                  </button>
                </div>
                <button
                  className="remove-stat"
                  onClick={() => removeStatPenalty(stat.id)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="stat-selector-section">
        <h4>Choose Stats to Penalize:</h4>

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
            const isSelected = debuffConfig.statPenalties?.some(penalty => penalty.id === stat.id);
            const selectedStat = isSelected ? debuffConfig.statPenalties.find(penalty => penalty.id === stat.id) : null;

            return (
              <div
                key={stat.id}
                className={`stat-card ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  if (isSelected) {
                    removeStatPenalty(stat.id);
                  } else {
                    addStatPenalty(stat);
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
            className={selectedStatusCategory === 'control' ? 'active' : ''}
            onClick={() => setSelectedStatusCategory('control')}
          >
            Control
          </button>
          <button
            className={selectedStatusCategory === 'damage' ? 'active' : ''}
            onClick={() => setSelectedStatusCategory('damage')}
          >
            Damage
          </button>
          <button
            className={selectedStatusCategory === 'disruption' ? 'active' : ''}
            onClick={() => setSelectedStatusCategory('disruption')}
          >
            Disruption
          </button>
          <button
            className={selectedStatusCategory === 'ailment' ? 'active' : ''}
            onClick={() => setSelectedStatusCategory('ailment')}
          >
            Ailment
          </button>
          <button
            className={selectedStatusCategory === 'curse' ? 'active' : ''}
            onClick={() => setSelectedStatusCategory('curse')}
          >
            Curse
          </button>
          <button
            className={selectedStatusCategory === 'debilitation' ? 'active' : ''}
            onClick={() => setSelectedStatusCategory('debilitation')}
          >
            Debilitation
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
            const isSelected = debuffConfig.statusEffects?.some(e => e.id === effect.id);
            const selectedEffect = isSelected ? debuffConfig.statusEffects.find(e => e.id === effect.id) : null;

            return (
              <div
                key={effect.id}
                className={`status-effect-card ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  if (isSelected) {
                    // If already selected, open the configuration popup
                    const selectedEffect = debuffConfig.statusEffects.find(e => e.id === effect.id);
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
                      level: 'medium',
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
        selectedEffect={debuffConfig}
        updateConfig={updateDebuffConfig}
        configType="debuff"
      />
    </div>
  );
};

export default DebuffEffects;