/**
 * Ancestral Gifts — registry contract, validation and granting.
 */
import {
    ANCESTRY_LOADOUTS, ANCESTRY_GIFTS, ANCESTRY_ROW_COUNT, ANCESTRY_OPTIONS_PER_ROW,
    getResolvedAncestryLoadout, validateAncestry, buildAncestry, applyAncestryToTraits, getGovernedGiftIds
} from '../ancestryLoadouts';
import { getFullRaceData, getRaceList, getSubraceList } from '../raceData';
import { getRacialSpells, getRacialStatModifiers } from '../../utils/raceDisciplineSpellUtils';

const raceOfSubrace = {};
getRaceList().forEach(race => getSubraceList(race.id).forEach(sub => { raceOfSubrace[sub.id] = race.id; }));
const ids = list => list.map(t => t.id);

describe('Ancestral Gifts registry contract', () => {
    test('every loadout targets a real heritage and has 1 core + 3 rows of 2 resolvable, unique gifts', () => {
        Object.entries(ANCESTRY_LOADOUTS).forEach(([subraceId, loadout]) => {
            const raceId = raceOfSubrace[subraceId];
            expect(raceId).toBeDefined();
            expect(loadout.rows).toHaveLength(ANCESTRY_ROW_COUNT);
            expect(new Set(loadout.rows.map(r => r.id)).size).toBe(ANCESTRY_ROW_COUNT);
            const resolved = getResolvedAncestryLoadout(raceId, subraceId);
            expect(resolved.core).toBeTruthy();
            expect(loadout.rows.some(r => r.options.includes(loadout.core))).toBe(false);
            resolved.rows.forEach(row => {
                expect(row.options).toHaveLength(ANCESTRY_OPTIONS_PER_ROW);
                row.options.forEach(opt => expect(opt).toBeTruthy());
            });
            const all = [loadout.core, ...loadout.rows.flatMap(r => r.options)];
            expect(new Set(all).size).toBe(all.length);
        });
    });

    test('every heritage in the game has a loadout', () => {
        Object.keys(raceOfSubrace).forEach(subraceId => expect(ANCESTRY_LOADOUTS[subraceId]).toBeDefined());
    });

    test('new gift records are well formed', () => {
        Object.values(ANCESTRY_GIFTS).forEach(g => {
            expect(['PASSIVE', 'ACTION', 'REACTION']).toContain(g.spellType);
            expect(Number.isInteger(g.resourceCost.actionPoints)).toBe(true);
            expect(g.resourceCost.actionPoints).toBeGreaterThanOrEqual(0);
            expect(g.resourceCost.actionPoints).toBeLessThanOrEqual(4);
            if (g.spellType !== 'ACTION') expect(g.resourceCost.actionPoints).toBe(0);
            expect(g.description.length).toBeGreaterThan(20);
            ['origin', 'requires', 'limits', 'counters'].forEach(k => expect(g.ancestry[k]).toBeTruthy());
            expect(g.typeConfig.category).toBe('racial');
            expect(JSON.stringify(g)).not.toMatch(/'fire'|"fire"|[Aa]dvantage|saving throw|\bDC\b/);
        });
    });
});

describe('Ancestral Gifts validation', () => {
    test('a heritage without a loadout needs nothing', () => {
        expect(validateAncestry('custom_lineage', null)).toMatchObject({ required: false, complete: true });
    });
    test('counts picks, rejects unknown options and other heritages', () => {
        expect(validateAncestry('ithran_groven', null)).toMatchObject({ required: true, complete: false, chosen: 0 });
        const partial = buildAncestry('ithran_groven', { traversal: 'ithran_chasm_leap', hunt: 'fiber_cord_snare_ithran' });
        expect(validateAncestry('ithran_groven', partial)).toMatchObject({ complete: false, chosen: 2, missingRows: ['reading'] });
        const wrong = buildAncestry('ithran_groven', { traversal: 'morgh_stone_scales', reading: 'toll_keepers_eye', hunt: 'fiber_cord_snare_ithran' });
        expect(validateAncestry('ithran_groven', wrong).complete).toBe(false);
        const full = buildAncestry('ithran_groven', { traversal: 'ithran_chasm_leap', reading: 'toll_keepers_eye', hunt: 'fiber_cord_snare_ithran' });
        expect(validateAncestry('ithran_groven', full)).toMatchObject({ complete: true, chosen: 3 });
        expect(validateAncestry('morgh_groven', full).complete).toBe(false);
    });
});

describe('Ancestral Gifts granting', () => {
    const picks = { traversal: 'ithran_chasm_leap', reading: 'toll_keepers_eye', hunt: 'fiber_cord_snare_ithran' };
    const ancestry = buildAncestry('ithran_groven', picks);

    test('without ancestry a heritage keeps every trait (legacy characters)', () => {
        const legacy = [...ids(getRacialSpells('groven', 'ithran_groven')), ...ids(getRacialStatModifiers('groven', 'ithran_groven'))];
        ['ithran_span_reach', 'toll_keepers_eye', 'bone_reading_ithran', 'fiber_cord_snare_ithran'].forEach(id => expect(legacy).toContain(id));
        expect(legacy).not.toContain('ithran_vat_knit_flesh');
    });

    test('with ancestry only the core and the three picks are granted, shared traits stay', () => {
        const granted = [...ids(getRacialSpells('groven', 'ithran_groven', null, ancestry)), ...ids(getRacialStatModifiers('groven', 'ithran_groven', ancestry))];
        ['ithran_vat_knit_flesh', 'ithran_chasm_leap', 'toll_keepers_eye', 'fiber_cord_snare_ithran'].forEach(id => expect(granted).toContain(id));
        ['ithran_span_reach', 'bone_reading_ithran', 'ithran_overhang_strike'].forEach(id => expect(granted).not.toContain(id));
        expect(granted).toContain('vat_hangover_groven');
        expect(new Set(granted).size).toBe(granted.length);
    });

    test('an ancestry for another heritage is ignored', () => {
        const traits = getFullRaceData('groven', 'morgh_groven').combinedTraits.traits;
        expect(applyAncestryToTraits(traits, 'groven', 'morgh_groven', ancestry)).toBe(traits);
    });
});
