import { resolveClassResourceEngineId } from './classResourceAliases';

export const SPELLGUARD_AEP_MAX = 100;
export const SPELLGUARD_INTAKE_MODES = Object.freeze(['containment', 'annulment', 'defusal', 'deflection', 'siphon']);
const whole = value => Number.isSafeInteger(value) && value >= 0;
const integer = value => Number.isFinite(Number(value)) ? Math.max(0, Math.min(SPELLGUARD_AEP_MAX, Math.trunc(Number(value)))) : 0;
const valueOf = value => value && typeof value === 'object' ? value.current : value;
const validReceipt = receipt => receipt && typeof receipt.id === 'string' && receipt.id.trim() && SPELLGUARD_INTAKE_MODES.includes(receipt.mode) &&
  ['incoming', 'captured', 'redirected', 'dissipated', 'banked', 'overflow'].every(key => whole(receipt[key])) &&
  receipt.incoming > 0 && receipt.captured > 0 && receipt.captured + receipt.redirected + receipt.dissipated === receipt.incoming &&
  receipt.banked + receipt.overflow === receipt.captured;

export function normalizeSpellguardResource(resource) {
  if (!resource) return resource;
  const current = integer(valueOf(resource.current) ?? valueOf(resource.aep) ?? valueOf(resource.arcaneEnergyPoints) ?? valueOf(resource.resonance));
  const ledger = resource.spellguardIntake || {};
  const source = Array.isArray(ledger.receipts) ? ledger.receipts : [];
  const seen = new Set();
  const receipts = source.filter(receipt => {
    if (!validReceipt(receipt) || seen.has(receipt.id)) return false;
    seen.add(receipt.id);
    return true;
  });
  const rejected = source.filter(receipt => !validReceipt(receipt));
  const totals = Object.fromEntries(['incoming', 'captured', 'redirected', 'dissipated', 'banked', 'overflow'].map(key =>
    [key, receipts.reduce((sum, receipt) => sum + receipt[key], 0)]));
  const mirror = old => old && typeof old === 'object' ? { ...old, current, max: SPELLGUARD_AEP_MAX } : current;
  return { ...resource, type: 'arcaneEnergyPoints', current, max: SPELLGUARD_AEP_MAX, aep: mirror(resource.aep),
    ...(resource.arcaneEnergyPoints !== undefined ? { arcaneEnergyPoints: mirror(resource.arcaneEnergyPoints) } : {}),
    ...(resource.resonance !== undefined ? { resonance: mirror(resource.resonance) } : {}),
    containmentBreachDue: current >= SPELLGUARD_AEP_MAX,
    spellguardIntake: { ...ledger, receipts, totals,
      ...(rejected.length ? { unrecognizedReceipts: [...(ledger.unrecognizedReceipts || []), ...rejected] } : {}) } };
}

export function updateSpellguardResource(resource, field, value) {
  const normalized = normalizeSpellguardResource(resource);
  if (['current', 'aep', 'arcaneEnergyPoints', 'resonance'].includes(field)) return normalizeSpellguardResource({ ...normalized, current: valueOf(value) });
  if (field === 'spellguardIntake') return normalizeSpellguardResource({ ...normalized, spellguardIntake: {
    ...normalized.spellguardIntake, ...value,
    receipts: [...normalized.spellguardIntake.receipts, ...(Array.isArray(value?.receipts) ? value.receipts : [])] } });
  return normalizeSpellguardResource({ ...normalized, [field]: value });
}

// Quantities are reported in AEP-equivalent units after resolution/conversion.
// This accounts for energy; it neither cancels damage nor invents yield ratios.
export function recordSpellguardIntake(resource, input) {
  const normalized = normalizeSpellguardResource(resource);
  const reject = reason => ({ accepted: false, reason, resource: normalized });
  if (!input || typeof input.id !== 'string' || !input.id.trim()) return reject('missing-receipt-id');
  if (!SPELLGUARD_INTAKE_MODES.includes(input.mode)) return reject('unknown-interface');
  if (normalized.spellguardIntake.receipts.some(receipt => receipt.id === input.id)) return reject('duplicate-receipt');
  const quantities = { incoming: Number(input.incoming), captured: Number(input.captured),
    redirected: Number(input.redirected ?? 0), dissipated: Number(input.dissipated ?? 0) };
  if (!Object.values(quantities).every(whole) || quantities.incoming <= 0 || quantities.captured <= 0) return reject('invalid-or-zero-residual');
  if (quantities.captured + quantities.redirected + quantities.dissipated !== quantities.incoming) return reject('unaccounted-energy');
  const banked = Math.min(quantities.captured, SPELLGUARD_AEP_MAX - normalized.current);
  const overflow = quantities.captured - banked;
  const receipt = { ...input, ...quantities, banked, overflow };
  return { accepted: true, banked, overflow, receipt, resource: normalizeSpellguardResource({ ...normalized,
    current: normalized.current + banked,
    spellguardIntake: { ...normalized.spellguardIntake, receipts: [...normalized.spellguardIntake.receipts, receipt] } }) };
}

export function getSpellguardSpellResourcePlan(spell, resource, resourceId) {
  const values = spell.resourceCost?.resourceValues || {};
  const generic = spell.resourceCost?.classResource ?? values.classResource ?? {};
  const genericOwner = resolveClassResourceEngineId(generic.type) === 'arcaneEnergyPoints';
  const explicitCost = spell.aepCost ?? values.aep_cost;
  const explicitGain = spell.aepGain ?? values.aep_gain;
  const minimum = spell.aepRequired ?? values.aep_required ?? (genericOwner ? generic.required : undefined);
  const handled = [explicitCost, explicitGain, minimum].some(value => value !== undefined) ||
    (genericOwner && (generic.cost !== undefined || generic.gain !== undefined));
  if (!handled) return { handled: false };
  const normalized = normalizeSpellguardResource(resource || {});
  const rawCost = explicitCost ?? (genericOwner ? generic.cost ?? 0 : 0);
  const all = typeof rawCost === 'string' && rawCost.toLowerCase() === 'all';
  const signedCost = all ? normalized.current : Number(rawCost);
  const cost = Math.max(0, signedCost);
  const gain = Number(explicitGain ?? (genericOwner ? generic.gain ?? Math.max(0, -signedCost) : 0));
  const required = Number(minimum ?? 0);
  const valid = [cost, gain, required].every(whole);
  return { handled: true, id: 'arcaneEnergyPoints', label: 'AEP', resourceKey: 'aep',
    current: normalized.current, cost: valid ? cost : 0, gain: valid ? gain : 0, required: valid ? required : 0,
    affordable: resourceId === 'arcaneEnergyPoints' && valid && normalized.current >= Math.max(cost, required) && (!all || normalized.current > 0) };
}
