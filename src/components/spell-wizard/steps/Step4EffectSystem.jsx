import React, { useState, useEffect } from 'react';
import { 
  EffectWizardProvider, 
  useEffectWizard, 
  effectWizardHelpers 
} from '../Effects/EffectWizardContext';
import { WIZARD_STEPS, getWizardFlow, validateStep } from '../Effects/EffectWizardSteps';
import { WIZARD_PAGES } from '../Effects/EffectWizardPages';
import { WizardStepContainer, SpellPreviewPanel } from '../Effects/EffectWizardComponents';
import { 
  EFFECT_TYPES, 
  DAMAGE_TYPES, 
  DURATION_TYPES,
  TARGETING_TYPES,
  getWowIconPath
} from '../Effects/enhancedEffectSystemData';
import { 
  isValidDiceNotation,
  getAverageRoll
} from '../Effects/DiceRules';

// Main component for the Effect System step in the spell creation process
const Step4EffectSystem = ({ 
  currentStep, 
  setCurrentStep, 
  spellData,
  updateSpellData,
  validationState,
  setValidationState
}) => {
  // State to control whether we're in the effect wizard
  const [showEffectWizard, setShowEffectWizard] = useState(false);
  // State to store the existing effect being edited (null for new effects)
  const [editingEffectIndex, setEditingEffectIndex] = useState(null);
  // State for tracking if we need to update the main spellData
  const [effectWizardComplete, setEffectWizardComplete] = useState(false);
  // State to temporarily store the effect wizard result
  const [effectWizardResult, setEffectWizardResult] = useState(null);

  useEffect(() => {
    // Check if this step has already been completed
    const isEffectsValid = spellData.effects && 
                          spellData.effects.length > 0 && 
                          spellData.effects.every(effect => validateEffect(effect));
    
    // Update validation state for this step
    setValidationState(prevState => ({
      ...prevState,
      effects: isEffectsValid
    }));
  }, [spellData.effects]);

  useEffect(() => {
    // If the effect wizard completed, update the main spell data
    if (effectWizardComplete && effectWizardResult) {
      const newEffects = [...(spellData.effects || [])];
      
      if (editingEffectIndex !== null) {
        // Replace existing effect
        newEffects[editingEffectIndex] = effectWizardResult;
      } else {
        // Add new effect
        newEffects.push(effectWizardResult);
      }
      
      // Update spell data with new effects
      updateSpellData({
        ...spellData,
        effects: newEffects
      });
      
      // Reset states
      setEffectWizardComplete(false);
      setEffectWizardResult(null);
      setEditingEffectIndex(null);
    }
  }, [effectWizardComplete, effectWizardResult]);

  // Validate a single effect
  const validateEffect = (effect) => {
    if (!effect) return false;
    
    // Basic validation checks
    if (!effect.effectTypes || effect.effectTypes.length === 0) {
      return false;
    }
    
    // Validate damage config if present
    if (effect.effectTypes.includes('damage')) {
      if (!effect.damageConfig || 
          !effect.damageConfig.damageTypes || 
          effect.damageConfig.damageTypes.length === 0 ||
          !isValidDiceNotation(effect.damageConfig.diceNotation)) {
        return false;
      }
    }
    
    // Validate healing config if present
    if (effect.effectTypes.includes('healing')) {
      if (!effect.healingConfig || !isValidDiceNotation(effect.healingConfig.diceNotation)) {
        return false;
      }
    }
    
    // Check for required targeting and duration configs
    if (!effect.targetingConfig || !effect.targetingConfig.targetingType) {
      return false;
    }
    
    if (!effect.durationConfig || !effect.durationConfig.durationType) {
      return false;
    }
    
    return true;
  };

  // Convert spell data effects to effect wizard format
  const getEffectWizardInitialState = (effectIndex = null) => {
    if (effectIndex !== null && spellData.effects && spellData.effects[effectIndex]) {
      // Return existing effect data
      return spellData.effects[effectIndex];
    }
    
    // Return new effect data structure
    return {
      effectTypes: [],
      damageConfig: {
        damageTypes: [],
        diceNotation: '2d6',
        useChainEffect: false,
        criticalConfig: {
          criticalMultiplier: 2,
          criticalDiceOnly: true,
          extraDice: '',
          effects: []
        }
      },
      healingConfig: {
        healingType: 'direct',
        diceNotation: '2d8',
        useAbsorptionShield: false
      },
      buffConfig: {
        statModifiers: {},
        statusEffects: [],
        effectParameters: {}
      },
      debuffConfig: {
        statModifiers: {},
        statusEffects: [],
        effectParameters: {}
      },
      utilityConfig: {
        utilityType: null,
        utilitySubtype: null,
        parameters: {}
      },
      targetingConfig: {
        targetingType: 'single',
        areaShape: null,
        areaSize: 0
      },
      durationConfig: {
        durationType: 'instant',
        durationValue: 0,
        requiresConcentration: false
      },
      persistentConfig: {
        isPersistent: false,
        persistentType: null,
        tickFrequency: null,
        scalingType: null
      }
    };
  };

  // Start the effect wizard to create or edit an effect
  const handleStartEffectWizard = (effectIndex = null) => {
    setEditingEffectIndex(effectIndex);
    setShowEffectWizard(true);
  };

  // Handle effect deletion
  const handleDeleteEffect = (index) => {
    const newEffects = [...spellData.effects];
    newEffects.splice(index, 1);
    
    updateSpellData({
      ...spellData,
      effects: newEffects
    });
  };

  return (
    <div className="step-container">
      <div className="step-header">
        <h2>Step 4: Define Spell Effects</h2>
        <p>Create the magical effects that your spell produces.</p>
      </div>

      {/* Show effect wizard if active, otherwise show effect list */}
      {showEffectWizard ? (
        <EffectWizardContainer 
          initialState={getEffectWizardInitialState(editingEffectIndex)}
          onComplete={(result) => {
            setEffectWizardResult(result);
            setEffectWizardComplete(true);
            setShowEffectWizard(false);
          }}
          onCancel={() => {
            setShowEffectWizard(false);
            setEditingEffectIndex(null);
          }}
        />
      ) : (
        <div className="effects-manager">
          <div className="effects-list">
            <h3>Spell Effects</h3>
            
            {spellData.effects && spellData.effects.length > 0 ? (
              <div className="effect-cards">
                {spellData.effects.map((effect, index) => (
                  <EffectCard 
                    key={index}
                    effect={effect}
                    index={index}
                    onEdit={() => handleStartEffectWizard(index)}
                    onDelete={() => handleDeleteEffect(index)}
                  />
                ))}
              </div>
            ) : (
              <div className="no-effects-message">
                <p>No effects defined yet. Click the button below to add your first effect.</p>
              </div>
            )}
            
            <button 
              className="add-effect-button"
              onClick={() => handleStartEffectWizard()}
            >
              Add New Effect
            </button>
          </div>
          
          <div className="spell-effects-preview">
            <h3>Spell Effects Summary</h3>
            <SpellEffectsSummary effects={spellData.effects || []} />
          </div>
        </div>
      )}

      <div className="step-navigation">
        <button 
          className="prev-step-button"
          onClick={() => setCurrentStep(currentStep - 1)}
        >
          Previous: Components
        </button>
        
        <button 
          className="next-step-button"
          onClick={() => setCurrentStep(currentStep + 1)}
          disabled={!validationState.effects}
        >
          Next: Final Review
        </button>
      </div>
    </div>
  );
};

// Container for the effect wizard itself
const EffectWizardContainer = ({ initialState, onComplete, onCancel }) => {
  return (
    <EffectWizardProvider>
      <EffectWizardContent 
        initialState={initialState}
        onComplete={onComplete}
        onCancel={onCancel}
      />
    </EffectWizardProvider>
  );
};

// The actual content of the effect wizard inside the provider context
const EffectWizardContent = ({ initialState, onComplete, onCancel }) => {
  const [state, dispatch] = useEffectWizard();
  const [currentWizardStep, setCurrentWizardStep] = useState('effectTypeSelection');
  const [wizardFlow, setWizardFlow] = useState([]);

  // Initialize wizard with the provided initial state
  useEffect(() => {
    if (initialState) {
      dispatch({
        type: 'APPLY_TEMPLATE',
        payload: initialState
      });
      
      // Set the wizard flow based on initial effect types
      const flow = getWizardFlow(initialState.effectTypes || []);
      setWizardFlow(flow);
      
      // If effect types already exist, start at the appropriate step
      if (initialState.effectTypes && initialState.effectTypes.length > 0) {
        setCurrentWizardStep('templateSelection');
      }
    }
  }, [initialState]);

  // Update flow when effect types change
  useEffect(() => {
    const flow = getWizardFlow(state.effectTypes);
    setWizardFlow(flow);
  }, [state.effectTypes]);

  // Navigation handlers
  const handleNext = () => {
    const currentIndex = wizardFlow.indexOf(currentWizardStep);
    if (currentIndex < wizardFlow.length - 1) {
      setCurrentWizardStep(wizardFlow[currentIndex + 1]);
    } else {
      // We're at the end of the wizard, complete the process
      handleComplete();
    }
  };

  const handlePrevious = () => {
    const currentIndex = wizardFlow.indexOf(currentWizardStep);
    if (currentIndex > 0) {
      setCurrentWizardStep(wizardFlow[currentIndex - 1]);
    }
  };

  const handleComplete = () => {
    // Generate a summary for the main app
    const effectSummary = effectWizardHelpers.generateEffectSummary(state);
    
    // Clean up and transform data as needed
    const result = {
      ...state,
      // Add any additional fields needed for the main app
      summary: effectSummary
    };
    
    // Call the onComplete callback with the result
    onComplete(result);
  };

  // Render the appropriate step
  const renderCurrentStep = () => {
    const StepComponent = WIZARD_PAGES[currentWizardStep];
    if (!StepComponent) {
      return <div>Unknown step: {currentWizardStep}</div>;
    }
    
    return <StepComponent 
      stepId={currentWizardStep}
      currentStepId={currentWizardStep}
      flow={wizardFlow}
    />;
  };

  // Check if the current step is valid
  const isCurrentStepValid = () => {
    return validateStep(currentWizardStep, state);
  };

  return (
    <div className="effect-wizard-container">
      <div className="wizard-header">
        <h3>
          {initialState && initialState.effectTypes && initialState.effectTypes.length > 0 
            ? 'Edit Effect' 
            : 'Create New Effect'}
        </h3>
        <button className="close-wizard-button" onClick={onCancel}>×</button>
      </div>
      
      <div className="wizard-content">
        <div className="wizard-sidebar">
          {/* Steps navigation */}
          <div className="wizard-steps">
            <h4>Effect Wizard Steps</h4>
            <ul>
              {wizardFlow.map((stepId) => {
                const step = WIZARD_STEPS[stepId];
                const isActive = stepId === currentWizardStep;
                const isCompleted = wizardFlow.indexOf(stepId) < wizardFlow.indexOf(currentWizardStep);
                
                return (
                  <li 
                    key={stepId}
                    className={`wizard-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                    onClick={() => {
                      // Allow navigation to completed steps or the next step if current is valid
                      if (isCompleted || 
                          (wizardFlow.indexOf(stepId) === wizardFlow.indexOf(currentWizardStep) + 1 && 
                           isCurrentStepValid())) {
                        setCurrentWizardStep(stepId);
                      }
                    }}
                  >
                    <div className="step-icon">
                      {isCompleted ? '✓' : wizardFlow.indexOf(stepId) + 1}
                    </div>
                    <div className="step-info">
                      <div className="step-title">{step?.title || 'Unknown Step'}</div>
                      {isActive && <div className="step-description">{step?.description}</div>}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
          
          {/* Effect Preview Panel */}
          <div className="effect-preview-panel">
            <SpellPreviewPanel state={state} />
          </div>
        </div>
        
        <div className="wizard-main-content">
          {renderCurrentStep()}
          
          <div className="wizard-navigation">
            <button 
              className="wizard-prev-button"
              onClick={handlePrevious}
              disabled={wizardFlow.indexOf(currentWizardStep) === 0}
            >
              Previous
            </button>
            
            <button 
              className="wizard-next-button"
              onClick={handleNext}
              disabled={!isCurrentStepValid()}
            >
              {wizardFlow.indexOf(currentWizardStep) === wizardFlow.length - 1 
                ? 'Complete' 
                : 'Next'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Component to display an effect card in the effects list
const EffectCard = ({ effect, index, onEdit, onDelete }) => {
  // Get the primary effect type
  const primaryEffectType = effect.effectTypes && effect.effectTypes[0]
    ? EFFECT_TYPES.find(t => t.id === effect.effectTypes[0])
    : null;
    
  // Get effect icon
  const getEffectIcon = () => {
    if (!primaryEffectType) return null;
    return getWowIconPath(primaryEffectType.icon);
  };
  
  // Generate effect description
  const getEffectDescription = () => {
    if (!effect.effectTypes || effect.effectTypes.length === 0) {
      return 'Unknown effect';
    }
    
    let description = [];
    
    // Add damage description
    if (effect.effectTypes.includes('damage') && effect.damageConfig) {
      const damageTypes = effect.damageConfig.damageTypes.map(id => {
        const type = DAMAGE_TYPES.find(t => t.id === id);
        return type ? type.name.toLowerCase() : id;
      }).join(', ');
      
      const avgDamage = isValidDiceNotation(effect.damageConfig.diceNotation) 
        ? getAverageRoll(effect.damageConfig.diceNotation).toFixed(1)
        : '?';
        
      description.push(`${effect.damageConfig.diceNotation} ${damageTypes} damage (avg: ${avgDamage})`);
    }
    
    // Add healing description
    if (effect.effectTypes.includes('healing') && effect.healingConfig) {
      const avgHealing = isValidDiceNotation(effect.healingConfig.diceNotation) 
        ? getAverageRoll(effect.healingConfig.diceNotation).toFixed(1)
        : '?';
        
      description.push(`${effect.healingConfig.diceNotation} healing (avg: ${avgHealing})`);
      
      if (effect.healingConfig.useAbsorptionShield) {
        description.push('With absorption shield');
      }
    }
    
    // Add buff/debuff counts
    if (effect.effectTypes.includes('buff') && effect.buffConfig) {
      const statusCount = effect.buffConfig.statusEffects?.length || 0;
      const statCount = Object.keys(effect.buffConfig.statModifiers || {}).length;
      
      if (statusCount > 0 || statCount > 0) {
        description.push(`${statusCount} status effects, ${statCount} stat modifiers`);
      }
    }
    
    if (effect.effectTypes.includes('debuff') && effect.debuffConfig) {
      const statusCount = effect.debuffConfig.statusEffects?.length || 0;
      const statCount = Object.keys(effect.debuffConfig.statModifiers || {}).length;
      
      if (statusCount > 0 || statCount > 0) {
        description.push(`${statusCount} negative effects, ${statCount} stat penalties`);
      }
    }
    
    // Add utility info
    if (effect.effectTypes.includes('utility') && 
        effect.utilityConfig?.utilityType && 
        effect.utilityConfig?.utilitySubtype) {
      description.push(`${effect.utilityConfig.utilityType}: ${effect.utilityConfig.utilitySubtype}`);
    }
    
    // Add targeting and duration
    if (effect.targetingConfig?.targetingType) {
      const targeting = TARGETING_TYPES.find(t => t.id === effect.targetingConfig.targetingType);
      if (targeting) {
        description.push(`${targeting.name} targeting`);
      }
    }
    
    if (effect.durationConfig?.durationType) {
      const duration = DURATION_TYPES.find(d => d.id === effect.durationConfig.durationType);
      if (duration) {
        let durationText = duration.name;
        if (effect.durationConfig.durationType !== 'instant') {
          durationText += `: ${effect.durationConfig.durationValue} ${effect.durationConfig.durationType}`;
        }
        description.push(durationText);
      }
    }
    
    return description.join(', ');
  };
  
  return (
    <div className="effect-card">
      <div className="effect-card-header">
        <div className="effect-icon">
          <img src={getEffectIcon()} alt="Effect" />
        </div>
        <div className="effect-title">
          <h4>Effect {index + 1}: {primaryEffectType?.name || 'Unknown'}</h4>
          <div className="effect-types">
            {effect.effectTypes && effect.effectTypes.map(typeId => {
              const type = EFFECT_TYPES.find(t => t.id === typeId);
              return (
                <span key={typeId} className="effect-type-badge">
                  {type?.name || typeId}
                </span>
              );
            })}
          </div>
        </div>
      </div>
      
      <div className="effect-description">
        <p>{getEffectDescription()}</p>
      </div>
      
      <div className="effect-actions">
        <button className="edit-effect-button" onClick={onEdit}>
          Edit
        </button>
        <button className="delete-effect-button" onClick={onDelete}>
          Delete
        </button>
      </div>
    </div>
  );
};

// Component to display a summary of all spell effects
const SpellEffectsSummary = ({ effects }) => {
  if (!effects || effects.length === 0) {
    return (
      <div className="no-effects-summary">
        <p>No effects have been defined for this spell yet.</p>
        <p>Add at least one effect to continue.</p>
      </div>
    );
  }
  
  // Calculate total damage
  const calculateTotalDamage = () => {
    let totalAverage = 0;
    let damageTypes = new Set();
    
    effects.forEach(effect => {
      if (effect.effectTypes?.includes('damage') && effect.damageConfig?.diceNotation) {
        if (isValidDiceNotation(effect.damageConfig.diceNotation)) {
          totalAverage += getAverageRoll(effect.damageConfig.diceNotation);
        }
        
        effect.damageConfig.damageTypes?.forEach(type => damageTypes.add(type));
      }
    });
    
    return {
      average: totalAverage.toFixed(1),
      types: Array.from(damageTypes)
    };
  };
  
  // Calculate total healing
  const calculateTotalHealing = () => {
    let totalAverage = 0;
    let hasShield = false;
    
    effects.forEach(effect => {
      if (effect.effectTypes?.includes('healing') && effect.healingConfig?.diceNotation) {
        if (isValidDiceNotation(effect.healingConfig.diceNotation)) {
          totalAverage += getAverageRoll(effect.healingConfig.diceNotation);
        }
        
        if (effect.healingConfig.useAbsorptionShield) {
          hasShield = true;
        }
      }
    });
    
    return {
      average: totalAverage.toFixed(1),
      hasShield
    };
  };
  
  // Count status effects
  const countStatusEffects = () => {
    let positiveCount = 0;
    let negativeCount = 0;
    
    effects.forEach(effect => {
      if (effect.effectTypes?.includes('buff') && effect.buffConfig?.statusEffects) {
        positiveCount += effect.buffConfig.statusEffects.length;
      }
      
      if (effect.effectTypes?.includes('debuff') && effect.debuffConfig?.statusEffects) {
        negativeCount += effect.debuffConfig.statusEffects.length;
      }
    });
    
    return { positiveCount, negativeCount };
  };
  
  // Get duration info
  const getDurationInfo = () => {
    const durations = effects
      .filter(effect => effect.durationConfig?.durationType)
      .map(effect => {
        const durationType = DURATION_TYPES.find(d => d.id === effect.durationConfig.durationType);
        
        return {
          name: durationType?.name || effect.durationConfig.durationType,
          value: effect.durationConfig.durationValue,
          concentration: effect.durationConfig.requiresConcentration
        };
      });
    
    const requiresConcentration = durations.some(d => d.concentration);
    
    return { durations, requiresConcentration };
  };
  
  const damage = calculateTotalDamage();
  const healing = calculateTotalHealing();
  const statusEffects = countStatusEffects();
  const durationInfo = getDurationInfo();
  
  return (
    <div className="spell-effects-summary">
      <div className="summary-section">
        <h4>Effect Types</h4>
        <div className="effect-type-summary">
          {(new Set(effects.flatMap(e => e.effectTypes || []))).size > 0 ? (
            Array.from(new Set(effects.flatMap(e => e.effectTypes || []))).map(typeId => {
              const type = EFFECT_TYPES.find(t => t.id === typeId);
              return (
                <div key={typeId} className="summary-badge">
                  {type?.name || typeId}
                </div>
              );
            })
          ) : (
            <p>No effect types defined</p>
          )}
        </div>
      </div>
      
      {damage.average > 0 && (
        <div className="summary-section">
          <h4>Damage</h4>
          <p>Average: {damage.average}</p>
          <div className="damage-types-summary">
            {damage.types.map(typeId => {
              const type = DAMAGE_TYPES.find(t => t.id === typeId);
              return (
                <div key={typeId} className="summary-badge">
                  {type?.name || typeId}
                </div>
              );
            })}
          </div>
        </div>
      )}
      
      {healing.average > 0 && (
        <div className="summary-section">
          <h4>Healing</h4>
          <p>Average: {healing.average}</p>
          {healing.hasShield && <p>Includes absorption shield</p>}
        </div>
      )}
      
      {(statusEffects.positiveCount > 0 || statusEffects.negativeCount > 0) && (
        <div className="summary-section">
          <h4>Status Effects</h4>
          {statusEffects.positiveCount > 0 && (
            <p>Positive Effects: {statusEffects.positiveCount}</p>
          )}
          {statusEffects.negativeCount > 0 && (
            <p>Negative Effects: {statusEffects.negativeCount}</p>
          )}
        </div>
      )}
      
      <div className="summary-section">
        <h4>Duration</h4>
        {durationInfo.durations.length > 0 ? (
          <>
            <ul className="duration-list">
              {durationInfo.durations.map((d, i) => (
                <li key={i}>
                  {d.name === 'Instant' ? 'Instant effect' : `${d.name}: ${d.value}`}
                  {d.concentration && ' (Concentration)'}
                </li>
              ))}
            </ul>
            {durationInfo.requiresConcentration && (
              <p className="concentration-note">
                This spell requires concentration to maintain.
              </p>
            )}
          </>
        ) : (
          <p>No duration defined</p>
        )}
      </div>
      
      <div className="ap-cost-summary">
        <h4>Action Point Cost</h4>
        <p>
          {effects.reduce((total, effect) => total + (effect.totalActionPointCost || 0), 0)} AP
        </p>
      </div>
    </div>
  );
};

export default Step4EffectSystem;