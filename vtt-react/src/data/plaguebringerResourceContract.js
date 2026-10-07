import { resolveClassResourceEngineId } from './classResourceAliases';

// Blueprint §5.3 / C-15: Virulence 0–100 with infection stages. Host and
// infection counters have finite scopes; network use is not map-wide seeding.
export const PLAGUEBRINGER_VIRULENCE_MAX = 100;
export const PLAGUEBRINGER_AFFLICTION_MAX = 10;

export const PLAGUEBRINGER_VIRULENCE_TIERS = Object.freeze([
  { name: 'Dormant', min: 0, max: 24 },
  { name: 'Sprouting', min: 25, max: 49 },
  { name: 'Blooming', min: 50, max: 74 },
  { name: 'Peak Harvest', min: 75, max: 100 }
]);

const valueOf = value => value && typeof value === 'object' ? value.current : value;
const finite = value => Number.isFinite(Number(value)) ? Number(value) : 0;
const integer = value => Math.trunc(finite(value));
const clamp = (value, max) => Math.max(0, Math.min(max, integer(value)));

export function getPlaguebringerTier(virulence) {
  const value = clamp(virulence, PLAGUEBRINGER_VIRULENCE_MAX);
  return PLAGUEBRINGER_VIRULENCE_TIERS.find(tier => value >= tier.min && value <= tier.max) ||
    PLAGUEBRINGER_VIRULENCE_TIERS[PLAGUEBRINGER_VIRULENCE_TIERS.length - 1];
}

export function getPlaguebringerAfflictionMax(resource = {}) {
  const max = integer(resource?.maxAfflictions);
  return max > 0 ? max : PLAGUEBRINGER_AFFLICTION_MAX;
}

export function normalizePlaguebringerResource(resource) {
  if (!resource) return resource;
  const maxAfflictions = getPlaguebringerAfflictionMax(resource);
  const virulence = clamp(
    resource.virulence !== undefined ? valueOf(resource.virulence) : valueOf(resource.current),
    PLAGUEBRINGER_VIRULENCE_MAX
  );
  const afflictions = clamp(resource.afflictions ?? resource.activeAfflictions, maxAfflictions);
  const mirror = old => old && typeof old === 'object' ? { ...old, current: virulence, max: PLAGUEBRINGER_VIRULENCE_MAX } : virulence;
  return {
    ...resource, type: 'virulenceCultivation', virulence, current: virulence, max: PLAGUEBRINGER_VIRULENCE_MAX,
    ...(resource.virulence !== undefined ? { virulence: mirror(resource.virulence) } : { virulence }),
    afflictions, activeAfflictions: afflictions, maxAfflictions
  };
}

export function updatePlaguebringerResource(resource, field, value) {
  const normalized = normalizePlaguebringerResource(resource);
  if (['virulence', 'current'].includes(field)) return normalizePlaguebringerResource({ ...normalized, virulence: valueOf(value) });
  if (['afflictions', 'activeAfflictions'].includes(field)) return normalizePlaguebringerResource({ ...normalized, afflictions: value });
  if (field === 'maxAfflictions') return normalizePlaguebringerResource({ ...normalized, maxAfflictions: integer(value) });
  return normalizePlaguebringerResource({ ...normalized, [field]: value });
}

export function getPlaguebringerSpellResourcePlan(spell, resource, resourceId) {
  const values = spell.resourceCost?.resourceValues || {};
  const generic = spell.resourceCost?.classResource ?? values.classResource ?? {};
  const genericOwner = resolveClassResourceEngineId(generic.type) === 'virulenceCultivation';
  const explicitCost = spell.virulenceCost ?? values.virulence_cost;
  const explicitGain = spell.virulenceGain ?? values.virulence_gain;
  const handled = explicitCost !== undefined || explicitGain !== undefined ||
    (genericOwner && (generic.cost !== undefined || generic.gain !== undefined));
  if (!handled) return { handled: false };

  const normalized = normalizePlaguebringerResource(resource || {});
  const rawCost = explicitCost ?? (genericOwner ? generic.cost : undefined);
  const all = typeof rawCost === 'string' && rawCost.toLowerCase() === 'all';
  const numericCost = rawCost === undefined || all ? 0 : Number(rawCost);
  const safeCost = Number.isFinite(numericCost) ? numericCost : 0;
  const cost = all ? normalized.virulence : Math.max(0, Math.trunc(safeCost));
  const generatedByNegativeCost = !all && safeCost < 0 ? Math.trunc(-safeCost) : 0;
  const explicit = Number(explicitGain ?? (genericOwner ? generic.gain ?? 0 : 0));
  const gain = Math.max(0, Math.trunc(Number.isFinite(explicit) ? explicit : 0)) + generatedByNegativeCost;
  const valid = Number.isInteger(cost) && Number.isInteger(gain);

  return {
    handled: true, id: 'virulenceCultivation', label: 'Virulence', resourceKey: 'virulence',
    current: normalized.virulence, tier: getPlaguebringerTier(normalized.virulence).name,
    cost: valid ? cost : 0, gain: valid ? gain : 0,
    affordable: resourceId === 'virulenceCultivation' && valid && normalized.virulence >= cost && (!all || normalized.virulence > 0)
  };
}
