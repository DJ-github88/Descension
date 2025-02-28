import React, { useState, useEffect } from 'react';
import useSpellWizardStore from '../../../store/spellWizardStore';
import { SpellPreview } from '../common';
import '../styles/spell-wizard.css';

// Spell category options with icons
const SPELL_CATEGORIES = [
  { id: 'damage', name: 'Damage', description: 'Spells that primarily deal damage to targets.', icon: 'spell_fire_fireball02' },
  { id: 'healing', name: 'Healing', description: 'Spells that restore health to allies.', icon: 'spell_holy_flashheal' },
  { id: 'buff', name: 'Buff', description: 'Spells that enhance allies\' abilities or stats.', icon: 'spell_holy_powerwordshield' },
  { id: 'debuff', name: 'Debuff', description: 'Spells that weaken enemies\' abilities or stats.', icon: 'spell_shadow_curseofsargeras' },
  { id: 'utility', name: 'Utility', description: 'Spells with practical uses outside of direct combat.', icon: 'spell_frost_chainsofice' }
];

// Damage types with icons and colors
const DAMAGE_TYPES = [
  { id: 'fire', name: 'Fire', color: '#ff4500', icon: 'spell_fire_fire', description: 'Fire damage burns targets and can ignite flammable objects.' },
  { id: 'frost', name: 'Frost', color: '#00bfff', icon: 'spell_frost_frostbolt02', description: 'Frost damage can slow or freeze targets.' },
  { id: 'arcane', name: 'Arcane', color: '#9932cc', icon: 'spell_holy_magicalsentry', description: 'Arcane damage is pure magical energy that bypasses many resistances.' },
  { id: 'nature', name: 'Nature', color: '#32cd32', icon: 'spell_nature_naturetouchgrow', description: 'Nature damage includes acid, poison, and life energy manipulation.' },
  { id: 'shadow', name: 'Shadow', color: '#800080', icon: 'spell_shadow_shadowbolt', description: 'Shadow damage corrupts and drains life force from targets.' },
  { id: 'holy', name: 'Holy', color: '#ffd700', icon: 'spell_holy_holybolt', description: 'Holy damage is especially effective against undead and fiends.' },
  { id: 'physical', name: 'Physical', color: '#c0c0c0', icon: 'ability_warrior_savageblow', description: 'Physical damage comes from direct force and impacts.' }
];

// AOE shapes with icons
const AOE_SHAPES = [
  { id: 'circle', name: 'Circle', description: 'Affects all targets within a radius around a point.', icon: 'spell_holy_circleofrenewal' },
  { id: 'cone', name: 'Cone', description: 'Affects targets in a cone-shaped area extending from the caster.', icon: 'spell_fire_flamebolt' },
  { id: 'line', name: 'Line', description: 'Affects targets in a straight line from the caster.', icon: 'spell_nature_lightning' },
  { id: 'square', name: 'Square', description: 'Affects targets in a square area centered on a point.', icon: 'spell_frost_glacier' }
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
  
  // Category-specific subtypes
  const SUBTYPES = {
    damage: [
      { id: 'direct', name: 'Direct Damage', description: 'Deals immediate damage upon impact.', icon: 'spell_fire_meteorstorm' },
      { id: 'dot', name: 'Damage Over Time', description: 'Deals damage gradually over several rounds.', icon: 'spell_shadow_unstableaffliction_3' },
      { id: 'aoe', name: 'Area Damage', description: 'Damages multiple targets in an area.', icon: 'spell_fire_flameshock' },
      { id: 'burst', name: 'Burst Damage', description: 'High damage with longer cooldown or resource cost.', icon: 'spell_fire_fireball' }
    ],
    healing: [
      { id: 'direct', name: 'Direct Healing', description: 'Immediately restores health to the target.', icon: 'spell_holy_heal' },
      { id: 'hot', name: 'Healing Over Time', description: 'Gradually restores health over several rounds.', icon: 'spell_holy_renew' },
      { id: 'aoe', name: 'Area Healing', description: 'Heals multiple allies in an area.', icon: 'spell_holy_prayerofhealing' },
      { id: 'reactive', name: 'Reactive Healing', description: 'Healing that triggers in response to damage.', icon: 'spell_holy_sealofsacrifice' }
    ],
    buff: [
      { id: 'stat', name: 'Stat Boost', description: 'Increases one or more stats of the target.', icon: 'spell_holy_greaterblessingofkings' },
      { id: 'protection', name: 'Protection', description: 'Reduces or prevents damage taken.', icon: 'spell_holy_powerwordshield' },
      { id: 'mobility', name: 'Mobility', description: 'Enhances movement speed or options.', icon: 'spell_nature_astralrecalgroup' },
      { id: 'resource', name: 'Resource Generation', description: 'Grants resources or enhances regeneration.', icon: 'spell_nature_manaregentotem' }
    ],
    debuff: [
      { id: 'impair', name: 'Impairment', description: 'Reduces target\'s stats or effectiveness.', icon: 'spell_shadow_curseofmannoroth' },
      { id: 'control', name: 'Control', description: 'Restricts target\'s movement or actions.', icon: 'spell_frost_chainsofice' },
      { id: 'vulnerability', name: 'Vulnerability', description: 'Makes target take increased damage.', icon: 'spell_shadow_antimagicshell' },
      { id: 'resource', name: 'Resource Drain', description: 'Depletes or prevents regeneration of resources.', icon: 'spell_shadow_manaburn' }
    ],
    utility: [
      { id: 'movement', name: 'Movement', description: 'Provides special movement options.', icon: 'spell_arcane_blink' },
      { id: 'detection', name: 'Detection', description: 'Reveals hidden objects, creatures, or information.', icon: 'spell_holy_mindvision' },
      { id: 'creation', name: 'Creation', description: 'Creates objects or effects that can be interacted with.', icon: 'spell_frost_summonwaterelemental_2' },
      { id: 'manipulation', name: 'Manipulation', description: 'Manipulates the environment or objects.', icon: 'spell_nature_wispsplode' }
    ]
  };

  // Range type definitions with icons
  const RANGE_TYPES = [
    { id: 'self', name: 'Self', description: 'Affects only the caster.', icon: 'spell_holy_innerfire' },
    { id: 'touch', name: 'Touch', description: 'Caster must touch the target to apply the effect.', icon: 'spell_holy_layonhands' },
    { id: 'melee', name: 'Melee', description: 'Affects targets within melee range (5 feet).', icon: 'inv_sword_04' },
    { id: 'ranged', name: 'Ranged', description: 'Can target creatures at a distance specified in feet.', icon: 'ability_hunter_aimedshot' }
  ];
  
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
    <div className="wizard-layout">
      <div className="wizard-main-content">
        <div className="primary-function-step">
          {/* Category Selection Section */}
          <div className="section">
            <h4 className="section-title">
              <img src="https://wow.zamimg.com/images/wow/icons/medium/spell_arcane_prismaticcloak.jpg" alt="" className="section-icon" />
              Primary Function
            </h4>
            <p className="section-description">
              Select the main purpose and role of your spell.
            </p>
            
            <div className="category-options">
              {SPELL_CATEGORIES.map((categoryItem) => (
                <div 
                  key={categoryItem.id}
                  className={`category-option ${category === categoryItem.id ? 'selected' : ''}`}
                  onClick={() => handleCategorySelect(categoryItem.id)}
                >
                  <div className="category-icon">
                    <img src={`https://wow.zamimg.com/images/wow/icons/medium/${categoryItem.icon}.jpg`} alt={categoryItem.name} />
                  </div>
                  <div className="category-info">
                    <div className="category-name">{categoryItem.name}</div>
                    <div className="category-description">{categoryItem.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Subtypes - show if category is selected */}
          {category && (
            <div className="section">
              <h5 className="section-title">
                <img src="https://wow.zamimg.com/images/wow/icons/medium/inv_misc_book_16.jpg" alt="" className="section-icon" />
                Specific Type
              </h5>
              <p className="section-description">
                Select the specific type of {category} spell to refine its function.
              </p>
              
              <div className="subtype-options">
                {getAvailableSubtypes().map((subtypeItem) => (
                  <div 
                    key={subtypeItem.id}
                    className={`subtype-option ${subtype === subtypeItem.id ? 'selected' : ''}`}
                    onClick={() => handleSubtypeSelect(subtypeItem.id)}
                  >
                    <div className="subtype-icon">
                      <img src={`https://wow.zamimg.com/images/wow/icons/medium/${subtypeItem.icon}.jpg`} alt={subtypeItem.name} />
                    </div>
                    <div className="subtype-info">
                      <div className="subtype-name">{subtypeItem.name}</div>
                      <div className="subtype-description">{subtypeItem.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Damage Types - show if damage category is selected */}
          {category === 'damage' && (
            <div className="section">
              <h5 className="section-title">
                <img src="https://wow.zamimg.com/images/wow/icons/medium/spell_fire_flamebolt.jpg" alt="" className="section-icon" />
                Damage Types
              </h5>
              <p className="section-description">
                Select one or more damage types for your spell.
              </p>
              
              <div className="damage-types-grid">
                {DAMAGE_TYPES.map((damageType) => (
                  <div 
                    key={damageType.id}
                    className={`damage-type-option ${damageTypes.includes(damageType.id) ? 'selected' : ''}`}
                    onClick={() => toggleDamageType(damageType.id)}
                    style={{
                      '--type-color': damageType.color,
                    }}
                  >
                    <div className="damage-type-icon">
                      <img src={`https://wow.zamimg.com/images/wow/icons/medium/${damageType.icon}.jpg`} alt={damageType.name} />
                    </div>
                    <div className="damage-type-info">
                      <div className="damage-type-name" style={{ color: damageType.color }}>{damageType.name}</div>
                      <div className="damage-type-description">{damageType.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Range & Targeting Section - show after subtype is selected */}
          {subtype && (
            <div className="section">
              <h5 className="section-title">
                <img src="https://wow.zamimg.com/images/wow/icons/medium/inv_weapon_bow_07.jpg" alt="" className="section-icon" />
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
                      <span>Single Target</span>
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
                      <span>Area of Effect</span>
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
                  </div>
                )}
              </div>
              
              {/* AOE Shape Selection - only if targeting mode is AOE */}
              {targetingMode === 'aoe' && (
                <div className="aoe-settings">
                  <h6 className="subsection-title">Area Effect:</h6>
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
                    </div>
                    
                    {/* AOE Preview */}
                    <div className="aoe-preview">
                      <h6 className="preview-title">Preview:</h6>
                      <div className="preview-container">
                        <div className="caster-point"></div>
                        <div 
                          className={`preview-shape preview-${aoeShape}`} 
                          style={{
                            '--size': `${Math.min(100, aoeSize * 1.5)}px`,
                            '--color': category === 'damage' && damageTypes.length > 0
                              ? DAMAGE_TYPES.find(dt => dt.id === damageTypes[0])?.color || '#40c4ff'
                              : '#40c4ff'
                          }}
                        ></div>
                      </div>
                      <div className="preview-info">
                        {aoeShape.charAt(0).toUpperCase() + aoeShape.slice(1)} • {aoeSize} ft
                      </div>
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
        </div>
      </div>
      
      {/* Side Preview Panel */}
      <div className="wizard-side-panel">
        <div className="spell-preview-container">
          <h3 className="preview-title">
            <img src="https://wow.zamimg.com/images/wow/icons/medium/spell_holy_magicalsentry.jpg" alt="" />
            Spell Preview
          </h3>
          <SpellPreview spellData={spellData} />
        </div>
        
        <div className="wizard-help-panel">
          <h4>
            <img src="https://wow.zamimg.com/images/wow/icons/medium/inv_misc_note_05.jpg" alt="" />
            Step 2: Primary Function
          </h4>
          <p>In this step, you'll define the core functionality of your spell:</p>
          <ul>
            <li>The primary category (damage, healing, buff, etc.)</li>
            <li>The specific subtype of the category</li>
            <li>Damage types (for damage spells)</li>
            <li>How the spell targets (single or area effect)</li>
            <li>Range and area configurations</li>
          </ul>
          <div className="help-tip">
            <img src="https://wow.zamimg.com/images/wow/icons/medium/inv_misc_gem_pearl_06.jpg" alt="Tip" />
            <p>For area effects, consider how the size relates to typical combat spaces. 15ft is about the size of a small room!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Step2PrimaryFunction;