import useDeityStore, { SEEDED_DEITIES } from '../deityStore';
import useTimelineStore, { SEEDED_EVENTS } from '../timelineStore';
import { getDoc } from 'firebase/firestore';
import {
  activatePrivateScope,
  resetBootstrapGateForTests
} from '../../persistence/bootstrapPrivacyGate';
import { createUserScope } from '../../persistence/scopeModel';
import { getScopedStoreEngine } from '../../persistence/scopedStoreStorage';

jest.mock('../../config/firebase', () => ({ db: {}, isFirebaseConfigured: true, auth: null }));
jest.mock('firebase/firestore', () => ({ doc: jest.fn(), setDoc: jest.fn(), getDoc: jest.fn() }));
jest.mock('../worldStore', () => ({
  __esModule: true,
  default: { getState: () => ({ activeWorldId: 'mythrill', getActiveWorld: () => ({ customTimelines: [] }) }) }
}));

function installFakeLocks(manager) {
  const descriptor = Object.getOwnPropertyDescriptor(navigator, 'locks');
  Object.defineProperty(navigator, 'locks', { configurable: true, value: manager });
  return () => {
    if (descriptor) {
      Object.defineProperty(navigator, 'locks', descriptor);
    } else {
      delete navigator.locks;
    }
  };
}

function serializingLockManager() {
  const tails = new Map();
  return {
    request(name, optionsOrCallback, maybeCallback) {
      const callback = typeof optionsOrCallback === 'function' ? optionsOrCallback : maybeCallback;
      const prior = tails.get(name) || Promise.resolve();
      const run = prior.then(() => callback({ name }));
      tails.set(name, run.catch(() => {}));
      return run;
    }
  };
}

let restoreLocks;
beforeEach(() => {
  localStorage.clear();
  resetBootstrapGateForTests();
  activatePrivateScope(createUserScope('test-user'));
  restoreLocks = installFakeLocks(serializingLockManager());
  useDeityStore.setState({ deities: SEEDED_DEITIES, removedSeedIds: [], lastCloudSyncAt: null });
  useTimelineStore.setState({ events: SEEDED_EVENTS, customEvents: [] });
  getDoc.mockReset();
});

afterEach(() => {
  restoreLocks();
});

test('local rehydration refreshes defaults while preserving campaign edits and removed seeds', async () => {
  const edited = { id: 'deity-aethil', description: 'Campaign-specific father', isCustom: true };
  // Persist the fixture through the scoped engine (production path), then
  // verify the same refresh/merge policy on rehydrate.
  useDeityStore.setState({
    deities: [{ id: 'deity-sol', description: 'Old default' }, edited],
    removedSeedIds: ['deity-selunis']
  });
  await getScopedStoreEngine('worldbuilding.deities').__flush();
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
