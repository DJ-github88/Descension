/**
 * Map Image Preloader Utility & Memory Cache
 * 
 * Preloads high-resolution world map assets and subrealm images asynchronously into
 * browser RAM memory. Eliminates flickering, delay, and black frames when zooming or switching maps.
 */

const imageCache = new Map();
const preloadPromises = new Map();

/**
 * Preloads a single image URL into memory and decodes it.
 * @param {string} src 
 * @returns {Promise<HTMLImageElement>}
 */
export const preloadImage = (src) => {
  if (!src) return Promise.resolve(null);
  
  if (imageCache.has(src)) {
    return Promise.resolve(imageCache.get(src));
  }

  if (preloadPromises.has(src)) {
    return preloadPromises.get(src);
  }

  const promise = new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';

    img.onload = () => {
      if (img.decode) {
        img.decode()
          .then(() => {
            imageCache.set(src, img);
            preloadPromises.delete(src);
            resolve(img);
          })
          .catch(() => {
            imageCache.set(src, img);
            preloadPromises.delete(src);
            resolve(img);
          });
      } else {
        imageCache.set(src, img);
        preloadPromises.delete(src);
        resolve(img);
      }
    };

    img.onerror = () => {
      preloadPromises.delete(src);
      resolve(null);
    };

    img.src = src;
  });

  preloadPromises.set(src, promise);
  return promise;
};

/**
 * Preloads all primary map assets in the background during idle time.
 */
export const preloadMapAssets = () => {
  const publicUrl = process.env.PUBLIC_URL || '';
  const mapUrls = [
    `${publicUrl}/assets/images/backgrounds/Mythril.jpeg`,
    `${publicUrl}/assets/images/backgrounds/nordhalla.jpeg`,
    `${publicUrl}/assets/images/watercolor_map.png`
  ];

  const doPreload = () => {
    mapUrls.forEach(url => preloadImage(url));
  };

  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(doPreload, { timeout: 3000 });
  } else {
    setTimeout(doPreload, 500);
  }
};

/**
 * Checks if an image is already fully loaded in memory cache.
 * @param {string} src 
 * @returns {boolean}
 */
export const isImageCached = (src) => {
  return imageCache.has(src);
};
