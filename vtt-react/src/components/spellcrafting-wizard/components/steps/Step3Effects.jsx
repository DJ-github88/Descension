import React, { useState, useEffect } from 'react';
import { useSpellWizardState, useSpellWizardDispatch, actionCreators } from '../../context/spellWizardContext';
import WizardStep from '../common/WizardStep';
import SelectionCard from '../common/SelectionCard';
// StepMechanicsConfig removed - now in its own step
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
// StepMechanics.css removed as it's now incorporated into MechanicsConfig.css

// Import effect type components
import DamageEffects from '../../data/effects/DamageEffects';
import HealingEffects from '../../data/effects/HealingEffects';
import BuffEffects from '../../data/effects/BuffEffects';
import DebuffEffects from '../../data/effects/DebuffEffects';
import UtilityEffects from '../../data/effects/UtilityEffects';
import ControlEffects from '../../data/effects/ControlEffects';
import SummoningEffects from '../../data/effects/SummoningEffects';
import TransformationEffects from '../../data/effects/TransformationEffects';
import PurificationEffects from '../../data/effects/PurificationEffects';
import RestorationEffects from '../../data/effects/RestorationEffects';

// Import effect type data
import {
  EFFECT_TYPES,
  getEffectTypeLabel,
  getEffectTypeIcon,
  getEffectTypeDescription,
  getEffectTypeActionPointCost,
  formatActionPointCost,
  getEffectTypeById,
  getEffectTypesByCategory,
  calculateEffectActionPointCost
} from '../../core/data/effectTypes';

const Step3Effects = ({ onNext, onPrevious, stepNumber, totalSteps, isActive }) => {
  const state = useSpellWizardState();
  const dispatch = useSpellWizardDispatch();

  // Local state for UI management
  const [selectedEffectType, setSelectedEffectType] = useState(null);
  const [effectCompatibilityErrors, setEffectCompatibilityErrors] = useState([]);

  // Get the wizard flow and step information
  const { spellType, effectTypes } = state;

  // Helper functions to get default formulas based on spell type
  const getDefaultDamageFormula = () => {
    switch (state.spellType) {
      case 'ACTION':
        return '2d6 + damage';
      case 'CHANNELED':
        return '1d6 + int';
      case 'PASSIVE':
        return '1d4 + damage/2';
      case 'REACTION':
        return '2d6 + spir';
      default:
        return '2d6';
    }
  };

  // Initialize effect configurations when effect types change
  useEffect(() => {
    if (effectTypes.length > 0 && !selectedEffectType) {
      setSelectedEffectType(effectTypes[0]);

      // Only initialize configurations if they don't already exist
      // This ensures we don't overwrite existing configurations when returning to this step
      const effectType = effectTypes[0];

      // Check if the configuration already exists for this effect type
      const configExists = (
        (effectType === 'damage' && state.damageConfig) ||
        (effectType === 'healing' && state.healingConfig) ||
        (effectType === 'buff' && state.buffConfig) ||
        (effectType === 'debuff' && state.debuffConfig) ||
        (effectType === 'utility' && state.utilityConfig) ||
        (effectType === 'control' && state.controlConfig) ||
        (effectType === 'summoning' && state.summoningConfig) ||
        (effectType === 'transformation' && state.transformationConfig) ||
        (effectType === 'purification' && state.purificationConfig) ||
        (effectType === 'restoration' && state.restorationConfig)
      );

      // Only initialize if the configuration doesn't exist
      if (!configExists) {
        console.log(`Initializing configuration for ${effectType}`);
        initializeConfigurations(effectType);
      } else {
        console.log(`Configuration for ${effectType} already exists, not initializing`);
      }
    }
  }, [effectTypes, selectedEffectType]);

  // Initialize configurations for the selected effect type
  const initializeConfigurations = (effectType) => {
    switch (effectType) {
      case 'damage':
        // Use damage types from Step 1 instead of defaulting to fire
        const primaryElementType = state.typeConfig?.school || 'fire';
        const secondaryElementType = state.typeConfig?.secondaryElement || null;

        dispatch(actionCreators.updateDamageConfig({
          formula: getDefaultDamageFormula(),
          damageType: 'direct',
          elementType: primaryElementType,
          secondaryElementType: secondaryElementType,
          canCrit: false,
          critMultiplier: 2,
          critDiceOnly: false,
          dotConfig: {
            duration: 3,
            tickFrequency: 'round',
            scalingType: 'flat',
            dotFormula: '1d4 + INT/2'
          }
        }));
        break;
      case 'healing':
        dispatch(actionCreators.updateHealingConfig({
          formula: '2d8 + spir',
          healingType: 'direct',
          targetType: 'single',
          shieldType: 'standard',
          shieldDuration: 3,
          duration: 3,
          tickFrequency: 'round',
          scalingType: 'flat',
          specialEffects: [],
          // Explicitly set these properties to false by default
          hasHotEffect: false,
          hasShieldEffect: false,
          // Add default formulas for HoT and shield
          hotFormula: '1d4 + spir/2',
          shieldFormula: '2d6 + spir'
        }));
        break;
      case 'buff':
        dispatch(actionCreators.updateBuffConfig({
          buffType: 'statEnhancement',
          duration: 'medium',
          stacks: 1,
          maxStacks: 1,
          dispelDifficulty: 'normal',
          effects: []
        }));
        break;
      case 'debuff':
        dispatch(actionCreators.updateDebuffConfig({
          debuffType: 'statReduction',
          duration: 3,
          stacks: 1,
          maxStacks: 1,
          saveType: 'constitution',
          dispelDifficulty: 'normal',
          effects: []
        }));
        break;
      case 'utility':
        dispatch(actionCreators.updateUtilityConfig({
          utilityType: 'movement',
          subtype: 'teleport',
          parentType: 'movement',
          power: 'moderate',
          duration: 'short',
          specialEffects: [],
          description: ''
        }));
        break;
      case 'control':
        dispatch(actionCreators.updateControlConfig({
          controlType: 'forcedMovement',
          strength: 'moderate',
          duration: 2,
          saveDC: 14,
          saveType: 'strength',
          specialEffects: []
        }));
        break;
      case 'summoning':
        dispatch(actionCreators.updateSummoningConfig({
          creatureType: 'elemental',
          creatureStrength: 'moderate',
          duration: 3,
          minions: 1,
          controlType: 'mental'
        }));
        break;
      case 'transformation':
        dispatch(actionCreators.updateTransformationConfig({
          transformationType: 'physical',
          targetType: 'self',
          duration: 5,
          power: 'moderate',
          specialEffects: []
        }));
        break;
      case 'purification':
        dispatch(actionCreators.updatePurificationConfig({
          purificationType: 'dispel',
          targetType: 'single',
          power: 'moderate',
          duration: 'instant',
          specialEffects: []
        }));
        break;
      case 'restoration':
        dispatch(actionCreators.updateRestorationConfig({
          resourceType: 'mana',
          resolution: 'DICE',
          formula: '2d6 + INT',
          isOverTime: false,
          overTimeFormula: '1d4 + INT/2',
          overTimeDuration: 3,
          tickFrequency: 'round',
          application: 'start',
          scalingType: 'flat'
        }));
        break;
      default:
        break;
    }
  };

  // Handle configuration changes for an effect type
  const handleConfigChange = (effectType, config) => {
    switch (effectType) {
      case 'damage':
        dispatch(actionCreators.updateDamageConfig(config));
        break;
      case 'healing':
        dispatch(actionCreators.updateHealingConfig(config));
        break;
      case 'buff':
        dispatch(actionCreators.updateBuffConfig(config));
        break;
      case 'debuff':
        dispatch(actionCreators.updateDebuffConfig(config));
        break;
      case 'utility':
        dispatch(actionCreators.updateUtilityConfig(config));
        break;
      case 'control':
        dispatch(actionCreators.updateControlConfig(config));
        break;
      case 'summoning':
        dispatch(actionCreators.updateSummoningConfig(config));
        break;
      case 'transformation':
        dispatch(actionCreators.updateTransformationConfig(config));
        break;
      case 'purification':
        dispatch(actionCreators.updatePurificationConfig(config));
        break;
      case 'restoration':
        dispatch(actionCreators.updateRestorationConfig(config));
        break;
      default:
        break;
    }
  };

  // Filter effect types based on spell type compatibility
  const getCompatibleEffectTypes = () => {
    // Define incompatible combinations
    const incompatibleCombinations = {
      'PASSIVE': ['control', 'transformation'],
      'REACTION': ['summoning', 'transformation'],
    };

    const incompatibleForCurrentType = incompatibleCombinations[spellType] || [];

    return getEffectTypesByCategory().filter(effectType =>
      !incompatibleForCurrentType.includes(effectType.id)
    );
  };

  // Check if an effect is properly configured
  const isEffectConfigured = (effectType) => {
    switch (effectType) {
      case 'damage':
        return !!state.damageConfig &&
               !!state.damageConfig.formula &&
               !!state.damageConfig.primaryElement;
      case 'healing':
        return !!state.healingConfig &&
               !!state.healingConfig.formula;
      case 'buff':
        return !!state.buffConfig &&
               !!state.buffConfig.buffType &&
               ((state.buffConfig.effects && state.buffConfig.effects.length > 0) ||
                !!state.buffConfig.customDescription);
      case 'debuff':
        return !!state.debuffConfig &&
               !!state.debuffConfig.debuffType &&
               ((state.debuffConfig.effects && state.debuffConfig.effects.length > 0) ||
                !!state.debuffConfig.customDescription);
      case 'utility':
        return !!state.utilityConfig &&
               !!state.utilityConfig.utilityType &&
               !!state.utilityConfig.subtype;
      case 'control':
        return !!state.controlConfig &&
               !!state.controlConfig.controlType;
      case 'summoning':
        return !!state.summoningConfig &&
               !!state.summoningConfig.creatureType;
      case 'transformation':
        return !!state.transformationConfig &&
               !!state.transformationConfig.transformationType;
      case 'purification':
        return !!state.purificationConfig &&
               !!state.purificationConfig.purificationType;
      case 'restoration':
        return !!state.restorationConfig &&
               !!state.restorationConfig.resourceType &&
               !!state.restorationConfig.formula;
      default:
        return false;
    }
  };

  // Check if all selected effects are properly configured
  const areAllEffectsConfigured = () => {
    if (effectTypes.length === 0) return false;
    return effectTypes.every(isEffectConfigured);
  };

  // Check if step is valid (has at least one effect type selected and configured)
  const isStepValid = () => {
    if (state.effectTypes.length === 0) return false;
    return state.effectTypes.every(effectType => isEffectConfigured(effectType));
  };

  // Calculate the total resource cost based on selected effects
  const calculateTotalResourceCost = () => {
    // Use imported function with config options
    const configOptions = {
      actionPointEfficiency: state.spellType === 'ACTION' ? 0 :
                           state.spellType === 'REACTION' ? 10 :
                           state.spellType === 'CHANNELED' ? -50 :
                           state.spellType === 'PASSIVE' ? -100 : 0
    };

    const baseCost = calculateEffectActionPointCost(state.effectTypes, configOptions);

    // Apply spell type modifiers
    let multiplier = 1;
    if (state.spellType === 'CHANNELED') multiplier = 1.25;
    if (state.spellType === 'PASSIVE') multiplier = 0.75;

    return Math.ceil(baseCost * multiplier);
  };

  // Toggle effect type selection
  const toggleEffectType = (effectType) => {
    const effectId = `effect_${effectType}`;

    if (state.effectTypes.includes(effectType)) {
      // Remove effect type
      dispatch(actionCreators.removeEffectType(effectType));

      // Clean up resolution state
      const newEffectResolutions = { ...state.effectResolutions };
      delete newEffectResolutions[effectId];
      dispatch(actionCreators.updateEffectResolutions(newEffectResolutions));

      // Update effectsMap to track which effects are enabled
      const effectsMap = { ...state.effectsMap } || {};
      effectsMap[effectType] = false;
      dispatch(actionCreators.updateEffectsMap(effectsMap));

      if (selectedEffectType === effectType && state.effectTypes.length > 1) {
        // Find another effect to select
        const remainingEffects = state.effectTypes.filter(e => e !== effectType);
        setSelectedEffectType(remainingEffects[0]);
      } else if (selectedEffectType === effectType) {
        setSelectedEffectType(null);
      }
    } else {
      // Add effect type
      dispatch(actionCreators.addEffectType(effectType));

      // Update effectsMap to track which effects are enabled
      const effectsMap = { ...state.effectsMap } || {};
      effectsMap[effectType] = true;
      dispatch(actionCreators.updateEffectsMap(effectsMap));

      setSelectedEffectType(effectType);

      // Check if the configuration already exists for this effect type
      const configExists = (
        (effectType === 'damage' && state.damageConfig) ||
        (effectType === 'healing' && state.healingConfig) ||
        (effectType === 'buff' && state.buffConfig) ||
        (effectType === 'debuff' && state.debuffConfig) ||
        (effectType === 'utility' && state.utilityConfig) ||
        (effectType === 'control' && state.controlConfig) ||
        (effectType === 'summoning' && state.summoningConfig) ||
        (effectType === 'transformation' && state.transformationConfig) ||
        (effectType === 'purification' && state.purificationConfig) ||
        (effectType === 'restoration' && state.restorationConfig)
      );

      // Only initialize if the configuration doesn't exist
      if (!configExists) {
        // console.log(`Initializing configuration for ${effectType}`);
        initializeConfigurations(effectType);
      } else {
        // console.log(`Configuration for ${effectType} already exists, not initializing`);
      }
    }
  };

  // Validate effect combinations
  const validateEffectCombinations = () => {
    const errors = [];

    // Check for incompatible combinations
    if (state.effectTypes.includes('damage') && state.effectTypes.includes('healing')) {
      if (state.spellType === 'PASSIVE') {
        errors.push('Passive spells cannot have both damage and healing effects');
      }
    }

    // Check for too many effects
    if (state.effectTypes.length > 3) {
      errors.push('Spells typically have at most 3 effects for clarity and balance');
    }

    setEffectCompatibilityErrors(errors);
  };

  // Update resource cost when effects change
  const updateResourceCost = () => {
    const cost = calculateTotalResourceCost();
    dispatch(actionCreators.updateResourceCost({ actionPoints: cost }));
  };

  // Generate configuration hints based on spell type
  const getConfigurationHints = () => {
    const hints = [];

    switch (state.spellType) {
      case 'ACTION':
        hints.push('Action spells favor direct effects like damage or healing.');
        hints.push('Consider the action cost of your effects - more powerful effects cost more actions.');
        hints.push('Direct damage and healing are most effective for action spells.');
        break;
      case 'CHANNELED':
        hints.push('Channeled spells can sustain effects over time, good for control or damage over time.');
        hints.push('Consider effects that scale with channeling duration.');
        hints.push('Damage over time and regeneration healing work well with channeled spells.');
        break;
      case 'PASSIVE':
        hints.push('Passive spells provide ongoing benefits or conditional triggers.');
        hints.push('Consider what will trigger your passive effects and how often they can occur.');
        hints.push('Buff effects and utility enhancements are ideal for passive spells.');
        break;
      case 'REACTION':
        hints.push('Reaction spells are best with protective or counter effects.');
        hints.push('Think about what conditions will trigger your reaction spell.');
        hints.push('Protective shields, counterspells, and retributive damage work well for reactions.');
        break;
      default:
        break;
    }

    return hints;
  };

  // Get icon for effect type
  const getEffectIcon = (effectType) => {
    switch (effectType) {
      case 'damage':
        return FaFire;
      case 'healing':
        return FaHeart;
      case 'buff':
        return FaWandMagic;
      case 'debuff':
        return FaSkull;
      case 'utility':
        return FaGauge;
      case 'control':
        return FaHandSparkles;
      case 'summoning':
        return FaDragon;
      case 'transformation':
        return FaRecycle;
      case 'purification':
        return FaWandMagicSparkles;
      case 'restoration':
        return FaDroplet;
      default:
        return FaCircleQuestion;
    }
  };

  // Render the configuration panel for the selected effect type
  const renderEffectTypeConfig = () => {
    if (!selectedEffectType) {
      return null;
    }

    // Use the appropriate effect component based on selected effect type
    let EffectComponent;
    switch(selectedEffectType) {
      case 'healing':
        EffectComponent = HealingEffects;
        break;
      case 'buff':
        EffectComponent = BuffEffects;
        break;
      case 'debuff':
        EffectComponent = DebuffEffects;
        break;
      case 'utility':
        EffectComponent = UtilityEffects;
        break;
      case 'control':
        EffectComponent = ControlEffects;
        break;
      case 'summoning':
        EffectComponent = SummoningEffects;
        break;
      case 'transformation':
        EffectComponent = TransformationEffects;
        break;
      case 'purification':
        EffectComponent = PurificationEffects;
        break;
      case 'restoration':
        EffectComponent = RestorationEffects;
        break;
      default:
        EffectComponent = null;
    }

    const effectId = `effect_${selectedEffectType}`;

    return (
      <div className="effect-config-panel">
        <h3>{getEffectTypeLabel(selectedEffectType)} Configuration</h3>
        <p className="effect-description">{getEffectTypeDescription(selectedEffectType)}</p>

        {selectedEffectType === 'damage' ? (
          <DamageEffects
            currentEffect={{ id: effectId, type: selectedEffectType }}
            effectConfig={state.effectConfigs?.[effectId] || {}}
          />
        ) : (
          EffectComponent && (
            <EffectComponent
              state={state}
              dispatch={dispatch}
              actionCreators={actionCreators}
              effectId={effectId}
              effectType={selectedEffectType}
              config={state.effectConfigurations?.[selectedEffectType] || {}}
              onConfigChange={(config) => handleConfigChange(selectedEffectType, config)}
            />
          )
        )}

        {/* Step Mechanics Configuration moved to its own step */}
      </div>
    );
  };

  // Handle next button click
  const handleNext = () => {
    if (state.effectTypes.length > 0 && areAllEffectsConfigured()) {
      onNext();
    }
  };

  // Main component render
  return (
    <WizardStep
      title="Choose Spell Effects"
      stepNumber={stepNumber}
      totalSteps={totalSteps}
      isCompleted={false}
      isActive={isActive}
      onNext={handleNext}
      onPrevious={onPrevious}
      disableNext={!isStepValid()}
      showHints={true}
      hints={getConfigurationHints()}
    >
      <div className="spell-effects-container">
        {effectCompatibilityErrors.length > 0 && (
          <div className="compatibility-errors">
            {effectCompatibilityErrors.map((error, index) => (
              <div key={index} className="compatibility-error">
                <FaTriangleExclamation />
                <span>{error}</span>
              </div>
            ))}
          </div>
        )}
        {/* Effect Type Selection */}
        <div className="effect-type-grid">
          {getCompatibleEffectTypes().map((effectType) => (
            <SelectionCard
              key={effectType.id}
              title={effectType.name}
              description={effectType.description}
              icon={getEffectIcon(effectType.id)}
              iconColor={effectType.id === 'damage' ? '#e74c3c' :
                       effectType.id === 'healing' ? '#2ecc71' :
                       effectType.id === 'buff' ? '#3498db' :
                       effectType.id === 'debuff' ? '#9b59b6' :
                       effectType.id === 'utility' ? '#f39c12' :
                       effectType.id === 'control' ? '#8e44ad' :
                       effectType.id === 'summoning' ? '#d35400' :
                       effectType.id === 'transformation' ? '#16a085' :
                       effectType.id === 'purification' ? '#9966ff' : '#7f8c8d'}
              selected={state.effectTypes.includes(effectType.id)}
              disabled={false}
              highlighted={selectedEffectType === effectType.id}
              onClick={() => toggleEffectType(effectType.id)}
              additionalInfo={{
                actionCost: formatActionPointCost(effectType.actionPointCost),
                category: effectType.category,
                configured: isEffectConfigured(effectType.id)
              }}
              showDetails={true}
              selectionMode="multiple"
            />
          ))}
        </div>

        {/* Effect Type Navigation - Moved to top */}
        {state.effectTypes.length > 0 && (
          <div className="effect-type-nav effect-type-nav-top">
            <div className="effect-type-tabs">
              {state.effectTypes.map((effectType) => (
                <button
                  key={effectType}
                  className={`effect-type-tab ${selectedEffectType === effectType ? 'active' : ''} ${isEffectConfigured(effectType) ? 'configured' : ''}`}
                  onClick={() => setSelectedEffectType(effectType)}
                >
                  {React.createElement(getEffectIcon(effectType))}
                  <span>{getEffectTypeById(effectType)?.name || effectType}</span>
                  {isEffectConfigured(effectType) && (
                    <FaCircleCheck className="config-indicator" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Effect Configuration */}
        {selectedEffectType && (
          <div className="effect-config-container">
            {renderEffectTypeConfig()}
          </div>
        )}
      </div>
    </WizardStep>
  );
};

export default Step3Effects;