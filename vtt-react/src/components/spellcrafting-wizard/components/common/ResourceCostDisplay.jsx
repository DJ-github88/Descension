import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../../styles/pathfinder/main.css';

/**
 * ResourceCostDisplay component that shows spell resource requirements
 */
const ResourceCostDisplay = ({ 
  resources, 
  resourceLimits, 
  onChange,
  showCalculation,
  calculationDetails
}) => {
  const [showTooltip, setShowTooltip] = useState(null);
  
  // Get visual class based on resource cost
  const getResourceClass = (resourceType, value) => {
    if (!resourceLimits || !resourceLimits[resourceType]) {
      return 'resource-cost-normal';
    }
    
    const limit = resourceLimits[resourceType];
    const percent = (value / limit) * 100;
    
    if (percent >= 80) return 'resource-cost-high';
    if (percent >= 50) return 'resource-cost-medium';
    return 'resource-cost-low';
  };
  
  // Handle resource value change
  const handleResourceChange = (resourceType, newValue) => {
    if (onChange) {
      onChange(resourceType, newValue);
    }
  };
  
  // Toggle tooltip for specific resource
  const toggleTooltip = (resourceType) => {
    setShowTooltip(showTooltip === resourceType ? null : resourceType);
  };
  
  // Render calculation details tooltip
  const renderCalculationTooltip = (resourceType) => {
    if (!showCalculation || !calculationDetails || !calculationDetails[resourceType]) {
      return null;
    }
    
    const details = calculationDetails[resourceType];
    
    return (
      <div className="resource-cost-tooltip">
        <h4>Calculation for {formatResourceName(resourceType)}</h4>
        <div className="resource-cost-calculation">
          {Array.isArray(details) ? (
            <ul className="resource-cost-calculation-list">
              {details.map((detail, index) => (
                <li key={index}>
                  <span className="resource-cost-calculation-component">{detail.name}:</span>
                  <span className="resource-cost-calculation-value">{detail.value}</span>
                </li>
              ))}
              <li className="resource-cost-calculation-total">
                <span className="resource-cost-calculation-component">Total:</span>
                <span className="resource-cost-calculation-value">{resources[resourceType]}</span>
              </li>
            </ul>
          ) : (
            <p>{details}</p>
          )}
        </div>
      </div>
    );
  };
  
  // Format resource name for display
  const formatResourceName = (resourceKey) => {
    switch (resourceKey) {
      case 'actionPoints': return 'Action Points';
      case 'mana': return 'Mana';
      case 'cooldown': return 'Cooldown';
      default: return resourceKey.replace(/([A-Z])/g, ' $1').trim();
    }
  };
  
  // Get icon for resource type
  const getResourceIcon = (resourceType) => {
    switch (resourceType) {
      case 'actionPoints': return 'bolt';
      case 'mana': return 'tint';
      case 'cooldown': return 'hourglass-half';
      case 'comboPoints': return 'layer-group';
      case 'charges': return 'battery-full';
      case 'rage': return 'fire';
      case 'energy': return 'bolt';
      case 'focus': return 'eye';
      default: return 'circle';
    }
  };
  
  // Get unit for resource type
  const getResourceUnit = (resourceType) => {
    switch (resourceType) {
      case 'cooldown': return 'turns';
      case 'castTime': return 'turns';
      default: return '';
    }
  };
  
  return (
    <div className="resource-cost-display">
      {Object.entries(resources).map(([resourceType, value]) => (
        <div 
          key={resourceType} 
          className={`resource-cost-item ${getResourceClass(resourceType, value)}`}
        >
          <div className="resource-cost-icon">
            <i className={`fas fa-${getResourceIcon(resourceType)}`}></i>
          </div>
          
          <div className="resource-cost-info">
            <div className="resource-cost-label">
              {formatResourceName(resourceType)}
              {showCalculation && calculationDetails && calculationDetails[resourceType] && (
                <button 
                  className="resource-cost-calculation-toggle"
                  onClick={() => toggleTooltip(resourceType)}
                  aria-label="Show calculation details"
                >
                  <i className="fas fa-calculator"></i>
                </button>
              )}
            </div>
            
            <div className="resource-cost-value-container">
              <span className="resource-cost-value">
                {value} {getResourceUnit(resourceType)}
              </span>
              
              {onChange && (
                <div className="resource-cost-controls">
                  <button 
                    className="resource-cost-decrement"
                    onClick={() => handleResourceChange(resourceType, Math.max(0, value - 1))}
                    disabled={value <= 0}
                  >
                    <i className="fas fa-minus"></i>
                  </button>
                  <button 
                    className="resource-cost-increment"
                    onClick={() => handleResourceChange(resourceType, value + 1)}
                  >
                    <i className="fas fa-plus"></i>
                  </button>
                </div>
              )}
            </div>
            
            {resourceLimits && resourceLimits[resourceType] && (
              <div className="resource-cost-bar">
                <div 
                  className="resource-cost-bar-fill"
                  style={{ 
                    width: `${Math.min(100, (value / resourceLimits[resourceType]) * 100)}%` 
                  }}
                ></div>
              </div>
            )}
          </div>
          
          {showTooltip === resourceType && renderCalculationTooltip(resourceType)}
        </div>
      ))}
    </div>
  );
};

ResourceCostDisplay.propTypes = {
  resources: PropTypes.object.isRequired,
  resourceLimits: PropTypes.object,
  onChange: PropTypes.func,
  showCalculation: PropTypes.bool,
  calculationDetails: PropTypes.object
};

ResourceCostDisplay.defaultProps = {
  showCalculation: false
};

export default ResourceCostDisplay;