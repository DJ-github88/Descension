/** Two remaining independent P6 defects. --freeze captures reviewed production
 * bytes; --red reproduces only the exact failures from that immutable snapshot. */
const fs = require('fs');
const path = require('path');
const Module = require('module');
const zlib = require('zlib');
const crypto = require('crypto');
const assert = require('assert/strict');
const { createRequire } = require('module');
const deps = createRequire(path.resolve(__dirname, '../../package.json'));
const root = path.resolve(__dirname, '../../..');
const evidence = path.join(__dirname, 'evidence/remaining');
const snapshotFile = path.join(evidence, 'reviewed-source-complete.json.gz');
const filename = path.join(__dirname, 'character-save-browser.cjs');
const red = process.argv.includes('--red');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
/* global m, __docs, __mount, __liveUser */
let code = fs.readFileSync(filename, 'utf8');
if (red) {
  const snapshot = JSON.parse(zlib.gunzipSync(fs.readFileSync(snapshotFile)));
  const directory = fs.mkdtempSync('D:/AppData/Temp/opencode/p6-remaining-reviewed-');
  for (const [file, bytes] of Object.entries(snapshot.files)) {
    const destination = path.join(directory, file);
    fs.mkdirSync(path.dirname(destination), { recursive: true });
    const content = Buffer.from(bytes, 'base64');
    assert.equal(hash(content), snapshot.hashes[file], file);
    fs.writeFileSync(destination, content);
  }
  code = Buffer.from(snapshot.files['vtt-react/verification/p6/character-save-browser.cjs'], 'base64').toString('utf8');
  code = code.replace("const sourceRoot = path.resolve(__dirname, '../../src');", `const sourceRoot = ${JSON.stringify(path.join(directory, 'vtt-react/src'))};`);
}
code = code.replace("canonical: 'services/firebase/characterPersistenceService.js'", "canonical: 'services/firebase/characterPersistenceService.js', runtime: 'services/firebase/characterStateService.js', conditions: 'store/conditionStore.js', quests: 'store/questStore.js'");
code = code.replace("if(window.__holdPath===ref.path)", `const validate=(value,inArray=false)=>{if(Array.isArray(value)){if(inArray)throw Error('Firestore nested array refused');value.forEach(item=>validate(item,true));}else if(value&&typeof value==='object')Object.values(value).forEach(item=>validate(item));};validate(v);if(window.__holdPath===ref.path)`);
const loaded = new Module(filename, module);
loaded.filename = filename;
loaded.paths = Module._nodeModulePaths(path.dirname(filename));
loaded._compile(code, filename);

async function main() {
  const { server, manifest } = loaded.exports.start();
  fs.mkdirSync(evidence, { recursive: true });
  if (process.argv.includes('--freeze')) {
    assert(!fs.existsSync(snapshotFile), 'Never replace the reviewed snapshot');
    const reviewed = JSON.parse(fs.readFileSync(path.join(__dirname, 'evidence/independent-rereview-20261012/after.json')));
    const files = [...Object.keys(manifest).map(file => `vtt-react/src/${file}`), 'vtt-react/src/config/firebase.js', 'vtt-react/verification/p6/character-save-browser.cjs',
      'vtt-react/src/components/character-sheet/character-save-status.css'];
    const bytes = Object.fromEntries(files.map(file => [file, fs.readFileSync(path.join(root, file))]));
    for (const [file, content] of Object.entries(bytes)) assert.equal(hash(content), reviewed.hashes[file], `Source drift before freeze: ${file}`);
    const snapshot = { hashes: Object.fromEntries(Object.entries(bytes).map(([file, content]) => [file, hash(content)])),
      files: Object.fromEntries(Object.entries(bytes).map(([file, content]) => [file, content.toString('base64')])) };
    fs.writeFileSync(snapshotFile, zlib.gzipSync(JSON.stringify(snapshot)));
    fs.writeFileSync(path.join(evidence, 'freeze-complete.json'), JSON.stringify({ manifest, snapshotFiles: files.length,
      snapshotSha256: hash(fs.readFileSync(snapshotFile)), witnessSha256: hash(fs.readFileSync(__filename)) }, null, 2));
    console.log(`Frozen ${files.length} verified reviewed files`);
    return;
  }
  if (red) assert.deepEqual(manifest, JSON.parse(fs.readFileSync(path.join(evidence, 'freeze-complete.json'))).manifest);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await deps('playwright').chromium.launch({ channel: 'chrome', headless: true });
  const results = [];
  try {
    async function scenario(name, fn) {
      const context = await browser.newContext();
      await context.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
      const page = await context.newPage();
      const errors = []; page.on('pageerror', error => errors.push(error.message));
      await page.goto(`http://127.0.0.1:${server.address().port}`);
      await page.evaluate(async () => {
        m('init').initStoreRegistry(); window.__liveUser = { uid: 'u-a', getIdToken: async () => 'test' };
        m('auth').default.getState().setUser(__liveUser); await m('coordinator').whenHandoffIdle();
        const seed = { id: 'c-a', name: 'REVIEW HERO', race: 'Human', class: 'Martyr', level: 3,
          stats: { strength: 10, agility: 10, constitution: 10, intelligence: 10, spirit: 10, charisma: 10 },
          resources: { health: { current: 30, max: 50 }, mana: { current: 20, max: 50 }, actionPoints: { current: 2, max: 3 } },
          lore: { notes: 'baseline' }, classResource: { type: 'devotionGauge', current: 0, max: 6 } };
        __docs.set('characters/c-a', m('canonical').transformForStorage(seed, 'u-a'));
        await m('character').default.getState().loadActiveCharacter(); __mount();
      });
      await page.getByRole('region', { name: 'Selected character save status' }).waitFor();
      const observation = await fn(page); assert.deepEqual(errors, []);
      results.push({ name, result: red ? 'RED-REPRODUCED' : 'GREEN', observation, errors });
      console.log(`${name}: ${red ? 'RED-REPRODUCED' : 'GREEN'}`);
      fs.writeFileSync(path.join(evidence, red ? 'red.json' : 'green.json'), JSON.stringify({ manifest, results }, null, 2));
      await context.close();
    }
    await scenario('R1-production-save-load-unrelated-literal-strings', async page => {
      const observation = await page.evaluate(async () => {
        const store = m('character').default, inventory = m('inventory').default;
        inventory.getState().addItem({ id: 'ordinary-blade', name: 'Ordinary blade', type: 'weapon', quality: 'common', width: 1, height: 1 });
        const futureAnnotation = { shape: { cells: ['[true]'], meaning: 'literal JSON text; not an inventory item' } };
        store.setState(state => ({ characters: state.characters.map(character => ({ ...character, futureAnnotation })) }));
        store.getState().updateLore('notes', 'unrelated literal strings'); await store.getState().saveCurrentCharacter();
        const runtime = { ...m('outcome').getCharacterCandidate('c-a', 'runtime').payload, futureAnnotation };
        const candidate = m('outcome').stageCharacterDraft('c-a', 'runtime', runtime);
        const runtimeResult = await m('outcome').saveCharacterDraft(candidate, (data, current) => m('runtime').default.saveCharacterState('u-a', 'c-a', data, { isCurrent: current }));
        return { expected: futureAnnotation, canonicalStatus: m('outcome').getCharacterCandidate('c-a', 'canonical').status, runtimeResult,
          canonicalRaw: __docs.get('characters/c-a').preservedFields.futureAnnotation,
          runtimeRaw: __docs.get('users/u-a/characterStates/c-a').futureAnnotation,
          canonicalLoad: await m('canonical').default.loadCharacter('c-a', 'u-a'), runtimeLoad: await m('runtime').default.loadCharacterState('u-a', 'c-a') };
      });
      assert.equal(observation.canonicalStatus, 'saved'); assert.equal(observation.runtimeResult.success, true);
      assert.deepEqual(observation.canonicalRaw, observation.expected); assert.deepEqual(observation.runtimeRaw, observation.expected);
      for (const value of [observation.canonicalLoad, observation.runtimeLoad]) {
        if (red) assert.deepEqual(value.futureAnnotation.shape.cells, [[true]]);
        else assert.deepEqual(value.futureAnnotation, observation.expected);
        assert.deepEqual(value.inventory.items[0].shape.cells, [[true]]);
      }
      return observation;
    });
    await scenario('R4-mounted-object-class-before-mutation', async page => {
      await confirm(page);
      const before = await state(page);
      const raw = await page.evaluate(() => { const doc = JSON.parse(m('outcome').exportCharacterDraft('c-a'));
        doc.runtime = null; doc.canonical.class = { invalid: 'object' }; doc.canonical.lore.notes = 'INVALID CLASS MUST NOT APPLY'; return JSON.stringify(doc); });
      await fileInput(page, raw); const after = await state(page);
      if (red) {
        assert.deepEqual(after.live.class, { invalid: 'object' }); assert.deepEqual(after.roster[0].class, { invalid: 'object' });
        assert.deepEqual(after.draft.canonical.class, { invalid: 'object' }); assert.deepEqual(after.alerts, []);
        assert.equal(after.live.notes, 'INVALID CLASS MUST NOT APPLY');
      } else { unchanged(before, after); assert(after.alerts[0]?.includes('class')); }
      assert.equal(await page.getByLabel('Import selected draft').evaluate(input => input.files[0].text()), raw);
      return { before, after, source: JSON.parse(raw), snapshot: await page.locator('body').ariaSnapshot() };
    });
    if (!red) {
      await scenario('R4-consumer-derived-malformed-types', async page => {
        await confirm(page);
        // Let the previously authored baseline's real debounce settle before a
        // multi-case refusal loop; its unrelated save may update roster metadata.
        await page.waitForTimeout(2400); const before = await state(page);
        const cases = [
          ['name', doc => { doc.canonical.name = {}; }], ['race', doc => { doc.canonical.race = 7; }],
          ['class-array', doc => { doc.canonical.class = []; }], ['subrace', doc => { doc.canonical.subrace = {}; }],
          ['level', doc => { doc.canonical.level = 'three'; }], ['acquisition', doc => { doc.canonical.classAcquisition = []; }],
          ['known-spells', doc => { doc.canonical.class_spells.known_spells = {}; }], ['history', doc => { doc.canonical.levelUpHistory = []; }],
          ['root-resource', doc => { doc.canonical.health.current = 'bad'; }], ['runtime-temp', doc => { doc.runtime.tempHealth = {}; }],
          ['inventory-position', doc => { doc.runtime.inventory.items = [{ id: 'bad', position: { row: 'bad', col: 0 } }]; }],
          ['item-shape', doc => { doc.runtime.inventory.items = [{ id: 'bad', shape: { cells: ['bad'] } }]; }],
          ['currency', doc => { doc.runtime.inventory.currency.gold = {}; }], ['equipment', doc => { doc.runtime.equipment.mainHand = 'bad'; }],
          ['quest-entry', doc => { doc.runtime.quests.quests = [null]; }], ['condition-entry', doc => { doc.runtime.buffs = [null]; }],
          ['lore-notes', doc => { doc.canonical.lore.notes = {}; }]
        ];
        const rejected = [];
        for (const [name, mutate] of cases) {
          const doc = structuredClone(before.draft); mutate(doc); await fileInput(page, JSON.stringify(doc)); const after = await state(page);
          unchanged(before, after); assert(after.alerts[0], name); rejected.push({ name, alerts: after.alerts });
        }
        return { before, rejected, after: await state(page) };
      });
      await scenario('R1-supported-inventory-unknown-fields-import-recovery', async page => {
        await page.evaluate(() => { const inventory = m('inventory').default;
          inventory.getState().addItem({ id: 'custom-blade', name: 'Custom blade', type: 'weapon', quality: 'common', width: 2, height: 2,
            shape: { type: 'custom', width: 2, height: 2, cells: [[true, false], [false, true]] }, futureLore: { shape: { cells: ['[true]'] } } }); });
        await confirm(page);
        const raw = await page.evaluate(() => { const doc = JSON.parse(m('outcome').exportCharacterDraft('c-a'));
          const unknown = { shape: { cells: ['[true]'] }, nested: { text: ['[false,true]'], extra: { value: 'keep' } } };
          doc.canonical.futureAnnotation = unknown; doc.runtime.futureAnnotation = unknown;
          doc.canonical.futureInventory = { items: [{ shape: { cells: ['[true]'] } }] };
          doc.runtime.futureInventory = structuredClone(doc.canonical.futureInventory);
          doc.canonical.inventory.items[0].containerProperties = { items: [structuredClone(doc.runtime.inventory.items[0])], futureAnnotation: unknown };
          doc.runtime.inventory.items[0].containerProperties = structuredClone(doc.canonical.inventory.items[0].containerProperties);
          doc.canonical.name = 'Custom Hero'; doc.canonical.race = 'Custom Kin'; doc.canonical.class = 'Custom Calling';
          doc.canonical.classAcquisition = { custom: { body: 'keep' } }; doc.canonical.bodyStates = [{ id: 'custom-body', custom: true }];
          doc.canonical.inventory.containers = [{ id: 'pack', items: structuredClone(doc.runtime.inventory.items), futureAnnotation: unknown }];
          doc.runtime.inventory.containers = structuredClone(doc.canonical.inventory.containers);
          // Legacy equipment aliases and standard slots hold item records too.
          doc.canonical.equipment.mainHand = structuredClone(doc.runtime.inventory.items[0]);
          doc.runtime.equipment.mainHand = structuredClone(doc.runtime.inventory.items[0]);
          doc.canonical.equipment.weapon = structuredClone(doc.runtime.inventory.items[0]);
          doc.runtime.equipment.accessories = [structuredClone(doc.runtime.inventory.items[0])];
          return JSON.stringify(doc); });
        await fileInput(page, raw); const imported = await state(page); assert.deepEqual(imported.alerts, []);
        // Canonical updatedAt is observational metadata excluded by the existing
        // draft fingerprint; all authored/preserved fields must remain exact.
        assert.deepEqual({ ...imported.draft.canonical, updatedAt: undefined }, { ...JSON.parse(raw).canonical, updatedAt: undefined });
        assert.deepEqual(imported.draft.runtime, JSON.parse(raw).runtime);
        await confirmImported(page);
        const loaded = await page.evaluate(async () => ({ canonical: await m('canonical').default.loadCharacter('c-a', 'u-a'), runtime: await m('runtime').default.loadCharacterState('u-a', 'c-a') }));
        for (const lane of ['canonical', 'runtime']) {
          assert.deepEqual(loaded[lane].futureAnnotation, JSON.parse(raw)[lane].futureAnnotation);
          assert.deepEqual(loaded[lane].futureInventory, JSON.parse(raw)[lane].futureInventory);
          assert.deepEqual(loaded[lane].inventory, JSON.parse(raw)[lane].inventory);
          for (const [slot, item] of Object.entries(JSON.parse(raw)[lane].equipment)) assert.deepEqual(loaded[lane].equipment[slot], item);
        }
        const legacy = await page.evaluate(async () => {
          for (const path of ['characters/c-a', 'users/u-a/characterStates/c-a']) {
            const doc = __docs.get(path); doc.inventory.items[0].shape.cells = ['[true,false]', '[false,true]'];
            doc.inventory.items.push({ id: 'legacy-no-shape', width: 1, height: 1, futureLore: { shape: { cells: ['[true]'] } } });
          }
          return { canonical: await m('canonical').default.loadCharacter('c-a', 'u-a'), runtime: await m('runtime').default.loadCharacterState('u-a', 'c-a') };
        });
        for (const lane of ['canonical', 'runtime']) {
          assert.deepEqual(legacy[lane].inventory.items[0].shape.cells, [[true, false], [false, true]]);
          assert.equal(legacy[lane].inventory.items[1].shape, undefined); assert.deepEqual(legacy[lane].inventory.items[1].futureLore.shape.cells, ['[true]']);
        }
        // Both candidates are retained before refused writes; real document reload
        // must preserve them, independent of the fixture's sessionStorage cloud.
        const recoveryRaw = await page.evaluate(() => { const doc = JSON.parse(m('outcome').exportCharacterDraft('c-a'));
          doc.canonical.health.current = 8; doc.canonical.resources.health.current = 8; doc.runtime.health.current = 8;
          window.__rejectCanonical = true; window.__rejectRuntime = true; return JSON.stringify(doc); });
        await fileInput(page, recoveryRaw);
        await page.getByRole('button', { name: 'Retry character save' }).click(); await page.getByRole('button', { name: 'Retry runtime save' }).click();
        await page.waitForFunction(() => document.querySelector('.character-save-status').textContent.match(/Save failed/g)?.length === 2);
        const failed = await state(page); await page.reload();
        await page.evaluate(async () => { m('init').initStoreRegistry(); window.__liveUser = { uid: 'u-a', getIdToken: async () => 'test' };
          m('auth').default.getState().setUser(__liveUser); await m('coordinator').whenHandoffIdle();
          window.__rejectCanonical = true; window.__rejectRuntime = true; await m('character').default.getState().loadActiveCharacter(); __mount(); });
        await page.waitForFunction(() => m('character').default.getState().health.current === 8);
        const recovered = await state(page); assert.deepEqual(recovered.items, failed.items);
        assert.deepEqual(recovered.draft.canonical.futureAnnotation, failed.draft.canonical.futureAnnotation);
        assert.deepEqual(recovered.draft.runtime.futureAnnotation, failed.draft.runtime.futureAnnotation);
        await page.evaluate(() => { window.__rejectCanonical = false; window.__rejectRuntime = false; }); await confirmImported(page);
        return { imported, loaded, legacy, failed, recovered, healed: await state(page) };
      });
    }
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
}
function unchanged(before, after) { for (const key of ['id', 'roster', 'live', 'projections', 'items', 'draft']) assert.deepEqual(after[key], before[key], key); }
async function state(page) { return page.evaluate(() => { const state = m('character').default.getState(); return {
  id: state.currentCharacterId, roster: state.characters, live: { name: state.name, race: state.race, class: state.class, health: state.health, mana: state.mana,
    actionPoints: state.actionPoints, classResource: state.classResource, equipment: state.equipment, notes: state.lore.notes,
    tempHealth: state.tempHealth, tempMana: state.tempMana, tempActionPoints: state.tempActionPoints, exhaustionLevel: state.exhaustionLevel,
    classAcquisition: state.classAcquisition, bodyStates: state.bodyStates, stats: state.stats, class_spells: state.class_spells,
    levelUpHistory: state.levelUpHistory, skillRanks: state.skillRanks, skillProgress: state.skillProgress,
    skillPointsSpent: state.skillPointsSpent, skillPointsAvailable: state.skillPointsAvailable },
  projections: { buffs: m('conditions').default.getState().activeBuffs, debuffs: m('conditions').default.getState().activeDebuffs,
    quests: m('quests').default.getState().quests, categories: m('quests').default.getState().categories,
    questCategories: m('quests').default.getState().questCategories, currency: m('inventory').default.getState().currency,
    containers: m('inventory').default.getState().containers, encumbranceState: m('inventory').default.getState().encumbranceState },
  items: m('inventory').default.getState().items, draft: JSON.parse(m('outcome').exportCharacterDraft('c-a')),
  alerts: [...document.querySelectorAll('[role=alert]')].map(element => element.textContent) }; }); }
async function fileInput(page, raw) { await page.getByLabel('Import selected draft').setInputFiles({ name: 'draft.json', mimeType: 'application/json', buffer: Buffer.from(raw) }); await page.waitForTimeout(150); }
async function confirm(page) { await page.evaluate(async () => { m('character').default.getState().updateLore('notes', 'confirmed baseline'); await m('character').default.getState().saveCurrentCharacter(); });
  await page.getByRole('button', { name: 'Retry runtime save' }).click(); await page.waitForFunction(() => document.querySelector('.character-save-status').textContent.match(/Cloud saved/g)?.length === 2); }
async function confirmImported(page) { await page.getByRole('button', { name: 'Retry character save' }).click(); await page.getByRole('button', { name: 'Retry runtime save' }).click();
  await page.waitForFunction(() => document.querySelector('.character-save-status').textContent.match(/Cloud saved/g)?.length === 2); }
// Replay the exact pre-correction witness, even as GREEN controls are refined.
const reviewedWitness = path.join(evidence, 'reviewed-witness.cjs');
if (red && fs.existsSync(reviewedWitness)) {
  const frozen = fs.readFileSync(reviewedWitness);
  assert.equal(hash(frozen), JSON.parse(fs.readFileSync(path.join(evidence, 'freeze-complete.json'))).witnessSha256);
  const replay = new Module(__filename, module); replay.filename = __filename; replay.paths = module.paths;
  replay._compile(frozen.toString('utf8'), __filename);
} else main().catch(error => { console.error(error); process.exitCode = 1; });
