import { HERITAGE_EDGES } from './heritageEdgeContract';

// Blueprint §12 Pass 5 consumer layer. Every authored edge is a capability whose
// checkable condition type is the routing key: the combat pipeline raises an
// event for a condition type and asks which heritage capability applies. This
// keeps application explicit per capability instead of a blanket damage hook
// that could not express positional/medium/bond conditions.
export const CONDITION_ENGINE_HOOKS = Object.freeze({
  position: 'positioning',
  medium: 'environment',
  equipment: 'equipment',
  bond: 'bond',
  target: 'targeting',
  state: 'turn_start',
  terrain: 'terrain',
  rest: 'rest'
});

const capabilityEntries = Object.values(HERITAGE_EDGES).filter(entry => entry.edge.kind === 'capability' && entry.edge.capability);

const CAPABILITY_INDEX = capabilityEntries.reduce((acc, entry) => {
  if (!acc[entry.edge.capability]) acc[entry.edge.capability] = entry;
  return acc;
}, {});

export const HERITAGE_CAPABILITY_IDS = Object.freeze(Object.keys(CAPABILITY_INDEX).sort());

export function listHeritageCapabilities() {
  return Object.entries(CAPABILITY_INDEX).map(([capabilityId, entry]) => ({
    capabilityId,
    className: entry.className,
    heritageId: entry.heritageId,
    access: entry.access || 'N',
    conditionType: entry.edge.condition?.type || null,
    hook: CONDITION_ENGINE_HOOKS[entry.edge.condition?.type] || null,
    cost: entry.cost.capability || null
  }));
}

export function getHeritageCapabilityRoute(capabilityId) {
  const entry = CAPABILITY_INDEX[capabilityId];
  if (!entry) return null;
  return {
    capabilityId,
    className: entry.className,
    heritageId: entry.heritageId,
    access: entry.access || 'N',
    conditionType: entry.edge.condition?.type || null,
    hook: CONDITION_ENGINE_HOOKS[entry.edge.condition?.type] || null,
    cost: entry.cost.capability || null
  };
}

// Called by a combat consumer when it raises `event.type`. Returns whether the
// named capability is wired to that event, so application stays explicit.
export function resolveHeritageCapabilityEvent(capabilityId, event = {}) {
  const entry = CAPABILITY_INDEX[capabilityId];
  if (!entry) return { handled: false, reason: 'unknown-capability' };
  const route = getHeritageCapabilityRoute(capabilityId);
  return {
    handled: true,
    ...route,
    matches: Boolean(route.hook) && event.type === route.hook,
    edge: entry.edge,
    costDef: entry.cost
  };
}

export function listUnroutedHeritageCapabilities() {
  return listHeritageCapabilities().filter(row => !row.conditionType || !row.hook);
}
