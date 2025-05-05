import React, { useState, useEffect } from 'react';
import { useSpellWizardState } from '../../context/spellWizardContext';
import { FaFire, FaHeart, FaRulerHorizontal, FaClock, FaUsers } from 'react-icons/fa';

/**
 * Component for modifying formulas in the rollable table
 */
const FormulaModifierSection = ({ 
  formulaType, 
  originalFormula, 
  currentOverride, 
  onFormulaChange 
}) => {
  const wizardState = useSpellWizardState();
  const [modifierType, setModifierType] = useState('direct'); // 'direct', 'multiply', 'add'
  const [multiplier, setMultiplier] = useState(1);
  const [addition, setAddition] = useState('');
  const [directFormula, setDirectFormula] = useState('');
  const [showOriginalFormula, setShowOriginalFormula] = useState(true);

  // Initialize the component state based on the current override
  useEffect(() => {
    if (!currentOverride) {
      setModifierType('direct');
      setMultiplier(1);
      setAddition('');
      setDirectFormula('');
      return;
    }

    // Check if it's a multiplier format (e.g., "2x base")
    if (currentOverride.includes('x base')) {
      const multiplierMatch = currentOverride.match(/^([\d.]+)x base$/);
      if (multiplierMatch) {
        setModifierType('multiply');
        setMultiplier(parseFloat(multiplierMatch[1]));
        return;
      }
    }

    // Check if it's an addition format (e.g., "base + 2d6")
    if (currentOverride.includes('base +') || currentOverride.includes('base -')) {
      const additionMatch = currentOverride.match(/^base ([+-] .+)$/);
      if (additionMatch) {
        setModifierType('add');
        setAddition(additionMatch[1].trim());
        return;
      }
    }

    // Otherwise, it's a direct formula override
    setModifierType('direct');
    setDirectFormula(currentOverride);
  }, [currentOverride]);

  // Get the icon for the formula type
  const getFormulaIcon = () => {
    switch (formulaType) {
      case 'damage':
        return <FaFire className="formula-icon damage" />;
      case 'healing':
        return <FaHeart className="formula-icon healing" />;
      case 'range':
        return <FaRulerHorizontal className="formula-icon range" />;
      case 'duration':
        return <FaClock className="formula-icon duration" />;
      case 'targets':
        return <FaUsers className="formula-icon targets" />;
      default:
        return null;
    }
  };

  // Get the formula label
  const getFormulaLabel = () => {
    switch (formulaType) {
      case 'damage':
        return 'Damage Formula';
      case 'healing':
        return 'Healing Formula';
      case 'range':
        return 'Range';
      case 'duration':
        return 'Duration';
      case 'targets':
        return 'Targets';
      default:
        return 'Formula';
    }
  };

  // Get the formula color class
  const getFormulaColorClass = () => {
    switch (formulaType) {
      case 'damage':
        return 'damage-color';
      case 'healing':
        return 'healing-color';
      case 'range':
        return 'range-color';
      case 'duration':
        return 'duration-color';
      case 'targets':
        return 'targets-color';
      default:
        return '';
    }
  };

  // Handle modifier type change
  const handleModifierTypeChange = (type) => {
    setModifierType(type);
    
    // Update the formula based on the new modifier type
    let newFormula = '';
    
    switch (type) {
      case 'direct':
        newFormula = directFormula || originalFormula;
        break;
      case 'multiply':
        newFormula = `${multiplier}x base`;
        break;
      case 'add':
        newFormula = `base ${addition}`;
        break;
      default:
        newFormula = originalFormula;
    }
    
    onFormulaChange(newFormula);
  };

  // Handle multiplier change
  const handleMultiplierChange = (e) => {
    const value = parseFloat(e.target.value);
    setMultiplier(value);
    onFormulaChange(`${value}x base`);
  };

  // Handle addition change
  const handleAdditionChange = (e) => {
    const value = e.target.value;
    
    // Ensure the addition starts with + or -
    let formattedValue = value;
    if (value && !value.startsWith('+') && !value.startsWith('-')) {
      formattedValue = `+ ${value}`;
    }
    
    setAddition(formattedValue);
    onFormulaChange(`base ${formattedValue}`);
  };

  // Handle direct formula change
  const handleDirectFormulaChange = (e) => {
    const value = e.target.value;
    setDirectFormula(value);
    onFormulaChange(value);
  };

  return (
    <div className="formula-modifier-section">
      <div className="formula-modifier-header">
        <div className="formula-type-label">
          {getFormulaIcon()}
          <span>{getFormulaLabel()}</span>
        </div>
        <button 
          className="formula-toggle-button"
          onClick={() => setShowOriginalFormula(!showOriginalFormula)}
        >
          {showOriginalFormula ? 'Hide Original' : 'Show Original'}
        </button>
      </div>

      {showOriginalFormula && originalFormula && (
        <div className="original-formula">
          <span className="original-formula-label">Original:</span>
          <code className={`original-formula-value ${getFormulaColorClass()}`}>
            {originalFormula}
          </code>
        </div>
      )}

      <div className="modifier-type-selector">
        <button
          className={`modifier-type-button ${modifierType === 'direct' ? 'active' : ''}`}
          onClick={() => handleModifierTypeChange('direct')}
        >
          Direct Override
        </button>
        <button
          className={`modifier-type-button ${modifierType === 'multiply' ? 'active' : ''}`}
          onClick={() => handleModifierTypeChange('multiply')}
        >
          Multiply Base
        </button>
        <button
          className={`modifier-type-button ${modifierType === 'add' ? 'active' : ''}`}
          onClick={() => handleModifierTypeChange('add')}
        >
          Add/Subtract
        </button>
      </div>

      <div className="formula-input-container">
        {modifierType === 'direct' && (
          <div className="direct-formula-input">
            <input
              type="text"
              value={directFormula}
              onChange={handleDirectFormulaChange}
              placeholder={`Enter formula (e.g., ${originalFormula || '2d6 + INT'})`}
              className="wow-settings-input"
            />
          </div>
        )}

        {modifierType === 'multiply' && (
          <div className="multiplier-input">
            <input
              type="number"
              value={multiplier}
              onChange={handleMultiplierChange}
              step="0.1"
              min="0.1"
              max="10"
              className="wow-settings-input"
            />
            <span className="multiplier-label">× base formula</span>
          </div>
        )}

        {modifierType === 'add' && (
          <div className="addition-input">
            <span className="base-formula-label">base</span>
            <input
              type="text"
              value={addition}
              onChange={handleAdditionChange}
              placeholder="+ 1d6"
              className="wow-settings-input"
            />
          </div>
        )}
      </div>

      <div className="formula-preview">
        <span className="preview-label">Result:</span>
        <code className={`preview-value ${getFormulaColorClass()}`}>
          {modifierType === 'direct' ? directFormula : 
           modifierType === 'multiply' ? `${multiplier}x base` : 
           modifierType === 'add' ? `base ${addition}` : 
           originalFormula || 'No formula'}
        </code>
      </div>
    </div>
  );
};

export default FormulaModifierSection;
