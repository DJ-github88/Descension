import { APEX_PACK_EVENTS, applyApexPackEvent, beginApexOwnTurn, getApexCompanionStatus, normalizeApexResource } from '../apexResourceContract';
import { getManagedSpellResourcePlan } from '../classResourceContracts';
import { initializeClassResource, updateClassResourceMax } from '../classResources';
import { APEX_DATA } from '../classes/apexData';
import { createResourceSlice } from '../../store/characterSlices/resourceSlice';
import { getStore, registerStore } from '../../store/storeRegistry';

const resource = overrides => normalizeApexResource({ current: 0, companionAvailable: true, ...overrides });
const receipt = (id, kind = 'companion_hit', turn = 1) => ({ id, kind, turn, hunterTargetId: 'quarry', companionTargetId: 'quarry' });
const makeStore = (initial, specialization = '') => {
  let state;
  const get = () => state;
  const set = update => { state = { ...state, ...(typeof update === 'function' ? update(state) : update) }; };
  state = { ...createResourceSlice(set, get), class: 'Apex', classResource: initial, primarySpecialization: specialization,
    syncWithMultiplayer: jest.fn(), syncResourcesWithMultiplayer: jest.fn() };
  return { getState: get };
};

test('Apex initialization, load normalization and refresh retain five Marks and metadata/legacy aliases', () => {
  expect(initializeClassResource('Apex', {})).toMatchObject({ current: 0, max: 5, apexGeneration: { turn: 1, generated: 0 } });
  const saved = { type: 'quarryMarksCompanion', marks: 8, max: 20, quarryMarks: { current: 8, max: 20, note: 'Keep' }, worldNote: 'Keep' };
  expect(updateClassResourceMax(saved, 'Apex', { level: 20 })).toMatchObject({ current: 5, max: 5, marks: 5, worldNote: 'Keep', quarryMarks: { current: 5, max: 5, note: 'Keep' } });
  expect(saved.marks).toBe(8);
  expect(saved).not.toHaveProperty('apexGeneration');
});

test.each(Object.entries(APEX_PACK_EVENTS))('%s has its authored pack outcome amount', (kind, rule) => {
  const result = applyApexPackEvent(resource(), receipt('resolved', kind), { companionAvailable: true });
  expect(result).toMatchObject({ accepted: true, gained: rule.gain, resource: { current: rule.gain, apexGeneration: { generated: rule.gain } } });
});

test('solo hits, unknown sources, mismatched quarry and unavailable companions cannot generate', () => {
  const initial = resource();
  expect(applyApexPackEvent(initial, receipt('solo', 'solo_glaive_hit'), { companionAvailable: true }).accepted).toBe(false);
  expect(applyApexPackEvent(initial, receipt('unknown', 'toString'), { companionAvailable: true }).accepted).toBe(false);
  expect(applyApexPackEvent(initial, { ...receipt('pair', 'coordinated_strike'), companionTargetId: 'different' }, { companionAvailable: true }).accepted).toBe(false);
  expect(applyApexPackEvent(initial, receipt('hit'), { companionAvailable: false }).accepted).toBe(false);
  expect(initial.current).toBe(0);
});

test('a resolution ID is counted once across hit/critical encodings; stale-window receipts fail', () => {
  const first = applyApexPackEvent(resource(), receipt('attack', 'companion_crit'), { companionAvailable: true });
  expect(applyApexPackEvent(first.resource, receipt('attack', 'companion_hit'), { companionAvailable: true }).reason).toBe('duplicate-receipt');
  const next = beginApexOwnTurn(first.resource);
  expect(next).toMatchObject({ current: 2, apexGeneration: { turn: 2, generated: 0, events: [] } });
  expect(applyApexPackEvent(next, receipt('late', 'companion_hit', 1), { companionAvailable: true }).accepted).toBe(false);
  expect(applyApexPackEvent(next, receipt('new', 'companion_hit', 2), { companionAvailable: true }).gained).toBe(1);
});

test.each([['bladestorm', 3], ['beastmaster', 4]])('the %s cap is %i per own-turn window, not per spend', (specialization, cap) => {
  const store = makeStore(resource(), specialization);
  store.getState().recordApexPackEvent(receipt('critical', 'companion_crit'));
  store.getState().recordApexPackEvent(receipt('pair', 'coordinated_strike'));
  expect(store.getState().classResource).toMatchObject({ current: cap, apexGeneration: { generated: cap } });
  store.getState().consumeClassResource(2);
  const before = store.getState().classResource.current;
  expect(store.getState().recordApexPackEvent(receipt('after-spend')).accepted).toBe(false);
  expect(store.getState().classResource.current).toBe(before);
  store.getState().updateClassResource('round', 99, true, true);
  expect(store.getState().recordApexPackEvent(receipt('round-changed')).accepted).toBe(false);
  store.getState().beginApexOwnTurn();
  expect(store.getState().recordApexPackEvent(receipt('next-own-turn', 'companion_hit', 2)).accepted).toBe(true);
});

test('full-bank overflow uses generation budget and cannot become reserve charge after spending', () => {
  const store = makeStore(resource({ current: 4 }));
  const result = store.getState().recordApexPackEvent(receipt('critical', 'companion_crit'));
  expect(result).toMatchObject({ gained: 1, generated: 2, overflow: 1 });
  store.getState().consumeClassResource(3);
  store.getState().recordApexPackEvent(receipt('one-left'));
  expect(store.getState().classResource).toMatchObject({ current: 3, apexGeneration: { generated: 3 } });
  store.getState().gainClassResource(5);
  expect(store.getState().classResource.current).toBe(3);
  store.getState().updateClassResource('current', 0, true, true);
  expect(store.getState().recordApexPackEvent(receipt('manual-correction')).accepted).toBe(false);
});

test('linked live token vitality takes precedence over cached HP and reported availability', () => {
  const initial = resource({ companionTokenId: 'wolf', companionHP: 0 });
  const tokens = [{ id: 'wolf', state: { currentHp: 20 } }];
  expect(getApexCompanionStatus(initial, tokens).available).toBe(true);
  expect(getApexCompanionStatus({ ...initial, companionHP: 50 }, [{ id: 'wolf', state: { currentHp: 0 } }]).available).toBe(false);
  expect(getApexCompanionStatus(initial, []).available).toBe(false);
  expect(getApexCompanionStatus(initial, [{ id: 'wolf', state: { currentHp: 20, conditions: ['unconscious'] } }]).available).toBe(false);
  expect(getApexCompanionStatus({ companionHP: 50 }, []).available).toBe(false);
});

test('store event processing rechecks the linked token and refuses a different companion receipt', () => {
  const previous = getStore('creatureStore');
  let hp = 20;
  registerStore('creatureStore', { getState: () => ({ creatureTokens: [{ id: 'wolf', state: { currentHp: hp } }] }) });
  try {
    const store = makeStore(resource({ companionTokenId: 'wolf', companionHP: 0 }));
    expect(store.getState().recordApexPackEvent({ ...receipt('wrong'), companionTokenId: 'lion' }).accepted).toBe(false);
    expect(store.getState().recordApexPackEvent({ ...receipt('correct'), companionTokenId: 'wolf' }).accepted).toBe(true);
    hp = 0;
    expect(store.getState().recordApexPackEvent({ ...receipt('dead'), companionTokenId: 'wolf' }).accepted).toBe(false);
  } finally { registerStore('creatureStore', previous); }
});

test('manual corrections do not masquerade as generation and generic cast gains are deferred', () => {
  const store = makeStore(resource());
  store.getState().gainClassResource(3, 'marks');
  expect(store.getState().classResource.current).toBe(0);
  store.getState().updateClassResource('marks', 5, true, true);
  expect(store.getState().classResource).toMatchObject({ current: 5, apexGeneration: { generated: 0 } });
  const attack = APEX_DATA.spells.find(spell => spell.id === 'apex_glaive_toss');
  expect(attack.resourceCost.classResource).toMatchObject({ gain: 0, legacyCastMarkGain: 1, generationTiming: 'resolved_pack_outcome' });
  expect(getManagedSpellResourcePlan(attack, store.getState().classResource, 'Apex')).toMatchObject({ handled: true, gain: 0, deferredGeneration: true, affordable: true });
  expect(getManagedSpellResourcePlan({ resourceCost: { classResource: { type: 'marks', gain: 3 } } }, store.getState().classResource, 'Apex').gain).toBe(0);
});

test('Mark costs use the five-Mark bank, preserve the generation ledger and reject foreign owners', () => {
  const spell = { resourceCost: { classResource: { type: 'marks', cost: 2 } } };
  const store = makeStore(resource({ current: 3, apexGeneration: { turn: 1, generated: 3, events: [] } }));
  expect(getManagedSpellResourcePlan(spell, store.getState().classResource, 'Apex')).toMatchObject({ affordable: true, cost: 2 });
  store.getState().consumeClassResource(2, 'marks');
  expect(store.getState().classResource).toMatchObject({ current: 1, apexGeneration: { generated: 3 } });
  expect(getManagedSpellResourcePlan(spell, store.getState().classResource, 'Apex').affordable).toBe(false);
  expect(getManagedSpellResourcePlan(spell, { type: 'fortunePoints', current: 7 }, 'Gambit').affordable).toBe(false);
});
