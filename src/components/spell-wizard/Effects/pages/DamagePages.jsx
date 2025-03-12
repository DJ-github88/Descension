import React, { useState, useEffect } from 'react';
import {
  DAMAGE_TYPES,
  REFLECTION_DAMAGE_TYPES,
  CRITICAL_EFFECT_MODIFIERS,
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
  DamageTypeSelector,
  CriticalEffectConfig,
  ChainEffectConfig,
  LifeStealConfig
} from './EffectWizardComponents';

/**
 * DamageTypeSelectionPage - Allows users to select damage types for their spell effect
 */
const DamageTypeSelectionPage = ({ stepId, currentStepId, flow }) => {
  const [state, dispatch] = useEffectWizard();
  const { damageConfig } = state;
  
  const handleDamageTypesChange = (types) => {
    dispatch({
      type: 'SET_DAMAGE_TYPES',
      payload: types
    });
  };
  
  return (
    <WizardStepContainer stepId={stepId} currentStepId={currentStepId} flow={flow} state={state}>
      <div className="damage-type-selection-page wizard-content">
        <div className="section-intro">
          <h2>Select Damage Types</h2>
          <p>
            Choose one or more damage types for your effect. Different damage types interact 
            differently with resistances and vulnerabilities.
          </p>
        </div>
        
        <DamageTypeSelector
          selectedTypes={damageConfig.damageTypes}
          onChange={handleDamageTypesChange}
          maxSelections={3}
        />
        
        {damageConfig.damageTypes.length > 0 && (
          <div className="selection-summary damage-types-summary">
            <h3>Selected Damage Types</h3>
            <div className="selected-damage-types">
              {damageConfig.damageTypes.map(typeId => {
                const damageType = DAMAGE_TYPES.find(t => t.id === typeId);
                return (
                  <div key={typeId} className="damage-type-badge">
                    <img src={getWowIconPath(damageType.icon)} alt={damageType.name} className="damage-icon" />
                    <span>{damageType.name}</span>
                  </div>
                );
              })}
            </div>
            <div className="interaction-tips">
              <h4>Damage Type Interactions</h4>
              <ul>
                {damageConfig.damageTypes.map(typeId => {
                  const damageType = DAMAGE_TYPES.find(t => t.id === typeId);
                  return (
                    <li key={`${typeId}-interactions`}>
                      <strong>{damageType.name}:</strong> Commonly resisted by {damageType.commonResistance}, 
                      effective against {damageType.commonVulnerability}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        )}
      </div>
    </WizardStepContainer>
  );
};

/**
 * DamageAmountPage - Configures the damage amount using dice notation
 */
const DamageAmountPage = ({ stepId, currentStepId, flow }) => {
  const [state, dispatch] = useEffectWizard();
  const { damageConfig } = state;
  const [diceExpression, setDiceExpression] = useState(damageConfig.diceNotation || '');
  const [error, setError] = useState('');
  
  useEffect(() => {
    setDiceExpression(damageConfig.diceNotation || '');
  }, [damageConfig.diceNotation]);
  
  const handleDiceNotationChange = (diceNotation) => {
    setDiceExpression(diceNotation);
    
    if (!diceNotation || isValidDiceNotation(diceNotation)) {
      setError('');
      dispatch({
        type: 'UPDATE_DAMAGE_CONFIG',
        payload: { diceNotation }
      });
    } else {
      setError('Invalid dice notation');
    }
  };
  
  const handleAddDicePattern = (pattern) => {
    handleDiceNotationChange(pattern);
  };
  
  // Common damage patterns by level
  const damagePatterns = [
    { name: 'Cantrip', pattern: '1d8', description: 'Minor damage' },
    { name: 'Level 1', pattern: '2d6+2', description: 'Low-level spell' },
    { name: 'Level 3', pattern: '4d6+4', description: 'Mid-level spell' },
    { name: 'Level 5', pattern: '8d6', description: 'High-level spell' },
    { name: 'Level 7', pattern: '10d8', description: 'Epic spell' }
  ];
  
  // Advanced expressions examples
  const advancedExpressions = [
    { pattern: '2d6+1d4', description: 'Mixed dice' },
    { pattern: '(1d6+2)*2', description: 'Multiplication' },
    { pattern: '4d6k3', description: 'Keep highest 3' },
    { pattern: '2d10+STR', description: 'With modifier' }
  ];
  
  return (
    <WizardStepContainer stepId={stepId} currentStepId={currentStepId} flow={flow} state={state}>
      <div className="damage-amount-page wizard-content">
        <div className="section-intro">
          <h2>Configure Damage Amount</h2>
          <p>
            Define how much damage your effect will deal using standard dice notation.
          </p>
        </div>
        
        <div className="dice-configuration">
          <DiceCalculator
            label="Damage Dice"
            value={diceExpression}
            onChange={handleDiceNotationChange}
            placeholder="e.g. 2d6+3"
          />
          
          {error && <div className="dice-error">{error}</div>}
          
          {isValidDiceNotation(diceExpression) && (
            <div className="damage-preview">
              <h3>Damage Preview</h3>
              <div className="damage-stats">
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
              <div className="damage-visualization">
                <div className="damage-bar">
                  <div className="damage-range" style={{ width: '100%' }}></div>
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
        
        <div className="damage-patterns">
          <h3>Common Damage Patterns</h3>
          <div className="pattern-buttons">
            {damagePatterns.map((pattern, index) => (
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
        
        <div className="advanced-expressions">
          <h3>Advanced Expressions</h3>
          <p className="help-text">
            You can use more complex expressions for sophisticated damage formulas.
          </p>
          <div className="expression-examples">
            {advancedExpressions.map((expr, index) => (
              <button 
                key={index}
                className="expression-button"
                onClick={() => handleAddDicePattern(expr.pattern)}
                title={expr.description}
              >
                {expr.pattern}
              </button>
            ))}
          </div>
          <div className="expression-notes">
            <p>
              <strong>Note:</strong> Dice notation can include:
              <ul>
                <li>Standard dice (d4, d6, d8, d10, d12, d20, d100)</li>
                <li>Multiple dice sets (2d6+1d4)</li>
                <li>Flat modifiers (2d6+3)</li>
                <li>Keep highest dice (4d6k3)</li>
                <li>Expressions with parentheses</li>
              </ul>
            </p>
          </div>
        </div>
      </div>
    </WizardStepContainer>
  );
};

/**
 * DamageEnhancementsPage - Configures additional damage enhancements like reflection and life steal
 */
const DamageEnhancementsPage = ({ stepId, currentStepId, flow }) => {
  const [state, dispatch] = useEffectWizard();
  const { damageConfig } = state;
  
  const handleToggle = (enhancementKey, value) => {
    dispatch({
      type: 'UPDATE_DAMAGE_CONFIG',
      payload: { [enhancementKey]: value }
    });
  };
  
  const handleLifeStealConfigChange = (lifeStealConfig) => {
    dispatch({
      type: 'UPDATE_DAMAGE_CONFIG',
      payload: { lifeStealConfig }
    });
  };
  
  const handleCleaveConfigChange = (key, value) => {
    dispatch({
      type: 'UPDATE_DAMAGE_CONFIG',
      payload: { 
        cleaveConfig: {
          ...damageConfig.cleaveConfig,
          [key]: value
        }
      }
    });
  };
  
  const handleReflectionConfigChange = (key, value) => {
    dispatch({
      type: 'UPDATE_DAMAGE_CONFIG',
      payload: { 
        reflectionConfig: {
          ...damageConfig.reflectionConfig,
          [key]: value
        }
      }
    });
  };
  
  return (
    <WizardStepContainer stepId={stepId} currentStepId={currentStepId} flow={flow} state={state}>
      <div className="damage-enhancements-page wizard-content">
        <div className="section-intro">
          <h2>Damage Enhancements</h2>
          <p>
            Add special properties to your damage effect such as life stealing, damage reflection, or cleave damage.
          </p>
        </div>
        
        <div className="enhancement-options">
          <div className="enhancement-option">
            <div className="option-header">
              <label className="toggle-label">
                <input 
                  type="checkbox" 
                  checked={damageConfig.useLifeSteal || false}
                  onChange={(e) => handleToggle('useLifeSteal', e.target.checked)} 
                />
                <span className="toggle-title">Life Steal</span>
              </label>
            </div>
            <p className="option-description">
              Convert a portion of your damage into healing for yourself.
            </p>
            
            {damageConfig.useLifeSteal && (
              <div className="option-config">
                <LifeStealConfig
                  config={damageConfig.lifeStealConfig || {
                    lifeStealType: 'percent',
                    lifeStealPercent: 20,
                    lifeStealAmount: '1d6'
                  }}
                  onChange={handleLifeStealConfigChange}
                />
              </div>
            )}
          </div>
          
          <div className="enhancement-option">
            <div className="option-header">
              <label className="toggle-label">
                <input 
                  type="checkbox" 
                  checked={damageConfig.useReflection || false}
                  onChange={(e) => handleToggle('useReflection', e.target.checked)} 
                />
                <span className="toggle-title">Damage Reflection</span>
              </label>
            </div>
            <p className="option-description">
              Add a chance to reflect damage back to attackers.
            </p>
            
            {damageConfig.useReflection && (
              <div className="option-config">
                <div className="config-row">
                  <label>Reflection Chance</label>
                  <div className="slider-input">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={damageConfig.reflectionConfig?.chance || 20}
                      onChange={(e) => handleReflectionConfigChange('chance', parseInt(e.target.value))}
                    />
                    <span className="value-display">{damageConfig.reflectionConfig?.chance || 20}%</span>
                  </div>
                </div>
                
                <div className="config-row">
                  <label>Reflection Amount</label>
                  <div className="slider-input">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={damageConfig.reflectionConfig?.amount || 50}
                      onChange={(e) => handleReflectionConfigChange('amount', parseInt(e.target.value))}
                    />
                    <span className="value-display">{damageConfig.reflectionConfig?.amount || 50}%</span>
                  </div>
                </div>
                
                <div className="config-row">
                  <label>Reflection Type</label>
                  <select
                    value={damageConfig.reflectionConfig?.type || 'same'}
                    onChange={(e) => handleReflectionConfigChange('type', e.target.value)}
                  >
                    <option value="same">Same as received</option>
                    {REFLECTION_DAMAGE_TYPES.map(type => (
                      <option key={type.id} value={type.id}>{type.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="config-row">
                  <DiceCalculator
                    label="Additional Reflection Damage"
                    value={damageConfig.reflectionConfig?.bonusDamage || ''}
                    onChange={(value) => handleReflectionConfigChange('bonusDamage', value)}
                    placeholder="e.g. 1d6"
                  />
                </div>
              </div>
            )}
          </div>
          
          <div className="enhancement-option">
            <div className="option-header">
              <label className="toggle-label">
                <input 
                  type="checkbox" 
                  checked={damageConfig.useCleave || false}
                  onChange={(e) => handleToggle('useCleave', e.target.checked)} 
                />
                <span className="toggle-title">Cleave Damage</span>
              </label>
            </div>
            <p className="option-description">
              Deal reduced damage to enemies near your primary target.
            </p>
            
            {damageConfig.useCleave && (
              <div className="option-config">
                <div className="config-row">
                  <label>Cleave Percentage</label>
                  <div className="slider-input">
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      value={damageConfig.cleaveConfig?.percentage || 50}
                      onChange={(e) => handleCleaveConfigChange('percentage', parseInt(e.target.value))}
                    />
                    <span className="value-display">{damageConfig.cleaveConfig?.percentage || 50}%</span>
                  </div>
                </div>
                
                <div className="config-row">
                  <DiceCalculator
                    label="Cleave Radius"
                    value={damageConfig.cleaveConfig?.radius || '2d6'}
                    onChange={(value) => handleCleaveConfigChange('radius', value)}
                    placeholder="e.g. 2d6"
                  />
                  <p className="help-text">The area within which secondary targets are affected</p>
                </div>
                
                <div className="config-row">
                  <label>Maximum Targets</label>
                  <input 
                    type="number" 
                    min="1" 
                    max="10"
                    value={damageConfig.cleaveConfig?.maxTargets || 3}
                    onChange={(e) => handleCleaveConfigChange('maxTargets', parseInt(e.target.value))}
                  />
                </div>
                
                {isValidDiceNotation(damageConfig.diceNotation) && (
                  <div className="cleave-preview">
                    <h4>Cleave Damage Preview</h4>
                    <div className="preview-values">
                      <div className="preview-primary">
                        <span className="preview-label">Primary Target:</span>
                        <span className="preview-value">
                          {getAverageRoll(damageConfig.diceNotation).toFixed(1)}
                        </span>
                      </div>
                      <div className="preview-secondary">
                        <span className="preview-label">Cleave Targets:</span>
                        <span className="preview-value">
                          {(getAverageRoll(damageConfig.diceNotation) * 
                            ((damageConfig.cleaveConfig?.percentage || 50) / 100)).toFixed(1)}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </WizardStepContainer>
  );
};

/**
 * DamageCriticalEffectsPage - Configures critical hit effects
 */
const DamageCriticalEffectsPage = ({ stepId, currentStepId, flow }) => {
  const [state, dispatch] = useEffectWizard();
  const { damageConfig } = state;
  
  const handleCriticalToggle = (useCritical) => {
    dispatch({
      type: 'UPDATE_DAMAGE_CONFIG',
      payload: { useCriticalEffect: useCritical }
    });
  };
  
  const handleCriticalConfigChange = (criticalConfig) => {
    dispatch({
      type: 'UPDATE_DAMAGE_CONFIG',
      payload: { criticalConfig }
    });
  };
  
  return (
    <WizardStepContainer stepId={stepId} currentStepId={currentStepId} flow={flow} state={state}>
      <div className="damage-critical-page wizard-content">
        <div className="section-intro">
          <h2>Critical Hit Effects</h2>
          <p>
            Configure how your effect behaves on critical hits. Critical hits can deal extra damage
            and trigger special effects.
          </p>
        </div>
        
        <div className="critical-toggle">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={damageConfig.useCriticalEffect || false}
              onChange={(e) => handleCriticalToggle(e.target.checked)}
            />
            <span className="toggle-title">Enable Critical Hit Effects</span>
          </label>
        </div>
        
        {damageConfig.useCriticalEffect && (
          <div className="critical-configuration">
            <CriticalEffectConfig
              config={damageConfig.criticalConfig || {
                criticalMultiplier: 2,
                criticalDiceOnly: true,
                extraDice: '',
                effects: []
              }}
              onChange={handleCriticalConfigChange}
            />
            
            {damageConfig.diceNotation && isValidDiceNotation(damageConfig.diceNotation) && (
              <div className="critical-preview">
                <h3>Critical Damage Preview</h3>
                {(() => {
                  try {
                    const critCalc = calculateCriticalDamage(
                      damageConfig.diceNotation,
                      {
                        criticalMultiplier: damageConfig.criticalConfig?.criticalMultiplier || 2,
                        criticalDiceOnly: damageConfig.criticalConfig?.criticalDiceOnly || false,
                        extraDice: damageConfig.criticalConfig?.extraDice || ''
                      }
                    );
                    
                    return (
                      <div className="damage-comparison">
                        <div className="normal-damage">
                          <h4>Normal Hit</h4>
                          <div className="damage-value">{critCalc.normalAverage.toFixed(1)}</div>
                        </div>
                        <div className="critical-damage">
                          <h4>Critical Hit</h4>
                          <div className="damage-value">{critCalc.criticalAverage.toFixed(1)}</div>
                          <div className="damage-increase">
                            +{(critCalc.percentageIncrease).toFixed(0)}%
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
            
            <div className="critical-effects-summary">
              <h3>Selected Critical Effects</h3>
              {damageConfig.criticalConfig?.effects?.length ? (
                <div className="effects-list">
                  {damageConfig.criticalConfig.effects.map(effectId => {
                    const effect = CRITICAL_EFFECT_MODIFIERS.find(e => e.id === effectId);
                    return effect ? (
                      <div key={effectId} className="effect-item">
                        <img 
                          src={getWowIconPath(effect.icon)} 
                          alt={effect.name} 
                          className="effect-icon"
                        />
                        <div className="effect-details">
                          <h4>{effect.name}</h4>
                          <p>{effect.description}</p>
                          <span className="effect-chance">{effect.defaultChance}% chance on critical hit</span>
                        </div>
                      </div>
                    ) : null;
                  })}
                </div>
              ) : (
                <p className="no-effects">No additional critical effects selected.</p>
              )}
            </div>
          </div>
        )}
      </div>
    </WizardStepContainer>
  );
};

/**
 * DamageChainPage - Configures chain damage effects
 */
const DamageChainPage = ({ stepId, currentStepId, flow }) => {
  const [state, dispatch] = useEffectWizard();
  const { damageConfig } = state;
  
  const handleChainToggle = (useChain) => {
    dispatch({
      type: 'UPDATE_DAMAGE_CONFIG',
      payload: { useChainEffect: useChain }
    });
  };
  
  const handleChainConfigChange = (chainConfig) => {
    dispatch({
      type: 'UPDATE_DAMAGE_CONFIG',
      payload: { chainConfig }
    });
  };
  
  return (
    <WizardStepContainer stepId={stepId} currentStepId={currentStepId} flow={flow} state={state}>
      <div className="damage-chain-page wizard-content">
        <div className="section-intro">
          <h2>Chain Damage Effects</h2>
          <p>
            Chain effects allow your damage to jump from the primary target to nearby enemies,
            typically with reduced effectiveness for each jump.
          </p>
        </div>
        
        <div className="chain-toggle">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={damageConfig.useChainEffect || false}
              onChange={(e) => handleChainToggle(e.target.checked)}
            />
            <span className="toggle-title">Enable Chain Damage Effect</span>
          </label>
        </div>
        
        {damageConfig.useChainEffect && (
          <div className="chain-configuration">
            <ChainEffectConfig
              config={damageConfig.chainConfig || {
                targets: 3,
                falloffType: 'percentage',
                falloffRate: 25,
                minimumDamage: null
              }}
              onChange={handleChainConfigChange}
              effectType="damage"
            />
            
            {damageConfig.diceNotation && isValidDiceNotation(damageConfig.diceNotation) && (
              <div className="chain-preview">
                <h3>Chain Damage Preview</h3>
                {(() => {
                  try {
                    const chainCalc = calculateChainedDamage(
                      damageConfig.diceNotation,
                      {
                        targets: damageConfig.chainConfig?.targets || 3,
                        falloffType: damageConfig.chainConfig?.falloffType || 'percentage',
                        falloffRate: damageConfig.chainConfig?.falloffRate || 25,
                        minimumDamage: damageConfig.chainConfig?.minimumDamage
                      }
                    );
                    
                    return (
                      <div className="chain-visualization">
                        <div className="chain-path">
                          {chainCalc.results.map((result, index) => (
                            <React.Fragment key={index}>
                              <div className={`chain-node target-${index}`}>
                                <div className="node-number">{index + 1}</div>
                                <div className="node-damage">
                                  {result.average.toFixed(1)}
                                </div>
                                {index > 0 && (
                                  <div className="damage-reduction">
                                    {(100 - (result.average / chainCalc.results[0].average * 100)).toFixed(0)}% reduced
                                  </div>
                                )}
                              </div>
                              {index < chainCalc.results.length - 1 && (
                                <div className="chain-connector">
                                  <svg height="30" width="60">
                                    <path d="M0,15 C20,5 40,25 60,15" stroke="#88aaff" strokeWidth="2" fill="none" />
                                  </svg>
                                </div>
                              )}
                            </React.Fragment>
                          ))}
                        </div>
                        
                        <div className="chain-total">
                          <div className="total-label">Total Average Damage:</div>
                          <div className="total-value">{chainCalc.totalAverage.toFixed(1)}</div>
                          <div className="total-comparison">
                            vs. {getAverageRoll(damageConfig.diceNotation).toFixed(1)} single target
                            ({((chainCalc.totalAverage / getAverageRoll(damageConfig.diceNotation) - 1) * 100).toFixed(0)}% increase)
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
            
            <div className="chain-examples">
              <h3>Chain Effect Examples</h3>
              <div className="example-item">
                <strong>Chain Lightning:</strong> Deals 8d6 lightning damage to the primary target, chaining to 3 nearby enemies with 25% reduced damage per jump.
              </div>
              <div className="example-item">
                <strong>Arcane Barrage:</strong> Deals 6d4+10 force damage, potentially chaining to 5 nearby enemies with a fixed 5 damage reduction per jump.
              </div>
              <div className="example-item">
                <strong>Bouncing Flame:</strong> A 4d10 fire damage attack that chains with dice reduction, losing 1d10 per jump but maintaining a minimum of 1d10.
              </div>
            </div>
          </div>
        )}
      </div>
    </WizardStepContainer>
  );
};

export {
  DamageTypeSelectionPage,
  DamageAmountPage,
  DamageEnhancementsPage,
  DamageCriticalEffectsPage,
  DamageChainPage
};