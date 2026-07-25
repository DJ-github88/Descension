/**
 * Calculates the exact zoom scale and pixel offset (posX, posY) of the scrolling
 * background map on the landing page relative to the screen viewport.
 * Uses element-relative client bounds and scroll offsets for 100% pixel-perfect 1:1 alignment.
 */
export function getCurrentMapTransform(el) {
  const W = document.documentElement.clientWidth || window.innerWidth;
  const H = document.documentElement.clientHeight || window.innerHeight;
  const scrollY = window.scrollY || window.pageYOffset || 0;
  const scrollX = window.scrollX || window.pageXOffset || 0;
  const mapWidth = 4096;
  const mapHeight = 3072;

  const defaultScale = Math.max(W / mapWidth, H / mapHeight);
  const defaultTransform = {
    scale: defaultScale,
    posX: (W - mapWidth * defaultScale) / 2,
    posY: (H - mapHeight * defaultScale) / 2
  };

  if (!el || typeof window === 'undefined') {
    return defaultTransform;
  }

  try {
    const elW = el.clientWidth || W;
    const elH = el.clientHeight || H;

    const cs = window.getComputedStyle(el);
    const rawPos = cs.backgroundPosition || '0% 0%';
    const rawSize = cs.backgroundSize || 'auto 340%';

    // 1. Determine rendered map height and width relative to element height
    const sizeParts = rawSize.split(',')[0].trim().split(/\s+/);
    let imgH = 3.4 * elH;
    let imgW = imgH * (mapWidth / mapHeight);

    if (sizeParts.length >= 2) {
      const sY = sizeParts[1];
      if (sY.endsWith('px')) {
        imgH = parseFloat(sY);
        imgW = imgH * (mapWidth / mapHeight);
      } else if (sY.endsWith('%')) {
        imgH = (parseFloat(sY) / 100) * elH;
        imgW = imgH * (mapWidth / mapHeight);
      }
    }

    const scale = imgH / mapHeight;

    // 2. Parse position of first layer
    const firstPos = rawPos.split(',')[0].trim();
    const posParts = firstPos.split(/\s+/);

    let posX = 0;
    let posY = 0;

    if (posParts.length >= 1) {
      const strX = posParts[0];
      const strY = posParts[1] || strX;

      if (strX.endsWith('%')) {
        const pctX = parseFloat(strX) / 100;
        posX = -pctX * (imgW - elW);
      } else if (strX.endsWith('px')) {
        posX = parseFloat(strX);
      } else if (strX === 'center') {
        posX = -0.5 * (imgW - elW);
      } else if (strX === 'left') {
        posX = 0;
      } else if (strX === 'right') {
        posX = -(imgW - elW);
      }

      if (strY.endsWith('%')) {
        const pctY = parseFloat(strY) / 100;
        posY = -pctY * (imgH - elH);
      } else if (strY.endsWith('px')) {
        posY = parseFloat(strY);
      } else if (strY === 'center') {
        posY = -0.5 * (imgH - elH);
      } else if (strY === 'top') {
        posY = 0;
      } else if (strY === 'bottom') {
        posY = -(imgH - elH);
      }
    }

    // Convert from element-relative offset to screen viewport offset
    posX = posX - scrollX;
    posY = posY - scrollY;

    if (!isFinite(scale) || scale <= 0 || !isFinite(posX) || !isFinite(posY)) {
      return defaultTransform;
    }

    return { scale, posX, posY };
  } catch (err) {
    console.warn('Error computing map transform:', err);
    return defaultTransform;
  }
}
