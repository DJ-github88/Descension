import React, { useState, useEffect } from 'react';

import './purification-effects.css';
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
    icon: 'spell_holy_dispelmagic',
    description: 'Remove magical or physical effects from targets',
    color: '#9966ff'
  },
  RESURRECTION: {
    id: 'resurrection',
    name: 'Resurrection',
    icon: 'spell_holy_resurrection',
    description: 'Bring dead targets back to life',
    color: '#ffcc66'
  }
};

// Duration types
const DURATION_TYPES = [
  { id: 'instant', name: 'Instantaneous', description: 'Effect happens immediately with no duration', icon: 'inv_misc_pocketwatch_01' },
  { id: 'rounds', name: 'Rounds', description: 'Combat rounds (approx. 6 seconds each)', icon: 'inv_misc_pocketwatch_01' },
  { id: 'minutes', name: 'Minutes', description: 'Real-time minutes', icon: 'inv_misc_pocketwatch_02' },
  { id: 'hours', name: 'Hours', description: 'Real-time hours', icon: 'inv_misc_pocketwatch_03' }
];

// Dispel effect types
const DISPEL_TYPES = [
  { id: 'magic', name: 'Magic', icon: 'spell_arcane_arcane01', description: 'Dispel magical buffs and debuffs' },
  { id: 'physical', name: 'Physical', icon: 'ability_warrior_bloodfrenzy', description: 'Remove physical effects like poison, disease, or bleeds' },
  { id: 'curse', name: 'Curse', icon: 'spell_nature_removecurse', description: 'Remove curses and hexes' },
  { id: 'beneficial', name: 'Beneficial', icon: 'spell_holy_powerwordshield', description: 'Remove only beneficial effects (buffs)' },
  { id: 'harmful', name: 'Harmful', icon: 'spell_shadow_shadowwordpain', description: 'Remove only harmful effects (debuffs)' },
  { id: 'all', name: 'All Effects', icon: 'spell_holy_dispelmagic', description: 'Remove all types of effects' }
];

// Specific physical effect types
const PHYSICAL_EFFECT_TYPES = [
  { id: 'bludgeoning', name: 'Bludgeoning', icon: 'inv_mace_2h_pvp410_c_01', description: 'Remove bludgeoning effects' },
  { id: 'piercing', name: 'Piercing', icon: 'inv_sword_31', description: 'Remove piercing effects' },
  { id: 'slashing', name: 'Slashing', icon: 'ability_warrior_cleave', description: 'Remove slashing effects' },
  { id: 'poison', name: 'Poison', icon: 'spell_nature_nullifypoison', description: 'Remove poison effects' },
  { id: 'disease', name: 'Disease', icon: 'spell_holy_nullifydisease', description: 'Remove disease effects' },
  { id: 'bleed', name: 'Bleed', icon: 'ability_warrior_bloodfrenzy', description: 'Remove bleeding effects' }
];

// Specific magical effect types
const MAGICAL_EFFECT_TYPES = [
  { id: 'acid', name: 'Acid', icon: 'spell_nature_acid_01', description: 'Remove acid effects' },
  { id: 'cold', name: 'Cold', icon: 'spell_frost_frostbolt02', description: 'Remove cold effects' },
  { id: 'fire', name: 'Fire', icon: 'spell_fire_flamebolt', description: 'Remove fire effects' },
  { id: 'force', name: 'Force', icon: 'spell_arcane_blast', description: 'Remove force effects' },
  { id: 'lightning', name: 'Lightning', icon: 'spell_nature_lightning', description: 'Remove lightning effects' },
  { id: 'necrotic', name: 'Necrotic', icon: 'spell_shadow_shadowbolt', description: 'Remove necrotic effects' },
  { id: 'psychic', name: 'Psychic', icon: 'spell_shadow_mindtwisting', description: 'Remove psychic effects' },
  { id: 'radiant', name: 'Radiant', icon: 'spell_holy_holybolt', description: 'Remove radiant effects' },
  { id: 'thunder', name: 'Thunder', icon: 'spell_nature_thunderclap', description: 'Remove thunder effects' },
  { id: 'void', name: 'Void', icon: 'spell_shadow_shadowfury', description: 'Remove void effects' }
];

// Resurrection configuration
const RESURRECTION_CONFIG = {
  id: 'resurrection',
  name: 'Resurrection',
  icon: 'spell_holy_resurrection',
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
    void: "Remove void effects from a target"
  },
  resurrection: "Bring dead targets back to life"
};

const PurificationEffects = ({ state, dispatch, actionCreators }) => {
  // Initialize with default purification type from state or 'dispel'
  const [selectedPurificationType, setSelectedPurificationType] = useState(
    state.purificationConfig?.purificationType || 'dispel'
  );

  // Tooltip state
  const [tooltipContent, setTooltipContent] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [effectPreview, setEffectPreview] = useState(null);

  // Define default configuration
  const defaultConfig = {
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

  // Initialize purification configuration with defaults
  const [purificationConfig, setPurificationConfig] = useState(state.purificationConfig || defaultConfig);

  // Effect to update state when purification type changes
  useEffect(() => {
    if (selectedPurificationType !== purificationConfig.purificationType) {
      const newConfig = {
        ...purificationConfig,
        purificationType: selectedPurificationType
      };
      setPurificationConfig(newConfig);
      dispatch(actionCreators.updatePurificationConfig(newConfig));
    }
  }, [selectedPurificationType, purificationConfig.purificationType, dispatch]);

  // Effect to sync state when configuration changes
  useEffect(() => {
    if (state.purificationConfig !== purificationConfig) {
      dispatch(actionCreators.updatePurificationConfig(purificationConfig));
    }
  }, [purificationConfig, state.purificationConfig, dispatch, actionCreators]);

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
    setSelectedPurificationType(type);

    // Clear selected effects when changing purification type since they're type-specific
    // Each purification type has its own set of available effects
    setPurificationConfig(prev => ({
      ...prev,
      purificationType: type,
      selectedEffects: [] // Clear effects when switching types
    }));
  };

  // Get WoW-style icon URL
  const getIconUrl = (iconName) => {
    if (!iconName) return '';
    return `https://wow.zamimg.com/images/wow/icons/large/${iconName}.jpg`;
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
    const effects = purificationConfig.selectedEffects || [];
    const effectType = getEffectsForType(selectedPurificationType).find(e => e.id === effectId);

    if (!effectType) return;

    // Check if this effect is already selected
    const existingIndex = effects.findIndex(e => e.id === effectId);

    if (existingIndex >= 0) {
      // Remove the effect
      const newEffects = [...effects];
      newEffects.splice(existingIndex, 1);
      setPurificationConfig(prev => ({
        ...prev,
        selectedEffects: newEffects
      }));
    } else {
      // Create base effect configuration
      const baseEffect = {
        id: effectId,
        name: effectType.name,
        icon: effectType.icon,
        description: effectType.description,
        customDuration: 60, // Default duration in seconds
        customEffects: 1, // Default number of effects to remove
        purificationType: selectedPurificationType,
        specificEffectTypes: [] // For storing specific effect types (like bleed, poison, etc.)
      };

      // Add resurrection-specific properties if needed
      if (selectedPurificationType === 'resurrection') {
        baseEffect.resolution = purificationConfig.resolution || 'DICE';
        baseEffect.resurrectionFormula = getDefaultResurrectionFormula(baseEffect.resolution);
      }

      // Add the effect with custom configuration
      setPurificationConfig(prev => ({
        ...prev,
        selectedEffects: [
          ...effects,
          baseEffect
        ]
      }));
    }
  };

  // Toggle a specific effect type for dispel
  const toggleSpecificEffectType = (effectId, specificType) => {
    const effects = purificationConfig.selectedEffects || [];
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

    setPurificationConfig(prev => ({
      ...prev,
      selectedEffects: newEffects
    }));
  };

  // Update effect custom range
  const updateEffectRange = (effectId, value) => {
    const effects = purificationConfig.selectedEffects || [];
    const newEffects = effects.map(effect => {
      if (effect.id === effectId) {
        return { ...effect, customRange: Math.max(5, Math.min(100, value)) };
      }
      return effect;
    });

    setPurificationConfig(prev => ({
      ...prev,
      selectedEffects: newEffects
    }));
  };

  // Update effect custom duration
  const updateEffectDuration = (effectId, value) => {
    const effects = purificationConfig.selectedEffects || [];
    const newEffects = effects.map(effect => {
      if (effect.id === effectId) {
        return { ...effect, customDuration: Math.max(0, value) };
      }
      return effect;
    });

    setPurificationConfig(prev => ({
      ...prev,
      selectedEffects: newEffects
    }));
  };

  // Update effect custom effects count
  const updateEffectCount = (effectId, value) => {
    const effects = purificationConfig.selectedEffects || [];
    const newEffects = effects.map(effect => {
      if (effect.id === effectId) {
        return { ...effect, customEffects: Math.max(1, value) };
      }
      return effect;
    });

    setPurificationConfig(prev => ({
      ...prev,
      selectedEffects: newEffects
    }));
  };

  // Update effect resolution method
  const updateEffectResolution = (effectId, resolution) => {
    const effects = purificationConfig.selectedEffects || [];
    const newEffects = effects.map(effect => {
      if (effect.id === effectId) {
        return {
          ...effect,
          resolution,
          resurrectionFormula: getDefaultResurrectionFormula(resolution)
        };
      }
      return effect;
    });

    setPurificationConfig(prev => ({
      ...prev,
      resolution,
      selectedEffects: newEffects
    }));
  };

  // Update effect resurrection formula
  const updateEffectResurrectionFormula = (effectId, formula) => {
    const effects = purificationConfig.selectedEffects || [];
    const newEffects = effects.map(effect => {
      if (effect.id === effectId) {
        return { ...effect, resurrectionFormula: formula };
      }
      return effect;
    });

    setPurificationConfig(prev => ({
      ...prev,
      resurrectionFormula: formula,
      selectedEffects: newEffects
    }));
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
            name: 'Divine Intervention',
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
            name: 'Divine Blessing',
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
    const effects = purificationConfig.selectedEffects || [];
    const newEffects = effects.filter(effect => effect.id !== effectId);

    setPurificationConfig(prev => ({
      ...prev,
      selectedEffects: newEffects
    }));
  };

  // Get description for an effect
  const getEffectDescription = (effect) => {
    if (!effect || !effect.purificationType) {
      return 'No description available';
    }

    // For resurrection effects
    if (effect.purificationType === 'resurrection') {
      const formula = effect.resurrectionFormula || purificationConfig.resurrectionFormula || '2d8 + SPI';
      return `${PURIFICATION_EFFECT_DESCRIPTIONS.resurrection} (${formula})`;
    }

    // For dispel effects
    if (effect.purificationType === 'dispel' && effect.id) {
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
          {purificationConfig.selectedEffects.map(effect => (
            <div className="selected-effect" key={effect.id}>
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
                    className="remove-effect"
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
                {effect.purificationType === 'dispel' && (
                  <>
                    {/* Show physical effect types if physical is selected */}
                    {effect.id === 'physical' && (
                      <div className="specific-effect-types">
                        <div className="custom-config-label">Specific Physical Effects:</div>
                        <div className="specific-types-grid">
                          {PHYSICAL_EFFECT_TYPES.map(type => (
                            <div
                              key={type.id}
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
                          {MAGICAL_EFFECT_TYPES.map(type => (
                            <div
                              key={type.id}
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
                          onChange={(e) => updateEffectCount(effect.id, parseInt(e.target.value))}
                          className="custom-number-input"
                        />
                        <button
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
                {effect.purificationType === 'resurrection' && (
                  <div className="resurrection-resolution">
                    <div className="custom-config-row">
                      <div className="custom-config-label">Resolution Method:</div>
                      <div className="resolution-options">
                        <button
                          className={`resolution-option ${(effect.resolution || purificationConfig.resolution) === 'DICE' ? 'active' : ''}`}
                          onClick={() => updateEffectResolution(effect.id, 'DICE')}
                        >
                          <FaDiceD20 className="resolution-icon" />
                          <span>Dice</span>
                        </button>
                        <button
                          className={`resolution-option ${(effect.resolution || purificationConfig.resolution) === 'CARDS' ? 'active' : ''}`}
                          onClick={() => updateEffectResolution(effect.id, 'CARDS')}
                        >
                          <FaClone className="resolution-icon" />
                          <span>Cards</span>
                        </button>
                        <button
                          className={`resolution-option ${(effect.resolution || purificationConfig.resolution) === 'COINS' ? 'active' : ''}`}
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
                          value={effect.resurrectionFormula || purificationConfig.resurrectionFormula || ''}
                          onChange={(e) => updateEffectResurrectionFormula(effect.id, e.target.value)}
                          placeholder={getDefaultResurrectionFormula((effect.resolution || purificationConfig.resolution))}
                        />
                      </div>
                    </div>

                    <div className="formula-examples">
                      <h4>Formula Examples:</h4>
                      <div className="formula-examples-grid">
                        {getResurrectionFormulaExamples((effect.resolution || purificationConfig.resolution)).map((example, index) => (
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
          ))}
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
            onChange={(e) => setPurificationConfig(prev => ({
              ...prev,
              duration: parseInt(e.target.value)
            }))}
          />
          <select
            value={purificationConfig.durationUnit || 'rounds'}
            onChange={(e) => setPurificationConfig(prev => ({
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

      {/* Selected Effects */}
      {renderSelectedEffects()}

      {/* Duration Settings (conditional) */}
      {renderDurationSettings()}

      {/* Tooltip */}
    </div>
  );
};

export default PurificationEffects;
