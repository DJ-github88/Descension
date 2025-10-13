/**
 * Character Creation Wizard Context
 * 
 * Manages state for the multi-step character creation wizard
 * Following patterns from creature and spell wizard contexts
 */

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { getDefaultStats, validateStats, calculateFinalStats } from '../../../utils/pointBuySystem';
import { getPathStartingPoints, getPathStatModifiers } from '../../../data/pathData';
import { applyRacialModifiers } from '../../../data/raceData';

// Wizard steps configuration
export const WIZARD_STEPS = {
    BASIC_INFO: 1,
    RACE_SELECTION: 2,
    CLASS_SELECTION: 3,
    BACKGROUND_SELECTION: 4,
    PATH_SELECTION: 5,
    STAT_ALLOCATION: 6,
    SKILLS_LANGUAGES: 7,
    LORE_DETAILS: 8,
    EQUIPMENT_SELECTION: 9,
    CHARACTER_SUMMARY: 10
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
    [WIZARD_STEPS.PATH_SELECTION]: {
        name: 'Path',
        description: 'Select your character\'s path',
        icon: 'fas fa-route'
    },
    [WIZARD_STEPS.STAT_ALLOCATION]: {
        name: 'Ability Scores',
        description: 'Allocate your character\'s stats',
        icon: 'fas fa-chart-bar'
    },
    [WIZARD_STEPS.SKILLS_LANGUAGES]: {
        name: 'Skills & Languages',
        description: 'Choose proficiencies and languages',
        icon: 'fas fa-cogs'
    },
    [WIZARD_STEPS.LORE_DETAILS]: {
        name: 'Lore & Details',
        description: 'Define backstory and personality',
        icon: 'fas fa-scroll'
    },
    [WIZARD_STEPS.EQUIPMENT_SELECTION]: {
        name: 'Starting Equipment',
        description: 'Purchase your starting gear',
        icon: 'fas fa-shopping-bag'
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

        // Background (standard D&D backgrounds)
        background: '',

        // Skills and Languages
        selectedSkills: [],
        selectedLanguages: [],

        // Path (custom paths like Mystic, Zealot, etc.)
        path: '',
        subPath: '',
        selectedAbilities: [], // Array of ability IDs (max 1)

        // Stats (point-buy allocation)
        baseStats: getDefaultStats(),

        // Calculated final stats (with all modifiers)
        finalStats: getDefaultStats(),

        // Lore and personality
        lore: {
            backstory: '',
            personalityTraits: '',
            ideals: '',
            bonds: '',
            flaws: '',
            appearance: '',
            goals: '',
            fears: '',
            allies: '',
            enemies: '',
            organizations: '',
            notes: ''
        },

        // Starting equipment and currency
        startingCurrency: null,
        selectedEquipment: [],
        remainingCurrency: null
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
    SET_SKILLS: 'SET_SKILLS',
    SET_LANGUAGES: 'SET_LANGUAGES',
    SET_PATH: 'SET_PATH',
    SET_SUBPATH: 'SET_SUBPATH',
    SET_SELECTED_ABILITIES: 'SET_SELECTED_ABILITIES',
    UPDATE_LORE: 'UPDATE_LORE',
    UPDATE_BASE_STATS: 'UPDATE_BASE_STATS',
    RECALCULATE_FINAL_STATS: 'RECALCULATE_FINAL_STATS',

    // Validation
    SET_VALIDATION_ERRORS: 'SET_VALIDATION_ERRORS',
    VALIDATE_CURRENT_STEP: 'VALIDATE_CURRENT_STEP',

    // Utility
    RESET_WIZARD: 'RESET_WIZARD',
    SET_LOADING: 'SET_LOADING',
    SET_ERROR: 'SET_ERROR',

    // Edit mode
    LOAD_CHARACTER: 'LOAD_CHARACTER'
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

        case ACTION_TYPES.SET_SKILLS:
            return {
                ...state,
                characterData: {
                    ...state.characterData,
                    selectedSkills: action.payload
                }
            };

        case ACTION_TYPES.SET_LANGUAGES:
            return {
                ...state,
                characterData: {
                    ...state.characterData,
                    selectedLanguages: action.payload
                }
            };

        case ACTION_TYPES.SET_PATH:
            return {
                ...state,
                characterData: {
                    ...state.characterData,
                    path: action.payload,
                    // Reset subpath and abilities when path changes
                    subPath: '',
                    selectedAbilities: []
                }
            };

        case ACTION_TYPES.SET_SUBPATH:
            return {
                ...state,
                characterData: {
                    ...state.characterData,
                    subPath: action.payload,
                    // Reset abilities when subpath changes
                    selectedAbilities: []
                }
            };

        case ACTION_TYPES.SET_SELECTED_ABILITIES:
            return {
                ...state,
                characterData: {
                    ...state.characterData,
                    selectedAbilities: action.payload
                }
            };

        case ACTION_TYPES.UPDATE_LORE:
            return {
                ...state,
                characterData: {
                    ...state.characterData,
                    lore: {
                        ...state.characterData.lore,
                        ...action.payload
                    }
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

            // Get path modifiers (paths provide stat bonuses, not backgrounds)
            const pathModifiers = characterData.path
                ? getPathStatModifiers(characterData.path)
                : {};

            // Calculate final stats
            const finalStats = calculateFinalStats(
                characterData.baseStats,
                racialModifiers,
                pathModifiers
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

        case ACTION_TYPES.LOAD_CHARACTER:
            // Load existing character data for editing
            const existingChar = action.payload;
            return {
                ...state,
                characterData: {
                    // Basic information
                    name: existingChar.name || '',
                    gender: existingChar.gender || 'male',
                    characterImage: existingChar.lore?.characterImage || existingChar.characterImage || null,
                    imageTransformations: existingChar.lore?.imageTransformations || existingChar.imageTransformations || null,

                    // Race and subrace
                    race: existingChar.race || '',
                    subrace: existingChar.subrace || '',

                    // Class
                    class: existingChar.class || '',

                    // Background
                    background: existingChar.background || '',

                    // Skills and Languages
                    selectedSkills: existingChar.selectedSkills || [],
                    selectedLanguages: existingChar.selectedLanguages || [],

                    // Path
                    path: existingChar.path || '',
                    subPath: existingChar.subPath || '',
                    selectedAbilities: existingChar.selectedAbilities || [],

                    // Stats - use existing stats or defaults
                    baseStats: existingChar.stats || getDefaultStats(),
                    finalStats: existingChar.stats || getDefaultStats(),

                    // Lore
                    lore: existingChar.lore || {
                        backstory: '',
                        personalityTraits: '',
                        ideals: '',
                        bonds: '',
                        flaws: '',
                        appearance: '',
                        goals: '',
                        fears: '',
                        allies: '',
                        enemies: '',
                        organizations: '',
                        notes: ''
                    },

                    // Equipment (if available from character)
                    startingCurrency: existingChar.inventory?.currency || null,
                    selectedEquipment: existingChar.inventory?.items || [],
                    remainingCurrency: existingChar.inventory?.currency || null
                },
                // Mark all steps as completed for existing character
                completedSteps: Object.values(WIZARD_STEPS)
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

        case WIZARD_STEPS.PATH_SELECTION:
            if (!characterData.path) {
                errors.path = 'Please select a path';
            }
            if (!characterData.subPath) {
                errors.subPath = 'Please select a specialization';
            }
            if (!characterData.selectedAbilities || characterData.selectedAbilities.length !== 1) {
                errors.abilities = 'Please select exactly 1 ability';
            }
            break;

        case WIZARD_STEPS.LORE_SKILLS:
            // Skills, languages, and lore are optional, no validation needed
            break;

        case WIZARD_STEPS.STAT_ALLOCATION:
            const pathStartingPoints = characterData.path
                ? getPathStartingPoints(characterData.path)
                : 0;
            const statValidation = validateStats(characterData.baseStats, pathStartingPoints);
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
        state.characterData.path
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
    setSkills: (skills) => ({ type: ACTION_TYPES.SET_SKILLS, payload: skills }),
    setLanguages: (languages) => ({ type: ACTION_TYPES.SET_LANGUAGES, payload: languages }),
    setPath: (path) => ({ type: ACTION_TYPES.SET_PATH, payload: path }),
    setSubPath: (subPath) => ({ type: ACTION_TYPES.SET_SUBPATH, payload: subPath }),
    setSelectedAbilities: (abilities) => ({ type: ACTION_TYPES.SET_SELECTED_ABILITIES, payload: abilities }),
    updateLore: (lore) => ({ type: ACTION_TYPES.UPDATE_LORE, payload: lore }),
    updateBaseStats: (stats) => ({ type: ACTION_TYPES.UPDATE_BASE_STATS, payload: stats }),

    setValidationErrors: (errors) => ({ type: ACTION_TYPES.SET_VALIDATION_ERRORS, payload: errors }),
    validateCurrentStep: () => ({ type: ACTION_TYPES.VALIDATE_CURRENT_STEP }),

    resetWizard: () => ({ type: ACTION_TYPES.RESET_WIZARD }),
    setLoading: (loading) => ({ type: ACTION_TYPES.SET_LOADING, payload: loading }),
    setError: (error) => ({ type: ACTION_TYPES.SET_ERROR, payload: error }),

    loadCharacter: (character) => ({ type: ACTION_TYPES.LOAD_CHARACTER, payload: character })
};
