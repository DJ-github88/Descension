import React, { useState, useEffect } from 'react';
import { useSpellWizardState, useSpellWizardDispatch, actionCreators } from '../../context/spellWizardContext';

// Importing these constant values which would normally come from comboSystem.js
const COMBO_POINT_SYSTEMS = {
  STANDARD: {
    name: "Standard Combo Points",
    description: "Traditional combo point system that builds up to powerful finishers",
    maxPoints: 5,
    consumptionRules: {
      scaling: 'linear',
      thresholds: [3, 5]
    }
  },
  MINSTREL: {
    name: "Minstrel Composition",
    description: "Musical elements that create powerful compositions when combined correctly",
    maxPoints: {
      tonic: 3,
      dominant: 3,
      mediant: 3,
      leading: 3,
      subdominant: 3
    },
    consumptionRules: {
      scaling: 'exponential',
      thresholds: [4, 7, 11]
    }
  },
  BLADEDANCER: {
    name: "Momentum",
    description: "Building speed and flow through continued movement and attacks",
    maxPoints: 100,
    consumptionRules: {
      scaling: 'percentage',
      thresholds: [25, 50, 75, 100]
    }
  },
  CHARGE: {
    name: "Energy Charges",
    description: "Accumulated energy charges that can be spent for powerful effects",
    maxPoints: 3,
    consumptionRules: {
      scaling: 'threshold',
      thresholds: [1, 2, 3]
    }
  },
  TOXICOLOGIST: {
    name: "Compound Mixtures",
    description: "Chemical compounds that can be mixed for various effects and reactions",
    maxPoints: {
      acid: 5,
      alkali: 5,
      catalyst: 3,
      solvent: 4,
      precipitate: 3
    },
    consumptionRules: {
      scaling: 'exponential',
      thresholds: [4, 8, 12]
    }
  }
};

const ComboPointConfig = ({ effectType, effectId, currentConfig, onConfigUpdate, spellType, spellEffects }) => {
  const dispatch = useSpellWizardDispatch();
  const state = useSpellWizardState();

  // Initialize configuration or use existing one
  const [config, setConfig] = useState(currentConfig || {
    system: 'STANDARD',
    type: state.spellType === 'CHANNELED' ? 'spender' : 'builder',
    pointsGenerated: 1,
    pointsRequired: 1,
    scaling: 'linear',
    thresholds: [3, 5],
    effect: {}
  });

  // Update configuration when it changes
  useEffect(() => {
    // Create a function to update both parent and context
    const updateConfiguration = () => {
      // If parent component provided an update callback, use it
      if (onConfigUpdate) {
        onConfigUpdate(config);
      }

      // Always update the context if we have an effectId
      if (effectId) {
        dispatch(actionCreators.updateEffectResolutionConfig(effectId, {
          ...config
        }));
      }
    };

    // Call the update function
    updateConfiguration();
  }, [config, onConfigUpdate, dispatch, effectId]);

  // Handle system change
  const handleSystemChange = (system) => {
    const systemConfig = COMBO_POINT_SYSTEMS[system];

    // Update scaling and thresholds when changing systems
    const updatedConfig = {
      ...config,
      system,
      scaling: systemConfig.consumptionRules.scaling || 'linear',
      thresholds: [...systemConfig.consumptionRules.thresholds] || []
    };

    setConfig(updatedConfig);
  };

  // Handle type change
  const handleTypeChange = (type) => {
    setConfig({
      ...config,
      type
    });
  };

  // Handle points generated change
  const handlePointsGeneratedChange = (points) => {
    setConfig({
      ...config,
      pointsGenerated: parseInt(points, 10)
    });
  };

  // Handle points required change
  const handlePointsRequiredChange = (points) => {
    setConfig({
      ...config,
      pointsRequired: parseInt(points, 10)
    });
  };

  // Handle scaling change
  const handleScalingChange = (scaling) => {
    setConfig({
      ...config,
      scaling
    });
  };

  // Handle threshold change
  const handleThresholdChange = (index, value) => {
    const updatedThresholds = [...config.thresholds];
    updatedThresholds[index] = parseInt(value, 10);

    // Sort thresholds in ascending order
    updatedThresholds.sort((a, b) => a - b);

    setConfig({
      ...config,
      thresholds: updatedThresholds
    });
  };

  // Handle adding a threshold
  const handleAddThreshold = () => {
    const updatedThresholds = [...config.thresholds];
    const lastThreshold = updatedThresholds[updatedThresholds.length - 1] || 0;
    const maxPoints = getMaxComboPoints(config.system);

    // Add a new threshold that's halfway between the last threshold and max points
    const newThreshold = Math.min(lastThreshold + Math.ceil((maxPoints - lastThreshold) / 2), maxPoints);

    // Only add if it's not already at max
    if (newThreshold > lastThreshold && newThreshold <= maxPoints) {
      updatedThresholds.push(newThreshold);

      setConfig({
        ...config,
        thresholds: updatedThresholds.sort((a, b) => a - b) // Keep sorted
      });
    }
  };

  // Handle removing a threshold
  const handleRemoveThreshold = (index) => {
    const updatedThresholds = [...config.thresholds];
    updatedThresholds.splice(index, 1);

    setConfig({
      ...config,
      thresholds: updatedThresholds
    });
  };

  // Handle effect change
  const handleEffectChange = (key, value) => {
    setConfig({
      ...config,
      effect: {
        ...config.effect,
        [key]: value
      }
    });
  };

  // Helper to get max combo points based on selected system
  const getMaxComboPoints = (systemId) => {
    const system = COMBO_POINT_SYSTEMS[systemId];
    if (!system) return 5; // Default

    if (typeof system.maxPoints === 'number') {
      return system.maxPoints;
    } else if (typeof system.maxPoints === 'object') {
      // If it's an object with multiple types, return the highest value
      return Math.max(...Object.values(system.maxPoints));
    }

    return 5; // Fallback
  };

  return (
    <div className="combo-point-config">
      <h4>Combo Point System</h4>
      <p className="config-description">Configure how this effect interacts with combo points</p>

      <div className="config-section">
        <label>System Type</label>
        <select
          value={config.system}
          onChange={(e) => handleSystemChange(e.target.value)}
        >
          {Object.entries(COMBO_POINT_SYSTEMS).map(([id, system]) => (
            <option key={id} value={id}>{system.name}</option>
          ))}
        </select>
        <p className="description">{COMBO_POINT_SYSTEMS[config.system]?.description}</p>
      </div>

      <div className="config-section">
        <label>Effect Type</label>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="comboType"
              value="builder"
              checked={config.type === 'builder'}
              onChange={() => handleTypeChange('builder')}
            />
            Builder (generates points)
          </label>
          <label>
            <input
              type="radio"
              name="comboType"
              value="spender"
              checked={config.type === 'spender'}
              onChange={() => handleTypeChange('spender')}
            />
            Spender (consumes points)
          </label>
          <label>
            <input
              type="radio"
              name="comboType"
              value="hybrid"
              checked={config.type === 'hybrid'}
              onChange={() => handleTypeChange('hybrid')}
            />
            Hybrid (both generates and consumes)
          </label>
        </div>
      </div>

      {(config.type === 'builder' || config.type === 'hybrid') && (
        <div className="config-section">
          <label>Points Generated</label>
          <input
            type="number"
            min="1"
            max={getMaxComboPoints(config.system)}
            value={config.pointsGenerated}
            onChange={(e) => handlePointsGeneratedChange(e.target.value)}
          />
        </div>
      )}

      {(config.type === 'spender' || config.type === 'hybrid') && (
        <div className="config-section">
          <label>Points Required</label>
          <input
            type="number"
            min="1"
            max={getMaxComboPoints(config.system)}
            value={config.pointsRequired}
            onChange={(e) => handlePointsRequiredChange(e.target.value)}
          />

          <div className="scaling-section">
            <label>Scaling Type</label>
            <select value={config.scaling} onChange={(e) => handleScalingChange(e.target.value)}>
              <option value="linear">Linear (effect increases with points)</option>
              <option value="threshold">Threshold (effect changes at specific points)</option>
              <option value="exponential">Exponential (effect grows dramatically with points)</option>
              <option value="percentage">Percentage (effect based on % of max points)</option>
            </select>

            <div className="thresholds-section">
              <label>Effect Thresholds</label>
              <div className="threshold-list">
                {config.thresholds.map((threshold, index) => (
                  <div key={index} className="threshold-item">
                    <input
                      type="number"
                      min="1"
                      max={getMaxComboPoints(config.system)}
                      value={threshold}
                      onChange={(e) => handleThresholdChange(index, e.target.value)}
                    />
                    <button type="button" onClick={() => handleRemoveThreshold(index)}>Remove</button>
                  </div>
                ))}
                <button
                  type="button"
                  className="add-threshold-btn"
                  onClick={handleAddThreshold}
                >
                  Add Threshold
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="effect-section">
        <h4>Effect Configuration</h4>

        {/* Simplified effect configuration UI */}
        <div className="effect-config-form">
          <div className="form-group">
            <label>Effect Description</label>
            <input
              type="text"
              value={config.effect.description || ''}
              onChange={(e) => handleEffectChange('description', e.target.value)}
              placeholder="Describe what happens when this effect is triggered"
            />
          </div>

          <div className="form-group">
            <label>Effect Potency</label>
            <select
              value={config.effect.potency || 'medium'}
              onChange={(e) => handleEffectChange('potency', e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="extreme">Extreme</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComboPointConfig;