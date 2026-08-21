/**
 * Image Compression Utility (Legacy Adapter)
 *
 * Backwards-compatible adapter routing to the centralized `imageProcessor`.
 * Converts to WebP while respecting requested maxWidth / maxHeight / quality.
 */

import { processImage } from './imageProcessor';

/**
 * Compress an image file to reduce size and improve performance
 * @param {File|Blob} file - The image file to compress
 * @param {number} maxWidth - Maximum width in pixels (default: 800)
 * @param {number} maxHeight - Maximum height in pixels (default: null, maintains aspect ratio)
 * @param {number} quality - WebP/JPEG quality 0-1 (default: 0.8)
 * @returns {Promise<Blob>} - Compressed image as Blob
 */
export const compressImage = async (file, maxWidth = 800, maxHeight = null, quality = 0.8) => {
  const result = await processImage(file, 'DEFAULT', {
    maxWidth,
    maxHeight: maxHeight || maxWidth,
    quality
  });
  return result.blob;
};

export default compressImage;
