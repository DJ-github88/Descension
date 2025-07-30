import React from 'react';
import PropTypes from 'prop-types';
// Pathfinder styles imported via main.css

/**
 * WizardStep component that acts as a container for wizard steps
 */
const WizardStep = ({
  title,
  stepNumber,
  totalSteps,
  isCompleted = false,
  isActive = false,
  children,
  onNext,
  onPrevious,
  disableNext = false,
  showHints = true,
  hints = [],
  hiddenCondition = false
}) => {
  // Check if the step should be rendered based on condition
  if (hiddenCondition) {
    return null;
  }

  return (
    <div className={`spell-wizard-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
      {/* Step content - fills entire space */}
      <div className="spell-wizard-step-content">
        {children}
      </div>
    </div>
  );
};

WizardStep.propTypes = {
  title: PropTypes.string.isRequired,
  stepNumber: PropTypes.number.isRequired,
  totalSteps: PropTypes.number.isRequired,
  isCompleted: PropTypes.bool,
  isActive: PropTypes.bool,
  children: PropTypes.node.isRequired,
  onNext: PropTypes.func.isRequired,
  onPrevious: PropTypes.func.isRequired,
  disableNext: PropTypes.bool,
  showHints: PropTypes.bool,
  hints: PropTypes.arrayOf(PropTypes.string),
  hiddenCondition: PropTypes.bool
};



export default WizardStep;