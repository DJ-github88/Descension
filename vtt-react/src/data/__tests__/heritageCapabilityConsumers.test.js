import {
  listHeritageCapabilities, getHeritageCapabilityRoute, resolveHeritageCapabilityEvent,
  listUnroutedHeritageCapabilities, HERITAGE_CAPABILITY_IDS, CONDITION_ENGINE_HOOKS
} from '../heritageCapabilityConsumers';
import { HERITAGE_EDGES } from '../heritageEdgeContract';

test('every authored capability is unique and routed to an engine hook', () => {
  const capabilityEdges = Object.values(HERITAGE_EDGES).filter(entry => entry.edge.kind === 'capability');
  const ids = capabilityEdges.map(entry => entry.edge.capability);
  expect(new Set(ids).size).toBe(ids.length);
  expect(HERITAGE_CAPABILITY_IDS.length).toBe(ids.length);
  expect(listUnroutedHeritageCapabilities()).toEqual([]);
  expect(listHeritageCapabilities().every(row => row.conditionType && row.hook)).toBe(true);
});

test('each condition type maps to exactly one engine hook', () => {
  const rows = listHeritageCapabilities();
  rows.forEach(row => expect(row.hook).toBe(CONDITION_ENGINE_HOOKS[row.conditionType]));
});

test('routing exposes class, heritage, access and paired cost', () => {
  const route = getHeritageCapabilityRoute('rapid_response_to_endangered_ally');
  expect(route).toMatchObject({ className: 'Berserker', heritageId: 'skald_human', conditionType: 'target', hook: 'targeting', access: 'N' });
  expect(route.cost).toBe('requires_real_danger_and_heat_burnout');
  const eRoute = getHeritageCapabilityRoute('vigil_mote_reference');
  expect(eRoute).toMatchObject({ className: 'Lunarch', access: 'E', hook: 'turn_start' });
  expect(getHeritageCapabilityRoute('not_a_capability')).toBeNull();
});

test('event resolution only matches the capability\'s own hook and rejects unknown ids', () => {
  expect(resolveHeritageCapabilityEvent('rapid_response_to_endangered_ally', { type: 'targeting' }).matches).toBe(true);
  expect(resolveHeritageCapabilityEvent('rapid_response_to_endangered_ally', { type: 'rest' }).matches).toBe(false);
  expect(resolveHeritageCapabilityEvent('unknown', { type: 'rest' })).toMatchObject({ handled: false, reason: 'unknown-capability' });
});
