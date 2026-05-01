import React, { useState } from 'react';
import { createPortal } from 'react-dom';
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
      setActiveTab('basic');
    }

    if (formData.effectTypes.length === 0) {
      newErrors.effectTypes = 'At least one effect type is required';
      setActiveTab('effects');
    }

    if (formData.effectTypes.includes('damage')) {
      if (!formData.damageFormula.trim()) {
        newErrors.damageFormula = 'Damage formula is required';
        setActiveTab('effects');
      }
    }

    if (formData.effectTypes.includes('healing')) {
      if (!formData.healingFormula.trim()) {
        newErrors.healingFormula = 'Healing formula is required';
        setActiveTab('effects');
      }
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
      resolution: 'DICE',
      tags: formData.tags
    };

    if (formData.effectTypes.includes('damage')) {
      const deliveryType = formData.damageType === 'area' ? 'area' : 
                         (formData.hasDotEffect && formData.damageType === 'dot') ? 'dot' : 
                         'direct';
      
      baseAbility.damageConfig = {
        formula: formData.damageFormula,
        damageType: deliveryType,
        elementType: formData.elementType,
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
      baseAbility.typeConfig.school = formData.elementType;
    }

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
      if (!baseAbility.typeConfig.school || baseAbility.typeConfig.school === 'fire') {
        baseAbility.typeConfig.school = 'healing';
      }
    }

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

    if (formData.effectTypes.includes('control')) {
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

    if (formData.hasCooldown) {
      baseAbility.cooldownConfig = {
        type: formData.cooldownType,
        value: formData.cooldownValue
      };
    }

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
    setFormData({
      name: '',
      description: '',
      icon: 'Utility/Utility',
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

  return createPortal(
    <div className="basic-ability-creator-overlay">
      <div className="basic-ability-creator-modal">
        <div className="basic-ability-creator-header">
          <h2><i className="fas fa-magic"></i> Create Spell/Ability</h2>
          <button type="button" className="pf-close-button" onClick={handleClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="basic-ability-creator-form">
          <div className="ability-creator-main-body">
            <div className="ability-sidebar-tabs">
              <button type="button" className={`pf-tab ${activeTab === 'basic' ? 'active' : ''}`} onClick={() => setActiveTab('basic')}>
                <i className="fas fa-info-circle"></i> Basic
              </button>
              <button type="button" className={`pf-tab ${activeTab === 'effects' ? 'active' : ''}`} onClick={() => setActiveTab('effects')}>
                <i className="fas fa-fire"></i> Effects
              </button>
              <button type="button" className={`pf-tab ${activeTab === 'targeting' ? 'active' : ''}`} onClick={() => setActiveTab('targeting')}>
                <i className="fas fa-crosshairs"></i> Target
              </button>
              <button type="button" className={`pf-tab ${activeTab === 'resources' ? 'active' : ''}`} onClick={() => setActiveTab('resources')}>
                <i className="fas fa-flask"></i> Costs
              </button>
            </div>

            <div className="pf-tab-content-wrapper">
              {/* Basic Info Tab */}
              <div className={`pf-tab-content ${activeTab !== 'basic' ? 'hidden' : ''}`}>
                <div className="pf-form-section">
                  <h3><i className="fas fa-id-card"></i> Identity</h3>
                  <div className="pf-form-group">
                    <label htmlFor="ability-name">Name *</label>
                    <input
                      id="ability-name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="E.g. Fireball, Cleave, Mend..."
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
                      placeholder="Describe the cinematic and mechanical effects..."
                      rows={4}
                      className="pf-textarea"
                    />
                  </div>
                </div>

                <div className="pf-form-row">
                  <div className="pf-form-group">
                    <label>Appearance</label>
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
                        />
                        <span className="icon-selector-label">
                          {formData.icon === 'Utility/Utility' ? 'Select Icon' : 'Change Icon'}
                        </span>
                      </button>
                    </div>
                  </div>
                  <div className="pf-form-group">
                    <label htmlFor="spell-type">Activation Type</label>
                    <select
                      id="spell-type"
                      value={formData.spellType}
                      onChange={(e) => handleInputChange('spellType', e.target.value)}
                      className="pf-select"
                    >
                      <option value="ACTION">Standard Action</option>
                      <option value="PASSIVE">Passive Ability</option>
                      <option value="REACTION">Combat Reaction</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Effects Tab */}
              <div className={`pf-tab-content ${activeTab !== 'effects' ? 'hidden' : ''}`}>
                <div className="pf-form-section">
                  <h3><i className="fas fa-layer-group"></i> Effect Selection</h3>
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
                </div>

                {formData.effectTypes.includes('damage') && (
                  <div className="pf-form-section">
                    <h3><i className="fas fa-bolt"></i> Damage</h3>
                    <div className="pf-form-row">
                      <div className="pf-form-group">
                        <label htmlFor="damage-formula">Formula *</label>
                        <input
                          id="damage-formula"
                          type="text"
                          value={formData.damageFormula}
                          onChange={(e) => handleInputChange('damageFormula', e.target.value)}
                          placeholder="2d6 + 3"
                          className={`pf-input ${errors.damageFormula ? 'error' : ''}`}
                        />
                      </div>
                      <div className="pf-form-group">
                        <label htmlFor="element-type">Element</label>
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
                        <label htmlFor="damage-type">Delivery</label>
                        <select
                          id="damage-type"
                          value={formData.damageType}
                          onChange={(e) => handleInputChange('damageType', e.target.value)}
                          className="pf-select"
                        >
                          <option value="direct">Direct Impact</option>
                          <option value="dot">Damage Over Time</option>
                          <option value="area">Area of Effect</option>
                        </select>
                      </div>
                      {formData.damageType === 'dot' && (
                        <div className="pf-form-group">
                          <label>DOT Duration (Rounds)</label>
                          <input
                            type="number"
                            value={formData.dotDuration}
                            onChange={(e) => handleInputChange('dotDuration', parseInt(e.target.value) || 0)}
                            className="pf-input"
                          />
                        </div>
                      )}
                      {formData.damageType === 'area' && (
                        <div className="pf-form-group">
                          <label><i>Radius set in Targeting tab</i></label>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {formData.effectTypes.includes('healing') && (
                  <div className="pf-form-section">
                    <h3><i className="fas fa-heart"></i> Healing</h3>
                    <div className="pf-form-row">
                      <div className="pf-form-group">
                        <label htmlFor="healing-formula">Formula *</label>
                        <input
                          id="healing-formula"
                          type="text"
                          value={formData.healingFormula}
                          onChange={(e) => handleInputChange('healingFormula', e.target.value)}
                          placeholder="2d8 + 5"
                          className={`pf-input ${errors.healingFormula ? 'error' : ''}`}
                        />
                      </div>
                      <div className="pf-form-group">
                        <label>Type</label>
                        <select
                          value={formData.healingType}
                          onChange={(e) => handleInputChange('healingType', e.target.value)}
                          className="pf-select"
                        >
                          <option value="direct">Direct Heal</option>
                          <option value="hot">Heal Over Time</option>
                          <option value="shield">Shield/Absorb</option>
                        </select>
                      </div>
                    </div>
                    {formData.healingType === 'hot' && (
                      <div className="pf-form-group">
                        <label>HOT Duration (Rounds)</label>
                        <input
                          type="number"
                          value={formData.hotDuration}
                          onChange={(e) => handleInputChange('hotDuration', parseInt(e.target.value) || 0)}
                          className="pf-input"
                        />
                      </div>
                    )}
                  </div>
                )}

                {(formData.effectTypes.includes('buff') || formData.effectTypes.includes('debuff')) && (
                  <div className="pf-form-section">
                    <h3><i className="fas fa-chart-line"></i> Modification</h3>
                    <div className="pf-form-row">
                      <div className="pf-form-group">
                        <label>Stat</label>
                        <select
                          value={formData.statModifier.stat}
                          onChange={(e) => handleNestedChange('statModifier', 'stat', e.target.value)}
                          className="pf-select"
                        >
                          {stats.map(stat => (
                            <option key={stat} value={stat}>{stat.charAt(0).toUpperCase() + stat.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                      <div className="pf-form-group">
                        <label>Value</label>
                        <input
                          type="number"
                          value={formData.statModifier.magnitude}
                          onChange={(e) => handleNestedChange('statModifier', 'magnitude', e.target.value)}
                          className="pf-input"
                        />
                      </div>
                    </div>
                    <div className="pf-form-row">
                      <div className="pf-form-group">
                        <label>Duration</label>
                        <input
                          type="number"
                          value={formData.durationValue}
                          onChange={(e) => handleInputChange('durationValue', parseInt(e.target.value) || 0)}
                          className="pf-input"
                        />
                      </div>
                      <div className="pf-form-group">
                        <label>Unit</label>
                        <select
                          value={formData.durationUnit}
                          onChange={(e) => handleInputChange('durationUnit', e.target.value)}
                          className="pf-select"
                        >
                          <option value="rounds">Rounds</option>
                          <option value="minutes">Minutes</option>
                          <option value="hours">Hours</option>
                          <option value="permanent">Permanent</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {formData.effectTypes.includes('control') && (
                  <div className="pf-form-section">
                    <h3><i className="fas fa-hand-rock"></i> Control Effect</h3>
                    <div className="pf-form-row">
                      <div className="pf-form-group">
                        <label>Effect</label>
                        <select
                          value={formData.controlEffect}
                          onChange={(e) => handleInputChange('controlEffect', e.target.value)}
                          className="pf-select"
                        >
                          <option value="push">Push Back</option>
                          <option value="pull">Pull In</option>
                          <option value="stun">Stun</option>
                          <option value="root">Root</option>
                          <option value="fear">Fear</option>
                          <option value="slow">Slow</option>
                        </select>
                      </div>
                      {(formData.controlEffect === 'push' || formData.controlEffect === 'pull') && (
                        <div className="pf-form-group">
                          <label>Distance (ft)</label>
                          <input
                            type="number"
                            value={formData.controlDistance}
                            onChange={(e) => handleInputChange('controlDistance', parseInt(e.target.value) || 0)}
                            className="pf-input"
                          />
                        </div>
                      )}
                    </div>
                    <div className="pf-form-row">
                      <div className="pf-form-group">
                        <label>Save Type</label>
                        <select
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
                      <div className="pf-form-group">
                        <label>Save DC</label>
                        <input
                          type="number"
                          value={formData.saveDC}
                          onChange={(e) => handleInputChange('saveDC', parseInt(e.target.value) || 0)}
                          className="pf-input"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Targeting Tab */}
              <div className={`pf-tab-content ${activeTab !== 'targeting' ? 'hidden' : ''}`}>
                <div className="pf-form-section">
                  <h3><i className="fas fa-bullseye"></i> Targeting Configuration</h3>
                  <div className="pf-form-row">
                    <div className="pf-form-group">
                      <label>Method</label>
                      <select
                        value={formData.targetingType}
                        onChange={(e) => handleInputChange('targetingType', e.target.value)}
                        className="pf-select"
                      >
                        <option value="self">Self Only</option>
                        <option value="single">Single Target</option>
                        <option value="area">Area (Ranged)</option>
                        <option value="burst">Area (Around Self)</option>
                        <option value="ground">Ground Location</option>
                      </select>
                    </div>
                    <div className="pf-form-group">
                      <label>Distance</label>
                      <select
                        value={formData.rangeType}
                        onChange={(e) => handleInputChange('rangeType', e.target.value)}
                        className="pf-select"
                      >
                        <option value="touch">Touch</option>
                        <option value="ranged">Ranged</option>
                        <option value="sight">Sight</option>
                      </select>
                    </div>
                  </div>
                  
                  {(formData.targetingType === 'area' || formData.targetingType === 'burst' || formData.targetingType === 'ground') && (
                    <div className="pf-form-row">
                      <div className="pf-form-group">
                        <label>Area Radius (ft)</label>
                        <input
                          type="number"
                          value={formData.areaRadius}
                          onChange={(e) => handleInputChange('areaRadius', parseInt(e.target.value) || 0)}
                          className="pf-input"
                        />
                      </div>
                      <div className="pf-form-group">
                        <label>Shape</label>
                        <select
                          value={formData.areaShape}
                          onChange={(e) => handleInputChange('areaShape', e.target.value)}
                          className="pf-select"
                        >
                          <option value="circle">Circle/Sphere</option>
                          <option value="cone">Cone</option>
                          <option value="square">Square/Cube</option>
                          <option value="line">Line</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {formData.rangeType === 'ranged' && formData.targetingType !== 'self' && formData.targetingType !== 'burst' && (
                    <div className="pf-form-group">
                      <label>Range (Feet)</label>
                      <input
                        type="number"
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
                <div className="pf-form-section">
                  <h3><i className="fas fa-hourglass-start"></i> Resource Costs</h3>
                  {formData.spellType !== 'PASSIVE' && (
                    <div className="pf-form-row">
                      <div className="pf-form-group">
                        <label>Action Points</label>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          value={formData.actionPointCost}
                          onChange={(e) => handleInputChange('actionPointCost', parseInt(e.target.value) || 0)}
                          className="pf-input"
                        />
                      </div>
                      <div className="pf-form-group">
                        <label>Mana Cost</label>
                        <input
                          type="number"
                          min="0"
                          value={formData.manaCost}
                          onChange={(e) => handleInputChange('manaCost', parseInt(e.target.value) || 0)}
                          className="pf-input"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="pf-form-group" style={{marginTop: '15px'}}>
                     <label className="pf-checkbox-label">
                      <input
                        type="checkbox"
                        checked={formData.hasCooldown}
                        onChange={(e) => handleInputChange('hasCooldown', e.target.checked)}
                        className="pf-checkbox"
                      />
                      <span>Has Recharge Cooldown</span>
                    </label>
                  </div>

                  {formData.hasCooldown && (
                    <div className="pf-form-row">
                      <div className="pf-form-group">
                        <label>Type</label>
                        <select
                          value={formData.cooldownType}
                          onChange={(e) => handleInputChange('cooldownType', e.target.value)}
                          className="pf-select"
                        >
                          <option value="turn_based">Turns</option>
                          <option value="short_rest">Short Rest</option>
                          <option value="long_rest">Long Rest</option>
                        </select>
                      </div>
                      <div className="pf-form-group">
                        <label>Value</label>
                        <input
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
            </div>
          </div>

          <div className="pf-form-actions">
            <button type="button" className="pf-button pf-button-secondary" onClick={handleClose}>
              Discard
            </button>
            <button type="submit" className="pf-button pf-button-primary">
              Create Ability
            </button>
          </div>
        </form>

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
    </div>,
    document.body
  );
};

export default BasicAbilityCreator;