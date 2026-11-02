import { solari } from '../solari';
import { HERITAGE_TRADITIONS } from '../../classHeritageRegistry';
import { DREADNAUGHT_DATA } from '../../classes/dreadnaughtData';
import { HERITAGE_EDGES } from '../../heritageEdgeContract';
import { normalizeRaceDisplayName, getRaceHeritageLabel } from '../../../utils/raceDisplayNames';

describe('Solari Subrace Rename (Anhur -> Ashen)', () => {
    describe('Canonical Solari Race Definition', () => {
        it('preserves Solari parent race and Korr subrace', () => {
            expect(solari.id).toBe('solari');
            expect(solari.name).toBe('Solari');
            expect(solari.subraces.korr.id).toBe('korr_solari');
            expect(solari.subraces.korr.name).toBe('Korr');
        });

        it('presents Ashen as the canonical player-facing name while preserving technical ID thrask_solari', () => {
            expect(solari.subraces.thrask.id).toBe('thrask_solari');
            expect(solari.subraces.thrask.name).toBe('Ashen');
            expect(solari.subraces.thrask.traits.map(t => t.id)).toEqual([
                'border_blood_thrask',
                'ash_skimmer_thrask',
                'obsidian_graft_thrask',
                'scree_sprint_thrask'
            ]);
            expect(solari.subraces.thrask.crest).toBe('/assets/images/crests/solari_waste_crest.png');
            expect(solari.subraces.thrask.illustration).toBe('/assets/images/races/solari_waste_figure_vaelith.jpg');
        });
    });

    describe('Class Eligibility and Heritage Registry', () => {
        it('preserves thrask_solari class eligibility across the roster with zero changes', () => {
            expect(HERITAGE_TRADITIONS.thrask_solari).toBeDefined();
            expect(HERITAGE_TRADITIONS.thrask_solari.name).toBe('Ashen');
            expect(HERITAGE_TRADITIONS.thrask_solari.classes).toEqual([
                'Crusader', 'Martyr', 'Pyrofiend', 'Spellguard', 'Apex'
            ]);
        });

        it('strictly excludes Ashen / thrask_solari from Dreadnaught access', () => {
            const allowed = DREADNAUGHT_DATA?.restrictions?.allowedSubraces || [];
            expect(allowed).not.toContain('thrask_solari');
            expect(HERITAGE_EDGES['Dreadnaught|thrask_solari']).toBeUndefined();
        });
    });

    describe('Display Name Normalization and Hydration', () => {
        it('normalizes legacy and candidate subrace names to Ashen', () => {
            expect(normalizeRaceDisplayName('Waste-Solari')).toBe('Ashen');
            expect(normalizeRaceDisplayName('waste solari')).toBe('Ashen');
            expect(normalizeRaceDisplayName('Ragnohl')).toBe('Ashen');
            expect(normalizeRaceDisplayName('ragnohl')).toBe('Ashen');
            expect(normalizeRaceDisplayName('Anhur')).toBe('Ashen');
            expect(normalizeRaceDisplayName('anhur')).toBe('Ashen');
            expect(normalizeRaceDisplayName('Ajan')).toBe('Ashen');
            expect(normalizeRaceDisplayName('ajan')).toBe('Ashen');
            expect(normalizeRaceDisplayName('Ashen')).toBe('Ashen');
        });

        it('leaves Korr and unrelated names unchanged', () => {
            expect(normalizeRaceDisplayName('Korr')).toBe('Korr');
            expect(normalizeRaceDisplayName('Solari')).toBe('Solari');
            expect(normalizeRaceDisplayName('Unknown Subrace')).toBe('Unknown Subrace');
        });

        it('generates correct heritage labels for character sheet / view', () => {
            expect(getRaceHeritageLabel('Ashen')).toBe('Ashen');
            expect(getRaceHeritageLabel('Anhur')).toBe('Ashen');
            expect(getRaceHeritageLabel('Anhur (Solari)')).toBe('Ashen');
            expect(getRaceHeritageLabel('Korr')).toBe('Korr');
        });

        it('hydrates legacy saved character payloads to display Ashen without mutating original mechanical ID', () => {
            const legacySavedCharacter = {
                id: 'char_legacy_1',
                name: 'Vaelith',
                race: 'solari',
                subrace: 'thrask_solari',
                raceDisplayName: 'Anhur',
                class: 'crusader'
            };

            const displayedSubrace = normalizeRaceDisplayName(legacySavedCharacter.raceDisplayName);
            expect(displayedSubrace).toBe('Ashen');
            // The underlying technical subrace and class eligibility remain intact
            expect(legacySavedCharacter.subrace).toBe('thrask_solari');
            expect(HERITAGE_TRADITIONS[legacySavedCharacter.subrace].classes).toContain('Crusader');
        });
    });
});
