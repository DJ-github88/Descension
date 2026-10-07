import {
  normalizeFalseProphetResource, getFalseProphetSpellResourcePlan,
  getFalseProphetThreshold, isFalseProphetConvulsion, FALSE_PROPHET_MADNESS_MAX
} from '../falseProphetResourceContract';
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

test('normalization reads madness aliases, clamps to 20 and flags convulsion', () => {
  expect(normalizeFalseProphetResource({ current: 12 })).toMatchObject({ type: 'madnessPoints', current: 12, max: FALSE_PROPHET_MADNESS_MAX, convulsion: false });
  expect(normalizeFalseProphetResource({ madness: 30 }).current).toBe(FALSE_PROPHET_MADNESS_MAX);
  expect(normalizeFalseProphetResource({ madnessPoints: 20 }).convulsion).toBe(true);
  expect(getFalseProphetThreshold(10).name).toBe('Eldritch Empowerment');
  expect(getFalseProphetThreshold(20).name).toBe('Insanity Convulsion');
  expect(isFalseProphetConvulsion(19)).toBe(false);
});

test('store spend and gain route through the shared router', () => {
  const store = makeStore('False Prophet', { type: 'madnessPoints', current: 10, max: 20 });
  store.getState().gainClassResource(2);
  expect(store.getState().classResource.current).toBe(12);
  store.getState().consumeClassResource(4, 'madness');
  expect(store.getState().classResource.current).toBe(8);
  expect(normalizeManagedClassResource({ type: 'madness', current: 12 }, 'False Prophet').current).toBe(12);
});

test('numeric and dice encodings are handled without inventing dice amounts', () => {
  expect(getFalseProphetSpellResourcePlan({ resourceCost: { classResource: { type: 'madness', gain: 2 } } }, { current: 0 }, 'madnessPoints')).toMatchObject({ handled: true, gain: 2, dice: false });
  expect(getFalseProphetSpellResourcePlan({ resourceCost: { classResource: { type: 'madness', cost: 4 } } }, { current: 10 }, 'madnessPoints')).toMatchObject({ handled: true, cost: 4, affordable: true });
  const diceGain = getFalseProphetSpellResourcePlan({ resourceCost: { classResource: { type: 'madness', gain: '1d4' } } }, { current: 0 }, 'madnessPoints');
  expect(diceGain).toMatchObject({ handled: true, gain: 0, dice: true, affordable: true });
  const diceCost = getFalseProphetSpellResourcePlan({ resourceCost: { classResource: { type: 'madness', cost: '1d4' } } }, { current: 0 }, 'madnessPoints');
  expect(diceCost).toMatchObject({ handled: true, cost: 0, dice: true, affordable: true });
  expect(getManagedSpellResourcePlan({ resourceCost: { classResource: { type: 'madness', gain: 1 } } }, { type: 'madnessPoints', current: 5 }, 'False Prophet')).toMatchObject({ handled: true, id: 'madnessPoints' });
});
