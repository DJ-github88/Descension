import React, { useState, useEffect } from 'react';
import { 
  WizardStepContainer, 
  StatModifierSelector,
  StatusEffectSelector
} from './EffectWizardComponents';

import {
  PRIMARY_STAT_MODIFIERS,
  SECONDARY_STAT_MODIFIERS,
  COMBAT_STAT_MODIFIERS,
  POSITIVE_STATUS_EFFECTS,
  SPELL_DAMAGE_MODIFIERS,
  RESISTANCE_TYPES,
  getWowIconPath
} from './effectSystemData';

import { useEffectWizardState, useEffectWizardDispatch } from './EffectWizardContext';

/**
 * BuffPrimaryStatsPage - Component for configuring primary stat buffs
 */
export const BuffPrimaryStatsPage = ({ stepId, currentStepId }) => {
  const state = useEffectWizardState();
  const dispatch = useEffectWizardDispatch();
  const [modifierType, setModifierType] = useState('flat');
  
  const handleStatModifiersChange = (statModifiers) => {
    dispatch({
      type: 'UPDATE_BUFF_CONFIG',
      payload: {
        statModifiers: {
          ...state.buffConfig.statModifiers,
          ...statModifiers
        }
      }
    });
  };
  
  const selectedModifiers = {};
  PRIMARY_STAT_MODIFIERS.forEach(stat => {
    if (state.buffConfig.statModifiers[stat.id] !== undefined) {
      selectedModifiers[stat.id] = state.buffConfig.statModifiers[stat.id];
    }
  });
  
  return (
    <WizardStepContainer
      stepId={stepId}
      currentStepId={currentStepId}
      flow={state.wizardFlow}
      state={state}
    >
      <div className="buff-primary-stats">
        <div className="modifier-type-selection">
          <h3>Modifier Type</h3>
          <div className="modifier-options">
            <label>
              <input 
                type="radio" 
                name="modifierType" 
                value="flat" 
                checked={modifierType === 'flat'} 
                onChange={() => setModifierType('flat')} 
              />
              Flat Bonus (e.g. +2 Strength)
            </label>
            <label>
              <input 
                type="radio" 
                name="modifierType" 
                value="percentage" 
                checked={modifierType === 'percentage'} 
                onChange={() => setModifierType('percentage')} 
              />
              Percentage Bonus (e.g. +10% Strength)
            </label>
          </div>
          <p className="helper-text">
            {modifierType === 'flat' 
              ? 'Flat bonuses add directly to the attribute value and are more effective at lower levels.' 
              : 'Percentage bonuses scale with the base attribute and become more powerful at higher levels.'}
          </p>
        </div>
        
        <StatModifierSelector 
          selectedModifiers={selectedModifiers}
          onChange={handleStatModifiersChange}
          statCategories={['primary']}
        />
      </div>
    </WizardStepContainer>
  );
};

/**
 * BuffSecondaryStatsPage - Component for configuring secondary stat buffs
 */
export const BuffSecondaryStatsPage = ({ stepId, currentStepId }) => {
  const state = useEffectWizardState();
  const dispatch = useEffectWizardDispatch();
  const [modifierType, setModifierType] = useState('flat');
  
  const handleStatModifiersChange = (statModifiers) => {
    dispatch({
      type: 'UPDATE_BUFF_CONFIG',
      payload: {
        statModifiers: {
          ...state.buffConfig.statModifiers,
          ...statModifiers
        }
      }
    });
  };
  
  const selectedModifiers = {};
  SECONDARY_STAT_MODIFIERS.forEach(stat => {
    if (state.buffConfig.statModifiers[stat.id] !== undefined) {
      selectedModifiers[stat.id] = state.buffConfig.statModifiers[stat.id];
    }
  });
  
  return (
    <WizardStepContainer
      stepId={stepId}
      currentStepId={currentStepId}
      flow={state.wizardFlow}
      state={state}
    >
      <div className="buff-secondary-stats">
        <div className="modifier-type-selection">
          <h3>Modifier Type</h3>
          <div className="modifier-options">
            <label>
              <input 
                type="radio" 
                name="modifierType" 
                value="flat" 
                checked={modifierType === 'flat'} 
                onChange={() => setModifierType('flat')} 
              />
              Flat Bonus (e.g. +2 AC)
            </label>
            <label>
              <input 
                type="radio" 
                name="modifierType" 
                value="percentage" 
                checked={modifierType === 'percentage'} 
                onChange={() => setModifierType('percentage')} 
              />
              Percentage Bonus (e.g. +10% Movement Speed)
            </label>
          </div>
          <p className="helper-text">
            Secondary attributes often benefit from flat bonuses for defensive stats (AC, saving throws) 
            and percentage bonuses for things like speed and initiative.
          </p>
        </div>
        
        <StatModifierSelector 
          selectedModifiers={selectedModifiers}
          onChange={handleStatModifiersChange}
          statCategories={['secondary']}
        />
      </div>
    </WizardStepContainer>
  );
};

/**
 * BuffCombatStatsPage - Component for configuring combat stat buffs
 */
export const BuffCombatStatsPage = ({ stepId, currentStepId }) => {
  const state = useEffectWizardState();
  const dispatch = useEffectWizardDispatch();
  const [modifierType, setModifierType] = useState('flat');
  
  const handleStatModifiersChange = (statModifiers) => {
    dispatch({
      type: 'UPDATE_BUFF_CONFIG',
      payload: {
        statModifiers: {
          ...state.buffConfig.statModifiers,
          ...statModifiers
        }
      }
    });
  };
  
  const selectedModifiers = {};
  COMBAT_STAT_MODIFIERS.forEach(stat => {
    if (state.buffConfig.statModifiers[stat.id] !== undefined) {
      selectedModifiers[stat.id] = state.buffConfig.statModifiers[stat.id];
    }
  });
  
  return (
    <WizardStepContainer
      stepId={stepId}
      currentStepId={currentStepId}
      flow={state.wizardFlow}
      state={state}
    >
      <div className="buff-combat-stats">
        <div className="modifier-type-selection">
          <h3>Modifier Type</h3>
          <div className="modifier-options">
            <label>
              <input 
                type="radio" 
                name="modifierType" 
                value="flat" 
                checked={modifierType === 'flat'} 
                onChange={() => setModifierType('flat')} 
              />
              Flat Bonus (e.g. +2 Attack Bonus)
            </label>
            <label>
              <input 
                type="radio" 
                name="modifierType" 
                value="percentage" 
                checked={modifierType === 'percentage'} 
                onChange={() => setModifierType('percentage')} 
              />
              Percentage Bonus (e.g. +10% Critical Chance)
            </label>
          </div>
          <p className="helper-text">
            Combat statistics can dramatically affect battle effectiveness. Consider combining offensive and defensive bonuses for balanced buffs.
          </p>
        </div>
        
        <StatModifierSelector 
          selectedModifiers={selectedModifiers}
          onChange={handleStatModifiersChange}
          statCategories={['combat']}
        />
        
        <div className="combat-tips">
          <h3>Combat Enhancement Tips</h3>
          <ul>
            <li><strong>Attack & Damage:</strong> Directly increases offensive output</li>
            <li><strong>Critical Hit:</strong> Chance and damage modifiers become more powerful with high damage weapons</li>
            <li><strong>Action Points:</strong> More actions means more opportunities to act in combat</li>
            <li><strong>Area Damage:</strong> Enhances AoE spells when fighting groups of enemies</li>
          </ul>
        </div>
      </div>
    </WizardStepContainer>
  );
};

/**
 * SpellPowerBuffPage - Component for configuring spell damage type buffs
 */
export const SpellPowerBuffPage = ({ stepId, currentStepId }) => {
  const state = useEffectWizardState();
  const dispatch = useEffectWizardDispatch();
  
  const handleSpellPowerChange = (spellTypeId, value) => {
    const spellPowerModifiers = {
      ...state.buffConfig.spellPowerModifiers || {},
      [spellTypeId]: parseInt(value, 10)
    };
    
    dispatch({
      type: 'UPDATE_BUFF_CONFIG',
      payload: { spellPowerModifiers }
    });
  };
  
  const resetSpellPower = (spellTypeId) => {
    const spellPowerModifiers = { ...state.buffConfig.spellPowerModifiers || {} };
    delete spellPowerModifiers[spellTypeId];
    
    dispatch({
      type: 'UPDATE_BUFF_CONFIG',
      payload: { spellPowerModifiers }
    });
  };
  
  // Group spell damage modifiers by category
  const spellCategories = {};
  SPELL_DAMAGE_MODIFIERS.forEach(modifier => {
    if (!spellCategories[modifier.schoolCategory]) {
      spellCategories[modifier.schoolCategory] = [];
    }
    spellCategories[modifier.schoolCategory].push(modifier);
  });
  
  return (
    <WizardStepContainer
      stepId={stepId}
      currentStepId={currentStepId}
      flow={state.wizardFlow}
      state={state}
    >
      <div className="spell-power-buffs">
        <div className="instruction-text">
          <p>Select spell damage types to enhance. The modifiers will increase damage dealt by spells of that type.</p>
        </div>
        
        {Object.entries(spellCategories).map(([category, modifiers]) => (
          <div key={category} className="spell-category">
            <h3>{category.charAt(0).toUpperCase() + category.slice(1)} Magic</h3>
            <div className="spell-type-grid">
              {modifiers.map(spellType => (
                <div key={spellType.id} className="spell-type-card">
                  <div className="spell-icon">
                    <img src={getWowIconPath(spellType.icon)} alt={spellType.name} />
                  </div>
                  <div className="spell-info">
                    <h4>{spellType.name}</h4>
                    <p>{spellType.description}</p>
                    
                    {state.buffConfig.spellPowerModifiers && 
                     state.buffConfig.spellPowerModifiers[spellType.id] !== undefined ? (
                      <div className="spell-power-control">
                        <input 
                          type="range" 
                          min="5" 
                          max="50" 
                          step="5"
                          value={state.buffConfig.spellPowerModifiers[spellType.id]}
                          onChange={(e) => handleSpellPowerChange(spellType.id, e.target.value)}
                        />
                        <div className="value-display">
                          <span>+{state.buffConfig.spellPowerModifiers[spellType.id]}%</span>
                          <button 
                            className="remove-btn"
                            onClick={() => resetSpellPower(spellType.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        className="add-spell-power-btn"
                        onClick={() => handleSpellPowerChange(spellType.id, spellType.defaultBonus || 10)}
                      >
                        Add {spellType.defaultBonus || 10}% Bonus
                      </button>
                    )}
                    
                    {spellType.effectsStatusEffect && (
                      <div className="spell-effect-note">
                        <span>Can enhance '{spellType.effectsStatusEffect}' status effects</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="universal-spell-power">
          <h3>Universal Spell Power</h3>
          <div className="universal-control">
            <div className="control-description">
              <p>Enhance all spell damage types equally</p>
            </div>
            
            {state.buffConfig.spellPowerModifiers && 
             state.buffConfig.spellPowerModifiers.universal_spell_power !== undefined ? (
              <div className="spell-power-control wide">
                <input 
                  type="range" 
                  min="5" 
                  max="30" 
                  step="5"
                  value={state.buffConfig.spellPowerModifiers.universal_spell_power}
                  onChange={(e) => handleSpellPowerChange('universal_spell_power', e.target.value)}
                />
                <div className="value-display">
                  <span>+{state.buffConfig.spellPowerModifiers.universal_spell_power}% to ALL spell damage</span>
                  <button 
                    className="remove-btn"
                    onClick={() => resetSpellPower('universal_spell_power')}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              <button 
                className="add-spell-power-btn wide"
                onClick={() => handleSpellPowerChange('universal_spell_power', 10)}
              >
                Add Universal Spell Power (+10%)
              </button>
            )}
          </div>
        </div>
      </div>
    </WizardStepContainer>
  );
};

/**
 * ResistancesBuffPage - Component for configuring damage resistances
 */
export const ResistancesBuffPage = ({ stepId, currentStepId }) => {
  const state = useEffectWizardState();
  const dispatch = useEffectWizardDispatch();
  
  const handleResistanceChange = (resistanceId, value) => {
    const resistances = {
      ...state.buffConfig.resistances || {},
      [resistanceId]: parseInt(value, 10)
    };
    
    dispatch({
      type: 'UPDATE_BUFF_CONFIG',
      payload: { resistances }
    });
  };
  
  const resetResistance = (resistanceId) => {
    const resistances = { ...state.buffConfig.resistances || {} };
    delete resistances[resistanceId];
    
    dispatch({
      type: 'UPDATE_BUFF_CONFIG',
      payload: { resistances }
    });
  };
  
  // Group resistances by category
  const resistanceCategories = {};
  RESISTANCE_TYPES.forEach(resistance => {
    if (!resistanceCategories[resistance.category]) {
      resistanceCategories[resistance.category] = [];
    }
    resistanceCategories[resistance.category].push(resistance);
  });
  
  return (
    <WizardStepContainer
      stepId={stepId}
      currentStepId={currentStepId}
      flow={state.wizardFlow}
      state={state}
    >
      <div className="resistance-buffs">
        <div className="instruction-text">
          <p>Select damage types to grant resistance against. Resistance reduces damage taken from that source.</p>
        </div>
        
        {Object.entries(resistanceCategories).map(([category, resistances]) => (
          <div key={category} className="resistance-category">
            <h3>{category.charAt(0).toUpperCase() + category.slice(1)} Resistances</h3>
            <div className="resistance-type-grid">
              {resistances.map(resistance => (
                <div key={resistance.id} className="resistance-card">
                  <div className="resistance-icon">
                    <img src={getWowIconPath(resistance.icon)} alt={resistance.name} />
                  </div>
                  <div className="resistance-info">
                    <h4>{resistance.name}</h4>
                    <p>{resistance.description}</p>
                    
                    {state.buffConfig.resistances && 
                     state.buffConfig.resistances[resistance.id] !== undefined ? (
                      <div className="resistance-control">
                        <input 
                          type="range" 
                          min="10" 
                          max="75" 
                          step="5"
                          value={state.buffConfig.resistances[resistance.id]}
                          onChange={(e) => handleResistanceChange(resistance.id, e.target.value)}
                        />
                        <div className="value-display">
                          <span>{state.buffConfig.resistances[resistance.id]}% Resistance</span>
                          <button 
                            className="remove-btn"
                            onClick={() => resetResistance(resistance.id)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        className="add-resistance-btn"
                        onClick={() => handleResistanceChange(resistance.id, resistance.defaultReduction || 25)}
                      >
                        Add {resistance.defaultReduction || 25}% Resistance
                      </button>
                    )}
                    
                    {resistance.statusResistance && (
                      <div className="resistance-note">
                        <span>Also resists '{resistance.statusResistance}' status effects</span>
                      </div>
                    )}
                    
                    {resistance.rare && (
                      <div className="resistance-rare">
                        <span>Rare resistance type</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
        
        <div className="resistance-tips">
          <h3>Resistance Tips</h3>
          <ul>
            <li><strong>Common Enemies:</strong> Consider what damage types are common in your campaign</li>
            <li><strong>Stacking:</strong> Multiple sources of resistance may not fully stack</li>
            <li><strong>Immunity:</strong> 75% resistance is typically the maximum achievable</li>
            <li><strong>Vulnerabilities:</strong> Some enemies can bypass certain resistances</li>
          </ul>
        </div>
      </div>
    </WizardStepContainer>
  );
};

/**
 * BuffStatusEffectsPage - Component for configuring positive status effects
 */
export const BuffStatusEffectsPage = ({ stepId, currentStepId }) => {
  const state = useEffectWizardState();
  const dispatch = useEffectWizardDispatch();
  
  const selectedEffects = state.buffConfig.statusEffects || [];
  const effectParameters = state.buffConfig.effectParameters || {};
  
  const handleStatusEffectsChange = (newSelectedEffects, newEffectParameters) => {
    dispatch({
      type: 'UPDATE_BUFF_CONFIG',
      payload: {
        statusEffects: newSelectedEffects,
        effectParameters: newEffectParameters
      }
    });
  };
  
  return (
    <WizardStepContainer
      stepId={stepId}
      currentStepId={currentStepId}
      flow={state.wizardFlow}
      state={state}
    >
      <div className="buff-status-effects">
        <div className="instruction-text">
          <p>Select positive status effects to apply. Each effect has unique properties and can be configured.</p>
        </div>
        
        <StatusEffectSelector 
          selectedEffects={selectedEffects}
          effectParameters={effectParameters}
          onChange={handleStatusEffectsChange}
          effectType="positive"
        />
        
        <div className="effect-combinations">
          <h3>Powerful Effect Combinations</h3>
          <div className="combo-cards">
            <div className="combo-card">
              <h4>Tank Enhancer</h4>
              <p>Combine <strong>Regeneration</strong> with <strong>Resistance</strong> for excellent survivability</p>
            </div>
            <div className="combo-card">
              <h4>Swift Striker</h4>
              <p>Pair <strong>Haste</strong> with <strong>Empowered</strong> for maximum offensive capability</p>
            </div>
            <div className="combo-card">
              <h4>Arcane Guardian</h4>
              <p>Use <strong>Shielded</strong> with <strong>Energized</strong> for spellcasting protection</p>
            </div>
            <div className="combo-card">
              <h4>Scout Master</h4>
              <p>Combine <strong>Invisible</strong> with <strong>Truesight</strong> for perfect reconnaissance</p>
            </div>
          </div>
        </div>
        
        <div className="effect-guide">
          <h3>Status Effect Guide</h3>
          <div className="effect-categories">
            <div className="effect-category">
              <h4>Movement Effects</h4>
              <p>Flying, Haste, and similar effects that enhance mobility</p>
            </div>
            <div className="effect-category">
              <h4>Protection Effects</h4>
              <p>Shield, Resistance, and Regeneration for survivability</p>
            </div>
            <div className="effect-category">
              <h4>Enhancement Effects</h4>
              <p>Empowered, Energized, and other effects that boost capabilities</p>
            </div>
            <div className="effect-category">
              <h4>Perception Effects</h4>
              <p>Truesight and other effects that enhance awareness</p>
            </div>
          </div>
          <p className="effect-tip">
            <strong>Tip:</strong> More powerful effects often have higher action point costs!
          </p>
        </div>
      </div>
    </WizardStepContainer>
  );
};