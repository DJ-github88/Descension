import { PointerGestureTracker } from '../pointerGestures';

/** Manual clock + timers so the 70 ms finger-buffer is fully deterministic. */
const makeHarness = (overrides = {}) => {
    let clock = 1000;
    let nextTimer = 1;
    const timers = new Map();
    const calls = [];
    const camera = {
        begin: (pts) => calls.push(['camera.begin', pts.length]),
        update: (pts) => calls.push(['camera.update', pts.length]),
        end: () => calls.push(['camera.end']),
        abort: () => calls.push(['camera.abort'])
    };
    const tracker = new PointerGestureTracker({
        onStrokeStart: (ev) => calls.push(['start', ev.pointerType, ev.clientX, ev.clientY]),
        onStrokeMove: (ev) => calls.push(['move', ev.clientX, ev.clientY]),
        onStrokeEnd: (ev) => calls.push(['end', ev.clientX, ev.clientY]),
        onStrokeCancel: () => calls.push(['cancel']),
        onPenSeen: () => calls.push(['penSeen']),
        camera,
        now: () => clock,
        setTimer: (fn) => {
            const id = nextTimer++;
            timers.set(id, fn);
            return id;
        },
        clearTimer: (id) => timers.delete(id),
        ...overrides
    });
    return {
        tracker,
        calls,
        advance(ms) {
            clock += ms;
            for (const [id, fn] of [...timers]) {
                timers.delete(id);
                fn();
            }
        },
        names: () => calls.map((c) => c[0]),
        clear: () => calls.splice(0, calls.length)
    };
};

const ev = (pointerType, pointerId, x, y, extra = {}) => ({
    pointerType,
    pointerId,
    clientX: x,
    clientY: y,
    pressure: pointerType === 'pen' ? 0.6 : 0.5,
    target: null,
    ...extra
});

describe('PointerGestureTracker', () => {
    it('ignores mouse pointers entirely so mouse behaviour cannot regress', () => {
        const h = makeHarness();
        expect(h.tracker.handleDown(ev('mouse', 1, 10, 10))).toBe(false);
        expect(h.tracker.handleMove(ev('mouse', 1, 20, 20))).toBe(false);
        expect(h.calls).toEqual([]);
    });

    it('does nothing when disabled or when the touch belongs to the UI', () => {
        const disabled = makeHarness({ isEnabled: () => false });
        expect(disabled.tracker.handleDown(ev('touch', 1, 5, 5))).toBe(false);
        const overUi = makeHarness({ shouldHandle: () => false });
        expect(overUi.tracker.handleDown(ev('pen', 1, 5, 5))).toBe(false);
        expect(overUi.calls).toEqual([]);
    });

    describe('pen', () => {
        it('starts immediately and streams a full stroke', () => {
            const h = makeHarness();
            expect(h.tracker.handleDown(ev('pen', 1, 10, 10))).toBe(true);
            h.tracker.handleMove(ev('pen', 1, 20, 22));
            h.tracker.handleUp(ev('pen', 1, 30, 33));
            expect(h.calls).toEqual([
                ['penSeen'],
                ['start', 'pen', 10, 10],
                ['move', 20, 22],
                ['end', 30, 33]
            ]);
        });

        it('delivers every coalesced sample for smooth high-rate strokes', () => {
            const h = makeHarness();
            h.tracker.handleDown(ev('pen', 1, 0, 0));
            h.clear();
            h.tracker.handleMove(ev('pen', 1, 9, 9, {
                getCoalescedEvents: () => [ev('pen', 1, 3, 3), ev('pen', 1, 6, 6), ev('pen', 1, 9, 9)]
            }));
            expect(h.calls).toEqual([['move', 3, 3], ['move', 6, 6], ['move', 9, 9]]);
        });

        it('palm rejection: fingers are ignored while a pen stroke is active and just after', () => {
            const h = makeHarness();
            h.tracker.handleDown(ev('pen', 1, 0, 0));
            h.clear();
            expect(h.tracker.handleDown(ev('touch', 7, 50, 50))).toBe(true); // swallowed
            h.tracker.handleMove(ev('touch', 7, 60, 60));
            h.tracker.handleUp(ev('touch', 7, 60, 60));
            h.tracker.handleUp(ev('pen', 1, 5, 5));
            expect(h.names()).toEqual(['end']); // the finger never became a stroke or a camera move

            h.clear();
            h.advance(300); // still inside the palm-rejection window
            h.tracker.handleDown(ev('touch', 8, 70, 70));
            h.advance(200);
            expect(h.names()).toEqual([]);

            h.advance(2000); // window elapsed: fingers work again
            h.tracker.handleUp(ev('touch', 8, 70, 70));
            h.tracker.handleDown(ev('touch', 9, 70, 70));
            h.advance(100);
            expect(h.names()).toEqual(['start']);
        });

        it('a pen outranks fingers that are panning the camera', () => {
            const h = makeHarness();
            h.tracker.handleDown(ev('touch', 1, 10, 10));
            h.tracker.handleDown(ev('touch', 2, 60, 10));
            h.clear();
            h.tracker.handleDown(ev('pen', 5, 100, 100));
            expect(h.names()).toEqual(['penSeen', 'camera.end', 'start']);
        });
    });

    describe('one finger drawing', () => {
        it('waits for a possible second finger, then starts the stroke', () => {
            const h = makeHarness();
            h.tracker.handleDown(ev('touch', 1, 10, 10));
            expect(h.calls).toEqual([]);
            h.advance(80);
            expect(h.calls).toEqual([['start', 'touch', 10, 10]]);
            h.tracker.handleMove(ev('touch', 1, 12, 12));
            h.tracker.handleUp(ev('touch', 1, 12, 12));
            expect(h.names()).toEqual(['start', 'move', 'end']);
        });

        it('a quick tap still delivers a full start + end', () => {
            const h = makeHarness();
            h.tracker.handleDown(ev('touch', 1, 40, 41));
            h.tracker.handleUp(ev('touch', 1, 40, 41));
            expect(h.calls).toEqual([['start', 'touch', 40, 41], ['end', 40, 41]]);
        });

        it('moving past the slop starts the stroke early and replays the buffered moves in order', () => {
            const h = makeHarness();
            h.tracker.handleDown(ev('touch', 1, 0, 0));
            h.tracker.handleMove(ev('touch', 1, 3, 0)); // inside slop: still buffered
            expect(h.calls).toEqual([]);
            h.tracker.handleMove(ev('touch', 1, 20, 0));
            expect(h.calls).toEqual([['start', 'touch', 0, 0], ['move', 3, 0], ['move', 20, 0]]);
        });

        it('a cancelled pointer before the stroke started leaves no trace', () => {
            const h = makeHarness();
            h.tracker.handleDown(ev('touch', 1, 0, 0));
            h.tracker.handleUp(ev('touch', 1, 0, 0), true);
            h.advance(200);
            expect(h.calls).toEqual([]);
        });

        it('a cancelled pointer mid-stroke discards the stroke', () => {
            const h = makeHarness();
            h.tracker.handleDown(ev('touch', 1, 0, 0));
            h.advance(80);
            h.clear();
            h.tracker.handleUp(ev('touch', 1, 5, 5), true);
            expect(h.calls).toEqual([['cancel']]);
        });
    });

    describe('two fingers', () => {
      it('landing within the buffer window never starts a stroke at all', () => {
            const h = makeHarness();
            h.tracker.handleDown(ev('touch', 1, 10, 10));
            h.tracker.handleDown(ev('touch', 2, 90, 10));
            h.advance(200);
            expect(h.calls).toEqual([['camera.begin', 2]]);
            h.tracker.handleMove(ev('touch', 1, 5, 10));
            expect(h.calls[1]).toEqual(['camera.update', 2]);
            expect(h.names()).not.toContain('start');
        });

        it('landing mid-stroke discards that stroke and switches to the camera', () => {
            const h = makeHarness();
            h.tracker.handleDown(ev('touch', 1, 10, 10));
            h.advance(100);
            h.tracker.handleMove(ev('touch', 1, 30, 30));
            h.clear();
            h.tracker.handleDown(ev('touch', 2, 90, 10));
            expect(h.calls).toEqual([['cancel'], ['camera.begin', 2]]);
        });

        it('lifting one finger keeps panning with the other, and the leftover finger never draws', () => {
            const h = makeHarness();
            h.tracker.handleDown(ev('touch', 1, 10, 10));
            h.tracker.handleDown(ev('touch', 2, 90, 10));
            h.clear();
            h.tracker.handleUp(ev('touch', 2, 90, 10));
            expect(h.calls).toEqual([['camera.begin', 1]]);
            h.tracker.handleMove(ev('touch', 1, 15, 15));
            h.advance(500);
            expect(h.names()).toEqual(['camera.begin', 'camera.update']);
            h.tracker.handleUp(ev('touch', 1, 15, 15));
            expect(h.names()).toEqual(['camera.begin', 'camera.update', 'camera.end']);
        });

        it('after a pinch ends the next touch draws normally again', () => {
            const h = makeHarness();
            h.tracker.handleDown(ev('touch', 1, 10, 10));
            h.tracker.handleDown(ev('touch', 2, 90, 10));
            h.tracker.handleUp(ev('touch', 2, 90, 10));
            h.tracker.handleUp(ev('touch', 1, 10, 10));
            h.clear();
            h.tracker.handleDown(ev('touch', 3, 50, 50));
            h.advance(100);
            expect(h.calls).toEqual([['start', 'touch', 50, 50]]);
        });
    });

    describe('finger pans mode', () => {
        it('one finger drives the camera and never draws', () => {
            const h = makeHarness({ fingerAction: () => 'pan' });
            h.tracker.handleDown(ev('touch', 1, 10, 10));
            h.tracker.handleMove(ev('touch', 1, 30, 30));
            h.tracker.handleUp(ev('touch', 1, 30, 30));
            h.advance(500);
            expect(h.calls).toEqual([['camera.begin', 1], ['camera.update', 1], ['camera.end']]);
        });

        it('the pen still draws', () => {
            const h = makeHarness({ fingerAction: () => 'pan' });
            h.tracker.handleDown(ev('pen', 1, 10, 10));
            expect(h.names()).toEqual(['penSeen', 'start']);
        });
    });

    describe('reset', () => {
        it('cancels a live stroke and clears all state', () => {
            const h = makeHarness();
            h.tracker.handleDown(ev('pen', 1, 0, 0));
            h.clear();
            h.tracker.reset();
            expect(h.calls).toEqual([['cancel'], ['camera.abort']]);
            expect(h.tracker.isStroking).toBe(false);
        });

        it('drops a pending finger without starting anything', () => {
            const h = makeHarness();
            h.tracker.handleDown(ev('touch', 1, 0, 0));
            h.tracker.reset();
            h.advance(500);
            expect(h.names()).toEqual(['camera.abort']);
        });
    });

    it('releases for pointers it never tracked are not consumed', () => {
        const h = makeHarness();
        expect(h.tracker.handleUp(ev('touch', 99, 0, 0))).toBe(false);
    });
});
