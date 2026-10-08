/**
 * Project 5 Wave B (S7/F) — custom subregion-map ownership references.
 *
 * Existing `mythrill_maps_db` / `custom_subregion_maps` records and the
 * `mythrill_custom_subregion_maps` mirror remain untouched recovery sources.
 * Ownership of a custom map is only established by an explicit owner-scoped
 * reference written when the active verified owner saves the map. Records
 * without a matching reference are NEVER exposed to a signed-in account as
 * their own maps (no global-enumeration adoption).
 *
 * The full IndexedDB payload is never replaced with the lightweight mirror
 * placeholder: when the mirror carries the `indexeddb_stored` marker, the
 * reference alone establishes ownership and the full image stays recoverable
 * in IndexedDB.
 */

import {
  resolveActiveScope,
  loadScopedNative,
  saveScopedNative,
  clearScopedNative
} from './scopedConsumer';
import { fingerprintRawString } from './preservation';

const FAMILY = 'map.subregionCache';
const MIRROR_PLACEHOLDER_MARKER = 'indexeddb_stored';

const fingerprintOf = (record) => fingerprintRawString(JSON.stringify(record)).value;

export function recordCustomMapOwnership(mapId, record) {
  if (!mapId || !record) return { status: 'INVALID' };
  if (!resolveActiveScope()) return { status: 'NO_ACTIVE_SCOPE' };
  return saveScopedNative({
    familyId: FAMILY,
    locator: [String(mapId)],
    value: {
      mapId: String(mapId),
      fingerprint: fingerprintOf(record),
      updatedAt: new Date().toISOString()
    }
  });
}

export function getCustomMapOwnership(mapId) {
  if (!mapId) return null;
  const read = loadScopedNative({ familyId: FAMILY, locator: [String(mapId)] });
  return read.status === 'OK' ? read.value : null;
}

export function isCustomMapOwned(mapId, record) {
  if (!mapId) return false;
  if (!resolveActiveScope()) return false;
  const reference = getCustomMapOwnership(mapId);
  if (!reference) return false;
  if (!record) return false;
  // The mirror-only placeholder never invalidates an owned reference: the
  // full payload is preserved in IndexedDB.
  if (record.image === MIRROR_PLACEHOLDER_MARKER) return true;
  return fingerprintOf(record) === reference.fingerprint;
}

export function clearCustomMapOwnership(mapId) {
  if (!mapId) return { status: 'INVALID' };
  return clearScopedNative({ familyId: FAMILY, locator: [String(mapId)] });
}

/** Filter a raw custom-map record map down to the active owner's records. */
export function filterOwnedCustomMaps(records) {
  const owned = {};
  for (const [mapId, record] of Object.entries(records || {})) {
    if (isCustomMapOwned(mapId, record)) owned[mapId] = record;
  }
  return owned;
}

export { MIRROR_PLACEHOLDER_MARKER };
