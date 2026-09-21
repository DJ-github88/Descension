/**
 * Cached viewport size for the full-screen canvas layers.
 *
 * Every canvas layer here is absolutely positioned and sized 100% x 100% of
 * the grid surface, so its bounding rect only changes when the window does.
 * Reading getBoundingClientRect() inside the per-frame render loops forces a
 * synchronous layout on every frame (measured as the top non-React cost in
 * token view), so cache the measured size and only re-measure when the window
 * dimensions change.
 */
const sizeCache = new WeakMap();

export function getCachedCanvasSize(canvas) {
    if (!canvas) return { width: 0, height: 0 };
    const winW = window.innerWidth;
    const winH = window.innerHeight;
    const entry = sizeCache.get(canvas);
    if (entry && entry.winW === winW && entry.winH === winH) {
        return entry.size;
    }
    const rect = canvas.getBoundingClientRect();
    const size = { width: rect.width, height: rect.height };
    sizeCache.set(canvas, { winW, winH, size });
    return size;
}

export default getCachedCanvasSize;
