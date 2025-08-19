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
    if (state.summonConfig) {
      effects.push({
        id: 'effect_summoning',
        type: 'summoning',
        name: 'Summoning',
        icon: <FaDragon />,
        config: state.summonConfig
      });
    }

    // Add transformation effect if configured
    if (state.transformConfig) {
      effects.push({
        id: 'effect_transformation',
        type: 'transformation',
        name: 'Transformation',
        icon: <FaClone />,
        config: state.transformConfig
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
    state.summonConfig,
    state.transformConfig,
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
            <div className="mechanics-effect-summary">
              <h3>Configure Spell Mechanics</h3>
              <p className="mechanics-effect-description">
                Add special mechanics to enhance your spell's behavior.
              </p>
            </div>

            <SimplifiedMechanicsConfig
              effectId={selectedEffect.id}
              effectType={selectedEffect.type}
              currentConfig={currentMechanicsConfig}
              onConfigUpdate={(config) => {
                dispatch(actionCreators.updateEffectMechanicsConfig(selectedEffect.id, config));
              }}
            />
          </div>
        )}
      </div>
    </WizardStep>
  );
};

export default Step7Mechanics;
