import React from 'react';
import { useSpellWizardState } from '../../context/spellWizardContext';
import { getTriggerIconUrl } from '../../core/data/triggerIcons';
import { triggerCategories, getTriggersByCategory, RESOURCE_TYPES } from '../../core/data/triggerData';
import { getIconUrl } from '../../utils/iconUtils';
import { getCreatureTokenIconUrl, getCustomIconUrl } from '../../../../utils/assetManager';
import { formatEffectComponent } from '../common/SpellCardUtils';

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

const StatModifierDisplay = ({ stat, isDebuff = false }) => {
  let value;
  let valueClass;

  if (typeof stat.magnitude === 'string') {
    value = stat.magnitude;
    valueClass = 'formula';
  } else {
    const sign = stat.magnitude >= 0 ? '+' : '';
    value = stat.magnitudeType === 'percentage'
      ? `${sign}${stat.magnitude}%`
      : `${sign}${stat.magnitude}`;

    valueClass = isDebuff
      ? (stat.magnitude < 0 ? 'negative' : 'positive')
      : (stat.magnitude >= 0 ? 'positive' : 'negative');
  }

  return (
    <div className="selected-stat">
      <div className="stat-icon">
        <img src={getIconUrl(stat.icon)} alt={stat.name} />
      </div>
      <div className="stat-info">
        <div className="stat-name">{stat.name}</div>
        <div className="stat-description">{stat.description || 'Modifies character attributes'}</div>
      </div>
      <div className={`stat-value ${valueClass}`}>
        {value}
      </div>
    </div>
  );
};

const EffectConfigPanel = ({
  effectTypes,
  selectedEffect,
  setSelectedEffect,
  editingMode,
  effectTriggers,
  conditionalEffects,
  toggleConditionalEffect,
  triggerMode,
  setLogicType,
  selectedCategory,
  setSelectedCategory,
  addTrigger
}) => {
  const state = useSpellWizardState();

  return (
    <>
      {editingMode === 'effect' && (
        <div className="pf-config-group mb-md">
          <h4 className="pf-config-label">Select Effect</h4>
          <p className="mb-sm">Choose which effect to configure triggers and conditional behavior for.</p>

          <div className="wow-effect-selector">
            {effectTypes.map(effectType => {
              const allSubOptions = {
                damage: [
                  { id: 'damage_direct', name: 'Direct Damage', icon: 'spell_fire_fireball02',
                    check: () => state.damageConfig && state.damageConfig.damageType === 'direct' },
                  { id: 'damage_dot', name: 'Damage Over Time', icon: 'spell_shadow_curseofsargeras',
                    check: () => state.damageConfig && state.damageConfig.damageType === 'dot' },
                  { id: 'damage_combined', name: 'Combined Damage', icon: 'inv_elemental_primal_fire',
                    check: () => state.damageConfig && state.damageConfig.damageType === 'combined' }
                ],
                healing: [
                  { id: 'healing_direct', name: 'Direct Healing', icon: 'spell_holy_flashheal',
                    check: () => state.healingConfig && state.healingConfig.healingType === 'direct' },
                  { id: 'healing_hot', name: 'Healing Over Time', icon: 'spell_holy_renew',
                    check: () => state.healingConfig && state.healingConfig.healingType === 'hot' },
                  { id: 'healing_shield', name: 'Absorption Shield', icon: 'spell_holy_powerwordshield',
                    check: () => state.healingConfig && state.healingConfig.hasShieldEffect === true },
                  { id: 'healing_combined', name: 'Combined Healing', icon: 'spell_holy_holybolt',
                    check: () => state.healingConfig && state.healingConfig.healingType === 'combined' }
                ],
                buff: [
                  { id: 'buff_stat', name: 'Stat Buff', icon: 'spell_holy_wordfortitude',
                    check: () => state.buffConfig && state.buffConfig.buffType === 'stat' },
                  { id: 'buff_protection', name: 'Protection', icon: 'spell_holy_devotionaura',
                    check: () => state.buffConfig && state.buffConfig.buffType === 'protection' },
                  { id: 'buff_utility', name: 'Utility', icon: 'spell_nature_invisibilty',
                    check: () => state.buffConfig && state.buffConfig.buffType === 'utility' }
                ],
                debuff: [
                  { id: 'debuff_stat', name: 'Stat Debuff', icon: 'spell_shadow_curseofachimonde',
                    check: () => state.debuffConfig && state.debuffConfig.debuffType === 'stat' },
                  { id: 'debuff_control', name: 'Control', icon: 'spell_frost_chainsofice',
                    check: () => state.debuffConfig && state.debuffConfig.debuffType === 'control' },
                  { id: 'debuff_utility', name: 'Utility', icon: 'spell_shadow_mindrot',
                    check: () => state.debuffConfig && state.debuffConfig.debuffType === 'utility' }
                ]
              };

              const configuredSubOptions = allSubOptions[effectType] ?
                allSubOptions[effectType].filter(option => option.check()) : [];

              const hasConfiguredSubOptions = configuredSubOptions.length > 0;

              return (
                <div key={effectType} className="wow-effect-group">
                  <div className="wow-effect-main">
                    {hasConfiguredSubOptions ? (
                      <div className="wow-effect-suboptions-row">
                        {configuredSubOptions.map(subOption => {
                          const subEffectPreview = formatEffectComponent(state, effectType, subOption.id);
                          return (
                            <button
                              key={subOption.id}
                              className={`wow-effect-card-button wow-effect-suboption-card ${selectedEffect === subOption.id ? 'active' : ''}`}
                              onClick={() => setSelectedEffect(subOption.id)}
                              title={subOption.name}
                            >
                              <div className="wow-effect-card-header">
                                <div className="wow-effect-card-icon">
                                  <img
                                    src={getEffectIconUrl(effectType)}
                                    alt={subOption.name}
                                    className="wow-effect-img"
                                    onError={(e) => {
                                      e.target.onerror = null;
                                      e.target.src = getCustomIconUrl('Utility/Utility', 'abilities');
                                    }}
                                  />
                                </div>
                                <div className="wow-effect-card-title">
                                  {subOption.id === 'healing_hot' ? 'HoT' :
                                   subOption.id === 'healing_shield' ? 'Shield' :
                                   subOption.name.split(' ').pop()}
                                </div>
                              </div>
                              {subEffectPreview && (
                                <div className="wow-effect-card-preview">{subEffectPreview}</div>
                              )}
                            </button>
                          );
                        })}
                      </div>
                    ) : (
                      <button
                        className={`wow-effect-card-button ${selectedEffect === effectType ? 'active' : ''}`}
                        onClick={() => setSelectedEffect(effectType)}
                      >
                        <div className="wow-effect-card-header">
                          <div className="wow-effect-card-icon">
                            <img
                              src={getEffectIconUrl(effectType)}
                              alt={effectType}
                              className="wow-effect-img"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = getCustomIconUrl('Utility/Utility', 'abilities');
                              }}
                            />
                          </div>
                          <div className="wow-effect-card-title">{effectType.charAt(0).toUpperCase() + effectType.slice(1)}</div>
                        </div>
                        {(() => {
                          const mainEffectPreview = formatEffectComponent(state, effectType);
                          return mainEffectPreview ? (
                            <div className="wow-effect-card-preview">{mainEffectPreview}</div>
                          ) : null;
                        })()}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {editingMode === 'effect' && selectedEffect && (
        <div className="pf-config-group mb-md">
          <div className="wow-effect-config-tabs">
            <button
              className="wow-effect-config-tab active"
              onClick={() => {/* Tab is already active */}}
            >
              {(() => {
                if (selectedEffect.includes('_')) {
                  const parts = selectedEffect.split('_');
                  const effectType = parts[0];
                  const subType = parts.slice(1).join(' ');

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

                  return `${formattedSubType} ${formattedEffectType} Configuration`;
                } else {
                  return `${selectedEffect.charAt(0).toUpperCase() + selectedEffect.slice(1)} Configuration`;
                }
              })()}
            </button>
          </div>

          <div className="wow-effect-config-content">
            <div className="wow-effect-base-info">
              <h5 className="wow-effect-subtitle">Base Effect Information</h5>
              <div className="wow-effect-base-details">
                {(selectedEffect === 'damage' || selectedEffect?.startsWith('damage_')) && state.damageConfig && (() => {
                  const effectPreview = formatEffectComponent(state, 'damage', selectedEffect);
                  return (
                    <div className="wow-effect-card-preview">
                      <div className="wow-effect-card-content">
                        {effectPreview ? (
                          <div className="wow-effect-formatted-text">{effectPreview}</div>
                        ) : (
                          <>
                            <div className="wow-effect-detail">
                              <span className="wow-effect-detail-label">
                                <img
                                  src={getCustomIconUrl('Fire/Flame Burst', 'abilities')}
                                  alt="Type"
                                  className="wow-element-icon"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = getCustomIconUrl('Utility/Utility', 'abilities');
                                  }}
                                />Type:
                              </span>
                              <span className="wow-effect-detail-value">
                                <img
                                  src={getCustomIconUrl(
                                    state.damageConfig.elementType === 'ember' ? 'Fire/Flame Burst' :
                                    state.damageConfig.elementType === 'rime' ? 'Frost/Frost Touch' :
                                    state.damageConfig.elementType === 'storm' ? 'Lightning/Lightning Strike' :
                                    'Fire/Flame Burst', 'abilities')}
                                  alt={state.damageConfig.elementType || 'ember'}
                                  className="wow-element-icon"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = getCustomIconUrl('Utility/Utility', 'abilities');
                                  }}
                                />
                                {state.damageConfig.elementType || 'ember'} ({state.damageConfig.damageType === 'dot' ? 'DoT' :
                                  state.damageConfig.damageType?.charAt(0).toUpperCase() + state.damageConfig.damageType?.slice(1) || 'Direct'})
                              </span>
                            </div>
                            <div className="wow-effect-detail">
                              <span className="wow-effect-detail-label">Formula:</span>
                              <span className="wow-effect-detail-value">{state.damageConfig.formula || '1d6 + INT'}</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {(selectedEffect === 'healing' || selectedEffect?.startsWith('healing_')) && state.healingConfig && (() => {
                  const effectPreview = formatEffectComponent(state, 'healing', selectedEffect);
                  return (
                    <div className="wow-effect-card-preview">
                      <div className="wow-effect-card-content">
                        {effectPreview ? (
                          <div className="wow-effect-formatted-text">{effectPreview}</div>
                        ) : (
                          <div className="wow-effect-details-container">
                            <div className="wow-effect-detail">
                              <span className="wow-effect-detail-label">Type:</span>
                              <span className="wow-effect-detail-value">
                                <span className="wow-healing-type">Holy (Healing)</span>
                              </span>
                            </div>
                            <div className="wow-effect-detail">
                              <span className="wow-effect-detail-label">Formula:</span>
                              <span className="wow-effect-detail-value wow-formula">{state.healingConfig.formula || '2d8 + HEA'}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })()}

                {(selectedEffect === 'buff' || selectedEffect?.startsWith('buff_')) && state.buffConfig && (
                  <>
                    <div className="wow-effect-detail">
                      <span className="wow-effect-detail-label">Duration:</span>
                      <span className="wow-effect-detail-value">{state.buffConfig.duration || '1'} {state.buffConfig.durationUnit || 'minutes'}</span>
                    </div>
                    {selectedEffect === 'buff_stat' && (
                      <>
                        <div className="wow-effect-detail">
                          <span className="wow-effect-detail-label">Stats:</span>
                        </div>
                        {state.buffConfig.statModifiers && state.buffConfig.statModifiers.length > 0 ? (
                          <div className="selected-stats">
                            {state.buffConfig.statModifiers.map(stat => (
                              <StatModifierDisplay key={stat.id} stat={stat} />
                            ))}
                          </div>
                        ) : (
                          <div className="wow-effect-detail">
                            <span className="wow-effect-detail-value">No stats configured</span>
                          </div>
                        )}
                      </>
                    )}
                    {selectedEffect === 'buff_protection' && (
                      <div className="wow-effect-detail">
                        <span className="wow-effect-detail-label">Protection:</span>
                        <span className="wow-effect-detail-value">
                          {state.buffConfig.protectionType || 'Damage Reduction'} ({state.buffConfig.protectionValue || '5'})
                        </span>
                      </div>
                    )}
                  </>
                )}

                {(selectedEffect === 'debuff' || selectedEffect?.startsWith('debuff_')) && state.debuffConfig && (
                  <>
                    <div className="wow-effect-detail">
                      <span className="wow-effect-detail-label">Duration:</span>
                      <span className="wow-effect-detail-value">{state.debuffConfig.duration || '1'} {state.debuffConfig.durationUnit || 'minutes'}</span>
                    </div>
                    <div className="wow-effect-detail">
                      <span className="wow-effect-detail-label">Save:</span>
                      <span className="wow-effect-detail-value">DC {state.debuffConfig.difficultyClass || '15'} ({state.debuffConfig.savingThrow || 'Constitution'})</span>
                    </div>
                    {selectedEffect === 'debuff_stat' && (
                      <>
                        <div className="wow-effect-detail">
                          <span className="wow-effect-detail-label">Stats:</span>
                        </div>
                        {state.debuffConfig.statPenalties && state.debuffConfig.statPenalties.length > 0 ? (
                          <div className="selected-stats">
                            {state.debuffConfig.statPenalties.map(stat => (
                              <StatModifierDisplay key={stat.id} stat={stat} isDebuff={true} />
                            ))}
                          </div>
                        ) : (
                          <div className="wow-effect-detail">
                            <span className="wow-effect-detail-value">No stats configured</span>
                          </div>
                        )}
                      </>
                    )}
                    {selectedEffect === 'debuff_control' && (
                      <div className="wow-effect-detail">
                        <span className="wow-effect-detail-label">Control:</span>
                        <span className="wow-effect-detail-value">{state.debuffConfig.controlType || 'Slow'}</span>
                      </div>
                    )}
                  </>
                )}

                {selectedEffect === 'control' && state.controlConfig && (
                  <>
                    <div className="wow-effect-detail">
                      <span className="wow-effect-detail-label">Duration:</span>
                      <span className="wow-effect-detail-value">{state.controlConfig.duration || '1'} {state.controlConfig.durationUnit || 'rounds'}</span>
                    </div>
                    <div className="wow-effect-detail">
                      <span className="wow-effect-detail-label">Save:</span>
                      <span className="wow-effect-detail-value">DC {state.controlConfig.difficultyClass || '15'} ({state.controlConfig.savingThrow || 'Strength'})</span>
                    </div>
                    <div className="wow-effect-detail">
                      <span className="wow-effect-detail-label">Control Type:</span>
                      <span className="wow-effect-detail-value">{state.controlConfig.controlType || 'Stun'}</span>
                    </div>
                  </>
                )}

                {selectedEffect === 'summon' && state.summoningConfig && (
                  <>
                    {state.summoningConfig.creatures && state.summoningConfig.creatures.length > 0 ? (
                      <>
                        <div className="wow-effect-detail">
                          <span className="wow-effect-detail-label">Creatures:</span>
                          <div className="wow-effect-detail-value wow-creature-list">
                            {state.summoningConfig.creatures.map((creature, index) => (
                              <div key={index} className="wow-creature-item">
                                <img
                                  src={getCreatureTokenIconUrl(creature.tokenIcon, creature.type)}
                                  alt={creature.name}
                                  className="wow-creature-icon"
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = getCustomIconUrl('Utility/Utility', 'abilities');
                                  }}
                                />
                                <span>{creature.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    ) : (
                      <div className="wow-effect-detail">
                        <span className="wow-effect-detail-label">Creature:</span>
                        <span className="wow-effect-detail-value">{state.summoningConfig.creatureType || 'Elemental'}</span>
                      </div>
                    )}
                    <div className="wow-effect-detail">
                      <span className="wow-effect-detail-label">Duration:</span>
                      <span className="wow-effect-detail-value">{state.summoningConfig.duration || '10'} {state.summoningConfig.durationUnit || 'minutes'}</span>
                    </div>
                    <div className="wow-effect-detail">
                      <span className="wow-effect-detail-label">Count:</span>
                      <span className="wow-effect-detail-value">{state.summoningConfig.quantity || state.summoningConfig.count || '1'}</span>
                    </div>
                    <div className="wow-effect-detail">
                      <span className="wow-effect-detail-label">Control:</span>
                      <span className="wow-effect-detail-value">
                        {state.summoningConfig.controlType ?
                          state.summoningConfig.controlType.charAt(0).toUpperCase() + state.summoningConfig.controlType.slice(1) :
                          'Verbal'} Commands
                      </span>
                    </div>
                    {state.summoningConfig.waitForTrigger && (
                      <div className="wow-effect-detail wow-trigger-detail">
                        <span className="wow-effect-detail-label">
                          <img
                            src={getCustomIconUrl('Utility/Utility', 'abilities')}
                            alt="Trigger"
                            className="wow-element-icon"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = getCustomIconUrl('Utility/Utility', 'abilities');
                            }}
                          />Trigger:
                        </span>
                        <span className="wow-effect-detail-value">Waits for trigger condition</span>
                      </div>
                    )}
                  </>
                )}

                {selectedEffect === 'utility' && state.utilityConfig && (
                  <>
                    <div className="wow-effect-detail">
                      <span className="wow-effect-detail-label">Type:</span>
                      <span className="wow-effect-detail-value">{state.utilityConfig.utilityType || 'Movement'}</span>
                    </div>
                    <div className="wow-effect-detail">
                      <span className="wow-effect-detail-label">Duration:</span>
                      <span className="wow-effect-detail-value">{state.utilityConfig.duration || '10'} {state.utilityConfig.durationUnit || 'minutes'}</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <div className="wow-conditional-toggle">
              <label className="wow-conditional-label">Enable Conditional Activation:</label>
              <div className="wow-toggle-wrapper">
                <button
                  className={`wow-toggle-button ${conditionalEffects[selectedEffect]?.isConditional ? 'active' : ''}`}
                  onClick={() => toggleConditionalEffect(selectedEffect, !conditionalEffects[selectedEffect]?.isConditional)}
                >
                  <div className="wow-toggle-slider"></div>
                </button>
                <span className="wow-toggle-value">
                  {conditionalEffects[selectedEffect]?.isConditional ? 'Enabled' : 'Disabled'}
                </span>
              </div>
            </div>

            <div className="wow-effect-triggers">
              <h5 className="wow-effect-subtitle">
                {triggerMode === 'required' ? 'Required State' : 'Effect-Specific Triggers'}
              </h5>
              <p className="wow-effect-description">
                {triggerMode === 'required' 
                  ? 'Configure conditions that must be met for this effect to be enabled.'
                  : 'Configure triggers that apply specifically to this effect. When the trigger is met, the effect applies.'}
              </p>

              <div className="pf-logic-selector">
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
              </div>

              <div className="wow-add-trigger-section">
                <p className="wow-add-trigger-instruction">
                  Select a trigger category and click on a trigger to add it to this effect.
                </p>

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

                <div className="wow-trigger-options">
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

              {effectTriggers[selectedEffect]?.compoundTriggers && effectTriggers[selectedEffect].compoundTriggers.length === 0 ? (
                <div className="wow-no-triggers">
                  <p>No triggers selected for this effect. Add triggers from the categories above.</p>
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EffectConfigPanel;
