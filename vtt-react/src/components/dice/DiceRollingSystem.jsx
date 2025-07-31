import React, { useState, useEffect, useCallback } from 'react';
import DiceSelectionBar from './DiceSelectionBar';
import DiceRenderer from './DiceRenderer';
import DiceHistory from './DiceHistory';
import useDiceStore, { DICE_TYPES } from '../../store/diceStore';
import useChatStore from '../../store/chatStore';
import './DiceRollingSystem.css';

const DiceRollingSystem = () => {
  const {
    selectedDice,
    isRolling,
    rollResults,
    physicsSettings,
    animationSettings,
    startRoll,
    finishRoll,
    clearSelectedDice,
    getFormattedRollString
  } = useDiceStore();

  const { addNotification } = useChatStore();
  
  const [showRenderer, setShowRenderer] = useState(false);
  const [diceToRoll, setDiceToRoll] = useState([]);
  const [showResults, setShowResults] = useState(false);

  // Handle roll initiation from dice bar
  useEffect(() => {
    if (isRolling && selectedDice.length > 0) {
      setDiceToRoll([...selectedDice]);
      setShowRenderer(true);
      setShowResults(false);
    }
  }, [isRolling, selectedDice]);

  // Handle roll completion from 3D renderer
  const handleRollComplete = useCallback((results) => {
    finishRoll(results);
    
    // Show results briefly
    setShowResults(true);
    
    // Add to chat
    const rollString = getFormattedRollString();
    const total = results.reduce((sum, result) => sum + result.value, 0);
    const individualResults = results.map(r => r.value).join(', ');
    const diceBreakdown = results.reduce((acc, result) => {
      const key = result.type;
      if (!acc[key]) acc[key] = [];
      acc[key].push(result.value);
      return acc;
    }, {});

    // Format dice breakdown for chat
    const breakdownText = Object.entries(diceBreakdown)
      .map(([type, values]) => `${values.length}${type}: [${values.join(', ')}]`)
      .join(' + ');

    addNotification('social', {
      type: 'dice_roll',
      sender: 'System',
      content: `🎲 **${rollString}**: ${breakdownText} = **${total}**`,
      diceResults: results,
      rollString: rollString,
      total: total,
      timestamp: new Date().toISOString()
    });

    // Hide renderer and results after delay
    setTimeout(() => {
      setShowResults(false);
      setTimeout(() => {
        setShowRenderer(false);
        setDiceToRoll([]);
        clearSelectedDice();
      }, animationSettings.fadeOutDuration);
    }, animationSettings.settleDuration);
  }, [finishRoll, getFormattedRollString, addNotification, clearSelectedDice, animationSettings]);

  // Handle escape key to cancel rolling
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Escape' && showRenderer) {
        setShowRenderer(false);
        setShowResults(false);
        setDiceToRoll([]);
        if (isRolling) {
          finishRoll([]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showRenderer, isRolling, finishRoll]);

  return (
    <div className="dice-rolling-system">
      {/* Dice Selection Bar */}
      <DiceSelectionBar />

      {/* Dice History */}
      <DiceHistory />

      {/* 3D Dice Renderer */}
      {showRenderer && (
        <DiceRenderer
          isVisible={showRenderer}
          diceToRoll={diceToRoll}
          onRollComplete={handleRollComplete}
          physicsSettings={physicsSettings}
        />
      )}

      {/* Rolling Status Overlay */}
      {isRolling && showRenderer && !showResults && (
        <div className="dice-rolling-overlay">
          <div className="rolling-text">
            <span className="rolling-icon">🎲</span>
            <span>Rolling dice...</span>
          </div>
          <div className="rolling-subtitle">
            Press ESC to cancel
          </div>
        </div>
      )}

      {/* Results Display Overlay */}
      {showResults && rollResults.length > 0 && (
        <div className="dice-results-overlay">
          <div className="dice-results-title">
            Roll Results
          </div>
          <div className="dice-results-list">
            {rollResults.map((result, index) => (
              <div key={result.id || index} className="dice-result-item">
                <span className="dice-result-icon">
                  {DICE_TYPES[result.type]?.icon || '🎲'}
                </span>
                <span className="dice-result-value">
                  {result.value}
                </span>
              </div>
            ))}
          </div>
          <div className="dice-results-total">
            Total: {rollResults.reduce((sum, result) => sum + result.value, 0)}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiceRollingSystem;
