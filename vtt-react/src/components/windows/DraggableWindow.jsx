import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect, useCallback } from 'react';
import Draggable from 'react-draggable';
import useGameStore from '../../store/gameStore';
import '../../styles/draggable-window.css';

// Simple throttle function for performance optimization
const throttle = (func, limit) => {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
};

/**
 * DraggableWindow - A unified draggable window component for consistent window behavior
 *
 * @param {Object} props
 * @param {React.ReactNode} props.children - Window content
 * @param {boolean} props.isOpen - Whether the window is open
 * @param {Function} props.onClose - Callback when the window is closed
 * @param {Object} props.defaultPosition - Default position of the window
 * @param {Object} props.defaultSize - Default size of the window (width, height)
 * @param {string} props.className - Additional CSS class for the window
 * @param {string} props.handleClassName - CSS class for the drag handle
 * @param {boolean} props.centered - Whether to center the window on screen
 * @param {string} props.bounds - Bounds for dragging (e.g. "body", "parent")
 * @param {number} props.zIndex - Z-index for the window
 */
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
    // Get window scale from store (hooks must be called before any early returns)
    const windowScale = useGameStore(state => state.windowScale);

    // Detect mobile device
    const [isMobile, setIsMobile] = useState(() => {
        if (typeof window === 'undefined') return false;
        return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    });

    // Update mobile detection on resize
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Track last window scale for comparison
    const lastLoggedScale = useRef(windowScale);
    useEffect(() => {
        lastLoggedScale.current = windowScale;
    }, [windowScale]);

    // Create refs for the draggable component
    const nodeRef = useRef(null);
    const windowRef = useRef(null);

    // Calculate initial position
    const getInitialPosition = useCallback(() => {
        let pos = { ...defaultPosition };

        // If centered is true, calculate center position
        if (centered && typeof window !== 'undefined') {
            // Use a default size if the window hasn't rendered yet
            const windowWidth = windowRef.current?.offsetWidth || 400;
            const windowHeight = windowRef.current?.offsetHeight || 600;

            // Calculate center position based on viewport size
            pos = {
                x: Math.max(0, Math.floor((window.innerWidth - windowWidth) / 2)),
                y: Math.max(0, Math.floor((window.innerHeight - windowHeight) / 2))
            };

            // Ensure the window is not positioned off-screen
            pos.x = Math.min(pos.x, window.innerWidth - Math.min(windowWidth, 300));
            pos.y = Math.min(pos.y, window.innerHeight - Math.min(windowHeight, 200));
        }

        return pos;
    }, [centered, defaultPosition]);

    // State for window position - initialize with proper position
    const [position, setPosition] = useState(() => {
        if (centered && typeof window !== 'undefined') {
            // For centered windows, calculate center position immediately
            const windowWidth = 400; // Default width
            const windowHeight = 600; // Default height
            return {
                x: Math.max(0, Math.floor((window.innerWidth - windowWidth) / 2)),
                y: Math.max(0, Math.floor((window.innerHeight - windowHeight) / 2))
            };
        }
        return defaultPosition;
    });

    // Track dragging state to prevent conflicts
    const [isDragging, setIsDragging] = useState(false);

    // Update position after initial render to ensure proper centering with actual window size
    useEffect(() => {
        if (centered && windowRef.current) {
            // Short delay to ensure the window has rendered with its actual size
            const timer = setTimeout(() => {
                const newPosition = getInitialPosition();
                setPosition(newPosition);
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [centered, getInitialPosition]);

    // Listen for window scale changes and force re-render (throttled)
    const scaleChangeTimeoutRef = useRef(null);
    useEffect(() => {
        const handleWindowScaleChange = () => {
            // Throttle scale change events to prevent excessive re-renders
            if (scaleChangeTimeoutRef.current) {
                clearTimeout(scaleChangeTimeoutRef.current);
            }

            scaleChangeTimeoutRef.current = setTimeout(() => {
                // Force a re-render to apply the new scale
                setPosition(prev => ({ ...prev }));
            }, 16); // Throttle to ~60fps
        };

        window.addEventListener('windowScaleChanged', handleWindowScaleChange);
        return () => {
            window.removeEventListener('windowScaleChanged', handleWindowScaleChange);
            if (scaleChangeTimeoutRef.current) {
                clearTimeout(scaleChangeTimeoutRef.current);
            }
        };
    }, []);

    // Manage position and scale through refs to avoid re-renders
    const positionRef = useRef(position);
    const scaleRef = useRef(windowScale);

    useEffect(() => {
        positionRef.current = position;
        scaleRef.current = windowScale;
        // Let react-draggable handle both positioning AND scaling
        // Remove CSS transform to avoid double scaling
    }, [position.x, position.y, windowScale]);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
        getElement: () => windowRef.current,
        centerWindow: () => {
            if (windowRef.current) {
                const windowWidth = windowRef.current.offsetWidth;
                const windowHeight = windowRef.current.offsetHeight;

                // Calculate center position
                const left = Math.max(0, Math.floor((window.innerWidth - windowWidth) / 2));
                const top = Math.max(0, Math.floor((window.innerHeight - windowHeight) / 2));

                // Update position - React will handle the transform
                setPosition({ x: left, y: top });
            }
        },
        getPosition: () => position,
        setPosition: (newPosition) => setPosition(newPosition)
    }), [position]);

    // Handle drag start
    const handleDragStart = useCallback((e, data) => {
        setIsDragging(true);

        // Track window drag state globally to prevent multiplayer feedback loops
        if (!window.multiplayerDragState) {
            window.multiplayerDragState = new Map();
        }
        window.multiplayerDragState.set(`window_${Date.now()}`, true);

        // Add dragging class for visual feedback (disable transitions)
        if (nodeRef.current) {
            nodeRef.current.classList.add('dragging');
        }

        // Call external onDragStart callback (WowWindow will handle z-index)
        if (onDragStart) {
            onDragStart(data);
        }

        // Only stop propagation if this is actually a window drag (from the handle)
        if (e.target && typeof e.target.closest === 'function' && e.target.closest(`.${handleClassName}`)) {
            e.stopPropagation();
        }
    }, [zIndex, onDragStart, handleClassName]);

    // Add scale-aware drag throttling for consistent feel across different window scales
    const lastDragTime = useRef(0);
    const getDragThrottleMs = useCallback(() => {
        // Reduced throttling for better responsiveness
        // At 0.5x scale: 8ms throttle (~125fps)
        // At 1.0x scale: 4ms throttle (~250fps)
        // At 1.5x scale: 4ms throttle (~250fps)
        return Math.max(4, Math.round(8 / windowScale));
    }, [windowScale]);

    // Handle drag with scale-aware throttling for consistent movement feel
    // Update position state for react-draggable, but don't call parent onDrag until drag stops
    const handleDrag = useCallback((e, data) => {
        const now = Date.now();
        const throttleMs = getDragThrottleMs();

        // Apply scale-aware throttling
        if (now - lastDragTime.current < throttleMs) {
            return;
        }
        lastDragTime.current = now;

        // Update position state - react-draggable needs this for controlled component behavior
        // This causes a re-render, but it's necessary for react-draggable to work correctly
        setPosition({ x: data.x, y: data.y });
        positionRef.current = { x: data.x, y: data.y };

        // DON'T call onDrag during drag to avoid expensive parent re-renders
        // Parent will be notified on drag stop only
        // Only stop propagation if this is actually a window drag (from the handle)
        if (e.target && typeof e.target.closest === 'function' && e.target.closest(`.${handleClassName}`)) {
            e.stopPropagation();
        }
    }, [handleClassName, getDragThrottleMs]);

    // Handle drag stop
    const handleDragStop = useCallback((e, data) => {
        setIsDragging(false);

        // Clear window drag state globally
        if (window.multiplayerDragState) {
            window.multiplayerDragState.clear();
        }

        // Update state with final position (immediate, not throttled)
        setPosition({ x: data.x, y: data.y });

        // Reset z-index to normal and re-enable transitions
        if (nodeRef.current) {
            nodeRef.current.style.zIndex = zIndex.toString();
            nodeRef.current.classList.remove('dragging'); // Re-enable transition
            // Let react-draggable handle both positioning and scaling
        }

        // Update refs to match final position
        positionRef.current = { x: data.x, y: data.y };

        // Call the onDrag callback if provided with valid data
        if (onDrag && data && typeof data === 'object') {
            onDrag(data);
        }

        // Call external onDragStop callback
        if (onDragStop) {
            onDragStop(data);
        }

        // Only stop propagation if this is actually a window drag (from the handle)
        if (e.target && typeof e.target.closest === 'function' && e.target.closest(`.${handleClassName}`)) {
            e.stopPropagation();
        }
    }, [onDrag, onDragStop, zIndex, handleClassName]);

    // Don't render if not open (early return after all hooks)
    if (!isOpen) return null;

    // Calculate scale-aware grid size for consistent drag feel across all scales
    const gridSize = Math.max(1, Math.round(1 / windowScale)); // Reduced grid size for better responsiveness

    // Disable dragging on mobile
    const disableDragging = isMobile;

    return (
        <Draggable
            handle={disableDragging ? '' : `.${handleClassName}`}
            position={disableDragging ? { x: 0, y: 0 } : position}
            nodeRef={nodeRef}
            bounds={disableDragging ? false : false} // Remove all bounds restrictions for free movement
            grid={disableDragging ? [1, 1] : [gridSize, gridSize]} // Scale-aware grid snapping for consistent sensitivity
            onStart={disableDragging ? undefined : handleDragStart}
            onDrag={disableDragging ? undefined : handleDrag}
            onStop={disableDragging ? undefined : handleDragStop}
            scale={1} // Fixed scale to prevent double scaling - CSS handles visual scaling
            enableUserSelectHack={!disableDragging} // Enable user select hack to prevent text selection during drag
            disabled={disableDragging} // Disable dragging on mobile
        >
            <div
                ref={nodeRef}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    zIndex: zIndex, // Use z-index from props (managed by WowWindow)
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

export default DraggableWindow;
