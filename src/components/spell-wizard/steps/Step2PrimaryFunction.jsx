import React, { useState, useEffect } from 'react';
import useSpellWizardStore from '../../../store/spellWizardStore';
import '../styles/spell-wizard.css';

// Spell categories with descriptions (from original Step2CategoryRole)
const SPELL_CATEGORIES = [
  { 
    id: 'damage', 
    name: 'Damage', 
    description: 'Spells that primarily deal damage to targets.',
    subtypes: [
      { id: 'direct', name: 'Direct Damage', description: 'Immediate damage to the target' },
      { id: 'burst', name: 'Burst Damage', description: 'High damage with longer cooldown' },
      { id: 'aoe', name: 'Area of Effect Damage', description: 'Damage to multiple targets in an area' },
      { id: 'dot', name: 'Damage Over Time', description: 'Damage that occurs periodically over a duration' }
    ]
  },
  { 
    id: 'healing', 
    name: 'Healing', 
    description: 'Spells that restore health to allies.',
    subtypes: [
      { id: 'direct', name: 'Direct Healing', description: 'Immediate healing to the target' },
      { id: 'aoe', name: 'Area Healing', description: 'Healing to multiple allies in an area' },
      { id: 'hot', name: 'Healing Over Time', description: 'Healing that occurs periodically over a duration' },
      { id: 'reactive', name: 'Reactive Healing', description: 'Healing that triggers in response to damage or conditions' }
    ]
  },
  // Other spell categories...
];

// Targeting modes (from original Step2CategoryRole)
const TARGETING_MODES = [
  { id: 'single', name: 'Single Target', description: 'Affects one target at a time' },
  { id: 'aoe', name: 'Area of Effect', description: 'Affects multiple targets in an area' }
];

// AOE shapes (from original Step2CategoryRole and Step6RangeArea)
const AOE_SHAPES = [
  { id: 'circle', name: 'Circle', description: 'Affects all targets within a circular radius', icon: '⭕' },
  { id: 'cone', name: 'Cone', description: 'Affects targets in a cone-shaped area', icon: '📐' },
  { id: 'line', name: 'Line', description: 'Affects targets in a straight line', icon: '📏' },
  { id: 'custom', name: 'Custom Zone', description: 'Define a custom shape or pattern', icon: '✨' }
];

// Range types with descriptions (from original Step6RangeArea)
const RANGE_TYPES = [
  { id: 'melee', name: 'Melee', description: 'Target must be within melee range (5 ft)', icon: '⚔️' },
  { id: 'ranged', name: 'Ranged', description: 'Target can be at a specified distance', icon: '🏹' },
  { id: 'touch', name: 'Touch', description: 'Caster must touch the target', icon: '👋' },
  { id: 'self', name: 'Self', description: 'Spell affects only the caster', icon: '🧙' },
  { id: 'global', name: 'Global', description: 'Spell affects the entire area with no range limit', icon: '🌎' }
];

const Step2PrimaryFunction = () => {
  const { spellData, updateSpellData, setStepValidation } = useSpellWizardStore();
  
  // Local state
  const [selectedCategory, setSelectedCategory] = useState(spellData.category || '');
  const [selectedSubtype, setSelectedSubtype] = useState(spellData.subtype || '');
  const [targetingMode, setTargetingMode] = useState(spellData.targetingMode || 'single');
  const [aoeShape, setAoeShape] = useState(spellData.aoeShape || 'circle');
  const [aoeSize, setAoeSize] = useState(spellData.aoeSize || 10);
  const [rangeType, setRangeType] = useState(spellData.rangeType || 'ranged');
  const [rangeDistance, setRangeDistance] = useState(spellData.range || 30);
  const [durationRounds, setDurationRounds] = useState(spellData.durationRounds || 0);
  const [durationRealTime, setDurationRealTime] = useState(spellData.durationRealTime || 0);
  const [durationUnit, setDurationUnit] = useState(spellData.durationUnit || 'seconds');
  
  // Validation
  const [isValid, setIsValid] = useState(false);
  
  // Update validation status
  useEffect(() => {
    // Check if all required fields are filled
    const valid = 
      selectedCategory &&
      selectedSubtype &&
      targetingMode &&
      (targetingMode !== 'aoe' || (aoeShape && aoeSize > 0)) &&
      rangeType &&
      (rangeType !== 'ranged' || rangeDistance > 0);
    
    setIsValid(valid);
    setStepValidation(1, valid);
    
    // Update spell data
    updateSpellData({
      category: selectedCategory,
      subtype: selectedSubtype,
      targetingMode,
      aoeShape: targetingMode === 'aoe' ? aoeShape : '',
      aoeSize: targetingMode === 'aoe' ? aoeSize : 0,
      rangeType,
      range: rangeDistance,
      durationRounds,
      durationRealTime,
      durationUnit,
      
      // Set these flags based on subtype
      isDot: selectedCategory === 'damage' && selectedSubtype === 'dot',
      healing: {
        ...spellData.healing,
        isHoT: selectedCategory === 'healing' && selectedSubtype === 'hot'
      }
    });
  }, [
    selectedCategory, selectedSubtype, targetingMode, 
    aoeShape, aoeSize, rangeType, rangeDistance,
    durationRounds, durationRealTime, durationUnit,
    spellData.healing, updateSpellData, setStepValidation
  ]);
  
  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId);
    setSelectedSubtype(''); // Reset subtype when category changes
  };
  
  // Handle subtype selection
  const handleSubtypeSelect = (subtypeId) => {
    setSelectedSubtype(subtypeId);
    
    // Automatically set targeting mode for AoE subtypes
    if (subtypeId === 'aoe') {
      setTargetingMode('aoe');
    }
  };
  
  // Handle targeting mode selection
  const handleTargetingModeSelect = (modeId) => {
    setTargetingMode(modeId);
  };
  
  // Handle AOE shape selection
  const handleAOEShapeSelect = (shapeId) => {
    setAoeShape(shapeId);
  };
  
  // Handle AOE size change
  const handleAoeSizeChange = (e) => {
    const value = e.target.value === '' ? 0 : Number(e.target.value);
    if (!isNaN(value) && value > 0) {
      setAoeSize(value);
    }
  };
  
  // Handle range type selection
  const handleRangeTypeSelect = (type) => {
    setRangeType(type);
    
    // Set default ranges based on type
    if (type === 'melee') {
      setRangeDistance(5);
    } else if (type === 'touch' || type === 'self') {
      setRangeDistance(0);
    } else if (type === 'global') {
      setRangeDistance(0);
    } else if (rangeDistance === 0) {
      setRangeDistance(30); // Default ranged distance
    }
  };
  
  // Handle range distance input
  const handleRangeDistanceChange = (e) => {
    const value = e.target.value === '' ? 0 : Number(e.target.value);
    if (!isNaN(value) && value >= 0) {
      setRangeDistance(value);
    }
  };
  
  // Handle duration changes
  const handleDurationRoundsChange = (e) => {
    const value = parseInt(e.target.value);
    setDurationRounds(isNaN(value) ? 0 : value);
  };
  
  // Handle real-time duration changes
  const handleRealTimeChange = (e) => {
    const value = parseInt(e.target.value);
    setDurationRealTime(isNaN(value) ? 0 : value);
  };
  
  // Handle duration unit changes
  const handleDurationUnitChange = (e) => {
    setDurationUnit(e.target.value);
  };
  
  return (
    <div className="primary-function-step">
      {/* Primary Function Section */}
      <div className="section">
        <h4 className="section-title">Primary Function</h4>
        <p className="section-description">
          Select the main purpose and role of your spell.
        </p>
        
        <div className="category-options">
          {SPELL_CATEGORIES.map((category) => (
            <div 
              key={category.id}
              className={`category-option ${selectedCategory === category.id ? 'selected' : ''}`}
              onClick={() => handleCategorySelect(category.id)}
            >
              <div className="category-name">{category.name}</div>
              <div className="category-description">{category.description}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Specific Type Section - show after category is selected */}
      {selectedCategory && (
        <div className="section">
          <h4 className="section-title">Specific Type</h4>
          <p className="section-description">
            Select the specific type of {SPELL_CATEGORIES.find(c => c.id === selectedCategory)?.name.toLowerCase()} spell.
          </p>
          
          <div className="subtype-options">
            {SPELL_CATEGORIES.find(c => c.id === selectedCategory)?.subtypes.map((subtype) => (
              <div 
                key={subtype.id}
                className={`subtype-option ${selectedSubtype === subtype.id ? 'selected' : ''}`}
                onClick={() => handleSubtypeSelect(subtype.id)}
              >
                <div className="subtype-name">{subtype.name}</div>
                <div className="subtype-description">{subtype.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Range & Targeting Section - show after subtype is selected */}
      {selectedSubtype && (
        <div className="section">
          <h4 className="section-title">Range & Targeting</h4>
          <p className="section-description">
            Define how your spell targets its recipients and its effective range.
          </p>
          
          {/* Range Type Selection */}
          <div className="range-types">
            <h5>Range Type</h5>
            <div className="range-type-options">
              {RANGE_TYPES.map(type => (
                <div 
                  key={type.id}
                  className={`range-type-option ${rangeType === type.id ? 'selected' : ''}`}
                  onClick={() => handleRangeTypeSelect(type.id)}
                >
                  <div className="range-type-icon">{type.icon}</div>
                  <div className="range-type-info">
                    <div className="range-type-name">{type.name}</div>
                    <div className="range-type-description">{type.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Range Distance - only for ranged spells */}
          {rangeType === 'ranged' && (
            <div className="range-distance">
              <label>Range Distance (feet):</label>
              <input
                type="number"
                min="0"
                value={rangeDistance}
                onChange={handleRangeDistanceChange}
                className="range-input"
              />
              <div className="range-examples">
                <span className="example">Short: 15-30 ft</span>
                <span className="example">Medium: 60-90 ft</span>
                <span className="example">Long: 120+ ft</span>
              </div>
            </div>
          )}
          
          {/* Targeting Mode Selection - not for self spells */}
          {rangeType !== 'self' && (
            <div className="targeting-section">
              <h5>Targeting Mode</h5>
              <div className="targeting-options">
                {TARGETING_MODES.map((mode) => (
                  <div 
                    key={mode.id}
                    className={`targeting-option ${targetingMode === mode.id ? 'selected' : ''}`}
                    onClick={() => handleTargetingModeSelect(mode.id)}
                  >
                    <div className="targeting-name">{mode.name}</div>
                    <div className="targeting-description">{mode.description}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* AOE Options - only if targeting mode is AOE */}
          {targetingMode === 'aoe' && (
            <div className="aoe-options">
              <h5>Area of Effect Shape</h5>
              <div className="aoe-shapes">
                {AOE_SHAPES.map(shape => (
                  <div 
                    key={shape.id}
                    className={`aoe-shape-option ${aoeShape === shape.id ? 'selected' : ''}`}
                    onClick={() => handleAOEShapeSelect(shape.id)}
                  >
                    <div className="aoe-shape-icon">{shape.icon}</div>
                    <div className="aoe-shape-info">
                      <div className="aoe-shape-name">{shape.name}</div>
                      <div className="aoe-shape-description">{shape.description}</div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="aoe-size">
                <label>Area Size (feet):</label>
                <input
                  type="number"
                  min="1"
                  value={aoeSize}
                  onChange={handleAoeSizeChange}
                  className="aoe-input"
                />
                <div className="aoe-size-description">
                  {aoeShape === 'circle' && (
                    <span>Radius of the circular area</span>
                  )}
                  {aoeShape === 'cone' && (
                    <span>Length of the cone from caster</span>
                  )}
                  {aoeShape === 'line' && (
                    <span>Length of the line</span>
                  )}
                  {aoeShape === 'custom' && (
                    <span>Approximate diameter of the affected area</span>
                  )}
                </div>
              </div>
              
              {/* AOE visual preview */}
              <div className="aoe-preview">
                <div className="preview-label">Visual Preview:</div>
                <div className="preview-container">
                  <div className={`preview-${aoeShape}`} style={
                    aoeShape === 'circle' ? { width: `${Math.min(100, aoeSize * 2)}px`, height: `${Math.min(100, aoeSize * 2)}px` } :
                    aoeShape === 'cone' ? { width: `${Math.min(100, aoeSize)}px`, height: `${Math.min(100, aoeSize)}px` } :
                    aoeShape === 'line' ? { width: `${Math.min(150, aoeSize * 2)}px`, height: '10px' } :
                    { width: '80px', height: '80px' }
                  }>
                    <div className="caster-point"></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Duration Section - show after targeting is set */}
      {rangeType && (
        <div className="section">
          <h4 className="section-title">Duration</h4>
          <p className="section-description">
            Define how long the spell's effects last, both in combat rounds and real-time.
          </p>
          
          <div className="duration-inputs">
            <div className="duration-input-group">
              <label>Combat Rounds:</label>
              <input 
                type="number" 
                value={durationRounds} 
                onChange={handleDurationRoundsChange}
                min="0"
                className="duration-input"
              />
              <span className="duration-hint">
                (0 = Instantaneous)
              </span>
            </div>
            
            <div className="duration-input-group">
              <label>Real Time:</label>
              <div className="real-time-input">
                <input 
                  type="number" 
                  value={durationRealTime} 
                  onChange={handleRealTimeChange}
                  min="0"
                  className="duration-input"
                />
                <select 
                  value={durationUnit} 
                  onChange={handleDurationUnitChange}
                  className="duration-unit"
                >
                  <option value="seconds">Seconds</option>
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                </select>
              </div>
              <span className="duration-hint">
                (0 = Instantaneous)
              </span>
            </div>
          </div>
        </div>
      )}
      
      {/* Validation message */}
      {!isValid && (
        <div className="validation-message">
          {!selectedCategory ? (
            <p>Please select a spell category.</p>
          ) : !selectedSubtype ? (
            <p>Please select a specific spell type.</p>
          ) : !rangeType ? (
            <p>Please select a range type.</p>
          ) : rangeType === 'ranged' && (!rangeDistance || rangeDistance <= 0) ? (
            <p>Please specify a valid range for your spell.</p>
          ) : targetingMode === 'aoe' && (!aoeShape || aoeSize <= 0) ? (
            <p>Please configure the area of effect properties.</p>
          ) : (
            <p>Please complete all required fields to proceed.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Step2PrimaryFunction;