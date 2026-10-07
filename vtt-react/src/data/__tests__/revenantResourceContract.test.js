import {
  normalizeRevenantResource, updateRevenantResource, getRevenantSpellResourcePlan,
  getRevenantTollTier, isRevenantCataclysm, getRevenantPoolValue,
  REVENANT_TOLL_MAX, REVENANT_PHYLACTERY_MAX
} from '../revenantResourceContract';
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

test('normalization reads toll from aliases, clamps both finite pools and preserves shroud', () => {
  expect(normalizeRevenantResource({ current: 5, phylacteryHP: 30 }))
    .toMatchObject({ type: 'revenant-toll', toll: 5, current: 5, phylacteryHP: 30, maxToll: REVENANT_TOLL_MAX });
  expect(normalizeRevenantResource({ deathToll: 99 }).toll).toBe(REVENANT_TOLL_MAX);
  expect(normalizeRevenantResource({ toll: 3 }).phylacteryHP).toBe(REVENANT_PHYLACTERY_MAX);
  expect(normalizeRevenantResource({ toll: 3, phylacteryHP: 999 }).phylacteryHP).toBe(REVENANT_PHYLACTERY_MAX);
  expect(normalizeRevenantResource({ toll: 3, deathShroud: true }).deathShroud).toBe(true);
});

test('the toll tier table reaches Cataclysm at 16', () => {
  expect(getRevenantTollTier(0).name).toBe('Stasis');
  expect(getRevenantTollTier(6).name).toBe('Searing');
  expect(getRevenantTollTier(11).name).toBe('Rot Surge');
  expect(getRevenantTollTier(16).name).toBe('Cataclysm');
  expect(isRevenantCataclysm(15)).toBe(false);
  expect(isRevenantCataclysm(16)).toBe(true);
});

test('store routes toll and phylactery independently', () => {
  const store = makeStore('Revenant', { toll: 4, phylacteryHP: 20, maxToll: 20, maxPhylacteryHP: 50, deathShroud: false });
  store.getState().consumeClassResource(3, 'toll');
  expect(store.getState().classResource).toMatchObject({ toll: 1, phylacteryHP: 20 });
  store.getState().gainClassResource(6, 'toll');
  expect(store.getState().classResource).toMatchObject({ toll: 7, phylacteryHP: 20 });
  store.getState().gainClassResource(15, 'phylactery');
  expect(store.getState().classResource).toMatchObject({ phylacteryHP: 35, toll: 7 });
  expect(getRevenantPoolValue(store.getState().classResource, 'phylactery')).toBe(35);
});

test('shroud and caps update without disturbing the pools', () => {
  const shroud = updateRevenantResource({ toll: 8, phylacteryHP: 40 }, 'deathShroud', true);
  expect(shroud).toMatchObject({ deathShroud: true, toll: 8, phylacteryHP: 40 });
  expect(updateRevenantResource({ toll: 8 }, 'maxToll', 25)).toMatchObject({ maxToll: 25 });
});

test('toll and phylactery plans follow the negative-cost generation convention', () => {
  expect(getRevenantSpellResourcePlan({ resourceCost: { classResource: { type: 'toll', gain: 2 } } }, { toll: 0 }, 'revenant-toll'))
    .toMatchObject({ handled: true, pool: 'toll', cost: 0, gain: 2 });
  expect(getRevenantSpellResourcePlan({ resourceCost: { classResource: { type: 'toll', cost: 10 } } }, { toll: 20 }, 'revenant-toll'))
    .toMatchObject({ handled: true, pool: 'toll', cost: 10, affordable: true });
  expect(getRevenantSpellResourcePlan({ resourceCost: { classResource: { type: 'toll', cost: -3 } } }, { toll: 0 }, 'revenant-toll'))
    .toMatchObject({ cost: 0, gain: 3 });
  expect(getRevenantSpellResourcePlan({ resourceCost: { classResource: { type: 'phylactery', cost: -5 } } }, { toll: 0, phylacteryHP: 10 }, 'revenant-toll'))
    .toMatchObject({ pool: 'phylactery', cost: 0, gain: 5 });
});

test('a cost above the finite cap is reported but not rescaled or made affordable', () => {
  const plan = getRevenantSpellResourcePlan({ resourceCost: { classResource: { type: 'toll', cost: 40 } } }, { toll: 20, maxToll: 20 }, 'revenant-toll');
  expect(plan).toMatchObject({ cost: 40, affordable: false, cap: 20 });
});

test('the shared router resolves Revenant toll and phylactery end to end', () => {
  const normalized = normalizeManagedClassResource({ type: 'toll', current: 9, phylacteryHP: 20 }, 'Revenant');
  expect(normalized).toMatchObject({ toll: 9, phylacteryHP: 20 });
  const plan = getManagedSpellResourcePlan({ resourceCost: { classResource: { type: 'toll', cost: 10 } } }, normalized, 'Revenant');
  expect(plan).toMatchObject({ handled: true, id: 'revenant-toll', cost: 10 });
  expect(updateRevenantResource(normalized, 'current', 15)).toMatchObject({ toll: 15 });
});
