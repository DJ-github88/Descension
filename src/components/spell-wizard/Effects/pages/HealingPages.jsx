import React, { useState, useEffect } from 'react';
import {
  ABSORPTION_SHIELD_TYPES,
  REFLECTION_DAMAGE_TYPES,
  ENHANCED_HEALING_TYPES,
  getWowIconPath
} from './effectSystemData';

import {
  isValidDiceNotation,
  getMinRoll,
  getMaxRoll,
  getAverageRoll,
  calculateChainedDamage,
  calculateCriticalDamage,
  calculateDotDamage
} from './DiceRules';

import {
  CHAIN_EFFECT_PROPERTIES,
  EnhancedEffectUtils
} from './enhancedEffectSystemData';

import { useEffectWizard } from './EffectWizardContext';

import {
  WizardStepContainer,
  DiceCalculator,
  AbsorptionShieldConfig,
  ChainEffectConfig
} from './EffectWizardComponents';

/**
 * HealingAmountPage - Configures the healing amount using dice notation
 */
const HealingAmountPage = ({ stepId, currentStepId, flow }) => {
  const [state, dispatch] = useEffectWizard();
  const { healingConfig } = state;
  const [diceExpression, setDiceExpression] = useState(healingConfig.diceNotation || '');
  const [error, setError] = useState('');
  
  useEffect(() => {
    setDiceExpression(healingConfig.diceNotation || '');
  }, [healingConfig.diceNotation]);
  
  const handleDiceNotationChange = (diceNotation) => {
    setDiceExpression(diceNotation);
    
    if (!diceNotation || isValidDiceNotation(diceNotation)) {
      setError('');
      dispatch({
        type: 'UPDATE_HEALING_CONFIG',
        payload: { diceNotation }
      });
    } else {
      setError('Invalid dice notation');
    }
  };
  
  const handleHealingTypeChange = (healingType) => {
    dispatch({
      type: 'UPDATE_HEALING_CONFIG',
      payload: { healingType }
    });
  };
  
  const handleAddDicePattern = (pattern) => {
    handleDiceNotationChange(pattern);
  };
  
  // Common healing patterns by level
  const healingPatterns = [
    { name: 'Minor', pattern: '1d4+2', description: 'Minor healing' },
    { name: 'Light', pattern: '2d4+2', description: 'Light healing' },
    { name: 'Moderate', pattern: '2d8+4', description: 'Moderate healing' },
    { name: 'Heavy', pattern: '4d8+8', description: 'Heavy healing' },
    { name: 'Critical', pattern: '8d8+10', description: 'Critical healing' }
  ];
  
  // Healing types
  const healingTypes = [
    { id: 'direct', name: 'Direct Healing', description: 'Immediate healing effect' },
    { id: 'regeneration', name: 'Regeneration', description: 'Healing over time' },
    { id: 'vampiric', name: 'Vampiric', description: 'Healing based on damage dealt' },
    { id: 'conditional', name: 'Conditional', description: 'More effective under certain conditions' }
  ];
  
  return (
    <WizardStepContainer stepId={stepId} currentStepId={currentStepId} flow={flow} state={state}>
      <div className="healing-amount-page wizard-content">
        <div className="section-intro">
          <h2>Configure Healing Amount</h2>
          <p>
            Define how much healing your effect will provide using standard dice notation.
          </p>
        </div>
        
        <div className="healing-type-selector">
          <h3>Healing Type</h3>
          <div className="type-options">
            {healingTypes.map(type => (
              <div 
                key={type.id}
                className={`type-option ${healingConfig.healingType === type.id ? 'selected' : ''}`}
                onClick={() => handleHealingTypeChange(type.id)}
              >
                <h4>{type.name}</h4>
                <p>{type.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="dice-configuration">
          <DiceCalculator
            label="Healing Dice"
            value={diceExpression}
            onChange={handleDiceNotationChange}
            placeholder="e.g. 2d8+4"
          />
          
          {error && <div className="dice-error">{error}</div>}
          
          {isValidDiceNotation(diceExpression) && (
            <div className="healing-preview">
              <h3>Healing Preview</h3>
              <div className="healing-stats">
                <div className="stat-item">
                  <span className="stat-label">Minimum:</span>
                  <span className="stat-value">{getMinRoll(diceExpression)}</span>
                </div>
                <div className="stat-item highlight">
                  <span className="stat-label">Average:</span>
                  <span className="stat-value">{getAverageRoll(diceExpression).toFixed(1)}</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">Maximum:</span>
                  <span className="stat-value">{getMaxRoll(diceExpression)}</span>
                </div>
              </div>
              <div className="healing-visualization">
                <div className="healing-bar">
                  <div className="healing-range" style={{ width: '100%' }}></div>
                  <div className="average-marker" style={{ 
                    left: `${((getAverageRoll(diceExpression) - getMinRoll(diceExpression)) / 
                           (getMaxRoll(diceExpression) - getMinRoll(diceExpression))) * 100}%` 
                  }}></div>
                </div>
                <div className="range-labels">
                  <span>{getMinRoll(diceExpression)}</span>
                  <span>{getMaxRoll(diceExpression)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="healing-patterns">
          <h3>Common Healing Patterns</h3>
          <div className="pattern-buttons">
            {healingPatterns.map((pattern, index) => (
              <button 
                key={index}
                className={`pattern-button ${diceExpression === pattern.pattern ? 'active' : ''}`}
                onClick={() => handleAddDicePattern(pattern.pattern)}
                title={pattern.description}
              >
                {pattern.name}: {pattern.pattern}
              </button>
            ))}
          </div>
        </div>
        
        {healingConfig.healingType === 'conditional' && (
          <div className="conditional-healing">
            <h3>Conditional Healing</h3>
            <p className="help-text">
              Conditional healing provides additional healing in specific circumstances.
            </p>
            
            <div className="condition-options">
              <div className="condition-option">
                <label>
                  <input
                    type="checkbox"
                    checked={healingConfig.lowHealthBonus || false}
                    onChange={(e) => dispatch({
                      type: 'UPDATE_HEALING_CONFIG',
                      payload: { lowHealthBonus: e.target.checked }
                    })}
                  />
                  Low Health Bonus
                </label>
                <p>Provides bonus healing when target is below 30% health</p>
                
                {healingConfig.lowHealthBonus && (
                  <div className="bonus-config">
                    <DiceCalculator
                      label="Bonus Healing"
                      value={healingConfig.lowHealthBonusDice || '2d8'}
                      onChange={(value) => dispatch({
                        type: 'UPDATE_HEALING_CONFIG',
                        payload: { lowHealthBonusDice: value }
                      })}
                      placeholder="e.g. 2d8"
                    />
                  </div>
                )}
              </div>
              
              <div className="condition-option">
                <label>
                  <input
                    type="checkbox"
                    checked={healingConfig.statusEffectBonus || false}
                    onChange={(e) => dispatch({
                      type: 'UPDATE_HEALING_CONFIG',
                      payload: { statusEffectBonus: e.target.checked }
                    })}
                  />
                  Status Effect Bonus
                </label>
                <p>Provides bonus healing when target has negative status effects</p>
                
                {healingConfig.statusEffectBonus && (
                  <div className="bonus-config">
                    <div className="percent-input">
                      <label>Healing Bonus</label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={healingConfig.statusEffectBonusPercent || 50}
                        onChange={(e) => dispatch({
                          type: 'UPDATE_HEALING_CONFIG',
                          payload: { statusEffectBonusPercent: parseInt(e.target.value) || 0 }
                        })}
                      />
                      <span className="percent-sign">%</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </WizardStepContainer>
  );
};

/**
 * HealingEnhancementsPage - Configures additional healing enhancements like shields
 */
const HealingEnhancementsPage = ({ stepId, currentStepId, flow }) => {
  const [state, dispatch] = useEffectWizard();
  const { healingConfig } = state;
  
  const handleShieldToggle = (useShield) => {
    dispatch({
      type: 'UPDATE_HEALING_CONFIG',
      payload: { useAbsorptionShield: useShield }
    });
  };
  
  const handleShieldConfigChange = (shieldConfig) => {
    dispatch({
      type: 'UPDATE_HEALING_CONFIG',
      payload: { shieldConfig }
    });
  };
  
  const handleOverhealToggle = (useOverheal) => {
    dispatch({
      type: 'UPDATE_HEALING_CONFIG',
      payload: { useOverhealConversion: useOverheal }
    });
  };
  
  const handleOverhealTypeChange = (overhealType) => {
    dispatch({
      type: 'UPDATE_HEALING_CONFIG',
      payload: { 
        overhealConfig: {
          ...healingConfig.overhealConfig,
          conversionType: overhealType
        }
      }
    });
  };
  
  const handleOverhealPercentChange = (percent) => {
    dispatch({
      type: 'UPDATE_HEALING_CONFIG',
      payload: { 
        overhealConfig: {
          ...healingConfig.overhealConfig,
          conversionPercent: parseInt(percent) || 0
        }
      }
    });
  };
  
  const handleCleanseDiseaseToggle = (cleanseDisease) => {
    dispatch({
      type: 'UPDATE_HEALING_CONFIG',
      payload: { cleanseDisease }
    });
  };
  
  const handleCleanseTypeChange = (type) => {
    dispatch({
      type: 'UPDATE_HEALING_CONFIG',
      payload: { 
        cleanseConfig: {
          ...healingConfig.cleanseConfig,
          cleanseType: type
        }
      }
    });
  };
  
  const cleanseTypes = [
    { id: 'disease', name: 'Disease', description: 'Removes disease effects' },
    { id: 'poison', name: 'Poison', description: 'Removes poison effects' },
    { id: 'curse', name: 'Curse', description: 'Removes curse effects' },
    { id: 'all', name: 'All Negative Effects', description: 'Removes all negative status effects' }
  ];
  
  const overhealTypes = [
    { id: 'tempHP', name: 'Temporary Hit Points', description: 'Convert overhealing to temporary hit points' },
    { id: 'shield', name: 'Absorption Shield', description: 'Convert overhealing to an absorption shield' },
    { id: 'speedBoost', name: 'Speed Boost', description: 'Convert overhealing to a temporary speed boost' },
    { id: 'damageBoost', name: 'Damage Boost', description: 'Convert overhealing to a temporary damage boost' }
  ];
  
  return (
    <WizardStepContainer stepId={stepId} currentStepId={currentStepId} flow={flow} state={state}>
      <div className="healing-enhancements-page wizard-content">
        <div className="section-intro">
          <h2>Healing Enhancements</h2>
          <p>
            Add special properties to your healing effect such as absorption shields,
            overheal conversion, or cleansing effects.
          </p>
        </div>
        
        <div className="enhancement-options">
          <div className="enhancement-option">
            <div className="option-header">
              <label className="toggle-label">
                <input 
                  type="checkbox" 
                  checked={healingConfig.useAbsorptionShield || false}
                  onChange={(e) => handleShieldToggle(e.target.checked)} 
                />
                <span className="toggle-title">Absorption Shield</span>
              </label>
            </div>
            <p className="option-description">
              Create a protective shield that absorbs damage in addition to healing.
            </p>
            
            {healingConfig.useAbsorptionShield && (
              <div className="option-config">
                <AbsorptionShieldConfig
                  config={healingConfig.shieldConfig || {
                    shieldType: 'standard',
                    shieldAmount: '3d8',
                    reflectionType: null,
                    reflectionAmount: 0
                  }}
                  onChange={handleShieldConfigChange}
                />
                
                {isValidDiceNotation(healingConfig.diceNotation) && 
                 isValidDiceNotation(healingConfig.shieldConfig?.shieldAmount) && (
                  <div className="healing-shield-preview">
                    <h4>Healing + Shield Preview</h4>
                    <div className="preview-values">
                      <div className="preview-healing">
                        <span className="preview-label">Direct Healing:</span>
                        <span className="preview-value">
                          {getAverageRoll(healingConfig.diceNotation).toFixed(1)}
                        </span>
                      </div>
                      <div className="preview-shield">
                        <span className="preview-label">Shield Amount:</span>
                        <span className="preview-value">
                          {getAverageRoll(healingConfig.shieldConfig.shieldAmount).toFixed(1)}
                        </span>
                      </div>
                      <div className="preview-total">
                        <span className="preview-label">Total Protection:</span>
                        <span className="preview-value">
                          {(getAverageRoll(healingConfig.diceNotation) + 
                            getAverageRoll(healingConfig.shieldConfig.shieldAmount)).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="enhancement-option">
            <div className="option-header">
              <label className="toggle-label">
                <input 
                  type="checkbox" 
                  checked={healingConfig.useOverhealConversion || false}
                  onChange={(e) => handleOverhealToggle(e.target.checked)} 
                />
                <span className="toggle-title">Overheal Conversion</span>
              </label>
            </div>
            <p className="option-description">
              Convert excess healing (beyond max health) into other beneficial effects.
            </p>
            
            {healingConfig.useOverhealConversion && (
              <div className="option-config">
                <div className="overheal-type">
                  <label>Conversion Type</label>
                  <div className="type-options">
                    {overhealTypes.map(type => (
                      <div 
                        key={type.id}
                        className={`type-option ${healingConfig.overhealConfig?.conversionType === type.id ? 'selected' : ''}`}
                        onClick={() => handleOverhealTypeChange(type.id)}
                      >
                        <h4>{type.name}</h4>
                        <p>{type.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="overheal-percent">
                  <label>Conversion Percentage</label>
                  <div className="slider-input">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={healingConfig.overhealConfig?.conversionPercent || 50}
                      onChange={(e) => handleOverhealPercentChange(e.target.value)}
                    />
                    <span className="value-display">{healingConfig.overhealConfig?.conversionPercent || 50}%</span>
                  </div>
                  <p className="help-text">
                    Percentage of overhealing that converts to the selected effect
                  </p>
                </div>
                
                {healingConfig.overhealConfig?.conversionType === 'tempHP' && (
                  <div className="tempHP-duration">
                    <label>Temporary HP Duration</label>
                    <select
                      value={healingConfig.overhealConfig?.tempHPDuration || '1hour'}
                      onChange={(e) => dispatch({
                        type: 'UPDATE_HEALING_CONFIG',
                        payload: { 
                          overhealConfig: {
                            ...healingConfig.overhealConfig,
                            tempHPDuration: e.target.value
                          }
                        }
                      })}
                    >
                      <option value="1min">1 Minute</option>
                      <option value="10min">10 Minutes</option>
                      <option value="1hour">1 Hour</option>
                      <option value="8hour">8 Hours</option>
                    </select>
                  </div>
                )}
                
                {healingConfig.overhealConfig?.conversionType === 'shield' && (
                  <div className="shield-duration">
                    <label>Shield Duration</label>
                    <select
                      value={healingConfig.overhealConfig?.shieldDuration || '10min'}
                      onChange={(e) => dispatch({
                        type: 'UPDATE_HEALING_CONFIG',
                        payload: { 
                          overhealConfig: {
                            ...healingConfig.overhealConfig,
                            shieldDuration: e.target.value
                          }
                        }
                      })}
                    >
                      <option value="1min">1 Minute</option>
                      <option value="10min">10 Minutes</option>
                      <option value="1hour">1 Hour</option>
                    </select>
                  </div>
                )}
              </div>
            )}
          </div>
          
          <div className="enhancement-option">
            <div className="option-header">
              <label className="toggle-label">
                <input 
                  type="checkbox" 
                  checked={healingConfig.cleanseDisease || false}
                  onChange={(e) => handleCleanseDiseaseToggle(e.target.checked)} 
                />
                <span className="toggle-title">Cleansing Effect</span>
              </label>
            </div>
            <p className="option-description">
              Remove harmful status effects when healing the target.
            </p>
            
            {healingConfig.cleanseDisease && (
              <div className="option-config">
                <div className="cleanse-type">
                  <label>Cleanse Type</label>
                  <div className="type-options">
                    {cleanseTypes.map(type => (
                      <div 
                        key={type.id}
                        className={`type-option ${healingConfig.cleanseConfig?.cleanseType === type.id ? 'selected' : ''}`}
                        onClick={() => handleCleanseTypeChange(type.id)}
                      >
                        <h4>{type.name}</h4>
                        <p>{type.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="cleanse-power">
                  <label>Cleanse Power</label>
                  <select
                    value={healingConfig.cleanseConfig?.cleansePower || 'single'}
                    onChange={(e) => dispatch({
                      type: 'UPDATE_HEALING_CONFIG',
                      payload: { 
                        cleanseConfig: {
                          ...healingConfig.cleanseConfig,
                          cleansePower: e.target.value
                        }
                      }
                    })}
                  >
                    <option value="single">Single Effect</option>
                    <option value="limited">Limited (1d3 Effects)</option>
                    <option value="all">All Effects</option>
                  </select>
                  <p className="help-text">
                    How many effects can be cleansed at once
                  </p>
                </div>
                
                <div className="cleanse-chance">
                  <label>Cleanse Chance</label>
                  <div className="slider-input">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={healingConfig.cleanseConfig?.cleanseChance || 100}
                      onChange={(e) => dispatch({
                        type: 'UPDATE_HEALING_CONFIG',
                        payload: { 
                          cleanseConfig: {
                            ...healingConfig.cleanseConfig,
                            cleanseChance: parseInt(e.target.value)
                          }
                        }
                      })}
                    />
                    <span className="value-display">{healingConfig.cleanseConfig?.cleanseChance || 100}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </WizardStepContainer>
  );
};

/**
 * HealingCriticalEffectsPage - Configures critical healing effects
 */
const HealingCriticalEffectsPage = ({ stepId, currentStepId, flow }) => {
  const [state, dispatch] = useEffectWizard();
  const { healingConfig } = state;
  
  const handleCriticalToggle = (useCriticalHealing) => {
    dispatch({
      type: 'UPDATE_HEALING_CONFIG',
      payload: { useCriticalHealing }
    });
  };
  
  const handleMultiplierChange = (multiplier) => {
    dispatch({
      type: 'UPDATE_HEALING_CONFIG',
      payload: { 
        criticalHealingConfig: {
          ...healingConfig.criticalHealingConfig,
          criticalMultiplier: parseFloat(multiplier) || 2
        }
      }
    });
  };
  
  const handleExtraDiceChange = (extraDice) => {
    dispatch({
      type: 'UPDATE_HEALING_CONFIG',
      payload: { 
        criticalHealingConfig: {
          ...healingConfig.criticalHealingConfig,
          extraDice
        }
      }
    });
  };
  
  const handleCriticalEffectToggle = (effectId) => {
    const currentEffects = healingConfig.criticalHealingConfig?.effects || [];
    const effectIndex = currentEffects.indexOf(effectId);
    
    let newEffects;
    if (effectIndex >= 0) {
      newEffects = [
        ...currentEffects.slice(0, effectIndex),
        ...currentEffects.slice(effectIndex + 1)
      ];
    } else {
      newEffects = [...currentEffects, effectId];
    }
    
    dispatch({
      type: 'UPDATE_HEALING_CONFIG',
      payload: { 
        criticalHealingConfig: {
          ...healingConfig.criticalHealingConfig,
          effects: newEffects
        }
      }
    });
  };
  
  const criticalEffects = [
    { id: 'vitalityBoost', name: 'Vitality Boost', description: 'Target gains temporary vitality bonus', icon: 'spell_holy_holybolt' },
    { id: 'statusRemoval', name: 'Status Removal', description: 'Removes negative status effects', icon: 'spell_holy_dispelmagic' },
    { id: 'regeneration', name: 'Regeneration', description: 'Target gains healing over time effect', icon: 'spell_holy_renew' },
    { id: 'fortification', name: 'Fortification', description: 'Target gains temporary damage resistance', icon: 'spell_holy_devotionaura' },
    { id: 'inspiration', name: 'Inspiration', description: 'Target gains bonus to their next action', icon: 'spell_holy_powerinfusion' }
  ];
  
  return (
    <WizardStepContainer stepId={stepId} currentStepId={currentStepId} flow={flow} state={state}>
      <div className="healing-critical-page wizard-content">
        <div className="section-intro">
          <h2>Critical Healing Effects</h2>
          <p>
            Configure how your healing effect behaves on critical healing rolls. Critical healing
            can provide extra healing and additional beneficial effects.
          </p>
        </div>
        
        <div className="critical-toggle">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={healingConfig.useCriticalHealing || false}
              onChange={(e) => handleCriticalToggle(e.target.checked)}
            />
            <span className="toggle-title">Enable Critical Healing Effects</span>
          </label>
        </div>
        
        {healingConfig.useCriticalHealing && (
          <div className="critical-configuration">
            <div className="critical-multiplier">
              <label>Critical Healing Multiplier</label>
              <div className="multiplier-input">
                <select
                  value={healingConfig.criticalHealingConfig?.criticalMultiplier || 2}
                  onChange={(e) => handleMultiplierChange(e.target.value)}
                >
                  <option value="1.5">1.5×</option>
                  <option value="2">2×</option>
                  <option value="2.5">2.5×</option>
                  <option value="3">3×</option>
                </select>
              </div>
              <p className="help-text">
                Multiplier applied to the healing amount on a critical healing roll
              </p>
            </div>
            
            <div className="critical-dice">
              <DiceCalculator
                label="Extra Healing Dice"
                value={healingConfig.criticalHealingConfig?.extraDice || ''}
                onChange={handleExtraDiceChange}
                placeholder="e.g. 2d8"
              />
              <p className="help-text">
                Additional healing dice added on critical healing rolls, beyond the multiplier
              </p>
            </div>
            
            <div className="critical-effects">
              <h3>Critical Healing Effects</h3>
              <p className="help-text">
                Select special effects that trigger on critical healing rolls
              </p>
              
              <div className="effects-grid">
                {criticalEffects.map(effect => (
                  <div 
                    key={effect.id}
                    className={`effect-card ${healingConfig.criticalHealingConfig?.effects?.includes(effect.id) ? 'selected' : ''}`}
                    onClick={() => handleCriticalEffectToggle(effect.id)}
                  >
                    <div className="effect-icon">
                      <img src={getWowIconPath(effect.icon)} alt={effect.name} />
                    </div>
                    <div className="effect-info">
                      <h4>{effect.name}</h4>
                      <p>{effect.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {healingConfig.diceNotation && isValidDiceNotation(healingConfig.diceNotation) && (
              <div className="critical-preview">
                <h3>Critical Healing Preview</h3>
                <div className="healing-comparison">
                  <div className="normal-healing">
                    <h4>Normal Healing</h4>
                    <div className="healing-value">{getAverageRoll(healingConfig.diceNotation).toFixed(1)}</div>
                  </div>
                  <div className="critical-healing">
                    <h4>Critical Healing</h4>
                    <div className="healing-value">
                      {(getAverageRoll(healingConfig.diceNotation) * 
                        (healingConfig.criticalHealingConfig?.criticalMultiplier || 2) + 
                        (healingConfig.criticalHealingConfig?.extraDice && isValidDiceNotation(healingConfig.criticalHealingConfig.extraDice) ? 
                          getAverageRoll(healingConfig.criticalHealingConfig.extraDice) : 0)
                      ).toFixed(1)}
                    </div>
                    <div className="healing-increase">
                      +{((((healingConfig.criticalHealingConfig?.criticalMultiplier || 2) - 1) * 100) + 
                         (healingConfig.criticalHealingConfig?.extraDice && isValidDiceNotation(healingConfig.criticalHealingConfig.extraDice) ? 
                          getAverageRoll(healingConfig.criticalHealingConfig.extraDice) / getAverageRoll(healingConfig.diceNotation) * 100 : 0)
                       ).toFixed(0)}%
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </WizardStepContainer>
  );
};

/**
 * HealingChainPage - Configures chain healing effects
 */
const HealingChainPage = ({ stepId, currentStepId, flow }) => {
  const [state, dispatch] = useEffectWizard();
  const { healingConfig } = state;
  
  const handleChainToggle = (useChain) => {
    dispatch({
      type: 'UPDATE_HEALING_CONFIG',
      payload: { useChainHealing: useChain }
    });
  };
  
  const handleChainConfigChange = (chainConfig) => {
    dispatch({
      type: 'UPDATE_HEALING_CONFIG',
      payload: { chainConfig }
    });
  };
  
  return (
    <WizardStepContainer stepId={stepId} currentStepId={currentStepId} flow={flow} state={state}>
      <div className="healing-chain-page wizard-content">
        <div className="section-intro">
          <h2>Chain Healing Effects</h2>
          <p>
            Chain healing allows your healing effect to jump from the primary target to nearby allies,
            typically with reduced effectiveness for each jump.
          </p>
        </div>
        
        <div className="chain-toggle">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={healingConfig.useChainHealing || false}
              onChange={(e) => handleChainToggle(e.target.checked)}
            />
            <span className="toggle-title">Enable Chain Healing Effect</span>
          </label>
        </div>
        
        {healingConfig.useChainHealing && (
          <div className="chain-configuration">
            <ChainEffectConfig
              config={healingConfig.chainConfig || {
                targets: 3,
                falloffType: 'percentage',
                falloffRate: 25,
                minimumHealing: null
              }}
              onChange={handleChainConfigChange}
              effectType="healing"
            />
            
            {healingConfig.diceNotation && isValidDiceNotation(healingConfig.diceNotation) && (
              <div className="chain-preview">
                <h3>Chain Healing Preview</h3>
                {(() => {
                  try {
                    const chainCalc = calculateChainedDamage(
                      healingConfig.diceNotation,
                      {
                        targets: healingConfig.chainConfig?.targets || 3,
                        falloffType: healingConfig.chainConfig?.falloffType || 'percentage',
                        falloffRate: healingConfig.chainConfig?.falloffRate || 25,
                        minimumDamage: healingConfig.chainConfig?.minimumHealing
                      }
                    );
                    
                    return (
                      <div className="chain-visualization">
                        <div className="chain-path">
                          {chainCalc.results.map((result, index) => (
                            <React.Fragment key={index}>
                              <div className={`chain-node target-${index}`}>
                                <div className="node-number">{index + 1}</div>
                                <div className="node-healing">
                                  {result.average.toFixed(1)}
                                </div>
                                {index > 0 && (
                                  <div className="healing-reduction">
                                    {(100 - (result.average / chainCalc.results[0].average * 100)).toFixed(0)}% reduced
                                  </div>
                                )}
                              </div>
                              {index < chainCalc.results.length - 1 && (
                                <div className="chain-connector">
                                  <svg height="30" width="60">
                                    <path d="M0,15 C20,5 40,25 60,15" stroke="#7cfc00" strokeWidth="2" fill="none" />
                                  </svg>
                                </div>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                        
                        <div className="chain-total">
                          <div className="total-label">Total Average Healing:</div>
                          <div className="total-value">{chainCalc.totalAverage.toFixed(1)}</div>
                          <div className="total-comparison">
                            vs. {getAverageRoll(healingConfig.diceNotation).toFixed(1)} single target
                            ({((chainCalc.totalAverage / getAverageRoll(healingConfig.diceNotation) - 1) * 100).toFixed(0)}% increase)
                          </div>
                        </div>
                      </div>
                    );
                  } catch (e) {
                    return <div className="calculation-error">Unable to calculate preview. Verify your dice notation.</div>;
                  }
                })()}
              </div>
            )}
            
            <div className="target-selection">
              <h3>Priority Target Selection</h3>
              <p className="help-text">
                Choose how subsequent targets are selected in the healing chain
              </p>
              
              <div className="selection-options">
                <div 
                  className={`selection-option ${healingConfig.chainConfig?.targetingMethod === 'most_injured' ? 'selected' : ''}`}
                  onClick={() => handleChainConfigChange({
                    ...healingConfig.chainConfig,
                    targetingMethod: 'most_injured'
                  })}
                >
                  <h4>Most Injured</h4>
                  <p>Prioritize allies with the lowest health percentage</p>
                </div>
                
                <div 
                  className={`selection-option ${healingConfig.chainConfig?.targetingMethod === 'nearest' ? 'selected' : ''}`}
                  onClick={() => handleChainConfigChange({
                    ...healingConfig.chainConfig,
                    targetingMethod: 'nearest'
                  })}
                >
                  <h4>Nearest Targets</h4>
                  <p>Prioritize closest available allies</p>
                </div>
                
                <div 
                  className={`selection-option ${healingConfig.chainConfig?.targetingMethod === 'random' ? 'selected' : ''}`}
                  onClick={() => handleChainConfigChange({
                    ...healingConfig.chainConfig,
                    targetingMethod: 'random'
                  })}
                >
                  <h4>Random Selection</h4>
                  <p>Randomly select from available allies</p>
                </div>
                
                <div 
                  className={`selection-option ${healingConfig.chainConfig?.targetingMethod === 'priority_role' ? 'selected' : ''}`}
                  onClick={() => handleChainConfigChange({
                    ...healingConfig.chainConfig,
                    targetingMethod: 'priority_role'
                  })}
                >
                  <h4>Role Priority</h4>
                  <p>Prioritize by role: Tank → Healer → Damage Dealer</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </WizardStepContainer>
  );
};

/**
 * HealingOverTimePage - Configures healing over time effects
 */
const HealingOverTimePage = ({ stepId, currentStepId, flow }) => {
  const [state, dispatch] = useEffectWizard();
  const { healingConfig } = state;
  
  const handleHoTToggle = (useHoT) => {
    dispatch({
      type: 'UPDATE_HEALING_CONFIG',
      payload: { useHealingOverTime: useHoT }
    });
  };
  
  const handleTickFrequencyChange = (frequency) => {
    dispatch({
      type: 'UPDATE_HEALING_CONFIG',
      payload: { 
        hotConfig: {
          ...healingConfig.hotConfig,
          tickFrequency: frequency
        }
      }
    });
  };
  
  const handleTickCountChange = (count) => {
    dispatch({
      type: 'UPDATE_HEALING_CONFIG',
      payload: { 
        hotConfig: {
          ...healingConfig.hotConfig,
          tickCount: parseInt(count) || 5
        }
      }
    });
  };
  
  const handleTickAmountChange = (amount) => {
    dispatch({
      type: 'UPDATE_HEALING_CONFIG',
      payload: { 
        hotConfig: {
          ...healingConfig.hotConfig,
          tickAmount: amount
        }
      }
    });
  };
  
  const handleScalingTypeChange = (type) => {
    dispatch({
      type: 'UPDATE_HEALING_CONFIG',
      payload: { 
        hotConfig: {
          ...healingConfig.hotConfig,
          scalingType: type
        }
      }
    });
  };
  
  const tickFrequencies = [
    { id: 'round', name: 'Per Round', description: 'Healing occurs at the start of each round' },
    { id: 'turn', name: 'Per Turn', description: 'Healing occurs at the start of the target\'s turn' },
    { id: '6seconds', name: 'Every 6 Seconds', description: 'Healing occurs every 6 seconds of game time' }
  ];
  
  const scalingTypes = [
    { id: 'flat', name: 'Flat', description: 'Each tick provides the same amount of healing' },
    { id: 'frontLoaded', name: 'Front-loaded', description: 'More healing in earlier ticks, less in later ticks' },
    { id: 'backLoaded', name: 'Back-loaded', description: 'Less healing in earlier ticks, more in later ticks' },
    { id: 'pulsing', name: 'Pulsing', description: 'Healing alternates between high and low amounts' }
  ];
  
  return (
    <WizardStepContainer stepId={stepId} currentStepId={currentStepId} flow={flow} state={state}>
      <div className="healing-over-time-page wizard-content">
        <div className="section-intro">
          <h2>Healing Over Time</h2>
          <p>
            Configure healing that occurs gradually over time rather than all at once.
            This is useful for sustained healing over the course of an encounter.
          </p>
        </div>
        
        <div className="hot-toggle">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={healingConfig.useHealingOverTime || false}
              onChange={(e) => handleHoTToggle(e.target.checked)}
            />
            <span className="toggle-title">Enable Healing Over Time</span>
          </label>
        </div>
        
        {healingConfig.useHealingOverTime && (
          <div className="hot-configuration">
            <div className="tick-frequency">
              <h3>Healing Frequency</h3>
              <div className="frequency-options">
                {tickFrequencies.map(frequency => (
                  <div 
                    key={frequency.id}
                    className={`frequency-option ${healingConfig.hotConfig?.tickFrequency === frequency.id ? 'selected' : ''}`}
                    onClick={() => handleTickFrequencyChange(frequency.id)}
                  >
                    <h4>{frequency.name}</h4>
                    <p>{frequency.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="tick-count">
              <label>Number of Healing Ticks</label>
              <div className="count-input">
                <input 
                  type="number" 
                  min="1" 
                  max="20" 
                  value={healingConfig.hotConfig?.tickCount || 5}
                  onChange={(e) => handleTickCountChange(e.target.value)}
                />
              </div>
              <p className="help-text">
                How many times the healing effect occurs
              </p>
            </div>
            
            <div className="tick-amount">
              <DiceCalculator
                label="Healing Per Tick"
                value={healingConfig.hotConfig?.tickAmount || '1d8+2'}
                onChange={handleTickAmountChange}
                placeholder="e.g. 1d8+2"
              />
              <p className="help-text">
                Amount of healing provided on each tick
              </p>
            </div>
            
            <div className="scaling-type">
              <h3>Healing Scaling</h3>
              <div className="scaling-options">
                {scalingTypes.map(type => (
                  <div 
                    key={type.id}
                    className={`scaling-option ${healingConfig.hotConfig?.scalingType === type.id ? 'selected' : ''}`}
                    onClick={() => handleScalingTypeChange(type.id)}
                  >
                    <h4>{type.name}</h4>
                    <p>{type.description}</p>
                  </div>
                ))}
              </div>
            </div>
            
            {healingConfig.hotConfig?.tickAmount && 
             isValidDiceNotation(healingConfig.hotConfig.tickAmount) && (
              <div className="hot-preview">
                <h3>Healing Over Time Preview</h3>
                
                <div className="hot-visualization">
                  {Array.from({ length: Math.min(healingConfig.hotConfig?.tickCount || 5, 10) }, (_, i) => {
                    let scalingFactor = 1;
                    
                    switch (healingConfig.hotConfig?.scalingType) {
                      case 'frontLoaded':
                        scalingFactor = 1.5 - (i * 0.5 / (healingConfig.hotConfig?.tickCount || 5));
                        break;
                      case 'backLoaded':
                        scalingFactor = 0.5 + (i * 1 / (healingConfig.hotConfig?.tickCount || 5));
                        break;
                      case 'pulsing':
                        scalingFactor = i % 2 === 0 ? 1.3 : 0.7;
                        break;
                      default: // flat
                        scalingFactor = 1;
                    }
                    
                    const tickAverage = getAverageRoll(healingConfig.hotConfig.tickAmount) * scalingFactor;
                    
                    return (
                      <div key={i} className="tick-bar">
                        <div className="tick-label">Tick {i + 1}</div>
                        <div className="tick-value">{tickAverage.toFixed(1)}</div>
                        <div className="tick-bar-fill" style={{ height: `${tickAverage * 3}px` }}></div>
                      </div>
                    );
                  })}
                </div>
                
                <div className="total-healing">
                  <h4>Total Healing</h4>
                  <div className="total-value">
                    {(() => {
                      let total = 0;
                      const baseAmount = getAverageRoll(healingConfig.hotConfig.tickAmount);
                      
                      for (let i = 0; i < (healingConfig.hotConfig?.tickCount || 5); i++) {
                        let scalingFactor = 1;
                        
                        switch (healingConfig.hotConfig?.scalingType) {
                          case 'frontLoaded':
                            scalingFactor = 1.5 - (i * 0.5 / (healingConfig.hotConfig?.tickCount || 5));
                            break;
                          case 'backLoaded':
                            scalingFactor = 0.5 + (i * 1 / (healingConfig.hotConfig?.tickCount || 5));
                            break;
                          case 'pulsing':
                            scalingFactor = i % 2 === 0 ? 1.3 : 0.7;
                            break;
                          default: // flat
                            scalingFactor = 1;
                        }
                        
                        total += baseAmount * scalingFactor;
                      }
                      
                      return total.toFixed(1);
                    })()}
                  </div>
                  
                  {healingConfig.diceNotation && isValidDiceNotation(healingConfig.diceNotation) && (
                    <div className="comparison">
                      vs. {getAverageRoll(healingConfig.diceNotation).toFixed(1)} direct healing
                      {(() => {
                        // Calculate total HoT healing
                        let total = 0;
                        const baseAmount = getAverageRoll(healingConfig.hotConfig.tickAmount);
                        
                        for (let i = 0; i < (healingConfig.hotConfig?.tickCount || 5); i++) {
                          let scalingFactor = 1;
                          
                          switch (healingConfig.hotConfig?.scalingType) {
                            case 'frontLoaded':
                              scalingFactor = 1.5 - (i * 0.5 / (healingConfig.hotConfig?.tickCount || 5));
                              break;
                            case 'backLoaded':
                              scalingFactor = 0.5 + (i * 1 / (healingConfig.hotConfig?.tickCount || 5));
                              break;
                            case 'pulsing':
                              scalingFactor = i % 2 === 0 ? 1.3 : 0.7;
                              break;
                            default: // flat
                              scalingFactor = 1;
                          }
                          
                          total += baseAmount * scalingFactor;
                        }
                        
                        // Calculate and display percentage difference
                        const directHealing = getAverageRoll(healingConfig.diceNotation);
                        const percentDiff = ((total / directHealing) - 1) * 100;
                        return ` (${percentDiff.toFixed(0)}% difference)`;
                      })()}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </WizardStepContainer>
  );
};

export {
  HealingAmountPage,
  HealingEnhancementsPage,
  HealingCriticalEffectsPage,
  HealingChainPage,
  HealingOverTimePage
};