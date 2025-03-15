import React, { useState, useEffect } from 'react';
import { useSpellWizardState, useSpellWizardDispatch, actionCreators } from '../../context/spellWizardContext';
import WizardStep from '../common/WizardStep';
import SelectionCard from '../common/SelectionCard';
import DiceCalculator from '../mechanics/DiceCalculator';
import { EFFECT_TYPES, getEffectTypeById, calculateEffectActionPointCost } from '../../core/data/effectTypes';
import { DAMAGE_TYPES, getDamageTypesByCategory } from '../../core/data/damageTypes';

const Step3Effects = ({ onNext, onPrevious }) => {
  const state = useSpellWizardState();
  const dispatch = useSpellWizardDispatch();
  
  // Local state for UI management
  const [selectedEffectType, setSelectedEffectType] = useState(null);
  const [effectCompatibilityErrors, setEffectCompatibilityErrors] = useState([]);
  
  // Get the wizard flow and step information
  const { currentStep, wizardFlow, spellType, effectTypes } = state;
  const stepIndex = wizardFlow.findIndex(step => step.id === currentStep);
  const totalSteps = wizardFlow.length;
  
  // Effect to initialize selected effect type
  useEffect(() => {
    if (effectTypes.length > 0 && !selectedEffectType) {
      setSelectedEffectType(effectTypes[0]);
    }
  }, [effectTypes, selectedEffectType]);

  // Filter effect types based on spell type compatibility
  const getCompatibleEffectTypes = () => {
    // Define incompatible combinations
    const incompatibleCombinations = {
      'PASSIVE': ['control', 'summoning'], // Passive spells can't control or summon
      'REACTION': ['summoning'], // Reactions can't summon (usually)
    };
    
    const incompatibleForCurrentType = incompatibleCombinations[spellType] || [];
    
    return EFFECT_TYPES.filter(effectType => 
      !incompatibleForCurrentType.includes(effectType.id)
    );
  };
  
  // Check if an effect is properly configured
  const isEffectConfigured = (effectType) => {
    switch (effectType) {
      case 'damage':
        return !!state.damageConfig;
      case 'healing':
        return !!state.healingConfig;
      case 'buff':
        return !!state.buffConfig;
      case 'debuff':
        return !!state.debuffConfig;
      case 'utility':
        return !!state.utilityConfig;
      case 'control':
        return !!state.controlConfig;
      case 'summoning':
        return !!state.summoningConfig;
      case 'transformation':
        return !!state.transformationConfig;
      default:
        return false;
    }
  };
  
  // Check if all selected effects are properly configured
  const areAllEffectsConfigured = () => {
    if (effectTypes.length === 0) return false;
    return effectTypes.every(isEffectConfigured);
  };
  
  // Calculate the total resource cost based on selected effects
  const calculateTotalResourceCost = () => {
    const baseCost = calculateEffectActionPointCost(state.effectTypes);
    
    // Apply modifiers based on spell type
    let finalCost = baseCost;
    if (state.spellType === 'CHANNELED') {
      finalCost = Math.ceil(baseCost * 1.5); // Channeled spells cost more
    } else if (state.spellType === 'PASSIVE') {
      finalCost = Math.ceil(baseCost * 2); // Passive spells cost more
    }
    
    return finalCost;
  };
  
  // Toggle effect type selection
  const toggleEffectType = (effectType) => {
    if (state.effectTypes.includes(effectType)) {
      dispatch(actionCreators.removeEffectType(effectType));
      if (selectedEffectType === effectType && state.effectTypes.length > 1) {
        // Find another effect to select
        const remainingEffects = state.effectTypes.filter(e => e !== effectType);
        setSelectedEffectType(remainingEffects[0]);
      }
    } else {
      dispatch(actionCreators.addEffectType(effectType));
      if (!selectedEffectType) {
        setSelectedEffectType(effectType);
      }
    }
  };
  
  // Handle damage configuration changes
  const handleDamageConfigChange = (config) => {
    dispatch(actionCreators.updateDamageConfig(config));
  };
  
  // Handle healing configuration changes
  const handleHealingConfigChange = (config) => {
    dispatch(actionCreators.updateHealingConfig(config));
  };
  
  // Handle buff configuration changes
  const handleBuffConfigChange = (config) => {
    dispatch(actionCreators.updateBuffConfig(config));
  };
  
  // Handle debuff configuration changes
  const handleDebuffConfigChange = (config) => {
    dispatch(actionCreators.updateDebuffConfig(config));
  };
  
  // Handle utility configuration changes
  const handleUtilityConfigChange = (config) => {
    dispatch(actionCreators.updateUtilityConfig(config));
  };
  
  // Validate effect combinations
  useEffect(() => {
    const errors = [];
    
    // Check for incompatible combinations
    if (state.effectTypes.includes('damage') && state.effectTypes.includes('healing')) {
      // This might be okay for some spell types but not others
      if (state.spellType === 'PASSIVE') {
        errors.push('Passive spells cannot have both damage and healing effects');
      }
    }
    
    // Check for level-appropriate number of effects
    if (state.effectTypes.length > 2) {
      errors.push(`Spells typically have at most 2 effects`);
    }
    
    setEffectCompatibilityErrors(errors);
  }, [state.effectTypes, state.spellType]);
  
  // Update resource cost when effects change
  useEffect(() => {
    const cost = calculateTotalResourceCost();
    dispatch(actionCreators.updateResourceCost({ actionPoints: cost }));
  }, [state.effectTypes, state.spellType]);
  
  // Generate configuration hints based on spell type
  const getConfigurationHints = () => {
    const hints = [];
    
    switch (state.spellType) {
      case 'ACTION':
        hints.push('Action spells favor direct effects like damage or healing.');
        break;
      case 'CHANNELED':
        hints.push('Channeled spells can sustain effects over time, good for control or damage over time.');
        break;
      case 'PASSIVE':
        hints.push('Passive spells provide ongoing benefits or conditional triggers.');
        break;
      case 'REACTION':
        hints.push('Reaction spells are best with protective or counter effects.');
        break;
      default:
        break;
    }
    
    return hints;
  };
  
  // Helper to get default formula based on spell type
  const getDefaultDamageFormula = () => {
    switch (state.spellType) {
      case 'ACTION': return '1d6';
      case 'CHANNELED': return '2d6';
      case 'PASSIVE': return '1d8';
      case 'REACTION': return '1d4';
      default: return '1d6';
    }
  };

  const getDefaultHealingFormula = () => {
    switch (state.spellType) {
      case 'ACTION': return '1d8';
      case 'CHANNELED': return '2d8';
      case 'PASSIVE': return '1d10';
      case 'REACTION': return '1d6';
      default: return '1d8';
    }
  };

  const getDefaultBuffFormula = () => {
    switch (state.spellType) {
      case 'ACTION': return 'minor';
      case 'CHANNELED': return 'moderate';
      case 'PASSIVE': return 'major';
      case 'REACTION': return 'minor';
      default: return 'minor';
    }
  };

  const getDefaultDebuffFormula = () => {
    switch (state.spellType) {
      case 'ACTION': return 'minor';
      case 'CHANNELED': return 'moderate';
      case 'PASSIVE': return 'major';
      case 'REACTION': return 'minor';
      default: return 'minor';
    }
  };

  const getDefaultUtilityFormula = () => {
    switch (state.spellType) {
      case 'ACTION': return 'minor';
      case 'CHANNELED': return 'moderate';
      case 'PASSIVE': return 'major';
      case 'REACTION': return 'minor';
      default: return 'minor';
    }
  };

  // Render damage configuration
  const renderDamageConfig = () => {
    const damageConfig = state.damageConfig || {
      formula: getDefaultDamageFormula(),
      damageTypes: [],
      specialEffects: [],
      scaling: { perLevel: false, formula: '' }
    };
    
    const handleDamageFormulaChange = (formula) => {
      handleDamageConfigChange({
        ...damageConfig,
        formula
      });
    };
    
    const handleDamageTypeChange = (type) => {
      const damageTypes = damageConfig.damageTypes.includes(type)
        ? damageConfig.damageTypes.filter(t => t !== type)
        : [...damageConfig.damageTypes, type];
      
      handleDamageConfigChange({
        ...damageConfig,
        damageTypes
      });
    };
    
    const handleSpecialEffectChange = (effect) => {
      const specialEffects = damageConfig.specialEffects.includes(effect)
        ? damageConfig.specialEffects.filter(e => e !== effect)
        : [...damageConfig.specialEffects, effect];
      
      handleDamageConfigChange({
        ...damageConfig,
        specialEffects
      });
    };
    
    const handleScalingChange = (e) => {
      handleDamageConfigChange({
        ...damageConfig,
        scaling: {
          ...damageConfig.scaling,
          perLevel: e.target.checked
        }
      });
    };
    
    const handleScalingFormulaChange = (formula) => {
      handleDamageConfigChange({
        ...damageConfig,
        scaling: {
          ...damageConfig.scaling,
          formula
        }
      });
    };
    
    // Get damage types by category
    const damageTypesByCategory = getDamageTypesByCategory();
    
    return (
      <div className="effect-config-section">
        <h3>Damage Configuration</h3>
        
        <div className="effect-config-group">
          <label className="effect-config-label">Damage Formula</label>
          <DiceCalculator
            initialFormula={damageConfig.formula}
            onChange={handleDamageFormulaChange}
            showDistribution={true}
            showPresets={true}
            allowAdvanced={true}
            label="Damage Formula"
          />
          <div className="effect-config-help">
            <p>Define the base damage formula for your spell.</p>
            <p>Examples: <code>2d6</code>, <code>1d8+4</code>, <code>floor(3d6/2)</code></p>
          </div>
        </div>
        
        <div className="effect-config-group">
          <label className="effect-config-label">Damage Types</label>
          <div className="damage-types-grid">
            {Object.entries(damageTypesByCategory).map(([category, types]) => (
              <div key={category} className="damage-type-category">
                <h4>{category}</h4>
                <div className="damage-type-options">
                  {types.map(type => (
                    <div
                      key={type.id}
                      className={`damage-type-option ${damageConfig.damageTypes.includes(type.id) ? 'selected' : ''}`}
                      onClick={() => handleDamageTypeChange(type.id)}
                      style={{ borderColor: type.color }}
                    >
                      <div className="damage-type-icon" style={{ backgroundColor: type.color }}>
                        <i className={type.icon}></i>
                      </div>
                      <div className="damage-type-name">{type.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="effect-config-help">
            <p>Select one or more damage types for your spell.</p>
            <p>Multiple damage types will split the damage equally unless specified in the description.</p>
          </div>
        </div>
        
        <div className="effect-config-group">
          <label className="effect-config-label">Special Effects</label>
          <div className="special-effects-options">
            <div
              className={`special-effect-option ${damageConfig.specialEffects.includes('critical') ? 'selected' : ''}`}
              onClick={() => handleSpecialEffectChange('critical')}
            >
              <div className="special-effect-icon">
                <i className="fas fa-bullseye"></i>
              </div>
              <div className="special-effect-details">
                <div className="special-effect-name">Critical Hit</div>
                <div className="special-effect-description">Double damage on critical hits</div>
              </div>
            </div>
            
            <div
              className={`special-effect-option ${damageConfig.specialEffects.includes('penetration') ? 'selected' : ''}`}
              onClick={() => handleSpecialEffectChange('penetration')}
            >
              <div className="special-effect-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <div className="special-effect-details">
                <div className="special-effect-name">Armor Penetration</div>
                <div className="special-effect-description">Ignores a portion of target's resistance</div>
              </div>
            </div>
            
            <div
              className={`special-effect-option ${damageConfig.specialEffects.includes('splash') ? 'selected' : ''}`}
              onClick={() => handleSpecialEffectChange('splash')}
            >
              <div className="special-effect-icon">
                <i className="fas fa-water"></i>
              </div>
              <div className="special-effect-details">
                <div className="special-effect-name">Splash Damage</div>
                <div className="special-effect-description">Deals half damage to nearby targets</div>
              </div>
            </div>
            
            <div
              className={`special-effect-option ${damageConfig.specialEffects.includes('dot') ? 'selected' : ''}`}
              onClick={() => handleSpecialEffectChange('dot')}
            >
              <div className="special-effect-icon">
                <i className="fas fa-hourglass-half"></i>
              </div>
              <div className="special-effect-details">
                <div className="special-effect-name">Damage Over Time</div>
                <div className="special-effect-description">Continues dealing damage for several turns</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="effect-config-group">
          <div className="effect-config-checkbox">
            <label>
              <input
                type="checkbox"
                checked={damageConfig.scaling.perLevel}
                onChange={handleScalingChange}
              />
              Scales with Spell Type
            </label>
          </div>
          
          {damageConfig.scaling.perLevel && (
            <div className="scaling-formula">
              <label className="effect-config-label">Scaling Formula</label>
              <DiceCalculator
                initialFormula={damageConfig.scaling.formula || '+1d6'}
                onChange={handleScalingFormulaChange}
                showDistribution={false}
                showPresets={false}
                allowAdvanced={true}
                label="Scaling Formula"
              />
              <div className="effect-config-help">
                <p>Define how the damage scales with spell type.</p>
                <p>Examples: <code>+1d6</code>, <code>*1.5</code>, <code>+floor(level/2)d4</code></p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Render healing configuration
  const renderHealingConfig = () => {
    const healingConfig = state.healingConfig || {
      formula: getDefaultHealingFormula(),
      healingType: 'standard',
      overhealing: false,
      specialEffects: [],
      scaling: { perLevel: false, formula: '' }
    };
    
    const handleHealingFormulaChange = (formula) => {
      handleHealingConfigChange({
        ...healingConfig,
        formula
      });
    };
    
    const handleHealingTypeChange = (e) => {
      handleHealingConfigChange({
        ...healingConfig,
        healingType: e.target.value
      });
    };
    
    const handleOverhealingChange = (e) => {
      handleHealingConfigChange({
        ...healingConfig,
        overhealing: e.target.checked
      });
    };
    
    const handleSpecialEffectChange = (effect) => {
      const specialEffects = healingConfig.specialEffects.includes(effect)
        ? healingConfig.specialEffects.filter(e => e !== effect)
        : [...healingConfig.specialEffects, effect];
      
      handleHealingConfigChange({
        ...healingConfig,
        specialEffects
      });
    };
    
    const handleScalingChange = (e) => {
      handleHealingConfigChange({
        ...healingConfig,
        scaling: {
          ...healingConfig.scaling,
          perLevel: e.target.checked
        }
      });
    };
    
    const handleScalingFormulaChange = (formula) => {
      handleHealingConfigChange({
        ...healingConfig,
        scaling: {
          ...healingConfig.scaling,
          formula
        }
      });
    };
    
    const healingTypes = [
      { id: 'standard', name: 'Standard Healing', description: 'Restores health points' },
      { id: 'regeneration', name: 'Regeneration', description: 'Healing over time' },
      { id: 'lifesteal', name: 'Life Steal', description: 'Convert damage to healing' },
      { id: 'barrier', name: 'Barrier', description: 'Temporary health points' }
    ];
    
    return (
      <div className="effect-config-section">
        <h3>Healing Configuration</h3>
        
        <div className="effect-config-group">
          <label className="effect-config-label">Healing Formula</label>
          <DiceCalculator
            initialFormula={healingConfig.formula}
            onChange={handleHealingFormulaChange}
            showDistribution={true}
            showPresets={true}
            allowAdvanced={true}
            label="Healing Formula"
          />
          <div className="effect-config-help">
            <p>Define the base healing formula for your spell.</p>
            <p>Examples: <code>2d8</code>, <code>1d10+4</code>, <code>max(2d6, 8)</code></p>
          </div>
        </div>
        
        <div className="effect-config-group">
          <label className="effect-config-label">Healing Type</label>
          <div className="healing-types-options">
            {healingTypes.map(type => (
              <div key={type.id} className="healing-type-option">
                <label>
                  <input
                    type="radio"
                    name="healingType"
                    value={type.id}
                    checked={healingConfig.healingType === type.id}
                    onChange={handleHealingTypeChange}
                  />
                  <span className="healing-type-name">{type.name}</span>
                  <span className="healing-type-description">{type.description}</span>
                </label>
              </div>
            ))}
          </div>
        </div>
        
        <div className="effect-config-group">
          <div className="effect-config-checkbox">
            <label>
              <input
                type="checkbox"
                checked={healingConfig.overhealing}
                onChange={handleOverhealingChange}
              />
              Allow Overhealing
            </label>
            <div className="effect-config-help">
              <p>If checked, healing can exceed maximum health as temporary health.</p>
            </div>
          </div>
        </div>
        
        <div className="effect-config-group">
          <label className="effect-config-label">Special Effects</label>
          <div className="special-effects-options">
            <div
              className={`special-effect-option ${healingConfig.specialEffects.includes('cleanse') ? 'selected' : ''}`}
              onClick={() => handleSpecialEffectChange('cleanse')}
            >
              <div className="special-effect-icon">
                <i className="fas fa-wind"></i>
              </div>
              <div className="special-effect-details">
                <div className="special-effect-name">Cleanse</div>
                <div className="special-effect-description">Removes negative status effects</div>
              </div>
            </div>
            
            <div
              className={`special-effect-option ${healingConfig.specialEffects.includes('revive') ? 'selected' : ''}`}
              onClick={() => handleSpecialEffectChange('revive')}
            >
              <div className="special-effect-icon">
                <i className="fas fa-heartbeat"></i>
              </div>
              <div className="special-effect-details">
                <div className="special-effect-name">Revive</div>
                <div className="special-effect-description">Can heal downed targets</div>
              </div>
            </div>
            
            <div
              className={`special-effect-option ${healingConfig.specialEffects.includes('burst') ? 'selected' : ''}`}
              onClick={() => handleSpecialEffectChange('burst')}
            >
              <div className="special-effect-icon">
                <i className="fas fa-sun"></i>
              </div>
              <div className="special-effect-details">
                <div className="special-effect-name">Healing Burst</div>
                <div className="special-effect-description">Affects multiple targets</div>
              </div>
            </div>
            
            <div
              className={`special-effect-option ${healingConfig.specialEffects.includes('critical') ? 'selected' : ''}`}
              onClick={() => handleSpecialEffectChange('critical')}
            >
              <div className="special-effect-icon">
                <i className="fas fa-plus-circle"></i>
              </div>
              <div className="special-effect-details">
                <div className="special-effect-name">Critical Healing</div>
                <div className="special-effect-description">Can critically heal for extra effect</div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="effect-config-group">
          <div className="effect-config-checkbox">
            <label>
              <input
                type="checkbox"
                checked={healingConfig.scaling.perLevel}
                onChange={handleScalingChange}
              />
              Scales with Spell Type
            </label>
          </div>
          
          {healingConfig.scaling.perLevel && (
            <div className="scaling-formula">
              <label className="effect-config-label">Scaling Formula</label>
              <DiceCalculator
                initialFormula={healingConfig.scaling.formula || '+1d8'}
                onChange={handleScalingFormulaChange}
                showDistribution={false}
                showPresets={false}
                allowAdvanced={true}
                label="Scaling Formula"
              />
              <div className="effect-config-help">
                <p>Define how the healing scales with spell type.</p>
                <p>Examples: <code>+1d8</code>, <code>*1.5</code>, <code>+ceil(power/2)d6</code></p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  // Render buff configuration
  const renderBuffConfig = () => {
    const buffConfig = state.buffConfig || {
      stats: [],
      magnitude: getDefaultBuffFormula(),
      duration: 'short',
      specialEffects: []
    };

    const handleBuffChange = (field, value) => {
      handleBuffConfigChange({
        ...buffConfig,
        [field]: value
      });
    };

    const toggleStat = (stat) => {
      const stats = buffConfig.stats.includes(stat)
        ? buffConfig.stats.filter(s => s !== stat)
        : [...buffConfig.stats, stat];
      
      handleBuffChange('stats', stats);
    };

    const toggleSpecialEffect = (effectId) => {
      const specialEffects = buffConfig.specialEffects.includes(effectId)
        ? buffConfig.specialEffects.filter(id => id !== effectId)
        : [...buffConfig.specialEffects, effectId];
      
      handleBuffChange('specialEffects', specialEffects);
    };

    const stats = [
      { id: 'strength', name: 'Strength', description: 'Physical power and carrying capacity' },
      { id: 'dexterity', name: 'Dexterity', description: 'Agility, reflexes, and balance' },
      { id: 'constitution', name: 'Constitution', description: 'Health, stamina, and vital force' },
      { id: 'intelligence', name: 'Intelligence', description: 'Mental acuity, information recall, analytical skill' },
      { id: 'wisdom', name: 'Wisdom', description: 'Awareness, intuition, and insight' },
      { id: 'charisma', name: 'Charisma', description: 'Force of personality, persuasiveness' },
      { id: 'speed', name: 'Speed', description: 'Movement speed and initiative' },
      { id: 'defense', name: 'Defense', description: 'Damage resistance and avoidance' },
      { id: 'accuracy', name: 'Accuracy', description: 'Attack precision and hit chance' }
    ];

    const magnitudes = [
      { id: 'minor', name: 'Minor', description: 'Small bonus (+1 to +2)' },
      { id: 'moderate', name: 'Moderate', description: 'Medium bonus (+3 to +5)' },
      { id: 'major', name: 'Major', description: 'Large bonus (+6 to +10)' }
    ];

    const durations = [
      { id: 'short', name: 'Short', description: '1-3 rounds' },
      { id: 'medium', name: 'Medium', description: '4-10 rounds' },
      { id: 'long', name: 'Long', description: 'More than 10 rounds' }
    ];

    const specialEffects = [
      { id: 'stackable', name: 'Stackable', description: 'Can stack with other buffs' },
      { id: 'conditional', name: 'Conditional', description: 'Enhanced in certain situations' },
      { id: 'aura', name: 'Aura', description: 'Affects allies in an area around the target' }
    ];

    return (
      <div className="effect-config buff-effect-config">
        <h4>Buff Configuration</h4>
        
        <div className="config-section">
          <h5>Stats to Buff</h5>
          <p>Select one or more stats to enhance:</p>
          
          <div className="stats-grid">
            {stats.map(stat => (
              <div 
                key={stat.id}
                className={`stat-chip ${buffConfig.stats.includes(stat.id) ? 'selected' : ''}`}
                onClick={() => toggleStat(stat.id)}
              >
                <span className="stat-name">{stat.name}</span>
                <span className="stat-description">{stat.description}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="config-section">
          <h5>Buff Magnitude</h5>
          
          <div className="magnitude-options">
            {magnitudes.map(magnitude => (
              <div 
                key={magnitude.id}
                className={`magnitude-option ${buffConfig.magnitude === magnitude.id ? 'selected' : ''}`}
                onClick={() => handleBuffChange('magnitude', magnitude.id)}
              >
                <h6>{magnitude.name}</h6>
                <p>{magnitude.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="config-section">
          <h5>Buff Duration</h5>
          
          <div className="duration-options">
            {durations.map(duration => (
              <div 
                key={duration.id}
                className={`duration-option ${buffConfig.duration === duration.id ? 'selected' : ''}`}
                onClick={() => handleBuffChange('duration', duration.id)}
              >
                <h6>{duration.name}</h6>
                <p>{duration.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="config-section">
          <h5>Special Effects</h5>
          
          <div className="special-effects-grid">
            {specialEffects.map(effect => (
              <div 
                key={effect.id}
                className={`special-effect-chip ${buffConfig.specialEffects.includes(effect.id) ? 'selected' : ''}`}
                onClick={() => toggleSpecialEffect(effect.id)}
              >
                <span className="special-effect-name">{effect.name}</span>
                <span className="special-effect-description">{effect.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Render debuff configuration
  const renderDebuffConfig = () => {
    const debuffConfig = state.debuffConfig || {
      stats: [],
      magnitude: getDefaultDebuffFormula(),
      savingThrow: 'none',
      duration: 'short',
      specialEffects: []
    };

    const handleDebuffChange = (field, value) => {
      handleDebuffConfigChange({
        ...debuffConfig,
        [field]: value
      });
    };

    const toggleStat = (stat) => {
      const stats = debuffConfig.stats.includes(stat)
        ? debuffConfig.stats.filter(s => s !== stat)
        : [...debuffConfig.stats, stat];
      
      handleDebuffChange('stats', stats);
    };

    const toggleSpecialEffect = (effectId) => {
      const specialEffects = debuffConfig.specialEffects.includes(effectId)
        ? debuffConfig.specialEffects.filter(id => id !== effectId)
        : [...debuffConfig.specialEffects, effectId];
      
      handleDebuffChange('specialEffects', specialEffects);
    };

    const stats = [
      { id: 'strength', name: 'Strength', description: 'Physical power and carrying capacity' },
      { id: 'dexterity', name: 'Dexterity', description: 'Agility, reflexes, and balance' },
      { id: 'constitution', name: 'Constitution', description: 'Health, stamina, and vital force' },
      { id: 'intelligence', name: 'Intelligence', description: 'Mental acuity, information recall, analytical skill' },
      { id: 'wisdom', name: 'Wisdom', description: 'Awareness, intuition, and insight' },
      { id: 'charisma', name: 'Charisma', description: 'Force of personality, persuasiveness' },
      { id: 'speed', name: 'Speed', description: 'Movement speed and initiative' },
      { id: 'defense', name: 'Defense', description: 'Damage resistance and avoidance' },
      { id: 'accuracy', name: 'Accuracy', description: 'Attack precision and hit chance' }
    ];

    const magnitudes = [
      { id: 'minor', name: 'Minor', description: 'Small penalty (-1 to -2)' },
      { id: 'moderate', name: 'Moderate', description: 'Medium penalty (-3 to -5)' },
      { id: 'major', name: 'Major', description: 'Large penalty (-6 to -10)' }
    ];

    const savingThrows = [
      { id: 'none', name: 'None', description: 'No saving throw allowed' },
      { id: 'easy', name: 'Easy', description: 'DC 10 + spell type' },
      { id: 'moderate', name: 'Moderate', description: 'DC 15 + spell type' },
      { id: 'difficult', name: 'Difficult', description: 'DC 20 + spell type' }
    ];

    const durations = [
      { id: 'short', name: 'Short', description: '1-3 rounds' },
      { id: 'medium', name: 'Medium', description: '4-10 rounds' },
      { id: 'long', name: 'Long', description: 'More than 10 rounds' }
    ];

    const specialEffects = [
      { id: 'lingering', name: 'Lingering', description: 'Reduced effect continues after save' },
      { id: 'contagious', name: 'Contagious', description: 'Can spread to nearby targets' },
      { id: 'cumulative', name: 'Cumulative', description: 'Effects build up with repeated application' }
    ];

    return (
      <div className="effect-config debuff-effect-config">
        <h4>Debuff Configuration</h4>
        
        <div className="config-section">
          <h5>Stats to Debuff</h5>
          <p>Select one or more stats to reduce:</p>
          
          <div className="stats-grid">
            {stats.map(stat => (
              <div 
                key={stat.id}
                className={`stat-chip ${debuffConfig.stats.includes(stat.id) ? 'selected' : ''}`}
                onClick={() => toggleStat(stat.id)}
              >
                <span className="stat-name">{stat.name}</span>
                <span className="stat-description">{stat.description}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="config-section">
          <h5>Debuff Magnitude</h5>
          
          <div className="magnitude-options">
            {magnitudes.map(magnitude => (
              <div 
                key={magnitude.id}
                className={`magnitude-option ${debuffConfig.magnitude === magnitude.id ? 'selected' : ''}`}
                onClick={() => handleDebuffChange('magnitude', magnitude.id)}
              >
                <h6>{magnitude.name}</h6>
                <p>{magnitude.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="config-section">
          <h5>Saving Throw</h5>
          
          <div className="saving-throw-options">
            {savingThrows.map(save => (
              <div 
                key={save.id}
                className={`saving-throw-option ${debuffConfig.savingThrow === save.id ? 'selected' : ''}`}
                onClick={() => handleDebuffChange('savingThrow', save.id)}
              >
                <h6>{save.name}</h6>
                <p>{save.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="config-section">
          <h5>Debuff Duration</h5>
          
          <div className="duration-options">
            {durations.map(duration => (
              <div 
                key={duration.id}
                className={`duration-option ${debuffConfig.duration === duration.id ? 'selected' : ''}`}
                onClick={() => handleDebuffChange('duration', duration.id)}
              >
                <h6>{duration.name}</h6>
                <p>{duration.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="config-section">
          <h5>Special Effects</h5>
          
          <div className="special-effects-grid">
            {specialEffects.map(effect => (
              <div 
                key={effect.id}
                className={`special-effect-chip ${debuffConfig.specialEffects.includes(effect.id) ? 'selected' : ''}`}
                onClick={() => toggleSpecialEffect(effect.id)}
              >
                <span className="special-effect-name">{effect.name}</span>
                <span className="special-effect-description">{effect.description}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };
  
  // Render utility configuration
  const renderUtilityConfig = () => {
    const utilityConfig = state.utilityConfig || {
      utilityType: '',
      power: getDefaultUtilityFormula(),
      duration: 'short',
      specialEffects: [],
      description: ''
    };

    const handleUtilityChange = (field, value) => {
      handleUtilityConfigChange({
        ...utilityConfig,
        [field]: value
      });
    };

    const toggleSpecialEffect = (effectId) => {
      const specialEffects = utilityConfig.specialEffects.includes(effectId)
        ? utilityConfig.specialEffects.filter(id => id !== effectId)
        : [...utilityConfig.specialEffects, effectId];
      
      handleUtilityChange('specialEffects', specialEffects);
    };

    const utilityTypes = [
      { id: 'light', name: 'Light', description: 'Create or manipulate light' },
      { id: 'illusion', name: 'Illusion', description: 'Create sensory illusions' },
      { id: 'movement', name: 'Movement', description: 'Enhance or restrict movement' },
      { id: 'communication', name: 'Communication', description: 'Aid or block communication' },
      { id: 'information', name: 'Information', description: 'Gain information or insight' },
      { id: 'environment', name: 'Environment', description: 'Manipulate or adapt to environment' }
    ];

    const powers = [
      { id: 'minor', name: 'Minor', description: 'Small effect with limited scope' },
      { id: 'moderate', name: 'Moderate', description: 'Medium effect with standard scope' },
      { id: 'major', name: 'Major', description: 'Strong effect with wide scope' }
    ];

    const durations = [
      { id: 'instant', name: 'Instant', description: 'One-time effect' },
      { id: 'short', name: 'Short', description: '1 minute or less' },
      { id: 'medium', name: 'Medium', description: '10 minutes to 1 hour' },
      { id: 'long', name: 'Long', description: 'Hours to days' }
    ];

    const specialEffects = [
      { id: 'silent', name: 'Silent', description: 'No sound when used' },
      { id: 'subtle', name: 'Subtle', description: 'Difficult to notice when cast' },
      { id: 'versatile', name: 'Versatile', description: 'Can be used in different ways' }
    ];

    return (
      <div className="effect-config utility-effect-config">
        <h4>Utility Configuration</h4>
        
        <div className="config-section">
          <h5>Utility Type</h5>
          
          <div className="utility-types-grid">
            {utilityTypes.map(type => (
              <div 
                key={type.id}
                className={`utility-type-card ${utilityConfig.utilityType === type.id ? 'selected' : ''}`}
                onClick={() => handleUtilityChange('utilityType', type.id)}
              >
                <h6 className="utility-type-name">{type.name}</h6>
                <p className="utility-type-description">{type.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="config-section">
          <h5>Power Level</h5>
          
          <div className="power-options">
            {powers.map(power => (
              <div 
                key={power.id}
                className={`power-option ${utilityConfig.power === power.id ? 'selected' : ''}`}
                onClick={() => handleUtilityChange('power', power.id)}
              >
                <h6>{power.name}</h6>
                <p>{power.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="config-section">
          <h5>Duration</h5>
          
          <div className="duration-options">
            {durations.map(duration => (
              <div 
                key={duration.id}
                className={`duration-option ${utilityConfig.duration === duration.id ? 'selected' : ''}`}
                onClick={() => handleUtilityChange('duration', duration.id)}
              >
                <h6>{duration.name}</h6>
                <p>{duration.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="config-section">
          <h5>Special Effects</h5>
          
          <div className="special-effects-grid">
            {specialEffects.map(effect => (
              <div 
                key={effect.id}
                className={`special-effect-chip ${utilityConfig.specialEffects.includes(effect.id) ? 'selected' : ''}`}
                onClick={() => toggleSpecialEffect(effect.id)}
              >
                <span className="special-effect-name">{effect.name}</span>
                <span className="special-effect-description">{effect.description}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="config-section">
          <h5>Custom Description</h5>
          
          <textarea
            value={utilityConfig.description}
            onChange={(e) => handleUtilityChange('description', e.target.value)}
            placeholder="Describe the specific utility effect of your spell..."
            rows={4}
            className="utility-description"
          />
        </div>
      </div>
    );
  };
  
  // Render effect configuration based on selected effect type
  const renderEffectConfig = () => {
    if (!selectedEffectType) {
      return (
        <div className="no-effect-selected">
          <p>Please select an effect type to configure.</p>
        </div>
      );
    }

    switch (selectedEffectType) {
      case 'damage':
        return renderDamageConfig();
      case 'healing':
        return renderHealingConfig();
      case 'buff':
        return renderBuffConfig();
      case 'debuff':
        return renderDebuffConfig();
      case 'utility':
        return renderUtilityConfig();
      default:
        return (
          <div className="effect-config-placeholder">
            <p>Configuration for {selectedEffectType} effects is not yet implemented.</p>
          </div>
        );
    }
  };
  
  // Handle next button click
  const handleNext = () => {
    if (state.effectTypes.length > 0 && areAllEffectsConfigured()) {
      onNext();
    }
  };
  
  // Get compatible effect types
  const compatibleEffectTypes = getCompatibleEffectTypes();
  const isStepComplete = state.effectTypes.length > 0 && areAllEffectsConfigured();
  
  return (
    <WizardStep
      title="Spell Effects"
      stepNumber={stepIndex + 1}
      totalSteps={totalSteps}
      isCompleted={isStepComplete}
      isActive={true}
      onNext={handleNext}
      onPrevious={onPrevious}
      disableNext={!isStepComplete}
      hints={getConfigurationHints()}
    >
      <div className="spell-effects-container">
        <div className="effect-selection-section">
          <h3>Select Effect Types</h3>
          <p className="effect-selection-description">
            Choose one or more effects for your spell. The complexity and power of your spell should match its type.
          </p>
          
          {effectCompatibilityErrors.length > 0 && (
            <div className="effect-compatibility-errors">
              {effectCompatibilityErrors.map((error, index) => (
                <div key={index} className="error-message">
                  <i className="fas fa-exclamation-triangle"></i> {error}
                </div>
              ))}
            </div>
          )}
          
          <div className="effect-types-grid">
            {compatibleEffectTypes.map(effectType => (
              <SelectionCard
                key={effectType.id}
                title={effectType.name}
                description={effectType.description}
                icon={effectType.icon.replace('spell_', '').replace('ability_', '')}
                iconColor={getEffectIconColor(effectType.category)}
                selected={state.effectTypes.includes(effectType.id)}
                onClick={() => toggleEffectType(effectType.id)}
                additionalInfo={{
                  Category: effectType.category,
                  ActionPointCost: effectType.actionPointCost
                }}
                showDetails={true}
                selectionMode="multiple"
              />
            ))}
          </div>
        </div>
        
        <div className="effect-configuration-section">
          <h3>Configure Selected Effects</h3>
          
          {state.effectTypes.length === 0 ? (
            <div className="no-effects-selected">
              <p>Select at least one effect type to configure.</p>
            </div>
          ) : (
            <div className="effect-tabs">
              <div className="effect-tabs-header">
                {state.effectTypes.map(effectType => {
                  const effect = getEffectTypeById(effectType);
                  return (
                    <button
                      key={effectType}
                      className={`effect-tab ${selectedEffectType === effectType ? 'active' : ''}`}
                      onClick={() => setSelectedEffectType(effectType)}
                    >
                      <i className={`fas fa-${getEffectIcon(effectType)}`}></i>
                      {effect ? effect.name : effectType}
                    </button>
                  );
                })}
              </div>
              
              <div className="effect-tabs-content">
                {renderEffectConfig()}
              </div>
            </div>
          )}
        </div>
        
        <div className="effect-summary-section">
          <h3>Effect Summary</h3>
          
          <div className="effect-resource-cost">
            <span className="resource-cost-label">Total Resource Cost:</span>
            <span className="resource-cost-value">{calculateTotalResourceCost()} Action Points</span>
          </div>
          
          <div className="selected-effects-list">
            {state.effectTypes.map(effectType => {
              const effect = getEffectTypeById(effectType);
              const configStatus = isEffectConfigured(effectType) ? 'Configured' : 'Not Configured';
              
              return (
                <div key={effectType} className="selected-effect-item">
                  <span className="effect-name">{effect ? effect.name : effectType}</span>
                  <span className={`effect-status ${configStatus === 'Configured' ? 'configured' : 'not-configured'}`}>
                    {configStatus === 'Configured' ? (
                      <><i className="fas fa-check-circle"></i> {configStatus}</>
                    ) : (
                      <><i className="fas fa-exclamation-circle"></i> {configStatus}</>
                    )}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </WizardStep>
  );
};

// Helper functions
const getEffectIconColor = (category) => {
  switch (category) {
    case 'offensive': return '#e74c3c'; // Red
    case 'supportive': return '#2ecc71'; // Green
    case 'utility': return '#3498db'; // Blue
    case 'tactical': return '#9b59b6'; // Purple
    case 'conjuration': return '#f39c12'; // Orange
    case 'alteration': return '#1abc9c'; // Teal
    default: return '#34495e'; // Dark Blue
  }
};

const getEffectIcon = (effectType) => {
  switch (effectType) {
    case 'damage': return 'fire';
    case 'healing': return 'heart';
    case 'buff': return 'shield-alt';
    case 'debuff': return 'skull';
    case 'utility': return 'magic';
    case 'control': return 'hand-paper';
    case 'summoning': return 'ghost';
    case 'transformation': return 'exchange-alt';
    default: return 'star';
  }
};

export default Step3Effects;