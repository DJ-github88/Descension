/**
 * Media Storage Service
 *
 * Handler for all user-uploaded media (plot banners, campaign journal
 * imagery, location/custom maps, lore artwork, NPC portraits, board
 * backgrounds).
 *
 * Delegated to the centralized `uploadService` which enforces WebP conversion,
 * immutable cache headers, tier quotas, and per-user storage isolation.
 */

import uploadService, { UPLOAD_CATEGORIES, isCloudStorageAvailable, extractStoragePath, deleteAsset } from './uploadService';

// Storage categories → path segment under users/{userId}/
export const MEDIA_CATEGORIES = {
  BANNER: UPLOAD_CATEGORIES.BANNER,
  MAP: UPLOAD_CATEGORIES.BATTLEMAP,
  JOURNAL: UPLOAD_CATEGORIES.JOURNAL,
  PORTRAIT: UPLOAD_CATEGORIES.PORTRAIT,
  LORE: UPLOAD_CATEGORIES.LORE,
  BOARD_BACKGROUND: UPLOAD_CATEGORIES.SCENE,
  MISC: UPLOAD_CATEGORIES.MISC
};

/**
 * Check whether cloud uploads are possible for this user
 */
export function isCloudMediaAvailable(userId) {
  return isCloudStorageAvailable(userId);
}

/**
 * Read a File/Blob as a base64 data URL (guest/local fallback)
 */
export function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.FileReader) {
      return reject(new Error('FileReader not supported'));
    }
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error || new Error('Failed to read file'));
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(file);
  });
}

/**
 * Upload an image to Firebase Storage with automatic WebP conversion and caching headers.
 *
 * @returns {Promise<{success: boolean, url?: string, storagePath?: string, size?: number, error?: string, localOnly?: boolean}>}
 */
export async function uploadMediaImage(userId, file, options = {}) {
  const category = options.category || MEDIA_CATEGORIES.MISC;
  const result = await uploadService.uploadAsset(userId, file, category, options);

  return {
    success: result.success,
    url: result.url,
    storagePath: result.storagePath,
    size: result.sizeBytes,
    error: result.error,
    localOnly: result.localOnly
  };
}

/**
 * Extract storage object path from a URL.
 */
export function extractStoragePathFromUrl(url) {
  return extractStoragePath(url);
}

/**
 * Delete a media object from Firebase Storage by its download URL.
 */
export async function deleteMediaByUrl(userId, url) {
  return deleteAsset(userId, url);
}

const mediaStorageService = {
  isCloudMediaAvailable,
  uploadMediaImage,
  deleteMediaByUrl,
  extractStoragePathFromUrl,
  readFileAsDataUrl,
  MEDIA_CATEGORIES
};

export default mediaStorageService;
