import React, { useState, useEffect } from 'react';
import useSpellWizardStore from '../../../store/spellWizardStore';
import { SpellPreview } from '../common';
import '../styles/spell-wizard.css';

// Spell category options with enhanced descriptions and icons
const SPELL_CATEGORIES = [
  { 
    id: 'damage', 
    name: 'Damage', 
    description: 'Spells that inflict harm on enemies', 
    longDescription: 'Damage spells focus on dealing harmful effects to enemies. These can range from direct attacks to damage-over-time effects that wear down foes.',
    icon: 'spell_fire_fireball02',
    color: '#ff4400'
  },
  { 
    id: 'healing', 
    name: 'Healing', 
    description: 'Spells that restore health to allies', 
    longDescription: 'Healing spells focus on restoring health to allies, either immediately or over time. Essential for supporting your party in battle.',
    icon: 'spell_holy_flashheal',
    color: '#00cc00'
  },
  { 
    id: 'buff', 
    name: 'Buff', 
    description: 'Spells that enhance allies\' abilities', 
    longDescription: 'Buff spells provide beneficial effects to allies, enhancing their stats, defenses, or combat capabilities for a period of time.',
    icon: 'spell_holy_powerwordshield',
    color: '#0088ff'
  },
  { 
    id: 'debuff', 
    name: 'Debuff', 
    description: 'Spells that weaken enemies', 
    longDescription: 'Debuff spells apply negative effects to enemies, weakening their capabilities, slowing their movements, or making them more vulnerable to attacks.',
    icon: 'spell_shadow_curseofsargeras',
    color: '#8800ff'
  },
  { 
    id: 'utility', 
    name: 'Utility', 
    description: 'Versatile spells with practical uses', 
    longDescription: 'Utility spells provide practical effects beyond direct combat, such as movement enhancement, environmental manipulation, or solving puzzles.',
    icon: 'spell_frost_chainsofice',
    color: '#ffcc00'
  }
];

// Damage types with enhanced visual information
const DAMAGE_TYPES = [
  { id: 'fire', name: 'Fire', color: '#ff4500', icon: 'spell_fire_fire', description: 'Fire damage burns targets and can cause damage over time effects.' },
  { id: 'frost', name: 'Frost', color: '#00bfff', icon: 'spell_frost_frostbolt02', description: 'Frost damage can slow or freeze targets, reducing their mobility.' },
  { id: 'arcane', name: 'Arcane', color: '#9932cc', icon: 'spell_holy_magicalsentry', description: 'Arcane damage is pure magical energy that bypasses many conventional resistances.' },
  { id: 'nature', name: 'Nature', color: '#32cd32', icon: 'spell_nature_naturetouchgrow', description: 'Nature damage includes poison, acid, and life energy manipulation.' },
  { id: 'shadow', name: 'Shadow', color: '#800080', icon: 'spell_shadow_shadowbolt', description: 'Shadow damage corrupts and drains life force from targets.' },
  { id: 'holy', name: 'Holy', color: '#ffd700', icon: 'spell_holy_holybolt', description: 'Holy damage is especially effective against undead and evil creatures.' },
  { id: 'physical', name: 'Physical', color: '#c0c0c0', icon: 'ability_warrior_savageblow', description: 'Physical damage comes from direct force and impacts.' }
];

// AOE shapes with visual examples
const AOE_SHAPES = [
  { id: 'circle', name: 'Circle', description: 'Affects all targets within a radius around a point.', icon: 'spell_holy_circleofrenewal' },
  { id: 'cone', name: 'Cone', description: 'Affects targets in a cone-shaped area extending from the caster.', icon: 'spell_fire_flamebolt' },
  { id: 'line', name: 'Line', description: 'Affects targets in a straight line from the caster.', icon: 'spell_nature_lightning' },
  { id: 'square', name: 'Square', description: 'Affects targets in a square area centered on a point.', icon: 'spell_frost_glacier' }
];

// Range types with detailed descriptions
const RANGE_TYPES = [
  { 
    id: 'self', 
    name: 'Self', 
    description: 'Affects only the caster.', 
    icon: 'spell_holy_innerfire',
    examples: ['Buffs', 'Self healing', 'Personal shields']
  },
  { 
    id: 'touch', 
    name: 'Touch', 
    description: 'Caster must touch the target to apply the effect.', 
    icon: 'spell_holy_layonhands',
    examples: ['Melee enchantments', 'Close healing', 'Life drains']
  },
  { 
    id: 'melee', 
    name: 'Melee Range', 
    description: 'Affects targets within melee range (5 feet).', 
    icon: 'inv_sword_04',
    examples: ['Strike abilities', 'Close-range spells', 'Auras']
  },
  { 
    id: 'ranged', 
    name: 'Ranged', 
    description: 'Can target creatures at a specified distance.', 
    icon: 'ability_hunter_aimedshot',
    examples: ['Most damage spells', 'Projectile abilities', 'Long-distance healing']
  }
];

const Step2PrimaryFunction = () => {
  const { spellData, updateSpellData, setStepValidation } = useSpellWizardStore();
  
  // Local state for form inputs
  const [category, setCategory] = useState(spellData.category || '');
  const [subtype, setSubtype] = useState(spellData.subtype || '');
  const [targetingMode, setTargetingMode] = useState(spellData.targetingMode || 'single');
  const [aoeShape, setAoeShape] = useState(spellData.aoeShape || 'circle');
  const [aoeSize, setAoeSize] = useState(spellData.aoeSize || 10);
  const [rangeType, setRangeType] = useState(spellData.rangeType || 'ranged');
  const [rangeDistance, setRangeDistance] = useState(spellData.range || 30);
  const [damageTypes, setDamageTypes] = useState(spellData.damageTypes || []);
  
  // Local state for tracking validation
  const [isValid, setIsValid] = useState(false);
  
  // Category-specific subtypes with enhanced descriptions
  const SUBTYPES = {
    damage: [
      { id: 'direct', name: 'Direct Damage', description: 'Deals immediate damage upon impact.', icon: 'spell_fire_meteorstorm', examples: ['Fireball', 'Ice Lance', 'Shadow Bolt'] },
      { id: 'dot', name: 'Damage Over Time', description: 'Deals damage gradually over several rounds.', icon: 'spell_shadow_unstableaffliction_3', examples: ['Poison', 'Burning', 'Corruption'] },
      { id: 'aoe', name: 'Area Damage', description: 'Damages multiple targets in an area.', icon: 'spell_fire_flameshock', examples: ['Flamestrike', 'Blizzard', 'Rain of Fire'] },
      { id: 'burst', name: 'Burst Damage', description: 'High damage with longer cooldown or resource cost.', icon: 'spell_fire_fireball', examples: ['Pyroblast', 'Chaos Bolt', 'Execute'] }
    ],
    healing: [
      { id: 'direct', name: 'Direct Healing', description: 'Immediately restores health to the target.', icon: 'spell_holy_heal', examples: ['Flash Heal', 'Healing Surge', 'Holy Light'] },
      { id: 'hot', name: 'Healing Over Time', description: 'Gradually restores health over several rounds.', icon: 'spell_holy_renew', examples: ['Renew', 'Rejuvenation', 'Healing Stream'] },
      { id: 'aoe', name: 'Area Healing', description: 'Heals multiple allies in an area.', icon: 'spell_holy_prayerofhealing', examples: ['Prayer of Healing', 'Chain Heal', 'Healing Rain'] },
      { id: 'reactive', name: 'Reactive Healing', description: 'Healing that triggers in response to damage.', icon: 'spell_holy_sealofsacrifice', examples: ['Spirit Link', 'Atonement', 'Life Cocoon'] }
    ],
    buff: [
      { id: 'stat', name: 'Stat Boost', description: 'Increases one or more stats of the target.', icon: 'spell_holy_greaterblessingofkings', examples: ['Arcane Intellect', 'Mark of the Wild', 'Power Word: Fortitude'] },
      { id: 'protection', name: 'Protection', description: 'Reduces or prevents damage taken.', icon: 'spell_holy_powerwordshield', examples: ['Power Word: Shield', 'Ice Barrier', 'Barkskin'] },
      { id: 'mobility', name: 'Mobility', description: 'Enhances movement speed or options.', icon: 'spell_nature_astralrecalgroup', examples: ['Speed of Light', 'Sprint', 'Ghost Wolf'] },
      { id: 'resource', name: 'Resource Generation', description: 'Grants resources or enhances regeneration.', icon: 'spell_nature_manaregentotem', examples: ['Innervate', 'Mana Tide', 'Focus'] }
    ],
    debuff: [
      { id: 'impair', name: 'Impairment', description: 'Reduces target\'s stats or effectiveness.', icon: 'spell_shadow_curseofmannoroth', examples: ['Curse of Weakness', 'Cripple', 'Sunder Armor'] },
      { id: 'control', name: 'Control', description: 'Restricts target\'s movement or actions.', icon: 'spell_frost_chainsofice', examples: ['Frost Nova', 'Entangling Roots', 'Fear'] },
      { id: 'vulnerability', name: 'Vulnerability', description: 'Makes target take increased damage.', icon: 'spell_shadow_antimagicshell', examples: ['Chaos Brand', 'Mystic Touch', 'Hunter\'s Mark'] },
      { id: 'resource', name: 'Resource Drain', description: 'Depletes or prevents regeneration of resources.', icon: 'spell_shadow_manaburn', examples: ['Mana Burn', 'Viper Sting', 'Curse of Tongues'] }
    ],
    utility: [
      { id: 'movement', name: 'Movement', description: 'Provides special movement options.', icon: 'spell_arcane_blink', examples: ['Blink', 'Leap', 'Teleport'] },
      { id: 'detection', name: 'Detection', description: 'Reveals hidden objects, creatures, or information.', icon: 'spell_holy_mindvision', examples: ['Detect Magic', 'Track Undead', 'Far Sight'] },
      { id: 'creation', name: 'Creation', description: 'Creates objects or effects that can be interacted with.', icon: 'spell_frost_summonwaterelemental_2', examples: ['Summoning', 'Conjuration', 'Portal'] },
      { id: 'manipulation', name: 'Manipulation', description: 'Manipulates the environment or objects.', icon: 'spell_nature_wispsplode', examples: ['Levitate', 'Control Water', 'Shape Earth'] }
    ]
  };
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
    setStepValidation(1, valid);
    
    // Update spell data with current values
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
    rangeType, rangeDistance, damageTypes, setStepValidation, updateSpellData
  ]);
  
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
  
  // Get selected category data
  const getSelectedCategory = () => {
    return SPELL_CATEGORIES.find(c => c.id === category) || {};
  };
  
  return (
    <div className="wizard-layout">
      <div className="wizard-main-content">
        <div className="primary-function-step">
          {/* Improved Category Selection Section */}
          <div className="section">
            <h4 className="section-title">
              <img src={`https://wow.zamimg.com/images/wow/icons/medium/spell_arcane_prismaticcloak.jpg`} alt="" className="section-icon" />
              Primary Function
            </h4>
            <p className="section-description">
              Select the main purpose of your spell. This defines its core functionality and how it will interact with targets.
            </p>
            
            <div className="category-options">
              {SPELL_CATEGORIES.map((categoryItem) => (
                <div 
                  key={categoryItem.id}
                  className={`category-option ${category === categoryItem.id ? 'selected' : ''}`}
                  onClick={() => handleCategorySelect(categoryItem.id)}
                  style={{ 
                    borderColor: category === categoryItem.id ? categoryItem.color : 'transparent',
                    boxShadow: category === categoryItem.id ? `0 0 10px ${categoryItem.color}40` : 'none'
                  }}
                >
                  <div className="category-icon">
                    <img src={`https://wow.zamimg.com/images/wow/icons/medium/${categoryItem.icon}.jpg`} alt={categoryItem.name} />
                  </div>
                  <div className="category-info">
                    <div className="category-name" style={{ color: categoryItem.color }}>{categoryItem.name}</div>
                    <div className="category-description">{categoryItem.description}</div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Show extended description for selected category */}
            {category && (
              <div className="selected-category-details">
                <p className="detail-description">{getSelectedCategory().longDescription}</p>
              </div>
            )}
          </div>
          
          {/* Improved Subtypes Section - show if category is selected */}
          {category && (
            <div className="section">
              <h5 className="section-title">
                <img src={`https://wow.zamimg.com/images/wow/icons/medium/inv_misc_book_16.jpg`} alt="" className="section-icon" />
                Spell Approach
              </h5>
              <p className="section-description">
                How will your {category} spell achieve its effect? Select a specific approach below.
              </p>
              
              <div className="subtype-options">
                {getAvailableSubtypes().map((subtypeItem) => (
                  <div 
                    key={subtypeItem.id}
                    className={`subtype-option ${subtype === subtypeItem.id ? 'selected' : ''}`}
                    onClick={() => handleSubtypeSelect(subtypeItem.id)}
                    style={{ 
                      borderColor: subtype === subtypeItem.id ? getSelectedCategory().color : 'transparent',
                      boxShadow: subtype === subtypeItem.id ? `0 0 10px ${getSelectedCategory().color}40` : 'none'
                    }}
                  >
                    <div className="subtype-icon">
                      <img src={`https://wow.zamimg.com/images/wow/icons/medium/${subtypeItem.icon}.jpg`} alt={subtypeItem.name} />
                    </div>
                    <div className="subtype-info">
                      <div className="subtype-name" style={{ color: subtype === subtypeItem.id ? getSelectedCategory().color : 'inherit' }}>
                        {subtypeItem.name}
                      </div>
                      <div className="subtype-description">{subtypeItem.description}</div>
                      
                      {/* Added examples */}
                      <div className="subtype-examples">
                        Examples: <span className="examples-text">{subtypeItem.examples.join(', ')}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Improved Damage Types Section - show if damage category is selected */}
          {category === 'damage' && (
            <div className="section">
              <h5 className="section-title">
                <img src={`https://wow.zamimg.com/images/wow/icons/medium/spell_fire_flamebolt.jpg`} alt="" className="section-icon" />
                Damage Types
              </h5>
              <p className="section-description">
                Select one or more damage types for your spell. This affects resistances, immunities, and visual effects.
              </p>
              
              <div className="damage-types-grid">
                {DAMAGE_TYPES.map((damageType) => (
                  <div 
                    key={damageType.id}
                    className={`damage-type-option ${damageTypes.includes(damageType.id) ? 'selected' : ''}`}
                    onClick={() => toggleDamageType(damageType.id)}
                    style={{ 
                      '--type-color': damageType.color,
                      borderColor: damageTypes.includes(damageType.id) ? damageType.color : 'transparent',
                      boxShadow: damageTypes.includes(damageType.id) ? `0 0 10px ${damageType.color}40` : 'none'
                    }}
                  >
                    <div className="damage-type-icon">
                      <img src={`https://wow.zamimg.com/images/wow/icons/medium/${damageType.icon}.jpg`} alt={damageType.name} />
                    </div>
                    <div className="damage-type-info">
                      <div className="damage-type-name" style={{ color: damageType.color }}>{damageType.name}</div>
                      <div className="damage-type-description">{damageType.description}</div>
                    </div>
                    
                    {/* Visual indicator for selected state */}
                    {damageTypes.includes(damageType.id) && (
                      <div className="selected-indicator" style={{ backgroundColor: damageType.color }}>
                        <span>✓</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {/* Selected damage types summary */}
              {damageTypes.length > 0 && (
                <div className="selected-damage-types">
                  <h6>Selected Types:</h6>
                  <div className="damage-type-tags">
                    {damageTypes.map(typeId => {
                      const type = DAMAGE_TYPES.find(dt => dt.id === typeId);
                      return (
                        <div 
                          key={typeId} 
                          className="damage-type-tag"
                          style={{ backgroundColor: `${type.color}30`, borderColor: type.color }}
                        >
                          <span style={{ color: type.color }}>{type.name}</span>
                          <button 
                            className="remove-type"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleDamageType(typeId);
                            }}
                          >×</button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Improved Range & Targeting Section - show after subtype is selected */}
          {subtype && (
            <div className="section">
              <h5 className="section-title">
                <img src={`https://wow.zamimg.com/images/wow/icons/medium/inv_weapon_bow_07.jpg`} alt="" className="section-icon" />
                Range & Targeting
              </h5>
              <p className="section-description">
                Define how your spell targets its recipients and its effective range.
              </p>
              
              <div className="targeting-container">
                <div className="targeting-mode">
                  <h6 className="subsection-title">Targeting Mode:</h6>
                  <div className="targeting-options">
                    <label className="targeting-option">
                      <input 
                        type="radio" 
                        checked={targetingMode === 'single'}
                        onChange={() => setTargetingMode('single')}
                      />
                      <span className="option-indicator"></span>
                      <div className="option-icon">
                        <img src="https://wow.zamimg.com/images/wow/icons/medium/spell_arcane_blast.jpg" alt="Single Target" />
                      </div>
                      <div className="option-info">
                        <span className="option-name">Single Target</span>
                        <span className="option-description">Affects only one target at a time</span>
                      </div>
                    </label>
                    <label className="targeting-option">
                      <input 
                        type="radio" 
                        checked={targetingMode === 'aoe'}
                        onChange={() => setTargetingMode('aoe')}
                      />
                      <span className="option-indicator"></span>
                      <div className="option-icon">
                        <img src="https://wow.zamimg.com/images/wow/icons/medium/spell_progenitor_areadenial.jpg" alt="Area of Effect" />
                      </div>
                      <div className="option-info">
                        <span className="option-name">Area of Effect</span>
                        <span className="option-description">Affects multiple targets in an area</span>
                      </div>
                    </label>
                  </div>
                </div>
                
                <div className="range-type">
                  <h6 className="subsection-title">Range Type:</h6>
                  <div className="range-options">
                    {RANGE_TYPES.map(type => (
                      <label key={type.id} className="range-option">
                        <input 
                          type="radio"
                          checked={rangeType === type.id}
                          onChange={() => setRangeType(type.id)}
                        />
                        <span className="option-indicator"></span>
                        <div className="option-icon">
                          <img src={`https://wow.zamimg.com/images/wow/icons/medium/${type.icon}.jpg`} alt={type.name} />
                        </div>
                        <div className="option-info">
                          <span className="option-name">{type.name}</span>
                          <span className="option-description">{type.description}</span>
                          
                          {/* Added examples */}
                          <div className="option-examples">
                            Examples: <span className="examples-text">{type.examples.join(', ')}</span>
                          </div>
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
                          '--track-color': getSelectedCategory().color || '#00a8ff'
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
                      <div className="range-line" style={{ width: `${Math.min(100, rangeDistance * 0.8)}%` }}></div>
                      <div className="target-figure"></div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* AOE Shape Selection - only if targeting mode is AOE */}
              {targetingMode === 'aoe' && (
                <div className="aoe-settings">
                  <h6 className="subsection-title">Area Effect Shape:</h6>
                  <div className="aoe-container">
                    <div className="aoe-shapes">
                      {AOE_SHAPES.map(shape => (
                        <div 
                          key={shape.id}
                          className={`aoe-shape-option ${aoeShape === shape.id ? 'selected' : ''}`}
                          onClick={() => setAoeShape(shape.id)}
                          style={{ 
                            borderColor: aoeShape === shape.id ? getSelectedCategory().color : 'transparent',
                            boxShadow: aoeShape === shape.id ? `0 0 10px ${getSelectedCategory().color}40` : 'none'
                          }}
                        >
                          <div className="shape-icon">
                            <img src={`https://wow.zamimg.com/images/wow/icons/medium/${shape.icon}.jpg`} alt={shape.name} />
                          </div>
                          <div className="shape-info">
                            <div className="shape-name" 
                                 style={{ color: aoeShape === shape.id ? getSelectedCategory().color : 'inherit' }}>
                              {shape.name}
                            </div>
                            <div className="shape-description">{shape.description}</div>
                          </div>
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
                            '--track-color': getSelectedCategory().color || '#00a8ff'
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
                        <div className="caster-point"></div>
                        <div 
                          className={`preview-shape preview-${aoeShape}`} 
                          style={{
                            '--size': `${Math.min(100, aoeSize * 1.5)}px`,
                            '--color': category === 'damage' && damageTypes.length > 0
                              ? DAMAGE_TYPES.find(dt => dt.id === damageTypes[0])?.color || getSelectedCategory().color
                              : getSelectedCategory().color || '#40c4ff'
                          }}
                        ></div>
                      </div>
                      <div className="preview-info">
                        {aoeShape.charAt(0).toUpperCase() + aoeShape.slice(1)} • {aoeSize} ft
                        {category === 'damage' && damageTypes.length > 0 && (
                          <span className="preview-element"> • {DAMAGE_TYPES.find(dt => dt.id === damageTypes[0]).name}</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          
          {/* Improved Summary Section */}
          {isValid && (
            <div className="section summary-section">
              <h5 className="section-title">
                <img src={`https://wow.zamimg.com/images/wow/icons/medium/inv_misc_book_11.jpg`} alt="" className="section-icon" />
                Spell Summary
              </h5>
              
              <div className="spell-summary">
                <div className="summary-row">
                  <span className="summary-label">Type:</span>
                  <span className="summary-value">
                    {getSelectedCategory().name || ''} •{' '}
                    {SUBTYPES[category]?.find(s => s.id === subtype)?.name || ''}
                  </span>
                </div>
                
                {category === 'damage' && damageTypes.length > 0 && (
                  <div className="summary-row">
                    <span className="summary-label">Damage:</span>
                    <span className="summary-value damage-summary">
                      {damageTypes.map(typeId => {
                        const type = DAMAGE_TYPES.find(dt => dt.id === typeId);
                        return (
                          <span key={typeId} className="damage-tag" style={{ color: type.color }}>
                            {type.name}
                          </span>
                        );
                      }).reduce((prev, curr) => [prev, ' / ', curr])}
                    </span>
                  </div>
                )}
                
                <div className="summary-row">
                  <span className="summary-label">Targeting:</span>
                  <span className="summary-value">
                    {targetingMode === 'single' ? 'Single Target' : 'Area of Effect'}
                    {targetingMode === 'aoe' && (
                      <> ({AOE_SHAPES.find(s => s.id === aoeShape)?.name}, {aoeSize} ft)</>
                    )}
                  </span>
                </div>
                
                <div className="summary-row">
                  <span className="summary-label">Range:</span>
                  <span className="summary-value">
                    {RANGE_TYPES.find(r => r.id === rangeType)?.name}
                    {rangeType === 'ranged' && <> ({rangeDistance} ft)</>}
                  </span>
                </div>
              </div>
            </div>
          )}
          
          {/* Improved Validation Message */}
          {!isValid && (
            <div className="validation-message">
              {!category ? (
                <p><span className="validation-icon">⚠️</span> Please select a primary function for your spell.</p>
              ) : !subtype ? (
                <p><span className="validation-icon">⚠️</span> Please select a specific approach for your {category} spell.</p>
              ) : category === 'damage' && damageTypes.length === 0 ? (
                <p><span className="validation-icon">⚠️</span> Please select at least one damage type.</p>
              ) : targetingMode === 'aoe' && (!aoeShape || aoeSize <= 0) ? (
                <p><span className="validation-icon">⚠️</span> Please specify the shape and size of your area effect.</p>
              ) : rangeType === 'ranged' && (!rangeDistance || rangeDistance <= 0) ? (
                <p><span className="validation-icon">⚠️</span> Please specify a valid range for your spell.</p>
              ) : (
                <p><span className="validation-icon">⚠️</span> Please complete all required fields to proceed.</p>
              )}
            </div>
          )}
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
            Step 2: Primary Function
          </h4>
          <p>In this step, you'll define the core functionality of your spell:</p>
          <ul>
            <li>The primary category determines your spell's main purpose</li>
            <li>The specific approach refines how your spell achieves its effect</li>
            <li>Damage types (for damage spells) affect resistances and visuals</li>
            <li>Targeting mode defines whether it hits one or many targets</li>
            <li>Range settings determine how far your spell can reach</li>
          </ul>
          <div className="help-tip">
            <img src="https://wow.zamimg.com/images/wow/icons/medium/inv_misc_gem_pearl_06.jpg" alt="Tip" />
            <p>Consider your character's role when choosing your spell's function. Healers benefit from healing and buff spells, while damage dealers might prefer damage or debuff spells.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2PrimaryFunction;