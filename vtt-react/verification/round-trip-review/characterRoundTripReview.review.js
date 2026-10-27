/*
 * Copy to src/__tests__/characterRoundTripReview.test.js (imports are relative to src/__tests__).
 * Kept outside Jest's testMatch while A/B/C are open so other tracks' suites stay green;
 * adopt it as a permanent regression once all 8 cases pass.
 */
/**
 * Independent review probes — shared character round-trip (2026-10-27).
 * Production reducer and store only; no mirrored formulas. Each case names the
 * finding it guards (A–D). Expected-FAIL cases document a defect until fixed.
 */
import { characterWizardReducer, initialState, ACTION_TYPES } from '../components/character-creation-wizard/context/CharacterWizardContext';
import { applyRacialModifiers } from '../data/raceData';
import { getBackgroundStatModifiers } from '../data/backgroundData';
import useCharacterStore from '../store/characterStore';

const ABILITIES = ['strength', 'agility', 'constitution', 'intelligence', 'spirit', 'charisma'];
const RACE = 'myrathil';
const SUBRACE = 'shoreling_myrathil'; // Corali: +3 CHA +1 CON -2 STR
const ORIGIN = 'synodAcademic';       // Scholar: STR -2, INT +4
const BASE = { strength: 7, agility: 7, constitution: 8, intelligence: 10, spirit: 10, charisma: 7 };

const racial = () => applyRacialModifiers({}, RACE, SUBRACE);
const origin = () => getBackgroundStatModifiers(ORIGIN);
const add = (...parts) => Object.fromEntries(ABILITIES.map(k => [k, parts.reduce((n, p) => n + (p?.[k] || 0), 0)]));
const load = (record) => characterWizardReducer(initialState, { type: ACTION_TYPES.LOAD_CHARACTER, payload: record });

const fullRecord = (over = {}) => ({
    id: 'char_review_1', name: 'Review Fixture', race: RACE, subrace: SUBRACE, class: 'Doomsayer',
    background: ORIGIN, level: 1, selectedSkills: ['ritualMagic'], skillRanks: { arcana: 'NOVICE', ritualMagic: 'NOVICE' },
    selectedLanguages: ['Undercant', 'Scrapspeech'], class_spells: { known_spells: ['cr1_doomsayer_doom_bolt'] },
    ancestry: { heritageId: SUBRACE, picks: { reef: 'corali_coral_hide' }, finalizedAt: '2026-10-27T07:22:51.849Z' },
    classAcquisition: { Doomsayer: { method: 'recorded' } }, lore: { backstory: 'x' },
    baseStats: { ...BASE }, stats: { ...BASE }, levelUpHistory: {}, unknownLegacyField: { keep: true },
    ...over
});

describe('review: new-model record (explicit baseStats)', () => {
    test('LOAD keeps point-buy base and derives final = base + heritage + origin once', () => {
        const s = load(fullRecord());
        expect(s.characterData.baseStats).toEqual(BASE);
        expect(s.characterData.finalStats).toEqual(add(BASE, racial(), origin()));
    });

    test('LOAD preserves known spells, skills, ranks, languages, sealed ancestry and acquisition', () => {
        const r = fullRecord();
        const d = load(r).characterData;
        expect(d.class_spells).toEqual(r.class_spells);
        expect(d.selectedSkills).toEqual(r.selectedSkills);
        expect(d.skillRanks).toEqual(r.skillRanks);
        expect(d.selectedLanguages).toEqual(r.selectedLanguages);
        expect(d.ancestry).toEqual(r.ancestry);
        expect(d.classAcquisition).toEqual(r.classAcquisition);
    });

    test('LOAD of a valid record raises no CORE_DRAFT stat/spell errors (no overspend)', () => {
        const s = characterWizardReducer(load(fullRecord()), { type: ACTION_TYPES.VALIDATE_CURRENT_STEP });
        expect(s.validationErrors.stats).toBeUndefined();
        expect(s.validationErrors.spells).toBeUndefined();
    });
});

describe('review C: levelled character keeps earned attribute gains', () => {
    // Level 2 granted +1 strength: stats = base + earned, history records it.
    const levelled = () => fullRecord({
        level: 2, stats: { ...BASE, strength: BASE.strength + 1 },
        levelUpHistory: { 2: { attributes: ['strength'], healthIncrease: 0, manaIncrease: 0 } }
    });

    test('LOAD final attributes include earned gains exactly once', () => {
        const d = load(levelled()).characterData;
        expect(d.finalStats).toEqual(add(BASE, racial(), origin(), { strength: 1 }));
    });

    test('LOAD does not move earned gains into point-buy base (no overspend)', () => {
        const s = characterWizardReducer(load(levelled()), { type: ACTION_TYPES.VALIDATE_CURRENT_STEP });
        expect(s.characterData.baseStats).toEqual(BASE);
        expect(s.validationErrors.stats).toBeUndefined();
    });
});

describe('review A: ambiguous legacy record is preserved, not reconstructed', () => {
    // No baseStats/provenance. Skills/lore/spells do not prove the record is
    // wizard-final; stats may be base, base+racial, or base+earned.
    const legacy = () => {
        const r = fullRecord({ stats: { strength: 5, agility: 7, constitution: 9, intelligence: 10, spirit: 10, charisma: 10 } });
        delete r.baseStats;
        return r;
    };

    test('LOAD does not subtract current heritage/origin modifiers to invent a base', () => {
        const d = load(legacy()).characterData;
        const invented = add(legacy().stats, Object.fromEntries(ABILITIES.map(k => [k, -(racial()[k] || 0)])));
        expect(d.baseStats).not.toEqual(invented);
    });
});

describe('review B/D: play applies the same authored contributions as creation', () => {
    test('store effective stats include origin modifiers (matches wizard final)', () => {
        useCharacterStore.setState({ race: RACE, subrace: SUBRACE, background: ORIGIN, stats: { ...BASE } });
        const effective = useCharacterStore.getState().getEffectiveStats();
        const wizardFinal = load(fullRecord()).characterData.finalStats;
        ABILITIES.forEach(k => expect(effective[k]).toBe(wizardFinal[k]));
    });
});

describe('review: repeated no-op reopen is stable', () => {
    test('three LOAD cycles from the same record produce identical stat state', () => {
        const a = load(fullRecord()).characterData;
        const b = load({ ...fullRecord(), baseStats: a.baseStats }).characterData;
        const c = load({ ...fullRecord(), baseStats: b.baseStats }).characterData;
        expect([b.baseStats, c.baseStats]).toEqual([a.baseStats, a.baseStats]);
        expect([b.finalStats, c.finalStats]).toEqual([a.finalStats, a.finalStats]);
    });
});
