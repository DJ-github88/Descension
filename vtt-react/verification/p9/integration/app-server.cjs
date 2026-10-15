// Untouched production build, registered backend; provider/ownership/lease are fixtures.
require('../../p7/preload.cjs');
const fs = require('fs'), path = require('path'), http = require('http'), crypto = require('crypto'), assert = require('assert/strict');
const root = path.resolve(__dirname, '../../../..');
const { createProductionStackServer } = require(path.join(root, 'server/tests/helpers/productionStackServer'));
const actors = require(path.join(root, 'server/services/actorConsequences'));
const clone = v => JSON.parse(JSON.stringify(v));
const ack = (s, e, p) => new Promise((resolve, reject) => { const t = setTimeout(() => reject(Error('ACK timeout ' + e)), 10000); s.emit(e, p, r => { clearTimeout(t); resolve(r); }); });
async function start() {
  const backend = createProductionStackServer({ characterOwners: { ilse: 'app-owner' } }); await backend.start();
  for (const uid of ['app-gm', 'app-owner', 'app-observer']) backend.registerAuthToken(uid, uid);
  const seed = backend.connect({ token: 'app-gm' }); await new Promise(r => seed.once('connect', r));
  const room = await backend.seedRoom(seed.id, { gmUserId: 'app-gm' }), mapId = 'app-hall';
  const creature = JSON.parse(fs.readFileSync(path.join(root, 'vtt-react/public/data/creatures.json'))).find(c => c.id === 'grimmstalk');
  room.gameState.maps[mapId] = { ...clone(room.gameState.maps.default), id: mapId, name: 'Integration Hall', tokens: {}, creatures: {}, characterTokens: {} };
  room.gameState.defaultMapId = mapId;
  const hall = room.gameState.maps[mapId];
  for (const [id, x] of [['A', 400], ['B', 500]]) hall.tokens[id] = { id, creatureId: 'grimmstalk', name: id, mapId, stats: clone(creature.stats), position: { x, y: 300 }, state: { customName: id, currentHp: 30, tempHealth: 4, currentMana: 0, tempMana: 0, currentActionPoints: 2, tempActionPoints: 0, maxHp: 250, maxMana: 30, maxAP: 5, conditions: [] } };
  hall.characterTokens.pc = { id: 'pc', mapId, ownerUserId: 'app-owner', position: { x: 600, y: 300 }, character: { id: 'ilse', name: 'Ilse', class: 'Arcanoneer', level: 3, health: { current: 20, max: 40 }, mana: { current: 10, max: 30 }, actionPoints: { current: 2, max: 5 }, tempHealth: 0, tempMana: 3, tempActionPoints: 1 }, state: { conditions: [] } };
  const refs = {};
  for (const [kind, id] of [['creature', 'A'], ['creature', 'B'], ['character', 'pc']]) {
    const token = hall[kind === 'creature' ? 'tokens' : 'characterTokens'][id];
    const result = await ack(seed, 'actor_bind', { roomId: room.id, ref: { kind, roomId: room.id, mapId, tokenId: id, ...(kind === 'character' ? { ownerUid: 'app-owner', characterId: 'ilse' } : {}) }, snapshotHash: actors.hash(token) });
    assert.equal(result.success, true, JSON.stringify(result)); refs[id] = result.ref;
  }
  const build = path.join(__dirname, '../evidence/integration-20261015/sol/build-final/app');
  const mime = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2' };
  const server = http.createServer((req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/integration-fixture.json') { res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify({ backendUrl: backend.url(), roomId: room.id, mapId, refs })); }
    if (url.pathname === '/integration-io.js') { res.setHeader('Content-Type', 'text/javascript'); return res.end(fs.readFileSync(path.join(root, 'vtt-react/node_modules/socket.io-client/dist/socket.io.js'))); }
    if (url.pathname === '/integration-state.json') { res.setHeader('Content-Type', 'application/json'); return res.end(JSON.stringify(room.gameState)); }
    let file = path.resolve(build, '.' + decodeURIComponent(url.pathname));
    if (!file.startsWith(build + path.sep) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) file = path.join(build, 'index.html');
    res.setHeader('Content-Type', mime[path.extname(file)] || 'application/octet-stream'); fs.createReadStream(file).pipe(res);
  });
  await new Promise(r => server.listen(4180, '127.0.0.1', r));
  return { backend, server, room, refs, seed, url: 'http://127.0.0.1:4180', stop: async() => { seed.disconnect(); await new Promise(r => server.close(r)); await backend.stop(); } };
}
exports.start = start;
if (require.main === module) start().then(({ url }) => console.log(url), e => { console.error(e); process.exit(1); });
