import React, { useState, useEffect } from 'react';
import { useSpellWizardState, useSpellWizardDispatch, actionCreators } from '../../context/spellWizardContext';
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
import { getDiceForEffect, getScaledDice, getEffectDiceDescription, DICE_PRESETS } from '../../core/mechanics/resolutionMechanics';
import '../../styles/DiceCalculator.css';

const DiceCalculator = ({ 
  effectType, 
  effectId,
  initialFormula = '',
  onChange, 
  showDistribution = false
}) => {
  const state = useSpellWizardState();
  const dispatch = useSpellWizardDispatch();
  
  // Get existing formula from context if available
  const existingFormula = state.effectResolutions?.[effectId]?.formula;
  
  // Local state for the calculator
  const [formula, setFormula] = useState(existingFormula || initialFormula || getDiceForEffect(effectType));
  const [stats, setStats] = useState({
    min: 0,
    max: 0,
    average: 0,
    isValid: false
  });
  const [previewLevel, setPreviewLevel] = useState(state.level || 1);
  const [showPresets, setShowPresets] = useState(false);
  
  // Calculate stats when formula changes
  useEffect(() => {
    if (isValidDiceNotation(formula)) {
      setStats({
        min: getMinRoll(formula),
        max: getMaxRoll(formula),
        average: getAverageRoll(formula),
        isValid: true
      });
      
      // Update context if onChange callback provided
      if (onChange) {
        onChange(formula);
      }
      
      // Update context
      dispatch(actionCreators.updateEffectResolutionConfig(effectId, {
        formula,
        stats: {
          min: getMinRoll(formula),
          max: getMaxRoll(formula),
          average: getAverageRoll(formula)
        }
      }));
    } else {
      setStats({
        min: 0,
        max: 0,
        average: 0,
        isValid: false
      });
    }
  }, [formula, onChange, dispatch, effectId]);
  
  // Generate preset options for this effect type
  const getPresets = () => {
    const presets = DICE_PRESETS[effectType] || DICE_PRESETS.utility;
    return Object.entries(presets).map(([level, notation]) => ({
      level,
      notation,
      scaled: getScaledDice(notation, previewLevel),
      description: getEffectDiceDescription(notation, effectType)
    }));
  };
  
  // Update formula when user inputs change
  const handleFormulaChange = (e) => {
    setFormula(e.target.value);
  };
  
  // Handle level change for scaling preview
  const handleLevelChange = (e) => {
    setPreviewLevel(parseInt(e.target.value) || 1);
  };
  
  // Handle selecting a preset
  const handlePresetSelect = (preset) => {
    setFormula(preset.scaled);
    setShowPresets(false);
  };
  
  // Get visualization data for dice distribution chart
  const visualizationData = showDistribution && stats.isValid 
    ? getDiceVisualizationData(formula) || {} 
    : {};
  
  return (
    <div className="dice-calculator">
      <div className="dice-formula-input">
        <label>
          Dice Formula:
          <input 
            type="text" 
            value={formula} 
            onChange={handleFormulaChange}
            className={!stats.isValid ? 'invalid' : ''}
          />
        </label>
        <button 
          className="preset-button"
          onClick={() => setShowPresets(!showPresets)}
        >
          Presets
        </button>
      </div>
      
      {showPresets && (
        <div className="dice-presets">
          <h4>Recommended Presets</h4>
          <div className="preset-list">
            {getPresets().map((preset, index) => (
              <div 
                key={index} 
                className="preset-item"
                onClick={() => handlePresetSelect(preset)}
              >
                <div className="preset-header">
                  <span className="preset-level">{preset.level}</span>
                  <span className="preset-notation">{preset.scaled}</span>
                </div>
                <p className="preset-description">{preset.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
      
      <div className="dice-stats">
        {stats.isValid ? (
          <>
            <div className="stat-item">
              <span className="stat-label">Min:</span>
              <span className="stat-value">{stats.min}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Avg:</span>
              <span className="stat-value">{stats.average.toFixed(1)}</span>
            </div>
            <div className="stat-item">
              <span className="stat-label">Max:</span>
              <span className="stat-value">{stats.max}</span>
            </div>
          </>
        ) : (
          <div className="dice-error">Invalid dice formula</div>
        )}
      </div>
      
      <div className="dice-scaling">
        <label>
          Preview at Level:
          <input 
            type="number" 
            min="1" 
            max="20" 
            value={previewLevel} 
            onChange={handleLevelChange}
          />
        </label>
        <div className="scaled-preview">
          <span className="scaled-label">Scaled Formula:</span>
          <span className="scaled-value">
            {stats.isValid ? getScaledDice(formula, previewLevel) : 'N/A'}
          </span>
        </div>
      </div>
      
      {showDistribution && visualizationData && visualizationData.data && visualizationData.data.length > 0 && (
        <div className="dice-distribution">
          <h4>Distribution</h4>
          <div className="distribution-chart">
            {visualizationData.data.map((point, index) => (
              <div 
                key={index}
                className="distribution-bar"
                style={{ 
                  height: `${point.percentage}%`,
                  left: `${(index / visualizationData.data.length) * 100}%`,
                  width: `${100 / visualizationData.data.length}%`
                }}
                title={`${point.outcome}: ${point.percentage.toFixed(1)}%`}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DiceCalculator;