import { normalizeShaperResource, getShaperFormAdoptionPlan, SHAPER_FORMS } from '../shaperResourceContract';
import { getManagedSpellResourcePlan } from '../classResourceContracts';
import { initializeClassResource, updateClassResourceMax, CLASS_RESOURCE_TYPES } from '../classResources';
import { SHAPER_DATA } from '../classes/shaperData';
import { createResourceSlice } from '../../store/characterSlices/resourceSlice';
import useGameStore from '../../store/gameStore';
import { getStore, registerStore } from '../../store/storeRegistry';

const makeStore = initial => {
  let state;
  const get = () => state;
  const set = update => { state = { ...state, ...(typeof update === 'function' ? update(state) : update) }; };
  state = { ...createResourceSlice(set, get), class: 'Shaper', classResource: initial, stats: {}, level: 1,
    syncWithMultiplayer: jest.fn(), syncResourcesWithMultiplayer: jest.fn() };
  return { getState: get };
};

test('Shaper initializes 20 Flux and 10 risk Toll; Flourish is an alias rather than ultimate currency', () => {
  expect(initializeClassResource('Shaper', {})).toMatchObject({ current: 0, flux: 0, max: 20, bodyToll: 0, maxBodyToll: 10, bodyTollKind: 'risk' });
  expect(CLASS_RESOURCE_TYPES.Shaper.mechanics.flourish).toMatchObject({ max: 10, kind: 'risk', spendable: false, gainVerb: 'accumulate' });
  expect(CLASS_RESOURCE_TYPES.Shaper.mechanics.flourish).not.toHaveProperty('consumption.ultimates');
});

test('normalization does not resurrect spent current through stale Flux aliases and preserves nested metadata', () => {
  const saved = { type: 'kineticFluxBodyToll', current: 3, flux: 9, momentum: { current: 9, max: 30, note: 'Keep' },
    flourish: { current: 4, max: 20, note: 'Keep' }, stance: { current: 'arterial_strike', note: 'Keep' }, worldNote: 'Keep' };
  expect(updateClassResourceMax(saved, 'Shaper', {})).toMatchObject({ current: 3, flux: 3, max: 20,
    momentum: { current: 3, max: 20, note: 'Keep' }, bodyToll: 4, toll: 4,
    flourish: { current: 4, max: 10, note: 'Keep' }, stance: { current: 'Arterial Strike', note: 'Keep' }, worldNote: 'Keep' });
  expect(saved.flux).toBe(9);
  expect(normalizeShaperResource({ flux: 22, bodyToll: 0, toll: 9, flourish: 9 })).toMatchObject({ current: 20, bodyToll: 0, toll: 0, flourish: 0 });
});

test('every legacy field write mirrors the same pool and keeps Flux and risk independent', () => {
  const store = makeStore({ current: 9, bodyToll: 3, momentum: { current: 9 }, flourish: { current: 3 } });
  store.getState().consumeClassResource(4, 'flux');
  expect(store.getState().classResource).toMatchObject({ current: 5, flux: 5, momentum: { current: 5 }, bodyToll: 3 });
  store.getState().gainClassResource(20, 'body_toll');
  expect(store.getState().classResource).toMatchObject({ current: 5, bodyToll: 10, toll: 10, flourish: { current: 10 }, controlHandoffDue: true });
  store.getState().updateClassResource('flourish', 2, true, true);
  expect(store.getState().classResource).toMatchObject({ current: 5, bodyToll: 2, toll: 2, flourish: { current: 2 }, controlHandoffDue: false });
  store.getState().updateClassResource('momentum', 14, true, true);
  expect(store.getState().classResource).toMatchObject({ current: 14, flux: 14, momentum: { current: 14 }, bodyToll: 2 });
});

test('a source Body Toll cost adds strain from zero without charging Flux', () => {
  const spell = SHAPER_DATA.spells.find(entry => entry.id === 'shaper_flesh_mask');
  const plan = getManagedSpellResourcePlan(spell, { current: 5, bodyToll: 0 }, 'Shaper');
  expect(plan).toMatchObject({ affordable: true, cost: 0, addedToll: 2 });
  expect(plan.nextResource).toMatchObject({ current: 5, bodyToll: 2, toll: 2 });
});

test('duplicate Flux generation encodings apply once; payment cannot borrow its own generated Flux', () => {
  const spell = SHAPER_DATA.spells.find(entry => entry.id === 'shaper_frantic_laceration');
  expect(getManagedSpellResourcePlan(spell, { current: 4, bodyToll: 3 }, 'Shaper').nextResource).toMatchObject({ current: 6, bodyToll: 3 });
  expect(getManagedSpellResourcePlan({ fluxCost: 4, fluxGain: 4 }, { current: 3 }, 'Shaper').affordable).toBe(false);
});

test('source signature and mutation costs accumulate Toll rather than spending it as a reward', () => {
  const spell = SHAPER_DATA.spells.find(entry => entry.id === 'shaper_chimeric_burst');
  const plan = getManagedSpellResourcePlan(spell, { current: 10, bodyToll: 9 }, 'Shaper');
  expect(plan.nextResource).toMatchObject({ current: 6, bodyToll: 10, bodyTollKind: 'risk', controlHandoffDue: true });
  expect(plan.addedToll).toBe(2);
});

test.each(SHAPER_FORMS)('bar and authored $name spell use the same adoption cost and Toll tax', form => {
  const spell = SHAPER_DATA.spells.find(entry => entry.id === `shaper_stance_${form.id}`);
  const initial = { current: 10, bodyToll: 1, stance: form.name === 'Ataxic Flow' ? 'Arterial Strike' : 'Ataxic Flow' };
  const barPlan = getShaperFormAdoptionPlan(initial, form.name);
  const spellPlan = getManagedSpellResourcePlan(spell, initial, 'Shaper');
  expect(spell.resourceCost.classResource.cost).toBe(form.fluxCost);
  expect(barPlan).toMatchObject({ affordable: true, cost: form.fluxCost, addedToll: form.tollCost });
  expect(spellPlan.nextResource).toMatchObject({ current: 10 - form.fluxCost, bodyToll: 1 + form.tollCost, stance: form.name });
  expect(barPlan.nextResource).toEqual(spellPlan.nextResource);
});

test('wrong forms and inadequate Flux reject before transitions; already active adoption is a no-op', () => {
  const spell = SHAPER_DATA.spells.find(entry => entry.id === 'shaper_arterial_puncture');
  expect(getManagedSpellResourcePlan(spell, { current: 10, stance: 'Ataxic Flow' }, 'Shaper')).toMatchObject({ affordable: false, reason: 'Requires Arterial Strike' });
  expect(getManagedSpellResourcePlan(spell, { current: 4, stance: 'arterial_strike' }, 'Shaper').affordable).toBe(true);
  expect(getShaperFormAdoptionPlan({ current: 0, stance: 'Ataxic Flow' }, 'Arterial Strike').affordable).toBe(false);
  expect(getShaperFormAdoptionPlan({ current: 10, stance: 'Ataxic Flow' }, 'Ataxic Flow').affordable).toBe(false);
});

test('uppercase ALL expends the source ultimate once and rejects an empty bank', () => {
  const spell = SHAPER_DATA.spells.find(entry => entry.id === 'shaper_thousand_forms');
  expect(getManagedSpellResourcePlan(spell, { current: 12, bodyToll: 2 }, 'Shaper').nextResource).toMatchObject({ current: 0, bodyToll: 3 });
  expect(getManagedSpellResourcePlan(spell, { current: 0 }, 'Shaper').affordable).toBe(false);
});

test('explicit zero and typed recovery are honored without executing narrative on-hit benefits', () => {
  expect(getManagedSpellResourcePlan({ fluxCost: 0, bodyTollCost: 0, resourceCost: { classResource: { type: 'body_toll', cost: 2 } } }, { current: 5 }, 'Shaper').nextResource.bodyToll).toBe(0);
  expect(getManagedSpellResourcePlan({ fluxCost: 2, bodyTollReduction: 3 }, { current: 5, bodyToll: 2 }, 'Shaper').nextResource).toMatchObject({ current: 3, bodyToll: 0 });
  const onHit = SHAPER_DATA.spells.find(entry => entry.id === 'shaper_arterial_siphon');
  expect(getManagedSpellResourcePlan(onHit, { current: 10, bodyToll: 5, stance: 'Arterial Strike' }, 'Shaper').nextResource.bodyToll).toBe(5);
});

test('malformed costs/strain and foreign owners cannot become free transitions', () => {
  expect(getManagedSpellResourcePlan({ fluxCost: 'bad' }, { current: 20 }, 'Shaper').affordable).toBe(false);
  expect(getManagedSpellResourcePlan({ bodyTollCost: 0.5 }, { current: 20 }, 'Shaper').affordable).toBe(false);
  expect(getManagedSpellResourcePlan({ resourceCost: { classResource: { type: 'flux', cost: 2 } } }, { current: 7, type: 'fortunePoints' }, 'Gambit').affordable).toBe(false);
});

test('the real rest paths recover three Toll on short rest and reset both pools on long rest', () => {
  const previousGame = useGameStore.getState();
  const previousStores = ['characterStore', 'partyStore', 'conditionStore'].map(key => [key, getStore(key)]);
  const store = makeStore({ flux: 4, flourish: { current: 8, note: 'Keep' }, stance: { current: 'Fluid Apex', note: 'Keep' }, worldNote: 'Keep' });
  registerStore('characterStore', store);
  registerStore('partyStore', { getState: () => ({ partyMembers: [] }) });
  registerStore('conditionStore', { getState: () => ({ clearAllConditions: jest.fn() }) });
  try {
    useGameStore.getState().takeShortRest();
    expect(store.getState().classResource).toMatchObject({ current: 9, bodyToll: 5, flourish: { current: 5, note: 'Keep' } });
    useGameStore.getState().takeLongRest();
    expect(store.getState().classResource).toMatchObject({ current: 0, flux: 0, bodyToll: 0, toll: 0,
      flourish: { current: 0, note: 'Keep' }, stance: { current: 'Ataxic Flow', note: 'Keep' }, worldNote: 'Keep' });
  } finally {
    previousStores.forEach(([key, previous]) => registerStore(key, previous));
    useGameStore.setState(previousGame, true);
  }
});
