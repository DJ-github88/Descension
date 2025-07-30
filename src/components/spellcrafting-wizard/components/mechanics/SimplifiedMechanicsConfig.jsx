import React, { useState, useEffect, useCallback } from 'react';

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
  faSkullCrossbones,
  faInfoCircle,
  faGear,
  faCog,
  faCheck,
  faChevronDown,
  faEye,
  faPlus,
  faExclamationTriangle,
  faWandMagicSparkles
} from '@fortawesome/free-solid-svg-icons';

import SpellSelector from '../common/SpellSelector';
import IconSelectionCard from '../common/IconSelectionCard';
import EnhancedGraduatedRecipeEffects from './EnhancedGraduatedRecipeEffects';

// Import Pathfinder styles
import '../../styles/MechanicThresholds.css';
// Pathfinder styles imported via main.css

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
    icon: faSkullCrossbones,
    thresholds: [2, 4, 6, 8],
    color: "#8B008B", // Dark magenta color
    types: [
      { id: 'toxic_applier', name: 'Toxic Applier', description: 'Applies toxins, diseases, or other afflictions', icon: faFlask },
      { id: 'toxic_consumer', name: 'Toxic Consumer', description: 'Consumes toxins for enhanced effects', icon: faSkullCrossbones }
    ],
    toxicTypes: [
      // Core Toxic Types
      { id: 'disease', name: 'Disease', description: 'Biological afflictions that weaken the target over time', color: '#8B008B', wowIcon: 'ability_creature_disease_01' },
      { id: 'poison', name: 'Poison', description: 'Toxic substances that cause immediate and ongoing damage', color: '#00AA00', wowIcon: 'ability_creature_poison_06' },
      { id: 'curse', name: 'Curse', description: 'Magical afflictions that reduce effectiveness and luck', color: '#4B0082', wowIcon: 'spell_shadow_curseofsargeras' },
      { id: 'venom', name: 'Venom', description: 'Injected toxins that cause severe damage and paralysis', color: '#228B22', wowIcon: 'ability_creature_poison_03' },

      // Advanced Toxic Types
      { id: 'blight', name: 'Blight', description: 'Corrupting force that spreads to nearby targets', color: '#8B0000', wowIcon: 'spell_shadow_creepingplague' },
      { id: 'acid', name: 'Acid', description: 'Corrosive substance that dissolves armor and flesh', color: '#FFD700', wowIcon: 'spell_nature_acid_01' },
      { id: 'necrosis', name: 'Necrosis', description: 'Death magic that causes tissue decay and weakness', color: '#2F4F4F', wowIcon: 'spell_shadow_deathcoil' },
      { id: 'miasma', name: 'Miasma', description: 'Toxic cloud that impairs vision and breathing', color: '#696969', wowIcon: 'spell_shadow_plaguecloud' },

      // Exotic Toxic Types
      { id: 'parasites', name: 'Parasites', description: 'Living organisms that drain health and mana', color: '#8B4513', wowIcon: 'spell_nature_insectswarm' },
      { id: 'radiation', name: 'Radiation', description: 'Arcane energy that mutates and weakens over time', color: '#00CED1', wowIcon: 'spell_arcane_arcanetorrent' },
      { id: 'corruption', name: 'Corruption', description: 'Dark energy that corrupts from within', color: '#4B0082', wowIcon: 'spell_shadow_abominationexplosion' },
      { id: 'contagion', name: 'Contagion', description: 'Rapidly spreading infection that jumps between targets', color: '#8B4513', wowIcon: 'spell_shadow_contagion' }
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

  // Tooltip state removed for cleaner interface

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

  // Tooltip handlers removed for cleaner Pathfinder aesthetic

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

    // Tooltip removed
  };

  // Handle toxic tooltip events
  // Toxic tooltip handlers removed

  // Handle chord function selection
  const handleChordOptionChange = (option, value, event) => {
    handleOptionChange('CHORD_SYSTEM', option, value);

    // Chord function tooltip removed
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

    // Tooltip removed
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

  // Clear the entire recipe
  const clearRecipe = () => {
    setConfig(prevConfig => ({
      ...prevConfig,
      chordOptions: {
        ...prevConfig.chordOptions,
        recipeDisplay: [],
        recipe: '',
        requiredFunctions: {}
      }
    }));
  };

  // Chord tooltip handlers removed

  // Handle toxic effects change
  const handleToxicEffectsChange = useCallback((effects) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      toxicOptions: {
        ...prevConfig.toxicOptions,
        toxicEffects: effects
      }
    }));
  }, [setConfig]);

  // Handle chord graduated effects change
  const handleChordGraduatedEffectsChange = useCallback((effects) => {
    setConfig(prevConfig => ({
      ...prevConfig,
      chordOptions: {
        ...prevConfig.chordOptions,
        graduatedEffects: effects
      }
    }));
  }, [setConfig]);

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
      {/* Pathfinder-Style Header */}
      <div className="mechanics-header-pathfinder">
        <div className="mechanics-title-section">
          <h3>Spell Mechanics</h3>
          <p className="mechanics-subtitle">Add special mechanics to enhance your spell's behavior</p>
        </div>
        <div className="mechanics-toggle-pathfinder">
          <label className="pf-toggle-switch">
            <input
              type="checkbox"
              checked={config.enabled}
              onChange={handleToggleEnabled}
            />
            <span className="pf-toggle-slider"></span>
          </label>
          <span className="pf-toggle-label">{config.enabled ? 'Mechanics Enabled' : 'No Mechanics'}</span>
        </div>
      </div>

      {config.enabled && (
        <div className="mechanics-content-layout-row">
          {/* Top Section - System Selection in Row */}
          <div className="mechanics-system-selection-row">
            <h4 className="mechanics-section-title">Choose Mechanic System</h4>
            <div className="mechanics-system-grid">
              {Object.entries(MECHANICS_SYSTEMS).map(([systemId, system]) => (
                <div
                  key={systemId}
                  className={`pf-system-option-compact ${config.system === systemId ? 'selected' : ''}`}
                  onClick={() => handleSystemChange(systemId)}
                >
                  <div className="pf-system-content-compact">
                    <h5 className="pf-system-title-compact">{system.name}</h5>
                    <p className="pf-system-description-compact">{system.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Section - Configuration */}
          <div className="mechanics-configuration-section">
            <div className="mechanics-section">
              <h4 className="mechanics-section-title">Configure {selectedSystem.name}</h4>

              {/* Pathfinder Type Selection */}
              <div className="pf-type-selection">
                <div className="pf-type-header">
                  <label className="pf-type-label">Mechanic Type</label>
                  <div className="pf-type-description">
                    Choose how this mechanic behaves in your spell
                  </div>
                </div>
                <div className="pf-type-list">
                  {selectedSystem.types.map(type => (
                    <div
                      key={type.id}
                      className={`pf-type-option ${config.type === type.id ? 'selected' : ''}`}
                      onClick={() => handleTypeChange(type.id)}
                    >
                      <div className="pf-type-content">
                        <h6 className="pf-type-title">{type.name}</h6>
                        <p className="pf-type-description">{type.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Enhanced System-specific Configuration */}
              <div className="mechanics-system-config">
                {config.system === 'COMBO_POINTS' && (
                  <div className="combo-points-config-enhanced">
                    <div className="config-section">
                      <div className="config-section-header">
                        <FontAwesomeIcon icon={faArrowUp} className="config-icon" />
                        <h5>Combo Point Settings</h5>
                      </div>

                      <div className="config-field">
                        <label className="config-label">Point Threshold</label>
                        <div className="config-description">Choose how many combo points are required</div>
                        <div className="pf-threshold-selector">
                          {selectedSystem.thresholds.map(threshold => (
                            <div
                              key={threshold}
                              className={`pf-threshold-option ${config.thresholdValue === threshold ? 'selected' : ''}`}
                              onClick={() => handleThresholdChange(threshold)}
                            >
                              <div className="pf-threshold-number">{threshold}</div>
                              <div className="pf-threshold-label">{threshold === 1 ? 'point' : 'points'}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="config-field">
                        <label className="config-label">Consumption Rule</label>
                        <div className="config-description">How combo points are consumed when the spell is cast</div>
                        <div className="pf-select-wrapper">
                          <select
                            value={config.comboOptions.consumptionRule}
                            onChange={(e) => handleOptionChange('COMBO_POINTS', 'consumptionRule', e.target.value)}
                            className="pf-config-select"
                          >
                            <option value="all">Consume All Points</option>
                            <option value="threshold">Consume Threshold Amount</option>
                            <option value="none">Don't Consume Points</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {config.system === 'PROC_SYSTEM' && (
                  <div className="proc-system-config-enhanced">
                    <div className="config-section">
                      <div className="config-section-header">
                        <FontAwesomeIcon icon={faBolt} className="config-icon" />
                        <h5>Proc System Settings</h5>
                      </div>

                      <div className="config-field">
                        <label className="config-label">Proc Chance</label>
                        <div className="config-description">Percentage chance for the effect to trigger</div>
                        <div className="pf-input-group">
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={config.procOptions.procChance}
                            onChange={(e) => handleOptionChange('PROC_SYSTEM', 'procChance', parseInt(e.target.value))}
                            className="pf-config-input"
                          />
                          <span className="pf-input-suffix">%</span>
                        </div>
                      </div>

                      <div className="config-field">
                        <label className="config-label">Trigger Limit</label>
                        <div className="config-description">Maximum number of triggers per round</div>
                        <div className="pf-input-group">
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value={config.procOptions.triggerLimit}
                            onChange={(e) => handleOptionChange('PROC_SYSTEM', 'triggerLimit', parseInt(e.target.value))}
                            className="pf-config-input"
                          />
                          <span className="pf-input-suffix">per round</span>
                        </div>
                      </div>

                      <div className="config-field">
                        <label className="config-label">Linked Spell</label>
                        <div className="config-description">Choose which spell this proc will trigger</div>
                        <div className="spell-selector-wrapper">
                          <SpellSelector
                            selectedSpellId={config.procOptions.spellId}
                            onSelectSpell={(spellId) => handleOptionChange('PROC_SYSTEM', 'spellId', spellId)}
                            filterType="proc"
                            placeholder="Select a spell to trigger"
                            className="config-spell-selector"
                          />
                        </div>
                      </div>
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
                    onSelectSpell={(spellId) => handleOptionChange('FORM_SYSTEM', 'formSpellId', spellId)}
                    filterType="form"
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
                  <div className="chord-function-grid">
                    {MECHANICS_SYSTEMS.TOXIC_SYSTEM.toxicTypes.map(toxicType => (
                      <button
                        key={toxicType.id}
                        className={`chord-function-button ${config.toxicOptions.selectedToxicTypes[toxicType.id] ? 'active' : ''}`}
                        onClick={(e) => handleToxicTypeSelect(toxicType, e)}
                      >
                        <div className="chord-icon-wrapper">
                          {toxicType.name}
                          {config.toxicOptions.selectedToxicTypes[toxicType.id] && (
                            <div className="toxic-count">{config.toxicOptions.selectedToxicTypes[toxicType.id]}</div>
                          )}
                        </div>
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
                  <div className="duration-config">
                    <input
                      type="number"
                      min="1"
                      max="60"
                      value={config.toxicOptions.duration}
                      onChange={(e) => handleOptionChange('TOXIC_SYSTEM', 'duration', parseInt(e.target.value))}
                      className="duration-input"
                    />
                    <select
                      value={config.toxicOptions.durationType}
                      onChange={(e) => handleOptionChange('TOXIC_SYSTEM', 'durationType', e.target.value)}
                      className="duration-select"
                    >
                      <option value="rounds">Rounds (6 sec each)</option>
                      <option value="minutes">Minutes</option>
                      <option value="hours">Hours</option>
                      <option value="permanent">Permanent</option>
                      <option value="until_cured">Until Cured</option>
                    </select>
                  </div>
                  <div className="effect-description">
                    How long the toxic effects last on the target.
                  </div>
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
                  <div className="config-field">
                    <label className="config-label">Chord Function</label>
                    <div className="config-description">Select the chord function this note represents in music theory</div>
                    <div className="chord-function-grid">
                      {MECHANICS_SYSTEMS.CHORD_SYSTEM.chordFunctions.map(chordFunction => (
                        <button
                          key={chordFunction.id}
                          className={`chord-function-button ${config.chordOptions.chordFunction === chordFunction.id ? 'active' : ''} chord-color-${chordFunction.id.replace('_', '-')}`}
                          onClick={(e) => handleChordOptionChange('chordFunction', chordFunction.id, e)}
                        >
                          <div className="chord-icon-wrapper">
                            {chordFunction.name}
                          </div>
                        </button>
                      ))}
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
                  <div className="chord-recipe-builder">
                    <div className="chord-recipe-header">
                      <h5 className="chord-recipe-title">Chord Recipe Builder</h5>
                      <button
                        className="chord-recipe-clear"
                        onClick={clearRecipe}
                      >
                        Clear Recipe
                      </button>
                    </div>

                    <div className="config-field">
                      <label className="config-label">Current Recipe</label>
                      <div className="config-description">The sequence of notes required to cast this spell</div>
                      <div className="chord-recipe-display">
                        {config.chordOptions.recipeDisplay.length > 0 ? (
                          <>
                            {config.chordOptions.recipeDisplay.map((chord, index) => (
                              <React.Fragment key={index}>
                                <div className="chord-recipe-note">
                                  <div className="chord-recipe-note-name">{chord.name}</div>
                                  <button
                                    className="chord-recipe-note-remove"
                                    onClick={() => removeChordFromRecipe(index)}
                                  >
                                    ×
                                  </button>
                                </div>
                                {index < config.chordOptions.recipeDisplay.length - 1 && (
                                  <div className="chord-recipe-arrow">→</div>
                                )}
                              </React.Fragment>
                            ))}
                          </>
                        ) : (
                          <div className="chord-recipe-empty">No chord functions added</div>
                        )}
                      </div>
                    </div>

                    <div className="config-field">
                      <label className="config-label">Add to Recipe</label>
                      <div className="config-description">Click a chord function to add it to the recipe</div>
                      <div className="chord-function-grid">
                        {MECHANICS_SYSTEMS.CHORD_SYSTEM.chordFunctions.map(chordFunction => (
                          <button
                            key={chordFunction.id}
                            className="chord-function-button"
                            onClick={(e) => addChordToRecipe(chordFunction, e)}
                          >
                            <div className="chord-icon-wrapper">
                              {chordFunction.name}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="config-field">
                      <label className="config-label">Improvisation Window</label>
                      <div className="config-description">The number of rounds players have to complete the chord recipe</div>
                      <div className="improvisation-window-input">
                        <input
                          type="number"
                          min="1"
                          max="10"
                          value={config.chordOptions.improvisationWindow}
                          onChange={(e) => handleOptionChange('CHORD_SYSTEM', 'improvisationWindow', parseInt(e.target.value))}
                        />
                        <span className="improvisation-window-label">rounds</span>
                      </div>
                    </div>



                    {/* Graduated Effects for Chord Recipe */}
                    <div className="effect-config-group">
                      <div className="graduated-effects-header">
                        <h4>Graduated Recipe Effects</h4>
                        <div className="graduated-effects-description">
                          <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
                          <span>Configure different effects based on chord function matches. Each level can require specific chord functions or just a count.</span>
                        </div>
                      </div>
                      <EnhancedGraduatedRecipeEffects
                        recipeLength={config.chordOptions.recipeDisplay.length || 1}
                        graduatedEffects={config.chordOptions.graduatedEffects || {}}
                        onGraduatedEffectsChange={handleChordGraduatedEffectsChange}
                        effectType={effectType}
                        isChordSystem={true}
                        selectedToxicTypes={Object.fromEntries(config.chordOptions.recipeDisplay.map(chord => [chord.id, 1]))}
                      />
                    </div>
                  </div>
                )}
              </div>
            )}

            </div>
          </div>
        </div>




      </div>
      )}

      {/* Tooltip rendering removed for cleaner interface */}

    </div>
  );
};

export default SimplifiedMechanicsConfig;
