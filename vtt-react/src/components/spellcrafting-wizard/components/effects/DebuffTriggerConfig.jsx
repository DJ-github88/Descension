import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRunning, faArrowsAlt, faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

/**
 * Component for configuring movement-based triggers for debuffs
 */
const DebuffTriggerConfig = ({ triggerConfig, onChange }) => {
  const [selectedTrigger, setSelectedTrigger] = useState(triggerConfig?.triggerId || 'distance_traveled');
  const [parameters, setParameters] = useState(triggerConfig?.parameters || {});

  // Initialize with default values if not provided - use useCallback to prevent infinite loops
  const stableOnChange = useCallback(onChange, []);

  useEffect(() => {
    if (!triggerConfig) {
      const defaultConfig = {
        triggerId: 'distance_traveled',
        parameters: {
          distance: 30,
          unit: 'feet'
        },
        targetEntity: 'target',
        effectType: 'debuff'
      };
      stableOnChange(defaultConfig);
    }
  }, [triggerConfig, stableOnChange]);

  // Update the trigger configuration when selections change
  const updateTriggerConfig = (triggerId, newParameters = {}) => {
    const updatedConfig = {
      triggerId,
      parameters: {
        ...parameters,
        ...newParameters
      },
      targetEntity: 'target',
      effectType: 'debuff'
    };
    
    setSelectedTrigger(triggerId);
    setParameters(updatedConfig.parameters);
    onChange(updatedConfig);
  };

  // Handle parameter changes
  const handleParameterChange = (paramName, value) => {
    const newParameters = {
      ...parameters,
      [paramName]: value
    };
    
    updateTriggerConfig(selectedTrigger, newParameters);
  };

  return (
    <div className="debuff-trigger-config">
      <div className="trigger-type-selector">
        <h4>Movement Trigger Type</h4>
        <div className="trigger-buttons">
          <button
            className={`trigger-button ${selectedTrigger === 'distance_traveled' ? 'selected' : ''}`}
            onClick={() => updateTriggerConfig('distance_traveled', { distance: parameters.distance || 30, unit: 'feet' })}
          >
            <FontAwesomeIcon icon={faRunning} />
            <span>Distance Traveled</span>
          </button>
          
          <button
            className={`trigger-button ${selectedTrigger === 'area_entered' ? 'selected' : ''}`}
            onClick={() => updateTriggerConfig('area_entered', { radius: parameters.radius || 10, unit: 'feet' })}
          >
            <FontAwesomeIcon icon={faArrowsAlt} />
            <span>Area Entered</span>
          </button>
          
          <button
            className={`trigger-button ${selectedTrigger === 'proximity' ? 'selected' : ''}`}
            onClick={() => updateTriggerConfig('proximity', { distance: parameters.distance || 5, unit: 'feet' })}
          >
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <span>Proximity</span>
          </button>
        </div>
      </div>
      
      <div className="trigger-parameters">
        {selectedTrigger === 'distance_traveled' && (
          <div className="parameter-group">
            <label>Distance:</label>
            <div className="parameter-input-group">
              <input
                type="number"
                value={parameters.distance || 30}
                onChange={(e) => handleParameterChange('distance', parseInt(e.target.value, 10))}
                min="5"
                max="120"
              />
              <select
                value={parameters.unit || 'feet'}
                onChange={(e) => handleParameterChange('unit', e.target.value)}
              >
                <option value="feet">feet</option>
                <option value="meters">meters</option>
                <option value="squares">squares</option>
              </select>
            </div>
            <p className="parameter-description">
              Debuff activates after the target has moved this distance.
            </p>
          </div>
        )}
        
        {selectedTrigger === 'area_entered' && (
          <div className="parameter-group">
            <label>Area Radius:</label>
            <div className="parameter-input-group">
              <input
                type="number"
                value={parameters.radius || 10}
                onChange={(e) => handleParameterChange('radius', parseInt(e.target.value, 10))}
                min="5"
                max="60"
              />
              <select
                value={parameters.unit || 'feet'}
                onChange={(e) => handleParameterChange('unit', e.target.value)}
              >
                <option value="feet">feet</option>
                <option value="meters">meters</option>
                <option value="squares">squares</option>
              </select>
            </div>
            <p className="parameter-description">
              Debuff activates when the target enters a specific area.
            </p>
          </div>
        )}
        
        {selectedTrigger === 'proximity' && (
          <div className="parameter-group">
            <label>Proximity Distance:</label>
            <div className="parameter-input-group">
              <input
                type="number"
                value={parameters.distance || 5}
                onChange={(e) => handleParameterChange('distance', parseInt(e.target.value, 10))}
                min="5"
                max="30"
              />
              <select
                value={parameters.unit || 'feet'}
                onChange={(e) => handleParameterChange('unit', e.target.value)}
              >
                <option value="feet">feet</option>
                <option value="meters">meters</option>
                <option value="squares">squares</option>
              </select>
            </div>
            <p className="parameter-description">
              Debuff activates when the target comes within this distance of another entity.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default DebuffTriggerConfig;
