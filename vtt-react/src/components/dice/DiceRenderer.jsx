/**
 * Dice Renderer Component
 * Simple dice renderer
 */

import React, { useEffect } from 'react';

const DiceRenderer = ({
  isVisible,
  diceToRoll = [],
  onRollComplete,
  physicsSettings = {}
}) => {
  useEffect(() => {
    if (isVisible && diceToRoll.length > 0 && onRollComplete) {
      // Generate random results for the dice
      const results = diceToRoll.map(die => {
        const sides = parseInt(die.type.replace('d', ''));
        const value = Math.floor(Math.random() * sides) + 1;
        return {
          id: die.id,
          type: die.type,
          value: value,
          ...die
        };
      });
      
      // Call onRollComplete after a short delay
      setTimeout(() => {
        onRollComplete(results);
      }, 100);
    }
  }, [isVisible, diceToRoll, onRollComplete]);

  if (!isVisible || diceToRoll.length === 0) {
    return null;
  }

  return null;
};

export default DiceRenderer;
