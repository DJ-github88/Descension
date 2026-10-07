import useCharacterStore from '../../characterStore';
import { registerStore } from '../../storeRegistry';

beforeAll(() => {
  // updateStat consults the condition store for buff/debuff modifiers.
  registerStore('conditionStore', {
    getState: () => ({ getActiveEffects: () => [] })
  });
});

const baseStats = () => ({
  constitution: 10, strength: 10, agility: 10, intelligence: 10, spirit: 10, charisma: 10
});

const baseState = () => ({
  currentCharacterId: null,
  stats: baseStats(),
  equipment: {},
  race: '',
  subrace: '',
  exhaustionLevel: 0,
  health: { current: 40, max: 50 },
  mana: { current: 40, max: 50 },
  actionPoints: { current: 1, max: 3 },
  classResource: null,
  class: '',
  inventory: {
    items: [],
    currency: { platinum: 0, gold: 0, silver: 0, copper: 0 },
    encumbranceState: 'normal'
  },
  syncWithMultiplayer: () => {}
});

describe('statsSlice.updateStat', () => {
  beforeEach(() => useCharacterStore.setState(baseState()));

  it('updates the stat and recomputes derived max health', () => {
    const beforeMaxHp = useCharacterStore.getState().health.max;

    useCharacterStore.getState().updateStat('constitution', 20);

    const after = useCharacterStore.getState();
    expect(after.stats.constitution).toBe(20);
    expect(after.health.max).toBe(Math.round(after.derivedStats.maxHealth));
    expect(after.health.max).toBeGreaterThan(beforeMaxHp);
  });

  it('clamps current health down when the new max is lower', () => {
    useCharacterStore.setState({
      stats: { ...baseStats(), constitution: 20 },
      health: { current: 100, max: 100 }
    });

    useCharacterStore.getState().updateStat('constitution', 5);

    const after = useCharacterStore.getState();
    expect(after.health.current).toBeLessThanOrEqual(after.health.max);
    expect(after.health.max).toBe(Math.round(after.derivedStats.maxHealth));
  });
});
