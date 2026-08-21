/**
 * useMediaUpload
 *
 * Single entry point hook for all user media uploads (portraits, tokens,
 * battlemaps, banners, journal imagery, lore artwork).
 *
 * Guarantees:
 * - Automatic WebP compression and dimension downscaling
 * - Quota checking before sending bytes
 * - Immutable caching headers
 * - Safe guest/offline fallback
 */

import { useCallback, useState } from 'react';
import useAuthStore from '../store/authStore';
import uploadService, { UPLOAD_CATEGORIES, isCloudStorageAvailable } from '../services/firebase/uploadService';
import { IMAGE_PROFILES } from '../utils/imageProcessor';

export function useMediaUpload() {
  const { user } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);

  const uploadImage = useCallback(async (file, category = UPLOAD_CATEGORIES.MISC, options = {}) => {
    if (!file) return null;
    setIsUploading(true);
    setUploadError(null);

    const userId = user?.uid || (user?.isGuest ? 'guest' : null);

    try {
      const result = await uploadService.uploadAsset(userId, file, category, options);
      if (!result.success) {
        const msg = result.error || 'Upload failed';
        setUploadError(msg);
        throw new Error(msg);
      }
      return result.url;
    } catch (err) {
      setUploadError(err.message || 'Upload failed');
      throw err;
    } finally {
      setIsUploading(false);
    }
  }, [user]);

  const removeImage = useCallback(async (urlOrPath) => {
    const userId = user?.uid;
    if (!urlOrPath || !userId || user?.isGuest) return;
    try {
      await uploadService.deleteAsset(userId, urlOrPath);
    } catch (err) {
      console.error('Error removing asset:', err);
    }
  }, [user]);

  return {
    uploadImage,
    removeImage,
    isUploading,
    uploadError,
    UPLOAD_CATEGORIES,
    MEDIA_CATEGORIES: UPLOAD_CATEGORIES,
    IMAGE_PROFILES
  };
}

export default useMediaUpload;
