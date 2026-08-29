/**
 * Character Creation Wizard - Main Component
 *
 * Multi-step character creation wizard with background selection and stat allocation
 */

import React, { useEffect } from 'react';
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
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const orbMenuRef = React.useRef(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (orbMenuRef.current && !orbMenuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        if (isMenuOpen) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [isMenuOpen]);

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
        setIsMenuOpen(false);
    };

    const handleComplete = () => {
        if (state.isValid && onComplete) {
            // Prepare character data for creation
            const characterData = {
                name: state.characterData.name,
                gender: state.characterData.gender,
                alignment: state.characterData.alignment || 'Neutral Good',
                race: state.characterData.race,
                subrace: state.characterData.subrace,
                class: state.characterData.class,
                background: state.characterData.background,
                selectedSkills: state.characterData.selectedSkills,
                selectedLanguages: state.characterData.selectedLanguages,
                skillRanks: state.characterData.skillRanks,
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
    const currentStepInfo = STEP_INFO[state.currentStep] || STEP_INFO[WIZARD_STEPS.CORE_DRAFT];
    const { iconBackgroundImage } = state.characterData;
    const backdropValue = iconBackgroundImage
        ? `linear-gradient(rgba(0, 0, 0, 0.06), rgba(0, 0, 0, 0.18)), url(/assets/Backgrounds/${encodeURIComponent(iconBackgroundImage)})`
        : 'linear-gradient(135deg, #e8e2d2 0%, #d8cdb5 100%)'; // Darker sepia beige parchment

    const wizardStyle = {
        '--wizard-backdrop': backdropValue
    };

    return (
        <div className="character-wizard-container" style={wizardStyle}>
            {/* Top Header with Cancel and Step Title */}
            <div className="wizard-top-header">
                <div className="header-left">
                    <button
                        type="button"
                        className="wizard-btn wizard-btn-cancel"
                        onClick={handleCancel}
                        disabled={isLoading}
                        title="Cancel Character Creation"
                        aria-label="Cancel Character Creation"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="header-center">
                    <div className="wizard-header-title-block">
                        <span className="wizard-step-badge">
                            Step {state.currentStep} of {state.totalSteps}
                        </span>
                        <h2 className="wizard-step-title">
                            {currentStepInfo.name}
                        </h2>
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
                        <div className="header-step-counter-pill">
                            <span>{state.currentStep}/{state.totalSteps}</span>
                        </div>
                    )}
                </div>
            </div>

            {/* Main content area */}
            <div className={`wizard-content step-${state.currentStep}`}>
                <div className="wizard-step-container">
                    {renderStep()}
                </div>
            </div>

            {/* Floating Step Navigation Orb Cluster */}
            <div className="wizard-navigation-orb-cluster" ref={orbMenuRef}>
                {/* Previous Step Arrow Button */}
                <button
                    type="button"
                    className="wizard-orb-arrow prev"
                    onClick={handlePrevious}
                    disabled={isFirstStep || isLoading}
                    title="Previous step"
                    aria-label="Previous step"
                >
                    <i className="fas fa-chevron-left"></i>
                </button>

                {/* Central Step Orb (Like Cogwheel Orb) */}
                <div className="wizard-orb-wrapper">
                    <button
                        type="button"
                        className={`wizard-step-orb ${isMenuOpen ? 'active' : ''}`}
                        onClick={() => setIsMenuOpen(prev => !prev)}
                        title="Quick step navigation"
                        aria-label="Quick step navigation"
                    >
                        <span className="wizard-orb-step-label">Step</span>
                        <span className="wizard-orb-number">{state.currentStep}</span>
                    </button>

                    {/* Step Quick Jump Popover Menu */}
                    {isMenuOpen && (
                        <div className="wizard-orb-menu">
                            <div className="wizard-orb-menu-header">
                                <span>Navigate Steps</span>
                                <button type="button" className="orb-menu-close" onClick={() => setIsMenuOpen(false)}>
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>
                            <div className="wizard-orb-menu-list">
                                {Object.values(WIZARD_STEPS).map((stepNumber) => {
                                    const stepInfo = STEP_INFO[stepNumber];
                                    const status = getStepStatus(stepNumber);
                                    const isCurrent = stepNumber === state.currentStep;

                                    return (
                                        <button
                                            key={stepNumber}
                                            type="button"
                                            className={`wizard-orb-menu-item ${isCurrent ? 'current' : ''} ${status}`}
                                            onClick={() => handleStepClick(stepNumber)}
                                        >
                                            <span className="orb-menu-num">{stepNumber}</span>
                                            <div className="orb-menu-info">
                                                <span className="orb-menu-name">{stepInfo.name}</span>
                                                <span className="orb-menu-desc">{stepInfo.description}</span>
                                            </div>
                                            {status === 'completed' && <i className="fas fa-check orb-menu-check"></i>}
                                            {isCurrent && <span className="orb-menu-badge">Active</span>}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>

                {/* Next Step Arrow Button or Finish Check */}
                {isLastStep ? (
                    <button
                        type="button"
                        className="wizard-orb-arrow next finish"
                        onClick={handleComplete}
                        disabled={!state.isValid || isLoading}
                        title={isEditing ? 'Update Character' : 'Create Character'}
                        aria-label={isEditing ? 'Update Character' : 'Create Character'}
                    >
                        <i className="fas fa-check"></i>
                    </button>
                ) : (
                    <button
                        type="button"
                        className="wizard-orb-arrow next"
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
