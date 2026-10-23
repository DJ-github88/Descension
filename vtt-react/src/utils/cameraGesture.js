/**
 * Anchored pan + pinch-zoom for touch input.
 *
 * The world point that sat under the fingers' midpoint when the gesture began
 * is pinned under the midpoint for the whole gesture, so moving two fingers
 * pans and spreading them zooms about the fingers (not the screen centre). One
 * finger is the same maths without the zoom, which is what "finger pans"
 * mode uses.
 *
 * The world<->screen mapping is delegated to the InfiniteGridSystem (the same
 * object the editor, tokens and grid lines use), so this stays correct in
 * 2D, tilted and rotated views without knowing anything about projections.
 * Camera and zoom writes go through the game store, exactly like the wheel
 * and Grid.jsx pinch code do.
 *
 * Every dependency is injected so the gesture is unit-testable.
 */

const defaultFrame = (cb) => (typeof requestAnimationFrame === 'function' ? requestAnimationFrame(cb) : setTimeout(cb, 16));
const defaultCancelFrame = (id) => (typeof cancelAnimationFrame === 'function' ? cancelAnimationFrame(id) : clearTimeout(id));

const midpointOf = (points) => {
    let x = 0;
    let y = 0;
    for (const p of points) {
        x += p.x;
        y += p.y;
    }
    return { x: x / points.length, y: y / points.length };
};

const spreadOf = (points) => (points.length >= 2 ? Math.max(1, Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y)) : null);

export function createCameraGesture({
    getGridSystem,
    getGameState,
    toLocal = (x, y) => ({ x, y }),
    requestFrame = defaultFrame,
    cancelFrame = defaultCancelFrame,
    minEffectiveZoom = 0.6,
    zoomSensitivity = 1.15
}) {
    let session = null; // { startWorld, startSpread, startZoom, points }
    let frameId = null;

    const worldAt = (clientPoint) => {
        const gridSystem = getGridSystem();
        const viewport = gridSystem.getViewportDimensions();
        const local = toLocal(clientPoint.x, clientPoint.y);
        return { world: gridSystem.screenToWorld(local.x, local.y, viewport.width, viewport.height) };
    };

    const apply = () => {
        frameId = null;
        if (!session) return;
        const points = session.points;
        if (!points || points.length === 0) return;
        const state = getGameState();
        const mid = midpointOf(points);

        // Zoom only when two fingers started the gesture and still drive it.
        if (session.startSpread && points.length >= 2) {
            const baseRatio = spreadOf(points) / session.startSpread;
            const ratio = Math.max(0.05, 1 + (baseRatio - 1) * zoomSensitivity);
            let target = session.startZoom * ratio;
            target = Math.max(state.minPlayerZoom, Math.min(state.maxPlayerZoom, target));
            const zoomLevel = state.zoomLevel || 1;
            if (target * zoomLevel < minEffectiveZoom) target = Math.max(target, minEffectiveZoom / zoomLevel);
            if (Math.abs(target - state.playerZoom) > 1e-6) state.setPlayerZoom(target);
        }

        // Re-read after the zoom write: the pinned world point must land back
        // under the (possibly moved) midpoint at the NEW zoom.
        const { world } = worldAt(mid);
        const dx = session.startWorld.x - world.x;
        const dy = session.startWorld.y - world.y;
        if (Math.abs(dx) > 1e-9 || Math.abs(dy) > 1e-9) {
            getGameState().moveCameraBy(dx, dy);
        }
    };

    const cancelPending = () => {
        if (frameId !== null) {
            cancelFrame(frameId);
            frameId = null;
        }
    };

    return {
        get isActive() {
            return session !== null;
        },

        /** Start (or restart, when the finger count changes) at these client-space points. */
        begin(points) {
            if (!points || points.length === 0) return;
            cancelPending();
            const state = getGameState();
            const mid = midpointOf(points);
            session = {
                startWorld: worldAt(mid).world,
                startSpread: spreadOf(points),
                startZoom: state.playerZoom,
                points: points.map((p) => ({ x: p.x, y: p.y }))
            };
        },

        /** Feed the current client-space points; applied at most once per frame. */
        update(points) {
            if (!session || !points || points.length === 0) return;
            // A changed finger count means a different gesture: re-anchor.
            if (points.length !== session.points.length) {
                this.begin(points);
                return;
            }
            session.points = points.map((p) => ({ x: p.x, y: p.y }));
            if (frameId === null) frameId = requestFrame(apply);
        },

        /** Apply any pending frame immediately and stop. */
        end() {
            if (session && frameId !== null) {
                cancelPending();
                apply();
            }
            cancelPending();
            session = null;
        },

        /** Stop without applying the pending frame. */
        abort() {
            cancelPending();
            session = null;
        }
    };
}

export default createCameraGesture;
