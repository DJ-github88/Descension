'use strict';

/**
 * Catalogue-pinned spells must not use the legacy P9 route.
 *
 * This gate identifies pinned content from server-held catalogue identity/binding data:
 * - the reviewed catalogue profile table (spell id and whole-record hash);
 * - the room's installed authored entries, whose canonical definition keeps the admitted
 *   catalogueSource binding, including revoked entries.
 *
 * It never uses display names, client flags or UI selection. A pinned spell is refused on P9 even
 * when its catalogue admission is missing, revoked or otherwise unavailable; the caller receives
 * admission/reapproval guidance instead of a fallback definition.
 *
 * Residual architectural boundary: a legacy P9 approval is a client-shaped owner approval and does
 * not carry an authoritative whole-definition binding. A forged P9 request that fabricates a
 * different definition id/hash is not identifiable as this pinned spell; it remains the established
 * generic P9 contract. This gate closes every P9 request that declares a pinned identity and all
 * ordinary client fallback, not arbitrary fabricated mechanics under a fake identity.
 */

const profileData = require('../shared/data/catalogueAbilityProfiles.json');

const P9_PREFIX = 'p9-spell:v1/';
const GUIDE = 'This spell has a reviewed catalogue admission and cannot use the legacy P9 route. '
  + 'Use its admitted catalogue version; if that version is missing, revoked or unavailable, ask the GM '
  + 'to re-admit or repair it. Nothing was applied, paid or registered; no fallback definition is substituted.';

const reviewedPins = (Array.isArray(profileData.profiles) ? profileData.profiles : [])
  .filter(entry => entry && typeof entry.spellId === 'string' && typeof entry.recordHash === 'string')
  .map(entry => ({ spellId: entry.spellId, recordHash: entry.recordHash }));
const frozenSpellIds = new Set(reviewedPins.map(pin => pin.spellId));
const frozenRecordHashes = new Set(reviewedPins.map(pin => pin.recordHash));

function refuse() {
  const error = new Error(GUIDE);
  error.code = 'catalogue_p9_fallback_refused';
  throw error;
}

function isP9Hash(value) {
  return typeof value === 'string' && value.startsWith(P9_PREFIX);
}

function currentProfiles() {
  return Array.isArray(profileData.profiles) ? profileData.profiles : [];
}

function matchesReviewedPin(spell) {
  const spellId = spell?.definitionId;
  if (typeof spellId === 'string' && (frozenSpellIds.has(spellId) || currentProfiles().some(entry => entry?.spellId === spellId))) {
    return true;
  }
  const recordHash = String(spell?.definitionHash || '').slice(P9_PREFIX.length);
  return frozenRecordHashes.has(recordHash) || currentProfiles().some(entry => entry?.recordHash === recordHash);
}

function matchesInstalledCatalogueBinding(room, spell) {
  const spellId = spell?.definitionId;
  const recordHash = String(spell?.definitionHash || '').slice(P9_PREFIX.length);
  try {
    const entries = require('./installedAuthoredAbilities').list(room).entries;
    return entries.some(entry => {
      const source = entry?.canonicalDefinition?.catalogueSource;
      return source && ((typeof spellId === 'string' && source.spellId === spellId) || source.recordHash === recordHash);
    });
  } catch (_) {
    // The reviewed profile identity above is authoritative. A malformed room registry must not
    // turn an unrelated generic P9 approval into a new failure mode.
    return false;
  }
}

function assertP9Allowed(room, spell) {
  if (!isP9Hash(spell?.definitionHash)) { return; }
  if (matchesReviewedPin(spell) || matchesInstalledCatalogueBinding(room, spell)) { refuse(); }
}

/** Approval-time and binding-time check for a P9 approval. Authored capabilities are untouched. */
function check(room, approval) {
  assertP9Allowed(room, approval?.spell);
}

/** Direct GM command check: an unapproved P9-shaped consequence cannot claim a pinned identity either. */
function checkCommand(room, command) {
  const adjudication = command?.adjudication;
  if (!adjudication) { return; }
  assertP9Allowed(room, { definitionId: adjudication.definitionId, definitionHash: adjudication.definitionVersionOrHash });
}

module.exports = { check, checkCommand, isP9Hash, matchesReviewedPin, GUIDE };
