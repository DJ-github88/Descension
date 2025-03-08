import React, { useState, useEffect } from 'react';
import useSpellWizardStore from '../../../store/spellWizardStore';
import { SpellPreview, StepNavigation, DiceCalculator } from '../common';
import { UtilityEffectSection, UtilityEffectPreview } from '../common/UtilityEffectSystem';
import {
  EFFECT_TYPES,
  DAMAGE_TYPES,
  DURATION_TYPES,
  PRIMARY_STAT_MODIFIERS,
  SECONDARY_STAT_MODIFIERS,
  COMBAT_STAT_MODIFIERS,
  SPELL_DAMAGE_MODIFIERS,
  POSITIVE_STATUS_EFFECTS,
  NEGATIVE_STATUS_EFFECTS,
  COMBAT_ADVANTAGES,
  RESISTANCE_TYPES
} from '../common/effectSystemData';

// Component for displaying effect options
const EffectOptionSelector = ({ title, description, items, selectedItems, toggleItem, colorVariable }) => (
  <>
    <h6 className="subsection-title">{title}</h6>
    <p className="section-description">{description}</p>
    
    <div className="effect-type-grid">
      {items.map(item => (
        <div 
          key={item.id}
          className={`effect-type-item ${selectedItems.includes(item.id) ? 'selected' : ''}`}
          onClick={() => toggleItem(item.id)}
          style={{ 
            '--effect-color': item.color,
            '--effect-color-rgb': item.colorRgb
          }}
        >
          <div className="effect-type-icon">
            <img src={`https://wow.zamimg.com/images/wow/icons/medium/${item.icon}.jpg`} alt={item.name} />
          </div>
          <div className="effect-type-name">
            {item.name}
          </div>
          
          {selectedItems.includes(item.id) && (
            <div className="selection-indicator"></div>
          )}
        </div>
      ))}
    </div>
  </>
);

// Component for displaying a list of selected items with options and remove buttons
const SelectedItemsList = ({ title, items, selectedItems, effectOptions, openSubOptions, toggleItem, getEffectOptionName, effectType }) => (
  selectedItems.length > 0 && (
    <div className="selected-effects">
      <h5>{title}</h5>
      <div className="selected-list">
        {selectedItems.map(itemId => {
          const item = items.find(i => i.id === itemId);
          return (
            <div key={itemId} className="selected-item" style={{
              display: 'flex',
              alignItems: 'center',
              padding: '8px 12px',
              background: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '8px',
              marginBottom: '8px'
            }}>
              <img 
                src={`https://wow.zamimg.com/images/wow/icons/medium/${item.icon}.jpg`}
                alt={item.name}
                className="effect-icon-small"
                style={{ width: '24px', height: '24px', borderRadius: '4px', marginRight: '8px' }}
              />
              <div style={{ flex: 1 }}>
                <div>{item.name}</div>
                {effectOptions[itemId] && (
                  <div style={{ fontSize: '0.9em', opacity: 0.8 }}>
                    {getEffectOptionName(itemId)}
                  </div>
                )}
              </div>
              
              {item.options && item.options.length > 0 && (
                <button 
                  className="options-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    openSubOptions(itemId, effectType);
                  }}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: 'none',
                    borderRadius: '4px',
                    padding: '4px 8px',
                    marginRight: '8px',
                    cursor: 'pointer',
                    color: 'white'
                  }}
                >
                  Options
                </button>
              )}
              
              <button 
                className="remove-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  toggleItem(itemId);
                }}
                style={{
                  background: 'rgba(255, 0, 0, 0.3)',
                  border: 'none',
                  borderRadius: '4px',
                  width: '24px',
                  height: '24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white'
                }}
              >
                ×
              </button>
            </div>
          );
        })}
      </div>
    </div>
  )
);

// Component for displaying stat modifiers with adjustable values
const StatModifierList = ({ title, description, statList, selectedStats, modifierValues, modifierTypes, handleModifierValueChange, handleModifierTypeChange }) => (
  selectedStats.length > 0 && (
    <div className="selected-effects">
      <h5>{title}</h5>
      <p className="section-description">{description}</p>
      <div className="modifier-values">
        {selectedStats.map(statId => {
          const stat = statList.find(s => s.id === statId);
          const isPercentage = modifierTypes[statId] === 'percentage';
          return (
            <div key={statId} className="modifier-value-row" style={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: '16px',
              marginBottom: '12px',
              padding: '10px',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '8px'
            }}>
              <img 
                src={`https://wow.zamimg.com/images/wow/icons/medium/${stat.icon}.jpg`}
                alt={stat.name}
                style={{ width: '24px', height: '24px', borderRadius: '4px' }}
              />
              <span style={{ flex: 1 }}>{stat.name}</span>
              
              {/* Plus/Minus toggle */}
              <div className="number-input-wrapper">
  <button 
    className="decrease-btn"
    onClick={() => {
      const currentValue = modifierValues[statId] || 0;
      handleModifierValueChange(statId, currentValue - 1);
    }}
  >
    -
  </button>
  <input
    type="text"
    value={modifierValues[statId] !== undefined ? modifierValues[statId] : ''}
    onChange={(e) => {
      // Allow empty input for easier editing
      if (e.target.value === '' || e.target.value === '-') {
        handleModifierValueChange(statId, e.target.value === '-' ? '-' : '');
        return;
      }
      
      // Try to parse the input as a number
      const value = parseInt(e.target.value);
      if (!isNaN(value)) {
        handleModifierValueChange(statId, value);
      }
    }}
    onBlur={(e) => {
      // When input loses focus, ensure we have a valid number
      let value = modifierValues[statId];
      if (value === '' || value === '-' || isNaN(value)) {
        value = 0;
      } else if (typeof value === 'string') {
        value = parseInt(value) || 0;
      }
      handleModifierValueChange(statId, value);
    }}
  />
  <button 
    className="increase-btn"
    onClick={() => {
      const currentValue = modifierValues[statId] || 0;
      const numValue = typeof currentValue === 'string' ? parseInt(currentValue) || 0 : currentValue;
      handleModifierValueChange(statId, numValue + 1);
    }}
  >
    +
  </button>
</div>
              
              {/* Single toggle button for % vs flat */}
              <button 
                className={`type-toggle-btn ${isPercentage ? 'percentage-active' : 'flat-active'}`}
                onClick={() => handleModifierTypeChange(statId, isPercentage ? 'flat' : 'percentage')}
                style={{
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  background: isPercentage ? 'rgba(79, 147, 253, 0.3)' : 'rgba(51, 51, 51, 0.5)',
                  color: 'white',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  minWidth: '40px',
                  transition: 'all 0.2s ease'
                }}
              >
                {isPercentage ? '%' : 'Flat'}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  )
);

// Component for displaying resistance modifiers
const ResistanceModifierList = ({ selectedResistances, modifierValues, handleModifierValueChange }) => (
  selectedResistances.length > 0 && (
    <div className="selected-effects">
      <h5>Resistance Enhancements</h5>
      <p className="section-description">
        Configure the resistance bonus percentage for each selected damage type.
      </p>
      <div className="modifier-values">
        {selectedResistances.map(resistanceId => {
          const resistance = RESISTANCE_TYPES.find(r => r.id === resistanceId);
          return (
            <div key={resistanceId} className="modifier-value-row" style={{ 
              display: 'flex', 
              alignItems: 'center',
              gap: '16px',
              marginBottom: '12px',
              padding: '10px',
              backgroundColor: 'rgba(0, 0, 0, 0.2)',
              borderRadius: '8px'
            }}>
              <img 
                src={`https://wow.zamimg.com/images/wow/icons/medium/${resistance.icon}.jpg`}
                alt={resistance.name}
                style={{ width: '24px', height: '24px', borderRadius: '4px' }}
              />
              <span style={{ flex: 1 }}>{resistance.name}</span>
              <div className="number-input-wrapper">
                <button 
                  className="decrease-btn"
                  onClick={() => handleModifierValueChange(
                    resistanceId, 
                    Math.max(1, (modifierValues[resistanceId] || 10) - 1)
                  )}
                >
                  -
                </button>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={modifierValues[resistanceId] || 10}
                  onChange={(e) => handleModifierValueChange(
                    resistanceId, 
                    Math.max(1, Math.min(100, parseInt(e.target.value) || 1))
                  )}
                />
                <button 
                  className="increase-btn"
                  onClick={() => handleModifierValueChange(
                    resistanceId, 
                    Math.min(100, (modifierValues[resistanceId] || 10) + 1)
                  )}
                >
                  +
                </button>
              </div>
              <span>%</span>
            </div>
          );
        })}
      </div>
    </div>
  )
);

// Options Modal component
const OptionsModal = ({ showSubOptions, currentEffectForOptions, selectEffectOption, setShowSubOptions, effectOptionValues, setEffectOptionValues }) => (
  showSubOptions && currentEffectForOptions && (
    <div className="modal-overlay" style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    }}>
      <div className="modal-content" style={{
        backgroundColor: 'var(--background-dark)',
        borderRadius: '8px',
        maxWidth: '500px',
        width: '100%',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.4)'
      }}>
        <h4 style={{ marginTop: 0 }}>Select {currentEffectForOptions.name} Options</h4>
        <p>Choose the specific type of effect to apply.</p>
        
        <div className="option-list" style={{ marginTop: '20px' }}>
          {currentEffectForOptions.options.map(option => (
            <div 
              key={option.id}
              className="option-item"
              style={{
                padding: '12px',
                marginBottom: '8px',
                backgroundColor: currentEffectForOptions.selectedOption === option.id ? 'rgba(255, 255, 255, 0.15)' : 'rgba(0, 0, 0, 0.2)',
                borderRadius: '6px',
                cursor: 'pointer',
                border: currentEffectForOptions.selectedOption === option.id ? '1px solid var(--accent-color)' : '1px solid transparent'
              }}
              onClick={() => selectEffectOption(option.id)}
            >
              <h5 style={{ margin: '0 0 4px 0' }}>{option.name}</h5>
              <p style={{ margin: 0, fontSize: '0.9em', opacity: 0.8 }}>{option.description}</p>
            </div>
          ))}
        </div>
        
        {currentEffectForOptions.selectedOption && (
  <div className="option-details" style={{ marginTop: '15px', padding: '15px', backgroundColor: 'rgba(0, 0, 0, 0.2)', borderRadius: '6px' }}>
    <h5 style={{ marginTop: 0 }}>Effect Strength</h5>
    <div className="option-value-input" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <label>Value:</label>
      <input 
        type="number" 
        min="1" 
        max="100" 
        defaultValue={effectOptionValues[currentEffectForOptions.id] || 25}
        style={{ width: '80px', padding: '5px' }}
        onChange={(e) => {
          const value = parseInt(e.target.value);
          setEffectOptionValues(prev => ({
            ...prev,
            [currentEffectForOptions.id]: value
          }));
        }}
      />
      <span>%</span>
    </div>
    <p style={{ fontSize: '0.9em', opacity: 0.8, marginTop: '10px' }}>
      Specify how powerful this effect will be when applied.
    </p>
  </div>
)}

<div className="modal-actions" style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
  <button 
    className="cancel-btn"
    onClick={() => setShowSubOptions(false)}
    style={{ 
      padding: '8px 16px',
      backgroundColor: 'rgba(0, 0, 0, 0.2)',
      border: 'none',
      borderRadius: '4px',
      marginRight: '12px',
      color: 'white',
      cursor: 'pointer'
    }}
  >
    Cancel
  </button>
  <button 
    className="confirm-btn"
    onClick={() => setShowSubOptions(false)}
    style={{ 
      padding: '8px 16px',
      backgroundColor: 'var(--accent-color)',
      border: 'none',
      borderRadius: '4px',
      color: 'white',
      cursor: 'pointer'
    }}
  >
    Confirm
  </button>
</div>
      </div>
    </div>
  )
);

// Collapsible Section Header Component
const CollapsibleSectionHeader = ({ title, icon, isExpanded, onClick, selectedItems = [] }) => (
  <div 
    className={`collapsible-header ${isExpanded ? 'expanded' : ''}`} 
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      padding: '12px 16px',
      background: 'var(--panel-bg)',
      borderRadius: isExpanded ? '8px 8px 0 0' : '8px',
      border: '1px solid var(--border-color)',
      cursor: 'pointer',
      marginBottom: isExpanded ? 0 : '12px',
      position: 'relative'
    }}
  >
    <img 
      src={`https://wow.zamimg.com/images/wow/icons/medium/${icon}.jpg`} 
      alt="" 
      className="section-icon" 
      style={{ width: '24px', height: '24px', borderRadius: '4px', marginRight: '12px' }}
    />
    <h4 className="section-title" style={{ margin: 0, flex: 1 }}>
      {title}
    </h4>
    
    {/* Selected items count badge */}
    {selectedItems.length > 0 && (
      <div style={{
        background: 'var(--accent-color)',
        borderRadius: '12px',
        padding: '2px 8px',
        fontSize: '0.8rem',
        fontWeight: 'bold',
        marginRight: '12px'
      }}>
        {selectedItems.length}
      </div>
    )}
    
    {/* Expand/Collapse Arrow */}
    <span style={{
      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.3s ease',
      fontSize: '1.2rem'
    }}>
      ▼
    </span>
  </div>
);

// Collapsible Section Content Component
const CollapsibleSectionContent = ({ isExpanded, children }) => (
  isExpanded && (
    <div className="collapsible-content" style={{
      padding: '16px',
      background: 'var(--panel-bg)',
      border: '1px solid var(--border-color)',
      borderTop: 'none',
      borderRadius: '0 0 8px 8px',
      marginBottom: '12px'
    }}>
      {children}
    </div>
  )
);

// Collapsible Subsection Header Component
const CollapsibleSubsectionHeader = ({ title, icon, isExpanded, onClick, selectedItems = [], description }) => (
  <div 
    className={`collapsible-subsection-header ${isExpanded ? 'expanded' : ''}`} 
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      padding: '10px 14px',
      background: 'rgba(0, 0, 0, 0.2)',
      borderRadius: isExpanded ? '6px 6px 0 0' : '6px',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      cursor: 'pointer',
      marginBottom: isExpanded ? 0 : '10px',
      marginTop: '16px',
      position: 'relative'
    }}
  >
    {icon && (
      <img 
        src={`https://wow.zamimg.com/images/wow/icons/medium/${icon}.jpg`} 
        alt="" 
        className="subsection-icon" 
        style={{ width: '20px', height: '20px', borderRadius: '4px', marginRight: '10px' }}
      />
    )}
    <h6 className="subsection-title" style={{ margin: 0, flex: 1, fontWeight: 'bold' }}>
      {title}
    </h6>
    
    {/* Selected items count badge */}
    {selectedItems && selectedItems.length > 0 && (
      <div style={{
        background: 'var(--accent-color)',
        borderRadius: '10px',
        padding: '1px 6px',
        fontSize: '0.7rem',
        fontWeight: 'bold',
        marginRight: '10px'
      }}>
        {selectedItems.length}
      </div>
    )}
    
    {/* Expand/Collapse Arrow */}
    <span style={{
      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
      transition: 'transform 0.3s ease',
      fontSize: '1rem'
    }}>
      ▼
    </span>
  </div>
);

// Collapsible Subsection Content Component
const CollapsibleSubsectionContent = ({ isExpanded, children, description }) => (
  isExpanded && (
    <div className="collapsible-subsection-content" style={{
      padding: '12px',
      background: 'rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderTop: 'none',
      borderRadius: '0 0 6px 6px',
      marginBottom: '12px'
    }}>
      {description && (
        <p className="section-description" style={{ marginTop: 0 }}>
          {description}
        </p>
      )}
      {children}
    </div>
  )
);

// Main Component
const Step4EffectSystem = () => {
  const { spellData, updateSpellData, setStepValidation, nextStep, prevStep } = useSpellWizardStore();
  
  // Local state for form inputs
  const [selectedEffects, setSelectedEffects] = useState(spellData.selectedEffects || ['damage']);
  const [modifierTypes, setModifierTypes] = useState(spellData.modifierTypes || {});
  const [effectOptions, setEffectOptions] = useState(spellData.effectOptions || {});
  const [effectOptionValues, setEffectOptionValues] = useState(spellData.effectOptionValues || {});
  
  // Damage configuration
  const [selectedDamageTypes, setSelectedDamageTypes] = useState(spellData.damageTypes || []);
  const [primaryDamageDice, setPrimaryDamageDice] = useState(spellData.primaryDamage?.dice || '');
  const [primaryDamageFlat, setPrimaryDamageFlat] = useState(spellData.primaryDamage?.flat || 0);
  
  // Healing configuration
  const [healingDice, setHealingDice] = useState(spellData.healing?.dice || '');
  const [healingFlat, setHealingFlat] = useState(spellData.healing?.flat || 0);
  
  // Duration settings
  const [durationType, setDurationType] = useState(spellData.durationType || 'instant');
  const [durationValue, setDurationValue] = useState(spellData.durationValue || 1);
  
  // DoT/HoT mechanics
  const [isPersistent, setIsPersistent] = useState(spellData.isPersistent || false);
  const [persistentDuration, setPersistentDuration] = useState(spellData.persistentDuration || 3);
  const [persistentTick, setPersistentTick] = useState(spellData.persistentTick || '');
  
  // Buff/Debuff configuration
  const [selectedPrimaryStats, setSelectedPrimaryStats] = useState(spellData.primaryStats || []);
  const [selectedSecondaryStats, setSelectedSecondaryStats] = useState(spellData.secondaryStats || []);
  const [selectedCombatStats, setSelectedCombatStats] = useState(spellData.combatStats || []);
  const [selectedSpellDamageStats, setSelectedSpellDamageStats] = useState(spellData.spellDamageStats || []);
  const [selectedResistances, setSelectedResistances] = useState(spellData.resistances || []);
  const [selectedPositiveEffects, setSelectedPositiveEffects] = useState(spellData.positiveEffects || []);
  const [selectedNegativeEffects, setSelectedNegativeEffects] = useState(spellData.negativeEffects || []);
  const [selectedAdvantages, setSelectedAdvantages] = useState(spellData.combatAdvantages || []);
  const [modifierValues, setModifierValues] = useState(spellData.modifierValues || {});
  
  // Utility configuration
  const [utilityData, setUtilityData] = useState(spellData.utilityData || {});
  
  // UI state
  const [isValid, setIsValid] = useState(true);
  const [validationMessage, setValidationMessage] = useState('');
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [showSubOptions, setShowSubOptions] = useState(false);
  const [currentEffectForOptions, setCurrentEffectForOptions] = useState(null);
  
  // Collapsible sections state - most start collapsed except the essential ones
  const [expandedSections, setExpandedSections] = useState({
    mainEffect: true, // Keep Effect System open by default
    damage: false,
    healing: false,
    buff: false,
    debuff: false,
    utility: false,
    duration: false,
    persistent: false,
    summary: true // Keep summary open for user reference
  });
  
  // Collapsible subsections state - all collapsed by default
  const [expandedSubsections, setExpandedSubsections] = useState({
    // Damage subsections
    damageAmount: false,
    damageTypes: false,
    
    // Buff subsections
    primaryStatBuff: false,
    secondaryStatBuff: false,
    combatStatBuff: false,
    spellDamageBuff: false,
    resistanceBuff: false,
    positiveEffects: false,
    combatAdvantages: false,
    
    // Debuff subsections
    primaryStatDebuff: false,
    secondaryStatDebuff: false,
    combatStatDebuff: false,
    negativeEffects: false,
    combatDisadvantages: false,
    
    // Utility subsections (if any)
    
    // Persistent effect subsections
    persistentDuration: false,
    persistentEffect: false
  });
  
  // Toggle section expand/collapse
  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
    
    // Auto-expand first subsection when opening a section for better UX
    if (!expandedSections[section]) {
      // When opening a section, expand the first relevant subsection
      switch(section) {
        case 'damage':
          setExpandedSubsections(prev => ({ ...prev, damageAmount: true }));
          break;
        case 'buff':
          setExpandedSubsections(prev => ({ ...prev, primaryStatBuff: true }));
          break;
        case 'debuff':
          setExpandedSubsections(prev => ({ ...prev, primaryStatDebuff: true }));
          break;
        case 'persistent':
          setExpandedSubsections(prev => ({ ...prev, persistentDuration: true }));
          break;
        default:
          break;
      }
    }
  };
  
  // Toggle subsection expand/collapse
  const toggleSubsection = (subsection) => {
    setExpandedSubsections(prev => ({
      ...prev,
      [subsection]: !prev[subsection]
    }));
  };
  
  // Helper functions
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
    
    if (selectedEffects.includes('damage')) {
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
    
    if (selectedEffects.includes('healing') && !healingDice && healingFlat <= 0) {
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
    
    if (selectedEffects.includes('buff') && 
        selectedPrimaryStats.length === 0 && 
        selectedSecondaryStats.length === 0 &&
        selectedCombatStats.length === 0 &&
        selectedSpellDamageStats.length === 0 &&
        selectedResistances.length === 0 &&
        selectedPositiveEffects.length === 0 && 
        selectedAdvantages.filter(id => COMBAT_ADVANTAGES.find(a => a.id === id)?.category === 'buff').length === 0) {
      validationResult = {
        valid: false,
        message: 'Please select at least one effect for your buff'
      };
    }
    
    if (selectedEffects.includes('debuff') && 
        selectedPrimaryStats.length === 0 && 
        selectedSecondaryStats.length === 0 &&
        selectedCombatStats.length === 0 &&
        selectedNegativeEffects.length === 0 && 
        selectedAdvantages.filter(id => COMBAT_ADVANTAGES.find(a => a.id === id)?.category === 'debuff').length === 0) {
      validationResult = {
        valid: false,
        message: 'Please select at least one effect for your debuff'
      };
    }
    
    if (selectedEffects.includes('utility')) {
      if (!utilityData.mainType || !utilityData.subType) {
        validationResult = {
          valid: false,
          message: 'Please select a utility effect type and subtype'
        };
      }
    }
    
    // Update validation state
    setIsValid(validationResult.valid);
    setValidationMessage(validationResult.message);
    
    // Update spell data with current values
    updateSpellData({
      selectedEffects,
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
      persistentTick,
      primaryStats: selectedPrimaryStats,
      secondaryStats: selectedSecondaryStats,
      combatStats: selectedCombatStats,
      spellDamageStats: selectedSpellDamageStats,
      resistances: selectedResistances,
      positiveEffects: selectedPositiveEffects,
      negativeEffects: selectedNegativeEffects,
      combatAdvantages: selectedAdvantages,
      modifierValues,
      modifierTypes,
      effectOptions,
      effectOptionValues,
      utilityData
    });
    
    // Update step validation
    setStepValidation(3, validationResult.valid);
  }, [
    selectedEffects,
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
    selectedPrimaryStats,
    selectedSecondaryStats,
    selectedCombatStats,
    selectedSpellDamageStats,
    selectedResistances,
    selectedPositiveEffects,
    selectedNegativeEffects,
    selectedAdvantages,
    modifierValues,
    modifierTypes,
    effectOptions,
    effectOptionValues,
    updateSpellData,
    setStepValidation,
    utilityData
  ]);
  
  // Update expanded sections based on selected effects
  useEffect(() => {
    // First handle removing sections that are no longer selected
    setExpandedSections(prev => {
      const newState = { ...prev };
      
      // Only keep sections expanded if their effect type is selected
      if (!selectedEffects.includes('damage')) newState.damage = false;
      if (!selectedEffects.includes('healing')) newState.healing = false;
      if (!selectedEffects.includes('buff')) newState.buff = false;
      if (!selectedEffects.includes('debuff')) newState.debuff = false;
      if (!selectedEffects.includes('utility')) newState.utility = false;
      
      return newState;
    });
    
    // Handle newly selected effect types - auto-expand their sections
    const prevEffects = spellData.selectedEffects || [];
    const newlyAddedEffects = selectedEffects.filter(effect => !prevEffects.includes(effect));
    
    if (newlyAddedEffects.length > 0) {
      // Auto-expand newly added effect sections
      setExpandedSections(prev => {
        const newState = { ...prev };
        newlyAddedEffects.forEach(effect => {
          newState[effect] = true;
        });
        return newState;
      });
      
      // For each newly added effect, expand its first subsection
      newlyAddedEffects.forEach(effect => {
        switch(effect) {
          case 'damage':
            setExpandedSubsections(prev => ({ ...prev, damageAmount: true }));
            break;
          case 'healing':
            // Healing doesn't have subsections yet, but if added later we'd handle it here
            break;
          case 'buff':
            setExpandedSubsections(prev => ({ ...prev, primaryStatBuff: true }));
            break;
          case 'debuff':
            setExpandedSubsections(prev => ({ ...prev, primaryStatDebuff: true }));
            break;
          case 'utility':
            // Utility doesn't have specific subsections, but if added later we'd handle it here
            break;
          default:
            break;
        }
      });
    }
  }, [selectedEffects, spellData.selectedEffects]);
  
  // Event handlers
  const toggleEffectType = (type) => {
    setSelectedEffects(prev => {
      if (prev.includes(type)) {
        // Don't allow removing the last effect type
        if (prev.length === 1) return prev;
        return prev.filter(t => t !== type);
      } else {
        const newEffects = [...prev, type];
        
        // Auto-expand the newly added effect section
        setExpandedSections(prevSections => ({
          ...prevSections,
          [type]: true
        }));
        
        return newEffects;
      }
    });
  };
  
  const toggleDamageType = (typeId) => {
    setSelectedDamageTypes(prev => {
      if (prev.includes(typeId)) {
        return prev.filter(id => id !== typeId);
      } else {
        return [...prev, typeId];
      }
    });
  };
  
  const createToggleFunction = (setter, valuesSetter, typesSetter, defaultValue, defaultType = 'flat') => {
    return (itemId) => {
      setter(prev => {
        if (prev.includes(itemId)) {
          // Remove from selected
          const newItems = prev.filter(id => id !== itemId);
          
          // Also remove from values
          const newValues = {...valuesSetter};
          delete newValues[itemId];
          setModifierValues(newValues);
          
          // Also remove from types
          const newTypes = {...typesSetter};
          delete newTypes[itemId];
          setModifierTypes(newTypes);
          
          return newItems;
        } else {
          // Add to selected with default value
          if (!modifierValues[itemId]) {
            const defaultDir = selectedEffects.includes('buff') ? 1 : -1;
            const defaultSetValue = defaultDir * Math.abs(defaultValue);
            
            setModifierValues(prev => ({
              ...prev,
              [itemId]: defaultSetValue
            }));
            
            // Set default modifier type
            setModifierTypes(prev => ({
              ...prev,
              [itemId]: defaultType
            }));
          }
          return [...prev, itemId];
        }
      });
    };
  };
  
  const togglePrimaryStat = createToggleFunction(setSelectedPrimaryStats, modifierValues, modifierTypes, 2);
  const toggleSecondaryStat = createToggleFunction(setSelectedSecondaryStats, modifierValues, modifierTypes, 5);
  const toggleCombatStat = createToggleFunction(setSelectedCombatStats, modifierValues, modifierTypes, 10, 'percentage');
  const toggleSpellDamageStat = createToggleFunction(setSelectedSpellDamageStats, modifierValues, modifierTypes, 15, 'percentage');
  
  const toggleResistance = (resistanceId) => {
    setSelectedResistances(prev => {
      if (prev.includes(resistanceId)) {
        // Remove from selected
        const newResistances = prev.filter(id => id !== resistanceId);
        
        // Also remove from modifier values
        const newValues = {...modifierValues};
        delete newValues[resistanceId];
        setModifierValues(newValues);
        
        return newResistances;
      } else {
        // Add to selected with default value
        if (!modifierValues[resistanceId]) {
          setModifierValues(prev => ({
            ...prev,
            [resistanceId]: 10
          }));
        }
        return [...prev, resistanceId];
      }
    });
  };
  
  const createStatusEffectToggle = (setter, defaultOptions) => {
    return (effectId) => {
      setter(prev => {
        if (prev.includes(effectId)) {
          // Remove from selected
          const newEffects = prev.filter(id => id !== effectId);
          
          // Also remove from effect options
          const newOptions = {...effectOptions};
          delete newOptions[effectId];
          setEffectOptions(newOptions);
          
          return newEffects;
        } else {
          // Add to selected
          const effect = defaultOptions.find(e => e.id === effectId);
          if (effect && effect.options && effect.options.length > 0) {
            // Set default option if available
            setEffectOptions(prev => ({
              ...prev,
              [effectId]: effect.options[0].id
            }));
          }
          
          return [...prev, effectId];
        }
      });
    };
  };
  
  const togglePositiveEffect = createStatusEffectToggle(setSelectedPositiveEffects, POSITIVE_STATUS_EFFECTS);
  const toggleNegativeEffect = createStatusEffectToggle(setSelectedNegativeEffects, NEGATIVE_STATUS_EFFECTS);
  const toggleAdvantage = createStatusEffectToggle(setSelectedAdvantages, COMBAT_ADVANTAGES);
  
  const handleModifierValueChange = (modifierId, value) => {
    setModifierValues(prev => ({
      ...prev,
      [modifierId]: value
    }));
  };
  
  const handleModifierTypeChange = (modifierId, type) => {
    setModifierTypes(prev => ({
      ...prev,
      [modifierId]: type
    }));
  };
  
  const handleDurationTypeChange = (type) => {
    setDurationType(type);
  };
  
  const handleDurationValueChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setDurationValue(Math.max(1, value));
  };
  
  const handlePersistentToggle = () => {
    setIsPersistent(prev => !prev);
    // Auto-expand persistent section when enabled
    if (!isPersistent) {
      setExpandedSections(prev => ({
        ...prev,
        persistent: true
      }));
    }
  };
  
  const handlePersistentDurationChange = (e) => {
    const value = parseInt(e.target.value) || 1;
    setPersistentDuration(Math.max(1, value));
  };
  
  const showTooltip = (id) => {
    setActiveTooltip(id);
  };
  
  const hideTooltip = () => {
    setActiveTooltip(null);
  };
  
  // Handle effect options
  const openSubOptions = (effectId, effectType) => {
    let effect;
    let selectedOption = effectOptions[effectId];
    
    if (effectType === 'positive') {
      effect = POSITIVE_STATUS_EFFECTS.find(e => e.id === effectId);
    } else if (effectType === 'negative') {
      effect = NEGATIVE_STATUS_EFFECTS.find(e => e.id === effectId);
    } else if (effectType === 'advantage') {
      effect = COMBAT_ADVANTAGES.find(a => a.id === effectId);
    }
    
    if (effect && effect.options && effect.options.length > 0) {
      setCurrentEffectForOptions({
        id: effectId,
        name: effect.name,
        type: effectType,
        options: effect.options,
        selectedOption
      });
      setShowSubOptions(true);
    }
  };
  
  const selectEffectOption = (optionId) => {
    if (currentEffectForOptions) {
      setEffectOptions(prev => ({
        ...prev,
        [currentEffectForOptions.id]: optionId
      }));
      setShowSubOptions(false);
    }
  };
  
  const getEffectOptionName = (effectId) => {
    const optionId = effectOptions[effectId];
    if (!optionId) return '';
    
    let effect;
    let options = [];
    
    // Check in positive effects
    effect = POSITIVE_STATUS_EFFECTS.find(e => e.id === effectId);
    if (effect && effect.options) {
      options = effect.options;
    } else {
      // Check in negative effects
      effect = NEGATIVE_STATUS_EFFECTS.find(e => e.id === effectId);
      if (effect && effect.options) {
        options = effect.options;
      } else {
        // Check in combat advantages
        effect = COMBAT_ADVANTAGES.find(a => a.id === effectId);
        if (effect && effect.options) {
          options = effect.options;
        }
      }
    }
    
    const option = options.find(o => o.id === optionId);
    return option ? option.name : '';
  };
  
  const formatModifierValue = (statId, value) => {
    if (!value) return '';
    
    const isPercentage = modifierTypes[statId] === 'percentage';
    const sign = value > 0 ? '+' : '';
    
    return `${sign}${value}${isPercentage ? '%' : ''}`;
  };

  // Handle utility data change
  const handleUtilityDataChange = (newUtilityData) => {
    setUtilityData(newUtilityData);
  };
  
  // Get count of selected items for different categories
  const getBuffEffectsCount = () => {
    return selectedPrimaryStats.length + 
           selectedSecondaryStats.length + 
           selectedCombatStats.length + 
           selectedSpellDamageStats.length + 
           selectedResistances.length + 
           selectedPositiveEffects.length + 
           selectedAdvantages.filter(id => COMBAT_ADVANTAGES.find(a => a.id === id)?.category === 'buff').length;
  };
  
  const getDebuffEffectsCount = () => {
    return selectedPrimaryStats.length + 
           selectedSecondaryStats.length + 
           selectedCombatStats.length + 
           selectedNegativeEffects.length + 
           selectedAdvantages.filter(id => COMBAT_ADVANTAGES.find(a => a.id === id)?.category === 'debuff').length;
  };
  
  return (
    <div className="wizard-layout">
      <div className="wizard-main-content">
        <div className="wizard-step" id="effect-system-step">
          {/* Main Effect Type Section */}
          <CollapsibleSectionHeader 
            title="Effect System" 
            icon="spell_arcane_arcane03" 
            isExpanded={expandedSections.mainEffect} 
            onClick={() => toggleSection('mainEffect')}
            selectedItems={selectedEffects}
          />
          <CollapsibleSectionContent isExpanded={expandedSections.mainEffect}>
            <p className="section-description">
              Define the primary effect of your spell. The effect determines how your spell interacts with targets.
            </p>
            
            <div className="spell-type-options">
              {EFFECT_TYPES.map(type => (
                <div 
                  key={type.id}
                  className={`spell-type-option ${selectedEffects.includes(type.id) ? 'selected' : ''}`}
                  onClick={() => toggleEffectType(type.id)}
                  onMouseEnter={() => showTooltip(type.id)}
                  onMouseLeave={hideTooltip}
                >
                  <div className="spell-type-icon">
                    <img src={`https://wow.zamimg.com/images/wow/icons/medium/${type.icon}.jpg`} alt={type.name} />
                  </div>
                  <div className="spell-type-info">
                    <div className="spell-type-name">
                      {type.name}
                    </div>
                    <div className="spell-type-description">{type.description}</div>
                  </div>
                  
                  {activeTooltip === type.id && (
                    <div className="spell-tooltip" style={{ 
                      position: 'absolute', 
                      top: '50%', 
                      left: '105%', 
                      transform: 'translateY(-50%)',
                      zIndex: 100,
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
          </CollapsibleSectionContent>
          
          {/* Damage Configuration */}
          {selectedEffects.includes('damage') && (
            <>
              <CollapsibleSectionHeader 
                title="Damage Configuration" 
                icon="ability_warrior_savageblow" 
                isExpanded={expandedSections.damage} 
                onClick={() => toggleSection('damage')}
                selectedItems={selectedDamageTypes}
              />
              <CollapsibleSectionContent isExpanded={expandedSections.damage}>
                {/* Damage Amount Subsection */}
                <CollapsibleSubsectionHeader 
                  title="Damage Amount" 
                  icon="ability_warrior_savageblow" 
                  isExpanded={expandedSubsections.damageAmount} 
                  onClick={() => toggleSubsection('damageAmount')}
                  description="Define how much damage your spell deals using dice notation (e.g., 2d6) and/or flat values."
                />
                <CollapsibleSubsectionContent 
                  isExpanded={expandedSubsections.damageAmount}
                >
                  <DiceCalculator 
                    value={primaryDamageDice} 
                    onChange={(notation) => setPrimaryDamageDice(notation)}
                    showPreview={true}
                    showQuickSelect={true}
                  />
                  
                  <div className="input-group" style={{ maxWidth: '200px', marginTop: '20px' }}>
                    <label>Additional Flat Damage</label>
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
                </CollapsibleSubsectionContent>
                
                {/* Damage Types Subsection */}
                <CollapsibleSubsectionHeader 
                  title="Damage Types" 
                  icon="spell_fire_immolation" 
                  isExpanded={expandedSubsections.damageTypes} 
                  onClick={() => toggleSubsection('damageTypes')}
                  selectedItems={selectedDamageTypes}
                  description="Select the types of damage your spell deals. Different creatures may have resistances or vulnerabilities to specific damage types."
                />
                <CollapsibleSubsectionContent 
                  isExpanded={expandedSubsections.damageTypes}
                >
                  <div className="damage-categories">
                    <h6 className="subsection-title">Physical Damage</h6>
                    <EffectOptionSelector
                      title=""
                      description=""
                      items={DAMAGE_TYPES.filter(type => type.category === 'physical')}
                      selectedItems={selectedDamageTypes}
                      toggleItem={toggleDamageType}
                    />
                    
                    <h6 className="subsection-title" style={{ marginTop: '24px' }}>Magical Damage</h6>
                    <EffectOptionSelector
                      title=""
                      description=""
                      items={DAMAGE_TYPES.filter(type => type.category === 'magical')}
                      selectedItems={selectedDamageTypes}
                      toggleItem={toggleDamageType}
                    />
                  </div>
                </CollapsibleSubsectionContent>
              </CollapsibleSectionContent>
            </>
          )}
          
          {/* Healing Configuration */}
          {selectedEffects.includes('healing') && (
            <>
              <CollapsibleSectionHeader 
                title="Healing Configuration" 
                icon="spell_holy_flashheal" 
                isExpanded={expandedSections.healing} 
                onClick={() => toggleSection('healing')}
              />
              <CollapsibleSectionContent isExpanded={expandedSections.healing}>
                <div className="dice-section">
                  <div className="dice-title">
                    <h6>Healing Amount</h6>
                    <p className="section-description">
                      Define how much healing your spell provides using dice notation (e.g., 2d8) and/or flat values.
                    </p>
                  </div>
                  <DiceCalculator 
                    value={healingDice} 
                    onChange={(notation) => setHealingDice(notation)}
                    showPreview={true}
                    showQuickSelect={true}
                  />
                  
                  <div className="input-group" style={{ maxWidth: '200px', marginTop: '20px' }}>
                    <label>Additional Flat Healing</label>
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
              </CollapsibleSectionContent>
            </>
          )}
          
          {/* Buff Configuration */}
          {selectedEffects.includes('buff') && (
            <>
              <CollapsibleSectionHeader 
                title="Buff Configuration" 
                icon="spell_holy_divineprotection" 
                isExpanded={expandedSections.buff} 
                onClick={() => toggleSection('buff')}
                selectedItems={getBuffEffectsCount() > 0 ? [1] : []}
              />
              <CollapsibleSectionContent isExpanded={expandedSections.buff}>
                <p className="section-description">
                  Configure the positive effects your buff applies to targets. Select at least one effect.
                </p>
                
                <div className="buff-effects">
                  {/* Primary Stat Enhancements Subsection */}
                  <CollapsibleSubsectionHeader 
                    title="Primary Stat Enhancements" 
                    icon="inv_jewelry_talisman_01" 
                    isExpanded={expandedSubsections.primaryStatBuff} 
                    onClick={() => toggleSubsection('primaryStatBuff')}
                    selectedItems={selectedPrimaryStats}
                    description="Select which primary stats are enhanced by your buff."
                  />
                  <CollapsibleSubsectionContent 
                    isExpanded={expandedSubsections.primaryStatBuff}
                  >
                    <EffectOptionSelector
                      title=""
                      description=""
                      items={PRIMARY_STAT_MODIFIERS}
                      selectedItems={selectedPrimaryStats}
                      toggleItem={togglePrimaryStat}
                    />
                    
                    <StatModifierList
                      title="Primary Stat Enhancements"
                      description="Configure the bonus amount for each selected stat and choose between flat value or percentage."
                      statList={PRIMARY_STAT_MODIFIERS}
                      selectedStats={selectedPrimaryStats}
                      modifierValues={modifierValues}
                      modifierTypes={modifierTypes}
                      handleModifierValueChange={handleModifierValueChange}
                      handleModifierTypeChange={handleModifierTypeChange}
                    />
                  </CollapsibleSubsectionContent>
                  
                  {/* Secondary Stat Enhancements Subsection */}
                  <CollapsibleSubsectionHeader 
                    title="Secondary Stat Enhancements" 
                    icon="inv_jewelry_ring_31" 
                    isExpanded={expandedSubsections.secondaryStatBuff} 
                    onClick={() => toggleSubsection('secondaryStatBuff')}
                    selectedItems={selectedSecondaryStats}
                    description="Select which secondary stats are enhanced by your buff."
                  />
                  <CollapsibleSubsectionContent 
                    isExpanded={expandedSubsections.secondaryStatBuff}
                  >
                    <EffectOptionSelector
                      title=""
                      description=""
                      items={SECONDARY_STAT_MODIFIERS}
                      selectedItems={selectedSecondaryStats}
                      toggleItem={toggleSecondaryStat}
                    />
                    
                    <StatModifierList
                      title="Secondary Stat Enhancements"
                      description="Configure the bonus amount for each selected stat and choose between flat value or percentage."
                      statList={SECONDARY_STAT_MODIFIERS}
                      selectedStats={selectedSecondaryStats}
                      modifierValues={modifierValues}
                      modifierTypes={modifierTypes}
                      handleModifierValueChange={handleModifierValueChange}
                      handleModifierTypeChange={handleModifierTypeChange}
                    />
                  </CollapsibleSubsectionContent>
                  
                  {/* Combat Stat Enhancements Subsection */}
                  <CollapsibleSubsectionHeader 
                    title="Combat Stat Enhancements" 
                    icon="ability_warrior_battleshout" 
                    isExpanded={expandedSubsections.combatStatBuff} 
                    onClick={() => toggleSubsection('combatStatBuff')}
                    selectedItems={selectedCombatStats}
                    description="Select which combat stats are enhanced by your buff."
                  />
                  <CollapsibleSubsectionContent 
                    isExpanded={expandedSubsections.combatStatBuff}
                  >
                    <EffectOptionSelector
                      title=""
                      description=""
                      items={COMBAT_STAT_MODIFIERS}
                      selectedItems={selectedCombatStats}
                      toggleItem={toggleCombatStat}
                    />
                    
                    <StatModifierList
                      title="Combat Stat Enhancements"
                      description="Configure the bonus amount for each selected stat and choose between flat value or percentage."
                      statList={COMBAT_STAT_MODIFIERS}
                      selectedStats={selectedCombatStats}
                      modifierValues={modifierValues}
                      modifierTypes={modifierTypes}
                      handleModifierValueChange={handleModifierValueChange}
                      handleModifierTypeChange={handleModifierTypeChange}
                    />
                  </CollapsibleSubsectionContent>
                  
                  {/* Spell Damage Enhancements Subsection */}
                  <CollapsibleSubsectionHeader 
                    title="Spell Damage Enhancements" 
                    icon="spell_fire_flamebolt" 
                    isExpanded={expandedSubsections.spellDamageBuff} 
                    onClick={() => toggleSubsection('spellDamageBuff')}
                    selectedItems={selectedSpellDamageStats}
                    description="Select which spell damage types are enhanced by your buff."
                  />
                  <CollapsibleSubsectionContent 
                    isExpanded={expandedSubsections.spellDamageBuff}
                  >
                    <EffectOptionSelector
                      title=""
                      description=""
                      items={SPELL_DAMAGE_MODIFIERS}
                      selectedItems={selectedSpellDamageStats}
                      toggleItem={toggleSpellDamageStat}
                    />
                    
                    <StatModifierList
                      title="Spell Damage Enhancements"
                      description="Configure the bonus amount for each selected spell damage type and choose between flat value or percentage."
                      statList={SPELL_DAMAGE_MODIFIERS}
                      selectedStats={selectedSpellDamageStats}
                      modifierValues={modifierValues}
                      modifierTypes={modifierTypes}
                      handleModifierValueChange={handleModifierValueChange}
                      handleModifierTypeChange={handleModifierTypeChange}
                    />
                  </CollapsibleSubsectionContent>
                  
                  {/* Resistance Enhancements Subsection */}
                  <CollapsibleSubsectionHeader 
                    title="Resistance Enhancements" 
                    icon="spell_holy_divineprotection" 
                    isExpanded={expandedSubsections.resistanceBuff} 
                    onClick={() => toggleSubsection('resistanceBuff')}
                    selectedItems={selectedResistances}
                    description="Select which damage resistances are enhanced by your buff."
                  />
                  <CollapsibleSubsectionContent 
                    isExpanded={expandedSubsections.resistanceBuff}
                  >
                    <EffectOptionSelector
                      title=""
                      description=""
                      items={RESISTANCE_TYPES}
                      selectedItems={selectedResistances}
                      toggleItem={toggleResistance}
                    />
                    
                    <ResistanceModifierList
                      selectedResistances={selectedResistances}
                      modifierValues={modifierValues}
                      handleModifierValueChange={handleModifierValueChange}
                    />
                  </CollapsibleSubsectionContent>
                  
                  {/* Positive Status Effects Subsection */}
                  <CollapsibleSubsectionHeader 
                    title="Positive Status Effects" 
                    icon="spell_holy_prayerofspirit" 
                    isExpanded={expandedSubsections.positiveEffects} 
                    onClick={() => toggleSubsection('positiveEffects')}
                    selectedItems={selectedPositiveEffects}
                    description="Select beneficial status effects granted by your buff. Click on a selected status to configure additional options."
                  />
                  <CollapsibleSubsectionContent 
                    isExpanded={expandedSubsections.positiveEffects}
                  >
                    <EffectOptionSelector
                      title=""
                      description=""
                      items={POSITIVE_STATUS_EFFECTS}
                      selectedItems={selectedPositiveEffects}
                      toggleItem={togglePositiveEffect}
                    />
                    
                    <SelectedItemsList
                      title="Selected Status Effects"
                      items={POSITIVE_STATUS_EFFECTS}
                      selectedItems={selectedPositiveEffects}
                      effectOptions={effectOptions}
                      openSubOptions={(id) => openSubOptions(id, 'positive')}
                      toggleItem={togglePositiveEffect}
                      getEffectOptionName={getEffectOptionName}
                      effectType="positive"
                    />
                  </CollapsibleSubsectionContent>
                  
                  {/* Combat Advantages Subsection */}
                  <CollapsibleSubsectionHeader 
                    title="Combat Advantages" 
                    icon="ability_warrior_challange" 
                    isExpanded={expandedSubsections.combatAdvantages} 
                    onClick={() => toggleSubsection('combatAdvantages')}
                    selectedItems={selectedAdvantages.filter(id => COMBAT_ADVANTAGES.find(a => a.id === id)?.category === 'buff')}
                    description="Select combat advantages granted by your buff. Click on a selected advantage to configure additional options."
                  />
                  <CollapsibleSubsectionContent 
                    isExpanded={expandedSubsections.combatAdvantages}
                  >
                    <EffectOptionSelector
                      title=""
                      description=""
                      items={COMBAT_ADVANTAGES.filter(advantage => advantage.category === 'buff')}
                      selectedItems={selectedAdvantages.filter(id => COMBAT_ADVANTAGES.find(a => a.id === id)?.category === 'buff')}
                      toggleItem={toggleAdvantage}
                    />
                    
                    <SelectedItemsList
                      title="Selected Combat Advantages"
                      items={COMBAT_ADVANTAGES.filter(a => a.category === 'buff')}
                      selectedItems={selectedAdvantages.filter(id => COMBAT_ADVANTAGES.find(a => a.id === id)?.category === 'buff')}
                      effectOptions={effectOptions}
                      openSubOptions={(id) => openSubOptions(id, 'advantage')}
                      toggleItem={toggleAdvantage}
                      getEffectOptionName={getEffectOptionName}
                      effectType="advantage"
                    />
                  </CollapsibleSubsectionContent>
                </div>
              </CollapsibleSectionContent>
            </>
          )}
          
          {/* Debuff Configuration */}
          {selectedEffects.includes('debuff') && (
            <>
              <CollapsibleSectionHeader 
                title="Debuff Configuration" 
                icon="spell_shadow_curseofachimonde" 
                isExpanded={expandedSections.debuff} 
                onClick={() => toggleSection('debuff')}
                selectedItems={getDebuffEffectsCount() > 0 ? [1] : []}
              />
              <CollapsibleSectionContent isExpanded={expandedSections.debuff}>
                <p className="section-description">
                  Configure the negative effects your debuff applies to targets. Select at least one effect.
                </p>
                
                <div className="debuff-effects">
                  {/* Primary Stat Penalties Subsection */}
                  <CollapsibleSubsectionHeader 
                    title="Primary Stat Penalties" 
                    icon="inv_jewelry_talisman_01" 
                    isExpanded={expandedSubsections.primaryStatDebuff} 
                    onClick={() => toggleSubsection('primaryStatDebuff')}
                    selectedItems={selectedPrimaryStats}
                    description="Select which primary stats are reduced by your debuff."
                  />
                  <CollapsibleSubsectionContent 
                    isExpanded={expandedSubsections.primaryStatDebuff}
                  >
                    <EffectOptionSelector
                      title=""
                      description=""
                      items={PRIMARY_STAT_MODIFIERS}
                      selectedItems={selectedPrimaryStats}
                      toggleItem={togglePrimaryStat}
                    />
                    
                    <StatModifierList
                      title="Primary Stat Penalties"
                      description="Configure the penalty amount for each selected stat and choose between flat value or percentage."
                      statList={PRIMARY_STAT_MODIFIERS}
                      selectedStats={selectedPrimaryStats}
                      modifierValues={modifierValues}
                      modifierTypes={modifierTypes}
                      handleModifierValueChange={handleModifierValueChange}
                      handleModifierTypeChange={handleModifierTypeChange}
                    />
                  </CollapsibleSubsectionContent>
                  
                  {/* Secondary Stat Penalties Subsection */}
                  <CollapsibleSubsectionHeader 
                    title="Secondary Stat Penalties" 
                    icon="inv_jewelry_ring_31" 
                    isExpanded={expandedSubsections.secondaryStatDebuff} 
                    onClick={() => toggleSubsection('secondaryStatDebuff')}
                    selectedItems={selectedSecondaryStats}
                    description="Select which secondary stats are reduced by your debuff."
                  />
                  <CollapsibleSubsectionContent 
                    isExpanded={expandedSubsections.secondaryStatDebuff}
                  >
                    <EffectOptionSelector
                      title=""
                      description=""
                      items={SECONDARY_STAT_MODIFIERS}
                      selectedItems={selectedSecondaryStats}
                      toggleItem={toggleSecondaryStat}
                    />
                    
                    <StatModifierList
                      title="Secondary Stat Penalties"
                      description="Configure the penalty amount for each selected stat and choose between flat value or percentage."
                      statList={SECONDARY_STAT_MODIFIERS}
                      selectedStats={selectedSecondaryStats}
                      modifierValues={modifierValues}
                      modifierTypes={modifierTypes}
                      handleModifierValueChange={handleModifierValueChange}
                      handleModifierTypeChange={handleModifierTypeChange}
                    />
                  </CollapsibleSubsectionContent>
                  
                  {/* Combat Stat Penalties Subsection */}
                  <CollapsibleSubsectionHeader 
                    title="Combat Stat Penalties" 
                    icon="ability_warrior_warcry" 
                    isExpanded={expandedSubsections.combatStatDebuff} 
                    onClick={() => toggleSubsection('combatStatDebuff')}
                    selectedItems={selectedCombatStats}
                    description="Select which combat stats are reduced by your debuff."
                  />
                  <CollapsibleSubsectionContent 
                    isExpanded={expandedSubsections.combatStatDebuff}
                  >
                    <EffectOptionSelector
                      title=""
                      description=""
                      items={COMBAT_STAT_MODIFIERS}
                      selectedItems={selectedCombatStats}
                      toggleItem={toggleCombatStat}
                    />
                    
                    <StatModifierList
                      title="Combat Stat Penalties"
                      description="Configure the penalty amount for each selected stat and choose between flat value or percentage."
                      statList={COMBAT_STAT_MODIFIERS}
                      selectedStats={selectedCombatStats}
                      modifierValues={modifierValues}
                      modifierTypes={modifierTypes}
                      handleModifierValueChange={handleModifierValueChange}
                      handleModifierTypeChange={handleModifierTypeChange}
                    />
                  </CollapsibleSubsectionContent>
                  
                  {/* Negative Status Effects Subsection */}
                  <CollapsibleSubsectionHeader 
                    title="Negative Status Effects" 
                    icon="spell_shadow_antishadow" 
                    isExpanded={expandedSubsections.negativeEffects} 
                    onClick={() => toggleSubsection('negativeEffects')}
                    selectedItems={selectedNegativeEffects}
                    description="Select negative status effects inflicted by your debuff. Click on a selected status to configure additional options."
                  />
                  <CollapsibleSubsectionContent 
                    isExpanded={expandedSubsections.negativeEffects}
                  >
                    <EffectOptionSelector
                      title=""
                      description=""
                      items={NEGATIVE_STATUS_EFFECTS}
                      selectedItems={selectedNegativeEffects}
                      toggleItem={toggleNegativeEffect}
                    />
                    
                    <SelectedItemsList
                      title="Selected Status Effects"
                      items={NEGATIVE_STATUS_EFFECTS}
                      selectedItems={selectedNegativeEffects}
                      effectOptions={effectOptions}
                      openSubOptions={(id) => openSubOptions(id, 'negative')}
                      toggleItem={toggleNegativeEffect}
                      getEffectOptionName={getEffectOptionName}
                      effectType="negative"
                    />
                  </CollapsibleSubsectionContent>
                  
                  {/* Combat Disadvantages Subsection */}
                  <CollapsibleSubsectionHeader 
                    title="Combat Disadvantages" 
                    icon="ability_rogue_dismantle" 
                    isExpanded={expandedSubsections.combatDisadvantages} 
                    onClick={() => toggleSubsection('combatDisadvantages')}
                    selectedItems={selectedAdvantages.filter(id => COMBAT_ADVANTAGES.find(a => a.id === id)?.category === 'debuff')}
                    description="Select combat disadvantages inflicted by your debuff. Click on a selected disadvantage to configure additional options."
                  />
                  <CollapsibleSubsectionContent 
                    isExpanded={expandedSubsections.combatDisadvantages}
                  >
                    <EffectOptionSelector
                      title=""
                      description=""
                      items={COMBAT_ADVANTAGES.filter(advantage => advantage.category === 'debuff')}
                      selectedItems={selectedAdvantages.filter(id => COMBAT_ADVANTAGES.find(a => a.id === id)?.category === 'debuff')}
                      toggleItem={toggleAdvantage}
                    />
                    
                    <SelectedItemsList
                      title="Selected Combat Disadvantages"
                      items={COMBAT_ADVANTAGES.filter(a => a.category === 'debuff')}
                      selectedItems={selectedAdvantages.filter(id => COMBAT_ADVANTAGES.find(a => a.id === id)?.category === 'debuff')}
                      effectOptions={effectOptions}
                      openSubOptions={(id) => openSubOptions(id, 'advantage')}
                      toggleItem={toggleAdvantage}
                      getEffectOptionName={getEffectOptionName}
                      effectType="advantage"
                    />
                  </CollapsibleSubsectionContent>
                </div>
              </CollapsibleSectionContent>
            </>
          )}
          
          {/* Utility Configuration */}
          {selectedEffects.includes('utility') && (
            <>
              <CollapsibleSectionHeader 
                title="Utility Configuration" 
                icon="inv_misc_gear_08" 
                isExpanded={expandedSections.utility} 
                onClick={() => toggleSection('utility')}
                selectedItems={utilityData.mainType ? [1] : []}
              />
              <CollapsibleSectionContent isExpanded={expandedSections.utility}>
                <UtilityEffectSection
                  utilityData={utilityData}
                  onUtilityDataChange={handleUtilityDataChange}
                />
              </CollapsibleSectionContent>
            </>
          )}
          
          {/* Duration Configuration - Applies to all types except Utility where it depends on the specific utility */}
          {(selectedEffects.includes('damage') || selectedEffects.includes('healing') || selectedEffects.includes('buff') || selectedEffects.includes('debuff')) && (
            <>
              <CollapsibleSectionHeader 
                title="Duration Settings" 
                icon="spell_holy_borrowedtime" 
                isExpanded={expandedSections.duration} 
                onClick={() => toggleSection('duration')}
              />
              <CollapsibleSectionContent isExpanded={expandedSections.duration}>
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
                        <div className="cast-option-info">
                          <div className="cast-option-name">
                            {type.name}
                          </div>
                          <div className="cast-option-description">
                            {type.description}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {durationType !== 'instant' && durationType !== 'concentration' && (
                    <div className="duration-value-input" style={{ 
                      marginTop: '20px',
                      padding: '16px',
                      background: 'var(--panel-bg)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)'
                    }}>
                      <div className="input-group">
                        <label>Duration Value:</label>
                        <div className="duration-input-row" style={{ 
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          marginTop: '8px'
                        }}>
                          <div className="number-input-wrapper">
                            <button 
                              className="decrease-btn"
                              onClick={() => setDurationValue(Math.max(1, durationValue - 1))}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min="1"
                              value={durationValue}
                              onChange={handleDurationValueChange}
                            />
                            <button 
                              className="increase-btn"
                              onClick={() => setDurationValue(durationValue + 1)}
                            >
                              +
                            </button>
                          </div>
                          <span className="rounds-label">{durationType}</span>
                        </div>
                        <p className="input-description">
                          How long the effect will last.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </CollapsibleSectionContent>
            </>
          )}
          
          {/* Persistent Effects (DoT/HoT) */}
          {(selectedEffects.includes('damage') || selectedEffects.includes('healing')) && (
            <>
              <CollapsibleSectionHeader 
                title={selectedEffects.includes('damage') ? 'Damage Over Time' : 'Healing Over Time'} 
                icon={selectedEffects.includes('damage') ? 'spell_shadow_curseofsargeras' : 'ability_druid_flourish'} 
                isExpanded={expandedSections.persistent} 
                onClick={() => toggleSection('persistent')}
                selectedItems={isPersistent ? [1] : []}
              />
              <CollapsibleSectionContent isExpanded={expandedSections.persistent}>
                <p className="section-description">
                  Configure whether your spell applies a persistent effect that continues over multiple rounds.
                </p>
                
                <div className="persistent-toggle" style={{ marginBottom: '20px' }}>
                  <label className="toggle-container">
                    <input
                      type="checkbox"
                      checked={isPersistent}
                      onChange={handlePersistentToggle}
                    />
                    <span className="toggle-switch"></span>
                    <span className="toggle-label">
                      Apply {selectedEffects.includes('damage') ? 'DoT' : 'HoT'} effect
                    </span>
                  </label>
                </div>
                
                {isPersistent && (
                  <div className="persistent-settings" style={{ 
                    background: 'var(--panel-bg)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    marginBottom: '10px'
                  }}>
                    {/* Duration Subsection */}
                    <CollapsibleSubsectionHeader 
                      title="Effect Duration" 
                      icon="spell_holy_borrowedtime" 
                      isExpanded={expandedSubsections.persistentDuration} 
                      onClick={() => toggleSubsection('persistentDuration')}
                      description="Define how long your persistent effect will last."
                    />
                    <CollapsibleSubsectionContent 
                      isExpanded={expandedSubsections.persistentDuration}
                    >
                      <div className="input-group">
                        <label>Duration (rounds):</label>
                        <div className="number-input-wrapper" style={{ marginTop: '8px' }}>
                          <button 
                            className="decrease-btn"
                            onClick={() => setPersistentDuration(Math.max(1, persistentDuration - 1))}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={persistentDuration}
                            onChange={handlePersistentDurationChange}
                          />
                          <button 
                            className="increase-btn"
                            onClick={() => setPersistentDuration(persistentDuration + 1)}
                          >
                            +
                          </button>
                        </div>
                        <p className="input-description">
                          Number of rounds the effect will last.
                        </p>
                      </div>
                    </CollapsibleSubsectionContent>
                    
                    {/* Effect Per Tick Subsection */}
                    <CollapsibleSubsectionHeader 
                      title="Effect Per Tick" 
                      icon={selectedEffects.includes('damage') ? 'spell_shadow_curseofsargeras' : 'ability_druid_flourish'} 
                      isExpanded={expandedSubsections.persistentEffect} 
                      onClick={() => toggleSubsection('persistentEffect')}
                      description={`Define how much ${selectedEffects.includes('damage') ? 'damage' : 'healing'} is applied each round.`}
                    />
                    <CollapsibleSubsectionContent 
                      isExpanded={expandedSubsections.persistentEffect}
                    >
                      <DiceCalculator 
                        value={persistentTick} 
                        onChange={(notation) => setPersistentTick(notation)}
                        showPreview={true}
                        showQuickSelect={true}
                      />
                      
                      <div className="persistent-summary" style={{ 
                        marginTop: '20px',
                        padding: '16px',
                        background: 'rgba(0, 0, 0, 0.2)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid rgba(255, 255, 255, 0.1)'
                      }}>
                        <h6 style={{ marginTop: 0 }}>Effect Summary</h6>
                        <p style={{ color: 'var(--text-secondary)' }}>
                          This spell will apply a {selectedEffects.includes('damage') ? 'DoT' : 'HoT'} effect that lasts for {persistentDuration} rounds, 
                          dealing {persistentTick || '[no effect specified]'} {selectedEffects.includes('damage') ? 'damage' : 'healing'} per round.
                        </p>
                      </div>
                    </CollapsibleSubsectionContent>
                  </div>
                )}
              </CollapsibleSectionContent>
            </>
          )}
          
          {/* Summary Section */}
          <CollapsibleSectionHeader 
            title="Effect Summary" 
            icon="inv_misc_note_03" 
            isExpanded={expandedSections.summary} 
            onClick={() => toggleSection('summary')}
          />
          <CollapsibleSectionContent isExpanded={expandedSections.summary}>
            <div className="spell-summary">
              <div className="summary-row">
                <span className="summary-label">Effect Type:</span>
                <span className="summary-value">
                  {selectedEffects.map(effectId => EFFECT_TYPES.find(type => type.id === effectId)?.name).join(', ') || 'None'}
                </span>
              </div>
              
              {selectedEffects.includes('damage') && (
                <>
                  <div className="summary-row">
                    <span className="summary-label">Damage Amount</span>
                    <span className="summary-value">
                      {primaryDamageDice || '0'} {primaryDamageFlat > 0 ? `+ ${primaryDamageFlat}` : ''}
                    </span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Damage Types</span>
                    <span className="summary-value">
                      {selectedDamageTypes.length > 0 
                        ? selectedDamageTypes.map(id => DAMAGE_TYPES.find(t => t.id === id)?.name).join(', ') 
                        : 'None'}
                    </span>
                  </div>
                </>
              )}
              
              {selectedEffects.includes('healing') && (
                <div className="summary-row">
                  <span className="summary-label">Healing Amount</span>
                  <span className="summary-value">
                    {healingDice || '0'} {healingFlat > 0 ? `+ ${healingFlat}` : ''}
                  </span>
                </div>
              )}
              
              {selectedEffects.includes('buff') && (
                <>
                  {selectedPrimaryStats.length > 0 && (
                    <div className="summary-row">
                      <span className="summary-label">Primary Stats</span>
                      <span className="summary-value">
                        {selectedPrimaryStats.map(id => {
                            const stat = PRIMARY_STAT_MODIFIERS.find(s => s.id === id);
                            const value = modifierValues[id] || 2;
                            return `${stat?.name} ${formatModifierValue(id, value)}`;
                          }).join(', ')}
                      </span>
                    </div>
                  )}
                  {selectedSecondaryStats.length > 0 && (
                    <div className="summary-row">
                      <span className="summary-label">Secondary Stats</span>
                      <span className="summary-value">
                        {selectedSecondaryStats.map(id => {
                            const stat = SECONDARY_STAT_MODIFIERS.find(s => s.id === id);
                            const value = modifierValues[id] || 5;
                            return `${stat?.name} ${formatModifierValue(id, value)}`;
                          }).join(', ')}
                      </span>
                    </div>
                  )}
                  {selectedCombatStats.length > 0 && (
                    <div className="summary-row">
                      <span className="summary-label">Combat Stats</span>
                      <span className="summary-value">
                        {selectedCombatStats.map(id => {
                            const stat = COMBAT_STAT_MODIFIERS.find(s => s.id === id);
                            const value = modifierValues[id] || 10;
                            return `${stat?.name} ${formatModifierValue(id, value)}`;
                          }).join(', ')}
                      </span>
                    </div>
                  )}
                  {selectedSpellDamageStats.length > 0 && (
                    <div className="summary-row">
                      <span className="summary-label">Spell Damage</span>
                      <span className="summary-value">
                        {selectedSpellDamageStats.map(id => {
                            const stat = SPELL_DAMAGE_MODIFIERS.find(s => s.id === id);
                            const value = modifierValues[id] || 15;
                            return `${stat?.name} ${formatModifierValue(id, value)}`;
                          }).join(', ')}
                      </span>
                    </div>
                  )}
                  {selectedResistances.length > 0 && (
                    <div className="summary-row">
                      <span className="summary-label">Resistances</span>
                      <span className="summary-value">
                        {selectedResistances.map(id => {
                            const resistance = RESISTANCE_TYPES.find(r => r.id === id);
                            const value = modifierValues[id] || 10;
                            return `${resistance?.name} ${value}%`;
                          }).join(', ')}
                      </span>
                    </div>
                  )}
                  {selectedPositiveEffects.length > 0 && (
                    <div className="summary-row">
                      <span className="summary-label">Status Effects</span>
                      <span className="summary-value">
                        {selectedPositiveEffects.map(id => {
                          const effect = POSITIVE_STATUS_EFFECTS.find(e => e.id === id);
                          const optionName = effectOptions[id] ? ` (${getEffectOptionName(id)})` : '';
                          return `${effect?.name}${optionName}`;
                        }).join(', ')}
                      </span>
                    </div>
                  )}
                  {selectedAdvantages.filter(id => COMBAT_ADVANTAGES.find(a => a.id === id)?.category === 'buff').length > 0 && (
                    <div className="summary-row">
                      <span className="summary-label">Combat Effects</span>
                      <span className="summary-value">
                        {selectedAdvantages
                          .filter(id => COMBAT_ADVANTAGES.find(a => a.id === id)?.category === 'buff')
                          .map(id => {
                            const advantage = COMBAT_ADVANTAGES.find(a => a.id === id);
                            const optionName = effectOptions[id] ? ` (${getEffectOptionName(id)})` : '';
                            return `${advantage?.name}${optionName}`;
                          })
                          .join(', ')}
                      </span>
                    </div>
                  )}
                </>
              )}
              
              {selectedEffects.includes('debuff') && (
                <>
                  {selectedPrimaryStats.length > 0 && (
                    <div className="summary-row">
                      <span className="summary-label">Primary Stat Penalties</span>
                      <span className="summary-value">
                        {selectedPrimaryStats.map(id => {
                            const stat = PRIMARY_STAT_MODIFIERS.find(s => s.id === id);
                            const value = modifierValues[id] || -2;
                            return `${stat?.name} ${formatModifierValue(id, value)}`;
                          }).join(', ')}
                      </span>
                    </div>
                  )}
                  {selectedSecondaryStats.length > 0 && (
                    <div className="summary-row">
                      <span className="summary-label">Secondary Stat Penalties</span>
                      <span className="summary-value">
                        {selectedSecondaryStats.map(id => {
                            const stat = SECONDARY_STAT_MODIFIERS.find(s => s.id === id);
                            const value = modifierValues[id] || -5;
                            return `${stat?.name} ${formatModifierValue(id, value)}`;
                          }).join(', ')}
                      </span>
                    </div>
                  )}
                  {selectedCombatStats.length > 0 && (
                    <div className="summary-row">
                      <span className="summary-label">Combat Stat Penalties</span>
                      <span className="summary-value">
                        {selectedCombatStats.map(id => {
                            const stat = COMBAT_STAT_MODIFIERS.find(s => s.id === id);
                            const value = modifierValues[id] || -10;
                            return `${stat?.name} ${formatModifierValue(id, value)}`;
                          }).join(', ')}
                      </span>
                    </div>
                  )}
                  {selectedNegativeEffects.length > 0 && (
                    <div className="summary-row">
                      <span className="summary-label">Status Effects</span>
                      <span className="summary-value">
                        {selectedNegativeEffects.map(id => {
                          const effect = NEGATIVE_STATUS_EFFECTS.find(e => e.id === id);
                          const optionName = effectOptions[id] ? ` (${getEffectOptionName(id)})` : '';
                          return `${effect?.name}${optionName}`;
                        }).join(', ')}
                      </span>
                    </div>
                  )}
                  {selectedAdvantages.filter(id => COMBAT_ADVANTAGES.find(a => a.id === id)?.category === 'debuff').length > 0 && (
                    <div className="summary-row">
                      <span className="summary-label">Combat Effects</span>
                      <span className="summary-value">
                        {selectedAdvantages
                          .filter(id => COMBAT_ADVANTAGES.find(a => a.id === id)?.category === 'debuff')
                          .map(id => {
                            const advantage = COMBAT_ADVANTAGES.find(a => a.id === id);
                            const optionName = effectOptions[id] ? ` (${getEffectOptionName(id)})` : '';
                            return `${advantage?.name}${optionName}`;
                          })
                          .join(', ')}
                      </span>
                    </div>
                  )}
                </>
              )}
              
              <div className="summary-row">
                <span className="summary-label">Duration</span>
                <span className="summary-value">
                  {durationType === 'instant' ? 'Instant' : 
                   durationType === 'concentration' ? 'Concentration' : 
                   `${durationValue} ${durationType}`}
                </span>
              </div>
              
              {isPersistent && (
                <div className="summary-row">
                  <span className="summary-label">Persistent Effect</span>
                  <span className="summary-value">
                    {persistentTick || '0'} {selectedEffects.includes('damage') ? 'damage' : 'healing'} per round for {persistentDuration} rounds
                  </span>
                </div>
              )}
            </div>
          </CollapsibleSectionContent>
          
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
        <h4 className="preview-title">Spell Preview</h4>
        <SpellPreview 
          spellData={spellData} 
          utilityEffectPreview={<UtilityEffectPreview utilityData={utilityData} />}
        />
      </div>

      {/* Options Modal */}
      {showSubOptions && (
        <OptionsModal 
          showSubOptions={showSubOptions}
          currentEffectForOptions={currentEffectForOptions}
          selectEffectOption={selectEffectOption}
          setShowSubOptions={setShowSubOptions}
          effectOptionValues={effectOptionValues}
          setEffectOptionValues={setEffectOptionValues}
        />
      )}
    </div>
  );
};

export default Step4EffectSystem;