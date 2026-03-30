import React from 'react';
import './lifelink-styles.css';

const LifelinkConfigPopup = ({
  isOpen,
  onClose,
  effect,
  selectedEffect,
  updateConfig,
  configType // 'buff' or 'debuff'
}) => {
  if (!isOpen) return null;

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const updateEffectConfig = (field, value) => {
    const updatedEffects = configType === 'buff'
      ? { statusEffects: selectedEffect.statusEffects.map(se =>
          se.id === effect.id ? {...se, [field]: value} : se
        )}
      : { statusEffects: selectedEffect.statusEffects.map(se =>
          se.id === effect.id ? {...se, [field]: value} : se
        )};

    updateConfig('statusEffects', updatedEffects.statusEffects);
  };

  return (
    <div className="lifelink-popup-backdrop" onClick={handleBackdropClick}>
      <div className="lifelink-popup-content">
        <div className="lifelink-popup-header">
          <div className="lifelink-popup-title">
            <img
              src={`https://wow.zamimg.com/images/wow/icons/large/${effect.icon}.jpg`}
              alt={effect.name}
              className="lifelink-popup-icon"
            />
            <h2>{effect.name} Configuration</h2>
          </div>
          <button className="lifelink-popup-close" onClick={onClose}>×</button>
        </div>

        <div className="lifelink-popup-body">
          <div className="lifelink-section">
            <h4>Link Direction</h4>
            <div className="lifelink-option">
              <label>Direction</label>
              <select
                value={selectedEffect?.direction || 'caster_to_target'}
                onChange={(e) => {
                  e.stopPropagation();
                  updateEffectConfig('direction', e.target.value);
                }}
              >
                <option value="caster_to_target">Caster to Target</option>
                <option value="target_to_caster">Target to Caster</option>
                <option value="bidirectional">Bidirectional</option>
              </select>
            </div>
          </div>

          <div className="lifelink-section">
            <h4>Resource Configuration</h4>
            <div className="lifelink-option">
              <label>Source Resource</label>
              <select
                value={selectedEffect?.sourceResource || 'health'}
                onChange={(e) => {
                  e.stopPropagation();
                  updateEffectConfig('sourceResource', e.target.value);
                }}
              >
                <option value="health">Health</option>
                <option value="mana">Mana</option>
                <option value="stamina">Stamina</option>
                <option value="rage">Rage</option>
                <option value="energy">Energy</option>
              </select>
            </div>

            <div className="lifelink-option">
              <label>Target Resource</label>
              <select
                value={selectedEffect?.targetResource || 'health'}
                onChange={(e) => {
                  e.stopPropagation();
                  updateEffectConfig('targetResource', e.target.value);
                }}
              >
                <option value="health">Health</option>
                <option value="mana">Mana</option>
                <option value="stamina">Stamina</option>
                <option value="rage">Rage</option>
                <option value="energy">Energy</option>
              </select>
            </div>
          </div>

          <div className="lifelink-section">
            <h4>Conversion Formula</h4>
            <div className="lifelink-option">
              <label>Formula</label>
              <input
                type="text"
                className="formula-input"
                value={selectedEffect?.customFormula || 'SOURCE_AMOUNT * 0.25'}
                placeholder="Enter formula (e.g. SOURCE_AMOUNT * 0.25)"
                onChange={(e) => {
                  e.stopPropagation();
                  updateEffectConfig('customFormula', e.target.value);
                  updateEffectConfig('calculationType', 'custom_formula');
                }}
              />
            </div>

            <div className="lifelink-formula-preview">
              <code>{selectedEffect?.customFormula || 'SOURCE_AMOUNT * 0.25'}</code>
            </div>

            <div className="lifelink-examples">
              <h5>Simple Formulas:</h5>
              <div className="lifelink-example clickable" onClick={() => {
                updateEffectConfig('customFormula', 'SOURCE_AMOUNT * 0.25');
                updateEffectConfig('calculationType', 'custom_formula');
              }}>
                <code>SOURCE_AMOUNT * 0.25</code>
                <span>Convert 25% of the damage</span>
              </div>
              <div className="lifelink-example clickable" onClick={() => {
                updateEffectConfig('customFormula', '5');
                updateEffectConfig('calculationType', 'custom_formula');
              }}>
                <code>5</code>
                <span>Fixed amount of 5</span>
              </div>
              <div className="lifelink-example clickable" onClick={() => {
                updateEffectConfig('customFormula', 'ROLL_1D6');
                updateEffectConfig('calculationType', 'custom_formula');
              }}>
                <code>ROLL_1D6</code>
                <span>Roll 1d6 for conversion amount</span>
              </div>
              <div className="lifelink-example clickable" onClick={() => {
                updateEffectConfig('customFormula', 'ROLL_1D4 + ROLL_1D4');
                updateEffectConfig('calculationType', 'custom_formula');
              }}>
                <code>ROLL_1D4 + ROLL_1D4</code>
                <span>Roll 2d4 for conversion amount</span>
              </div>

              <h5>Advanced Formulas:</h5>
              <div className="lifelink-example clickable" onClick={() => {
                updateEffectConfig('customFormula', 'Math.floor(SOURCE_AMOUNT / 10) * ROLL_1D6');
                updateEffectConfig('perAmount', 10);
                updateEffectConfig('calculationType', 'custom_formula');
              }}>
                <code>Math.floor(SOURCE_AMOUNT / 10) * ROLL_1D6</code>
                <span>For every 10 damage taken/dealt, roll 1d6 for conversion</span>
              </div>
              <div className="lifelink-example clickable" onClick={() => {
                updateEffectConfig('customFormula', 'FLIP_COIN ? SOURCE_AMOUNT * 0.3 : SOURCE_AMOUNT * 0.1');
                updateEffectConfig('calculationType', 'custom_formula');
              }}>
                <code>FLIP_COIN ? SOURCE_AMOUNT * 0.3 : SOURCE_AMOUNT * 0.1</code>
                <span>Flip a coin: if heads, convert 30% of damage; if tails, convert 10%</span>
              </div>
              <div className="lifelink-example clickable" onClick={() => {
                updateEffectConfig('customFormula', 'Math.min(ROLL_1D8, SOURCE_AMOUNT / 2)');
                updateEffectConfig('calculationType', 'custom_formula');
              }}>
                <code>Math.min(ROLL_1D8, SOURCE_AMOUNT / 2)</code>
                <span>Roll 1d8, but never more than half the damage amount</span>
              </div>
              <div className="lifelink-example clickable" onClick={() => {
                updateEffectConfig('customFormula', 'DRAW_CARD > 10 ? SOURCE_AMOUNT * 0.5 : SOURCE_AMOUNT * 0.2');
                updateEffectConfig('calculationType', 'custom_formula');
              }}>
                <code>DRAW_CARD > 10 ? SOURCE_AMOUNT * 0.5 : SOURCE_AMOUNT * 0.2</code>
                <span>Draw a card: if > 10, convert 50% of damage; otherwise, convert 20%</span>
              </div>
              <div className="lifelink-example clickable" onClick={() => {
                updateEffectConfig('customFormula', 'Math.ceil(SOURCE_AMOUNT * 0.1) * ROLL_1D4');
                updateEffectConfig('calculationType', 'custom_formula');
              }}>
                <code>Math.ceil(SOURCE_AMOUNT * 0.1) * ROLL_1D4</code>
                <span>For every 10% of damage, roll 1d4 (rounded up)</span>
              </div>
            </div>

            <div className="lifelink-option">
              <label>Per Amount (for threshold formulas)</label>
              <input
                type="number"
                min="1"
                max="100"
                value={selectedEffect?.perAmount || 10}
                onChange={(e) => {
                  e.stopPropagation();
                  updateEffectConfig('perAmount', parseInt(e.target.value));
                }}
              />
            </div>

            <div className="lifelink-examples">
              <div className="lifelink-example">
                <span>Example: 30 {selectedEffect?.sourceResource || 'health'} with formula "{selectedEffect?.customFormula || 'SOURCE_AMOUNT * 0.25'}"</span>
              </div>
              <div className="lifelink-example">
                <span>Explanation: This formula determines how much of the source resource is converted to the target resource.</span>
              </div>
            </div>
          </div>

          <div className="lifelink-section">
            <h4>Additional Options</h4>
            <div className="lifelink-option">
              <label>True Damage</label>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  id={`true-damage-${effect.id}`}
                  checked={selectedEffect?.trueDamage || false}
                  onChange={(e) => {
                    e.stopPropagation();
                    updateEffectConfig('trueDamage', e.target.checked);
                  }}
                />
                <label htmlFor={`true-damage-${effect.id}`}></label>
              </div>
            </div>

            <div className="lifelink-option">
              <label>Ignore Resistances</label>
              <div className="toggle-switch">
                <input
                  type="checkbox"
                  id={`ignore-resistances-${effect.id}`}
                  checked={selectedEffect?.ignoreResistances || false}
                  onChange={(e) => {
                    e.stopPropagation();
                    updateEffectConfig('ignoreResistances', e.target.checked);
                  }}
                />
                <label htmlFor={`ignore-resistances-${effect.id}`}></label>
              </div>
            </div>

            <div className="lifelink-option">
              <label>Trigger on Damage Type</label>
              <select
                value={selectedEffect?.triggerDamageType || 'all'}
                onChange={(e) => {
                  e.stopPropagation();
                  updateEffectConfig('triggerDamageType', e.target.value);
                }}
              >
                <option value="all">All Damage</option>
                <option value="physical">Physical Only</option>
                <option value="magical">Magical Only</option>
                <option value="fire">Fire Only</option>
                <option value="cold">Cold Only</option>
                <option value="lightning">Lightning Only</option>
                <option value="acid">Acid Only</option>
                <option value="necrotic">Necrotic Only</option>
              </select>
            </div>
          </div>
        </div>

        <div className="lifelink-popup-footer">
          <button className="lifelink-popup-save" onClick={onClose}>Save Changes</button>
        </div>
      </div>
    </div>
  );
};

export default LifelinkConfigPopup;
