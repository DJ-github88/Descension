const assert = require('assert/strict');
const crypto = require('crypto');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const actors = require('../services/actorConsequences');
const { EVENTS } = require('../services/reactionWindows');
const ack = (socket, event, payload) => new Promise((resolve, reject) => {
  const t = setTimeout(() => reject(Error(`ACK timeout ${event}`)), 12000);
  socket.emit(event, payload, result => { clearTimeout(t); resolve(result); });
});
const once = (socket, event) => new Promise(resolve => socket.once(event, resolve));
describe('P13B-W real registered middleware/authority stack', function() {
  this.timeout(25000);
  let server, gm, owner, observer, room, pc, source, epoch;
  beforeEach(async() => {
    server = createProductionStackServer({ characterOwners: { c: 'owner' } }); await server.start();
    for (const e of [...EVENTS, 'actor_bind']) server.setEventLimits(e, { maxPerMinute: 2000, maxPerSecond: 2000 });
    for (const id of ['gm', 'owner', 'observer']) server.registerAuthToken(id, id);
    gm = server.connect({ token: 'gm' }); await once(gm, 'connect'); room = await server.seedRoom(gm.id, { gmUserId: 'gm' });
    for (const id of ['owner', 'observer']) {
      const socket = server.connect({ token: id }); await once(socket, 'connect'); const joined = once(socket, 'room_joined');
      socket.emit('join_room', { roomId: room.id, playerName: id, password: '', ...(id === 'owner' ? { character: { id: 'c' } } : {}) }); await joined;
      if (id === 'owner') owner = socket; else observer = socket;
    }
    const map = room.gameState.maps.default;
    map.tokens.foe = { id: 'foe', stats: { maxHp: 30, maxMana: 10, maxAP: 4 }, state: {
      currentHp: 30, currentMana: 10, currentActionPoints: 4, conditions: [] } };
    map.characterTokens.pc = { id: 'pc', ownerUserId: 'owner', character: { id: 'c', health: { current: 30, max: 30 },
      mana: { current: 10, max: 10 }, actionPoints: { current: 4, max: 4 } }, state: { conditions: [] } };
    source = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'foe' }, snapshotHash: actors.hash(map.tokens.foe) })).ref;
    pc = (await ack(gm, 'actor_bind', { roomId: room.id, ref: { kind: 'character', roomId: room.id, mapId: 'default', tokenId: 'pc', ownerUid: 'owner', characterId: 'c' }, snapshotHash: actors.hash(map.characterTokens.pc) })).ref;
    assert.ok(source && pc); epoch = (await ack(gm, 'reaction_window_list', { roomId: room.id })).epoch;
  });
  afterEach(async() => { gm.disconnect(); owner.disconnect(); observer.disconnect(); await server.stop(); });
  const open = () => ack(gm, 'reaction_window_open', { roomId: room.id, requestId: crypto.randomUUID(), epoch,
    trigger: { causeId: crypto.randomUUID(), moment: 'after_roll', occurrence: '1', basis: 'gm-manual' }, source, invited: [pc], gmCommit: { refs: [source], note: 'GM_SECRET' } });
  const intent = windowId => ({ roomId: room.id, requestId: crypto.randomUUID(), epoch, windowId, reactor: pc,
    cardKey: 'manual:parry', label: 'PLAYER_SECRET', note: 'private', expectedRevision: 0, withdrawn: false });
  it('private ACK only, exact owner status on another socket, and no shared-state/receipt writes', async() => {
    const before = actors.hash(room.gameState), messages = [];
    gm.on('reaction_window_changed', () => messages.push('gm')); observer.on('reaction_window_changed', () => messages.push('observer'));
    const opened = await open(); assert.equal(opened.success, true, JSON.stringify(opened));
    await new Promise(r => setTimeout(r, 20)); messages.length = 0;
    const data = intent(opened.windows[0].windowId), result = await ack(owner, 'reaction_window_change', data);
    assert.equal(result.success, true, JSON.stringify(result)); await new Promise(r => setTimeout(r, 20)); assert.deepEqual(messages, []);
    const gmView = await ack(gm, 'reaction_window_list', { roomId: room.id });
    assert.equal(JSON.stringify(gmView).includes('PLAYER_SECRET'), false);
    assert.deepEqual((await ack(observer, 'reaction_window_list', { roomId: room.id })).windows, []);
    assert.equal(actors.hash(room.gameState), before);
    const retry = await ack(owner, 'reaction_window_change', data); assert.equal(retry.windows[0].intents[0].revision, 1);
    assert.equal((await ack(observer, 'reaction_window_change', data)).success, false);
    const bad = { ...data, requestId: crypto.randomUUID(), expectedRevision: 1, note: '<b>silently rewritten</b>' };
    assert.equal((await ack(owner, 'reaction_window_change', bad)).success, false);
  });
  it('authority-await crossing cutoff cannot append after close; reveal is GM-only', async() => {
    const opened = await open(), w = opened.windows[0]; assert.equal(opened.success, true);
    const data = intent(w.windowId), authority = server.authorityService;
    // Exercise the handler's additional fresh authority await (the outer production guard remains real).
    const original = authority.assertCurrent.bind(authority); let release, seen;
    const pending = new Promise(resolve => { seen = resolve; });
    authority.assertCurrent = async(...args) => { seen(); await new Promise(resolve => { release = resolve; }); return original(...args); };
    const submitted = ack(owner, 'reaction_window_change', data); await pending;
    await new Promise(resolve => setTimeout(resolve, 8050)); authority.assertCurrent = original; release();
    const late = await submitted; assert.equal(late.code, 'window_closed_manual', JSON.stringify(late));
    const closed = await ack(gm, 'reaction_window_list', { roomId: room.id });
    assert.equal(closed.windows[0].status, 'closed'); assert.deepEqual(closed.windows[0].review, []);
  });
});
