/** Permanent B5 production regression. RED executes hash-verified reviewer
 * before-source bytes; GREEN executes current bytes. External boundaries are
 * inherited fixtures, production actor decisions and mounted controls are real. */
require('./preload.cjs');
const fs = require('fs'), path = require('path'), vm = require('vm'), crypto = require('crypto'), zlib = require('zlib'), assert = require('assert/strict'), Module = require('module');
const root = path.resolve(__dirname, '../../..');
const out = process.env.P7_LIFECYCLE_OUT || 'D:/AppData/Temp/opencode/p7-final-20261013/lifecycle';
const red = process.argv.includes('--red');
const sha = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const deps = Module.createRequire(path.join(root, 'vtt-react/package.json'));
const review = 'D:/AppData/Temp/opencode/p7-final-20261013/root-review';
const beforePath = path.join(review, 'resume-20261014/source-before.json.gz');
const before = JSON.parse(zlib.gunzipSync(fs.readFileSync(beforePath)));
const overlay = new Map();
for (const [relative, base64] of Object.entries(before.files)) {
  const full = path.resolve(root, relative), bytes = Buffer.from(base64, 'base64');
  assert.equal(sha(bytes), before.hashes[full.replace(/\\/g, '/')] || before.hashes['D:/VTT/' + relative], relative);
  if (red) overlay.set(full.toLowerCase(), bytes);
}
const read = fs.readFileSync.bind(fs);
if (red) fs.readFileSync = (file, options) => {
  const bytes = typeof file === 'string' && overlay.get(path.resolve(file).toLowerCase());
  return bytes ? (typeof options === 'string' ? bytes.toString(options) : options?.encoding ? bytes.toString(options.encoding) : Buffer.from(bytes)) : read(file, options);
};
const load = Module._extensions['.js'];
const loadedServerHashes = {};
Module._extensions['.js'] = (module, filename) => {
  if (filename.toLowerCase().startsWith(path.join(root, 'server').toLowerCase()) && !filename.includes('node_modules')) {
    const bytes = fs.readFileSync(filename); loadedServerHashes[path.relative(root, filename).replace(/\\/g, '/')] = sha(bytes);
    module._compile(bytes.toString('utf8'), filename);
  } else load(module, filename);
};
const { createProductionStackServer } = require(path.join(root, 'server/tests/helpers/productionStackServer'));
const actors = require(path.join(root, 'server/services/actorConsequences'));
const copy = value => JSON.parse(JSON.stringify(value));
const ack = (client, event, payload) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(Error('ACK timeout ' + event)), 5000);
  client.emit(event, payload, result => { clearTimeout(timer); resolve(result); });
});
async function main() {
  const evidence = { mode: red ? 'RED defect assertions' : 'GREEN correction assertions; implementer verification only',
    command: [process.execPath, ...process.argv.slice(1)], cwd: process.cwd(), startedAt: new Date().toISOString(),
    beforeSource: { path: beforePath, sha256: sha(read(beforePath)), hashes: before.hashes },
    head: require('child_process').execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim(),
    simulations: ['Firebase provider identity/canonical ownership and lease backend fixtures', 'temporary live-only room with no-op cloud/realtime writes',
      'inherited P6 browser SDK/config/router/storage/inert library fixtures', 'real Socket.IO registration; HTTP outbound and explicit browser subscribed delivery',
      'mounted ActorConsequenceControls; no full-App/deployed/restart durability claim'], observations: {}, controls: {} };
  const backend = createProductionStackServer(); await backend.start(); backend.registerAuthToken('b5-lifecycle', 'u-a');
  let client = backend.connect({ token: 'b5-lifecycle' }); await new Promise(resolve => client.once('connect', resolve));
  const room = await backend.seedRoom(client.id, { gmUserId: 'u-a' });
  const bridge = (req, res) => {
    if (req.url !== '/event' || req.method !== 'POST') return false;
    let bytes = ''; req.on('data', value => { bytes += value; }); req.on('end', async() => {
      const { event, payload } = JSON.parse(bytes); res.setHeader('Content-Type', 'application/json');
      if (['actor_snapshot', 'actor_bind', 'actor_consequence', 'actor_adjudicate', 'actor_propose'].includes(event)) res.end(JSON.stringify(await ack(client, event, payload)));
      else { client.emit(event, payload); res.end(JSON.stringify({ success: true, transportOnly: true })); }
    }); return true;
  };
  let builder = fs.readFileSync(path.join(root, 'vtt-react/verification/p6/character-save-browser.cjs'), 'utf8').split('async function main()')[0];
  builder = builder.replace("canonical: 'services/firebase/characterPersistenceService.js'", "canonical: 'services/firebase/characterPersistenceService.js', actors:'services/actorConsequenceService.js', game:'store/gameStore.js', hydration:'services/silentRoomHydration.js', creatures:'store/creatureStore.js', tokens:'store/characterTokenStore.js', map:'store/mapStore.js', tokenHandlers:'components/multiplayer/socketHandlers/tokenHandlers.js', audioHandlers:'components/multiplayer/socketHandlers/audioGameSessionHandlers.js', controls:'components/hud/ActorConsequenceControls.jsx', condition:'store/conditionStore.js', gmHandlers:'components/multiplayer/socketHandlers/gmHandlers.js', join:'components/multiplayer/roomJoinHandler.js'");
  builder = builder.replace('if (assets[req.url])', 'if (handleBridge(req,res)) return; if (assets[req.url])');
  builder = builder.replace("if (file.endsWith('.json'))", "if (/\\.(png|jpg|jpeg|webp|svg)$/.test(file)) { modules[file].code='module.exports='+JSON.stringify('data:image/png;base64,'+fs.readFileSync(file).toString('base64'))+';'; return file; } if (file.endsWith('.json'))");
  builder += '\nmodule.exports=start;';
  const sandbox = { require, __dirname: path.join(root, 'vtt-react/verification/p6'), module: { exports: {} }, console, Buffer, process, handleBridge: bridge };
  vm.runInNewContext(builder, sandbox, { filename: 'lifecycle-fixture-builder.cjs' });
  // Freeze raw compiler reads, not decision branches. Manifest hashes therefore
  // identify the exact bytes compiled even if another implementer edits later.
  const originalRead = fs.readFileSync, compilerBytes = new Map(), sourceRoot = path.join(root, 'vtt-react/src').toLowerCase();
  fs.readFileSync = (file, options) => {
    if (typeof file !== 'string' || !path.resolve(file).toLowerCase().startsWith(sourceRoot)) return originalRead(file, options);
    const key = path.resolve(file).toLowerCase(); if (!compilerBytes.has(key)) compilerBytes.set(key, originalRead(file));
    const bytes = compilerBytes.get(key); return typeof options === 'string' ? bytes.toString(options) : options?.encoding ? bytes.toString(options.encoding) : Buffer.from(bytes);
  };
  let built; try { built = sandbox.module.exports(); } finally { fs.readFileSync = originalRead; }
  const { server, manifest } = built; evidence.manifest = manifest;
  for (const [file, hash] of Object.entries(manifest)) assert.equal(sha(fs.readFileSync(path.join(root, 'vtt-react/src', file))), hash, file);
  evidence.productionHashes = loadedServerHashes;
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  const browser = await deps('playwright').chromium.launch({ channel: 'chrome', headless: true });
  try {
    const page = await browser.newPage(), errors = []; page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:' + server.address().port);
    await page.evaluate(async({ roomId, socketId }) => {
      m('init').initStoreRegistry(); window.__liveUser = { uid: 'u-a', getIdToken: async() => 'fixture' };
      m('auth').default.getState().setUser(__liveUser); await m('coordinator').whenHandoffIdle();
      window.__listeners = {}; window.__socket = { id: socketId, connected: true,
        emit: (event, payload, callback) => fetch('/event', { method: 'POST', body: JSON.stringify({ event, payload }) }).then(r => r.json()).then(value => callback?.(value)),
        on: (event, fn) => (__listeners[event] ||= new Set()).add(fn), off: (event, fn) => __listeners[event]?.delete(fn) };
      window.__dispatch = (event, payload) => { for (const fn of __listeners[event] || []) fn(payload); };
      m('game').default.setState({ isInMultiplayer: true, isGMMode: true, multiplayerRoom: { id: roomId }, multiplayerSocket: __socket });
      m('actors').registerActorHandlers({ socket: __socket });
      window.__deltaRef = { current: false };
      m('tokenHandlers').registerTokenHandlers({ socket: __socket, removeToken: (id, send) => m('creatures').default.getState().removeToken(id, send), isGMRef: { current: true }, useDeltaSyncTokensRef: __deltaRef });
      m('audioHandlers').registerAudioGameSessionHandlers({ socket: __socket, isGMRef: { current: true }, currentPlayerRef: { current: {} }, addCreature: () => {}, updatePartyMember: () => {} });
      window.__root = ReactDOM.createRoot(document.getElementById('app')); ReactDOM.flushSync(() => __root.render(React.createElement(m('controls').default)));
    }, { roomId: room.id, socketId: client.id });
    const projectedRoom = require(path.join(root, 'server/services/roomAccessService')).buildRoomProjection(room);
    await page.evaluate(async room => {
      const player = room.gm, callbacks = { socket: __socket, currentPlayerRef: { current: player }, addNotificationRef: { current: () => {} },
        roomPasswordRef: { current: '' }, getActiveCharacter: () => null, loadActiveCharacter: async() => null,
        clearAllMultiplayerStores: () => {}, setCurrentRoom: () => {} };
      const ctx = new Proxy(callbacks, { get: (target, key) => key in target ? target[key] : () => {} });
      await m('join').handleJoinRoom(room, __socket, true, player, '', undefined, undefined, true, ctx);
      m('gmHandlers').registerGmHandlers({ socket: __socket, currentPlayerRef: { current: player }, isInitialMapLoadRef: { current: true },
        setPlayerCurrentMapId: () => {}, showMapTransitions: false });
    }, projectedRoom);
    evidence.controls.mountedProductionJoin = { mapId: await page.evaluate(() => m('map').default.getState().currentMapId), roomId: await page.evaluate(() => m('game').default.getState().multiplayerRoom.id) };
    assert.equal(evidence.controls.mountedProductionJoin.roomId, room.id);
    const snapshot = async() => { await page.waitForTimeout(350); const value = await ack(client, 'actor_snapshot', { roomId: room.id }); assert.equal(value.success, true, JSON.stringify(value)); return value; };
    const view = id => page.evaluate(id => ({ token: m('actors').findActor(id), owner: m('actors').roomResourceProjection(), sheet: m('character').default.getState().roomActorProjection }), id);
    const dispatch = (event, payload) => page.evaluate(({ event, payload }) => __dispatch(event, payload), { event, payload });
    const hydrate = (s, scope = 'room', mapId = 'default', correlated = false) => page.evaluate(({ s, scope, mapId, correlated }) => {
      let rng = 0, emits = 0; const random = Math.random, emit = __socket.emit;
      Math.random = () => { rng++; return random(); }; __socket.emit = () => { emits++; };
      let result; try { result = m('hydration').applyRoomSnapshot({ scope, roomId: s.roomId, actorProjection: s.actorProjection, correlated, mapId, activeMapId: mapId,
        ...(scope === 'room' ? { gameState: { maps: s.maps, actorProjection: s.actorProjection, defaultMapId: mapId } } : scope === 'map' ? { mapData: s.maps[mapId] } : { sections: { ...s.maps[mapId] } }) });
      } finally { Math.random = random; __socket.emit = emit; }
      return { result, rng, emits, tokens: m('creatures').default.getState().creatureTokens, characters: m('tokens').default.getState().characterTokens, recovery: m('game').default.getState().actorRecoverySnapshot };
    }, { s, scope, mapId, correlated });
    const create = (id, hp) => ack(client, 'token_created', { roomId: room.id, mapId: 'default', token: { id, state: { currentHp: hp, currentMana: 20, currentActionPoints: 3, conditions: [] } }, creature: { stats: { maxHp: 50, maxMana: 30, maxAP: 5 } }, position: { x: 0, y: 0 } });
    const bind = (id, kind = 'creature', mapId = 'default', extra = {}) => {
      const token = room.gameState.maps[mapId][kind === 'character' ? 'characterTokens' : 'tokens'][id];
      return ack(client, 'actor_bind', { roomId: room.id, ref: { kind, roomId: room.id, mapId, tokenId: id, ...(kind === 'character' ? { ownerUid: token.ownerUserId, characterId: token.character.id } : {}) }, snapshotHash: actors.hash(token), ...extra });
    };
    const id = 'lifecycle'; assert.equal((await hydrate(await snapshot(), 'room', 'default', true)).result.applied, true);
    assert.equal((await create(id, 40)).success, true); assert.equal((await hydrate(await snapshot())).result.applied, true);
    await page.getByRole('combobox', { name: 'Exact room attachment' }).selectOption('creature:' + id);
    await page.getByRole('button', { name: 'Bind primary attachment' }).click();
    await page.waitForFunction(id => !!m('actors').refOf(m('actors').findActor(id)), id);
    const oldBinding = actors.refFor(room.gameState.maps.default.tokens[id].state.actorContract);
    let s = await snapshot(); const accepted = await ack(client, 'actor_consequence', { version: 1, roomId: room.id, commandId: crypto.randomUUID(), actionEpoch: s.actionEpoch, baseCommitSequence: s.commitSequence,
      actors: [{ ref: oldBinding, expectedRevision: 0, finalResources: { hp: { current: 28, temp: 0 } } }] });
    assert.equal(accepted.success, true); await dispatch('actor_consequence_accepted', accepted); const old = await snapshot(); await hydrate(old);
    const removed = new Promise(resolve => client.once('token_removed', resolve)); client.emit('token_removed', { roomId: room.id, mapId: 'default', tokenId: id }); const removal = await removed;
    await dispatch('token_removed', removal); assert.equal((await view(id)).token, null); const deleted = await snapshot(); await hydrate(deleted);
    evidence.observations.afterDeletion = await hydrate(old); assert.equal(evidence.observations.afterDeletion.result.applied, red);
    assert.equal((await view(id)).token?.state.currentHp ?? null, red ? 28 : null); await hydrate(deleted);
    await create(id, 7); const unbound = await snapshot(); assert.equal((await hydrate(unbound)).result.applied, true);
    if (!red) { evidence.observations.afterUnbound = await hydrate(old); assert.equal(evidence.observations.afterUnbound.result.applied, false); assert.equal((await view(id)).token.state.currentHp, 7); }
    const replacement = await bind(id); assert.equal(replacement.success, true); assert.notEqual(replacement.ref.instanceId, oldBinding.instanceId); await dispatch('actor_bound', replacement);
    let latest = await snapshot(); await hydrate(latest);
    evidence.ordering = Object.fromEntries(Object.entries({ old, deleted, recreated: latest }).map(([name, value]) => [name,
      { actorProjection: value.actorProjection, actionEpoch: value.actionEpoch, commitSequence: value.commitSequence }]));
    assert.equal(old.commitSequence, deleted.commitSequence); assert.equal(deleted.commitSequence, latest.commitSequence);
    for (const scope of ['room', 'map', 'section']) {
      const observed = await hydrate(old, scope); evidence.observations['afterReplacement-' + scope] = observed; assert.equal(observed.result.applied, red);
      assert.equal((await view(id)).token.state.currentHp, red ? 28 : 7); await hydrate(latest);
    }
    evidence.observations.staleAbsence = await hydrate(deleted); assert.equal(evidence.observations.staleAbsence.result.applied, red); assert.equal(!!(await view(id)).token, !red); await hydrate(latest);
    const conflict = copy(latest); conflict.maps.default.tokens[id].state.currentHp = 6;
    const rejected = await hydrate(conflict); assert.equal(rejected.result.applied, false);
    const recovered = await page.evaluate(() => m('actors').acceptRecoveredActorSnapshot()); assert.equal(recovered.success, red); assert.equal((await view(id)).token.state.currentHp, red ? 6 : 7);
    evidence.observations.conflictRecovery = { rejected, recovered }; await hydrate(latest);
    evidence.controls.initialUnboundDeletionRecreationBind = true;
    if (!red) {
      await dispatch('actor_bound', { ...replacement, actorSnapshot: old }); assert.equal((await view(id)).token.state.currentHp, 7);
      await dispatch('token_removed', removal); assert.equal((await view(id)).token.state.currentHp, 7);
      const revisionResult = await ack(client, 'actor_consequence', { version: 1, roomId: room.id, commandId: crypto.randomUUID(), actionEpoch: latest.actionEpoch,
        baseCommitSequence: latest.commitSequence, actors: [{ ref: replacement.ref, expectedRevision: 0, finalResources: { hp: { current: 7, temp: 0 } } }] });
      assert.equal(revisionResult.success, true); await dispatch('actor_consequence_accepted', revisionResult);
      await create('revision-control', 7); const forward = await snapshot();
      const lower = copy(forward); lower.maps.default.tokens[id].state.actorContract.revision = 0;
      evidence.controls.lowerRevisionAtNewerRealCut = await hydrate(lower); assert.equal(evidence.controls.lowerRevisionAtNewerRealCut.result.reason, 'actor_projection_stale');
      assert.equal((await view('revision-control')).token, null);
      const missing = copy(forward); delete missing.maps.default.tokens[id].state.actorContract;
      evidence.controls.metadataLossAtNewerRealCut = await hydrate(missing); assert.equal(evidence.controls.metadataLossAtNewerRealCut.result.reason, 'actor_binding_metadata_missing');
      assert.equal((await view(id)).token.state.currentHp, 7); assert.equal((await view('revision-control')).token, null);
      latest = forward; assert.equal((await hydrate(latest)).result.applied, true);
      await dispatch('full_game_state_sync', { roomId: room.id, mapId: 'default', actorProjection: old.actorProjection, mapData: old.maps.default }); assert.equal((await view(id)).token.state.currentHp, 7);
      await dispatch('full_game_state_sync', { roomId: room.id, mapId: 'default', actorProjection: old.actorProjection, tokens: old.maps.default.tokens }); assert.equal((await view(id)).token.state.currentHp, 7);
      assert.equal((await hydrate(latest)).result.applied, true);
      evidence.controls.delayedBindRemovalAndMountedMapSection = true;
      evidence.controls.omittedCollection = await page.evaluate(() => m('hydration').applyRoomSnapshot({ scope: 'section', sections: { mapData: { terrainData: {} } } }));
      assert.equal((await view(id)).token.state.currentHp, 7);
      // Real PCs on a nondefault map: create, explicit primary invalidation,
      // owner attachment and removal all share the same projection cut.
      room.gameState.maps.other = { id: 'other', tokens: {}, creatures: {}, characterTokens: {}, gridItems: {} };
      backend.setCharacterOwner('c-a', 'u-a');
      const character = { id: 'c-a', name: 'Lifecycle owner', health: { current: 30, max: 50 }, mana: { current: 20, max: 50 }, actionPoints: { current: 2, max: 3 }, tempHealth: 0, tempMana: 0, tempActionPoints: 0 };
      for (const pc of ['pc-first', 'pc-second']) {
        const emitted = new Promise(resolve => client.once('character_token_created', resolve)); client.emit('character_token_created', { roomId: room.id, mapId: 'other', token: { id: pc, character, state: { conditions: [] } } }); await dispatch('character_token_created', await emitted);
      }
      const changed = new Promise(resolve => client.once('gm_view_changed', resolve)); client.emit('gm_switch_view', { roomId: room.id, newMapId: 'other' });
      await dispatch('gm_view_changed', await changed); assert.equal(await page.evaluate(() => m('map').default.getState().currentMapId), 'other');
      const first = await bind('pc-first', 'character', 'other'); assert.equal(first.success, true); await dispatch('actor_bound', first);
      await page.evaluate(ref => { m('map').default.setState({ currentMapId: 'other' }); m('character').default.setState({ currentCharacterId: 'c-a' }); m('actors').selectOwnerAttachment(ref); }, first.ref);
      const second = await bind('pc-second', 'character', 'other', { replacePrimaryRef: first.ref }); assert.equal(second.success, true); await dispatch('actor_bound', second);
      assert.equal((await view('pc-first')).token.state.actorContract.primary, false); assert.equal((await view('pc-first')).owner, null);
      const beforePCRemoval = await snapshot(); await page.getByRole('combobox', { name: 'Exact room attachment' }).selectOption('character:pc-second'); await page.getByRole('button', { name: 'Use this owner attachment' }).click();
      assert.equal((await view('pc-second')).owner.health.current, 30);
      const pcRemoved = new Promise(resolve => client.once('character_token_removed', resolve)); client.emit('character_token_removed', { roomId: room.id, mapId: 'other', tokenId: 'pc-second' }); await dispatch('character_token_removed', await pcRemoved);
      assert.equal((await view('pc-second')).token, null); assert.equal((await view('pc-second')).owner, null);
      assert.equal((await hydrate(beforePCRemoval)).result.applied, false); assert.equal((await view('pc-second')).token, null);
      evidence.controls.pcPrimaryInvalidationNondefaultRemoval = { first, second };
      const recoveryAfterNewer = await page.evaluate(async() => ({ result: await m('actors').acceptRecoveredActorSnapshot(),
        candidates: m('game').default.getState().actorProjectionRecoveryCandidates }));
      assert(recoveryAfterNewer.candidates.some(candidate => candidate.result.maps?.default?.tokens?.lifecycle?.state?.currentHp === 6));
      assert.equal((await page.evaluate(() => m('actors').acceptRecoveredActorSnapshot())).success, false);
      evidence.controls.retainedConflictAfterNewerLifecycle = recoveryAfterNewer.candidates;
      const priorDelta = process.env.ENABLE_TOKENS_DELTA; process.env.ENABLE_TOKENS_DELTA = 'true';
      await page.evaluate(() => { __deltaRef.current = true; });
      try {
        const createdDelta = new Promise(resolve => client.once('tokens_delta', resolve)); await create('delta-lifecycle', 9);
        const delta = await createdDelta; await dispatch('tokens_delta', delta); assert.equal((await view('delta-lifecycle')).token.state.currentHp, 9);
        const deletedDelta = new Promise(resolve => client.once('tokens_delta', resolve)); client.emit('token_removed', { roomId: room.id, mapId: 'default', tokenId: 'delta-lifecycle' });
        const removedDelta = await deletedDelta; await dispatch('tokens_delta', removedDelta); assert.equal((await view('delta-lifecycle')).token, null);
        await dispatch('tokens_delta', delta); assert.equal((await view('delta-lifecycle')).token, null);
        await page.waitForTimeout(150);
        evidence.controls.realDebouncedCollectionDelivery = { created: delta.actorSnapshot.actorProjection, removed: removedDelta.actorSnapshot.actorProjection,
          staleCreationRefused: true, transport: 'real tokens_delta; flag toggled in fixture' };
      } finally {
        if (priorDelta === undefined) delete process.env.ENABLE_TOKENS_DELTA; else process.env.ENABLE_TOKENS_DELTA = priorDelta;
        await page.evaluate(() => { __deltaRef.current = false; });
      }
      // Same-epoch reconnect keeps fences; a fresh current correlated read works.
      const now = await snapshot();
      const priorClient = client, reconnected = backend.connect({ token: 'b5-lifecycle' }); await new Promise(resolve => reconnected.once('connect', resolve));
      const rejoined = new Promise(resolve => reconnected.once('room_joined', resolve)); reconnected.emit('join_room', { roomId: room.id, playerName: 'Lifecycle GM', password: '' }); const joined = await rejoined;
      assert.equal(joined.room.gameState.actorProjection.epoch, now.actorProjection.epoch); client = reconnected; priorClient.disconnect();
      await page.evaluate(async({ socketId, room }) => { const old = __socket; window.__socket = { ...old, id: socketId }; m('game').default.setState({ multiplayerSocket: __socket, multiplayerRoom: room });
        m('actors').registerActorHandlers({ socket: __socket }); const result = await m('actors').refreshActorSnapshot(); if (!result.success) throw Error(JSON.stringify(result));
      }, { socketId: client.id, room: joined.room });
      assert.equal((await hydrate(old)).result.applied, false); assert.equal((await hydrate(now)).result.applied, true);
      // Hold an actual production request ACK across a room/principal/socket cut.
      evidence.controls.delayedRefresh = await page.evaluate(async snapshot => {
        const prior = __socket.emit; let callback; __socket.emit = (_event, _payload, cb) => { callback = cb; };
        const pending = m('actors').refreshActorSnapshot(); const room = m('game').default.getState().multiplayerRoom;
        m('game').default.setState({ multiplayerRoom: { id: 'different-room' } }); callback(snapshot); const result = await pending;
        m('game').default.setState({ multiplayerRoom: room }); __socket.emit = prior; return result;
      }, now); assert.equal(evidence.controls.delayedRefresh.success, false);
      evidence.controls.delayedSocketRefresh = await page.evaluate(async snapshot => {
        const socket = __socket, prior = socket.emit; let callback; socket.emit = (_event, _payload, cb) => { callback = cb; };
        const pending = m('actors').refreshActorSnapshot(); m('game').default.setState({ multiplayerSocket: { ...socket } }); callback(snapshot);
        const result = await pending; m('game').default.setState({ multiplayerSocket: socket }); socket.emit = prior; return result;
      }, now); assert.equal(evidence.controls.delayedSocketRefresh.success, false);
      const bClient = backend.connect({ token: 'b5-lifecycle' }); await new Promise(resolve => bClient.once('connect', resolve)); const bRoom = await backend.seedRoom(bClient.id, { gmUserId: 'u-a' }); const b = await ack(bClient, 'actor_snapshot', { roomId: bRoom.id });
      await page.evaluate(id => m('game').default.setState({ multiplayerRoom: { id } }), bRoom.id); assert.equal((await hydrate(b, 'room', 'default', true)).result.applied, true); assert.equal((await hydrate(now, 'room', 'default', true)).result.applied, false);
      await page.evaluate(id => m('game').default.setState({ multiplayerRoom: { id } }), room.id); assert.equal((await hydrate(now, 'room', 'default', true)).result.applied, true); bClient.disconnect();
      evidence.controls.roomChangeAndRevisit = true;
      evidence.controls.delayedPrincipalRefresh = await page.evaluate(async snapshot => {
        const socket = __socket, emit = socket.emit; let callback; socket.emit = (_event, _payload, cb) => { callback = cb; };
        const pending = m('actors').refreshActorSnapshot(); m('auth').default.getState().setUser({ uid: 'other-owner', getIdToken: async() => 'fixture' });
        await m('coordinator').whenHandoffIdle(); callback(snapshot); const result = await pending;
        m('auth').default.getState().setUser(__liveUser); await m('coordinator').whenHandoffIdle(); socket.emit = emit;
        m('game').default.setState({ isInMultiplayer: true, multiplayerRoom: { id: snapshot.roomId }, multiplayerSocket: socket });
        const baseline = await m('actors').refreshActorSnapshot(); return { result, baseline };
      }, now); assert.equal(evidence.controls.delayedPrincipalRefresh.result.success, false); assert.equal(evidence.controls.delayedPrincipalRefresh.baseline.success, true);
      // Simulated runtime identity replacement restores the last-confirmed-style
      // snapshot only through an explicit fresh correlated read. Not crash proof.
      const runtime = { ...room, gameState: copy(room.gameState) }; backend.rooms.set(room.id, runtime);
      const refresh = await page.evaluate(() => m('actors').refreshActorSnapshot()); assert.equal(refresh.success, false);
      await page.waitForTimeout(1100);
      const explicit = await page.evaluate(() => m('actors').acceptRecoveredActorSnapshot()); assert.equal(explicit.success, true, JSON.stringify({ refresh, explicit, recovery: await page.evaluate(() => m('game').default.getState().actorRecoverySnapshot) }));
      assert.equal((await hydrate(now, 'room', 'default', true)).result.applied, false);
      evidence.controls.explicitRuntimeReconciliation = { refresh, explicit };
    }
    for (const observed of Object.values(evidence.observations)) if (observed.rng !== undefined) { assert.equal(observed.rng, 0); assert.equal(observed.emits, 0); }
    evidence.accessibilitySnapshot = await page.locator('body').ariaSnapshot(); evidence.pageErrors = errors; assert.equal(errors.length, 0);
    evidence.sourceDrift = [...Object.entries(evidence.productionHashes).filter(([file, hash]) => sha(fs.readFileSync(path.join(root, file))) !== hash).map(([file]) => file),
      ...Object.entries(manifest).filter(([file, hash]) => sha(fs.readFileSync(path.join(root, 'vtt-react/src', file))) !== hash).map(([file]) => 'vtt-react/src/' + file)];
    assert.deepEqual(evidence.sourceDrift, []);
    evidence.finishedAt = new Date().toISOString(); fs.mkdirSync(out, { recursive: true });
    const destination = path.join(out, (red ? 'red' : 'green') + '-' + Date.now() + '.json'); fs.writeFileSync(destination, JSON.stringify(evidence, null, 2), { flag: 'wx' });
    console.log(JSON.stringify({ artifact: destination, mode: evidence.mode, observations: Object.keys(evidence.observations), controls: Object.keys(evidence.controls), pageErrors: errors }));
  } finally { await browser.close(); await new Promise(resolve => server.close(resolve)); client.disconnect(); await backend.stop(); }
}
main().then(() => process.exit(0), error => { console.error(error); process.exit(1); });
