import useDeityStore, { SEEDED_DEITIES } from '../deityStore';
import useTimelineStore, { SEEDED_EVENTS } from '../timelineStore';
import { getDoc } from 'firebase/firestore';

jest.mock('../../config/firebase', () => ({ db: {}, isFirebaseConfigured: true, auth: null }));
jest.mock('firebase/firestore', () => ({ doc: jest.fn(), setDoc: jest.fn(), getDoc: jest.fn() }));
jest.mock('../worldStore', () => ({
  __esModule: true,
  default: { getState: () => ({ activeWorldId: 'mythrill', getActiveWorld: () => ({ customTimelines: [] }) }) }
}));

beforeEach(() => {
  localStorage.removeItem('mythrill_deities');
  useDeityStore.setState({ deities: SEEDED_DEITIES, removedSeedIds: [], lastCloudSyncAt: null });
  useTimelineStore.setState({ events: SEEDED_EVENTS, customEvents: [] });
  getDoc.mockReset();
});

test('local rehydration refreshes defaults while preserving campaign edits and removed seeds', async () => {
  const edited = { id: 'deity-aethil', description: 'Campaign-specific father', isCustom: true };
  localStorage.setItem('mythrill_deities', JSON.stringify({ version: 0, state: {
    deities: [{ id: 'deity-sol', description: 'Old default' }, edited],
    removedSeedIds: ['deity-selunis']
  } }));
  await useDeityStore.persist.rehydrate();
  expect(useDeityStore.getState().getDeity('deity-sol')).toEqual(SEEDED_DEITIES.find(d => d.id === 'deity-sol'));
  expect(useDeityStore.getState().getDeity('deity-aethil')).toEqual(edited);
  expect(useDeityStore.getState().getDeity('deity-selunis')).toBeNull();
});

test('cloud hydration uses the same refresh policy and combines local and remote removals', async () => {
  const custom = { id: 'deity-sol', isCustom: true, description: 'My campaign Sol' };
  useDeityStore.setState({ removedSeedIds: ['deity-aex'] });
  getDoc.mockResolvedValue({ exists: () => true, data: () => ({
    deities: [custom, { id: 'deity-aethil', description: 'Old default' }, { id: 'deity-aex' }],
    removedSeedIds: ['deity-selunis']
  }) });
  expect(await useDeityStore.getState().hydrateFromCloud('test-user')).toBe(true);
  expect(useDeityStore.getState().getDeity('deity-sol')).toEqual(custom);
  expect(useDeityStore.getState().getDeity('deity-aethil')).toEqual(SEEDED_DEITIES.find(d => d.id === 'deity-aethil'));
  expect(useDeityStore.getState().getDeity('deity-aex')).toBeNull();
  expect(useDeityStore.getState().getDeity('deity-selunis')).toBeNull();
});

test('core causal history follows entombment, cracking, infiltration, purge, strike and eruption', () => {
  const chain = [
    'event-entombment', 'event-sol-deepening', 'event-keth-amar-descends',
    'event-keth-amar-corruption', 'event-keth-amar-breach', 'event-blind-strike',
    'event-emberspire-eruption'
  ];
  const ids = new Set(SEEDED_EVENTS.map(event => event.id));
  expect(ids.size).toBe(SEEDED_EVENTS.length);
  chain.forEach((id, index) => {
    const event = useTimelineStore.getState().getEvent(id);
    expect(event).not.toBeNull();
    if (!index) return;
    const previous = chain[index - 1];
    expect(event.date.year).toBeGreaterThanOrEqual(useTimelineStore.getState().getEvent(previous).date.year);
    expect(event.causes).toContain(previous);
    expect(useTimelineStore.getState().getCausalChain(previous).effects.map(effect => effect.id)).toContain(id);
  });
  expect(useTimelineStore.getState().getEvent('event-first-contract').date.year)
    .toBeLessThan(useTimelineStore.getState().getEvent('event-entombment').date.year);
  expect(useTimelineStore.getState().getEvent('event-first-contract').causes).toEqual([]);
});

test('new seeded history does not leak into a custom world timeline', () => {
  const custom = { id: 'event-my-world', worldId: 'my-world', title: 'My history' };
  useTimelineStore.setState({ customEvents: [custom] });
  expect(useTimelineStore.getState().getAllEvents('my-world')).toEqual([custom]);
  expect(useTimelineStore.getState().getAllEvents('mythrill').some(event => event.id === custom.id)).toBe(false);
});
