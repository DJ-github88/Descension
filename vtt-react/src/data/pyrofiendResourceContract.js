import { resolveClassResourceEngineId } from './classResourceAliases';

export const PYRO_VEIL_MAX = 9;
export const PYRO_DEBT_CALL_TURNS = 3;
const integer = (value, max, fallback = 0) => Number.isFinite(Number(value))
  ? Math.max(0, Math.min(max, Math.trunc(Number(value)))) : fallback;

export const getPyroRing = value => {
  const stage = integer(value, PYRO_VEIL_MAX);
  return stage === 0 ? 0 : stage <= 3 ? 1 : stage <= 6 ? 2 : 3;
};
export const getPyroRingLabel = value => ['Ring 0', 'Ring I', 'Ring II', 'Ring III'][getPyroRing(value)];

export function normalizePyroResource(resource) {
  if (!resource) return resource;
  const current = integer(resource.current ?? resource.infernoLevel ?? resource.level, PYRO_VEIL_MAX);
  const call = resource.debtCall || {};
  const processedOwnTurns = Array.isArray(call.processedOwnTurns)
    ? [...new Set(call.processedOwnTurns.filter(id => typeof id === 'string' && id.trim()))] : [];
  const latched = current === PYRO_VEIL_MAX || call.latched === true || call.expired === true ||
    ['called', 'expired'].includes(call.status) || processedOwnTurns.length > 0;
  const turnsRemaining = !latched ? PYRO_DEBT_CALL_TURNS : call.expired === true || call.status === 'expired' ? 0
    : Math.min(integer(call.turnsRemaining ?? PYRO_DEBT_CALL_TURNS, PYRO_DEBT_CALL_TURNS, PYRO_DEBT_CALL_TURNS),
      Math.max(0, PYRO_DEBT_CALL_TURNS - processedOwnTurns.length));
  return { ...resource, type: 'infernoVeil', current, max: PYRO_VEIL_MAX, ring: getPyroRing(current),
    ...(resource.infernoLevel !== undefined ? { infernoLevel: current } : {}),
    ...(resource.level !== undefined ? { level: current } : {}),
    debtCall: { ...call, latched, turnsRemaining, expired: latched && turnsRemaining === 0,
      status: !latched ? 'inactive' : turnsRemaining === 0 ? 'expired' : 'called',
      processedOwnTurns }
  };
}

export function updatePyroResource(resource, field, value) {
  const normalized = normalizePyroResource(resource);
  if (['current', 'infernoLevel', 'level', 'inferno_veil'].includes(field)) {
    return normalizePyroResource({ ...normalized, current: value });
  }
  if (field === 'debtCall') {
    const requested = value && typeof value === 'object' ? value : {};
    const call = normalized.debtCall;
    return normalizePyroResource({ ...normalized, debtCall: { ...call, ...requested,
      latched: call.latched || requested.latched === true,
      expired: call.expired || requested.expired === true,
      turnsRemaining: Math.min(call.turnsRemaining, integer(requested.turnsRemaining ?? call.turnsRemaining, PYRO_DEBT_CALL_TURNS, call.turnsRemaining)),
      processedOwnTurns: [...new Set([...call.processedOwnTurns, ...(Array.isArray(requested.processedOwnTurns) ? requested.processedOwnTurns : [])])] } });
  }
  return normalizePyroResource({ ...normalized, [field]: value });
}

// The first three distinct own-turn receipts after the call advance 3→2→1→0.
// Replayed receipts and expired clocks cannot advance again. The caller reports
// own-turn boundaries; automatic combat-owner detection is a separate adapter.
export function advancePyroDebtCall(resource, ownTurnId) {
  const normalized = normalizePyroResource(resource);
  const call = normalized.debtCall;
  if (!call.latched || call.expired || typeof ownTurnId !== 'string' || !ownTurnId.trim() || call.processedOwnTurns.includes(ownTurnId)) {
    return { accepted: false, resource: normalized };
  }
  return { accepted: true, resource: updatePyroResource(normalized, 'debtCall', {
    ...call, turnsRemaining: call.turnsRemaining - 1, processedOwnTurns: [...call.processedOwnTurns, ownTurnId]
  }) };
}

export function getPyroSpellResourcePlan(spell, resource, resourceId) {
  const values = spell.resourceCost?.resourceValues || {};
  const generic = spell.resourceCost?.classResource ?? values.classResource ?? {};
  const level = spell.specialMechanics?.infernoLevel || {};
  const ascend = spell.infernoAscend ?? values.inferno_ascend ?? level.ascendBy;
  const descend = spell.infernoDescend ?? values.inferno_descend ?? level.descendBy;
  const required = spell.infernoRequired ?? values.inferno_required ?? level.required ?? generic.minVeil;
  const genericOwner = resolveClassResourceEngineId(generic.type) === 'infernoVeil';
  const owned = resourceId === 'infernoVeil';
  const normalized = normalizePyroResource(resource || {});
  const handled = ascend !== undefined || descend !== undefined || required !== undefined ||
    (genericOwner && (generic.cost !== undefined || generic.gain !== undefined)) || (owned && normalized.debtCall.expired);
  if (!handled) return { handled: false };
  const genericCost = Number(genericOwner ? generic.cost ?? 0 : 0);
  const rise = Number(ascend ?? (genericOwner ? generic.gain ?? Math.max(0, -genericCost) : 0));
  const fall = Number(descend ?? Math.max(0, genericCost));
  const minimum = Number(required ?? 0);
  const valid = [rise, fall, minimum].every(value => Number.isInteger(value) && value >= 0) &&
    (ascend !== undefined || descend !== undefined || Number.isFinite(genericCost));
  // Observe the peak before venting: a combined spell cannot net away stage 9.
  const risen = updatePyroResource(normalized, 'current', normalized.current + (valid ? rise : 0));
  const nextResource = updatePyroResource(risen, 'current', risen.current - (valid ? fall : 0));
  return { handled: true, id: 'infernoVeil', transition: 'infernoVeil', resourceKey: 'inferno_veil',
    current: normalized.current, cost: valid ? Math.min(normalized.current, fall) : 0, gain: valid ? rise : 0,
    required: valid ? minimum : 0, cooling: valid ? fall : 0, nextResource, label: 'Veil levels',
    affordable: owned && valid && !normalized.debtCall.expired && normalized.current >= minimum &&
      (descend !== undefined || genericCost <= 0 || normalized.current >= genericCost),
    ...(normalized.debtCall.expired && owned ? { reason: 'Debt Call has expired; its terminal consequence is due' } : {}) };
}
