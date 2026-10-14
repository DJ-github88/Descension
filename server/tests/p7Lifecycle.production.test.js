const assert = require('assert/strict');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const actors = require('../services/actorConsequences');
const ack = (client, event, payload) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(Error('ACK timeout ' + event)), 5000);
  client.emit(event, payload, value => {clearTimeout(timer); resolve(value);});
});
describe('P7 B5 registered lifecycle projection cut', function() {
  this.timeout(15000);
  it('orders real creation/bind/dismiss/reuse and captures absence while leaving receipt identity separate', async() => {
    const backend = createProductionStackServer(); await backend.start(); backend.registerAuthToken('lifecycle', 'owner');
    const client = backend.connect({ token: 'lifecycle' }); await new Promise(resolve => client.once('connect', resolve));
    try {
      const room = await backend.seedRoom(client.id, { gmUserId: 'owner' });
      backend.setEventLimits('actor_snapshot', { maxPerSecond: 200, maxPerMinute: 200 });
      const snapshot = () => ack(client, 'actor_snapshot', { roomId: room.id });
      const create = () => ack(client, 'token_created', { roomId: room.id, mapId: 'default', token: { id: 'reuse', state: { currentHp: 7, currentMana: 3, currentActionPoints: 2, conditions: [] } }, creature: { stats: { maxHp: 10, maxMana: 5, maxAP: 3 } }, position: { x: 0, y: 0 } });
      const initial = await snapshot(); assert.equal(initial.actorProjection.cut, 0);
      assert.equal((await create()).success, true);
      const unbound = await snapshot(); assert.equal(unbound.actorProjection.cut, 1); assert.deepEqual(unbound.maps.default.tokens.reuse.state.actorLifecycle, unbound.actorProjection);
      const bound = await ack(client, 'actor_bind', { roomId: room.id, ref: { kind: 'creature', roomId: room.id, mapId: 'default', tokenId: 'reuse' }, snapshotHash: actors.hash(room.gameState.maps.default.tokens.reuse) });
      assert.equal(bound.success, true); assert.equal(bound.actorSnapshot.actorProjection.cut, 2);
      const saved = await snapshot(); const dismissed = new Promise(resolve => client.once('token_dismissed', resolve));
      client.emit('token_dismissed', { roomId: room.id, mapId: 'default', tokenId: 'reuse' }); const event = await dismissed;
      assert.equal(event.actorSnapshot.actorProjection.cut, 3); assert.deepEqual(event.actorSnapshot.maps.default.tokens, {});
      assert.throws(() => actors.locate(room, bound.ref));
      assert.equal((await create()).success, true); const recreated = await snapshot(); assert.equal(recreated.actorProjection.cut, 4);
      assert.equal(recreated.commitSequence, saved.commitSequence); assert.equal(recreated.actionEpoch, saved.actionEpoch);
      assert.equal(saved.maps.default.tokens.reuse.state.currentHp, 7); assert.deepEqual(event.actorSnapshot.maps.default.tokens, {});
      const before = JSON.stringify(room.gameState);
      const forged = await ack(client, 'token_created', { roomId: room.id, token: { id: 'forged', state: { actorLifecycle: recreated.actorProjection } }, creature: { stats: { maxHp: 10 } }, position: { x: 0, y: 0 } });
      assert.equal(forged.code, 'client_actor_metadata'); assert.equal(JSON.stringify(room.gameState), before);
    } finally {client.disconnect(); await backend.stop();}
  });
});
