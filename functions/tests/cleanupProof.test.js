'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');

const {
  CLEANUP_CODES,
  parseOwnerPath,
  deriveSourceOwner,
  validateDeleteCandidate
} = require('../cleanupProof');

const BUCKET = 'mythrill.appspot.com';

function validDescriptor(overrides = {}) {
  return {
    bucket: BUCKET,
    path: 'users/uid-1/portraits/portrait_abc.webp',
    ownerUserId: 'uid-1',
    generation: '12345',
    exclusive: true,
    source: 'characters/char-1',
    ...overrides
  };
}

function validMetadata(overrides = {}) {
  return {
    generation: '12345',
    metadata: { userId: 'uid-1' },
    ...overrides
  };
}

test('owner path parsing accepts canonical UID paths', () => {
  assert.deepEqual(parseOwnerPath('users/uid-1/portraits/a.webp'), { ownerUserId: 'uid-1', base: 'users/' });
  assert.deepEqual(parseOwnerPath('avatars/uid-1/a.png'), { ownerUserId: 'uid-1', base: 'avatars/' });
  assert.deepEqual(parseOwnerPath('audio/uid-1/a.mp3'), { ownerUserId: 'uid-1', base: 'audio/' });
  assert.deepEqual(parseOwnerPath('media/uid-1/a.png'), { ownerUserId: 'uid-1', base: 'media/' });
});

test('owner path parsing refuses shared/system/ambiguous paths', () => {
  assert.equal(parseOwnerPath('shared/uid-1/portraits/a.webp').forbidden, 'shared/');
  assert.equal(parseOwnerPath('system-assets/tokens/a.webp').forbidden, 'system-assets/');
  assert.equal(parseOwnerPath('/users/uid-1/a.webp'), null);
  assert.equal(parseOwnerPath('users/uid-1/../../etc/passwd'), null);
  assert.equal(parseOwnerPath('https://example.com/o/users%2Fuid-1%2Fa.webp'), null);
  assert.equal(parseOwnerPath('users/uid-1'), null);
});

test('source owner derivation is restricted to trustworthy fields', () => {
  assert.equal(deriveSourceOwner('character', { metadata: { userId: 'u1' } }), 'u1');
  assert.equal(deriveSourceOwner('character', { avatarUrl: 'users/u1/a.webp' }), null);
  assert.equal(deriveSourceOwner('customMap', {}, { userId: 'u2' }), 'u2');
  assert.equal(deriveSourceOwner('customMap', { originalUserId: 'u2' }, {}), null);
  assert.equal(deriveSourceOwner('room', { gmId: 'u3' }), 'u3');
  assert.equal(deriveSourceOwner('campaign', { ownerId: 'u4' }), null);
});

test('fully proven owner-bound cleanup is allowed', () => {
  const decision = validateDeleteCandidate({
    descriptor: validDescriptor(),
    sourceDocumentPath: 'characters/char-1',
    sourceOwner: 'uid-1',
    configuredBucket: BUCKET,
    objectMetadata: validMetadata()
  });
  assert.equal(decision.allowed, true, decision.reason);
  assert.equal(decision.code, CLEANUP_CODES.ALLOWED);
});

test('foreign owner is refused', () => {
  const decision = validateDeleteCandidate({
    descriptor: validDescriptor(),
    sourceDocumentPath: 'characters/char-1',
    sourceOwner: 'uid-other',
    configuredBucket: BUCKET,
    objectMetadata: validMetadata()
  });
  assert.equal(decision.allowed, false);
  assert.equal(decision.code, CLEANUP_CODES.OWNER_UNVERIFIED);
});

test('unknown owner is refused', () => {
  const decision = validateDeleteCandidate({
    descriptor: validDescriptor(),
    sourceDocumentPath: 'characters/char-1',
    sourceOwner: null,
    configuredBucket: BUCKET,
    objectMetadata: validMetadata()
  });
  assert.equal(decision.allowed, false);
  assert.equal(decision.code, CLEANUP_CODES.OWNER_UNVERIFIED);
});

test('shared and system paths are refused', () => {
  for (const path of ['shared/uid-1/a.webp', 'system-assets/tokens/a.webp']) {
    const decision = validateDeleteCandidate({
      descriptor: validDescriptor({ path }),
      sourceDocumentPath: 'characters/char-1',
      sourceOwner: 'uid-1',
      configuredBucket: BUCKET,
      objectMetadata: validMetadata()
    });
    assert.equal(decision.allowed, false, path);
    assert.equal(decision.code, CLEANUP_CODES.FORBIDDEN_PATH, path);
  }
});

test('wrong bucket is refused', () => {
  const decision = validateDeleteCandidate({
    descriptor: validDescriptor({ bucket: 'other-bucket' }),
    sourceDocumentPath: 'characters/char-1',
    sourceOwner: 'uid-1',
    configuredBucket: BUCKET,
    objectMetadata: validMetadata()
  });
  assert.equal(decision.allowed, false);
  assert.equal(decision.code, CLEANUP_CODES.BUCKET_UNVERIFIED);
});

test('missing exclusivity is refused', () => {
  const decision = validateDeleteCandidate({
    descriptor: validDescriptor({ exclusive: false }),
    sourceDocumentPath: 'characters/char-1',
    sourceOwner: 'uid-1',
    configuredBucket: BUCKET,
    objectMetadata: validMetadata()
  });
  assert.equal(decision.allowed, false);
  assert.equal(decision.code, CLEANUP_CODES.NOT_EXCLUSIVE);
});

test('changed object generation is refused (replacement survives)', () => {
  const decision = validateDeleteCandidate({
    descriptor: validDescriptor(),
    sourceDocumentPath: 'characters/char-1',
    sourceOwner: 'uid-1',
    configuredBucket: BUCKET,
    objectMetadata: validMetadata({ generation: '99999' })
  });
  assert.equal(decision.allowed, false);
  assert.equal(decision.code, CLEANUP_CODES.GENERATION_CHANGED);
});

test('source document mismatch is refused', () => {
  const decision = validateDeleteCandidate({
    descriptor: validDescriptor({ source: 'characters/other' }),
    sourceDocumentPath: 'characters/char-1',
    sourceOwner: 'uid-1',
    configuredBucket: BUCKET,
    objectMetadata: validMetadata()
  });
  assert.equal(decision.allowed, false);
  assert.equal(decision.code, CLEANUP_CODES.SOURCE_MISMATCH);
});

test('missing source binding is refused (all proof required)', () => {
  const d = validDescriptor();
  delete d.source;
  const decision = validateDeleteCandidate({
    descriptor: d,
    sourceDocumentPath: 'characters/char-1',
    sourceOwner: 'uid-1',
    configuredBucket: BUCKET,
    objectMetadata: validMetadata()
  });
  assert.equal(decision.allowed, false);
  assert.equal(decision.code, CLEANUP_CODES.SOURCE_MISMATCH);
  assert.equal(decision.reason, 'source_binding_missing');
});

test('path owner mismatch is refused', () => {
  const decision = validateDeleteCandidate({
    descriptor: validDescriptor({ path: 'users/other-uid/portraits/a.webp' }),
    sourceDocumentPath: 'characters/char-1',
    sourceOwner: 'uid-1',
    configuredBucket: BUCKET,
    objectMetadata: validMetadata()
  });
  assert.equal(decision.allowed, false);
  assert.equal(decision.code, CLEANUP_CODES.OWNER_UNVERIFIED);
});

test('malformed paths and missing generation are refused', () => {
  const malformed = validateDeleteCandidate({
    descriptor: validDescriptor({ path: 'https://evil.example/o/users%2Fuid-1%2Fa.webp' }),
    sourceDocumentPath: 'characters/char-1',
    sourceOwner: 'uid-1',
    configuredBucket: BUCKET,
    objectMetadata: validMetadata()
  });
  assert.equal(malformed.allowed, false);

  const noGeneration = validateDeleteCandidate({
    descriptor: validDescriptor({ generation: undefined }),
    sourceDocumentPath: 'characters/char-1',
    sourceOwner: 'uid-1',
    configuredBucket: BUCKET,
    objectMetadata: validMetadata()
  });
  assert.equal(noGeneration.allowed, false);
});

test('object custom-metadata owner mismatch is refused', () => {
  const decision = validateDeleteCandidate({
    descriptor: validDescriptor(),
    sourceDocumentPath: 'characters/char-1',
    sourceOwner: 'uid-1',
    configuredBucket: BUCKET,
    objectMetadata: validMetadata({ metadata: { userId: 'uid-other' } })
  });
  assert.equal(decision.allowed, false);
  assert.equal(decision.code, CLEANUP_CODES.OWNER_UNVERIFIED);
});

test('arbitrary URL-derived references cannot pass the descriptor contract', () => {
  const decision = validateDeleteCandidate({
    descriptor: {
      // An old-style URL-shaped value is not a descriptor at all.
      url: 'https://firebasestorage.googleapis.com/v0/b/x/o/users%2Fuid-1%2Fa.webp?alt=media',
      bucket: BUCKET
    },
    sourceDocumentPath: 'characters/char-1',
    sourceOwner: 'uid-1',
    configuredBucket: BUCKET,
    objectMetadata: validMetadata()
  });
  assert.equal(decision.allowed, false);
});
