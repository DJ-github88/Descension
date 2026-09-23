/**
 * Firestore Diagnostics
 *
 * Development-only instrumentation for Firestore reads, writes and snapshot
 * listeners. Logs a single line per operation so cascades are obvious:
 *
 *   [Firestore Read] Collection: community_spells | Count: 20 | Source: CommunitySpellsTab.jsx:52
 *   [Firestore Write] Collection: presence | Op: setDoc | Path: presence/abc | Source: presenceService.js:75
 *   [Firestore Listener] Collection: presence | Added: 1 | Modified: 0 | Removed: 0 | Total: 42 | Source: presenceService.js:303
 *
 * Enabled automatically in development. Control at runtime from the console:
 *   window.__firestoreDiagnostics.disable()
 *   window.__firestoreDiagnostics.enable()
 *   window.__firestoreDiagnostics.report()   // per-collection totals
 *   window.__firestoreDiagnostics.reset()
 *
 * In production this module is inert (every function early-returns).
 */

const isDev = process.env.NODE_ENV !== 'production';

let enabled = isDev;
let listenerCount = 0;

const totals = {
  reads: 0,
  writes: 0,
  listenerEvents: 0,
  byCollection: {}
};

const bump = (collection, key, count) => {
  const bucket = (totals.byCollection[collection] = totals.byCollection[collection] || {
    reads: 0,
    writes: 0,
    listenerEvents: 0
  });
  bucket[key] += count;
};

const readFlag = () => {
  try {
    const stored = window.localStorage.getItem('mythrill:firestore-debug');
    if (stored === '0') return false;
    if (stored === '1') return true;
  } catch (e) {
    /* localStorage unavailable */
  }
  return null;
};

if (isDev && typeof window !== 'undefined') {
  const flag = readFlag();
  if (flag !== null) enabled = flag;

  window.__firestoreDiagnostics = {
    enable: () => {
      enabled = true;
      try {
        window.localStorage.setItem('mythrill:firestore-debug', '1');
      } catch (e) {
        /* noop */
      }
      console.log('[Firestore Diagnostics] enabled');
    },
    disable: () => {
      enabled = false;
      try {
        window.localStorage.setItem('mythrill:firestore-debug', '0');
      } catch (e) {
        /* noop */
      }
      console.log('[Firestore Diagnostics] disabled');
    },
    report: () => {
      console.table(
        Object.entries(totals.byCollection).map(([collection, t]) => ({
          collection,
          reads: t.reads,
          writes: t.writes,
          listenerEvents: t.listenerEvents
        }))
      );
      return { ...totals, activeListeners: listenerCount };
    },
    reset: () => {
      totals.reads = 0;
      totals.writes = 0;
      totals.listenerEvents = 0;
      totals.byCollection = {};
      console.log('[Firestore Diagnostics] totals reset');
    },
    isEnabled: () => enabled
  };
}

/**
 * Best-effort caller identification from the stack. Returns "file.js:line"
 * (with function name when available) so log lines point at the component or
 * hook that triggered the operation.
 */
export const getCallerSource = (skip = 2) => {
  if (!enabled) return null;
  try {
    const stack = new Error().stack || '';
    const lines = stack.split('\n').slice(skip);
    for (const line of lines) {
      if (line.includes('firestoreDiagnostics')) continue;
      if (line.includes('node_modules')) continue;
      const match = line.match(/(?:at\s+)?(?:([\w$.<>[\]]+)\s+\()?(?:.*[\\/])?([\w.-]+\.(?:jsx?|tsx?|mjs)):(\d+):(\d+)/);
      if (match) {
        const fn = match[1];
        const file = match[2];
        const lineNo = match[3];
        return fn && !fn.startsWith('Object.') ? `${file}:${lineNo} (${fn})` : `${file}:${lineNo}`;
      }
    }
  } catch (e) {
    /* stack unavailable */
  }
  return 'unknown';
};

const describeCollection = (collection) => {
  if (!collection) return 'unknown';
  if (typeof collection === 'string') return collection;
  if (collection.path) return collection.path;
  return 'unknown';
};

/**
 * Log a one-shot read. Prefer `withReadDiagnostics` when wrapping a service call.
 */
export const logFirestoreRead = ({ collection, count = 0, source, op = 'getDocs' }) => {
  if (!enabled) return;
  const name = describeCollection(collection);
  totals.reads += 1;
  bump(name, 'reads', 1);
  console.log(`[Firestore Read] Collection: ${name} | Count: ${count} | Op: ${op} | Source: ${source || getCallerSource(3)}`);
};

/**
 * Log a write. Prefer `withWriteDiagnostics` when wrapping a service call.
 */
export const logFirestoreWrite = ({ collection, op = 'write', path, count = 1, source }) => {
  if (!enabled) return;
  const name = describeCollection(collection) || (path ? path.split('/')[0] : 'unknown');
  totals.writes += 1;
  bump(name, 'writes', 1);
  console.log(`[Firestore Write] Collection: ${name} | Op: ${op} | Count: ${count}${path ? ` | Path: ${path}` : ''} | Source: ${source || getCallerSource(3)}`);
};

/**
 * Log a snapshot listener event with doc-change deltas. Call this inside every
 * onSnapshot callback to spot read amplification (large Modified counts) and
 * listener fan-out.
 */
export const logFirestoreSnapshot = ({ collection, changes, total, source }) => {
  if (!enabled) return;
  const name = describeCollection(collection);
  const added = changes ? changes.filter((c) => c.type === 'added').length : 0;
  const modified = changes ? changes.filter((c) => c.type === 'modified').length : 0;
  const removed = changes ? changes.filter((c) => c.type === 'removed').length : 0;
  totals.listenerEvents += 1;
  bump(name, 'listenerEvents', 1);
  console.log(
    `[Firestore Listener] Collection: ${name} | Added: ${added} | Modified: ${modified} | Removed: ${removed}` +
      `${total !== undefined ? ` | Total: ${total}` : ''} | Source: ${source || getCallerSource(3)}`
  );
};

export const trackListener = (delta = 1) => {
  listenerCount += delta;
  if (listenerCount < 0) listenerCount = 0;
  return listenerCount;
};

/**
 * Wrap an async read operation (getDocs/getDoc) with logging.
 *   const snap = await withReadDiagnostics('community_spells', () => getDocs(q));
 */
export const withReadDiagnostics = async (collection, run, options = {}) => {
  const result = await run();
  if (enabled) {
    const size = result?.size ?? (result?.docs ? result.docs.length : result?.exists?.() ? 1 : 0);
    logFirestoreRead({ collection, count: size, source: options.source, op: options.op || 'getDocs' });
  }
  return result;
};

/**
 * Wrap an async write operation (addDoc/setDoc/updateDoc/deleteDoc) with logging.
 */
export const withWriteDiagnostics = async (collection, run, options = {}) => {
  const result = await run();
  if (enabled) {
    logFirestoreWrite({
      collection,
      op: options.op || 'write',
      path: options.path,
      count: options.count || 1,
      source: options.source
    });
  }
  return result;
};

export const isDiagnosticsEnabled = () => enabled;
