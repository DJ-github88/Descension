/**
 * Compact Dice Selection Bar
 * Single button that opens a dropdown popup
 */

import React, { useState, useEffect, useRef } from 'react';
import useDiceStore, { DICE_TYPES } from '../../store/diceStore';
import CardDrawSystem from './CardDrawSystem';
import CoinFlipSystem from './CoinFlipSystem';
import './DiceSelectionBar.css';

const DiceSelectionBar = () => {
  const {
    selectedDice,
    isRolling,
    addDice,
    removeDice,
    clearSelectedDice,
    setDiceQuantity,
    getTotalDiceCount,
    getFormattedRollString,
    startRoll
  } = useDiceStore();

  const [isOpen, setIsOpen] = useState(false);
  const [showQuickRoll, setShowQuickRoll] = useState(false);
  const [selectedOrb, setSelectedOrb] = useState(null); // 'dice', 'cards', or null
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSelectedOrb(null);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const totalDice = getTotalDiceCount();
  const rollString = getFormattedRollString();

  // Handle dice type click
  const handleDiceClick = (diceType, event) => {
    event.stopPropagation();
    if (event.shiftKey) {
      removeDice(diceType);
    } else {
      addDice(diceType);
    }
  };

  // Handle quantity change
  const handleQuantityChange = (diceType, value) => {
    const quantity = parseInt(value) || 0;
    setDiceQuantity(diceType, quantity);
  };

  // Handle roll
  const handleRoll = () => {
    if (selectedDice.length === 0 || isRolling) return;
    startRoll();
    setIsOpen(false); // Close dropdown after rolling
  };

  // Quick roll (single die)
  const handleQuickRoll = (diceType) => {
    clearSelectedDice();
    addDice(diceType, 1);
    startRoll();
    setIsOpen(false);
  };

  return (
    <div className="dice-roller-compact" ref={dropdownRef}>
      {/* Main Button */}
      <button
        className={`dice-button ${isOpen ? 'active' : ''} ${totalDice > 0 ? 'has-dice' : ''}`}
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          setIsOpen(!isOpen);
          setSelectedOrb(null);
        }}
        title={rollString ? `Roll: ${rollString}` : 'Dice Roller'}
      >
        <i className="fas fa-cog dice-button-icon"></i>
        {totalDice > 0 && (
          <span className="dice-count-badge">{totalDice}</span>
        )}
        {isRolling && <span className="rolling-indicator"></span>}
      </button>

      {/* Orb Options - Show when button is clicked */}
      {isOpen && !selectedOrb && (
        <div className="orb-container">
          {/* Dice Orb */}
          <button
            className="orb orb-dice"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedOrb('dice');
            }}
            title="Dice Roller"
          >
            <i className="fas fa-dice orb-icon"></i>
          </button>

          {/* Cards Orb */}
          <button
            className="orb orb-cards"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedOrb('cards');
            }}
            title="Card Draw"
          >
            <span className="orb-icon">♠</span>
          </button>

          {/* Coin Orb */}
          <button
            className="orb orb-coin"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedOrb('coin');
            }}
            title="Coin Flip"
          >
            <i className="fas fa-coins orb-icon"></i>
          </button>
        </div>
      )}

      {/* Dice Dropdown - Show when dice orb is selected */}
      {isOpen && selectedOrb === 'dice' && (
        <div className="dice-dropdown">
          {/* Header */}
          <div className="dice-dropdown-header">
            <span className="dice-dropdown-title">Dice Roller</span>
            {totalDice > 0 && (
              <button
                className="clear-all-button"
                onClick={clearSelectedDice}
                title="Clear all"
              >
                ×
              </button>
            )}
          </div>

          {/* Quick Roll Buttons */}
          <div className="quick-roll-section">
            <div className="quick-roll-label">Quick Roll:</div>
            <div className="quick-roll-buttons">
              {Object.values(DICE_TYPES).slice(0, 6).map(diceType => (
                <button
                  key={diceType.id}
                  className="quick-roll-button"
                  onClick={() => handleQuickRoll(diceType.id)}
                  disabled={isRolling}
                  title={`Quick roll ${diceType.name}`}
                >
                  {diceType.name}
                </button>
              ))}
            </div>
          </div>

          {/* Dice Selection */}
          <div className="dice-selection-section">
            <div className="dice-selection-label">Select Dice:</div>
            <div className="dice-grid">
              {Object.values(DICE_TYPES).map(diceType => {
                const selectedDiceOfType = selectedDice.find(d => d.type === diceType.id);
                const quantity = selectedDiceOfType ? selectedDiceOfType.quantity : 0;

                return (
                  <div key={diceType.id} className="dice-item">
                    <button
                      className={`dice-select-button ${quantity > 0 ? 'selected' : ''}`}
                      onClick={(e) => handleDiceClick(diceType.id, e)}
                      style={{ '--dice-color': diceType.color }}
                      title={`${diceType.name} (${diceType.sides} sides)`}
                    >
                      {diceType.name}
                    </button>
                    {quantity > 0 && (
                      <div className="dice-quantity-control">
                        <button
                          className="quantity-decrement"
                          onClick={() => removeDice(diceType.id)}
                          title="Decrease"
                        >
                          −
                        </button>
                        <input
                          type="number"
                          min="0"
                          max="20"
                          value={quantity}
                          onChange={(e) => handleQuantityChange(diceType.id, e.target.value)}
                          className="quantity-input"
                        />
                        <button
                          className="quantity-increment"
                          onClick={() => addDice(diceType.id)}
                          title="Increase"
                        >
                          +
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Roll Summary & Button */}
          {totalDice > 0 && (
            <div className="roll-summary-section">
              <div className="roll-summary-text">
                <strong>{rollString}</strong>
                <span className="roll-total-label">({totalDice} dice)</span>
              </div>
              <button
                className="roll-button"
                onClick={handleRoll}
                disabled={isRolling}
              >
                {isRolling ? 'Rolling...' : 'Roll'}
              </button>
            </div>
          )}
        </div>
      )}

      {/* Cards Dropdown - Show when cards orb is selected */}
      {isOpen && selectedOrb === 'cards' && (
        <div className="dice-dropdown dice-dropdown-cards">
          <div className="dice-dropdown-header">
            <span className="dice-dropdown-title">Card Draw</span>
            <button
              className="clear-all-button"
              onClick={() => setSelectedOrb(null)}
              title="Back"
            >
              ←
            </button>
          </div>
          {/* Card draw component */}
          <CardDrawSystem />
        </div>
      )}

      {/* Coin Dropdown - Show when coin orb is selected */}
      {isOpen && selectedOrb === 'coin' && (
        <div className="dice-dropdown">
          <div className="dice-dropdown-header">
            <span className="dice-dropdown-title">Coin Flip</span>
            <button
              className="clear-all-button"
              onClick={() => setSelectedOrb(null)}
              title="Back"
            >
              ←
            </button>
          </div>
          {/* Coin flip component */}
          <CoinFlipSystem />
        </div>
      )}
    </div>
  );
};

export default DiceSelectionBar;
