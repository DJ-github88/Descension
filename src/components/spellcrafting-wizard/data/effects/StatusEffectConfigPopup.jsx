import React, { useEffect, useState } from 'react';
import './status-effect-popup.css';

const StatusEffectConfigPopup = ({
  isOpen,
  onClose,
  effect,
  selectedEffect,
  updateConfig,
  configType // 'buff' or 'debuff'
}) => {
  // Local state to ensure the component doesn't flicker
  const [initialized, setInitialized] = useState(false);

  // Update effect configuration function
  const updateEffectConfig = (field, value) => {
    if (!isOpen) return; // Don't update if not open

    const updatedEffects = selectedEffect.statusEffects.map(se =>
      se.id === effect.id ? {...se, [field]: value} : se
    );
    updateConfig('statusEffects', updatedEffects);
  };

  // Handle backdrop click to close the popup
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Initialize duration fields if not set
  useEffect(() => {
    if (isOpen && !initialized) {
      // Find the specific status effect in the statusEffects array
      const statusEffectData = selectedEffect.statusEffects?.find(se => se.id === effect.id) || {};

      if (!statusEffectData.durationType) {
        // If untilDispelled is true, set to permanent
        if (statusEffectData.untilDispelled) {
          updateEffectConfig('durationType', 'permanent');
          updateEffectConfig('canBeDispelled', true);
        }
        // If untilNextRest is true, set to rest
        else if (statusEffectData.untilNextRest) {
          updateEffectConfig('durationType', 'rest');
          updateEffectConfig('restType', 'short');
        }
        // Otherwise default to turns
        else {
          updateEffectConfig('durationType', 'turns');
          // Use the legacy duration field if available
          if (statusEffectData.duration) {
            updateEffectConfig('durationValue', statusEffectData.duration);
          } else {
            updateEffectConfig('durationValue', 3);
          }
        }
      }
      setInitialized(true);
    }
  }, [isOpen, initialized, selectedEffect, effect, updateEffectConfig]);

  // If not open, don't render anything
  if (!isOpen) return null;

  // Find the specific status effect in the statusEffects array
  const statusEffectData = selectedEffect.statusEffects?.find(se => se.id === effect.id) || {};

    // Get icon URL
    const getIconUrl = (iconName) => {
      if (!iconName) return '';
      return `https://wow.zamimg.com/images/wow/icons/large/${iconName}.jpg`;
    };

    // Render different configuration sections based on effect type
    const renderEffectSpecificConfig = () => {
    if (effect.id === 'lifelink') {
      return renderLifelinkConfig();
    } else if (effect.id === 'flight') {
      return renderFlightConfig();
    } else if (effect.id === 'shielded') {
      return renderShieldConfig();
    } else if (effect.id === 'regeneration' || effect.id === 'regen') {
      return renderRegenerationConfig();
    } else if (effect.id === 'haste') {
      return renderHasteConfig();
    } else if (effect.id === 'stunned' || effect.id === 'stun') {
      return renderStunConfig();
    } else if (effect.id === 'luck') {
      return renderLuckConfig();
    } else if (effect.id === 'charmed' || effect.id === 'charm') {
      return renderCharmConfig();
    } else if (effect.id === 'burning') {
      return renderBurningConfig();
    } else if (effect.id === 'frightened' || effect.id === 'fear') {
      return renderFearConfig();
    } else if (effect.id === 'poisoned' || effect.id === 'poison') {
      return renderPoisonConfig();
    } else if (effect.id === 'blinded' || effect.id === 'blind') {
      return renderBlindConfig();
    } else if (effect.id === 'paralyzed' || effect.id === 'paralyze') {
      return renderParalyzeConfig();
    } else if (effect.id === 'damage_shield' || effect.id === 'damageshield') {
      return renderDamageShieldConfig();
    } else if (effect.id === 'combat_advantage' || effect.id === 'advantage' || effect.id === 'advantage_attack' || effect.id === 'attackers_disadvantage' || effect.id === 'attackers_advantage_buff') {
      return (
        <>
          {renderCombatAdvantageConfig()}
          {renderCombatAdvantageConfig2()}
        </>
      );
    } else if (effect.id === 'disadvantage_attack' || effect.id === 'attackers_advantage') {
      return renderCombatDisadvantageConfig();
    } else if (effect.id === 'disadvantage_save') {
      return renderSaveDisadvantageConfig();
    } else if (effect.id === 'skill_mastery' || effect.id === 'skillmastery') {
      return renderSkillMasteryConfig();
    } else {
      // Default configuration for all other effects
      return renderDefaultConfig();
    }
  };



  // Render flight configuration
  const renderFlightConfig = () => {
    return (
      <>
        <div className="effect-config-section">
          <h4>Flight Type</h4>
          <div className="flight-type-icons">
            <div className="flight-type-option">
              <button
                className={`flight-type-icon ${statusEffectData?.flightType === 'levitation' ? 'active' : ''}`}
                onClick={() => updateEffectConfig('flightType', 'levitation')}
                title="Levitation"
              >
                <div className="flight-image levitation-icon"></div>
              </button>
              <div className="flight-type-label">Levitation</div>
              <div className="flight-type-description">Float above the ground, immune to difficult terrain</div>
            </div>

            <div className="flight-type-option">
              <button
                className={`flight-type-icon ${statusEffectData?.flightType === 'gliding' ? 'active' : ''}`}
                onClick={() => updateEffectConfig('flightType', 'gliding')}
                title="Gliding"
              >
                <div className="flight-image gliding-icon"></div>
              </button>
              <div className="flight-type-label">Gliding</div>
              <div className="flight-type-description">Glide from high places without taking fall damage</div>
            </div>

            <div className="flight-type-option">
              <button
                className={`flight-type-icon ${statusEffectData?.flightType === 'flying' ? 'active' : ''}`}
                onClick={() => updateEffectConfig('flightType', 'flying')}
                title="Full Flight"
              >
                <div className="flight-image flying-icon"></div>
              </button>
              <div className="flight-type-label">Full Flight</div>
              <div className="flight-type-description">Fly freely in any direction</div>
            </div>
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Flight Speed</h4>
          <div className="effect-config-option">
            <label>Speed (feet per round)</label>
            <input
              type="number"
              min="5"
              max="120"
              step="5"
              value={statusEffectData?.flightSpeed || 30}
              onChange={(e) => {
                updateEffectConfig('flightSpeed', parseInt(e.target.value));
              }}
            />
          </div>
        </div>



        <div className="effect-config-section">
          <h4>Maximum Altitude</h4>
          <div className="effect-config-option">
            <label>Height (feet)</label>
            <input
              type="number"
              min="5"
              max="1000"
              step="5"
              value={statusEffectData?.maxAltitude || 100}
              onChange={(e) => {
                updateEffectConfig('maxAltitude', parseInt(e.target.value));
              }}
            />
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Duration</h4>
          <div className="effect-config-option">
            <label>Duration (rounds)</label>
            <input
              type="number"
              min="1"
              max="100"
              value={statusEffectData?.duration || 10}
              onChange={(e) => {
                updateEffectConfig('duration', parseInt(e.target.value));
              }}
            />
          </div>

          <div className="toggle-options">
            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.untilDispelled ? 'active' : ''}`}
                onClick={() => updateEffectConfig('untilDispelled', !statusEffectData?.untilDispelled)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.untilDispelled ? '✓' : ''}
                </div>
                <span>Until Dispelled</span>
              </button>
              <div className="option-description">Effect lasts until magically dispelled</div>
            </div>
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Vulnerabilities</h4>
          <div className="vulnerability-buttons">
            <button
              className={`vulnerability-button ${statusEffectData?.vulnerable === 'none' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('vulnerable', 'none')}
            >
              <span>None</span>
            </button>

            <button
              className={`vulnerability-button ${statusEffectData?.vulnerable === 'knockdown' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('vulnerable', 'knockdown')}
            >
              <span>Knockdown</span>
            </button>

            <button
              className={`vulnerability-button ${statusEffectData?.vulnerable === 'dispel' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('vulnerable', 'dispel')}
            >
              <span>Dispel Magic</span>
            </button>

            <button
              className={`vulnerability-button ${statusEffectData?.vulnerable === 'damage' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('vulnerable', 'damage')}
            >
              <span>Taking Damage</span>
            </button>
          </div>
        </div>
      </>
    );
  };

  // Render shield configuration
  const renderShieldConfig = () => {
    return (
      <>
        <div className="effect-config-section">
          <h4>Shield Strength</h4>
          <div className="effect-config-option">
            <label>Shield Amount</label>
            <input
              type="number"
              min="1"
              max="1000"
              value={statusEffectData?.shieldAmount || 15}
              onChange={(e) => {
                updateEffectConfig('shieldAmount', parseInt(e.target.value));
              }}
            />
          </div>

          <div className="effect-config-option">
            <label>Shield Type</label>
            <select
              value={statusEffectData?.shieldType || 'absorb'}
              onChange={(e) => updateEffectConfig('shieldType', e.target.value)}
            >
              <option value="absorb">Absorption Shield</option>
              <option value="reflect">Reflective Shield</option>
              <option value="thorns">Thorns Shield</option>
            </select>
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Shield Calculation</h4>
          <div className="calculation-icons">
            <button
              className={`calculation-icon ${statusEffectData?.calculationType === 'fixed' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('calculationType', 'fixed')}
              title="Fixed Amount"
            >
              <div className="calc-image fixed-icon">#</div>
            </button>

            <button
              className={`calculation-icon ${statusEffectData?.calculationType === 'percentage' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('calculationType', 'percentage')}
              title="Percentage of Max HP"
            >
              <div className="calc-image percentage-icon">%</div>
            </button>

            <button
              className={`calculation-icon ${statusEffectData?.calculationType === 'dice' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('calculationType', 'dice')}
              title="Dice Roll"
            >
              <div className="calc-image dice-icon"></div>
            </button>
          </div>

          {statusEffectData?.calculationType === 'percentage' && (
            <div className="effect-config-option">
              <label>Percentage of Max HP</label>
              <input
                type="number"
                min="1"
                max="100"
                value={statusEffectData?.shieldPercentage || 20}
                onChange={(e) => {
                  updateEffectConfig('shieldPercentage', parseInt(e.target.value));
                }}
              />
            </div>
          )}

          {statusEffectData?.calculationType === 'dice' && (
            <div className="dice-formula">
              <div className="effect-config-option">
                <label>Dice Count</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={statusEffectData?.diceCount || 2}
                  onChange={(e) => {
                    updateEffectConfig('diceCount', parseInt(e.target.value));
                  }}
                />
              </div>

              <div className="effect-config-option">
                <label>Dice Type</label>
                <select
                  value={statusEffectData?.diceType || 'd8'}
                  onChange={(e) => {
                    updateEffectConfig('diceType', e.target.value);
                  }}
                >
                  <option value="d4">d4</option>
                  <option value="d6">d6</option>
                  <option value="d8">d8</option>
                  <option value="d10">d10</option>
                  <option value="d12">d12</option>
                  <option value="d20">d20</option>
                </select>
              </div>

              <div className="formula-preview">
                <code>{statusEffectData?.diceCount || 2}{statusEffectData?.diceType || 'd8'}</code>
              </div>
            </div>
          )}
        </div>

        <div className="effect-config-section">
          <h4>Duration</h4>
          <div className="effect-config-option">
            <label>Duration (rounds)</label>
            <input
              type="number"
              min="1"
              max="100"
              value={statusEffectData?.duration || 3}
              onChange={(e) => {
                updateEffectConfig('duration', parseInt(e.target.value));
              }}
            />
          </div>

          <div className="toggle-options">
            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.untilDepleted ? 'active' : ''}`}
                onClick={() => updateEffectConfig('untilDepleted', !statusEffectData?.untilDepleted)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.untilDepleted ? '✓' : ''}
                </div>
                <span>Until Depleted</span>
              </button>
              <div className="option-description">Shield lasts until all absorption is used</div>
            </div>
          </div>
        </div>
      </>
    );
  };

  // Render lifelink specific configuration
  const renderLifelinkConfig = () => {
    return (
      <>
        <div className="effect-config-section">
          <h4>Link Direction</h4>
          <div className="direction-buttons">
            <button
              className={`direction-button ${statusEffectData?.direction === 'caster_to_target' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('direction', 'caster_to_target')}
            >
              <div className="direction-icon caster-to-target">
                <span className="arrow-icon">→</span>
              </div>
              <span>Caster to Target</span>
            </button>

            <button
              className={`direction-button ${statusEffectData?.direction === 'target_to_caster' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('direction', 'target_to_caster')}
            >
              <div className="direction-icon target-to-caster">
                <span className="arrow-icon">←</span>
              </div>
              <span>Target to Caster</span>
            </button>

            <button
              className={`direction-button ${statusEffectData?.direction === 'bidirectional' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('direction', 'bidirectional')}
            >
              <div className="direction-icon bidirectional">
                <span className="arrow-icon">↔</span>
              </div>
              <span>Bidirectional</span>
            </button>
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Resource Configuration</h4>

          <div className="resource-config">
            <div className="resource-column">
              <h5>Source Resource</h5>
              <div className="resource-icons">
                <button
                  className={`resource-icon health ${statusEffectData?.sourceResource === 'health' ? 'active' : ''}`}
                  onClick={() => updateEffectConfig('sourceResource', 'health')}
                  title="Health"
                >
                  <div className="icon-image health-icon"></div>
                </button>
                <button
                  className={`resource-icon mana ${statusEffectData?.sourceResource === 'mana' ? 'active' : ''}`}
                  onClick={() => updateEffectConfig('sourceResource', 'mana')}
                  title="Mana"
                >
                  <div className="icon-image mana-icon"></div>
                </button>
                <button
                  className={`resource-icon stamina ${statusEffectData?.sourceResource === 'stamina' ? 'active' : ''}`}
                  onClick={() => updateEffectConfig('sourceResource', 'stamina')}
                  title="Stamina"
                >
                  <div className="icon-image stamina-icon"></div>
                </button>
                <button
                  className={`resource-icon rage ${statusEffectData?.sourceResource === 'rage' ? 'active' : ''}`}
                  onClick={() => updateEffectConfig('sourceResource', 'rage')}
                  title="Rage"
                >
                  <div className="icon-image rage-icon"></div>
                </button>
                <button
                  className={`resource-icon energy ${statusEffectData?.sourceResource === 'energy' ? 'active' : ''}`}
                  onClick={() => updateEffectConfig('sourceResource', 'energy')}
                  title="Energy"
                >
                  <div className="icon-image energy-icon"></div>
                </button>
              </div>
            </div>

            <div className="resource-arrow">
              <span>→</span>
            </div>

            <div className="resource-column">
              <h5>Target Resource</h5>
              <div className="resource-icons">
                <button
                  className={`resource-icon health ${statusEffectData?.targetResource === 'health' ? 'active' : ''}`}
                  onClick={() => updateEffectConfig('targetResource', 'health')}
                  title="Health"
                >
                  <div className="icon-image health-icon"></div>
                </button>
                <button
                  className={`resource-icon mana ${statusEffectData?.targetResource === 'mana' ? 'active' : ''}`}
                  onClick={() => updateEffectConfig('targetResource', 'mana')}
                  title="Mana"
                >
                  <div className="icon-image mana-icon"></div>
                </button>
                <button
                  className={`resource-icon stamina ${statusEffectData?.targetResource === 'stamina' ? 'active' : ''}`}
                  onClick={() => updateEffectConfig('targetResource', 'stamina')}
                  title="Stamina"
                >
                  <div className="icon-image stamina-icon"></div>
                </button>
                <button
                  className={`resource-icon rage ${statusEffectData?.targetResource === 'rage' ? 'active' : ''}`}
                  onClick={() => updateEffectConfig('targetResource', 'rage')}
                  title="Rage"
                >
                  <div className="icon-image rage-icon"></div>
                </button>
                <button
                  className={`resource-icon energy ${statusEffectData?.targetResource === 'energy' ? 'active' : ''}`}
                  onClick={() => updateEffectConfig('targetResource', 'energy')}
                  title="Energy"
                >
                  <div className="icon-image energy-icon"></div>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Conversion Formula</h4>
          <div className="custom-formula">
            <div className="effect-config-option">
              <label>Formula</label>
              <input
                type="text"
                className="formula-input"
                value={statusEffectData?.customFormula || 'SOURCE_AMOUNT * 0.25'}
                placeholder="Enter formula (e.g. SOURCE_AMOUNT * 0.25)"
                onChange={(e) => {
                  updateEffectConfig('customFormula', e.target.value);
                  updateEffectConfig('calculationType', 'custom_formula');
                }}
              />
            </div>

            <div className="formula-variables">
              <button
                className="variable-button"
                onClick={() => {
                  const currentFormula = statusEffectData?.customFormula || '';
                  updateEffectConfig('customFormula', currentFormula + ' SOURCE_AMOUNT');
                }}
              >
                SOURCE_AMOUNT
              </button>
              <button
                className="variable-button"
                onClick={() => {
                  const currentFormula = statusEffectData?.customFormula || '';
                  updateEffectConfig('customFormula', currentFormula + ' ROLL_1D4');
                }}
              >
                ROLL_1D4
              </button>
              <button
                className="variable-button"
                onClick={() => {
                  const currentFormula = statusEffectData?.customFormula || '';
                  updateEffectConfig('customFormula', currentFormula + ' ROLL_1D6');
                }}
              >
                ROLL_1D6
              </button>
              <button
                className="variable-button"
                onClick={() => {
                  const currentFormula = statusEffectData?.customFormula || '';
                  updateEffectConfig('customFormula', currentFormula + ' ROLL_1D8');
                }}
              >
                ROLL_1D8
              </button>
              <button
                className="variable-button"
                onClick={() => {
                  const currentFormula = statusEffectData?.customFormula || '';
                  updateEffectConfig('customFormula', currentFormula + ' ROLL_1D10');
                }}
              >
                ROLL_1D10
              </button>
              <button
                className="variable-button"
                onClick={() => {
                  const currentFormula = statusEffectData?.customFormula || '';
                  updateEffectConfig('customFormula', currentFormula + ' ROLL_1D12');
                }}
              >
                ROLL_1D12
              </button>
              <button
                className="variable-button"
                onClick={() => {
                  const currentFormula = statusEffectData?.customFormula || '';
                  updateEffectConfig('customFormula', currentFormula + ' ROLL_1D20');
                }}
              >
                ROLL_1D20
              </button>
              <button
                className="variable-button"
                onClick={() => {
                  const currentFormula = statusEffectData?.customFormula || '';
                  updateEffectConfig('customFormula', currentFormula + ' FLIP_COIN');
                }}
              >
                FLIP_COIN
              </button>
              <button
                className="variable-button"
                onClick={() => {
                  const currentFormula = statusEffectData?.customFormula || '';
                  updateEffectConfig('customFormula', currentFormula + ' DRAW_CARD');
                }}
              >
                DRAW_CARD
              </button>
              <button
                className="variable-button"
                onClick={() => {
                  const currentFormula = statusEffectData?.customFormula || '';
                  updateEffectConfig('customFormula', currentFormula + ' PER_AMOUNT');
                }}
              >
                PER_AMOUNT
              </button>
              <button
                className="variable-button"
                onClick={() => {
                  const currentFormula = statusEffectData?.customFormula || '';
                  updateEffectConfig('customFormula', currentFormula + ' Math.min');
                }}
              >
                Math.min
              </button>
              <button
                className="variable-button"
                onClick={() => {
                  const currentFormula = statusEffectData?.customFormula || '';
                  updateEffectConfig('customFormula', currentFormula + ' Math.max');
                }}
              >
                Math.max
              </button>
              <button
                className="variable-button"
                onClick={() => {
                  const currentFormula = statusEffectData?.customFormula || '';
                  updateEffectConfig('customFormula', currentFormula + ' Math.floor');
                }}
              >
                Math.floor
              </button>
              <button
                className="variable-button"
                onClick={() => {
                  const currentFormula = statusEffectData?.customFormula || '';
                  updateEffectConfig('customFormula', currentFormula + ' Math.ceil');
                }}
              >
                Math.ceil
              </button>
            </div>

            <div className="formula-preview">
              <code>{statusEffectData?.customFormula || 'SOURCE_AMOUNT * 0.25'}</code>
            </div>

            <div className="formula-examples">
              <h5>Simple Formulas:</h5>
              <div
                className="formula-example clickable"
                onClick={() => {
                  updateEffectConfig('customFormula', 'SOURCE_AMOUNT * 0.25');
                }}
              >
                <code>SOURCE_AMOUNT * 0.25</code>
                <span>Convert 25% of the damage</span>
              </div>
              <div
                className="formula-example clickable"
                onClick={() => {
                  updateEffectConfig('customFormula', '5');
                }}
              >
                <code>5</code>
                <span>Fixed amount of 5</span>
              </div>
              <div
                className="formula-example clickable"
                onClick={() => {
                  updateEffectConfig('customFormula', 'ROLL_1D6');
                }}
              >
                <code>ROLL_1D6</code>
                <span>Roll 1d6 for conversion amount</span>
              </div>
              <div
                className="formula-example clickable"
                onClick={() => {
                  updateEffectConfig('customFormula', 'ROLL_1D4 + ROLL_1D4');
                }}
              >
                <code>ROLL_1D4 + ROLL_1D4</code>
                <span>Roll 2d4 for conversion amount</span>
              </div>

              <h5>Advanced Formulas:</h5>
              <div
                className="formula-example clickable"
                onClick={() => {
                  updateEffectConfig('customFormula', 'Math.floor(SOURCE_AMOUNT / 10) * ROLL_1D6');
                  updateEffectConfig('perAmount', 10);
                }}
              >
                <code>Math.floor(SOURCE_AMOUNT / 10) * ROLL_1D6</code>
                <span>For every 10 damage taken/dealt, roll 1d6 for conversion</span>
              </div>
              <div
                className="formula-example clickable"
                onClick={() => {
                  updateEffectConfig('customFormula', 'FLIP_COIN ? SOURCE_AMOUNT * 0.3 : SOURCE_AMOUNT * 0.1');
                }}
              >
                <code>FLIP_COIN ? SOURCE_AMOUNT * 0.3 : SOURCE_AMOUNT * 0.1</code>
                <span>Flip a coin: if heads, convert 30% of damage; if tails, convert 10%</span>
              </div>
              <div
                className="formula-example clickable"
                onClick={() => {
                  updateEffectConfig('customFormula', 'Math.min(ROLL_1D8, SOURCE_AMOUNT / 2)');
                }}
              >
                <code>Math.min(ROLL_1D8, SOURCE_AMOUNT / 2)</code>
                <span>Roll 1d8, but never more than half the damage amount</span>
              </div>
              <div
                className="formula-example clickable"
                onClick={() => {
                  updateEffectConfig('customFormula', 'DRAW_CARD > 10 ? SOURCE_AMOUNT * 0.5 : SOURCE_AMOUNT * 0.2');
                }}
              >
                <code>DRAW_CARD > 10 ? SOURCE_AMOUNT * 0.5 : SOURCE_AMOUNT * 0.2</code>
                <span>Draw a card: if > 10, convert 50% of damage; otherwise, convert 20%</span>
              </div>
              <div
                className="formula-example clickable"
                onClick={() => {
                  updateEffectConfig('customFormula', 'Math.ceil(SOURCE_AMOUNT * 0.1) * ROLL_1D4');
                }}
              >
                <code>Math.ceil(SOURCE_AMOUNT * 0.1) * ROLL_1D4</code>
                <span>For every 10% of damage, roll 1d4 (rounded up)</span>
              </div>
            </div>

            <div className="effect-config-option">
              <label>Per Amount (for threshold formulas)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={statusEffectData?.perAmount || 10}
                onChange={(e) => {
                  updateEffectConfig('perAmount', parseInt(e.target.value));
                }}
              />
            </div>

            <div className="formula-examples">
              <div className="formula-example">
                <span>Example: 30 {statusEffectData?.sourceResource || 'health'} with formula "{statusEffectData?.customFormula || 'SOURCE_AMOUNT * 0.25'}"</span>
              </div>
              <div className="formula-example">
                <span>Explanation: This formula determines how much of the source resource is converted to the target resource.</span>
              </div>
            </div>
          </div>
        </div>


      </>
    );
  };

  // Render haste configuration
  const renderHasteConfig = () => {
    return (
      <>
        <div className="effect-config-section">
          <h4>Movement Enhancement</h4>
          <div className="effect-config-option">
            <label>Speed Multiplier</label>
            <select
              value={statusEffectData?.speedMultiplier || 2}
              onChange={(e) => updateEffectConfig('speedMultiplier', parseInt(e.target.value))}
            >
              <option value="1.5">1.5× Speed</option>
              <option value="2">2× Speed</option>
              <option value="3">3× Speed</option>
              <option value="4">4× Speed</option>
            </select>
          </div>

          <div className="toggle-options">
            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.affectsWalk ? 'active' : ''}`}
                onClick={() => updateEffectConfig('affectsWalk', !statusEffectData?.affectsWalk)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.affectsWalk ? '✓' : ''}
                </div>
                <span>Walking Speed</span>
              </button>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.affectsSwim ? 'active' : ''}`}
                onClick={() => updateEffectConfig('affectsSwim', !statusEffectData?.affectsSwim)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.affectsSwim ? '✓' : ''}
                </div>
                <span>Swimming Speed</span>
              </button>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.affectsClimb ? 'active' : ''}`}
                onClick={() => updateEffectConfig('affectsClimb', !statusEffectData?.affectsClimb)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.affectsClimb ? '✓' : ''}
                </div>
                <span>Climbing Speed</span>
              </button>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.affectsFly ? 'active' : ''}`}
                onClick={() => updateEffectConfig('affectsFly', !statusEffectData?.affectsFly)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.affectsFly ? '✓' : ''}
                </div>
                <span>Flying Speed</span>
              </button>
            </div>
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Action Enhancement</h4>
          <div className="toggle-options">
            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.extraAction ? 'active' : ''}`}
                onClick={() => updateEffectConfig('extraAction', !statusEffectData?.extraAction)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.extraAction ? '✓' : ''}
                </div>
                <span>Extra Action</span>
              </button>
              <div className="option-description">Gain an additional action each turn</div>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.bonusAction ? 'active' : ''}`}
                onClick={() => updateEffectConfig('bonusAction', !statusEffectData?.bonusAction)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.bonusAction ? '✓' : ''}
                </div>
                <span>Extra Bonus Action</span>
              </button>
              <div className="option-description">Gain an additional bonus action each turn</div>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.extraReaction ? 'active' : ''}`}
                onClick={() => updateEffectConfig('extraReaction', !statusEffectData?.extraReaction)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.extraReaction ? '✓' : ''}
                </div>
                <span>Extra Reaction</span>
              </button>
              <div className="option-description">Gain an additional reaction each round</div>
            </div>
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Defensive Benefits</h4>
          <div className="toggle-options">
            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.dexSaveAdvantage ? 'active' : ''}`}
                onClick={() => updateEffectConfig('dexSaveAdvantage', !statusEffectData?.dexSaveAdvantage)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.dexSaveAdvantage ? '✓' : ''}
                </div>
                <span>Dexterity Save Advantage</span>
              </button>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.refSaveAdvantage ? 'active' : ''}`}
                onClick={() => updateEffectConfig('refSaveAdvantage', !statusEffectData?.refSaveAdvantage)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.refSaveAdvantage ? '✓' : ''}
                </div>
                <span>Reflex Save Advantage</span>
              </button>
            </div>
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Duration</h4>
          <div className="effect-config-option">
            <label>Duration (rounds)</label>
            <input
              type="number"
              min="1"
              max="100"
              value={statusEffectData?.duration || 3}
              onChange={(e) => {
                updateEffectConfig('duration', parseInt(e.target.value));
              }}
            />
          </div>
        </div>
      </>
    );
  };

  // Render paralyze configuration
  const renderParalyzeConfig = () => {
    return (
      <>
        <div className="effect-config-section">
          <h4>Paralysis Type</h4>
          <div className="effect-options">
            <button
              className={`effect-option-button ${statusEffectData?.paralysisType === 'partial' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('paralysisType', 'partial')}
            >
              <span>Partial</span>
            </button>
            <button
              className={`effect-option-button ${statusEffectData?.paralysisType === 'complete' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('paralysisType', 'complete')}
            >
              <span>Complete</span>
            </button>
            <button
              className={`effect-option-button ${statusEffectData?.paralysisType === 'magical' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('paralysisType', 'magical')}
            >
              <span>Magical</span>
            </button>
          </div>

          <div className="option-description">
            {statusEffectData?.paralysisType === 'partial' && 'Limited movement, can still take some actions'}
            {statusEffectData?.paralysisType === 'complete' && 'No movement, incapacitated'}
            {statusEffectData?.paralysisType === 'magical' && 'Magical paralysis, cannot be countered by normal means'}
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Paralysis Effects</h4>
          <div className="toggle-options">
            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.cannotMove ? 'active' : ''}`}
                onClick={() => updateEffectConfig('cannotMove', !statusEffectData?.cannotMove)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.cannotMove ? '✓' : ''}
                </div>
                <span>Cannot Move</span>
              </button>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.cannotTakeActions ? 'active' : ''}`}
                onClick={() => updateEffectConfig('cannotTakeActions', !statusEffectData?.cannotTakeActions)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.cannotTakeActions ? '✓' : ''}
                </div>
                <span>Cannot Take Actions</span>
              </button>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.cannotSpeak ? 'active' : ''}`}
                onClick={() => updateEffectConfig('cannotSpeak', !statusEffectData?.cannotSpeak)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.cannotSpeak ? '✓' : ''}
                </div>
                <span>Cannot Speak</span>
              </button>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.automaticCriticalHits ? 'active' : ''}`}
                onClick={() => updateEffectConfig('automaticCriticalHits', !statusEffectData?.automaticCriticalHits)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.automaticCriticalHits ? '✓' : ''}
                </div>
                <span>Attacks are Critical Hits</span>
              </button>
              <div className="option-description">Attacks against paralyzed target are critical hits</div>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.failStrengthDexterity ? 'active' : ''}`}
                onClick={() => updateEffectConfig('failStrengthDexterity', !statusEffectData?.failStrengthDexterity)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.failStrengthDexterity ? '✓' : ''}
                </div>
                <span>Fail Strength/Dexterity Saves</span>
              </button>
            </div>
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Body Parts Affected</h4>
          <div className="toggle-options">
            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.affectsArms ? 'active' : ''}`}
                onClick={() => updateEffectConfig('affectsArms', !statusEffectData?.affectsArms)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.affectsArms ? '✓' : ''}
                </div>
                <span>Arms</span>
              </button>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.affectsLegs ? 'active' : ''}`}
                onClick={() => updateEffectConfig('affectsLegs', !statusEffectData?.affectsLegs)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.affectsLegs ? '✓' : ''}
                </div>
                <span>Legs</span>
              </button>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.affectsTorso ? 'active' : ''}`}
                onClick={() => updateEffectConfig('affectsTorso', !statusEffectData?.affectsTorso)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.affectsTorso ? '✓' : ''}
                </div>
                <span>Torso</span>
              </button>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.affectsHead ? 'active' : ''}`}
                onClick={() => updateEffectConfig('affectsHead', !statusEffectData?.affectsHead)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.affectsHead ? '✓' : ''}
                </div>
                <span>Head</span>
              </button>
            </div>
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Save Options</h4>
          <div className="effect-config-option">
            <label>Save Type</label>
            <select
              value={statusEffectData?.saveType || 'constitution'}
              onChange={(e) => updateEffectConfig('saveType', e.target.value)}
            >
              <option value="constitution">Constitution</option>
              <option value="strength">Strength</option>
              <option value="wisdom">Wisdom</option>
            </select>
          </div>

          <div className="effect-config-option">
            <label>Save Frequency</label>
            <select
              value={statusEffectData?.saveFrequency || 'end_of_turn'}
              onChange={(e) => updateEffectConfig('saveFrequency', e.target.value)}
            >
              <option value="initial">Initial Only</option>
              <option value="end_of_turn">End of Each Turn</option>
              <option value="when_damaged">When Taking Damage</option>
            </select>
          </div>

          <div className="toggle-options">
            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.curedByMagic ? 'active' : ''}`}
                onClick={() => updateEffectConfig('curedByMagic', !statusEffectData?.curedByMagic)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.curedByMagic ? '✓' : ''}
                </div>
                <span>Cured by Lesser Restoration</span>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  // Render poison configuration
  const renderPoisonConfig = () => {
    return (
      <>
        <div className="effect-config-section">
          <h4>Poison Type</h4>
          <div className="effect-options">
            <button
              className={`effect-option-button ${statusEffectData?.poisonType === 'debilitating' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('poisonType', 'debilitating')}
            >
              <span>Debilitating</span>
            </button>
            <button
              className={`effect-option-button ${statusEffectData?.poisonType === 'lethal' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('poisonType', 'lethal')}
            >
              <span>Lethal</span>
            </button>
            <button
              className={`effect-option-button ${statusEffectData?.poisonType === 'paralytic' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('poisonType', 'paralytic')}
            >
              <span>Paralytic</span>
            </button>
            <button
              className={`effect-option-button ${statusEffectData?.poisonType === 'hallucinogenic' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('poisonType', 'hallucinogenic')}
            >
              <span>Hallucinogenic</span>
            </button>
          </div>

          <div className="option-description">
            {statusEffectData?.poisonType === 'debilitating' && 'Weakens the target, causing disadvantage on ability checks'}
            {statusEffectData?.poisonType === 'lethal' && 'Deals increasing damage over time'}
            {statusEffectData?.poisonType === 'paralytic' && 'Gradually restricts movement and actions'}
            {statusEffectData?.poisonType === 'hallucinogenic' && 'Causes confusion and random behavior'}
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Poison Damage</h4>
          <div className="effect-config-option">
            <label>Damage Dice</label>
            <div className="dice-formula-input">
              <input
                type="number"
                min="1"
                max="10"
                className="dice-count-input"
                value={statusEffectData?.diceCount || 1}
                onChange={(e) => {
                  updateEffectConfig('diceCount', parseInt(e.target.value));
                }}
              />
              <select
                className="dice-type-input"
                value={statusEffectData?.diceType || 'd4'}
                onChange={(e) => {
                  updateEffectConfig('diceType', e.target.value);
                }}
              >
                <option value="d4">d4</option>
                <option value="d6">d6</option>
                <option value="d8">d8</option>
                <option value="d10">d10</option>
                <option value="d12">d12</option>
              </select>
            </div>
          </div>

          <div className="effect-config-option">
            <label>Damage Frequency</label>
            <select
              value={statusEffectData?.damageFrequency || 'end_of_turn'}
              onChange={(e) => updateEffectConfig('damageFrequency', e.target.value)}
            >
              <option value="start_of_turn">Start of Turn</option>
              <option value="end_of_turn">End of Turn</option>
              <option value="on_action">When Taking Actions</option>
            </select>
          </div>

          <div className="toggle-options">
            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.increasingDamage ? 'active' : ''}`}
                onClick={() => updateEffectConfig('increasingDamage', !statusEffectData?.increasingDamage)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.increasingDamage ? '✓' : ''}
                </div>
                <span>Increasing Damage</span>
              </button>
              <div className="option-description">Damage increases each round</div>
            </div>
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Poison Effects</h4>
          <div className="toggle-options">
            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.disadvantageOnAttacks ? 'active' : ''}`}
                onClick={() => updateEffectConfig('disadvantageOnAttacks', !statusEffectData?.disadvantageOnAttacks)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.disadvantageOnAttacks ? '✓' : ''}
                </div>
                <span>Disadvantage on Attacks</span>
              </button>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.disadvantageOnChecks ? 'active' : ''}`}
                onClick={() => updateEffectConfig('disadvantageOnChecks', !statusEffectData?.disadvantageOnChecks)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.disadvantageOnChecks ? '✓' : ''}
                </div>
                <span>Disadvantage on Ability Checks</span>
              </button>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.reducedMovement ? 'active' : ''}`}
                onClick={() => updateEffectConfig('reducedMovement', !statusEffectData?.reducedMovement)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.reducedMovement ? '✓' : ''}
                </div>
                <span>Reduced Movement</span>
              </button>
            </div>

            {statusEffectData?.reducedMovement && (
              <div className="effect-config-option">
                <label>Movement Reduction (%)</label>
                <input
                  type="number"
                  min="10"
                  max="90"
                  step="10"
                  value={statusEffectData?.movementReduction || 50}
                  onChange={(e) => {
                    updateEffectConfig('movementReduction', parseInt(e.target.value));
                  }}
                />
              </div>
            )}

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.cannotHeal ? 'active' : ''}`}
                onClick={() => updateEffectConfig('cannotHeal', !statusEffectData?.cannotHeal)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.cannotHeal ? '✓' : ''}
                </div>
                <span>Cannot Heal</span>
              </button>
              <div className="option-description">Target cannot regain hit points while poisoned</div>
            </div>
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Cure Options</h4>
          <div className="effect-config-option">
            <label>Save Type</label>
            <select
              value={statusEffectData?.saveType || 'constitution'}
              onChange={(e) => updateEffectConfig('saveType', e.target.value)}
            >
              <option value="constitution">Constitution</option>
              <option value="fortitude">Fortitude</option>
            </select>
          </div>

          <div className="toggle-options">
            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.curedByAntidote ? 'active' : ''}`}
                onClick={() => updateEffectConfig('curedByAntidote', !statusEffectData?.curedByAntidote)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.curedByAntidote ? '✓' : ''}
                </div>
                <span>Cured by Antidote</span>
              </button>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.curedByMagic ? 'active' : ''}`}
                onClick={() => updateEffectConfig('curedByMagic', !statusEffectData?.curedByMagic)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.curedByMagic ? '✓' : ''}
                </div>
                <span>Cured by Lesser Restoration</span>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  // Render blind configuration
  const renderBlindConfig = () => {
    return (
      <>
        <div className="effect-config-section">
          <h4>Blindness Type</h4>
          <div className="effect-options">
            <button
              className={`effect-option-button ${statusEffectData?.blindType === 'partial' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('blindType', 'partial')}
            >
              <span>Partial</span>
            </button>
            <button
              className={`effect-option-button ${statusEffectData?.blindType === 'complete' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('blindType', 'complete')}
            >
              <span>Complete</span>
            </button>
            <button
              className={`effect-option-button ${statusEffectData?.blindType === 'magical' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('blindType', 'magical')}
            >
              <span>Magical</span>
            </button>
          </div>

          <div className="option-description">
            {statusEffectData?.blindType === 'partial' && 'Limited vision, disadvantage on perception and attacks'}
            {statusEffectData?.blindType === 'complete' && 'No vision, automatically fail sight-based checks'}
            {statusEffectData?.blindType === 'magical' && 'Magical darkness, cannot be countered by darkvision'}
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Vision Effects</h4>
          <div className="toggle-options">
            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.disadvantageOnAttacks ? 'active' : ''}`}
                onClick={() => updateEffectConfig('disadvantageOnAttacks', !statusEffectData?.disadvantageOnAttacks)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.disadvantageOnAttacks ? '✓' : ''}
                </div>
                <span>Disadvantage on Attacks</span>
              </button>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.advantageAgainst ? 'active' : ''}`}
                onClick={() => updateEffectConfig('advantageAgainst', !statusEffectData?.advantageAgainst)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.advantageAgainst ? '✓' : ''}
                </div>
                <span>Attacks Against Have Advantage</span>
              </button>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.failSightChecks ? 'active' : ''}`}
                onClick={() => updateEffectConfig('failSightChecks', !statusEffectData?.failSightChecks)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.failSightChecks ? '✓' : ''}
                </div>
                <span>Automatically Fail Sight-Based Checks</span>
              </button>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.cannotTarget ? 'active' : ''}`}
                onClick={() => updateEffectConfig('cannotTarget', !statusEffectData?.cannotTarget)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.cannotTarget ? '✓' : ''}
                </div>
                <span>Cannot Target What Cannot Be Seen</span>
              </button>
            </div>
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Vision Range</h4>
          <div className="effect-config-option">
            <label>Vision Range (feet)</label>
            <input
              type="number"
              min="0"
              max="120"
              step="5"
              value={statusEffectData?.visionRange || 0}
              onChange={(e) => {
                updateEffectConfig('visionRange', parseInt(e.target.value));
              }}
            />
            <div className="option-description">0 means completely blind</div>
          </div>

          <div className="toggle-options">
            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.affectsDarkvision ? 'active' : ''}`}
                onClick={() => updateEffectConfig('affectsDarkvision', !statusEffectData?.affectsDarkvision)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.affectsDarkvision ? '✓' : ''}
                </div>
                <span>Affects Darkvision</span>
              </button>
              <div className="option-description">Blindness cannot be countered by darkvision</div>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.affectsTruesight ? 'active' : ''}`}
                onClick={() => updateEffectConfig('affectsTruesight', !statusEffectData?.affectsTruesight)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.affectsTruesight ? '✓' : ''}
                </div>
                <span>Affects Truesight</span>
              </button>
              <div className="option-description">Blindness cannot be countered by truesight</div>
            </div>
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Cure Options</h4>
          <div className="toggle-options">
            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.curedByHealing ? 'active' : ''}`}
                onClick={() => updateEffectConfig('curedByHealing', !statusEffectData?.curedByHealing)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.curedByHealing ? '✓' : ''}
                </div>
                <span>Cured by Healing</span>
              </button>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.curedByMagic ? 'active' : ''}`}
                onClick={() => updateEffectConfig('curedByMagic', !statusEffectData?.curedByMagic)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.curedByMagic ? '✓' : ''}
                </div>
                <span>Cured by Lesser Restoration</span>
              </button>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.curedByAction ? 'active' : ''}`}
                onClick={() => updateEffectConfig('curedByAction', !statusEffectData?.curedByAction)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.curedByAction ? '✓' : ''}
                </div>
                <span>Can Be Removed with Action</span>
              </button>
              <div className="option-description">Target can use an action to attempt to remove blindness</div>
            </div>
          </div>
        </div>
      </>
    );
  };

  // Render fear configuration
  const renderFearConfig = () => {
    return (
      <>
        <div className="effect-config-section">
          <h4>Fear Type</h4>
          <div className="effect-options">
            <button
              className={`effect-option-button ${statusEffectData?.fearType === 'shaken' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('fearType', 'shaken')}
            >
              <span>Shaken</span>
            </button>
            <button
              className={`effect-option-button ${statusEffectData?.fearType === 'terrified' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('fearType', 'terrified')}
            >
              <span>Terrified</span>
            </button>
            <button
              className={`effect-option-button ${statusEffectData?.fearType === 'panicked' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('fearType', 'panicked')}
            >
              <span>Panicked</span>
            </button>
          </div>

          <div className="option-description">
            {statusEffectData?.fearType === 'shaken' && 'Disadvantage on ability checks while fear source is visible'}
            {statusEffectData?.fearType === 'terrified' && 'Cannot willingly move closer to the source of fear'}
            {statusEffectData?.fearType === 'panicked' && 'Must use actions to flee from source of fear'}
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Fear Effects</h4>
          <div className="toggle-options">
            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.disadvantageOnAttacks ? 'active' : ''}`}
                onClick={() => updateEffectConfig('disadvantageOnAttacks', !statusEffectData?.disadvantageOnAttacks)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.disadvantageOnAttacks ? '✓' : ''}
                </div>
                <span>Disadvantage on Attacks</span>
              </button>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.disadvantageOnChecks ? 'active' : ''}`}
                onClick={() => updateEffectConfig('disadvantageOnChecks', !statusEffectData?.disadvantageOnChecks)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.disadvantageOnChecks ? '✓' : ''}
                </div>
                <span>Disadvantage on Ability Checks</span>
              </button>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.cannotCast ? 'active' : ''}`}
                onClick={() => updateEffectConfig('cannotCast', !statusEffectData?.cannotCast)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.cannotCast ? '✓' : ''}
                </div>
                <span>Cannot Cast Spells</span>
              </button>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.dropItems ? 'active' : ''}`}
                onClick={() => updateEffectConfig('dropItems', !statusEffectData?.dropItems)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.dropItems ? '✓' : ''}
                </div>
                <span>May Drop Held Items</span>
              </button>
            </div>
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Fear Source</h4>
          <div className="effect-config-option">
            <label>Fear Radius (feet)</label>
            <input
              type="number"
              min="5"
              max="120"
              step="5"
              value={statusEffectData?.fearRadius || 30}
              onChange={(e) => {
                updateEffectConfig('fearRadius', parseInt(e.target.value));
              }}
            />
          </div>

          <div className="toggle-options">
            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.mustSeeFearSource ? 'active' : ''}`}
                onClick={() => updateEffectConfig('mustSeeFearSource', !statusEffectData?.mustSeeFearSource)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.mustSeeFearSource ? '✓' : ''}
                </div>
                <span>Must See Fear Source</span>
              </button>
              <div className="option-description">Effect only applies when target can see the source of fear</div>
            </div>
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Save Options</h4>
          <div className="effect-config-option">
            <label>Save Type</label>
            <select
              value={statusEffectData?.saveType || 'wisdom'}
              onChange={(e) => updateEffectConfig('saveType', e.target.value)}
            >
              <option value="wisdom">Wisdom</option>
              <option value="charisma">Charisma</option>
              <option value="intelligence">Intelligence</option>
            </select>
          </div>

          <div className="effect-config-option">
            <label>Save Frequency</label>
            <select
              value={statusEffectData?.saveFrequency || 'end_of_turn'}
              onChange={(e) => updateEffectConfig('saveFrequency', e.target.value)}
            >
              <option value="initial">Initial Only</option>
              <option value="end_of_turn">End of Each Turn</option>
              <option value="out_of_sight">When Fear Source Out of Sight</option>
              <option value="ally_help">When Ally Helps</option>
            </select>
          </div>
        </div>
      </>
    );
  };

  // Render burning configuration
  const renderBurningConfig = () => {
    return (
      <>
        <div className="effect-config-section">
          <h4>Burn Type</h4>
          <div className="effect-options">
            <button
              className={`effect-option-button ${statusEffectData?.burnType === 'mild' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('burnType', 'mild')}
            >
              <span>Mild Burn</span>
            </button>
            <button
              className={`effect-option-button ${statusEffectData?.burnType === 'intense' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('burnType', 'intense')}
            >
              <span>Intense Burn</span>
            </button>
            <button
              className={`effect-option-button ${statusEffectData?.burnType === 'magical' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('burnType', 'magical')}
            >
              <span>Magical Fire</span>
            </button>
          </div>

          <div className="option-description">
            {statusEffectData?.burnType === 'mild' && 'Low damage over time, can be extinguished easily'}
            {statusEffectData?.burnType === 'intense' && 'Moderate damage with additional effects, harder to extinguish'}
            {statusEffectData?.burnType === 'magical' && 'Cannot be extinguished by normal means, requires magic'}
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Damage Configuration</h4>
          <div className="effect-config-option">
            <label>Damage Dice</label>
            <div className="dice-formula-input">
              <input
                type="number"
                min="1"
                max="10"
                className="dice-count-input"
                value={statusEffectData?.diceCount || 1}
                onChange={(e) => {
                  updateEffectConfig('diceCount', parseInt(e.target.value));
                }}
              />
              <select
                className="dice-type-input"
                value={statusEffectData?.diceType || 'd6'}
                onChange={(e) => {
                  updateEffectConfig('diceType', e.target.value);
                }}
              >
                <option value="d4">d4</option>
                <option value="d6">d6</option>
                <option value="d8">d8</option>
                <option value="d10">d10</option>
                <option value="d12">d12</option>
              </select>
            </div>
          </div>

          <div className="effect-config-option">
            <label>Damage Frequency</label>
            <select
              value={statusEffectData?.damageFrequency || 'start_of_turn'}
              onChange={(e) => updateEffectConfig('damageFrequency', e.target.value)}
            >
              <option value="start_of_turn">Start of Turn</option>
              <option value="end_of_turn">End of Turn</option>
              <option value="both">Both Start and End</option>
            </select>
          </div>

          <div className="toggle-options">
            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.increasingDamage ? 'active' : ''}`}
                onClick={() => updateEffectConfig('increasingDamage', !statusEffectData?.increasingDamage)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.increasingDamage ? '✓' : ''}
                </div>
                <span>Increasing Damage</span>
              </button>
              <div className="option-description">Damage increases each round</div>
            </div>
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Fire Properties</h4>
          <div className="toggle-options">
            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.canSpread ? 'active' : ''}`}
                onClick={() => updateEffectConfig('canSpread', !statusEffectData?.canSpread)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.canSpread ? '✓' : ''}
                </div>
                <span>Can Spread</span>
              </button>
              <div className="option-description">Fire can spread to nearby flammable objects or creatures</div>
            </div>

            {statusEffectData?.canSpread && (
              <div className="effect-config-option">
                <label>Spread Chance (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={statusEffectData?.spreadChance || 20}
                  onChange={(e) => {
                    updateEffectConfig('spreadChance', parseInt(e.target.value));
                  }}
                />
              </div>
            )}

            <div className="toggle-options">
              <div className="toggle-option">
                <button
                  className={`toggle-button ${statusEffectData?.ignoresResistance ? 'active' : ''}`}
                  onClick={() => updateEffectConfig('ignoresResistance', !statusEffectData?.ignoresResistance)}
                >
                  <div className="toggle-icon">
                    {statusEffectData?.ignoresResistance ? '✓' : ''}
                  </div>
                  <span>Ignores Fire Resistance</span>
                </button>
                <div className="option-description">Damage bypasses fire resistance</div>
              </div>
            </div>
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Extinguishing</h4>
          <div className="effect-config-option">
            <label>Extinguish DC</label>
            <input
              type="number"
              min="5"
              max="30"
              value={statusEffectData?.extinguishDC || 15}
              onChange={(e) => {
                updateEffectConfig('extinguishDC', parseInt(e.target.value));
              }}
            />
          </div>

          <div className="effect-config-option">
            <label>Extinguish Method</label>
            <select
              value={statusEffectData?.extinguishMethod || 'action'}
              onChange={(e) => updateEffectConfig('extinguishMethod', e.target.value)}
            >
              <option value="action">Action (Roll)</option>
              <option value="water">Water/Cold Damage</option>
              <option value="dispel">Dispel Magic</option>
              <option value="special">Special Method</option>
            </select>
          </div>

          {statusEffectData?.extinguishMethod === 'special' && (
            <div className="effect-config-option">
              <label>Special Method</label>
              <input
                type="text"
                placeholder="Describe special method..."
                value={statusEffectData?.specialMethod || ''}
                onChange={(e) => {
                  updateEffectConfig('specialMethod', e.target.value);
                }}
              />
            </div>
          )}
        </div>
      </>
    );
  };

  // Render charm configuration
  const renderCharmConfig = () => {
    return (
      <>
        <div className="effect-config-section">
          <h4>Charm Type</h4>
          <div className="effect-options">
            <button
              className={`effect-option-button ${statusEffectData?.charmType === 'friendly' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('charmType', 'friendly')}
            >
              <span>Friendly</span>
            </button>
            <button
              className={`effect-option-button ${statusEffectData?.charmType === 'dominated' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('charmType', 'dominated')}
            >
              <span>Dominated</span>
            </button>
            <button
              className={`effect-option-button ${statusEffectData?.charmType === 'infatuated' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('charmType', 'infatuated')}
            >
              <span>Infatuated</span>
            </button>
          </div>

          <div className="option-description">
            {statusEffectData?.charmType === 'friendly' && 'Target regards you as a friend but maintains free will'}
            {statusEffectData?.charmType === 'dominated' && 'Target must obey your commands'}
            {statusEffectData?.charmType === 'infatuated' && 'Target is devoted to you and will protect you at all costs'}
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Charm Restrictions</h4>
          <div className="toggle-options">
            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.canAttack ? 'active' : ''}`}
                onClick={() => updateEffectConfig('canAttack', !statusEffectData?.canAttack)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.canAttack ? '✓' : ''}
                </div>
                <span>Can Attack Others</span>
              </button>
              <div className="option-description">Target can be commanded to attack others</div>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.canSelfHarm ? 'active' : ''}`}
                onClick={() => updateEffectConfig('canSelfHarm', !statusEffectData?.canSelfHarm)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.canSelfHarm ? '✓' : ''}
                </div>
                <span>Can Self-Harm</span>
              </button>
              <div className="option-description">Target can be commanded to harm themselves</div>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.retainsMemory ? 'active' : ''}`}
                onClick={() => updateEffectConfig('retainsMemory', !statusEffectData?.retainsMemory)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.retainsMemory ? '✓' : ''}
                </div>
                <span>Retains Memory</span>
              </button>
              <div className="option-description">Target remembers actions taken while charmed</div>
            </div>
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Command Limitations</h4>
          <div className="effect-config-option">
            <label>Command Complexity</label>
            <select
              value={statusEffectData?.commandComplexity || 'simple'}
              onChange={(e) => updateEffectConfig('commandComplexity', e.target.value)}
            >
              <option value="simple">Simple Commands Only</option>
              <option value="moderate">Moderate Complexity</option>
              <option value="complex">Complex Commands</option>
              <option value="any">Any Command</option>
            </select>
          </div>

          <div className="effect-config-option">
            <label>Maximum Commands</label>
            <input
              type="number"
              min="1"
              max="10"
              value={statusEffectData?.maxCommands || 1}
              onChange={(e) => {
                updateEffectConfig('maxCommands', parseInt(e.target.value));
              }}
            />
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Save Options</h4>
          <div className="effect-config-option">
            <label>Save Type</label>
            <select
              value={statusEffectData?.saveType || 'wisdom'}
              onChange={(e) => updateEffectConfig('saveType', e.target.value)}
            >
              <option value="wisdom">Wisdom</option>
              <option value="charisma">Charisma</option>
              <option value="intelligence">Intelligence</option>
            </select>
          </div>

          <div className="effect-config-option">
            <label>Save Trigger</label>
            <select
              value={statusEffectData?.saveTrigger || 'harmful'}
              onChange={(e) => updateEffectConfig('saveTrigger', e.target.value)}
            >
              <option value="none">No Additional Saves</option>
              <option value="harmful">When Given Harmful Command</option>
              <option value="turn">Each Turn</option>
              <option value="damage">When Taking Damage</option>
            </select>
          </div>
        </div>
      </>
    );
  };

  // Render luck configuration
  const renderLuckConfig = () => {
    return (
      <>
        <div className="effect-config-section">
          <h4>Luck Type</h4>
          <div className="effect-options">
            <button
              className={`effect-option-button ${statusEffectData?.luckType === 'reroll' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('luckType', 'reroll')}
            >
              <span>Reroll</span>
            </button>
            <button
              className={`effect-option-button ${statusEffectData?.luckType === 'minimum' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('luckType', 'minimum')}
            >
              <span>Minimum Value</span>
            </button>
            <button
              className={`effect-option-button ${statusEffectData?.luckType === 'choose' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('luckType', 'choose')}
            >
              <span>Choose Result</span>
            </button>
          </div>

          <div className="option-description">
            {statusEffectData?.luckType === 'reroll' && 'Allows rerolling dice when you get an unfavorable result'}
            {statusEffectData?.luckType === 'minimum' && 'Sets a minimum value for dice rolls'}
            {statusEffectData?.luckType === 'choose' && 'Allows choosing the result instead of rolling'}
          </div>
        </div>

        {statusEffectData?.luckType === 'reroll' && (
          <div className="effect-config-section">
            <h4>Reroll Settings</h4>
            <div className="effect-config-option">
              <label>Number of Rerolls</label>
              <input
                type="number"
                min="1"
                max="10"
                value={statusEffectData?.rerollCount || 3}
                onChange={(e) => {
                  updateEffectConfig('rerollCount', parseInt(e.target.value));
                }}
              />
            </div>

            <div className="toggle-options">
              <div className="toggle-option">
                <button
                  className={`toggle-button ${statusEffectData?.keepBetter ? 'active' : ''}`}
                  onClick={() => updateEffectConfig('keepBetter', !statusEffectData?.keepBetter)}
                >
                  <div className="toggle-icon">
                    {statusEffectData?.keepBetter ? '✓' : ''}
                  </div>
                  <span>Keep Better Result</span>
                </button>
                <div className="option-description">Always keep the better of the original and rerolled result</div>
              </div>
            </div>

            <div className="effect-config-option">
              <label>Applies To</label>
              <select
                value={statusEffectData?.appliesTo || 'd20'}
                onChange={(e) => updateEffectConfig('appliesTo', e.target.value)}
              >
                <option value="d20">d20 Rolls Only</option>
                <option value="damage">Damage Rolls Only</option>
                <option value="all">All Dice Rolls</option>
                <option value="custom">Custom (Specify)</option>
              </select>
            </div>

            {statusEffectData?.appliesTo === 'custom' && (
              <div className="effect-config-option">
                <label>Custom Dice</label>
                <input
                  type="text"
                  placeholder="d4, d6, d8, etc."
                  value={statusEffectData?.customDice || ''}
                  onChange={(e) => {
                    updateEffectConfig('customDice', e.target.value);
                  }}
                />
              </div>
            )}
          </div>
        )}

        {statusEffectData?.luckType === 'minimum' && (
          <div className="effect-config-section">
            <h4>Minimum Value Settings</h4>
            <div className="effect-config-option">
              <label>Minimum Roll Value</label>
              <input
                type="number"
                min="1"
                max="20"
                value={statusEffectData?.minimumValue || 10}
                onChange={(e) => {
                  updateEffectConfig('minimumValue', parseInt(e.target.value));
                }}
              />
            </div>

            <div className="effect-config-option">
              <label>Applies To</label>
              <select
                value={statusEffectData?.appliesTo || 'd20'}
                onChange={(e) => updateEffectConfig('appliesTo', e.target.value)}
              >
                <option value="d20">d20 Rolls Only</option>
                <option value="damage">Damage Rolls Only</option>
                <option value="all">All Dice Rolls</option>
                <option value="custom">Custom (Specify)</option>
              </select>
            </div>

            {statusEffectData?.appliesTo === 'custom' && (
              <div className="effect-config-option">
                <label>Custom Dice</label>
                <input
                  type="text"
                  placeholder="d4, d6, d8, etc."
                  value={statusEffectData?.customDice || ''}
                  onChange={(e) => {
                    updateEffectConfig('customDice', e.target.value);
                  }}
                />
              </div>
            )}
          </div>
        )}

        {statusEffectData?.luckType === 'choose' && (
          <div className="effect-config-section">
            <h4>Choose Result Settings</h4>
            <div className="effect-config-option">
              <label>Number of Choices</label>
              <input
                type="number"
                min="1"
                max="5"
                value={statusEffectData?.choiceCount || 1}
                onChange={(e) => {
                  updateEffectConfig('choiceCount', parseInt(e.target.value));
                }}
              />
            </div>

            <div className="toggle-options">
              <div className="toggle-option">
                <button
                  className={`toggle-button ${statusEffectData?.allowCritical ? 'active' : ''}`}
                  onClick={() => updateEffectConfig('allowCritical', !statusEffectData?.allowCritical)}
                >
                  <div className="toggle-icon">
                    {statusEffectData?.allowCritical ? '✓' : ''}
                  </div>
                  <span>Allow Critical Hit Selection</span>
                </button>
                <div className="option-description">Can choose to make an attack a critical hit</div>
              </div>
            </div>
          </div>
        )}

        <div className="effect-config-section">
          <h4>Fortune Aura</h4>
          <div className="toggle-options">
            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.affectsAllies ? 'active' : ''}`}
                onClick={() => updateEffectConfig('affectsAllies', !statusEffectData?.affectsAllies)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.affectsAllies ? '✓' : ''}
                </div>
                <span>Affects Allies</span>
              </button>
              <div className="option-description">Luck effect extends to nearby allies</div>
            </div>

            {statusEffectData?.affectsAllies && (
              <div className="effect-config-option">
                <label>Aura Radius (feet)</label>
                <input
                  type="number"
                  min="5"
                  max="60"
                  step="5"
                  value={statusEffectData?.auraRadius || 15}
                  onChange={(e) => {
                    updateEffectConfig('auraRadius', parseInt(e.target.value));
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </>
    );
  };

  // Render stun configuration
  const renderStunConfig = () => {
    return (
      <>
        <div className="effect-config-section">
          <h4>Stun Type</h4>
          <div className="effect-options">
            <button
              className={`effect-option-button ${statusEffectData?.stunType === 'dazed' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('stunType', 'dazed')}
            >
              <span>Dazed</span>
            </button>
            <button
              className={`effect-option-button ${statusEffectData?.stunType === 'unconscious' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('stunType', 'unconscious')}
            >
              <span>Unconscious</span>
            </button>
            <button
              className={`effect-option-button ${statusEffectData?.stunType === 'electric' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('stunType', 'electric')}
            >
              <span>Electric Stun</span>
            </button>
          </div>

          <div className="option-description">
            {statusEffectData?.stunType === 'dazed' && 'Target has disadvantage on attacks and ability checks'}
            {statusEffectData?.stunType === 'unconscious' && 'Target falls prone, unable to act, attacks have advantage'}
            {statusEffectData?.stunType === 'electric' && 'Muscles spasm, may conduct to nearby creatures'}
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Stun Effects</h4>
          <div className="toggle-options">
            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.noReactions ? 'active' : ''}`}
                onClick={() => updateEffectConfig('noReactions', !statusEffectData?.noReactions)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.noReactions ? '✓' : ''}
                </div>
                <span>No Reactions</span>
              </button>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.disadvantage ? 'active' : ''}`}
                onClick={() => updateEffectConfig('disadvantage', !statusEffectData?.disadvantage)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.disadvantage ? '✓' : ''}
                </div>
                <span>Disadvantage on Rolls</span>
              </button>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.dropItems ? 'active' : ''}`}
                onClick={() => updateEffectConfig('dropItems', !statusEffectData?.dropItems)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.dropItems ? '✓' : ''}
                </div>
                <span>Drop Held Items</span>
              </button>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.criticalHits ? 'active' : ''}`}
                onClick={() => updateEffectConfig('criticalHits', !statusEffectData?.criticalHits)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.criticalHits ? '✓' : ''}
                </div>
                <span>Attacks are Critical Hits</span>
              </button>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.wakesWhenDamaged ? 'active' : ''}`}
                onClick={() => updateEffectConfig('wakesWhenDamaged', !statusEffectData?.wakesWhenDamaged)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.wakesWhenDamaged ? '✓' : ''}
                </div>
                <span>Wakes When Damaged</span>
              </button>
            </div>
          </div>
        </div>

        {statusEffectData?.stunType === 'electric' && (
          <div className="effect-config-section">
            <h4>Electric Stun Properties</h4>
            <div className="toggle-options">
              <div className="toggle-option">
                <button
                  className={`toggle-button ${statusEffectData?.conductivity ? 'active' : ''}`}
                  onClick={() => updateEffectConfig('conductivity', !statusEffectData?.conductivity)}
                >
                  <div className="toggle-icon">
                    {statusEffectData?.conductivity ? '✓' : ''}
                  </div>
                  <span>Conducts to Adjacent Creatures</span>
                </button>
              </div>
            </div>

            <div className="effect-config-option">
              <label>Electric Damage</label>
              <input
                type="number"
                min="0"
                max="100"
                value={statusEffectData?.electricDamage || 0}
                onChange={(e) => {
                  updateEffectConfig('electricDamage', parseInt(e.target.value));
                }}
              />
            </div>
          </div>
        )}

        <div className="effect-config-section">
          <h4>Duration</h4>
          <div className="effect-config-option">
            <label>Duration (rounds)</label>
            <input
              type="number"
              min="1"
              max="100"
              value={statusEffectData?.stunDuration || 1}
              onChange={(e) => {
                updateEffectConfig('stunDuration', parseInt(e.target.value));
              }}
            />
          </div>

          <div className="effect-config-option">
            <label>Save Type</label>
            <select
              value={statusEffectData?.saveType || 'constitution'}
              onChange={(e) => updateEffectConfig('saveType', e.target.value)}
            >
              <option value="strength">Strength</option>
              <option value="dexterity">Dexterity</option>
              <option value="constitution">Constitution</option>
              <option value="intelligence">Intelligence</option>
              <option value="wisdom">Wisdom</option>
              <option value="charisma">Charisma</option>
            </select>
          </div>
        </div>
      </>
    );
  };

  // Render regeneration configuration
  const renderRegenerationConfig = () => {
    return (
      <>
        <div className="effect-config-section">
          <h4>Healing Amount</h4>
          <div className="calculation-icons">
            <button
              className={`calculation-icon ${statusEffectData?.calculationType === 'fixed' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('calculationType', 'fixed')}
              title="Fixed Amount"
            >
              <div className="calc-image fixed-icon">#</div>
            </button>

            <button
              className={`calculation-icon ${statusEffectData?.calculationType === 'percentage' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('calculationType', 'percentage')}
              title="Percentage of Max HP"
            >
              <div className="calc-image percentage-icon">%</div>
            </button>

            <button
              className={`calculation-icon ${statusEffectData?.calculationType === 'dice' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('calculationType', 'dice')}
              title="Dice Roll"
            >
              <div className="calc-image dice-icon"></div>
            </button>
          </div>

          {statusEffectData?.calculationType === 'fixed' && (
            <div className="effect-config-option">
              <label>Fixed Amount</label>
              <input
                type="number"
                min="1"
                max="100"
                value={statusEffectData?.healAmount || 5}
                onChange={(e) => {
                  updateEffectConfig('healAmount', parseInt(e.target.value));
                }}
              />
            </div>
          )}

          {statusEffectData?.calculationType === 'percentage' && (
            <div className="effect-config-option">
              <label>Percentage of Max HP</label>
              <input
                type="number"
                min="1"
                max="100"
                value={statusEffectData?.healPercentage || 10}
                onChange={(e) => {
                  updateEffectConfig('healPercentage', parseInt(e.target.value));
                }}
              />
            </div>
          )}

          {statusEffectData?.calculationType === 'dice' && (
            <div className="dice-formula">
              <div className="effect-config-option">
                <label>Dice Count</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={statusEffectData?.diceCount || 1}
                  onChange={(e) => {
                    updateEffectConfig('diceCount', parseInt(e.target.value));
                  }}
                />
              </div>

              <div className="effect-config-option">
                <label>Dice Type</label>
                <select
                  value={statusEffectData?.diceType || 'd6'}
                  onChange={(e) => {
                    updateEffectConfig('diceType', e.target.value);
                  }}
                >
                  <option value="d4">d4</option>
                  <option value="d6">d6</option>
                  <option value="d8">d8</option>
                  <option value="d10">d10</option>
                  <option value="d12">d12</option>
                </select>
              </div>

              <div className="formula-preview">
                <code>{statusEffectData?.diceCount || 1}{statusEffectData?.diceType || 'd6'}</code>
              </div>
            </div>
          )}
        </div>

        <div className="effect-config-section">
          <h4>Healing Frequency</h4>
          <div className="effect-config-option">
            <label>Trigger</label>
            <select
              value={statusEffectData?.frequency || 'start_of_turn'}
              onChange={(e) => updateEffectConfig('frequency', e.target.value)}
            >
              <option value="start_of_turn">Start of Turn</option>
              <option value="end_of_turn">End of Turn</option>
              <option value="every_round">Every Round</option>
              <option value="when_damaged">When Damaged</option>
            </select>
          </div>

          <div className="toggle-options">
            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.enhancedRegeneration ? 'active' : ''}`}
                onClick={() => updateEffectConfig('enhancedRegeneration', !statusEffectData?.enhancedRegeneration)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.enhancedRegeneration ? '✓' : ''}
                </div>
                <span>Enhanced at Low Health</span>
              </button>
              <div className="option-description">Healing increases when below 50% health</div>
            </div>
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Duration</h4>
          <div className="effect-config-option">
            <label>Duration (rounds)</label>
            <input
              type="number"
              min="1"
              max="100"
              value={statusEffectData?.duration || 5}
              onChange={(e) => {
                updateEffectConfig('duration', parseInt(e.target.value));
              }}
            />
          </div>
        </div>
      </>
    );
  };

  // Render damage shield configuration
  const renderDamageShieldConfig = () => {
    return (
      <>
        <div className="effect-config-section">
          <h4>Damage Shield Type</h4>
          <div className="effect-options">
            <button
              className={`effect-option-button ${statusEffectData?.shieldType === 'reflection' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('shieldType', 'reflection')}
            >
              <span>Reflection</span>
            </button>
            <button
              className={`effect-option-button ${statusEffectData?.shieldType === 'thorns' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('shieldType', 'thorns')}
            >
              <span>Thorns</span>
            </button>
            <button
              className={`effect-option-button ${statusEffectData?.shieldType === 'absorption' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('shieldType', 'absorption')}
            >
              <span>Absorption</span>
            </button>
          </div>

          <div className="option-description">
            {statusEffectData?.shieldType === 'reflection' && 'Reflects a percentage of damage back to the attacker'}
            {statusEffectData?.shieldType === 'thorns' && 'Deals fixed damage to attackers when hit'}
            {statusEffectData?.shieldType === 'absorption' && 'Absorbs damage and converts it to temporary hit points'}
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Damage Shield Properties</h4>

          {statusEffectData?.shieldType === 'reflection' && (
            <div className="effect-config-option">
              <label>Reflection Percentage</label>
              <input
                type="number"
                min="10"
                max="100"
                step="5"
                value={statusEffectData?.reflectionPercentage || 25}
                onChange={(e) => {
                  updateEffectConfig('reflectionPercentage', parseInt(e.target.value));
                }}
              />
            </div>
          )}

          {statusEffectData?.shieldType === 'thorns' && (
            <>
              <div className="effect-config-option">
                <label>Thorns Damage</label>
                <div className="dice-formula-input">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className="dice-count-input"
                    value={statusEffectData?.thornsDiceCount || 1}
                    onChange={(e) => {
                      updateEffectConfig('thornsDiceCount', parseInt(e.target.value));
                    }}
                  />
                  <select
                    className="dice-type-input"
                    value={statusEffectData?.thornsDiceType || 'd6'}
                    onChange={(e) => {
                      updateEffectConfig('thornsDiceType', e.target.value);
                    }}
                  >
                    <option value="d4">d4</option>
                    <option value="d6">d6</option>
                    <option value="d8">d8</option>
                    <option value="d10">d10</option>
                    <option value="d12">d12</option>
                  </select>
                </div>
              </div>

              <div className="effect-config-option">
                <label>Damage Type</label>
                <select
                  value={statusEffectData?.thornsDamageType || 'piercing'}
                  onChange={(e) => updateEffectConfig('thornsDamageType', e.target.value)}
                >
                  <option value="piercing">Piercing</option>
                  <option value="slashing">Slashing</option>
                  <option value="fire">Fire</option>
                  <option value="cold">Cold</option>
                  <option value="lightning">Lightning</option>
                  <option value="acid">Acid</option>
                  <option value="force">Force</option>
                  <option value="necrotic">Necrotic</option>
                  <option value="radiant">Radiant</option>
                </select>
              </div>
            </>
          )}

          {statusEffectData?.shieldType === 'absorption' && (
            <>
              <div className="effect-config-option">
                <label>Absorption Percentage</label>
                <input
                  type="number"
                  min="10"
                  max="100"
                  step="5"
                  value={statusEffectData?.absorptionPercentage || 50}
                  onChange={(e) => {
                    updateEffectConfig('absorptionPercentage', parseInt(e.target.value));
                  }}
                />
              </div>

              <div className="effect-config-option">
                <label>Maximum Absorption</label>
                <input
                  type="number"
                  min="5"
                  max="100"
                  step="5"
                  value={statusEffectData?.maxAbsorption || 20}
                  onChange={(e) => {
                    updateEffectConfig('maxAbsorption', parseInt(e.target.value));
                  }}
                />
              </div>
            </>
          )}
        </div>

        <div className="effect-config-section">
          <h4>Trigger Conditions</h4>
          <div className="toggle-options">
            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.triggerOnMelee ? 'active' : ''}`}
                onClick={() => updateEffectConfig('triggerOnMelee', !statusEffectData?.triggerOnMelee)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.triggerOnMelee ? '✓' : ''}
                </div>
                <span>Trigger on Melee Attacks</span>
              </button>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.triggerOnRanged ? 'active' : ''}`}
                onClick={() => updateEffectConfig('triggerOnRanged', !statusEffectData?.triggerOnRanged)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.triggerOnRanged ? '✓' : ''}
                </div>
                <span>Trigger on Ranged Attacks</span>
              </button>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.triggerOnSpell ? 'active' : ''}`}
                onClick={() => updateEffectConfig('triggerOnSpell', !statusEffectData?.triggerOnSpell)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.triggerOnSpell ? '✓' : ''}
                </div>
                <span>Trigger on Spell Attacks</span>
              </button>
            </div>
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Duration</h4>
          <div className="effect-config-option">
            <label>Duration (rounds)</label>
            <input
              type="number"
              min="1"
              max="100"
              value={statusEffectData?.duration || 5}
              onChange={(e) => {
                updateEffectConfig('duration', parseInt(e.target.value));
              }}
            />
          </div>

          <div className="toggle-options">
            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.untilDispelled ? 'active' : ''}`}
                onClick={() => updateEffectConfig('untilDispelled', !statusEffectData?.untilDispelled)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.untilDispelled ? '✓' : ''}
                </div>
                <span>Until Dispelled</span>
              </button>
            </div>
          </div>
        </div>
      </>
    );
  };

  // Render combat advantage configuration
  const renderCombatAdvantageConfig = () => {
    return (
      <>
        <div className="effect-config-section">
          <h4>Advantage Type</h4>
          <div className="effect-options">
            <button
              className={`effect-option-button ${statusEffectData?.advantageType === 'attack' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('advantageType', 'attack')}
            >
              <span>Attack Rolls</span>
            </button>
            <button
              className={`effect-option-button ${statusEffectData?.advantageType === 'damage' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('advantageType', 'damage')}
            >
              <span>Damage Rolls</span>
            </button>
            <button
              className={`effect-option-button ${statusEffectData?.advantageType === 'healing' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('advantageType', 'healing')}
            >
              <span>Healing Rolls</span>
            </button>
            <button
              className={`effect-option-button ${statusEffectData?.advantageType === 'critical' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('advantageType', 'critical')}
            >
              <span>Critical Chance</span>
            </button>
            <button
              className={`effect-option-button ${statusEffectData?.advantageType === 'initiative' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('advantageType', 'initiative')}
            >
              <span>Initiative</span>
            </button>
          </div>

          <div className="option-description">
            {statusEffectData?.advantageType === 'attack' && 'Grants advantage on attack rolls'}
            {statusEffectData?.advantageType === 'damage' && 'Grants advantage on damage rolls for specific damage types'}
            {statusEffectData?.advantageType === 'healing' && 'Grants advantage on healing rolls'}
            {statusEffectData?.advantageType === 'critical' && 'Increases critical hit chance'}
            {statusEffectData?.advantageType === 'initiative' && 'Grants advantage on initiative rolls'}
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Advantage Count</h4>
          <div className="effect-config-option">
            <label>Number of Advantages</label>
            <input
              type="number"
              min="-1"
              max="10"
              value={statusEffectData?.advantageCount || 1}
              onChange={(e) => {
                updateEffectConfig('advantageCount', parseInt(e.target.value));
              }}
            />
            <div className="option-description">Number of times the target can use this advantage (-1 for unlimited uses)</div>
          </div>
        </div>
      </>
    );
  };

  // Render save disadvantage configuration
  const renderSaveDisadvantageConfig = () => {
    return (
      <>
        <div className="effect-config-section">
          <h4>Save Type</h4>
          <div className="effect-options">
            <button
              className={`effect-option-button ${statusEffectData?.option === 'all' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('option', 'all')}
            >
              <span>All Saves</span>
            </button>
            <button
              className={`effect-option-button ${statusEffectData?.option === 'specific' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('option', 'specific')}
            >
              <span>Specific Save</span>
            </button>
          </div>

          <div className="option-description">
            {statusEffectData?.option === 'all' && 'Imposes disadvantage on all saving throws'}
            {statusEffectData?.option === 'specific' && 'Imposes disadvantage on a specific saving throw type'}
          </div>
        </div>

        {statusEffectData?.option === 'specific' && (
          <div className="effect-config-section">
            <h4>Specific Save Type</h4>
            <div className="effect-options">
              <button
                className={`effect-option-button ${statusEffectData?.specificSave === 'strength' ? 'active' : ''}`}
                onClick={() => updateEffectConfig('specificSave', 'strength')}
              >
                <span>Strength</span>
              </button>
              <button
                className={`effect-option-button ${statusEffectData?.specificSave === 'agility' ? 'active' : ''}`}
                onClick={() => updateEffectConfig('specificSave', 'agility')}
              >
                <span>Agility</span>
              </button>
              <button
                className={`effect-option-button ${statusEffectData?.specificSave === 'constitution' ? 'active' : ''}`}
                onClick={() => updateEffectConfig('specificSave', 'constitution')}
              >
                <span>Constitution</span>
              </button>
              <button
                className={`effect-option-button ${statusEffectData?.specificSave === 'intelligence' ? 'active' : ''}`}
                onClick={() => updateEffectConfig('specificSave', 'intelligence')}
              >
                <span>Intelligence</span>
              </button>
              <button
                className={`effect-option-button ${statusEffectData?.specificSave === 'spirit' ? 'active' : ''}`}
                onClick={() => updateEffectConfig('specificSave', 'spirit')}
              >
                <span>Spirit</span>
              </button>
              <button
                className={`effect-option-button ${statusEffectData?.specificSave === 'charisma' ? 'active' : ''}`}
                onClick={() => updateEffectConfig('specificSave', 'charisma')}
              >
                <span>Charisma</span>
              </button>
            </div>
          </div>
        )}

        <div className="effect-config-section">
          <h4>Disadvantage Count</h4>
          <div className="effect-config-option">
            <label>Number of Disadvantages</label>
            <input
              type="number"
              min="-1"
              max="10"
              value={statusEffectData?.disadvantageCount || 1}
              onChange={(e) => {
                updateEffectConfig('disadvantageCount', parseInt(e.target.value));
              }}
            />
            <div className="option-description">Number of times the target suffers this disadvantage (-1 for unlimited uses)</div>
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Duration</h4>
          <div className="effect-config-option">
            <label>Duration (rounds)</label>
            <input
              type="number"
              min="1"
              max="10"
              value={statusEffectData?.duration || 3}
              onChange={(e) => {
                updateEffectConfig('duration', parseInt(e.target.value));
              }}
            />
          </div>
        </div>
      </>
    );
  };

  // Render combat disadvantage configuration
  const renderCombatDisadvantageConfig = () => {
    return (
      <>
        <div className="effect-config-section">
          <h4>Disadvantage Type</h4>
          <div className="effect-options">
            <button
              className={`effect-option-button ${statusEffectData?.option === 'all' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('option', 'all')}
            >
              <span>All Attacks</span>
            </button>
            <button
              className={`effect-option-button ${statusEffectData?.option === 'melee' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('option', 'melee')}
            >
              <span>Melee Attacks</span>
            </button>
            <button
              className={`effect-option-button ${statusEffectData?.option === 'ranged' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('option', 'ranged')}
            >
              <span>Ranged Attacks</span>
            </button>
            <button
              className={`effect-option-button ${statusEffectData?.option === 'spell' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('option', 'spell')}
            >
              <span>Spell Attacks</span>
            </button>
          </div>

          <div className="option-description">
            {statusEffectData?.option === 'all' && 'Imposes disadvantage on all attack rolls'}
            {statusEffectData?.option === 'melee' && 'Imposes disadvantage on melee attack rolls'}
            {statusEffectData?.option === 'ranged' && 'Imposes disadvantage on ranged attack rolls'}
            {statusEffectData?.option === 'spell' && 'Imposes disadvantage on spell attack rolls'}
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Disadvantage Count</h4>
          <div className="effect-config-option">
            <label>Number of Disadvantages</label>
            <input
              type="number"
              min="-1"
              max="10"
              value={statusEffectData?.disadvantageCount || 1}
              onChange={(e) => {
                updateEffectConfig('disadvantageCount', parseInt(e.target.value));
              }}
            />
            <div className="option-description">Number of times the target suffers this disadvantage (-1 for unlimited uses)</div>
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Attack Types Affected</h4>
          <div className="toggle-options">
            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.affectsMelee ? 'active' : ''}`}
                onClick={() => updateEffectConfig('affectsMelee', !statusEffectData?.affectsMelee)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.affectsMelee ? '✓' : ''}
                </div>
                <span>Melee Attacks</span>
              </button>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.affectsRanged ? 'active' : ''}`}
                onClick={() => updateEffectConfig('affectsRanged', !statusEffectData?.affectsRanged)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.affectsRanged ? '✓' : ''}
                </div>
                <span>Ranged Attacks</span>
              </button>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.affectsSpell ? 'active' : ''}`}
                onClick={() => updateEffectConfig('affectsSpell', !statusEffectData?.affectsSpell)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.affectsSpell ? '✓' : ''}
                </div>
                <span>Spell Attacks</span>
              </button>
            </div>
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Duration</h4>
          <div className="effect-config-option">
            <label>Duration (rounds)</label>
            <input
              type="number"
              min="1"
              max="10"
              value={statusEffectData?.duration || 3}
              onChange={(e) => {
                updateEffectConfig('duration', parseInt(e.target.value));
              }}
            />
          </div>
        </div>
      </>
    );
  };

  // Render combat advantage configuration (continued)
  const renderCombatAdvantageConfig2 = () => {
    return (
      <>
        <div className="effect-config-section">
          <h4>Advantage Properties</h4>
          {statusEffectData?.advantageType === 'attack' && (
            <div className="effect-config-option">
              <label>Attack Types</label>
              <div className="toggle-options">
                <div className="toggle-option">
                  <button
                    className={`toggle-button ${statusEffectData?.affectsMelee ? 'active' : ''}`}
                    onClick={() => updateEffectConfig('affectsMelee', !statusEffectData?.affectsMelee)}
                  >
                    <div className="toggle-icon">
                      {statusEffectData?.affectsMelee ? '✓' : ''}
                    </div>
                    <span>Melee Attacks</span>
                  </button>
                </div>

                <div className="toggle-option">
                  <button
                    className={`toggle-button ${statusEffectData?.affectsRanged ? 'active' : ''}`}
                    onClick={() => updateEffectConfig('affectsRanged', !statusEffectData?.affectsRanged)}
                  >
                    <div className="toggle-icon">
                      {statusEffectData?.affectsRanged ? '✓' : ''}
                    </div>
                    <span>Ranged Attacks</span>
                  </button>
                </div>

                <div className="toggle-option">
                  <button
                    className={`toggle-button ${statusEffectData?.affectsSpell ? 'active' : ''}`}
                    onClick={() => updateEffectConfig('affectsSpell', !statusEffectData?.affectsSpell)}
                  >
                    <div className="toggle-icon">
                      {statusEffectData?.affectsSpell ? '✓' : ''}
                    </div>
                    <span>Spell Attacks</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {statusEffectData?.advantageType === 'damage' && (
            <>
              <div className="effect-config-option">
                <label>Damage Bonus</label>
                <div className="dice-formula-input">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className="dice-count-input"
                    value={statusEffectData?.damageBonusDiceCount || 1}
                    onChange={(e) => {
                      updateEffectConfig('damageBonusDiceCount', parseInt(e.target.value));
                    }}
                  />
                  <select
                    className="dice-type-input"
                    value={statusEffectData?.damageBonusDiceType || 'd6'}
                    onChange={(e) => {
                      updateEffectConfig('damageBonusDiceType', e.target.value);
                    }}
                  >
                    <option value="d4">d4</option>
                    <option value="d6">d6</option>
                    <option value="d8">d8</option>
                    <option value="d10">d10</option>
                    <option value="d12">d12</option>
                  </select>
                </div>
              </div>

              <div className="effect-config-option">
                <label>Damage Categories</label>
                <div className="toggle-options">
                  <div className="toggle-option">
                    <button
                      className={`toggle-button ${statusEffectData?.affectsPhysical ? 'active' : ''}`}
                      onClick={() => updateEffectConfig('affectsPhysical', !statusEffectData?.affectsPhysical)}
                    >
                      <div className="toggle-icon">
                        {statusEffectData?.affectsPhysical ? '✓' : ''}
                      </div>
                      <span>Physical Damage</span>
                    </button>
                  </div>

                  <div className="toggle-option">
                    <button
                      className={`toggle-button ${statusEffectData?.affectsMagical ? 'active' : ''}`}
                      onClick={() => updateEffectConfig('affectsMagical', !statusEffectData?.affectsMagical)}
                    >
                      <div className="toggle-icon">
                        {statusEffectData?.affectsMagical ? '✓' : ''}
                      </div>
                      <span>Magical Damage</span>
                    </button>
                  </div>

                  <div className="toggle-option">
                    <button
                      className={`toggle-button ${statusEffectData?.affectsAllDamageTypes ? 'active' : ''}`}
                      onClick={() => updateEffectConfig('affectsAllDamageTypes', !statusEffectData?.affectsAllDamageTypes)}
                    >
                      <div className="toggle-icon">
                        {statusEffectData?.affectsAllDamageTypes ? '✓' : ''}
                      </div>
                      <span>All Damage Types</span>
                    </button>
                  </div>
                </div>
              </div>

              {statusEffectData?.affectsPhysical && !statusEffectData?.affectsAllDamageTypes && (
                <div className="effect-config-option">
                  <label>Physical Damage Types</label>
                  <div className="toggle-options">
                    <div className="toggle-option">
                      <button
                        className={`toggle-button ${statusEffectData?.affectsBludgeoning ? 'active' : ''}`}
                        onClick={() => updateEffectConfig('affectsBludgeoning', !statusEffectData?.affectsBludgeoning)}
                      >
                        <div className="toggle-icon">
                          {statusEffectData?.affectsBludgeoning ? '✓' : ''}
                        </div>
                        <span>Bludgeoning</span>
                      </button>
                    </div>

                    <div className="toggle-option">
                      <button
                        className={`toggle-button ${statusEffectData?.affectsPiercing ? 'active' : ''}`}
                        onClick={() => updateEffectConfig('affectsPiercing', !statusEffectData?.affectsPiercing)}
                      >
                        <div className="toggle-icon">
                          {statusEffectData?.affectsPiercing ? '✓' : ''}
                        </div>
                        <span>Piercing</span>
                      </button>
                    </div>

                    <div className="toggle-option">
                      <button
                        className={`toggle-button ${statusEffectData?.affectsSlashing ? 'active' : ''}`}
                        onClick={() => updateEffectConfig('affectsSlashing', !statusEffectData?.affectsSlashing)}
                      >
                        <div className="toggle-icon">
                          {statusEffectData?.affectsSlashing ? '✓' : ''}
                        </div>
                        <span>Slashing</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {statusEffectData?.affectsMagical && !statusEffectData?.affectsAllDamageTypes && (
                <div className="effect-config-option">
                  <label>Magical Damage Types</label>
                  <div className="toggle-options">
                    <div className="toggle-option">
                      <button
                        className={`toggle-button ${statusEffectData?.affectsFire ? 'active' : ''}`}
                        onClick={() => updateEffectConfig('affectsFire', !statusEffectData?.affectsFire)}
                      >
                        <div className="toggle-icon">
                          {statusEffectData?.affectsFire ? '✓' : ''}
                        </div>
                        <span>Fire</span>
                      </button>
                    </div>

                    <div className="toggle-option">
                      <button
                        className={`toggle-button ${statusEffectData?.affectsCold ? 'active' : ''}`}
                        onClick={() => updateEffectConfig('affectsCold', !statusEffectData?.affectsCold)}
                      >
                        <div className="toggle-icon">
                          {statusEffectData?.affectsCold ? '✓' : ''}
                        </div>
                        <span>Cold</span>
                      </button>
                    </div>

                    <div className="toggle-option">
                      <button
                        className={`toggle-button ${statusEffectData?.affectsVoid ? 'active' : ''}`}
                        onClick={() => updateEffectConfig('affectsVoid', !statusEffectData?.affectsVoid)}
                      >
                        <div className="toggle-icon">
                          {statusEffectData?.affectsVoid ? '✓' : ''}
                        </div>
                        <span>Void</span>
                      </button>
                    </div>

                    <div className="toggle-option">
                      <button
                        className={`toggle-button ${statusEffectData?.affectsLightning ? 'active' : ''}`}
                        onClick={() => updateEffectConfig('affectsLightning', !statusEffectData?.affectsLightning)}
                      >
                        <div className="toggle-icon">
                          {statusEffectData?.affectsLightning ? '✓' : ''}
                        </div>
                        <span>Lightning</span>
                      </button>
                    </div>

                    <div className="toggle-option">
                      <button
                        className={`toggle-button ${statusEffectData?.affectsArcane ? 'active' : ''}`}
                        onClick={() => updateEffectConfig('affectsArcane', !statusEffectData?.affectsArcane)}
                      >
                        <div className="toggle-icon">
                          {statusEffectData?.affectsArcane ? '✓' : ''}
                        </div>
                        <span>Arcane</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {statusEffectData?.advantageType === 'healing' && (
            <>
              <div className="effect-config-option">
                <label>Healing Bonus</label>
                <div className="dice-formula-input">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    className="dice-count-input"
                    value={statusEffectData?.healingBonusDiceCount || 1}
                    onChange={(e) => {
                      updateEffectConfig('healingBonusDiceCount', parseInt(e.target.value));
                    }}
                  />
                  <select
                    className="dice-type-input"
                    value={statusEffectData?.healingBonusDiceType || 'd6'}
                    onChange={(e) => {
                      updateEffectConfig('healingBonusDiceType', e.target.value);
                    }}
                  >
                    <option value="d4">d4</option>
                    <option value="d6">d6</option>
                    <option value="d8">d8</option>
                    <option value="d10">d10</option>
                    <option value="d12">d12</option>
                  </select>
                </div>
              </div>

              <div className="effect-config-option">
                <label>Healing Types</label>
                <div className="toggle-options">
                  <div className="toggle-option">
                    <button
                      className={`toggle-button ${statusEffectData?.affectsDirectHealing ? 'active' : ''}`}
                      onClick={() => updateEffectConfig('affectsDirectHealing', !statusEffectData?.affectsDirectHealing)}
                    >
                      <div className="toggle-icon">
                        {statusEffectData?.affectsDirectHealing ? '✓' : ''}
                      </div>
                      <span>Direct Healing</span>
                    </button>
                  </div>

                  <div className="toggle-option">
                    <button
                      className={`toggle-button ${statusEffectData?.affectsHealingOverTime ? 'active' : ''}`}
                      onClick={() => updateEffectConfig('affectsHealingOverTime', !statusEffectData?.affectsHealingOverTime)}
                    >
                      <div className="toggle-icon">
                        {statusEffectData?.affectsHealingOverTime ? '✓' : ''}
                      </div>
                      <span>Healing Over Time</span>
                    </button>
                  </div>

                  <div className="toggle-option">
                    <button
                      className={`toggle-button ${statusEffectData?.affectsAbsorptionShields ? 'active' : ''}`}
                      onClick={() => updateEffectConfig('affectsAbsorptionShields', !statusEffectData?.affectsAbsorptionShields)}
                    >
                      <div className="toggle-icon">
                        {statusEffectData?.affectsAbsorptionShields ? '✓' : ''}
                      </div>
                      <span>Absorption Shields</span>
                    </button>
                  </div>
                </div>
              </div>
            </>
          )}

          {statusEffectData?.advantageType === 'critical' && (
            <div className="effect-config-option">
              <label>Critical Threshold Reduction</label>
              <input
                type="number"
                min="1"
                max="5"
                value={statusEffectData?.criticalReduction || 1}
                onChange={(e) => {
                  updateEffectConfig('criticalReduction', parseInt(e.target.value));
                }}
              />
              <div className="option-description">Reduces the number needed to roll a critical hit (e.g., crit on 19-20 instead of just 20)</div>
            </div>
          )}

          {statusEffectData?.advantageType === 'initiative' && (
            <div className="effect-config-option">
              <label>Initiative Bonus</label>
              <input
                type="number"
                min="1"
                max="10"
                value={statusEffectData?.initiativeBonus || 2}
                onChange={(e) => {
                  updateEffectConfig('initiativeBonus', parseInt(e.target.value));
                }}
              />
            </div>
          )}
        </div>

        <div className="effect-config-section">
          <h4>Condition Requirements</h4>
          <div className="toggle-options">
            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.requiresHigherGround ? 'active' : ''}`}
                onClick={() => updateEffectConfig('requiresHigherGround', !statusEffectData?.requiresHigherGround)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.requiresHigherGround ? '✓' : ''}
                </div>
                <span>Requires Higher Ground</span>
              </button>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.requiresFlank ? 'active' : ''}`}
                onClick={() => updateEffectConfig('requiresFlank', !statusEffectData?.requiresFlank)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.requiresFlank ? '✓' : ''}
                </div>
                <span>Requires Flanking</span>
              </button>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.requiresHidden ? 'active' : ''}`}
                onClick={() => updateEffectConfig('requiresHidden', !statusEffectData?.requiresHidden)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.requiresHidden ? '✓' : ''}
                </div>
                <span>Requires Hidden/Stealth</span>
              </button>
            </div>
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Duration</h4>
          <div className="effect-config-option">
            <label>Duration (rounds)</label>
            <input
              type="number"
              min="1"
              max="100"
              value={statusEffectData?.duration || 3}
              onChange={(e) => {
                updateEffectConfig('duration', parseInt(e.target.value));
              }}
            />
          </div>

          <div className="toggle-options">
            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.onlyNextAttack ? 'active' : ''}`}
                onClick={() => updateEffectConfig('onlyNextAttack', !statusEffectData?.onlyNextAttack)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.onlyNextAttack ? '✓' : ''}
                </div>
                <span>Only Next Attack</span>
              </button>
              <div className="option-description">Effect ends after making an attack</div>
            </div>
          </div>
        </div>
      </>
    );
  };

  // Render skill mastery configuration
  const renderSkillMasteryConfig = () => {
    return (
      <>
        <div className="effect-config-section">
          <h4>Skill Mastery Type</h4>
          <div className="effect-options">
            <button
              className={`effect-option-button ${statusEffectData?.masteryType === 'specific' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('masteryType', 'specific')}
            >
              <span>Specific Skills</span>
            </button>
            <button
              className={`effect-option-button ${statusEffectData?.masteryType === 'attribute' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('masteryType', 'attribute')}
            >
              <span>Attribute-Based</span>
            </button>
            <button
              className={`effect-option-button ${statusEffectData?.masteryType === 'all' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('masteryType', 'all')}
            >
              <span>All Skills</span>
            </button>
          </div>

          <div className="option-description">
            {statusEffectData?.masteryType === 'specific' && 'Grants mastery in specific skills'}
            {statusEffectData?.masteryType === 'attribute' && 'Grants mastery in all skills based on an attribute'}
            {statusEffectData?.masteryType === 'all' && 'Grants mastery in all skills'}
          </div>
        </div>

        <div className="effect-config-section">
          <h4>Mastery Properties</h4>

          {statusEffectData?.masteryType === 'specific' && (
            <div className="effect-config-option">
              <label>Select Skills</label>
              <div className="toggle-options">
                <div className="toggle-option">
                  <button
                    className={`toggle-button ${statusEffectData?.affectsAcrobatics ? 'active' : ''}`}
                    onClick={() => updateEffectConfig('affectsAcrobatics', !statusEffectData?.affectsAcrobatics)}
                  >
                    <div className="toggle-icon">
                      {statusEffectData?.affectsAcrobatics ? '✓' : ''}
                    </div>
                    <span>Acrobatics</span>
                  </button>
                </div>

                <div className="toggle-option">
                  <button
                    className={`toggle-button ${statusEffectData?.affectsAthletics ? 'active' : ''}`}
                    onClick={() => updateEffectConfig('affectsAthletics', !statusEffectData?.affectsAthletics)}
                  >
                    <div className="toggle-icon">
                      {statusEffectData?.affectsAthletics ? '✓' : ''}
                    </div>
                    <span>Athletics</span>
                  </button>
                </div>

                <div className="toggle-option">
                  <button
                    className={`toggle-button ${statusEffectData?.affectsArcana ? 'active' : ''}`}
                    onClick={() => updateEffectConfig('affectsArcana', !statusEffectData?.affectsArcana)}
                  >
                    <div className="toggle-icon">
                      {statusEffectData?.affectsArcana ? '✓' : ''}
                    </div>
                    <span>Arcana</span>
                  </button>
                </div>

                <div className="toggle-option">
                  <button
                    className={`toggle-button ${statusEffectData?.affectsPerception ? 'active' : ''}`}
                    onClick={() => updateEffectConfig('affectsPerception', !statusEffectData?.affectsPerception)}
                  >
                    <div className="toggle-icon">
                      {statusEffectData?.affectsPerception ? '✓' : ''}
                    </div>
                    <span>Perception</span>
                  </button>
                </div>

                <div className="toggle-option">
                  <button
                    className={`toggle-button ${statusEffectData?.affectsStealth ? 'active' : ''}`}
                    onClick={() => updateEffectConfig('affectsStealth', !statusEffectData?.affectsStealth)}
                  >
                    <div className="toggle-icon">
                      {statusEffectData?.affectsStealth ? '✓' : ''}
                    </div>
                    <span>Stealth</span>
                  </button>
                </div>

                <div className="toggle-option">
                  <button
                    className={`toggle-button ${statusEffectData?.affectsSurvival ? 'active' : ''}`}
                    onClick={() => updateEffectConfig('affectsSurvival', !statusEffectData?.affectsSurvival)}
                  >
                    <div className="toggle-icon">
                      {statusEffectData?.affectsSurvival ? '✓' : ''}
                    </div>
                    <span>Survival</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {statusEffectData?.masteryType === 'attribute' && (
            <div className="effect-config-option">
              <label>Select Attribute</label>
              <div className="effect-options">
                <button
                  className={`effect-option-button ${statusEffectData?.attribute === 'strength' ? 'active' : ''}`}
                  onClick={() => updateEffectConfig('attribute', 'strength')}
                >
                  <span>Strength</span>
                </button>
                <button
                  className={`effect-option-button ${statusEffectData?.attribute === 'dexterity' ? 'active' : ''}`}
                  onClick={() => updateEffectConfig('attribute', 'dexterity')}
                >
                  <span>Dexterity</span>
                </button>
                <button
                  className={`effect-option-button ${statusEffectData?.attribute === 'constitution' ? 'active' : ''}`}
                  onClick={() => updateEffectConfig('attribute', 'constitution')}
                >
                  <span>Constitution</span>
                </button>
                <button
                  className={`effect-option-button ${statusEffectData?.attribute === 'intelligence' ? 'active' : ''}`}
                  onClick={() => updateEffectConfig('attribute', 'intelligence')}
                >
                  <span>Intelligence</span>
                </button>
                <button
                  className={`effect-option-button ${statusEffectData?.attribute === 'wisdom' ? 'active' : ''}`}
                  onClick={() => updateEffectConfig('attribute', 'wisdom')}
                >
                  <span>Wisdom</span>
                </button>
                <button
                  className={`effect-option-button ${statusEffectData?.attribute === 'charisma' ? 'active' : ''}`}
                  onClick={() => updateEffectConfig('attribute', 'charisma')}
                >
                  <span>Charisma</span>
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="effect-config-section">
          <h4>Mastery Effect</h4>
          <div className="effect-options">
            <button
              className={`effect-option-button ${statusEffectData?.masteryEffect === 'advantage' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('masteryEffect', 'advantage')}
            >
              <span>Advantage</span>
            </button>
            <button
              className={`effect-option-button ${statusEffectData?.masteryEffect === 'expertise' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('masteryEffect', 'expertise')}
            >
              <span>Expertise (Double Proficiency)</span>
            </button>
            <button
              className={`effect-option-button ${statusEffectData?.masteryEffect === 'bonus' ? 'active' : ''}`}
              onClick={() => updateEffectConfig('masteryEffect', 'bonus')}
            >
              <span>Flat Bonus</span>
            </button>
          </div>

          {statusEffectData?.masteryEffect === 'bonus' && (
            <div className="effect-config-option">
              <label>Bonus Amount</label>
              <input
                type="number"
                min="1"
                max="10"
                value={statusEffectData?.bonusAmount || 2}
                onChange={(e) => {
                  updateEffectConfig('bonusAmount', parseInt(e.target.value));
                }}
              />
            </div>
          )}
        </div>

        <div className="effect-config-section">
          <h4>Duration</h4>

          <div className="effect-config-option">
            <label>Duration Type</label>
            <div className="effect-options">
              <button
                className={`effect-option-button ${statusEffectData?.durationType === 'turns' ? 'active' : ''}`}
                onClick={() => updateEffectConfig('durationType', 'turns')}
              >
                <span>Turns/Rounds</span>
              </button>
              <button
                className={`effect-option-button ${statusEffectData?.durationType === 'time' ? 'active' : ''}`}
                onClick={() => updateEffectConfig('durationType', 'time')}
              >
                <span>Time-Based</span>
              </button>
              <button
                className={`effect-option-button ${statusEffectData?.durationType === 'rest' ? 'active' : ''}`}
                onClick={() => updateEffectConfig('durationType', 'rest')}
              >
                <span>Rest-Based</span>
              </button>
              <button
                className={`effect-option-button ${statusEffectData?.durationType === 'permanent' ? 'active' : ''}`}
                onClick={() => updateEffectConfig('durationType', 'permanent')}
              >
                <span>Permanent</span>
              </button>
            </div>
          </div>

          {statusEffectData?.durationType === 'turns' && (
            <div className="effect-config-option">
              <label>Number of Turns/Rounds</label>
              <input
                type="number"
                min="1"
                max="100"
                value={statusEffectData?.durationValue || 3}
                onChange={(e) => {
                  updateEffectConfig('durationValue', parseInt(e.target.value));
                }}
              />
            </div>
          )}

          {statusEffectData?.durationType === 'time' && (
            <div className="effect-config-option">
              <div className="duration-time-input">
                <input
                  type="number"
                  min="1"
                  max="999"
                  value={statusEffectData?.durationValue || 1}
                  onChange={(e) => {
                    updateEffectConfig('durationValue', parseInt(e.target.value));
                  }}
                />
                <select
                  value={statusEffectData?.durationUnit || 'minutes'}
                  onChange={(e) => {
                    updateEffectConfig('durationUnit', e.target.value);
                  }}
                >
                  <option value="seconds">Seconds</option>
                  <option value="minutes">Minutes</option>
                  <option value="hours">Hours</option>
                  <option value="days">Days</option>
                </select>
              </div>
            </div>
          )}

          {statusEffectData?.durationType === 'rest' && (
            <div className="effect-config-option">
              <label>Rest Type</label>
              <div className="effect-options">
                <button
                  className={`effect-option-button ${statusEffectData?.restType === 'short' ? 'active' : ''}`}
                  onClick={() => updateEffectConfig('restType', 'short')}
                >
                  <span>Until Short Rest</span>
                </button>
                <button
                  className={`effect-option-button ${statusEffectData?.restType === 'long' ? 'active' : ''}`}
                  onClick={() => updateEffectConfig('restType', 'long')}
                >
                  <span>Until Long Rest</span>
                </button>
              </div>
            </div>
          )}

          {statusEffectData?.durationType === 'permanent' && (
            <div className="effect-config-option">
              <div className="toggle-options">
                <div className="toggle-option">
                  <button
                    className={`toggle-button ${statusEffectData?.canBeDispelled ? 'active' : ''}`}
                    onClick={() => updateEffectConfig('canBeDispelled', !statusEffectData?.canBeDispelled)}
                  >
                    <div className="toggle-icon">
                      {statusEffectData?.canBeDispelled ? '✓' : ''}
                    </div>
                    <span>Can Be Dispelled</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {(statusEffectData?.durationType === 'turns' || statusEffectData?.durationType === 'time') && (
            <div className="effect-config-option">
              <div className="toggle-options">
                <div className="toggle-option">
                  <button
                    className={`toggle-button ${statusEffectData?.concentrationRequired ? 'active' : ''}`}
                    onClick={() => updateEffectConfig('concentrationRequired', !statusEffectData?.concentrationRequired)}
                  >
                    <div className="toggle-icon">
                      {statusEffectData?.concentrationRequired ? '✓' : ''}
                    </div>
                    <span>Requires Concentration</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </>
    );
  };

  // Default configuration for status effects without specific configurations
  const renderDefaultConfig = () => {
    return (
      <>
        <div className="effect-config-section">
          <h4>Effect Options</h4>
          {effect.options && effect.options.length > 0 ? (
            <div className="effect-options">
              {effect.options.map(option => (
                <button
                  key={option.id}
                  className={`effect-option-button ${statusEffectData?.option === option.id ? 'active' : ''}`}
                  onClick={() => updateEffectConfig('option', option.id)}
                >
                  <span>{option.name}</span>
                </button>
              ))}
            </div>
          ) : (
            <div className="no-options-message">No additional options available for this effect.</div>
          )}

          {effect.options && effect.options.length > 0 && statusEffectData?.option && (
            <div className="option-description">
              {effect.options.find(opt => opt.id === statusEffectData.option)?.description || ''}
            </div>
          )}
        </div>

        <div className="effect-config-section">
          <h4>Save Options</h4>
          <div className="effect-config-option">
            <label>Save Type</label>
            <select
              value={statusEffectData?.saveType || 'none'}
              onChange={(e) => updateEffectConfig('saveType', e.target.value)}
            >
              <option value="none">No Save</option>
              <option value="strength">Strength</option>
              <option value="dexterity">Dexterity</option>
              <option value="constitution">Constitution</option>
              <option value="intelligence">Intelligence</option>
              <option value="wisdom">Wisdom</option>
              <option value="charisma">Charisma</option>
            </select>
          </div>

          {statusEffectData?.saveType && statusEffectData.saveType !== 'none' && (
            <div className="effect-config-option">
              <label>Save Frequency</label>
              <select
                value={statusEffectData?.saveFrequency || 'end_of_turn'}
                onChange={(e) => updateEffectConfig('saveFrequency', e.target.value)}
              >
                <option value="initial">Initial Only</option>
                <option value="end_of_turn">End of Each Turn</option>
                <option value="when_damaged">When Damaged</option>
                <option value="special_trigger">Special Trigger</option>
              </select>
            </div>
          )}
        </div>

        <div className="effect-config-section">
          <h4>Effect Behavior</h4>
          <div className="toggle-options">
            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.canStack ? 'active' : ''}`}
                onClick={() => updateEffectConfig('canStack', !statusEffectData?.canStack)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.canStack ? '✓' : ''}
                </div>
                <span>Can Stack</span>
              </button>
              <div className="option-description">Multiple instances of this effect can stack</div>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.dispellable ? 'active' : ''}`}
                onClick={() => updateEffectConfig('dispellable', !statusEffectData?.dispellable)}
              >
                <div className="toggle-icon">
                  {statusEffectData?.dispellable ? '✓' : ''}
                </div>
                <span>Dispellable</span>
              </button>
              <div className="option-description">Effect can be removed by dispel magic</div>
            </div>

            <div className="toggle-option">
              <button
                className={`toggle-button ${statusEffectData?.isProgressive ? 'active' : ''}`}
                onClick={() => {
                  const newValue = !statusEffectData?.isProgressive;
                  updateEffectConfig('isProgressive', newValue);

                  // Initialize progressiveStages array when enabling progressive effect
                  if (newValue && !statusEffectData?.progressiveStages) {
                    updateEffectConfig('progressiveStages', []);
                  }
                }}
              >
                <div className="toggle-icon">
                  {statusEffectData?.isProgressive ? '✓' : ''}
                </div>
                <span>Progressive Effect</span>
              </button>
              <div className="option-description">Effect changes in strength over time</div>
            </div>
          </div>
        </div>

        {statusEffectData?.isProgressive && (
          <div className="effect-config-section">
            <h4>Progressive Stages</h4>
            <p className="stage-description">Configure how the effect changes over time</p>

            {statusEffectData.progressiveStages && statusEffectData.progressiveStages.length > 0 ? (
              <div className="stages-list">
                {statusEffectData.progressiveStages.map((stage, index) => (
                  <div key={index} className="stage-item">
                    <div className="stage-header">
                      <span className="stage-title">Stage {index + 1}</span>
                      <div className="stage-actions">
                        <button
                          className="stage-action delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            const updatedStages = [...(statusEffectData.progressiveStages || [])];
                            updatedStages.splice(index, 1);
                            updateEffectConfig('progressiveStages', updatedStages);
                          }}
                          title="Remove stage"
                        >
                          ×
                        </button>
                      </div>
                    </div>
                    <div className="stage-content">
                      <div className="stage-timing">
                        <label>Trigger at:</label>
                        <div className="stage-timing-inputs">
                          <input
                            type="number"
                            min="1"
                            max={statusEffectData.duration || 3}
                            value={stage.triggerAt || 1}
                            onChange={(e) => {
                              const updatedStages = [...(statusEffectData.progressiveStages || [])];
                              updatedStages[index] = {
                                ...updatedStages[index],
                                triggerAt: parseInt(e.target.value)
                              };
                              updateEffectConfig('progressiveStages', updatedStages);
                            }}
                          />
                          <span className="unit-label">{statusEffectData.durationUnit || 'rounds'}</span>
                        </div>
                      </div>
                      <div className="stage-effect">
                        <label>Magnitude:</label>
                        <input
                          type="text"
                          value={stage.magnitude || ''}
                          onChange={(e) => {
                            const updatedStages = [...(statusEffectData.progressiveStages || [])];
                            updatedStages[index] = {
                              ...updatedStages[index],
                              magnitude: e.target.value
                            };
                            updateEffectConfig('progressiveStages', updatedStages);
                          }}
                          placeholder="Value or formula"
                        />
                      </div>
                      <div className="stage-type">
                        <label>Type:</label>
                        <select
                          value={stage.magnitudeType || 'flat'}
                          onChange={(e) => {
                            const updatedStages = [...(statusEffectData.progressiveStages || [])];
                            updatedStages[index] = {
                              ...updatedStages[index],
                              magnitudeType: e.target.value
                            };
                            updateEffectConfig('progressiveStages', updatedStages);
                          }}
                        >
                          <option value="flat">Flat</option>
                          <option value="percentage">Percentage</option>
                        </select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="no-stages">No stages configured yet</div>
            )}

            <button
              className="add-stage-button"
              onClick={(e) => {
                e.stopPropagation();
                const progressiveStages = statusEffectData.progressiveStages || [];
                const newStage = {
                  triggerAt: progressiveStages.length + 1,
                  magnitude: statusEffectData.magnitude || 2,
                  magnitudeType: statusEffectData.magnitudeType || 'flat'
                };
                updateEffectConfig('progressiveStages', [...progressiveStages, newStage]);
              }}
            >
              + Add Stage
            </button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className="effect-config-backdrop" onClick={handleBackdropClick}>
      <div className="effect-config-content">
        <div className="effect-config-header">
          <div className="effect-config-title">
            <img
              src={getIconUrl(effect.icon)}
              alt={effect.name}
              className="effect-config-icon"
            />
            <h2>{effect.name} Configuration</h2>
          </div>
          <button className="effect-config-close" onClick={onClose}>×</button>
        </div>

        <div className="effect-config-body">
          <div className="effect-config-description">
            {effect.description}
          </div>

          {renderEffectSpecificConfig()}
        </div>

        <div className="effect-config-footer">
          <button className="effect-config-save" onClick={onClose}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default StatusEffectConfigPopup;
