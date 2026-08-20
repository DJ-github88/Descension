/**
 * Media Storage Service
 *
 * Central handler for all user-uploaded media (plot banners, campaign journal
 * imagery, location/custom maps, lore artwork, NPC portraits, board
 * backgrounds). Uploads go to Firebase Storage under media/{userId}/{category}/
 * and are counted against the user's storage quota via storageLimitService.
 *
 * Guests / offline / dev users fall back to base64 data URLs so local flows
 * keep working without cloud persistence.
 */

import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
  getMetadata
} from 'firebase/storage';
import { storage, isFirebaseConfigured, isDemoMode, isMockOrDevUser, auth } from '../../config/firebase';
import storageLimitService, { ITEM_SIZE_LIMITS } from './storageLimitService';

// Storage categories → path segment under media/{userId}/
export const MEDIA_CATEGORIES = {
  BANNER: 'banners',
  MAP: 'maps',
  JOURNAL: 'journal',
  PORTRAIT: 'portraits',
  LORE: 'lore',
  BOARD_BACKGROUND: 'board-backgrounds',
  MISC: 'misc'
};

const VALID_CATEGORIES = Object.values(MEDIA_CATEGORIES);
const MAX_IMAGE_SIZE = ITEM_SIZE_LIMITS.MAX_IMAGE_SIZE; // 5MB

/**
 * Check whether cloud uploads are possible for this user
 */
export function isCloudMediaAvailable(userId) {
  if (!isFirebaseConfigured || isDemoMode || !storage || !auth?.currentUser) return false;
  if (!userId || userId.startsWith('guest-') || isMockOrDevUser(userId)) return false;
  return true;
}

function validateImageFile(file) {
  if (!file) throw new Error('No file provided');

  const isImage = (file.type && file.type.startsWith('image/')) || /^\.(png|jpe?g|gif|webp|bmp|svg)$/i.test(file.name || '');
  if (!isImage) {
    throw new Error('File must be an image (PNG, JPG, GIF, WebP)');
  }

  if (file.size > MAX_IMAGE_SIZE) {
    throw new Error(`Image too large: ${(file.size / (1024 * 1024)).toFixed(1)}MB (max: ${MAX_IMAGE_SIZE / (1024 * 1024)}MB)`);
  }

  return true;
}

function buildStorageFileName(file, category) {
  const ext = (file.name && file.name.includes('.'))
    ? file.name.split('.').pop().toLowerCase()
    : (file.type && file.type.split('/')[1]) || 'png';
  const rand = Math.random().toString(36).substring(2, 9);
  return `${category}_${Date.now()}_${rand}.${ext}`;
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
 * Upload an image to Firebase Storage under media/{userId}/{category}/
 * Enforces quota and records usage in users/{userId}.storageUsage.mediaFiles.
 *
 * @returns {Promise<{success: boolean, url?: string, storagePath?: string, size?: number, error?: string}>}
 */
export async function uploadMediaImage(userId, file, options = {}) {
  try {
    const category = VALID_CATEGORIES.includes(options.category) ? options.category : MEDIA_CATEGORIES.MISC;

    if (!isCloudMediaAvailable(userId)) {
      return { success: false, error: 'Cloud storage unavailable', localOnly: true };
    }

    validateImageFile(file);

    const allowed = await storageLimitService.canStoreData(userId, file.size, 'mediaFiles');
    if (!allowed) {
      return { success: false, error: 'Storage quota exceeded. Remove some media or upgrade your tier.' };
    }

    const fileName = options.fileName || buildStorageFileName(file, category);
    const storagePath = `media/${userId}/${category}/${fileName}`;

    const storageRef = ref(storage, storagePath);
    await uploadBytes(storageRef, file, { contentType: file.type || 'image/png' });

    const url = await getDownloadURL(storageRef);

    try {
      await storageLimitService.updateStorageUsage(userId, 'mediaFiles', file.size);
    } catch (usageError) {
      console.warn('Failed to record media usage (upload succeeded):', usageError);
    }

    return { success: true, url, storagePath, size: file.size };
  } catch (error) {
    console.error('Error uploading media image:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Extract the storage object path from a Firebase download URL.
 * Returns null for data URLs / external URLs.
 */
export function extractStoragePathFromUrl(url) {
  if (!url || typeof url !== 'string' || url.startsWith('data:')) return null;
  try {
    const marker = '/o/';
    const idx = url.indexOf(marker);
    if (idx === -1) return null;
    const raw = url.substring(idx + marker.length).split('?')[0];
    return decodeURIComponent(raw);
  } catch {
    return null;
  }
}

/**
 * Delete a media object from Firebase Storage by its download URL.
 * Only touches objects under media/{userId}/. Decrements recorded usage.
 */
export async function deleteMediaByUrl(userId, url) {
  try {
    const storagePath = extractStoragePathFromUrl(url);
    if (!storagePath || !storagePath.startsWith(`media/${userId}/`)) {
      return { success: false, skipped: true };
    }
    if (!storage) {
      return { success: false, error: 'Firebase Storage not available' };
    }

    const storageRef = ref(storage, storagePath);

    let size = 0;
    try {
      const metadata = await getMetadata(storageRef);
      size = metadata.size || 0;
    } catch {
      // Metadata unavailable (already deleted / permissions) — still attempt delete
    }

    await deleteObject(storageRef);

    if (size > 0) {
      try {
        await storageLimitService.updateStorageUsage(userId, 'mediaFiles', -size);
      } catch (usageError) {
        console.warn('Failed to decrement media usage:', usageError);
      }
    }

    return { success: true };
  } catch (error) {
    if (error?.code === 'storage/object-not-found') {
      return { success: true, alreadyGone: true };
    }
    console.error('Error deleting media:', error);
    return { success: false, error: error.message };
  }
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
