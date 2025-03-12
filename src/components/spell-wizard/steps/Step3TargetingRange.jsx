import React, { useState, useEffect, useRef } from 'react';
import useSpellWizardStore from '../../../store/spellWizardStore';
import { SpellPreview } from '../common';
import '../styles/Pages/wizard-steps.css';
import '../styles/Layout/wizard-layout.css';
import '../styles/Components/preview-card.css';
import '../styles/Pages/targeting-range.css';

// Targeting modes with comprehensive descriptions
const TARGETING_MODES = [
  { 
    id: 'single', 
    name: 'Single Target', 
    description: 'Affects only one target at a time',
    longDescription: 'Single target spells focus their effect on one specific creature or object.',
    icon: 'spell_arcane_blast',
    examples: ['Magic Missile', 'Firebolt', 'Healing Word']
  },
  { 
    id: 'multiple', 
    name: 'Multiple Targets', 
    description: 'Affects a specific number of targets',
    longDescription: 'Select a limited number of targets within range to be affected by the spell.',
    icon: 'spell_nature_lightningoverload',
    examples: ['Eldritch Blast', 'Healing Spirit', 'Magic Stone']
  },
  { 
    id: 'aoe', 
    name: 'Area of Effect', 
    description: 'Affects all targets in an area',
    longDescription: 'Area spells affect everything within a defined shape and size.',
    icon: 'spell_progenitor_areadenial',
    examples: ['Fireball', 'Sleep', 'Entangle']
  },
  { 
    id: 'self', 
    name: 'Self', 
    description: 'Affects only the caster',
    longDescription: 'Self spells only affect the caster and cannot target others.',
    icon: 'spell_holy_innerfire',
    examples: ['Shield', 'Blur', 'Mirror Image']
  }
];

// Range types with detailed descriptions
const RANGE_TYPES = [
  { 
    id: 'self', 
    name: 'Self', 
    description: 'Affects only the caster', 
    icon: 'spell_holy_innerfire',
    examples: ['Absorb Elements', 'Blade Ward', 'Barkskin']
  },
  { 
    id: 'touch', 
    name: 'Touch', 
    description: 'Caster must touch the target to apply the effect', 
    icon: 'spell_holy_layonhands',
    examples: ['Cure Wounds', 'Inflict Wounds', 'Shocking Grasp']
  },
  { 
    id: 'melee', 
    name: 'Melee Range', 
    description: 'Affects targets within melee range (5 feet)', 
    icon: 'inv_sword_04',
    examples: ['Booming Blade', 'Green-Flame Blade', 'Primal Savagery']
  },
  { 
    id: 'ranged', 
    name: 'Ranged', 
    description: 'Can target creatures at a specified distance', 
    icon: 'ability_hunter_aimedshot',
    examples: ['Fire Bolt', 'Eldritch Blast', 'Magic Missile']
  },
  { 
    id: 'sight', 
    name: 'Line of Sight', 
    description: 'Can target any creature the caster can see', 
    icon: 'spell_holy_mindsooth',
    examples: ['Scrying', 'Clairvoyance', 'Message']
  },
  { 
    id: 'unlimited', 
    name: 'Unlimited', 
    description: 'No range restriction (typically for self-buffs or global effects)', 
    icon: 'spell_arcane_portaldalaran',
    examples: ['Astral Projection', 'Dream', 'Teleport']
  }
];

// Target types for who/what can be targeted
const TARGET_TYPES = [
  { id: 'enemy', name: 'Enemies', icon: 'ability_warrior_battleshout', description: 'Hostile creatures', color: '#FF5C5C' },
  { id: 'ally', name: 'Allies', icon: 'spell_holy_prayerofspirit', description: 'Friendly creatures', color: '#56DE5A' },
  { id: 'neutral', name: 'Neutral', icon: 'spell_holy_silence', description: 'Neutral or non-combatant creatures', color: '#DEDB56' },
  { id: 'self', name: 'Self Only', icon: 'spell_holy_innerfire', description: 'Only affects the caster', color: '#56B1DE' },
  { id: 'object', name: 'Objects', icon: 'inv_misc_key_11', description: 'Inanimate objects', color: '#A98764' },
  { id: 'location', name: 'Locations', icon: 'spell_arcane_portaldalaran', description: 'Points in space', color: '#D156DE' }
];

// AOE shapes with visual examples
const AOE_SHAPES = [
  { id: 'circle', name: 'Circle', description: 'A circular area centered on a point', icon: 'spell_holy_circleofrenewal' },
  { id: 'cone', name: 'Cone', description: 'A cone extending from the caster', icon: 'spell_fire_flamebolt' },
  { id: 'line', name: 'Line', description: 'A straight line from the caster', icon: 'spell_nature_lightning' },
  { id: 'square', name: 'Square', description: 'A square area centered on a point', icon: 'spell_frost_glacier' },

];

// Attack resolution methods
const ATTACK_RESOLUTIONS = [
  { 
    id: 'none', 
    name: 'Automatic Effect', 
    description: 'Spell automatically affects targets with no attack roll or save',
    longDescription: 'The spell takes effect automatically with no chance for targets to resist or avoid it.',
    icon: 'spell_shadow_possession'
  },
  { 
    id: 'attackRoll', 
    name: 'Attack Roll', 
    description: 'Requires an attack roll against target\'s AC',
    longDescription: 'Roll a d20 and add your spell attack modifier. If the result equals or exceeds the target\'s AC, the spell hits.',
    icon: 'ability_marksmanship'
  },
  { 
    id: 'savingThrow', 
    name: 'Saving Throw', 
    description: 'Target makes a saving throw to resist',
    longDescription: 'The target must make a saving throw to resist some or all of the spell\'s effects.',
    icon: 'spell_holy_sealofprotection'
  }
];

// Saving throw attributes
const SAVE_ATTRIBUTES = [
  { id: 'str', name: 'Strength', description: 'Physical power', icon: 'ability_warrior_strengthofarms' },
  { id: 'dex', name: 'Dexterity', description: 'Agility and reflexes', icon: 'ability_rogue_quickrecovery' },
  { id: 'con', name: 'Constitution', description: 'Endurance and stamina', icon: 'spell_holy_devotion' },
  { id: 'int', name: 'Intelligence', description: 'Reasoning and memory', icon: 'spell_holy_magicalsentry' },
  { id: 'wis', name: 'Wisdom', description: 'Perception and insight', icon: 'spell_holy_divinespirit' },
  { id: 'cha', name: 'Charisma', description: 'Force of personality', icon: 'spell_holy_powerwordshield' }
];

// Save results
const SAVE_RESULTS = [
  { id: 'negates', name: 'Negates Effect', description: 'Successful save completely negates the spell\'s effect' },
  { id: 'half', name: 'Half Damage', description: 'Successful save reduces damage by half' },
  { id: 'partial', name: 'Partial Effect', description: 'Successful save reduces but doesn\'t eliminate the effect' }
];

// Additional targeting properties
const TARGETING_PROPERTIES = [
  { id: 'requiresLOS', name: 'Requires Line of Sight', description: 'Caster must be able to see the target', defaultValue: true },
  { id: 'ignoresCover', name: 'Ignores Cover', description: 'Spell effects ignore physical cover', defaultValue: false },
  { id: 'affectsObjects', name: 'Affects Objects', description: 'Can target or affect inanimate objects', defaultValue: false },
  { id: 'affectsCreatures', name: 'Affects Creatures', description: 'Can target or affect living beings', defaultValue: true },
  { id: 'requiresEmptySpace', name: 'Requires Empty Space', description: 'Target location must be empty', defaultValue: false },
  { id: 'canTargetSelf', name: 'Can Target Self', description: 'Caster can target themselves', defaultValue: true },
  { id: 'hasTravelTime', name: 'Has Travel Time', description: 'Effect takes time to travel from caster to target', defaultValue: false }
];

const Step3TargetingRange = () => {
  const { spellData, updateSpellData, setStepValidation } = useSpellWizardStore();
  const previewRef = useRef(null);
  
  // Local state for form inputs
  const [targetingMode, setTargetingMode] = useState(spellData.targetingMode || 'single');
  const [targetCount, setTargetCount] = useState(spellData.targetCount || 1);
  const [targetTypes, setTargetTypes] = useState(spellData.targetTypes || ['enemy']);
  const [rangeType, setRangeType] = useState(spellData.rangeType || 'ranged');
  const [rangeDistance, setRangeDistance] = useState(spellData.range || 30);
  const [aoeShape, setAoeShape] = useState(spellData.aoeShape || 'circle');
  const [aoeSize, setAoeSize] = useState(spellData.aoeSize || 10);
  const [attackResolution, setAttackResolution] = useState(spellData.attackResolution || 'none');
  const [saveAttribute, setSaveAttribute] = useState(spellData.saveAttribute || 'dex');
  const [saveResult, setSaveResult] = useState(spellData.saveResult || 'half');
  const [saveDC, setSaveDC] = useState(spellData.saveDC || 'standard');
  const [dcValue, setDcValue] = useState(spellData.dcValue || 0);
  const [targetingProperties, setTargetingProperties] = useState(
    spellData.targetingProperties || 
    TARGETING_PROPERTIES.reduce((acc, prop) => ({...acc, [prop.id]: prop.defaultValue}), {})
  );
  const [requiresAttackRoll, setRequiresAttackRoll] = useState(spellData.requiresAttackRoll || false);
  
  // States for visualization
  const [previewWidth, setPreviewWidth] = useState(0);
  const [previewHeight, setPreviewHeight] = useState(0);
  
  // Local state for tracking validation
  const [isValid, setIsValid] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');
  
  // Update preview dimensions on component mount
  useEffect(() => {
    if (previewRef.current) {
      setPreviewWidth(previewRef.current.offsetWidth);
      setPreviewHeight(previewRef.current.offsetHeight);
    }
    
    // Add resize listener
    const handleResize = () => {
      if (previewRef.current) {
        setPreviewWidth(previewRef.current.offsetWidth);
        setPreviewHeight(previewRef.current.offsetHeight);
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Validate and update spell data
  useEffect(() => {
    // Validation logic
    let valid = true;
    let message = '';
    
    if (!targetingMode) {
      valid = false;
      message = 'Please select a targeting mode';
    } else if (targetingMode === 'multiple' && (!targetCount || targetCount < 1)) {
      valid = false;
      message = 'Please specify a valid number of targets';
    } else if (targetingMode !== 'self' && targetTypes.length === 0) {
      valid = false;
      message = 'Please select at least one target type';
    } else if (targetingMode === 'aoe' && (!aoeShape || aoeSize <= 0)) {
      valid = false;
      message = 'Please specify the shape and size of your area effect';
    } else if (targetingMode !== 'self' && rangeType === 'ranged' && (!rangeDistance || rangeDistance <= 0)) {
      valid = false;
      message = 'Please specify a valid range for your spell';
    } else if (attackResolution === 'savingThrow' && !saveAttribute) {
      valid = false;
      message = 'Please select a saving throw attribute';
    } else if (attackResolution === 'savingThrow' && !saveResult) {
      valid = false;
      message = 'Please select what happens on a successful save';
    }
    
    setIsValid(valid);
    setValidationMessage(message);
    setStepValidation(1, valid);
    
    // Update spell data with current values
    updateSpellData({
      targetingMode,
      targetCount: targetingMode === 'multiple' ? targetCount : 1,
      targetTypes: targetingMode === 'self' ? ['self'] : targetTypes,
      rangeType: targetingMode === 'self' ? 'self' : rangeType,
      range: rangeType === 'ranged' ? rangeDistance : 
             rangeType === 'melee' ? 5 : 0,
      aoeShape: targetingMode === 'aoe' ? aoeShape : '',
      aoeSize: targetingMode === 'aoe' ? aoeSize : 0,
      attackResolution,
      saveAttribute: attackResolution === 'savingThrow' ? saveAttribute : '',
      saveResult: attackResolution === 'savingThrow' ? saveResult : '',
      saveDC,
      dcValue,
      requiresAttackRoll: attackResolution === 'attackRoll',
      targetingProperties
    });
  }, [
    targetingMode, targetCount, targetTypes, rangeType, rangeDistance,
    aoeShape, aoeSize, attackResolution, saveAttribute, saveResult,
    saveDC, dcValue, targetingProperties, requiresAttackRoll,
    setStepValidation, updateSpellData
  ]);
  
  // Handle targeting property toggle
  const toggleTargetingProperty = (propertyId) => {
    setTargetingProperties(prev => ({
      ...prev,
      [propertyId]: !prev[propertyId]
    }));
  };
  
  // Toggle target type selection
  const toggleTargetType = (typeId) => {
    setTargetTypes(prev => {
      if (prev.includes(typeId)) {
        return prev.filter(id => id !== typeId);
      } else {
        return [...prev, typeId];
      }
    });
  };
  
  // Handle targeting mode change
  const handleTargetingModeChange = (mode) => {
    setTargetingMode(mode);
    
    // Update related fields based on targeting mode
    if (mode === 'self') {
      setRangeType('self');
      setTargetTypes(['self']);
    } else if (mode === 'aoe' && !aoeShape) {
      setAoeShape('circle');
    }
  };
  
  // Handle range type change
  const handleRangeTypeChange = (type) => {
    setRangeType(type);
    
    // Update targetingMode if needed
    if (type === 'self' && targetingMode !== 'self') {
      setTargetingMode('self');
      setTargetTypes(['self']);
    }
  };
  
  // Handle attack resolution change
  const handleAttackResolutionChange = (resolution) => {
    setAttackResolution(resolution);
    
    if (resolution === 'attackRoll') {
      setRequiresAttackRoll(true);
    } else {
      setRequiresAttackRoll(false);
    }
  };
  
  // Render targeting mode options
  const renderTargetingModes = () => {
    return (
      <div className="section">
        <h5 className="section-title">
          <img src={`https://wow.zamimg.com/images/wow/icons/medium/ability_hunter_snipershot.jpg`} alt="" className="section-icon" />
          Targeting Mode
        </h5>
        <p className="section-description">
          Select how your spell targets recipients. This determines who or what can be affected by the spell.
        </p>
        
        <div className="targeting-options">
          {TARGETING_MODES.map((mode) => (
            <label key={mode.id} className={`targeting-option ${targetingMode === mode.id ? 'selected' : ''}`}>
              <input 
                type="radio" 
                name="targetingMode"
                checked={targetingMode === mode.id}
                onChange={() => handleTargetingModeChange(mode.id)}
              />
              <div className="option-icon">
                <img src={`https://wow.zamimg.com/images/wow/icons/medium/${mode.icon}.jpg`} alt={mode.name} />
              </div>
              <div className="option-info">
                <span className="option-name">{mode.name}</span>
                <span className="option-description">{mode.description}</span>
                {targetingMode === mode.id && (
                  <span className="option-longdescription">{mode.longDescription}</span>
                )}
                {targetingMode === mode.id && (
                  <div className="option-examples">
                    Examples: <span className="examples-text">{mode.examples.join(', ')}</span>
                  </div>
                )}
              </div>
            </label>
          ))}
        </div>
        
        {/* Show multiple targets input if multiple targeting is selected */}
        {targetingMode === 'multiple' && (
          <div className="multiple-targets-input">
            <label htmlFor="targetCount">Number of targets:</label>
            <div className="number-input-wrapper">
              <button 
                className="decrease-btn"
                onClick={() => setTargetCount(Math.max(1, targetCount - 1))}
                disabled={targetCount <= 1}
              >−</button>
              <input 
                type="number" 
                id="targetCount"
                value={targetCount}
                onChange={(e) => setTargetCount(Math.max(1, parseInt(e.target.value) || 1))}
                min="1"
              />
              <button 
                className="increase-btn"
                onClick={() => setTargetCount(targetCount + 1)}
              >+</button>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Render target type selection
  const renderTargetTypes = () => {
    // Don't render for self-targeting spells
    if (targetingMode === 'self') return null;
    
    return (
      <div className="section">
        <h5 className="section-title">
          <img src={`https://wow.zamimg.com/images/wow/icons/medium/spell_holy_sealofsacrifice.jpg`} alt="" className="section-icon" />
          Target Types
        </h5>
        <p className="section-description">
          Select which types of targets your spell can affect.
        </p>
        
        <div className="effect-type-grid">
          {TARGET_TYPES.map((type) => (
            <div 
              key={type.id}
              className={`effect-type-item ${targetTypes.includes(type.id) ? 'selected' : ''}`}
              onClick={() => toggleTargetType(type.id)}
              style={{ 
                borderColor: targetTypes.includes(type.id) ? type.color : 'transparent',
                boxShadow: targetTypes.includes(type.id) ? `0 0 10px ${type.color}40` : 'none'
              }}
            >
              <div className="effect-type-icon">
                <img 
                  src={`https://wow.zamimg.com/images/wow/icons/medium/${type.icon}.jpg`} 
                  alt={type.name}
                  style={{ borderColor: type.color }}
                />
                {targetTypes.includes(type.id) && (
                  <div className="selection-indicator" style={{ backgroundColor: type.color }}></div>
                )}
              </div>
              <div className="effect-type-name" style={{ color: type.color }}>
                {type.name}
              </div>
            </div>
          ))}
        </div>
        
        {/* Selected target types summary */}
        {targetTypes.length > 0 && (
          <div className="selected-types-summary">
            <h6>Selected Target Types:</h6>
            <div className="type-tags">
              {targetTypes.map(typeId => {
                const type = TARGET_TYPES.find(tt => tt.id === typeId);
                return (
                  <div 
                    key={typeId} 
                    className="type-tag"
                    style={{ backgroundColor: `${type.color}30`, borderColor: type.color }}
                  >
                    <span style={{ color: type.color }}>{type.name}</span>
                    <button 
                      className="remove-type"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTargetType(typeId);
                      }}
                    >×</button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Render range options
  const renderRangeOptions = () => {
    // Don't render if targeting mode is self
    if (targetingMode === 'self') return null;
    
    return (
      <div className="section">
        <h5 className="section-title">
          <img src={`https://wow.zamimg.com/images/wow/icons/medium/inv_weapon_bow_07.jpg`} alt="" className="section-icon" />
          Range
        </h5>
        <p className="section-description">
          Define the effective range of your spell.
        </p>
        
        <div className="range-type">
          <h6 className="subsection-title">Range Type:</h6>
          <div className="range-options">
            {RANGE_TYPES.map(type => (
              <label key={type.id} className={`range-option ${rangeType === type.id ? 'selected' : ''}`}>
                <input 
                  type="radio"
                  name="rangeType"
                  checked={rangeType === type.id}
                  onChange={() => handleRangeTypeChange(type.id)}
                />
                <div className="option-icon">
                  <img src={`https://wow.zamimg.com/images/wow/icons/medium/${type.icon}.jpg`} alt={type.name} />
                </div>
                <div className="option-info">
                  <span className="option-name">{type.name}</span>
                  <span className="option-description">{type.description}</span>
                  {rangeType === type.id && (
                    <div className="option-examples">
                      Examples: <span className="examples-text">{type.examples.join(', ')}</span>
                    </div>
                  )}
                </div>
              </label>
            ))}
          </div>
        </div>
        
        {/* Range Distance - only show for ranged spells */}
        {rangeType === 'ranged' && (
          <div className="range-distance">
            <h6 className="subsection-title">Range (feet):</h6>
            <div className="range-input-container">
              <input 
                type="range"
                min="5"
                max="120"
                value={rangeDistance}
                onChange={(e) => setRangeDistance(parseInt(e.target.value))}
                className="range-slider"
                style={{ 
                  '--progress': `${(rangeDistance - 5) / 115 * 100}%`,
                }}
              />
              <div className="range-value">
                <input 
                  type="number"
                  min="5"
                  max="300"
                  value={rangeDistance}
                  onChange={(e) => setRangeDistance(Math.max(5, parseInt(e.target.value) || 5))}
                  className="range-input"
                />
                <span className="range-unit">ft</span>
              </div>
            </div>
            <div className="range-examples">
              <span className="range-example short">Short: 15-30 ft</span>
              <span className="range-example medium">Medium: 60-90 ft</span>
              <span className="range-example long">Long: 120+ ft</span>
            </div>
            
            {/* Visual representation of range */}
            <div className="range-visualization">
              <div className="caster-figure"></div>
              <div 
                className="range-line" 
                style={{ 
                  width: `${Math.min(90, rangeDistance * 0.7)}%`,
                }}
              ></div>
              <div 
                className="target-figure" 
                style={{ 
                  left: `${Math.min(90, rangeDistance * 0.7)}%` 
                }}
              ></div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Render AOE options
  const renderAoeOptions = () => {
    if (targetingMode !== 'aoe') return null;
    
    return (
      <div className="section">
        <h5 className="section-title">
          <img src={`https://wow.zamimg.com/images/wow/icons/medium/spell_fire_selfdestruct.jpg`} alt="" className="section-icon" />
          Area of Effect
        </h5>
        <p className="section-description">
          Define the shape and size of your spell's area of effect.
        </p>
        
        <div className="aoe-settings">
          <h6 className="subsection-title">Area Effect Shape:</h6>
          <div className="aoe-container">
            <div className="aoe-shapes">
              {AOE_SHAPES.map(shape => (
                <div 
                  key={shape.id}
                  className={`aoe-shape-option ${aoeShape === shape.id ? 'selected' : ''}`}
                  onClick={() => setAoeShape(shape.id)}
                >
                  <div className="shape-icon">
                    <img src={`https://wow.zamimg.com/images/wow/icons/medium/${shape.icon}.jpg`} alt={shape.name} />
                  </div>
                  <div className="shape-name">{shape.name}</div>
                </div>
              ))}
            </div>
            
            <div className="aoe-size">
              <h6 className="size-title">Area Size:</h6>
              <div className="size-input-container">
                <input 
                  type="range"
                  min="5"
                  max="60"
                  value={aoeSize}
                  onChange={(e) => setAoeSize(parseInt(e.target.value))}
                  className="size-slider"
                  style={{ 
                    '--progress': `${(aoeSize - 5) / 55 * 100}%`,
                  }}
                />
                <div className="size-value">
                  <input 
                    type="number"
                    min="5"
                    max="100"
                    value={aoeSize}
                    onChange={(e) => setAoeSize(Math.max(5, parseInt(e.target.value) || 5))}
                    className="size-input"
                  />
                  <span className="size-unit">ft</span>
                </div>
              </div>
              
              <div className="size-examples">
                <span className="size-example small">Small: 5-15 ft</span>
                <span className="size-example medium">Medium: 20-30 ft</span>
                <span className="size-example large">Large: 40+ ft</span>
              </div>
            </div>
            
            {/* Enhanced AOE Preview */}
            <div className="aoe-preview">
              <h6 className="preview-title">Preview:</h6>
              <div className="preview-container">
                <div className="preview-caster"></div>
                <div 
                  className={`aoe-preview-shape ${aoeShape}`} 
                  style={{
                    '--aoe-size': `${Math.min(150, aoeSize * 3)}px`,
                  }}
                ></div>
              </div>
              <div className="preview-info">
                {aoeShape.charAt(0).toUpperCase() + aoeShape.slice(1)} • {aoeSize} ft
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Render attack resolution options
  const renderAttackResolution = () => {
    // Don't show attack resolution for self-targeting spells
    if (targetingMode === 'self') return null;
    
    return (
      <div className="section">
        <h5 className="section-title">
          <img src={`https://wow.zamimg.com/images/wow/icons/medium/ability_warrior_challange.jpg`} alt="" className="section-icon" />
          Attack Resolution
        </h5>
        <p className="section-description">
          Define how the spell determines success against targets.
        </p>
        
        <div className="targeting-options">
          {ATTACK_RESOLUTIONS.map((resolution) => (
            <label key={resolution.id} className={`targeting-option ${attackResolution === resolution.id ? 'selected' : ''}`}>
              <input 
                type="radio" 
                name="attackResolution"
                checked={attackResolution === resolution.id}
                onChange={() => handleAttackResolutionChange(resolution.id)}
              />
              <div className="option-icon">
                <img src={`https://wow.zamimg.com/images/wow/icons/medium/${resolution.icon}.jpg`} alt={resolution.name} />
              </div>
              <div className="option-info">
                <span className="option-name">{resolution.name}</span>
                <span className="option-description">{resolution.description}</span>
                {attackResolution === resolution.id && (
                  <span className="option-longdescription">{resolution.longDescription}</span>
                )}
              </div>
            </label>
          ))}
        </div>
        
        {/* Saving throw options */}
        {attackResolution === 'savingThrow' && (
          <div className="save-options">
            <h6 className="subsection-title">Saving Throw:</h6>
            
            <div className="save-attribute-selection">
              <label>Target must make a:</label>
              <div className="attribute-options">
                {SAVE_ATTRIBUTES.map(attr => (
                  <label key={attr.id} className={`attribute-option ${saveAttribute === attr.id ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="saveAttribute"
                      checked={saveAttribute === attr.id}
                      onChange={() => setSaveAttribute(attr.id)}
                    />
                    <div className="attribute-icon">
                      <img src={`https://wow.zamimg.com/images/wow/icons/medium/${attr.icon}.jpg`} alt={attr.name} />
                    </div>
                    <span>{attr.name}</span>
                  </label>
                ))}
              </div>
            </div>
            
            <div className="save-result-selection">
              <label>On a successful save:</label>
              <div className="save-results">
                {SAVE_RESULTS.map(result => (
                  <label key={result.id} className={`save-result-option ${saveResult === result.id ? 'selected' : ''}`}>
                    <input
                      type="radio"
                      name="saveResult"
                      checked={saveResult === result.id}
                      onChange={() => setSaveResult(result.id)}
                    />
                    <div className="result-info">
                      <span className="result-name">{result.name}</span>
                      <span className="result-description">{result.description}</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  // Render additional targeting properties
  const renderTargetingProperties = () => {
    return (
      <div className="section">
        <h5 className="section-title">
          <img src={`https://wow.zamimg.com/images/wow/icons/medium/inv_misc_gem_pearl_06.jpg`} alt="" className="section-icon" />
          Additional Properties
        </h5>
        <p className="section-description">
          Define additional rules for how your spell targets and interacts with the environment.
        </p>
        
        <div className="targeting-properties">
          {TARGETING_PROPERTIES.map(property => (
            <div className="property-option" key={property.id}>
<label className="checkbox-container">
  <input
    type="checkbox"
    checked={targetingProperties[property.id]}
    onChange={() => toggleTargetingProperty(property.id)}
  />
  <span className="checkmark"></span>
  <div className="property-info">
    <span className="property-name">{property.name}</span>
    <span className="property-description">{property.description}</span>
  </div>
</label>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  // Calculate scale factor - 30px per grid square, each grid square is 10ft
  const gridScaleFactor = 3; // 3px = 1ft
  
  // Calculate the proper height for the range indicator based on grid scale
  const rangeHeight = rangeDistance * gridScaleFactor;
  
  // Calculate the proper size for AOE shapes based on grid scale
  const aoeSizePixels = aoeSize * gridScaleFactor;
  


  const renderTargetingPreview = () => {
    return (
      <div className="targeting-preview-panel">
        <h6 className="preview-title"></h6>
        <div className="preview-canvas" ref={previewRef}>
          <div className="grid-scale-indicator">1 square = 10 ft</div>
          
          {/* Caster point */}
          <div className="caster-point" style={{ left: '50%' }}></div>
  
          {/* Range indicator */}
          {rangeType === 'ranged' && (
            <div 
              className="range-indicator" 
              style={{ 
                height: `${rangeHeight}px`,
                '--range-color': '#40c4ff'
              }}
            ></div>
          )}
          
          {/* AOE shapes tied directly to range position */}
          {targetingMode === 'aoe' && rangeType === 'ranged' && (
            <>
              {/* Circle shape */}
              {aoeShape === 'circle' && (
      <div 
        style={{
          position: 'absolute',
          width: `${aoeSizePixels}px`,
          height: `${aoeSizePixels}px`,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(61, 184, 255, 0.15), rgba(61, 184, 255, 0.05))',
          border: '2px solid rgba(61, 184, 255, 0.3)',
          boxShadow: '0 0 20px rgba(61, 184, 255, 0.2)',
          // Fixed positioning at range endpoint
          bottom: `${30 + rangeHeight}px`, // 30px is caster position from bottom
          left: '50%',
          transform: 'translate(-50%, 50%)', // Center on the endpoint
          zIndex: 2
        }}
      ></div>
    )}
    
    {/* Cone shape - apex at range endpoint, pointing upward */}
    {aoeShape === 'cone' && (
      <div 
        style={{
          position: 'absolute',
          width: '0',
          height: '0',
          borderLeft: `${aoeSizePixels / 2}px solid transparent`,
          borderRight: `${aoeSizePixels / 2}px solid transparent`,
          borderTop: `${aoeSizePixels}px solid rgba(61, 184, 255, 0.15)`,
          // Fixed positioning at range endpoint
          bottom: `${30 + rangeHeight}px`, // 30px is caster position from bottom
          left: '50%',
          transform: 'translate(-50%, 0)', // Align apex with endpoint
          zIndex: 2
        }}
      ></div>
    )}
    
    {/* Line shape - starts at range endpoint, extends horizontally */}
    {aoeShape === 'line' && (
  <div style={{
    position: 'absolute',
    width: `${aoeSizePixels}px`,
    height: '10px',
    backgroundColor: 'rgba(61, 184, 255, 0.3)',
    boxShadow: '0 0 10px rgba(61, 184, 255, 0.2)',
    // Position centered at the range endpoint (both horizontally and vertically)
    top: `calc(100% - 30px - ${rangeHeight}px)`,
    left: '50%',
    transform: 'translate(-50%, -50%)', // Center BOTH horizontally and vertically
    zIndex: 2
  }}></div>
)}
    
    {/* Square shape - centered on range endpoint */}
    {aoeShape === 'square' && (
      <div 
        style={{
          position: 'absolute',
          width: `${aoeSizePixels}px`,
          height: `${aoeSizePixels}px`,
          background: 'rgba(61, 184, 255, 0.15)',
          border: '2px solid rgba(61, 184, 255, 0.3)',
          boxShadow: '0 0 20px rgba(61, 184, 255, 0.2)',
          // Fixed positioning at range endpoint 
          bottom: `${30 + rangeHeight}px`, // 30px is caster position from bottom
          left: '50%',
          transform: 'translate(-50%, 50%)', // Center on the endpoint
          zIndex: 2
        }}
      ></div>
              )}
            </>
          )}
        </div>
        
        <div className="preview-info">
          <div className="preview-info-row">
            <span className="info-label">Mode:</span>
            <span className="info-value">{
              TARGETING_MODES.find(m => m.id === targetingMode)?.name
            }</span>
          </div>
          
          {targetingMode === 'multiple' && (
            <div className="preview-info-row">
              <span className="info-label">Targets:</span>
              <span className="info-value">{targetCount}</span>
            </div>
          )}
          
          <div className="preview-info-row">
            <span className="info-label">Range:</span>
            <span className="info-value">
              {RANGE_TYPES.find(r => r.id === rangeType)?.name}
              {rangeType === 'ranged' && ` (${rangeDistance} ft)`}
            </span>
          </div>
          
          {targetingMode === 'aoe' && (
            <div className="preview-info-row">
              <span className="info-label">Area:</span>
              <span className="info-value">
                {AOE_SHAPES.find(s => s.id === aoeShape)?.name}, {aoeSize} ft
              </span>
            </div>
          )}
          
          <div className="preview-info-row">
            <span className="info-label">Resolution:</span>
            <span className="info-value">
              {ATTACK_RESOLUTIONS.find(r => r.id === attackResolution)?.name}
            </span>
          </div>
          
          {attackResolution === 'savingThrow' && (
            <div className="preview-info-row">
              <span className="info-label">Save:</span>
              <span className="info-value">
                {SAVE_ATTRIBUTES.find(a => a.id === saveAttribute)?.name} {saveDC === 'standard' ? '(Standard DC)' : `DC ${dcValue}`}
              </span>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Main component render
  return (
    <div className="wizard-layout">
      <div className="wizard-main-content">
        <div className="targeting-range-step">
          {renderTargetingModes()}
          {renderTargetTypes()}
          {renderRangeOptions()}
          {renderAoeOptions()}
          {renderAttackResolution()}
          {renderTargetingProperties()}
          
          {/* Validation message */}
          {!isValid && validationMessage && (
            <div className="validation-message">
              <p>{validationMessage}</p>
            </div>
          )}
          
          {/* Summary section */}
          {isValid && (
            <div className="section summary-section">
              <h5 className="section-title">
                <img src={`https://wow.zamimg.com/images/wow/icons/medium/inv_misc_book_11.jpg`} alt="" className="section-icon" />
                Targeting Summary
              </h5>
              
              <div className="spell-summary">
                <div className="summary-row">
                  <span className="summary-label">Targeting:</span>
                  <span className="summary-value">
                    {TARGETING_MODES.find(m => m.id === targetingMode)?.name}
                    {targetingMode === 'multiple' && ` (${targetCount} targets)`}
                  </span>
                </div>
                
                {targetingMode !== 'self' && targetTypes.length > 0 && (
                  <div className="summary-row">
                    <span className="summary-label">Valid Targets:</span>
                    <span className="summary-value">
                      {targetTypes.map(t => TARGET_TYPES.find(tt => tt.id === t)?.name).join(', ')}
                    </span>
                  </div>
                )}
                
                <div className="summary-row">
                  <span className="summary-label">Range:</span>
                  <span className="summary-value">
                    {RANGE_TYPES.find(r => r.id === rangeType)?.name}
                    {rangeType === 'ranged' && ` (${rangeDistance} ft)`}
                  </span>
                </div>
                
                {targetingMode === 'aoe' && (
                  <div className="summary-row">
                    <span className="summary-label">Area Effect:</span>
                    <span className="summary-value">
                      {AOE_SHAPES.find(s => s.id === aoeShape)?.name} ({aoeSize} ft)
                    </span>
                  </div>
                )}
                
                <div className="summary-row">
                  <span className="summary-label">Resolution:</span>
                  <span className="summary-value">
                    {ATTACK_RESOLUTIONS.find(r => r.id === attackResolution)?.name}
                    {attackResolution === 'savingThrow' && ` (${SAVE_ATTRIBUTES.find(a => a.id === saveAttribute)?.name} save)`}
                  </span>
                </div>
                
                {attackResolution === 'savingThrow' && (
                  <div className="summary-row">
                    <span className="summary-label">On Successful Save:</span>
                    <span className="summary-value">
                      {SAVE_RESULTS.find(r => r.id === saveResult)?.name}
                    </span>
                  </div>
                )}
                
                <div className="summary-row">
                  <span className="summary-label">Requirements:</span>
                  <span className="summary-value">
                    {targetingProperties.requiresLOS ? 'Line of sight, ' : ''}
                    {targetingProperties.ignoresCover ? 'Ignores cover, ' : ''}
                    {targetingProperties.hasTravelTime ? 'Has travel time, ' : ''}
                    {!targetingProperties.requiresLOS && 
                     !targetingProperties.ignoresCover && 
                     !targetingProperties.hasTravelTime ? 'None' : ''}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Right sidebar with spell preview and interactive targeting preview */}
      <div className="wizard-side-panel">
        <h4 className="preview-title"></h4>
        <SpellPreview spellData={spellData} />
      </div>
    </div>
  );
};

export default Step3TargetingRange;