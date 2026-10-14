import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect, useLayoutEffect, useCallback, useMemo } from 'react';
import { DraggableCore } from 'react-draggable';
import useSettingsStore from '../../store/settingsStore';
import '../../styles/draggable-window.css';

/*
 * PERFORMANCE: why windows are positioned through the Web Animations API
 * instead of an inline `style.transform` / `style.zIndex`.
 *
 * The theme CSS (mostly styles/calm-shared.css) contains several hundred
 * selectors with attribute matchers in an ANCESTOR position, e.g.
 *   .game-mode [class*="character-"] *
 *   .class-resource-menu[class*="menu-container"] :is(div, span, ...)
 * With those present, Chrome restyles the ENTIRE subtree of any element whose
 * `class` or `style` attribute changes. react-draggable rewrote the wrapper's
 * inline transform on every mouse move, so a window holding the item grid
 * (~1,000 cards / ~5,000 elements) paid ~150-200 ms of style recalculation per
 * move. Driving transform + z-index from a single filled animation never
 * touches an attribute: the same move costs well under 1 ms.
 *
 * For the same reason nothing here toggles classes on the window wrapper or on
 * <body> while dragging (each toggle was another full-subtree restyle).
 * DraggableCore is used only for pointer handling (handle/cancel matching,
 * mouse + touch); positioning is done here.
 */
const supportsWaapi = typeof Element !== 'undefined' && typeof Element.prototype.animate === 'function';

const preventSelectStart = (e) => e.preventDefault();

const clamp = (value, min, max) => Math.max(min, Math.min(value, max));

const DraggableWindow = forwardRef(({
    children,
    isOpen,
    onClose,
    defaultPosition = { x: 100, y: 100 },
    defaultSize = null,
    className = '',
    handleClassName = 'draggable-window-handle',
    // CSS selector that opts elements OUT of starting a window drag. Use it to
    // keep form controls, buttons, links, canvas/maps and opt-out regions
    // (`.window-no-drag`) interactive while the surrounding window surface
    // stays draggable.
    cancel = null,
    centered = false,
    bounds = "body",
    zIndex = 1000,
    onDrag = null,
    onDragStart = null,
    onDragStop = null,
    resetSignal = 0,
    disableDragging = false
}, ref) => {
    const windowScale = useSettingsStore(state => state.windowScale);

    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    });

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
        };
        // Initial check on mount to ensure we have the correct state
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const nodeRef = useRef(null);
    const windowRef = useRef(null);
    const placementAnimRef = useRef(null); // the single filled animation that positions the window
    const dragRef = useRef(null); // live drag session (null when idle)

    const getInitialPosition = useCallback(() => {
        let pos = { ...defaultPosition };

        if (centered && typeof window !== 'undefined') {
            const windowWidth = windowRef.current?.offsetWidth || 400;
            const windowHeight = windowRef.current?.offsetHeight || 600;

            pos = {
                x: Math.max(0, Math.floor((window.innerWidth - windowWidth) / 2)),
                y: Math.max(0, Math.floor((window.innerHeight - windowHeight) / 2))
            };

            pos.x = Math.min(pos.x, window.innerWidth - Math.min(windowWidth, 300));
            pos.y = Math.min(pos.y, window.innerHeight - Math.min(windowHeight, 200));
        }

        return pos;
    }, [centered, defaultPosition]);

    const [position, setPosition] = useState(() => {
        if (centered && typeof window !== 'undefined') {
            const windowWidth = defaultSize?.width || 400;
            const windowHeight = defaultSize?.height || 600;
            return {
                x: Math.max(0, Math.floor((window.innerWidth - windowWidth) / 2)),
                y: Math.max(0, Math.floor((window.innerHeight - windowHeight) / 2))
            };
        }
        return defaultPosition;
    });

    // Where the window is visually right now (== position, except mid-drag)
    const livePosRef = useRef(position);
    const zIndexRef = useRef(zIndex);
    zIndexRef.current = zIndex;

    const hasBeenCentered = useRef(false);
    const initialCenteredValue = useRef(centered);

    useEffect(() => {
        if (centered && windowRef.current && !hasBeenCentered.current) {
            const timer = setTimeout(() => {
                const newPosition = getInitialPosition();
                setPosition(newPosition);
                hasBeenCentered.current = true;
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [centered, getInitialPosition]);

    useEffect(() => {
        if (centered && !initialCenteredValue.current) {
            hasBeenCentered.current = false;
        }
        initialCenteredValue.current = centered;
    }, [centered]);

    // Respond to layout-reset signal from windowManagerStore
    const lastResetSignal = useRef(resetSignal);
    useEffect(() => {
        if (resetSignal !== lastResetSignal.current) {
            lastResetSignal.current = resetSignal;
            if (centered && typeof window !== 'undefined') {
                const windowWidth = defaultSize?.width || 400;
                const windowHeight = defaultSize?.height || 600;
                setPosition({
                    x: Math.max(0, Math.floor((window.innerWidth - windowWidth) / 2)),
                    y: Math.max(0, Math.floor((window.innerHeight - windowHeight) / 2))
                });
            } else {
                setPosition(defaultPosition);
            }
        }
    }, [resetSignal, centered, defaultPosition, defaultSize]);

    const scaleChangeTimeoutRef = useRef(null);
    useEffect(() => {
        const handleWindowScaleChange = () => {
            if (scaleChangeTimeoutRef.current) {
                clearTimeout(scaleChangeTimeoutRef.current);
            }

            scaleChangeTimeoutRef.current = setTimeout(() => {
                const scale = useSettingsStore.getState().windowScale;
                setPosition(prev => {
                    const vw = window.innerWidth;
                    const vh = window.innerHeight;
                    const w = nodeRef.current?.offsetWidth || defaultSize?.width || 400;
                    const visualW = w * scale;
                    const minVisible = 100;
                    const leftBound = Math.min(0, minVisible - visualW);
                    const rightBound = Math.max(0, vw - minVisible);
                    const bottomBound = Math.max(0, vh - minVisible);
                    return {
                        x: Math.max(leftBound, Math.min(prev.x, rightBound)),
                        y: Math.max(0, Math.min(prev.y, bottomBound))
                    };
                });
            }, 16);
        };

        window.addEventListener('windowScaleChanged', handleWindowScaleChange);
        return () => {
            window.removeEventListener('windowScaleChanged', handleWindowScaleChange);
            if (scaleChangeTimeoutRef.current) {
                clearTimeout(scaleChangeTimeoutRef.current);
            }
        };
    }, [defaultSize]);

    // Write translate + z-index without touching the element's style/class attributes
    const applyPlacement = useCallback((x, y, z) => {
        const node = nodeRef.current;
        if (!node) return;
        const transform = `translate(${x}px, ${y}px)`;
        const zValue = String(z);

        if (!supportsWaapi) {
            node.style.transform = transform;
            node.style.zIndex = zValue;
            return;
        }

        const frame = { transform, zIndex: zValue };
        const anim = placementAnimRef.current;
        if (anim && anim.effect && anim.effect.target === node && anim.playState !== 'idle') {
            anim.effect.setKeyframes([frame, frame]);
        } else {
            if (anim) {
                try { anim.cancel(); } catch (_) { /* ignore */ }
            }
            placementAnimRef.current = node.animate([frame, frame], { duration: 0, fill: 'forwards' });
        }
    }, []);

    const stopDragListeners = useCallback(() => {
        document.removeEventListener('selectstart', preventSelectStart, true);
    }, []);

    useEffect(() => {
        return () => {
            stopDragListeners();
            if (placementAnimRef.current) {
                try { placementAnimRef.current.cancel(); } catch (_) { /* ignore */ }
                placementAnimRef.current = null;
            }
        };
    }, [stopDragListeners]);

    // Drag-vs-click bookkeeping. Tab buttons (and other clickable surfaces)
    // double as drag handles, so a real drag must not leak a "click" afterwards
    // (which would e.g. switch tabs while the user was only moving the window).
    // Movements under CLICK_SUPPRESS_THRESHOLD_PX are treated as plain clicks.
    const justDraggedAtRef = useRef(0);
    const CLICK_SUPPRESS_THRESHOLD_PX = 6;
    const CLICK_SUPPRESS_WINDOW_MS = 350;

    // Capture-phase click guard: swallows the synthetic click that follows a
    // genuine window drag so clickable drag handles don't mis-fire.
    const handleClickCapture = useCallback((e) => {
        if (justDraggedAtRef.current && Date.now() - justDraggedAtRef.current < CLICK_SUPPRESS_WINDOW_MS) {
            e.stopPropagation();
            e.preventDefault();
            justDraggedAtRef.current = 0;
        }
    }, []);

    useImperativeHandle(ref, () => ({
        getElement: () => windowRef.current,
        centerWindow: () => {
            if (windowRef.current) {
                const windowWidth = windowRef.current.offsetWidth;
                const windowHeight = windowRef.current.offsetHeight;

                const left = Math.max(0, Math.floor((window.innerWidth - windowWidth) / 2));
                const top = Math.max(0, Math.floor((window.innerHeight - windowHeight) / 2));

                setPosition({ x: left, y: top });
            }
        },
        getPosition: () => livePosRef.current,
        setPosition: (newPosition) => setPosition(newPosition)
    }), []);

    const normalizedHandle = useMemo(() => {
        if (!handleClassName) return '.draggable-window-handle';
        return handleClassName
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
            .map(s => s.startsWith('.') ? s : `.${s}`)
            .join(', ');
    }, [handleClassName]);

    const effectivelyDisabled = isMobile || disableDragging;

    // Keep the visual placement in sync with React state / z-index. Mid-drag the
    // live drag position wins so a z-index bump can't snap the window back.
    useLayoutEffect(() => {
        if (!isOpen) return;
        if (!dragRef.current) {
            livePosRef.current = effectivelyDisabled ? { x: 0, y: 0 } : position;
        }
        applyPlacement(livePosRef.current.x, livePosRef.current.y, zIndex);
    }, [isOpen, position, zIndex, effectivelyDisabled, applyPlacement]);

    // Scale-aware bounds in visual pixels. Allows partial off-screen movement
    // while keeping the header grabbable. Measured once per drag.
    const computeBounds = useCallback(() => {
        if (!bounds) return null;
        if (typeof bounds === 'object') return bounds;

        const vw = window.innerWidth || 1920;
        const vh = window.innerHeight || 1080;
        const w = nodeRef.current?.offsetWidth || defaultSize?.width || 400;
        const visualW = w * (useSettingsStore.getState?.().windowScale ?? windowScale);
        const minVisible = 100;

        return {
            left: Math.min(0, minVisible - visualW),
            top: 0,
            right: Math.max(0, vw - minVisible),
            bottom: Math.max(0, vh - minVisible)
        };
    }, [bounds, defaultSize, windowScale]);

    const positionFromPointer = (session, data) => {
        let x = Math.round(session.originX + (data.x - session.pointerX));
        let y = Math.round(session.originY + (data.y - session.pointerY));
        const b = session.bounds;
        if (b) {
            if (typeof b.left === 'number' || typeof b.right === 'number') {
                x = clamp(x, typeof b.left === 'number' ? b.left : -Infinity, typeof b.right === 'number' ? b.right : Infinity);
            }
            if (typeof b.top === 'number' || typeof b.bottom === 'number') {
                y = clamp(y, typeof b.top === 'number' ? b.top : -Infinity, typeof b.bottom === 'number' ? b.bottom : Infinity);
            }
        }
        return { x, y };
    };

    const stopHandlePropagation = (e) => {
        try {
            if (e.target && typeof e.target.closest === 'function' && normalizedHandle && e.target.closest(normalizedHandle)) {
                const isInteractive = e.target.closest('button, input, select, textarea, [role="button"], a');
                if (!isInteractive) {
                    e.stopPropagation();
                }
            }
        } catch (_) { /* ignore */ }
    };

    // Returning false vetoes the drag (DraggableCore honours it) — used to keep
    // window moves from fighting item/token drags originating inside the window.
    const handleDragStart = (e, data) => {
        if (window.isDraggingItem) {
            return false;
        }

        const origin = livePosRef.current;
        justDraggedAtRef.current = 0;

        if (onDragStart) {
            const veto = onDragStart(e, { ...data, x: origin.x, y: origin.y });
            if (veto === false) {
                return false;
            }
        }

        dragRef.current = {
            pointerX: data.x,
            pointerY: data.y,
            originX: origin.x,
            originY: origin.y,
            bounds: computeBounds()
        };

        if (!window.multiplayerDragState) {
            window.multiplayerDragState = new Map();
        }
        window.multiplayerDragState.set(`window_${Date.now()}`, true);

        // Block text selection for the duration of the drag without restyling
        // <body> (react-draggable's user-select hack toggled a body class).
        try { window.getSelection()?.removeAllRanges(); } catch (_) { /* ignore */ }
        document.addEventListener('selectstart', preventSelectStart, true);

        stopHandlePropagation(e);
    };

    const handleDrag = (e, data) => {
        const session = dragRef.current;
        if (!session) return;

        const next = positionFromPointer(session, data);
        livePosRef.current = next;
        // Cheap (no attribute change), so apply immediately: Chrome already
        // delivers mousemove once per frame, and this avoids a frame of lag.
        applyPlacement(next.x, next.y, zIndexRef.current);

        if (onDrag) {
            onDrag({ ...data, x: next.x, y: next.y });
        }

        stopHandlePropagation(e);
    };

    const handleDragStop = (e, data) => {
        const session = dragRef.current;
        stopDragListeners();
        if (!session) return;

        const final = positionFromPointer(session, data);
        dragRef.current = null;

        // If the pointer actually travelled, arm the click guard so the
        // mouse-up doesn't trigger whatever clickable surface we dragged from.
        const dist = Math.hypot(final.x - session.originX, final.y - session.originY);
        justDraggedAtRef.current = dist > CLICK_SUPPRESS_THRESHOLD_PX ? Date.now() : 0;

        if (window.multiplayerDragState) {
            window.multiplayerDragState.clear();
        }

        livePosRef.current = final;
        applyPlacement(final.x, final.y, zIndexRef.current);
        setPosition(final);

        const finalData = { ...data, x: final.x, y: final.y };
        if (onDrag) {
            onDrag(finalData);
        }
        if (onDragStop) {
            onDragStop(finalData);
        }

        stopHandlePropagation(e);
    };

    if (!isOpen) return null;

    return (
        <DraggableCore
            handle={effectivelyDisabled ? undefined : normalizedHandle}
            cancel={effectivelyDisabled ? undefined : (cancel || undefined)}
            nodeRef={nodeRef}
            onStart={handleDragStart}
            onDrag={handleDrag}
            onStop={handleDragStop}
            scale={1}
            enableUserSelectHack={false}
            disabled={effectivelyDisabled}
        >
            <div
                ref={nodeRef}
                className="react-draggable"
                onClickCapture={effectivelyDisabled ? undefined : handleClickCapture}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    transformOrigin: 'top left',
                    pointerEvents: 'none',
                    // Moved by a compositor-friendly transform animation (see top of file)
                    willChange: isMobile ? 'auto' : 'transform',
                    ...(isMobile && {
                        width: '100vw',
                        height: '100vh',
                        height: '100dvh',
                    })
                }}
            >
                <div
                    className={`draggable-window ${className} ${isMobile ? 'mobile-fullscreen' : ''}`}
                    style={{
                        transformOrigin: 'top left',
                        transform: isMobile ? 'none' : `scale(${windowScale})`,
                        willChange: isMobile ? 'auto' : 'transform',
                        pointerEvents: 'none',
                        ...(isMobile ? {
                            width: '100vw',
                            height: '100vh',
                            height: '100dvh',
                        } : defaultSize && {
                            width: defaultSize.width,
                            height: defaultSize.height
                        })
                    }}
                >
                    <div ref={windowRef} style={{ pointerEvents: 'auto', width: 'fit-content', height: 'fit-content' }}>
                        {children}
                    </div>
                </div>
            </div>
        </DraggableCore>
    );
});

DraggableWindow.displayName = 'DraggableWindow';

export default DraggableWindow;
