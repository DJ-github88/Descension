import React, { useState, useEffect } from 'react';
import { 
  WizardStepContainer,
  DiceCalculator
} from './EffectWizardComponents';

import {
  DURATION_TYPES,
  EFFECT_TYPES,
  DAMAGE_TYPES,
  POSITIVE_STATUS_EFFECTS,
  NEGATIVE_STATUS_EFFECTS,
  ABSORPTION_SHIELD_TYPES,
  getWowIconPath
} from './effectSystemData';

import { useEffectWizardState, useEffectWizardDispatch } from './EffectWizardContext';
import { isValidDiceNotation, getAverageRoll, getMinRoll, getMaxRoll } from './DiceRules';

/**
 * PersistentEffectsPage - Component for configuring over-time effects
 */
export const PersistentEffectsPage = ({ stepId, currentStepId }) => {
  const state = useEffectWizardState();
  const dispatch = useEffectWizardDispatch();
  const [errors, setErrors] = useState({});
  
  // Determine which persistent types are available based on selected effect types
  const availablePersistentTypes = [];
  
  if (state.effectTypes.includes('damage')) {
    availablePersistentTypes.push({
      id: 'dot',
      name: 'Damage Over Time',
      description: 'Deal damage periodically over the duration',
      icon: 'spell_fire_immolation'
    });
  }
  
  if (state.effectTypes.includes('healing')) {
    availablePersistentTypes.push({
      id: 'hot',
      name: 'Healing Over Time',
      description: 'Restore health periodically over the duration',
      icon: 'spell_nature_rejuvenation'
    });
  }
  
  // Add universal persistent types
  availablePersistentTypes.push(
    {
      id: 'effect',
      name: 'Recurring Effect',
      description: 'Apply effects periodically over the duration',
      icon: 'spell_holy_innerfire'
    },
    {
      id: 'trigger',
      name: 'Triggered Effect',
      description: 'Effect activates when specific conditions are met',
      icon: 'spell_fire_volcano'
    }
  );
  
  // Frequency options
  const tickFrequencies = [
    {
      id: 'start_of_turn',
      name: 'Start of Turn',
      description: 'Effect occurs at the start of each of the target\'s turns'
    },
    {
      id: 'end_of_turn',
      name: 'End of Turn',
      description: 'Effect occurs at the end of each of the target\'s turns'
    },
    {
      id: 'start_of_round',
      name: 'Start of Round',
      description: 'Effect occurs at the start of each round'
    },
    {
      id: 'every_6_seconds',
      name: 'Every 6 Seconds',
      description: 'Effect occurs every 6 seconds (once per round)'
    }
  ];
  
  // Scaling options
  const scalingTypes = [
    {
      id: 'flat',
      name: 'Flat',
      description: 'Effect remains constant over time',
      icon: 'spell_holy_wordfortitude'
    },
    {
      id: 'increasing',
      name: 'Increasing',
      description: 'Effect grows stronger over time',
      icon: 'spell_shadow_unholyfrenzy'
    },
    {
      id: 'decreasing',
      name: 'Decreasing',
      description: 'Effect becomes weaker over time',
      icon: 'spell_shadow_lifedrain'
    },
    {
      id: 'frontloaded',
      name: 'Front-loaded',
      description: 'Effect starts strong and gradually weakens',
      icon: 'spell_fire_flamebolt'
    },
    {
      id: 'backloaded',
      name: 'Back-loaded',
      description: 'Effect starts weak and gradually strengthens',
      icon: 'spell_arcane_blast'
    }
  ];
  
  // Trigger conditions (for "trigger" persistent type)
  const triggerConditions = [
    {
      id: 'proximity',
      name: 'Proximity',
      description: 'Triggers when creatures move nearby'
    },
    {
      id: 'damage_taken',
      name: 'Damage Taken',
      description: 'Triggers when target takes damage'
    },
    {
      id: 'spell_cast',
      name: 'Spell Cast',
      description: 'Triggers when a spell is cast nearby'
    },
    {
      id: 'movement',
      name: 'Movement',
      description: 'Triggers when target moves'
    }
  ];
  
  // Handler functions
  const handleTogglePersistent = (isPersistent) => {
    dispatch({
      type: 'UPDATE_PERSISTENT_CONFIG',
      payload: { isPersistent }
    });
  };
  
  const handlePersistentTypeChange = (persistentType) => {
    dispatch({
      type: 'UPDATE_PERSISTENT_CONFIG',
      payload: { 
        persistentType,
        // Reset conditional fields based on type
        triggerCondition: persistentType === 'trigger' ? state.persistentConfig.triggerCondition : null,
        scalingType: ['dot', 'hot'].includes(persistentType) ? state.persistentConfig.scalingType : null
      }
    });
  };
  
  const handleTickFrequencyChange = (tickFrequency) => {
    dispatch({
      type: 'UPDATE_PERSISTENT_CONFIG',
      payload: { tickFrequency }
    });
  };
  
  const handleTickDurationChange = (value) => {
    const tickDuration = value === '' ? '' : (parseInt(value, 10) || 0);
    dispatch({
      type: 'UPDATE_PERSISTENT_CONFIG',
      payload: { tickDuration }
    });
  };
  
  const handleScalingTypeChange = (scalingType) => {
    dispatch({
      type: 'UPDATE_PERSISTENT_CONFIG',
      payload: { scalingType }
    });
  };
  
  const handleTriggerConditionChange = (triggerCondition) => {
    dispatch({
      type: 'UPDATE_PERSISTENT_CONFIG',
      payload: { triggerCondition }
    });
  };
  
  // Validate configuration
  const validatePersistentConfig = () => {
    const newErrors = {};
    
    if (state.persistentConfig.isPersistent) {
      if (!state.persistentConfig.persistentType) {
        newErrors.persistentType = 'Please select a persistent effect type';
      }
      
      if (!state.persistentConfig.tickFrequency && state.persistentConfig.persistentType !== 'trigger') {
        newErrors.tickFrequency = 'Please select a tick frequency';
      }
      
      if (['dot', 'hot'].includes(state.persistentConfig.persistentType) && !state.persistentConfig.scalingType) {
        newErrors.scalingType = 'Please select a scaling type';
      }
      
      if (state.persistentConfig.persistentType === 'trigger' && !state.persistentConfig.triggerCondition) {
        newErrors.triggerCondition = 'Please select a trigger condition';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Validate on config change
  useEffect(() => {
    validatePersistentConfig();
  }, [state.persistentConfig]);
  
  return (
    <WizardStepContainer
      stepId={stepId}
      currentStepId={currentStepId}
      flow={state.wizardFlow}
      state={state}
    >
      <div className="persistent-effects-page">
        <div className="page-introduction">
          <h3>Persistent Effects</h3>
          <p>Configure how your effect persists over time. Persistent effects can deal damage, heal, or apply other effects over multiple rounds.</p>
        </div>
        
        <div className="persistent-toggle-section">
          <div className="toggle-control">
            <label className="switch">
              <input 
                type="checkbox" 
                checked={state.persistentConfig.isPersistent || false} 
                onChange={(e) => handleTogglePersistent(e.target.checked)} 
              />
              <span className="slider"></span>
            </label>
            <span className="toggle-label">Enable Persistent Effect</span>
          </div>
          
          <div className="toggle-description">
            {state.persistentConfig.isPersistent ? 
              <p>This effect will continue over time rather than applying just once.</p> :
              <p>Persistent effects are useful for damage/healing over time, lingering buffs/debuffs, or area control.</p>
            }
          </div>
        </div>
        
        {state.persistentConfig.isPersistent && (
          <>
            <div className="persistent-type-section">
              <h4>Persistent Effect Type</h4>
              <div className="persistent-type-options">
                {availablePersistentTypes.map(type => (
                  <div 
                    key={type.id}
                    className={`persistent-type-option ${state.persistentConfig.persistentType === type.id ? 'selected' : ''}`}
                    onClick={() => handlePersistentTypeChange(type.id)}
                  >
                    <div className="persistent-type-icon">
                      <img src={getWowIconPath(type.icon)} alt={type.name} />
                    </div>
                    <div className="persistent-type-info">
                      <h5>{type.name}</h5>
                      <p>{type.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              {errors.persistentType && (
                <div className="error-message">{errors.persistentType}</div>
              )}
            </div>
            
            {state.persistentConfig.persistentType && state.persistentConfig.persistentType !== 'trigger' && (
              <div className="tick-configuration">
                <div className="tick-frequency">
                  <h4>Effect Frequency</h4>
                  <p className="section-hint">When does the effect activate during its duration?</p>
                  <div className="frequency-options">
                    {tickFrequencies.map(freq => (
                      <div 
                        key={freq.id}
                        className={`frequency-option ${state.persistentConfig.tickFrequency === freq.id ? 'selected' : ''}`}
                        onClick={() => handleTickFrequencyChange(freq.id)}
                      >
                        <h5>{freq.name}</h5>
                        <p>{freq.description}</p>
                      </div>
                    ))}
                  </div>
                  {errors.tickFrequency && (
                    <div className="error-message">{errors.tickFrequency}</div>
                  )}
                </div>
                
                <div className="tick-duration">
                  <h4>Number of Occurrences</h4>
                  <p className="section-hint">How many times will the effect trigger? (Leave at 0 for duration of the effect)</p>
                  <div className="duration-input">
                    <input 
                      type="number" 
                      min="0" 
                      max="20"
                      value={state.persistentConfig.tickDuration ?? ''} 
                      onChange={(e) => handleTickDurationChange(e.target.value)} 
                      placeholder="Number of ticks"
                    />
                    <span className="input-suffix">ticks</span>
                  </div>
                  <div className="common-values">
                    <span>Common values:</span>
                    <button onClick={() => handleTickDurationChange(0)}>Full Duration</button>
                    <button onClick={() => handleTickDurationChange(3)}>3 Ticks</button>
                    <button onClick={() => handleTickDurationChange(5)}>5 Ticks</button>
                    <button onClick={() => handleTickDurationChange(10)}>10 Ticks</button>
                  </div>
                </div>
              </div>
            )}
            
            {['dot', 'hot'].includes(state.persistentConfig.persistentType) && (
              <div className="scaling-configuration">
                <h4>Effect Scaling</h4>
                <p className="section-hint">How does the effect's power change over time?</p>
                <div className="scaling-options">
                  {scalingTypes.map(type => (
                    <div 
                      key={type.id}
                      className={`scaling-option ${state.persistentConfig.scalingType === type.id ? 'selected' : ''}`}
                      onClick={() => handleScalingTypeChange(type.id)}
                    >
                      <div className="scaling-icon">
                        <img src={getWowIconPath(type.icon)} alt={type.name} />
                      </div>
                      <div className="scaling-info">
                        <h5>{type.name}</h5>
                        <p>{type.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.scalingType && (
                  <div className="error-message">{errors.scalingType}</div>
                )}
                
                {state.persistentConfig.scalingType && (
                  <div className="scaling-preview">
                    <h5>Scaling Preview</h5>
                    <div className="scaling-graph">
                      {Array.from({ length: 5 }, (_, i) => {
                        let heightPercentage;
                        switch(state.persistentConfig.scalingType) {
                          case 'increasing':
                            heightPercentage = 40 + (i * 15);
                            break;
                          case 'decreasing':
                            heightPercentage = 85 - (i * 15);
                            break;
                          case 'frontloaded':
                            heightPercentage = 85 - (i * 10);
                            break;
                          case 'backloaded':
                            heightPercentage = 40 + (i * 10);
                            break;
                          default: // flat
                            heightPercentage = 60;
                        }
                        
                        return (
                          <div key={i} className="graph-bar">
                            <div 
                              className="bar-fill" 
                              style={{ height: `${heightPercentage}%` }}
                            />
                            <div className="tick-label">Tick {i + 1}</div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="scaling-explanation">
                      {getScalingExplanation(state.persistentConfig.scalingType, state.persistentConfig.persistentType)}
                    </div>
                  </div>
                )}
              </div>
            )}
            
            {state.persistentConfig.persistentType === 'trigger' && (
              <div className="trigger-configuration">
                <h4>Trigger Condition</h4>
                <p className="section-hint">What causes the effect to activate?</p>
                <div className="trigger-options">
                  {triggerConditions.map(condition => (
                    <div 
                      key={condition.id}
                      className={`trigger-option ${state.persistentConfig.triggerCondition === condition.id ? 'selected' : ''}`}
                      onClick={() => handleTriggerConditionChange(condition.id)}
                    >
                      <h5>{condition.name}</h5>
                      <p>{condition.description}</p>
                    </div>
                  ))}
                </div>
                {errors.triggerCondition && (
                  <div className="error-message">{errors.triggerCondition}</div>
                )}
                
                {state.persistentConfig.triggerCondition && (
                  <div className="trigger-example">
                    <h5>Example Use Case</h5>
                    <p>{getTriggerExample(state.persistentConfig.triggerCondition)}</p>
                  </div>
                )}
              </div>
            )}
            
            <div className="persistent-tips">
              <h4>Tips for Persistent Effects</h4>
              <ul>
                <li><strong>Damage Over Time</strong> is great against high-health targets and to maintain concentration effects</li>
                <li><strong>Healing Over Time</strong> is efficient for point conservation over multiple rounds</li>
                <li><strong>Triggered Effects</strong> are excellent for area control and creating zones enemies avoid</li>
                <li><strong>Concentration</strong> is often required for the strongest persistent effects</li>
                <li><strong>Scaling</strong> can create tactical decisions about when effects are most valuable</li>
              </ul>
            </div>
          </>
        )}
      </div>
    </WizardStepContainer>
  );
};

/**
 * DurationSettingsPage - Component for configuring effect duration
 */
export const DurationSettingsPage = ({ stepId, currentStepId }) => {
  const state = useEffectWizardState();
  const dispatch = useEffectWizardDispatch();
  const [errors, setErrors] = useState({});
  
  // Handler functions
  const handleDurationTypeChange = (durationType) => {
    // Reset duration value for instant effects
    const durationValue = durationType === 'instant' ? 0 : state.durationConfig.durationValue || 1;
    
    dispatch({
      type: 'UPDATE_DURATION_CONFIG',
      payload: { 
        durationType,
        durationValue
      }
    });
  };
  
  const handleDurationValueChange = (value) => {
    const durationValue = value === '' ? '' : parseInt(value, 10);
    dispatch({
      type: 'UPDATE_DURATION_CONFIG',
      payload: { durationValue: isNaN(durationValue) ? 0 : durationValue }
    });
  };
  
  const handleConcentrationToggle = (requiresConcentration) => {
    dispatch({
      type: 'UPDATE_DURATION_CONFIG',
      payload: { requiresConcentration }
    });
  };
  
  // Get recommendations based on effect types
  const getDurationRecommendation = () => {
    if (state.effectTypes.includes('damage') && state.effectTypes.length === 1) {
      return "For direct damage effects, 'Instant' duration is typical.";
    }
    
    if (state.effectTypes.includes('healing') && state.effectTypes.length === 1) {
      return "For direct healing, 'Instant' duration is common, while healing over time would use 'Rounds'.";
    }
    
    if (state.effectTypes.includes('buff')) {
      return "Buffs typically last for 'Minutes' or 'Rounds' depending on their power level.";
    }
    
    if (state.effectTypes.includes('debuff')) {
      return "Debuffs often use 'Rounds' duration with 'Concentration' for balance.";
    }
    
    if (state.effectTypes.includes('control')) {
      return "Control effects frequently require 'Concentration' and last for 'Rounds'.";
    }
    
    return "Choose a duration appropriate to your effect's purpose and power level.";
  };
  
  // Validate configuration
  const validateDurationConfig = () => {
    const newErrors = {};
    
    if (!state.durationConfig.durationType) {
      newErrors.durationType = 'Please select a duration type';
    }
    
    if (state.durationConfig.durationType !== 'instant' && 
        (state.durationConfig.durationValue === undefined || state.durationConfig.durationValue < 1)) {
      newErrors.durationValue = 'Please enter a valid duration value (at least 1)';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Validate on config change
  useEffect(() => {
    validateDurationConfig();
  }, [state.durationConfig]);
  
  // Get AP cost modifier for selected duration
  const getAPCostModifier = () => {
    const durationType = DURATION_TYPES.find(d => d.id === state.durationConfig.durationType);
    return durationType ? durationType.actionPointModifier : 0;
  };
  
  return (
    <WizardStepContainer
      stepId={stepId}
      currentStepId={currentStepId}
      flow={state.wizardFlow}
      state={state}
    >
      <div className="duration-settings-page">
        <div className="page-introduction">
          <h3>Duration Settings</h3>
          <p>Configure how long your effect lasts. Duration significantly impacts an effect's power and action point cost.</p>
          <div className="recommendation-box">
            <h4>Recommendation</h4>
            <p>{getDurationRecommendation()}</p>
          </div>
        </div>
        
        <div className="duration-type-section">
          <h4>Duration Type</h4>
          <div className="duration-type-options">
            {DURATION_TYPES.map(type => (
              <div 
                key={type.id}
                className={`duration-type-option ${state.durationConfig.durationType === type.id ? 'selected' : ''}`}
                onClick={() => handleDurationTypeChange(type.id)}
              >
                <div className="duration-icon">
                  <img src={getWowIconPath(type.icon)} alt={type.name} />
                </div>
                <div className="duration-info">
                  <h5>{type.name}</h5>
                  <p>{type.description}</p>
                  <span className="ap-modifier">
                    AP Cost: {type.actionPointModifier >= 0 ? '+' : ''}{type.actionPointModifier}
                  </span>
                </div>
              </div>
            ))}
          </div>
          {errors.durationType && (
            <div className="error-message">{errors.durationType}</div>
          )}
        </div>
        
        {state.durationConfig.durationType && state.durationConfig.durationType !== 'instant' && (
          <div className="duration-value-section">
            <h4>Duration Value</h4>
            <p className="section-hint">How long does the effect last?</p>
            
            <div className="duration-input">
              <input 
                type="number" 
                min="1" 
                value={state.durationConfig.durationValue ?? ''} 
                onChange={(e) => handleDurationValueChange(e.target.value)} 
                placeholder={`Number of ${state.durationConfig.durationType}`}
              />
              <span className="input-suffix">{state.durationConfig.durationType}</span>
            </div>
            
            <div className="common-values">
              <span>Common values:</span>
              <button onClick={() => handleDurationValueChange(1)}>1</button>
              <button onClick={() => handleDurationValueChange(5)}>5</button>
              <button onClick={() => handleDurationValueChange(10)}>10</button>
              <button onClick={() => handleDurationValueChange(state.durationConfig.durationType === 'minutes' ? 60 : 30)}>
                {state.durationConfig.durationType === 'minutes' ? '1 Hour' : '30'}
              </button>
            </div>
            
            {errors.durationValue && (
              <div className="error-message">{errors.durationValue}</div>
            )}
          </div>
        )}
        
        {state.durationConfig.durationType !== 'instant' && 
         state.durationConfig.durationType !== 'permanent' && (
          <div className="concentration-section">
            <h4>Concentration</h4>
            <div className="concentration-toggle">
              <label className="switch">
                <input 
                  type="checkbox" 
                  checked={state.durationConfig.requiresConcentration || false} 
                  onChange={(e) => handleConcentrationToggle(e.target.checked)} 
                />
                <span className="slider"></span>
              </label>
              <span className="toggle-label">Requires Concentration</span>
            </div>
            
            <div className="concentration-description">
              <p>
                Concentration effects end if the caster casts another concentration spell,
                takes damage and fails a saving throw, or becomes incapacitated.
              </p>
              <p>
                <strong>Note:</strong> Concentration enables more powerful effects by balancing them 
                with the limitation of only maintaining one such effect at a time.
              </p>
            </div>
          </div>
        )}
        
        <div className="duration-summary">
          <h4>Duration Summary</h4>
          <div className="summary-card">
            <p>
              {state.durationConfig.durationType === 'instant' ? (
                <span>Effect occurs once and immediately</span>
              ) : (
                <span>
                  Effect lasts for {state.durationConfig.durationValue || 0} {state.durationConfig.durationType}
                  {state.durationConfig.requiresConcentration ? ' and requires concentration' : ''}
                </span>
              )}
            </p>
            <p className="cost-impact">
              Action Point Cost Modifier: {getAPCostModifier() >= 0 ? '+' : ''}{getAPCostModifier()}
            </p>
          </div>
        </div>
        
        <div className="duration-examples">
          <h4>Common Duration Patterns</h4>
          <div className="examples-grid">
            <div className="example-card">
              <h5>Combat Buff</h5>
              <p>Rounds: 10</p>
              <p>Concentration: No</p>
              <p className="example-description">Short-term effect lasting one combat encounter</p>
            </div>
            <div className="example-card">
              <h5>Powerful Control</h5>
              <p>Rounds: 5</p>
              <p>Concentration: Yes</p>
              <p className="example-description">Potent effect balanced by concentration requirement</p>
            </div>
            <div className="example-card">
              <h5>Utility Effect</h5>
              <p>Minutes: 10</p>
              <p>Concentration: No</p>
              <p className="example-description">Longer-term effect useful outside of combat</p>
            </div>
            <div className="example-card">
              <h5>Damaging Spell</h5>
              <p>Instant</p>
              <p>Concentration: No</p>
              <p className="example-description">Immediate damage with no lingering effect</p>
            </div>
          </div>
        </div>
      </div>
    </WizardStepContainer>
  );
};

/**
 * ReviewEffectPage - Component for reviewing all configurations
 */
export const ReviewEffectPage = ({ stepId, currentStepId }) => {
  const state = useEffectWizardState();
  
  // Calculate total AP cost
  const getTotalAPCost = () => {
    let cost = 0;
    
    // Base cost from effect types
    state.effectTypes.forEach(effectType => {
      const effect = EFFECT_TYPES.find(e => e.id === effectType);
      if (effect) cost += effect.actionPointCost;
    });
    
    // Cost from duration
    const durationType = DURATION_TYPES.find(d => d.id === state.durationConfig.durationType);
    if (durationType) cost += durationType.actionPointModifier;
    
    // Additional costs from persistent effects
    if (state.persistentConfig.isPersistent) {
      cost += 1;
    }
    
    return Math.max(1, cost); // Minimum 1 AP
  };
  
  return (
    <WizardStepContainer
      stepId={stepId}
      currentStepId={currentStepId}
      flow={state.wizardFlow}
      state={state}
    >
      <div className="review-effect-page">
        <div className="page-introduction">
          <h3>Review Effect</h3>
          <p>Review your complete effect configuration before finalizing.</p>
        </div>
        
        <div className="effect-summary">
          <div className="summary-header">
            <h4>Effect Overview</h4>
            <div className="ap-cost">
              <span className="ap-label">Total Cost:</span>
              <span className="ap-value">{getTotalAPCost()} AP</span>
            </div>
          </div>
          
          <div className="effect-types-summary">
            <h5>Selected Effect Types</h5>
            <div className="effect-types-grid">
              {state.effectTypes.map(effectTypeId => {
                const effectType = EFFECT_TYPES.find(e => e.id === effectTypeId);
                if (!effectType) return null;
                
                return (
                  <div key={effectTypeId} className="effect-type-card">
                    <div className="effect-icon">
                      <img src={getWowIconPath(effectType.icon)} alt={effectType.name} />
                    </div>
                    <div className="effect-info">
                      <h6>{effectType.name}</h6>
                      <p>{effectType.description}</p>
                      <span className="effect-ap">AP Cost: {effectType.actionPointCost}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          
          {/* Damage Configuration Summary */}
          {state.effectTypes.includes('damage') && (
            <div className="section-summary damage-summary">
              <h5>Damage Configuration</h5>
              <div className="summary-content">
                <div className="dice-section">
                  <h6>Damage Formula</h6>
                  <div className="dice-formula">
                    <span className="dice-notation">{state.damageConfig.diceNotation}</span>
                    <span className="dice-average">
                      (Average: {isValidDiceNotation(state.damageConfig.diceNotation) ? 
                        getAverageRoll(state.damageConfig.diceNotation).toFixed(1) : 'N/A'})
                    </span>
                  </div>
                </div>
                
                <div className="damage-types">
                  <h6>Damage Types</h6>
                  <div className="types-grid">
                    {state.damageConfig.damageTypes.map(damageTypeId => {
                      const damageType = DAMAGE_TYPES.find(t => t.id === damageTypeId);
                      if (!damageType) return null;
                      
                      return (
                        <div key={damageTypeId} className="damage-type-tag">
                          <img 
                            src={getWowIconPath(damageType.icon)} 
                            alt={damageType.name} 
                            className="type-icon" 
                          />
                          <span>{damageType.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
                
                {state.damageConfig.useChainEffect && (
                  <div className="chain-effect">
                    <h6>Chain Effect</h6>
                    <p>
                      Chains to {state.damageConfig.chainConfig.targets} targets, 
                      with {state.damageConfig.chainConfig.falloffRate}% reduction per jump
                      {state.damageConfig.chainConfig.minimumDamage ? 
                        `, minimum ${state.damageConfig.chainConfig.minimumDamage} damage` : ''}
                    </p>
                  </div>
                )}
                
                {state.damageConfig.useCriticalEffect && (
                  <div className="critical-effect">
                    <h6>Critical Hit Effect</h6>
                    <p>
                      {state.damageConfig.criticalConfig.criticalMultiplier}× damage 
                      {state.damageConfig.criticalConfig.extraDice ? 
                        ` plus ${state.damageConfig.criticalConfig.extraDice}` : ''}
                      {state.damageConfig.criticalConfig.effects.length > 0 ? 
                        `, with ${state.damageConfig.criticalConfig.effects.length} special effects` : ''}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Healing Configuration Summary */}
          {state.effectTypes.includes('healing') && (
            <div className="section-summary healing-summary">
              <h5>Healing Configuration</h5>
              <div className="summary-content">
                <div className="dice-section">
                  <h6>Healing Formula</h6>
                  <div className="dice-formula">
                    <span className="dice-notation">{state.healingConfig.diceNotation}</span>
                    <span className="dice-average">
                      (Average: {isValidDiceNotation(state.healingConfig.diceNotation) ? 
                        getAverageRoll(state.healingConfig.diceNotation).toFixed(1) : 'N/A'})
                    </span>
                  </div>
                </div>
                
                <div className="healing-type">
                  <h6>Healing Type</h6>
                  <p>{formatHealingType(state.healingConfig.healingType)}</p>
                </div>
                
                {state.healingConfig.useAbsorptionShield && (
                  <div className="shield-effect">
                    <h6>Absorption Shield</h6>
                    <div className="shield-details">
                      <p>
                        {getShieldTypeName(state.healingConfig.shieldConfig.shieldType)} - 
                        {state.healingConfig.shieldConfig.shieldAmount}
                        {' '}
                        (Average: {isValidDiceNotation(state.healingConfig.shieldConfig.shieldAmount) ? 
                          getAverageRoll(state.healingConfig.shieldConfig.shieldAmount).toFixed(1) : 'N/A'})
                      </p>
                      
                      {state.healingConfig.shieldConfig.reflectionType && (
                        <p>
                          Reflects damage: {state.healingConfig.shieldConfig.reflectionAmount}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Buff Configuration Summary */}
          {state.effectTypes.includes('buff') && (
            <div className="section-summary buff-summary">
              <h5>Buff Configuration</h5>
              <div className="summary-content">
                {Object.keys(state.buffConfig.statModifiers || {}).length > 0 && (
                  <div className="stat-modifiers">
                    <h6>Stat Modifications</h6>
                    <ul className="modifier-list">
                      {Object.entries(state.buffConfig.statModifiers).map(([statId, value]) => {
                        // Find stat name from the available stat modifiers
                        const statName = findStatName(statId);
                        return (
                          <li key={statId}>
                            {statName}: {value > 0 ? '+' : ''}{value}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                
                {(state.buffConfig.statusEffects || []).length > 0 && (
                  <div className="status-effects">
                    <h6>Status Effects</h6>
                    <div className="effects-grid">
                      {state.buffConfig.statusEffects.map(effectId => {
                        const effect = POSITIVE_STATUS_EFFECTS.find(e => e.id === effectId);
                        if (!effect) return null;
                        
                        return (
                          <div key={effectId} className="effect-tag">
                            <img 
                              src={getWowIconPath(effect.icon)} 
                              alt={effect.name} 
                              className="effect-icon" 
                            />
                            <span>{effect.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Debuff Configuration Summary */}
          {state.effectTypes.includes('debuff') && (
            <div className="section-summary debuff-summary">
              <h5>Debuff Configuration</h5>
              <div className="summary-content">
                {Object.keys(state.debuffConfig.statModifiers || {}).length > 0 && (
                  <div className="stat-modifiers">
                    <h6>Stat Penalties</h6>
                    <ul className="modifier-list">
                      {Object.entries(state.debuffConfig.statModifiers).map(([statId, value]) => {
                        // Find stat name from the available stat modifiers
                        const statName = findStatName(statId);
                        return (
                          <li key={statId}>
                            {statName}: {value > 0 ? '+' : ''}{value}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                
                {(state.debuffConfig.statusEffects || []).length > 0 && (
                  <div className="status-effects">
                    <h6>Status Effects</h6>
                    <div className="effects-grid">
                      {state.debuffConfig.statusEffects.map(effectId => {
                        const effect = NEGATIVE_STATUS_EFFECTS.find(e => e.id === effectId);
                        if (!effect) return null;
                        
                        return (
                          <div key={effectId} className="effect-tag">
                            <img 
                              src={getWowIconPath(effect.icon)} 
                              alt={effect.name} 
                              className="effect-icon" 
                            />
                            <span>{effect.name}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Utility Configuration Summary */}
          {state.effectTypes.includes('utility') && state.utilityConfig && state.utilityConfig.utilityType && (
            <div className="section-summary utility-summary">
              <h5>Utility Configuration</h5>
              <div className="summary-content">
                <div className="utility-type">
                  <h6>Effect Type</h6>
                  <p>{getUtilityTypeName(state.utilityConfig.utilityType, state.utilityConfig.utilitySubtype)}</p>
                </div>
                
                {state.utilityConfig.parameters && Object.keys(state.utilityConfig.parameters).length > 0 && (
                  <div className="utility-parameters">
                    <h6>Parameters</h6>
                    <ul className="parameter-list">
                      {Object.entries(state.utilityConfig.parameters).map(([paramName, value]) => (
                        <li key={paramName}>
                          {formatParamName(paramName)}: {
                            typeof value === 'boolean' 
                              ? (value ? 'Yes' : 'No') 
                              : value
                          }
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Duration Configuration Summary */}
          <div className="section-summary duration-summary">
            <h5>Duration Configuration</h5>
            <div className="summary-content">
              <div className="duration-type">
                <h6>Duration Type</h6>
                {state.durationConfig.durationType ? (
                  <p>
                    {getDurationTypeName(state.durationConfig.durationType)}
                    {state.durationConfig.durationType !== 'instant' ? 
                      ` (${state.durationConfig.durationValue} ${state.durationConfig.durationType})` : ''}
                  </p>
                ) : (
                  <p>Not configured</p>
                )}
              </div>
              
              {state.durationConfig.requiresConcentration && (
                <div className="concentration">
                  <h6>Concentration</h6>
                  <p>This effect requires concentration to maintain</p>
                </div>
              )}
              
              <div className="ap-impact">
                <h6>Action Point Impact</h6>
                <p>
                  {getDurationAPImpact(state.durationConfig.durationType)}
                </p>
              </div>
            </div>
          </div>
          
          {/* Persistent Effect Summary */}
          {state.persistentConfig.isPersistent && (
            <div className="section-summary persistent-summary">
              <h5>Persistent Effect Configuration</h5>
              <div className="summary-content">
                <div className="persistent-type">
                  <h6>Effect Type</h6>
                  <p>{getPersistentTypeName(state.persistentConfig.persistentType)}</p>
                </div>
                
                {state.persistentConfig.persistentType !== 'trigger' && (
                  <>
                    <div className="tick-frequency">
                      <h6>Frequency</h6>
                      <p>{getTickFrequencyName(state.persistentConfig.tickFrequency)}</p>
                    </div>
                    
                    <div className="tick-duration">
                      <h6>Duration</h6>
                      <p>
                        {state.persistentConfig.tickDuration ? 
                          `${state.persistentConfig.tickDuration} ticks` : 
                          'Full duration of effect'}
                      </p>
                    </div>
                  </>
                )}
                
                {['dot', 'hot'].includes(state.persistentConfig.persistentType) && (
                  <div className="scaling-type">
                    <h6>Scaling</h6>
                    <p>{getScalingTypeName(state.persistentConfig.scalingType)}</p>
                  </div>
                )}
                
                {state.persistentConfig.persistentType === 'trigger' && (
                  <div className="trigger-condition">
                    <h6>Trigger Condition</h6>
                    <p>{getTriggerConditionName(state.persistentConfig.triggerCondition)}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="final-checks">
          <h4>Final Checks</h4>
          <div className="checks-grid">
            <div className="check-item">
              <h6>Legibility</h6>
              <p>Are your effect intentions clear and easy to understand?</p>
            </div>
            <div className="check-item">
              <h6>Balance</h6>
              <p>Is the effect appropriately powerful for its action point cost?</p>
            </div>
            <div className="check-item">
              <h6>Completeness</h6>
              <p>Have you configured all necessary aspects of your effect?</p>
            </div>
            <div className="check-item">
              <h6>Mechanics</h6>
              <p>Do the mechanics work together in a coherent way?</p>
            </div>
          </div>
        </div>
      </div>
    </WizardStepContainer>
  );
};

// ========== Helper Functions ==========

// Get scaling explanation based on type
function getScalingExplanation(scalingType, persistentType) {
  if (!scalingType) return '';
  
  const effectType = persistentType === 'dot' ? 'damage' : 'healing';
  
  const explanations = {
    flat: `The ${effectType} remains consistent for the entire duration.`,
    increasing: `The ${effectType} starts low and increases with each tick, making it more effective over time.`,
    decreasing: `The ${effectType} starts high and decreases with each tick, making it most effective immediately.`,
    frontloaded: `The ${effectType} begins very powerful and tapers off quickly, ideal for initial impact.`,
    backloaded: `The ${effectType} builds gradually, reaching maximum power at the end of its duration.`
  };
  
  return explanations[scalingType] || '';
}

// Get trigger example based on condition
function getTriggerExample(triggerCondition) {
  if (!triggerCondition) return '';
  
  const examples = {
    proximity: 'A fire rune that explodes when enemies step on it or nearby.',
    damage_taken: 'A thorns effect that retaliates when the target is hit.',
    spell_cast: 'A counterspell trap that activates when magic is used nearby.',
    movement: 'A trigger that activates when the affected target tries to move.'
  };
  
  return examples[triggerCondition] || '';
}

// Format parameter name for display
function formatParamName(name) {
  return name
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .replace(/_/g, ' ');
}

// Find stat name from ID
function findStatName(statId) {
  // Search through all stat types
  const allStats = [
    ...PRIMARY_STAT_MODIFIERS, 
    ...SECONDARY_STAT_MODIFIERS, 
    ...COMBAT_STAT_MODIFIERS
  ];
  
  const stat = allStats.find(s => s.id === statId);
  return stat ? stat.name : statId;
}

// Get utility type name
function getUtilityTypeName(typeId, subtypeId) {
  const type = typeId ? UTILITY_EFFECT_TYPES.find(t => t.id === typeId) : null;
  if (!type) return 'Not configured';
  
  if (!subtypeId) return type.name;
  
  const subtype = type.subtypes.find(s => s.id === subtypeId);
  if (!subtype) return type.name;
  
  return `${type.name}: ${subtype.name}`;
}

// Get duration type name
function getDurationTypeName(durationTypeId) {
  const durationType = DURATION_TYPES.find(d => d.id === durationTypeId);
  return durationType ? durationType.name : 'Not configured';
}

// Get duration AP impact description
function getDurationAPImpact(durationTypeId) {
  const durationType = DURATION_TYPES.find(d => d.id === durationTypeId);
  if (!durationType) return 'No impact';
  
  return `${durationType.actionPointModifier >= 0 ? '+' : ''}${durationType.actionPointModifier} Action Points`;
}

// Get persistent type name
function getPersistentTypeName(persistentTypeId) {
  if (!persistentTypeId) return 'Not configured';
  
  const typeNames = {
    dot: 'Damage Over Time',
    hot: 'Healing Over Time',
    effect: 'Recurring Effect',
    trigger: 'Triggered Effect'
  };
  
  return typeNames[persistentTypeId] || persistentTypeId;
}

// Get tick frequency name
function getTickFrequencyName(tickFrequencyId) {
  if (!tickFrequencyId) return 'Not configured';
  
  const frequencyNames = {
    start_of_turn: 'Start of Turn',
    end_of_turn: 'End of Turn',
    start_of_round: 'Start of Round',
    every_6_seconds: 'Every 6 Seconds'
  };
  
  return frequencyNames[tickFrequencyId] || tickFrequencyId;
}

// Get scaling type name
function getScalingTypeName(scalingTypeId) {
  if (!scalingTypeId) return 'Not configured';
  
  const typeNames = {
    flat: 'Flat (Constant)',
    increasing: 'Increasing',
    decreasing: 'Decreasing',
    frontloaded: 'Front-loaded',
    backloaded: 'Back-loaded'
  };
  
  return typeNames[scalingTypeId] || scalingTypeId;
}

// Get trigger condition name
function getTriggerConditionName(triggerConditionId) {
  if (!triggerConditionId) return 'Not configured';
  
  const conditionNames = {
    proximity: 'Proximity',
    damage_taken: 'Damage Taken',
    spell_cast: 'Spell Cast',
    movement: 'Movement'
  };
  
  return conditionNames[triggerConditionId] || triggerConditionId;
}

// Format healing type
function formatHealingType(healingTypeId) {
  if (!healingTypeId) return 'Not configured';
  
  const healingTypes = {
    direct: 'Direct Healing',
    regen: 'Regeneration',
    leech: 'Life Leech',
    conversion: 'Damage Conversion',
    percentage: 'Percentage Healing'
  };
  
  return healingTypes[healingTypeId] || healingTypeId;
}

// Get shield type name
function getShieldTypeName(shieldTypeId) {
  const shieldType = ABSORPTION_SHIELD_TYPES.find(s => s.id === shieldTypeId);
  return shieldType ? shieldType.name : shieldTypeId || 'Not configured';
}