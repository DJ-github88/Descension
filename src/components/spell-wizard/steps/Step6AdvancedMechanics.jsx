import React, { useState, useEffect } from 'react';
import useSpellWizardStore from '../../../store/spellWizardStore';
import { StepNavigation } from '../common';
import '../styles/spell-wizard.css';

// Attribute definitions with descriptions and examples
const ATTRIBUTES = [
  {
    id: 'strength',
    name: 'Strength',
    abbr: 'STR',
    description: 'Physical power and raw force.',
    examples: ['Melee damage', 'Carrying capacity', 'Breaking objects'],
    iconClass: 'strength-icon',
    color: '#e74c3c'
  },
  {
    id: 'dexterity',
    name: 'Dexterity',
    abbr: 'DEX',
    description: 'Agility, reflexes, and finesse.',
    examples: ['Ranged attacks', 'Evasion', 'Fine manipulation'],
    iconClass: 'dexterity-icon',
    color: '#2ecc71'
  },
  {
    id: 'constitution',
    name: 'Constitution',
    abbr: 'CON',
    description: 'Health, stamina, and vital force.',
    examples: ['Health points', 'Poison resistance', 'Physical endurance'],
    iconClass: 'constitution-icon',
    color: '#e67e22'
  },
  {
    id: 'intelligence',
    name: 'Intelligence',
    abbr: 'INT',
    description: 'Mental acuity, information recall, and analytical skill.',
    examples: ['Arcane spells', 'Knowledge checks', 'Puzzle solving'],
    iconClass: 'intelligence-icon',
    color: '#3498db'
  },
  {
    id: 'wisdom',
    name: 'Wisdom',
    abbr: 'WIS',
    description: 'Awareness, intuition, and perception.',
    examples: ['Divine spells', 'Insight', 'Perception checks'],
    iconClass: 'wisdom-icon',
    color: '#9b59b6'
  },
  {
    id: 'charisma',
    name: 'Charisma',
    abbr: 'CHA',
    description: 'Force of personality and influence over others.',
    examples: ['Persuasion', 'Intimidation', 'Leadership'],
    iconClass: 'charisma-icon',
    color: '#f39c12'
  }
];

// Special interactions with conditions
const CONDITION_INTERACTIONS = [
  {
    id: 'burning',
    name: 'Burning',
    description: 'Enhanced against burning targets.',
    effects: ['Increased damage', 'Extended duration', 'Additional effects'],
    iconClass: 'burn-icon',
    color: '#e74c3c'
  },
  {
    id: 'frozen',
    name: 'Frozen',
    description: 'Special interaction with frozen targets.',
    effects: ['Shatter effect', 'Bonus critical chance', 'Movement impairment'],
    iconClass: 'freeze-icon',
    color: '#3498db'
  },
  {
    id: 'stunned',
    name: 'Stunned',
    description: 'Additional effects on stunned targets.',
    effects: ['Guaranteed critical', 'Extended stun duration', 'Bonus damage'],
    iconClass: 'stun-icon',
    color: '#f39c12'
  },
  {
    id: 'poisoned',
    name: 'Poisoned',
    description: 'Enhanced against poisoned targets.',
    effects: ['Amplify poison effect', 'Spread poison', 'Convert poison damage'],
    iconClass: 'poison-icon',
    color: '#2ecc71'
  },
  {
    id: 'weakened',
    name: 'Weakened',
    description: 'Additional effects on weakened targets.',
    effects: ['Bonus damage', 'Apply additional effect', 'Extend weakened duration'],
    iconClass: 'weaken-icon',
    color: '#9b59b6'
  }
];

// Environmental interactions
const ENVIRONMENTAL_INTERACTIONS = [
  {
    id: 'water',
    name: 'Water',
    description: 'Unique effects when cast in or targeting water.',
    effects: ['Steam generation', 'Damage amplification', 'Area expansion'],
    iconClass: 'water-icon',
    color: '#3498db'
  },
  {
    id: 'lava',
    name: 'Lava/Fire',
    description: 'Special interactions with lava or fire sources.',
    effects: ['Fire damage boost', 'Explosive reaction', 'Area denial'],
    iconClass: 'fire-icon',
    color: '#e74c3c'
  },
  {
    id: 'darkness',
    name: 'Darkness',
    description: 'Different effects in dark environments.',
    effects: ['Stealth bonus', 'Shadow damage', 'Fear effect'],
    iconClass: 'darkness-icon', 
    color: '#34495e'
  },
  {
    id: 'consecrated',
    name: 'Consecrated Ground',
    description: 'Enhanced on holy or blessed ground.',
    effects: ['Healing boost', 'Holy damage', 'Undead repulsion'],
    iconClass: 'holy-icon',
    color: '#f1c40f'
  },
  {
    id: 'desecrated',
    name: 'Desecrated Ground',
    description: 'Enhanced on corrupted or unholy ground.',
    effects: ['Necrotic damage', 'Summoning boost', 'Fear effect'],
    iconClass: 'unholy-icon',
    color: '#8e44ad'
  }
];

// Conditional triggers
const CONDITIONAL_TRIGGERS = [
  {
    id: 'lowHealth',
    name: 'Low Health',
    description: 'Effect triggers when caster or target is below certain health threshold.',
    threshold: 'Below 30% health',
    iconClass: 'health-icon',
    color: '#e74c3c'
  },
  {
    id: 'highResource',
    name: 'High Resource',
    description: 'Effect triggers when caster has abundant resources.',
    threshold: 'Above 70% mana/energy',
    iconClass: 'mana-icon',
    color: '#3498db'
  },
  {
    id: 'criticalHit',
    name: 'Critical Hit',
    description: 'Effect triggers on critical hits.',
    threshold: 'On any critical hit',
    iconClass: 'critical-icon',
    color: '#f39c12'
  },
  {
    id: 'killEffect',
    name: 'Kill Effect',
    description: 'Effect triggers when target is killed by this spell.',
    threshold: 'On kill',
    iconClass: 'kill-icon',
    color: '#8e44ad'
  },
  {
    id: 'counterSpell',
    name: 'Counter Spell',
    description: 'Effect triggers when countering another spell.',
    threshold: 'When interrupting a cast',
    iconClass: 'counter-icon',
    color: '#2ecc71'
  }
];

// Combo potentials with other abilities
const COMBO_POTENTIALS = [
  {
    id: 'elementalResonance',
    name: 'Elemental Resonance',
    description: 'Combines with elemental spells for enhanced effects.',
    examples: ['Fire + Ice = Steam explosion', 'Lightning + Water = Chain lightning'],
    iconClass: 'element-icon',
    color: '#3498db'
  },
  {
    id: 'targetPriming',
    name: 'Target Priming',
    description: 'Prepares target for follow-up abilities with increased effectiveness.',
    examples: ['Mark target for bonus damage', 'Apply vulnerability debuff'],
    iconClass: 'prime-icon',
    color: '#e74c3c'
  },
  {
    id: 'spellweaving',
    name: 'Spellweaving',
    description: 'Enchants allies\' spells with additional effects.',
    examples: ['Add damage type to allies\' attacks', 'Share spell properties'],
    iconClass: 'weave-icon',
    color: '#9b59b6'
  },
  {
    id: 'chainReaction',
    name: 'Chain Reaction',
    description: 'Spell effect can be triggered multiple times by specific actions.',
    examples: ['Explosion chains to new targets', 'Cascade effect'],
    iconClass: 'chain-icon',
    color: '#f39c12'
  },
  {
    id: 'convergence',
    name: 'Convergence',
    description: 'Multiple casters can combine this spell for amplified effect.',
    examples: ['Increased area of effect', 'Higher damage when cast together'],
    iconClass: 'converge-icon',
    color: '#2ecc71'
  }
];

// Scaling formulas
const SCALING_FORMULAS = [
  {
    id: 'linear',
    name: 'Linear Scaling',
    description: 'Effect increases directly with attribute value.',
    formula: 'Base + (Attribute × Multiplier)',
    example: '10 + (INT × 0.5) damage'
  },
  {
    id: 'diminishing',
    name: 'Diminishing Returns',
    description: 'Effect increases with attribute, but at a decreasing rate.',
    formula: 'Base + (Attribute ÷ (Attribute + Constant) × Max)',
    example: '5 + (STR ÷ (STR + 100) × 50) damage'
  },
  {
    id: 'threshold',
    name: 'Threshold Scaling',
    description: 'Effect gets bonuses at specific attribute thresholds.',
    formula: 'Base + Bonus per threshold reached',
    example: '+5 damage for every 10 DEX'
  },
  {
    id: 'exponential',
    name: 'Exponential Scaling',
    description: 'Effect increases exponentially with attribute.',
    formula: 'Base + (Attribute² × Multiplier)',
    example: '5 + (INT² × 0.01) damage'
  },
  {
    id: 'hybrid',
    name: 'Hybrid Scaling',
    description: 'Effect scales with multiple attributes.',
    formula: 'Base + (Primary × PrimaryMultiplier) + (Secondary × SecondaryMultiplier)',
    example: '5 + (STR × 0.5) + (CON × 0.2) damage'
  }
];

// Multiplier options for attribute scaling
const MULTIPLIER_OPTIONS = [
  { value: 0.1, label: '0.1 (Minor)' },
  { value: 0.25, label: '0.25 (Low)' },
  { value: 0.5, label: '0.5 (Medium)' },
  { value: 0.75, label: '0.75 (High)' },
  { value: 1, label: '1.0 (Full)' },
  { value: 1.5, label: '1.5 (Enhanced)' },
  { value: 2, label: '2.0 (Powerful)' }
];

const Step6AdvancedMechanics = () => {
  const { 
    spellData, 
    updateSpellData, 
    setStepValidation,
    nextStep,
    prevStep
  } = useSpellWizardStore();
  
  // Local state
  const [selectedAttributes, setSelectedAttributes] = useState(spellData.attributeScaling || []);
  const [primaryAttribute, setPrimaryAttribute] = useState(spellData.scalingAttribute || '');
  const [scalingFormula, setScalingFormula] = useState(spellData.scalingFormula || 'linear');
  const [customFormula, setCustomFormula] = useState(spellData.customFormula || '');
  const [multiplier, setMultiplier] = useState(spellData.multiplier || 0.5);
  const [secondaryAttribute, setSecondaryAttribute] = useState(spellData.secondaryAttribute || '');
  const [secondaryMultiplier, setSecondaryMultiplier] = useState(spellData.secondaryMultiplier || 0.25);
  
  const [specialInteractions, setSpecialInteractions] = useState(spellData.specialInteractions || []);
  const [environmentalInteractions, setEnvironmentalInteractions] = useState(spellData.environmentalInteractions || []);
  const [conditionalEffects, setConditionalEffects] = useState(spellData.conditionalEffects || []);
  const [comboEffects, setComboEffects] = useState(spellData.comboEffects || []);
  
  const [customConditionalEffect, setCustomConditionalEffect] = useState('');
  const [customComboEffect, setCustomComboEffect] = useState('');
  const [customSpecialInteraction, setCustomSpecialInteraction] = useState('');

  // Validation logic (optional for this step)
  useEffect(() => {
    // This step is always valid as these are optional advanced mechanics
    setStepValidation(5, true);
  }, [setStepValidation]);
  
  // Update spell data with current values
  useEffect(() => {
    updateSpellData({
      attributeScaling: selectedAttributes,
      scalingAttribute: primaryAttribute,
      scalingFormula,
      customFormula,
      multiplier,
      secondaryAttribute,
      secondaryMultiplier,
      specialInteractions,
      environmentalInteractions,
      conditionalEffects,
      comboEffects
    });
  }, [
    selectedAttributes,
    primaryAttribute,
    scalingFormula,
    customFormula,
    multiplier,
    secondaryAttribute,
    secondaryMultiplier,
    specialInteractions,
    environmentalInteractions,
    conditionalEffects,
    comboEffects,
    updateSpellData
  ]);
  
  // Handle attribute selection
  const toggleAttribute = (attributeId) => {
    setSelectedAttributes(prev => {
      if (prev.includes(attributeId)) {
        return prev.filter(id => id !== attributeId);
      } else {
        return [...prev, attributeId];
      }
    });
    
    // If primary attribute not set, set it to the first selected attribute
    if (!primaryAttribute && !selectedAttributes.includes(attributeId)) {
      setPrimaryAttribute(attributeId);
    }
    
    // If the primary attribute is deselected, reset it
    if (primaryAttribute === attributeId && selectedAttributes.includes(attributeId)) {
      setPrimaryAttribute('');
    }
  };
  
  // Handle primary attribute selection
  const handlePrimaryAttributeChange = (e) => {
    const attributeId = e.target.value;
    
    // Ensure the attribute is in the selected attributes list
    if (attributeId && !selectedAttributes.includes(attributeId)) {
      setSelectedAttributes(prev => [...prev, attributeId]);
    }
    
    setPrimaryAttribute(attributeId);
  };
  
  // Handle secondary attribute selection
  const handleSecondaryAttributeChange = (e) => {
    const attributeId = e.target.value;
    
    // Ensure the attribute is in the selected attributes list
    if (attributeId && !selectedAttributes.includes(attributeId)) {
      setSelectedAttributes(prev => [...prev, attributeId]);
    }
    
    setSecondaryAttribute(attributeId);
  };
  
  // Toggle condition interactions
  const toggleConditionInteraction = (conditionId) => {
    setSpecialInteractions(prev => {
      if (prev.includes(conditionId)) {
        return prev.filter(id => id !== conditionId);
      } else {
        return [...prev, conditionId];
      }
    });
  };
  
  // Toggle environmental interactions
  const toggleEnvironmentalInteraction = (environmentId) => {
    setEnvironmentalInteractions(prev => {
      if (prev.includes(environmentId)) {
        return prev.filter(id => id !== environmentId);
      } else {
        return [...prev, environmentId];
      }
    });
  };
  
  // Toggle conditional effects
  const toggleConditionalEffect = (effectId) => {
    setConditionalEffects(prev => {
      if (prev.some(effect => effect.id === effectId)) {
        return prev.filter(effect => effect.id !== effectId);
      } else {
        return [...prev, { id: effectId, description: '' }];
      }
    });
  };
  
  // Update conditional effect description
  const updateConditionalEffectDescription = (effectId, description) => {
    setConditionalEffects(prev => {
      return prev.map(effect => {
        if (effect.id === effectId) {
          return { ...effect, description };
        }
        return effect;
      });
    });
  };
  
  // Toggle combo effects
  const toggleComboEffect = (comboId) => {
    setComboEffects(prev => {
      if (prev.some(combo => combo.id === comboId)) {
        return prev.filter(combo => combo.id !== comboId);
      } else {
        return [...prev, { id: comboId, description: '' }];
      }
    });
  };
  
  // Update combo effect description
  const updateComboEffectDescription = (comboId, description) => {
    setComboEffects(prev => {
      return prev.map(combo => {
        if (combo.id === comboId) {
          return { ...combo, description };
        }
        return combo;
      });
    });
  };
  
  // Add custom conditional effect
  const addCustomConditionalEffect = () => {
    if (customConditionalEffect.trim()) {
      const newId = `custom-condition-${Date.now()}`;
      setConditionalEffects(prev => [...prev, { 
        id: newId, 
        description: customConditionalEffect.trim(),
        isCustom: true
      }]);
      setCustomConditionalEffect('');
    }
  };
  
  // Add custom combo effect
  const addCustomComboEffect = () => {
    if (customComboEffect.trim()) {
      const newId = `custom-combo-${Date.now()}`;
      setComboEffects(prev => [...prev, { 
        id: newId, 
        description: customComboEffect.trim(),
        isCustom: true
      }]);
      setCustomComboEffect('');
    }
  };
  
  // Add custom special interaction
  const addCustomSpecialInteraction = () => {
    if (customSpecialInteraction.trim()) {
      const newId = `custom-interaction-${Date.now()}`;
      setSpecialInteractions(prev => [...prev, newId]);
      // Note: This approach would require additional state to store custom interaction details
      setCustomSpecialInteraction('');
    }
  };
  
  // Generate formula preview
  const getFormulaPreview = () => {
    const attribute = ATTRIBUTES.find(attr => attr.id === primaryAttribute);
    const secondAttr = ATTRIBUTES.find(attr => attr.id === secondaryAttribute);
    
    switch (scalingFormula) {
      case 'linear':
        return `Base + (${attribute ? attribute.abbr : 'Attribute'} × ${multiplier})`;
      case 'diminishing':
        return `Base + (${attribute ? attribute.abbr : 'Attribute'} ÷ (${attribute ? attribute.abbr : 'Attribute'} + 100) × Max)`;
      case 'threshold':
        return `Base + Bonus per ${Math.round(1/multiplier)} ${attribute ? attribute.abbr : 'Attribute'} points`;
      case 'exponential':
        return `Base + (${attribute ? attribute.abbr : 'Attribute'}² × ${multiplier})`;
      case 'hybrid':
        return `Base + (${attribute ? attribute.abbr : 'Primary'} × ${multiplier}) + (${secondAttr ? secondAttr.abbr : 'Secondary'} × ${secondaryMultiplier})`;
      case 'custom':
        return customFormula || 'Custom formula';
      default:
        return 'Select a formula type';
    }
  };
  
  // Check if the spell is damage or healing based
  const isOffensiveSpell = spellData.effectType === 'damage';
  const isHealingSpell = spellData.effectType === 'healing';
  
  // Helper to find attribute by id
  const getAttributeById = (id) => ATTRIBUTES.find(attr => attr.id === id);
  
  return (
    <div className="advanced-mechanics-step">
      <div className="section">
        <h4 className="section-title">Attribute Scaling</h4>
        <p className="section-description">
          Define how your spell's effectiveness scales with character attributes.
          {isOffensiveSpell && " This can affect damage output, critical chance, or other offensive parameters."}
          {isHealingSpell && " This can affect healing amount, duration, or other restoration parameters."}
        </p>
        
        <div className="attribute-grid">
          {ATTRIBUTES.map(attribute => (
            <div 
              key={attribute.id}
              className={`attribute-card ${selectedAttributes.includes(attribute.id) ? 'selected' : ''} ${primaryAttribute === attribute.id ? 'primary' : ''}`}
              onClick={() => toggleAttribute(attribute.id)}
              style={{
                borderColor: selectedAttributes.includes(attribute.id) ? attribute.color : 'transparent'
              }}
            >
              <div className="attribute-header">
                <div className="attribute-badge" style={{ backgroundColor: attribute.color }}>
                  {attribute.abbr}
                </div>
                <h5 className="attribute-name">{attribute.name}</h5>
                {primaryAttribute === attribute.id && (
                  <span className="primary-badge">Primary</span>
                )}
              </div>
              <p className="attribute-description">{attribute.description}</p>
              <div className="attribute-examples">
                <span className="examples-label">Examples: </span>
                {attribute.examples.join(', ')}
              </div>
            </div>
          ))}
        </div>
        
        {selectedAttributes.length > 0 && (
          <div className="scaling-configuration">
            <div className="primary-attribute-selector">
              <label>Primary Scaling Attribute:</label>
              <select 
                value={primaryAttribute} 
                onChange={handlePrimaryAttributeChange}
                className="attribute-select"
              >
                <option value="">Select Primary Attribute</option>
                {selectedAttributes.map(attrId => {
                  const attr = getAttributeById(attrId);
                  return (
                    <option key={attrId} value={attrId}>
                      {attr ? attr.name : attrId}
                    </option>
                  );
                })}
              </select>
            </div>
            
            {primaryAttribute && (
              <>
                <div className="formula-selector">
                  <label>Scaling Formula Type:</label>
                  <select 
                    value={scalingFormula} 
                    onChange={(e) => setScalingFormula(e.target.value)}
                    className="formula-select"
                  >
                    {SCALING_FORMULAS.map(formula => (
                      <option key={formula.id} value={formula.id}>
                        {formula.name}
                      </option>
                    ))}
                    <option value="custom">Custom Formula</option>
                  </select>
                </div>
                
                {scalingFormula !== 'custom' && scalingFormula !== 'hybrid' && (
                  <div className="multiplier-selector">
                    <label>Scaling Multiplier:</label>
                    <select 
                      value={multiplier} 
                      onChange={(e) => setMultiplier(parseFloat(e.target.value))}
                      className="multiplier-select"
                    >
                      {MULTIPLIER_OPTIONS.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
                
                {scalingFormula === 'hybrid' && (
                  <>
                    <div className="multiplier-selector">
                      <label>Primary Multiplier:</label>
                      <select 
                        value={multiplier} 
                        onChange={(e) => setMultiplier(parseFloat(e.target.value))}
                        className="multiplier-select"
                      >
                        {MULTIPLIER_OPTIONS.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    
                    <div className="secondary-attribute-selector">
                      <label>Secondary Scaling Attribute:</label>
                      <select 
                        value={secondaryAttribute} 
                        onChange={handleSecondaryAttributeChange}
                        className="attribute-select"
                      >
                        <option value="">Select Secondary Attribute</option>
                        {selectedAttributes
                          .filter(attrId => attrId !== primaryAttribute)
                          .map(attrId => {
                            const attr = getAttributeById(attrId);
                            return (
                              <option key={attrId} value={attrId}>
                                {attr ? attr.name : attrId}
                              </option>
                            );
                          })
                        }
                      </select>
                    </div>
                    
                    {secondaryAttribute && (
                      <div className="multiplier-selector">
                        <label>Secondary Multiplier:</label>
                        <select 
                          value={secondaryMultiplier} 
                          onChange={(e) => setSecondaryMultiplier(parseFloat(e.target.value))}
                          className="multiplier-select"
                        >
                          {MULTIPLIER_OPTIONS.map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </>
                )}
                
                {scalingFormula === 'custom' && (
                  <div className="custom-formula-input">
                    <label>Custom Formula:</label>
                    <input 
                      type="text" 
                      value={customFormula} 
                      onChange={(e) => setCustomFormula(e.target.value)}
                      placeholder="e.g., Base + (INT * 0.5) + (WIS * 0.3)"
                      className="custom-formula-field"
                    />
                    <p className="formula-hint">
                      Use attribute abbreviations (STR, DEX, CON, INT, WIS, CHA) in your formula.
                    </p>
                  </div>
                )}
                
                <div className="formula-preview">
                  <h5 className="formula-preview-title">Scaling Formula Preview</h5>
                  <div className="formula-display">
                    {getFormulaPreview()}
                  </div>
                  <p className="formula-description">
                    {SCALING_FORMULAS.find(f => f.id === scalingFormula)?.description || 'Custom formula scaling'}
                  </p>
                  <div className="formula-example">
                    <span className="example-label">Example: </span>
                    {SCALING_FORMULAS.find(f => f.id === scalingFormula)?.example || customFormula}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>
      
      <div className="section">
        <h4 className="section-title">Special Interactions</h4>
        <p className="section-description">
          Define how your spell interacts with specific status conditions or environments.
          This adds tactical depth and situational advantages to your spell.
        </p>
        
        <div className="interactions-container">
          <div className="subsection">
            <h5 className="subsection-title">Condition Interactions</h5>
            <div className="condition-grid">
              {CONDITION_INTERACTIONS.map(condition => (
                <div 
                  key={condition.id}
                  className={`condition-card ${specialInteractions.includes(condition.id) ? 'selected' : ''}`}
                  onClick={() => toggleConditionInteraction(condition.id)}
                  style={{
                    borderColor: specialInteractions.includes(condition.id) ? condition.color : 'transparent'
                  }}
                >
                  <div className="condition-header" style={{ color: condition.color }}>
                    {condition.name}
                  </div>
                  <p className="condition-description">{condition.description}</p>
                  <ul className="condition-effects">
                    {condition.effects.map((effect, index) => (
                      <li key={index}>{effect}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            
            <div className="custom-interaction">
              <input 
                type="text" 
                value={customSpecialInteraction} 
                onChange={(e) => setCustomSpecialInteraction(e.target.value)}
                placeholder="Add custom condition interaction..."
                className="custom-interaction-input"
              />
              <button 
                onClick={addCustomSpecialInteraction}
                disabled={!customSpecialInteraction.trim()}
                className="custom-interaction-btn"
              >
                Add
              </button>
            </div>
          </div>
          
          <div className="subsection">
            <h5 className="subsection-title">Environmental Interactions</h5>
            <div className="environment-grid">
              {ENVIRONMENTAL_INTERACTIONS.map(environment => (
                <div 
                  key={environment.id}
                  className={`environment-card ${environmentalInteractions.includes(environment.id) ? 'selected' : ''}`}
                  onClick={() => toggleEnvironmentalInteraction(environment.id)}
                  style={{
                    borderColor: environmentalInteractions.includes(environment.id) ? environment.color : 'transparent'
                  }}
                >
                  <div className="environment-header" style={{ color: environment.color }}>
                    {environment.name}
                  </div>
                  <p className="environment-description">{environment.description}</p>
                  <ul className="environment-effects">
                    {environment.effects.map((effect, index) => (
                      <li key={index}>{effect}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="section">
        <h4 className="section-title">Conditional Effects</h4>
        <p className="section-description">
          Define effects that only activate under specific conditions or triggers.
          These add depth and situational power to your spell.
        </p>
        
        <div className="conditional-effects-grid">
          {CONDITIONAL_TRIGGERS.map(trigger => {
            const isSelected = conditionalEffects.some(effect => effect.id === trigger.id);
            const selectedEffect = conditionalEffects.find(effect => effect.id === trigger.id);
            
            return (
              <div 
                key={trigger.id}
                className={`conditional-card ${isSelected ? 'selected' : ''}`}
                style={{
                  borderColor: isSelected ? trigger.color : 'transparent'
                }}
              >
                <div className="conditional-header">
                  <div className="checkbox-container">
                    <input 
                      type="checkbox" 
                      id={`trigger-${trigger.id}`}
                      checked={isSelected}
                      onChange={() => toggleConditionalEffect(trigger.id)}
                    />
                    <label 
                      htmlFor={`trigger-${trigger.id}`}
                      className="conditional-name"
                      style={{ color: trigger.color }}
                    >
                      {trigger.name}
                    </label>
                  </div>
                </div>
                <p className="conditional-description">{trigger.description}</p>
                <div className="conditional-threshold">
                  <span className="threshold-label">Trigger: </span>
                  {trigger.threshold}
                </div>
                
                {isSelected && (
                  <div className="conditional-effect-input">
                    <label>Effect Description:</label>
                    <textarea 
                      value={selectedEffect?.description || ''}
                      onChange={(e) => updateConditionalEffectDescription(trigger.id, e.target.value)}
                      placeholder={`Describe the effect when ${trigger.name.toLowerCase()} is triggered...`}
                      rows={2}
                      className="effect-description-input"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="custom-conditional">
          <input 
            type="text" 
            value={customConditionalEffect} 
            onChange={(e) => setCustomConditionalEffect(e.target.value)}
            placeholder="Add custom conditional effect..."
            className="custom-conditional-input"
          />
          <button 
            onClick={addCustomConditionalEffect}
            disabled={!customConditionalEffect.trim()}
            className="custom-conditional-btn"
          >
            Add
          </button>
        </div>
        
        {conditionalEffects.filter(effect => effect.isCustom).length > 0 && (
          <div className="custom-conditionals-list">
            <h5 className="custom-conditionals-title">Custom Conditional Effects</h5>
            <ul>
              {conditionalEffects
                .filter(effect => effect.isCustom)
                .map(effect => (
                  <li key={effect.id} className="custom-conditional-item">
                    {effect.description}
                    <button 
                      onClick={() => setConditionalEffects(prev => prev.filter(e => e.id !== effect.id))}
                      className="remove-conditional-btn"
                    >
                      ×
                    </button>
                  </li>
                ))
              }
            </ul>
          </div>
        )}
      </div>
      
      <div className="section">
        <h4 className="section-title">Combo Potential</h4>
        <p className="section-description">
          Define how your spell can combine with other abilities for enhanced effects.
          This encourages strategic coordination and creates synergies with other abilities.
        </p>
        
        <div className="combo-effects-grid">
          {COMBO_POTENTIALS.map(combo => {
            const isSelected = comboEffects.some(effect => effect.id === combo.id);
            const selectedCombo = comboEffects.find(effect => effect.id === combo.id);
            
            return (
              <div 
                key={combo.id}
                className={`combo-card ${isSelected ? 'selected' : ''}`}
                style={{
                  borderColor: isSelected ? combo.color : 'transparent'
                }}
              >
                <div className="combo-header">
                  <div className="checkbox-container">
                    <input 
                      type="checkbox" 
                      id={`combo-${combo.id}`}
                      checked={isSelected}
                      onChange={() => toggleComboEffect(combo.id)}
                    />
                    <label 
                      htmlFor={`combo-${combo.id}`}
                      className="combo-name"
                      style={{ color: combo.color }}
                    >
                      {combo.name}
                    </label>
                  </div>
                </div>
                <p className="combo-description">{combo.description}</p>
                <div className="combo-examples">
                  <span className="examples-label">Examples: </span>
                  <ul>
                    {combo.examples.map((example, index) => (
                      <li key={index}>{example}</li>
                    ))}
                  </ul>
                </div>
                
                {isSelected && (
                  <div className="combo-effect-input">
                    <label>Combo Description:</label>
                    <textarea 
                      value={selectedCombo?.description || ''}
                      onChange={(e) => updateComboEffectDescription(combo.id, e.target.value)}
                      placeholder={`Describe how your spell works with ${combo.name.toLowerCase()}...`}
                      rows={2}
                      className="combo-description-input"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        <div className="custom-combo">
          <input 
            type="text" 
            value={customComboEffect} 
            onChange={(e) => setCustomComboEffect(e.target.value)}
            placeholder="Add custom combo effect..."
            className="custom-combo-input"
          />
          <button 
            onClick={addCustomComboEffect}
            disabled={!customComboEffect.trim()}
            className="custom-combo-btn"
          >
            Add
          </button>
        </div>
        
        {comboEffects.filter(combo => combo.isCustom).length > 0 && (
          <div className="custom-combos-list">
            <h5 className="custom-combos-title">Custom Combo Effects</h5>
            <ul>
              {comboEffects
                .filter(combo => combo.isCustom)
                .map(combo => (
                  <li key={combo.id} className="custom-combo-item">
                    {combo.description}
                    <button 
                      onClick={() => setComboEffects(prev => prev.filter(c => c.id !== combo.id))}
                      className="remove-combo-btn"
                    >
                      ×
                    </button>
                  </li>
                ))
              }
            </ul>
          </div>
        )}
      </div>
      
      <div className="advanced-mechanics-summary">
        <h4 className="summary-title">Advanced Mechanics Summary</h4>
        
        {(selectedAttributes.length === 0 && 
          specialInteractions.length === 0 && 
          environmentalInteractions.length === 0 && 
          conditionalEffects.length === 0 && 
          comboEffects.length === 0) ? (
          <p className="no-mechanics-message">
            No advanced mechanics have been added to this spell. These are optional and can add depth to your spell's design.
          </p>
        ) : (
          <div className="mechanics-summary-grid">
            {selectedAttributes.length > 0 && (
              <div className="summary-section">
                <h5 className="summary-section-title">Attribute Scaling</h5>
                <p className="summary-detail">
                  Primary: {getAttributeById(primaryAttribute)?.name || 'None'}
                </p>
                {secondaryAttribute && (
                  <p className="summary-detail">
                    Secondary: {getAttributeById(secondaryAttribute)?.name || 'None'}
                  </p>
                )}
                <p className="summary-detail">
                  Formula: {getFormulaPreview()}
                </p>
              </div>
            )}
            
            {(specialInteractions.length > 0 || environmentalInteractions.length > 0) && (
              <div className="summary-section">
                <h5 className="summary-section-title">Special Interactions</h5>
                {specialInteractions.length > 0 && (
                  <div className="summary-tags">
                    {specialInteractions.map(id => {
                      const condition = CONDITION_INTERACTIONS.find(c => c.id === id);
                      return condition ? (
                        <span key={id} className="summary-tag" style={{ borderColor: condition.color }}>
                          {condition.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
                
                {environmentalInteractions.length > 0 && (
                  <div className="summary-tags">
                    {environmentalInteractions.map(id => {
                      const env = ENVIRONMENTAL_INTERACTIONS.find(e => e.id === id);
                      return env ? (
                        <span key={id} className="summary-tag" style={{ borderColor: env.color }}>
                          {env.name}
                        </span>
                      ) : null;
                    })}
                  </div>
                )}
              </div>
            )}
            
            {conditionalEffects.length > 0 && (
              <div className="summary-section">
                <h5 className="summary-section-title">Conditional Effects</h5>
                <div className="summary-tags">
                  {conditionalEffects.map(effect => {
                    const trigger = CONDITIONAL_TRIGGERS.find(t => t.id === effect.id);
                    return (
                      <span key={effect.id} className="summary-tag" style={{ borderColor: trigger?.color || '#3498db' }}>
                        {trigger?.name || effect.description.substring(0, 20) + '...'}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
            
            {comboEffects.length > 0 && (
              <div className="summary-section">
                <h5 className="summary-section-title">Combo Potential</h5>
                <div className="summary-tags">
                  {comboEffects.map(combo => {
                    const comboType = COMBO_POTENTIALS.find(c => c.id === combo.id);
                    return (
                      <span key={combo.id} className="summary-tag" style={{ borderColor: comboType?.color || '#2ecc71' }}>
                        {comboType?.name || combo.description.substring(0, 20) + '...'}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <StepNavigation 
        currentStep={5} 
        totalSteps={8} 
        onNext={nextStep} 
        onPrev={prevStep} 
        isNextEnabled={true}
      />
    </div>
  );
};

export default Step6AdvancedMechanics;