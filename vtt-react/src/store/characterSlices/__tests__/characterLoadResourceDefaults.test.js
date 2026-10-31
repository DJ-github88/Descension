import useCharacterStore from '../../characterStore';

const stats = { strength: 15, agility: 5, constitution: 5, intelligence: 5, spirit: 5, charisma: 5 };
const ancestry = {
    heritageId: 'thalren_human',
    core: 'desperate_will_human',
    picks: { mind: 'lineage_recall_thalren', fog: 'fog_sense_thalren', quill: 'thalren_ink_stained_hand' },
    catalogVersion: 1
};

const character = (id, overrides = {}) => ({
    id,
    name: `Resource ${id}`,
    class: 'Inquisitor',
    characterClass: 'Inquisitor',
    level: 1,
    race: 'human',
    subrace: 'thalren_human',
    background: 'fogReader',
    statsModel: 'base+earned@1',
    baseStats: { ...stats },
    stats: { ...stats },
    ancestry,
    inventory: { items: [], currency: {}, encumbranceState: 'normal' },
    equipment: {},
    class_spells: { known_spells: [] },
    talents: {},
    classResource: null,
    resources: {
        health: { current: 0, max: 37 },
        mana: { current: 0, max: 42 },
        actionPoints: { current: 3, max: 3 }
    },
    health: { current: 0, max: 37 },
    mana: { current: 0, max: 42 },
    ...overrides
});

const load = (record) => {
    useCharacterStore.setState({
        characters: [record],
        currentCharacterId: null,
        health: { current: 0, max: 50 },
        mana: { current: 0, max: 50 },
        actionPoints: { current: 3, max: 3 },
        stats: { ...stats },
        baseStats: { ...stats },
        race: record.race,
        subrace: record.subrace,
        ancestry: record.ancestry,
        inventory: record.inventory,
        equipment: {},
        class_spells: { known_spells: [] },
        talents: {},
        classResource: null,
        level: 1,
        syncWithMultiplayer: () => {},
        debouncedSave: () => {},
        recordCharacterChange: () => {}
    });
    useCharacterStore.getState().loadCharacter(record.id);
};

describe('character load resource defaults', () => {
    test('preserves a saved current HP of zero', () => {
        const record = character('zero-hp', {
            health: { current: 0, max: 37 },
            mana: { current: 20, max: 42 },
            resources: {
                health: { current: 0, max: 37 },
                mana: { current: 20, max: 42 },
                actionPoints: { current: 3, max: 3 }
            }
        });
        load(record);
        expect(useCharacterStore.getState().health.current).toBe(0);
        expect(useCharacterStore.getState().mana.current).toBe(20);
    });

    test('preserves a saved current MP of zero', () => {
        const record = character('zero-mp', {
            health: { current: 20, max: 37 },
            mana: { current: 0, max: 42 },
            resources: {
                health: { current: 20, max: 37 },
                mana: { current: 0, max: 42 },
                actionPoints: { current: 3, max: 3 }
            }
        });
        load(record);
        expect(useCharacterStore.getState().health.current).toBe(20);
        expect(useCharacterStore.getState().mana.current).toBe(0);
    });

    test('uses the fallback when current values are absent', () => {
        const raisedStats = { ...stats, constitution: 10, intelligence: 10 };
        const record = character('missing-current', {
            baseStats: raisedStats,
            stats: raisedStats,
            health: { max: 64 },
            mana: { max: 64 },
            resources: {
                health: { max: 64 },
                mana: { max: 64 },
                actionPoints: { current: 3, max: 3 }
            }
        });
        load(record);
        expect(useCharacterStore.getState().health.current).toBe(45);
        expect(useCharacterStore.getState().mana.current).toBe(45);
    });

    test('level-up health and mana choices survive load and are removed on level-down', () => {
        const record = character('level-up', {
            level: 3,
            health: { current: 30, max: 52 },
            mana: { current: 20, max: 52 },
            resources: {
                health: { current: 30, max: 52 },
                mana: { current: 20, max: 52 },
                actionPoints: { current: 3, max: 3 }
            },
            levelUpHistory: {
                2: { healthIncrease: 15, manaIncrease: 10, attributes: [] },
                3: { healthIncrease: 0, manaIncrease: 0, attributes: [] }
            }
        });

        load(record);
        let state = useCharacterStore.getState();
        expect(state.health).toEqual({ current: 30, max: 52 });
        expect(state.mana).toEqual({ current: 20, max: 52 });

        useCharacterStore.getState().updateCharacterInfo('level', 1);
        useCharacterStore.getState().initializeCharacter();
        state = useCharacterStore.getState();
        expect(state.level).toBe(1);
        expect(state.health).toEqual({ current: 30, max: 37 });
        expect(state.mana).toEqual({ current: 20, max: 42 });
        expect(state.levelUpHistory).toEqual({});
    });
});
