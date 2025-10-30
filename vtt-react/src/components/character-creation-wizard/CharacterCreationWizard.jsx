/**
 * Character Creation Wizard - Main Component
 *
 * Multi-step character creation wizard with background selection and stat allocation
 */

import React, { useEffect } from 'react';
import { CharacterWizardProvider, useCharacterWizardState, useCharacterWizardDispatch, wizardActionCreators, WIZARD_STEPS, STEP_INFO } from './context/CharacterWizardContext';

// Import wizard steps
import Step1BasicInfo from './steps/Step1BasicInfo';
import Step2RaceSelection from './steps/Step2RaceSelection';
import Step3ClassSelection from './steps/Step3ClassSelection';
import Step4SpellSelection from './steps/Step4SpellSelection';
import Step5BackgroundSelection from './steps/Step4BackgroundSelection';
import Step6PathSelection from './steps/Step5PathSelection';
import Step7StatAllocation from './steps/Step6StatAllocation';
import Step8SkillsLanguages from './steps/Step7SkillsLanguages';
import Step9LoreDetails from './steps/Step8LoreDetails';
import Step10EquipmentSelection from './steps/Step10EquipmentSelection';
import Step11CharacterSummary from './steps/Step9CharacterSummary';

// Import styles
import './styles/CharacterCreationWizard.css';

const CharacterCreationWizardContent = ({ onComplete, onCancel, isLoading, existingCharacter, isEditing }) => {
    const state = useCharacterWizardState();
    const dispatch = useCharacterWizardDispatch();

    // Load existing character data when editing
    useEffect(() => {
        if (isEditing && existingCharacter) {
            console.log('Loading existing character into wizard:', existingCharacter);
            dispatch(wizardActionCreators.loadCharacter(existingCharacter));
        }
    }, [isEditing, existingCharacter, dispatch]);

    // Render the current step
    const renderStep = () => {
        switch (state.currentStep) {
            case WIZARD_STEPS.BASIC_INFO:
                return <Step1BasicInfo />;
            case WIZARD_STEPS.RACE_SELECTION:
                return <Step2RaceSelection />;
            case WIZARD_STEPS.CLASS_SELECTION:
                return <Step3ClassSelection />;
            case WIZARD_STEPS.SPELL_SELECTION:
                return <Step4SpellSelection />;
            case WIZARD_STEPS.BACKGROUND_SELECTION:
                return <Step5BackgroundSelection />;
            case WIZARD_STEPS.PATH_SELECTION:
                return <Step6PathSelection />;
            case WIZARD_STEPS.STAT_ALLOCATION:
                return <Step7StatAllocation />;
            case WIZARD_STEPS.SKILLS_LANGUAGES:
                return <Step8SkillsLanguages />;
            case WIZARD_STEPS.LORE_DETAILS:
                return <Step9LoreDetails />;
            case WIZARD_STEPS.EQUIPMENT_SELECTION:
                return <Step10EquipmentSelection />;
            case WIZARD_STEPS.CHARACTER_SUMMARY:
                return <Step11CharacterSummary />;
            default:
                return <Step1BasicInfo />;
        }
    };

    // Handle navigation
    const handleNext = () => {
        // Mark current step as completed if valid, but allow navigation regardless
        if (state.isValid) {
            dispatch(wizardActionCreators.markStepCompleted(state.currentStep));
        }
        dispatch(wizardActionCreators.nextStep());
    };

    const handlePrevious = () => {
        dispatch(wizardActionCreators.prevStep());
    };

    const handleStepClick = (stepNumber) => {
        // Allow navigation to any step
        dispatch(wizardActionCreators.setCurrentStep(stepNumber));
    };

    const handleComplete = () => {
        if (state.isValid && onComplete) {
            // Prepare character data for creation
            const characterData = {
                name: state.characterData.name,
                gender: state.characterData.gender,
                race: state.characterData.race,
                subrace: state.characterData.subrace,
                class: state.characterData.class,
                background: state.characterData.background,
                selectedSkills: state.characterData.selectedSkills,
                selectedLanguages: state.characterData.selectedLanguages,
                skillRanks: state.characterData.skillRanks,
                path: state.characterData.path,
                stats: state.characterData.finalStats,
                lore: state.characterData.lore,
                characterImage: state.characterData.characterImage,
                imageTransformations: state.characterData.imageTransformations,
                class_spells: state.characterData.class_spells
            };
            onComplete(characterData);
        }
    };

    const handleCancel = () => {
        dispatch(wizardActionCreators.resetWizard());
        if (onCancel) {
            onCancel();
        }
    };

    // Get step status for progress indicator
    const getStepStatus = (stepNumber) => {
        if (state.completedSteps.includes(stepNumber)) return 'completed';
        if (stepNumber === state.currentStep) return 'active';
        return 'pending';
    };

    const isFirstStep = state.currentStep === 1;
    const isLastStep = state.currentStep === state.totalSteps;
    const canProceed = true; // Always allow navigation between steps

    return (
        <div className="character-wizard-container">
            {/* Top Header with Exit, Progress, and User Info */}
            <div className="wizard-top-header">
                <div className="header-left">
                    <button
                        className="exit-wizard-btn"
                        onClick={handleCancel}
                        title="Exit Character Creation"
                    >
                        <i className="fas fa-arrow-left"></i>
                    </button>
                    <div className="wizard-title-section">
                        <h1 className="wizard-title">{isEditing ? 'Edit Character' : 'Character Creation'}</h1>
                        <p className="wizard-subtitle">{STEP_INFO[state.currentStep]?.description}</p>
                    </div>
                </div>

                <div className="header-center">
                    <div className="progress-steps-horizontal">
                        {Object.values(WIZARD_STEPS).map((stepNumber) => {
                            const stepInfo = STEP_INFO[stepNumber];
                            const status = getStepStatus(stepNumber);
                            const isLast = stepNumber === state.totalSteps;

                            return (
                                <React.Fragment key={stepNumber}>
                                    <div
                                        className={`progress-step-horizontal ${status}`}
                                        onClick={() => handleStepClick(stepNumber)}
                                    >
                                        <div className="step-circle-horizontal">
                                            {status === 'completed' ? (
                                                <i className="fas fa-check"></i>
                                            ) : (
                                                <span className="step-number">{stepNumber}</span>
                                            )}
                                        </div>
                                        <span className="step-name-horizontal">{stepInfo.name}</span>
                                    </div>
                                    {!isLast && <div className="step-connector"></div>}
                                </React.Fragment>
                            );
                        })}
                    </div>
                </div>

                <div className="header-right">
                    <div className="user-info">
                        <i className="fas fa-user"></i>
                        <span>{isEditing ? 'Editing Character' : 'Creating Character'}</span>
                    </div>
                </div>
            </div>

            {/* Main content area */}
            <div className="wizard-content">
                <div className="wizard-step-container">
                    {renderStep()}
                </div>
            </div>

            {/* Footer with navigation */}
            <div className="wizard-footer">
                <div className="wizard-navigation">
                    <div className="nav-left">
                        {!isFirstStep && (
                            <button
                                type="button"
                                className="wizard-btn wizard-btn-secondary"
                                onClick={handlePrevious}
                                disabled={isLoading}
                            >
                                <i className="fas fa-arrow-left"></i>
                                Previous
                            </button>
                        )}
                    </div>

                    <div className="nav-center">
                        <button
                            type="button"
                            className="wizard-btn wizard-btn-cancel"
                            onClick={handleCancel}
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                    </div>

                    <div className="nav-right">
                        {isLastStep ? (
                            <button
                                type="button"
                                className="wizard-btn wizard-btn-primary"
                                onClick={handleComplete}
                                disabled={!state.isValid || isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i>
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <i className="fas fa-check"></i>
                                        {isEditing ? 'Update Character' : 'Create Character'}
                                    </>
                                )}
                            </button>
                        ) : (
                            <button
                                type="button"
                                className="wizard-btn wizard-btn-primary"
                                onClick={handleNext}
                                disabled={isLoading}
                            >
                                Next
                                <i className="fas fa-arrow-right"></i>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// Main wrapper component with provider
const CharacterCreationWizard = (props) => {
    return (
        <CharacterWizardProvider>
            <CharacterCreationWizardContent {...props} />
        </CharacterWizardProvider>
    );
};

export default CharacterCreationWizard;
