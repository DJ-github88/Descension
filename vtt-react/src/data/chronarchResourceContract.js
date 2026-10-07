import { resolveClassResourceEngineId } from './classResourceAliases';

// Blueprint §5.3 / C-06: Time Shards (power) and Temporal Strain (risk), both
// 0–10. Strain backlash at 10 is an encounter effect; spending Shards does not
// automatically add Strain because only Temporal Flux abilities do, and that
// attribution is not reliably encoded on every spell.
export const CHRONARCH_SHARDS_MAX = 10;
export const CHRONARCH_STRAIN_MAX = 10;
export const CHRONARCH_STRAIN_BACKLASH = 10;

const valueOf = value => value && typeof value === 'object' ? value.current : value;
const finite = value => Number.isFinite(Number(value)) ? Number(value) : 0;
const integer = value => Math.trunc(finite(value));
const clamp = (value, max) => Math.max(0, Math.min(max, integer(value)));

export const isChronarchStrainBacklash = strain => clamp(strain, CHRONARCH_STRAIN_MAX) >= CHRONARCH_STRAIN_BACKLASH;

export function getChronarchMaxShards(resource = {}) {
  const max = integer(resource?.maxTimeShards);
  return max > 0 ? max : CHRONARCH_SHARDS_MAX;
}

export function getChronarchMaxStrain(resource = {}) {
  const max = integer(resource?.maxTemporalStrain);
  return max > 0 ? max : CHRONARCH_STRAIN_MAX;
}

export function getChronarchPoolValue(resource = {}, resourceKey) {
  const key = String(resourceKey || '').toLowerCase();
  if (key === 'temporalstrain' || key === 'temporal_strain' || key === 'strain') {
    return finite(valueOf(resource?.temporalStrain) ?? valueOf(resource?.strain));
  }
  return finite(valueOf(resource?.timeShards) ?? valueOf(resource?.shards) ?? resource?.current);
}

export function normalizeChronarchResource(resource) {
  if (!resource) return resource;
  const maxTimeShards = getChronarchMaxShards(resource);
  const maxTemporalStrain = getChronarchMaxStrain(resource);
  const timeShards = clamp(valueOf(resource.timeShards) ?? resource.shards ?? resource.current, maxTimeShards);
  const temporalStrain = clamp(valueOf(resource.temporalStrain) ?? resource.strain, maxTemporalStrain);
  return {
    ...resource, type: 'timeShardsStrain', current: timeShards, max: maxTimeShards,
    timeShards: { ...(resource.timeShards && typeof resource.timeShards === 'object' ? resource.timeShards : {}), current: timeShards, max: maxTimeShards },
    temporalStrain: { ...(resource.temporalStrain && typeof resource.temporalStrain === 'object' ? resource.temporalStrain : {}), current: temporalStrain, max: maxTemporalStrain },
    maxTimeShards, maxTemporalStrain, backlash: isChronarchStrainBacklash(temporalStrain)
  };
}

export function updateChronarchResource(resource, field, value) {
  const normalized = normalizeChronarchResource(resource);
  if (['timeShards', 'shards', 'current'].includes(field)) return normalizeChronarchResource({ ...normalized, timeShards: valueOf(value) });
  if (['temporalStrain', 'strain', 'temporal_strain'].includes(field)) return normalizeChronarchResource({ ...normalized, temporalStrain: valueOf(value) });
  if (field === 'maxTimeShards') return normalizeChronarchResource({ ...normalized, maxTimeShards: integer(value) });
  if (field === 'maxTemporalStrain') return normalizeChronarchResource({ ...normalized, maxTemporalStrain: integer(value) });
  return normalizeChronarchResource({ ...normalized, [field]: value });
}

export function getChronarchSpellResourcePlan(spell, resource, resourceId) {
  const values = spell.resourceCost?.resourceValues || {};
  const generic = spell.resourceCost?.classResource ?? values.classResource ?? {};
  const genericOwner = resolveClassResourceEngineId(generic.type) === 'timeShardsStrain';
  const explicitCost = spell.shardsCost ?? values.shards_cost;
  const explicitGain = spell.shardsGain ?? values.shards_gain;
  const handled = explicitCost !== undefined || explicitGain !== undefined ||
    (genericOwner && (generic.cost !== undefined || generic.gain !== undefined));
  if (!handled) return { handled: false };

  const normalized = normalizeChronarchResource(resource || {});
  const rawCost = explicitCost ?? (genericOwner ? generic.cost : undefined);
  const all = typeof rawCost === 'string' && rawCost.toLowerCase() === 'all';
  const numericCost = rawCost === undefined || all ? 0 : Number(rawCost);
  const safeCost = Number.isFinite(numericCost) ? numericCost : 0;
  const cost = all ? normalized.timeShards.current : Math.max(0, Math.trunc(safeCost));
  const generatedByNegativeCost = !all && safeCost < 0 ? Math.trunc(-safeCost) : 0;
  const explicit = Number(explicitGain ?? (genericOwner ? generic.gain ?? 0 : 0));
  const gain = Math.max(0, Math.trunc(Number.isFinite(explicit) ? explicit : 0)) + generatedByNegativeCost;
  const valid = Number.isInteger(cost) && Number.isInteger(gain);

  return {
    handled: true, id: 'timeShardsStrain', label: 'Time Shards', resourceKey: 'timeShards',
    current: normalized.timeShards.current, cost: valid ? cost : 0, gain: valid ? gain : 0,
    affordable: resourceId === 'timeShardsStrain' && valid && normalized.timeShards.current >= cost && (!all || normalized.timeShards.current > 0)
  };
}
