/** Bounded R1–R6 production composition witness. --red replays the exact
 * independent supplement against the immutable reviewed-source snapshot. */
const fs = require('fs');
const path = require('path');
const Module = require('module');
const zlib = require('zlib');
const assert = require('assert/strict');
const { createRequire } = require('module');
const deps = createRequire(path.resolve(__dirname, '../../package.json'));
const evidenceRoot = path.join(__dirname, 'evidence');
const filename = path.join(__dirname, 'character-save-browser.cjs');
/* global m, __docs, __mount, __release, __releaseRead, __recordPromise, __syncResult, __liveUser */
function harnessCode(sourceRoot) {
  let code;
  if (sourceRoot) {
    const snapshot = JSON.parse(zlib.gunzipSync(fs.readFileSync(path.join(evidenceRoot, 'reviewed-source.json.gz'))));
    for (const [file, bytes] of Object.entries(snapshot)) {
      const destination = path.join(sourceRoot, file);
      fs.mkdirSync(path.dirname(destination), { recursive: true });
      fs.writeFileSync(destination, Buffer.from(bytes, 'base64'));
    }
    code = Buffer.from(snapshot['vtt-react/verification/p6/character-save-browser.cjs'], 'base64').toString('utf8');
    code = code.replace("const sourceRoot = path.resolve(__dirname, '../../src');", `const sourceRoot = ${JSON.stringify(path.join(sourceRoot, 'vtt-react/src'))};`);
  } else code = fs.readFileSync(filename, 'utf8');
  return code;
}
if (process.argv.includes('--red')) {
  const snapshotRoot = fs.mkdtempSync('D:/AppData/Temp/opencode/p6-reviewed-');
  let code = fs.readFileSync(path.join(evidenceRoot, 'independent-20261012/supplemental.cjs'), 'utf8');
  code = code.replace("createRequire('D:/VTT/vtt-react/package.json')", `createRequire(${JSON.stringify(path.resolve(__dirname, '../../package.json'))})`);
  code = code.replace("const filename = 'D:/VTT/vtt-react/verification/p6/character-save-browser.cjs';", `const filename = ${JSON.stringify(filename)};`);
  code = code.replace("let code = fs.readFileSync(filename, 'utf8');", `let code = ${JSON.stringify(harnessCode(snapshotRoot))};`);
  const redDir = path.join(evidenceRoot, 'red'); fs.mkdirSync(redDir, { recursive: true });
  const loaded = new Module(path.join(redDir, 'supplemental.cjs'), module);
  loaded.filename = path.join(redDir, 'supplemental.cjs'); loaded.paths = module.paths;
  loaded._compile(code, loaded.filename);
} else {
  let code = harnessCode();
  code = code.replace("canonical: 'services/firebase/characterPersistenceService.js'", "canonical: 'services/firebase/characterPersistenceService.js', runtime: 'services/firebase/characterStateService.js', sync: 'services/firebase/characterSyncService.js', session: 'services/firebase/characterSessionService.js', context: 'persistence/scopedConsumer.js', gate: 'persistence/bootstrapPrivacyGate.js'");
  code = code.replace('exports.onSnapshot=()=>()=>{};', 'exports.onSnapshot=(ref,callback)=>{(window.__listeners ||= []).push({path:ref.path,callback});return ()=>{};};');
  code = code.replace("await write('addDoc',r,v);return r;", "await write('addDoc',r,v);r.id=r.path.split('/').at(-1);return r;");
  code = code.replace('exports.getDoc=async ref=>({exists:()=>docs.has(ref.path),data:()=>clone(docs.get(ref.path))});', "exports.getDoc=async ref=>{if(window.__holdReadPath===ref.path)await new Promise(resolve=>{window.__releaseRead=resolve;});return {exists:()=>docs.has(ref.path),data:()=>clone(docs.get(ref.path))};};");
  // Observe before simulated backend admission. Standard Firestore rejects
  // arrays directly inside arrays; a fixture must not accept raw matrices.
  code = code.replace("if(window.__holdPath===ref.path)", `const validate=(value,inArray=false)=>{if(Array.isArray(value)){if(inArray)throw Error('Firestore nested array refused');value.forEach(item=>validate(item,true));}else if(value&&typeof value==='object')Object.values(value).forEach(item=>validate(item));};validate(v);
        if(window.__holdPath===ref.path)`);
  const loaded = new Module(filename, module); loaded.filename = filename; loaded.paths = Module._nodeModulePaths(path.dirname(filename)); loaded._compile(code, filename);
  const results = [];
  const output = path.join(evidenceRoot, 'green.json');
  async function main() {
    const { server, manifest } = loaded.exports.start();
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    if (process.argv.includes('--serve')) { console.log(`http://127.0.0.1:${server.address().port}`); return; }
    const browser = await deps('playwright').chromium.launch({ channel: 'chrome', headless: true });
    try {
      async function scenario(name, fn) {
        const selected = process.argv.find(arg => arg.startsWith('--only='))?.slice(7);
        if (selected && !name.includes(selected)) return;
        const context = await browser.newContext({ acceptDownloads: true });
        await context.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
        const page = await context.newPage(); const errors = []; page.on('pageerror', e => errors.push(e.message));
        await page.goto(`http://127.0.0.1:${server.address().port}`);
        await page.evaluate(async () => {
          m('init').initStoreRegistry(); window.__liveUser = { uid: 'u-a', getIdToken: async () => 'test' };
          m('auth').default.getState().setUser(__liveUser); await m('coordinator').whenHandoffIdle();
          const seed = { id: 'c-a', name: 'REVIEW HERO', race: 'Human', class: 'Martyr', level: 3,
            stats: { strength: 10, agility: 10, constitution: 10, intelligence: 10, spirit: 10, charisma: 10 },
            resources: { health: { current: 30, max: 50 }, mana: { current: 20, max: 50 }, actionPoints: { current: 2, max: 3 } }, lore: { notes: 'baseline' },
            classResource: { type: 'devotionGauge', current: 0, max: 6, damage: 0, earnedLevels: 0, spentLevels: 0, bonusLevels: 0 } };
          __docs.set('characters/c-a', m('canonical').transformForStorage(seed, 'u-a'));
          await m('character').default.getState().loadActiveCharacter(); __mount();
        });
        await page.getByRole('region', { name: 'Selected character save status' }).waitFor();
        const evidence = await fn(page); assert.deepEqual(errors, []);
        results.push({ name, result: 'GREEN', evidence, errors }); console.log(`${name}: GREEN`);
        fs.writeFileSync(output, JSON.stringify({ manifest, results }, null, 2));
        await context.close();
      }
      await scenario('R2-older-import-protects-newer-work', async page => {
        const raw = await page.evaluate(() => {
          const s = m('character').default; s.getState().updateLore('notes', 'older exported draft'); s.getState().updateResource('health', 19);
          return m('outcome').exportCharacterDraft('c-a');
        });
        await page.evaluate(() => { window.__rejectCanonical = true; window.__rejectRuntime = true;
          m('character').default.getState().updateLore('notes', 'newer work to preserve'); m('character').default.getState().updateResource('health', 7); });
        await page.waitForTimeout(2400);
        const before = await state(page);
        await fileInput(page, raw);
        const after = await state(page);
        assert.equal(after.notes, 'newer work to preserve'); assert.equal(after.health, 7);
        assert.deepEqual(after.draft, before.draft); assert.deepEqual(after.roster, before.roster); assert(after.alerts[0]?.includes('unsaved'));
        assert.equal(await page.getByLabel('Import selected draft').evaluate(input => input.files[0].text()), raw);
        return { before, after, importedFile: JSON.parse(raw) };
      });
      await scenario('R4-embedded-canonical-identity-rejected-before-mutation', async page => {
        const raw = await page.evaluate(() => {
          m('character').default.getState().updateLore('notes', 'foreign payload edit');
          const doc = JSON.parse(m('outcome').exportCharacterDraft('c-a')); doc.canonical.id = 'c-b'; return JSON.stringify(doc);
        });
        const before = await state(page); await fileInput(page, raw); const after = await state(page);
        assert.deepEqual(after.roster, before.roster); assert.deepEqual(after.draft, before.draft); assert.equal(after.id, before.id);
        assert(after.alerts[0]?.includes('identity')); return { before, after };
      });
      await scenario('R3-runtime-only-conflicting-import-visibly-refused', async page => {
        await page.evaluate(() => m('character').default.getState().updateResource('health', 21));
        const raw = await runtimeImport(page);
        const before = await state(page); await fileInput(page, raw); const after = await state(page);
        assert.deepEqual(after.draft, before.draft); assert.equal(after.health, 21); assert(after.alerts[0]?.includes('unsaved'));
        assert.equal(await page.getByLabel('Import selected draft').evaluate(input => input.files[0].text()), raw);
        assert.equal(JSON.parse(raw).runtime.health.current, 5); return { before, after, exactFile: JSON.parse(raw) };
      });
      await scenario('R1-ordinary-production-inventory-save-load-recovery-import', async page => {
        const evidence = await page.evaluate(async () => {
          const s = m('character').default, inventory = m('inventory').default;
          const accepted = inventory.getState().addItem({ id: 'ordinary-blade', name: 'Ordinary blade', type: 'weapon', quality: 'common', width: 1, height: 1 });
          s.getState().updateLore('notes', 'ordinary inventory authored'); await s.getState().saveCurrentCharacter();
          const runtime = m('outcome').getCharacterCandidate('c-a', 'runtime');
          const runtimeResult = await m('outcome').saveCharacterDraft(runtime, (data, latest) => m('runtime').default.saveCharacterState('u-a', 'c-a', data, { isCurrent: latest }));
          const canonicalLoad = await m('canonical').default.loadCharacter('c-a', 'u-a');
          const runtimeLoad = await m('runtime').default.loadCharacterState('u-a', 'c-a');
          return { accepted, items: inventory.getState().items, canonical: m('outcome').getCharacterCandidate('c-a', 'canonical'), runtimeResult,
            canonicalLoad, runtimeLoad, writes: window.__writes, raw: m('outcome').exportCharacterDraft('c-a') };
        });
        assert.equal(evidence.accepted.success, true); assert.equal(evidence.canonical.status, 'saved'); assert.equal(evidence.runtimeResult.success, true);
        assert.deepEqual(evidence.items[0].shape.cells, [[true]]);
        assert.deepEqual(evidence.canonicalLoad.inventory.items, evidence.items); assert.deepEqual(evidence.runtimeLoad.inventory.items, evidence.items);
        await fileInput(page, evidence.raw); assert.deepEqual((await state(page)).items, evidence.items);
        // Real rejected saves and module/document reload exercise P5 device retention.
        await page.evaluate(() => { window.__rejectCanonical = true; window.__rejectRuntime = true; m('character').default.getState().updateResource('health', 8); });
        await page.waitForTimeout(2400); await page.reload();
        await page.evaluate(async () => { m('init').initStoreRegistry(); window.__liveUser = { uid: 'u-a', getIdToken: async () => 'test' };
          m('auth').default.getState().setUser(__liveUser); await m('coordinator').whenHandoffIdle();
          window.__rejectCanonical = true; window.__rejectRuntime = true;
          await m('character').default.getState().loadActiveCharacter(); __mount(); });
        await page.waitForFunction(() => m('character').default.getState().health.current === 8);
        const recovered = await state(page); assert.deepEqual(recovered.items, evidence.items);
        await heal(page); return { ...evidence, recovered, healed: await state(page) };
      });
      await scenario('control-valid-runtime-import-subscriptions-and-subsequent-edit', async page => {
        await confirm(page);
        const raw = await runtimeImport(page); await fileInput(page, raw);
        const imported = await state(page);
        assert.deepEqual(imported.alerts, []); assert.equal(imported.health, 5);
        assert.deepEqual(imported.items, JSON.parse(raw).runtime.inventory.items);
        assert.deepEqual(imported.draft.runtime, JSON.parse(raw).runtime);
        // Non-runtime store activity cannot re-stage an old live projection.
        await page.evaluate(() => { m('character').default.setState({ error: null }); m('inventory').default.setState({ selectedItem: null }); });
        const afterSubscriptions = await state(page); assert.deepEqual(afterSubscriptions.draft.runtime, imported.draft.runtime);
        await page.getByRole('button', { name: 'Retry runtime save' }).click();
        await page.waitForFunction(() => document.querySelector('.character-save-status').textContent.includes('Personal runtime: Cloud saved'));
        const loaded = await page.evaluate(() => m('runtime').default.loadCharacterState('u-a', 'c-a'));
        assert.equal(loaded.health.current, 5); assert.deepEqual(loaded.inventory.items, imported.items);
        await page.evaluate(() => m('character').default.getState().updateResource('health', 4));
        const edited = await state(page); assert.equal(edited.draft.runtime.health.current, 4); assert(edited.ui.includes('Personal runtime: Cloud save pending'));
        await heal(page); return { imported, afterSubscriptions, loaded, edited, healed: await state(page) };
      });
      await scenario('control-valid-canonical-import-exact-data-and-retry', async page => {
        await confirm(page);
        const raw = await page.evaluate(() => { const doc = JSON.parse(m('outcome').exportCharacterDraft('c-a')); doc.runtime = null;
          doc.canonical.lore.notes = 'valid canonical imported notes'; doc.canonical.health.current = 11; doc.canonical.resources.health.current = 11;
          doc.canonical.unknownImport = { kept: ['I', 'VII'] }; return JSON.stringify(doc); });
        await fileInput(page, raw); const imported = await state(page);
        assert.deepEqual(imported.alerts, []); assert.equal(imported.notes, 'valid canonical imported notes'); assert.equal(imported.health, 11);
        assert.deepEqual(imported.draft.canonical, JSON.parse(raw).canonical);
        await heal(page);
        const loaded = await page.evaluate(() => m('canonical').default.loadCharacter('c-a', 'u-a'));
        assert.equal(loaded.lore.notes, imported.notes); assert.deepEqual(loaded.unknownImport, { kept: ['I', 'VII'] });
        return { imported, loaded, healed: await state(page) };
      });
      await scenario('control-valid-combined-import-and-production-custom-matrix', async page => {
        await page.evaluate(() => {
          const inventory = m('inventory').default.getState();
          inventory.addItem({ id: 'shaped-blade', name: 'Shaped blade', type: 'weapon', quality: 'common', width: 2, height: 2,
            shape: { type: 'custom', width: 2, height: 2, cells: [[true, false], [false, true]] }, itemLore: { exact: 'keep me' } });
        });
        await confirm(page);
        const raw = await page.evaluate(() => { const doc = JSON.parse(m('outcome').exportCharacterDraft('c-a'));
          doc.canonical.lore.notes = 'combined imported notes'; doc.runtime.health.current = 5; return JSON.stringify(doc); });
        await fileInput(page, raw); const imported = await state(page);
        assert.deepEqual(imported.alerts, []); assert.equal(imported.notes, 'combined imported notes'); assert.equal(imported.health, 5);
        assert.deepEqual(imported.draft.canonical, JSON.parse(raw).canonical); assert.deepEqual(imported.draft.runtime, JSON.parse(raw).runtime);
        assert.deepEqual(imported.items[0].shape.cells, [[true, false], [false, true]]);
        await heal(page);
        const loaded = await page.evaluate(async () => ({ canonical: await m('canonical').default.loadCharacter('c-a', 'u-a'),
          runtime: await m('runtime').default.loadCharacterState('u-a', 'c-a') }));
        assert.deepEqual(loaded.canonical.inventory.items, imported.items); assert.deepEqual(loaded.runtime.inventory.items, imported.items);
        return { imported, loaded };
      });
      await scenario('control-import-validation-all-lanes-before-any-mutation', async page => {
        await confirm(page);
        const baseline = await state(page);
        const changes = [
          ['wrapper-version', doc => { doc.version = 2; }],
          ['wrapper-owner', doc => { doc.owner.scopeId = 'u-b'; }],
          ['wrapper-target', doc => { doc.characterId = 'c-b'; }],
          ['runtime-identity', doc => { doc.runtime.characterId = 'c-b'; }],
          ['runtime-version', doc => { doc.runtime.version = 2; }],
          ['canonical-owner', doc => { doc.canonical.metadata = { userId: 'u-b' }; }],
          ['runtime-structure', doc => { doc.canonical.lore.notes = 'MUST NOT APPLY'; doc.runtime.inventory.items = 'invalid'; }],
          ['canonical-structure', doc => { doc.canonical.stats.strength = 'invalid'; }]
        ];
        const rejected = [];
        for (const [name, mutate] of changes) {
          const doc = structuredClone(baseline.draft); mutate(doc);
          await fileInput(page, JSON.stringify(doc)); const after = await state(page);
          assert(after.alerts.length); assert.deepEqual(after.roster, baseline.roster); assert.deepEqual(after.draft, baseline.draft);
          assert.equal(after.id, baseline.id); assert.equal(after.notes, baseline.notes); assert.equal(after.health, baseline.health); assert.deepEqual(after.items, baseline.items);
          rejected.push({ name, alert: after.alerts });
        }
        return { baseline, rejected, after: await state(page) };
      });
      await scenario('control-unsupported-candidate-remains-exact-and-refused', async page => {
        await page.evaluate(() => { const s = m('character').default;
          s.setState(state => ({ characters: state.characters.map(c => ({ ...c, futureNested: [[1, 2], [3]] })) }));
          s.getState().updateLore('notes', 'unsupported exact'); });
        await page.evaluate(() => m('character').default.getState().saveCurrentCharacter());
        const after = await state(page); assert.deepEqual(after.draft.canonical.futureNested, [[1, 2], [3]]); assert(after.ui.includes('Save failed'));
        const writes = await page.evaluate(() => window.__writes.filter(w => w.path === 'characters/c-a' && w.value.lore?.notes === 'unsupported exact'));
        assert.deepEqual(writes, []); return { after, writes };
      });
      await scenario('control-same-owner-session-failure-heals-and-sync-confirms', async page => {
        await confirm(page);
        await page.evaluate(async () => { await m('character').default.getState().startCharacterSession('c-a'); m('sync').default.isOnline = false;
          window.__holdPath = 'characterSessions/' + m('session').default.activeSessions.get('c-a').id;
          window.__recordPromise = m('character').default.getState().recordCharacterChange('c-a', 'resource_change', { type: 'health', value: { current: 9, max: 50 } }); });
        await page.waitForFunction(() => !!window.__release);
        await page.evaluate(async () => { window.__holdPath = null; __release.reject(Error('same owner network failure')); window.__recordResult = await __recordPromise; });
        const queued = await page.evaluate(() => ({ result: window.__recordResult, queue: m('sync').default.loadOfflineChanges() }));
        assert.equal(queued.result, true); assert.equal(queued.queue[0].changeData.value.current, 9);
        const synced = await page.evaluate(async () => { m('sync').default.isOnline = true;
          const result = await m('sync').default.syncOfflineChanges();
          const success = await m('character').default.getState().recordCharacterChange('c-a', 'stat_change', { stat: 'sameOwnerMemo', value: 'healed session' });
          return { result, success, queue: m('sync').default.loadOfflineChanges(), document: __docs.get('characters/c-a'), writes: window.__writes }; });
        assert.equal(synced.result.synced, 1); assert.equal(synced.result.failed, 0); assert.equal(synced.success, true); assert.deepEqual(synced.queue, []);
        assert.equal(synced.document.resources.health.current, 9);
        assert(synced.writes.filter(w => w.path === 'characters/c-a').every(w => w.uid === 'u-a'));
        return { queued, synced };
      });
      for (const sameUid of [false, true]) {
        await scenario(`R5-held-session-failure-${sameUid ? 'generation' : 'account'}-switch`, async page => {
          await page.evaluate(async () => { await m('character').default.getState().startCharacterSession('c-a');
            window.__holdPath = 'characterSessions/' + m('session').default.activeSessions.get('c-a').id;
            window.__recordPromise = m('character').default.getState().recordCharacterChange('c-a', 'stat_change', { stat: 'privateMemo', value: 'A PRIVATE DELAYED CHANGE' }); });
          await page.waitForFunction(() => !!window.__release);
          await switchOwner(page, sameUid);
          await page.evaluate(async () => { window.__holdPath = null; __release.reject(Error('old session network failure')); window.__recordResult = await __recordPromise; });
          const after = await page.evaluate(() => ({ result: window.__recordResult, owner: m('auth').default.getState().user.uid,
            activeGeneration: m('gate').getBootstrapGateState().accountGeneration,
            queue: m('sync').default.loadOfflineChanges(), raw: localStorage.getItem('mythrill:p5:user:u-b:character.offlineChanges'),
            retained: m('session').default.activeSessions.get('c-a'), writes: window.__writes }));
          assert(!after.raw?.includes('A PRIVATE DELAYED CHANGE')); assert(!after.queue.some(c => JSON.stringify(c).includes('A PRIVATE DELAYED CHANGE')));
          assert(after.activeGeneration > after.retained.originContext.accountGeneration);
          assert(!after.writes.some(write => write.uid === 'u-b' && JSON.stringify(write.value).includes('A PRIVATE DELAYED CHANGE')));
          assert.equal(after.retained.changes.stats.privateMemo, 'A PRIVATE DELAYED CHANGE'); assert.equal(after.result, false); return after;
        });
        await scenario(`R6-held-sync-read-${sameUid ? 'generation' : 'account'}-switch`, async page => {
          await page.evaluate(async () => { await m('character').default.getState().saveCurrentCharacter();
            window.__holdReadPath = 'characters/c-a'; window.__writeStart = window.__writes.length;
            window.__syncOrigin = m('context').captureConsumerContext().context;
            window.__syncResult = m('sync').default.syncCharacterChanges('c-a', [], window.__syncOrigin).catch(e => ({ error: e.message })); });
          await page.waitForFunction(() => !!window.__releaseRead); await switchOwner(page, sameUid);
          await page.evaluate(async () => {
            // Returning A may legitimately resume P5 deferred publication in the
            // new generation. Record those attempts separately while the stale
            // read is still held; assert zero attempts from its release onward.
            window.__handoffWrites = window.__writes.slice(window.__writeStart);
            window.__writeStart = window.__writes.length;
            window.__holdReadPath = null; __releaseRead(); window.__actualSyncResult = await __syncResult;
          });
          const after = await page.evaluate(() => ({ result: window.__actualSyncResult, owner: m('auth').default.getState().user.uid,
            origin: window.__syncOrigin, activeGeneration: m('gate').getBootstrapGateState().accountGeneration,
            handoffWrites: window.__handoffWrites, writes: window.__writes.slice(window.__writeStart) }));
          assert(after.result.error);
          assert(after.activeGeneration > after.origin.accountGeneration);
          const characterWrites = after.writes.filter(write => write.path === 'characters/c-a');
          assert.deepEqual(characterWrites, [], JSON.stringify(after)); return after;
        });
      }
    } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
  }
  async function state(page) {
    return page.evaluate(() => { const s = m('character').default.getState(); return { id: s.currentCharacterId, notes: s.lore.notes, health: s.health.current,
      roster: s.characters, items: m('inventory').default.getState().items, draft: JSON.parse(m('outcome').exportCharacterDraft('c-a')),
      alerts: [...document.querySelectorAll('[role=alert]')].map(e => e.textContent), ui: document.querySelector('.character-save-status').textContent }; });
  }
  async function fileInput(page, raw) {
    await page.getByLabel('Import selected draft').setInputFiles({ name: 'draft.json', mimeType: 'application/json', buffer: Buffer.from(raw) });
    await page.waitForTimeout(150);
  }
  async function runtimeImport(page) {
    return page.evaluate(() => { const doc = JSON.parse(m('outcome').exportCharacterDraft('c-a')); doc.canonical = null;
      doc.runtime.health.current = 5; doc.runtime.inventory.items = [{ id: 'imported-blade', name: 'Imported blade', position: { row: 0, col: 0 }, quality: 'common', type: 'weapon',
        width: 1, height: 1, quantity: 1, rotation: 0, shape: { type: 'rectangular', width: 1, height: 1, cells: [[true]] } }]; return JSON.stringify(doc); });
  }
  async function heal(page) {
    await page.evaluate(() => { window.__rejectCanonical = false; window.__rejectRuntime = false; });
    await page.getByRole('button', { name: 'Retry character save' }).click(); await page.getByRole('button', { name: 'Retry runtime save' }).click();
    await page.waitForFunction(() => document.querySelector('.character-save-status').textContent.match(/Cloud saved/g)?.length === 2);
  }
  async function confirm(page) {
    await page.evaluate(async () => { m('character').default.getState().updateLore('notes', 'confirmed baseline');
      m('character').default.getState().updateResource('health', 21); await m('character').default.getState().saveCurrentCharacter(); });
    await page.getByRole('button', { name: 'Retry runtime save' }).click();
    await page.waitForFunction(() => document.querySelector('.character-save-status').textContent.match(/Cloud saved/g)?.length === 2);
  }
  async function switchOwner(page, sameUid) {
    await page.evaluate(async same => { if (same) { m('auth').default.getState().setUser(null); await m('coordinator').whenHandoffIdle(); }
      window.__liveUser = { uid: same ? 'u-a' : 'u-b', getIdToken: async () => 'b' }; m('auth').default.getState().setUser(__liveUser); await m('coordinator').whenHandoffIdle(); }, sameUid);
  }
  main().catch(error => { console.error(error); process.exitCode = 1; });
}
