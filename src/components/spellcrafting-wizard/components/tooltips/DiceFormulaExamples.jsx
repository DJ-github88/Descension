import React from 'react';
import '../../styles/components.css';

const DiceFormulaExamples = () => {
  return (
    <div className="dice-formula-examples">
      <h4>Dice Formula Examples</h4>
      <div className="formula-examples-grid">
        <div className="formula-example">
          <div className="formula-name">Basic Dice</div>
          <div className="formula-code">2d6</div>
          <div className="formula-description">Roll two six-sided dice and add them together</div>
        </div>
        <div className="formula-example">
          <div className="formula-name">Shorthand Dice</div>
          <div className="formula-code">d20</div>
          <div className="formula-description">Roll one twenty-sided die (shorthand for 1d20)</div>
        </div>
        <div className="formula-example">
          <div className="formula-name">Dice with Modifier</div>
          <div className="formula-code">1d8+2</div>
          <div className="formula-description">Roll one eight-sided die and add 2</div>
        </div>
        <div className="formula-example">
          <div className="formula-name">Keep Highest</div>
          <div className="formula-code">2d4k1</div>
          <div className="formula-description">Roll two four-sided dice and keep the highest roll</div>
        </div>
        <div className="formula-example">
          <div className="formula-name">Multiple Dice Types</div>
          <div className="formula-code">1d6+1d4</div>
          <div className="formula-description">Roll one six-sided die and one four-sided die, then add them</div>
        </div>
        <div className="formula-example">
          <div className="formula-name">Negative Dice</div>
          <div className="formula-code">-1d4</div>
          <div className="formula-description">Roll one four-sided die and subtract the result</div>
        </div>
        <div className="formula-example">
          <div className="formula-name">Negative Shorthand</div>
          <div className="formula-code">-d6</div>
          <div className="formula-description">Roll one six-sided die and subtract the result</div>
        </div>
        <div className="formula-example">
          <div className="formula-name">Complex Formula</div>
          <div className="formula-code">2d6+1d4-1</div>
          <div className="formula-description">Roll two six-sided dice, add one four-sided die, then subtract 1</div>
        </div>
        <div className="formula-example">
          <div className="formula-name">Advantage (D&D)</div>
          <div className="formula-code">2d20k1</div>
          <div className="formula-description">Roll two twenty-sided dice and keep the highest (advantage)</div>
        </div>
        <div className="formula-example">
          <div className="formula-name">Disadvantage (D&D)</div>
          <div className="formula-code">2d20k1l</div>
          <div className="formula-description">Roll two twenty-sided dice and keep the lowest (disadvantage)</div>
        </div>
        <div className="formula-example">
          <div className="formula-name">Sneak Attack (D&D)</div>
          <div className="formula-code">2d6+4d6</div>
          <div className="formula-description">Weapon damage (2d6) plus sneak attack damage (4d6)</div>
        </div>
        <div className="formula-example">
          <div className="formula-name">Fireball (D&D)</div>
          <div className="formula-code">8d6</div>
          <div className="formula-description">Classic fireball spell damage</div>
        </div>
        <div className="formula-example">
          <div className="formula-name">Healing Word (D&D)</div>
          <div className="formula-code">1d4+3</div>
          <div className="formula-description">Basic healing spell with modifier</div>
        </div>
        <div className="formula-example">
          <div className="formula-name">Critical Hit (D&D)</div>
          <div className="formula-code">4d6</div>
          <div className="formula-description">Double dice on critical hit (2d6 → 4d6)</div>
        </div>
      </div>
    </div>
  );
};

export default DiceFormulaExamples;
