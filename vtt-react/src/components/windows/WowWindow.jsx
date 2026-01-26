import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect, useCallback } from 'react';
import { Resizable } from 'react-resizable';
import { createPortal } from 'react-dom';
import DraggableWindow from './DraggableWindow';
import useGameStore from '../../store/gameStore';
import useSettingsStore from '../../store/settingsStore';
import useWindowManagerStore from '../../store/windowManagerStore';
import { getSafePortalTarget } from '../../utils/portalUtils';
import { getIconUrl } from '../../utils/assetManager';
import '../../styles/wow-window.css';
import '../../styles/draggable-window.css';
import 'react-resizable/css/styles.css';

const WowWindow = forwardRef((props, ref) => {
    const {
        title,
        children,
        isOpen,
        onClose,
        defaultPosition = { x: 100, y: 100 },
        defaultSize = { width: 400, height: 600 },
        customHeader,
        headerTabs = [],
        activeTab,
        onTabChange,
        centered = false,
        bounds = "body",
        onDrag = null,
        onResize = null,
        className = "",
        resizable = true,
        minConstraints = [300, 400],
        maxConstraints = [1200, 1000],
        modal = false,
        centerTitle = false
    } = props;

    // Ensure title is always defined
    const safeTitle = title || 'Window';

    // Create refs for components (hooks must be called before early returns)
    const draggableRef = useRef(null);
    const windowElementRef = useRef(null);

    // Generate unique window ID (stable across re-renders)
    const windowId = useRef(`wow-window-${Date.now()}-${Math.random()}`).current;

    // Get window scale from store
    const windowScale = useSettingsStore(state => state.windowScale);

    // Window manager store actions
    const registerWindow = useWindowManagerStore(state => state.registerWindow);
    const bringToFront = useWindowManagerStore(state => state.bringToFront);
    const unregisterWindow = useWindowManagerStore(state => state.unregisterWindow);

    // State for window size
    const [windowSize, setWindowSize] = useState({
        width: defaultSize.width,
        height: defaultSize.height
    });

    // Listen for window scale changes - DraggableWindow now handles scaling properly
    useEffect(() => {
        const handleWindowScaleChange = () => {
            // DraggableWindow handles all scaling with proper hit detection
        };

        window.addEventListener('windowScaleChanged', handleWindowScaleChange);
        return () => window.removeEventListener('windowScaleChanged', handleWindowScaleChange);
    }, [windowScale]);

    // Expose methods to parent component
    useImperativeHandle(ref, () => ({
        getElement: () => windowElementRef.current,
        centerWindow: () => {
            if (draggableRef.current) {
                draggableRef.current.centerWindow();
            }
        }
    }));

    // Effect to handle window resize for centered windows
    useEffect(() => {
        // Center the window on mount if centered is true
        if (centered && draggableRef.current) {
            // Use a timeout to ensure the window has rendered with its actual size
            const timer = setTimeout(() => {
                draggableRef.current.centerWindow();
            }, 100);

            return () => clearTimeout(timer);
        }

        // Handle window resize for centered windows
        if (centered) {
            const handleResize = () => {
                if (draggableRef.current) {
                    draggableRef.current.centerWindow();
                }
            };

            // Add event listener
            window.addEventListener('resize', handleResize);

            // Clean up
            return () => {
                window.removeEventListener('resize', handleResize);
            };
        }
    }, [centered]);

    // Track if window is being dragged or resized to prevent conflicts
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [zIndex, setZIndex] = useState(1000);

    // Register window with window manager on mount
    useEffect(() => {
        const windowType = modal ? 'modal' : 'window';
        const initialZIndex = registerWindow(windowId, windowType);
        setZIndex(initialZIndex);

        return () => {
            unregisterWindow(windowId);
        };
    }, [windowId, registerWindow, unregisterWindow, modal]);

    // Bring window to front when it opens
    useEffect(() => {
        if (isOpen) {
            // Small delay to ensure the window is registered first
            const timer = setTimeout(() => {
                const newZIndex = bringToFront(windowId);
                if (newZIndex) {
                    setZIndex(newZIndex);
                }
            }, 0);
            return () => clearTimeout(timer);
        }
    }, [isOpen, windowId, bringToFront]);

    // Handle window click to bring to front
    const handleWindowClick = useCallback((e) => {
        // Don't bring to front if clicking on interactive elements (buttons, inputs, etc.)
        const target = e.target;
        if (target.tagName === 'BUTTON' ||
            target.tagName === 'INPUT' ||
            target.tagName === 'SELECT' ||
            target.tagName === 'TEXTAREA' ||
            target.closest('button') ||
            target.closest('input') ||
            target.closest('select') ||
            target.closest('textarea')) {
            return;
        }

        // Only bring to front if clicking on the window itself, not dragging
        if (!isDragging) {
            const newZIndex = bringToFront(windowId);
            if (newZIndex) {
                setZIndex(newZIndex);
            }
        }
    }, [isDragging, windowId, bringToFront]);

    // Ref to track resize size without causing re-renders during resize
    const resizeSizeRef = useRef({ width: windowSize.width, height: windowSize.height });

    // Handle resize start - disable transitions for smooth resizing
    const handleResizeStart = useCallback((event) => {
        setIsResizing(true);
        // Store initial size
        resizeSizeRef.current = { width: windowSize.width, height: windowSize.height };
        // Bring window to front when resize starts
        const newZIndex = bringToFront(windowId);
        if (newZIndex) {
            setZIndex(newZIndex);
        }
    }, [windowId, bringToFront, windowSize.width, windowSize.height]);

    // Handle resize - update local state only for visual feedback
    // DON'T notify parent during resize to prevent expensive re-renders
    const handleResize = useCallback((event, { size }) => {
        // Update local state for immediate visual feedback
        setWindowSize({
            width: size.width,
            height: size.height
        });
        // Store in ref for final update
        resizeSizeRef.current = size;
        // Don't call onResize here - wait until resize stops
    }, []);

    // Handle resize stop - notify parent only once when done
    const handleResizeStop = useCallback((event, { size }) => {
        setIsResizing(false);
        // Final size update to local state
        setWindowSize({
            width: size.width,
            height: size.height
        });
        // NOW notify parent component of final size (only once!)
        if (onResize) {
            onResize(size);
        }
    }, [onResize]);

    // Handle drag start/stop to prevent resize conflicts
    const handleDragStart = useCallback(() => {
        // Don't allow window dragging if an item is being dragged
        if (window.isDraggingItem) {
            return;
        }

        setIsDragging(true);
        // Bring window to front when drag starts
        const newZIndex = bringToFront(windowId);
        if (newZIndex) {
            setZIndex(newZIndex);
        }
    }, [windowId, bringToFront]);

    const handleDragStop = useCallback((position) => {
        setIsDragging(false);
        if (onDrag) {
            onDrag(position);
        }
    }, [onDrag]);

    // Handle wheel events within window content to prevent conflicts with grid
    const handleWindowWheel = useCallback((e) => {
        // Allow wheel events to bubble normally within window content
        // This prevents the Grid component from intercepting wheel events
        // when they occur within WoW windows
        e.stopPropagation();
    }, []);

    // Don't render if not open (early return after all hooks)
    if (!isOpen) return null;

    // Use createPortal to render the window at the document body level
    // This ensures it's not constrained by any parent containers
    const portalTarget = getSafePortalTarget();

    // Safety check - don't render if no portal target available
    if (!portalTarget) {
        console.error('WowWindow: No portal target available, cannot render');
        return null;
    }

    return createPortal(
        <DraggableWindow
            ref={draggableRef}
            isOpen={isOpen}
            defaultPosition={defaultPosition}
            defaultSize={windowSize}
            centered={centered}
            bounds={bounds}
            handleClassName="window-header"
            zIndex={zIndex}
            onDragStart={handleDragStart}
            onDragStop={handleDragStop}
            className={isResizing ? 'resizing' : ''}
        >
            <Resizable
                width={windowSize.width}
                height={windowSize.height}
                minConstraints={minConstraints}
                maxConstraints={maxConstraints}
                onResizeStart={handleResizeStart}
                onResize={handleResize}
                onResizeStop={handleResizeStop}
                resizeHandles={resizable ? ['se'] : []}
                transformScale={windowScale}
            >
                <div
                    className={`wow-window ${className}`}
                    style={{
                        width: windowSize.width,
                        height: windowSize.height
                    }}
                    ref={windowElementRef}
                    onClick={handleWindowClick}
                >
                    <div className="window-header draggable-window-handle dnd-theme-header">
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative' }}>
                            {customHeader ? (
                                <>
                                    <div style={{ display: 'flex', alignItems: 'center', width: '100%', position: 'relative' }}>
                                        {customHeader}
                                        <button
                                            className="window-close"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                if (onClose) onClose();
                                            }}
                                            style={{
                                                position: 'absolute',
                                                right: '8px',
                                                top: '50%',
                                                transform: 'translateY(-50%)',
                                                zIndex: 10
                                            }}
                                        >
                                            ×
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="window-header-content">
                                    {centerTitle ? (
                                        <>
                                            <button
                                                className="window-close"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (onClose) onClose();
                                                }}
                                            >
                                                ×
                                            </button>
                                            <div className="window-title centered">{safeTitle}</div>
                                            <div className="header-spacer"></div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="window-title">{safeTitle}</div>

                                            {/* Header tabs */}
                                            {headerTabs.length > 0 && (
                                                <div className="window-header-tabs">
                                                    {headerTabs.map((tab) => (
                                                        <button
                                                            key={tab.id}
                                                            className={`window-header-tab ${activeTab === tab.id ? 'active' : ''}`}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                if (onTabChange) onTabChange(tab.id);
                                                            }}
                                                            title={tab.tooltip || tab.name}
                                                        >
                                                            {tab.icon && (
                                                                <img
                                                                    src={tab.icon}
                                                                    alt={tab.name}
                                                                    className="tab-icon-img"
                                                                    onError={(e) => {
                                                                        e.target.onerror = null;
                                                                        e.target.src = getIconUrl('inv_misc_questionmark', 'items');
                                                                    }}
                                                                />
                                                            )}
                                                            {tab.label && <span>{tab.label}</span>}
                                                        </button>
                                                    ))}
                                                </div>
                                            )}
                                            <button
                                                className="window-close"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    if (onClose) onClose();
                                                }}
                                            >
                                                ×
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="window-content" onWheel={handleWindowWheel}>
                        {children}
                    </div>
                </div>
            </Resizable>
        </DraggableWindow>,
        portalTarget
    );
});

// Add display name to fix React warning about missing static flag
WowWindow.displayName = 'WowWindow';

export default WowWindow;
