/* Immutable pre-fix witnesses. P7_RED=1 runs against the frozen starting source. */
const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const { createProductionStackServer } = require('./helpers/productionStackServer');
const { FirebaseBatchWriter } = require('../services/syncService');
const roomAccess = require('../services/roomAccessService');

(process.env.P7_RED === '1' ? describe : describe.skip)('P7 frozen negative production witnesses', function() {
  this.timeout(10000);
  it('legacy nested/flat resources bypass revisions; condition projection loses clocks; writer has no pre-publication admission', async() => {
    const server = createProductionStackServer();
    await server.start();
    const uid = server.nextUserId();
    server.registerAuthToken('p7-red', uid);
    const client = server.connect({ token: 'p7-red' });
    const observations = {};
    try {
      await new Promise(resolve => client.once('connect', resolve));
      const room = await server.seedRoom(client.id, { gmUserId: uid });
      const token = { id: 'red-token', creatureId: 'grimmstalk', ownerUserId: uid,
        state: { currentHp: 250, currentMana: 30, currentActionPoints: 5, conditions: [] } };
      room.gameState.maps.default.tokens[token.id] = token;
      room.gameState.tokens[token.id] = token;
      const echo = new Promise(resolve => client.once('token_updated', resolve));
      client.emit('token_updated', { roomId: room.id, mapId: 'default', tokenId: token.id, updates: { currentHp: 219 } });
      await echo;
      const saved = room.gameState.maps.default.tokens[token.id];
      assert.equal(saved.currentHp, 219);
      assert.equal(saved.state.currentHp, 250);
      assert.equal(saved.state.actorContract, undefined);
      observations.legacyWrite = { rootHp: saved.currentHp, nestedHp: saved.state.currentHp, noRevisionOrReceipt: true };
      const record = { id: 'round-zero', name: 'Slowed', type: 'debuff', durationType: 'rounds', remainingRounds: 0,
        durationValue: 3, effects: { movementSpeed: -10 }, startTime: 10, endTime: 20, sourceEntityId: 'source' };
      const projected = roomAccess.projectStateUpdates({ conditions: [record] }).conditions[0];
      assert.equal(projected.remainingRounds, undefined);
      assert.equal(projected.endTime, undefined);
      assert.equal(projected.effects, undefined);
      observations.condition = { original: record, projected };
      const writer = new FirebaseBatchWriter(60000, 50, { maxRetainedRooms: 1, maxTrackedRooms: 1, persist: () => new Promise(() => {}) });
      try {
        assert.equal(typeof writer.admitConsequence, 'undefined');
        writer.queueWrite('occupied', { maps: {} }, true);
        await Promise.resolve();
        assert.equal(writer.queueWrite('new-room', { maps: {} }), null);
        observations.writer = { noAdmissionBeforePublicationAPI: true, actualCapacityRefusal: true };
      } finally { writer.stop(); }
      const out = path.resolve(__dirname, '../../vtt-react/verification/p7/evidence');
      fs.writeFileSync(path.join(out, 'negative-server.json'), JSON.stringify(observations, null, 2));
    } finally { client.disconnect(); await server.stop(); }
  });
});
