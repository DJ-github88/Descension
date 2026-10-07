import { resolveClassResourceEngineId } from './classResourceAliases';

// Blueprint §5.3 / C-07: Fervor is 0–100, kindled by martial/sacred actions.
// Harmonic Stance is the 50+ threshold; Solvan Judgment is the 100 spend.
// Fervor is Aex/relic-linked, not a Scathrach furnace resource.
export const CRUSADER_FERVOR_MAX = 100;
export const CRUSADER_HARMONIC_STANCE = 50;
export const CRUSADER_SOLVAN_JUDGMENT = 100;

export const CRUSADER_FERVOR_TIERS = Object.freeze([
  { name: 'Zeal', min: 0, max: 49 },
  { name: 'Harmonic Stance', min: 50, max: 99 },
  { name: 'Judgment Ready', min: 100, max: 100 }
]);

const valueOf = value => value && typeof value === 'object' ? value.current : value;
const integer = value => {
  if (!Number.isFinite(Number(value))) return 0;
  return Math.max(0, Math.min(CRUSADER_FERVOR_MAX, Math.trunc(Number(value))));
};

export function getCrusaderFervorTier(current) {
  const value = integer(current);
  return CRUSADER_FERVOR_TIERS.find(tier => value >= tier.min && value <= tier.max) ||
    CRUSADER_FERVOR_TIERS[CRUSADER_FERVOR_TIERS.length - 1];
}

export const isCrusaderHarmonicStance = current => integer(current) >= CRUSADER_HARMONIC_STANCE;
export const isCrusaderJudgmentReady = current => integer(current) >= CRUSADER_SOLVAN_JUDGMENT;

export function normalizeCrusaderResource(resource) {
  if (!resource) return resource;
  const current = integer(
    resource.current !== undefined ? valueOf(resource.current)
      : valueOf(resource?.fervor) ?? valueOf(resource?.radiantFervor) ?? 0
  );
  const mirror = old => old && typeof old === 'object' ? { ...old, current, max: CRUSADER_FERVOR_MAX } : current;
  return {
    ...resource, type: 'radiantFervor', current, max: CRUSADER_FERVOR_MAX,
    ...(resource.fervor !== undefined ? { fervor: mirror(resource.fervor) } : {}),
    ...(resource.radiantFervor !== undefined ? { radiantFervor: mirror(resource.radiantFervor) } : {}),
    harmonicStance: isCrusaderHarmonicStance(current),
    judgmentReady: isCrusaderJudgmentReady(current)
  };
}

export function updateCrusaderResource(resource, field, value) {
  const normalized = normalizeCrusaderResource(resource);
  if (['current', 'fervor', 'radiantFervor'].includes(field)) {
    return normalizeCrusaderResource({ ...normalized, current: valueOf(value) });
  }
  return normalizeCrusaderResource({ ...normalized, [field]: value });
}

export function getCrusaderSpellResourcePlan(spell, resource, resourceId) {
  const values = spell.resourceCost?.resourceValues || {};
  const generic = spell.resourceCost?.classResource ?? values.classResource ?? {};
  const genericOwner = resolveClassResourceEngineId(generic.type) === 'radiantFervor';
  const explicitCost = spell.fervorCost ?? values.fervor_cost;
  const explicitGain = spell.fervorGain ?? values.fervor_gain;
  const required = spell.fervorRequired ?? values.fervor_required ?? (genericOwner ? generic.required : undefined);
  const handled = explicitCost !== undefined || explicitGain !== undefined ||
    (genericOwner && (generic.cost !== undefined || generic.gain !== undefined || generic.required !== undefined));
  if (!handled) return { handled: false };

  const normalized = normalizeCrusaderResource(resource || {});
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
    handled: true, id: 'radiantFervor', label: 'Fervor', resourceKey: 'fervor', current: normalized.current,
    cost: valid ? cost : 0, gain: valid ? gain : 0, required: valid ? minimum : 0,
    harmonicStance: normalized.harmonicStance, judgmentReady: normalized.judgmentReady,
    affordable: resourceId === 'radiantFervor' && valid && normalized.current >= Math.max(cost, minimum) && (!all || normalized.current > 0)
  };
}
