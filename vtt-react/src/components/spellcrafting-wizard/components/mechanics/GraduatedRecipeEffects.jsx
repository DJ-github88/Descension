import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faMinus, faTrash, faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import '../../styles/GraduatedRecipeEffects.css';

/**
 * Component for configuring graduated effects based on partial recipe matches
 * Allows setting different formulas for different levels of recipe completion
 */
const GraduatedRecipeEffects = ({ 
  recipeLength, 
  graduatedEffects, 
  onGraduatedEffectsChange,
  effectType = 'damage' // 'damage', 'healing', 'buff', etc.
}) => {
  // Initialize with default graduated effects if none provided
  const [effects, setEffects] = useState(() => {
    if (graduatedEffects && Object.keys(graduatedEffects).length > 0) {
      return graduatedEffects;
    }
    
    // Default to at least one effect for the full recipe match
    const defaults = {};
    if (recipeLength > 0) {
      defaults[recipeLength] = {
        formula: effectType === 'damage' ? '2d6 + INT' : 
                 effectType === 'healing' ? '2d8 + HEA' : '1d6',
        description: `Full recipe match (${recipeLength} chord functions)`
      };
    }
    return defaults;
  });

  // Update parent when effects change
  useEffect(() => {
    onGraduatedEffectsChange(effects);
  }, [effects, onGraduatedEffectsChange]);

  // Update when recipe length changes
  useEffect(() => {
    if (recipeLength > 0 && Object.keys(effects).length === 0) {
      setEffects({
        [recipeLength]: {
          formula: effectType === 'damage' ? '2d6 + INT' : 
                   effectType === 'healing' ? '2d8 + HEA' : '1d6',
          description: `Full recipe match (${recipeLength} chord functions)`
        }
      });
    }
  }, [recipeLength, effectType]);

  // Add a new graduated effect level
  const addEffectLevel = () => {
    // Find the next available level
    const existingLevels = Object.keys(effects).map(Number).sort((a, b) => a - b);
    let newLevel = 1;
    
    // Find the first gap or use the next number after the highest
    for (let i = 0; i < existingLevels.length; i++) {
      if (existingLevels[i] !== i + 1) {
        newLevel = i + 1;
        break;
      }
      if (i === existingLevels.length - 1) {
        newLevel = existingLevels[i] + 1;
      }
    }
    
    // Don't add levels beyond the recipe length
    if (newLevel > recipeLength) {
      return;
    }
    
    // Create a scaled formula based on the level
    const scaleFactor = newLevel / recipeLength;
    let baseFormula = '';
    
    if (effectType === 'damage') {
      baseFormula = `${Math.max(1, Math.floor(2 * scaleFactor))}d6 + INT * ${scaleFactor.toFixed(1)}`;
    } else if (effectType === 'healing') {
      baseFormula = `${Math.max(1, Math.floor(2 * scaleFactor))}d8 + HEA * ${scaleFactor.toFixed(1)}`;
    } else {
      baseFormula = `${Math.max(1, Math.floor(1 * scaleFactor))}d6`;
    }
    
    setEffects(prev => ({
      ...prev,
      [newLevel]: {
        formula: baseFormula,
        description: newLevel === recipeLength 
          ? `Full recipe match (${newLevel} chord functions)` 
          : `Partial match (${newLevel} of ${recipeLength} chord functions)`
      }
    }));
  };

  // Remove a graduated effect level
  const removeEffectLevel = (level) => {
    setEffects(prev => {
      const newEffects = { ...prev };
      delete newEffects[level];
      return newEffects;
    });
  };

  // Update a specific effect level
  const updateEffectLevel = (level, field, value) => {
    setEffects(prev => ({
      ...prev,
      [level]: {
        ...prev[level],
        [field]: value
      }
    }));
  };

  // Get sorted effect levels
  const sortedLevels = Object.keys(effects).map(Number).sort((a, b) => a - b);

  return (
    <div className="graduated-effects-container">
      <div className="graduated-effects-header">
        <h4>Graduated Recipe Effects</h4>
        <div className="graduated-effects-description">
          <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
          <span>Configure different effects based on how many chord functions match the recipe.</span>
        </div>
      </div>

      {sortedLevels.length === 0 ? (
        <div className="graduated-effects-empty">
          <p>No graduated effects configured. Add an effect level to get started.</p>
        </div>
      ) : (
        <div className="graduated-effects-list">
          {sortedLevels.map(level => (
            <div key={level} className="graduated-effect-item">
              <div className="graduated-effect-header">
                <span className="graduated-effect-level">
                  Level {level} ({Math.round((level / recipeLength) * 100)}% match)
                </span>
                <button 
                  className="graduated-effect-remove" 
                  onClick={() => removeEffectLevel(level)}
                  title="Remove this effect level"
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
              
              <div className="graduated-effect-inputs">
                <div className="graduated-effect-formula">
                  <label>Formula:</label>
                  <input 
                    type="text" 
                    value={effects[level].formula} 
                    onChange={(e) => updateEffectLevel(level, 'formula', e.target.value)}
                    placeholder="Enter formula (e.g., 2d6 + INT)"
                  />
                </div>
                
                <div className="graduated-effect-description">
                  <label>Description:</label>
                  <input 
                    type="text" 
                    value={effects[level].description} 
                    onChange={(e) => updateEffectLevel(level, 'description', e.target.value)}
                    placeholder="Describe this effect level"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="graduated-effects-actions">
        <button 
          className="graduated-effect-add" 
          onClick={addEffectLevel}
          disabled={sortedLevels.length >= recipeLength}
        >
          <FontAwesomeIcon icon={faPlus} /> Add Effect Level
        </button>
      </div>
    </div>
  );
};

export default GraduatedRecipeEffects;
