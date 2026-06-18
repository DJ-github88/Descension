/**
 * Character Creation Wizard - Main Component
 *
 * Multi-step character creation wizard with background selection and stat allocation
 */

import React, { useEffect, useState } from 'react';
import ErrorBoundary from '../common/ErrorBoundary';
import { Analytics } from '../../services/analyticsService';
import { CharacterWizardProvider, useCharacterWizardState, useCharacterWizardDispatch, wizardActionCreators, WIZARD_STEPS, STEP_INFO } from './context/CharacterWizardContext';

// Import wizard steps
import Step1CoreDraft from './steps/Step1CoreDraft';
import Step2SkillsLanguages from './steps/Step7SkillsLanguages';
import Step3EquipmentSelection from './steps/Step10EquipmentSelection';
import Step4LoreDetails from './steps/Step8LoreDetails';
import Step5CharacterSummary from './steps/Step9CharacterSummary';


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
            case WIZARD_STEPS.CORE_DRAFT:
                return <Step1CoreDraft />;
            case WIZARD_STEPS.SKILLS_LANGUAGES:
                return <Step2SkillsLanguages />;
            case WIZARD_STEPS.EQUIPMENT_SELECTION:
                return <Step3EquipmentSelection />;
            case WIZARD_STEPS.LORE_DETAILS:
                return <Step4LoreDetails />;
            case WIZARD_STEPS.CHARACTER_SUMMARY:
                return <Step5CharacterSummary />;
            default:
                return <Step1CoreDraft />;
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
                path: '',
                selectedAbility: state.characterData.selectedAbility,
                stats: state.characterData.finalStats,
                lore: state.characterData.lore,
                characterImage: state.characterData.characterImage,
                imageTransformations: state.characterData.imageTransformations,
                characterIcon: state.characterData.characterIcon,
                iconBackgroundColor: state.characterData.iconBackgroundColor,
                iconBorderColor: state.characterData.iconBorderColor,
                iconBackgroundImage: state.characterData.iconBackgroundImage,
                iconScale: state.characterData.iconScale,
                iconOffsetX: state.characterData.iconOffsetX,
                iconOffsetY: state.characterData.iconOffsetY,
                iconBackgroundScale: state.characterData.iconBackgroundScale,
                iconBackgroundOffsetX: state.characterData.iconBackgroundOffsetX,
                iconBackgroundOffsetY: state.characterData.iconBackgroundOffsetY,
                class_spells: state.characterData.class_spells,
                selectedEquipment: state.characterData.selectedEquipment || [],
                remainingCurrency: state.characterData.remainingCurrency || {
                    platinum: 0,
                    gold: 0,
                    silver: 0,
                    copper: 0
                }
            };

            // Track character creation analytics
            Analytics.characterCreated({
                class: characterData.class,
                race: characterData.race,
                level: characterData.level,
                isEditing: isEditing
            });

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
    const { iconBackgroundImage } = state.characterData;
    const backdropValue = iconBackgroundImage
        ? `linear-gradient(rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0.18)), url(/assets/Backgrounds/${encodeURIComponent(iconBackgroundImage)})`
        : 'linear-gradient(135deg, #e8e2d2 0%, #d8cdb5 100%)'; // Darker sepia beige parchment

    const wizardStyle = {
        '--wizard-backdrop': backdropValue
    };

    return (
        <div className="character-wizard-container" style={wizardStyle}>
            {/* Top Header with Cancel, Progress, and Navigation */}
            <div className="wizard-top-header">
                <div className="header-left">
                    <button
                        type="button"
                        className="wizard-btn wizard-btn-cancel"
                        onClick={handleCancel}
                        disabled={isLoading}
                        title="Cancel Character Creation"
                    >
                        <i className="fas fa-times"></i> Cancel
                    </button>

                    {!isFirstStep && (
                        <button
                            type="button"
                            className="wizard-btn wizard-btn-icon wizard-btn-prev"
                            onClick={handlePrevious}
                            disabled={isLoading}
                            title="Previous step"
                            aria-label="Previous step"
                        >
                            <i className="fas fa-chevron-left"></i>
                        </button>
                    )}
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
                    {isLastStep ? (
                        <button
                            type="button"
                            className="wizard-btn wizard-btn-primary wizard-btn-create"
                            onClick={handleComplete}
                            disabled={!state.isValid || isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i> Creating...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-check"></i> {isEditing ? 'Update' : 'Create'}
                                </>
                            )}
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="wizard-btn wizard-btn-icon wizard-btn-next"
                            onClick={handleNext}
                            disabled={isLoading}
                            title="Next step"
                            aria-label="Next step"
                        >
                            <i className="fas fa-chevron-right"></i>
                        </button>
                    )}
                </div>
            </div>

            {/* Main content area */}
            <div className={`wizard-content step-${state.currentStep}`}>
                <div className="wizard-step-container">
                    {renderStep()}
                </div>
            </div>
        </div>
    );
};

// Main wrapper component with provider and error boundary
const CharacterCreationWizard = (props) => {
    return (
        <ErrorBoundary name="CharacterWizard">
            <CharacterWizardProvider>
                <CharacterCreationWizardContent {...props} />
            </CharacterWizardProvider>
        </ErrorBoundary>
    );
};

export default CharacterCreationWizard;
