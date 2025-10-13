import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useWindowManagerStore from '../../store/windowManagerStore';
import { getSafePortalTarget } from '../../utils/portalUtils';
import './CategorizeModal.css';

const CategorizeModal = ({ categories, currentCategoryId, onMoveToCategory, onClose, x, y }) => {
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const availableCategories = categories.filter(category => category.id !== currentCategoryId);

    // Generate unique window ID
    const windowId = useRef(`categorize-modal-${Date.now()}-${Math.random()}`).current;
    const [overlayZIndex, setOverlayZIndex] = useState(2000);
    const [modalZIndex, setModalZIndex] = useState(2001);

    // Window manager store actions
    const registerWindow = useWindowManagerStore(state => state.registerWindow);
    const unregisterWindow = useWindowManagerStore(state => state.unregisterWindow);

    // Register modal with window manager on mount
    useEffect(() => {
        const baseZIndex = registerWindow(windowId, 'modal');
        setOverlayZIndex(baseZIndex);
        setModalZIndex(baseZIndex + 1);

        return () => {
            unregisterWindow(windowId);
        };
    }, [windowId, registerWindow, unregisterWindow]);

    // Position the modal near the cursor but ensure it stays on screen
    const modalStyle = {
        position: 'fixed',
        left: Math.min(x, window.innerWidth - 320), // Ensure it doesn't go off right edge
        top: Math.min(y, window.innerHeight - 200), // Ensure it doesn't go off bottom edge
        zIndex: modalZIndex // Use managed z-index
    };

    // Get safe portal target
    const portalTarget = getSafePortalTarget();

    // Safety check - don't render if no portal target available
    if (!portalTarget) {
        console.error('CategorizeModal: No portal target available, cannot render');
        return null;
    }

    return createPortal(
        <>
            {/* Invisible overlay to catch clicks outside */}
            <div
                className="categorize-overlay"
                style={{ zIndex: overlayZIndex }}
                onClick={onClose}
            />

            <div className="categorize-modal" style={modalStyle} onClick={(e) => e.stopPropagation()}>
                <div className="categorize-modal-header">
                    <h3>Select Category</h3>
                    <button className="close-button" onClick={onClose}>×</button>
                </div>

                <div className="categorize-modal-content">
                    {availableCategories.length === 0 ? (
                        <div className="no-categories">
                            No other categories available
                        </div>
                    ) : (
                        <div className="category-grid">
                            {availableCategories.map(category => (
                                <div
                                    key={category.id}
                                    className="category-icon-item"
                                    onClick={() => onMoveToCategory(category.id)}
                                    onMouseEnter={() => setHoveredCategory(category)}
                                    onMouseLeave={() => setHoveredCategory(null)}
                                    title={category.name}
                                >
                                    {category.icon ? (
                                        <img
                                            src={`https://wow.zamimg.com/images/wow/icons/large/${category.icon}.jpg`}
                                            alt={category.name}
                                            className="category-icon-img"
                                            onError={(e) => {
                                                e.target.src = 'https://wow.zamimg.com/images/wow/icons/large/inv_misc_questionmark.jpg';
                                            }}
                                        />
                                    ) : (
                                        <div className="category-icon-fallback">📁</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Hover tooltip */}
                {hoveredCategory && (
                    <div className="category-tooltip">
                        {hoveredCategory.name}
                    </div>
                )}
            </div>
        </>,
        portalTarget
    );
};

export default CategorizeModal;
