import React, { useState, useEffect, useRef } from 'react';
import { getAbilityIconUrl } from '../../../../utils/assetManager';


import IconSelectionCard from '../../components/common/IconSelectionCard';
import {
  FaTrashCan,
  FaCircleXmark,
  FaWandMagicSparkles,
  FaDroplet,
  FaSkull,
  FaPersonCircleCheck,
  FaHeartPulse,
  FaShieldHalved,
  FaHandSparkles,
  FaCircleInfo,
  FaPlus,
  FaMinus,
  FaDiceD20,
  FaCoins,
  FaClone
} from 'react-icons/fa6';

// Purification type definitions
export const PURIFICATION_TYPES = {
  DISPEL: {
    id: 'dispel',
    name: 'Dispel',
    icon: 'Arcane/Magical Cross Emblem 2',
    description: 'Remove magical or physical effects from targets',
    color: '#9966ff'
  },
  RESURRECTION: {
    id: 'resurrection',
    name: 'Resurrection',
    icon: 'Necrotic/Resurrect',
    description: 'Bring dead targets back to life',
    color: '#ffcc66'
  }
};

// Duration types
const DURATION_TYPES = [
  { id: 'instant', name: 'Instantaneous', description: 'Effect happens immediately with no duration', icon: 'Utility/Utility' },
  { id: 'rounds', name: 'Rounds', description: 'Combat rounds (approx. 6 seconds each)', icon: 'Utility/Utility' },
  { id: 'minutes', name: 'Minutes', description: 'Real-time minutes', icon: 'Utility/Utility' },
  { id: 'hours', name: 'Hours', description: 'Real-time hours', icon: 'Utility/Utility' }
];

// Dispel effect types
const DISPEL_TYPES = [
  { id: 'magic', name: 'Magic', icon: 'Arcane/Enchanted Sword', description: 'Dispel magical buffs and debuffs' },
  { id: 'physical', name: 'Physical', icon: 'General/Fiery Rage', description: 'Remove physical effects like poison, disease, or bleeds' },
  { id: 'curse', name: 'Curse', icon: 'Healing/Cure Within', description: 'Remove curses and hexes' },
  { id: 'beneficial', name: 'Beneficial', icon: 'Radiant/Radiant Golden Shield', description: 'Remove only beneficial effects (buffs)' },
  { id: 'harmful', name: 'Harmful', icon: 'Psychic/Mind Strike', description: 'Remove only harmful effects (debuffs)' },
  { id: 'all', name: 'All Effects', icon: 'Arcane/Magical Cross Emblem 2', description: 'Remove all types of effects' }
];

// Specific physical effect types
const PHYSICAL_EFFECT_TYPES = [
  { id: 'physical', name: 'physical', icon: 'Bludgeoning/Mortal Strike', description: 'Remove bludgeoning effects' },
  { id: 'physical', name: 'physical', icon: 'Slashing/Sword Pierce', description: 'Remove piercing effects' },
  { id: 'physical', name: 'physical', icon: 'Slashing/Cleave', description: 'Remove slashing effects' },
  { id: 'blight', name: 'blight', icon: 'Healing/Cure Within', description: 'Remove poison effects' },
  { id: 'disease', name: 'Disease', icon: 'Healing/Cure Within', description: 'Remove disease effects' },
  { id: 'bleed', name: 'Bleed', icon: 'General/Fiery Rage', description: 'Remove bleeding effects' }
];

// Specific magical effect types
const MAGICAL_EFFECT_TYPES = [
  { id: 'blight', name: 'blight', icon: 'Poison/Acid Splash', description: 'Remove acid effects' },
  { id: 'rime', name: 'rime', icon: 'Frost/Frozen in Ice', description: 'Remove cold effects' },
  { id: 'ember', name: 'ember', icon: 'Fire/Flame Burst', description: 'Remove fire effects' },
  { id: 'arcane', name: 'arcane', icon: 'Arcane/Magical Sword', description: 'Remove force effects' },
  { id: 'storm', name: 'storm', icon: 'Lightning/Lightning Bolt', description: 'Remove lightning effects' },
  { id: 'blight', name: 'blight', icon: 'Void/Black Hole', description: 'Remove necrotic effects' },
  { id: 'wyrd', name: 'wyrd', icon: 'Psychic/Mind Roar', description: 'Remove psychic effects' },
  { id: 'ember', name: 'ember', icon: 'Radiant/Radiant Bolt', description: 'Remove radiant effects' },
  { id: 'storm', name: 'storm', icon: 'Lightning/Thunder', description: 'Remove thunder effects' },
  { id: 'blight', name: 'blight', icon: 'Void/Black Hole', description: 'Remove silence effects' }
];

// Resurrection configuration
const RESURRECTION_CONFIG = {
  id: 'resurrection',
  name: 'Resurrection',
  icon: 'Necrotic/Resurrect',
  description: 'Bring dead targets back to life'
};

// Effect descriptions
const PURIFICATION_EFFECT_DESCRIPTIONS = {
  dispel: {
    magic: "Remove magical effects from a target",
    physical: "Remove physical effects from a target",
    curse: "Remove curses and hexes from a target",
    beneficial: "Remove beneficial effects (buffs) from a target",
    harmful: "Remove harmful effects (debuffs) from a target",
    all: "Remove all types of effects from a target",
    // Physical specific
    bludgeoning: "Remove bludgeoning effects from a target",
    piercing: "Remove piercing effects from a target",
    slashing: "Remove slashing effects from a target",
    poison: "Remove poison effects from a target",
    disease: "Remove disease effects from a target",
    bleed: "Remove bleeding effects from a target",
    // Magical specific
    acid: "Remove acid effects from a target",
    cold: "Remove cold effects from a target",
    fire: "Remove fire effects from a target",
    force: "Remove force effects from a target",
    lightning: "Remove lightning effects from a target",
    necrotic: "Remove necrotic effects from a target",
    psychic: "Remove psychic effects from a target",
    radiant: "Remove radiant effects from a target",
    thunder: "Remove thunder effects from a target",
    void: "Remove silence effects from a target"
  },
  resurrection: "Bring dead targets back to life"
};

// Default purification configuration
const DEFAULT_PURIFICATION_CONFIG = {
  purificationType: 'dispel',
  duration: 'instant',
  durationUnit: 'instant',
  difficultyClass: 15,
  abilitySave: 'spi',
  difficulty: 'moderate',
  selectedEffects: [],
  resolution: 'DICE',
  resurrectionFormula: '2d8 + SPI'
};

const normalizePurificationConfig = (incoming) => {
  if (!incoming || typeof incoming !== 'object') {
    return { ...DEFAULT_PURIFICATION_CONFIG, selectedEffects: [] };
  }
  const selectedEffects = Array.isArray(incoming.selectedEffects)
    ? incoming.selectedEffects
    : (Array.isArray(incoming.effects) ? incoming.effects : []);
  return {
    ...DEFAULT_PURIFICATION_CONFIG,
    ...incoming,
    purificationType: incoming.purificationType || DEFAULT_PURIFICATION_CONFIG.purificationType,
    selectedEffects
  };
};

const PurificationEffects = ({ state, dispatch, actionCreators }) => {
  // Initialize with default purification type from state or 'dispel'
  const [selectedPurificationType, setSelectedPurificationType] = useState(
    () => state?.purificationConfig?.purificationType || 'dispel'
  );

  // Tooltip state
  const [tooltipContent, setTooltipContent] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [effectPreview, setEffectPreview] = useState(null);

  // Initialize purification configuration with defaults while preserving existing fields
  const [purificationConfig, setPurificationConfig] = useState(() =>
    normalizePurificationConfig(state?.purificationConfig)
  );

  const configRef = useRef(purificationConfig);
  const lastPropJsonRef = useRef(
    state?.purificationConfig ? JSON.stringify(state.purificationConfig) : null
  );
  const initializedRef = useRef(false);

  // Initialize wizard state once on mount only when purificationConfig is missing
  useEffect(() => {
    if (!initializedRef.current) {
      initializedRef.current = true;
      if (!state?.purificationConfig && dispatch && actionCreators?.updatePurificationConfig) {
        const initial = configRef.current;
        lastPropJsonRef.current = JSON.stringify(initial);
        dispatch(actionCreators.updatePurificationConfig(initial));
      }
    }
  }, [state?.purificationConfig, dispatch, actionCreators]);

  // Sync local state when external state.purificationConfig changes (e.g. reopening a saved spell)
  useEffect(() => {
    if (!state?.purificationConfig || typeof state.purificationConfig !== 'object') {
      if (lastPropJsonRef.current !== null) {
        lastPropJsonRef.current = null;
      }
      return;
    }

    const nextPropJson = JSON.stringify(state.purificationConfig);
    if (nextPropJson === lastPropJsonRef.current) {
      return;
    }

    lastPropJsonRef.current = nextPropJson;
    const normalized = normalizePurificationConfig(state.purificationConfig);
    if (JSON.stringify(normalized) !== JSON.stringify(configRef.current)) {
      configRef.current = normalized;
      setPurificationConfig(normalized);
    }
    setSelectedPurificationType(normalized.purificationType || 'dispel');
  }, [state?.purificationConfig]);

  // Commit user edits to both local state and wizard context without effect feedback loops
  const commitPurificationConfig = (updater) => {
    const prev = configRef.current;
    const next = typeof updater === 'function' ? updater(prev) : updater;
    configRef.current = next;
    setPurificationConfig(next);
    if (dispatch && actionCreators?.updatePurificationConfig) {
      dispatch(actionCreators.updatePurificationConfig(next));
    }
  };

  // Handle mouse events for tooltips
  const handleMouseEnter = (content, e) => {
    setTooltipContent(content);
    setShowTooltip(true);
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
    setTooltipContent(null);
  };

  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  // Handle purification type change
  const handlePurificationTypeChange = (type) => {
    const currentType = configRef.current.purificationType || selectedPurificationType;
    if (type === currentType) return;

    setSelectedPurificationType(type);

    // Clear selected effects when changing purification type since they're type-specific
    // Each purification type has its own set of available effects
    commitPurificationConfig(prev => ({
      ...prev,
      purificationType: type,
      selectedEffects: [] // Clear effects when switching types
    }));
  };

  // Get WoW-style icon URL
  const getIconUrl = (iconName) => {
    if (!iconName) return '';
    return getAbilityIconUrl(iconName);
  };

  // Get appropriate effects list for the selected purification type
  const getEffectsForType = (purificationType) => {
    switch (purificationType) {
      case 'dispel': return DISPEL_TYPES;
      case 'resurrection': return [RESURRECTION_CONFIG];
      default: return [];
    }
  };

  // Toggle an effect selection
  const toggleEffect = (effectId) => {
    const activeType = configRef.current.purificationType || selectedPurificationType;
    const effectType = getEffectsForType(activeType).find(e => e.id === effectId);

    if (!effectType) return;

    commitPurificationConfig(prev => {
      const effects = prev.selectedEffects || [];

      // Check if this effect is already selected
      const existingIndex = effects.findIndex(e => e.id === effectId);

      if (existingIndex >= 0) {
        // Remove the effect
        const newEffects = [...effects];
        newEffects.splice(existingIndex, 1);
        return {
          ...prev,
          selectedEffects: newEffects
        };
      }

      // Create base effect configuration
      const baseEffect = {
        id: effectId,
        name: effectType.name,
        icon: effectType.icon,
        description: effectType.description,
        customDuration: 60, // Default duration in seconds
        customEffects: 1, // Default number of effects to remove
        purificationType: activeType,
        specificEffectTypes: [] // For storing specific effect types (like bleed, poison, etc.)
      };

      // Add resurrection-specific properties if needed
      if (activeType === 'resurrection') {
        baseEffect.resolution = prev.resolution || 'DICE';
        baseEffect.resurrectionFormula = getDefaultResurrectionFormula(baseEffect.resolution);
      }

      // Add the effect with custom configuration
      return {
        ...prev,
        selectedEffects: [
          ...effects,
          baseEffect
        ]
      };
    });
  };

  // Toggle a specific effect type for dispel
  const toggleSpecificEffectType = (effectId, specificType) => {
    commitPurificationConfig(prev => {
      const effects = prev.selectedEffects || [];
      const newEffects = effects.map(effect => {
        if (effect.id === effectId) {
          const currentSpecificTypes = effect.specificEffectTypes || [];
          let newSpecificTypes;

          if (currentSpecificTypes.includes(specificType)) {
            // Remove the type if it's already selected
            newSpecificTypes = currentSpecificTypes.filter(type => type !== specificType);
          } else {
            // Add the type if it's not already selected
            newSpecificTypes = [...currentSpecificTypes, specificType];
          }

          return { ...effect, specificEffectTypes: newSpecificTypes };
        }
        return effect;
      });

      return {
        ...prev,
        selectedEffects: newEffects
      };
    });
  };

  // Update effect custom range
  const updateEffectRange = (effectId, value) => {
    commitPurificationConfig(prev => {
      const effects = prev.selectedEffects || [];
      const newEffects = effects.map(effect => {
        if (effect.id === effectId) {
          return { ...effect, customRange: Math.max(5, Math.min(100, value)) };
        }
        return effect;
      });

      return {
        ...prev,
        selectedEffects: newEffects
      };
    });
  };

  // Update effect custom duration
  const updateEffectDuration = (effectId, value) => {
    commitPurificationConfig(prev => {
      const effects = prev.selectedEffects || [];
      const newEffects = effects.map(effect => {
        if (effect.id === effectId) {
          return { ...effect, customDuration: Math.max(0, value) };
        }
        return effect;
      });

      return {
        ...prev,
        selectedEffects: newEffects
      };
    });
  };

  // Update effect custom effects count
  const updateEffectCount = (effectId, value) => {
    if (Number.isNaN(value)) return;
    commitPurificationConfig(prev => {
      const effects = prev.selectedEffects || [];
      const newEffects = effects.map(effect => {
        if (effect.id === effectId) {
          return { ...effect, customEffects: Math.max(1, value) };
        }
        return effect;
      });

      return {
        ...prev,
        selectedEffects: newEffects
      };
    });
  };

  // Update effect resolution method
  const updateEffectResolution = (effectId, resolution) => {
    const nextFormula = getDefaultResurrectionFormula(resolution);
    commitPurificationConfig(prev => {
      const effects = prev.selectedEffects || [];
      const newEffects = effects.map(effect => {
        if (effect.id === effectId) {
          return {
            ...effect,
            resolution,
            resurrectionFormula: nextFormula
          };
        }
        return effect;
      });

      return {
        ...prev,
        resolution,
        resurrectionFormula: nextFormula,
        selectedEffects: newEffects
      };
    });
  };

  // Update effect resurrection formula
  const updateEffectResurrectionFormula = (effectId, formula) => {
    commitPurificationConfig(prev => {
      const effects = prev.selectedEffects || [];
      const newEffects = effects.map(effect => {
        if (effect.id === effectId) {
          return { ...effect, resurrectionFormula: formula };
        }
        return effect;
      });

      return {
        ...prev,
        resurrectionFormula: formula,
        selectedEffects: newEffects
      };
    });
  };

  // Get default resurrection formula based on resolution type
  const getDefaultResurrectionFormula = (resolutionType) => {
    switch (resolutionType) {
      case 'DICE':
        return '2d8 + SPI';
      case 'CARDS':
        return 'CARD_VALUE + SPI';
      case 'COINS':
        return 'HEADS_COUNT * 10 + SPI';
      default:
        return '2d8 + SPI';
    }
  };

  // Get resurrection formula examples based on resolution type
  const getResurrectionFormulaExamples = (resolutionType) => {
    switch (resolutionType) {
      case 'DICE':
        return [
          {
            name: 'Basic Revival',
            formula: '2d8 + SPI',
            description: 'Standard resurrection with moderate health recovery'
          },
          {
            name: 'Full Restoration',
            formula: '4d8 + SPI * 2',
            description: 'Powerful resurrection with significant health recovery'
          },
          {
            name: 'Combat Revival',
            formula: '1d8 + SPI',
            description: 'Quick combat resurrection with minimal health'
          },
          {
            name: 'Warden\'s Intervention',
            formula: '8d8 + SPI * 3',
            description: 'Miraculous resurrection with maximum health recovery'
          }
        ];
      case 'CARDS':
        return [
          {
            name: 'Fate\'s Hand',
            formula: 'CARD_VALUE + SPI',
            description: 'Health based on card value'
          },
          {
            name: 'Royal Revival',
            formula: 'CARD_VALUE + (FACE_CARD ? SPI * 3 : SPI)',
            description: 'Triple spirit bonus on face cards'
          },
          {
            name: 'Suit Synergy',
            formula: 'CARD_VALUE * (SAME_SUIT ? 2 : 1) + SPI',
            description: 'Double health if all cards are the same suit'
          },
          {
            name: 'Second Chance',
            formula: 'CARD_VALUE + FACE_CARD_COUNT * 10 + SPI',
            description: 'Bonus health for each face card drawn'
          }
        ];
      case 'COINS':
        return [
          {
            name: 'Fortune\'s Favor',
            formula: 'HEADS_COUNT * 10 + SPI',
            description: 'Health based on successful coin flips'
          },
          {
            name: 'Balanced Revival',
            formula: '(HEADS_COUNT == TAILS_COUNT ? 50 : HEADS_COUNT * 10) + SPI',
            description: 'Major health boost when heads and tails are balanced'
          },
          {
            name: 'Sacred Blessing',
            formula: 'HEADS_COUNT * 15 * (ALL_HEADS ? 2 : 1) + SPI',
            description: 'Double health when all coins show heads'
          },
          {
            name: 'Life\'s Gamble',
            formula: 'ALL_HEADS ? 100 + SPI * 2 : HEADS_COUNT * 10 + SPI',
            description: 'Full health on all heads, otherwise partial'
          }
        ];
      default:
        return [];
    }
  };

  // Remove an effect
  const removeEffect = (effectId) => {
    commitPurificationConfig(prev => {
      const effects = prev.selectedEffects || [];
      const newEffects = effects.filter(effect => effect.id !== effectId);
      return {
        ...prev,
        selectedEffects: newEffects
      };
    });
  };

  // Get description for an effect
  const getEffectDescription = (effect) => {
    const effectPurificationType = effect?.purificationType || purificationConfig.purificationType;
    if (!effect || !effectPurificationType) {
      return 'No description available';
    }

    // For resurrection effects
    if (effectPurificationType === 'resurrection') {
      const formula = effect.resurrectionFormula || purificationConfig.resurrectionFormula || '2d8 + SPI';
      return `${PURIFICATION_EFFECT_DESCRIPTIONS.resurrection} (${formula})`;
    }

    // For dispel effects
    if (effectPurificationType === 'dispel' && effect.id) {
      let baseDescription = PURIFICATION_EFFECT_DESCRIPTIONS.dispel[effect.id] || 'Remove effects from a target';

      // Add specific effect types if any are selected
      if (effect.specificEffectTypes && effect.specificEffectTypes.length > 0) {
        // Get descriptions for specific types
        const specificDescriptions = effect.specificEffectTypes.map(typeId => {
          const typeName = PHYSICAL_EFFECT_TYPES.find(t => t.id === typeId)?.name ||
                          MAGICAL_EFFECT_TYPES.find(t => t.id === typeId)?.name ||
                          typeId;
          return typeName.toLowerCase();
        });

        // Format the description
        if (specificDescriptions.length === 1) {
          baseDescription = `Remove ${specificDescriptions[0]} effects from a target`;
        } else {
          const lastType = specificDescriptions.pop();
          baseDescription = `Remove ${specificDescriptions.join(', ')} and ${lastType} effects from a target`;
        }
      }

      const numEffects = effect.customEffects || 1;
      const effectText = numEffects === 0 ? 'all' : numEffects;
      return `${baseDescription} (${effectText} ${numEffects === 1 ? 'effect' : 'effects'})`;
    }

    return 'No description available';
  };

  // Render the purification type selection
  const renderPurificationTypeSelection = () => {
    return (
      <div className="purification-type-selection section">
        <h3>Purification Type</h3>
        <div className="card-selection-grid">
          {Object.values(PURIFICATION_TYPES).map(type => (
            <IconSelectionCard
              key={type.id}
              icon={<img src={getIconUrl(type.icon)} alt={type.name} className="icon" />}
              title={type.name}
              description={type.description}
              onClick={() => handlePurificationTypeChange(type.id)}
              selected={selectedPurificationType === type.id}
              onMouseEnter={(e) => handleMouseEnter({name: type.name, description: type.description, icon: type.icon}, e)}
              onMouseLeave={handleMouseLeave}
              onMouseMove={handleMouseMove}
            />
          ))}
        </div>
      </div>
    );
  };

  // Render the effect selection for the current purification type
  const renderEffectSelection = () => {
    const effects = getEffectsForType(selectedPurificationType);

    return (
      <div className="effect-selection section">
        <h3>Effect Selection</h3>
        <div className="stat-cards-grid">
          {effects.map(effect => {
            const isSelected = purificationConfig.selectedEffects?.some(e => e.id === effect.id);

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
                    ✓
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render the selected effects configuration
  const renderSelectedEffects = () => {
    if (!purificationConfig.selectedEffects || purificationConfig.selectedEffects.length === 0) {
      return null;
    }

    return (
      <div className="selected-effects section">
        <h3>Selected Effects</h3>
        <div className="selected-effects-list">
          {purificationConfig.selectedEffects.map((effect, effectIndex) => {
            const effectPurificationType = effect.purificationType || purificationConfig.purificationType;
            const activeResolution = effect.resolution || purificationConfig.resolution || 'DICE';
            const formulaValue = effect.resurrectionFormula !== undefined
              ? effect.resurrectionFormula
              : (purificationConfig.resurrectionFormula ?? '');

            return (
              <div className="selected-effect" key={effect.id || `selected-effect-${effectIndex}`}>
                <div className="effect-header">
                  <div className="effect-icon">
                    <img src={getIconUrl(effect.icon)} alt={effect.name} />
                  </div>
                  <div className="effect-info">
                    <div className="effect-name">{effect.name}</div>
                    <div className="effect-description">{getEffectDescription(effect)}</div>
                  </div>
                  <div className="effect-actions">
                    <button
                      type="button"
                      className="remove-effect"
                      aria-label={`Remove ${effect.name}`}
                      title={`Remove ${effect.name}`}
                      onClick={() => removeEffect(effect.id)}
                      onMouseEnter={(e) => handleMouseEnter({name: 'Remove Effect', description: 'Remove this effect from the spell'}, e)}
                      onMouseLeave={handleMouseLeave}
                      onMouseMove={handleMouseMove}
                    >
                      <FaCircleXmark />
                    </button>
                  </div>
                </div>

                <div className="effect-custom-config">
                  {/* No power slider needed for dispel or resurrection */}

                  {/* Specific effect types for dispel */}
                  {effectPurificationType === 'dispel' && (
                    <>
                      {/* Show physical effect types if physical is selected */}
                      {effect.id === 'physical' && (
                        <div className="specific-effect-types">
                          <div className="custom-config-label">Specific Physical Effects:</div>
                          <div className="specific-types-grid">
                            {PHYSICAL_EFFECT_TYPES.map((type, index) => (
                              <div
                                key={`${type.id}-${index}`}
                                className={`specific-type-option ${(effect.specificEffectTypes || []).includes(type.id) ? 'selected' : ''}`}
                                onClick={() => toggleSpecificEffectType(effect.id, type.id)}
                              >
                                <img src={getIconUrl(type.icon)} alt={type.name} className="specific-type-icon" />
                                <span className="specific-type-name">{type.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Show magical effect types if magic is selected */}
                      {effect.id === 'magic' && (
                        <div className="specific-effect-types">
                          <div className="custom-config-label">Specific Magical Effects:</div>
                          <div className="specific-types-grid">
                            {MAGICAL_EFFECT_TYPES.map((type, index) => (
                              <div
                                key={`${type.id}-${index}`}
                                className={`specific-type-option ${(effect.specificEffectTypes || []).includes(type.id) ? 'selected' : ''}`}
                                onClick={() => toggleSpecificEffectType(effect.id, type.id)}
                              >
                                <img src={getIconUrl(type.icon)} alt={type.name} className="specific-type-icon" />
                                <span className="specific-type-name">{type.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Number of effects to remove */}
                      <div className="custom-config-row">
                        <div className="custom-config-label">Effects to remove:</div>
                        <div className="custom-config-control">
                          <button
                            type="button"
                            className="custom-button"
                            onClick={() => updateEffectCount(effect.id, (effect.customEffects || 1) - 1)}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="0"
                            max="10"
                            value={effect.customEffects || 1}
                            onChange={(e) => {
                              const parsed = parseInt(e.target.value, 10);
                              if (!Number.isNaN(parsed)) {
                                updateEffectCount(effect.id, parsed);
                              }
                            }}
                            className="custom-number-input"
                          />
                          <button
                            type="button"
                            className="custom-button"
                            onClick={() => updateEffectCount(effect.id, (effect.customEffects || 1) + 1)}
                          >
                            +
                          </button>
                          <span className="custom-hint">(0 = all)</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* No longer needed - removing purifying field option */}


                  {/* Resolution method for resurrection effects */}
                  {effectPurificationType === 'resurrection' && (
                    <div className="resurrection-resolution">
                      <div className="custom-config-row">
                        <div className="custom-config-label">Resolution Method:</div>
                        <div className="resolution-options">
                          <button
                            type="button"
                            className={`resolution-option ${activeResolution === 'DICE' ? 'active' : ''}`}
                            onClick={() => updateEffectResolution(effect.id, 'DICE')}
                          >
                            <FaDiceD20 className="resolution-icon" />
                            <span>Dice</span>
                          </button>
                          <button
                            type="button"
                            className={`resolution-option ${activeResolution === 'CARDS' ? 'active' : ''}`}
                            onClick={() => updateEffectResolution(effect.id, 'CARDS')}
                          >
                            <FaClone className="resolution-icon" />
                            <span>Cards</span>
                          </button>
                          <button
                            type="button"
                            className={`resolution-option ${activeResolution === 'COINS' ? 'active' : ''}`}
                            onClick={() => updateEffectResolution(effect.id, 'COINS')}
                          >
                            <FaCoins className="resolution-icon" />
                            <span>Coins</span>
                          </button>
                        </div>
                      </div>

                      <div className="custom-config-row">
                        <div className="custom-config-label">Formula:</div>
                        <div className="custom-config-control formula-input-row">
                          <input
                            type="text"
                            className="formula-input"
                            value={formulaValue}
                            onChange={(e) => updateEffectResurrectionFormula(effect.id, e.target.value)}
                            placeholder={getDefaultResurrectionFormula(activeResolution)}
                          />
                        </div>
                      </div>

                      <div className="formula-examples">
                        <h4>Formula Examples:</h4>
                        <div className="formula-examples-grid">
                          {getResurrectionFormulaExamples(activeResolution).map((example, index) => (
                            <div
                              key={index}
                              className="formula-example"
                              onClick={() => updateEffectResurrectionFormula(effect.id, example.formula)}
                            >
                              <div className="formula-example-name">{example.name}</div>
                              <div className="formula-example-formula">{example.formula}</div>
                              <div className="formula-example-description">{example.description}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* No duration section needed */}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // Render the duration settings (only for certain purification types)
  const renderDurationSettings = () => {
    // Only show duration settings for mass purification with purifying field
    const showDuration = selectedPurificationType === 'mass_purification' &&
                         purificationConfig.selectedEffects?.some(e => e.id === 'purifying_field');

    if (!showDuration) {
      return null;
    }

    return (
      <div className="duration-settings section">
        <h3>Duration Settings</h3>
        <div className="duration-input">
          <label>Duration:</label>
          <input
            type="number"
            min="1"
            max="60"
            value={purificationConfig.duration || 1}
            onChange={(e) => {
              const parsed = parseInt(e.target.value, 10);
              if (!Number.isNaN(parsed)) {
                commitPurificationConfig(prev => ({
                  ...prev,
                  duration: parsed
                }));
              }
            }}
          />
          <select
            value={purificationConfig.durationUnit || 'rounds'}
            onChange={(e) => commitPurificationConfig(prev => ({
              ...prev,
              durationUnit: e.target.value
            }))}
          >
            {DURATION_TYPES.filter(d => d.id !== 'instant').map(durationType => (
              <option key={durationType.id} value={durationType.id}>
                {durationType.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    );
  };

  // Main render function
  return (
    <div className="purification-effects-container">
      {/* Purification Type Selection */}
      {renderPurificationTypeSelection()}

      {/* Effect Selection */}
      {renderEffectSelection()}

      {/* Selected Effects Configuration */}
      {renderSelectedEffects()}

      {/* Duration Settings (conditional) */}
      {renderDurationSettings()}

      {/* Tooltip */}
    </div>
  );
};

export default PurificationEffects;
