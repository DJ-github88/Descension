const { chromium } = require('playwright');
const http = require('http'), fs = require('fs');
const srv = http.createServer((q, r) => {
  if (q.url === '/bundle.js') { r.setHeader('content-type', 'text/javascript'); return r.end(fs.readFileSync(require('path').join(process.env.WITNESS_OUT || require('path').join(__dirname, '.out'), 'bundle.js'))); }
  r.setHeader('content-type', 'text/html'); r.end('<!doctype html><title>w</title><script src="/bundle.js"></script>');
});
(async () => {
  await new Promise(r => srv.listen(0, '127.0.0.1', r));
  const url = `http://127.0.0.1:${srv.address().port}/`;
  const browser = await chromium.launch();
  const ctx = await browser.newContext(); const page = await ctx.newPage();
  const errors = []; page.on('pageerror', e => errors.push(String(e)));
  await page.goto(url);
  const result = await page.evaluate(async () => {
    const W = window.__w; const out = { steps: [] }; const note = (n, v) => out.steps.push({ n, ...v });
    const total = () => Object.keys(localStorage).reduce((n, k) => n + k.length + localStorage.getItem(k).length, 0);
    const scope = W.createUserScope('witness-gm');
    W.gate.resetBootstrapGateForTests(); W.gate.activatePrivateScope(scope);
    const mk = (fam) => W.createScopedStorageConfig(fam, fam + '-store', {}).storage;
    const inv = mk('core.inventory'), tok = mk('core.characterTokens'); mk('core.conditions');
    const state = (items) => ({ state: { items }, version: 0 });
    inv.setItem('x', state(['base'])); await inv.__flush();
    tok.setItem('x', { state: { characterTokens: [], windowSize: { width: 900, height: 650 } }, version: 0 }); await tok.__flush();
    const prov = { kind: 'fork', sourceKey: null, sourceId: null, importedFromDraftId: null, sourceFingerprint: null, sourceSchemaVersion: null, sourceScopeKind: null, sourceScopeId: null };
    const legacy = (fam, payload, i) => { const id = `0_legacy${i}_${'f'.repeat(12)}~writer_old_${i}`; const env = W.createDraftEnvelope({ scope, draftId: id, payload, localRevision: 1, sourceProvenance: prov }); const k = W.buildScopedKey({ scope, familyId: fam, locator: [id] }); localStorage.setItem(k, JSON.stringify({ ...env, updatedAt: new Date(Date.UTC(2026, 9, 29, 18, 0, 0, i)).toISOString() })); return k; };
    // unique unresolved candidates first (the evidence that must survive)
    const unique = [legacy('core.inventory', state(['pending-command-cmd-77']), 900001), legacy('core.inventory', state(['retained-die-d20=17']), 900002), legacy('core.conditions', { state: { pendingUnknown: 'cmd-unknown-3' }, version: 0 }, 900003)];
    const uniqueRaw = Object.fromEntries(unique.map(k => [k, localStorage.getItem(k)]));
    // fill to the REAL browser quota with identical stale tokens forks
    const tokenPayload = { state: { characterTokens: [], windowSize: { width: 900, height: 650 } }, version: 0 };
    let n = 0; try { for (;; n += 1) legacy('core.characterTokens', tokenPayload, n); } catch (e) { out.quotaError = e.name; }
    note('profile full', { duplicateTokenForks: n, totalChars: total() });
    let blocked = null; try { localStorage.setItem('custody-probe', 'x'.repeat(3000)); } catch (e) { blocked = e.name; }
    note('custody-size write blocked by real quota', { error: blocked });
    // a stale engine under quota: candidate must stay visible + retained
    const first = mk('core.inventory'); first.getItem('x'); const stale = mk('core.inventory'); stale.getItem('x');
    first.setItem('x', state(['winner'])); await first.__flush().catch(() => {});
    stale.setItem('x', state(['unresolved-command-under-quota'])); const [r] = await stale.__flush();
    note('stale candidate under real quota', { status: r && r.status, reason: r && r.reason, retained: stale.__hasRefusedCandidate() });
    out.refusedStatus = r && r.status;
    note('survey (read-only)', { top: window.mythrillStorageRecovery.survey().families.slice(0, 3).map(f => [f.familyId, f.keys, f.characters]) });
    const plan = window.mythrillStorageRecovery.plan();
    note('plan (dry run)', { removeTokenCopies: plan.families.find(f => f.familyId === 'core.characterTokens').identicalCopiesToRemove, distinct: plan.families.map(f => [f.familyId, f.distinctCandidates]), totalAfterPlan: total() });
    const applied = window.mythrillStorageRecovery.apply();
    note('apply', { removed: applied.removed, charactersFreed: applied.charactersFreed, totalChars: total() });
    let ok = null; try { localStorage.setItem('custody-probe', 'x'.repeat(3000)); ok = true; localStorage.removeItem('custody-probe'); } catch (e) { ok = e.name; }
    note('custody-size write after recovery', { ok });
    stale.__retryRefused(); await stale.__flush();
    const keysOf = (fam) => Object.keys(localStorage).filter(k => k.includes(`:${fam}:`));
    note('retried candidate saved', { retainedAfter: stale.__hasRefusedCandidate(), inventoryForks: keysOf('core.inventory').length });
    note('unique evidence byte-identical', { all: unique.every(k => localStorage.getItem(k) === uniqueRaw[k]), count: unique.length });
    note('one token copy kept', { tokenForks: keysOf('core.characterTokens').length });
    // prevention: thousand identical stale updates
    const before = total();
    const s2 = mk('core.characterTokens'); s2.getItem('x'); const w2 = mk('core.characterTokens'); w2.getItem('x');
    w2.setItem('x', { state: { characterTokens: ['moved'], windowSize: { width: 1, height: 1 } }, version: 0 }); await w2.__flush();
    for (let i = 0; i < 1000; i += 1) s2.setItem('x', tokenPayload);
    await s2.__flush();
    note('1000 identical stale updates', { tokenForks: keysOf('core.characterTokens').length, growthChars: total() - before });
    // Real store payloads carry action functions and Dates that JSON drops: identical updates must still reuse the stored copy.
    const live = () => ({ state: { items: [{ id: 'rope', at: new Date('2026-10-29T20:05:34Z'), note: undefined }], addItem() {}, removeItem: () => {} }, version: 0 });
    const f1 = mk('core.inventory'); f1.getItem('x'); const f2 = mk('core.inventory'); f2.getItem('x');
    f1.setItem('x', state(['moved-again'])); await f1.__flush();
    const beforeLive = keysOf('core.inventory').length;
    for (let i = 0; i < 200; i += 1) f2.setItem('x', live());
    await f2.__flush();
    note('200 identical function-bearing store payloads', { newForks: keysOf('core.inventory').length - beforeLive });
    return out;
  });
  result.pageErrors = errors; result.chromium = browser.version();
  fs.writeFileSync(process.env.WITNESS_RESULT || require('path').join(__dirname, '.out', 'real-quota-result.json'), JSON.stringify(result, null, 1));
  console.log(JSON.stringify(result, null, 1));
  await browser.close(); srv.close();
})().catch(e => { console.error(e); process.exit(1); });
