import React, { useCallback, memo } from 'react';
import '../styles/spell-wizard.css';
import '../styles/spell-wizard-layout.css';

/**
 * Navigation component for the spell wizard steps
 * Optimized to prevent unnecessary re-renders and update loops
 */
const StepNavigation = ({ 
  currentStep, 
  totalSteps, 
  onNext, 
  onPrev, 
  isNextEnabled = true,
  isLastStep = false
}) => {
  // Use useCallback to prevent recreation of handlers on each render
  const handleNextClick = useCallback(() => {
    if (isNextEnabled && onNext) {
      onNext();
    }
  }, [isNextEnabled, onNext]);

  const handlePrevClick = useCallback(() => {
    if (currentStep > 0 && onPrev) {
      onPrev();
    }
  }, [currentStep, onPrev]);

  return (
    <div className="step-navigation">
      <button 
        className="nav-button prev-button"
        onClick={handlePrevClick}
        disabled={currentStep === 0}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Previous
      </button>

      <div className="step-indicator">
        Step {currentStep + 1} of {totalSteps}
      </div>

      <button 
        className="nav-button next-button"
        onClick={handleNextClick}
        disabled={!isNextEnabled}
      >
        {isLastStep ? 'Finish' : 'Next'}
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
};

// Add display name for better debugging
StepNavigation.displayName = 'StepNavigation';

// Export memoized version to prevent unnecessary re-renders
export default memo(StepNavigation);