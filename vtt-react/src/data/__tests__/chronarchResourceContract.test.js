import {
  normalizeChronarchResource, getChronarchSpellResourcePlan,
  isChronarchStrainBacklash, CHRONARCH_SHARDS_MAX, CHRONARCH_STRAIN_MAX
} from '../chronarchResourceContract';
import { normalizeManagedClassResource, getManagedSpellResourcePlan, getClassResourceValue } from '../classResourceContracts';
import { createResourceSlice } from '../../store/characterSlices/resourceSlice';

jest.mock('../../store/customLineageStore', () => ({ __esModule: true, default: { getState: () => ({ getLineage: () => null }) } }));
jest.mock('../../store/characterHelpers', () => ({ getEncumbranceState: () => 'normal', triggerCharacterAutoSave: jest.fn() }));

const makeStore = (className, resource) => {
  let state;
  const get = () => state;
  const set = update => { state = { ...state, ...(typeof update === 'function' ? update(state) : update) }; };
  state = { ...createResourceSlice(set, get), class: className, classResource: resource,
    syncWithMultiplayer: jest.fn(), syncResourcesWithMultiplayer: jest.fn() };
  return { getState: get };
};

test('normalization clamps both pools and flags strain backlash', () => {
  const r = normalizeChronarchResource({ timeShards: { current: 4 }, temporalStrain: { current: 7 }, shards: 4, strain: 7 });
  expect(r).toMatchObject({ type: 'timeShardsStrain', maxTimeShards: CHRONARCH_SHARDS_MAX, maxTemporalStrain: CHRONARCH_STRAIN_MAX, backlash: false });
  expect(r.timeShards.current).toBe(4);
  expect(r.temporalStrain.current).toBe(7);
  expect(normalizeChronarchResource({ timeShards: { current: 99 }, temporalStrain: { current: 99 } })).toMatchObject({ backlash: true });
  expect(isChronarchStrainBacklash(10)).toBe(true);
});

test('store routes shards and strain independently', () => {
  const store = makeStore('Chronarch', { type: 'timeShardsStrain', timeShards: { current: 3, max: 10 }, temporalStrain: { current: 2, max: 10 } });
  store.getState().gainClassResource(2);
  expect(store.getState().classResource.timeShards.current).toBe(5);
  store.getState().consumeClassResource(4, 'timeShards');
  expect(store.getState().classResource.timeShards.current).toBe(1);
  store.getState().updateClassResource('temporalStrain', 8);
  expect(store.getState().classResource.temporalStrain.current).toBe(8);
  expect(getClassResourceValue(store.getState().classResource, 'Chronarch', 'temporalStrain')).toBe(8);
});

test('plans treat negative shard cost as generation and positive as spend', () => {
  expect(getChronarchSpellResourcePlan({ resourceCost: { classResource: { type: 'time_shards', cost: -1 } } }, { timeShards: { current: 0 }, temporalStrain: { current: 0 } }, 'timeShardsStrain'))
    .toMatchObject({ handled: true, cost: 0, gain: 1 });
  expect(getChronarchSpellResourcePlan({ resourceCost: { classResource: { type: 'time_shards', cost: 4 } } }, { timeShards: { current: 6 } }, 'timeShardsStrain'))
    .toMatchObject({ cost: 4, affordable: true });
  expect(getChronarchSpellResourcePlan({ resourceCost: { classResource: { type: 'time_shards', cost: 8 } } }, { timeShards: { current: 2 } }, 'timeShardsStrain').affordable).toBe(false);
  expect(normalizeManagedClassResource({ timeShards: { current: 4 }, temporalStrain: { current: 3 } }, 'Chronarch').timeShards.current).toBe(4);
  expect(getManagedSpellResourcePlan({ resourceCost: { classResource: { type: 'time_shards', cost: 2 } } }, { timeShards: { current: 5 }, temporalStrain: { current: 0 } }, 'Chronarch')).toMatchObject({ handled: true, id: 'timeShardsStrain' });
});
