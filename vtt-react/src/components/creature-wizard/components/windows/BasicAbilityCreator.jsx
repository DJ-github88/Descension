import React, { useState } from 'react';
import { v4 as generateUniqueId } from 'uuid';
import { getIconUrl } from '../../../../utils/assetManager';
import IconSelector from '../../../spellcrafting-wizard/components/common/IconSelector';
import './BasicAbilityCreator.css';
import '../../../spellcrafting-wizard/styles/pathfinder/main.css';

const BasicAbilityCreator = ({ isOpen, onClose, onCreateAbility }) => {
  const [activeTab, setActiveTab] = useState('basic');
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'Utility/Utility', // Default icon
    spellType: 'ACTION', // 'ACTION', 'PASSIVE', 'REACTION'
    effectTypes: ['damage'], // Can be multiple
    // Damage fields
    damageFormula: '1d6',
    damageType: 'direct', // 'direct', 'dot', 'area'
    elementType: 'fire',
    hasDotEffect: false,
    dotFormula: '1d4',
    dotDuration: 3,
    dotTickFrequency: 'round',
    areaShape: 'circle',
    areaRadius: 10,
    // Healing fields
    healingFormula: '1d8',
    healingType: 'direct', // 'direct', 'hot', 'shield'
    hasHotEffect: false,
    hotFormula: '1d4',
    hotDuration: 3,
    // Buff/Debuff fields
    statModifier: {
      stat: 'armor',
      magnitude: 2,
      magnitudeType: 'flat'
    },
    durationValue: 1,
    durationType: 'rounds',
    durationUnit: 'rounds',
    // Control fields
    controlEffect: 'push',
    controlDistance: 15,
    saveDC: 14,
    saveType: 'strength',
    // Targeting
    targetingType: 'single', // 'single', 'area', 'ground', 'self'
    rangeType: 'ranged',
    rangeDistance: 30,
    // Resources
    actionPointCost: 1,
    manaCost: 0,
    // Cooldown
    hasCooldown: false,
    cooldownType: 'turn_based',
    cooldownValue: 3,
    // Tags
    tags: []
  });

  const [errors, setErrors] = useState({});
  const [showIconSelector, setShowIconSelector] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleNestedChange = (parent, field, value) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent],
        [field]: field === 'magnitude' ? parseInt(value) || 0 : value
      }
    }));
  };

  const toggleEffectType = (effectType) => {
    setFormData(prev => {
      const effectTypes = [...prev.effectTypes];
      const index = effectTypes.indexOf(effectType);
      if (index > -1) {
        effectTypes.splice(index, 1);
      } else {
        effectTypes.push(effectType);
      }
      return { ...prev, effectTypes };
    });
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Ability name is required';
    }

    if (formData.effectTypes.length === 0) {
      newErrors.effectTypes = 'At least one effect type is required';
    }

    if (formData.effectTypes.includes('damage')) {
      if (!formData.damageFormula.trim()) {
        newErrors.damageFormula = 'Damage formula is required';
      }
    }

    if (formData.effectTypes.includes('healing')) {
      if (!formData.healingFormula.trim()) {
        newErrors.healingFormula = 'Healing formula is required';
      }
    }

    if ((formData.effectTypes.includes('buff') || formData.effectTypes.includes('debuff')) && !formData.statModifier.stat) {
      newErrors.stat = 'Stat modifier is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createAbilityData = () => {
    const baseAbility = {
      id: generateUniqueId(),
      name: formData.name,
      description: formData.description,
      icon: formData.icon || 'inv_misc_questionmark',
      spellType: formData.spellType,
      effectTypes: formData.effectTypes,
      typeConfig: {
        school: formData.elementType || 'fire',
        icon: formData.icon || 'inv_misc_questionmark',
        tags: formData.tags
      },
      targetingConfig: {
        targetingType: formData.targetingType,
        rangeType: formData.rangeType,
        rangeDistance: formData.rangeDistance,
        ...(formData.targetingType === 'area' && {
          aoeShape: formData.areaShape,
          aoeParameters: { radius: formData.areaRadius }
        })
      },
      resourceCost: {
        actionPoints: formData.spellType === 'PASSIVE' ? 0 : formData.actionPointCost,
        resourceTypes: formData.manaCost > 0 ? ['mana'] : [],
        resourceValues: formData.manaCost > 0 ? { mana: formData.manaCost } : {}
      },
      castingConfig: {
        actionPointCost: formData.spellType === 'PASSIVE' ? 0 : formData.actionPointCost,
        castingTime: formData.spellType === 'REACTION' ? 'reaction' : 'action'
      },
      resolution: 'DICE', // Default to DICE resolution for BasicAbilityCreator
      tags: formData.tags
    };

    // Add damage config
    if (formData.effectTypes.includes('damage')) {
      // Ensure damageType is 'direct' for instant damage, not the element type
      const deliveryType = formData.damageType === 'area' ? 'area' : 
                         (formData.hasDotEffect && formData.damageType === 'dot') ? 'dot' : 
                         'direct';
      
      baseAbility.damageConfig = {
        formula: formData.damageFormula,
        damageType: deliveryType, // 'direct', 'dot', or 'area' - delivery method
        elementType: formData.elementType, // 'fire', 'cold', etc. - actual damage type
        ...(formData.hasDotEffect && {
          hasDotEffect: true,
          dotConfig: {
            duration: formData.dotDuration,
            tickFrequency: formData.dotTickFrequency || 'round',
            dotFormula: formData.dotFormula
          }
        }),
        ...(formData.damageType === 'area' && {
          areaShape: formData.areaShape,
          areaParameters: { radius: formData.areaRadius }
        })
      };
      
      // Ensure typeConfig.school matches elementType for proper display
      baseAbility.typeConfig.school = formData.elementType;
    }

    // Add healing config
    if (formData.effectTypes.includes('healing')) {
      baseAbility.healingConfig = {
        formula: formData.healingFormula,
        healingType: formData.healingType || 'direct',
        ...(formData.hasHotEffect && {
          hasHotEffect: true,
          hotFormula: formData.hotFormula,
          hotDuration: formData.hotDuration,
          hotTickType: 'round'
        })
      };
      
      // Set school to 'healing' for healing spells
      if (!baseAbility.typeConfig.school || baseAbility.typeConfig.school === 'fire') {
        baseAbility.typeConfig.school = 'healing';
      }
    }

    // Add buff config
    if (formData.effectTypes.includes('buff')) {
      baseAbility.buffConfig = {
        buffType: 'statEnhancement',
        effects: [{
          id: generateUniqueId(),
          name: `+${formData.statModifier.magnitude} ${formData.statModifier.stat}`,
          description: `Gain +${formData.statModifier.magnitude} ${formData.statModifier.stat} for ${formData.durationValue} ${formData.durationType}`,
          statModifier: formData.statModifier
        }],
        durationValue: formData.durationValue,
        durationType: formData.durationType,
        durationUnit: formData.durationUnit
      };
    }

    // Add debuff config
    if (formData.effectTypes.includes('debuff')) {
      baseAbility.debuffConfig = {
        debuffType: 'statReduction',
        effects: [{
          id: generateUniqueId(),
          name: `-${formData.statModifier.magnitude} ${formData.statModifier.stat}`,
          description: `Lose ${formData.statModifier.magnitude} ${formData.statModifier.stat} for ${formData.durationValue} ${formData.durationType}`,
          statModifier: {
            ...formData.statModifier,
            magnitude: -Math.abs(formData.statModifier.magnitude)
          }
        }],
        durationValue: formData.durationValue,
        durationType: formData.durationType,
        durationUnit: formData.durationUnit,
        saveDC: formData.saveDC,
        saveType: formData.saveType,
        saveOutcome: 'negates'
      };
    }

    // Add control config
    if (formData.effectTypes.includes('control')) {
      // Map control effects to control types
      const controlTypeMap = {
        'push': 'forcedMovement',
        'pull': 'forcedMovement',
        'stun': 'incapacitation',
        'slow': 'restraint'
      };
      
      const mappedControlType = controlTypeMap[formData.controlEffect] || 'forcedMovement';
      
      baseAbility.controlConfig = {
        controlType: mappedControlType,
        duration: mappedControlType === 'forcedMovement' ? 0 : formData.durationValue,
        durationUnit: mappedControlType === 'forcedMovement' ? 'instant' : formData.durationType,
        saveDC: formData.saveDC,
        saveType: formData.saveType,
        savingThrow: true,
        effects: [{
          id: formData.controlEffect,
          name: formData.controlEffect.charAt(0).toUpperCase() + formData.controlEffect.slice(1),
          description: `${formData.controlEffect === 'push' ? 'Pushes' : formData.controlEffect === 'pull' ? 'Pulls' : formData.controlEffect === 'stun' ? 'Stuns' : 'Slows'} target${formData.controlEffect === 'push' || formData.controlEffect === 'pull' ? ` ${formData.controlDistance} feet` : ''}`,
          config: formData.controlEffect === 'push' || formData.controlEffect === 'pull' ? {
            movementType: formData.controlEffect,
            distance: formData.controlDistance
          } : {}
        }]
      };
    }

    // Add cooldown config
    if (formData.hasCooldown) {
      baseAbility.cooldownConfig = {
        type: formData.cooldownType,
        value: formData.cooldownValue
      };
    }

    // UnifiedSpellCard uses config objects directly (damageConfig, healingConfig, etc.)
    // The effects array is not needed for UnifiedSpellCard, but we keep it for legacy support
    // The config objects above are what UnifiedSpellCard actually reads

    return baseAbility;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const abilityData = createAbilityData();
    onCreateAbility(abilityData);
    handleClose();
  };

  const handleClose = () => {
    // Reset form when closing
    setFormData({
      name: '',
      description: '',
      icon: 'inv_misc_questionmark',
      spellType: 'ACTION',
      effectTypes: ['damage'],
      damageFormula: '1d6',
      damageType: 'direct',
      elementType: 'fire',
      hasDotEffect: false,
      dotFormula: '1d4',
      dotDuration: 3,
      dotTickFrequency: 'round',
      areaShape: 'circle',
      areaRadius: 10,
      healingFormula: '1d8',
      healingType: 'direct',
      hasHotEffect: false,
      hotFormula: '1d4',
      hotDuration: 3,
      statModifier: {
        stat: 'armor',
        magnitude: 2,
        magnitudeType: 'flat'
      },
      durationValue: 1,
      durationType: 'rounds',
      durationUnit: 'rounds',
      controlEffect: 'push',
      controlDistance: 15,
      saveDC: 14,
      saveType: 'strength',
      targetingType: 'single',
      rangeType: 'ranged',
      rangeDistance: 30,
      actionPointCost: 1,
      manaCost: 0,
      hasCooldown: false,
      cooldownType: 'turn_based',
      cooldownValue: 3,
      tags: []
    });
    setErrors({});
    setActiveTab('basic');
    onClose();
  };

  if (!isOpen) return null;

  const damageTypes = ['fire', 'frost', 'lightning', 'arcane', 'nature', 'poison', 'necrotic', 'radiant', 'psychic', 'chaos', 'void', 'bludgeoning', 'piercing', 'slashing'];
  const stats = ['strength', 'agility', 'constitution', 'intelligence', 'spirit', 'charisma', 'armor', 'speed', 'maxHp', 'criticalChance'];

  return (
    <div className="basic-ability-creator-overlay pf-modal-backdrop">
      <div className="basic-ability-creator-modal pf-modal-content pf-texture-parchment">
        <div className="basic-ability-creator-header pf-modal-header">
          <h2 className="pf-modal-title">Create Spell/Ability</h2>
          <button type="button" className="pf-close-button" onClick={handleClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="basic-ability-creator-form">
          {/* Tabs */}
          <div className="pf-tabs">
            <button type="button" className={`pf-tab ${activeTab === 'basic' ? 'active' : ''}`} onClick={() => setActiveTab('basic')}>
              Basic Info
            </button>
            <button type="button" className={`pf-tab ${activeTab === 'effects' ? 'active' : ''}`} onClick={() => setActiveTab('effects')}>
              Effects
            </button>
            <button type="button" className={`pf-tab ${activeTab === 'targeting' ? 'active' : ''}`} onClick={() => setActiveTab('targeting')}>
              Targeting
            </button>
            <button type="button" className={`pf-tab ${activeTab === 'resources' ? 'active' : ''}`} onClick={() => setActiveTab('resources')}>
              Resources
            </button>
          </div>

          {/* Tab Content Container */}
          <div className="pf-tab-content-wrapper">
            {/* Basic Info Tab */}
            <div className={`pf-tab-content ${activeTab !== 'basic' ? 'hidden' : ''}`}>
              <div className="pf-form-group">
                <label htmlFor="ability-name">Name *</label>
                <input
                  id="ability-name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="Enter ability name"
                  className={`pf-input ${errors.name ? 'error' : ''}`}
                />
                {errors.name && <span className="pf-error-message">{errors.name}</span>}
              </div>

              <div className="pf-form-group">
                <label htmlFor="ability-description">Description</label>
                <textarea
                  id="ability-description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe what this ability does"
                  rows={3}
                  className="pf-textarea"
                />
              </div>

              <div className="pf-form-group">
                <label>Icon</label>
                <div className="icon-selector-wrapper">
                  <button
                    type="button"
                    className="icon-selector-button"
                    onClick={(e) => {
                      e.preventDefault();
                      setShowIconSelector(true);
                    }}
                  >
                    <img
                      src={getIconUrl(formData.icon || 'Utility/Utility', 'abilities')}
                      alt="Selected icon"
                      className="icon-selector-preview"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getIconUrl('Utility/Utility', 'abilities');
                      }}
                    />
                    <span className="icon-selector-label">
                      {formData.icon === 'Utility/Utility' ? 'Select Icon' : 'Change Icon'}
                    </span>
                  </button>
                </div>
              </div>

              <div className="pf-form-row">
                <div className="pf-form-group">
                  <label htmlFor="spell-type">Spell Type</label>
                  <select
                    id="spell-type"
                    value={formData.spellType}
                    onChange={(e) => handleInputChange('spellType', e.target.value)}
                    className="pf-select"
                  >
                    <option value="ACTION">Action</option>
                    <option value="PASSIVE">Passive</option>
                    <option value="REACTION">Reaction</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Effects Tab */}
            <div className={`pf-tab-content ${activeTab !== 'effects' ? 'hidden' : ''}`}>
              <div className="pf-form-group">
                <label>Effect Types *</label>
                <div className="pf-checkbox-group">
                  {['damage', 'healing', 'buff', 'debuff', 'control'].map(type => (
                    <label key={type} className="pf-checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.effectTypes.includes(type)}
                        onChange={() => toggleEffectType(type)}
                        className="pf-checkbox"
                      />
                      <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                    </label>
                  ))}
                </div>
                {errors.effectTypes && <span className="pf-error-message">{errors.effectTypes}</span>}
              </div>

              {/* Damage Configuration */}
              {formData.effectTypes.includes('damage') && (
                <div className="pf-form-section">
                  <h3>Damage Configuration</h3>
                  <div className="pf-form-row">
                    <div className="pf-form-group">
                      <label htmlFor="damage-formula">Damage Formula *</label>
                      <input
                        id="damage-formula"
                        type="text"
                        value={formData.damageFormula}
                        onChange={(e) => handleInputChange('damageFormula', e.target.value)}
                        placeholder="e.g., 2d6 + 3"
                        className={`pf-input ${errors.damageFormula ? 'error' : ''}`}
                      />
                      {errors.damageFormula && <span className="pf-error-message">{errors.damageFormula}</span>}
                    </div>
                    <div className="pf-form-group">
                      <label htmlFor="element-type">Element Type</label>
                      <select
                        id="element-type"
                        value={formData.elementType}
                        onChange={(e) => handleInputChange('elementType', e.target.value)}
                        className="pf-select"
                      >
                        {damageTypes.map(type => (
                          <option key={type} value={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="pf-form-row">
                    <div className="pf-form-group">
                      <label htmlFor="damage-type">Damage Type</label>
                      <select
                        id="damage-type"
                        value={formData.damageType}
                        onChange={(e) => handleInputChange('damageType', e.target.value)}
                        className="pf-select"
                      >
                        <option value="direct">Direct</option>
                        <option value="dot">Damage Over Time</option>
                        <option value="area">Area</option>
                      </select>
                    </div>
                  </div>
                  {formData.damageType === 'dot' && (
                    <div className="pf-form-row">
                      <div className="pf-form-group">
                        <label htmlFor="dot-formula">DoT Formula</label>
                        <input
                          id="dot-formula"
                          type="text"
                          value={formData.dotFormula}
                          onChange={(e) => handleInputChange('dotFormula', e.target.value)}
                          placeholder="e.g., 1d4"
                          className="pf-input"
                        />
                      </div>
                      <div className="pf-form-group">
                        <label htmlFor="dot-duration">DoT Duration (rounds)</label>
                        <input
                          id="dot-duration"
                          type="number"
                          min="1"
                          value={formData.dotDuration}
                          onChange={(e) => handleInputChange('dotDuration', parseInt(e.target.value) || 1)}
                          className="pf-input"
                        />
                      </div>
                    </div>
                  )}
                  {formData.damageType === 'area' && (
                    <div className="pf-form-row">
                      <div className="pf-form-group">
                        <label htmlFor="area-shape">Area Shape</label>
                        <select
                          id="area-shape"
                          value={formData.areaShape}
                          onChange={(e) => handleInputChange('areaShape', e.target.value)}
                          className="pf-select"
                        >
                          <option value="circle">Circle</option>
                          <option value="square">Square</option>
                          <option value="cone">Cone</option>
                          <option value="line">Line</option>
                        </select>
                      </div>
                      <div className="pf-form-group">
                        <label htmlFor="area-radius">Radius/Size (ft)</label>
                        <input
                          id="area-radius"
                          type="number"
                          min="1"
                          value={formData.areaRadius}
                          onChange={(e) => handleInputChange('areaRadius', parseInt(e.target.value) || 10)}
                          className="pf-input"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Healing Configuration */}
              {formData.effectTypes.includes('healing') && (
                <div className="pf-form-section">
                  <h3>Healing Configuration</h3>
                  <div className="pf-form-row">
                    <div className="pf-form-group">
                      <label htmlFor="healing-formula">Healing Formula *</label>
                      <input
                        id="healing-formula"
                        type="text"
                        value={formData.healingFormula}
                        onChange={(e) => handleInputChange('healingFormula', e.target.value)}
                        placeholder="e.g., 2d8 + 5"
                        className={`pf-input ${errors.healingFormula ? 'error' : ''}`}
                      />
                      {errors.healingFormula && <span className="pf-error-message">{errors.healingFormula}</span>}
                    </div>
                  </div>
                  <div className="pf-form-group">
                    <label className="pf-checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.hasHotEffect}
                        onChange={(e) => handleInputChange('hasHotEffect', e.target.checked)}
                        className="pf-checkbox"
                      />
                      <span>Has Healing Over Time</span>
                    </label>
                  </div>
                  {formData.hasHotEffect && (
                    <div className="pf-form-row">
                      <div className="pf-form-group">
                        <label htmlFor="hot-formula">HoT Formula</label>
                        <input
                          id="hot-formula"
                          type="text"
                          value={formData.hotFormula}
                          onChange={(e) => handleInputChange('hotFormula', e.target.value)}
                          placeholder="e.g., 1d4"
                          className="pf-input"
                        />
                      </div>
                      <div className="pf-form-group">
                        <label htmlFor="hot-duration">HoT Duration (rounds)</label>
                        <input
                          id="hot-duration"
                          type="number"
                          min="1"
                          value={formData.hotDuration}
                          onChange={(e) => handleInputChange('hotDuration', parseInt(e.target.value) || 1)}
                          className="pf-input"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Buff/Debuff Configuration */}
              {(formData.effectTypes.includes('buff') || formData.effectTypes.includes('debuff')) && (
                <div className="pf-form-section">
                  <h3>{formData.effectTypes.includes('buff') ? 'Buff' : 'Debuff'} Configuration</h3>
                  <div className="pf-form-row">
                    <div className="pf-form-group">
                      <label htmlFor="stat">Stat *</label>
                      <select
                        id="stat"
                        value={formData.statModifier.stat}
                        onChange={(e) => handleNestedChange('statModifier', 'stat', e.target.value)}
                        className={`pf-select ${errors.stat ? 'error' : ''}`}
                      >
                        {stats.map(stat => (
                          <option key={stat} value={stat}>{stat.charAt(0).toUpperCase() + stat.slice(1)}</option>
                        ))}
                      </select>
                      {errors.stat && <span className="pf-error-message">{errors.stat}</span>}
                    </div>
                    <div className="pf-form-group">
                      <label htmlFor="magnitude">Magnitude</label>
                      <input
                        id="magnitude"
                        type="number"
                        value={formData.statModifier.magnitude}
                        onChange={(e) => handleNestedChange('statModifier', 'magnitude', e.target.value)}
                        className="pf-input"
                      />
                    </div>
                    <div className="pf-form-group">
                      <label htmlFor="magnitude-type">Type</label>
                      <select
                        id="magnitude-type"
                        value={formData.statModifier.magnitudeType}
                        onChange={(e) => handleNestedChange('statModifier', 'magnitudeType', e.target.value)}
                        className="pf-select"
                      >
                        <option value="flat">Flat</option>
                        <option value="percentage">Percentage</option>
                      </select>
                    </div>
                  </div>
                  <div className="pf-form-row">
                    <div className="pf-form-group">
                      <label htmlFor="duration">Duration</label>
                      <input
                        id="duration"
                        type="number"
                        min="1"
                        value={formData.durationValue}
                        onChange={(e) => handleInputChange('durationValue', parseInt(e.target.value) || 1)}
                        className="pf-input"
                      />
                    </div>
                    <div className="pf-form-group">
                      <label htmlFor="duration-type">Duration Type</label>
                      <select
                        id="duration-type"
                        value={formData.durationType}
                        onChange={(e) => {
                          handleInputChange('durationType', e.target.value);
                          handleInputChange('durationUnit', e.target.value);
                        }}
                        className="pf-select"
                      >
                        <option value="rounds">Rounds</option>
                        <option value="minutes">Minutes</option>
                        <option value="hours">Hours</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Control Configuration */}
              {formData.effectTypes.includes('control') && (
                <div className="pf-form-section">
                  <h3>Control Configuration</h3>
                  <div className="pf-form-row">
                    <div className="pf-form-group">
                      <label htmlFor="control-effect">Control Effect</label>
                      <select
                        id="control-effect"
                        value={formData.controlEffect}
                        onChange={(e) => handleInputChange('controlEffect', e.target.value)}
                        className="pf-select"
                      >
                        <option value="push">Push</option>
                        <option value="pull">Pull</option>
                        <option value="stun">Stun</option>
                        <option value="slow">Slow</option>
                      </select>
                    </div>
                    <div className="pf-form-group">
                      <label htmlFor="control-distance">Distance (ft)</label>
                      <input
                        id="control-distance"
                        type="number"
                        min="1"
                        value={formData.controlDistance}
                        onChange={(e) => handleInputChange('controlDistance', parseInt(e.target.value) || 15)}
                        className="pf-input"
                      />
                    </div>
                  </div>
                  <div className="pf-form-row">
                    <div className="pf-form-group">
                      <label htmlFor="save-dc">Save DC</label>
                      <input
                        id="save-dc"
                        type="number"
                        min="5"
                        max="30"
                        value={formData.saveDC}
                        onChange={(e) => handleInputChange('saveDC', parseInt(e.target.value) || 14)}
                        className="pf-input"
                      />
                    </div>
                    <div className="pf-form-group">
                      <label htmlFor="save-type">Save Type</label>
                      <select
                        id="save-type"
                        value={formData.saveType}
                        onChange={(e) => handleInputChange('saveType', e.target.value)}
                        className="pf-select"
                      >
                        <option value="strength">Strength</option>
                        <option value="agility">Agility</option>
                        <option value="constitution">Constitution</option>
                        <option value="intelligence">Intelligence</option>
                        <option value="spirit">Spirit</option>
                        <option value="charisma">Charisma</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Targeting Tab */}
            <div className={`pf-tab-content ${activeTab !== 'targeting' ? 'hidden' : ''}`}>
              <div className="pf-form-row">
                <div className="pf-form-group">
                  <label htmlFor="targeting-type">Targeting Type</label>
                  <select
                    id="targeting-type"
                    value={formData.targetingType}
                    onChange={(e) => handleInputChange('targetingType', e.target.value)}
                    className="pf-select"
                  >
                    <option value="self">Self</option>
                    <option value="single">Single Target</option>
                    <option value="area">Area</option>
                    <option value="ground">Ground Target</option>
                  </select>
                </div>
                <div className="pf-form-group">
                  <label htmlFor="range-type">Range Type</label>
                  <select
                    id="range-type"
                    value={formData.rangeType}
                    onChange={(e) => handleInputChange('rangeType', e.target.value)}
                    className="pf-select"
                  >
                    <option value="touch">Touch</option>
                    <option value="ranged">Ranged</option>
                    <option value="sight">Sight</option>
                    <option value="unlimited">Unlimited</option>
                  </select>
                </div>
                {formData.rangeType === 'ranged' && (
                  <div className="pf-form-group">
                    <label htmlFor="range-distance">Range Distance (ft)</label>
                    <input
                      id="range-distance"
                      type="number"
                      min="0"
                      value={formData.rangeDistance}
                      onChange={(e) => handleInputChange('rangeDistance', parseInt(e.target.value) || 30)}
                      className="pf-input"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Resources Tab */}
            <div className={`pf-tab-content ${activeTab !== 'resources' ? 'hidden' : ''}`}>
              {formData.spellType !== 'PASSIVE' && (
                <div className="pf-form-row">
                  <div className="pf-form-group">
                    <label htmlFor="action-points">Action Point Cost</label>
                    <input
                      id="action-points"
                      type="number"
                      min="0"
                      max="10"
                      value={formData.actionPointCost}
                      onChange={(e) => handleInputChange('actionPointCost', parseInt(e.target.value) || 0)}
                      className="pf-input"
                    />
                  </div>
                  <div className="pf-form-group">
                    <label htmlFor="mana-cost">Mana Cost</label>
                    <input
                      id="mana-cost"
                      type="number"
                      min="0"
                      value={formData.manaCost}
                      onChange={(e) => handleInputChange('manaCost', parseInt(e.target.value) || 0)}
                      className="pf-input"
                    />
                  </div>
                </div>
              )}
              <div className="pf-form-group">
                <label className="pf-checkbox-label">
                  <input
                    type="checkbox"
                    checked={formData.hasCooldown}
                    onChange={(e) => handleInputChange('hasCooldown', e.target.checked)}
                    className="pf-checkbox"
                  />
                  <span>Has Cooldown</span>
                </label>
              </div>
              {formData.hasCooldown && (
                <div className="pf-form-row">
                  <div className="pf-form-group">
                    <label htmlFor="cooldown-type">Cooldown Type</label>
                    <select
                      id="cooldown-type"
                      value={formData.cooldownType}
                      onChange={(e) => handleInputChange('cooldownType', e.target.value)}
                      className="pf-select"
                    >
                      <option value="turn_based">Turn Based</option>
                      <option value="short_rest">Short Rest</option>
                      <option value="long_rest">Long Rest</option>
                    </select>
                  </div>
                  <div className="pf-form-group">
                    <label htmlFor="cooldown-value">Cooldown Value</label>
                    <input
                      id="cooldown-value"
                      type="number"
                      min="1"
                      value={formData.cooldownValue}
                      onChange={(e) => handleInputChange('cooldownValue', parseInt(e.target.value) || 3)}
                      className="pf-input"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form Actions */}
          <div className="pf-form-actions">
            <button type="button" className="pf-button pf-button-secondary" onClick={handleClose}>
              Cancel
            </button>
            <button type="submit" className="pf-button pf-button-primary">
              Create Ability
            </button>
          </div>
        </form>

        {/* Icon Selector Modal */}
        {showIconSelector && (
          <IconSelector
            currentIcon={formData.icon}
            onSelect={(iconId) => {
              handleInputChange('icon', iconId);
              setShowIconSelector(false);
            }}
            onClose={() => setShowIconSelector(false)}
          />
        )}
      </div>
    </div>
  );
};

export default BasicAbilityCreator;