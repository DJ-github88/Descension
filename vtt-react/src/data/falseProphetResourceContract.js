import { resolveClassResourceEngineId } from './classResourceAliases';

// Blueprint §5.3 / C-08: Madness 0–20. The power is a real psychic channel;
// belief is not a species-creation engine. Insanity Convulsion at 20 is an
// encounter table, not an automatic reset performed here.
export const FALSE_PROPHET_MADNESS_MAX = 20;
export const FALSE_PROPHET_CONVULSION = 20;

export const FALSE_PROPHET_MADNESS_THRESHOLDS = Object.freeze([
  { value: 6, name: 'Veil of Shadows' },
  { value: 9, name: 'Wyrd-touched Vision' },
  { value: 10, name: 'Eldritch Empowerment' },
  { value: 12, name: 'Apocalyptic Revelation' },
  { value: 15, name: 'Danger Zone' },
  { value: 20, name: 'Insanity Convulsion' }
]);

const valueOf = value => value && typeof value === 'object' ? value.current : value;
const finite = value => Number.isFinite(Number(value)) ? Number(value) : 0;
const integer = value => Math.trunc(finite(value));
const clamp = (value, max) => Math.max(0, Math.min(max, integer(value)));
const isDice = value => typeof value === 'string' && /\d*\s*d\s*\d+/i.test(value);

export const isFalseProphetConvulsion = current => clamp(current, FALSE_PROPHET_MADNESS_MAX) >= FALSE_PROPHET_CONVULSION;

export function getFalseProphetThreshold(current) {
  const value = clamp(current, FALSE_PROPHET_MADNESS_MAX);
  return FALSE_PROPHET_MADNESS_THRESHOLDS.filter(threshold => value >= threshold.value).pop() || null;
}

export function normalizeFalseProphetResource(resource) {
  if (!resource) return resource;
  const current = clamp(
    resource.current !== undefined ? valueOf(resource.current)
      : valueOf(resource?.madness) ?? valueOf(resource?.madnessPoints) ?? 0,
    FALSE_PROPHET_MADNESS_MAX
  );
  const mirror = old => old && typeof old === 'object' ? { ...old, current, max: FALSE_PROPHET_MADNESS_MAX } : current;
  return {
    ...resource, type: 'madnessPoints', current, max: FALSE_PROPHET_MADNESS_MAX,
    ...(resource.madness !== undefined ? { madness: mirror(resource.madness) } : {}),
    ...(resource.madnessPoints !== undefined ? { madnessPoints: mirror(resource.madnessPoints) } : {}),
    convulsion: isFalseProphetConvulsion(current)
  };
}

export function updateFalseProphetResource(resource, field, value) {
  const normalized = normalizeFalseProphetResource(resource);
  if (['current', 'madness', 'madnessPoints'].includes(field)) {
    return normalizeFalseProphetResource({ ...normalized, current: valueOf(value) });
  }
  return normalizeFalseProphetResource({ ...normalized, [field]: value });
}

// Madness spells use dice for both generation and spend. Dice are deferred to
// the table: they are flagged but never converted to a fixed numeric amount.
export function getFalseProphetSpellResourcePlan(spell, resource, resourceId) {
  const values = spell.resourceCost?.resourceValues || {};
  const generic = spell.resourceCost?.classResource ?? values.classResource ?? {};
  const genericOwner = resolveClassResourceEngineId(generic.type) === 'madnessPoints';
  const explicitCost = spell.madnessCost ?? values.madness_cost;
  const explicitGain = spell.madnessGain ?? values.madness_gain;
  const handled = explicitCost !== undefined || explicitGain !== undefined ||
    (genericOwner && (generic.cost !== undefined || generic.gain !== undefined));
  if (!handled) return { handled: false };

  const normalized = normalizeFalseProphetResource(resource || {});
  const rawCost = explicitCost ?? (genericOwner ? generic.cost : undefined);
  const rawGain = explicitGain ?? (genericOwner ? generic.gain : undefined);
  const all = typeof rawCost === 'string' && rawCost.toLowerCase() === 'all';
  const dice = isDice(rawCost) || isDice(rawGain);
  const numericCost = rawCost === undefined || all || isDice(rawCost) ? 0 : Number(rawCost);
  const safeCost = Number.isFinite(numericCost) ? numericCost : 0;
  const cost = dice || all ? (all ? normalized.current : 0) : Math.max(0, Math.trunc(safeCost));
  const generatedByNegativeCost = !all && !dice && safeCost < 0 ? Math.trunc(-safeCost) : 0;
  const numericGain = isDice(rawGain) ? 0 : Number(rawGain ?? 0);
  const gain = Math.max(0, Math.trunc(Number.isFinite(numericGain) ? numericGain : 0)) + generatedByNegativeCost;
  const valid = Number.isInteger(cost) && Number.isInteger(gain);

  return {
    handled: true, id: 'madnessPoints', label: 'Madness', resourceKey: 'madness', current: normalized.current,
    cost: valid ? cost : 0, gain: valid ? gain : 0, dice,
    convulsion: normalized.convulsion,
    affordable: resourceId === 'madnessPoints' && valid && (dice || normalized.current >= cost) && (!all || normalized.current > 0)
  };
}
