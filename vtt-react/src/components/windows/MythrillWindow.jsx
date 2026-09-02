import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect, useCallback } from 'react';
import { Resizable } from 'react-resizable';
import { createPortal } from 'react-dom';
import DraggableWindow from './DraggableWindow';
import useSettingsStore from '../../store/settingsStore';
import useWindowManagerStore from '../../store/windowManagerStore';
import { getSafePortalTarget } from '../../utils/portalUtils';
import { getIconUrl } from '../../utils/assetManager';
import '../../styles/wow-window.css';
import '../../styles/draggable-window.css';
import 'react-resizable/css/styles.css';

const MythrillWindow = forwardRef((props, ref) => {
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
        handleClassName = "window-header,.wow-window-drag-handle",
        className = "",
        resizable = true,
        minConstraints = [300, 400],
        maxConstraints = [2560, 1600],
        modal = false,
        backdrop = true,
        centerTitle = false
    } = props;

    // Ensure title is always defined. Allow explicit empty string to suppress the title.
    const safeTitle = title === undefined || title === null ? 'Window' : title;

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
    const layoutVersion = useWindowManagerStore(state => state.layoutVersion);

    // Compute a cascade offset once on mount so successive windows don't pile
    // at the same (x, y). Centered windows skip this (they self-position).
    const cascadedPosition = useState(() => {
        if (centered) return defaultPosition;
        const offset = useWindowManagerStore.getState().getCascadeOffset();
        return { x: defaultPosition.x + offset.x, y: defaultPosition.y + offset.y };
    })[0];

    // State for window size
    const [windowSize, setWindowSize] = useState({
        width: defaultSize.width,
        height: defaultSize.height
    });

    // Maximize (full view) state — saves prior size/position for restore
    const [isMaximized, setIsMaximized] = useState(false);
    const preMaximizeRef = useRef({ size: null, pos: null });

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

    const hasBeenCentered = useRef(false);
    const prevCentered = useRef(centered);

    // Effect to handle window centering
    useEffect(() => {
        // Center the window on mount if centered is true, but only once
        if (centered && draggableRef.current && !hasBeenCentered.current) {
            // Use a timeout to ensure the window has rendered with its actual size
            const timer = setTimeout(() => {
                if (draggableRef.current) {
                    draggableRef.current.centerWindow();
                    hasBeenCentered.current = true;
                }
            }, 100);

            return () => clearTimeout(timer);
        }
    }, [centered]);

    // Reset centering flag if centered prop changes or window re-opens
    useEffect(() => {
        if (centered && !prevCentered.current) {
            hasBeenCentered.current = false;
        }
        prevCentered.current = centered;
    }, [centered]);

    // Effect to handle window resize for centered windows
    useEffect(() => {
        if (centered) {
            const handleResize = () => {
                if (isMaximized) return;
                if (draggableRef.current) {
                    draggableRef.current.centerWindow();
                }
            };

            window.addEventListener('resize', handleResize);
            return () => window.removeEventListener('resize', handleResize);
        }
    }, [centered, isMaximized]);

    // Track if window is being dragged or resized to prevent conflicts
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [zIndex, setZIndex] = useState(1000);

    // Register window with window manager on mount
    useEffect(() => {
        const windowType = modal ? 'modal' : 'window';
        const initialZIndex = registerWindow(windowId, windowType, onClose);
        setZIndex(initialZIndex);

        return () => {
            unregisterWindow(windowId);
        };
    }, [windowId, registerWindow, unregisterWindow, modal]); // onClose intentionally omitted – it's kept fresh via updateWindowOnClose below

    // Keep the latest onClose in a ref so we can register a STABLE wrapper with
    // the window manager. This breaks an infinite loop: previously the effect
    // depended on `onClose`, and parent components (e.g. Navigation) frequently
    // pass a new inline onClose on every render. Each call to
    // updateWindowOnClose replaced the store's `windows` Map, which re-rendered
    // those parents, which produced yet another new onClose reference, etc.
    const onCloseRef = useRef(onClose);
    useEffect(() => {
        onCloseRef.current = onClose;
    }, [onClose]);

    // Register a stable wrapper once per window. The wrapper always invokes the
    // freshest onClose via the ref, so we never need to re-register.
    useEffect(() => {
        const updateWindowOnClose = useWindowManagerStore.getState().updateWindowOnClose;
        if (updateWindowOnClose) {
            const stableWrapper = () => {
                if (typeof onCloseRef.current === 'function') {
                    onCloseRef.current();
                }
            };
            updateWindowOnClose(windowId, stableWrapper);
        }
    }, [windowId]);

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
        e.stopPropagation();

        if (!windowElementRef.current) return;
        if (!windowElementRef.current.contains(e.target)) return;

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

        if (!isDragging) {
            const newZIndex = bringToFront(windowId);
            if (newZIndex) {
                setZIndex(newZIndex);
            }
        }
    }, [isDragging, windowId, bringToFront]);

    const handleWindowMouseDown = useCallback((e) => {
        if (!isDragging && windowElementRef.current && windowElementRef.current.contains(e.target)) {
            const target = e.target;
            if (target.tagName !== 'BUTTON' &&
                target.tagName !== 'INPUT' &&
                target.tagName !== 'SELECT' &&
                target.tagName !== 'TEXTAREA' &&
                !target.closest('button') &&
                !target.closest('input') &&
                !target.closest('select') &&
                !target.closest('textarea')) {
                const newZIndex = bringToFront(windowId);
                if (newZIndex) {
                    setZIndex(newZIndex);
                }
            }
        }
    }, [isDragging, windowId, bringToFront]);

    // Ref to track resize size and RAF handle for smooth resizing
    const resizeSizeRef = useRef({ width: windowSize.width, height: windowSize.height });
    const rafResizeRef = useRef(null);

    // Handle resize start - disable transitions for smooth resizing
    const handleResizeStart = useCallback((event) => {
        setIsResizing(true);
        document.body.classList.add('window-resizing');
        // Sync resizing state to store
        useWindowManagerStore.getState().setResizingWindowId(windowId);
        
        // Store initial size
        resizeSizeRef.current = { width: windowSize.width, height: windowSize.height };
        // Bring window to front when resize starts
        const newZIndex = bringToFront(windowId);
        if (newZIndex) {
            setZIndex(newZIndex);
        }
    }, [windowId, bringToFront, windowSize.width, windowSize.height]);

    // Handle resize - directly update window size for responsive tracking
    const handleResize = useCallback((event, { size }) => {
        setWindowSize({
            width: size.width,
            height: size.height
        });
    }, []);

    // Handle resize stop - notify parent once when done
    const handleResizeStop = useCallback((event, { size }) => {
        setIsResizing(false);
        document.body.classList.remove('window-resizing');
        useWindowManagerStore.getState().setResizingWindowId(null);

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
        // Sync dragging state to store
        useWindowManagerStore.getState().setDraggingWindowId(windowId);
        
        // Bring window to front when drag starts
        const newZIndex = bringToFront(windowId);
        if (newZIndex) {
            setZIndex(newZIndex);
        }
    }, [windowId, bringToFront]);

    const handleDragStop = useCallback((position) => {
        setIsDragging(false);
        // Clear dragging state in store
        useWindowManagerStore.getState().setDraggingWindowId(null);

        if (onDrag) {
            onDrag(position);
        }
    }, [onDrag]);

    // ===== Maximize (full view) =====
    // The window body keeps a 38px top strip for its protruding tabs; that
    // offset is scaled with the window, so subtract the *visual* offset.
    const applyMaximizedSize = useCallback(() => {
        const scale = windowScale || 1;
        setWindowSize({
            width: Math.round(window.innerWidth / scale),
            height: Math.round((window.innerHeight - 38 * scale) / scale)
        });
    }, [windowScale]);

    const handleMaximizeToggle = useCallback(() => {
        if (!draggableRef.current) return;
        const newZIndex = bringToFront(windowId);
        if (newZIndex) {
            setZIndex(newZIndex);
        }
        if (!isMaximized) {
            const pos = draggableRef.current.getPosition ? draggableRef.current.getPosition() : null;
            preMaximizeRef.current = { size: { ...windowSize }, pos: pos ? { ...pos } : null };
            applyMaximizedSize();
            draggableRef.current.setPosition({ x: 0, y: 0 });
            setIsMaximized(true);
        } else {
            const saved = preMaximizeRef.current;
            if (saved.size) {
                setWindowSize(saved.size);
            }
            if (saved.pos && draggableRef.current.setPosition) {
                draggableRef.current.setPosition(saved.pos);
            }
            setIsMaximized(false);
        }
    }, [isMaximized, windowSize, windowId, bringToFront, applyMaximizedSize]);

    // Keep maximized windows covering the viewport on browser resize / scale change
    useEffect(() => {
        if (!isMaximized) return undefined;
        const handleViewportChange = () => applyMaximizedSize();
        window.addEventListener('resize', handleViewportChange);
        window.addEventListener('windowScaleChanged', handleViewportChange);
        return () => {
            window.removeEventListener('resize', handleViewportChange);
            window.removeEventListener('windowScaleChanged', handleViewportChange);
        };
    }, [isMaximized, applyMaximizedSize]);

    useEffect(() => {
        if (!modal || !isOpen) return;
        const dialog = windowElementRef.current;
        if (!dialog) return;

        const previouslyFocused = document.activeElement;
        dialog.focus();

        const handleKeydown = (e) => {
            if (e.key === 'Tab') {
                const items = dialog.querySelectorAll(
                    'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'
                );
                if (items.length === 0) return;
                const first = items[0];
                const last = items[items.length - 1];
                if (e.shiftKey && document.activeElement === first) {
                    e.preventDefault();
                    last.focus();
                } else if (!e.shiftKey && document.activeElement === last) {
                    e.preventDefault();
                    first.focus();
                }
            }
        };
        dialog.addEventListener('keydown', handleKeydown);

        return () => {
            dialog.removeEventListener('keydown', handleKeydown);
            if (previouslyFocused && typeof previouslyFocused.focus === 'function') {
                try { previouslyFocused.focus(); } catch (_) {}
            }
        };
    }, [modal, isOpen]);

    // Don't render if not open (early return after all hooks)
    if (!isOpen) return null;

    // Use createPortal to render the window at the document body level
    // This ensures it's not constrained by any parent containers
    const portalTarget = getSafePortalTarget();

    // Safety check - don't render if no portal target available
    if (!portalTarget) {
        console.error('MythrillWindow: No portal target available, cannot render');
        return null;
    }

    return createPortal(
        <React.Fragment>
            {modal && backdrop !== false && (
                <div
                    className="wow-window-modal-backdrop"
                    style={{ zIndex: zIndex - 1 }}
                    onClick={backdrop === 'static' ? undefined : () => { if (onClose) onClose(); }}
                    aria-hidden="true"
                />
            )}
        <DraggableWindow
            ref={draggableRef}
            isOpen={isOpen}
            defaultPosition={cascadedPosition}
            defaultSize={windowSize}
            centered={centered}
            bounds={bounds}
            handleClassName={handleClassName}
            zIndex={zIndex}
            onDragStart={handleDragStart}
            onDragStop={handleDragStop}
            className={isResizing ? 'resizing' : ''}
            resetSignal={layoutVersion}
            disableDragging={isMaximized}
        >
            <Resizable
                width={windowSize.width}
                height={windowSize.height}
                minConstraints={minConstraints}
                maxConstraints={maxConstraints}
                onResizeStart={handleResizeStart}
                onResize={handleResize}
                onResizeStop={handleResizeStop}
                resizeHandles={resizable && !isMaximized ? ['se'] : []}
                transformScale={windowScale}
            >
                <div
                    className={`wow-window ${isMaximized ? 'wow-window-maximized' : ''} ${className}`}
                    style={{
                        width: windowSize.width,
                        height: windowSize.height
                    }}
                    ref={windowElementRef}
                    role="dialog"
                    aria-modal={modal ? true : undefined}
                    aria-label={safeTitle}
                    tabIndex={modal ? -1 : undefined}
                    onClick={handleWindowClick}
                    onMouseDown={handleWindowMouseDown}
                >
                    {customHeader ? (
                        <>
                            {/* Tabs or custom header */}
                            <div className="window-header wow-custom-header-handle">
                                {customHeader}
                            </div>
                        </>
                    ) : (safeTitle || headerTabs.length > 0) ? (
                        <div className="window-header">
                            <div className="window-header-content">
                                {safeTitle && centerTitle ? (
                                    <>
                                        <div className="window-title centered">{safeTitle}</div>
                                        <div className="header-spacer"></div>
                                    </>
                                ) : safeTitle ? (
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
                                    </>
                                ) : (
                                    /* Tabs only (no title) */
                                    <div className="window-header-tabs" style={{ flex: 1 }}>
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
                            </div>
                        </div>
                    ) : null}
                    <div className="window-content" tabIndex={-1}>
                        {/* Maximize / restore button — positioned inside the content area */}
                        <button
                            className="window-close wow-window-maximize-btn"
                            aria-label={isMaximized ? 'Restore window' : 'Maximize window'}
                            title={isMaximized ? 'Restore window' : 'Full view'}
                            onClick={(e) => {
                                e.stopPropagation();
                                handleMaximizeToggle();
                            }}
                        >
                            <i className={`fas ${isMaximized ? 'fa-compress' : 'fa-expand'}`}></i>
                        </button>
                        {/* Close button — positioned inside the content area */}
                        <button
                            className="window-close wow-window-close-btn"
                            aria-label="Close"
                            onClick={(e) => {
                                e.stopPropagation();
                                if (onClose) onClose();
                            }}
                        >
                            {"×"}
                        </button>
                        {children}
                    </div>
                </div>
            </Resizable>
        </DraggableWindow>
        </React.Fragment>,
        portalTarget
    );
});

// Add display name to fix React warning about missing static flag
MythrillWindow.displayName = 'MythrillWindow';

export default MythrillWindow;
