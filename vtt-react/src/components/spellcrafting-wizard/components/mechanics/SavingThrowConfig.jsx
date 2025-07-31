import React, { useState, useEffect, useMemo } from 'react';
import { FaShieldAlt, FaDiceD20, FaClone, FaCoins } from 'react-icons/fa';
import IconSelectionCard from '../common/IconSelectionCard';
import '../../styles/ChanceOnHitConfig.css';
import '../../styles/saving-throw-config.css';

const SAVING_THROW_TYPES = [
  { id: 'strength', name: 'Strength' },
  { id: 'agility', name: 'Agility' },
  { id: 'constitution', name: 'Constitution' },
  { id: 'intelligence', name: 'Intelligence' },
  { id: 'spirit', name: 'Spirit' },
  { id: 'charisma', name: 'Charisma' }
];

// Get formula examples based on current damage formulas
const getFormulaExamples = (damageFormula, dotFormula, damageType, hasDotEffect) => {
  const examples = [
    { formula: 'damage/2', description: 'Half Damage' },
    { formula: 'damage/4', description: 'Quarter Damage' },
    { formula: '0', description: 'No Damage' }
  ];

  // Add examples based on the actual damage formula
  if (damageFormula) {
    if (damageFormula.includes('d')) {
      // If the formula includes dice, add examples with reduced dice
      const diceParts = damageFormula.match(/(\d+)d(\d+)/);
      if (diceParts && diceParts.length >= 3) {
        const diceCount = parseInt(diceParts[1]);
        const diceType = diceParts[2];

        if (diceCount > 1) {
          examples.push({
            formula: damageFormula.replace(`${diceCount}d${diceType}`, `${Math.max(1, Math.floor(diceCount/2))}d${diceType}`),
            description: `Half number of dice (${Math.max(1, Math.floor(diceCount/2))}d${diceType})`
          });
        }
      }
    }

    // Add example with damage formula minus a fixed value
    examples.push({
      formula: `MAX(${damageFormula}/2, 1)`,
      description: 'Half of formula result, minimum 1'
    });
  }

  // Add examples for DoT if applicable
  if ((damageType === 'dot' || hasDotEffect) && dotFormula) {
    examples.push({
      formula: 'dot_damage/2',
      description: 'Half DoT Damage'
    });

    // If we have both damage types
    if (hasDotEffect && damageFormula) {
      examples.push({
        formula: 'damage/2 + dot_damage/4',
        description: 'Half direct + quarter DoT'
      });
    }
  }

  // Add a few more generic examples
  examples.push(
    { formula: 'MIN(damage, 10)', description: 'Damage capped at 10' },
    { formula: '1d6 + INT', description: 'Custom dice formula' }
  );

  return examples;
};

const SavingThrowConfig = ({ config, onConfigChange }) => {
  // Initialize with default values if not provided
  const defaultConfig = useMemo(() => ({
    enabled: false,
    savingThrowType: 'agility',
    difficultyClass: 15,
    partialEffect: false,
    partialEffectFormula: 'damage/2', // Default formula for partial effect
    directDamageFormula: 'damage/2', // Separate formula for direct damage
    dotDamageFormula: 'dot_damage/2', // Separate formula for DoT damage
    damageFormula: '',
    dotFormula: '',
    damageType: 'direct',
    hasDotEffect: false
  }), []);

  // Use local state to manage the config
  const [saveConfig, setSaveConfig] = useState(() => {
    const mergedConfig = {
      ...defaultConfig,
      ...config
    };
    // Ensure partialEffectFormula has a default value if not provided
    if (!mergedConfig.partialEffectFormula) {
      mergedConfig.partialEffectFormula = defaultConfig.partialEffectFormula;
    }
    return mergedConfig;
  });

  // Update local state when config prop changes
  useEffect(() => {
    const newConfig = {
      ...defaultConfig,
      ...config
    };
    // Ensure partialEffectFormula has a default value if not provided
    if (!newConfig.partialEffectFormula) {
      newConfig.partialEffectFormula = defaultConfig.partialEffectFormula;
    }
    setSaveConfig(newConfig);
  }, [config]); // Remove defaultConfig from dependencies to prevent infinite loops

  // State for showing formula examples
  const [showExamples, setShowExamples] = useState(false);

  // Simple formula examples for saving throws
  const formulaExamples = [
    { formula: 'damage/2', description: 'Half Damage' },
    { formula: 'damage/4', description: 'Quarter Damage' },
    { formula: '0', description: 'No Damage' },
    { formula: 'damage - 2', description: 'Damage minus 2' },
    { formula: 'max(damage/2, 1)', description: 'Half damage, min 1' },
    { formula: 'damage - CON', description: 'Damage minus CON' }
  ];

  // Handler for config changes
  const handleChange = (field, value) => {
    const newConfig = {
      ...saveConfig,
      [field]: value
    };

    // Update local state immediately for UI responsiveness
    setSaveConfig(newConfig);

    // Call parent callback
    onConfigChange(newConfig);
  };

  // Toggle saving throw on/off
  const toggleSavingThrow = () => {
    handleChange('enabled', !saveConfig.enabled);
  };

  // Toggle partial effect on/off
  const togglePartialEffect = () => {
    handleChange('partialEffect', !saveConfig.partialEffect);
  };

  return (
    <div className="saving-throw-config">
      {/* ===== SECTION 1: ENABLE TOGGLE ===== */}
      <div className="config-header">
        <h3>Saving Throw Configuration</h3>

        <div className="config-toggle">
          <label className="wow-checkbox-label">
            <input
              type="checkbox"
              checked={saveConfig.enabled}
              onChange={toggleSavingThrow}
              className="wow-checkbox"
            />
            <span className="wow-checkbox-custom"></span>
            <span className="wow-option-text">Enable Saving Throw</span>
          </label>
          <div className="wow-option-description">
            When enabled, targets can make a saving throw to reduce or negate the spell's effects
          </div>
        </div>
      </div>

      {saveConfig.enabled && (
        <>
          {/* ===== SECTION 2: SAVE TYPE AND DC ===== */}
          <div className="special-effects-section">
            <h4>Save Configuration</h4>
            <div className="multiplier-row">
              <div className="control-group">
                <label>Save Type</label>
                <select
                  value={saveConfig.savingThrowType || 'agility'}
                  onChange={(e) => handleChange('savingThrowType', e.target.value)}
                  className="pf-select"
                >
                  {SAVING_THROW_TYPES.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              <div className="control-group">
                <label>Difficulty Class (DC)</label>
                <div className="crit-multiplier-controls">
                  <button
                    type="button"
                    className="multiplier-button"
                    onClick={() => handleChange('difficultyClass', Math.max(5, (saveConfig.difficultyClass || 15) - 1))}
                  >
                    -
                  </button>
                  <span className="multiplier-display">{saveConfig.difficultyClass || 15}</span>
                  <button
                    type="button"
                    className="multiplier-button"
                    onClick={() => handleChange('difficultyClass', Math.min(30, (saveConfig.difficultyClass || 15) + 1))}
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* ===== SECTION 3: PARTIAL EFFECT TOGGLE ===== */}
          <div className="multiplier-section">
            <h4>Save Effect</h4>
            <div className="config-toggle">
              <label className="wow-checkbox-label">
                <input
                  type="checkbox"
                  checked={saveConfig.partialEffect}
                  onChange={togglePartialEffect}
                  className="wow-checkbox"
                />
                <span className="wow-checkbox-custom"></span>
                <span className="wow-option-text">Partial Effect on Successful Save</span>
              </label>
              <div className="wow-option-description">
                When enabled, successful saves reduce damage instead of negating it completely
              </div>
            </div>

            {saveConfig.partialEffect && (
              <div className="formula-config-section">
                <h5>Damage Formula on Successful Save</h5>
                <div className="form-group">
                  <label>Formula</label>
                  <input
                    type="text"
                    value={saveConfig.partialEffectFormula || ''}
                    onChange={(e) => {
                      const newValue = e.target.value;

                      // Batch all the updates into a single config change
                      const newConfig = {
                        ...saveConfig,
                        partialEffectFormula: newValue,
                        directDamageFormula: newValue,
                        dotDamageFormula: newValue.replace(/\bdamage\b/g, 'dot_damage')
                      };

                      setSaveConfig(newConfig);
                      onConfigChange(newConfig);
                    }}
                    placeholder="e.g., damage/2, damage/4, 0"
                    className="formula-input"
                  />
                </div>

                <div className="formula-examples-section">
                  <h6>Formula Examples (Click to Use)</h6>
                  <div className="examples-grid">
                    {formulaExamples.slice(0, 6).map((example, index) => (
                      <button
                        key={index}
                        className={`example-card ${saveConfig.partialEffectFormula === example.formula ? 'active' : ''}`}
                        onClick={() => {
                          // Batch all the updates into a single config change
                          const newConfig = {
                            ...saveConfig,
                            partialEffectFormula: example.formula,
                            directDamageFormula: example.formula,
                            dotDamageFormula: example.formula.replace(/\bdamage\b/g, 'dot_damage')
                          };

                          setSaveConfig(newConfig);
                          onConfigChange(newConfig);
                        }}
                      >
                        <div className="example-title">{example.formula}</div>
                        <div className="example-desc">{example.description}</div>
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default SavingThrowConfig;
