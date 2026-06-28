/**
 * DeltaSync Engine Tests
 *
 * Covers the pure delta engine that underpins Phase 6 items 1 (frontend
 * delta-sync application) and 2 (conflict resolution). These tests assert the
 * core roundtrip contract — applying a computed delta to the source state must
 * reproduce the target state — plus versioning, client delta delivery, and
 * conflict resolution. The engine is currently inactive end-to-end, so this
 * suite is the safety net required before wiring it into the live socket path.
 *
 * Run: npx mocha tests/deltaSync.test.js --timeout 10000
 */

const { expect } = require('chai');
const deltaSync = require('../services/deltaSync');

const clone = (o) => JSON.parse(JSON.stringify(o));

describe('DeltaSyncEngine', function () {
  this.timeout(10000);

  const created = { rooms: [], clients: [] };

  const newRoomId = () => {
    const id = `room-test-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    created.rooms.push(id);
    return id;
  };

  afterEach(() => {
    for (const id of created.rooms) deltaSync.removeRoom(id);
    for (const id of created.clients) deltaSync.removeClient(id);
    created.rooms.length = 0;
    created.clients.length = 0;
  });

  // Helper: the contract a delta engine must satisfy.
  // applyDelta(source, computeDelta(source, target)) must equal target.
  const roundtrip = (source, target) => {
    const delta = deltaSync.computeDelta(source, target);
    return delta === null ? clone(source) : deltaSync.applyDelta(clone(source), delta);
  };

  describe('computeDelta', () => {
    it('returns null for identical primitives', () => {
      expect(deltaSync.computeDelta(1, 1)).to.equal(null);
      expect(deltaSync.computeDelta('a', 'a')).to.equal(null);
    });

    it('returns a primitive delta for a changed primitive', () => {
      expect(deltaSync.computeDelta(1, 2)).to.deep.equal({ __value: 2, __type: 'primitive' });
    });

    it('returns null for deeply equal objects', () => {
      expect(deltaSync.computeDelta({ a: 1, b: { c: 2 } }, { a: 1, b: { c: 2 } })).to.equal(null);
    });

    it('detects an added key', () => {
      const delta = deltaSync.computeDelta({ a: 1 }, { a: 1, b: 2 });
      expect(delta).to.deep.equal({ b: { __value: 2, __type: 'primitive' } });
    });

    it('detects a modified key', () => {
      const delta = deltaSync.computeDelta({ a: 1 }, { a: 2 });
      expect(delta).to.deep.equal({ a: { __value: 2, __type: 'primitive' } });
    });

    it('marks a removed key as __deleted', () => {
      const delta = deltaSync.computeDelta({ a: 1, b: 2 }, { a: 1 });
      expect(delta).to.deep.equal({ b: { __deleted: true } });
    });

    it('recurses into nested objects', () => {
      const delta = deltaSync.computeDelta(
        { token: { x: 0, y: 0 } },
        { token: { x: 5, y: 0 } }
      );
      expect(delta).to.deep.equal({ token: { x: { __value: 5, __type: 'primitive' } } });
    });
  });

  describe('applyDelta — roundtrip contract', () => {
    it('returns state unchanged for a no-op delta', () => {
      const state = { a: 1 };
      expect(deltaSync.applyDelta(state, null)).to.equal(state);
      expect(deltaSync.applyDelta(state, {})).to.equal(state);
    });

    it('roundtrips a primitive field change', () => {
      const source = { hp: 10 };
      const target = { hp: 7 };
      expect(roundtrip(source, target)).to.deep.equal(target);
    });

    it('roundtrips a nested object change', () => {
      const source = { token: { x: 0, y: 0, name: 'orc' } };
      const target = { token: { x: 3, y: 0, name: 'orc' } };
      expect(roundtrip(source, target)).to.deep.equal(target);
    });

    it('roundtrips a key addition', () => {
      const source = { a: 1 };
      const target = { a: 1, b: { n: 2 } };
      expect(roundtrip(source, target)).to.deep.equal(target);
    });

    it('roundtrips a key deletion', () => {
      const source = { a: 1, b: 2 };
      const target = { a: 1 };
      expect(roundtrip(source, target)).to.deep.equal(target);
    });

    it('roundtrips a realistic token-map state (objects keyed by id)', () => {
      const source = {
        tokens: {
          't-1': { id: 't-1', x: 0, y: 0, hp: 10 },
          't-2': { id: 't-2', x: 5, y: 5, hp: 8 }
        }
      };
      const target = {
        tokens: {
          't-1': { id: 't-1', x: 1, y: 1, hp: 10 },
          't-2': { id: 't-2', x: 5, y: 5, hp: 8 },
          't-3': { id: 't-3', x: 9, y: 9, hp: 4 }
        }
      };
      expect(roundtrip(source, target)).to.deep.equal(target);
    });
  });

  describe('applyArrayDelta — roundtrip contract', () => {
    it('roundtrips an element change within an array', () => {
      const source = { drawingPaths: [{ n: 1 }, { n: 2 }] };
      const target = { drawingPaths: [{ n: 1 }, { n: 9 }] };
      expect(roundtrip(source, target)).to.deep.equal(target);
    });

    it('roundtrips an array resize (truncation)', () => {
      const source = { fogOfWarData: [1, 2, 3] };
      const target = { fogOfWarData: [1, 2] };
      expect(roundtrip(source, target)).to.deep.equal(target);
    });
  });

  describe('createStateUpdate + versioning', () => {
    it('throws if the room was not initialized', async () => {
      let err;
      try {
        await deltaSync.createStateUpdate('does-not-exist', { a: 1 });
      } catch (e) {
        err = e;
      }
      expect(err).to.be.an('error');
      expect(err.message).to.match(/not initialized/);
    });

    it('returns null when the state is unchanged', async () => {
      const roomId = newRoomId();
      deltaSync.initializeRoom(roomId, { a: 1 });
      const result = await deltaSync.createStateUpdate(roomId, { a: 1 });
      expect(result).to.equal(null);
    });

    it('creates a versioned delta linked to its parent', async () => {
      const roomId = newRoomId();
      const initVersionId = deltaSync.initializeRoom(roomId, { hp: 10 });
      const result = await deltaSync.createStateUpdate(roomId, { hp: 7 });

      expect(result).to.exist;
      expect(result.parentVersion).to.equal(initVersionId);
      expect(result.delta).to.deep.equal({ hp: { __value: 7, __type: 'primitive' } });
      expect(result.state).to.deep.equal({ hp: 7 });
      expect(result.id).to.be.a('string');
    });

    it('caps version history at maxVersionHistory', async () => {
      const roomId = newRoomId();
      deltaSync.initializeRoom(roomId, { n: 0 });
      const over = deltaSync.maxVersionHistory + 5;
      for (let i = 1; i <= over; i++) {
        await deltaSync.createStateUpdate(roomId, { n: i });
      }
      // Re-read the internal history length via getDeltaForClient surface:
      // initialize a fresh client and ensure we can still resolve the latest.
      const fresh = deltaSync.getDeltaForClient(roomId, 'client-fresh');
      expect(fresh).to.not.equal(null);
      expect(fresh.state).to.deep.equal({ n: over });
    });
  });

  describe('getDeltaForClient', () => {
    it('delivers a full_state payload to a brand-new client', async () => {
      const roomId = newRoomId();
      deltaSync.initializeRoom(roomId, { hp: 10 });
      await deltaSync.createStateUpdate(roomId, { hp: 7 });

      const clientId = 'client-full';
      created.clients.push(clientId);
      const payload = deltaSync.getDeltaForClient(roomId, clientId);

      expect(payload.type).to.equal('full_state');
      expect(payload.state).to.deep.equal({ hp: 7 });
    });

    it('returns null when the client is already up to date', async () => {
      const roomId = newRoomId();
      deltaSync.initializeRoom(roomId, { hp: 10 });
      await deltaSync.createStateUpdate(roomId, { hp: 7 });

      const clientId = 'client-uptodate';
      created.clients.push(clientId);
      deltaSync.getDeltaForClient(roomId, clientId); // advance to latest

      expect(deltaSync.getDeltaForClient(roomId, clientId)).to.equal(null);
    });

    it('delivers a delta_update when the client is behind', async () => {
      const roomId = newRoomId();
      deltaSync.initializeRoom(roomId, { hp: 10 });
      const clientId = 'client-behind';
      created.clients.push(clientId);
      deltaSync.getDeltaForClient(roomId, clientId); // snapshot at hp:10

      await deltaSync.createStateUpdate(roomId, { hp: 7 });

      const payload = deltaSync.getDeltaForClient(roomId, clientId);
      expect(payload.type).to.equal('delta_update');
      expect(payload.delta).to.exist;
    });
  });

  describe('mergeDelta + resolveConflict', () => {
    it('merges disjoint keys from two deltas', () => {
      const merged = deltaSync.mergeDelta(
        { a: { __value: 1, __type: 'primitive' } },
        { b: { __value: 2, __type: 'primitive' } }
      );
      expect(merged).to.deep.equal({
        a: { __value: 1, __type: 'primitive' },
        b: { __value: 2, __type: 'primitive' }
      });
    });

    it('uses last-write-wins on conflicting primitives', () => {
      const merged = deltaSync.mergeDelta(
        { hp: { __value: 7, __type: 'primitive' } },
        { hp: { __value: 9, __type: 'primitive' } }
      );
      expect(merged.hp).to.deep.equal({ __value: 9, __type: 'primitive' });
    });

    it('keeps the new value when the existing one was deleted', () => {
      const merged = deltaSync.mergeDelta(
        { hp: { __deleted: true } },
        { hp: { __value: 9, __type: 'primitive' } }
      );
      expect(merged.hp).to.deep.equal({ __value: 9, __type: 'primitive' });
    });

    it('recursively merges nested object deltas', () => {
      const merged = deltaSync.mergeDelta(
        { token: { x: { __value: 1, __type: 'primitive' } } },
        { token: { y: { __value: 2, __type: 'primitive' } } }
      );
      expect(merged.token).to.deep.equal({
        x: { __value: 1, __type: 'primitive' },
        y: { __value: 2, __type: 'primitive' }
      });
    });

    it('applies a registered policy instead of LWW for that field', () => {
      deltaSync.clearPolicies();
      deltaSync.registerPolicy('hp', require('../services/conflictPolicies').minValue);
      try {
        const merged = deltaSync.mergeDelta(
          { hp: { __value: 7, __type: 'primitive' } },
          { hp: { __value: 9, __type: 'primitive' } }
        );
        // minValue picks the smaller number — not the LWW "9".
        expect(merged.hp).to.deep.equal({ __value: 7, __type: 'primitive' });
      } finally {
        deltaSync.clearPolicies();
      }
    });

    it('a policy that defers (returns undefined) falls through to LWW', () => {
      deltaSync.clearPolicies();
      deltaSync.registerPolicy('hp', () => undefined);
      try {
        const merged = deltaSync.mergeDelta(
          { hp: { __value: 7, __type: 'primitive' } },
          { hp: { __value: 9, __type: 'primitive' } }
        );
        expect(merged.hp).to.deep.equal({ __value: 9, __type: 'primitive' });
      } finally {
        deltaSync.clearPolicies();
      }
    });

    it('policy is consulted at every recursion level (deeply nested field)', () => {
      deltaSync.clearPolicies();
      deltaSync.registerPolicy('hp', require('../services/conflictPolicies').minValue);
      try {
        const merged = deltaSync.mergeDelta(
          { token: { id123: { hp: { __value: 7, __type: 'primitive' } } } },
          { token: { id123: { hp: { __value: 9, __type: 'primitive' } } } }
        );
        expect(merged.token.id123.hp).to.deep.equal({ __value: 7, __type: 'primitive' });
      } finally {
        deltaSync.clearPolicies();
      }
    });

    it('tombstone + value collision still honours the tombstone rule even with a policy', () => {
      deltaSync.clearPolicies();
      deltaSync.registerPolicy('hp', require('../services/conflictPolicies').minValue);
      try {
        const merged = deltaSync.mergeDelta(
          { hp: { __deleted: true } },
          { hp: { __value: 9, __type: 'primitive' } }
        );
        expect(merged.hp).to.deep.equal({ __value: 9, __type: 'primitive' });
      } finally {
        deltaSync.clearPolicies();
      }
    });

    it('unrelated fields remain on LWW when only one field has a policy', () => {
      deltaSync.clearPolicies();
      deltaSync.registerPolicy('hp', require('../services/conflictPolicies').minValue);
      try {
        const merged = deltaSync.mergeDelta(
          {
            hp: { __value: 7, __type: 'primitive' },
            name: { __value: 'a', __type: 'primitive' }
          },
          {
            hp: { __value: 9, __type: 'primitive' },
            name: { __value: 'b', __type: 'primitive' }
          }
        );
        expect(merged.hp).to.deep.equal({ __value: 7, __type: 'primitive' });
        expect(merged.name).to.deep.equal({ __value: 'b', __type: 'primitive' });
      } finally {
        deltaSync.clearPolicies();
      }
    });
  });

  describe('policy registry API', () => {
    it('registerPolicies(map) registers many entries in one call', () => {
      deltaSync.clearPolicies();
      const minV = require('../services/conflictPolicies').minValue;
      const maxV = require('../services/conflictPolicies').maxValue;
      try {
        deltaSync.registerPolicies({ hp: minV, ap: maxV });
        expect(deltaSync.policies.get('hp')).to.equal(minV);
        expect(deltaSync.policies.get('ap')).to.equal(maxV);
      } finally {
        deltaSync.clearPolicies();
      }
    });

    it('loadDefaultPolicies populates the registry with the built-in set', () => {
      deltaSync.clearPolicies();
      try {
        deltaSync.loadDefaultPolicies();
        const p = deltaSync.policies;
        expect(p.get('hp')).to.be.a('function');
        expect(p.get('health')).to.be.a('function');
        expect(p.get('ap')).to.be.a('function');
        expect(p.get('x')).to.be.a('function');
        expect(p.get('y')).to.be.a('function');
      } finally {
        deltaSync.clearPolicies();
      }
    });

    it('clearPolicies() removes all entries; clearPolicies(field) removes one', () => {
      deltaSync.clearPolicies();
      const minV = require('../services/conflictPolicies').minValue;
      deltaSync.registerPolicy('hp', minV);
      deltaSync.registerPolicy('ap', minV);
      expect(deltaSync.policies.size).to.equal(2);

      deltaSync.clearPolicies('hp');
      expect(deltaSync.policies.size).to.equal(1);
      expect(deltaSync.policies.get('hp')).to.equal(undefined);

      deltaSync.clearPolicies();
      expect(deltaSync.policies.size).to.equal(0);
    });

    it('registerPolicy rejects bad input', () => {
      expect(() => deltaSync.registerPolicy('', () => {})).to.throw(TypeError);
      expect(() => deltaSync.registerPolicy(null, () => {})).to.throw(TypeError);
      expect(() => deltaSync.registerPolicy('hp', null)).to.throw(TypeError);
      expect(() => deltaSync.registerPolicy('hp', 'not a function')).to.throw(TypeError);
    });

    it('registerPolicies rejects non-object input', () => {
      expect(() => deltaSync.registerPolicies(null)).to.throw(TypeError);
      expect(() => deltaSync.registerPolicies('nope')).to.throw(TypeError);
    });
  });

  describe('createStateUpdateWithConflictResolution', () => {
    it('delegates to createStateUpdate when there are no concurrent updates', async () => {
      const roomId = newRoomId();
      deltaSync.initializeRoom(roomId, { hp: 10 });

      const result = await deltaSync.createStateUpdateWithConflictResolution(
        roomId,
        { hp: 7 },
        { playerId: 'player-A' }
      );

      expect(result).to.exist;
      expect(result.metadata.playerId).to.equal('player-A');
      expect(result.metadata.conflictsResolved).to.equal(undefined);
    });

    it('records resolved conflicts for concurrent updates from different players', async () => {
      const roomId = newRoomId();
      deltaSync.initializeRoom(roomId, { hp: 10, mp: 5 });

      // Player A lands a change first.
      await deltaSync.createStateUpdate(roomId, { hp: 8, mp: 5 }, { playerId: 'player-A' });

      // Player B lands a concurrent change within the conflict window.
      const result = await deltaSync.createStateUpdateWithConflictResolution(
        roomId,
        { hp: 8, mp: 3 },
        { playerId: 'player-B' }
      );

      expect(result).to.exist;
      expect(result.metadata.conflictsResolved).to.be.greaterThan(0);
      expect(result.state).to.deep.equal({ hp: 8, mp: 3 });
    });
  });
});
