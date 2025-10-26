import React, { useEffect, useRef, useState } from 'react';
import '../../styles/unified-context-menu.css';

const UnifiedContextMenu = ({
    visible,
    x,
    y,
    onClose,
    items = [],
    title = null,
    disableClickOutside = false
}) => {
    const menuRef = useRef(null);
    const [hoveredSubmenuIndex, setHoveredSubmenuIndex] = useState(null);

    // Debug: Log when menu renders
    useEffect(() => {
        if (visible) {
            console.log('🖱️ [CONTEXT MENU] Rendering with items:', items);
            console.log('🖱️ [CONTEXT MENU] Items with submenus:', items.filter(item => item.submenu));
        }
    }, [visible, items]);

    // Handle clicks outside the menu and prevent wheel events from bubbling
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Skip click outside handling if disabled (parent component handles it)
            if (disableClickOutside) return;

            console.log('🖱️ [CONTEXT MENU] Click outside detected, target:', event.target);
            console.log('🖱️ [CONTEXT MENU] Menu ref current:', menuRef.current);
            console.log('🖱️ [CONTEXT MENU] Contains check:', menuRef.current?.contains(event.target));

            if (menuRef.current && !menuRef.current.contains(event.target)) {
                console.log('🖱️ [CONTEXT MENU] Closing menu due to outside click');
                onClose();
            } else {
                console.log('🖱️ [CONTEXT MENU] Click was inside menu, not closing');
            }
        };

        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                console.log('🖱️ [CONTEXT MENU] Escape key pressed, closing menu');
                onClose();
            }
        };

        // Prevent wheel events from bubbling up to the grid
        const handleWheel = (event) => {
            console.log('🖱️ [CONTEXT MENU] Wheel event on menu, preventing propagation');
            event.stopPropagation();
            event.preventDefault();
        };

        if (visible) {
            console.log('🖱️ [CONTEXT MENU] Setting up event listeners');
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscapeKey);
            const refAtMount = menuRef.current;
            if (refAtMount) {
                refAtMount.addEventListener('wheel', handleWheel, { passive: false });
            }

            return () => {
                console.log('🖱️ [CONTEXT MENU] Cleaning up event listeners');
                document.removeEventListener('mousedown', handleClickOutside);
                document.removeEventListener('keydown', handleEscapeKey);
                if (refAtMount) {
                    refAtMount.removeEventListener('wheel', handleWheel);
                }
            };
        }
    }, [visible, onClose, disableClickOutside]);

    // Calculate position to keep menu on screen
    const getMenuPosition = () => {
        if (!menuRef.current) return { left: x, top: y };

        const menuRect = menuRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let left = x;
        let top = y;

        // Adjust horizontal position if menu would go off screen
        if (left + menuRect.width > viewportWidth) {
            left = Math.max(10, x - menuRect.width);
        }

        // Adjust vertical position if menu would go off screen
        if (top + menuRect.height > viewportHeight) {
            top = Math.max(10, y - menuRect.height);
        }

        return { left, top };
    };

    if (!visible) return null;

    const position = getMenuPosition();

    return (
        <div
            ref={menuRef}
            className="unified-context-menu compact"
            style={{
                left: position.left,
                top: position.top
            }}
            onClick={(e) => {
                e.stopPropagation();
            }}
            onWheel={(e) => {
                e.stopPropagation();
                e.preventDefault();
            }}
        >
            {title && (
                <div className="context-menu-header">
                    <span className="context-menu-title">{title}</span>
                </div>
            )}
            <div className="context-menu-main">
                <div className="context-menu-group">
                    <div className="submenu">
                        {items.map((item, index) => (
                            <React.Fragment key={index}>
                                {item.type === 'separator' ? (
                                    <div className="context-menu-separator" />
                                ) : item.submenu ? (
                                    // Item with submenu
                                    <div
                                        className={`context-menu-group has-submenu ${hoveredSubmenuIndex === index ? 'hovered' : ''}`}
                                        onMouseEnter={() => {
                                            console.log('🖱️ [CONTEXT MENU] Mouse entered submenu item:', item.label, 'index:', index);
                                            setHoveredSubmenuIndex(index);
                                        }}
                                        onMouseLeave={() => {
                                            console.log('🖱️ [CONTEXT MENU] Mouse left submenu item:', item.label);
                                            setHoveredSubmenuIndex(null);
                                        }}
                                    >
                                        <div className="group-header">
                                            {item.icon}
                                            <span>{item.label}</span>
                                            <i className="fas fa-chevron-right expand-icon"></i>
                                        </div>
                                        <div className="submenu">
                                            {item.submenu.map((subItem, subIndex) => (
                                                <React.Fragment key={subIndex}>
                                                    {subItem.type === 'separator' ? (
                                                        <div className="context-menu-separator" />
                                                    ) : (
                                                        <button
                                                            className={`context-menu-button ${subItem.className || ''} ${subItem.disabled ? 'disabled' : ''}`}
                                                            style={{ pointerEvents: 'auto' }}
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                e.preventDefault();

                                                                if (!subItem.disabled && subItem.onClick) {
                                                                    const button = e.currentTarget;
                                                                    button.style.transform = 'scale(0.95)';
                                                                    button.style.opacity = '0.7';

                                                                    setTimeout(() => {
                                                                        try {
                                                                            subItem.onClick(e);
                                                                        } catch (error) {
                                                                            console.error('❌ [CONTEXT MENU] Error in onClick for:', subItem.label, error);
                                                                        }

                                                                        button.style.transform = '';
                                                                        button.style.opacity = '';
                                                                    }, 100);
                                                                }
                                                            }}
                                                            disabled={subItem.disabled}
                                                            title={subItem.tooltip}
                                                        >
                                                            {subItem.icon} {subItem.label}
                                                        </button>
                                                    )}
                                                </React.Fragment>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    // Regular button
                                    <button
                                        className={`context-menu-button ${item.className || ''} ${item.disabled ? 'disabled' : ''}`}
                                        style={{ pointerEvents: 'auto' }}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            e.preventDefault();

                                            if (!item.disabled && item.onClick) {

                                                // Add visual feedback before executing action
                                                const button = e.currentTarget;
                                                button.style.transform = 'scale(0.95)';
                                                button.style.opacity = '0.7';

                                                // Execute the action after a brief delay for visual feedback
                                                setTimeout(() => {
                                                    try {
                                                        item.onClick(e);
                                                    } catch (error) {
                                                        console.error('❌ [CONTEXT MENU] Error in onClick for:', item.label, error);
                                                    }

                                                    // Reset button appearance
                                                    button.style.transform = '';
                                                    button.style.opacity = '';
                                                }, 100);
                                            }
                                        }}
                                        disabled={item.disabled}
                                        title={item.tooltip}
                                    >
                                        {item.icon} {item.label}
                                    </button>
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UnifiedContextMenu;
