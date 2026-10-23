/**
 * Canvas painter for level-editor drawing paths.
 *
 * Both the committed paths and the live (still being drawn) preview go through
 * `paintDrawingPath`, so what you see while drawing is exactly what gets saved.
 *
 * The painter knows nothing about React or the stores: the drawing engine
 * injects the grid system's projection through `env`:
 *   env.gridToWorldCorner(gx, gy) -> {x, y}      grid-snapped point -> world
 *   env.worldToScreen(x, y)       -> {x, y}      world -> canvas CSS px
 *   env.zoom                      px per world unit (stroke widths scale by it)
 *   env.rough                     optional RoughCanvas (sketch style)
 *   env.hexBoundary               optional (minX,maxX,minY,maxY) -> world pts,
 *                                 only for legacy grid-snapped hex rectangles
 *
 * Every outline vertex is projected on its own, so shapes stay correct in the
 * tilted / rotated camera views, where a circle is an ellipse on screen.
 */

import { renderSmoothStroke } from './strokeRenderer';
import {
    pathWorldPoints,
    pathBounds,
    isLegacyPoint,
    isGridPoint,
    lineDashFor,
    arrowHeadPoints,
    strokeSeed,
    boxHandles
} from './drawingGeometry';

/** Tools painted by `paintDrawingPath` (text is painted by the engine). */
export const PAINTED_TOOLS = ['freehand', 'line', 'arrow', 'rectangle', 'circle', 'ellipse', 'polygon'];

/**
 * Brush feel for freehand strokes. `stroke` picks a perfect-freehand preset
 * from strokeRenderer; `widthScale` multiplies the chosen width so a "marker"
 * and a "pencil" at the same slider value still look different.
 * A path with no `style.brush` (everything saved before presets existed) falls
 * back to 'pen', which reproduces the original look exactly.
 */
export const BRUSH_PRESETS = {
    pen: { label: 'Pen', stroke: 'default', widthScale: 1, alpha: 1 },
    pencil: { label: 'Pencil', stroke: 'pencil', widthScale: 1, alpha: 0.92 },
    marker: { label: 'Marker', stroke: 'marker', widthScale: 1.8, alpha: 1 },
    brush: { label: 'Brush', stroke: 'brush', widthScale: 2.4, alpha: 1 },
    quill: { label: 'Quill', stroke: 'quill', widthScale: 1.3, alpha: 1 },
    highlighter: { label: 'Highlighter', stroke: 'highlighter', widthScale: 5, alpha: 0.4 }
};

export const BRUSH_ORDER = ['pen', 'pencil', 'marker', 'brush', 'quill', 'highlighter'];

const ELLIPSE_SEGMENTS = 64;

/**
 * Opacity below 10% is impossible from the UI: older builds divided it by 100
 * on every tool change until strokes became invisible. Treat such values as
 * corrupt and restore full opacity.
 */
export const sanitizeOpacity = (value) =>
    typeof value === 'number' && value >= 0.1 ? Math.min(1, value) : 1;

/**
 * Style object saved with a new path (and used for the live preview), built
 * from the editor's tool settings. Only non-default extras are written so
 * synced map documents stay small.
 */
export function buildPathStyle(settings, tool, extras = {}) {
    const s = settings || {};
    const style = {
        strokeWidth: s.strokeWidth || 2,
        strokeColor: s.strokeColor || '#000000',
        fillColor: s.fillColor || 'transparent',
        opacity: sanitizeOpacity(s.opacity)
    };
    if (tool === 'freehand') {
        if (s.brushPreset && s.brushPreset !== 'pen' && BRUSH_PRESETS[s.brushPreset]) style.brush = s.brushPreset;
        if (typeof s.smoothing === 'number' && Math.abs(s.smoothing - 0.5) > 0.001) {
            style.smoothing = Math.round(Math.max(0, Math.min(1, s.smoothing)) * 100) / 100;
        }
    } else {
        if (s.lineStyle && s.lineStyle !== 'solid') style.lineStyle = s.lineStyle;
        if (s.sketch) style.sketch = true;
    }
    if (tool === 'arrow') style.arrowHead = s.arrowHead || 'end';
    return { ...style, ...extras };
}

const toPoint = (pt, env) => {
    if (isLegacyPoint(pt)) return { x: pt.x, y: pt.y };
    const world = isGridPoint(pt) ? env.gridToWorldCorner(pt.gridX, pt.gridY) : { x: pt.worldX, y: pt.worldY };
    if (!world || !Number.isFinite(world.x) || !Number.isFinite(world.y)) return null;
    return env.worldToScreen(world.x, world.y);
};

const sampleEllipse = (cx, cy, rx, ry, segments = ELLIPSE_SEGMENTS) => {
    const out = [];
    for (let i = 0; i < segments; i++) {
        const a = (i / segments) * Math.PI * 2;
        out.push({ x: cx + Math.cos(a) * rx, y: cy + Math.sin(a) * ry });
    }
    return out;
};

/** Closed smooth SVG path (Catmull-Rom -> cubic Bezier) through screen points. */
export function closedCurvePath(pts) {
    const n = pts.length;
    if (n < 3) return '';
    const f = (v) => Math.round(v * 100) / 100;
    let d = `M ${f(pts[0].x)} ${f(pts[0].y)}`;
    for (let i = 0; i < n; i++) {
        const p0 = pts[(i - 1 + n) % n];
        const p1 = pts[i];
        const p2 = pts[(i + 1) % n];
        const p3 = pts[(i + 2) % n];
        const c1x = p1.x + (p2.x - p0.x) / 6;
        const c1y = p1.y + (p2.y - p0.y) / 6;
        const c2x = p2.x - (p3.x - p1.x) / 6;
        const c2y = p2.y - (p3.y - p1.y) / 6;
        d += ` C ${f(c1x)} ${f(c1y)} ${f(c2x)} ${f(c2y)} ${f(p2.x)} ${f(p2.y)}`;
    }
    return `${d} Z`;
}

/**
 * A shape's outline as world points, plus whether it is closed.
 * `segments` only affects round shapes (circle / ellipse).
 */
export function shapeOutlineWorld(path, env, segments = ELLIPSE_SEGMENTS) {
    const g2w = env.gridToWorldCorner;
    const pts = pathWorldPoints(path, g2w);
    if (pts.length === 0) return null;
    const first = pts[0];
    const last = pts[pts.length - 1];

    switch (path.tool) {
        case 'line':
        case 'arrow':
            return pts.length >= 2 ? { pts: [first, last], closed: false } : null;
        case 'rectangle': {
            if (pts.length < 2) return null;
            if (env.hexBoundary && path.points.every(isGridPoint)) {
                const minX = Math.min(path.points[0].gridX, path.points[path.points.length - 1].gridX);
                const maxX = Math.max(path.points[0].gridX, path.points[path.points.length - 1].gridX);
                const minY = Math.min(path.points[0].gridY, path.points[path.points.length - 1].gridY);
                const maxY = Math.max(path.points[0].gridY, path.points[path.points.length - 1].gridY);
                const boundary = env.hexBoundary(minX, maxX, minY, maxY);
                if (boundary && boundary.length > 0) return { pts: boundary, closed: true };
            }
            const minX = Math.min(first.x, last.x);
            const maxX = Math.max(first.x, last.x);
            const minY = Math.min(first.y, last.y);
            const maxY = Math.max(first.y, last.y);
            return {
                pts: [{ x: minX, y: minY }, { x: maxX, y: minY }, { x: maxX, y: maxY }, { x: minX, y: maxY }],
                closed: true
            };
        }
        case 'circle': {
            if (pts.length < 2) return null;
            const r = Math.hypot(last.x - first.x, last.y - first.y);
            return r > 0 ? { pts: sampleEllipse(first.x, first.y, r, r, segments), closed: true, round: true } : null;
        }
        case 'ellipse': {
            if (pts.length < 2) return null;
            const minX = Math.min(first.x, last.x);
            const maxX = Math.max(first.x, last.x);
            const minY = Math.min(first.y, last.y);
            const maxY = Math.max(first.y, last.y);
            if (maxX - minX < 1e-6 && maxY - minY < 1e-6) return null;
            return {
                pts: sampleEllipse((minX + maxX) / 2, (minY + maxY) / 2, (maxX - minX) / 2, (maxY - minY) / 2, segments),
                closed: true,
                round: true
            };
        }
        case 'polygon':
            return pts.length >= 2 ? { pts, closed: pts.length >= 3 } : null;
        default:
            return null;
    }
}

function tracePolyline(ctx, screenPts, closed) {
    ctx.beginPath();
    ctx.moveTo(screenPts[0].x, screenPts[0].y);
    for (let i = 1; i < screenPts.length; i++) ctx.lineTo(screenPts[i].x, screenPts[i].y);
    if (closed) ctx.closePath();
}

/** Filled smooth closed curve through the points (used for closed freehand loops). */
function traceSmoothClosed(ctx, screenPts) {
    const n = screenPts.length;
    ctx.beginPath();
    ctx.moveTo((screenPts[0][0] + screenPts[n - 1][0]) / 2, (screenPts[0][1] + screenPts[n - 1][1]) / 2);
    for (let i = 0; i < n; i++) {
        const p = screenPts[i];
        const q = screenPts[(i + 1) % n];
        ctx.quadraticCurveTo(p[0], p[1], (p[0] + q[0]) / 2, (p[1] + q[1]) / 2);
    }
    ctx.closePath();
}

function paintFreehand(ctx, path, env, style, widthPx, strokeColor, fillColor, alpha) {
    const screenPts = [];
    let hasPressure = style.hasPressure;
    let sawPressure = false;
    for (const pt of path.points) {
        const s = toPoint(pt, env);
        if (!s) continue;
        if (typeof pt.pressure === 'number') sawPressure = true;
        screenPts.push([s.x, s.y, typeof pt.pressure === 'number' ? pt.pressure : 0.5]);
    }
    if (screenPts.length === 0) return;
    if (hasPressure === undefined) hasPressure = sawPressure;

    // A closed loop can take a fill colour behind the stroke.
    if (style.closed && fillColor && screenPts.length >= 3) {
        ctx.save();
        ctx.fillStyle = fillColor;
        traceSmoothClosed(ctx, screenPts);
        ctx.fill();
        ctx.restore();
    }

    const preset = BRUSH_PRESETS[style.brush] || BRUSH_PRESETS.pen;
    ctx.globalAlpha = alpha * preset.alpha;
    // perfect-freehand returns an outline polygon that must be FILLED with the
    // stroke colour (fillColor belongs to shapes and is usually 'transparent').
    ctx.fillStyle = strokeColor;
    const options = {
        size: widthPx * preset.widthScale,
        tool: preset.stroke,
        simulatePressure: !hasPressure
    };
    if (typeof style.smoothing === 'number') {
        // 0 = follow the pen exactly, 1 = heavily stabilised.
        options.streamline = 0.1 + 0.8 * style.smoothing;
        options.smoothing = 0.3 + 0.5 * style.smoothing;
    }
    renderSmoothStroke(ctx, screenPts, options);
}

function roughOptions(path, style, widthPx, strokeColor, fillColor) {
    const dash = lineDashFor(style.lineStyle, widthPx);
    const options = {
        stroke: strokeColor,
        strokeWidth: widthPx,
        roughness: style.roughness || 1.4,
        bowing: 1,
        seed: strokeSeed(path)
    };
    if (fillColor) {
        options.fill = fillColor;
        options.fillStyle = 'hachure';
        options.hachureGap = Math.max(5, widthPx * 3);
        options.fillWeight = Math.max(1, widthPx * 0.6);
    }
    if (dash.length) options.strokeLineDash = dash;
    return options;
}

function paintOutline(ctx, path, env, outlineWorld, style, widthPx, strokeColor, fillColor) {
    const screenPts = outlineWorld.pts.map((p) => env.worldToScreen(p.x, p.y));
    if (screenPts.length < 2) return screenPts;

    const sketch = !!(style.sketch && env.rough);
    if (sketch) {
        try {
            const options = roughOptions(path, style, widthPx, strokeColor, outlineWorld.closed ? fillColor : null);
            if (outlineWorld.round) {
                // A 64-gon sketched edge by edge looks scratchy; a smooth curve
                // through a few samples gives a natural hand-drawn loop.
                const coarse = shapeOutlineWorld(path, env, 16);
                const d = coarse ? closedCurvePath(coarse.pts.map((p) => env.worldToScreen(p.x, p.y))) : '';
                if (d) {
                    env.rough.path(d, options);
                    return screenPts;
                }
            }
            const pairs = screenPts.map((p) => [p.x, p.y]);
            if (outlineWorld.closed) env.rough.polygon(pairs, options);
            else env.rough.linearPath(pairs, options);
            return screenPts;
        } catch (err) {
            // Fall through to the plain renderer if Rough.js is unavailable.
        }
    }

    ctx.lineWidth = widthPx;
    ctx.strokeStyle = strokeColor;
    const dash = lineDashFor(style.lineStyle, widthPx);
    if (typeof ctx.setLineDash === 'function') ctx.setLineDash(dash);
    tracePolyline(ctx, screenPts, outlineWorld.closed);
    if (outlineWorld.closed && fillColor) {
        ctx.fillStyle = fillColor;
        ctx.fill();
    }
    ctx.stroke();
    if (dash.length && typeof ctx.setLineDash === 'function') ctx.setLineDash([]);
    return screenPts;
}

function paintArrowHeads(ctx, path, env, screenPts, style, widthPx, strokeColor) {
    if (screenPts.length < 2) return;
    const size = Math.max(12, widthPx * 4.5);
    const mode = style.arrowHead || 'end';
    const a = screenPts[0];
    const b = screenPts[screenPts.length - 1];
    const heads = [];
    if (mode === 'end' || mode === 'both') heads.push({ tip: b, barbs: arrowHeadPoints(a, b, size) });
    if (mode === 'both') heads.push({ tip: a, barbs: arrowHeadPoints(b, a, size) });

    ctx.lineWidth = widthPx;
    ctx.strokeStyle = strokeColor;
    if (typeof ctx.setLineDash === 'function') ctx.setLineDash([]);
    heads.forEach(({ tip, barbs }, index) => {
        if (barbs.length !== 2) return;
        if (style.sketch && env.rough) {
            try {
                env.rough.linearPath(
                    [[barbs[0].x, barbs[0].y], [tip.x, tip.y], [barbs[1].x, barbs[1].y]],
                    { ...roughOptions(path, { ...style, lineStyle: 'solid' }, widthPx, strokeColor, null), seed: strokeSeed(path) + 7 + index }
                );
                return;
            } catch (err) {
                // plain fallback below
            }
        }
        ctx.beginPath();
        ctx.moveTo(barbs[0].x, barbs[0].y);
        ctx.lineTo(tip.x, tip.y);
        ctx.lineTo(barbs[1].x, barbs[1].y);
        ctx.stroke();
    });
}

/**
 * Paint one path. Returns true when the painter handled the tool, false for
 * tools it does not know (text, legacy tools) so the caller can fall back.
 */
export function paintDrawingPath(ctx, path, env) {
    if (!path || !PAINTED_TOOLS.includes(path.tool) || !Array.isArray(path.points) || path.points.length === 0) {
        return false;
    }
    const style = path.style || {};
    const zoom = env.zoom || 1;
    const widthPx = Math.max(0.5, (style.strokeWidth || 2) * zoom);
    const strokeColor = style.strokeColor || '#000000';
    const fillColor = style.fillColor && style.fillColor !== 'transparent' ? style.fillColor : null;
    const alpha = sanitizeOpacity(style.opacity);

    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = alpha;
    try {
        if (path.tool === 'freehand') {
            paintFreehand(ctx, path, env, style, widthPx, strokeColor, fillColor, alpha);
        } else {
            const outline = shapeOutlineWorld(path, env);
            if (outline) {
                const screenPts = paintOutline(ctx, path, env, outline, style, widthPx, strokeColor, fillColor);
                if (path.tool === 'arrow') paintArrowHeads(ctx, path, env, screenPts, style, widthPx, strokeColor);
            }
        }
    } finally {
        ctx.restore();
    }
    return true;
}

/**
 * Selection box + corner resize handles for the edit tool.
 * `handleRadiusPx` is the drawn radius; hit-testing happens in world space.
 */
export function paintSelection(ctx, path, env, options = {}) {
    const box = pathBounds(path, env.gridToWorldCorner);
    if (!box) return null;
    const corners = [
        { x: box.minX, y: box.minY },
        { x: box.maxX, y: box.minY },
        { x: box.maxX, y: box.maxY },
        { x: box.minX, y: box.maxY }
    ].map((c) => env.worldToScreen(c.x, c.y));
    const radius = options.handleRadiusPx || 9;
    const accent = options.color || '#4a8eff';

    ctx.save();
    ctx.globalAlpha = 1;
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = accent;
    if (typeof ctx.setLineDash === 'function') ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(corners[0].x, corners[0].y);
    for (let i = 1; i < corners.length; i++) ctx.lineTo(corners[i].x, corners[i].y);
    ctx.closePath();
    ctx.stroke();
    if (typeof ctx.setLineDash === 'function') ctx.setLineDash([]);

    if (options.handles !== false) {
        boxHandles(box).forEach((handle) => {
            const s = env.worldToScreen(handle.x, handle.y);
            ctx.beginPath();
            ctx.arc(s.x, s.y, radius, 0, Math.PI * 2);
            ctx.fillStyle = '#ffffff';
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = accent;
            ctx.stroke();
        });
    }
    ctx.restore();
    return box;
}

export default { paintDrawingPath, paintSelection, buildPathStyle, BRUSH_PRESETS, BRUSH_ORDER };
