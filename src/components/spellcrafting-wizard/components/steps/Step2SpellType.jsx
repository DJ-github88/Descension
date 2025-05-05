import React, { useEffect } from 'react';
import {
  FaBolt,
  FaBars as FaStream,
  FaStar,
  FaShield,
  FaSkull,
  FaCircleHalfStroke,
  FaCircleDot
} from 'react-icons/fa6';
import { useSpellWizardState, useSpellWizardDispatch, actionCreators } from '../../context/spellWizardContext';
import { SPELL_TYPES, getExampleSpells } from '../../core/mechanics/spellTypeSystem';
import WizardStep from '../common/WizardStep';

const Step2SpellType = ({ onNext, onPrevious, stepNumber, totalSteps, isActive }) => {
  const state = useSpellWizardState();
  const dispatch = useSpellWizardDispatch();
  const exampleSpells = getExampleSpells();

  // Handle spell type selection
  const handleSpellTypeSelect = (type) => {
    // Start with a clean config but preserve the icon and school if they exist
    const newConfig = {
      icon: state.typeConfig.icon, // Preserve the icon
      school: state.typeConfig.school, // Preserve the magic school
      tags: state.typeConfig.tags // Preserve the tags
    };

    // Set type-specific defaults
    switch (type) {
      case 'ACTION':
        newConfig.castTime = 0;
        newConfig.castTimeType = 'IMMEDIATE';
        newConfig.interruptible = true;
        newConfig.castingVisibility = true;
        newConfig.partialEffectOnInterrupt = 'none';
        break;
      case 'CHANNELED':
        newConfig.maxChannelDuration = 3;
        newConfig.durationUnit = 'TURNS';
        newConfig.tickFrequency = 'END_OF_TURN';
        newConfig.concentrationDC = 10;
        newConfig.dcType = 'SPIRIT';
        newConfig.breakEffect = 'none';
        break;
      case 'PASSIVE':
        newConfig.toggleable = false;
        break;
      case 'REACTION':
        newConfig.availabilityType = 'ALWAYS';
        newConfig.limitUsesPerTurn = false;
        newConfig.usesPerTurn = 1;
        newConfig.reactionWindow = 'immediate';
        break;
      case 'TRAP':
        // Only set minimal defaults - detailed configuration will be in TrapPlacementStep
        newConfig.placementTime = 1;
        break;
      case 'STATE':
        // Only set minimal defaults - detailed configuration will be in the Triggers step
        newConfig.cooldownAfterTrigger = 0;
        newConfig.maxTriggers = -1;
        newConfig.stateVisibility = 'visible';
        newConfig.triggerPriority = 'normal';
        break;
      default:
        break;
    }

    dispatch(actionCreators.setSpellType(type));
    dispatch(actionCreators.updateTypeConfig(newConfig));
  };

  // Handle type-specific configuration changes
  const handleConfigChange = (e) => {
    const { name, value, type, checked } = e.target;

    // Handle different input types
    const processedValue = type === 'checkbox' ? checked :
                           type === 'number' ? Number(value) :
                           value;

    dispatch(actionCreators.updateTypeConfig({
      [name]: processedValue
    }));
  };

  // Get icon for spell type
  const getSpellTypeIcon = (type) => {
    switch (type) {
      case 'ACTION':
        return <FaBolt />;
      case 'CHANNELED':
        return <FaStream />;
      case 'PASSIVE':
        return <FaStar />;
      case 'REACTION':
        return <FaShield />;
      case 'TRAP':
        return <FaSkull />;
      case 'STATE':
        return <FaCircleHalfStroke />;
      case 'ZONE':
        return <FaCircleDot />;
      default:
        return <FaBolt />;
    }
  };

  // Get description for spell type
  const getSpellTypeDescription = (type) => {
    switch (type) {
      case 'ACTION':
        return "Standard spells that are cast instantly or over a short casting time. These are your bread-and-butter combat abilities.";
      case 'CHANNELED':
        return "Powerful spells that require concentration and can be maintained over multiple turns for continuous effects.";
      case 'PASSIVE':
        return "Always-active or toggleable abilities that provide ongoing benefits without requiring direct activation.";
      case 'REACTION':
        return "Quick response spells that can be cast in response to specific triggers or conditions.";
      case 'TRAP':
        return "Placed effects that activate when triggered by specific conditions. Perfect for controlling areas or setting ambushes.";
      case 'STATE':
        return "Always-present spells that activate automatically when specific conditions are met, such as low health or resource thresholds.";
      case 'ZONE':
        return "Creates a persistent area that applies effects to targets within it. Can be static, follow the caster, or leave trails.";
      default:
        return "";
    }
  };

  // Get example spell names for a type
  const getExampleSpellNames = (type) => {
    const typeKey = type.toLowerCase();
    return exampleSpells[typeKey] ? Object.keys(exampleSpells[typeKey]).map(key => exampleSpells[typeKey][key].name) : [];
  };

  // Check if step is valid (has a spell type selected and basic type config)
  const isStepValid = () => {
    return !!state.spellType && Object.keys(state.typeConfig).length > 0;
  };

  // Mark step as completed when valid
  useEffect(() => {
    if (isStepValid()) {
      dispatch(actionCreators.markStepCompleted(stepNumber));
    }
  }, [state.spellType, state.typeConfig, dispatch, stepNumber]);

  return (
    <WizardStep
      title="Choose Spell Type"
      description="Select the type of spell you want to create and configure its basic properties."
      onNext={onNext}
      onPrevious={onPrevious}
      stepNumber={stepNumber}
      totalSteps={totalSteps}
      isActive={isActive}
      isValid={isStepValid()}
    >
      <div className="spell-type-selection">
        {Object.keys(SPELL_TYPES).map((type) => (
          <div
            key={type}
            className={`spell-type-card ${state.spellType === type ? 'selected' : ''}`}
            onClick={() => handleSpellTypeSelect(type)}
          >
            <div className="spell-type-header">
              <div className="spell-type-icon">
                {getSpellTypeIcon(type)}
              </div>
              <h3 className="spell-type-title">{type}</h3>
            </div>
            <p className="spell-type-description">
              {getSpellTypeDescription(type)}
            </p>
            <div className="spell-type-examples">
              <strong>Examples:</strong> {getExampleSpellNames(type).join(', ') || 'No examples available'}
            </div>
          </div>
        ))}
      </div>

      {state.spellType && (
        <div className="spell-type-config">
          <h4>{state.spellType} Configuration</h4>

          {state.spellType === 'ACTION' && (
            <>
              <div className="spell-wizard-form-row">
                <div className="spell-wizard-form-group spell-wizard-form-group-half">
                  <label htmlFor="castTime" className="spell-wizard-label">
                    Cast Time (turns)
                  </label>
                  <input
                    id="castTime"
                    name="castTime"
                    type="number"
                    min="0"
                    max="5"
                    className="spell-wizard-input"
                    value={state.typeConfig.castTime ?? 0}
                    onChange={handleConfigChange}
                  />
                  <small className="spell-wizard-help-text">
                    How many turns it takes to cast the spell
                  </small>
                </div>

                <div className="spell-wizard-form-group">
                  <label htmlFor="castTimeType" className="spell-wizard-label">
                    Cast Time Type
                  </label>
                  <select
                    id="castTimeType"
                    name="castTimeType"
                    className="spell-wizard-select"
                    value={state.typeConfig.castTimeType ?? 'IMMEDIATE'}
                    onChange={handleConfigChange}
                  >
                    <option value="IMMEDIATE">Immediate</option>
                    <option value="START_OF_TURN">Start of Turn</option>
                    <option value="END_OF_TURN">End of Turn</option>
                  </select>
                </div>
              </div>

              <div className="spell-wizard-form-row">
                <div className="spell-wizard-form-group">
                  <div className="spell-wizard-checkbox-group">
                    <input
                      id="interruptible"
                      name="interruptible"
                      type="checkbox"
                      className="spell-wizard-checkbox"
                      checked={state.typeConfig.interruptible ?? true}
                      onChange={handleConfigChange}
                    />
                    <label htmlFor="interruptible" className="spell-wizard-label">
                      Can be Interrupted
                    </label>
                  </div>
                  <small className="spell-wizard-help-text">
                    Whether the spell can be interrupted during casting
                  </small>
                </div>

                <div className="spell-wizard-form-group">
                  <div className="spell-wizard-checkbox-group">
                    <input
                      id="castingVisibility"
                      name="castingVisibility"
                      type="checkbox"
                      className="spell-wizard-checkbox"
                      checked={state.typeConfig.castingVisibility ?? true}
                      onChange={handleConfigChange}
                    />
                    <label htmlFor="castingVisibility" className="spell-wizard-label">
                      Visible While Casting
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}

          {state.spellType === 'CHANNELED' && (
            <>
              <div className="spell-wizard-form-row">
                <div className="spell-wizard-form-group spell-wizard-form-group-half">
                  <label htmlFor="maxChannelDuration" className="spell-wizard-label">
                    Max Channel Duration
                  </label>
                  <input
                    id="maxChannelDuration"
                    name="maxChannelDuration"
                    type="number"
                    min="1"
                    max="10"
                    className="spell-wizard-input"
                    value={state.typeConfig.maxChannelDuration ?? 3}
                    onChange={handleConfigChange}
                  />
                </div>

                <div className="spell-wizard-form-group spell-wizard-form-group-half">
                  <label htmlFor="durationUnit" className="spell-wizard-label">
                    Duration Unit
                  </label>
                  <select
                    id="durationUnit"
                    name="durationUnit"
                    className="spell-wizard-select"
                    value={state.typeConfig.durationUnit ?? 'TURNS'}
                    onChange={handleConfigChange}
                  >
                    <option value="TURNS">Turns</option>
                    <option value="ROUNDS">Rounds</option>
                  </select>
                </div>
              </div>

              <div className="spell-wizard-form-row">
                <div className="spell-wizard-form-group">
                  <label htmlFor="tickFrequency" className="spell-wizard-label">
                    Effect Frequency
                  </label>
                  <select
                    id="tickFrequency"
                    name="tickFrequency"
                    className="spell-wizard-select"
                    value={state.typeConfig.tickFrequency ?? 'END_OF_TURN'}
                    onChange={handleConfigChange}
                  >
                    <option value="START_OF_TURN">Start of Turn</option>
                    <option value="END_OF_TURN">End of Turn</option>
                    <option value="CONTINUOUS">Continuous</option>
                  </select>
                </div>
              </div>

              <div className="spell-wizard-form-row">
                <div className="spell-wizard-form-group spell-wizard-form-group-half">
                  <label htmlFor="concentrationDC" className="spell-wizard-label">
                    Base Concentration DC
                  </label>
                  <input
                    id="concentrationDC"
                    name="concentrationDC"
                    type="number"
                    min="5"
                    max="20"
                    className="spell-wizard-input"
                    value={state.typeConfig.concentrationDC ?? 10}
                    onChange={handleConfigChange}
                  />
                </div>

                <div className="spell-wizard-form-group spell-wizard-form-group-half">
                  <label htmlFor="dcType" className="spell-wizard-label">
                    DC Type
                  </label>
                  <select
                    id="dcType"
                    name="dcType"
                    className="spell-wizard-select"
                    value={state.typeConfig.dcType ?? 'SPIRIT'}
                    onChange={handleConfigChange}
                  >
                    <option value="CONSTITUTION">Constitution</option>
                    <option value="STRENGTH">Strength</option>
                    <option value="AGILITY">Agility</option>
                    <option value="INTELLIGENCE">Intelligence</option>
                    <option value="SPIRIT">Spirit</option>
                    <option value="CHARISMA">Charisma</option>
                  </select>
                  <small className="spell-wizard-help-text">
                    Base stat used for concentration checks
                  </small>
                </div>
              </div>
            </>
          )}

          {state.spellType === 'PASSIVE' && (
            <div className="spell-wizard-form-row">
              <div className="spell-wizard-form-group">
                <div className="spell-wizard-checkbox-group">
                  <input
                    id="toggleable"
                    name="toggleable"
                    type="checkbox"
                    className="spell-wizard-checkbox"
                    checked={state.typeConfig.toggleable ?? false}
                    onChange={handleConfigChange}
                  />
                  <label htmlFor="toggleable" className="spell-wizard-label">
                    Can be Toggled
                  </label>
                </div>
                <small className="spell-wizard-help-text">
                  Whether the passive effect can be turned on and off
                </small>
              </div>
            </div>
          )}

          {state.spellType === 'REACTION' && (
            <>
              <div className="spell-wizard-form-row">
                <div className="spell-wizard-form-group">
                  <label htmlFor="availabilityType" className="spell-wizard-label">
                    Availability Type
                  </label>
                  <select
                    id="availabilityType"
                    name="availabilityType"
                    className="spell-wizard-select"
                    value={state.typeConfig.availabilityType ?? 'ALWAYS'}
                    onChange={handleConfigChange}
                  >
                    <option value="ALWAYS">Always Available</option>
                    <option value="PREPARED">Must Be Prepared</option>
                    <option value="CONDITIONAL">Conditional</option>
                  </select>
                </div>
              </div>

              <div className="spell-wizard-form-row">
                <div className="spell-wizard-form-group">
                  <div className="spell-wizard-checkbox-group">
                    <input
                      id="limitUsesPerTurn"
                      name="limitUsesPerTurn"
                      type="checkbox"
                      className="spell-wizard-checkbox"
                      checked={state.typeConfig.limitUsesPerTurn ?? false}
                      onChange={handleConfigChange}
                    />
                    <label htmlFor="limitUsesPerTurn" className="spell-wizard-label">
                      Limit Uses Per Turn
                    </label>
                  </div>
                </div>
              </div>

              {state.typeConfig.limitUsesPerTurn && (
                <div className="spell-wizard-form-row">
                  <div className="spell-wizard-form-group spell-wizard-form-group-half">
                    <label htmlFor="usesPerTurn" className="spell-wizard-label">
                      Uses Per Turn
                    </label>
                    <input
                      id="usesPerTurn"
                      name="usesPerTurn"
                      type="number"
                      min="1"
                      max="5"
                      className="spell-wizard-input"
                      value={state.typeConfig.usesPerTurn ?? 1}
                      onChange={handleConfigChange}
                    />
                  </div>
                </div>
              )}
            </>
          )}

          {state.spellType === 'TRAP' && (
            <>
              <div className="spell-wizard-form-row">
                <div className="spell-wizard-form-group spell-wizard-form-group-half">
                  <label htmlFor="placementTime" className="spell-wizard-label">
                    Placement Time (turns)
                  </label>
                  <input
                    id="placementTime"
                    name="placementTime"
                    type="number"
                    min="1"
                    max="5"
                    className="spell-wizard-input"
                    value={state.typeConfig.placementTime ?? 1}
                    onChange={handleConfigChange}
                  />
                  <small className="spell-wizard-help-text">
                    How many turns it takes to place the trap
                  </small>
                </div>
              </div>

              <div className="spell-wizard-info-box">
                <p>Additional trap configuration options will be available in the Trap Placement and Triggers steps.</p>
              </div>
            </>
          )}

          {state.spellType === 'ZONE' && (
            <>
              <div className="spell-wizard-form-row">
                <div className="spell-wizard-form-group spell-wizard-form-group-half">
                  <label htmlFor="zoneDuration" className="spell-wizard-label">
                    Zone Duration
                  </label>
                  <div className="duration-config">
                    <div className="duration-value">
                      <input
                        id="zoneDuration"
                        name="zoneDuration"
                        type="number"
                        min="1"
                        max="3600"
                        className="spell-wizard-input"
                        value={state.typeConfig.zoneDuration ?? 60}
                        onChange={handleConfigChange}
                      />
                    </div>
                    <div className="duration-unit">
                      <select
                        id="zoneDurationUnit"
                        name="zoneDurationUnit"
                        className="spell-wizard-select"
                        value={state.typeConfig.zoneDurationUnit ?? 'seconds'}
                        onChange={handleConfigChange}
                      >
                        <option value="seconds">Seconds</option>
                        <option value="minutes">Minutes</option>
                        <option value="hours">Hours</option>
                        <option value="days">Days</option>
                        <option value="weeks">Weeks</option>
                        <option value="rounds">Rounds</option>
                        <option value="turns">Turns</option>
                      </select>
                    </div>
                  </div>
                  <small className="spell-wizard-help-text">
                    How long the zone persists
                  </small>
                </div>
              </div>

              <div className="spell-wizard-form-row">
                <div className="spell-wizard-form-group">
                  <div className="spell-wizard-checkbox-group">
                    <input
                      id="leaveTrail"
                      name="leaveTrail"
                      type="checkbox"
                      className="spell-wizard-checkbox"
                      checked={state.typeConfig.leaveTrail ?? false}
                      onChange={handleConfigChange}
                    />
                    <label htmlFor="leaveTrail" className="spell-wizard-label">
                      Leave Trail
                    </label>
                  </div>
                  <small className="spell-wizard-help-text">
                    Whether the zone leaves a trail of effects as it moves
                  </small>
                </div>
              </div>

              {/* Trail Duration - only show when leaveTrail is checked */}
              {state.typeConfig.leaveTrail && (
                <div className="spell-wizard-form-row">
                  <div className="spell-wizard-form-group spell-wizard-form-group-half">
                    <label htmlFor="trailDuration" className="spell-wizard-label">
                      Trail Duration
                    </label>
                    <div className="duration-config">
                      <div className="duration-value">
                        <input
                          id="trailDuration"
                          name="trailDuration"
                          type="number"
                          min="1"
                          max="3600"
                          className="spell-wizard-input"
                          value={state.typeConfig.trailDuration ?? 3}
                          onChange={handleConfigChange}
                        />
                      </div>
                      <div className="duration-unit">
                        <select
                          id="trailDurationUnit"
                          name="trailDurationUnit"
                          className="spell-wizard-select"
                          value={state.typeConfig.trailDurationUnit ?? 'rounds'}
                          onChange={handleConfigChange}
                        >
                          <option value="seconds">Seconds</option>
                          <option value="minutes">Minutes</option>
                          <option value="hours">Hours</option>
                          <option value="days">Days</option>
                          <option value="weeks">Weeks</option>
                          <option value="rounds">Rounds</option>
                          <option value="turns">Turns</option>
                        </select>
                      </div>
                    </div>
                    <small className="spell-wizard-help-text">
                      How long each segment of the trail remains active after the caster moves
                    </small>
                  </div>
                </div>
              )}

              <div className="spell-wizard-info-box">
                <p>Configure the zone's shape, size, movement behavior, and targeting options in the Targeting step.</p>
              </div>
            </>
          )}

          {state.spellType === 'STATE' && (
            <>
              <div className="spell-wizard-form-row">
                <div className="spell-wizard-form-group spell-wizard-form-group-half">
                  <label htmlFor="cooldownAfterTrigger" className="spell-wizard-label">
                    Cooldown After Trigger (seconds)
                  </label>
                  <input
                    id="cooldownAfterTrigger"
                    name="cooldownAfterTrigger"
                    type="number"
                    min="0"
                    max="300"
                    className="spell-wizard-input"
                    value={state.typeConfig.cooldownAfterTrigger ?? 0}
                    onChange={handleConfigChange}
                  />
                  <small className="spell-wizard-help-text">
                    Time before the state can trigger again (0 for no cooldown)
                  </small>
                </div>

                <div className="spell-wizard-form-group spell-wizard-form-group-half">
                  <label htmlFor="maxTriggers" className="spell-wizard-label">
                    Max Triggers
                  </label>
                  <input
                    id="maxTriggers"
                    name="maxTriggers"
                    type="number"
                    min="-1"
                    max="100"
                    className="spell-wizard-input"
                    value={state.typeConfig.maxTriggers ?? -1}
                    onChange={handleConfigChange}
                  />
                  <small className="spell-wizard-help-text">
                    Maximum number of times the state can trigger (-1 for unlimited)
                  </small>
                </div>
              </div>

              <div className="spell-wizard-form-row">
                <div className="spell-wizard-form-group">
                  <label htmlFor="stateVisibility" className="spell-wizard-label">
                    State Visibility
                  </label>
                  <select
                    id="stateVisibility"
                    name="stateVisibility"
                    className="spell-wizard-select"
                    value={state.typeConfig.stateVisibility ?? 'visible'}
                    onChange={handleConfigChange}
                  >
                    <option value="visible">Visible to All</option>
                    <option value="self_only">Visible to Self Only</option>
                    <option value="hidden">Hidden</option>
                  </select>
                </div>

                <div className="spell-wizard-form-group">
                  <label htmlFor="triggerPriority" className="spell-wizard-label">
                    Trigger Priority
                  </label>
                  <select
                    id="triggerPriority"
                    name="triggerPriority"
                    className="spell-wizard-select"
                    value={state.typeConfig.triggerPriority ?? 'normal'}
                    onChange={handleConfigChange}
                  >
                    <option value="high">High</option>
                    <option value="normal">Normal</option>
                    <option value="low">Low</option>
                  </select>
                  <small className="spell-wizard-help-text">
                    Determines the order when multiple states trigger simultaneously
                  </small>
                </div>
              </div>

              <div className="spell-wizard-info-box">
                <p>Configure the activation conditions for your state spell in the Triggers step.</p>
              </div>
            </>
          )}
        </div>
      )}
      <style jsx>{`
        .duration-config {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .duration-value {
          flex: 0 0 80px;
        }

        .duration-unit {
          flex: 1;
        }
      `}</style>
    </WizardStep>
  );
};

export default Step2SpellType;