import { getPyroRing, normalizePyroResource, updatePyroResource, advancePyroDebtCall } from '../pyrofiendResourceContract';
import { getManagedSpellResourcePlan } from '../classResourceContracts';
import { initializeClassResource, updateClassResourceMax } from '../classResources';
import { createResourceSlice } from '../../store/characterSlices/resourceSlice';
import { PYROFIEND_DATA } from '../classes/pyrofiendData';
import useGameStore from '../../store/gameStore';
import { getStore, registerStore } from '../../store/storeRegistry';

const makeStore = (resource, className = 'Pyrofiend') => {
  let state;
  const get = () => state;
  const set = update => { state = { ...state, ...(typeof update === 'function' ? update(state) : update) }; };
  state = { ...createResourceSlice(set, get), class: className, classResource: resource, stats: {}, level: 1,
    syncWithMultiplayer: jest.fn(), syncResourcesWithMultiplayer: jest.fn() };
  return { getState: get };
};

test.each([[0, 0], [1, 1], [3, 1], [4, 2], [6, 2], [7, 3], [9, 3]])('Veil %i belongs to Ring %i', (stage, ring) => {
  expect(getPyroRing(stage)).toBe(ring);
});

test('initialization and legacy normalization enforce 0–9 while preserving save metadata and aliases', () => {
  expect(initializeClassResource('Pyrofiend', {})).toMatchObject({ current: 0, max: 9, ring: 0, debtCall: { latched: false } });
  const saved = { type: 'infernoVeil', infernoLevel: 12, max: 20, note: 'Keep' };
  expect(normalizePyroResource(saved)).toMatchObject({ current: 9, infernoLevel: 9, max: 9, note: 'Keep', debtCall: { latched: true, turnsRemaining: 3 } });
  expect(saved).not.toHaveProperty('debtCall');
});

test('reaching nine latches once; cooling, repeated nine and max refresh never restart the clock', () => {
  let resource = normalizePyroResource({ current: 8, note: 'Keep' });
  resource = updatePyroResource(resource, 'current', 9);
  resource = advancePyroDebtCall(resource, 'own-1').resource;
  resource = updatePyroResource(resource, 'current', 0);
  expect(resource).toMatchObject({ current: 0, ring: 0, debtCall: { latched: true, turnsRemaining: 2 } });
  resource = updatePyroResource(resource, 'current', 9);
  expect(updateClassResourceMax(resource, 'Pyrofiend', {})).toMatchObject({ current: 9, debtCall: { turnsRemaining: 2 } });
});

test('counter receipts are idempotent and the third distinct own turn reaches a permanent expired state', () => {
  let resource = normalizePyroResource({ current: 9 });
  const first = advancePyroDebtCall(resource, 'own-1');
  expect(first).toMatchObject({ accepted: true, resource: { debtCall: { turnsRemaining: 2 } } });
  expect(advancePyroDebtCall(first.resource, 'own-1').accepted).toBe(false);
  expect(advancePyroDebtCall(first.resource, null).accepted).toBe(false);
  resource = advancePyroDebtCall(first.resource, 'own-2').resource;
  resource = advancePyroDebtCall(resource, 'own-3').resource;
  expect(resource.debtCall).toMatchObject({ status: 'expired', expired: true, turnsRemaining: 0 });
  expect(advancePyroDebtCall(resource, 'own-4').accepted).toBe(false);
  expect(updatePyroResource(resource, 'debtCall', { latched: false, expired: false, status: 'inactive', turnsRemaining: 3, processedOwnTurns: [] }).debtCall)
    .toMatchObject({ latched: true, expired: true, turnsRemaining: 0, processedOwnTurns: ['own-1', 'own-2', 'own-3'] });
});

test('inactive clocks do not tick and null legacy countdowns do not invent instant expiry', () => {
  expect(advancePyroDebtCall({ current: 8 }, 'own-1').accepted).toBe(false);
  expect(normalizePyroResource({ current: 9, debtCall: { turnsRemaining: null } }).debtCall.turnsRemaining).toBe(3);
  expect(normalizePyroResource({ current: 0, debtCall: { processedOwnTurns: ['own-1', 'own-2', 'own-1'] } }).debtCall)
    .toMatchObject({ latched: true, turnsRemaining: 1, processedOwnTurns: ['own-1', 'own-2'] });
  expect(normalizePyroResource({ current: 0, debtCall: { latched: false, turnsRemaining: 3, processedOwnTurns: ['own-1', 'own-2', 'own-3'] } }).debtCall)
    .toMatchObject({ latched: true, expired: true, turnsRemaining: 0 });
});

test('store gains, cooling, reset and rehydration preserve the latched call independently of Veil', () => {
  const store = makeStore({ type: 'infernoVeil', current: 8, max: 99 });
  store.getState().gainClassResource(2);
  expect(store.getState().classResource).toMatchObject({ current: 9, max: 9, debtCall: { turnsRemaining: 3 } });
  store.getState().advancePyroOwnTurn('own-1');
  store.getState().consumeClassResource(2);
  store.getState().resetClassResource();
  expect(store.getState().classResource).toMatchObject({ current: 0, debtCall: { latched: true, turnsRemaining: 2 } });
  const saved = JSON.parse(JSON.stringify(store.getState().classResource));
  const reloaded = makeStore(saved);
  expect(reloaded.getState().advancePyroOwnTurn('own-1').accepted).toBe(false);
  reloaded.getState().advancePyroOwnTurn('own-2');
  reloaded.getState().advancePyroOwnTurn('own-3');
  reloaded.getState().resetClassResource();
  expect(reloaded.getState().classResource).toMatchObject({ current: 0, debtCall: { expired: true, turnsRemaining: 0 } });
});

test('the real short/long rest paths cool Pyrofiend without calling or clearing its debt', () => {
  const gamePrevious = useGameStore.getState();
  const previousStores = ['characterStore', 'partyStore', 'conditionStore'].map(key => [key, getStore(key)]);
  const store = makeStore({ type: 'infernoVeil', current: 8, max: 9 });
  registerStore('characterStore', store);
  registerStore('partyStore', { getState: () => ({ partyMembers: [] }) });
  registerStore('conditionStore', { getState: () => ({ clearAllConditions: jest.fn() }) });
  try {
    useGameStore.getState().takeShortRest();
    expect(store.getState().classResource).toMatchObject({ current: 0, debtCall: { latched: false } });
    store.getState().updateClassResource('current', 9, true, true);
    store.getState().advancePyroOwnTurn('own-1');
    useGameStore.getState().takeShortRest();
    useGameStore.getState().takeLongRest();
    expect(store.getState().classResource).toMatchObject({ current: 0, debtCall: { latched: true, turnsRemaining: 2 } });
    const apex = makeStore({ type: 'quarryMarksCompanion', current: 2, max: 5 }, 'Apex');
    registerStore('characterStore', apex);
    useGameStore.getState().takeShortRest();
    expect(apex.getState().classResource.current).toBe(2);
  } finally {
    previousStores.forEach(([key, previous]) => registerStore(key, previous));
    useGameStore.setState(gamePrevious, true);
  }
});

test('a real spell with both ascension and a minimum checks the pre-cast stage, not the future stage', () => {
  const spell = PYROFIEND_DATA.spells.find(entry => entry.id === 'pyro_scorching_grasp');
  expect(getManagedSpellResourcePlan(spell, { type: 'infernoVeil', current: 1 }, 'Pyrofiend'))
    .toMatchObject({ handled: true, required: 2, gain: 1, affordable: false });
  expect(getManagedSpellResourcePlan(spell, { type: 'infernoVeil', current: 2 }, 'Pyrofiend').nextResource.current).toBe(3);
});

test('duplicate generic/dedicated ascension charges once and explicit zero takes precedence', () => {
  const spell = { infernoAscend: 1, resourceCost: { resourceValues: { inferno_ascend: 1, classResource: { type: 'inferno_veil', gain: 1 } } } };
  expect(getManagedSpellResourcePlan(spell, { type: 'infernoVeil', current: 8 }, 'Pyrofiend').nextResource)
    .toMatchObject({ current: 9, debtCall: { latched: true, turnsRemaining: 3 } });
  expect(getManagedSpellResourcePlan({ ...spell, infernoAscend: 0 }, { type: 'infernoVeil', current: 8 }, 'Pyrofiend').nextResource.current).toBe(8);
});

test('a peak of nine cannot be netted away by cooling in the same transition', () => {
  const plan = getManagedSpellResourcePlan({ infernoAscend: 2, infernoDescend: 2 }, { type: 'infernoVeil', current: 8 }, 'Pyrofiend');
  expect(plan.nextResource).toMatchObject({ current: 7, debtCall: { latched: true, turnsRemaining: 3 } });
});

test('dedicated cooling clamps to zero and still preserves a previously latched call', () => {
  const resource = updatePyroResource({ current: 9 }, 'current', 1);
  const plan = getManagedSpellResourcePlan({ infernoDescend: 2, infernoRequired: 0 }, resource, 'Pyrofiend');
  expect(plan).toMatchObject({ affordable: true, cooling: 2 });
  expect(plan.nextResource).toMatchObject({ current: 0, debtCall: { latched: true, turnsRemaining: 3 } });
});

test('expired calls block casting, malformed transitions fail and foreign owners cannot pay', () => {
  const expired = normalizePyroResource({ current: 0, debtCall: { latched: true, turnsRemaining: 0 } });
  expect(getManagedSpellResourcePlan({ resourceCost: { mana: 1 } }, expired, 'Pyrofiend')).toMatchObject({ handled: true, affordable: false });
  expect(getManagedSpellResourcePlan({ infernoAscend: 'bad' }, { current: 1 }, 'Pyrofiend').affordable).toBe(false);
  expect(getManagedSpellResourcePlan({ infernoDescend: 0.5 }, { current: 1 }, 'Pyrofiend').affordable).toBe(false);
  expect(getManagedSpellResourcePlan({ infernoAscend: 1 }, { type: 'fortunePoints', current: 7 }, 'Gambit').affordable).toBe(false);
});
