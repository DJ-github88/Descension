import React, { useState, useEffect } from 'react';
import useSpellWizardStore from '../../store/spellWizardStore';

import Step1OriginType from './steps/Step1OriginType';
import Step2CastingMechanics from './steps/Step2CastingMechanics';
import Step3TargetingRange from './steps/Step3TargetingRange';
import Step4EffectSystem from './steps/Step4EffectSystem';
import Step5SecondaryEffects from './steps/Step5SecondaryEffects';  
import Step6AdvancedMechanics from './steps/Step6AdvancedMechanics';
import Step7VisualsAudio from './steps/Step7VisualsAudio';
import Step8ReviewFinalize from './steps/Step8ReviewFinalize';
import './styles/spell-wizard.css';
import './styles/spell-wizard-layout.css';

const SpellWizard = () => {
  // State for tracking the current step
  const [currentStep, setCurrentStep] = useState(0);
  const [furthestStep, setFurthestStep] = useState(0);
  
  // Get spellData and validation from the store
  const { spellData, isStepValid, setStepValidation, canAccessStep } = useSpellWizardStore();
  
  // Navigation functions
  const nextStep = () => {
    if (isStepValid(currentStep)) {
      const nextStepIndex = Math.min(currentStep + 1, steps.length - 1);
      setCurrentStep(nextStepIndex);
      setFurthestStep(Math.max(furthestStep, nextStepIndex));
    }
  };
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const goToStep = (index) => {
    // Check if we can access this step
    if (canAccessStep(index)) {
      const targetStep = Math.min(Math.max(0, index), steps.length - 1);
      setCurrentStep(targetStep);
      if (targetStep > furthestStep) {
        setFurthestStep(targetStep);
      }
    }
  };
  
  // Labels for the progress steps
  const steps = [
    'Origin & Identity',
    'Casting Mechanics',
    'Targeting & Range',
    'Effect System',
    'Secondary Effects',
    'Advanced Mechanics',
    'Visuals & Audio',
    'Final Details',
    'Preview'
  ];

  // Helper to get icon for each step
  const getStepIcon = (stepIndex) => {
    const icons = [
      'inv_ability_hellcallerwarlock_wither', // Origin & Identity
      'spell_arcane_prismaticcloak',        // Casting Mechanics
      'ability_hunter_aimedshot',           // Targeting & Range
      'spell_fire_flameshock',              // Effect System
      'spell_arcane_portaldarnassus',       // Secondary Effects
      'inv_enchant_essencemagiclarge',      // Advanced Mechanics
      'inv_inscription_minorglyph01',       // Visuals & Audio
      'inv_misc_book_09',                   // Final Details
      'achievement_dungeon_icecrown_frostmourne' // Preview
    ];
    return icons[stepIndex] || 'inv_misc_questionmark';
  };
  
  // Render the current step with navigation props
  const renderStep = () => {
    const commonProps = {
      nextStep,
      prevStep,
      goToStep,
      currentStep,
      totalSteps: steps.length
    };

    switch (currentStep) {
      case 0:
        return <Step1OriginType {...commonProps} />;
      case 1:
        return <Step2CastingMechanics {...commonProps} />;
      case 2:
        return <Step3TargetingRange {...commonProps} />;
      case 3:
        return <Step4EffectSystem {...commonProps} />;
      case 4:
        return <Step5SecondaryEffects {...commonProps} />;
      case 5:
        return <Step6AdvancedMechanics {...commonProps} />;
      case 6:
        return <Step7VisualsAudio {...commonProps} />;
      case 7:
        return <Step8ReviewFinalize {...commonProps} />;
      default:
        return <div>Unknown step</div>;
    }
  };
  
  return (
    <div className="spell-wizard">
      {/* Progress Steps */}
      <div className="wizard-progress">
        {steps.map((step, index) => {
          const isAccessible = canAccessStep(index);
          
          return (
            <div 
              key={index} 
              className={`progress-step ${index === currentStep ? 'active' : ''} 
                         ${isAccessible ? 'available' : ''} 
                         ${index < currentStep ? 'completed' : ''}`}
              onClick={() => isAccessible && goToStep(index)}
              style={{ cursor: isAccessible ? 'pointer' : 'not-allowed' }}
            >
              <div className="step-circle" title={step}>
                <img 
                  src={`https://wow.zamimg.com/images/wow/icons/small/${getStepIcon(index)}.jpg`}
                  alt={step}
                  className="step-icon"
                  style={{ opacity: isAccessible ? 1 : 0.5 }}
                />
              </div>
              <div className="step-label">{step}</div>
            </div>
          );
        })}
        <div 
          className="progress-bar" 
          style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
        ></div>
      </div>
      
      {/* Main Content Area */}
      <div className="wizard-content-container">
        {renderStep()}
      </div>
      
      {/* Navigation */}
      <div className="step-navigation">
        <button 
          className="nav-button prev-button"
          onClick={prevStep}
          disabled={currentStep === 0}
        >
          <img 
            src="https://wow.zamimg.com/images/wow/icons/small/spell_holy_borrowedtime.jpg" 
            alt="Previous"
            className="nav-icon"
          />
          Previous
        </button>
        
        <div className="step-indicator">
          <span className="current-step">{currentStep + 1}</span>
          <span className="step-divider">/</span>
          <span className="total-steps">{steps.length}</span>
        </div>
        
        <button 
          className="nav-button next-button"
          onClick={nextStep}
          disabled={!isStepValid(currentStep)}
        >
          {currentStep === steps.length - 1 ? (
            <>
              Finish
              <img 
                src="https://wow.zamimg.com/images/wow/icons/small/achievement_dungeon_icecrown_frostmourne.jpg" 
                alt="Finish"
                className="nav-icon"
              />
            </>
          ) : (
            <>
              Next
              <img 
                src="https://wow.zamimg.com/images/wow/icons/small/ability_hunter_pathfinding.jpg" 
                alt="Next"
                className="nav-icon"
              />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SpellWizard;