import {
    pointToWorld,
    pathWorldPoints,
    simplifyPolyline,
    simplifyToBudget,
    isClosedStroke,
    strokeSeed,
    lineDashFor,
    arrowHeadPoints,
    hitTestPath,
    hitTestFill,
    pathBounds,
    translatePath,
    scalePathAbout,
    boxHandles,
    resizeFactors
} from '../drawingGeometry';

// Grid cell (gx, gy) has its corner at (gx * 50, gy * 50) in these tests.
const g2w = (gx, gy) => ({ x: gx * 50, y: gy * 50 });
const wp = (x, y, extra = {}) => ({ worldX: x, worldY: y, isWorldCoords: true, ...extra });

describe('point resolution', () => {
    it('reads world points directly', () => {
        expect(pointToWorld(wp(12, 34), g2w)).toEqual({ x: 12, y: 34 });
    });

    it('resolves grid points through the injected converter', () => {
        expect(pointToWorld({ gridX: 2, gridY: 3 }, g2w)).toEqual({ x: 100, y: 150 });
    });

    it('returns null for legacy screen-space points and for grid points without a converter', () => {
        expect(pointToWorld({ x: 5, y: 5, isFreehand: true }, g2w)).toBeNull();
        expect(pointToWorld({ gridX: 1, gridY: 1 })).toBeNull();
    });

    it('keeps pressure on resolved points and drops unresolvable ones', () => {
        const path = { points: [wp(0, 0, { pressure: 0.7 }), { x: 1, y: 1, isFreehand: true }, wp(5, 5)] };
        expect(pathWorldPoints(path, g2w)).toEqual([{ x: 0, y: 0, pressure: 0.7 }, { x: 5, y: 5 }]);
    });
});

describe('stroke simplification', () => {
    it('removes collinear points but keeps the corner', () => {
        const pts = [];
        for (let i = 0; i <= 10; i++) pts.push({ x: i, y: 0 });
        for (let i = 1; i <= 10; i++) pts.push({ x: 10, y: i });
        const out = simplifyPolyline(pts, 0.1);
        expect(out).toEqual([{ x: 0, y: 0 }, { x: 10, y: 0 }, { x: 10, y: 10 }]);
    });

    it('preserves extra fields such as pressure on surviving points', () => {
        const out = simplifyPolyline([{ x: 0, y: 0, pressure: 0.2 }, { x: 5, y: 9, pressure: 0.9 }, { x: 10, y: 0, pressure: 0.4 }], 1);
        expect(out.map((p) => p.pressure)).toEqual([0.2, 0.9, 0.4]);
    });

    it('is a no-op for tiny inputs or a zero tolerance', () => {
        const two = [{ x: 0, y: 0 }, { x: 1, y: 1 }];
        expect(simplifyPolyline(two, 5)).toEqual(two);
        const three = [{ x: 0, y: 0 }, { x: 1, y: 5 }, { x: 2, y: 0 }];
        expect(simplifyPolyline(three, 0)).toEqual(three);
    });

    it('handles a very long stroke without overflowing the stack', () => {
        const pts = Array.from({ length: 50000 }, (_, i) => ({ x: i, y: Math.sin(i / 50) * 20 }));
        expect(() => simplifyPolyline(pts, 0.5)).not.toThrow();
    });

    it('simplifyToBudget enforces the point budget', () => {
        const pts = Array.from({ length: 5000 }, (_, i) => ({ x: i, y: Math.sin(i / 7) * 30 + (i % 3) }));
        const out = simplifyToBudget(pts, 0.01, 400);
        expect(out.length).toBeLessThanOrEqual(400);
        expect(out[0]).toBe(pts[0]);
        expect(out[out.length - 1]).toBe(pts[pts.length - 1]);
    });
});

describe('closed strokes', () => {
    it('detects a loop that returns to its start', () => {
        const loop = [{ x: 0, y: 0 }, { x: 50, y: 0 }, { x: 50, y: 50 }, { x: 1, y: 2 }];
        expect(isClosedStroke(loop, 5)).toBe(true);
        expect(isClosedStroke(loop, 1)).toBe(false);
    });

    it('never treats a short scribble as closed', () => {
        expect(isClosedStroke([{ x: 0, y: 0 }, { x: 1, y: 1 }, { x: 0, y: 0 }], 5)).toBe(false);
    });
});

describe('style helpers', () => {
    it('strokeSeed is stable per path and differs between paths', () => {
        expect(strokeSeed({ id: 'a1' })).toBe(strokeSeed({ id: 'a1' }));
        expect(strokeSeed({ id: 'a1' })).not.toBe(strokeSeed({ id: 'a2' }));
        expect(strokeSeed({ id: 'a1' })).toBeGreaterThan(0);
    });

    it('lineDashFor returns solid, dashed and dotted patterns', () => {
        expect(lineDashFor('solid', 4)).toEqual([]);
        expect(lineDashFor(undefined, 4)).toEqual([]);
        expect(lineDashFor('dashed', 2)).toEqual([8, 5]);
        const dotted = lineDashFor('dotted', 2);
        expect(dotted[0]).toBeLessThan(0.1);
        expect(dotted[1]).toBeGreaterThan(2);
    });

    it('arrowHeadPoints puts both barbs behind the tip', () => {
        const [a, b] = arrowHeadPoints({ x: 0, y: 0 }, { x: 100, y: 0 }, 10);
        expect(a.x).toBeLessThan(100);
        expect(b.x).toBeLessThan(100);
        expect(a.y).toBeCloseTo(-b.y, 6);
        expect(arrowHeadPoints({ x: 3, y: 3 }, { x: 3, y: 3 }, 10)).toEqual([]);
    });
});

describe('hit testing', () => {
    const freehand = { tool: 'freehand', style: { strokeWidth: 4 }, points: [wp(0, 0), wp(100, 0), wp(100, 100)] };

    it('hits near a freehand segment, not far from it', () => {
        expect(hitTestPath(freehand, 50, 6, 5, g2w)).toBe(true);
        expect(hitTestPath(freehand, 50, 40, 5, g2w)).toBe(false);
    });

    it('hits between sparse points, which a per-vertex test would miss', () => {
        // Midpoint of a 100-unit segment is 50 from either vertex.
        expect(hitTestPath(freehand, 50, 1, 3, g2w)).toBe(true);
    });

    it('a rectangle is hit on its outline but not in its interior', () => {
        const rect = { tool: 'rectangle', style: { strokeWidth: 2 }, points: [wp(0, 0), wp(100, 60)] };
        expect(hitTestPath(rect, 50, 0, 4, g2w)).toBe(true);
        expect(hitTestPath(rect, 100, 30, 4, g2w)).toBe(true);
        expect(hitTestPath(rect, 50, 30, 4, g2w)).toBe(false);
    });

    it('works for grid-snapped shapes via the converter', () => {
        const rect = { tool: 'rectangle', style: { strokeWidth: 2 }, points: [{ gridX: 0, gridY: 0 }, { gridX: 2, gridY: 1 }] };
        expect(hitTestPath(rect, 100, 25, 4, g2w)).toBe(true);
    });

    it('a circle is hit on its circumference', () => {
        const circle = { tool: 'circle', style: { strokeWidth: 2 }, points: [wp(0, 0), wp(40, 0)] };
        expect(hitTestPath(circle, 0, 40, 3, g2w)).toBe(true);
        expect(hitTestPath(circle, 0, 0, 3, g2w)).toBe(false);
    });

    it('an ellipse is hit on its outline only', () => {
        const ellipse = { tool: 'ellipse', style: { strokeWidth: 2 }, points: [wp(-50, -20), wp(50, 20)] };
        expect(hitTestPath(ellipse, 50, 0, 3, g2w)).toBe(true);
        expect(hitTestPath(ellipse, 0, 20, 3, g2w)).toBe(true);
        expect(hitTestPath(ellipse, 0, 0, 3, g2w)).toBe(false);
    });

    it('lines and arrows hit along their length', () => {
        const arrow = { tool: 'arrow', style: { strokeWidth: 2 }, points: [wp(0, 0), wp(100, 100)] };
        expect(hitTestPath(arrow, 50, 52, 3, g2w)).toBe(true);
        expect(hitTestPath(arrow, 50, 80, 3, g2w)).toBe(false);
    });

    it('text is hit anywhere inside its label box', () => {
        const text = { tool: 'text', text: 'Hello', style: { fontSize: 20 }, points: [{ gridX: 1, gridY: 1 }] };
        expect(hitTestPath(text, 60, 60, 2, g2w)).toBe(true);
        expect(hitTestPath(text, 400, 400, 2, g2w)).toBe(false);
    });

    it('rejects malformed paths instead of throwing', () => {
        expect(hitTestPath(null, 0, 0, 5, g2w)).toBe(false);
        expect(hitTestPath({ tool: 'line', points: [] }, 0, 0, 5, g2w)).toBe(false);
        expect(hitTestPath({ tool: 'line', points: [{ x: 1, y: 1, isFreehand: true }] }, 0, 0, 5, g2w)).toBe(false);
    });
});

describe('fill hit testing', () => {
    it('rectangle, circle, ellipse and polygon interiors', () => {
        expect(hitTestFill({ tool: 'rectangle', points: [wp(0, 0), wp(10, 10)] }, 5, 5, g2w)).toBe(true);
        expect(hitTestFill({ tool: 'rectangle', points: [wp(0, 0), wp(10, 10)] }, 15, 5, g2w)).toBe(false);
        expect(hitTestFill({ tool: 'circle', points: [wp(0, 0), wp(10, 0)] }, 3, 3, g2w)).toBe(true);
        expect(hitTestFill({ tool: 'ellipse', points: [wp(-10, -5), wp(10, 5)] }, 0, 4, g2w)).toBe(true);
        expect(hitTestFill({ tool: 'ellipse', points: [wp(-10, -5), wp(10, 5)] }, 9, 4, g2w)).toBe(false);
        const tri = { tool: 'polygon', points: [wp(0, 0), wp(10, 0), wp(5, 10)] };
        expect(hitTestFill(tri, 5, 3, g2w)).toBe(true);
        expect(hitTestFill(tri, 0, 9, g2w)).toBe(false);
    });

    it('freehand only counts as fillable once it was drawn as a closed loop', () => {
        const pts = [wp(0, 0), wp(10, 0), wp(10, 10), wp(0, 10)];
        expect(hitTestFill({ tool: 'freehand', style: {}, points: pts }, 5, 5, g2w)).toBe(false);
        expect(hitTestFill({ tool: 'freehand', style: { closed: true }, points: pts }, 5, 5, g2w)).toBe(true);
    });

    it('lines and text are never fillable', () => {
        expect(hitTestFill({ tool: 'line', points: [wp(0, 0), wp(10, 10)] }, 5, 5, g2w)).toBe(false);
        expect(hitTestFill({ tool: 'text', points: [wp(0, 0)] }, 0, 0, g2w)).toBe(false);
    });
});

describe('editing paths', () => {
    it('translatePath moves world points and un-snaps grid points', () => {
        const moved = translatePath({ tool: 'rectangle', points: [{ gridX: 1, gridY: 1 }, { gridX: 3, gridY: 2 }] }, 10, -5, g2w);
        expect(moved.points).toEqual([wp(60, 45), wp(160, 95)]);
    });

    it('translatePath keeps pressure and leaves legacy points alone', () => {
        const legacy = { x: 4, y: 4, isFreehand: true };
        const moved = translatePath({ tool: 'freehand', points: [wp(1, 1, { pressure: 0.6 }), legacy] }, 3, 3, g2w);
        expect(moved.points[0]).toEqual(wp(4, 4, { pressure: 0.6 }));
        expect(moved.points[1]).toBe(legacy);
    });

    it('translatePath does not mutate its input', () => {
        const path = { tool: 'line', points: [wp(0, 0), wp(10, 10)] };
        translatePath(path, 5, 5, g2w);
        expect(path.points[0]).toEqual(wp(0, 0));
    });

    it('scalePathAbout scales about the anchor', () => {
        const scaled = scalePathAbout({ tool: 'line', points: [wp(10, 10), wp(20, 20)] }, 2, 2, 10, 10, g2w);
        expect(scaled.points).toEqual([wp(10, 10), wp(30, 30)]);
    });

    it('scalePathAbout scales text size with the path', () => {
        const scaled = scalePathAbout({ tool: 'text', text: 'x', style: { fontSize: 20 }, points: [wp(0, 0)] }, 2, 2, 0, 0, g2w);
        expect(scaled.style.fontSize).toBe(40);
    });

    it('pathBounds includes stroke width and works for circles', () => {
        const box = pathBounds({ tool: 'circle', style: { strokeWidth: 4 }, points: [wp(0, 0), wp(10, 0)] }, g2w);
        expect(box).toEqual({ minX: -12, minY: -12, maxX: 12, maxY: 12 });
    });
});

describe('corner-handle resizing', () => {
    const box = { minX: 0, minY: 0, maxX: 100, maxY: 50 };

    it('returns the four corners', () => {
        expect(boxHandles(box).map((h) => h.id)).toEqual(['nw', 'ne', 'se', 'sw']);
    });

    it('dragging se doubles the box about the nw anchor', () => {
        const { sx, sy, anchor } = resizeFactors(box, 'se', { x: 200, y: 100 }, false);
        expect(anchor).toEqual({ x: 0, y: 0 });
        expect(sx).toBe(2);
        expect(sy).toBe(2);
    });

    it('uniform resize follows the dominant axis', () => {
        const { sx, sy } = resizeFactors(box, 'se', { x: 300, y: 55 }, true);
        expect(sx).toBe(3);
        expect(sy).toBe(3);
    });

    it('never collapses a shape to nothing', () => {
        const { sx } = resizeFactors(box, 'se', { x: 0, y: 0 }, true);
        expect(Math.abs(sx)).toBeGreaterThan(0);
    });
});
