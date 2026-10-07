import { normalizeInquisitorResource, getInquisitorAssistanceDecision } from '../inquisitorResourceContract';
import { getManagedSpellResourcePlan } from '../classResourceContracts';
import { initializeClassResource, updateClassResourceMax } from '../classResources';
import { createResourceSlice } from '../../store/characterSlices/resourceSlice';
import useGameStore from '../../store/gameStore';
import { getStore, registerStore } from '../../store/storeRegistry';

const recipient = active => ({ id: 'inq-1', class: 'Inquisitor', classResource: { current: 4, nullAura: { active } } });
const makeStore = initial => {
  let state;
  const get = () => state;
  const set = update => { state = { ...state, ...(typeof update === 'function' ? update(state) : update) }; };
  state = { ...createResourceSlice(set, get), id: 'inq-1', class: 'Inquisitor', classResource: initial, stats: {}, level: 1,
    health: { current: 20, max: 40 }, mana: { current: 10, max: 20 }, updateStat: jest.fn(),
    syncWithMultiplayer: jest.fn(), syncResourcesWithMultiplayer: jest.fn() };
  return { getState: get };
};

test.each([6, 10, 18, 30])('Authority stays eight at Spirit %i', spirit => {
  expect(initializeClassResource('Inquisitor', { spirit })).toMatchObject({ current: 0, max: 8, authority: 0, nullAura: { active: false } });
  expect(updateClassResourceMax({ current: 7, max: 20 }, 'Inquisitor', { spirit })).toMatchObject({ current: 7, max: 8 });
});

test('current takes precedence over stale aliases while preserving metadata and saved objects', () => {
  const saved = { current: 3, authority: 8, righteousAuthority: { current: 8, note: 'Keep' }, worldNote: 'Keep', nullAura: { active: true, note: 'Keep' } };
  expect(normalizeInquisitorResource(saved)).toMatchObject({ current: 3, authority: 3, righteousAuthority: { current: 3, max: 8, note: 'Keep' }, worldNote: 'Keep', nullAura: { active: true, note: 'Keep' } });
  expect(saved.authority).toBe(8);
  expect(normalizeInquisitorResource({ current: 0, authority: 8, nullAura: { active: true } })).toMatchObject({ current: 0, authority: 0, nullAura: { active: false } });
});

test('spending/gaining/alias writes remain synchronized and zero safely releases active nullification', () => {
  const store = makeStore({ current: 3, authority: 3, nullAura: { active: true } });
  store.getState().consumeClassResource(2, 'authority');
  expect(store.getState().classResource).toMatchObject({ current: 1, authority: 1, nullAura: { active: true } });
  store.getState().consumeClassResource(1);
  expect(store.getState().classResource).toMatchObject({ current: 0, authority: 0, nullAura: { active: false } });
  expect(store.getState().setInquisitorNullAura(true)).toBe(false);
  store.getState().gainClassResource(30);
  expect(store.getState().classResource).toMatchObject({ current: 8, authority: 8, nullAura: { active: false } });
  expect(store.getState().setInquisitorNullAura(true)).toBe(true);
  expect(store.getState().updateStat).toHaveBeenCalled();
});

test.each(['healing', 'buff', 'mana_regen', 'enhancement'])('active nullification suppresses known foreign magical %s only', kind => {
  expect(getInquisitorAssistanceDecision(recipient(true), { kind, isMagical: true, effectOrigin: 'foreign', sourceEntityId: 'healer' }).suppressed).toBe(true);
  expect(getInquisitorAssistanceDecision(recipient(false), { kind, isMagical: true, effectOrigin: 'foreign' }).suppressed).toBe(false);
});

test('self effects, nonmagical care and hostile effects retain their own rules', () => {
  const active = recipient(true);
  expect(getInquisitorAssistanceDecision(active, { kind: 'buff', isMagical: true, sourceEntityId: 'inq-1' }).suppressed).toBe(false);
  expect(getInquisitorAssistanceDecision(active, { kind: 'buff', isMagical: true, effectOrigin: 'self' }).suppressed).toBe(false);
  expect(getInquisitorAssistanceDecision(active, { kind: 'healing', isMagical: false, effectOrigin: 'foreign' }).suppressed).toBe(false);
  expect(getInquisitorAssistanceDecision(active, { kind: 'damage', isMagical: true, effectOrigin: 'foreign' }).suppressed).toBe(false);
  expect(getInquisitorAssistanceDecision(active, { kind: 'debuff', isMagical: true, effectOrigin: 'foreign' }).suppressed).toBe(false);
  expect(getInquisitorAssistanceDecision(active, { kind: 'healing', isMagical: true, sourceEntityId: 'inq-1', effectOrigin: 'foreign' }).suppressed).toBe(true);
});

test('unknown provenance is not fabricated and other classes do not inherit global immunity', () => {
  expect(getInquisitorAssistanceDecision(recipient(true), { kind: 'buff', source: 'spell' })).toMatchObject({ suppressed: false, reason: 'unknown-origin' });
  expect(getInquisitorAssistanceDecision({ ...recipient(true), class: 'Martyr' }, { kind: 'buff', isMagical: true, effectOrigin: 'foreign' }).suppressed).toBe(false);
});

test('typed immediate healing is suppressed without HP mutation, then permitted after release', () => {
  const store = makeStore({ current: 4, nullAura: { active: true } });
  const provenance = { sourceEntityId: 'healer', source: 'spell', isMagical: true, effectOrigin: 'foreign' };
  expect(store.getState().receiveAssistance('health', 5, provenance)).toMatchObject({ applied: false, suppressed: true });
  expect(store.getState().health.current).toBe(20);
  expect(store.getState().receiveAssistance('health', 5, { isMagical: false, effectOrigin: 'foreign' }).applied).toBe(true);
  expect(store.getState().health.current).toBe(25);
  store.getState().setInquisitorNullAura(false);
  expect(store.getState().receiveAssistance('health', 5, provenance).applied).toBe(true);
  expect(store.getState().health.current).toBe(30);
});

test('dedicated/nested costs/gains charge once, honor zero/ALL and reject borrowing/foreign/malformed payments', () => {
  const spell = { authorityCost: 3, resourceCost: { resourceValues: { classResource: { type: 'authority', cost: 3 } } } };
  expect(getManagedSpellResourcePlan(spell, { current: 4 }, 'Inquisitor')).toMatchObject({ handled: true, cost: 3, affordable: true });
  expect(getManagedSpellResourcePlan({ ...spell, authorityCost: 0 }, { current: 0 }, 'Inquisitor').cost).toBe(0);
  expect(getManagedSpellResourcePlan({ authorityCost: 'ALL' }, { current: 6 }, 'Inquisitor').cost).toBe(6);
  expect(getManagedSpellResourcePlan({ authorityCost: 'ALL' }, { current: 0 }, 'Inquisitor').affordable).toBe(false);
  expect(getManagedSpellResourcePlan({ authorityCost: 3, authorityGain: 2 }, { current: 2 }, 'Inquisitor').affordable).toBe(false);
  expect(getManagedSpellResourcePlan(spell, { current: 7, type: 'fortunePoints' }, 'Gambit').affordable).toBe(false);
  expect(getManagedSpellResourcePlan({ authorityCost: 'bad' }, { current: 8 }, 'Inquisitor').affordable).toBe(false);
});

test('ordinary rest creates no Authority and long rest releases the aura while preserving metadata', () => {
  const previousGame = useGameStore.getState();
  const previousStores = ['characterStore', 'partyStore', 'conditionStore'].map(key => [key, getStore(key)]);
  const store = makeStore({ current: 4, nullAura: { active: true, note: 'Keep' }, worldNote: 'Keep' });
  registerStore('characterStore', store);
  registerStore('partyStore', { getState: () => ({ partyMembers: [] }) });
  registerStore('conditionStore', { getState: () => ({ clearAllConditions: jest.fn() }) });
  try {
    useGameStore.getState().takeShortRest();
    expect(store.getState().classResource.current).toBe(4);
    useGameStore.getState().takeLongRest();
    expect(store.getState().classResource).toMatchObject({ current: 0, authority: 0, worldNote: 'Keep', nullAura: { active: false, note: 'Keep' } });
  } finally {
    previousStores.forEach(([key, previous]) => registerStore(key, previous));
    useGameStore.setState(previousGame, true);
  }
});
