/**
 * Input controller for the level editor's drawing tools.
 *
 * It turns a stream of pointer positions (mouse, finger or stylus - the caller
 * does not matter) into drawing paths: freehand strokes, shapes, polygons, the
 * fill bucket and the select / move / resize "edit" tool.
 *
 * All gesture state lives in plain fields instead of React state, so a fast
 * stylus stroke never reads a stale closure, and the whole thing can be unit
 * tested with a fake store and grid system (see __tests__).
 *
 * UNDO: a snapshot is pushed immediately before the first change a gesture
 * makes. A gesture that is cancelled before that point leaves no history entry,
 * and one that is cancelled afterwards restores the path and drops the entry.
 */

import {
    simplifyToBudget,
    isClosedStroke,
    roundTo,
    isLegacyPoint,
    hitTestPath,
    hitTestFill,
    pathBounds,
    pathWorldPoints,
    boxHandles,
    translatePath,
    scalePathAbout,
    resizeFactors
} from './drawingGeometry';
import { buildPathStyle } from './drawingRender';

/** Tools this controller owns (everything else keeps the editor's own handlers). */
export const DRAW_CONTROLLER_TOOLS = [
    'freehand', 'line', 'arrow', 'rectangle', 'circle', 'ellipse', 'polygon', 'fill', 'draw_edit'
];

export const SHAPE_DRAG_TOOLS = ['line', 'arrow', 'rectangle', 'circle', 'ellipse'];

/** Tools that can be selected and edited. */
const EDITABLE_TOOLS = ['freehand', 'line', 'arrow', 'rectangle', 'circle', 'ellipse', 'polygon', 'text'];

/** Resizing keeps the aspect ratio for these so a finger cannot squash them. */
const UNIFORM_RESIZE_TOOLS = ['freehand', 'circle', 'text'];

/** Style keys copied from a selected path into the tool settings (and back). */
export const STYLE_SETTING_KEYS = [
    'strokeColor', 'fillColor', 'strokeWidth', 'opacity', 'lineStyle', 'sketch', 'arrowHead'
];

const TOLERANCE_PX = { touch: 28, pen: 20, mouse: 10 };
const HANDLE_PX = { touch: 32, pen: 26, mouse: 14 };
const CLOSE_PX = { touch: 28, pen: 20, mouse: 14 };
const MIN_SHAPE_PX = 4;
const MOVE_SLOP_PX = 4;
const MAX_FREEHAND_POINTS = 1200;

const kindOf = (ev) => (ev && (ev.pointerType === 'touch' || ev.pointerType === 'pen') ? ev.pointerType : 'mouse');

const defaultFrame = (cb) => (typeof requestAnimationFrame === 'function' ? requestAnimationFrame(cb) : setTimeout(cb, 16));
const defaultCancelFrame = (id) => (typeof cancelAnimationFrame === 'function' ? cancelAnimationFrame(id) : clearTimeout(id));

export class DrawingInputController {
    /**
     * @param {object} deps
     * @param {{getState: () => object}} deps.store            level editor store
     * @param {() => object} deps.getGridSystem
     * @param {() => {left:number, top:number}|null} deps.getOverlayRect
     * @param {() => {zoomLevel:number, playerZoom:number}} deps.getGameState
     * @param {() => (string|null)} [deps.getMapId]
     */
    constructor(deps) {
        this.d = {
            getMapId: () => null,
            requestFrame: defaultFrame,
            cancelFrame: defaultCancelFrame,
            ...deps
        };
        this.session = null; // the gesture in progress
        this.poly = null; // a polygon being built across several taps
        this.frame = null;
        this.pendingEdit = null; // throttled path update while dragging in the edit tool
        this.editFrame = null;
    }

    // ── state ───────────────────────────────────────────────────────────────
    get state() {
        return this.d.store.getState();
    }

    isActive() {
        return this.session !== null;
    }

    hasPendingPolygon() {
        return this.poly !== null && this.poly.points.length > 0;
    }

    // ── coordinates ─────────────────────────────────────────────────────────
    _zoom() {
        const g = this.d.getGameState();
        return Math.max(1e-6, (g.zoomLevel || 1) * (g.playerZoom || 1));
    }

    _world(ev) {
        const rect = this.d.getOverlayRect() || { left: 0, top: 0 };
        const gs = this.d.getGridSystem();
        const vp = gs.getViewportDimensions();
        const w = gs.screenToWorld(ev.clientX - rect.left, ev.clientY - rect.top, vp.width, vp.height);
        return { x: w.x, y: w.y };
    }

    _g2w() {
        const gs = this.d.getGridSystem();
        return (gx, gy) => gs.gridToWorldCorner(gx, gy);
    }

    /** Snap a world point to the grid, in the point format that suits the grid. */
    _snapPoint(world, settings) {
        if (settings.drawSnap === false) {
            return { worldX: roundTo(world.x), worldY: roundTo(world.y), isWorldCoords: true };
        }
        const gs = this.d.getGridSystem();
        const grid = gs.worldToGrid(world.x, world.y);
        const gridState = typeof gs.getGridState === 'function' ? gs.getGridState() : {};
        if (gridState.gridType === 'hex') {
            // Hex shapes keep the original cell-based points (they render along hex boundaries).
            return { gridX: grid.x, gridY: grid.y };
        }
        let best = null;
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const corner = gs.gridToWorldCorner(grid.x + dx, grid.y + dy);
                const dist = Math.hypot(corner.x - world.x, corner.y - world.y);
                if (!best || dist < best.dist) best = { x: corner.x, y: corner.y, dist };
            }
        }
        return { worldX: roundTo(best.x), worldY: roundTo(best.y), isWorldCoords: true };
    }

    _snapWorld(world, settings) {
        const p = this._snapPoint(world, settings);
        if (p.isWorldCoords) return { x: p.worldX, y: p.worldY };
        const w = this._g2w()(p.gridX, p.gridY);
        return { x: w.x, y: w.y };
    }

    _pressureOf(ev, settings) {
        if (ev.pointerType !== 'pen' || settings.usePressure === false) return undefined;
        const p = typeof ev.pressure === 'number' ? ev.pressure : 0.5;
        return roundTo(Math.max(0.05, Math.min(1, p)), 2);
    }

    // ── live preview ────────────────────────────────────────────────────────
    _scheduleLive() {
        if (this.frame !== null) return;
        this.frame = this.d.requestFrame(() => {
            this.frame = null;
            this._pushLive();
        });
    }

    _livePoints() {
        if (this.session) {
            if (this.session.kind === 'freehand') return this.session.pts.slice();
            if (this.session.kind === 'shape') return [this.session.start, this.session.end];
        }
        if (this.poly) {
            const pts = this.poly.points.slice();
            if (this.poly.candidate) pts.push(this.poly.candidate);
            return pts;
        }
        return [];
    }

    _liveTool() {
        if (this.session && (this.session.kind === 'freehand' || this.session.kind === 'shape')) return this.session.tool;
        if (this.poly) return 'polygon';
        return '';
    }

    _pushLive() {
        const st = this.state;
        const points = this._livePoints();
        if (points.length === 0) {
            st.clearCurrentDrawing();
            return;
        }
        st.setCurrentDrawingTool(this._liveTool());
        st.setCurrentDrawingPath(points);
        st.setIsCurrentlyDrawing(true);
    }

    _flushLive() {
        if (this.frame !== null) {
            this.d.cancelFrame(this.frame);
            this.frame = null;
        }
        this._pushLive();
    }

    _clearLive() {
        if (this.frame !== null) {
            this.d.cancelFrame(this.frame);
            this.frame = null;
        }
        this.state.clearCurrentDrawing();
    }

    // ── entry points ────────────────────────────────────────────────────────
    start(ev, tool) {
        if (this.session) this.cancel();
        const settings = this.state.toolSettings || {};
        switch (tool) {
            case 'freehand': return this._startFreehand(ev, settings);
            case 'line':
            case 'arrow':
            case 'rectangle':
            case 'circle':
            case 'ellipse': return this._startShape(ev, tool, settings);
            case 'polygon': return this._startPolygonPoint(ev, settings);
            case 'fill':
                this.session = { kind: 'fill', tool, mapId: this.d.getMapId(), kindOfPointer: kindOf(ev) };
                return undefined;
            case 'draw_edit': return this._startEdit(ev);
            default: return undefined;
        }
    }

    move(ev, tool) {
        if (tool === 'polygon') return this._movePolygon(ev);
        const s = this.session;
        if (!s) return undefined;
        switch (s.kind) {
            case 'freehand': return this._moveFreehand(ev);
            case 'shape': return this._moveShape(ev);
            case 'move':
            case 'resize': return this._moveEdit(ev);
            default: return undefined;
        }
    }

    end(ev) {
        const s = this.session;
        if (!s && this.poly && this.poly.dragging) return this._endPolygonPoint(ev);
        if (!s) return undefined;
        switch (s.kind) {
            case 'freehand': return this._endFreehand(ev);
            case 'shape': return this._endShape(ev);
            case 'polygon': return this._endPolygonPoint(ev);
            case 'fill': return this._endFill(ev);
            case 'move':
            case 'resize':
            case 'tap': return this._endEdit(ev);
            default: return undefined;
        }
    }

    /** Abort the current gesture (second finger landed, pointer lost...). */
    cancel() {
        const s = this.session;
        this.session = null;
        if (this.poly && this.poly.dragging) {
            this.poly.dragging = false;
            this.poly.candidate = null;
            this._flushLive();
        }
        if (!s) return;
        if (s.kind === 'freehand' || s.kind === 'shape') {
            if (!this.poly) this._clearLive();
        } else if (s.kind === 'move' || s.kind === 'resize') {
            this._discardEditPreview();
            if (s.moved) {
                this.state.updateDrawingPath(s.id, { points: s.original.points, style: s.original.style }, s.mapId);
                if (typeof this.state.cancelLastHistoryEntry === 'function') this.state.cancelLastHistoryEntry();
            }
        }
    }

    /** Drop everything, including a half-built polygon (tool change, Escape). */
    reset() {
        this.cancel();
        if (this.poly) {
            this.poly = null;
            this._clearLive();
        }
    }

    // ── commit helper ───────────────────────────────────────────────────────
    _commit(tool, points, style, mapId) {
        const st = this.state;
        st.pushHistorySnapshot();
        return st.addDrawingPath(
            { tool, points, style, layer: 'drawings' },
            mapId === undefined ? this.d.getMapId() : mapId,
            { allowDuplicate: true, keepLayer: true }
        );
    }

    // ── freehand ────────────────────────────────────────────────────────────
    _startFreehand(ev, settings) {
        const w = this._world(ev);
        const pressure = this._pressureOf(ev, settings);
        const pt = { worldX: roundTo(w.x, 2), worldY: roundTo(w.y, 2), isWorldCoords: true };
        if (pressure !== undefined) pt.pressure = pressure;
        this.session = {
            kind: 'freehand', tool: 'freehand', pts: [pt], mapId: this.d.getMapId(),
            sawPressure: pressure !== undefined, pointer: kindOf(ev)
        };
        this._flushLive();
    }

    _moveFreehand(ev) {
        const s = this.session;
        const w = this._world(ev);
        const last = s.pts[s.pts.length - 1];
        // Skip sub-pixel jitter; the stylus reports hundreds of samples a second.
        if (Math.hypot(w.x - last.worldX, w.y - last.worldY) < 1.2 / this._zoom()) return;
        const pressure = this._pressureOf(ev, this.state.toolSettings || {});
        const pt = { worldX: roundTo(w.x, 2), worldY: roundTo(w.y, 2), isWorldCoords: true };
        if (pressure !== undefined) {
            pt.pressure = pressure;
            s.sawPressure = true;
        }
        s.pts.push(pt);
        this._scheduleLive();
    }

    _endFreehand(ev) {
        const s = this.session;
        this.session = null;
        if (ev && typeof ev.clientX === 'number') {
            const w = this._world(ev);
            const last = s.pts[s.pts.length - 1];
            if (Math.hypot(w.x - last.worldX, w.y - last.worldY) >= 1.2 / this._zoom()) {
                const pt = { worldX: roundTo(w.x, 2), worldY: roundTo(w.y, 2), isWorldCoords: true };
                const pressure = this._pressureOf(ev, this.state.toolSettings || {});
                if (pressure !== undefined) pt.pressure = pressure;
                s.pts.push(pt);
            }
        }
        const settings = this.state.toolSettings || {};
        const zoom = this._zoom();
        const smoothing = typeof settings.smoothing === 'number' ? settings.smoothing : 0.5;

        // Thin the stroke: tolerance grows with the smoothing setting but stays
        // below a pixel at the current zoom, so the result looks identical.
        const flat = s.pts.map((p) => ({ x: p.worldX, y: p.worldY, pressure: p.pressure }));
        const kept = flat.length > 2 ? simplifyToBudget(flat, (0.35 + 0.9 * smoothing) / zoom, MAX_FREEHAND_POINTS) : flat;

        let extent = 0;
        if (kept.length > 1) {
            let minX = Infinity; let maxX = -Infinity; let minY = Infinity; let maxY = -Infinity;
            kept.forEach((p) => { minX = Math.min(minX, p.x); maxX = Math.max(maxX, p.x); minY = Math.min(minY, p.y); maxY = Math.max(maxY, p.y); });
            extent = Math.hypot(maxX - minX, maxY - minY);
        }
        // A loop that ends back at its start can be filled later.
        const closed = extent > 40 / zoom && isClosedStroke(kept, 18 / zoom);

        const points = kept.map((p) => {
            const out = { worldX: roundTo(p.x), worldY: roundTo(p.y), isWorldCoords: true };
            if (typeof p.pressure === 'number') out.pressure = p.pressure;
            return out;
        });
        const extras = {};
        if (s.sawPressure) extras.hasPressure = true;
        if (closed) extras.closed = true;
        const style = buildPathStyle(settings, 'freehand', extras);

        this._commit('freehand', points, style, s.mapId);
        this._clearLive();
    }

    // ── shapes ──────────────────────────────────────────────────────────────
    _constrained(tool, startWorld, world, ev) {
        if (!ev || !ev.shiftKey) return world;
        const dx = world.x - startWorld.x;
        const dy = world.y - startWorld.y;
        if (tool === 'line' || tool === 'arrow') {
            const step = Math.PI / 12;
            const angle = Math.round(Math.atan2(dy, dx) / step) * step;
            const len = Math.hypot(dx, dy);
            return { x: startWorld.x + Math.cos(angle) * len, y: startWorld.y + Math.sin(angle) * len };
        }
        if (tool === 'rectangle' || tool === 'ellipse') {
            const size = Math.max(Math.abs(dx), Math.abs(dy));
            return { x: startWorld.x + Math.sign(dx || 1) * size, y: startWorld.y + Math.sign(dy || 1) * size };
        }
        return world;
    }

    _startShape(ev, tool, settings) {
        const w = this._world(ev);
        const p = this._snapPoint(w, settings);
        this.session = {
            kind: 'shape', tool, start: p, end: p, startWorld: w, mapId: this.d.getMapId(),
            pointer: kindOf(ev), moved: false
        };
        this._flushLive();
    }

    _moveShape(ev) {
        const s = this.session;
        const settings = this.state.toolSettings || {};
        const w = this._constrained(s.tool, s.startWorld, this._world(ev), ev);
        s.end = this._snapPoint(w, settings);
        s.endWorld = w;
        s.moved = true;
        this._scheduleLive();
    }

    _endShape(ev) {
        const s = this.session;
        if (ev && typeof ev.clientX === 'number') this._moveShape(ev);
        this.session = null;
        const zoom = this._zoom();
        const endWorld = s.endWorld || s.startWorld;
        const length = Math.hypot(endWorld.x - s.startWorld.x, endWorld.y - s.startWorld.y);
        if (length * zoom < MIN_SHAPE_PX) {
            this._clearLive();
            return; // a tap is not a shape
        }
        const style = buildPathStyle(this.state.toolSettings || {}, s.tool);
        this._commit(s.tool, [s.start, s.end], style, s.mapId);
        this._clearLive();
    }

    // ── polygon ─────────────────────────────────────────────────────────────
    _startPolygonPoint(ev, settings) {
        const w = this._world(ev);
        if (!this.poly) this.poly = { points: [], candidate: null, dragging: false, mapId: this.d.getMapId() };
        this.poly.candidate = this._snapPoint(w, settings);
        this.poly.dragging = true;
        this.poly.pointer = kindOf(ev);
        this.session = { kind: 'polygon', tool: 'polygon', mapId: this.poly.mapId };
        this._flushLive();
    }

    _movePolygon(ev) {
        if (!this.poly) return;
        // Mouse hover rubber-bands without a button; a finger only does while down.
        if (!this.poly.dragging && kindOf(ev) !== 'mouse') return;
        this.poly.candidate = this._snapPoint(this._world(ev), this.state.toolSettings || {});
        this._scheduleLive();
    }

    _closeRadiusWorld(pointer) {
        return (CLOSE_PX[pointer] || CLOSE_PX.mouse) / this._zoom();
    }

    _endPolygonPoint(ev) {
        const poly = this.poly;
        this.session = null;
        if (!poly) return;
        const settings = this.state.toolSettings || {};
        if (ev && typeof ev.clientX === 'number') poly.candidate = this._snapPoint(this._world(ev), settings);
        poly.dragging = false;
        const cand = poly.candidate;
        poly.candidate = null;
        if (!cand) {
            this._flushLive();
            return;
        }
        const g2w = this._g2w();
        const toWorld = (p) => (p.isWorldCoords ? { x: p.worldX, y: p.worldY } : g2w(p.gridX, p.gridY));
        const candW = toWorld(cand);
        if (poly.points.length >= 3) {
            const firstW = toWorld(poly.points[0]);
            if (Math.hypot(candW.x - firstW.x, candW.y - firstW.y) <= this._closeRadiusWorld(poly.pointer || kindOf(ev))) {
                this.finishPolygon();
                return;
            }
        }
        const lastP = poly.points[poly.points.length - 1];
        if (!lastP || Math.hypot(candW.x - toWorld(lastP).x, candW.y - toWorld(lastP).y) > 0.5 / this._zoom()) {
            poly.points.push(cand);
        }
        this._flushLive();
    }

    /** Commit the polygon being built (needs 3+ corners). */
    finishPolygon() {
        const poly = this.poly;
        if (!poly) return false;
        const ok = poly.points.length >= 3;
        if (ok) {
            const style = buildPathStyle(this.state.toolSettings || {}, 'polygon');
            this._commit('polygon', poly.points.slice(), style, poly.mapId);
        }
        this.poly = null;
        this._clearLive();
        return ok;
    }

    /** Remove the last placed corner; an empty polygon is abandoned. */
    undoPolygonPoint() {
        if (!this.poly) return false;
        this.poly.points.pop();
        this.poly.candidate = null;
        if (this.poly.points.length === 0) {
            this.poly = null;
            this._clearLive();
        } else {
            this._flushLive();
        }
        return true;
    }

    // ── fill bucket ─────────────────────────────────────────────────────────
    _endFill(ev) {
        const s = this.session;
        this.session = null;
        if (!ev || typeof ev.clientX !== 'number') return;
        const st = this.state;
        const settings = st.toolSettings || {};
        const w = this._world(ev);
        const g2w = this._g2w();
        const paths = st.drawingPaths || [];
        for (let i = paths.length - 1; i >= 0; i--) {
            const path = paths[i];
            if (!this._isEditablePath(path) || !hitTestFill(path, w.x, w.y, g2w)) continue;
            const color = settings.fillColor && settings.fillColor !== 'transparent' ? settings.fillColor : (settings.strokeColor || '#000000');
            st.pushHistorySnapshot();
            st.updateDrawingPath(path.id, { style: { ...path.style, fillColor: color } }, s.mapId);
            return;
        }
    }

    // ── select / move / resize ──────────────────────────────────────────────
    _isEditablePath(path) {
        if (!path || !EDITABLE_TOOLS.includes(path.tool) || !Array.isArray(path.points)) return false;
        if (path.points.some(isLegacyPoint)) return false; // screen-space strokes cannot be mapped
        const layers = this.state.drawingLayers || [];
        const layer = layers.find((l) => l.id === (path.layer || 'drawings'));
        return !layer || (layer.visible !== false && !layer.locked);
    }

    _loadStyleIntoSettings(path) {
        const patch = {};
        const style = path.style || {};
        STYLE_SETTING_KEYS.forEach((key) => {
            if (style[key] !== undefined) patch[key] = style[key];
        });
        if (path.tool === 'freehand') patch.brushPreset = style.brush || 'pen';
        if (Object.keys(patch).length) this.state.setToolSettings(patch);
    }

    _select(path) {
        const st = this.state;
        st.clearDrawingSelection();
        st.selectDrawing(path.id);
        this._loadStyleIntoSettings(path);
    }

    _startEdit(ev) {
        const st = this.state;
        const pointer = kindOf(ev);
        const w = this._world(ev);
        const zoom = this._zoom();
        const g2w = this._g2w();
        const paths = st.drawingPaths || [];
        const mapId = this.d.getMapId();
        const selectedId = (st.selectedDrawings || [])[0];
        const selected = selectedId ? paths.find((p) => p.id === selectedId) : null;

        // 1. A corner handle of the selected drawing starts a resize.
        if (selected && this._isEditablePath(selected)) {
            const box = pathBounds(selected, g2w);
            if (box) {
                const handleTol = (HANDLE_PX[pointer] || HANDLE_PX.mouse) / zoom;
                const hit = boxHandles(box).find((h) => Math.hypot(h.x - w.x, h.y - w.y) <= handleTol);
                if (hit) {
                    this.session = {
                        kind: 'resize', id: selected.id, handle: hit.id, box, original: selected,
                        mapId, moved: false, startWorld: w, pointer
                    };
                    return;
                }
            }
        }

        // 2. Otherwise pick the top-most drawing under the pointer.
        const tol = (TOLERANCE_PX[pointer] || TOLERANCE_PX.mouse) / zoom;
        for (let i = paths.length - 1; i >= 0; i--) {
            const path = paths[i];
            if (!this._isEditablePath(path)) continue;
            const filled = path.style && path.style.fillColor && path.style.fillColor !== 'transparent';
            if (hitTestPath(path, w.x, w.y, tol, g2w) || (filled && hitTestFill(path, w.x, w.y, g2w))) {
                if (path.id !== selectedId) this._select(path);
                this.session = {
                    kind: 'move', id: path.id, original: path, mapId, moved: false, startWorld: w, pointer
                };
                return;
            }
        }

        // 3. Empty space: a plain tap clears the selection.
        this.session = { kind: 'tap', mapId, startWorld: w, pointer };
    }

    // Drag updates are applied at most once per frame; the last one wins.
    _queueEdit(id, points, mapId, style) {
        this.pendingEdit = { id, points, mapId, style };
        if (this.editFrame === null) {
            this.editFrame = this.d.requestFrame(() => {
                this.editFrame = null;
                this._flushEdit();
            });
        }
    }

    _flushEdit() {
        if (this.editFrame !== null) {
            this.d.cancelFrame(this.editFrame);
            this.editFrame = null;
        }
        const e = this.pendingEdit;
        this.pendingEdit = null;
        if (!e) return;
        const updates = { points: e.points };
        if (e.style) updates.style = e.style;
        this.state.updateDrawingPath(e.id, updates, e.mapId);
    }

    _discardEditPreview() {
        if (this.editFrame !== null) {
            this.d.cancelFrame(this.editFrame);
            this.editFrame = null;
        }
        this.pendingEdit = null;
    }

    _moveEdit(ev) {
        const s = this.session;
        const w = this._world(ev);
        const zoom = this._zoom();
        const g2w = this._g2w();

        if (!s.moved) {
            if (Math.hypot(w.x - s.startWorld.x, w.y - s.startWorld.y) * zoom < MOVE_SLOP_PX) return;
            s.moved = true;
            this.state.pushHistorySnapshot();
        }

        if (s.kind === 'move') {
            let dx = w.x - s.startWorld.x;
            let dy = w.y - s.startWorld.y;
            const settings = this.state.toolSettings || {};
            if (settings.drawSnap !== false) {
                // Land the drawing's anchor point (a corner, a circle's centre,
                // a line's start) on a grid corner.
                const anchor = pathWorldPoints(s.original, g2w)[0];
                if (anchor) {
                    const snapped = this._snapWorld({ x: anchor.x + dx, y: anchor.y + dy }, settings);
                    dx = snapped.x - anchor.x;
                    dy = snapped.y - anchor.y;
                }
            }
            this._queueEdit(s.id, translatePath(s.original, dx, dy, g2w).points, s.mapId);
        } else {
            const uniform = UNIFORM_RESIZE_TOOLS.includes(s.original.tool) !== !!ev.shiftKey;
            const { sx, sy, anchor } = resizeFactors(s.box, s.handle, w, uniform, 4 / zoom);
            const next = scalePathAbout(s.original, sx, sy, anchor.x, anchor.y, g2w);
            // Only text changes its style (font size) when resized.
            this._queueEdit(s.id, next.points, s.mapId, next.style !== s.original.style ? next.style : undefined);
        }
    }

    _endEdit() {
        const s = this.session;
        this.session = null;
        if (!s) return;
        if (s.kind === 'tap') {
            this.state.clearDrawingSelection();
            return;
        }
        if (s.moved) this._flushEdit();
    }

    // ── actions for the touch bar / keyboard ────────────────────────────────
    deleteSelection() {
        const st = this.state;
        const ids = (st.selectedDrawings || []).slice();
        if (ids.length === 0) return 0;
        st.pushHistorySnapshot();
        ids.forEach((id) => st.removeDrawingPath(id, this.d.getMapId()));
        return ids.length;
    }

    duplicateSelection() {
        const st = this.state;
        const paths = st.drawingPaths || [];
        const g2w = this._g2w();
        const zoom = this._zoom();
        const offset = 24 / zoom;
        const newIds = [];
        const source = (st.selectedDrawings || []).map((id) => paths.find((p) => p.id === id)).filter(Boolean);
        if (source.length === 0) return 0;
        st.pushHistorySnapshot();
        source.forEach((path) => {
            const moved = translatePath(path, offset, offset, g2w);
            const { id, ...rest } = moved;
            const newId = st.addDrawingPath(
                { ...rest, layer: path.layer || 'drawings' },
                this.d.getMapId(),
                { allowDuplicate: true, keepLayer: true }
            );
            if (newId) newIds.push(newId);
        });
        if (newIds.length) {
            st.clearDrawingSelection();
            newIds.forEach((id) => st.selectDrawing(id));
        }
        return newIds.length;
    }
}

export default DrawingInputController;
