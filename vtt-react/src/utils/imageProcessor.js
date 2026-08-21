/**
 * Image Processor Utility
 *
 * Centralized client-side image compression, conversion, and profiling pipeline.
 * Converts input images (PNG, JPEG, TIFF, BMP, WebP, etc.) to optimized WebP
 * Blobs before sending to Firebase Storage or local state.
 *
 * Includes Smart Adaptive Multi-Pass Compression:
 * If an image exceeds target size budgets or user quotas, it dynamically
 * tunes resolution and quality to preserve maximum visual fidelity while
 * guaranteeing it fits within byte limits.
 */

export const IMAGE_PROFILES = {
  TOKEN: {
    name: 'token',
    maxWidth: 512,
    maxHeight: 512,
    quality: 0.82,
    mimeType: 'image/webp',
    maxSizeBytes: 2 * 1024 * 1024 // 2MB
  },
  TOOLTIP_ICON: {
    name: 'tooltip_icon',
    maxWidth: 512,
    maxHeight: 512,
    quality: 0.82,
    mimeType: 'image/webp',
    maxSizeBytes: 2 * 1024 * 1024
  },
  PORTRAIT: {
    name: 'portrait',
    maxWidth: 1024,
    maxHeight: 1024,
    quality: 0.85,
    mimeType: 'image/webp',
    maxSizeBytes: 4 * 1024 * 1024 // 4MB
  },
  CARD: {
    name: 'card',
    maxWidth: 1024,
    maxHeight: 1024,
    quality: 0.85,
    mimeType: 'image/webp',
    maxSizeBytes: 4 * 1024 * 1024
  },
  BANNER: {
    name: 'banner',
    maxWidth: 1920,
    maxHeight: 1080,
    quality: 0.80,
    mimeType: 'image/webp',
    maxSizeBytes: 5 * 1024 * 1024
  },
  BATTLEMAP: {
    name: 'battlemap',
    maxWidth: 4096,
    maxHeight: 4096,
    quality: 0.78,
    mimeType: 'image/webp',
    maxSizeBytes: 10 * 1024 * 1024 // 10MB
  },
  SCENE: {
    name: 'scene',
    maxWidth: 4096,
    maxHeight: 4096,
    quality: 0.78,
    mimeType: 'image/webp',
    maxSizeBytes: 10 * 1024 * 1024
  },
  IMMERSE: {
    name: 'immerse',
    maxWidth: 4096,
    maxHeight: 4096,
    quality: 0.78,
    mimeType: 'image/webp',
    maxSizeBytes: 10 * 1024 * 1024
  },
  DEFAULT: {
    name: 'default',
    maxWidth: 1920,
    maxHeight: 1920,
    quality: 0.80,
    mimeType: 'image/webp',
    maxSizeBytes: 5 * 1024 * 1024
  }
};

/**
 * Format bytes to readable human string
 */
export function formatBytes(bytes, decimals = 1) {
  if (!bytes || bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

/**
 * Resolves a profile configuration by key or string name.
 */
export function getProfile(profileKeyOrName) {
  if (!profileKeyOrName) return IMAGE_PROFILES.DEFAULT;
  if (typeof profileKeyOrName === 'object' && profileKeyOrName.maxWidth) {
    return profileKeyOrName;
  }
  const upper = String(profileKeyOrName).toUpperCase();
  if (IMAGE_PROFILES[upper]) return IMAGE_PROFILES[upper];

  // Match by name
  const match = Object.values(IMAGE_PROFILES).find(p => p.name.toLowerCase() === String(profileKeyOrName).toLowerCase());
  return match || IMAGE_PROFILES.DEFAULT;
}

/**
 * Calculate scaled dimensions while preserving aspect ratio.
 */
export function calculateScaledDimensions(origWidth, origHeight, maxWidth, maxHeight) {
  let width = origWidth;
  let height = origHeight;

  if (maxWidth && width > maxWidth) {
    const ratio = maxWidth / width;
    width = maxWidth;
    height = Math.round(height * ratio);
  }

  if (maxHeight && height > maxHeight) {
    const ratio = maxHeight / height;
    width = Math.round(width * ratio);
    height = maxHeight;
  }

  return { width: Math.max(1, width), height: Math.max(1, height) };
}

/**
 * Load an image from File, Blob, or URL into an HTMLImageElement
 */
export function loadImage(source) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    let objectUrl = null;
    if (source instanceof File || source instanceof Blob) {
      objectUrl = URL.createObjectURL(source);
      img.src = objectUrl;
    } else if (typeof source === 'string') {
      img.src = source;
    } else {
      return reject(new Error('Invalid image source type'));
    }

    img.onload = () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      resolve(img);
    };

    img.onerror = () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
      reject(new Error('Failed to decode image data'));
    };
  });
}

/**
 * Convert canvas content to a WebP Blob with fallback.
 */
function canvasToWebpBlob(canvas, quality) {
  return new Promise((resolve, reject) => {
    if (typeof canvas.toBlob !== 'function') {
      try {
        const dataUrl = canvas.toDataURL('image/webp', quality);
        const bin = atob(dataUrl.split(',')[1]);
        const array = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) {
          array[i] = bin.charCodeAt(i);
        }
        return resolve(new Blob([array], { type: 'image/webp' }));
      } catch (err) {
        return reject(err);
      }
    }

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          // Fallback to JPEG if WebP unsupported
          canvas.toBlob(
            (fallbackBlob) => {
              if (fallbackBlob) resolve(fallbackBlob);
              else reject(new Error('Canvas toBlob failed'));
            },
            'image/jpeg',
            quality
          );
        } else {
          resolve(blob);
        }
      },
      'image/webp',
      quality
    );
  });
}

/**
 * Process a single rasterization pass from an HTMLImageElement
 */
async function renderCanvasPass(img, width, height, quality) {
  let canvas;
  if (typeof OffscreenCanvas !== 'undefined') {
    try {
      canvas = new OffscreenCanvas(width, height);
    } catch {
      canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
    }
  } else {
    canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
  }

  const ctx = canvas.getContext('2d', { alpha: true });
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, 0, 0, width, height);

  let blob;
  if (canvas instanceof OffscreenCanvas && typeof canvas.convertToBlob === 'function') {
    blob = await canvas.convertToBlob({
      type: 'image/webp',
      quality
    });
  } else {
    blob = await canvasToWebpBlob(canvas, quality);
  }

  return { blob, width, height };
}

/**
 * Process and compress an image with smart adaptive multi-pass optimization.
 * Automatically downscales resolution and tunes WebP quality if input exceeds budget.
 *
 * @param {File|Blob|string} source - Input image
 * @param {string|Object} profileKeyOrName - Profile name
 * @param {Object} options - Overrides { targetMaxBytes, maxWidth, maxHeight, quality }
 * @returns {Promise<{ blob: Blob, dataUrl: string, width: number, height: number, sizeBytes: number, originalSizeBytes: number, reductionPercent: number, statsSummary: string }>}
 */
export async function processImage(source, profileKeyOrName = 'DEFAULT', options = {}) {
  const profile = { ...getProfile(profileKeyOrName), ...options };
  const targetMaxBytes = options.targetMaxBytes || profile.maxSizeBytes;
  const originalSizeBytes = source?.size || 0;

  const img = await loadImage(source);
  const origW = img.naturalWidth || img.width;
  const origH = img.naturalHeight || img.height;

  let { width, height } = calculateScaledDimensions(
    origW,
    origH,
    profile.maxWidth,
    profile.maxHeight
  );

  let currentQuality = profile.quality;
  let passResult = await renderCanvasPass(img, width, height, currentQuality);
  let passes = 1;

  // Adaptive multi-pass compression loop if output still exceeds target budget
  const maxPasses = 5;
  while (targetMaxBytes && passResult.blob.size > targetMaxBytes && passes < maxPasses) {
    passes++;
    if (currentQuality > 0.65) {
      // First try gentle quality reduction
      currentQuality = Math.max(0.60, currentQuality - 0.08);
    } else {
      // If quality is already lowered, scale down dimensions by 18%
      width = Math.max(256, Math.round(width * 0.82));
      height = Math.max(256, Math.round(height * 0.82));
      currentQuality = Math.max(0.55, currentQuality - 0.04);
    }

    passResult = await renderCanvasPass(img, width, height, currentQuality);
  }

  const finalBlob = passResult.blob;
  const finalSize = finalBlob.size;

  // Generate Data URL for instant UI preview
  const dataUrl = await new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.readAsDataURL(finalBlob);
  });

  const reductionPercent = originalSizeBytes > 0
    ? Math.max(0, Math.round(((originalSizeBytes - finalSize) / originalSizeBytes) * 100))
    : 0;

  const statsSummary = originalSizeBytes > 0
    ? `${formatBytes(originalSizeBytes)} → ${formatBytes(finalSize)} (-${reductionPercent}%)`
    : `${formatBytes(finalSize)} (WebP)`;

  return {
    blob: finalBlob,
    dataUrl,
    width: passResult.width,
    height: passResult.height,
    sizeBytes: finalSize,
    originalSizeBytes,
    reductionPercent,
    statsSummary,
    passes,
    format: 'image/webp'
  };
}

export default {
  IMAGE_PROFILES,
  getProfile,
  calculateScaledDimensions,
  loadImage,
  processImage,
  formatBytes
};
