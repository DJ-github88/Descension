import React, { useState, useEffect } from 'react';
import { 
  TRIGGER_CATEGORIES, 
  PROXIMITY_TRIGGERS, 
  STATUS_TRIGGERS, 
  COMBAT_TRIGGERS, 
  RESOURCE_TRIGGERS, 
  TURN_BASED_TRIGGERS, 
  MOVEMENT_TRIGGERS, 
  SPELL_BASED_TRIGGERS, 
  CLASS_SPECIFIC_TRIGGERS,
  TRIGGER_OPERATORS,
  TriggerUtils
} from '../../core/data/triggerTypes';

const TriggerConditionConfig = ({ initialConfig = {}, onChange, classRestrictions = [] }) => {
  const [config, setConfig] = useState({
    selectedCategory: initialConfig.selectedCategory || '',
    selectedTrigger: initialConfig.selectedTrigger || '',
    parameters: initialConfig.parameters || [],
    compoundTriggers: initialConfig.compoundTriggers || [],
    operator: initialConfig.operator || 'and',
    ...initialConfig
  });

  // Get all available triggers
  const getAllTriggers = (category) => {
    switch (category) {
      case 'proximity':
        return PROXIMITY_TRIGGERS;
      case 'status':
        return STATUS_TRIGGERS;
      case 'combat':
        return COMBAT_TRIGGERS;
      case 'resource':
        return RESOURCE_TRIGGERS;
      case 'turn_based':
        return TURN_BASED_TRIGGERS;
      case 'movement':
        return MOVEMENT_TRIGGERS;
      case 'spell_based':
        return SPELL_BASED_TRIGGERS;
      case 'class_specific':
        return CLASS_SPECIFIC_TRIGGERS.filter(trigger => 
          !trigger.classRestriction || classRestrictions.includes(trigger.classRestriction)
        );
      default:
        return [];
    }
  };

  // Get the currently selected trigger definition
  const getSelectedTriggerDef = () => {
    if (!config.selectedCategory || !config.selectedTrigger) return null;
    
    const triggers = getAllTriggers(config.selectedCategory);
    return triggers.find(t => t.id === config.selectedTrigger) || null;
  };

  useEffect(() => {
    // Notify parent of changes
    if (onChange) {
      onChange(config);
    }
  }, [config, onChange]);

  const handleCategoryChange = (categoryId) => {
    setConfig(prev => ({
      ...prev,
      selectedCategory: categoryId,
      selectedTrigger: '',
      parameters: []
    }));
  };

  const handleTriggerChange = (triggerId) => {
    const triggerDef = getAllTriggers(config.selectedCategory).find(t => t.id === triggerId);
    
    if (triggerDef) {
      // Initialize parameters with defaults
      const defaultParams = triggerDef.parameters.map(param => ({
        name: param.name,
        value: param.default,
        type: param.type
      }));
      
      setConfig(prev => ({
        ...prev,
        selectedTrigger: triggerId,
        parameters: defaultParams
      }));
    }
  };

  const handleParameterChange = (paramName, value) => {
    setConfig(prev => ({
      ...prev,
      parameters: prev.parameters.map(param => 
        param.name === paramName ? { ...param, value } : param
      )
    }));
  };

  const handleOperatorChange = (operator) => {
    setConfig(prev => ({
      ...prev,
      operator
    }));
  };

  const handleAddCompoundTrigger = () => {
    // Only add if we have a valid trigger
    if (config.selectedCategory && config.selectedTrigger) {
      const triggerDef = getSelectedTriggerDef();
      
      if (triggerDef) {
        const newTrigger = {
          id: config.selectedTrigger,
          category: config.selectedCategory,
          parameters: [...config.parameters]
        };
        
        setConfig(prev => ({
          ...prev,
          compoundTriggers: [...prev.compoundTriggers, newTrigger],
          // Reset the current selection
          selectedCategory: '',
          selectedTrigger: '',
          parameters: []
        }));
      }
    }
  };

  const handleRemoveCompoundTrigger = (index) => {
    setConfig(prev => ({
      ...prev,
      compoundTriggers: prev.compoundTriggers.filter((_, i) => i !== index)
    }));
  };

  const getParameterComponent = (param) => {
    const currentParam = config.parameters.find(p => p.name === param.name);
    const value = currentParam ? currentParam.value : param.default;
    
    // Determine if the parameter should be shown based on conditions
    if (param.showWhen) {
      const dependentParamName = Object.keys(param.showWhen)[0];
      const dependentValue = param.showWhen[dependentParamName];
      const dependentParam = config.parameters.find(p => p.name === dependentParamName);
      
      if (!dependentParam) return null;
      
      const actualValue = dependentParam.value;
      
      // Check if the dependent parameter's value matches the condition
      const isArray = Array.isArray(dependentValue);
      const shouldShow = isArray 
        ? dependentValue.includes(actualValue)
        : actualValue === dependentValue;
      
      if (!shouldShow) return null;
    }
    
    switch (param.type) {
      case 'number':
        return (
          <div key={param.name} className="parameter-input">
            <label>
              {param.label}:
              <input 
                type="number"
                value={value || 0}
                onChange={(e) => handleParameterChange(param.name, parseInt(e.target.value, 10) || 0)}
                min={param.min}
                max={param.max}
              />
              {param.description && <div className="param-description">{param.description}</div>}
            </label>
          </div>
        );
        
      case 'select':
        return (
          <div key={param.name} className="parameter-input">
            <label>
              {param.label}:
              <select
                value={value || param.default}
                onChange={(e) => handleParameterChange(param.name, e.target.value)}
              >
                {param.options.map(option => (
                  <option key={option} value={option}>
                    {option.replace(/_/g, ' ')}
                  </option>
                ))}
              </select>
              {param.description && <div className="param-description">{param.description}</div>}
            </label>
          </div>
        );
        
      case 'boolean':
        return (
          <div key={param.name} className="parameter-input">
            <label>
              <input 
                type="checkbox"
                checked={!!value}
                onChange={(e) => handleParameterChange(param.name, e.target.checked)}
              />
              {param.label}
              {param.description && <div className="param-description">{param.description}</div>}
            </label>
          </div>
        );
        
      case 'string':
        return (
          <div key={param.name} className="parameter-input">
            <label>
              {param.label}:
              <input 
                type="text"
                value={value || ''}
                onChange={(e) => handleParameterChange(param.name, e.target.value)}
              />
              {param.description && <div className="param-description">{param.description}</div>}
            </label>
          </div>
        );
        
      default:
        return null;
    }
  };

  const getTriggerDescription = (trigger) => {
    const triggerDef = getAllTriggers(trigger.category).find(t => t.id === trigger.id);
    if (!triggerDef) return 'Unknown trigger';
    
    let description = triggerDef.description;
    
    // Add parameter values to the description
    trigger.parameters.forEach(param => {
      const paramDef = triggerDef.parameters.find(p => p.name === param.name);
      if (paramDef) {
        // Format the parameter value based on its type
        let formattedValue = param.value;
        if (paramDef.type === 'select') {
          formattedValue = param.value.replace(/_/g, ' ');
        }
        
        description += `, ${paramDef.label}: ${formattedValue}`;
      }
    });
    
    return description;
  };

  const getCompoundDescription = () => {
    if (config.compoundTriggers.length === 0) return '';
    if (config.compoundTriggers.length === 1) return getTriggerDescription(config.compoundTriggers[0]);
    
    const operator = TRIGGER_OPERATORS.find(op => op.id === config.operator);
    const operatorText = operator ? operator.name : config.operator.toUpperCase();
    
    return config.compoundTriggers.map(trigger => 
      `(${getTriggerDescription(trigger)})`
    ).join(` ${operatorText} `);
  };

  const selectedTriggerDef = getSelectedTriggerDef();

  return (
    <div className="trigger-condition-config">
      <div className="trigger-category-selection">
        <h3>Trigger Category</h3>
        <div className="category-options">
          {TRIGGER_CATEGORIES.map(category => (
            <div 
              key={category.id}
              className={`category-option ${config.selectedCategory === category.id ? 'selected' : ''}`}
              onClick={() => handleCategoryChange(category.id)}
              style={{ borderColor: category.color }}
            >
              <div className="category-icon">
                <i className={`icon icon-${category.icon}`}></i>
              </div>
              <div className="category-info">
                <h4>{category.name}</h4>
                <p>{category.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {config.selectedCategory && (
        <div className="trigger-selection">
          <h3>Select Trigger</h3>
          <div className="trigger-options">
            {getAllTriggers(config.selectedCategory).map(trigger => (
              <div 
                key={trigger.id}
                className={`trigger-option ${config.selectedTrigger === trigger.id ? 'selected' : ''}`}
                onClick={() => handleTriggerChange(trigger.id)}
              >
                <div className="trigger-icon">
                  <i className={`icon icon-${trigger.icon}`}></i>
                </div>
                <div className="trigger-info">
                  <h4>{trigger.name}</h4>
                  <p>{trigger.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {selectedTriggerDef && (
        <div className="trigger-parameters">
          <h3>Configure Parameters</h3>
          <div className="parameters-form">
            {selectedTriggerDef.parameters.map(param => getParameterComponent(param))}

            <div className="parameter-actions">
              <button 
                className="add-trigger-btn"
                onClick={handleAddCompoundTrigger}
              >
                Add to Trigger Combination
              </button>
            </div>
          </div>
        </div>
      )}

      {config.compoundTriggers.length > 0 && (
        <div className="compound-trigger-config">
          <h3>Trigger Combination</h3>
          
          {config.compoundTriggers.length > 1 && (
            <div className="operator-selection">
              <h4>Combination Logic</h4>
              <div className="operator-options">
                {TRIGGER_OPERATORS.map(operator => (
                  <div 
                    key={operator.id}
                    className={`operator-option ${config.operator === operator.id ? 'selected' : ''}`}
                    onClick={() => handleOperatorChange(operator.id)}
                  >
                    <span className="operator-symbol">{operator.symbol}</span>
                    <span className="operator-name">{operator.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="compound-triggers-list">
            {config.compoundTriggers.map((trigger, index) => (
              <div key={index} className="compound-trigger-item">
                <span>{getTriggerDescription(trigger)}</span>
                <button 
                  className="remove-btn"
                  onClick={() => handleRemoveCompoundTrigger(index)}
                >
                  X
                </button>
              </div>
            ))}
          </div>
          
          {config.compoundTriggers.length > 1 && (
            <div className="compound-description">
              <h4>Combined Trigger:</h4>
              <p>{getCompoundDescription()}</p>
            </div>
          )}
        </div>
      )}

      <div className="trigger-examples">
        <h3>Example Scenarios</h3>
        <div className="scenario-list">
          <div className="scenario-item">
            <h4>Proximity + Status</h4>
            <p>Trigger when an ally below 50% health is within 30 feet</p>
          </div>
          <div className="scenario-item">
            <h4>Combat + Resource</h4>
            <p>Trigger when taking damage while below 25% mana</p>
          </div>
          <div className="scenario-item">
            <h4>Multiple Conditions</h4>
            <p>Trigger when ANY of multiple conditions are met for versatile reactions</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TriggerConditionConfig;