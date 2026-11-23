/**
 * Review-card resource display helpers (presentation only).
 */
const PLACEHOLDER_MANA = '1d10+2';

const isExplicit = value => value !== undefined && value !== null && value !== '' && !(typeof value === 'number' && Number.isNaN(value));

/**
 * The mana shown for a draft in Review.
 * - A mana formula the author turned on is shown as written (the placeholder only fills an empty formula, as before).
 * - Otherwise the first non-empty authored value wins, exactly as before.
 * - An explicit zero is an authored value: it is shown as 0 and never replaced by the placeholder.
 * - Only a draft that states no mana at all falls back to the placeholder.
 */
export function reviewManaValue(spellState) {
  const cost = spellState?.resourceCost;
  if (cost?.useFormulas?.mana) return cost?.resourceFormulas?.mana || PLACEHOLDER_MANA;
  const candidates = [cost?.resourceValues?.mana, cost?.mana, spellState?.resourceConfig?.resourceAmount];
  const truthy = candidates.find(Boolean);
  if (truthy !== undefined) return truthy;
  const explicit = candidates.find(isExplicit);
  return explicit !== undefined ? explicit : PLACEHOLDER_MANA;
}

export { PLACEHOLDER_MANA };
