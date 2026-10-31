/**
 * Attribute profile through the real character store: load, level up/down,
 * canonical save and the character-sheet breakdown must agree (findings B-D).
 */
import useCharacterStore from '../characterStore';
import '../inventoryStore';
import { assembleCharacterWorkingData } from '../characterHelpers';
import { getAttributeBreakdown } from '../../utils/statCalculationBreakdown';
import {
    STATS_MODEL,
    ATTRIBUTE_IDS,
    getEffectiveAttributes,
    getHeritageModifiers,
    getOriginModifiers
} from '../../utils/attributeProfile';

jest.mock('firebase/firestore', () => ({
    doc: jest.fn(), getDoc: jest.fn(), setDoc: jest.fn(), updateDoc: jest.fn(), collection: jest.fn(),
    getDocs: jest.fn(), writeBatch: jest.fn(), serverTimestamp: () => 'server-ts', deleteDoc: jest.fn()
}));
jest.mock('../../config/firebase', () => ({
    db: {}, auth: { currentUser: { uid: 'user-a' } }, isMockOrDevUser: () => false
}));

const heritage = { race: 'vreken', subrace: 'clean_vreken' };
const background = 'sanctuarySeneschal';
const base = { strength: 8, agility: 8, constitution: 8, intelligence: 8, spirit: 8, charisma: 8 };
const inventory = { items: [], currency: { platinum: 0, gold: 0, silver: 0, copper: 0 }, encumbranceState: 'normal' };

const explicit = {
    id: 'char_explicit', name: 'Aster', ...heritage, background, class: 'Berserker', level: 1,
    baseStats: { ...base }, stats: { ...base }, statsModel: STATS_MODEL, levelUpHistory: {},
    health: { current: 7, max: 60 }, mana: { current: 3, max: 30 }, class_spells: { known_spells: [] }
};
const legacy = {
    id: 'char_legacy', name: 'Old', ...heritage, background, class: 'Berserker', level: 1,
    stats: { strength: 13, agility: 12, constitution: 12, intelligence: 11, spirit: 11, charisma: 10 },
    selectedSkills: ['arcana'], lore: { backstory: 'x' }, class_spells: { known_spells: [] },
    health: { current: 9, max: 60 }, mana: { current: 4, max: 30 }
};

const load = (record, others = []) => {
    useCharacterStore.setState({ characters: [record, ...others] });
    useCharacterStore.getState().loadCharacter(record.id);
};

const sheetBreakdown = () => {
    const s = useCharacterStore.getState();
    const context = {
        stats: s.stats, equipment: s.equipment, race: s.race, subrace: s.subrace, level: s.level,
        levelUpHistory: s.levelUpHistory, background: s.background, statsModel: s.statsModel,
        encumbranceState: 'normal', exhaustionLevel: 0, talents: []
    };
    const out = {};
    ATTRIBUTE_IDS.forEach((id) => { out[id] = getAttributeBreakdown(id, context).finalValue; });
    return out;
};

describe('attribute profile in the real store', () => {
    beforeEach(() => {
        jest.spyOn(console, 'log').mockImplementation(() => {});
        jest.spyOn(console, 'warn').mockImplementation(() => {});
        jest.spyOn(console, 'error').mockImplementation(() => {});
    });
    afterEach(() => jest.restoreAllMocks());

    test('explicit load: store marker set and play/sheet agree on one effective value (heritage + origin once)', () => {
        load(explicit);
        const s = useCharacterStore.getState();
        expect(s.statsModel).toBe(STATS_MODEL);
        const expected = {};
        ATTRIBUTE_IDS.forEach((id) => {
            expected[id] = base[id] + getHeritageModifiers(heritage.race, heritage.subrace)[id] + getOriginModifiers(background)[id];
        });
        expect(s.getEffectiveStats()).toEqual(expected);
        expect(sheetBreakdown()).toEqual(expected);
    });

    test('level-up adds the gain once everywhere; level-down removes it; resources are not refilled', () => {
        load(explicit);
        const before = getEffectiveAttributes(useCharacterStore.getState());
        const healthBefore = useCharacterStore.getState().health.current;

        useCharacterStore.setState({ level: 2, pendingLevelUpInfo: { newLevel: 2, oldLevel: 1 } });
        useCharacterStore.getState().handleLevelUpChoice({ healthIncrease: 4, manaIncrease: 2, attributes: ['strength'] });
        let s = useCharacterStore.getState();
        expect(s.stats.strength).toBe(base.strength + 1);
        expect(s.levelUpHistory[2].attributes).toEqual(['strength']);
        expect(s.getEffectiveStats().strength).toBe(before.strength + 1);
        expect(sheetBreakdown()).toEqual(s.getEffectiveStats());
        expect(s.health.current).toBeLessThanOrEqual(healthBefore);

        useCharacterStore.getState().adjustLevel(-1);
        s = useCharacterStore.getState();
        expect(s.stats.strength).toBe(base.strength);
        expect(s.getEffectiveStats()).toEqual(before);
        expect(sheetBreakdown()).toEqual(before);
        expect(s.health.current).toBeLessThanOrEqual(healthBefore);
    });

    test('canonical save keeps the base, the marker and the earned-inclusive stats; reload is stable', () => {
        load(explicit);
        useCharacterStore.setState({ level: 2, pendingLevelUpInfo: { newLevel: 2, oldLevel: 1 } });
        useCharacterStore.getState().handleLevelUpChoice({ healthIncrease: 4, manaIncrease: 2, attributes: ['spirit'] });
        const saved = assembleCharacterWorkingData(useCharacterStore.getState(), inventory);
        expect(saved.statsModel).toBe(STATS_MODEL);
        expect(saved.baseStats).toEqual(base);
        expect(saved.stats.spirit).toBe(base.spirit + 1);
        expect(saved.levelUpHistory[2].attributes).toEqual(['spirit']);

        const effective = getEffectiveAttributes(useCharacterStore.getState());
        for (let i = 0; i < 3; i += 1) {
            load(saved);
            const again = assembleCharacterWorkingData(useCharacterStore.getState(), inventory);
            expect(again.stats).toEqual(saved.stats);
            expect(again.baseStats).toEqual(saved.baseStats);
            expect(getEffectiveAttributes(useCharacterStore.getState())).toEqual(effective);
        }
    });

    test('viewing/loading never refills resources', () => {
        load(explicit);
        const s = useCharacterStore.getState();
        expect(s.health.current).toBe(7);
        expect(s.mana.current).toBe(3);
        useCharacterStore.getState().initializeCharacter();
        expect(useCharacterStore.getState().health.current).toBe(7);
        expect(useCharacterStore.getState().mana.current).toBe(3);
    });

    test('legacy load keeps today\'s play values (stats + heritage), writes no provenance and flags nothing silently', () => {
        load(legacy);
        const s = useCharacterStore.getState();
        expect(s.statsModel).toBeNull();
        const heritageMods = getHeritageModifiers(heritage.race, heritage.subrace);
        ATTRIBUTE_IDS.forEach((id) => {
            expect(s.getEffectiveStats()[id]).toBe(legacy.stats[id] + heritageMods[id]);
        });
        expect(sheetBreakdown()).toEqual(s.getEffectiveStats());
        const saved = assembleCharacterWorkingData(s, inventory);
        expect(saved.statsModel).toBeUndefined();
        expect(saved.baseStats).toBeUndefined();
        expect(saved.stats).toEqual(legacy.stats);
    });

    test('switching characters does not carry one character\'s provenance into another', () => {
        load(explicit, [legacy]);
        expect(useCharacterStore.getState().statsModel).toBe(STATS_MODEL);
        useCharacterStore.getState().loadCharacter(legacy.id);
        const s = useCharacterStore.getState();
        expect(s.currentCharacterId).toBe(legacy.id);
        expect(s.statsModel).toBeNull();
        expect(s.stats).toEqual(legacy.stats);
        expect(assembleCharacterWorkingData(s, inventory).baseStats).toBeUndefined();
    });
});
