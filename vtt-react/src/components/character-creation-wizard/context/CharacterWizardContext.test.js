import {
    characterWizardReducer,
    validateCurrentStep,
    initialState,
    ACTION_TYPES,
    wizardActionCreators
} from './CharacterWizardContext';
import { CLASS_PROVENANCE } from '../../../data/classHeritageRegistry';
import { buildAncestry } from '../../../data/ancestryLoadouts';
import { PLAGUEBRINGER_CORE_SPELL_IDS } from '../../../data/classes/plaguebringerData';

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

test('Plaguebringer validation requires one optional pick beyond its core grants', () => {
    const plaguebringer = {
        ...baseCharacter,
        class: 'Plaguebringer',
        class_spells: {
            known_spells: [...PLAGUEBRINGER_CORE_SPELL_IDS, 'pb_venomous_touch']
        }
    };
    const state = { ...initialState, characterData: plaguebringer, currentStep: 1, originalCalling: null };
    expect(validateCurrentStep(state).spells).toBeUndefined();

    const missingPick = {
        ...state,
        characterData: {
            ...plaguebringer,
            class_spells: { known_spells: [...PLAGUEBRINGER_CORE_SPELL_IDS] }
        }
    };
    expect(validateCurrentStep(missingPick).spells).toMatch(/exactly 1 starting spell/i);
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

describe('Ancestral Gifts in CharacterWizardContext', () => {
    const grovenState = {
        ...initialState,
        characterData: {
            ...baseCharacter,
            race: 'groven',
            subrace: 'ithran_groven'
        }
    };

    test('SET_ANCESTRY_PICK records picks for current subrace and ignores invalid options', () => {
        const s1 = characterWizardReducer(grovenState, wizardActionCreators.setAncestryPick('traversal', 'ithran_chasm_leap'));
        expect(s1.characterData.ancestry.picks.traversal).toBe('ithran_chasm_leap');

        const sInvalid = characterWizardReducer(s1, wizardActionCreators.setAncestryPick('traversal', 'morgh_stone_scales'));
        expect(sInvalid.characterData.ancestry.picks.traversal).toBe('ithran_chasm_leap');
    });

    test('changing race or subrace clears ancestry picks unless returning to a sealed heritage', () => {
        const s1 = characterWizardReducer(grovenState, wizardActionCreators.setAncestryPick('traversal', 'ithran_chasm_leap'));
        const sSubraceChanged = characterWizardReducer(s1, wizardActionCreators.setSubrace('morgh_groven'));
        expect(sSubraceChanged.characterData.ancestry).toBeNull();

        const sRaceChanged = characterWizardReducer(s1, wizardActionCreators.setRace('human'));
        expect(sRaceChanged.characterData.ancestry).toBeNull();
    });

    test('sealed ancestry is read-only for its heritage and restored when switching back', () => {
        const sealed = {
            ...buildAncestry('ithran_groven', {
                traversal: 'ithran_chasm_leap',
                reading: 'toll_keepers_eye',
                hunt: 'fiber_cord_snare_ithran'
            }),
            finalizedAt: '2026-10-20T22:00:00.000Z'
        };
        const loaded = characterWizardReducer(initialState, {
            type: ACTION_TYPES.LOAD_CHARACTER,
            payload: {
                name: 'SealedGroven',
                race: 'groven',
                subrace: 'ithran_groven',
                class: 'Berserker',
                ancestry: sealed
            }
        });
        expect(loaded.sealedAncestry).toEqual(sealed);

        // Attempting to change pick on sealed heritage does nothing
        const afterAttempt = characterWizardReducer(loaded, wizardActionCreators.setAncestryPick('traversal', 'ithran_span_reach'));
        expect(afterAttempt.characterData.ancestry.picks.traversal).toBe('ithran_chasm_leap');

        // Switching to another subrace clears ancestry, switching back restores sealed
        const switched = characterWizardReducer(loaded, wizardActionCreators.setSubrace('morgh_groven'));
        expect(switched.characterData.ancestry).toBeNull();
        const restored = characterWizardReducer(switched, wizardActionCreators.setSubrace('ithran_groven'));
        expect(restored.characterData.ancestry).toEqual(sealed);
    });

    test('validation requires complete ancestry for new Groven characters but exempts legacy edits on original heritage', () => {
        expect(validateCurrentStep(grovenState).ancestry).toMatch(/Choose one Ancestral Gift/i);

        const completeAncestry = buildAncestry('ithran_groven', {
            traversal: 'ithran_chasm_leap',
            reading: 'toll_keepers_eye',
            hunt: 'fiber_cord_snare_ithran'
        });
        const completeState = {
            ...grovenState,
            characterData: { ...grovenState.characterData, ancestry: completeAncestry }
        };
        expect(validateCurrentStep(completeState).ancestry).toBeUndefined();

        // Legacy edit on same heritage without ancestry is exempt
        const legacyEditState = {
            ...grovenState,
            originalCalling: { class: 'Berserker', race: 'groven', subrace: 'ithran_groven' }
        };
        expect(validateCurrentStep(legacyEditState).ancestry).toBeUndefined();
    });
});
