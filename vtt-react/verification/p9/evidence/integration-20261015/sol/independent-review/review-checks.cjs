// Independent bounded review. Writes only this evidence directory; never imports run.cjs.
const fs = require('fs'), path = require('path'), cp = require('child_process');
const crypto = require('crypto'), zlib = require('zlib'), vm = require('vm'), assert = require('assert/strict');
const root = 'D:/VTT', app = path.join(root, 'vtt-react'), out = __dirname, sol = path.dirname(out);
const read = p => fs.readFileSync(path.resolve(root, p));
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const lf = b => b.toString('utf8').replace(/\r\n/g, '\n');
const save = (name, value) => fs.writeFileSync(path.join(out, name), typeof value === 'string' ? value : JSON.stringify(value, null, 2), { flag: 'wx' });
const git = args => cp.execFileSync('git', args, { cwd: root, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, env: { ...process.env, GIT_OPTIONAL_LOCKS: '0' } });
const focus = ['vtt-react/src/services/featherSlash.js', 'vtt-react/src/services/__tests__/featherSlash.test.js', 'vtt-react/src/components/ui/ActionBar.jsx', 'vtt-react/src/components/ui/__tests__/ActionBarLegacyArcanoneerSpheres.test.jsx', 'vtt-react/src/components/hud/PartyHUD.jsx', 'vtt-react/src/components/hud/SpellConsequencePanel.css'];
const dependencies = ['vtt-react/src/services/featherSlashCustody.js', 'vtt-react/src/components/grid/CreatureAbilityQuickUse.jsx', 'vtt-react/src/components/hud/ActorConsequenceControls.jsx', 'vtt-react/src/components/hud/SpellConsequencePanel.jsx', 'vtt-react/src/styles/party-hud.css', 'vtt-react/src/utils/arcanoneerMigration.js', 'vtt-react/src/data/versions.js', 'vtt-react/public/data/abilities.json', 'vtt-react/public/data/creatures.json', 'vtt-react/src/App.jsx'];
const starting = JSON.parse(fs.readFileSync(path.join(sol, 'starting-source.json'))).files;
function inventory() {
  const files = [...new Set(git(['ls-files', '--cached', '--others', '--exclude-standard', '-z']).split('\0').filter(Boolean))]
    .filter(p => !p.includes('/evidence/integration-20261015/sol/') && fs.existsSync(path.join(root, p)));
  return { at: new Date().toISOString(), head: git(['rev-parse', 'HEAD']).trim(), status: git(['status', '--short']), hashes: Object.fromEntries(files.map(p => [p, sha(read(p))])) };
}
function identity(mode) {
  const snapshot = inventory(); save(`${mode}-identity.json`, snapshot);
  const base = JSON.parse(fs.readFileSync(path.join(mode === 'start' ? sol : out, mode === 'start' ? 'before-identity.json' : 'start-identity.json')));
  const changed = Object.keys(base.hashes).filter(p => snapshot.hashes[p] !== base.hashes[p]);
  const added = Object.keys(snapshot.hashes).filter(p => !(p in base.hashes));
  save(`${mode}-changes.json`, { baseAt: base.at, comparedAt: snapshot.at, compared: Object.keys(base.hashes).length, changed, added });
  save(`${mode}-focal-hashes.json`, Object.fromEntries([...focus, ...dependencies].map(p => [p, { raw: sha(read(p)), lf: sha(lf(read(p))), startingRaw: starting[p] ? sha(Buffer.from(starting[p], 'base64')) : null }])));
  if (mode === 'start') {
    const accepted = Object.fromEntries(fs.readFileSync(path.join(sol, 'accepted-p9-identity-lf-sha256.txt'), 'utf8').trim().split(/\r?\n/).map(l => { const m = l.match(/^([a-f0-9]{64})\s+(.+)$/); assert(m); return [m[2].replace(/^\.\//, ''), m[1]]; }));
    const diffs = {};
    for (const p of focus.filter(p => /ActionBar\.jsx|PartyHUD\.jsx|SpellConsequencePanel\.css/.test(p))) {
      const oldFile = path.join(sol, `accepted-${path.basename(p)}`);
      assert.equal(sha(lf(fs.readFileSync(oldFile))), accepted[p]);
      const d = cp.spawnSync('git', ['diff', '--no-index', '--ignore-space-at-eol', '--', oldFile, path.join(root, p)], { cwd: root, encoding: 'utf8' });
      assert([0, 1].includes(d.status)); diffs[p] = d.stdout;
    }
    for (const p of focus.filter(p => /featherSlash/.test(p))) {
      const oldFile = path.join(out, `starting-${path.basename(p)}`); fs.writeFileSync(oldFile, Buffer.from(starting[p], 'base64'), { flag: 'wx' });
      const d = cp.spawnSync('git', ['diff', '--no-index', '--ignore-space-at-eol', '--', oldFile, path.join(root, p)], { cwd: root, encoding: 'utf8' });
      assert([0, 1].includes(d.status)); diffs[p] = d.stdout;
    }
    save('narrow-diffs.json', diffs);
  }
  console.log(JSON.stringify({ mode, compared: Object.keys(base.hashes).length, changed, added }));
}
function loadPlanner(source, version) {
  const context = vm.createContext({ DATA_VERSIONS: { abilities: version } });
  vm.runInContext(source.replace(/^import .*;\r?\n/gm, '').replace(/\bexport /g, '') + '\nthis.api = { supportsFeatherSlash, planFeatherSlash, featherReceipt, recordedFaces, canonical, FEATHER_CAPABILITY };', context);
  return context.api;
}
const plain = value => JSON.parse(JSON.stringify(value));
function input(api, raw) {
  const ref = id => ({ kind: 'creature', roomId: 'independent-room', mapId: 'map', tokenId: id, instanceId: `inc-${id}` });
  const sourceRef = ref('source'), targetRef = ref('target');
  const token = r => ({ id: r.tokenId, creatureId: 'grimmstalk', mapId: 'map', state: { actorContract: { version: 1, ...r, revision: 2 }, currentActionPoints: 3, tempActionPoints: 1, currentHp: 40, tempHealth: 4, currentMana: 0, tempMana: 0 } });
  return { raw, sourceRef, targetRef, tokens: [token(sourceRef), token(targetRef)], roomId: 'independent-room', mapId: 'map', roll: plain(api.recordedFaces('physical', [2, 7])), adjudicated: true, finalAmount: 14, reason: '' };
}
function invariants() {
  const packetPath = 'D:/AppData/Temp/opencode/p8-20261014/independent/final-cycle2/accepted-source.json.gz';
  const packetBytes = fs.readFileSync(packetPath); assert.equal(sha(packetBytes), 'b53b919df7f944dfbe58a7ec380c46b0af99097b437ce7d21dd01a3c58e74a0c');
  const packet = JSON.parse(zlib.gunzipSync(packetBytes));
  const get = p => { const b = Buffer.from(packet.files[p], 'base64'); assert.equal(sha(b), packet.hashes[p]); return JSON.parse(b); };
  const ap = 'vtt-react/public/data/abilities.json', cr = 'vtt-react/public/data/creatures.json';
  const oldAbilities = get(ap), newAbilities = JSON.parse(read(ap)), oldCreatures = get(cr), newCreatures = JSON.parse(read(cr));
  assert.deepEqual(newAbilities.grimmstalk, oldAbilities.grimmstalk);
  assert.deepEqual(newCreatures.find(c => c.id === 'grimmstalk'), oldCreatures.find(c => c.id === 'grimmstalk'));
  const changedAbilities = Object.keys(oldAbilities).filter(k => JSON.stringify(oldAbilities[k]) !== JSON.stringify(newAbilities[k]));
  const changedCreatures = oldCreatures.filter(c => JSON.stringify(c) !== JSON.stringify(newCreatures.find(n => n.id === c.id))).map(c => c.id);
  assert.deepEqual(changedAbilities, []); assert.deepEqual(changedCreatures, []);
  const raw = newAbilities.grimmstalk.find(a => a.id === 'grimmstalk_feather_slash');
  const source = read(focus[0]).toString(), originalSource = Buffer.from(starting[focus[0]], 'base64').toString();
  const original = loadPlanner(originalSource, '1.4.0'), originalInput = input(original, raw), originalPlan = plain(original.planFeatherSlash(originalInput));
  const receipt = { success: true, status: 'checkpoint-confirmed', receipt: { version: 1, commandId: '11111111-2222-4333-8444-555555555555', roomId: originalInput.roomId, submitterUid: 'gm', checkpointRevision: 7, source: originalInput.sourceRef, target: originalInput.targetRef, actors: originalPlan.entries, adjudication: originalPlan.extra.adjudication } };
  const receiptBytes = JSON.stringify(receipt), inputBytes = JSON.stringify(originalInput), originalView = plain(original.featherReceipt(receipt));
  const mutations = [
    ['id', 'other'], ['spellType', 'PASSIVE'], ['effectTypes', ['healing']], ['priorityRange.min', 2], ['priorityRange.max', 12], ['priorityRange.resolution', 'CARDS'],
    ['typeConfig.school', 'ember'], ['typeConfig.icon', 'other'], ['typeConfig.tags', ['ember']], ['typeConfig.castTime', 2], ['typeConfig.castTimeType', 'MINUTES'], ['typeConfig.extra', true],
    ['targetingConfig.targetingType', 'area'], ['targetingConfig.rangeType', 'ranged'], ['targetingConfig.rangeDistance', 20], ['targetingConfig.targetRestrictions', ['allies']], ['targetingConfig.extra', true],
    ['resourceCost.actionPoints', 0], ['resourceCost.mana', 1], ['resourceCost.components', []], ['resourceCost.extra', true], ['cooldownConfig.cooldownType', 'real_time'], ['cooldownConfig.cooldownValue', 1],
    ['damageConfig.formula', '3d8 + 5'], ['damageConfig.damageTypes', ['ember']], ['damageConfig.resolution', 'CARDS'], ['damageConfig.extra', true], ['summonConfig', {}]
  ];
  const results = [];
  for (const version of ['1.4.0', '1.5.0']) {
    const api = loadPlanner(source, version);
    assert.equal(api.supportsFeatherSlash(raw), true); assert.equal(api.supportsFeatherSlash(raw, 'other'), false);
    assert.equal(api.FEATHER_CAPABILITY, 'feather-slash:v1/abilities:1.4.0');
    assert.deepEqual(plain(api.planFeatherSlash(plain(originalInput))), originalPlan);
    assert.deepEqual(plain(api.featherReceipt(receipt)), originalView);
    const refused = [];
    for (const [key, value] of mutations) {
      const changed = plain(raw), keys = key.split('.'); let at = changed;
      keys.slice(0, -1).forEach(k => { at = at[k]; }); at[keys.at(-1)] = value;
      assert.equal(api.supportsFeatherSlash(changed), false, `${version}: ${key}`);
      assert.throws(() => api.planFeatherSlash(input(api, changed)), /Unsupported raw configuration/);
      const tampered = plain(receipt), recorded = JSON.parse(tampered.receipt.adjudication.chosenResult);
      recorded.rawDefinition = JSON.stringify(changed); tampered.receipt.adjudication.chosenResult = JSON.stringify(recorded);
      assert.equal(api.featherReceipt(tampered), null);
      refused.push(key);
    }
    results.push({ version, support: true, originalPlanByteEquivalent: true, originalReceiptViewIdentical: true, refusedExecutionMutations: refused });
  }
  const unreviewed = ['1.3.0', '1.4.1', '1.5.1', '1.6.0', '2.0.0', '1.5', '1.5.0-beta', '', null, undefined, 1.5];
  for (const version of unreviewed) {
    const api = loadPlanner(source, version); assert.equal(api.supportsFeatherSlash(raw), false);
    assert.throws(() => api.planFeatherSlash(input(api, raw)), /Unsupported raw configuration/); assert.equal(api.featherReceipt(receipt), null);
  }
  assert.equal(JSON.stringify(receipt), receiptBytes); assert.equal(JSON.stringify(originalInput), inputBytes);
  const unchangedMetadata = ['name', 'description', 'level', 'icon', 'tags'].map(key => {
    const changed = { ...raw, [key]: key === 'level' ? 99 : key === 'tags' ? ['changed'] : 'changed' };
    return { key, original14: original.supportsFeatherSlash(changed), current15: loadPlanner(source, '1.5.0').supportsFeatherSlash(changed) };
  });
  save('invariants.json', { passed: true, packetPath, packetSha256: sha(packetBytes), rawEquality: true, changedAbilities, changedCreatures, addedAbilities: Object.keys(newAbilities).filter(k => !(k in oldAbilities)), addedCreatures: newCreatures.filter(c => !oldCreatures.some(o => o.id === c.id)).map(c => c.id), versions: results, unreviewedRefused: unreviewed.map(v => v === undefined ? '<undefined>' : v), inputAndReceiptUnmodified: true, originalPlan, originalReceipt: receipt, unchangedMetadataPolicy: unchangedMetadata, method: 'VM executes unmodified function bodies; only ES module import/export syntax removed and DATA_VERSIONS injected. Compares to exact pre-implementation source.' });
  console.log('PASS: raw packet identity/equality; two allowed versions; 28 execution mutations x2 (support/planner/receipt); 11 unreviewed versions; original plan/receipt identity.');
}
function tests() {
  const args = ['node_modules/react-scripts/bin/react-scripts.js', 'test', '--watchAll=false', '--runInBand', '--silent', '--testTimeout=20000', '--runTestsByPath', 'src/services/__tests__/featherSlash.test.js', 'src/services/__tests__/spellConsequence.test.js', 'src/components/grid/__tests__/CreatureAbilityFanOut.test.js', 'src/components/ui/__tests__/ActionBarLegacyArcanoneerSpheres.test.jsx', 'src/components/ui/__tests__/ActionBarP9Producer.test.jsx', 'src/components/hud/__tests__/PartyHUD.test.jsx', 'src/components/character-sheet/__tests__/SpellActionBarP9Producer.test.jsx'];
  const start = new Date().toISOString(), before = Object.fromEntries([...focus, ...dependencies].map(p => [p, sha(read(p))]));
  const r = cp.spawnSync(process.execPath, args, { cwd: app, encoding: 'utf8', maxBuffer: 8 * 1024 * 1024, timeout: 180000, env: { ...process.env, CI: 'true', NODE_OPTIONS: '--max-old-space-size=8192' } });
  save('focused.log', r.stdout + r.stderr); const drift = Object.keys(before).filter(p => before[p] !== sha(read(p)));
  save('focused-command.json', { command: [process.execPath, ...args], cwd: app, started: start, ended: new Date().toISOString(), exit: r.status, signal: r.signal, error: r.error?.message, before, drift });
  console.log(r.stdout + r.stderr); assert.equal(r.status, 0); assert.deepEqual(drift, []);
}
const mode = process.argv[2];
if (mode === 'start' || mode === 'end') identity(mode);
else if (mode === 'invariants') invariants();
else if (mode === 'tests') tests();
else throw Error('Choose start/end/invariants/tests');
