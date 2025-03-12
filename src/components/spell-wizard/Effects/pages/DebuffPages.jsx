import React, { useState } from 'react';
import { 
  WizardStepContainer, 
  StatModifierSelector,
  StatusEffectSelector
} from './EffectWizardComponents';

import {
  PRIMARY_STAT_MODIFIERS,
  SECONDARY_STAT_MODIFIERS,
  COMBAT_STAT_MODIFIERS,
  NEGATIVE_STATUS_EFFECTS,
  getWowIconPath
} from './effectSystemData';

import { useEffectWizardState, useEffectWizardDispatch } from './EffectWizardContext';

/**
 * DebuffPrimaryStatsPage - Component for configuring primary stat debuffs
 */
export const DebuffPrimaryStatsPage = ({ stepId, currentStepId }) => {
  const state = useEffectWizardState();
  const dispatch = useEffectWizardDispatch();
  const [modifierType, setModifierType] = useState('flat');
  
  const handleStatModifiersChange = (statModifiers) => {
    // Convert positive values to negative for debuffs
    const negativeModifiers = {};
    Object.entries(statModifiers).forEach(([statId, value]) => {
      // If the value is positive, make it negative
      // If it's already negative, keep it as is
      negativeModifiers[statId] = value > 0 ? -value : value;
    });
    
    dispatch({
      type: 'UPDATE_DEBUFF_CONFIG',
      payload: {
        statModifiers: {
          ...state.debuffConfig.statModifiers,
          ...negativeModifiers
        }
      }
    });
  };
  
  // Extract only primary stats from current state
  const selectedModifiers = {};
  PRIMARY_STAT_MODIFIERS.forEach(stat => {
    if (state.debuffConfig.statModifiers && state.debuffConfig.statModifiers[stat.id] !== undefined) {
      // Store the absolute value for display purposes
      selectedModifiers[stat.id] = Math.abs(state.debuffConfig.statModifiers[stat.id]);
    }
  });
  
  return (
    <WizardStepContainer
      stepId={stepId}
      currentStepId={currentStepId}
      flow={state.wizardFlow}
      state={state}
    >
      <div className="debuff-primary-stats">
        <div className="modifier-type-selection">
          <h3>Debuff Type</h3>
          <div className="modifier-options">
            <label>
              <input 
                type="radio" 
                name="modifierType" 
                value="flat" 
                checked={modifierType === 'flat'} 
                onChange={() => setModifierType('flat')} 
              />
              Flat Penalty (e.g. -2 Strength)
            </label>
            <label>
              <input 
                type="radio" 
                name="modifierType" 
                value="percentage" 
                checked={modifierType === 'percentage'} 
                onChange={() => setModifierType('percentage')} 
              />
              Percentage Reduction (e.g. -20% Strength)
            </label>
          </div>
          <p className="helper-text">
            {modifierType === 'flat' 
              ? 'Flat penalties directly reduce the attribute value. This is more impactful against low-level targets.' 
              : 'Percentage reductions scale with the target\'s base attribute and are effective against high-level targets.'}
          </p>
        </div>
        
        <div className="debuff-notice">
          <h3>Primary Attribute Penalties</h3>
          <p>Reducing primary attributes affects all derived statistics, making these debuffs particularly potent.</p>
          <ul className="effect-examples">
            <li><strong>Strength penalties</strong> reduce melee attack damage and carrying capacity</li>
            <li><strong>Dexterity penalties</strong> lower AC, initiative, and ranged attacks</li>
            <li><strong>Constitution penalties</strong> can reduce max health and fortitude saves</li>
            <li><strong>Intelligence penalties</strong> might reduce available action points</li>
            <li><strong>Spirit penalties</strong> lower perception and willpower saves</li>
            <li><strong>Charisma penalties</strong> weaken social interactions and certain spell types</li>
          </ul>
        </div>
        
        <StatModifierSelector 
          selectedModifiers={selectedModifiers}
          onChange={handleStatModifiersChange}
          statCategories={['primary']}
          maxSelections={3} // Limiting selections to prevent overwhelming debuffs
        />
      </div>
    </WizardStepContainer>
  );
};

/**
 * DebuffSecondaryStatsPage - Component for configuring secondary stat debuffs
 */
export const DebuffSecondaryStatsPage = ({ stepId, currentStepId }) => {
  const state = useEffectWizardState();
  const dispatch = useEffectWizardDispatch();
  const [modifierType, setModifierType] = useState('flat');
  
  const handleStatModifiersChange = (statModifiers) => {
    // Convert positive values to negative for debuffs
    const negativeModifiers = {};
    Object.entries(statModifiers).forEach(([statId, value]) => {
      negativeModifiers[statId] = value > 0 ? -value : value;
    });
    
    dispatch({
      type: 'UPDATE_DEBUFF_CONFIG',
      payload: {
        statModifiers: {
          ...state.debuffConfig.statModifiers,
          ...negativeModifiers
        }
      }
    });
  };
  
  // Extract only secondary stats from current state
  const selectedModifiers = {};
  SECONDARY_STAT_MODIFIERS.forEach(stat => {
    if (state.debuffConfig.statModifiers && state.debuffConfig.statModifiers[stat.id] !== undefined) {
      selectedModifiers[stat.id] = Math.abs(state.debuffConfig.statModifiers[stat.id]);
    }
  });
  
  return (
    <WizardStepContainer
      stepId={stepId}
      currentStepId={currentStepId}
      flow={state.wizardFlow}
      state={state}
    >
      <div className="debuff-secondary-stats">
        <div className="modifier-type-selection">
          <h3>Debuff Type</h3>
          <div className="modifier-options">
            <label>
              <input 
                type="radio" 
                name="modifierType" 
                value="flat" 
                checked={modifierType === 'flat'} 
                onChange={() => setModifierType('flat')} 
              />
              Flat Penalty (e.g. -2 AC)
            </label>
            <label>
              <input 
                type="radio" 
                name="modifierType" 
                value="percentage" 
                checked={modifierType === 'percentage'} 
                onChange={() => setModifierType('percentage')} 
              />
              Percentage Reduction (e.g. -30% Movement Speed)
            </label>
          </div>
          <p className="helper-text">
            Secondary attributes like speed, AC, and initiative are vital for combat positioning and survival.
            Debuffing these can dramatically reduce a target's combat effectiveness.
          </p>
        </div>
        
        <div className="debuff-recommendations">
          <h3>Recommended Debuffs</h3>
          <div className="recommendations-grid">
            <div className="recommendation">
              <h4>Against Spellcasters</h4>
              <p>Focus on <strong>Action Points</strong> and <strong>Energy Shield</strong> debuffs</p>
            </div>
            <div className="recommendation">
              <h4>Against Tanks</h4>
              <p>Focus on <strong>AC</strong> and <strong>Magic Resistance</strong> debuffs</p>
            </div>
            <div className="recommendation">
              <h4>Against Mobile Enemies</h4>
              <p>Focus on <strong>Speed</strong> and <strong>Initiative</strong> debuffs</p>
            </div>
            <div className="recommendation">
              <h4>Against Healers</h4>
              <p>Focus on <strong>Healing Received</strong> and <strong>Spell DC</strong> debuffs</p>
            </div>
          </div>
        </div>
        
        <StatModifierSelector 
          selectedModifiers={selectedModifiers}
          onChange={handleStatModifiersChange}
          statCategories={['secondary']}
          maxSelections={3}
        />
      </div>
    </WizardStepContainer>
  );
};

/**
 * DebuffCombatStatsPage - Component for configuring combat stat debuffs
 */
export const DebuffCombatStatsPage = ({ stepId, currentStepId }) => {
  const state = useEffectWizardState();
  const dispatch = useEffectWizardDispatch();
  const [modifierType, setModifierType] = useState('flat');
  
  const handleStatModifiersChange = (statModifiers) => {
    // Convert positive values to negative for debuffs
    const negativeModifiers = {};
    Object.entries(statModifiers).forEach(([statId, value]) => {
      negativeModifiers[statId] = value > 0 ? -value : value;
    });
    
    dispatch({
      type: 'UPDATE_DEBUFF_CONFIG',
      payload: {
        statModifiers: {
          ...state.debuffConfig.statModifiers,
          ...negativeModifiers
        }
      }
    });
  };
  
  // Extract only combat stats from current state
  const selectedModifiers = {};
  COMBAT_STAT_MODIFIERS.forEach(stat => {
    if (state.debuffConfig.statModifiers && state.debuffConfig.statModifiers[stat.id] !== undefined) {
      selectedModifiers[stat.id] = Math.abs(state.debuffConfig.statModifiers[stat.id]);
    }
  });
  
  return (
    <WizardStepContainer
      stepId={stepId}
      currentStepId={currentStepId}
      flow={state.wizardFlow}
      state={state}
    >
      <div className="debuff-combat-stats">
        <div className="modifier-type-selection">
          <h3>Debuff Type</h3>
          <div className="modifier-options">
            <label>
              <input 
                type="radio" 
                name="modifierType" 
                value="flat" 
                checked={modifierType === 'flat'} 
                onChange={() => setModifierType('flat')} 
              />
              Flat Penalty (e.g. -2 Attack Bonus)
            </label>
            <label>
              <input 
                type="radio" 
                name="modifierType" 
                value="percentage" 
                checked={modifierType === 'percentage'} 
                onChange={() => setModifierType('percentage')} 
              />
              Percentage Reduction (e.g. -25% Critical Damage)
            </label>
          </div>
          <p className="helper-text">
            Combat statistic debuffs directly impact battle performance and can turn the tide against powerful enemies.
          </p>
        </div>
        
        <div className="combat-debuff-tips">
          <h3>Combat Debuff Tactics</h3>
          <div className="tactics-container">
            <div className="tactic">
              <h4>Defensive Debuffs</h4>
              <p>Reduce the target's <strong>Attack Bonus</strong>, <strong>Damage Bonus</strong>, and <strong>Crit Chance</strong> to minimize their offensive capabilities.</p>
            </div>
            <div className="tactic">
              <h4>Offensive Vulnerability</h4>
              <p>Lower <strong>Evasion</strong> and <strong>Save Bonus</strong> to make the target more vulnerable to attacks and effects.</p>
            </div>
            <div className="tactic">
              <h4>Resource Drain</h4>
              <p>Reduce <strong>Action Point Regen</strong> and <strong>Cooldown Reduction</strong> to limit their tactical options.</p>
            </div>
            <div className="tactic">
              <h4>Magical Weakness</h4>
              <p>Target <strong>Spell Penetration</strong> and <strong>Spell DC</strong> against spellcasters to significantly hamper their effectiveness.</p>
            </div>
          </div>
        </div>
        
        <StatModifierSelector 
          selectedModifiers={selectedModifiers}
          onChange={handleStatModifiersChange}
          statCategories={['combat']}
          maxSelections={4}
        />
        
        <div className="effect-stacking-notice">
          <h4>About Effect Stacking</h4>
          <p>Multiple combat debuffs can create devastating combinations, but enemies with higher levels may have resistance to certain debuff types.</p>
        </div>
      </div>
    </WizardStepContainer>
  );
};

/**
 * DebuffStatusEffectsPage - Component for configuring negative status effects
 */
export const DebuffStatusEffectsPage = ({ stepId, currentStepId }) => {
  const state = useEffectWizardState();
  const dispatch = useEffectWizardDispatch();
  
  const selectedEffects = state.debuffConfig.statusEffects || [];
  const effectParameters = state.debuffConfig.effectParameters || {};
  
  const handleStatusEffectsChange = (newSelectedEffects, newEffectParameters) => {
    dispatch({
      type: 'UPDATE_DEBUFF_CONFIG',
      payload: {
        statusEffects: newSelectedEffects,
        effectParameters: newEffectParameters
      }
    });
  };

  const getStatusEffectSeverityClass = (effectId) => {
    const effect = NEGATIVE_STATUS_EFFECTS.find(e => e.id === effectId);
    if (!effect) return '';
    
    if (['paralyzed', 'stunned', 'charmed'].includes(effectId)) {
      return 'severe-effect';
    } else if (['blinded', 'frightened', 'poisoned'].includes(effectId)) {
      return 'moderate-effect';
    } else {
      return 'mild-effect';
    }
  };
  
  return (
    <WizardStepContainer
      stepId={stepId}
      currentStepId={currentStepId}
      flow={state.wizardFlow}
      state={state}
    >
      <div className="debuff-status-effects">
        <div className="status-effect-intro">
          <h3>Negative Status Effects</h3>
          <p>
            These powerful debuffs can dramatically alter a target's capabilities. 
            Unlike stat penalties, status effects often completely prevent certain actions 
            or create compound penalties.
          </p>
          <div className="effect-severity-key">
            <div className="severity-level severe-effect">
              <span className="dot"></span>
              <span>Severe Effects</span>
              <span className="description">Can completely incapacitate targets</span>
            </div>
            <div className="severity-level moderate-effect">
              <span className="dot"></span>
              <span>Moderate Effects</span>
              <span className="description">Significantly hinder target capabilities</span>
            </div>
            <div className="severity-level mild-effect">
              <span className="dot"></span>
              <span>Mild Effects</span>
              <span className="description">Create disadvantages without complete restriction</span>
            </div>
          </div>
        </div>
        
        <StatusEffectSelector 
          selectedEffects={selectedEffects}
          effectParameters={effectParameters}
          onChange={handleStatusEffectsChange}
          effectType="negative"
          maxSelections={3} // Limit to avoid overwhelming complexity
        />
        
        <div className="save-types-reference">
          <h3>Save Types Reference</h3>
          <p>Different effects allow different types of saving throws to resist:</p>
          <div className="save-types-grid">
            <div className="save-type">
              <h4>Strength</h4>
              <p>Resists: Restrained, Knockdown, Physical Force</p>
            </div>
            <div className="save-type">
              <h4>Dexterity</h4>
              <p>Resists: Burning, Area Effects, Traps</p>
            </div>
            <div className="save-type">
              <h4>Constitution</h4>
              <p>Resists: Poison, Disease, Exhaustion, Stun</p>
            </div>
            <div className="save-type">
              <h4>Intelligence</h4>
              <p>Resists: Illusions, Memory Effects</p>
            </div>
            <div className="save-type">
              <h4>Wisdom</h4>
              <p>Resists: Charm, Fear, Mind Control</p>
            </div>
            <div className="save-type">
              <h4>Charisma</h4>
              <p>Resists: Banishment, Possession</p>
            </div>
          </div>
        </div>
        
        <div className="effect-combinations">
          <h3>Powerful Debuff Combinations</h3>
          <div className="combo-cards">
            <div className="combo-card">
              <h4>Total Lockdown</h4>
              <p>Combine <strong>Restrained</strong> with <strong>Silenced</strong> to prevent both movement and spellcasting</p>
            </div>
            <div className="combo-card">
              <h4>Combat Disabler</h4>
              <p>Pair <strong>Blinded</strong> with <strong>Frightened</strong> for serious combat disadvantages</p>
            </div>
            <div className="combo-card">
              <h4>Deadly Deterioration</h4>
              <p>Use <strong>Poisoned</strong> with <strong>Slowed</strong> for damage over time while preventing escape</p>
            </div>
            <div className="combo-card">
              <h4>Tactical Advantage</h4>
              <p>Combine <strong>Prone</strong> with <strong>Weakened</strong> to set up allies for critical strikes</p>
            </div>
          </div>
        </div>
      </div>
    </WizardStepContainer>
  );
};