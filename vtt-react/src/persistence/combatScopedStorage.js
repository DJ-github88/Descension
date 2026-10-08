/**
 * Project 5 Wave B (S5/D) — scoped active-cooldown persistence.
 *
 * Cooldowns are a private projection, keyed by the room/context they belong
 * to. They are stored in the verified owner's scope only, so an old account
 * can never repopulate the destination account's combat state. The legacy raw
 * `gameStore-activeCooldowns` key is preserved (quarantined) and never read.
 */

import {
  resolveActiveScope,
  loadScopedNative,
  saveScopedNative,
  clearScopedNative,
  ensureLegacySourceQuarantine
} from './scopedConsumer';

const FAMILY = 'core.cooldowns';
const LEGACY_KEY = 'gameStore-activeCooldowns';

const quarantined = new Set();

function quarantineLegacyOnce() {
  const scope = resolveActiveScope();
  if (!scope) return;
  const key = `${scope.scopeKind}:${scope.scopeId}`;
  if (quarantined.has(key)) return;
  quarantined.add(key);
  try {
    if (typeof localStorage !== 'undefined' && localStorage.getItem(LEGACY_KEY) !== null) {
      ensureLegacySourceQuarantine({ legacyKey: LEGACY_KEY, familyId: FAMILY, scope });
    }
  } catch (_error) {
    // best-effort; the raw source stays untouched
  }
}

const roomRefKey = (roomRef) => String(roomRef || 'sandbox');

export function saveCooldowns(roomRef, cooldowns) {
  if (!resolveActiveScope()) return { status: 'NO_ACTIVE_SCOPE' };
  return saveScopedNative({
    familyId: FAMILY,
    locator: [roomRefKey(roomRef)],
    value: cooldowns && typeof cooldowns === 'object' ? cooldowns : {}
  });
}

export function loadCooldowns(roomRef) {
  quarantineLegacyOnce();
  if (!resolveActiveScope()) return null;
  const read = loadScopedNative({ familyId: FAMILY, locator: [roomRefKey(roomRef)] });
  return read.status === 'OK' && read.value && typeof read.value === 'object' ? read.value : null;
}

export function clearCooldowns(roomRef) {
  if (!resolveActiveScope()) return { status: 'NO_ACTIVE_SCOPE' };
  return clearScopedNative({ familyId: FAMILY, locator: [roomRefKey(roomRef)] });
}

/** Test-only reset of the legacy quarantine bookkeeping. */
export function resetCombatScopedStorageForTests() {
  quarantined.clear();
}
