import React, { useState, useEffect, useCallback } from 'react';
import { useSpellWizardState, useSpellWizardDispatch, actionCreators } from '../../context/spellWizardContext';
import WizardStep from '../common/WizardStep';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEye, faBolt, faSkull, faSkullCrossbones, faPlus, faTrash,
  faChevronDown, faChevronRight, faShieldAlt, faBan, faCrosshairs,
  faLink, faHourglassHalf, faFire
} from '@fortawesome/free-solid-svg-icons';

const STAT_OPTIONS = [
  'ALL ROLLS', 'Attack Rolls', 'Ability Checks', 'Saving Throws',
  'Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma',
  'Armor Class', 'Movement Speed', 'Damage', 'Healing'
];

const SAVE_TYPE_OPTIONS = ['Strength', 'Dexterity', 'Constitution', 'Intelligence', 'Wisdom', 'Charisma'];

const emptyOutcome = (havocGain = 0) => ({
  damage: '',
  effectName: '',
  duration: 0,
  durationUnit: 'rounds',
  damagePerRound: '',
  damagePerRoundType: '',
  statModifiers: [],
  healingBlock: false,
  bonusDamageTaken: '',
  bonusDamageType: '',
  saveDC: 0,
  saveType: 'Constitution',
  instantKill: false,
  instantKillThreshold: 0,
  cascadeDamage: '',
  cascadeRange: 0,
  description: '',
  havocGain
});

const OutcomeConfigPanel = ({ title, tier, outcome, onChange, tierClass }) => {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const update = (field, value) => {
    onChange({ ...outcome, [field]: value });
  };

  const addStatMod = () => {
    update('statModifiers', [...(outcome.statModifiers || []), { stat: 'ALL ROLLS', value: -1 }]);
  };

  const removeStatMod = (index) => {
    const mods = [...(outcome.statModifiers || [])];
    mods.splice(index, 1);
    update('statModifiers', mods);
  };

  const updateStatMod = (index, field, value) => {
    const mods = [...(outcome.statModifiers || [])];
    mods[index] = { ...mods[index], [field]: value };
    update('statModifiers', mods);
  };

  const hasAdvancedFields = outcome.damagePerRound || (outcome.statModifiers && outcome.statModifiers.length > 0) ||
    outcome.healingBlock || outcome.bonusDamageTaken || outcome.saveDC > 0 ||
    outcome.instantKill || outcome.cascadeDamage || outcome.description;

  return (
    <div className={`outcome-config-group-pf ${tier}`}>
      <div className="outcome-header-row" onClick={() => setShowAdvanced(!showAdvanced)}>
        <h6 className="outcome-title-pf">{title}</h6>
        <FontAwesomeIcon icon={showAdvanced ? faChevronDown : faChevronRight} className="outcome-collapse-icon" />
      </div>

      <div className="outcome-primary-fields">
        <div className="config-row-pf">
          <label>Damage Formula:</label>
          <input
            type="text"
            value={outcome.damage || ''}
            onChange={(e) => update('damage', e.target.value)}
            placeholder="e.g. 4d8, 3d6 fire + 1d6 force"
            className="pf-config-input-wide"
          />
        </div>

        <div className="config-row-pf">
          <label>Effect Name:</label>
          <input
            type="text"
            value={outcome.effectName || ''}
            onChange={(e) => update('effectName', e.target.value)}
            placeholder="e.g. Weakened, Soul Wound, Stunned"
            className="pf-config-input-wide"
          />
        </div>

        <div className="config-row-pf">
          <label>Havoc Gain:</label>
          <input
            type="number"
            min="0"
            max="20"
            value={outcome.havocGain !== undefined ? outcome.havocGain : 0}
            onChange={(e) => update('havocGain', parseInt(e.target.value) || 0)}
            className="pf-config-input-small"
          />
        </div>
      </div>

      <div className="outcome-advanced-toggle" onClick={() => setShowAdvanced(!showAdvanced)}>
        <span>Advanced Options</span>
        {hasAdvancedFields && <span className="advanced-indicator">configured</span>}
      </div>

      {showAdvanced && (
        <div className="outcome-advanced-fields">
          <div className="config-row-pf">
            <label>Duration:</label>
            <input
              type="number"
              min="0"
              max="99"
              value={outcome.duration || 0}
              onChange={(e) => update('duration', parseInt(e.target.value) || 0)}
              className="pf-config-input-small"
            />
            <select
              value={outcome.durationUnit || 'rounds'}
              onChange={(e) => update('durationUnit', e.target.value)}
              className="pf-config-select prophecy-unit-select"
            >
              <option value="rounds">Rounds</option>
              <option value="turns">Turns</option>
              <option value="minutes">Minutes</option>
              <option value="hours">Hours</option>
              <option value="round">Round (1)</option>
            </select>
          </div>

          <div className="config-row-pf">
            <label>DoT / Round:</label>
            <input
              type="text"
              value={outcome.damagePerRound || ''}
              onChange={(e) => update('damagePerRound', e.target.value)}
              placeholder="e.g. 1d6"
              className="pf-config-input-small"
            />
            <select
              value={outcome.damagePerRoundType || ''}
              onChange={(e) => update('damagePerRoundType', e.target.value)}
              className="pf-config-select prophecy-unit-select"
            >
              <option value="">None</option>
              <option value="fire">Fire</option>
              <option value="necrotic">Necrotic</option>
              <option value="psychic">Psychic</option>
              <option value="force">Force</option>
              <option value="lightning">Lightning</option>
              <option value="frost">Frost</option>
              <option value="poison">Poison</option>
              <option value="physical">Physical</option>
              <option value="chaos">Chaos</option>
              <option value="void">Void</option>
              <option value="radiant">Radiant</option>
            </select>
          </div>

          <div className="prophecy-stat-mods-section">
            <div className="stat-mods-header">
              <label className="config-label">Stat Modifiers</label>
              <button type="button" className="pf-btn-tiny" onClick={addStatMod}>
                <FontAwesomeIcon icon={faPlus} /> Add
              </button>
            </div>
            {outcome.statModifiers && outcome.statModifiers.map((mod, i) => (
              <div key={i} className="config-row-pf stat-mod-row">
                <select
                  value={mod.stat}
                  onChange={(e) => updateStatMod(i, 'stat', e.target.value)}
                  className="pf-config-select prophecy-stat-select"
                >
                  {STAT_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
                <input
                  type="number"
                  value={mod.value}
                  onChange={(e) => updateStatMod(i, 'value', parseInt(e.target.value) || 0)}
                  className="pf-config-input-tiny"
                />
                <button type="button" className="pf-btn-icon-danger" onClick={() => removeStatMod(i)}>
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            ))}
          </div>

          <div className="prophecy-toggles-section">
            <div className="prophecy-toggle-row">
              <label>
                <input
                  type="checkbox"
                  checked={!!outcome.healingBlock}
                  onChange={(e) => update('healingBlock', e.target.checked)}
                />
                <FontAwesomeIcon icon={faBan} className="toggle-icon" /> No Healing
              </label>
            </div>

            <div className="prophecy-toggle-row">
              <label>
                <input
                  type="checkbox"
                  checked={!!outcome.instantKill}
                  onChange={(e) => update('instantKill', e.target.checked)}
                />
                <FontAwesomeIcon icon={faSkull} className="toggle-icon" /> Instant Kill
              </label>
            </div>

            {outcome.instantKill && (
              <div className="config-row-pf" style={{ paddingLeft: '20px' }}>
                <label>HP Threshold:</label>
                <input
                  type="number"
                  min="0"
                  max="1"
                  step="0.05"
                  value={outcome.instantKillThreshold || 0}
                  onChange={(e) => update('instantKillThreshold', parseFloat(e.target.value) || 0)}
                  className="pf-config-input-small"
                  placeholder="0.3 = 30%"
                />
                <span className="pf-hint">fraction of HP (e.g. 0.3 = below 30%)</span>
              </div>
            )}
          </div>

          <div className="config-row-pf">
            <label>
              <FontAwesomeIcon icon={faShieldAlt} className="toggle-icon" /> Save DC:
            </label>
            <input
              type="number"
              min="0"
              max="30"
              value={outcome.saveDC || 0}
              onChange={(e) => update('saveDC', parseInt(e.target.value) || 0)}
              className="pf-config-input-small"
              placeholder="0"
            />
            <select
              value={outcome.saveType || 'Constitution'}
              onChange={(e) => update('saveType', e.target.value)}
              className="pf-config-select prophecy-unit-select"
            >
              {SAVE_TYPE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          <div className="config-row-pf">
            <label>
              <FontAwesomeIcon icon={faCrosshairs} className="toggle-icon" /> Bonus Damage Taken:
            </label>
            <input
              type="number"
              min="0"
              value={outcome.bonusDamageTaken || ''}
              onChange={(e) => update('bonusDamageTaken', e.target.value)}
              className="pf-config-input-small"
              placeholder="0"
            />
            <select
              value={outcome.bonusDamageType || ''}
              onChange={(e) => update('bonusDamageType', e.target.value)}
              className="pf-config-select prophecy-unit-select"
            >
              <option value="">None</option>
              <option value="fire">Fire</option>
              <option value="necrotic">Necrotic</option>
              <option value="psychic">Psychic</option>
              <option value="force">Force</option>
              <option value="lightning">Lightning</option>
              <option value="frost">Frost</option>
              <option value="physical">Physical</option>
              <option value="chaos">Chaos</option>
              <option value="void">Void</option>
              <option value="radiant">Radiant</option>
              <option value="all">All</option>
            </select>
          </div>

          <div className="config-row-pf">
            <label>
              <FontAwesomeIcon icon={faLink} className="toggle-icon" /> Cascade Damage:
            </label>
            <input
              type="text"
              value={outcome.cascadeDamage || ''}
              onChange={(e) => update('cascadeDamage', e.target.value)}
              placeholder="e.g. 2d6"
              className="pf-config-input-small"
            />
            <input
              type="number"
              min="0"
              value={outcome.cascadeRange || 0}
              onChange={(e) => update('cascadeRange', parseInt(e.target.value) || 0)}
              className="pf-config-input-small"
              placeholder="Range ft"
            />
            <span className="pf-hint">ft</span>
          </div>

          <div className="config-row-pf">
            <label>Description:</label>
            <textarea
              value={outcome.description || ''}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Brief description of this outcome..."
              className="pf-config-textarea"
              rows={2}
            />
          </div>
        </div>
      )}
    </div>
  );
};

const ProphecyStep = ({ stepNumber, totalSteps, onNext, onPrevious, isActive }) => {
  const state = useSpellWizardState();
  const dispatch = useSpellWizardDispatch();

  const migrateOldFormat = (old) => {
    if (old && old.prophesied && typeof old.prophesied === 'object' && !old.prophesied.effectName) {
      return old;
    }
    if (old && old.prophesiedHavoc !== undefined) {
      return {
        rangeDice: old.rangeDice || 'd8+d6',
        resolutionDie: old.resolutionDie || 'd6',
        prophesied: {
          ...emptyOutcome(3),
          havocGain: old.prophesiedHavoc || 3,
          effectName: old.prophesiedEffect || ''
        },
        base: {
          ...emptyOutcome(1),
          havocGain: old.baseHavoc || 1,
          effectName: old.baseEffect || ''
        },
        outside: {
          ...emptyOutcome(0),
          backlash: old.outsideBacklash || '',
          havocGain: old.outsideHavoc || 0
        }
      };
    }
    return old;
  };

  const [prophecyOptions, setProphecyOptions] = useState(() => {
    const raw = state.prophecyOptions;
    if (!raw) {
      return {
        rangeDice: 'd8+d6',
        resolutionDie: 'd6',
        prophesied: emptyOutcome(3),
        base: emptyOutcome(1),
        outside: { ...emptyOutcome(0), backlash: '1d6 necrotic to self' }
      };
    }
    return migrateOldFormat(raw);
  });

  useEffect(() => {
    dispatch(actionCreators.updateProphecyConfig(prophecyOptions));
  }, [prophecyOptions, dispatch]);

  const handleOptionChange = (field, value) => {
    setProphecyOptions(prev => ({ ...prev, [field]: value }));
  };

  const updateOutcome = (tier, outcome) => {
    setProphecyOptions(prev => ({ ...prev, [tier]: outcome }));
  };

  const isStepValid = () => {
    return !!prophecyOptions.rangeDice && !!prophecyOptions.resolutionDie;
  };

  const handleNext = () => {
    if (isStepValid()) {
      onNext();
    }
  };

  const hints = [
    "The Prediction Range determines the target window for a successful prophecy.",
    "The Resolution Die is rolled against this range. If it falls within, the prophecy is fulfilled.",
    "Prophesied outcomes are the most powerful and usually grant significant Havoc.",
    "Base outcomes occur if the prediction is missed but the resolution doesn't fail.",
    "Outside outcomes occur if the resolution fails, causing Backlash.",
    "Use Advanced Options to add DoT, stat modifiers, healing blocks, save DCs, and more."
  ];

  return (
    <WizardStep
      title="Prophecy Configuration"
      stepNumber={stepNumber}
      totalSteps={totalSteps}
      isCompleted={isStepValid()}
      isActive={isActive}
      onNext={handleNext}
      onPrevious={onPrevious}
      disableNext={!isStepValid()}
      showHints={true}
      hints={hints}
    >
      <div className="prophecy-system-config wizard-prophecy-container">
        <div className="mechanics-header-pathfinder">
          <div className="mechanics-title-section">
            <h3>Doomsayer Prophecy</h3>
            <p className="mechanics-subtitle">Define the fate and resolution of this spell</p>
          </div>
        </div>

        <div className="mechanics-configuration-section">
          <div className="config-section">
            <div className="config-section-header">
              <FontAwesomeIcon icon={faEye} className="config-icon" />
              <h5>Resolution Mechanics</h5>
            </div>

            <div className="config-field">
              <label className="config-label">Prediction Range</label>
              <div className="config-description">The dice combination used to determine the prophecy window</div>
              <div className="pf-select-wrapper">
                <select
                  value={prophecyOptions.rangeDice}
                  onChange={(e) => handleOptionChange('rangeDice', e.target.value)}
                  className="pf-config-select"
                >
                  <option value="d4+d4">d4+d4 (2-8, Avg 5)</option>
                  <option value="d6+d4">d6+d4 (2-10, Avg 6)</option>
                  <option value="d6+d6">d6+d6 (2-12, Avg 7)</option>
                  <option value="d8+d6">d8+d6 (2-14, Avg 8)</option>
                  <option value="d10+d8">d10+d8 (2-18, Avg 10)</option>
                  <option value="d12+d10">d12+d10 (2-22, Avg 12)</option>
                </select>
              </div>
            </div>

            <div className="config-field">
              <label className="config-label">Resolution Die</label>
              <div className="config-description">The die rolled against the prediction range</div>
              <div className="pf-select-wrapper">
                <select
                  value={prophecyOptions.resolutionDie}
                  onChange={(e) => handleOptionChange('resolutionDie', e.target.value)}
                  className="pf-config-select"
                >
                  <option value="d4">d4</option>
                  <option value="d6">d6</option>
                  <option value="d8">d8</option>
                  <option value="d10">d10</option>
                  <option value="d12">d12</option>
                  <option value="d20">d20</option>
                </select>
              </div>
            </div>

            <OutcomeConfigPanel
              title="Prophesied Outcome (Prediction Hit)"
              tier="prophesied"
              outcome={prophecyOptions.prophesied || emptyOutcome(3)}
              onChange={(o) => updateOutcome('prophesied', o)}
              tierClass="prophesied"
            />

            <OutcomeConfigPanel
              title="Base Outcome (Prediction Miss)"
              tier="base"
              outcome={prophecyOptions.base || emptyOutcome(1)}
              onChange={(o) => updateOutcome('base', o)}
              tierClass="base"
            />

            <div className="outcome-config-group-pf outside">
              <h6 className="outcome-title-pf outside">Outside Outcome (Resolution Failure)</h6>

              <div className="config-row-pf">
                <label>Backlash:</label>
                <input
                  type="text"
                  value={prophecyOptions.outside?.backlash || ''}
                  onChange={(e) => updateOutcome('outside', { ...(prophecyOptions.outside || emptyOutcome(0)), backlash: e.target.value })}
                  placeholder="e.g. 1d6 necrotic to self"
                  className="pf-config-input-wide"
                />
              </div>

              <div className="config-row-pf">
                <label>Havoc Gain:</label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={prophecyOptions.outside?.havocGain !== undefined ? prophecyOptions.outside.havocGain : 0}
                  onChange={(e) => updateOutcome('outside', { ...(prophecyOptions.outside || emptyOutcome(0)), havocGain: parseInt(e.target.value) || 0 })}
                  className="pf-config-input-small"
                />
              </div>

              <div className="config-row-pf">
                <label>Description:</label>
                <textarea
                  value={prophecyOptions.outside?.description || ''}
                  onChange={(e) => updateOutcome('outside', { ...(prophecyOptions.outside || emptyOutcome(0)), description: e.target.value })}
                  placeholder="Description of the backlash..."
                  className="pf-config-textarea"
                  rows={2}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </WizardStep>
  );
};

export default ProphecyStep;
