import React from 'react';
import ResourceThresholdSlider from '../common/ResourceThresholdSlider';
import { useSpellWizardState } from '../../context/spellWizardContext';
import WizardStep from '../common/WizardStep';
import { getTriggerIconUrl } from '../../core/data/triggerIcons';
import { triggerCategories, getTriggersByCategory, RESOURCE_TYPES } from '../../core/data/triggerData';
import { getCustomIconUrl } from '../../../../utils/assetManager';
import Step7ExampleCards from '../common/Step7ExampleCards';
import Step7ConditionalFormulas from '../common/Step7ConditionalFormulas';
import useTriggerConfig from '../common/useTriggerConfig';
import EffectConfigPanel from '../common/EffectConfigPanel';

const Step7Triggers = ({ stepNumber, totalSteps, onNext, onPrevious }) => {
  const state = useSpellWizardState();

  // Generate trigger recommendations based on spell type and effects
  const getTriggerRecommendations = () => {
    const { spellType, effectTypes = [] } = state;

    if (spellType === 'REACTION') {
      if (effectTypes.includes('damage')) {
        return "For damage-dealing reaction spells, consider combat triggers like 'Damage Taken' or 'Critical Hit'.";
      }
      if (effectTypes.includes('healing')) {
        return "For healing reaction spells, consider health or status triggers like 'Health Threshold' or 'Effect Applied'.";
      }
      if (effectTypes.includes('buff') || effectTypes.includes('debuff')) {
        return "For buff/debuff reaction spells, consider using triggers like 'Combat Start' or 'Status Effect Applied'.";
      }
      return "Consider what game events should cause your reaction spell to activate automatically.";
    }

    if (spellType === 'PASSIVE') {
      return "Passive spells often work best with state-based triggers like 'Health Threshold' or environmental conditions.";
    }

    if (spellType === 'STATE') {
      if (effectTypes.includes('damage')) {
        return "For damage-dealing state spells, consider resource-based triggers like 'Health Threshold' or 'Resource Threshold'.";
      }
      if (effectTypes.includes('healing')) {
        return "For healing state spells, consider health triggers like 'Health Threshold' or 'Health Change'.";
      }
      if (effectTypes.includes('buff')) {
        return "For buff state spells, consider combat triggers like 'Combat Start' or 'Health Threshold'.";
      }
      return "State spells require specific conditions that will cause them to activate automatically when met.";
    }

    if (spellType === 'TRAP') {
      if (effectTypes.includes('damage')) {
        return "For damage-dealing traps, consider proximity or interaction triggers like 'Stepped On' or 'Proximity'.";
      }
      if (effectTypes.includes('debuff') || effectTypes.includes('control')) {
        return "For control traps, consider triggers like 'Proximity' or 'Interaction' to catch enemies unaware.";
      }
      return "Select conditions that will cause your trap to activate when enemies encounter it.";
    }

    return "Select conditions that will cause your spell to trigger automatically.";
  };

  const {
    errors, setErrors,
    triggerConfig, setTriggerConfig,
    effectTriggers, setEffectTriggers,
    selectedEffect, setSelectedEffect,
    editingMode, setEditingMode,
    triggerMode, setTriggerMode,
    requiredConditions, setRequiredConditions,
    conditionalEffects, setConditionalEffects,
    selectedCategory, setSelectedCategory,
    addTrigger, removeTrigger, updateTriggerParameter, setLogicType,
    toggleConditionalEffect, updateConditionalFormula, updateConditionalSettings,
    validateTriggerConfig,
    requiresTriggers
  } = useTriggerConfig();

  // Get recommendations based on spell type
  const recommendationText = getTriggerRecommendations();

  const isCompleted = state.completedSteps?.includes('triggers') || false;
  const isActive = state.currentStep === 'triggers';

  const shouldShowStep = true; // Show for all spell types
  const hintsList = [
    "Triggers define when your spell activates automatically.",
    "For combat spells, consider 'Damage Taken' or 'Health Threshold' triggers.",
    "For utility spells, environmental triggers like 'Weather Change' can create unique effects.",
    "Combining multiple triggers with AND logic creates more specific activation conditions.",
    "Using OR logic makes your spell trigger more frequently in various situations."
  ];

  // Skip this step if it shouldn't be shown
  if (!shouldShowStep) {
    return (
      <WizardStep
        title="Trigger Conditions"
        stepNumber={stepNumber}
        totalSteps={totalSteps}
        isCompleted={true}
        isActive={isActive}
        onNext={onNext}
        onPrevious={onPrevious}
        disableNext={false}
        hints={hintsList}
        hiddenCondition={true}
      >
        <div></div>
      </WizardStep>
    );
  }

  return (
    <WizardStep
      title="Trigger Conditions"
      stepNumber={stepNumber}
      totalSteps={totalSteps}
      isCompleted={isCompleted}
      isActive={isActive}
      onNext={onNext}
      onPrevious={onPrevious}
      disableNext={errors.length > 0 || (requiresTriggers && triggerConfig?.compoundTriggers?.length === 0)}
      hints={hintsList}
      showHints={true}
    >
      <div className="spell-effects-container">

        {errors.length > 0 && (
          <div className="pf-config-group mb-md">
            <h4 className="text-danger">Please fix the following issues:</h4>
            <ul className="mb-md">
              {errors.map((error, index) => (
                <li key={index} className="text-danger">{error}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Trigger Mode Selection - Integrated with Required Conditions */}
        <div className="pf-config-group mb-md">
          <h4 className="pf-config-label">Trigger Mode</h4>
          <p className="mb-sm">Choose whether to configure global triggers for the entire spell or effect-specific triggers.</p>

          <div className="pf-trigger-mode-selector">
            <button
              className={`pf-trigger-mode-button ${editingMode === 'global' ? 'active' : ''}`}
              onClick={() => setEditingMode('global')}
            >
              <div className="pf-trigger-mode-icon">
                <img
                  src={getCustomIconUrl('Utility/Utility', 'abilities')}
                  alt="Global"
                  className="pf-trigger-mode-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getCustomIconUrl('Utility/Utility', 'abilities');
                  }}
                />
              </div>
              <div className="pf-trigger-mode-text">
                <div className="pf-trigger-mode-title">Global Triggers</div>
                <div className="pf-trigger-mode-description">Apply to the entire spell</div>
              </div>
            </button>
            <button
              className={`pf-trigger-mode-button ${editingMode === 'effect' ? 'active' : ''}`}
              onClick={() => setEditingMode('effect')}
              disabled={state.effectTypes.length === 0}
            >
              <div className="pf-trigger-mode-icon">
                <img
                  src={getCustomIconUrl('Utility/Utility', 'abilities')}
                  alt="Effect-Specific"
                  className="pf-trigger-mode-img"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = getCustomIconUrl('Utility/Utility', 'abilities');
                  }}
                />
              </div>
              <div className="pf-trigger-mode-text">
                <div className="pf-trigger-mode-title">Effect-Specific Triggers</div>
                <div className="pf-trigger-mode-description">Configure triggers and conditional effects</div>
              </div>
            </button>
          </div>

          {/* Trigger/Required State Selection - Integrated into Trigger Mode section */}
          <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(139, 115, 85, 0.2)' }}>
            <p className="mb-sm" style={{ fontSize: '14px', color: 'rgba(139, 115, 85, 0.8)' }}>
              {editingMode === 'global' 
                ? 'Choose how triggers work for the entire spell:' 
                : 'Choose how triggers work for this effect:'}
            </p>
            <div className="pf-trigger-mode-selector" style={{ display: 'flex', gap: '12px' }}>
              <button
                className={`pf-trigger-mode-button ${triggerMode === 'trigger' ? 'active' : ''}`}
                onClick={() => {
                  setTriggerMode('trigger');
                  // When switching to trigger mode, disable required conditions (only for global)
                  if (editingMode === 'global') {
                    setRequiredConditions({ ...requiredConditions, enabled: false });
                  }
                }}
                style={{ flex: 1 }}
              >
                <div className="pf-trigger-mode-text">
                  <div className="pf-trigger-mode-title">
                    {editingMode === 'global' ? 'Triggers' : 'Effect Triggers'}
                  </div>
                  <div className="pf-trigger-mode-description">
                    {editingMode === 'global' 
                      ? 'When trigger is met, spell activates' 
                      : 'When trigger is met, effect applies'}
                  </div>
                </div>
              </button>
              <button
                className={`pf-trigger-mode-button ${triggerMode === 'required' ? 'active' : ''}`}
                onClick={() => {
                  setTriggerMode('required');
                  // When switching to required mode, enable required conditions (only for global)
                  if (editingMode === 'global') {
                    setRequiredConditions({ ...requiredConditions, enabled: true });
                  }
                }}
                style={{ flex: 1 }}
              >
                <div className="pf-trigger-mode-text">
                  <div className="pf-trigger-mode-title">Required State</div>
                  <div className="pf-trigger-mode-description">
                    {editingMode === 'global' 
                      ? 'Spell has no effect unless trigger is met' 
                      : 'Effect only enabled if trigger is met'}
                  </div>
                </div>
              </button>
            </div>

            {/* Logic Type Selection - Show for Required State (global) or Triggers (both modes) */}
            {((editingMode === 'global' && triggerMode === 'required') || 
              (editingMode === 'global' && triggerMode === 'trigger' && triggerConfig?.enabled !== false) ||
              (editingMode === 'effect' && selectedEffect)) && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid rgba(139, 115, 85, 0.2)' }}>
                <p className="mb-sm" style={{ fontSize: '14px', color: 'rgba(139, 115, 85, 0.8)' }}>
                  {editingMode === 'global' && triggerMode === 'required'
                    ? 'How should multiple required conditions be combined?'
                    : editingMode === 'global' && triggerMode === 'trigger'
                    ? 'How should multiple triggers be combined?'
                    : 'How should multiple triggers be combined?'}
                </p>
                <div className="pf-logic-selector">
                  {editingMode === 'global' && triggerMode === 'required' ? (
                    <>
                      <button
                        className={`pf-logic-button ${requiredConditions.logicType === 'AND' ? 'active' : ''}`}
                        onClick={() => setRequiredConditions({ ...requiredConditions, logicType: 'AND' })}
                      >
                        <div className="pf-logic-icon">
                          <i className="fas fa-link"></i>
                        </div>
                        <div className="pf-logic-text">
                          <div className="pf-logic-title">ALL CONDITIONS</div>
                          <div className="pf-logic-description">All conditions must be met</div>
                        </div>
                      </button>
                      <button
                        className={`pf-logic-button ${requiredConditions.logicType === 'OR' ? 'active' : ''}`}
                        onClick={() => setRequiredConditions({ ...requiredConditions, logicType: 'OR' })}
                      >
                        <div className="pf-logic-icon">
                          <i className="fas fa-random"></i>
                        </div>
                        <div className="pf-logic-text">
                          <div className="pf-logic-title">ANY CONDITION</div>
                          <div className="pf-logic-description">Any condition can enable the spell</div>
                        </div>
                      </button>
                    </>
                  ) : editingMode === 'global' && triggerMode === 'trigger' ? (
                    <>
                      <button
                        className={`pf-logic-button ${triggerConfig && triggerConfig.logicType === 'AND' ? 'active' : ''}`}
                        onClick={() => setLogicType('AND')}
                      >
                        <div className="pf-logic-icon">
                          <i className="fas fa-link"></i>
                        </div>
                        <div className="pf-logic-text">
                          <div className="pf-logic-title">ALL CONDITIONS</div>
                          <div className="pf-logic-description">Every trigger must be met</div>
                        </div>
                      </button>
                      <button
                        className={`pf-logic-button ${triggerConfig && triggerConfig.logicType === 'OR' ? 'active' : ''}`}
                        onClick={() => setLogicType('OR')}
                      >
                        <div className="pf-logic-icon">
                          <i className="fas fa-random"></i>
                        </div>
                        <div className="pf-logic-text">
                          <div className="pf-logic-title">ANY CONDITION</div>
                          <div className="pf-logic-description">Any single trigger can activate</div>
                        </div>
                      </button>
                    </>
                  ) : editingMode === 'effect' && selectedEffect && effectTriggers[selectedEffect] ? (
                    <>
                      <button
                        className={`pf-logic-button ${effectTriggers[selectedEffect]?.logicType === 'AND' ? 'active' : ''}`}
                        onClick={() => setLogicType('AND')}
                      >
                        <div className="pf-logic-icon">
                          <i className="fas fa-link"></i>
                        </div>
                        <div className="pf-logic-text">
                          <div className="pf-logic-title">ALL CONDITIONS</div>
                          <div className="pf-logic-description">Every trigger must be met</div>
                        </div>
                      </button>
                      <button
                        className={`pf-logic-button ${effectTriggers[selectedEffect]?.logicType === 'OR' ? 'active' : ''}`}
                        onClick={() => setLogicType('OR')}
                      >
                        <div className="pf-logic-icon">
                          <i className="fas fa-random"></i>
                        </div>
                        <div className="pf-logic-text">
                          <div className="pf-logic-title">ANY CONDITION</div>
                          <div className="pf-logic-description">One trigger can activate</div>
                        </div>
                      </button>
                    </>
                  ) : null}
                </div>
              </div>
            )}
          </div>
        </div>

        <EffectConfigPanel
          effectTypes={state.effectTypes}
          selectedEffect={selectedEffect}
          setSelectedEffect={setSelectedEffect}
          editingMode={editingMode}
          effectTriggers={effectTriggers}
          conditionalEffects={conditionalEffects}
          toggleConditionalEffect={toggleConditionalEffect}
          triggerMode={triggerMode}
          setLogicType={setLogicType}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          addTrigger={addTrigger}
        />


        {/* Trigger Category Selection - Shown based on triggerMode */}
        {editingMode === 'global' && ((triggerMode === 'trigger' && triggerConfig?.enabled !== false) || triggerMode === 'required') && (
          <div className="pf-config-group mb-md">
            <h4 className="pf-config-label">Add Trigger Conditions</h4>
            <p className="mb-sm">Select a category, then choose triggers to add to your spell.</p>

            <div className="wow-trigger-categories">
              {triggerCategories.map(category => (
                <button
                  key={category.id}
                  className={`wow-trigger-category ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                  title={category.name}
                >
                  <div className="wow-trigger-icon-wrapper">
                    <img
                      src={getCustomIconUrl(category.iconPath, 'abilities')}
                      alt={category.name}
                      className="wow-trigger-icon"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getCustomIconUrl('Utility/Utility', 'abilities');
                      }}
                    />
                  </div>
                  <span className="wow-trigger-category-name">{category.name}</span>
                </button>
              ))}
            </div>

            <div className="wow-trigger-options mt-md">
              {getTriggersByCategory(selectedCategory).map(trigger => (
                <div key={trigger.id} className="wow-trigger-option" onClick={() => addTrigger(trigger)}>
                  <div className="wow-trigger-option-icon">
                    <img
                      src={getTriggerIconUrl(trigger.id)}
                      alt={trigger.name}
                      className="wow-trigger-option-img"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = getCustomIconUrl('Utility/Utility', 'abilities');
                      }}
                    />
                  </div>
                  <div className="wow-trigger-option-content">
                    <div className="wow-trigger-option-title">{trigger.name}</div>
                    <div className="wow-trigger-option-description">{trigger.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Selected Triggers/Conditions */}
        <div className="pf-config-group mb-md">
          <h4 className="pf-config-label">
            {editingMode === 'global' 
              ? (triggerMode === 'required' ? 'Selected Required Conditions' : 'Selected Global Trigger Conditions')
              : (() => {
                  // Format the effect name nicely
                  if (!selectedEffect) {
                    return 'Selected Trigger Conditions';
                  }
                  
                  if (selectedEffect.includes('_')) {
                    const parts = selectedEffect.split('_');
                    const effectType = parts[0];
                    const subType = parts.slice(1).join(' ');
                    
                    // Capitalize and format
                    const formattedEffectType = effectType.charAt(0).toUpperCase() + effectType.slice(1);
                    let formattedSubType = subType.toLowerCase();
                    if (formattedSubType === 'hot') {
                      formattedSubType = 'HoT';
                    } else if (formattedSubType === 'dot') {
                      formattedSubType = 'DoT';
                    } else {
                      formattedSubType = formattedSubType.split(' ').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ');
                    }
                    
                    return `Selected Trigger Conditions for ${formattedSubType} ${formattedEffectType}`;
                  } else {
                    return `Selected Trigger Conditions for ${selectedEffect.charAt(0).toUpperCase() + selectedEffect.slice(1)}`;
                  }
                })()}
          </h4>

          {editingMode === 'global' && triggerMode === 'required' && (!requiredConditions.conditions || requiredConditions.conditions.length === 0) ? (
            <div className="pf-empty-abilities">
              No required conditions selected. Please add conditions from the categories above.
            </div>
          ) : editingMode === 'global' && triggerMode === 'trigger' && triggerConfig && triggerConfig.compoundTriggers && triggerConfig.compoundTriggers.length === 0 ? (
            <div className="pf-empty-abilities">
              No trigger conditions selected. Please add triggers from the categories above.
            </div>
          ) : editingMode === 'effect' && (!selectedEffect || !effectTriggers[selectedEffect] || !effectTriggers[selectedEffect].compoundTriggers || effectTriggers[selectedEffect].compoundTriggers.length === 0) ? (
            <div className="pf-empty-abilities">
              No trigger conditions selected for this effect. Please add triggers from the categories above.
            </div>
          ) : (
            <div className="pf-selected-triggers">
              {editingMode === 'global' && triggerMode === 'required' && requiredConditions.conditions ? requiredConditions.conditions.map((trigger, index) => (
                <div key={index} className="pf-selected-trigger">
                  <div className="pf-selected-trigger-header">
                    <div className="pf-selected-trigger-icon">
                      <img
                        src={getTriggerIconUrl(trigger.id)}
                        alt={trigger.name}
                        className="pf-selected-trigger-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = getCustomIconUrl('Utility/Utility', 'abilities');
                        }}
                      />
                    </div>
                    <div className="pf-selected-trigger-info">
                      <div className="pf-selected-trigger-name">{trigger.name}</div>
                      <div className="pf-selected-trigger-description">
                        {getTriggersByCategory(trigger.category).find(t => t.id === trigger.id)?.description}
                      </div>
                    </div>
                    <button className="pf-remove-trigger" onClick={() => {
                      const newConditions = requiredConditions.conditions.filter((_, i) => i !== index);
                      setRequiredConditions({ ...requiredConditions, conditions: newConditions });
                    }} title="Remove condition">
                      <i className="fas fa-times"></i>
                    </button>
                  </div>

                  {/* Parameter controls for this condition */}
                  {Object.keys(trigger.parameters).length > 0 && (
                    <div className="pf-trigger-parameters">
                      {Object.keys(trigger.parameters).map(paramName => {
                        const paramValue = trigger.parameters[paramName];
                        // Handle parameters similar to regular triggers
                        if (paramName === 'type' && (!paramValue || paramValue === '')) {
                          return null;
                        }
                        if (trigger.id === 'resource_threshold' && paramName === 'threshold_type') {
                          return null;
                        }

                        return (
                          <div key={paramName} className="pf-trigger-parameter">
                            {!(trigger.id === 'resource_threshold' && paramName === 'threshold_value') && (
                              <div className="pf-parameter-label">
                                {paramName === 'threshold_value'
                                  ? `${trigger.parameters.threshold_type === 'percentage' ? 'Percentage' : 'Value'}:`
                                  : paramName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                              </div>
                            )}
                            <div className="pf-parameter-control">
                              {/* Similar parameter controls as regular triggers */}
                              {trigger.id === 'resource_threshold' && paramName === 'threshold_value' ? (
                                <ResourceThresholdSlider
                                  value={paramValue}
                                  onChange={(value) => {
                                    const newConditions = [...requiredConditions.conditions];
                                    newConditions[index] = {
                                      ...trigger,
                                      parameters: { ...trigger.parameters, [paramName]: value }
                                    };
                                    setRequiredConditions({ ...requiredConditions, conditions: newConditions });
                                  }}
                                  resourceType={trigger.parameters.resource_type || 'health'}
                                  comparison={trigger.parameters.comparison || 'less_than'}
                                  thresholdType={trigger.parameters.threshold_type || 'percentage'}
                                  onThresholdTypeChange={(type) => {
                                    const newConditions = [...requiredConditions.conditions];
                                    newConditions[index] = {
                                      ...trigger,
                                      parameters: { ...trigger.parameters, threshold_type: type }
                                    };
                                    setRequiredConditions({ ...requiredConditions, conditions: newConditions });
                                  }}
                                />
                              ) : typeof paramValue === 'boolean' ? (
                                <div className="pf-toggle-wrapper">
                                  <button
                                    className={`pf-toggle-button ${paramValue ? 'active' : ''}`}
                                    onClick={() => {
                                      const newConditions = [...requiredConditions.conditions];
                                      newConditions[index] = {
                                        ...trigger,
                                        parameters: { ...trigger.parameters, [paramName]: !paramValue }
                                      };
                                      setRequiredConditions({ ...requiredConditions, conditions: newConditions });
                                    }}
                                  >
                                    <div className="pf-toggle-slider"></div>
                                  </button>
                                  <span className="pf-toggle-value">{paramValue ? 'Yes' : 'No'}</span>
                                </div>
                              ) : typeof paramValue === 'number' ? (
                                <div className="pf-number-input-wrapper">
                                  <input
                                    type="number"
                                    value={paramValue}
                                    onChange={(e) => {
                                      const newConditions = [...requiredConditions.conditions];
                                      newConditions[index] = {
                                        ...trigger,
                                        parameters: { ...trigger.parameters, [paramName]: parseInt(e.target.value) || 0 }
                                      };
                                      setRequiredConditions({ ...requiredConditions, conditions: newConditions });
                                    }}
                                    className="pf-number-input"
                                  />
                                  {paramName === 'percentage' && <span className="pf-input-suffix">%</span>}
                                  {paramName === 'distance' && <span className="pf-input-suffix">ft</span>}
                                  {paramName === 'amount' && <span className="pf-input-suffix">pts</span>}
                                  {paramName === 'health_threshold' && <span className="pf-input-suffix">%</span>}
                                  {paramName === 'threshold_value' && (
                                    <span className="wow-input-suffix">
                                      {trigger.parameters.threshold_type === 'percentage' ? '%' : 'pts'}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <div className="pf-select-wrapper">
                                  <select
                                    value={paramValue}
                                    onChange={(e) => {
                                      const newConditions = [...requiredConditions.conditions];
                                      newConditions[index] = {
                                        ...trigger,
                                        parameters: { ...trigger.parameters, [paramName]: e.target.value }
                                      };
                                      setRequiredConditions({ ...requiredConditions, conditions: newConditions });
                                    }}
                                    className="pf-select"
                                  >
                                    {/* Same options as regular triggers - simplified for brevity */}
                                    {paramName === 'comparison' ? (
                                      <>
                                        <option value="less_than">Less than</option>
                                        <option value="greater_than">Greater than</option>
                                        <option value="equal">Equal to</option>
                                      </>
                                    ) : paramName === 'resource_type' ? (
                                      <>
                                        {RESOURCE_TYPES.map(resource => (
                                          <option key={resource.id} value={resource.id}>{resource.name}</option>
                                        ))}
                                      </>
                                    ) : paramName === 'threshold_type' ? (
                                      <>
                                        <option value="percentage">Percentage</option>
                                        <option value="flat">Flat Value</option>
                                      </>
                                    ) : paramName === 'effect_type' ? (
                                      <>
                                        <option value="buff">Buff</option>
                                        <option value="debuff">Debuff</option>
                                        <option value="dot">DoT</option>
                                        <option value="hot">HoT (Healing over Time)</option>
                                        <option value="shield">Absorption Shield</option>
                                      </>
                                    ) : paramName === 'entity_type' || paramName === 'target_type' ? (
                                      <>
                                        <option value="self">Self</option>
                                        <option value="ally">Ally</option>
                                        <option value="enemy">Enemy</option>
                                        <option value="any">Any</option>
                                      </>
                                    ) : paramName === 'perspective' ? (
                                      <>
                                        <option value="self">Self (When I...)</option>
                                        <option value="target">Target (When my target...)</option>
                                        <option value="ally">Ally (When an ally...)</option>
                                        <option value="enemy">Enemy (When an enemy...)</option>
                                        <option value="any">Any (When anyone...)</option>
                                      </>
                                    ) : paramName === 'damage_type' ? (
                                      <>
                                        <option value="any">Any Damage</option>
                                        <option value="physical">Physical</option>
                                        <option value="magical">Magical</option>
                                        <option value="fire">Fire</option>
                                        <option value="cold">Cold</option>
                                        <option value="lightning">Lightning</option>
                                        <option value="poison">Poison</option>
                                        <option value="acid">Acid</option>
                                        <option value="necrotic">Necrotic</option>
                                        <option value="radiant">Radiant</option>
                                        <option value="force">Force</option>
                                        <option value="psychic">Psychic</option>
                                        <option value="thunder">Thunder</option>
                                      </>
                                    ) : (
                                      <option value="">Select a value</option>
                                    )}
                                  </select>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )) : editingMode === 'global' && triggerMode === 'trigger' && triggerConfig && triggerConfig.compoundTriggers ? triggerConfig.compoundTriggers.map((trigger, index) => (
                <div key={index} className="pf-selected-trigger">
                  <div className="pf-selected-trigger-header">
                    <div className="pf-selected-trigger-icon">
                      <img
                        src={getTriggerIconUrl(trigger.id)}
                        alt={trigger.name}
                        className="pf-selected-trigger-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = getCustomIconUrl('Utility/Utility', 'abilities');
                        }}
                      />
                    </div>
                    <div className="pf-selected-trigger-info">
                      <div className="pf-selected-trigger-name">{trigger.name}</div>
                      <div className="pf-selected-trigger-description">
                        {getTriggersByCategory(trigger.category).find(t => t.id === trigger.id)?.description}
                      </div>
                    </div>
                    <button className="pf-remove-trigger" onClick={() => removeTrigger(index)} title="Remove trigger">
                      <i className="fas fa-times"></i>
                    </button>
                  </div>

                  {/* Parameter controls for this trigger */}
                  {Object.keys(trigger.parameters).length > 0 && (
                    <div className="pf-trigger-parameters">
                      {Object.keys(trigger.parameters).map(paramName => {
                        const paramValue = trigger.parameters[paramName];
                        // Skip empty parameters or 'type' with no options
                        if (paramName === 'type' && (!paramValue || paramValue === '')) {
                          return null;
                        }

                        // Skip threshold_type parameter for resource_threshold as it's handled by our custom component
                        if (trigger.id === 'resource_threshold' && paramName === 'threshold_type') {
                          return null;
                        }

                        return (
                          <div key={paramName} className="pf-trigger-parameter">
                            {/* Hide label for resource threshold slider */}
                            {!(trigger.id === 'resource_threshold' && paramName === 'threshold_value') && (
                              <div className="pf-parameter-label">
                                {paramName === 'threshold_value'
                                  ? `${trigger.parameters.threshold_type === 'percentage' ? 'Percentage' : 'Value'}:`
                                  : paramName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                              </div>
                            )}
                            <div className="pf-parameter-control">
                              {/* Special case for resource threshold */}
                              {trigger.id === 'resource_threshold' && paramName === 'threshold_value' ? (
                                <ResourceThresholdSlider
                                  value={paramValue}
                                  onChange={(value) => updateTriggerParameter(index, paramName, value)}
                                  resourceType={trigger.parameters.resource_type || 'health'}
                                  comparison={trigger.parameters.comparison || 'less_than'}
                                  thresholdType={trigger.parameters.threshold_type || 'percentage'}
                                  onThresholdTypeChange={(type) => updateTriggerParameter(index, 'threshold_type', type)}
                                />
                              ) : typeof paramValue === 'boolean' ? (
                                <div className="pf-toggle-wrapper">
                                  <button
                                    className={`pf-toggle-button ${paramValue ? 'active' : ''}`}
                                    onClick={() => updateTriggerParameter(index, paramName, !paramValue)}
                                  >
                                    <div className="pf-toggle-slider"></div>
                                  </button>
                                  <span className="pf-toggle-value">{paramValue ? 'Yes' : 'No'}</span>
                                </div>
                              ) : typeof paramValue === 'number' ? (
                                <div className="pf-number-input-wrapper">
                                  <input
                                    type="number"
                                    value={paramValue}
                                    onChange={(e) => updateTriggerParameter(index, paramName, parseInt(e.target.value) || 0)}
                                    className="pf-number-input"
                                  />
                                  {paramName === 'percentage' && <span className="pf-input-suffix">%</span>}
                                  {paramName === 'distance' && <span className="pf-input-suffix">ft</span>}
                                  {paramName === 'amount' && <span className="pf-input-suffix">pts</span>}
                                  {paramName === 'health_threshold' && <span className="pf-input-suffix">%</span>}
                                  {paramName === 'threshold_value' && (
                                    <span className="wow-input-suffix">
                                      {trigger.parameters.threshold_type === 'percentage' ? '%' : 'pts'}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <div className="pf-select-wrapper">
                                  <select
                                    value={paramValue}
                                    onChange={(e) => updateTriggerParameter(index, paramName, e.target.value)}
                                    className="pf-select"
                                  >
                                    {paramName === 'comparison' ? (
                                      <>
                                        <option value="less_than">Less than</option>
                                        <option value="greater_than">Greater than</option>
                                        <option value="equal">Equal to</option>
                                      </>
                                    ) : paramName === 'resource_type' ? (
                                      <>
                                        {RESOURCE_TYPES.map(resource => (
                                          <option key={resource.id} value={resource.id}>{resource.name}</option>
                                        ))}
                                      </>
                                    ) : paramName === 'threshold_type' ? (
                                      <>
                                        <option value="percentage">Percentage</option>
                                        <option value="flat">Flat Value</option>
                                      </>
                                    ) : paramName === 'effect_type' ? (
                                      <>
                                        <option value="buff">Buff</option>
                                        <option value="debuff">Debuff</option>
                                        <option value="dot">DoT</option>
                                        <option value="hot">HoT (Healing over Time)</option>
                                        <option value="shield">Absorption Shield</option>
                                      </>
                                    ) : paramName === 'entity_type' || paramName === 'target_type' ? (
                                      <>
                                        <option value="self">Self</option>
                                        <option value="ally">Ally</option>
                                        <option value="enemy">Enemy</option>
                                        <option value="any">Any</option>
                                      </>
                                    ) : paramName === 'perspective' ? (
                                      <>
                                        <option value="self">Self (When I...)</option>
                                        <option value="target">Target (When my target...)</option>
                                        <option value="ally">Ally (When an ally...)</option>
                                        <option value="enemy">Enemy (When an enemy...)</option>
                                        <option value="any">Any (When anyone...)</option>
                                      </>
                                    ) : paramName === 'damage_type' ? (
                                      <>
                                        <option value="any">Any Damage</option>
                                        <option value="physical">Physical</option>
                                        <option value="magical">Magical</option>
                                        <option value="fire">Fire</option>
                                        <option value="cold">Cold</option>
                                        <option value="lightning">Lightning</option>
                                        <option value="poison">Poison</option>
                                        <option value="acid">Acid</option>
                                        <option value="necrotic">Necrotic</option>
                                        <option value="radiant">Radiant</option>
                                        <option value="force">Force</option>
                                        <option value="psychic">Psychic</option>
                                        <option value="thunder">Thunder</option>
                                      </>
                                    ) : paramName === 'creature_type' ? (
                                      <>
                                        <option value="any">Any Creature</option>
                                        <option value="enemy">Enemies Only</option>
                                        <option value="ally">Allies Only</option>
                                        <option value="player">Players Only</option>
                                        <option value="npc">NPCs Only</option>
                                      </>
                                    ) : paramName === 'type' ? (
                                      <>
                                        <option value="any">Any Type</option>
                                        <option value="physical">Physical</option>
                                        <option value="magical">Magical</option>
                                        <option value="fire">Fire</option>
                                        <option value="cold">Cold</option>
                                        <option value="lightning">Lightning</option>
                                        <option value="poison">Poison</option>
                                        <option value="acid">Acid</option>
                                        <option value="necrotic">Necrotic</option>
                                        <option value="radiant">Radiant</option>
                                        <option value="force">Force</option>
                                        <option value="psychic">Psychic</option>
                                        <option value="thunder">Thunder</option>
                                      </>
                                    ) : paramName === 'area_type' ? (
                                      <>
                                        <option value="combat">Combat Area</option>
                                        <option value="safe">Safe Zone</option>
                                        <option value="hazard">Hazardous Area</option>
                                        <option value="marked">Marked Area</option>
                                        <option value="custom">Custom Area</option>
                                      </>
                                    ) : paramName === 'weather_type' ? (
                                      <>
                                        <option value="rain">Rain</option>
                                        <option value="snow">Snow</option>
                                        <option value="fog">Fog</option>
                                        <option value="storm">Storm</option>
                                        <option value="clear">Clear</option>
                                      </>
                                    ) : paramName === 'terrain_type' ? (
                                      <>
                                        <option value="forest">Forest</option>
                                        <option value="mountain">Mountain</option>
                                        <option value="desert">Desert</option>
                                        <option value="water">Water</option>
                                        <option value="urban">Urban</option>
                                        <option value="underground">Underground</option>
                                      </>
                                    ) : paramName === 'interaction_type' ? (
                                      <>
                                        <option value="touch">Touch</option>
                                        <option value="examine">Examine</option>
                                        <option value="manipulate">Manipulate</option>
                                        <option value="attack">Attack</option>
                                      </>
                                    ) : paramName === 'whose_turn' ? (
                                      <>
                                        <option value="self">Self</option>
                                        <option value="ally">Ally</option>
                                        <option value="enemy">Enemy</option>
                                        <option value="any">Any</option>
                                      </>
                                    ) : paramName === 'magic_type' ? (
                                      <>
                                        <option value="arcane">Arcane</option>
                                        <option value="divine">Divine</option>
                                        <option value="nature">Nature</option>
                                        <option value="any">Any</option>
                                      </>
                                    ) : (
                                      <option value="">Select a value</option>
                                    )}
                                  </select>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Formatted Summary */}
                  <div className="pf-trigger-summary">
                    <strong>Summary:</strong> {(() => {
                      // Build a proper sentence based on trigger type and parameters
                      let summary = '';

                      // Handle different trigger types with proper grammar
                      if (trigger.id === 'damage_taken') {
                        const perspective = trigger.parameters.perspective || 'self';
                        const amount = trigger.parameters.amount || '';
                        const damageType = trigger.parameters.damage_type || 'any';

                        const whoMap = {
                          'self': 'I take',
                          'target': 'my target takes',
                          'ally': 'an ally takes',
                          'enemy': 'an enemy takes',
                          'any': 'anyone takes'
                        };

                        summary = `When ${whoMap[perspective] || 'I take'}`;
                        if (amount) summary += ` ${amount} pts`;
                        if (damageType && damageType !== 'any') summary += ` ${damageType}`;
                        summary += ' damage';

                      } else if (trigger.id === 'resource_threshold') {
                        const perspective = trigger.parameters.perspective || 'self';
                        const resourceType = trigger.parameters.resource_type || 'health';
                        const comparison = trigger.parameters.comparison || 'less_than';
                        const thresholdValue = trigger.parameters.threshold_value || 50;
                        const thresholdType = trigger.parameters.threshold_type || 'percentage';

                        const whoMap = {
                          'self': 'my',
                          'target': 'target\'s',
                          'ally': 'ally\'s',
                          'enemy': 'enemy\'s',
                          'any': 'anyone\'s'
                        };

                        const compMap = {
                          'less_than': 'falls below',
                          'greater_than': 'rises above',
                          'equal': 'equals'
                        };

                        const resourceName = RESOURCE_TYPES.find(r => r.id === resourceType)?.name || resourceType;
                        const suffix = thresholdType === 'percentage' ? '%' : ' pts';

                        summary = `When ${whoMap[perspective] || 'my'} ${resourceName.toLowerCase()} ${compMap[comparison] || 'falls below'} ${thresholdValue}${suffix}`;

                      } else if (trigger.id === 'terrain_type') {
                        const terrainType = trigger.parameters.terrain_type || 'forest';
                        summary = `When entering ${terrainType} terrain`;

                      } else if (trigger.id === 'combat_start') {
                        summary = 'When combat begins';

                      } else if (trigger.id === 'combat_end') {
                        summary = 'When combat ends';

                      } else if (trigger.id === 'critical_hit_taken') {
                        const perspective = trigger.parameters.perspective || 'self';
                        const whoMap = {
                          'self': 'I receive',
                          'target': 'my target receives',
                          'ally': 'an ally receives',
                          'enemy': 'an enemy receives',
                          'any': 'anyone receives'
                        };
                        summary = `When ${whoMap[perspective] || 'I receive'} a critical hit`;

                      } else if (trigger.id === 'critical_hit_dealt') {
                        const perspective = trigger.parameters.perspective || 'self';
                        const whoMap = {
                          'self': 'I land',
                          'target': 'my target lands',
                          'ally': 'an ally lands',
                          'enemy': 'an enemy lands',
                          'any': 'anyone lands'
                        };
                        summary = `When ${whoMap[perspective] || 'I land'} a critical hit`;

                      } else if (trigger.id === 'distance_moved') {
                        const perspective = trigger.parameters.perspective || 'self';
                        const distance = trigger.parameters.distance || 30;
                        const whoMap = {
                          'self': 'I move',
                          'target': 'my target moves',
                          'ally': 'an ally moves',
                          'enemy': 'an enemy moves',
                          'any': 'anyone moves'
                        };
                        summary = `When ${whoMap[perspective] || 'I move'} ${distance} ft`;

                      } else if (trigger.id === 'spell_cast') {
                        const perspective = trigger.parameters.perspective || 'self';
                        const spellLevel = trigger.parameters.spell_level;
                        const whoMap = {
                          'self': 'I cast',
                          'target': 'my target casts',
                          'ally': 'an ally casts',
                          'enemy': 'an enemy casts',
                          'any': 'anyone casts'
                        };
                        summary = `When ${whoMap[perspective] || 'I cast'}`;
                        if (spellLevel) summary += ` a level ${spellLevel}`;
                        summary += ' spell';

                      } else if (trigger.id === 'turn_start') {
                        const perspective = trigger.parameters.perspective || 'self';
                        const whoMap = {
                          'self': 'my turn starts',
                          'target': 'target\'s turn starts',
                          'ally': 'ally\'s turn starts',
                          'enemy': 'enemy\'s turn starts',
                          'any': 'anyone\'s turn starts'
                        };
                        summary = `When ${whoMap[perspective] || 'my turn starts'}`;

                      } else if (trigger.id === 'turn_end') {
                        const perspective = trigger.parameters.perspective || 'self';
                        const whoMap = {
                          'self': 'my turn ends',
                          'target': 'target\'s turn ends',
                          'ally': 'ally\'s turn ends',
                          'enemy': 'enemy\'s turn ends',
                          'any': 'anyone\'s turn ends'
                        };
                        summary = `When ${whoMap[perspective] || 'my turn ends'}`;

                      } else if (trigger.id === 'miss') {
                        const perspective = trigger.parameters.perspective || 'self';
                        const whoMap = {
                          'self': 'When an enemy\'s attack misses me',
                          'target': 'When my target\'s attack misses',
                          'ally': 'When an ally\'s attack misses',
                          'enemy': 'When an enemy\'s attack misses',
                          'any': 'When anyone\'s attack misses'
                        };
                        summary = whoMap[perspective] || 'When an enemy\'s attack misses me';

                      } else if (trigger.id === 'dodge') {
                        const perspective = trigger.parameters.perspective || 'self';
                        const whoMap = {
                          'self': 'When I dodge an attack',
                          'target': 'When my target dodges an attack',
                          'ally': 'When an ally dodges an attack',
                          'enemy': 'When an enemy dodges an attack',
                          'any': 'When anyone dodges an attack'
                        };
                        summary = whoMap[perspective] || 'When I dodge an attack';

                      } else if (trigger.id === 'parry') {
                        const perspective = trigger.parameters.perspective || 'self';
                        const whoMap = {
                          'self': 'When I parry an attack',
                          'target': 'When my target parries an attack',
                          'ally': 'When an ally parries an attack',
                          'enemy': 'When an enemy parries an attack',
                          'any': 'When anyone parries an attack'
                        };
                        summary = whoMap[perspective] || 'When I parry an attack';

                      } else if (trigger.id === 'block') {
                        const perspective = trigger.parameters.perspective || 'self';
                        const whoMap = {
                          'self': 'When I block an attack',
                          'target': 'When my target blocks an attack',
                          'ally': 'When an ally blocks an attack',
                          'enemy': 'When an enemy blocks an attack',
                          'any': 'When anyone blocks an attack'
                        };
                        summary = whoMap[perspective] || 'When I block an attack';

                      } else if (trigger.id === 'leave_area') {
                        const perspective = trigger.parameters.perspective || 'self';
                        const areaType = trigger.parameters.area_type || 'area';
                        const whoMap = {
                          'self': 'I leave',
                          'target': 'my target leaves',
                          'ally': 'an ally leaves',
                          'enemy': 'an enemy leaves',
                          'any': 'anyone leaves'
                        };
                        summary = `When ${whoMap[perspective] || 'I leave'} ${areaType}`;

                      } else if (trigger.id === 'enter_area') {
                        const perspective = trigger.parameters.perspective || 'self';
                        const areaType = trigger.parameters.area_type || 'area';
                        const whoMap = {
                          'self': 'I enter',
                          'target': 'my target enters',
                          'ally': 'an ally enters',
                          'enemy': 'an enemy enters',
                          'any': 'anyone enters'
                        };
                        summary = `When ${whoMap[perspective] || 'I enter'} ${areaType}`;

                      } else if (trigger.id === 'proximity') {
                        const distance = trigger.parameters.distance || 30;
                        const entityType = trigger.parameters.entity_type || 'any';
                        const entityMap = {
                          'any': 'anyone',
                          'ally': 'an ally',
                          'enemy': 'an enemy',
                          'self': 'I'
                        };
                        summary = `When ${entityMap[entityType] || 'anyone'} comes within ${distance} ft`;

                      } else if (trigger.id === 'movement_start') {
                        const perspective = trigger.parameters.perspective || 'self';
                        const whoMap = {
                          'self': 'I start moving',
                          'target': 'my target starts moving',
                          'ally': 'an ally starts moving',
                          'enemy': 'an enemy starts moving',
                          'any': 'anyone starts moving'
                        };
                        summary = `When ${whoMap[perspective] || 'I start moving'}`;

                      } else if (trigger.id === 'movement_end') {
                        const perspective = trigger.parameters.perspective || 'self';
                        const whoMap = {
                          'self': 'I stop moving',
                          'target': 'my target stops moving',
                          'ally': 'an ally stops moving',
                          'enemy': 'an enemy stops moving',
                          'any': 'anyone stops moving'
                        };
                        summary = `When ${whoMap[perspective] || 'I stop moving'}`;

                      } else if (trigger.id === 'health_threshold') {
                        const perspective = trigger.parameters.perspective || 'self';
                        const percentage = trigger.parameters.percentage || 50;
                        const comparison = trigger.parameters.comparison || 'below';
                        const whoMap = {
                          'self': 'my health',
                          'target': 'target\'s health',
                          'ally': 'ally\'s health',
                          'enemy': 'enemy\'s health',
                          'any': 'anyone\'s health'
                        };
                        const compMap = {
                          'below': 'falls below',
                          'above': 'rises above',
                          'equals': 'equals'
                        };
                        summary = `When ${whoMap[perspective] || 'my health'} ${compMap[comparison] || 'falls below'} ${percentage}%`;

                      } else if (trigger.id === 'effect_applied') {
                        const perspective = trigger.parameters.perspective || 'self';
                        const effectType = trigger.parameters.effect_type || 'effect';
                        const whoMap = {
                          'self': 'I gain',
                          'target': 'my target gains',
                          'ally': 'an ally gains',
                          'enemy': 'an enemy gains',
                          'any': 'anyone gains'
                        };
                        summary = `When ${whoMap[perspective] || 'I gain'} ${effectType}`;

                      } else if (trigger.id === 'effect_removed') {
                        const perspective = trigger.parameters.perspective || 'self';
                        const effectType = trigger.parameters.effect_type || 'effect';
                        const whoMap = {
                          'self': 'I lose',
                          'target': 'my target loses',
                          'ally': 'an ally loses',
                          'enemy': 'an enemy loses',
                          'any': 'anyone loses'
                        };
                        summary = `When ${whoMap[perspective] || 'I lose'} ${effectType}`;

                      } else if (trigger.id === 'spell_reflect') {
                        const perspective = trigger.parameters.perspective || 'self';
                        const whoMap = {
                          'self': 'my spell is reflected',
                          'target': 'target\'s spell is reflected',
                          'ally': 'ally\'s spell is reflected',
                          'enemy': 'enemy\'s spell is reflected',
                          'any': 'anyone\'s spell is reflected'
                        };
                        summary = `When ${whoMap[perspective] || 'my spell is reflected'}`;

                      } else if (trigger.id === 'spell_interrupt') {
                        const perspective = trigger.parameters.perspective || 'self';
                        const whoMap = {
                          'self': 'my spell is interrupted',
                          'target': 'target\'s spell is interrupted',
                          'ally': 'ally\'s spell is interrupted',
                          'enemy': 'enemy\'s spell is interrupted',
                          'any': 'anyone\'s spell is interrupted'
                        };
                        summary = `When ${whoMap[perspective] || 'my spell is interrupted'}`;

                      } else if (trigger.id === 'spell_resist') {
                        const perspective = trigger.parameters.perspective || 'self';
                        const whoMap = {
                          'self': 'my spell is resisted',
                          'target': 'target resists my spell',
                          'ally': 'ally\'s spell is resisted',
                          'enemy': 'enemy\'s spell is resisted',
                          'any': 'anyone\'s spell is resisted'
                        };
                        summary = `When ${whoMap[perspective] || 'my spell is resisted'}`;

                      } else if (trigger.id === 'first_strike') {
                        const perspective = trigger.parameters.perspective || 'self';
                        const whoMap = {
                          'self': 'I make the first attack',
                          'target': 'my target makes the first attack',
                          'ally': 'an ally makes the first attack',
                          'enemy': 'an enemy makes the first attack',
                          'any': 'anyone makes the first attack'
                        };
                        summary = `When ${whoMap[perspective] || 'I make the first attack'}`;

                      } else if (trigger.id === 'last_stand') {
                        summary = 'When I am the last ally standing';

                      } else if (trigger.id === 'forced_movement') {
                        const perspective = trigger.parameters.perspective || 'self';
                        const whoMap = {
                          'self': 'I am forcibly moved',
                          'target': 'my target is forcibly moved',
                          'ally': 'an ally is forcibly moved',
                          'enemy': 'an enemy is forcibly moved',
                          'any': 'anyone is forcibly moved'
                        };
                        summary = `When ${whoMap[perspective] || 'I am forcibly moved'}`;

                      } else if (trigger.id === 'high_ground') {
                        const perspective = trigger.parameters.perspective || 'self';
                        const whoMap = {
                          'self': 'I reach high ground',
                          'target': 'my target reaches high ground',
                          'ally': 'an ally reaches high ground',
                          'enemy': 'an enemy reaches high ground',
                          'any': 'anyone reaches high ground'
                        };
                        summary = `When ${whoMap[perspective] || 'I reach high ground'}`;

                      } else if (trigger.id === 'falling') {
                        const perspective = trigger.parameters.perspective || 'self';
                        const whoMap = {
                          'self': 'I am falling',
                          'target': 'my target is falling',
                          'ally': 'an ally is falling',
                          'enemy': 'an enemy is falling',
                          'any': 'anyone is falling'
                        };
                        summary = `When ${whoMap[perspective] || 'I am falling'}`;

                      } else if (trigger.id === 'health_change') {
                        const perspective = trigger.parameters.perspective || 'self';
                        const amount = trigger.parameters.amount || 10;
                        const isPercent = trigger.parameters.is_percent || false;
                        const whoMap = {
                          'self': 'my health changes by',
                          'target': 'target\'s health changes by',
                          'ally': 'ally\'s health changes by',
                          'enemy': 'enemy\'s health changes by',
                          'any': 'anyone\'s health changes by'
                        };
                        const suffix = isPercent ? '%' : ' points';
                        summary = `When ${whoMap[perspective] || 'my health changes by'} ${amount}${suffix}`;

                      } else if (trigger.id === 'ally_health') {
                        const percentage = trigger.parameters.percentage || 50;
                        const comparison = trigger.parameters.comparison || 'below';
                        const compMap = {
                          'below': 'falls below',
                          'above': 'rises above',
                          'equals': 'equals'
                        };
                        summary = `When an ally's health ${compMap[comparison] || 'falls below'} ${percentage}%`;

                      } else if (trigger.id === 'on_death') {
                        const targetType = trigger.parameters.target_type || 'any';
                        const targetMap = {
                          'self': 'I die',
                          'ally': 'an ally dies',
                          'enemy': 'an enemy dies',
                          'any': 'anyone dies'
                        };
                        summary = `When ${targetMap[targetType] || 'anyone dies'}`;

                      } else if (trigger.id === 'on_revival') {
                        const targetType = trigger.parameters.target_type || 'any';
                        const targetMap = {
                          'self': 'I am revived',
                          'ally': 'an ally is revived',
                          'enemy': 'an enemy is revived',
                          'any': 'anyone is revived'
                        };
                        summary = `When ${targetMap[targetType] || 'anyone is revived'}`;

                      } else if (trigger.id === 'near_death') {
                        const threshold = trigger.parameters.health_threshold || 10;
                        const targetType = trigger.parameters.target_type || 'self';
                        const targetMap = {
                          'self': 'I am',
                          'ally': 'an ally is',
                          'enemy': 'an enemy is',
                          'any': 'anyone is'
                        };
                        summary = `When ${targetMap[targetType] || 'I am'} near death (${threshold}% health)`;

                      } else if (trigger.id === 'death_save_success') {
                        const targetType = trigger.parameters.target_type || 'self';
                        const targetMap = {
                          'self': 'I succeed',
                          'ally': 'an ally succeeds',
                          'enemy': 'an enemy succeeds',
                          'any': 'anyone succeeds'
                        };
                        summary = `When ${targetMap[targetType] || 'I succeed'} on a death saving throw`;

                      } else if (trigger.id === 'death_save_failure') {
                        const targetType = trigger.parameters.target_type || 'self';
                        const targetMap = {
                          'self': 'I fail',
                          'ally': 'an ally fails',
                          'enemy': 'an enemy fails',
                          'any': 'anyone fails'
                        };
                        summary = `When ${targetMap[targetType] || 'I fail'} a death saving throw`;

                      } else if (trigger.id === 'full_health') {
                        const perspective = trigger.parameters.perspective || 'self';
                        const whoMap = {
                          'self': 'I reach full health',
                          'target': 'my target reaches full health',
                          'ally': 'an ally reaches full health',
                          'enemy': 'an enemy reaches full health',
                          'any': 'anyone reaches full health'
                        };
                        summary = `When ${whoMap[perspective] || 'I reach full health'}`;

                      } else if (trigger.id === 'overhealing') {
                        const perspective = trigger.parameters.perspective || 'self';
                        const whoMap = {
                          'self': 'I would be overhealed',
                          'target': 'my target would be overhealed',
                          'ally': 'an ally would be overhealed',
                          'enemy': 'an enemy would be overhealed',
                          'any': 'anyone would be overhealed'
                        };
                        summary = `When ${whoMap[perspective] || 'I would be overhealed'}`;

                      } else if (trigger.id === 'effect_duration') {
                        const perspective = trigger.parameters.perspective || 'self';
                        const effectType = trigger.parameters.effect_type || 'effect';
                        const duration = trigger.parameters.duration || 5;
                        const whoMap = {
                          'self': 'my',
                          'target': 'target\'s',
                          'ally': 'ally\'s',
                          'enemy': 'enemy\'s',
                          'any': 'anyone\'s'
                        };
                        summary = `When ${whoMap[perspective] || 'my'} ${effectType} has ${duration} seconds remaining`;

                      } else if (trigger.id === 'effect_stack') {
                        const perspective = trigger.parameters.perspective || 'self';
                        const effectType = trigger.parameters.effect_type || 'effect';
                        const stackCount = trigger.parameters.stack_count || 3;
                        const whoMap = {
                          'self': 'my',
                          'target': 'target\'s',
                          'ally': 'ally\'s',
                          'enemy': 'enemy\'s',
                          'any': 'anyone\'s'
                        };
                        summary = `When ${whoMap[perspective] || 'my'} ${effectType} reaches ${stackCount} stacks`;

                      } else if (trigger.id === 'dispel') {
                        const perspective = trigger.parameters.perspective || 'self';
                        const effectType = trigger.parameters.effect_type || 'effect';
                        const whoMap = {
                          'self': 'my',
                          'target': 'target\'s',
                          'ally': 'ally\'s',
                          'enemy': 'enemy\'s',
                          'any': 'anyone\'s'
                        };
                        summary = `When ${whoMap[perspective] || 'my'} ${effectType} is dispelled`;

                      } else if (trigger.id === 'cleanse') {
                        const perspective = trigger.parameters.perspective || 'self';
                        const effectType = trigger.parameters.effect_type || 'debuff';
                        const whoMap = {
                          'self': 'my',
                          'target': 'target\'s',
                          'ally': 'ally\'s',
                          'enemy': 'enemy\'s',
                          'any': 'anyone\'s'
                        };
                        summary = `When ${whoMap[perspective] || 'my'} ${effectType} is cleansed`;

                      } else if (trigger.id === 'immunity') {
                        const perspective = trigger.parameters.perspective || 'self';
                        const effectType = trigger.parameters.effect_type || 'effect';
                        const whoMap = {
                          'self': 'I become immune to',
                          'target': 'my target becomes immune to',
                          'ally': 'an ally becomes immune to',
                          'enemy': 'an enemy becomes immune to',
                          'any': 'anyone becomes immune to'
                        };
                        summary = `When ${whoMap[perspective] || 'I become immune to'} ${effectType}`;

                      } else if (trigger.id === 'weather_change') {
                        const weatherType = trigger.parameters.weather_type || 'rain';
                        summary = `When weather changes to ${weatherType}`;

                      } else if (trigger.id === 'day_night') {
                        const isDay = trigger.parameters.is_day !== false;
                        summary = `When it becomes ${isDay ? 'day' : 'night'}`;

                      } else if (trigger.id === 'object_interaction') {
                        const objectType = trigger.parameters.object_type || 'object';
                        summary = `When interacting with ${objectType}`;

                      } else if (trigger.id === 'environmental_damage') {
                        const damageType = trigger.parameters.damage_type || 'environmental';
                        summary = `When taking ${damageType} damage from environment`;

                      } else if (trigger.id === 'underwater') {
                        summary = 'When underwater';

                      } else if (trigger.id === 'in_darkness') {
                        summary = 'When in darkness or dim light';

                      } else if (trigger.id === 'in_bright_light') {
                        summary = 'When in bright light';

                      } else if (trigger.id === 'round_start') {
                        summary = 'When a combat round starts';

                      } else if (trigger.id === 'round_end') {
                        summary = 'When a combat round ends';

                      } else if (trigger.id === 'timer') {
                        const seconds = trigger.parameters.seconds || trigger.parameters.time || 10;
                        summary = `After ${seconds} seconds`;

                      } else if (trigger.id === 'cooldown_ready') {
                        const abilityId = trigger.parameters.ability_id || 'ability';
                        summary = `When ${abilityId} cooldown is ready`;

                      } else if (trigger.id === 'duration_threshold') {
                        const duration = trigger.parameters.duration || 5;
                        const comparison = trigger.parameters.comparison || 'below';
                        const compMap = {
                          'below': 'falls below',
                          'above': 'rises above',
                          'equals': 'equals'
                        };
                        summary = `When spell duration ${compMap[comparison] || 'falls below'} ${duration} seconds`;

                      } else if (trigger.id === 'stepped_on') {
                        const creatureType = trigger.parameters.creature_type || 'any';
                        const creatureMap = {
                          'any': 'any creature',
                          'enemy': 'an enemy',
                          'ally': 'an ally',
                          'player': 'a player',
                          'npc': 'an NPC'
                        };
                        summary = `When ${creatureMap[creatureType] || 'any creature'} steps on the trap`;

                      } else if (trigger.id === 'interaction') {
                        const interactionType = trigger.parameters.interaction_type || 'touch';
                        const interactionMap = {
                          'touch': 'touches',
                          'examine': 'examines',
                          'manipulate': 'manipulates',
                          'attack': 'attacks'
                        };
                        summary = `When someone ${interactionMap[interactionType] || 'touches'} the trap`;

                      } else if (trigger.id === 'line_of_sight') {
                        const creatureType = trigger.parameters.creature_type || 'any';
                        const creatureMap = {
                          'any': 'any creature',
                          'enemy': 'an enemy',
                          'ally': 'an ally',
                          'player': 'a player',
                          'npc': 'an NPC'
                        };
                        summary = `When ${creatureMap[creatureType] || 'any creature'} enters line of sight`;

                      } else if (trigger.id === 'detection_attempt') {
                        summary = 'When someone attempts to detect the trap';

                      } else if (trigger.id === 'disarm_attempt') {
                        summary = 'When someone attempts to disarm the trap';

                      } else if (trigger.id === 'weight_pressure') {
                        const threshold = trigger.parameters.weight_threshold || 100;
                        summary = `When ${threshold} lbs of weight is applied`;

                      } else if (trigger.id === 'magical_trigger') {
                        const magicType = trigger.parameters.magic_type || 'any';
                        const magicMap = {
                          'arcane': 'arcane magic',
                          'divine': 'divine magic',
                          'nature': 'nature magic',
                          'any': 'any magic'
                        };
                        summary = `When ${magicMap[magicType] || 'any magic'} is detected`;

                      } else if (trigger.id === 'trap_chain') {
                        summary = 'When another trap is triggered';

                      } else if (trigger.id === 'trap_damage') {
                        const threshold = trigger.parameters.damage_threshold || 10;
                        summary = `When the trap deals ${threshold}+ damage`;

                      } else if (trigger.id === 'damage_dealt') {
                        const perspective = trigger.parameters.perspective || 'self';
                        const amount = trigger.parameters.amount || '';
                        const damageType = trigger.parameters.damage_type || 'any';

                        const whoMap = {
                          'self': 'I deal',
                          'target': 'my target deals',
                          'ally': 'an ally deals',
                          'enemy': 'an enemy deals',
                          'any': 'anyone deals'
                        };

                        summary = `When ${whoMap[perspective] || 'I deal'}`;
                        if (amount) summary += ` ${amount} pts of`;
                        if (damageType && damageType !== 'any') summary += ` ${damageType}`;
                        summary += ' damage';

                      } else if (trigger.id === 'critical_hit') {
                        const perspective = trigger.parameters.perspective || 'self';
                        const whoMap = {
                          'self': 'I land',
                          'target': 'my target lands',
                          'ally': 'an ally lands',
                          'enemy': 'an enemy lands',
                          'any': 'anyone lands'
                        };
                        summary = `When ${whoMap[perspective] || 'I land'} a critical hit`;

                      } else {
                        // Fallback for other trigger types
                        const perspective = trigger.parameters.perspective;
                        if (perspective) {
                          const perspectiveMap = {
                            'self': 'When I',
                            'target': 'When my target',
                            'ally': 'When an ally',
                            'enemy': 'When an enemy',
                            'any': 'When anyone'
                          };
                          summary = `${perspectiveMap[perspective] || 'When'} ${trigger.name.toLowerCase()}`;
                        } else {
                          summary = `When ${trigger.name.toLowerCase()}`;
                        }
                      }

                      return summary;
                    })()}
                  </div>
                </div>
              )) : editingMode === 'effect' && selectedEffect && effectTriggers[selectedEffect] && effectTriggers[selectedEffect].compoundTriggers ? effectTriggers[selectedEffect].compoundTriggers.map((trigger, index) => (
                <div key={index} className="pf-selected-trigger">
                  <div className="pf-selected-trigger-header">
                    <div className="pf-selected-trigger-icon">
                      <img
                        src={getTriggerIconUrl(trigger.id)}
                        alt={trigger.name}
                        className="pf-selected-trigger-img"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = getCustomIconUrl('Utility/Utility', 'abilities');
                        }}
                      />
                    </div>
                    <div className="pf-selected-trigger-info">
                      <div className="pf-selected-trigger-name">{trigger.name}</div>
                      <div className="pf-selected-trigger-description">
                        {getTriggersByCategory(trigger.category).find(t => t.id === trigger.id)?.description}
                      </div>
                    </div>
                    <button className="pf-remove-trigger" onClick={() => removeTrigger(index)} title="Remove trigger">
                      <i className="fas fa-times"></i>
                    </button>
                  </div>

                  {/* Parameter controls for this trigger */}
                  {Object.keys(trigger.parameters).length > 0 && (
                    <div className="pf-trigger-parameters">
                      {Object.keys(trigger.parameters).map(paramName => {
                        const paramValue = trigger.parameters[paramName];
                        // Skip empty parameters or 'type' with no options
                        if (paramName === 'type' && (!paramValue || paramValue === '')) {
                          return null;
                        }

                        // Skip threshold_type parameter for resource_threshold as it's handled by our custom component
                        if (trigger.id === 'resource_threshold' && paramName === 'threshold_type') {
                          return null;
                        }

                        return (
                          <div key={paramName} className="pf-trigger-parameter">
                            {/* Hide label for resource threshold slider */}
                            {!(trigger.id === 'resource_threshold' && paramName === 'threshold_value') && (
                              <div className="pf-parameter-label">
                                {paramName === 'threshold_value'
                                  ? `${trigger.parameters.threshold_type === 'percentage' ? 'Percentage' : 'Value'}:`
                                  : paramName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}:
                              </div>
                            )}
                            <div className="pf-parameter-control">
                              {/* Special case for resource threshold */}
                              {trigger.id === 'resource_threshold' && paramName === 'threshold_value' ? (
                                <ResourceThresholdSlider
                                  value={paramValue}
                                  onChange={(value) => updateTriggerParameter(index, paramName, value)}
                                  resourceType={trigger.parameters.resource_type || 'health'}
                                  comparison={trigger.parameters.comparison || 'less_than'}
                                  thresholdType={trigger.parameters.threshold_type || 'percentage'}
                                  onThresholdTypeChange={(type) => updateTriggerParameter(index, 'threshold_type', type)}
                                />
                              ) : typeof paramValue === 'boolean' ? (
                                <div className="pf-toggle-wrapper">
                                  <button
                                    className={`pf-toggle-button ${paramValue ? 'active' : ''}`}
                                    onClick={() => updateTriggerParameter(index, paramName, !paramValue)}
                                  >
                                    <div className="pf-toggle-slider"></div>
                                  </button>
                                  <span className="pf-toggle-value">{paramValue ? 'Yes' : 'No'}</span>
                                </div>
                              ) : typeof paramValue === 'number' ? (
                                <div className="pf-number-input-wrapper">
                                  <input
                                    type="number"
                                    value={paramValue}
                                    onChange={(e) => updateTriggerParameter(index, paramName, parseInt(e.target.value) || 0)}
                                    className="pf-number-input"
                                  />
                                  {paramName === 'percentage' && <span className="pf-input-suffix">%</span>}
                                  {paramName === 'distance' && <span className="pf-input-suffix">ft</span>}
                                  {paramName === 'amount' && <span className="pf-input-suffix">pts</span>}
                                  {paramName === 'health_threshold' && <span className="pf-input-suffix">%</span>}
                                  {paramName === 'threshold_value' && (
                                    <span className="wow-input-suffix">
                                      {trigger.parameters.threshold_type === 'percentage' ? '%' : 'pts'}
                                    </span>
                                  )}
                                </div>
                              ) : (
                                <div className="wow-select-wrapper">
                                  <select
                                    value={paramValue}
                                    onChange={(e) => updateTriggerParameter(index, paramName, e.target.value)}
                                    className="wow-select"
                                  >
                                    {paramName === 'comparison' ? (
                                      <>
                                        <option value="less_than">Less than</option>
                                        <option value="greater_than">Greater than</option>
                                        <option value="equal">Equal to</option>
                                      </>
                                    ) : paramName === 'resource_type' ? (
                                      <>
                                        {RESOURCE_TYPES.map(resource => (
                                          <option key={resource.id} value={resource.id}>{resource.name}</option>
                                        ))}
                                      </>
                                    ) : paramName === 'threshold_type' ? (
                                      <>
                                        <option value="percentage">Percentage</option>
                                        <option value="flat">Flat Value</option>
                                      </>
                                    ) : paramName === 'effect_type' ? (
                                      <>
                                        <option value="buff">Buff</option>
                                        <option value="debuff">Debuff</option>
                                        <option value="dot">DoT</option>
                                        <option value="hot">HoT (Healing over Time)</option>
                                        <option value="shield">Absorption Shield</option>
                                      </>
                                    ) : paramName === 'entity_type' || paramName === 'target_type' ? (
                                      <>
                                        <option value="self">Self</option>
                                        <option value="ally">Ally</option>
                                        <option value="enemy">Enemy</option>
                                        <option value="any">Any</option>
                                      </>
                                    ) : paramName === 'perspective' ? (
                                      <>
                                        <option value="self">Self (When I...)</option>
                                        <option value="target">Target (When my target...)</option>
                                        <option value="ally">Ally (When an ally...)</option>
                                        <option value="enemy">Enemy (When an enemy...)</option>
                                        <option value="any">Any (When anyone...)</option>
                                      </>
                                    ) : paramName === 'damage_type' ? (
                                      <>
                                        <option value="any">Any Damage</option>
                                        <option value="physical">Physical</option>
                                        <option value="magical">Magical</option>
                                        <option value="fire">Fire</option>
                                        <option value="cold">Cold</option>
                                        <option value="lightning">Lightning</option>
                                        <option value="poison">Poison</option>
                                        <option value="acid">Acid</option>
                                        <option value="necrotic">Necrotic</option>
                                        <option value="radiant">Radiant</option>
                                        <option value="force">Force</option>
                                        <option value="psychic">Psychic</option>
                                        <option value="thunder">Thunder</option>
                                      </>
                                    ) : paramName === 'creature_type' ? (
                                      <>
                                        <option value="any">Any Creature</option>
                                        <option value="enemy">Enemies Only</option>
                                        <option value="ally">Allies Only</option>
                                        <option value="player">Players Only</option>
                                        <option value="npc">NPCs Only</option>
                                      </>
                                    ) : paramName === 'type' ? (
                                      <>
                                        <option value="any">Any Type</option>
                                        <option value="physical">Physical</option>
                                        <option value="magical">Magical</option>
                                        <option value="fire">Fire</option>
                                        <option value="cold">Cold</option>
                                        <option value="lightning">Lightning</option>
                                        <option value="poison">Poison</option>
                                        <option value="acid">Acid</option>
                                        <option value="necrotic">Necrotic</option>
                                        <option value="radiant">Radiant</option>
                                        <option value="force">Force</option>
                                        <option value="psychic">Psychic</option>
                                        <option value="thunder">Thunder</option>
                                      </>
                                    ) : paramName === 'area_type' ? (
                                      <>
                                        <option value="combat">Combat Area</option>
                                        <option value="safe">Safe Zone</option>
                                        <option value="hazard">Hazardous Area</option>
                                        <option value="marked">Marked Area</option>
                                        <option value="custom">Custom Area</option>
                                      </>
                                    ) : paramName === 'weather_type' ? (
                                      <>
                                        <option value="rain">Rain</option>
                                        <option value="snow">Snow</option>
                                        <option value="fog">Fog</option>
                                        <option value="storm">Storm</option>
                                        <option value="clear">Clear</option>
                                      </>
                                    ) : paramName === 'terrain_type' ? (
                                      <>
                                        <option value="forest">Forest</option>
                                        <option value="mountain">Mountain</option>
                                        <option value="desert">Desert</option>
                                        <option value="water">Water</option>
                                        <option value="urban">Urban</option>
                                        <option value="underground">Underground</option>
                                      </>
                                    ) : paramName === 'interaction_type' ? (
                                      <>
                                        <option value="touch">Touch</option>
                                        <option value="examine">Examine</option>
                                        <option value="manipulate">Manipulate</option>
                                        <option value="attack">Attack</option>
                                      </>
                                    ) : paramName === 'whose_turn' ? (
                                      <>
                                        <option value="self">Self</option>
                                        <option value="ally">Ally</option>
                                        <option value="enemy">Enemy</option>
                                        <option value="any">Any</option>
                                      </>
                                    ) : paramName === 'magic_type' ? (
                                      <>
                                        <option value="arcane">Arcane</option>
                                        <option value="divine">Divine</option>
                                        <option value="nature">Nature</option>
                                        <option value="any">Any</option>
                                      </>
                                    ) : (
                                      <option value="">Select a value</option>
                                    )}
                                  </select>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <Step7ConditionalFormulas
                    trigger={trigger}
                    selectedEffect={selectedEffect}
                    conditionalEffects={conditionalEffects}
                    updateConditionalFormula={updateConditionalFormula}
                    updateConditionalSettings={updateConditionalSettings}
                  />
                </div>
              )) : <></>}
            </div>
          )}
        </div>



        {/* Effect-specific Preview removed - triggers now shown directly on spellcard */}

        {/* Examples */}
        <Step7ExampleCards />
      </div>
    </WizardStep>
  );
};

export default Step7Triggers;
