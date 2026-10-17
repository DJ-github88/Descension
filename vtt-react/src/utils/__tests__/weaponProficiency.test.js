/**
 * P11 — per-weapon proficiency owner (contract A1–A4).
 */
import {
    getLegacySharedWeaponRank,
    getStoredWeaponRank,
    resolveWeaponRank,
    trainedWeaponTypes,
    weaponRankKey,
    withWeaponRank
} from '../weaponProficiency';

describe('P11 weapon proficiency owner', () => {
    test('A1: two weapon types hold independent ranks; a third stays Untrained', () => {
        const a = withWeaponRank({}, 'sword', 'ADEPT');
        const b = withWeaponRank(a, 'axe', 'NOVICE');
        expect(b).toEqual({ weaponMastery_sword: 'ADEPT', weaponMastery_axe: 'NOVICE' });
        expect(resolveWeaponRank({ skillRanks: b, weaponType: 'sword' })).toEqual({ key: 'ADEPT', source: 'stored' });
        expect(resolveWeaponRank({ skillRanks: b, weaponType: 'axe' })).toEqual({ key: 'NOVICE', source: 'stored' });
        expect(resolveWeaponRank({ skillRanks: b, weaponType: 'mace' })).toEqual({ key: 'UNTRAINED', source: 'default' });
        expect(a).toEqual({ weaponMastery_sword: 'ADEPT' }); // inputs are not mutated
    });

    test('A2: own quest progress applies when no rank is stored, even beside a legacy shared rank', () => {
        const skillRanks = { weaponMastery: 'MASTER' };
        const skillProgress = { weaponMastery_bow: { completedQuests: ['q1', 'q2', 'q3'] } };
        expect(resolveWeaponRank({ skillRanks, skillProgress, weaponType: 'bow' })).toEqual({ key: 'TRAINED', source: 'quests' });
        expect(resolveWeaponRank({ skillRanks, skillProgress, weaponType: 'sword' })).toEqual({ key: 'UNTRAINED', source: 'default' });
        // A stored rank wins over quest progress for that weapon only.
        const withStored = withWeaponRank(skillRanks, 'bow', 'NOVICE');
        expect(resolveWeaponRank({ skillRanks: withStored, skillProgress, weaponType: 'bow' }).key).toBe('NOVICE');
    });

    test('A3: legacy shared rank is detected, kept and never applied implicitly', () => {
        const legacy = { weaponMastery: 'EXPERT', athletics: 'NOVICE' };
        expect(getLegacySharedWeaponRank(legacy)).toBe('EXPERT');
        expect(getLegacySharedWeaponRank({ weaponMastery: 'UNTRAINED' })).toBeNull();
        expect(getLegacySharedWeaponRank({})).toBeNull();
        expect(getLegacySharedWeaponRank({ weaponMastery: 'nonsense' })).toBeNull();
        const next = withWeaponRank(legacy, 'dagger', 'EXPERT');
        expect(next.weaponMastery).toBe('EXPERT');
        expect(next.athletics).toBe('NOVICE');
        expect(resolveWeaponRank({ skillRanks: legacy, weaponType: 'dagger' }).key).toBe('UNTRAINED');
    });

    test('A4: unknown weapon types or ranks are refused', () => {
        expect(withWeaponRank({}, undefined, 'NOVICE')).toBeNull();
        expect(withWeaponRank({}, 'lightsaber', 'NOVICE')).toBeNull();
        expect(withWeaponRank({}, 'sword', 'GRANDMASTER')).toBeNull();
        expect(withWeaponRank({}, 'toString', 'NOVICE')).toBeNull();
        expect(weaponRankKey('__proto__')).toBeNull();
        expect(getStoredWeaponRank({ weaponMastery_sword: 'BOGUS' }, 'sword')).toBeNull();
    });

    test('trained weapon list ignores Untrained and unknown entries', () => {
        expect(trainedWeaponTypes({ weaponMastery_axe: 'TRAINED', weaponMastery_sword: 'UNTRAINED', weaponMastery_zz: 'MASTER', weaponMastery: 'ADEPT' }))
            .toEqual([{ weaponType: 'axe', rank: 'TRAINED' }]);
    });
});
