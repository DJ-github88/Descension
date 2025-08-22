import React, { useRef, useState, forwardRef, useImperativeHandle, useEffect, useCallback } from 'react';
import { Resizable } from 'react-resizable';
import { createPortal } from 'react-dom';
import DraggableWindow from './DraggableWindow';
import useGameStore from '../../store/gameStore';
import '../../styles/wow-window.css';
import '../../styles/draggable-window.css';
import 'react-resizable/css/styles.css';

const WowWindow = forwardRef(({
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
    className = ""
}, ref) => {
    // Safety check for required props
    if (!isOpen) {
        return null;
    }



    // Ensure title is always defined
    const safeTitle = title || 'Window';

    // Create refs for components (hooks must be called before early returns)
    const draggableRef = useRef(null);
    const windowElementRef = useRef(null);

    // Get window scale from store
    const windowScale = useGameStore(state => state.windowScale);

    // State for window size
    const [windowSize, setWindowSize] = useState({
        width: defaultSize.width,
        height: defaultSize.height
    });

    // Listen for window scale changes and apply immediately
    useEffect(() => {
        const handleWindowScaleChange = (event) => {
            console.log('WowWindow: Window scale changed to', event.detail?.scale || 'unknown');
            // Apply scale immediately without forcing re-render
            if (windowElementRef.current) {
                const newScale = event.detail?.scale || windowScale;
                windowElementRef.current.style.transform = `scale(${newScale})`;
                windowElementRef.current.style.transformOrigin = 'top left';
                windowElementRef.current.style.willChange = 'transform';
            }
        };

        // Apply initial scale immediately
        if (windowElementRef.current) {
            windowElementRef.current.style.transform = `scale(${windowScale})`;
            windowElementRef.current.style.transformOrigin = 'top left';
            windowElementRef.current.style.willChange = 'transform';
        }

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

    // Track if window is being dragged to prevent resize conflicts
    const [isDragging, setIsDragging] = useState(false);
    const [zIndex, setZIndex] = useState(10000);

    // Handle window click to bring to front
    const handleWindowClick = useCallback((e) => {
        // Only bring to front if clicking on the window itself, not dragging
        if (!isDragging) {
            const newZIndex = Date.now(); // Use timestamp for unique z-index
            setZIndex(newZIndex);
        }
    }, [isDragging]);

    // Handle resize - only when not dragging
    const handleResize = (event, { size }) => {
        if (!isDragging) {
            setWindowSize({
                width: size.width,
                height: size.height
            });
        }
    };

    // Handle drag start/stop to prevent resize conflicts
    const handleDragStart = useCallback(() => {
        setIsDragging(true);
    }, []);

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
        >
            <Resizable
                width={windowSize.width}
                height={windowSize.height}
                minConstraints={[300, 400]}
                maxConstraints={[1200, 1000]}
                onResize={handleResize}
                resizeHandles={['se']}
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
                                                                e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
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
                                        style={{ position: 'absolute', right: '0', top: '50%', transform: 'translateY(-50%)' }}
                                    >
                                        ×
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                    <div className="window-content" onWheel={handleWindowWheel}>
                        {children}
                    </div>
                </div>
            </Resizable>
        </DraggableWindow>,
        document.body
    );
});

// Add display name to fix React warning about missing static flag
WowWindow.displayName = 'WowWindow';

export default WowWindow;
