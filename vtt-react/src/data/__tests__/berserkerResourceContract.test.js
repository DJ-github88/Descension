import {
  normalizeBerserkerResource, updateBerserkerResource, getBerserkerSpellResourcePlan,
  getBerserkerRageState, isBerserkerOverheated,
  BERSERKER_RAGE_MAX, BERSERKER_OVERHEAT_THRESHOLD, BERSERKER_RAGE_EXTENDED_MAX
} from '../berserkerResourceContract';
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

test('normalization prefers current, mirrors legacy aliases and never collapses overheat at 100', () => {
  expect(normalizeBerserkerResource({ type: 'rage', current: 105 }))
    .toMatchObject({ type: 'bloodHeat', current: 105, max: BERSERKER_RAGE_MAX, overheated: true });
  expect(normalizeBerserkerResource({ type: 'bloodHeat', bloodHeat: 40 }).current).toBe(40);
  expect(normalizeBerserkerResource({ current: 100 }).overheated).toBe(false);
  expect(normalizeBerserkerResource({ rage: 200 }).current).toBe(BERSERKER_RAGE_EXTENDED_MAX);
  expect(normalizeBerserkerResource({ rage: 200, current: 12 }).current).toBe(12);
});

test('the state table crosses the normal band into the three named overheat states', () => {
  expect(getBerserkerRageState(0).name).toBe('Smoldering');
  expect(getBerserkerRageState(21).name).toBe('Frenzied');
  expect(getBerserkerRageState(100).name).toBe('Cataclysm');
  expect(getBerserkerRageState(101).name).toBe('Obliteration');
  expect(getBerserkerRageState(125).name).toBe('Annihilation');
  expect(getBerserkerRageState(150).name).toBe('Apocalypse');
  expect(isBerserkerOverheated(100)).toBe(false);
  expect(isBerserkerOverheated(BERSERKER_OVERHEAT_THRESHOLD)).toBe(true);
});

test('store gain reaches overheat instead of clamping at the normal band, then spend cools it', () => {
  const store = makeStore('Berserker', { type: 'bloodHeat', current: 95, max: 100 });
  store.getState().gainClassResource(10);
  expect(store.getState().classResource).toMatchObject({ current: 105, max: 100, overheated: true });
  store.getState().consumeClassResource(20);
  expect(store.getState().classResource).toMatchObject({ current: 85, overheated: false });
});

test('a negative classResource cost encodes generation, positive encodes spend, explicit gain is retained', () => {
  const generation = getBerserkerSpellResourcePlan({ resourceCost: { classResource: { type: 'rage', cost: -6 } } }, { current: 0 }, 'bloodHeat');
  expect(generation).toMatchObject({ handled: true, cost: 0, gain: 6, affordable: true });
  const spend = getBerserkerSpellResourcePlan({ resourceCost: { classResource: { type: 'rage', cost: 30 } } }, { current: 40 }, 'bloodHeat');
  expect(spend).toMatchObject({ handled: true, cost: 30, gain: 0, affordable: true });
  const unaffordable = getBerserkerSpellResourcePlan({ resourceCost: { classResource: { type: 'rage', cost: 30 } } }, { current: 10 }, 'bloodHeat');
  expect(unaffordable.affordable).toBe(false);
  const gain = getBerserkerSpellResourcePlan({ resourceCost: { classResource: { type: 'rage', gain: 15 } } }, { current: 0 }, 'bloodHeat');
  expect(gain).toMatchObject({ handled: true, cost: 0, gain: 15 });
});

test('the shared router resolves Berserker resources and spell plans end to end', () => {
  expect(normalizeManagedClassResource({ type: 'rage', current: 50 }, 'Berserker').current).toBe(50);
  const plan = getManagedSpellResourcePlan({ resourceCost: { classResource: { type: 'rage', cost: 30 } } }, { type: 'bloodHeat', current: 40 }, 'Berserker');
  expect(plan).toMatchObject({ handled: true, id: 'bloodHeat', cost: 30, label: 'Rage' });
  expect(updateBerserkerResource({ current: 0 }, 'current', 130)).toMatchObject({ current: 130, overheated: true });
});
