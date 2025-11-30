import React, { useState, useEffect } from 'react';
import {
  FaDragon,
  FaGhost,
  FaHandFist,
  FaShieldHalved,
  FaWandMagicSparkles,
  FaMinus,
  FaPlus,
  FaCircleInfo,
  FaArrowRightLong,
  FaCircleXmark,
  FaFire,
  FaHeart,
  FaStar,
  FaSkull,
  FaBolt,
  FaGear,
  FaPaw
} from 'react-icons/fa6';
import { FaSearch } from 'react-icons/fa';
import CreatureSelectionWindow from '../../components/common/CreatureSelectionWindow';

// Pathfinder styles imported via main.css
import './summoning-effects.css';



// Duration types
const DURATION_TYPES = [
  { id: 'rounds', name: 'Rounds', description: 'Combat rounds (approx. 6 seconds each)', icon: 'inv_misc_pocketwatch_01' },
  { id: 'minutes', name: 'Minutes', description: 'Real-time minutes', icon: 'inv_misc_pocketwatch_02' },
  { id: 'hours', name: 'Hours', description: 'Real-time hours', icon: 'inv_misc_pocketwatch_03' }
];

// Individual creature configuration defaults
const DEFAULT_CREATURE_CONFIG = {
  quantity: 1,
  duration: 10,
  durationUnit: 'minutes',
  hasDuration: true,
  concentration: false,
  controlType: 'verbal',
  controlRange: 60,
  attachedEffects: {} // New: effects attached to the summoned creature
};

// Difficulty levels
const DIFFICULTY_LEVELS = [
  { id: 'easy', name: 'Easy (CR 1-2)', description: 'Simple creatures, manageable for novices' },
  { id: 'moderate', name: 'Moderate (CR 3-4)', description: 'Challenging creatures with special abilities' },
  { id: 'hard', name: 'Hard (CR 5-6)', description: 'Powerful beings that require experience to control' },
  { id: 'very_hard', name: 'Very Hard (CR 7+)', description: 'Extremely powerful entities, only for masters' }
];

// Control range options
const CONTROL_RANGES = [
  { id: 30, name: '30 feet', description: 'Close range, tight control' },
  { id: 60, name: '60 feet', description: 'Medium range, standard control' },
  { id: 120, name: '120 feet', description: 'Long range, extended control' },
  { id: 300, name: '300 feet', description: 'Very long range, loose control' },
  { id: 0, name: 'Unlimited', description: 'No range limit, requires concentration' }
];

// Control types
const CONTROL_TYPES = [
  { id: 'verbal', name: 'Verbal Commands', icon: 'inv_misc_horn_01', description: 'Control through spoken orders' },
  { id: 'mental', name: 'Mental Link', icon: 'spell_arcane_mindmastery', description: 'Direct mental control of summons' },
  { id: 'empathic', name: 'Empathic Bond', icon: 'spell_holy_spiritualguidence', description: 'Emotional connection with summons' },
  { id: 'autonomous', name: 'Autonomous', icon: 'inv_misc_gem_sapphire_01', description: 'Summons follow preset behaviors' }
];

const SummoningEffects = ({ state, dispatch, actionCreators, getDefaultFormula, onChange }) => {
  // State for tooltip
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // State for creature selection window
  const [showCreatureSelection, setShowCreatureSelection] = useState(false);



  // Initialize with selected summon from state or null
  const [selectedSummons, setSelectedSummons] = useState([]);

  // Summoning configuration state - initialized from existing state or defaults
  const [summonConfig, setSummonConfig] = useState(() => {
    const defaultConfig = {
      creatures: [], // Changed to array for multiple selections
      duration: 10,
      durationUnit: 'minutes',
      hasDuration: true, // New field to toggle duration on/off
      concentration: true,
      quantity: 1,
      maxQuantity: 4,
      controlRange: 60,
      controlType: 'verbal',
      difficultyLevel: 'easy',
      // Simple trigger toggle
      waitForTrigger: false
    };

    // If there's state from the parent, merge it with our defaults
    if (state.summonConfig) {
      // Make sure to preserve the creatures array even if it doesn't exist in parent state
      return {
        ...defaultConfig,
        ...state.summonConfig,
        // Initialize creatures array if it doesn't exist in parent state
        creatures: state.summonConfig.creatures || []
      };
    }

    return defaultConfig;
  });

  // Effect to update parent state when summoning config changes
  useEffect(() => {
    if (dispatch && actionCreators.updateSummonConfig) {
      // Make sure we include all properties the parent component expects
      const parentConfig = {
        ...summonConfig,
        // Include these for backward compatibility
        creatureId: summonConfig.creatures?.[0]?.id || null,
        formula: getDefaultFormula ? getDefaultFormula() : '1d6'
      };

      dispatch(actionCreators.updateSummonConfig(parentConfig));
    }
  }, [summonConfig, dispatch, actionCreators, getDefaultFormula]);



  // Handle tooltip mouse events
  const handleMouseEnter = (data, e) => {
    // Create WoW Classic style tooltip content
    const tooltipContent = (
      <div>
        <div className="tooltip-stat-line">
          {data.content || data.description}
        </div>

        {/* Additional information based on data type */}
        {data.cr && (
          <div className="tooltip-effect">
            <span className="tooltip-gold">Challenge Rating:</span> {data.cr}
          </div>
        )}



        {/* Control information if applicable */}
        {data.controlType && (
          <>
            <div className="tooltip-divider"></div>
            <div className="tooltip-casttime">
              <span className="tooltip-gold">Control Method:</span> {data.controlType.charAt(0).toUpperCase() + data.controlType.slice(1)}
            </div>
          </>
        )}

        {/* Duration information if applicable */}
        {data.duration && (
          <div className="tooltip-casttime">
            <span className="tooltip-gold">Duration:</span> {data.duration} {data.durationUnit || 'minutes'}
          </div>
        )}

        {/* Creature count if applicable */}
        {data.maxCreatures && (
          <div className="tooltip-casttime">
            <span className="tooltip-gold">Max Creatures:</span> {data.maxCreatures}
          </div>
        )}

        {/* Flavor text for summoning */}
        <div className="tooltip-divider"></div>
        <div className="tooltip-flavor-text">
          "Creatures from the library answer your call, bound to your will."
        </div>
      </div>
    );

    // Store the tooltip data including title and icon
    setTooltipContent({
      content: tooltipContent,
      title: data.title || data.name,
      icon: data.icon
    });
    setShowTooltip(true);
    // Update position using client coordinates for fixed positioning
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    setTooltipContent(null);
  };

  // Handle summoning configuration changes
  const handleSummonConfigChange = (key, value) => {
    console.log(`Changing ${key} from ${summonConfig[key]} to ${value}`);

    setSummonConfig(prev => {
      const updated = {
        ...prev,
        [key]: value
      };

      // If we're updating the parent component
      if (dispatch && actionCreators.updateSummonConfig) {
        dispatch(actionCreators.updateSummonConfig(updated));
      }

      if (onChange) {
        onChange(updated);
      }

      return updated;
    });
  };



  // Add/remove a creature from the selected creatures
  const toggleCreatureSelection = (creature) => {
    setSummonConfig(prev => {
      const creatures = prev.creatures || [];

      // Check if the creature is already selected
      const creatureExists = creatures.some(c => c.id === creature.id);

      if (creatureExists) {
        // Remove the creature
        return {
          ...prev,
          creatures: creatures.filter(c => c.id !== creature.id)
        };
      } else {
        // Add the creature
        const newCreature = {
          ...creature
        };

        return {
          ...prev,
          creatures: [...creatures, newCreature]
        };
      }
    });
  };

  // Function to check if a creature is selected
  const isCreatureSelected = (creatureId) => {
    return (summonConfig.creatures || []).some(c => c.id === creatureId);
  };

  // Function to remove a specific creature from selection
  const handleRemoveCreature = (creatureId) => {
    setSummonConfig(prev => ({
      ...prev,
      creatures: (prev.creatures || []).filter(c => c.id !== creatureId)
    }));
  };

  // Function to clear all selected creatures
  const handleClearAllCreatures = () => {
    setSummonConfig(prev => ({
      ...prev,
      creatures: []
    }));
  };

  // Handle creature selection from the creature library
  const handleCreatureSelection = (selectedCreatures) => {
    setSummonConfig(prev => ({
      ...prev,
      creatures: selectedCreatures.map(creature => ({
        ...creature,
        config: { ...DEFAULT_CREATURE_CONFIG }
      }))
    }));
  };

  // Handle individual creature configuration changes
  const handleCreatureConfigChange = (creatureId, configKey, value) => {
    setSummonConfig(prev => ({
      ...prev,
      creatures: prev.creatures.map(creature =>
        creature.id === creatureId
          ? {
              ...creature,
              config: {
                ...creature.config,
                [configKey]: value
              }
            }
          : creature
      )
    }));
  };

  // Handle attached effects changes
  const handleAttachedEffectChange = (creatureId, effectType, effectData) => {
    setSummonConfig(prev => ({
      ...prev,
      creatures: prev.creatures.map(creature =>
        creature.id === creatureId
          ? {
              ...creature,
              config: {
                ...creature.config,
                attachedEffects: {
                  ...creature.config.attachedEffects,
                  [effectType]: effectData
                }
              }
            }
          : creature
      )
    }));
  };

  // Remove an attached effect
  const handleRemoveAttachedEffect = (creatureId, effectKey) => {
    setSummonConfig(prev => ({
      ...prev,
      creatures: prev.creatures.map(creature =>
        creature.id === creatureId
          ? {
              ...creature,
              config: {
                ...creature.config,
                attachedEffects: (() => {
                  const newEffects = { ...creature.config.attachedEffects };
                  delete newEffects[effectKey];
                  return newEffects;
                })()
              }
            }
          : creature
      )
    }));
  };

  // Open creature selection window
  const openCreatureSelection = () => {
    setShowCreatureSelection(true);
  };

  // Close creature selection window
  const closeCreatureSelection = () => {
    setShowCreatureSelection(false);
  };

  // Toggle duration on/off
  const toggleDuration = () => {
    const hasDuration = !summonConfig.hasDuration;
    handleSummonConfigChange('hasDuration', hasDuration);

    // If turning off duration, also turn off concentration
    if (!hasDuration) {
      handleSummonConfigChange('concentration', false);
    }
  };



  // Get WoW-style icon URL
  const getIconUrl = (iconName) => {
    if (!iconName) return '';
    return `https://wow.zamimg.com/images/wow/icons/large/${iconName}.jpg`;
  };





  // Render creature selection
  const renderCreatureSelection = () => {
    const selectedCreatures = summonConfig.creatures || [];

    return (
      <div className="pf-creature-selection-container">
        <div className="pf-creature-header">
          <h4>Selected Creatures</h4>
          <button
            className="pf-button pf-button-primary"
            onClick={openCreatureSelection}
          >
            <FaSearch /> Select from Creature Library
          </button>
        </div>

        <div className="pf-creature-content">
          {selectedCreatures.length === 0 ? (
            <div className="pf-empty-state">
              No creatures selected. Click "Select from Creature Library" to choose creatures to summon.
            </div>
          ) : (
            <div className="selected-creatures-list">
              {selectedCreatures.map((creature, index) => (
                <div key={`${creature.id}-${index}`} className="creature-selection-item">
                  {/* Improved creature layout with title and image at top */}
                  <div className="creature-header-section">
                    <div className="creature-icon">
                      <img
                        src={getIconUrl(creature.tokenIcon)}
                        alt={creature.name}
                        onError={(e) => {
                          e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                        }}
                      />
                    </div>
                    <div className="creature-title-section">
                      {creature.id?.startsWith('custom-summon') ? (
                        <input
                          type="text"
                          value={creature.name}
                          onChange={(e) => {
                            const updatedCreatures = summonConfig.creatures.map(c =>
                              c.id === creature.id
                                ? { ...c, name: e.target.value }
                                : c
                            );
                            setSummonConfig(prev => ({
                              ...prev,
                              creatures: updatedCreatures
                            }));
                          }}
                          className="creature-name-input"
                          placeholder="Entity Name"
                        />
                      ) : (
                        <h4 className="creature-name">{creature.name}</h4>
                      )}
                      <div className="creature-type-size">{creature.size} {creature.type}</div>
                      <button
                        className="remove-creature-btn"
                        onClick={() => handleRemoveCreature(creature.id)}
                        title="Remove creature"
                      >
                        <FaCircleXmark />
                      </button>
                    </div>
                  </div>

                  {/* Creature description */}
                  <div className="creature-description-section">
                    <p className="creature-description">
                      {creature.description || 'A mysterious creature with unknown origins and capabilities.'}
                    </p>
                  </div>

                    {/* Creature stats in a clean grid */}
                  <div className="creature-stats-section">
                    <div className="creature-stats-grid">
                      <div className="stat-item">
                        <span className="stat-label">HP</span>
                        {creature.id?.startsWith('custom-summon') ? (
                          <input
                            type="number"
                            min="1"
                            max="1000"
                            value={creature.stats?.maxHp || 50}
                            onChange={(e) => {
                              const updatedCreatures = summonConfig.creatures.map(c =>
                                c.id === creature.id
                                  ? {
                                      ...c,
                                      stats: {
                                        ...c.stats,
                                        maxHp: parseInt(e.target.value) || 50
                                      }
                                    }
                                  : c
                              );
                              setSummonConfig(prev => ({
                                ...prev,
                                creatures: updatedCreatures
                              }));
                            }}
                            className="stat-input"
                          />
                        ) : (
                          <span className="stat-value">{creature.stats?.maxHp || 'N/A'}</span>
                        )}
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Mana</span>
                        {creature.id?.startsWith('custom-summon') ? (
                          <input
                            type="number"
                            min="0"
                            max="1000"
                            value={creature.stats?.maxMana || 0}
                            onChange={(e) => {
                              const updatedCreatures = summonConfig.creatures.map(c =>
                                c.id === creature.id
                                  ? {
                                      ...c,
                                      stats: {
                                        ...c.stats,
                                        maxMana: parseInt(e.target.value) || 0
                                      }
                                    }
                                  : c
                              );
                              setSummonConfig(prev => ({
                                ...prev,
                                creatures: updatedCreatures
                              }));
                            }}
                            className="stat-input"
                          />
                        ) : (
                          <span className="stat-value">{creature.stats?.maxMana || 'N/A'}</span>
                        )}
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Armor</span>
                        {creature.id?.startsWith('custom-summon') ? (
                          <input
                            type="number"
                            min="0"
                            max="50"
                            value={creature.stats?.armor || 15}
                            onChange={(e) => {
                              const updatedCreatures = summonConfig.creatures.map(c =>
                                c.id === creature.id
                                  ? {
                                      ...c,
                                      stats: {
                                        ...c.stats,
                                        armor: parseInt(e.target.value) || 15
                                      }
                                    }
                                  : c
                              );
                              setSummonConfig(prev => ({
                                ...prev,
                                creatures: updatedCreatures
                              }));
                            }}
                            className="stat-input"
                          />
                        ) : (
                          <span className="stat-value">{creature.stats?.armor || 'N/A'}</span>
                        )}
                      </div>
                      <div className="stat-item">
                        <span className="stat-label">Type</span>
                        {creature.id?.startsWith('custom-summon') ? (
                          <select
                            value={creature.type || 'elemental'}
                            onChange={(e) => {
                              const updatedCreatures = summonConfig.creatures.map(c =>
                                c.id === creature.id
                                  ? {
                                      ...c,
                                      type: e.target.value
                                    }
                                  : c
                              );
                              setSummonConfig(prev => ({
                                ...prev,
                                creatures: updatedCreatures
                              }));
                            }}
                            className="stat-select"
                          >
                            <option value="elemental">Elemental</option>
                            <option value="undead">Undead</option>
                            <option value="construct">Construct</option>
                            <option value="fiend">Fiend</option>
                            <option value="celestial">Celestial</option>
                            <option value="beast">Beast</option>
                          </select>
                        ) : (
                          <span className="stat-value">{creature.type || 'N/A'}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Individual creature configuration */}
                  <div className="creature-config-section">
                    <div className="creature-config-header">
                      <h6>Individual Settings</h6>
                    </div>
                    <div className="creature-config-controls">
                      <div className="creature-config-control">
                        <label>Quantity</label>
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={creature.config?.quantity || DEFAULT_CREATURE_CONFIG.quantity}
                          onChange={(e) => handleCreatureConfigChange(creature.id, 'quantity', parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div className="creature-config-control">
                        <label>Duration</label>
                        <input
                          type="number"
                          min="1"
                          max="100"
                          value={creature.config?.duration || DEFAULT_CREATURE_CONFIG.duration}
                          onChange={(e) => handleCreatureConfigChange(creature.id, 'duration', parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div className="creature-config-control">
                        <label>Duration Unit</label>
                        <select
                          value={creature.config?.durationUnit || DEFAULT_CREATURE_CONFIG.durationUnit}
                          onChange={(e) => handleCreatureConfigChange(creature.id, 'durationUnit', e.target.value)}
                        >
                          <option value="rounds">Rounds</option>
                          <option value="minutes">Minutes</option>
                          <option value="hours">Hours</option>
                        </select>
                      </div>
                      <div className="creature-config-control">
                        <label>
                          <span>Requires Concentration</span>
                          <input
                            type="checkbox"
                            checked={creature.config?.concentration || DEFAULT_CREATURE_CONFIG.concentration}
                            onChange={(e) => handleCreatureConfigChange(creature.id, 'concentration', e.target.checked)}
                          />
                        </label>
                      </div>
                      <div className="creature-config-control">
                        <label>Control Type</label>
                        <select
                          value={creature.config?.controlType || DEFAULT_CREATURE_CONFIG.controlType}
                          onChange={(e) => handleCreatureConfigChange(creature.id, 'controlType', e.target.value)}
                        >
                          <option value="verbal">Verbal Commands</option>
                          <option value="mental">Mental Link</option>
                          <option value="empathic">Empathic Bond</option>
                          <option value="autonomous">Autonomous</option>
                        </select>
                      </div>
                      <div className="creature-config-control">
                        <label>Control Range</label>
                        <select
                          value={creature.config?.controlRange !== undefined ? creature.config.controlRange : DEFAULT_CREATURE_CONFIG.controlRange}
                          onChange={(e) => handleCreatureConfigChange(creature.id, 'controlRange', parseInt(e.target.value))}
                        >
                          <option value={30}>30 feet</option>
                          <option value={60}>60 feet</option>
                          <option value={120}>120 feet</option>
                          <option value={300}>300 feet</option>
                          <option value={0}>Unlimited</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Attached Effects Configuration */}
                  <div className="creature-attached-effects-section">
                    <div className="creature-config-header">
                      <h6>Attached Effects</h6>
                      <small>Effects that emanate from this summoned creature</small>
                    </div>

                    {/* Creature description editor for custom summons */}
                    {creature.id?.startsWith('custom-summon') && (
                      <div className="creature-description-editor">
                        <label>Description:</label>
                        <textarea
                          value={creature.description || ''}
                          onChange={(e) => {
                            const updatedCreatures = summonConfig.creatures.map(c =>
                              c.id === creature.id
                                ? { ...c, description: e.target.value }
                                : c
                            );
                            setSummonConfig(prev => ({
                              ...prev,
                              creatures: updatedCreatures
                            }));
                          }}
                          placeholder="Describe your temporal entity..."
                          rows={2}
                        />
                      </div>
                    )}

                    {/* Current attached effects */}
                    <div className="attached-effects-list">
                      {Object.entries(creature.config?.attachedEffects || {}).map(([effectKey, effectData]) => {
                        if (!effectData) return null;

                        return (
                          <div key={effectKey} className="attached-effect-item">
                            <div className="effect-type-badge">
                              {effectData.effectType === 'damage' && <FaFire />}
                              {effectData.effectType === 'healing' && <FaHeart />}
                              {effectData.effectType === 'buff' && <FaStar />}
                              {effectData.effectType === 'debuff' && <FaSkull />}
                              {effectData.effectType === 'control' && <FaBolt />}
                              {effectData.effectType}
                            </div>

                            <div className="effect-config">
                              {effectData.effectType === 'damage' && (
                                <div className="effect-config-fields">
                                  <div className="config-field">
                                    <label>Formula:</label>
                                    <input
                                      type="text"
                                      value={effectData.formula || '2d6'}
                                      onChange={(e) => {
                                        const updatedEffects = { ...creature.config.attachedEffects };
                                        updatedEffects[effectKey] = { ...effectData, formula: e.target.value };
                                        handleCreatureConfigChange(creature.id, 'attachedEffects', updatedEffects);
                                      }}
                                      className="config-input"
                                    />
                                  </div>
                                  <div className="config-field">
                                    <label>Element:</label>
                                    <select
                                      value={effectData.elementType || 'force'}
                                      onChange={(e) => {
                                        const updatedEffects = { ...creature.config.attachedEffects };
                                        updatedEffects[effectKey] = { ...effectData, elementType: e.target.value };
                                        handleCreatureConfigChange(creature.id, 'attachedEffects', updatedEffects);
                                      }}
                                      className="config-select"
                                    >
                                      <option value="force">Force</option>
                                      <option value="fire">Fire</option>
                                      <option value="cold">Cold</option>
                                      <option value="lightning">Lightning</option>
                                      <option value="necrotic">Necrotic</option>
                                    </select>
                                  </div>
                                  <div className="config-field">
                                    <label>Radius:</label>
                                    <input
                                      type="number"
                                      min="5"
                                      max="30"
                                      value={effectData.areaRadius || 15}
                                      onChange={(e) => {
                                        const updatedEffects = { ...creature.config.attachedEffects };
                                        updatedEffects[effectKey] = { ...effectData, areaRadius: parseInt(e.target.value) };
                                        handleCreatureConfigChange(creature.id, 'attachedEffects', updatedEffects);
                                      }}
                                      className="config-input"
                                    />
                                  </div>
                                </div>
                              )}

                              {effectData.effectType === 'healing' && (
                                <div className="effect-config-fields">
                                  <div className="config-field">
                                    <label>Formula:</label>
                                    <input
                                      type="text"
                                      value={effectData.formula || '1d8'}
                                      onChange={(e) => {
                                        const updatedEffects = { ...creature.config.attachedEffects };
                                        updatedEffects[effectKey] = { ...effectData, formula: e.target.value };
                                        handleCreatureConfigChange(creature.id, 'attachedEffects', updatedEffects);
                                      }}
                                      className="config-input"
                                    />
                                  </div>
                                  <div className="config-field">
                                    <label>Radius:</label>
                                    <input
                                      type="number"
                                      min="5"
                                      max="30"
                                      value={effectData.areaRadius || 15}
                                      onChange={(e) => {
                                        const updatedEffects = { ...creature.config.attachedEffects };
                                        updatedEffects[effectKey] = { ...effectData, areaRadius: parseInt(e.target.value) };
                                        handleCreatureConfigChange(creature.id, 'attachedEffects', updatedEffects);
                                      }}
                                      className="config-input"
                                    />
                                  </div>
                                </div>
                              )}

                              {effectData.effectType === 'buff' && (
                                <div className="effect-config-fields">
                                  <div className="config-field">
                                    <label>Stat:</label>
                                    <select
                                      value={effectData.stat || 'speed'}
                                      onChange={(e) => {
                                        const updatedEffects = { ...creature.config.attachedEffects };
                                        updatedEffects[effectKey] = { ...effectData, stat: e.target.value };
                                        handleCreatureConfigChange(creature.id, 'attachedEffects', updatedEffects);
                                      }}
                                      className="config-select"
                                    >
                                      <option value="speed">Speed</option>
                                      <option value="armor">Armor</option>
                                      <option value="damage">Damage</option>
                                      <option value="healing">Healing</option>
                                      <option value="strength">Strength</option>
                                      <option value="agility">Agility</option>
                                      <option value="constitution">Constitution</option>
                                      <option value="intelligence">Intelligence</option>
                                      <option value="spirit">Spirit</option>
                                      <option value="charisma">Charisma</option>
                                    </select>
                                  </div>
                                  <div className="config-field">
                                    <label>Bonus:</label>
                                    <input
                                      type="number"
                                      min="-10"
                                      max="50"
                                      value={effectData.magnitude || 10}
                                      onChange={(e) => {
                                        const updatedEffects = { ...creature.config.attachedEffects };
                                        updatedEffects[effectKey] = { ...effectData, magnitude: parseInt(e.target.value) };
                                        handleCreatureConfigChange(creature.id, 'attachedEffects', updatedEffects);
                                      }}
                                      className="config-input"
                                    />
                                  </div>
                                  <div className="config-field">
                                    <label>Type:</label>
                                    <select
                                      value={effectData.magnitudeType || 'flat'}
                                      onChange={(e) => {
                                        const updatedEffects = { ...creature.config.attachedEffects };
                                        updatedEffects[effectKey] = { ...effectData, magnitudeType: e.target.value };
                                        handleCreatureConfigChange(creature.id, 'attachedEffects', updatedEffects);
                                      }}
                                      className="config-select"
                                    >
                                      <option value="flat">Flat</option>
                                      <option value="multiplier">Multiplier</option>
                                      <option value="percentage">Percentage</option>
                                    </select>
                                  </div>
                                  <div className="config-field">
                                    <label>Radius:</label>
                                    <input
                                      type="number"
                                      min="5"
                                      max="30"
                                      value={effectData.areaRadius || 15}
                                      onChange={(e) => {
                                        const updatedEffects = { ...creature.config.attachedEffects };
                                        updatedEffects[effectKey] = { ...effectData, areaRadius: parseInt(e.target.value) };
                                        handleCreatureConfigChange(creature.id, 'attachedEffects', updatedEffects);
                                      }}
                                      className="config-input"
                                    />
                                  </div>
                                </div>
                              )}

                              {(effectData.effectType === 'debuff' || effectData.effectType === 'control') && (
                                <div className="effect-config-fields">
                                  {effectData.effectType === 'debuff' && (
                                    <>
                                      <div className="config-field">
                                        <label>Stat:</label>
                                        <select
                                          value={effectData.stat || 'speed'}
                                          onChange={(e) => {
                                            const updatedEffects = { ...creature.config.attachedEffects };
                                            updatedEffects[effectKey] = { ...effectData, stat: e.target.value };
                                            handleCreatureConfigChange(creature.id, 'attachedEffects', updatedEffects);
                                          }}
                                          className="config-select"
                                        >
                                          <option value="speed">Speed</option>
                                          <option value="armor">Armor</option>
                                          <option value="damage">Damage</option>
                                          <option value="healing">Healing</option>
                                          <option value="strength">Strength</option>
                                          <option value="agility">Agility</option>
                                          <option value="constitution">Constitution</option>
                                          <option value="intelligence">Intelligence</option>
                                          <option value="spirit">Spirit</option>
                                          <option value="charisma">Charisma</option>
                                        </select>
                                      </div>
                                      <div className="config-field">
                                        <label>Penalty:</label>
                                        <input
                                          type="number"
                                          min="-50"
                                          max="0"
                                          value={effectData.magnitude || -10}
                                          onChange={(e) => {
                                            const updatedEffects = { ...creature.config.attachedEffects };
                                            updatedEffects[effectKey] = { ...effectData, magnitude: parseInt(e.target.value) };
                                            handleCreatureConfigChange(creature.id, 'attachedEffects', updatedEffects);
                                          }}
                                          className="config-input"
                                        />
                                      </div>
                                      <div className="config-field">
                                        <label>Type:</label>
                                        <select
                                          value={effectData.magnitudeType || 'flat'}
                                          onChange={(e) => {
                                            const updatedEffects = { ...creature.config.attachedEffects };
                                            updatedEffects[effectKey] = { ...effectData, magnitudeType: e.target.value };
                                            handleCreatureConfigChange(creature.id, 'attachedEffects', updatedEffects);
                                          }}
                                          className="config-select"
                                        >
                                          <option value="flat">Flat</option>
                                          <option value="multiplier">Multiplier</option>
                                          <option value="percentage">Percentage</option>
                                        </select>
                                      </div>
                                    </>
                                  )}

                                  {effectData.effectType === 'control' && (
                                    <>
                                      <div className="config-field">
                                        <label>Effect:</label>
                                        <select
                                          value={effectData.controlType || 'forcedMovement'}
                                          onChange={(e) => {
                                            const updatedEffects = { ...creature.config.attachedEffects };
                                            updatedEffects[effectKey] = { ...effectData, controlType: e.target.value };
                                            handleCreatureConfigChange(creature.id, 'attachedEffects', updatedEffects);
                                          }}
                                          className="config-select"
                                        >
                                          <option value="push">Push</option>
                                          <option value="pull">Pull</option>
                                          <option value="incapacitation">Stun</option>
                                          <option value="knockdown">Knock Prone</option>
                                          <option value="restraint">Restrain</option>
                                          <option value="incapacitation">Stun</option>
                                          <option value="knockdown">Knockdown</option>
                                          <option value="restraint">Restrain</option>
                                        </select>
                                      </div>
                                      <div className="config-field">
                                        <label>Distance:</label>
                                        <input
                                          type="number"
                                          min="5"
                                          max="30"
                                          value={effectData.distance || 10}
                                          onChange={(e) => {
                                            const updatedEffects = { ...creature.config.attachedEffects };
                                            updatedEffects[effectKey] = { ...effectData, distance: parseInt(e.target.value) };
                                            handleCreatureConfigChange(creature.id, 'attachedEffects', updatedEffects);
                                          }}
                                          className="config-input"
                                        />
                                      </div>
                                    </>
                                  )}

                                  <div className="config-field">
                                    <label>Save DC:</label>
                                    <input
                                      type="number"
                                      min="8"
                                      max="25"
                                      value={effectData.saveDC || 15}
                                      onChange={(e) => {
                                        const updatedEffects = { ...creature.config.attachedEffects };
                                        updatedEffects[effectKey] = { ...effectData, saveDC: parseInt(e.target.value) };
                                        handleCreatureConfigChange(creature.id, 'attachedEffects', updatedEffects);
                                      }}
                                      className="config-input"
                                    />
                                  </div>
                                  <div className="config-field">
                                    <label>Save Type:</label>
                                    <select
                                      value={effectData.saveType || 'constitution'}
                                      onChange={(e) => {
                                        const updatedEffects = { ...creature.config.attachedEffects };
                                        updatedEffects[effectKey] = { ...effectData, saveType: e.target.value };
                                        handleCreatureConfigChange(creature.id, 'attachedEffects', updatedEffects);
                                      }}
                                      className="config-select"
                                    >
                                      <option value="strength">Strength</option>
                                      <option value="agility">Agility</option>
                                      <option value="constitution">Constitution</option>
                                      <option value="intelligence">Intelligence</option>
                                      <option value="spirit">Spirit</option>
                                      <option value="charisma">Charisma</option>
                                    </select>
                                  </div>
                                  <div className="config-field">
                                    <label>Outcome:</label>
                                    <select
                                      value={effectData.saveOutcome || 'negates'}
                                      onChange={(e) => {
                                        const updatedEffects = { ...creature.config.attachedEffects };
                                        updatedEffects[effectKey] = { ...effectData, saveOutcome: e.target.value };
                                        handleCreatureConfigChange(creature.id, 'attachedEffects', updatedEffects);
                                      }}
                                      className="config-select"
                                    >
                                      <option value="negates">Negates</option>
                                      <option value="halves">Halves</option>
                                    </select>
                                  </div>
                                  <div className="config-field">
                                    <label>Radius:</label>
                                    <input
                                      type="number"
                                      min="5"
                                      max="30"
                                      value={effectData.areaRadius || 15}
                                      onChange={(e) => {
                                        const updatedEffects = { ...creature.config.attachedEffects };
                                        updatedEffects[effectKey] = { ...effectData, areaRadius: parseInt(e.target.value) };
                                        handleCreatureConfigChange(creature.id, 'attachedEffects', updatedEffects);
                                      }}
                                      className="config-input"
                                    />
                                  </div>
                                </div>
                              )}

                              {effectData.effectType === 'debuff' && (
                                <div className="effect-config-fields">
                                  <div className="config-field">
                                    <label>Stat:</label>
                                    <select
                                      value={effectData.stat || 'speed'}
                                      onChange={(e) => {
                                        const updatedEffects = { ...creature.config.attachedEffects };
                                        updatedEffects[effectKey] = { ...effectData, stat: e.target.value };
                                        handleCreatureConfigChange(creature.id, 'attachedEffects', updatedEffects);
                                      }}
                                      className="config-select"
                                    >
                                      <option value="speed">Speed</option>
                                      <option value="armor">Armor</option>
                                      <option value="damage">Damage</option>
                                      <option value="healing">Healing</option>
                                      <option value="strength">Strength</option>
                                      <option value="agility">Agility</option>
                                      <option value="constitution">Constitution</option>
                                      <option value="intelligence">Intelligence</option>
                                      <option value="spirit">Spirit</option>
                                      <option value="charisma">Charisma</option>
                                    </select>
                                  </div>
                                  <div className="config-field">
                                    <label>Penalty:</label>
                                    <input
                                      type="number"
                                      min="-50"
                                      max="0"
                                      value={effectData.magnitude || -10}
                                      onChange={(e) => {
                                        const updatedEffects = { ...creature.config.attachedEffects };
                                        updatedEffects[effectKey] = { ...effectData, magnitude: parseInt(e.target.value) };
                                        handleCreatureConfigChange(creature.id, 'attachedEffects', updatedEffects);
                                      }}
                                      className="config-input"
                                    />
                                  </div>
                                  <div className="config-field">
                                    <label>Type:</label>
                                    <select
                                      value={effectData.magnitudeType || 'flat'}
                                      onChange={(e) => {
                                        const updatedEffects = { ...creature.config.attachedEffects };
                                        updatedEffects[effectKey] = { ...effectData, magnitudeType: e.target.value };
                                        handleCreatureConfigChange(creature.id, 'attachedEffects', updatedEffects);
                                      }}
                                      className="config-select"
                                    >
                                      <option value="flat">Flat</option>
                                      <option value="multiplier">Multiplier</option>
                                      <option value="percentage">Percentage</option>
                                    </select>
                                  </div>
                                  <div className="config-field">
                                    <label>Radius:</label>
                                    <input
                                      type="number"
                                      min="5"
                                      max="30"
                                      value={effectData.areaRadius || 15}
                                      onChange={(e) => {
                                        const updatedEffects = { ...creature.config.attachedEffects };
                                        updatedEffects[effectKey] = { ...effectData, areaRadius: parseInt(e.target.value) };
                                        handleCreatureConfigChange(creature.id, 'attachedEffects', updatedEffects);
                                      }}
                                      className="config-input"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>

                            <button
                              className="remove-effect-btn"
                              onClick={() => handleRemoveAttachedEffect(creature.id, effectKey)}
                              title="Remove effect"
                            >
                              <FaCircleXmark />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Add new effect buttons */}
                    <div className="add-attached-effect">
                      <h6>Add Effect:</h6>
                      <div className="effect-buttons">
                        <button
                          className="pf-button pf-button-secondary"
                          onClick={() => handleAttachedEffectChange(creature.id, `auraDamage_${Date.now()}`, {
                            effectType: 'damage',
                            formula: '2d6',
                            elementType: 'force',
                            damageType: 'direct',
                            areaShape: 'circle',
                            areaRadius: 15,
                            targetType: 'enemy',
                            tickRate: 1,
                            tickUnit: 'rounds'
                          })}
                        >
                          <FaFire /> Damage Aura
                        </button>
                        <button
                          className="pf-button pf-button-secondary"
                          onClick={() => handleAttachedEffectChange(creature.id, `auraHealing_${Date.now()}`, {
                            effectType: 'healing',
                            formula: '1d8',
                            healingType: 'direct',
                            areaShape: 'circle',
                            areaRadius: 15,
                            targetType: 'ally',
                            tickRate: 1,
                            tickUnit: 'rounds'
                          })}
                        >
                          <FaHeart /> Healing Aura
                        </button>
                        <button
                          className="pf-button pf-button-secondary"
                          onClick={() => handleAttachedEffectChange(creature.id, `auraBuff_${Date.now()}`, {
                            effectType: 'buff',
                            buffType: 'statEnhancement',
                            stat: 'speed',
                            magnitude: 10,
                            magnitudeType: 'flat',
                            durationValue: 1,
                            durationType: 'rounds',
                            durationUnit: 'rounds',
                            targetType: 'ally',
                            areaShape: 'circle',
                            areaRadius: 15
                          })}
                        >
                          <FaStar /> Buff Aura
                        </button>
                        <button
                          className="pf-button pf-button-secondary"
                          onClick={() => handleAttachedEffectChange(creature.id, `auraDebuff_${Date.now()}`, {
                            effectType: 'debuff',
                            debuffType: 'statReduction',
                            stat: 'speed',
                            magnitude: -10,
                            magnitudeType: 'flat',
                            durationValue: 1,
                            durationType: 'rounds',
                            durationUnit: 'rounds',
                            targetType: 'enemy',
                            areaShape: 'circle',
                            areaRadius: 15,
                            saveDC: 15,
                            saveType: 'constitution',
                            saveOutcome: 'negates'
                          })}
                        >
                          <FaSkull /> Debuff Aura
                        </button>
                        <button
                          className="pf-button pf-button-secondary"
                          onClick={() => handleAttachedEffectChange(creature.id, `auraControl_${Date.now()}`, {
                            effectType: 'control',
                            controlType: 'forcedMovement',
                            strength: 'moderate',
                            distance: 10,
                            durationValue: 1,
                            durationType: 'rounds',
                            durationUnit: 'rounds',
                            targetType: 'enemy',
                            areaShape: 'circle',
                            areaRadius: 15,
                            saveDC: 15,
                            saveType: 'strength',
                            saveOutcome: 'negates'
                          })}
                        >
                          <FaBolt /> Control Aura
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {selectedCreatures.length > 1 && (
                <div className="creature-actions">
                  <button
                    className="spell-wizard-button secondary"
                    onClick={handleClearAllCreatures}
                  >
                    Clear All
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  // Render difficulty settings - removed as per user request
  const renderDifficultySettings = () => {
    return null;
  };

  // Preview section removed as per user request

  // Simple description for trigger condition
  const getTriggerDescription = () => {
    if (!summonConfig.waitForTrigger) {
      return '';
    }
    return 'when triggered';
  };

  // REMOVED: renderDurationSettings function - duration settings moved to individual creature config
  // const renderDurationSettings = () => { ... };


  // REMOVED: renderQuantitySettings function - quantity settings moved to individual creature config
  // const renderQuantitySettings = () => { ... };

  // Render control settings
  const renderControlSettings = () => {
    return (
      <div className="section">
        <h3 className="section-title">Control Settings</h3>

        {/* Control method cards */}
        <div className="section-panel">
          <div className="section-panel-header">
            <h4>Control Method</h4>
          </div>

          <div className="section-panel-content">
            <div className="spell-wizard-card-grid small">
              {CONTROL_TYPES.map(type => (
                <div
                  key={type.id}
                  className={`spell-wizard-card ${summonConfig.controlType === type.id ? 'selected' : ''}`}
                  onClick={() => handleSummonConfigChange('controlType', type.id)}
                  onMouseEnter={(e) => handleMouseEnter({
                    title: type.name,
                    content: type.description
                  }, e)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="spell-wizard-card-icon">
                    <img
                      src={getIconUrl(type.icon)}
                      alt={type.name}
                    />
                  </div>
                  <h4>{type.name}</h4>
                  <small>{type.description}</small>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Control range panel */}
        <div className="section-panel">
          <div className="section-panel-header">
            <h4>Control Range</h4>
          </div>

          <div className="section-panel-content">
            <div className="effect-option-tabs">
              {CONTROL_RANGES.map(range => (
                <button
                  key={range.id}
                  className={`pf-button ${summonConfig.controlRange === range.id ? 'selected' : ''}`}
                  onClick={() => handleSummonConfigChange('controlRange', range.id)}
                  onMouseEnter={(e) => handleMouseEnter({
                    title: range.name,
                    content: range.description
                  }, e)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  {range.name}
                </button>
              ))}
            </div>

            <div className="range-description">
              {CONTROL_RANGES.find(r => r.id === summonConfig.controlRange)?.description ||
                "Set the maximum distance at which you can control your summoned creatures."}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="effects-container">
      {/* Quick Actions Bar */}
      <div className="summon-quick-actions">
        <div className="quick-action-group">
          <button
            className="pf-button pf-button-secondary"
            onClick={openCreatureSelection}
          >
            <FaSearch style={{ marginRight: '6px' }} />
            Select Creatures
          </button>
          <button
            className="pf-button pf-button-secondary"
            onClick={() => {
              const customCreature = {
                id: `custom-summon-${Date.now()}`,
                name: 'Custom Temporal Entity',
                description: 'A custom temporal anomaly with attached effects',
                size: 'Medium',
                type: 'elemental',
                tokenIcon: 'spell_arcane_portalshattrath',
                stats: {
                  maxHp: 50,
                  armor: 15,
                  maxMana: 0
                },
                config: { ...DEFAULT_CREATURE_CONFIG }
              };
              setSummonConfig(prev => ({
                ...prev,
                creatures: [...(prev.creatures || []), customCreature]
              }));
            }}
          >
            <FaPlus style={{ marginRight: '6px' }} />
            Create Custom
          </button>
        </div>
        {(summonConfig.creatures || []).length > 0 && (
          <button
            className="pf-button pf-button-danger"
            onClick={handleClearAllCreatures}
          >
            Clear All
          </button>
        )}
      </div>

      {/* Main Content Area */}
      <div className="summon-main-content">
        {/* Selected Creatures Display */}
        {(summonConfig.creatures || []).length > 0 && (
          <div className="summon-creatures-section">
            <div className="section-header">
              <h3>Summoned Creatures ({(summonConfig.creatures || []).length})</h3>
            </div>
            {renderCreatureSelection()}
          </div>
        )}

        {/* Empty State */}
        {(summonConfig.creatures || []).length === 0 && (
          <div className="summon-empty-state">
            <div className="empty-state-content">
              <FaPaw className="empty-state-icon" />
              <h3>No Creatures Selected</h3>
              <p>Choose creatures from the library or create custom summons to get started.</p>
            </div>
          </div>
        )}

        {/* Advanced Settings - Collapsible */}
        {(summonConfig.creatures || []).length > 0 && (
          <div className="summon-advanced-settings">
            <details className="settings-accordion">
              <summary className="settings-accordion-header">
                <FaGear style={{ marginRight: '8px' }} />
                Advanced Control Settings
              </summary>
              <div className="settings-accordion-content">
                {renderControlSettings()}
              </div>
            </details>
          </div>
        )}
      </div>

      {/* Tooltip */}

      {/* Creature Selection Window */}
      <CreatureSelectionWindow
        isOpen={showCreatureSelection}
        onClose={closeCreatureSelection}
        onSelect={handleCreatureSelection}
        selectedCreatures={summonConfig.creatures || []}
        multiSelect={true}
        title="Select Creatures to Summon"
        effectType="summon"
      />
    </div>
  );
};

export default SummoningEffects;