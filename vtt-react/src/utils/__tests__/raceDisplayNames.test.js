import { getRaceHeritageLabel, normalizeRaceDisplayName } from '../raceDisplayNames';

describe('raceDisplayNames', () => {
    describe('normalizeRaceDisplayName', () => {
        it('maps legacy Nethien bloodline names to current canon', () => {
            expect(normalizeRaceDisplayName('Hallowed Neth')).toBe('Veldun');
            expect(normalizeRaceDisplayName('Hallowed Neth (Neth)')).toBe('Veldun');
            expect(normalizeRaceDisplayName('Grave Neth')).toBe('Withered');
            expect(normalizeRaceDisplayName('High Nethien')).toBe('Nethien');
        });

        it('passes current canon and unknown names through unchanged', () => {
            expect(normalizeRaceDisplayName('Thalren')).toBe('Thalren');
            expect(normalizeRaceDisplayName('Stargazer Astril')).toBe('Stargazer Astril');
            expect(normalizeRaceDisplayName('')).toBe('');
            expect(normalizeRaceDisplayName(null)).toBeNull();
        });
    });

    describe('getRaceHeritageLabel', () => {
        it('appends the species to Human bloodlines', () => {
            expect(getRaceHeritageLabel('Thalren')).toBe('Thalren (Human)');
            expect(getRaceHeritageLabel('Skald')).toBe('Skald (Human)');
            expect(getRaceHeritageLabel('Tessen')).toBe('Tessen (Human)');
            expect(getRaceHeritageLabel('Merryn')).toBe('Merryn (Human)');
            expect(getRaceHeritageLabel('Ordan')).toBe('Ordan (Human)');
        });

        it('strips legacy regional suffixes without mutating stored data', () => {
            expect(getRaceHeritageLabel('Thalren (Frostwood Reach)')).toBe('Thalren (Human)');
            expect(getRaceHeritageLabel('Thalren (Frostwood Reach) (Human)')).toBe('Thalren (Human)');
            expect(getRaceHeritageLabel('Ordan (Disguised Remnant)')).toBe('Ordan (Human)');
        });

        it('reads Nethien bloodlines as "<bloodline> Nethien"', () => {
            expect(getRaceHeritageLabel('Withered')).toBe('Withered Nethien');
            expect(getRaceHeritageLabel('Withered (Nethien)')).toBe('Withered Nethien');
            expect(getRaceHeritageLabel('Hallowed Neth')).toBe('Veldun Nethien');
            expect(getRaceHeritageLabel('Veldun')).toBe('Veldun Nethien');
        });

        it('dedupes subraces that already carry the race name', () => {
            expect(getRaceHeritageLabel('Stargazer Astril (Astril)')).toBe('Stargazer Astril');
            expect(getRaceHeritageLabel('Arch Mimir (Mimir)')).toBe('Arch Mimir');
        });

        it('passes unknown names through, including non-human races', () => {
            expect(getRaceHeritageLabel('Clean')).toBe('Clean');
            expect(getRaceHeritageLabel('Unknown Race')).toBe('Unknown Race');
            expect(getRaceHeritageLabel('')).toBe('');
            expect(getRaceHeritageLabel(undefined)).toBeUndefined();
        });
    });
});
