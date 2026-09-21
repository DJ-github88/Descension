import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import '../../styles/unified-context-menu.css';

const UnifiedContextMenu = ({
    visible,
    x,
    y,
    onClose,
    items = [],
    title = null,
    disableClickOutside = false,
    className = ''
}) => {
    const menuRef = useRef(null);
    const [hoveredSubmenuIndex, setHoveredSubmenuIndex] = useState(null);
    const [position, setPosition] = useState({ left: -9999, top: -9999 });
    const [isPositioned, setIsPositioned] = useState(false);
    const [flipSubmenuLeft, setFlipSubmenuLeft] = useState(false);

    // Calculate position after DOM mount but before paint to prevent "jump"
    useLayoutEffect(() => {
        if (!visible) {
            setIsPositioned(false);
            setPosition({ left: -9999, top: -9999 });
            setFlipSubmenuLeft(false);
            return;
        }

        if (menuRef.current) {
            const menuRect = menuRef.current.getBoundingClientRect();
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;

            let left = x;
            let top = y;

            if (left + menuRect.width > viewportWidth) {
                left = Math.max(10, x - menuRect.width);
            }

            if (top + menuRect.height > viewportHeight) {
                top = Math.max(10, y - menuRect.height);
            }

            // Flip submenus to the left if there's not enough room on the right
            const shouldFlip = (left + menuRect.width + 200) > viewportWidth;
            setFlipSubmenuLeft(shouldFlip);

            setPosition({ left, top });
            setIsPositioned(true);
        }
    }, [visible, x, y]);

    // Reset position when hidden
    useEffect(() => {
        if (!visible) {
            setIsPositioned(false);
            setFlipSubmenuLeft(false);
        }
    }, [visible]);

    // Handle clicks outside the menu and prevent wheel events from bubbling
    useEffect(() => {
        const handleClickOutside = (event) => {
            // Skip click outside handling if disabled (parent component handles it)
            if (disableClickOutside) return;

            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose?.();
            }
        };

        const handleEscapeKey = (event) => {
            if (event.key === 'Escape') {
                onClose?.();
            }
        };

        // Prevent wheel events from bubbling up to the grid
        const handleWheel = (event) => {
            event.stopPropagation();
            event.preventDefault();
        };

        if (visible) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('keydown', handleEscapeKey);
            const refAtMount = menuRef.current;
            if (refAtMount) {
                refAtMount.addEventListener('wheel', handleWheel, { passive: false });
            }

            return () => {
                document.removeEventListener('mousedown', handleClickOutside);
                document.removeEventListener('keydown', handleEscapeKey);
                if (refAtMount) {
                    refAtMount.removeEventListener('wheel', handleWheel);
                }
            };
        }
    }, [visible, onClose, disableClickOutside]);

    if (!visible) return null;

    return (
        <div
            ref={menuRef}
            className={`unified-context-menu compact ${flipSubmenuLeft ? 'submenu-flip-left' : ''} ${className} ${isPositioned ? '' : ' positioning'}`}
            style={{
                left: position.left,
                top: position.top,
                visibility: isPositioned ? 'visible' : 'hidden'
            }}
            onMouseDown={(e) => {
                e.stopPropagation();
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
                                            setHoveredSubmenuIndex(index);
                                        }}
                                        onMouseLeave={() => {
                                            setHoveredSubmenuIndex(null);
                                        }}
                                    >
                                        <div className="group-header">
                                            {item.icon && <span className="menu-icon-wrapper">{item.icon}</span>}
                                            <span className="menu-label-text">{item.label}</span>
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
                                                                    button.style.transform = 'scale(0.97)';
                                                                    button.style.opacity = '0.75';

                                                                    setTimeout(() => {
                                                                        try {
                                                                            subItem.onClick(e);
                                                                        } catch (error) {
                                                                            console.error('❌ [CONTEXT MENU] Error in onClick for:', subItem.label, error);
                                                                        }

                                                                        button.style.transform = '';
                                                                        button.style.opacity = '';
                                                                        if (!subItem.keepOpen) {
                                                                            onClose?.();
                                                                        }
                                                                    }, 80);
                                                                }
                                                            }}
                                                            disabled={subItem.disabled}
                                                            title={subItem.tooltip || subItem.title}
                                                        >
                                                            {subItem.icon && <span className="menu-icon-wrapper">{subItem.icon}</span>}
                                                            <span className="menu-label-text">{subItem.label}</span>
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
                                                const button = e.currentTarget;
                                                button.style.transform = 'scale(0.97)';
                                                button.style.opacity = '0.75';

                                                setTimeout(() => {
                                                    try {
                                                        item.onClick(e);
                                                    } catch (error) {
                                                        console.error('❌ [CONTEXT MENU] Error in onClick for:', item.label, error);
                                                    }

                                                    button.style.transform = '';
                                                    button.style.opacity = '';
                                                    if (!item.keepOpen) {
                                                        onClose?.();
                                                    }
                                                }, 80);
                                            }
                                        }}
                                        disabled={item.disabled}
                                        title={item.tooltip || item.title}
                                    >
                                        {item.icon && <span className="menu-icon-wrapper">{item.icon}</span>}
                                        <span className="menu-label-text">{item.label}</span>
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
