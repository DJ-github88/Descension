import { resolveClassResourceEngineId } from './classResourceAliases';

export const SHAPER_FLUX_MAX = 20;
export const SHAPER_TOLL_MAX = 10;
export const SHAPER_FORMS = Object.freeze([
  { id: 'ataxic_flow', name: 'Ataxic Flow', fluxCost: 2, tollCost: 1 },
  { id: 'arterial_strike', name: 'Arterial Strike', fluxCost: 2, tollCost: 1 },
  { id: 'centrifugal_fury', name: 'Centrifugal Fury', fluxCost: 3, tollCost: 1 },
  { id: 'deadened_bastion', name: 'Deadened Bastion', fluxCost: 2, tollCost: 1 },
  { id: 'fluid_apex', name: 'Fluid Apex', fluxCost: 4, tollCost: 2 },
  { id: 'silence_predator', name: 'Silence Predator', fluxCost: 3, tollCost: 1 }
]);
export const BODY_TOLL_TIERS = Object.freeze([
  { min: 0, max: 2, name: 'Supple Clay', color: '#10b981', glow: '#34d399', desc: 'Cellular cohesion stable. No threshold penalty.' },
  { min: 3, max: 4, name: 'Joint Lock', color: '#f59e0b', glow: '#fbbf24', desc: 'Joint-lock risk; movement penalties require effect resolution.' },
  { min: 5, max: 6, name: 'Identity Erosion', color: '#ec4899', glow: '#f472b6', desc: 'Speech/identity erosion risk; this is strain, not a reward.' },
  { min: 7, max: 9, name: 'Feral Mutation', color: '#ef4444', glow: '#f87171', desc: 'Feral loss-of-restraint risk. No damage bonus is applied by the tracker.' },
  { min: 10, max: 10, name: 'Unraveling', color: '#dc2626', glow: '#f43f5e', desc: 'Control/handoff consequence due; penalties and control transfer require resolution.' }
]);

const valueOf = value => value && typeof value === 'object' ? value.current : value;
const integer = (value, max) => Number.isFinite(Number(value)) ? Math.max(0, Math.min(max, Math.trunc(Number(value)))) : 0;
const slug = value => String(value || '').trim().toLowerCase().replace(/[\s-]+/g, '_');
export const getShaperForm = value => SHAPER_FORMS.find(form => slug(value) === form.id);
export const resolveShaperFormName = value => getShaperForm(value)?.name || String(value || 'Ataxic Flow').trim();
export const getBodyTollTier = value => BODY_TOLL_TIERS.find(tier => integer(value, SHAPER_TOLL_MAX) <= tier.max);
export const isShaperTollKey = key => ['body_toll', 'bodyToll', 'toll', 'flourish'].includes(key);

const mirror = (old, current, max) => old && typeof old === 'object' && !Array.isArray(old)
  ? { ...old, current, max } : old !== undefined && old !== null ? current : { current, max };

export function normalizeShaperResource(resource) {
  if (!resource) return resource;
  // Generic spending has historically updated current; prefer it over a stale
  // display alias so normalization cannot resurrect already-spent Flux.
  const flux = integer(valueOf(resource.current) ?? valueOf(resource.flux) ?? valueOf(resource.momentum), SHAPER_FLUX_MAX);
  const bodyToll = integer(valueOf(resource.bodyToll) ?? valueOf(resource.toll) ?? valueOf(resource.flourish), SHAPER_TOLL_MAX);
  const stance = resolveShaperFormName(valueOf(resource.stance) ?? resource.currentStance);
  return { ...resource, type: 'kineticFluxBodyToll', current: flux, max: SHAPER_FLUX_MAX, flux,
    momentum: mirror(resource.momentum, flux, SHAPER_FLUX_MAX), bodyToll, toll: bodyToll,
    flourish: mirror(resource.flourish, bodyToll, SHAPER_TOLL_MAX), maxBodyToll: SHAPER_TOLL_MAX,
    stance: resource.stance && typeof resource.stance === 'object' ? { ...resource.stance, current: stance } : stance,
    ...(resource.currentStance !== undefined ? { currentStance: stance } : {}),
    bodyTollKind: 'risk', bodyTollTier: getBodyTollTier(bodyToll).name, controlHandoffDue: bodyToll >= SHAPER_TOLL_MAX };
}

export function updateShaperResource(resource, field, value) {
  const normalized = normalizeShaperResource(resource);
  if (['current', 'flux', 'momentum'].includes(field)) return normalizeShaperResource({ ...normalized, current: valueOf(value) });
  if (isShaperTollKey(field)) return normalizeShaperResource({ ...normalized, bodyToll: valueOf(value),
    ...(field === 'flourish' && value && typeof value === 'object' ? { flourish: value } : {}) });
  if (['stance', 'currentStance'].includes(field)) return normalizeShaperResource({ ...normalized, stance:
    normalized.stance && typeof normalized.stance === 'object' ? { ...normalized.stance,
      ...(value && typeof value === 'object' ? value : { current: value }) } : value });
  return normalizeShaperResource({ ...normalized, [field]: value });
}

// Add the authored form spell's structured target/strain data, not a prose parser.
export function addShaperFormContract(spell) {
  const form = SHAPER_FORMS.find(candidate => spell.id === `shaper_stance_${candidate.id}`);
  return form ? { ...spell, shaperFormTarget: form.name, bodyTollCost: spell.bodyTollCost ?? form.tollCost } : spell;
}

export function getShaperSpellResourcePlan(spell, resource, resourceId) {
  const values = spell.resourceCost?.resourceValues || {};
  const generic = spell.resourceCost?.classResource ?? values.classResource ?? {};
  const owned = resourceId === 'kineticFluxBodyToll';
  const genericOwner = resolveClassResourceEngineId(generic.type) === 'kineticFluxBodyToll' || (owned && generic.type === 'toll');
  const tollGeneric = genericOwner && isShaperTollKey(generic.type);
  const fluxCost = spell.fluxCost ?? values.flux_cost;
  const fluxGain = spell.fluxGain ?? values.flux_gain ?? values.flux_generate;
  const tollCost = spell.bodyTollCost ?? spell.bodyTollGenerated ?? spell.bodyTollGain ?? values.body_toll_cost ?? values.body_toll_gain;
  const tollReduction = spell.bodyTollReduction ?? spell.bodyTollReduce ?? values.body_toll_reduce;
  const target = spell.shaperFormTarget;
  const handled = (genericOwner && (generic.cost !== undefined || generic.gain !== undefined)) ||
    [fluxCost, fluxGain, tollCost, tollReduction, target, spell.formRequirement].some(value => value !== undefined);
  if (!handled) return { handled: false };
  const normalized = normalizeShaperResource(resource || {});
  const all = typeof (fluxCost ?? generic.cost) === 'string' && String(fluxCost ?? generic.cost).toLowerCase() === 'all' && !tollGeneric;
  const rawCost = fluxCost ?? (!tollGeneric && genericOwner ? generic.cost ?? 0 : 0);
  const numericCost = all ? normalized.current : Number(rawCost);
  const cost = Math.max(0, numericCost);
  const gain = Number(fluxGain ?? (!tollGeneric && genericOwner ? generic.gain ?? Math.max(0, -numericCost) : 0));
  const genericToll = Number(tollGeneric ? generic.cost ?? generic.gain ?? 0 : 0);
  const addedToll = Number(tollCost ?? Math.max(0, genericToll));
  const reducedToll = Number(tollReduction ?? Math.max(0, -genericToll));
  const valid = [cost, gain, addedToll, reducedToll].every(value => Number.isInteger(value) && value >= 0);
  const currentForm = valueOf(normalized.stance);
  const requiredForm = spell.formRequirement !== undefined ? resolveShaperFormName(spell.formRequirement) : null;
  const targetForm = target !== undefined ? getShaperForm(target) : null;
  const formMatches = !requiredForm || slug(requiredForm) === slug(currentForm);
  const canAdopt = target === undefined || (targetForm && targetForm.name !== currentForm);
  let nextResource = normalized;
  if (valid) {
    nextResource = updateShaperResource(nextResource, 'current', normalized.current - cost + gain);
    nextResource = updateShaperResource(nextResource, 'bodyToll', normalized.bodyToll + addedToll - reducedToll);
    if (targetForm) nextResource = updateShaperResource(nextResource, 'stance', targetForm.name);
  }
  return { handled: true, id: 'kineticFluxBodyToll', transition: 'shaper', label: 'Flux', current: normalized.current,
    cost: valid ? cost : 0, gain: valid ? gain : 0, required: 0, addedToll: valid ? addedToll : 0,
    reducedToll: valid ? reducedToll : 0, nextResource, targetForm: targetForm?.name,
    affordable: owned && valid && normalized.current >= cost && (!all || normalized.current > 0) && formMatches && !!canAdopt,
    ...(!formMatches ? { reason: `Requires ${requiredForm}` } : !canAdopt ? { reason: targetForm ? 'Already in this form' : 'Unknown Shaping Form' } : {}) };
}

export function getShaperFormAdoptionPlan(resource, target) {
  const form = getShaperForm(target);
  return getShaperSpellResourcePlan({ shaperFormTarget: target,
    fluxCost: form?.fluxCost ?? 0, bodyTollCost: form?.tollCost ?? 0 }, resource, 'kineticFluxBodyToll');
}
