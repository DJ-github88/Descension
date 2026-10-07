import {
  normalizeHarbingerResource, updateHarbingerResource, getHarbingerSpellResourcePlan,
  getHarbingerMayhemTier, isHarbingerWildSurge,
  HARBINGER_MAYHEM_MAX, HARBINGER_WILD_SURGE
} from '../harbingerResourceContract';
import { normalizeManagedClassResource, getManagedSpellResourcePlan } from '../classResourceContracts';
import { createResourceSlice } from '../../store/characterSlices/resourceSlice';

jest.mock('../../store/customLineageStore', () => ({
  __esModule: true, default: { getState: () => ({ getLineage: () => null }) }
}));
jest.mock('../../store/characterHelpers', () => ({
  getEncumbranceState: () => 'normal', triggerCharacterAutoSave: jest.fn()
}));

const makeStore = (className, resource) => {
  let state;
  const get = () => state;
  const set = update => { state = { ...state, ...(typeof update === 'function' ? update(state) : update) }; };
  state = { ...createResourceSlice(set, get), class: className, classResource: resource,
    syncWithMultiplayer: jest.fn(), syncResourcesWithMultiplayer: jest.fn() };
  return { getState: get };
};

test('normalization prefers current, mirrors mayhem aliases and clamps to 0-100', () => {
  expect(normalizeHarbingerResource({ type: 'mayhem', current: 60 }))
    .toMatchObject({ type: 'mayhemGauge', current: 60, max: HARBINGER_MAYHEM_MAX });
  expect(normalizeHarbingerResource({ mayhemGauge: 35 }).current).toBe(35);
  expect(normalizeHarbingerResource({ mayhem: 250 }).current).toBe(100);
  expect(normalizeHarbingerResource({ mayhem: 250, current: 12 }).current).toBe(12);
});

test('the tier table separates safe, escalating, volatile, maximum and wild surge', () => {
  expect(getHarbingerMayhemTier(0).name).toBe('Safe');
  expect(getHarbingerMayhemTier(41).name).toBe('Escalating');
  expect(getHarbingerMayhemTier(61).name).toBe('Volatile');
  expect(getHarbingerMayhemTier(81).name).toBe('Maximum');
  expect(getHarbingerMayhemTier(100).name).toBe('Wild Surge');
  expect(isHarbingerWildSurge(99)).toBe(false);
  expect(isHarbingerWildSurge(HARBINGER_WILD_SURGE)).toBe(true);
});

test('store spend and gain round-trip through the shared router', () => {
  const store = makeStore('Harbinger', { type: 'mayhemGauge', current: 40, max: 100 });
  store.getState().gainClassResource(30);
  expect(store.getState().classResource).toMatchObject({ current: 70, max: 100, wildSurge: false });
  store.getState().consumeClassResource(5);
  expect(store.getState().classResource.current).toBe(65);
  store.getState().gainClassResource(100);
  expect(store.getState().classResource).toMatchObject({ current: 100, wildSurge: true });
});

test('negative cost encodes generation, positive encodes release, explicit gain retained', () => {
  const generation = getHarbingerSpellResourcePlan({ resourceCost: { classResource: { type: 'mayhem', cost: -3 } } }, { current: 0 }, 'mayhemGauge');
  expect(generation).toMatchObject({ handled: true, cost: 0, gain: 3, affordable: true });
  const release = getHarbingerSpellResourcePlan({ resourceCost: { classResource: { type: 'mayhem', cost: 8 } } }, { current: 20 }, 'mayhemGauge');
  expect(release).toMatchObject({ handled: true, cost: 8, gain: 0, affordable: true });
  expect(getHarbingerSpellResourcePlan({ resourceCost: { classResource: { type: 'mayhem', cost: 8 } } }, { current: 4 }, 'mayhemGauge').affordable).toBe(false);
  expect(getHarbingerSpellResourcePlan({ resourceCost: { classResource: { type: 'mayhem', gain: 5 } } }, { current: 0 }, 'mayhemGauge')).toMatchObject({ gain: 5 });
});

test('the shared router resolves Harbinger resources and plans end to end', () => {
  expect(normalizeManagedClassResource({ type: 'mayhem', current: 50 }, 'Harbinger').current).toBe(50);
  const plan = getManagedSpellResourcePlan({ resourceCost: { classResource: { type: 'mayhem', cost: 4 } } }, { type: 'mayhemGauge', current: 40 }, 'Harbinger');
  expect(plan).toMatchObject({ handled: true, id: 'mayhemGauge', cost: 4, label: 'Mayhem' });
  expect(updateHarbingerResource({ current: 0 }, 'current', 100)).toMatchObject({ current: 100, wildSurge: true });
});
