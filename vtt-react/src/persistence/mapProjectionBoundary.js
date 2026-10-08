/**
 * Project 5 Wave B (S5/E) — sandbox vs room-projection boundary.
 *
 * Server room snapshots hydrate map/token/condition working projections. Those
 * projections are server-owned and must never be persisted as the owner's
 * authored personal drafts, and the authored sandbox working state must not be
 * displaced without preservation.
 *
 * Contract:
 *  1. enterRoomProjection(): suspend scoped writes for the projection engines
 *     (the authored scoped drafts stay intact and untouched = safely detached);
 *  2. room hydration mutates in-memory stores only;
 *  3. exitRoomProjection(): resume scoped writes and rehydrate the authored
 *     sandbox map working state;
 *  4. a scope change auto-resumes writes so a later account is never silently
 *     left unsaved.
 */

import useMapStore from '../store/mapStore';
import useCharacterTokenStore from '../store/characterTokenStore';
import useConditionStore from '../store/conditionStore';
import useInteractiveMapStore from '../store/interactiveMapStore';
import { getScopedStoreEngine } from './scopedStoreStorage';
import { resolveActiveScope } from './scopedConsumer';

const PROJECTION_STORES = Object.freeze([
  ['core.mapWorking', useMapStore],
  ['core.characterTokens', useCharacterTokenStore],
  ['core.conditions', useConditionStore],
  ['worldbuilding.interactiveMaps', useInteractiveMapStore]
]);

// Authored sandbox baseline captured before any user data loads.
const INITIAL_MAP_STATE = useMapStore.getState();

let activeScopeKey = null;
let activeRoomId = null;

const scopeKeyOf = () => {
  const scope = resolveActiveScope();
  return scope ? `${scope.scopeKind}:${scope.scopeId}` : null;
};

function setSuspended(suspended) {
  for (const [familyId] of PROJECTION_STORES) {
    const engine = getScopedStoreEngine(familyId);
    if (!engine) continue;
    try {
      if (suspended) {
        engine.__suspendWrites();
      } else {
        engine.__resumeWrites();
      }
    } catch (_error) {
      // a projection engine without suspension support is left untouched
    }
  }
}

export function isRoomProjectionActive() {
  return activeScopeKey !== null;
}

/**
 * Enter (or stay in) the room-projection window. Safe to call for every room
 * snapshot: only the first call performs the suspension.
 */
export function enterRoomProjection({ roomId = null } = {}) {
  const scopeKey = scopeKeyOf();
  if (scopeKey === null) return false; // no verified owner: nothing to suspend
  if (activeScopeKey !== null && activeScopeKey !== scopeKey) {
    // Owner changed mid-projection: never leave the previous suspension active.
    setSuspended(false);
    activeScopeKey = null;
    activeRoomId = null;
  }
  if (activeScopeKey === null) {
    setSuspended(true);
    activeScopeKey = scopeKey;
  }
  activeRoomId = roomId || activeRoomId;
  return true;
}

/**
 * Leave the room-projection window: resume scoped writes and restore the
 * authored sandbox map working state (or the authored baseline when the owner
 * has no authored draft yet). Server projection content is never persisted by
 * this path.
 */
export function exitRoomProjection() {
  if (activeScopeKey === null) return false;
  setSuspended(false);
  activeScopeKey = null;
  activeRoomId = null;
  for (const [familyId, store] of PROJECTION_STORES) {
    try {
      if (familyId === 'core.mapWorking') {
        store.setState(INITIAL_MAP_STATE, true);
      }
      Promise.resolve(store.persist?.rehydrate?.()).catch(() => {});
    } catch (_error) {
      // rehydration is best-effort; the authored draft remains recoverable
    }
  }
  return true;
}

/** Test-only reset of the boundary window. */
export function resetMapProjectionBoundaryForTests() {
  setSuspended(false);
  activeScopeKey = null;
  activeRoomId = null;
}
