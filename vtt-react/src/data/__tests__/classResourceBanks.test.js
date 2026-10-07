import { getManagedSpellResourcePlan, normalizeManagedClassResource, changeManagedClassResource } from '../classResourceContracts';
import { initializeClassResource, updateClassResourceMax } from '../classResources';
import { createResourceSlice } from '../../store/characterSlices/resourceSlice';
import { MINSTREL_DATA } from '../classes/minstrelData';
import { formulationToSpell } from '../classes/arcanoneer/formulationToSpell';
import { cadenceToSpell } from '../classes/minstrel/cadenceToSpell';
import { ARCANONEER_ELEMENTS, extractSphereRequirementsAndGains } from '../classResourceBanks';

const makeStore = (className, resource) => {
  let state;
  const get = () => state;
  const set = update => { state = { ...state, ...(typeof update === 'function' ? update(state) : update) }; };
  state = { ...createResourceSlice(set, get), class: className, classResource: resource,
    syncWithMultiplayer: jest.fn(), syncResourcesWithMultiplayer: jest.fn() };
  return { getState: get };
};

test('initialization and max refresh use 12 spheres or seven five-note banks, not seven total notes', () => {
  expect(initializeClassResource('Arcanoneer', {})).toMatchObject({ current: 0, max: 12, rollsPerTurn: 4, spheres: [] });
  expect(initializeClassResource('Minstrel', {})).toMatchObject({ current: 0, max: 35, maxPerNote: 5, notes: [0, 0, 0, 0, 0, 0, 0] });
  expect(updateClassResourceMax({ type: 'musicalNotes', notes: [5, 5, 5, 5, 5, 5, 5], max: 7 }, 'Minstrel', {}))
    .toMatchObject({ current: 35, max: 35 });
});

test('normalization clamps banks, derives live totals, preserves metadata and leaves the saved object intact', () => {
  const saved = { type: 'elementalSpheres', spheres: ['fire', 'frost', 'healing', 'homebrew', ...Array(12).fill('chaos')], current: 99, max: 15, note: 'Keep' };
  const normalized = normalizeManagedClassResource(saved, 'Arcanoneer');
  expect(normalized).toMatchObject({ current: 12, max: 12, note: 'Keep', unrecognizedSpheres: ['homebrew'] });
  expect(normalized.spheres.slice(0, 3)).toEqual(['ember', 'rime', 'storm']);
  expect(saved.spheres[0]).toBe('fire');
  expect(normalizeManagedClassResource({ type: 'musicalNotes', notes: [9, -2, 1.5], note: 'Keep' }, 'Minstrel'))
    .toMatchObject({ current: 6, max: 35, notes: [5, 0, 1, 0, 0, 0, 0], note: 'Keep' });
  expect(normalizeManagedClassResource({ notes: ['I', 'I', 'V'] }, 'Minstrel').notes).toEqual([2, 0, 0, 0, 1, 0, 0]);
});

test('store array writes and typed gains/spends keep current in sync and cannot create phantom aggregate notes', () => {
  const store = makeStore('Minstrel', { type: 'musicalNotes', notes: [4, 0, 0, 0, 0, 0, 0], current: 999, max: 7 });
  store.getState().gainClassResource(2, 'note_i');
  expect(store.getState().classResource).toMatchObject({ current: 5, notes: [5, 0, 0, 0, 0, 0, 0], max: 35 });
  store.getState().consumeClassResource(2, 'I');
  expect(store.getState().classResource.current).toBe(3);
  store.getState().gainClassResource(10);
  expect(store.getState().classResource.current).toBe(3);
  store.getState().updateClassResource('notes', [5, 5, 5, 5, 5, 5, 5], true, true);
  expect(store.getState().classResource.current).toBe(35);
  const spheres = makeStore('Arcanoneer', { type: 'elementalSpheres', spheres: ['ember'], current: 0 });
  spheres.getState().updateClassResource('spheres', Array(15).fill('ice'), true, true);
  expect(spheres.getState().classResource).toMatchObject({ current: 12, max: 12 });
  spheres.getState().consumeClassResource(2, 'rime');
  expect(spheres.getState().classResource.current).toBe(10);
});

test('Opening Chord uses its authored I2/V1 recipe, caps per pitch and does not add the generic summary twice', () => {
  const spell = MINSTREL_DATA.spells.find(entry => entry.id === 'minstrel_opening_chord');
  const plan = getManagedSpellResourcePlan(spell, { type: 'musicalNotes', notes: [4, 0, 0, 0, 4, 0, 0] }, 'Minstrel');
  expect(plan).toMatchObject({ bank: 'notes', affordable: true, gains: ['I', 'I', 'V'] });
  expect(plan.nextResource).toMatchObject({ notes: [5, 0, 0, 0, 5, 0, 0], current: 10, max: 35 });
});

test('learned resolver pitch requirements override an inaccurate generic total and reject wrong-pitch banks', () => {
  const spell = MINSTREL_DATA.spells.find(entry => entry.musicalCombo?.requires);
  const required = spell.musicalCombo.requires;
  const notes = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'].map(key => required.filter(entry => entry.note === key).reduce((sum, entry) => sum + entry.count, 0));
  const plan = getManagedSpellResourcePlan(spell, { type: 'musicalNotes', notes }, 'Minstrel');
  expect(plan.affordable).toBe(true);
  expect(plan.costs).toHaveLength(notes.reduce((sum, value) => sum + value, 0));
  expect(plan.nextResource.current).toBe(0);
  expect(getManagedSpellResourcePlan(spell, { type: 'musicalNotes', notes: [0, 5, 0, 0, 0, 0, 0] }, 'Minstrel').affordable).toBe(false);
});

test('cadence adapter encodings pay the four-note recipe once', () => {
  const spell = cadenceToSpell({ id: 'perfect', notes: { I: 2, IV: 1, V: 1 } });
  const plan = getManagedSpellResourcePlan(spell, { type: 'musicalNotes', notes: [2, 0, 0, 1, 1, 0, 0] }, 'Minstrel');
  expect(plan).toMatchObject({ affordable: true, costs: ['I', 'I', 'IV', 'V'] });
  expect(plan.nextResource.current).toBe(0);
});

test('formulation and flattened recipe duplicates consume two spheres once, including old aliases', () => {
  const spell = { ...formulationToSpell({ id: 'steam', elements: ['ember', 'rime'] }), elements: ['ember', 'rime'],
    sphereCost: ['ember', 'rime'], resourceCost: { spheres: ['ember', 'rime'], resourceValues: { ember_sphere: 1, rime_sphere: 1 } } };
  const resource = { type: 'elementalSpheres', spheres: ['fire', 'ice', 'wyrd'] };
  const plan = getManagedSpellResourcePlan(spell, resource, 'Arcanoneer');
  expect(plan).toMatchObject({ affordable: true, costs: ['ember', 'rime'] });
  expect(plan.nextResource).toMatchObject({ current: 1, spheres: ['wyrd'] });
  expect(extractSphereRequirementsAndGains(spell).costs).toHaveLength(2);
});

test('pure pairs require two of the same category and new gains cannot finance the current cast', () => {
  const spell = { sphereCost: ['ember', 'ember'], sphereGain: ['ember'] };
  expect(getManagedSpellResourcePlan(spell, { type: 'elementalSpheres', spheres: ['ember'] }, 'Arcanoneer').affordable).toBe(false);
  expect(getManagedSpellResourcePlan(spell, { type: 'elementalSpheres', spheres: ['ember', 'ember'] }, 'Arcanoneer').nextResource.spheres).toEqual(['ember']);
});

test.each(ARCANONEER_ELEMENTS)('typed %s gains stay within the shared twelve-sphere bank', element => {
  const resource = { type: 'elementalSpheres', spheres: Array(11).fill('arcane') };
  expect(getManagedSpellResourcePlan({ sphereGain: [element, element] }, resource, 'Arcanoneer').nextResource.current).toBe(12);
});

test('foreign banks and malformed or untyped generation cannot be treated as affordable free casts', () => {
  const resource = { type: 'musicalNotes', notes: [5, 5, 5, 5, 5, 5, 5] };
  expect(getManagedSpellResourcePlan({ sphereCost: ['arcane'] }, resource, 'Minstrel').affordable).toBe(false);
  expect(getManagedSpellResourcePlan({ _cadenceNotes: { VIII: 1 } }, resource, 'Minstrel').affordable).toBe(false);
  expect(getManagedSpellResourcePlan({ _cadenceNotes: { I: 0.5 } }, resource, 'Minstrel').affordable).toBe(false);
  expect(getManagedSpellResourcePlan({ resourceCost: { classResource: { type: 'musical_notes', gain: 3 } } }, resource, 'Minstrel').affordable).toBe(false);
  expect(changeManagedClassResource(resource, 'Minstrel', -6, 'I').current).toBe(35);
});
