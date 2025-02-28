import React, { useState, useEffect } from 'react';
import useSpellWizardStore from '../../../store/spellWizardStore';
import { ResourceSelector, StepNavigation } from '../common';
import '../styles/spell-wizard.css';
import { getClassResources, getMonsterResources } from '../../../data/classResources';

// Cooldown categories with descriptions (from original Step7ResourceCost)
const COOLDOWN_CATEGORIES = [
  { id: 'instant', name: 'Instant', description: 'Can be used repeatedly with no cooldown', examples: ['Basic attacks', 'Minor cantrips'] },
  { id: 'short', name: 'Short Cooldown', description: 'Brief cooldown, usable multiple times per encounter', examples: ['Core rotational abilities', 'Mobility skills'] },
  { id: 'medium', name: 'Medium Cooldown', description: 'Moderate cooldown, usable a few times per encounter', examples: ['Powerful abilities', 'Defensive cooldowns'] },
  { id: 'long', name: 'Long Cooldown', description: 'Long cooldown, usable once per encounter or less', examples: ['Ultimate abilities', 'Game-changing effects'] },
  { id: 'encounter', name: 'Once Per Encounter', description: 'Can only be used once per combat encounter', examples: ['Powerful finishers', 'Emergency abilities'] },
  { id: 'daily', name: 'Daily/Rest', description: 'Can only be used once per day or after a rest', examples: ['Extremely powerful spells', 'Ritual magic'] }
];

// Cost scaling modifiers (from original Step7ResourceCost)
const COST_SCALING_OPTIONS = [
  { id: 'flat', name: 'Flat Cost', description: 'Resource cost remains the same regardless of other factors' },
  { id: 'scaling', name: 'Level Scaling', description: 'Resource cost increases with character level' },
  { id: 'variable', name: 'Variable/Optional', description: 'Player can choose to spend more resources for greater effect' },
  { id: 'decreasing', name: 'Decreasing Over Time', description: 'Costs less when used repeatedly (e.g., combo builders)' },
  { id: 'conditional', name: 'Conditional Modifier', description: 'Cost changes based on conditions or status effects' }
];

// Cast time options (from original Step7ResourceCost)
const CAST_TIME_OPTIONS = [
  { id: 'instant', name: 'Instant', description: 'Activates immediately with no cast time' },
  { id: 'short', name: 'Short Cast (0.5-1s)', description: 'Brief cast time, can be interrupted but relatively quick' },
  { id: 'medium', name: 'Medium Cast (1.5-2.5s)', description: 'Standard cast time, vulnerable to interrupts' },
  { id: 'long', name: 'Long Cast (3s+)', description: 'Extended cast time for powerful effects, very vulnerable' },
  { id: 'channeled', name: 'Channeled', description: 'Continues casting as long as the button is held down' },
  { id: 'charged', name: 'Charged', description: 'Held to charge up, release to cast with strength based on charge time' }
];

const Step3ResourceSystem = () => {
  const { spellData, updateSpellData, setStepValidation, nextStep, prevStep } = useSpellWizardStore();
  
  // Load resources based on class/monster type
  const getAvailableResources = () => {
    if (spellData.source === 'class' && spellData.class) {
      return getClassResources(spellData.class);
    } else if (spellData.source === 'monster') {
      return getMonsterResources();
    }
    return [];
  };
  
  const availableResources = getAvailableResources();
  
  // Local state
  const [selectedResources, setSelectedResources] = useState(
    spellData.resourceSystem?.split(',').filter(Boolean) || []
  );
  const [useHealthResource, setUseHealthResource] = useState(spellData.useHealthAsResource || false);
  const [cooldownCategory, setCooldownCategory] = useState(spellData.cooldownCategory || 'short');
  const [cooldownValue, setCooldownValue] = useState(spellData.cooldownValue || 6);
  const [cooldownUnit, setCooldownUnit] = useState(spellData.cooldownUnit || 'seconds');
  const [costScalingType, setCostScalingType] = useState(spellData.costScalingType || 'flat');
  const [castTimeType, setCastTimeType] = useState(spellData.castTimeType || 'instant');
  const [castTimeValue, setCastTimeValue] = useState(spellData.castTimeValue || 0);
  const [channelMaxTime, setChannelMaxTime] = useState(spellData.channelMaxTime || 3);
  const [globalCooldown, setGlobalCooldown] = useState(spellData.triggersGlobalCooldown !== false);
  
  // Resource costs - we'll create an object for each resource
  const [resourceCosts, setResourceCosts] = useState(() => {
    const costs = {};
    selectedResources.forEach(resourceId => {
      costs[resourceId] = spellData.resourceCosts?.[resourceId] || {
        baseAmount: 10,
        scalingAmount: 0,
        scalingFormula: '',
        variableMin: 0,
        variableMax: 0
      };
    });
    
    // Handle health cost if enabled
    if (useHealthResource) {
      costs['health'] = spellData.resourceCosts?.health || {
        baseAmount: 5,
        scalingAmount: 0,
        scalingFormula: '',
        variableMin: 0,
        variableMax: 0,
        costType: 'flat'
      };
    }
    
    return costs;
  });
  
  // Class-specific mechanics
  const [fortuneGenerate, setFortuneGenerate] = useState(spellData.fortuneGenerate || false);
  const [fortuneGenerateAmount, setFortuneGenerateAmount] = useState(spellData.fortuneGenerateAmount || 1);
  const [fortuneConsume, setFortuneConsume] = useState(spellData.fortuneConsume || false);
  const [fortuneEnhanceEffect, setFortuneEnhanceEffect] = useState(spellData.fortuneEnhanceEffect || '');
  const [rageGenerate, setRageGenerate] = useState(spellData.rageGenerate || false);
  const [rageGenerateAmount, setRageGenerateAmount] = useState(spellData.rageGenerateAmount || 5);
  const [rageRequired, setRageRequired] = useState(spellData.rageRequired || false);
  const [rageEnhanced, setRageEnhanced] = useState(spellData.rageEnhanced || false);
  const [rageEnhanceEffect, setRageEnhanceEffect] = useState(spellData.rageEnhanceEffect || '');
  
  // Validation
  const [isValid, setIsValid] = useState(false);
  const [validCastTime, setValidCastTime] = useState(true);
  const [validCooldown, setValidCooldown] = useState(true);
  
  // Update validation status
// First effect only for validation
useEffect(() => {
  // Validation rules
  const isCastTimeValid = castTimeType === 'instant' || 
                         (castTimeType === 'channeled' && channelMaxTime > 0) ||
                         (castTimeValue > 0);
                         
  const isCooldownValid = cooldownCategory === 'instant' || 
                         cooldownCategory === 'encounter' || 
                         cooldownCategory === 'daily' ||
                         (cooldownValue > 0);
  
  // Check if at least one resource is selected with cost
  const hasResourceCost = Object.values(resourceCosts).some(cost => cost.baseAmount > 0);
  
  setValidCastTime(isCastTimeValid);
  setValidCooldown(isCooldownValid);
  
  const valid = isCastTimeValid && isCooldownValid && 
               (selectedResources.length > 0 || useHealthResource) &&
               hasResourceCost;
  
  setIsValid(valid);
  setStepValidation(2, valid); // Use numeric index instead of string key
}, [
  selectedResources, useHealthResource, castTimeType, castTimeValue, 
  channelMaxTime, cooldownCategory, cooldownValue, resourceCosts
]);

// Second effect only for data updates
useEffect(() => {
  updateSpellData({
    resourceSystem: selectedResources.join(','),
    useHealthAsResource: useHealthResource,
    cooldownCategory,
    cooldownValue: Number(cooldownValue),
    cooldownUnit,
    costScalingType,
    castTimeType,
    castTimeValue: Number(castTimeValue),
    channelMaxTime: Number(channelMaxTime),
    triggersGlobalCooldown: globalCooldown,
    resourceCosts,
    
    // Class-specific mechanics
    fortuneGenerate,
    fortuneGenerateAmount: Number(fortuneGenerateAmount),
    fortuneConsume,
    fortuneEnhanceEffect,
    rageGenerate,
    rageGenerateAmount: Number(rageGenerateAmount),
    rageRequired,
    rageEnhanced,
    rageEnhanceEffect
  });
}, [
  selectedResources, useHealthResource, cooldownCategory, cooldownValue, cooldownUnit,
  costScalingType, castTimeType, castTimeValue, channelMaxTime, globalCooldown,
  resourceCosts, fortuneGenerate, fortuneGenerateAmount, fortuneConsume, fortuneEnhanceEffect,
  rageGenerate, rageGenerateAmount, rageRequired, rageEnhanced, rageEnhanceEffect,
  updateSpellData
]);
  
  // Handle health resource toggle
  const handleHealthResourceToggle = () => {
    setUseHealthResource(prev => {
      const newValue = !prev;
      
      // Add or remove health cost
      if (newValue) {
        setResourceCosts(prev => ({
          ...prev,
          health: {
            baseAmount: 5,
            scalingAmount: 0,
            scalingFormula: '',
            variableMin: 0,
            variableMax: 0,
            costType: 'flat'
          }
        }));
      } else {
        setResourceCosts(prev => {
          const newCosts = { ...prev };
          delete newCosts.health;
          return newCosts;
        });
      }
      
      return newValue;
    });
  };
  
  // Handle resource cost change
  const handleResourceCostChange = (resourceId, field, value) => {
    setResourceCosts(prev => ({
      ...prev,
      [resourceId]: {
        ...prev[resourceId],
        [field]: typeof value === 'number' ? Number(value) : value
      }
    }));
  };
  
  // Get resource name by ID
  const getResourceName = (resourceId) => {
    if (resourceId === 'health') return 'Health';
    
    const resource = availableResources.find(r => r.id === resourceId);
    return resource ? resource.name : resourceId;
  };
  
  // Get resource color by ID
  const getResourceColor = (resourceId) => {
    if (resourceId === 'health') return '#e74c3c'; // Health is red
    
    const resource = availableResources.find(r => r.id === resourceId);
    return resource?.color || '#3498db'; // Default blue if no color specified
  };
  
  return (
    <div className="resource-system-step">
      <div className="section">
        <h4 className="section-title">Resource Systems</h4>
        <p className="section-description">
          Choose which resources this spell will use. Each class has unique resource mechanics.
        </p>
        
        <ResourceSelector 
          selectedResources={resourceCosts}
          onChange={(newResourceCosts) => {
            setSelectedResources(Object.keys(newResourceCosts).filter(key => key !== 'health'));
            setResourceCosts(newResourceCosts);
          }}
        />
        
        {/* Health resource option */}
        <div className="health-resource-option">
          <label className="checkbox-container">
            <input 
              type="checkbox" 
              checked={useHealthResource} 
              onChange={handleHealthResourceToggle}
            />
            <span className="checkbox-text">Use Health as a Resource</span>
          </label>
          <p className="option-description">
            When enabled, this spell can cost health instead of or in addition to other resources.
            Useful for blood magic, sacrifice abilities, or desperation moves.
          </p>
        </div>
      </div>
      
      <div className="section">
        <h4 className="section-title">Resource Costs</h4>
        <p className="section-description">
          Define how much of each resource this spell costs to cast.
        </p>
        
        <div className="cost-scaling-options">
          <label>Cost Scaling Type:</label>
          <div className="scaling-options">
            {COST_SCALING_OPTIONS.map(option => (
              <div 
                key={option.id}
                className={`scaling-option ${costScalingType === option.id ? 'selected' : ''}`}
                onClick={() => setCostScalingType(option.id)}
              >
                <div className="scaling-name">{option.name}</div>
                <div className="scaling-description">{option.description}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="resource-costs-container">
          {/* Show inputs for each selected resource */}
          {selectedResources.map(resourceId => {
            const resourceCost = resourceCosts[resourceId] || { baseAmount: 0 };
            
            return (
              <div 
                key={resourceId} 
                className="resource-cost-item"
                style={{ '--resource-color': getResourceColor(resourceId) }}
              >
                <div className="resource-cost-header">
                  <h5>{getResourceName(resourceId)} Cost</h5>
                </div>
                
                <div className="resource-cost-inputs">
                  <div className="cost-input-group">
                    <label>Base Cost:</label>
                    <input
                      type="number"
                      min="0"
                      value={resourceCost.baseAmount}
                      onChange={(e) => handleResourceCostChange(
                        resourceId, 
                        'baseAmount', 
                        Math.max(0, Number(e.target.value))
                      )}
                      className="cost-input"
                    />
                  </div>
                  
                  {costScalingType === 'scaling' && (
                    <div className="cost-input-group">
                      <label>Scaling Formula:</label>
                      <input
                        type="text"
                        value={resourceCost.scalingFormula || ''}
                        onChange={(e) => handleResourceCostChange(
                          resourceId, 
                          'scalingFormula', 
                          e.target.value
                        )}
                        placeholder="e.g., +2 per level"
                        className="formula-input"
                      />
                    </div>
                  )}
                  
                  {costScalingType === 'variable' && (
                    <div className="variable-cost-inputs">
                      <div className="cost-input-group">
                        <label>Minimum Cost:</label>
                        <input
                          type="number"
                          min="0"
                          value={resourceCost.variableMin || 0}
                          onChange={(e) => handleResourceCostChange(
                            resourceId, 
                            'variableMin', 
                            Math.max(0, Number(e.target.value))
                          )}
                          className="cost-input"
                        />
                      </div>
                      <div className="cost-input-group">
                        <label>Maximum Cost:</label>
                        <input
                          type="number"
                          min="0"
                          value={resourceCost.variableMax || 0}
                          onChange={(e) => handleResourceCostChange(
                            resourceId, 
                            'variableMax', 
                            Math.max(0, Number(e.target.value))
                          )}
                          className="cost-input"
                        />
                      </div>
                    </div>
                  )}
                  
                  {costScalingType === 'conditional' && (
                    <div className="cost-input-group">
                      <label>Condition Description:</label>
                      <input
                        type="text"
                        value={resourceCost.condition || ''}
                        onChange={(e) => handleResourceCostChange(
                          resourceId, 
                          'condition', 
                          e.target.value
                        )}
                        placeholder="e.g., Costs 50% less while under 30% health"
                        className="condition-input"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
          
          {/* Health cost section if enabled */}
          {useHealthResource && (
            <div 
              className="resource-cost-item health-cost"
              style={{ '--resource-color': '#e74c3c' }}
            >
              <div className="resource-cost-header">
                <h5>Health Cost</h5>
              </div>
              
              <div className="resource-cost-inputs">
                <div className="cost-input-group">
                  <label>Health Cost:</label>
                  <input
                    type="number"
                    min="0"
                    value={resourceCosts.health?.baseAmount || 0}
                    onChange={(e) => handleResourceCostChange(
                      'health', 
                      'baseAmount', 
                      Math.max(0, Number(e.target.value))
                    )}
                    className="cost-input"
                  />
                </div>
                
                <div className="cost-input-group">
                  <label>Health Cost Type:</label>
                  <select
                    value={resourceCosts.health?.costType || 'flat'}
                    onChange={(e) => handleResourceCostChange('health', 'costType', e.target.value)}
                    className="cost-type-select"
                  >
                    <option value="flat">Flat Amount</option>
                    <option value="percentage">Percentage of Max Health</option>
                    <option value="current">Percentage of Current Health</option>
                  </select>
                </div>
                
                {resourceCosts.health?.costType === 'percentage' || resourceCosts.health?.costType === 'current' ? (
                  <div className="health-percentage-note">
                    Note: For percentage costs, enter values between 1-100.
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="section">
        <h4 className="section-title">Cast Time</h4>
        <p className="section-description">
          Define how long it takes to cast this spell.
        </p>
        
        <div className="cast-time-options">
          {CAST_TIME_OPTIONS.map(option => (
            <div 
              key={option.id}
              className={`cast-time-option ${castTimeType === option.id ? 'selected' : ''}`}
              onClick={() => setCastTimeType(option.id)}
            >
              <div className="cast-time-name">{option.name}</div>
              <div className="cast-time-description">{option.description}</div>
            </div>
          ))}
        </div>
        
        {castTimeType !== 'instant' && (
          <div className="cast-time-value-container">
            {(castTimeType === 'short' || castTimeType === 'medium' || castTimeType === 'long') && (
              <div className="cast-time-group">
                <label>Cast Time (seconds):</label>
                <input
                  type="number"
                  min="0.1"
                  step="0.1"
                  value={castTimeValue}
                  onChange={(e) => setCastTimeValue(Math.max(0.1, Number(e.target.value)))}
                  className="cast-time-input"
                />
              </div>
            )}
            
            {castTimeType === 'channeled' && (
              <div className="cast-time-group">
                <label>Maximum Channel Duration (seconds):</label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={channelMaxTime}
                  onChange={(e) => setChannelMaxTime(Math.max(0.5, Number(e.target.value)))}
                  className="channel-time-input"
                />
              </div>
            )}
            
            {castTimeType === 'charged' && (
              <div className="cast-time-group">
                <label>Maximum Charge Time (seconds):</label>
                <input
                  type="number"
                  min="0.5"
                  step="0.5"
                  value={channelMaxTime}
                  onChange={(e) => setChannelMaxTime(Math.max(0.5, Number(e.target.value)))}
                  className="channel-time-input"
                />
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="section">
        <h4 className="section-title">Cooldown</h4>
        <p className="section-description">
          Define how frequently your spell can be cast.
        </p>
        
        <div className="cooldown-categories">
          {COOLDOWN_CATEGORIES.map(category => (
            <div 
              key={category.id}
              className={`cooldown-category ${cooldownCategory === category.id ? 'selected' : ''}`}
              onClick={() => setCooldownCategory(category.id)}
            >
              <div className="cooldown-name">{category.name}</div>
              <div className="cooldown-description">{category.description}</div>
              <div className="cooldown-examples">
                <span>Examples: </span>
                {category.examples.join(', ')}
              </div>
            </div>
          ))}
        </div>
        
        {cooldownCategory !== 'instant' && (
          <div className="cooldown-value-container">
            <div className="cooldown-value-group">
              <label>Specific Cooldown:</label>
              <div className="cooldown-inputs">
                <input
                  type="number"
                  min="0"
                  value={cooldownValue}
                  onChange={(e) => setCooldownValue(Math.max(0, Number(e.target.value)))}
                  className="cooldown-input"
                />
                <select
                  value={cooldownUnit}
                  onChange={(e) => setCooldownUnit(e.target.value)}
                  className="cooldown-unit"
                >
                  <option value="seconds">Seconds</option>
                  <option value="rounds">Combat Rounds</option>
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                </select>
              </div>
            </div>
            
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="global-cooldown"
                checked={globalCooldown}
                onChange={() => setGlobalCooldown(prev => !prev)}
              />
              <label htmlFor="global-cooldown">Triggers Global Cooldown</label>
              <div className="gcd-description">
                If checked, this spell will trigger the global cooldown (typically 1-1.5 seconds)
                preventing other spells from being cast immediately after.
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Class-specific mechanics based on selected class */}
      {spellData.class === 'gambler' || spellData.class === 'fateweaver' ? (
        <div className="section">
          <h4 className="section-title">Fortune Point Mechanics</h4>
          <p className="section-description">
            As a {spellData.class === 'gambler' ? 'Gambler' : 'Fate Weaver'}, this spell can interact with Fortune Points in special ways.
          </p>
          
          <div className="fortune-mechanics">
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="fortune-generate"
                checked={fortuneGenerate}
                onChange={() => setFortuneGenerate(prev => !prev)}
              />
              <label htmlFor="fortune-generate">Generates Fortune Points</label>
            </div>
            
            {fortuneGenerate && (
              <div className="fortune-input-group">
                <label>Points Generated:</label>
                <input
                  type="number"
                  min="1"
                  max="3"
                  value={fortuneGenerateAmount}
                  onChange={(e) => setFortuneGenerateAmount(Math.min(3, Math.max(1, Number(e.target.value))))}
                  className="fortune-input"
                />
              </div>
            )}
            
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="fortune-consume"
                checked={fortuneConsume}
                onChange={() => setFortuneConsume(prev => !prev)}
              />
              <label htmlFor="fortune-consume">Consumes Fortune Points for Enhanced Effect</label>
            </div>
            
            {fortuneConsume && (
              <div className="fortune-enhance-description">
                <label>Enhanced Effect Description:</label>
                <textarea
                  value={fortuneEnhanceEffect}
                  onChange={(e) => setFortuneEnhanceEffect(e.target.value)}
                  placeholder="Describe how the spell is enhanced when Fortune Points are consumed..."
                  className="fortune-enhance-input"
                  rows={3}
                />
              </div>
            )}
          </div>
        </div>
      ) : null}
      
      {/* Berserker Rage mechanics */}
      {spellData.class === 'berserker' && (
        <div className="section">
          <h4 className="section-title">Rage Mechanics</h4>
          <p className="section-description">
            As a Berserker, this spell can interact with the Rage system in special ways.
          </p>
          
          <div className="rage-mechanics">
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="rage-generate"
                checked={rageGenerate}
                onChange={() => setRageGenerate(prev => !prev)}
              />
              <label htmlFor="rage-generate">Generates Rage</label>
            </div>
            
            {rageGenerate && (
              <div className="rage-input-group">
                <label>Rage Generated:</label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  value={rageGenerateAmount}
                  onChange={(e) => setRageGenerateAmount(Math.min(20, Math.max(1, Number(e.target.value))))}
                  className="rage-input"
                />
              </div>
            )}
            
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="rage-required"
                checked={rageRequired}
                onChange={() => setRageRequired(prev => !prev)}
              />
              <label htmlFor="rage-required">Requires Rage to Cast</label>
            </div>
            
            <div className="checkbox-container">
              <input
                type="checkbox"
                id="rage-enhanced"
                checked={rageEnhanced}
                onChange={() => setRageEnhanced(prev => !prev)}
              />
              <label htmlFor="rage-enhanced">Enhanced While at High Rage</label>
            </div>
            
            {rageEnhanced && (
              <div className="rage-enhance-description">
                <label>Enhanced Effect Description:</label>
                <textarea
                  value={rageEnhanceEffect}
                  onChange={(e) => setRageEnhanceEffect(e.target.value)}
                  placeholder="Describe how the spell is enhanced at high Rage levels..."
                  className="rage-enhance-input"
                  rows={3}
                />
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Validation message */}
      {!isValid && (
        <div className="validation-message">
          {selectedResources.length === 0 && !useHealthResource ? (
            <p>Please select at least one resource for your spell.</p>
          ) : Object.values(resourceCosts).every(cost => cost.baseAmount === 0) ? (
            <p>Please specify at least one resource cost for your spell.</p>
          ) : !validCastTime ? (
            <p>Please specify a valid cast time for your spell.</p>
          ) : !validCooldown ? (
            <p>Please specify a valid cooldown for your spell.</p>
          ) : (
            <p>Please complete all required fields to proceed.</p>
          )}
        </div>
      )}
      
      <StepNavigation 
  currentStep={2} 
  totalSteps={8} 
  onNext={() => isValid && nextStep()} 
  onPrev={prevStep} 
  isNextEnabled={isValid}
/>
    </div>
  );
};

export default Step3ResourceSystem;