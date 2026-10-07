/**
 * Project 4 — destructive Storage cleanup orchestration.
 *
 * Dependency-injected runner so the actual trigger behaviour (duplicate
 * events, replacement generations, source mismatch, already-gone objects) can
 * be exercised against a fake bucket without any production Storage access.
 */

'use strict';

const {
  CLEANUP_CODES,
  deriveSourceOwner,
  validateDeleteCandidate
} = require('./cleanupProof');

function configuredBucketName(storage) {
  try {
    return storage.bucket().name;
  } catch {
    return null;
  }
}

async function readObjectMetadata(storage, path) {
  try {
    const bucket = storage.bucket();
    const file = bucket.file(path);
    const [metadata] = await file.getMetadata();
    return metadata || null;
  } catch (error) {
    if (error && (error.code === 404 || error.code === '404')) {return null;}
    throw error;
  }
}

async function deleteProvenObject(storage, path, generation) {
  const bucket = storage.bucket();
  const file = bucket.file(path);
  try {
    await file.delete({ ifGenerationMatch: generation });
    return { deleted: true };
  } catch (error) {
    if (error && (error.code === 404 || error.code === '404')) {
      return { deleted: false, alreadyGone: true };
    }
    throw error;
  }
}

/**
 * Evaluate and (only when fully proven) delete the descriptors attached to a
 * deleted source document. Never inspects URL fields.
 */
async function cleanupSourceAssets({ storage, sourceType, sourceDocumentPath, sourceDoc, params = {}, loggerPrefix = 'Cascade Cleanup' }) {
  const descriptors = Array.isArray(sourceDoc && sourceDoc.cleanupAssets) ? sourceDoc.cleanupAssets : [];
  if (descriptors.length === 0) {
    return { evaluated: 0, deleted: 0, refused: 0 };
  }

  const sourceOwner = deriveSourceOwner(sourceType, sourceDoc, params);
  const bucketName = configuredBucketName(storage);
  let deleted = 0;
  let refused = 0;

  for (const descriptor of descriptors) {
    try {
      const objectMetadata = descriptor && typeof descriptor.path === 'string'
        ? await readObjectMetadata(storage, descriptor.path)
        : null;

      if (!objectMetadata) {
        // Missing object is idempotent already-gone; never an error.
        continue;
      }

      const decision = validateDeleteCandidate({
        descriptor,
        sourceDocumentPath,
        sourceOwner,
        configuredBucket: bucketName,
        objectMetadata
      });

      if (!decision.allowed) {
        refused += 1;
        console.warn(`[${loggerPrefix}] Cleanup refused`, {
          path: descriptor && descriptor.path,
          code: decision.code,
          reason: decision.reason
        });
        continue;
      }

      const outcome = await deleteProvenObject(storage, descriptor.path, String(descriptor.generation));
      if (outcome.deleted) {
        deleted += 1;
      }
    } catch (error) {
      refused += 1;
      console.warn(`[${loggerPrefix}] Cleanup error (no delete)`, {
        path: descriptor && descriptor.path,
        error: error.message
      });
    }
  }

  return { evaluated: descriptors.length, deleted, refused };
}

module.exports = {
  CLEANUP_CODES,
  cleanupSourceAssets,
  readObjectMetadata,
  deleteProvenObject
};
