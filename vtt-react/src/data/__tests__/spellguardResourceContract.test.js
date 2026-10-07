import { normalizeSpellguardResource, recordSpellguardIntake } from '../spellguardResourceContract';
import { getManagedSpellResourcePlan } from '../classResourceContracts';
import { initializeClassResource, updateClassResourceMax } from '../classResources';
import { createResourceSlice } from '../../store/characterSlices/resourceSlice';
import { SPELLGUARD_DATA } from '../classes/spellguardData';
import useGameStore from '../../store/gameStore';
import { getStore, registerStore } from '../../store/storeRegistry';

const makeStore = initial => {
  let state;
  const get = () => state;
  const set = update => { state = { ...state, ...(typeof update === 'function' ? update(state) : update) }; };
  state = { ...createResourceSlice(set, get), class: 'Spellguard', classResource: initial, stats: {}, level: 1,
    syncWithMultiplayer: jest.fn(), syncResourcesWithMultiplayer: jest.fn() };
  return { getState: get };
};

test.each([6, 10, 18, 30])('Spellguard initialization/refresh keep 100 AEP at Intelligence %i', intelligence => {
  expect(initializeClassResource('Spellguard', { intelligence })).toMatchObject({ current: 0, max: 100 });
  expect(updateClassResourceMax({ current: 70, max: 9 }, 'Spellguard', { intelligence })).toMatchObject({ current: 70, max: 100 });
});

test('legacy aliases normalize without source mutation and current wins over stale aliases', () => {
  const saved = { type: 'arcaneEnergyPoints', current: 25, aep: 80, resonance: { current: 80, note: 'Keep' }, worldNote: 'Keep' };
  expect(normalizeSpellguardResource(saved)).toMatchObject({ current: 25, aep: 25, resonance: { current: 25, max: 100, note: 'Keep' }, worldNote: 'Keep' });
  expect(saved.aep).toBe(80);
  expect(normalizeSpellguardResource({ aep: 130 }).current).toBe(100);
  expect(normalizeSpellguardResource({ current: 0, aep: 50 }).current).toBe(0);
});

test('writes/spends/grants mirror all existing AEP aliases and cannot alter other class pools', () => {
  const store = makeStore({ current: 60, aep: 60, resonance: 60, arcaneEnergyPoints: 60 });
  store.getState().consumeClassResource(25, 'aep');
  expect(store.getState().classResource).toMatchObject({ current: 35, aep: 35, resonance: 35, arcaneEnergyPoints: 35 });
  store.getState().updateClassResource('resonance', 75, true, true);
  store.getState().gainClassResource(40, 'aep');
  expect(store.getState().classResource).toMatchObject({ current: 100, max: 100, aep: 100, resonance: 100, containmentBreachDue: true });
  store.getState().consumeClassResource(101);
  expect(store.getState().classResource.current).toBe(100);
});

test.each([
  ['containment', 20, 0, 0], ['annulment', 2, 0, 18], ['defusal', 3, 0, 17],
  ['deflection', 1, 19, 0], ['siphon', 5, 0, 15]
])('%s retains finite residual in the same bank and accounts for the remainder', (mode, captured, redirected, dissipated) => {
  const result = recordSpellguardIntake({ current: 10 }, { id: mode, mode, incoming: 20, captured, redirected, dissipated });
  expect(result).toMatchObject({ accepted: true, banked: captured, overflow: 0 });
  expect(result.resource.current).toBe(10 + captured);
  const totals = result.resource.spellguardIntake.totals;
  expect(totals.incoming).toBe(totals.captured + totals.redirected + totals.dissipated);
  expect(totals.captured).toBe(totals.banked + totals.overflow);
});

test('zero-residual annulment/deflection, unaccounted energy and malformed quantities reject', () => {
  expect(recordSpellguardIntake({ current: 0 }, { id: 'zero', mode: 'deflection', incoming: 20, captured: 0, redirected: 20 }).accepted).toBe(false);
  expect(recordSpellguardIntake({ current: 0 }, { id: 'lost', mode: 'annulment', incoming: 20, captured: 2, dissipated: 10 }).reason).toBe('unaccounted-energy');
  expect(recordSpellguardIntake({ current: 0 }, { id: 'bad', mode: 'containment', incoming: 2.5, captured: 2.5 }).accepted).toBe(false);
  expect(recordSpellguardIntake({ current: 0 }, { id: 'unsafe', mode: 'containment', incoming: 1e20, captured: 1e20 }).accepted).toBe(false);
});

test('a full bank records overflow rather than creating reserve or silently losing energy', () => {
  const result = recordSpellguardIntake({ current: 95 }, { id: 'overload', mode: 'containment', incoming: 20, captured: 20 });
  expect(result).toMatchObject({ accepted: true, banked: 5, overflow: 15, resource: { current: 100, containmentBreachDue: true } });
  expect(result.resource.spellguardIntake.totals).toMatchObject({ incoming: 20, captured: 20, banked: 5, overflow: 15 });
  const store = makeStore(result.resource);
  store.getState().consumeClassResource(40);
  expect(store.getState().classResource.current).toBe(60);
  expect(store.getState().classResource.spellguardIntake.totals.overflow).toBe(15);
});

test('receipt IDs remain idempotent after venting, reset, serialization and reload', () => {
  const store = makeStore({ current: 0, worldNote: 'Keep' });
  const receipt = { id: 'spell-1', mode: 'annulment', incoming: 20, captured: 4, dissipated: 16 };
  expect(store.getState().recordSpellguardInterception(receipt).accepted).toBe(true);
  store.getState().resetClassResource();
  const reloaded = makeStore(JSON.parse(JSON.stringify(store.getState().classResource)));
  expect(reloaded.getState().recordSpellguardInterception(receipt).reason).toBe('duplicate-receipt');
  expect(reloaded.getState().classResource).toMatchObject({ current: 0, worldNote: 'Keep', spellguardIntake: { totals: { captured: 4 } } });
});

test('normalization deduplicates receipt history and retains unrecognized records as metadata', () => {
  const accepted = recordSpellguardIntake({ current: 0 }, { id: 'spell-1', mode: 'deflection', incoming: 10, captured: 1, redirected: 9 }).receipt;
  const normalized = normalizeSpellguardResource({ current: 1, spellguardIntake: { receipts: [accepted, accepted, { id: 'custom', mode: 'custom' }], note: 'Keep' } });
  expect(normalized.spellguardIntake).toMatchObject({ note: 'Keep', totals: { captured: 1 }, unrecognizedReceipts: [{ id: 'custom', mode: 'custom' }] });
  expect(normalized.spellguardIntake.receipts).toHaveLength(1);
});

test('authored costs/fixed conversions work once through all aliases and nested summaries', () => {
  const source = SPELLGUARD_DATA.spells.find(spell => spell.resourceCost?.classResource?.cost === -15);
  expect(getManagedSpellResourcePlan(source, { current: 10 }, 'Spellguard')).toMatchObject({ handled: true, cost: 0, gain: 15, affordable: true });
  const spell = { aepGain: 15, resourceCost: { resourceValues: { aep_gain: 15, classResource: { type: 'aep', gain: 15 } } } };
  expect(getManagedSpellResourcePlan(spell, { current: 10 }, 'Spellguard').gain).toBe(15);
  expect(getManagedSpellResourcePlan({ ...spell, aepGain: 0 }, { current: 10 }, 'Spellguard').gain).toBe(0);
});

test('spending validates owned whole AEP before grants and supports ALL without a phantom second pool', () => {
  const spell = { aepCost: 50, aepGain: 10 };
  expect(getManagedSpellResourcePlan(spell, { current: 40 }, 'Spellguard').affordable).toBe(false);
  expect(getManagedSpellResourcePlan(spell, { current: 50 }, 'Spellguard').affordable).toBe(true);
  expect(getManagedSpellResourcePlan({ aepCost: 'ALL' }, { current: 73 }, 'Spellguard').cost).toBe(73);
  expect(getManagedSpellResourcePlan({ aepCost: 'ALL' }, { current: 0 }, 'Spellguard').affordable).toBe(false);
  expect(getManagedSpellResourcePlan({ aepCost: 'bad' }, { current: 100 }, 'Spellguard').affordable).toBe(false);
  expect(getManagedSpellResourcePlan({ aepGain: 1.5 }, { current: 0 }, 'Spellguard').affordable).toBe(false);
  expect(getManagedSpellResourcePlan({ resourceCost: { classResource: { type: 'aep', cost: 5 } } }, { current: 7, type: 'fortunePoints' }, 'Gambit').affordable).toBe(false);
  expect(normalizeSpellguardResource({ current: 10 })).not.toHaveProperty('silenceResonance');
});

test('real short rest cannot create AEP; long rest grounds the bank while retaining receipts', () => {
  const previousGame = useGameStore.getState();
  const previousStores = ['characterStore', 'partyStore', 'conditionStore'].map(key => [key, getStore(key)]);
  const intake = recordSpellguardIntake({ current: 0 }, { id: 'spell-1', mode: 'containment', incoming: 20, captured: 20 });
  const store = makeStore(intake.resource);
  registerStore('characterStore', store);
  registerStore('partyStore', { getState: () => ({ partyMembers: [] }) });
  registerStore('conditionStore', { getState: () => ({ clearAllConditions: jest.fn() }) });
  try {
    useGameStore.getState().takeShortRest();
    expect(store.getState().classResource.current).toBe(20);
    useGameStore.getState().takeLongRest();
    expect(store.getState().classResource).toMatchObject({ current: 0, aep: 0, spellguardIntake: { totals: { captured: 20 } } });
  } finally {
    previousStores.forEach(([key, previous]) => registerStore(key, previous));
    useGameStore.setState(previousGame, true);
  }
});
