/**
 * Dice History Component
 * Displays a history of recent dice rolls
 */

import React, { useState } from 'react';
import useDiceStore, { DICE_TYPES } from '../../store/diceStore';
import './DiceHistory.css';

const DiceHistory = () => {
  const { rollHistory, clearRollHistory } = useDiceStore();
  const [isExpanded, setIsExpanded] = useState(false);

  if (!rollHistory || rollHistory.length === 0) {
    return null;
  }

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatRollEntry = (entry) => {
    if (!entry.dice || entry.dice.length === 0) return '';
    return entry.dice
      .map(d => `${d.quantity}${d.type}`)
      .join(' + ');
  };

  return (
    <div className={`dice-history ${isExpanded ? 'expanded' : 'collapsed'}`}>
      <button
        className="dice-history-toggle"
        onClick={() => setIsExpanded(!isExpanded)}
        title={isExpanded ? 'Hide History' : 'Show History'}
      >
        <span className="history-icon">📋</span>
        <span className="history-count">{rollHistory.length}</span>
      </button>

      {isExpanded && (
        <div className="dice-history-content">
          <div className="dice-history-header">
            <h3>Roll History</h3>
            <button
              className="clear-history-button"
              onClick={clearRollHistory}
              title="Clear History"
            >
              Clear
            </button>
          </div>

          <div className="dice-history-list">
            {rollHistory.map((entry, index) => (
              <div key={entry.id || index} className="dice-history-item">
                <div className="history-item-header">
                  <span className="history-time">{formatTimestamp(entry.timestamp)}</span>
                  <span className="history-roll-string">{formatRollEntry(entry)}</span>
                </div>
                
                <div className="history-results">
                  {entry.results && entry.results.map((result, resultIndex) => (
                    <span
                      key={resultIndex}
                      className="history-result"
                      title={`${result.type}: ${result.value}`}
                    >
                      {DICE_TYPES[result.type]?.icon || '🎲'} {result.value}
                    </span>
                  ))}
                  {entry.total !== undefined && (
                    <span className="history-total">
                      = {entry.total}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiceHistory;































