import React from 'react';

const DiceCalculator = ({ diceExpression, modifier = 0 }) => {
  return (
    <div className="dice-calculator">
      <span className="dice-expression">{diceExpression}</span>
      {modifier !== 0 && (
        <span className="modifier">{modifier >= 0 ? `+${modifier}` : modifier}</span>
      )}
    </div>
  );
};

export default DiceCalculator;
