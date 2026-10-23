/**
 * Touch / stylus input state machine for the level-editor drawing surface.
 *
 * The editor's tools are written against mouse events (down / move / up). This
 * class turns Pointer Events from fingers and pens into that same
 * down / move / up stream, and arbitrates everything a mouse never has to:
 *
 *   - one finger draws OR pans (a user choice), a pen always draws
 *   - two fingers always pan + pinch-zoom the camera
 *   - a second finger landing mid-stroke discards the stroke instead of
 *     committing a half-finished line
 *   - palm rejection: touches are ignored while a pen is in use
 *   - the first ~70 ms of a finger-down is buffered, so the first finger of a
 *     two-finger pinch never places an object / starts a wall by accident
 *
 * It is framework-free (no React, no DOM lookups) and every side effect goes
 * through the options, which makes the whole machine unit-testable.
 *
 * Mouse pointers are deliberately NOT handled: the editor keeps its existing
 * mouse path, so mouse behaviour cannot regress.
 */

const DEFAULTS = {
    startDelayMs: 70, // how long a finger-down waits for a possible second finger
    slopPx: 8, // movement that commits a pending finger to a stroke early
    palmRejectMs: 1200 // how long after pen activity touches are ignored
};

const isTouchLike = (type) => type === 'touch' || type === 'pen';

const distance = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

/** Plain, stable copy of the fields tools read, so a buffered event can be
 *  replayed after the browser event object is gone. */
export function snapshotPointerEvent(e) {
    return {
        pointerId: e.pointerId,
        pointerType: e.pointerType,
        clientX: e.clientX,
        clientY: e.clientY,
        // Touch/pen contact is always the "primary button" as far as tools go.
        button: 0,
        buttons: 1,
        pressure: typeof e.pressure === 'number' ? e.pressure : 0.5,
        tiltX: e.tiltX || 0,
        tiltY: e.tiltY || 0,
        shiftKey: !!e.shiftKey,
        ctrlKey: !!e.ctrlKey,
        altKey: !!e.altKey,
        metaKey: !!e.metaKey,
        target: e.target,
        timeStamp: e.timeStamp,
        preventDefault() {},
        stopPropagation() {}
    };
}

export class PointerGestureTracker {
    /**
     * @param {object} options
     * @param {() => boolean} [options.isEnabled]
     * @param {() => ('draw'|'pan')} [options.fingerAction]
     * @param {(ev) => boolean} [options.shouldHandle]   false = leave this touch to the UI under it
     * @param {(ev) => void} options.onStrokeStart
     * @param {(ev) => void} options.onStrokeMove
     * @param {(ev) => void} options.onStrokeEnd
     * @param {() => void} options.onStrokeCancel
     * @param {(ev) => void} [options.onPenSeen]
     * @param {{begin, update, end, abort}} options.camera
     * @param {() => number} [options.now]
     * @param {(fn, ms) => any} [options.setTimer]
     * @param {(id) => void} [options.clearTimer]
     */
    constructor(options) {
        this.o = {
            ...DEFAULTS,
            isEnabled: () => true,
            fingerAction: () => 'draw',
            shouldHandle: () => true,
            onPenSeen: () => {},
            now: () => (typeof performance !== 'undefined' ? performance.now() : Date.now()),
            setTimer: (fn, ms) => setTimeout(fn, ms),
            clearTimer: (id) => clearTimeout(id),
            ...options
        };
        this.pointers = new Map(); // pointerId -> { id, type, x, y }
        this.mode = 'idle'; // idle | pending | stroke | camera
        this.activeId = null;
        this.pending = null; // { id, down, moves, timer }
        this.lastPenAt = -Infinity;
    }

    get isStroking() {
        return this.mode === 'stroke' || this.mode === 'pending';
    }

    _touchPoints() {
        const pts = [];
        for (const p of this.pointers.values()) if (p.type === 'touch') pts.push({ x: p.x, y: p.y });
        return pts;
    }

    _clearPending() {
        if (this.pending) {
            this.o.clearTimer(this.pending.timer);
            this.pending = null;
        }
    }

    _startStrokeFromPending() {
        const p = this.pending;
        if (!p) return;
        this.o.clearTimer(p.timer);
        this.pending = null;
        this.mode = 'stroke';
        this.activeId = p.id;
        this.o.onStrokeStart(p.down);
        // Replay the movement that happened while we were deciding. Tools read
        // fresh state between calls, so this keeps the opening of the stroke.
        for (const m of p.moves) this.o.onStrokeMove(m);
    }

    _penRecentlyUsed() {
        return this.o.now() - this.lastPenAt < this.o.palmRejectMs;
    }

    /** @returns {boolean} true when the event was consumed (caller should preventDefault) */
    handleDown(e) {
        if (!isTouchLike(e.pointerType) || !this.o.isEnabled()) return false;
        if (this.o.shouldHandle && !this.o.shouldHandle(e)) return false;

        const ev = snapshotPointerEvent(e);

        if (e.pointerType === 'pen') {
            this.lastPenAt = this.o.now();
            this.o.onPenSeen(ev);
            // A pen outranks whatever the fingers were doing.
            if (this.mode === 'camera') {
                this.o.camera.end();
                this.mode = 'idle';
            } else if (this.mode === 'pending') {
                this._clearPending();
                this.mode = 'idle';
            } else if (this.mode === 'stroke') {
                if (this.activeId === ev.pointerId) return true; // duplicate down
                this.o.onStrokeCancel();
                this.mode = 'idle';
            }
            // Drop finger tracking: any fingers still down are a resting palm.
            for (const [id, p] of this.pointers) if (p.type === 'touch') this.pointers.delete(id);
            this.pointers.set(ev.pointerId, { id: ev.pointerId, type: 'pen', x: ev.clientX, y: ev.clientY });
            this.mode = 'stroke';
            this.activeId = ev.pointerId;
            this.o.onStrokeStart(ev);
            return true;
        }

        // ── touch ──
        if (this._penRecentlyUsed() || (this.mode === 'stroke' && this.pointers.get(this.activeId)?.type === 'pen')) {
            return true; // palm rejection: swallowed, not tracked
        }

        this.pointers.set(ev.pointerId, { id: ev.pointerId, type: 'touch', x: ev.clientX, y: ev.clientY });
        const touches = this._touchPoints();

        if (touches.length >= 2) {
            if (this.mode === 'pending') this._clearPending(); // nothing was started: no undo needed
            if (this.mode === 'stroke') this.o.onStrokeCancel();
            this.mode = 'camera';
            this.activeId = null;
            this.o.camera.begin(touches);
            return true;
        }

        if (this.o.fingerAction() === 'pan') {
            this.mode = 'camera';
            this.activeId = null;
            this.o.camera.begin(touches);
            return true;
        }

        this.mode = 'pending';
        this.pending = {
            id: ev.pointerId,
            down: ev,
            moves: [],
            timer: this.o.setTimer(() => this._startStrokeFromPending(), this.o.startDelayMs)
        };
        return true;
    }

    /** @returns {boolean} true when the event was consumed */
    handleMove(e) {
        if (!isTouchLike(e.pointerType)) return false;
        if (e.pointerType === 'pen') this.lastPenAt = this.o.now(); // hovering counts for palm rejection

        const tracked = this.pointers.get(e.pointerId);
        if (!tracked) return false;

        const events = typeof e.getCoalescedEvents === 'function' ? e.getCoalescedEvents() : null;
        const batch = events && events.length ? events : [e];
        const last = batch[batch.length - 1];
        tracked.x = last.clientX;
        tracked.y = last.clientY;

        if (this.mode === 'pending' && this.pending && this.pending.id === e.pointerId) {
            const snaps = batch.map(snapshotPointerEvent);
            this.pending.moves.push(...snaps);
            if (distance({ x: last.clientX, y: last.clientY }, { x: this.pending.down.clientX, y: this.pending.down.clientY }) > this.o.slopPx) {
                this._startStrokeFromPending();
            }
            return true;
        }

        if (this.mode === 'stroke' && this.activeId === e.pointerId) {
            for (const item of batch) this.o.onStrokeMove(snapshotPointerEvent(item));
            return true;
        }

        if (this.mode === 'camera' && tracked.type === 'touch') {
            this.o.camera.update(this._touchPoints());
            return true;
        }

        return true;
    }

    /** @returns {boolean} true when the event was consumed */
    handleUp(e, cancelled = false) {
        const tracked = this.pointers.get(e.pointerId);
        if (!tracked) return false;
        this.pointers.delete(e.pointerId);
        const ev = snapshotPointerEvent(e);

        if (this.mode === 'pending' && this.pending && this.pending.id === e.pointerId) {
            if (cancelled) {
                this._clearPending();
            } else {
                // A quick tap: the tool still gets its full down + up.
                this._startStrokeFromPending();
                this.o.onStrokeEnd(ev);
            }
            this.mode = 'idle';
            this.activeId = null;
            return true;
        }

        if (this.mode === 'stroke' && this.activeId === e.pointerId) {
            if (cancelled) this.o.onStrokeCancel();
            else this.o.onStrokeEnd(ev);
            this.mode = 'idle';
            this.activeId = null;
            return true;
        }

        if (this.mode === 'camera' && tracked.type === 'touch') {
            const remaining = this._touchPoints();
            if (remaining.length === 0) {
                this.o.camera.end();
                this.mode = 'idle';
            } else {
                // Lifting one finger of a pinch keeps panning with the other.
                this.o.camera.begin(remaining);
            }
            return true;
        }

        return true;
    }

    /** Abort everything (editor closed, tool changed, component unmounted). */
    reset() {
        this._clearPending();
        if (this.mode === 'stroke') this.o.onStrokeCancel();
        this.o.camera.abort && this.o.camera.abort();
        this.pointers.clear();
        this.mode = 'idle';
        this.activeId = null;
    }
}

export default PointerGestureTracker;
