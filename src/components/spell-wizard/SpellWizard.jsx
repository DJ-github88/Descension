import React, { useState, useEffect, useMemo, memo } from 'react';
import useSpellWizardStore from '../../store/spellWizardStore';
import StepNavigation from './common/StepNavigation';
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
import './styles/spell-wizard-animations.css';

/**
 * SpellWizard component with optimizations to prevent update loops
 * Uses local state as a buffer between store updates and rendering
 */
const SpellWizard = () => {
  // Use local state to prevent circular updates
  const [localCurrentStep, setLocalCurrentStep] = useState(0);
  const [isStepValid, setIsStepValid] = useState(true);
  
  // Get minimal data from store with selective selectors
  const storeCurrentStep = useSpellWizardStore(state => state.currentStep);
  const storeValidation = useSpellWizardStore(state => state.stepValidation);
  const storeNextStep = useSpellWizardStore(state => state.nextStep);
  const storePrevStep = useSpellWizardStore(state => state.prevStep);
  
  // Sync local state with store, but only when store changes
  useEffect(() => {
    setLocalCurrentStep(storeCurrentStep);
  }, [storeCurrentStep]);
  
  // Update validation status, but only when needed
  useEffect(() => {
    const validationStatus = storeValidation[localCurrentStep] ?? true;
    setIsStepValid(validationStatus);
  }, [storeValidation, localCurrentStep]);
  
  // Define steps array using useMemo to prevent recreation on each render
  const steps = useMemo(() => [
    <Step1OriginType key="step1" />,
    <Step2PrimaryFunction key="step2" />,
    <Step3ResourceSystem key="step3" />,
    <Step4DamageHealing key="step4" />,
    <Step5SecondaryEffects key="step5" />,
    <Step6VisualAudio key="step6" />,
    <Step7FinalDetails key="step7" />,
    <Step8Preview key="step8" />
  ], []);

  // Compute if this is the last step
  const isLastStep = localCurrentStep === steps.length - 1;
  
  // Create safe navigation functions with useCallback
  const handleNext = React.useCallback(() => {
    if (isStepValid) {
      storeNextStep();
    }
  }, [isStepValid, storeNextStep]);
  
  const handlePrev = React.useCallback(() => {
    storePrevStep();
  }, [storePrevStep]);
  
  // Memoize the StepNavigation component to prevent unnecessary re-renders
  const navigation = useMemo(() => (
    <StepNavigation
      currentStep={localCurrentStep}
      totalSteps={steps.length}
      onNext={handleNext}
      onPrev={handlePrev}
      isNextEnabled={isStepValid}
      isLastStep={isLastStep}
    />
  ), [localCurrentStep, steps.length, handleNext, handlePrev, isStepValid, isLastStep]);

  return (
    <div className="spell-wizard">
      <div className="wizard-content">
        <div className="wizard-step-content">
          {steps[localCurrentStep]}
        </div>
      </div>
      {navigation}
    </div>
  );
};

// Export memoized version to prevent unnecessary re-renders
export default memo(SpellWizard);