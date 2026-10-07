/**
 * Project 4 Storage rules emulator matrix.
 *
 * Positive/negative checks for the frozen path matrix:
 * - private owner paths are owner-only (SDK read/write/delete)
 * - reserved identity metadata cannot be spoofed, changed or removed
 * - deliberate shared copies are authenticated-read only
 * - system assets are authenticated-read and server-write only
 * - real size limits are enforced
 * - legacy paths keep owner boundaries; unknown paths default deny
 *
 * Run:  cd tests/rules && npm install && npm test:storage
 * Emulators must be reachable (FIREBASE_STORAGE_EMULATOR_HOST, default 127.0.0.1:9199).
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
  ref,
  uploadBytes,
  getBytes,
  deleteObject
} = require('firebase/storage');

const RULES = fs.readFileSync(path.resolve(__dirname, '..', '..', 'storage.rules'), 'utf8');

const PNG_BYTES = Uint8Array.from([
  0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a
]);
const OVERSIZE_BYTES = new Uint8Array(2 * 1024 * 1024 + 1024);

let testEnv;

test.before(async() => {
  testEnv = await initializeTestEnvironment({
    projectId: 'mythrill-rules-test',
    storage: { rules: RULES }
  });
});

test.after(async() => {
  if (testEnv) { await testEnv.cleanup(); }
});

const storageFor = (uid) => testEnv.authenticatedContext(uid).storage();
const anonymousStorage = () => testEnv.unauthenticatedContext().storage();

test('private user assets are owner-only for read and write', async() => {
  const ownerRef = ref(storageFor('owner-1'), 'users/owner-1/portraits/avatar.webp');
  await assertSucceeds(uploadBytes(ownerRef, PNG_BYTES, {
    contentType: 'image/webp',
    customMetadata: { userId: 'owner-1' }
  }));

  await assertSucceeds(getBytes(ref(storageFor('owner-1'), 'users/owner-1/portraits/avatar.webp')));
  await assertFails(getBytes(ref(storageFor('foreign-1'), 'users/owner-1/portraits/avatar.webp')));
  await assertFails(getBytes(ref(anonymousStorage(), 'users/owner-1/portraits/avatar.webp')));
  await assertFails(uploadBytes(ref(storageFor('foreign-1'), 'users/owner-1/portraits/other.webp'), PNG_BYTES, {
    contentType: 'image/webp'
  }));
  await assertFails(deleteObject(ref(storageFor('foreign-1'), 'users/owner-1/portraits/avatar.webp')));
});

test('reserved identity metadata cannot be spoofed, changed or removed', async() => {
  await assertFails(uploadBytes(ref(storageFor('owner-2'), 'users/owner-2/portraits/a.webp'), PNG_BYTES, {
    contentType: 'image/webp',
    customMetadata: { userId: 'someone-else' }
  }));
  await assertSucceeds(uploadBytes(ref(storageFor('owner-2'), 'users/owner-2/portraits/a.webp'), PNG_BYTES, {
    contentType: 'image/webp',
    customMetadata: { userId: 'owner-2' }
  }));
  // Legitimate uploads without reserved metadata still work.
  await assertSucceeds(uploadBytes(ref(storageFor('owner-2'), 'users/owner-2/misc/b.webp'), PNG_BYTES, {
    contentType: 'image/webp'
  }));
  // Removing or changing the stored reserved identity is denied.
  await assertFails(uploadBytes(ref(storageFor('owner-2'), 'users/owner-2/portraits/a.webp'), PNG_BYTES, {
    contentType: 'image/webp',
    customMetadata: {}
  }));
  await assertFails(uploadBytes(ref(storageFor('owner-2'), 'users/owner-2/portraits/a.webp'), PNG_BYTES, {
    contentType: 'image/webp',
    customMetadata: { userId: 'other-uid' }
  }));
  // Preserving it is allowed.
  await assertSucceeds(uploadBytes(ref(storageFor('owner-2'), 'users/owner-2/portraits/a.webp'), PNG_BYTES, {
    contentType: 'image/webp',
    customMetadata: { userId: 'owner-2', note: 'refresh' }
  }));
});

test('deliberate shared copies are authenticated-read and owner-write', async() => {
  const sharedRef = ref(storageFor('owner-3'), 'shared/owner-3/spells/icon.webp');
  await assertSucceeds(uploadBytes(sharedRef, PNG_BYTES, {
    contentType: 'image/webp',
    customMetadata: { userId: 'owner-3' }
  }));
  await assertSucceeds(getBytes(ref(storageFor('viewer-3'), 'shared/owner-3/spells/icon.webp')));
  await assertFails(getBytes(ref(anonymousStorage(), 'shared/owner-3/spells/icon.webp')));
  await assertFails(uploadBytes(ref(storageFor('viewer-3'), 'shared/owner-3/spells/icon.webp'), PNG_BYTES, {
    contentType: 'image/webp'
  }));
});

test('system assets are authenticated-read and not client-writable', async() => {
  await testEnv.withSecurityRulesDisabled(async(context) => {
    await uploadBytes(ref(context.storage(), 'system-assets/tokens/goblin.webp'), PNG_BYTES, {
      contentType: 'image/webp'
    });
  });
  await assertSucceeds(getBytes(ref(storageFor('viewer-4'), 'system-assets/tokens/goblin.webp')));
  await assertFails(getBytes(ref(anonymousStorage(), 'system-assets/tokens/goblin.webp')));
  await assertFails(uploadBytes(ref(storageFor('viewer-4'), 'system-assets/tokens/goblin.webp'), PNG_BYTES, {
    contentType: 'image/webp'
  }));
  await assertFails(deleteObject(ref(storageFor('viewer-4'), 'system-assets/tokens/goblin.webp')));
});

test('real content-type and size limits are enforced for owner uploads', async() => {
  await assertFails(uploadBytes(ref(storageFor('owner-5'), 'users/owner-5/tokens/bad.txt'), PNG_BYTES, {
    contentType: 'text/plain'
  }));
  await assertFails(uploadBytes(ref(storageFor('owner-5'), 'users/owner-5/tokens/huge.webp'), OVERSIZE_BYTES, {
    contentType: 'image/webp'
  }));
});

test('legacy paths keep owner boundaries', async() => {
  await assertSucceeds(uploadBytes(ref(storageFor('owner-6'), 'avatars/owner-6/a.png'), PNG_BYTES, {
    contentType: 'image/png'
  }));
  await assertFails(getBytes(ref(storageFor('foreign-6'), 'avatars/owner-6/a.png')));
  await assertSucceeds(uploadBytes(ref(storageFor('owner-6'), 'audio/owner-6/a.mp3'), PNG_BYTES, {
    contentType: 'audio/mpeg'
  }));
  await assertFails(getBytes(ref(storageFor('foreign-6'), 'audio/owner-6/a.mp3')));
});

test('unknown paths are denied by default', async() => {
  await assertFails(uploadBytes(ref(storageFor('owner-7'), 'arbitrary/owner-7/file.webp'), PNG_BYTES, {
    contentType: 'image/webp'
  }));
  await assertFails(getBytes(ref(storageFor('owner-7'), 'arbitrary/owner-7/file.webp')));
});
