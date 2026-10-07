import { resolveClassResourceEngineId } from './classResourceAliases';

// Blueprint §5.3: Rage/Heat core runs through 100; Overheat begins beyond the
// normal band. The extended overdrive states are reachable and must not be
// clamped away or auto-collapsed at 100. Burnout is an encounter consequence
// (2d6 + reset + stun), so this contract only reports the overheat marker.
export const BERSERKER_RAGE_MAX = 100;
export const BERSERKER_OVERHEAT_THRESHOLD = 101;
export const BERSERKER_RAGE_EXTENDED_MAX = 150;

export const BERSERKER_RAGE_STATES = Object.freeze([
  { name: 'Smoldering', min: 0, max: 20 },
  { name: 'Frenzied', min: 21, max: 40 },
  { name: 'Primal', min: 41, max: 60 },
  { name: 'Carnage', min: 61, max: 80 },
  { name: 'Cataclysm', min: 81, max: 100 },
  { name: 'Obliteration', min: 101, max: 124, overheated: true },
  { name: 'Annihilation', min: 125, max: 149, overheated: true },
  { name: 'Apocalypse', min: 150, max: Infinity, overheated: true }
]);

const valueOf = value => value && typeof value === 'object' ? value.current : value;
const integer = value => {
  if (!Number.isFinite(Number(value))) return 0;
  return Math.max(0, Math.min(BERSERKER_RAGE_EXTENDED_MAX, Math.trunc(Number(value))));
};

export function getBerserkerRageState(current) {
  const value = integer(current);
  return BERSERKER_RAGE_STATES.find(state => value >= state.min && value <= state.max) ||
    BERSERKER_RAGE_STATES[BERSERKER_RAGE_STATES.length - 1];
}

export function isBerserkerOverheated(current) {
  return integer(current) >= BERSERKER_OVERHEAT_THRESHOLD;
}

export function normalizeBerserkerResource(resource) {
  if (!resource) return resource;
  const current = integer(
    resource.current !== undefined ? valueOf(resource.current)
      : valueOf(resource?.rage) ?? valueOf(resource?.bloodHeat) ?? 0
  );
  const mirror = old => old && typeof old === 'object' ? { ...old, current, max: BERSERKER_RAGE_MAX } : current;
  return {
    ...resource, type: 'bloodHeat', current, max: BERSERKER_RAGE_MAX,
    ...(resource.rage !== undefined ? { rage: mirror(resource.rage) } : {}),
    ...(resource.bloodHeat !== undefined ? { bloodHeat: mirror(resource.bloodHeat) } : {}),
    overheated: isBerserkerOverheated(current)
  };
}

export function updateBerserkerResource(resource, field, value) {
  const normalized = normalizeBerserkerResource(resource);
  if (['current', 'rage', 'bloodHeat'].includes(field)) {
    return normalizeBerserkerResource({ ...normalized, current: valueOf(value) });
  }
  return normalizeBerserkerResource({ ...normalized, [field]: value });
}

// Fixed numeric costs/gains come from the class data; dice generation is not
// inferred from prose. A negative cost keeps the existing data encoding where
// negative means generation (e.g. Hemorrhagic Strike cost: -6).
export function getBerserkerSpellResourcePlan(spell, resource, resourceId) {
  const values = spell.resourceCost?.resourceValues || {};
  const generic = spell.resourceCost?.classResource ?? values.classResource ?? {};
  const genericOwner = resolveClassResourceEngineId(generic.type) === 'bloodHeat';
  const explicitCost = spell.rageCost ?? values.rage_cost;
  const explicitGain = spell.rageGain ?? values.rage_gain;
  const required = spell.rageRequired ?? values.rage_required ?? (genericOwner ? generic.required : undefined);
  const handled = explicitCost !== undefined || explicitGain !== undefined ||
    (genericOwner && (generic.cost !== undefined || generic.gain !== undefined || generic.required !== undefined));
  if (!handled) return { handled: false };

  const normalized = normalizeBerserkerResource(resource || {});
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
    handled: true, id: 'bloodHeat', label: 'Rage', resourceKey: 'rage', current: normalized.current,
    cost: valid ? cost : 0, gain: valid ? gain : 0, required: valid ? minimum : 0,
    overheated: normalized.overheated,
    affordable: resourceId === 'bloodHeat' && valid && normalized.current >= Math.max(cost, minimum) && (!all || normalized.current > 0)
  };
}
