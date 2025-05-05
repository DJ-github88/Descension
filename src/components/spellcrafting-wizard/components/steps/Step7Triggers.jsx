import React, { useState, useEffect } from 'react';
import ResourceThresholdSlider from '../common/ResourceThresholdSlider';
import EnhancedEffectPreview from '../common/EnhancedEffectPreview';
import { useSpellWizardState, useSpellWizardDispatch, ACTION_TYPES, validateStepCompletion } from '../../context/spellWizardContext';
import WizardStep from '../common/WizardStep';
import '../../styles/triggers.css';
import '../../styles/buff-config.css';
import '../../styles/conditional-effects.css';
import '../../styles/effect-preview.css';
// Import trigger-related utilities
import { getTriggerIconUrl } from '../../core/data/triggerIcons';
import { getIconUrl } from '../../utils/iconUtils';

// Helper function to get effect icons
const getEffectIconUrl = (effectType) => {
  const effectIcons = {
    damage: 'spell_fire_flamebolt',
    healing: 'spell_holy_heal02',
    buff: 'spell_holy_divineillumination',
    debuff: 'spell_shadow_curseofsargeras',
    control: 'spell_frost_chainsofice',
    utility: 'spell_nature_earthbind',
    summon: 'spell_shadow_demonform',
    transform: 'spell_nature_polymorph',
    purification: 'spell_holy_dispelmagic',
    restoration: 'spell_holy_restoration'
  };

  return `https://wow.zamimg.com/images/wow/icons/large/${effectIcons[effectType] || 'inv_misc_questionmark'}.jpg`;
};

// Component for displaying stat modifiers with icons
const StatModifierDisplay = ({ stat, isDebuff = false }) => {
  // Handle different types of magnitude values (number, string, formula)
  let value;
  let valueClass;

  if (typeof stat.magnitude === 'string') {
    // Handle formula or string value
    value = stat.magnitude;
    valueClass = 'formula';
  } else {
    // Handle numeric value
    const sign = stat.magnitude >= 0 ? '+' : '';
    value = stat.magnitudeType === 'percentage'
      ? `${sign}${stat.magnitude}%`
      : `${sign}${stat.magnitude}`;

    valueClass = isDebuff
      ? (stat.magnitude < 0 ? 'negative' : 'positive')
      : (stat.magnitude >= 0 ? 'positive' : 'negative');
  }

  return (
    <div className="selected-stat">
      <div className="stat-icon">
        <img src={getIconUrl(stat.icon)} alt={stat.name} />
      </div>
      <div className="stat-info">
        <div className="stat-name">{stat.name}</div>
        <div className="stat-description">{stat.description || 'Modifies character attributes'}</div>
      </div>
      <div className={`stat-value ${valueClass}`}>
        {value}
      </div>
    </div>
  );
};

const Step7Triggers = ({ stepNumber, totalSteps, onNext, onPrevious }) => {
  const state = useSpellWizardState();
  const dispatch = useSpellWizardDispatch();

  // Generate trigger recommendations based on spell type and effects
  const getTriggerRecommendations = () => {
    const { spellType, effectTypes = [] } = state;

    if (spellType === 'REACTION') {
      if (effectTypes.includes('damage')) {
        return "For damage-dealing reaction spells, consider combat triggers like 'Damage Taken' or 'Critical Hit'.";
      }
      if (effectTypes.includes('healing')) {
        return "For healing reaction spells, consider health or status triggers like 'Health Threshold' or 'Effect Applied'.";
      }
      if (effectTypes.includes('buff') || effectTypes.includes('debuff')) {
        return "For buff/debuff reaction spells, consider using triggers like 'Combat Start' or 'Status Effect Applied'.";
      }
      return "Consider what game events should cause your reaction spell to activate automatically.";
    }

    if (spellType === 'PASSIVE') {
      return "Passive spells often work best with state-based triggers like 'Health Threshold' or environmental conditions.";
    }

    if (spellType === 'STATE') {
      if (effectTypes.includes('damage')) {
        return "For damage-dealing state spells, consider resource-based triggers like 'Health Threshold' or 'Resource Threshold'.";
      }
      if (effectTypes.includes('healing')) {
        return "For healing state spells, consider health triggers like 'Health Threshold' or 'Health Change'.";
      }
      if (effectTypes.includes('buff')) {
        return "For buff state spells, consider combat triggers like 'Combat Start' or 'Health Threshold'.";
      }
      return "State spells require specific conditions that will cause them to activate automatically when met.";
    }

    if (spellType === 'TRAP') {
      if (effectTypes.includes('damage')) {
        return "For damage-dealing traps, consider proximity or interaction triggers like 'Stepped On' or 'Proximity'.";
      }
      if (effectTypes.includes('debuff') || effectTypes.includes('control')) {
        return "For control traps, consider triggers like 'Proximity' or 'Interaction' to catch enemies unaware.";
      }
      return "Select conditions that will cause your trap to activate when enemies encounter it.";
    }

    return "Select conditions that will cause your spell to trigger automatically.";
  };

  const [errors, setErrors] = useState([]);
  // Get recommendations based on spell type
  const recommendationText = getTriggerRecommendations();

  const isCompleted = validateStepCompletion(6, state);
  const isActive = state.currentStep === 6;

  // Check if this step is required based on spell type
  const requiresTriggers = state.spellType === 'REACTION' || state.spellType === 'PASSIVE' || state.spellType === 'TRAP' || state.spellType === 'STATE';
  const shouldShowStep = true; // Show for all spell types

  // Local trigger configuration
  const [triggerConfig, setTriggerConfig] = useState(state.triggerConfig?.global || {
    logicType: 'AND',
    compoundTriggers: []
  });

  // Effect-specific triggers
  const [effectTriggers, setEffectTriggers] = useState(state.triggerConfig?.effectTriggers || {});

  // Selected effect for effect-specific triggers
  const [selectedEffect, setSelectedEffect] = useState(null);

  // Whether we're editing global triggers or effect-specific triggers
  // Simplified to just 'global' or 'effect' - conditional is now part of effect config
  const [editingMode, setEditingMode] = useState('global'); // 'global' or 'effect'

  // Conditional effect configuration
  const [conditionalEffects, setConditionalEffects] = useState(() => {
    // Initialize with existing data or create new with default values from effect configs
    const existingConditionalEffects = state.triggerConfig?.conditionalEffects || {};
    const initializedEffects = {};

    // For each effect type, initialize with base formulas and settings from effect configs
    state.effectTypes.forEach(effectType => {
      // Get base formula from the appropriate effect config
      let baseFormula = '';
      let baseSettings = {};

      switch(effectType) {
        case 'damage':
          // Use the actual formula from the damage configuration
          baseFormula = state.damageConfig?.formula || '1d6 + INT';
          baseSettings = {
            damageType: state.damageConfig?.damageType || 'direct',
            elementType: state.damageConfig?.elementType || 'fire'
          };
          break;
        case 'healing':
          // Use the actual formula from the healing configuration
          baseFormula = state.healingConfig?.formula || '2d8 + HEA';
          baseSettings = {
            healingType: state.healingConfig?.healingType || 'direct',
            hasHotEffect: state.healingConfig?.hasHotEffect === true,
            hasShieldEffect: state.healingConfig?.hasShieldEffect === true
          };
          break;
        case 'buff':
          // Use the actual formula from the buff configuration
          // If there are stat modifiers, use the first one's magnitude
          if (state.buffConfig?.statModifiers && state.buffConfig.statModifiers.length > 0) {
            const firstStat = state.buffConfig.statModifiers[0];
            baseFormula = typeof firstStat.magnitude === 'string'
              ? firstStat.magnitude
              : (firstStat.magnitudeType === 'percentage'
                  ? `+${firstStat.magnitude}%`
                  : `+${firstStat.magnitude}`);
          } else {
            baseFormula = state.buffConfig?.formula || '+2';
          }
          baseSettings = {
            duration: state.buffConfig?.duration || 3,
            statAffected: state.buffConfig?.statAffected || 'strength'
          };
          break;
        case 'debuff':
        case 'debuff_stat':
        case 'debuff_control':
          // Use the actual formula from the debuff configuration
          // If there are stat penalties, use the first one's magnitude
          if (state.debuffConfig?.statPenalties && state.debuffConfig.statPenalties.length > 0) {
            const firstStat = state.debuffConfig.statPenalties[0];
            baseFormula = typeof firstStat.magnitude === 'string'
              ? firstStat.magnitude
              : (firstStat.magnitudeType === 'percentage'
                  ? `${firstStat.magnitude}%` // Negative values already have the minus sign
                  : `${firstStat.magnitude}`);
          } else {
            baseFormula = state.debuffConfig?.formula || '-2';
          }
          baseSettings = {
            duration: state.debuffConfig?.duration || 3,
            durationUnit: state.debuffConfig?.durationUnit || 'rounds',
            difficultyClass: state.debuffConfig?.difficultyClass || 15,
            savingThrow: state.debuffConfig?.savingThrow || 'constitution'
          };
          break;
        case 'control':
          baseFormula = '';
          baseSettings = {
            duration: state.controlConfig?.duration || 1,
            savingThrow: state.controlConfig?.savingThrow || 'strength',
            difficultyClass: state.controlConfig?.difficultyClass || 15
          };
          break;
        case 'summon':
          baseFormula = '';
          baseSettings = {
            duration: state.summonConfig?.duration || 10,
            durationUnit: state.summonConfig?.durationUnit || 'minutes',
            quantity: state.summonConfig?.quantity || state.summonConfig?.count || 1,
            controlType: state.summonConfig?.controlType || 'verbal',
            controlRange: state.summonConfig?.controlRange || 60,
            creatures: state.summonConfig?.creatures || [],
            waitForTrigger: state.summonConfig?.waitForTrigger || false
          };
          break;
        case 'transform':
          baseFormula = '';
          baseSettings = {
            duration: state.transformConfig?.duration || 10,
            difficultyClass: state.transformConfig?.difficultyClass || 15
          };
          break;
        default:
          baseFormula = '';
          baseSettings = {};
      }

      // If there's an existing config, use it, otherwise create a new one
      initializedEffects[effectType] = existingConditionalEffects[effectType] || {
        isConditional: false,
        defaultEnabled: true,
        baseFormula: baseFormula,
        baseSettings: baseSettings,
        conditionalFormulas: {
          'default': baseFormula
        },
        conditionalSettings: {}
      };

      // Ensure the default formula is set if it doesn't exist
      if (!initializedEffects[effectType].conditionalFormulas?.default) {
        initializedEffects[effectType].conditionalFormulas = {
          ...initializedEffects[effectType].conditionalFormulas,
          'default': baseFormula
        };
      }

      // Store the base formula and settings for reference
      initializedEffects[effectType].baseFormula = baseFormula;
      initializedEffects[effectType].baseSettings = baseSettings;
    });

    return initializedEffects;
  });

  // Resource types for resource threshold trigger
  const RESOURCE_TYPES = [
    { id: 'health', name: 'Health', icon: 'spell_holy_sealofsacrifice' },
    { id: 'mana', name: 'Mana', icon: 'spell_frost_wizardmark' },
    { id: 'energy', name: 'Energy', icon: 'spell_shadow_shadowworddominate' },
    { id: 'rage', name: 'Rage', icon: 'ability_warrior_rampage' },
    { id: 'inferno', name: 'Inferno', icon: 'spell_fire_fire' }
  ];

  // Trigger categories
  const triggerCategories = [
    { id: 'combat', name: 'Combat', iconId: 'ability_warrior_challange' },
    { id: 'movement', name: 'Movement', iconId: 'ability_rogue_sprint' },
    { id: 'health', name: 'Health, Resources & Death', iconId: 'spell_holy_sealofsacrifice' },
    { id: 'status', name: 'Status Effects', iconId: 'spell_holy_blessingofprotection' },
    { id: 'environment', name: 'Environment', iconId: 'spell_nature_earthquake' },
    { id: 'time', name: 'Time & Turns', iconId: 'spell_holy_borrowedtime' },
    { id: 'trap', name: 'Trap Triggers', iconId: 'spell_fire_selfdestruct' }
  ];

  // Selected category
  const [selectedCategory, setSelectedCategory] = useState(triggerCategories[0].id);

  // Sample trigger types for each category (in a real app, these would come from TriggerUtils)
  const getTriggersByCategory = (categoryId) => {
    const triggers = {
      combat: [
        // Damage-related triggers
        { id: 'damage_taken', name: 'Damage Taken', description: 'Activates when damage is taken', params: ['amount', 'damage_type', 'perspective'] },
        { id: 'damage_dealt', name: 'Damage Dealt', description: 'Activates when damage is dealt', params: ['amount', 'damage_type', 'perspective'] },
        { id: 'critical_hit', name: 'Critical Hit', description: 'Activates on a critical hit', params: ['perspective'] },
        { id: 'critical_hit_taken', name: 'Critical Hit Taken', description: 'Activates when receiving a critical hit', params: ['perspective'] },

        // Attack outcome triggers
        { id: 'miss', name: 'Attack Miss', description: 'Activates when an attack misses', params: ['perspective'] },
        { id: 'dodge', name: 'Dodge', description: 'Activates when an attack is dodged', params: ['perspective'] },
        { id: 'parry', name: 'Parry', description: 'Activates when an attack is parried', params: ['perspective'] },
        { id: 'block', name: 'Block', description: 'Activates when an attack is blocked with a shield', params: ['perspective'] },

        // Spell-specific triggers
        { id: 'spell_reflect', name: 'Spell Reflection', description: 'Activates when a spell is reflected', params: ['perspective'] },
        { id: 'spell_interrupt', name: 'Spell Interrupt', description: 'Activates when a spell cast is interrupted', params: ['perspective'] },
        { id: 'spell_resist', name: 'Spell Resist', description: 'Activates when a spell is resisted', params: ['perspective'] },

        // Combat state triggers
        { id: 'combat_start', name: 'Combat Start', description: 'Activates when combat begins', params: [] },
        { id: 'combat_end', name: 'Combat End', description: 'Activates when combat ends', params: [] },
        { id: 'first_strike', name: 'First Strike', description: 'Activates on the first attack in combat', params: ['perspective'] },
        { id: 'last_stand', name: 'Last Stand', description: 'Activates when you are the last ally standing', params: [] }
      ],
      movement: [
        { id: 'movement_start', name: 'Movement Start', description: 'Activates when movement begins', params: ['perspective'] },
        { id: 'movement_end', name: 'Movement End', description: 'Activates when movement stops', params: ['perspective'] },
        { id: 'distance_moved', name: 'Distance Moved', description: 'Activates after moving a certain distance', params: ['distance', 'perspective'] },
        { id: 'enter_area', name: 'Enter Area', description: 'Activates when entering a defined area', params: ['area_type', 'perspective'] },
        { id: 'leave_area', name: 'Leave Area', description: 'Activates when leaving a defined area', params: ['area_type', 'perspective'] },
        { id: 'proximity', name: 'Proximity', description: 'Activates when entities are within a certain range', params: ['distance', 'entity_type'] },
        { id: 'forced_movement', name: 'Forced Movement', description: 'Activates when pushed, pulled, or otherwise forcibly moved', params: ['perspective'] },
        { id: 'high_ground', name: 'High Ground', description: 'Activates when on elevated terrain', params: ['perspective'] },
        { id: 'falling', name: 'Falling', description: 'Activates when falling from a height', params: ['perspective'] }
      ],
      health: [
        { id: 'health_threshold', name: 'Health Threshold', description: 'Activates when health reaches a specified level', params: ['percentage', 'comparison', 'perspective'] },
        { id: 'health_change', name: 'Health Change', description: 'Activates when health changes by an amount', params: ['amount', 'is_percent', 'perspective'] },
        { id: 'resource_threshold', name: 'Resource Threshold', description: 'Activates when a resource reaches a specified level', params: ['resource_type', 'threshold_value', 'threshold_type', 'comparison', 'perspective'] },
        { id: 'ally_health', name: 'Ally Health', description: 'Activates based on ally health conditions', params: ['percentage', 'comparison'] },
        { id: 'on_death', name: 'On Death', description: 'Triggers when a character dies', params: ['target_type'] },
        { id: 'on_revival', name: 'On Revival', description: 'Triggers when a character is revived', params: ['target_type'] },
        { id: 'near_death', name: 'Near Death', description: 'Triggers when a character is near death', params: ['health_threshold', 'target_type'] },
        { id: 'death_save_success', name: 'Death Save Success', description: 'Triggers when a character succeeds on a death saving throw', params: ['target_type'] },
        { id: 'death_save_failure', name: 'Death Save Failure', description: 'Triggers when a character fails a death saving throw', params: ['target_type'] },
        { id: 'full_health', name: 'Full Health', description: 'Triggers when at full health', params: ['perspective'] },
        { id: 'overhealing', name: 'Overhealing', description: 'Triggers when healing would exceed maximum health', params: ['perspective'] }
      ],
      status: [
        { id: 'effect_applied', name: 'Effect Applied', description: 'Activates when a status effect is applied', params: ['effect_type', 'perspective'] },
        { id: 'effect_removed', name: 'Effect Removed', description: 'Activates when a status effect is removed', params: ['effect_type', 'perspective'] },
        { id: 'effect_duration', name: 'Effect Duration', description: 'Activates when an effect has a certain duration remaining', params: ['effect_type', 'duration', 'perspective'] },
        { id: 'effect_stack', name: 'Effect Stack', description: 'Activates when an effect reaches a certain number of stacks', params: ['effect_type', 'stack_count', 'perspective'] },
        { id: 'dispel', name: 'Dispel', description: 'Activates when an effect is dispelled', params: ['effect_type', 'perspective'] },
        { id: 'cleanse', name: 'Cleanse', description: 'Activates when a negative effect is cleansed', params: ['effect_type', 'perspective'] },
        { id: 'immunity', name: 'Immunity', description: 'Activates when immune to an effect', params: ['effect_type', 'perspective'] }
      ],
      trap: [
        { id: 'proximity', name: 'Proximity', description: 'Activates when a creature comes within range of the trap (uses trap size)', params: ['creature_type'] },
        { id: 'stepped_on', name: 'Stepped On', description: 'Activates when a creature steps directly on the trap (within trap size)', params: ['creature_type'] },
        { id: 'interaction', name: 'Interaction', description: 'Activates when a creature interacts with the trap or an object near it', params: ['interaction_type'] },
        { id: 'line_of_sight', name: 'Line of Sight', description: 'Activates when a creature enters the line of sight of the trap', params: ['creature_type'] },
        { id: 'detection_attempt', name: 'Detection Attempt', description: 'Activates when a creature attempts to detect the trap', params: [] },
        { id: 'disarm_attempt', name: 'Disarm Attempt', description: 'Activates when a creature attempts to disarm the trap', params: [] },
        { id: 'timer', name: 'Timer', description: 'Activates after a set amount of time', params: ['time'] },
        { id: 'weight_pressure', name: 'Weight/Pressure', description: 'Activates when sufficient weight or pressure is applied to the trap', params: ['weight_threshold'] },
        { id: 'magical_trigger', name: 'Magical Trigger', description: 'Activates when a specific magical condition is met', params: ['magic_type'] },
        { id: 'trap_chain', name: 'Trap Chain', description: 'Activates when another trap is triggered', params: [] },
        { id: 'trap_damage', name: 'Trap Damage', description: 'Activates when the trap deals damage', params: ['damage_threshold'] }
      ],
      environment: [
        { id: 'weather_change', name: 'Weather Change', description: 'Activates when weather changes', params: ['weather_type'] },
        { id: 'terrain_type', name: 'Terrain Type', description: 'Activates when on a specific terrain', params: ['terrain_type'] },
        { id: 'day_night', name: 'Day/Night Cycle', description: 'Activates at day or night', params: ['is_day'] },
        { id: 'object_interaction', name: 'Object Interaction', description: 'Activates when interacting with objects', params: ['object_type'] },
        { id: 'environmental_damage', name: 'Environmental Damage', description: 'Activates when taking damage from the environment', params: ['damage_type'] },
        { id: 'underwater', name: 'Underwater', description: 'Activates when underwater', params: [] },
        { id: 'in_darkness', name: 'In Darkness', description: 'Activates when in darkness or dim light', params: [] },
        { id: 'in_bright_light', name: 'In Bright Light', description: 'Activates when in bright light', params: [] }
      ],
      time: [
        { id: 'turn_start', name: 'Turn Start', description: 'Activates at the start of a turn', params: ['whose_turn'] },
        { id: 'turn_end', name: 'Turn End', description: 'Activates at the end of a turn', params: ['whose_turn'] },
        { id: 'round_start', name: 'Round Start', description: 'Activates at the start of a combat round', params: [] },
        { id: 'round_end', name: 'Round End', description: 'Activates at the end of a combat round', params: [] },
        { id: 'timer', name: 'Timer', description: 'Activates after a set duration', params: ['seconds'] },
        { id: 'cooldown_ready', name: 'Cooldown Ready', description: 'Activates when an ability cooldown is ready', params: ['ability_id'] },
        { id: 'duration_threshold', name: 'Duration Threshold', description: 'Activates when a spell or effect has a certain duration remaining', params: ['duration', 'comparison'] }
      ]
    };

    return triggers[categoryId] || [];
  };

  // Effect to update context when configuration changes
  useEffect(() => {
    if (triggerConfig && triggerConfig.compoundTriggers) {
      dispatch({
        type: ACTION_TYPES.UPDATE_TRIGGER_CONFIG,
        payload: {
          global: triggerConfig,
          effectTriggers: effectTriggers
        }
      });
    }
  }, [triggerConfig, dispatch]);

  // Separate effect for effect-specific triggers to avoid circular updates
  useEffect(() => {
    // This effect will handle updating the context with effect-specific triggers
    // We don't need to do anything here since we're updating the context directly in the handler functions
  }, [effectTriggers]);

  // Effect to update context when conditional effects change
  useEffect(() => {
    // Update the context with conditional effects
    Object.entries(conditionalEffects).forEach(([effectType, config]) => {
      dispatch({
        type: ACTION_TYPES.UPDATE_CONDITIONAL_EFFECT,
        payload: {
          effectType,
          config
        }
      });
    });
  }, [conditionalEffects, dispatch]);

  // Add a trigger to the configuration
  const addTrigger = (trigger) => {
    // Create a copy of the trigger with default parameter values
    const triggerWithParams = {
      id: trigger.id,
      category: selectedCategory,
      name: trigger.name,
      parameters: {}
    };

    // Initialize parameters with default values
    trigger.params.forEach(param => {
      if (param === 'percentage' || param === 'amount' || param === 'distance' || param === 'threshold_value' || param === 'health_threshold') {
        triggerWithParams.parameters[param] = 50;
      } else if (param === 'comparison') {
        triggerWithParams.parameters[param] = 'less_than';
      } else if (param === 'is_percent' || param === 'is_day') {
        triggerWithParams.parameters[param] = true;
      } else if (param === 'threshold_type') {
        triggerWithParams.parameters[param] = 'percentage'; // Default to percentage, can be changed to 'flat'
      } else if (param === 'resource_type') {
        triggerWithParams.parameters[param] = 'health';
      } else if (param === 'target_type') {
        triggerWithParams.parameters[param] = 'self';
      } else if (param === 'perspective') {
        triggerWithParams.parameters[param] = 'self'; // Default to self, can be changed to 'target', 'ally', 'enemy'
      } else if (param === 'stack_count') {
        triggerWithParams.parameters[param] = 3; // Default stack count
      } else if (param === 'duration') {
        triggerWithParams.parameters[param] = 2; // Default duration in rounds
      } else if (param === 'ability_id') {
        triggerWithParams.parameters[param] = ''; // Will be populated with available abilities
      } else if (param === 'damage_threshold') {
        triggerWithParams.parameters[param] = 10; // Default damage threshold
      } else if (param === 'damage_type' || param === 'type') { // Handle both 'damage_type' and legacy 'type'
        triggerWithParams.parameters[param] = 'any'; // Default to any damage type
      } else {
        triggerWithParams.parameters[param] = '';
      }
    });

    if (editingMode === 'global') {
      // Add to global triggers
      const updatedTriggers = [...(triggerConfig.compoundTriggers || [])];
      updatedTriggers.push(triggerWithParams);
      const newConfig = {
        ...triggerConfig,
        compoundTriggers: updatedTriggers
      };

      setTriggerConfig(newConfig);
      validateTriggerConfig(newConfig);
    } else if (editingMode === 'effect' && selectedEffect) {
      // Add to effect-specific triggers
      const newEffectTriggers = { ...effectTriggers };
      if (!newEffectTriggers[selectedEffect]) {
        newEffectTriggers[selectedEffect] = {
          logicType: 'AND',
          compoundTriggers: [triggerWithParams],
          targetingOverride: newEffectTriggers[selectedEffect]?.targetingOverride || null
        };
      } else {
        newEffectTriggers[selectedEffect] = {
          ...newEffectTriggers[selectedEffect],
          compoundTriggers: [...(newEffectTriggers[selectedEffect].compoundTriggers || []), triggerWithParams]
        };
      }
      setEffectTriggers(newEffectTriggers);

      // Update the context with the new effect triggers
      dispatch({
        type: ACTION_TYPES.UPDATE_EFFECT_TRIGGER,
        payload: {
          effectType: selectedEffect,
          triggerConfig: newEffectTriggers[selectedEffect]
        }
      });

      // If this effect is conditional, initialize conditional settings for this trigger
      if (conditionalEffects[selectedEffect]?.isConditional) {
        // For buff effects, initialize with stat modifiers if available
        if (selectedEffect === 'buff' || selectedEffect?.startsWith('buff_')) {
          if (state.buffConfig?.statModifiers && state.buffConfig.statModifiers.length > 0) {
            // Create a deep copy of stat modifiers to avoid modifying the base configuration
            const statModifiersCopy = state.buffConfig.statModifiers.map(stat => ({
              ...stat,
              // Create a new object for each stat modifier
              id: stat.id,
              name: stat.name,
              icon: stat.icon,
              magnitude: stat.magnitude,
              magnitudeType: stat.magnitudeType
            }));

            // Initialize with a copy of the stat modifiers from the base effect
            updateConditionalSettings(selectedEffect, trigger.id, 'statModifiers', statModifiersCopy);

            // Also set the duration - use durationValue as the primary source
            updateConditionalSettings(selectedEffect, trigger.id, 'duration',
              state.buffConfig?.durationValue || state.buffConfig?.duration || 3);

            // For time-based durations, use durationUnit, otherwise map durationType to appropriate unit
            let durationUnit = 'rounds';
            if (state.buffConfig?.durationType === 'time') {
              durationUnit = state.buffConfig?.durationUnit || 'minutes';
            } else if (state.buffConfig?.durationType === 'turns') {
              durationUnit = 'rounds';
            } else if (state.buffConfig?.durationType === 'rest') {
              durationUnit = state.buffConfig?.restType || 'short';
            } else if (state.buffConfig?.durationType === 'permanent') {
              durationUnit = 'permanent';
            }

            updateConditionalSettings(selectedEffect, trigger.id, 'durationUnit', durationUnit);
            updateConditionalSettings(selectedEffect, trigger.id, 'durationType', state.buffConfig?.durationType || 'turns');
          }
        }
        // For debuff effects, initialize with stat penalties if available
        else if (selectedEffect === 'debuff' || selectedEffect?.startsWith('debuff_')) {
          // Initialize with a deep copy of the stat penalties from the base effect
          if (state.debuffConfig?.statPenalties && state.debuffConfig.statPenalties.length > 0) {
            // Create a deep copy of stat penalties to avoid modifying the base configuration
            const statPenaltiesCopy = state.debuffConfig.statPenalties.map(stat => ({
              ...stat,
              // Create a new object for each stat penalty
              id: stat.id,
              name: stat.name,
              icon: stat.icon,
              magnitude: stat.magnitude,
              magnitudeType: stat.magnitudeType
            }));

            updateConditionalSettings(selectedEffect, trigger.id, 'statPenalties', statPenaltiesCopy);
          }

          // Set the duration - use durationValue as the primary source
          updateConditionalSettings(selectedEffect, trigger.id, 'duration',
            state.debuffConfig?.durationValue || state.debuffConfig?.duration || 3);

          // For time-based durations, use durationUnit, otherwise map durationType to appropriate unit
          let durationUnit = 'rounds';
          if (state.debuffConfig?.durationType === 'time') {
            durationUnit = state.debuffConfig?.durationUnit || 'minutes';
          } else if (state.debuffConfig?.durationType === 'turns') {
            durationUnit = 'rounds';
          } else if (state.debuffConfig?.durationType === 'rest') {
            durationUnit = state.debuffConfig?.restType || 'short';
          } else if (state.debuffConfig?.durationType === 'permanent') {
            durationUnit = 'permanent';
          }

          updateConditionalSettings(selectedEffect, trigger.id, 'durationUnit', durationUnit);
          updateConditionalSettings(selectedEffect, trigger.id, 'durationType', state.debuffConfig?.durationType || 'turns');

          // Set the saving throw
          updateConditionalSettings(selectedEffect, trigger.id, 'difficultyClass',
            state.debuffConfig?.difficultyClass || 15);
          updateConditionalSettings(selectedEffect, trigger.id, 'savingThrow',
            state.debuffConfig?.savingThrow || 'constitution'); // Use constitution as default

          // Set control type for debuff_control
          if (selectedEffect === 'debuff_control') {
            updateConditionalSettings(selectedEffect, trigger.id, 'controlType',
              state.debuffConfig?.controlType || 'slow');
          }
        }
        // For damage_dot effects, initialize with type, duration, and formula
        else if (selectedEffect === 'damage_dot') {
          // Initialize the formula
          updateConditionalFormula(selectedEffect, trigger.id, state.damageConfig?.formula || '1d6 + INT');

          // Initialize damage type settings
          updateConditionalSettings(selectedEffect, trigger.id, 'elementType',
            state.damageConfig?.elementType || 'Fire');
          updateConditionalSettings(selectedEffect, trigger.id, 'damageType', 'dot');

          // Initialize duration settings
          updateConditionalSettings(selectedEffect, trigger.id, 'dotDuration',
            state.damageConfig?.dotDuration || 3);
          updateConditionalSettings(selectedEffect, trigger.id, 'dotDurationUnit',
            state.damageConfig?.dotDurationUnit || 'rounds');
          updateConditionalSettings(selectedEffect, trigger.id, 'duration',
            state.damageConfig?.dotDuration || 3);
          updateConditionalSettings(selectedEffect, trigger.id, 'durationUnit',
            state.damageConfig?.dotDurationUnit || 'rounds');
        }
        // For other damage effects, initialize with type and formula
        else if (selectedEffect === 'damage' || selectedEffect?.startsWith('damage_')) {
          // Initialize the formula
          updateConditionalFormula(selectedEffect, trigger.id, state.damageConfig?.formula || '1d6 + INT');

          // Initialize damage type settings
          updateConditionalSettings(selectedEffect, trigger.id, 'elementType',
            state.damageConfig?.elementType || 'Fire');
          updateConditionalSettings(selectedEffect, trigger.id, 'damageType',
            state.damageConfig?.damageType || 'direct');
        }
        // For summoning effects, initialize with creature and control settings
        else if (selectedEffect === 'summon') {
          // Initialize summoning settings
          if (state.summonConfig?.creatures && state.summonConfig.creatures.length > 0) {
            updateConditionalSettings(selectedEffect, trigger.id, 'creatures',
              [...state.summonConfig.creatures]);
          }

          updateConditionalSettings(selectedEffect, trigger.id, 'duration',
            state.summonConfig?.duration || 10);
          updateConditionalSettings(selectedEffect, trigger.id, 'durationUnit',
            state.summonConfig?.durationUnit || 'minutes');
          updateConditionalSettings(selectedEffect, trigger.id, 'quantity',
            state.summonConfig?.quantity || state.summonConfig?.count || 1);
          updateConditionalSettings(selectedEffect, trigger.id, 'controlType',
            state.summonConfig?.controlType || 'verbal');
          updateConditionalSettings(selectedEffect, trigger.id, 'controlRange',
            state.summonConfig?.controlRange || 60);
        }
        // For control effects, initialize with control settings
        else if (selectedEffect === 'control') {
          // Initialize control settings
          updateConditionalSettings(selectedEffect, trigger.id, 'controlType',
            state.controlConfig?.controlType || 'stun');
          updateConditionalSettings(selectedEffect, trigger.id, 'duration',
            state.controlConfig?.duration || 1);
          updateConditionalSettings(selectedEffect, trigger.id, 'durationUnit',
            state.controlConfig?.durationUnit || 'rounds');
          updateConditionalSettings(selectedEffect, trigger.id, 'savingThrow',
            state.controlConfig?.savingThrow || 'strength');
          updateConditionalSettings(selectedEffect, trigger.id, 'difficultyClass',
            state.controlConfig?.difficultyClass || 15);

          // If there are effects, copy them as well
          if (state.controlConfig?.effects && state.controlConfig.effects.length > 0) {
            updateConditionalSettings(selectedEffect, trigger.id, 'effects',
              [...state.controlConfig.effects]);
          }
        }
        // For restoration effects, initialize with resource type and formula
        else if (selectedEffect === 'restoration' || selectedEffect?.startsWith('restoration_')) {
          // Initialize the formula
          updateConditionalFormula(selectedEffect, trigger.id, state.restorationConfig?.formula || '2d6 + INT');

          // Initialize resource type settings
          updateConditionalSettings(selectedEffect, trigger.id, 'resourceType',
            state.restorationConfig?.resourceType || 'mana');
          updateConditionalSettings(selectedEffect, trigger.id, 'resolution',
            state.restorationConfig?.resolution || 'DICE');

          // Initialize over-time settings if applicable
          if (state.restorationConfig?.isOverTime) {
            updateConditionalSettings(selectedEffect, trigger.id, 'isOverTime', true);
            updateConditionalSettings(selectedEffect, trigger.id, 'overTimeFormula',
              state.restorationConfig?.overTimeFormula || '1d4 + INT/2');
            updateConditionalSettings(selectedEffect, trigger.id, 'overTimeDuration',
              state.restorationConfig?.overTimeDuration || 3);
            updateConditionalSettings(selectedEffect, trigger.id, 'tickFrequency',
              state.restorationConfig?.tickFrequency || 'round');
            updateConditionalSettings(selectedEffect, trigger.id, 'application',
              state.restorationConfig?.application || 'start');
            updateConditionalSettings(selectedEffect, trigger.id, 'overTimeTriggerType',
              state.restorationConfig?.overTimeTriggerType || 'periodic');
          }

          // Initialize progressive stages if applicable
          if (state.restorationConfig?.isProgressiveOverTime &&
              state.restorationConfig?.overTimeProgressiveStages &&
              state.restorationConfig.overTimeProgressiveStages.length > 0) {
            updateConditionalSettings(selectedEffect, trigger.id, 'isProgressiveOverTime', true);
            updateConditionalSettings(selectedEffect, trigger.id, 'overTimeProgressiveStages',
              [...state.restorationConfig.overTimeProgressiveStages]);
          }
        }
        else {
          // For other effects, just initialize the formula
          updateConditionalFormula(selectedEffect, trigger.id, '');
        }
      }
    }
  };

  // Remove a trigger from the configuration
  const removeTrigger = (index) => {
    if (editingMode === 'global') {
      // Remove from global triggers
      const updatedTriggers = [...(triggerConfig.compoundTriggers || [])];
      updatedTriggers.splice(index, 1);

      const newConfig = {
        ...triggerConfig,
        compoundTriggers: updatedTriggers
      };

      setTriggerConfig(newConfig);
      validateTriggerConfig(newConfig);
    } else if (editingMode === 'effect' && selectedEffect && effectTriggers[selectedEffect]) {
      // Remove from effect-specific triggers
      const newEffectTriggers = { ...effectTriggers };
      const updatedTriggers = [...(newEffectTriggers[selectedEffect].compoundTriggers || [])];
      updatedTriggers.splice(index, 1);

      newEffectTriggers[selectedEffect] = {
        ...newEffectTriggers[selectedEffect],
        compoundTriggers: updatedTriggers
      };

      setEffectTriggers(newEffectTriggers);

      // Update the context with the new effect triggers
      dispatch({
        type: ACTION_TYPES.UPDATE_EFFECT_TRIGGER,
        payload: {
          effectType: selectedEffect,
          triggerConfig: newEffectTriggers[selectedEffect]
        }
      });
    }
  };

  // Update a trigger parameter
  const updateTriggerParameter = (triggerIndex, paramName, value) => {
    if (editingMode === 'global') {
      // Update global trigger parameter
      const updatedTriggers = [...(triggerConfig.compoundTriggers || [])];
      updatedTriggers[triggerIndex].parameters[paramName] = value;

      const newConfig = {
        ...triggerConfig,
        compoundTriggers: updatedTriggers
      };

      setTriggerConfig(newConfig);
      validateTriggerConfig(newConfig);
    } else if (editingMode === 'effect' && selectedEffect && effectTriggers[selectedEffect]) {
      // Update effect-specific trigger parameter
      const newEffectTriggers = { ...effectTriggers };
      const updatedTriggers = [...(newEffectTriggers[selectedEffect].compoundTriggers || [])];
      updatedTriggers[triggerIndex].parameters[paramName] = value;

      newEffectTriggers[selectedEffect] = {
        ...newEffectTriggers[selectedEffect],
        compoundTriggers: updatedTriggers
      };

      setEffectTriggers(newEffectTriggers);

      // Update the context with the new effect triggers
      dispatch({
        type: ACTION_TYPES.UPDATE_EFFECT_TRIGGER,
        payload: {
          effectType: selectedEffect,
          triggerConfig: newEffectTriggers[selectedEffect]
        }
      });
    }
  };

  // Set the logic type (AND/OR)
  const setLogicType = (logicType) => {
    if (editingMode === 'global') {
      // Set global logic type
      const newConfig = {
        ...triggerConfig,
        logicType
      };

      setTriggerConfig(newConfig);
    } else if (editingMode === 'effect' && selectedEffect) {
      // Set effect-specific logic type
      const newEffectTriggers = { ...effectTriggers };
      if (!newEffectTriggers[selectedEffect]) {
        newEffectTriggers[selectedEffect] = {
          logicType,
          compoundTriggers: [],
          targetingOverride: null
        };
      } else {
        newEffectTriggers[selectedEffect] = {
          ...newEffectTriggers[selectedEffect],
          logicType
        };
      }

      setEffectTriggers(newEffectTriggers);

      // Update the context with the new effect triggers
      dispatch({
        type: ACTION_TYPES.UPDATE_EFFECT_TRIGGER,
        payload: {
          effectType: selectedEffect,
          triggerConfig: newEffectTriggers[selectedEffect]
        }
      });
    }
  };

  // Toggle conditional activation for an effect
  const toggleConditionalEffect = (effectType, isConditional) => {
    const newConditionalEffects = { ...conditionalEffects };

    // Get the base formula and settings for this effect type
    let baseFormula = '';
    let baseSettings = {};

    switch(effectType) {
      case 'damage':
      case 'damage_direct':
        // Use the actual formula from the damage configuration
        baseFormula = state.damageConfig?.formula || '1d6 + INT';
        console.log('Using damage formula:', baseFormula);
        baseSettings = {
          damageType: state.damageConfig?.damageType || 'direct',
          elementType: state.damageConfig?.elementType || 'fire'
        };
        break;
      case 'damage_dot':
        // Use the actual formula from the damage configuration
        baseFormula = state.damageConfig?.formula || '1d6 + INT';
        console.log('Using damage_dot formula:', baseFormula);
        baseSettings = {
          damageType: 'dot',
          elementType: state.damageConfig?.elementType || 'fire',
          dotDuration: state.damageConfig?.dotDuration || 3,
          dotDurationUnit: state.damageConfig?.dotDurationUnit || 'rounds',
          duration: state.damageConfig?.dotDuration || 3,
          durationUnit: state.damageConfig?.dotDurationUnit || 'rounds'
        };
        break;
      case 'damage_combined':
        // Use the actual formula from the damage configuration
        baseFormula = state.damageConfig?.formula || '1d6 + INT';
        console.log('Using damage_combined formula:', baseFormula);
        baseSettings = {
          damageType: 'combined',
          elementType: state.damageConfig?.elementType || 'fire',
          dotFormula: state.damageConfig?.dotFormula || '1d4 + INT/2',
          dotDuration: state.damageConfig?.dotDuration || 3,
          dotDurationUnit: state.damageConfig?.dotDurationUnit || 'rounds'
        };
        break;
      case 'healing':
        // Use the actual formula from the healing configuration
        baseFormula = state.healingConfig?.formula || '2d8 + HEA';
        console.log('Using healing formula:', baseFormula);
        baseSettings = {
          healingType: state.healingConfig?.healingType || 'direct',
          hasHotEffect: state.healingConfig?.hasHotEffect === true,
          hasShieldEffect: state.healingConfig?.hasShieldEffect === true
        };
        break;
      case 'buff':
        // Use the actual formula from the buff configuration
        // If there are stat modifiers, use the first one's magnitude
        if (state.buffConfig?.statModifiers && state.buffConfig.statModifiers.length > 0) {
          const firstStat = state.buffConfig.statModifiers[0];
          baseFormula = typeof firstStat.magnitude === 'string'
            ? firstStat.magnitude
            : (firstStat.magnitudeType === 'percentage'
                ? `+${firstStat.magnitude}%`
                : `+${firstStat.magnitude}`);
        } else {
          baseFormula = state.buffConfig?.formula || '+2';
        }
        console.log('Using buff formula:', baseFormula);
        baseSettings = {
          duration: state.buffConfig?.duration || 3,
          durationUnit: state.buffConfig?.durationUnit || 'rounds'
        };

        // If we have stat modifiers, initialize them in the conditional settings
        if (state.buffConfig?.statModifiers && state.buffConfig.statModifiers.length > 0) {
          // Create a deep copy of stat modifiers to avoid modifying the base configuration
          const statModifiersCopy = state.buffConfig.statModifiers.map(stat => ({
            ...stat,
            // Create a new object for each stat modifier
            id: stat.id,
            name: stat.name,
            icon: stat.icon,
            magnitude: stat.magnitude,
            magnitudeType: stat.magnitudeType
          }));

          // Use updateConditionalSettings to set the stat modifiers
          updateConditionalSettings(effectType, 'default', 'statModifiers', statModifiersCopy);
        }
        break;
      case 'debuff':
      case 'debuff_stat':
      case 'debuff_control':
        // Use the actual formula from the debuff configuration
        // If there are stat penalties, use the first one's magnitude
        if (state.debuffConfig?.statPenalties && state.debuffConfig.statPenalties.length > 0) {
          const firstStat = state.debuffConfig.statPenalties[0];
          baseFormula = typeof firstStat.magnitude === 'string'
            ? firstStat.magnitude
            : (firstStat.magnitudeType === 'percentage'
                ? `${firstStat.magnitude}%` // Negative values already have the minus sign
                : `${firstStat.magnitude}`);
        } else {
          baseFormula = state.debuffConfig?.formula || '-2';
        }
        console.log('Using debuff formula:', baseFormula);
        baseSettings = {
          duration: state.debuffConfig?.duration || 3,
          durationUnit: state.debuffConfig?.durationUnit || 'rounds',
          difficultyClass: state.debuffConfig?.difficultyClass || 15,
          savingThrow: state.debuffConfig?.savingThrow || 'constitution' // Default to constitution if not set
        };

        // If we have stat penalties, initialize them in the conditional settings
        if (state.debuffConfig?.statPenalties && state.debuffConfig.statPenalties.length > 0) {
          // Create a deep copy of stat penalties to avoid modifying the base configuration
          const statPenaltiesCopy = state.debuffConfig.statPenalties.map(stat => ({
            ...stat,
            // Create a new object for each stat penalty
            id: stat.id,
            name: stat.name,
            icon: stat.icon,
            magnitude: stat.magnitude,
            magnitudeType: stat.magnitudeType
          }));

          // Use updateConditionalSettings to set the stat penalties
          updateConditionalSettings(effectType, 'default', 'statPenalties', statPenaltiesCopy);
        }

        // For control debuffs, add the control type
        if (effectType === 'debuff_control') {
          baseSettings.controlType = state.debuffConfig?.controlType || 'slow';
        }
        break;
      case 'control':
        baseFormula = '';
        baseSettings = {
          duration: state.controlConfig?.duration || 1,
          durationUnit: state.controlConfig?.durationUnit || 'rounds',
          savingThrow: state.controlConfig?.savingThrow || 'strength',
          difficultyClass: state.controlConfig?.difficultyClass || 15,
          controlType: state.controlConfig?.controlType || 'stun',
          effects: state.controlConfig?.effects || []
        };
        break;
      case 'summon':
        baseFormula = '';
        baseSettings = {
          duration: state.summonConfig?.duration || 10,
          quantity: state.summonConfig?.quantity || 1
        };
        break;
      case 'transform':
        baseFormula = '';
        baseSettings = {
          duration: state.transformConfig?.duration || 10,
          difficultyClass: state.transformConfig?.difficultyClass || 15
        };
        break;
      case 'restoration':
      case 'restoration_resource':
        // Use the actual formula from the restoration configuration
        baseFormula = state.restorationConfig?.formula || '2d6 + INT';
        console.log('Using restoration formula:', baseFormula);
        baseSettings = {
          resourceType: state.restorationConfig?.resourceType || 'mana',
          resolution: state.restorationConfig?.resolution || 'DICE',
          isOverTime: state.restorationConfig?.isOverTime || false,
          overTimeFormula: state.restorationConfig?.overTimeFormula || '1d4 + INT/2',
          overTimeDuration: state.restorationConfig?.overTimeDuration || 3,
          tickFrequency: state.restorationConfig?.tickFrequency || 'round',
          isProgressiveOverTime: state.restorationConfig?.isProgressiveOverTime || false,
          overTimeProgressiveStages: state.restorationConfig?.overTimeProgressiveStages || []
        };
        break;
      default:
        baseFormula = '';
        baseSettings = {};
    }

    if (isConditional) {
      // Initialize conditional effect if it doesn't exist
      if (!newConditionalEffects[effectType]) {
        newConditionalEffects[effectType] = {
          isConditional: true,
          defaultEnabled: true,
          baseFormula: baseFormula,
          baseSettings: baseSettings,
          conditionalFormulas: {
            'default': baseFormula
          },
          conditionalSettings: {}
        };
      } else {
        newConditionalEffects[effectType] = {
          ...newConditionalEffects[effectType],
          isConditional: true,
          baseFormula: baseFormula,
          baseSettings: baseSettings
        };

        // Make sure default formula exists
        if (!newConditionalEffects[effectType].conditionalFormulas?.default) {
          newConditionalEffects[effectType].conditionalFormulas = {
            ...newConditionalEffects[effectType].conditionalFormulas,
            'default': baseFormula
          };
        }
      }
    } else {
      // If turning off conditional mode, keep the config but mark as not conditional
      if (newConditionalEffects[effectType]) {
        newConditionalEffects[effectType] = {
          ...newConditionalEffects[effectType],
          isConditional: false
        };
      }
    }

    setConditionalEffects(newConditionalEffects);
  };

  // Update conditional formula for a specific trigger
  const updateConditionalFormula = (effectType, triggerId, formula) => {
    const newConditionalEffects = { ...conditionalEffects };

    // Get the base formula for this effect type if we need to initialize
    let baseFormula = newConditionalEffects[effectType]?.baseFormula || '';
    let baseSettings = newConditionalEffects[effectType]?.baseSettings || {};

    if (!baseFormula) {
      switch(effectType) {
        case 'damage':
        case 'damage_direct':
        case 'damage_dot':
        case 'damage_combined':
          // Use the actual formula from the damage configuration
          baseFormula = state.damageConfig?.formula || '1d6 + INT';
          break;
        case 'healing':
          // Use the actual formula from the healing configuration
          baseFormula = state.healingConfig?.formula || '2d8 + HEA';
          break;
        case 'buff':
          // Use the actual formula from the buff configuration
          if (state.buffConfig?.statModifiers && state.buffConfig.statModifiers.length > 0) {
            const firstStat = state.buffConfig.statModifiers[0];
            baseFormula = typeof firstStat.magnitude === 'string'
              ? firstStat.magnitude
              : (firstStat.magnitudeType === 'percentage'
                  ? `+${firstStat.magnitude}%`
                  : `+${firstStat.magnitude}`);
          } else {
            baseFormula = state.buffConfig?.formula || '+2';
          }
          break;
        case 'debuff':
        case 'debuff_stat':
        case 'debuff_control':
          // Use the actual formula from the debuff configuration
          if (state.debuffConfig?.statPenalties && state.debuffConfig.statPenalties.length > 0) {
            const firstStat = state.debuffConfig.statPenalties[0];
            baseFormula = typeof firstStat.magnitude === 'string'
              ? firstStat.magnitude
              : (firstStat.magnitudeType === 'percentage'
                  ? `${firstStat.magnitude}%` // Negative values already have the minus sign
                  : `${firstStat.magnitude}`);
          } else {
            baseFormula = state.debuffConfig?.formula || '-2';
          }
          break;
        case 'restoration':
        case 'restoration_resource':
          // Use the actual formula from the restoration configuration
          baseFormula = state.restorationConfig?.formula || '2d6 + INT';
          break;
        default:
          baseFormula = '';
      }
    }

    if (!newConditionalEffects[effectType]) {
      newConditionalEffects[effectType] = {
        isConditional: true,
        defaultEnabled: true,
        baseFormula: baseFormula,
        baseSettings: baseSettings,
        conditionalFormulas: {
          [triggerId]: formula,
          'default': baseFormula
        },
        conditionalSettings: {}
      };
    } else {
      newConditionalEffects[effectType] = {
        ...newConditionalEffects[effectType],
        conditionalFormulas: {
          ...newConditionalEffects[effectType].conditionalFormulas,
          [triggerId]: formula
        }
      };
    }

    setConditionalEffects(newConditionalEffects);
  };

  // Update conditional settings for a specific trigger
  const updateConditionalSettings = (effectType, triggerId, settingKey, value) => {
    const newConditionalEffects = { ...conditionalEffects };

    if (!newConditionalEffects[effectType]) {
      // Initialize with base settings
      let baseSettings = {};
      switch(effectType) {
        case 'damage':
        case 'damage_direct':
          baseSettings = {
            damageType: state.damageConfig?.damageType || 'direct',
            elementType: state.damageConfig?.elementType || 'fire'
          };
          break;
        case 'damage_dot':
          baseSettings = {
            damageType: 'dot',
            elementType: state.damageConfig?.elementType || 'fire',
            dotDuration: state.damageConfig?.dotDuration || 3,
            dotDurationUnit: state.damageConfig?.dotDurationUnit || 'rounds',
            duration: state.damageConfig?.dotDuration || 3,
            durationUnit: state.damageConfig?.dotDurationUnit || 'rounds'
          };
          break;
        case 'damage_combined':
          baseSettings = {
            damageType: 'combined',
            elementType: state.damageConfig?.elementType || 'fire',
            dotFormula: state.damageConfig?.dotFormula || '1d4 + INT/2',
            dotDuration: state.damageConfig?.dotDuration || 3,
            dotDurationUnit: state.damageConfig?.dotDurationUnit || 'rounds'
          };
          break;
        case 'healing':
          baseSettings = {
            healingType: state.healingConfig?.healingType || 'direct'
          };
          break;
        case 'control':
          baseSettings = {
            duration: state.controlConfig?.duration || 1,
            savingThrow: state.controlConfig?.savingThrow || 'strength',
            difficultyClass: state.controlConfig?.difficultyClass || 15
          };
          break;
        case 'restoration':
        case 'restoration_resource':
          baseSettings = {
            resourceType: state.restorationConfig?.resourceType || 'mana',
            resolution: state.restorationConfig?.resolution || 'DICE',
            isOverTime: state.restorationConfig?.isOverTime || false,
            overTimeFormula: state.restorationConfig?.overTimeFormula || '1d4 + INT/2',
            overTimeDuration: state.restorationConfig?.overTimeDuration || 3,
            tickFrequency: state.restorationConfig?.tickFrequency || 'round',
            isProgressiveOverTime: state.restorationConfig?.isProgressiveOverTime || false,
            overTimeProgressiveStages: state.restorationConfig?.overTimeProgressiveStages || []
          };
          break;
        default:
          baseSettings = {};
      }

      newConditionalEffects[effectType] = {
        isConditional: true,
        defaultEnabled: true,
        baseSettings: baseSettings,
        conditionalFormulas: {},
        conditionalSettings: {
          [triggerId]: {
            [settingKey]: value
          }
        }
      };
    } else {
      // Make sure conditionalSettings exists
      if (!newConditionalEffects[effectType].conditionalSettings) {
        newConditionalEffects[effectType].conditionalSettings = {};
      }

      // Make sure settings for this trigger exist
      if (!newConditionalEffects[effectType].conditionalSettings[triggerId]) {
        newConditionalEffects[effectType].conditionalSettings[triggerId] = {};
      }

      // Update the specific setting
      newConditionalEffects[effectType].conditionalSettings = {
        ...newConditionalEffects[effectType].conditionalSettings,
        [triggerId]: {
          ...newConditionalEffects[effectType].conditionalSettings[triggerId],
          [settingKey]: value
        }
      };
    }

    // If updating a stat modifier, also update the formula for backward compatibility
    if (settingKey === 'statModifiers' && effectType.startsWith('buff')) {
      // Use the first stat's magnitude as the formula if available
      const firstStat = value[0];
      if (firstStat && firstStat.magnitude !== undefined) {
        const formula = typeof firstStat.magnitude === 'string'
          ? firstStat.magnitude
          : (firstStat.magnitudeType === 'percentage'
              ? `+${firstStat.magnitude}%`
              : `+${firstStat.magnitude}`);

        if (!newConditionalEffects[effectType].conditionalFormulas) {
          newConditionalEffects[effectType].conditionalFormulas = {};
        }

        newConditionalEffects[effectType].conditionalFormulas[triggerId] = formula;
      }
    }

    // If updating a stat penalty, also update the formula for backward compatibility
    if (settingKey === 'statPenalties' && effectType.startsWith('debuff')) {
      // Use the first stat's magnitude as the formula if available
      const firstStat = value[0];
      if (firstStat && firstStat.magnitude !== undefined) {
        const formula = typeof firstStat.magnitude === 'string'
          ? firstStat.magnitude
          : (firstStat.magnitudeType === 'percentage'
              ? `${firstStat.magnitude}%` // Negative values already have the minus sign
              : `${firstStat.magnitude}`);

        if (!newConditionalEffects[effectType].conditionalFormulas) {
          newConditionalEffects[effectType].conditionalFormulas = {};
        }

        newConditionalEffects[effectType].conditionalFormulas[triggerId] = formula;
      }
    }

    setConditionalEffects(newConditionalEffects);
  };

  // Validate the trigger configuration
  const validateTriggerConfig = (config) => {
    const validationErrors = [];

    // For REACTION, PASSIVE, TRAP, or STATE spells, global triggers are required
    if (requiresTriggers && (!config || !config.compoundTriggers || config.compoundTriggers.length === 0)) {
      validationErrors.push('Please add at least one global trigger condition');
    }

    // For compound triggers, validate each trigger
    if (config && config.compoundTriggers && config.compoundTriggers.length > 0) {
      config.compoundTriggers.forEach((trigger, index) => {
        if (!trigger.id || !trigger.category) {
          validationErrors.push(`Trigger #${index + 1} is incomplete`);
        } else {
          // In a real app, we'd use TriggerUtils.validateTriggerParameters here
        }
      });
    }

    // Validate effect-specific triggers if any are defined
    if (editingMode === 'effect' && selectedEffect && effectTriggers[selectedEffect]) {
      const effectTriggerConfig = effectTriggers[selectedEffect];
      if (effectTriggerConfig.compoundTriggers && effectTriggerConfig.compoundTriggers.length > 0) {
        effectTriggerConfig.compoundTriggers.forEach((trigger, index) => {
          if (!trigger.id || !trigger.category) {
            validationErrors.push(`Effect trigger #${index + 1} is incomplete`);
          }
        });
      }
    }

    setErrors(validationErrors);
    return validationErrors;
  };

  // Step-specific helpful hints
  const hintsList = [
    "Triggers define when your spell activates automatically.",
    "For combat spells, consider 'Damage Taken' or 'Health Threshold' triggers.",
    "For utility spells, environmental triggers like 'Weather Change' can create unique effects.",
    "Combining multiple triggers with AND logic creates more specific activation conditions.",
    "Using OR logic makes your spell trigger more frequently in various situations."
  ];

  // Skip this step if it shouldn't be shown
  if (!shouldShowStep) {
    return (
      <WizardStep
        title="Trigger Conditions"
        stepNumber={stepNumber}
        totalSteps={totalSteps}
        isCompleted={true}
        isActive={isActive}
        onNext={onNext}
        onPrevious={onPrevious}
        disableNext={false}
        hints={hintsList}
        hiddenCondition={true}
      >
        <div></div>
      </WizardStep>
    );
  }

  return (
    <WizardStep
      title="Trigger Conditions"
      stepNumber={stepNumber}
      totalSteps={totalSteps}
      isCompleted={isCompleted}
      isActive={isActive}
      onNext={onNext}
      onPrevious={onPrevious}
      disableNext={errors.length > 0 || (requiresTriggers && triggerConfig?.compoundTriggers?.length === 0)}
      hints={hintsList}
      showHints={true}
    >
      <div className="spell-effects-container">
        <div className="step-description mb-md">
          <p>
            Configure when your {state.spellType.toLowerCase()} spell will automatically trigger.
            Define conditions that, when met, will cause your spell to activate without manual input.
          </p>
          <p className="mb-sm">{recommendationText}</p>
          {state.spellType === 'REACTION' && (
            <div className="effect-description">
              <strong>Note:</strong> Reaction spells <strong>require</strong> trigger conditions as they activate automatically
              in response to game events.
            </div>
          )}
          {state.spellType === 'TRAP' && (
            <div className="effect-description">
              <strong>Note:</strong> Trap spells <strong>require</strong> trigger conditions that determine when the trap activates
              after being placed in the environment.
            </div>
          )}
          {state.spellType === 'STATE' && (
            <div className="effect-description">
              <strong>Note:</strong> State spells <strong>require</strong> trigger conditions that determine when the spell activates
              automatically. These are typically resource-based or combat state conditions.
            </div>
          )}
          {state.spellType === 'ACTION' && (
            <div className="effect-description">
              <strong>Note:</strong> For Action spells, triggers are <strong>optional</strong>. Adding triggers allows your spell to have additional effects that activate automatically when certain conditions are met, such as movement-based debuffs.
            </div>
          )}
        </div>

        {errors.length > 0 && (
          <div className="effect-config-group mb-md">
            <h4 className="text-danger">Please fix the following issues:</h4>
            <ul className="mb-md">
              {errors.map((error, index) => (
                <li key={index} className="text-danger">{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Trigger Mode Selection - MOVED TO TOP */}
        <div className="effect-config-group mb-md">
          <h4 className="effect-config-label">Trigger Mode</h4>
          <p className="mb-sm">Choose whether to configure global triggers for the entire spell or effect-specific triggers.</p>

          <div className="wow-trigger-mode-selector">
            <button
              className={`wow-trigger-mode-button ${editingMode === 'global' ? 'active' : ''}`}
              onClick={() => setEditingMode('global')}
            >
              <div className="wow-trigger-mode-icon">
                <img
                  src="https://wow.zamimg.com/images/wow/icons/large/spell_arcane_portalshattrath.jpg"
                  alt="Global"
                  className="wow-trigger-mode-img"
                />
              </div>
              <div className="wow-trigger-mode-text">
                <div className="wow-trigger-mode-title">Global Triggers</div>
                <div className="wow-trigger-mode-description">Apply to the entire spell</div>
              </div>
            </button>
            <button
              className={`wow-trigger-mode-button ${editingMode === 'effect' ? 'active' : ''}`}
              onClick={() => setEditingMode('effect')}
              disabled={state.effectTypes.length === 0}
            >
              <div className="wow-trigger-mode-icon">
                <img
                  src="https://wow.zamimg.com/images/wow/icons/large/spell_arcane_portaldarnassus.jpg"
                  alt="Effect-Specific"
                  className="wow-trigger-mode-img"
                />
              </div>
              <div className="wow-trigger-mode-text">
                <div className="wow-trigger-mode-title">Effect-Specific Triggers</div>
                <div className="wow-trigger-mode-description">Configure triggers and conditional effects</div>
              </div>
            </button>
          </div>
        </div>

        {/* Effect Selection (only shown in effect-specific mode) */}
        {editingMode === 'effect' && (
          <div className="effect-config-group mb-md">
            <h4 className="effect-config-label">Select Effect</h4>
            <p className="mb-sm">Choose which effect to configure triggers and conditional behavior for.</p>

            <div className="wow-effect-selector">
              {state.effectTypes.map(effectType => {
                // Define all possible sub-options for each effect type
                const allSubOptions = {
                  damage: [
                    { id: 'damage_direct', name: 'Direct Damage', icon: 'spell_fire_fireball02',
                      check: () => state.damageConfig && state.damageConfig.damageType === 'direct' },
                    { id: 'damage_dot', name: 'Damage Over Time', icon: 'spell_shadow_curseofsargeras',
                      check: () => state.damageConfig && state.damageConfig.damageType === 'dot' },
                    { id: 'damage_combined', name: 'Combined Damage', icon: 'inv_elemental_primal_fire',
                      check: () => state.damageConfig && state.damageConfig.damageType === 'combined' }
                  ],
                  healing: [
                    { id: 'healing_direct', name: 'Direct Healing', icon: 'spell_holy_flashheal',
                      check: () => state.healingConfig && state.healingConfig.healingType === 'direct' },
                    { id: 'healing_hot', name: 'Healing Over Time', icon: 'spell_holy_renew',
                      check: () => state.healingConfig && state.healingConfig.healingType === 'hot' },
                    { id: 'healing_shield', name: 'Absorption Shield', icon: 'spell_holy_powerwordshield',
                      check: () => state.healingConfig && state.healingConfig.hasShieldEffect === true },
                    { id: 'healing_combined', name: 'Combined Healing', icon: 'spell_holy_holybolt',
                      check: () => state.healingConfig && state.healingConfig.healingType === 'combined' }
                  ],
                  buff: [
                    { id: 'buff_stat', name: 'Stat Buff', icon: 'spell_holy_wordfortitude',
                      check: () => state.buffConfig && state.buffConfig.buffType === 'stat' },
                    { id: 'buff_protection', name: 'Protection', icon: 'spell_holy_devotionaura',
                      check: () => state.buffConfig && state.buffConfig.buffType === 'protection' },
                    { id: 'buff_utility', name: 'Utility', icon: 'spell_nature_invisibilty',
                      check: () => state.buffConfig && state.buffConfig.buffType === 'utility' }
                  ],
                  debuff: [
                    { id: 'debuff_stat', name: 'Stat Debuff', icon: 'spell_shadow_curseofachimonde',
                      check: () => state.debuffConfig && state.debuffConfig.debuffType === 'stat' },
                    { id: 'debuff_control', name: 'Control', icon: 'spell_frost_chainsofice',
                      check: () => state.debuffConfig && state.debuffConfig.debuffType === 'control' },
                    { id: 'debuff_utility', name: 'Utility', icon: 'spell_shadow_mindrot',
                      check: () => state.debuffConfig && state.debuffConfig.debuffType === 'utility' }
                  ]
                };

                // Filter sub-options to only include those that were configured in previous steps
                const configuredSubOptions = allSubOptions[effectType] ?
                  allSubOptions[effectType].filter(option => option.check()) : [];

                // If no specific sub-options were configured, show the main effect type
                const hasConfiguredSubOptions = configuredSubOptions.length > 0;

                return (
                  <div key={effectType} className="wow-effect-group">
                    <div className="wow-effect-main">
                      <button
                        className={`wow-effect-button ${selectedEffect === effectType || (selectedEffect && selectedEffect.startsWith(effectType)) ? 'active' : ''}`}
                        onClick={() => setSelectedEffect(effectType)}
                      >
                        <div className="wow-effect-icon">
                          <img
                            src={getEffectIconUrl(effectType)}
                            alt={effectType}
                            className="wow-effect-img"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg";
                            }}
                          />
                        </div>
                        <div className="wow-effect-text">
                          <div className="wow-effect-title">{effectType.charAt(0).toUpperCase() + effectType.slice(1)}</div>
                        </div>
                      </button>

                      {/* Show configured sub-options as buttons next to the main effect */}
                      {hasConfiguredSubOptions && (
                        <div className="wow-effect-suboptions-row">
                          {configuredSubOptions.map(subOption => (
                            <button
                              key={subOption.id}
                              className={`wow-effect-suboption-button ${selectedEffect === subOption.id ? 'active' : ''}`}
                              onClick={() => setSelectedEffect(subOption.id)}
                              title={subOption.name}
                            >
                              <img
                                src={`https://wow.zamimg.com/images/wow/icons/large/${subOption.icon}.jpg`}
                                alt={subOption.name}
                                className="wow-suboption-icon"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg";
                                }}
                              />
                              <span>
                                {subOption.id === 'healing_hot' ? 'HoT' :
                                 subOption.id === 'healing_shield' ? 'Shield' :
                                 subOption.name.split(' ').pop()}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Effect-Specific Configuration - Combined Triggers and Conditional Effects */}
        {editingMode === 'effect' && selectedEffect && (
          <div className="effect-config-group mb-md">
            <div className="wow-effect-config-tabs">
              <button
                className="wow-effect-config-tab active"
                onClick={() => {/* Tab is already active */}}
              >
                {selectedEffect.charAt(0).toUpperCase() + selectedEffect.slice(1)} Configuration
              </button>
            </div>

            <div className="wow-effect-config-content">
              {/* Base Effect Information */}
              <div className="wow-effect-base-info">
                <h5 className="wow-effect-subtitle">Base Effect Information</h5>
                <div className="wow-effect-base-details">
                  {/* Damage effects */}
                  {(selectedEffect === 'damage' || selectedEffect?.startsWith('damage_')) && state.damageConfig && (
                    <>
                      <div className="wow-effect-detail">
                        <span className="wow-effect-detail-label">
                          <img
                            src="https://wow.zamimg.com/images/wow/icons/small/inv_elemental_primal_fire.jpg"
                            alt="Type"
                            className="wow-element-icon"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://wow.zamimg.com/images/wow/icons/small/inv_misc_questionmark.jpg";
                            }}
                          />Type:
                        </span>
                        <span className="wow-effect-detail-value">
                          <img
                            src={`https://wow.zamimg.com/images/wow/icons/small/spell_${state.damageConfig.elementType?.toLowerCase() || 'fire'}_fireball02.jpg`}
                            alt={state.damageConfig.elementType || 'Fire'}
                            className="wow-element-icon"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://wow.zamimg.com/images/wow/icons/small/inv_misc_questionmark.jpg";
                            }}
                          />
                          {state.damageConfig.elementType || 'Fire'} ({state.damageConfig.damageType === 'dot' ? 'DoT' :
                            state.damageConfig.damageType?.charAt(0).toUpperCase() + state.damageConfig.damageType?.slice(1) || 'Direct'})
                        </span>
                      </div>
                      <div className="wow-effect-detail">
                        <span className="wow-effect-detail-label">Formula:</span>
                        <span className="wow-effect-detail-value">{state.damageConfig.formula || '1d6 + INT'}</span>
                      </div>
                      {selectedEffect === 'damage_dot' && (
                        <div className="wow-effect-detail">
                          <span className="wow-effect-detail-label">Duration:</span>
                          <span className="wow-effect-detail-value">{state.damageConfig.dotDuration || '3'} {state.damageConfig.dotDurationUnit || 'rounds'}</span>
                        </div>
                      )}
                      {selectedEffect === 'damage_combined' && (
                        <>
                          <div className="wow-effect-detail">
                            <span className="wow-effect-detail-label">DoT Formula:</span>
                            <span className="wow-effect-detail-value">{state.damageConfig.dotFormula || '1d4 + INT/2'}</span>
                          </div>
                          <div className="wow-effect-detail">
                            <span className="wow-effect-detail-label">DoT Duration:</span>
                            <span className="wow-effect-detail-value">{state.damageConfig.dotDuration || '3'} {state.damageConfig.dotDurationUnit || 'rounds'}</span>
                          </div>
                        </>
                      )}
                    </>
                  )}

                  {/* Healing effects */}
                  {(selectedEffect === 'healing' || selectedEffect?.startsWith('healing_')) && state.healingConfig && (
                    <div className="wow-effect-details-container">
                      <div className="wow-effect-detail">
                        <span className="wow-effect-detail-label">Type:</span>
                        <span className="wow-effect-detail-value">
                          <span className="wow-healing-type">Holy (Healing)</span>
                        </span>
                      </div>
                      <div className="wow-effect-detail">
                        <span className="wow-effect-detail-label">Formula:</span>
                        <span className="wow-effect-detail-value wow-formula">{state.healingConfig.formula || '2d8 + HEA'}</span>
                      </div>
                      {selectedEffect === 'healing_hot' && (
                        <div className="wow-effect-detail">
                          <span className="wow-effect-detail-label">Duration:</span>
                          <span className="wow-effect-detail-value wow-duration">
                            <span className="wow-duration-value">{state.healingConfig.hotDuration || '3'}</span>
                            <span className="wow-duration-unit">{state.healingConfig.hotDurationUnit || 'rounds'}</span>
                          </span>
                        </div>
                      )}
                      {selectedEffect === 'healing_combined' && (
                        <>
                          <div className="wow-effect-detail">
                            <span className="wow-effect-detail-label">HoT Formula:</span>
                            <span className="wow-effect-detail-value wow-formula">{state.healingConfig.hotFormula || '1d6 + HEA/2'}</span>
                          </div>
                          <div className="wow-effect-detail">
                            <span className="wow-effect-detail-label">HoT Duration:</span>
                            <span className="wow-effect-detail-value wow-duration">
                              <span className="wow-duration-value">{state.healingConfig.hotDuration || '3'}</span>
                              <span className="wow-duration-unit">{state.healingConfig.hotDurationUnit || 'rounds'}</span>
                            </span>
                          </div>
                        </>
                      )}
                      {selectedEffect === 'healing_shield' && (
                        <>
                          <div className="wow-effect-detail">
                            <span className="wow-effect-detail-label">Shield Formula:</span>
                            <span className="wow-effect-detail-value wow-formula">{state.healingConfig.shieldFormula || '2d6 + HEA'}</span>
                          </div>
                          <div className="wow-effect-detail">
                            <span className="wow-effect-detail-label">Shield Duration:</span>
                            <span className="wow-effect-detail-value wow-duration">
                              <span className="wow-duration-value">{state.healingConfig.shieldDuration || '3'}</span>
                              <span className="wow-duration-unit">rounds</span>
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  )}

                  {/* Buff effects */}
                  {(selectedEffect === 'buff' || selectedEffect?.startsWith('buff_')) && state.buffConfig && (
                    <>
                      <div className="wow-effect-detail">
                        <span className="wow-effect-detail-label">Duration:</span>
                        <span className="wow-effect-detail-value">{state.buffConfig.duration || '1'} {state.buffConfig.durationUnit || 'minutes'}</span>
                      </div>
                      {selectedEffect === 'buff_stat' && (
                        <>
                          <div className="wow-effect-detail">
                            <span className="wow-effect-detail-label">Stats:</span>
                          </div>
                          {state.buffConfig.statModifiers && state.buffConfig.statModifiers.length > 0 ? (
                            <div className="selected-stats">
                              {state.buffConfig.statModifiers.map(stat => (
                                <StatModifierDisplay key={stat.id} stat={stat} />
                              ))}
                            </div>
                          ) : (
                            <div className="wow-effect-detail">
                              <span className="wow-effect-detail-value">No stats configured</span>
                            </div>
                          )}
                        </>
                      )}
                      {selectedEffect === 'buff_protection' && (
                        <div className="wow-effect-detail">
                          <span className="wow-effect-detail-label">Protection:</span>
                          <span className="wow-effect-detail-value">
                            {state.buffConfig.protectionType || 'Damage Reduction'} ({state.buffConfig.protectionValue || '5'})
                          </span>
                        </div>
                      )}
                    </>
                  )}

                  {/* Debuff effects */}
                  {(selectedEffect === 'debuff' || selectedEffect?.startsWith('debuff_')) && state.debuffConfig && (
                    <>
                      <div className="wow-effect-detail">
                        <span className="wow-effect-detail-label">Duration:</span>
                        <span className="wow-effect-detail-value">{state.debuffConfig.duration || '1'} {state.debuffConfig.durationUnit || 'minutes'}</span>
                      </div>
                      <div className="wow-effect-detail">
                        <span className="wow-effect-detail-label">Save:</span>
                        <span className="wow-effect-detail-value">DC {state.debuffConfig.difficultyClass || '15'} ({state.debuffConfig.savingThrow || 'Constitution'})</span>
                      </div>
                      {selectedEffect === 'debuff_stat' && (
                        <>
                          <div className="wow-effect-detail">
                            <span className="wow-effect-detail-label">Stats:</span>
                          </div>
                          {state.debuffConfig.statPenalties && state.debuffConfig.statPenalties.length > 0 ? (
                            <div className="selected-stats">
                              {state.debuffConfig.statPenalties.map(stat => (
                                <StatModifierDisplay key={stat.id} stat={stat} isDebuff={true} />
                              ))}
                            </div>
                          ) : (
                            <div className="wow-effect-detail">
                              <span className="wow-effect-detail-value">No stats configured</span>
                            </div>
                          )}
                        </>
                      )}
                      {selectedEffect === 'debuff_control' && (
                        <div className="wow-effect-detail">
                          <span className="wow-effect-detail-label">Control:</span>
                          <span className="wow-effect-detail-value">{state.debuffConfig.controlType || 'Slow'}</span>
                        </div>
                      )}
                    </>
                  )}

                  {/* Control effects */}
                  {selectedEffect === 'control' && state.controlConfig && (
                    <>
                      <div className="wow-effect-detail">
                        <span className="wow-effect-detail-label">Duration:</span>
                        <span className="wow-effect-detail-value">{state.controlConfig.duration || '1'} {state.controlConfig.durationUnit || 'rounds'}</span>
                      </div>
                      <div className="wow-effect-detail">
                        <span className="wow-effect-detail-label">Save:</span>
                        <span className="wow-effect-detail-value">DC {state.controlConfig.difficultyClass || '15'} ({state.controlConfig.savingThrow || 'Strength'})</span>
                      </div>
                      <div className="wow-effect-detail">
                        <span className="wow-effect-detail-label">Control Type:</span>
                        <span className="wow-effect-detail-value">{state.controlConfig.controlType || 'Stun'}</span>
                      </div>
                    </>
                  )}

                  {/* Summoning effects */}
                  {selectedEffect === 'summon' && state.summonConfig && (
                    <>
                      {state.summonConfig.creatures && state.summonConfig.creatures.length > 0 ? (
                        <>
                          <div className="wow-effect-detail">
                            <span className="wow-effect-detail-label">Creatures:</span>
                            <div className="wow-effect-detail-value wow-creature-list">
                              {state.summonConfig.creatures.map((creature, index) => (
                                <div key={index} className="wow-creature-item">
                                  <img
                                    src={`https://wow.zamimg.com/images/wow/icons/small/${creature.icon}.jpg`}
                                    alt={creature.name}
                                    className="wow-creature-icon"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = "https://wow.zamimg.com/images/wow/icons/small/inv_misc_questionmark.jpg";
                                    }}
                                  />
                                  <span>{creature.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="wow-effect-detail">
                          <span className="wow-effect-detail-label">Creature:</span>
                          <span className="wow-effect-detail-value">{state.summonConfig.creatureType || 'Elemental'}</span>
                        </div>
                      )}
                      <div className="wow-effect-detail">
                        <span className="wow-effect-detail-label">Duration:</span>
                        <span className="wow-effect-detail-value">{state.summonConfig.duration || '10'} {state.summonConfig.durationUnit || 'minutes'}</span>
                      </div>
                      <div className="wow-effect-detail">
                        <span className="wow-effect-detail-label">Count:</span>
                        <span className="wow-effect-detail-value">{state.summonConfig.quantity || state.summonConfig.count || '1'}</span>
                      </div>
                      <div className="wow-effect-detail">
                        <span className="wow-effect-detail-label">Control:</span>
                        <span className="wow-effect-detail-value">
                          {state.summonConfig.controlType ?
                            state.summonConfig.controlType.charAt(0).toUpperCase() + state.summonConfig.controlType.slice(1) :
                            'Verbal'} Commands
                        </span>
                      </div>
                      {state.summonConfig.waitForTrigger && (
                        <div className="wow-effect-detail wow-trigger-detail">
                          <span className="wow-effect-detail-label">
                            <img
                              src="https://wow.zamimg.com/images/wow/icons/small/ability_hunter_beasttaming.jpg"
                              alt="Trigger"
                              className="wow-element-icon"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://wow.zamimg.com/images/wow/icons/small/inv_misc_questionmark.jpg";
                              }}
                            />Trigger:
                          </span>
                          <span className="wow-effect-detail-value">Waits for trigger condition</span>
                        </div>
                      )}
                    </>
                  )}

                  {/* Utility effects */}
                  {selectedEffect === 'utility' && state.utilityConfig && (
                    <>
                      <div className="wow-effect-detail">
                        <span className="wow-effect-detail-label">Type:</span>
                        <span className="wow-effect-detail-value">{state.utilityConfig.utilityType || 'Movement'}</span>
                      </div>
                      <div className="wow-effect-detail">
                        <span className="wow-effect-detail-label">Duration:</span>
                        <span className="wow-effect-detail-value">{state.utilityConfig.duration || '10'} {state.utilityConfig.durationUnit || 'minutes'}</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Conditional Activation Toggle */}
              <div className="wow-conditional-toggle">
                <label className="wow-conditional-label">Enable Conditional Activation:</label>
                <div className="wow-toggle-wrapper">
                  <button
                    className={`wow-toggle-button ${conditionalEffects[selectedEffect]?.isConditional ? 'active' : ''}`}
                    onClick={() => toggleConditionalEffect(selectedEffect, !conditionalEffects[selectedEffect]?.isConditional)}
                  >
                    <div className="wow-toggle-slider"></div>
                  </button>
                  <span className="wow-toggle-value">
                    {conditionalEffects[selectedEffect]?.isConditional ? 'Enabled' : 'Disabled'}
                  </span>
                </div>
              </div>

              {/* Effect-Specific Triggers */}
              <div className="wow-effect-triggers">
                <h5 className="wow-effect-subtitle">Effect-Specific Triggers</h5>
                <p className="wow-effect-description">
                  Configure triggers that apply specifically to this effect.
                </p>

                {/* Logic Type Selection */}
                <div className="wow-logic-type-selector">
                  <label className="wow-logic-type-label">Trigger Logic:</label>
                  <div className="wow-logic-type-buttons">
                    <button
                      className={`wow-logic-type-button ${effectTriggers[selectedEffect]?.logicType === 'AND' ? 'active' : ''}`}
                      onClick={() => setLogicType('AND')}
                    >
                      AND (All conditions must be met)
                    </button>
                    <button
                      className={`wow-logic-type-button ${effectTriggers[selectedEffect]?.logicType === 'OR' ? 'active' : ''}`}
                      onClick={() => setLogicType('OR')}
                    >
                      OR (Any condition can trigger)
                    </button>
                  </div>
                </div>

                {/* Add Trigger Button */}
                <div className="wow-add-trigger-section">
                  <p className="wow-add-trigger-instruction">
                    Select a trigger category and click on a trigger to add it to this effect.
                  </p>

                  {/* Trigger Categories */}
                  <div className="wow-trigger-categories">
                    {triggerCategories.map(category => (
                      <button
                        key={category.id}
                        className={`wow-trigger-category ${selectedCategory === category.id ? 'active' : ''}`}
                        onClick={() => setSelectedCategory(category.id)}
                        title={category.name}
                      >
                        <div className="wow-trigger-icon-wrapper">
                          <img
                            src={`https://wow.zamimg.com/images/wow/icons/large/${category.iconId}.jpg`}
                            alt={category.name}
                            className="wow-trigger-icon"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg";
                            }}
                          />
                        </div>
                        <span className="wow-trigger-category-name">{category.name}</span>
                      </button>
                    ))}
                  </div>

                  {/* Trigger Options */}
                  <div className="wow-trigger-options">
                    {getTriggersByCategory(selectedCategory).map(trigger => (
                      <div key={trigger.id} className="wow-trigger-option" onClick={() => addTrigger(trigger)}>
                        <div className="wow-trigger-option-icon">
                          <img
                            src={getTriggerIconUrl(trigger.id)}
                            alt={trigger.name}
                            className="wow-trigger-option-img"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg";
                            }}
                          />
                        </div>
                        <div className="wow-trigger-option-content">
                          <div className="wow-trigger-option-title">{trigger.name}</div>
                          <div className="wow-trigger-option-description">{trigger.description}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Selected Triggers - Removed as it's redundant with the "Selected Trigger Conditions" section below */}
                {effectTriggers[selectedEffect]?.compoundTriggers && effectTriggers[selectedEffect].compoundTriggers.length === 0 ? (
                  <div className="wow-no-triggers">
                    <p>No triggers selected for this effect. Add triggers from the categories above.</p>
                  </div>
                ) : null}
              </div>

              {/* Conditional Effect Settings */}
              {conditionalEffects[selectedEffect]?.isConditional && (
                <div className="wow-conditional-settings">
                  <h5 className="wow-effect-subtitle">Conditional Effect Settings</h5>

                  <div className="wow-conditional-default">
                    <label className="wow-conditional-label">Default Behavior:</label>
                    <div className="wow-toggle-wrapper">
                      <button
                        className={`wow-toggle-button ${conditionalEffects[selectedEffect]?.defaultEnabled ? 'active' : ''}`}
                        onClick={() => {
                          const newConditionalEffects = { ...conditionalEffects };
                          newConditionalEffects[selectedEffect] = {
                            ...newConditionalEffects[selectedEffect],
                            defaultEnabled: !newConditionalEffects[selectedEffect]?.defaultEnabled
                          };
                          setConditionalEffects(newConditionalEffects);
                        }}
                      >
                        <div className="wow-toggle-slider"></div>
                      </button>
                      <span className="wow-toggle-value">
                        {conditionalEffects[selectedEffect]?.defaultEnabled ? 'Enabled by default' : 'Disabled by default'}
                      </span>
                    </div>
                  </div>

                  {/* Default Configuration */}
                  <div className="wow-conditional-default-formula">
                    <h6 className="wow-conditional-subtitle">Default Configuration</h6>
                    <p className="wow-conditional-description">
                      This configuration will be used when no specific trigger condition is met.
                    </p>

                    {/* For damage and healing effects, show formula input */}
                    {(selectedEffect === 'damage' || selectedEffect?.startsWith('damage_') ||
                      selectedEffect === 'healing' || selectedEffect?.startsWith('healing_')) && (
                      <div className="wow-conditional-formula-input">
                        <label>Default formula:</label>
                        <input
                          type="text"
                          value={conditionalEffects[selectedEffect]?.conditionalFormulas?.['default'] || ''}
                          onChange={(e) => updateConditionalFormula(selectedEffect, 'default', e.target.value)}
                          placeholder={conditionalEffects[selectedEffect]?.baseFormula || "e.g., 1d6 + INT/2"}
                          className="wow-formula-input"
                        />
                      </div>
                    )}

                    {/* For buff effects, show stat modifiers */}
                    {(selectedEffect === 'buff' || selectedEffect?.startsWith('buff_')) && (
                      <div className="wow-buff-config-container">
                        {/* Default Configuration Section */}
                        <div className="wow-buff-config-section">
                          <h6 className="wow-conditional-subtitle">Default Configuration</h6>
                          <p className="wow-conditional-description">
                            This configuration will be used when no specific trigger condition is met.
                          </p>

                          {/* Display the default stat modifiers (read-only) */}
                          {state.buffConfig && state.buffConfig.statModifiers && state.buffConfig.statModifiers.length > 0 ? (
                            <div className="wow-buff-stat-modifiers">
                              {state.buffConfig.statModifiers.map((stat, statIndex) => (
                                <div key={statIndex} className="wow-buff-stat-modifier">
                                  <div className="wow-buff-stat-info">
                                    <div className="wow-buff-stat-icon">
                                      <img src={getIconUrl(stat.icon)} alt={stat.name} />
                                    </div>
                                    <div className="wow-buff-stat-name">{stat.name}</div>
                                  </div>

                                  <div className="wow-buff-stat-value-display">
                                    <span className="wow-buff-stat-value">
                                      {typeof stat.magnitude === 'string'
                                        ? stat.magnitude
                                        : (stat.magnitude >= 0 ? '+' : '') + stat.magnitude + (stat.magnitudeType === 'percentage' ? '%' : '')}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <div className="wow-buff-no-stats">
                              <p>No stat modifiers configured. Add stats in the Buff Effect step.</p>
                            </div>
                          )}

                          {/* Display the default duration (read-only) */}
                          <div className="wow-buff-duration-display">
                            <span className="wow-buff-duration-label">Duration:</span>
                            <span className="wow-buff-duration-value">
                              {state.buffConfig?.durationType === 'permanent' ? 'Permanent' :
                               `${state.buffConfig?.durationValue || state.buffConfig?.duration || 3} ${
                                 state.buffConfig?.durationType === 'time' ?
                                   (state.buffConfig?.durationUnit || 'minutes') :
                                 state.buffConfig?.durationType === 'rest' ?
                                   (state.buffConfig?.restType === 'short' ? 'Short Rest' : 'Long Rest') :
                                 'rounds'
                               }`}
                            </span>
                          </div>
                        </div>


                      </div>
                    )}

                    {/* For debuff effects, show stat penalties and saving throw */}
                    {(selectedEffect === 'debuff' || selectedEffect?.startsWith('debuff_')) && (
                      <div className="wow-debuff-config-container">
                        <div className="wow-debuff-config-section">
                          <h6 className="wow-conditional-subtitle">Default Configuration</h6>
                          <p className="wow-conditional-description">
                            This configuration will be used when no specific trigger condition is met.
                          </p>

                          {/* Display the default stat penalties (read-only) */}
                          {(selectedEffect === 'debuff_stat' || selectedEffect === 'debuff') && state.debuffConfig && state.debuffConfig.statPenalties && state.debuffConfig.statPenalties.length > 0 ? (
                            <div className="wow-debuff-stat-penalties">
                              {state.debuffConfig.statPenalties.map((stat, statIndex) => (
                                <div key={statIndex} className="wow-debuff-stat-penalty">
                                  <div className="wow-debuff-stat-info">
                                    <div className="wow-debuff-stat-icon">
                                      <img src={getIconUrl(stat.icon)} alt={stat.name} />
                                    </div>
                                    <div className="wow-debuff-stat-name">{stat.name}</div>
                                  </div>

                                  <div className="wow-debuff-stat-value-display">
                                    <span className="wow-debuff-stat-value">
                                      {typeof stat.magnitude === 'string'
                                        ? stat.magnitude
                                        : (stat.magnitude >= 0 ? '+' : '') + stat.magnitude + (stat.magnitudeType === 'percentage' ? '%' : '')}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          ) : (selectedEffect === 'debuff_stat' || selectedEffect === 'debuff') && (
                            <div className="wow-debuff-no-stats">
                              <p>No stat penalties configured. Add stats in the Debuff Effect step.</p>
                            </div>
                          )}

                          {/* Display the default duration and saving throw (read-only) */}
                          <div className="wow-debuff-duration-display">
                            <span className="wow-debuff-duration-label">Duration:</span>
                            <span className="wow-debuff-duration-value">
                              {state.debuffConfig?.durationType === 'permanent' ? 'Permanent' :
                               `${state.debuffConfig?.durationValue || state.debuffConfig?.duration || 3} ${
                                 state.debuffConfig?.durationType === 'time' ?
                                   (state.debuffConfig?.durationUnit || 'minutes') :
                                 state.debuffConfig?.durationType === 'rest' ?
                                   (state.debuffConfig?.restType === 'short' ? 'Short Rest' : 'Long Rest') :
                                 'rounds'
                               }`}
                            </span>
                          </div>

                          <div className="wow-debuff-save-display">
                            <span className="wow-debuff-save-label">Saving Throw:</span>
                            <span className="wow-debuff-save-value">
                              DC {state.debuffConfig?.difficultyClass || 15} ({state.debuffConfig?.savingThrow || 'Constitution'})
                            </span>
                          </div>

                          {/* Display control type for debuff_control */}
                          {selectedEffect === 'debuff_control' && (
                            <div className="wow-debuff-control-display">
                              <span className="wow-debuff-control-label">Control Type:</span>
                              <span className="wow-debuff-control-value">
                                {state.debuffConfig?.controlType || 'Slow'}
                              </span>
                            </div>
                          )}
                        </div>






                      </div>
                    )}


                    {/* Examples section - only show for damage and healing */}
                    {(selectedEffect === 'damage' || selectedEffect === 'healing') && (
                      <div className="wow-conditional-examples mt-md">
                        <h6 className="wow-conditional-subtitle">Examples</h6>
                        <div className="wow-example-cards">
                          {selectedEffect === 'damage' && (
                            <>
                              <div className="wow-example-card" onClick={() => updateConditionalFormula(selectedEffect, 'default', '1d6 + INT')}>
                                <div className="wow-example-title">Standard Damage</div>
                                <div className="wow-example-formula">1d6 + INT</div>
                              </div>
                              <div className="wow-example-card" onClick={() => updateConditionalFormula(selectedEffect, 'default', '2d4 + INT/2')}>
                                <div className="wow-example-title">Reduced Damage</div>
                                <div className="wow-example-formula">2d4 + INT/2</div>
                              </div>
                            </>
                          )}
                          {selectedEffect === 'healing' && (
                            <>
                              <div className="wow-example-card" onClick={() => updateConditionalFormula(selectedEffect, 'default', '2d8 + HEA')}>
                                <div className="wow-example-title">Standard Healing</div>
                                <div className="wow-example-formula">2d8 + HEA</div>
                              </div>
                              <div className="wow-example-card" onClick={() => updateConditionalFormula(selectedEffect, 'default', '1d8 + HEA/2')}>
                                <div className="wow-example-title">Reduced Healing</div>
                                <div className="wow-example-formula">1d8 + HEA/2</div>
                              </div>
                            </>
                          )}
                        </div>
                        <p className="wow-conditional-tip mt-sm">
                          <strong>Tip:</strong> Set different formulas for different triggers to create dynamic effects.
                          For example, a spell might deal 1d6 damage normally, but 2d8 when the target is below 30% health.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Logic Type Selection - Only shown in global mode */}
        {editingMode === 'global' && (
          <div className="effect-config-group mb-md">
            <h4 className="effect-config-label">Trigger Logic</h4>
            <p className="mb-sm">How should multiple triggers be combined?</p>

            <div className="wow-logic-selector">
              <button
                className={`wow-logic-button ${triggerConfig && triggerConfig.logicType === 'AND' ? 'active' : ''}`}
                onClick={() => setLogicType('AND')}
              >
                <div className="wow-logic-icon">
                  <img
                    src="https://wow.zamimg.com/images/wow/icons/large/spell_holy_mindvision.jpg"
                    alt="AND"
                    className="wow-logic-img"
                  />
                </div>
                <div className="wow-logic-text">
                  <div className="wow-logic-title">AND Logic</div>
                  <div className="wow-logic-description">All conditions must be met</div>
                </div>
              </button>
              <button
                className={`wow-logic-button ${triggerConfig && triggerConfig.logicType === 'OR' ? 'active' : ''}`}
                onClick={() => setLogicType('OR')}
              >
                <div className="wow-logic-icon">
                  <img
                    src="https://wow.zamimg.com/images/wow/icons/large/spell_arcane_portaldalaran.jpg"
                    alt="OR"
                    className="wow-logic-img"
                  />
                </div>
                <div className="wow-logic-text">
                  <div className="wow-logic-title">OR Logic</div>
                  <div className="wow-logic-description">Any condition can trigger</div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Trigger Category Selection - Only shown in global mode */}
        {editingMode === 'global' && (
          <div className="effect-config-group mb-md">
            <h4 className="effect-config-label">Add Trigger Conditions</h4>
            <p className="mb-sm">Select a category, then choose triggers to add to your spell.</p>

            <div className="wow-trigger-categories">
              {triggerCategories.map(category => (
                <button
                  key={category.id}
                  className={`wow-trigger-category ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                  title={category.name}
                >
                  <div className="wow-trigger-icon-wrapper">
                    <img
                      src={`https://wow.zamimg.com/images/wow/icons/large/${category.iconId}.jpg`}
                      alt={category.name}
                      className="wow-trigger-icon"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg";
                      }}
                    />
                  </div>
                  <span className="wow-trigger-category-name">{category.name}</span>
                </button>
              ))}
            </div>

            <div className="wow-trigger-options mt-md">
              {getTriggersByCategory(selectedCategory).map(trigger => (
                <div key={trigger.id} className="wow-trigger-option" onClick={() => addTrigger(trigger)}>
                  <div className="wow-trigger-option-icon">
                    <img
                      src={getTriggerIconUrl(trigger.id)}
                      alt={trigger.name}
                      className="wow-trigger-option-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg";
                      }}
                    />
                  </div>
                  <div className="wow-trigger-option-content">
                    <div className="wow-trigger-option-title">{trigger.name}</div>
                    <div className="wow-trigger-option-description">{trigger.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Triggers */}
        <div className="effect-config-group mb-md">
          <h4 className="effect-config-label">
            {editingMode === 'global' ? 'Selected Global Trigger Conditions' : `Selected Trigger Conditions for ${selectedEffect}`}
          </h4>

          {editingMode === 'global' && triggerConfig && triggerConfig.compoundTriggers && triggerConfig.compoundTriggers.length === 0 ? (
            <div className="effect-empty-abilities">
              No trigger conditions selected. Please add triggers from the categories above.
            </div>
          ) : editingMode === 'effect' && (!selectedEffect || !effectTriggers[selectedEffect] || !effectTriggers[selectedEffect].compoundTriggers || effectTriggers[selectedEffect].compoundTriggers.length === 0) ? (
            <div className="effect-empty-abilities">
              No trigger conditions selected for this effect. Please add triggers from the categories above.
            </div>
          ) : (
            <div className="wow-selected-triggers">
              {editingMode === 'global' && triggerConfig && triggerConfig.compoundTriggers ? triggerConfig.compoundTriggers.map((trigger, index) => (
                <div key={index} className="wow-selected-trigger">
                  <div className="wow-selected-trigger-header">
                    <div className="wow-selected-trigger-icon">
                      <img
                        src={getTriggerIconUrl(trigger.id)}
                        alt={trigger.name}
                        className="wow-selected-trigger-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg";
                        }}
                      />
                    </div>
                    <div className="wow-selected-trigger-info">
                      <div className="wow-selected-trigger-name">{trigger.name}</div>
                      <div className="wow-selected-trigger-description">
                        {getTriggersByCategory(trigger.category).find(t => t.id === trigger.id)?.description}
                      </div>
                    </div>
                    <button className="wow-remove-trigger" onClick={() => removeTrigger(index)} title="Remove trigger">
                      <img
                        src="https://wow.zamimg.com/images/wow/icons/large/spell_holy_dispelmagic.jpg"
                        alt="Remove"
                        className="wow-remove-icon"
                      />
                    </button>
                  </div>

                  {/* Parameter controls for this trigger */}
                  {Object.keys(trigger.parameters).length > 0 && (
                    <div className="wow-trigger-parameters">
                      {Object.keys(trigger.parameters).map(paramName => {
                        const paramValue = trigger.parameters[paramName];
                        // Skip empty parameters or 'type' with no options
                        if (paramName === 'type' && (!paramValue || paramValue === '')) {
                          return null;
                        }

                        // Skip threshold_type parameter for resource_threshold as it's handled by our custom component
                        if (trigger.id === 'resource_threshold' && paramName === 'threshold_type') {
                          return null;
                        }

                        return (
                          <div key={paramName} className="wow-trigger-parameter">
                            {/* Hide label for resource threshold slider */}
                            {!(trigger.id === 'resource_threshold' && paramName === 'threshold_value') && (
                              <div className="wow-parameter-label">
                                {paramName === 'threshold_value'
                                  ? `${trigger.parameters.threshold_type === 'percentage' ? 'Percentage' : 'Value'}:`
                                  : paramName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                              </div>
                            )}
                            <div className="wow-parameter-control">
                              {/* Special case for resource threshold */}
                              {trigger.id === 'resource_threshold' && paramName === 'threshold_value' ? (
                                <ResourceThresholdSlider
                                  value={paramValue}
                                  onChange={(value) => updateTriggerParameter(index, paramName, value)}
                                  resourceType={trigger.parameters.resource_type || 'health'}
                                  comparison={trigger.parameters.comparison || 'less_than'}
                                  thresholdType={trigger.parameters.threshold_type || 'percentage'}
                                  onThresholdTypeChange={(type) => updateTriggerParameter(index, 'threshold_type', type)}
                                />
                              ) : typeof paramValue === 'boolean' ? (
                                <div className="wow-toggle-wrapper">
                                  <button
                                    className={`wow-toggle-button ${paramValue ? 'active' : ''}`}
                                    onClick={() => updateTriggerParameter(index, paramName, !paramValue)}
                                  >
                                    <div className="wow-toggle-slider"></div>
                                  </button>
                                  <span className="wow-toggle-value">{paramValue ? 'Yes' : 'No'}</span>
                                </div>
                              ) : typeof paramValue === 'number' ? (
                                <div className="wow-number-input-wrapper">
                                  <input
                                    type="number"
                                    value={paramValue}
                                    onChange={(e) => updateTriggerParameter(index, paramName, parseInt(e.target.value) || 0)}
                                    className="wow-number-input"
                                  />
                                  {paramName === 'percentage' && <span className="wow-input-suffix">%</span>}
                                  {paramName === 'distance' && <span className="wow-input-suffix">ft</span>}
                                  {paramName === 'amount' && <span className="wow-input-suffix">pts</span>}
                                  {paramName === 'health_threshold' && <span className="wow-input-suffix">%</span>}
                                  {paramName === 'threshold_value' && (
                                    <span className="wow-input-suffix">
                                      {trigger.parameters.threshold_type === 'percentage' ? '%' : 'pts'}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <div className="wow-select-wrapper">
                                  <select
                                    value={paramValue}
                                    onChange={(e) => updateTriggerParameter(index, paramName, e.target.value)}
                                    className="wow-select"
                                  >
                                    {paramName === 'comparison' ? (
                                      <>
                                        <option value="less_than">Less than</option>
                                        <option value="greater_than">Greater than</option>
                                        <option value="equal">Equal to</option>
                                      </>
                                    ) : paramName === 'resource_type' ? (
                                      <>
                                        {RESOURCE_TYPES.map(resource => (
                                          <option key={resource.id} value={resource.id}>{resource.name}</option>
                                        ))}
                                      </>
                                    ) : paramName === 'threshold_type' ? (
                                      <>
                                        <option value="percentage">Percentage</option>
                                        <option value="flat">Flat Value</option>
                                      </>
                                    ) : paramName === 'effect_type' ? (
                                      <>
                                        <option value="buff">Buff</option>
                                        <option value="debuff">Debuff</option>
                                        <option value="dot">DoT</option>
                                        <option value="hot">HoT (Healing over Time)</option>
                                        <option value="shield">Absorption Shield</option>
                                      </>
                                    ) : paramName === 'entity_type' || paramName === 'target_type' ? (
                                      <>
                                        <option value="self">Self</option>
                                        <option value="ally">Ally</option>
                                        <option value="enemy">Enemy</option>
                                        <option value="any">Any</option>
                                      </>
                                    ) : paramName === 'perspective' ? (
                                      <>
                                        <option value="self">Self (When I...)</option>
                                        <option value="target">Target (When my target...)</option>
                                        <option value="ally">Ally (When an ally...)</option>
                                        <option value="enemy">Enemy (When an enemy...)</option>
                                        <option value="any">Any (When anyone...)</option>
                                      </>
                                    ) : paramName === 'damage_type' ? (
                                      <>
                                        <option value="any">Any Damage</option>
                                        <option value="physical">Physical</option>
                                        <option value="magical">Magical</option>
                                        <option value="fire">Fire</option>
                                        <option value="cold">Cold</option>
                                        <option value="lightning">Lightning</option>
                                        <option value="poison">Poison</option>
                                        <option value="acid">Acid</option>
                                        <option value="necrotic">Necrotic</option>
                                        <option value="radiant">Radiant</option>
                                        <option value="force">Force</option>
                                        <option value="psychic">Psychic</option>
                                        <option value="thunder">Thunder</option>
                                      </>
                                    ) : paramName === 'creature_type' ? (
                                      <>
                                        <option value="any">Any Creature</option>
                                        <option value="enemy">Enemies Only</option>
                                        <option value="ally">Allies Only</option>
                                        <option value="player">Players Only</option>
                                        <option value="npc">NPCs Only</option>
                                      </>
                                    ) : paramName === 'type' ? (
                                      <>
                                        <option value="any">Any Type</option>
                                        <option value="physical">Physical</option>
                                        <option value="magical">Magical</option>
                                        <option value="fire">Fire</option>
                                        <option value="cold">Cold</option>
                                        <option value="lightning">Lightning</option>
                                        <option value="poison">Poison</option>
                                        <option value="acid">Acid</option>
                                        <option value="necrotic">Necrotic</option>
                                        <option value="radiant">Radiant</option>
                                        <option value="force">Force</option>
                                        <option value="psychic">Psychic</option>
                                        <option value="thunder">Thunder</option>
                                      </>
                                    ) : paramName === 'area_type' ? (
                                      <>
                                        <option value="combat">Combat Area</option>
                                        <option value="safe">Safe Zone</option>
                                        <option value="hazard">Hazardous Area</option>
                                        <option value="marked">Marked Area</option>
                                        <option value="custom">Custom Area</option>
                                      </>
                                    ) : paramName === 'weather_type' ? (
                                      <>
                                        <option value="rain">Rain</option>
                                        <option value="snow">Snow</option>
                                        <option value="fog">Fog</option>
                                        <option value="storm">Storm</option>
                                        <option value="clear">Clear</option>
                                      </>
                                    ) : paramName === 'terrain_type' ? (
                                      <>
                                        <option value="forest">Forest</option>
                                        <option value="mountain">Mountain</option>
                                        <option value="desert">Desert</option>
                                        <option value="water">Water</option>
                                        <option value="urban">Urban</option>
                                        <option value="underground">Underground</option>
                                      </>
                                    ) : paramName === 'interaction_type' ? (
                                      <>
                                        <option value="touch">Touch</option>
                                        <option value="examine">Examine</option>
                                        <option value="manipulate">Manipulate</option>
                                        <option value="attack">Attack</option>
                                      </>
                                    ) : paramName === 'whose_turn' ? (
                                      <>
                                        <option value="self">Self</option>
                                        <option value="ally">Ally</option>
                                        <option value="enemy">Enemy</option>
                                        <option value="any">Any</option>
                                      </>
                                    ) : paramName === 'magic_type' ? (
                                      <>
                                        <option value="arcane">Arcane</option>
                                        <option value="divine">Divine</option>
                                        <option value="nature">Nature</option>
                                        <option value="any">Any</option>
                                      </>
                                    ) : (
                                      <option value="">Select a value</option>
                                    )}
                                  </select>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )) : editingMode === 'effect' && selectedEffect && effectTriggers[selectedEffect] && effectTriggers[selectedEffect].compoundTriggers ? effectTriggers[selectedEffect].compoundTriggers.map((trigger, index) => (
                <div key={index} className="wow-selected-trigger">
                  <div className="wow-selected-trigger-header">
                    <div className="wow-selected-trigger-icon">
                      <img
                        src={getTriggerIconUrl(trigger.id)}
                        alt={trigger.name}
                        className="wow-selected-trigger-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg";
                        }}
                      />
                    </div>
                    <div className="wow-selected-trigger-info">
                      <div className="wow-selected-trigger-name">{trigger.name}</div>
                      <div className="wow-selected-trigger-description">
                        {getTriggersByCategory(trigger.category).find(t => t.id === trigger.id)?.description}
                      </div>
                    </div>
                    <button className="wow-remove-trigger" onClick={() => removeTrigger(index)} title="Remove trigger">
                      <img
                        src="https://wow.zamimg.com/images/wow/icons/large/spell_holy_dispelmagic.jpg"
                        alt="Remove"
                        className="wow-remove-icon"
                      />
                    </button>
                  </div>

                  {/* Parameter controls for this trigger */}
                  {Object.keys(trigger.parameters).length > 0 && (
                    <div className="wow-trigger-parameters">
                      {Object.keys(trigger.parameters).map(paramName => {
                        const paramValue = trigger.parameters[paramName];
                        // Skip empty parameters or 'type' with no options
                        if (paramName === 'type' && (!paramValue || paramValue === '')) {
                          return null;
                        }

                        // Skip threshold_type parameter for resource_threshold as it's handled by our custom component
                        if (trigger.id === 'resource_threshold' && paramName === 'threshold_type') {
                          return null;
                        }

                        return (
                          <div key={paramName} className="wow-trigger-parameter">
                            {/* Hide label for resource threshold slider */}
                            {!(trigger.id === 'resource_threshold' && paramName === 'threshold_value') && (
                              <div className="wow-parameter-label">
                                {paramName === 'threshold_value'
                                  ? `${trigger.parameters.threshold_type === 'percentage' ? 'Percentage' : 'Value'}:`
                                  : paramName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                              </div>
                            )}
                            <div className="wow-parameter-control">
                              {/* Special case for resource threshold */}
                              {trigger.id === 'resource_threshold' && paramName === 'threshold_value' ? (
                                <ResourceThresholdSlider
                                  value={paramValue}
                                  onChange={(value) => updateTriggerParameter(index, paramName, value)}
                                  resourceType={trigger.parameters.resource_type || 'health'}
                                  comparison={trigger.parameters.comparison || 'less_than'}
                                  thresholdType={trigger.parameters.threshold_type || 'percentage'}
                                  onThresholdTypeChange={(type) => updateTriggerParameter(index, 'threshold_type', type)}
                                />
                              ) : typeof paramValue === 'boolean' ? (
                                <div className="wow-toggle-wrapper">
                                  <button
                                    className={`wow-toggle-button ${paramValue ? 'active' : ''}`}
                                    onClick={() => updateTriggerParameter(index, paramName, !paramValue)}
                                  >
                                    <div className="wow-toggle-slider"></div>
                                  </button>
                                  <span className="wow-toggle-value">{paramValue ? 'Yes' : 'No'}</span>
                                </div>
                              ) : typeof paramValue === 'number' ? (
                                <div className="wow-number-input-wrapper">
                                  <input
                                    type="number"
                                    value={paramValue}
                                    onChange={(e) => updateTriggerParameter(index, paramName, parseInt(e.target.value) || 0)}
                                    className="wow-number-input"
                                  />
                                  {paramName === 'percentage' && <span className="wow-input-suffix">%</span>}
                                  {paramName === 'distance' && <span className="wow-input-suffix">ft</span>}
                                  {paramName === 'amount' && <span className="wow-input-suffix">pts</span>}
                                  {paramName === 'health_threshold' && <span className="wow-input-suffix">%</span>}
                                  {paramName === 'threshold_value' && (
                                    <span className="wow-input-suffix">
                                      {trigger.parameters.threshold_type === 'percentage' ? '%' : 'pts'}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <div className="wow-select-wrapper">
                                  <select
                                    value={paramValue}
                                    onChange={(e) => updateTriggerParameter(index, paramName, e.target.value)}
                                    className="wow-select"
                                  >
                                    {paramName === 'comparison' ? (
                                      <>
                                        <option value="less_than">Less than</option>
                                        <option value="greater_than">Greater than</option>
                                        <option value="equal">Equal to</option>
                                      </>
                                    ) : paramName === 'resource_type' ? (
                                      <>
                                        {RESOURCE_TYPES.map(resource => (
                                          <option key={resource.id} value={resource.id}>{resource.name}</option>
                                        ))}
                                      </>
                                    ) : paramName === 'threshold_type' ? (
                                      <>
                                        <option value="percentage">Percentage</option>
                                        <option value="flat">Flat Value</option>
                                      </>
                                    ) : paramName === 'effect_type' ? (
                                      <>
                                        <option value="buff">Buff</option>
                                        <option value="debuff">Debuff</option>
                                        <option value="dot">DoT</option>
                                        <option value="hot">HoT (Healing over Time)</option>
                                        <option value="shield">Absorption Shield</option>
                                      </>
                                    ) : paramName === 'entity_type' || paramName === 'target_type' ? (
                                      <>
                                        <option value="self">Self</option>
                                        <option value="ally">Ally</option>
                                        <option value="enemy">Enemy</option>
                                        <option value="any">Any</option>
                                      </>
                                    ) : paramName === 'perspective' ? (
                                      <>
                                        <option value="self">Self (When I...)</option>
                                        <option value="target">Target (When my target...)</option>
                                        <option value="ally">Ally (When an ally...)</option>
                                        <option value="enemy">Enemy (When an enemy...)</option>
                                        <option value="any">Any (When anyone...)</option>
                                      </>
                                    ) : paramName === 'damage_type' ? (
                                      <>
                                        <option value="any">Any Damage</option>
                                        <option value="physical">Physical</option>
                                        <option value="magical">Magical</option>
                                        <option value="fire">Fire</option>
                                        <option value="cold">Cold</option>
                                        <option value="lightning">Lightning</option>
                                        <option value="poison">Poison</option>
                                        <option value="acid">Acid</option>
                                        <option value="necrotic">Necrotic</option>
                                        <option value="radiant">Radiant</option>
                                        <option value="force">Force</option>
                                        <option value="psychic">Psychic</option>
                                        <option value="thunder">Thunder</option>
                                      </>
                                    ) : paramName === 'creature_type' ? (
                                      <>
                                        <option value="any">Any Creature</option>
                                        <option value="enemy">Enemies Only</option>
                                        <option value="ally">Allies Only</option>
                                        <option value="player">Players Only</option>
                                        <option value="npc">NPCs Only</option>
                                      </>
                                    ) : paramName === 'type' ? (
                                      <>
                                        <option value="any">Any Type</option>
                                        <option value="physical">Physical</option>
                                        <option value="magical">Magical</option>
                                        <option value="fire">Fire</option>
                                        <option value="cold">Cold</option>
                                        <option value="lightning">Lightning</option>
                                        <option value="poison">Poison</option>
                                        <option value="acid">Acid</option>
                                        <option value="necrotic">Necrotic</option>
                                        <option value="radiant">Radiant</option>
                                        <option value="force">Force</option>
                                        <option value="psychic">Psychic</option>
                                        <option value="thunder">Thunder</option>
                                      </>
                                    ) : paramName === 'area_type' ? (
                                      <>
                                        <option value="combat">Combat Area</option>
                                        <option value="safe">Safe Zone</option>
                                        <option value="hazard">Hazardous Area</option>
                                        <option value="marked">Marked Area</option>
                                        <option value="custom">Custom Area</option>
                                      </>
                                    ) : paramName === 'weather_type' ? (
                                      <>
                                        <option value="rain">Rain</option>
                                        <option value="snow">Snow</option>
                                        <option value="fog">Fog</option>
                                        <option value="storm">Storm</option>
                                        <option value="clear">Clear</option>
                                      </>
                                    ) : paramName === 'terrain_type' ? (
                                      <>
                                        <option value="forest">Forest</option>
                                        <option value="mountain">Mountain</option>
                                        <option value="desert">Desert</option>
                                        <option value="water">Water</option>
                                        <option value="urban">Urban</option>
                                        <option value="underground">Underground</option>
                                      </>
                                    ) : paramName === 'interaction_type' ? (
                                      <>
                                        <option value="touch">Touch</option>
                                        <option value="examine">Examine</option>
                                        <option value="manipulate">Manipulate</option>
                                        <option value="attack">Attack</option>
                                      </>
                                    ) : paramName === 'whose_turn' ? (
                                      <>
                                        <option value="self">Self</option>
                                        <option value="ally">Ally</option>
                                        <option value="enemy">Enemy</option>
                                        <option value="any">Any</option>
                                      </>
                                    ) : paramName === 'magic_type' ? (
                                      <>
                                        <option value="arcane">Arcane</option>
                                        <option value="divine">Divine</option>
                                        <option value="nature">Nature</option>
                                        <option value="any">Any</option>
                                      </>
                                    ) : (
                                      <option value="">Select a value</option>
                                    )}
                                  </select>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Conditional Formula for this Trigger */}
                  {conditionalEffects[selectedEffect]?.isConditional && (
                    <div className="wow-conditional-formula-section">
                      <div className="wow-conditional-formula-header">
                        <h6 className="wow-conditional-formula-title">Conditional Effect Configuration</h6>
                        <p className="wow-conditional-formula-description">
                          Configure how this effect behaves when this specific trigger activates it.
                        </p>
                      </div>

                      {/* Different configuration UI based on effect type */}
                      {(selectedEffect === 'damage' || selectedEffect?.startsWith('damage_')) && (
                        <div className="wow-conditional-formula-input">
                          <label>Damage Formula:</label>
                          <input
                            type="text"
                            value={conditionalEffects[selectedEffect]?.conditionalFormulas?.[trigger.id] || ''}
                            onChange={(e) => updateConditionalFormula(selectedEffect, trigger.id, e.target.value)}
                            placeholder={conditionalEffects[selectedEffect]?.baseFormula || "e.g., 2d6 + INT"}
                            className="wow-formula-input"
                          />
                          {/* Display the standard formula for reference */}
                          {conditionalEffects[selectedEffect]?.baseFormula && (
                            <div className="wow-standard-formula-reference">
                              <span className="wow-standard-formula-label">Standard Formula:</span>
                              <span className="wow-standard-formula-value">{conditionalEffects[selectedEffect]?.baseFormula}</span>
                            </div>
                          )}

                          {/* Duration input for damage_dot */}
                          {selectedEffect === 'damage_dot' && (
                            <div className="wow-conditional-duration-input">
                              <label>Duration:</label>
                              <div className="wow-duration-input-group">
                                <input
                                  type="number"
                                  value={
                                    conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.dotDuration ||
                                    conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.duration ||
                                    state.damageConfig?.dotDuration ||
                                    3
                                  }
                                  onChange={(e) => {
                                    // Update the conditional duration
                                    const newConditionalEffects = { ...conditionalEffects };
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                      newConditionalEffects[selectedEffect].conditionalSettings = {};
                                    }
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                      newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                    }

                                    // For damage_dot, store as both duration and dotDuration for compatibility
                                    const durationValue = parseInt(e.target.value) || 3;
                                    if (selectedEffect === 'damage_dot') {
                                      newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].dotDuration = durationValue;
                                      // Also set elementType and damageType if not already set
                                      if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].elementType) {
                                        newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].elementType =
                                          state.damageConfig?.elementType || 'Fire';
                                      }
                                      if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].damageType) {
                                        newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].damageType = 'dot';
                                      }
                                    }

                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].duration = durationValue;
                                    setConditionalEffects(newConditionalEffects);
                                  }}
                                  min="1"
                                  max="100"
                                  className="wow-duration-value"
                                />

                                <select
                                  value={
                                    conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.durationUnit ||
                                    state.damageConfig?.dotDurationUnit ||
                                    'rounds'
                                  }
                                  onChange={(e) => {
                                    // Update the conditional duration unit
                                    const newConditionalEffects = { ...conditionalEffects };
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                      newConditionalEffects[selectedEffect].conditionalSettings = {};
                                    }
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                      newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                    }

                                    const unitValue = e.target.value;

                                    // For damage_dot, store as both durationUnit and dotDurationUnit for compatibility
                                    if (selectedEffect === 'damage_dot') {
                                      newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].dotDurationUnit = unitValue;
                                    }

                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].durationUnit = unitValue;
                                    setConditionalEffects(newConditionalEffects);
                                  }}
                                  className="wow-duration-unit"
                                >
                                  <option value="rounds">Rounds</option>
                                  <option value="seconds">Seconds</option>
                                  <option value="minutes">Minutes</option>
                                  <option value="hours">Hours</option>
                                  <option value="days">Days</option>
                                </select>
                              </div>
                            </div>
                          )}

                          {/* Quick Formula Suggestions for Damage */}
                          <div className="wow-formula-suggestions">
                            <div className="wow-formula-suggestion-buttons">
                              <button
                                className="wow-formula-suggestion"
                                onClick={() => updateConditionalFormula(selectedEffect, trigger.id, '2d8 + INT')}
                                title="Higher damage for this trigger"
                              >
                                Increased (2d8 + INT)
                              </button>
                              <button
                                className="wow-formula-suggestion"
                                onClick={() => updateConditionalFormula(selectedEffect, trigger.id, '1d4 + INT/2')}
                                title="Lower damage for this trigger"
                              >
                                Reduced (1d4 + INT/2)
                              </button>
                              <button
                                className="wow-formula-suggestion"
                                onClick={() => updateConditionalFormula(selectedEffect, trigger.id, '3d6 + INT*2')}
                                title="Critical damage for this trigger"
                              >
                                Critical (3d6 + INT*2)
                              </button>
                            </div>
                          </div>

                          <div className="wow-conditional-formula-example">
                            <p className="wow-conditional-formula-tip">
                              <strong>Example:</strong> {
                                trigger.id === 'dodge' ?
                                  "When the target dodges, deal 1d4 damage instead of the normal 2d8." :
                                trigger.id === 'critical_hit' ?
                                  "On a critical hit, deal 3d6 + INT*2 damage instead of the normal amount." :
                                trigger.id === 'health_threshold' ?
                                  "When target is below the health threshold, deal 3d8 + INT damage." :
                                selectedEffect === 'damage_dot' ?
                                  "Configure both the damage formula and duration for this damage over time effect." :
                                "Set a different damage formula for when this specific trigger activates the effect."
                              }
                            </p>
                          </div>
                        </div>
                      )}

                      {(selectedEffect === 'healing' || selectedEffect?.startsWith('healing_')) && (
                        <div className="wow-conditional-formula-input">
                          <label>Healing Formula:</label>
                          <input
                            type="text"
                            value={conditionalEffects[selectedEffect]?.conditionalFormulas?.[trigger.id] || ''}
                            onChange={(e) => updateConditionalFormula(selectedEffect, trigger.id, e.target.value)}
                            placeholder={conditionalEffects[selectedEffect]?.baseFormula || "e.g., 2d8 + HEA"}
                            className="wow-formula-input"
                          />
                          {/* Display the standard formula for reference */}
                          {conditionalEffects[selectedEffect]?.baseFormula && (
                            <div className="wow-standard-formula-reference">
                              <span className="wow-standard-formula-label">Standard Formula:</span>
                              <span className="wow-standard-formula-value">{conditionalEffects[selectedEffect]?.baseFormula}</span>
                            </div>
                          )}

                          {/* Duration input for healing_hot */}
                          {selectedEffect === 'healing_hot' && (
                            <div className="wow-conditional-duration-input">
                              <label>Duration:</label>
                              <div className="wow-duration-input-group">
                                <input
                                  type="number"
                                  value={
                                    conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.duration ||
                                    state.healingConfig?.hotDuration ||
                                    3
                                  }
                                  onChange={(e) => {
                                    // Update the conditional duration
                                    const newConditionalEffects = { ...conditionalEffects };
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                      newConditionalEffects[selectedEffect].conditionalSettings = {};
                                    }
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                      newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                    }

                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].duration = parseInt(e.target.value) || 3;
                                    setConditionalEffects(newConditionalEffects);
                                  }}
                                  min="1"
                                  max="100"
                                  className="wow-duration-value"
                                />

                                <select
                                  value={
                                    conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.durationUnit ||
                                    state.healingConfig?.hotDurationUnit ||
                                    'rounds'
                                  }
                                  onChange={(e) => {
                                    // Update the conditional duration unit
                                    const newConditionalEffects = { ...conditionalEffects };
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                      newConditionalEffects[selectedEffect].conditionalSettings = {};
                                    }
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                      newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                    }

                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].durationUnit = e.target.value;
                                    setConditionalEffects(newConditionalEffects);
                                  }}
                                  className="wow-duration-unit"
                                >
                                  <option value="rounds">Rounds</option>
                                  <option value="seconds">Seconds</option>
                                  <option value="minutes">Minutes</option>
                                  <option value="hours">Hours</option>
                                  <option value="days">Days</option>
                                </select>
                              </div>
                            </div>
                          )}

                          {/* Quick Formula Suggestions for Healing */}
                          <div className="wow-formula-suggestions">
                            <div className="wow-formula-suggestion-buttons">
                              <button
                                className="wow-formula-suggestion"
                                onClick={() => updateConditionalFormula(selectedEffect, trigger.id, '3d8 + HEA')}
                                title="Higher healing for this trigger"
                              >
                                Increased (3d8 + HEA)
                              </button>
                              <button
                                className="wow-formula-suggestion"
                                onClick={() => updateConditionalFormula(selectedEffect, trigger.id, '1d6 + HEA/2')}
                                title="Lower healing for this trigger"
                              >
                                Reduced (1d6 + HEA/2)
                              </button>
                              <button
                                className="wow-formula-suggestion"
                                onClick={() => updateConditionalFormula(selectedEffect, trigger.id, '4d8 + HEA*1.5')}
                                title="Critical healing for this trigger"
                              >
                                Critical (4d8 + HEA*1.5)
                              </button>
                            </div>
                          </div>

                          <div className="wow-conditional-formula-example">
                            <p className="wow-conditional-formula-tip">
                              <strong>Example:</strong> {
                                trigger.id === 'health_threshold' ?
                                  "When target is below the health threshold, healing is increased to 3d8 + HEA." :
                                trigger.id === 'overhealing' ?
                                  "When target would be overhealed, create a shield instead." :
                                selectedEffect === 'healing_hot' ?
                                  "Configure both the healing formula and duration for this healing over time effect." :
                                "Set a different healing formula for when this specific trigger activates the effect."
                              }
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Buff Configuration UI */}
                      {(selectedEffect === 'buff' || selectedEffect?.startsWith('buff_')) && (
                        <div className="wow-buff-config-container">
                          {/* Stat Modifiers Section */}
                          <div className="wow-buff-config-section">
                            <h6 className="wow-buff-section-title">Stat Modifiers</h6>

                            {state.buffConfig && state.buffConfig.statModifiers && state.buffConfig.statModifiers.length > 0 ? (
                              <div className="wow-buff-stat-modifiers">
                                {state.buffConfig.statModifiers.map((stat, statIndex) => {
                                  // Get conditional value for this stat if it exists
                                  const conditionalSettings = conditionalEffects[selectedEffect]?.conditionalSettings || {};
                                  const triggerSettings = conditionalSettings[trigger.id] || {};
                                  const statSettings = triggerSettings.statModifiers || [];
                                  const conditionalStat = statSettings.find(s => s.id === stat.id) || {};

                                  // Check if this stat is enabled in the conditional effect
                                  const isEnabled = !!conditionalStat.id;

                                  return (
                                    <div key={statIndex} className={`wow-buff-stat-modifier ${isEnabled ? '' : 'disabled'}`}>
                                      <div className="wow-buff-stat-info">
                                        <div className="wow-buff-stat-checkbox">
                                          <input
                                            type="checkbox"
                                            checked={isEnabled}
                                            onChange={(e) => {
                                              // Toggle this stat in the conditional settings
                                              const newConditionalEffects = { ...conditionalEffects };
                                              if (!newConditionalEffects[selectedEffect]) {
                                                newConditionalEffects[selectedEffect] = { isConditional: true, conditionalFormulas: {}, conditionalSettings: {} };
                                              }
                                              if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                                newConditionalEffects[selectedEffect].conditionalSettings = {};
                                              }
                                              if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                                newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = { statModifiers: [] };
                                              }

                                              let statModifiers = [...(newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].statModifiers || [])];

                                              if (e.target.checked) {
                                                // Add the stat if it doesn't exist
                                                if (!statModifiers.find(s => s.id === stat.id)) {
                                                  statModifiers.push({
                                                    ...stat,
                                                    magnitude: stat.magnitude,
                                                    magnitudeType: stat.magnitudeType
                                                  });
                                                }
                                              } else {
                                                // Remove the stat if it exists
                                                const index = statModifiers.findIndex(s => s.id === stat.id);
                                                if (index >= 0) {
                                                  statModifiers.splice(index, 1);
                                                }
                                              }

                                              newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].statModifiers = statModifiers;
                                              setConditionalEffects(newConditionalEffects);
                                            }}
                                          />
                                        </div>
                                        <div className="wow-buff-stat-icon">
                                          <img src={getIconUrl(stat.icon)} alt={stat.name} />
                                        </div>
                                        <div className="wow-buff-stat-name">{stat.name}</div>
                                      </div>

                                      {isEnabled && (
                                        <div className="wow-buff-stat-value-container">
                                          <input
                                            type="text"
                                            className="wow-buff-stat-value-input"
                                            value={conditionalStat.magnitude !== undefined ? conditionalStat.magnitude : (stat.magnitude || '')}
                                            onChange={(e) => {
                                              // Update the conditional stat value
                                              const newConditionalEffects = { ...conditionalEffects };
                                              if (!newConditionalEffects[selectedEffect]) {
                                                newConditionalEffects[selectedEffect] = { isConditional: true, conditionalFormulas: {}, conditionalSettings: {} };
                                              }
                                              if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                                newConditionalEffects[selectedEffect].conditionalSettings = {};
                                              }
                                              if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                                newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = { statModifiers: [] };
                                              }

                                              // Find or create the stat modifier
                                              let statModifiers = [...(newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].statModifiers || [])];
                                              const existingStatIndex = statModifiers.findIndex(s => s.id === stat.id);

                                              if (existingStatIndex >= 0) {
                                                // Create a new object to avoid reference issues
                                                statModifiers[existingStatIndex] = {
                                                  ...statModifiers[existingStatIndex],
                                                  magnitude: e.target.value
                                                };
                                              } else {
                                                // Create a completely new object
                                                statModifiers.push({
                                                  id: stat.id,
                                                  name: stat.name,
                                                  icon: stat.icon,
                                                  description: stat.description,
                                                  magnitude: e.target.value,
                                                  magnitudeType: stat.magnitudeType
                                                });
                                              }

                                              newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].statModifiers = statModifiers;
                                              setConditionalEffects(newConditionalEffects);

                                              // Also update the formula for backward compatibility
                                              updateConditionalFormula(selectedEffect, trigger.id, e.target.value);
                                            }}
                                            placeholder={stat.magnitude || ''}
                                          />

                                          <select
                                            className="wow-buff-stat-type-select"
                                            value={conditionalStat.magnitudeType || stat.magnitudeType || 'flat'}
                                            onChange={(e) => {
                                              // Update the conditional stat type
                                              const newConditionalEffects = { ...conditionalEffects };
                                              if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                                newConditionalEffects[selectedEffect].conditionalSettings = {};
                                              }
                                              if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                                newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = { statModifiers: [] };
                                              }

                                              // Find or create the stat modifier
                                              let statModifiers = [...(newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].statModifiers || [])];
                                              const existingStatIndex = statModifiers.findIndex(s => s.id === stat.id);

                                              if (existingStatIndex >= 0) {
                                                // Create a new object to avoid reference issues
                                                statModifiers[existingStatIndex] = {
                                                  ...statModifiers[existingStatIndex],
                                                  magnitudeType: e.target.value
                                                };
                                              } else {
                                                // Create a completely new object
                                                statModifiers.push({
                                                  id: stat.id,
                                                  name: stat.name,
                                                  icon: stat.icon,
                                                  description: stat.description,
                                                  magnitude: stat.magnitude,
                                                  magnitudeType: e.target.value
                                                });
                                              }

                                              newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].statModifiers = statModifiers;
                                              setConditionalEffects(newConditionalEffects);
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
                              <div className="wow-buff-no-stats">
                                <p>No stat modifiers configured. Add stats in the Buff Effect step.</p>
                              </div>
                            )}
                          </div>

                          {/* Duration Section */}
                          <div className="wow-buff-config-section">
                            <h6 className="wow-buff-section-title">Duration</h6>
                            <div className="wow-buff-duration-container">
                              <div className="wow-buff-duration-input">
                                <input
                                  type="number"
                                  className="wow-buff-duration-value"
                                  value={
                                    conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.duration ||
                                    state.buffConfig?.durationValue ||
                                    state.buffConfig?.duration ||
                                    3
                                  }
                                  onChange={(e) => {
                                    // Update the conditional duration
                                    const newConditionalEffects = { ...conditionalEffects };
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                      newConditionalEffects[selectedEffect].conditionalSettings = {};
                                    }
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                      newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                    }

                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].duration = parseInt(e.target.value) || 3;
                                    setConditionalEffects(newConditionalEffects);
                                  }}
                                  min="1"
                                  max="100"
                                />

                                <select
                                  className="wow-buff-duration-unit"
                                  value={
                                    conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.durationUnit ||
                                    (state.buffConfig?.durationType === 'time' ?
                                      (state.buffConfig?.durationUnit || 'minutes') :
                                     state.buffConfig?.durationType === 'rest' ?
                                      (state.buffConfig?.restType || 'short') :
                                     state.buffConfig?.durationType === 'permanent' ?
                                      'permanent' :
                                      'rounds')
                                  }
                                  onChange={(e) => {
                                    // Update the conditional duration unit
                                    const newConditionalEffects = { ...conditionalEffects };
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                      newConditionalEffects[selectedEffect].conditionalSettings = {};
                                    }
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                      newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                    }

                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].durationUnit = e.target.value;
                                    setConditionalEffects(newConditionalEffects);
                                  }}
                                >
                                  <option value="rounds">Rounds</option>
                                  <option value="seconds">Seconds</option>
                                  <option value="minutes">Minutes</option>
                                  <option value="hours">Hours</option>
                                  <option value="days">Days</option>
                                  <option value="short">Short Rest</option>
                                  <option value="long">Long Rest</option>
                                  <option value="permanent">Permanent</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Quick Suggestions for Buff Effects */}
                          <div className="wow-formula-suggestions">
                            <h6 className="wow-buff-section-title">Quick Suggestions</h6>
                            <div className="wow-formula-suggestion-buttons">
                              <button
                                className="wow-formula-suggestion"
                                onClick={() => {
                                  // Apply increased values to all stats
                                  const newConditionalEffects = { ...conditionalEffects };
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                    newConditionalEffects[selectedEffect].conditionalSettings = {};
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = { statModifiers: [] };
                                  }

                                  // Create increased stat modifiers with a deep copy
                                  const statModifiers = state.buffConfig?.statModifiers?.map(stat => ({
                                    // Create a completely new object to avoid reference issues
                                    id: stat.id,
                                    name: stat.name,
                                    icon: stat.icon,
                                    description: stat.description,
                                    // Double the magnitude for the enhanced effect
                                    magnitude: typeof stat.magnitude === 'number' ? stat.magnitude * 2 : 4,
                                    magnitudeType: 'flat'
                                  })) || [];

                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].statModifiers = statModifiers;
                                  setConditionalEffects(newConditionalEffects);

                                  // Also update the formula for backward compatibility
                                  updateConditionalFormula(selectedEffect, trigger.id, '+4');
                                }}
                                title="Double the stat bonuses for this trigger"
                              >
                                Double Bonuses
                              </button>
                              <button
                                className="wow-formula-suggestion"
                                onClick={() => {
                                  // Apply percentage values to all stats
                                  const newConditionalEffects = { ...conditionalEffects };
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                    newConditionalEffects[selectedEffect].conditionalSettings = {};
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = { statModifiers: [] };
                                  }

                                  // Create percentage stat modifiers
                                  const statModifiers = state.buffConfig?.statModifiers?.map(stat => ({
                                    ...stat,
                                    magnitude: 10,
                                    magnitudeType: 'percentage'
                                  })) || [];

                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].statModifiers = statModifiers;
                                  setConditionalEffects(newConditionalEffects);

                                  // Also update the formula for backward compatibility
                                  updateConditionalFormula(selectedEffect, trigger.id, '+10%');
                                }}
                                title="Convert all bonuses to percentage values"
                              >
                                Percentage Bonuses
                              </button>
                              <button
                                className="wow-formula-suggestion"
                                onClick={() => {
                                  // Apply variable values to all stats
                                  const newConditionalEffects = { ...conditionalEffects };
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                    newConditionalEffects[selectedEffect].conditionalSettings = {};
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = { statModifiers: [] };
                                  }

                                  // Create variable stat modifiers
                                  const statModifiers = state.buffConfig?.statModifiers?.map(stat => ({
                                    ...stat,
                                    magnitude: '2d4',
                                    magnitudeType: 'flat'
                                  })) || [];

                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].statModifiers = statModifiers;
                                  setConditionalEffects(newConditionalEffects);

                                  // Also update the formula for backward compatibility
                                  updateConditionalFormula(selectedEffect, trigger.id, '2d4');
                                }}
                                title="Use variable dice rolls for bonuses"
                              >
                                Variable Bonuses
                              </button>
                            </div>
                          </div>

                          <div className="wow-conditional-formula-example">
                            <p className="wow-conditional-formula-tip">
                              <strong>Example:</strong> {
                                trigger.id === 'combat_start' ?
                                  "When combat starts, provide stronger stat bonuses than normal." :
                                trigger.id === 'health_threshold' ?
                                  "When target is below the health threshold, provide percentage bonuses instead of flat bonuses." :
                                "Configure how the buff behaves when this specific trigger activates it."
                              }
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Debuff Configuration UI */}
                      {(selectedEffect === 'debuff' || selectedEffect?.startsWith('debuff_')) && (
                        <div className="wow-debuff-config-container">
                          {/* Stat Penalties Section */}
                          {(selectedEffect === 'debuff_stat' || selectedEffect === 'debuff') && (
                            <div className="wow-debuff-config-section">
                              <h6 className="wow-debuff-section-title">Stat Penalties</h6>

                              {state.debuffConfig && state.debuffConfig.statPenalties && state.debuffConfig.statPenalties.length > 0 ? (
                                <div className="wow-debuff-stat-penalties">
                                  {state.debuffConfig.statPenalties.map((stat, statIndex) => {
                                    // Get conditional value for this stat if it exists
                                    const conditionalSettings = conditionalEffects[selectedEffect]?.conditionalSettings || {};
                                    const triggerSettings = conditionalSettings[trigger.id] || {};
                                    const statSettings = triggerSettings.statPenalties || [];
                                    const conditionalStat = statSettings.find(s => s.id === stat.id) || {};

                                    {/* Check if this stat is enabled in the conditional effect */}
                                    const isEnabled = !!conditionalStat.id;

                                    return (
                                      <div key={statIndex} className={`wow-debuff-stat-penalty ${isEnabled ? '' : 'disabled'}`}>
                                        <div className="wow-debuff-stat-info">
                                          <div className="wow-debuff-stat-checkbox">
                                            <input
                                              type="checkbox"
                                              checked={isEnabled}
                                              onChange={(e) => {
                                                // Toggle this stat in the conditional settings
                                                const newConditionalEffects = { ...conditionalEffects };
                                                if (!newConditionalEffects[selectedEffect]) {
                                                  newConditionalEffects[selectedEffect] = { isConditional: true, conditionalFormulas: {}, conditionalSettings: {} };
                                                }
                                                if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                                  newConditionalEffects[selectedEffect].conditionalSettings = {};
                                                }
                                                if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = { statPenalties: [] };
                                                }

                                                let statPenalties = [...(newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].statPenalties || [])];

                                                if (e.target.checked) {
                                                  // Add the stat if it doesn't exist
                                                  if (!statPenalties.find(s => s.id === stat.id)) {
                                                    statPenalties.push({
                                                      ...stat,
                                                      magnitude: stat.magnitude,
                                                      magnitudeType: stat.magnitudeType
                                                    });
                                                  }
                                                } else {
                                                  // Remove the stat if it exists
                                                  const index = statPenalties.findIndex(s => s.id === stat.id);
                                                  if (index >= 0) {
                                                    statPenalties.splice(index, 1);
                                                  }
                                                }

                                                newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].statPenalties = statPenalties;
                                                setConditionalEffects(newConditionalEffects);
                                              }}
                                            />
                                          </div>
                                          <div className="wow-debuff-stat-icon">
                                            <img src={getIconUrl(stat.icon)} alt={stat.name} />
                                          </div>
                                          <div className="wow-debuff-stat-name">{stat.name}</div>
                                        </div>

                                        {isEnabled && (
                                          <div className="wow-debuff-stat-value-container">
                                            <input
                                              type="text"
                                              className="wow-debuff-stat-value-input"
                                              value={conditionalStat.magnitude !== undefined ? conditionalStat.magnitude : (stat.magnitude || '')}
                                              onChange={(e) => {
                                                // Update the conditional stat value
                                                const newConditionalEffects = { ...conditionalEffects };
                                                if (!newConditionalEffects[selectedEffect]) {
                                                  newConditionalEffects[selectedEffect] = { isConditional: true, conditionalFormulas: {}, conditionalSettings: {} };
                                                }
                                                if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                                  newConditionalEffects[selectedEffect].conditionalSettings = {};
                                                }
                                                if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = { statPenalties: [] };
                                                }

                                                // Find or create the stat penalty
                                                const statPenalties = newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].statPenalties || [];
                                                const existingStatIndex = statPenalties.findIndex(s => s.id === stat.id);

                                                if (existingStatIndex >= 0) {
                                                  statPenalties[existingStatIndex] = {
                                                    ...statPenalties[existingStatIndex],
                                                    magnitude: e.target.value
                                                  };
                                                } else {
                                                  statPenalties.push({
                                                    ...stat,
                                                    magnitude: e.target.value
                                                  });
                                                }

                                                newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].statPenalties = statPenalties;
                                                setConditionalEffects(newConditionalEffects);

                                                // Also update the formula for backward compatibility
                                                updateConditionalFormula(selectedEffect, trigger.id, e.target.value);
                                              }}
                                              placeholder={stat.magnitude || ''}
                                            />

                                            <select
                                              className="wow-debuff-stat-type-select"
                                              value={conditionalStat.magnitudeType || stat.magnitudeType || 'flat'}
                                              onChange={(e) => {
                                                // Update the conditional stat type
                                                const newConditionalEffects = { ...conditionalEffects };
                                                if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                                  newConditionalEffects[selectedEffect].conditionalSettings = {};
                                                }
                                                if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = { statPenalties: [] };
                                                }

                                                // Find or create the stat penalty
                                                const statPenalties = newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].statPenalties || [];
                                                const existingStatIndex = statPenalties.findIndex(s => s.id === stat.id);

                                                if (existingStatIndex >= 0) {
                                                  statPenalties[existingStatIndex] = {
                                                    ...statPenalties[existingStatIndex],
                                                    magnitudeType: e.target.value
                                                  };
                                                } else {
                                                  statPenalties.push({
                                                    ...stat,
                                                    magnitudeType: e.target.value
                                                  });
                                                }

                                                newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].statPenalties = statPenalties;
                                                setConditionalEffects(newConditionalEffects);
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
                                <div className="wow-debuff-no-stats">
                                  <p>No stat penalties configured. Add stats in the Debuff Effect step.</p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Duration and Saving Throw Section */}
                          <div className="wow-debuff-config-section">
                            <h6 className="wow-debuff-section-title">Duration & Saving Throw</h6>
                            <div className="wow-debuff-duration-container">
                              <div className="wow-debuff-duration-input">
                                <label>Duration:</label>
                                <input
                                  type="number"
                                  className="wow-debuff-duration-value"
                                  value={
                                    conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.duration ||
                                    state.debuffConfig?.durationValue ||
                                    state.debuffConfig?.duration ||
                                    3
                                  }
                                  onChange={(e) => {
                                    // Update the conditional duration
                                    const newConditionalEffects = { ...conditionalEffects };
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                      newConditionalEffects[selectedEffect].conditionalSettings = {};
                                    }
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                      newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                    }

                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].duration = parseInt(e.target.value) || 3;
                                    setConditionalEffects(newConditionalEffects);
                                  }}
                                  min="1"
                                  max="100"
                                />

                                <select
                                  className="wow-debuff-duration-unit"
                                  value={
                                    conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.durationUnit ||
                                    (state.debuffConfig?.durationType === 'time' ?
                                      (state.debuffConfig?.durationUnit || 'minutes') :
                                     state.debuffConfig?.durationType === 'rest' ?
                                      (state.debuffConfig?.restType || 'short') :
                                     state.debuffConfig?.durationType === 'permanent' ?
                                      'permanent' :
                                      'rounds')
                                  }
                                  onChange={(e) => {
                                    // Update the conditional duration unit
                                    const newConditionalEffects = { ...conditionalEffects };
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                      newConditionalEffects[selectedEffect].conditionalSettings = {};
                                    }
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                      newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                    }

                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].durationUnit = e.target.value;
                                    setConditionalEffects(newConditionalEffects);
                                  }}
                                >
                                  <option value="rounds">Rounds</option>
                                  <option value="seconds">Seconds</option>
                                  <option value="minutes">Minutes</option>
                                  <option value="hours">Hours</option>
                                  <option value="days">Days</option>
                                  <option value="short">Short Rest</option>
                                  <option value="long">Long Rest</option>
                                  <option value="permanent">Permanent</option>
                                </select>
                              </div>
                            </div>

                            <div className="wow-debuff-save-container">
                              <div className="wow-debuff-save-input">
                                <label>DC:</label>
                                <input
                                  type="number"
                                  className="wow-debuff-dc-value"
                                  value={
                                    conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.difficultyClass ||
                                    state.debuffConfig?.difficultyClass ||
                                    15
                                  }
                                  onChange={(e) => {
                                    // Update the conditional DC
                                    const newConditionalEffects = { ...conditionalEffects };
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                      newConditionalEffects[selectedEffect].conditionalSettings = {};
                                    }
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                      newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                    }

                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].difficultyClass = parseInt(e.target.value) || 15;
                                    setConditionalEffects(newConditionalEffects);
                                  }}
                                  min="1"
                                  max="30"
                                />

                                <label className="wow-debuff-save-label">Save:</label>
                                <select
                                  className="wow-debuff-save-type"
                                  value={
                                    conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.savingThrow ||
                                    state.debuffConfig?.savingThrow ||
                                    'constitution'
                                  }
                                  onChange={(e) => {
                                    // Update the conditional saving throw
                                    const newConditionalEffects = { ...conditionalEffects };
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                      newConditionalEffects[selectedEffect].conditionalSettings = {};
                                    }
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                      newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                    }

                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].savingThrow = e.target.value;
                                    setConditionalEffects(newConditionalEffects);
                                  }}
                                >
                                  <option value="strength">Strength</option>
                                  <option value="agility">Agility</option>
                                  <option value="constitution">Constitution</option>
                                  <option value="intelligence">Intelligence</option>
                                  <option value="spirit">Spirit</option>
                                  <option value="charisma">Charisma</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Control Type Section (for debuff_control) */}
                          {selectedEffect === 'debuff_control' && (
                            <div className="wow-debuff-config-section">
                              <h6 className="wow-debuff-section-title">Control Type</h6>
                              <div className="wow-debuff-control-container">
                                <select
                                  className="wow-debuff-control-type"
                                  value={
                                    conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.controlType ||
                                    state.debuffConfig?.controlType ||
                                    'slow'
                                  }
                                  onChange={(e) => {
                                    // Update the conditional control type
                                    const newConditionalEffects = { ...conditionalEffects };
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                      newConditionalEffects[selectedEffect].conditionalSettings = {};
                                    }
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                      newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                    }

                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].controlType = e.target.value;
                                    setConditionalEffects(newConditionalEffects);
                                  }}
                                >
                                  <option value="slow">Slow</option>
                                  <option value="root">Root</option>
                                  <option value="stun">Stun</option>
                                  <option value="silence">Silence</option>
                                  <option value="fear">Fear</option>
                                  <option value="charm">Charm</option>
                                  <option value="sleep">Sleep</option>
                                  <option value="blind">Blind</option>
                                </select>
                              </div>
                            </div>
                          )}

                          {/* Quick Suggestions for Debuff Effects */}
                          <div className="wow-formula-suggestions">
                            <h6 className="wow-debuff-section-title">Quick Suggestions</h6>
                            <div className="wow-formula-suggestion-buttons">
                              <button
                                className="wow-formula-suggestion"
                                onClick={() => {
                                  // Apply stronger penalties to all stats
                                  const newConditionalEffects = { ...conditionalEffects };
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                    newConditionalEffects[selectedEffect].conditionalSettings = {};
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = { statPenalties: [] };
                                  }

                                  // Create stronger stat penalties
                                  const statPenalties = state.debuffConfig?.statPenalties?.map(stat => ({
                                    ...stat,
                                    magnitude: typeof stat.magnitude === 'number' ? stat.magnitude * 2 : -4,
                                    magnitudeType: 'flat'
                                  })) || [];

                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].statPenalties = statPenalties;
                                  setConditionalEffects(newConditionalEffects);

                                  // Also update the formula for backward compatibility
                                  updateConditionalFormula(selectedEffect, trigger.id, '-4');
                                }}
                                title="Double the stat penalties for this trigger"
                              >
                                Stronger Penalties
                              </button>
                              <button
                                className="wow-formula-suggestion"
                                onClick={() => {
                                  // Apply percentage values to all stats
                                  const newConditionalEffects = { ...conditionalEffects };
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                    newConditionalEffects[selectedEffect].conditionalSettings = {};
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = { statPenalties: [] };
                                  }

                                  // Create percentage stat penalties
                                  const statPenalties = state.debuffConfig?.statPenalties?.map(stat => ({
                                    ...stat,
                                    magnitude: -20,
                                    magnitudeType: 'percentage'
                                  })) || [];

                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].statPenalties = statPenalties;
                                  setConditionalEffects(newConditionalEffects);

                                  // Also update the formula for backward compatibility
                                  updateConditionalFormula(selectedEffect, trigger.id, '-20%');
                                }}
                                title="Convert all penalties to percentage values"
                              >
                                Percentage Penalties
                              </button>
                              <button
                                className="wow-formula-suggestion"
                                onClick={() => {
                                  // Apply variable values to all stats
                                  const newConditionalEffects = { ...conditionalEffects };
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                    newConditionalEffects[selectedEffect].conditionalSettings = {};
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = { statPenalties: [] };
                                  }

                                  // Create variable stat penalties
                                  const statPenalties = state.debuffConfig?.statPenalties?.map(stat => ({
                                    ...stat,
                                    magnitude: '-1d4',
                                    magnitudeType: 'flat'
                                  })) || [];

                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].statPenalties = statPenalties;
                                  setConditionalEffects(newConditionalEffects);

                                  // Also update the formula for backward compatibility
                                  updateConditionalFormula(selectedEffect, trigger.id, '-1d4');
                                }}
                                title="Use variable dice rolls for penalties"
                              >
                                Variable Penalties
                              </button>
                            </div>
                          </div>

                          <div className="wow-conditional-formula-example">
                            <p className="wow-conditional-formula-tip">
                              <strong>Example:</strong> {
                                trigger.id === 'combat_start' ?
                                  "When combat starts, apply stronger debuffs to the target." :
                                trigger.id === 'health_threshold' ?
                                  "When target is below the health threshold, apply percentage-based penalties instead of flat penalties." :
                                "Configure how the debuff behaves when this specific trigger activates it."
                              }
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Control Effect Configuration UI */}
                      {(selectedEffect === 'control' || selectedEffect?.startsWith('control_')) && (
                        <div className="wow-control-config-container">
                          {/* Control Type Section */}
                          <div className="wow-control-config-section">
                            <h6 className="wow-control-section-title">Control Type</h6>
                            <div className="wow-control-type-container">
                              <select
                                className="wow-control-type-select"
                                value={
                                  conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.controlType ||
                                  state.controlConfig?.controlType ||
                                  'stun'
                                }
                                onChange={(e) => {
                                  // Update the conditional control type
                                  const newConditionalEffects = { ...conditionalEffects };
                                  if (!newConditionalEffects[selectedEffect]) {
                                    newConditionalEffects[selectedEffect] = { isConditional: true, conditionalFormulas: {}, conditionalSettings: {} };
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                    newConditionalEffects[selectedEffect].conditionalSettings = {};
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                  }

                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].controlType = e.target.value;
                                  setConditionalEffects(newConditionalEffects);
                                }}
                              >
                                {/* Restraint Types */}
                                <optgroup label="Restraint">
                                  <option value="bind">Binding</option>
                                  <option value="slow">Slowing</option>
                                  <option value="snare">Snare</option>
                                  <option value="web">Web</option>
                                </optgroup>

                                {/* Incapacitation Types */}
                                <optgroup label="Incapacitation">
                                  <option value="sleep">Sleep</option>
                                  <option value="stun">Stun</option>
                                  <option value="paralyze">Paralyze</option>
                                  <option value="daze">Daze</option>
                                </optgroup>

                                {/* Mind Control Types */}
                                <optgroup label="Mind Control">
                                  <option value="command">Command</option>
                                  <option value="confuse">Confuse</option>
                                  <option value="dominate">Dominate</option>
                                  <option value="fear">Fear</option>
                                </optgroup>

                                {/* Knockdown Types */}
                                <optgroup label="Knockdown">
                                  <option value="trip">Trip</option>
                                  <option value="stagger">Stagger</option>
                                  <option value="repel">Repel</option>
                                  <option value="throw">Throw</option>
                                </optgroup>

                                {/* Forced Movement Types */}
                                <optgroup label="Forced Movement">
                                  <option value="push">Push</option>
                                  <option value="pull">Pull</option>
                                  <option value="slide">Slide</option>
                                  <option value="teleport">Teleport</option>
                                </optgroup>

                                {/* Action Restriction Types */}
                                <optgroup label="Action Restriction">
                                  <option value="silence">Silence</option>
                                  <option value="disarm">Disarm</option>
                                  <option value="blind">Blind</option>
                                  <option value="root">Root</option>
                                </optgroup>
                              </select>
                            </div>
                          </div>

                          {/* Duration Section */}
                          <div className="wow-control-config-section">
                            <h6 className="wow-control-section-title">Duration</h6>
                            <div className="wow-control-duration-container">
                              <div className="wow-control-duration-input">
                                <input
                                  type="number"
                                  className="wow-control-duration-value"
                                  value={
                                    conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.duration ||
                                    state.controlConfig?.duration ||
                                    1
                                  }
                                  onChange={(e) => {
                                    // Update the conditional duration
                                    const newConditionalEffects = { ...conditionalEffects };
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                      newConditionalEffects[selectedEffect].conditionalSettings = {};
                                    }
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                      newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                    }

                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].duration = parseInt(e.target.value) || 1;
                                    setConditionalEffects(newConditionalEffects);
                                  }}
                                  min="1"
                                  max="100"
                                />

                                <select
                                  className="wow-control-duration-unit"
                                  value={
                                    conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.durationUnit ||
                                    state.controlConfig?.durationUnit ||
                                    'rounds'
                                  }
                                  onChange={(e) => {
                                    // Update the conditional duration unit
                                    const newConditionalEffects = { ...conditionalEffects };
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                      newConditionalEffects[selectedEffect].conditionalSettings = {};
                                    }
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                      newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                    }

                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].durationUnit = e.target.value;
                                    setConditionalEffects(newConditionalEffects);
                                  }}
                                >
                                  <option value="rounds">Rounds</option>
                                  <option value="seconds">Seconds</option>
                                  <option value="minutes">Minutes</option>
                                  <option value="hours">Hours</option>
                                  <option value="days">Days</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Saving Throw Section */}
                          <div className="wow-control-config-section">
                            <h6 className="wow-control-section-title">Saving Throw</h6>
                            <div className="wow-control-save-container">
                              <div className="wow-control-save-type">
                                <label>Save Type:</label>
                                <select
                                  className="wow-control-save-select"
                                  value={
                                    conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.savingThrow ||
                                    state.controlConfig?.savingThrow ||
                                    'strength'
                                  }
                                  onChange={(e) => {
                                    // Update the conditional saving throw
                                    const newConditionalEffects = { ...conditionalEffects };
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                      newConditionalEffects[selectedEffect].conditionalSettings = {};
                                    }
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                      newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                    }

                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].savingThrow = e.target.value;
                                    setConditionalEffects(newConditionalEffects);
                                  }}
                                >
                                  <option value="strength">Strength</option>
                                  <option value="agility">Agility</option>
                                  <option value="constitution">Constitution</option>
                                  <option value="intelligence">Intelligence</option>
                                  <option value="spirit">Spirit</option>
                                  <option value="charisma">Charisma</option>
                                </select>
                              </div>

                              <div className="wow-control-dc">
                                <label>DC:</label>
                                <input
                                  type="number"
                                  className="wow-control-dc-value"
                                  value={
                                    conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.difficultyClass ||
                                    state.controlConfig?.difficultyClass ||
                                    15
                                  }
                                  onChange={(e) => {
                                    // Update the conditional DC
                                    const newConditionalEffects = { ...conditionalEffects };
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                      newConditionalEffects[selectedEffect].conditionalSettings = {};
                                    }
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                      newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                    }

                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].difficultyClass = parseInt(e.target.value) || 15;
                                    setConditionalEffects(newConditionalEffects);
                                  }}
                                  min="1"
                                  max="30"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Quick Suggestions for Control Effects */}
                          <div className="wow-formula-suggestions">
                            <h6 className="wow-control-section-title">Quick Suggestions</h6>
                            <div className="wow-formula-suggestion-buttons">
                              <button
                                className="wow-formula-suggestion"
                                onClick={() => {
                                  // Apply stronger control effect
                                  const newConditionalEffects = { ...conditionalEffects };
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                    newConditionalEffects[selectedEffect].conditionalSettings = {};
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                  }

                                  // Increase duration and DC
                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].duration =
                                    Math.min((state.controlConfig?.duration || 1) * 2, 10);
                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].difficultyClass =
                                    Math.min((state.controlConfig?.difficultyClass || 15) + 5, 25);

                                  setConditionalEffects(newConditionalEffects);
                                }}
                                title="Stronger control effect for this trigger"
                              >
                                Stronger Control
                              </button>
                              <button
                                className="wow-formula-suggestion"
                                onClick={() => {
                                  // Apply weaker but longer control effect
                                  const newConditionalEffects = { ...conditionalEffects };
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                    newConditionalEffects[selectedEffect].conditionalSettings = {};
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                  }

                                  // Decrease DC but increase duration
                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].duration =
                                    Math.min((state.controlConfig?.duration || 1) * 3, 15);
                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].difficultyClass =
                                    Math.max((state.controlConfig?.difficultyClass || 15) - 3, 10);

                                  setConditionalEffects(newConditionalEffects);
                                }}
                                title="Longer but weaker control effect"
                              >
                                Extended Control
                              </button>
                              <button
                                className="wow-formula-suggestion"
                                onClick={() => {
                                  // Apply different control type
                                  const newConditionalEffects = { ...conditionalEffects };
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                    newConditionalEffects[selectedEffect].conditionalSettings = {};
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                  }

                                  // Change control type based on current type
                                  const currentType = state.controlConfig?.controlType || 'stun';
                                  let newType = 'stun';

                                  if (currentType === 'stun') newType = 'fear';
                                  else if (currentType === 'fear') newType = 'root';
                                  else if (currentType === 'root') newType = 'silence';
                                  else if (currentType === 'silence') newType = 'slow';
                                  else if (currentType === 'slow') newType = 'charm';
                                  else if (currentType === 'charm') newType = 'sleep';
                                  else if (currentType === 'sleep') newType = 'blind';
                                  else if (currentType === 'blind') newType = 'confuse';
                                  else if (currentType === 'confuse') newType = 'polymorph';
                                  else if (currentType === 'polymorph') newType = 'stun';

                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].controlType = newType;

                                  setConditionalEffects(newConditionalEffects);
                                }}
                                title="Change control type for this trigger"
                              >
                                Alternate Control
                              </button>
                            </div>
                          </div>

                          <div className="wow-conditional-formula-example">
                            <p className="wow-conditional-formula-tip">
                              <strong>Example:</strong> {
                                trigger.id === 'combat_start' ?
                                  "When combat starts, apply a stronger control effect with higher DC." :
                                trigger.id === 'health_threshold' ?
                                  "When target is below the health threshold, apply a different type of control effect." :
                                "Configure how the control effect behaves when this specific trigger activates it."
                              }
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Restoration Effect Configuration UI */}
                      {(selectedEffect === 'restoration' || selectedEffect?.startsWith('restoration_')) && (
                        <div className="wow-restoration-config-container">
                          {/* Resource Type Section */}
                          <div className="wow-restoration-config-section">
                            <h6 className="wow-restoration-section-title">Resource Type</h6>
                            <div className="wow-restoration-type-container">
                              <select
                                className="wow-restoration-type-select"
                                value={
                                  conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.resourceType ||
                                  state.restorationConfig?.resourceType ||
                                  'mana'
                                }
                                onChange={(e) => {
                                  // Update the conditional resource type
                                  const newConditionalEffects = { ...conditionalEffects };
                                  if (!newConditionalEffects[selectedEffect]) {
                                    newConditionalEffects[selectedEffect] = { isConditional: true, conditionalFormulas: {}, conditionalSettings: {} };
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                    newConditionalEffects[selectedEffect].conditionalSettings = {};
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                  }

                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].resourceType = e.target.value;
                                  setConditionalEffects(newConditionalEffects);
                                }}
                              >
                                {/* Vitality Resources */}
                                <optgroup label="Vitality">
                                  <option value="health">Health</option>
                                </optgroup>

                                {/* Magical Resources */}
                                <optgroup label="Magical">
                                  <option value="mana">Mana</option>
                                  <option value="inferno">Inferno</option>
                                </optgroup>

                                {/* Combat Resources */}
                                <optgroup label="Combat">
                                  <option value="action_points">Action Points</option>
                                </optgroup>

                                {/* Physical Resources */}
                                <optgroup label="Physical">
                                  <option value="energy">Energy</option>
                                  <option value="rage">Rage</option>
                                  <option value="focus">Focus</option>
                                </optgroup>
                              </select>
                            </div>
                          </div>

                          {/* Formula Section */}
                          <div className="wow-restoration-config-section">
                            <h6 className="wow-restoration-section-title">Formula</h6>
                            <div className="wow-conditional-formula-input">
                              <input
                                type="text"
                                value={conditionalEffects[selectedEffect]?.conditionalFormulas?.[trigger.id] || ''}
                                onChange={(e) => {
                                  // Update the conditional formula
                                  updateConditionalFormula(selectedEffect, trigger.id, e.target.value);

                                  // Also update the formula in the conditional settings to ensure it's properly remembered
                                  const newConditionalEffects = { ...conditionalEffects };
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                    newConditionalEffects[selectedEffect].conditionalSettings = {};
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                  }

                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].formula = e.target.value;

                                  // Make sure the formula is also stored in conditionalFormulas
                                  if (!newConditionalEffects[selectedEffect].conditionalFormulas) {
                                    newConditionalEffects[selectedEffect].conditionalFormulas = {};
                                  }
                                  newConditionalEffects[selectedEffect].conditionalFormulas[trigger.id] = e.target.value;

                                  setConditionalEffects(newConditionalEffects);

                                  // Log the updated state for debugging
                                  console.log('Updated formula:', e.target.value);
                                  console.log('Updated conditionalEffects:', JSON.stringify(newConditionalEffects));
                                }}
                                placeholder={conditionalEffects[selectedEffect]?.baseFormula || "e.g., 2d6 + INT"}
                                className="wow-formula-input"
                              />
                              <div className="wow-formula-current">
                                <span className="wow-formula-current-label">Base Formula: </span>
                                <span className="wow-formula-current-value">{conditionalEffects[selectedEffect]?.baseFormula || state.restorationConfig?.formula || '2d6 + INT'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Resolution Type Section */}
                          <div className="wow-restoration-config-section">
                            <h6 className="wow-restoration-section-title">Resolution Type</h6>
                            <div className="wow-restoration-resolution-container">
                              <select
                                className="wow-restoration-resolution-select"
                                value={
                                  conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.resolution ||
                                  state.restorationConfig?.resolution ||
                                  'DICE'
                                }
                                onChange={(e) => {
                                  // Update the conditional resolution type
                                  const newConditionalEffects = { ...conditionalEffects };
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                    newConditionalEffects[selectedEffect].conditionalSettings = {};
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                  }

                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].resolution = e.target.value;
                                  setConditionalEffects(newConditionalEffects);
                                }}
                              >
                                <option value="DICE">Dice Roll</option>
                                <option value="CARDS">Card Draw</option>
                                <option value="COINS">Coin Flip</option>
                              </select>
                            </div>
                          </div>

                          {/* Over Time Section */}
                          <div className="wow-restoration-config-section">
                            <h6 className="wow-restoration-section-title">Over Time Settings</h6>
                            <div className="wow-restoration-overtime-container">
                              <div className="wow-restoration-checkbox-container">
                                <label>
                                  <input
                                    type="checkbox"
                                    checked={
                                      conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.isOverTime ||
                                      state.restorationConfig?.isOverTime ||
                                      false
                                    }
                                    onChange={(e) => {
                                      // Update the conditional over time setting
                                      const newConditionalEffects = { ...conditionalEffects };
                                      if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                        newConditionalEffects[selectedEffect].conditionalSettings = {};
                                      }
                                      if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                        newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                      }

                                      newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].isOverTime = e.target.checked;
                                      setConditionalEffects(newConditionalEffects);
                                    }}
                                  />
                                  Apply Over Time
                                </label>
                              </div>

                              {(conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.isOverTime ||
                                state.restorationConfig?.isOverTime) && (
                                <>
                                  <div className="wow-restoration-overtime-formula">
                                    <label>Over Time Formula:</label>
                                    <input
                                      type="text"
                                      value={
                                        conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.overTimeFormula ||
                                        state.restorationConfig?.overTimeFormula ||
                                        '1d4 + INT/2'
                                      }
                                      onChange={(e) => {
                                        // Update the conditional over time formula
                                        const newConditionalEffects = { ...conditionalEffects };
                                        if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                          newConditionalEffects[selectedEffect].conditionalSettings = {};
                                        }
                                        if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                          newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                        }

                                        newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeFormula = e.target.value;
                                        setConditionalEffects(newConditionalEffects);
                                      }}
                                      placeholder="e.g., 1d4 + INT/2"
                                      className="wow-formula-input"
                                    />
                                    <div className="wow-formula-current">
                                      <span className="wow-formula-current-label">Base Over Time Formula: </span>
                                      <span className="wow-formula-current-value">{state.restorationConfig?.overTimeFormula || '1d4 + INT/2'}</span>
                                    </div>
                                  </div>

                                  <div className="wow-restoration-overtime-duration">
                                    <label>Duration:</label>
                                    <div className="wow-restoration-duration-input">
                                      <input
                                        type="number"
                                        value={
                                          conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.overTimeDuration ||
                                          state.restorationConfig?.overTimeDuration ||
                                          3
                                        }
                                        onChange={(e) => {
                                          // Update the conditional over time duration
                                          const newConditionalEffects = { ...conditionalEffects };
                                          if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                            newConditionalEffects[selectedEffect].conditionalSettings = {};
                                          }
                                          if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                            newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                          }

                                          newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeDuration = parseInt(e.target.value) || 3;
                                          setConditionalEffects(newConditionalEffects);
                                        }}
                                        min="1"
                                        max="100"
                                        className="wow-duration-input"
                                      />

                                      <select
                                        value={
                                          conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.tickFrequency ||
                                          state.restorationConfig?.tickFrequency ||
                                          'round'
                                        }
                                        onChange={(e) => {
                                          // Update the conditional tick frequency
                                          const newConditionalEffects = { ...conditionalEffects };
                                          if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                            newConditionalEffects[selectedEffect].conditionalSettings = {};
                                          }
                                          if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                            newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                          }

                                          newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].tickFrequency = e.target.value;
                                          setConditionalEffects(newConditionalEffects);
                                        }}
                                        className="wow-duration-unit"
                                      >
                                        <option value="round">Rounds</option>
                                        <option value="turn">Turns</option>
                                        <option value="minute">Minutes</option>
                                        <option value="hour">Hours</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="wow-restoration-progressive">
                                    <div className="wow-restoration-checkbox-container">
                                      <label>
                                        <input
                                          type="checkbox"
                                          checked={
                                            conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.isProgressiveOverTime ||
                                            state.restorationConfig?.isProgressiveOverTime ||
                                            false
                                          }
                                          onChange={(e) => {
                                            // Update the conditional progressive over time setting
                                            const newConditionalEffects = { ...conditionalEffects };
                                            if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                              newConditionalEffects[selectedEffect].conditionalSettings = {};
                                            }
                                            if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                              newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                            }

                                            const isProgressiveOverTime = e.target.checked;
                                            newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].isProgressiveOverTime = isProgressiveOverTime;

                                            // Initialize progressive stages if enabling
                                            if (isProgressiveOverTime &&
                                                (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeProgressiveStages ||
                                                 newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeProgressiveStages.length === 0)) {
                                              newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeProgressiveStages = [{
                                                triggerAt: 1,
                                                formula: newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeFormula ||
                                                         state.restorationConfig?.overTimeFormula || '1d4 + INT/2',
                                                description: 'Initial restoration'
                                              }];
                                            }

                                            setConditionalEffects(newConditionalEffects);
                                          }}
                                        />
                                        Progressive Stages
                                      </label>
                                    </div>

                                    {/* Display Progressive Stages */}
                                    {conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.isProgressiveOverTime &&
                                     conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.overTimeProgressiveStages && (
                                      <div className="wow-restoration-stages">
                                        <h6 className="wow-restoration-stages-title">Progressive Stages</h6>
                                        <div className="wow-restoration-stages-list">
                                          {conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.overTimeProgressiveStages.map((stage, index) => (
                                            <div key={index} className="wow-restoration-stage">
                                              <div className="wow-restoration-stage-header">
                                                <span className="wow-restoration-stage-number">Stage {index + 1}</span>
                                                <span className="wow-restoration-stage-trigger">Triggers at {stage.triggerAt} {conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.tickFrequency || 'rounds'}</span>
                                              </div>
                                              <div className="wow-restoration-stage-formula">
                                                <label>Formula:</label>
                                                <input
                                                  type="text"
                                                  value={stage.formula || ''}
                                                  onChange={(e) => {
                                                    // Update the stage formula
                                                    const newConditionalEffects = { ...conditionalEffects };
                                                    const stages = [...newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeProgressiveStages];
                                                    stages[index] = { ...stages[index], formula: e.target.value };
                                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeProgressiveStages = stages;
                                                    setConditionalEffects(newConditionalEffects);
                                                  }}
                                                  className="wow-formula-input"
                                                />
                                              </div>
                                              <div className="wow-restoration-stage-description">
                                                <label>Description:</label>
                                                <input
                                                  type="text"
                                                  value={stage.description || ''}
                                                  onChange={(e) => {
                                                    // Update the stage description
                                                    const newConditionalEffects = { ...conditionalEffects };
                                                    const stages = [...newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeProgressiveStages];
                                                    stages[index] = { ...stages[index], description: e.target.value };
                                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeProgressiveStages = stages;
                                                    setConditionalEffects(newConditionalEffects);
                                                  }}
                                                  placeholder="Optional description"
                                                  className="wow-description-input"
                                                />
                                              </div>
                                              {index > 0 && (
                                                <button
                                                  className="wow-remove-stage-button"
                                                  onClick={() => {
                                                    // Remove this stage
                                                    const newConditionalEffects = { ...conditionalEffects };
                                                    const stages = [...newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeProgressiveStages];
                                                    stages.splice(index, 1);
                                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeProgressiveStages = stages;
                                                    setConditionalEffects(newConditionalEffects);
                                                  }}
                                                >
                                                  Remove Stage
                                                </button>
                                              )}
                                            </div>
                                          ))}
                                          <button
                                            className="wow-add-stage-button"
                                            onClick={() => {
                                              // Add a new stage
                                              const newConditionalEffects = { ...conditionalEffects };
                                              const stages = [...(newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeProgressiveStages || [])];
                                              const lastStage = stages[stages.length - 1];
                                              stages.push({
                                                triggerAt: lastStage ? lastStage.triggerAt + 1 : 1,
                                                formula: lastStage ? lastStage.formula : (newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeFormula || '1d4 + INT/2'),
                                                description: ''
                                              });
                                              newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeProgressiveStages = stages;
                                              setConditionalEffects(newConditionalEffects);
                                            }}
                                          >
                                            Add Stage
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Quick Suggestions for Restoration Effects */}
                          <div className="wow-formula-suggestions">
                            <h6 className="wow-restoration-section-title">Quick Suggestions</h6>
                            <div className="wow-formula-suggestion-buttons">
                              <button
                                className="wow-formula-suggestion"
                                onClick={() => {
                                  // Apply stronger restoration effect
                                  const newConditionalEffects = { ...conditionalEffects };
                                  if (!newConditionalEffects[selectedEffect]) {
                                    newConditionalEffects[selectedEffect] = { isConditional: true, conditionalFormulas: {}, conditionalSettings: {} };
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                    newConditionalEffects[selectedEffect].conditionalSettings = {};
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                  }

                                  // Get the base formula and enhance it
                                  const baseFormula = state.restorationConfig?.formula || '2d6 + INT';
                                  const enhancedFormula = baseFormula.replace(/(\d+)d(\d+)/, (_, count, sides) => {
                                    const newCount = Math.min(parseInt(count) + 2, 10);
                                    return `${newCount}d${sides}`;
                                  });

                                  // Update the formula
                                  updateConditionalFormula(selectedEffect, trigger.id, enhancedFormula);
                                }}
                                title="Stronger restoration effect for this trigger"
                              >
                                Stronger Restoration
                              </button>
                              <button
                                className="wow-formula-suggestion"
                                onClick={() => {
                                  // Apply over time restoration
                                  const newConditionalEffects = { ...conditionalEffects };
                                  if (!newConditionalEffects[selectedEffect]) {
                                    newConditionalEffects[selectedEffect] = { isConditional: true, conditionalFormulas: {}, conditionalSettings: {} };
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                    newConditionalEffects[selectedEffect].conditionalSettings = {};
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                  }

                                  // Enable over time and set duration
                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].isOverTime = true;
                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeDuration = 5;
                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].tickFrequency = 'round';
                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeTriggerType = 'periodic';

                                  // Get the base formula and create an over time version
                                  const baseFormula = state.restorationConfig?.formula || '2d6 + INT';
                                  const overTimeFormula = baseFormula.replace(/(\d+)d(\d+)/, (_, __, sides) => {
                                    return `1d${sides}`;
                                  });

                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeFormula = overTimeFormula;

                                  setConditionalEffects(newConditionalEffects);

                                  // Also update the main formula
                                  updateConditionalFormula(selectedEffect, trigger.id, baseFormula);
                                }}
                                title="Apply restoration over time"
                              >
                                Over Time Restoration
                              </button>
                              <button
                                className="wow-formula-suggestion"
                                onClick={() => {
                                  // Apply progressive restoration
                                  const newConditionalEffects = { ...conditionalEffects };
                                  if (!newConditionalEffects[selectedEffect]) {
                                    newConditionalEffects[selectedEffect] = { isConditional: true, conditionalFormulas: {}, conditionalSettings: {} };
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                    newConditionalEffects[selectedEffect].conditionalSettings = {};
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                  }

                                  // Enable over time and progressive
                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].isOverTime = true;
                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeDuration = 3;
                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].tickFrequency = 'round';
                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeTriggerType = 'periodic';
                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].isProgressiveOverTime = true;

                                  // Get the base formula
                                  const baseFormula = state.restorationConfig?.formula || '2d6 + INT';

                                  // Create progressive stages
                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeProgressiveStages = [
                                    {
                                      triggerAt: 1,
                                      formula: baseFormula.replace(/(\d+)d(\d+)/, (_, __, sides) => `1d${sides}`),
                                      description: 'Initial restoration'
                                    },
                                    {
                                      triggerAt: 2,
                                      formula: baseFormula,
                                      description: 'Enhanced restoration'
                                    },
                                    {
                                      triggerAt: 3,
                                      formula: baseFormula.replace(/(\d+)d(\d+)/, (_, count, sides) => {
                                        const newCount = Math.min(parseInt(count) + 1, 10);
                                        return `${newCount}d${sides}`;
                                      }),
                                      description: 'Maximum restoration'
                                    }
                                  ];

                                  setConditionalEffects(newConditionalEffects);

                                  // Also update the main formula
                                  updateConditionalFormula(selectedEffect, trigger.id, baseFormula);
                                }}
                                title="Apply progressive restoration that increases over time"
                              >
                                Progressive Restoration
                              </button>
                            </div>
                          </div>

                          <div className="wow-conditional-formula-example">
                            <p className="wow-conditional-formula-tip">
                              <strong>Example:</strong> {
                                trigger.id === 'combat_start' ?
                                  "When combat starts, apply a stronger restoration effect." :
                                trigger.id === 'health_threshold' ?
                                  "When target is below the health threshold, apply restoration over time." :
                                "Configure how the restoration effect behaves when this specific trigger activates it."
                              }
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Default for other effect types */}
                      {!selectedEffect?.startsWith('damage') && !selectedEffect?.startsWith('healing') &&
                       !selectedEffect?.startsWith('buff') && !selectedEffect?.startsWith('debuff') &&
                       !selectedEffect?.startsWith('control') && !selectedEffect?.startsWith('restoration') && (
                        <div className="wow-conditional-formula-input">
                          <label>Formula:</label>
                          <input
                            type="text"
                            value={conditionalEffects[selectedEffect]?.conditionalFormulas?.[trigger.id] || ''}
                            onChange={(e) => updateConditionalFormula(selectedEffect, trigger.id, e.target.value)}
                            placeholder={conditionalEffects[selectedEffect]?.baseFormula || "e.g., 2d6 + INT"}
                            className="wow-formula-input"
                          />

                          <div className="wow-conditional-formula-example">
                            <p className="wow-conditional-formula-tip">
                              <strong>Example:</strong> Set a different formula for when this specific trigger activates the effect.
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )) : <></>}
            </div>
          )}
        </div>

        {/* Preview */}
        {(editingMode === 'global' && triggerConfig && triggerConfig.compoundTriggers && triggerConfig.compoundTriggers.length > 0) && (
          <div className="effect-preview">
            <div className="effect-preview-header">
              <div className="effect-preview-title">
                <h4>Global Trigger Preview</h4>
              </div>
            </div>
            <div className="effect-preview-description">
              This spell will trigger when {triggerConfig.logicType === 'AND' ? 'all' : 'any'} of the following conditions are met:
              <ul className="mt-sm">
                {triggerConfig.compoundTriggers.map((trigger, index) => (
                  <li key={index}>
                    {trigger.name}
                    {Object.entries(trigger.parameters).map(([key, value], i) => (
                      <span key={i}>
                        {i === 0 ? ' - ' : ', '}
                        {key === 'comparison' ? '' : key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                        {typeof value === 'boolean'
                          ? value ? ' Yes' : ' No'
                          : key === 'comparison'
                            ? value === 'less_than'
                              ? ' is less than'
                              : value === 'greater_than'
                                ? ' is greater than'
                                : ' equals'
                          : key === 'resource_type'
                            ? ` ${RESOURCE_TYPES.find(r => r.id === value)?.name || value}`
                          : key === 'threshold_value' && trigger.parameters.threshold_type
                            ? ` ${value}${trigger.parameters.threshold_type === 'percentage' ? '%' : ' points'}`
                          : typeof value === 'number' && key === 'percentage'
                            ? ` ${value}%`
                            : ` ${value}`}
                      </span>
                    ))}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Effect-specific Trigger Preview removed as it's redundant with Effect Configuration Preview */}

        {/* Effect-specific Preview with Conditional Effects */}
        {(editingMode === 'effect' && selectedEffect && (
          (effectTriggers[selectedEffect] && effectTriggers[selectedEffect].compoundTriggers && effectTriggers[selectedEffect].compoundTriggers.length > 0) ||
          (conditionalEffects[selectedEffect]?.isConditional)
        )) && (
          <EnhancedEffectPreview
            selectedEffect={selectedEffect}
            state={state}
            effectTriggers={effectTriggers}
            conditionalEffects={conditionalEffects}
            triggerConfig={triggerConfig}
            resourceTypes={RESOURCE_TYPES}
          />
        )}

        {/* Examples */}
        <div className="effect-config-group mt-lg">
          <h3 className="section-header">Common Trigger Examples</h3>
          <div className="card-selection-grid">
            <div className="icon-selection-card">
              <h4>Defensive Reaction</h4>
              <p>Health Threshold + Combat</p>
              <p className="text-muted mt-xs">"When health drops below 30%, gain a shield"</p>
              <div className="example-formula">
                <span className="formula-label">Default:</span> 2d8 healing
                <span className="formula-label">When triggered:</span> 2d8 healing + 10 temp HP
              </div>
            </div>
            <div className="icon-selection-card">
              <h4>Counterattack</h4>
              <p>Dodge + Combat</p>
              <p className="text-muted mt-xs">"When successfully dodging an attack, perform a counter strike"</p>
              <div className="example-formula">
                <span className="formula-label">Default:</span> 2d6 damage
                <span className="formula-label">When target dodges:</span> 1d4 damage
                <span className="formula-label">When you dodge:</span> 3d6 damage
              </div>
            </div>
            <div className="icon-selection-card">
              <h4>Aura Effect</h4>
              <p>Proximity + Passive</p>
              <p className="text-muted mt-xs">"While allies are within 30 feet, they gain a bonus to healing received"</p>
              <div className="example-formula">
                <span className="formula-label">Default:</span> 2d8 healing
                <span className="formula-label">With ally nearby:</span> 2d8 + 5 healing
              </div>
            </div>
            <div className="icon-selection-card">
              <h4>Combat Opener</h4>
              <p>Combat Start + First Strike</p>
              <p className="text-muted mt-xs">"On entering combat, increase damage for first attack"</p>
              <div className="example-formula">
                <span className="formula-label">Default:</span> 2d6 damage
                <span className="formula-label">First strike:</span> 3d6 + 5 damage
              </div>
            </div>
            <div className="icon-selection-card">
              <h4>Critical Response</h4>
              <p>Critical Hit + Critical Hit Taken</p>
              <p className="text-muted mt-xs">"Different effects based on who scores a critical hit"</p>
              <div className="example-formula">
                <span className="formula-label">Default:</span> 2d6 damage
                <span className="formula-label">On your crit:</span> 4d6 damage
                <span className="formula-label">When hit by crit:</span> 1d6 damage + stun
              </div>
            </div>
            <div className="icon-selection-card">
              <h4>Adaptive Healing</h4>
              <p>Health Threshold + Overhealing</p>
              <p className="text-muted mt-xs">"Healing adapts based on target's health"</p>
              <div className="example-formula">
                <span className="formula-label">Default:</span> 2d8 healing
                <span className="formula-label">Target below 30%:</span> 3d8 + 5 healing
                <span className="formula-label">Target at full health:</span> 10 temp HP shield
              </div>
            </div>
            <div className="icon-selection-card">
              <h4>Resource Management</h4>
              <p>Resource Threshold</p>
              <p className="text-muted mt-xs">"When mana falls below 20%, recover a portion of max mana"</p>
              <div className="example-formula">
                <span className="formula-label">Default:</span> 2d6 damage
                <span className="formula-label">Low on mana:</span> 1d6 damage + 10 mana restored
              </div>
            </div>
            <div className="icon-selection-card">
              <h4>Zone Control</h4>
              <p>Enter Area + Environment</p>
              <p className="text-muted mt-xs">"When enemies enter marked area, slow their movement speed"</p>
              <div className="example-formula">
                <span className="formula-label">Default:</span> 2d6 damage
                <span className="formula-label">In marked area:</span> 2d6 damage + movement -10ft
              </div>
            </div>
            <div className="icon-selection-card">
              <h4>Combat Buff</h4>
              <p>Combat Start + Health Threshold</p>
              <p className="text-muted mt-xs">"Different stat bonuses based on combat conditions"</p>
              <div className="example-formula">
                <span className="formula-label">Default:</span> +2 Strength
                <span className="formula-label">Combat start:</span> +4 Strength
                <span className="formula-label">Low health:</span> +10% Armor
              </div>
            </div>
            {state.spellType === 'TRAP' && (
              <>
                <div className="icon-selection-card">
                  <h4>Pressure Plate</h4>
                  <p>Stepped On</p>
                  <p className="text-muted mt-xs">"When a creature steps on the trap, trigger an explosion"</p>
                </div>
                <div className="icon-selection-card">
                  <h4>Tripwire</h4>
                  <p>Proximity + Movement</p>
                  <p className="text-muted mt-xs">"When a creature moves through the area, trigger the trap"</p>
                </div>
                <div className="icon-selection-card">
                  <h4>Magical Sensor</h4>
                  <p>Line of Sight</p>
                  <p className="text-muted mt-xs">"When the trap detects a creature in its line of sight, activate"</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </WizardStep>
  );
};

export default Step7Triggers;