/**
 * ObjectCanvasRenderer - legacy compatibility shim.
 *
 * All object rendering is now performed by PixelArtRenderer, which draws each
 * object to a fixed-size 32x32 pixel-art offscreen canvas, caches the result,
 * and blits it with `imageSmoothingEnabled = false` for crisp 16-bit output.
 *
 * This module is preserved (instead of being deleted) because several other
 * files import `drawObject`, `drawObjectToImage`, and `generateAllObjectImages`
 * from it. Each of those functions is now a thin wrapper that forwards to the
 * pixel renderer. The old vector primitive implementations have been removed.
 */

import {
    drawObjectArt,
    hasObjectArt,
    ROTATABLE,
} from './PixelArtRenderer';

export { drawObjectArt as drawObjectToPixelArt };
export { hasObjectArt };
export { ROTATABLE };

export function drawObject(ctx, type, x, y, w, h) {
    if (hasObjectArt(type)) {
        drawObjectArt(ctx, type, x, y, w, h);
    }
}

export function drawObjectToImage(type, width, height) {
    if (!hasObjectArt(type)) return null;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    drawObjectArt(ctx, type, width / 2, height / 2, width, height);
    return canvas.toDataURL();
}

export function generateAllObjectImages(size = 128) {
    const images = {};
    ROTATABLE.forEach(type => {
        const dataUrl = drawObjectToImage(type, size, size);
        if (dataUrl) images[type] = dataUrl;
    });
    return images;
}

export default drawObject;
