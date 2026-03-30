import React, { useState, useEffect } from 'react';
import { COOLDOWN_TYPES, COOLDOWN_MODIFIERS, COOLDOWN_CATEGORIES } from '../../core/data/cooldownTypes';

const CooldownConfig = ({ initialConfig = {}, onChange, spellLevel = 1 }) => {
  const [config, setConfig] = useState({
    type: initialConfig.type || '',
    value: initialConfig.value || 0,
    charges: initialConfig.charges || 1,
    category: initialConfig.category || 'standard',
    modifiers: initialConfig.modifiers || [],
    conditions: initialConfig.conditions || [],
    ...initialConfig
  });

  // Find the selected cooldown type object
  const selectedType = COOLDOWN_TYPES.find(type => type.id === config.type);

  useEffect(() => {
    // When type changes, update the default value
    if (selectedType && !initialConfig.value) {
      setConfig(prev => ({
        ...prev,
        value: selectedType.defaultValue
      }));
    }
  }, [config.type, selectedType, initialConfig.value]);

  useEffect(() => {
    // Notify parent of changes
    if (onChange) {
      onChange(config);
    }
  }, [config, onChange]);

  const handleTypeChange = (typeId) => {
    const newType = COOLDOWN_TYPES.find(type => type.id === typeId);
    setConfig(prev => ({
      ...prev,
      type: typeId,
      value: newType ? newType.defaultValue : prev.value
    }));
  };

  const handleValueChange = (value) => {
    // Enforce min/max if specified
    if (selectedType && selectedType.valueRange) {
      const { min, max } = selectedType.valueRange;
      value = Math.max(min, Math.min(max || 999, value));
    }

    setConfig(prev => ({
      ...prev,
      value
    }));
  };

  const handleChargesChange = (charges) => {
    setConfig(prev => ({
      ...prev,
      charges: Math.max(1, charges)
    }));
  };

  const handleCategoryChange = (category) => {
    setConfig(prev => ({
      ...prev,
      category
    }));
  };

  const handleAddModifier = (modifier) => {
    setConfig(prev => ({
      ...prev,
      modifiers: [...prev.modifiers, modifier]
    }));
  };

  const handleRemoveModifier = (index) => {
    setConfig(prev => ({
      ...prev,
      modifiers: prev.modifiers.filter((_, i) => i !== index)
    }));
  };

  const handleAddCondition = (condition) => {
    setConfig(prev => ({
      ...prev,
      conditions: [...prev.conditions, condition]
    }));
  };

  const handleRemoveCondition = (index) => {
    setConfig(prev => ({
      ...prev,
      conditions: prev.conditions.filter((_, i) => i !== index)
    }));
  };

  // Suggested cooldown based on spell level
  const getSuggestedCooldown = () => {
    if (config.type === 'turn_based') {
      // Higher level spells generally have longer cooldowns
      return Math.min(10, Math.max(1, Math.floor(spellLevel * 1.5)));
    }
    if (config.type === 'short_rest' || config.type === 'long_rest') {
      // Higher level spells generally have fewer uses per rest
      return Math.max(1, Math.ceil(3 - spellLevel / 3));
    }
    return selectedType ? selectedType.defaultValue : 1;
  };

  // Determine if the current cooldown might be unbalanced
  const getCooldownBalanceWarning = () => {
    if (!selectedType) return null;
    
    const suggestedValue = getSuggestedCooldown();
    
    if (config.type === 'turn_based') {
      if (config.value < suggestedValue - 1) {
        return `This cooldown might be too short for a level ${spellLevel} spell. Consider ${suggestedValue} turns.`;
      }
      if (config.value > suggestedValue + 3) {
        return `This cooldown might be too long for a level ${spellLevel} spell. Consider ${suggestedValue} turns.`;
      }
    }
    
    if (config.type === 'short_rest' || config.type === 'long_rest') {
      if (config.value > suggestedValue + 1) {
        return `This might be too many uses for a level ${spellLevel} spell. Consider ${suggestedValue} uses.`;
      }
    }
    
    if (config.type === 'charge_based' && config.charges > 3 && spellLevel <= 3) {
      return `This many charges might be unbalanced for a low-level spell.`;
    }
    
    return null;
  };

  return (
    <div className="cooldown-config">
      <div className="cooldown-type-selection">
        <h3>Cooldown Type</h3>
        <div className="cooldown-type-options">
          {COOLDOWN_TYPES.map(type => (
            <div 
              key={type.id}
              className={`cooldown-type-option ${config.type === type.id ? 'selected' : ''}`}
              onClick={() => handleTypeChange(type.id)}
            >
              <div className="cooldown-icon">
                <i className={`icon icon-${type.icon}`}></i>
              </div>
              <div className="cooldown-info">
                <h4>{type.name}</h4>
                <p>{type.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedType && (
        <div className="cooldown-value-config">
          <h3>Cooldown Duration</h3>
          <div className="cooldown-value-input">
            <label>
              {selectedType.name} Value:
              <input 
                type="number"
                value={config.value}
                onChange={(e) => handleValueChange(parseInt(e.target.value, 10) || 0)}
                min={selectedType.valueRange?.min || 0}
                max={selectedType.valueRange?.max}
              />
              {selectedType.valueUnit && <span className="value-unit">{selectedType.valueUnit}</span>}
            </label>
            
            {selectedType.id === 'charge_based' && (
              <label>
                Number of Charges:
                <input 
                  type="number"
                  value={config.charges}
                  onChange={(e) => handleChargesChange(parseInt(e.target.value, 10) || 1)}
                  min={1}
                  max={10}
                />
              </label>
            )}

            {selectedType.id === 'dice_based' && (
              <div className="dice-config">
                <p>Recharge on roll of {config.rechargeThreshold || selectedType.rechargeThreshold}+ on {config.value || selectedType.defaultValue}</p>
                <label>
                  Threshold:
                  <input 
                    type="number"
                    value={config.rechargeThreshold || selectedType.rechargeThreshold}
                    onChange={(e) => setConfig(prev => ({
                      ...prev,
                      rechargeThreshold: parseInt(e.target.value, 10) || selectedType.rechargeThreshold
                    }))}
                    min={1}
                    max={20}
                  />
                </label>
              </div>
            )}

            {selectedType.id === 'conditional' && (
              <div className="condition-config">
                <h4>Recharge Conditions</h4>
                <div className="conditions-list">
                  {config.conditions.map((condition, index) => (
                    <div key={index} className="condition-item">
                      <span>{condition.description}</span>
                      <button 
                        className="remove-btn"
                        onClick={() => handleRemoveCondition(index)}
                      >
                        X
                      </button>
                    </div>
                  ))}
                </div>
                <button 
                  className="add-condition-btn"
                  onClick={() => handleAddCondition({ 
                    type: 'custom', 
                    description: 'Custom condition' 
                  })}
                >
                  Add Condition
                </button>
              </div>
            )}
          </div>

          <div className="cooldown-category-selection">
            <h3>Cooldown Category</h3>
            <p>Categorize this cooldown for organization and shared effects</p>
            <select 
              value={config.category}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              {COOLDOWN_CATEGORIES.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name} - {category.description}
                </option>
              ))}
            </select>
          </div>

          <div className="cooldown-modifiers">
            <h3>Cooldown Modifiers</h3>
            <p>Add effects that can modify this cooldown</p>

            <div className="modifiers-list">
              {config.modifiers.map((modifier, index) => (
                <div key={index} className="modifier-item">
                  <span>{modifier.name}: {modifier.description}</span>
                  <button 
                    className="remove-btn"
                    onClick={() => handleRemoveModifier(index)}
                  >
                    X
                  </button>
                </div>
              ))}
            </div>

            <div className="add-modifier-section">
              <select 
                value=""
                onChange={(e) => {
                  if (e.target.value) {
                    const [category, id] = e.target.value.split(':');
                    const modifiersList = COOLDOWN_MODIFIERS[category] || [];
                    const modifier = modifiersList.find(m => m.id === id);
                    if (modifier) {
                      handleAddModifier(modifier);
                    }
                    e.target.value = "";
                  }
                }}
              >
                <option value="">Add a modifier...</option>
                {Object.entries(COOLDOWN_MODIFIERS).map(([category, modifiers]) => (
                  <optgroup key={category} label={category.replace('_', ' ').toUpperCase()}>
                    {modifiers.map(modifier => (
                      <option key={modifier.id} value={`${category}:${modifier.id}`}>
                        {modifier.name}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          </div>

          {getCooldownBalanceWarning() && (
            <div className="cooldown-balance-warning">
              <i className="warning-icon"></i>
              <p>{getCooldownBalanceWarning()}</p>
            </div>
          )}

          <div className="cooldown-visualization">
            <h3>Cooldown Visualization</h3>
            <div className="cooldown-timeline">
              {/* Simplified visualization based on cooldown type */}
              {selectedType.id === 'turn_based' && (
                <div className="turn-based-vis">
                  {Array.from({ length: Math.min(10, config.value) }).map((_, i) => (
                    <div key={i} className="turn-marker">
                      <span>{i+1}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {selectedType.id === 'charge_based' && (
                <div className="charge-based-vis">
                  {Array.from({ length: config.charges }).map((_, i) => (
                    <div key={i} className="charge-marker">
                      <span>{i+1}</span>
                    </div>
                  ))}
                </div>
              )}
              
              {(selectedType.id === 'short_rest' || selectedType.id === 'long_rest') && (
                <div className="rest-based-vis">
                  <div className="uses-marker">
                    <span>{config.value} uses per {selectedType.id === 'short_rest' ? 'short' : 'long'} rest</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CooldownConfig;