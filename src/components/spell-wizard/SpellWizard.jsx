import React, { useState, useEffect } from 'react';
import useSpellWizardStore from '../../store/spellWizardStore';
import { SpellPreview } from './common';
import Step1OriginType from './steps/Step1OriginType';
import Step2PrimaryFunction from './steps/Step2PrimaryFunction';
import Step3ResourceSystem from './steps/Step3ResourceSystem';
import Step4DamageHealing from './steps/Step4DamageHealing';
import Step5SecondaryEffects from './steps/Step5SecondaryEffects';
import Step6VisualAudio from './steps/Step6VisualAudio';
import Step7FinalDetails from './steps/Step7FinalDetails';
import Step8Preview from './steps/Step8Preview';
import './styles/spell-wizard.css';
import './styles/spell-wizard-layout.css';

const SpellWizard = () => {
  // State for tracking the current step
  const [currentStep, setCurrentStep] = useState(0);
  
  // Get spellData from the store
  const { spellData, isStepValid } = useSpellWizardStore();
  
  // Navigation functions
  const nextStep = () => {
    setCurrentStep(prev => Math.min(prev + 1, 7));
  };
  
  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };
  
  // Labels for the progress steps
  const steps = [
    'Origin & Identity',
    'Primary Function',
    'Resources',
    'Damage & Healing',
    'Secondary Effects',
    'Visual & Audio',
    'Final Details',
    'Preview'
  ];

  // Helper to get icon for each step
  const getStepIcon = (stepIndex) => {
    const icons = [
      'inv_ability_hellcallerwarlock_wither', // Origin & Identity
      'spell_arcane_prismaticcloak',        // Primary Function
      'inv_elemental_mote_mana',            // Resources
      'spell_fire_flameshock',              // Damage & Healing
      'spell_arcane_portaldarnassus',       // Secondary Effects
      'inv_enchant_essencemagiclarge',      // Visual & Audio
      'inv_inscription_minorglyph01',       // Final Details
      'inv_misc_book_09'                    // Preview
    ];
    return icons[stepIndex] || 'inv_misc_questionmark';
  };
  
  // Render the current step
  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <Step1OriginType />;
      case 1:
        return <Step2PrimaryFunction />;
      case 2:
        return <Step3ResourceSystem />;
      case 3:
        return <Step4DamageHealing />;
      case 4:
        return <Step5SecondaryEffects />;
      case 5:
        return <Step6VisualAudio />;
      case 6:
        return <Step7FinalDetails />;
      case 7:
        return <Step8Preview />;
      default:
        return <div>Unknown step</div>;
    }
  };
  
  return (
    <div className="spell-wizard">
      {/* Progress Steps */}
      <div className="wizard-progress">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`progress-step ${index === currentStep ? 'active' : ''} ${index < currentStep ? 'completed' : ''}`}
            onClick={() => index < currentStep && setCurrentStep(index)}
          >
            <div className="step-circle">
              {index < currentStep ? (
                <img 
                  src="https://wow.zamimg.com/images/wow/icons/small/achievement_guildperk_everybodysfriend.jpg" 
                  alt="✓"
                  className="step-check-icon"
                />
              ) : (
                <img 
                  src={`https://wow.zamimg.com/images/wow/icons/small/${getStepIcon(index)}.jpg`} 
                  alt={index + 1}
                  className="step-icon"
                />
              )}
            </div>
            <div className="step-label">{step}</div>
          </div>
        ))}
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
          disabled={!isStepValid[currentStep]}
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