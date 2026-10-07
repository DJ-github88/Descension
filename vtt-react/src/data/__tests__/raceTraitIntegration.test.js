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

import { RACE_DATA, getFullRaceData, getSubraceData, getRacialBaseStats, getRacialLanguages, getRaceList, applyRacialModifiers } from '../raceData';
import { getRaceMechanic, getMechanicsByRace } from '../raceMechanics';
import { getRacialSpells, getRacialStatModifiers } from '../../utils/raceDisciplineSpellUtils';
import { calculateDerivedStats } from '../../utils/characterUtils';

describe('Race Trait Integration Tests', () => {
    test('All 10 canonical races exist in RACE_DATA', () => {
        const raceIds = Object.keys(RACE_DATA);
        expect(raceIds).toHaveLength(10);
    });

    test('getFullRaceData merges sharedTraits with subrace traits', () => {
        const floraeOaken = getFullRaceData('florae', 'oken_florae');
        expect(floraeOaken).toBeDefined();
        const traitIds = floraeOaken.combinedTraits.traits.map(t => t.id);
        
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
        const byName = getSubraceData('florae', 'Oaken');
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

    test.each(['drun', 'drun_neth', 'Riven'])('Riven %s retains its abilities without inherited pact preservation', (alias) => {
        const full = getFullRaceData('neth', alias);
        const ids = full.combinedTraits.traits.map(trait => trait.id);
        expect(ids).not.toContain('contractual_restriction_neth');
        expect(ids).not.toContain('pact_stillness_neth');
        expect(ids).not.toContain('returned_count_neth');
        expect(ids).toContain('severed_drun');
        expect(ids).toContain('silence_walker_drun');
        expect(full.combinedTraits.mechanics).toEqual([]);
        expect(full.combinedTraits.lifespan).not.toBe('Indefinite (pact-bound)');
        expect(full.combinedTraits.savingThrowModifiers.advantage).not.toContain('magic');
        expect(getRacialStatModifiers('neth', alias).map(trait => trait.id)).not.toContain('pact_stillness_neth');
        expect(getRacialSpells('neth', alias).map(spell => spell.id)).toContain('null_strike_drun');
    });

    test.each(['velun', 'velun_neth', 'Athien', 'kessen', 'kessen_neth', 'Weft'])('pact-bound %s retains preservation and exactly one Fraying mechanic', (alias) => {
        const full = getFullRaceData('neth', alias);
        expect(full.combinedTraits.traits.map(trait => trait.id)).toContain('pact_stillness_neth');
        expect(full.combinedTraits.mechanics.map(mechanic => mechanic.id)).toEqual(['the_unraveling']);
        const lock = full.combinedTraits.traits.find(trait => trait.id === 'contractual_restriction_neth');
        const status = lock.debuffConfig.effects[0].statusEffect;
        expect(status.mechanicId).toBe('the_unraveling');
        expect(status.frayingStage).toBeUndefined();
        expect(status.fadingStage).toBeUndefined();
    });

    test('Fraying stage effects reference real pact benefits and distance recovery cannot clear breaches', () => {
        const mechanic = getRaceMechanic('the_unraveling');
        const pact = getFullRaceData('neth', 'velun').combinedTraits.traits.find(trait => trait.id === 'pact_stillness_neth');
        const benefitIds = pact.buffConfig.effects.map(effect => effect.id);
        const lostBenefits = mechanic.thresholds.find(threshold => threshold.range[0] === 5)
            .effects.filter(effect => effect.type === 'lose_trait').map(effect => effect.trait);
        lostBenefits.forEach(id => expect(benefitIds).toContain(id));
        expect(mechanic.archiveDistanceFailure.recoveryClearsFraying).toBe(false);
        expect(mechanic.archiveDistanceFailure.stackSharedSymptoms).toBe(false);
        expect(getMechanicsByRace('neth', 'drun_neth')).toEqual([]);
    });

    test('Mimir mask and Mote inheritance stays distinct through legacy aliases and passive consumers', () => {
        const arch = getRacialStatModifiers('mimir', 'veiled_mimir').map(trait => trait.id);
        const broken = getRacialStatModifiers('mimir', 'Broken Mimir').map(trait => trait.id);
        expect(arch).toContain('mask_bound_mimir');
        expect(arch).toContain('maskless_frailty_mimir');
        expect(arch).not.toContain('mote_mimir');
        expect(broken).toContain('mote_mimir');
        expect(broken).not.toContain('mask_bound_mimir');
        expect(broken).not.toContain('maskless_frailty_mimir');
        expect(getRacialSpells('mimir', 'tethered_mimir').map(spell => spell.id)).toContain('glass_shard_volley_mistwoven');
    });

    test('language fallback honors base grants, explicit subrace overrides and intentional empty grants', () => {
        const subrace = RACE_DATA.neth.subraces.drun;
        const savedLanguages = subrace.languages;
        try {
            delete subrace.languages;
            expect(getRacialLanguages('neth', 'drun')).toEqual(RACE_DATA.neth.baseTraits.languages);
            expect(getRacialLanguages('neth')).toEqual(RACE_DATA.neth.baseTraits.languages);
            subrace.languages = ["Wayfarer's Cant"];
            expect(getRacialLanguages('neth', 'drun_neth')).toEqual(["Wayfarer's Cant"]);
            subrace.languages = [];
            expect(getRacialLanguages('neth', 'Riven')).toEqual([]);
        } finally {
            subrace.languages = savedLanguages;
        }
    });

    test('an unfinished draft does not inherit the first subrace language override', () => {
        const subrace = RACE_DATA.neth.subraces.velun;
        const savedLanguages = subrace.languages;
        try {
            subrace.languages = ["Wayfarer's Cant"];
            expect(getRacialLanguages('neth')).toEqual(["Wayfarer's Cant", 'Gloom-Tongue']);
            expect(getRacialLanguages('neth', 'velun')).toEqual(["Wayfarer's Cant"]);
        } finally {
            subrace.languages = savedLanguages;
        }
    });

    test('Florae inherit distinct reproduction metadata and retain their bonuses under the six-stat schema', () => {
        const baseline = { strength: 10, constitution: 10, agility: 10, intelligence: 10, spirit: 10, charisma: 10 };
        const viridian = getFullRaceData('florae', 'viridian_florae');
        const oken = getFullRaceData('florae', 'florae_unified');
        expect(viridian.combinedTraits.reproduction).toMatch(/Biological birth/);
        expect(oken.combinedTraits.reproduction).toMatch(/Sapling-Sprout/);
        expect(applyRacialModifiers(baseline, 'florae', 'viridian')).toEqual({ ...baseline, agility: 12, spirit: 11, charisma: 11, constitution: 9 });
        expect(applyRacialModifiers(baseline, 'florae', 'oken')).toEqual({ ...baseline, constitution: 12, spirit: 11, strength: 11, charisma: 9 });
        expect(viridian.combinedTraits.statModifiers.dexterity).toBeUndefined();
        expect(oken.combinedTraits.statModifiers.wisdom).toBeUndefined();
    });

    test.each(['clean', 'clean_vreken', 'Bedel'])('Bedel %s do not inherit the Cromyx fungal vulnerability', (alias) => {
        const ids = getRacialStatModifiers('vreken', alias).map(trait => trait.id);
        expect(ids).not.toContain('hush_vulnerability_vreken');
        expect(ids).toContain('deep_glow_blood_clean');
        expect(ids).toContain('lantern_eyes_vreken');
        expect(ids).toContain('spore_sense_vreken');
        expect(getRacialStatModifiers('vreken', 'marked_vreken').map(trait => trait.id)).toContain('hush_vulnerability_vreken');
    });

    test('Sumpborn remain distinct nonplayable metadata without changing the ten-race roster or Fex key', () => {
        expect(getRaceList()).toHaveLength(10);
        expect(getRaceList().some(race => race.id === 'sumpborn')).toBe(false);
        expect(getFullRaceData('fexrick').race.name).toBe('Fex');
        expect(RACE_DATA.fexrick.createdPeoples[0]).toMatchObject({ id: 'sumpborn', playable: false });
    });

    test('Astril language grants use registered Echo-Song and legacy Lumian grants resolve without extra fluency', () => {
        Object.values(RACE_DATA.astril.subraces).forEach(subrace => {
            expect(getRacialLanguages('astril', subrace.id)).toEqual(["Wayfarer's Cant", 'Echo-Song']);
        });
        const saved = RACE_DATA.astril.baseTraits.languages;
        try {
            RACE_DATA.astril.baseTraits.languages = ["Wayfarer's Cant", 'Lumian'];
            expect(getRacialLanguages('astril')).toEqual(["Wayfarer's Cant", 'Echo-Song']);
        } finally {
            RACE_DATA.astril.baseTraits.languages = saved;
        }
    });

    test('Myrathil inherit air/water breathing and young-growth metadata while retaining ecological heritages', () => {
        Object.values(RACE_DATA.myrathil.subraces).forEach(subrace => {
            const full = getFullRaceData('myrathil', subrace.id);
            expect(full.combinedTraits.breathing).toEqual(['air', 'water']);
            expect(full.combinedTraits.reproduction).toMatch(/grow and mature/);
        });
        expect(getFullRaceData('human', 'Ordu (Disguised Remnant)').subrace.id)
            .toBe(getFullRaceData('human', 'ordan').subrace.id);
    });
});
