import { DrawingInputController } from '../drawingInputController';

/** A tiny fake of the level editor store: just what the controller touches. */
const makeStore = (toolSettings = {}) => {
    const state = {
        toolSettings: {
            strokeColor: '#112233',
            fillColor: 'transparent',
            strokeWidth: 4,
            opacity: 1,
            drawSnap: false,
            smoothing: 0.5,
            ...toolSettings
        },
        drawingPaths: [],
        selectedDrawings: [],
        drawingLayers: [{ id: 'drawings', visible: true, locked: false }],
        currentDrawingPath: [],
        currentDrawingTool: '',
        isCurrentlyDrawing: false,
        undoDepth: 0,
        nextId: 1,
        calls: [],
        pushHistorySnapshot() {
            state.undoDepth++;
            state.calls.push('snapshot');
        },
        cancelLastHistoryEntry() {
            state.undoDepth = Math.max(0, state.undoDepth - 1);
            state.calls.push('cancelSnapshot');
        },
        addDrawingPath(path, mapId, options) {
            const id = `p${state.nextId++}`;
            state.drawingPaths = [...state.drawingPaths, { ...path, id }];
            state.calls.push(['add', mapId, options]);
            return id;
        },
        updateDrawingPath(id, updates) {
            state.drawingPaths = state.drawingPaths.map((p) => (p.id === id ? { ...p, ...updates } : p));
            state.calls.push(['update', id]);
        },
        removeDrawingPath(id) {
            state.drawingPaths = state.drawingPaths.filter((p) => p.id !== id);
            state.selectedDrawings = state.selectedDrawings.filter((s) => s !== id);
        },
        selectDrawing(id) {
            if (!state.selectedDrawings.includes(id)) state.selectedDrawings = [...state.selectedDrawings, id];
        },
        clearDrawingSelection() {
            state.selectedDrawings = [];
        },
        setToolSettings(patch) {
            state.toolSettings = { ...state.toolSettings, ...patch };
        },
        setCurrentDrawingPath(p) {
            state.currentDrawingPath = p;
        },
        setIsCurrentlyDrawing(v) {
            state.isCurrentlyDrawing = v;
        },
        setCurrentDrawingTool(t) {
            state.currentDrawingTool = t;
        },
        clearCurrentDrawing() {
            state.currentDrawingPath = [];
            state.isCurrentlyDrawing = false;
            state.currentDrawingTool = '';
        }
    };
    return { getState: () => state, state };
};

/** 1 world unit = 1 screen px, camera at the origin, 50-unit square grid. */
const makeGrid = (gridType = 'square') => ({
    getViewportDimensions: () => ({ width: 1000, height: 800 }),
    screenToWorld: (x, y) => ({ x, y }),
    worldToGrid: (x, y) => ({ x: Math.floor(x / 50), y: Math.floor(y / 50) }),
    gridToWorldCorner: (gx, gy) => ({ x: gx * 50, y: gy * 50 }),
    getGridState: () => ({ gridType })
});

const make = (settings, { zoom = 1, gridType } = {}) => {
    const store = makeStore(settings);
    const frames = [];
    const controller = new DrawingInputController({
        store,
        getGridSystem: () => makeGrid(gridType),
        getOverlayRect: () => ({ left: 0, top: 0 }),
        getGameState: () => ({ zoomLevel: 1, playerZoom: zoom }),
        getMapId: () => 'map-1',
        requestFrame: (cb) => {
            frames.push(cb);
            return frames.length;
        },
        cancelFrame: () => {}
    });
    return {
        c: controller,
        s: store.state,
        flush: () => {
            while (frames.length) frames.shift()();
        }
    };
};

const at = (x, y, extra = {}) => ({ clientX: x, clientY: y, pointerType: 'mouse', ...extra });
const pen = (x, y, pressure) => ({ clientX: x, clientY: y, pointerType: 'pen', pressure });

describe('freehand', () => {
    it('commits a stroke in world coordinates on the Drawings layer, with one history entry', () => {
        const { c, s } = make();
        c.start(at(10, 10), 'freehand');
        for (let i = 1; i <= 20; i++) c.move(at(10 + i * 5, 10 + Math.sin(i / 3) * 30), 'freehand');
        c.end(at(110, 10));
        expect(s.drawingPaths).toHaveLength(1);
        const path = s.drawingPaths[0];
        expect(path.tool).toBe('freehand');
        expect(path.layer).toBe('drawings');
        expect(path.points[0]).toMatchObject({ worldX: 10, worldY: 10, isWorldCoords: true });
        expect(s.undoDepth).toBe(1);
        expect(s.isCurrentlyDrawing).toBe(false);
        expect(s.calls.find((c2) => Array.isArray(c2) && c2[0] === 'add')).toEqual(['add', 'map-1', { allowDuplicate: true, keepLayer: true }]);
    });

    it('records real pen pressure only for a pen with pressure enabled', () => {
        const withPen = make({ usePressure: true });
        withPen.c.start(pen(0, 0, 0.2), 'freehand');
        withPen.c.move(pen(40, 0, 0.9), 'freehand');
        withPen.c.end(pen(80, 0, 0.4));
        const path = withPen.s.drawingPaths[0];
        expect(path.style.hasPressure).toBe(true);
        expect(path.points.every((p) => typeof p.pressure === 'number')).toBe(true);

        const off = make({ usePressure: false });
        off.c.start(pen(0, 0, 0.2), 'freehand');
        off.c.move(pen(40, 0, 0.9), 'freehand');
        off.c.end(pen(80, 0, 0.4));
        expect(off.s.drawingPaths[0].points[0].pressure).toBeUndefined();
        expect(off.s.drawingPaths[0].style.hasPressure).toBeUndefined();

        const mouse = make({ usePressure: true });
        mouse.c.start(at(0, 0), 'freehand');
        mouse.c.move(at(40, 0), 'freehand');
        mouse.c.end(at(80, 0));
        expect(mouse.s.drawingPaths[0].points[0].pressure).toBeUndefined();
    });

    it('thins a dense stroke and caps its size', () => {
        const { c, s } = make();
        c.start(at(0, 0), 'freehand');
        for (let i = 1; i <= 4000; i++) c.move(at(i * 0.5, Math.sin(i / 40) * 80), 'freehand');
        c.end();
        expect(s.drawingPaths[0].points.length).toBeLessThanOrEqual(1200);
        expect(s.drawingPaths[0].points.length).toBeGreaterThan(20);
    });

    it('keeps a lone tap as a dot', () => {
        const { c, s } = make();
        c.start(at(30, 30), 'freehand');
        c.end(at(30, 30));
        expect(s.drawingPaths).toHaveLength(1);
        expect(s.drawingPaths[0].points).toHaveLength(1);
    });

    it('flags a loop that returns to its start so it can be filled later', () => {
        const { c, s } = make();
        c.start(at(200, 0), 'freehand');
        for (let i = 1; i <= 40; i++) {
            const a = (i / 40) * Math.PI * 2;
            c.move(at(100 + Math.cos(a) * 100, Math.sin(a) * 100), 'freehand');
        }
        c.end();
        expect(s.drawingPaths[0].style.closed).toBe(true);
    });

    it('cancel leaves no path and no history entry', () => {
        const { c, s } = make();
        c.start(at(0, 0), 'freehand');
        c.move(at(50, 50), 'freehand');
        c.cancel();
        expect(s.drawingPaths).toHaveLength(0);
        expect(s.undoDepth).toBe(0);
        expect(s.isCurrentlyDrawing).toBe(false);
    });

    it('publishes the live stroke at most once per frame', () => {
        const { c, s, flush } = make();
        c.start(at(0, 0), 'freehand');
        for (let i = 1; i <= 10; i++) c.move(at(i * 10, 0), 'freehand');
        expect(s.currentDrawingPath).toHaveLength(1); // still the start point
        flush();
        expect(s.currentDrawingPath).toHaveLength(11);
        expect(s.currentDrawingTool).toBe('freehand');
    });

    it('stores smoothing and brush from the settings, but not the defaults', () => {
        const custom = make({ brushPreset: 'marker', smoothing: 0.9 });
        custom.c.start(at(0, 0), 'freehand');
        custom.c.move(at(60, 0), 'freehand');
        custom.c.end();
        expect(custom.s.drawingPaths[0].style).toMatchObject({ brush: 'marker', smoothing: 0.9 });

        const plain = make();
        plain.c.start(at(0, 0), 'freehand');
        plain.c.move(at(60, 0), 'freehand');
        plain.c.end();
        expect(plain.s.drawingPaths[0].style.brush).toBeUndefined();
        expect(plain.s.drawingPaths[0].style.smoothing).toBeUndefined();
    });
});

describe('shapes', () => {
    it('draws free-position shapes when snapping is off', () => {
        const { c, s } = make({ drawSnap: false });
        c.start(at(13, 17), 'rectangle');
        c.move(at(113, 87), 'rectangle');
        c.end(at(113, 87));
        expect(s.drawingPaths[0].points).toEqual([
            { worldX: 13, worldY: 17, isWorldCoords: true },
            { worldX: 113, worldY: 87, isWorldCoords: true }
        ]);
    });

    it('snaps square-grid corners to the nearest grid intersection', () => {
        const { c, s } = make({ drawSnap: true });
        c.start(at(13, 17), 'rectangle');
        c.end(at(138, 87));
        expect(s.drawingPaths[0].points).toEqual([
            { worldX: 0, worldY: 0, isWorldCoords: true },
            { worldX: 150, worldY: 100, isWorldCoords: true }
        ]);
    });

    it('keeps cell-based points on hex grids so legacy hex rendering still applies', () => {
        const { c, s } = make({ drawSnap: true }, { gridType: 'hex' });
        c.start(at(13, 17), 'rectangle');
        c.end(at(138, 87));
        expect(s.drawingPaths[0].points[0]).toEqual({ gridX: 0, gridY: 0 });
        expect(s.drawingPaths[0].points[1]).toEqual({ gridX: 2, gridY: 1 });
    });

    it('ignores a tap with no drag', () => {
        const { c, s } = make();
        c.start(at(50, 50), 'ellipse');
        c.end(at(51, 51));
        expect(s.drawingPaths).toHaveLength(0);
        expect(s.undoDepth).toBe(0);
    });

    it('stores arrow style options and line styles', () => {
        const { c, s } = make({ arrowHead: 'both', lineStyle: 'dashed', sketch: true });
        c.start(at(0, 0), 'arrow');
        c.end(at(200, 0));
        expect(s.drawingPaths[0].style).toMatchObject({ arrowHead: 'both', lineStyle: 'dashed', sketch: true });
    });

    it('shift constrains a line to 15 degree steps and a rectangle to a square', () => {
        const line = make();
        line.c.start(at(0, 0), 'line');
        line.c.move(at(100, 3, { shiftKey: true }), 'line');
        line.c.end(at(100, 3, { shiftKey: true }));
        const end = line.s.drawingPaths[0].points[1];
        expect(Math.abs(end.worldY)).toBeLessThan(0.01);

        const rect = make();
        rect.c.start(at(0, 0), 'rectangle');
        rect.c.move(at(100, 40, { shiftKey: true }), 'rectangle');
        rect.c.end(at(100, 40, { shiftKey: true }));
        const corner = rect.s.drawingPaths[0].points[1];
        expect(corner.worldX).toBe(corner.worldY);
    });

    it('cancel drops the preview without a trace', () => {
        const { c, s } = make();
        c.start(at(0, 0), 'circle');
        c.move(at(80, 0), 'circle');
        c.cancel();
        expect(s.drawingPaths).toHaveLength(0);
        expect(s.isCurrentlyDrawing).toBe(false);
    });
});

describe('polygon', () => {
    const tap = (c, x, y) => {
        c.start(at(x, y), 'polygon');
        c.end(at(x, y));
    };

    it('collects corners across taps and finishes explicitly', () => {
        const { c, s } = make();
        tap(c, 0, 0);
        tap(c, 100, 0);
        tap(c, 100, 100);
        expect(c.hasPendingPolygon()).toBe(true);
        expect(s.drawingPaths).toHaveLength(0);
        expect(c.finishPolygon()).toBe(true);
        expect(s.drawingPaths[0].tool).toBe('polygon');
        expect(s.drawingPaths[0].points).toHaveLength(3);
        expect(c.hasPendingPolygon()).toBe(false);
        expect(s.undoDepth).toBe(1);
    });

    it('closes when the first corner is tapped again', () => {
        const { c, s } = make();
        tap(c, 0, 0);
        tap(c, 100, 0);
        tap(c, 100, 100);
        tap(c, 4, 4);
        expect(s.drawingPaths).toHaveLength(1);
        expect(s.drawingPaths[0].points).toHaveLength(3);
    });

    it('refuses to finish with fewer than three corners', () => {
        const { c, s } = make();
        tap(c, 0, 0);
        tap(c, 100, 0);
        expect(c.finishPolygon()).toBe(false);
        expect(s.drawingPaths).toHaveLength(0);
        expect(c.hasPendingPolygon()).toBe(false);
    });

    it('a finger places the corner where it lifts, previewing while dragging', () => {
        const { c, s, flush } = make();
        c.start({ clientX: 10, clientY: 10, pointerType: 'touch' }, 'polygon');
        c.move({ clientX: 60, clientY: 40, pointerType: 'touch' }, 'polygon');
        flush();
        expect(s.currentDrawingPath).toHaveLength(1);
        c.end({ clientX: 60, clientY: 40, pointerType: 'touch' });
        expect(c.poly.points[0]).toMatchObject({ worldX: 60, worldY: 40 });
    });

    it('undoPolygonPoint removes the last corner and abandons an empty polygon', () => {
        const { c, s } = make();
        tap(c, 0, 0);
        tap(c, 100, 0);
        c.undoPolygonPoint();
        expect(c.poly.points).toHaveLength(1);
        c.undoPolygonPoint();
        expect(c.hasPendingPolygon()).toBe(false);
        expect(s.isCurrentlyDrawing).toBe(false);
    });

    it('a cancelled gesture keeps the corners already placed; reset discards them', () => {
        const { c } = make();
        tap(c, 0, 0);
        tap(c, 100, 0);
        c.start(at(50, 50), 'polygon');
        c.cancel();
        expect(c.poly.points).toHaveLength(2);
        c.reset();
        expect(c.hasPendingPolygon()).toBe(false);
    });

    it('a mouse rubber-bands the next corner on hover', () => {
        const { c, s, flush } = make();
        tap(c, 0, 0);
        c.move(at(80, 80), 'polygon');
        flush();
        expect(s.currentDrawingPath).toHaveLength(2);
    });
});

describe('fill bucket', () => {
    const seedRect = (s) => {
        s.drawingPaths = [{
            id: 'r1', tool: 'rectangle', layer: 'drawings',
            points: [{ worldX: 0, worldY: 0, isWorldCoords: true }, { worldX: 100, worldY: 100, isWorldCoords: true }],
            style: { strokeColor: '#000', fillColor: 'transparent', strokeWidth: 2, opacity: 1 }
        }];
    };

    it('fills the shape under the pointer with the fill colour', () => {
        const { c, s } = make({ fillColor: '#ff0000' });
        seedRect(s);
        c.start(at(50, 50), 'fill');
        c.end(at(50, 50));
        expect(s.drawingPaths[0].style.fillColor).toBe('#ff0000');
        expect(s.undoDepth).toBe(1);
    });

    it('uses the stroke colour when no fill colour is set', () => {
        const { c, s } = make({ fillColor: 'transparent', strokeColor: '#00aa00' });
        seedRect(s);
        c.start(at(50, 50), 'fill');
        c.end(at(50, 50));
        expect(s.drawingPaths[0].style.fillColor).toBe('#00aa00');
    });

    it('does nothing (and records no history) when nothing fillable is hit', () => {
        const { c, s } = make({ fillColor: '#ff0000' });
        seedRect(s);
        c.start(at(500, 500), 'fill');
        c.end(at(500, 500));
        expect(s.drawingPaths[0].style.fillColor).toBe('transparent');
        expect(s.undoDepth).toBe(0);
    });
});

describe('edit tool', () => {
    const seed = (s) => {
        s.drawingPaths = [
            {
                id: 'a', tool: 'rectangle', layer: 'drawings',
                points: [{ worldX: 0, worldY: 0, isWorldCoords: true }, { worldX: 100, worldY: 100, isWorldCoords: true }],
                style: { strokeColor: '#ff0000', fillColor: 'transparent', strokeWidth: 4, opacity: 1 }
            },
            {
                id: 'b', tool: 'line', layer: 'drawings',
                points: [{ worldX: 300, worldY: 0, isWorldCoords: true }, { worldX: 400, worldY: 0, isWorldCoords: true }],
                style: { strokeColor: '#0000ff', fillColor: 'transparent', strokeWidth: 2, opacity: 1 }
            }
        ];
    };

    it('tapping an outline selects it and loads its style into the panel settings', () => {
        const { c, s } = make();
        seed(s);
        c.start(at(50, 0), 'draw_edit');
        c.end(at(50, 0));
        expect(s.selectedDrawings).toEqual(['a']);
        expect(s.toolSettings.strokeColor).toBe('#ff0000');
        expect(s.toolSettings.strokeWidth).toBe(4);
        expect(s.undoDepth).toBe(0); // selecting is not an edit
    });

    it('tapping empty space clears the selection', () => {
        const { c, s } = make();
        seed(s);
        s.selectedDrawings = ['a'];
        c.start(at(700, 700), 'draw_edit');
        c.end(at(700, 700));
        expect(s.selectedDrawings).toEqual([]);
    });

    it('dragging moves the drawing in one history step, as free-position points', () => {
        const { c, s, flush } = make({ drawSnap: false });
        seed(s);
        c.start(at(50, 0), 'draw_edit');
        c.move(at(80, 40), 'draw_edit');
        c.move(at(150, 90), 'draw_edit');
        flush();
        c.end(at(150, 90));
        const moved = s.drawingPaths.find((p) => p.id === 'a');
        expect(moved.points[0]).toMatchObject({ worldX: 100, worldY: 90 });
        expect(moved.points[1]).toMatchObject({ worldX: 200, worldY: 190 });
        expect(s.undoDepth).toBe(1);
    });

    it('a tiny wobble while tapping does not move or record anything', () => {
        const { c, s } = make({ drawSnap: false });
        seed(s);
        c.start(at(50, 0), 'draw_edit');
        c.move(at(51, 1), 'draw_edit');
        c.end(at(51, 1));
        expect(s.undoDepth).toBe(0);
        expect(s.drawingPaths[0].points[0]).toMatchObject({ worldX: 0, worldY: 0 });
    });

    it('snaps a moved drawing so its top-left corner lands on the grid', () => {
        const { c, s, flush } = make({ drawSnap: true });
        seed(s);
        c.start(at(50, 0), 'draw_edit');
        c.move(at(73, 21), 'draw_edit');
        flush();
        c.end(at(73, 21));
        const moved = s.drawingPaths.find((p) => p.id === 'a');
        expect(moved.points[0].worldX % 50).toBe(0);
        expect(moved.points[0].worldY % 50).toBe(0);
    });

    it('dragging a corner handle of the selected drawing resizes it', () => {
        const { c, s, flush } = make({ drawSnap: false });
        seed(s);
        s.selectedDrawings = ['a'];
        // Bounds are padded by half the stroke width: the se corner sits at 102,102.
        c.start(at(102, 102), 'draw_edit');
        c.move(at(202, 152), 'draw_edit');
        flush();
        c.end(at(202, 152));
        const resized = s.drawingPaths.find((p) => p.id === 'a');
        expect(resized.points[1].worldX).toBeGreaterThan(190);
        expect(resized.points[1].worldX).toBeLessThan(205);
        // The opposite (north-west) corner is the fixed anchor.
        expect(resized.points[0].worldX).toBeLessThan(5);
        expect(resized.points[0].worldY).toBeLessThan(5);
        expect(s.undoDepth).toBe(1);
    });

    it('cancelling a drag restores the drawing and removes its history entry', () => {
        const { c, s, flush } = make({ drawSnap: false });
        seed(s);
        c.start(at(50, 0), 'draw_edit');
        c.move(at(150, 90), 'draw_edit');
        flush();
        expect(s.undoDepth).toBe(1);
        c.cancel();
        const path = s.drawingPaths.find((p) => p.id === 'a');
        expect(path.points[0]).toMatchObject({ worldX: 0, worldY: 0 });
        expect(s.undoDepth).toBe(0);
    });

    it('does not select drawings on hidden or locked layers', () => {
        const { c, s } = make();
        seed(s);
        s.drawingLayers = [{ id: 'drawings', visible: true, locked: true }];
        c.start(at(50, 0), 'draw_edit');
        c.end(at(50, 0));
        expect(s.selectedDrawings).toEqual([]);
    });

    it('never selects legacy screen-space strokes', () => {
        const { c, s } = make();
        s.drawingPaths = [{
            id: 'old', tool: 'freehand', layer: 'drawings',
            points: [{ x: 10, y: 10, isFreehand: true }, { x: 90, y: 10, isFreehand: true }],
            style: { strokeColor: '#000', strokeWidth: 2 }
        }];
        c.start(at(50, 10), 'draw_edit');
        c.end(at(50, 10));
        expect(s.selectedDrawings).toEqual([]);
    });

    it('deleteSelection removes the selection in one history step', () => {
        const { c, s } = make();
        seed(s);
        s.selectedDrawings = ['a'];
        expect(c.deleteSelection()).toBe(1);
        expect(s.drawingPaths.map((p) => p.id)).toEqual(['b']);
        expect(s.undoDepth).toBe(1);
    });

    it('duplicateSelection copies the drawing offset and selects the copy', () => {
        const { c, s } = make();
        seed(s);
        s.selectedDrawings = ['b'];
        expect(c.duplicateSelection()).toBe(1);
        expect(s.drawingPaths).toHaveLength(3);
        const copy = s.drawingPaths[2];
        expect(copy.id).not.toBe('b');
        expect(copy.points[0].worldX).toBeGreaterThan(300);
        expect(s.selectedDrawings).toEqual([copy.id]);
    });
});
