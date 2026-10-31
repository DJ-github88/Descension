/**
 * Storage growth: duplicate recovery forks (prevention) and lossless recovery of
 * an already-full profile. Real production modules and a real jsdom localStorage;
 * the only double is a Web Locks shim and, for quota, a throwing Storage.setItem.
 */
const path = require('path');
const ROOT = path.resolve(__dirname, '../..');

function harness(scopeId = 'owner-a') {
  const gate = require(`${ROOT}/persistence/bootstrapPrivacyGate`);
  const { createUserScope } = require(`${ROOT}/persistence/scopeModel`);
  const scope = createUserScope(scopeId);
  gate.resetBootstrapGateForTests();
  gate.activatePrivateScope(scope);
  const tails = new Map();
  Object.defineProperty(navigator, 'locks', {
    configurable: true,
    value: {
      request(name, opt, cb) {
        const callback = typeof opt === 'function' ? opt : cb;
        const run = (tails.get(name) || Promise.resolve()).then(() => callback({ name }));
        tails.set(name, run.catch(() => {}));
        return run;
      }
    }
  });
  return { gate, scope };
}
const snapshot = () => Object.fromEntries(Object.keys(localStorage).map((k) => [k, localStorage.getItem(k)]));
const forkKeys = (family) => Object.keys(localStorage).filter((k) => k.includes(`:${family}:`));
const state = (items) => ({ state: { items }, version: 0 });
const engines = () => {
  const { createScopedStoreStorage } = require(`${ROOT}/persistence/scopedStoreStorage`);
  return createScopedStoreStorage({ familyId: 'core.inventory' });
};
// The production stale path: a second writer moves the durable winner under a reader.
async function staleEngine(winnerItems) {
  const first = engines();
  first.getItem('inventory-storage');
  const stale = engines();
  stale.getItem('inventory-storage');
  first.setItem('inventory-storage', state(winnerItems));
  await first.__flush();
  return stale;
}

beforeEach(() => {
  jest.restoreAllMocks();
  jest.resetModules();
  localStorage.clear();
  sessionStorage.clear();
});

describe('prevention — identical stale payloads reuse their durable copy', () => {
  it('G1 hundreds of identical updates, across reloads and engines, keep exactly one copy', async () => {
    harness();
    const seed = engines();
    seed.setItem('inventory-storage', state(['base']));
    await seed.__flush();
    const candidate = state(['unresolved-roll-1d20=14', 'command:cmd-1']);
    let stale = await staleEngine(['winner-1']);
    for (let i = 0; i < 150; i += 1) stale.setItem('inventory-storage', candidate);
    await stale.__flush();
    expect(forkKeys('core.inventory')).toHaveLength(1);
    const evidence = snapshot();

    // Reload: no in-memory memory of the earlier copy at all.
    jest.resetModules();
    harness();
    stale = await staleEngine(['winner-2']);
    for (let i = 0; i < 150; i += 1) stale.setItem('inventory-storage', { version: 0, state: { items: candidate.state.items } });
    await stale.__flush();
    expect(forkKeys('core.inventory')).toHaveLength(1);
    // Only the shared winner moved; the retained copy is byte-identical.
    const after = snapshot();
    const fork = forkKeys('core.inventory')[0];
    expect(after[fork]).toBe(evidence[fork]);
  });

  it('G2 genuinely changed candidates are each preserved exactly once', async () => {
    harness();
    const seed = engines();
    seed.setItem('inventory-storage', state(['base']));
    await seed.__flush();
    const stale = await staleEngine(['winner']);
    const candidates = [state(['a']), state(['a', 'b']), state(['pending-command-17']), state(['retained-die-d6=5'])];
    for (let round = 0; round < 3; round += 1) {
      for (const c of candidates) stale.setItem('inventory-storage', c);
      await stale.__flush();
    }
    const forks = forkKeys('core.inventory');
    expect(forks).toHaveLength(candidates.length);
    const payloads = forks.map((k) => JSON.parse(localStorage.getItem(k)).payload.state.items).map((i) => i.join('|')).sort();
    expect(payloads).toEqual(['a', 'a|b', 'pending-command-17', 'retained-die-d6=5'].sort());
  });

  it('G3 an altered or resolved copy is never treated as a match', async () => {
    harness();
    const seed = engines();
    seed.setItem('inventory-storage', state(['base']));
    await seed.__flush();
    const stale = await staleEngine(['winner']);
    stale.setItem('inventory-storage', state(['x']));
    await stale.__flush();
    const [key] = forkKeys('core.inventory');
    const env = JSON.parse(localStorage.getItem(key));
    localStorage.setItem(key, JSON.stringify({ ...env, dirty: false })); // resolved
    jest.resetModules();
    harness();
    const again = await staleEngine(['winner-2']);
    again.setItem('inventory-storage', state(['x']));
    await again.__flush();
    expect(forkKeys('core.inventory')).toHaveLength(2);
    expect(JSON.parse(localStorage.getItem(key)).dirty).toBe(false);
  });

  it('G5 a real store payload (actions, Dates, undefined) matches its stored JSON copy — production duplicate path', async () => {
    harness();
    const seed = engines();
    seed.setItem('inventory-storage', state(['base']));
    await seed.__flush();
    // zustand persist hands the engine the WHOLE store state: data plus action functions,
    // Dates and undefined members. Only the JSON form is stored.
    const live = () => ({
      state: {
        items: [{ id: 'rope', acquiredAt: new Date('2026-10-29T20:05:34.000Z'), note: undefined }],
        currency: { gold: 29 },
        encumbranceState: 'normal',
        addItem: () => {},
        removeItem() {},
        updateEncumbranceState: function updateEncumbranceState() {}
      },
      version: 0
    });
    // The page-load cycle: reset to initial, rehydrate through several states, then repeat.
    const stale = await staleEngine(['winner']);
    for (let cycle = 0; cycle < 4; cycle += 1) {
      stale.setItem('inventory-storage', live());
      stale.setItem('inventory-storage', { state: { ...live().state, currency: { gold: 30 } }, version: 0 });
    }
    await stale.__flush();
    expect(forkKeys('core.inventory')).toHaveLength(2);
    // A new page load (new writer instance, no memory) still reuses the stored copies.
    jest.resetModules();
    harness();
    const later = await staleEngine(['winner-2']);
    for (let cycle = 0; cycle < 4; cycle += 1) later.setItem('inventory-storage', live());
    await later.__flush();
    expect(forkKeys('core.inventory')).toHaveLength(2);
    const stored = JSON.parse(localStorage.getItem(forkKeys('core.inventory')[0])).payload.state;
    expect(stored.addItem).toBeUndefined();
    expect(typeof stored.items[0].acquiredAt).toBe('string');
  });

  it('G4 quota refusal keeps the candidate, stays visible and is retried to a single copy', async () => {
    harness();
    const seed = engines();
    seed.setItem('inventory-storage', state(['base']));
    await seed.__flush();
    const stale = await staleEngine(['winner']);
    const before = snapshot();
    const candidate = state(['unresolved-command-and-roll']);
    const spy = jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw new Error('QuotaExceededError'); });
    try {
      stale.setItem('inventory-storage', candidate);
      const [result] = await stale.__flush();
      expect(result.status).toBe('STORAGE_ERROR');
      expect(result.reason).toMatch(/Quota/);
      expect(stale.__hasRefusedCandidate()).toBe(true);
      expect(snapshot()).toEqual(before);
    } finally { spy.mockRestore(); }
    expect(stale.__retryRefused()).toBe(1);
    await stale.__flush();
    expect(stale.__hasRefusedCandidate()).toBe(false);
    expect(forkKeys('core.inventory')).toHaveLength(1);
  });
});

// What older builds left behind: many byte-identical recovery forks per payload.
function legacyForks(family, payload, count, scope, startAt = 0) {
  const { createDraftEnvelope } = require(`${ROOT}/persistence/draftEnvelope`);
  const { buildScopedKey } = require(`${ROOT}/persistence/keyFormat`);
  const keys = [];
  for (let i = 0; i < count; i += 1) {
    const draftId = `0_legacy${startAt + i}_${'f'.repeat(12)}~writer_old_${startAt + i}`;
    const env = createDraftEnvelope({
      scope, draftId, payload, localRevision: 1,
      sourceProvenance: { kind: 'fork', sourceKey: null, sourceId: null, importedFromDraftId: null, sourceFingerprint: null, sourceSchemaVersion: null, sourceScopeKind: null, sourceScopeId: null }
    });
    const stamped = { ...env, updatedAt: new Date(Date.UTC(2026, 9, 29, 18, 0, startAt + i)).toISOString() };
    const key = buildScopedKey({ scope, familyId: family, locator: [draftId] });
    localStorage.setItem(key, JSON.stringify(stamped));
    keys.push(key);
  }
  return keys;
}

describe('recovery — an already-full profile is compacted losslessly and only on request', () => {
  const FAMILIES = ['core.inventory', 'core.characterTokens'];
  const compaction = () => require(`${ROOT}/persistence/recoveryCompaction`);

  function fullProfile(scope) {
    const dupA = legacyForks('core.inventory', state(['stale-A']), 40, scope, 0);
    const dupB = legacyForks('core.characterTokens', { state: { characterTokens: [], windowSize: { width: 900, height: 650 } }, version: 0 }, 60, scope, 100);
    const unique = [
      ...legacyForks('core.inventory', state(['pending-command-9']), 1, scope, 300),
      ...legacyForks('core.inventory', state(['retained-die-d8=3']), 1, scope, 400)
    ];
    // Same payload as dupA but a different provenance (derived from a source): not a twin.
    const { createDraftEnvelope } = require(`${ROOT}/persistence/draftEnvelope`);
    const { buildScopedKey } = require(`${ROOT}/persistence/keyFormat`);
    const sourced = buildScopedKey({ scope, familyId: 'core.inventory', locator: ['sourced~1'] });
    localStorage.setItem(sourced, JSON.stringify(createDraftEnvelope({
      scope, draftId: 'sourced~1', payload: state(['stale-A']), localRevision: 1,
      sourceProvenance: { kind: 'fork', sourceKey: 'x', sourceId: 'y', importedFromDraftId: 'y', sourceFingerprint: 'f', sourceSchemaVersion: 1, sourceScopeKind: scope.scopeKind, sourceScopeId: scope.scopeId }
    })));
    // A resolved copy of the same payload, an altered one and a malformed one.
    const [resolvedKey] = legacyForks('core.inventory', state(['stale-A']), 1, scope, 500);
    localStorage.setItem(resolvedKey, JSON.stringify({ ...JSON.parse(localStorage.getItem(resolvedKey)), dirty: false }));
    const alteredKey = buildScopedKey({ scope, familyId: 'core.inventory', locator: ['altered~1'] });
    localStorage.setItem(alteredKey, 'externally-altered-recovery-copy');
    // Unrelated family with identical-looking forks: never in scope of the request.
    const custody = legacyForks('room.sharedConditionLatest.v1', state(['custody']), 3, scope, 600);
    return { dupA, dupB, unique, sourced, resolvedKey, alteredKey, custody };
  }

  it('R1 plan is a dry run: reports exactly what would go and changes nothing', () => {
    const { scope } = harness();
    const f = fullProfile(scope);
    const before = snapshot();
    const report = compaction().compactDuplicateRecoveryForks({ scope, familyIds: FAMILIES });
    expect(report.applied).toBe(false);
    expect(report.families.find((r) => r.familyId === 'core.inventory').identicalCopiesToRemove).toBe(39);
    expect(report.families.find((r) => r.familyId === 'core.characterTokens').identicalCopiesToRemove).toBe(59);
    expect(snapshot()).toEqual(before);
    expect(f.dupA).toHaveLength(40);
  });

  it('R2 apply needs the explicit confirmation token', () => {
    const { scope } = harness();
    fullProfile(scope);
    const before = snapshot();
    const report = compaction().compactDuplicateRecoveryForks({ scope, familyIds: FAMILIES, apply: true });
    expect(report.refused).toBe('confirmation-required');
    expect(snapshot()).toEqual(before);
  });

  it('R3 apply removes only identical twins, keeps the earliest of each and every unique or unresolved record', () => {
    const { scope } = harness();
    const f = fullProfile(scope);
    const before = snapshot();
    const c = compaction();
    const report = c.compactDuplicateRecoveryForks({ scope, familyIds: FAMILIES, apply: true, confirm: c.COMPACTION_CONFIRMATION });
    expect(report.removed).toBe(98);
    const after = snapshot();
    const removed = Object.keys(before).filter((k) => !(k in after));
    expect(removed.sort()).toEqual([...f.dupA.slice(1), ...f.dupB.slice(1)].sort());
    for (const k of Object.keys(after)) expect(after[k]).toBe(before[k]); // nothing modified
    for (const k of [f.dupA[0], f.dupB[0], ...f.unique, f.sourced, f.resolvedKey, f.alteredKey, ...f.custody]) {
      expect(after[k]).toBe(before[k]);
    }
    expect(report.charactersFreed).toBeGreaterThan(10000);
    // Idempotent.
    expect(c.compactDuplicateRecoveryForks({ scope, familyIds: FAMILIES, apply: true, confirm: c.COMPACTION_CONFIRMATION }).removed).toBe(0);
  });

  it('R4 works while the profile is at quota (removal needs no write) and frees room for a refused write', () => {
    const { scope } = harness();
    fullProfile(scope);
    const real = Storage.prototype.setItem;
    let full = true;
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(function (k, v) {
      if (full) throw new Error('QuotaExceededError');
      return real.call(this, k, v);
    });
    expect(() => localStorage.setItem('probe', 'x')).toThrow(/Quota/);
    const c = compaction();
    const report = c.compactDuplicateRecoveryForks({ scope, familyIds: FAMILIES, apply: true, confirm: c.COMPACTION_CONFIRMATION });
    expect(report.removed).toBe(98);
    full = false; // the space the compaction freed now accepts the previously refused write
    localStorage.setItem('probe', 'x');
    expect(localStorage.getItem('probe')).toBe('x');
  });

  it('R5 stops without removing anything further when a twin or the survivor changed since planning', () => {
    const { scope } = harness();
    const f = fullProfile(scope);
    const c = compaction();
    const orig = Storage.prototype.getItem;
    // Another tab rewrites the survivor between planning and removal.
    let reads = 0;
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(function (k) {
      if (k === f.dupA[0] && (reads += 1) > 1) return 'changed-by-another-tab';
      return orig.call(this, k);
    });
    const report = c.compactDuplicateRecoveryForks({ scope, familyIds: ['core.inventory'], apply: true, confirm: c.COMPACTION_CONFIRMATION });
    expect(report.families[0].stopped).toBe('survivor-changed');
    expect(report.removed).toBe(0);
    jest.restoreAllMocks();
    expect(f.dupA.every((k) => localStorage.getItem(k) !== null)).toBe(true);
  });

  it('R6 other accounts and unregistered families are untouched', () => {
    const { scope } = harness('owner-a');
    const { createUserScope } = require(`${ROOT}/persistence/scopeModel`);
    const other = legacyForks('core.inventory', state(['stale-A']), 5, createUserScope('owner-b'), 0);
    fullProfile(scope);
    const c = compaction();
    const report = c.compactDuplicateRecoveryForks({ scope, familyIds: [...FAMILIES, 'not.a.family'], apply: true, confirm: c.COMPACTION_CONFIRMATION });
    expect(report.families.find((r) => r.familyId === 'not.a.family').skipped).toBe('unknown-family');
    expect(other.every((k) => localStorage.getItem(k) !== null)).toBe(true);
  });

  it('R7 the explicit hook is available only through the engine module and plans before applying', () => {
    const { scope } = harness();
    const { createScopedStorageConfig } = require(`${ROOT}/persistence/scopedStoreStorage`);
    createScopedStorageConfig('core.inventory', 'inventory-storage', {});
    createScopedStorageConfig('core.characterTokens', 'character-token-store', {});
    fullProfile(scope);
    expect(typeof window.mythrillStorageRecovery.plan).toBe('function');
    const survey = window.mythrillStorageRecovery.survey();
    expect(survey.families[0].familyId).toBe('core.characterTokens');
    expect(survey.families.find((r) => r.familyId === 'core.inventory').keys).toBeGreaterThan(40);
    expect(survey.totalCharacters).toBeGreaterThan(survey.families[0].characters);
    const plan = window.mythrillStorageRecovery.plan();
    expect(plan.applied).toBe(false);
    expect(plan.families.find((r) => r.familyId === 'core.inventory').identicalCopiesToRemove).toBe(39);
    const applied = window.mythrillStorageRecovery.apply();
    expect(applied.applied).toBe(true);
    expect(applied.removed).toBe(98);
    expect(forkKeys('room.sharedConditionLatest.v1')).toHaveLength(3);
  });

  it('R8 the window hook always follows the newest module instance, even though the property cannot be replaced', () => {
    const { scope } = harness('owner-a');
    const first = require(`${ROOT}/persistence/scopedStoreStorage`);
    first.createScopedStorageConfig('core.inventory', 'inventory-storage', {});
    fullProfile(scope);
    expect(window.mythrillStorageRecovery.plan().families.find((r) => r.familyId === 'core.inventory').identicalCopiesToRemove).toBe(39);
    const pinned = window.mythrillStorageRecovery;
    // A later module generation (reload / re-evaluation) with a different account and registry.
    jest.resetModules();
    const { scope: next } = harness('owner-b');
    legacyForks('core.characterTokens', { state: { characterTokens: [] }, version: 0 }, 5, next, 0);
    require(`${ROOT}/persistence/scopedStoreStorage`).createScopedStorageConfig('core.characterTokens', 'character-token-store', {});
    expect(window.mythrillStorageRecovery).toBe(pinned);
    const plan = window.mythrillStorageRecovery.plan();
    expect(plan.scope.scopeId).toBe('owner-b');
    expect(plan.families.map((r) => r.familyId)).toEqual(['core.characterTokens']);
    expect(plan.families[0].identicalCopiesToRemove).toBe(4);
    expect(window.mythrillStorageRecovery.survey().families.map((r) => r.familyId)).toEqual(['core.characterTokens']);
  });
});
