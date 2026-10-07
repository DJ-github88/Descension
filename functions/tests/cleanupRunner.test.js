'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const { cleanupSourceAssets } = require('../cleanupRunner');

function descriptor(extra = {}) {
  return {
    bucket: 'fixture',
    path: 'users/u/portraits/a.webp',
    ownerUserId: 'u',
    source: 'characters/c',
    generation: '1',
    exclusive: true,
    ...extra
  };
}

/**
 * Fake bucket whose delete honours ifGenerationMatch exactly like the real
 * GCS SDK contract, so replacement-generation behaviour is exercised.
 */
function fakeStorage(initial = { generation: '1', metadata: { userId: 'u' } }) {
  const state = { object: initial, deletes: 0, deleteCalls: [] };
  const bucket = {
    name: 'fixture',
    file: (path) => ({
      getMetadata: async () => {
        if (!state.object) {throw Object.assign(new Error('missing'), { code: 404 });}
        return [state.object];
      },
      delete: async (options = {}) => {
        state.deleteCalls.push({ path, options });
        assert.ok(options.ifGenerationMatch, 'delete must carry a generation precondition');
        if (!state.object) {throw Object.assign(new Error('missing'), { code: 404 });}
        if (String(options.ifGenerationMatch) !== String(state.object.generation)) {
          throw Object.assign(new Error('precondition failed'), { code: 412 });
        }
        state.object = null;
        state.deletes += 1;
      }
    })
  };
  return { storage: { bucket: () => bucket }, state };
}

const characterDoc = (cleanupAssets) => ({
  metadata: { userId: 'u' },
  cleanupAssets
});

test('duplicate trigger invocation is idempotent', async () => {
  const { storage, state } = fakeStorage();
  const event = { sourceType: 'character', sourceDocumentPath: 'characters/c', sourceDoc: characterDoc([descriptor()]) };
  const first = await cleanupSourceAssets({ storage, ...event });
  const second = await cleanupSourceAssets({ storage, ...event });
  assert.equal(first.deleted, 1);
  assert.equal(second.deleted, 0);
  assert.equal(state.deletes, 1);
});

test('already-gone object is safe', async () => {
  const { storage } = fakeStorage(null);
  const result = await cleanupSourceAssets({
    storage, sourceType: 'character', sourceDocumentPath: 'characters/c', sourceDoc: characterDoc([descriptor()])
  });
  assert.equal(result.deleted, 0);
  assert.equal(result.refused, 0);
});

test('replacement object with a new generation survives a stale trigger', async () => {
  const { storage, state } = fakeStorage({ generation: '2', metadata: { userId: 'u' } });
  const result = await cleanupSourceAssets({
    storage, sourceType: 'character', sourceDocumentPath: 'characters/c', sourceDoc: characterDoc([descriptor()])
  });
  assert.equal(result.deleted, 0);
  assert.equal(result.refused, 1);
  assert.equal(state.object.generation, '2');
});

test('source mismatch refuses without delete', async () => {
  const { storage, state } = fakeStorage();
  const result = await cleanupSourceAssets({
    storage,
    sourceType: 'character',
    sourceDocumentPath: 'characters/c',
    sourceDoc: characterDoc([descriptor({ source: 'characters/other' })])
  });
  assert.equal(result.deleted, 0);
  assert.equal(result.refused, 1);
  assert.equal(state.deletes, 0);
});

test('missing source binding refuses without delete', async () => {
  const { storage, state } = fakeStorage();
  const d = descriptor();
  delete d.source;
  const result = await cleanupSourceAssets({
    storage, sourceType: 'character', sourceDocumentPath: 'characters/c', sourceDoc: characterDoc([d])
  });
  assert.equal(result.deleted, 0);
  assert.equal(result.refused, 1);
  assert.equal(state.deletes, 0);
});

test('foreign owner and shared/system paths refuse without delete', async () => {
  const { storage, state } = fakeStorage();
  const result = await cleanupSourceAssets({
    storage,
    sourceType: 'character',
    sourceDocumentPath: 'characters/c',
    sourceDoc: characterDoc([
      descriptor({ path: 'users/other/portraits/a.webp' }),
      descriptor({ path: 'shared/u/a.webp' }),
      descriptor({ path: 'system-assets/a.webp' })
    ])
  });
  assert.equal(result.deleted, 0);
  assert.equal(result.refused, 3);
  assert.equal(state.deletes, 0);
});
