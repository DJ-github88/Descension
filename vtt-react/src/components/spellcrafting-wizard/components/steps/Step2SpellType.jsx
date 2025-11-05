import React, { useEffect } from 'react';
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
        // Set trap configuration defaults
        newConfig.placementTime = 1;
        newConfig.visibility = 'hidden';
        newConfig.cooldownAfterTrigger = 0;
        newConfig.cooldownUnit = 'seconds';
        newConfig.maxTriggers = 1;
        break;
      case 'STATE':
        // Only set minimal defaults - detailed configuration will be in the Triggers step
        newConfig.cooldownAfterTrigger = 0;
        newConfig.cooldownUnit = 'seconds';
        newConfig.maxTriggers = -1;
        newConfig.stateVisibility = 'visible';
        // Removed triggerPriority
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

      {state.spellType && state.spellType !== 'ACTION' && state.spellType !== 'ZONE' && (
        <div className="spell-type-config">
          <h4>{state.spellType} Configuration</h4>


          {state.spellType === 'CHANNELED' && (
            <div className="channeled-spell-config">
              <p className="config-description">
                Configure the channeled spell properties below:
              </p>
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
            </div>
          )}

          {state.spellType === 'PASSIVE' && (
            <>
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
            </>
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

                <div className="spell-wizard-form-group spell-wizard-form-group-half">
                  <label htmlFor="visibility" className="spell-wizard-label">
                    Visibility
                  </label>
                  <select
                    id="visibility"
                    name="visibility"
                    className="spell-wizard-select"
                    value={state.typeConfig.visibility ?? 'hidden'}
                    onChange={handleConfigChange}
                  >
                    <option value="hidden">Hidden</option>
                    <option value="visible">Visible</option>
                    <option value="magical">Magical Aura</option>
                  </select>
                  <small className="spell-wizard-help-text">
                    How visible the trap is to characters
                  </small>
                </div>
              </div>

              <div className="spell-wizard-form-row">
                <div className="spell-wizard-form-group spell-wizard-form-group-half">
                  <label htmlFor="maxTriggers" className="spell-wizard-label">
                    Maximum Triggers
                  </label>
                  <input
                    id="maxTriggers"
                    name="maxTriggers"
                    type="number"
                    min="-1"
                    max="100"
                    className="spell-wizard-input"
                    value={state.typeConfig.maxTriggers ?? 1}
                    onChange={handleConfigChange}
                  />
                  <small className="spell-wizard-help-text">
                    How many times the trap can trigger (-1 for unlimited)
                  </small>
                </div>
              </div>

              <div className="spell-wizard-info-box">
                <p>Additional trap configuration options will be available in the Trap Placement and Triggers steps.</p>
              </div>
            </>
          )}


          {state.spellType === 'STATE' && (
            <>
              <div className="spell-wizard-form-row">
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
          gap: 0.75rem;
        }

        .duration-value {
          flex: 0 0 120px;
        }

        .duration-value input {
          width: 100%;
          text-align: center;
          font-size: 14px;
          padding: 8px 12px;
        }

        .duration-unit {
          flex: 1;
        }
      `}</style>
    </WizardStep>
  );
};

export default Step2SpellType;