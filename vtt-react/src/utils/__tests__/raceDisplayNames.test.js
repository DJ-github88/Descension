import { getRaceHeritageLabel, normalizeRaceDisplayName } from '../raceDisplayNames';

describe('raceDisplayNames', () => {
    describe('normalizeRaceDisplayName', () => {
        it('maps legacy Athien bloodline names to current canon', () => {
            expect(normalizeRaceDisplayName('Hallowed Neth')).toBe('Weft');
            expect(normalizeRaceDisplayName('Hallowed Neth (Neth)')).toBe('Weft');
            expect(normalizeRaceDisplayName('Grave Neth')).toBe('Riven');
            expect(normalizeRaceDisplayName('High Nethien')).toBe('Nethien');
            expect(normalizeRaceDisplayName('Velun Nethien')).toBe('Nethien');
            expect(normalizeRaceDisplayName('Athien')).toBe('Athien');
        });

        it('maps legacy subrace names across races to current canon', () => {
            expect(normalizeRaceDisplayName('Thalren')).toBe('Tallyn');
            expect(normalizeRaceDisplayName('Tessen')).toBe('Tessic');
            expect(normalizeRaceDisplayName('Ordan')).toBe('Ordu');
            expect(normalizeRaceDisplayName('Deepling')).toBe('Nereid');
            expect(normalizeRaceDisplayName('Stargazer Astril')).toBe('Lumian');
            expect(normalizeRaceDisplayName('Brutish Astril')).toBe('Kordak');
            expect(normalizeRaceDisplayName('Clockwork Fexric')).toBe('Brasskin');
            expect(normalizeRaceDisplayName('Caustic Fexric')).toBe('Alchemite');
            expect(normalizeRaceDisplayName('Fexric')).toBe('Fex');
            expect(normalizeRaceDisplayName('Viridian')).toBe('Briaren');
            expect(normalizeRaceDisplayName('Oken')).toBe('Oaken');
            expect(normalizeRaceDisplayName('Ithran')).toBe('Amordjin');
            expect(normalizeRaceDisplayName('Hollow-Solari')).toBe('Korr');
            expect(normalizeRaceDisplayName('Waste-Solari')).toBe('Anhur');
            expect(normalizeRaceDisplayName('Ragnohl')).toBe('Anhur');
            expect(normalizeRaceDisplayName('Clean Vreken')).toBe('Bedel');
            expect(normalizeRaceDisplayName('Clean Mycellan')).toBe('Bedel');
            expect(normalizeRaceDisplayName('Marked')).toBe('Cromyx');
            expect(normalizeRaceDisplayName('Nethien')).toBe('Nethien');
            expect(normalizeRaceDisplayName('Vreken')).toBe('Mycellan');
        });

        it('passes current canon and unknown names through unchanged', () => {
            expect(normalizeRaceDisplayName('Tallyn')).toBe('Tallyn');
            expect(normalizeRaceDisplayName('Lumian')).toBe('Lumian');
            expect(normalizeRaceDisplayName('')).toBe('');
            expect(normalizeRaceDisplayName(null)).toBeNull();
        });
    });

    describe('getRaceHeritageLabel', () => {
        it('appends the species to Human bloodlines', () => {
            expect(getRaceHeritageLabel('Tallyn')).toBe('Tallyn (Human)');
            expect(getRaceHeritageLabel('Skald')).toBe('Skald (Human)');
            expect(getRaceHeritageLabel('Tessic')).toBe('Tessic (Human)');
            expect(getRaceHeritageLabel('Merryn')).toBe('Merryn (Human)');
            expect(getRaceHeritageLabel('Ordu')).toBe('Ordu (Human)');
        });

        it('strips legacy regional suffixes without mutating stored data', () => {
            expect(getRaceHeritageLabel('Tallyn (Frostwood Reach)')).toBe('Tallyn (Human)');
            expect(getRaceHeritageLabel('Tallyn (Frostwood Reach) (Human)')).toBe('Tallyn (Human)');
            expect(getRaceHeritageLabel('Ordu (Disguised Remnant)')).toBe('Ordu (Human)');
        });

        it('reads Athien bloodlines as "<bloodline> Athien"', () => {
            expect(getRaceHeritageLabel('Nethien')).toBe('Nethien Athien');
            expect(getRaceHeritageLabel('Nethien (Athien)')).toBe('Nethien Athien');
            expect(getRaceHeritageLabel('Riven')).toBe('Riven Athien');
            expect(getRaceHeritageLabel('Riven (Athien)')).toBe('Riven Athien');
            expect(getRaceHeritageLabel('Hallowed Neth')).toBe('Weft Athien');
            expect(getRaceHeritageLabel('Weft')).toBe('Weft Athien');
        });

        it('dedupes subraces that already carry the race name', () => {
            expect(getRaceHeritageLabel('Lumian (Astril)')).toBe('Lumian');
            expect(getRaceHeritageLabel('Arch Mimir (Mimir)')).toBe('Arch Mimir');
        });

        it('passes unknown names through, including non-human races', () => {
            expect(getRaceHeritageLabel('Clean')).toBe('Bedel');
            expect(getRaceHeritageLabel('Unknown Race')).toBe('Unknown Race');
            expect(getRaceHeritageLabel('')).toBe('');
            expect(getRaceHeritageLabel(undefined)).toBeUndefined();
        });
    });
});
