// Mounted production bounds consumers/producers; implementer evidence, not acceptance.
require('./preload.cjs');
const fs = require('fs'), path = require('path'), vm = require('vm'), crypto = require('crypto'), assert = require('assert/strict'), Module = require('module');
const root = path.resolve(__dirname, '../../..'), out = process.env.P7_BOUNDS_OUT;
if (!out) throw Error('P7_BOUNDS_OUT is required');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex'), serverHashes = {};
const load = Module._extensions['.js'];
Module._extensions['.js'] = (module, filename) => {
  if (filename.startsWith(path.join(root, 'server')) && !filename.includes('node_modules')) serverHashes[path.relative(root, filename).replace(/\\/g, '/')] = sha(fs.readFileSync(filename));
  load(module, filename);
};
const { createProductionStackServer } = require(path.join(root, 'server/tests/helpers/productionStackServer'));
const actors = require(path.join(root, 'server/services/actorConsequences'));
const deps = Module.createRequire(path.join(root, 'vtt-react/package.json'));
const ack = (client, event, payload) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(Error('ACK timeout: ' + event)), 5000);
  client.emit(event, payload, value => { clearTimeout(timer); resolve(value); });
});
async function main() {
  const backend = createProductionStackServer({ characterOwners: { 'c-bounds': 'u-bounds' } }); await backend.start();
  backend.registerAuthToken('bounds-browser', 'u-bounds'); const client = backend.connect({ token: 'bounds-browser' });
  await new Promise(resolve => client.once('connect', resolve)); const room = await backend.seedRoom(client.id, { gmUserId: 'u-bounds' });
  for (const event of ['actor_snapshot', 'token_updated', 'character_token_updated']) backend.setEventLimits(event, { maxPerMinute: 20000, maxPerSecond: 20000 });
  const outbound = [], bridge = (req, res) => {
    if (req.url !== '/event' || req.method !== 'POST') return false;
    let bytes = ''; req.on('data', value => { bytes += value; }); req.on('end', async() => {
      const { event, payload } = JSON.parse(bytes); outbound.push({ event, payload });
      try { res.end(JSON.stringify(await ack(client, event, payload))); } catch (error) { res.statusCode = 500; res.end(JSON.stringify({ success: false, error: error.message })); }
    }); return true;
  };
  let builder = fs.readFileSync(path.join(root, 'vtt-react/verification/p6/character-save-browser.cjs'), 'utf8').split('async function main()')[0];
  builder = builder.replace("canonical: 'services/firebase/characterPersistenceService.js'", "canonical: 'services/firebase/characterPersistenceService.js', actors:'services/actorConsequenceService.js', game:'store/gameStore.js', hydration:'services/silentRoomHydration.js', creatures:'store/creatureStore.js', tokens:'store/characterTokenStore.js', map:'store/mapStore.js', tokenHandlers:'components/multiplayer/socketHandlers/tokenHandlers.js', characterHandlers:'components/multiplayer/socketHandlers/characterHandlers.js', controls:'components/hud/ActorConsequenceControls.jsx'");
  builder = builder.replace('if (assets[req.url])', 'if (handleBridge(req,res)) return; if (assets[req.url])');
  builder = builder.replace("if (file.endsWith('.json'))", "if (/\\.(png|jpg|jpeg|webp|svg)$/.test(file)) { modules[file].code='module.exports='+JSON.stringify('data:image/png;base64,'+fs.readFileSync(file).toString('base64'))+';'; return file; } if (file.endsWith('.json'))");
  const sandbox = { require, __dirname: path.join(root, 'vtt-react/verification/p6'), module: { exports: {} }, console, Buffer, process, handleBridge: bridge };
  vm.runInNewContext(builder + '\nmodule.exports=start;', sandbox, { filename: 'bounds-fixture-builder.cjs' });
  const built = sandbox.module.exports(), http = built.server;
  await new Promise(resolve => http.listen(0, '127.0.0.1', resolve));
  const browser = await deps('playwright').chromium.launch({ channel: 'chrome', headless: true });
  const evidence = { simulations: ['Provider identity, canonical ownership, lease backend and inherited P6 browser SDK/config/router fixtures', 'Temporary live-only room; no cloud/deployed restart claim', 'HTTP outbound to real Socket.IO registration; subscribed inbound delivery explicitly bridged'], manifest: built.manifest, observations: {}, outbound };
  try {
    const page = await browser.newPage(), errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:' + http.address().port);
    await page.evaluate(async({ roomId, socketId }) => {
      m('init').initStoreRegistry(); window.__liveUser = { uid: 'u-bounds', getIdToken: async() => 'fixture' };
      m('auth').default.getState().setUser(__liveUser); await m('coordinator').whenHandoffIdle();
      window.__listeners = {}; window.__socket = { id: socketId, connected: true,
        emit: (event, payload, cb) => fetch('/event', { method: 'POST', body: JSON.stringify({ event, payload }) }).then(r => r.json()).then(value => cb?.(value)),
        on: (event, fn) => (__listeners[event] ||= new Set()).add(fn), off: (event, fn) => __listeners[event]?.delete(fn) };
      window.__dispatch = (event, payload) => { for (const fn of __listeners[event] || []) fn(payload); };
      window.__delta = { current: false };
      m('game').default.setState({ isInMultiplayer: true, isGMMode: true, multiplayerRoom: { id: roomId }, multiplayerSocket: __socket });
      m('actors').registerActorHandlers({ socket: __socket });
      m('tokenHandlers').registerTokenHandlers({ socket: __socket, useDeltaSyncTokensRef: __delta });
      m('characterHandlers').registerCharacterHandlers({ socket: __socket });
      const refreshed = await m('actors').refreshActorSnapshot(); if (!refreshed.success) throw Error(JSON.stringify(refreshed));
      window.__root = ReactDOM.createRoot(document.getElementById('app')); ReactDOM.flushSync(() => __root.render(React.createElement(m('controls').default)));
    }, { roomId: room.id, socketId: client.id });
    const dispatch = (event, payload) => page.evaluate(({ event, payload }) => __dispatch(event, payload), { event, payload });
    const view = id => page.evaluate(id => m('actors').findActor(id), id);
    const created = await ack(client, 'token_created', { roomId: room.id, mapId: 'default', token: { id: 'bounds-creature', state: { currentHp: 40, currentMana: 20, currentActionPoints: 3, tempHealth: 6, conditions: [] } }, creature: { stats: { maxHp: 50, maxMana: 30, maxAP: 5 } }, position: { x: 0, y: 0 } });
    assert.equal(created.success, true); await page.evaluate(() => m('actors').refreshActorSnapshot());
    await page.getByRole('combobox', { name: 'Exact room attachment' }).selectOption('creature:bounds-creature');
    await page.getByRole('button', { name: 'Bind primary attachment' }).click();
    await page.waitForFunction(() => !!m('actors').refOf(m('actors').findActor('bounds-creature')));
    const old = await ack(client, 'actor_snapshot', { roomId: room.id });
    for (const updates of [{ state: { maxHp: 60 } }, { stats: { maxHp: 70, maxMana: 35, maxAP: 6 } }]) {
      const delivered = new Promise(resolve => client.once('token_updated', resolve));
      assert.equal((await ack(client, 'token_updated', { roomId: room.id, tokenId: 'bounds-creature', updates })).success, true);
      const packet = await delivered; await dispatch('token_updated', packet);
      const token = await view('bounds-creature'); assert.equal(token.state.maxHp, updates.state?.maxHp || updates.stats.maxHp);
      assert.equal(token.state.currentHp, 40); assert.equal(token.state.tempHealth, 6);
      evidence.observations[updates.state ? 'stateMax' : 'statsMax'] = { packet, token };
    }
    await dispatch('token_updated', { roomId: room.id, actorSnapshot: old }); assert.equal((await view('bounds-creature')).state.maxHp, 70);
    const fresh = await page.evaluate(() => { const token = m('actors').findActor('bounds-creature'); return m('actors').submitActorEntries([{ ref: m('actors').refOf(token), expectedRevision: token.state.actorContract.revision, finalResources: { hp: { current: 65, temp: 6 } } }]); });
    assert.equal(fresh.success, true, JSON.stringify(fresh)); assert.equal((await view('bounds-creature')).state.currentHp, 65);
    evidence.observations.freshCommand = fresh;
    const character = { id: 'c-bounds', name: 'Bounds PC', level: 2, health: { current: 40, max: 50 }, mana: { current: 20, max: 30 }, actionPoints: { current: 3, max: 5 }, tempHealth: 6, tempMana: 2, tempActionPoints: 1 };
    const pcCreated = new Promise(resolve => client.once('character_token_created', resolve)); client.emit('character_token_created', { roomId: room.id, token: { id: 'bounds-pc', character }, mapId: 'default' }); await dispatch('character_token_created', await pcCreated);
    await page.getByRole('combobox', { name: 'Exact room attachment' }).selectOption('character:bounds-pc'); await page.getByRole('button', { name: 'Bind primary attachment' }).click();
    await page.waitForFunction(() => !!m('actors').refOf(m('actors').findActor('bounds-pc')));
    await page.evaluate(character => m('character').default.setState({ ...character, currentCharacterId: character.id }), character);
    await page.getByRole('button', { name: 'Use this owner attachment' }).click();
    const pcDelivery = new Promise(resolve => client.once('character_token_updated', resolve));
    await page.evaluate(() => { m('character').default.setState({ health: { current: 1, max: 80 }, level: 4 }); m('tokens').default.getState().refreshLocalPlayerSnapshot(); });
    const pcPacket = await pcDelivery; await dispatch('character_token_updated', pcPacket);
    const pc = await view('bounds-pc'); assert.deepEqual(pc.character.health, { current: 40, max: 80 }); assert.equal(pc.character.level, 4); assert.equal(pc.character.tempHealth, 6);
    const produced = outbound.find(value => value.event === 'character_token_updated' && value.payload.character?.health?.max === 80); assert(produced, 'Real max80 producer packet missing'); assert.deepEqual(produced.payload.character.health, { max: 80 }); assert.equal(produced.payload.character.tempHealth, undefined);
    evidence.observations.pcProducer = { produced, pcPacket, pc };
    const characterDelivery = new Promise(resolve => client.once('character_updated', resolve));
    await page.evaluate(() => { m('character').default.setState({ health: { current: 1, max: 100 }, level: 5 }); m('character').default.getState().syncWithMultiplayer(); });
    const characterPacket = await characterDelivery; await dispatch('character_updated', characterPacket);
    const refreshedPC = await view('bounds-pc'); assert.deepEqual(refreshedPC.character.health, { current: 40, max: 100 }); assert.equal(refreshedPC.character.level, 5); assert.equal(refreshedPC.character.tempHealth, 6);
    const characterProduced = outbound.find(value => value.event === 'character_updated' && value.payload.character?.health?.max === 100); assert(characterProduced); assert.deepEqual(characterProduced.payload.character.health, { max: 100 }); assert.equal(characterProduced.payload.character.tempHealth, undefined);
    evidence.observations.characterProducer = { characterProduced, characterPacket, refreshedPC };
    const beforeDelta = process.env.ENABLE_TOKENS_DELTA; process.env.ENABLE_TOKENS_DELTA = 'true'; await page.evaluate(() => { __delta.current = true; });
    try {
      const deltaDelivery = new Promise(resolve => client.once('tokens_delta', resolve));
      assert.equal((await ack(client, 'token_updated', { roomId: room.id, tokenId: 'bounds-creature', updates: { state: { maxHp: 90 } } })).success, true);
      const delta = await deltaDelivery; await dispatch('tokens_delta', delta); assert.equal((await view('bounds-creature')).state.maxHp, 90);
      await dispatch('tokens_delta', { actorSnapshot: old }); assert.equal((await view('bounds-creature')).state.maxHp, 90);
      evidence.observations.realDelta = delta;
    } finally { if (beforeDelta === undefined) delete process.env.ENABLE_TOKENS_DELTA; else process.env.ENABLE_TOKENS_DELTA = beforeDelta; }
    evidence.accessibilitySnapshot = await page.locator('body').ariaSnapshot(); evidence.pageErrors = errors; assert.deepEqual(errors, []);
    evidence.serverHashes = serverHashes;
    evidence.sourceDrift = [...Object.entries(serverHashes).filter(([file, hash]) => sha(fs.readFileSync(path.join(root, file))) !== hash).map(([file]) => file),
      ...Object.entries(built.manifest).filter(([file, hash]) => sha(fs.readFileSync(path.join(root, 'vtt-react/src', file))) !== hash).map(([file]) => 'vtt-react/src/' + file)];
    assert.deepEqual(evidence.sourceDrift, []); fs.writeFileSync(path.join(out, 'browser.json'), JSON.stringify(evidence, null, 2), { flag: 'wx' });
    console.log(JSON.stringify({ output: path.join(out, 'browser.json'), pageErrors: errors, observations: Object.keys(evidence.observations) }));
  } finally { await browser.close(); await new Promise(resolve => http.close(resolve)); client.disconnect(); await backend.stop(); }
}
main().then(() => process.exit(0), error => { console.error(error); process.exit(1); });
