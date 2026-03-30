import React, { useState, useEffect } from 'react';
import '../../styles/ResourceThresholdSlider.css';

const ResourceThresholdSlider = ({
  value,
  onChange,
  resourceType,
  comparison,
  thresholdType,
  onThresholdTypeChange
}) => {
  const [localValue, setLocalValue] = useState(value);

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Get resource color based on type
  const getResourceColor = () => {
    switch (resourceType) {
      case 'health': return '#e74c3c';
      case 'mana': return '#3498db';
      case 'energy': return '#f1c40f';
      case 'rage': return '#c0392b';
      case 'inferno': return '#e67e22';
      default: return '#4a8ef9';
    }
  };

  // Handle slider change
  const handleSliderChange = (e) => {
    const newValue = parseInt(e.target.value, 10);
    setLocalValue(newValue);
    onChange(newValue);
  };

  // Handle increment/decrement
  const handleIncrement = () => {
    const newValue = thresholdType === 'percentage'
      ? Math.min(100, localValue + 5)
      : localValue + 1;
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handleDecrement = () => {
    const newValue = thresholdType === 'percentage'
      ? Math.max(0, localValue - 5)
      : Math.max(1, localValue - 1);
    setLocalValue(newValue);
    onChange(newValue);
  };

  // Get description text
  const getDescriptionText = () => {
    const resourceName = resourceType.charAt(0).toUpperCase() + resourceType.slice(1);
    const comparisonText = comparison === 'below' || comparison === 'less_than'
      ? 'below'
      : comparison === 'above' || comparison === 'greater_than'
        ? 'above'
        : comparison === 'equal' || comparison === 'exactly_at'
          ? 'exactly at'
          : 'exactly at';

    return `Effect triggers when ${resourceName} is ${comparisonText} ${localValue}${thresholdType === 'percentage' ? '%' : ''}`;
  };

  // Calculate slider track width
  const trackWidth = thresholdType === 'percentage'
    ? `${localValue}%`
    : `${Math.min(100, (localValue / 20) * 100)}%`;

  // Calculate thumb position
  const thumbPosition = thresholdType === 'percentage'
    ? `calc(${localValue}% - 10px)`
    : `calc(${Math.min(100, (localValue / 20) * 100)}% - 10px)`;

  return (
    <div className="resource-threshold-container">
      <div className="threshold-header">
        When should the additional effect trigger?
      </div>

      <div className="threshold-slider-container">
        <button
          className="threshold-control-button"
          onClick={handleDecrement}
          aria-label="Decrease threshold"
        >
          -
        </button>

        <div className="threshold-slider-wrapper">
          <div
            className="threshold-slider-track"
            style={{
              width: trackWidth,
              background: `linear-gradient(to right, ${getResourceColor()}, ${getResourceColor()}CC)`
            }}
          ></div>
          <div
            className="threshold-slider-thumb"
            style={{
              left: thumbPosition,
              borderColor: getResourceColor()
            }}
          ></div>
          <input
            type="range"
            className="threshold-slider-input"
            min={thresholdType === 'percentage' ? 0 : 1}
            max={thresholdType === 'percentage' ? 100 : 20}
            value={localValue}
            onChange={handleSliderChange}
            aria-label="Resource threshold"
          />
        </div>

        <button
          className="threshold-control-button"
          onClick={handleIncrement}
          aria-label="Increase threshold"
        >
          +
        </button>

        <div className="threshold-value-display" style={{ color: getResourceColor() }}>
          {localValue}{thresholdType === 'percentage' ? '%' : ''}
        </div>
      </div>

      <div className="threshold-description">
        {getDescriptionText()}
      </div>

      <div className="threshold-type-toggle">
        <button
          className={`threshold-type-option ${thresholdType === 'percentage' ? 'active' : ''}`}
          onClick={() => onThresholdTypeChange('percentage')}
        >
          Percentage
        </button>
        <button
          className={`threshold-type-option ${thresholdType === 'flat' ? 'active' : ''}`}
          onClick={() => onThresholdTypeChange('flat')}
        >
          Flat Value
        </button>
      </div>
    </div>
  );
};

export default ResourceThresholdSlider;
