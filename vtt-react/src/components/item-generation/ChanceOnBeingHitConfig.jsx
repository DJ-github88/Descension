import React, { useState, useEffect, useCallback } from 'react';
import { FaDiceD20, FaClone, FaCoins, FaPlus, FaTable } from 'react-icons/fa';

import InlineEffectBuilder from './InlineEffectBuilder';

/**
 * ChanceOnBeingHitConfig component
 * Configures chance-on-being-hit effects for items
 * Now uses inline effect builder instead of spell library selection
 *
 * @param {Object} props
 * @param {Object} props.config - The current configuration
 * @param {Function} props.onConfigChange - Callback when config changes
 */
const ChanceOnBeingHitConfig = ({ config, onConfigChange }) => {
  // Initialize local state from props or defaults
  const [procConfig, setProcConfig] = useState(() => {
    if (config) {
      return { ...config };
    }

    // Default values
    return {
      enabled: false,
      procType: 'dice', // 'dice', 'cards', 'coins'
      procChance: 15, // Default 15% chance
      diceThreshold: 18, // For dice: typically 18+ on d20 (15% chance)
      cardProcRule: 'face_cards', // For cards: 'face_cards', 'aces', 'specific_suit'
      coinProcRule: 'all_heads', // For coins: 'all_heads', 'sequence', 'pattern'
      coinCount: 3, // Number of coins to flip
      procSuit: 'hearts', // For card-based procs with specific suit
      // New effect-based system
      effect: null, // The inline effect configuration
      useRollableTable: false, // Whether to use a rollable table for chance on hit effects
    };
  });

  // Update parent component when local state changes - use useCallback to prevent infinite loops
  const stableOnConfigChange = useCallback(onConfigChange, []);

  useEffect(() => {
    if (stableOnConfigChange) {
      stableOnConfigChange(procConfig);
    }
  }, [procConfig, stableOnConfigChange]);

  // Handle changes to config
  const handleChange = (field, value) => {
    setProcConfig(prevConfig => ({
      ...prevConfig,
      [field]: value
    }));
  };

  // Toggle the enabled state
  const toggleEnabled = () => {
    setProcConfig(prevConfig => ({
      ...prevConfig,
      enabled: !prevConfig.enabled
    }));
  };

  // Toggle rollable table selection
  const toggleRollableTable = (useTable) => {
    setProcConfig(prevConfig => ({
      ...prevConfig,
      useRollableTable: useTable
    }));
  };

  // Handle effect changes from inline builder
  const handleEffectChange = (effect) => {
    setProcConfig(prevConfig => ({
      ...prevConfig,
      effect: effect
    }));
  };

  // Add a new effect (initialize if null)
  const handleAddEffect = () => {
    if (!procConfig.effect) {
      setProcConfig(prevConfig => ({
        ...prevConfig,
        effect: {
          effectType: 'damage',
          effectConfig: {
            formula: '1d6',
            damageType: 'fire',
            isDot: false,
            dotDuration: 3,
            targetType: 'attacker'
          }
        }
      }));
    }
  };

  // Remove the effect
  const handleRemoveEffect = () => {
    setProcConfig(prevConfig => ({
      ...prevConfig,
      effect: null
    }));
  };

  // Calculate proc chance for display
  const getProcChanceDisplay = () => {
    if (procConfig.procType === 'dice') {
      return `${Math.round(((21 - procConfig.diceThreshold) / 20) * 100)}%`;
    } else if (procConfig.procType === 'coins') {
      return `${Math.round((1 / Math.pow(2, procConfig.coinCount)) * 100)}%`;
    } else if (procConfig.procType === 'cards') {
      switch (procConfig.cardProcRule) {
        case 'face_cards': return '23%';
        case 'aces': return '8%';
        case 'specific_suit': return '25%';
        default: return '~20%';
      }
    }
    return '0%';
  };

  return (
    <>
      {/* Enable/Disable Toggle */}
      <div style={{ marginBottom: '24px', padding: '16px', background: 'rgba(45, 24, 16, 0.05)', border: '1px solid rgba(139, 69, 19, 0.2)', borderRadius: '12px' }}>
        <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
          <input
            type="checkbox"
            checked={procConfig.enabled}
            onChange={toggleEnabled}
            style={{ width: '20px', height: '20px', cursor: 'pointer', accentColor: 'var(--pf-brown-darkest)' }}
          />
          <span style={{ color: 'var(--pf-brown-darkest)', fontFamily: "'Cinzel', serif", fontWeight: '700', fontSize: '15px', letterSpacing: '1px', textTransform: 'uppercase' }}>
            Enable Chance-On-Being-Hit Effect
          </span>
        </label>
        <div style={{ color: '#8b7355', fontFamily: "'Crimson Text', serif", fontStyle: 'italic', fontSize: '14px', marginTop: '8px', paddingLeft: '32px' }}>
          When enabled, this item has a chance to trigger an effect when the wearer is hit.
        </div>
      </div>

      {procConfig.enabled && (
        <>
          {/* Proc Resolution Method */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ color: 'var(--pf-brown-darkest)', fontFamily: "'Cinzel', serif", fontWeight: '700', fontSize: '15px', letterSpacing: '1px', marginBottom: '16px', textTransform: 'uppercase' }}>Chance Resolution Method</h4>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '20px 10px',
                  background: procConfig.procType === 'dice' ? 'var(--pf-gradient-gold, linear-gradient(145deg, #f4d03f 0%, #d4af37 50%, #b8860b 100%))' : 'var(--pf-gradient-button, linear-gradient(145deg, #f8f4e6 0%, #ede4d3 50%, #e8dcc6 100%))',
                  border: `2px solid ${procConfig.procType === 'dice' ? 'var(--pf-gold-dark, #b8860b)' : 'var(--pf-brown-medium, #8B4513)'}`,
                  color: procConfig.procType === 'dice' ? 'var(--pf-brown-darkest, #2d1810)' : 'var(--pf-text-primary, #2d1810)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  boxShadow: procConfig.procType === 'dice' ? '0 4px 8px rgba(0,0,0,0.2)' : 'inset 0 2px 4px rgba(139, 69, 19, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s ease',
                  textAlign: 'center'
                }}
                onClick={() => handleChange('procType', 'dice')}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                  background: procConfig.procType === 'dice' ? 'rgba(255,255,255,0.3)' : 'rgba(139, 69, 19, 0.1)',
                  borderRadius: '50%',
                  fontSize: '24px'
                }}>
                  <FaDiceD20 />
                </div>
                <h4 style={{ fontFamily: "'Cinzel', serif", fontWeight: '700', fontSize: '15px', margin: '0 0 6px 0', textTransform: 'uppercase' }}>Dice Based</h4>
                <p style={{ fontFamily: "'Crimson Text', serif", fontSize: '13px', margin: 0, opacity: 0.8 }}>Chance determined by dice rolls</p>
              </div>

              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '20px 10px',
                  background: procConfig.procType === 'cards' ? 'var(--pf-gradient-gold, linear-gradient(145deg, #f4d03f 0%, #d4af37 50%, #b8860b 100%))' : 'var(--pf-gradient-button, linear-gradient(145deg, #f8f4e6 0%, #ede4d3 50%, #e8dcc6 100%))',
                  border: `2px solid ${procConfig.procType === 'cards' ? 'var(--pf-gold-dark, #b8860b)' : 'var(--pf-brown-medium, #8B4513)'}`,
                  color: procConfig.procType === 'cards' ? 'var(--pf-brown-darkest, #2d1810)' : 'var(--pf-text-primary, #2d1810)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  boxShadow: procConfig.procType === 'cards' ? '0 4px 8px rgba(0,0,0,0.2)' : 'inset 0 2px 4px rgba(139, 69, 19, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s ease',
                  textAlign: 'center'
                }}
                onClick={() => handleChange('procType', 'cards')}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                  background: procConfig.procType === 'cards' ? 'rgba(255,255,255,0.3)' : 'rgba(139, 69, 19, 0.1)',
                  borderRadius: '50%',
                  fontSize: '24px'
                }}>
                  <FaClone />
                </div>
                <h4 style={{ fontFamily: "'Cinzel', serif", fontWeight: '700', fontSize: '15px', margin: '0 0 6px 0', textTransform: 'uppercase' }}>Card Based</h4>
                <p style={{ fontFamily: "'Crimson Text', serif", fontSize: '13px', margin: 0, opacity: 0.8 }}>Chance determined by card draws</p>
              </div>

              <div
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  padding: '20px 10px',
                  background: procConfig.procType === 'coins' ? 'var(--pf-gradient-gold, linear-gradient(145deg, #f4d03f 0%, #d4af37 50%, #b8860b 100%))' : 'var(--pf-gradient-button, linear-gradient(145deg, #f8f4e6 0%, #ede4d3 50%, #e8dcc6 100%))',
                  border: `2px solid ${procConfig.procType === 'coins' ? 'var(--pf-gold-dark, #b8860b)' : 'var(--pf-brown-medium, #8B4513)'}`,
                  color: procConfig.procType === 'coins' ? 'var(--pf-brown-darkest, #2d1810)' : 'var(--pf-text-primary, #2d1810)',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  boxShadow: procConfig.procType === 'coins' ? '0 4px 8px rgba(0,0,0,0.2)' : 'inset 0 2px 4px rgba(139, 69, 19, 0.1), 0 2px 4px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.2s ease',
                  textAlign: 'center'
                }}
                onClick={() => handleChange('procType', 'coins')}
              >
                <div style={{
                  width: '48px',
                  height: '48px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '12px',
                  background: procConfig.procType === 'coins' ? 'rgba(255,255,255,0.3)' : 'rgba(139, 69, 19, 0.1)',
                  borderRadius: '50%',
                  fontSize: '24px'
                }}>
                  <FaCoins />
                </div>
                <h4 style={{ fontFamily: "'Cinzel', serif", fontWeight: '700', fontSize: '15px', margin: '0 0 6px 0', textTransform: 'uppercase' }}>Coin Based</h4>
                <p style={{ fontFamily: "'Crimson Text', serif", fontSize: '13px', margin: 0, opacity: 0.8 }}>Chance determined by coin flips</p>
              </div>
            </div>
          </div>

          {/* Proc Chance Configuration */}
          {procConfig.procType === 'dice' && (
            <div className="dice-config wow-setting-section">
              <h4 className="wow-section-header">Dice Configuration</h4>
              <div className="dice-threshold-config">
                <label>Threshold (d20):</label>
                <div className="threshold-input-group">
                  <button
                    className="threshold-button"
                    onClick={() => handleChange('diceThreshold', Math.max(2, procConfig.diceThreshold - 1))}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={procConfig.diceThreshold}
                    onChange={(e) => handleChange('diceThreshold', Math.max(2, Math.min(20, parseInt(e.target.value) || 0)))}
                    className="wow-input"
                    min="2"
                    max="20"
                  />
                  <button
                    className="threshold-button"
                    onClick={() => handleChange('diceThreshold', Math.min(20, procConfig.diceThreshold + 1))}
                  >
                    +
                  </button>
                </div>
                <div className="proc-chance-display">
                  Proc Chance: {Math.round(((21 - procConfig.diceThreshold) / 20) * 100)}%
                </div>
              </div>
            </div>
          )}

          {/* Card Configuration */}
          {procConfig.procType === 'cards' && (
            <div className="card-config wow-setting-section">
              <h4 className="wow-section-header">Card Configuration</h4>
              <div className="card-rule-options">
                <div className="card-rule-option">
                  <input
                    type="radio"
                    id="face_cards"
                    name="cardProcRule"
                    checked={procConfig.cardProcRule === 'face_cards'}
                    onChange={() => handleChange('cardProcRule', 'face_cards')}
                  />
                  <label htmlFor="face_cards">Face Cards (J, Q, K) - 23% chance</label>
                </div>
                <div className="card-rule-option">
                  <input
                    type="radio"
                    id="aces"
                    name="cardProcRule"
                    checked={procConfig.cardProcRule === 'aces'}
                    onChange={() => handleChange('cardProcRule', 'aces')}
                  />
                  <label htmlFor="aces">Aces Only - 8% chance</label>
                </div>
                <div className="card-rule-option">
                  <input
                    type="radio"
                    id="specific_suit"
                    name="cardProcRule"
                    checked={procConfig.cardProcRule === 'specific_suit'}
                    onChange={() => handleChange('cardProcRule', 'specific_suit')}
                  />
                  <label htmlFor="specific_suit">Specific Suit - 25% chance</label>
                </div>
              </div>

              {procConfig.cardProcRule === 'specific_suit' && (
                <div className="suit-selection">
                  <label>Select Suit:</label>
                  <div className="suit-options">
                    <div
                      className={`suit-option ${procConfig.procSuit === 'hearts' ? 'selected' : ''}`}
                      onClick={() => handleChange('procSuit', 'hearts')}
                    >
                      ♥ Hearts
                    </div>
                    <div
                      className={`suit-option ${procConfig.procSuit === 'diamonds' ? 'selected' : ''}`}
                      onClick={() => handleChange('procSuit', 'diamonds')}
                    >
                      ♦ Diamonds
                    </div>
                    <div
                      className={`suit-option ${procConfig.procSuit === 'clubs' ? 'selected' : ''}`}
                      onClick={() => handleChange('procSuit', 'clubs')}
                    >
                      ♣ Clubs
                    </div>
                    <div
                      className={`suit-option ${procConfig.procSuit === 'spades' ? 'selected' : ''}`}
                      onClick={() => handleChange('procSuit', 'spades')}
                    >
                      ♠ Spades
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Coin Configuration */}
          {procConfig.procType === 'coins' && (
            <div className="coin-config wow-setting-section">
              <h4 className="wow-section-header">Coin Configuration</h4>
              <div className="coin-rule-options">
                <div className="coin-rule-option">
                  <input
                    type="radio"
                    id="all_heads"
                    name="coinProcRule"
                    checked={procConfig.coinProcRule === 'all_heads'}
                    onChange={() => handleChange('coinProcRule', 'all_heads')}
                  />
                  <label htmlFor="all_heads">All Heads</label>
                </div>
                <div className="coin-rule-option">
                  <input
                    type="radio"
                    id="sequence"
                    name="coinProcRule"
                    checked={procConfig.coinProcRule === 'sequence'}
                    onChange={() => handleChange('coinProcRule', 'sequence')}
                  />
                  <label htmlFor="sequence">Specific Sequence</label>
                </div>
              </div>

              <div className="coin-count-config">
                <label>Number of Coins:</label>
                <div className="coin-count-input-group">
                  <button
                    className="coin-count-button"
                    onClick={() => handleChange('coinCount', Math.max(1, procConfig.coinCount - 1))}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={procConfig.coinCount}
                    onChange={(e) => handleChange('coinCount', Math.max(1, parseInt(e.target.value) || 0))}
                    className="wow-input"
                    min="1"
                  />
                  <button
                    className="coin-count-button"
                    onClick={() => handleChange('coinCount', procConfig.coinCount + 1)}
                  >
                    +
                  </button>
                </div>
                <div className="proc-chance-display">
                  Proc Chance: {Math.round((1 / Math.pow(2, procConfig.coinCount)) * 100)}%
                </div>
              </div>
            </div>
          )}

          {/* Effect Configuration - Inline Effect Builder */}
          <div className="effect-config-wrapper wow-setting-section">
            <h4 className="effect-section-header">
              <span className="effect-section-title">Triggered Effect</span>
              <span className="effect-section-chance">{getProcChanceDisplay()} chance</span>
            </h4>
            
            <div className="effect-builder-container">
              {procConfig.effect ? (
                <InlineEffectBuilder
                  effect={procConfig.effect}
                  onEffectChange={handleEffectChange}
                  onRemove={handleRemoveEffect}
                />
              ) : (
                <div className="no-effect-configured">
                  <p className="no-effect-text">No effect configured yet.</p>
                  <button 
                    className="add-effect-btn"
                    onClick={handleAddEffect}
                  >
                    <FaPlus className="icon" />
                    <span>Add Effect</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ChanceOnBeingHitConfig;
