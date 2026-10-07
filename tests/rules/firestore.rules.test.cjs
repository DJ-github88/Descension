/**
 * Project 4 Firestore rules emulator matrix.
 *
 * Positive/negative checks for the frozen access boundary:
 * - raw room roots, checkpoint fragments and chat are server-only for clients
 * - client draft creation is denied (server-mediated safe draft creation)
 * - owner-private users with positive CREATE and immutable protected fields
 * - exact versioned slim public profile (null-tolerant, lowercase-consistent)
 * - immutable character ownership + Admin-only cleanup descriptor
 * - public-read / Admin-write global taxonomy
 * - query compatibility for foreign profile reads
 *
 * Run:  cd tests/rules && npm install && npm test:firestore
 * Emulators must be reachable (FIRESTORE_EMULATOR_HOST, default 127.0.0.1:8080).
 */

'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const {
  initializeTestEnvironment,
  assertFails,
  assertSucceeds
} = require('@firebase/rules-unit-testing');

const {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where
} = require('firebase/firestore');

const RULES = fs.readFileSync(path.resolve(__dirname, '..', '..', 'firestore.rules'), 'utf8');

let testEnv;

test.before(async() => {
  testEnv = await initializeTestEnvironment({
    projectId: 'mythrill-rules-test',
    firestore: { rules: RULES }
  });
});

test.after(async() => {
  if (testEnv) { await testEnv.cleanup(); }
});

const userDb = (uid) => testEnv.authenticatedContext(uid, {
  firebase: { sign_in_provider: 'password' }
}).firestore();

const anonDb = (uid) => testEnv.authenticatedContext(uid, {
  firebase: { sign_in_provider: 'anonymous' }
}).firestore();

async function seedRawRoom(roomId) {
  await testEnv.withSecurityRulesDisabled(async(context) => {
    await setDoc(doc(context.firestore(), 'rooms', roomId), {
      id: roomId,
      name: 'Initialized Room',
      gmId: 'gm-1',
      members: ['gm-1', 'member-1'],
      checkpoint: { schemaVersion: 1, revision: 3, mapIds: [], committed: true },
      isActive: true,
      settings: { maxPlayers: 6, isPrivate: false }
    });
    await setDoc(doc(context.firestore(), 'rooms', roomId, 'gameState', 'current'), {
      schemaVersion: 1,
      checkpointRevision: 3,
      snapshotJson: '{}'
    });
    await setDoc(doc(context.firestore(), 'rooms', roomId, 'chat', 'm1'), { content: 'hi' });
  });
}

test('raw initialized room root is denied to every client', async() => {
  await seedRawRoom('raw-room-1');
  await assertFails(getDoc(doc(userDb('gm-1'), 'rooms', 'raw-room-1')));
  await assertFails(getDoc(doc(userDb('member-1'), 'rooms', 'raw-room-1')));
  await assertFails(getDoc(doc(userDb('foreign-1'), 'rooms', 'raw-room-1')));
});

test('checkpoint fragments and chat are denied to every client', async() => {
  await seedRawRoom('raw-room-2');
  await assertFails(getDoc(doc(userDb('gm-1'), 'rooms', 'raw-room-2', 'gameState', 'current')));
  await assertFails(setDoc(doc(userDb('gm-1'), 'rooms', 'raw-room-2', 'gameState', 'map-a'), { x: 1 }));
  await assertFails(getDoc(doc(userDb('gm-1'), 'rooms', 'raw-room-2', 'chat', 'm1')));
  await assertFails(updateDoc(doc(userDb('gm-1'), 'rooms', 'raw-room-2'), { name: 'Hijack' }));
  await assertFails(updateDoc(doc(userDb('gm-1'), 'rooms', 'raw-room-2'), { members: ['intruder'] }));
  await assertFails(deleteDoc(doc(userDb('gm-1'), 'rooms', 'raw-room-2')));
});

test('client draft creation is denied (server-mediated drafts only)', async() => {
  await assertFails(setDoc(doc(userDb('owner-1'), 'rooms', 'draft-1'), {
    id: 'draft-1',
    name: 'Draft Hall',
    gmId: 'owner-1',
    members: ['owner-1'],
    checkpoint: null,
    isActive: false
  }));
  await assertFails(setDoc(doc(anonDb('anon-1'), 'rooms', 'draft-2'), {
    id: 'draft-2', name: 'X', gmId: 'anon-1', members: ['anon-1'], checkpoint: null, isActive: false
  }));
});

test('users documents are owner-only with positive create and protected-field immutability', async() => {
  await testEnv.withSecurityRulesDisabled(async(context) => {
    await setDoc(doc(context.firestore(), 'users', 'u-1'), {
      displayName: 'User', subscriptionTier: 'pro', subscriptionUpdatedAt: new Date(), isGuest: false
    });
  });
  await assertSucceeds(getDoc(doc(userDb('u-1'), 'users', 'u-1')));
  await assertFails(getDoc(doc(userDb('u-2'), 'users', 'u-1')));

  await assertSucceeds(updateDoc(doc(userDb('u-1'), 'users', 'u-1'), { displayName: 'Renamed' }));
  await assertFails(updateDoc(doc(userDb('u-1'), 'users', 'u-1'), { subscriptionTier: 'mythic' }));
  await assertFails(updateDoc(doc(userDb('u-1'), 'users', 'u-1'), { isGuest: true }));
  await assertFails(updateDoc(doc(userDb('u-1'), 'users', 'u-1'), { displayName: 'X', role: 'admin' }));
  await assertFails(deleteDoc(doc(userDb('u-1'), 'users', 'u-1')));

  // Positive CREATE: known fields succeed; unknown/protected fields denied.
  await assertSucceeds(setDoc(doc(userDb('new-1'), 'users', 'new-1'), {
    displayName: 'New', email: 'n@example.com', characters: [], preferences: {}, gameData: {}
  }));
  await assertFails(setDoc(doc(userDb('new-2'), 'users', 'new-2'), {
    displayName: 'New', subscriptionTier: 'free'
  }));
  await assertFails(setDoc(doc(userDb('new-3'), 'users', 'new-3'), {
    displayName: 'New', internalFlag: true
  }));
});

test('public profile requires the exact slim versioned schema', async() => {
  await testEnv.withSecurityRulesDisabled(async(context) => {
    await setDoc(doc(context.firestore(), 'userProfiles', 'p-1'), {
      displayName: 'Public User', friendId: 'FRIEND1', friendId_lowercase: 'friend1',
      projectionVersion: 1, updatedAt: new Date(), photoURL: null
    });
    await setDoc(doc(context.firestore(), 'userProfiles', 'p-legacy'), {
      displayName: 'Legacy User', bio: 'private-ish'
    });
    await setDoc(doc(context.firestore(), 'userProfiles', 'p-mixed-v1'), {
      displayName: 'Mixed', bio: 'private', projectionVersion: 1, updatedAt: new Date()
    });
  });

  await assertSucceeds(getDoc(doc(userDb('viewer-1'), 'userProfiles', 'p-1')));
  await assertFails(getDoc(doc(userDb('viewer-1'), 'userProfiles', 'p-legacy')));
  await assertFails(getDoc(doc(userDb('viewer-1'), 'userProfiles', 'p-mixed-v1')));
  await assertSucceeds(getDoc(doc(userDb('p-legacy'), 'userProfiles', 'p-legacy')));

  await assertFails(setDoc(doc(userDb('p-1'), 'userProfiles', 'p-1'), {
    bio: 'should be private', projectionVersion: 1
  }, { merge: true }));
  await assertFails(setDoc(doc(userDb('p-1'), 'userProfiles', 'p-1'), {
    displayName: 'X', projectionVersion: 2
  }, { merge: true }));
  // Lowercase consistency is enforced.
  await assertFails(setDoc(doc(userDb('p-1'), 'userProfiles', 'p-1'), {
    friendId: 'MiXeD', friendId_lowercase: 'wrong', projectionVersion: 1, updatedAt: new Date()
  }));
});

test('foreign profile queries require the version filter (rules are not filters)', async() => {
  await testEnv.withSecurityRulesDisabled(async(context) => {
    await setDoc(doc(context.firestore(), 'userProfiles', 'q-1'), {
      displayName: 'Query', friendId: 'Q1', friendId_lowercase: 'q1',
      projectionVersion: 1, updatedAt: new Date()
    });
  });
  await assertSucceeds(getDocs(query(
    collection(userDb('viewer-q'), 'userProfiles'),
    where('friendId_lowercase', '==', 'q1'),
    where('projectionVersion', '==', 1)
  )));
  await assertFails(getDocs(query(
    collection(userDb('viewer-q'), 'userProfiles'),
    where('friendId_lowercase', '==', 'q1')
  )));
});

test('character ownership is immutable and the cleanup descriptor is Admin-only', async() => {
  await testEnv.withSecurityRulesDisabled(async(context) => {
    await setDoc(doc(context.firestore(), 'characters', 'c-1'), {
      metadata: { userId: 'owner-c', name: 'Hero' },
      inventory: { items: [] }
    });
  });

  await assertSucceeds(updateDoc(doc(userDb('owner-c'), 'characters', 'c-1'), {
    'metadata.name': 'Renamed Hero'
  }));
  await assertFails(updateDoc(doc(userDb('owner-c'), 'characters', 'c-1'), {
    metadata: { userId: 'someone-else', name: 'Hero' }
  }));
  await assertFails(updateDoc(doc(userDb('owner-c'), 'characters', 'c-1'), {
    cleanupAssets: [{ path: 'users/owner-c/portraits/a.webp' }]
  }));
  await assertFails(getDoc(doc(userDb('foreign-c'), 'characters', 'c-1')));
});

test('global taxonomy is public read and Admin write only', async() => {
  const collections = ['spell_categories', 'item_categories', 'creature_categories', 'map_categories'];
  for (const collectionName of collections) {
    await testEnv.withSecurityRulesDisabled(async(context) => {
      await setDoc(doc(context.firestore(), collectionName, 'seed'), { name: 'Seed' });
    });
    await assertSucceeds(getDoc(doc(userDb('any-1'), collectionName, 'seed')));
    await assertFails(setDoc(doc(userDb('any-1'), collectionName, 'client-write'), { name: 'Bad' }));
    await assertFails(updateDoc(doc(userDb('any-1'), collectionName, 'seed'), { name: 'Bad' }));
    await assertFails(deleteDoc(doc(userDb('any-1'), collectionName, 'seed')));
  }
});

test('room authority coordination records are server/Admin only for every client', async() => {
  await testEnv.withSecurityRulesDisabled(async(context) => {
    await setDoc(doc(context.firestore(), 'roomAuthorities', 'auth-room'), {
      authorityInstanceId: 'instance-A', authorityGeneration: 1, state: 'held'
    });
    // The GM/member identities below are real roles of the tested room fixture.
    await setDoc(doc(context.firestore(), 'rooms', 'auth-room'), {
      id: 'auth-room',
      gmId: 'gm-1',
      members: ['gm-1', 'member-1'],
      isActive: true,
      checkpoint: null
    });
  });

  // Unauthenticated client: read, create, update and delete denied.
  const anon = testEnv.unauthenticatedContext().firestore();
  await assertFails(getDoc(doc(anon, 'roomAuthorities', 'auth-room')));
  await assertFails(setDoc(doc(anon, 'roomAuthorities', 'auth-room-anon'), { state: 'held' }));
  await assertFails(updateDoc(doc(anon, 'roomAuthorities', 'auth-room'), { state: 'released' }));
  await assertFails(deleteDoc(doc(anon, 'roomAuthorities', 'auth-room')));

  // Authenticated ordinary user: read/create/update/delete denied.
  const ordinary = userDb('ordinary-1');
  await assertFails(getDoc(doc(ordinary, 'roomAuthorities', 'auth-room')));
  await assertFails(setDoc(doc(ordinary, 'roomAuthorities', 'auth-room-ordinary'), { state: 'held' }));
  await assertFails(updateDoc(doc(ordinary, 'roomAuthorities', 'auth-room'), { state: 'released' }));
  await assertFails(deleteDoc(doc(ordinary, 'roomAuthorities', 'auth-room')));

  // Room GM identity still has no client access to lease records, including
  // CREATE.
  const gm = userDb('gm-1');
  await assertFails(getDoc(doc(gm, 'roomAuthorities', 'auth-room')));
  await assertFails(setDoc(doc(gm, 'roomAuthorities', 'auth-room-gm'), { state: 'held' }));
  await assertFails(updateDoc(doc(gm, 'roomAuthorities', 'auth-room'), { fencedAt: new Date() }));
  await assertFails(deleteDoc(doc(gm, 'roomAuthorities', 'auth-room')));

  // Durable member identity: same denies.
  const member = userDb('member-1');
  await assertFails(getDoc(doc(member, 'roomAuthorities', 'auth-room')));
  await assertFails(setDoc(doc(member, 'roomAuthorities', 'auth-room-member'), { state: 'held' }));
  await assertFails(updateDoc(doc(member, 'roomAuthorities', 'auth-room'), { state: 'deleted' }));
  await assertFails(deleteDoc(doc(member, 'roomAuthorities', 'auth-room')));

  // The server/Admin path (rules disabled) still reads and writes.
  await testEnv.withSecurityRulesDisabled(async(context) => {
    await assertSucceeds(getDoc(doc(context.firestore(), 'roomAuthorities', 'auth-room')));
    await assertSucceeds(setDoc(doc(context.firestore(), 'roomAuthorities', 'auth-room'), {
      authorityInstanceId: 'instance-A', authorityGeneration: 2, state: 'held'
    }));
  });
});

test('membership compensation obligations are server/Admin only for every client', async() => {
  await testEnv.withSecurityRulesDisabled(async(context) => {
    await setDoc(doc(context.firestore(), 'membershipCompensations', 'comp-room_user-1'), {
      roomId: 'comp-room', userId: 'user-1', reason: 'postgrant_abort'
    });
  });

  // Unauthenticated: read/create/update/delete denied.
  const anon = testEnv.unauthenticatedContext().firestore();
  await assertFails(getDoc(doc(anon, 'membershipCompensations', 'comp-room_user-1')));
  await assertFails(setDoc(doc(anon, 'membershipCompensations', 'anon-comp'), { roomId: 'r', userId: 'u' }));
  await assertFails(updateDoc(doc(anon, 'membershipCompensations', 'comp-room_user-1'), { reason: 'x' }));
  await assertFails(deleteDoc(doc(anon, 'membershipCompensations', 'comp-room_user-1')));

  // Authenticated ordinary user and the implicated member UID: same denies.
  const ordinary = userDb('ordinary-comp');
  await assertFails(getDoc(doc(ordinary, 'membershipCompensations', 'comp-room_user-1')));
  await assertFails(setDoc(doc(ordinary, 'membershipCompensations', 'ordinary-comp'), { roomId: 'r', userId: 'u' }));
  await assertFails(updateDoc(doc(ordinary, 'membershipCompensations', 'comp-room_user-1'), { reason: 'x' }));
  await assertFails(deleteDoc(doc(ordinary, 'membershipCompensations', 'comp-room_user-1')));

  const member = userDb('user-1');
  await assertFails(getDoc(doc(member, 'membershipCompensations', 'comp-room_user-1')));
  await assertFails(deleteDoc(doc(member, 'membershipCompensations', 'comp-room_user-1')));

  // The server/Admin path (rules disabled) still reads and writes.
  await testEnv.withSecurityRulesDisabled(async(context) => {
    await assertSucceeds(getDoc(doc(context.firestore(), 'membershipCompensations', 'comp-room_user-1')));
    await assertSucceeds(deleteDoc(doc(context.firestore(), 'membershipCompensations', 'comp-room_user-1')));
  });
});

test('character states and personal room state remain owner-only', async() => {
  await testEnv.withSecurityRulesDisabled(async(context) => {
    await setDoc(doc(context.firestore(), 'users', 'owner-s', 'characterStates', 'c-1'), {
      inventory: { items: [] }
    });
    await setDoc(doc(context.firestore(), 'users', 'owner-s', 'roomStates', 'r-1'), { cached: true });
  });
  await assertSucceeds(getDoc(doc(userDb('owner-s'), 'users', 'owner-s', 'characterStates', 'c-1')));
  await assertFails(getDoc(doc(userDb('foreign-s'), 'users', 'owner-s', 'characterStates', 'c-1')));
  await assertFails(getDoc(doc(userDb('foreign-s'), 'users', 'owner-s', 'roomStates', 'r-1')));
});
