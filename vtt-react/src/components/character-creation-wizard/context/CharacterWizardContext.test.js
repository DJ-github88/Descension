import {
    characterWizardReducer,
    validateCurrentStep,
    initialState,
    ACTION_TYPES
} from './CharacterWizardContext';
import { CLASS_PROVENANCE } from '../../../data/classHeritageRegistry';

const baseCharacter = {
    ...initialState.characterData,
    name: 'Testa',
    race: 'human',
    subrace: 'thalren_human',
    class: 'Gambit',
    background: 'sage',
    baseStats: { strength: 5, agility: 5, constitution: 5, intelligence: 5, spirit: 5, charisma: 5 },
    class_spells: { known_spells: [] }
};

test('LOAD_CHARACTER carries acquisition evidence/body states and records the original calling', () => {
    const loaded = characterWizardReducer(initialState, {
        type: ACTION_TYPES.LOAD_CHARACTER,
        payload: {
            name: 'Old',
            race: 'human',
            subrace: 'thalren_human',
            class: 'Gambit',
            classAcquisition: { Gambit: { qualification: { verified: true, source: 'House record' } } },
            bodyStates: ['surgical_scar']
        }
    });
    expect(loaded.characterData.classAcquisition.Gambit.qualification.source).toBe('House record');
    expect(loaded.characterData.bodyStates).toEqual(['surgical_scar']);
    expect(loaded.originalCalling).toEqual({ class: 'Gambit', race: 'human', subrace: 'thalren_human' });
});

test('CORE_DRAFT validation blocks an unsourced exceptional calling', () => {
    const state = { ...initialState, characterData: baseCharacter, currentStep: 1, originalCalling: null };
    expect(validateCurrentStep(state).class).toMatch(/acquisition/i);
});

test('CORE_DRAFT validation accepts a fully sourced exceptional calling', () => {
    const sourced = {
        ...baseCharacter,
        classAcquisition: {
            Gambit: {
                qualification: {
                    verified: true,
                    source: 'Merrowport House ledger',
                    fulfilledRequirements: CLASS_PROVENANCE.Gambit.requirements
                }
            }
        }
    };
    const state = { ...initialState, characterData: sourced, currentStep: 1, originalCalling: null };
    expect(validateCurrentStep(state).class).toBeUndefined();
});
