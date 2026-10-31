import useCharacterStore from '../../store/characterStore';
import { assembleCharacterWorkingData } from '../../store/characterHelpers';
import { buildCharacterResourceSnapshot } from '../characterResourceSnapshot';

const arcanoneer = {
    id: 'ri6-arcanoneer',
    name: 'Arc Proof',
    race: 'neth',
    subrace: 'velun_neth',
    background: 'synodAcademic',
    statsModel: 'base+earned@1',
    baseStats: { strength: 15, agility: 5, constitution: 5, intelligence: 5, spirit: 5, charisma: 5 },
    stats: { strength: 15, agility: 5, constitution: 5, intelligence: 5, spirit: 5, charisma: 5 },
    ancestry: {
        heritageId: 'velun_neth', core: 'pact_stillness_neth',
        picks: { word: 'bound_tongue_velun', lore: 'memory_glass_training_velun', flame: 'pact_flame_velun' },
        catalogVersion: 1
    },
    inventory: { encumbranceState: 'normal' },
    health: { current: 41, max: 41 },
    mana: { current: 25, max: 80 },
    resources: { health: { current: 41, max: 41 }, mana: { current: 25, max: 80 } }
};

const minstrel = {
    id: 'ri6-minstrel',
    name: 'Song Proof',
    race: 'human',
    subrace: 'merryn_human',
    background: 'synodAcademic',
    statsModel: 'base+earned@1',
    baseStats: { strength: 15, agility: 6, constitution: 6, intelligence: 5, spirit: 5, charisma: 5 },
    stats: { strength: 15, agility: 6, constitution: 6, intelligence: 5, spirit: 5, charisma: 5 },
    ancestry: {
        heritageId: 'merryn_human', core: 'desperate_will_human',
        picks: { sea: 'sea_legs_merryn', deal: 'tattoo_contract_merryn', rope: 'merryn_rope_hand' },
        catalogVersion: 1
    },
    inventory: { encumbranceState: 'encumbered' },
    health: { current: 48, max: 48 },
    mana: { current: 25, max: 35 },
    resources: { health: { current: 48, max: 48 }, mana: { current: 25, max: 35 } }
};

const chronarch = {
    id: 'ri6-chronarch',
    name: 'Time Proof',
    race: 'human',
    subrace: 'tessen_human',
    background: 'synodAcademic',
    statsModel: 'base+earned@1',
    baseStats: { strength: 15, agility: 6, constitution: 6, intelligence: 5, spirit: 5, charisma: 5 },
    stats: { strength: 15, agility: 6, constitution: 6, intelligence: 5, spirit: 5, charisma: 5 },
    ancestry: {
        heritageId: 'tessen_human', core: 'desperate_will_human',
        picks: { shadow: 'keep_rat_tessen', debt: 'favor_debt_tessen', lock: 'tessen_keyhole_eye' },
        catalogVersion: 1
    },
    inventory: { encumbranceState: 'encumbered' },
    health: { current: 50, max: 50 },
    mana: { current: 25, max: 50 },
    resources: { health: { current: 50, max: 50 }, mana: { current: 25, max: 50 } }
};

const ri8BaseStats = { strength: 15, agility: 5, constitution: 5, intelligence: 5, spirit: 5, charisma: 5 };

const inquisitor = {
    id: 'ri8-inquisitor',
    name: 'Iron Proof',
    race: 'human',
    subrace: 'thalren_human',
    background: 'fogReader',
    statsModel: 'base+earned@1',
    baseStats: { ...ri8BaseStats },
    stats: { ...ri8BaseStats },
    ancestry: {
        heritageId: 'thalren_human', core: 'desperate_will_human',
        picks: { mind: 'lineage_recall_thalren', fog: 'fog_sense_thalren', quill: 'thalren_ink_stained_hand' },
        catalogVersion: 1
    },
    inventory: { encumbranceState: 'normal' },
    health: { current: 37, max: 37 },
    mana: { current: 42, max: 42 },
    resources: { health: { current: 37, max: 37 }, mana: { current: 42, max: 42 } }
};

const spellguard = {
    id: 'ri8-spellguard',
    name: 'Aegis Proof',
    race: 'solari',
    subrace: 'korr_solari',
    background: 'emberspirePilgrim',
    statsModel: 'base+earned@1',
    baseStats: { ...ri8BaseStats },
    stats: { ...ri8BaseStats },
    ancestry: {
        heritageId: 'korr_solari', core: 'vault_breath_solari',
        picks: { breath: 'ash_lung_solari', senses: 'listening_dark_korr', pulse: 'sols_breath_pulse_korr' },
        catalogVersion: 1
    },
    inventory: { encumbranceState: 'normal' },
    health: { current: 64, max: 64 },
    mana: { current: 52, max: 52 },
    resources: { health: { current: 64, max: 64 }, mana: { current: 52, max: 52 } }
};

const toxicologist = {
    id: 'ri8-toxicologist',
    name: 'Vial Proof',
    race: 'florae',
    subrace: 'viridian_florae',
    background: 'groveWarden',
    statsModel: 'base+earned@1',
    baseStats: { ...ri8BaseStats },
    stats: { ...ri8BaseStats },
    ancestry: {
        heritageId: 'viridian_florae', core: 'branch_arm_brawn_florae',
        picks: { body: 'thorn_barb_bristle_viridian', sense: 'unwritten_word_viridian', will: 'fog_compact_refusal_viridian' },
        catalogVersion: 1
    },
    inventory: { encumbranceState: 'normal' },
    health: { current: 22, max: 22 },
    mana: { current: 34, max: 34 },
    resources: { health: { current: 22, max: 22 }, mana: { current: 34, max: 34 } }
};

const setStoreFrom = (character) => {
    useCharacterStore.setState({
        ...character,
        class: character.class || 'Minstrel',
        health: { ...character.health },
        mana: { ...character.mana },
        currentCharacterId: null
    });
};

describe('shared character resource agreement', () => {
    test.each([
        { label: 'Minstrel Merryn', character: minstrel, expected: { hp: 48, mp: 35 } },
        { label: 'Chronarch Tessic', character: chronarch, expected: { hp: 50, mp: 50 } },
        { label: 'control Arcanoneer Nethien (already agreed)', character: arcanoneer, expected: { hp: 41, mp: 80 } },
        { label: 'RI-8 Inquisitor Tallyn', character: inquisitor, expected: { hp: 37, mp: 42 } },
        { label: 'RI-8 Spellguard Korr', character: spellguard, expected: { hp: 64, mp: 52 } },
        { label: 'RI-8 Toxicologist Briaren', character: toxicologist, expected: { hp: 22, mp: 34 } }
    ])('$label: persisted, roster snapshot and store/view source agree', ({ character, expected }) => {
        const snapshot = buildCharacterResourceSnapshot(character);
        expect(snapshot.health.max).toBe(expected.hp);
        expect(snapshot.mana.max).toBe(expected.mp);

        // Persisted resources and the roster helper share the same canonical value.
        expect(character.resources.health.max).toBe(expected.hp);
        expect(character.resources.mana.max).toBe(expected.mp);

        // The character view reads store health/mana, so the store recalculation
        // must produce exactly the same values as the roster snapshot.
        setStoreFrom(character);
        useCharacterStore.getState().recalculateResources();
        const state = useCharacterStore.getState();
        expect(state.health).toEqual(snapshot.health);
        expect(state.mana).toEqual(snapshot.mana);
    });

    test('level-up health and mana choices are included exactly once and preserve current resources', () => {
        const character = {
            ...inquisitor,
            level: 2,
            health: { current: 10, max: 37 },
            mana: { current: 8, max: 42 },
            resources: {
                health: { current: 10, max: 37 },
                mana: { current: 8, max: 42 }
            },
            levelUpHistory: {
                2: { healthIncrease: 15, manaIncrease: 10, attributes: [] }
            }
        };

        const withoutHistory = buildCharacterResourceSnapshot({
            ...character,
            levelUpHistory: {}
        });
        const snapshot = buildCharacterResourceSnapshot(character);

        expect(snapshot.health.max).toBe(withoutHistory.health.max + 15);
        expect(snapshot.mana.max).toBe(withoutHistory.mana.max + 10);
        expect(snapshot.health.current).toBe(10);
        expect(snapshot.mana.current).toBe(8);

        setStoreFrom(character);
        useCharacterStore.getState().recalculateResources();
        const state = useCharacterStore.getState();
        expect(state.health).toEqual(snapshot.health);
        expect(state.mana).toEqual(snapshot.mana);
    });

    test('advancement records health/mana choices once and preserves current resources', () => {
        const character = {
            ...inquisitor,
            class: 'Inquisitor',
            level: 2,
            pendingLevelUpInfo: { newLevel: 2, oldLevel: 1 },
            levelUpHistory: {},
            class_spells: { known_spells: ['inq_iron_interrogation'] },
            health: { current: 10, max: 37 },
            mana: { current: 8, max: 42 },
            resources: {
                health: { current: 10, max: 37 },
                mana: { current: 8, max: 42 }
            }
        };
        const before = buildCharacterResourceSnapshot(character);
        expect(before.health.max).toBe(37);
        expect(before.mana.max).toBe(42);

        setStoreFrom(character);
        useCharacterStore.getState().handleLevelUpChoice({
            healthIncrease: 15,
            manaIncrease: 10,
            attributes: []
        });

        const state = useCharacterStore.getState();
        expect(state.levelUpHistory[2]).toMatchObject({
            healthIncrease: 15,
            manaIncrease: 10
        });
        expect(state.health).toEqual({ current: 10, max: 52 });
        expect(state.mana).toEqual({ current: 8, max: 52 });
        expect(buildCharacterResourceSnapshot(state)).toMatchObject({
            health: { current: 10, max: 52 },
            mana: { current: 8, max: 52 }
        });
    });

    test('earned health/mana survive canonical save and reopen', () => {
        const character = {
            ...inquisitor,
            level: 3,
            levelUpHistory: {
                2: { healthIncrease: 15, manaIncrease: 10, attributes: [] },
                3: { healthIncrease: 0, manaIncrease: 0, attributes: ['spirit'] }
            },
            health: { current: 12, max: 52 },
            mana: { current: 7, max: 52 },
            resources: {
                health: { current: 12, max: 52 },
                mana: { current: 7, max: 52 },
                actionPoints: { current: 3, max: 3 }
            }
        };

        setStoreFrom(character);
        // A real open character is also present in the roster, which keeps its
        // explicit baseStats in the canonical save payload.
        useCharacterStore.setState({
            characters: [character],
            currentCharacterId: character.id
        });
        useCharacterStore.getState().recalculateResources();
        const saved = assembleCharacterWorkingData(useCharacterStore.getState(), {
            items: [],
            currency: { platinum: 0, gold: 0, silver: 0, copper: 0 },
            encumbranceState: 'normal'
        });

        expect(saved.levelUpHistory).toEqual(character.levelUpHistory);
        expect(saved.resources.health).toEqual({ current: 12, max: 52 });
        expect(saved.resources.mana).toEqual({ current: 7, max: 52 });

        const reopened = buildCharacterResourceSnapshot(saved);
        expect(reopened.health).toEqual({ current: 12, max: 52 });
        expect(reopened.mana).toEqual({ current: 7, max: 52 });
    });

    test('null current values use the effective maximum while zero is preserved', () => {
        const snapshot = buildCharacterResourceSnapshot({
            ...inquisitor,
            health: { current: null, max: 37 },
            mana: { current: 0, max: 42 },
            resources: {
                health: { current: null, max: 37 },
                mana: { current: 0, max: 42 }
            }
        });

        expect(snapshot.health.current).toBe(37);
        expect(snapshot.mana.current).toBe(0);
    });
});
