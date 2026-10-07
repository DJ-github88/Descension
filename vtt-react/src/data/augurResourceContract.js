// Blueprint §5.3 / C-04: Benediction/Malediction dual pools with defined spec
// caps. Auspex is the canonical display/spec spelling. Omen Debt is a long-rest
// ledger of unused points, distinct from narrative prophecy accuracy.
export const AUGUR_DEFAULT_MAX = 10;
export const AUGUR_OMEN_DEBT_MAX = 10;

export const AUGUR_SPEC_CAPS = Object.freeze({
  auspex: { benediction: 10, malediction: 10 },
  harbinger: { benediction: 5, malediction: 15 },
  hierophant: { benediction: 15, malediction: 5 }
});

export const AUGUR_POOLS = Object.freeze(['benediction', 'malediction']);

const finite = value => Number.isFinite(Number(value)) ? Number(value) : 0;
const integer = value => Math.trunc(finite(value));
const clamp = (value, max) => Math.max(0, Math.min(max, integer(value)));

export function getAugurCaps(resource = {}) {
  const spec = resource?.specialization || 'auspex';
  if (AUGUR_SPEC_CAPS[spec]) return { ...AUGUR_SPEC_CAPS[spec] };
  return {
    benediction: Number.isFinite(Number(resource?.maxBenediction)) ? integer(resource.maxBenediction) : AUGUR_DEFAULT_MAX,
    malediction: Number.isFinite(Number(resource?.maxMalediction)) ? integer(resource.maxMalediction) : AUGUR_DEFAULT_MAX
  };
}

export function getAugurPoolValue(resource = {}, pool) {
  return finite(resource?.[pool === 'malediction' ? 'malediction' : 'benediction']);
}

// A positive stored value is treated as Omen Debt stacks and normalized to the
// negative representation the bar reads (inDebt = omenDebt < 0).
export function normalizeAugurResource(resource) {
  if (!resource) return resource;
  const caps = getAugurCaps(resource);
  const rawDebt = finite(resource.omenDebt);
  const omenDebt = Math.max(-AUGUR_OMEN_DEBT_MAX, Math.min(0, rawDebt > 0 ? -integer(rawDebt) : integer(rawDebt)));
  return {
    ...resource, type: 'benediction-malediction',
    benediction: clamp(resource.benediction, caps.benediction),
    malediction: clamp(resource.malediction, caps.malediction),
    maxBenediction: caps.benediction, maxMalediction: caps.malediction,
    specialization: resource.specialization || 'auspex',
    omenDebt
  };
}

export function updateAugurResource(resource, field, value) {
  const normalized = normalizeAugurResource(resource);
  if (AUGUR_POOLS.includes(field)) return normalizeAugurResource({ ...normalized, [field]: value });
  if (field === 'omenDebt') return normalizeAugurResource({ ...normalized, omenDebt: value });
  if (field === 'specialization') return normalizeAugurResource({ ...normalized, specialization: value });
  // A generic 'current' write is ambiguous for a dual pool; bind it to the
  // light pool rather than dropping the value.
  if (field === 'current') return normalizeAugurResource({ ...normalized, benediction: value });
  return normalizeAugurResource({ ...normalized, [field]: value });
}

// Long rest charges one Omen Debt stack per unused point (cap 10); the debt
// lasts until the next long rest, which recomputes it from that day's pools.
export function getAugurLongRestDebt(resource = {}) {
  const normalized = normalizeAugurResource(resource);
  const unused = (normalized.benediction || 0) + (normalized.malediction || 0);
  return -Math.min(AUGUR_OMEN_DEBT_MAX, unused);
}

export function getAugurSpellResourcePlan(spell, resource, resourceId) {
  const values = spell.resourceCost?.resourceValues || {};
  const generic = spell.resourceCost?.classResource ?? values.classResource ?? {};
  const genericPool = generic.type === 'benediction' ? 'benediction'
    : generic.type === 'malediction' ? 'malediction' : null;
  const benCost = spell.benedictionCost ?? values.benediction_cost;
  const benGain = spell.benedictionGain ?? values.benediction_gain;
  const malCost = spell.maledictionCost ?? values.malediction_cost;
  const malGain = spell.maledictionGain ?? values.malediction_gain;
  const explicitPool = benCost !== undefined || benGain !== undefined ? 'benediction'
    : malCost !== undefined || malGain !== undefined ? 'malediction' : null;
  const pool = explicitPool || genericPool;
  if (!pool) return { handled: false };

  const rawCost = pool === 'benediction'
    ? (explicitPool ? benCost : generic.cost)
    : (explicitPool ? malCost : generic.cost);
  const rawGain = pool === 'benediction'
    ? (explicitPool ? benGain : generic.gain)
    : (explicitPool ? malGain : generic.gain);

  const normalized = normalizeAugurResource(resource || {});
  const current = getAugurPoolValue(normalized, pool);
  const all = typeof rawCost === 'string' && rawCost.toLowerCase() === 'all';
  const numericCost = rawCost === undefined || all ? 0 : Number(rawCost);
  const safeCost = Number.isFinite(numericCost) ? numericCost : 0;
  const cost = all ? current : Math.max(0, Math.trunc(safeCost));
  const generatedByNegativeCost = !all && safeCost < 0 ? Math.trunc(-safeCost) : 0;
  const gain = Math.max(0, Math.trunc(finite(rawGain))) + generatedByNegativeCost;
  const cap = pool === 'benediction' ? normalized.maxBenediction : normalized.maxMalediction;
  const valid = Number.isInteger(cost) && Number.isInteger(gain);

  return {
    handled: true, id: 'benediction-malediction', label: pool === 'benediction' ? 'Benediction' : 'Malediction',
    resourceKey: pool, pool, current, cap,
    cost: valid ? cost : 0, gain: valid ? gain : 0,
    affordable: resourceId === 'benediction-malediction' && valid && current >= cost && (!all || current > 0)
  };
}
