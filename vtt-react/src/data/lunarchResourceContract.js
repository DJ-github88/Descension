// Blueprint §5.3 / C-12: four lunar phases, not a spendable 0–4 scalar pool.
// Phase state and the round timer are tracked; astronomical timing and active
// combat channeling stay separate.
export const LUNARCH_PHASES = Object.freeze(['new_moon', 'waxing_moon', 'full_moon', 'waning_moon']);
export const LUNARCH_PHASE_DURATION = 3;

const PHASE_ALIASES = {
  new: 'new_moon', new_moon: 'new_moon',
  waxing: 'waxing_moon', waxing_moon: 'waxing_moon',
  full: 'full_moon', full_moon: 'full_moon',
  waning: 'waning_moon', waning_moon: 'waning_moon'
};

const integer = value => Number.isFinite(Number(value)) ? Math.trunc(Number(value)) : 0;

export function resolveLunarchPhase(value, fallback = 'new_moon') {
  if (typeof value === 'number' && value >= 0 && value < LUNARCH_PHASES.length) return LUNARCH_PHASES[value];
  if (typeof value === 'string') {
    const key = value.trim().toLowerCase().replace(/\s+/g, '_');
    if (PHASE_ALIASES[key]) return PHASE_ALIASES[key];
  }
  return LUNARCH_PHASES.includes(fallback) ? fallback : 'new_moon';
}

export function getLunarchPhaseIndex(phase) {
  return LUNARCH_PHASES.indexOf(resolveLunarchPhase(phase));
}

export function advanceLunarchPhase(phase, steps = 1) {
  const index = getLunarchPhaseIndex(phase);
  const next = ((index + Math.trunc(steps)) % LUNARCH_PHASES.length + LUNARCH_PHASES.length) % LUNARCH_PHASES.length;
  return LUNARCH_PHASES[next];
}

export function normalizeLunarchResource(resource) {
  if (!resource) return resource;
  const phase = resolveLunarchPhase(resource.currentLunarPhase ?? resource.phase ?? resource.current, 'new_moon');
  const roundsInPhase = Math.max(0, integer(resource.roundsInPhase ?? resource.round));
  return {
    ...resource, type: 'lunarPhases', currentPhase: phase, currentLunarPhase: phase, phase,
    current: getLunarchPhaseIndex(phase),
    roundsInPhase, round: roundsInPhase,
    phaseDuration: integer(resource.phaseDuration) > 0 ? integer(resource.phaseDuration) : LUNARCH_PHASE_DURATION
  };
}

export function updateLunarchResource(resource, field, value) {
  const normalized = normalizeLunarchResource(resource);
  if (['currentLunarPhase', 'phase', 'currentPhase'].includes(field)) {
    return normalizeLunarchResource({ ...normalized, currentLunarPhase: resolveLunarchPhase(value) });
  }
  if (['current', 'phaseIndex'].includes(field)) {
    return normalizeLunarchResource({ ...normalized, currentLunarPhase: resolveLunarchPhase(value) });
  }
  if (['roundsInPhase', 'round'].includes(field)) {
    return normalizeLunarchResource({ ...normalized, roundsInPhase: Math.max(0, integer(value)) });
  }
  return normalizeLunarchResource({ ...normalized, [field]: value });
}

// Lunar spells advance the phase or require a phase; numeric `cost` is not a
// spendable scalar and is surfaced only as advisory phase cost.
export function getLunarchSpellResourcePlan(spell, resource, resourceId) {
  const values = spell.resourceCost?.resourceValues || {};
  const generic = spell.resourceCost?.classResource ?? values.classResource ?? {};
  if (generic.type !== 'lunar_phase' && spell.lunarPhase === undefined && spell.phaseAdvancement === undefined) {
    return { handled: false };
  }
  const normalized = normalizeLunarchResource(resource || {});
  const fromPhase = resolveLunarchPhase(generic.fromPhase ?? generic.from ?? normalized.currentPhase);
  const toPhase = resolveLunarchPhase(generic.toPhase ?? generic.to, fromPhase);
  const phaseAdvancement = Math.trunc(Number(generic.phaseAdvancement ?? spell.phaseAdvancement ?? 0) || 0);
  const phaseRequired = generic.phaseRequired ?? spell.phaseRequired;
  const selectAnyPhase = generic.selectAnyPhase === true || spell.selectAnyPhase === true;
  const phaseCost = Number.isFinite(Number(generic.cost)) ? Math.trunc(Number(generic.cost)) : 0;
  const requiredPhase = phaseRequired ? resolveLunarchPhase(phaseRequired) : null;
  const phaseMatches = !requiredPhase || normalized.currentPhase === requiredPhase;
  const ownerMatches = resourceId === 'lunarPhases';

  return {
    handled: true, id: 'lunarPhases', label: 'Lunar Phase', resourceKey: 'currentLunarPhase',
    currentPhase: normalized.currentPhase, current: getLunarchPhaseIndex(normalized.currentPhase),
    cost: 0, gain: 0, phaseCost,
    phaseAdvancement, fromPhase, toPhase: phaseAdvancement ? advanceLunarchPhase(fromPhase, phaseAdvancement) : toPhase,
    requiredPhase, selectAnyPhase,
    affordable: ownerMatches && phaseMatches
  };
}
