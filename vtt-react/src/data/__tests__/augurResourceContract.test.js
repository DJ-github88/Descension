import {
  normalizeAugurResource, updateAugurResource, getAugurSpellResourcePlan,
  getAugurCaps, getAugurPoolValue, AUGUR_SPEC_CAPS, AUGUR_OMEN_DEBT_MAX
} from '../augurResourceContract';
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

test('spec caps define each pool ceiling and normalization clamps both pools', () => {
  expect(getAugurCaps({ specialization: 'auspex' })).toEqual(AUGUR_SPEC_CAPS.auspex);
  expect(getAugurCaps({ specialization: 'harbinger' })).toEqual({ benediction: 5, malediction: 15 });
  expect(normalizeAugurResource({ specialization: 'hierophant', benediction: 30, malediction: 30 }))
    .toMatchObject({ maxBenediction: 15, maxMalediction: 5, benediction: 15, malediction: 5, type: 'benediction-malediction' });
  expect(normalizeAugurResource({ benediction: 4, malediction: 6 }).specialization).toBe('auspex');
});

test('omen debt is a negative long-rest ledger capped at ten', () => {
  expect(normalizeAugurResource({ omenDebt: -4 }).omenDebt).toBe(-4);
  expect(normalizeAugurResource({ omenDebt: 3 }).omenDebt).toBe(-3);
  expect(normalizeAugurResource({ omenDebt: -99 }).omenDebt).toBe(-AUGUR_OMEN_DEBT_MAX);
  expect(updateAugurResource({ benediction: 0, malediction: 0 }, 'omenDebt', 2).omenDebt).toBe(-2);
});

test('store spends and gains route to the named pool without touching the other', () => {
  const store = makeStore('Augur', { benediction: 4, malediction: 6, maxBenediction: 10, maxMalediction: 10, specialization: 'auspex' });
  store.getState().consumeClassResource(2, 'benediction');
  expect(store.getState().classResource).toMatchObject({ benediction: 2, malediction: 6 });
  store.getState().gainClassResource(3, 'malediction');
  expect(store.getState().classResource).toMatchObject({ benediction: 2, malediction: 9 });
  store.getState().gainClassResource(5, 'malediction');
  expect(store.getState().classResource).toMatchObject({ malediction: 10, benediction: 2 });
  expect(getAugurPoolValue(store.getState().classResource, 'benediction')).toBe(2);
});

test('spell plans read the correct pool, cost and affordability', () => {
  const ben = getAugurSpellResourcePlan({ resourceCost: { classResource: { type: 'benediction', cost: 2 } } }, { benediction: 2, malediction: 0 }, 'benediction-malediction');
  expect(ben).toMatchObject({ handled: true, pool: 'benediction', cost: 2, affordable: true, label: 'Benediction' });
  const mal = getAugurSpellResourcePlan({ resourceCost: { classResource: { type: 'malediction', cost: 3 } } }, { benediction: 9, malediction: 1 }, 'benediction-malediction');
  expect(mal).toMatchObject({ handled: true, pool: 'malediction', cost: 3, affordable: false });
  expect(getAugurSpellResourcePlan({}, { benediction: 1 }, 'benediction-malediction').handled).toBe(false);
});

test('the shared router resolves Augur pools end to end', () => {
  const normalized = normalizeManagedClassResource({ specialization: 'harbinger', benediction: 9, malediction: 4 }, 'Augur');
  expect(normalized).toMatchObject({ maxBenediction: 5, maxMalediction: 15, benediction: 5 });
  const plan = getManagedSpellResourcePlan({ resourceCost: { classResource: { type: 'benediction', cost: 2 } } }, { benediction: 4, malediction: 0, specialization: 'auspex' }, 'Augur');
  expect(plan).toMatchObject({ handled: true, id: 'benediction-malediction', cost: 2 });
  expect(updateAugurResource({ benediction: 0, malediction: 0 }, 'malediction', 7)).toMatchObject({ malediction: 7 });
});
