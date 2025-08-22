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
        window.multiplayerDragState.set(`window_${title || 'unknown'}`, true);
        console.log('🎯 Started dragging window:', title, 'Drag state:', window.multiplayerDragState);

        // Increase z-index when dragging starts to bring window to front
        if (nodeRef.current) {
            nodeRef.current.style.zIndex = (zIndex + 100).toString();
            nodeRef.current.classList.add('dragging'); // Disable transition during drag
        }

        // Call external onDragStart callback
        if (onDragStart) {
            onDragStart(data);
        }

        // Only stop propagation if this is actually a window drag (from the handle)
        if (e.target.closest(`.${handleClassName}`)) {
            e.stopPropagation();
        }
    }, [zIndex, onDragStart, handleClassName, title]);

    // Handle drag with pure immediate feedback - let react-draggable handle positioning
    const handleDrag = useCallback((e, data) => {
        // Update position state for React consistency
        setPosition({ x: data.x, y: data.y });
        positionRef.current = { x: data.x, y: data.y };

        // Call onDrag callback immediately as well
        if (onDrag && data && typeof data === 'object') {
            onDrag(data);
        }

        // Only stop propagation if this is actually a window drag (from the handle)
        if (e.target.closest(`.${handleClassName}`)) {
            e.stopPropagation();
        }
    }, [onDrag, handleClassName]);

    // Handle drag stop
    const handleDragStop = useCallback((e, data) => {
        setIsDragging(false);

        // Clear window drag state globally
        if (window.multiplayerDragState) {
            window.multiplayerDragState.delete(`window_${title || 'unknown'}`);
            console.log('🎯 Stopped dragging window:', title, 'Drag state:', window.multiplayerDragState);
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
        if (e.target.closest(`.${handleClassName}`)) {
            e.stopPropagation();
        }
    }, [onDrag, onDragStop, zIndex, handleClassName, title]);

    // Don't render if not open (early return after all hooks)
    if (!isOpen) return null;

    return (
        <Draggable
            handle={`.${handleClassName}`}
            position={position}
            nodeRef={nodeRef}
            bounds={false} // Remove all bounds restrictions for free movement
            onStart={handleDragStart}
            onDrag={handleDrag}
            onStop={handleDragStop}
            scale={windowScale} // Use window scale for consistent dragging
            enableUserSelectHack={false} // Disable user select hack for better performance
        >
            <div
                ref={nodeRef}
                className={`draggable-window ${className}`}
                style={{
                    zIndex,
                    position: 'fixed', // Changed from absolute to fixed for better positioning
                    pointerEvents: 'auto',
                    top: 0,
                    left: 0,
                    transformOrigin: 'top left' // Scale from top-left corner
                    // Transform is managed entirely through direct DOM manipulation
                }}
            >
                <div ref={windowRef}>
                    {children}
                </div>
            </div>
        </Draggable>
    );
});

export default DraggableWindow;
