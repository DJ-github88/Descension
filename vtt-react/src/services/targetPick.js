/** P12C-B1 (MYTHRILL_PROJECT_12C_B1_CONTRACT.md): pure helpers for map picking and roll drafts.
 * Preview only: nothing here validates authoritatively, spends, rolls or proposes. */
const REF_KEYS = ['kind', 'roomId', 'mapId', 'tokenId', 'instanceId', 'ownerUid', 'characterId'];
export const sameRef = (a, b) => !!a && !!b && REF_KEYS.every(key => a[key] === b[key]);
export const refOfToken = token => {
  const binding = token?.state?.actorContract;
  return binding?.version === 1 ? Object.fromEntries(REF_KEYS.filter(key => binding[key] !== undefined).map(key => [key, binding[key]])) : null;
};
export const pickKey = ref => ref ? [ref.kind, ref.roomId, ref.mapId, ref.tokenId, ref.instanceId].join('|') : '';

/** Advisory planar centre distance in feet (the accepted P8 convention); null when unknown. */
export function planarFeet(a, b, gridSize, feetPerTile = 5) {
  if (![a?.x, a?.y, b?.x, b?.y, gridSize, feetPerTile].every(Number.isFinite) || gridSize <= 0) return null;
  return Math.hypot(a.x - b.x, a.y - b.y) / gridSize * feetPerTile;
}
export const formatFeet = feet => feet === null ? '?' : (Math.round(feet * 10) / 10).toString();
/** Range ring in world units as a polygon (projects correctly under rotation/tilt). */
export function ringPoints(center, radiusWorld, segments = 48) {
  if (!Number.isFinite(radiusWorld) || radiusWorld <= 0 || !center) return [];
  return Array.from({ length: segments }, (_, i) => {
    const angle = (i / segments) * Math.PI * 2;
    return { x: center.x + radiusWorld * Math.cos(angle), y: center.y + radiusWorld * Math.sin(angle) };
  });
}
/**
 * The token under a world point among tokens this viewer may see.
 * entries: [{ ref, position, name }]; visible(ref) → bool (rendered for this viewer or GM).
 * Returns { entry, candidate, reason } or null. Hidden tokens are never returned.
 */
export function tokenAt(entries, point, { visible, candidates, reasonFor, hitRadius }) {
  let best = null;
  for (const entry of entries) {
    if (!entry?.ref || !entry.position || !visible(entry.ref)) continue;
    const distance = Math.hypot(entry.position.x - point.x, entry.position.y - point.y);
    if (distance <= hitRadius && (!best || distance < best.distance)) best = { entry, distance };
  }
  if (!best) return null;
  const candidate = candidates.some(ref => sameRef(ref, best.entry.ref));
  return { entry: best.entry, candidate, reason: candidate ? '' : (reasonFor?.(best.entry.ref) || 'Not a valid target for this action.') };
}
/** Range wording; always advisory. */
export function rangeText(feet, rangeFeet, rangeLabel) {
  if (feet === null) return 'Distance unavailable — GM adjudicates range.';
  const base = `Planar centre distance ${formatFeet(feet)} ft`;
  if (!Number.isFinite(rangeFeet) || rangeFeet <= 0) return `${base}; no card range — GM adjudicates.`;
  return feet > rangeFeet ? `${base} — outside ${rangeLabel || `card range ${rangeFeet} ft`} (advisory): GM decides.` : `${base} — within ${rangeLabel || `card range ${rangeFeet} ft`} (advisory).`;
}

// ── Roll drafts (contract §2) ─────────────────────────────────────────────────────────────────────────
/** The action context a recorded roll belongs to; a roll never moves to another context. */
export function draftContext(kind, fields) {
  if (kind === 'strike') return { kind, characterId: fields.characterId ?? null, source: pickKey(fields.sourceRef), actionId: fields.actionId ?? null,
    slot: fields.slot ?? null, itemId: fields.itemId ?? null, weaponType: fields.weaponType ?? null, die: fields.die ?? null };
  if (kind === 'spell') return { kind, characterId: fields.characterId ?? null, source: pickKey(fields.sourceRef), spellId: fields.spellId ?? null };
  return null;
}
export const sameDraftContext = (a, b) => !!a && !!b && JSON.stringify(a) === JSON.stringify(b);
export const describeDraft = draft => {
  if (!draft?.context) return '';
  const rolls = [draft.roll && `[${(draft.roll.faces || draft.roll.dice?.flatMap(group => group.faces) || []).join(', ')}]`,
    draft.proficiencyRoll && `proficiency [${draft.proficiencyRoll.faces.join(', ')}]`].filter(Boolean).join(' · ');
  const action = draft.context.kind === 'strike' ? `${draft.label || draft.context.actionId} (${draft.context.weaponType || 'weapon'} d${draft.context.die})` : (draft.label || draft.context.spellId);
  return `${action}: ${rolls}`;
};
/** Bounded local list of explicitly discarded drafts (shown on this device). */
export const withDiscarded = (list, draft) => [...(Array.isArray(list) ? list : []), { ...draft, discardedAt: Date.now() }].slice(-5);
