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
import { CLASS_DATA_MAP } from '../../../data/classSpellGenerator';
import { applyRacialModifiers } from '../../../data/raceData';
import { getBackgroundStatModifiers } from '../../../data/backgroundData';
import { calculateFinalStats } from '../../../utils/pointBuySystem';
import { getSelectableClassNames } from '../../../data/classes/classDisplayData';

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

test('edit validation excludes earned earlier-pool picks from a three-pick starting quota', () => {
    const inquisitor = {
        ...baseCharacter,
        class: 'Inquisitor',
        subrace: 'thalren_human',
        class_spells: {
            known_spells: [
                'inq_iron_interrogation',
                'inq_detect_corruption',
                'inq_null_salt_ward',
                'inq_scent_of_ash'
            ]
        },
        levelUpHistory: {
            2: { spellId: 'inq_scent_of_ash', attributes: [] }
        }
    };
    const state = { ...initialState, characterData: inquisitor, currentStep: 1, originalCalling: null };
    expect(validateCurrentStep(state).spells).toBeUndefined();

    const missingStartingPick = {
        ...state,
        characterData: {
            ...inquisitor,
            class_spells: {
                known_spells: ['inq_iron_interrogation', 'inq_scent_of_ash']
            }
        }
    };
    expect(validateCurrentStep(missingStartingPick).spells).toMatch(/exactly 3 starting spells/i);
});

test('edit validation excludes earned earlier-pool picks from a one-pick starting quota', () => {
    const gambler = {
        ...baseCharacter,
        class: 'Gambler',
        subrace: 'merryn_human',
        class_spells: {
            known_spells: [
                'cr1_gambler_wager_strike',
                'cr1_gambler_recut',
                'cr1_gambler_lucky_toss',
                'cr1_gambler_beginners_cover'
            ]
        },
        levelUpHistory: {
            2: { spellId: 'cr1_gambler_beginners_cover', attributes: [] }
        }
    };
    const state = { ...initialState, characterData: gambler, currentStep: 1, originalCalling: null };
    expect(validateCurrentStep(state).spells).toBeUndefined();

    const missingStartingPick = {
        ...state,
        characterData: {
            ...gambler,
            class_spells: {
                known_spells: [
                    'cr1_gambler_wager_strike',
                    'cr1_gambler_recut',
                    'cr1_gambler_beginners_cover'
                ]
            }
        }
    };
    expect(validateCurrentStep(missingStartingPick).spells).toMatch(/exactly 1 starting spell/i);
});

describe('All canonical classes distinguish starting picks from earned spells', () => {
    const CANONICAL_CLASSES = getSelectableClassNames();

    test('canonical roster exposes approved classes (26 classes)', () => {
        expect(CANONICAL_CLASSES).toHaveLength(26);
    });

    test.each(CANONICAL_CLASSES)(
        '%s retains an earned earlier-pool spell without consuming a starting pick',
        (className) => {
            const classData = CLASS_DATA_MAP[className];
            const policy = classData?.progression?.policy;
            const startingPicks = policy?.startingSpellPicks ?? 3;
            const levelOnePool = classData.spellPools?.[1] || [];
            const startingSelections = levelOnePool.slice(0, startingPicks);
            expect(startingSelections).toHaveLength(startingPicks);

            // Prefer an extra level-1 option (the reported earlier-pool case);
            // otherwise any later-legal spell still proves the same separation.
            const earnedSpell = levelOnePool.find(id => !startingSelections.includes(id))
                || Object.entries(classData.spellPools || {})
                    .filter(([level]) => Number(level) > 1)
                    .flatMap(([, ids]) => ids)
                    .find(id => !startingSelections.includes(id));
            expect(earnedSpell).toBeTruthy();

            const laterPoolSpell = Object.entries(classData.spellPools || {})
                .filter(([level]) => Number(level) > 1)
                .flatMap(([, ids]) => ids)
                .find(id => id !== earnedSpell && !startingSelections.includes(id));

            const known = [...new Set([
                ...(policy?.grantedCoreSpellIds || []),
                ...startingSelections,
                earnedSpell,
                ...(laterPoolSpell ? [laterPoolSpell] : [])
            ])];
            const characterData = {
                ...baseCharacter,
                class: className,
                class_spells: { known_spells: known },
                levelUpHistory: {
                    2: { spellId: earnedSpell, attributes: [] },
                    ...(laterPoolSpell ? { 3: { spellId: laterPoolSpell, attributes: [] } } : {})
                }
            };
            const state = {
                ...initialState,
                characterData,
                currentStep: 1,
                originalCalling: { class: className, race: 'human', subrace: 'thalren_human' }
            };

            expect(validateCurrentStep(state).spells).toBeUndefined();

            const missingStartingPick = known.filter(id => id !== startingSelections[0]);
            const errors = validateCurrentStep({
                ...state,
                characterData: {
                    ...characterData,
                    class_spells: { known_spells: missingStartingPick }
                }
            });
            expect(errors.spells).toMatch(
                new RegExp(`exactly ${startingPicks} starting spell`, 'i')
            );
        }
    );
});

describe('Edit-load character round-trip', () => {
    const baseStats = {
        strength: 8, agility: 8, constitution: 8,
        intelligence: 8, spirit: 8, charisma: 8
    };
    const heritage = { race: 'vreken', subrace: 'clean_vreken' };
    const background = 'sanctuarySeneschal';
    const racialModifiers = applyRacialModifiers({}, heritage.race, heritage.subrace);
    const backgroundModifiers = getBackgroundStatModifiers(background);
    const legacyFinalStats = applyRacialModifiers({ ...baseStats }, heritage.race, heritage.subrace);

    test('restores class_spells and selectedAbility so edit validation keeps known picks', () => {
        const loaded = characterWizardReducer(initialState, {
            type: ACTION_TYPES.LOAD_CHARACTER,
            payload: {
                name: 'Vesper Gloomwell',
                ...heritage,
                class: 'Plaguebringer',
                background,
                class_spells: { known_spells: [...PLAGUEBRINGER_CORE_SPELL_IDS, 'pb_venomous_touch'] },
                selectedAbility: 'pb_venomous_touch',
                stats: baseStats,
                baseStats
            }
        });

        expect(loaded.characterData.class_spells).toEqual({
            known_spells: [...PLAGUEBRINGER_CORE_SPELL_IDS, 'pb_venomous_touch']
        });
        expect(loaded.characterData.selectedAbility).toBe('pb_venomous_touch');
    });

    test('loads levelUpHistory so earned earlier-pool picks are not treated as starting picks', () => {
        const loaded = characterWizardReducer(initialState, {
            type: ACTION_TYPES.LOAD_CHARACTER,
            payload: {
                name: 'Earned Pick',
                race: 'human',
                subrace: 'thalren_human',
                class: 'Inquisitor',
                background: 'sage',
                class_spells: {
                    known_spells: [
                        'inq_iron_interrogation',
                        'inq_detect_corruption',
                        'inq_null_salt_ward',
                        'inq_scent_of_ash'
                    ]
                },
                levelUpHistory: {
                    2: { spellId: 'inq_scent_of_ash', attributes: [] }
                },
                stats: { strength: 5, agility: 5, constitution: 5, intelligence: 5, spirit: 5, charisma: 5 },
                baseStats: { strength: 5, agility: 5, constitution: 5, intelligence: 5, spirit: 5, charisma: 5 }
            }
        });

        expect(loaded.characterData.levelUpHistory).toEqual({
            2: { spellId: 'inq_scent_of_ash', attributes: [] }
        });
        expect(validateCurrentStep({ ...loaded, currentStep: 1 }).spells).toBeUndefined();
    });

    test('uses persisted baseStats and derives final stats exactly once', () => {
        const loaded = characterWizardReducer(initialState, {
            type: ACTION_TYPES.LOAD_CHARACTER,
            payload: {
                name: 'Vesper Gloomwell',
                ...heritage,
                class: 'Plaguebringer',
                background,
                selectedSkills: ['arcana'],
                stats: baseStats,
                baseStats
            }
        });

        expect(loaded.characterData.baseStats).toEqual(baseStats);
        expect(loaded.characterData.finalStats).toEqual(
            calculateFinalStats(baseStats, racialModifiers, backgroundModifiers)
        );
        const statError = validateCurrentStep({ ...loaded, currentStep: 1 }).stats || '';
        expect(statError).not.toMatch(/below|too many/i);
    });

    test('keeps a legacy wizard payload\'s stored attributes unchanged and flags an explicit correction (no guessed base)', () => {
        const loaded = characterWizardReducer(initialState, {
            type: ACTION_TYPES.LOAD_CHARACTER,
            payload: {
                name: 'Vesper Gloomwell',
                ...heritage,
                class: 'Plaguebringer',
                background,
                selectedSkills: ['arcana'],
                lore: { backstory: 'Keeper of the crypt-lights.' },
                stats: legacyFinalStats
            }
        });

        // Values are preserved exactly; the wizard no longer subtracts heritage to invent a base.
        expect(loaded.characterData.baseStats).toEqual(legacyFinalStats);
        expect(loaded.loadedAttributes.status).toBe('legacy');
        expect(loaded.loadedAttributes.needsCorrection).toBe(true);
    });

    test('treats stats as base for non-wizard records without an explicit base field', () => {
        const loaded = characterWizardReducer(initialState, {
            type: ACTION_TYPES.LOAD_CHARACTER,
            payload: {
                name: 'Rook',
                ...heritage,
                class: 'Berserker',
                stats: baseStats
            }
        });

        expect(loaded.characterData.baseStats).toEqual(baseStats);
    });

    test('RECALCULATE_FINAL_STATS includes origin/background modifiers', () => {
        const state = {
            ...initialState,
            characterData: {
                ...initialState.characterData,
                ...heritage,
                background,
                baseStats
            }
        };

        const recalculated = characterWizardReducer(state, { type: ACTION_TYPES.RECALCULATE_FINAL_STATS });
        expect(recalculated.characterData.finalStats).toEqual(
            calculateFinalStats(baseStats, racialModifiers, backgroundModifiers)
        );
    });
});

describe('Ancestral Gifts in CharacterWizardContext', () => {    const grovenState = {
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
