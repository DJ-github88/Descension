/** Permanent independent container composition regression. Production module
 * bodies are unchanged; only auth/config/Firestore transport are simulated.
 * --freeze once before correction; --red replays those bytes; --historical
 * retains the earlier compatibility witness. Fresh output has its own directory. */
const fs = require('fs'), path = require('path'), Module = require('module');
const assert = require('assert/strict'), crypto = require('crypto'), zlib = require('zlib');
const { createRequire } = require('module');
const deps = createRequire(path.resolve(__dirname, '../../package.json'));
const root = path.resolve(__dirname, '../../..');
const evidence = process.env.P6_CONTAINER_EVIDENCE || path.join(__dirname, 'evidence/container');
const filename = path.join(__dirname, 'character-save-browser.cjs');
const snapshotFile = path.join(evidence, 'reviewed-source-complete.json.gz');
const red = process.argv.includes('--red'), historical = process.argv.includes('--historical');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
/* global m, __docs, __mount, __liveUser */
let code = fs.readFileSync(filename, 'utf8');
if (red || historical) {
  const snapshot = JSON.parse(zlib.gunzipSync(fs.readFileSync(historical ? path.join(__dirname, 'evidence/remaining/reviewed-source-complete.json.gz') : snapshotFile)));
  const directory = fs.mkdtempSync('D:/AppData/Temp/opencode/p6-container-replay-');
  for (const [file, bytes] of Object.entries(snapshot.files)) {
    const content = Buffer.from(bytes, 'base64'); assert.equal(hash(content), snapshot.hashes[file], file);
    const destination = path.join(directory, file); fs.mkdirSync(path.dirname(destination), { recursive: true }); fs.writeFileSync(destination, content);
  }
  code = Buffer.from(snapshot.files['vtt-react/verification/p6/character-save-browser.cjs'], 'base64').toString('utf8');
  code = code.replace("const sourceRoot = path.resolve(__dirname, '../../src');", `const sourceRoot = ${JSON.stringify(path.join(directory, 'vtt-react/src'))};`);
}
code = code.replace("canonical: 'services/firebase/characterPersistenceService.js'", "canonical: 'services/firebase/characterPersistenceService.js', runtime: 'services/firebase/characterStateService.js', containerShape: 'utils/containerShapeUtils.js', codec: 'utils/characterShapeCodec.js'");
code = code.replace('if(window.__holdPath===ref.path)', `const validate=(value,inArray=false)=>{if(Array.isArray(value)){if(inArray)throw Error('Firestore nested array refused');value.forEach(item=>validate(item,true));}else if(value&&typeof value==='object')Object.values(value).forEach(item=>validate(item));};validate(v);if(window.__holdPath===ref.path)`);
const loaded = new Module(filename, module); loaded.filename = filename; loaded.paths = Module._nodeModulePaths(path.dirname(filename)); loaded._compile(code, filename);

async function main() {
  const { server, manifest } = loaded.exports.start(); fs.mkdirSync(evidence, { recursive: true });
  if (process.argv.includes('--freeze')) {
    assert(!fs.existsSync(snapshotFile), 'Never replace the reviewed snapshot');
    const files = [...Object.keys(manifest).map(file => 'vtt-react/src/' + file), 'vtt-react/src/config/firebase.js', 'vtt-react/verification/p6/character-save-browser.cjs', 'vtt-react/src/components/character-sheet/character-save-status.css'];
    const bytes = Object.fromEntries(files.map(file => [file, fs.readFileSync(path.join(root, file))]));
    const snapshot = { hashes: Object.fromEntries(Object.entries(bytes).map(([file, value]) => [file, hash(value)])), files: Object.fromEntries(Object.entries(bytes).map(([file, value]) => [file, value.toString('base64')])) };
    fs.writeFileSync(snapshotFile, zlib.gzipSync(JSON.stringify(snapshot)));
    fs.writeFileSync(path.join(evidence, 'freeze-complete.json'), JSON.stringify({ manifest, snapshotFiles: files.length, snapshotSha256: hash(fs.readFileSync(snapshotFile)), runnerSha256: hash(fs.readFileSync(__filename)) }, null, 2));
    console.log(`Frozen ${files.length} pre-correction source files`); return;
  }
  if (red) assert.deepEqual(manifest, JSON.parse(fs.readFileSync(path.join(evidence, 'freeze-complete.json'))).manifest);
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  if (process.argv.includes('--serve')) { console.log(`http://127.0.0.1:${server.address().port}`); return; }
  const browser = await deps('playwright').chromium.launch({ channel: 'chrome', headless: true });
  try {
    const context = await browser.newContext();
    await context.route('**/*', route => new URL(route.request().url()).hostname === '127.0.0.1' ? route.continue() : route.abort());
    const page = await context.newPage(), errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    await page.evaluate(async () => {
      m('init').initStoreRegistry(); window.__liveUser = { uid: 'u-a', getIdToken: async () => 'test' };
      m('auth').default.getState().setUser(__liveUser); await m('coordinator').whenHandoffIdle();
      const seed = { id: 'c-a', name: 'CONTAINER PROBE', race: 'Human', class: 'Martyr', level: 3, stats: { strength: 10, agility: 10, constitution: 10, intelligence: 10, spirit: 10, charisma: 10 }, resources: { health: { current: 30, max: 50 }, mana: { current: 20, max: 50 }, actionPoints: { current: 2, max: 3 } }, lore: { notes: 'baseline' } };
      __docs.set('characters/c-a', m('canonical').transformForStorage(seed, 'u-a')); await m('character').default.getState().loadActiveCharacter(); __mount();
    });
    await page.getByRole('region', { name: 'Selected character save status' }).waitFor();
    // Exact independent probe, before supplemental nesting/import controls.
    const observation = await page.evaluate(async () => {
      const shape = m('containerShape').containerShapeFromCells([[true, false], [true, true]]);
      const library = { id: 'shaped-pack', name: 'Shaped pack', type: 'container', quality: 'common', width: 2, height: 2, containerProperties: { gridSize: { rows: 2, cols: 2 }, shape, items: [] } };
      const added = m('inventory').default.getState().addItemFromLibrary(library, { preserveProperties: true, preserveId: true });
      m('character').default.getState().updateLore('notes', 'production shaped container'); await m('character').default.getState().saveCurrentCharacter();
      const canonical = m('outcome').getCharacterCandidate('c-a', 'canonical'), runtime = m('outcome').getCharacterCandidate('c-a', 'runtime');
      const runtimeResult = await m('outcome').saveCharacterDraft(runtime, (data, current) => m('runtime').default.saveCharacterState('u-a', 'c-a', data, { isCurrent: current }));
      const authoredItem = m('inventory').default.getState().items[0];
      const canonicalEncoded = m('canonical').transformForStorage(canonical.payload, 'u-a');
      const writes = window.__writes.filter(write => JSON.stringify(write.value).includes('shaped-pack'));
      const savedLoads = { canonical: await m('canonical').default.loadCharacter('c-a', 'u-a'), runtime: await m('runtime').default.loadCharacterState('u-a', 'c-a') };
      const legacyItem = structuredClone(authoredItem); legacyItem.shape.cells = legacyItem.shape.cells.map(JSON.stringify);
      legacyItem.containerProperties.shape.cells = legacyItem.containerProperties.shape.cells.map(JSON.stringify);
      const canonicalDoc = m('canonical').transformForStorage({ ...canonical.payload, inventory: { ...canonical.payload.inventory, items: [legacyItem] } }, 'u-a');
      __docs.set('characters/c-a', canonicalDoc); __docs.set('users/u-a/characterStates/c-a', { ...runtime.payload, inventory: { ...runtime.payload.inventory, items: [legacyItem] } });
      const canonicalLoad = await m('canonical').default.loadCharacter('c-a', 'u-a'), runtimeLoad = await m('runtime').default.loadCharacterState('u-a', 'c-a');
      const loadedFloorCells = {}; for (const [lane, value] of Object.entries({ canonical: canonicalLoad, runtime: runtimeLoad })) loadedFloorCells[lane] = m('containerShape').getContainerShapeCells(value.inventory.items[0].containerProperties.shape, 2, 2);
      return { added, expectedCells: shape.cells, authoredItem, canonicalStatus: canonical.status, canonicalMessage: canonical.message, runtimeResult, canonicalEncoded, writes, savedLoads, canonicalLoad, runtimeLoad, loadedFloorCells };
    });
    const result = { result: red ? 'RED-REPRODUCED' : historical ? 'HISTORICAL-COMPATIBILITY' : 'GREEN', manifest, observation, errors, snapshot: await page.locator('body').ariaSnapshot() };
    const output = path.join(evidence, red ? 'red.json' : historical ? 'historical.json' : 'green.json');
    fs.writeFileSync(output, JSON.stringify(result, null, 2));
    assert.equal(observation.added, 'shaped-pack'); assert.deepEqual(observation.expectedCells, [[true, false], [true, true]]);
    if (red) {
      assert.equal(observation.canonicalStatus, 'error'); assert(observation.canonicalMessage.includes('would change preserved data'));
      assert.equal(observation.runtimeResult.success, false); assert(observation.runtimeResult.error.includes('would change preserved data')); assert.deepEqual(observation.writes, []);
      for (const lane of ['canonical', 'runtime']) { assert.deepEqual(observation[lane + 'Load'].inventory.items[0].containerProperties.shape.cells, ['[true,false]', '[true,true]']); assert.deepEqual(observation.loadedFloorCells[lane], [[true, true], [true, true]]); }
    } else {
      assert.equal(observation.canonicalStatus, 'saved'); assert.equal(observation.runtimeResult.success, true);
      for (const [lane, destination] of [['canonical', 'characters/c-a'], ['runtime', 'users/u-a/characterStates/c-a']]) {
        assert(observation.writes.some(write => write.path === destination));
        for (const value of [observation.savedLoads[lane], observation[lane + 'Load']]) {
          assert.deepEqual(value.inventory.items[0].containerProperties.shape, observation.authoredItem.containerProperties.shape);
          assert.deepEqual(value.inventory.items[0].shape, observation.authoredItem.shape);
        }
        assert.deepEqual(observation.loadedFloorCells[lane], observation.expectedCells);
      }
      if (!historical) result.controls = await controls(page, observation.authoredItem);
    }
    assert.deepEqual(errors, []); result.snapshot = await page.locator('body').ariaSnapshot(); fs.writeFileSync(output, JSON.stringify(result, null, 2));
    console.log(JSON.stringify({ result: result.result, canonicalStatus: observation.canonicalStatus, runtimeSuccess: observation.runtimeResult.success, destinationWrites: observation.writes.map(write => write.path), floor: observation.loadedFloorCells, controls: result.controls?.checks, errors }, null, 2));
    await context.close();
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); }
}

async function controls(page, authoredItem) {
  const raw = await page.evaluate(item => {
    const doc = JSON.parse(m('outcome').exportCharacterDraft('c-a'));
    const annotation = { shape: { cells: ['[true]'] } };
    item.futureAnnotation = structuredClone(annotation); item.containerProperties.futureAnnotation = structuredClone(annotation);
    const inner = structuredClone(item); inner.id = 'nested-pack'; inner.shape = { type: 'rectangular', width: 1, height: 1, cells: [[true]] };
    item.containerProperties.items = [inner];
    for (const lane of ['canonical', 'runtime']) {
      doc[lane].futureAnnotation = structuredClone(annotation);
      doc[lane].inventory.items = [structuredClone(item)];
      doc[lane].inventory.containers = [{ id: 'legacy-bag', items: [structuredClone(item)], futureAnnotation: structuredClone(annotation) }];
      doc[lane].equipment.mainHand = structuredClone(item); doc[lane].equipment.weapon = structuredClone(item);
      doc[lane].equipment.accessories = [structuredClone(item)];
    }
    return JSON.stringify(doc);
  }, authoredItem);
  const expected = JSON.parse(raw);
  await page.getByLabel('Import selected draft').setInputFiles({ name: 'container.json', mimeType: 'application/json', buffer: Buffer.from(raw) });
  await page.waitForFunction(() => m('inventory').default.getState().items[0]?.containerProperties.items[0]?.id === 'nested-pack');
  assert.equal(await page.getByLabel('Import selected draft').evaluate(input => input.files[0].text()), raw);
  const imported = await state(page); assert.deepEqual(imported.alerts, []); exact(imported, expected);
  await retry(page, 'Cloud saved');
  const loaded = await page.evaluate(async () => ({ canonical: await m('canonical').default.loadCharacter('c-a', 'u-a'), runtime: await m('runtime').default.loadCharacterState('u-a', 'c-a') }));
  exact(loaded, expected);
  // Persist failed new candidates, then recover through a real document reload.
  const recoveryRaw = await page.evaluate(() => { const doc = JSON.parse(m('outcome').exportCharacterDraft('c-a')); doc.canonical.lore.notes = 'container recovery'; doc.runtime.health.current = 8; window.__rejectCanonical = true; window.__rejectRuntime = true; return JSON.stringify(doc); });
  await page.getByLabel('Import selected draft').setInputFiles({ name: 'recovery.json', mimeType: 'application/json', buffer: Buffer.from(recoveryRaw) });
  await page.waitForFunction(() => m('character').default.getState().health.current === 8); await retry(page, 'Save failed');
  const failed = await state(page); exact(failed, expected); await page.reload();
  await page.evaluate(async () => { m('init').initStoreRegistry(); window.__liveUser = { uid: 'u-a', getIdToken: async () => 'test' }; m('auth').default.getState().setUser(__liveUser); await m('coordinator').whenHandoffIdle(); window.__rejectCanonical = true; window.__rejectRuntime = true; await m('character').default.getState().loadActiveCharacter(); __mount(); });
  await page.waitForFunction(() => m('character').default.getState().health.current === 8);
  const recovered = await state(page); exact(recovered, expected); assert.deepEqual(recovered.items, failed.items); assert.equal(recovered.canonical.lore.notes, 'container recovery');
  await page.evaluate(() => { window.__rejectCanonical = false; window.__rejectRuntime = false; }); await retry(page, 'Cloud saved');
  const healed = await state(page); exact(healed, expected);
  return { checks: ['distinct-footprint-interior', 'nested-containers', 'legacy-container-items', 'standard-legacy-equipment-accessories', 'literal-annotations', 'mounted-import', 'refused-save-reload-recovery', 'healed-retries'], imported, loaded, failed, recovered, healed, input: expected };
}
function exact(actual, expected) { for (const lane of ['canonical', 'runtime']) { assert.deepEqual(actual[lane].inventory, expected[lane].inventory); for (const slot of ['mainHand', 'weapon', 'accessories']) assert.deepEqual(actual[lane].equipment[slot], expected[lane].equipment[slot]); assert.deepEqual(actual[lane].futureAnnotation, expected[lane].futureAnnotation); } }
async function state(page) { return page.evaluate(() => ({ ...JSON.parse(m('outcome').exportCharacterDraft('c-a')), items: m('inventory').default.getState().items, alerts: [...document.querySelectorAll('[role=alert]')].map(element => element.textContent) })); }
async function retry(page, text) { await page.getByRole('button', { name: 'Retry character save' }).click(); await page.getByRole('button', { name: 'Retry runtime save' }).click(); await page.waitForFunction(value => document.querySelector('.character-save-status').textContent.split(value).length === 3, text); }
main().catch(error => { console.error(error); process.exitCode = 1; });
