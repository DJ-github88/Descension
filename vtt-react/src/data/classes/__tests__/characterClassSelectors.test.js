import fs from 'fs';
import path from 'path';
import {
    CLASS_DISPLAY_DATA,
    CANONICAL_ROSTER_DATA,
    RETIRED_OR_SUPERSEDED_CLASS_NAMES,
    getSelectableClassNames,
    getCanonicalClassNames
} from '../classDisplayData';
import { BASE_CLASSES_DATA } from '../index';
import {
    RECONSTRUCTION_COMPATIBILITY_ROWS,
    getReconstructionCompatibility
} from '../classReconstructionCompatibility';
import { buildClassSwitchPatch } from '../../../store/characterClassSwitch';
import useCharacterStore from '../../../store/characterStore';

const readSource = (relativePath) =>
    fs.readFileSync(path.join(process.cwd(), relativePath), 'utf8');

const APPROVED_CANONICAL_CLASSES = [
    'Animist',
    'Arcanoneer',
    'Berserker',
    'Chaos Weaver',
    'Chronarch',
    'Covenbane',
    'Crusader',
    'Deathcaller',
    'Doomsayer',
    'Dreadnaught',
    'Druid',
    'Exorcist',
    'False Prophet',
    'Fate Weaver',
    'Gambler',
    'Hunter',
    'Lichborne',
    'Lunarch',
    'Martyr',
    'Minstrel',
    'Oracle',
    'Plaguebringer',
    'Pyrofiend',
    'Spellguard',
    'Toxicologist',
    'Warden'
];

const LEGACY_IDENTITIES = [
    'Gambit',
    'Augur',
    'Harbinger',
    'Apex',
    'Shaper',
    'Revenant',
    'Inquisitor'
];

describe('canonical class roster and selector separation', () => {
    describe('approved canonical roster for new character creation', () => {
        test('new-character choices contain each approved canonical class once', () => {
            const selectableNames = getSelectableClassNames();

            // Roster count is exactly 26 approved canonical classes
            expect(selectableNames).toHaveLength(26);
            expect(selectableNames).toHaveLength(APPROVED_CANONICAL_CLASSES.length);

            // No duplicates
            expect(new Set(selectableNames).size).toBe(selectableNames.length);

            // Every approved canonical class is present
            APPROVED_CANONICAL_CLASSES.forEach((cls) => {
                expect(selectableNames).toContain(cls);
            });

            // Canonical names match CANONICAL_ROSTER_DATA exactly
            expect(selectableNames.slice().sort()).toEqual(
                CANONICAL_ROSTER_DATA.map(c => c.name).slice().sort()
            );
            expect(getCanonicalClassNames().slice().sort()).toEqual(
                selectableNames.slice().sort()
            );
        });

        test('the listed legacy identities do not appear as separate new-character choices', () => {
            const selectableNames = getSelectableClassNames();

            // Gambit -> Gambler
            // Augur -> Fate Weaver
            // Harbinger -> Doomsayer
            // Apex -> Hunter
            // Shaper -> Druid
            // Revenant -> retired
            // Inquisitor -> retired in favor of Covenbane / Exorcist (split)
            // Animist -> retired in favor of Totemist (successor-name)
            LEGACY_IDENTITIES.forEach((legacyName) => {
                expect(selectableNames).not.toContain(legacyName);
            });
            expect(RETIRED_OR_SUPERSEDED_CLASS_NAMES).toEqual(LEGACY_IDENTITIES);

            // Nereid compatibility aliases are excluded as separate class choices
            expect(selectableNames).not.toContain('Nereid Myrathil Apex');
            expect(selectableNames).not.toContain('Nereid Myrathil Animist');
            expect(selectableNames).not.toContain('Nereid Myrathil Augur');
        });

        test('Oracle remains selectable independently of Fate Weaver', () => {
            const selectableNames = getSelectableClassNames();
            expect(selectableNames).toContain('Oracle');
            expect(selectableNames).toContain('Fate Weaver');

            const oracleData = CANONICAL_ROSTER_DATA.find(c => c.name === 'Oracle');
            const fateWeaverData = CANONICAL_ROSTER_DATA.find(c => c.name === 'Fate Weaver');
            expect(oracleData).toBeDefined();
            expect(fateWeaverData).toBeDefined();
            expect(oracleData.resource).toBe('Forecasts');
            expect(fateWeaverData.resource).toBe('Fate Links');
            expect(oracleData.name).not.toBe(fateWeaverData.name);
        });

        test('Animist stays a distinct selectable canonical class separate from Totemist', () => {
            const selectableNames = getSelectableClassNames();
            expect(selectableNames).toContain('Animist');
            expect(RETIRED_OR_SUPERSEDED_CLASS_NAMES).not.toContain('Animist');

            const animistCompatibility = getReconstructionCompatibility('animist');
            expect(animistCompatibility).toBeDefined();
            expect(animistCompatibility.relationship).toBe('under-review');
            expect(animistCompatibility.successors).toEqual([]);
            expect(animistCompatibility.automaticConversion).toBe(false);
            expect(animistCompatibility.legacyResolutionRetained).toBe(true);
        });

        test('False Prophet, Lunarch, and Pyrofiend remain selectable', () => {
            const selectableNames = getSelectableClassNames();
            expect(selectableNames).toContain('False Prophet');
            expect(selectableNames).toContain('Lunarch');
            expect(selectableNames).toContain('Pyrofiend');
        });
    });

    describe('legacy compatibility and preservation', () => {
        let consoleErrorSpy;
        let consoleWarnSpy;

        beforeEach(() => {
            consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
            consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
        });

        afterEach(() => {
            consoleErrorSpy.mockRestore();
            consoleWarnSpy.mockRestore();
        });

        test('all 7 legacy identities remain registered base classes in the catalog', () => {
            // Catalogue retains 33 base classes (26 canonical + 7 legacy-compatible)
            expect(Object.keys(BASE_CLASSES_DATA)).toHaveLength(33);
            expect(CLASS_DISPLAY_DATA).toHaveLength(33);

            LEGACY_IDENTITIES.forEach((legacyName) => {
                expect(BASE_CLASSES_DATA[legacyName]).toBeDefined();
                expect(CLASS_DISPLAY_DATA.some(c => c.name === legacyName)).toBe(true);
            });
        });

        test('Animist preserves its data and load behavior as a distinct selectable class', () => {
            const selectableNames = getSelectableClassNames();
            expect(selectableNames).toContain('Animist');
            expect(BASE_CLASSES_DATA.Animist).toBeDefined();
            expect(CLASS_DISPLAY_DATA.some(c => c.name === 'Animist')).toBe(true);

            const row = getReconstructionCompatibility('animist');
            expect(row).toBeDefined();
            expect(row.relationship).toBe('under-review');
            expect(row.legacyResolutionRetained).toBe(true);
            expect(row.automaticConversion).toBe(false);
            expect(row.successors).toEqual([]);
        });

        test('Inquisitor is retired from new-character roster in favor of Covenbane and Exorcist while preserving data and load', () => {
            const selectableNames = getSelectableClassNames();
            expect(selectableNames).not.toContain('Inquisitor');
            expect(BASE_CLASSES_DATA.Inquisitor).toBeDefined();
            expect(CLASS_DISPLAY_DATA.some(c => c.name === 'Inquisitor')).toBe(true);

            const row = getReconstructionCompatibility('inquisitor');
            expect(row).toBeDefined();
            expect(row.relationship).toBe('split');
            expect(row.legacyResolutionRetained).toBe(true);
            expect(row.automaticConversion).toBe(false);
            expect(row.successors).toEqual([
                { id: 'covenbane', name: 'Covenbane', relationship: 'split' },
                { id: 'exorcist', name: 'Exorcist', relationship: 'split' }
            ]);
        });

        test('reconstruction compatibility rows forbid automatic conversion', () => {
            RECONSTRUCTION_COMPATIBILITY_ROWS.forEach(({ legacyKey, row }) => {
                expect(row.automaticConversion).toBe(false);
                expect(row.legacyResolutionRetained).toBe(true);
            });
        });

        test.each(LEGACY_IDENTITIES)(
            'legacy character with class "%s" loads and edits without silent conversion',
            (legacyClassName) => {
                const charId = `legacy-test-${legacyClassName.toLowerCase()}`;
                const testCharacter = {
                    id: charId,
                    name: `Veteran ${legacyClassName}`,
                    class: legacyClassName,
                    level: 5,
                    alignment: 'Neutral',
                    stats: { strength: 12, constitution: 14, agility: 10, intelligence: 10, spirit: 10, charisma: 10 },
                    lore: { notes: 'A storied warrior of old.' },
                    class_spells: { known_spells: [] },
                    talents: {}
                };

                useCharacterStore.setState({
                    characters: [testCharacter],
                    currentCharacterId: null,
                    class: '',
                    level: 1,
                    alignment: '',
                    name: '',
                    lore: {},
                    syncWithMultiplayer: () => {},
                    debouncedSave: () => {},
                    recordCharacterChange: () => {}
                });

                // Load the legacy character
                useCharacterStore.getState().loadCharacter(charId);

                // Class must remain the exact legacy class, not auto-converted
                expect(useCharacterStore.getState().class).toBe(legacyClassName);

                // Editing non-class fields preserves the legacy class without silent conversion
                useCharacterStore.getState().updateCharacterInfo('name', `Renamed ${legacyClassName}`);
                expect(useCharacterStore.getState().class).toBe(legacyClassName);

                useCharacterStore.getState().updateCharacterInfo('level', 6);
                expect(useCharacterStore.getState().class).toBe(legacyClassName);

                useCharacterStore.getState().updateCharacterInfo('alignment', 'Chaotic Good');
                expect(useCharacterStore.getState().class).toBe(legacyClassName);

                // buildClassSwitchPatch returns null when class has not changed
                const patch = buildClassSwitchPatch(testCharacter, legacyClassName, { level: 6 });
                expect(patch).toBeNull();
            }
        );
    });

    describe('canonical roster sources in CharacterPanel, Lore, Step1CoreDraft, and CharacterManager', () => {
        test.each([
            'src/components/character-sheet/CharacterPanel.jsx',
            'src/components/character-sheet/Lore.jsx',
            'src/components/character-creation-wizard/steps/Step1CoreDraft.jsx',
            'src/components/auth/CharacterManager.jsx'
        ])('%s consumes getSelectableClassNames as canonical roster source', (relativePath) => {
            const source = readSource(relativePath);
            expect(source).toContain('getSelectableClassNames');
        });

        test('CharacterPanel and Lore include canonical classes and preserve current legacy class', () => {
            const canonicalNames = getSelectableClassNames();

            // Simulate the options generated by CharacterPanel & Lore for a legacy character
            const legacyClass = 'Gambit';
            const legacyOptions = [
                ...(legacyClass && !canonicalNames.includes(legacyClass) ? [legacyClass] : []),
                ...canonicalNames
            ];

            // Legacy class is preserved as an option
            expect(legacyOptions).toContain('Gambit');
            // Canonical classes are included
            expect(legacyOptions).toContain('Gambler');
            expect(legacyOptions).toContain('Fate Weaver');
            expect(legacyOptions).toContain('Oracle');
            expect(legacyOptions).toContain('Animist');
            // Total options count is 26 + 1 = 27
            expect(legacyOptions).toHaveLength(27);

            // Legacy Inquisitor is preserved when selected
            const legacyInquisitor = 'Inquisitor';
            const inquisitorOptions = [
                ...(legacyInquisitor && !canonicalNames.includes(legacyInquisitor) ? [legacyInquisitor] : []),
                ...canonicalNames
            ];
            expect(inquisitorOptions).toContain('Inquisitor');
            expect(inquisitorOptions).toHaveLength(27);

            // Animist is a canonical class, so selecting it does not duplicate
            const canonicalAnimist = 'Animist';
            const animistOptions = [
                ...(canonicalAnimist && !canonicalNames.includes(canonicalAnimist) ? [canonicalAnimist] : []),
                ...canonicalNames
            ];
            expect(animistOptions).toContain('Animist');
            expect(animistOptions).toHaveLength(26);

            // For a new character or canonical character, no legacy class is injected
            const canonicalCurrent = 'Gambler';
            const canonicalOptions = [
                ...(canonicalCurrent && !canonicalNames.includes(canonicalCurrent) ? [canonicalCurrent] : []),
                ...canonicalNames
            ];
            expect(canonicalOptions).toHaveLength(26);
            expect(canonicalOptions).not.toContain('Gambit');
            expect(canonicalOptions).not.toContain('Augur');
            expect(canonicalOptions).not.toContain('Shaper');
            expect(canonicalOptions).not.toContain('Inquisitor');
            expect(canonicalOptions).toContain('Animist');
        });

        test.each([
            'src/components/character-sheet/CharacterPanel.jsx',
            'src/components/character-sheet/Lore.jsx'
        ])('%s renders current legacy class without losing it', (relativePath) => {
            const source = readSource(relativePath);
            expect(source).toContain('!SELECTABLE_CLASS_NAMES.includes(characterClass)');
            expect(source).not.toMatch(/<option value="Pyrofiend">/);
            expect(source).not.toMatch(/option value="False Prophet"/);
        });

        test('CharacterManager renders registry-derived selector without stale hardcoded list', () => {
            const source = readSource('src/components/auth/CharacterManager.jsx');
            expect(source).toContain('getSelectableClassNames().map');
            expect(source).not.toMatch(/<option value="Arcanoneer">Arcanoneer<\/option>/);
            expect(source).not.toMatch(/<option value="Gambit">Gambit<\/option>/);
            expect(source).not.toMatch(/<option value="Shaper">Shaper<\/option>/);
        });

        test('Step1CoreDraft uses canonical roster and supports locked legacy callings', () => {
            const source = readSource('src/components/character-creation-wizard/steps/Step1CoreDraft.jsx');
            expect(source).toContain('const allClassNames = getSelectableClassNames()');
            expect(source).toContain('classesToShow = isLockedCalling');
            expect(source).not.toMatch(/'Shaper', 'Spellguard'/);
            expect(source).not.toMatch(/'Gambit', 'Chaos Weaver'/);
        });
    });
});
