/** Frozen P12C-B2 §8.1: one read-only Radiant Burst drawing, never casting/admission. */
import { MARTYR_DATA } from '../data/classes/martyrData';
import { getFootprintTiles } from '../utils/GridPathfinder';
import { refOfToken, pickKey } from './targetPick';

export const RADIANT_BURST_ID = 'martyr_radiant_burst';
const original = MARTYR_DATA.spells.find(spell => spell.id === RADIANT_BURST_ID);
const canonical = value => JSON.stringify(value, (key, child) => child && typeof child === 'object' && !Array.isArray(child)
  ? Object.fromEntries(Object.keys(child).sort().map(k => [k, child[k]])) : child);
export const previewFingerprint = action => {
  // Pin every original authored field, plus added effect/geometry/lifecycle encodings. UI slot metadata
  // may differ, but a nested chain/area/trigger addition must never be mistaken for this static profile.
  const fields = [...new Set([...Object.keys(original), ...Object.keys(action || {}).filter(key =>
    /config|target|propagat|chain|zone|trigger|channel|persistent|effect|aoe|area|range/i.test(key))])];
  return canonical(Object.fromEntries(fields.map(key => [key, action?.[key]])));
};

export function radiantPreviewProfile(action, effect) {
  if (action?.id !== RADIANT_BURST_ID) return { error: 'Manual geometry — only original Radiant Burst is supported.' };
  if (!['damage', 'healing'].includes(effect)) return { error: 'Manual geometry — select one effect channel.' };
  const config = action.effectTargeting?.[effect];
  if (!Number.isFinite(config?.aoeParameters?.radius) || config.aoeParameters.radius <= 0 ||
      !Number.isFinite(config?.rangeDistance) || config.rangeDistance <= 0)
    return { error: 'Manual geometry — missing or malformed radius / placement range. No default supplied.' };
  if (previewFingerprint(action) !== previewFingerprint(original))
    return { error: 'Manual geometry — altered or conflicting authored profile; only the original circle is supported.' };
  return { actionId: action.id, effect, radiusFeet: config.aoeParameters.radius, rangeFeet: config.rangeDistance,
    fingerprint: previewFingerprint(action) };
}

/** Analytic circle/closed-cell comparison. Contact alone is not positive-area overlap (G3/G3a). */
export function circleCellOverlap(origin, radius, cell, gridSize, offsetX = 0, offsetY = 0) {
  if (![origin?.x, origin?.y, radius, cell?.x, cell?.y, gridSize, offsetX, offsetY].every(Number.isFinite) || radius <= 0 || gridSize <= 0) return 'manual';
  const x = offsetX + cell.x * gridSize, y = offsetY + cell.y * gridSize;
  const distance = Math.hypot(origin.x - Math.max(x, Math.min(origin.x, x + gridSize)),
    origin.y - Math.max(y, Math.min(origin.y, y + gridSize)));
  const epsilon = gridSize * 1e-8; // Uncertain numerical edge stays manual; never inflate the circle.
  return distance < radius - epsilon ? 'candidate' : distance <= radius + epsilon ? 'edge' : 'outside';
}

/** Reuse the movement engine's square footprint and anchor convention, only at a verified cell centre.
 * Callers supply actual movement dimensions, not portrait bounds. Off-grid/unknown sizes stay manual. */
export function occupiedPreviewCells(position, footprint, gridSize, offsetX = 0, offsetY = 0) {
  if (![position?.x, position?.y, gridSize, offsetX, offsetY].every(Number.isFinite) || gridSize <= 0 ||
      ![footprint?.width, footprint?.height].every(n => Number.isSafeInteger(n) && n > 0 && n <= 5)) return null;
  const x = Math.floor((position.x - offsetX) / gridSize), y = Math.floor((position.y - offsetY) / gridSize);
  if (Math.abs(position.x - (offsetX + (x + 0.5) * gridSize)) > gridSize * 1e-8 ||
      Math.abs(position.y - (offsetY + (y + 0.5) * gridSize)) > gridSize * 1e-8) return null;
  return getFootprintTiles(x, y, footprint);
}

/** Visibility is checked BEFORE reading names/footprints/geometry. Never cache member/name lists. */
export function visibleAreaCandidates(entries, { visible, origin, radius, gridSize, offsetX = 0, offsetY = 0, mapId }) {
  const seen = new Set(), result = [];
  for (const entry of entries) {
    const ref = refOfToken(entry.token);
    if (!ref || ref.mapId !== mapId || !visible(ref, entry.token)) continue;
    const key = pickKey(ref);
    if (seen.has(key)) continue;
    seen.add(key);
    const cells = occupiedPreviewCells(entry.token.position, entry.footprint(), gridSize, offsetX, offsetY);
    const states = cells?.map(cell => circleCellOverlap(origin, radius, cell, gridSize, offsetX, offsetY));
    const status = !states ? 'manual' : states.includes('candidate') ? 'candidate' : states.includes('edge') ? 'edge' : 'outside';
    if (status !== 'outside') result.push({ ref, key, position: entry.token.position, name: entry.name(), status });
  }
  return result;
}
