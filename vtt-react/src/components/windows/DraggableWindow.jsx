import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect, useCallback, useMemo } from 'react';
import Draggable from 'react-draggable';
import useSettingsStore from '../../store/settingsStore';
import '../../styles/draggable-window.css';

const DraggableWindow = forwardRef(({
    children,
    isOpen,
    onClose,
    defaultPosition = { x: 100, y: 100 },
    defaultSize = null,
    className = '',
    handleClassName = 'draggable-window-handle',
    // CSS selector (passed straight to react-draggable) that opts elements OUT
    // of starting a window drag. Use it to keep form controls, buttons, links,
    // canvas/maps and opt-out regions (`.window-no-drag`) interactive while the
    // surrounding window surface stays draggable.
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

    const lastLoggedScale = useRef(windowScale);
    useEffect(() => {
        lastLoggedScale.current = windowScale;
    }, [windowScale]);

    const nodeRef = useRef(null);
    const windowRef = useRef(null);
    const rafHandleRef = useRef(null); // For RAF-throttled drag updates

    useEffect(() => {
        if (document && !document.getElementById('react-draggable-style-el')) {
            const styleEl = document.createElement('style');
            styleEl.type = 'text/css';
            styleEl.id = 'react-draggable-style-el';
            styleEl.innerHTML = '.react-draggable-transparent-selection *::-moz-selection {all: inherit;}\n.react-draggable-transparent-selection *::selection {all: inherit;}\n';
            document.head.appendChild(styleEl);
        }
    }, []);

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

    const [isDragging, setIsDragging] = useState(false);

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
                    const h = nodeRef.current?.offsetHeight || defaultSize?.height || 600;
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

    useEffect(() => {
        return () => {
            document.body.classList.remove('window-dragging');
            // Cancel any pending RAF on unmount
            if (rafHandleRef.current) {
                cancelAnimationFrame(rafHandleRef.current);
            }
        };
    }, []);

    const positionRef = useRef(position);
    const scaleRef = useRef(windowScale);

    // Drag-vs-click bookkeeping. Tab buttons (and other clickable surfaces)
    // double as drag handles, so a real drag must not leak a "click" afterwards
    // (which would e.g. switch tabs while the user was only moving the window).
    // Movements under CLICK_SUPPRESS_THRESHOLD_PX are treated as plain clicks.
    const dragStartPosRef = useRef(null);
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

    useEffect(() => {
        positionRef.current = position;
        scaleRef.current = windowScale;
    }, [position.x, position.y, windowScale]);

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
        getPosition: () => position,
        setPosition: (newPosition) => setPosition(newPosition)
    }), [position]);

    const normalizedHandle = useMemo(() => {
        if (!handleClassName) return '.draggable-window-handle';
        return handleClassName
            .split(',')
            .map(s => s.trim())
            .filter(Boolean)
            .map(s => s.startsWith('.') ? s : `.${s}`)
            .join(', ');
    }, [handleClassName]);

    // Handle drag start. Returning false vetoes the drag (react-draggable
    // cancels when its onStart returns false) — used to keep window moves
    // from fighting item/token drags originating inside the window.
    const handleDragStart = useCallback((e, data) => {
        // Don't allow window dragging if an item is being dragged
        if (window.isDraggingItem) {
            return false;
        }

        dragStartPosRef.current = data && typeof data.x === 'number'
            ? { x: data.x, y: data.y }
            : null;
        justDraggedAtRef.current = 0;

        setIsDragging(true);
        document.body.classList.add('window-dragging');

        if (rafHandleRef.current) {
            cancelAnimationFrame(rafHandleRef.current);
            rafHandleRef.current = null;
        }

        if (!window.multiplayerDragState) {
            window.multiplayerDragState = new Map();
        }
        window.multiplayerDragState.set(`window_${Date.now()}`, true);

        if (nodeRef.current) {
            nodeRef.current.classList.add('dragging');
        }

        if (onDragStart) {
            // Propagate a `false` return so callers (e.g. MythrillWindow) can
            // veto the drag and have react-draggable honour it.
            const veto = onDragStart(e, data);
            if (veto === false) {
                setIsDragging(false);
                document.body.classList.remove('window-dragging');
                if (nodeRef.current) {
                    nodeRef.current.classList.remove('dragging');
                }
                return false;
            }
        }

        try {
            if (e.target && typeof e.target.closest === 'function' && normalizedHandle && e.target.closest(normalizedHandle)) {
                const isInteractive = e.target.closest('button, input, select, textarea, [role="button"], a');
                if (!isInteractive) {
                    e.stopPropagation();
                }
            }
        } catch (_) {}
    }, [zIndex, onDragStart, normalizedHandle]);

    // Handle drag - let react-draggable translate the DOM natively without forcing a full React tree re-render every frame
    const handleDrag = useCallback((e, data) => {
        positionRef.current = { x: data.x, y: data.y };

        if (onDrag && data && typeof data === 'object') {
            onDrag(data);
        }

        try {
            if (e.target && typeof e.target.closest === 'function' && normalizedHandle && e.target.closest(normalizedHandle)) {
                const isInteractive = e.target.closest('button, input, select, textarea, [role="button"], a');
                if (!isInteractive) {
                    e.stopPropagation();
                }
            }
        } catch (_) {}
    }, [normalizedHandle, onDrag]);

    // Handle drag stop - commit final position to React state cleanly
    const handleDragStop = useCallback((e, data) => {
        setIsDragging(false);
        document.body.classList.remove('window-dragging');

        // If the pointer actually travelled, arm the click guard so the
        // mouse-up doesn't trigger whatever clickable surface we dragged from.
        const start = dragStartPosRef.current;
        dragStartPosRef.current = null;
        if (start && data && typeof data.x === 'number') {
            const dist = Math.hypot(data.x - start.x, data.y - start.y);
            justDraggedAtRef.current = dist > CLICK_SUPPRESS_THRESHOLD_PX ? Date.now() : 0;
        } else {
            justDraggedAtRef.current = 0;
        }

        if (window.multiplayerDragState) {
            window.multiplayerDragState.clear();
        }

        setPosition({ x: data.x, y: data.y });

        if (nodeRef.current) {
            nodeRef.current.style.zIndex = zIndex.toString();
            nodeRef.current.classList.remove('dragging');
        }

        positionRef.current = { x: data.x, y: data.y };

        if (onDrag && data && typeof data === 'object') {
            onDrag(data);
        }

        if (onDragStop) {
            onDragStop(data);
        }

        try {
            if (e.target && typeof e.target.closest === 'function' && normalizedHandle && e.target.closest(normalizedHandle)) {
                const isInteractive = e.target.closest('button, input, select, textarea, [role="button"], a');
                if (!isInteractive) {
                    e.stopPropagation();
                }
            }
        } catch (_) {}
    }, [onDrag, onDragStop, zIndex, normalizedHandle]);

    if (!isOpen) return null;

    const effectivelyDisabled = isMobile || disableDragging;

    // Compute scale-aware bounds. react-draggable's string bounds (e.g. "body")
    // measure the node's UNSCALED offsetWidth, so when windowScale != 1 the window
    // either can't reach the screen edges (scale < 1) or overshoots them (scale > 1).
    // We compute explicit bounds in visual pixels so dragging is correct at any scale,
    // and allow partial off-screen movement while keeping the header grabable.
    const effectiveBounds = (() => {
        if (effectivelyDisabled || !bounds) return false;
        if (typeof bounds === 'object') return bounds;

        const vw = typeof window !== 'undefined' ? window.innerWidth : 1920;
        const vh = typeof window !== 'undefined' ? window.innerHeight : 1080;
        const w = nodeRef.current?.offsetWidth || defaultSize?.width || 400;
        const h = nodeRef.current?.offsetHeight || defaultSize?.height || 600;
        const visualW = w * windowScale;
                const minVisible = 100;

        return {
            left: Math.min(0, minVisible - visualW),
            top: 0,
            right: Math.max(0, vw - minVisible),
            bottom: Math.max(0, vh - minVisible)
        };
    })();

    return (
        <Draggable
            handle={effectivelyDisabled ? '' : normalizedHandle}
            cancel={effectivelyDisabled ? undefined : (cancel || undefined)}
            position={effectivelyDisabled ? { x: 0, y: 0 } : position}
            nodeRef={nodeRef}
            bounds={effectiveBounds}
            grid={[1, 1]}
            onStart={effectivelyDisabled ? undefined : handleDragStart}
            onDrag={effectivelyDisabled ? undefined : handleDrag}
            onStop={effectivelyDisabled ? undefined : handleDragStop}
            scale={windowScale}
            enableUserSelectHack={!effectivelyDisabled}
            disabled={effectivelyDisabled}
        >
            <div
                ref={nodeRef}
                onClickCapture={effectivelyDisabled ? undefined : handleClickCapture}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: zIndex,
                    transformOrigin: 'top left',
                    pointerEvents: 'none',
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
        </Draggable>
    );
});

DraggableWindow.displayName = 'DraggableWindow';

export default DraggableWindow;
