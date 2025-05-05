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
  FaCircleXmark
} from 'react-icons/fa6';
import Wc3Tooltip from '../../../tooltips/Wc3Tooltip';
import './shared-effect-cards.css';
import './summoning-effects.css';

// Summoning types
export const SUMMONING_TYPES = {
  BEAST: {
    id: 'beast',
    name: 'Beast',
    icon: 'inv_misc_monstertail_03',
    description: 'Summon natural creatures and beasts',
    effectIcon: FaDragon
  },
  SPIRIT: {
    id: 'spirit',
    name: 'Spirit',
    icon: 'spell_shadow_salvationaura',
    description: 'Summon ethereal beings and spirits',
    effectIcon: FaGhost
  },
  WARRIOR: {
    id: 'warrior',
    name: 'Warrior',
    icon: 'inv_sword_27',
    description: 'Summon martial combatants',
    effectIcon: FaHandFist
  },
  GUARDIAN: {
    id: 'guardian',
    name: 'Guardian',
    icon: 'inv_shield_04',
    description: 'Summon protective entities',
    effectIcon: FaShieldHalved
  },
  ARCANE: {
    id: 'arcane',
    name: 'Arcane',
    icon: 'spell_holy_magicalsentry',
    description: 'Summon magical constructs and elementals',
    effectIcon: FaWandMagicSparkles
  }
};

// Duration types
const DURATION_TYPES = [
  { id: 'rounds', name: 'Rounds', description: 'Combat rounds (approx. 6 seconds each)', icon: 'inv_misc_pocketwatch_01' },
  { id: 'minutes', name: 'Minutes', description: 'Real-time minutes', icon: 'inv_misc_pocketwatch_02' },
  { id: 'hours', name: 'Hours', description: 'Real-time hours', icon: 'inv_misc_pocketwatch_03' }
];

// Beast summoning options
const BEAST_SUMMONS = [
  { id: 'wolf', name: 'Wolf', icon: 'ability_mount_blackdirewolf', description: 'Pack hunters with good tracking abilities' },
  { id: 'bear', name: 'Bear', icon: 'ability_hunter_pet_bear', description: 'Strong ursine creatures with powerful attacks' },
  { id: 'eagle', name: 'Eagle', icon: 'inv_misc_bird_01', description: 'Flying scouts with keen eyesight' },
  { id: 'snake', name: 'Snake', icon: 'classicon_hunter', description: 'Venomous reptiles with stealth abilities' },
  { id: 'tiger', name: 'Tiger', icon: 'ability_mount_jungletiger', description: 'Ferocious felines with deadly pounce attacks' }
];

// Spirit summoning options
const SPIRIT_SUMMONS = [
  { id: 'ancestor', name: 'Ancestor Spirit', icon: 'ability_priest_spiritoftheredeemer', description: 'Ancient spirits that provide wisdom and guidance' },
  { id: 'phantom', name: 'Phantom', icon: 'ability_priest_spectralguise', description: 'Semi-corporeal entities that can pass through objects' },
  { id: 'wisp', name: 'Wisp', icon: 'spell_shadow_teleport', description: 'Small, glowing spirits that can illuminate areas' },
  { id: 'banshee', name: 'Banshee', icon: 'spell_shadow_possession', description: 'Wailing spirits with terrifying screams' },
  { id: 'shade', name: 'Shade', icon: 'spell_shadow_summonvoidwalker', description: 'Dark spirits that can drain life essence' }
];

// Warrior summoning options
const WARRIOR_SUMMONS = [
  { id: 'footman', name: 'Ghostly Footman', icon: 'ability_warrior_defensivestance', description: 'Basic soldiers with sword and shield' },
  { id: 'archer', name: 'Spectral Archer', icon: 'inv_weapon_bow_02', description: 'Ranged attackers with deadly accuracy' },
  { id: 'knight', name: 'Phantom Knight', icon: 'ability_warrior_charge', description: 'Armored warriors on spectral steeds' },
  { id: 'berserker', name: 'Spirit Berserker', icon: 'ability_warrior_rampage', description: 'Frenzied warriors with powerful attacks' },
  { id: 'champion', name: 'Ancient Champion', icon: 'inv_sword_11', description: 'Elite warriors with legendary combat skills' }
];

// Guardian summoning options
const GUARDIAN_SUMMONS = [
  { id: 'shield_guardian', name: 'Shield Guardian', icon: 'inv_shield_06', description: 'Protective constructs that absorb damage' },
  { id: 'warden', name: 'Arcane Warden', icon: 'spell_holy_powerwordshield', description: 'Magical sentinels that project defensive auras' },
  { id: 'sentinel', name: 'Stone Sentinel', icon: 'inv_stone_weightstone_05', description: 'Rocky guardians with high physical resistance' },
  { id: 'protector', name: 'Astral Protector', icon: 'ability_paladin_shieldofvengeance', description: 'Celestial entities that heal allies' },
  { id: 'bulwark', name: 'Elemental Bulwark', icon: 'inv_elemental_crystal_earth', description: 'Massive elemental walls that block passages' }
];

// Arcane summoning options
const ARCANE_SUMMONS = [
  { id: 'elemental_fire', name: 'Fire Elemental', icon: 'spell_fire_elemental_totem', description: 'Beings of pure flame that burn enemies' },
  { id: 'elemental_water', name: 'Water Elemental', icon: 'spell_frost_summonwaterelemental', description: 'Aquatic entities that control water and ice' },
  { id: 'elemental_air', name: 'Air Elemental', icon: 'spell_nature_cyclone', description: 'Wind spirits that can move with great speed' },
  { id: 'elemental_earth', name: 'Earth Elemental', icon: 'spell_nature_earthelemental_totem', description: 'Stone entities with powerful physical attacks' },
  { id: 'arcane_construct', name: 'Arcane Construct', icon: 'spell_arcane_blast', description: 'Magical automatons that channel arcane energy' }
];

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
  { id: 'autonomous', name: 'Autonomous', icon: 'inv_misc_gem_sapphire_01', description: 'Summons follow preset behaviors' }
];

const SummoningEffects = ({ state, dispatch, actionCreators, getDefaultFormula, onChange }) => {
  // State for tooltip
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipContent, setTooltipContent] = useState(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Initialize with default summoning type from state or 'beast'
  const [activeSummonType, setActiveSummonType] = useState(
    state.summonConfig?.summonType || 'beast'
  );

  // Initialize with selected summon from state or null
  const [selectedSummons, setSelectedSummons] = useState([]);

  // Summoning configuration state - initialized from existing state or defaults
  const [summonConfig, setSummonConfig] = useState(() => {
    const defaultConfig = {
      summonType: 'beast',
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

  // Effect to update state when summoning type changes
  useEffect(() => {
    // If summoning type changed, update in config
    if (activeSummonType !== summonConfig.summonType) {
      handleSummonConfigChange('summonType', activeSummonType);
    }
  }, [activeSummonType]);

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

        {data.summonType && (
          <div className="tooltip-effect">
            <span className="tooltip-gold">Summoning Type:</span> {data.summonType.charAt(0).toUpperCase() + data.summonType.slice(1)}
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

        {/* Flavor text based on summoning type */}
        <div className="tooltip-divider"></div>
        <div className="tooltip-flavor-text">
          {activeSummonType === 'beast' && "\"Wild creatures answer your call, bound to your will.\""}
          {activeSummonType === 'undead' && "\"The dead rise to serve at your command.\""}
          {activeSummonType === 'elemental' && "\"Primal forces of nature manifest at your bidding.\""}
          {activeSummonType === 'celestial' && "\"Beings of divine light descend to aid your cause.\""}
          {activeSummonType === 'fiend' && "\"Dark entities emerge from the nether to do your bidding.\""}
          {activeSummonType === 'fey' && "\"Mystical creatures of the fey realms answer your summons.\""}
          {activeSummonType === 'construct' && "\"Magical automatons form from raw arcane energy.\""}
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

  // Handle summoning type changes without resetting selected summons
  const handleSummonTypeChange = (summonTypeId) => {
    setActiveSummonType(summonTypeId);
    handleSummonConfigChange('summonType', summonTypeId);
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
        // Add the creature with its summon type
        const newCreature = {
          ...creature,
          summonType: activeSummonType
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

  // Toggle duration on/off
  const toggleDuration = () => {
    const hasDuration = !summonConfig.hasDuration;
    handleSummonConfigChange('hasDuration', hasDuration);

    // If turning off duration, also turn off concentration
    if (!hasDuration) {
      handleSummonConfigChange('concentration', false);
    }
  };

  // Get summoning options based on the summoning type
  const getSummoningOptions = (summonType) => {
    switch (summonType) {
      case 'beast': return BEAST_SUMMONS;
      case 'spirit': return SPIRIT_SUMMONS;
      case 'warrior': return WARRIOR_SUMMONS;
      case 'guardian': return GUARDIAN_SUMMONS;
      case 'arcane': return ARCANE_SUMMONS;
      default: return [];
    }
  };

  // Get WoW-style icon URL
  const getIconUrl = (iconName) => {
    if (!iconName) return '';
    return `https://wow.zamimg.com/images/wow/icons/large/${iconName}.jpg`;
  };

  // Render the summoning type selection
  const renderSummoningTypeSelection = () => {
    return (
      <div className="spell-wizard-card-grid">
        {Object.values(SUMMONING_TYPES).map((summonType) => (
          <div
            key={summonType.id}
            className={`spell-wizard-card ${activeSummonType === summonType.id ? 'selected' : ''}`}
            onClick={() => handleSummonTypeChange(summonType.id)}
            onMouseEnter={(e) => handleMouseEnter({
              title: summonType.name,
              content: summonType.description
            }, e)}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="spell-wizard-card-icon">
              <img
                src={getIconUrl(summonType.icon)}
                alt={summonType.name}
              />
            </div>
            <h4>{summonType.name}</h4>
            <p>{summonType.description}</p>
          </div>
        ))}
      </div>
    );
  };

  // Render selected creatures section
  const renderSelectedCreatures = () => {
    // Ensure creatures is an array, even if it's undefined
    const creatures = summonConfig.creatures || [];

    if (creatures.length === 0) {
      return (
        <div className="section-panel">
          <div className="section-panel-header">
            <h4>Selected Creatures</h4>
          </div>

          <div className="section-panel-content">
            <div className="effect-description">
              No creatures selected. Choose creatures from the options below.
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="section-panel">
        <div className="section-panel-header">
          <h4>Selected Creatures</h4>
        </div>

        <div className="section-panel-content">
          <div className="selected-creatures-list">
            {creatures.map(creature => {
              // Get the summoning type for this creature
              const typeId = creature.summonType || activeSummonType;
              const summonType = SUMMONING_TYPES[typeId.toUpperCase()];

              return (
                <div key={creature.id} className="quantity-row">
                  <div className="quantity-icon">
                    <img src={getIconUrl(creature.icon)} alt={creature.name} />
                  </div>
                  <div className="quantity-info">
                    <h5>{creature.name}</h5>
                    <p>{summonType?.name || 'Unknown Type'}</p>
                  </div>
                  <button
                    className="effect-numeric-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveCreature(creature.id);
                    }}
                  >
                    <FaCircleXmark />
                  </button>
                </div>
              );
            })}
          </div>

          <button
            className="effect-numeric-button danger"
            onClick={handleClearAllCreatures}
            disabled={creatures.length === 0}
            style={{ marginTop: '16px', width: '100%' }}
          >
            Clear All Creatures
          </button>
        </div>
      </div>
    );
  };

  // Render creature selection
  const renderCreatureSelection = () => {
    const summonOptions = getSummoningOptions(activeSummonType);

    if (!summonOptions.length) {
      return (
        <div className="section-panel">
          <div className="section-panel-content">
            <div className="effect-description">
              No creatures available for this summoning type.
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="section-panel">
        <div className="section-panel-header">
          <h4>Available Creatures</h4>
        </div>

        <div className="section-panel-content">
          <div className="spell-wizard-card-grid small">
            {summonOptions.map(creature => (
              <div
                key={creature.id}
                className={`spell-wizard-card ${isCreatureSelected(creature.id) ? 'selected' : ''}`}
                onClick={() => toggleCreatureSelection(creature)}
                onMouseEnter={(e) => handleMouseEnter({
                  title: creature.name,
                  content: creature.description
                }, e)}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
              >
                <div className="spell-wizard-card-icon">
                  <img
                    src={getIconUrl(creature.icon)}
                    alt={creature.name}
                  />
                </div>
                <h4>{creature.name}</h4>
                <p>{creature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // Render difficulty settings - removed as per user request
  const renderDifficultySettings = () => {
    return null;
  };

  // Render summoning preview
  const renderSummoningPreview = () => {
    const creatures = summonConfig.creatures || [];

    if (creatures.length === 0) {
      return null;
    }

    return (
      <div className="effect-config-group">
        <label className="effect-config-label">Summoning Preview</label>

        <div className="effect-options">
          {creatures.map(creature => {
            // Get the summoning type for this creature
            const typeId = creature.summonType || activeSummonType;
            const summonType = SUMMONING_TYPES[typeId.toUpperCase()];

            // Generate summoning description
            const quantityText = summonConfig.quantity > 1 ? `${summonConfig.quantity} ${creature.name}s` : `a ${creature.name}`;
            const durationText = summonConfig.hasDuration ?
              `for ${summonConfig.duration} ${summonConfig.durationUnit}` :
              'permanently';
            const concentrationText = (summonConfig.hasDuration && summonConfig.concentration) ? ' (requires concentration)' : '';
            const controlText = CONTROL_TYPES.find(t => t.id === summonConfig.controlType)?.name.toLowerCase() || 'verbal commands';
            const rangeText = summonConfig.controlRange > 0 ? `within ${summonConfig.controlRange} feet` : 'at any distance';

            // Generate trigger text
            const triggerText = summonConfig.waitForTrigger ? ` ${getTriggerDescription()}` : '';

            return (
              <div key={creature.id} className="effect-preview">
                <div className="effect-preview-header">
                  <div className="effect-preview-icon">
                    <img
                      src={getIconUrl(creature.icon)}
                      alt={creature.name}
                    />
                  </div>
                  <div className="effect-preview-title">
                    <h4>{summonType?.name || 'Unknown'}: {creature.name}</h4>
                    <div className="effect-preview-subtitle">
                      {summonConfig.quantity > 1 ? `${summonConfig.quantity} creatures` : '1 creature'}
                      {summonConfig.hasDuration ?
                        ` • ${summonConfig.duration} ${summonConfig.durationUnit}` :
                        ' • Permanent'}
                      {(summonConfig.hasDuration && summonConfig.concentration) ? ' • Concentration' : ''}
                      {summonConfig.waitForTrigger ? ' • Triggered' : ''}
                    </div>
                  </div>
                </div>

                <div className="effect-preview-description">
                  You summon {quantityText}{triggerText} {durationText}{concentrationText}.
                  The creature is controlled via {controlText} {rangeText}.
                </div>

                <div className="effect-preview-details">
                  <div className="effect-preview-detail">
                    <span className="detail-label">Creature Type:</span>
                    <span className="detail-value">{creature.name}</span>
                  </div>

                  {summonConfig.waitForTrigger && (
                    <div className="effect-preview-detail">
                      <span className="detail-label">Activation:</span>
                      <span className="detail-value">Waits for trigger condition</span>
                    </div>
                  )}

                  <div className="effect-preview-detail">
                    <span className="detail-label">Control Method:</span>
                    <span className="detail-value">
                      {CONTROL_TYPES.find(t => t.id === summonConfig.controlType)?.name || 'Verbal Commands'}
                    </span>
                  </div>

                  <div className="effect-preview-detail">
                    <span className="detail-label">Control Range:</span>
                    <span className="detail-value">
                      {summonConfig.controlRange === 0 ? 'Unlimited' : `${summonConfig.controlRange} feet`}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Simple description for trigger condition
  const getTriggerDescription = () => {
    if (!summonConfig.waitForTrigger) {
      return '';
    }
    return 'when triggered';
  };

  // Render duration and activation settings
  const renderDurationSettings = () => {
    return (
      <div className="section">
        <h3 className="section-title">Duration & Activation</h3>

        <div className="spell-wizard-card-grid">
          {/* Trigger toggle card */}
          <div className="spell-wizard-card">
            <div className="spell-wizard-card-icon">
              <img src={getIconUrl('ability_hunter_beasttaming')} alt="Trigger" />
            </div>
            <h4>Wait for Trigger</h4>
            <p>Summon only when trigger conditions are met</p>

            <div className="effect-toggle-switch-container">
              <div
                className={`effect-toggle-switch ${summonConfig.waitForTrigger ? 'active' : ''}`}
                onClick={() => {
                  // Update the waitForTrigger flag
                  const newValue = !summonConfig.waitForTrigger;
                  handleSummonConfigChange('waitForTrigger', newValue);

                  // If turning on waitForTrigger, update the spell's trigger configuration
                  if (newValue) {
                    // Create a trigger configuration for the spell's trigger system
                    const spellTriggerConfig = {
                      triggerId: 'summon_trigger',
                      parameters: {},
                      targetEntity: 'target',
                      effectType: 'summon'
                    };

                    // Update the spell's trigger configuration through the context
                    dispatch(actionCreators.updateTriggerConfig({
                      ...state.triggerConfig,
                      summonTrigger: spellTriggerConfig
                    }));

                    // Update the spell's wizard flow to include the trigger step
                    setTimeout(() => {
                      dispatch(actionCreators.updateWizardFlow());
                    }, 100);
                  }
                }}
              >
                <div className="effect-toggle-slider"></div>
              </div>
            </div>

            {summonConfig.waitForTrigger && (
              <div className="trigger-info">
                <small>Configured in the Trigger step</small>
                <div className="trigger-hint">
                  <img
                    src="https://wow.zamimg.com/images/wow/icons/small/ability_hunter_beasttaming.jpg"
                    alt="Trigger"
                    className="trigger-hint-icon"
                  />
                  <span>The summoning will only occur when the specified trigger conditions are met</span>
                </div>
              </div>
            )}
          </div>

          {/* Duration toggle card */}
          <div className="spell-wizard-card">
            <div className="spell-wizard-card-icon">
              <img src={getIconUrl('inv_misc_pocketwatch_01')} alt="Duration" />
            </div>
            <h4>Duration</h4>
            <p>Set how long summoned creatures remain</p>

            <div className="effect-toggle-switch-container">
              <div
                className={`effect-toggle-switch ${summonConfig.hasDuration ? 'active' : ''}`}
                onClick={() => handleSummonConfigChange('hasDuration', !summonConfig.hasDuration)}
              >
                <div className="effect-toggle-slider"></div>
              </div>
            </div>

            {!summonConfig.hasDuration && (
              <small>Permanent summon</small>
            )}
          </div>

          {/* Concentration toggle card */}
          {summonConfig.hasDuration && (
            <div className="spell-wizard-card">
              <div className="spell-wizard-card-icon">
                <img src={getIconUrl('spell_holy_mindsooth')} alt="Concentration" />
              </div>
              <h4>Concentration</h4>
              <p>Requires maintaining focus</p>

              <div className="effect-toggle-switch-container">
                <div
                  className={`effect-toggle-switch ${summonConfig.concentration ? 'active' : ''}`}
                  onClick={() => handleSummonConfigChange('concentration', !summonConfig.concentration)}
                >
                  <div className="effect-toggle-slider"></div>
                </div>
              </div>

              {summonConfig.concentration && (
                <small>Creatures disappear if concentration breaks</small>
              )}
            </div>
          )}
        </div>

        {/* Duration settings panel - only shown when duration is enabled */}
        {summonConfig.hasDuration && (
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
                      className={`effect-option-tab ${summonConfig.durationUnit === type.id ? 'selected' : ''}`}
                      onClick={() => handleSummonConfigChange('durationUnit', type.id)}
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
                    onClick={() => handleSummonConfigChange('duration', Math.max(1, summonConfig.duration - 1))}
                  >
                    <FaMinus />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={summonConfig.duration}
                    onChange={(e) => {
                      const duration = Math.max(1, Math.min(100, parseInt(e.target.value) || 1));
                      handleSummonConfigChange('duration', duration);
                    }}
                  />
                  <button
                    className="effect-numeric-button"
                    onClick={() => handleSummonConfigChange('duration', Math.min(100, summonConfig.duration + 1))}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render quantity settings
  const renderQuantitySettings = () => {
    return (
      <div className="section">
        <h3 className="section-title">Quantity Settings</h3>

        <div className="section-panel">
          <div className="section-panel-header">
            <h4>Summoning Numbers</h4>
          </div>

          <div className="section-panel-content">
            {/* Quantity control */}
            <div className="quantity-control">
              <div className="quantity-row">
                <div className="quantity-icon">
                  <img src={getIconUrl('spell_shadow_summoninfernal')} alt="Summon" />
                </div>

                <div className="quantity-info">
                  <h5>Number to Summon</h5>
                  <p>How many creatures appear when cast</p>
                </div>

                <div className="quantity-controls">
                  <button
                    className="effect-numeric-button"
                    onClick={() => handleSummonConfigChange('quantity', Math.max(1, summonConfig.quantity - 1))}
                  >
                    <FaMinus />
                  </button>
                  <input
                    type="number"
                    min="1"
                    max={summonConfig.maxQuantity}
                    value={summonConfig.quantity}
                    onChange={(e) => {
                      const quantity = Math.max(1, Math.min(summonConfig.maxQuantity, parseInt(e.target.value) || 1));
                      handleSummonConfigChange('quantity', quantity);
                    }}
                  />
                  <button
                    className="effect-numeric-button"
                    onClick={() => handleSummonConfigChange('quantity', Math.min(summonConfig.maxQuantity, summonConfig.quantity + 1))}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>

              <div className="quantity-row">
                <div className="quantity-icon">
                  <img src={getIconUrl('spell_shadow_demonform')} alt="Maximum" />
                </div>

                <div className="quantity-info">
                  <h5>Maximum Possible</h5>
                  <p>Upper limit based on available magic</p>
                </div>

                <div className="quantity-controls">
                  <button
                    className="effect-numeric-button"
                    onClick={() => {
                      const maxQuantity = Math.max(summonConfig.quantity, summonConfig.maxQuantity - 1);
                      handleSummonConfigChange('maxQuantity', maxQuantity);
                    }}
                  >
                    <FaMinus />
                  </button>
                  <input
                    type="number"
                    min={summonConfig.quantity}
                    max="10"
                    value={summonConfig.maxQuantity}
                    onChange={(e) => {
                      const maxQuantity = Math.max(summonConfig.quantity, Math.min(10, parseInt(e.target.value) || 1));
                      handleSummonConfigChange('maxQuantity', maxQuantity);
                    }}
                  />
                  <button
                    className="effect-numeric-button"
                    onClick={() => handleSummonConfigChange('maxQuantity', Math.min(10, summonConfig.maxQuantity + 1))}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

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
                <div
                  key={range.id}
                  className={`effect-option-tab ${summonConfig.controlRange === range.id ? 'selected' : ''}`}
                  onClick={() => handleSummonConfigChange('controlRange', range.id)}
                  onMouseEnter={(e) => handleMouseEnter({
                    title: range.name,
                    content: range.description
                  }, e)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                >
                  <div className="effect-option-tab-name">{range.name}</div>
                </div>
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
      <div className="section">
        <h3 className="section-title">Summoning Type</h3>
        <p>
          Choose the type of creatures to summon
        </p>
        {/* Summoning Type Selection */}
        {renderSummoningTypeSelection()}
      </div>

      <div className="section">
        <h3 className="section-title">Creatures</h3>
        {/* Selected Creatures */}
        {renderSelectedCreatures()}

        {/* Creature Selection */}
        {renderCreatureSelection()}
      </div>

      <div className="section">
        <h3 className="section-title">Activation & Duration</h3>
        {/* Duration & Activation Settings */}
        {renderDurationSettings()}
      </div>

      <div className="section">
        <h3 className="section-title">Quantity & Control</h3>
        {/* Quantity Settings */}
        {renderQuantitySettings()}

        {/* Control Settings */}
        {renderControlSettings()}
      </div>

      <div className="section">
        <h3 className="section-title">Preview</h3>
        {/* Summoning Preview - only if creatures are selected */}
        {renderSummoningPreview()}
      </div>

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

export default SummoningEffects;