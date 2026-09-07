/**
 * Integration test for race trait merging, active spells, and stat modifiers
 */
jest.mock('../../store/customLineageStore', () => ({
    __esModule: true,
    default: {
        getState: () => ({
            getLineage: () => null
        })
    }
}));

import { RACE_DATA, getFullRaceData, getSubraceData, getRacialBaseStats } from '../raceData';
import { getRacialSpells, getRacialStatModifiers } from '../../utils/raceDisciplineSpellUtils';
import { calculateDerivedStats } from '../../utils/characterUtils';

describe('Race Trait Integration Tests', () => {
    test('All 10 canonical races exist in RACE_DATA', () => {
        const raceIds = Object.keys(RACE_DATA);
        expect(raceIds).toHaveLength(10);
    });

    test('getFullRaceData merges sharedTraits with subrace traits', () => {
        const floraeOken = getFullRaceData('florae', 'oken_florae');
        expect(floraeOken).toBeDefined();
        const traitIds = floraeOken.combinedTraits.traits.map(t => t.id);
        
        // Shared traits present
        expect(traitIds).toContain('branch_arm_brawn_florae');
        expect(traitIds).toContain('hearth_water_vitality_florae');
        expect(traitIds).toContain('nature_attunement_florae');

        // Subrace traits present
        expect(traitIds).toContain('heartwood_durability_oken');
        expect(traitIds).toContain('canopy_reach_oken');
        expect(traitIds).toContain('deep_root_anchor_oken');
    });

    test('getSubraceData resolves by key, full id, or name', () => {
        const byKey = getSubraceData('florae', 'oken');
        const byId = getSubraceData('florae', 'oken_florae');
        const byName = getSubraceData('florae', 'Oken');
        expect(byKey).toBeDefined();
        expect(byId).toBeDefined();
        expect(byName).toBeDefined();
        expect(byKey.id).toBe('florae_unified');
        expect(byId.id).toBe('florae_unified');
        expect(byName.id).toBe('florae_unified');
    });

    test('getRacialSpells extracts active spells from both shared and subrace traits', () => {
        const floraeSpells = getRacialSpells('florae', 'oken');
        const spellIds = floraeSpells.map(s => s.id);

        // hearth_water_vitality_florae is ACTION (shared)
        expect(spellIds).toContain('hearth_water_vitality_florae');
        // deep_root_anchor_oken is ACTION (subrace)
        expect(spellIds).toContain('deep_root_anchor_oken');

        // Passives should NOT be in active spells
        expect(spellIds).not.toContain('heartwood_durability_oken');
    });

    test('calculateDerivedStats applies Durability and DR from racial passives', () => {
        const totalStats = {
            strength: 10,
            constitution: 10,
            agility: 10,
            intelligence: 10,
            spirit: 10,
            charisma: 10
        };
        const derived = calculateDerivedStats(totalStats, {}, {}, 'normal', 0, null, 'florae', 'oken');
        
        // Heartwood Density grants +1 Durability and -5 ft movement speed
        expect(derived.durability).toBe(1);
        expect(derived.moveSpeed).toBe(25); // 30 - 5 = 25
    });

    test('Every subrace across all 10 races resolves cleanly', () => {
        for (const [raceId, race] of Object.entries(RACE_DATA)) {
            for (const [subKey, subrace] of Object.entries(race.subraces || {})) {
                const fullData = getFullRaceData(raceId, subrace.id);
                expect(fullData).toBeDefined();
                expect(fullData.combinedTraits.traits.length).toBeGreaterThan(0);
                
                const spells = getRacialSpells(raceId, subrace.id);
                expect(Array.isArray(spells)).toBe(true);

                const passives = getRacialStatModifiers(raceId, subrace.id);
                expect(Array.isArray(passives)).toBe(true);
            }
        }
    });
});
