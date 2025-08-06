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

    // State for window position
    const [position, setPosition] = useState(defaultPosition);

    // Track dragging state to prevent conflicts
    const [isDragging, setIsDragging] = useState(false);

    // Update position after initial render to ensure proper centering
    useEffect(() => {
        if (centered && windowRef.current) {
            // Short delay to ensure the window has rendered with its actual size
            const timer = setTimeout(() => {
                const newPosition = getInitialPosition();
                setPosition(newPosition);

                // No need to force positioning - React will handle it through state
            }, 100);
            return () => clearTimeout(timer);
        }
    }, [centered, getInitialPosition]);

    // Direct transform update for better performance and fluidity
    const updateTransform = useCallback((x, y, scale) => {
        if (nodeRef.current && !isDragging) {
            // Only apply transform when not dragging to prevent conflicts
            nodeRef.current.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
        }
    }, [isDragging]);

    // Manage transform through optimized DOM manipulation
    useEffect(() => {
        updateTransform(position.x, position.y, windowScale);
    }, [position.x, position.y, windowScale, updateTransform]);

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
        // Increase z-index when dragging starts to bring window to front
        if (nodeRef.current) {
            nodeRef.current.style.zIndex = (zIndex + 100).toString();
            nodeRef.current.classList.add('dragging'); // Disable transition during drag
        }

        // Call external onDragStart callback
        if (onDragStart) {
            onDragStart(data);
        }

        e.stopPropagation();
    }, [zIndex, onDragStart]);

    // Handle drag with optimized performance
    const handleDrag = useCallback((e, data) => {
        // Don't update position state during drag to prevent conflicts
        // The Draggable component handles the visual positioning

        // Call the onDrag callback during dragging for real-time updates
        if (onDrag && data && typeof data === 'object') {
            onDrag(data);
        }

        e.stopPropagation();
    }, [onDrag]);

    // Handle drag stop
    const handleDragStop = useCallback((e, data) => {
        setIsDragging(false);
        // Update state with final position (immediate, not throttled)
        setPosition({ x: data.x, y: data.y });

        // Reset z-index to normal and re-enable transitions
        if (nodeRef.current) {
            nodeRef.current.style.zIndex = zIndex.toString();
            nodeRef.current.classList.remove('dragging'); // Re-enable transition
        }

        // Call the onDrag callback if provided with valid data
        if (onDrag && data && typeof data === 'object') {
            onDrag(data);
        }

        // Call external onDragStop callback
        if (onDragStop) {
            onDragStop(data);
        }

        e.stopPropagation();
    }, [onDrag, onDragStop, zIndex]);

    // Update position after initial render to ensure proper centering
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
            scale={1} // Use scale 1 to prevent dragging conflicts
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
