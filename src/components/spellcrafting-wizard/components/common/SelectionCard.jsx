import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/base.css';
import '../../styles/components.css';

/**
 * SelectionCard component for option selection in the spell wizard
 */
const SelectionCard = ({
  title,
  description,
  selected,
  disabled,
  highlighted,
  onClick,
  effectType
}) => {
  // Handle card click
  const handleClick = () => {
    if (!disabled && onClick) {
      onClick();
    }
  };

  return (
    <button
      className={`selection-card ${selected ? 'selected' : ''}
                 ${disabled ? 'disabled' : ''}
                 ${highlighted ? 'highlighted' : ''}`}
      onClick={handleClick}
      data-effect-type={effectType}
      disabled={disabled}
    >
      <div className="selection-card-header">
        <div className="selection-card-title-container">
          <h3 className="selection-card-title">{title}</h3>
        </div>
      </div>

      <div className="selection-card-content">
        <p className="selection-card-description">{description}</p>
      </div>

      {disabled && (
        <div className="selection-card-disabled-overlay">
          <div className="selection-card-disabled-message">
            Not Available
          </div>
        </div>
      )}
    </button>
  );
};

SelectionCard.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  selected: PropTypes.bool,
  disabled: PropTypes.bool,
  highlighted: PropTypes.bool,
  onClick: PropTypes.func,
  effectType: PropTypes.string
};

SelectionCard.defaultProps = {
  description: '',
  selected: false,
  disabled: false,
  highlighted: false
};

export default SelectionCard;