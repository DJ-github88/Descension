import React, { useState, useEffect } from 'react';
import { SpellPreview } from './common';

const SpellWizard = () => {
  // State for tracking the current step
  const [currentStep, setCurrentStep] = useState(0);
  
  // Sample spell data that will be built throughout the wizard
  const [spellData, setSpellData] = useState({
    name: '',
    description: '',
    source: '',
    class: '',
    monsterType: '',
    spellType: '',
    category: '',
    subtype: '',
    targetingMode: 'single',
    rangeType: 'ranged',
    range: 30,
    damageTypes: [],
    cooldownValue: 0,
    cooldownUnit: 'seconds',
    primaryDamage: { dice: '', flat: 0 },
    buffs: [],
    debuffs: [],
    visualTheme: 'arcane',
    visualEffect: 'projectile',
    icon: ''
  });
  
  // Update spell data function
  const updateSpellData = (newData) => {
    setSpellData(prevData => ({ ...prevData, ...newData }));
  };
  
  // Sample data for origin selection
  const CLASS_OPTIONS = [
    { id: 'pyrofiend', name: 'Pyrofiend', resource: 'Inferno Levels' },
    { id: 'gambler', name: 'Gambler', resource: 'Fortune Points' },
    { id: 'fateweaver', name: 'Fate Weaver', resource: 'Destiny Shards' },
    { id: 'stormbringer', name: 'Stormbringer', resource: 'Lightning Charges' }
  ];
  
  const MONSTER_TYPES = [
    'Aberration', 'Beast', 'Celestial', 'Construct', 'Dragon',
    'Elemental', 'Fey', 'Fiend', 'Giant', 'Humanoid',
    'Monstrosity', 'Ooze', 'Plant', 'Undead'
  ];
  
  const SPELL_TYPES = [
    { id: 'active', name: 'Active Ability', description: 'An ability that must be activated and typically has a cost and cooldown.' },
    { id: 'passive', name: 'Passive Ability', description: 'An ability that is always active and provides a constant benefit.' },
    { id: 'aura', name: 'Aura', description: 'A persistent effect that affects an area around the caster or target.' },
    { id: 'ultimate', name: 'Ultimate Ability', description: 'A powerful ability with a long cooldown or significant cost.' }
  ];
  
  const SPELL_CATEGORIES = [
    { id: 'damage', name: 'Damage', description: 'Spells that primarily deal damage to targets.' },
    { id: 'healing', name: 'Healing', description: 'Spells that restore health to allies.' },
    { id: 'buff', name: 'Buff', description: 'Spells that enhance allies\' abilities or stats.' },
    { id: 'debuff', name: 'Debuff', description: 'Spells that weaken enemies\' abilities or stats.' },
    { id: 'utility', name: 'Utility', description: 'Spells with practical uses outside of direct combat.' }
  ];
  
  const DAMAGE_TYPES = [
    { id: 'fire', name: 'Fire', color: '#ff4500', icon: '🔥' },
    { id: 'frost', name: 'Frost', color: '#00bfff', icon: '❄️' },
    { id: 'arcane', name: 'Arcane', color: '#9932cc', icon: '✨' },
    { id: 'nature', name: 'Nature', color: '#32cd32', icon: '🌿' },
    { id: 'shadow', name: 'Shadow', color: '#800080', icon: '🌑' },
    { id: 'holy', name: 'Holy', color: '#ffd700', icon: '✨' },
    { id: 'physical', name: 'Physical', color: '#c0c0c0', icon: '⚔️' }
  ];

  // Handle source change
  const handleSourceChange = (source) => {
    updateSpellData({ source });
    if (source === 'class') {
      updateSpellData({ monsterType: '' });
    } else if (source === 'monster') {
      updateSpellData({ class: '' });
    }
  };
  
  // Handle class selection
  const handleClassSelect = (classId) => {
    updateSpellData({ class: classId });
  };
  
  // Handle monster type selection
  const handleMonsterTypeSelect = (type) => {
    updateSpellData({ monsterType: type });
  };
  
  // Handle spell type selection
  const handleSpellTypeSelect = (typeId) => {
    updateSpellData({ spellType: typeId });
  };
  
  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    updateSpellData({ category: categoryId });
  };
  
  // Toggle damage type selection
  const toggleDamageType = (typeId) => {
    setSpellData(prev => {
      const newDamageTypes = prev.damageTypes.includes(typeId)
        ? prev.damageTypes.filter(id => id !== typeId)
        : [...prev.damageTypes, typeId];
      return { ...prev, damageTypes: newDamageTypes };
    });
  };
  
  // Navigation functions
  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 7));
  };
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };
  
  // Helper to get step validation state
  const isStepValid = (step) => {
    switch (step) {
      case 0: // Origin & Identity
        return spellData.source && 
          ((spellData.source === 'class' && spellData.class) || 
           (spellData.source === 'monster' && spellData.monsterType)) &&
          spellData.spellType;
      case 1: // Primary Function
        return spellData.category;
      // Add validation for other steps
      default:
        return true;
    }
  };
  
  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="origin-identity-step">
            <h4 className="section-title">Spell Origin</h4>
            <p className="section-description">
              Begin crafting your spell by selecting its origin.
            </p>
            
            <div className="source-selection">
              <div 
                className={`source-option ${spellData.source === 'class' ? 'selected' : ''}`}
                onClick={() => handleSourceChange('class')}
              >
                <div className="option-icon">👤</div>
                <div className="option-content">
                  <div className="option-label">Player Class</div>
                  <div className="option-description">Create a spell for a specific player class</div>
                </div>
              </div>
              
              <div 
                className={`source-option ${spellData.source === 'monster' ? 'selected' : ''}`}
                onClick={() => handleSourceChange('monster')}
              >
                <div className="option-icon">👹</div>
                <div className="option-content">
                  <div className="option-label">Monster/Creature</div>
                  <div className="option-description">Design an ability for a specific creature type</div>
                </div>
              </div>
            </div>
            
            {spellData.source === 'class' && (
              <div className="section">
                <h5 className="subsection-title">Class Selection</h5>
                <div className="class-options">
                  {CLASS_OPTIONS.map((classOption) => (
                    <div 
                      key={classOption.id}
                      className={`class-option ${spellData.class === classOption.id ? 'selected' : ''}`}
                      onClick={() => handleClassSelect(classOption.id)}
                    >
                      <div className="class-name">{classOption.name}</div>
                      <div className="class-resource">{classOption.resource}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {spellData.source === 'monster' && (
              <div className="section">
                <h5 className="subsection-title">Monster Type</h5>
                <div className="monster-options">
                  {MONSTER_TYPES.map((type) => (
                    <div 
                      key={type}
                      className={`monster-option ${spellData.monsterType === type ? 'selected' : ''}`}
                      onClick={() => handleMonsterTypeSelect(type)}
                    >
                      <div className="monster-type">{type}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {((spellData.source === 'class' && spellData.class) || 
               (spellData.source === 'monster' && spellData.monsterType)) && (
              <div className="section">
                <h5 className="subsection-title">Ability Type</h5>
                <div className="spell-type-options">
                  {SPELL_TYPES.map((type) => (
                    <div 
                      key={type.id}
                      className={`spell-type-option ${spellData.spellType === type.id ? 'selected' : ''}`}
                      onClick={() => handleSpellTypeSelect(type.id)}
                    >
                      <div className="spell-type-name">{type.name}</div>
                      <div className="spell-type-description">{type.description}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {spellData.spellType && (
              <div className="section">
                <h5 className="subsection-title">Spell Details</h5>
                <div className="form-group">
                  <label htmlFor="spell-name">Spell Name:</label>
                  <input 
                    id="spell-name"
                    type="text"
                    value={spellData.name}
                    onChange={(e) => updateSpellData({ name: e.target.value })}
                    placeholder="Enter a name for your spell..."
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="spell-description">Description:</label>
                  <textarea
                    id="spell-description"
                    value={spellData.description}
                    onChange={(e) => updateSpellData({ description: e.target.value })}
                    placeholder="Describe what your spell does..."
                    rows={3}
                  />
                </div>
              </div>
            )}
          </div>
        );
      
      case 1:
        return (
          <div className="primary-function-step">
            <h4 className="section-title">Primary Function</h4>
            <p className="section-description">
              Select the main purpose and role of your spell.
            </p>
            
            <div className="category-options">
              {SPELL_CATEGORIES.map((category) => (
                <div 
                  key={category.id}
                  className={`category-option ${spellData.category === category.id ? 'selected' : ''}`}
                  onClick={() => handleCategorySelect(category.id)}
                >
                  <div className="category-name">{category.name}</div>
                  <div className="category-description">{category.description}</div>
                </div>
              ))}
            </div>
            
            {spellData.category === 'damage' && (
              <div className="section">
                <h5 className="subsection-title">Damage Types</h5>
                <div className="damage-types-grid">
                  {DAMAGE_TYPES.map(type => (
                    <div 
                      key={type.id}
                      className={`damage-type-option ${spellData.damageTypes.includes(type.id) ? 'selected' : ''}`}
                      onClick={() => toggleDamageType(type.id)}
                      style={{ 
                        '--type-color': type.color,
                        borderColor: spellData.damageTypes.includes(type.id) ? type.color : 'transparent'
                      }}
                    >
                      <div className="damage-type-icon">{type.icon}</div>
                      <div className="damage-type-info">
                        <div className="damage-type-name" style={{ color: type.color }}>{type.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            <div className="section">
              <h5 className="subsection-title">Range & Targeting</h5>
              <div className="form-row">
                <div className="form-group">
                  <label>Targeting Mode:</label>
                  <div className="targeting-options">
                    <label className="radio-option">
                      <input 
                        type="radio" 
                        checked={spellData.targetingMode === 'single'}
                        onChange={() => updateSpellData({ targetingMode: 'single' })}
                      />
                      <span>Single Target</span>
                    </label>
                    <label className="radio-option">
                      <input 
                        type="radio" 
                        checked={spellData.targetingMode === 'aoe'}
                        onChange={() => updateSpellData({ targetingMode: 'aoe' })}
                      />
                      <span>Area of Effect</span>
                    </label>
                  </div>
                </div>
                
                <div className="form-group">
                  <label>Range Type:</label>
                  <select 
                    value={spellData.rangeType}
                    onChange={(e) => updateSpellData({ rangeType: e.target.value })}
                  >
                    <option value="self">Self</option>
                    <option value="touch">Touch</option>
                    <option value="melee">Melee (5 ft)</option>
                    <option value="ranged">Ranged</option>
                  </select>
                </div>
                
                {spellData.rangeType === 'ranged' && (
                  <div className="form-group">
                    <label>Range (feet):</label>
                    <input 
                      type="number"
                      min="1"
                      value={spellData.range}
                      onChange={(e) => updateSpellData({ range: parseInt(e.target.value) || 30 })}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      
      // Add more case statements for each step
      
      default:
        return <div>Step {currentStep + 1} - Coming soon</div>;
    }
  };
  
  // Labels for the progress steps
  const steps = [
    'Origin & Identity',
    'Primary Function',
    'Resources',
    'Damage & Healing',
    'Secondary Effects',
    'Visual & Audio',
    'Final Details',
    'Preview'
  ];
  
  return (
    <div className="spell-wizard">
      {/* Progress Steps */}
      <div className="wizard-progress">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`progress-step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
          >
            <div className="step-circle">{index + 1}</div>
            <div className="step-label">{step}</div>
          </div>
        ))}
        <div 
          className="progress-bar" 
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>
      </div>
      
      {/* Main Content Area */}
      <div className="wizard-spell-content">
        <div className="wizard-main">
          {renderStep()}
        </div>
        
        <div className="wizard-preview">
          <SpellPreview spellData={spellData} />
        </div>
      </div>
      
      {/* Navigation */}
      <div className="step-navigation">
        <button 
          className="nav-button prev-button"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          Previous
        </button>
        
        <div className="step-indicator">
          Step {currentStep + 1} of {steps.length}
        </div>
        
        <button 
          className="nav-button next-button"
          onClick={nextStep}
          disabled={!isStepValid(currentStep)}
        >
          {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default SpellWizard;