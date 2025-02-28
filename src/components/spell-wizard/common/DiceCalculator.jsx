import React, { useState, useEffect } from 'react';
import '../styles/spell-wizard.css'; // Updated CSS import
import '../styles/spell-wizard-layout.css'; // Layout CSS import

// Utility functions for dice calculations
const parseDiceString = (notation) => {
  if (!notation || notation.trim() === '') return null;

  // Regular expression to match dice notation (e.g., "2d6+3")
  const diceRegex = /^(\d+)d(\d+)(?:([+-])(\d+))?$/i;
  const match = notation.trim().match(diceRegex);

  if (!match) return null;

  return {
    count: parseInt(match[1], 10),
    sides: parseInt(match[2], 10),
    modifier: match[3] ? match[3] : '',
    modValue: match[4] ? parseInt(match[4], 10) : 0,
    valid: true
  };
};

const calculateDiceAverage = (dice) => {
  if (!dice || !dice.valid) return 0;

  // Average roll for a single die is (1 + sides) / 2
  const averageDieValue = (1 + dice.sides) / 2;
  const totalDiceValue = dice.count * averageDieValue;

  // Apply modifier if present
  if (dice.modifier === '+') {
    return totalDiceValue + dice.modValue;
  } else if (dice.modifier === '-') {
    return totalDiceValue - dice.modValue;
  }

  return totalDiceValue;
};

const rollDice = (dice) => {
  if (!dice || !dice.valid) return null;

  let total = 0;
  const rolls = [];

  // Roll each die
  for (let i = 0; i < dice.count; i++) {
    const roll = Math.floor(Math.random() * dice.sides) + 1;
    rolls.push(roll);
    total += roll;
  }

  // Apply modifier
  if (dice.modifier === '+') {
    total += dice.modValue;
  } else if (dice.modifier === '-') {
    total -= dice.modValue;
  }

  return {
    rolls,
    total,
    modifier: dice.modifier,
    modValue: dice.modValue
  };
};

const formatDiceString = (rollResult) => {
  if (!rollResult) return '';

  const rollsText = rollResult.rolls.join(' + ');
  
  if (rollResult.modifier) {
    return `${rollsText} ${rollResult.modifier} ${rollResult.modValue} = ${rollResult.total}`;
  }
  
  return rollResult.rolls.length > 1 ? `${rollsText} = ${rollResult.total}` : `${rollResult.total}`;
};

const COMMON_DICE = ['d4', 'd6', 'd8', 'd10', 'd12', 'd20', 'd100'];
const COMMON_COUNTS = [1, 2, 3, 4, 5, 6, 8, 10];

const DiceCalculator = ({ 
  value = '', 
  onChange = () => {},
  showPreview = true,
  showQuickSelect = true
}) => {
  const [notation, setNotation] = useState(value || '');
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [rollAnimation, setRollAnimation] = useState(false);

  useEffect(() => {
    if (!notation) {
      setPreview(null);
      setError(null);
      return;
    }

    const dice = parseDiceString(notation);
    if (!dice) {
      setError('Invalid dice notation (format: XdY+Z)');
      setPreview(null);
      return;
    }

    const average = calculateDiceAverage(dice);
    const example = rollDice(dice);
    
    setPreview({
      average: Math.round(average * 10) / 10,
      example: formatDiceString(example)
    });
    setError(null);
  }, [notation]);

  const handleNotationChange = (newNotation) => {
    setNotation(newNotation);
    
    // Only update parent if valid notation
    const dice = parseDiceString(newNotation);
    if (dice && dice.valid) {
      onChange(newNotation);
    }
  };

  const handleQuickSelect = (count, sides) => {
    const newNotation = `${count}d${sides}`;
    handleNotationChange(newNotation);
    
    // Add animation to the selected die button
    const selectedButton = document.querySelector(`.dice-button[data-dice="${count}d${sides}"]`);
    if (selectedButton) {
      selectedButton.classList.add('pulse-effect');
      setTimeout(() => {
        selectedButton.classList.remove('pulse-effect');
      }, 1000);
    }
  };

  const rollNewExample = () => {
    const dice = parseDiceString(notation);
    if (dice && dice.valid) {
      // Add roll animation
      setRollAnimation(true);
      setTimeout(() => {
        setRollAnimation(false);
        const example = rollDice(dice);
        setPreview(prev => ({
          ...prev,
          example: formatDiceString(example)
        }));
      }, 800);
    }
  };

  return (
    <div className="dice-calculator">
      <div className="input-group">
        <label htmlFor="dice-notation">Dice Notation:</label>
        <input
          id="dice-notation"
          type="text"
          value={notation}
          onChange={(e) => handleNotationChange(e.target.value)}
          placeholder="e.g. 2d6+3"
          className={`dice-input ${error ? 'error' : ''}`}
        />
        {error && <div className="error-message">{error}</div>}
      </div>

      {showQuickSelect && (
        <div className="quick-select">
          <h4>Quick Select</h4>
          <div className="dice-grid">
            {COMMON_DICE.map(die => (
              <div key={die} className="dice-column">
                <div className="die-label">{die}</div>
                {COMMON_COUNTS.map(count => (
                  <button
                    key={`${count}${die}`}
                    className="dice-button"
                    onClick={() => handleQuickSelect(count, die.substring(1))}
                    data-dice={`${count}d${die.substring(1)}`}
                  >
                    {count}
                  </button>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {showPreview && preview && (
        <div className="preview-section">
          <div className="average">
            Average: <strong>{preview.average}</strong>
          </div>
          <div className={`example ${rollAnimation ? 'pulse-effect' : ''}`}>
            Example Roll: <strong>{rollAnimation ? 'Rolling...' : preview.example}</strong>
            <button 
              className="roll-again-btn" 
              onClick={rollNewExample}
              title="Roll Again"
              disabled={rollAnimation}
            >
              🎲
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiceCalculator;