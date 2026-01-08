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

// Transformation types (for creature library)
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

// Custom transformation types (for self-enhancement / non-creature transformations)
export const CUSTOM_TRANSFORMATION_TYPES = [
  { id: 'physical', name: 'Physical Transformation', icon: 'ability_warrior_strengthofarms', description: 'Enhance physical attributes - strength, muscles, resilience' },
  { id: 'elemental', name: 'Elemental Transformation', icon: 'spell_fire_burnout', description: 'Take on elemental properties - fire, ice, lightning, etc.' },
  { id: 'mental', name: 'Mental Transformation', icon: 'spell_holy_mindvision', description: 'Enhance mental capabilities - focus, perception, willpower' },
  { id: 'spectral', name: 'Spectral Form', icon: 'spell_shadow_possession', description: 'Become ghostly or ethereal' },
  { id: 'ascended', name: 'Ascended Form', icon: 'spell_holy_divineillumination', description: 'Transcend mortal limitations temporarily' },
  { id: 'demonic', name: 'Demonic Form', icon: 'spell_shadow_metamorphosis', description: 'Take on demonic characteristics' },
  { id: 'divine', name: 'Divine Form', icon: 'spell_holy_holyprotection', description: 'Channel divine power through your form' },
  { id: 'primal', name: 'Primal Form', icon: 'ability_druid_primalprecision', description: 'Tap into primal, bestial energy' },
  { id: 'shadow', name: 'Shadow Form', icon: 'spell_shadow_shadowform', description: 'Merge with shadows, becoming darkness' },
  { id: 'arcane', name: 'Arcane Form', icon: 'spell_arcane_arcane04', description: 'Infuse your form with raw arcane energy' }
];

// Power levels for custom transformations
const POWER_LEVELS = [
  { id: 'minor', name: 'Minor', description: 'Small enhancement, subtle changes' },
  { id: 'moderate', name: 'Moderate', description: 'Noticeable transformation, significant bonuses' },
  { id: 'major', name: 'Major', description: 'Dramatic transformation, powerful effects' }
];

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
  // Mode: 'creature' for creature library, 'custom' for custom transformations
  const [transformMode, setTransformMode] = useState(
    state.transformConfig?.isCustom ? 'custom' : 'creature'
  );

  // Initialize with default transform type from state or 'beast_form'
  const [activeTransformType, setActiveTransformType] = useState(
    state.transformConfig?.transformType || 'beast_form'
  );

  // Initialize with selected form from state or null
  const [selectedForm, setSelectedForm] = useState(null);

  // Initialize with selected abilities from state or empty array
  const [selectedAbilities, setSelectedAbilities] = useState([]);

  // Custom transformation state
  const [customFormName, setCustomFormName] = useState(state.transformConfig?.newForm || '');
  const [customDescription, setCustomDescription] = useState(state.transformConfig?.description || '');
  const [customTransformationType, setCustomTransformationType] = useState(state.transformConfig?.transformationType || 'physical');
  const [customPower, setCustomPower] = useState(state.transformConfig?.power || 'moderate');
  const [customAbilities, setCustomAbilities] = useState(state.transformConfig?.grantedAbilities || []);
  const [newAbilityName, setNewAbilityName] = useState('');
  const [newAbilityDescription, setNewAbilityDescription] = useState('');

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
    formula: getDefaultFormula ? getDefaultFormula() : '1d6',
    isCustom: false
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

  // Handle mode change
  const handleModeChange = (mode) => {
    setTransformMode(mode);
    
    // Update the config with the mode
    const newConfig = {
      ...transformConfig,
      isCustom: mode === 'custom'
    };
    
    // If switching to custom mode, clear creature data
    if (mode === 'custom') {
      newConfig.selectedCreature = null;
      newConfig.formId = null;
      // Set custom defaults
      newConfig.transformationType = customTransformationType;
      newConfig.newForm = customFormName;
      newConfig.description = customDescription;
      newConfig.power = customPower;
      newConfig.grantedAbilities = customAbilities;
    } else {
      // If switching to creature mode, clear custom data
      newConfig.transformationType = null;
      newConfig.newForm = null;
      newConfig.description = null;
      newConfig.power = null;
    }
    
    dispatch(actionCreators.updateTransformConfig(newConfig));
  };

  // Handle custom transformation field changes
  const handleCustomFieldChange = (field, value) => {
    // Update local state
    switch (field) {
      case 'transformationType':
        setCustomTransformationType(value);
        break;
      case 'newForm':
        setCustomFormName(value);
        break;
      case 'description':
        setCustomDescription(value);
        break;
      case 'power':
        setCustomPower(value);
        break;
    }
    
    // Update the config
    const newConfig = {
      ...transformConfig,
      isCustom: true,
      [field]: value
    };
    dispatch(actionCreators.updateTransformConfig(newConfig));
  };

  // Add custom ability
  const handleAddCustomAbility = () => {
    if (!newAbilityName.trim()) return;
    
    const newAbility = {
      id: `custom_ability_${Date.now()}`,
      name: newAbilityName.trim(),
      description: newAbilityDescription.trim() || newAbilityName.trim()
    };
    
    const updatedAbilities = [...customAbilities, newAbility];
    setCustomAbilities(updatedAbilities);
    setNewAbilityName('');
    setNewAbilityDescription('');
    
    // Update config
    const newConfig = {
      ...transformConfig,
      isCustom: true,
      grantedAbilities: updatedAbilities
    };
    dispatch(actionCreators.updateTransformConfig(newConfig));
  };

  // Remove custom ability
  const handleRemoveCustomAbility = (abilityId) => {
    const updatedAbilities = customAbilities.filter(a => a.id !== abilityId);
    setCustomAbilities(updatedAbilities);
    
    // Update config
    const newConfig = {
      ...transformConfig,
      isCustom: true,
      grantedAbilities: updatedAbilities
    };
    dispatch(actionCreators.updateTransformConfig(newConfig));
  };

  // Render mode selection
  const renderModeSelection = () => {
    return (
      <div className="section">
        <h3 className="section-title">Transformation Mode</h3>
        <div className="section-panel">
          <div className="section-panel-content">
            <div className="transform-mode-toggle">
              <button
                className={`transform-mode-btn ${transformMode === 'creature' ? 'active' : ''}`}
                onClick={() => handleModeChange('creature')}
              >
                <FaDragon style={{ marginRight: '8px' }} />
                Creature Library
              </button>
              <button
                className={`transform-mode-btn ${transformMode === 'custom' ? 'active' : ''}`}
                onClick={() => handleModeChange('custom')}
              >
                <FaPlus style={{ marginRight: '8px' }} />
                Custom Transformation
              </button>
            </div>
            <div className="range-description" style={{ marginTop: '8px' }}>
              {transformMode === 'creature' 
                ? 'Select a creature from the library to transform into. Use for shapeshifting, polymorph, or beast form spells.'
                : 'Create a custom transformation effect. Use for self-enhancement, power-ups, or unique transformation abilities.'}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Render custom transformation form
  const renderCustomTransformationForm = () => {
    if (transformMode !== 'custom') return null;

    return (
      <div className="section">
        <h3 className="section-title">Custom Transformation</h3>
        <div className="section-panel">
          <div className="section-panel-content">
            {/* Transformation Type Selection */}
            <div className="creature-config-section" style={{ marginBottom: '16px' }}>
              <div className="creature-config-header">
                <h6>Transformation Type</h6>
              </div>
              <div className="spell-wizard-card-grid small" style={{ marginTop: '8px' }}>
                {CUSTOM_TRANSFORMATION_TYPES.map(type => (
                  <div
                    key={type.id}
                    className={`spell-wizard-card ${customTransformationType === type.id ? 'selected' : ''}`}
                    onClick={() => handleCustomFieldChange('transformationType', type.id)}
                    style={{ cursor: 'pointer' }}
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
            </div>

            {/* Form Name & Power */}
            <div className="creature-config-section" style={{ marginBottom: '16px' }}>
              <div className="creature-config-header">
                <h6>Transformation Details</h6>
              </div>
              <div className="creature-config-controls" style={{ marginTop: '8px' }}>
                <div className="creature-config-control" style={{ flex: 2 }}>
                  <label>Form Name (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g., Primal Apex, Shadow Form, etc."
                    value={customFormName}
                    onChange={(e) => handleCustomFieldChange('newForm', e.target.value)}
                  />
                </div>
                <div className="creature-config-control">
                  <label>Power Level</label>
                  <select
                    value={customPower}
                    onChange={(e) => handleCustomFieldChange('power', e.target.value)}
                  >
                    {POWER_LEVELS.map(level => (
                      <option key={level.id} value={level.id}>{level.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="creature-config-section" style={{ marginBottom: '16px' }}>
              <div className="creature-config-header">
                <h6>Description</h6>
              </div>
              <textarea
                className="custom-transform-description"
                placeholder="Describe what happens during this transformation..."
                value={customDescription}
                onChange={(e) => handleCustomFieldChange('description', e.target.value)}
                style={{ 
                  width: '100%', 
                  minHeight: '80px', 
                  marginTop: '8px',
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid var(--pf-border-light, #444)',
                  background: 'var(--pf-input-bg, #1a1a1a)',
                  color: 'var(--pf-text, #e0e0e0)',
                  resize: 'vertical'
                }}
              />
            </div>

            {/* Duration & Target (same as creature mode) */}
            <div className="creature-config-section" style={{ marginBottom: '16px' }}>
              <div className="creature-config-header">
                <h6>Transformation Settings</h6>
              </div>
              <div className="creature-config-controls" style={{ marginTop: '8px' }}>
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
              </div>
              {transformConfig.targetType === 'unwilling' && (
                <div className="creature-config-controls" style={{ marginTop: '8px' }}>
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
                </div>
              )}
            </div>

            {/* Custom Granted Abilities */}
            <div className="creature-config-section">
              <div className="creature-config-header">
                <h6>Granted Abilities</h6>
              </div>
              <div className="range-description" style={{ marginTop: '4px', marginBottom: '8px' }}>
                Add custom abilities granted by this transformation.
              </div>
              
              {/* Existing abilities list */}
              {customAbilities.length > 0 && (
                <div className="selected-abilities" style={{ marginBottom: '12px' }}>
                  {customAbilities.map((ability, index) => (
                    <div key={ability.id} className="selected-ability" style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '8px',
                      background: 'var(--pf-bg-dark, #1a1a1a)',
                      borderRadius: '4px',
                      marginBottom: '4px'
                    }}>
                      <div>
                        <span className="ability-number" style={{ marginRight: '8px', color: 'var(--pf-gold, #ffd100)' }}>{index + 1}.</span>
                        <span className="ability-name" style={{ fontWeight: 'bold' }}>{ability.name}</span>
                        {ability.description && ability.description !== ability.name && (
                          <span style={{ marginLeft: '8px', opacity: 0.7 }}>- {ability.description}</span>
                        )}
                      </div>
                      <button
                        onClick={() => handleRemoveCustomAbility(ability.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#ff4444',
                          cursor: 'pointer',
                          padding: '4px 8px'
                        }}
                      >
                        <FaCircleXmark />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Add new ability form */}
              <div className="creature-config-controls" style={{ marginTop: '8px' }}>
                <div className="creature-config-control" style={{ flex: 1 }}>
                  <label>Ability Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Damage Bonus, Fear Immunity"
                    value={newAbilityName}
                    onChange={(e) => setNewAbilityName(e.target.value)}
                  />
                </div>
                <div className="creature-config-control" style={{ flex: 2 }}>
                  <label>Description</label>
                  <input
                    type="text"
                    placeholder="e.g., +8 damage to all attacks"
                    value={newAbilityDescription}
                    onChange={(e) => setNewAbilityDescription(e.target.value)}
                  />
                </div>
                <div className="creature-config-control" style={{ flex: 0, alignSelf: 'flex-end' }}>
                  <button
                    onClick={handleAddCustomAbility}
                    disabled={!newAbilityName.trim()}
                    style={{
                      padding: '8px 16px',
                      background: newAbilityName.trim() ? 'var(--pf-accent, #4a90d9)' : '#444',
                      border: 'none',
                      borderRadius: '4px',
                      color: '#fff',
                      cursor: newAbilityName.trim() ? 'pointer' : 'not-allowed',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <FaPlus /> Add
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
      {/* Mode Selection - Choose between creature library and custom */}
      {renderModeSelection()}

      {/* Creature Library Mode */}
      {transformMode === 'creature' && (
        <>
          {/* Form Selection */}
          {renderFormSelection()}

          {/* Ability Selection - only if a form is selected */}
          {renderAbilitySelection()}
        </>
      )}

      {/* Custom Transformation Mode */}
      {renderCustomTransformationForm()}

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

      <style>{`
        .transform-mode-toggle {
          display: flex;
          gap: 8px;
        }
        .transform-mode-btn {
          flex: 1;
          padding: 12px 16px;
          background: var(--pf-bg-dark, #1a1a1a);
          border: 2px solid var(--pf-border-light, #444);
          border-radius: 6px;
          color: var(--pf-text, #e0e0e0);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 500;
          transition: all 0.2s ease;
        }
        .transform-mode-btn:hover {
          border-color: var(--pf-accent, #4a90d9);
          background: var(--pf-bg-hover, #252525);
        }
        .transform-mode-btn.active {
          border-color: var(--pf-accent, #4a90d9);
          background: var(--pf-accent-bg, rgba(74, 144, 217, 0.15));
          color: var(--pf-accent, #4a90d9);
        }
      `}</style>
    </div>
  );
};

export default TransformationEffects;