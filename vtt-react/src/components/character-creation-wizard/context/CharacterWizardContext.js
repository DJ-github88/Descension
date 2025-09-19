/**
 * Character Creation Wizard Context
 * 
 * Manages state for the multi-step character creation wizard
 * Following patterns from creature and spell wizard contexts
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getDefaultStats, validateStats, calculateFinalStats } from '../../../utils/pointBuySystem';
import { getCustomBackgroundStartingPoints, getCustomBackgroundStatModifiers } from '../../../data/customBackgroundData';
import { applyRacialModifiers } from '../../../data/raceData';

// Wizard steps configuration
export const WIZARD_STEPS = {
    BASIC_INFO: 1,
    RACE_SELECTION: 2,
    CLASS_SELECTION: 3,
    BACKGROUND_SELECTION: 4,
    STAT_ALLOCATION: 5,
    CHARACTER_SUMMARY: 6
};

export const STEP_INFO = {
    [WIZARD_STEPS.BASIC_INFO]: {
        name: 'Basic Information',
        description: 'Character name and basic details',
        icon: 'fas fa-user'
    },
    [WIZARD_STEPS.RACE_SELECTION]: {
        name: 'Race & Subrace',
        description: 'Choose your character\'s heritage',
        icon: 'fas fa-users'
    },
    [WIZARD_STEPS.CLASS_SELECTION]: {
        name: 'Class',
        description: 'Select your character\'s profession',
        icon: 'fas fa-sword'
    },
    [WIZARD_STEPS.BACKGROUND_SELECTION]: {
        name: 'Background',
        description: 'Choose your character\'s history',
        icon: 'fas fa-book'
    },
    [WIZARD_STEPS.STAT_ALLOCATION]: {
        name: 'Ability Scores',
        description: 'Allocate your character\'s stats',
        icon: 'fas fa-chart-bar'
    },
    [WIZARD_STEPS.CHARACTER_SUMMARY]: {
        name: 'Summary',
        description: 'Review and finalize your character',
        icon: 'fas fa-check-circle'
    }
};

// Initial wizard state
const initialState = {
    // Wizard navigation
    currentStep: WIZARD_STEPS.BASIC_INFO,
    totalSteps: Object.keys(WIZARD_STEPS).length,
    completedSteps: [],
    
    // Character data
    characterData: {
        // Basic information
        name: '',
        gender: 'male',
        characterImage: null,
        imageTransformations: null,

        // Race and subrace
        race: '',
        subrace: '',

        // Class
        class: '',

        // Background
        background: '',

        // Stats (point-buy allocation)
        baseStats: getDefaultStats(),

        // Calculated final stats (with all modifiers)
        finalStats: getDefaultStats()
    },
    
    // Validation
    validationErrors: {},
    isValid: false,
    
    // UI state
    isLoading: false,
    error: null
};

// Action types
export const ACTION_TYPES = {
    // Navigation
    SET_CURRENT_STEP: 'SET_CURRENT_STEP',
    NEXT_STEP: 'NEXT_STEP',
    PREV_STEP: 'PREV_STEP',
    MARK_STEP_COMPLETED: 'MARK_STEP_COMPLETED',
    
    // Character data updates
    UPDATE_BASIC_INFO: 'UPDATE_BASIC_INFO',
    SET_RACE: 'SET_RACE',
    SET_SUBRACE: 'SET_SUBRACE',
    SET_CLASS: 'SET_CLASS',
    SET_BACKGROUND: 'SET_BACKGROUND',
    UPDATE_BASE_STATS: 'UPDATE_BASE_STATS',
    RECALCULATE_FINAL_STATS: 'RECALCULATE_FINAL_STATS',
    
    // Validation
    SET_VALIDATION_ERRORS: 'SET_VALIDATION_ERRORS',
    VALIDATE_CURRENT_STEP: 'VALIDATE_CURRENT_STEP',
    
    // Utility
    RESET_WIZARD: 'RESET_WIZARD',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR'
};

// Reducer function
const characterWizardReducer = (state, action) => {
    switch (action.type) {
        case ACTION_TYPES.SET_CURRENT_STEP:
            return {
                ...state,
                currentStep: action.payload
            };
            
        case ACTION_TYPES.NEXT_STEP:
            const nextStep = Math.min(state.currentStep + 1, state.totalSteps);
            return {
                ...state,
                currentStep: nextStep
            };
            
        case ACTION_TYPES.PREV_STEP:
            const prevStep = Math.max(state.currentStep - 1, 1);
            return {
                ...state,
                currentStep: prevStep
            };
            
        case ACTION_TYPES.MARK_STEP_COMPLETED:
            const stepToComplete = action.payload;
            const updatedCompletedSteps = state.completedSteps.includes(stepToComplete)
                ? state.completedSteps
                : [...state.completedSteps, stepToComplete];
            return {
                ...state,
                completedSteps: updatedCompletedSteps
            };
            
        case ACTION_TYPES.UPDATE_BASIC_INFO:
            return {
                ...state,
                characterData: {
                    ...state.characterData,
                    ...action.payload
                }
            };
            
        case ACTION_TYPES.SET_RACE:
            return {
                ...state,
                characterData: {
                    ...state.characterData,
                    race: action.payload,
                    subrace: '' // Reset subrace when race changes
                }
            };
            
        case ACTION_TYPES.SET_SUBRACE:
            return {
                ...state,
                characterData: {
                    ...state.characterData,
                    subrace: action.payload
                }
            };
            
        case ACTION_TYPES.SET_CLASS:
            return {
                ...state,
                characterData: {
                    ...state.characterData,
                    class: action.payload
                }
            };
            
        case ACTION_TYPES.SET_BACKGROUND:
            return {
                ...state,
                characterData: {
                    ...state.characterData,
                    background: action.payload
                }
            };
            
        case ACTION_TYPES.UPDATE_BASE_STATS:
            return {
                ...state,
                characterData: {
                    ...state.characterData,
                    baseStats: action.payload
                }
            };
            
        case ACTION_TYPES.RECALCULATE_FINAL_STATS:
            const { characterData } = state;
            
            // Get racial modifiers
            const racialModifiers = characterData.race && characterData.subrace
                ? applyRacialModifiers({}, characterData.race, characterData.subrace)
                : {};
            
            // Get background modifiers
            const backgroundModifiers = characterData.background
                ? getCustomBackgroundStatModifiers(characterData.background)
                : {};
            
            // Calculate final stats
            const finalStats = calculateFinalStats(
                characterData.baseStats,
                racialModifiers,
                backgroundModifiers
            );
            
            return {
                ...state,
                characterData: {
                    ...state.characterData,
                    finalStats
                }
            };
            
        case ACTION_TYPES.SET_VALIDATION_ERRORS:
            return {
                ...state,
                validationErrors: action.payload,
                isValid: Object.keys(action.payload).length === 0
            };
            
        case ACTION_TYPES.VALIDATE_CURRENT_STEP:
            const errors = validateCurrentStep(state);
            return {
                ...state,
                validationErrors: errors,
                isValid: Object.keys(errors).length === 0
            };
            
        case ACTION_TYPES.RESET_WIZARD:
            return {
                ...initialState
            };
            
        case ACTION_TYPES.SET_LOADING:
            return {
                ...state,
                isLoading: action.payload
            };
            
        case ACTION_TYPES.SET_ERROR:
            return {
                ...state,
                error: action.payload
            };
            
        default:
            throw new Error(`Unhandled action type: ${action.type}`);
    }
};

// Validation function for current step
const validateCurrentStep = (state) => {
    const errors = {};
    const { characterData, currentStep } = state;
    
    switch (currentStep) {
        case WIZARD_STEPS.BASIC_INFO:
            if (!characterData.name || characterData.name.trim().length === 0) {
                errors.name = 'Character name is required';
            } else if (characterData.name.trim().length < 2) {
                errors.name = 'Character name must be at least 2 characters';
            } else if (characterData.name.trim().length > 50) {
                errors.name = 'Character name must be 50 characters or less';
            }
            break;
            
        case WIZARD_STEPS.RACE_SELECTION:
            if (!characterData.race) {
                errors.race = 'Please select a race';
            } else if (!characterData.subrace) {
                // Only require subrace if a race is selected
                errors.subrace = 'Please select a subrace';
            }
            break;
            
        case WIZARD_STEPS.CLASS_SELECTION:
            if (!characterData.class) {
                errors.class = 'Please select a class';
            }
            break;
            
        case WIZARD_STEPS.BACKGROUND_SELECTION:
            if (!characterData.background) {
                errors.background = 'Please select a background';
            }
            break;
            
        case WIZARD_STEPS.STAT_ALLOCATION:
            const backgroundStartingPoints = characterData.background
                ? getCustomBackgroundStartingPoints(characterData.background)
                : 0;
            const statValidation = validateStats(characterData.baseStats, backgroundStartingPoints);
            if (!statValidation.isValid) {
                errors.stats = statValidation.errors.join(', ');
            }
            break;
            
        case WIZARD_STEPS.CHARACTER_SUMMARY:
            // Final validation - check all previous steps
            const allStepErrors = {};
            for (let step = 1; step < WIZARD_STEPS.CHARACTER_SUMMARY; step++) {
                const stepErrors = validateCurrentStep({ ...state, currentStep: step });
                Object.assign(allStepErrors, stepErrors);
            }
            Object.assign(errors, allStepErrors);
            break;
            
        default:
            break;
    }
    
    return errors;
};

// Create contexts
const CharacterWizardStateContext = createContext();
const CharacterWizardDispatchContext = createContext();

// Provider component
export function CharacterWizardProvider({ children }) {
    const [state, dispatch] = useReducer(characterWizardReducer, initialState);
    
    // Auto-recalculate final stats when relevant data changes
    useEffect(() => {
        dispatch({ type: ACTION_TYPES.RECALCULATE_FINAL_STATS });
    }, [
        state.characterData.baseStats,
        state.characterData.race,
        state.characterData.subrace,
        state.characterData.background
    ]);
    
    // Auto-validate current step when data changes
    useEffect(() => {
        dispatch({ type: ACTION_TYPES.VALIDATE_CURRENT_STEP });
    }, [state.currentStep, state.characterData]);
    
    return (
        <CharacterWizardStateContext.Provider value={state}>
            <CharacterWizardDispatchContext.Provider value={dispatch}>
                {children}
            </CharacterWizardDispatchContext.Provider>
        </CharacterWizardStateContext.Provider>
    );
}

// Custom hooks
export function useCharacterWizardState() {
    const context = useContext(CharacterWizardStateContext);
    if (context === undefined) {
        throw new Error('useCharacterWizardState must be used within a CharacterWizardProvider');
    }
    return context;
}

export function useCharacterWizardDispatch() {
    const context = useContext(CharacterWizardDispatchContext);
    if (context === undefined) {
        throw new Error('useCharacterWizardDispatch must be used within a CharacterWizardProvider');
    }
    return context;
}

// Action creators
export const wizardActionCreators = {
    setCurrentStep: (step) => ({ type: ACTION_TYPES.SET_CURRENT_STEP, payload: step }),
    nextStep: () => ({ type: ACTION_TYPES.NEXT_STEP }),
    prevStep: () => ({ type: ACTION_TYPES.PREV_STEP }),
    markStepCompleted: (step) => ({ type: ACTION_TYPES.MARK_STEP_COMPLETED, payload: step }),
    
    updateBasicInfo: (info) => ({ type: ACTION_TYPES.UPDATE_BASIC_INFO, payload: info }),
    setRace: (race) => ({ type: ACTION_TYPES.SET_RACE, payload: race }),
    setSubrace: (subrace) => ({ type: ACTION_TYPES.SET_SUBRACE, payload: subrace }),
    setClass: (characterClass) => ({ type: ACTION_TYPES.SET_CLASS, payload: characterClass }),
    setBackground: (background) => ({ type: ACTION_TYPES.SET_BACKGROUND, payload: background }),
    updateBaseStats: (stats) => ({ type: ACTION_TYPES.UPDATE_BASE_STATS, payload: stats }),
    
    setValidationErrors: (errors) => ({ type: ACTION_TYPES.SET_VALIDATION_ERRORS, payload: errors }),
    validateCurrentStep: () => ({ type: ACTION_TYPES.VALIDATE_CURRENT_STEP }),
    
    resetWizard: () => ({ type: ACTION_TYPES.RESET_WIZARD }),
    setLoading: (loading) => ({ type: ACTION_TYPES.SET_LOADING, payload: loading }),
    setError: (error) => ({ type: ACTION_TYPES.SET_ERROR, payload: error })
};
