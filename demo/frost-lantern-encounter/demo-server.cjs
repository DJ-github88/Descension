// Disposable demo room host for "The Sunken Shrine Skirmish" (DEMO CONTENT).
// Fixtures: Identity/provider verification, canonical ownership, room lease, and cloud persistence
// are in-memory productionStackServer fixtures on 127.0.0.1 (not real persistent-room support).
require('../../vtt-react/verification/p7/preload.cjs');
const fs = require('fs');
const path = require('path');
const http = require('http');
const assert = require('assert/strict');

const root = path.resolve(__dirname, '../..');
const { createProductionStackServer } = require(path.join(root, 'server/tests/helpers/productionStackServer'));
const actors = require(path.join(root, 'server/services/actorConsequences'));
const scenario = JSON.parse(fs.readFileSync(path.join(__dirname, 'scenario-records.json'), 'utf8'));

const clone = value => JSON.parse(JSON.stringify(value));
const ack = (socket, event, payload) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(Error(`ACK timeout ${event}`)), 10000);
  socket.emit(event, payload, result => { clearTimeout(timer); resolve(result); });
});

async function start(options = {}) {
  const characterOwners = {};
  for (const pc of scenario.characters) {
    characterOwners[pc.characterId] = pc.ownerUid;
  }
  const backend = createProductionStackServer({ characterOwners });
  await backend.start();

  const uids = ['demo-gm', ...scenario.characters.map(c => c.ownerUid)];
  for (const uid of uids) backend.registerAuthToken(uid, uid);

  const seed = backend.connect({ token: 'demo-gm' });
  await new Promise(resolve => seed.once('connect', resolve));
  const room = await backend.seedRoom(seed.id, { gmUserId: 'demo-gm' });

  const mapId = scenario.room.mapId;
  const creaturesData = JSON.parse(fs.readFileSync(path.join(root, 'vtt-react/public/data/creatures.json')));
  room.gameState.maps[mapId] = {
    ...clone(room.gameState.maps.default),
    id: mapId,
    name: scenario.room.mapName,
    tokens: {},
    creatures: {},
    characterTokens: {}
  };
  room.gameState.defaultMapId = mapId;
  const map = room.gameState.maps[mapId];

  for (const c of scenario.creatures) {
    const base = creaturesData.find(entry => entry.id === c.creatureId);
    assert.ok(base, `Creature template ${c.creatureId} not found`);
    map.tokens[c.tokenId] = {
      id: c.tokenId,
      creatureId: c.creatureId,
      name: c.name,
      mapId,
      stats: { ...clone(base.stats), maxHp: c.health.max },
      position: clone(c.position),
      state: {
        customName: c.name,
        currentHp: c.health.current,
        tempHealth: 0,
        currentMana: 0,
        tempMana: 0,
        currentActionPoints: 2,
        tempActionPoints: 0,
        maxHp: c.health.max,
        maxMana: 30,
        maxAP: 5,
        conditions: []
      }
    };
  }

  for (const pc of scenario.characters) {
    map.characterTokens[pc.tokenId] = {
      id: pc.tokenId,
      mapId,
      ownerUserId: pc.ownerUid,
      position: clone(pc.position),
      character: {
        id: pc.characterId,
        name: pc.name,
        class: pc.class,
        level: pc.level,
        skillRanks: clone(pc.skillRanks || {}),
        stats: clone(pc.stats),
        health: clone(pc.health),
        mana: clone(pc.mana),
        actionPoints: clone(pc.actionPoints),
        tempHealth: 0,
        tempMana: 0,
        tempActionPoints: 0,
        classResource: { type: 'elementalSpheres', spheres: ['arcane', 'arcane', 'ember'], current: 3, max: 12 }
      },
      state: { conditions: [] }
    };
  }

  const refs = {};
  for (const c of scenario.creatures) {
    const token = map.tokens[c.tokenId];
    const result = await ack(seed, 'actor_bind', {
      roomId: room.id,
      ref: { kind: 'creature', roomId: room.id, mapId, tokenId: c.tokenId },
      snapshotHash: actors.hash(token)
    });
    assert.equal(result.success, true, JSON.stringify(result));
    refs[c.tokenId] = result.ref;
    await new Promise(r => setTimeout(r, 300));
  }
  for (const pc of scenario.characters) {
    await new Promise(r => setTimeout(r, 300));
    const token = map.characterTokens[pc.tokenId];
    const result = await ack(seed, 'actor_bind', {
      roomId: room.id,
      ref: { kind: 'character', roomId: room.id, mapId, tokenId: pc.tokenId, ownerUid: pc.ownerUid, characterId: pc.characterId },
      snapshotHash: actors.hash(token)
    });
    assert.equal(result.success, true, JSON.stringify(result));
    refs[pc.tokenId] = result.ref;
  }

  // Seed PC-to-PC relationship (pc <-> pc2 = ally) because no rendered PC-to-PC relationship UI exists;
  // creature-to-PC relationships (A, B, C <-> pc, pc2) are left unset by default for the GM to set
  // via the rendered Recruit Companion… dialog.
  const seedCreatureRels = options.seedCreatureRelationships === true || process.env.DEMO_SEED_CREATURE_RELATIONSHIPS === '1';
  const relList = await ack(seed, 'actor_relationship_list', { roomId: room.id, a: refs.pc, b: refs.pc2 });
  let relRev = relList?.revision ?? 0;
  const snap = await ack(seed, 'actor_snapshot', { roomId: room.id });
  for (const rel of scenario.relationships) {
    const isPcPair = scenario.characters.some(c => c.tokenId === rel.a) && scenario.characters.some(c => c.tokenId === rel.b);
    if (!isPcPair && !seedCreatureRels) continue;
    const result = await ack(seed, 'actor_relationship_set', {
      version: 1,
      roomId: room.id,
      commandId: require('crypto').randomUUID(),
      actionEpoch: snap.actionEpoch,
      baseCommitSequence: snap.commitSequence ?? 0,
      expectedRelationshipRevision: relRev,
      pairs: [{ a: refs[rel.a], b: refs[rel.b] }],
      value: rel.relationship
    });
    assert.equal(result.success, true, `relationship ${rel.a}<->${rel.b}: ${JSON.stringify(result)}`);
    relRev = result.relationshipRevision ?? (relRev + 1);
  }

  const buildEnv = options.buildDir || process.env.APP_BUILD_DIR;
  assert.ok(buildEnv && path.isAbsolute(buildEnv), 'APP_BUILD_DIR must be absolute');
  const build = path.resolve(buildEnv);
  const mime = {
    '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
    '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2'
  };
  const server = http.createServer((req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/integration-fixture.json') {
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify({ backendUrl: backend.url(), roomId: room.id, mapId, refs, scenario: scenario.label }));
    }
    if (url.pathname === '/integration-io.js') {
      res.setHeader('Content-Type', 'text/javascript');
      return res.end(fs.readFileSync(path.join(root, 'vtt-react/node_modules/socket.io-client/dist/socket.io.js')));
    }
    if (url.pathname === '/integration-state.json') {
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(room.gameState));
    }
    let file = path.resolve(build, '.' + decodeURIComponent(url.pathname));
    if (!file.startsWith(build + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
      file = path.join(build, 'index.html');
    }
    res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream');
    fs.createReadStream(file).pipe(res);
  });

  const port = Number(options.port || process.env.DEMO_APP_PORT || 4196);
  await new Promise(resolve => server.listen(port, '127.0.0.1', resolve));
  const actualPort = server.address().port;

  return {
    backend, server, room, refs, seed, url: `http://127.0.0.1:${actualPort}`,
    setPlayerCharacter(uid, character) {
      for (const player of (backend.players?.values?.() || [])) {
        if (player.userId === uid) player.character = { ...(player.character || {}), ...character };
      }
      for (const player of (room.players?.values?.() || [])) {
        if (player.userId === uid) player.character = { ...(player.character || {}), ...character };
      }
    },
    stop: async () => {
      seed.disconnect();
      if (server.closeAllConnections) server.closeAllConnections();
      await new Promise(resolve => server.close(resolve));
      await backend.stop();
    }
  };
}

exports.start = start;
if (require.main === module) {
  start().then(host => console.log(`Demo room ready at ${host.url}`), error => { console.error(error); process.exit(1); });
}
