import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect, useCallback } from 'react';
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
    centered = false,
    bounds = "body",
    zIndex = 1000,
    onDrag = null,
    onDragStart = null,
    onDragStop = null
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

    const scaleChangeTimeoutRef = useRef(null);
    useEffect(() => {
        const handleWindowScaleChange = () => {
            if (scaleChangeTimeoutRef.current) {
                clearTimeout(scaleChangeTimeoutRef.current);
            }

            scaleChangeTimeoutRef.current = setTimeout(() => {
                setPosition(prev => ({ ...prev }));
            }, 16);
        };

        window.addEventListener('windowScaleChanged', handleWindowScaleChange);
        return () => {
            window.removeEventListener('windowScaleChanged', handleWindowScaleChange);
            if (scaleChangeTimeoutRef.current) {
                clearTimeout(scaleChangeTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {
        return () => {
            document.body.classList.remove('window-dragging');
        };
    }, []);

    const positionRef = useRef(position);
    const scaleRef = useRef(windowScale);

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

    // Handle drag start
    const handleDragStart = useCallback((e, data) => {
        setIsDragging(true);
        document.body.classList.add('window-dragging');

        if (!window.multiplayerDragState) {
            window.multiplayerDragState = new Map();
        }
        window.multiplayerDragState.set(`window_${Date.now()}`, true);

        if (nodeRef.current) {
            nodeRef.current.classList.add('dragging');
        }

        if (onDragStart) {
            onDragStart(data);
        }

        if (e.target && typeof e.target.closest === 'function' && e.target.closest(`.${handleClassName}`)) {
            e.stopPropagation();
        }
    }, [zIndex, onDragStart, handleClassName]);

    // Handle drag - setPosition must be synchronous for react-draggable controlled mode
    // Performance is handled by: virtualized grids + CSS contain + React.memo on children
    const handleDrag = useCallback((e, data) => {
        setPosition({ x: data.x, y: data.y });
        positionRef.current = { x: data.x, y: data.y };

        if (e.target && typeof e.target.closest === 'function' && e.target.closest(`.${handleClassName}`)) {
            e.stopPropagation();
        }
    }, [handleClassName]);

    // Handle drag stop
    const handleDragStop = useCallback((e, data) => {
        setIsDragging(false);
        document.body.classList.remove('window-dragging');

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

        if (e.target && typeof e.target.closest === 'function' && e.target.closest(`.${handleClassName}`)) {
            e.stopPropagation();
        }
    }, [onDrag, onDragStop, zIndex, handleClassName]);

    if (!isOpen) return null;

    const disableDragging = isMobile;

    return (
        <Draggable
            handle={disableDragging ? '' : `.${handleClassName}`}
            position={disableDragging ? { x: 0, y: 0 } : position}
            nodeRef={nodeRef}
            bounds={disableDragging ? false : bounds}
            grid={[1, 1]}
            onStart={disableDragging ? undefined : handleDragStart}
            onDrag={disableDragging ? undefined : handleDrag}
            onStop={disableDragging ? undefined : handleDragStop}
            scale={windowScale}
            enableUserSelectHack={!disableDragging}
            disabled={disableDragging}
        >
            <div
                ref={nodeRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: zIndex,
                    transformOrigin: 'top left',
                    pointerEvents: 'auto',
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
                        pointerEvents: 'auto',
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
                    <div ref={windowRef}>
                        {children}
                    </div>
                </div>
            </div>
        </Draggable>
    );
});

DraggableWindow.displayName = 'DraggableWindow';

export default DraggableWindow;
