import { cadenceToSpell } from '../cadenceToSpell';

const ENTRY = {
    id: 'circle_of_fifths',
    name: 'Circle of Fifths',
    epithet: 'Eternal Torment',
    sequence: 'V → I → VI → V',
    notes: { V: 2, I: 1, VI: 1 },
    damageTypes: ['storm'],
    targetType: 'area',
    range: 60,
    aoeShape: 'circle',
    aoeParameters: { radius: 30 },
    primaryEffect: 'damage',
    secondaryEffect: 'dot',
    effectDescription: 'Deal storm damage.',
    flavorText: 'The progression eats its own tail.',
    tacticalUse: 'Apply early to grouped enemies.',
};

const MATRIX = { baseManaCost: 16, baseRange: 60 };

describe('cadenceToSpell', () => {
    it('emits lowercase note types so the card renders musical badges (not coin fallback)', () => {
        const spell = cadenceToSpell(ENTRY, MATRIX);
        expect(spell.resourceCost.resourceTypes).toEqual(
            expect.arrayContaining(['note_v', 'note_i', 'note_vi'])
        );
        expect(spell.resourceCost.resourceTypes).not.toContain('note_V');
    });

    it('emits negative note values so they render as consumes (bass clef)', () => {
        const spell = cadenceToSpell(ENTRY, MATRIX);
        expect(spell.resourceCost.resourceValues.note_v).toBe(-2);
        expect(spell.resourceCost.resourceValues.note_i).toBe(-1);
        expect(spell.resourceCost.resourceValues.note_vi).toBe(-1);
    });

    it('keeps mana and AP costs positive', () => {
        const spell = cadenceToSpell(ENTRY, MATRIX);
        expect(spell.resourceCost.resourceValues.mana).toBe(16);
        expect(spell.resourceCost.resourceValues.actionPoints).toBe(1);
    });

    it('builds a markdown description from effect, flavor, and tactical text', () => {
        const spell = cadenceToSpell(ENTRY, MATRIX);
        expect(spell.description).toContain('Deal storm damage.');
        expect(spell.description).toContain('_"The progression eats its own tail."_');
        expect(spell.description).toContain('**Tactical Use:** Apply early to grouped enemies.');
    });

    it('returns null for a missing entry', () => {
        expect(cadenceToSpell(null, MATRIX)).toBeNull();
    });
});
