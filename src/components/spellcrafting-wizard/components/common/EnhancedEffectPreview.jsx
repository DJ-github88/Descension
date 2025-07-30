import React from 'react';
import '../../styles/effect-preview.css';
import { getIconUrl } from '../../utils/iconUtils';

// Helper function to get effect icons
const getEffectIconUrl = (effectType) => {
  const effectIcons = {
    damage: 'spell_fire_flamebolt',
    healing: 'spell_holy_heal02',
    buff: 'spell_holy_divineillumination',
    debuff: 'spell_shadow_curseofsargeras',
    control: 'spell_frost_chainsofice',
    utility: 'spell_nature_earthbind',
    summon: 'spell_shadow_demonform',
    transform: 'spell_nature_polymorph',
    purification: 'spell_holy_dispelmagic',
    restoration: 'spell_holy_restoration'
  };

  // Handle sub-types like damage_dot, healing_hot, etc.
  const baseType = effectType.split('_')[0];
  const subType = effectType.includes('_') ? effectType.split('_')[1] : null;

  let iconId = effectIcons[baseType] || 'inv_misc_questionmark';

  // Override for specific subtypes
  if (subType === 'dot') iconId = 'spell_shadow_plaguecloud';
  if (subType === 'hot') iconId = 'spell_holy_sealofsacrifice';
  if (subType === 'shield') iconId = 'spell_holy_powerwordshield';
  if (subType === 'stat' && baseType === 'buff') iconId = 'spell_holy_greaterblessingofkings';
  if (subType === 'stat' && baseType === 'debuff') iconId = 'spell_shadow_curseofachimonde';
  if (subType === 'control') iconId = 'spell_frost_chainsofice';
  if (subType === 'protection') iconId = 'spell_holy_blessingofprotection';

  return `https://wow.zamimg.com/images/wow/icons/large/${iconId}.jpg`;
};

// Component for displaying stat modifiers with icons
const StatDisplay = ({ stat, isDebuff = false }) => {
  // Handle different types of magnitude values (number, string, formula)
  let value;
  let valueClass;

  if (typeof stat.magnitude === 'string' && stat.magnitude.includes('d')) {
    // Only show dice formulas, not simple +2 values
    value = stat.magnitude;
    valueClass = 'formula';
  } else if (typeof stat.magnitude === 'number') {
    // Handle numeric value
    const sign = stat.magnitude >= 0 ? '+' : '';
    value = stat.magnitudeType === 'percentage'
      ? `${sign}${stat.magnitude}%`
      : `${sign}${stat.magnitude}`;

    valueClass = isDebuff
      ? (stat.magnitude < 0 ? 'negative' : 'positive')
      : (stat.magnitude >= 0 ? 'positive' : 'negative');
  } else {
    // Skip showing simple string values like "+2"
    return null;
  }

  return (
    <div className="effect-preview-stat">
      <div className="effect-preview-stat-icon">
        <img src={getIconUrl(stat.icon)} alt={stat.name} />
      </div>
      <div className="effect-preview-stat-name">{stat.name}</div>
      <div className={`effect-preview-stat-value ${valueClass}`}>
        {value}
      </div>
    </div>
  );
};

// Component for displaying properties like duration, save DC, etc.
const PropertyDisplay = ({ icon, label, value }) => {
  return (
    <div className="effect-preview-property">
      <div className={`effect-preview-property-icon ${icon}`}></div>
      <div className="effect-preview-property-label">
        {typeof label === 'string' ? `${label}:` : label}
      </div>
      <div className="effect-preview-property-value">{value}</div>
    </div>
  );
};

// Component for displaying trigger conditions
const TriggerDisplay = ({ trigger, resourceTypes }) => {
  // Extract perspective parameter if it exists
  const perspective = trigger.parameters.perspective;

  return (
    <div className="effect-preview-trigger-item">
      <div className="effect-preview-trigger-name">
        {trigger.name}
        {perspective && (
          <span className="trigger-perspective">
            {perspective.charAt(0).toUpperCase() + perspective.slice(1)}
          </span>
        )}
      </div>
      <div className="effect-preview-trigger-params">
        {Object.entries(trigger.parameters).map(([key, value], i) => {
          // Skip perspective parameter as it's handled separately
          if (key === 'perspective') return null;

          // Format parameter display
          let formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          let formattedValue = value;

          // Special formatting for certain parameter types
          if (key === 'comparison') {
            formattedKey = '';
            formattedValue = value === 'less_than'
              ? 'is less than'
              : value === 'greater_than'
                ? 'is greater than'
                : 'equals';
          } else if (key === 'resource_type') {
            formattedValue = resourceTypes.find(r => r.id === value)?.name || value;
          } else if (key === 'threshold_value' && trigger.parameters.threshold_type) {
            formattedValue = `${value}${trigger.parameters.threshold_type === 'percentage' ? '%' : ' points'}`;
          } else if (typeof value === 'number' && key === 'percentage') {
            formattedValue = `${value}%`;
          } else if (typeof value === 'boolean') {
            formattedValue = value ? 'Yes' : 'No';
          }

          return (
            <span key={i}>
              {i === 0 ? ' - ' : ', '}
              {formattedKey && `${formattedKey}: `}
              {formattedValue}
            </span>
          );
        }).filter(Boolean)}
      </div>
    </div>
  );
};

// Component for displaying conditional effect settings
const ConditionalDisplay = ({ triggerName, settings, formulas, effectType, isDebuff = false }) => {
  // Skip rendering the "Default" trigger in the conditional section
  if (triggerName === 'Default') {
    return null;
  }

  // Extract base effect type (damage, healing, etc.) and subtype (dot, hot, etc.)
  const baseType = effectType.split('_')[0];
  const subType = effectType.includes('_') ? effectType.split('_')[1] : null;

  // Determine damage/element type based on effect type and settings
  const getDamageTypeDisplay = () => {
    if (baseType === 'damage') {
      const elementType = settings?.elementType || 'Fire';
      const damageType = settings?.damageType === 'dot' ? 'DoT' :
        (settings?.damageType?.charAt(0).toUpperCase() + settings?.damageType?.slice(1) ||
        (subType === 'dot' ? 'DoT' : 'Direct'));

      return (
        <>
          <img
            src={`https://wow.zamimg.com/images/wow/icons/small/spell_${elementType.toLowerCase()}_fireball02.jpg`}
            alt={elementType}
            className="wow-element-icon"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://wow.zamimg.com/images/wow/icons/small/inv_misc_questionmark.jpg";
            }}
          />
          {elementType} ({damageType})
        </>
      );
    }
    return null;
  };

  // Determine resource type for restoration effects
  const getResourceTypeDisplay = () => {
    if (baseType === 'restoration') {
      const resourceType = settings?.resourceType || 'mana';
      const displayName = resourceType.charAt(0).toUpperCase() + resourceType.slice(1);

      // Determine category
      let category = '';
      if (['health'].includes(resourceType)) {
        category = 'Vitality';
      } else if (['mana', 'inferno'].includes(resourceType)) {
        category = 'Magical';
      } else if (['action_points'].includes(resourceType)) {
        category = 'Combat';
      } else if (['energy', 'rage', 'focus'].includes(resourceType)) {
        category = 'Physical';
      }

      const iconMap = {
        health: 'spell_holy_sealofsacrifice',
        mana: 'spell_holy_magicalsentry',
        inferno: 'spell_fire_incinerate',
        action_points: 'ability_rogue_quickrecovery',
        energy: 'spell_shadow_shadowworddominate',
        rage: 'ability_warrior_rampage',
        focus: 'ability_hunter_focusfire'
      };

      return (
        <>
          <img
            src={`https://wow.zamimg.com/images/wow/icons/small/${iconMap[resourceType] || 'inv_misc_questionmark'}.jpg`}
            alt={displayName}
            className="wow-element-icon"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://wow.zamimg.com/images/wow/icons/small/inv_misc_questionmark.jpg";
            }}
          />
          {displayName} ({category})
        </>
      );
    }
    return null;
  };

  // Get the appropriate icon for the damage/element type
  const getDamageTypeIcon = () => {
    if (baseType === 'damage') {
      const elementType = settings?.elementType?.toLowerCase() || 'fire';
      return `effect-icon-${elementType}`;
    }
    return null;
  };

  // Determine duration display based on effect type and settings
  const getDurationDisplay = () => {
    if (baseType === 'damage' && subType === 'dot') {
      return `${settings?.dotDuration || settings?.duration || '3'} ${settings?.dotDurationUnit || settings?.durationUnit || 'rounds'}`;
    } else if (baseType === 'restoration' && settings?.isOverTime) {
      return `${settings?.overTimeDuration || '3'} ${settings?.tickFrequency || 'rounds'}`;
    } else if (settings?.duration) {
      return `${settings.duration} ${settings.durationUnit || settings.durationType || 'rounds'}`;
    }
    return null;
  };

  return (
    <div className="effect-preview-conditional-item">
      <div className="effect-preview-conditional-header">
        <div className="effect-preview-conditional-icon"
             style={{ backgroundImage: `url(${getEffectIconUrl(effectType)})` }}></div>
        <div className="effect-preview-conditional-title">{triggerName}</div>
      </div>

      <div className="effect-preview-conditional-content">
        {/* Formula for damage and healing effects */}
        {formulas && (
          <PropertyDisplay
            icon="property-icon-formula"
            label="Formula"
            value={<span className="effect-preview-formula">{formulas}</span>}
          />
        )}

        {/* Damage/Element Type for damage effects */}
        {baseType === 'damage' && getDamageTypeDisplay() && (
          <PropertyDisplay
            icon={getDamageTypeIcon()}
            label={
              <>
                <img
                  src="https://wow.zamimg.com/images/wow/icons/small/inv_elemental_primal_fire.jpg"
                  alt="Type"
                  className="wow-element-icon"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = "https://wow.zamimg.com/images/wow/icons/small/inv_misc_questionmark.jpg";
                  }}
                />Type
              </>
            }
            value={getDamageTypeDisplay()}
          />
        )}

        {/* Resource Type for restoration effects */}
        {baseType === 'restoration' && getResourceTypeDisplay() && (
          <PropertyDisplay
            icon="effect-icon-restoration"
            label="Resource"
            value={getResourceTypeDisplay()}
          />
        )}

        {/* Resolution Type for restoration effects */}
        {baseType === 'restoration' && settings?.resolution && (
          <PropertyDisplay
            icon="property-icon-resolution"
            label="Resolution"
            value={settings.resolution || 'DICE'}
          />
        )}

        {/* Duration */}
        {getDurationDisplay() && (
          <PropertyDisplay
            icon="property-icon-duration"
            label="Duration"
            value={getDurationDisplay()}
          />
        )}

        {/* Saving Throw */}
        {settings?.difficultyClass && settings?.savingThrow && (
          <PropertyDisplay
            icon="property-icon-save"
            label="Save"
            value={`DC ${settings.difficultyClass} (${
              settings.savingThrow === 'dexterity' ? 'Agility' :
              settings.savingThrow === 'wisdom' ? 'Spirit' :
              settings.savingThrow ? settings.savingThrow.charAt(0).toUpperCase() + settings.savingThrow.slice(1) :
              'Constitution'
            })`}
          />
        )}

        {/* Control Type */}
        {settings?.controlType && (
          <PropertyDisplay
            icon="property-icon-control"
            label="Control"
            value={(() => {
              // Get the category based on the control type
              let category = '';
              let displayName = settings.controlType.charAt(0).toUpperCase() + settings.controlType.slice(1);

              // Determine category
              if (['bind', 'slow', 'snare', 'web'].includes(settings.controlType)) {
                category = 'Restraint';
              } else if (['sleep', 'stun', 'paralyze', 'daze'].includes(settings.controlType)) {
                category = 'Incapacitation';
              } else if (['command', 'confuse', 'dominate', 'fear'].includes(settings.controlType)) {
                category = 'Mind Control';
              } else if (['trip', 'stagger', 'repel', 'throw'].includes(settings.controlType)) {
                category = 'Knockdown';
              } else if (['push', 'pull', 'slide', 'teleport'].includes(settings.controlType)) {
                category = 'Forced Movement';
              } else if (['silence', 'disarm', 'blind', 'root'].includes(settings.controlType)) {
                category = 'Action Restriction';
              }

              return `${displayName} (${category})`;
            })()}
          />
        )}

        {/* Progressive Stages for restoration effects */}
        {baseType === 'restoration' && settings?.isProgressiveOverTime &&
         settings?.overTimeProgressiveStages && settings.overTimeProgressiveStages.length > 0 && (
          <div style={{ width: '100%', marginTop: '8px' }}>
            <div className="effect-preview-property" style={{ width: '100%' }}>
              <div className="effect-preview-property-icon property-icon-duration"></div>
              <div className="effect-preview-property-label">Progressive Stages:</div>
              <div className="effect-preview-property-value">
                {settings.overTimeProgressiveStages.map((stage, index) => (
                  <div key={index}>
                    Stage {index + 1}: Triggers at {stage.triggerAt || 0} {settings.tickFrequency || 'rounds'}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Stat Modifiers/Penalties */}
      {((settings?.statModifiers && settings.statModifiers.length > 0) ||
        (settings?.statPenalties && settings.statPenalties.length > 0)) && (
        <div className="effect-preview-conditional-content" style={{ marginTop: '8px' }}>
          {settings?.statModifiers && settings.statModifiers.map((stat, index) => (
            <StatDisplay key={index} stat={stat} isDebuff={false} />
          ))}
          {settings?.statPenalties && settings.statPenalties.map((stat, index) => (
            <StatDisplay key={index} stat={stat} isDebuff={true} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!getDurationDisplay() && !settings?.difficultyClass && !settings?.savingThrow &&
       !settings?.controlType && !formulas && !getDamageTypeDisplay() && !getResourceTypeDisplay() &&
       (!settings?.statModifiers || settings.statModifiers.length === 0) &&
       (!settings?.statPenalties || settings.statPenalties.length === 0) && (
        <div className="effect-preview-empty">No conditional settings configured</div>
      )}
    </div>
  );
};

const EnhancedEffectPreview = ({
  selectedEffect,
  state,
  effectTriggers,
  conditionalEffects,
  triggerConfig,
  resourceTypes
}) => {
  // Format the effect name for display
  const getEffectDisplayName = (effectType) => {
    if (!effectType) return '';

    if (effectType.includes('_')) {
      return effectType.split('_').map(word =>
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ');
    }

    return effectType.charAt(0).toUpperCase() + effectType.slice(1);
  };

  // Get the base configuration for the selected effect
  const getBaseConfig = () => {
    if (!selectedEffect) return null;

    const baseType = selectedEffect.split('_')[0];
    const configKey = `${baseType}Config`;

    return state[configKey];
  };

  const baseConfig = getBaseConfig();

  return (
    <div className="effect-preview">
      <div className="effect-preview-header">
        <div className="effect-preview-icon">
          <img
            src={getEffectIconUrl(selectedEffect)}
            alt={selectedEffect}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg";
            }}
          />
        </div>
        <div className="effect-preview-title">
          <h4>Effect Configuration Preview</h4>
        </div>
      </div>

      {/* Base Effect Information */}
      <div className="effect-preview-section">
        <h5 className="effect-preview-subtitle base-effect">
          Base {getEffectDisplayName(selectedEffect)} Effect
        </h5>

        <div className="effect-preview-card">
          <div className="effect-preview-card-header">
            <div className="effect-preview-card-icon">
              <img
                src={getEffectIconUrl(selectedEffect)}
                alt={selectedEffect}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg";
                }}
              />
            </div>
            <div className="effect-preview-card-title">
              {getEffectDisplayName(selectedEffect)}
            </div>
          </div>

          <div className="effect-preview-card-content">
            {/* Damage effects */}
            {(selectedEffect === 'damage' || selectedEffect?.startsWith('damage_')) && baseConfig && (
              <>
                <PropertyDisplay
                  icon="property-icon-formula"
                  label="Formula"
                  value={<span className="effect-preview-formula">{baseConfig.formula || '1d6 + INT'}</span>}
                />
                <PropertyDisplay
                  icon={`effect-icon-${baseConfig.elementType?.toLowerCase() || 'fire'}`}
                  label={
                    <>
                      <img
                        src="https://wow.zamimg.com/images/wow/icons/small/inv_elemental_primal_fire.jpg"
                        alt="Type"
                        className="wow-element-icon"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://wow.zamimg.com/images/wow/icons/small/inv_misc_questionmark.jpg";
                        }}
                      />Type
                    </>
                  }
                  value={
                    <>
                      <img
                        src={`https://wow.zamimg.com/images/wow/icons/small/spell_${baseConfig.elementType?.toLowerCase() || 'fire'}_fireball02.jpg`}
                        alt={baseConfig.elementType || 'Fire'}
                        className="wow-element-icon"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = "https://wow.zamimg.com/images/wow/icons/small/inv_misc_questionmark.jpg";
                        }}
                      />
                      {baseConfig.elementType || 'Fire'} ({baseConfig.damageType === 'dot' ? 'DoT' :
                        baseConfig.damageType?.charAt(0).toUpperCase() + baseConfig.damageType?.slice(1) || 'Direct'})
                    </>
                  }
                />
                {selectedEffect === 'damage_dot' && (
                  <PropertyDisplay
                    icon="property-icon-duration"
                    label="Duration"
                    value={`${baseConfig.dotDuration || '3'} ${baseConfig.dotDurationUnit || 'rounds'}`}
                  />
                )}
              </>
            )}

            {/* Healing effects */}
            {(selectedEffect === 'healing' || selectedEffect?.startsWith('healing_')) && baseConfig && (
              <>
                <PropertyDisplay
                  icon="property-icon-formula"
                  label="Formula"
                  value={<span className="effect-preview-formula">{baseConfig.formula || '2d8 + HEA'}</span>}
                />
                <PropertyDisplay
                  icon="effect-icon-healing"
                  label="Type"
                  value={baseConfig.healingType || 'Direct'}
                />
                {selectedEffect === 'healing_hot' && (
                  <PropertyDisplay
                    icon="property-icon-duration"
                    label="Duration"
                    value={`${baseConfig.hotDuration || '3'} ${baseConfig.hotDurationUnit || 'rounds'}`}
                  />
                )}
                {selectedEffect === 'healing_shield' && (
                  <PropertyDisplay
                    icon="property-icon-duration"
                    label="Duration"
                    value={`${baseConfig.shieldDuration || '3'} ${baseConfig.shieldDurationUnit || 'rounds'}`}
                  />
                )}
              </>
            )}

            {/* Buff effects */}
            {(selectedEffect === 'buff' || selectedEffect?.startsWith('buff_')) && baseConfig && (
              <>
                <PropertyDisplay
                  icon="property-icon-duration"
                  label="Duration"
                  value={`${baseConfig.duration || '3'} ${baseConfig.durationUnit || 'rounds'}`}
                />

                {/* Stat modifiers */}
                {baseConfig.statModifiers && baseConfig.statModifiers.length > 0 && (
                  <div style={{ width: '100%', marginTop: '8px' }}>
                    {baseConfig.statModifiers.map((stat, index) => (
                      <StatDisplay key={index} stat={stat} />
                    ))}
                  </div>
                )}

                {/* Protection type for buff_protection */}
                {selectedEffect === 'buff_protection' && (
                  <PropertyDisplay
                    icon="property-icon-control"
                    label="Protection"
                    value={`${baseConfig.protectionType || 'Damage Reduction'} (${baseConfig.protectionValue || '5'})`}
                  />
                )}

                {/* Progressive stages */}
                {baseConfig.isProgressive && baseConfig.progressiveStages && baseConfig.progressiveStages.length > 0 && (
                  <div style={{ width: '100%', marginTop: '8px' }}>
                    <div className="effect-preview-property" style={{ width: '100%' }}>
                      <div className="effect-preview-property-icon property-icon-duration"></div>
                      <div className="effect-preview-property-label">Progressive Stages:</div>
                      <div className="effect-preview-property-value">
                        {baseConfig.progressiveStages.map((stage, index) => (
                          <div key={index}>
                            Stage {index + 1}: Triggers at {stage.triggerTime || 0} {stage.triggerTimeUnit || 'rounds'}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Debuff effects */}
            {(selectedEffect === 'debuff' || selectedEffect?.startsWith('debuff_')) && baseConfig && (
              <>
                <PropertyDisplay
                  icon="property-icon-duration"
                  label="Duration"
                  value={`${baseConfig.duration || '3'} ${baseConfig.durationUnit || 'rounds'}`}
                />
                <PropertyDisplay
                  icon="property-icon-save"
                  label="Save"
                  value={`DC ${baseConfig.difficultyClass || '15'} (${
                    baseConfig.savingThrow === 'dexterity' ? 'Agility' :
                    baseConfig.savingThrow === 'wisdom' ? 'Spirit' :
                    baseConfig.savingThrow ? baseConfig.savingThrow.charAt(0).toUpperCase() + baseConfig.savingThrow.slice(1) :
                    'Constitution'
                  })`}
                />

                {/* Control type for debuff_control */}
                {selectedEffect === 'debuff_control' && (
                  <PropertyDisplay
                    icon="property-icon-control"
                    label="Control"
                    value={(() => {
                      const controlType = baseConfig.controlType || 'slow';
                      const displayName = controlType.charAt(0).toUpperCase() + controlType.slice(1);

                      // Determine category
                      let category = '';
                      if (['bind', 'slow', 'snare', 'web'].includes(controlType)) {
                        category = 'Restraint';
                      } else if (['sleep', 'stun', 'paralyze', 'daze'].includes(controlType)) {
                        category = 'Incapacitation';
                      } else if (['command', 'confuse', 'dominate', 'fear'].includes(controlType)) {
                        category = 'Mind Control';
                      } else if (['trip', 'stagger', 'repel', 'throw'].includes(controlType)) {
                        category = 'Knockdown';
                      } else if (['push', 'pull', 'slide', 'teleport'].includes(controlType)) {
                        category = 'Forced Movement';
                      } else if (['silence', 'disarm', 'blind', 'root'].includes(controlType)) {
                        category = 'Action Restriction';
                      }

                      return `${displayName} (${category})`;
                    })()}
                  />
                )}

                {/* Stat penalties */}
                {(selectedEffect === 'debuff_stat' || selectedEffect === 'debuff') &&
                 baseConfig.statPenalties && baseConfig.statPenalties.length > 0 && (
                  <div style={{ width: '100%', marginTop: '8px' }}>
                    {baseConfig.statPenalties.map((stat, index) => (
                      <StatDisplay key={index} stat={stat} isDebuff={true} />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Control effects */}
            {selectedEffect === 'control' && baseConfig && (
              <>
                <PropertyDisplay
                  icon="property-icon-duration"
                  label="Duration"
                  value={`${baseConfig.duration || '1'} ${baseConfig.durationUnit || 'rounds'}`}
                />
                <PropertyDisplay
                  icon="property-icon-save"
                  label="Save"
                  value={`DC ${baseConfig.difficultyClass || '15'} (${
                    baseConfig.savingThrow === 'dexterity' ? 'Agility' :
                    baseConfig.savingThrow === 'wisdom' ? 'Spirit' :
                    baseConfig.savingThrow ? baseConfig.savingThrow.charAt(0).toUpperCase() + baseConfig.savingThrow.slice(1) :
                    'Strength'
                  })`}
                />
                <PropertyDisplay
                  icon="property-icon-control"
                  label="Control"
                  value={(() => {
                    const controlType = baseConfig.controlType || 'stun';
                    const displayName = controlType.charAt(0).toUpperCase() + controlType.slice(1);

                    // Determine category
                    let category = '';
                    if (['bind', 'slow', 'snare', 'web'].includes(controlType)) {
                      category = 'Restraint';
                    } else if (['sleep', 'stun', 'paralyze', 'daze'].includes(controlType)) {
                      category = 'Incapacitation';
                    } else if (['command', 'confuse', 'dominate', 'fear'].includes(controlType)) {
                      category = 'Mind Control';
                    } else if (['trip', 'stagger', 'repel', 'throw'].includes(controlType)) {
                      category = 'Knockdown';
                    } else if (['push', 'pull', 'slide', 'teleport'].includes(controlType)) {
                      category = 'Forced Movement';
                    } else if (['silence', 'disarm', 'blind', 'root'].includes(controlType)) {
                      category = 'Action Restriction';
                    }

                    return `${displayName} (${category})`;
                  })()}
                />
              </>
            )}

            {/* Summoning effects */}
            {selectedEffect === 'summon' && baseConfig && (
              <>
                {baseConfig.creatures && baseConfig.creatures.length > 0 ? (
                  baseConfig.creatures.map((creature, index) => (
                    <div key={index} className="summon-creature-display">
                      <PropertyDisplay
                        icon="effect-icon-summon"
                        label="Creature"
                        value={
                          <div className="creature-info">
                            <img
                              src={`https://wow.zamimg.com/images/wow/icons/small/${creature.tokenIcon}.jpg`}
                              alt={creature.name}
                              className="wow-element-icon"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://wow.zamimg.com/images/wow/icons/small/inv_misc_questionmark.jpg";
                              }}
                            />
                            <span>{creature.name}</span>
                          </div>
                        }
                      />
                    </div>
                  ))
                ) : (
                  <PropertyDisplay
                    icon="effect-icon-summon"
                    label="Creature"
                    value={baseConfig.creatureType || 'Elemental'}
                  />
                )}
                <PropertyDisplay
                  icon="property-icon-duration"
                  label="Duration"
                  value={`${baseConfig.duration || '10'} ${baseConfig.durationUnit || 'minutes'}`}
                />
                <PropertyDisplay
                  icon="property-icon-stats"
                  label="Count"
                  value={baseConfig.quantity || baseConfig.count || '1'}
                />
                <PropertyDisplay
                  icon="property-icon-control"
                  label="Control"
                  value={baseConfig.controlType ? baseConfig.controlType.charAt(0).toUpperCase() + baseConfig.controlType.slice(1) : 'Verbal'}
                />
                {baseConfig.waitForTrigger && (
                  <PropertyDisplay
                    icon="property-icon-trigger"
                    label="Trigger"
                    value="Waits for trigger condition"
                  />
                )}
              </>
            )}

            {/* Utility effects */}
            {selectedEffect === 'utility' && baseConfig && (
              <>
                <PropertyDisplay
                  icon="effect-icon-utility"
                  label="Type"
                  value={baseConfig.utilityType || 'Movement'}
                />
                <PropertyDisplay
                  icon="property-icon-duration"
                  label="Duration"
                  value={`${baseConfig.duration || '10'} ${baseConfig.durationUnit || 'minutes'}`}
                />
              </>
            )}

            {/* Restoration effects */}
            {(selectedEffect === 'restoration' || selectedEffect?.startsWith('restoration_')) && baseConfig && (
              <>
                <PropertyDisplay
                  icon="property-icon-formula"
                  label="Formula"
                  value={<span className="effect-preview-formula">{baseConfig.formula || '2d6 + INT'}</span>}
                />
                <PropertyDisplay
                  icon="effect-icon-restoration"
                  label="Resource"
                  value={(() => {
                    const resourceType = baseConfig.resourceType || 'mana';
                    const displayName = resourceType.charAt(0).toUpperCase() + resourceType.slice(1);

                    // Determine category
                    let category = '';
                    if (['health'].includes(resourceType)) {
                      category = 'Vitality';
                    } else if (['mana', 'inferno'].includes(resourceType)) {
                      category = 'Magical';
                    } else if (['action_points'].includes(resourceType)) {
                      category = 'Combat';
                    } else if (['energy', 'rage', 'focus'].includes(resourceType)) {
                      category = 'Physical';
                    }

                    return `${displayName} (${category})`;
                  })()}
                />
                <PropertyDisplay
                  icon="property-icon-resolution"
                  label="Resolution"
                  value={baseConfig.resolution || 'DICE'}
                />
                {baseConfig.isOverTime && (
                  <PropertyDisplay
                    icon="property-icon-duration"
                    label="Duration"
                    value={`${baseConfig.overTimeDuration || '3'} ${baseConfig.tickFrequency || 'rounds'}`}
                  />
                )}
                {baseConfig.isOverTime && baseConfig.overTimeTriggerType && (
                  <PropertyDisplay
                    icon="property-icon-trigger"
                    label="Trigger Type"
                    value={baseConfig.overTimeTriggerType === 'periodic' ? 'Periodic' : 'On Condition'}
                  />
                )}
                {baseConfig.isProgressiveOverTime && baseConfig.overTimeProgressiveStages && baseConfig.overTimeProgressiveStages.length > 0 && (
                  <div style={{ width: '100%', marginTop: '8px' }}>
                    <div className="effect-preview-property" style={{ width: '100%' }}>
                      <div className="effect-preview-property-icon property-icon-duration"></div>
                      <div className="effect-preview-property-label">Progressive Stages:</div>
                      <div className="effect-preview-property-value">
                        {baseConfig.overTimeProgressiveStages.map((stage, index) => (
                          <div key={index}>
                            Stage {index + 1}: Triggers at {stage.triggerAt || 0} {baseConfig.tickFrequency || 'rounds'}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Trigger Information */}
      {effectTriggers[selectedEffect] &&
       effectTriggers[selectedEffect].compoundTriggers &&
       effectTriggers[selectedEffect].compoundTriggers.length > 0 && (
        <div className="effect-preview-section">
          <h5 className="effect-preview-subtitle trigger-conditions">
            Trigger Conditions
          </h5>

          <p>
            When {effectTriggers[selectedEffect].logicType === 'AND' ? 'all' : 'any'} of these conditions are met,
            the {getEffectDisplayName(selectedEffect).toLowerCase()} effect will activate:
          </p>

          <div className="effect-preview-trigger-list">
            {effectTriggers[selectedEffect].compoundTriggers.map((trigger, index) => (
              <TriggerDisplay
                key={index}
                trigger={trigger}
                resourceTypes={resourceTypes}
              />
            ))}
          </div>

          {effectTriggers[selectedEffect].targetingOverride && (
            <div className="effect-preview-property" style={{ marginTop: '10px' }}>
              <div className="effect-preview-property-icon effect-icon-utility"></div>
              <div className="effect-preview-property-label">Targeting Override</div>
              <div className="effect-preview-property-value">
                {effectTriggers[selectedEffect].targetingOverride.charAt(0).toUpperCase() +
                 effectTriggers[selectedEffect].targetingOverride.slice(1)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Conditional Effect Information */}
      {conditionalEffects[selectedEffect]?.isConditional && (
        <div className="effect-preview-section">
          <h5 className="effect-preview-subtitle conditional-behavior">
            Trigger Conditions
          </h5>

          <p>
            When these conditions are met, the {getEffectDisplayName(selectedEffect).toLowerCase()} effect will activate with enhanced power:
          </p>

          <div className="effect-preview-conditional-list">
            {/* For damage, healing, and restoration effects, show formulas */}
            {(selectedEffect === 'damage' || selectedEffect?.startsWith('damage_') ||
              selectedEffect === 'healing' || selectedEffect?.startsWith('healing_') ||
              selectedEffect === 'restoration' || selectedEffect?.startsWith('restoration_')) &&
              Object.entries(conditionalEffects[selectedEffect]?.conditionalFormulas || {}).map(([triggerId, formula], index) => {
                // For restoration effects, also check if there's a formula in the conditional settings
                if (selectedEffect === 'restoration' || selectedEffect?.startsWith('restoration_')) {
                  const settingsFormula = conditionalEffects[selectedEffect]?.conditionalSettings?.[triggerId]?.formula;
                  if (settingsFormula) {
                    formula = settingsFormula;
                  }
                }
                // Find the trigger name
                let triggerName = 'Default';
                if (triggerId !== 'default') {
                  // Check global triggers first
                  let trigger = triggerConfig.global?.compoundTriggers?.find(t => t.id === triggerId);

                  // If not found in global triggers, check effect-specific triggers
                  if (!trigger && effectTriggers[selectedEffect]?.compoundTriggers) {
                    trigger = effectTriggers[selectedEffect].compoundTriggers.find(t => t.id === triggerId);
                  }

                  // If still not found, check legacy triggers
                  if (!trigger && triggerConfig.compoundTriggers) {
                    trigger = triggerConfig.compoundTriggers.find(t => t.id === triggerId);
                  }

                  if (trigger) {
                    triggerName = trigger.name || trigger.id || 'Trigger Condition';
                  }
                }

                // Get settings for this trigger if they exist
                const settings = conditionalEffects[selectedEffect]?.conditionalSettings?.[triggerId];

                return (
                  <ConditionalDisplay
                    key={index}
                    triggerName={triggerName}
                    formulas={formula}
                    settings={settings}
                    effectType={selectedEffect}
                  />
                );
              })
            }

            {/* For buff effects, show stat modifiers and duration */}
            {(selectedEffect === 'buff' || selectedEffect?.startsWith('buff_')) &&
              Object.entries(conditionalEffects[selectedEffect]?.conditionalSettings || {}).map(([triggerId, settings], index) => {
                // Find the trigger name
                let triggerName = 'Default';
                if (triggerId !== 'default') {
                  // Check global triggers first
                  let trigger = triggerConfig.global?.compoundTriggers?.find(t => t.id === triggerId);

                  // If not found in global triggers, check effect-specific triggers
                  if (!trigger && effectTriggers[selectedEffect]?.compoundTriggers) {
                    trigger = effectTriggers[selectedEffect].compoundTriggers.find(t => t.id === triggerId);
                  }

                  // If still not found, check legacy triggers
                  if (!trigger && triggerConfig.compoundTriggers) {
                    trigger = triggerConfig.compoundTriggers.find(t => t.id === triggerId);
                  }

                  if (trigger) {
                    triggerName = trigger.name || trigger.id || 'Trigger Condition';
                  }
                }

                return (
                  <ConditionalDisplay
                    key={index}
                    triggerName={triggerName}
                    settings={settings}
                    formulas={conditionalEffects[selectedEffect]?.conditionalFormulas?.[triggerId]}
                    effectType={selectedEffect}
                  />
                );
              })
            }

            {/* For debuff effects, show stat penalties, duration, and saving throw */}
            {(selectedEffect === 'debuff' || selectedEffect?.startsWith('debuff_')) &&
              Object.entries(conditionalEffects[selectedEffect]?.conditionalSettings || {}).map(([triggerId, settings], index) => {
                // Find the trigger name
                let triggerName = 'Default';
                if (triggerId !== 'default') {
                  // Check global triggers first
                  let trigger = triggerConfig.global?.compoundTriggers?.find(t => t.id === triggerId);

                  // If not found in global triggers, check effect-specific triggers
                  if (!trigger && effectTriggers[selectedEffect]?.compoundTriggers) {
                    trigger = effectTriggers[selectedEffect].compoundTriggers.find(t => t.id === triggerId);
                  }

                  // If still not found, check legacy triggers
                  if (!trigger && triggerConfig.compoundTriggers) {
                    trigger = triggerConfig.compoundTriggers.find(t => t.id === triggerId);
                  }

                  if (trigger) {
                    triggerName = trigger.name || trigger.id || 'Trigger Condition';
                  }
                }

                return (
                  <ConditionalDisplay
                    key={index}
                    triggerName={triggerName}
                    settings={settings}
                    formulas={conditionalEffects[selectedEffect]?.conditionalFormulas?.[triggerId]}
                    effectType={selectedEffect}
                    isDebuff={true}
                  />
                );
              })
            }

            {/* For control effects */}
            {(selectedEffect === 'control' || selectedEffect?.startsWith('control_')) &&
              Object.entries(conditionalEffects[selectedEffect]?.conditionalSettings || {}).map(([triggerId, settings], index) => {
                // Find the trigger name
                let triggerName = 'Default';
                if (triggerId !== 'default') {
                  // Check global triggers first
                  let trigger = triggerConfig.global?.compoundTriggers?.find(t => t.id === triggerId);

                  // If not found in global triggers, check effect-specific triggers
                  if (!trigger && effectTriggers[selectedEffect]?.compoundTriggers) {
                    trigger = effectTriggers[selectedEffect].compoundTriggers.find(t => t.id === triggerId);
                  }

                  // If still not found, check legacy triggers
                  if (!trigger && triggerConfig.compoundTriggers) {
                    trigger = triggerConfig.compoundTriggers.find(t => t.id === triggerId);
                  }

                  if (trigger) {
                    triggerName = trigger.name || trigger.id || 'Trigger Condition';
                  }
                }

                return (
                  <ConditionalDisplay
                    key={index}
                    triggerName={triggerName}
                    settings={settings}
                    formulas={conditionalEffects[selectedEffect]?.conditionalFormulas?.[triggerId]}
                    effectType={selectedEffect}
                  />
                );
              })
            }

            {/* For other effect types */}
            {!selectedEffect?.startsWith('damage') && !selectedEffect?.startsWith('healing') &&
             !selectedEffect?.startsWith('buff') && !selectedEffect?.startsWith('debuff') &&
             !selectedEffect?.startsWith('control') &&
             Object.entries(conditionalEffects[selectedEffect]?.conditionalFormulas || {}).map(([triggerId, formula], index) => {
                // Find the trigger name
                let triggerName = 'Default';
                if (triggerId !== 'default') {
                  // Check global triggers first
                  let trigger = triggerConfig.global?.compoundTriggers?.find(t => t.id === triggerId);

                  // If not found in global triggers, check effect-specific triggers
                  if (!trigger && effectTriggers[selectedEffect]?.compoundTriggers) {
                    trigger = effectTriggers[selectedEffect].compoundTriggers.find(t => t.id === triggerId);
                  }

                  // If still not found, check legacy triggers
                  if (!trigger && triggerConfig.compoundTriggers) {
                    trigger = triggerConfig.compoundTriggers.find(t => t.id === triggerId);
                  }

                  if (trigger) {
                    triggerName = trigger.name || trigger.id || 'Trigger Condition';
                  }
                }

                return (
                  <ConditionalDisplay
                    key={index}
                    triggerName={triggerName}
                    formulas={formula}
                    effectType={selectedEffect}
                  />
                );
              })
            }

            {/* Empty state */}
            {((selectedEffect === 'damage' || selectedEffect?.startsWith('damage_') ||
               selectedEffect === 'healing' || selectedEffect?.startsWith('healing_') ||
               selectedEffect === 'restoration' || selectedEffect?.startsWith('restoration_')) &&
              Object.entries(conditionalEffects[selectedEffect]?.conditionalFormulas || {}).length === 0) ||
             ((selectedEffect === 'buff' || selectedEffect?.startsWith('buff_') ||
               selectedEffect === 'debuff' || selectedEffect?.startsWith('debuff_') ||
               selectedEffect === 'control' || selectedEffect?.startsWith('control_')) &&
              Object.entries(conditionalEffects[selectedEffect]?.conditionalSettings || {}).length === 0) ||
             (!selectedEffect?.startsWith('damage') && !selectedEffect?.startsWith('healing') &&
              !selectedEffect?.startsWith('restoration') && !selectedEffect?.startsWith('buff') &&
              !selectedEffect?.startsWith('debuff') && !selectedEffect?.startsWith('control') &&
              Object.entries(conditionalEffects[selectedEffect]?.conditionalFormulas || {}).length === 0) ? (
              <div className="effect-preview-empty">
                No conditional settings have been configured yet.
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedEffectPreview;
