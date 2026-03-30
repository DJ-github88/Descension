/**
 * Enhanced Dice Roller Component
 * Roll20-like dice rolling interface with multiplayer support
 */

import React, { useState, useEffect } from 'react';
import enhancedDiceService from '../../services/enhancedDiceService';
import useGameStore from '../../store/gameStore';
import useCharacterStore from '../../store/characterStore';
// CSS will be added separately

const EnhancedDiceRoller = ({ isVisible, onClose }) => {
  const [diceNotation, setDiceNotation] = useState('1d20');
  const [modifier, setModifier] = useState(0);
  const [description, setDescription] = useState('');
  const [advantage, setAdvantage] = useState(false);
  const [disadvantage, setDisadvantage] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const [rollHistory, setRollHistory] = useState([]);
  const [isRolling, setIsRolling] = useState(false);

  const { isInMultiplayer, multiplayerSocket } = useGameStore();
  const { name: characterName } = useCharacterStore();

  useEffect(() => {
    // Initialize dice service with socket
    if (multiplayerSocket) {
      enhancedDiceService.initialize(multiplayerSocket);
    }

    // Update roll history
    setRollHistory(enhancedDiceService.getHistory());
  }, [multiplayerSocket]);

  const handleRoll = async () => {
    if (isRolling) return;

    setIsRolling(true);
    
    try {
      const rollResult = await enhancedDiceService.rollDice(diceNotation, {
        playerName: 'Player', // This would come from user auth
        characterName: characterName || null,
        rollType: 'manual',
        isPrivate,
        advantage,
        disadvantage,
        modifier,
        description
      });

      // Update local history
      setRollHistory(enhancedDiceService.getHistory());

      // Clear description after roll
      setDescription('');
      
    } catch (error) {
      console.error('Roll failed:', error);
      alert(`Roll failed: ${error.message}`);
    } finally {
      setIsRolling(false);
    }
  };

  const handleQuickRoll = (notation) => {
    setDiceNotation(notation);
    setModifier(0);
    setDescription('');
    setAdvantage(false);
    setDisadvantage(false);
  };

  const handleAdvantageChange = (hasAdvantage) => {
    setAdvantage(hasAdvantage);
    if (hasAdvantage) setDisadvantage(false);
  };

  const handleDisadvantageChange = (hasDisadvantage) => {
    setDisadvantage(hasDisadvantage);
    if (hasDisadvantage) setAdvantage(false);
  };

  const quickRolls = enhancedDiceService.getQuickRolls();

  if (!isVisible) return null;

  return (
    <div className="enhanced-dice-roller">
      <div className="dice-roller-header">
        <h2>🎲 Dice Roller</h2>
        <button className="dice-roller-close" onClick={onClose}>×</button>
      </div>

      <div className="dice-roller-content">
        {/* Main Roll Interface */}
        <div className="roll-interface">
          <div className="dice-input-group">
            <label>Dice Notation</label>
            <input
              type="text"
              value={diceNotation}
              onChange={(e) => setDiceNotation(e.target.value)}
              placeholder="e.g., 2d20, 1d8+3, 4d6kh3"
              className="dice-input"
            />
          </div>

          <div className="modifier-group">
            <label>Modifier</label>
            <input
              type="number"
              value={modifier}
              onChange={(e) => setModifier(parseInt(e.target.value) || 0)}
              className="modifier-input"
            />
          </div>

          <div className="description-group">
            <label>Description (optional)</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="e.g., Attack roll, Saving throw"
              className="description-input"
            />
          </div>

          <div className="roll-options">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={advantage}
                onChange={(e) => handleAdvantageChange(e.target.checked)}
              />
              Advantage
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={disadvantage}
                onChange={(e) => handleDisadvantageChange(e.target.checked)}
              />
              Disadvantage
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={isPrivate}
                onChange={(e) => setIsPrivate(e.target.checked)}
              />
              Private Roll (GM only)
            </label>
          </div>

          <button
            className={`roll-button ${isRolling ? 'rolling' : ''}`}
            onClick={handleRoll}
            disabled={isRolling}
          >
            {isRolling ? '🎲 Rolling...' : '🎲 Roll Dice'}
          </button>
        </div>

        {/* Quick Rolls */}
        <div className="quick-rolls">
          <h3>Quick Rolls</h3>
          <div className="quick-roll-grid">
            {Object.entries(quickRolls).map(([name, notation]) => (
              <button
                key={name}
                className="quick-roll-btn"
                onClick={() => handleQuickRoll(notation)}
                title={notation}
              >
                {name}
              </button>
            ))}
          </div>
        </div>

        {/* Roll History */}
        <div className="roll-history">
          <h3>Recent Rolls</h3>
          <div className="history-list">
            {rollHistory.slice(0, 10).map((roll) => (
              <div key={roll.id} className="history-item">
                <div className="history-header">
                  <span className="history-notation">{roll.originalNotation}</span>
                  <span className={`history-total ${roll.isCritical ? 'critical' : roll.isFumble ? 'fumble' : ''}`}>
                    {roll.finalTotal}
                  </span>
                </div>
                <div className="history-details">
                  <span className="history-breakdown">{roll.breakdown}</span>
                  {roll.description && (
                    <span className="history-description">"{roll.description}"</span>
                  )}
                </div>
                <div className="history-meta">
                  <span className="history-time">
                    {new Date(roll.timestamp).toLocaleTimeString()}
                  </span>
                  {roll.characterName && (
                    <span className="history-character">{roll.characterName}</span>
                  )}
                  {roll.isPrivate && <span className="history-private">🔒</span>}
                  {roll.advantage && <span className="history-advantage">ADV</span>}
                  {roll.disadvantage && <span className="history-disadvantage">DIS</span>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedDiceRoller;
