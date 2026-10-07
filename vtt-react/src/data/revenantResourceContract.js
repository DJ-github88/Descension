import { resolveClassResourceEngineId } from './classResourceAliases';

// Blueprint §5.3 / C-17: Death-Toll plus a finite phylactery reserve/integrity.
// The anchor medium differs per heritage but the reserve is always finite; no
// geography-sized unlimited resurrection is modeled here.
export const REVENANT_TOLL_MAX = 20;
export const REVENANT_PHYLACTERY_MAX = 50;

export const REVENANT_TOLL_TIERS = Object.freeze([
  { name: 'Stasis', min: 0, max: 5 },
  { name: 'Searing', min: 6, max: 10 },
  { name: 'Rot Surge', min: 11, max: 15 },
  { name: 'Cataclysm', min: 16, max: 20 }
]);

const valueOf = value => value && typeof value === 'object' ? value.current : value;
const finite = value => Number.isFinite(Number(value)) ? Number(value) : 0;
const integer = value => Math.trunc(finite(value));
const clamp = (value, max) => Math.max(0, Math.min(max, integer(value)));

export function getRevenantTollTier(toll) {
  const value = clamp(toll, REVENANT_TOLL_MAX);
  return REVENANT_TOLL_TIERS.find(tier => value >= tier.min && value <= tier.max) ||
    REVENANT_TOLL_TIERS[REVENANT_TOLL_TIERS.length - 1];
}

export const isRevenantCataclysm = toll => clamp(toll, REVENANT_TOLL_MAX) >= 16;

export function getRevenantMaxToll(resource = {}) {
  const max = integer(resource?.maxToll);
  return max > 0 ? max : REVENANT_TOLL_MAX;
}

export function getRevenantMaxPhylactery(resource = {}) {
  const max = integer(resource?.maxPhylacteryHP);
  return max > 0 ? max : REVENANT_PHYLACTERY_MAX;
}

export function getRevenantPoolValue(resource = {}, resourceKey) {
  const key = String(resourceKey || '').toLowerCase();
  if (key === 'phylactery' || key === 'phylacteryhp' || key === 'phylactery_integrity' || key === 'souls') {
    return finite(resource?.phylacteryHP ?? valueOf(resource?.phylactery));
  }
  return finite(resource?.toll ?? resource?.current ?? resource?.deathToll);
}

export function normalizeRevenantResource(resource) {
  if (!resource) return resource;
  const maxToll = getRevenantMaxToll(resource);
  const maxPhylacteryHP = getRevenantMaxPhylactery(resource);
  const toll = clamp(resource.toll ?? resource.current ?? resource.deathToll, maxToll);
  const rawPhylactery = resource.phylacteryHP ?? valueOf(resource.phylactery);
  const phylacteryHP = rawPhylactery === undefined || rawPhylactery === null
    ? maxPhylacteryHP : clamp(rawPhylactery, maxPhylacteryHP);
  const tollMirror = old => old && typeof old === 'object' ? { ...old, current: toll, max: maxToll } : toll;
  return {
    ...resource, type: 'revenant-toll', toll, current: toll, deathToll: toll,
    maxToll, ...(resource.toll !== undefined ? { toll: tollMirror(resource.toll) } : { toll }),
    phylacteryHP, maxPhylacteryHP,
    ...(resource.phylactery !== undefined ? { phylactery: { ...(resource.phylactery && typeof resource.phylactery === 'object' ? resource.phylactery : {}), current: phylacteryHP, max: maxPhylacteryHP } } : {}),
    deathShroud: resource.deathShroud === true,
    bloodTokens: finite(resource.bloodTokens)
  };
}

export function updateRevenantResource(resource, field, value) {
  const normalized = normalizeRevenantResource(resource);
  if (['toll', 'current', 'deathToll'].includes(field)) return normalizeRevenantResource({ ...normalized, toll: value });
  if (['phylacteryHP', 'phylactery', 'phylactery_integrity'].includes(field)) return normalizeRevenantResource({ ...normalized, phylacteryHP: valueOf(value) });
  if (field === 'deathShroud') return normalizeRevenantResource({ ...normalized, deathShroud: value === true });
  if (field === 'maxToll') return normalizeRevenantResource({ ...normalized, maxToll: integer(value) });
  if (field === 'maxPhylacteryHP') return normalizeRevenantResource({ ...normalized, maxPhylacteryHP: integer(value) });
  return normalizeRevenantResource({ ...normalized, [field]: value });
}

export function getRevenantSpellResourcePlan(spell, resource, resourceId) {
  const values = spell.resourceCost?.resourceValues || {};
  const generic = spell.resourceCost?.classResource ?? values.classResource ?? {};
  const genericEngine = resolveClassResourceEngineId(generic.type);
  const ownerPool = genericEngine === 'revenant-toll'
    ? (generic.type === 'phylactery' || generic.type === 'souls' ? 'phylactery' : 'toll') : null;
  const explicitToll = spell.tollCost ?? spell.tollGain ?? values.toll_cost ?? values.toll_gain;
  const explicitPhylactery = spell.phylacteryCost ?? spell.phylacteryGain ?? values.phylactery_cost ?? values.phylactery_gain;
  const pool = explicitPhylactery !== undefined ? 'phylactery' : explicitToll !== undefined ? 'toll' : ownerPool;
  if (!pool) return { handled: false };

  const normalized = normalizeRevenantResource(resource || {});
  const current = getRevenantPoolValue(normalized, pool);
  const cap = pool === 'phylactery' ? normalized.maxPhylacteryHP : normalized.maxToll;
  const rawCost = pool === 'phylactery'
    ? (spell.phylacteryCost ?? values.phylactery_cost ?? (ownerPool === 'phylactery' ? generic.cost : undefined))
    : (spell.tollCost ?? values.toll_cost ?? (ownerPool === 'toll' ? generic.cost : undefined));
  const all = typeof rawCost === 'string' && rawCost.toLowerCase() === 'all';
  const numericCost = rawCost === undefined || all ? 0 : Number(rawCost);
  const safeCost = Number.isFinite(numericCost) ? numericCost : 0;
  const cost = all ? current : Math.max(0, Math.trunc(safeCost));
  const generatedByNegativeCost = !all && safeCost < 0 ? Math.trunc(-safeCost) : 0;
  const rawGain = pool === 'phylactery'
    ? (spell.phylacteryGain ?? values.phylactery_gain ?? (ownerPool === 'phylactery' ? generic.gain : undefined))
    : (spell.tollGain ?? values.toll_gain ?? (ownerPool === 'toll' ? generic.gain : undefined));
  const gain = Math.max(0, Math.trunc(finite(rawGain))) + generatedByNegativeCost;
  const valid = Number.isInteger(cost) && Number.isInteger(gain);

  return {
    handled: true, id: 'revenant-toll', label: pool === 'phylactery' ? 'Phylactery' : 'Death-Toll',
    resourceKey: pool, pool, current, cap,
    cost: valid ? cost : 0, gain: valid ? gain : 0,
    // A cost above the finite cap is reported, never rescaled; it stays unaffordable.
    affordable: resourceId === 'revenant-toll' && valid && current >= cost && (!all || current > 0)
  };
}
