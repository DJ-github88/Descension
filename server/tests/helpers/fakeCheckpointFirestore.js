/**
 * Project 3 test double for the Firestore external boundary.
 *
 * Implements the P3 contract surface: one atomic batch per publication plus a
 * coherent read-only transaction read. Committed data only becomes visible
 * after commit() resolves, which is what the atomicity tests rely on.
 */

const Module = require('module');

const silentLogger = { debug() {}, info() {}, warn() {}, error() {} };

function makeFakeDb() {
  const stored = new Map();
  const batchCommits = [];
  const collectionReads = [];
  let behavior = () => null;
  let updateTimeCounter = 0;
  let beforeTransaction = null;
  let readFailure = false;

  const applyTransforms = (current, data) => {
    const next = { ...(current || {}) };
    for (const [key, value] of Object.entries(data || {})) {
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

  const applyOps = (ops) => {
    for (const op of ops) {
      if (op.type === 'delete') {stored.delete(op.path); continue;}
      if (op.type === 'update' || op.type === 'set') {
        stored.set(op.path, applyTransforms(stored.get(op.path), op.data));
        continue;
      }
      stored.set(op.path, op.data);
    }
  };

  const makeRef = (path) => ({
    path,
    update: (data) => { stored.set(path, { ...(stored.get(path) || {}), ...data }); return Promise.resolve(); },
    set: (data) => { stored.set(path, data); return Promise.resolve(); },
    delete: () => { stored.delete(path); return Promise.resolve(); },
    get: async() => {
      let data = stored.get(path);
      if (data === undefined && path.startsWith('roomAuthorities/')) {
        // Test fixture: every room has a current held authority record so the
        // mandatory-authority persistence boundary can be exercised.
        data = {
          authorityInstanceId: 'test-instance',
          authorityGeneration: 1,
          state: 'held',
          expiresAt: 9_000_000_000_000
        };
        stored.set(path, data);
      }
      return {
        exists: data !== undefined,
        data: () => data || {},
        updateTime: data !== undefined ? `ts-${++updateTimeCounter}` : null,
        readTime: { toMillis: () => 0 }
      };
    },
    collection: (name) => makeCollection(`${path}/${name}`),
    doc: (id) => makeRef(`${path}/${id}`)
  });

  const makeCollection = (path) => {
    const collection = {
      path,
      __isQuery: true,
      doc: (id) => makeRef(`${path}/${id}`),
      get: async() => {
        collectionReads.push(path);
        const docs = Array.from(stored.entries())
          .filter(([storedPath]) => storedPath.startsWith(`${path}/`))
          .map(([storedPath, data]) => ({ id: storedPath.slice(path.length + 1), data: () => data, updateTime: `ts-${++updateTimeCounter}` }));
        return { docs, empty: docs.length === 0 };
      },
      listDocuments: async() => [],
      where: () => collection
    };
    return collection;
  };

  const db = {
    collection: (name) => makeCollection(name),
    batch: () => {
      const ops = [];
      return {
        set: (ref, data) => { ops.push({ type: 'set', path: ref.path, data }); },
        create: (ref, data) => { ops.push({ type: 'create', path: ref.path, data }); },
        update: (ref, data, precondition) => { ops.push({ type: 'update', path: ref.path, data, precondition }); },
        delete: (ref) => { ops.push({ type: 'delete', path: ref.path }); },
        commit: () => {
          batchCommits.push({ ops: ops.slice() });
          const result = behavior(ops);
          if (result && typeof result.then === 'function') {
            return result.then((value) => {
              if (value === 'reject') {throw Object.assign(new Error('batch rejected'), { code: 'unavailable' });}
              applyOps(ops);
              if (value === 'applied-lost-ack') {
                throw Object.assign(new Error('ack lost after commit'), { code: 'unavailable' });
              }
              return [];
            });
          }
          if (result === 'reject') {
            return Promise.reject(Object.assign(new Error('batch rejected'), { code: 'unavailable' }));
          }
          applyOps(ops);
          if (result === 'applied-lost-ack') {
            return Promise.reject(Object.assign(new Error('ack lost after commit'), { code: 'unavailable' }));
          }
          return Promise.resolve([]);
        }
      };
    },
    runTransaction: async(fn) => {
      if (readFailure) {throw Object.assign(new Error('read unavailable'), { code: 'unavailable' });}
      if (beforeTransaction) {await beforeTransaction();}
      return fn({
        get: async(refOrQuery) => {
          if (refOrQuery && refOrQuery.__isQuery) {
            collectionReads.push(refOrQuery.path);
            const docs = Array.from(stored.entries())
              .filter(([storedPath]) => storedPath.startsWith(`${refOrQuery.path}/`))
              .map(([storedPath, data]) => ({ id: storedPath.slice(refOrQuery.path.length + 1), data: () => data, updateTime: `ts-${++updateTimeCounter}` }));
            return { docs, empty: docs.length === 0 };
          }
          const data = stored.get(refOrQuery.path);
          return {
            exists: data !== undefined,
            data: () => data || {},
            updateTime: data !== undefined ? `ts-${++updateTimeCounter}` : null,
            readTime: { toMillis: () => 0 }
          };
        }
      });
    }
  };

  return {
    db,
    stored,
    batchCommits,
    collectionReads,
    setBehavior: (fn) => { behavior = fn; },
    setBeforeTransaction: (fn) => { beforeTransaction = fn; },
    setReadFailure: (flag) => { readFailure = !!flag; },
    setDocument: (path, data) => { stored.set(path, data); }
  };
}

function loadFirebaseServiceWithFakeDb(db) {
  const admin = {
    initializeApp: () => {},
    firestore: () => db,
    credential: { cert: () => ({}) },
    apps: [],
    app: () => ({ options: { projectId: 'test-project' } })
  };
  admin.firestore.FieldValue = {
    serverTimestamp: () => ({ __serverTimestamp: true }),
    delete: () => ({ __deleteField: true }),
    arrayUnion: (...values) => ({ __arrayUnion: values }),
    arrayRemove: (...values) => ({ __arrayRemove: values }),
    increment: (value) => ({ __increment: value })
  };
  admin.firestore.Timestamp = {
    fromMillis: (ms) => ({ toMillis: () => ms, __ms: ms })
  };

  const servicePath = require.resolve('../../services/firebaseService');
  const loggerPath = require.resolve('../../services/logger');
  const hadService = require.cache[servicePath];
  const hadLogger = require.cache[loggerPath];

  const originalLoad = Module._load;
  const originalEmulator = process.env.FIRESTORE_EMULATOR_HOST;
  process.env.FIRESTORE_EMULATOR_HOST = '127.0.0.1:1';

  delete require.cache[servicePath];
  delete require.cache[loggerPath];
  Module._load = function(request, parent) {
    if (request === 'firebase-admin') {return admin;}
    if (request === './logger' && parent && /services[\\/]firebaseService\.js$/.test(parent.filename)) {return silentLogger;}
    return originalLoad.apply(this, arguments);
  };

  try {
    const service = require('../../services/firebaseService');
    return {
      service,
      admin,
      restore: () => {
        Module._load = originalLoad;
        delete require.cache[servicePath];
        delete require.cache[loggerPath];
        if (hadService) {require.cache[servicePath] = hadService;}
        if (hadLogger) {require.cache[loggerPath] = hadLogger;}
        if (originalEmulator === undefined) {delete process.env.FIRESTORE_EMULATOR_HOST;}
        else {process.env.FIRESTORE_EMULATOR_HOST = originalEmulator;}
      }
    };
  } catch (error) {
    Module._load = originalLoad;
    throw error;
  }
}

const buildGameState = ({ mapCount = 1, extraMap = {}, globalExtra = {} } = {}) => {
  const maps = {};
  for (let index = 0; index < mapCount; index += 1) {
    const mapId = index === 0 ? 'default' : `map-${index}`;
    maps[mapId] = {
      id: mapId,
      name: mapId,
      tokens: {},
      characterTokens: {},
      gridItems: {},
      terrainData: {},
      wallData: {},
      environmentalObjects: [],
      drawingPaths: [],
      drawingLayers: [],
      fogOfWarData: {},
      fogOfWarPaths: [],
      fogErasePaths: [],
      exploredAreas: {},
      lightSources: {},
      dndElements: [],
      ...(index === 0 ? extraMap : {})
    };
  }
  return {
    characters: {},
    combat: { isActive: false, currentTurnIndex: null, turnOrder: [], round: 0 },
    defaultMapId: 'default',
    playerMapAssignments: {},
    maps,
    tokens: {},
    characterTokens: {},
    gridItems: {},
    mapData: { backgrounds: [], activeBackgroundId: null, cameraPosition: { x: 0, y: 0 }, zoomLevel: 1 },
    ...globalExtra
  };
};

module.exports = {
  makeFakeDb,
  loadFirebaseServiceWithFakeDb,
  buildGameState,
  silentLogger
};
