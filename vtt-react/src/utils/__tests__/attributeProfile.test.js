/**
 * Shared attribute profile: regression probes for the character round-trip
 * (findings A-D). Uses the production helpers and the production wizard reducer.
 */
import {
    STATS_MODEL,
    ATTRIBUTE_IDS,
    getHeritageModifiers,
    getOriginModifiers,
    sumEarnedAttributes,
    resolveStatsModel,
    resolveAttributeProfile,
    getEffectiveAttributes,
    composeAttributes,
    planAttributeSave,
    isLegacyAttributesUntouched
} from '../attributeProfile';
import {
    characterWizardReducer,
    validateCurrentStep,
    initialState,
    ACTION_TYPES,
    getAttributeCorrectionNotice
} from '../../components/character-creation-wizard/context/CharacterWizardContext';

const heritage = { race: 'vreken', subrace: 'clean_vreken' };
const background = 'sanctuarySeneschal';
const base = { strength: 8, agility: 8, constitution: 8, intelligence: 8, spirit: 8, charisma: 8 };

const sum = (...maps) => {
    const out = {};
    ATTRIBUTE_IDS.forEach((id) => { out[id] = maps.reduce((total, map) => total + (map[id] || 0), 0); });
    return out;
};

const deepFreeze = (value) => {
    if (value && typeof value === 'object' && !Object.isFrozen(value)) {
        Object.freeze(value);
        Object.values(value).forEach(deepFreeze);
    }
    return value;
};

const history = (...picks) => {
    const out = {};
    picks.forEach((attributes, index) => { out[index + 2] = { attributes, healthIncrease: 4, manaIncrease: 2 }; });
    return out;
};

// An explicit-provenance record as the wizard saves it after level-ups: stats = base + earned.
const explicitRecord = (levelUpHistory = {}) => {
    const earned = sumEarnedAttributes(levelUpHistory);
    return {
        id: 'char_a', name: 'Aster', ...heritage, background, level: 1 + Object.keys(levelUpHistory).length,
        baseStats: { ...base },
        stats: sum(base, earned),
        statsModel: STATS_MODEL,
        levelUpHistory,
        health: { current: 7, max: 60 }, mana: { current: 3, max: 30 },
        class_spells: { known_spells: ['a', 'b', 'c'] }, selectedSkills: ['arcana'], ancestry: null,
        talents: { t1: true }
    };
};

// A record written before base provenance existed: wizard-authored, no baseStats, no marker.
const legacyRecord = (stats = { strength: 13, agility: 12, constitution: 12, intelligence: 11, spirit: 11, charisma: 10 }) => ({
    id: 'char_old', name: 'Old', ...heritage, background, level: 1, stats,
    selectedSkills: ['arcana'], lore: { backstory: 'x' }, class_spells: { known_spells: ['a', 'b', 'c'] }
});

describe('modifier sources', () => {
    test('heritage and origin come from the established data and are non-trivial for the fixtures', () => {
        const h = getHeritageModifiers(heritage.race, heritage.subrace);
        const o = getOriginModifiers(background);
        expect(Object.keys(h).sort()).toEqual([...ATTRIBUTE_IDS].sort());
        expect(Object.values(h).some((n) => n !== 0)).toBe(true);
        expect(Object.values(o).some((n) => n !== 0)).toBe(true);
    });
    test('missing heritage or origin contributes nothing', () => {
        expect(Object.values(getHeritageModifiers('', '')).every((n) => n === 0)).toBe(true);
        expect(Object.values(getOriginModifiers('')).every((n) => n === 0)).toBe(true);
    });
});

describe('explicit base/provenance records (B: heritage and origin applied once)', () => {
    test('effective = stats + heritage + origin, each exactly once', () => {
        const record = explicitRecord();
        const expected = sum(record.stats, getHeritageModifiers(heritage.race, heritage.subrace), getOriginModifiers(background));
        expect(getEffectiveAttributes(record)).toEqual(expected);
        expect(getEffectiveAttributes(record)).toEqual(composeAttributes(base, heritage.race, heritage.subrace, background));
    });
    test('the delta-era shape (baseStats without a marker) is explicit', () => {
        const record = { ...explicitRecord(), statsModel: undefined };
        expect(resolveStatsModel(record)).toBe(STATS_MODEL);
        expect(resolveAttributeProfile(record).explicit).toBe(true);
    });
    test('store-state shape: marker only, no baseStats', () => {
        const { baseStats, ...state } = explicitRecord();
        const profile = resolveAttributeProfile(state);
        expect(profile.explicit).toBe(true);
        expect(profile.needsCorrection).toBe(false);
        expect(profile.effective).toEqual(getEffectiveAttributes(explicitRecord()));
    });
});

describe('ambiguous legacy records (A: no guessed conversion)', () => {
    test('values are preserved: effective keeps today\'s arithmetic (stats + heritage, no origin)', () => {
        const record = legacyRecord();
        const profile = resolveAttributeProfile(record);
        expect(profile.explicit).toBe(false);
        expect(profile.base).toBeNull();
        expect(profile.effective).toEqual(sum(record.stats, getHeritageModifiers(heritage.race, heritage.subrace)));
    });
    test('wizard-authored legacy records ask for an explicit correction; plain records do not', () => {
        expect(resolveAttributeProfile(legacyRecord()).needsCorrection).toBe(true);
        const plain = { id: 'p', race: heritage.race, subrace: heritage.subrace, stats: { ...base } };
        expect(resolveAttributeProfile(plain).needsCorrection).toBe(false);
    });
    test('the wizard loads legacy values unchanged and never subtracts heritage', () => {
        const record = legacyRecord();
        const loaded = characterWizardReducer(initialState, { type: ACTION_TYPES.LOAD_CHARACTER, payload: record });
        expect(loaded.characterData.baseStats).toEqual(record.stats);
        expect(loaded.loadedAttributes.status).toBe('legacy');
        expect(getAttributeCorrectionNotice(loaded)).toMatch(/no recorded base/i);
    });
    test('untouched legacy attributes are not point-buy validated and are not rewritten on save', () => {
        const record = legacyRecord();
        const loaded = characterWizardReducer(initialState, { type: ACTION_TYPES.LOAD_CHARACTER, payload: record });
        expect(validateCurrentStep({ ...loaded, currentStep: 1 }).stats).toBeUndefined();
        expect(isLegacyAttributesUntouched(loaded.loadedAttributes, loaded.characterData.baseStats)).toBe(true);
        expect(planAttributeSave(record, loaded.characterData.baseStats, loaded.loadedAttributes)).toEqual({});
    });
    test('an explicit correction records the base once and adds earned gains from history', () => {
        const record = { ...legacyRecord(), levelUpHistory: history(['strength'], ['strength', 'agility']) };
        const loaded = characterWizardReducer(initialState, { type: ACTION_TYPES.LOAD_CHARACTER, payload: record });
        const corrected = { ...loaded.characterData.baseStats, strength: 8, agility: 8, constitution: 8, intelligence: 8, spirit: 8, charisma: 8 };
        const patch = planAttributeSave(record, corrected, loaded.loadedAttributes);
        expect(patch.statsModel).toBe(STATS_MODEL);
        expect(patch.baseStats).toEqual(corrected);
        expect(patch.stats.strength).toBe(8 + 2);
        expect(patch.stats.agility).toBe(8 + 1);
        expect(patch.stats.constitution).toBe(8);
        // And the corrected record is now explicit and applies origin once.
        const saved = { ...record, ...patch };
        expect(resolveAttributeProfile(saved).explicit).toBe(true);
        expect(getEffectiveAttributes(saved).strength).toBe(
            10 + getHeritageModifiers(heritage.race, heritage.subrace).strength + getOriginModifiers(background).strength
        );
    });
});

describe('earned level-up gains (C: neither lost nor double counted)', () => {
    const earnedHistory = history(['strength'], ['strength', 'spirit'], ['agility']);

    test('gains are recorded separately and are already inside stats', () => {
        const record = explicitRecord(earnedHistory);
        expect(sumEarnedAttributes(earnedHistory)).toMatchObject({ strength: 2, spirit: 1, agility: 1, constitution: 0 });
        expect(record.stats.strength).toBe(10);
        // Effective counts them exactly once.
        expect(getEffectiveAttributes(record).strength).toBe(
            10 + getHeritageModifiers(heritage.race, heritage.subrace).strength + getOriginModifiers(background).strength
        );
        expect(resolveAttributeProfile(record).needsReview).toBe(false);
    });
    test('the old single `attribute` history form is counted like the reducer reverses it', () => {
        expect(sumEarnedAttributes({ 2: { attribute: 'charisma' } }).charisma).toBe(1);
    });
    test('a no-op edit leaves stats exactly as stored', () => {
        const record = explicitRecord(earnedHistory);
        const patch = planAttributeSave(record, { ...record.baseStats }, { status: 'explicit', base: record.baseStats });
        expect(patch.stats).toEqual(record.stats);
        expect(patch.baseStats).toEqual(record.baseStats);
    });
    test('an edit that changes the base moves stats by that change only, keeping earned gains', () => {
        const record = explicitRecord(earnedHistory);
        const next = { ...record.baseStats, strength: 9, charisma: 7 };
        const patch = planAttributeSave(record, next, { status: 'explicit', base: record.baseStats });
        expect(patch.stats).toEqual({ ...record.stats, strength: record.stats.strength + 1, charisma: record.stats.charisma - 1 });
        expect(patch.baseStats).toEqual(next);
    });
    test('manual in-play adjustments survive an unrelated edit and are reported for review', () => {
        const record = { ...explicitRecord(earnedHistory), stats: { ...explicitRecord(earnedHistory).stats, constitution: 11 } };
        expect(resolveAttributeProfile(record).needsReview).toBe(true);
        const patch = planAttributeSave(record, { ...record.baseStats }, { status: 'explicit', base: record.baseStats });
        expect(patch.stats.constitution).toBe(11);
    });
    test('the pre-fix clobber shape (stats equal to base while history has gains) is preserved and flagged, not silently "repaired"', () => {
        const record = { ...explicitRecord(earnedHistory), stats: { ...base } };
        const profile = resolveAttributeProfile(record);
        expect(profile.needsReview).toBe(true);
        const patch = planAttributeSave(record, { ...base }, { status: 'explicit', base });
        expect(patch.stats).toEqual(record.stats);
    });
});

describe('repeated edit/save/reload cycles', () => {
    const roundTrip = (record) => {
        // reload into the wizard, complete without touching anything, merge as the account page does
        const loaded = characterWizardReducer(initialState, { type: ACTION_TYPES.LOAD_CHARACTER, payload: record });
        const patch = planAttributeSave(record, loaded.characterData.baseStats, loaded.loadedAttributes);
        return { ...record, ...patch, updatedAt: 'later' };
    };
    test('explicit record with earned gains is stable over many cycles', () => {
        const start = explicitRecord(history(['strength'], ['agility', 'agility'], ['spirit']));
        let record = start;
        for (let i = 0; i < 6; i += 1) record = roundTrip(record);
        expect(record.stats).toEqual(start.stats);
        expect(record.baseStats).toEqual(start.baseStats);
        expect(getEffectiveAttributes(record)).toEqual(getEffectiveAttributes(start));
        // everything the edit does not own is untouched, resources included
        expect(record.health).toEqual(start.health);
        expect(record.mana).toEqual(start.mana);
        expect(record.class_spells).toEqual(start.class_spells);
        expect(record.selectedSkills).toEqual(start.selectedSkills);
        expect(record.talents).toEqual(start.talents);
        expect(record.ancestry).toEqual(start.ancestry);
    });
    test('legacy record is byte-stable over many cycles (never silently converted)', () => {
        const start = legacyRecord();
        let record = start;
        for (let i = 0; i < 6; i += 1) record = roundTrip(record);
        expect(record.stats).toEqual(start.stats);
        expect(record.baseStats).toBeUndefined();
        expect(record.statsModel).toBeUndefined();
        expect(getEffectiveAttributes(record)).toEqual(getEffectiveAttributes(start));
    });
    test('create then edit-reload keeps the base and the effective attributes', () => {
        const created = { ...planAttributeSave(null, { ...base }) };
        expect(created).toEqual({ stats: base, baseStats: base, statsModel: STATS_MODEL });
        const record = { id: 'n', ...heritage, background, ...created };
        expect(roundTrip(record).stats).toEqual(base);
    });
});

describe('wizard preview agrees with play (D)', () => {
    test('final stats on load and on recalculation equal the play arithmetic for the same base', () => {
        const record = explicitRecord();
        const loaded = characterWizardReducer(initialState, { type: ACTION_TYPES.LOAD_CHARACTER, payload: record });
        expect(loaded.characterData.finalStats).toEqual(getEffectiveAttributes(record));
        const recalculated = characterWizardReducer(loaded, { type: ACTION_TYPES.RECALCULATE_FINAL_STATS });
        expect(recalculated.characterData.finalStats).toEqual(getEffectiveAttributes(record));
    });
    test('touching a legacy record\'s attributes ends the waiver and applies normal validation', () => {
        const loaded = characterWizardReducer(initialState, { type: ACTION_TYPES.LOAD_CHARACTER, payload: legacyRecord() });
        const touched = characterWizardReducer(loaded, { type: ACTION_TYPES.UPDATE_BASE_STATS, payload: { ...base, strength: 18 } });
        expect(getAttributeCorrectionNotice(touched)).toBeNull();
        expect(validateCurrentStep({ ...touched, currentStep: 1 }).stats).toBeTruthy();
    });
});

describe('character/account isolation', () => {
    test('helpers never mutate their inputs and characters do not share state', () => {
        const a = deepFreeze(explicitRecord(history(['strength'])));
        const b = deepFreeze({ ...legacyRecord(), id: 'char_b' });
        const ea = getEffectiveAttributes(a);
        const eb = getEffectiveAttributes(b);
        expect(getEffectiveAttributes(a)).toEqual(ea);
        expect(getEffectiveAttributes(b)).toEqual(eb);
        expect(() => planAttributeSave(a, { ...a.baseStats, strength: 9 }, { status: 'explicit', base: a.baseStats })).not.toThrow();
        expect(() => planAttributeSave(b, { ...b.stats, strength: 9 }, { status: 'legacy', base: b.stats })).not.toThrow();
        expect(a.stats.strength).toBe(9);
        expect(b.stats.strength).toBe(13);
    });
    test('a patch is computed only from the record it was given', () => {
        const a = explicitRecord(history(['strength']));
        const b = explicitRecord();
        const patchA = planAttributeSave(a, { ...a.baseStats, spirit: 9 }, { status: 'explicit', base: a.baseStats });
        const patchB = planAttributeSave(b, { ...b.baseStats }, { status: 'explicit', base: b.baseStats });
        expect(patchA.stats.strength).toBe(9);
        expect(patchB.stats.strength).toBe(8);
    });
});
