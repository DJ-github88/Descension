import React, { useState } from 'react';
import { FaDiceD20, FaDiceD6, FaDice, FaDiceFive, FaDiceFour, FaDiceOne, FaDiceSix, FaDiceThree, FaDiceTwo } from 'react-icons/fa';
import '../../styles/DiceRollVisualizer.css';

const DiceRollVisualizer = ({ diceType = 'd20', onRoll, critThreshold = 20, critRange = 1 }) => {
  const [result, setResult] = useState(null);
  const [rolling, setRolling] = useState(false);
  const [isCritical, setIsCritical] = useState(false);

  const rollDie = () => {
    setRolling(true);

    // Simulate rolling animation
    const rollInterval = setInterval(() => {
      const sides = parseInt(diceType.substring(1));
      const roll = Math.floor(Math.random() * sides) + 1;
      setResult(roll);
    }, 50);

    // Stop after 1 second
    setTimeout(() => {
      clearInterval(rollInterval);
      setRolling(false);

      // Final roll
      const sides = parseInt(diceType.substring(1));
      const finalRoll = Math.floor(Math.random() * sides) + 1;
      setResult(finalRoll);

      // Check if critical
      const minCritValue = critThreshold - critRange + 1;
      const isCrit = finalRoll >= minCritValue && finalRoll <= critThreshold;
      setIsCritical(isCrit);

      if (onRoll) {
        onRoll(finalRoll, isCrit);
      }
    }, 1000);
  };

  const getDiceIcon = () => {
    switch (diceType) {
      case 'd4': return <FaDiceFour className="dice-icon-svg" />;
      case 'd6': return <FaDiceD6 className="dice-icon-svg" />;
      case 'd8': return <FaDiceOne className="dice-icon-svg" />;
      case 'd10': return <FaDiceTwo className="dice-icon-svg" />;
      case 'd12': return <FaDiceThree className="dice-icon-svg" />;
      case 'd20':
      default: return <FaDiceD20 className="dice-icon-svg" />;
    }
  };

  return (
    <div className={`dice-visualizer ${rolling ? 'rolling' : ''} ${isCritical ? 'critical' : ''}`}>
      <div className="dice-icon">
        {getDiceIcon()}
      </div>
      <div className="dice-result">
        {result !== null ? result : '-'}
      </div>
      <button
        className="roll-button"
        onClick={rollDie}
        disabled={rolling}
      >
        Roll {diceType.toUpperCase()}
      </button>
      {result !== null && (
        <div className="roll-status">
          {isCritical ? 'CRITICAL HIT!' : 'Normal hit'}
        </div>
      )}
    </div>
  );
};

export default DiceRollVisualizer;
