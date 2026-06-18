import React from 'react';
import { useSpellWizardState, useSpellWizardDispatch } from '../../context/spellWizardContext';
import { getCustomIconUrl, getCreatureTokenIconUrl } from '../../../../utils/assetManager';
import { getIconUrl } from '../../utils/iconUtils';

const getEffectIconUrl = (effectType) => {
  const effectIcons = {
    damage: 'Fire/Flame Burst',
    healing: 'Healing/Golden Heart',
    buff: 'Radiant/Radiant Aura',
    debuff: 'Necrotic/Necrotic Skull',
    control: 'Utility/Stun',
    utility: 'Utility/Utility',
    summon: 'Utility/Summon Minion',
    transform: 'Utility/Utility',
    purification: 'Radiant/Divine Blessing',
    restoration: 'Healing/Golden Heart'
  };
  return getCustomIconUrl(effectIcons[effectType] || 'Utility/Utility', 'abilities');
};

const Step7ConditionalFormulas = ({ trigger, selectedEffect, conditionalEffects, updateConditionalFormula, updateConditionalSettings }) => {
  const state = useSpellWizardState();
  const dispatch = useSpellWizardDispatch();

  if (!conditionalEffects[selectedEffect]?.isConditional) return null;

                    <div className="wow-conditional-formula-section">
                      <div className="wow-conditional-formula-header">
                        <h6 className="wow-conditional-formula-title">Conditional Effect Configuration</h6>
                        <p className="wow-conditional-formula-description">
                          Configure how this effect behaves when this specific trigger activates it.
                        </p>
                      </div>

                      {/* Different configuration UI based on effect type */}
                      {(selectedEffect === 'damage' || selectedEffect?.startsWith('damage_')) && (
                        <div className="wow-conditional-formula-input">
                          <label>Damage Formula:</label>
                          <input
                            type="text"
                            value={conditionalEffects[selectedEffect]?.conditionalFormulas?.[trigger.id] || ''}
                            onChange={(e) => updateConditionalFormula(selectedEffect, trigger.id, e.target.value)}
                            placeholder={conditionalEffects[selectedEffect]?.baseFormula || "e.g., 2d6 + INT"}
                            className="wow-formula-input"
                          />
                          {/* Display the standard formula for reference */}
                          {conditionalEffects[selectedEffect]?.baseFormula && (
                            <div className="wow-standard-formula-reference">
                              <span className="wow-standard-formula-label">Standard Formula:</span>
                              <span className="wow-standard-formula-value">{conditionalEffects[selectedEffect]?.baseFormula}</span>
                            </div>
                          )}

                          {/* Duration input for damage_dot */}
                          {selectedEffect === 'damage_dot' && (
                            <div className="wow-conditional-duration-input">
                              <label>Duration:</label>
                              <div className="wow-duration-input-group">
                                <input
                                  type="number"
                                  value={
                                    conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.dotDuration ||
                                    conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.duration ||
                                    state.damageConfig?.dotDuration ||
                                    3
                                  }
                                  onChange={(e) => {
                                    // Update the conditional duration
                                    const newConditionalEffects = { ...conditionalEffects };
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                      newConditionalEffects[selectedEffect].conditionalSettings = {};
                                    }
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                      newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                    }

                                    // For damage_dot, store as both duration and dotDuration for compatibility
                                    const durationValue = parseInt(e.target.value) || 3;
                                    if (selectedEffect === 'damage_dot') {
                                      newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].dotDuration = durationValue;
                                      // Also set elementType and damageType if not already set
                                      if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].elementType) {
                                        newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].elementType =
                                          state.damageConfig?.elementType || 'ember';
                                      }
                                      if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].damageType) {
                                        newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].damageType = 'dot';
                                      }
                                    }

                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].duration = durationValue;
                                    setConditionalEffects(newConditionalEffects);
                                  }}
                                  min="1"
                                  max="100"
                                  className="wow-duration-value"
                                />

                                <select
                                  value={
                                    conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.durationUnit ||
                                    state.damageConfig?.dotDurationUnit ||
                                    'rounds'
                                  }
                                  onChange={(e) => {
                                    // Update the conditional duration unit
                                    const newConditionalEffects = { ...conditionalEffects };
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                      newConditionalEffects[selectedEffect].conditionalSettings = {};
                                    }
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                      newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                    }

                                    const unitValue = e.target.value;

                                    // For damage_dot, store as both durationUnit and dotDurationUnit for compatibility
                                    if (selectedEffect === 'damage_dot') {
                                      newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].dotDurationUnit = unitValue;
                                    }

                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].durationUnit = unitValue;
                                    setConditionalEffects(newConditionalEffects);
                                  }}
                                  className="wow-duration-unit"
                                >
                                  <option value="rounds">Rounds</option>
                                  <option value="seconds">Seconds</option>
                                  <option value="minutes">Minutes</option>
                                  <option value="hours">Hours</option>
                                  <option value="days">Days</option>
                                </select>
                              </div>
                            </div>
                          )}

                          {/* Quick Formula Suggestions for Damage */}
                          <div className="wow-formula-suggestions">
                            <div className="wow-formula-suggestion-buttons">
                              <button
                                className="wow-formula-suggestion"
                                onClick={() => updateConditionalFormula(selectedEffect, trigger.id, '2d8 + INT')}
                                title="Higher damage for this trigger"
                              >
                                Increased (2d8 + INT)
                              </button>
                              <button
                                className="wow-formula-suggestion"
                                onClick={() => updateConditionalFormula(selectedEffect, trigger.id, '1d4 + INT/2')}
                                title="Lower damage for this trigger"
                              >
                                Reduced (1d4 + INT/2)
                              </button>
                              <button
                                className="wow-formula-suggestion"
                                onClick={() => updateConditionalFormula(selectedEffect, trigger.id, '3d6 + INT*2')}
                                title="Critical damage for this trigger"
                              >
                                Critical (3d6 + INT*2)
                              </button>
                            </div>
                          </div>

                          <div className="wow-conditional-formula-example">
                            <p className="wow-conditional-formula-tip">
                              <strong>Example:</strong> {
                                trigger.id === 'dodge' ?
                                  "When the target dodges, deal 1d4 damage instead of the normal 2d8." :
                                trigger.id === 'critical_hit' ?
                                  "On a critical hit, deal 3d6 + INT*2 damage instead of the normal amount." :
                                trigger.id === 'health_threshold' ?
                                  "When target is below the health threshold, deal 3d8 + INT damage." :
                                selectedEffect === 'damage_dot' ?
                                  "Configure both the damage formula and duration for this damage over time effect." :
                                "Set a different damage formula for when this specific trigger activates the effect."
                              }
                            </p>
                          </div>
                        </div>
                      )}

                      {(selectedEffect === 'healing' || selectedEffect?.startsWith('healing_')) && (
                        <div className="wow-conditional-formula-input">
                          <label>Healing Formula:</label>
                          <input
                            type="text"
                            value={conditionalEffects[selectedEffect]?.conditionalFormulas?.[trigger.id] || ''}
                            onChange={(e) => updateConditionalFormula(selectedEffect, trigger.id, e.target.value)}
                            placeholder={conditionalEffects[selectedEffect]?.baseFormula || "e.g., 2d8 + HEA"}
                            className="wow-formula-input"
                          />
                          {/* Display the standard formula for reference */}
                          {conditionalEffects[selectedEffect]?.baseFormula && (
                            <div className="wow-standard-formula-reference">
                              <span className="wow-standard-formula-label">Standard Formula:</span>
                              <span className="wow-standard-formula-value">{conditionalEffects[selectedEffect]?.baseFormula}</span>
                            </div>
                          )}

                          {/* Duration input for healing_hot */}
                          {selectedEffect === 'healing_hot' && (
                            <div className="wow-conditional-duration-input">
                              <label>Duration:</label>
                              <div className="wow-duration-input-group">
                                <input
                                  type="number"
                                  value={
                                    conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.duration ||
                                    state.healingConfig?.hotDuration ||
                                    3
                                  }
                                  onChange={(e) => {
                                    // Update the conditional duration
                                    const newConditionalEffects = { ...conditionalEffects };
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                      newConditionalEffects[selectedEffect].conditionalSettings = {};
                                    }
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                      newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                    }

                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].duration = parseInt(e.target.value) || 3;
                                    setConditionalEffects(newConditionalEffects);
                                  }}
                                  min="1"
                                  max="100"
                                  className="wow-duration-value"
                                />

                                <select
                                  value={
                                    conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.durationUnit ||
                                    state.healingConfig?.hotDurationUnit ||
                                    'rounds'
                                  }
                                  onChange={(e) => {
                                    // Update the conditional duration unit
                                    const newConditionalEffects = { ...conditionalEffects };
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                      newConditionalEffects[selectedEffect].conditionalSettings = {};
                                    }
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                      newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                    }

                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].durationUnit = e.target.value;
                                    setConditionalEffects(newConditionalEffects);
                                  }}
                                  className="wow-duration-unit"
                                >
                                  <option value="rounds">Rounds</option>
                                  <option value="seconds">Seconds</option>
                                  <option value="minutes">Minutes</option>
                                  <option value="hours">Hours</option>
                                  <option value="days">Days</option>
                                </select>
                              </div>
                            </div>
                          )}

                          {/* Quick Formula Suggestions for Healing */}
                          <div className="wow-formula-suggestions">
                            <div className="wow-formula-suggestion-buttons">
                              <button
                                className="wow-formula-suggestion"
                                onClick={() => updateConditionalFormula(selectedEffect, trigger.id, '3d8 + HEA')}
                                title="Higher healing for this trigger"
                              >
                                Increased (3d8 + HEA)
                              </button>
                              <button
                                className="wow-formula-suggestion"
                                onClick={() => updateConditionalFormula(selectedEffect, trigger.id, '1d6 + HEA/2')}
                                title="Lower healing for this trigger"
                              >
                                Reduced (1d6 + HEA/2)
                              </button>
                              <button
                                className="wow-formula-suggestion"
                                onClick={() => updateConditionalFormula(selectedEffect, trigger.id, '4d8 + HEA*1.5')}
                                title="Critical healing for this trigger"
                              >
                                Critical (4d8 + HEA*1.5)
                              </button>
                            </div>
                          </div>

                          <div className="wow-conditional-formula-example">
                            <p className="wow-conditional-formula-tip">
                              <strong>Example:</strong> {
                                trigger.id === 'health_threshold' ?
                                  "When target is below the health threshold, healing is increased to 3d8 + HEA." :
                                trigger.id === 'overhealing' ?
                                  "When target would be overhealed, create a shield instead." :
                                selectedEffect === 'healing_hot' ?
                                  "Configure both the healing formula and duration for this healing over time effect." :
                                "Set a different healing formula for when this specific trigger activates the effect."
                              }
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Buff Configuration UI */}
                      {(selectedEffect === 'buff' || selectedEffect?.startsWith('buff_')) && (
                        <div className="wow-buff-config-container">
                          {/* Stat Modifiers Section */}
                          <div className="wow-buff-config-section">
                            <h6 className="wow-buff-section-title">Stat Modifiers</h6>

                            {state.buffConfig && state.buffConfig.statModifiers && state.buffConfig.statModifiers.length > 0 ? (
                              <div className="wow-buff-stat-modifiers">
                                {state.buffConfig.statModifiers.map((stat, statIndex) => {
                                  // Get conditional value for this stat if it exists
                                  const conditionalSettings = conditionalEffects[selectedEffect]?.conditionalSettings || {};
                                  const triggerSettings = conditionalSettings[trigger.id] || {};
                                  const statSettings = triggerSettings.statModifiers || [];
                                  const conditionalStat = statSettings.find(s => s.id === stat.id) || {};

                                  // Check if this stat is enabled in the conditional effect
                                  const isEnabled = !!conditionalStat.id;

                                  return (
                                    <div key={statIndex} className={`wow-buff-stat-modifier ${isEnabled ? '' : 'disabled'}`}>
                                      <div className="wow-buff-stat-info">
                                        <div className="wow-buff-stat-checkbox">
                                          <input
                                            type="checkbox"
                                            checked={isEnabled}
                                            onChange={(e) => {
                                              // Toggle this stat in the conditional settings
                                              const newConditionalEffects = { ...conditionalEffects };
                                              if (!newConditionalEffects[selectedEffect]) {
                                                newConditionalEffects[selectedEffect] = { isConditional: true, conditionalFormulas: {}, conditionalSettings: {} };
                                              }
                                              if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                                newConditionalEffects[selectedEffect].conditionalSettings = {};
                                              }
                                              if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                                newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = { statModifiers: [] };
                                              }

                                              let statModifiers = [...(newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].statModifiers || [])];

                                              if (e.target.checked) {
                                                // Add the stat if it doesn't exist
                                                if (!statModifiers.find(s => s.id === stat.id)) {
                                                  statModifiers.push({
                                                    ...stat,
                                                    magnitude: stat.magnitude,
                                                    magnitudeType: stat.magnitudeType
                                                  });
                                                }
                                              } else {
                                                // Remove the stat if it exists
                                                const index = statModifiers.findIndex(s => s.id === stat.id);
                                                if (index >= 0) {
                                                  statModifiers.splice(index, 1);
                                                }
                                              }

                                              newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].statModifiers = statModifiers;
                                              setConditionalEffects(newConditionalEffects);
                                            }}
                                          />
                                        </div>
                                        <div className="wow-buff-stat-icon">
                                          <img src={getIconUrl(stat.icon)} alt={stat.name} />
                                        </div>
                                        <div className="wow-buff-stat-name">{stat.name}</div>
                                      </div>

                                      {isEnabled && (
                                        <div className="wow-buff-stat-value-container">
                                          <input
                                            type="text"
                                            className="wow-buff-stat-value-input"
                                            value={conditionalStat.magnitude !== undefined ? conditionalStat.magnitude : (stat.magnitude || '')}
                                            onChange={(e) => {
                                              // Update the conditional stat value
                                              const newConditionalEffects = { ...conditionalEffects };
                                              if (!newConditionalEffects[selectedEffect]) {
                                                newConditionalEffects[selectedEffect] = { isConditional: true, conditionalFormulas: {}, conditionalSettings: {} };
                                              }
                                              if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                                newConditionalEffects[selectedEffect].conditionalSettings = {};
                                              }
                                              if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                                newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = { statModifiers: [] };
                                              }

                                              // Find or create the stat modifier
                                              let statModifiers = [...(newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].statModifiers || [])];
                                              const existingStatIndex = statModifiers.findIndex(s => s.id === stat.id);

                                              if (existingStatIndex >= 0) {
                                                // Create a new object to avoid reference issues
                                                statModifiers[existingStatIndex] = {
                                                  ...statModifiers[existingStatIndex],
                                                  magnitude: e.target.value
                                                };
                                              } else {
                                                // Create a completely new object
                                                statModifiers.push({
                                                  id: stat.id,
                                                  name: stat.name,
                                                  icon: stat.icon,
                                                  description: stat.description,
                                                  magnitude: e.target.value,
                                                  magnitudeType: stat.magnitudeType
                                                });
                                              }

                                              newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].statModifiers = statModifiers;
                                              setConditionalEffects(newConditionalEffects);

                                              // Also update the formula for backward compatibility
                                              updateConditionalFormula(selectedEffect, trigger.id, e.target.value);
                                            }}
                                            placeholder={stat.magnitude || ''}
                                          />

                                          <select
                                            className="wow-buff-stat-type-select"
                                            value={conditionalStat.magnitudeType || stat.magnitudeType || 'flat'}
                                            onChange={(e) => {
                                              // Update the conditional stat type
                                              const newConditionalEffects = { ...conditionalEffects };
                                              if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                                newConditionalEffects[selectedEffect].conditionalSettings = {};
                                              }
                                              if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                                newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = { statModifiers: [] };
                                              }

                                              // Find or create the stat modifier
                                              let statModifiers = [...(newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].statModifiers || [])];
                                              const existingStatIndex = statModifiers.findIndex(s => s.id === stat.id);

                                              if (existingStatIndex >= 0) {
                                                // Create a new object to avoid reference issues
                                                statModifiers[existingStatIndex] = {
                                                  ...statModifiers[existingStatIndex],
                                                  magnitudeType: e.target.value
                                                };
                                              } else {
                                                // Create a completely new object
                                                statModifiers.push({
                                                  id: stat.id,
                                                  name: stat.name,
                                                  icon: stat.icon,
                                                  description: stat.description,
                                                  magnitude: stat.magnitude,
                                                  magnitudeType: e.target.value
                                                });
                                              }

                                              newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].statModifiers = statModifiers;
                                              setConditionalEffects(newConditionalEffects);
                                            }}
                                          >
                                            <option value="flat">Flat</option>
                                            <option value="percentage">Percentage</option>
                                          </select>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            ) : (
                              <div className="wow-buff-no-stats">
                                <p>No stat modifiers configured. Add stats in the Buff Effect step.</p>
                              </div>
                            )}
                          </div>

                          {/* Duration Section */}
                          <div className="wow-buff-config-section">
                            <h6 className="wow-buff-section-title">Duration</h6>
                            <div className="wow-buff-duration-container">
                              <div className="wow-buff-duration-input">
                                <input
                                  type="number"
                                  className="wow-buff-duration-value"
                                  value={
                                    conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.duration ||
                                    state.buffConfig?.durationValue ||
                                    state.buffConfig?.duration ||
                                    3
                                  }
                                  onChange={(e) => {
                                    // Update the conditional duration
                                    const newConditionalEffects = { ...conditionalEffects };
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                      newConditionalEffects[selectedEffect].conditionalSettings = {};
                                    }
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                      newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                    }

                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].duration = parseInt(e.target.value) || 3;
                                    setConditionalEffects(newConditionalEffects);
                                  }}
                                  min="1"
                                  max="100"
                                />

                                <select
                                  className="wow-buff-duration-unit"
                                  value={
                                    conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.durationUnit ||
                                    (state.buffConfig?.durationType === 'time' ?
                                      (state.buffConfig?.durationUnit || 'minutes') :
                                     state.buffConfig?.durationType === 'rest' ?
                                      (state.buffConfig?.restType || 'short') :
                                     state.buffConfig?.durationType === 'permanent' ?
                                      'permanent' :
                                      'rounds')
                                  }
                                  onChange={(e) => {
                                    // Update the conditional duration unit
                                    const newConditionalEffects = { ...conditionalEffects };
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                      newConditionalEffects[selectedEffect].conditionalSettings = {};
                                    }
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                      newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                    }

                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].durationUnit = e.target.value;
                                    setConditionalEffects(newConditionalEffects);
                                  }}
                                >
                                  <option value="rounds">Rounds</option>
                                  <option value="seconds">Seconds</option>
                                  <option value="minutes">Minutes</option>
                                  <option value="hours">Hours</option>
                                  <option value="days">Days</option>
                                  <option value="short">Short Rest</option>
                                  <option value="long">Long Rest</option>
                                  <option value="permanent">Permanent</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Quick Suggestions for Buff Effects */}
                          <div className="wow-formula-suggestions">
                            <h6 className="wow-buff-section-title">Quick Suggestions</h6>
                            <div className="wow-formula-suggestion-buttons">
                              <button
                                className="wow-formula-suggestion"
                                onClick={() => {
                                  // Apply increased values to all stats
                                  const newConditionalEffects = { ...conditionalEffects };
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                    newConditionalEffects[selectedEffect].conditionalSettings = {};
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = { statModifiers: [] };
                                  }

                                  // Create increased stat modifiers with a deep copy
                                  const statModifiers = state.buffConfig?.statModifiers?.map(stat => ({
                                    // Create a completely new object to avoid reference issues
                                    id: stat.id,
                                    name: stat.name,
                                    icon: stat.icon,
                                    description: stat.description,
                                    // Double the magnitude for the enhanced effect
                                    magnitude: typeof stat.magnitude === 'number' ? stat.magnitude * 2 : 4,
                                    magnitudeType: 'flat'
                                  })) || [];

                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].statModifiers = statModifiers;
                                  setConditionalEffects(newConditionalEffects);

                                  // Also update the formula for backward compatibility
                                  updateConditionalFormula(selectedEffect, trigger.id, '+4');
                                }}
                                title="Double the stat bonuses for this trigger"
                              >
                                Double Bonuses
                              </button>
                              <button
                                className="wow-formula-suggestion"
                                onClick={() => {
                                  // Apply percentage values to all stats
                                  const newConditionalEffects = { ...conditionalEffects };
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                    newConditionalEffects[selectedEffect].conditionalSettings = {};
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = { statModifiers: [] };
                                  }

                                  // Create percentage stat modifiers
                                  const statModifiers = state.buffConfig?.statModifiers?.map(stat => ({
                                    ...stat,
                                    magnitude: 10,
                                    magnitudeType: 'percentage'
                                  })) || [];

                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].statModifiers = statModifiers;
                                  setConditionalEffects(newConditionalEffects);

                                  // Also update the formula for backward compatibility
                                  updateConditionalFormula(selectedEffect, trigger.id, '+10%');
                                }}
                                title="Convert all bonuses to percentage values"
                              >
                                Percentage Bonuses
                              </button>
                              <button
                                className="wow-formula-suggestion"
                                onClick={() => {
                                  // Apply variable values to all stats
                                  const newConditionalEffects = { ...conditionalEffects };
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                    newConditionalEffects[selectedEffect].conditionalSettings = {};
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = { statModifiers: [] };
                                  }

                                  // Create variable stat modifiers
                                  const statModifiers = state.buffConfig?.statModifiers?.map(stat => ({
                                    ...stat,
                                    magnitude: '2d4',
                                    magnitudeType: 'flat'
                                  })) || [];

                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].statModifiers = statModifiers;
                                  setConditionalEffects(newConditionalEffects);

                                  // Also update the formula for backward compatibility
                                  updateConditionalFormula(selectedEffect, trigger.id, '2d4');
                                }}
                                title="Use variable dice rolls for bonuses"
                              >
                                Variable Bonuses
                              </button>
                            </div>
                          </div>

                          <div className="wow-conditional-formula-example">
                            <p className="wow-conditional-formula-tip">
                              <strong>Example:</strong> {
                                trigger.id === 'combat_start' ?
                                  "When combat starts, provide stronger stat bonuses than normal." :
                                trigger.id === 'health_threshold' ?
                                  "When target is below the health threshold, provide percentage bonuses instead of flat bonuses." :
                                "Configure how the buff behaves when this specific trigger activates it."
                              }
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Debuff Configuration UI */}
                      {(selectedEffect === 'debuff' || selectedEffect?.startsWith('debuff_')) && (
                        <div className="wow-debuff-config-container">
                          {/* Stat Penalties Section */}
                          {(selectedEffect === 'debuff_stat' || selectedEffect === 'debuff') && (
                            <div className="wow-debuff-config-section">
                              <h6 className="wow-debuff-section-title">Stat Penalties</h6>

                              {state.debuffConfig && state.debuffConfig.statPenalties && state.debuffConfig.statPenalties.length > 0 ? (
                                <div className="wow-debuff-stat-penalties">
                                  {state.debuffConfig.statPenalties.map((stat, statIndex) => {
                                    // Get conditional value for this stat if it exists
                                    const conditionalSettings = conditionalEffects[selectedEffect]?.conditionalSettings || {};
                                    const triggerSettings = conditionalSettings[trigger.id] || {};
                                    const statSettings = triggerSettings.statPenalties || [];
                                    const conditionalStat = statSettings.find(s => s.id === stat.id) || {};

                                    {/* Check if this stat is enabled in the conditional effect */}
                                    const isEnabled = !!conditionalStat.id;

                                    return (
                                      <div key={statIndex} className={`wow-debuff-stat-penalty ${isEnabled ? '' : 'disabled'}`}>
                                        <div className="wow-debuff-stat-info">
                                          <div className="wow-debuff-stat-checkbox">
                                            <input
                                              type="checkbox"
                                              checked={isEnabled}
                                              onChange={(e) => {
                                                // Toggle this stat in the conditional settings
                                                const newConditionalEffects = { ...conditionalEffects };
                                                if (!newConditionalEffects[selectedEffect]) {
                                                  newConditionalEffects[selectedEffect] = { isConditional: true, conditionalFormulas: {}, conditionalSettings: {} };
                                                }
                                                if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                                  newConditionalEffects[selectedEffect].conditionalSettings = {};
                                                }
                                                if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = { statPenalties: [] };
                                                }

                                                let statPenalties = [...(newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].statPenalties || [])];

                                                if (e.target.checked) {
                                                  // Add the stat if it doesn't exist
                                                  if (!statPenalties.find(s => s.id === stat.id)) {
                                                    statPenalties.push({
                                                      ...stat,
                                                      magnitude: stat.magnitude,
                                                      magnitudeType: stat.magnitudeType
                                                    });
                                                  }
                                                } else {
                                                  // Remove the stat if it exists
                                                  const index = statPenalties.findIndex(s => s.id === stat.id);
                                                  if (index >= 0) {
                                                    statPenalties.splice(index, 1);
                                                  }
                                                }

                                                newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].statPenalties = statPenalties;
                                                setConditionalEffects(newConditionalEffects);
                                              }}
                                            />
                                          </div>
                                          <div className="wow-debuff-stat-icon">
                                            <img src={getIconUrl(stat.icon)} alt={stat.name} />
                                          </div>
                                          <div className="wow-debuff-stat-name">{stat.name}</div>
                                        </div>

                                        {isEnabled && (
                                          <div className="wow-debuff-stat-value-container">
                                            <input
                                              type="text"
                                              className="wow-debuff-stat-value-input"
                                              value={conditionalStat.magnitude !== undefined ? conditionalStat.magnitude : (stat.magnitude || '')}
                                              onChange={(e) => {
                                                // Update the conditional stat value
                                                const newConditionalEffects = { ...conditionalEffects };
                                                if (!newConditionalEffects[selectedEffect]) {
                                                  newConditionalEffects[selectedEffect] = { isConditional: true, conditionalFormulas: {}, conditionalSettings: {} };
                                                }
                                                if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                                  newConditionalEffects[selectedEffect].conditionalSettings = {};
                                                }
                                                if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = { statPenalties: [] };
                                                }

                                                // Find or create the stat penalty
                                                const statPenalties = newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].statPenalties || [];
                                                const existingStatIndex = statPenalties.findIndex(s => s.id === stat.id);

                                                if (existingStatIndex >= 0) {
                                                  statPenalties[existingStatIndex] = {
                                                    ...statPenalties[existingStatIndex],
                                                    magnitude: e.target.value
                                                  };
                                                } else {
                                                  statPenalties.push({
                                                    ...stat,
                                                    magnitude: e.target.value
                                                  });
                                                }

                                                newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].statPenalties = statPenalties;
                                                setConditionalEffects(newConditionalEffects);

                                                // Also update the formula for backward compatibility
                                                updateConditionalFormula(selectedEffect, trigger.id, e.target.value);
                                              }}
                                              placeholder={stat.magnitude || ''}
                                            />

                                            <select
                                              className="wow-debuff-stat-type-select"
                                              value={conditionalStat.magnitudeType || stat.magnitudeType || 'flat'}
                                              onChange={(e) => {
                                                // Update the conditional stat type
                                                const newConditionalEffects = { ...conditionalEffects };
                                                if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                                  newConditionalEffects[selectedEffect].conditionalSettings = {};
                                                }
                                                if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = { statPenalties: [] };
                                                }

                                                // Find or create the stat penalty
                                                const statPenalties = newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].statPenalties || [];
                                                const existingStatIndex = statPenalties.findIndex(s => s.id === stat.id);

                                                if (existingStatIndex >= 0) {
                                                  statPenalties[existingStatIndex] = {
                                                    ...statPenalties[existingStatIndex],
                                                    magnitudeType: e.target.value
                                                  };
                                                } else {
                                                  statPenalties.push({
                                                    ...stat,
                                                    magnitudeType: e.target.value
                                                  });
                                                }

                                                newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].statPenalties = statPenalties;
                                                setConditionalEffects(newConditionalEffects);
                                              }}
                                            >
                                              <option value="flat">Flat</option>
                                              <option value="percentage">Percentage</option>
                                            </select>
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              ) : (
                                <div className="wow-debuff-no-stats">
                                  <p>No stat penalties configured. Add stats in the Debuff Effect step.</p>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Duration and Saving Throw Section */}
                          <div className="wow-debuff-config-section">
                            <h6 className="wow-debuff-section-title">Duration & Saving Throw</h6>
                            <div className="wow-debuff-duration-container">
                              <div className="wow-debuff-duration-input">
                                <label>Duration:</label>
                                <input
                                  type="number"
                                  className="wow-debuff-duration-value"
                                  value={
                                    conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.duration ||
                                    state.debuffConfig?.durationValue ||
                                    state.debuffConfig?.duration ||
                                    3
                                  }
                                  onChange={(e) => {
                                    // Update the conditional duration
                                    const newConditionalEffects = { ...conditionalEffects };
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                      newConditionalEffects[selectedEffect].conditionalSettings = {};
                                    }
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                      newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                    }

                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].duration = parseInt(e.target.value) || 3;
                                    setConditionalEffects(newConditionalEffects);
                                  }}
                                  min="1"
                                  max="100"
                                />

                                <select
                                  className="wow-debuff-duration-unit"
                                  value={
                                    conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.durationUnit ||
                                    (state.debuffConfig?.durationType === 'time' ?
                                      (state.debuffConfig?.durationUnit || 'minutes') :
                                     state.debuffConfig?.durationType === 'rest' ?
                                      (state.debuffConfig?.restType || 'short') :
                                     state.debuffConfig?.durationType === 'permanent' ?
                                      'permanent' :
                                      'rounds')
                                  }
                                  onChange={(e) => {
                                    // Update the conditional duration unit
                                    const newConditionalEffects = { ...conditionalEffects };
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                      newConditionalEffects[selectedEffect].conditionalSettings = {};
                                    }
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                      newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                    }

                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].durationUnit = e.target.value;
                                    setConditionalEffects(newConditionalEffects);
                                  }}
                                >
                                  <option value="rounds">Rounds</option>
                                  <option value="seconds">Seconds</option>
                                  <option value="minutes">Minutes</option>
                                  <option value="hours">Hours</option>
                                  <option value="days">Days</option>
                                  <option value="short">Short Rest</option>
                                  <option value="long">Long Rest</option>
                                  <option value="permanent">Permanent</option>
                                </select>
                              </div>
                            </div>

                            <div className="wow-debuff-save-container">
                              <div className="wow-debuff-save-input">
                                <label>DC:</label>
                                <input
                                  type="number"
                                  className="wow-debuff-dc-value"
                                  value={
                                    conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.difficultyClass ||
                                    state.debuffConfig?.difficultyClass ||
                                    15
                                  }
                                  onChange={(e) => {
                                    // Update the conditional DC
                                    const newConditionalEffects = { ...conditionalEffects };
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                      newConditionalEffects[selectedEffect].conditionalSettings = {};
                                    }
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                      newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                    }

                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].difficultyClass = parseInt(e.target.value) || 15;
                                    setConditionalEffects(newConditionalEffects);
                                  }}
                                  min="1"
                                  max="30"
                                />

                                <label className="wow-debuff-save-label">Save:</label>
                                <select
                                  className="wow-debuff-save-type"
                                  value={
                                    conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.savingThrow ||
                                    state.debuffConfig?.savingThrow ||
                                    'constitution'
                                  }
                                  onChange={(e) => {
                                    // Update the conditional saving throw
                                    const newConditionalEffects = { ...conditionalEffects };
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                      newConditionalEffects[selectedEffect].conditionalSettings = {};
                                    }
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                      newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                    }

                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].savingThrow = e.target.value;
                                    setConditionalEffects(newConditionalEffects);
                                  }}
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

                          {/* Control Type Section (for debuff_control) */}
                          {selectedEffect === 'debuff_control' && (
                            <div className="wow-debuff-config-section">
                              <h6 className="wow-debuff-section-title">Control Type</h6>
                              <div className="wow-debuff-control-container">
                                <select
                                  className="wow-debuff-control-type"
                                  value={
                                    conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.controlType ||
                                    state.debuffConfig?.controlType ||
                                    'slow'
                                  }
                                  onChange={(e) => {
                                    // Update the conditional control type
                                    const newConditionalEffects = { ...conditionalEffects };
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                      newConditionalEffects[selectedEffect].conditionalSettings = {};
                                    }
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                      newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                    }

                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].controlType = e.target.value;
                                    setConditionalEffects(newConditionalEffects);
                                  }}
                                >
                                  <option value="slow">Slow</option>
                                  <option value="root">Root</option>
                                  <option value="stun">Stun</option>
                                  <option value="silence">Silence</option>
                                  <option value="fear">Fear</option>
                                  <option value="charm">Charm</option>
                                  <option value="sleep">Sleep</option>
                                  <option value="blind">Blind</option>
                                </select>
                              </div>
                            </div>
                          )}

                          {/* Quick Suggestions for Debuff Effects */}
                          <div className="wow-formula-suggestions">
                            <h6 className="wow-debuff-section-title">Quick Suggestions</h6>
                            <div className="wow-formula-suggestion-buttons">
                              <button
                                className="wow-formula-suggestion"
                                onClick={() => {
                                  // Apply stronger penalties to all stats
                                  const newConditionalEffects = { ...conditionalEffects };
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                    newConditionalEffects[selectedEffect].conditionalSettings = {};
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = { statPenalties: [] };
                                  }

                                  // Create stronger stat penalties
                                  const statPenalties = state.debuffConfig?.statPenalties?.map(stat => ({
                                    ...stat,
                                    magnitude: typeof stat.magnitude === 'number' ? stat.magnitude * 2 : -4,
                                    magnitudeType: 'flat'
                                  })) || [];

                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].statPenalties = statPenalties;
                                  setConditionalEffects(newConditionalEffects);

                                  // Also update the formula for backward compatibility
                                  updateConditionalFormula(selectedEffect, trigger.id, '-4');
                                }}
                                title="Double the stat penalties for this trigger"
                              >
                                Stronger Penalties
                              </button>
                              <button
                                className="wow-formula-suggestion"
                                onClick={() => {
                                  // Apply percentage values to all stats
                                  const newConditionalEffects = { ...conditionalEffects };
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                    newConditionalEffects[selectedEffect].conditionalSettings = {};
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = { statPenalties: [] };
                                  }

                                  // Create percentage stat penalties
                                  const statPenalties = state.debuffConfig?.statPenalties?.map(stat => ({
                                    ...stat,
                                    magnitude: -20,
                                    magnitudeType: 'percentage'
                                  })) || [];

                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].statPenalties = statPenalties;
                                  setConditionalEffects(newConditionalEffects);

                                  // Also update the formula for backward compatibility
                                  updateConditionalFormula(selectedEffect, trigger.id, '-20%');
                                }}
                                title="Convert all penalties to percentage values"
                              >
                                Percentage Penalties
                              </button>
                              <button
                                className="wow-formula-suggestion"
                                onClick={() => {
                                  // Apply variable values to all stats
                                  const newConditionalEffects = { ...conditionalEffects };
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                    newConditionalEffects[selectedEffect].conditionalSettings = {};
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = { statPenalties: [] };
                                  }

                                  // Create variable stat penalties
                                  const statPenalties = state.debuffConfig?.statPenalties?.map(stat => ({
                                    ...stat,
                                    magnitude: '-1d4',
                                    magnitudeType: 'flat'
                                  })) || [];

                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].statPenalties = statPenalties;
                                  setConditionalEffects(newConditionalEffects);

                                  // Also update the formula for backward compatibility
                                  updateConditionalFormula(selectedEffect, trigger.id, '-1d4');
                                }}
                                title="Use variable dice rolls for penalties"
                              >
                                Variable Penalties
                              </button>
                            </div>
                          </div>

                          <div className="wow-conditional-formula-example">
                            <p className="wow-conditional-formula-tip">
                              <strong>Example:</strong> {
                                trigger.id === 'combat_start' ?
                                  "When combat starts, apply stronger debuffs to the target." :
                                trigger.id === 'health_threshold' ?
                                  "When target is below the health threshold, apply percentage-based penalties instead of flat penalties." :
                                "Configure how the debuff behaves when this specific trigger activates it."
                              }
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Control Effect Configuration UI */}
                      {(selectedEffect === 'control' || selectedEffect?.startsWith('control_')) && (
                        <div className="wow-control-config-container">
                          {/* Control Type Section */}
                          <div className="wow-control-config-section">
                            <h6 className="wow-control-section-title">Control Type</h6>
                            <div className="wow-control-type-container">
                              <select
                                className="wow-control-type-select"
                                value={
                                  conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.controlType ||
                                  state.controlConfig?.controlType ||
                                  'stun'
                                }
                                onChange={(e) => {
                                  // Update the conditional control type
                                  const newConditionalEffects = { ...conditionalEffects };
                                  if (!newConditionalEffects[selectedEffect]) {
                                    newConditionalEffects[selectedEffect] = { isConditional: true, conditionalFormulas: {}, conditionalSettings: {} };
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                    newConditionalEffects[selectedEffect].conditionalSettings = {};
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                  }

                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].controlType = e.target.value;
                                  setConditionalEffects(newConditionalEffects);
                                }}
                              >
                                {/* Restraint Types */}
                                <optgroup label="Restraint">
                                  <option value="bind">Binding</option>
                                  <option value="slow">Slowing</option>
                                  <option value="snare">Snare</option>
                                  <option value="web">Web</option>
                                </optgroup>

                                {/* Incapacitation Types */}
                                <optgroup label="Incapacitation">
                                  <option value="sleep">Sleep</option>
                                  <option value="stun">Stun</option>
                                  <option value="paralyze">Paralyze</option>
                                  <option value="daze">Daze</option>
                                </optgroup>

                                {/* Mind Control Types */}
                                <optgroup label="Mind Control">
                                  <option value="command">Command</option>
                                  <option value="confuse">Confuse</option>
                                  <option value="dominate">Dominate</option>
                                  <option value="fear">Fear</option>
                                </optgroup>

                                {/* Knockdown Types */}
                                <optgroup label="Knockdown">
                                  <option value="trip">Trip</option>
                                  <option value="stagger">Stagger</option>
                                  <option value="repel">Repel</option>
                                  <option value="throw">Throw</option>
                                </optgroup>

                                {/* Forced Movement Types */}
                                <optgroup label="Forced Movement">
                                  <option value="push">Push</option>
                                  <option value="pull">Pull</option>
                                  <option value="slide">Slide</option>
                                  <option value="teleport">Teleport</option>
                                </optgroup>

                                {/* Action Restriction Types */}
                                <optgroup label="Action Restriction">
                                  <option value="silence">Silence</option>
                                  <option value="disarm">Disarm</option>
                                  <option value="blind">Blind</option>
                                  <option value="root">Root</option>
                                </optgroup>
                              </select>
                            </div>
                          </div>

                          {/* Duration Section */}
                          <div className="wow-control-config-section">
                            <h6 className="wow-control-section-title">Duration</h6>
                            <div className="wow-control-duration-container">
                              <div className="wow-control-duration-input">
                                <input
                                  type="number"
                                  className="wow-control-duration-value"
                                  value={
                                    conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.duration ||
                                    state.controlConfig?.duration ||
                                    1
                                  }
                                  onChange={(e) => {
                                    // Update the conditional duration
                                    const newConditionalEffects = { ...conditionalEffects };
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                      newConditionalEffects[selectedEffect].conditionalSettings = {};
                                    }
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                      newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                    }

                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].duration = parseInt(e.target.value) || 1;
                                    setConditionalEffects(newConditionalEffects);
                                  }}
                                  min="1"
                                  max="100"
                                />

                                <select
                                  className="wow-control-duration-unit"
                                  value={
                                    conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.durationUnit ||
                                    state.controlConfig?.durationUnit ||
                                    'rounds'
                                  }
                                  onChange={(e) => {
                                    // Update the conditional duration unit
                                    const newConditionalEffects = { ...conditionalEffects };
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                      newConditionalEffects[selectedEffect].conditionalSettings = {};
                                    }
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                      newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                    }

                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].durationUnit = e.target.value;
                                    setConditionalEffects(newConditionalEffects);
                                  }}
                                >
                                  <option value="rounds">Rounds</option>
                                  <option value="seconds">Seconds</option>
                                  <option value="minutes">Minutes</option>
                                  <option value="hours">Hours</option>
                                  <option value="days">Days</option>
                                </select>
                              </div>
                            </div>
                          </div>

                          {/* Saving Throw Section */}
                          <div className="wow-control-config-section">
                            <h6 className="wow-control-section-title">Saving Throw</h6>
                            <div className="wow-control-save-container">
                              <div className="wow-control-save-type">
                                <label>Save Type:</label>
                                <select
                                  className="wow-control-save-select"
                                  value={
                                    conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.savingThrow ||
                                    state.controlConfig?.savingThrow ||
                                    'strength'
                                  }
                                  onChange={(e) => {
                                    // Update the conditional saving throw
                                    const newConditionalEffects = { ...conditionalEffects };
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                      newConditionalEffects[selectedEffect].conditionalSettings = {};
                                    }
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                      newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                    }

                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].savingThrow = e.target.value;
                                    setConditionalEffects(newConditionalEffects);
                                  }}
                                >
                                  <option value="strength">Strength</option>
                                  <option value="agility">Agility</option>
                                  <option value="constitution">Constitution</option>
                                  <option value="intelligence">Intelligence</option>
                                  <option value="spirit">Spirit</option>
                                  <option value="charisma">Charisma</option>
                                </select>
                              </div>

                              <div className="wow-control-dc">
                                <label>DC:</label>
                                <input
                                  type="number"
                                  className="wow-control-dc-value"
                                  value={
                                    conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.difficultyClass ||
                                    state.controlConfig?.difficultyClass ||
                                    15
                                  }
                                  onChange={(e) => {
                                    // Update the conditional DC
                                    const newConditionalEffects = { ...conditionalEffects };
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                      newConditionalEffects[selectedEffect].conditionalSettings = {};
                                    }
                                    if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                      newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                    }

                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].difficultyClass = parseInt(e.target.value) || 15;
                                    setConditionalEffects(newConditionalEffects);
                                  }}
                                  min="1"
                                  max="30"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Quick Suggestions for Control Effects */}
                          <div className="wow-formula-suggestions">
                            <h6 className="wow-control-section-title">Quick Suggestions</h6>
                            <div className="wow-formula-suggestion-buttons">
                              <button
                                className="wow-formula-suggestion"
                                onClick={() => {
                                  // Apply stronger control effect
                                  const newConditionalEffects = { ...conditionalEffects };
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                    newConditionalEffects[selectedEffect].conditionalSettings = {};
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                  }

                                  // Increase duration and DC
                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].duration =
                                    Math.min((state.controlConfig?.duration || 1) * 2, 10);
                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].difficultyClass =
                                    Math.min((state.controlConfig?.difficultyClass || 15) + 5, 25);

                                  setConditionalEffects(newConditionalEffects);
                                }}
                                title="Stronger control effect for this trigger"
                              >
                                Stronger Control
                              </button>
                              <button
                                className="wow-formula-suggestion"
                                onClick={() => {
                                  // Apply weaker but longer control effect
                                  const newConditionalEffects = { ...conditionalEffects };
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                    newConditionalEffects[selectedEffect].conditionalSettings = {};
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                  }

                                  // Decrease DC but increase duration
                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].duration =
                                    Math.min((state.controlConfig?.duration || 1) * 3, 15);
                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].difficultyClass =
                                    Math.max((state.controlConfig?.difficultyClass || 15) - 3, 10);

                                  setConditionalEffects(newConditionalEffects);
                                }}
                                title="Longer but weaker control effect"
                              >
                                Extended Control
                              </button>
                              <button
                                className="wow-formula-suggestion"
                                onClick={() => {
                                  // Apply different control type
                                  const newConditionalEffects = { ...conditionalEffects };
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                    newConditionalEffects[selectedEffect].conditionalSettings = {};
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                  }

                                  // Change control type based on current type
                                  const currentType = state.controlConfig?.controlType || 'stun';
                                  let newType = 'stun';

                                  if (currentType === 'stun') newType = 'fear';
                                  else if (currentType === 'fear') newType = 'root';
                                  else if (currentType === 'root') newType = 'silence';
                                  else if (currentType === 'silence') newType = 'slow';
                                  else if (currentType === 'slow') newType = 'charm';
                                  else if (currentType === 'charm') newType = 'sleep';
                                  else if (currentType === 'sleep') newType = 'blind';
                                  else if (currentType === 'blind') newType = 'confuse';
                                  else if (currentType === 'confuse') newType = 'polymorph';
                                  else if (currentType === 'polymorph') newType = 'stun';

                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].controlType = newType;

                                  setConditionalEffects(newConditionalEffects);
                                }}
                                title="Change control type for this trigger"
                              >
                                Alternate Control
                              </button>
                            </div>
                          </div>

                          <div className="wow-conditional-formula-example">
                            <p className="wow-conditional-formula-tip">
                              <strong>Example:</strong> {
                                trigger.id === 'combat_start' ?
                                  "When combat starts, apply a stronger control effect with higher DC." :
                                trigger.id === 'health_threshold' ?
                                  "When target is below the health threshold, apply a different type of control effect." :
                                "Configure how the control effect behaves when this specific trigger activates it."
                              }
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Restoration Effect Configuration UI */}
                      {(selectedEffect === 'restoration' || selectedEffect?.startsWith('restoration_')) && (
                        <div className="wow-restoration-config-container">
                          {/* Resource Type Section */}
                          <div className="wow-restoration-config-section">
                            <h6 className="wow-restoration-section-title">Resource Type</h6>
                            <div className="wow-restoration-type-container">
                              <select
                                className="wow-restoration-type-select"
                                value={
                                  conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.resourceType ||
                                  state.restorationConfig?.resourceType ||
                                  'mana'
                                }
                                onChange={(e) => {
                                  // Update the conditional resource type
                                  const newConditionalEffects = { ...conditionalEffects };
                                  if (!newConditionalEffects[selectedEffect]) {
                                    newConditionalEffects[selectedEffect] = { isConditional: true, conditionalFormulas: {}, conditionalSettings: {} };
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                    newConditionalEffects[selectedEffect].conditionalSettings = {};
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                  }

                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].resourceType = e.target.value;
                                  setConditionalEffects(newConditionalEffects);
                                }}
                              >
                                {/* Vitality Resources */}
                                <optgroup label="Vitality">
                                  <option value="health">Health</option>
                                </optgroup>

                                {/* Magical Resources */}
                                <optgroup label="Magical">
                                  <option value="mana">Mana</option>
                                  <option value="inferno">Inferno</option>
                                </optgroup>

                                {/* Combat Resources */}
                                <optgroup label="Combat">
                                  <option value="action_points">Action Points</option>
                                </optgroup>

                                {/* Physical Resources */}
                                <optgroup label="Physical">
                                  <option value="energy">Energy</option>
                                  <option value="rage">Rage</option>
                                  <option value="focus">Focus</option>
                                </optgroup>
                              </select>
                            </div>
                          </div>

                          {/* Formula Section */}
                          <div className="wow-restoration-config-section">
                            <h6 className="wow-restoration-section-title">Formula</h6>
                            <div className="wow-conditional-formula-input">
                              <input
                                type="text"
                                value={conditionalEffects[selectedEffect]?.conditionalFormulas?.[trigger.id] || ''}
                                onChange={(e) => {
                                  // Update the conditional formula
                                  updateConditionalFormula(selectedEffect, trigger.id, e.target.value);

                                  // Also update the formula in the conditional settings to ensure it's properly remembered
                                  const newConditionalEffects = { ...conditionalEffects };
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                    newConditionalEffects[selectedEffect].conditionalSettings = {};
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                  }

                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].formula = e.target.value;

                                  // Make sure the formula is also stored in conditionalFormulas
                                  if (!newConditionalEffects[selectedEffect].conditionalFormulas) {
                                    newConditionalEffects[selectedEffect].conditionalFormulas = {};
                                  }
                                  newConditionalEffects[selectedEffect].conditionalFormulas[trigger.id] = e.target.value;

                                  setConditionalEffects(newConditionalEffects);

                                  // Log the updated state for debugging
                                  console.log('Updated formula:', e.target.value);
                                  console.log('Updated conditionalEffects:', JSON.stringify(newConditionalEffects));
                                }}
                                placeholder={conditionalEffects[selectedEffect]?.baseFormula || "e.g., 2d6 + INT"}
                                className="wow-formula-input"
                              />
                              <div className="wow-formula-current">
                                <span className="wow-formula-current-label">Base Formula: </span>
                                <span className="wow-formula-current-value">{conditionalEffects[selectedEffect]?.baseFormula || state.restorationConfig?.formula || '2d6 + INT'}</span>
                              </div>
                            </div>
                          </div>

                          {/* Resolution Type Section */}
                          <div className="wow-restoration-config-section">
                            <h6 className="wow-restoration-section-title">Resolution Type</h6>
                            <div className="wow-restoration-resolution-container">
                              <select
                                className="wow-restoration-resolution-select"
                                value={
                                  conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.resolution ||
                                  state.restorationConfig?.resolution ||
                                  'DICE'
                                }
                                onChange={(e) => {
                                  // Update the conditional resolution type
                                  const newConditionalEffects = { ...conditionalEffects };
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                    newConditionalEffects[selectedEffect].conditionalSettings = {};
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                  }

                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].resolution = e.target.value;
                                  setConditionalEffects(newConditionalEffects);
                                }}
                              >
                                <option value="DICE">Dice Roll</option>
                                <option value="CARDS">Card Draw</option>
                                <option value="COINS">Coin Flip</option>
                              </select>
                            </div>
                          </div>

                          {/* Over Time Section */}
                          <div className="wow-restoration-config-section">
                            <h6 className="wow-restoration-section-title">Over Time Settings</h6>
                            <div className="wow-restoration-overtime-container">
                              <div className="wow-restoration-checkbox-container">
                                <label>
                                  <input
                                    type="checkbox"
                                    checked={
                                      conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.isOverTime ||
                                      state.restorationConfig?.isOverTime ||
                                      false
                                    }
                                    onChange={(e) => {
                                      // Update the conditional over time setting
                                      const newConditionalEffects = { ...conditionalEffects };
                                      if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                        newConditionalEffects[selectedEffect].conditionalSettings = {};
                                      }
                                      if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                        newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                      }

                                      newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].isOverTime = e.target.checked;
                                      setConditionalEffects(newConditionalEffects);
                                    }}
                                  />
                                  Apply Over Time
                                </label>
                              </div>

                              {(conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.isOverTime ||
                                state.restorationConfig?.isOverTime) && (
                                <>
                                  <div className="wow-restoration-overtime-formula">
                                    <label>Over Time Formula:</label>
                                    <input
                                      type="text"
                                      value={
                                        conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.overTimeFormula ||
                                        state.restorationConfig?.overTimeFormula ||
                                        '1d4 + INT/2'
                                      }
                                      onChange={(e) => {
                                        // Update the conditional over time formula
                                        const newConditionalEffects = { ...conditionalEffects };
                                        if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                          newConditionalEffects[selectedEffect].conditionalSettings = {};
                                        }
                                        if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                          newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                        }

                                        newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeFormula = e.target.value;
                                        setConditionalEffects(newConditionalEffects);
                                      }}
                                      placeholder="e.g., 1d4 + INT/2"
                                      className="wow-formula-input"
                                    />
                                    <div className="wow-formula-current">
                                      <span className="wow-formula-current-label">Base Over Time Formula: </span>
                                      <span className="wow-formula-current-value">{state.restorationConfig?.overTimeFormula || '1d4 + INT/2'}</span>
                                    </div>
                                  </div>

                                  <div className="wow-restoration-overtime-duration">
                                    <label>Duration:</label>
                                    <div className="wow-restoration-duration-input">
                                      <input
                                        type="number"
                                        value={
                                          conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.overTimeDuration ||
                                          state.restorationConfig?.overTimeDuration ||
                                          3
                                        }
                                        onChange={(e) => {
                                          // Update the conditional over time duration
                                          const newConditionalEffects = { ...conditionalEffects };
                                          if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                            newConditionalEffects[selectedEffect].conditionalSettings = {};
                                          }
                                          if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                            newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                          }

                                          newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeDuration = parseInt(e.target.value) || 3;
                                          setConditionalEffects(newConditionalEffects);
                                        }}
                                        min="1"
                                        max="100"
                                        className="wow-duration-input"
                                      />

                                      <select
                                        value={
                                          conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.tickFrequency ||
                                          state.restorationConfig?.tickFrequency ||
                                          'round'
                                        }
                                        onChange={(e) => {
                                          // Update the conditional tick frequency
                                          const newConditionalEffects = { ...conditionalEffects };
                                          if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                            newConditionalEffects[selectedEffect].conditionalSettings = {};
                                          }
                                          if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                            newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                          }

                                          newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].tickFrequency = e.target.value;
                                          setConditionalEffects(newConditionalEffects);
                                        }}
                                        className="wow-duration-unit"
                                      >
                                        <option value="round">Rounds</option>
                                        <option value="turn">Turns</option>
                                        <option value="minute">Minutes</option>
                                        <option value="hour">Hours</option>
                                      </select>
                                    </div>
                                  </div>

                                  <div className="wow-restoration-progressive">
                                    <div className="wow-restoration-checkbox-container">
                                      <label>
                                        <input
                                          type="checkbox"
                                          checked={
                                            conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.isProgressiveOverTime ||
                                            state.restorationConfig?.isProgressiveOverTime ||
                                            false
                                          }
                                          onChange={(e) => {
                                            // Update the conditional progressive over time setting
                                            const newConditionalEffects = { ...conditionalEffects };
                                            if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                              newConditionalEffects[selectedEffect].conditionalSettings = {};
                                            }
                                            if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                              newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                            }

                                            const isProgressiveOverTime = e.target.checked;
                                            newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].isProgressiveOverTime = isProgressiveOverTime;

                                            // Initialize progressive stages if enabling
                                            if (isProgressiveOverTime &&
                                                (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeProgressiveStages ||
                                                 newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeProgressiveStages.length === 0)) {
                                              newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeProgressiveStages = [{
                                                triggerAt: 1,
                                                formula: newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeFormula ||
                                                         state.restorationConfig?.overTimeFormula || '1d4 + INT/2',
                                                description: 'Initial restoration'
                                              }];
                                            }

                                            setConditionalEffects(newConditionalEffects);
                                          }}
                                        />
                                        Progressive Stages
                                      </label>
                                    </div>

                                    {/* Display Progressive Stages */}
                                    {conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.isProgressiveOverTime &&
                                     conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.overTimeProgressiveStages && (
                                      <div className="wow-restoration-stages">
                                        <h6 className="wow-restoration-stages-title">Progressive Stages</h6>
                                        <div className="wow-restoration-stages-list">
                                          {conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.overTimeProgressiveStages.map((stage, index) => (
                                            <div key={index} className="wow-restoration-stage">
                                              <div className="wow-restoration-stage-header">
                                                <span className="wow-restoration-stage-number">Stage {index + 1}</span>
                                                <span className="wow-restoration-stage-trigger">Triggers at {stage.triggerAt} {conditionalEffects[selectedEffect]?.conditionalSettings?.[trigger.id]?.tickFrequency || 'rounds'}</span>
                                              </div>
                                              <div className="wow-restoration-stage-formula">
                                                <label>Formula:</label>
                                                <input
                                                  type="text"
                                                  value={stage.formula || ''}
                                                  onChange={(e) => {
                                                    // Update the stage formula
                                                    const newConditionalEffects = { ...conditionalEffects };
                                                    const stages = [...newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeProgressiveStages];
                                                    stages[index] = { ...stages[index], formula: e.target.value };
                                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeProgressiveStages = stages;
                                                    setConditionalEffects(newConditionalEffects);
                                                  }}
                                                  className="wow-formula-input"
                                                />
                                              </div>
                                              <div className="wow-restoration-stage-description">
                                                <label>Description:</label>
                                                <input
                                                  type="text"
                                                  value={stage.description || ''}
                                                  onChange={(e) => {
                                                    // Update the stage description
                                                    const newConditionalEffects = { ...conditionalEffects };
                                                    const stages = [...newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeProgressiveStages];
                                                    stages[index] = { ...stages[index], description: e.target.value };
                                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeProgressiveStages = stages;
                                                    setConditionalEffects(newConditionalEffects);
                                                  }}
                                                  placeholder="Optional description"
                                                  className="wow-description-input"
                                                />
                                              </div>
                                              {index > 0 && (
                                                <button
                                                  className="wow-remove-stage-button"
                                                  onClick={() => {
                                                    // Remove this stage
                                                    const newConditionalEffects = { ...conditionalEffects };
                                                    const stages = [...newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeProgressiveStages];
                                                    stages.splice(index, 1);
                                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeProgressiveStages = stages;
                                                    setConditionalEffects(newConditionalEffects);
                                                  }}
                                                >
                                                  Remove Stage
                                                </button>
                                              )}
                                            </div>
                                          ))}
                                          <button
                                            className="wow-add-stage-button"
                                            onClick={() => {
                                              // Add a new stage
                                              const newConditionalEffects = { ...conditionalEffects };
                                              const stages = [...(newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeProgressiveStages || [])];
                                              const lastStage = stages[stages.length - 1];
                                              stages.push({
                                                triggerAt: lastStage ? lastStage.triggerAt + 1 : 1,
                                                formula: lastStage ? lastStage.formula : (newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeFormula || '1d4 + INT/2'),
                                                description: ''
                                              });
                                              newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeProgressiveStages = stages;
                                              setConditionalEffects(newConditionalEffects);
                                            }}
                                          >
                                            Add Stage
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Quick Suggestions for Restoration Effects */}
                          <div className="wow-formula-suggestions">
                            <h6 className="wow-restoration-section-title">Quick Suggestions</h6>
                            <div className="wow-formula-suggestion-buttons">
                              <button
                                className="wow-formula-suggestion"
                                onClick={() => {
                                  // Apply stronger restoration effect
                                  const newConditionalEffects = { ...conditionalEffects };
                                  if (!newConditionalEffects[selectedEffect]) {
                                    newConditionalEffects[selectedEffect] = { isConditional: true, conditionalFormulas: {}, conditionalSettings: {} };
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                    newConditionalEffects[selectedEffect].conditionalSettings = {};
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                  }

                                  // Get the base formula and enhance it
                                  const baseFormula = state.restorationConfig?.formula || '2d6 + INT';
                                  const enhancedFormula = baseFormula.replace(/(\d+)d(\d+)/, (_, count, sides) => {
                                    const newCount = Math.min(parseInt(count) + 2, 10);
                                    return `${newCount}d${sides}`;
                                  });

                                  // Update the formula
                                  updateConditionalFormula(selectedEffect, trigger.id, enhancedFormula);
                                }}
                                title="Stronger restoration effect for this trigger"
                              >
                                Stronger Restoration
                              </button>
                              <button
                                className="wow-formula-suggestion"
                                onClick={() => {
                                  // Apply over time restoration
                                  const newConditionalEffects = { ...conditionalEffects };
                                  if (!newConditionalEffects[selectedEffect]) {
                                    newConditionalEffects[selectedEffect] = { isConditional: true, conditionalFormulas: {}, conditionalSettings: {} };
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                    newConditionalEffects[selectedEffect].conditionalSettings = {};
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                  }

                                  // Enable over time and set duration
                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].isOverTime = true;
                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeDuration = 5;
                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].tickFrequency = 'round';
                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeTriggerType = 'periodic';

                                  // Get the base formula and create an over time version
                                  const baseFormula = state.restorationConfig?.formula || '2d6 + INT';
                                  const overTimeFormula = baseFormula.replace(/(\d+)d(\d+)/, (_, __, sides) => {
                                    return `1d${sides}`;
                                  });

                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeFormula = overTimeFormula;

                                  setConditionalEffects(newConditionalEffects);

                                  // Also update the main formula
                                  updateConditionalFormula(selectedEffect, trigger.id, baseFormula);
                                }}
                                title="Apply restoration over time"
                              >
                                Over Time Restoration
                              </button>
                              <button
                                className="wow-formula-suggestion"
                                onClick={() => {
                                  // Apply progressive restoration
                                  const newConditionalEffects = { ...conditionalEffects };
                                  if (!newConditionalEffects[selectedEffect]) {
                                    newConditionalEffects[selectedEffect] = { isConditional: true, conditionalFormulas: {}, conditionalSettings: {} };
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings) {
                                    newConditionalEffects[selectedEffect].conditionalSettings = {};
                                  }
                                  if (!newConditionalEffects[selectedEffect].conditionalSettings[trigger.id]) {
                                    newConditionalEffects[selectedEffect].conditionalSettings[trigger.id] = {};
                                  }

                                  // Enable over time and progressive
                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].isOverTime = true;
                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeDuration = 3;
                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].tickFrequency = 'round';
                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeTriggerType = 'periodic';
                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].isProgressiveOverTime = true;

                                  // Get the base formula
                                  const baseFormula = state.restorationConfig?.formula || '2d6 + INT';

                                  // Create progressive stages
                                  newConditionalEffects[selectedEffect].conditionalSettings[trigger.id].overTimeProgressiveStages = [
                                    {
                                      triggerAt: 1,
                                      formula: baseFormula.replace(/(\d+)d(\d+)/, (_, __, sides) => `1d${sides}`),
                                      description: 'Initial restoration'
                                    },
                                    {
                                      triggerAt: 2,
                                      formula: baseFormula,
                                      description: 'Enhanced restoration'
                                    },
                                    {
                                      triggerAt: 3,
                                      formula: baseFormula.replace(/(\d+)d(\d+)/, (_, count, sides) => {
                                        const newCount = Math.min(parseInt(count) + 1, 10);
                                        return `${newCount}d${sides}`;
                                      }),
                                      description: 'Maximum restoration'
                                    }
                                  ];

                                  setConditionalEffects(newConditionalEffects);

                                  // Also update the main formula
                                  updateConditionalFormula(selectedEffect, trigger.id, baseFormula);
                                }}
                                title="Apply progressive restoration that increases over time"
                              >
                                Progressive Restoration
                              </button>
                            </div>
                          </div>

                          <div className="wow-conditional-formula-example">
                            <p className="wow-conditional-formula-tip">
                              <strong>Example:</strong> {
                                trigger.id === 'combat_start' ?
                                  "When combat starts, apply a stronger restoration effect." :
                                trigger.id === 'health_threshold' ?
                                  "When target is below the health threshold, apply restoration over time." :
                                "Configure how the restoration effect behaves when this specific trigger activates it."
                              }
                            </p>
                          </div>
                        </div>
                      )}

                      {/* Default for other effect types */}
                      {!selectedEffect?.startsWith('damage') && !selectedEffect?.startsWith('healing') &&
                       !selectedEffect?.startsWith('buff') && !selectedEffect?.startsWith('debuff') &&
                       !selectedEffect?.startsWith('control') && !selectedEffect?.startsWith('restoration') && (
                        <div className="wow-conditional-formula-input">
                          <label>Formula:</label>
                          <input
                            type="text"
                            value={conditionalEffects[selectedEffect]?.conditionalFormulas?.[trigger.id] || ''}
                            onChange={(e) => updateConditionalFormula(selectedEffect, trigger.id, e.target.value)}
                            placeholder={conditionalEffects[selectedEffect]?.baseFormula || "e.g., 2d6 + INT"}
                            className="wow-formula-input"
                          />

                          <div className="wow-conditional-formula-example">
                            <p className="wow-conditional-formula-tip">
                              <strong>Example:</strong> Set a different formula for when this specific trigger activates the effect.
                            </p>
                          </div>
                        </div>
                      )}
                      </div>
};

export default Step7ConditionalFormulas;
