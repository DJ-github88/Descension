import { resolveClassResourceEngineId } from './classResourceAliases';

export const APEX_MARK_MAX = 5;
export const APEX_TURN_CAP = 3;
export const APEX_BEASTMASTER_TURN_CAP = 4;
export const APEX_PACK_EVENTS = Object.freeze({
  coordinated_strike: { gain: 2, label: 'Both hit same quarry (+2)' },
  companion_hit: { gain: 1, label: 'Companion hit (+1)' },
  companion_damage: { gain: 1, label: 'Companion took damage (+1)' },
  companion_crit: { gain: 2, label: 'Companion critical hit (+2)' },
  mark_quarry: { gain: 1, label: 'Pack quarry designated (+1)' }
});

const integer = (value, max, fallback = 0) => Number.isFinite(Number(value))
  ? Math.max(0, Math.min(max, Math.trunc(Number(value)))) : fallback;

export function getApexTurnCap(specialization) {
  const name = typeof specialization === 'object' ? specialization?.id ?? specialization?.name : specialization;
  return String(name || '').replace(/[\s_-]/g, '').toLowerCase() === 'beastmaster' ? APEX_BEASTMASTER_TURN_CAP : APEX_TURN_CAP;
}

export function normalizeApexResource(resource) {
  if (!resource) return resource;
  const current = integer(resource.current ?? resource.quarryMarks?.current ?? resource.marks ?? resource.quarryMarks, APEX_MARK_MAX);
  const generation = resource.apexGeneration || {};
  return {
    ...resource, type: 'quarryMarksCompanion', current, max: APEX_MARK_MAX,
    ...(resource.marks !== undefined ? { marks: current } : {}),
    ...(resource.quarryMarks !== undefined ? { quarryMarks: typeof resource.quarryMarks === 'object'
      ? { ...resource.quarryMarks, current, max: APEX_MARK_MAX } : current } : {}),
    apexGeneration: { ...generation,
      turn: Math.max(1, integer(generation.turn, Number.MAX_SAFE_INTEGER, 1)),
      generated: integer(generation.generated, APEX_BEASTMASTER_TURN_CAP),
      events: Array.isArray(generation.events) ? [...generation.events] : [] }
  };
}

// A linked canvas token is authoritative. The old companionHP HUD cache is
// deliberately not an availability signal when no token has been linked.
export function getApexCompanionStatus(resource, creatureTokens = []) {
  if (resource?.companionTokenId) {
    const token = creatureTokens.find(candidate => candidate.id === resource.companionTokenId);
    const hp = token?.state?.currentHp ?? token?.stats?.currentHp ?? token?.stats?.maxHp;
    const incapacitated = (token?.state?.conditions || []).some(condition =>
      ['dead', 'unconscious', 'incapacitated'].includes(String(typeof condition === 'string' ? condition : condition?.id ?? condition?.name).toLowerCase()));
    return { mode: 'token', name: token?.name || 'Linked companion',
      available: !!token && Number.isFinite(Number(hp)) && Number(hp) > 0 &&
        !token.state?.isDead && !token.state?.isIncapacitated && !incapacitated };
  }
  return { mode: 'reported', name: 'Reported companion', available: resource?.companionAvailable === true };
}

export function beginApexOwnTurn(resource) {
  const normalized = normalizeApexResource(resource);
  return normalizeApexResource({ ...normalized,
    apexGeneration: { ...normalized.apexGeneration, turn: normalized.apexGeneration.turn + 1, generated: 0, events: [] } });
}

// Keep the authored old amount as migration evidence; casting itself is not
// a resolved hit, critical hit, damage event, or coordinated strike.
export function deferApexSpellMarkGeneration(spell) {
  const resourceCost = spell.resourceCost || {};
  const generic = resourceCost.classResource ?? resourceCost.resourceValues?.classResource;
  if (!generic || resolveClassResourceEngineId(generic.type) !== 'quarryMarksCompanion') return spell;
  const legacyGain = Number(generic.gain ?? (Number(generic.cost) < 0 ? -Number(generic.cost) : 0));
  if (!(legacyGain > 0)) return spell;
  const deferred = { ...generic, gain: 0, legacyCastMarkGain: legacyGain, generationTiming: 'resolved_pack_outcome',
    ...(Number(generic.cost) < 0 ? { cost: 0 } : {}) };
  return { ...spell, resourceCost: { ...resourceCost,
    ...(resourceCost.classResource ? { classResource: deferred } : {}),
    ...(resourceCost.resourceValues?.classResource ? { resourceValues: { ...resourceCost.resourceValues, classResource: deferred } } : {}) } };
}

// Call once for a resolved outcome, with the resolution's stable receipt ID.
// Costs/spending and manual corrections never refund this generation budget.
export function applyApexPackEvent(resource, event, context = {}) {
  const normalized = normalizeApexResource(resource);
  const rejected = reason => ({ accepted: false, gained: 0, reason, resource: normalized });
  const rule = Object.prototype.hasOwnProperty.call(APEX_PACK_EVENTS, event?.kind) ? APEX_PACK_EVENTS[event.kind] : null;
  if (!rule) return rejected('ineligible-source');
  if (typeof event.id !== 'string' || !event.id.trim() || event.turn !== normalized.apexGeneration.turn) return rejected('invalid-receipt-or-turn');
  if (normalized.apexGeneration.events.some(receipt => receipt?.id === event.id)) return rejected('duplicate-receipt');
  if (normalized.companionTokenId && event.companionTokenId !== normalized.companionTokenId) return rejected('different-companion');
  if (!context.companionAvailable) return rejected('companion-unavailable');
  if (event.kind === 'coordinated_strike' && (typeof event.hunterTargetId !== 'string' || !event.hunterTargetId.trim() ||
    event.hunterTargetId !== event.companionTargetId)) return rejected('different-or-missing-quarry');
  const cap = getApexTurnCap(context.specialization ?? normalized.apexSpecialization ?? normalized.spec);
  const generated = Math.min(rule.gain, Math.max(0, cap - normalized.apexGeneration.generated));
  if (!generated) return rejected('own-turn-cap');
  const gained = Math.min(generated, APEX_MARK_MAX - normalized.current);
  return { accepted: true, gained, generated, overflow: rule.gain - gained,
    resource: normalizeApexResource({ ...normalized, current: normalized.current + gained,
      apexGeneration: { ...normalized.apexGeneration, generated: normalized.apexGeneration.generated + generated,
        events: [...normalized.apexGeneration.events, { id: event.id, kind: event.kind, generated, gained }] } }) };
}
