import useCharacterStore from '../../characterStore';

const baseState = () => ({
  currentCharacterId: null,
  health: { current: 45, max: 50 },
  mana: { current: 45, max: 50 },
  actionPoints: { current: 1, max: 3 },
  tempHealth: 0,
  tempMana: 0,
  tempActionPoints: 0,
  stats: { constitution: 10, strength: 10, agility: 10, intelligence: 10, spirit: 10, charisma: 10 },
  equipment: {},
  race: '',
  subrace: '',
  exhaustionLevel: 0,
  inventory: {
    items: [],
    currency: { platinum: 0, gold: 0, silver: 0, copper: 0 },
    encumbranceState: 'normal'
  },
  syncWithMultiplayer: () => {}
});

describe('resourceSlice', () => {
  beforeEach(() => useCharacterStore.setState(baseState()));

  it('clamps current into [0, max]', () => {
    useCharacterStore.getState().updateResource('health', 999, undefined, undefined, true, true);
    expect(useCharacterStore.getState().health.current).toBe(50);

    useCharacterStore.getState().updateResource('health', -5, undefined, undefined, true, true);
    expect(useCharacterStore.getState().health.current).toBe(0);
  });

  it('updates max when provided', () => {
    useCharacterStore.getState().updateResource('mana', 10, 80, undefined, true, true);
    expect(useCharacterStore.getState().mana).toEqual({ current: 10, max: 80 });
  });

  it('clamps temporary resources to >= 0', () => {
    const s = useCharacterStore.getState();
    s.updateTempResource('health', 12, true, true);
    expect(useCharacterStore.getState().tempHealth).toBe(12);

    s.updateTempResource('health', -3, true, true);
    expect(useCharacterStore.getState().tempHealth).toBe(0);
  });

  it('merges partial resource updates without touching max', () => {
    useCharacterStore.getState().updateActionPoints({ current: 2 });
    expect(useCharacterStore.getState().actionPoints).toEqual({ current: 2, max: 3 });

    useCharacterStore.getState().updateMana({ current: 5 });
    expect(useCharacterStore.getState().mana).toEqual({ current: 5, max: 50 });
  });

  it('recalculateResources recomputes max and clamps current down to it', () => {
    useCharacterStore.setState({
      health: { current: 9999, max: 9999 },
      mana: { current: 9999, max: 9999 }
    });

    useCharacterStore.getState().recalculateResources();
    const s = useCharacterStore.getState();

    expect(s.health.max).toBe(Math.round(s.derivedStats.maxHealth));
    expect(s.health.current).toBe(s.health.max);
    expect(s.mana.max).toBe(Math.round(s.derivedStats.maxMana));
    expect(s.mana.current).toBe(s.mana.max);
  });
});
