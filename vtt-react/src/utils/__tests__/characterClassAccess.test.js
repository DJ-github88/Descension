import {
    getCharacterHeritageOptions,
    getCharacterClassAccess,
    validateCharacterClassAccess,
    isUnchangedCharacterCalling,
    CLASS_ACCESS_LABELS
} from '../characterClassAccess';
import { CLASS_PROVENANCE } from '../../data/classHeritageRegistry';

const gambitSource = 'Recorded House initiation';
const gambitQualification = {
    verified: true,
    source: gambitSource,
    fulfilledRequirements: CLASS_PROVENANCE.Gambit.requirements
};

test('options read the class-scoped acquisition record and current body states', () => {
    const character = {
        class: 'Gambit',
        race: 'human',
        subrace: 'thalren_human',
        classAcquisition: { Gambit: { method: 'engineered', qualification: gambitQualification } },
        bodyStates: ['surgery_incompatible_body']
    };
    expect(getCharacterHeritageOptions(character)).toMatchObject({
        method: 'engineered',
        qualification: gambitQualification,
        bodyStates: ['surgery_incompatible_body']
    });
});

test('a non-native class without evidence is a blocking error for new characters', () => {
    const result = validateCharacterClassAccess({ class: 'Gambit', race: 'human', subrace: 'thalren_human' }, null);
    expect(result.isValid).toBe(false);
    expect(result.access.status).toBe('requires-qualification');
    expect(result.errors.join(' ')).toMatch(/acquisition/i);
});

test('complete sourced qualification unlocks the exception and labels it', () => {
    const result = validateCharacterClassAccess({
        class: 'Gambit',
        race: 'human',
        subrace: 'thalren_human',
        classAcquisition: { Gambit: { qualification: gambitQualification } }
    }, null);
    expect(result.isValid).toBe(true);
    expect(result.access.status).toBe('qualified-exception');
    expect(CLASS_ACCESS_LABELS['qualified-exception']).toMatch(/qualified/i);
});

test('incompatible body/interface states block even native paths', () => {
    const native = validateCharacterClassAccess({
        class: 'Warden',
        race: 'groven',
        subrace: 'morgh_groven',
        bodyStates: ['surgery_incompatible_body']
    }, null);
    expect(native.isValid).toBe(false);
    expect(native.access.status).toBe('incompatible-state');
});

test('unchanged legacy characters retain a warning instead of a blocking error', () => {
    const character = { class: 'Gambit', race: 'human', subrace: 'thalren_human' };
    const original = { class: 'Gambit', race: 'human', subrace: 'thalren_human' };
    expect(isUnchangedCharacterCalling(character, original)).toBe(true);
    const result = validateCharacterClassAccess(character, original);
    expect(result.isValid).toBe(true);
    expect(result.warnings).toHaveLength(1);
    expect(result.errors).toHaveLength(0);
});

test('changing the calling away from a legacy selection becomes a blocking error', () => {
    const character = { class: 'Berserker', race: 'human', subrace: 'thalren_human' };
    const original = { class: 'Gambit', race: 'human', subrace: 'thalren_human' };
    expect(validateCharacterClassAccess(character, original).isValid).toBe(false);
});

test('an equivalent heritage alias does not count as a calling change', () => {
    const character = { class: 'Gambit', race: 'neth', subrace: 'kessen_neth' };
    const original = { class: 'Gambit', race: 'neth', subrace: 'Hallowed Neth' };
    expect(isUnchangedCharacterCalling(character, original)).toBe(true);
});
