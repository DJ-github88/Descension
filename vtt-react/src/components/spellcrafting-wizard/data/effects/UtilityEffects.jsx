import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FaCog } from 'react-icons/fa';

// Pathfinder styles imported via main.css
import '../../styles/effects/unified-effects.css';
import '../../styles/pathfinder/wizard-enhancements.css';

// Import utilities and stat data
import { BUFF_DEBUFF_STAT_MODIFIERS } from '../../core/data/statModifier';


// Utility type definitions
export const UTILITY_TYPES = {
  ENHANCEMENT: {
    id: 'enhancement',
    name: 'Enhancement',
    icon: 'inv_misc_gem_02',
    description: 'Improve abilities, grant skills, or enhance existing attributes',
    color: '#4e7cff'
  },
  DETECTION: {
    id: 'detection',
    name: 'Detection',
    icon: 'inv_misc_eye_03',
    description: 'Reveal hidden objects, creatures, or gain special senses',
    color: '#9966ff'
  },
  MOVEMENT: {
    id: 'movement',
    name: 'Movement',
    icon: 'ability_warrior_warcry',
    description: 'Special movement abilities like flight, teleportation, or water walking',
    color: '#66ffcc'
  },
  ILLUMINATION: {
    id: 'illumination',
    name: 'Illumination',
    icon: 'inv_misc_lantern_01',
    description: 'Create light, affect visibility, or manipulate visual perception',
    color: '#ffcc00'
  },
  PROTECTION: {
    id: 'protection',
    name: 'Protection',
    icon: 'inv_shield_06',
    description: 'Create wards, barriers, and protective enchantments',
    color: '#ff6633'
  }
};

// Duration types
const DURATION_TYPES = [
  { id: 'instant', name: 'Instantaneous', description: 'Effect happens immediately with no duration', icon: 'inv_misc_pocketwatch_01' },
  { id: 'rounds', name: 'Rounds', description: 'Combat rounds (approx. 6 seconds each)', icon: 'inv_misc_pocketwatch_01' },
  { id: 'minutes', name: 'Minutes', description: 'Real-time minutes', icon: 'inv_misc_pocketwatch_02' },
  { id: 'hours', name: 'Hours', description: 'Real-time hours', icon: 'inv_misc_pocketwatch_03' },
  { id: 'days', name: 'Days', description: 'In-game days', icon: 'inv_misc_pocketwatch_01' }
];

// Potency options with proper scaling
const POTENCY_OPTIONS = [
  { id: 'minor', name: 'Minor', description: 'Basic effect with modest benefits', color: '#8B4513' },
  { id: 'moderate', name: 'Moderate', description: 'Standard effect with good benefits', color: '#CD853F' },
  { id: 'major', name: 'Major', description: 'Strong effect with significant benefits', color: '#DAA520' },
  { id: 'extreme', name: 'Extreme', description: 'Very powerful effect with major benefits', color: '#FF8C00' },
  { id: 'legendary', name: 'Legendary', description: 'Legendary effect with extraordinary benefits', color: '#FF4500' }
];

// Enhancement effects
const ENHANCEMENT_EFFECTS = [
  { id: 'attribute', name: 'Attribute Boost', description: 'Enhances one or more attributes', icon: 'inv_misc_gem_02' },
  { id: 'skill', name: 'Skill Enhancement', description: 'Grants advantage on skill checks', icon: 'inv_misc_book_11' },
  { id: 'speed', name: 'Speed Increase', description: 'Increases movement speed', icon: 'ability_mount_jungletiger' },
  { id: 'senses', name: 'Enhanced Senses', description: 'Improves perception, hearing, or other senses', icon: 'inv_misc_eye_03' },
  { id: 'speak', name: 'Speak Languages', description: 'Grants ability to understand or speak languages', icon: 'inv_misc_tome_07' },
  { id: 'disguise', name: 'Magical Disguise', description: 'Alters appearance temporarily', icon: 'inv_misc_mask_01' }
];

// Detection effects
const DETECTION_EFFECTS = [
  { id: 'truesight', name: 'Truesight', description: 'See through illusions, invisibility, and darkness', icon: 'inv_misc_eye_03' },
  { id: 'magic', name: 'Detect Magic', description: 'Perceive magical auras and enchantments', icon: 'inv_misc_gem_02' },
  { id: 'invisible', name: 'See Invisible', description: 'Detect invisible creatures and objects', icon: 'inv_misc_eye_03' },
  { id: 'hidden', name: 'Find Hidden', description: 'Detect secret doors, traps, and hidden compartments', icon: 'inv_misc_key_06' },
  { id: 'creatures', name: 'Detect Creatures', description: 'Detect specific types of creatures', icon: 'inv_misc_eye_03' }
];

// Movement effects
const MOVEMENT_EFFECTS = [
  { id: 'teleport', name: 'Teleportation', description: 'Instantly transport to another location', icon: 'spell_arcane_teleportorium' },
  { id: 'fly', name: 'Flight', description: 'Grant the ability to fly', icon: 'ability_warrior_warcry' },
  { id: 'swim', name: 'Water Movement', description: 'Walk on water or swim with ease', icon: 'inv_misc_fish_02' },
  { id: 'climb', name: 'Climbing', description: 'Scale vertical surfaces with ease', icon: 'inv_misc_rope_01' },
  { id: 'dimension', name: 'Dimensional Door', description: 'Create a portal to another location', icon: 'inv_misc_key_06' },
  { id: 'phasing', name: 'Phasing', description: 'Move through solid objects', icon: 'inv_misc_gem_02' }
];

// Illumination effects
const ILLUMINATION_EFFECTS = [
  { id: 'light', name: 'Light Creation', description: 'Create magical light source', icon: 'inv_misc_lantern_01' },
  { id: 'darkness', name: 'Magical Darkness', description: 'Create an area of supernatural darkness', icon: 'inv_misc_mask_01' },
  { id: 'color', name: 'Color Spray', description: 'Dazzling display of colored light', icon: 'inv_misc_gem_02' },
  { id: 'illusion', name: 'Minor Illusion', description: 'Create illusory images or sounds', icon: 'inv_misc_mask_01' },
  { id: 'silence', name: 'Silence', description: 'Create an area of magical silence', icon: 'inv_misc_tome_07' }
];

// Protection effects
const PROTECTION_EFFECTS = [
  { id: 'barrier', name: 'Magical Barrier', description: 'Create a force barrier that blocks attacks', icon: 'inv_shield_06' },
  { id: 'resistance', name: 'Elemental Resistance', description: 'Reduce damage from specific elements', icon: 'inv_misc_gem_02' },
  { id: 'ward', name: 'Ward Area', description: 'Create a protective ward around an area', icon: 'inv_misc_key_06' },
  { id: 'sanctuary', name: 'Personal Sanctuary', description: 'Protect self from harm', icon: 'inv_misc_mask_01' },
  { id: 'dispel', name: 'Dispel Magic', description: 'Remove magical effects', icon: 'inv_misc_tome_07' }
];

// Enhanced effect descriptions with proper potency scaling
const UTILITY_EFFECT_DESCRIPTIONS = {
  enhancement: {
    attribute: {
      minor: "Grants +1 bonus to a single attribute for all checks",
      moderate: "Grants +2 bonus to a single attribute for all checks",
      major: "Grants +3 bonus to a single attribute for all checks",
      extreme: "Grants +4 bonus to a single attribute for all checks",
      legendary: "Grants +5 bonus to a single attribute for all checks"
    },
    skill: {
      minor: "Grants advantage on the next skill check",
      moderate: "Grants advantage on all checks for one skill",
      major: "Grants advantage on all checks for two skills",
      extreme: "Grants advantage on all checks for three skills",
      legendary: "Grants advantage on all skill checks"
    },
    speed: {
      minor: "Increases movement speed by 10 feet",
      moderate: "Increases movement speed by 20 feet",
      major: "Increases movement speed by 30 feet",
      extreme: "Increases movement speed by 40 feet",
      legendary: "Increases movement speed by 50 feet"
    },
    senses: {
      minor: "Grants advantage on Perception checks",
      moderate: "Grants darkvision 30 feet and advantage on Perception checks",
      major: "Grants darkvision 60 feet and advantage on Perception checks",
      extreme: "Grants darkvision 90 feet and advantage on Perception checks",
      legendary: "Grants truesight 60 feet and advantage on Perception checks"
    },
    speak: {
      minor: "Understand one language for the duration",
      moderate: "Speak and understand one language for the duration",
      major: "Speak and understand two languages for the duration",
      extreme: "Speak and understand three languages for the duration",
      legendary: "Speak and understand all languages for the duration"
    },
    disguise: {
      minor: "Change minor features (hair, eye color) for the duration",
      moderate: "Change appearance to look like another humanoid for the duration",
      major: "Perfect disguise that fools visual inspection for the duration",
      extreme: "Perfect disguise that fools physical inspection for the duration",
      legendary: "Perfect disguise that fools magical detection for the duration"
    }
  },
  detection: {
    truesight: {
      minor: "See through illusions within 15 feet for the duration",
      moderate: "See through illusions and invisibility within 30 feet for the duration",
      major: "Truesight within 60 feet for the duration",
      extreme: "Truesight within 90 feet for the duration",
      legendary: "Truesight within 120 feet for the duration"
    },
    magic: {
      minor: "Detect presence of magic within 30 feet",
      moderate: "Detect magic within 60 feet and identify schools",
      major: "Detect magic within 90 feet, identify schools and strength",
      extreme: "Detect magic within 120 feet, identify schools, strength, and casters",
      legendary: "Detect all magic within 150 feet with complete information"
    },
    invisible: {
      minor: "See invisible creatures within 30 feet for the duration",
      moderate: "See invisible creatures within 60 feet for the duration",
      major: "See invisible creatures within 90 feet for the duration",
      extreme: "See invisible creatures within 120 feet for the duration",
      legendary: "See invisible creatures within 150 feet and through all concealment"
    },
    hidden: {
      minor: "Detect secret doors and traps within 15 feet",
      moderate: "Detect secret doors and traps within 30 feet",
      major: "Detect all hidden objects within 60 feet",
      extreme: "Detect all hidden objects within 90 feet",
      legendary: "Detect all hidden objects within 120 feet and their exact nature"
    },
    creatures: {
      minor: "Detect one creature type within 60 feet",
      moderate: "Detect two creature types within 90 feet",
      major: "Detect three creature types within 120 feet",
      extreme: "Detect all creature types within 150 feet",
      legendary: "Detect all creatures within 200 feet with exact locations and types"
    }
  },
  movement: {
    teleport: {
      minor: "Teleport up to 30 feet to a visible location",
      moderate: "Teleport up to 60 feet to any location you've seen",
      major: "Teleport up to 500 feet to any location you've seen or can describe"
    },
    fly: {
      minor: "Gain hover ability up to 5 feet for 1 minute",
      moderate: "Gain flying speed equal to walking speed for the duration",
      major: "Gain flying speed double your walking speed for the duration"
    },
    swim: {
      minor: "Gain swimming speed equal to walking speed",
      moderate: "Gain swimming speed and water breathing for the duration",
      major: "Walk on water and breathe underwater for the duration"
    },
    climb: {
      minor: "Gain climbing speed equal to half walking speed",
      moderate: "Gain climbing speed equal to walking speed, even on smooth surfaces",
      major: "Gain spider climb (walk on walls and ceilings) for the duration"
    },
    dimension: {
      minor: "Create a small portal connecting two points within 30 feet for 1 round",
      moderate: "Create a doorway connecting two points within 100 feet for 1 minute",
      major: "Create a permanent portal connecting two points you've visited"
    },
    phasing: {
      minor: "Phase through objects up to 1 foot thick once",
      moderate: "Phase through objects up to 5 feet thick for 1 minute",
      major: "Ethereal form (move through all objects) for the duration"
    }
  },
  illumination: {
    light: {
      minor: "Create dim light in a 20-foot radius",
      moderate: "Create bright light in a 30-foot radius and dim light 30 feet beyond",
      major: "Create sunlight in a 60-foot radius"
    },
    darkness: {
      minor: "Create darkness in a 10-foot radius for 1 minute",
      moderate: "Create magical darkness in a 20-foot radius for the duration",
      major: "Create absolute darkness in a 30-foot radius that even darkvision can't penetrate"
    },
    color: {
      minor: "Dazzle one creature, imposing disadvantage on its next attack",
      moderate: "Dazzle all creatures in a 15-foot cone, stunning them for 1 round",
      major: "Blind all creatures in a 30-foot cone for 1 minute"
    },
    illusion: {
      minor: "Create a simple visual illusion no larger than 5 cubic feet",
      moderate: "Create a complex visual and auditory illusion up to 15 cubic feet",
      major: "Create a complex illusion with visual, auditory, thermal, and olfactory components"
    },
    silence: {
      minor: "Silence a single creature for 1 round",
      moderate: "Create a 10-foot radius of silence for 1 minute",
      major: "Create a 30-foot radius of silence for the duration"
    }
  },
  protection: {
    barrier: {
      minor: "Create a force barrier with 10 hit points",
      moderate: "Create a force barrier with 30 hit points that blocks spells",
      major: "Create an impenetrable force barrier for the duration"
    },
    resistance: {
      minor: "Resistance to one element for 1 minute",
      moderate: "Resistance to three elements for the duration",
      major: "Immunity to one element and resistance to all others for the duration"
    },
    ward: {
      minor: "Ward a 10-foot area against one creature type",
      moderate: "Ward a 30-foot area against multiple creature types",
      major: "Create a sanctuary that no hostile creatures can enter"
    },
    sanctuary: {
      minor: "Hostile creatures must make a saving throw to attack you for 1 minute",
      moderate: "You cannot be directly targeted by hostile creatures for the duration",
      major: "You are immune to all damage for 1 round or until you attack"
    },
    dispel: {
      minor: "Attempt to end one magical effect on a target",
      moderate: "Automatically dispel all magical effects of 3rd level or lower on a target",
      major: "Dispel all magical effects in a 30-foot radius"
    }
  }
};



// Define ability scores for saving throws
const ABILITY_SCORES = [
  { id: 'str', name: 'Strength', icon: 'spell_nature_strength' },
  { id: 'agi', name: 'Agility', icon: 'ability_rogue_quickrecovery' },
  { id: 'con', name: 'Constitution', icon: 'spell_holy_blessingofstamina' },
  { id: 'int', name: 'Intelligence', icon: 'spell_holy_magicalsentry' },
  { id: 'spi', name: 'Spirit', icon: 'spell_holy_elunesblessing' },
  { id: 'cha', name: 'Charisma', icon: 'spell_holy_powerwordshield' }
];

const UtilityEffects = ({ state, dispatch, actionCreators }) => {
  // Initialize with default utility type from state or 'enhancement'
  const [selectedUtilityCategory, setSelectedUtilityCategory] = useState(
    state.utilityConfig?.utilityType || 'enhancement'
  );

  const [effectPreview, setEffectPreview] = useState(null);

  // Configuration popup state
  const [configPopupOpen, setConfigPopupOpen] = useState(false);
  const [selectedEffectForConfig, setSelectedEffectForConfig] = useState(null);
  // Local state just for potency UI highlighting
  const [localPotencySelection, setLocalPotencySelection] = useState(null);

  // Define default configuration
  const defaultConfig = {
    utilityType: 'enhancement',
    duration: 3,
    durationUnit: 'minutes',
    concentration: false,
    difficultyClass: 15,
    abilitySave: 'spi',
    selectedEffects: []
  };

  // Initialize utility configuration with defaults or existing state
  const [utilityConfig, setUtilityConfig] = useState(state.utilityConfig || defaultConfig);

  // Effect to update state when utility type changes
  useEffect(() => {
    if (selectedUtilityCategory !== utilityConfig.utilityType) {
      const newConfig = {
        ...utilityConfig,
        utilityType: selectedUtilityCategory
      };
      setUtilityConfig(newConfig);
      dispatch(actionCreators.updateUtilityConfig(newConfig));
    }
  }, [selectedUtilityCategory, utilityConfig.utilityType, dispatch]);

  // Effect to sync state when configuration changes
  useEffect(() => {
    if (state.utilityConfig !== utilityConfig) {
      dispatch(actionCreators.updateUtilityConfig(utilityConfig));
    }
  }, [utilityConfig, dispatch]);

  // Handle utility configuration changes
  const updateUtilityConfig = (field, value) => {
    const newConfig = {
      ...utilityConfig,
      [field]: value
    };

    setUtilityConfig(newConfig);
    dispatch(actionCreators.updateUtilityConfig(newConfig));
  };

  // Get effect description based on type and potency
  const getEffectDescription = (effect) => {
    if (!effect) return '';

    try {
      const descriptions = UTILITY_EFFECT_DESCRIPTIONS[selectedUtilityCategory][effect.id];
      if (descriptions && descriptions[effect.potency]) {
        return descriptions[effect.potency];
      }
      return effect.description; // Fallback to original description
    } catch (error) {
      return effect.description; // Fallback to original description
    }
  };

  // Toggle an effect selection
  const toggleEffect = (effectId) => {
    const selectedEffects = [...(utilityConfig.selectedEffects || [])];
    const effectIndex = selectedEffects.findIndex(e => e.id === effectId);

    if (effectIndex >= 0) {
      // Remove effect if already selected
      selectedEffects.splice(effectIndex, 1);
    } else {
      // Add effect with default values
      const effectsMap = getEffectsForType(selectedUtilityCategory);
      const effect = effectsMap.find(e => e.id === effectId);

      if (effect) {
        // Get enhanced description for default potency
        const defaultPotency = 'moderate';
        let enhancedDescription = effect.description;

        if (UTILITY_EFFECT_DESCRIPTIONS[selectedUtilityCategory]?.[effect.id]?.[defaultPotency]) {
          enhancedDescription = UTILITY_EFFECT_DESCRIPTIONS[selectedUtilityCategory][effect.id][defaultPotency];
        }

        selectedEffects.push({
          id: effect.id,
          name: effect.name,
          description: enhancedDescription,
          customName: effect.name,
          customDescription: '', // Don't set custom description by default
          potency: defaultPotency,
          statModifiers: [] // Add stat modifiers array
        });
      }
    }

    updateUtilityConfig('selectedEffects', selectedEffects);
  };

  // Update effect configuration
  const updateEffectConfig = (effectId, field, value) => {
    const selectedEffects = [...(utilityConfig.selectedEffects || [])];
    const effectIndex = selectedEffects.findIndex(e => e.id === effectId);

    if (effectIndex >= 0) {
      selectedEffects[effectIndex] = {
        ...selectedEffects[effectIndex],
        [field]: value
      };

      // Update the selectedEffectForConfig state FIRST to ensure immediate UI update
      if (selectedEffectForConfig && selectedEffectForConfig.id === effectId) {
        const updatedSelectedEffect = {
          ...selectedEffectForConfig,
          [field]: value
        };
        setSelectedEffectForConfig(updatedSelectedEffect);
      }

      // Update the utility config which will trigger the spell wizard context update
      const newConfig = {
        ...utilityConfig,
        selectedEffects: selectedEffects
      };

      setUtilityConfig(newConfig);
      dispatch(actionCreators.updateUtilityConfig(newConfig));
    }
  };

  // Update effect potency (legacy support)
  const updateEffectPotency = (effectId, potency) => {
    updateEffectConfig(effectId, 'potency', potency);
  };

  // Stat modifier management functions
  const addStatModifierToEffect = (effectId, stat) => {
    const selectedEffects = [...(utilityConfig.selectedEffects || [])];
    const effectIndex = selectedEffects.findIndex(e => e.id === effectId);

    if (effectIndex >= 0) {
      const effect = selectedEffects[effectIndex];
      const existingModifiers = [...(effect.statModifiers || [])];

      // Check if this stat is already added
      if (!existingModifiers.some(mod => mod.id === stat.id)) {
        existingModifiers.push({
          ...stat,
          magnitude: 2,
          magnitudeType: 'flat'
        });

        selectedEffects[effectIndex] = {
          ...effect,
          statModifiers: existingModifiers
        };

        updateUtilityConfig('selectedEffects', selectedEffects);
      }
    }
  };

  const removeStatModifierFromEffect = (effectId, statId) => {
    const selectedEffects = [...(utilityConfig.selectedEffects || [])];
    const effectIndex = selectedEffects.findIndex(e => e.id === effectId);

    if (effectIndex >= 0) {
      const effect = selectedEffects[effectIndex];
      const updatedModifiers = (effect.statModifiers || []).filter(mod => mod.id !== statId);

      selectedEffects[effectIndex] = {
        ...effect,
        statModifiers: updatedModifiers
      };

      updateUtilityConfig('selectedEffects', selectedEffects);
    }
  };

  const updateStatModifierValue = (effectId, statId, magnitude) => {
    const selectedEffects = [...(utilityConfig.selectedEffects || [])];
    const effectIndex = selectedEffects.findIndex(e => e.id === effectId);

    if (effectIndex >= 0) {
      const effect = selectedEffects[effectIndex];
      const updatedModifiers = (effect.statModifiers || []).map(mod => {
        if (mod.id === statId) {
          return { ...mod, magnitude };
        }
        return mod;
      });

      selectedEffects[effectIndex] = {
        ...effect,
        statModifiers: updatedModifiers
      };

      updateUtilityConfig('selectedEffects', selectedEffects);
    }
  };

  const updateStatModifierType = (effectId, statId, magnitudeType) => {
    const selectedEffects = [...(utilityConfig.selectedEffects || [])];
    const effectIndex = selectedEffects.findIndex(e => e.id === effectId);

    if (effectIndex >= 0) {
      const effect = selectedEffects[effectIndex];
      const updatedModifiers = (effect.statModifiers || []).map(mod => {
        if (mod.id === statId) {
          return { ...mod, magnitudeType };
        }
        return mod;
      });

      selectedEffects[effectIndex] = {
        ...effect,
        statModifiers: updatedModifiers
      };

      updateUtilityConfig('selectedEffects', selectedEffects);
    }
  };

  // Get appropriate effects list for the selected utility type
  const getEffectsForType = (utilityType) => {
    switch (utilityType) {
      case 'enhancement': return ENHANCEMENT_EFFECTS;
      case 'detection': return DETECTION_EFFECTS;
      case 'movement': return MOVEMENT_EFFECTS;
      case 'illumination': return ILLUMINATION_EFFECTS;
      case 'protection': return PROTECTION_EFFECTS;
      default: return [];
    }
  };

  // Get stat modifiers by category
  const getStatModifiersByCategory = (category) => {
    if (!BUFF_DEBUFF_STAT_MODIFIERS) {
      return [];
    }
    return BUFF_DEBUFF_STAT_MODIFIERS.filter(stat => stat.category === category);
  };

  // Get WoW-style icon URL
  const getIconUrl = (iconName) => {
    if (!iconName) return '';
    return `https://wow.zamimg.com/images/wow/icons/large/${iconName}.jpg`;
  };



  return (
    <div className="utility-effects-container">
      <div className="section">
        <h3>Utility Effects Configuration</h3>
        <p>Create versatile utility effects that provide non-combat benefits and special abilities</p>
      </div>

      {/* Enhanced Configuration Section - Moved to top */}
      <div className="section">
        <h4>Effect Configuration</h4>

        <div className="utility-config-grid">
          <div className="config-group">
            <label>Duration</label>
            <div className="duration-config">
              <input
                type="number"
                min="1"
                max="100"
                value={utilityConfig.duration}
                onChange={(e) => {
                  const duration = Math.max(1, parseInt(e.target.value) || 1);
                  updateUtilityConfig('duration', duration);
                }}
                className="duration-value"
              />
              <select
                value={utilityConfig.durationUnit || 'minutes'}
                onChange={(e) => updateUtilityConfig('durationUnit', e.target.value)}
                className="duration-unit"
              >
                {DURATION_TYPES.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="config-group">
            <label>Requires Concentration</label>
            <div className="concentration-toggle">
              <button
                type="button"
                className={`toggle-btn ${utilityConfig.concentration === true ? 'active' : ''}`}
                onClick={() => updateUtilityConfig('concentration', true)}
              >
                Yes
              </button>
              <button
                type="button"
                className={`toggle-btn ${utilityConfig.concentration === false ? 'active' : ''}`}
                onClick={() => updateUtilityConfig('concentration', false)}
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
                value={utilityConfig.difficultyClass}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value === '' || value === '0') {
                    updateUtilityConfig('difficultyClass', 1);
                  } else {
                    const dc = Math.max(1, Math.min(50, parseInt(value) || 1));
                    updateUtilityConfig('difficultyClass', dc);
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
              value={utilityConfig.abilitySave || 'spi'}
              onChange={(e) => updateUtilityConfig('abilitySave', e.target.value)}
              className="save-select"
            >
              {ABILITY_SCORES.map(ability => (
                <option key={ability.id} value={ability.id}>
                  {ability.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Combined Category Selection and Available Effects */}
      <div className="section">
        <h4>Available Effects</h4>

        {/* Utility Category Selection at Header */}
        <div className="utility-category-buttons">
          {Object.values(UTILITY_TYPES).map(type => (
            <button
              key={type.id}
              className={`utility-category-btn ${selectedUtilityCategory === type.id ? 'selected' : ''}`}
              onClick={() => setSelectedUtilityCategory(type.id)}
            >
              <img
                src={`https://wow.zamimg.com/images/wow/icons/large/${type.icon}.jpg`}
                alt={type.name}
                className="utility-category-btn-icon"
              />
              <span>{type.name}</span>
            </button>
          ))}
        </div>

        {/* Selected Effects Section - Moved up here */}
        {utilityConfig.selectedEffects && utilityConfig.selectedEffects.length > 0 && (
          <div className="selected-stats">
            <h4>Selected Effects ({utilityConfig.selectedEffects.length})</h4>
            <div className="selected-effects-grid">
              {utilityConfig.selectedEffects.map(effect => {
                const originalEffect = getEffectsForType(selectedUtilityCategory).find(e => e.id === effect.id);

                return (
                  <div className="selected-effect-card" key={effect.id}>
                    <div className="effect-card-header">
                      <img src={getIconUrl(originalEffect?.icon)} alt={effect.customName || effect.name} className="effect-card-icon" />
                      <div className="effect-card-title">{effect.customName || effect.name}</div>
                      <button
                        className="effect-configure-btn"
                        onClick={() => {
                          setSelectedEffectForConfig(effect);
                          setLocalPotencySelection(effect.potency || 'moderate'); // Initialize local state
                          setConfigPopupOpen(true);
                        }}
                        title="Configure effect"
                      >
                        <FaCog />
                      </button>
                      <button
                        className="effect-remove-btn"
                        onClick={() => toggleEffect(effect.id)}
                        title="Remove effect"
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    </div>
                    <div className="effect-card-description">
                      {effect.customDescription || effect.description || getEffectDescription(effect)}
                    </div>
                    <div className="effect-card-potency">
                      Potency: {effect.potency}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Available Effects Grid */}
        <div className="utility-effects-grid">
          {getEffectsForType(selectedUtilityCategory).map(effect => {
            const isSelected = utilityConfig.selectedEffects?.some(e => e.id === effect.id);

            return (
              <div
                key={effect.id}
                className={`utility-effect-card ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleEffect(effect.id)}
              >
                <div className="utility-effect-header">
                  <img
                    src={`https://wow.zamimg.com/images/wow/icons/large/${effect.icon}.jpg`}
                    alt={effect.name}
                    className="utility-effect-icon"
                  />
                  <div className="utility-effect-info">
                    <h6>{effect.name}</h6>
                    <p>{effect.description}</p>
                  </div>
                </div>
                {isSelected && (
                  <div className="utility-effect-selected">
                    <span className="utility-effect-checkmark">✓</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>









      {/* Enhanced Effect Configuration Popup - Rendered outside spellbook window */}
      {configPopupOpen && selectedEffectForConfig && ReactDOM.createPortal(
        <div className="effect-config-popup-overlay" onClick={() => setConfigPopupOpen(false)}>
          <div className="effect-config-popup" onClick={(e) => e.stopPropagation()}>
            <div className="effect-config-header">
              <img
                src={getIconUrl(getEffectsForType(selectedUtilityCategory).find(e => e.id === selectedEffectForConfig.id)?.icon)}
                alt={selectedEffectForConfig.name}
                className="effect-config-icon"
              />
              <h3>Configure Effect</h3>
              <button
                className="effect-config-close"
                onClick={() => setConfigPopupOpen(false)}
              >
                ×
              </button>
            </div>

            <div className="effect-config-content">
              <div className="effect-config-field">
                <label>Effect Name</label>
                <input
                  type="text"
                  value={selectedEffectForConfig.customName || selectedEffectForConfig.name}
                  onChange={(e) => updateEffectConfig(selectedEffectForConfig.id, 'customName', e.target.value)}
                  placeholder="Custom effect name"
                />
              </div>

              <div className="effect-config-field">
                <label>Potency Level</label>
                <div className="potency-selection-grid">
                  {POTENCY_OPTIONS.map(potency => {
                    // Use local state for UI highlighting, fallback to actual state
                    const currentPotency = localPotencySelection || selectedEffectForConfig.potency || 'moderate';
                    const isSelected = currentPotency === potency.id;

                    const effectType = getEffectsForType(selectedUtilityCategory).find(e => e.id === selectedEffectForConfig.id);



                    // Get the proper description based on category and effect ID
                    let description = 'No description available';
                    if (effectType && UTILITY_EFFECT_DESCRIPTIONS[selectedUtilityCategory]?.[effectType.id]?.[potency.id]) {
                      description = UTILITY_EFFECT_DESCRIPTIONS[selectedUtilityCategory][effectType.id][potency.id];
                    }

                    return (
                      <div
                        key={potency.id}
                        className={`potency-option ${isSelected ? 'selected' : ''} potency-${potency.id}`}
                        onClick={(e) => {

                          e.preventDefault();
                          e.stopPropagation();
                          // Set local state immediately for UI feedback
                          setLocalPotencySelection(potency.id);
                          updateEffectConfig(selectedEffectForConfig.id, 'potency', potency.id);
                          // Also update the description if no custom description is set
                          if (!selectedEffectForConfig.customDescription) {
                            // Get the enhanced description for this potency level
                            const enhancedDescription = UTILITY_EFFECT_DESCRIPTIONS[selectedUtilityCategory]?.[effectType.id]?.[potency.id];
                            if (enhancedDescription) {
                              updateEffectConfig(selectedEffectForConfig.id, 'description', enhancedDescription);
                            }
                          }
                        }}
                      >
                        <div className="potency-header">
                          <h5 style={{ color: potency.color }}>{potency.name}</h5>
                          <p className="potency-description">{potency.description}</p>
                        </div>
                        <div className="potency-effect-preview">
                          <strong>Effect:</strong> {description}
                        </div>
                        {isSelected && (
                          <div className="potency-selected-indicator">✓</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="effect-config-field">
                <label>Custom Description (Optional)</label>
                <textarea
                  value={selectedEffectForConfig.customDescription || ''}
                  onChange={(e) => updateEffectConfig(selectedEffectForConfig.id, 'customDescription', e.target.value)}
                  placeholder="Override the default description with your own..."
                  rows="3"
                />
              </div>

            </div>

            <div className="effect-config-footer">
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

export default UtilityEffects;