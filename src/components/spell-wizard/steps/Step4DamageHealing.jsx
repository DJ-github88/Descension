import React, { useState, useEffect } from 'react';
import useSpellWizardStore from '../../../store/spellWizardStore';
import { DiceCalculator, StepNavigation } from '../common';
import '../styles/spell-wizard.css';
import { damageTypes } from '../../../data/damageTypes';
import { 
  calculateDiceAverage,
  calculateDiceMaximum,
  calculateDiceMinimum,
  formatDiceString,
  parseDiceString
} from '../../../utils/diceUtils';

// Scaling types (from original Step6RangeArea)
const SCALING_TYPES = [
  { id: 'level', name: 'Character Level', description: 'Spell power increases with character level' },
  { id: 'attribute', name: 'Ability Score', description: 'Spell power increases with a specific ability score' },
  { id: 'resource', name: 'Action Point Cost', description: 'Spell power increases with additional action point spending' },
  { id: 'charge', name: 'Charge Time', description: 'Spell power increases the longer it is charged' },
  { id: 'combo', name: 'Advantage', description: 'Spell power increases when cast with advantage or in special conditions' }
];

// Attribute options for scaling (from original Step6RangeArea)
const ATTRIBUTE_OPTIONS = [
  { id: 'strength', name: 'Strength' },
  { id: 'agility', name: 'Agility' },
  { id: 'intelligence', name: 'Intelligence' },
  { id: 'spirit', name: 'Spirit' },
  { id: 'charisma', name: 'Charisma' },
  { id: 'constitution', name: 'Constitution' }
];

const Step4DamageHealing = () => {
  const { spellData, updateSpellData, setStepValidation, nextStep, prevStep } = useSpellWizardStore();
  
  // Local state for damage settings
  const [selectedDamageTypes, setSelectedDamageTypes] = useState(spellData.damageTypes || []);
  const [damageDice, setDamageDice] = useState(spellData.primaryDamage?.dice || '');
  const [damageFlat, setDamageFlat] = useState(spellData.primaryDamage?.flat || 0);
  const [procChance, setProcChance] = useState(spellData.primaryDamage?.procChance || 100);
  const [isDot, setIsDot] = useState(spellData.isDot || false);
  const [dotDuration, setDotDuration] = useState(spellData.dotDuration || 0);
  const [dotTick, setDotTick] = useState(spellData.dotTick || '');
  
  // Local state for healing settings
  const [hasHealing, setHasHealing] = useState(!!spellData.healing?.dice || !!spellData.healing?.flat);
  const [healingDice, setHealingDice] = useState(spellData.healing?.dice || '');
  const [healingFlat, setHealingFlat] = useState(spellData.healing?.flat || 0);
  const [isHot, setIsHot] = useState(spellData.healing?.isHoT || false);
  const [hotDuration, setHotDuration] = useState(spellData.healing?.hotDuration || 0);
  const [hotTick, setHotTick] = useState(spellData.healing?.hotTick || '');
  
  // Local state for scaling options
  const [selectedScalingTypes, setSelectedScalingTypes] = useState(spellData.scalingFactors || []);
  const [scalingAttribute, setScalingAttribute] = useState(spellData.scalingAttribute || 'intelligence');
  const [scalingFormula, setScalingFormula] = useState(spellData.scalingFormula || '+1d4 per 2 levels');
  
  // Preview calculations
  const [damagePreview, setDamagePreview] = useState({ valid: false, average: 0 });
  const [healingPreview, setHealingPreview] = useState({ valid: false, average: 0 });
  const [damagePerRound, setDamagePerRound] = useState(0);
  
  // Local state for tracking validation
  const [isValid, setIsValid] = useState(false);
  
  // Calculate dice values
  const calculateValues = (diceString) => {
    const average = calculateDiceAverage(diceString);
    const minimum = calculateDiceMinimum(diceString);
    const maximum = calculateDiceMaximum(diceString);
    return { average, minimum, maximum };
  };

  // Format dice string
  const formatDice = (diceString) => {
    return formatDiceString(diceString);
  };

  // Parse dice string
  const parseDice = (diceString) => {
    return parseDiceString(diceString);
  };

  // Validate and calculate damage previews
  useEffect(() => {
    const parsedDamage = parseDice(damageDice);
    
    if (parsedDamage.valid || damageFlat > 0) {
      const avgDamage = calculateDiceAverage(parsedDamage) + Number(damageFlat);
      
      setDamagePreview({
        valid: true,
        average: Math.round(avgDamage * 10) / 10,
      });
    } else {
      setDamagePreview({
        valid: damageFlat > 0,
        average: Number(damageFlat),
      });
    }
  }, [damageDice, damageFlat]);
  
  // Validate and calculate healing previews
  useEffect(() => {
    const parsedHealing = parseDice(healingDice);
    
    if (parsedHealing.valid || healingFlat > 0) {
      const avgHealing = calculateDiceAverage(parsedHealing) + Number(healingFlat);
      
      setHealingPreview({
        valid: true,
        average: Math.round(avgHealing * 10) / 10,
      });
    } else {
      setHealingPreview({
        valid: healingFlat > 0,
        average: Number(healingFlat),
      });
    }
  }, [healingDice, healingFlat]);
  
  // Update validation status
  useEffect(() => {
    // If category is damage, need damage type and valid damage
    const validForDamage = spellData.category !== 'damage' || 
      (selectedDamageTypes.length > 0 && (damagePreview.valid || isDot));
    
    // If category is healing, need valid healing
    const validForHealing = spellData.category !== 'healing' || 
      (hasHealing && (healingPreview.valid || isHot));
    
    // If hybrid, need at least one valid effect
    const validForHybrid = spellData.category !== 'hybrid' || 
      (damagePreview.valid || healingPreview.valid || isDot || isHot);
    
    const valid = validForDamage && validForHealing && validForHybrid;
    
    setIsValid(valid);
    setStepValidation(3, valid);
    
    // Update spell data with current values
    updateSpellData({
      damageTypes: selectedDamageTypes,
      primaryDamage: {
        dice: damageDice,
        flat: Number(damageFlat),
        procChance: Number(procChance),
        procDice: procChance < 100 ? `d100:${101 - procChance}-100` : ''
      },
      isDot,
      dotDuration: Number(dotDuration),
      dotTick,
      healing: hasHealing ? {
        dice: healingDice,
        flat: Number(healingFlat),
        isHoT: isHot,
        hotDuration: Number(hotDuration),
        hotTick
      } : null,
      scalingFactors: selectedScalingTypes,
      scalingAttribute,
      scalingFormula
    });
  }, [
    spellData.category,
    selectedDamageTypes,
    damageDice,
    damageFlat,
    procChance,
    isDot,
    dotDuration,
    dotTick,
    hasHealing,
    healingDice,
    healingFlat,
    isHot,
    hotDuration,
    hotTick,
    damagePreview.valid,
    healingPreview.valid,
    selectedScalingTypes,
    scalingAttribute,
    scalingFormula,
    setStepValidation,
    updateSpellData
  ]);
  
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
  
  // Handle flat damage input
  const handleDamageFlatChange = (e) => {
    const value = e.target.value === '' ? 0 : Number(e.target.value);
    if (!isNaN(value)) {
      setDamageFlat(value);
    }
  };
  
  // Handle proc chance
  const handleProcChanceChange = (e) => {
    const value = e.target.value === '' ? 100 : Number(e.target.value);
    if (!isNaN(value) && value >= 0 && value <= 100) {
      setProcChance(value);
    }
  };
  
  // Toggle DOT
  const handleDotToggle = () => {
    setIsDot(prev => !prev);
  };
  
  // Handle DOT duration
  const handleDotDurationChange = (e) => {
    const value = e.target.value === '' ? 0 : Number(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setDotDuration(value);
    }
  };
  
  // Toggle healing
  const handleHealingToggle = () => {
    setHasHealing(prev => !prev);
  };
  
  // Handle flat healing input
  const handleHealingFlatChange = (e) => {
    const value = e.target.value === '' ? 0 : Number(e.target.value);
    if (!isNaN(value)) {
      setHealingFlat(value);
    }
  };
  
  // Toggle HOT
  const handleHotToggle = () => {
    setIsHot(prev => !prev);
  };
  
  // Handle HOT duration
  const handleHotDurationChange = (e) => {
    const value = e.target.value === '' ? 0 : Number(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setHotDuration(value);
    }
  };
  
  // Toggle scaling type selection
  const toggleScalingType = (typeId) => {
    setSelectedScalingTypes(prev => {
      if (prev.includes(typeId)) {
        return prev.filter(id => id !== typeId);
      } else {
        return [...prev, typeId];
      }
    });
  };
  
  // Handle scaling attribute selection
  const handleScalingAttributeChange = (e) => {
    setScalingAttribute(e.target.value);
  };
  
  // Handle scaling formula input
  const handleScalingFormulaChange = (e) => {
    setScalingFormula(e.target.value);
  };
  
  // Get all damage types
  const damageTypes = damageTypes.getAllDamageTypes();
  
  // Determine if damage or healing sections should be shown based on category
  const showDamageSection = spellData.category === 'damage' || 
    spellData.category === 'hybrid' || 
    spellData.category === 'debuff' ||
    !spellData.category; // If no category selected, show all sections
  
  const showHealingSection = spellData.category === 'healing' || 
    spellData.category === 'hybrid' || 
    spellData.category === 'buff' ||
    !spellData.category;
  
  return (
    <div className="damage-healing-step">
      {/* Damage Types Section */}
      {showDamageSection && (
        <div className="section">
          <h4 className="section-title">Damage Types</h4>
          <p className="section-description">
            Select one or more damage types for your spell. This affects resistances, immunities, and visual effects.
          </p>
          
          <div className="damage-types-grid">
            {damageTypes.map(type => (
              <div 
                key={type.id}
                className={`damage-type-option ${selectedDamageTypes.includes(type.id) ? 'selected' : ''}`}
                onClick={() => toggleDamageType(type.id)}
                style={{ 
                  '--type-color': type.color,
                  borderColor: selectedDamageTypes.includes(type.id) ? type.color : 'transparent'
                }}
              >
                <div className="damage-type-icon">
                  {type.icon && <img src={type.icon} alt={type.name} />}
                </div>
                <div className="damage-type-info">
                  <div className="damage-type-name" style={{ color: type.color }}>{type.name}</div>
                  <div className="damage-type-description">{type.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Damage Calculation Section */}
      {showDamageSection && (
        <div className="section">
          <h4 className="section-title">Damage Calculation</h4>
          <p className="section-description">
            Define how much damage your spell deals using dice notation and/or flat values.
          </p>
          
          <div className="damage-inputs">
            <div className="input-group">
              <label>Damage Dice:</label>
              <DiceCalculator 
                value={damageDice}
                onChange={setDamageDice}
                showPreview={true}
                showQuickSelect={true}
              />
            </div>
            
            <div className="input-group">
              <label>Additional Flat Damage:</label>
              <input 
                type="number"
                min="0"
                value={damageFlat} 
                onChange={handleDamageFlatChange}
                className="flat-damage-input"
              />
            </div>
            
            <div className="input-group">
              <label>Proc Chance:</label>
              <div className="proc-chance-input">
                <input 
                  type="number"
                  min="0"
                  max="100"
                  value={procChance} 
                  onChange={handleProcChanceChange}
                  className="proc-chance-value"
                />
                <span className="unit">%</span>
              </div>
              {procChance < 100 && (
                <div className="proc-explanation">
                  {formatDice(`d100:${101 - procChance}-100`)}
                </div>
              )}
            </div>
            
            <div className="damage-preview">
              <div className="preview-header">Damage Preview:</div>
              <div className="preview-values">
                <div className="preview-value">
                  <span className="preview-label">Average:</span>
                  <span className="preview-number">{damagePreview.average}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* DOT Options */}
          <div className="dot-options">
            <div className="checkbox-container">
              <input 
                type="checkbox" 
                checked={isDot} 
                onChange={handleDotToggle}
                id="dot-toggle"
              />
              <label htmlFor="dot-toggle">Damage Over Time (DOT)</label>
            </div>
            
            {isDot && (
              <div className="dot-details">
                <div className="input-group">
                  <label>Duration (rounds):</label>
                  <input 
                    type="number"
                    min="1"
                    value={dotDuration} 
                    onChange={handleDotDurationChange}
                    className="dot-duration-input"
                  />
                </div>
                
                <div className="input-group">
                  <label>Damage Per Tick:</label>
                  <DiceCalculator 
                    value={dotTick}
                    onChange={setDotTick}
                    showPreview={true}
                    showQuickSelect={true}
                  />
                </div>
                
                <div className="dot-example">
                  <p>Example: A DOT with duration 3 and damage 1d4 will deal 1d4 damage at the end of each of the target's turns for 3 rounds.</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Healing Section */}
      {showHealingSection && (
        <div className="section">
          <h4 className="section-title">Healing</h4>
          <p className="section-description">
            Define healing effects for your spell using dice notation and/or flat values.
          </p>
          
          <div className="healing-toggle">
            <div className="checkbox-container">
              <input 
                type="checkbox" 
                checked={hasHealing} 
                onChange={handleHealingToggle}
                id="healing-toggle"
              />
              <label htmlFor="healing-toggle">Include Healing Effect</label>
            </div>
          </div>
          
          {hasHealing && (
            <div className="healing-inputs">
              <div className="input-group">
                <label>Healing Dice:</label>
                <DiceCalculator 
                  value={healingDice}
                  onChange={setHealingDice}
                  showPreview={true}
                  showQuickSelect={true}
                />
              </div>
              
              <div className="input-group">
                <label>Additional Flat Healing:</label>
                <input 
                  type="number"
                  min="0"
                  value={healingFlat} 
                  onChange={handleHealingFlatChange}
                  className="flat-healing-input"
                />
              </div>
              
              <div className="healing-preview">
                <div className="preview-header">Healing Preview:</div>
                <div className="preview-values">
                  <div className="preview-value">
                    <span className="preview-label">Average:</span>
                    <span className="preview-number">{healingPreview.average}</span>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* HoT Options */}
          {hasHealing && (
            <div className="hot-options">
              <div className="checkbox-container">
                <input 
                  type="checkbox" 
                  checked={isHot} 
                  onChange={handleHotToggle}
                  id="hot-toggle"
                />
                <label htmlFor="hot-toggle">Healing Over Time (HOT)</label>
              </div>
              
              {isHot && (
                <div className="hot-details">
                  <div className="input-group">
                    <label>Duration (rounds):</label>
                    <input 
                      type="number"
                      min="1"
                      value={hotDuration} 
                      onChange={handleHotDurationChange}
                      className="hot-duration-input"
                    />
                  </div>
                  
                  <div className="input-group">
                    <label>Healing Per Tick:</label>
                    <DiceCalculator 
                      value={hotTick}
                      onChange={setHotTick}
                      showPreview={true}
                      showQuickSelect={true}
                    />
                  </div>
                  
                  <div className="hot-example">
                    <p>Example: A HOT with duration 3 and healing 1d4 will restore 1d4 health at the start of each of the target's turns for 3 rounds.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Scaling & Growth Section */}
      <div className="section">
        <h4 className="section-title">Scaling & Growth</h4>
        <p className="section-description">
          Define how your spell becomes more powerful based on various factors.
        </p>
        
        <div className="scaling-types">
          {SCALING_TYPES.map(type => (
            <div 
              key={type.id}
              className={`scaling-type-option ${selectedScalingTypes.includes(type.id) ? 'selected' : ''}`}
              onClick={() => toggleScalingType(type.id)}
            >
              <div className="scaling-type-name">{type.name}</div>
              <div className="scaling-type-description">{type.description}</div>
            </div>
          ))}
        </div>
        
        {/* Level Scaling Formula */}
        {selectedScalingTypes.includes('level') && (
          <div className="scaling-formula">
            <label>Level Scaling Formula:</label>
            <input
              type="text"
              value={scalingFormula}
              onChange={handleScalingFormulaChange}
              placeholder="e.g., +1d6 per 2 levels"
              className="formula-input"
            />
            <div className="formula-examples">
              <div className="example-title">Examples:</div>
              <div className="example">+1d6 per 2 levels</div>
              <div className="example">+5% damage per level</div>
              <div className="example">+1 target per 3 levels</div>
            </div>
          </div>
        )}
        
        {/* Attribute Scaling */}
        {selectedScalingTypes.includes('attribute') && (
          <div className="attribute-scaling">
            <label>Scaling Attribute:</label>
            <select
              value={scalingAttribute}
              onChange={handleScalingAttributeChange}
              className="attribute-select"
            >
              {ATTRIBUTE_OPTIONS.map(attr => (
                <option key={attr.id} value={attr.id}>{attr.name}</option>
              ))}
            </select>
            <div className="attribute-description">
              Spell power will scale with the character's {
                ATTRIBUTE_OPTIONS.find(attr => attr.id === scalingAttribute)?.name || 'selected attribute'
              }.
            </div>
          </div>
        )}
        
        {/* Resource Spending */}
        {selectedScalingTypes.includes('resource') && (
          <div className="resource-scaling">
            <div className="resource-description">
              Spell power will increase with additional resource spending.
              This will be configured in the resource costs step if you haven't already done so.
            </div>
          </div>
        )}
        
        {/* Charge Time */}
        {selectedScalingTypes.includes('charge') && (
          <div className="charge-scaling">
            <div className="charge-description">
              Spell power will increase the longer it is charged.
              {spellData.castTimeType === 'charged' 
                ? " You've already configured this in the resource cost step." 
                : " Consider setting cast time type to 'Charged' in the resource step."}
            </div>
          </div>
        )}
        
        {/* Combo Points */}
        {selectedScalingTypes.includes('combo') && (
          <div className="combo-scaling">
            <div className="combo-description">
              Spell power will increase with combo points or similar mechanics.
              This is especially useful for classes like Rogues or other point-accumulation systems.
            </div>
          </div>
        )}
      </div>
      
      {/* Validation message */}
      {!isValid && (
        <div className="validation-message">
          {spellData.category === 'damage' && selectedDamageTypes.length === 0 ? (
            <p>Please select at least one damage type.</p>
          ) : spellData.category === 'healing' && !hasHealing ? (
            <p>Please enable and configure healing effects.</p>
          ) : (
            <p>Please complete all required fields to proceed.</p>
          )}
        </div>
      )}
      
      <StepNavigation 
        currentStep={3} 
        totalSteps={8} 
        onNext={nextStep} 
        onPrev={prevStep} 
        isNextEnabled={isValid}
      />
    </div>
  );
};

export default Step4DamageHealing;