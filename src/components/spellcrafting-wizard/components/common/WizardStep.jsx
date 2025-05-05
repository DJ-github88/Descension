import React from 'react';
import PropTypes from 'prop-types';
import '../../../spellcrafting-wizard/styles/SpellWizard.css';

/**
 * WizardStep component that acts as a container for wizard steps
 */
const WizardStep = ({ 
  title, 
  stepNumber, 
  totalSteps, 
  isCompleted, 
  isActive,
  children, 
  onNext, 
  onPrevious,
  disableNext,
  showHints,
  hints,
  hiddenCondition
}) => {
  // Check if the step should be rendered based on condition
  if (hiddenCondition) {
    return null;
  }

  return (
    <div className={`spell-wizard-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}>
      <div className="spell-wizard-step-header">
        <div className="spell-wizard-step-title">
          <h2>
            <span className="spell-wizard-step-number">{stepNumber}</span>
            {title}
          </h2>
          <div className="spell-wizard-step-status">
            {isCompleted && (
              <span className="spell-wizard-step-complete-badge">
                <i className="fas fa-check-circle"></i> Complete
              </span>
            )}
          </div>
        </div>
        <div className="spell-wizard-step-progress">
          <div className="spell-wizard-step-progress-bar">
            <div 
              className="spell-wizard-step-progress-fill" 
              style={{ width: `${(stepNumber / totalSteps) * 100}%` }}
            ></div>
          </div>
          <span className="spell-wizard-step-progress-text">
            Step {stepNumber} of {totalSteps}
          </span>
        </div>
      </div>

      <div className="spell-wizard-step-content">
        {children}
      </div>

      {showHints && hints && hints.length > 0 && (
        <div className="spell-wizard-step-hints">
          <h4>Helpful Tips:</h4>
          <ul>
            {hints.map((hint, index) => (
              <li key={index}>{hint}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="spell-wizard-step-navigation">
        <button 
          className="spell-wizard-btn spell-wizard-btn-previous"
          onClick={onPrevious}
          disabled={stepNumber <= 1}
        >
          <i className="fas fa-arrow-left"></i> Previous
        </button>
        <div className="spell-wizard-step-indicators">
          {Array.from({ length: totalSteps }).map((_, idx) => (
            <div 
              key={idx} 
              className={`spell-wizard-step-indicator ${idx + 1 === stepNumber ? 'active' : ''} ${idx + 1 < stepNumber ? 'completed' : ''}`}
            ></div>
          ))}
        </div>
        <button 
          className="spell-wizard-btn spell-wizard-btn-next"
          onClick={onNext}
          disabled={disableNext}
        >
          {stepNumber === totalSteps ? 'Finish' : 'Next'} <i className="fas fa-arrow-right"></i>
        </button>
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

WizardStep.defaultProps = {
  isCompleted: false,
  isActive: false,
  disableNext: false,
  showHints: true,
  hints: [],
  hiddenCondition: false
};

export default WizardStep;