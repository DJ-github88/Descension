import React from 'react';
import { createPortal } from 'react-dom';
import './MathHelpModal.css';

const MathHelpModal = ({ show, onHide }) => {
  const mathOperators = [
    {
      operator: '+',
      name: 'Addition',
      description: 'Adds two values together',
      example: 'strength + 5',
      result: 'If strength is 15, result is 20'
    },
    {
      operator: '-',
      name: 'Subtraction', 
      description: 'Subtracts the second value from the first',
      example: 'maxHealth - currentHealth',
      result: 'If maxHealth is 100 and currentHealth is 75, result is 25'
    },
    {
      operator: '*',
      name: 'Multiplication',
      description: 'Multiplies two values',
      example: 'intelligence * 2',
      result: 'If intelligence is 12, result is 24'
    },
    {
      operator: '/',
      name: 'Division',
      description: 'Divides the first value by the second',
      example: 'spellDamage / 3',
      result: 'If spellDamage is 30, result is 10'
    }
  ];

  const comparisonOperators = [
    {
      operator: '>',
      name: 'Greater Than',
      description: 'Returns true if first value is greater than second',
      example: 'strength > 15 ? 10 : 5',
      result: 'If strength is 18, returns 10. If strength is 12, returns 5'
    },
    {
      operator: '<',
      name: 'Less Than',
      description: 'Returns true if first value is less than second',
      example: 'currentHealth < 50 ? 20 : 0',
      result: 'If currentHealth is 30, returns 20. If currentHealth is 80, returns 0'
    },
    {
      operator: '>=',
      name: 'Greater Than or Equal',
      description: 'Returns true if first value is greater than or equal to second',
      example: 'level >= 10 ? 15 : 10',
      result: 'If level is 10 or higher, returns 15. Otherwise returns 10'
    },
    {
      operator: '<=',
      name: 'Less Than or Equal',
      description: 'Returns true if first value is less than or equal to second',
      example: 'exhaustionLevel <= 2 ? 0 : 5',
      result: 'If exhaustionLevel is 2 or less, returns 0. Otherwise returns 5'
    },
    {
      operator: '==',
      name: 'Equal To',
      description: 'Returns true if both values are equal',
      example: 'currentMana == maxMana ? 25 : 15',
      result: 'If mana is full, returns 25. Otherwise returns 15'
    }
  ];

  const conditionalOperators = [
    {
      operator: '? :',
      name: 'Ternary (If-Then-Else)',
      description: 'If condition is true, use first value, otherwise use second',
      example: 'strength > intelligence ? strength : intelligence',
      result: 'Uses whichever stat is higher'
    },
    {
      operator: '&&',
      name: 'Logical AND',
      description: 'Both conditions must be true',
      example: 'strength > 15 && agility > 12 ? 20 : 10',
      result: 'Returns 20 only if both strength > 15 AND agility > 12'
    },
    {
      operator: '||',
      name: 'Logical OR',
      description: 'At least one condition must be true',
      example: 'fireDamage > 0 || frostDamage > 0 ? 15 : 10',
      result: 'Returns 15 if you have any fire or frost damage'
    }
  ];

  const mathFunctions = [
    {
      function: 'MAX(a, b)',
      name: 'Maximum',
      description: 'Returns the larger of two values',
      example: 'MAX(strength, intelligence)',
      result: 'If strength is 15 and intelligence is 18, returns 18'
    },
    {
      function: 'MIN(a, b)',
      name: 'Minimum',
      description: 'Returns the smaller of two values',
      example: 'MIN(currentHealth, 50)',
      result: 'If currentHealth is 75, returns 50. If currentHealth is 30, returns 30'
    },
    {
      function: 'ROUND(a)',
      name: 'Round',
      description: 'Rounds to the nearest whole number',
      example: 'ROUND(intelligence / 3)',
      result: 'If intelligence is 16, result is ROUND(5.33) = 5'
    },
    {
      function: 'FLOOR(a)',
      name: 'Floor',
      description: 'Rounds down to the nearest whole number',
      example: 'FLOOR(spellDamage / 4)',
      result: 'If spellDamage is 23, result is FLOOR(5.75) = 5'
    },
    {
      function: 'CEIL(a)',
      name: 'Ceiling',
      description: 'Rounds up to the nearest whole number',
      example: 'CEIL(healingPower / 6)',
      result: 'If healingPower is 25, result is CEIL(4.17) = 5'
    }
  ];

  const complexExamples = [
    {
      name: 'Scaling Damage',
      formula: 'strength > 20 ? (strength - 20) * 2 + 15 : 15',
      explanation: 'Base 15 damage, plus 2 extra damage for each point of strength above 20'
    },
    {
      name: 'Health-Based Bonus',
      formula: 'currentHealth < (maxHealth / 2) ? 25 : 10',
      explanation: 'Deal 25 damage if below half health, otherwise 10 damage'
    },
    {
      name: 'Multi-Stat Scaling',
      formula: 'MAX(strength, intelligence) + MIN(agility, spirit)',
      explanation: 'Use your highest physical/mental stat plus your lowest utility stat'
    },
    {
      name: 'Resource Efficiency',
      formula: 'currentMana >= 50 ? spellDamage * 1.5 : spellDamage',
      explanation: 'Deal 50% more spell damage if you have at least 50 mana'
    }
  ];

  if (!show) return null;

  return createPortal(
    <div className="math-help-modal-overlay" onClick={onHide}>
      <div className="math-help-modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="math-help-modal-header">
          <h2 className="math-help-modal-title">Formula Math Guide</h2>
          <button className="math-help-modal-close" onClick={onHide}>×</button>
        </div>
        <div className="math-help-modal-body">
          <div className="math-help-content">
          
          <div className="math-section">
            <h4>Basic Math Operators</h4>
            <div className="operator-grid">
              {mathOperators.map((op, index) => (
                <div key={index} className="operator-card">
                  <div className="operator-symbol">{op.operator}</div>
                  <div className="operator-name">{op.name}</div>
                  <div className="operator-description">{op.description}</div>
                  <div className="operator-example">
                    <strong>Example:</strong> <code>{op.example}</code>
                  </div>
                  <div className="operator-result">{op.result}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="math-section">
            <h4>Comparison Operators</h4>
            <div className="operator-grid">
              {comparisonOperators.map((op, index) => (
                <div key={index} className="operator-card">
                  <div className="operator-symbol">{op.operator}</div>
                  <div className="operator-name">{op.name}</div>
                  <div className="operator-description">{op.description}</div>
                  <div className="operator-example">
                    <strong>Example:</strong> <code>{op.example}</code>
                  </div>
                  <div className="operator-result">{op.result}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="math-section">
            <h4>Conditional Logic</h4>
            <div className="operator-grid">
              {conditionalOperators.map((op, index) => (
                <div key={index} className="operator-card">
                  <div className="operator-symbol">{op.operator}</div>
                  <div className="operator-name">{op.name}</div>
                  <div className="operator-description">{op.description}</div>
                  <div className="operator-example">
                    <strong>Example:</strong> <code>{op.example}</code>
                  </div>
                  <div className="operator-result">{op.result}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="math-section">
            <h4>Math Functions</h4>
            <div className="operator-grid">
              {mathFunctions.map((func, index) => (
                <div key={index} className="operator-card">
                  <div className="operator-symbol">{func.function}</div>
                  <div className="operator-name">{func.name}</div>
                  <div className="operator-description">{func.description}</div>
                  <div className="operator-example">
                    <strong>Example:</strong> <code>{func.example}</code>
                  </div>
                  <div className="operator-result">{func.result}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="math-section">
            <h4>Complex Examples</h4>
            <div className="complex-examples">
              {complexExamples.map((example, index) => (
                <div key={index} className="complex-example-card">
                  <div className="example-name">{example.name}</div>
                  <div className="example-formula"><code>{example.formula}</code></div>
                  <div className="example-explanation">{example.explanation}</div>
                </div>
              ))}
            </div>
          </div>

          </div>
        </div>
        <div className="math-help-modal-footer">
          <button className="math-help-modal-button" onClick={onHide}>
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default MathHelpModal;
