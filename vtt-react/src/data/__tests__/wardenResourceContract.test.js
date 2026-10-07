import {
  normalizeWardenResource, getWardenSpellResourcePlan, WARDEN_TENSION_MAX
} from '../wardenResourceContract';
import { normalizeManagedClassResource, getManagedSpellResourcePlan } from '../classResourceContracts';
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

test('normalization reads tension aliases and clamps to ten while keeping the legacy engine id', () => {
  expect(normalizeWardenResource({ current: 6 })).toMatchObject({ type: 'vengeance-points', current: 6, max: WARDEN_TENSION_MAX });
  expect(normalizeWardenResource({ vengeancePoints: 99 }).current).toBe(WARDEN_TENSION_MAX);
  expect(normalizeWardenResource({ vp: 4 }).current).toBe(4);
});

test('store spend and gain route through the shared router', () => {
  const store = makeStore('Warden', { type: 'vengeance-points', current: 3, max: 10 });
  store.getState().gainClassResource(4);
  expect(store.getState().classResource.current).toBe(7);
  store.getState().consumeClassResource(6, 'tension');
  expect(store.getState().classResource.current).toBe(1);
  expect(normalizeManagedClassResource({ type: 'tension', current: 5 }, 'Warden').current).toBe(5);
});

test('negative tension cost encodes generation and positive cost is a spend', () => {
  expect(getWardenSpellResourcePlan({ resourceCost: { classResource: { type: 'tension', cost: -2 } } }, { current: 0 }, 'vengeance-points'))
    .toMatchObject({ handled: true, cost: 0, gain: 2 });
  expect(getWardenSpellResourcePlan({ resourceCost: { classResource: { type: 'tension', cost: 10 } } }, { current: 10 }, 'vengeance-points'))
    .toMatchObject({ cost: 10, affordable: true });
  expect(getWardenSpellResourcePlan({ resourceCost: { classResource: { type: 'tension', cost: 10 } } }, { current: 3 }, 'vengeance-points').affordable).toBe(false);
  expect(getManagedSpellResourcePlan({ resourceCost: { classResource: { type: 'tension', cost: 2 } } }, { type: 'vengeance-points', current: 5 }, 'Warden')).toMatchObject({ handled: true, id: 'vengeance-points', label: 'Tension' });
});
