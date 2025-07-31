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
import { FaSearch } from 'react-icons/fa';
import CreatureSelectionWindow from '../../components/common/CreatureSelectionWindow';

// Pathfinder styles imported via main.css
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



// Saving throw types
const SAVING_THROW_TYPES = [
  { id: 'con', name: 'Constitution', icon: 'spell_holy_blessingofstamina' },
  { id: 'str', name: 'Strength', icon: 'spell_nature_strength' },
  { id: 'agi', name: 'Agility', icon: 'ability_rogue_quickrecovery' },
  { id: 'int', name: 'Intelligence', icon: 'spell_holy_magicalsentry' },
  { id: 'spirit', name: 'Spirit', icon: 'spell_holy_elunesblessing' },
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

  // State for creature selection window
  const [showCreatureSelection, setShowCreatureSelection] = useState(false);

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
    saveType: 'spirit',
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

  // Handle creature selection from the creature library
  const handleCreatureSelection = (selectedCreatures) => {
    if (selectedCreatures.length > 0) {
      const creature = selectedCreatures[0]; // Single selection for transformation
      setSelectedForm(creature);
      handleTransformConfigChange('formId', creature.id);
      handleTransformConfigChange('selectedCreature', creature);
    }
  };

  // Open creature selection window
  const openCreatureSelection = () => {
    setShowCreatureSelection(true);
  };

  // Close creature selection window
  const closeCreatureSelection = () => {
    setShowCreatureSelection(false);
  };

  // Transformation type selection removed - simplified to just creature selection

  // Target type selection removed - moved to creature config section

  // Duration and equipment settings removed as per user request

  // Render form selection
  const renderFormSelection = () => {
    const selectedCreature = transformConfig.selectedCreature;

    return (
      <div className="section">
        <h3 className="section-title">Creatures</h3>

        <div className="section-panel">
          <div className="section-panel-header">
            <h4>Selected Form</h4>
            <button
              className="summoning-select-btn"
              onClick={openCreatureSelection}
            >
              <FaSearch /> Select from Creature Library
            </button>
          </div>

          <div className="section-panel-content">
            {!selectedCreature ? (
              <div className="pf-empty-state">
                No transformation target selected. Click "Select from Creature Library" to choose a creature to transform into.
              </div>
            ) : (
              <div className="creature-selection-item">
                {/* Header Section - Title and Image */}
                <div className="creature-header-section">
                  <div className="creature-icon">
                    <img
                      src={getIconUrl(selectedCreature.tokenIcon)}
                      alt={selectedCreature.name}
                      onError={(e) => {
                        e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                      }}
                    />
                  </div>
                  <div className="creature-title-section">
                    <h4 className="creature-name">{selectedCreature.name}</h4>
                    <p className="creature-type-size">{selectedCreature.type} • {selectedCreature.size}</p>
                  </div>
                  <button
                    className="remove-creature-btn"
                    onClick={() => {
                      setSelectedForm(null);
                      handleTransformConfigChange('formId', null);
                      handleTransformConfigChange('selectedCreature', null);
                    }}
                    title="Remove transformation target"
                  >
                    ×
                  </button>
                </div>

                {/* Description Section */}
                <div className="creature-description-section">
                  <p className="creature-description">{selectedCreature.description}</p>
                </div>

                {/* Stats Section */}
                <div className="creature-stats-section">
                  <div className="creature-stats-grid">
                    <div className="stat-item">
                      <span className="stat-label">HP</span>
                      <span className="stat-value">{selectedCreature.stats?.maxHp || 'N/A'}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Mana</span>
                      <span className="stat-value">{selectedCreature.stats?.maxMana || 'N/A'}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">AP</span>
                      <span className="stat-value">{selectedCreature.stats?.maxAp || 'N/A'}</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-label">Armor</span>
                      <span className="stat-value">{selectedCreature.stats?.armor || 'N/A'}</span>
                    </div>
                  </div>
                </div>

                {/* Individual Transformation Settings */}
                <div className="creature-config-section">
                  <div className="creature-config-header">
                    <h6>Transformation Settings</h6>
                  </div>
                  <div className="creature-config-controls">
                    <div className="creature-config-control">
                      <label>Target Type</label>
                      <select
                        value={transformConfig.targetType || 'self'}
                        onChange={(e) => handleTransformConfigChange('targetType', e.target.value)}
                      >
                        <option value="self">Self</option>
                        <option value="willing">Willing Creature</option>
                        <option value="unwilling">Unwilling Creature</option>
                      </select>
                    </div>
                    <div className="creature-config-control">
                      <label>Duration</label>
                      <input
                        type="number"
                        min="1"
                        max="100"
                        value={transformConfig.duration || 10}
                        onChange={(e) => handleTransformConfigChange('duration', parseInt(e.target.value) || 10)}
                      />
                    </div>
                    <div className="creature-config-control">
                      <label>Duration Unit</label>
                      <select
                        value={transformConfig.durationUnit || 'minutes'}
                        onChange={(e) => handleTransformConfigChange('durationUnit', e.target.value)}
                      >
                        <option value="rounds">Rounds</option>
                        <option value="minutes">Minutes</option>
                        <option value="hours">Hours</option>
                      </select>
                    </div>
                    {transformConfig.targetType === 'unwilling' && (
                      <>
                        <div className="creature-config-control">
                          <label>Saving Throw</label>
                          <select
                            value={transformConfig.saveType || 'spirit'}
                            onChange={(e) => handleTransformConfigChange('saveType', e.target.value)}
                          >
                            <option value="con">Constitution</option>
                            <option value="str">Strength</option>
                            <option value="agi">Agility</option>
                            <option value="int">Intelligence</option>
                            <option value="spirit">Spirit</option>
                            <option value="cha">Charisma</option>
                          </select>
                        </div>
                        <div className="creature-config-control">
                          <label>Difficulty Class</label>
                          <input
                            type="number"
                            min="5"
                            max="30"
                            value={transformConfig.difficultyClass || 15}
                            onChange={(e) => handleTransformConfigChange('difficultyClass', parseInt(e.target.value) || 15)}
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
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

  // Preview section removed as per user request

  return (
    <div className="effects-container">
      {/* Form Selection */}
      {renderFormSelection()}

      {/* Ability Selection - only if a form is selected */}
      {renderAbilitySelection()}



      {/* Tooltip */}

      {/* Creature Selection Window */}
      <CreatureSelectionWindow
        isOpen={showCreatureSelection}
        onClose={closeCreatureSelection}
        onSelect={handleCreatureSelection}
        selectedCreatures={transformConfig.selectedCreature ? [transformConfig.selectedCreature] : []}
        multiSelect={false}
        title="Select Transformation Target"
        effectType="transform"
      />
    </div>
  );
};

export default TransformationEffects;