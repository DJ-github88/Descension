import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import {
  FaPersonWalkingArrowRight,
  FaGrip,
  FaPersonFalling,
  FaBed,
  FaPersonCircleQuestion,
  FaMinus,
  FaPlus,
  FaCircleXmark
} from 'react-icons/fa6';

// Import stat data
import { BUFF_DEBUFF_STAT_MODIFIERS } from '../../core/data/statModifier';

// Pathfinder styles imported via main.css

// Control types with their icons and descriptions
export const CONTROL_TYPES = {
  FORCED_MOVEMENT: {
    id: 'forced_movement',
    name: 'Forced Movement',
    icon: 'ability_warrior_charge',
    description: 'Push, pull, or relocate targets',
    effectIcon: FaPersonWalkingArrowRight
  },
  RESTRAINT: {
    id: 'restraint',
    name: 'Restraint',
    icon: 'spell_nature_stranglevines',
    description: 'Immobilize or restrict movement',
    effectIcon: FaGrip
  },
  KNOCKDOWN: {
    id: 'knockdown',
    name: 'Knockdown',
    icon: 'ability_warrior_groundingstand',
    description: 'Knock targets prone or off balance',
    effectIcon: FaPersonFalling
  },
  INCAPACITATION: {
    id: 'incapacitation',
    name: 'Incapacitation',
    icon: 'spell_shadow_possession',
    description: 'Sleep, stun, or paralyze targets',
    effectIcon: FaBed
  },
  MIND_CONTROL: {
    id: 'mind_control',
    name: 'Mind Control',
    icon: 'spell_shadow_mindtwisting',
    description: 'Control or influence target behavior',
    effectIcon: FaPersonCircleQuestion
  },
  RESTRICTION: {
    id: 'restriction',
    name: 'Action Restriction',
    icon: 'spell_shadow_impphaseshift',
    description: 'Prevent specific actions or damage types',
    effectIcon: FaCircleXmark
  }
};

// Saving throw types
const SAVING_THROW_TYPES = [
  { id: 'strength', name: 'Strength', icon: 'spell_nature_strength' },
  { id: 'agility', name: 'Agility', icon: 'ability_rogue_sprint' },
  { id: 'constitution', name: 'Constitution', icon: 'spell_holy_devotionaura' },
  { id: 'intelligence', name: 'Intelligence', icon: 'spell_shadow_brainwash' },
  { id: 'spirit', name: 'Spirit', icon: 'spell_holy_divinespirit' },
  { id: 'charisma', name: 'Charisma', icon: 'spell_holy_powerinfusion' }
];

// Duration types
const DURATION_TYPES = [
  { id: 'instant', name: 'Instantaneous', description: 'Effect happens immediately with no duration', icon: 'inv_misc_pocketwatch_01' },
  { id: 'rounds', name: 'Rounds', description: 'Combat rounds (approx. 6 seconds each)', icon: 'inv_misc_pocketwatch_01' },
  { id: 'minutes', name: 'Minutes', description: 'Real-time minutes', icon: 'inv_misc_pocketwatch_02' },
  { id: 'hours', name: 'Hours', description: 'Real-time hours', icon: 'inv_misc_pocketwatch_03' }
];

// Difficulty levels
const DIFFICULTY_LEVELS = [
  { id: 'easy', name: 'Easy (DC 10)', description: 'Simple task, most should succeed' },
  { id: 'moderate', name: 'Moderate (DC 15)', description: 'Challenging, requires some skill' },
  { id: 'hard', name: 'Hard (DC 20)', description: 'Difficult, requires expertise' },
  { id: 'very_hard', name: 'Very Hard (DC 25)', description: 'Extremely difficult, masters may fail' }
];

// Target types
const TARGET_TYPES = [
  { id: 'single', name: 'Single Target', icon: 'spell_shadow_soulfeast', description: 'Affects one creature' },
  { id: 'multiple', name: 'Multiple Targets', icon: 'spell_holy_prayerofhealing', description: 'Affects several creatures' },
  { id: 'area', name: 'Area Effect', icon: 'spell_fire_flamestrike', description: 'Affects all creatures in an area' }
];

// Forced movement types
const FORCED_MOVEMENT_TYPES = [
  { id: 'push', name: 'Push', icon: 'ability_warrior_shockwave', description: 'Move the target away from the caster, potentially knocking them prone or disrupting their concentration.' },
  { id: 'pull', name: 'Pull', icon: 'ability_hunter_harpoon', description: 'Move the target toward the caster, potentially pulling them into melee range or disrupting their positioning.' },
  { id: 'slide', name: 'Slide', icon: 'ability_rogue_sprint', description: 'Move the target in any direction, potentially repositioning them or creating an opening for allies.' },
  { id: 'teleport', name: 'Teleport', icon: 'spell_arcane_portalironforge', description: 'Instantaneously relocate the target to a location of the caster\'s choice, potentially catching them off guard or repositioning them for strategic advantage.' }
];

// Restraint types
const RESTRAINT_TYPES = [
  { id: 'bind', name: 'Binding', icon: 'spell_nature_stranglevines', description: 'Physically restrain the target, preventing them from moving or taking reactions.' },
  { id: 'slow', name: 'Slowing', icon: 'spell_frost_freezingbreath', description: 'Reduce the target\'s movement speed, making it harder for them to move or react.' },
  { id: 'snare', name: 'Snare', icon: 'ability_ensnare', description: 'Root the target in place, preventing them from moving or taking reactions.' },
  { id: 'web', name: 'Web', icon: 'spell_nature_web', description: 'Entangle multiple targets, slowing their movement and making it harder for them to react.' }
];

// Knockdown effects
const KNOCKDOWN_TYPES = [
  { id: 'trip', name: 'Trip', icon: 'ability_hunter_triplekill', description: 'Knock the target prone, leaving them vulnerable to attacks and potentially disrupting their concentration.' },
  { id: 'stagger', name: 'Stagger', icon: 'ability_warrior_trauma', description: 'Leave the target reeling, potentially disrupting their concentration or making them more vulnerable to attacks.' },
  { id: 'repel', name: 'Repel', icon: 'ability_warrior_shockwave', description: 'Knock the target back and down, potentially creating distance or disrupting their positioning.' },
  { id: 'throw', name: 'Throw', icon: 'inv_throwingaxe_01', description: 'Launch the target into the air, potentially knocking them prone or disrupting their concentration.' }
];

// Incapacitation types
const INCAPACITATION_TYPES = [
  { id: 'sleep', name: 'Sleep', icon: 'spell_holy_mindvision', description: 'Put the target to sleep, making them unable to act or react.' },
  { id: 'stun', name: 'Stun', icon: 'ability_priest_psychicscream', description: 'Leave the target stunned, potentially disrupting their concentration or making them more vulnerable to attacks.' },
  { id: 'paralyze', name: 'Paralyze', icon: 'spell_shadow_possession', description: 'Paralyze the target, preventing them from moving or taking reactions.' },
  { id: 'daze', name: 'Daze', icon: 'spell_shadow_fumble', description: 'Leave the target dazed, potentially disrupting their concentration or making them more vulnerable to attacks.' }
];

// Mind control types
const MIND_CONTROL_TYPES = [
  { id: 'command', name: 'Command', icon: 'spell_shadow_charm', description: 'Issue a single command to the target, potentially influencing their behavior or actions.' },
  { id: 'confuse', name: 'Confuse', icon: 'spell_shadow_mindsteal', description: 'Confuse the target, potentially disrupting their concentration or making them more vulnerable to attacks.' },
  { id: 'dominate', name: 'Dominate', icon: 'spell_shadow_mindtwisting', description: 'Take complete control of the target, potentially influencing their behavior or actions.' },
  { id: 'fear', name: 'Fear', icon: 'spell_shadow_possession', description: 'Instill fear in the target, potentially causing them to flee or become more vulnerable to attacks.' }
];

// Primary restriction categories
const PRIMARY_RESTRICTION_TYPES = [
  { id: 'actions', name: 'Actions', icon: 'ability_warrior_battleshout', description: 'Prevent the target from taking actions.' },
  { id: 'reactions', name: 'Reactions', icon: 'ability_warrior_challange', description: 'Prevent the target from taking reactions.' },
  { id: 'attack_types', name: 'Attack Types', icon: 'ability_warrior_disarm', description: 'Prevent specific types of attacks.' },
  { id: 'damage_types', name: 'Damage Types', icon: 'spell_fire_flamebolt', description: 'Prevent specific types of damage.' }
];

// Action restriction types
const ACTION_RESTRICTION_TYPES = [
  { id: 'melee_attacks', name: 'Melee Attacks', icon: 'ability_warrior_disarm', description: 'Prevent the target from making melee attacks.' },
  { id: 'ranged_attacks', name: 'Ranged Attacks', icon: 'ability_hunter_snipershot', description: 'Prevent the target from making ranged attacks.' },
  { id: 'spellcasting', name: 'Spellcasting', icon: 'spell_shadow_detectlesserinvisibility', description: 'Prevent the target from casting spells.' },
  { id: 'healing', name: 'Healing', icon: 'spell_holy_holybolt', description: 'Prevent the target from receiving or casting healing effects.' }
];

// Melee damage subtypes
const MELEE_DAMAGE_SUBTYPES = [
  { id: 'bludgeoning_damage', name: 'Bludgeoning', icon: 'inv_mace_2h_pvp410_c_01', description: 'Restrict bludgeoning damage from hammers, clubs, etc.' },
  { id: 'piercing_damage', name: 'Piercing', icon: 'inv_sword_31', description: 'Restrict piercing damage from spears, arrows, etc.' },
  { id: 'slashing_damage', name: 'Slashing', icon: 'ability_warrior_cleave', description: 'Restrict slashing damage from swords, axes, etc.' }
];

// Magic damage subtypes - All D&D 5e damage types
const MAGIC_DAMAGE_SUBTYPES = [
  { id: 'acid_damage', name: 'Acid', icon: 'ability_creature_poison_03', description: 'Restrict acid damage specifically.' },
  { id: 'cold_damage', name: 'Cold', icon: 'spell_frost_frostbolt02', description: 'Restrict cold/frost damage specifically.' },
  { id: 'fire_damage', name: 'Fire', icon: 'spell_fire_flamebolt', description: 'Restrict fire damage specifically.' },
  { id: 'force_damage', name: 'Force', icon: 'spell_arcane_blast', description: 'Restrict force damage specifically.' },
  { id: 'lightning_damage', name: 'Lightning', icon: 'spell_nature_lightning', description: 'Restrict lightning/electric damage specifically.' },
  { id: 'necrotic_damage', name: 'Necrotic', icon: 'spell_shadow_shadowbolt', description: 'Restrict necrotic/shadow damage specifically.' },
  { id: 'poison_damage', name: 'Poison', icon: 'ability_rogue_poisonousblades', description: 'Restrict poison damage specifically.' },
  { id: 'psychic_damage', name: 'Psychic', icon: 'spell_shadow_mindtwisting', description: 'Restrict psychic damage specifically.' },
  { id: 'radiant_damage', name: 'Radiant', icon: 'spell_holy_holybolt', description: 'Restrict radiant/holy damage specifically.' },
  { id: 'thunder_damage', name: 'Thunder', icon: 'spell_nature_thunderclap', description: 'Restrict thunder/sonic damage specifically.' },
  { id: 'arcane_damage', name: 'Arcane', icon: 'spell_arcane_arcane01', description: 'Restrict arcane damage specifically.' },
  { id: 'void_damage', name: 'Void', icon: 'spell_shadow_seedofdestruction', description: 'Restrict void/chaos damage specifically.' },
  { id: 'healing_effect', name: 'Healing', icon: 'spell_holy_sealofsacrifice', description: 'Restrict healing effects specifically.' }
];

// Damage type restriction types (top level)
const DAMAGE_RESTRICTION_TYPES = [
  { id: 'melee_damage', name: 'Melee Damage', icon: 'ability_warrior_savageblow', description: 'Restrict all physical melee damage (bludgeoning, piercing, slashing).', hasSubtypes: true, subtypes: MELEE_DAMAGE_SUBTYPES },
  { id: 'magic_damage', name: 'Magic Damage', icon: 'spell_arcane_blast', description: 'Restrict all magical damage (fire, frost, arcane, etc.).', hasSubtypes: true, subtypes: MAGIC_DAMAGE_SUBTYPES },
  { id: 'healing_category', name: 'Healing', icon: 'spell_holy_sealofsacrifice', description: 'Restrict healing effects.', hasSubtypes: false }
];

const ControlEffects = ({ state, dispatch, actionCreators, getDefaultFormula, onChange }) => {
  // Initialize with default control type from state or 'forced_movement'
  const [activeControlType, setActiveControlType] = useState(
    state.controlConfig?.controlType || 'forced_movement'
  );

  // Initialize with default control effect from state or first effect for the active type
  const [activeEffect, setActiveEffect] = useState(null);

  // State for hierarchical restriction selection
  const [activeRestrictionCategory, setActiveRestrictionCategory] = useState(null);
  const [activeRestrictionType, setActiveRestrictionType] = useState(null);
  const [activeRestrictionSubtype, setActiveRestrictionSubtype] = useState(null);
  const [showRestrictionSubtypes, setShowRestrictionSubtypes] = useState(false);

  const [effectPreview, setEffectPreview] = useState(null);

  // Configuration popup state
  const [configPopupOpen, setConfigPopupOpen] = useState(false);
  const [selectedEffectForPopupConfig, setSelectedEffectForPopupConfig] = useState(null);

  // Get control configuration from state or use defaults
  const [controlConfig, setControlConfig] = useState({
    controlType: '',
    effects: [], // Array of effects with their individual configurations
    duration: null, // Changed to null to indicate optional duration
    durationUnit: 'rounds',
    savingThrow: null, // Changed to null to indicate optional saving throw
    savingThrowType: 'strength',
    difficultyClass: 15,
    concentration: false,
    instant: false, // New instant effect option
    distance: 10, // for forced movement
    // other configs as needed
  });

  // State for the currently selected effect for configuration
  const [selectedEffectForConfig, setSelectedEffectForConfig] = useState(null);

  // Get effect types based on the current control type and restriction category
  const getEffectTypes = (controlType, restrictionCategory = null) => {
    // For non-restriction control types, return the appropriate effect types
    if (controlType !== 'restriction') {
      switch (controlType) {
        case 'forced_movement': return FORCED_MOVEMENT_TYPES;
        case 'restraint': return RESTRAINT_TYPES;
        case 'knockdown': return KNOCKDOWN_TYPES;
        case 'incapacitation': return INCAPACITATION_TYPES;
        case 'mind_control': return MIND_CONTROL_TYPES;
        default: return [];
      }
    }

    // For restriction control type, handle the hierarchical structure
    if (!restrictionCategory) {
      // If no category is selected, return the primary restriction types
      return PRIMARY_RESTRICTION_TYPES;
    }

    // Return the appropriate restriction types based on the selected category
    switch (restrictionCategory) {
      case 'actions':
      case 'reactions':
        // These are simple toggles, no subtypes
        return [];
      case 'attack_types':
        return ACTION_RESTRICTION_TYPES;
      case 'damage_types':
        return DAMAGE_RESTRICTION_TYPES;
      default:
        return [];
    }
  };

  // Get subtypes for a specific restriction type
  const getRestrictionSubtypes = (restrictionType) => {
    if (!restrictionType) return [];

    // Find the restriction type in the damage restriction types
    const damageType = DAMAGE_RESTRICTION_TYPES.find(type => type.id === restrictionType);
    if (damageType && damageType.hasSubtypes) {
      return damageType.subtypes;
    }

    return [];
  };

  // Effect to update effect type when control type changes
  useEffect(() => {
    // Reset restriction category when control type changes
    if (activeControlType === 'restriction') {
      setActiveRestrictionCategory(null);
      setActiveRestrictionType(null);
      setActiveRestrictionSubtype(null);
      setShowRestrictionSubtypes(false);
    } else {
      const effectTypes = getEffectTypes(activeControlType);

      if (effectTypes.length > 0) {
        const newEffectType = effectTypes[0].id;

        // Update effect type in config if the control type changed
        if (activeControlType !== controlConfig.controlType || !controlConfig.effects.length) {
          handleControlConfigChange('controlType', activeControlType);
        }

        // Set the active effect based on the current effect type in config
        const currentEffectType = controlConfig.effects[0]?.id || newEffectType;
        setActiveEffect(currentEffectType);
      }
    }
  }, [activeControlType]);

  // Effect to handle restriction category changes
  useEffect(() => {
    if (activeControlType === 'restriction' && activeRestrictionCategory) {
      // Reset restriction type and subtype when category changes
      setActiveRestrictionType(null);
      setActiveRestrictionSubtype(null);
      setShowRestrictionSubtypes(false);

      // For actions and reactions, we can directly add them as effects
      if (activeRestrictionCategory === 'actions' || activeRestrictionCategory === 'reactions') {
        // Check if this restriction is already in the effects list
        const effectExists = controlConfig.effects.some(effect => effect.id === activeRestrictionCategory);

        if (!effectExists) {
          // Add the restriction as an effect
          const categoryData = PRIMARY_RESTRICTION_TYPES.find(type => type.id === activeRestrictionCategory);
          if (categoryData) {
            handleEffectToggle(activeRestrictionCategory, categoryData);
          }
        }
      }
    }
  }, [activeRestrictionCategory]);

  // Effect to handle restriction type changes
  useEffect(() => {
    if (activeControlType === 'restriction' && activeRestrictionType) {
      // Check if this type has subtypes
      const typeData = DAMAGE_RESTRICTION_TYPES.find(type => type.id === activeRestrictionType);

      if (typeData && typeData.hasSubtypes) {
        // Show subtypes selection
        setShowRestrictionSubtypes(true);
        setActiveRestrictionSubtype(null);
      } else if (activeRestrictionType === 'healing_category') {
        // Handle healing category specially
        setShowRestrictionSubtypes(false);
        // Don't automatically add anything - user will select from the healing options
      } else {
        // No subtypes, add directly as an effect
        setShowRestrictionSubtypes(false);

        // Find the type data from the appropriate array
        let effectData;
        if (activeRestrictionCategory === 'attack_types') {
          effectData = ACTION_RESTRICTION_TYPES.find(type => type.id === activeRestrictionType);
        } else if (activeRestrictionCategory === 'damage_types') {
          effectData = DAMAGE_RESTRICTION_TYPES.find(type => type.id === activeRestrictionType);
        }

        if (effectData) {
          // Check if already in effects list
          const effectExists = controlConfig.effects.some(effect => effect.id === activeRestrictionType);

          if (!effectExists) {
            // Add the restriction as an effect
            handleEffectToggle(activeRestrictionType, effectData);
          }
        }
      }
    }
  }, [activeRestrictionType]);

  // We no longer need this effect since we're handling subtype selection directly in the UI
  // by calling handleEffectToggle when a subtype is clicked

  // Clean up handleControlConfigChange to be simpler and more reliable
  const handleControlConfigChange = (key, value) => {
    console.log(`Changing ${key} from ${controlConfig[key]} to ${value}`);

    setControlConfig(prev => {
      const updated = {
        ...prev,
        [key]: value
      };

      // If we're updating the parent component
      if (onChange) {
        onChange(updated);
      }

      // Also update the global state if dispatch is available
      if (dispatch && actionCreators.updateControlConfig) {
        dispatch(actionCreators.updateControlConfig(updated));
      }

      return updated;
    });
  };

  // Handle control type changes without resetting selected effects
  const handleControlTypeChange = (controlTypeId) => {
    setActiveControlType(controlTypeId);

    // Update the control type in the local state
    handleControlConfigChange('controlType', controlTypeId);

    // Also update the parent component's state directly
    if (dispatch && actionCreators.updateControlConfig) {
      dispatch(actionCreators.updateControlConfig({
        ...controlConfig,
        controlType: controlTypeId
      }));
    }
  };

  // Simplified function for toggling duration on/off
  const toggleDuration = () => {
    const newValue = controlConfig.duration === null ? 1 : null;
    handleControlConfigChange('duration', newValue);

    // If turning off duration, also turn off concentration
    if (newValue === null) {
      handleControlConfigChange('concentration', false);
    }
  };

  // Simplified function for toggling saving throw on/off
  const toggleSavingThrow = () => {
    const newValue = controlConfig.savingThrow === null ? 'strength' : null;
    handleControlConfigChange('savingThrow', newValue);
  };

  // Function to handle saving throw type changes while maintaining enabled state
  const handleSavingThrowTypeChange = (newType) => {
    console.log('Changing saving throw type to:', newType);
    console.log('Current savingThrow state:', controlConfig.savingThrow);

    // Update both properties in a single call to ensure consistency
    setControlConfig(prev => {
      const updated = {
        ...prev,
        savingThrowType: newType,
        // Always enable saving throws when changing type (auto-enable)
        savingThrow: newType
      };

      console.log('Updated control config:', updated);

      // Update parent component
      if (onChange) {
        onChange(updated);
      }

      // Update global state
      if (dispatch && actionCreators.updateControlConfig) {
        dispatch(actionCreators.updateControlConfig(updated));
      }

      return updated;
    });
  };

  // Function to remove a specific effect
  const handleRemoveEffect = (effectId) => {
    setControlConfig(prev => {
      const updatedEffects = prev.effects.filter(effect => effect.id !== effectId);
      const updatedConfig = {
        ...prev,
        effects: updatedEffects
      };

      // Update the parent component's state directly
      if (onChange) {
        onChange(updatedConfig);
      }

      // Also update the global state if dispatch is available
      if (dispatch && actionCreators.updateControlConfig) {
        dispatch(actionCreators.updateControlConfig(updatedConfig));
      }

      return updatedConfig;
    });
  };

  // Function to clear all effects
  const handleClearAllEffects = () => {
    setControlConfig(prev => {
      const updatedConfig = {
        ...prev,
        effects: []
      };

      // Update the parent component's state directly
      if (onChange) {
        onChange(updatedConfig);
      }

      // Also update the global state if dispatch is available
      if (dispatch && actionCreators.updateControlConfig) {
        dispatch(actionCreators.updateControlConfig(updatedConfig));
      }

      return updatedConfig;
    });
  };

  // Add a new function to add/remove effects
  const handleEffectToggle = (effectId, customEffectData = null) => {
    setControlConfig(prev => {
      // Check if the effect is already in the array
      const effectExists = prev.effects.some(effect => effect.id === effectId);

      let updatedConfig;

      if (effectExists) {
        // Remove the effect
        const updatedEffects = prev.effects.filter(effect => effect.id !== effectId);
        updatedConfig = {
          ...prev,
          effects: updatedEffects
        };

        // If we're removing the currently selected effect for configuration, clear it
        if (selectedEffectForConfig && selectedEffectForConfig.id === effectId) {
          setSelectedEffectForConfig(null);
        }
      } else {
        // Get the effect data - either from the custom data or from the effect types
        let effectData = customEffectData;

        if (!effectData) {
          const effectTypes = getEffectTypes(activeControlType, activeRestrictionCategory);
          effectData = effectTypes.find(effect => effect.id === effectId);
        }

        if (effectData) {
          // Add the effect with its controlType and individual configuration
          const newEffect = {
            id: effectId,
            controlType: activeControlType,
            name: effectData.name,
            icon: effectData.icon,
            description: effectData.description,
            // Individual configuration for this effect
            config: {
              duration: 2, // Default duration
              durationUnit: 'rounds',
              hasDuration: true,
              savingThrow: true,
              savingThrowType: getSavingThrowTypeForEffect(activeControlType, effectId),
              difficultyClass: 15,
              strength: 'moderate',
              customName: effectData.name,
              customDescription: effectData.description,
              instant: isInstantEffect(activeControlType, effectId),
              statModifiers: [], // Add stat modifiers array
              // Add default configurations for specific control types
              ...(activeControlType === 'forced_movement' && {
                distance: 10,
                movementType: 'push',
                movementFlavor: 'force'
              }),
              ...(activeControlType === 'restraint' && {
                restraintType: 'physical'
              }),
              ...(activeControlType === 'mental_control' && {
                controlLevel: 'suggestion',
                mentalApproach: 'subtle'
              }),
              ...(activeControlType === 'battlefield_control' && {
                areaSize: 10,
                areaShape: 'circle'
              }),
              ...(activeControlType === 'incapacitation' && {
                durationType: 'temporary',
                recoveryMethod: 'automatic'
              })
            }
          };

          // For restriction subtypes, add the parent type information
          if (activeControlType === 'restriction' && activeRestrictionType &&
              (effectId.includes('_damage') || effectId.includes('_effect') || ['melee_attacks', 'ranged_attacks', 'spellcasting', 'healing'].includes(effectId))) {
            newEffect.parentType = activeRestrictionType;
            newEffect.category = activeRestrictionCategory;
          }

          updatedConfig = {
            ...prev,
            effects: [...prev.effects, newEffect]
          };

          // Set this as the selected effect for configuration
          setSelectedEffectForConfig(newEffect);

          // Also update specific type fields based on the effect
          if (activeControlType === 'mind_control' && ['command', 'confuse', 'dominate', 'fear'].includes(effectId)) {
            updatedConfig.mindControlType = effectId;
          } else if (activeControlType === 'forced_movement' && ['push', 'pull', 'slide', 'teleport', 'launch'].includes(effectId)) {
            updatedConfig.movementType = effectId;
          } else if (activeControlType === 'restraint' && ['bind', 'slow', 'snare', 'web'].includes(effectId)) {
            updatedConfig.restraintType = effectId;
          } else if (activeControlType === 'knockdown' && ['trip', 'stagger', 'repel', 'slam'].includes(effectId)) {
            updatedConfig.knockdownType = effectId;
          } else if (activeControlType === 'incapacitation' && ['sleep', 'stun', 'paralyze', 'daze'].includes(effectId)) {
            updatedConfig.incapacitationType = effectId;
          } else if (activeControlType === 'restriction') {
            // Handle primary restriction categories
            if (['actions', 'reactions'].includes(effectId)) {
              updatedConfig.primaryRestrictionType = effectId;
            }
            // Handle action restrictions
            else if (['melee_attacks', 'ranged_attacks', 'spellcasting', 'healing'].includes(effectId)) {
              updatedConfig.actionRestrictionType = effectId;
            }
            // Handle top-level damage type restrictions
            else if (['melee_damage', 'magic_damage'].includes(effectId)) {
              updatedConfig.damageRestrictionType = effectId;
            }
            // Handle specific damage subtypes
            else if (effectId.includes('_damage') || effectId === 'healing_effect') {
              updatedConfig.damageSubtypeRestriction = effectId;
            }
          }
        } else {
          updatedConfig = prev;
        }
      }

      // Update the parent component's state directly
      if (onChange) {
        onChange(updatedConfig);
      }

      // Also update the global state if dispatch is available
      if (dispatch && actionCreators.updateControlConfig) {
        dispatch(actionCreators.updateControlConfig(updatedConfig));
      }

      return updatedConfig;
    });
  };

  // Helper function to determine if an effect is instant by default
  const isInstantEffect = (controlType, effectId) => {
    // Forced movement effects are typically instant
    if (controlType === 'forced_movement') {
      return true;
    }

    // Knockdown effects can be instant
    if (controlType === 'knockdown' && ['trip', 'slam'].includes(effectId)) {
      return true;
    }

    // Restriction effects are typically not instant (they have duration)
    if (controlType === 'restriction') {
      return false;
    }

    // All other effects have duration by default
    return false;
  };

  // Helper function to get appropriate saving throw type based on effect
  const getSavingThrowTypeForEffect = (controlType, effectId) => {
    switch (controlType) {
      case 'forced_movement':
        return 'strength';
      case 'restraint':
        return 'dexterity';
      case 'knockdown':
        return 'dexterity';
      case 'incapacitation':
        return 'constitution';
      case 'mind_control':
        return 'wisdom';
      case 'restriction':
        // Different saving throws based on restriction type
        if (['melee_attacks', 'ranged_attacks', 'melee_damage'].includes(effectId)) {
          return 'strength';
        } else if (['spellcasting', 'magic_damage', 'arcane_damage', 'force_damage'].includes(effectId)) {
          return 'intelligence';
        } else if (['healing', 'healing_effect', 'radiant_damage'].includes(effectId)) {
          return 'wisdom';
        } else if (['physical_damage', 'poison_damage', 'acid_damage', 'necrotic_damage'].includes(effectId)) {
          return 'constitution';
        } else if (['fire_damage', 'lightning_damage', 'thunder_damage'].includes(effectId)) {
          return 'dexterity';
        } else if (['psychic_damage', 'void_damage'].includes(effectId)) {
          return 'charisma';
        } else if (['cold_damage'].includes(effectId)) {
          return 'constitution';
        } else if (['bludgeoning_damage', 'piercing_damage', 'slashing_damage'].includes(effectId)) {
          return 'strength';
        } else {
          return 'dexterity'; // Default for other damage types
        }
      default:
        return 'strength';
    }
  };

  // Function to check if an effect is selected
  const isEffectSelected = (effectId) => {
    return controlConfig.effects.some(effect => effect.id === effectId);
  };

  // Function to select an effect for configuration
  const handleSelectEffectForConfig = (effect) => {
    setSelectedEffectForConfig(effect);
  };

  // Function to update configuration for a specific effect
  const updateEffectConfig = (effectId, configKey, configValue) => {
    setControlConfig(prev => {
      // Find the effect to update
      const updatedEffects = prev.effects.map(effect => {
        if (effect.id === effectId) {
          // Update the specific config property
          return {
            ...effect,
            config: {
              ...effect.config,
              [configKey]: configValue
            }
          };
        }
        return effect;
      });

      const updatedConfig = {
        ...prev,
        effects: updatedEffects
      };

      // Also update the selected effect for configuration if it's the one being modified
      if (selectedEffectForConfig && selectedEffectForConfig.id === effectId) {
        setSelectedEffectForConfig({
          ...selectedEffectForConfig,
          config: {
            ...selectedEffectForConfig.config,
            [configKey]: configValue
          }
        });
      }

      // Also update the popup selected effect if it's the one being modified
      if (selectedEffectForPopupConfig && selectedEffectForPopupConfig.id === effectId) {
        setSelectedEffectForPopupConfig({
          ...selectedEffectForPopupConfig,
          config: {
            ...selectedEffectForPopupConfig.config,
            [configKey]: configValue
          }
        });
      }

      // Update the parent component's state directly
      if (onChange) {
        onChange(updatedConfig);
      }

      // Also update the global state if dispatch is available
      if (dispatch && actionCreators.updateControlConfig) {
        dispatch(actionCreators.updateControlConfig(updatedConfig));
      }

      return updatedConfig;
    });
  };

  // Get WoW-style icon URL
  const getIconUrl = (iconName) => {
    if (!iconName) return '';
    return `https://wow.zamimg.com/images/wow/icons/large/${iconName}.jpg`;
  };

  // Get stat modifiers by category
  const getStatModifiersByCategory = (category) => {
    if (!BUFF_DEBUFF_STAT_MODIFIERS) {
      return [];
    }
    return BUFF_DEBUFF_STAT_MODIFIERS.filter(stat => stat.category === category);
  };

  // Stat modifier management functions for effects
  const addStatModifierToEffect = (effectId, stat) => {
    setControlConfig(prev => {
      const updatedEffects = prev.effects.map(effect => {
        if (effect.id === effectId) {
          const existingModifiers = [...(effect.config?.statModifiers || [])];

          // Check if this stat is already added
          if (!existingModifiers.some(mod => mod.id === stat.id)) {
            existingModifiers.push({
              ...stat,
              magnitude: 2,
              magnitudeType: 'flat'
            });

            return {
              ...effect,
              config: {
                ...effect.config,
                statModifiers: existingModifiers
              }
            };
          }
        }
        return effect;
      });

      const updatedConfig = { ...prev, effects: updatedEffects };

      // Update parent state
      if (onChange) onChange(updatedConfig);
      if (dispatch && actionCreators.updateControlConfig) {
        dispatch(actionCreators.updateControlConfig(updatedConfig));
      }

      return updatedConfig;
    });
  };

  const removeStatModifierFromEffect = (effectId, statId) => {
    setControlConfig(prev => {
      const updatedEffects = prev.effects.map(effect => {
        if (effect.id === effectId) {
          const updatedModifiers = (effect.config?.statModifiers || []).filter(mod => mod.id !== statId);
          return {
            ...effect,
            config: {
              ...effect.config,
              statModifiers: updatedModifiers
            }
          };
        }
        return effect;
      });

      const updatedConfig = { ...prev, effects: updatedEffects };

      // Update parent state
      if (onChange) onChange(updatedConfig);
      if (dispatch && actionCreators.updateControlConfig) {
        dispatch(actionCreators.updateControlConfig(updatedConfig));
      }

      return updatedConfig;
    });
  };

  const updateStatModifierValue = (effectId, statId, magnitude) => {
    setControlConfig(prev => {
      const updatedEffects = prev.effects.map(effect => {
        if (effect.id === effectId) {
          const updatedModifiers = (effect.config?.statModifiers || []).map(mod => {
            if (mod.id === statId) {
              return { ...mod, magnitude };
            }
            return mod;
          });

          return {
            ...effect,
            config: {
              ...effect.config,
              statModifiers: updatedModifiers
            }
          };
        }
        return effect;
      });

      const updatedConfig = { ...prev, effects: updatedEffects };

      // Update parent state
      if (onChange) onChange(updatedConfig);
      if (dispatch && actionCreators.updateControlConfig) {
        dispatch(actionCreators.updateControlConfig(updatedConfig));
      }

      return updatedConfig;
    });
  };

  const updateStatModifierType = (effectId, statId, magnitudeType) => {
    setControlConfig(prev => {
      const updatedEffects = prev.effects.map(effect => {
        if (effect.id === effectId) {
          const updatedModifiers = (effect.config?.statModifiers || []).map(mod => {
            if (mod.id === statId) {
              return { ...mod, magnitudeType };
            }
            return mod;
          });

          return {
            ...effect,
            config: {
              ...effect.config,
              statModifiers: updatedModifiers
            }
          };
        }
        return effect;
      });

      const updatedConfig = { ...prev, effects: updatedEffects };

      // Update parent state
      if (onChange) onChange(updatedConfig);
      if (dispatch && actionCreators.updateControlConfig) {
        dispatch(actionCreators.updateControlConfig(updatedConfig));
      }

      return updatedConfig;
    });
  };

  // Format control type for display
  const formatControlType = (type) => {
    if (!type) return '';

    // Handle specific control types
    switch (type) {
      case 'forced_movement': return 'Forced Movement';
      case 'mind_control': return 'Mind Control';
      default:
        // Generic formatting for other types
        return type.split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
    }
  };

  // Get flavor text based on control type
  const getControlFlavorText = (type) => {
    if (!type) return '';

    switch (type) {
      case 'forced_movement': return '"Your magic manipulates the physical position of your foes."';
      case 'restraint': return '"Magical bonds restrict your enemy\'s movement."';
      case 'knockdown': return '"Your spell sends enemies tumbling to the ground."';
      case 'incapacitation': return '"Your magic renders foes helpless and vulnerable."';
      case 'mind_control': return '"Your spell bends the will of others to your command."';
      case 'restriction': return '"Your magic prevents specific actions or nullifies certain damage types."';
      default: return '"Your magic exerts control in mysterious ways."';
    }
  };

  // Format saving throw type for display
  const formatSavingThrow = (type) => {
    if (!type) return '';

    switch (type) {
      case 'str': return 'Strength';
      case 'dex': return 'Dexterity';
      case 'con': return 'Constitution';
      case 'int': return 'Intelligence';
      case 'wis': return 'Wisdom';
      case 'cha': return 'Charisma';
      default: return type.charAt(0).toUpperCase() + type.slice(1);
    }
  };



  // Set effect preview
  const showEffectPreview = (effect) => {
    setEffectPreview(effect);
  };

  // Clear effect preview
  const clearEffectPreview = () => {
    setEffectPreview(null);
  };

  // Render the control type selection - simplified without hover tooltips
  const renderControlTypeSelection = () => {
    return (
      <div className="control-effects-grid">
        {Object.values(CONTROL_TYPES).map((controlType) => (
          <div
            key={controlType.id}
            className={`control-effect-card ${activeControlType === controlType.id ? 'selected' : ''}`}
            onClick={() => handleControlTypeChange(controlType.id)}
          >
            <div className="control-effect-header">
              <img
                src={getIconUrl(controlType.icon)}
                alt={controlType.name}
                className="control-effect-icon"
              />
              <div className="control-effect-info">
                <h6>{controlType.name}</h6>
                <p>{controlType.description}</p>
              </div>
            </div>
            {activeControlType === controlType.id && (
              <div className="control-effect-selected">
                <span className="control-effect-checkmark">✓</span>
              </div>
            )}
          </div>
        ))}
      </div>
    );
  };

  // Render effect type selection based on control type
  const renderEffectTypeSelection = () => {
    // For restriction type, we need to handle the hierarchical selection
    if (activeControlType === 'restriction') {
      return renderRestrictionSelection();
    }

    // For other control types, use the standard selection
    const effectTypes = getEffectTypes(activeControlType);

    if (!effectTypes.length) {
      return null;
    }

    return (
      <div className="section">
        <h3>
          {`${CONTROL_TYPES[activeControlType.toUpperCase()]?.name || 'Effect'} Type`}
        </h3>

        <div className="control-effects-grid">
          {effectTypes.map(type => (
            <div
              key={type.id}
              className={`control-effect-card ${isEffectSelected(type.id) ? 'selected' : ''}`}
              onClick={() => handleEffectToggle(type.id)}
            >
              <div className="control-effect-header">
                <img
                  src={getIconUrl(type.icon)}
                  alt={type.name}
                  className="control-effect-icon"
                />
                <div className="control-effect-info">
                  <h6>{type.name}</h6>
                  <p>{type.description}</p>
                </div>
              </div>
              {isEffectSelected(type.id) && (
                <div className="control-effect-selected">
                  <span className="control-effect-checkmark">✓</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render the hierarchical restriction selection
  const renderRestrictionSelection = () => {
    // If no category is selected, show the primary categories
    if (!activeRestrictionCategory) {
      const primaryTypes = PRIMARY_RESTRICTION_TYPES;

      return (
        <div className="section">
          <h3>Restriction Category</h3>
          <p>Select what you want to restrict</p>

          <div className="stat-cards-grid">
            {primaryTypes.map(type => (
              <div
                key={type.id}
                className={`stat-card ${activeRestrictionCategory === type.id ? 'selected' : ''}`}
                onClick={() => setActiveRestrictionCategory(type.id)}
              >
                <img
                  src={getIconUrl(type.icon)}
                  alt={type.name}
                  className="stat-icon"
                />
                <div className="stat-name">{type.name}</div>
                {isEffectSelected(type.id) && (
                  <div className="stat-indicator">✓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // If category is actions or reactions, they're already added as effects
    if (activeRestrictionCategory === 'actions' || activeRestrictionCategory === 'reactions') {
      return null;
    }

    // If category is selected but no type is selected, show the types for that category
    if (!activeRestrictionType) {
      const restrictionTypes = getEffectTypes('restriction', activeRestrictionCategory);

      return (
        <div className="section">
          <h3>{getRestrictionCategoryName(activeRestrictionCategory)}</h3>
          <div className="breadcrumb">
            <span onClick={() => setActiveRestrictionCategory(null)} className="breadcrumb-link">Categories</span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">{getRestrictionCategoryName(activeRestrictionCategory)}</span>
          </div>

          <div className="stat-cards-grid">
            {restrictionTypes.map(type => (
              <div
                key={type.id}
                className={`stat-card ${activeRestrictionType === type.id ? 'selected' : ''}`}
                onClick={() => setActiveRestrictionType(type.id)}

              >
                <img
                  src={getIconUrl(type.icon)}
                  alt={type.name}
                  className="stat-icon"
                />
                <div className="stat-name">{type.name}</div>
                {type.hasSubtypes && <div className="stat-has-subtypes">+</div>}
                {isEffectSelected(type.id) && (
                  <div className="stat-indicator">✓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // If type is selected and it has subtypes, show the subtypes
    if (showRestrictionSubtypes) {
      const subtypes = getRestrictionSubtypes(activeRestrictionType);

      return (
        <div className="section">
          <h3>{getRestrictionTypeName(activeRestrictionType)} Subtypes</h3>
          <p>Select multiple damage types to restrict (click to toggle)</p>
          <div className="breadcrumb">
            <span onClick={() => setActiveRestrictionCategory(null)} className="breadcrumb-link">Categories</span>
            <span className="breadcrumb-separator">›</span>
            <span onClick={() => {
              setActiveRestrictionType(null);
              setShowRestrictionSubtypes(false);
            }} className="breadcrumb-link">{getRestrictionCategoryName(activeRestrictionCategory)}</span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">{getRestrictionTypeName(activeRestrictionType)}</span>
          </div>

          <div className="stat-cards-grid">
            {subtypes.map(subtype => (
              <div
                key={subtype.id}
                className={`stat-card ${isEffectSelected(subtype.id) ? 'selected' : ''}`}
                onClick={() => handleEffectToggle(subtype.id, subtype)}

              >
                <img
                  src={getIconUrl(subtype.icon)}
                  alt={subtype.name}
                  className="stat-icon"
                />
                <div className="stat-name">{subtype.name}</div>
                {isEffectSelected(subtype.id) && (
                  <div className="stat-indicator">✓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Handle the healing category specifically
    if (activeRestrictionType === 'healing_category') {
      return (
        <div className="section">
          <h3>Healing Restriction</h3>
          <div className="breadcrumb">
            <span onClick={() => setActiveRestrictionCategory(null)} className="breadcrumb-link">Categories</span>
            <span className="breadcrumb-separator">›</span>
            <span onClick={() => {
              setActiveRestrictionType(null);
            }} className="breadcrumb-link">{getRestrictionCategoryName(activeRestrictionCategory)}</span>
            <span className="breadcrumb-separator">›</span>
            <span className="breadcrumb-current">Healing</span>
          </div>

          <div className="stat-cards-grid">
            <div
              className={`stat-card ${isEffectSelected('healing_effect') ? 'selected' : ''}`}
              onClick={() => handleEffectToggle('healing_effect', {
                id: 'healing_effect',
                name: 'Healing',
                icon: 'spell_holy_sealofsacrifice',
                description: 'Restrict healing effects specifically.'
              })}

            >
              <img
                src={getIconUrl('spell_holy_sealofsacrifice')}
                alt="Healing"
                className="stat-icon"
              />
              <div className="stat-name">Healing</div>
              {isEffectSelected('healing_effect') && (
                <div className="stat-indicator">✓</div>
              )}
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  // Helper function to get the name of a restriction category
  const getRestrictionCategoryName = (categoryId) => {
    const category = PRIMARY_RESTRICTION_TYPES.find(cat => cat.id === categoryId);
    return category ? category.name : 'Unknown Category';
  };

  // Helper function to get the name of a restriction type
  const getRestrictionTypeName = (typeId) => {
    // Check in damage restriction types
    const damageType = DAMAGE_RESTRICTION_TYPES.find(type => type.id === typeId);
    if (damageType) return damageType.name;

    // Check in action restriction types
    const actionType = ACTION_RESTRICTION_TYPES.find(type => type.id === typeId);
    if (actionType) return actionType.name;

    return 'Unknown Type';
  };




  // Ensure default values are set for control config properties
  useEffect(() => {
    // Initialize distance if it's not set
    if (controlConfig.distance === undefined || isNaN(controlConfig.distance)) {
      handleControlConfigChange('distance', 10); // Set default distance to 10
    }
  }, [controlConfig.controlType]);

  // Render movement distance settings for forced movement
  const renderForcedMovementSettings = () => {
    if (activeControlType !== 'forced_movement' &&
        activeControlType !== 'knockdown' &&
        controlConfig.effects.some(effect => effect.id === 'repel')) {
      return null;
    }

    // Ensure we have a valid number for distance, defaulting to 10 if not
    const distance = isNaN(parseInt(controlConfig.distance)) ? 10 : parseInt(controlConfig.distance);

    return (
      <div className="buff-config-section">
        <h4 className="section-header">Movement Settings</h4>
        <div className="config-option">
          <label className="effect-option-label">Movement Distance</label>
          <div className="effect-numeric-controls">
            <button
              className="effect-numeric-button"
              onClick={() => handleControlConfigChange('distance', Math.max(5, distance - 5))}
              aria-label="Decrease distance"
            >
              <FaMinus />
            </button>
            <div className="stat-value">
              {distance} ft
            </div>
            <button
              className="effect-numeric-button"
              onClick={() => handleControlConfigChange('distance', Math.min(60, distance + 5))}
              aria-label="Increase distance"
            >
              <FaPlus />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Render duration settings with simpler toggle
  const renderDurationSettings = () => {
    return (
      <div className="buff-config-section">
        <h4 className="section-header">Duration Settings</h4>

        <div className="effect-toggle">
          <div className="effect-toggle-label">
            Has Duration
            <button
              className={`effect-toggle-switch ${controlConfig.duration !== null ? 'active' : ''}`}
              onClick={toggleDuration}
            >
              <span className="effect-toggle-slider"></span>
            </button>
          </div>
        </div>

        {controlConfig.duration !== null && (
          <>
            <div className="effect-numeric-input">
              <label>Duration (rounds)</label>
              <div className="effect-numeric-controls">
                <button
                  className="effect-numeric-button"
                  onClick={() => handleControlConfigChange('duration', Math.max(1, controlConfig.duration - 1))}
                >
                  <FaMinus />
                </button>
                <input
                  type="number"
                  value={controlConfig.duration}
                  onChange={(e) => handleControlConfigChange('duration', Math.max(1, parseInt(e.target.value) || 1))}
                  min="1"
                  max="10"
                />
                <button
                  className="effect-numeric-button"
                  onClick={() => handleControlConfigChange('duration', Math.min(10, controlConfig.duration + 1))}
                >
                  <FaPlus />
                </button>
              </div>
            </div>

            <div className="effect-toggle">
              <div className="effect-toggle-label">
                Requires Concentration
                <button
                  className={`effect-toggle-switch ${controlConfig.concentration ? 'active' : ''}`}
                  onClick={() => handleControlConfigChange('concentration', !controlConfig.concentration)}
                >
                  <span className="effect-toggle-slider"></span>
                </button>
              </div>
              {controlConfig.concentration && (
                <p className="effect-toggle-description">
                  Effect ends if concentration is broken
                </p>
              )}
            </div>
          </>
        )}

        <div className="effect-toggle">
          <div className="effect-toggle-label">
            Instant Effect
            <button
              className={`effect-toggle-switch ${controlConfig.instant ? 'active' : ''}`}
              onClick={() => handleControlConfigChange('instant', !controlConfig.instant)}
            >
              <span className="effect-toggle-slider"></span>
            </button>
          </div>
          {controlConfig.instant && (
            <p className="effect-toggle-description">
              Effect happens immediately, ignoring duration
            </p>
          )}
        </div>
      </div>
    );
  };

  // Render saving throw settings with simpler toggle
  const renderSavingThrowSettings = () => {
    return (
      <div className="buff-config-section">
        <h4 className="section-header">Saving Throw Settings</h4>

        <div className="effect-toggle">
          <div className="effect-toggle-label">
            Requires Saving Throw
            <button
              className={`effect-toggle-switch ${controlConfig.savingThrow !== null ? 'active' : ''}`}
              onClick={toggleSavingThrow}
            >
              <span className="effect-toggle-slider"></span>
            </button>
          </div>
        </div>

        {controlConfig.savingThrow && (
          <>
            <div className="config-option">
              <label className="effect-option-label">Saving Throw Type</label>
              <div className="effect-options tabs">
                {SAVING_THROW_TYPES.map(type => (
                  <button
                    key={type.id}
                    className={`pf-button ${controlConfig.savingThrow === type.id ? 'selected' : ''}`}
                    onClick={() => handleControlConfigChange('savingThrow', type.id)}
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

            <div className="effect-numeric-input">
              <label>Difficulty Class (DC)</label>
              <div className="effect-numeric-controls">
                <button
                  className="effect-numeric-button"
                  onClick={() => handleControlConfigChange('difficultyClass', Math.max(5, controlConfig.difficultyClass - 1))}
                >
                  <FaMinus />
                </button>
                <input
                  type="number"
                  value={controlConfig.difficultyClass}
                  onChange={(e) => handleControlConfigChange('difficultyClass', Math.max(5, parseInt(e.target.value) || 5))}
                  min="5"
                  max="30"
                />
                <button
                  className="effect-numeric-button"
                  onClick={() => handleControlConfigChange('difficultyClass', Math.min(30, controlConfig.difficultyClass + 1))}
                >
                  <FaPlus />
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  // Render the main component
  return (
    <div className="control-effects-container">
      {/* Control Configuration Section */}
      <div className="section">
        <h3>Control Configuration</h3>
        <p>Manipulate battlefield positioning and enemy actions</p>

        {/* Control Configuration Grid */}
        <div className="control-config-grid">
          <div className="config-group">
            <label>Duration</label>
            <div className="duration-config">
              <input
                type="number"
                min="1"
                max="100"
                value={controlConfig.instant ? 0 : (controlConfig.duration || 2)}
                onChange={(e) => {
                  if (controlConfig.instant) return; // Don't allow changes when instant
                  const value = e.target.value;
                  if (value === '' || value === '0') {
                    handleControlConfigChange('duration', 1);
                  } else {
                    const duration = Math.max(1, Math.min(100, parseInt(value) || 1));
                    handleControlConfigChange('duration', duration);
                  }
                }}
                className={`duration-value ${controlConfig.instant ? 'disabled' : ''}`}
                disabled={controlConfig.instant}
                placeholder={controlConfig.instant ? "Instant" : ""}
              />
              <select
                value={controlConfig.instant ? 'instant' : (controlConfig.durationUnit || 'rounds')}
                onChange={(e) => {
                  if (controlConfig.instant) return; // Don't allow changes when instant
                  handleControlConfigChange('durationUnit', e.target.value);
                }}
                className={`duration-unit ${controlConfig.instant ? 'disabled' : ''}`}
                disabled={controlConfig.instant}
              >
                {controlConfig.instant && <option value="instant">Instant</option>}
                <option value="rounds">Rounds</option>
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
                <option value="days">Days</option>
              </select>
            </div>
          </div>

          <div className="config-group">
            <label>Concentration</label>
            <div className="concentration-toggle">
              <button
                type="button"
                className={`toggle-btn ${controlConfig.concentration === true ? 'active' : ''}`}
                onClick={() => handleControlConfigChange('concentration', true)}
              >
                Yes
              </button>
              <button
                type="button"
                className={`toggle-btn ${controlConfig.concentration === false ? 'active' : ''}`}
                onClick={() => handleControlConfigChange('concentration', false)}
              >
                No
              </button>
            </div>
          </div>

          <div className="config-group">
            <label>Difficulty Class (DC)</label>
            <div className="dc-config">
              <input
                type="number"
                min="1"
                max="50"
                value={controlConfig.difficultyClass}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || value === '0') {
                    handleControlConfigChange('difficultyClass', 1);
                  } else {
                    const dc = Math.max(1, Math.min(50, parseInt(value) || 1));
                    handleControlConfigChange('difficultyClass', dc);
                  }
                }}
                className="dc-input"
              />
              <span className="dc-label">DC</span>
            </div>
          </div>

          <div className="config-group">
            <label>Saving Throw</label>
            <select
              value={controlConfig.savingThrowType || 'strength'}
              onChange={(e) => handleSavingThrowTypeChange(e.target.value)}
              className="save-select"
            >
              <option value="strength">Strength</option>
              <option value="agility">Agility</option>
              <option value="constitution">Constitution</option>
              <option value="intelligence">Intelligence</option>
              <option value="spirit">Spirit</option>
              <option value="charisma">Charisma</option>
            </select>
          </div>

          <div className="config-group">
            <label>Instant Effect</label>
            <div className="instant-toggle">
              <button
                type="button"
                className={`toggle-btn ${controlConfig.instant === true ? 'active' : ''}`}
                onClick={() => handleControlConfigChange('instant', true)}
              >
                Yes
              </button>
              <button
                type="button"
                className={`toggle-btn ${controlConfig.instant === false ? 'active' : ''}`}
                onClick={() => handleControlConfigChange('instant', false)}
              >
                No
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Available Effects Section */}
      <div className="section">
        <h4>Available Effects</h4>

        {/* Control Category Selection */}
        <div className="control-category-buttons">
          {Object.values(CONTROL_TYPES).map(type => (
            <button
              key={type.id}
              className={`control-category-btn ${activeControlType === type.id ? 'selected' : ''}`}
              onClick={() => handleControlTypeChange(type.id)}
            >
              <img
                src={getIconUrl(type.icon)}
                alt={type.name}
                className="control-category-btn-icon"
              />
              <span>{type.name}</span>
            </button>
          ))}
        </div>

        {/* Selected Effects Section - Moved up here */}
        {controlConfig.effects && controlConfig.effects.length > 0 && (
          <div className="selected-stats">
            <h4>Selected Effects ({controlConfig.effects.length})</h4>
            <div className="selected-effects-grid">
              {controlConfig.effects.map(effect => (
                <div className="selected-effect-card" key={effect.id}>
                  <div className="effect-card-header">
                    <img src={getIconUrl(effect.icon)} alt={effect.config?.customName || effect.name} className="effect-card-icon" />
                    <div className="effect-card-title">{effect.config?.customName || effect.name}</div>
                    <button
                      className="effect-configure-btn"
                      onClick={() => {
                        setSelectedEffectForPopupConfig(effect);
                        setConfigPopupOpen(true);
                      }}
                      title="Configure effect"
                    >
                      <i className="fas fa-cog"></i>
                    </button>
                    <button
                      className="effect-remove-btn"
                      onClick={() => handleRemoveEffect(effect.id)}
                      title="Remove effect"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  </div>
                  <div className="effect-card-description">
                    {effect.config?.customDescription || effect.description}
                  </div>
                  <div className="effect-card-potency">
                    {(() => {
                      const details = [];

                      // Add type-specific configuration details
                      if (effect.controlType === 'forced_movement') {
                        if (effect.config?.distance) {
                          details.push(`${effect.config.distance} ft`);
                        }
                        if (effect.config?.movementType && effect.config.movementType !== 'push') {
                          details.push(effect.config.movementType);
                        }
                        if (effect.config?.movementFlavor && effect.config.movementFlavor !== 'force') {
                          details.push(effect.config.movementFlavor);
                        }
                      } else if (effect.controlType === 'restraint') {
                        if (effect.config?.restraintType && effect.config.restraintType !== 'physical') {
                          details.push(effect.config.restraintType);
                        }
                        // Note: DC is handled by main control configuration
                      } else if (effect.controlType === 'mental_control') {
                        if (effect.config?.controlLevel) {
                          details.push(effect.config.controlLevel);
                        }
                        if (effect.config?.mentalApproach && effect.config.mentalApproach !== 'subtle') {
                          details.push(effect.config.mentalApproach);
                        }
                      } else if (effect.controlType === 'battlefield_control') {
                        if (effect.config?.areaSize) {
                          details.push(`${effect.config.areaSize} ft`);
                        }
                        if (effect.config?.areaShape && effect.config.areaShape !== 'circle') {
                          details.push(effect.config.areaShape);
                        }
                      } else if (effect.controlType === 'incapacitation') {
                        if (effect.config?.durationType && effect.config.durationType !== 'temporary') {
                          details.push(effect.config.durationType);
                        }
                        if (effect.config?.recoveryMethod && effect.config.recoveryMethod !== 'automatic') {
                          details.push(effect.config.recoveryMethod);
                        }
                      }

                      // Add duration info
                      if (!effect.config?.instant) {
                        details.push(`${effect.config?.duration || 2} ${effect.config?.durationUnit || 'rounds'}`);
                      } else {
                        details.push('Instant');
                      }

                      return details.length > 0 ? details.join(' • ') : 'Default configuration';
                    })()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Effect Type Selection */}
        {renderEffectTypeSelection()}
      </div>

      {/* Enhanced Effect Configuration Popup - Rendered outside spellbook window */}
      {configPopupOpen && selectedEffectForPopupConfig && ReactDOM.createPortal(
        <div className="effect-config-popup-overlay" onClick={() => setConfigPopupOpen(false)}>
          <div className="effect-config-popup enhanced-control-popup" onClick={(e) => e.stopPropagation()}>
            <div className="effect-config-header">
              <img
                src={getIconUrl(selectedEffectForPopupConfig.icon)}
                alt={selectedEffectForPopupConfig.name}
                className="effect-config-icon"
              />
              <h3>Configure Control Effect</h3>
              <button
                className="effect-config-close"
                onClick={() => setConfigPopupOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="effect-config-content">
              {/* Basic Configuration Section */}
              <div className="config-section">
                <h4>Basic Configuration</h4>
                <div className="effect-config-field">
                  <label>Effect Name</label>
                  <input
                    type="text"
                    value={selectedEffectForPopupConfig.config?.customName || selectedEffectForPopupConfig.name}
                    onChange={(e) => updateEffectConfig(selectedEffectForPopupConfig.id, 'customName', e.target.value)}
                    placeholder="Custom effect name"
                  />
                </div>

                <div className="effect-config-field">
                  <label>Effect Description</label>
                  <textarea
                    value={selectedEffectForPopupConfig.config?.customDescription || selectedEffectForPopupConfig.description}
                    onChange={(e) => updateEffectConfig(selectedEffectForPopupConfig.id, 'customDescription', e.target.value)}
                    placeholder="Custom effect description"
                    rows="3"
                  />
                </div>
              </div>

              {/* Context-specific Configuration Section */}
              <div className="config-section">
                <h4>Effect-Specific Settings</h4>

                {selectedEffectForPopupConfig.controlType === 'forced_movement' && (
                  <>
                    <div className="config-row">
                      <div className="effect-config-field">
                        <label>Distance (feet)</label>
                        <input
                          type="number"
                          min="5"
                          max="60"
                          step="5"
                          value={selectedEffectForPopupConfig.config?.distance || 10}
                          onChange={(e) => updateEffectConfig(selectedEffectForPopupConfig.id, 'distance', parseInt(e.target.value) || 10)}
                          placeholder="Distance in feet"
                        />
                      </div>

                      <div className="effect-config-field">
                        <label>Movement Type</label>
                        <select
                          value={selectedEffectForPopupConfig.config?.movementType || 'push'}
                          onChange={(e) => updateEffectConfig(selectedEffectForPopupConfig.id, 'movementType', e.target.value)}
                        >
                          <option value="push">Push Away</option>
                          <option value="pull">Pull Toward</option>
                          <option value="slide">Slide (Any Direction)</option>
                          <option value="teleport">Forced Teleport</option>
                        </select>
                      </div>
                    </div>

                    <div className="effect-config-field">
                      <label>Movement Flavor</label>
                      <select
                        value={selectedEffectForPopupConfig.config?.movementFlavor || 'force'}
                        onChange={(e) => updateEffectConfig(selectedEffectForPopupConfig.id, 'movementFlavor', e.target.value)}
                      >
                        <option value="force">Magical Force</option>
                        <option value="wind">Gust of Wind</option>
                        <option value="gravity">Gravitational Pull</option>
                        <option value="telekinetic">Telekinetic Grip</option>
                        <option value="spectral">Spectral Hands</option>
                      </select>
                    </div>
                  </>
                )}

                {selectedEffectForPopupConfig.controlType === 'incapacitation' && (
                  <div className="config-row">
                    <div className="effect-config-field">
                      <label>Duration Type</label>
                      <select
                        value={selectedEffectForPopupConfig.config?.durationType || 'temporary'}
                        onChange={(e) => updateEffectConfig(selectedEffectForPopupConfig.id, 'durationType', e.target.value)}
                      >
                        <option value="instant">Instantaneous</option>
                        <option value="temporary">Temporary</option>
                        <option value="concentration">Concentration</option>
                        <option value="permanent">Until Dispelled</option>
                      </select>
                    </div>

                    <div className="effect-config-field">
                      <label>Recovery Method</label>
                      <select
                        value={selectedEffectForPopupConfig.config?.recoveryMethod || 'automatic'}
                        onChange={(e) => updateEffectConfig(selectedEffectForPopupConfig.id, 'recoveryMethod', e.target.value)}
                      >
                        <option value="automatic">Automatic (Time)</option>
                        <option value="save_each_turn">Save Each Turn</option>
                        <option value="damage_breaks">Damage Breaks</option>
                        <option value="action_required">Action Required</option>
                      </select>
                    </div>
                  </div>
                )}

                {selectedEffectForPopupConfig.controlType === 'battlefield_control' && (
                  <div className="config-row">
                    <div className="effect-config-field">
                      <label>Area Size (feet)</label>
                      <input
                        type="number"
                        min="5"
                        max="30"
                        step="5"
                        value={selectedEffectForPopupConfig.config?.areaSize || 10}
                        onChange={(e) => updateEffectConfig(selectedEffectForPopupConfig.id, 'areaSize', parseInt(e.target.value) || 10)}
                        placeholder="Area size in feet"
                      />
                    </div>

                    <div className="effect-config-field">
                      <label>Area Shape</label>
                      <select
                        value={selectedEffectForPopupConfig.config?.areaShape || 'circle'}
                        onChange={(e) => updateEffectConfig(selectedEffectForPopupConfig.id, 'areaShape', e.target.value)}
                      >
                        <option value="circle">Circle</option>
                        <option value="square">Square</option>
                        <option value="line">Line</option>
                        <option value="cone">Cone</option>
                      </select>
                    </div>
                  </div>
                )}

                {selectedEffectForPopupConfig.controlType === 'mental_control' && (
                  <>
                    <div className="config-row">
                      <div className="effect-config-field">
                        <label>Control Level</label>
                        <select
                          value={selectedEffectForPopupConfig.config?.controlLevel || 'suggestion'}
                          onChange={(e) => updateEffectConfig(selectedEffectForPopupConfig.id, 'controlLevel', e.target.value)}
                        >
                          <option value="suggestion">Suggestion</option>
                          <option value="compulsion">Compulsion</option>
                          <option value="domination">Domination</option>
                          <option value="possession">Possession</option>
                        </select>
                      </div>

                      <div className="effect-config-field">
                        <label>Mental Approach</label>
                        <select
                          value={selectedEffectForPopupConfig.config?.mentalApproach || 'subtle'}
                          onChange={(e) => updateEffectConfig(selectedEffectForPopupConfig.id, 'mentalApproach', e.target.value)}
                        >
                          <option value="subtle">Subtle Influence</option>
                          <option value="overwhelming">Overwhelming Presence</option>
                          <option value="seductive">Seductive Whispers</option>
                          <option value="terrifying">Terrifying Command</option>
                        </select>
                      </div>
                    </div>
                  </>
                )}

                {selectedEffectForPopupConfig.controlType === 'restraint' && (
                  <div className="effect-config-field">
                    <label>Restraint Type</label>
                    <select
                      value={selectedEffectForPopupConfig.config?.restraintType || 'physical'}
                      onChange={(e) => updateEffectConfig(selectedEffectForPopupConfig.id, 'restraintType', e.target.value)}
                    >
                      <option value="physical">Physical Bonds</option>
                      <option value="magical">Magical Restraint</option>
                      <option value="environmental">Environmental</option>
                      <option value="paralysis">Paralysis</option>
                    </select>
                  </div>
                )}
              </div>
            </div>

            <div className="effect-config-footer">
              <button
                className="effect-config-cancel"
                onClick={() => setConfigPopupOpen(false)}
              >
                Cancel
              </button>
              <button
                className="effect-config-save"
                onClick={() => setConfigPopupOpen(false)}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}


    </div>
  );
};

export default ControlEffects;