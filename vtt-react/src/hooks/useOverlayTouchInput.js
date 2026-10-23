import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { PointerGestureTracker } from '../utils/pointerGestures';
import { createCameraGesture } from '../utils/cameraGesture';
import { getGridSystem } from '../utils/InfiniteGridSystem';
import useGameStore from '../store/gameStore';

const STORAGE_KEY = 'vtt.editor.fingerMode';
const FINGER_MODES = ['auto', 'draw', 'pan'];

const readStoredMode = () => {
    try {
        const value = window.localStorage.getItem(STORAGE_KEY);
        return FINGER_MODES.includes(value) ? value : 'auto';
    } catch (err) {
        return 'auto';
    }
};

const storeMode = (mode) => {
    try {
        window.localStorage.setItem(STORAGE_KEY, mode);
    } catch (err) {
        // private window / blocked storage: the choice just lasts for this session
    }
};

/**
 * What one finger does on the canvas.
 *   'draw' / 'pan'  an explicit choice from the touch bar
 *   'auto'          fingers draw until a stylus shows up, then they pan (the
 *                   stylus draws) - the behaviour people expect on a tablet.
 */
export function resolveFingerAction(mode, penDetected) {
    if (mode === 'draw' || mode === 'pan') return mode;
    return penDetected ? 'pan' : 'draw';
}

const isCoarsePointer = () => {
    try {
        return typeof window !== 'undefined' && !!window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
    } catch (err) {
        return false;
    }
};

/** Elements a passthrough tap should activate, in order of preference. */
const CLICKABLE = 'button, a[href], [role="button"], [role="menuitem"], label, summary, input, select, textarea, [data-token-id], [data-grid-item-id]';

/**
 * Touch + stylus input for the level editor's drawing overlay.
 *
 * Mouse events keep flowing through the editor's existing handlers. Fingers and
 * pens arrive as Pointer Events, are arbitrated by `PointerGestureTracker`
 * (draw vs pan vs pinch, palm rejection, stroke cancellation) and come out the
 * other side as the same start / move / end / cancel calls a mouse would make.
 *
 * @param {object} options
 * @param {React.RefObject<HTMLElement>} options.overlayRef
 * @param {boolean} options.enabled          false while the overlay should ignore touches
 * @param {(x:number, y:number) => boolean} options.isUiAt  true when UI (not the map) is under the point
 * @param {() => boolean} [options.needsFlush]  true when the active tool reads React state between events
 * @param {(ev) => void} options.onStart
 * @param {(ev) => void} options.onMove
 * @param {(ev) => void} options.onEnd
 * @param {() => void}   options.onCancel
 */
export default function useOverlayTouchInput({ overlayRef, enabled, isUiAt, needsFlush, onStart, onMove, onEnd, onCancel }) {
    const [fingerMode, setFingerModeState] = useState(readStoredMode);
    const [penDetected, setPenDetected] = useState(false);
    const [touchSeen, setTouchSeen] = useState(false);
    const [coarse] = useState(isCoarsePointer);

    const latest = useRef({});
    latest.current = { enabled, isUiAt, needsFlush, onStart, onMove, onEnd, onCancel };
    const modeRef = useRef({ mode: fingerMode, pen: penDetected });
    modeRef.current = { mode: fingerMode, pen: penDetected };
    const passthroughRef = useRef(null);
    const touchSeenRef = useRef(false);
    const captureIdsRef = useRef(new Set());

    const setFingerMode = useCallback((mode) => {
        if (!FINGER_MODES.includes(mode)) return;
        setFingerModeState(mode);
        storeMode(mode);
    }, []);

    const { tracker, camera } = useMemo(() => {
        const run = (fn) => {
            if (latest.current.needsFlush && latest.current.needsFlush()) flushSync(fn);
            else fn();
        };
        const cameraGesture = createCameraGesture({
            getGridSystem,
            getGameState: () => useGameStore.getState(),
            toLocal: (x, y) => {
                const rect = overlayRef.current ? overlayRef.current.getBoundingClientRect() : { left: 0, top: 0 };
                return { x: x - rect.left, y: y - rect.top };
            }
        });
        const gestureTracker = new PointerGestureTracker({
            isEnabled: () => !!latest.current.enabled,
            fingerAction: () => resolveFingerAction(modeRef.current.mode, modeRef.current.pen),
            shouldHandle: (e) => !(latest.current.isUiAt && latest.current.isUiAt(e.clientX, e.clientY)),
            // Tools written against React state (terrain, walls, fog...) read
            // "am I drawing?" on the very next event, so each call must land
            // before the next one. Controller-driven tools keep their own state
            // and skip the extra renders.
            onStrokeStart: (ev) => run(() => latest.current.onStart && latest.current.onStart(ev)),
            onStrokeMove: (ev) => run(() => latest.current.onMove && latest.current.onMove(ev)),
            onStrokeEnd: (ev) => run(() => latest.current.onEnd && latest.current.onEnd(ev)),
            onStrokeCancel: () => run(() => latest.current.onCancel && latest.current.onCancel()),
            onPenSeen: () => setPenDetected(true),
            camera: cameraGesture
        });
        return { tracker: gestureTracker, camera: cameraGesture };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Anything half-done must not outlive the editor / the tool.
    useEffect(() => {
        if (!enabled) tracker.reset();
    }, [enabled, tracker]);
    useEffect(() => () => tracker.reset(), [tracker]);

    const capture = (e) => {
        const el = overlayRef.current;
        if (!el || typeof el.setPointerCapture !== 'function') return;
        try {
            el.setPointerCapture(e.pointerId);
            captureIdsRef.current.add(e.pointerId);
        } catch (err) {
            // pointer already gone
        }
    };

    const release = (e) => {
        const el = overlayRef.current;
        if (!el || !captureIdsRef.current.has(e.pointerId)) return;
        captureIdsRef.current.delete(e.pointerId);
        try {
            if (typeof el.releasePointerCapture === 'function') el.releasePointerCapture(e.pointerId);
        } catch (err) {
            // already released
        }
    };

    // A tap on UI that sits under the overlay (action bar, tokens...) never
    // reaches that UI, because a touch has no hover step to make the overlay
    // click-through. Re-deliver it as a click instead.
    const forwardTap = (x, y) => {
        const overlay = overlayRef.current;
        const stack = document.elementsFromPoint ? document.elementsFromPoint(x, y) : [];
        const candidates = stack.filter((el) => el !== overlay && !(overlay && overlay.contains(el)));
        for (const el of candidates) {
            const target = el.closest(CLICKABLE);
            if (!target) continue;
            if (/^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) target.focus();
            else target.click();
            return true;
        }
        return false;
    };

    const onPointerDown = (e) => {
        if (e.pointerType === 'mouse') return;
        if (!touchSeenRef.current) {
            touchSeenRef.current = true;
            setTouchSeen(true);
        }
        const native = e.nativeEvent || e;
        if (!latest.current.enabled) return;

        if (latest.current.isUiAt && latest.current.isUiAt(e.clientX, e.clientY)) {
            passthroughRef.current = { id: e.pointerId, x: e.clientX, y: e.clientY, time: Date.now() };
            return;
        }
        if (tracker.handleDown(native)) {
            e.preventDefault();
            capture(e);
        }
    };

    const onPointerMove = (e) => {
        if (e.pointerType === 'mouse') return;
        if (passthroughRef.current && passthroughRef.current.id === e.pointerId) {
            if (Math.hypot(e.clientX - passthroughRef.current.x, e.clientY - passthroughRef.current.y) > 12) {
                passthroughRef.current = null; // a drag, not a tap
            }
            return;
        }
        if (tracker.handleMove(e.nativeEvent || e)) e.preventDefault();
    };

    const finish = (e, cancelled) => {
        if (e.pointerType === 'mouse') return;
        const pass = passthroughRef.current;
        if (pass && pass.id === e.pointerId) {
            passthroughRef.current = null;
            if (!cancelled && Date.now() - pass.time < 700) forwardTap(pass.x, pass.y);
            return;
        }
        const consumed = tracker.handleUp(e.nativeEvent || e, cancelled);
        release(e);
        if (consumed && !cancelled) e.preventDefault();
    };

    const handlers = {
        onPointerDown,
        onPointerMove,
        onPointerUp: (e) => finish(e, false),
        onPointerCancel: (e) => finish(e, true),
        // The browser took the pointer away (e.g. an OS gesture): treat as cancel.
        onLostPointerCapture: (e) => {
            if (captureIdsRef.current.has(e.pointerId)) finish(e, true);
        }
    };

    return {
        handlers,
        fingerMode,
        setFingerMode,
        fingerAction: resolveFingerAction(fingerMode, penDetected),
        penDetected,
        touchSeen,
        isTouchDevice: coarse || touchSeen,
        camera,
        reset: () => tracker.reset()
    };
}
