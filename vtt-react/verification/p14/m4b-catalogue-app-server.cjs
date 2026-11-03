// M4B normal-App fixture: registered backend, untouched production build, two owner PCs.
require('../p7/preload.cjs');
const fs = require('fs'), path = require('path'), http = require('http'), assert = require('assert/strict');
const root = path.resolve(__dirname, '../../..');
const { createProductionStackServer } = require(path.join(root, 'server/tests/helpers/productionStackServer'));
const actors = require(path.join(root, 'server/services/actorConsequences'));
const clone = v => JSON.parse(JSON.stringify(v));
const ack = (s, e, p) => new Promise((resolve, reject) => { const t = setTimeout(() => reject(Error('ACK timeout ' + e)), 10000); s.emit(e, p, r => { clearTimeout(t); resolve(r); }); });
async function start() {
  const backend = createProductionStackServer({ characterOwners: { ilse: 'app-owner', ally: 'app-target' } }); await backend.start();
  for (const uid of ['app-gm', 'app-owner', 'app-target']) backend.registerAuthToken(uid, uid);
  const seed = backend.connect({ token: 'app-gm' }); await new Promise(r => seed.once('connect', r));
  const room = await backend.seedRoom(seed.id, { gmUserId: 'app-gm' }), mapId = 'app-hall';
  const creature = JSON.parse(fs.readFileSync(path.join(root, 'vtt-react/public/data/creatures.json'))).find(c => c.id === 'grimmstalk');
  room.gameState.maps[mapId] = { ...clone(room.gameState.maps.default), id: mapId, name: 'Integration Hall', tokens: {}, creatures: {}, characterTokens: {} };
  room.gameState.defaultMapId = mapId;
  const hall = room.gameState.maps[mapId];
  for (const [id, x] of [['A', 400], ['B', 500]]) hall.tokens[id] = { id, creatureId: 'grimmstalk', name: id, mapId, stats: clone(creature.stats), position: { x, y: 300 }, state: { customName: id, currentHp: 30, tempHealth: 4, currentMana: 0, tempMana: 0, currentActionPoints: 2, tempActionPoints: 0, maxHp: 250, maxMana: 30, maxAP: 5, conditions: [] } };
  hall.characterTokens.pc = { id: 'pc', mapId, ownerUserId: 'app-owner', position: { x: 600, y: 300 }, character: { id: 'ilse', name: 'Ilse', class: 'Martyr', level: 1,
    stats: { strength: 10, agility: 10, constitution: 10, intelligence: 10, spirit: 18, charisma: 10 }, health: { current: 20, max: 40 }, mana: { current: 10, max: 30 }, actionPoints: { current: 2, max: 5 }, tempHealth: 0, tempMana: 3, tempActionPoints: 1, classResource: { type: 'devotionGauge', current: 0, max: 6, damage: 0, earnedLevels: 0, spentLevels: 0, bonusLevels: 0 } }, state: { conditions: [] } };
  hall.characterTokens.ally = { id: 'ally', mapId, ownerUserId: 'app-target', position: { x: 700, y: 300 }, character: { id: 'ally', name: 'Ally', class: 'Arcanoneer', level: 3, stats: { strength: 10, agility: 10, constitution: 10, intelligence: 10, spirit: 10, charisma: 10 }, health: { current: 20, max: 30 }, mana: { current: 10, max: 30 }, actionPoints: { current: 2, max: 5 }, tempHealth: 3, tempMana: 0, tempActionPoints: 0 }, state: { conditions: [] } };
  const refs = {};
  for (const [kind, id] of [['creature', 'A'], ['creature', 'B'], ['character', 'pc'], ['character', 'ally']]) {
    const token = hall[kind === 'creature' ? 'tokens' : 'characterTokens'][id];
    const result = await ack(seed, 'actor_bind', { roomId: room.id, ref: { kind, roomId: room.id, mapId, tokenId: id, ...(kind === 'character' ? { ownerUid: id === 'pc' ? 'app-owner' : 'app-target', characterId: id === 'pc' ? 'ilse' : 'ally' } : {}) }, snapshotHash: actors.hash(token) });
    assert.equal(result.success, true, JSON.stringify(result)); refs[id] = result.ref;
  }
  const build = process.env.APP_BUILD_DIR;
  assert.ok(build && path.isAbsolute(build), 'APP_BUILD_DIR required');
  const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.ico': 'image/x-icon' };
  const server = http.createServer((req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/integration-fixture.json') { res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify({ backendUrl: backend.url(), roomId: room.id, mapId, refs })); }
    if (url.pathname === '/integration-io.js') { res.setHeader('Content-Type', 'text/javascript'); return res.end(fs.readFileSync(path.join(root, 'vtt-react/node_modules/socket.io-client/dist/socket.io.js'))); }
    let file = path.resolve(build, '.' + decodeURIComponent(url.pathname));
    if (!file.startsWith(build + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(build, 'index.html');
    res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream'); fs.createReadStream(file).pipe(res);
  });
  const port = Number(process.env.M4B_APP_PORT || 4180);
  await new Promise(r => server.listen(port, '127.0.0.1', r));
  return { backend, server, room, refs, seed, url: `http://127.0.0.1:${port}`, setPlayerCharacter: (uid, character) => { for (const player of (backend.players?.values?.() || [])) if (player.userId === uid) player.character = { ...(player.character || {}), ...character }; for (const player of (room.players?.values?.() || [])) if (player.userId === uid) player.character = { ...(player.character || {}), ...character }; }, stop: async() => { seed.disconnect(); await new Promise(r => server.close(r)); await backend.stop(); } };
}
exports.start = start;
if (require.main === module) start().then(({ url }) => console.log(url), e => { console.error(e); process.exit(1); });

