/**
 * useMediaUpload
 *
 * Single entry point for user media uploads (banners, maps, journal imagery,
 * portraits, lore artwork). Authenticated users with Firebase available get
 * real Firebase Storage uploads counted against their quota; guests and
 * offline/local users fall back to base64 data URLs.
 *
 * Usage:
 *   const { uploadImage, removeImage, isUploading } = useMediaUpload();
 *   const url = await uploadImage(file, MEDIA_CATEGORIES.BANNER);
 *   await removeImage(oldUrl);
 */

import { useCallback, useState } from 'react';
import useAuthStore from '../store/authStore';
import mediaStorageService, { MEDIA_CATEGORIES } from '../services/firebase/mediaStorageService';

export function useMediaUpload() {
  const { user } = useAuthStore();
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = useCallback(async (file, category = MEDIA_CATEGORIES.MISC) => {
    if (!file) return null;

    const userId = user?.uid;

    if (user && !user.isGuest && mediaStorageService.isCloudMediaAvailable(userId)) {
      setIsUploading(true);
      try {
        const result = await mediaStorageService.uploadMediaImage(userId, file, { category });
        if (!result.success) {
          throw new Error(result.error || 'Upload failed');
        }
        return result.url;
      } finally {
        setIsUploading(false);
      }
    }

    // Guest / offline fallback: inline base64 data URL
    return mediaStorageService.readFileAsDataUrl(file);
  }, [user]);

  const removeImage = useCallback(async (url) => {
    const userId = user?.uid;
    if (!url || !userId || user?.isGuest) return;
    await mediaStorageService.deleteMediaByUrl(userId, url);
  }, [user]);

  return { uploadImage, removeImage, isUploading, MEDIA_CATEGORIES };
}

export default useMediaUpload;
