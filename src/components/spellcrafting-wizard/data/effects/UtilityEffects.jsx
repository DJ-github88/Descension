import React, { useState, useEffect } from 'react';

// Import utilities
import Wc3Tooltip from '../../../tooltips/Wc3Tooltip';

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

// Effect descriptions based on potency (minor, moderate, major)
const UTILITY_EFFECT_DESCRIPTIONS = {
  enhancement: {
    attribute: {
      minor: "Grants +1 to a single attribute check",
      moderate: "Grants +2 to all checks with a specific attribute",
      major: "Grants +3 to all checks with two attributes of your choice"
    },
    skill: {
      minor: "Advantage on the next check for one skill",
      moderate: "Advantage on all checks for one skill for the duration",
      major: "Advantage on all checks for three skills for the duration"
    },
    speed: {
      minor: "Increases movement speed by 5 feet",
      moderate: "Increases movement speed by 10 feet and jump distance by 5 feet",
      major: "Doubles movement speed and jump distance"
    },
    senses: {
      minor: "Advantage on the next Perception check",
      moderate: "Advantage on all Perception checks and +5 to passive Perception",
      major: "Darkvision 60 feet, advantage on all Perception checks, and +10 to passive Perception"
    },
    speak: {
      minor: "Understand one language for 1 hour",
      moderate: "Speak and understand one language for the duration",
      major: "Speak and understand all languages for the duration"
    },
    disguise: {
      minor: "Change minor features (hair color, eye color) for 1 hour",
      moderate: "Change appearance completely for the duration",
      major: "Perfect illusory disguise that passes physical inspection for the duration"
    }
  },
  detection: {
    truesight: {
      minor: "See through illusions within 10 feet for 1 minute",
      moderate: "See through illusions and invisibility within 30 feet for the duration",
      major: "True sight within 60 feet for the duration (see through illusions, invisibility, and darkness)"
    },
    magic: {
      minor: "Detect presence of magic within 10 feet",
      moderate: "Detect magic within 30 feet and identify schools of magic",
      major: "Detect magic within 60 feet, identify schools of magic, and see magical auras"
    },
    invisible: {
      minor: "See invisible creatures within 10 feet for 1 minute",
      moderate: "See invisible creatures within 30 feet for the duration",
      major: "See invisible creatures within 60 feet and through ethereal plane for the duration"
    },
    hidden: {
      minor: "Advantage on checks to find traps within 10 feet",
      moderate: "Automatically detect secret doors and compartments within 30 feet",
      major: "Automatically detect all hidden objects, doors, and traps within 60 feet"
    },
    creatures: {
      minor: "Detect presence of one creature type within 30 feet",
      moderate: "Detect presence and number of one creature type within 60 feet",
      major: "Detect presence, number, and location of all creatures within 120 feet"
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

// Difficulty levels
const DIFFICULTY_LEVELS = [
  { id: 'easy', name: 'Easy (DC 10)', description: 'Simple task, most should succeed' },
  { id: 'moderate', name: 'Moderate (DC 15)', description: 'Challenging, requires some skill' },
  { id: 'hard', name: 'Hard (DC 20)', description: 'Difficult, requires expertise' },
  { id: 'very_hard', name: 'Very Hard (DC 25)', description: 'Extremely difficult, masters may fail' }
];

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

  // Tooltip state
  const [tooltipContent, setTooltipContent] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [effectPreview, setEffectPreview] = useState(null);

  // Define default configuration
  const defaultConfig = {
    utilityType: 'enhancement',
    duration: 3,
    durationUnit: 'minutes',
    concentration: false,
    difficultyClass: 15,
    abilitySave: 'spi',
    difficulty: 'moderate',
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
  }, [selectedUtilityCategory]);

  // Effect to sync state when configuration changes
  useEffect(() => {
    if (state.utilityConfig !== utilityConfig) {
      dispatch(actionCreators.updateUtilityConfig(utilityConfig));
    }
  }, [utilityConfig]);

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
        selectedEffects.push({
          id: effect.id,
          name: effect.name,
          description: effect.description,
          potency: 'moderate'
        });
      }
    }

    updateUtilityConfig('selectedEffects', selectedEffects);
  };

  // Update effect potency
  const updateEffectPotency = (effectId, potency) => {
    const selectedEffects = [...(utilityConfig.selectedEffects || [])];
    const effectIndex = selectedEffects.findIndex(e => e.id === effectId);

    if (effectIndex >= 0) {
      selectedEffects[effectIndex] = {
        ...selectedEffects[effectIndex],
        potency
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

  // Get WoW-style icon URL
  const getIconUrl = (iconName) => {
    if (!iconName) return '';
    return `https://wow.zamimg.com/images/wow/icons/large/${iconName}.jpg`;
  };

  // Show tooltip on hover
  const handleMouseEnter = (effect, e) => {
    // Create WoW Classic style tooltip content
    const tooltipContent = (
      <div>
        <div className="tooltip-stat-line">
          {effect.description}
        </div>

        {/* Potency information */}
        <div className="tooltip-effect">
          <span className="tooltip-gold">Effect Type:</span> {selectedUtilityCategory.charAt(0).toUpperCase() + selectedUtilityCategory.slice(1)} Utility
        </div>

        {/* Potency levels description */}
        <div className="tooltip-divider"></div>
        <div className="tooltip-section-header">Potency Levels:</div>
        <div className="tooltip-option">
          <span className="tooltip-bullet"></span>
          <span className="tooltip-gold">Minor:</span> Basic effect with limited power
        </div>
        <div className="tooltip-option">
          <span className="tooltip-bullet"></span>
          <span className="tooltip-gold">Moderate:</span> Standard effect with balanced power
        </div>
        <div className="tooltip-option">
          <span className="tooltip-bullet"></span>
          <span className="tooltip-gold">Major:</span> Powerful effect with enhanced capabilities
        </div>

        {/* Selected potency if applicable */}
        {utilityConfig.selectedEffects?.some(e => e.id === effect.id) && (
          <>
            <div className="tooltip-divider"></div>
            <div className="tooltip-casttime">
              <span className="tooltip-gold">Current Potency:</span> {
                utilityConfig.selectedEffects.find(e => e.id === effect.id).potency.charAt(0).toUpperCase() +
                utilityConfig.selectedEffects.find(e => e.id === effect.id).potency.slice(1)
              }
            </div>
          </>
        )}

        <div className="tooltip-divider"></div>
        <div className="tooltip-flavor-text">
          {selectedUtilityCategory === 'enhancement' && "\"Your abilities transcend normal limitations.\""}
          {selectedUtilityCategory === 'detection' && "\"Your senses extend beyond mortal perception.\""}
          {selectedUtilityCategory === 'movement' && "\"The laws of nature bend to your will.\""}
          {selectedUtilityCategory === 'illumination' && "\"Light and darkness become tools in your hands.\""}
          {selectedUtilityCategory === 'protection' && "\"Arcane shields protect you from harm.\""}
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
      setMousePos({ x: e.pageX, y: e.pageY });
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

  return (
    <div className="spell-effects-container">
      <h3>Utility Configuration</h3>

      <div className="buff-config-section">
        <div className="config-option">
          <label>Duration Type</label>
          <select
            value={utilityConfig.durationUnit || 'minutes'}
            onChange={(e) => updateUtilityConfig('durationUnit', e.target.value)}
            className="buff-dropdown"
          >
            {DURATION_TYPES.map(type => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        </div>

        {utilityConfig.durationUnit !== 'instant' && (
          <div className="config-option">
            <label>Duration Value</label>
            <input
              type="number"
              min="1"
              max="100"
              value={utilityConfig.duration}
              onChange={(e) => {
                const duration = Math.max(1, Math.min(100, parseInt(e.target.value) || 1));
                updateUtilityConfig('duration', duration);
              }}
            />
          </div>
        )}

        <div className="config-option">
          <label>Concentration</label>
          <div className="button-toggle-group">
            <button
              className={utilityConfig.concentration ? 'active' : ''}
              onClick={() => updateUtilityConfig('concentration', true)}
            >
              Yes
            </button>
            <button
              className={!utilityConfig.concentration ? 'active' : ''}
              onClick={() => updateUtilityConfig('concentration', false)}
            >
              No
            </button>
          </div>
        </div>

        <div className="config-option">
          <label>Difficulty Class</label>
          <input
            type="number"
            min="5"
            max="30"
            value={utilityConfig.difficultyClass}
            onChange={(e) => {
              const dc = Math.max(5, Math.min(30, parseInt(e.target.value) || 15));
              updateUtilityConfig('difficultyClass', dc);
            }}
          />
        </div>

        <div className="config-option">
          <label>Ability Save</label>
          <select
            value={utilityConfig.abilitySave || 'spi'}
            onChange={(e) => updateUtilityConfig('abilitySave', e.target.value)}
            className="buff-dropdown"
          >
            {ABILITY_SCORES.map(ability => (
              <option key={ability.id} value={ability.id}>
                {ability.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {utilityConfig.selectedEffects && utilityConfig.selectedEffects.length > 0 && (
        <div className="selected-stats">
          <h4>Selected Effects</h4>
          <div className="selected-stats-list">
            {utilityConfig.selectedEffects.map(effect => {
              const originalEffect = getEffectsForType(selectedUtilityCategory).find(e => e.id === effect.id);

              return (
                <div className="selected-stat" key={effect.id}>
                  <div className="stat-icon">
                    <img src={getIconUrl(originalEffect?.icon)} alt={effect.name} />
                  </div>
                  <div className="stat-info">
                    <div className="stat-name">{effect.name}</div>
                    <div className="stat-description">{getEffectDescription(effect)}</div>
                  </div>
                  <div className="stat-value-controls">
                    <div className="stat-type-toggle">
                      <button
                        className={effect.potency === 'minor' ? 'active' : ''}
                        onClick={() => updateEffectPotency(effect.id, 'minor')}
                      >
                        Minor
                      </button>
                      <button
                        className={effect.potency === 'moderate' ? 'active' : ''}
                        onClick={() => updateEffectPotency(effect.id, 'moderate')}
                      >
                        Moderate
                      </button>
                      <button
                        className={effect.potency === 'major' ? 'active' : ''}
                        onClick={() => updateEffectPotency(effect.id, 'major')}
                      >
                        Major
                      </button>
                    </div>
                  </div>
                  <button
                    className="remove-stat"
                    onClick={() => toggleEffect(effect.id)}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="stat-selector-section">
        <h4>Choose Utility Effects:</h4>

        <div className="stat-category-tabs">
          {Object.values(UTILITY_TYPES).map(type => (
            <button
              key={type.id}
              className={selectedUtilityCategory === type.id ? 'active' : ''}
              onClick={() => setSelectedUtilityCategory(type.id)}
            >
              {type.name}
            </button>
          ))}
        </div>

        <div className="stat-cards-grid">
          {getEffectsForType(selectedUtilityCategory).map(effect => {
            const isSelected = utilityConfig.selectedEffects?.some(e => e.id === effect.id);

            return (
              <div
                key={effect.id}
                className={`stat-card ${isSelected ? 'selected' : ''}`}
                onClick={() => toggleEffect(effect.id)}
                onMouseEnter={(e) => handleMouseEnter(effect, e)}
                onMouseLeave={handleMouseLeave}
                onMouseMove={handleMouseMove}
              >
                <img
                  src={getIconUrl(effect.icon)}
                  alt={effect.name}
                  className="stat-icon"
                />
                <div className="stat-name">{effect.name}</div>
                {isSelected && (
                  <div className="stat-indicator">
                    {utilityConfig.selectedEffects.find(e => e.id === effect.id).potency}
                  </div>
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
    </div>
  );
};

export default UtilityEffects;