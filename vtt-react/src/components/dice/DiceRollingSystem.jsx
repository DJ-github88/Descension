import React, { useState, useEffect, useCallback } from 'react';
import DiceSelectionBar from './DiceSelectionBar';
import DiceRenderer from './DiceRenderer';
import useDiceStore, { DICE_TYPES } from '../../store/diceStore';
import useChatStore from '../../store/chatStore';
import useCharacterStore from '../../store/characterStore';
import useGameStore from '../../store/gameStore';
import useAuthStore from '../../store/authStore';
import { saveDiceRoll } from '../../services/firebase/diceRollHistoryService';
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
  const characterName = useCharacterStore((state) => state.name);
  const currentCharacterId = useCharacterStore((state) => state.currentCharacterId);
  const currentRoomId = useGameStore((state) => state.currentRoomId);
  const { user } = useAuthStore();
  
  const [showRenderer, setShowRenderer] = useState(false);
  const [diceToRoll, setDiceToRoll] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [showAnimation, setShowAnimation] = useState(false);
  const [currentDieIndex, setCurrentDieIndex] = useState(0);
  const [completedRolls, setCompletedRolls] = useState([]); // Array of {die, result}
  const [allResults, setAllResults] = useState([]);

  // Finish all rolls and add to chat
  const finishAllRolls = useCallback(async (results) => {
    finishRoll(results);
    // Don't hide animation - let it stay until user clicks

    // Add to chat
    const rollString = getFormattedRollString();
    const total = results.reduce((sum, result) => sum + result.value, 0);

    // Add to combat tab like chat messages
    addNotification('combat', {
      type: 'dice_roll',
      sender: characterName || 'Player',
      rollString: rollString,
      diceResults: results,
      total: total,
      timestamp: new Date().toISOString()
    });

    // Save roll to Firebase for authenticated users
    if (user && !user.isGuest && currentCharacterId) {
      try {
        const rollData = {
          dice: selectedDice,
          results: results,
          total: total,
          rollString: rollString,
          rollType: 'manual', // Could be enhanced to detect roll type
          context: null, // Could be enhanced with skill/ability context
          isPublic: true
        };

        await saveDiceRoll(user.uid, currentCharacterId, currentRoomId, rollData);
      } catch (error) {
        console.error('Failed to save dice roll to Firebase:', error);
        // Don't block the roll completion if Firebase save fails
      }
    }
  }, [finishRoll, getFormattedRollString, addNotification, characterName]);

  // Roll a single die
  const rollSingleDie = useCallback((die, index, allDice, collectedResults = []) => {
    // Generate result for this die
    const sides = parseInt(die.type.replace('d', ''));
    const value = Math.floor(Math.random() * sides) + 1;
    const result = {
      id: die.id,
      type: die.type,
      value: value,
      ...die
    };

    // Add this result to the collected results
    const updatedResults = [...collectedResults, result];

    // After animation completes (0.6s), show result
    setTimeout(() => {
      setCompletedRolls(prev => {
        const newCompleted = [...prev, { die, result }];
        
        // Move to next die
        if (index < allDice.length - 1) {
          setCurrentDieIndex(index + 1);
          setTimeout(() => {
            rollSingleDie(allDice[index + 1], index + 1, allDice, updatedResults);
          }, 200); // Small delay between dice
        } else {
          // All dice rolled, finish up - use collected results to ensure all are included
          setAllResults(updatedResults);
          setTimeout(() => {
            finishAllRolls(updatedResults);
          }, 500);
        }
        
        return newCompleted;
      });
    }, 650); // Match animation duration
  }, [finishAllRolls]);

  // Handle roll initiation from dice bar
  useEffect(() => {
    if (isRolling && selectedDice.length > 0) {
      // Expand dice to account for quantity - convert {type: 'd6', quantity: 3} to 3 separate dice
      const expandedDice = selectedDice.flatMap(die => {
        const diceArray = [];
        for (let i = 0; i < die.quantity; i++) {
          diceArray.push({
            id: `${die.id}_${i}`,
            type: die.type,
            quantity: 1 // Each individual die has quantity 1
          });
        }
        return diceArray;
      });
      setDiceToRoll(expandedDice);
      setShowRenderer(true);
      setShowResults(false);
      setShowAnimation(true);
      setCurrentDieIndex(0);
      setCompletedRolls([]);
      setAllResults([]);
      
      // Start rolling first die - pass empty array for collected results
      if (expandedDice.length > 0) {
        rollSingleDie(expandedDice[0], 0, expandedDice, []);
      }
    }
  }, [isRolling, selectedDice, rollSingleDie]);

  // Handle escape key to cancel rolling
  useEffect(() => {
    const handleKeyPress = (event) => {
      if (event.key === 'Escape' && showRenderer) {
        setShowRenderer(false);
        setShowResults(false);
        setShowAnimation(false);
        setDiceToRoll([]);
        if (isRolling) {
          finishRoll([]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showRenderer, isRolling, finishRoll]);

  // Handle reroll
  const handleReroll = useCallback(() => {
    // Reset state and start a new roll with the same dice
    setCompletedRolls([]);
    setAllResults([]);
    setCurrentDieIndex(0);
    setShowResults(false);
    
    // Start a new roll with the same selected dice
    startRoll();
  }, [startRoll]);

  // Handle click anywhere to hide animation after all dice are rolled
  useEffect(() => {
    // Only set up click handler when all dice are rolled
    if (!showAnimation || completedRolls.length < diceToRoll.length || diceToRoll.length === 0) return;

    const handleClick = (event) => {
      // Don't dismiss if clicking inside the dice selection bar, dropdown, animation, wrapper, or reroll button
      const target = event.target;
      if (target && (
        target.closest('.dice-roller-compact') ||
        target.closest('.dice-selection-bar') ||
        target.closest('.dice-dropdown') ||
        target.closest('.dice-roll-animation') ||
        target.closest('.dice-roll-wrapper') ||
        target.closest('.dice-reroll-button') ||
        target.closest('.dice-reroll-button-outside')
      )) {
        return; // Don't dismiss if clicking on dice controls, animation, wrapper, or reroll button
      }

      setShowAnimation(false);
      setTimeout(() => {
        setShowRenderer(false);
        setDiceToRoll([]);
        setCompletedRolls([]);
        setAllResults([]);
        // Don't clear selected dice - let user keep their selection for next roll
      }, animationSettings.fadeOutDuration);
    };

    // Add click listener with a small delay to avoid immediate hide on roll button click
    // Re-attach listener each time all dice are rolled (remove once: true to allow multiple clicks)
    const timeoutId = setTimeout(() => {
      document.addEventListener('click', handleClick);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener('click', handleClick);
    };
  }, [showAnimation, completedRolls.length, diceToRoll.length, animationSettings]);

  return (
    <div className="dice-rolling-system">
      {/* Dice Selection Bar */}
      <DiceSelectionBar />

      {/* Dice History - Hidden since rolls now appear in combat tab */}
      {/* <DiceHistory /> */}

      {/* Dice Renderer - Not needed anymore, we handle rolls sequentially */}

      {/* Dice Roll Animation - Shows dice rolling one by one with results */}
      {showAnimation && diceToRoll.length > 0 && (
        <div className="dice-roll-wrapper">
          <div className={`dice-roll-animation normal show`}>
            <div className="skill-roll-content">
              <div className="roll-header">
                <span className="skill-name">{getFormattedRollString() || 'Dice Roll'}</span>
              </div>
              <div className="dice-roll-sequence">
                <div className="dice-roll-sequence-content">
              {diceToRoll.map((die, index) => {
                const diceType = DICE_TYPES[die.type];
                // Custom SVG icons for d8 and d10
                const getDiceIcon = (type) => {
                  switch (type) {
                    case 'd4': return { type: 'fontawesome', value: 'fas fa-mountain' }; // Tetrahedron shape
                    case 'd6': return { type: 'fontawesome', value: 'fas fa-dice-d6' };
                    case 'd8': return { type: 'svg', value: 'd8' }; // Octahedron - custom SVG
                    case 'd10': return { type: 'svg', value: 'd10' }; // Pentagonal trapezohedron - custom SVG
                    case 'd12': return { type: 'fontawesome', value: 'fas fa-diamond' }; // Dodecahedron shape
                    case 'd20': return { type: 'fontawesome', value: 'fas fa-dice-d20' };
                    case 'd100': return { type: 'fontawesome', value: 'fas fa-dice-d20' };
                    default: return { type: 'fontawesome', value: 'fas fa-dice' };
                  }
                };
                
                const iconInfo = getDiceIcon(die.type);
                const isCurrentlyRolling = index === currentDieIndex;
                const completedRoll = completedRolls.find(cr => cr.die.id === die.id);
                const isCompleted = !!completedRoll;
                const isCrit = completedRoll && completedRoll.result.value === diceType?.sides;
                const isFail = completedRoll && completedRoll.result.value === 1;
                
                // Render dice icon based on type
                const renderDiceIcon = () => {
                  const baseStyle = {
                    color: diceType?.color || '#d4af37',
                    opacity: isCompleted && !isCrit && !isFail ? 0.6 : 1,
                    filter: isCrit 
                      ? `drop-shadow(0 0 10px ${diceType?.color || '#d4af37'}) drop-shadow(0 0 20px ${diceType?.color || '#d4af37'})` 
                      : isFail 
                      ? 'drop-shadow(0 0 10px rgba(220, 20, 60, 0.8)) drop-shadow(0 0 20px rgba(220, 20, 60, 0.6))' 
                      : 'none'
                  };
                  
                  const iconClasses = `${isCurrentlyRolling ? 'dice-icon-animated' : 'dice-icon-static'} ${isCompleted ? 'dice-icon-completed' : ''} ${isCrit ? 'dice-crit-animated' : ''} ${isFail ? 'dice-fail-animated' : ''}`;
                  
                  if (iconInfo.type === 'svg') {
                    // Custom SVG for d8 and d10
                    const svgStyle = {
                      ...baseStyle,
                      width: '40px',
                      height: '40px'
                    };
                    
                    if (iconInfo.value === 'd8') {
                      // Octahedron (d8) - two pyramids base to base, more distinctive
                      return (
                        <svg 
                          className={`dice-svg-icon ${iconClasses}`}
                          style={svgStyle}
                          viewBox="0 0 64 64"
                          xmlns="http://www.w3.org/2000/svg"
                          title={diceType?.name || die.type}
                        >
                          {/* Top pyramid - front */}
                          <polygon points="32,8 12,28 52,28" fill="currentColor" opacity="1" />
                          {/* Top pyramid - back */}
                          <polygon points="32,8 52,28 32,32 12,28" fill="currentColor" opacity="0.8" />
                          {/* Bottom pyramid - front */}
                          <polygon points="32,56 12,36 52,36" fill="currentColor" opacity="1" />
                          {/* Bottom pyramid - back */}
                          <polygon points="32,56 52,36 32,32 12,36" fill="currentColor" opacity="0.8" />
                          {/* Left side */}
                          <polygon points="32,8 12,28 32,32 12,36 32,56" fill="currentColor" opacity="0.7" />
                          {/* Right side */}
                          <polygon points="32,8 52,28 32,32 52,36 32,56" fill="currentColor" opacity="0.7" />
                          {/* Center band - makes it more recognizable as d8 */}
                          <polygon points="12,28 52,28 52,36 12,36" fill="currentColor" opacity="0.95" />
                          {/* Number label - positioned better */}
                          <text x="32" y="32" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold" opacity="0.95" stroke="rgba(0,0,0,0.5)" strokeWidth="0.5">8</text>
                        </svg>
                      );
                    } else if (iconInfo.value === 'd10') {
                      // Pentagonal trapezohedron (d10) - distinctive kite shape
                      return (
                        <svg 
                          className={`dice-svg-icon ${iconClasses}`}
                          style={svgStyle}
                          viewBox="0 0 64 64"
                          xmlns="http://www.w3.org/2000/svg"
                          title={diceType?.name || die.type}
                        >
                          {/* Top kite - front face */}
                          <polygon points="32,6 18,28 32,32 46,28" fill="currentColor" opacity="1" />
                          {/* Top kite - back face */}
                          <polygon points="32,6 46,28 32,34 18,28" fill="currentColor" opacity="0.8" />
                          {/* Bottom kite - front face */}
                          <polygon points="32,58 18,36 32,32 46,36" fill="currentColor" opacity="1" />
                          {/* Bottom kite - back face */}
                          <polygon points="32,58 46,36 32,34 18,36" fill="currentColor" opacity="0.8" />
                          {/* Left side faces */}
                          <polygon points="32,6 18,28 32,32 32,34 18,36 32,58" fill="currentColor" opacity="0.7" />
                          {/* Right side faces */}
                          <polygon points="32,6 46,28 32,32 32,34 46,36 32,58" fill="currentColor" opacity="0.7" />
                          {/* Center band */}
                          <polygon points="18,28 46,28 46,36 18,36" fill="currentColor" opacity="0.95" />
                          {/* Number label - positioned better */}
                          <text x="32" y="32" textAnchor="middle" fontSize="14" fill="white" fontWeight="bold" opacity="0.95" stroke="rgba(0,0,0,0.5)" strokeWidth="0.5">10</text>
                        </svg>
                      );
                    }
                  } else {
                    // FontAwesome icon
                    const faStyle = {
                      ...baseStyle,
                      fontSize: '40px'
                    };
                    return (
                      <i 
                        className={`${iconInfo.value} ${iconClasses}`}
                        style={faStyle}
                        title={diceType?.name || die.type}
                      />
                    );
                  }
                };
                
                // Determine if we should use compact layout (more than 4 dice)
                const useCompactLayout = diceToRoll.length > 4;
                
                return (
                  <div key={die.id} className={`dice-roll-item ${useCompactLayout ? 'dice-compact' : ''}`}>
                    <div className={`dice-roll-icon-container ${isCrit ? 'dice-crit-icon' : ''} ${isFail ? 'dice-fail-icon' : ''}`}>
                      {renderDiceIcon()}
                    </div>
                    <div className="dice-type-label">{die.type.toUpperCase()}</div>
                    {completedRoll && (
                      <div className={`dice-result-display ${isCrit ? 'dice-result-crit' : ''} ${isFail ? 'dice-result-fail' : ''}`}>
                        <span className={`dice-result-value ${isCrit ? 'dice-result-value-crit' : ''} ${isFail ? 'dice-result-value-fail' : ''}`}>
                          {completedRoll.result.value}
                          {isCrit && <span className="crit-burst">★</span>}
                          {isFail && <span className="fail-burst">✕</span>}
                        </span>
                      </div>
                    )}
                    {isCurrentlyRolling && !isCompleted && (
                      <div className="dice-rolling-text">Rolling...</div>
                    )}
                  </div>
                );
              })}
                </div>
              <div className={`dice-total-display ${completedRolls.length === diceToRoll.length ? 'show' : ''}`}>
                <span className="dice-total-label">Total:</span>
                <span className="dice-total-value">
                  {completedRolls.length === diceToRoll.length ? allResults.reduce((sum, result) => sum + result.value, 0) : '0'}
                </span>
              </div>
              </div>
            </div>
          </div>
          
          {/* Reroll Button - Outside popup, below it */}
          {completedRolls.length === diceToRoll.length && (
            <button
              className="dice-reroll-button dice-reroll-button-outside"
              onClick={(e) => {
                e.stopPropagation();
                handleReroll();
              }}
              title="Reroll dice"
            >
              <i className="fas fa-redo"></i>
              Reroll
            </button>
          )}
        </div>
      )}

      {/* Rolling Status Overlay - Fallback */}
      {isRolling && showRenderer && !showResults && !showAnimation && (
        <div className="dice-rolling-overlay">
          <div className="rolling-text">
            <span>Rolling dice...</span>
          </div>
          <div className="rolling-subtitle">
            Press ESC to cancel
          </div>
        </div>
      )}

    </div>
  );
};

export default DiceRollingSystem;
