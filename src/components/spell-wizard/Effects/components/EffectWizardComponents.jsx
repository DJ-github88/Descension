import React, { useState, useEffect, useCallback } from 'react';
import { 
  EFFECT_TYPES, 
  DAMAGE_TYPES, 
  DURATION_TYPES, 
  TARGETING_TYPES, 
  AOE_SHAPES,
  PRIMARY_STAT_MODIFIERS,
  SECONDARY_STAT_MODIFIERS,
  COMBAT_STAT_MODIFIERS,
  POSITIVE_STATUS_EFFECTS,
  NEGATIVE_STATUS_EFFECTS,
  REFLECTION_DAMAGE_TYPES,
  ABSORPTION_SHIELD_TYPES,
  CRITICAL_EFFECT_MODIFIERS,
  getWowIconPath
} from './effectSystemData';

import {
  SPELL_TEMPLATES,
  CHAIN_EFFECT_PROPERTIES,
  EnhancedEffectUtils
} from './enhancedEffectSystemData';

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
  WIZARD_STEPS,
  getWizardFlow,
  validateStep,
  getStepStatus,
  getStepInfo,
  getPreviousStep,
  getNextStep,
  canNavigateToStep
} from './EffectWizardSteps';

/**
 * WizardStepContainer - Container for each wizard step with header and validation
 */
export const WizardStepContainer = ({ 
  stepId, 
  currentStepId,
  flow, 
  state, 
  children 
}) => {
  const { title, description, icon } = getStepInfo(stepId);
  const status = getStepStatus(stepId, currentStepId, flow, state);
  
  return (
    <div className={`wizard-step ${status}`}>
      <div className="wizard-step-header">
        <div className="step-icon">
          <img src={getWowIconPath(icon)} alt={title} />
        </div>
        <div className="step-info">
          <h2>{title}</h2>
          <p>{description}</p>
        </div>
        {status === 'invalid' && (
          <div className="validation-error">
            <i className="error-icon" />
            <span>This step has validation errors</span>
          </div>
        )}
      </div>
      <div className="wizard-step-content">
        {children}
      </div>
    </div>
  );
};

/**
 * WizardNavigation - Navigation component with progress indicators
 */
export const WizardNavigation = ({ 
  currentStepId, 
  flow, 
  state, 
  onNavigate 
}) => {
  const isFirstStep = flow.indexOf(currentStepId) === 0;
  const isLastStep = flow.indexOf(currentStepId) === flow.length - 1;
  const prevStep = getPreviousStep(currentStepId, flow);
  const nextStep = getNextStep(currentStepId, flow);
  const canGoNext = nextStep && canNavigateToStep(nextStep, currentStepId, flow, state);
  
  return (
    <div className="wizard-navigation">
      <div className="wizard-progress">
        {flow.map((stepId) => {
          const status = getStepStatus(stepId, currentStepId, flow, state);
          const { title } = getStepInfo(stepId);
          
          return (
            <div 
              key={stepId}
              className={`progress-step ${status}`}
              onClick={() => status !== 'disabled' && onNavigate(stepId)}
              title={title}
            >
              <div className="step-indicator" />
              <span className="step-label">{title}</span>
            </div>
          );
        })}
      </div>
      
      <div className="wizard-controls">
        <button
          className="btn-previous"
          disabled={isFirstStep}
          onClick={() => prevStep && onNavigate(prevStep)}
        >
          Previous
        </button>
        
        <button
          className="btn-next"
          disabled={!canGoNext}
          onClick={() => canGoNext && onNavigate(nextStep)}
        >
          {isLastStep ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

/**
 * EffectTypeSelector - Component for selecting effect types
 */
export const EffectTypeSelector = ({ 
  selectedEffects, 
  onChange 
}) => {
  const handleToggle = (effectId) => {
    if (selectedEffects.includes(effectId)) {
      onChange(selectedEffects.filter(id => id !== effectId));
    } else {
      onChange([...selectedEffects, effectId]);
    }
  };
  
  return (
    <div className="effect-type-selector">
      <div className="effect-type-grid">
        {EFFECT_TYPES.map(effect => (
          <div 
            key={effect.id}
            className={`effect-type-card ${selectedEffects.includes(effect.id) ? 'selected' : ''}`}
            onClick={() => handleToggle(effect.id)}
          >
            <div className="effect-icon">
              <img src={getWowIconPath(effect.icon)} alt={effect.name} />
            </div>
            <div className="effect-info">
              <h3>{effect.name}</h3>
              <p>{effect.description}</p>
              <span className="ap-cost">{effect.actionPointCost} AP</span>
            </div>
          </div>
        ))}
      </div>
      
      {selectedEffects.length > 0 && (
        <div className="selected-effects-summary">
          <h3>Selected Effects</h3>
          <div className="selected-effects-list">
            {selectedEffects.map(effectId => {
              const effect = EFFECT_TYPES.find(e => e.id === effectId);
              return (
                <div key={effectId} className="selected-effect-tag">
                  <img 
                    src={getWowIconPath(effect.icon)} 
                    alt={effect.name}
                    className="mini-icon" 
                  />
                  <span>{effect.name}</span>
                  <button onClick={() => handleToggle(effectId)}>×</button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * TemplateSelector - Component for selecting spell templates
 */
export const TemplateSelector = ({ 
  selectedEffects, 
  onSelectTemplate 
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [previewTemplate, setPreviewTemplate] = useState(null);
  
  // Filter templates based on selected effect types
  const compatibleTemplates = SPELL_TEMPLATES.filter(template => 
    template.effectTypes.some(effectType => selectedEffects.includes(effectType))
  );
  
  const handlePreview = (templateId) => {
    const template = SPELL_TEMPLATES.find(t => t.id === templateId);
    setPreviewTemplate(template);
  };
  
  const handleSelect = () => {
    if (selectedTemplate) {
      onSelectTemplate(selectedTemplate);
    }
  };
  
  return (
    <div className="template-selector">
      <div className="template-list">
        <h3>Compatible Templates</h3>
        {compatibleTemplates.length === 0 ? (
          <p className="no-templates">
            No templates available for the selected effect types.
          </p>
        ) : (
          <div className="template-grid">
            {compatibleTemplates.map(template => (
              <div 
                key={template.id}
                className={`template-card ${selectedTemplate === template.id ? 'selected' : ''}`}
                onClick={() => {
                  setSelectedTemplate(template.id);
                  handlePreview(template.id);
                }}
              >
                <div className="template-icon">
                  <img src={getWowIconPath(template.icon)} alt={template.name} />
                </div>
                <div className="template-info">
                  <h3>{template.name}</h3>
                  <p>Level {template.level}</p>
                  <div className="template-effects">
                    {template.effectTypes.map(effectId => {
                      const effect = EFFECT_TYPES.find(e => e.id === effectId);
                      return (
                        <span key={effectId} className="effect-tag">
                          <img 
                            src={getWowIconPath(effect.icon)} 
                            alt={effect.name}
                            className="mini-icon" 
                          />
                          {effect.name}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {previewTemplate && (
        <div className="template-preview">
          <h3>Template Preview</h3>
          <div className="preview-card">
            <div className="preview-header">
              <img 
                src={getWowIconPath(previewTemplate.icon)} 
                alt={previewTemplate.name}
                className="preview-icon" 
              />
              <div>
                <h3>{previewTemplate.name}</h3>
                <p>Level {previewTemplate.level}</p>
              </div>
            </div>
            
            <p className="preview-description">{previewTemplate.description}</p>
            
            <div className="preview-stats">
              {previewTemplate.damageConfig && (
                <div className="preview-stat">
                  <strong>Damage:</strong> {previewTemplate.damageConfig.diceNotation} 
                  {previewTemplate.damageConfig.damageTypes.join(', ')}
                </div>
              )}
              
              {previewTemplate.healingConfig && (
                <div className="preview-stat">
                  <strong>Healing:</strong> {previewTemplate.healingConfig.diceNotation}
                </div>
              )}
              
              <div className="preview-stat">
                <strong>Targeting:</strong> {
                  TARGETING_TYPES.find(t => 
                    t.id === previewTemplate.targetingConfig.targetingType
                  )?.name
                }
                {previewTemplate.targetingConfig.areaShape && (
                  <span> ({previewTemplate.targetingConfig.areaShape}, {previewTemplate.targetingConfig.areaSize}ft)</span>
                )}
              </div>
              
              <div className="preview-stat">
                <strong>Duration:</strong> {
                  DURATION_TYPES.find(d => 
                    d.id === previewTemplate.durationConfig.durationType
                  )?.name
                }
                {previewTemplate.durationConfig.requiresConcentration && (
                  <span> (Concentration)</span>
                )}
              </div>
            </div>
            
            <button 
              className="btn-apply-template"
              onClick={handleSelect}
            >
              Apply Template
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * DiceCalculator - Advanced component for dice input with preview
 */
export const DiceCalculator = ({ 
  value, 
  onChange, 
  label = "Dice Notation", 
  placeholder = "e.g. 2d6+3"
}) => {
  const [localValue, setLocalValue] = useState(value || '');
  const [isValid, setIsValid] = useState(true);
  const [preview, setPreview] = useState(null);
  
  useEffect(() => {
    setLocalValue(value || '');
  }, [value]);
  
  useEffect(() => {
    if (localValue && isValidDiceNotation(localValue)) {
      setIsValid(true);
      setPreview({
        min: getMinRoll(localValue),
        max: getMaxRoll(localValue),
        avg: getAverageRoll(localValue)
      });
    } else if (localValue) {
      setIsValid(false);
      setPreview(null);
    } else {
      setIsValid(true);
      setPreview(null);
    }
  }, [localValue]);
  
  const handleChange = (e) => {
    const newValue = e.target.value;
    setLocalValue(newValue);
    
    if (isValidDiceNotation(newValue) || newValue === '') {
      onChange(newValue);
    }
  };
  
  const handleSuggestion = (suggestion) => {
    setLocalValue(suggestion);
    onChange(suggestion);
  };
  
  const suggestions = ['1d4', '1d6', '1d8', '1d10', '1d12', '1d20', '2d6', '3d6', '4d6', '2d8', '2d10'];
  
  return (
    <div className="dice-calculator">
      <div className="dice-input-group">
        <label>{label}</label>
        <input
          type="text"
          value={localValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={isValid ? '' : 'invalid'}
        />
        {!isValid && <span className="error-message">Invalid dice notation</span>}
      </div>
      
      {preview && (
        <div className="dice-preview">
          <div className="dice-range">
            <span>Min: {preview.min}</span>
            <span>Avg: {preview.avg.toFixed(1)}</span>
            <span>Max: {preview.max}</span>
          </div>
          <div className="dice-range-bar">
            <div 
              className="dice-range-indicator" 
              style={{ 
                left: `${(preview.avg - preview.min) / (preview.max - preview.min) * 100}%` 
              }}
            />
          </div>
        </div>
      )}
      
      <div className="dice-suggestions">
        <span>Common dice:</span>
        <div className="suggestion-tags">
          {suggestions.map(suggestion => (
            <button
              key={suggestion}
              onClick={() => handleSuggestion(suggestion)}
              className={localValue === suggestion ? 'active' : ''}
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * DamageTypeSelector - Component for selecting damage types
 */
export const DamageTypeSelector = ({ 
  selectedTypes, 
  onChange, 
  maxSelections = null 
}) => {
  // Group damage types by category
  const categories = {};
  DAMAGE_TYPES.forEach(type => {
    if (!categories[type.category]) {
      categories[type.category] = [];
    }
    categories[type.category].push(type);
  });
  
  const handleToggle = (typeId) => {
    if (selectedTypes.includes(typeId)) {
      onChange(selectedTypes.filter(id => id !== typeId));
    } else if (!maxSelections || selectedTypes.length < maxSelections) {
      onChange([...selectedTypes, typeId]);
    }
  };
  
  return (
    <div className="damage-type-selector">
      {maxSelections && (
        <div className="selection-limit">
          <span>Select up to {maxSelections} damage types</span>
          <span className="selection-counter">{selectedTypes.length}/{maxSelections}</span>
        </div>
      )}
      
      {Object.entries(categories).map(([category, types]) => (
        <div key={category} className="damage-category">
          <h3 className="category-header">{category.charAt(0).toUpperCase() + category.slice(1)}</h3>
          <div className="damage-type-grid">
            {types.map(type => (
              <div 
                key={type.id}
                className={`damage-type-card ${selectedTypes.includes(type.id) ? 'selected' : ''}`}
                onClick={() => handleToggle(type.id)}
              >
                <div className="damage-icon">
                  <img src={getWowIconPath(type.icon)} alt={type.name} />
                </div>
                <div className="damage-info">
                  <h3>{type.name}</h3>
                  <p>{type.description}</p>
                </div>
                {selectedTypes.includes(type.id) && (
                  <div className="selected-indicator">✓</div>
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * ReflectiveDamageConfig - Component for configuring damage reflection
 */
export const ReflectiveDamageConfig = ({ 
  config, 
  onChange 
}) => {
  const handleTypeChange = (reflectionTypeId) => {
    const reflectionType = REFLECTION_DAMAGE_TYPES.find(type => type.id === reflectionTypeId);
    onChange({ 
      ...config, 
      reflectionType: reflectionTypeId,
      reflectionMultiplier: reflectionType?.reflectionMultiplier || 1.0
    });
  };
  
  const handleAmountChange = (amount) => {
    onChange({ 
      ...config, 
      reflectionAmount: parseInt(amount, 10) || 0 
    });
  };
  
  return (
    <div className="reflective-damage-config">
      <h3>Damage Reflection</h3>
      
      <div className="reflection-type">
        <label>Reflection Type</label>
        <select 
          value={config.reflectionType || ''}
          onChange={(e) => handleTypeChange(e.target.value)}
        >
          <option value="">Select Reflection Type</option>
          {REFLECTION_DAMAGE_TYPES.map(type => (
            <option key={type.id} value={type.id}>
              {type.name} - {type.description}
            </option>
          ))}
        </select>
      </div>
      
      {config.reflectionType && (
        <>
          <div className="reflection-multiplier">
            <label>Reflection Multiplier</label>
            <div className="multiplier-display">
              {(config.reflectionMultiplier * 100).toFixed(0)}% of incoming damage
            </div>
          </div>
          
          <div className="reflection-amount">
            <label>Fixed Damage Addition</label>
            <input 
              type="number" 
              min="0" 
              value={config.reflectionAmount || 0}
              onChange={(e) => handleAmountChange(e.target.value)}
            />
            <p className="helper-text">
              Additional flat damage added to reflection
            </p>
          </div>
          
          {REFLECTION_DAMAGE_TYPES.find(type => type.id === config.reflectionType)?.needsDamageType && (
            <div className="reflection-damage-type">
              <label>Convert to Damage Type</label>
              <select
                value={config.conversionType || ''}
                onChange={(e) => onChange({ ...config, conversionType: e.target.value })}
              >
                <option value="">Select Damage Type</option>
                {DAMAGE_TYPES.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
          )}
        </>
      )}
    </div>
  );
};

/**
 * AbsorptionShieldConfig - Component for shield configuration
 */
export const AbsorptionShieldConfig = ({ 
  config, 
  onChange 
}) => {
  const handleShieldTypeChange = (shieldTypeId) => {
    onChange({ 
      ...config, 
      shieldType: shieldTypeId 
    });
  };
  
  const handleReflectionToggle = (enabled) => {
    onChange({ 
      ...config, 
      useReflection: enabled,
      reflectionType: enabled ? config.reflectionType || 'same' : null,
      reflectionAmount: enabled ? config.reflectionAmount || 0 : 0
    });
  };
  
  const handleReflectionConfig = (reflectionConfig) => {
    onChange({ 
      ...config, 
      reflectionType: reflectionConfig.reflectionType,
      reflectionAmount: reflectionConfig.reflectionAmount,
      conversionType: reflectionConfig.conversionType
    });
  };
  
  return (
    <div className="absorption-shield-config">
      <div className="shield-type">
        <label>Shield Type</label>
        <select 
          value={config.shieldType || ''}
          onChange={(e) => handleShieldTypeChange(e.target.value)}
        >
          <option value="">Select Shield Type</option>
          {ABSORPTION_SHIELD_TYPES.map(type => (
            <option key={type.id} value={type.id}>
              {type.name} - {type.description}
            </option>
          ))}
        </select>
      </div>
      
      {config.shieldType && (
        <>
          <div className="shield-amount">
            <DiceCalculator
              label="Shield Amount"
              value={config.shieldAmount}
              onChange={(value) => onChange({ ...config, shieldAmount: value })}
              placeholder="e.g. 3d8+5"
            />
          </div>
          
          <div className="shield-reflection">
            <div className="reflection-toggle">
              <label>
                <input
                  type="checkbox"
                  checked={config.useReflection || false}
                  onChange={(e) => handleReflectionToggle(e.target.checked)}
                />
                Enable Damage Reflection
              </label>
            </div>
            
            {config.useReflection && (
              <ReflectiveDamageConfig
                config={{
                  reflectionType: config.reflectionType,
                  reflectionAmount: config.reflectionAmount,
                  reflectionMultiplier: config.reflectionMultiplier,
                  conversionType: config.conversionType
                }}
                onChange={handleReflectionConfig}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
};

/**
 * LifeStealConfig - Component for life steal configuration
 */
export const LifeStealConfig = ({ 
  config, 
  onChange 
}) => {
  const handlePercentChange = (percent) => {
    const value = parseInt(percent, 10);
    onChange({ 
      ...config, 
      lifeStealPercent: isNaN(value) ? 0 : Math.min(100, Math.max(0, value)) 
    });
  };
  
  const handleTypeChange = (type) => {
    onChange({ 
      ...config, 
      lifeStealType: type 
    });
  };
  
  const lifeStealTypes = [
    { id: 'percent', name: 'Percentage Based', description: 'Convert a percentage of damage to healing' },
    { id: 'fixed', name: 'Fixed Amount', description: 'Heal a fixed amount on hit' },
    { id: 'critical', name: 'On Critical', description: 'Life steal only activates on critical hits' }
  ];
  
  return (
    <div className="life-steal-config">
      <h3>Life Steal Configuration</h3>
      
      <div className="life-steal-type">
        <label>Life Steal Type</label>
        <div className="type-options">
          {lifeStealTypes.map(type => (
            <div 
              key={type.id}
              className={`type-option ${config.lifeStealType === type.id ? 'selected' : ''}`}
              onClick={() => handleTypeChange(type.id)}
            >
              <h4>{type.name}</h4>
              <p>{type.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {config.lifeStealType === 'percent' && (
        <div className="life-steal-percent">
          <label>Life Steal Percentage</label>
          <div className="percent-input">
            <input 
              type="number" 
              min="0" 
              max="100" 
              value={config.lifeStealPercent || 0}
              onChange={(e) => handlePercentChange(e.target.value)}
            />
            <span className="percent-sign">%</span>
          </div>
          <div className="percent-slider">
            <input 
              type="range" 
              min="0" 
              max="100" 
              value={config.lifeStealPercent || 0}
              onChange={(e) => handlePercentChange(e.target.value)}
            />
          </div>
        </div>
      )}
      
      {config.lifeStealType === 'fixed' && (
        <div className="life-steal-fixed">
          <DiceCalculator
            label="Healing Amount"
            value={config.lifeStealAmount}
            onChange={(value) => onChange({ ...config, lifeStealAmount: value })}
            placeholder="e.g. 1d6"
          />
        </div>
      )}
      
      {config.lifeStealType === 'critical' && (
        <div className="life-steal-critical">
          <div className="critical-percent">
            <label>Life Steal Percentage on Critical</label>
            <div className="percent-input">
              <input 
                type="number" 
                min="0" 
                max="100" 
                value={config.criticalLifeStealPercent || 0}
                onChange={(e) => onChange({ 
                  ...config, 
                  criticalLifeStealPercent: parseInt(e.target.value, 10) || 0 
                })}
              />
              <span className="percent-sign">%</span>
            </div>
          </div>
          
          <div className="critical-bonus">
            <DiceCalculator
              label="Bonus Healing on Critical"
              value={config.criticalBonusHealing}
              onChange={(value) => onChange({ ...config, criticalBonusHealing: value })}
              placeholder="e.g. 2d6"
            />
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * CriticalEffectConfig - Component for critical hit configuration
 */
export const CriticalEffectConfig = ({ 
  config, 
  onChange 
}) => {
  const handleMultiplierChange = (multiplier) => {
    const value = parseFloat(multiplier);
    onChange({ 
      ...config, 
      criticalMultiplier: isNaN(value) ? 2 : Math.max(1, value) 
    });
  };
  
  const handleDiceOnlyToggle = (diceOnly) => {
    onChange({ 
      ...config, 
      criticalDiceOnly: diceOnly 
    });
  };
  
  const handleEffectToggle = (effectId) => {
    const effects = [...(config.effects || [])];
    const index = effects.indexOf(effectId);
    
    if (index >= 0) {
      effects.splice(index, 1);
    } else {
      effects.push(effectId);
    }
    
    onChange({ ...config, effects });
  };
  
  const handleExtraDiceChange = (extraDice) => {
    onChange({ ...config, extraDice });
  };
  
  return (
    <div className="critical-effect-config">
      <h3>Critical Hit Configuration</h3>
      
      <div className="critical-multiplier">
        <label>Critical Damage Multiplier</label>
        <div className="multiplier-input">
          <select
            value={config.criticalMultiplier || 2}
            onChange={(e) => handleMultiplierChange(e.target.value)}
          >
            <option value="1.5">1.5×</option>
            <option value="2">2×</option>
            <option value="2.5">2.5×</option>
            <option value="3">3×</option>
            <option value="4">4×</option>
          </select>
        </div>
      </div>
      
      <div className="critical-dice-only">
        <label>
          <input
            type="checkbox"
            checked={config.criticalDiceOnly}
            onChange={(e) => handleDiceOnlyToggle(e.target.checked)}
          />
          Only multiply dice (not fixed modifiers)
        </label>
        <p className="helper-text">
          If checked, only the dice portion of the damage is multiplied. For example, with 2d6+3 damage and 2× multiplier:
          {config.criticalDiceOnly ? 
            ' 4d6+3 damage on critical hit' : 
            ' 4d6+6 damage on critical hit'}
        </p>
      </div>
      
      <div className="extra-critical-dice">
        <DiceCalculator
          label="Extra Critical Dice"
          value={config.extraDice || ''}
          onChange={handleExtraDiceChange}
          placeholder="e.g. 2d6"
        />
        <p className="helper-text">
          Additional dice added on critical hit, beyond the multiplier
        </p>
      </div>
      
      <div className="critical-effects">
        <label>Critical Effects</label>
        <p className="helper-text">
          Select special effects that may trigger on critical hits
        </p>
        
        <div className="effects-grid">
          {CRITICAL_EFFECT_MODIFIERS.map(effect => (
            <div 
              key={effect.id}
              className={`effect-card ${config.effects?.includes(effect.id) ? 'selected' : ''}`}
              onClick={() => handleEffectToggle(effect.id)}
            >
              <div className="effect-icon">
                <img src={getWowIconPath(effect.icon)} alt={effect.name} />
              </div>
              <div className="effect-info">
                <h4>{effect.name}</h4>
                <p>{effect.description}</p>
                <span className="effect-chance">{effect.defaultChance}% chance</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="critical-preview">
        <h4>Critical Hit Preview</h4>
        {config.extraDice && isValidDiceNotation(config.extraDice) && (
          <div className="preview-calculation">
            <span>Base damage × {config.criticalMultiplier} + {config.extraDice}</span>
          </div>
        )}
        {config.effects?.length > 0 && (
          <div className="preview-effects">
            <span>May also: </span>
            <ul>
              {config.effects.map(effectId => {
                const effect = CRITICAL_EFFECT_MODIFIERS.find(e => e.id === effectId);
                return effect ? (
                  <li key={effectId}>{effect.name} ({effect.defaultChance}% chance)</li>
                ) : null;
              })}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * ChainEffectConfig - Component for chain effect configuration
 */
export const ChainEffectConfig = ({ 
  config, 
  onChange,
  effectType = 'damage' 
}) => {
  const chainProperties = CHAIN_EFFECT_PROPERTIES[`${effectType}Chain`] || CHAIN_EFFECT_PROPERTIES.damageChain;
  
  const handleTargetsChange = (targets) => {
    const value = parseInt(targets, 10);
    onChange({ 
      ...config, 
      targets: isNaN(value) ? 2 : Math.max(1, value) 
    });
  };
  
  const handleFalloffTypeChange = (falloffType) => {
    onChange({ 
      ...config, 
      falloffType 
    });
  };
  
  const handleFalloffRateChange = (falloffRate) => {
    const value = parseInt(falloffRate, 10);
    onChange({ 
      ...config, 
      falloffRate: isNaN(value) ? 25 : Math.max(0, Math.min(100, value)) 
    });
  };
  
  const handleMinimumDamageChange = (minimumDamage) => {
    onChange({ 
      ...config, 
      minimumDamage 
    });
  };
  
  const handleTargetSelectionChange = (targetingMethod) => {
    onChange({ 
      ...config, 
      targetingMethod 
    });
  };
  
  return (
    <div className="chain-effect-config">
      <h3>{`${effectType.charAt(0).toUpperCase() + effectType.slice(1)} Chain Configuration`}</h3>
      
      <div className="chain-targets">
        <label>Number of Chain Targets</label>
        <input 
          type="number" 
          min="1" 
          value={config.targets || 2}
          onChange={(e) => handleTargetsChange(e.target.value)}
        />
        <div className="targets-slider">
          <input 
            type="range" 
            min="1" 
            max="10" 
            value={config.targets || 2}
            onChange={(e) => handleTargetsChange(e.target.value)}
          />
        </div>
      </div>
      
      <div className="falloff-type">
        <label>Falloff Type</label>
        <select 
          value={config.falloffType || 'percentage'}
          onChange={(e) => handleFalloffTypeChange(e.target.value)}
        >
          {chainProperties.falloffTypes.map(type => (
            <option key={type.id} value={type.id}>{type.name}</option>
          ))}
        </select>
        <p className="helper-text">
          {chainProperties.falloffTypes.find(t => t.id === (config.falloffType || 'percentage'))?.description}
        </p>
      </div>
      
      <div className="falloff-rate">
        <label>Falloff Rate</label>
        <div className="rate-input">
          <input 
            type="number" 
            min="0" 
            max="100" 
            value={config.falloffRate || 25}
            onChange={(e) => handleFalloffRateChange(e.target.value)}
          />
          <span className="percent-sign">%</span>
        </div>
        <div className="rate-slider">
          <input 
            type="range" 
            min="0" 
            max="100" 
            value={config.falloffRate || 25}
            onChange={(e) => handleFalloffRateChange(e.target.value)}
          />
        </div>
      </div>
      
      {effectType === 'damage' && (
        <div className="minimum-damage">
          <DiceCalculator
            label="Minimum Damage"
            value={config.minimumDamage || ''}
            onChange={handleMinimumDamageChange}
            placeholder="e.g. 1d6"
          />
          <p className="helper-text">
            Minimum damage per target, regardless of chain distance
          </p>
        </div>
      )}
      
      <div className="targeting-method">
        <label>Targeting Method</label>
        <select 
          value={config.targetingMethod || (chainProperties.targetSelectionMethods[0]?.id || '')}
          onChange={(e) => handleTargetSelectionChange(e.target.value)}
        >
          {chainProperties.targetSelectionMethods.map(method => (
            <option key={method.id} value={method.id}>{method.name}</option>
          ))}
        </select>
        <p className="helper-text">
          {chainProperties.targetSelectionMethods.find(
            m => m.id === (config.targetingMethod || (chainProperties.targetSelectionMethods[0]?.id || ''))
          )?.description}
        </p>
      </div>
      
      <div className="chain-preview">
        <h4>Chain Effect Preview</h4>
        <div className="chain-visualization">
          {Array.from({ length: Math.min(config.targets || 2, 5) }, (_, i) => (
            <div key={i} className="chain-node">
              <div className="node-index">{i + 1}</div>
              <div className="node-effect">
                {i === 0 ? '100%' : `${Math.max(0, 100 - (i * (config.falloffRate || 25))).toFixed(0)}%`}
              </div>
              {i < (Math.min(config.targets || 2, 5) - 1) && (
                <div className="chain-connector" />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * DurationSelector - Component for duration selection
 */
export const DurationSelector = ({ 
  config, 
  onChange 
}) => {
  const handleDurationTypeChange = (durationType) => {
    const newConfig = { 
      ...config, 
      durationType 
    };
    
    // Reset duration value for instant effects
    if (durationType === 'instant') {
      newConfig.durationValue = 0;
    }
    
    onChange(newConfig);
  };
  
  const handleDurationValueChange = (value) => {
    const durationValue = parseInt(value, 10);
    onChange({ 
      ...config, 
      durationValue: isNaN(durationValue) ? 0 : Math.max(0, durationValue)
    });
  };
  
  const handleConcentrationToggle = (requiresConcentration) => {
    onChange({ 
      ...config, 
      requiresConcentration 
    });
  };
  
  return (
    <div className="duration-selector">
      <div className="duration-type">
        <label>Duration Type</label>
        <div className="duration-type-options">
          {DURATION_TYPES.map(type => (
            <div 
              key={type.id}
              className={`duration-option ${config.durationType === type.id ? 'selected' : ''}`}
              onClick={() => handleDurationTypeChange(type.id)}
            >
              <div className="duration-icon">
                <img src={getWowIconPath(type.icon)} alt={type.name} />
              </div>
              <div className="duration-info">
                <h4>{type.name}</h4>
                <p>{type.description}</p>
                <span className="ap-mod">AP {type.actionPointModifier >= 0 ? '+' : ''}{type.actionPointModifier}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {config.durationType !== 'instant' && (
        <div className="duration-value">
          <label>Duration Value</label>
          <div className="value-input-group">
            <input 
              type="number" 
              min="0" 
              value={config.durationValue || 0}
              onChange={(e) => handleDurationValueChange(e.target.value)}
            />
            <span className="unit-label">{config.durationType}</span>
          </div>
          
          <div className="duration-presets">
            <button onClick={() => handleDurationValueChange(1)}>1</button>
            <button onClick={() => handleDurationValueChange(5)}>5</button>
            <button onClick={() => handleDurationValueChange(10)}>10</button>
            <button onClick={() => handleDurationValueChange(30)}>30</button>
            <button onClick={() => handleDurationValueChange(60)}>60</button>
          </div>
        </div>
      )}
      
      {config.durationType !== 'instant' && 
       config.durationType !== 'permanent' && (
        <div className="concentration-toggle">
          <label>
            <input
              type="checkbox"
              checked={config.requiresConcentration || false}
              onChange={(e) => handleConcentrationToggle(e.target.checked)}
            />
            Requires Concentration
          </label>
          <p className="helper-text">
            Concentration effects end if the caster casts another concentration spell,
            takes damage and fails a saving throw, or becomes incapacitated.
          </p>
        </div>
      )}
      
      <div className="duration-summary">
        <h4>Duration Summary</h4>
        <p>
          {config.durationType === 'instant' ? (
            'Effect occurs once and immediately'
          ) : (
            <>
              Effect lasts for {config.durationValue || 0} {config.durationType}
              {config.requiresConcentration ? ' and requires concentration' : ''}
            </>
          )}
        </p>
      </div>
    </div>
  );
};

/**
 * PersistentEffectConfig - Component for over-time effects
 */
export const PersistentEffectConfig = ({ 
  config, 
  onChange, 
  availableEffects = ['damage', 'healing'] 
}) => {
  const handleIsPersistentToggle = (isPersistent) => {
    onChange({ 
      ...config, 
      isPersistent 
    });
  };
  
  const handlePersistentTypeChange = (persistentType) => {
    onChange({ 
      ...config, 
      persistentType 
    });
  };
  
  const handleTickFrequencyChange = (tickFrequency) => {
    onChange({ 
      ...config, 
      tickFrequency 
    });
  };
  
  const handleTickDurationChange = (value) => {
    const tickDuration = parseInt(value, 10);
    onChange({ 
      ...config, 
      tickDuration: isNaN(tickDuration) ? 0 : Math.max(0, tickDuration)
    });
  };
  
  const handleScalingTypeChange = (scalingType) => {
    onChange({ 
      ...config, 
      scalingType 
    });
  };
  
  const persistentTypes = [
    { id: 'dot', name: 'Damage Over Time', description: 'Deals damage periodically' },
    { id: 'hot', name: 'Healing Over Time', description: 'Heals periodically' },
    { id: 'effect', name: 'Recurring Effect', description: 'Applies effects periodically' },
    { id: 'trigger', name: 'Triggered Effect', description: 'Activates when specific conditions are met' }
  ].filter(type => {
    if (type.id === 'dot') return availableEffects.includes('damage');
    if (type.id === 'hot') return availableEffects.includes('healing');
    return true;
  });
  
  const tickFrequencies = [
    { id: 'start_of_turn', name: 'Start of Turn', description: 'Effect occurs at the start of the target\'s turn' },
    { id: 'end_of_turn', name: 'End of Turn', description: 'Effect occurs at the end of the target\'s turn' },
    { id: 'start_of_round', name: 'Start of Round', description: 'Effect occurs at the start of each round' },
    { id: 'every_6_seconds', name: 'Every 6 Seconds', description: 'Effect occurs every 6 seconds (once per round)' }
  ];
  
  const scalingTypes = [
    { id: 'flat', name: 'Flat', description: 'Effect remains constant' },
    { id: 'increasing', name: 'Increasing', description: 'Effect becomes stronger over time' },
    { id: 'decreasing', name: 'Decreasing', description: 'Effect becomes weaker over time' },
    { id: 'frontloaded', name: 'Front-loaded', description: 'Effect starts strong and decreases' },
    { id: 'backloaded', name: 'Back-loaded', description: 'Effect starts weak and increases' }
  ];
  
  const triggerConditions = [
    { id: 'proximity', name: 'Proximity', description: 'Triggers when creatures move nearby' },
    { id: 'damage_taken', name: 'Damage Taken', description: 'Triggers when target takes damage' },
    { id: 'spell_cast', name: 'Spell Cast', description: 'Triggers when a spell is cast nearby' },
    { id: 'movement', name: 'Movement', description: 'Triggers when target moves' }
  ];
  
  return (
    <div className="persistent-effect-config">
      <div className="persistent-toggle">
        <label>
          <input
            type="checkbox"
            checked={config.isPersistent || false}
            onChange={(e) => handleIsPersistentToggle(e.target.checked)}
          />
          Enable Persistent Effect
        </label>
        <p className="helper-text">
          Persistent effects occur repeatedly over time or are triggered by specific conditions
        </p>
      </div>
      
      {config.isPersistent && (
        <>
          <div className="persistent-type">
            <label>Effect Type</label>
            <div className="type-options">
              {persistentTypes.map(type => (
                <div 
                  key={type.id}
                  className={`type-option ${config.persistentType === type.id ? 'selected' : ''}`}
                  onClick={() => handlePersistentTypeChange(type.id)}
                >
                  <h4>{type.name}</h4>
                  <p>{type.description}</p>
                </div>
              ))}
            </div>
          </div>
          
          {config.persistentType !== 'trigger' ? (
            <>
              <div className="tick-frequency">
                <label>Frequency</label>
                <select 
                  value={config.tickFrequency || ''}
                  onChange={(e) => handleTickFrequencyChange(e.target.value)}
                >
                  <option value="">Select Frequency</option>
                  {tickFrequencies.map(frequency => (
                    <option key={frequency.id} value={frequency.id}>
                      {frequency.name}
                    </option>
                  ))}
                </select>
                <p className="helper-text">
                  {tickFrequencies.find(f => f.id === config.tickFrequency)?.description}
                </p>
              </div>
              
              <div className="tick-duration">
                <label>Number of Occurrences</label>
                <input 
                  type="number" 
                  min="0" 
                  value={config.tickDuration || 0}
                  onChange={(e) => handleTickDurationChange(e.target.value)}
                />
                <p className="helper-text">
                  How many times the effect occurs (0 = until duration ends)
                </p>
              </div>
              
              {['dot', 'hot'].includes(config.persistentType) && (
                <div className="scaling-type">
                  <label>Scaling Type</label>
                  <select 
                    value={config.scalingType || 'flat'}
                    onChange={(e) => handleScalingTypeChange(e.target.value)}
                  >
                    {scalingTypes.map(scaling => (
                      <option key={scaling.id} value={scaling.id}>
                        {scaling.name}
                      </option>
                    ))}
                  </select>
                  <p className="helper-text">
                    {scalingTypes.find(s => s.id === (config.scalingType || 'flat'))?.description}
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="trigger-condition">
              <label>Trigger Condition</label>
              <select 
                value={config.triggerCondition || ''}
                onChange={(e) => onChange({ ...config, triggerCondition: e.target.value })}
              >
                <option value="">Select Trigger Condition</option>
                {triggerConditions.map(condition => (
                  <option key={condition.id} value={condition.id}>
                    {condition.name}
                  </option>
                ))}
              </select>
              <p className="helper-text">
                {triggerConditions.find(c => c.id === config.triggerCondition)?.description}
              </p>
            </div>
          )}
          
          {config.persistentType === 'dot' && config.scalingType && (
            <div className="dot-preview">
              <h4>Damage Over Time Preview</h4>
              <div className="preview-graph">
                {Array.from({ length: 5 }, (_, i) => {
                  let heightPercentage;
                  switch(config.scalingType) {
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
            </div>
          )}
        </>
      )}
    </div>
  );
};

/**
 * StatModifierSelector - Component for stat modification selection
 */
export const StatModifierSelector = ({ 
  selectedModifiers, 
  onChange, 
  statCategories = ['primary', 'secondary', 'combat'],
  maxSelections = null
}) => {
  const handleModifierChange = (statId, value) => {
    const newModifiers = { ...selectedModifiers };
    
    if (value === 0) {
      delete newModifiers[statId];
    } else {
      newModifiers[statId] = value;
    }
    
    onChange(newModifiers);
  };
  
  // Get stats for each category
  const getStats = (category) => {
    switch (category) {
      case 'primary':
        return PRIMARY_STAT_MODIFIERS;
      case 'secondary':
        return SECONDARY_STAT_MODIFIERS;
      case 'combat':
        return COMBAT_STAT_MODIFIERS;
      default:
        return [];
    }
  };
  
  const getCategoryName = (category) => {
    switch (category) {
      case 'primary':
        return 'Primary Attributes';
      case 'secondary':
        return 'Secondary Attributes';
      case 'combat':
        return 'Combat Statistics';
      default:
        return category;
    }
  };
  
  const selectedCount = Object.keys(selectedModifiers).length;
  const canSelectMore = !maxSelections || selectedCount < maxSelections;
  
  return (
    <div className="stat-modifier-selector">
      {maxSelections && (
        <div className="selection-limit">
          <span>Select up to {maxSelections} stats to modify</span>
          <span className="selection-counter">{selectedCount}/{maxSelections}</span>
        </div>
      )}
      
      {statCategories.map(category => (
        <div key={category} className="stat-category">
          <h3>{getCategoryName(category)}</h3>
          <div className="stat-grid">
            {getStats(category).map(stat => {
              const isSelected = selectedModifiers[stat.id] !== undefined;
              const currentValue = selectedModifiers[stat.id] || 0;
              
              return (
                <div 
                  key={stat.id}
                  className={`stat-card ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    if (!isSelected && canSelectMore) {
                      handleModifierChange(stat.id, 1);
                    } else if (isSelected) {
                      handleModifierChange(stat.id, 0);
                    }
                  }}
                >
                  <div className="stat-icon">
                    <img src={getWowIconPath(stat.icon)} alt={stat.name} />
                  </div>
                  <div className="stat-info">
                    <h4>{stat.name}</h4>
                    <p>{stat.description}</p>
                  </div>
                  
                  {isSelected && (
                    <div className="stat-modifier">
                      <button 
                        className="modifier-btn decrease"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleModifierChange(stat.id, currentValue - 1);
                        }}
                      >
                        -
                      </button>
                      <span className="modifier-value">
                        {currentValue > 0 ? '+' : ''}{currentValue}
                      </span>
                      <button 
                        className="modifier-btn increase"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleModifierChange(stat.id, currentValue + 1);
                        }}
                      >
                        +
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}
      
      {selectedCount > 0 && (
        <div className="selected-modifiers">
          <h3>Selected Modifiers</h3>
          <div className="modifiers-list">
            {Object.entries(selectedModifiers).map(([statId, value]) => {
              const stat = [...PRIMARY_STAT_MODIFIERS, ...SECONDARY_STAT_MODIFIERS, ...COMBAT_STAT_MODIFIERS]
                .find(s => s.id === statId);
              
              return stat ? (
                <div key={statId} className="modifier-tag">
                  <img 
                    src={getWowIconPath(stat.icon)} 
                    alt={stat.name}
                    className="mini-icon" 
                  />
                  <span>{stat.name}: {value > 0 ? '+' : ''}{value}</span>
                  <button 
                    onClick={() => handleModifierChange(statId, 0)}
                    className="remove-btn"
                  >
                    ×
                  </button>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
};

/**
 * StatusEffectSelector - Component for status effect selection
 */
export const StatusEffectSelector = ({ 
  selectedEffects, 
  effectParameters, 
  onChange, 
  effectType = 'positive',
  maxSelections = null 
}) => {
  const statusEffects = effectType === 'positive' ? 
    POSITIVE_STATUS_EFFECTS : 
    NEGATIVE_STATUS_EFFECTS;
  
  const handleEffectToggle = (effectId) => {
    let newEffects = [...selectedEffects];
    const index = newEffects.indexOf(effectId);
    
    if (index >= 0) {
      newEffects.splice(index, 1);
      
      // Also remove parameters for this effect
      const newParameters = { ...effectParameters };
      delete newParameters[effectId];
      
      onChange(newEffects, newParameters);
    } else if (!maxSelections || newEffects.length < maxSelections) {
      newEffects.push(effectId);
      
      // Initialize default parameters for this effect
      const effect = statusEffects.find(e => e.id === effectId);
      if (effect && effect.defaultParameters) {
        const newParameters = { ...effectParameters };
        newParameters[effectId] = { ...effect.defaultParameters };
        
        onChange(newEffects, newParameters);
      } else {
        onChange(newEffects, effectParameters);
      }
    }
  };
  
  const handleParameterChange = (effectId, paramName, value) => {
    const newParameters = { 
      ...effectParameters,
      [effectId]: {
        ...(effectParameters[effectId] || {}),
        [paramName]: value
      }
    };
    
    onChange(selectedEffects, newParameters);
  };
  
  const renderParameterInput = (effect, paramName, value) => {
    const param = effect.defaultParameters[paramName];
    
    // If the parameter is a dice notation
    if (paramName.toLowerCase().includes('dice') || 
        (typeof param === 'string' && isValidDiceNotation(param))) {
      return (
        <DiceCalculator
          value={value || ''}
          onChange={(newValue) => handleParameterChange(effect.id, paramName, newValue)}
          placeholder={`e.g. ${param}`}
        />
      );
    }
    
    // If the parameter is a boolean
    if (typeof param === 'boolean') {
      return (
        <label>
          <input
            type="checkbox"
            checked={value || false}
            onChange={(e) => handleParameterChange(effect.id, paramName, e.target.checked)}
          />
          {formatParamName(paramName)}
        </label>
      );
    }
    
    // If the parameter is a number
    if (typeof param === 'number') {
      return (
        <input
          type="number"
          value={value !== undefined ? value : param}
          onChange={(e) => handleParameterChange(
            effect.id, 
            paramName, 
            e.target.value === '' ? '' : Number(e.target.value)
          )}
        />
      );
    }
    
    // Default to text input
    return (
      <input
        type="text"
        value={value || ''}
        onChange={(e) => handleParameterChange(effect.id, paramName, e.target.value)}
        placeholder={param}
      />
    );
  };
  
  const formatParamName = (name) => {
    return name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/_/g, ' ');
  };
  
  return (
    <div className="status-effect-selector">
      {maxSelections && (
        <div className="selection-limit">
          <span>Select up to {maxSelections} status effects</span>
          <span className="selection-counter">{selectedEffects.length}/{maxSelections}</span>
        </div>
      )}
      
      <div className="effects-grid">
        {statusEffects.map(effect => (
          <div 
            key={effect.id}
            className={`effect-card ${selectedEffects.includes(effect.id) ? 'selected' : ''}`}
            onClick={() => handleEffectToggle(effect.id)}
          >
            <div className="effect-icon">
              <img src={getWowIconPath(effect.icon)} alt={effect.name} />
            </div>
            <div className="effect-info">
              <h3>{effect.name}</h3>
              <p>{effect.description}</p>
              <span className="effect-category">{effect.category}</span>
            </div>
            {selectedEffects.includes(effect.id) && (
              <div className="selected-indicator">✓</div>
            )}
          </div>
        ))}
      </div>
      
      {selectedEffects.length > 0 && (
        <div className="effect-parameters">
          <h3>Effect Parameters</h3>
          
          {selectedEffects.map(effectId => {
            const effect = statusEffects.find(e => e.id === effectId);
            
            if (!effect || !effect.defaultParameters) return null;
            
            return (
              <div key={effectId} className="parameter-section">
                <h4>
                  <img 
                    src={getWowIconPath(effect.icon)} 
                    alt={effect.name}
                    className="mini-icon" 
                  />
                  {effect.name} Parameters
                </h4>
                
                <div className="parameter-grid">
                  {Object.entries(effect.defaultParameters).map(([paramName, defaultValue]) => (
                    <div key={paramName} className="parameter-item">
                      <label>{formatParamName(paramName)}</label>
                      {renderParameterInput(
                        effect, 
                        paramName, 
                        effectParameters[effectId] ? 
                          effectParameters[effectId][paramName] : 
                          defaultValue
                      )}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export {
  // Core data
  EFFECT_TYPES,
  DAMAGE_TYPES,
  DURATION_TYPES,
  TARGETING_TYPES,
  
  // Utility functions
  isValidDiceNotation,
  getMinRoll,
  getMaxRoll,
  getAverageRoll,
  calculateChainedDamage,
  calculateCriticalDamage,
  calculateDotDamage,
  getWowIconPath
};