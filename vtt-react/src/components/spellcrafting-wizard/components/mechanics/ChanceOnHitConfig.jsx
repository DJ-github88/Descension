import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FaDiceD20, FaSkull, FaChevronUp, FaCoins, FaClone, FaBolt, FaFire, FaWind, FaWater, FaTable } from 'react-icons/fa';
import IconSelectionCard from '../common/IconSelectionCard';
import SpellLibraryButton from '../common/SpellLibraryButton';
import { useSpellLibrary } from '../../context/SpellLibraryContext';
import { LIBRARY_SPELLS } from '../../../../data/spellLibraryData';
import { useSpellWizardState } from '../../context/spellWizardContext';
import '../../styles/ChanceOnHitConfig.css';

const ChanceOnHitConfig = ({ config, onConfigChange }) => {
  // Get the spell library context
  const spellLibrary = useSpellLibrary();
  // Get the current spell wizard state to access rollable table configuration
  const wizardState = useSpellWizardState();

  // Initialize with default values if not provided
  const [procConfig, setProcConfig] = useState(() => {
    // If config is provided, use it
    if (config) return config;

    // Otherwise use default values with enabled explicitly set to false
    return {
      enabled: false,
      procType: 'dice', // 'dice', 'cards', 'coins'
      procChance: 15, // Default 15% chance
      diceThreshold: 18, // For dice: typically 18+ on d20 (15% chance)
      cardProcRule: 'face_cards', // For cards: 'face_cards', 'aces', 'specific_suit'
      coinProcRule: 'all_heads', // For coins: 'all_heads', 'sequence', 'pattern'
      coinCount: 3, // Number of coins to flip
      procSuit: 'hearts', // For card-based procs with specific suit
      spellEffect: null, // Reference to a spell from the library
      customEffects: [], // Additional custom effects
      useRollableTable: false, // Whether to use a rollable table for chance on hit effects
      rollableTableEnabled: false, // Whether the rollable table is enabled (derived from wizard state)
    };
  });

  // Check if rollable table is enabled in the wizard state
  useEffect(() => {
    if (wizardState && wizardState.rollableTable) {
      const isRollableTableEnabled = wizardState.rollableTable.enabled;
      if (procConfig.rollableTableEnabled !== isRollableTableEnabled) {
        setProcConfig(prev => ({
          ...prev,
          rollableTableEnabled: isRollableTableEnabled
        }));
      }
    }
  }, [wizardState, procConfig.rollableTableEnabled]);

  // Update parent when config changes - use ref to prevent infinite loops
  const onConfigChangeRef = useRef(onConfigChange);
  onConfigChangeRef.current = onConfigChange;

  useEffect(() => {
    if (onConfigChangeRef.current) {
      onConfigChangeRef.current(procConfig);
    }
  }, [procConfig]);

  // Handle changes to config
  const handleChange = (field, value) => {
    setProcConfig(prevConfig => {
      const newConfig = {
        ...prevConfig,
        [field]: value
      };

      // Auto-calculate proc chance based on threshold changes
      if (field === 'diceThreshold') {
        newConfig.procChance = Math.round(((21 - value) / 20) * 100);
      } else if (field === 'cardProcRule') {
        // Calculate card-based proc chances
        if (value === 'face_cards') {
          newConfig.procChance = Math.round((12 / 52) * 100); // ~23%
        } else if (value === 'aces') {
          newConfig.procChance = Math.round((4 / 52) * 100); // ~8%
        } else if (value === 'specific_suit') {
          newConfig.procChance = Math.round((13 / 52) * 100); // 25%
        } else if (value === 'red_cards') {
          newConfig.procChance = Math.round((26 / 52) * 100); // 50%
        } else if (value === 'black_cards') {
          newConfig.procChance = Math.round((26 / 52) * 100); // 50%
        } else if (value === 'pairs') {
          newConfig.procChance = Math.round((3 / 51) * 100); // ~6% (3 matching cards out of remaining 51)
        }
      } else if (field === 'coinProcRule' || field === 'coinCount') {
        // Calculate coin-based proc chances
        const coinCount = field === 'coinCount' ? value : prevConfig.coinCount;
        const procRule = field === 'coinProcRule' ? value : prevConfig.coinProcRule;

        if (procRule === 'all_heads') {
          newConfig.procChance = Math.round((1 / Math.pow(2, coinCount)) * 100);
        } else if (procRule === 'sequence') {
          newConfig.procChance = Math.round((1 / Math.pow(2, coinCount)) * 100);
        } else if (procRule === 'pattern') {
          newConfig.procChance = Math.round((1 / Math.pow(2, coinCount)) * 100);
        }
      }

      return newConfig;
    });
  };

  // Toggle rollable table selection
  const toggleRollableTable = (useTable) => {

    // Check if rollable table is configured in wizard state
    const isRollableTableConfigured = wizardState &&
                                     wizardState.rollableTable &&
                                     wizardState.rollableTable.enabled;

    // If trying to enable rollable table but none is configured, show alert
    if (useTable && !isRollableTableConfigured) {
      alert("You've selected to use a rollable table for chance on hit. Please make sure to configure and enable a rollable table in the Rollable Table step.");
    }

    // Use handleChange to ensure proper state propagation
    handleChange('useRollableTable', useTable);
    if (useTable) {
      handleChange('spellEffect', null); // Clear spell effect if switching to rollable table
    }
  };

  // We'll filter spells directly in the render method

  return (
    <div className="chance-on-hit-config section">
      <div className="config-header">
        <div className="config-toggle">
          <label className="wow-checkbox-label">
            <input
              type="checkbox"
              checked={procConfig.enabled}
              onChange={(e) => handleChange('enabled', e.target.checked)}
              className="wow-checkbox"
            />
            <span className="wow-checkbox-custom"></span>
            <span className="wow-option-text">Enable Chance on Hit Effects</span>
          </label>
          <div className="wow-option-description">
            When enabled, this spell has a chance to trigger additional effects when it hits a target
          </div>
        </div>
      </div>

      {procConfig.enabled && (
        <>
          {/* Proc Resolution Method */}
          <div className="proc-resolution-method wow-setting-section">
            <h4 className="wow-section-header">Chance Resolution Method</h4>
            <div className="resolution-options">
              <IconSelectionCard
                icon={<FaDiceD20 className="icon" />}
                title="Dice Based"
                description="Chance determined by dice rolls"
                onClick={() => handleChange('procType', 'dice')}
                selected={procConfig.procType === 'dice'}
              />
              <IconSelectionCard
                icon={<FaClone className="icon" />}
                title="Card Based"
                description="Chance determined by card draws"
                onClick={() => handleChange('procType', 'cards')}
                selected={procConfig.procType === 'cards'}
              />
              <IconSelectionCard
                icon={<FaCoins className="icon" />}
                title="Coin Based"
                description="Chance determined by coin flips"
                onClick={() => handleChange('procType', 'coins')}
                selected={procConfig.procType === 'coins'}
              />
            </div>
          </div>

          {/* Dice-based proc configuration */}
          {procConfig.procType === 'dice' && (
            <div className="dice-proc-config wow-setting-section">
              <div className="config-row">
                <div className="form-group">
                  <label>Proc Threshold</label>
                  <div className="input-with-label">
                    <input
                      type="number"
                      min="1"
                      max="20"
                      value={procConfig.diceThreshold}
                      onChange={(e) => handleChange('diceThreshold', parseInt(e.target.value))}
                    />
                    <span className="input-label">on d20</span>
                  </div>
                </div>
                <div className="form-group">
                  <label>Proc Chance</label>
                  <div className="input-with-label">
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={procConfig.procChance}
                      readOnly
                      className="readonly-input"
                    />
                    <span className="input-label">%</span>
                  </div>
                  <div className="help-text">
                    Automatically calculated from threshold ({procConfig.diceThreshold}+ on d20)
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Card-based proc configuration */}
          {procConfig.procType === 'cards' && (
            <div className="card-proc-config wow-setting-section">
              <div className="form-group">
                <label>Card Proc Rule</label>
                <select
                  value={procConfig.cardProcRule}
                  onChange={(e) => handleChange('cardProcRule', e.target.value)}
                >
                  <option value="face_cards">Face Cards (J, Q, K)</option>
                  <option value="aces">Aces</option>
                  <option value="specific_suit">Specific Suit</option>
                  <option value="red_cards">Red Cards</option>
                  <option value="black_cards">Black Cards</option>
                  <option value="pairs">Pairs</option>
                </select>
              </div>

              {procConfig.cardProcRule === 'specific_suit' && (
                <div className="form-group">
                  <label>Select Suit</label>
                  <div className="suit-selection">
                    <button
                      className={`suit-button ${procConfig.procSuit === 'hearts' ? 'selected' : ''}`}
                      onClick={() => handleChange('procSuit', 'hearts')}
                    >
                      ♥ Hearts
                    </button>
                    <button
                      className={`suit-button ${procConfig.procSuit === 'diamonds' ? 'selected' : ''}`}
                      onClick={() => handleChange('procSuit', 'diamonds')}
                    >
                      ♦ Diamonds
                    </button>
                    <button
                      className={`suit-button ${procConfig.procSuit === 'clubs' ? 'selected' : ''}`}
                      onClick={() => handleChange('procSuit', 'clubs')}
                    >
                      ♣ Clubs
                    </button>
                    <button
                      className={`suit-button ${procConfig.procSuit === 'spades' ? 'selected' : ''}`}
                      onClick={() => handleChange('procSuit', 'spades')}
                    >
                      ♠ Spades
                    </button>
                  </div>
                </div>
              )}

              <div className="form-group">
                <label>Proc Chance</label>
                <div className="input-with-label">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={procConfig.procChance}
                    readOnly
                    className="readonly-input"
                  />
                  <span className="input-label">%</span>
                </div>
                <div className="help-text">
                  Automatically calculated from card rule ({procConfig.cardProcRule.replace('_', ' ')})
                </div>
              </div>
            </div>
          )}

          {/* Coin-based proc configuration */}
          {procConfig.procType === 'coins' && (
            <div className="coin-proc-config wow-setting-section">
              <div className="form-group">
                <label>Coin Proc Rule</label>
                <select
                  value={procConfig.coinProcRule}
                  onChange={(e) => handleChange('coinProcRule', e.target.value)}
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
                  value={procConfig.coinCount}
                  onChange={(e) => handleChange('coinCount', parseInt(e.target.value))}
                />
              </div>

              <div className="form-group">
                <label>Proc Chance</label>
                <div className="input-with-label">
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={procConfig.procChance}
                    onChange={(e) => handleChange('procChance', parseInt(e.target.value))}
                  />
                  <span className="input-label">%</span>
                </div>
                <div className="help-text">
                  {procConfig.coinProcRule === 'all_heads' && `Approximately ${Math.pow(0.5, procConfig.coinCount) * 100}% chance with ${procConfig.coinCount} coins`}
                </div>
              </div>
            </div>
          )}

          {/* Chance on Hit Effect Type Selection */}
          <div className="section">
            <h3 className="section-title">Chance on Hit Effect Type</h3>
            <p>Choose how chance on hit effects are determined:</p>
            <div className="spell-wizard-card-grid">
              <div
                className={`spell-wizard-card ${!procConfig.useRollableTable ? 'selected' : ''}`}
                onClick={() => toggleRollableTable(false)}
              >
                <div className="spell-wizard-card-icon">
                  <FaBolt className="icon" />
                </div>
                <h4>Spell Effect</h4>
                <p>Trigger a specific spell on proc</p>
              </div>
              <div
                className={`spell-wizard-card ${procConfig.useRollableTable ? 'selected' : ''}`}
                onClick={() => toggleRollableTable(true)}
              >
                <div className="spell-wizard-card-icon">
                  <FaTable className="icon" />
                </div>
                <h4>Rollable Table</h4>
                <p>Use the configured rollable table on proc</p>
              </div>
            </div>
          </div>

          {/* Spell Effect Integration - show if not using rollable table */}
          {!procConfig.useRollableTable && (
            <div className="section">
              <h3 className="section-title">Chance on Hit Spell Effect</h3>
              <p>Choose a spell from your library to trigger on hit chance:</p>
              <div className="section-panel">
                <div className="section-panel-content">
                  <SpellLibraryButton
                    selectedSpellId={procConfig.spellEffect}
                    onSpellSelect={(spellId) => handleChange('spellEffect', spellId)}
                    buttonText="Select Spell from Library"
                    popupTitle="Select Spell Effect for Chance on Hit"
                    filterType="proc"
                  />
                </div>
              </div>

              {procConfig.spellEffect && (
                <div className="section-panel selected-spell-panel">
                  <div className="section-panel-header">
                    <h4>Selected Spell Effect</h4>
                  </div>
                  <div className="section-panel-content">
                    {(() => {
                      // Use the spell library context from the component scope
                      const librarySpells = spellLibrary.spells || [];
                      let spell = librarySpells.find(s => s.id === procConfig.spellEffect);

                      // If not found in the context, try to find it in the imported LIBRARY_SPELLS
                      if (!spell) {
                        spell = LIBRARY_SPELLS.find(s => s.id === procConfig.spellEffect);
                      }

                      // If still not found, try to find it in the CUSTOM_LIBRARY_SPELLS
                      if (!spell) {
                        try {
                          const { CUSTOM_LIBRARY_SPELLS } = require('../../../../data/customSpellLibraryData');
                          spell = CUSTOM_LIBRARY_SPELLS.find(s => s.id === procConfig.spellEffect);
                        } catch (error) {
                          console.error("Error loading custom spell library data:", error);
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
          {procConfig.useRollableTable && (
            <div className="section">
              <h3 className="section-title">Rollable Table on Proc</h3>

              {wizardState.rollableTable && wizardState.rollableTable.enabled ? (
                <>
                  <p>The configured rollable table will be triggered on damage proc:</p>
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

          {/* Custom Effect Selection */}
          <div className="section">
            <h3 className="section-title">Additional On-Hit Effects</h3>
            <p>Select additional effects that occur on hit:</p>
            <div className="spell-wizard-card-grid small">
              {[
                {
                  id: 'burning',
                  name: 'Burning',
                  description: 'Target burns for 1d4 damage per round for 2 rounds',
                  icon: <FaFire />
                },
                {
                  id: 'stun',
                  name: 'Stun',
                  description: 'Target is stunned for 1 round (15% chance)',
                  icon: <FaSkull />
                },
                {
                  id: 'slow',
                  name: 'Slow',
                  description: 'Target is slowed by 30% for 2 rounds',
                  icon: <FaWater />
                },
                {
                  id: 'knockback',
                  name: 'Knockback',
                  description: 'Target is pushed back 10 feet',
                  icon: <FaChevronUp />
                },
                {
                  id: 'shock',
                  name: 'Shock',
                  description: 'Target is shocked, reducing their action economy',
                  icon: <FaBolt />
                },
                {
                  id: 'disarm',
                  name: 'Disarm',
                  description: 'Target drops their weapon (10% chance)',
                  icon: <FaWind />
                }
              ].map(effect => (
                <div
                  key={effect.id}
                  className={`spell-wizard-card ${procConfig.customEffects.includes(effect.id) ? 'selected' : ''}`}
                  onClick={() => {
                    const newEffects = procConfig.customEffects.includes(effect.id)
                      ? procConfig.customEffects.filter(id => id !== effect.id)
                      : [...procConfig.customEffects, effect.id];
                    handleChange('customEffects', newEffects);
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

          {/* Selected Effects Summary */}
          {(procConfig.spellEffect || procConfig.customEffects.length > 0) && (
            <div className="section">
              <h3 className="section-title">Selected Effects Summary</h3>
              <div className="selected-effects-summary">
                {procConfig.spellEffect && (
                  <div className="selected-effect-item">
                    <strong>Spell Effect:</strong> {procConfig.spellEffect}
                  </div>
                )}
                {procConfig.customEffects.length > 0 && (
                  <div className="selected-effect-item">
                    <strong>Additional Effects:</strong> {
                      procConfig.customEffects.map(effectId => {
                        const effectNames = {
                          'burning': 'Burning',
                          'stun': 'Stun',
                          'slow': 'Slow',
                          'knockback': 'Knockback',
                          'shock': 'Shock',
                          'disarm': 'Disarm'
                        };
                        return effectNames[effectId] || effectId;
                      }).join(', ')
                    }
                  </div>
                )}
                <div className="selected-effect-item">
                  <strong>Proc Chance:</strong> {procConfig.procChance}% ({procConfig.procType === 'dice' ? `${procConfig.diceThreshold}+ on d20` : procConfig.procType})
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ChanceOnHitConfig;
