import React, { useState, useEffect } from 'react';
import {
  FaDragon,
  FaPersonDress,
  FaWater,
  FaWind,
  FaEarthAmericas,
  FaMinus,
  FaPlus,
  FaCircleInfo,
  FaArrowRightLong,
  FaCircleXmark
} from 'react-icons/fa6';
import Wc3Tooltip from '../../../tooltips/Wc3Tooltip';
import './shared-effect-cards.css';
import './summoning-effects.css';

// Transformation types
export const TRANSFORMATION_TYPES = {
  BEAST_FORM: {
    id: 'beast_form',
    name: 'Beast Form',
    icon: 'ability_druid_catform',
    description: 'Transform into various beasts and creatures',
    effectIcon: FaDragon
  },
  DISGUISE: {
    id: 'disguise',
    name: 'Disguise',
    icon: 'ability_hunter_beastwithin',
    description: 'Transform appearance to look like other humanoids',
    effectIcon: FaPersonDress
  },
  WATER_FORM: {
    id: 'water_form',
    name: 'Water Form',
    icon: 'ability_druid_aquaticform',
    description: 'Transform into liquid or aquatic forms',
    effectIcon: FaWater
  },
  AIR_FORM: {
    id: 'air_form',
    name: 'Air Form',
    icon: 'spell_nature_cyclone',
    description: 'Transform into gaseous or aerial forms',
    effectIcon: FaWind
  },
  EARTH_FORM: {
    id: 'earth_form',
    name: 'Earth Form',
    icon: 'spell_nature_stoneskintotem',
    description: 'Transform into mineral or earthen forms',
    effectIcon: FaEarthAmericas
  }
};

// Duration types
const DURATION_TYPES = [
  { id: 'rounds', name: 'Rounds', description: 'Combat rounds (approx. 6 seconds each)', icon: 'inv_misc_pocketwatch_01' },
  { id: 'minutes', name: 'Minutes', description: 'Real-time minutes', icon: 'inv_misc_pocketwatch_02' },
  { id: 'hours', name: 'Hours', description: 'Real-time hours', icon: 'inv_misc_pocketwatch_03' }
];

// Target types
const TARGET_TYPES = [
  { id: 'self', name: 'Self', icon: 'spell_shadow_charm', description: 'Transform yourself' },
  { id: 'willing', name: 'Willing Creature', icon: 'spell_shadow_soulfeast', description: 'Transform another willing creature' },
  { id: 'unwilling', name: 'Unwilling Creature', icon: 'spell_shadow_possession', description: 'Force transformation on an unwilling target (requires saving throw)' }
];

// Beast form options
const BEAST_FORMS = [
  { id: 'wolf', name: 'Wolf Form', icon: 'ability_mount_blackdirewolf', cr: 1, description: 'Gain enhanced speed and tracking abilities' },
  { id: 'bear', name: 'Bear Form', icon: 'ability_hunter_pet_bear', cr: 2, description: 'Gain exceptional strength and durability' },
  { id: 'eagle', name: 'Eagle Form', icon: 'inv_misc_bird_01', cr: 1, description: 'Transform into a flying creature with keen eyesight' },
  { id: 'spider', name: 'Spider Form', icon: 'ability_hunter_pet_spider', cr: 1, description: 'Gain wall climbing and web abilities' },
  { id: 'tiger', name: 'Tiger Form', icon: 'ability_druid_catform', cr: 2, description: 'Enhanced stealth and powerful attacks' }
];

// Disguise form options
const DISGUISE_FORMS = [
  { id: 'specific_person', name: 'Specific Person', icon: 'spell_shadow_charm', cr: 1, description: 'Transform to look exactly like a specific individual' },
  { id: 'generic_type', name: 'Generic Type', icon: 'inv_helmet_44', cr: 1, description: 'Transform to look like a generic member of a race or group' },
  { id: 'aged', name: 'Aged Form', icon: 'inv_misc_head_elf_01', cr: 1, description: 'Change apparent age (younger or older)' },
  { id: 'gender_swap', name: 'Gender Swap', icon: 'achievement_character_gnome_female', cr: 1, description: 'Transform to appear as a different gender' },
  { id: 'monstrous_humanoid', name: 'Monstrous Humanoid', icon: 'inv_misc_head_orc_01', cr: 2, description: 'Transform into a humanoid with monstrous features' }
];

// Water form options
const WATER_FORMS = [
  { id: 'water_breathing', name: 'Water Breathing', icon: 'spell_shadow_demonbreath', cr: 1, description: 'Transform lungs to breathe underwater' },
  { id: 'fish_form', name: 'Fish Form', icon: 'inv_misc_fish_06', cr: 1, description: 'Transform into an aquatic creature' },
  { id: 'water_elemental', name: 'Water Elemental', icon: 'spell_frost_summonwaterelemental', cr: 3, description: 'Transform into a being of living water' },
  { id: 'liquid_form', name: 'Liquid Form', icon: 'spell_nature_acid_01', cr: 2, description: 'Transform into semi-liquid state that can flow through small openings' },
  { id: 'ice_form', name: 'Ice Form', icon: 'spell_frost_glacier', cr: 2, description: 'Transform into a crystalline ice being' }
];

// Air form options
const AIR_FORMS = [
  { id: 'mist_form', name: 'Mist Form', icon: 'spell_nature_faeriefire', cr: 2, description: 'Transform into misty, semi-corporeal state' },
  { id: 'wind_form', name: 'Wind Form', icon: 'spell_nature_cyclone', cr: 3, description: 'Transform into a swirling vortex of air' },
  { id: 'flying_form', name: 'Flying Form', icon: 'spell_shadow_demonform', cr: 2, description: 'Grow wings and gain flight ability' },
  { id: 'levitation', name: 'Levitation Form', icon: 'spell_nature_astralrecal', cr: 1, description: 'Body becomes lighter than air, allowing floating' },
  { id: 'storm_form', name: 'Storm Form', icon: 'spell_fire_bluefire', cr: 3, description: 'Transform into a being of lightning and thunder' }
];

// Earth form options
const EARTH_FORMS = [
  { id: 'stone_form', name: 'Stone Form', icon: 'spell_nature_stoneskintotem', cr: 2, description: 'Skin transforms to stone, greatly increasing defense' },
  { id: 'earth_elemental', name: 'Earth Elemental', icon: 'spell_nature_earthelemental_totem', cr: 3, description: 'Transform into a being of living earth' },
  { id: 'crystaline_form', name: 'Crystalline Form', icon: 'inv_elemental_crystal_earth', cr: 2, description: 'Transform into a semi-transparent crystal being' },
  { id: 'metal_form', name: 'Metallic Form', icon: 'inv_sword_26', cr: 3, description: 'Skin transforms into metal, granting exceptional protection' },
  { id: 'burrowing_form', name: 'Burrowing Form', icon: 'inv_misc_head_kobold_01', cr: 2, description: 'Gain ability to tunnel through earth and stone' }
];

// Saving throw types
const SAVING_THROW_TYPES = [
  { id: 'str', name: 'Strength', icon: 'spell_nature_strength' },
  { id: 'dex', name: 'Dexterity', icon: 'ability_rogue_quickrecovery' },
  { id: 'con', name: 'Constitution', icon: 'spell_holy_blessingofstamina' },
  { id: 'int', name: 'Intelligence', icon: 'spell_holy_magicalsentry' },
  { id: 'wis', name: 'Wisdom', icon: 'spell_holy_elunesblessing' },
  { id: 'cha', name: 'Charisma', icon: 'spell_holy_powerwordshield' }
];

// Difficulty levels
const DIFFICULTY_LEVELS = [
  { id: 'easy', name: 'Easy (DC 10)', description: 'Simple task, most should succeed' },
  { id: 'moderate', name: 'Moderate (DC 15)', description: 'Challenging, requires some skill' },
  { id: 'hard', name: 'Hard (DC 20)', description: 'Difficult, requires expertise' },
  { id: 'very_hard', name: 'Very Hard (DC 25)', description: 'Extremely difficult, masters may fail' }
];

// Ability grant options
const ABILITY_OPTIONS = [
  { id: 'natural_weapons', name: 'Natural Weapons', icon: 'ability_druid_catform', description: 'Claws, teeth, horns, etc.' },
  { id: 'enhanced_senses', name: 'Enhanced Senses', icon: 'spell_nature_eyeoftheowl', description: 'Improved sight, hearing, smell' },
  { id: 'natural_armor', name: 'Natural Armor', icon: 'inv_shield_04', description: 'Tough hide, scales, or fur' },
  { id: 'special_movement', name: 'Special Movement', icon: 'ability_rogue_sprint', description: 'Swimming, climbing, burrowing, etc.' },
  { id: 'special_attack', name: 'Special Attack', icon: 'spell_fire_flamebolt', description: 'Breath weapon, poison, etc.' },
  { id: 'size_change', name: 'Size Change', icon: 'spell_nature_wispsplode', description: 'Grow larger or smaller' }
];

const TransformationEffects = ({ state, dispatch, actionCreators, getDefaultFormula }) => {
  // Initialize with default transform type from state or 'beast_form'
  const [activeTransformType, setActiveTransformType] = useState(
    state.transformConfig?.transformType || 'beast_form'
  );

  // Initialize with selected form from state or null
  const [selectedForm, setSelectedForm] = useState(null);

  // Initialize with selected abilities from state or empty array
  const [selectedAbilities, setSelectedAbilities] = useState([]);

  // State for tooltip
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Transform configuration state - initialized from existing state or defaults
  const transformConfig = state.transformConfig || {
    transformType: 'beast_form',
    formId: null,
    targetType: 'self',
    duration: 10,
    durationUnit: 'minutes',
    concentration: true,
    maintainEquipment: false,
    difficultyClass: 15,
    difficultyCr: 'moderate',
    saveType: 'wis',
    grantedAbilities: [],
    formula: getDefaultFormula ? getDefaultFormula() : '1d6'
  };

  // Effect to update state when transform type changes
  useEffect(() => {
    // If transform type changed, update in config
    if (activeTransformType !== transformConfig.transformType) {
      handleTransformConfigChange('transformType', activeTransformType);

      // Reset selected form for the new type
      handleTransformConfigChange('formId', null);
      setSelectedForm(null);

      // Reset selected abilities
      handleTransformConfigChange('grantedAbilities', []);
      setSelectedAbilities([]);
    }
  }, [activeTransformType]);

  // Effect to initialize selected abilities from config
  useEffect(() => {
    if (transformConfig.grantedAbilities && transformConfig.grantedAbilities.length > 0) {
      setSelectedAbilities(transformConfig.grantedAbilities);
    }
  }, []);

  // Handle transform configuration changes
  const handleTransformConfigChange = (field, value) => {
    const newConfig = {
      ...transformConfig,
      [field]: value
    };

    // Special handling for difficulty level changes
    if (field === 'difficultyCr') {
      const dcMap = { easy: 10, moderate: 15, hard: 20, very_hard: 25 };
      newConfig.difficultyClass = dcMap[value] || 15;
    }

    dispatch(actionCreators.updateTransformConfig(newConfig));
  };

  // Get transformation forms based on the type
  const getTransformForms = (transformType) => {
    switch (transformType) {
      case 'beast_form': return BEAST_FORMS;
      case 'disguise': return DISGUISE_FORMS;
      case 'water_form': return WATER_FORMS;
      case 'air_form': return AIR_FORMS;
      case 'earth_form': return EARTH_FORMS;
      default: return [];
    }
  };

  // Get WoW-style icon URL
  const getIconUrl = (iconName) => {
    if (!iconName) return '';
    return `https://wow.zamimg.com/images/wow/icons/large/${iconName}.jpg`;
  };

  // Format transformation type for display
  const formatTransformType = (type) => {
    if (!type) return '';

    // Handle specific transformation types
    switch (type) {
      case 'beast_form': return 'Beast Form';
      case 'water_form': return 'Water Form';
      case 'air_form': return 'Air Form';
      case 'earth_form': return 'Earth Form';
      default:
        // Generic formatting for other types
        return type.split('_')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
    }
  };

  // Get flavor text based on transformation type
  const getTransformationFlavorText = (type) => {
    if (!type) return '';

    switch (type) {
      case 'beast_form': return '"Your body shifts and changes, taking on bestial aspects."';
      case 'disguise': return '"Your appearance alters, becoming someone else entirely."';
      case 'water_form': return '"Your form becomes fluid, flowing like water."';
      case 'air_form': return '"Your body becomes light as air, almost ethereal."';
      case 'earth_form': return '"Your flesh hardens into living stone or metal."';
      default: return '"Your form transforms in mysterious ways."';
    }
  };

  // Handle tooltip mouse events
  const handleMouseEnter = (data, e) => {
    // Create WoW Classic style tooltip content
    const tooltipContent = (
      <div>
        <div className="tooltip-stat-line">
          {data.description}
        </div>

        {/* Additional information based on data type */}
        {data.cr && (
          <div className="tooltip-effect">
            <span className="tooltip-gold">Challenge Rating:</span> {data.cr}
          </div>
        )}

        {data.transformType && (
          <div className="tooltip-effect">
            <span className="tooltip-gold">Form Type:</span> {formatTransformType(data.transformType)}
          </div>
        )}

        {/* Ability information if applicable */}
        {data.category === 'ability' && (
          <>
            <div className="tooltip-divider"></div>
            <div className="tooltip-casttime">
              <span className="tooltip-gold">Ability Type:</span> {data.name}
            </div>
          </>
        )}

        {/* Flavor text based on transformation type */}
        <div className="tooltip-divider"></div>
        <div className="tooltip-flavor-text">
          {getTransformationFlavorText(data.transformType)}
        </div>
      </div>
    );

    // Store the tooltip data including title and icon
    setTooltipContent({
      content: tooltipContent,
      title: data.name,
      icon: data.icon
    });
    setShowTooltip(true);
    // Update position using client coordinates for fixed positioning
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (showTooltip) {
      setMousePos({ x: e.clientX, y: e.clientY });
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  // Select a transformation form
  const selectForm = (form) => {
    setSelectedForm(form);
    handleTransformConfigChange('formId', form.id);
  };

  // Toggle ability selection
  const toggleAbility = (ability) => {
    let newAbilities = [...selectedAbilities];
    const index = newAbilities.findIndex(a => a.id === ability.id);

    if (index >= 0) {
      // Remove if already selected
      newAbilities.splice(index, 1);
    } else {
      // Add if not selected (limited to 3)
      if (newAbilities.length < 3) {
        newAbilities.push(ability);
      } else {
        // Replace oldest selection if already at limit
        newAbilities.shift();
        newAbilities.push(ability);
      }
    }

    setSelectedAbilities(newAbilities);
    handleTransformConfigChange('grantedAbilities', newAbilities);
  };

  // Render the transformation type selection
  const renderTransformTypeSelection = () => {
    return (
      <div className="spell-wizard-card-grid">
        {Object.values(TRANSFORMATION_TYPES).map((transformType) => (
          <div
            key={transformType.id}
            className={`spell-wizard-card ${activeTransformType === transformType.id ? 'selected' : ''}`}
            onClick={() => setActiveTransformType(transformType.id)}
            onMouseEnter={(e) => handleMouseEnter({...transformType, transformType: transformType.id}, e)}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
          >
            <div className="spell-wizard-card-icon">
              <img
                src={getIconUrl(transformType.icon)}
                alt={transformType.name}
              />
            </div>
            <h4>{transformType.name}</h4>
            <p>{transformType.description}</p>
          </div>
        ))}
      </div>
    );
  };

  // Render target type selection
  const renderTargetTypeSelection = () => {
    return (
      <div className="section">
        <h3 className="section-title">Target Type</h3>

        <div className="spell-wizard-card-grid">
          {TARGET_TYPES.map(type => (
            <div
              key={type.id}
              className={`spell-wizard-card ${transformConfig.targetType === type.id ? 'selected' : ''}`}
              onClick={() => handleTransformConfigChange('targetType', type.id)}
              onMouseEnter={(e) => handleMouseEnter(type, e)}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
            >
              <div className="spell-wizard-card-icon">
                <img
                  src={getIconUrl(type.icon)}
                  alt={type.name}
                />
              </div>
              <h4>{type.name}</h4>
              <p>{type.description}</p>
            </div>
          ))}
        </div>

        {/* Show saving throw settings if targeting unwilling creatures */}
        {transformConfig.targetType === 'unwilling' && (
          <div className="section-panel">
            <div className="section-panel-header">
              <h4>Saving Throw Settings</h4>
            </div>

            <div className="section-panel-content">
              {/* Difficulty Class */}
              <div className="quantity-row">
                <div className="quantity-icon">
                  <img src={getIconUrl('spell_holy_sealofprotection')} alt="DC" />
                </div>

                <div className="quantity-info">
                  <h5>Difficulty Class (DC)</h5>
                  <p>How hard it is to resist the transformation</p>
                </div>

                <div className="quantity-controls">
                  <button
                    className="effect-numeric-button"
                    onClick={() => handleTransformConfigChange('difficultyClass', Math.max(5, transformConfig.difficultyClass - 1))}
                  >
                    <FaMinus />
                  </button>
                  <input
                    type="number"
                    min="5"
                    max="30"
                    value={transformConfig.difficultyClass}
                    onChange={(e) => {
                      const dc = Math.max(5, Math.min(30, parseInt(e.target.value) || 15));
                      handleTransformConfigChange('difficultyClass', dc);
                    }}
                  />
                  <button
                    className="effect-numeric-button"
                    onClick={() => handleTransformConfigChange('difficultyClass', Math.min(30, transformConfig.difficultyClass + 1))}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>

              {/* Saving Throw Type */}
              <div className="duration-type-selection">
                <label>Saving Throw Type:</label>
                <div className="effect-option-tabs">
                  {SAVING_THROW_TYPES.map(ability => (
                    <div
                      key={ability.id}
                      className={`effect-option-tab ${transformConfig.saveType === ability.id ? 'selected' : ''}`}
                      onClick={() => handleTransformConfigChange('saveType', ability.id)}
                      onMouseEnter={(e) => handleMouseEnter(ability, e)}
                      onMouseLeave={handleMouseLeave}
                      onMouseMove={handleMouseMove}
                    >
                      <div className="effect-option-tab-icon">
                        <img src={getIconUrl(ability.icon)} alt={ability.name} />
                      </div>
                      <div className="effect-option-tab-name">{ability.name}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Difficulty Level */}
              <div className="duration-type-selection">
                <label>Suggested Difficulty:</label>
                <div className="effect-option-tabs">
                  {DIFFICULTY_LEVELS.map(level => (
                    <div
                      key={level.id}
                      className={`effect-option-tab ${transformConfig.difficultyCr === level.id ? 'selected' : ''}`}
                      onClick={() => handleTransformConfigChange('difficultyCr', level.id)}
                      onMouseEnter={(e) => handleMouseEnter(level, e)}
                      onMouseLeave={handleMouseLeave}
                      onMouseMove={handleMouseMove}
                    >
                      <div className="effect-option-tab-name">{level.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render duration and concentration settings
  const renderDurationSettings = () => {
    return (
      <div className="section">
        <h3 className="section-title">Duration & Equipment</h3>

        <div className="spell-wizard-card-grid">
          {/* Duration toggle card */}
          <div className="spell-wizard-card">
            <div className="spell-wizard-card-icon">
              <img src={getIconUrl('inv_misc_pocketwatch_01')} alt="Duration" />
            </div>
            <h4>Duration</h4>
            <p>Set how long the transformation lasts</p>
          </div>

          {/* Concentration toggle card */}
          <div className="spell-wizard-card">
            <div className="spell-wizard-card-icon">
              <img src={getIconUrl('spell_holy_mindsooth')} alt="Concentration" />
            </div>
            <h4>Concentration</h4>
            <p>Requires maintaining focus</p>

            <div className="effect-toggle-switch-container">
              <div
                className={`effect-toggle-switch ${transformConfig.concentration ? 'active' : ''}`}
                onClick={() => handleTransformConfigChange('concentration', !transformConfig.concentration)}
              >
                <div className="effect-toggle-slider"></div>
              </div>
            </div>

            {transformConfig.concentration && (
              <small>Transformation ends if concentration breaks</small>
            )}
          </div>

          {/* Equipment toggle card */}
          <div className="spell-wizard-card">
            <div className="spell-wizard-card-icon">
              <img src={getIconUrl('inv_chest_cloth_17')} alt="Equipment" />
            </div>
            <h4>Equipment</h4>
            <p>How equipment is handled during transformation</p>

            <div className="effect-toggle-switch-container">
              <div
                className={`effect-toggle-switch ${transformConfig.maintainEquipment ? 'active' : ''}`}
                onClick={() => handleTransformConfigChange('maintainEquipment', !transformConfig.maintainEquipment)}
              >
                <div className="effect-toggle-slider"></div>
              </div>
            </div>

            {transformConfig.maintainEquipment ? (
              <small>Equipment transforms with target</small>
            ) : (
              <small>Equipment falls to the ground</small>
            )}
          </div>
        </div>

        {/* Duration settings panel */}
        <div className="section-panel">
          <div className="section-panel-header">
            <h4>Duration Settings</h4>
          </div>

          <div className="section-panel-content">
            {/* Duration type selection */}
            <div className="duration-type-selection">
              <div className="effect-option-tabs">
                {DURATION_TYPES.map(type => (
                  <div
                    key={type.id}
                    className={`effect-option-tab ${transformConfig.durationUnit === type.id ? 'selected' : ''}`}
                    onClick={() => handleTransformConfigChange('durationUnit', type.id)}
                  >
                    <div className="effect-option-tab-icon">
                      <img
                        src={getIconUrl(type.icon)}
                        alt={type.name}
                      />
                    </div>
                    <div className="effect-option-tab-name">{type.name}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Duration value input */}
            <div className="duration-value-input">
              <label>Duration Value:</label>
              <div className="effect-numeric-controls">
                <button
                  className="effect-numeric-button"
                  onClick={() => handleTransformConfigChange('duration', Math.max(1, transformConfig.duration - 1))}
                >
                  <FaMinus />
                </button>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={transformConfig.duration}
                  onChange={(e) => {
                    const duration = Math.max(1, Math.min(100, parseInt(e.target.value) || 1));
                    handleTransformConfigChange('duration', duration);
                  }}
                />
                <button
                  className="effect-numeric-button"
                  onClick={() => handleTransformConfigChange('duration', Math.min(100, transformConfig.duration + 1))}
                >
                  <FaPlus />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render form selection
  const renderFormSelection = () => {
    const transformForms = getTransformForms(activeTransformType);

    if (!transformForms.length) {
      return (
        <div className="section">
          <h3 className="section-title">Form Selection</h3>
          <div className="section-panel">
            <div className="section-panel-content">
              <div className="effect-description">
                No forms available for this transformation type.
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="section">
        <h3 className="section-title">Form Selection</h3>

        <div className="spell-wizard-card-grid">
          {transformForms.map(form => (
            <div
              key={form.id}
              className={`spell-wizard-card ${transformConfig.formId === form.id ? 'selected' : ''}`}
              onClick={() => selectForm(form)}
              onMouseEnter={(e) => handleMouseEnter(form, e)}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
            >
              <div className="spell-wizard-card-icon">
                <img
                  src={getIconUrl(form.icon)}
                  alt={form.name}
                />
              </div>
              <h4>{form.name}</h4>
              <p>{form.description}</p>
              <small>CR {form.cr}</small>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Render ability selection
  const renderAbilitySelection = () => {
    if (!transformConfig.formId) {
      return null;
    }

    return (
      <div className="section">
        <h3 className="section-title">Granted Abilities</h3>

        <div className="section-panel">
          <div className="section-panel-header">
            <h4>Special Abilities (Choose up to 3)</h4>
          </div>

          <div className="section-panel-content">
            <div className="spell-wizard-card-grid small">
              {ABILITY_OPTIONS.map(ability => {
                const isSelected = selectedAbilities.some(a => a.id === ability.id);

                return (
                  <div
                    key={ability.id}
                    className={`spell-wizard-card ${isSelected ? 'selected' : ''}`}
                    onClick={() => toggleAbility(ability)}
                    onMouseEnter={(e) => handleMouseEnter({...ability, category: 'ability'}, e)}
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={handleMouseMove}
                  >
                    <div className="spell-wizard-card-icon">
                      <img
                        src={getIconUrl(ability.icon)}
                        alt={ability.name}
                      />
                    </div>
                    <h4>{ability.name}</h4>
                    <p>{ability.description}</p>
                  </div>
                );
              })}
            </div>

            <div className="range-description">
              Select up to three special abilities granted by the transformation. These will be in addition to the basic capabilities of the chosen form.
            </div>

            {selectedAbilities.length > 0 && (
              <div className="selected-abilities">
                <h5>Selected Abilities:</h5>
                <div className="selected-abilities-list">
                  {selectedAbilities.map((ability, index) => (
                    <div key={ability.id} className="selected-ability">
                      <span className="ability-number">{index + 1}.</span>
                      <span className="ability-name">{ability.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Render transformation preview
  const renderTransformationPreview = () => {
    if (!transformConfig.formId) {
      return null;
    }

    const transformType = TRANSFORMATION_TYPES[activeTransformType.toUpperCase()];
    const form = getTransformForms(activeTransformType).find(f => f.id === transformConfig.formId);

    if (!transformType || !form) {
      return null;
    }

    // Generate transformation description
    const targetText = transformConfig.targetType === 'self' ? 'yourself' :
                      transformConfig.targetType === 'willing' ? 'a willing creature' :
                      'an unwilling creature';
    const durationText = `for ${transformConfig.duration} ${transformConfig.durationUnit}`;
    const concentrationText = transformConfig.concentration ? ' (requires concentration)' : '';
    const equipmentText = transformConfig.maintainEquipment ?
                        'Equipment and clothing transform with the target.' :
                        'Equipment and clothing fall to the ground.';
    const saveText = transformConfig.targetType === 'unwilling' ?
                    `Target must make a DC ${transformConfig.difficultyClass} ${SAVING_THROW_TYPES.find(s => s.id === transformConfig.saveType)?.name || 'Wisdom'} saving throw to resist.` :
                    '';

    const transformDescription = `You transform ${targetText} into ${form.name.toLowerCase()} ${durationText}${concentrationText}. ${equipmentText} ${saveText}`;

    return (
      <div className="section">
        <h3 className="section-title">Transformation Preview</h3>

        <div className="preview-container">
          <div className="preview-header">
            <div className="preview-icon">
              <img src={getIconUrl(form.icon)} alt={form.name} />
            </div>
            <div className="preview-title">
              <h4>{transformType.name}: {form.name}</h4>
              <p>
                {transformConfig.targetType === 'self' ? 'Self' :
                transformConfig.targetType === 'willing' ? 'Willing Target' :
                'Unwilling Target'} •
                {`${transformConfig.duration} ${transformConfig.durationUnit}`}
                {transformConfig.concentration ? ' • Concentration' : ''}
              </p>
            </div>
          </div>

          <div className="preview-description">
            {transformDescription}
          </div>

          <div className="preview-details">
            {selectedAbilities.length > 0 && (
              <div className="preview-row">
                <div className="preview-label">Granted Abilities:</div>
                <div className="preview-value">
                  {selectedAbilities.map(ability => ability.name).join(', ')}
                </div>
              </div>
            )}

            <div className="preview-row">
              <div className="preview-label">Equipment:</div>
              <div className="preview-value">
                {transformConfig.maintainEquipment ? 'Transforms with target' : 'Drops to ground'}
              </div>
            </div>

            {transformConfig.targetType === 'unwilling' && (
              <div className="preview-row">
                <div className="preview-label">Saving Throw:</div>
                <div className="preview-value">
                  DC {transformConfig.difficultyClass} {SAVING_THROW_TYPES.find(s => s.id === transformConfig.saveType)?.name || 'Wisdom'}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="effects-container">
      <div className="section">
        <h3 className="section-title">Transformation Type</h3>
        <p>
          Transform yourself or others into different forms
        </p>

        {/* Transformation Type Selection */}
        {renderTransformTypeSelection()}
      </div>

      {/* Target Type Selection */}
      {renderTargetTypeSelection()}

      {/* Form Selection */}
      {renderFormSelection()}

      {/* Ability Selection - only if a form is selected */}
      {renderAbilitySelection()}

      {/* Duration & Equipment Settings */}
      {renderDurationSettings()}

      {/* Transformation Preview - only if a form is selected */}
      {renderTransformationPreview()}

      {/* Tooltip */}
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

export default TransformationEffects;