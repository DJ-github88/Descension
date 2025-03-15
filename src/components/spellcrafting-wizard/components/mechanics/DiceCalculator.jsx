import React, { useState, useEffect } from 'react';
import { 
  parseDiceNotation, 
  isValidDiceNotation, 
  getMinRoll, 
  getMaxRoll, 
  getAverageRoll,
  getDiceVisualizationData,
  DICE_TYPES,
  MATH_FUNCTIONS
} from '../../core/mechanics/diceSystem';
import '../../styles/DiceCalculator.css';

const DiceCalculator = ({ 
  initialFormula = '1d6', 
  onChange, 
  showDistribution = false,
  showPresets = true,
  allowAdvanced = true,
  label = 'Dice Formula'
}) => {
  // State for the current formula
  const [formula, setFormula] = useState(initialFormula);
  const [inputValue, setInputValue] = useState(initialFormula);
  const [isValid, setIsValid] = useState(true);
  const [stats, setStats] = useState({
    min: 0,
    max: 0,
    avg: 0
  });

  // UI state for dice builder
  const [diceCount, setDiceCount] = useState(1);
  const [diceSides, setDiceSides] = useState(6);
  const [modifier, setModifier] = useState(0);
  const [advanced, setAdvanced] = useState({
    advantage: false,
    disadvantage: false,
    keepHighest: false,
    keepHighestValue: 1,
    exploding: false
  });
  
  // State for complex formula builder
  const [showComplexBuilder, setShowComplexBuilder] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState('');
  const [complexFormula, setComplexFormula] = useState('');

  // Presets for common patterns
  const presets = [
    { name: 'Minor', formula: '1d4' },
    { name: 'Basic', formula: '1d6' },
    { name: 'Medium', formula: '2d6' },
    { name: 'Strong', formula: '2d8' },
    { name: 'Major', formula: '4d6' },
    { name: 'Powerful', formula: '6d8' },
    { name: 'Devastating', formula: '8d10' }
  ];
  
  // Available math functions
  const availableFunctions = Object.keys(MATH_FUNCTIONS).map(func => ({
    id: func,
    name: func.charAt(0).toUpperCase() + func.slice(1),
    description: MATH_FUNCTIONS[func].description
  }));

  // Calculate stats whenever formula changes
  useEffect(() => {
    if (isValidDiceNotation(formula)) {
      setStats({
        min: getMinRoll(formula),
        max: getMaxRoll(formula),
        avg: getAverageRoll(formula)
      });
      
      // Call onChange handler
      if (onChange) {
        onChange(formula);
      }
    }
  }, [formula, onChange]);

  // Initialize component with parsed initialFormula
  useEffect(() => {
    setFormula(initialFormula);
    setInputValue(initialFormula);
    
    if (isValidDiceNotation(initialFormula)) {
      const parsed = parseDiceNotation(initialFormula);
      if (parsed && parsed.type === 'basic') {
        setDiceCount(parsed.count);
        setDiceSides(parsed.sides);
        setModifier(parsed.modifier || 0);
      } else if (parsed && parsed.type === 'function') {
        setSelectedFunction(parsed.function);
        setComplexFormula(parsed.arguments.original);
        setShowComplexBuilder(true);
      }
    }
  }, [initialFormula]);

  // Handle direct formula input
  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    
    if (isValidDiceNotation(value)) {
      setIsValid(true);
      setFormula(value);
      
      // Update UI state based on the parsed formula
      const parsed = parseDiceNotation(value);
      if (parsed && parsed.type === 'basic') {
        setDiceCount(parsed.count);
        setDiceSides(parsed.sides);
        setModifier(parsed.modifier || 0);
        setShowComplexBuilder(false);
      } else if (parsed && parsed.type === 'function') {
        setSelectedFunction(parsed.function);
        setComplexFormula(parsed.arguments.original);
        setShowComplexBuilder(true);
      }
    } else {
      setIsValid(false);
    }
  };

  // Build formula from UI components
  const buildFormulaFromUI = () => {
    if (showComplexBuilder && selectedFunction) {
      return `${selectedFunction}(${complexFormula})`;
    }
    
    let newFormula = `${diceCount}d${diceSides}`;
    
    // Add any advanced options
    if (advanced.keepHighest) {
      newFormula += `k${advanced.keepHighestValue}`;
    }
    
    // Add modifier
    if (modifier !== 0) {
      newFormula += modifier > 0 ? `+${modifier}` : modifier;
    }
    
    // Apply advantage/disadvantage/exploding
    if (advanced.advantage) {
      newFormula = `advantage(${newFormula})`;
    } else if (advanced.disadvantage) {
      newFormula = `disadvantage(${newFormula})`;
    } else if (advanced.exploding) {
      newFormula = `${diceCount}d${diceSides}!${modifier !== 0 ? (modifier > 0 ? '+' + modifier : modifier) : ''}`;
    }
    
    return newFormula;
  };

  // Handle UI component changes
  const handleDiceCountChange = (e) => {
    const count = parseInt(e.target.value) || 1;
    setDiceCount(Math.max(1, Math.min(100, count)));
  };

  const handleDiceSidesChange = (sides) => {
    setDiceSides(sides);
  };

  const handleModifierChange = (e) => {
    const mod = parseInt(e.target.value) || 0;
    setModifier(mod);
  };

  const handleAdvancedChange = (option, value) => {
    setAdvanced(prev => {
      // For advantage/disadvantage, ensure they're mutually exclusive
      if (option === 'advantage' && value === true) {
        return { ...prev, [option]: value, disadvantage: false };
      } else if (option === 'disadvantage' && value === true) {
        return { ...prev, [option]: value, advantage: false };
      }
      return { ...prev, [option]: value };
    });
  };
  
  // Handle complex formula changes
  const handleFunctionChange = (e) => {
    setSelectedFunction(e.target.value);
  };
  
  const handleComplexFormulaChange = (e) => {
    setComplexFormula(e.target.value);
  };
  
  const toggleComplexBuilder = () => {
    setShowComplexBuilder(!showComplexBuilder);
  };

  // Apply UI changes to formula
  const applyUIChanges = () => {
    const newFormula = buildFormulaFromUI();
    setInputValue(newFormula);
    setFormula(newFormula);
  };

  // Effect to update formula when UI values change
  useEffect(() => {
    applyUIChanges();
  }, [diceCount, diceSides, modifier, advanced, selectedFunction, complexFormula, showComplexBuilder]);

  // Apply a preset
  const applyPreset = (preset) => {
    setInputValue(preset.formula);
    setFormula(preset.formula);
    
    // Update UI to match preset
    const parsed = parseDiceNotation(preset.formula);
    if (parsed && parsed.type === 'basic') {
      setDiceCount(parsed.count);
      setDiceSides(parsed.sides);
      setModifier(parsed.modifier || 0);
      setShowComplexBuilder(false);
      
      // Reset advanced options
      setAdvanced({
        advantage: false,
        disadvantage: false,
        keepHighest: false,
        keepHighestValue: 1,
        exploding: false
      });
    }
  };
  
  // Get description for a math function
  function getFunctionDescription(funcName) {
    return MATH_FUNCTIONS[funcName]?.description || 'Applies a mathematical function';
  }

  // Render distribution chart if enabled
  const renderDistribution = () => {
    if (!showDistribution || !isValid) return null;
    
    const vizData = getDiceVisualizationData(formula);
    if (!vizData) return null;
    
    return (
      <div className="dice-calculator-distribution">
        <h4>Probability Distribution</h4>
        <div className="dice-distribution-chart">
          {vizData.distribution.map((prob, value) => (
            <div 
              key={value} 
              className="dice-distribution-bar"
              style={{ 
                height: `${prob * 100}%`,
                backgroundColor: value === vizData.median ? 'var(--wizard-accent)' : 'var(--wizard-secondary)'
              }}
              title={`${value}: ${(prob * 100).toFixed(1)}%`}
            />
          ))}
        </div>
        <div className="dice-distribution-stats">
          <div>Min: {vizData.min}</div>
          <div>Avg: {vizData.avg.toFixed(1)}</div>
          <div>Max: {vizData.max}</div>
        </div>
      </div>
    );
  };

  return (
    <div className="dice-calculator">
      <div className="dice-calculator-header">
        <label htmlFor="diceFormula" className="dice-calculator-label">{label}</label>
        <div className="dice-calculator-input-group">
          <input
            id="diceFormula"
            type="text"
            className={`dice-calculator-input ${!isValid ? 'dice-calculator-input-error' : ''}`}
            value={inputValue}
            onChange={handleInputChange}
            placeholder="e.g., 2d6+3 or floor(2d8/2)"
          />
          {!isValid && <div className="dice-calculator-error">Invalid formula</div>}
        </div>
      </div>
      
      <div className="dice-calculator-stats">
        <div className="dice-stat">
          <span className="dice-stat-label">Min:</span>
          <span className="dice-stat-value">{isValid ? stats.min : '-'}</span>
        </div>
        <div className="dice-stat">
          <span className="dice-stat-label">Avg:</span>
          <span className="dice-stat-value">{isValid ? stats.avg.toFixed(1) : '-'}</span>
        </div>
        <div className="dice-stat">
          <span className="dice-stat-label">Max:</span>
          <span className="dice-stat-value">{isValid ? stats.max : '-'}</span>
        </div>
      </div>
      
      {showPresets && (
        <div className="dice-calculator-presets">
          <div className="dice-presets-label">Presets:</div>
          <div className="dice-presets-buttons">
            {presets.map(preset => (
              <button
                key={preset.name}
                className="dice-preset-button"
                onClick={() => applyPreset(preset)}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {allowAdvanced && (
        <div className="dice-calculator-builder">
          <div className="dice-builder-header">
            <h4>Dice Builder</h4>
            <button 
              className={`dice-builder-toggle ${showComplexBuilder ? 'active' : ''}`}
              onClick={toggleComplexBuilder}
            >
              {showComplexBuilder ? 'Basic' : 'Advanced'}
            </button>
          </div>
          
          {!showComplexBuilder ? (
            <div className="dice-builder-basic">
              <div className="dice-builder-row">
                <div className="dice-builder-group">
                  <label>Dice Count</label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={diceCount}
                    onChange={handleDiceCountChange}
                  />
                </div>
                
                <div className="dice-builder-group">
                  <label>Dice Type</label>
                  <div className="dice-type-buttons">
                    {DICE_TYPES.standard.map(sides => (
                      <button
                        key={sides}
                        className={`dice-type-button ${diceSides === sides ? 'active' : ''}`}
                        onClick={() => handleDiceSidesChange(sides)}
                      >
                        d{sides}
                      </button>
                    ))}
                    <button
                      className="dice-type-button custom"
                      onClick={() => {
                        const sides = prompt('Enter custom dice sides (2-1000):', diceSides);
                        const parsedSides = parseInt(sides, 10);
                        if (!isNaN(parsedSides) && parsedSides >= 2 && parsedSides <= 1000) {
                          handleDiceSidesChange(parsedSides);
                        }
                      }}
                    >
                      d?
                    </button>
                  </div>
                </div>
                
                <div className="dice-builder-group">
                  <label>Modifier</label>
                  <input
                    type="number"
                    value={modifier}
                    onChange={handleModifierChange}
                  />
                </div>
              </div>
              
              <div className="dice-builder-advanced-options">
                <div className="dice-advanced-option">
                  <label>
                    <input
                      type="checkbox"
                      checked={advanced.advantage}
                      onChange={(e) => handleAdvancedChange('advantage', e.target.checked)}
                    />
                    Advantage
                  </label>
                </div>
                
                <div className="dice-advanced-option">
                  <label>
                    <input
                      type="checkbox"
                      checked={advanced.disadvantage}
                      onChange={(e) => handleAdvancedChange('disadvantage', e.target.checked)}
                    />
                    Disadvantage
                  </label>
                </div>
                
                <div className="dice-advanced-option">
                  <label>
                    <input
                      type="checkbox"
                      checked={advanced.keepHighest}
                      onChange={(e) => handleAdvancedChange('keepHighest', e.target.checked)}
                    />
                    Keep Highest
                  </label>
                  {advanced.keepHighest && (
                    <input
                      type="number"
                      min="1"
                      max={diceCount}
                      value={advanced.keepHighestValue}
                      onChange={(e) => handleAdvancedChange('keepHighestValue', parseInt(e.target.value, 10) || 1)}
                      className="dice-keep-input"
                    />
                  )}
                </div>
                
                <div className="dice-advanced-option">
                  <label>
                    <input
                      type="checkbox"
                      checked={advanced.exploding}
                      onChange={(e) => handleAdvancedChange('exploding', e.target.checked)}
                    />
                    Exploding Dice
                  </label>
                </div>
              </div>
            </div>
          ) : (
            <div className="dice-builder-complex">
              <div className="dice-builder-row">
                <div className="dice-builder-group dice-function-select">
                  <label>Function</label>
                  <select value={selectedFunction} onChange={handleFunctionChange}>
                    <option value="">Select a function</option>
                    {availableFunctions.map(func => (
                      <option key={func.id} value={func.id}>{func.name}</option>
                    ))}
                  </select>
                  {selectedFunction && (
                    <small className="dice-function-description">
                      {getFunctionDescription(selectedFunction)}
                    </small>
                  )}
                </div>
              </div>
              
              <div className="dice-builder-row">
                <div className="dice-builder-group dice-complex-formula">
                  <label>Inner Formula</label>
                  <input
                    type="text"
                    value={complexFormula}
                    onChange={handleComplexFormulaChange}
                    placeholder="e.g., 2d8+4 or 3d6/2"
                  />
                  <small className="dice-complex-help">
                    Enter the formula to apply the function to
                  </small>
                </div>
              </div>
              
              <div className="dice-complex-examples">
                <h5>Examples:</h5>
                <ul>
                  <li><code>floor(2d8/2)</code> - Roll 2d8, divide by 2, round down</li>
                  <li><code>ceil(3d6*1.5)</code> - Roll 3d6, multiply by 1.5, round up</li>
                  <li><code>max(1d20, 1d20)</code> - Roll 1d20 twice, take the higher result</li>
                  <li><code>min(1d20, 10)</code> - Roll 1d20, but cap at 10</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      )}
      
      {renderDistribution()}
    </div>
  );
};

export default DiceCalculator;