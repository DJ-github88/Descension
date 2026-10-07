import { resolveClassResourceEngineId } from './classResourceAliases';

// Blueprint §5.3 / C-01: Resonance 0–20. Spirit Erosion is the 15+ band; the
// anchor-network toll is a condition, not an automatic damage engine.
export const ANIMIST_RESONANCE_MAX = 20;
export const ANIMIST_SPIRIT_EROSION = 15;

export const ANIMIST_RESONANCE_STAGES = Object.freeze([
  { name: 'Dormant', min: 0, max: 4 },
  { name: 'Harmonized', min: 5, max: 9 },
  { name: 'Apex Harmonic', min: 10, max: 14 },
  { name: 'Spirit Erosion', min: 15, max: 20, erosion: true }
]);

const valueOf = value => value && typeof value === 'object' ? value.current : value;
const finite = value => Number.isFinite(Number(value)) ? Number(value) : 0;
const integer = value => Math.trunc(finite(value));
const clamp = (value, max) => Math.max(0, Math.min(max, integer(value)));

export function getAnimistStage(current) {
  const value = clamp(current, ANIMIST_RESONANCE_MAX);
  return ANIMIST_RESONANCE_STAGES.find(stage => value >= stage.min && value <= stage.max) ||
    ANIMIST_RESONANCE_STAGES[ANIMIST_RESONANCE_STAGES.length - 1];
}

export const isAnimistSpiritErosion = current => clamp(current, ANIMIST_RESONANCE_MAX) >= ANIMIST_SPIRIT_EROSION;

export function normalizeAnimistResource(resource) {
  if (!resource) return resource;
  const current = clamp(
    resource.current !== undefined ? valueOf(resource.current)
      : valueOf(resource?.resonance) ?? valueOf(resource?.ancestralResonance) ?? 0,
    ANIMIST_RESONANCE_MAX
  );
  const mirror = old => old && typeof old === 'object' ? { ...old, current, max: ANIMIST_RESONANCE_MAX } : current;
  return {
    ...resource, type: 'ancestralResonance', current, max: ANIMIST_RESONANCE_MAX,
    ...(resource.resonance !== undefined ? { resonance: mirror(resource.resonance) } : {}),
    ...(resource.ancestralResonance !== undefined ? { ancestralResonance: mirror(resource.ancestralResonance) } : {}),
    spiritErosion: isAnimistSpiritErosion(current)
  };
}

export function updateAnimistResource(resource, field, value) {
  const normalized = normalizeAnimistResource(resource);
  if (['current', 'resonance', 'ancestralResonance'].includes(field)) {
    return normalizeAnimistResource({ ...normalized, current: valueOf(value) });
  }
  return normalizeAnimistResource({ ...normalized, [field]: value });
}

export function getAnimistSpellResourcePlan(spell, resource, resourceId) {
  const values = spell.resourceCost?.resourceValues || {};
  const generic = spell.resourceCost?.classResource ?? values.classResource ?? {};
  const genericOwner = resolveClassResourceEngineId(generic.type) === 'ancestralResonance';
  const explicitCost = spell.resonanceCost ?? values.resonance_cost;
  const explicitGain = spell.resonanceGain ?? values.resonance_gain;
  const required = spell.resonanceRequired ?? values.resonance_required ?? (genericOwner ? generic.required : undefined);
  const handled = explicitCost !== undefined || explicitGain !== undefined ||
    (genericOwner && (generic.cost !== undefined || generic.gain !== undefined || generic.required !== undefined));
  if (!handled) return { handled: false };

  const normalized = normalizeAnimistResource(resource || {});
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
    handled: true, id: 'ancestralResonance', label: 'Resonance', resourceKey: 'resonance', current: normalized.current,
    cost: valid ? cost : 0, gain: valid ? gain : 0, required: valid ? minimum : 0,
    spiritErosion: normalized.spiritErosion,
    affordable: resourceId === 'ancestralResonance' && valid && normalized.current >= Math.max(cost, minimum) && (!all || normalized.current > 0)
  };
}
