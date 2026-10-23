import {
    paintDrawingPath,
    paintSelection,
    buildPathStyle,
    sanitizeOpacity,
    shapeOutlineWorld,
    closedCurvePath,
    BRUSH_PRESETS
} from '../drawingRender';

const makeCtx = () => {
    const ops = [];
    const ctx = {
        ops,
        fillStyle: '#000',
        strokeStyle: '#000',
        lineWidth: 1,
        globalAlpha: 1,
        lineCap: 'butt',
        lineJoin: 'miter',
        fills: [],
        alphaAtFill: [],
        dashes: [],
        save: () => ops.push('save'),
        restore: () => ops.push('restore'),
        beginPath: () => ops.push('beginPath'),
        moveTo: (x, y) => ops.push(['moveTo', x, y]),
        lineTo: (x, y) => ops.push(['lineTo', x, y]),
        quadraticCurveTo: () => ops.push('quad'),
        closePath: () => ops.push('closePath'),
        arc: (x, y, r) => ops.push(['arc', x, y, r]),
        fill: () => {
            ctx.fills.push(ctx.fillStyle);
            ctx.alphaAtFill.push(ctx.globalAlpha);
            ops.push('fill');
        },
        stroke: () => ops.push(['stroke', ctx.strokeStyle, ctx.lineWidth]),
        setLineDash: (d) => ctx.dashes.push(d)
    };
    return ctx;
};

// Identity projection: world units == screen px.
const env = (extra = {}) => ({
    gridToWorldCorner: (gx, gy) => ({ x: gx * 50, y: gy * 50 }),
    worldToScreen: (x, y) => ({ x, y }),
    zoom: 1,
    ...extra
});

const wp = (x, y, extra = {}) => ({ worldX: x, worldY: y, isWorldCoords: true, ...extra });
const style = (extra = {}) => ({ strokeColor: '#ff0000', fillColor: 'transparent', strokeWidth: 4, opacity: 1, ...extra });
const strokes = (ctx) => ctx.ops.filter((o) => Array.isArray(o) && o[0] === 'stroke');

describe('sanitizeOpacity', () => {
    it('keeps valid values and repairs corrupt tiny ones', () => {
        expect(sanitizeOpacity(0.5)).toBe(0.5);
        expect(sanitizeOpacity(2)).toBe(1);
        expect(sanitizeOpacity(0.0001)).toBe(1);
        expect(sanitizeOpacity(undefined)).toBe(1);
    });
});

describe('buildPathStyle', () => {
    const settings = { strokeColor: '#123456', fillColor: '#abcdef', strokeWidth: 6, opacity: 0.7 };

    it('writes only the base style when everything else is default', () => {
        expect(buildPathStyle(settings, 'rectangle')).toEqual({
            strokeColor: '#123456', fillColor: '#abcdef', strokeWidth: 6, opacity: 0.7
        });
        expect(buildPathStyle({ ...settings, brushPreset: 'pen', smoothing: 0.5 }, 'freehand')).toEqual({
            strokeColor: '#123456', fillColor: '#abcdef', strokeWidth: 6, opacity: 0.7
        });
    });

    it('adds brush and smoothing for freehand, line extras for shapes', () => {
        expect(buildPathStyle({ ...settings, brushPreset: 'marker', smoothing: 0.8, lineStyle: 'dashed', sketch: true }, 'freehand'))
            .toMatchObject({ brush: 'marker', smoothing: 0.8 });
        const shape = buildPathStyle({ ...settings, brushPreset: 'marker', lineStyle: 'dotted', sketch: true }, 'ellipse');
        expect(shape).toMatchObject({ lineStyle: 'dotted', sketch: true });
        expect(shape.brush).toBeUndefined();
    });

    it('always records the arrow head and repairs corrupt opacity', () => {
        expect(buildPathStyle({ ...settings, opacity: 0.001 }, 'arrow')).toMatchObject({ arrowHead: 'end', opacity: 1 });
        expect(buildPathStyle({ ...settings, arrowHead: 'both' }, 'arrow').arrowHead).toBe('both');
    });
});

describe('freehand painting', () => {
    const path = (s, points) => ({ id: 'f', tool: 'freehand', points, style: style(s) });
    const pts = [wp(0, 0), wp(50, 50), wp(100, 0)];

    it('fills the outline with the stroke colour, never the (transparent) fill colour', () => {
        const ctx = makeCtx();
        expect(paintDrawingPath(ctx, path({}, pts), env())).toBe(true);
        expect(ctx.fills).toContain('#ff0000');
        expect(ctx.fills).not.toContain('transparent');
    });

    it('repairs corrupt opacity', () => {
        const ctx = makeCtx();
        paintDrawingPath(ctx, path({ opacity: 0.0001 }, pts), env());
        expect(ctx.alphaAtFill[ctx.alphaAtFill.length - 1]).toBe(1);
    });

    it('a highlighter is translucent even at full opacity', () => {
        const ctx = makeCtx();
        paintDrawingPath(ctx, path({ brush: 'highlighter' }, pts), env());
        expect(ctx.alphaAtFill[ctx.alphaAtFill.length - 1]).toBeCloseTo(BRUSH_PRESETS.highlighter.alpha);
    });

    it('draws a closed loop\'s fill behind the stroke', () => {
        const ctx = makeCtx();
        paintDrawingPath(ctx, path({ closed: true, fillColor: '#00ff00' }, [wp(0, 0), wp(100, 0), wp(100, 100), wp(0, 100)]), env());
        expect(ctx.fills[0]).toBe('#00ff00');
        expect(ctx.fills).toContain('#ff0000');
    });

    it('does not fill an open stroke even if a fill colour is set', () => {
        const ctx = makeCtx();
        paintDrawingPath(ctx, path({ fillColor: '#00ff00' }, pts), env());
        expect(ctx.fills).not.toContain('#00ff00');
    });

    it('paints a single point as a dot', () => {
        const ctx = makeCtx();
        paintDrawingPath(ctx, path({}, [wp(20, 20)]), env());
        expect(ctx.ops.some((o) => Array.isArray(o) && o[0] === 'arc')).toBe(true);
    });

    it('still paints legacy screen-space strokes and grid-point strokes', () => {
        const legacy = makeCtx();
        paintDrawingPath(legacy, path({}, [{ x: 0, y: 0, isFreehand: true }, { x: 30, y: 30, isFreehand: true }]), env());
        expect(legacy.fills).toContain('#ff0000');
        const grid = makeCtx();
        paintDrawingPath(grid, path({}, [{ gridX: 0, gridY: 0 }, { gridX: 2, gridY: 2 }]), env());
        expect(grid.fills).toContain('#ff0000');
    });
});

describe('shape painting', () => {
    const shape = (tool, s, points) => ({ id: 's', tool, points, style: style(s) });

    it('projects every vertex of a rectangle', () => {
        const ctx = makeCtx();
        const projected = [];
        paintDrawingPath(ctx, shape('rectangle', {}, [wp(10, 20), wp(110, 80)]), env({
            worldToScreen: (x, y) => {
                projected.push([x, y]);
                return { x: x * 2, y: y * 2 };
            }
        }));
        expect(projected).toEqual([[10, 20], [110, 20], [110, 80], [10, 80]]);
        expect(ctx.ops.filter((o) => Array.isArray(o) && o[0] === 'lineTo')[0]).toEqual(['lineTo', 220, 40]);
        expect(ctx.ops).toContain('closePath');
    });

    it('scales the stroke width with the zoom', () => {
        const ctx = makeCtx();
        paintDrawingPath(ctx, shape('line', { strokeWidth: 4 }, [wp(0, 0), wp(10, 0)]), env({ zoom: 2.5 }));
        expect(strokes(ctx)[0][2]).toBe(10);
    });

    it('fills closed shapes but never a line', () => {
        const rect = makeCtx();
        paintDrawingPath(rect, shape('rectangle', { fillColor: '#00ff00' }, [wp(0, 0), wp(50, 50)]), env());
        expect(rect.fills).toContain('#00ff00');
        const line = makeCtx();
        paintDrawingPath(line, shape('line', { fillColor: '#00ff00' }, [wp(0, 0), wp(50, 50)]), env());
        expect(line.fills).toHaveLength(0);
    });

    it('resolves grid-snapped corners through gridToWorldCorner', () => {
        const ctx = makeCtx();
        paintDrawingPath(ctx, shape('line', {}, [{ gridX: 1, gridY: 1 }, { gridX: 3, gridY: 1 }]), env());
        expect(ctx.ops.find((o) => Array.isArray(o) && o[0] === 'moveTo')).toEqual(['moveTo', 50, 50]);
        expect(ctx.ops.find((o) => Array.isArray(o) && o[0] === 'lineTo')).toEqual(['lineTo', 150, 50]);
    });

    it('draws a circle from centre and edge, and an ellipse inside its bounding corners', () => {
        const circle = shapeOutlineWorld(shape('circle', {}, [wp(100, 100), wp(150, 100)]), env());
        expect(circle.closed).toBe(true);
        const radii = circle.pts.map((p) => Math.hypot(p.x - 100, p.y - 100));
        radii.forEach((r) => expect(r).toBeCloseTo(50));

        const ellipse = shapeOutlineWorld(shape('ellipse', {}, [wp(0, 0), wp(200, 100)]), env());
        const xs = ellipse.pts.map((p) => p.x);
        const ys = ellipse.pts.map((p) => p.y);
        expect(Math.min(...xs)).toBeCloseTo(0);
        expect(Math.max(...xs)).toBeCloseTo(200);
        expect(Math.min(...ys)).toBeCloseTo(0);
        expect(Math.max(...ys)).toBeCloseTo(100);
    });

    it('ignores degenerate shapes', () => {
        expect(shapeOutlineWorld(shape('circle', {}, [wp(5, 5), wp(5, 5)]), env())).toBeNull();
        expect(shapeOutlineWorld(shape('ellipse', {}, [wp(5, 5), wp(5, 5)]), env())).toBeNull();
        expect(shapeOutlineWorld(shape('line', {}, [wp(5, 5)]), env())).toBeNull();
    });

    it('only closes a polygon with three or more corners', () => {
        expect(shapeOutlineWorld(shape('polygon', {}, [wp(0, 0), wp(10, 0)]), env()).closed).toBe(false);
        expect(shapeOutlineWorld(shape('polygon', {}, [wp(0, 0), wp(10, 0), wp(10, 10)]), env()).closed).toBe(true);
    });

    it('dashed and dotted lines set a line dash and restore it afterwards', () => {
        const ctx = makeCtx();
        paintDrawingPath(ctx, shape('line', { lineStyle: 'dashed' }, [wp(0, 0), wp(100, 0)]), env());
        expect(ctx.dashes[0].length).toBe(2);
        expect(ctx.dashes[ctx.dashes.length - 1]).toEqual([]);
    });

    it('uses the legacy hex boundary only for grid-snapped rectangles on hex grids', () => {
        const hexBoundary = jest_fn([{ x: 0, y: 0 }, { x: 60, y: 0 }, { x: 60, y: 60 }]);
        const grid = shapeOutlineWorld(shape('rectangle', {}, [{ gridX: 0, gridY: 0 }, { gridX: 2, gridY: 2 }]), env({ hexBoundary }));
        expect(hexBoundary.calls).toEqual([[0, 2, 0, 2]]);
        expect(grid.pts).toHaveLength(3);
        const free = shapeOutlineWorld(shape('rectangle', {}, [wp(0, 0), wp(100, 100)]), env({ hexBoundary }));
        expect(free.pts).toHaveLength(4);
    });
});

describe('arrows', () => {
    const arrow = (s) => ({ id: 'a', tool: 'arrow', points: [wp(0, 0), wp(200, 0)], style: style(s) });

    it('draws a head at the tip, or at both ends', () => {
        const one = makeCtx();
        paintDrawingPath(one, arrow({ arrowHead: 'end' }), env());
        const both = makeCtx();
        paintDrawingPath(both, arrow({ arrowHead: 'both' }), env());
        const none = makeCtx();
        paintDrawingPath(none, arrow({ arrowHead: 'none' }), env());
        expect(strokes(one)).toHaveLength(2);
        expect(strokes(both)).toHaveLength(3);
        expect(strokes(none)).toHaveLength(1);
        // The end head's barbs sit behind the tip (x < 200).
        const lineTos = one.ops.filter((o) => Array.isArray(o) && o[0] === 'lineTo');
        expect(lineTos[lineTos.length - 1][1]).toBeLessThan(200);
        expect(lineTos[lineTos.length - 2]).toEqual(['lineTo', 200, 0]);
    });
});

describe('sketch style', () => {
    const rough = () => {
        const calls = [];
        return {
            calls,
            polygon: (pts, o) => calls.push(['polygon', pts.length, o]),
            linearPath: (pts, o) => calls.push(['linearPath', pts.length, o]),
            path: (d, o) => calls.push(['path', d, o])
        };
    };

    it('hands sketched shapes to Rough.js with a stable seed per path', () => {
        const r = rough();
        const p = { id: 'seed-me', tool: 'rectangle', points: [wp(0, 0), wp(100, 50)], style: style({ sketch: true, fillColor: '#00ff00' }) };
        paintDrawingPath(makeCtx(), p, env({ rough: r }));
        paintDrawingPath(makeCtx(), p, env({ rough: r }));
        expect(r.calls[0][0]).toBe('polygon');
        expect(r.calls[0][2].seed).toBe(r.calls[1][2].seed);
        expect(r.calls[0][2]).toMatchObject({ stroke: '#ff0000', fill: '#00ff00', fillStyle: 'hachure' });
    });

    it('sketches round shapes as one smooth curve instead of a scratchy polygon', () => {
        const r = rough();
        paintDrawingPath(makeCtx(), { id: 'c', tool: 'circle', points: [wp(0, 0), wp(50, 0)], style: style({ sketch: true }) }, env({ rough: r }));
        expect(r.calls[0][0]).toBe('path');
        expect(r.calls[0][1].startsWith('M ')).toBe(true);
    });

    it('draws sketched lines open and passes the dash pattern through', () => {
        const r = rough();
        paintDrawingPath(makeCtx(), { id: 'l', tool: 'line', points: [wp(0, 0), wp(100, 0)], style: style({ sketch: true, lineStyle: 'dashed' }) }, env({ rough: r }));
        expect(r.calls[0][0]).toBe('linearPath');
        expect(r.calls[0][2].strokeLineDash).toBeTruthy();
    });

    it('falls back to the plain renderer when Rough.js throws', () => {
        const ctx = makeCtx();
        const broken = { polygon: () => { throw new Error('boom'); } };
        paintDrawingPath(ctx, { id: 'x', tool: 'rectangle', points: [wp(0, 0), wp(10, 10)], style: style({ sketch: true }) }, env({ rough: broken }));
        expect(strokes(ctx)).toHaveLength(1);
    });

    it('is ignored for freehand strokes', () => {
        const r = rough();
        paintDrawingPath(makeCtx(), { id: 'f', tool: 'freehand', points: [wp(0, 0), wp(30, 30), wp(60, 0)], style: style({ sketch: true }) }, env({ rough: r }));
        expect(r.calls).toHaveLength(0);
    });
});

describe('paintDrawingPath contract', () => {
    it('declines tools it does not paint so the engine can handle them', () => {
        const ctx = makeCtx();
        expect(paintDrawingPath(ctx, { tool: 'text', points: [wp(0, 0)], style: style() }, env())).toBe(false);
        expect(paintDrawingPath(ctx, { tool: 'wall_draw', points: [wp(0, 0)], style: style() }, env())).toBe(false);
        expect(paintDrawingPath(ctx, { tool: 'line', points: [], style: style() }, env())).toBe(false);
        expect(ctx.ops).toEqual([]);
    });

    it('always balances save/restore', () => {
        const ctx = makeCtx();
        paintDrawingPath(ctx, { tool: 'arrow', points: [wp(0, 0), wp(10, 10)], style: style() }, env());
        paintDrawingPath(ctx, { tool: 'freehand', points: [wp(0, 0), wp(10, 10)], style: style() }, env());
        const saves = ctx.ops.filter((o) => o === 'save').length;
        const restores = ctx.ops.filter((o) => o === 'restore').length;
        expect(saves).toBe(restores);
    });
});

describe('paintSelection', () => {
    it('outlines the padded bounds and draws four corner handles', () => {
        const ctx = makeCtx();
        const box = paintSelection(
            ctx,
            { id: 'a', tool: 'rectangle', points: [wp(0, 0), wp(100, 60)], style: style({ strokeWidth: 4 }) },
            env()
        );
        expect(box).toMatchObject({ minX: -2, minY: -2, maxX: 102, maxY: 62 });
        expect(ctx.ops.filter((o) => Array.isArray(o) && o[0] === 'arc')).toHaveLength(4);
    });

    it('returns null for a path with nothing to select', () => {
        expect(paintSelection(makeCtx(), { tool: 'line', points: [], style: style() }, env())).toBeNull();
    });
});

describe('closedCurvePath', () => {
    it('builds a closed cubic path through every point', () => {
        const d = closedCurvePath([{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }, { x: 0, y: 10 }]);
        expect(d.startsWith('M 0 0')).toBe(true);
        expect(d.endsWith('Z')).toBe(true);
        expect((d.match(/C/g) || []).length).toBe(4);
    });

    it('refuses fewer than three points', () => {
        expect(closedCurvePath([{ x: 0, y: 0 }, { x: 1, y: 1 }])).toBe('');
    });
});

function jest_fn(returnValue) {
    const fn = (...args) => {
        fn.calls.push(args);
        return returnValue;
    };
    fn.calls = [];
    return fn;
}
