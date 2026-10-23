import { createCameraGesture } from '../cameraGesture';

/**
 * A tiny stand-in for the grid system + game store:
 *   world = camera + screen / (zoomLevel * playerZoom)
 * which is exactly the relationship the real 2D projection has.
 */
const makeWorld = (init = {}) => {
    const state = {
        cameraX: 0,
        cameraY: 0,
        zoomLevel: 1,
        playerZoom: 1,
        minPlayerZoom: 0.1,
        maxPlayerZoom: 10,
        setPlayerZoom(z) {
            state.playerZoom = z;
        },
        moveCameraBy(dx, dy) {
            state.cameraX += dx;
            state.cameraY += dy;
        },
        ...init
    };
    const gridSystem = {
        getViewportDimensions: () => ({ width: 1000, height: 800 }),
        screenToWorld: (x, y) => {
            const z = state.zoomLevel * state.playerZoom;
            return { x: state.cameraX + x / z, y: state.cameraY + y / z };
        }
    };
    const frames = [];
    const gesture = createCameraGesture({
        getGridSystem: () => gridSystem,
        getGameState: () => state,
        requestFrame: (cb) => frames.push(cb),
        cancelFrame: (id) => frames.splice(id - 1, 1),
        zoomSensitivity: 1,
        ...init.opts
    });
    return {
        state,
        gesture,
        flush() {
            while (frames.length) frames.shift()();
        },
        pendingFrames: () => frames.length
    };
};

describe('createCameraGesture', () => {
    it('one finger pans so the grabbed world point stays under the finger', () => {
        const w = makeWorld();
        const grabbed = { x: 100, y: 100 };
        w.gesture.begin([grabbed]);
        w.gesture.update([{ x: 160, y: 130 }]);
        w.flush();
        // Finger moved (+60,+30) screen px at zoom 1: the camera moves the other way.
        expect(w.state.cameraX).toBeCloseTo(-60);
        expect(w.state.cameraY).toBeCloseTo(-30);
        expect(w.state.playerZoom).toBe(1);
    });

    it('pan distance is scaled by zoom', () => {
        const w = makeWorld({ playerZoom: 2 });
        w.gesture.begin([{ x: 0, y: 0 }]);
        w.gesture.update([{ x: 100, y: 0 }]);
        w.flush();
        expect(w.state.cameraX).toBeCloseTo(-50);
    });

    it('two-finger pinch zooms about the midpoint, keeping that world point fixed', () => {
        const w = makeWorld();
        const a = { x: 400, y: 300 };
        const b = { x: 600, y: 300 }; // midpoint (500, 300)
        w.gesture.begin([a, b]);
        const pinnedBefore = { x: 500, y: 300 }; // camera 0, zoom 1
        w.gesture.update([{ x: 300, y: 300 }, { x: 700, y: 300 }]); // spread doubles, midpoint unchanged
        w.flush();
        expect(w.state.playerZoom).toBeCloseTo(2);
        const z = w.state.zoomLevel * w.state.playerZoom;
        expect(w.state.cameraX + 500 / z).toBeCloseTo(pinnedBefore.x);
        expect(w.state.cameraY + 300 / z).toBeCloseTo(pinnedBefore.y);
    });

    it('moving both fingers while pinching pans and zooms together', () => {
        const w = makeWorld();
        w.gesture.begin([{ x: 400, y: 300 }, { x: 600, y: 300 }]);
        const pinned = { x: 500, y: 300 };
        w.gesture.update([{ x: 450, y: 350 }, { x: 750, y: 350 }]); // spread x1.5, midpoint (600, 350)
        w.flush();
        const z = w.state.zoomLevel * w.state.playerZoom;
        expect(w.state.playerZoom).toBeCloseTo(1.5);
        expect(w.state.cameraX + 600 / z).toBeCloseTo(pinned.x);
        expect(w.state.cameraY + 350 / z).toBeCloseTo(pinned.y);
    });

    it('respects the player zoom limits', () => {
        const w = makeWorld();
        w.gesture.begin([{ x: 0, y: 0 }, { x: 10, y: 0 }]);
        w.gesture.update([{ x: -5000, y: 0 }, { x: 5000, y: 0 }]);
        w.flush();
        expect(w.state.playerZoom).toBe(10);
    });

    it('never zooms the effective scale below the safety floor', () => {
        const w = makeWorld();
        w.gesture.begin([{ x: 0, y: 0 }, { x: 1000, y: 0 }]);
        w.gesture.update([{ x: 499, y: 0 }, { x: 501, y: 0 }]);
        w.flush();
        expect(w.state.zoomLevel * w.state.playerZoom).toBeGreaterThanOrEqual(0.6 - 1e-9);
    });

    it('batches many updates into one camera write per frame', () => {
        const w = makeWorld();
        let writes = 0;
        const original = w.state.moveCameraBy;
        w.state.moveCameraBy = (dx, dy) => {
            writes++;
            original(dx, dy);
        };
        w.gesture.begin([{ x: 0, y: 0 }]);
        for (let i = 1; i <= 20; i++) w.gesture.update([{ x: i * 5, y: 0 }]);
        expect(w.pendingFrames()).toBe(1);
        w.flush();
        expect(writes).toBe(1);
        expect(w.state.cameraX).toBeCloseTo(-100);
    });

    it('end() applies the pending frame immediately', () => {
        const w = makeWorld();
        w.gesture.begin([{ x: 0, y: 0 }]);
        w.gesture.update([{ x: 40, y: 0 }]);
        w.gesture.end();
        expect(w.state.cameraX).toBeCloseTo(-40);
        expect(w.gesture.isActive).toBe(false);
    });

    it('abort() drops the pending frame without moving the camera', () => {
        const w = makeWorld();
        w.gesture.begin([{ x: 0, y: 0 }]);
        w.gesture.update([{ x: 40, y: 0 }]);
        w.gesture.abort();
        w.flush();
        expect(w.state.cameraX).toBe(0);
    });

    it('re-anchors when the number of fingers changes so the view does not jump', () => {
        const w = makeWorld();
        w.gesture.begin([{ x: 400, y: 300 }, { x: 600, y: 300 }]);
        w.gesture.update([{ x: 500, y: 300 }]); // one finger lifted
        w.flush();
        expect(w.state.cameraX).toBe(0);
        expect(w.state.playerZoom).toBe(1);
        w.gesture.update([{ x: 520, y: 300 }]);
        w.flush();
        expect(w.state.cameraX).toBeCloseTo(-20);
    });

    it('converts client coordinates through toLocal', () => {
        const w = makeWorld({ opts: { toLocal: (x, y) => ({ x: x - 100, y: y - 50 }) } });
        w.gesture.begin([{ x: 200, y: 150 }]);
        w.gesture.update([{ x: 230, y: 150 }]);
        w.flush();
        expect(w.state.cameraX).toBeCloseTo(-30);
    });

    it('update() before begin() is ignored', () => {
        const w = makeWorld();
        w.gesture.update([{ x: 10, y: 10 }]);
        w.flush();
        expect(w.state.cameraX).toBe(0);
    });
});
