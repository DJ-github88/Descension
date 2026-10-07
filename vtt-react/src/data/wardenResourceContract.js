import { resolveClassResourceEngineId } from './classResourceAliases';

// Blueprint §5.3 / C-21: Warden Tension (Tether-Tension) 0–10. The legacy
// `vengeance-points` engine name is retained for saves; it does not turn the
// class into a different supernatural vengeance origin.
export const WARDEN_TENSION_MAX = 10;

const valueOf = value => value && typeof value === 'object' ? value.current : value;
const finite = value => Number.isFinite(Number(value)) ? Number(value) : 0;
const integer = value => Math.trunc(finite(value));
const clamp = (value, max) => Math.max(0, Math.min(max, integer(value)));

export function getWardenMaxTension(resource = {}) {
  const max = integer(resource?.maxTension);
  return max > 0 ? max : WARDEN_TENSION_MAX;
}

export function normalizeWardenResource(resource) {
  if (!resource) return resource;
  const max = getWardenMaxTension(resource);
  const current = clamp(resource.current ?? resource.tension ?? resource.vengeancePoints ?? resource.vp, max);
  const mirror = old => old && typeof old === 'object' ? { ...old, current, max } : current;
  return {
    ...resource, type: 'vengeance-points', current, max, maxTension: max,
    ...(resource.tension !== undefined ? { tension: mirror(resource.tension) } : {}),
    ...(resource.vengeancePoints !== undefined ? { vengeancePoints: mirror(resource.vengeancePoints) } : {})
  };
}

export function updateWardenResource(resource, field, value) {
  const normalized = normalizeWardenResource(resource);
  if (['current', 'tension', 'vengeancePoints', 'vp'].includes(field)) return normalizeWardenResource({ ...normalized, current: valueOf(value) });
  if (field === 'maxTension') return normalizeWardenResource({ ...normalized, maxTension: integer(value) });
  return normalizeWardenResource({ ...normalized, [field]: value });
}

export function getWardenSpellResourcePlan(spell, resource, resourceId) {
  const values = spell.resourceCost?.resourceValues || {};
  const generic = spell.resourceCost?.classResource ?? values.classResource ?? {};
  const genericOwner = resolveClassResourceEngineId(generic.type) === 'vengeance-points';
  const explicitCost = spell.tensionCost ?? values.tension_cost;
  const explicitGain = spell.tensionGain ?? values.tension_gain;
  const handled = explicitCost !== undefined || explicitGain !== undefined ||
    (genericOwner && (generic.cost !== undefined || generic.gain !== undefined));
  if (!handled) return { handled: false };

  const normalized = normalizeWardenResource(resource || {});
  const rawCost = explicitCost ?? (genericOwner ? generic.cost : undefined);
  const all = typeof rawCost === 'string' && rawCost.toLowerCase() === 'all';
  const numericCost = rawCost === undefined || all ? 0 : Number(rawCost);
  const safeCost = Number.isFinite(numericCost) ? numericCost : 0;
  const cost = all ? normalized.current : Math.max(0, Math.trunc(safeCost));
  const generatedByNegativeCost = !all && safeCost < 0 ? Math.trunc(-safeCost) : 0;
  const explicit = Number(explicitGain ?? (genericOwner ? generic.gain ?? 0 : 0));
  const gain = Math.max(0, Math.trunc(Number.isFinite(explicit) ? explicit : 0)) + generatedByNegativeCost;
  const valid = Number.isInteger(cost) && Number.isInteger(gain);

  return {
    handled: true, id: 'vengeance-points', label: 'Tension', resourceKey: 'tension', current: normalized.current,
    cost: valid ? cost : 0, gain: valid ? gain : 0,
    affordable: resourceId === 'vengeance-points' && valid && normalized.current >= cost && (!all || normalized.current > 0)
  };
}
