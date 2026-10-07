import { resolveClassResourceEngineId } from './classResourceAliases';

export const INQUISITOR_AUTHORITY_MAX = 8;
const valueOf = value => value && typeof value === 'object' ? value.current : value;
const integer = value => Number.isFinite(Number(value)) ? Math.max(0, Math.min(INQUISITOR_AUTHORITY_MAX, Math.trunc(Number(value)))) : 0;

export function normalizeInquisitorResource(resource) {
  if (!resource) return resource;
  const current = integer(valueOf(resource.current) ?? valueOf(resource.authority) ?? valueOf(resource.righteousAuthority));
  const mirror = old => old && typeof old === 'object' ? { ...old, current, max: INQUISITOR_AUTHORITY_MAX } : current;
  const aura = resource.nullAura && typeof resource.nullAura === 'object' ? resource.nullAura : {};
  return { ...resource, type: 'authority', current, max: INQUISITOR_AUTHORITY_MAX, authority: mirror(resource.authority),
    ...(resource.righteousAuthority !== undefined ? { righteousAuthority: mirror(resource.righteousAuthority) } : {}),
    nullAura: { ...aura, active: aura.active === true && current > 0, scope: 'foreign-magical-assistance' } };
}

export function updateInquisitorResource(resource, field, value) {
  const normalized = normalizeInquisitorResource(resource);
  if (['current', 'authority', 'righteousAuthority'].includes(field)) return normalizeInquisitorResource({ ...normalized, current: valueOf(value) });
  if (field === 'nullAura') return normalizeInquisitorResource({ ...normalized, nullAura: { ...normalized.nullAura, ...value } });
  return normalizeInquisitorResource({ ...normalized, [field]: value });
}

export function getInquisitorSpellResourcePlan(spell, resource, resourceId) {
  const values = spell.resourceCost?.resourceValues || {};
  const generic = spell.resourceCost?.classResource ?? values.classResource ?? {};
  const genericOwner = resolveClassResourceEngineId(generic.type) === 'authority';
  const explicitCost = spell.authorityCost ?? values.authority_cost;
  const explicitGain = spell.authorityGain ?? values.authority_gain;
  const required = spell.authorityRequired ?? values.authority_required ?? (genericOwner ? generic.required : undefined);
  const handled = [explicitCost, explicitGain, required].some(value => value !== undefined) ||
    (genericOwner && (generic.cost !== undefined || generic.gain !== undefined));
  if (!handled) return { handled: false };
  const normalized = normalizeInquisitorResource(resource || {});
  const rawCost = explicitCost ?? (genericOwner ? generic.cost ?? 0 : 0);
  const all = typeof rawCost === 'string' && rawCost.toLowerCase() === 'all';
  const signedCost = all ? normalized.current : Number(rawCost);
  const cost = Math.max(0, signedCost);
  const gain = Number(explicitGain ?? (genericOwner ? generic.gain ?? Math.max(0, -signedCost) : 0));
  const minimum = Number(required ?? 0);
  const valid = [cost, gain, minimum].every(value => Number.isSafeInteger(value) && value >= 0);
  return { handled: true, id: 'authority', label: 'Authority', resourceKey: 'authority', current: normalized.current,
    cost: valid ? cost : 0, gain: valid ? gain : 0, required: valid ? minimum : 0,
    affordable: resourceId === 'authority' && valid && normalized.current >= Math.max(cost, minimum) && (!all || normalized.current > 0) };
}

// Unknown legacy provenance is not invented. This policy suppresses known
// foreign magical assistance, not self-originating authority, harm, or treatment.
export function getInquisitorAssistanceDecision(recipient, effect = {}) {
  const className = String(recipient?.class || '').replace(/\s*\([^)]*\)\s*$/, '').trim().toLowerCase();
  if (className !== 'inquisitor') return { suppressed: false, reason: 'not-inquisitor' };
  const resource = normalizeInquisitorResource(recipient.classResource || {});
  if (!resource.nullAura.active) return { suppressed: false, reason: 'aura-inactive' };
  const kind = effect.kind ?? effect.overTimeType ?? effect.type;
  if (!['buff', 'healing', 'mana_regen', 'enhancement'].includes(kind)) return { suppressed: false, reason: 'not-assistance' };
  const magical = effect.isMagical ?? effect.magical ?? (effect.source === 'spell' ? true : undefined);
  if (magical !== true) return { suppressed: false, reason: magical === false ? 'nonmagical-treatment' : 'unknown-magic-provenance' };
  const identities = [recipient.id, recipient.currentCharacterId, ...(recipient.assistanceIdentityIds || [])].filter(Boolean);
  const sourceId = effect.sourceEntityId ?? effect.sourceId ?? effect.casterId;
  if (effect.effectOrigin === 'self' || (effect.effectOrigin !== 'foreign' && sourceId && identities.includes(sourceId))) return { suppressed: false, reason: 'self-origin' };
  const foreign = effect.effectOrigin === 'foreign' || (sourceId && identities.length > 0 && !identities.includes(sourceId));
  if (!foreign) return { suppressed: false, reason: 'unknown-origin' };
  return { suppressed: true, reason: 'active-null-aura-foreign-magical-assistance' };
}
