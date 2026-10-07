/**
 * Sync Service Module
 * 
 * Contains services for efficient state synchronization:
 * - FirebaseBatchWriter: Bounded room-state persistence with honest outcomes
 * - MovementDebouncer: Debounces token movement updates
 *
 * Project 2 contract: a queued write is only "saved" after the configured
 * persistence path explicitly confirms it. Failed work is retained (newest
 * full snapshot wins) under bounded retry. See firebaseService.js for the
 * bounded room-writer outcome contract.
 */

const logger = require('../services/logger');
const firebaseService = require('../services/firebaseService');
const roomCheckpoint = require('./roomCheckpoint');
const roomCheckpointExport = require('./roomCheckpointExport');

const {
  ROOM_WRITE_OUTCOMES,
  classifyRoomWriteError,
  normalizeRoomWriteOutcome
} = firebaseService;

/**
 * Room persistence status exposed through the status sink. This is ROOM
 * persistence status only; it makes no claim about journal, character,
 * campaign or any other data.
 */
const ROOM_SAVE_STATUS = Object.freeze({
  SAVED: 'saved',
  PENDING: 'pending',
  RETRYING: 'retrying',
  UNSAVED: 'unsaved'
});

/**
 * Safely capture the full snapshot for one queued write. No queued work may
 * hold a mutable room-state reference whose contents can change beneath the
 * writer.
 * @param {Object} gameState
 * @returns {Object}
 */
const cloneRoomSnapshot = (gameState) => {
  if (gameState === null || typeof gameState !== 'object') {return gameState;}
  return JSON.parse(JSON.stringify(gameState));
};

/**
 * Production pre-capture snapshot validation. Rejects unsupported values
 * (NaN/Infinity, functions, symbols/BigInt, non-plain objects such as Map,
 * undefined/sparse array elements, unsafe keys) before P2's JSON clone can
 * normalize them into null/empty.
 * @param {Object} gameState
 * @returns {{error: string|null}}
 */
const validateRoomSnapshot = (gameState) => {
  const validation = roomCheckpoint.canonicalize(gameState, 'gameState');
  return validation.error ? { error: validation.error } : { error: null };
};

/**
 * Firebase Write Batching Service
 *
 * Honest, bounded room persistence:
 * - callers provide FULL room snapshots; the newest snapshot supersedes older
 *   pending snapshots (no deep merge, no array concatenation, deletions kept)
 * - per-room flush serialization: one in-flight write per room; a delayed
 *   older completion can never replace a newer confirmed snapshot
 * - failures retain the newest unsaved snapshot under bounded retry/backoff
 * - retry exhaustion/permanent rejection keeps the snapshot and reports
 *   UNSAVED / recovery-needed instead of discarding it
 */
class FirebaseBatchWriter {
  constructor(flushInterval = 200, maxBatchSize = 50, options = {}) {
    this.pendingWrites = new Map(); // roomId -> room state WITH retained unsaved work
    this.roomStates = new Map(); // roomId -> full status state (kept after save)
    this.flushInterval = flushInterval;
    this.maxBatchSize = maxBatchSize;
    this.maxAttempts = options.maxAttempts || 5;
    this.baseRetryDelayMs = options.baseRetryDelayMs || 500;
    this.maxRetryDelayMs = options.maxRetryDelayMs || 15000;
    this.maxRetainedRooms = options.maxRetainedRooms || 500;
    // Hard bounds. maxTrackedRooms includes saved/pressure status tombstones;
    // maxRetainedRooms bounds rooms with a retained unsaved snapshot;
    // maxWaitersPerRoom bounds outstanding explicit-save promises per room.
    this.maxTrackedRooms = options.maxTrackedRooms || (this.maxRetainedRooms + 50);
    this.maxWaitersPerRoom = options.maxWaitersPerRoom || 10;
    this.shutdownDeadlineMs = options.shutdownDeadlineMs || 5000;
    this.persist = typeof options.persist === 'function' ? options.persist : null;
    this.shouldPersist = typeof options.shouldPersist === 'function'
      ? options.shouldPersist
      : () => true;
    this.captureMetadata = typeof options.captureMetadata === 'function' ? options.captureMetadata : null;
    this.getRoomRevision = typeof options.getRoomRevision === 'function' ? options.getRoomRevision : () => 0;
    this.onConfirmed = typeof options.onConfirmed === 'function' ? options.onConfirmed : null;
    // Optional pre-capture validation. Runs on the raw accepted snapshot before
    // the P2 JSON clone can normalize unsupported values into null/empty.
    this.validateSnapshot = typeof options.validateSnapshot === 'function' ? options.validateSnapshot : null;
    // C5 room authority binding. `captureAuthority` returns the immutable
    // lifecycle token for a room at admission time; `authorityCurrent` verifies
    // a captured token is still the current lifecycle. Retained work keeps its
    // ORIGINAL token forever and is never rebound to a successor generation.
    this.captureAuthority = typeof options.captureAuthority === 'function' ? options.captureAuthority : null;
    this.authorityRequired = options.authorityRequired === true;
    // `authorityCurrent` verifies a captured token may still settle retained
    // work (ACTIVE or QUIESCING). `authorityAccept` gates NEW admissions and
    // must be ACTIVE-only so a quiescing lifecycle accepts no new work.
    this.authorityCurrent = typeof options.authorityCurrent === 'function' ? options.authorityCurrent : null;
    this.authorityAccept = typeof options.authorityAccept === 'function' ? options.authorityAccept : null;
    // R5: fresh backend confirmation hook for a completed attempt. Returns a
    // promise resolving true only while the originating token is still the
    // current authority. A late confirmation after takeover cannot count.
    this.authorityConfirm = typeof options.authorityConfirm === 'function' ? options.authorityConfirm : null;
    this.statusSink = null;
    this.stopped = false;
    this.draining = false;
    this.drainRejections = 0;
    // Bounded evidence that a known unresolved durability loss was evicted
    // from detailed room tracking under maxTrackedRooms pressure. The
    // bounded ID set allows reliable same-room repair; overflow keeps a
    // conservative uncertainty count when the identity can no longer be
    // retained. This is aggregate accounting only - no history database.
    this.maxEvictedUnresolvedTracked = options.maxEvictedUnresolvedTracked || 50;
    this.evictedUnresolvedRooms = new Set();
    this.evictedUnresolvedOverflow = 0;
    // Rooms whose durable deletion has been accepted. No queued, retained or
    // retried snapshot may publish for a suppressed room.
    this.suppressedRooms = new Set();
    this.revisionCounter = 0;
    this.operational = {
      confirmedWrites: 0,
      failedAttempts: 0,
      retriesScheduled: 0,
      retryExhaustions: 0,
      permanentRejections: 0,
      droppedSnapshots: 0,
      rejectedAdmissions: 0
    };
    this.batchInterval = null;
    this.startBatchProcessor();
  }

  /** Wire a status sink, e.g. socket broadcast. Payload is bounded metadata. */
  setStatusSink(sink) {
    this.statusSink = typeof sink === 'function' ? sink : null;
  }

  _nextRevision(roomId) {
    const floor = Number(this.getRoomRevision(roomId));
    if (Number.isSafeInteger(floor) && floor > this.revisionCounter) {
      this.revisionCounter = floor;
    }
    this.revisionCounter += 1;
    return this.revisionCounter;
  }

  _ensureRoomState(roomId) {
    let state = this.roomStates.get(roomId);
    if (state) {return state;}

    // Enforce the tracked-room bound for a NEW record. Retained-snapshot
    // admission is a separate check (`_reserveRetainedSlot`), because a
    // tracked record may legitimately exist without a retained snapshot.
    while (this.roomStates.size >= this.maxTrackedRooms) {
      if (!this._evictOne()) {return null;}
    }

    state = {
      roomId,
      snapshot: null,
      revision: 0,
      attempts: 0,
      inFlight: false,
      status: null,
      retryAt: null,
      confirmedRevision: Number(this.getRoomRevision(roomId)) || 0,
      exhausted: false,
      permanentlyRejected: false,
      lastError: null,
      lastOutcome: null,
      updatedAt: Date.now(),
      waiters: [],
      lastEmitted: null
    };
    this.roomStates.set(roomId, state);
    return state;
  }

  /**
   * Free exactly one tracked room-state slot. Preference order:
   *   1. an idle status tombstone (no retained snapshot) - only status
   *      metadata is lost;
   *   2. the oldest exhausted retained snapshot when the retained bound is
   *      reached - the room is told explicitly, waiters fail, nothing else is
   *      touched;
   *   3. otherwise refuse: never evict in-flight work or retained work while
   *      still under the retained bound.
   * @returns {boolean} whether a slot was freed
   */
  _evictOne() {
    const idle = Array.from(this.roomStates.values()).filter(s => !s.inFlight);

    const tombstone = idle
      .filter(s => !s.snapshot)
      .sort((a, b) => a.updatedAt - b.updatedAt)[0];
    if (tombstone) {
      // Known unresolved durability loss must not silently disappear when its
      // bounded detailed record is evicted.
      if (this._isUnresolved(tombstone)) {
        this._recordEvictedUnresolvedLoss(tombstone);
      }
      this.roomStates.delete(tombstone.roomId);
      this.pendingWrites.delete(tombstone.roomId);
      return true;
    }

    if (this.pendingWrites.size >= this.maxRetainedRooms) {
      const retained = idle
        .filter(s => s.snapshot)
        .sort((a, b) => a.updatedAt - b.updatedAt);
      const target = retained.find(s => s.exhausted) || retained[0];
      if (target) {
        this._dropRetainedSnapshot(target);
        return true;
      }
    }
    return false;
  }

  /**
   * Retained-snapshot admission. A room record may exist without consuming a
   * retained slot (saved status or a retention-loss tombstone); every
   * transition from no retained snapshot to retained work must pass this
   * check, including reactivation of an existing record. Replacing the
   * snapshot of a room that already holds a retained slot reuses that slot.
   * @returns {boolean} whether the room may attach a retained snapshot
   */
  _reserveRetainedSlot(roomId) {
    if (this.pendingWrites.has(roomId)) {return true;}

    let attempts = this.roomStates.size + 1;
    while (this.pendingWrites.size >= this.maxRetainedRooms && attempts > 0) {
      attempts -= 1;
      if (!this._freeRetainedSlot()) {return false;}
    }
    return this.pendingWrites.size < this.maxRetainedRooms;
  }

  /**
   * Free one retained slot by dropping the oldest idle retained snapshot.
   * In-flight attempts are never touched; the affected room is told
   * explicitly via _dropRetainedSnapshot.
   * @returns {boolean} whether a retained slot was freed
   */
  _freeRetainedSlot() {
    const idle = Array.from(this.roomStates.values())
      .filter(state => !state.inFlight && !!state.snapshot);
    if (idle.length === 0) {return false;}
    const target = idle.sort((a, b) => a.updatedAt - b.updatedAt)
      .find(state => state.exhausted) || idle[0];
    this._dropRetainedSnapshot(target);
    return true;
  }

  /**
   * A room is unresolved while its latest accepted state has not been
   * confirmed: either a retained snapshot still needs writing, or the room
   * holds an explicit recovery-needed status with no retry copy left
   * (retention/admission pressure, permanent rejection).
   */
  _isUnresolved(state) {
    if (!state) {return false;}
    return !!state.snapshot || state.status === ROOM_SAVE_STATUS.UNSAVED;
  }

  /**
   * Preserve bounded evidence for a known unresolved loss whose detailed
   * tombstone is evicted. The retained ID set permits reliable same-room
   * repair on a later confirmation; overflow keeps a conservative
   * accounting-uncertainty count when identity can no longer be retained.
   * The mechanism is a bounded counter/set, not a history database.
   */
  _recordEvictedUnresolvedLoss(state) {
    logger.error('Evicting unresolved room-state record under tracked-capacity pressure; preserving aggregate unresolved-loss evidence', {
      roomId: state.roomId,
      status: state.status,
      reason: state.lastError,
      maxTrackedRooms: this.maxTrackedRooms
    });
    if (this.evictedUnresolvedRooms.size < this.maxEvictedUnresolvedTracked) {
      this.evictedUnresolvedRooms.add(state.roomId);
    } else {
      this.evictedUnresolvedOverflow += 1;
    }
  }

  /**
   * Explicitly lose one retained retry snapshot under capacity pressure.
   * Live room memory is untouched; only the queued cloud snapshot is dropped.
   * The room receives an unsaved/recovery-needed status, waiters receive a
   * bounded failure, and the loss is logged and counted - never silent.
   */
  _dropRetainedSnapshot(state) {
    this.operational.droppedSnapshots += 1;
    const revision = state.revision;
    logger.error('Room save retention capacity reached; dropping retained snapshot', {
      roomId: state.roomId,
      revision,
      maxRetainedRooms: this.maxRetainedRooms,
      maxTrackedRooms: this.maxTrackedRooms
    });

    this.pendingWrites.delete(state.roomId);
    state.snapshot = null;
    state.status = ROOM_SAVE_STATUS.UNSAVED;
    state.exhausted = true;
    state.retryAt = null;
    state.lastOutcome = ROOM_WRITE_OUTCOMES.UNAVAILABLE;
    state.lastError = 'retention_pressure';
    state.updatedAt = Date.now();

    this._resolveWaiters(state, revision, {
      outcome: ROOM_WRITE_OUTCOMES.UNAVAILABLE,
      reason: 'retention_pressure',
      revision,
      retriable: false,
      pressure: true
    });
    this._emitStatus(state.roomId, state.authorityToken);
  }

  /**
   * R5/B6: truthful authority-loss outcome for retained work. The retained
   * snapshot is PRESERVED and stays accounted by the existing retained-loss /
   * drain machinery - it is never silently deleted, never retried, and never
   * rebound to a successor generation. Waiters settle as permanent authority
   * loss and the unsaved/recovery evidence remains truthful.
   */
  _loseRetainedWorkToAuthority(roomId, state) {
    const revision = state.revision;
    state.status = ROOM_SAVE_STATUS.UNSAVED;
    state.exhausted = true;
    state.permanentlyRejected = true;
    state.retryAt = null;
    state.lastOutcome = ROOM_WRITE_OUTCOMES.PERMANENT;
    state.lastError = 'room_authority_lost';
    state.updatedAt = Date.now();
    this.operational.permanentRejections += 1;
    this._resolveWaiters(state, revision, {
      outcome: ROOM_WRITE_OUTCOMES.PERMANENT,
      reason: 'room_authority_lost',
      code: 'room_authority_lost',
      retriable: false
    });
    this._emitStatus(roomId, state.authorityToken);
  }

  /**
   * Explicit admission rejection. Increments the operational counter, logs,
   * and (when a status sink is wired) tells the room that this snapshot was
   * NOT retained for retry.
   */
  _emitPressureNotice(roomId, reason) {
    this.operational.rejectedAdmissions += 1;
    if (reason === 'shutdown_in_progress') {this.drainRejections += 1;}
    logger.error('Room save admission rejected under writer pressure', { roomId, reason });

    const state = this.roomStates.get(roomId);
    if (state) {
      // The rejected edit is the room's latest accepted state. Mark it
      // unsaved/recovery-needed so getStatus and status events cannot keep
      // claiming cloud-saved for the old checkpoint.
      state.status = ROOM_SAVE_STATUS.UNSAVED;
      state.exhausted = true;
      state.retryAt = null;
      state.lastOutcome = ROOM_WRITE_OUTCOMES.UNAVAILABLE;
      state.lastError = reason;
      state.updatedAt = Date.now();
      this._emitStatus(roomId, state.authorityToken);
      return;
    }

    if (!this.statusSink) {return;}

    const payload = {
      roomId,
      status: ROOM_SAVE_STATUS.UNSAVED,
      cloudSaved: false,
      confirmedRevision: state ? state.confirmedRevision : 0,
      pendingRevision: null,
      attempts: state ? state.attempts : 0,
      retriable: false,
      recoveryNeeded: true,
      reason,
      timestamp: Date.now()
    };
    try {
      this.statusSink(roomId, payload);
    } catch (error) {
      logger.error('Room save status sink failed', { roomId, error: error.message });
    }
  }

  /**
   * Queue a full room snapshot. Latest snapshot supersedes any older pending
   * snapshot for the same room.
   * @param {string} roomId
   * @param {Object} gameState - FULL room game state snapshot
   * @param {boolean} isCritical - attempt this room's write immediately
   * @returns {number|null} queued revision (null when not queued)
   */
  queueWrite(roomId, gameState, isCritical = false, options = {}) {
    const enqueue = this._enqueue(roomId, gameState, options);
    if (!enqueue.queued) {
      if (enqueue.reason === 'retention_capacity' || enqueue.reason === 'shutdown_in_progress' ||
        enqueue.reason === 'snapshot_invalid') {
        this._emitPressureNotice(roomId, enqueue.reason);
      }
      return null;
    }
    if (isCritical) {
      this._flushRooms({ force: true, only: roomId });
    } else if (this.pendingWrites.size >= this.maxBatchSize) {
      this._flushRooms({});
    }
    return enqueue.revision;
  }

  /**
   * Queue and await the outcome of an explicit save. Resolves as soon as the
   * attempted write for a snapshot at least as new as the request settles.
   * A retryable failure resolves as retryable while background retry keeps
   * the retained snapshot.
   * @param {string} roomId
   * @param {Object} gameState
   * @returns {Promise<{outcome: string, reason: string|null, retriable: boolean, revision: number|null, confirmedRevision: number}>}
   */
  async saveNow(roomId, gameState) {
    const enqueue = this._enqueue(roomId, gameState);
    if (!enqueue.queued) {
      if (enqueue.reason === 'snapshot_invalid') {
        this._emitPressureNotice(roomId, enqueue.reason);
        return {
          outcome: ROOM_WRITE_OUTCOMES.PERMANENT,
          reason: enqueue.error || 'snapshot_validation_failed',
          code: 'CHECKPOINT_INVALID',
          retriable: false,
          revision: null,
          confirmedRevision: 0
        };
      }
      const unavailable = enqueue.reason === 'room_not_persistent' ||
        enqueue.reason === 'writer_stopped' ||
        enqueue.reason === 'shutdown_in_progress' ||
        enqueue.reason === 'retention_capacity';
      if (enqueue.reason === 'room_authority_lost') {
        return {
          outcome: ROOM_WRITE_OUTCOMES.PERMANENT,
          reason: 'room_authority_lost',
          code: 'room_authority_lost',
          retriable: false,
          revision: null,
          confirmedRevision: 0
        };
      }
      if (enqueue.reason === 'retention_capacity' || enqueue.reason === 'shutdown_in_progress') {
        this._emitPressureNotice(roomId, enqueue.reason);
      }
      return {
        outcome: unavailable ? ROOM_WRITE_OUTCOMES.UNAVAILABLE : ROOM_WRITE_OUTCOMES.RETRYABLE,
        reason: enqueue.reason,
        retriable: !unavailable,
        revision: null,
        confirmedRevision: 0
      };
    }

    const state = this.roomStates.get(roomId);
    if (state.waiters.length >= this.maxWaitersPerRoom) {
      // The snapshot is retained and will persist in the background, but this
      // explicit request cannot be given a settlement promise.
      logger.error('Room explicit-save waiter capacity reached', {
        roomId,
        revision: enqueue.revision,
        maxWaitersPerRoom: this.maxWaitersPerRoom
      });
      return {
        outcome: ROOM_WRITE_OUTCOMES.RETRYABLE,
        reason: 'waiter_capacity',
        retriable: true,
        revision: enqueue.revision,
        confirmedRevision: state.confirmedRevision
      };
    }

    return new Promise((resolve) => {
      state.waiters.push({ revision: enqueue.revision, resolve });
      this._flushRooms({ force: true, only: roomId });
    });
  }

  _enqueue(roomId, gameState, options = {}) {
    if (this.stopped) {
      return { queued: false, reason: 'writer_stopped', revision: null };
    }
    if (this.draining) {
      return { queued: false, reason: 'shutdown_in_progress', revision: null };
    }
    if (this.suppressedRooms.has(roomId)) {
      return { queued: false, reason: 'room_deleted', revision: null };
    }
    if (!this.shouldPersist(roomId)) {
      return { queued: false, reason: 'room_not_persistent', revision: null };
    }

    // C5: bind the immutable authority token at admission. A room without
    // current authority cannot admit durable work; stale work is never rebound.
    // C6: a pinned originating token (settling captured movement work) is used
    // exactly as supplied - the writer never resolves a successor by roomId.
    let authorityToken = options.authorityToken || null;
    if (!authorityToken && this.captureAuthority) {
      try {
        authorityToken = this.captureAuthority(roomId);
      } catch (_error) {
        authorityToken = null;
      }
    }
    if (this.authorityRequired && !authorityToken) {
      return { queued: false, reason: 'room_authority_lost', revision: null };
    }
    // R7: NEW work requires ACTIVE authority. QUIESCING lifecycles may settle
    // captured work but must never accept a new snapshot. Fall back to the
    // settle predicate for callers that only wire one hook. A pinned token is
    // always settling work, so the settle predicate is authoritative for it.
    const acceptNewWork = options.authorityToken
      ? (this.authorityCurrent || this.authorityAccept)
      : (this.authorityAccept || this.authorityCurrent);
    if (authorityToken && acceptNewWork && !acceptNewWork(authorityToken)) {
      return { queued: false, reason: 'room_authority_lost', revision: null };
    }

    if (this.validateSnapshot) {
      let validation;
      try {
        validation = this.validateSnapshot(gameState);
      } catch (error) {
        validation = { error: `validation_threw:${error.message}` };
      }
      if (validation && validation.error) {
        logger.error('Room snapshot rejected before capture', { roomId, error: validation.error });
        return { queued: false, reason: 'snapshot_invalid', error: validation.error, revision: null };
      }
    }

    let snapshot;
    try {
      snapshot = cloneRoomSnapshot(gameState);
    } catch (error) {
      logger.error('Failed to snapshot room state; write not queued', { roomId, error: error.message });
      return { queued: false, reason: 'snapshot_failed', revision: null };
    }

    let roomMetadata = null;
    if (this.captureMetadata) {
      try {
        const captured = this.captureMetadata(roomId);
        if (captured !== null && captured !== undefined) {
          roomMetadata = cloneRoomSnapshot(captured);
        }
      } catch (error) {
        logger.error('Failed to capture room metadata; publishing snapshot without it', { roomId, error: error.message });
        roomMetadata = null;
      }
    }

    const revision = this._nextRevision(roomId);
    const state = this._ensureRoomState(roomId);
    if (!state) {
      return { queued: false, reason: 'retention_capacity', revision: null };
    }
    // A tracked record does not imply a retained slot: saved/pressure
    // tombstones carry no snapshot. Every transition to retained work must
    // pass the retained-capacity check, including reactivation of a room
    // whose record already exists.
    if (!this._reserveRetainedSlot(roomId)) {
      return { queued: false, reason: 'retention_capacity', revision: null };
    }
    state.snapshot = snapshot;
    state.revision = revision;
    state.roomMetadata = roomMetadata;
    state.authorityToken = authorityToken;
    state.attempts = 0;
    state.exhausted = false;
    state.permanentlyRejected = false;
    state.retryAt = null;
    state.lastError = null;
    state.updatedAt = Date.now();
    state.status = ROOM_SAVE_STATUS.PENDING;
    this.pendingWrites.set(roomId, state);
    this._emitStatus(roomId, authorityToken);
    return { queued: true, revision };
  }

  /**
   * Start writes for every eligible room. Returns settled results; never
   * throws. Exhausted work is retried only through the shutdown drain's
   * per-room finalization; permanently rejected snapshots are never retried.
   */
  _flushRooms({ force = false, only = null } = {}) {
    if (this.stopped) {return Promise.resolve([]);}

    const now = Date.now();
    const started = [];
    for (const [roomId, state] of this.pendingWrites) {
      if (only !== null && roomId !== only) {continue;}
      if (!state.snapshot || state.inFlight) {continue;}
      if (state.exhausted) {continue;}
      if (!force && state.retryAt && state.retryAt > now) {continue;}
      started.push(this._startWrite(roomId).then(outcome => ({ roomId, outcome })));
    }
    return Promise.all(started);
  }

  /**
   * Flush eligible rooms (respecting retry backoff). Public entry used by the
   * periodic processor.
   */
  flush() {
    return this._flushRooms({});
  }

  /**
   * Bounded, truthful shutdown drain.
   *
   * - freezes new writer admission (`shutdown_in_progress`)
   * - finalizes each unresolved room independently under ONE overall deadline:
   *   an in-flight attempt is observed without starting a second same-room
   *   write; an idle retryable snapshot (including retry-exhausted work) gets
   *   one final attempt; a permanent rejection is not retried; a status-only
   *   retention/admission loss is accounted without a retry
   * - a hung room cannot starve other rooms' independent final attempts
   * - accounts for every unresolved room, with or without a retained
   *   snapshot, and never manufactures success
   * - a never-settling persistence promise cannot block process exit
   *
   * Because admission is frozen and no new same-room attempt starts after the
   * deadline, a late old write can never be overtaken by newer work.
   */
  async drain({ deadlineMs = this.shutdownDeadlineMs } = {}) {
    this.draining = true;
    const deadline = Date.now() + Math.max(0, deadlineMs);
    const remainingMs = () => Math.max(0, deadline - Date.now());

    const unresolvedAtStart = [];
    const perRoomTasks = [];
    let attempted = 0;

    for (const state of this.roomStates.values()) {
      if (!this._isUnresolved(state)) {continue;}
      unresolvedAtStart.push(state.roomId);
      if (state.snapshot) {attempted += 1;}

      if (state.inFlight) {
        // Observe this room's existing attempt only. Never start a second
        // same-room write while it is still in flight.
        perRoomTasks.push(
          Promise.resolve(state.inFlightPromise || Promise.resolve())
            .then(() => 'settled', () => 'settled')
        );
      } else if (state.snapshot && !state.permanentlyRejected) {
        // Independent final bounded attempt, even while another room hangs.
        perRoomTasks.push(
          this._startWrite(state.roomId).then(() => 'settled', () => 'settled')
        );
      }
    }

    let timedOut = false;
    if (perRoomTasks.length > 0) {
      const outcome = await Promise.race([
        Promise.all(perRoomTasks),
        new Promise(resolve => { setTimeout(() => resolve(null), remainingMs()); })
      ]);
      timedOut = outcome === null;
    }

    const unsavedRooms = [];
    let confirmed = 0;
    for (const roomId of unresolvedAtStart) {
      const state = this.roomStates.get(roomId);
      if (state && this._isUnresolved(state)) {
        unsavedRooms.push(roomId);
      } else {
        confirmed += 1;
      }
    }

    // Evicted-but-remembered unresolved losses join the accounting without a
    // final attempt (no snapshot remains). Overflow losses keep an aggregate
    // uncertainty count because their identity was intentionally discarded.
    const unsavedSet = new Set(unsavedRooms);
    for (const roomId of this.evictedUnresolvedRooms) {
      const state = this.roomStates.get(roomId);
      if (!state || this._isUnresolved(state)) {unsavedSet.add(roomId);}
    }
    const finalUnsavedRooms = Array.from(unsavedSet);

    return {
      attempted,
      confirmed,
      unsaved: finalUnsavedRooms.length + this.evictedUnresolvedOverflow,
      unsavedRooms: finalUnsavedRooms,
      evictedUnresolvedLosses: this.evictedUnresolvedOverflow,
      timedOut,
      rejectedDuringDrain: this.drainRejections
    };
  }

  _startWrite(roomId) {
    if (this.suppressedRooms.has(roomId)) {
      this.pendingWrites.delete(roomId);
      this.roomStates.delete(roomId);
      return Promise.resolve(null);
    }
    const state = this.pendingWrites.get(roomId);
    if (!state || state.inFlight || !state.snapshot) {return Promise.resolve(null);}

    // R5: a retained snapshot must never start under a successor generation.
    // Authority loss produces truthful unsaved evidence and settles waiters
    // using the existing loss semantics; nothing is silently discarded.
    if (state.authorityToken && this.authorityCurrent && !this.authorityCurrent(state.authorityToken)) {
      this._loseRetainedWorkToAuthority(roomId, state);
      return Promise.resolve(null);
    }

    const revision = state.revision;
    const snapshot = state.snapshot;
    // One immutable attempt context: later queued snapshots must not mutate the
    // revision, snapshot or metadata belonging to an already-started attempt.
    const attempt = {
      roomId,
      snapshot,
      revision,
      roomMetadata: state.roomMetadata,
      authorityToken: state.authorityToken || null
    };
    state.inFlight = true;
    state.updatedAt = Date.now();

    const persist = this.persist ||
      ((id, snap, context) => firebaseService.updateRoomGameState(id, snap, context));

    const chain = Promise.resolve()
      .then(() => persist(attempt.roomId, attempt.snapshot, {
        revision: attempt.revision,
        roomMetadata: attempt.roomMetadata,
        authority: attempt.authorityToken
      }))
      .then(
        (raw) => normalizeRoomWriteOutcome(raw),
        (error) => {
          logger.error('Room state write threw', { roomId, revision, error: error.message });
          return classifyRoomWriteError(error);
        }
      )
      .then(async(outcome) => {
        // R5: freshly confirm the originating authority after completion. A
        // takeover during the write makes a late confirmed outcome an
        // authority-loss/unsaved result instead of a live acknowledgement.
        if (outcome && outcome.outcome === ROOM_WRITE_OUTCOMES.CONFIRMED &&
          attempt.authorityToken && this.authorityConfirm) {
          let stillCurrent = false;
          try {
            stillCurrent = await this.authorityConfirm(attempt.authorityToken);
          } catch (_error) {
            stillCurrent = false;
          }
          if (!stillCurrent) {
            outcome = {
              outcome: ROOM_WRITE_OUTCOMES.PERMANENT,
              reason: 'room_authority_lost',
              code: 'room_authority_lost',
              retriable: false
            };
          }
        }
        state.inFlight = false;
        state.inFlightPromise = null;
        return this._handleOutcome(roomId, revision, outcome, attempt.authorityToken);
      });

    state.inFlightPromise = chain;
    return chain;
  }

  _handleOutcome(roomId, attemptedRevision, outcome, authorityToken = null) {
    const state = this.roomStates.get(roomId);
    if (!state) {return outcome;}

    // C5: a late confirmation from a stale lifecycle cannot acknowledge the
    // current live save. Convert it to a permanent authority loss before any
    // revision/confirmation bookkeeping.
    if (outcome && outcome.outcome === ROOM_WRITE_OUTCOMES.CONFIRMED &&
      authorityToken && this.authorityCurrent && !this.authorityCurrent(authorityToken)) {
      outcome = {
        outcome: ROOM_WRITE_OUTCOMES.PERMANENT,
        reason: 'room_authority_lost',
        code: 'room_authority_lost',
        retriable: false
      };
    }

    // A newer snapshot was queued while this attempt was in flight. Do not
    // touch the newer pending state; let it flush next. A successful older
    // attempt still advances the highest confirmed revision monotonicly.
    if (state.revision !== attemptedRevision) {
      if (outcome.outcome === ROOM_WRITE_OUTCOMES.CONFIRMED) {
        // Reliable same-room repair of any aggregated evicted-loss evidence.
        this.evictedUnresolvedRooms.delete(roomId);
        if (attemptedRevision > state.confirmedRevision) {
          state.confirmedRevision = attemptedRevision;
          state.lastOutcome = outcome.outcome;
          this.operational.confirmedWrites += 1;
          this._notifyConfirmed(roomId, attemptedRevision, outcome);
        }
      }
      this._resolveWaiters(state, attemptedRevision, outcome);
      this._kickRoom(roomId);
      this._emitStatus(roomId, authorityToken || state.authorityToken);
      return outcome;
    }

    if (outcome.outcome === ROOM_WRITE_OUTCOMES.CONFIRMED) {
      this.evictedUnresolvedRooms.delete(roomId);
      state.confirmedRevision = attemptedRevision;
      state.snapshot = null;
      state.attempts = 0;
      state.retryAt = null;
      state.exhausted = false;
      state.permanentlyRejected = false;
      state.status = ROOM_SAVE_STATUS.SAVED;
      state.lastOutcome = outcome.outcome;
      state.lastError = null;
      this.pendingWrites.delete(roomId);
      this.operational.confirmedWrites += 1;
      this._notifyConfirmed(roomId, attemptedRevision, outcome);
    } else if (outcome.outcome === ROOM_WRITE_OUTCOMES.PERMANENT) {
      state.status = ROOM_SAVE_STATUS.UNSAVED;
      state.exhausted = true;
      state.permanentlyRejected = true;
      state.retryAt = null;
      state.attempts += 1;
      state.lastOutcome = outcome.outcome;
      state.lastError = outcome.reason || 'permanent persistence rejection';
      this.operational.failedAttempts += 1;
      this.operational.permanentRejections += 1;
    } else {
      state.attempts += 1;
      state.lastOutcome = outcome.outcome;
      state.lastError = outcome.reason || 'persistence failure';
      this.operational.failedAttempts += 1;
      if (state.attempts >= this.maxAttempts) {
        state.status = ROOM_SAVE_STATUS.UNSAVED;
        state.exhausted = true;
        state.retryAt = null;
        this.operational.retryExhaustions += 1;
      } else {
        state.status = ROOM_SAVE_STATUS.RETRYING;
        const delay = Math.min(
          this.baseRetryDelayMs * Math.pow(2, state.attempts - 1),
          this.maxRetryDelayMs
        );
        state.retryAt = Date.now() + delay;
        this.operational.retriesScheduled += 1;
      }
    }

    state.updatedAt = Date.now();
    this._resolveWaiters(state, attemptedRevision, outcome);
    this._emitStatus(roomId, authorityToken || state.authorityToken);
    return outcome;
  }

  _kickRoom(roomId) {
    if (this.stopped) {return;}
    const state = this.pendingWrites.get(roomId);
    if (state && state.snapshot && !state.inFlight) {
      this._startWrite(roomId);
    }
  }

  _notifyConfirmed(roomId, revision, outcome) {
    if (!this.onConfirmed) {return;}
    try {
      this.onConfirmed(roomId, {
        revision,
        manifest: (outcome && outcome.manifest) || null
      });
    } catch (error) {
      logger.error('Room confirmed callback failed', { roomId, error: error.message });
    }
  }

  _resolveWaiters(state, attemptedRevision, outcome) {
    if (!state || state.waiters.length === 0) {return;}
    const settled = [];
    const remaining = [];
    for (const waiter of state.waiters) {
      if (waiter.revision <= attemptedRevision) {settled.push(waiter);} else {remaining.push(waiter);}
    }
    state.waiters = remaining;
    for (const waiter of settled) {
      waiter.resolve({
        outcome: outcome.outcome,
        reason: outcome.reason || null,
        code: outcome.code || null,
        revision: attemptedRevision,
        confirmedRevision: state.confirmedRevision,
        retriable: outcome.retriable !== undefined
          ? outcome.retriable === true
          : (outcome.outcome === ROOM_WRITE_OUTCOMES.RETRYABLE ||
            outcome.outcome === ROOM_WRITE_OUTCOMES.UNAVAILABLE),
        pressure: outcome.pressure === true
      });
    }
  }

  _emitStatus(roomId, authorityToken = null) {
    if (!this.statusSink) {return;}
    const state = this.roomStates.get(roomId);
    if (!state) {return;}

    const payload = {
      roomId,
      status: state.status,
      cloudSaved: state.status === ROOM_SAVE_STATUS.SAVED,
      confirmedRevision: state.confirmedRevision,
      pendingRevision: state.snapshot ? state.revision : null,
      attempts: state.attempts,
      retriable: state.status === ROOM_SAVE_STATUS.RETRYING,
      recoveryNeeded: state.status === ROOM_SAVE_STATUS.UNSAVED,
      reason: state.lastError || null,
      timestamp: Date.now()
    };

    const fingerprint = `${payload.status}|${payload.confirmedRevision}|${payload.attempts}|${payload.reason}`;
    if (state.lastEmitted === fingerprint) {return;}
    state.lastEmitted = fingerprint;

    try {
      this.statusSink(roomId, payload, authorityToken);
    } catch (error) {
      logger.error('Room save status sink failed', { roomId, error: error.message });
    }
  }

  /** Current room persistence status (diagnostics/tests/status events). */
  getStatus(roomId) {
    const state = this.roomStates.get(roomId);
    if (!state) {
      if (!this.shouldPersist(roomId)) {
        return {
          roomId,
          status: ROOM_SAVE_STATUS.UNSAVED,
          cloudSaved: false,
          reason: 'room_not_persistent',
          confirmedRevision: 0,
          pendingRevision: null,
          attempts: 0,
          exhausted: false,
          error: null
        };
      }
      return {
        roomId,
        status: null,
        cloudSaved: false,
        reason: null,
        confirmedRevision: 0,
        pendingRevision: null,
        attempts: 0,
        exhausted: false,
        error: null
      };
    }
    return {
      roomId,
      status: state.status,
      cloudSaved: state.status === ROOM_SAVE_STATUS.SAVED,
      reason: null,
      confirmedRevision: state.confirmedRevision,
      pendingRevision: state.snapshot ? state.revision : null,
      attempts: state.attempts,
      exhausted: state.exhausted,
      error: state.lastError
    };
  }

  /** Newest retained unsaved snapshot clone (null when none retained). */
  getRetainedSnapshot(roomId) {
    const state = this.roomStates.get(roomId);
    if (!state || !state.snapshot) {return null;}
    return cloneRoomSnapshot(state.snapshot);
  }

  /** Small operational counters. No room contents, no telemetry platform. */
  getOperationalStats() {
    let inFlight = 0;
    for (const state of this.roomStates.values()) {
      if (state.inFlight) {inFlight += 1;}
    }
    return {
      ...this.operational,
      retainedRooms: this.pendingWrites.size,
      trackedRooms: this.roomStates.size,
      inFlight,
      draining: this.draining,
      evictedUnresolvedTracked: this.evictedUnresolvedRooms.size,
      evictedUnresolvedOverflow: this.evictedUnresolvedOverflow,
      maxAttempts: this.maxAttempts,
      maxRetainedRooms: this.maxRetainedRooms,
      maxTrackedRooms: this.maxTrackedRooms,
      maxWaitersPerRoom: this.maxWaitersPerRoom
    };
  }

  /**
   * Start periodic batch processor
   */
  startBatchProcessor() {
    this.batchInterval = setInterval(() => {
      this.flush().catch(error => {
        logger.error('Batch writer flush failed', { error: error.message });
      });
    }, this.flushInterval);
  }

  /**
   * Stop the periodic processor. Retained snapshots stay in memory; callers
   * that need one final attempt use drain() first.
   */
  stop() {
    this.stopped = true;
    if (this.batchInterval) {
      clearInterval(this.batchInterval);
      this.batchInterval = null;
    }
  }

  /**
   * Bounded deletion coordination: drop retained/retry work for a room whose
   * durable deletion has been accepted and suppress future queued writes so a
   * stale snapshot can never recreate the deleted root.
   */
  forgetRoom(roomId) {
    this.suppressedRooms.add(roomId);
    this.pendingWrites.delete(roomId);
    this.roomStates.delete(roomId);
    this.evictedUnresolvedRooms.delete(roomId);
  }
}

/**
 * Movement Debouncing Service
 * Reduces network spam during token drags
 */
class MovementDebouncer {
  constructor(debounceMs = 50, firebaseBatchWriter = null, options = {}) {
    this.pendingMoves = new Map(); // roomId_tokenId -> {position, velocity, timestamp, playerId}
    this.debounceMs = debounceMs;
    this.flushInterval = null;
    this.flushCallback = null;
    this.firebaseBatchWriter = firebaseBatchWriter;
    // C5: delayed movement output is authoritative room state. A fenced
    // lifecycle must not mutate or broadcast.
    this.authorityValid = typeof options.authorityValid === 'function' ? options.authorityValid : null;
    // R6/R4: fresh backend validation of the ORIGINATING move token at flush.
    // Returns a promise resolving true only while that exact token is the
    // current unexpired backend holder (ACTIVE or QUIESCING).
    this.authoritySettleValid = typeof options.authoritySettleValid === 'function'
      ? options.authoritySettleValid
      : null;
    this.startDebouncer();
  }

  /**
   * Queue a movement update. The originating authority token is captured with
   * the move so buffered work can never migrate into a successor generation.
   *
   * C1: a production movement must be owned by an EXISTING originating mover
   * binding. When a binding is supplied it is validated here and captured
   * immutably (exact player reference, verified UID, room/runtime reference).
   * A missing or mismatched originating player binding is rejected and nothing
   * is queued.
   * @param {string} roomId - Room ID
   * @param {string} tokenId - Token ID
   * @param {Object} moveData - Movement data {position, velocity, playerId, mapId, actionId}
   * @param {Object|null} [authorityToken] - Exact originating authority token
   * @param {{playerRef?: Object, userId?: string|null, roomRef?: Object}|null} [binding]
   * @returns {boolean} true when the movement was queued
   */
  queueMove(roomId, tokenId, moveData, authorityToken = null, binding = null) {
    const key = `${roomId}_${tokenId}`;
    if (binding) {
      const player = binding.playerRef || null;
      if (!player || player.roomId !== roomId) {return false;}
      this.pendingMoves.set(key, {
        roomId,
        tokenId,
        ...moveData,
        authorityToken,
        playerRef: player,
        userId: binding.userId || player.userId || null,
        roomRef: binding.roomRef || null,
        timestamp: Date.now()
      });
      return true;
    }
    this.pendingMoves.set(key, {
      roomId,
      tokenId,
      ...moveData,
      authorityToken,
      timestamp: Date.now()
    });
    return true;
  }

  /**
   * Flush all pending movements.
   *
   * R6/R4: each move is validated against its ORIGINATING authority token with
   * a fresh backend holder/generation/state/expiry check plus the post-await
   * local recheck inside assertSettle. A stale move is discarded without
   * mutation or broadcast; a successor generation can never execute it.
   * @param {Object} io - Socket.io server instance
   * @param {Map} rooms - Rooms map
   * @param {Map} players - Players map
   */
  async flush(io, rooms, players) {
    if (this.pendingMoves.size === 0) {return;}

    const movesToProcess = Array.from(this.pendingMoves.values());
    this.pendingMoves.clear();

    // C6: per-room originating context. The flush must never reduce this to a
    // bare roomId, because a successor runtime may occupy the same id while an
    // older move's authority check is still in flight.
    const affectedRooms = new Map(); // roomId -> { room, token }

    const sameAuthorityIdentity = (a, b) => {
      if (!a || !b) {return a === b;}
      return a.roomId === b.roomId &&
        a.authorityInstanceId === b.authorityInstanceId &&
        a.authorityGeneration === b.authorityGeneration;
    };

    const recordAffectedRoom = (move, room) => {
      const existing = affectedRooms.get(move.roomId);
      if (!existing) {
        affectedRooms.set(move.roomId, { room, token: move.authorityToken || null });
        return;
      }
      if (existing.room === room && sameAuthorityIdentity(existing.token, move.authorityToken)) {return;}
      // Epoch/runtime changed within one flush: only the entry whose runtime
      // is still the registered room may persist. Predecessor work is dropped,
      // never coalesced across epochs.
      if (rooms.get(move.roomId) === room) {
        affectedRooms.set(move.roomId, { room, token: move.authorityToken || null });
      }
    };

    for (const move of movesToProcess) {
      const room = rooms.get(move.roomId);
      if (!room) {continue;}
      // C1: an EXISTING originating mover binding is required. A missing mover
      // is failure, never undefined-continuity, and the exact captured player/
      // room/principal references must still match.
      const boundPlayer = move.playerId ? players.get(move.playerId) : null;
      if (!boundPlayer) {continue;}
      if (move.playerRef && boundPlayer !== move.playerRef) {continue;}
      if (boundPlayer.roomId !== move.roomId) {continue;}
      if (move.roomRef && rooms.get(move.roomId) !== move.roomRef) {continue;}
      if (move.userId && boundPlayer.userId !== undefined && boundPlayer.userId !== move.userId) {continue;}
      // Synchronous local predicate (kept for direct-construction callers).
      if (this.authorityValid && !this.authorityValid(move.authorityToken)) {continue;}
      // Fresh backend fence on the originating token before any effect.
      if (this.authoritySettleValid) {
        let stillHeld = false;
        try {
          stillHeld = await this.authoritySettleValid(move.authorityToken);
        } catch (_error) {
          stillHeld = false;
        }
        if (!stillHeld) {continue;}
      }

      // C1: after the fresh authority await the exact originating runtime and
      // player binding must still be current. A binding change during the
      // await drops the old movement without mutation or broadcast.
      if (rooms.get(move.roomId) !== room) {continue;}
      const currentPlayer = players.get(move.playerId);
      if (!currentPlayer || currentPlayer !== boundPlayer) {continue;}
      if (currentPlayer.roomId !== move.roomId) {continue;}
      if (move.playerRef && currentPlayer !== move.playerRef) {continue;}
      if (move.roomRef && rooms.get(move.roomId) !== move.roomRef) {continue;}

      // Update room state
      if (!room.gameState.tokens) {
        room.gameState.tokens = {};
      }

      const existingToken = room.gameState.tokens[move.tokenId];
      if (existingToken) {
        room.gameState.tokens[move.tokenId] = {
          ...existingToken,
          position: move.position,
          velocity: move.velocity,
          lastMoved: Date.now()
        };

        // Also update map-specific token if available
        const mapId = move.mapId || room.gameState.defaultMapId || 'default';
        if (room.gameState.maps && room.gameState.maps[mapId]) {
          if (!room.gameState.maps[mapId].tokens) {
            room.gameState.maps[mapId].tokens = {};
          }
          room.gameState.maps[mapId].tokens[move.tokenId] = {
            ...existingToken,
            position: move.position,
            velocity: move.velocity,
            lastMoved: Date.now()
          };
        }

        // Broadcast movement to room (the coalesced move carries the action ID
        // of the latest drag position so the initiator can resolve its
        // optimistic update exactly once).
        if (boundPlayer) {
          io.to(move.roomId).emit('token_moved', {
            tokenId: move.tokenId,
            position: move.position,
            velocity: move.velocity,
            mapId: move.mapId,
            ...(move.actionId ? { actionId: move.actionId } : {}),
            movedBy: move.playerId,
            timestamp: Date.now()
          });
        }

        recordAffectedRoom(move, room);
      }
    }

    if (this.firebaseBatchWriter) {
      for (const [roomId, entry] of affectedRooms.entries()) {
        // C6: the exact originating runtime must still be the registered
        // runtime for this id, and its authority identity must still be the
        // originating one. A retired predecessor never schedules a successor
        // save, and queueWrite receives the pinned token - never a lookup.
        if (!entry.room || rooms.get(roomId) !== entry.room) {continue;}
        const currentToken = entry.room.authorityToken || null;
        if (entry.token && currentToken && !sameAuthorityIdentity(currentToken, entry.token)) {continue;}
        if (entry.token && this.authorityValid && !this.authorityValid(entry.token)) {continue;}
        this.firebaseBatchWriter.queueWrite(roomId, entry.room.gameState, false, {
          authorityToken: entry.token
        });
      }
    }
  }

  /**
   * Start debouncer interval
   */
  startDebouncer() {
    this.flushInterval = setInterval(() => {
      if (this.flushCallback) {
        this.flushCallback();
      }
    }, this.debounceMs);
  }

  /**
   * Stop debouncer
   */
  stop() {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
  }
}

/**
 * Create service instances
 * @param {Object} io - Socket.io server instance
 * @param {Map} rooms - Rooms map
 * @param {Map} players - Players map
 * @returns {Object} Service instances
 */
function createSyncServices(io, rooms, players, options = {}) {
  // Authoritative live-room registry: scratch restore must never treat a live
  // in-memory room as an empty destination merely because cloud storage has no
  // durable root yet.
  roomCheckpointExport.registerLiveRoomAuthority(rooms);

  const authorityService = options.authorityService || null;

  const firebaseBatchWriter = new FirebaseBatchWriter(500, 50, {
    // Only cloud-backed rooms intend durability. Temporary rooms stay
    // memory/local-only. Trusted in-memory evidence: a room created as
    // permanent, or loaded/resumed from the cloud with a persistentRoomId.
    shouldPersist: (roomId) => {
      if (!rooms || typeof rooms.get !== 'function') {return true;}
      const room = rooms.get(roomId);
      if (!room) {return false;}
      if (room.deleting === true) {return false;}
      // R7: quiescing/fenced lifecycles accept no new durable work. Existing
      // retained snapshots still drain through the bounded writer path.
      if (room.lifecycleState === 'quiescing' || room.lifecycleState === 'fenced') {return false;}
      return room.isPermanent === true || Boolean(room.persistentRoomId);
    },
    // C5: capture the immutable authority token at snapshot admission and
    // verify the SAME token before a confirmation is allowed to count.
    captureAuthority: authorityService
      ? (roomId) => {
        const room = rooms && typeof rooms.get === 'function' ? rooms.get(roomId) : null;
        return room && room.authorityToken ? room.authorityToken : authorityService.currentToken(roomId);
      }
      : null,
    authorityRequired: Boolean(authorityService),
    // R7: retained work may settle under ACTIVE or QUIESCING authority.
    authorityCurrent: authorityService
      ? (token) => authorityService.validateSettle(token)
      : null,
    // R7: NEW admissions require ACTIVE authority only.
    authorityAccept: authorityService
      ? (token) => authorityService.validateCurrent(token)
      : null,
    // R5: fresh backend confirmation for a completed attempt (settle path).
    authorityConfirm: authorityService
      ? async(token) => {
        const result = await authorityService.assertSettle(token, { backendCheck: true });
        return result.ok === true;
      }
      : null,
    // Capture the small shared room metadata context with the same admission
    // that captures the gameState snapshot; a later edit cannot leak into an
    // older in-flight checkpoint revision.
    captureMetadata: (roomId) => {
      if (!rooms || typeof rooms.get !== 'function') {return null;}
      const room = rooms.get(roomId);
      if (!room) {return null;}
      return {
        name: room.name,
        description: (room.settings && room.settings.description) ?? room.description ?? null,
        settings: room.settings || {},
        provenance: room.pendingProvenance || room.committedProvenance || null,
        explicitConversion: room.pendingExplicitConversion === true,
        migrationRequired: room.migrationRequired === true
      };
    },
    // Per-room durable revision floor: a reconstructed room carries its
    // validated checkpoint revision; the writer must never allocate at or
    // below it, across restarts and status-record eviction.
    getRoomRevision: (roomId) => {
      if (!rooms || typeof rooms.get !== 'function') {return 0;}
      const room = rooms.get(roomId);
      if (!room) {return 0;}
      const raw = room.checkpointRevision ?? (room.checkpoint && room.checkpoint.revision);
      const revision = Number(raw);
      return Number.isSafeInteger(revision) && revision > 0 ? revision : 0;
    },
    // Reject unsupported values before P2's JSON clone can normalize them.
    validateSnapshot: validateRoomSnapshot,
    onConfirmed: (roomId, evidence) => {
      if (!rooms || typeof rooms.get !== 'function') {return;}
      const room = rooms.get(roomId);
      if (!room) {return;}
      const revision = Number(evidence && evidence.revision);
      if (Number.isSafeInteger(revision) && revision > 0) {room.checkpointRevision = revision;}
      if (evidence && evidence.manifest) {
        room.checkpoint = evidence.manifest;
        room.migrationRequired = false;
        if (evidence.manifest.provenance) {room.committedProvenance = evidence.manifest.provenance;}
        room.pendingProvenance = null;
        delete room.pendingExplicitConversion;
      }
    }
  });

  // Bounded status broadcast to CURRENT authoritative room members only - not
  // raw Socket.IO channel membership, which can remain stale after a socket
  // joins another room.
  firebaseBatchWriter.setStatusSink((roomId, payload, authorityToken) => {
    if (!io || typeof io.to !== 'function') {return;}
    const room = rooms && typeof rooms.get === 'function' ? rooms.get(roomId) : null;
    if (!room) {return;}
    // R5/R2: status delivery stays bound to the originating authority epoch.
    // A missing or stale token cannot inherit the successor lifecycle. A
    // quiescing lifecycle may still truthfully report its captured drain.
    if (authorityService) {
      if (!authorityToken || !authorityService.validateSettle(authorityToken)) {return;}
    }

    const deliver = (socketId) => {
      if (!socketId) {return;}
      const member = players && typeof players.get === 'function' ? players.get(socketId) : null;
      if (!member || member.roomId !== roomId) {return;}
      io.to(socketId).emit('room_save_status', payload);
    };

    if (room.players && typeof room.players.forEach === 'function') {
      room.players.forEach((member) => deliver(member && member.socketId));
    }
    if (room.gm) {deliver(room.gm.socketId);}
  });

  const movementDebouncer = new MovementDebouncer(50, firebaseBatchWriter, {
    // R6/R4: fresh backend validation of the move's ORIGINATING token at
    // flush, plus the post-await local settle recheck inside assertSettle. A
    // move without a captured token fails closed while an authority service
    // exists; a successor generation can never execute predecessor movement.
    authoritySettleValid: authorityService
      ? async(token) => {
        const result = await authorityService.assertSettle(token, { backendCheck: true });
        return result.ok === true;
      }
      : null
  });

  // Set up movement debouncer flush callback
  movementDebouncer.flushCallback = () => {
    movementDebouncer.flush(io, rooms, players);
  };

  return {
    firebaseBatchWriter,
    movementDebouncer
  };
}

/**
 * Perform the final bounded flush and report the real result. Never
 * manufactures success: retained snapshots that cannot be confirmed are
 * logged as unresolved and will be lost with the process.
 * @param {Object} services - Service instances
 * @returns {Promise<{attempted: number, confirmed: number, unsaved: number, unsavedRooms: string[], timedOut: boolean, rejectedDuringDrain: number}|null>}
 */
async function performGracefulShutdown(services, options = {}) {
  logger.info('Shutting down gracefully...');

  // R7: quiesce producers BEFORE the bounded drain so no new authoritative
  // work is created while retained snapshots are being settled. Renewal stays
  // alive during the drain so the captured lease still covers it.
  if (services.movementDebouncer) {
    services.movementDebouncer.stop();
  }
  if (typeof options.quiesceRooms === 'function') {
    try {options.quiesceRooms();} catch (error) {
      logger.error('Room quiesce callback failed', { error: error.message });
    }
  }

  let result = null;
  if (services.firebaseBatchWriter) {
    const writer = services.firebaseBatchWriter;
    result = await writer.drain();
    const unresolved = result ? result.unsaved + (result.rejectedDuringDrain || 0) : 0;
    if (result && (result.unsaved > 0 || result.timedOut || result.rejectedDuringDrain > 0)) {
      // Honest shutdown: no manufactured success. Any snapshot still retained
      // here is lost with this process; aggregate evicted-loss evidence keeps
      // this truthful even after detailed tombstones were evicted.
      logger.error('Shutdown could not confirm cloud save for retained room state; unresolved unsaved snapshots will be lost with this process', {
        attempted: result.attempted,
        confirmed: result.confirmed,
        unsaved: result.unsaved,
        unsavedRooms: result.unsavedRooms,
        evictedUnresolvedLosses: result.evictedUnresolvedLosses || 0,
        timedOut: result.timedOut,
        rejectedDuringDrain: result.rejectedDuringDrain,
        unresolved
      });
    } else if (result) {
      logger.info('All pending room state confirmed saved before shutdown', {
        attempted: result.attempted,
        confirmed: result.confirmed
      });
    }
    writer.stop();
  }

  // R7: bounded conditional release of the CAPTURED lifecycles. An unconfirmed
  // release grants nothing; the replacement waits for backend expiry. An
  // overall deadline prevents one slow room from blocking shutdown forever.
  if (options.authorityService) {
    const authorityService = options.authorityService;
    const tokens = typeof authorityService.heldTokens === 'function'
      ? authorityService.heldTokens()
      : [];
    const releaseDeadlineMs = Number.isFinite(options.releaseDeadlineMs) ? options.releaseDeadlineMs : 5000;
    if (tokens.length > 0) {
      const releases = tokens.map(async(token) => {
        try {
          await authorityService.release(token);
        } catch (error) {
          logger.error('Room authority release failed during shutdown', { roomId: token.roomId, error: error.message });
        }
      });
      const timedOut = await Promise.race([
        Promise.all(releases).then(() => false),
        new Promise((resolve) => { setTimeout(() => resolve(true), releaseDeadlineMs); })
      ]);
      if (timedOut) {
        logger.error('Room authority release exceeded the shutdown bound; unconfirmed releases wait for expiry', {
          rooms: tokens.length,
          releaseDeadlineMs
        });
      }
    }
  }

  if (typeof options.detachRooms === 'function') {
    try {options.detachRooms();} catch (error) {
      logger.error('Room detach callback failed', { error: error.message });
    }
  }

  return result;
}

/**
 * Setup graceful shutdown handlers
 * @param {Object} services - Service instances
 */
function setupShutdownHandlers(services, options = {}) {
  const gracefulShutdown = async() => {
    await performGracefulShutdown(services, options);
    process.exit(0);
  };

  process.on('SIGINT', gracefulShutdown);
  process.on('SIGTERM', gracefulShutdown);
}

module.exports = {
  FirebaseBatchWriter,
  MovementDebouncer,
  ROOM_SAVE_STATUS,
  validateRoomSnapshot,
  performGracefulShutdown,
  createSyncServices,
  setupShutdownHandlers
};
