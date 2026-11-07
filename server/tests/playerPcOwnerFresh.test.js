const assert = require('assert/strict');
const fs = require('fs');
const path = require('path');
const { createRequire } = require('module');

it('PC bundle authorization can bypass a primed character-owner cache using the production resolver', async() => {
  const filename = path.resolve(__dirname, '../services/firebaseService.js');
  const source = fs.readFileSync(filename, 'utf8');
  assert.equal(source.split('db = initializeFirebase();').length, 2);
  let owner = 'former-owner', reads = 0;
  const db = { collection: name => { assert.equal(name, 'characters'); return { doc: () => ({ get: async() => {
    reads++; return { exists: true, data: () => ({ metadata: { userId: owner } }) };
  } }) }; } };
  // Isolated production module with only its Firestore initialization replaced by an in-memory document.
  const isolated = { exports: {} };
  new Function('require', 'module', '__fixtureDb', source.replace('db = initializeFirebase();', 'db = __fixtureDb;'))(createRequire(filename), isolated, db);
  const resolve = isolated.exports.getCharacterOwner;
  assert.equal((await resolve('c')).userId, 'former-owner');
  owner = 'new-owner';
  assert.equal((await resolve('c')).userId, 'former-owner'); assert.equal(reads, 1);
  assert.equal((await resolve('c', { fresh: true })).userId, 'new-owner'); assert.equal(reads, 2);
  assert.equal((await resolve('c')).userId, 'new-owner');
});
