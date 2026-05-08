import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faDiceD6, faSyncAlt, faBolt } from '@fortawesome/free-solid-svg-icons';
import './ProphecyRollTable.css';

const ProphecyRollTable = ({ tableConfig, onRollComplete }) => {
  const [isRolling, setIsRolling] = useState(false);
  const [result, setResult] = useState(null);
  const [rollValue, setRollValue] = useState(null);

  if (!tableConfig || !tableConfig.rolls) return null;

  const handleRoll = () => {
    if (isRolling) return;
    
    setIsRolling(true);
    setResult(null);
    setRollValue(null);

    // Simulate a roll animation
    setTimeout(() => {
      const roll = Math.floor(Math.random() * tableConfig.rolls.length);
      const outcome = tableConfig.rolls[roll];
      
      setRollValue(outcome.roll);
      setResult(outcome.effect);
      setIsRolling(false);
      
      if (onRollComplete) {
        onRollComplete(outcome);
      }
    }, 800);
  };

  return (
    <div className="prophecy-roll-table">
      <div className="table-header">
        <span className="table-name">{tableConfig.name || 'Calamity Table'}</span>
        <button 
          className={`roll-button ${isRolling ? 'rolling' : ''}`} 
          onClick={handleRoll}
          disabled={isRolling}
        >
          <FontAwesomeIcon icon={isRolling ? faSyncAlt : faDiceD6} spin={isRolling} />
          {isRolling ? 'Consulting Fates...' : 'Roll on Table'}
        </button>
      </div>

      <div className="table-grid">
        {tableConfig.rolls.map((row, idx) => (
          <div 
            key={idx} 
            className={`table-row ${rollValue === row.roll ? 'active-result' : ''}`}
          >
            <span className="roll-val">{row.roll}</span>
            <span className="roll-effect">{row.effect}</span>
          </div>
        ))}
      </div>

      {result && !isRolling && (
        <div className="roll-result-banner">
          <FontAwesomeIcon icon={faBolt} />
          <div className="result-text">
            <strong>Outcome:</strong> {result}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProphecyRollTable;
