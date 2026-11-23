/** Frozen P12C-B2 §8.1: one read-only Radiant Burst drawing, never casting/admission. */
import { MARTYR_DATA } from '../data/classes/martyrData';
import { getFootprintTiles } from '../utils/GridPathfinder';
import { refOfToken, pickKey, sameRef } from './targetPick';
import { circleCellOverlap as sharedCircleCellOverlap, lineCellOverlap as sharedLineCellOverlap } from './authoredAbility';

export const RADIANT_BURST_ID = 'martyr_radiant_burst';
const original = MARTYR_DATA.spells.find(spell => spell.id === RADIANT_BURST_ID);
const canonical = value => JSON.stringify(value, (key, child) => child && typeof child === 'object' && !Array.isArray(child)
  ? Object.fromEntries(Object.keys(child).sort().map(k => [k, child[k]])) : child);
export const previewFingerprint = action => {
  if (action?.capability === 'authored-area:v1') {
    return canonical({ id: action.id, capability: action.capability, definitionHash: action.definitionHash, effect: action.kind, areaTerms: action.areaTerms });
  }
  // Pin every original authored field, plus added effect/geometry/lifecycle encodings. UI slot metadata
  // may differ, but a nested chain/area/trigger addition must never be mistaken for this static profile.
  const fields = [...new Set([...Object.keys(original), ...Object.keys(action || {}).filter(key =>
    /config|target|propagat|chain|zone|trigger|channel|persistent|effect|aoe|area|range/i.test(key))])];
  return canonical(Object.fromEntries(fields.map(key => [key, action?.[key]])));
};

export function radiantPreviewProfile(action, effect) {
  if (action?.capability === 'authored-area:v1') {
    if (!['damage', 'healing'].includes(effect)) return { error: 'Manual geometry — select one effect channel.' };
    const terms = action.areaTerms;
    if (terms?.aoeShape === 'line') {
      if (effect !== 'damage') return { error: 'Manual geometry — Line area spells currently support immediate damage only.' };
      if (!Number.isFinite(terms?.lengthFeet) || terms.lengthFeet <= 0 ||
          !Number.isFinite(terms?.widthFeet) || terms.widthFeet <= 0 ||
          !Number.isFinite(terms?.rangeFeet) || terms.rangeFeet <= 0) {
        return { error: 'Manual geometry — missing or malformed line length / width / placement range.' };
      }
      return {
        actionId: action.id,
        name: action.name || action.id,
        effect,
        isAreaCast: true,
        aoeShape: 'line',
        lengthFeet: terms.lengthFeet,
        widthFeet: terms.widthFeet,
        rangeFeet: terms.rangeFeet,
        maxTargets: terms.maxTargets || 8,
        restriction: terms.restriction || 'enemy',
        fingerprint: previewFingerprint(action)
      };
    }
    if (terms?.aoeShape !== 'circle' || !Number.isFinite(terms?.radiusFeet) || terms.radiusFeet <= 0 ||
        !Number.isFinite(terms?.rangeFeet) || terms.rangeFeet <= 0)
      return { error: 'Manual geometry — missing or malformed circle radius / placement range.' };
    return { actionId: action.id, name: action.name || action.id, effect, isAreaCast: true,
      aoeShape: 'circle', radiusFeet: terms.radiusFeet, rangeFeet: terms.rangeFeet,
      maxTargets: terms.maxTargets || 8, restriction: terms.restriction || 'enemy',
      fingerprint: previewFingerprint(action) };
  }
  if (action?.id !== RADIANT_BURST_ID) return { error: 'Manual geometry — only original Radiant Burst is supported.' };
  if (!['damage', 'healing'].includes(effect)) return { error: 'Manual geometry — select one effect channel.' };
  const config = action.effectTargeting?.[effect];
  if (!Number.isFinite(config?.aoeParameters?.radius) || config.aoeParameters.radius <= 0 ||
      !Number.isFinite(config?.rangeDistance) || config.rangeDistance <= 0)
    return { error: 'Manual geometry — missing or malformed radius / placement range. No default supplied.' };
  if (previewFingerprint(action) !== previewFingerprint(original))
    return { error: 'Manual geometry — altered or conflicting authored profile; only the original circle is supported.' };
  return { actionId: action.id, effect, aoeShape: 'circle', radiusFeet: config.aoeParameters.radius, rangeFeet: config.rangeDistance,
    fingerprint: previewFingerprint(action) };
}

/** Analytic circle/closed-cell comparison. Contact alone is not positive-area overlap (G3/G3a). */
export function circleCellOverlap(origin, radius, cell, gridSize, offsetX = 0, offsetY = 0) {
  return sharedCircleCellOverlap(origin, radius, cell, gridSize, offsetX, offsetY);
}

/** Analytic 2D oriented rectangle-vs-cell SAT comparison for Line AoE. Boundary contact alone is 'edge' (G3/G3a). */
export function lineCellOverlap(origin, target, length, width, cell, gridSize, offsetX = 0, offsetY = 0) {
  return sharedLineCellOverlap(origin, target, length, width, cell, gridSize, offsetX, offsetY);
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

function areaCellStates(entry, { aoeShape = 'circle', origin, target, radius, length, width, gridSize, offsetX = 0, offsetY = 0 }) {
  if (!origin) return null;
  if (aoeShape === 'line') {
    if (!target || !Number.isFinite(length) || length <= 0 || !Number.isFinite(width) || width <= 0) return null;
    const cells = occupiedPreviewCells(entry.token.position, entry.footprint(), gridSize, offsetX, offsetY);
    if (!cells) return null;
    return cells.map(cell => lineCellOverlap(origin, target, length, width, cell, gridSize, offsetX, offsetY));
  }
  if (!Number.isFinite(radius) || radius <= 0) return null;
  const cells = occupiedPreviewCells(entry.token.position, entry.footprint(), gridSize, offsetX, offsetY);
  if (!cells) return null;
  return cells.map(cell => circleCellOverlap(origin, radius, cell, gridSize, offsetX, offsetY));
}

function summarizeOverlapStates(states) {
  if (!states) return 'manual';
  if (states.includes('candidate')) return 'candidate';
  if (states.includes('manual')) return 'manual';
  if (states.includes('edge')) return 'edge';
  return 'outside';
}

/** Visibility is checked BEFORE reading names/footprints/geometry. Never cache member/name lists. */
export function visibleAreaCandidates(entries, { visible, aoeShape = 'circle', origin, target, radius, length, width, gridSize, offsetX = 0, offsetY = 0, mapId }) {
  const seen = new Set(), result = [];
  for (const entry of entries) {
    const ref = refOfToken(entry.token);
    if (!ref || ref.mapId !== mapId || !visible(ref, entry.token)) continue;
    const key = pickKey(ref);
    if (seen.has(key)) continue;
    seen.add(key);
    const states = areaCellStates(entry, { aoeShape, origin, target, radius, length, width, gridSize, offsetX, offsetY });
    const status = summarizeOverlapStates(states);
    if (status !== 'outside') result.push({ ref, key, position: entry.token.position, name: entry.name(), status });
  }
  return result;
}

/** M6A: Classify visible tokens on mapId (excluding sourceRef) for area cast inspection.
 * Visibility is checked strictly BEFORE reading names, footprints, or geometry so hidden/concealed
 * tokens never leak into counts, lists, or selection state. */
export function classifyAreaTokens(entries, { visible, aoeShape = 'circle', origin, target, radius, length, width, gridSize, offsetX = 0, offsetY = 0, mapId, sourceRef }) {
  const seen = new Set(), result = [];
  for (const entry of entries) {
    const token = entry?.token;
    const ref = refOfToken(token);
    if (!ref || ref.mapId !== mapId || (sourceRef && sameRef(ref, sourceRef))) continue;
    if (token?.state?.hiddenFromPlayers === true || token?.hiddenFromPlayers === true || token?.state?.isHidden === true || token?.isHidden === true || !visible(ref, token)) continue;
    const key = pickKey(ref);
    if (seen.has(key)) continue;
    seen.add(key);
    const states = areaCellStates(entry, { aoeShape, origin, target, radius, length, width, gridSize, offsetX, offsetY });
    const status = summarizeOverlapStates(states);
    result.push({
      ref,
      key,
      position: entry.token.position,
      name: entry.name(),
      status,
      eligibleCreature: ref.kind === 'creature',
      excludedReason: ref.kind !== 'creature' ? 'PC target excluded in M6A (creature targets only)' : null
    });
  }
  return result;
}
