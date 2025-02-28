import React, { useState, useEffect } from 'react';

const Step2PrimaryFunction = ({ spellData, updateSpellData, setStepValidation }) => {
  // Local state for form inputs
  const [category, setCategory] = useState(spellData.category || '');
  const [subtype, setSubtype] = useState(spellData.subtype || '');
  const [targetingMode, setTargetingMode] = useState(spellData.targetingMode || 'single');
  const [aoeShape, setAoeShape] = useState(spellData.aoeShape || 'circle');
  const [aoeSize, setAoeSize] = useState(spellData.aoeSize || 10);
  const [rangeType, setRangeType] = useState(spellData.rangeType || 'ranged');
  const [rangeDistance, setRangeDistance] = useState(spellData.range || 30);
  const [damageTypes, setDamageTypes] = useState(spellData.damageTypes || []);
  
  // Tooltip state
  const [tooltip, setTooltip] = useState({ visible: false, content: '', position: { x: 0, y: 0 }, title: '' });
  
  // Local state for tracking validation
  const [isValid, setIsValid] = useState(false);
  
  // Sample data
  const SPELL_CATEGORIES = [
    { id: 'damage', name: 'Damage', description: 'Spells that primarily deal damage to targets.' },
    { id: 'healing', name: 'Healing', description: 'Spells that restore health to allies.' },
    { id: 'buff', name: 'Buff', description: 'Spells that enhance allies\' abilities or stats.' },
    { id: 'debuff', name: 'Debuff', description: 'Spells that weaken enemies\' abilities or stats.' },
    { id: 'utility', name: 'Utility', description: 'Spells with practical uses outside of direct combat.' }
  ];
  
  const DAMAGE_TYPES = [
    { id: 'fire', name: 'Fire', color: '#ff4500', icon: '🔥', description: 'Fire damage burns targets and can ignite flammable objects.' },
    { id: 'frost', name: 'Frost', color: '#00bfff', icon: '❄️', description: 'Frost damage can slow or freeze targets.' },
    { id: 'arcane', name: 'Arcane', color: '#9932cc', icon: '✨', description: 'Arcane damage is pure magical energy that bypasses many resistances.' },
    { id: 'nature', name: 'Nature', color: '#32cd32', icon: '🌿', description: 'Nature damage includes acid, poison, and life energy manipulation.' },
    { id: 'shadow', name: 'Shadow', color: '#800080', icon: '🌑', description: 'Shadow damage corrupts and drains life force from targets.' },
    { id: 'holy', name: 'Holy', color: '#ffd700', icon: '✨', description: 'Holy damage is especially effective against undead and fiends.' },
    { id: 'physical', name: 'Physical', color: '#c0c0c0', icon: '⚔️', description: 'Physical damage comes from direct force and impacts.' }
  ];
  
  const AOE_SHAPES = [
    { id: 'circle', name: 'Circle', description: 'Affects all targets within a radius around a point.' },
    { id: 'cone', name: 'Cone', description: 'Affects targets in a cone-shaped area extending from the caster.' },
    { id: 'line', name: 'Line', description: 'Affects targets in a straight line from the caster.' },
    { id: 'square', name: 'Square', description: 'Affects targets in a square area centered on a point.' }
  ];
  
  const RANGE_TYPES = [
    { id: 'self', name: 'Self', description: 'Affects only the caster.' },
    { id: 'touch', name: 'Touch', description: 'Caster must touch the target to apply the effect.' },
    { id: 'melee', name: 'Melee', description: 'Affects targets within melee range (5 feet).' },
    { id: 'ranged', name: 'Ranged', description: 'Can target creatures at a distance specified in feet.' }
  ];
  
  // Category-specific subtypes
  const SUBTYPES = {
    damage: [
      { id: 'direct', name: 'Direct Damage', description: 'Deals immediate damage upon impact.' },
      { id: 'dot', name: 'Damage Over Time', description: 'Deals damage gradually over several rounds.' },
      { id: 'aoe', name: 'Area Damage', description: 'Damages multiple targets in an area.' },
      { id: 'burst', name: 'Burst Damage', description: 'High damage with longer cooldown or resource cost.' }
    ],
    healing: [
      { id: 'direct', name: 'Direct Healing', description: 'Immediately restores health to the target.' },
      { id: 'hot', name: 'Healing Over Time', description: 'Gradually restores health over several rounds.' },
      { id: 'aoe', name: 'Area Healing', description: 'Heals multiple allies in an area.' },
      { id: 'reactive', name: 'Reactive Healing', description: 'Healing that triggers in response to damage.' }
    ],
    buff: [
      { id: 'stat', name: 'Stat Boost', description: 'Increases one or more stats of the target.' },
      { id: 'protection', name: 'Protection', description: 'Reduces or prevents damage taken.' },
      { id: 'mobility', name: 'Mobility', description: 'Enhances movement speed or options.' },
      { id: 'resource', name: 'Resource Generation', description: 'Grants resources or enhances regeneration.' }
    ],
    debuff: [
      { id: 'impair', name: 'Impairment', description: 'Reduces target\'s stats or effectiveness.' },
      { id: 'control', name: 'Control', description: 'Restricts target\'s movement or actions.' },
      { id: 'vulnerability', name: 'Vulnerability', description: 'Makes target take increased damage.' },
      { id: 'resource', name: 'Resource Drain', description: 'Depletes or prevents regeneration of resources.' }
    ],
    utility: [
      { id: 'movement', name: 'Movement', description: 'Provides special movement options.' },
      { id: 'detection', name: 'Detection', description: 'Reveals hidden objects, creatures, or information.' },
      { id: 'creation', name: 'Creation', description: 'Creates objects or effects that can be interacted with.' },
      { id: 'manipulation', name: 'Manipulation', description: 'Manipulates the environment or objects.' }
    ]
  };
  
  // Update validation status
  useEffect(() => {
    const valid = 
      category && 
      subtype &&
      (targetingMode === 'single' || (targetingMode === 'aoe' && aoeShape && aoeSize > 0)) &&
      rangeType &&
      (rangeType !== 'ranged' || (rangeType === 'ranged' && rangeDistance > 0)) &&
      (category !== 'damage' || (category === 'damage' && damageTypes.length > 0));
    
    setIsValid(valid);
    setStepValidation(valid);
  }, [
    category, subtype, targetingMode, aoeShape, aoeSize,
    rangeType, rangeDistance, damageTypes, setStepValidation
  ]);
  
  // Update spell data when form inputs change
  useEffect(() => {
    updateSpellData({
      category,
      subtype,
      targetingMode,
      aoeShape: targetingMode === 'aoe' ? aoeShape : '',
      aoeSize: targetingMode === 'aoe' ? aoeSize : 0,
      rangeType,
      range: rangeType === 'ranged' ? rangeDistance : 
             rangeType === 'melee' ? 5 : 0,
      damageTypes
    });
  }, [
    category, subtype, targetingMode, aoeShape, aoeSize,
    rangeType, rangeDistance, damageTypes, updateSpellData
  ]);
  
  // Show tooltip
  const showTooltip = (e, title, content) => {
    setTooltip({
      visible: true,
      title,
      content,
      position: {
        x: e.currentTarget.getBoundingClientRect().right + 10,
        y: e.clientY
      }
    });
  };
  
  // Hide tooltip
  const hideTooltip = () => {
    setTooltip(prev => ({ ...prev, visible: false }));
  };
  
  // Handle category selection
  const handleCategorySelect = (categoryId) => {
    setCategory(categoryId);
    setSubtype(''); // Reset subtype when category changes
    
    // Reset damage types if changing from damage category
    if (categoryId !== 'damage') {
      setDamageTypes([]);
    }
    
    // Set appropriate targeting mode for certain subtypes
    if (categoryId === 'buff' || categoryId === 'utility') {
      setTargetingMode('single');
    }
  };
  
  // Handle subtype selection
  const handleSubtypeSelect = (subtypeId) => {
    setSubtype(subtypeId);
    
    // Automatically set targeting mode for AoE subtypes
    if (subtypeId === 'aoe') {
      setTargetingMode('aoe');
    }
  };
  
  // Toggle damage type selection
  const toggleDamageType = (typeId) => {
    setDamageTypes(prev => {
      if (prev.includes(typeId)) {
        return prev.filter(id => id !== typeId);
      } else {
        return [...prev, typeId];
      }
    });
  };
  
  // Get available subtypes based on selected category
  const getAvailableSubtypes = () => {
    return SUBTYPES[category] || [];
  };
  
  return (
    <div className="primary-function-step">
      <div className="section">
        <h4 className="section-title">Primary Function</h4>
        <p className="section-description">
          Select the main purpose and role of your spell.
        </p>
        
        <div className="category-options">
          {SPELL_CATEGORIES.map((categoryItem) => (
            <div 
              key={categoryItem.id}
              className={`category-option ${category === categoryItem.id ? 'selected' : ''}`}
              onClick={() => handleCategorySelect(categoryItem.id)}
              onMouseEnter={(e) => showTooltip(e, categoryItem.name, categoryItem.description)}
              onMouseLeave={hideTooltip}
            >
              <div className="category-name">{categoryItem.name}</div>
              <div className="category-description">{categoryItem.description}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Subtypes - show if category is selected */}
      {category && (
        <div className="section">
          <h5 className="subsection-title">Specific Type</h5>
          <p className="section-description">
            Select the specific type of {category} spell to refine its function.
          </p>
          
          <div className="subtype-options">
            {getAvailableSubtypes().map((subtypeItem) => (
              <div 
                key={subtypeItem.id}
                className={`subtype-option ${subtype === subtypeItem.id ? 'selected' : ''}`}
                onClick={() => handleSubtypeSelect(subtypeItem.id)}
                onMouseEnter={(e) => showTooltip(e, subtypeItem.name, subtypeItem.description)}
                onMouseLeave={hideTooltip}
              >
                <div className="subtype-name">{subtypeItem.name}</div>
                <div className="subtype-description">{subtypeItem.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Damage Types - show if damage category is selected */}
      {category === 'damage' && (
        <div className="section">
          <h5 className="subsection-title">Damage Types</h5>
          <p className="section-description">
            Select one or more damage types for your spell.
          </p>
          
          <div className="damage-types-grid">
            {DAMAGE_TYPES.map((damageType) => (
              <div 
                key={damageType.id}
                className={`damage-type-option ${damageTypes.includes(damageType.id) ? 'selected' : ''}`}
                onClick={() => toggleDamageType(damageType.id)}
                onMouseEnter={(e) => showTooltip(e, damageType.name, damageType.description)}
                onMouseLeave={hideTooltip}
                style={{
                  '--type-color': damageType.color,
                  '--type-color-rgb': damageType.id === 'fire' ? '255, 69, 0' :
                                     damageType.id === 'frost' ? '0, 191, 255' :
                                     damageType.id === 'arcane' ? '153, 50, 204' :
                                     damageType.id === 'nature' ? '50, 205, 50' :
                                     damageType.id === 'shadow' ? '128, 0, 128' :
                                     damageType.id === 'holy' ? '255, 215, 0' :
                                     '192, 192, 192'
                }}
              >
                <div className="damage-type-icon">{damageType.icon}</div>
                <div className="damage-type-name" style={{ color: damageType.color }}>
                  {damageType.name}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Range & Targeting Section - show after subtype is selected */}
      {subtype && (
        <div className="section">
          <h5 className="subsection-title">Range & Targeting</h5>
          <p className="section-description">
            Define how your spell targets its recipients and its effective range.
          </p>
          
          <div className="form-row">
            <div className="form-group">
              <label 
                onMouseEnter={(e) => showTooltip(e, 'Targeting Mode', 'Determines whether your spell affects a single target or multiple targets in an area.')}
                onMouseLeave={hideTooltip}
              >
                Targeting Mode:
              </label>
              <div className="targeting-options">
                <label className="radio-option">
                  <input 
                    type="radio" 
                    checked={targetingMode === 'single'}
                    onChange={() => setTargetingMode('single')}
                  />
                  <span>Single Target</span>
                </label>
                <label className="radio-option">
                  <input 
                    type="radio" 
                    checked={targetingMode === 'aoe'}
                    onChange={() => setTargetingMode('aoe')}
                  />
                  <span>Area of Effect</span>
                </label>
              </div>
            </div>
            
            <div className="form-group">
              <label 
                onMouseEnter={(e) => showTooltip(e, 'Range Type', 'Defines how far away the spell can be cast.')}
                onMouseLeave={hideTooltip}
              >
                Range Type:
              </label>
              <select 
                value={rangeType}
                onChange={(e) => setRangeType(e.target.value)}
                className="range-type-select"
              >
                {RANGE_TYPES.map(type => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
            </div>
            
            {/* Range Distance - only show for ranged spells */}
            {rangeType === 'ranged' && (
              <div className="form-group">
                <label 
                  onMouseEnter={(e) => showTooltip(e, 'Range Distance', 'The maximum distance in feet at which this spell can be cast.')}
                  onMouseLeave={hideTooltip}
                >
                  Range (feet):
                </label>
                <input 
                  type="number"
                  min="1"
                  value={rangeDistance}
                  onChange={(e) => setRangeDistance(Math.max(1, parseInt(e.target.value) || 0))}
                  className="range-input"
                />
                <div className="range-examples">
                  <span className="example">Short: 15-30 ft</span>
                  <span className="example">Medium: 60-90 ft</span>
                  <span className="example">Long: 120+ ft</span>
                </div>
              </div>
            )}
          </div>
          
          {/* AOE Shape Selection - only if targeting mode is AOE */}
          {targetingMode === 'aoe' && (
            <div className="aoe-settings">
              <div className="form-row">
                <div className="form-group">
                  <label 
                    onMouseEnter={(e) => showTooltip(e, 'AoE Shape', 'The shape of the area affected by your spell.')}
                    onMouseLeave={hideTooltip}
                  >
                    Area Shape:
                  </label>
                  <select 
                    value={aoeShape}
                    onChange={(e) => setAoeShape(e.target.value)}
                    className="aoe-shape-select"
                  >
                    {AOE_SHAPES.map(shape => (
                      <option key={shape.id} value={shape.id}>{shape.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="form-group">
                  <label 
                    onMouseEnter={(e) => showTooltip(e, 'AoE Size', 'The size of the area affected by your spell, in feet.')}
                    onMouseLeave={hideTooltip}
                  >
                    Area Size (feet):
                  </label>
                  <input 
                    type="number"
                    min="1"
                    value={aoeSize}
                    onChange={(e) => setAoeSize(Math.max(1, parseInt(e.target.value) || 0))}
                    className="aoe-input"
                  />
                </div>
              </div>
              
              {/* AOE Preview */}
              <div className="aoe-preview">
                <div className="preview-label">Area Preview:</div>
                <div className="preview-container">
                  <div 
                    className={`preview-${aoeShape}`} 
                    style={{
                      width: aoeShape === 'circle' ? `${Math.min(150, aoeSize * 2)}px` : 
                             aoeShape === 'square' ? `${Math.min(150, aoeSize * 2)}px` :
                             aoeShape === 'line' ? `${Math.min(150, aoeSize * 2)}px` : '0',
                      height: aoeShape === 'circle' ? `${Math.min(150, aoeSize * 2)}px` : 
                              aoeShape === 'square' ? `${Math.min(150, aoeSize * 2)}px` :
                              aoeShape === 'line' ? '10px' : '0',
                      borderRadius: aoeShape === 'circle' ? '50%' : aoeShape === 'square' ? '0' : '0'
                    }}
                  ></div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
      
      {/* Validation message */}
      {!isValid && category && (
        <div className="validation-message">
          {!subtype ? (
            <p>Please select a specific type for your {category} spell.</p>
          ) : category === 'damage' && damageTypes.length === 0 ? (
            <p>Please select at least one damage type.</p>
          ) : targetingMode === 'aoe' && (!aoeShape || aoeSize <= 0) ? (
            <p>Please select a shape and size for your area of effect.</p>
          ) : rangeType === 'ranged' && (!rangeDistance || rangeDistance <= 0) ? (
            <p>Please specify a valid range for your spell.</p>
          ) : (
            <p>Please complete all required fields to proceed.</p>
          )}
        </div>
      )}
      
      {/* Tooltip */}
      <div 
        className={`spell-tooltip ${tooltip.visible ? 'visible' : ''}`}
        style={{
          top: tooltip.position.y,
          left: tooltip.position.x
        }}
      >
        {tooltip.title && <div className="tooltip-title">{tooltip.title}</div>}
        {tooltip.content && <div className="tooltip-content">{tooltip.content}</div>}
      </div>
    </div>
  );
};

export default Step2PrimaryFunction;