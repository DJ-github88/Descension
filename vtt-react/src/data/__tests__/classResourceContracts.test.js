import {
  normalizeManagedClassResource, updateManagedClassResource, getManagedSpellResourcePlan,
  getMartyrLevelForDamage, MARTYR_DAMAGE_THRESHOLDS
} from '../classResourceContracts';
import { initializeClassResource, updateClassResourceMax } from '../classResources';
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

test.each([5, 10, 20, 40])('Gambit initialization and refresh keep 7/13 caps at Charisma %s', charisma => {
  const resource = initializeClassResource('Gambit', { charisma, level: 20 });
  expect(resource).toMatchObject({ type: 'fortunePoints', max: 7, debt: 0, risk: 0, maxDebt: 13 });
  expect(updateClassResourceMax({ ...resource, max: 21, current: 19, debt: 8, note: 'Keep' }, 'Gambit', { charisma }))
    .toMatchObject({ current: 7, max: 7, debt: 8, risk: 8, note: 'Keep' });
});

test('Gambit legacy aliases normalize without mutation and every Debt write mirrors risk', () => {
  const saved = { type: 'fortunePoints', fortunePoints: 5, risk: 4, max: 21, custom: 'Keep' };
  const normalized = normalizeManagedClassResource(saved, 'Gambit');
  expect(normalized).toMatchObject({ current: 5, fortunePoints: 5, max: 7, debt: 4, risk: 4, custom: 'Keep' });
  expect(saved).not.toHaveProperty('debt');
  expect(updateManagedClassResource(normalized, 'Gambit', 'debt', 20)).toMatchObject({ current: 5, debt: 13, risk: 13 });
  expect(updateManagedClassResource(normalized, 'Gambit', 'risk', 2)).toMatchObject({ current: 5, debt: 2, risk: 2 });
});

test('store spending/gaining Karmic Debt affects its own pool and caps, not Fortune', () => {
  const store = makeStore('Gambit', { type: 'fortunePoints', current: 6, max: 21, risk: 5 });
  store.getState().consumeClassResource(2, 'karmic_debt');
  expect(store.getState().classResource).toMatchObject({ current: 6, max: 7, debt: 3, risk: 3 });
  store.getState().gainClassResource(30, 'karmicDebt');
  expect(store.getState().classResource).toMatchObject({ current: 6, debt: 13, risk: 13 });
  store.getState().gainClassResource(5);
  expect(store.getState().classResource.current).toBe(7);
});

test('Martyr initialization keeps six level units and a separate damage ledger', () => {
  expect(initializeClassResource('Martyr', { constitution: 30 })).toMatchObject({ type: 'devotionGauge', current: 0, max: 6, damage: 0 });
  MARTYR_DAMAGE_THRESHOLDS.forEach((damage, tier) => expect(getMartyrLevelForDamage(damage)).toBe(tier));
  expect(getMartyrLevelForDamage(39)).toBe(2);
});

test('Model A spending preserves cumulative damage and only a new threshold restores an earned tier', () => {
  const store = makeStore('Martyr', { type: 'devotionGauge', current: 3, max: 6, damage: 45, note: 'Keep' });
  store.getState().consumeClassResource(1);
  expect(store.getState().classResource).toMatchObject({ current: 2, damage: 45, spentLevels: 1, note: 'Keep' });
  store.getState().updateClassResource('damage', 46, true, true);
  expect(store.getState().classResource).toMatchObject({ current: 2, damage: 46 });
  store.getState().updateClassResource('damage', 60, true, true);
  expect(store.getState().classResource).toMatchObject({ current: 3, damage: 60, spentLevels: 1 });
  store.getState().gainClassResource(1);
  expect(store.getState().classResource).toMatchObject({ current: 4, damage: 60, spentLevels: 0 });
  store.getState().consumeClassResource(5);
  expect(store.getState().classResource.current).toBe(4);
});

test('damage writes cross threshold bands while level writes use the same tier-control semantics', () => {
  const store = makeStore('Martyr', { type: 'devotionGauge', current: 2, damage: 25, max: 6 });
  store.getState().updateClassResource('damage', 60, true, true);
  expect(store.getState().classResource).toMatchObject({ current: 4, damage: 60 });
  store.getState().updateClassResource('current', 1, true, true);
  expect(store.getState().classResource).toMatchObject({ current: 1, damage: 10 });
});

test('confirmed raw legacy gauges convert, but saved spent levels do not get resurrected', () => {
  expect(normalizeManagedClassResource({ type: 'devotionGauge', current: 40, max: 100 })).toMatchObject({ current: 3, damage: 40, max: 6 });
  expect(normalizeManagedClassResource({ type: 'devotionGauge', current: 2, damage: 40, max: 6 })).toMatchObject({ current: 2, damage: 40, spentLevels: 1 });
  expect(normalizeManagedClassResource({ type: 'devotionGauge', level: 4, devotionDamage: 65 })).toMatchObject({ current: 4, level: 4, damage: 65, devotionDamage: 65 });
});

test('level gains at the cap do not erase banked damage overflow', () => {
  const store = makeStore('Martyr', { type: 'devotionGauge', current: 6, damage: 145, max: 6 });
  store.getState().gainClassResource(1);
  expect(store.getState().classResource).toMatchObject({ current: 6, damage: 145 });
});

test('the source worked example keeps 62 damage after spending two levels and earns one at 80', () => {
  const store = makeStore('Martyr', { type: 'devotionGauge', current: 4, damage: 62, max: 6 });
  store.getState().consumeClassResource(2);
  expect(store.getState().classResource).toMatchObject({ current: 2, damage: 62, spentLevels: 2 });
  store.getState().updateClassResource('damage', 73, true, true);
  expect(store.getState().classResource.current).toBe(2);
  store.getState().updateClassResource('damage', 84, true, true);
  expect(store.getState().classResource).toMatchObject({ current: 3, damage: 84, spentLevels: 2 });
});

test('explicit level gains do not invent damage and gains at the cap cannot bank hidden levels', () => {
  const store = makeStore('Martyr', { type: 'devotionGauge', current: 0, damage: 0, max: 6 });
  store.getState().gainClassResource(2);
  expect(store.getState().classResource).toMatchObject({ current: 2, damage: 0, bonusLevels: 2 });
  store.getState().updateClassResource('damage', 100, true, true);
  expect(store.getState().classResource).toMatchObject({ current: 6, damage: 100, bonusLevels: 0 });
  store.getState().consumeClassResource(1);
  expect(store.getState().classResource.current).toBe(5);
});

test('duplicate dedicated/generic Devotion encodings charge once, and explicit zero survives', () => {
  const resource = { type: 'devotionGauge', current: 3, damage: 45, max: 6 };
  const spell = { devotionCost: 1, devotionRequired: 2, resourceCost: { classResource: { type: 'devotion', cost: 1 } } };
  const plan = getManagedSpellResourcePlan(spell, resource, 'Martyr');
  expect(plan).toMatchObject({ handled: true, cost: 1, required: 2, affordable: true });
  expect(getManagedSpellResourcePlan({ ...spell, devotionCost: 0 }, resource, 'Martyr').cost).toBe(0);
  expect(getManagedSpellResourcePlan({ ...spell, devotionCost: 4 }, resource, 'Martyr').affordable).toBe(false);
  expect(getManagedSpellResourcePlan(spell, { current: 7, type: 'fortunePoints' }, 'Gambit').affordable).toBe(false);
});

test('managed spell plans recognize nested fixed gains and Debt costs against Debt availability', () => {
  const resource = { type: 'fortunePoints', current: 0, risk: 5, max: 7 };
  expect(getManagedSpellResourcePlan({ resourceCost: { classResource: { type: 'karmic_debt', cost: 3 } } }, resource, 'Gambit'))
    .toMatchObject({ current: 5, cost: 3, resourceKey: 'karmic_debt', affordable: true });
  expect(getManagedSpellResourcePlan({ resourceCost: { resourceValues: { classResource: { type: 'fortune', gain: 1 } } } }, resource, 'Gambit'))
    .toMatchObject({ cost: 0, gain: 1, affordable: true });
});

test('all-in costs consume the current bank and malformed costs cannot become free casts', () => {
  const spell = { resourceCost: { resourceValues: { classResource: { type: 'fortune', cost: 'all' } } } };
  expect(getManagedSpellResourcePlan(spell, { type: 'fortunePoints', current: 5 }, 'Gambit')).toMatchObject({ handled: true, cost: 5, affordable: true });
  expect(getManagedSpellResourcePlan(spell, { type: 'fortunePoints', current: 0 }, 'Gambit').affordable).toBe(false);
  expect(getManagedSpellResourcePlan({ resourceCost: { classResource: { type: 'fortune', cost: 'bad' } } }, { type: 'fortunePoints', current: 5 }, 'Gambit').affordable).toBe(false);
  const martyr = { type: 'devotionGauge', current: 3, damage: 45, max: 6 };
  expect(getManagedSpellResourcePlan({ devotionCost: 'all' }, martyr, 'Martyr')).toMatchObject({ handled: true, cost: 3, affordable: true });
  expect(getManagedSpellResourcePlan({ devotionCost: 'bad' }, martyr, 'Martyr')).toMatchObject({ handled: true, affordable: false });
  expect(getManagedSpellResourcePlan({ devotionCost: 0 }, martyr, 'Martyr')).toMatchObject({ handled: true, cost: 0, affordable: true });
});

test('unregistered class resources keep their existing state and behavior', () => {
  const other = { type: 'unregisteredGauge', current: 35, max: 100, custom: true };
  expect(normalizeManagedClassResource(other, 'Homebrew')).toBe(other);
  expect(getManagedSpellResourcePlan({ resourceCost: { classResource: { type: 'unregistered_gauge', cost: 5 } } }, other, 'Homebrew').handled).toBe(false);
});
