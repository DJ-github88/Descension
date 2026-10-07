/**
 * Project 4 C5: bounded room-authority lease.
 *
 * One server process may hold current authority for a room. Runtime lifecycles
 * are bound immutably to {roomId, authorityInstanceId, authorityGeneration}.
 * Local safe deadlines use a monotonic elapsed-time source; backend expiry
 * decisions use backend (Firestore) time supplied by the backend adapter.
 *
 * Lifecycle states (R7): ACTIVE -> QUIESCING -> FENCED. Only ACTIVE lifecycles
 * may serve authoritative work. QUIESCING still renews so in-flight settling
 * (drain/delete) keeps its authority, but new authoritative work is refused.
 *
 * This service owns lease timing/lifecycle only. It contains no gameplay
 * logic and is not a generic distributed lock framework.
 */

const LEASE_DURATION_MS = 30000;
const RENEW_INTERVAL_MS = 10000;
const SAFETY_ALLOWANCE_MS = 5000;

const AUTHORITY_CODES = Object.freeze({
  BUSY: 'room_authority_busy',
  UNAVAILABLE: 'room_authority_unavailable',
  LOST: 'room_authority_lost',
  DELETED: 'room_deleted'
});

const LIFECYCLE_STATES = Object.freeze({
  ACTIVE: 'active',
  QUIESCING: 'quiescing',
  FENCED: 'fenced'
});

const defaultClock = () => {
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    return performance.now();
  }
  return Date.now();
};

/**
 * Build the production backend adapter over the firebaseService authority
 * functions. Injected as a factory to avoid a module-level circular require.
 */
function createFirestoreAuthorityBackend(firebaseService) {
  if (!firebaseService ||
    typeof firebaseService.claimRoomAuthority !== 'function' ||
    typeof firebaseService.renewRoomAuthority !== 'function' ||
    typeof firebaseService.releaseRoomAuthority !== 'function' ||
    typeof firebaseService.validateRoomAuthority !== 'function') {
    throw new Error('firebaseService does not expose the room-authority backend');
  }
  return {
    acquire: (args) => firebaseService.claimRoomAuthority(args),
    renew: (args) => firebaseService.renewRoomAuthority(args),
    release: (args) => firebaseService.releaseRoomAuthority(args),
    validate: (args) => firebaseService.validateRoomAuthority(args)
  };
}

function createRoomAuthorityService(options = {}) {
  const backend = options.backend;
  if (!backend ||
    typeof backend.acquire !== 'function' ||
    typeof backend.renew !== 'function' ||
    typeof backend.release !== 'function' ||
    typeof backend.validate !== 'function') {
    throw new Error('roomAuthorityService requires a backend adapter');
  }
  if (typeof options.instanceId !== 'string' || options.instanceId.length === 0) {
    throw new Error('roomAuthorityService requires an authorityInstanceId');
  }

  const instanceId = options.instanceId;
  const logger = options.logger || { debug() {}, info() {}, warn() {}, error() {} };
  const now = typeof options.now === 'function' ? options.now : defaultClock;
  const setIntervalFn = typeof options.setIntervalFn === 'function' ? options.setIntervalFn : setInterval;
  const clearIntervalFn = typeof options.clearIntervalFn === 'function' ? options.clearIntervalFn : clearInterval;
  const onLoss = typeof options.onLoss === 'function' ? options.onLoss : null;
  const leaseDurationMs = Number.isFinite(options.leaseDurationMs) ? options.leaseDurationMs : LEASE_DURATION_MS;
  const renewIntervalMs = Number.isFinite(options.renewIntervalMs) ? options.renewIntervalMs : RENEW_INTERVAL_MS;
  const safetyAllowanceMs = Number.isFinite(options.safetyAllowanceMs) ? options.safetyAllowanceMs : SAFETY_ALLOWANCE_MS;
  const localBudgetMs = Math.max(1, leaseDurationMs - safetyAllowanceMs);

  // roomId -> { token, state, timer, renewing, rooms:Set }
  const lifecycles = new Map();

  function makeToken(roomId, generation, localSafeDeadline) {
    return Object.freeze({
      roomId,
      authorityInstanceId: instanceId,
      authorityGeneration: generation,
      localSafeDeadline
    });
  }

  function isActiveLifecycle(lifecycle) {
    return !!lifecycle && lifecycle.state === LIFECYCLE_STATES.ACTIVE;
  }

  function isRoomAuthoritative(roomId) {
    const lifecycle = lifecycles.get(roomId);
    if (!isActiveLifecycle(lifecycle)) {return { ok: false, code: AUTHORITY_CODES.LOST };}
    if (now() >= lifecycle.token.localSafeDeadline) {
      return { ok: false, code: AUTHORITY_CODES.LOST };
    }
    return { ok: true, code: null };
  }

  /**
   * Exact immutable-token validity. Never resolves authority from roomId alone
   * for foreign work: the lifecycle must carry the same instance+generation
   * and be ACTIVE with an unexpired local deadline.
   */
  function validateCurrent(token) {
    if (!token || typeof token.roomId !== 'string') {return false;}
    const lifecycle = lifecycles.get(token.roomId);
    if (!isActiveLifecycle(lifecycle)) {return false;}
    if (lifecycle.token.authorityInstanceId !== token.authorityInstanceId) {return false;}
    if (lifecycle.token.authorityGeneration !== token.authorityGeneration) {return false;}
    if (now() >= lifecycle.token.localSafeDeadline) {return false;}
    return true;
  }

  /**
   * R7: validity for settling already-captured work. ACTIVE and QUIESCING
   * lifecycles may settle work pinned to their exact token while the local
   * safe deadline is still valid; FENCED (permanent loss) may never settle.
   * New-work admission must use validateCurrent (ACTIVE only).
   */
  function validateSettle(token) {
    if (!token || typeof token.roomId !== 'string') {return false;}
    const lifecycle = lifecycles.get(token.roomId);
    if (!lifecycle) {return false;}
    if (lifecycle.state !== LIFECYCLE_STATES.ACTIVE && lifecycle.state !== LIFECYCLE_STATES.QUIESCING) {
      return false;
    }
    if (lifecycle.token.authorityInstanceId !== token.authorityInstanceId) {return false;}
    if (lifecycle.token.authorityGeneration !== token.authorityGeneration) {return false;}
    if (now() >= lifecycle.token.localSafeDeadline) {return false;}
    return true;
  }

  function attachRoom(room) {
    if (!room || typeof room.id !== 'string') {return null;}
    const lifecycle = lifecycles.get(room.id);
    if (!isActiveLifecycle(lifecycle)) {return null;}
    lifecycle.rooms.add(room);
    room.authorityToken = lifecycle.token;
    room.authorityFenced = false;
    room.lifecycleState = LIFECYCLE_STATES.ACTIVE;
    return lifecycle.token;
  }

  function detachRoom(room) {
    if (!room || typeof room.id !== 'string') {return;}
    const lifecycle = lifecycles.get(room.id);
    if (lifecycle) {lifecycle.rooms.delete(room);}
    delete room.authorityToken;
  }

  function stopRenewal(roomId) {
    const lifecycle = lifecycles.get(roomId);
    if (!lifecycle || !lifecycle.timer) {return;}
    clearIntervalFn(lifecycle.timer);
    lifecycle.timer = null;
  }

  function markRooms(lifecycle, state) {
    for (const room of lifecycle.rooms) {
      room.lifecycleState = state;
      room.authorityFenced = state === LIFECYCLE_STATES.FENCED;
    }
  }

  /**
   * Permanently fence a lifecycle. When a token is supplied it must match the
   * current lifecycle; a stale token can never fence a successor.
   */
  function fenceLifecycle(token, code = AUTHORITY_CODES.LOST) {
    if (!token || typeof token.roomId !== 'string') {return false;}
    const lifecycle = lifecycles.get(token.roomId);
    if (!lifecycle) {return false;}
    if (lifecycle.token.authorityInstanceId !== token.authorityInstanceId) {return false;}
    if (lifecycle.token.authorityGeneration !== token.authorityGeneration) {return false;}
    return fenceLocal(token.roomId, code);
  }

  function fenceLocal(roomId, code = AUTHORITY_CODES.LOST) {
    const lifecycle = lifecycles.get(roomId);
    if (!lifecycle || lifecycle.state === LIFECYCLE_STATES.FENCED) {return false;}
    lifecycle.state = LIFECYCLE_STATES.FENCED;
    stopRenewal(roomId);
    markRooms(lifecycle, LIFECYCLE_STATES.FENCED);
    logger.warn('Room authority fenced locally', { roomId, code, generation: lifecycle.token.authorityGeneration });
    if (onLoss) {
      try {onLoss(roomId, lifecycle.token, code);} catch (error) {
        logger.error('Room authority loss callback failed', { roomId, error: error.message });
      }
    }
    return true;
  }

  /**
   * Stop new authoritative work while retaining renewal so bounded settling
   * (drain/delete/release) can finish under the same lease.
   */
  function beginQuiesce(roomIdOrToken) {
    const roomId = typeof roomIdOrToken === 'string'
      ? roomIdOrToken
      : (roomIdOrToken && roomIdOrToken.roomId);
    if (!roomId) {return false;}
    const lifecycle = lifecycles.get(roomId);
    if (!lifecycle || lifecycle.state !== LIFECYCLE_STATES.ACTIVE) {return false;}
    lifecycle.state = LIFECYCLE_STATES.QUIESCING;
    markRooms(lifecycle, LIFECYCLE_STATES.QUIESCING);
    return true;
  }

  function scheduleRenewal(roomId) {
    const lifecycle = lifecycles.get(roomId);
    if (!lifecycle || lifecycle.timer) {return;}
    const timer = setIntervalFn(() => {
      renew(roomId).catch(() => {});
    }, renewIntervalMs);
    if (timer && typeof timer.unref === 'function') {timer.unref();}
    lifecycle.timer = timer;
  }

  /**
   * Acquire authority. The local safe deadline starts BEFORE the backend
   * request so a delayed response consumes the budget. A claim is adopted only
   * after a confirmed transaction and while the local budget is still valid.
   */
  async function acquire(roomId) {
    if (typeof roomId !== 'string' || roomId.length === 0) {
      return { ok: false, code: AUTHORITY_CODES.UNAVAILABLE };
    }
    const existing = lifecycles.get(roomId);
    if (isActiveLifecycle(existing) && isRoomAuthoritative(roomId).ok) {
      return { ok: true, token: existing.token, reused: true, code: null };
    }

    const deadline = now() + localBudgetMs;
    let result;
    try {
      result = await backend.acquire({ roomId, instanceId, leaseDurationMs });
    } catch (error) {
      logger.error('Room authority acquisition failed', { roomId, error: error.message });
      return { ok: false, code: AUTHORITY_CODES.UNAVAILABLE };
    }
    if (!result || result.ok !== true) {
      return { ok: false, code: (result && result.code) || AUTHORITY_CODES.BUSY };
    }
    if (now() >= deadline) {
      // Late confirmation: do not adopt a budget that already elapsed. The
      // unadopted claim expires on the backend without local runtime effects.
      return { ok: false, code: AUTHORITY_CODES.UNAVAILABLE, late: true };
    }

    const token = makeToken(roomId, result.generation, deadline);
    const lifecycle = {
      token,
      state: LIFECYCLE_STATES.ACTIVE,
      timer: null,
      renewing: false,
      rooms: new Set()
    };
    lifecycles.set(roomId, lifecycle);
    scheduleRenewal(roomId);
    logger.info('Room authority acquired', { roomId, generation: result.generation, instanceId });
    return { ok: true, token, generation: result.generation, code: null };
  }

  async function renew(roomId) {
    const lifecycle = lifecycles.get(roomId);
    if (!lifecycle || lifecycle.state === LIFECYCLE_STATES.FENCED || lifecycle.renewing) {
      return { ok: false, code: AUTHORITY_CODES.LOST };
    }
    const previousDeadline = lifecycle.token.localSafeDeadline;
    if (now() >= previousDeadline) {
      fenceLocal(roomId, AUTHORITY_CODES.LOST);
      return { ok: false, code: AUTHORITY_CODES.LOST };
    }

    lifecycle.renewing = true;
    const deadline = now() + localBudgetMs;
    let result;
    try {
      result = await backend.renew({
        roomId,
        instanceId,
        generation: lifecycle.token.authorityGeneration,
        leaseDurationMs
      });
    } catch (error) {
      result = { ok: false, code: AUTHORITY_CODES.UNAVAILABLE };
    } finally {
      lifecycle.renewing = false;
    }

    const current = lifecycles.get(roomId);
    if (current !== lifecycle || lifecycle.state === LIFECYCLE_STATES.FENCED) {
      // Lifecycle changed or was fenced while the renewal was in flight. A late
      // success never revives a fenced lifecycle.
      return { ok: false, code: AUTHORITY_CODES.LOST };
    }
    if (!result || result.ok !== true) {
      fenceLocal(roomId, (result && result.code) || AUTHORITY_CODES.UNAVAILABLE);
      return { ok: false, code: (result && result.code) || AUTHORITY_CODES.UNAVAILABLE };
    }
    // R3: the PREVIOUS window must still have been valid when the response
    // completed. A response after the old deadline cannot extend authority.
    if (now() >= previousDeadline || now() >= deadline) {
      fenceLocal(roomId, AUTHORITY_CODES.UNAVAILABLE);
      return { ok: false, code: AUTHORITY_CODES.UNAVAILABLE };
    }

    current.token = makeToken(roomId, lifecycle.token.authorityGeneration, deadline);
    for (const room of current.rooms) {
      room.authorityToken = current.token;
    }
    return { ok: true, token: current.token, code: null };
  }

  /**
   * Token-bound conditional release. Only the captured lifecycle can be
   * released; a replacement lifecycle that appeared while the caller awaited
   * is never touched. Quiescing begins before the backend release so no new
   * authoritative work is served meanwhile.
   */
  async function release(token) {
    if (!token || typeof token.roomId !== 'string') {
      return { ok: false, code: AUTHORITY_CODES.LOST };
    }
    const lifecycle = lifecycles.get(token.roomId);
    if (!lifecycle) {return { ok: true, code: null, released: false };}
    if (lifecycle.token.authorityInstanceId !== token.authorityInstanceId ||
      lifecycle.token.authorityGeneration !== token.authorityGeneration) {
      return { ok: false, code: AUTHORITY_CODES.LOST };
    }
    if (lifecycle.state === LIFECYCLE_STATES.ACTIVE) {
      beginQuiesce(token.roomId);
    }
    stopRenewal(token.roomId);
    let result;
    try {
      result = await backend.release({
        roomId: token.roomId,
        instanceId: token.authorityInstanceId,
        generation: token.authorityGeneration
      });
    } catch (error) {
      result = { ok: false, code: AUTHORITY_CODES.UNAVAILABLE };
    }
    const current = lifecycles.get(token.roomId);
    if (current !== lifecycle) {
      // A replacement lifecycle appeared during release; never touch it.
      return { ok: false, code: AUTHORITY_CODES.LOST };
    }
    if (!result || result.ok !== true) {
      // Unconfirmed release grants nothing; the replacement waits for expiry.
      fenceLocal(token.roomId, (result && result.code) || AUTHORITY_CODES.UNAVAILABLE);
      return { ok: false, code: (result && result.code) || AUTHORITY_CODES.UNAVAILABLE };
    }
    markRooms(lifecycle, LIFECYCLE_STATES.FENCED);
    lifecycles.delete(token.roomId);
    return { ok: true, code: null, released: true };
  }

  /**
   * Fresh backend authority validation for authoritative operations and
   * delayed flushes. Backend failure fails closed and fences the lifecycle.
   * The exact local lifecycle is re-checked after the backend await.
   */
  async function assertCurrent(token, { backendCheck = false } = {}) {
    if (!validateCurrent(token)) {
      if (token && token.roomId) {fenceLifecycle(token, AUTHORITY_CODES.LOST);}
      return { ok: false, code: AUTHORITY_CODES.LOST };
    }
    if (!backendCheck) {return { ok: true, code: null };}
    let result;
    try {
      result = await backend.validate({
        roomId: token.roomId,
        instanceId: token.authorityInstanceId,
        generation: token.authorityGeneration
      });
    } catch (error) {
      result = { ok: false, code: AUTHORITY_CODES.UNAVAILABLE };
    }
    if (!result || result.ok !== true) {
      const code = (result && result.code) || AUTHORITY_CODES.UNAVAILABLE;
      fenceLifecycle(token, code);
      return { ok: false, code };
    }
    // R3: final local re-check after the backend await.
    if (!validateCurrent(token)) {
      fenceLifecycle(token, AUTHORITY_CODES.LOST);
      return { ok: false, code: AUTHORITY_CODES.LOST };
    }
    return { ok: true, code: null };
  }

  /**
   * R7: settle-time counterpart of assertCurrent. Allows an ACTIVE or
   * QUIESCING lifecycle to settle already-captured work pinned to the exact
   * token, with the same fresh-backend option and post-await local recheck.
   * FENCED lifecycles can never settle.
   */
  async function assertSettle(token, { backendCheck = false } = {}) {
    if (!validateSettle(token)) {
      if (token && token.roomId) {fenceLifecycle(token, AUTHORITY_CODES.LOST);}
      return { ok: false, code: AUTHORITY_CODES.LOST };
    }
    if (!backendCheck) {return { ok: true, code: null };}
    let result;
    try {
      result = await backend.validate({
        roomId: token.roomId,
        instanceId: token.authorityInstanceId,
        generation: token.authorityGeneration
      });
    } catch (error) {
      result = { ok: false, code: AUTHORITY_CODES.UNAVAILABLE };
    }
    if (!result || result.ok !== true) {
      const code = (result && result.code) || AUTHORITY_CODES.UNAVAILABLE;
      fenceLifecycle(token, code);
      return { ok: false, code };
    }
    if (!validateSettle(token)) {
      fenceLifecycle(token, AUTHORITY_CODES.LOST);
      return { ok: false, code: AUTHORITY_CODES.LOST };
    }
    return { ok: true, code: null };
  }

  async function assertRoomAuthoritative(roomId, options = {}) {
    const lifecycle = lifecycles.get(roomId);
    if (!isActiveLifecycle(lifecycle)) {return { ok: false, code: AUTHORITY_CODES.LOST };}
    return assertCurrent(lifecycle.token, options);
  }

  /**
   * R7: backend-only proof for reactivation after an ambiguous/failed bounded
   * operation (e.g. deletion). Confirms the exact lifecycle still holds an
   * unexpired backend record and restores a quiesced lifecycle to ACTIVE.
   */
  async function assertBackendHeld(token) {
    if (!token || typeof token.roomId !== 'string') {return { ok: false, code: AUTHORITY_CODES.LOST };}
    let result;
    try {
      result = await backend.validate({
        roomId: token.roomId,
        instanceId: token.authorityInstanceId,
        generation: token.authorityGeneration
      });
    } catch (error) {
      result = { ok: false, code: AUTHORITY_CODES.UNAVAILABLE };
    }
    if (!result || result.ok !== true) {
      return { ok: false, code: (result && result.code) || AUTHORITY_CODES.UNAVAILABLE };
    }
    const lifecycle = lifecycles.get(token.roomId);
    if (!lifecycle ||
      lifecycle.token.authorityInstanceId !== token.authorityInstanceId ||
      lifecycle.token.authorityGeneration !== token.authorityGeneration) {
      return { ok: false, code: AUTHORITY_CODES.LOST };
    }
    // R4/R7: reactivation requires the local safe budget to still be valid.
    // An expired local deadline can never be revived from backend proof; the
    // renewal path owns permanent fencing.
    if (lifecycle.state !== LIFECYCLE_STATES.ACTIVE && lifecycle.state !== LIFECYCLE_STATES.QUIESCING) {
      return { ok: false, code: AUTHORITY_CODES.LOST };
    }
    if (now() >= lifecycle.token.localSafeDeadline) {
      return { ok: false, code: AUTHORITY_CODES.LOST };
    }
    if (lifecycle.state === LIFECYCLE_STATES.QUIESCING) {
      lifecycle.state = LIFECYCLE_STATES.ACTIVE;
      markRooms(lifecycle, LIFECYCLE_STATES.ACTIVE);
    }
    return { ok: true, code: null };
  }

  function markDeleted(roomId) {
    const lifecycle = lifecycles.get(roomId);
    if (!lifecycle) {return;}
    stopRenewal(roomId);
    lifecycle.state = LIFECYCLE_STATES.FENCED;
    markRooms(lifecycle, LIFECYCLE_STATES.FENCED);
    lifecycles.delete(roomId);
  }

  function currentToken(roomId) {
    const lifecycle = lifecycles.get(roomId);
    return isActiveLifecycle(lifecycle) || (lifecycle && lifecycle.state === LIFECYCLE_STATES.QUIESCING)
      ? lifecycle.token
      : null;
  }

  function heldTokens() {
    return Array.from(lifecycles.values())
      .filter((lifecycle) => lifecycle.state !== LIFECYCLE_STATES.FENCED)
      .map((lifecycle) => lifecycle.token);
  }

  function heldRoomIds() {
    return heldTokens().map((token) => token.roomId);
  }

  function stopRoom(roomId) {
    stopRenewal(roomId);
    lifecycles.delete(roomId);
  }

  function stopAll() {
    for (const roomId of Array.from(lifecycles.keys())) {stopRoom(roomId);}
  }

  return {
    instanceId,
    leaseDurationMs,
    renewIntervalMs,
    localBudgetMs,
    acquire,
    renew,
    release,
    validateCurrent,
    validateSettle,
    assertCurrent,
    assertSettle,
    assertBackendHeld,
    assertRoomAuthoritative,
    isRoomAuthoritative,
    fenceLocal,
    fenceLifecycle,
    beginQuiesce,
    attachRoom,
    detachRoom,
    markDeleted,
    currentToken,
    heldTokens,
    heldRoomIds,
    stopRoom,
    stopAll
  };
}

/**
 * Shared runtime denial helper for handlers. The room's own captured token is
 * validated against the current lifecycle; a room with no token is denied when
 * an authority service is configured. A stale token can never inherit a
 * successor lifecycle by roomId lookup.
 */
function roomAuthorityDenial(room, authorityService) {
  if (!room || !authorityService || typeof authorityService.validateCurrent !== 'function') {
    return null;
  }
  if (room.authorityFenced === true || room.lifecycleState === 'fenced') {
    return AUTHORITY_CODES.LOST;
  }
  const token = room.authorityToken;
  if (!token) {return AUTHORITY_CODES.LOST;}
  return authorityService.validateCurrent(token) ? null : AUTHORITY_CODES.LOST;
}

/**
 * Shared async guard for authoritative room operations (R2/R5). Validates the
 * room's exact captured token against the local lifecycle AND fresh backend
 * holder/generation/state/expiry, with a post-await local recheck inside
 * assertCurrent. Backend unavailability or mismatch fails closed and fences.
 * When no authority service is configured the operation is not C5-governed and
 * the guard is a no-op.
 * @returns {Promise<{ok: boolean, code: string|null}>}
 */
async function assertFreshRoomAuthority(room, authorityService) {
  if (!room || !authorityService || typeof authorityService.assertCurrent !== 'function') {
    return { ok: true, code: null };
  }
  const token = room.authorityToken || null;
  if (!token) {return { ok: false, code: AUTHORITY_CODES.LOST };}
  return authorityService.assertCurrent(token, { backendCheck: true });
}

/**
 * Immutable operation context carried from the entry guard into a handler's
 * awaited continuations. Handlers must revalidate THIS context (never a
 * freshly looked-up roomId token) before authoritative side effects.
 */
const OPERATION_CONTEXT = Symbol('mythrill.roomAuthorityOperationContext');

function attachOperationContext(data, context) {
  if (!data || typeof data !== 'object') {return false;}
  try {
    Object.defineProperty(data, OPERATION_CONTEXT, {
      value: Object.freeze({ ...context }),
      enumerable: false,
      configurable: false,
      writable: false
    });
    return true;
  } catch (_error) {
    return false;
  }
}

function getOperationContext(data) {
  return data && typeof data === 'object' ? (data[OPERATION_CONTEXT] || null) : null;
}

/**
 * C1: verify the captured operation binding is still the live binding. The
 * ingress guard attaches roomRef/playerRef/socketId; handlers call this before
 * AND after their fresh authority await so an operation can never migrate to a
 * replacement room, replacement player binding or successor runtime.
 * @returns {{ok: boolean, code: string|null}}
 */
function assertOperationBinding(context, runtime = {}) {
  if (!context || !context.roomId) {
    return { ok: false, code: AUTHORITY_CODES.LOST };
  }
  const { rooms, players, socketId } = runtime;
  if (rooms && typeof rooms.get === 'function') {
    if (context.roomRef && rooms.get(context.roomId) !== context.roomRef) {
      return { ok: false, code: AUTHORITY_CODES.LOST };
    }
  }
  if (players && typeof players.get === 'function' && context.playerId) {
    const player = players.get(socketId || context.socketId);
    if (!player ||
      player.id !== context.playerId ||
      player.roomId !== context.roomId ||
      (context.playerRef && player !== context.playerRef) ||
      (context.userId && player.userId !== undefined && player.userId !== context.userId)) {
      return { ok: false, code: AUTHORITY_CODES.LOST };
    }
  }
  if (context.roomRef && context.token) {
    const currentToken = context.roomRef.authorityToken || null;
    if (currentToken &&
      (currentToken.authorityInstanceId !== context.token.authorityInstanceId ||
       currentToken.authorityGeneration !== context.token.authorityGeneration)) {
      return { ok: false, code: AUTHORITY_CODES.LOST };
    }
  }
  return { ok: true, code: null };
}

/**
 * Revalidate a captured operation context after awaits. `settle` allows an
 * ACTIVE or QUIESCING lifecycle (already-captured settlement work); the
 * default requires ACTIVE (new work). The exact original token is validated,
 * never a replacement token resolved by roomId. When `options.binding` is
 * supplied the captured room/player/principal binding is checked BEFORE the
 * fresh authority await and AGAIN after it, so a binding change during the
 * await cannot permit a stale effect or success ACK.
 * @returns {Promise<{ok: boolean, code: string|null}>}
 */
async function assertOperationContext(context, authorityService, options = {}) {
  if (!authorityService || typeof authorityService.assertCurrent !== 'function') {
    return { ok: true, code: null };
  }
  if (!context || !context.token) {return { ok: false, code: AUTHORITY_CODES.LOST };}
  if (options.binding) {
    const preBinding = assertOperationBinding(context, options.binding);
    if (!preBinding.ok) {return preBinding;}
  }
  const result = options.settle === true
    ? await authorityService.assertSettle(context.token, { backendCheck: true })
    : await authorityService.assertCurrent(context.token, { backendCheck: true });
  if (!result || result.ok !== true) {
    return result || { ok: false, code: AUTHORITY_CODES.LOST };
  }
  // C1: the exact binding and token identity must still be current AFTER the
  // fresh authority await.
  if (options.binding) {
    const postBinding = assertOperationBinding(context, options.binding);
    if (!postBinding.ok) {return postBinding;}
  }
  return result;
}

module.exports = {
  LEASE_DURATION_MS,
  RENEW_INTERVAL_MS,
  SAFETY_ALLOWANCE_MS,
  AUTHORITY_CODES,
  LIFECYCLE_STATES,
  createRoomAuthorityService,
  createFirestoreAuthorityBackend,
  roomAuthorityDenial,
  assertFreshRoomAuthority,
  attachOperationContext,
  getOperationContext,
  assertOperationBinding,
  assertOperationContext
};
