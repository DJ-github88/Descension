import React, { useEffect, useRef } from 'react';
import '../../styles/unified-context-menu.css';

const UnifiedContextMenu = ({
    visible,
    x,
    y,
    onClose,
    items = [],
    title = null
}) => {
    const menuRef = useRef(null);

    // Handle clicks outside the menu and prevent wheel events from bubbling
    useEffect(() => {
        const handleClickOutside = (event) => {
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

        if (visible && menuRef.current) {
            console.log('🖱️ [CONTEXT MENU] Setting up event listeners');
            // Use a small delay to avoid immediate closure
            setTimeout(() => {
                document.addEventListener('mousedown', handleClickOutside);
                document.addEventListener('keydown', handleEscapeKey);
                if (menuRef.current) {
                    menuRef.current.addEventListener('wheel', handleWheel, { passive: false });
                }
            }, 100);

            return () => {
                console.log('🖱️ [CONTEXT MENU] Cleaning up event listeners');
                document.removeEventListener('mousedown', handleClickOutside);
                document.removeEventListener('keydown', handleEscapeKey);
                if (menuRef.current) {
                    menuRef.current.removeEventListener('wheel', handleWheel);
                }
            };
        }
    }, [visible, onClose]);

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
            className="unified-context-menu"
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
                <div className="context-menu-section">
                    {items.map((item, index) => (
                        <React.Fragment key={index}>
                            {item.type === 'separator' ? (
                                <div className="context-menu-separator" />
                            ) : (
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
                                                    item.onClick();
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
    );
};

export default UnifiedContextMenu;
