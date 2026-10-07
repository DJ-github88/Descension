import { resolveClassResourceEngineId } from './classResourceAliases';

// Blueprint §5.3 / C-10: Mayhem runs 0–100 as an entropy pressure gauge.
// Wild Surge is the full-gauge marker; it is not an automatic damage engine,
// and Mayhem generation is dice/field-driven, so pacing is not inferred.
export const HARBINGER_MAYHEM_MAX = 100;
export const HARBINGER_WILD_SURGE = 100;

export const HARBINGER_MAYHEM_TIERS = Object.freeze([
  { name: 'Safe', min: 0, max: 40, bonusDice: 0, misfire: 0 },
  { name: 'Escalating', min: 41, max: 60, bonusDice: 1, misfire: 10 },
  { name: 'Volatile', min: 61, max: 80, bonusDice: 2, misfire: 25 },
  { name: 'Maximum', min: 81, max: 99, bonusDice: 3, misfire: 25 },
  { name: 'Wild Surge', min: 100, max: 100, bonusDice: 3, misfire: 25 }
]);

const valueOf = value => value && typeof value === 'object' ? value.current : value;
const integer = value => {
  if (!Number.isFinite(Number(value))) return 0;
  return Math.max(0, Math.min(HARBINGER_MAYHEM_MAX, Math.trunc(Number(value))));
};

export function getHarbingerMayhemTier(current) {
  const value = integer(current);
  return HARBINGER_MAYHEM_TIERS.find(tier => value >= tier.min && value <= tier.max) ||
    HARBINGER_MAYHEM_TIERS[HARBINGER_MAYHEM_TIERS.length - 1];
}

export function isHarbingerWildSurge(current) {
  return integer(current) >= HARBINGER_WILD_SURGE;
}

export function normalizeHarbingerResource(resource) {
  if (!resource) return resource;
  const current = integer(
    resource.current !== undefined ? valueOf(resource.current)
      : valueOf(resource?.mayhem) ?? valueOf(resource?.mayhemGauge) ?? 0
  );
  const mirror = old => old && typeof old === 'object' ? { ...old, current, max: HARBINGER_MAYHEM_MAX } : current;
  return {
    ...resource, type: 'mayhemGauge', current, max: HARBINGER_MAYHEM_MAX,
    ...(resource.mayhem !== undefined ? { mayhem: mirror(resource.mayhem) } : {}),
    ...(resource.mayhemGauge !== undefined ? { mayhemGauge: mirror(resource.mayhemGauge) } : {}),
    wildSurge: isHarbingerWildSurge(current)
  };
}

export function updateHarbingerResource(resource, field, value) {
  const normalized = normalizeHarbingerResource(resource);
  if (['current', 'mayhem', 'mayhemGauge'].includes(field)) {
    return normalizeHarbingerResource({ ...normalized, current: valueOf(value) });
  }
  return normalizeHarbingerResource({ ...normalized, [field]: value });
}

// Negative cost encodes generation; positive cost is a release. Explicit gains
// are retained. Mayhem bonuses printed on effects are not treated as resource.
export function getHarbingerSpellResourcePlan(spell, resource, resourceId) {
  const values = spell.resourceCost?.resourceValues || {};
  const generic = spell.resourceCost?.classResource ?? values.classResource ?? {};
  const genericOwner = resolveClassResourceEngineId(generic.type) === 'mayhemGauge';
  const explicitCost = spell.mayhemCost ?? values.mayhem_cost;
  const explicitGain = spell.mayhemGain ?? values.mayhem_gain;
  const required = spell.mayhemRequired ?? values.mayhem_required ?? (genericOwner ? generic.required : undefined);
  const handled = explicitCost !== undefined || explicitGain !== undefined ||
    (genericOwner && (generic.cost !== undefined || generic.gain !== undefined || generic.required !== undefined));
  if (!handled) return { handled: false };

  const normalized = normalizeHarbingerResource(resource || {});
  const rawCost = explicitCost ?? (genericOwner ? generic.cost : undefined);
  const all = typeof rawCost === 'string' && rawCost.toLowerCase() === 'all';
  const numericCost = rawCost === undefined || all ? 0 : Number(rawCost);
  const safeCost = Number.isFinite(numericCost) ? numericCost : 0;
  const cost = all ? normalized.current : Math.max(0, Math.trunc(safeCost));
  const generatedByNegativeCost = !all && safeCost < 0 ? Math.trunc(-safeCost) : 0;
  const explicit = Number(explicitGain ?? (genericOwner ? generic.gain ?? 0 : 0));
  const gain = Math.max(0, Math.trunc(Number.isFinite(explicit) ? explicit : 0)) + generatedByNegativeCost;
  const minimum = Math.max(0, Math.trunc(Number(required ?? 0) || 0));
  const valid = [cost, gain, minimum].every(Number.isSafeInteger);

  return {
    handled: true, id: 'mayhemGauge', label: 'Mayhem', resourceKey: 'mayhem', current: normalized.current,
    cost: valid ? cost : 0, gain: valid ? gain : 0, required: valid ? minimum : 0,
    wildSurge: normalized.wildSurge,
    affordable: resourceId === 'mayhemGauge' && valid && normalized.current >= Math.max(cost, minimum) && (!all || normalized.current > 0)
  };
}
