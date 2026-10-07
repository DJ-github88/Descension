/**
 * Centralized Upload Service
 *
 * All user asset uploads (portraits, tokens, battlemaps, scenes, banners,
 * lore graphics, journal attachments) route through this service.
 *
 * Key guarantees:
 * 1. Automatic client-side WebP compression and dimension downscaling via imageProcessor.
 * 2. Strict isolation per user: `users/{userId}/{category}/{uniqueId}.webp`.
 * 3. Immutable HTTP caching headers (`Cache-Control: public, max-age=31536000, immutable`).
 * 4. Content-hash / UUID naming for instant cache-busting on updates.
 * 5. Pre-upload tier quota verification before network transfer.
 * 6. System asset isolation (system assets reside in system-assets/ or /assets/ and never count against quota).
 */

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  getMetadata,
  getBlob
} from 'firebase/storage';
import { storage, isFirebaseConfigured, isDemoMode, isMockOrDevUser, auth } from '../../config/firebase';
import { processImage, IMAGE_PROFILES } from '../../utils/imageProcessor';
import storageLimitService from './storageLimitService';

// Standardized asset categories
export const UPLOAD_CATEGORIES = {
  PORTRAIT: 'portraits',
  TOKEN: 'tokens',
  BATTLEMAP: 'battlemaps',
  SCENE: 'scenes',
  BANNER: 'banners',
  JOURNAL: 'journal',
  LORE: 'lore',
  CUSTOM_MAP: 'custom-maps',
  CARD: 'cards',
  MISC: 'misc',
  AUDIO: 'audio'
};

// Map category to imageProcessor profile
const CATEGORY_PROFILE_MAP = {
  [UPLOAD_CATEGORIES.PORTRAIT]: 'PORTRAIT',
  [UPLOAD_CATEGORIES.TOKEN]: 'TOKEN',
  [UPLOAD_CATEGORIES.BATTLEMAP]: 'BATTLEMAP',
  [UPLOAD_CATEGORIES.SCENE]: 'SCENE',
  [UPLOAD_CATEGORIES.BANNER]: 'BANNER',
  [UPLOAD_CATEGORIES.JOURNAL]: 'DEFAULT',
  [UPLOAD_CATEGORIES.LORE]: 'DEFAULT',
  [UPLOAD_CATEGORIES.CUSTOM_MAP]: 'BATTLEMAP',
  [UPLOAD_CATEGORIES.CARD]: 'CARD',
  [UPLOAD_CATEGORIES.MISC]: 'DEFAULT'
};

/**
 * Generate a cryptographically strong UUID v4 or random hex string
 */
export function generateAssetId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Check whether cloud storage is available for this user
 */
export function isCloudStorageAvailable(userId) {
  if (!isFirebaseConfigured || isDemoMode || !storage || !auth?.currentUser) return false;
  if (!userId || userId.startsWith('guest-') || isMockOrDevUser(userId)) return false;
  return true;
}

/**
 * Distinguish System vs Custom Assets
 */
export function isSystemAsset(urlOrPath) {
  if (!urlOrPath || typeof urlOrPath !== 'string') return false;
  return (
    urlOrPath.startsWith('/assets/') ||
    urlOrPath.startsWith('/system-assets/') ||
    urlOrPath.includes('system-assets') ||
    urlOrPath.startsWith('assets/')
  );
}

/**
 * Generate system asset URL
 */
export function getSystemAssetUrl(category, assetName) {
  const cleanName = assetName.replace(/^\/+/, '');
  return `/assets/${category}/${cleanName}`;
}

/**
 * Centralized upload method for all application assets.
 *
 * @param {string} userId - User ID (UID)
 * @param {File|Blob|string} file - Image File, Blob, or raw source
 * @param {string} category - Category from UPLOAD_CATEGORIES
 * @param {Object} [options] - Optional overrides (profile, customMetadata, onProgress)
 * @returns {Promise<{ success: boolean, url: string, storagePath?: string, sizeBytes?: number, width?: number, height?: number, error?: string, localOnly?: boolean }>}
 */
export async function uploadAsset(userId, file, category = UPLOAD_CATEGORIES.MISC, options = {}) {
  try {
    if (!file) throw new Error('No file provided for upload');

    // Determine processing profile
    const profileKey = options.profile || CATEGORY_PROFILE_MAP[category] || 'DEFAULT';

    // 1. Process & compress image to WebP client-side
    let processed = await processImage(file, profileKey, options);

    // If cloud storage unavailable (Guest / Dev / Offline), return compressed WebP Data URL
    if (!isCloudStorageAvailable(userId)) {
      return {
        success: true,
        url: processed.dataUrl,
        sizeBytes: processed.sizeBytes,
        originalSizeBytes: processed.originalSizeBytes,
        reductionPercent: processed.reductionPercent,
        statsSummary: processed.statsSummary,
        width: processed.width,
        height: processed.height,
        localOnly: true
      };
    }

    // 2. Pre-upload quota check & smart quota fitting
    let canStore = await storageLimitService.canStoreData(userId, processed.sizeBytes, 'mediaFiles');
    if (!canStore) {
      // Smart quota adaptation: Check if we can squeeze the image into the remaining user quota
      try {
        const { limits } = await storageLimitService.getUserTier(userId);
        const currentUsage = await storageLimitService.getStorageUsage(userId);
        const remainingBytes = Math.max(0, limits.total - currentUsage.total);

        // If user has at least 50KB left, attempt adaptive compression to fit remaining space
        if (remainingBytes > 50 * 1024 && remainingBytes < processed.sizeBytes) {
          console.log(`[Smart Compression] Fitting image into remaining user quota: ${(remainingBytes / 1024).toFixed(1)} KB`);
          processed = await processImage(file, profileKey, {
            ...options,
            targetMaxBytes: Math.floor(remainingBytes * 0.95) // 5% safety buffer
          });
          canStore = await storageLimitService.canStoreData(userId, processed.sizeBytes, 'mediaFiles');
        }
      } catch (quotaErr) {
        console.warn('Quota adaptive check warning:', quotaErr);
      }
    }

    if (!canStore) {
      throw new Error('Storage quota exceeded. Please free up space or upgrade your subscription tier.');
    }

    // 3. Generate unique filename for cache-busting
    const assetId = generateAssetId();
    const fileName = `${category}_${assetId}.webp`;
    const storagePath = `users/${userId}/${category}/${fileName}`;

    // 4. Build immutable caching metadata
    const metadata = {
      contentType: 'image/webp',
      cacheControl: 'public, max-age=31536000, immutable',
      customMetadata: {
        userId,
        category,
        assetId,
        originalName: (file.name || 'image').slice(0, 100),
        uploadedAt: new Date().toISOString(),
        width: String(processed.width),
        height: String(processed.height),
        ...(options.customMetadata || {})
      }
    };

    // 5. Upload to Firebase Storage
    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, processed.blob, metadata);

    // 6. Retrieve persistent download URL
    const url = await getDownloadURL(storageRef);

    // 7. Track storage usage in Firestore
    try {
      await storageLimitService.updateStorageUsage(userId, 'mediaFiles', processed.sizeBytes);
    } catch (usageErr) {
      console.warn('Failed to update storage usage in Firestore:', usageErr);
    }

    return {
      success: true,
      url,
      storagePath,
      sizeBytes: processed.sizeBytes,
      originalSizeBytes: processed.originalSizeBytes,
      reductionPercent: processed.reductionPercent,
      statsSummary: processed.statsSummary,
      width: processed.width,
      height: processed.height,
      localOnly: false
    };
  } catch (error) {
    console.error(`Upload error in category [${category}]:`, error);
    return {
      success: false,
      error: error.message || 'Upload failed',
      url: null
    };
  }
}

/**
 * Extract storage path from a download URL or storage path string.
 */
export function extractStoragePath(urlOrPath) {
  if (!urlOrPath || typeof urlOrPath !== 'string') return null;
  if (urlOrPath.startsWith('data:') || isSystemAsset(urlOrPath)) return null;

  try {
    const marker = '/o/';
    const idx = urlOrPath.indexOf(marker);
    if (idx !== -1) {
      const raw = urlOrPath.substring(idx + marker.length).split('?')[0];
      return decodeURIComponent(raw);
    }
    // Might already be a storage path
    if (urlOrPath.startsWith('users/') || urlOrPath.startsWith('media/') || urlOrPath.startsWith('avatars/')) {
      return urlOrPath;
    }
  } catch {
    return null;
  }
  return null;
}

/**
 * Delete a user asset by URL or path.
 * Verifies that the resource belongs to the requesting user before deleting.
 */
export async function deleteAsset(userId, urlOrPath) {
  try {
    const storagePath = extractStoragePath(urlOrPath);
    if (!storagePath) {
      return { success: false, skipped: true, reason: 'Not a cloud storage asset' };
    }

    // Security check: Must belong to this user
    const isOwner =
      storagePath.startsWith(`users/${userId}/`) ||
      storagePath.startsWith(`media/${userId}/`) ||
      storagePath.startsWith(`avatars/${userId}/`) ||
      storagePath.startsWith(`audio/${userId}/`);

    if (!isOwner) {
      return { success: false, error: 'Unauthorized to delete this asset' };
    }

    if (!storage) {
      return { success: false, error: 'Firebase Storage not initialized' };
    }

    const storageRef = ref(storage, storagePath);

    let size = 0;
    try {
      const meta = await getMetadata(storageRef);
      size = meta.size || 0;
    } catch {
      // If metadata not available, continue deletion
    }

    await deleteObject(storageRef);

    if (size > 0) {
      try {
        await storageLimitService.updateStorageUsage(userId, 'mediaFiles', -size);
      } catch (usageErr) {
        console.warn('Failed to decrement storage usage:', usageErr);
      }
    }

    return { success: true };
  } catch (error) {
    if (error?.code === 'storage/object-not-found') {
      return { success: true, alreadyGone: true };
    }
    console.error('Error deleting asset:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Copy a private user asset (users/{uid}/...) to the public shared/ prefix so
 * community content can reference it after the private rules became
 * owner-only. Returns the original URL unchanged when there is nothing to copy
 * (data: URL, external URL, system asset, already-shared, or not owned by the
 * user).
 */
const OWNER_SOURCE_PREFIXES = ['users/', 'media/', 'avatars/', 'audio/'];

/**
 * Deliberate community publication.
 *
 * Returns a canonical authenticated storage reference (`shared/{uid}/...`)
 * rather than a bearer download URL. Consumers resolve the reference through
 * authenticated Firebase Storage SDK access (getBlob), so Storage rules are
 * the audience boundary. A failed copy aborts publication and never exposes
 * the private original.
 */
export async function copyAssetToShared(userId, sourceUrl, category = UPLOAD_CATEGORIES.MISC) {
  if (!sourceUrl || typeof sourceUrl !== 'string') return sourceUrl;

  const sourcePath = extractStoragePath(sourceUrl);
  if (!sourcePath) {
    // Only data: URLs and built-in/system assets are already approved public
    // forms. Unknown/external URLs are never passed through as publication.
    if (sourceUrl.startsWith('data:') || isSystemAsset(sourceUrl)) {return sourceUrl;}
    return null;
  }
  if (sourcePath.startsWith('shared/')) return sourcePath; // already published reference

  const ownerPath = OWNER_SOURCE_PREFIXES.some((prefix) => sourcePath.startsWith(`${prefix}${userId}/`));
  if (!ownerPath) {
    // Foreign/unknown private path: never pass it through. Consumers receive
    // null and use the built-in/default fallback.
    return null;
  }

  if (!isCloudStorageAvailable(userId) || !storage) {
    const unavailable = new Error('Art publication failed: cloud storage is unavailable');
    unavailable.code = 'publication_failed';
    throw unavailable;
  }

  try {
    const fileName = sourcePath.split('/').pop();
    const sharedPath = `shared/${userId}/${category}/${fileName}`;
    const targetRef = ref(storage, sharedPath);

    const blob = await getBlob(ref(storage, sourcePath));

    await uploadBytes(targetRef, blob, {
      contentType: blob.type || 'image/webp',
      cacheControl: 'public, max-age=31536000, immutable',
      customMetadata: {
        userId,
        category,
        originalPath: sourcePath,
        sharedAt: new Date().toISOString()
      }
    });

    return sharedPath;
  } catch (error) {
    console.warn('Art publication copy failed; publication aborted:', error?.message || error);
    const publicationError = new Error('Art publication failed: the shared copy could not be created');
    publicationError.code = 'publication_failed';
    throw publicationError;
  }
}

const resolvedAssetCache = new Map();

/**
 * Resolve an approved asset reference to a local object URL using
 * authenticated SDK bytes. Private/legacy/bearer URLs resolve to null so the
 * consumer renders the built-in/default fallback instead.
 */
export async function resolveAssetUrl(assetRef) {
  if (!assetRef || typeof assetRef !== 'string') return null;
  if (isSystemAsset(assetRef)) return assetRef;
  if (assetRef.startsWith('data:')) return assetRef;
  if (/^https?:\/\//i.test(assetRef)) return null; // legacy tokenized/external URL

  let storagePath = assetRef;
  if (!storagePath.startsWith('shared/')) {
    const extracted = extractStoragePath(assetRef);
    if (!extracted || !extracted.startsWith('shared/')) return null;
    storagePath = extracted;
  }
  if (!storage || !isFirebaseConfigured) return null;

  if (!resolvedAssetCache.has(storagePath)) {
    const pending = (async() => {
      const blob = await getBlob(ref(storage, storagePath));
      if (typeof URL !== 'undefined' && URL.createObjectURL) {
        return URL.createObjectURL(blob);
      }
      return null;
    })().catch(() => null);
    resolvedAssetCache.set(storagePath, pending);
  }
  return resolvedAssetCache.get(storagePath);
}

/**
 * Copy every listed image/asset field of an entity to the shared prefix.
 */
export async function shareEntityImages(userId, entity, category, fields = []) {
  const updated = { ...entity };
  for (const field of fields) {
    const value = updated[field];
    if (typeof value === 'string' && value) {
      updated[field] = await copyAssetToShared(userId, value, category);
    }
  }
  return updated;
}

const uploadService = {
  UPLOAD_CATEGORIES,
  uploadAsset,
  deleteAsset,
  extractStoragePath,
  isCloudStorageAvailable,
  isSystemAsset,
  getSystemAssetUrl,
  generateAssetId,
  copyAssetToShared,
  resolveAssetUrl,
  shareEntityImages
};

export default uploadService;
