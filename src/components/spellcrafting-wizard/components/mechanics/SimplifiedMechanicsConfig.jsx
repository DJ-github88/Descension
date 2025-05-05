import React, { useState, useEffect } from 'react';
import { useSpellWizardState, useSpellWizardDispatch, actionCreators } from '../../context/spellWizardContext';
import { useSpellLibrary } from '../../context/SpellLibraryContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowUp,
  faFire,
  faBolt,
  faClock,
  faRandom,
  faShieldAlt,
  faHeartbeat,
  faPaw,
  faFlask,
  faMusic,
  faVirus,
  faSkullCrossbones,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import Wc3Tooltip from '../../../tooltips/Wc3Tooltip';
import SpellSelector from '../common/SpellSelector';
import IconSelectionCard from '../common/IconSelectionCard';
import EnhancedGraduatedRecipeEffects from './EnhancedGraduatedRecipeEffects';

// Import styles
import '../../styles/MechanicThresholds.css';
import '../../styles/StepMechanicsConfig.css';

// Simplified mechanics systems
const MECHANICS_SYSTEMS = {
  COMBO_POINTS: {
    name: "Combo Points",
    description: "Traditional combo point system that builds up to powerful finishers",
    maxPoints: 5,
    icon: faArrowUp,
    thresholds: [1, 3, 5],
    color: "#FF5555",
    types: [
      { id: 'builder', name: 'Builder', description: 'Generates combo points', icon: faArrowUp },
      { id: 'spender', name: 'Spender', description: 'Consumes combo points for increased effect', icon: faFire }
    ]
  },
  PROC_SYSTEM: {
    name: "Proc System",
    description: "Chance-based procs that trigger additional effects",
    icon: faRandom,
    color: "#FFD700", // Gold
    procTypes: [
      { id: 'critical_strike', name: 'Critical Strike', description: 'Triggers on critical hits', icon: faFire },
      { id: 'on_hit', name: 'On Hit', description: 'Chance to trigger on any hit', icon: faBolt },
      { id: 'periodic', name: 'Periodic', description: 'Chance to trigger periodically', icon: faClock }
    ]
  },
  STATE_REQUIREMENTS: {
    name: "State Requirements",
    description: "Effects that change based on character or target state",
    icon: faHeartbeat,
    color: "#3498db", // Blue
    types: [
      { id: 'health_threshold', name: 'Health Threshold', description: 'Triggers based on health percentage', icon: faHeartbeat },
      { id: 'resource_threshold', name: 'Resource Threshold', description: 'Triggers based on resource level', icon: faFlask },
      { id: 'combat_state', name: 'Combat State', description: 'Triggers based on combat state', icon: faShieldAlt }
    ]
  },
  FORM_SYSTEM: {
    name: "Form System",
    description: "Shapeshifting forms that modify spell behavior",
    icon: faPaw,
    color: "#8e44ad", // Purple
    formTypes: [
      { id: 'bear_form', name: 'Bear Form', description: 'Tank form with increased armor', icon: faPaw },
      { id: 'cat_form', name: 'Cat Form', description: 'DPS form with increased speed', icon: faPaw },
      { id: 'tree_form', name: 'Tree Form', description: 'Healing form with increased healing', icon: faPaw }
    ]
  },
  TOXIC_SYSTEM: {
    name: "Toxic/Disease System",
    description: "Apply and consume different toxins and diseases for enhanced effects",
    maxPoints: 8,
    icon: faVirus,
    thresholds: [2, 4, 6, 8],
    color: "#8B008B", // Dark magenta color
    types: [
      { id: 'toxic_applier', name: 'Toxic Applier', description: 'Applies toxins, diseases, or other afflictions', icon: faFlask },
      { id: 'toxic_consumer', name: 'Toxic Consumer', description: 'Consumes toxins for enhanced effects', icon: faSkullCrossbones }
    ],
    toxicTypes: [
      { id: 'disease', name: 'Disease', description: 'Biological affliction that weakens the target', color: '#8B8000', wowIcon: 'spell_shadow_plaguecloud' },
      { id: 'poison', name: 'Poison', description: 'Toxic substance that damages over time', color: '#00FF00', wowIcon: 'ability_rogue_deadlybrew' },
      { id: 'curse', name: 'Curse', description: 'Magical affliction that reduces effectiveness', color: '#800080', wowIcon: 'spell_shadow_curseofsargeras' },
      { id: 'venom', name: 'Venom', description: 'Potent toxin that causes severe damage', color: '#008000', wowIcon: 'ability_creature_poison_06' },
      { id: 'blight', name: 'Blight', description: 'Corrupting force that spreads to nearby targets', color: '#A52A2A', wowIcon: 'spell_shadow_creepingplague' }
    ]
  },
  CHORD_SYSTEM: {
    name: "Chord System",
    description: "Music theory-based system with chord functions and recipes",
    maxPoints: 8,
    icon: faMusic,
    thresholds: [3, 5, 8],
    color: "#9370DB", // Medium purple color
    types: [
      { id: 'note', name: 'Note', description: 'Plays a note with a specific chord function', icon: faMusic },
      { id: 'chord', name: 'Chord', description: 'Requires a specific recipe of notes to play', icon: faFire },
      { id: 'wildcard', name: 'Wildcard Note', description: 'Acts as any chord function in a recipe', icon: faBolt },
      { id: 'extender', name: 'Extender', description: 'Extends the duration of the improvisation window', icon: faClock }
    ],
    chordFunctions: [
      { id: 'tonic', name: 'Tonic', description: 'The home chord or note (I)', color: '#FF5555', wowIcon: 'spell_holy_holybolt', theory: 'The tonic is the first note of a scale and represents the key center or home base of a piece of music.' },
      { id: 'supertonic', name: 'Supertonic', description: 'The second scale degree (ii)', color: '#FF9955', wowIcon: 'spell_holy_sealofwisdom', theory: 'The supertonic is the second degree of the scale, sitting just above the tonic, often creating tension that resolves to the tonic.' },
      { id: 'mediant', name: 'Mediant', description: 'The third scale degree (iii)', color: '#FFFF55', wowIcon: 'spell_holy_blessedrecovery', theory: 'The mediant is the third degree of the scale, sitting between the tonic and dominant, creating a bridge between these important functions.' },
      { id: 'subdominant', name: 'Subdominant', description: 'The fourth scale degree (IV)', color: '#55FF55', wowIcon: 'spell_holy_healingaura', theory: 'The subdominant is the fourth degree of the scale, creating a sense of movement away from the tonic and toward the dominant.' },
      { id: 'dominant', name: 'Dominant', description: 'The fifth scale degree (V)', color: '#55FFFF', wowIcon: 'spell_holy_divineillumination', theory: 'The dominant is the fifth degree of the scale, creating strong tension that wants to resolve back to the tonic.' },
      { id: 'submediant', name: 'Submediant', description: 'The sixth scale degree (vi)', color: '#5555FF', wowIcon: 'spell_holy_sealofsacrifice', theory: 'The submediant is the sixth degree of the scale, often used as a substitute for the tonic in deceptive cadences.' },
      { id: 'leading_tone', name: 'Leading Tone', description: 'The seventh scale degree (vii)', color: '#FF55FF', wowIcon: 'spell_holy_sealofwrath', theory: 'The leading tone is the seventh degree of the scale, creating strong tension that pulls toward the tonic.' }
    ]
  }
};

/**
 * Simplified Mechanics Configuration Component
 * Provides a streamlined interface for configuring spell mechanics
 */
const SimplifiedMechanicsConfig = ({ effectId, effectType, currentConfig, onConfigUpdate }) => {
  // Get the spell wizard state and dispatch
  const spellWizardState = useSpellWizardState();
  const dispatch = useSpellWizardDispatch();
  const library = useSpellLibrary();

  // Tooltip state
  const [tooltipContent, setTooltipContent] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Get recommended system based on effect type
  const getRecommendedSystem = (type) => {
    switch(type) {
      case 'damage':
        return 'COMBO_POINTS';
      case 'healing':
        return 'STATE_REQUIREMENTS';
      case 'buff':
      case 'debuff':
        return 'STATE_REQUIREMENTS';
      case 'utility':
        return 'FORM_SYSTEM';
      case 'control':
        return 'COMBO_POINTS';
      case 'summoning':
        return 'FORM_SYSTEM';
      case 'transformation':
        return 'FORM_SYSTEM';
      default:
        return 'COMBO_POINTS';
    }
  };

  // Get recommended mechanic type based on effect type and system
  const getRecommendedMechanicType = (type, system) => {
    if (system === 'COMBO_POINTS') {
      return type === 'damage' ? 'builder' : 'spender';
    } else if (system === 'PROC_SYSTEM') {
      return type === 'damage' ? 'critical_strike' : 'on_hit';
    } else if (system === 'STATE_REQUIREMENTS') {
      if (type === 'healing') {
        return 'health_threshold';
      } else if (type === 'buff' || type === 'debuff') {
        return 'resource_threshold';
      } else {
        return 'combat_state';
      }
    } else if (system === 'FORM_SYSTEM') {
      return type === 'healing' ? 'tree_form' : 'bear_form';
    }
    return 'builder';
  };

  // Get the recommended system and type
  const recommendedSystem = getRecommendedSystem(effectType);
  const recommendedType = getRecommendedMechanicType(effectType, recommendedSystem);

  // Default configuration
  const defaultConfig = {
    enabled: false,
    system: recommendedSystem,
    type: recommendedType,
    thresholdValue: MECHANICS_SYSTEMS[recommendedSystem]?.thresholds?.[0] || 1,

    // Combo system specific options
    comboOptions: {
      generationMethod: effectType === 'damage' ? 'sinister_strike' : 'backstab',
      consumptionRule: 'all',
      visualStyle: 'points'
    },

    // Proc system specific options
    procOptions: {
      procType: effectType === 'damage' ? 'critical_strike' : 'on_hit',
      procChance: effectType === 'damage' ? 15 : 10,
      effectType: effectType || 'damage',
      triggerLimit: 1,
      spellId: null
    },

    // State requirements specific options
    stateOptions: {
      resourceType: effectType === 'damage' ? 'health' : 'mana',
      thresholdValue: 20,
      thresholdType: 'below',
      valueType: 'percentage',
      originalFormula: '',
      modifiedFormula: ''
    },

    // Form system specific options
    formOptions: {
      formType: effectType === 'healing' ? 'tree_form' : 'bear_form',
      requiresForm: false,
      bonusType: effectType === 'damage' ? 'damage' : 'healing',
      bonusAmount: 20,
      formSpellId: null
    },

    // Toxic system specific options
    toxicOptions: {
      selectedToxicTypes: {}, // Map of selected toxic types with counts
      duration: 3, // Duration in rounds
      durationType: 'rounds', // Duration type (rounds, minutes, hours)
      consumptionRule: 'all', // How toxics are consumed (all, specific)
      updateFormula: false, // Whether to update the formula when consumed
      modifiedFormula: '', // The modified formula when toxics are consumed
      toxicEffects: {}, // Effects for different toxic types
      specificToxicTypes: {}, // Specific toxic types required for effects
    },

    // Chord system specific options
    chordOptions: {
      chordFunction: 'tonic', // Default chord function for notes
      isWildcard: false, // Whether this note acts as a wildcard
      extendDuration: 0, // How many rounds this note extends the improvisation window
      recipe: '', // Required recipe for chord spells (e.g., "tonic-mediant-dominant")
      recipeDisplay: [], // Visual representation of the recipe
      improvisationWindow: 2, // Default improvisation window in rounds
      graduatedEffects: {}, // Effects for partial recipe matches
      requiredFunctions: {}, // Specific chord functions required for partial resolution
      partialMatchType: 'count', // How partial matches are determined: 'count' or 'specific'
    }
  };

  // Safely get the current config
  const safeCurrentConfig = currentConfig || {};

  // State for the configuration
  const [config, setConfig] = useState({
    ...defaultConfig,
    ...safeCurrentConfig,
    comboOptions: {
      ...defaultConfig.comboOptions,
      ...(safeCurrentConfig.comboOptions || {})
    },
    procOptions: {
      ...defaultConfig.procOptions,
      ...(safeCurrentConfig.procOptions || {})
    },
    stateOptions: {
      ...defaultConfig.stateOptions,
      ...(safeCurrentConfig.stateOptions || {})
    },
    formOptions: {
      ...defaultConfig.formOptions,
      ...(safeCurrentConfig.formOptions || {})
    },
    toxicOptions: {
      ...defaultConfig.toxicOptions,
      ...(safeCurrentConfig.toxicOptions || {})
    },
    chordOptions: {
      ...defaultConfig.chordOptions,
      ...(safeCurrentConfig.chordOptions || {})
    }
  });

  // Update configuration when it changes
  useEffect(() => {
    // Create a function to update both parent and context
    const updateConfiguration = () => {
      // If parent component provided an update callback, use it
      if (onConfigUpdate) {
        onConfigUpdate(config);
      }

      // Always update the context if we have an effectId
      if (effectId) {
        dispatch(actionCreators.updateEffectMechanicsConfig(effectId, {
          ...config
        }));
      }
    };

    // Use a small timeout to ensure this runs after the current event cycle
    const timeoutId = setTimeout(updateConfiguration, 0);

    // Clean up the timeout if the component unmounts
    return () => clearTimeout(timeoutId);
  }, [config, onConfigUpdate, dispatch, effectId]);

  // Handle system change
  const handleSystemChange = (systemId) => {
    const system = MECHANICS_SYSTEMS[systemId];
    setConfig(prevConfig => ({
      ...prevConfig,
      system: systemId,
      type: getRecommendedMechanicType(effectType, systemId),
      thresholdValue: system?.thresholds && system.thresholds.length > 0 ? system.thresholds[0] : 1,
    }));
  };

  // Handle type change
  const handleTypeChange = (typeId) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      type: typeId
    }));
  };

  // Handle toggle enabled
  const handleToggleEnabled = () => {
    setConfig(prevConfig => ({
      ...prevConfig,
      enabled: !prevConfig.enabled
    }));
  };

  // Handle threshold change
  const handleThresholdChange = (value) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      thresholdValue: value
    }));
  };

  // Get the original formula from the spell state based on effect type
  const getOriginalFormula = () => {
    // Get the formula based on the effect type
    if (effectType === 'damage') {
      return spellWizardState.damageConfig?.formula || '1d6 + INT';
    } else if (effectType === 'healing') {
      return spellWizardState.healingConfig?.formula || '1d8 + WIS';
    } else if (effectType === 'buff' || effectType === 'debuff') {
      return spellWizardState.buffConfig?.formula || '+2';
    } else {
      return '1d6 + modifier';
    }
  };

  // Handle option change for specific systems
  const handleOptionChange = (system, option, value) => {
    setConfig(prevConfig => {
      if (system === 'COMBO_POINTS') {
        return {
          ...prevConfig,
          comboOptions: {
            ...prevConfig.comboOptions,
            [option]: value
          }
        };
      } else if (system === 'PROC_SYSTEM') {
        return {
          ...prevConfig,
          procOptions: {
            ...prevConfig.procOptions,
            [option]: value
          }
        };
      } else if (system === 'STATE_REQUIREMENTS') {
        return {
          ...prevConfig,
          stateOptions: {
            ...prevConfig.stateOptions,
            [option]: value
          }
        };
      } else if (system === 'FORM_SYSTEM') {
        return {
          ...prevConfig,
          formOptions: {
            ...prevConfig.formOptions,
            [option]: value
          }
        };
      } else if (system === 'TOXIC_SYSTEM') {
        return {
          ...prevConfig,
          toxicOptions: {
            ...prevConfig.toxicOptions,
            [option]: value
          }
        };
      } else if (system === 'CHORD_SYSTEM') {
        return {
          ...prevConfig,
          chordOptions: {
            ...prevConfig.chordOptions,
            [option]: value
          }
        };
      }
      return prevConfig;
    });
  };

  // Handle mouse events for tooltips
  const handleMouseEnter = (content, event) => {
    setTooltipContent(content);
    setShowTooltip(true);
    setMousePos({ x: event.clientX, y: event.clientY });
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    setTooltipContent(null);
  };

  const handleMouseMove = (event) => {
    if (showTooltip) {
      setMousePos({ x: event.clientX, y: event.clientY });
    }
  };

  // Handle toxic type selection
  const handleToxicTypeSelect = (toxicType, event) => {
    setConfig(prevConfig => {
      const selectedToxicTypes = { ...prevConfig.toxicOptions.selectedToxicTypes };

      // If already selected, increment count or remove if at max
      if (selectedToxicTypes[toxicType.id]) {
        if (selectedToxicTypes[toxicType.id] >= 3) {
          // Remove if at max count
          delete selectedToxicTypes[toxicType.id];
        } else {
          // Increment count
          selectedToxicTypes[toxicType.id] = selectedToxicTypes[toxicType.id] + 1;
        }
      } else {
        // Add with count 1
        selectedToxicTypes[toxicType.id] = 1;
      }

      return {
        ...prevConfig,
        toxicOptions: {
          ...prevConfig.toxicOptions,
          selectedToxicTypes
        }
      };
    });

    // Handle tooltip
    handleMouseEnter({
      title: toxicType.name,
      content: toxicType.description,
      icon: toxicType.wowIcon
    }, event);
  };

  // Handle toxic tooltip events
  const handleToxicTooltipEnter = (toxicType, event) => {
    const tooltipContent = (
      <div>
        <div className="tooltip-stat-line">
          {toxicType.description}
        </div>
        <div className="tooltip-effect">
          <span className="tooltip-gold">Type:</span> {toxicType.name}
        </div>
      </div>
    );

    setTooltipContent({
      content: tooltipContent,
      title: toxicType.name,
      icon: toxicType.wowIcon ? `https://wow.zamimg.com/images/wow/icons/large/${toxicType.wowIcon}.jpg` : null
    });
    setShowTooltip(true);
    setMousePos({ x: event.clientX, y: event.clientY });
  };

  const handleToxicTooltipLeave = () => {
    setShowTooltip(false);
  };

  const handleToxicTooltipMove = (event) => {
    setMousePos({ x: event.clientX, y: event.clientY });
  };

  // Handle chord function selection
  const handleChordOptionChange = (option, value, event) => {
    handleOptionChange('CHORD_SYSTEM', option, value);

    // If it's a chord function, show tooltip
    if (option === 'chordFunction') {
      const chordFunction = MECHANICS_SYSTEMS.CHORD_SYSTEM.chordFunctions.find(cf => cf.id === value);
      if (chordFunction && event) {
        handleChordTooltipEnter(chordFunction, event);
      }
    }
  };

  // Add a chord to the recipe
  const addChordToRecipe = (chordFunction, event) => {
    setConfig(prevConfig => {
      const recipeDisplay = [...prevConfig.chordOptions.recipeDisplay];
      recipeDisplay.push(chordFunction);

      // Build the recipe string
      const recipe = recipeDisplay.map(cf => cf.id).join('-');

      return {
        ...prevConfig,
        chordOptions: {
          ...prevConfig.chordOptions,
          recipe,
          recipeDisplay
        }
      };
    });

    // Show tooltip
    if (event) {
      handleChordTooltipEnter(chordFunction, event);
    }
  };

  // Remove a chord from the recipe
  const removeChordFromRecipe = (index) => {
    setConfig(prevConfig => {
      const recipeDisplay = [...prevConfig.chordOptions.recipeDisplay];
      recipeDisplay.splice(index, 1);

      // Build the recipe string
      const recipe = recipeDisplay.map(cf => cf.id).join('-');

      return {
        ...prevConfig,
        chordOptions: {
          ...prevConfig.chordOptions,
          recipe,
          recipeDisplay
        }
      };
    });
  };

  // Handle chord tooltip events
  const handleChordTooltipEnter = (chordFunction, event) => {
    const tooltipContent = (
      <div>
        <div className="tooltip-stat-line">
          {chordFunction.description}
        </div>
        <div className="tooltip-effect">
          <span className="tooltip-gold">Function:</span> {chordFunction.name}
        </div>
        <div className="tooltip-flavor">
          "{chordFunction.theory}"
        </div>
      </div>
    );

    setTooltipContent({
      content: tooltipContent,
      title: chordFunction.name,
      icon: chordFunction.wowIcon ? `https://wow.zamimg.com/images/wow/icons/large/${chordFunction.wowIcon}.jpg` : null
    });
    setShowTooltip(true);
    setMousePos({ x: event.clientX, y: event.clientY });
  };

  const handleChordTooltipLeave = () => {
    setShowTooltip(false);
  };

  const handleChordTooltipMove = (event) => {
    setMousePos({ x: event.clientX, y: event.clientY });
  };

  // Handle toxic effects change
  const handleToxicEffectsChange = (effects) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      toxicOptions: {
        ...prevConfig.toxicOptions,
        toxicEffects: effects
      }
    }));
  };

  // Handle chord graduated effects change
  const handleChordGraduatedEffectsChange = (effects) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      chordOptions: {
        ...prevConfig.chordOptions,
        graduatedEffects: effects
      }
    }));
  };

  // Get the selected system with safety checks
  const systemObj = MECHANICS_SYSTEMS[config.system] || MECHANICS_SYSTEMS['COMBO_POINTS'];
  const selectedSystem = {
    id: config.system || 'COMBO_POINTS',
    ...systemObj,
    // Ensure these properties exist
    icon: systemObj?.icon || faArrowUp,
    color: systemObj?.color || '#FF5555',
    types: systemObj?.types || []
  };

  // Make sure we have the types property
  if (!selectedSystem.types && selectedSystem.id === 'PROC_SYSTEM' && selectedSystem.procTypes) {
    selectedSystem.types = selectedSystem.procTypes;
  } else if (!selectedSystem.types && selectedSystem.id === 'FORM_SYSTEM' && selectedSystem.formTypes) {
    selectedSystem.types = selectedSystem.formTypes;
  }

  return (
    <div className="step-mechanics-config">
      <div className="mechanics-header">
        <h3>Effect Mechanics Configuration</h3>
        <div className="mechanics-toggle">
          <label className="toggle-switch">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={handleToggleEnabled}
            />
            <span className="toggle-slider"></span>
          </label>
          <span className="toggle-label">{config.enabled ? 'Enabled' : 'Disabled'}</span>
        </div>
      </div>

      {config.enabled && (
        <>
          <div className="effect-config-group">
            <h4 className="section-header">Select Mechanic System</h4>
            <div className="effect-options mechanics-options">
              {Object.entries(MECHANICS_SYSTEMS).map(([systemId, system]) => (
                <div
                  key={systemId}
                  className={`effect-option ${config.system === systemId ? 'selected' : ''}`}
                  onClick={() => handleSystemChange(systemId)}
                  onMouseEnter={(e) => handleMouseEnter({
                    title: system.name,
                    content: system.description,
                    icon: system.icon
                  }, e)}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={handleMouseMove}
                >
                  <div className="effect-option-icon">
                    <FontAwesomeIcon icon={system.icon} style={{ color: system.color }} />
                  </div>
                  <div className="effect-option-content">
                    <h5>{system.name}</h5>
                    <p>{system.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="effect-config-group">
            <h4 className="section-header">Configure {selectedSystem.name}</h4>

            {/* Type Selection */}
            <div className="mechanic-type-selection">
              <label>Mechanic Type:</label>
              <div className="mechanic-type-options">
                {selectedSystem.types.map(type => (
                  <div
                    key={type.id}
                    className={`mechanic-type-option ${config.type === type.id ? 'selected' : ''}`}
                    onClick={() => handleTypeChange(type.id)}
                    onMouseEnter={(e) => handleMouseEnter({
                      title: type.name,
                      content: type.description,
                      icon: type.icon
                    }, e)}
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={handleMouseMove}
                  >
                    <FontAwesomeIcon icon={type.icon} />
                    <span>{type.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* System-specific Configuration */}
            {config.system === 'COMBO_POINTS' && (
              <div className="combo-points-config">
                <div className="config-row">
                  <label>Threshold:</label>
                  <div className="threshold-selector">
                    {selectedSystem.thresholds.map(threshold => (
                      <div
                        key={threshold}
                        className={`threshold-option ${config.thresholdValue === threshold ? 'selected' : ''}`}
                        onClick={() => handleThresholdChange(threshold)}
                      >
                        {threshold} {threshold === 1 ? 'point' : 'points'}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="config-row">
                  <label>Consumption Rule:</label>
                  <select
                    value={config.comboOptions.consumptionRule}
                    onChange={(e) => handleOptionChange('COMBO_POINTS', 'consumptionRule', e.target.value)}
                  >
                    <option value="all">Consume All Points</option>
                    <option value="threshold">Consume Threshold Amount</option>
                    <option value="none">Don't Consume Points</option>
                  </select>
                </div>
              </div>
            )}

            {config.system === 'PROC_SYSTEM' && (
              <div className="proc-system-config">
                <div className="config-row">
                  <label>Proc Chance:</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={config.procOptions.procChance}
                    onChange={(e) => handleOptionChange('PROC_SYSTEM', 'procChance', parseInt(e.target.value))}
                  />
                  <span className="input-suffix">%</span>
                </div>
                <div className="config-row">
                  <label>Trigger Limit:</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={config.procOptions.triggerLimit}
                    onChange={(e) => handleOptionChange('PROC_SYSTEM', 'triggerLimit', parseInt(e.target.value))}
                  />
                  <span className="input-suffix">per round</span>
                </div>
                <div className="config-row">
                  <label>Linked Spell:</label>
                  <SpellSelector
                    selectedSpellId={config.procOptions.spellId}
                    onSpellSelected={(spellId) => handleOptionChange('PROC_SYSTEM', 'spellId', spellId)}
                    placeholder="Select a spell to trigger"
                  />
                </div>
              </div>
            )}

            {config.system === 'STATE_REQUIREMENTS' && (
              <div className="state-requirements-config">
                <div className="config-row">
                  <label>Resource Type:</label>
                  <select
                    value={config.stateOptions.resourceType}
                    onChange={(e) => handleOptionChange('STATE_REQUIREMENTS', 'resourceType', e.target.value)}
                  >
                    <option value="health">Health</option>
                    <option value="mana">Mana</option>
                    <option value="energy">Energy</option>
                    <option value="rage">Rage</option>
                    <option value="focus">Focus</option>
                  </select>
                </div>
                <div className="config-row">
                  <label>Threshold:</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={config.stateOptions.thresholdValue}
                    onChange={(e) => handleOptionChange('STATE_REQUIREMENTS', 'thresholdValue', parseInt(e.target.value))}
                  />
                  <span className="input-suffix">%</span>
                </div>
                <div className="config-row">
                  <label>Comparison:</label>
                  <select
                    value={config.stateOptions.thresholdType}
                    onChange={(e) => handleOptionChange('STATE_REQUIREMENTS', 'thresholdType', e.target.value)}
                  >
                    <option value="below">Below</option>
                    <option value="above">Above</option>
                    <option value="equal">Equal</option>
                  </select>
                </div>
                <div className="config-row">
                  <label>Original Formula:</label>
                  <div className="original-formula-display">
                    {getOriginalFormula()}
                  </div>
                </div>
                <div className="config-row">
                  <label>Modified Formula:</label>
                  <input
                    type="text"
                    value={config.stateOptions.modifiedFormula || getOriginalFormula() + ' * 1.5'}
                    onChange={(e) => handleOptionChange('STATE_REQUIREMENTS', 'modifiedFormula', e.target.value)}
                    placeholder="Enter modified formula"
                  />
                </div>
              </div>
            )}

            {config.system === 'FORM_SYSTEM' && (
              <div className="form-system-config">
                <div className="config-row">
                  <label>Form Type:</label>
                  <select
                    value={config.formOptions.formType}
                    onChange={(e) => handleOptionChange('FORM_SYSTEM', 'formType', e.target.value)}
                  >
                    <option value="bear_form">Bear Form</option>
                    <option value="cat_form">Cat Form</option>
                    <option value="tree_form">Tree Form</option>
                    <option value="moonkin_form">Moonkin Form</option>
                  </select>
                </div>
                <div className="config-row">
                  <label>Requires Form:</label>
                  <div className="toggle-switch-small">
                    <input
                      type="checkbox"
                      checked={config.formOptions.requiresForm}
                      onChange={(e) => handleOptionChange('FORM_SYSTEM', 'requiresForm', e.target.checked)}
                    />
                    <span className="toggle-slider-small"></span>
                  </div>
                </div>
                <div className="config-row">
                  <label>Bonus Type:</label>
                  <select
                    value={config.formOptions.bonusType}
                    onChange={(e) => handleOptionChange('FORM_SYSTEM', 'bonusType', e.target.value)}
                  >
                    <option value="damage">Damage</option>
                    <option value="healing">Healing</option>
                    <option value="armor">Armor</option>
                    <option value="speed">Movement Speed</option>
                  </select>
                </div>
                <div className="config-row">
                  <label>Bonus Amount:</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={config.formOptions.bonusAmount}
                    onChange={(e) => handleOptionChange('FORM_SYSTEM', 'bonusAmount', parseInt(e.target.value))}
                  />
                  <span className="input-suffix">%</span>
                </div>
                <div className="config-row">
                  <label>Form Spell:</label>
                  <SpellSelector
                    selectedSpellId={config.formOptions.formSpellId}
                    onSpellSelected={(spellId) => handleOptionChange('FORM_SYSTEM', 'formSpellId', spellId)}
                    placeholder="Select a form spell"
                  />
                </div>
              </div>
            )}

            {/* Toxic System Configuration */}
            {config.system === 'TOXIC_SYSTEM' && (
              <div className="toxic-system-config">
                {/* Toxic Type Selection */}
                <div className="config-row">
                  <label>Toxic Types:</label>
                  <div className="toxic-type-selector">
                    {MECHANICS_SYSTEMS.TOXIC_SYSTEM.toxicTypes.map(toxicType => (
                      <button
                        key={toxicType.id}
                        className={`toxic-icon-button ${config.toxicOptions.selectedToxicTypes[toxicType.id] ? 'active' : ''}`}
                        style={{ borderColor: toxicType.color }}
                        onClick={(e) => handleToxicTypeSelect(toxicType, e)}
                        onMouseEnter={(e) => handleToxicTooltipEnter(toxicType, e)}
                        onMouseLeave={handleToxicTooltipLeave}
                        onMouseMove={handleToxicTooltipMove}
                      >
                        {toxicType.wowIcon ? (
                          <div className="toxic-icon-wrapper">
                            <img
                              src={`https://wow.zamimg.com/images/wow/icons/large/${toxicType.wowIcon}.jpg`}
                              alt={toxicType.name}
                              style={{ width: '42px', height: '42px', borderRadius: '4px' }}
                            />
                            {config.toxicOptions.selectedToxicTypes[toxicType.id] && (
                              <div className="toxic-count">{config.toxicOptions.selectedToxicTypes[toxicType.id]}</div>
                            )}
                          </div>
                        ) : (
                          <div className="toxic-icon-wrapper">
                            {toxicType.name}
                            {config.toxicOptions.selectedToxicTypes[toxicType.id] && (
                              <div className="toxic-count">{config.toxicOptions.selectedToxicTypes[toxicType.id]}</div>
                            )}
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  <div className="effect-description">
                    Click to add toxic types. Click again to increase count (up to 3). Click when at max to remove.
                  </div>
                </div>

                {/* Duration Configuration */}
                <div className="config-row">
                  <label>Duration:</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={config.toxicOptions.duration}
                    onChange={(e) => handleOptionChange('TOXIC_SYSTEM', 'duration', parseInt(e.target.value))}
                  />
                  <select
                    value={config.toxicOptions.durationType}
                    onChange={(e) => handleOptionChange('TOXIC_SYSTEM', 'durationType', e.target.value)}
                    style={{ marginLeft: '8px' }}
                  >
                    <option value="rounds">Rounds</option>
                    <option value="minutes">Minutes</option>
                    <option value="hours">Hours</option>
                  </select>
                </div>

                {/* Consumption Rule */}
                {config.type === 'toxic_consumer' && (
                  <div className="config-row">
                    <label>Consumption Rule:</label>
                    <select
                      value={config.toxicOptions.consumptionRule}
                      onChange={(e) => handleOptionChange('TOXIC_SYSTEM', 'consumptionRule', e.target.value)}
                    >
                      <option value="all">Consume All Toxics</option>
                      <option value="specific">Consume Specific Types</option>
                      <option value="threshold">Consume Based on Threshold</option>
                    </select>
                  </div>
                )}

                {/* Update Formula Toggle */}
                {config.type === 'toxic_consumer' && (
                  <div className="config-row">
                    <label>Update Formula:</label>
                    <div className="toggle-switch-small">
                      <input
                        type="checkbox"
                        checked={config.toxicOptions.updateFormula}
                        onChange={(e) => handleOptionChange('TOXIC_SYSTEM', 'updateFormula', e.target.checked)}
                      />
                      <span className="toggle-slider-small"></span>
                    </div>
                    <span className="toggle-label">
                      {config.toxicOptions.updateFormula ? 'Formula scales with toxics' : 'Fixed formula'}
                    </span>
                  </div>
                )}

                {/* Graduated Effects for Toxic Consumer */}
                {config.type === 'toxic_consumer' && config.toxicOptions.updateFormula && (
                  <div className="effect-config-group">
                    <div className="graduated-effects-header">
                      <h4>Toxic Consumption Effects</h4>
                      <div className="graduated-effects-description">
                        <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
                        <span>Configure different effects based on how many toxic effects are consumed.</span>
                      </div>
                    </div>

                    {/* Direct Formula Modification */}
                    <div className="toxic-formula-modification">
                      <h5>Formula Modification</h5>
                      <div className="config-row">
                        <label>Base Formula:</label>
                        <div className="formula-display">
                          {getOriginalFormula()}
                        </div>
                      </div>

                      {/* Formula for consuming all toxics */}
                      <div className="config-row">
                        <label>Modified Formula:</label>
                        <input
                          type="text"
                          className="formula-input"
                          value={config.toxicOptions.modifiedFormula || ''}
                          onChange={(e) => handleOptionChange('TOXIC_SYSTEM', 'modifiedFormula', e.target.value)}
                          placeholder={`${getOriginalFormula()} + [toxic_count] * 2`}
                        />
                        <div className="formula-help">
                          <span>Use <code>[toxic_count]</code> to reference the number of toxic effects consumed.</span>
                          <span>Use <code>[toxic_type:disease]</code> to reference the count of a specific toxic type.</span>
                        </div>
                      </div>
                    </div>

                    <div className="toxic-graduated-effects">
                      <h5>Graduated Effects</h5>
                      <div className="graduated-effects-description">
                        <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
                        <span>Configure different formulas for specific toxic counts or combinations.</span>
                      </div>
                      <EnhancedGraduatedRecipeEffects
                        recipeLength={Object.keys(config.toxicOptions.selectedToxicTypes).length || 1}
                        graduatedEffects={config.toxicOptions.toxicEffects || {}}
                        onGraduatedEffectsChange={handleToxicEffectsChange}
                        effectType={effectType}
                        selectedToxicTypes={config.toxicOptions.selectedToxicTypes}
                        onToxicTooltipEnter={handleToxicTooltipEnter}
                        onToxicTooltipLeave={handleToxicTooltipLeave}
                        onToxicTooltipMove={handleToxicTooltipMove}
                        isChordSystem={false}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Chord System Configuration */}
            {config.system === 'CHORD_SYSTEM' && (
              <div className="chord-system-config">
                {/* Note Configuration */}
                {config.type === 'note' && (
                  <div className="config-row">
                    <label>Chord Function:</label>
                    <div className="chord-function-selector">
                      {MECHANICS_SYSTEMS.CHORD_SYSTEM.chordFunctions.map(chordFunction => (
                        <button
                          key={chordFunction.id}
                          className={`chord-function-button ${config.chordOptions.chordFunction === chordFunction.id ? 'active' : ''}`}
                          style={{ borderColor: chordFunction.color }}
                          onClick={(e) => handleChordOptionChange('chordFunction', chordFunction.id, e)}
                          onMouseEnter={(e) => handleChordTooltipEnter(chordFunction, e)}
                          onMouseLeave={handleChordTooltipLeave}
                          onMouseMove={handleChordTooltipMove}
                        >
                          {chordFunction.wowIcon ? (
                            <div className="chord-icon-wrapper">
                              <img
                                src={`https://wow.zamimg.com/images/wow/icons/large/${chordFunction.wowIcon}.jpg`}
                                alt={chordFunction.name}
                                style={{ width: '42px', height: '42px', borderRadius: '4px' }}
                              />
                            </div>
                          ) : (
                            <div className="chord-icon-wrapper">
                              {chordFunction.name}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                    <div className="effect-description">
                      Select the chord function this note represents in music theory.
                    </div>
                  </div>
                )}

                {/* Wildcard Configuration */}
                {config.type === 'wildcard' && (
                  <div className="config-row">
                    <label>Wildcard Note:</label>
                    <div className="effect-description">
                      This note acts as a wildcard and can substitute for any chord function in a recipe.
                    </div>
                  </div>
                )}

                {/* Extender Configuration */}
                {config.type === 'extender' && (
                  <div className="config-row">
                    <label>Extend Duration:</label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      value={config.chordOptions.extendDuration}
                      onChange={(e) => handleOptionChange('CHORD_SYSTEM', 'extendDuration', parseInt(e.target.value))}
                    />
                    <span className="input-suffix">rounds</span>
                    <div className="effect-description">
                      This note extends the improvisation window by the specified number of rounds.
                    </div>
                  </div>
                )}

                {/* Chord Recipe Configuration */}
                {config.type === 'chord' && (
                  <>
                    <div className="config-row">
                      <label>Recipe:</label>
                      <div className="chord-recipe-display">
                        {config.chordOptions.recipeDisplay.length > 0 ? (
                          config.chordOptions.recipeDisplay.map((chord, index) => (
                            <div
                              key={index}
                              className="chord-recipe-item"
                              style={{ borderColor: chord.color }}
                              onClick={() => removeChordFromRecipe(index)}
                            >
                              {chord.name}
                              <span className="remove-chord">×</span>
                            </div>
                          ))
                        ) : (
                          <div className="empty-recipe">No chord functions added</div>
                        )}
                      </div>
                    </div>

                    <div className="config-row">
                      <label>Add to Recipe:</label>
                      <div className="chord-function-selector">
                        {MECHANICS_SYSTEMS.CHORD_SYSTEM.chordFunctions.map(chordFunction => (
                          <button
                            key={chordFunction.id}
                            className="chord-function-button"
                            style={{ borderColor: chordFunction.color }}
                            onClick={(e) => addChordToRecipe(chordFunction, e)}
                            onMouseEnter={(e) => handleChordTooltipEnter(chordFunction, e)}
                            onMouseLeave={handleChordTooltipLeave}
                            onMouseMove={handleChordTooltipMove}
                          >
                            {chordFunction.wowIcon ? (
                              <div className="chord-icon-wrapper">
                                <img
                                  src={`https://wow.zamimg.com/images/wow/icons/large/${chordFunction.wowIcon}.jpg`}
                                  alt={chordFunction.name}
                                  style={{ width: '32px', height: '32px', borderRadius: '4px' }}
                                />
                              </div>
                            ) : (
                              <div className="chord-icon-wrapper">
                                {chordFunction.name}
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="config-row">
                      <label>Improvisation Window:</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={config.chordOptions.improvisationWindow}
                        onChange={(e) => handleOptionChange('CHORD_SYSTEM', 'improvisationWindow', parseInt(e.target.value))}
                      />
                      <span className="input-suffix">rounds</span>
                      <div className="effect-description">
                        The number of rounds players have to complete the chord recipe.
                      </div>
                    </div>

                    {/* Partial Match Type Selection */}
                    <div className="config-row">
                      <label>Partial Match Type:</label>
                      <div className="partial-match-options">
                        <button
                          className={`partial-match-option ${config.chordOptions.partialMatchType === 'count' ? 'active' : ''}`}
                          onClick={() => handleOptionChange('CHORD_SYSTEM', 'partialMatchType', 'count')}
                        >
                          <div className="partial-match-icon">
                            <FontAwesomeIcon icon={faArrowUp} />
                          </div>
                          <div className="partial-match-content">
                            <h5>Count-Based</h5>
                            <p>Effects scale based on how many chord functions match, regardless of which ones.</p>
                          </div>
                        </button>
                        <button
                          className={`partial-match-option ${config.chordOptions.partialMatchType === 'specific' ? 'active' : ''}`}
                          onClick={() => handleOptionChange('CHORD_SYSTEM', 'partialMatchType', 'specific')}
                        >
                          <div className="partial-match-icon">
                            <FontAwesomeIcon icon={faMusic} />
                          </div>
                          <div className="partial-match-content">
                            <h5>Function-Specific</h5>
                            <p>Effects require specific chord functions to be matched.</p>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Specific Chord Functions Selection (only shown when partialMatchType is 'specific') */}
                    {config.chordOptions.partialMatchType === 'specific' && (
                      <div className="config-row">
                        <label>Required Functions:</label>
                        <div className="required-functions-description">
                          <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
                          <span>Select which chord functions are required for partial resolution.</span>
                        </div>
                        <div className="chord-function-selector">
                          {config.chordOptions.recipeDisplay.map((chord, index) => (
                            <button
                              key={index}
                              className={`chord-function-button ${config.chordOptions.requiredFunctions[chord.id] ? 'active' : ''}`}
                              style={{ borderColor: chord.color }}
                              onClick={() => {
                                const requiredFunctions = { ...config.chordOptions.requiredFunctions };
                                if (requiredFunctions[chord.id]) {
                                  delete requiredFunctions[chord.id];
                                } else {
                                  requiredFunctions[chord.id] = true;
                                }
                                handleOptionChange('CHORD_SYSTEM', 'requiredFunctions', requiredFunctions);
                              }}
                              onMouseEnter={(e) => handleChordTooltipEnter(chord, e)}
                              onMouseLeave={handleChordTooltipLeave}
                              onMouseMove={handleChordTooltipMove}
                            >
                              <div className="chord-icon-wrapper">
                                {chord.wowIcon ? (
                                  <img
                                    src={`https://wow.zamimg.com/images/wow/icons/large/${chord.wowIcon}.jpg`}
                                    alt={chord.name}
                                    style={{ width: '32px', height: '32px', borderRadius: '4px' }}
                                  />
                                ) : (
                                  chord.name
                                )}
                                {config.chordOptions.requiredFunctions[chord.id] && (
                                  <div className="required-function-indicator">✓</div>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                        <div className="effect-description">
                          Click to toggle which chord functions are required for partial resolution.
                        </div>
                      </div>
                    )}

                    {/* Graduated Effects for Chord Recipe */}
                    <div className="effect-config-group">
                      <div className="graduated-effects-header">
                        <h4>Graduated Recipe Effects</h4>
                        <div className="graduated-effects-description">
                          <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
                          <span>
                            {config.chordOptions.partialMatchType === 'count'
                              ? 'Configure different effects based on how many chord functions match the recipe.'
                              : 'Configure different effects based on which specific chord functions are matched.'}
                          </span>
                        </div>
                      </div>
                      <EnhancedGraduatedRecipeEffects
                        recipeLength={config.chordOptions.recipeDisplay.length || 1}
                        graduatedEffects={config.chordOptions.graduatedEffects || {}}
                        onGraduatedEffectsChange={handleChordGraduatedEffectsChange}
                        effectType={effectType}
                        isChordSystem={true}
                        partialMatchType={config.chordOptions.partialMatchType}
                        requiredFunctions={config.chordOptions.requiredFunctions}
                      />
                    </div>
                  </>
                )}
              </div>
            )}

            {/* System Preview */}
            <div className="mechanics-preview">
              <h4 className="section-header">Preview</h4>
              <div className="preview-content" style={{ borderColor: selectedSystem.color }}>
                {/* Combo Points Preview */}
                {config.system === 'COMBO_POINTS' && (
                  <div className="preview-text">
                    {config.type === 'builder' ? (
                      <p>
                        This spell generates <span className="highlight" style={{ color: selectedSystem.color }}>1 combo point</span> when cast.
                      </p>
                    ) : (
                      <p>
                        This spell requires <span className="highlight" style={{ color: selectedSystem.color }}>{config.thresholdValue} combo points</span> to cast.
                        {config.comboOptions.consumptionRule === 'all' && ' All points will be consumed.'}
                        {config.comboOptions.consumptionRule === 'threshold' && ` ${config.thresholdValue} points will be consumed.`}
                        {config.comboOptions.consumptionRule === 'none' && ' No points will be consumed.'}
                      </p>
                    )}
                  </div>
                )}

                {/* Proc System Preview */}
                {config.system === 'PROC_SYSTEM' && (
                  <div className="preview-text">
                    <p>
                      This spell has a <span className="highlight" style={{ color: selectedSystem.color }}>{config.procOptions.procChance}% chance</span> to trigger
                      {config.procOptions.spellId ? (
                        <span> the spell <span className="highlight">{library.spells.find(spell => spell.id === config.procOptions.spellId)?.name || 'selected spell'}</span></span>
                      ) : (
                        <span> an additional effect</span>
                      )}
                      {config.procOptions.triggerLimit > 1 ? (
                        <span> up to <span className="highlight">{config.procOptions.triggerLimit} times</span> per round.</span>
                      ) : (
                        <span> once per round.</span>
                      )}
                    </p>
                  </div>
                )}

                {/* State Requirements Preview */}
                {config.system === 'STATE_REQUIREMENTS' && (
                  <div className="preview-text">
                    <p>
                      When target's <span className="highlight" style={{ color: selectedSystem.color }}>{config.stateOptions.resourceType}</span> is
                      <span className="highlight" style={{ color: selectedSystem.color }}> {config.stateOptions.thresholdType} {config.stateOptions.thresholdValue}%</span>,
                      this spell's formula changes from
                      <span className="highlight"> {getOriginalFormula()}</span> to
                      <span className="highlight"> {config.stateOptions.modifiedFormula || getOriginalFormula() + ' * 1.5'}</span>.
                    </p>
                  </div>
                )}

                {/* Form System Preview */}
                {config.system === 'FORM_SYSTEM' && (
                  <div className="preview-text">
                    <p>
                      This spell {config.formOptions.requiresForm ? 'requires' : 'is enhanced by'}
                      <span className="highlight" style={{ color: selectedSystem.color }}> {config.formOptions.formType.replace('_', ' ')}</span>
                      {config.formOptions.requiresForm ? ' to cast' : ''} and provides
                      <span className="highlight"> {config.formOptions.bonusAmount}% {config.formOptions.bonusType}</span>
                      {config.formOptions.formSpellId ? (
                        <span> when using <span className="highlight">{library.spells.find(spell => spell.id === config.formOptions.formSpellId)?.name || 'selected form spell'}</span>.</span>
                      ) : (
                        <span> when in the correct form.</span>
                      )}
                    </p>
                  </div>
                )}

                {/* Toxic System Preview */}
                {config.system === 'TOXIC_SYSTEM' && config.type === 'toxic_applier' && (
                  <div className="preview-text">
                    <p>
                      This spell applies the following toxic effects to the target:
                      {Object.entries(config.toxicOptions.selectedToxicTypes).length > 0 ? (
                        <ul className="toxic-preview-list">
                          {Object.entries(config.toxicOptions.selectedToxicTypes).map(([toxicId, count]) => {
                            const toxicType = MECHANICS_SYSTEMS.TOXIC_SYSTEM.toxicTypes.find(t => t.id === toxicId);
                            return (
                              <li key={toxicId} className="toxic-preview-item">
                                <span className="highlight" style={{ color: toxicType?.color || '#ffffff' }}>
                                  {count}x {toxicType?.name || toxicId}
                                </span>
                              </li>
                            );
                          })}
                        </ul>
                      ) : (
                        <span className="highlight"> No toxic types selected</span>
                      )}
                      <span> for </span>
                      <span className="highlight">{config.toxicOptions.duration} {config.toxicOptions.durationType}</span>.
                    </p>
                  </div>
                )}

                {config.system === 'TOXIC_SYSTEM' && config.type === 'toxic_consumer' && (
                  <div className="preview-text">
                    <p>
                      This spell consumes toxic effects from the target using the
                      <span className="highlight" style={{ color: selectedSystem.color }}>
                        {' '}{config.toxicOptions.consumptionRule === 'all' ? 'all toxics' :
                          config.toxicOptions.consumptionRule === 'specific' ? 'specific types' :
                          'threshold'}{' '}
                      </span>
                      rule.
                      {config.toxicOptions.updateFormula && (
                        <>
                          <span> The spell's formula will be updated based on the consumed toxic effects.</span>

                          {/* Show the modified formula if it exists */}
                          {config.toxicOptions.modifiedFormula && (
                            <div className="modified-formula-preview">
                              <span>Base formula </span>
                              <span className="highlight">{getOriginalFormula()}</span>
                              <span> will be modified to </span>
                              <span className="highlight">{config.toxicOptions.modifiedFormula}</span>
                              <span> when toxics are consumed.</span>
                            </div>
                          )}

                          {/* Show graduated effects if they exist */}
                          {Object.keys(config.toxicOptions.toxicEffects || {}).length > 0 ? (
                            <>
                              <span> It has </span>
                              <span className="highlight">
                                {Object.keys(config.toxicOptions.toxicEffects).length}
                              </span>
                              <span> graduated effect levels based on toxic consumption:</span>
                              <ul className="graduated-effects-preview">
                                {Object.entries(config.toxicOptions.toxicEffects || {})
                                  .sort(([levelA], [levelB]) => parseInt(levelA) - parseInt(levelB))
                                  .map(([level, effect]) => (
                                    <li key={level} className="graduated-effect-item">
                                      <span className="highlight" style={{ color: selectedSystem.color }}>
                                        {level} toxic{parseInt(level) !== 1 ? 's' : ''}:
                                      </span>
                                      <span> {effect.formula || 'No formula specified'}</span>
                                    </li>
                                  ))}
                              </ul>
                            </>
                          ) : (
                            !config.toxicOptions.modifiedFormula && (
                              <span> No formula modifications have been configured yet.</span>
                            )
                          )}
                        </>
                      )}
                    </p>
                  </div>
                )}

                {/* Chord System Preview */}
                {config.system === 'CHORD_SYSTEM' && config.type === 'chord' && (
                  <div className="preview-text">
                    <p>
                      This spell requires a specific sequence of
                      <span className="highlight" style={{ color: selectedSystem.color }}>
                        {' '}{config.chordOptions.recipeDisplay.length}{' '}
                      </span>
                      chord functions to be played in order:
                      {config.chordOptions.recipeDisplay.length > 0 ? (
                        <ul className="chord-preview-list">
                          {config.chordOptions.recipeDisplay.map((chord, index) => (
                            <li key={index} className="chord-preview-item">
                              <span className="highlight" style={{ color: chord.color }}>
                                {chord.name}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="highlight"> No chord functions added</span>
                      )}
                      <span> Players have </span>
                      <span className="highlight">{config.chordOptions.improvisationWindow} rounds</span>
                      <span> to complete this recipe.</span>

                      {/* Graduated Effects Preview */}
                      {Object.keys(config.chordOptions.graduatedEffects || {}).length > 0 && (
                        <>
                          <div className="graduated-effects-section">
                            <span>The spell has </span>
                            <span className="highlight">
                              {Object.keys(config.chordOptions.graduatedEffects).length}
                            </span>
                            <span> graduated effect levels based on partial recipe matches:</span>
                            <ul className="graduated-effects-preview">
                              {Object.entries(config.chordOptions.graduatedEffects || {})
                                .sort(([levelA], [levelB]) => parseInt(levelA) - parseInt(levelB))
                                .map(([level, effect]) => (
                                  <li key={level} className="graduated-effect-item">
                                    <span className="highlight" style={{ color: selectedSystem.color }}>
                                      {level}/{config.chordOptions.recipeDisplay.length} chord functions:
                                    </span>
                                    <span> {effect.formula || 'No formula specified'}</span>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        </>
                      )}
                    </p>
                  </div>
                )}

                {config.system === 'CHORD_SYSTEM' && (config.type === 'note' || config.type === 'wildcard' || config.type === 'extender') && (
                  <div className="preview-text">
                    <p>
                      This spell plays a
                      <span className="highlight" style={{ color: selectedSystem.color }}>
                        {' '}{config.type === 'note' ? (
                          <>
                            {MECHANICS_SYSTEMS.CHORD_SYSTEM.chordFunctions.find(cf => cf.id === config.chordOptions.chordFunction)?.name || 'Unknown'}
                          </>
                        ) : config.type === 'wildcard' ? 'wildcard' : 'extender'}{' '}
                      </span>
                      note that can be used in chord recipes.
                      {config.type === 'wildcard' && ' It can substitute for any chord function in a recipe.'}
                      {config.type === 'extender' && ` It extends the improvisation window by ${config.chordOptions.extendDuration} rounds.`}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {/* WoW Classic Tooltip */}
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

export default SimplifiedMechanicsConfig;
