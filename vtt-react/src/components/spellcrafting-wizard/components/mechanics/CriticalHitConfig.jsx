import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaDiceD20, FaSkull, FaChevronUp, FaCoins, FaClone, FaBolt, FaFire, FaWind, FaWater, FaTable, FaPlus, FaTimes, FaRedo, FaSync } from 'react-icons/fa';
import IconSelectionCard from '../common/IconSelectionCard';
import SpellLibraryButton from '../common/SpellLibraryButton';
import { useSpellLibrary } from '../../context/SpellLibraryContext';
import { LIBRARY_SPELLS } from '../../../../data/spellLibraryData';
import { useSpellWizardState } from '../../context/spellWizardContext';
import '../../styles/ChanceOnHitConfig.css';

const CriticalHitConfig = ({ config, onConfigChange }) => {
  // Get the spell library context
  const spellLibrary = useSpellLibrary();
  // Get the current spell wizard state to access rollable table configuration
  const wizardState = useSpellWizardState();

  // Initialize with default values if not provided
  const [critConfig, setCritConfig] = useState(() => {
    // If config is provided, use it
    if (config) return config;

    // Otherwise use default values with enabled explicitly set to false
    return {
      enabled: false,
      critType: 'dice', // 'dice', 'cards', 'coins'
      critMultiplier: 2, // Standard is 2x damage
      critDiceOnly: false, // Whether to multiply only dice or also add modifiers
      extraDice: '', // Additional dice on crits (e.g., '2d6')
      explodingDice: false, // Whether dice explode on max value
      explodingDiceType: 'reroll_add', // 'reroll_add', 'double_value', 'add_max'
      critEffects: [], // Additional effects on crits
      cardCritRule: 'face_cards', // For cards: 'face_cards', 'aces', 'specific_suit'
      cardCritResolution: 'draw_add', // 'draw_add', 'multiply_value', 'double_damage'
      extraCardDraw: 2, // Number of extra cards to draw on crit
      coinCritRule: 'all_heads', // For coins: 'all_heads', 'sequence', 'pattern'
      coinCritResolution: 'flip_add', // 'flip_add', 'multiply_value', 'double_damage'
      extraCoinFlips: 3, // Number of extra coins to flip on crit
      coinCount: 3, // Number of coins to flip
      critSuit: 'hearts', // For card-based crits with specific suit
      spellEffect: null, // Reference to a spell from the library
      critOnlyEffect: false, // Whether the selected spell effect *only* happens on crit
      useRollableTable: false, // Whether to use a rollable table for critical hit effects
      rollableTableEnabled: false, // Whether the rollable table is enabled (derived from wizard state)
    };
  });

  // Check if rollable table is enabled in the wizard state
  useEffect(() => {
    if (wizardState && wizardState.rollableTable) {
      const isRollableTableEnabled = wizardState.rollableTable.enabled;
      if (critConfig.rollableTableEnabled !== isRollableTableEnabled) {
        setCritConfig(prev => ({
          ...prev,
          rollableTableEnabled: isRollableTableEnabled
        }));
      }
    }
  }, [wizardState, critConfig.rollableTableEnabled]);

  // Update parent when config changes - use ref to prevent infinite loops
  const onConfigChangeRef = useRef(onConfigChange);
  onConfigChangeRef.current = onConfigChange;

  useEffect(() => {
    if (onConfigChangeRef.current) {
      onConfigChangeRef.current(critConfig);
    }
  }, [critConfig]);

  // Handle changes to config
  const handleChange = (field, value) => {
    setCritConfig(prevConfig => ({
      ...prevConfig,
      [field]: value
    }));
  };

  // Toggle rollable table selection
  const toggleRollableTable = (useTable) => {
    // console.log("Toggling rollable table to:", useTable);

    // Check if rollable table is configured in wizard state
    const isRollableTableConfigured = wizardState &&
                                     wizardState.rollableTable &&
                                     wizardState.rollableTable.enabled;

    // If trying to enable rollable table but none is configured, show alert
    if (useTable && !isRollableTableConfigured) {
      alert("You've selected to use a rollable table for critical hits. Please make sure to configure and enable a rollable table in the Rollable Table step.");
    }

    // Use handleChange to ensure proper state propagation
    handleChange('useRollableTable', useTable);
    if (useTable) {
      handleChange('spellEffect', null); // Clear spell effect if switching to rollable table
    }
  };

  return (
    <div className="critical-hit-config section">
      {/* ===== SECTION 1: ENABLE TOGGLES ===== */}
      <div className="config-header">
        <h3>Critical Hit Configuration</h3>

        <div className="config-toggle">
          <label className="wow-checkbox-label">
            <input
              type="checkbox"
              checked={critConfig.enabled}
              onChange={(e) => handleChange('enabled', e.target.checked)}
              className="wow-checkbox"
            />
            <span className="wow-checkbox-custom"></span>
            <span className="wow-option-text">Enable Critical Hit Effects</span>
          </label>
          <div className="wow-option-description">
            When enabled, this spell can trigger additional effects on critical hits
          </div>
        </div>

        {critConfig.enabled && (
          <div className="crit-only-toggle">
            <div className="wow-option">
              <label className="wow-checkbox-label">
                <input
                  type="checkbox"
                  checked={critConfig.critOnlyEffect}
                  onChange={(e) => handleChange('critOnlyEffect', e.target.checked)}
                  className="wow-checkbox"
                />
                <span className="wow-checkbox-custom"></span>
                <span className="wow-option-text">Effect-Only Critical Hit</span>
              </label>
              <div className="wow-option-description">
                When enabled, critical hits will only apply additional effects without standard damage bonuses
              </div>
            </div>
          </div>
        )}
      </div>

      {critConfig.enabled && (
        <>
          {/* ===== SECTION 2: SPECIAL EFFECT RESOLUTION ===== */}
          {!critConfig.critOnlyEffect && (
            <div className="special-effects-section">
              <h4>Special Effect Resolution</h4>
              <div className="resolution-options">
                <IconSelectionCard
                  icon={<FaDiceD20 className="icon" />}
                  title="Dice Based"
                  description="Special effects determined by dice rolls"
                  onClick={() => handleChange('critType', 'dice')}
                  selected={critConfig.critType === 'dice'}
                />
                <IconSelectionCard
                  icon={<FaClone className="icon" />}
                  title="Card Based"
                  description="Special effects determined by card draws"
                  onClick={() => handleChange('critType', 'cards')}
                  selected={critConfig.critType === 'cards'}
                />
                <IconSelectionCard
                  icon={<FaCoins className="icon" />}
                  title="Coin Based"
                  description="Special effects determined by coin flips"
                  onClick={() => handleChange('critType', 'coins')}
                  selected={critConfig.critType === 'coins'}
                />
              </div>
            </div>
          )}

          {/* ===== SECTION 3: CRITICAL MULTIPLIER & DICE ===== */}
          {!critConfig.critOnlyEffect && critConfig.critType === 'dice' && (
            <div className="multiplier-section">
              <h4>Critical Multiplier & Extra Dice</h4>

              <div className="multiplier-row">
                <div className="control-group">
                  <label>Critical Multiplier</label>
                  <div className="crit-multiplier-controls">
                    <button
                      type="button"
                      className="multiplier-button"
                      onClick={() => handleChange('critMultiplier', Math.max(1, critConfig.critMultiplier - 0.5))}
                      disabled={critConfig.critMultiplier <= 1}
                    >
                      −
                    </button>
                    <div className="multiplier-display">
                      {critConfig.critMultiplier}×
                    </div>
                    <button
                      type="button"
                      className="multiplier-button"
                      onClick={() => handleChange('critMultiplier', Math.min(10, critConfig.critMultiplier + 0.5))}
                      disabled={critConfig.critMultiplier >= 10}
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label>Extra Critical Dice</label>
                  <input
                    type="text"
                    placeholder="e.g., 2d6"
                    value={critConfig.extraDice}
                    onChange={(e) => handleChange('extraDice', e.target.value)}
                  />
                </div>
              </div>

              <div className="config-toggle">
                <label className="wow-checkbox-label">
                  <input
                    type="checkbox"
                    checked={critConfig.critDiceOnly}
                    onChange={(e) => handleChange('critDiceOnly', e.target.checked)}
                    className="wow-checkbox"
                  />
                  <span className="wow-checkbox-custom"></span>
                  <span className="wow-option-text">Multiply dice only (not modifiers)</span>
                </label>
              </div>

              <div className="config-toggle">
                <label className="wow-checkbox-label">
                  <input
                    type="checkbox"
                    checked={critConfig.explodingDice}
                    onChange={(e) => handleChange('explodingDice', e.target.checked)}
                    className="wow-checkbox"
                  />
                  <span className="wow-checkbox-custom"></span>
                  <span className="wow-option-text">Exploding Dice (reroll and add when maximum value is rolled)</span>
                </label>
              </div>

              {critConfig.explodingDice && (
                <div className="exploding-dice-options">
                  <label>Exploding Dice Resolution</label>
                  <div className="resolution-options">
                    <IconSelectionCard
                      icon={<FaRedo className="icon" />}
                      title="Reroll & Add"
                      description="Reroll dice that show maximum value and add to total"
                      onClick={() => handleChange('explodingDiceType', 'reroll_add')}
                      selected={critConfig.explodingDiceType === 'reroll_add'}
                    />
                    <IconSelectionCard
                      icon={<FaTimes className="icon" />}
                      title="Double Value"
                      description="Double the value of dice that show maximum value"
                      onClick={() => handleChange('explodingDiceType', 'double_value')}
                      selected={critConfig.explodingDiceType === 'double_value'}
                    />
                    <IconSelectionCard
                      icon={<FaPlus className="icon" />}
                      title="Add Maximum"
                      description="Add the maximum possible value again for each max roll"
                      onClick={() => handleChange('explodingDiceType', 'add_max')}
                      selected={critConfig.explodingDiceType === 'add_max'}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Card-based critical configuration - only show if not in effect-only mode */}
          {!critConfig.critOnlyEffect && critConfig.critType === 'cards' && (
            <div className="card-crit-config">
              <div className="form-group">
                <label>Card Critical Rule</label>
                <select
                  value={critConfig.cardCritRule}
                  onChange={(e) => handleChange('cardCritRule', e.target.value)}
                >
                  <option value="face_cards">Face Cards (J, Q, K)</option>
                  <option value="aces">Aces</option>
                  <option value="specific_suit">Specific Suit</option>
                  <option value="red_cards">Red Cards</option>
                  <option value="black_cards">Black Cards</option>
                  <option value="pairs">Pairs</option>
                </select>
              </div>

              {critConfig.cardCritRule === 'specific_suit' && (
                <div className="form-group">
                  <label>Select Suit</label>
                  <div className="suit-selection">
                    <button
                      className={`suit-button ${critConfig.critSuit === 'hearts' ? 'selected' : ''}`}
                      onClick={() => handleChange('critSuit', 'hearts')}
                    >
                      ♥ Hearts
                    </button>
                    <button
                      className={`suit-button ${critConfig.critSuit === 'diamonds' ? 'selected' : ''}`}
                      onClick={() => handleChange('critSuit', 'diamonds')}
                    >
                      ♦ Diamonds
                    </button>
                    <button
                      className={`suit-button ${critConfig.critSuit === 'clubs' ? 'selected' : ''}`}
                      onClick={() => handleChange('critSuit', 'clubs')}
                    >
                      ♣ Clubs
                    </button>
                    <button
                      className={`suit-button ${critConfig.critSuit === 'spades' ? 'selected' : ''}`}
                      onClick={() => handleChange('critSuit', 'spades')}
                    >
                      ♠ Spades
                    </button>
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Card Special Resolution</label>
                <div className="resolution-options">
                  <IconSelectionCard
                    icon={<FaClone className="icon" />}
                    title="Draw Additional Cards"
                    description="Draw extra cards and add their values to the total"
                    onClick={() => handleChange('cardCritResolution', 'draw_add')}
                    selected={critConfig.cardCritResolution === 'draw_add'}
                  />
                  <IconSelectionCard
                    icon={<FaTimes className="icon" />}
                    title="Multiply Card Values"
                    description="Multiply the value of all cards by the multiplier"
                    onClick={() => handleChange('cardCritResolution', 'multiply_value')}
                    selected={critConfig.cardCritResolution === 'multiply_value'}
                  />
                  <IconSelectionCard
                    icon={<FaPlus className="icon" />}
                    title="Double Total Effect"
                    description="Double the final damage after all calculations"
                    onClick={() => handleChange('cardCritResolution', 'double_damage')}
                    selected={critConfig.cardCritResolution === 'double_damage'}
                  />
                </div>
              </div>

              {critConfig.cardCritResolution === 'draw_add' && (
                <div className="form-group">
                  <label>Extra Cards to Draw</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={critConfig.extraCardDraw}
                    onChange={(e) => handleChange('extraCardDraw', parseInt(e.target.value))}
                  />
                </div>
              )}

              {critConfig.cardCritResolution === 'multiply_value' && (
                <div className="form-group">
                  <label>Critical Multiplier</label>
                  <div className="input-with-label">
                    <input
                      type="number"
                      min="1"
                      max="10"
                      step="0.5"
                      value={critConfig.critMultiplier}
                      onChange={(e) => handleChange('critMultiplier', parseFloat(e.target.value))}
                    />
                    <span className="input-label">×</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Coin-based critical configuration - only show if not in effect-only mode */}
          {!critConfig.critOnlyEffect && critConfig.critType === 'coins' && (
            <div className="coin-crit-config">
              <div className="form-group">
                <label>Coin Critical Rule</label>
                <select
                  value={critConfig.coinCritRule}
                  onChange={(e) => handleChange('coinCritRule', e.target.value)}
                >
                  <option value="all_heads">All Heads</option>
                  <option value="all_tails">All Tails</option>
                  <option value="sequence">Specific Sequence</option>
                  <option value="majority">Majority (more than half)</option>
                </select>
              </div>

              <div className="form-group">
                <label>Number of Coins</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={critConfig.coinCount}
                  onChange={(e) => handleChange('coinCount', parseInt(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label>Coin Critical Resolution</label>
                <div className="resolution-options">
                  <IconSelectionCard
                    icon={<FaCoins className="icon" />}
                    title="Flip Additional Coins"
                    description="Flip extra coins and add their values to the total"
                    onClick={() => handleChange('coinCritResolution', 'flip_add')}
                    selected={critConfig.coinCritResolution === 'flip_add'}
                  />
                  <IconSelectionCard
                    icon={<FaTimes className="icon" />}
                    title="Multiply Coin Values"
                    description="Multiply the value of all coins by the multiplier"
                    onClick={() => handleChange('coinCritResolution', 'multiply_value')}
                    selected={critConfig.coinCritResolution === 'multiply_value'}
                  />
                  <IconSelectionCard
                    icon={<FaPlus className="icon" />}
                    title="Double Total Damage"
                    description="Double the final damage after all calculations"
                    onClick={() => handleChange('coinCritResolution', 'double_damage')}
                    selected={critConfig.coinCritResolution === 'double_damage'}
                  />
                </div>
              </div>

              {critConfig.coinCritResolution === 'flip_add' && (
                <div className="form-group">
                  <label>Extra Coins to Flip</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={critConfig.extraCoinFlips}
                    onChange={(e) => handleChange('extraCoinFlips', parseInt(e.target.value))}
                  />
                </div>
              )}

              {critConfig.coinCritResolution === 'multiply_value' && (
                <div className="form-group">
                  <label>Critical Multiplier</label>
                  <div className="input-with-label">
                    <input
                      type="number"
                      min="1"
                      max="10"
                      step="0.5"
                      value={critConfig.critMultiplier}
                      onChange={(e) => handleChange('critMultiplier', parseFloat(e.target.value))}
                    />
                    <span className="input-label">×</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Critical Hit Effect Type Selection */}
          <div className="section">
            <h3 className="section-title">Critical Hit Effect Type</h3>
            <p>Choose how critical hit effects are determined:</p>
            <div className="spell-wizard-card-grid">
              <div
                className={`spell-wizard-card ${!critConfig.useRollableTable ? 'selected' : ''}`}
                onClick={() => toggleRollableTable(false)}
              >
                <div className="spell-wizard-card-icon">
                  <FaBolt className="icon" />
                </div>
                <h4>Spell Effect</h4>
                <p>Trigger a specific spell on critical hit</p>
              </div>
              <div
                className={`spell-wizard-card ${critConfig.useRollableTable ? 'selected' : ''}`}
                onClick={() => toggleRollableTable(true)}
              >
                <div className="spell-wizard-card-icon">
                  <FaTable className="icon" />
                </div>
                <h4>Rollable Table</h4>
                <p>Use the configured rollable table on critical hit</p>
              </div>
            </div>
          </div>

          {/* Spell Effect Integration - show if not using rollable table */}
          {!critConfig.useRollableTable && (
            <div className="section">
              <h3 className="section-title">Critical Hit Spell Effect</h3>
              <p>Choose a spell from your library to trigger on critical hit:</p>
              <div className="section-panel">
                <div className="section-panel-content">
                  <SpellLibraryButton
                    selectedSpellId={critConfig.spellEffect}
                    onSpellSelect={(spellId) => handleChange('spellEffect', spellId)}
                    buttonText="Select Spell from Library"
                    popupTitle="Select Spell Effect for Critical Hit"
                    filterType="proc"
                  />
                </div>
              </div>

              {critConfig.spellEffect && (
                <div className="section-panel selected-spell-panel">
                  <div className="section-panel-header">
                    <h4>Selected Spell Effect</h4>
                  </div>
                  <div className="section-panel-content">
                    {(() => {
                      // Use the spell library context from the component scope
                      const librarySpells = spellLibrary.spells || [];
                      let spell = librarySpells.find(s => s.id === critConfig.spellEffect);

                      // If not found in the context, try to find it in the imported LIBRARY_SPELLS
                      if (!spell) {
                        spell = LIBRARY_SPELLS.find(s => s.id === critConfig.spellEffect);
                      }

                      // If still not found, try to find it in the CUSTOM_LIBRARY_SPELLS
                      if (!spell) {
                        try {
                          const { CUSTOM_LIBRARY_SPELLS } = require('../../../../data/customSpellLibraryData');
                          spell = CUSTOM_LIBRARY_SPELLS.find(s => s.id === critConfig.spellEffect);
                        } catch (error) {
                          // Error loading custom spell library data
                        }
                      }

                      return spell ? (
                        <div className="quantity-row">
                          <div className="quantity-info">
                            <h5>{spell.name}</h5>
                            <p>{spell.damageTypes?.[0] || spell.effectType || 'effect'}</p>
                            <p>{spell.description || 'No description available'}</p>
                          </div>
                        </div>
                      ) : 'No spell selected';
                    })()}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Rollable Table Preview - show if using rollable table */}
          {critConfig.useRollableTable && (
            <div className="section">
              <h3 className="section-title">Rollable Table on Critical Hit</h3>

              {wizardState.rollableTable && wizardState.rollableTable.enabled ? (
                <>
                  <p>The configured rollable table will be triggered on critical hit:</p>
                  <div className="section-panel">
                    <div className="section-panel-header">
                      <h4>{wizardState.rollableTable.name || 'Unnamed Table'}</h4>
                    </div>
                    <div className="section-panel-content">
                      <p>{wizardState.rollableTable.description || 'No description available'}</p>
                      <div className="quantity-row">
                        <div className="quantity-info">
                          <h5>Resolution Type</h5>
                          <p>{wizardState.rollableTable.resolutionType}</p>
                        </div>
                        <div className="quantity-info">
                          <h5>Entries</h5>
                          <p>{wizardState.rollableTable.entries?.length || 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="section-panel">
                  <div className="section-panel-content warning-panel">
                    <p className="warning-text">
                      <strong>No rollable table configured yet.</strong> Please go to the Rollable Table step to configure and enable a table.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Special Effect Selection - always show, even in effect-only mode */}
          <div className="section">
            <h3 className="section-title">Special Effects</h3>
            <p>Select additional effects that occur on special results:</p>
            <div className="spell-wizard-card-grid small">
              {[
                {
                  id: 'knockback',
                  name: 'Knockback',
                  description: 'Target is pushed back 10 feet',
                  icon: <FaChevronUp />
                },
                {
                  id: 'stun',
                  name: 'Stun',
                  description: 'Target is stunned for 1 round',
                  icon: <FaSkull />
                },
                {
                  id: 'burning',
                  name: 'Burning',
                  description: 'Target burns for 1d4 damage per round for 2 rounds',
                  icon: <FaFire />
                },
                {
                  id: 'shock',
                  name: 'Shock',
                  description: 'Target is shocked, reducing their action economy',
                  icon: <FaBolt />
                },
                {
                  id: 'freeze',
                  name: 'Freeze',
                  description: 'Target is slowed by 50% for 1 round',
                  icon: <FaWater />
                },
                {
                  id: 'disarm',
                  name: 'Disarm',
                  description: 'Target drops their weapon',
                  icon: <FaWind />
                }
              ].map(effect => (
                <div
                  key={effect.id}
                  className={`spell-wizard-card ${critConfig.critEffects.includes(effect.id) ? 'selected' : ''}`}
                  onClick={() => {
                    const newEffects = critConfig.critEffects.includes(effect.id)
                      ? critConfig.critEffects.filter(id => id !== effect.id)
                      : [...critConfig.critEffects, effect.id];
                    handleChange('critEffects', newEffects);
                  }}
                >
                  <div className="spell-wizard-card-icon">
                    {effect.icon}
                  </div>
                  <h4>{effect.name}</h4>
                  <p>{effect.description}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CriticalHitConfig;
