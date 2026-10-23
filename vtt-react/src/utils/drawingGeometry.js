/**
 * Pure geometry helpers for the level-editor drawing tools.
 *
 * Everything here is free of React, the stores and the DOM so it can be unit
 * tested directly. The editor and the drawing engine inject the one piece of
 * grid knowledge these helpers need: `gridToWorldCorner(gridX, gridY)`.
 *
 * DRAWING PATH DATA MODEL
 * -----------------------
 * A drawing path is `{ id, tool, points, style, layer, text?, timestamp }`.
 * Points come in three flavours, told apart by their flags:
 *   - world   `{ worldX, worldY, isWorldCoords: true, pressure? }`
 *             free-position points. Freehand strokes and (new) un-snapped
 *             shapes use these, so they stay put when the camera moves.
 *   - grid    `{ gridX, gridY, ... }`
 *             grid-snapped shape corners (the original shape behaviour).
 *   - legacy  `{ x, y, isFreehand: true }`
 *             screen-space freehand from very old saves. It cannot be mapped
 *             to the world, so it is never hit-tested or edited here.
 *
 * Tools: freehand, line, arrow, rectangle, circle (centre + edge),
 * ellipse (bounding-box corners), polygon, text.
 */

export const FREE_SHAPE_TOOLS = ['line', 'arrow', 'rectangle', 'circle', 'ellipse', 'polygon'];

// Tools that enclose an area and can therefore take a fill colour.
export const FILLABLE_TOOLS = ['rectangle', 'circle', 'ellipse', 'polygon', 'freehand'];

export const isWorldPoint = (pt) =>
    !!pt && pt.isWorldCoords === true && Number.isFinite(pt.worldX) && Number.isFinite(pt.worldY);

export const isGridPoint = (pt) =>
    !!pt && pt.isWorldCoords !== true && !pt.isFreehand && Number.isFinite(pt.gridX) && Number.isFinite(pt.gridY);

export const isLegacyPoint = (pt) => !!pt && pt.isFreehand === true;

/** World-space {x, y} for a point, or null when it cannot be resolved. */
export function pointToWorld(pt, gridToWorldCorner) {
    if (isWorldPoint(pt)) return { x: pt.worldX, y: pt.worldY };
    if (isGridPoint(pt) && typeof gridToWorldCorner === 'function') {
        const w = gridToWorldCorner(pt.gridX, pt.gridY);
        if (w && Number.isFinite(w.x) && Number.isFinite(w.y)) return { x: w.x, y: w.y };
    }
    return null;
}

/** All of a path's points in world space (unresolvable points are dropped). */
export function pathWorldPoints(path, gridToWorldCorner) {
    if (!path || !Array.isArray(path.points)) return [];
    const out = [];
    for (const pt of path.points) {
        const w = pointToWorld(pt, gridToWorldCorner);
        if (w) {
            if (typeof pt.pressure === 'number') w.pressure = pt.pressure;
            out.push(w);
        }
    }
    return out;
}

export function boundsOf(points) {
    if (!points || points.length === 0) return null;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const p of points) {
        if (p.x < minX) minX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.x > maxX) maxX = p.x;
        if (p.y > maxY) maxY = p.y;
    }
    return { minX, minY, maxX, maxY };
}

export function distanceToSegment(px, py, ax, ay, bx, by) {
    const dx = bx - ax;
    const dy = by - ay;
    const lenSq = dx * dx + dy * dy;
    if (lenSq < 1e-12) return Math.hypot(px - ax, py - ay);
    const t = Math.max(0, Math.min(1, ((px - ax) * dx + (py - ay) * dy) / lenSq));
    return Math.hypot(px - (ax + dx * t), py - (ay + dy * t));
}

export function pointInPolygon(px, py, poly) {
    let inside = false;
    for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
        const xi = poly[i].x;
        const yi = poly[i].y;
        const xj = poly[j].x;
        const yj = poly[j].y;
        if ((yi > py) !== (yj > py) && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) {
            inside = !inside;
        }
    }
    return inside;
}

/**
 * Ramer-Douglas-Peucker simplification (iterative, so a long stroke cannot
 * overflow the call stack). Works on {x, y} points and keeps every other
 * field of the surviving points (pressure, etc.).
 */
export function simplifyPolyline(points, tolerance) {
    if (!Array.isArray(points) || points.length <= 2 || !(tolerance > 0)) return points ? points.slice() : [];
    const keep = new Uint8Array(points.length);
    keep[0] = 1;
    keep[points.length - 1] = 1;
    const stack = [[0, points.length - 1]];
    while (stack.length) {
        const [start, end] = stack.pop();
        let maxDist = 0;
        let index = -1;
        const a = points[start];
        const b = points[end];
        for (let i = start + 1; i < end; i++) {
            const d = distanceToSegment(points[i].x, points[i].y, a.x, a.y, b.x, b.y);
            if (d > maxDist) {
                maxDist = d;
                index = i;
            }
        }
        if (index !== -1 && maxDist > tolerance) {
            keep[index] = 1;
            stack.push([start, index], [index, end]);
        }
    }
    const out = [];
    for (let i = 0; i < points.length; i++) if (keep[i]) out.push(points[i]);
    return out;
}

/**
 * Simplify until the polyline fits the point budget, doubling the tolerance
 * each pass. Map documents are synced whole, so one runaway stroke from a
 * 240 Hz stylus must not be able to bloat the save.
 */
export function simplifyToBudget(points, tolerance, maxPoints = 1200) {
    let tol = Math.max(tolerance, 1e-6);
    let result = simplifyPolyline(points, tol);
    let guard = 0;
    while (result.length > maxPoints && guard < 12) {
        tol *= 2;
        result = simplifyPolyline(points, tol);
        guard++;
    }
    return result;
}

export const roundTo = (value, decimals = 2) => {
    const f = Math.pow(10, decimals);
    return Math.round(value * f) / f;
};

/** True when a freehand stroke ends near where it started (a drawn loop). */
export function isClosedStroke(points, tolerance) {
    if (!points || points.length < 4) return false;
    const a = points[0];
    const b = points[points.length - 1];
    return Math.hypot(a.x - b.x, a.y - b.y) <= tolerance;
}

/** Stable positive integer for a path, used to seed Rough.js so a sketched
 *  shape does not wobble to a new outline on every repaint. */
export function strokeSeed(path) {
    const source = String((path && (path.id || path.timestamp)) || 'seed');
    let hash = 2166136261;
    for (let i = 0; i < source.length; i++) {
        hash ^= source.charCodeAt(i);
        hash = Math.imul(hash, 16777619);
    }
    return (hash >>> 0) % 2147483646 + 1;
}

/** Canvas dash pattern for a line style, scaled by the on-screen width. */
export function lineDashFor(lineStyle, widthPx) {
    const w = Math.max(1, widthPx || 1);
    switch (lineStyle) {
        case 'dashed':
            return [w * 4, w * 2.5];
        case 'dotted':
            return [0.01, w * 2.2]; // near-zero dashes + round caps = dots
        default:
            return [];
    }
}

/**
 * The two barbs of an arrow head at `tip`, pointing away from `from`.
 * Returns [{x, y}, {x, y}]; empty when the arrow has no length.
 */
export function arrowHeadPoints(from, tip, size, spread = Math.PI / 7) {
    const dx = tip.x - from.x;
    const dy = tip.y - from.y;
    if (Math.hypot(dx, dy) < 1e-6) return [];
    const angle = Math.atan2(dy, dx);
    return [angle + Math.PI - spread, angle + Math.PI + spread].map((a) => ({
        x: tip.x + Math.cos(a) * size,
        y: tip.y + Math.sin(a) * size
    }));
}

/** Axis-aligned world box of a text label (approximation without a canvas). */
export function textWorldBox(path, gridToWorldCorner) {
    const anchor = pointToWorld(path.points && path.points[0], gridToWorldCorner);
    if (!anchor) return null;
    const fontSize = (path.style && path.style.fontSize) || 16;
    const padding = 6;
    const width = String(path.text || '').length * fontSize * 0.55 + padding * 2;
    const height = fontSize * 1.2 + padding * 2;
    return { minX: anchor.x - padding, minY: anchor.y - padding, maxX: anchor.x - padding + width, maxY: anchor.y - padding + height };
}

/** Hit-test radius contributed by the stroke itself. */
const halfStroke = (path) => ((path && path.style && path.style.strokeWidth) || 2) / 2;

function cornersOf(pts) {
    const a = pts[0];
    const b = pts[pts.length - 1];
    return {
        minX: Math.min(a.x, b.x),
        maxX: Math.max(a.x, b.x),
        minY: Math.min(a.y, b.y),
        maxY: Math.max(a.y, b.y)
    };
}

function polylineHit(pts, x, y, tol, closed) {
    if (pts.length === 1) return Math.hypot(x - pts[0].x, y - pts[0].y) <= tol;
    for (let i = 0; i + 1 < pts.length; i++) {
        if (distanceToSegment(x, y, pts[i].x, pts[i].y, pts[i + 1].x, pts[i + 1].y) <= tol) return true;
    }
    if (closed && pts.length > 2) {
        const last = pts[pts.length - 1];
        if (distanceToSegment(x, y, last.x, last.y, pts[0].x, pts[0].y) <= tol) return true;
    }
    return false;
}

/**
 * Does the world point (x, y) hit the path's outline (or its text box)?
 * `tol` is the extra slop in world units (finger-sized, usually ~22px / zoom).
 */
export function hitTestPath(path, x, y, tol, gridToWorldCorner) {
    if (!path || !Array.isArray(path.points) || path.points.length === 0) return false;
    const t = tol + halfStroke(path);

    if (path.tool === 'text') {
        const box = textWorldBox(path, gridToWorldCorner);
        return !!box && x >= box.minX - tol && x <= box.maxX + tol && y >= box.minY - tol && y <= box.maxY + tol;
    }

    const pts = pathWorldPoints(path, gridToWorldCorner);
    if (pts.length === 0) return false;

    switch (path.tool) {
        case 'line':
        case 'arrow':
            return pts.length > 1 && distanceToSegment(x, y, pts[0].x, pts[0].y, pts[pts.length - 1].x, pts[pts.length - 1].y) <= t;
        case 'rectangle': {
            if (pts.length < 2) return false;
            const { minX, maxX, minY, maxY } = cornersOf(pts);
            const ring = [
                { x: minX, y: minY }, { x: maxX, y: minY }, { x: maxX, y: maxY }, { x: minX, y: maxY }
            ];
            return polylineHit(ring, x, y, t, true);
        }
        case 'circle': {
            if (pts.length < 2) return false;
            const radius = Math.hypot(pts[pts.length - 1].x - pts[0].x, pts[pts.length - 1].y - pts[0].y);
            return Math.abs(Math.hypot(x - pts[0].x, y - pts[0].y) - radius) <= t;
        }
        case 'ellipse': {
            if (pts.length < 2) return false;
            const { minX, maxX, minY, maxY } = cornersOf(pts);
            const cx = (minX + maxX) / 2;
            const cy = (minY + maxY) / 2;
            const rx = Math.max((maxX - minX) / 2, 1e-6);
            const ry = Math.max((maxY - minY) / 2, 1e-6);
            // Distance to the outline, approximated in normalised space.
            const nx = (x - cx) / rx;
            const ny = (y - cy) / ry;
            const radial = Math.hypot(nx, ny);
            return Math.abs(radial - 1) * Math.min(rx, ry) <= t;
        }
        case 'polygon':
            return polylineHit(pts, x, y, t, pts.length >= 3);
        case 'freehand':
        default:
            return polylineHit(pts, x, y, t, false);
    }
}

/** Does a closed shape contain the world point (used by the fill bucket)? */
export function hitTestFill(path, x, y, gridToWorldCorner) {
    if (!path || !FILLABLE_TOOLS.includes(path.tool)) return false;
    const pts = pathWorldPoints(path, gridToWorldCorner);
    if (pts.length < 2) return false;
    switch (path.tool) {
        case 'rectangle': {
            const { minX, maxX, minY, maxY } = cornersOf(pts);
            return x >= minX && x <= maxX && y >= minY && y <= maxY;
        }
        case 'circle': {
            const radius = Math.hypot(pts[pts.length - 1].x - pts[0].x, pts[pts.length - 1].y - pts[0].y);
            return Math.hypot(x - pts[0].x, y - pts[0].y) <= radius;
        }
        case 'ellipse': {
            const { minX, maxX, minY, maxY } = cornersOf(pts);
            const rx = Math.max((maxX - minX) / 2, 1e-6);
            const ry = Math.max((maxY - minY) / 2, 1e-6);
            const nx = (x - (minX + maxX) / 2) / rx;
            const ny = (y - (minY + maxY) / 2) / ry;
            return nx * nx + ny * ny <= 1;
        }
        case 'polygon':
            return pts.length >= 3 && pointInPolygon(x, y, pts);
        case 'freehand':
            return pts.length >= 3 && !!(path.style && path.style.closed) && pointInPolygon(x, y, pts);
        default:
            return false;
    }
}

/** Bounding box (world) of a whole path including stroke width, or null. */
export function pathBounds(path, gridToWorldCorner) {
    if (!path) return null;
    if (path.tool === 'text') return textWorldBox(path, gridToWorldCorner);
    const pts = pathWorldPoints(path, gridToWorldCorner);
    if (pts.length === 0) return null;
    let box;
    if (path.tool === 'rectangle' || path.tool === 'ellipse') {
        box = cornersOf(pts);
    } else if (path.tool === 'circle' && pts.length >= 2) {
        const r = Math.hypot(pts[pts.length - 1].x - pts[0].x, pts[pts.length - 1].y - pts[0].y);
        box = { minX: pts[0].x - r, maxX: pts[0].x + r, minY: pts[0].y - r, maxY: pts[0].y + r };
    } else {
        box = boundsOf(pts);
    }
    const pad = halfStroke(path);
    return { minX: box.minX - pad, minY: box.minY - pad, maxX: box.maxX + pad, maxY: box.maxY + pad };
}

/** Rebuild a path's points in world space through `mapPoint({x, y}) -> {x, y}`.
 *  Grid-snapped shapes become free-position shapes once edited. */
function mapPathPoints(path, gridToWorldCorner, mapPoint) {
    const next = [];
    for (const pt of path.points || []) {
        const w = pointToWorld(pt, gridToWorldCorner);
        if (!w) {
            next.push(pt); // legacy/unresolvable points are left untouched
            continue;
        }
        const m = mapPoint(w);
        const out = { worldX: roundTo(m.x), worldY: roundTo(m.y), isWorldCoords: true };
        if (typeof pt.pressure === 'number') out.pressure = pt.pressure;
        next.push(out);
    }
    return { ...path, points: next };
}

export function translatePath(path, dx, dy, gridToWorldCorner) {
    return mapPathPoints(path, gridToWorldCorner, (p) => ({ x: p.x + dx, y: p.y + dy }));
}

/** Scale a path about (ox, oy). Stroke width is intentionally left alone. */
export function scalePathAbout(path, sx, sy, ox, oy, gridToWorldCorner) {
    const scaled = mapPathPoints(path, gridToWorldCorner, (p) => ({ x: ox + (p.x - ox) * sx, y: oy + (p.y - oy) * sy }));
    if (path.tool === 'text' && path.style) {
        const factor = (Math.abs(sx) + Math.abs(sy)) / 2;
        scaled.style = { ...path.style, fontSize: Math.max(6, Math.round(path.style.fontSize * factor * 10) / 10) };
    }
    return scaled;
}

/** The four corner handles of a bounding box, in a fixed order. */
export function boxHandles(box) {
    return [
        { id: 'nw', x: box.minX, y: box.minY },
        { id: 'ne', x: box.maxX, y: box.minY },
        { id: 'se', x: box.maxX, y: box.maxY },
        { id: 'sw', x: box.minX, y: box.maxY }
    ];
}

/** The corner opposite to `handleId`, used as the fixed scaling anchor. */
export function oppositeCorner(box, handleId) {
    switch (handleId) {
        case 'nw': return { x: box.maxX, y: box.maxY };
        case 'ne': return { x: box.minX, y: box.maxY };
        case 'se': return { x: box.minX, y: box.minY };
        case 'sw': return { x: box.maxX, y: box.minY };
        default: return { x: (box.minX + box.maxX) / 2, y: (box.minY + box.maxY) / 2 };
    }
}

/**
 * Compute the scale factors for dragging corner `handleId` to `pointer`.
 * `uniform` keeps the aspect ratio (the default for touch: no accidental
 * squashing). Factors are clamped away from 0 so a shape cannot collapse.
 */
export function resizeFactors(box, handleId, pointer, uniform = true, minSize = 4) {
    const anchor = oppositeCorner(box, handleId);
    const handle = boxHandles(box).find((h) => h.id === handleId);
    if (!handle) return { sx: 1, sy: 1, anchor };
    const baseW = handle.x - anchor.x || 1e-6;
    const baseH = handle.y - anchor.y || 1e-6;
    let sx = (pointer.x - anchor.x) / baseW;
    let sy = (pointer.y - anchor.y) / baseH;
    if (uniform) {
        const s = Math.abs(sx) > Math.abs(sy) ? sx : sy;
        sx = s;
        sy = s;
    }
    const minX = minSize / Math.max(Math.abs(baseW), 1e-6);
    const minY = minSize / Math.max(Math.abs(baseH), 1e-6);
    const clamp = (v, m) => (Math.abs(v) < m ? (v < 0 ? -m : m) : v);
    return { sx: clamp(sx, minX), sy: clamp(sy, minY), anchor };
}
