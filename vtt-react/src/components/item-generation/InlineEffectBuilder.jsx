import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFire, faHeart, faShieldAlt, faSkullCrossbones, faBolt,
  faPlus, faTrash, faChevronDown, faChevronUp
} from '@fortawesome/free-solid-svg-icons';
import '../../styles/item-wizard.css';

// Default configurations for each effect type
const DEFAULT_CONFIGS = {
  damage: {
    formula: '1d6',
    damageType: 'fire',
    isDot: false,
    dotDuration: 3,
    dotTickFrequency: 'round',
    targetType: 'attacker',
    areaRadius: 0
  },
  healing: {
    healingFormula: '1d8',
    isHot: false,
    hotDuration: 3,
    hotTickFrequency: 'round',
    grantsTempHP: false,
    targetType: 'self',
    areaRadius: 0
  },
  buff: {
    statModifier: { stat: 'armor', magnitude: 2, magnitudeType: 'flat' },
    durationValue: 2,
    durationType: 'rounds',
    targetType: 'self',
    areaRadius: 0
  },
  debuff: {
    statModifier: { stat: 'speed', magnitude: 10, magnitudeType: 'flat' },
    durationValue: 2,
    durationType: 'rounds',
    saveDC: 14,
    saveType: 'constitution',
    targetType: 'attacker',
    areaRadius: 0
  },
  control: {
    controlType: 'stun',
    controlDuration: 1,
    saveDC: 14,
    saveType: 'constitution',
    knockbackDistance: 10,
    targetType: 'attacker',
    areaRadius: 0
  }
};

/**
 * InlineEffectBuilder - Build spell effects inline for items
 * Uses spell wizard data structure for combat system compatibility
 * Supports: damage, healing, buff, debuff, control effects
 */
const InlineEffectBuilder = ({ effect, onEffectChange, onRemove }) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [localEffect, setLocalEffect] = useState(() => {
    // Initialize with sensible defaults or from provided effect
    if (effect && effect.effectType && effect.effectConfig) {
      return {
        effectType: effect.effectType,
        effectConfig: {
          ...DEFAULT_CONFIGS[effect.effectType],
          ...effect.effectConfig
        }
      };
    }
    return {
      effectType: 'damage',
      effectConfig: { ...DEFAULT_CONFIGS.damage }
    };
  });

  // Sync local state with parent
  useEffect(() => {
    if (onEffectChange) {
      onEffectChange(localEffect);
    }
  }, [localEffect, onEffectChange]);

  const updateEffect = (field, value) => {
    if (field === 'effectType') {
      // When changing effect type, reset config to defaults for that type
      setLocalEffect({
        effectType: value,
        effectConfig: { ...DEFAULT_CONFIGS[value] }
      });
    } else {
      setLocalEffect(prev => ({ ...prev, [field]: value }));
    }
  };

  const updateEffectConfig = (field, value) => {
    setLocalEffect(prev => ({
      ...prev,
      effectConfig: { ...prev.effectConfig, [field]: value }
    }));
  };

  const getEffectIcon = (type) => {
    switch (type) {
      case 'damage': return faFire;
      case 'healing': return faHeart;
      case 'buff': return faShieldAlt;
      case 'debuff': return faSkullCrossbones;
      case 'control': return faBolt;
      default: return faBolt;
    }
  };

  const getEffectColor = (type) => {
    switch (type) {
      case 'damage': return '#c0392b';
      case 'healing': return '#27ae60';
      case 'buff': return '#2980b9';
      case 'debuff': return '#8e44ad';
      case 'control': return '#d35400';
      default: return '#7f8c8d';
    }
  };

  // Format stat/type names from snake_case to Title Case
  const formatName = (name) => {
    if (!name) return '';
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Format damage type
  const formatDamageType = (type) => {
    return formatName(type);
  };

  // Format control type with description
  const formatControlType = (type) => {
    const typeMap = {
      stun: 'Stun', paralyze: 'Paralyze', sleep: 'Sleep', daze: 'Daze',
      slow: 'Slow', root: 'Root', knockback: 'Knockback', knockdown: 'Knockdown',
      fear: 'Fear', charm: 'Charm', confuse: 'Confuse', blind: 'Blind', silence: 'Silence'
    };
    return typeMap[type] || formatName(type);
  };

  const getEffectSummary = () => {
    const config = localEffect.effectConfig || {};
    const type = localEffect.effectType;
    
    switch (type) {
      case 'damage':
        if (config.isDot) {
          return `${config.formula || '1d6'} ${formatName(config.damageType || 'fire')} per ${config.dotTickFrequency || 'round'} for ${config.dotDuration || 3} rounds`;
        }
        return `${config.formula || '1d6'} ${formatName(config.damageType || 'fire')} damage`;
      case 'healing':
        if (config.isHot) {
          return `${config.healingFormula || '1d8'} healing per ${config.hotTickFrequency || 'round'} for ${config.hotDuration || 3} rounds`;
        }
        if (config.grantsTempHP) {
          return `${config.healingFormula || '1d8'} Temporary HP`;
        }
        return `${config.healingFormula || '1d8'} healing`;
      case 'buff':
        return `+${config.statModifier?.magnitude || 2} ${formatName(config.statModifier?.stat || 'armor')} for ${config.durationValue || 2} ${config.durationType || 'rounds'}`;
      case 'debuff':
        return `-${config.statModifier?.magnitude || 2} ${formatName(config.statModifier?.stat || 'speed')} (DC ${config.saveDC || 14})`;
      case 'control':
        return `${formatControlType(config.controlType || 'stun')} for ${config.controlDuration || 1} round${config.controlDuration !== 1 ? 's' : ''} (DC ${config.saveDC || 14})`;
      default:
        return 'Configure effect';
    }
  };

  // Get a description suitable for tooltip display
  const getEffectDescription = () => {
    const config = localEffect.effectConfig || {};
    const type = localEffect.effectType;
    const target = config.targetType === 'self' ? 'yourself' : config.targetType === 'area' ? `all within ${config.areaRadius || 10}ft` : 'the attacker';
    
    switch (type) {
      case 'damage':
        if (config.isDot) {
          return `Deal ${config.formula || '1d6'} ${formatName(config.damageType || 'fire')} damage to ${target} each ${config.dotTickFrequency || 'round'} for ${config.dotDuration || 3} rounds`;
        }
        return `Deal ${config.formula || '1d6'} ${formatName(config.damageType || 'fire')} damage to ${target}`;
      case 'healing':
        if (config.isHot) {
          return `Heal ${target} for ${config.healingFormula || '1d8'} each ${config.hotTickFrequency || 'round'} for ${config.hotDuration || 3} rounds`;
        }
        if (config.grantsTempHP) {
          return `Grant ${target} ${config.healingFormula || '1d8'} temporary hit points`;
        }
        return `Heal ${target} for ${config.healingFormula || '1d8'}`;
      case 'buff':
        return `Grant ${target} +${config.statModifier?.magnitude || 2} ${formatName(config.statModifier?.stat || 'armor')} for ${config.durationValue || 2} ${config.durationType || 'rounds'}`;
      case 'debuff':
        return `Reduce ${target}'s ${formatName(config.statModifier?.stat || 'speed')} by ${config.statModifier?.magnitude || 2} for ${config.durationValue || 2} ${config.durationType || 'rounds'} (DC ${config.saveDC || 14} ${formatName(config.saveType || 'constitution')} negates)`;
      case 'control':
        return `${formatControlType(config.controlType || 'stun')} ${target} for ${config.controlDuration || 1} round${config.controlDuration !== 1 ? 's' : ''} (DC ${config.saveDC || 14} ${formatName(config.saveType || 'constitution')} negates)`;
      default:
        return 'Effect not configured';
    }
  };

  // Store description in effect config for tooltip use
  useEffect(() => {
    const desc = getEffectDescription();
    if (localEffect.effectConfig?.description !== desc) {
      setLocalEffect(prev => ({
        ...prev,
        effectConfig: { ...prev.effectConfig, description: desc }
      }));
    }
  }, [localEffect.effectType, localEffect.effectConfig?.formula, localEffect.effectConfig?.damageType, 
      localEffect.effectConfig?.isDot, localEffect.effectConfig?.healingFormula, localEffect.effectConfig?.isHot,
      localEffect.effectConfig?.controlType, localEffect.effectConfig?.targetType, localEffect.effectConfig?.areaRadius]);

  return (
    <div className="inline-effect-builder">
      {/* Header */}
      <div 
        className="effect-builder-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="effect-header-left">
          <FontAwesomeIcon 
            icon={getEffectIcon(localEffect.effectType)} 
            style={{ color: getEffectColor(localEffect.effectType) }}
          />
          <span className="effect-type-label">
            {localEffect.effectType?.charAt(0).toUpperCase() + localEffect.effectType?.slice(1)}
          </span>
          <span className="effect-summary">{getEffectSummary()}</span>
        </div>
        <div className="effect-header-actions">
          <button 
            className="effect-action-btn toggle"
            onClick={(e) => { e.stopPropagation(); setIsExpanded(!isExpanded); }}
            title={isExpanded ? 'Collapse' : 'Expand'}
          >
            <FontAwesomeIcon icon={isExpanded ? faChevronUp : faChevronDown} />
          </button>
          {onRemove && (
            <button 
              className="effect-action-btn delete"
              onClick={(e) => { e.stopPropagation(); onRemove(); }}
              title="Remove Effect"
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          )}
        </div>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="effect-builder-content">
          {/* Effect Type Selection */}
          <div className="effect-type-selector">
            <label className="pf-label">Effect Type</label>
            <div className="effect-type-options">
              {['damage', 'healing', 'buff', 'debuff', 'control'].map(type => (
                <button
                  key={type}
                  className={`effect-type-btn ${localEffect.effectType === type ? 'selected' : ''}`}
                  onClick={() => updateEffect('effectType', type)}
                  style={{ 
                    '--effect-color': getEffectColor(type),
                    borderColor: localEffect.effectType === type ? getEffectColor(type) : undefined
                  }}
                >
                  <FontAwesomeIcon icon={getEffectIcon(type)} />
                  <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Target Selection */}
          <div className="effect-target-selector">
            <label className="pf-label">Target</label>
            <div className="target-options">
              <button
                className={`target-btn ${localEffect.effectConfig?.targetType === 'attacker' ? 'selected' : ''}`}
                onClick={() => updateEffectConfig('targetType', 'attacker')}
              >
                Attacker
              </button>
              <button
                className={`target-btn ${localEffect.effectConfig?.targetType === 'self' ? 'selected' : ''}`}
                onClick={() => updateEffectConfig('targetType', 'self')}
              >
                Self
              </button>
              <button
                className={`target-btn ${localEffect.effectConfig?.targetType === 'area' ? 'selected' : ''}`}
                onClick={() => updateEffectConfig('targetType', 'area')}
              >
                Area
              </button>
            </div>
            {localEffect.effectConfig?.targetType === 'area' && (
              <div className="area-config">
                <label className="pf-label-small">Area Radius (ft)</label>
                <input
                  type="number"
                  min="5"
                  max="60"
                  step="5"
                  value={localEffect.effectConfig?.areaRadius || 10}
                  onChange={(e) => updateEffectConfig('areaRadius', parseInt(e.target.value))}
                  className="pf-input-small"
                />
              </div>
            )}
          </div>

          {/* Effect-Specific Configuration */}
          <div className="effect-config-section">
            {/* DAMAGE CONFIGURATION */}
            {localEffect.effectType === 'damage' && (
              <div className="damage-config">
                <div className="config-row">
                  <div className="config-field">
                    <label className="pf-label">Damage Formula</label>
                    <input
                      type="text"
                      value={localEffect.effectConfig?.formula || '1d6'}
                      onChange={(e) => updateEffectConfig('formula', e.target.value)}
                      placeholder="e.g., 1d6, 2d8+INT"
                      className="pf-input"
                    />
                  </div>
                  <div className="config-field">
                    <label className="pf-label">Damage Type</label>
                    <select
                      value={localEffect.effectConfig?.damageType || 'fire'}
                      onChange={(e) => updateEffectConfig('damageType', e.target.value)}
                      className="pf-select"
                    >
                      <option value="fire">Fire</option>
                      <option value="cold">Cold</option>
                      <option value="lightning">Lightning</option>
                      <option value="acid">Acid</option>
                      <option value="necrotic">Necrotic</option>
                      <option value="radiant">Radiant</option>
                      <option value="force">Force</option>
                      <option value="psychic">Psychic</option>
                      <option value="poison">Poison</option>
                      <option value="thunder">Thunder</option>
                      <option value="chaos">Chaos</option>
                      <option value="bludgeoning">Bludgeoning</option>
                      <option value="piercing">Piercing</option>
                      <option value="slashing">Slashing</option>
                    </select>
                  </div>
                </div>

                <div className="config-toggle">
                  <label className="pf-checkbox-label">
                    <input
                      type="checkbox"
                      checked={localEffect.effectConfig?.isDot || false}
                      onChange={(e) => updateEffectConfig('isDot', e.target.checked)}
                    />
                    <span className="pf-checkbox-text">Damage Over Time (Bleed/Burn)</span>
                  </label>
                </div>

                {localEffect.effectConfig?.isDot && (
                  <div className="config-row dot-config">
                    <div className="config-field">
                      <label className="pf-label-small">Duration (rounds)</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={localEffect.effectConfig?.dotDuration || 3}
                        onChange={(e) => updateEffectConfig('dotDuration', parseInt(e.target.value))}
                        className="pf-input-small"
                      />
                    </div>
                    <div className="config-field">
                      <label className="pf-label-small">Tick Frequency</label>
                      <select
                        value={localEffect.effectConfig?.dotTickFrequency || 'round'}
                        onChange={(e) => updateEffectConfig('dotTickFrequency', e.target.value)}
                        className="pf-select-small"
                      >
                        <option value="round">Each Round</option>
                        <option value="turn">Each Turn</option>
                      </select>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* HEALING CONFIGURATION */}
            {localEffect.effectType === 'healing' && (
              <div className="healing-config">
                <div className="config-row">
                  <div className="config-field">
                    <label className="pf-label">Healing Formula</label>
                    <input
                      type="text"
                      value={localEffect.effectConfig?.healingFormula || '1d8'}
                      onChange={(e) => updateEffectConfig('healingFormula', e.target.value)}
                      placeholder="e.g., 1d8, 2d6+SPIRIT"
                      className="pf-input"
                    />
                  </div>
                </div>

                <div className="config-toggle">
                  <label className="pf-checkbox-label">
                    <input
                      type="checkbox"
                      checked={localEffect.effectConfig?.isHot || false}
                      onChange={(e) => updateEffectConfig('isHot', e.target.checked)}
                    />
                    <span className="pf-checkbox-text">Heal Over Time (Regeneration)</span>
                  </label>
                </div>

                {localEffect.effectConfig?.isHot && (
                  <div className="config-row hot-config">
                    <div className="config-field">
                      <label className="pf-label-small">Duration (rounds)</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={localEffect.effectConfig?.hotDuration || 3}
                        onChange={(e) => updateEffectConfig('hotDuration', parseInt(e.target.value))}
                        className="pf-input-small"
                      />
                    </div>
                    <div className="config-field">
                      <label className="pf-label-small">Tick Frequency</label>
                      <select
                        value={localEffect.effectConfig?.hotTickFrequency || 'round'}
                        onChange={(e) => updateEffectConfig('hotTickFrequency', e.target.value)}
                        className="pf-select-small"
                      >
                        <option value="round">Each Round</option>
                        <option value="turn">Each Turn</option>
                      </select>
                    </div>
                  </div>
                )}

                <div className="config-toggle">
                  <label className="pf-checkbox-label">
                    <input
                      type="checkbox"
                      checked={localEffect.effectConfig?.grantsTempHP || false}
                      onChange={(e) => updateEffectConfig('grantsTempHP', e.target.checked)}
                    />
                    <span className="pf-checkbox-text">Grants Temporary HP (Shield)</span>
                  </label>
                </div>
              </div>
            )}

            {/* BUFF CONFIGURATION */}
            {localEffect.effectType === 'buff' && (
              <div className="buff-config">
                <div className="config-row">
                  <div className="config-field">
                    <label className="pf-label">Stat to Enhance</label>
                    <select
                      value={localEffect.effectConfig?.statModifier?.stat || 'armor'}
                      onChange={(e) => updateEffectConfig('statModifier', {
                        ...localEffect.effectConfig?.statModifier,
                        stat: e.target.value
                      })}
                      className="pf-select"
                    >
                      <optgroup label="Primary Stats">
                        <option value="strength">Strength</option>
                        <option value="agility">Agility</option>
                        <option value="constitution">Constitution</option>
                        <option value="intelligence">Intelligence</option>
                        <option value="spirit">Spirit</option>
                        <option value="charisma">Charisma</option>
                      </optgroup>
                      <optgroup label="Combat Stats">
                        <option value="armor">Armor</option>
                        <option value="damage_reduction">Damage Reduction</option>
                        <option value="speed">Movement Speed</option>
                        <option value="attack">Attack Bonus</option>
                        <option value="damage">Damage Bonus</option>
                      </optgroup>
                      <optgroup label="Resistances">
                        <option value="fire_resistance">Fire Resistance</option>
                        <option value="cold_resistance">Cold Resistance</option>
                        <option value="lightning_resistance">Lightning Resistance</option>
                        <option value="all_resistance">All Resistances</option>
                      </optgroup>
                    </select>
                  </div>
                  <div className="config-field">
                    <label className="pf-label">Amount</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={localEffect.effectConfig?.statModifier?.magnitude || 2}
                      onChange={(e) => updateEffectConfig('statModifier', {
                        ...localEffect.effectConfig?.statModifier,
                        magnitude: parseInt(e.target.value)
                      })}
                      className="pf-input"
                    />
                  </div>
                </div>
                <div className="config-row">
                  <div className="config-field">
                    <label className="pf-label">Duration</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={localEffect.effectConfig?.durationValue || 2}
                      onChange={(e) => updateEffectConfig('durationValue', parseInt(e.target.value))}
                      className="pf-input-small"
                    />
                  </div>
                  <div className="config-field">
                    <label className="pf-label">Duration Unit</label>
                    <select
                      value={localEffect.effectConfig?.durationType || 'rounds'}
                      onChange={(e) => updateEffectConfig('durationType', e.target.value)}
                      className="pf-select-small"
                    >
                      <option value="rounds">Rounds</option>
                      <option value="minutes">Minutes</option>
                      <option value="until_rest">Until Rest</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* DEBUFF CONFIGURATION */}
            {localEffect.effectType === 'debuff' && (
              <div className="debuff-config">
                <div className="config-row">
                  <div className="config-field">
                    <label className="pf-label">Stat to Reduce</label>
                    <select
                      value={localEffect.effectConfig?.statModifier?.stat || 'speed'}
                      onChange={(e) => updateEffectConfig('statModifier', {
                        ...localEffect.effectConfig?.statModifier,
                        stat: e.target.value
                      })}
                      className="pf-select"
                    >
                      <optgroup label="Primary Stats">
                        <option value="strength">Strength</option>
                        <option value="agility">Agility</option>
                        <option value="constitution">Constitution</option>
                        <option value="intelligence">Intelligence</option>
                        <option value="spirit">Spirit</option>
                        <option value="charisma">Charisma</option>
                      </optgroup>
                      <optgroup label="Combat Stats">
                        <option value="armor">Armor</option>
                        <option value="speed">Movement Speed</option>
                        <option value="attack">Attack Bonus</option>
                        <option value="damage">Damage</option>
                        <option value="accuracy">Accuracy</option>
                      </optgroup>
                    </select>
                  </div>
                  <div className="config-field">
                    <label className="pf-label">Reduction Amount</label>
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={localEffect.effectConfig?.statModifier?.magnitude || 2}
                      onChange={(e) => updateEffectConfig('statModifier', {
                        ...localEffect.effectConfig?.statModifier,
                        magnitude: parseInt(e.target.value)
                      })}
                      className="pf-input"
                    />
                  </div>
                </div>
                <div className="config-row">
                  <div className="config-field">
                    <label className="pf-label">Duration</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={localEffect.effectConfig?.durationValue || 2}
                      onChange={(e) => updateEffectConfig('durationValue', parseInt(e.target.value))}
                      className="pf-input-small"
                    />
                  </div>
                  <div className="config-field">
                    <label className="pf-label">Duration Unit</label>
                    <select
                      value={localEffect.effectConfig?.durationType || 'rounds'}
                      onChange={(e) => updateEffectConfig('durationType', e.target.value)}
                      className="pf-select-small"
                    >
                      <option value="rounds">Rounds</option>
                      <option value="minutes">Minutes</option>
                    </select>
                  </div>
                </div>

                {/* Saving Throw for Debuffs */}
                <div className="config-row">
                  <div className="config-field">
                    <label className="pf-label">Save DC</label>
                    <input
                      type="number"
                      min="8"
                      max="25"
                      value={localEffect.effectConfig?.saveDC || 14}
                      onChange={(e) => updateEffectConfig('saveDC', parseInt(e.target.value))}
                      className="pf-input-small"
                    />
                  </div>
                  <div className="config-field">
                    <label className="pf-label">Save Type</label>
                    <select
                      value={localEffect.effectConfig?.saveType || 'constitution'}
                      onChange={(e) => updateEffectConfig('saveType', e.target.value)}
                      className="pf-select-small"
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

            {/* CONTROL CONFIGURATION */}
            {localEffect.effectType === 'control' && (
              <div className="control-config">
                <div className="config-row">
                  <div className="config-field">
                    <label className="pf-label">Control Effect</label>
                    <select
                      value={localEffect.effectConfig?.controlType || 'stun'}
                      onChange={(e) => updateEffectConfig('controlType', e.target.value)}
                      className="pf-select"
                    >
                      <optgroup label="Incapacitation">
                        <option value="stun">Stun (Cannot act)</option>
                        <option value="paralyze">Paralyze (Cannot move or act)</option>
                        <option value="sleep">Sleep (Unconscious)</option>
                        <option value="daze">Daze (Limited actions)</option>
                      </optgroup>
                      <optgroup label="Movement">
                        <option value="slow">Slow (Reduced speed)</option>
                        <option value="root">Root (Cannot move)</option>
                        <option value="knockback">Knockback (Push away)</option>
                        <option value="knockdown">Knockdown (Prone)</option>
                      </optgroup>
                      <optgroup label="Mental">
                        <option value="fear">Fear (Flee)</option>
                        <option value="charm">Charm (Friendly)</option>
                        <option value="confuse">Confuse (Random actions)</option>
                        <option value="blind">Blind (Cannot see)</option>
                        <option value="silence">Silence (Cannot cast)</option>
                      </optgroup>
                    </select>
                  </div>
                  <div className="config-field">
                    <label className="pf-label">Duration (rounds)</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={localEffect.effectConfig?.controlDuration || 1}
                      onChange={(e) => updateEffectConfig('controlDuration', parseInt(e.target.value))}
                      className="pf-input-small"
                    />
                  </div>
                </div>

                {/* Knockback distance */}
                {localEffect.effectConfig?.controlType === 'knockback' && (
                  <div className="config-row">
                    <div className="config-field">
                      <label className="pf-label-small">Knockback Distance (ft)</label>
                      <input
                        type="number"
                        min="5"
                        max="30"
                        step="5"
                        value={localEffect.effectConfig?.knockbackDistance || 10}
                        onChange={(e) => updateEffectConfig('knockbackDistance', parseInt(e.target.value))}
                        className="pf-input-small"
                      />
                    </div>
                  </div>
                )}

                {/* Saving Throw */}
                <div className="config-row">
                  <div className="config-field">
                    <label className="pf-label">Save DC</label>
                    <input
                      type="number"
                      min="8"
                      max="25"
                      value={localEffect.effectConfig?.saveDC || 14}
                      onChange={(e) => updateEffectConfig('saveDC', parseInt(e.target.value))}
                      className="pf-input-small"
                    />
                  </div>
                  <div className="config-field">
                    <label className="pf-label">Save Type</label>
                    <select
                      value={localEffect.effectConfig?.saveType || 'constitution'}
                      onChange={(e) => updateEffectConfig('saveType', e.target.value)}
                      className="pf-select-small"
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
        </div>
      )}
    </div>
  );
};

export default InlineEffectBuilder;
