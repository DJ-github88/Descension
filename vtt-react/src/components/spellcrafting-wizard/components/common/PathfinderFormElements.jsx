import React from 'react';
import PropTypes from 'prop-types';

/**
 * Pathfinder-themed form elements to replace Chakra UI components
 */

// Pathfinder Select Component
export const PfSelect = ({ 
  value, 
  onChange, 
  options = [], 
  placeholder = "Select an option...",
  className = "",
  disabled = false,
  ...props 
}) => {
  return (
    <select
      className={`pf-select ${className}`}
      value={value}
      onChange={onChange}
      disabled={disabled}
      {...props}
    >
      {placeholder && (
        <option value="" disabled>
          {placeholder}
        </option>
      )}
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

// Pathfinder Checkbox Component
export const PfCheckbox = ({ 
  checked, 
  onChange, 
  label, 
  className = "",
  disabled = false,
  ...props 
}) => {
  return (
    <div className={`pf-checkbox-container ${className}`}>
      <input
        type="checkbox"
        className="pf-checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        {...props}
      />
      {label && (
        <label className="pf-checkbox-label">
          {label}
        </label>
      )}
    </div>
  );
};

// Pathfinder Radio Group Component
export const PfRadioGroup = ({ 
  value, 
  onChange, 
  options = [], 
  name,
  className = "",
  ...props 
}) => {
  return (
    <div className={`pf-radio-group ${className}`} {...props}>
      {options.map((option, index) => (
        <div key={index} className="pf-radio-container">
          <input
            type="radio"
            className="pf-radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          <label className="pf-radio-label">
            {option.label}
          </label>
          {option.description && (
            <div className="pf-radio-description">
              {option.description}
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

// Pathfinder Slider Component
export const PfSlider = ({ 
  value, 
  onChange, 
  min = 0, 
  max = 100, 
  step = 1,
  showValue = true,
  className = "",
  ...props 
}) => {
  return (
    <div className={`pf-slider-container ${className}`}>
      <input
        type="range"
        className="pf-slider"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        {...props}
      />
      {showValue && (
        <div className="pf-slider-value">
          {value}
        </div>
      )}
    </div>
  );
};

// Pathfinder Number Input Component
export const PfNumberInput = ({ 
  value, 
  onChange, 
  min, 
  max, 
  step = 1,
  showSteppers = true,
  className = "",
  ...props 
}) => {
  const handleIncrement = () => {
    const newValue = Number(value) + step;
    if (max === undefined || newValue <= max) {
      onChange(newValue);
    }
  };

  const handleDecrement = () => {
    const newValue = Number(value) - step;
    if (min === undefined || newValue >= min) {
      onChange(newValue);
    }
  };

  return (
    <div className={`pf-number-input-container ${className}`}>
      {showSteppers && (
        <button
          type="button"
          className="pf-stepper-button"
          onClick={handleDecrement}
          disabled={min !== undefined && Number(value) <= min}
        >
          −
        </button>
      )}
      <input
        type="number"
        className="pf-number-input"
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        min={min}
        max={max}
        step={step}
        {...props}
      />
      {showSteppers && (
        <button
          type="button"
          className="pf-stepper-button"
          onClick={handleIncrement}
          disabled={max !== undefined && Number(value) >= max}
        >
          +
        </button>
      )}
    </div>
  );
};

// Pathfinder Form Control Component
export const PfFormControl = ({ 
  label, 
  children, 
  required = false,
  error = null,
  helpText = null,
  className = "",
  ...props 
}) => {
  return (
    <div className={`pf-form-control ${className}`} {...props}>
      {label && (
        <label className="pf-form-label">
          {label}
          {required && <span className="pf-required">*</span>}
        </label>
      )}
      <div className="pf-form-input-wrapper">
        {children}
      </div>
      {helpText && (
        <div className="pf-form-help-text">
          {helpText}
        </div>
      )}
      {error && (
        <div className="pf-form-error">
          {error}
        </div>
      )}
    </div>
  );
};

// Pathfinder Switch Component
export const PfSwitch = ({ 
  checked, 
  onChange, 
  label,
  size = "md",
  className = "",
  disabled = false,
  ...props 
}) => {
  return (
    <div className={`pf-switch-container ${className}`}>
      <div className={`pf-switch pf-switch-${size} ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}`}>
        <input
          type="checkbox"
          className="pf-switch-input"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          {...props}
        />
        <div className="pf-switch-track">
          <div className="pf-switch-thumb"></div>
        </div>
      </div>
      {label && (
        <label className="pf-switch-label">
          {label}
        </label>
      )}
    </div>
  );
};

// PropTypes
PfSelect.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.string.isRequired
  })),
  placeholder: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool
};

PfCheckbox.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  className: PropTypes.string,
  disabled: PropTypes.bool
};

PfRadioGroup.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    label: PropTypes.string.isRequired,
    description: PropTypes.string
  })).isRequired,
  name: PropTypes.string.isRequired,
  className: PropTypes.string
};

PfSlider.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  showValue: PropTypes.bool,
  className: PropTypes.string
};

PfNumberInput.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  showSteppers: PropTypes.bool,
  className: PropTypes.string
};

PfFormControl.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node.isRequired,
  required: PropTypes.bool,
  error: PropTypes.string,
  helpText: PropTypes.string,
  className: PropTypes.string
};

PfSwitch.propTypes = {
  checked: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
  disabled: PropTypes.bool
};
