import { resolveClassResourceEngineId } from './classResourceAliases';

// Blueprint §5.3 / C-20: Vials with an actual INT-based capacity, plus Parts
// capped at 5. Capacity is computed at initialization (INT mod + 3, minimum 4)
// and carried on the resource; this contract never invents a different cap.
export const TOXICOLOGIST_VIALS_MIN = 4;
export const TOXICOLOGIST_PARTS_MAX = 5;

const valueOf = value => value && typeof value === 'object' ? value.current : value;
const finite = value => Number.isFinite(Number(value)) ? Number(value) : 0;
const integer = value => Math.trunc(finite(value));
const clamp = (value, max) => Math.max(0, Math.min(max, integer(value)));

export function getToxicologistMaxVials(resource = {}) {
  const max = integer(resource?.toxinVialsMax);
  if (max > 0) return max;
  // Capacity comes from initialization (INT mod + 3). When absent, never shrink
  // a stored value below the minimum.
  return Math.max(TOXICOLOGIST_VIALS_MIN, integer(resource?.toxinVials ?? resource?.vials ?? resource?.current));
}

export function getToxicologistMaxParts(resource = {}) {
  const max = integer(resource?.contraptionPartsMax);
  return max > 0 ? max : TOXICOLOGIST_PARTS_MAX;
}

export function getToxicologistPoolValue(resource = {}, resourceKey) {
  const key = String(resourceKey || '').toLowerCase();
  if (key === 'contraption_parts' || key === 'contraptionparts' || key === 'parts') {
    return finite(resource?.contraptionParts ?? valueOf(resource?.parts));
  }
  return finite(resource?.toxinVials ?? valueOf(resource?.vials) ?? resource?.current);
}

export function normalizeToxicologistResource(resource) {
  if (!resource) return resource;
  const toxinVialsMax = getToxicologistMaxVials(resource);
  const contraptionPartsMax = getToxicologistMaxParts(resource);
  const toxinVials = clamp(resource.toxinVials ?? resource.vials ?? resource.current, toxinVialsMax);
  const contraptionParts = clamp(resource.contraptionParts ?? valueOf(resource.parts), contraptionPartsMax);
  return {
    ...resource, type: 'toxinVialsContraptions', current: toxinVials, max: toxinVialsMax,
    toxinVials, maxVials: toxinVialsMax, toxinVialsMax,
    contraptionParts, contraptionPartsMax
  };
}

export function updateToxicologistResource(resource, field, value) {
  const normalized = normalizeToxicologistResource(resource);
  if (['toxinVials', 'vials', 'current'].includes(field)) return normalizeToxicologistResource({ ...normalized, toxinVials: valueOf(value) });
  if (['contraptionParts', 'parts', 'contraption_parts'].includes(field)) return normalizeToxicologistResource({ ...normalized, contraptionParts: valueOf(value) });
  if (field === 'toxinVialsMax' || field === 'maxVials') return normalizeToxicologistResource({ ...normalized, toxinVialsMax: integer(value) });
  if (field === 'contraptionPartsMax') return normalizeToxicologistResource({ ...normalized, contraptionPartsMax: integer(value) });
  return normalizeToxicologistResource({ ...normalized, [field]: value });
}

export function getToxicologistSpellResourcePlan(spell, resource, resourceId) {
  const values = spell.resourceCost?.resourceValues || {};
  const generic = spell.resourceCost?.classResource ?? values.classResource ?? {};
  const genericEngine = resolveClassResourceEngineId(generic.type);
  const ownerPool = genericEngine === 'toxinVialsContraptions'
    ? (generic.type === 'contraption_parts' || generic.type === 'contraptionParts' ? 'parts' : 'vials') : null;
  const explicitVials = spell.vialsCost ?? values.vials_cost ?? spell.toxinVialsCost;
  const explicitParts = spell.contraptionPartsCost ?? values.contraption_parts_cost;
  const pool = explicitParts !== undefined ? 'parts' : explicitVials !== undefined ? 'vials' : ownerPool;
  if (!pool) return { handled: false };

  const normalized = normalizeToxicologistResource(resource || {});
  const current = getToxicologistPoolValue(normalized, pool);
  const cap = pool === 'parts' ? normalized.contraptionPartsMax : normalized.toxinVialsMax;
  const rawCost = pool === 'parts'
    ? (explicitParts ?? generic.cost)
    : (explicitVials ?? generic.cost);
  const all = typeof rawCost === 'string' && rawCost.toLowerCase() === 'all';
  const numericCost = rawCost === undefined || all ? 0 : Number(rawCost);
  const safeCost = Number.isFinite(numericCost) ? numericCost : 0;
  const cost = all ? current : Math.max(0, Math.trunc(safeCost));
  const valid = Number.isInteger(cost);

  return {
    handled: true, id: 'toxinVialsContraptions', label: pool === 'parts' ? 'Contraption Parts' : 'Vials',
    resourceKey: pool, pool, current, cap,
    cost: valid ? cost : 0, gain: 0,
    affordable: resourceId === 'toxinVialsContraptions' && valid && current >= cost && (!all || current > 0)
  };
}
