import {
    getRandomCharacterName,
    generateThematicNames,
    getRandomRoomName,
    SUBRACE_NAME_DATA,
    CLASS_NAME_DATA,
    BACKGROUND_NAME_DATA,
    RACE_NAMES,
    SURNAMES,
    ROOM_NAMES
} from '../nameGenerator';

describe('nameGenerator - Clean 1-4 Word Lore-Driven Generator', () => {
    describe('Word Count and Hyphen-Free Formatting', () => {
        test('every generated name across 250 diverse rolls contains strictly 1 to 4 words', () => {
            const classes = Object.keys(CLASS_NAME_DATA);
            const backgrounds = Object.keys(BACKGROUND_NAME_DATA);
            const subraces = Object.keys(SUBRACE_NAME_DATA);

            for (let i = 0; i < 250; i++) {
                const subrace = subraces[i % subraces.length];
                const characterClass = classes[i % classes.length];
                const background = backgrounds[i % backgrounds.length];
                const gender = i % 3 === 0 ? 'male' : i % 3 === 1 ? 'female' : 'other';

                const name = getRandomCharacterName({
                    subrace,
                    characterClass,
                    background,
                    gender
                });

                expect(typeof name).toBe('string');
                expect(name.trim().length).toBeGreaterThan(0);

                const words = name.trim().split(/\s+/);
                expect(words.length).toBeGreaterThanOrEqual(1);
                expect(words.length).toBeLessThanOrEqual(4);

                // Zero hyphens in generated names
                expect(name).not.toContain('-');
            }
        });

        test('generated names fit easily on UI cards (<= 45 chars)', () => {
            for (let i = 0; i < 100; i++) {
                const name = getRandomCharacterName();
                expect(name.length).toBeLessThanOrEqual(45);
            }
        });
    });

    describe('User Scenario: Amordjin Groven Chronarch Negotiator', () => {
        test('generates punchy, non-abstract names without hyphenated compounds', () => {
            const names = [];
            for (let i = 0; i < 20; i++) {
                names.push(getRandomCharacterName({
                    race: 'groven',
                    subrace: 'ithran_groven',
                    characterClass: 'Chronarch',
                    background: 'debtNegotiator',
                    gender: 'male'
                }));
            }

            names.forEach(name => {
                const words = name.trim().split(/\s+/);
                expect(words.length).toBeGreaterThanOrEqual(1);
                expect(words.length).toBeLessThanOrEqual(4);
                expect(name).not.toContain('-');
            });
        });
    });

    describe('Quirky & Characterful Names', () => {
        test('generates quirky adventurer names (like "Big Iron Fist Jeff", "Lucky Finn", etc.)', () => {
            const pool = [];
            for (let i = 0; i < 100; i++) {
                pool.push(getRandomCharacterName());
            }

            const joined = pool.join(' ');
            const hasQuirkyElement = /Big|Iron Fist|Old|Lucky|Rusty|Slick|Grim|Jeff|Ned|Two Coin|One Eye/.test(joined);
            expect(hasQuirkyElement).toBe(true);
        });
    });

    describe('Gender Variation and Authenticity', () => {
        test('female gender generates female/neutral first names and female titles, never strictly male titles', () => {
            const maleExclusiveTitles = ['Lord', 'Sir', 'Brother', 'Father', 'Master'];
            const maleExclusiveQuirky = ['Jeff', 'Ned', 'Barnaby', 'Fritz', 'Burl', 'Hobb'];

            for (let i = 0; i < 100; i++) {
                const name = getRandomCharacterName({
                    race: 'human',
                    subrace: 'skald_human',
                    characterClass: 'Skald',
                    background: 'folkHero',
                    gender: 'female'
                });

                const words = name.split(/\s+/);
                // Should not start with male-exclusive titles
                expect(maleExclusiveTitles).not.toContain(words[0]);
                // Should not contain male-exclusive quirky names
                maleExclusiveQuirky.forEach(maleName => {
                    expect(words).not.toContain(maleName);
                });
            }
        });

        test('male gender generates male/neutral first names and male titles, never strictly female titles', () => {
            const femaleExclusiveTitles = ['Lady', 'Dame', 'Sister', 'Mother', 'Mistress'];
            const femaleExclusiveQuirky = ['Bess', 'Molly', 'Nell', 'Polly', 'Trudy', 'Cora'];

            for (let i = 0; i < 100; i++) {
                const name = getRandomCharacterName({
                    race: 'human',
                    subrace: 'skald_human',
                    characterClass: 'Skald',
                    background: 'folkHero',
                    gender: 'male'
                });

                const words = name.split(/\s+/);
                // Should not start with female-exclusive titles
                expect(femaleExclusiveTitles).not.toContain(words[0]);
                // Should not contain female-exclusive quirky names
                femaleExclusiveQuirky.forEach(femaleName => {
                    expect(words).not.toContain(femaleName);
                });
            }
        });

        test('none / other gender generates neutral names and neutral titles', () => {
            const genderedTitles = ['Lord', 'Sir', 'Brother', 'Father', 'Master', 'Lady', 'Dame', 'Sister', 'Mother', 'Mistress'];

            for (let i = 0; i < 100; i++) {
                const name = getRandomCharacterName({
                    race: 'groven',
                    subrace: 'ithran_groven',
                    characterClass: 'Chronarch',
                    background: 'debtNegotiator',
                    gender: 'none'
                });

                const words = name.split(/\s+/);
                expect(genderedTitles).not.toContain(words[0]);
            }
        });

        test('generateThematicNames returns unique, valid candidate list', () => {
            const suggestions = generateThematicNames({
                race: 'human',
                subrace: 'thalren_human',
                characterClass: 'Warmage',
                background: 'scholar',
                gender: 'female'
            }, 5);

            expect(suggestions.length).toBeGreaterThanOrEqual(1);
            expect(suggestions.length).toBeLessThanOrEqual(5);
            suggestions.forEach(name => {
                expect(typeof name).toBe('string');
                expect(name).not.toContain('-');
                expect(name.split(/\s+/).length).toBeLessThanOrEqual(4);
            });
        });
    });

    describe('Backward Compatibility', () => {
        test('getRandomCharacterName() works with no arguments', () => {
            const name = getRandomCharacterName();
            expect(typeof name).toBe('string');
            expect(name.length).toBeGreaterThan(0);
            expect(name.split(/\s+/).length).toBeLessThanOrEqual(4);
        });

        test('getRandomCharacterName(race) accepts legacy string', () => {
            const name = getRandomCharacterName('skald');
            expect(typeof name).toBe('string');
            expect(name.length).toBeGreaterThan(0);
            expect(name).not.toContain('-');
        });

        test('getRandomRoomName() returns a valid room name', () => {
            const room = getRandomRoomName();
            expect(ROOM_NAMES).toContain(room);
        });
    });
});
