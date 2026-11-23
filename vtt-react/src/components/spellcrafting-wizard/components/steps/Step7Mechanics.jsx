import React, { useState, useEffect, useMemo } from 'react';
import { useSpellWizardState, useSpellWizardDispatch, actionCreators, validateStepCompletion } from '../../context/spellWizardContext';
import WizardStep from '../common/WizardStep';
import SimplifiedMechanicsConfig from '../mechanics/SimplifiedMechanicsConfig';
import {
  FaFire,
  FaHeart,
  FaWandMagic,
  FaSkull,
  FaGauge,
  FaCircleCheck,
  FaTriangleExclamation,
  FaCircleQuestion,
  FaHandSparkles,
  FaDragon,
  FaRecycle,
  FaDice,
  FaCoins,
  FaClone,
  FaWandMagicSparkles,
  FaDroplet
} from 'react-icons/fa6';
// Pathfinder styles imported via main.css

const Step7Mechanics = ({ stepNumber, totalSteps, onNext, onPrevious, isActive }) => {
  const state = useSpellWizardState();
  const dispatch = useSpellWizardDispatch();

  // Local state for UI management
  const [selectedEffectId, setSelectedEffectId] = useState(null);
  const [errors, setErrors] = useState([]);

  // Get all configured effects from previous steps
  const configuredEffects = useMemo(() => {
    const effects = [];

    // Add damage effect if configured
    if (state.damageConfig) {
      effects.push({
        id: 'effect_damage',
        type: 'damage',
        name: 'Damage',
        icon: <FaFire />,
        config: state.damageConfig
      });
    }

    // Add healing effect if configured
    if (state.healingConfig) {
      effects.push({
        id: 'effect_healing',
        type: 'healing',
        name: 'Healing',
        icon: <FaHeart />,
        config: state.healingConfig
      });
    }

    // Add buff effect if configured
    if (state.buffConfig) {
      effects.push({
        id: 'effect_buff',
        type: 'buff',
        name: 'Buff',
        icon: <FaWandMagic />,
        config: state.buffConfig
      });
    }

    // Add debuff effect if configured
    if (state.debuffConfig) {
      effects.push({
        id: 'effect_debuff',
        type: 'debuff',
        name: 'Debuff',
        icon: <FaSkull />,
        config: state.debuffConfig
      });
    }

    // Add utility effect if configured
    if (state.utilityConfig) {
      effects.push({
        id: 'effect_utility',
        type: 'utility',
        name: 'Utility',
        icon: <FaGauge />,
        config: state.utilityConfig
      });
    }

    // Add control effect if configured
    if (state.controlConfig) {
      effects.push({
        id: 'effect_control',
        type: 'control',
        name: 'Control',
        icon: <FaHandSparkles />,
        config: state.controlConfig
      });
    }

    // Add summoning effect if configured
    if (state.summoningConfig) {
      effects.push({
        id: 'effect_summoning',
        type: 'summoning',
        name: 'Summoning',
        icon: <FaDragon />,
        config: state.summoningConfig
      });
    }

    // Add transformation effect if configured
    if (state.transformationConfig) {
      effects.push({
        id: 'effect_transformation',
        type: 'transformation',
        name: 'Transformation',
        icon: <FaClone />,
        config: state.transformationConfig
      });
    }

    // Add purification effect if configured
    if (state.purificationConfig) {
      effects.push({
        id: 'effect_purification',
        type: 'purification',
        name: 'Purification',
        icon: <FaRecycle />,
        config: state.purificationConfig
      });
    }

    // Add restoration effect if configured
    if (state.restorationConfig) {
      effects.push({
        id: 'effect_restoration',
        type: 'restoration',
        name: 'Restoration',
        icon: <FaDroplet />,
        config: state.restorationConfig
      });
    }

    return effects;
  }, [
    state.damageConfig,
    state.healingConfig,
    state.buffConfig,
    state.debuffConfig,
    state.utilityConfig,
    state.controlConfig,
    state.summoningConfig,
    state.transformationConfig,
    state.purificationConfig,
    state.restorationConfig
  ]);

  // Set the first effect as selected by default if none is selected
  useEffect(() => {
    if (configuredEffects.length > 0 && !selectedEffectId) {
      setSelectedEffectId(configuredEffects[0].id);
    }
  }, [configuredEffects, selectedEffectId]);

  // Validate the step
  const isStepValid = () => {
    // This step is optional, so it's always valid
    return true;
  };

  // Get configuration hints
  const getConfigurationHints = () => {
    return [
      "Configure mechanics for each effect to enhance your spell's behavior",
      "Mechanics can add combo points, state requirements, and other special interactions",
      "Each effect can have its own unique mechanics configuration",
      "You can enable or disable mechanics for each effect individually"
    ];
  };

  // Handle next button click
  const handleNext = () => {
    if (isStepValid()) {
      onNext();
    }
  };

  // Get the selected effect with safety check
  const selectedEffect = configuredEffects.find(effect => effect.id === selectedEffectId) || null;

  // Get the current mechanics config for the selected effect
  const currentMechanicsConfig = selectedEffect
    ? state.effectMechanicsConfigs?.[selectedEffect.id] || {}
    : {};

  // Hunter Flow authoring state (Checkpoint 25 base vs. 2d6 Flow bonus; manual until creator decisions close)
  const hunterFlow = state.mechanicsConfig?.hunterFlow || {
    enabled: false,
    ruleset: 'checkpoint-25-flow',
    abilityKind: 'flow_eligible',
    baseEffectSummary: '',
    flowBonusSummary: '',
    companionShared: true
  };

  const updateHunterFlow = (patch) => {
    const next = { ...hunterFlow, ...patch };
    if (!next.enabled) {
      dispatch(actionCreators.updateMechanicsConfig({ hunterFlow: undefined }));
      return;
    }
    dispatch(actionCreators.updateMechanicsConfig({ hunterFlow: next }));
  };

  return (
    <WizardStep
      title="Configure Mechanics"
      stepNumber={stepNumber}
      totalSteps={totalSteps}
      isCompleted={isStepValid()}
      isActive={isActive}
      onNext={handleNext}
      onPrevious={onPrevious}
      disableNext={false}
      showHints={true}
      hints={getConfigurationHints()}
    >
      <div className="spell-effects-container">
        {errors.length > 0 && (
          <div className="compatibility-errors">
            {errors.map((error, index) => (
              <div key={index} className="compatibility-error">
                <FaTriangleExclamation />
                <span>{error}</span>
              </div>
            ))}
          </div>
        )}

        {/* Hidden Effect Selection - We'll automatically select the first effect */}
        {configuredEffects.length === 0 && (
          <div className="effect-empty-state">
            <FaCircleQuestion className="empty-icon" />
            <h3>No Effects Configured</h3>
            <p>Please go back to Step 3 and configure at least one effect for your spell.</p>
          </div>
        )}

        {/* Mechanics Configuration */}
        {selectedEffect && (
          <div className="mechanics-config-container">
            <SimplifiedMechanicsConfig
              key={selectedEffect.id}
              effectId={selectedEffect.id}
              effectType={selectedEffect.type}
              currentConfig={currentMechanicsConfig}
              onConfigUpdate={(config) => {
                dispatch(actionCreators.updateEffectMechanicsConfig(selectedEffect.id, config));
              }}
            />
          </div>
        )}

        {/* Hunter Flow (Checkpoint 25): Base Effect vs. 2d6 Flow Bonus */}
        <div className="mechanics-config-container" style={{ marginTop: 12, padding: 12, border: '1px solid #8a7456', borderRadius: 4 }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontWeight: 600, cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={Boolean(hunterFlow.enabled)}
              onChange={(e) => updateHunterFlow({ enabled: e.target.checked })}
            />
            Hunter Flow (Base Effect vs. 2d6 Printed Flow Bonus)
          </label>
          <p style={{ margin: '6px 0 8px', fontSize: '0.85rem' }}>
            Shared Hunter/companion Flow (1–4). Natural doubles activate the printed Flow bonus and raise Flow +1 (cap 4); otherwise difference ≤ pre-roll Flow activates the bonus and maintains Flow; outside resolves the ordinary effect and lowers Flow −1 (floor 1).
          </p>
          {hunterFlow.enabled && (
            <div style={{ display: 'grid', gap: 8 }}>
              <label style={{ display: 'grid', gap: 4 }}>
                <span>Ability Flow Role</span>
                <select
                  value={hunterFlow.abilityKind || 'flow_eligible'}
                  onChange={(e) => updateHunterFlow({ abilityKind: e.target.value })}
                >
                  <option value="flow_eligible">Flow-eligible (rolls 2d6)</option>
                  <option value="preparation">AP preparation (direction approved; cost/frequency open)</option>
                  <option value="ordinary">Ordinary Hunter action (no 2d6 roll)</option>
                </select>
              </label>
              <label style={{ display: 'grid', gap: 4 }}>
                <span>Ordinary Base Effect</span>
                <input
                  type="text"
                  value={hunterFlow.baseEffectSummary || ''}
                  placeholder="e.g., Deal 1d6 stabbing damage (normal hit/save/crit applies)"
                  onChange={(e) => updateHunterFlow({ baseEffectSummary: e.target.value })}
                />
              </label>
              <label style={{ display: 'grid', gap: 4 }}>
                <span>Printed Flow Bonus (2d6 qualifying outcome)</span>
                <input
                  type="text"
                  value={hunterFlow.flowBonusSummary || ''}
                  placeholder="e.g., +1d4 stabbing damage or printed Flow bonus"
                  onChange={(e) => updateHunterFlow({ flowBonusSummary: e.target.value })}
                />
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  checked={hunterFlow.companionShared !== false}
                  onChange={(e) => updateHunterFlow({ companionShared: e.target.checked })}
                />
                <span>Shared between Hunter and bonded companion (1–4)</span>
              </label>
              <div role="note" style={{ fontSize: '0.8rem', opacity: 0.85 }}>
                Authoring &amp; card presentation only: eligibility, 2d6 roll ordering, and reset boundaries await creator decision. Unsupported records are preserved whole.
              </div>
            </div>
          )}
        </div>
      </div>
    </WizardStep>
  );
};

export default Step7Mechanics;
