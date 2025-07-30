import React, { useState } from 'react';
import useDiceStore, { DICE_TYPES, DICE_THEMES } from '../../store/diceStore';
import useChatStore from '../../store/chatStore';
import './DiceSelectionBar.css';

const DiceSelectionBar = () => {
  const {
    selectedDice,
    selectedTheme,
    isDiceBarVisible,
    isRolling,
    addDice,
    removeDice,
    clearSelectedDice,
    setDiceQuantity,
    setTheme,
    toggleDiceBar,
    getTotalDiceCount,
    getFormattedRollString,
    startRoll,
    finishRoll
  } = useDiceStore();

  const { addNotification } = useChatStore();
  const [showThemeSelector, setShowThemeSelector] = useState(false);

  // Handle dice type button click
  const handleDiceClick = (diceType, event) => {
    if (event.shiftKey) {
      // Shift+click to remove dice
      removeDice(diceType);
    } else if (event.ctrlKey || event.metaKey) {
      // Ctrl+click to add 5 dice
      addDice(diceType, 5);
    } else {
      // Normal click to add 1 dice
      addDice(diceType);
    }
  };

  // Handle quantity input change
  const handleQuantityChange = (diceType, value) => {
    const quantity = parseInt(value) || 0;
    setDiceQuantity(diceType, quantity);
  };

  // Simulate dice roll (will be replaced with 3D physics)
  const rollDice = (diceType, quantity) => {
    const results = [];
    for (let i = 0; i < quantity; i++) {
      const value = Math.floor(Math.random() * DICE_TYPES[diceType].sides) + 1;
      results.push({
        id: `${diceType}_${i}_${Date.now()}`,
        type: diceType,
        value: value,
        sides: DICE_TYPES[diceType].sides
      });
    }
    return results;
  };

  // Handle roll button click
  const handleRoll = async () => {
    if (selectedDice.length === 0 || isRolling) return;

    // Start the roll - the 3D renderer will handle the actual rolling
    startRoll();
  };

  if (!isDiceBarVisible) {
    return (
      <div className="dice-bar-toggle collapsed">
        <button
          className="toggle-button"
          onClick={toggleDiceBar}
          title="Show Dice Bar"
        >
          🎲
        </button>
      </div>
    );
  }

  const totalDice = getTotalDiceCount();

  return (
    <div className="dice-selection-bar">
      {/* Header */}
      <div className="dice-bar-header">
        <div className="dice-bar-title">
          <span className="dice-icon">🎲</span>
          <span>Dice Roller</span>
        </div>
        <div className="dice-bar-controls">
          <button
            className="theme-button"
            onClick={() => setShowThemeSelector(!showThemeSelector)}
            title="Change Dice Theme"
          >
            🎨
          </button>
          <button
            className="toggle-button"
            onClick={toggleDiceBar}
            title="Hide Dice Bar"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Theme Selector */}
      {showThemeSelector && (
        <div className="theme-selector">
          {Object.values(DICE_THEMES).map(theme => (
            <button
              key={theme.id}
              className={`theme-option ${selectedTheme === theme.id ? 'selected' : ''}`}
              onClick={() => {
                setTheme(theme.id);
                setShowThemeSelector(false);
              }}
            >
              {theme.name}
            </button>
          ))}
        </div>
      )}

      {/* Dice Types */}
      <div className="dice-types-container">
        {Object.values(DICE_TYPES).map(diceType => {
          const selectedDiceOfType = selectedDice.find(d => d.type === diceType.id);
          const quantity = selectedDiceOfType ? selectedDiceOfType.quantity : 0;

          return (
            <div key={diceType.id} className="dice-type-group">
              <button
                className={`dice-type-button ${quantity > 0 ? 'selected' : ''}`}
                onClick={(e) => handleDiceClick(diceType.id, e)}
                style={{ '--dice-color': diceType.color }}
                title={`${diceType.name} (${diceType.sides} sides)\nClick: +1, Ctrl+Click: +5, Shift+Click: -1`}
              >
                <span className="dice-icon">{diceType.icon}</span>
                <span className="dice-name">{diceType.name}</span>
              </button>
              {quantity > 0 && (
                <div className="dice-quantity-controls">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(diceType.id, e.target.value)}
                    className="quantity-input"
                  />
                  <button
                    className="remove-dice-button"
                    onClick={() => removeDice(diceType.id, quantity)}
                    title="Remove all dice of this type"
                  >
                    ✕
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Roll Controls */}
      <div className="roll-controls">
        <div className="roll-summary">
          {selectedDice.length > 0 && (
            <span className="roll-string">
              {getFormattedRollString()} ({totalDice} dice)
            </span>
          )}
        </div>
        <div className="roll-buttons">
          <button
            className="clear-button"
            onClick={clearSelectedDice}
            disabled={selectedDice.length === 0}
            title="Clear all selected dice"
          >
            Clear
          </button>
          <button
            className={`roll-button ${isRolling ? 'rolling' : ''}`}
            onClick={handleRoll}
            disabled={selectedDice.length === 0 || isRolling}
            title="Roll selected dice"
          >
            {isRolling ? (
              <>
                <span className="rolling-icon">🎲</span>
                Rolling...
              </>
            ) : (
              <>
                <span className="roll-icon">🎲</span>
                Roll
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DiceSelectionBar;
