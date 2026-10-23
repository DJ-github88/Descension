import React from 'react';
import { render, act, fireEvent } from '@testing-library/react';

// The hook only needs the grid system / game store for two-finger camera moves,
// which are covered by cameraGesture.test.js. Keep this suite light.
jest.mock('../../utils/InfiniteGridSystem', () => ({
    getGridSystem: () => ({
        getViewportDimensions: () => ({ width: 800, height: 600 }),
        screenToWorld: (x, y) => ({ x, y }),
        worldToScreen: (x, y) => ({ x, y })
    })
}));
jest.mock('../../store/gameStore', () => {
    const state = {
        zoomLevel: 1, playerZoom: 1, minPlayerZoom: 0.5, maxPlayerZoom: 3,
        setPlayerZoom: () => {}, moveCameraBy: (dx, dy) => { state.moved.push([dx, dy]); }, moved: []
    };
    const useGameStore = () => state;
    useGameStore.getState = () => state;
    return { __esModule: true, default: useGameStore };
});

let useOverlayTouchInput;
let resolveFingerAction;

beforeAll(async () => {
    // jsdom has no PointerEvent in older versions; fireEvent would drop pointerType / clientX.
    if (typeof window.PointerEvent === 'undefined') {
        class PointerEventPolyfill extends MouseEvent {
            constructor(type, init = {}) {
                super(type, init);
                this.pointerId = init.pointerId ?? 1;
                this.pointerType = init.pointerType ?? 'mouse';
                this.pressure = init.pressure ?? 0;
                this.tiltX = init.tiltX ?? 0;
                this.tiltY = init.tiltY ?? 0;
            }
        }
        window.PointerEvent = PointerEventPolyfill;
    }
    const mod = await import('../useOverlayTouchInput');
    useOverlayTouchInput = mod.default;
    resolveFingerAction = mod.resolveFingerAction;
});

const Harness = ({ api, calls, enabled = true, isUiAt = () => false }) => {
    const overlayRef = React.useRef(null);
    const touch = useOverlayTouchInput({
        overlayRef,
        enabled,
        isUiAt,
        onStart: (ev) => calls.push(['start', ev.clientX, ev.clientY]),
        onMove: (ev) => calls.push(['move', ev.clientX, ev.clientY]),
        onEnd: (ev) => calls.push(['end', ev.clientX, ev.clientY]),
        onCancel: () => calls.push(['cancel'])
    });
    api.current = touch;
    return <div ref={overlayRef} data-testid="overlay" {...touch.handlers} />;
};

const setup = (props = {}) => {
    const api = { current: null };
    const calls = [];
    const utils = render(<Harness api={api} calls={calls} {...props} />);
    const overlay = utils.getByTestId('overlay');
    overlay.setPointerCapture = jest.fn();
    overlay.releasePointerCapture = jest.fn();
    return { api, calls, overlay, ...utils };
};

const pointer = (type, init) => fireEvent[type](init.target, init);

describe('resolveFingerAction', () => {
    it('honours an explicit choice', () => {
        expect(resolveFingerAction('draw', true)).toBe('draw');
        expect(resolveFingerAction('pan', false)).toBe('pan');
    });

    it('auto: fingers draw until a stylus shows up, then they pan', () => {
        expect(resolveFingerAction('auto', false)).toBe('draw');
        expect(resolveFingerAction('auto', true)).toBe('pan');
    });
});

describe('useOverlayTouchInput', () => {
    beforeEach(() => {
        jest.useFakeTimers();
        window.localStorage.clear();
    });
    afterEach(() => {
        jest.useRealTimers();
    });

    it('ignores mouse pointers (the editor keeps its mouse path)', () => {
        const { overlay, calls } = setup();
        fireEvent.pointerDown(overlay, { pointerType: 'mouse', pointerId: 1, clientX: 10, clientY: 10 });
        fireEvent.pointerUp(overlay, { pointerType: 'mouse', pointerId: 1, clientX: 10, clientY: 10 });
        act(() => { jest.advanceTimersByTime(200); });
        expect(calls).toEqual([]);
    });

    it('turns a stylus stroke into start / move / end and captures the pointer', () => {
        const { overlay, calls } = setup();
        fireEvent.pointerDown(overlay, { pointerType: 'pen', pointerId: 2, clientX: 20, clientY: 30, pressure: 0.5 });
        fireEvent.pointerMove(overlay, { pointerType: 'pen', pointerId: 2, clientX: 40, clientY: 50, pressure: 0.6 });
        fireEvent.pointerUp(overlay, { pointerType: 'pen', pointerId: 2, clientX: 40, clientY: 50 });

        expect(calls[0]).toEqual(['start', 20, 30]);
        expect(calls.some((c) => c[0] === 'move')).toBe(true);
        expect(calls[calls.length - 1][0]).toBe('end');
        expect(overlay.setPointerCapture).toHaveBeenCalledWith(2);
        expect(overlay.releasePointerCapture).toHaveBeenCalledWith(2);
    });

    it('a finger draws after the short pinch-detection delay', () => {
        const { overlay, calls } = setup();
        fireEvent.pointerDown(overlay, { pointerType: 'touch', pointerId: 3, clientX: 5, clientY: 6 });
        expect(calls).toEqual([]);
        act(() => { jest.advanceTimersByTime(100); });
        expect(calls[0]).toEqual(['start', 5, 6]);
        fireEvent.pointerUp(overlay, { pointerType: 'touch', pointerId: 3, clientX: 5, clientY: 6 });
        expect(calls[calls.length - 1][0]).toBe('end');
    });

    it('does not draw with a finger in "pan" mode, and remembers the choice', () => {
        const { api, overlay, calls } = setup();
        act(() => { api.current.setFingerMode('pan'); });
        expect(api.current.fingerAction).toBe('pan');
        expect(window.localStorage.getItem('vtt.editor.fingerMode')).toBe('pan');

        fireEvent.pointerDown(overlay, { pointerType: 'touch', pointerId: 4, clientX: 5, clientY: 6 });
        fireEvent.pointerMove(overlay, { pointerType: 'touch', pointerId: 4, clientX: 60, clientY: 60 });
        fireEvent.pointerUp(overlay, { pointerType: 'touch', pointerId: 4, clientX: 60, clientY: 60 });
        act(() => { jest.advanceTimersByTime(200); });
        expect(calls).toEqual([]);
    });

    it('starts in the stored finger mode', () => {
        window.localStorage.setItem('vtt.editor.fingerMode', 'pan');
        const { api } = setup();
        expect(api.current.fingerMode).toBe('pan');
    });

    it('switches fingers to panning once a stylus is seen (auto mode)', () => {
        const { api, overlay } = setup();
        expect(api.current.fingerAction).toBe('draw');
        fireEvent.pointerDown(overlay, { pointerType: 'pen', pointerId: 5, clientX: 1, clientY: 1 });
        fireEvent.pointerUp(overlay, { pointerType: 'pen', pointerId: 5, clientX: 1, clientY: 1 });
        expect(api.current.penDetected).toBe(true);
        expect(api.current.fingerAction).toBe('pan');
    });

    it('reports touch as seen after the first touch', () => {
        const { api, overlay } = setup();
        expect(api.current.touchSeen).toBe(false);
        fireEvent.pointerDown(overlay, { pointerType: 'touch', pointerId: 6, clientX: 1, clientY: 1 });
        expect(api.current.touchSeen).toBe(true);
        expect(api.current.isTouchDevice).toBe(true);
    });

    it('does nothing while disabled', () => {
        const { overlay, calls } = setup({ enabled: false });
        fireEvent.pointerDown(overlay, { pointerType: 'pen', pointerId: 7, clientX: 1, clientY: 1 });
        fireEvent.pointerUp(overlay, { pointerType: 'pen', pointerId: 7, clientX: 1, clientY: 1 });
        expect(calls).toEqual([]);
    });

    it('re-delivers a tap on UI under the overlay as a click', () => {
        const button = document.createElement('button');
        const onClick = jest.fn();
        button.addEventListener('click', onClick);
        document.body.appendChild(button);
        const original = document.elementsFromPoint;
        document.elementsFromPoint = () => [button];
        try {
            const { overlay, calls } = setup({ isUiAt: () => true });
            fireEvent.pointerDown(overlay, { pointerType: 'touch', pointerId: 8, clientX: 9, clientY: 9 });
            fireEvent.pointerUp(overlay, { pointerType: 'touch', pointerId: 8, clientX: 9, clientY: 9 });
            expect(onClick).toHaveBeenCalledTimes(1);
            expect(calls).toEqual([]);
        } finally {
            document.elementsFromPoint = original;
            button.remove();
        }
    });

    it('does not click through when the touch was a drag over the UI', () => {
        const button = document.createElement('button');
        const onClick = jest.fn();
        button.addEventListener('click', onClick);
        document.body.appendChild(button);
        const original = document.elementsFromPoint;
        document.elementsFromPoint = () => [button];
        try {
            const { overlay } = setup({ isUiAt: () => true });
            fireEvent.pointerDown(overlay, { pointerType: 'touch', pointerId: 9, clientX: 9, clientY: 9 });
            fireEvent.pointerMove(overlay, { pointerType: 'touch', pointerId: 9, clientX: 90, clientY: 90 });
            fireEvent.pointerUp(overlay, { pointerType: 'touch', pointerId: 9, clientX: 90, clientY: 90 });
            expect(onClick).not.toHaveBeenCalled();
        } finally {
            document.elementsFromPoint = original;
            button.remove();
        }
    });

    it('cancels an in-progress stroke when the browser cancels the pointer', () => {
        const { overlay, calls } = setup();
        fireEvent.pointerDown(overlay, { pointerType: 'pen', pointerId: 10, clientX: 1, clientY: 1 });
        fireEvent.pointerCancel(overlay, { pointerType: 'pen', pointerId: 10, clientX: 1, clientY: 1 });
        expect(calls.some((c) => c[0] === 'cancel')).toBe(true);
        expect(calls.some((c) => c[0] === 'end')).toBe(false);
    });
});
