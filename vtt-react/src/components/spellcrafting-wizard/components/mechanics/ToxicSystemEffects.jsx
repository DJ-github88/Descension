import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faTrash, faInfoCircle, faFire, faHeart, faWandMagic, faSkull, faHandSparkles, faDragon } from '@fortawesome/free-solid-svg-icons';
import { useSpellWizardState } from '../../context/spellWizardContext';
// Pathfinder styles imported via main.css


/**
 * Component for configuring toxic consumption effects
 * Allows setting different formulas for different toxic types and stack counts
 */
const ToxicSystemEffects = ({
  toxicTypes,
  toxicEffects,
  onToxicEffectsChange,
  effectType = 'damage' // 'damage', 'healing', 'buff', etc.
}) => {
  // Access the spell wizard state to get all configured effects
  const spellWizardState = useSpellWizardState();

  // Tooltip state
  const [tooltipContent, setTooltipContent] = useState(null);
  const [showTooltip, setShowTooltip] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  // Get default formula based on effect type
  const getDefaultFormula = (type) => {
    switch(type) {
      case 'damage':
        return spellWizardState.damageConfig?.formula || '2d6 + INT';
      case 'healing':
        return spellWizardState.healingConfig?.formula || '2d8 + HEA';
      case 'buff':
        // For buffs, we don't have a single formula, but we can return a placeholder
        return '1d6';
      case 'debuff':
        // For debuffs, we don't have a single formula, but we can return a placeholder
        return '1d6';
      default:
        return '1d6';
    }
  };

  // Get default effect configuration based on effect type
  const getDefaultEffectConfig = (type) => {
    switch(type) {
      case 'damage':
        return spellWizardState.damageConfig ? { ...spellWizardState.damageConfig } : null;
      case 'healing':
        return spellWizardState.healingConfig ? { ...spellWizardState.healingConfig } : null;
      case 'buff':
        return spellWizardState.buffConfig ? { ...spellWizardState.buffConfig } : null;
      case 'debuff':
        return spellWizardState.debuffConfig ? { ...spellWizardState.debuffConfig } : null;
      default:
        return null;
    }
  };

  // Initialize with default toxic effects if none provided
  const [effects, setEffects] = useState(() => {
    // Create default effect references
    const defaultEffectReferences = {
      damage: spellWizardState?.damageConfig ? true : false,
      healing: spellWizardState?.healingConfig ? true : false,
      buff: spellWizardState?.buffConfig ? true : false,
      debuff: spellWizardState?.debuffConfig ? true : false,
      control: spellWizardState?.controlConfig ? true : false,
      summoning: spellWizardState?.summonConfig ? true : false
    };

    // If we have existing effects, use them
    if (toxicEffects && Object.keys(toxicEffects).length > 0) {
      // Make sure the default entry exists and has effectReferences
      if (!toxicEffects['default']) {
        return {
          'default': {
            formula: getDefaultFormula(effectType),
            description: 'Toxic consumption effect',
            effectType: effectType,
            effectReferences: defaultEffectReferences
          }
        };
      }

      // Make sure effectReferences exists
      if (!toxicEffects['default'].effectReferences) {
        return {
          ...toxicEffects,
          'default': {
            ...toxicEffects['default'],
            effectReferences: defaultEffectReferences
          }
        };
      }

      return toxicEffects;
    }

    // Default to a single effect for all toxic types
    return {
      'default': {
        formula: getDefaultFormula(effectType),
        description: 'Toxic consumption effect',
        effectType: effectType,
        effectReferences: defaultEffectReferences
      }
    };
  });

  // Get all available effect types from the spell wizard state
  const getAvailableEffectTypes = () => {
    const availableEffects = [];

    // Always include the current effect type even if not configured
    const hasCurrentEffectType = [
      'damage', 'healing', 'buff', 'debuff', 'control', 'summoning'
    ].includes(effectType);

    if (spellWizardState.damageConfig) {
      availableEffects.push({
        id: 'damage',
        name: 'Damage',
        icon: faFire,
        formula: spellWizardState.damageConfig.formula
      });
    } else if (effectType === 'damage' && !hasCurrentEffectType) {
      availableEffects.push({
        id: 'damage',
        name: 'Damage',
        icon: faFire,
        formula: '2d6 + INT'
      });
    }

    if (spellWizardState.healingConfig) {
      availableEffects.push({
        id: 'healing',
        name: 'Healing',
        icon: faHeart,
        formula: spellWizardState.healingConfig.formula
      });
    } else if (effectType === 'healing' && !hasCurrentEffectType) {
      availableEffects.push({
        id: 'healing',
        name: 'Healing',
        icon: faHeart,
        formula: '2d8 + HEA'
      });
    }

    if (spellWizardState.buffConfig) {
      availableEffects.push({
        id: 'buff',
        name: 'Buff',
        icon: faWandMagic,
        formula: 'Buff Effects'
      });
    } else if (effectType === 'buff' && !hasCurrentEffectType) {
      availableEffects.push({
        id: 'buff',
        name: 'Buff',
        icon: faWandMagic,
        formula: 'Buff Effects'
      });
    }

    if (spellWizardState.debuffConfig) {
      availableEffects.push({
        id: 'debuff',
        name: 'Debuff',
        icon: faSkull,
        formula: 'Debuff Effects'
      });
    } else if (effectType === 'debuff' && !hasCurrentEffectType) {
      availableEffects.push({
        id: 'debuff',
        name: 'Debuff',
        icon: faSkull,
        formula: 'Debuff Effects'
      });
    }

    if (spellWizardState.controlConfig) {
      availableEffects.push({
        id: 'control',
        name: 'Control',
        icon: faHandSparkles,
        formula: 'Control Effects'
      });
    } else if (effectType === 'control' && !hasCurrentEffectType) {
      availableEffects.push({
        id: 'control',
        name: 'Control',
        icon: faHandSparkles,
        formula: 'Control Effects'
      });
    }

    if (spellWizardState.summonConfig) {
      availableEffects.push({
        id: 'summoning',
        name: 'Summoning',
        icon: faDragon,
        formula: 'Summoning Effects'
      });
    } else if (effectType === 'summoning' && !hasCurrentEffectType) {
      availableEffects.push({
        id: 'summoning',
        name: 'Summoning',
        icon: faDragon,
        formula: 'Summoning Effects'
      });
    }

    // If no effects are available, add a default one based on the current effect type
    if (availableEffects.length === 0) {
      availableEffects.push({
        id: 'damage',
        name: 'Damage',
        icon: faFire,
        formula: '2d6 + INT'
      });
    }

    return availableEffects;
  };

  // Update parent when effects change
  useEffect(() => {
    onToxicEffectsChange(effects);
  }, [effects, onToxicEffectsChange]);

  // Update the formula for a specific toxic type
  const updateFormula = (toxicId, newFormula) => {
    setEffects(prev => {
      // Create a default effect if it doesn't exist
      const currentEffect = prev[toxicId] || {
        formula: getDefaultFormula(effectType),
        description: 'Toxic consumption effect',
        effectType: effectType,
        effectReferences: {
          damage: spellWizardState?.damageConfig ? true : false,
          healing: spellWizardState?.healingConfig ? true : false,
          buff: spellWizardState?.buffConfig ? true : false,
          debuff: spellWizardState?.debuffConfig ? true : false,
          control: spellWizardState?.controlConfig ? true : false,
          summoning: spellWizardState?.summonConfig ? true : false
        }
      };

      return {
        ...prev,
        [toxicId]: {
          ...currentEffect,
          formula: newFormula
        }
      };
    });
  };

  // Update the description for a specific toxic type
  const updateDescription = (toxicId, newDescription) => {
    setEffects(prev => {
      // Create a default effect if it doesn't exist
      const currentEffect = prev[toxicId] || {
        formula: getDefaultFormula(effectType),
        description: 'Toxic consumption effect',
        effectType: effectType,
        effectReferences: {
          damage: spellWizardState?.damageConfig ? true : false,
          healing: spellWizardState?.healingConfig ? true : false,
          buff: spellWizardState?.buffConfig ? true : false,
          debuff: spellWizardState?.debuffConfig ? true : false,
          control: spellWizardState?.controlConfig ? true : false,
          summoning: spellWizardState?.summonConfig ? true : false
        }
      };

      return {
        ...prev,
        [toxicId]: {
          ...currentEffect,
          description: newDescription
        }
      };
    });
  };

  // Update the effect type for a specific toxic type
  const updateEffectType = (toxicId, newEffectType) => {
    setEffects(prev => {
      // Get the default formula for the new effect type
      const newFormula = getDefaultFormula(newEffectType);

      // Get the default effect configuration for the new effect type
      const defaultConfig = getDefaultEffectConfig(newEffectType);

      // Create default effect references
      const defaultEffectReferences = {
        damage: spellWizardState?.damageConfig ? true : false,
        healing: spellWizardState?.healingConfig ? true : false,
        buff: spellWizardState?.buffConfig ? true : false,
        debuff: spellWizardState?.debuffConfig ? true : false,
        control: spellWizardState?.controlConfig ? true : false,
        summoning: spellWizardState?.summonConfig ? true : false,
        [newEffectType]: true // Always include the new effect type
      };

      // Create a default effect if it doesn't exist
      const currentEffect = prev[toxicId] || {
        formula: getDefaultFormula(effectType),
        description: 'Toxic consumption effect',
        effectType: effectType,
        effectReferences: defaultEffectReferences
      };

      return {
        ...prev,
        [toxicId]: {
          ...currentEffect,
          formula: newFormula,
          effectType: newEffectType,
          // Update effect references
          effectReferences: {
            ...(currentEffect.effectReferences || defaultEffectReferences),
            [newEffectType]: true
          },
          // Include the full effect configuration
          effectConfig: defaultConfig,
          // For buff and debuff, include specific properties
          ...(newEffectType === 'buff' && spellWizardState?.buffConfig ? {
            statModifiers: [...(spellWizardState.buffConfig.statModifiers || [])],
            statusEffects: [...(spellWizardState.buffConfig.statusEffects || [])],
            duration: spellWizardState.buffConfig.duration,
            durationValue: spellWizardState.buffConfig.durationValue,
            durationType: spellWizardState.buffConfig.durationType,
            durationUnit: spellWizardState.buffConfig.durationUnit,
            stackingRule: spellWizardState.buffConfig.stackingRule,
            maxStacks: spellWizardState.buffConfig.maxStacks
          } : {}),
          ...(newEffectType === 'debuff' && spellWizardState?.debuffConfig ? {
            statPenalties: [...(spellWizardState.debuffConfig.statPenalties || [])],
            statusEffects: [...(spellWizardState.debuffConfig.statusEffects || [])],
            duration: spellWizardState.debuffConfig.duration,
            durationValue: spellWizardState.debuffConfig.durationValue,
            durationType: spellWizardState.debuffConfig.durationType,
            durationUnit: spellWizardState.debuffConfig.durationUnit,
            stackingRule: spellWizardState.debuffConfig.stackingRule,
            maxStacks: spellWizardState.debuffConfig.maxStacks
          } : {}),
          // For damage and healing, include critical hit and chance-on-hit configurations
          ...(newEffectType === 'damage' && spellWizardState?.damageConfig ? {
            criticalConfig: spellWizardState.damageConfig.criticalConfig,
            chanceOnHitConfig: spellWizardState.damageConfig.chanceOnHitConfig
          } : {}),
          ...(newEffectType === 'healing' && spellWizardState?.healingConfig ? {
            // Basic healing properties
            healingType: spellWizardState.healingConfig.healingType || 'direct',
            formula: spellWizardState.healingConfig.formula,
            resolution: spellWizardState.healingConfig.resolution,
            criticalConfig: spellWizardState.healingConfig.criticalConfig,
            chanceOnHitConfig: spellWizardState.healingConfig.chanceOnHitConfig,

            // HoT properties
            ...(spellWizardState.healingConfig.hasHotEffect || spellWizardState.healingConfig.healingType === 'hot' ? {
              hasHotEffect: true,
              hotFormula: spellWizardState.healingConfig.hotFormula,
              hotDuration: spellWizardState.healingConfig.hotDuration,
              hotTickType: spellWizardState.healingConfig.hotTickType,
              hotApplication: spellWizardState.healingConfig.hotApplication,
              hotScalingType: spellWizardState.healingConfig.hotScalingType,
              hotTriggerType: spellWizardState.healingConfig.hotTriggerType
            } : {}),

            // Shield properties
            ...(spellWizardState.healingConfig.hasShieldEffect || spellWizardState.healingConfig.healingType === 'shield' ? {
              hasShieldEffect: true,
              shieldFormula: spellWizardState.healingConfig.shieldFormula,
              shieldDuration: spellWizardState.healingConfig.shieldDuration,
              shieldDamageTypes: spellWizardState.healingConfig.shieldDamageTypes,
              shieldOverflow: spellWizardState.healingConfig.shieldOverflow,
              shieldBreakBehavior: spellWizardState.healingConfig.shieldBreakBehavior
            } : {})
          } : {})
        }
      };
    });
  };

  // Toggle an effect reference
  const toggleEffectReference = (toxicId, effectTypeId) => {
    setEffects(prev => {
      // Create a default effect references object if it doesn't exist
      const currentEffectReferences = prev[toxicId]?.effectReferences || {
        damage: false,
        healing: false,
        buff: false,
        debuff: false,
        control: false,
        summoning: false,
        [effectTypeId]: false // Default to false for the current effect type
      };

      return {
        ...prev,
        [toxicId]: {
          ...prev[toxicId],
          // Make sure we have a default formula and description
          formula: prev[toxicId]?.formula || getDefaultFormula(effectTypeId),
          description: prev[toxicId]?.description || 'Toxic consumption effect',
          effectType: prev[toxicId]?.effectType || effectTypeId,
          effectReferences: {
            ...currentEffectReferences,
            [effectTypeId]: !currentEffectReferences[effectTypeId]
          }
        }
      };
    });
  };

  // Tooltip handlers for toxic types
  const handleToxicTooltipEnter = (toxicType, e) => {
    // Create WoW Classic style tooltip content
    const tooltipContent = (
      <div>
        <div className="tooltip-stat-line">
          {toxicType.description}
        </div>
        <div className="tooltip-effect">
          <span className="tooltip-gold">Type:</span> {toxicType.name}
        </div>
        <div className="tooltip-flavor">
          {toxicType.id === 'disease' && "\"A biological affliction that weakens its victims from within.\""}
          {toxicType.id === 'poison' && "\"A toxic substance that causes damage over time.\""}
          {toxicType.id === 'curse' && "\"A magical affliction that brings misfortune and suffering.\""}
          {toxicType.id === 'venom' && "\"A potent toxin delivered directly into the bloodstream.\""}
          {toxicType.id === 'blight' && "\"A corrupting influence that spreads to nearby targets.\""}
          {toxicType.id === 'plague' && "\"A highly contagious disease that affects multiple targets.\""}
          {toxicType.id === 'necrotic' && "\"A rotting affliction that prevents healing and recovery.\""}
          {toxicType.id === 'toxic' && "\"A caustic substance that burns and corrodes its victims.\""}
          {toxicType.id === 'corruption' && "\"Dark energy that corrupts from within, causing gradual decay.\""}
          {toxicType.id === 'contagion' && "\"A rapidly spreading infection that jumps between targets.\""}
          {toxicType.id === 'decay' && "\"A gradual deterioration that breaks down physical form over time.\""}
          {toxicType.id === 'pestilence' && "\"A devastating disease that affects multiple bodily systems at once.\""}
          {toxicType.id === 'toxin' && "\"A concentrated poison that causes immediate and severe effects.\""}
          {toxicType.id === 'miasma' && "\"Noxious vapors that cause illness and disorientation.\""}
          {toxicType.id === 'rot' && "\"Accelerated decomposition that breaks down living tissue.\""}
          {toxicType.id === 'infection' && "\"Invasive pathogens that multiply rapidly within the host.\""}
          {toxicType.id === 'vile' && "\"A repulsive substance that causes nausea and weakness.\""}
          {toxicType.id === 'putrid' && "\"A foul-smelling decay that weakens resolve and constitution.\""}
        </div>
      </div>
    );

    // Store the tooltip data including title and icon
    setTooltipContent({
      content: tooltipContent,
      title: toxicType.name,
      icon: toxicType.wowIcon ? `https://wow.zamimg.com/images/wow/icons/large/${toxicType.wowIcon}.jpg` : null
    });
    setShowTooltip(true);
    // Update position using client coordinates for fixed positioning
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  const handleToxicTooltipLeave = () => {
    setShowTooltip(false);
  };

  const handleToxicTooltipMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
  };

  // Get available effect types
  const availableEffectTypes = getAvailableEffectTypes();

  return (
    <div className="toxic-effects-container">
      <div className="toxic-effects-header">
        <h4>Toxic Consumption Effects</h4>
        <div className="toxic-effects-description">
          <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
          <span>Configure different effects based on which toxic types are consumed.</span>
        </div>
      </div>

      <div className="toxic-effects-list">
        <div className="toxic-effect-item">
          <div className="toxic-effect-header">
            <h5>Formula Update</h5>
            <p className="toxic-effect-description">
              When toxic effects are consumed, the spell's formula will be updated based on the configuration below.
            </p>
          </div>

          <div className="toxic-effect-inputs">
            {/* Effect Type Selection */}
            <div className="toxic-effect-type">
              <label>Effect Type:</label>
              <div className="effect-type-selector">
                {availableEffectTypes.map(effect => (
                  <button
                    key={effect.id}
                    className={`effect-type-button ${(effects['default']?.effectType || effectType) === effect.id ? 'active' : ''}`}
                    onClick={() => updateEffectType('default', effect.id)}
                    title={effect.name}
                  >
                    <FontAwesomeIcon icon={effect.icon} />
                    <span>{effect.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Formula Input - For damage and healing */}
            {((effects['default']?.effectType || effectType) === 'damage' || (effects['default']?.effectType || effectType) === 'healing') && (
              <div className="toxic-effect-formula">
                <label>Updated Formula:</label>
                <input
                  type="text"
                  value={effects['default']?.formula || getDefaultFormula(effects['default']?.effectType || effectType)}
                  onChange={(e) => updateFormula('default', e.target.value)}
                  placeholder="Enter formula (e.g., 2d6 + INT + [toxic_count] * 2)"
                />
                <div className="formula-help">
                  <span>Base formula: {getDefaultFormula(effects['default']?.effectType || effectType)}</span>
                </div>
              </div>
            )}

            {/* Buff Effect Configuration */}
            {(effects['default']?.effectType || effectType) === 'buff' && (
              <div className="toxic-effect-buff">
                <label>Buff Effect Enhancement:</label>
                <div className="toxic-effect-options">
                  <div className="toxic-effect-option">
                    <label>Duration Bonus:</label>
                    <input
                      type="text"
                      value={effects['default']?.durationBonus || '[toxic_count] rounds'}
                      onChange={(e) => {
                        setEffects(prev => ({
                          ...prev,
                          'default': {
                            ...prev['default'],
                            durationBonus: e.target.value
                          }
                        }));
                      }}
                      placeholder="Enter duration bonus (e.g., [toxic_count] rounds)"
                    />
                  </div>
                  <div className="toxic-effect-option">
                    <label>Stat Modifier Bonus:</label>
                    <input
                      type="text"
                      value={effects['default']?.statModifierBonus || '+[toxic_count] to all stats'}
                      onChange={(e) => {
                        setEffects(prev => ({
                          ...prev,
                          'default': {
                            ...prev['default'],
                            statModifierBonus: e.target.value
                          }
                        }));
                      }}
                      placeholder="Enter stat modifier bonus"
                    />
                  </div>
                </div>

              </div>
            )}

            {/* Debuff Effect Configuration */}
            {(effects['default']?.effectType || effectType) === 'debuff' && (
              <div className="toxic-effect-debuff">
                <label>Debuff Effect Enhancement:</label>
                <div className="toxic-effect-options">
                  <div className="toxic-effect-option">
                    <label>Duration Bonus:</label>
                    <input
                      type="text"
                      value={effects['default']?.durationBonus || '[toxic_count] rounds'}
                      onChange={(e) => {
                        setEffects(prev => ({
                          ...prev,
                          'default': {
                            ...prev['default'],
                            durationBonus: e.target.value
                          }
                        }));
                      }}
                      placeholder="Enter duration bonus (e.g., [toxic_count] rounds)"
                    />
                  </div>
                  <div className="toxic-effect-option">
                    <label>Stat Penalty Bonus:</label>
                    <input
                      type="text"
                      value={effects['default']?.statPenaltyBonus || '-[toxic_count] to all stats'}
                      onChange={(e) => {
                        setEffects(prev => ({
                          ...prev,
                          'default': {
                            ...prev['default'],
                            statPenaltyBonus: e.target.value
                          }
                        }));
                      }}
                      placeholder="Enter stat penalty bonus"
                    />
                  </div>
                </div>

              </div>
            )}

            {/* Control Effect Configuration */}
            {(effects['default']?.effectType || effectType) === 'control' && (
              <div className="toxic-effect-control">
                <label>Control Effect Enhancement:</label>
                <div className="toxic-effect-options">
                  <div className="toxic-effect-option">
                    <label>Duration Bonus:</label>
                    <input
                      type="text"
                      value={effects['default']?.durationBonus || '[toxic_count] rounds'}
                      onChange={(e) => {
                        setEffects(prev => ({
                          ...prev,
                          'default': {
                            ...prev['default'],
                            durationBonus: e.target.value
                          }
                        }));
                      }}
                      placeholder="Enter duration bonus (e.g., [toxic_count] rounds)"
                    />
                  </div>
                  <div className="toxic-effect-option">
                    <label>Save DC Bonus:</label>
                    <input
                      type="text"
                      value={effects['default']?.saveDCBonus || '+[toxic_count]'}
                      onChange={(e) => {
                        setEffects(prev => ({
                          ...prev,
                          'default': {
                            ...prev['default'],
                            saveDCBonus: e.target.value
                          }
                        }));
                      }}
                      placeholder="Enter save DC bonus"
                    />
                  </div>
                </div>

              </div>
            )}

            {/* Summoning Effect Configuration */}
            {(effects['default']?.effectType || effectType) === 'summoning' && (
              <div className="toxic-effect-summoning">
                <label>Summoning Effect Enhancement:</label>
                <div className="toxic-effect-options">
                  <div className="toxic-effect-option">
                    <label>Duration Bonus:</label>
                    <input
                      type="text"
                      value={effects['default']?.durationBonus || '[toxic_count] rounds'}
                      onChange={(e) => {
                        setEffects(prev => ({
                          ...prev,
                          'default': {
                            ...prev['default'],
                            durationBonus: e.target.value
                          }
                        }));
                      }}
                      placeholder="Enter duration bonus (e.g., [toxic_count] rounds)"
                    />
                  </div>
                  <div className="toxic-effect-option">
                    <label>Creature Stat Bonus:</label>
                    <input
                      type="text"
                      value={effects['default']?.creatureStatBonus || '+[toxic_count] to all stats'}
                      onChange={(e) => {
                        setEffects(prev => ({
                          ...prev,
                          'default': {
                            ...prev['default'],
                            creatureStatBonus: e.target.value
                          }
                        }));
                      }}
                      placeholder="Enter creature stat bonus"
                    />
                  </div>
                  <div className="toxic-effect-option">
                    <label>Quantity Bonus:</label>
                    <input
                      type="text"
                      value={effects['default']?.quantityBonus || 'Math.floor([toxic_count] / 3)'}
                      onChange={(e) => {
                        setEffects(prev => ({
                          ...prev,
                          'default': {
                            ...prev['default'],
                            quantityBonus: e.target.value
                          }
                        }));
                      }}
                      placeholder="Enter quantity bonus"
                    />
                  </div>
                </div>

              </div>
            )}

            {/* Description Input */}
            <div className="toxic-effect-description-input">
              <label>Description:</label>
              <input
                type="text"
                value={effects['default']?.description || 'Toxic consumption effect'}
                onChange={(e) => updateDescription('default', e.target.value)}
                placeholder="Enter effect description"
              />
            </div>

            {/* Removed Effect References section to avoid duplication */}
          </div>
        </div>
      </div>

      {/* Tooltip Rendering */}
      {showTooltip && tooltipContent && (() => {
        const tooltipRoot = document.getElementById('tooltip-root') || document.body;
        return ReactDOM.createPortal(
          <div
            className="wc3-tooltip"
            style={{
              position: 'fixed',
              left: mousePos.x,
              top: mousePos.y,
              zIndex: 99999,
              pointerEvents: 'none',
              transform: 'translate(10px, -100%)'
            }}
          >
            <div className="tooltip-top-border"></div>
            <div className="wc3-tooltip-content">
              {tooltipContent.icon && (
                <div className="wc3-tooltip-header">
                  <img
                    src={tooltipContent.icon}
                    alt={tooltipContent.title}
                    className="tooltip-icon"
                    style={{ width: '32px', height: '32px', marginRight: '8px' }}
                  />
                  <span className="wc3-tooltip-title">{tooltipContent.title}</span>
                </div>
              )}
              {!tooltipContent.icon && tooltipContent.title && (
                <div className="wc3-tooltip-header">
                  <span className="wc3-tooltip-title">{tooltipContent.title}</span>
                </div>
              )}
              <div className="wc3-tooltip-body">
                {typeof tooltipContent.content === 'string' ? (
                  <div className="tooltip-description">{tooltipContent.content}</div>
                ) : (
                  tooltipContent.content
                )}
              </div>
            </div>
            <div className="tooltip-bottom-border"></div>
          </div>,
          tooltipRoot
        );
      })()}

    </div>
  );
};

export default ToxicSystemEffects;
