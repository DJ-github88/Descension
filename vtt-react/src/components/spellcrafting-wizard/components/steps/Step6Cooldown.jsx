import React, { useState, useEffect } from 'react';
import { useSpellWizardState, useSpellWizardDispatch, ACTION_TYPES, validateStepCompletion } from '../../context/spellWizardContext';
import WizardStep from '../common/WizardStep';
import '../../styles/pathfinder/steps/cooldown.css';

const Step6Cooldown = ({ stepNumber, totalSteps, onNext, onPrevious }) => {
  const state = useSpellWizardState();
  const dispatch = useSpellWizardDispatch();
  const [errors, setErrors] = useState([]);
  
  const isCompleted = validateStepCompletion(5, state);
  const isActive = state.currentStep === 5;
  
  // Local cooldown configuration
  const [cooldownConfig, setCooldownConfig] = useState(state.cooldownConfig || {
    type: '',
    value: 1,
    charges: 1,
    recovery: 1
  });
  
  // Effect to update context when configuration changes
  useEffect(() => {
    if (cooldownConfig.type) {
      dispatch({
        type: ACTION_TYPES.UPDATE_COOLDOWN_CONFIG,
        payload: cooldownConfig
      });
    }
  }, [cooldownConfig, dispatch]);
  
  // Handle configuration changes from the CooldownConfig component
  const handleCooldownConfigChange = (newConfig) => {
    setCooldownConfig(newConfig);
    
    // Validate the configuration
    const validationErrors = validateCooldownConfig(newConfig);
    setErrors(validationErrors);
  };
  
  // Validate the cooldown configuration
  const validateCooldownConfig = (config) => {
    const errors = [];
    
    if (!config.type) {
      errors.push('Please select a cooldown type');
    }
    
    if (config.type === 'turn_based' && (!config.value || config.value <= 0)) {
      errors.push('Turn-based cooldown requires a positive number of turns');
    }
    
    if ((config.type === 'short_rest' || config.type === 'long_rest') && 
        (!config.value || config.value <= 0)) {
      errors.push(`${config.type === 'short_rest' ? 'Short rest' : 'Long rest'} cooldown requires a positive number of uses`);
    }
    
    if (config.type === 'charge_based' && (!config.charges || config.charges <= 0)) {
      errors.push('Charge-based cooldown requires at least one charge');
    }
    
    if (config.type === 'dice_based' && !config.value) {
      errors.push('Dice-based cooldown requires a valid dice notation');
    }
    
    return errors;
  };
  
  // Generate cooldown recommendations based on spell type and level
  const getCooldownRecommendations = () => {
    const { spellType, level } = state;
    
    if (spellType === 'ACTION') {
      if (level <= 2) {
        return "For low-level action spells, consider a 2-3 turn cooldown or 3-4 uses per short rest.";
      } else if (level <= 5) {
        return "For mid-level action spells, consider a 3-5 turn cooldown or 2-3 uses per short rest.";
      } else {
        return "For high-level action spells, consider a 5-8 turn cooldown or 1-2 uses per long rest.";
      }
    } else if (spellType === 'CHANNELED') {
      if (level <= 3) {
        return "For channeled spells, consider a slightly longer cooldown than standard actions of the same level.";
      } else {
        return "High-level channeled abilities typically have longer cooldowns to balance their power.";
      }
    } else if (spellType === 'REACTION') {
      return "Reaction abilities often work well with charge-based cooldowns or longer cooldowns with multiple uses.";
    } else {
      return "Consider how frequently you want this ability to be available and choose a cooldown that fits the game's pacing.";
    }
  };
  
  // Step-specific helpful hints
  const hints = [
    "Powerful spells should have longer cooldowns for game balance.",
    "Consider using charges for abilities that should be usable multiple times but not spammable.",
    "Rest-based cooldowns are great for significant abilities that shouldn't be used in every encounter.",
    "Conditional cooldowns can create interesting gameplay where players look for opportunities to reset their abilities.",
    getCooldownRecommendations()
  ];
  
  return (
    <WizardStep
      title="Cooldown Configuration"
      stepNumber={stepNumber}
      totalSteps={totalSteps}
      isCompleted={isCompleted}
      isActive={isActive}
      onNext={onNext}
      onPrevious={onPrevious}
      disableNext={errors.length > 0}
      hints={hints}
      showHints={true}
    >
      <div className="spell-effects-container">
        <div className="step-description mb-md">
          <p>
            Configure how frequently your spell can be used by setting its cooldown. 
            Choose a type of cooldown that fits the spell's power level and the intended gameplay.
          </p>
        </div>
        
        {errors.length > 0 && (
          <div className="effect-config-group mb-md">
            <h4 className="text-danger">Please fix the following issues:</h4>
            <ul className="mb-md">
              {errors.map((error, index) => (
                <li key={index} className="text-danger">{error}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="effect-config-group">
          <h4 className="effect-config-label">Cooldown Type</h4>
          <div className="effect-options tabs mb-md">
            <button
              className={`pf-button ${cooldownConfig.type === 'turn_based' ? 'selected' : ''}`}
              onClick={() => handleCooldownConfigChange({...cooldownConfig, type: 'turn_based'})}>
              Turn Based
            </button>
            <button
              className={`pf-button ${cooldownConfig.type === 'charge_based' ? 'selected' : ''}`}
              onClick={() => handleCooldownConfigChange({...cooldownConfig, type: 'charge_based'})}>
              Charge Based
            </button>
            <button
              className={`pf-button ${cooldownConfig.type === 'short_rest' ? 'selected' : ''}`}
              onClick={() => handleCooldownConfigChange({...cooldownConfig, type: 'short_rest'})}>
              Short Rest
            </button>
            <button
              className={`pf-button ${cooldownConfig.type === 'long_rest' ? 'selected' : ''}`}
              onClick={() => handleCooldownConfigChange({...cooldownConfig, type: 'long_rest'})}>
              Long Rest
            </button>
            <button
              className={`pf-button ${cooldownConfig.type === 'dice_based' ? 'selected' : ''}`}
              onClick={() => handleCooldownConfigChange({...cooldownConfig, type: 'dice_based'})}>
              Dice Based
            </button>
          </div>

          {cooldownConfig.type && (
            <div className="effect-config-group">
              {cooldownConfig.type === 'turn_based' && (
                <div className="config-option">
                  <label className="effect-option-label">Number of Turns</label>
                  <div className="effect-numeric-input">
                    <input 
                      type="number" 
                      min="1" 
                      value={cooldownConfig.value || 1}
                      onChange={(e) => handleCooldownConfigChange({
                        ...cooldownConfig, 
                        value: parseInt(e.target.value) || 1
                      })}
                    />
                  </div>
                  <div className="effect-description">
                    Ability can be used once every {cooldownConfig.value || 1} turns.
                  </div>
                </div>
              )}

              {(cooldownConfig.type === 'short_rest' || cooldownConfig.type === 'long_rest') && (
                <div className="config-option">
                  <label className="effect-option-label">Uses per {cooldownConfig.type === 'short_rest' ? 'Short' : 'Long'} Rest</label>
                  <div className="effect-numeric-input">
                    <input 
                      type="number" 
                      min="1" 
                      value={cooldownConfig.value || 1}
                      onChange={(e) => handleCooldownConfigChange({
                        ...cooldownConfig, 
                        value: parseInt(e.target.value) || 1
                      })}
                    />
                  </div>
                  <div className="effect-description">
                    Ability can be used {cooldownConfig.value || 1} times before needing a {cooldownConfig.type === 'short_rest' ? 'short' : 'long'} rest.
                  </div>
                </div>
              )}

              {cooldownConfig.type === 'charge_based' && (
                <>
                  <div className="config-option">
                    <label className="effect-option-label">Maximum Charges</label>
                    <div className="effect-numeric-input">
                      <input 
                        type="number" 
                        min="1" 
                        value={cooldownConfig.charges || 1}
                        onChange={(e) => handleCooldownConfigChange({
                          ...cooldownConfig, 
                          charges: parseInt(e.target.value) || 1
                        })}
                      />
                    </div>
                  </div>
                  <div className="config-option">
                    <label className="effect-option-label">Turns to Recover 1 Charge</label>
                    <div className="effect-numeric-input">
                      <input 
                        type="number" 
                        min="1" 
                        value={cooldownConfig.recovery || 1}
                        onChange={(e) => handleCooldownConfigChange({
                          ...cooldownConfig, 
                          recovery: parseInt(e.target.value) || 1
                        })}
                      />
                    </div>
                    <div className="effect-description">
                      Ability has {cooldownConfig.charges || 1} charges maximum, regaining 1 charge every {cooldownConfig.recovery || 1} turns.
                    </div>
                  </div>
                </>
              )}

              {cooldownConfig.type === 'dice_based' && (
                <div className="config-option">
                  <label className="effect-option-label">Dice Formula</label>
                  <input 
                    type="text" 
                    placeholder="e.g., 1d4, 1d6+1" 
                    value={cooldownConfig.value || ''}
                    onChange={(e) => handleCooldownConfigChange({
                      ...cooldownConfig, 
                      value: e.target.value
                    })}
                  />
                  <div className="effect-description">
                    Roll {cooldownConfig.value || 'dice'} to determine how many turns until the ability can be used again.
                  </div>
                </div>
              )}
            </div>
          )}

          {cooldownConfig.type && (
            <div className="effect-preview mt-md">
              <div className="effect-preview-header">
                <div className="effect-preview-title">
                  <h4>Cooldown Preview</h4>
                </div>
              </div>
              <div className="effect-preview-description">
                {cooldownConfig.type === 'turn_based' && `This ability has a ${cooldownConfig.value || 1}-turn cooldown.`}
                {cooldownConfig.type === 'short_rest' && `This ability can be used ${cooldownConfig.value || 1} times per short rest.`}
                {cooldownConfig.type === 'long_rest' && `This ability can be used ${cooldownConfig.value || 1} times per long rest.`}
                {cooldownConfig.type === 'charge_based' && `This ability has ${cooldownConfig.charges || 1} charges, regaining 1 charge every ${cooldownConfig.recovery || 1} turns.`}
                {cooldownConfig.type === 'dice_based' && `After using this ability, roll ${cooldownConfig.value || 'dice'} to determine cooldown duration.`}
              </div>
            </div>
          )}
        </div>
        
        <div className="effect-config-group mt-lg">
          <h3 className="section-header">Common Cooldown Examples</h3>
          <div className="card-selection-grid">
            <div className="icon-selection-card">
              <h4>Basic Attack</h4>
              <p>No cooldown or 1 turn</p>
              <p className="text-muted mt-xs">Standard actions usable every turn</p>
            </div>
            <div className="icon-selection-card">
              <h4>Utility Spell</h4>
              <p>3-4 turns cooldown</p>
              <p className="text-muted mt-xs">Abilities that provide advantages but aren't direct damage</p>
            </div>
            <div className="icon-selection-card">
              <h4>Powerful Ability</h4>
              <p>5-8 turns cooldown</p>
              <p className="text-muted mt-xs">High-impact abilities that can change the course of battle</p>
            </div>
            <div className="icon-selection-card">
              <h4>Signature Ability</h4>
              <p>1-2 uses per short rest</p>
              <p className="text-muted mt-xs">Class-defining abilities you want available for key moments</p>
            </div>
            <div className="icon-selection-card">
              <h4>Ultimate Ability</h4>
              <p>1 use per long rest</p>
              <p className="text-muted mt-xs">Most powerful abilities that should be used strategically</p>
            </div>
          </div>
        </div>
      </div>
    </WizardStep>
  );
};

export default Step6Cooldown;