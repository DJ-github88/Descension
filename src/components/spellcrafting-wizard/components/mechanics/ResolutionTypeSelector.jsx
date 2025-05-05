import React from 'react';
import { FaDiceD20, FaCoins, FaClone } from 'react-icons/fa';

const ResolutionTypeSelector = ({
  selectedType,
  onTypeChange,
  config,
  onConfigChange
}) => {
  const handleDiceTypeChange = (e) => {
    onConfigChange({ diceType: e.target.value });
  };

  const handleCardCountChange = (e) => {
    onConfigChange({ cardCount: parseInt(e.target.value) });
  };

  const handleCoinCountChange = (e) => {
    onConfigChange({ coinCount: parseInt(e.target.value) });
  };

  return (
    <div className="resolution-type-selector-container">
      <div className="resolution-type-selector">
        <div className="resolution-type-option">
          <button
            className={`resolution-type-button ${selectedType === 'DICE' ? 'active' : ''}`}
            onClick={() => onTypeChange('DICE')}
          >
            <div className="resolution-type-icon">
              <FaDiceD20 />
            </div>
            <div className="resolution-type-label">Dice</div>
          </button>
        </div>

        <div className="resolution-type-option">
          <button
            className={`resolution-type-button ${selectedType === 'CARDS' ? 'active' : ''}`}
            onClick={() => onTypeChange('CARDS')}
          >
            <div className="resolution-type-icon">
              <FaClone />
            </div>
            <div className="resolution-type-label">Cards</div>
          </button>
        </div>

        <div className="resolution-type-option">
          <button
            className={`resolution-type-button ${selectedType === 'COINS' ? 'active' : ''}`}
            onClick={() => onTypeChange('COINS')}
          >
            <div className="resolution-type-icon">
              <FaCoins />
            </div>
            <div className="resolution-type-label">Coins</div>
          </button>
        </div>
      </div>

      <div className="resolution-config">
        <div className="resolution-config-title">
          Configuration
        </div>

        {selectedType === 'DICE' && (
          <div className="resolution-config-form">
            <div className="form-group">
              <label htmlFor="dice-type">Dice Type</label>
              <select
                id="dice-type"
                value={config.diceType}
                onChange={handleDiceTypeChange}
                className="wow-settings-input"
              >
                <option value="d4">d4</option>
                <option value="d6">d6</option>
                <option value="d8">d8</option>
                <option value="d10">d10</option>
                <option value="d12">d12</option>
                <option value="d20">d20</option>
                <option value="d100">d100</option>
              </select>
            </div>
          </div>
        )}

        {selectedType === 'CARDS' && (
          <div className="resolution-config-form">
            <div className="form-group">
              <label htmlFor="card-count">Number of Cards</label>
              <input
                id="card-count"
                type="number"
                min="1"
                max="10"
                value={config.cardCount}
                onChange={handleCardCountChange}
                className="wow-settings-input"
              />
            </div>
            <div className="form-group">
              <label>Deck Type</label>
              <select className="wow-settings-input">
                <option value="standard">Standard (52 cards)</option>
                <option value="tarot">Tarot (78 cards)</option>
              </select>
            </div>
          </div>
        )}

        {selectedType === 'COINS' && (
          <div className="resolution-config-form">
            <div className="form-group">
              <label htmlFor="coin-count">Number of Coins</label>
              <input
                id="coin-count"
                type="number"
                min="1"
                max="10"
                value={config.coinCount}
                onChange={handleCoinCountChange}
                className="wow-settings-input"
              />
            </div>
            <div className="form-group">
              <label>Coin Type</label>
              <select className="wow-settings-input">
                <option value="standard">Standard (Heads/Tails)</option>
                <option value="weighted">Weighted</option>
              </select>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResolutionTypeSelector;
