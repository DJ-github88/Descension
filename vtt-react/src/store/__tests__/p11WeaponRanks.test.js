/**
 * P11 — per-weapon ranks through the real character store, canonical character
 * load and runtime state service (contract A1, A3–A6).
 */
import useCharacterStore from '../characterStore';
import { assembleCharacterWorkingData } from '../characterHelpers';
import characterStateService from '../../services/firebase/characterStateService';

jest.mock('firebase/firestore', () => {
    const docs = new Map();
    const clone = value => JSON.parse(JSON.stringify(value));
    return {
        __docs: docs,
        doc: (_db, ...path) => path.join('/'),
        getDoc: async key => ({ exists: () => docs.has(key), data: () => clone(docs.get(key)) }),
        setDoc: async (key, data, options) => {
            docs.set(key, { ...(options && options.merge ? docs.get(key) || {} : {}), ...clone(data) });
        },
        updateDoc: jest.fn(),
        collection: jest.fn(),
        getDocs: jest.fn(),
        writeBatch: jest.fn(),
        serverTimestamp: () => 'server-ts',
        deleteDoc: jest.fn()
    };
});

jest.mock('../../config/firebase', () => ({
    db: {},
    auth: { currentUser: { uid: 'user-a' } },
    isMockOrDevUser: () => false
}));

const firestore = require('firebase/firestore');
const firebaseConfig = require('../../config/firebase');

describe('P11 per-weapon ranks in the character store', () => {
    beforeEach(() => {
        useCharacterStore.setState({ skillRanks: { weaponMastery: 'ADEPT', athletics: 'NOVICE' } });
    });

    test('A1: setting one weapon type does not change another', () => {
        const { setSkillRank } = useCharacterStore.getState();
        expect(setSkillRank('weaponMastery', 'EXPERT', 'sword')).toBe(true);
        expect(setSkillRank('weaponMastery', 'NOVICE', 'axe')).toBe(true);
        const ranks = useCharacterStore.getState().skillRanks;
        expect(ranks.weaponMastery_sword).toBe('EXPERT');
        expect(ranks.weaponMastery_axe).toBe('NOVICE');
        expect(ranks.weaponMastery_mace).toBeUndefined();
    });

    test('A3: the legacy shared rank and other skills are untouched by weapon writes', () => {
        useCharacterStore.getState().setSkillRank('weaponMastery', 'TRAINED', 'bow');
        const ranks = useCharacterStore.getState().skillRanks;
        expect(ranks.weaponMastery).toBe('ADEPT');
        expect(ranks.athletics).toBe('NOVICE');
    });

    test('A4: a Weapon Mastery write without a known type or rank changes nothing', () => {
        const before = useCharacterStore.getState().skillRanks;
        const warn = jest.spyOn(console, 'warn').mockImplementation(() => {});
        const { setSkillRank } = useCharacterStore.getState();
        expect(setSkillRank('weaponMastery', 'MASTER')).toBe(false);
        expect(setSkillRank('weaponMastery', 'MASTER', 'lightsaber')).toBe(false);
        expect(setSkillRank('weaponMastery', 'LEGEND', 'sword')).toBe(false);
        expect(useCharacterStore.getState().skillRanks).toBe(before);
        warn.mockRestore();
        // Other skills keep their existing behaviour.
        expect(setSkillRank('stealth', 'TRAINED')).toBe(true);
        expect(useCharacterStore.getState().skillRanks.stealth).toBe('TRAINED');
    });

    test('A5/A6: canonical save → load restores per-weapon ranks and switching characters does not carry them', () => {
        const { setSkillRank } = useCharacterStore.getState();
        setSkillRank('weaponMastery', 'APPRENTICE', 'sword');
        setSkillRank('weaponMastery', 'NOVICE', 'axe');
        const working = assembleCharacterWorkingData(useCharacterStore.getState(), {
            items: [], currency: { platinum: 0, gold: 0, silver: 0, copper: 0 }, encumbranceState: 'normal'
        });
        expect(working.skillRanks).toEqual({
            weaponMastery: 'ADEPT', athletics: 'NOVICE', weaponMastery_sword: 'APPRENTICE', weaponMastery_axe: 'NOVICE'
        });

        const first = { ...working, id: 'char-one', name: 'One' };
        const second = { id: 'char-two', name: 'Two', skillRanks: { weaponMastery_bow: 'MASTER' } };
        useCharacterStore.setState({ characters: [first, second], skillRanks: {} });

        useCharacterStore.getState().loadCharacter('char-two');
        expect(useCharacterStore.getState().skillRanks).toEqual({ weaponMastery_bow: 'MASTER' });

        useCharacterStore.getState().loadCharacter('char-one');
        expect(useCharacterStore.getState().skillRanks).toEqual(working.skillRanks);
        expect(useCharacterStore.getState().skillRanks.weaponMastery_bow).toBeUndefined();
    });
});

describe('P11 per-weapon ranks through the runtime state service', () => {
    beforeEach(() => {
        firestore.__docs.clear();
        firebaseConfig.auth.currentUser = { uid: 'user-a' };
    });

    test('A5: runtime save → load keeps per-weapon keys and the legacy key byte-for-byte', async () => {
        const skillRanks = { weaponMastery: 'EXPERT', weaponMastery_sword: 'ADEPT', weaponMastery_axe: 'NOVICE', stealth: 'TRAINED' };
        const saved = await characterStateService.saveCharacterState('user-a', 'char-one', {
            health: { current: 10, max: 10 }, mana: { current: 5, max: 5 }, actionPoints: { current: 4, max: 4 },
            skillRanks, skillProgress: { weaponMastery_sword: { completedQuests: ['a'] } }
        });
        expect(saved.success).toBe(true);
        expect(saved.localOnly).toBeUndefined();
        const loaded = await characterStateService.loadCharacterState('user-a', 'char-one');
        expect(loaded.skillRanks).toEqual(skillRanks);
        expect(loaded.skillProgress.weaponMastery_sword.completedQuests).toEqual(['a']);
    });

    test('A6: ranks stay with their character and account', async () => {
        await characterStateService.saveCharacterState('user-a', 'char-one', {
            health: { current: 1, max: 1 }, skillRanks: { weaponMastery_sword: 'MASTER' }
        });
        expect(await characterStateService.loadCharacterState('user-a', 'char-two')).toBeNull();

        firebaseConfig.auth.currentUser = { uid: 'user-b' };
        expect(await characterStateService.loadCharacterState('user-b', 'char-one')).toBeNull();
        const refused = await characterStateService.saveCharacterState('user-a', 'char-one', {
            health: { current: 1, max: 1 }, skillRanks: { weaponMastery_sword: 'NOVICE' }
        });
        expect(refused.success).toBe(false);
        firebaseConfig.auth.currentUser = { uid: 'user-a' };
        expect((await characterStateService.loadCharacterState('user-a', 'char-one')).skillRanks).toEqual({ weaponMastery_sword: 'MASTER' });
    });
});
