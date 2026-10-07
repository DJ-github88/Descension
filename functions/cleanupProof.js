/**
 * Project 4 — destructive Storage cleanup proof.
 *
 * Pure, dependency-free decision logic. A Firestore document disappearing is
 * a trigger to EVALUATE deletion, never proof of ownership. Automatic deletion
 * requires a complete, owner-bound cleanup descriptor plus a matching object
 * generation. Any missing or conflicting evidence means NO DELETE.
 */

'use strict';

const OWNER_PATH_PREFIXES = ['users/', 'avatars/', 'audio/', 'media/'];
const FORBIDDEN_PATH_PREFIXES = ['shared/', 'system-assets/'];

const OWNER_ID_PATTERN = /^[A-Za-z0-9_-]{1,128}$/;

const CLEANUP_CODES = Object.freeze({
  ALLOWED: 'cleanup_allowed',
  OWNER_UNVERIFIED: 'asset_owner_unverified',
  BUCKET_UNVERIFIED: 'asset_bucket_unverified',
  NOT_EXCLUSIVE: 'asset_not_exclusive',
  GENERATION_CHANGED: 'asset_generation_changed',
  PATH_INVALID: 'asset_path_invalid',
  FORBIDDEN_PATH: 'asset_path_forbidden',
  SOURCE_MISMATCH: 'asset_source_mismatch',
  DESCRIPTOR_INVALID: 'asset_descriptor_invalid'
});

/**
 * Parse a canonical storage path of the form {base}/{owner}/{...}
 * Returns { ownerUserId, base } or { forbidden } or null.
 */
function parseOwnerPath(path) {
  if (typeof path !== 'string' || path.length === 0 || path.length > 1024) return null;
  if (path.startsWith('/') || path.includes('..') || path.includes('?') || path.includes('#')) return null;
  for (const prefix of FORBIDDEN_PATH_PREFIXES) {
    if (path.startsWith(prefix)) return { forbidden: prefix };
  }
  const segments = path.split('/');
  if (segments.length < 3) return null;
  const base = `${segments[0]}/`;
  if (!OWNER_PATH_PREFIXES.includes(base)) return null;
  const ownerUserId = segments[1];
  if (!ownerUserId || !OWNER_ID_PATTERN.test(ownerUserId)) return null;
  return { ownerUserId, base };
}

/**
 * Extract the trusted owner of a deletion source document.
 * Returns a UID string or null when ownership is absent/unverifiable.
 */
function deriveSourceOwner(sourceType, sourceDoc, params = {}) {
  if (!sourceDoc || typeof sourceDoc !== 'object') return null;
  if (sourceType === 'character') {
    const owner = sourceDoc.metadata && sourceDoc.metadata.userId;
    return typeof owner === 'string' && owner.length > 0 ? owner : null;
  }
  if (sourceType === 'customMap') {
    return typeof params.userId === 'string' && params.userId.length > 0 ? params.userId : null;
  }
  if (sourceType === 'room') {
    return typeof sourceDoc.gmId === 'string' && sourceDoc.gmId.length > 0 ? sourceDoc.gmId : null;
  }
  // Top-level legacy campaigns have no trustworthy owner contract in P4.
  return null;
}

function isPositiveGeneration(generation) {
  if (typeof generation === 'number') return Number.isSafeInteger(generation) && generation > 0;
  if (typeof generation === 'string') return /^[0-9]+$/.test(generation) && generation !== '0';
  return false;
}

/**
 * Validate one cleanup descriptor against every frozen proof requirement.
 * @returns {{allowed: boolean, code: string, reason?: string}}
 */
function validateDeleteCandidate({ descriptor, sourceDocumentPath, sourceOwner, configuredBucket, objectMetadata }) {
  if (!descriptor || typeof descriptor !== 'object' || Array.isArray(descriptor)) {
    return { allowed: false, code: CLEANUP_CODES.DESCRIPTOR_INVALID, reason: 'descriptor_missing' };
  }

  if (typeof descriptor.bucket !== 'string' || descriptor.bucket.length === 0
    || typeof configuredBucket !== 'string' || descriptor.bucket !== configuredBucket) {
    return { allowed: false, code: CLEANUP_CODES.BUCKET_UNVERIFIED, reason: 'bucket_mismatch' };
  }

  const parsed = parseOwnerPath(descriptor.path);
  if (!parsed) {
    return { allowed: false, code: CLEANUP_CODES.PATH_INVALID, reason: 'path_invalid' };
  }
  if (parsed.forbidden) {
    return { allowed: false, code: CLEANUP_CODES.FORBIDDEN_PATH, reason: `forbidden_prefix:${parsed.forbidden}` };
  }

  if (typeof descriptor.ownerUserId !== 'string' || descriptor.ownerUserId.length === 0) {
    return { allowed: false, code: CLEANUP_CODES.OWNER_UNVERIFIED, reason: 'descriptor_owner_missing' };
  }
  if (!sourceOwner || descriptor.ownerUserId !== sourceOwner) {
    return { allowed: false, code: CLEANUP_CODES.OWNER_UNVERIFIED, reason: 'source_owner_mismatch' };
  }
  if (parsed.ownerUserId !== descriptor.ownerUserId) {
    return { allowed: false, code: CLEANUP_CODES.OWNER_UNVERIFIED, reason: 'path_owner_mismatch' };
  }

  // Source-document binding is mandatory: every descriptor must prove the
  // exact source document it was minted for.
  if (typeof descriptor.source !== 'string' || descriptor.source.length === 0) {
    return { allowed: false, code: CLEANUP_CODES.SOURCE_MISMATCH, reason: 'source_binding_missing' };
  }
  if (descriptor.source !== sourceDocumentPath) {
    return { allowed: false, code: CLEANUP_CODES.SOURCE_MISMATCH, reason: 'source_document_mismatch' };
  }

  if (descriptor.exclusive !== true) {
    return { allowed: false, code: CLEANUP_CODES.NOT_EXCLUSIVE, reason: 'exclusivity_not_proven' };
  }

  if (!isPositiveGeneration(descriptor.generation)) {
    return { allowed: false, code: CLEANUP_CODES.DESCRIPTOR_INVALID, reason: 'generation_missing' };
  }

  if (!objectMetadata || typeof objectMetadata !== 'object') {
    return { allowed: false, code: CLEANUP_CODES.OWNER_UNVERIFIED, reason: 'object_metadata_missing' };
  }

  const objectGeneration = normalizeGeneration(objectMetadata.generation);
  const expectedGeneration = String(descriptor.generation);
  if (objectGeneration === null) {
    return { allowed: false, code: CLEANUP_CODES.OWNER_UNVERIFIED, reason: 'object_generation_unreadable' };
  }
  if (objectGeneration !== expectedGeneration) {
    return { allowed: false, code: CLEANUP_CODES.GENERATION_CHANGED, reason: 'generation_mismatch' };
  }

  const metadataOwner = objectMetadata.metadata && objectMetadata.metadata.userId;
  if (typeof metadataOwner === 'string' && metadataOwner.length > 0 && metadataOwner !== descriptor.ownerUserId) {
    return { allowed: false, code: CLEANUP_CODES.OWNER_UNVERIFIED, reason: 'object_metadata_owner_mismatch' };
  }

  return { allowed: true, code: CLEANUP_CODES.ALLOWED };
}

function normalizeGeneration(value) {
  if (value === undefined || value === null) return null;
  const asString = String(value);
  return /^[0-9]+$/.test(asString) && asString !== '0' ? asString : null;
}

module.exports = {
  CLEANUP_CODES,
  OWNER_PATH_PREFIXES,
  FORBIDDEN_PATH_PREFIXES,
  parseOwnerPath,
  deriveSourceOwner,
  validateDeleteCandidate,
  normalizeGeneration
};
