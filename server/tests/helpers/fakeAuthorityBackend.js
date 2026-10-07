/**
 * Project 4 C5 deterministic authority test backend.
 *
 * Two independent process contexts share ONE backend instance that enforces
 * backend time, generations, holder identity and atomic CAS versions — the
 * same semantics the Firestore backend provides in production. No JS mutex is
 * shared between "processes"; only this backend is.
 */

function createFakeAuthorityBackend(options = {}) {
  const docs = new Map(); // roomId -> { instanceId, generation, state, expiresAtMs }
  let backendTimeMs = Number.isFinite(options.startTimeMs) ? options.startTimeMs : 0;
  let unavailable = false;
  let beforeOp = null;

  // Per-room serialization models Firestore transaction atomicity: two
  // concurrent acquires for the same room can never both observe "absent".
  const roomQueues = new Map();
  const withRoomLock = (roomId, task) => {
    const previous = roomQueues.get(roomId) || Promise.resolve();
    const run = previous.then(() => task(), () => task());
    roomQueues.set(roomId, run.then(() => undefined, () => undefined));
    return run;
  };

  const setTime = (ms) => { backendTimeMs = ms; };
  const advance = (ms) => { backendTimeMs += ms; };
  const setUnavailable = (flag) => { unavailable = !!flag; };
  const setBeforeOp = (fn) => { beforeOp = fn; };
  const getDoc = (roomId) => {
    const doc = docs.get(roomId);
    return doc ? { ...doc } : null;
  };
  const setDoc = (roomId, data) => { docs.set(roomId, { ...data }); };
  const expire = (roomId) => {
    const doc = docs.get(roomId);
    if (doc) {doc.expiresAtMs = backendTimeMs - 1;}
  };

  const backend = {
    async acquire({ roomId, instanceId, leaseDurationMs }) {
      if (unavailable) {return { ok: false, code: 'room_authority_unavailable' };}
      if (beforeOp) {await beforeOp({ op: 'acquire', roomId });}
      return withRoomLock(roomId, async() => {
        const doc = docs.get(roomId);
        if (doc) {
          if (doc.state === 'deleted') {return { ok: false, code: 'room_deleted' };}
          if (doc.state === 'held' && doc.expiresAtMs > backendTimeMs) {
            return { ok: false, code: 'room_authority_busy' };
          }
          const generation = doc.generation + 1;
          docs.set(roomId, { instanceId, generation, state: 'held', expiresAtMs: backendTimeMs + leaseDurationMs });
          return { ok: true, generation };
        }
        docs.set(roomId, { instanceId, generation: 1, state: 'held', expiresAtMs: backendTimeMs + leaseDurationMs });
        return { ok: true, generation: 1 };
      });
    },

    async renew({ roomId, instanceId, generation, leaseDurationMs }) {
      if (unavailable) {return { ok: false, code: 'room_authority_unavailable' };}
      if (beforeOp) {await beforeOp({ op: 'renew', roomId });}
      return withRoomLock(roomId, async() => {
        const doc = docs.get(roomId);
        if (!doc || doc.state === 'deleted') {
          return { ok: false, code: doc && doc.state === 'deleted' ? 'room_deleted' : 'room_authority_lost' };
        }
        if (doc.state !== 'held' || doc.instanceId !== instanceId || doc.generation !== generation) {
          return { ok: false, code: 'room_authority_lost' };
        }
        if (doc.expiresAtMs <= backendTimeMs) {return { ok: false, code: 'room_authority_lost' };}
        doc.expiresAtMs = backendTimeMs + leaseDurationMs;
        return { ok: true };
      });
    },

    async release({ roomId, instanceId, generation }) {
      if (unavailable) {return { ok: false, code: 'room_authority_unavailable' };}
      return withRoomLock(roomId, async() => {
        const doc = docs.get(roomId);
        if (!doc || doc.state === 'deleted') {
          return { ok: false, code: doc && doc.state === 'deleted' ? 'room_deleted' : 'room_authority_lost' };
        }
        if (doc.state !== 'held' || doc.instanceId !== instanceId || doc.generation !== generation) {
          return { ok: false, code: 'room_authority_lost' };
        }
        docs.set(roomId, { instanceId: null, generation: doc.generation + 1, state: 'released', expiresAtMs: backendTimeMs });
        return { ok: true };
      });
    },

    async validate({ roomId, instanceId, generation }) {
      if (unavailable) {return { ok: false, code: 'room_authority_unavailable' };}
      return withRoomLock(roomId, async() => {
        const doc = docs.get(roomId);
        if (!doc || doc.state === 'deleted') {
          return { ok: false, code: doc && doc.state === 'deleted' ? 'room_deleted' : 'room_authority_lost' };
        }
        if (doc.state !== 'held' || doc.instanceId !== instanceId || doc.generation !== generation) {
          return { ok: false, code: 'room_authority_lost' };
        }
        if (doc.expiresAtMs <= backendTimeMs) {return { ok: false, code: 'room_authority_lost' };}
        return { ok: true };
      });
    }
  };

  return { backend, setTime, advance, setUnavailable, setBeforeOp, getDoc, setDoc, expire };
}

/**
 * Firestore-shaped fake with real updateTime versioning, lastUpdateTime CAS
 * enforcement on atomic batches, backend readTime and bounded transaction
 * retry on contention. Used to exercise firebaseService authority functions.
 */
function makeCasFakeDb(options = {}) {
  const stored = new Map();
  const versions = new Map();
  let versionCounter = 0;
  let backendTimeMs = 0;
  let beforeCommit = null;
  let afterCommit = null;
  let transactionCommitHook = null;
  let readFailure = false;
  const readFailurePaths = new Set();
  let contentionAttempts = 0;
  let lastTransactionAttempts = 0;

  const bump = (path) => {
    versionCounter += 1;
    versions.set(path, versionCounter);
    return versionCounter;
  };
  // Values are cloned on read and write so stored/read data never alias test
  // fixtures or handler-held objects. Function-valued properties (e.g.
  // Timestamp-like `toMillis`) are preserved by reference.
  const cloneValue = (value) => {
    if (value === null || typeof value !== 'object') {return value;}
    if (value instanceof Date) {return new Date(value.getTime());}
    if (Array.isArray(value)) {return value.map(cloneValue);}
    const out = {};
    for (const [key, entry] of Object.entries(value)) {
      out[key] = typeof entry === 'function' ? entry : cloneValue(entry);
    }
    return out;
  };
  // Firestore set({merge:true}) merges nested maps recursively and honors
  // delete-field sentinels.
  const mergeValue = (target, patch) => {
    const out = (target && typeof target === 'object' && !Array.isArray(target)) ? { ...target } : {};
    for (const [key, value] of Object.entries(patch || {})) {
      if (value && typeof value === 'object' && value.__deleteField) {delete out[key]; continue;}
      if (value && typeof value === 'object' && !Array.isArray(value) &&
        out[key] && typeof out[key] === 'object' && !Array.isArray(out[key])) {
        out[key] = mergeValue(out[key], value);
      } else {
        out[key] = value;
      }
    }
    return out;
  };
  const snapshotFor = (path, readTimeMs = backendTimeMs) => {
    if (readFailure || readFailurePaths.has(path)) {
      throw Object.assign(new Error('backend unavailable'), { code: 'unavailable' });
    }
    const data = stored.get(path);
    return {
      exists: data !== undefined,
      data: () => (data === undefined ? {} : cloneValue(data)),
      updateTime: versions.get(path) || 0,
      readTime: { toMillis: () => readTimeMs }
    };
  };
  const makeRef = (path) => ({
    path,
    get: async() => snapshotFor(path),
    set: async(data, options) => {
      stored.set(path, options && options.merge
        ? mergeValue(stored.get(path) || {}, cloneValue(data))
        : cloneValue(data));
      bump(path);
    },
    update: async(data) => {
      if (!stored.has(path)) {
        throw Object.assign(new Error('document does not exist'), { code: 'not-found' });
      }
      stored.set(path, { ...(stored.get(path) || {}), ...cloneValue(data) });
      bump(path);
    },
    delete: async() => { stored.delete(path); bump(path); },
    collection: (name) => makeCollection(`${path}/${name}`),
    doc: (id) => makeRef(`${path}/${id}`)
  });

  // Collection queries return only DIRECT documents in that collection (never
  // deeper descendants), honor equality/array-contains filters and limit, and
  // explicitly fail unsupported query shapes instead of returning misleading
  // data.
  const queryDocs = (path, filters = [], limitCount = null) => {
    let docs = Array.from(stored.entries())
      .filter(([storedPath]) => {
        if (!storedPath.startsWith(`${path}/`)) {return false;}
        const rest = storedPath.slice(path.length + 1);
        return rest.length > 0 && !rest.includes('/');
      })
      .map(([storedPath, data]) => ({
        id: storedPath.slice(path.length + 1),
        ref: makeRef(storedPath),
        data: () => cloneValue(data),
        updateTime: versions.get(storedPath) || 0
      }));
    for (const filter of filters) {
      docs = docs.filter((doc) => {
        const value = (doc.data() || {})[filter.field];
        if (filter.op === 'array-contains') {return Array.isArray(value) && value.includes(filter.value);}
        return value === filter.value;
      });
    }
    if (Number.isFinite(limitCount)) {docs = docs.slice(0, limitCount);}
    const snapshot = { docs, size: docs.length, empty: docs.length === 0 };
    snapshot.forEach = (fn) => docs.forEach(fn);
    return snapshot;
  };
  const makeCollection = (path) => {
    const build = (filters = [], limitCount = null) => ({
      __isQuery: true,
      path,
      __filters: filters,
      __limit: limitCount,
      doc: (id) => makeRef(`${path}/${id}`),
      where: (field, op, value) => {
        if (op !== '==' && op !== 'array-contains') {
          throw Object.assign(new Error(`unsupported query operator ${op}`), { code: 'unsupported_query' });
        }
        return build([...filters, { field, op, value }], limitCount);
      },
      limit: (n) => build(filters, n),
      get: async() => queryDocs(path, filters, limitCount)
    });
    return build();
  };

  const applyTransforms = (current, patch) => {
    const next = { ...(current || {}) };
    for (const [key, value] of Object.entries(patch || {})) {
      if (value && typeof value === 'object' && value.__deleteField) {delete next[key]; continue;}
      if (value && typeof value === 'object' && Array.isArray(value.__arrayUnion)) {
        const base = Array.isArray(next[key]) ? next[key] : [];
        next[key] = Array.from(new Set([...base, ...value.__arrayUnion]));
        continue;
      }
      if (value && typeof value === 'object' && Array.isArray(value.__arrayRemove)) {
        const base = Array.isArray(next[key]) ? next[key] : [];
        next[key] = base.filter((entry) => !value.__arrayRemove.includes(entry));
        continue;
      }
      if (value && typeof value === 'object' && typeof value.__increment === 'number') {
        next[key] = (Number(next[key]) || 0) + value.__increment;
        continue;
      }
      next[key] = value;
    }
    return next;
  };
  const hasTransform = (data) => Object.values(data || {}).some((value) => value && typeof value === 'object' &&
    (value.__deleteField || Array.isArray(value.__arrayUnion) ||
     Array.isArray(value.__arrayRemove) || typeof value.__increment === 'number'));

  const applyOps = (ops) => {
    for (const op of ops) {
      if (op.type === 'delete') {stored.delete(op.path); bump(op.path); continue;}
      if (op.type === 'create') {
        stored.set(op.path, cloneValue(op.data));
        bump(op.path);
        continue;
      }
      if (op.type === 'update') {
        stored.set(op.path, applyTransforms(stored.get(op.path), cloneValue(op.data)));
        bump(op.path);
        continue;
      }
      const patch = cloneValue(op.data);
      let next;
      if (op.options && op.options.merge) {
        next = mergeValue(stored.get(op.path) || {}, patch);
      } else if (hasTransform(patch)) {
        next = applyTransforms(stored.get(op.path), patch);
      } else {
        next = patch;
      }
      stored.set(op.path, next);
      bump(op.path);
    }
  };

  // Existence semantics are validated for the WHOLE op set before any write so
  // a failed batch/transaction leaves zero partial writes. Two creates for the
  // same document in one batch fail the batch (never last-write-wins).
  const validateOps = (ops) => {
    const pendingCreates = new Set();
    for (const op of ops) {
      if (op.type === 'create') {
        if (stored.has(op.path) || pendingCreates.has(op.path)) {
          throw Object.assign(new Error('document already exists'), { code: 'already-exists' });
        }
        pendingCreates.add(op.path);
      }
      if (op.type === 'update' && !stored.has(op.path) && !pendingCreates.has(op.path)) {
        throw Object.assign(new Error('document does not exist'), { code: 'not-found' });
      }
    }
  };

  const db = {
    collection: (name) => makeCollection(name),
    batch: () => {
      const ops = [];
      return {
        set: (ref, data, options) => {ops.push({ type: 'set', path: ref.path, data, options });},
        create: (ref, data) => {ops.push({ type: 'create', path: ref.path, data });},
        update: (ref, data, precondition) => {ops.push({ type: 'update', path: ref.path, data, precondition });},
        delete: (ref) => {ops.push({ type: 'delete', path: ref.path });},
        commit: async() => {
          if (beforeCommit) {await beforeCommit();}
          for (const op of ops) {
            if (op.type === 'update' && op.precondition && op.precondition.lastUpdateTime !== undefined) {
              const current = versions.get(op.path) || 0;
              if (current !== op.precondition.lastUpdateTime) {
                throw Object.assign(new Error('the stored version does not match the precondition'), { code: 'failed-precondition' });
              }
            }
          }
          validateOps(ops);
          applyOps(ops);
          if (afterCommit) {await afterCommit();}
          return [];
        }
      };
    },
    /**
     * Real staged transaction semantics: reads record document versions,
     * writes are staged, and commit fails with `aborted` when any read
     * document changed version. Retried up to maxAttempts with a fresh read
     * set, so contention resolution emerges from versions — never from a
     * test-supplied "who should win".
     */
    runTransaction: async(fn) => {
      const maxAttempts = Number.isFinite(options.maxAttempts) ? options.maxAttempts : 5;
      let attempt = 0;
      for (;;) {
        attempt += 1;
        // One coherent read snapshot per attempt.
        const attemptReadTimeMs = backendTimeMs;
        const readVersions = new Map();
        const staged = [];
        const transaction = {
          get: async(ref) => {
            if (ref && ref.__isQuery) {
              const querySnapshot = queryDocs(ref.path, ref.__filters || [], ref.__limit ?? null);
              const docs = querySnapshot.docs;
              // Query results join the transaction read-set so a conflicting
              // write to any observed document aborts the commit.
              for (const doc of docs) {readVersions.set(doc.ref.path, versions.get(doc.ref.path) || 0);}
              const snapshot = {
                docs,
                size: docs.length,
                empty: docs.length === 0,
                readTime: { toMillis: () => attemptReadTimeMs }
              };
              snapshot.forEach = (fn) => docs.forEach(fn);
              return snapshot;
            }
            readVersions.set(ref.path, versions.get(ref.path) || 0);
            return snapshotFor(ref.path, attemptReadTimeMs);
          },
          set: (ref, data, options) => {staged.push({ type: 'set', path: ref.path, data, options });},
          create: (ref, data) => {staged.push({ type: 'create', path: ref.path, data });},
          update: (ref, data) => {staged.push({ type: 'update', path: ref.path, data });},
          delete: (ref) => {staged.push({ type: 'delete', path: ref.path });}
        };
        try {
          if (contentionAttempts > 0) {
            contentionAttempts -= 1;
            throw Object.assign(new Error('transaction contention'), { code: 'aborted' });
          }
          const result = await fn(transaction);
          if (transactionCommitHook) {await transactionCommitHook({ attempt });}
          for (const [path, version] of readVersions) {
            if ((versions.get(path) || 0) !== version) {
              throw Object.assign(new Error('transaction read-set conflict'), { code: 'aborted' });
            }
          }
          validateOps(staged);
          applyOps(staged);
          lastTransactionAttempts = attempt;
          return result;
        } catch (error) {
          if (error && error.code === 'aborted' && attempt < maxAttempts) {continue;}
          throw error;
        }
      }
    }
  };

  return {
    db,
    stored,
    versions,
    setBackendTime: (ms) => { backendTimeMs = ms; },
    setBeforeCommit: (fn) => { beforeCommit = fn; },
    setAfterCommit: (fn) => { afterCommit = fn; },
    setTransactionCommitHook: (fn) => { transactionCommitHook = fn; },
    setReadFailure: (flag) => { readFailure = !!flag; },
    setPathReadFailure: (path) => { readFailurePaths.add(path); },
    setTransactionContention: (attempts) => { contentionAttempts = attempts; },
    getLastTransactionAttempts: () => lastTransactionAttempts,
    setDocument: (path, data) => { stored.set(path, cloneValue(data)); bump(path); },
    getDocument: (path) => cloneValue(stored.get(path)),
    hasDocument: (path) => stored.has(path),
    getVersion: (path) => versions.get(path) || 0
  };
}

module.exports = { createFakeAuthorityBackend, makeCasFakeDb };
