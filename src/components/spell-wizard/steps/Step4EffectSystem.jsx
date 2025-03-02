import React, { useState, useEffect } from 'react';
import useSpellWizardStore from '../../../store/spellWizardStore';
import { SpellPreview, StepNavigation, DiceCalculator } from '../common';
import '../styles/spell-wizard.css';
import '../styles/spell-wizard-layout.css';

// Effect Types
const EFFECT_TYPES = [
  { 
    id: 'damage', 
    name: 'Damage', 
    description: 'Deal damage to targets', 
    icon: 'ability_warrior_savageblow',
    color: '#ff4a4a'
  },
  { 
    id: 'healing', 
    name: 'Healing', 
    description: 'Restore health to targets', 
    icon: 'spell_holy_flashheal',
    color: '#4aff4a'
  },
  { 
    id: 'buff', 
    name: 'Buff', 
    description: 'Apply positive effects to targets', 
    icon: 'spell_holy_divineprotection',
    color: '#4a9dff'
  },
  { 
    id: 'debuff', 
    name: 'Debuff', 
    description: 'Apply negative effects to targets', 
    icon: 'spell_shadow_curseofachimonde',
    color: '#ff4aff'
  },
  { 
    id: 'utility', 
    name: 'Utility', 
    description: 'Special effects that don\'t fit other categories', 
    icon: 'inv_misc_gear_08',
    color: '#ffff4a'
  }
];

// Damage Types with their colors
const DAMAGE_TYPES = [
  // Physical damage types
  { id: 'bludgeoning', name: 'Bludgeoning', icon: 'ability_warrior_punishingblow', color: '#a9a9a9', category: 'physical' },
  { id: 'piercing', name: 'Piercing', icon: 'ability_marksmanship', color: '#c0c0c0', category: 'physical' },
  { id: 'slashing', name: 'Slashing', icon: 'ability_rogue_slicedice', color: '#d3d3d3', category: 'physical' },
  
  // Magical damage types
  { id: 'acid', name: 'Acid', icon: 'spell_nature_acid_01', color: '#32cd32', category: 'magical' },
  { id: 'cold', name: 'Cold', icon: 'spell_frost_frostshock', color: '#00bfff', category: 'magical' },
  { id: 'fire', name: 'Fire', icon: 'spell_fire_fireball', color: '#ff4500', category: 'magical' },
  { id: 'force', name: 'Force', icon: 'spell_arcane_blast', color: '#9932cc', category: 'magical' },
  { id: 'lightning', name: 'Lightning', icon: 'spell_lightning_lightningbolt01', color: '#ffd700', category: 'magical' },
  { id: 'necrotic', name: 'Necrotic', icon: 'spell_shadow_shadowbolt', color: '#800080', category: 'magical' },
  { id: 'poison', name: 'Poison', icon: 'spell_nature_nullifydisease', color: '#008000', category: 'magical' },
  { id: 'psychic', name: 'Psychic', icon: 'spell_shadow_mindtwisting', color: '#9370db', category: 'magical' },
  { id: 'radiant', name: 'Radiant', icon: 'spell_holy_holybolt', color: '#ffd700', category: 'magical' },
  { id: 'thunder', name: 'Thunder', icon: 'spell_nature_thunderclap', color: '#1e90ff', category: 'magical' }
];

// Duration Types
const DURATION_TYPES = [
  { id: 'instant', name: 'Instant', description: 'Effect occurs immediately', icon: 'spell_holy_holybolt' },
  { id: 'rounds', name: 'Rounds', description: 'Effect lasts for a specific number of rounds', icon: 'spell_holy_borrowedtime' },
  { id: 'minutes', name: 'Minutes', description: 'Effect lasts for a specific number of minutes', icon: 'spell_nature_timestop' },
  { id: 'hours', name: 'Hours', description: 'Effect lasts for a specific number of hours', icon: 'inv_misc_pocketwatch_01' },
  { id: 'concentration', name: 'Concentration', description: 'Effect lasts as long as you maintain concentration', icon: 'spell_arcane_mindmastery' },
];

const Step4EffectSystem = () => {
  const { spellData, updateSpellData, setStepValidation, nextStep, prevStep } = useSpellWizardStore();
  
  // Local state for form inputs
  const [effectType, setEffectType] = useState(spellData.effectType || 'damage');
  const [selectedDamageTypes, setSelectedDamageTypes] = useState(spellData.damageTypes || []);
  
  // Damage dice state
  const [primaryDamageDice, setPrimaryDamageDice] = useState(spellData.primaryDamage?.dice || '');
  const [primaryDamageFlat, setPrimaryDamageFlat] = useState(spellData.primaryDamage?.flat || 0);
  
  // Healing dice state
  const [healingDice, setHealingDice] = useState(spellData.healing?.dice || '');
  const [healingFlat, setHealingFlat] = useState(spellData.healing?.flat || 0);
  
  // Duration settings
  const [durationType, setDurationType] = useState(spellData.durationType || 'instant');
  const [durationValue, setDurationValue] = useState(spellData.durationValue || 1);
  
  // DoT/HoT mechanics
  const [isPersistent, setIsPersistent] = useState(spellData.isPersistent || false);
  const [persistentDuration, setPersistentDuration] = useState(spellData.persistentDuration || 3);
  const [persistentTick, setPersistentTick] = useState(spellData.persistentTick || '');
  
  // Local state for tracking validation
  const [isValid, setIsValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState('');
  
  // Active tooltip
  const [activeTooltip, setActiveTooltip] = useState(null);
  
  // Utility function to get class name
  const getClassName = (classId) => {
    if (!classId) return '';
    
    const classMap = {
      'pyrofiend': 'Pyrofiend',
      'gambler': 'Gambler',
      'fateweaver': 'Fate Weaver',
      'stormbringer': 'Stormbringer',
      'berserker': 'Berserker',
      'shadowdancer': 'Shadowdancer',
      'elementalist': 'Elementalist'
    };
    
    return classMap[classId] || classId;
  };
  
  // Utility function to get spell type name
  const getSpellTypeName = (typeId) => {
    if (!typeId) return '';
    
    const typeMap = {
      'active': 'Active Ability',
      'passive': 'Passive Ability',
      'aura': 'Aura',
      'ultimate': 'Ultimate Ability',
      'reaction': 'Reaction',
      'ritual': 'Ritual'
    };
    
    return typeMap[typeId] || typeId;
  };
  
  // Update validation status and spell data
  useEffect(() => {
    // Validate based on effect type
    let validationResult = { valid: true, message: '' };
    
    if (effectType === 'damage') {
      if (!primaryDamageDice && primaryDamageFlat <= 0) {
        validationResult = { 
          valid: false, 
          message: 'Please specify damage amount using dice notation or flat value' 
        };
      }
      if (selectedDamageTypes.length === 0) {
        validationResult = { 
          valid: false, 
          message: 'Please select at least one damage type' 
        };
      }
    }
    
    if (effectType === 'healing' && !healingDice && healingFlat <= 0) {
      validationResult = { 
        valid: false, 
        message: 'Please specify healing amount using dice notation or flat value' 
      };
    }
    
    if (isPersistent && !persistentTick) {
      validationResult = { 
        valid: false, 
        message: 'Please specify effect per tick for persistent effect' 
      };
    }
    
    // Update validation state
    setIsValid(validationResult.valid);
    setValidationMessage(validationResult.message);
    
    // Update spell data with current values
    updateSpellData({
      effectType,
      damageTypes: selectedDamageTypes,
      primaryDamage: {
        dice: primaryDamageDice,
        flat: primaryDamageFlat,
        procChance: 100
      },
      healing: {
        dice: healingDice,
        flat: healingFlat
      },
      durationType,
      durationValue,
      isPersistent,
      persistentDuration,
      persistentTick
    });
    
    // Update step validation
    setStepValidation(3, validationResult.valid);
  }, [
    effectType,
    selectedDamageTypes,
    primaryDamageDice,
    primaryDamageFlat,
    healingDice,
    healingFlat,
    durationType,
    durationValue,
    isPersistent,
    persistentDuration,
    persistentTick,
    updateSpellData,
    setStepValidation
  ]);
  
  // Handle effect type selection
  const handleEffectTypeChange = (type) => {
    setEffectType(type);
  };
  
  // Toggle damage type selection
  const toggleDamageType = (typeId) => {
    setSelectedDamageTypes(prev => {
      if (prev.includes(typeId)) {
        return prev.filter(id => id !== typeId);
      } else {
        return [...prev, typeId];
      }
    });
  };
  
  // Handle duration type change
  const handleDurationTypeChange = (type) => {
    setDurationType(type);
  };
  
  // Handle duration value change
  const handleDurationValueChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setDurationValue(Math.max(1, value));
  };
  
  // Handle persistent toggle
  const handlePersistentToggle = () => {
    setIsPersistent(prev => !prev);
  };
  
  // Handle persistent duration change
  const handlePersistentDurationChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setPersistentDuration(Math.max(1, value));
  };
  
  // Show tooltip
  const showTooltip = (id) => {
    setActiveTooltip(id);
  };
  
  // Hide tooltip
  const hideTooltip = () => {
    setActiveTooltip(null);
  };
  
  // Handle primary damage dice change
  const handlePrimaryDamageDiceChange = (notation) => {
    setPrimaryDamageDice(notation);
  };
  
  // Handle healing dice change
  const handleHealingDiceChange = (notation) => {
    setHealingDice(notation);
  };
  
  // Handle persistent tick change
  const handlePersistentTickChange = (notation) => {
    setPersistentTick(notation);
  };
  
  return (
    <div className="wizard-layout">
      <div className="wizard-main-content">
        <div className="spell-effect-step">
          {/* Main Effect Type Section */}
          <div className="section">
            <h4 className="section-title">
              <img 
                src="https://wow.zamimg.com/images/wow/icons/medium/spell_arcane_arcane03.jpg" 
                alt="" 
                className="section-icon" 
              />
              Effect System
            </h4>
            <p className="section-description">
              Define the primary effect of your spell. The effect determines how your spell interacts with targets.
            </p>
            
            <div className="category-options">
              {EFFECT_TYPES.map(type => (
                <div 
                  key={type.id}
                  className={`category-option ${effectType === type.id ? 'selected' : ''}`}
                  onClick={() => handleEffectTypeChange(type.id)}
                  onMouseEnter={() => showTooltip(type.id)}
                  onMouseLeave={hideTooltip}
                  style={{ 
                    borderColor: effectType === type.id ? type.color : 'transparent',
                    boxShadow: effectType === type.id ? `0 0 10px ${type.color}40` : 'none'
                  }}
                >
                  <div className="category-icon">
                    <img src={`https://wow.zamimg.com/images/wow/icons/medium/${type.icon}.jpg`} alt={type.name} />
                  </div>
                  <div className="category-info">
                    <div className="category-name" style={{ color: effectType === type.id ? type.color : 'inherit' }}>
                      {type.name}
                    </div>
                    <div className="category-description">{type.description}</div>
                  </div>
                  
                  {activeTooltip === type.id && (
                    <div className="spell-tooltip" style={{ 
                      position: 'absolute', 
                      top: '50%', 
                      left: '105%', 
                      transform: 'translateY(-50%)',
                      zIndex: 100,
                      width: '250px'
                    }}>
                      <div className="tooltip-header">
                        <img 
                          src={`https://wow.zamimg.com/images/wow/icons/medium/${type.icon}.jpg`}
                          alt={type.name}
                          className="tooltip-icon"
                        />
                        <span className="tooltip-title">{type.name}</span>
                      </div>
                      <div className="tooltip-description">{type.description}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Damage Configuration */}
          {effectType === 'damage' && (
            <div className="section">
              <h5 className="subsection-title">
                <img src="https://wow.zamimg.com/images/wow/icons/medium/ability_warrior_savageblow.jpg" alt="" className="section-icon" />
                Damage Configuration
              </h5>
              
              <div className="dice-section">
                <div className="dice-title">
                  <h6>Damage Amount</h6>
                  <p className="section-description">
                    Define how much damage your spell deals using dice notation (e.g., 2d6) and/or flat values.
                  </p>
                </div>
                <DiceCalculator 
                  value={primaryDamageDice} 
                  onChange={handlePrimaryDamageDiceChange}
                  showPreview={true}
                  showQuickSelect={true}
                />
                
                <div className="flat-damage-input" style={{ marginTop: '20px' }}>
                  <h6>Additional Flat Damage</h6>
                  <div className="input-group" style={{ maxWidth: '200px' }}>
                    <input
                      type="number"
                      min="0"
                      value={primaryDamageFlat}
                      onChange={(e) => setPrimaryDamageFlat(parseInt(e.target.value) || 0)}
                      className="spell-name-input"
                    />
                    <p className="input-description">
                      This value will be added to your dice roll result.
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Damage Types Selection */}
              <div className="damage-types-section" style={{ marginTop: '30px' }}>
                <h6>Damage Types</h6>
                <p className="section-description">
                  Select the types of damage your spell deals. Different creatures may have resistances or vulnerabilities to specific damage types.
                </p>
                
                <div className="damage-categories">
                  <h6 className="subsection-title">Physical Damage</h6>
                  <div className="effect-type-grid">
                    {DAMAGE_TYPES.filter(type => type.category === 'physical').map(type => (
                      <div 
                        key={type.id}
                        className="effect-type-item"
                        onClick={() => toggleDamageType(type.id)}
                        style={{ 
                          borderColor: selectedDamageTypes.includes(type.id) ? type.color : 'transparent',
                          boxShadow: selectedDamageTypes.includes(type.id) ? `0 0 10px ${type.color}40` : 'none'
                        }}
                      >
                        <div className="effect-type-icon">
                          <img src={`https://wow.zamimg.com/images/wow/icons/medium/${type.icon}.jpg`} alt={type.name} />
                        </div>
                        <div 
                          className="effect-type-name"
                          style={{ color: selectedDamageTypes.includes(type.id) ? type.color : 'inherit' }}
                        >
                          {type.name}
                        </div>
                        
                        {selectedDamageTypes.includes(type.id) && (
                          <div className="selection-indicator" style={{ backgroundColor: type.color }}></div>
                        )}
                      </div>
                    ))}
                  </div>
                  
                  <h6 className="subsection-title" style={{ marginTop: '20px' }}>Magical Damage</h6>
                  <div className="effect-type-grid">
                    {DAMAGE_TYPES.filter(type => type.category === 'magical').map(type => (
                      <div 
                        key={type.id}
                        className="effect-type-item"
                        onClick={() => toggleDamageType(type.id)}
                        style={{ 
                          borderColor: selectedDamageTypes.includes(type.id) ? type.color : 'transparent',
                          boxShadow: selectedDamageTypes.includes(type.id) ? `0 0 10px ${type.color}40` : 'none'
                        }}
                      >
                        <div className="effect-type-icon">
                          <img src={`https://wow.zamimg.com/images/wow/icons/medium/${type.icon}.jpg`} alt={type.name} />
                        </div>
                        <div 
                          className="effect-type-name"
                          style={{ color: selectedDamageTypes.includes(type.id) ? type.color : 'inherit' }}
                        >
                          {type.name}
                        </div>
                        
                        {selectedDamageTypes.includes(type.id) && (
                          <div className="selection-indicator" style={{ backgroundColor: type.color }}></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Selected damage types summary */}
                {selectedDamageTypes.length > 0 && (
                  <div className="selected-types-summary">
                    <h6>Selected Damage Types</h6>
                    <div className="type-tags">
                      {selectedDamageTypes.map(typeId => {
                        const type = DAMAGE_TYPES.find(t => t.id === typeId);
                        return (
                          <div 
                            key={typeId} 
                            className="type-tag"
                            style={{ 
                              borderColor: type.color,
                              color: type.color,
                              backgroundColor: `${type.color}20`
                            }}
                          >
                            {type.name}
                            <button 
                              className="remove-type"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleDamageType(typeId);
                              }}
                            >
                              ×
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Healing Configuration */}
          {effectType === 'healing' && (
            <div className="section">
              <h5 className="subsection-title">
                <img src="https://wow.zamimg.com/images/wow/icons/medium/spell_holy_flashheal.jpg" alt="" className="section-icon" />
                Healing Configuration
              </h5>
              
              <div className="dice-section">
                <div className="dice-title">
                  <h6>Healing Amount</h6>
                  <p className="section-description">
                    Define how much healing your spell provides using dice notation (e.g., 2d8) and/or flat values.
                  </p>
                </div>
                <DiceCalculator 
                  value={healingDice} 
                  onChange={handleHealingDiceChange}
                  showPreview={true}
                  showQuickSelect={true}
                />
                
                <div className="flat-healing-input" style={{ marginTop: '20px' }}>
                  <h6>Additional Flat Healing</h6>
                  <div className="input-group" style={{ maxWidth: '200px' }}>
                    <input
                      type="number"
                      min="0"
                      value={healingFlat}
                      onChange={(e) => setHealingFlat(parseInt(e.target.value) || 0)}
                      className="spell-name-input"
                    />
                    <p className="input-description">
                      This value will be added to your dice roll result.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Duration Configuration */}
          {(effectType === 'damage' || effectType === 'healing' || effectType === 'buff' || effectType === 'debuff') && (
            <div className="section">
              <h5 className="subsection-title">
                <img src="https://wow.zamimg.com/images/wow/icons/medium/spell_holy_borrowedtime.jpg" alt="" className="section-icon" />
                Duration Settings
              </h5>
              <p className="section-description">
                Define how long your spell's effects last.
              </p>
              
              <div className="duration-options">
                <div className="cast-options-grid">
                  {DURATION_TYPES.map(type => (
                    <div 
                      key={type.id}
                      className={`cast-option ${durationType === type.id ? 'selected' : ''}`}
                      onClick={() => handleDurationTypeChange(type.id)}
                    >
                      <div className="cast-option-icon">
                        <img src={`https://wow.zamimg.com/images/wow/icons/medium/${type.icon}.jpg`} alt={type.name} />
                      </div>
                      <div className="cast-option-name">
                        {type.name}
                      </div>
                    </div>
                  ))}
                </div>
                
                {durationType !== 'instant' && durationType !== 'concentration' && (
                  <div className="duration-value-input" style={{ 
                    marginTop: '20px',
                    padding: '15px',
                    backgroundColor: 'var(--panel-bg)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)'
                  }}>
                    <div className="input-group">
                      <label>Duration Value:</label>
                      <div style={{ 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                      }}>
                        <input
                          type="number"
                          min="1"
                          value={durationValue}
                          onChange={handleDurationValueChange}
                          className="spell-name-input"
                          style={{ width: '80px' }}
                        />
                        <span>{durationType}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Persistent Effects (DoT/HoT) */}
          {(effectType === 'damage' || effectType === 'healing') && (
            <div className="section">
              <h5 className="subsection-title">
                <img 
                  src={`https://wow.zamimg.com/images/wow/icons/medium/${
                    effectType === 'damage' ? 'spell_shadow_curseofsargeras' : 'ability_druid_flourish'
                  }.jpg`} 
                  alt="" 
                  className="section-icon" 
                />
                {effectType === 'damage' ? 'Damage Over Time' : 'Healing Over Time'}
              </h5>
              <p className="section-description">
                Configure whether your spell applies a persistent effect that continues over multiple rounds.
              </p>
              
              <div className="persistent-toggle" style={{ 
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px'
              }}>
                <label className="custom-checkbox">
                  <input
                    type="checkbox"
                    checked={isPersistent}
                    onChange={handlePersistentToggle}
                  />
                  <span className="checkmark"></span>
                  <span style={{ marginLeft: '10px' }}>
                    Apply {effectType === 'damage' ? 'DoT' : 'HoT'} effect
                  </span>
                </label>
              </div>
              
              {isPersistent && (
                <div className="persistent-settings" style={{ 
                  backgroundColor: 'var(--panel-bg)',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)'
                }}>
                  <div className="input-group" style={{ marginBottom: '20px' }}>
                    <label>Duration (rounds):</label>
                    <input
                      type="number"
                      min="1"
                      value={persistentDuration}
                      onChange={handlePersistentDurationChange}
                      className="spell-name-input"
                      style={{ width: '80px' }}
                    />
                    <p className="input-description">
                      Number of rounds the effect will last.
                    </p>
                  </div>
                  
                  <div className="dice-section">
                    <div className="dice-title">
                      <h6>Effect Per Tick</h6>
                      <p className="section-description">
                        Define how much {effectType === 'damage' ? 'damage' : 'healing'} is applied each round.
                      </p>
                    </div>
                    <DiceCalculator 
                      value={persistentTick} 
                      onChange={handlePersistentTickChange}
                      showPreview={true}
                      showQuickSelect={true}
                    />
                  </div>
                  
                  <div style={{ 
                    marginTop: '20px',
                    padding: '15px',
                    backgroundColor: 'rgba(0, 0, 0, 0.2)',
                    borderRadius: '8px',
                    border: '1px solid rgba(255, 255, 255, 0.1)'
                  }}>
                    <h6 style={{ marginTop: 0 }}>Effect Summary</h6>
                    <p style={{ color: 'var(--text-secondary)' }}>
                      This spell will apply a {effectType === 'damage' ? 'DoT' : 'HoT'} effect that lasts for {persistentDuration} rounds, 
                      dealing {persistentTick || '[no effect specified]'} {effectType} per round.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Buff/Debuff Configuration */}
          {(effectType === 'buff' || effectType === 'debuff') && (
            <div className="section">
              <h5 className="subsection-title">
                <img 
                  src={`https://wow.zamimg.com/images/wow/icons/medium/${
                    effectType === 'buff' ? 'spell_holy_divineprotection' : 'spell_shadow_curseofachimonde'
                  }.jpg`} 
                  alt="" 
                  className="section-icon" 
                />
                {effectType === 'buff' ? 'Buff' : 'Debuff'} Configuration
              </h5>
              <p className="section-description">
                Configure the effects your {effectType} applies to targets. You'll be able to add more complex
                effects in the next step.
              </p>
              
              <div style={{ 
                backgroundColor: 'var(--panel-bg)',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100px'
              }}>
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
                  Basic {effectType} settings configured. Continue to the "Secondary Effects" step to add specific stat modifications,
                  status conditions, or special abilities.
                </p>
              </div>
            </div>
          )}
          
          {/* Utility Configuration */}
          {effectType === 'utility' && (
            <div className="section">
              <h5 className="subsection-title">
                <img src="https://wow.zamimg.com/images/wow/icons/medium/inv_misc_gear_08.jpg" alt="" className="section-icon" />
                Utility Configuration
              </h5>
              <p className="section-description">
                Utility spells provide special effects that don't directly deal damage or healing. You'll be able to add more complex
                effects in the next steps.
              </p>
              
              <div style={{ 
                backgroundColor: 'var(--panel-bg)',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '100px'
              }}>
                <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>
                  Basic utility settings configured. Continue to the "Secondary Effects" and "Advanced Mechanics" steps
                  to add specific utility effects and special abilities.
                </p>
              </div>
            </div>
          )}
          
          {/* Validation Message */}
          {!isValid && (
            <div className="validation-message">
              {validationMessage}
            </div>
          )}
          
          {/* Navigation Buttons */}
          <StepNavigation 
            currentStep={3} 
            isNextEnabled={isValid}
            onPrev={prevStep}
            onNext={nextStep}
          />
        </div>
      </div>
      
      {/* Side Preview Panel */}
      <div className="wizard-side-panel">
        <div className="spell-preview-container">
          <div className="spell-header">
            {spellData.icon ? (
              <img 
                src={`https://wow.zamimg.com/images/wow/icons/medium/${spellData.icon}.jpg`} 
                alt=""
                className="spell-icon"
                onError={(e) => {
                  e.target.src = 'https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg';
                }}
              />
            ) : (
              <img 
                src="https://wow.zamimg.com/images/wow/icons/medium/inv_misc_questionmark.jpg" 
                alt=""
                className="spell-icon"
              />
            )}
            <div className="spell-header-info">
              <h3 className="spell-name">{spellData.name || 'Unnamed Spell'}</h3>
              <div className="spell-subtitle">
                {spellData.source === 'class' && spellData.class && getClassName(spellData.class)}
                {spellData.source === 'monster' && spellData.monsterType}
                {spellData.spellType && ` · ${getSpellTypeName(spellData.spellType)}`}
              </div>
            </div>
          </div>
          <SpellPreview spellData={spellData} />
        </div>
        
        <div className="wizard-help-panel">
          <h4>
            <img src="https://wow.zamimg.com/images/wow/icons/medium/inv_misc_note_05.jpg" alt="" />
            Step 4: Effect System
          </h4>
          <p>In this step, you'll define the primary effects of your spell:</p>
          <ul>
            <li>Choose between damage, healing, buffs, debuffs, or utility effects</li>
            <li>Set damage or healing amounts using dice notation</li>
            <li>Select damage types to apply (important for resistances and vulnerabilities)</li>
            <li>Configure duration settings for effects</li>
            <li>Set up Damage over Time (DoT) or Healing over Time (HoT) effects</li>
          </ul>
          <div className="help-tip">
            <img src="https://wow.zamimg.com/images/wow/icons/medium/ability_rogue_sprint.jpg" alt="Tip" />
            <p>Consider your spell's role in combat when choosing damage types. Some enemies are resistant to certain damage types while being vulnerable to others. For persistent effects, remember to balance the power across the total duration.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step4EffectSystem;