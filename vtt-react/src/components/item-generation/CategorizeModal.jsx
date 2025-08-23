import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { getSafePortalTarget } from '../../utils/portalUtils';
import './CategorizeModal.css';

const CategorizeModal = ({ categories, currentCategoryId, onMoveToCategory, onClose, x, y }) => {
    const [hoveredCategory, setHoveredCategory] = useState(null);
    const availableCategories = categories.filter(category => category.id !== currentCategoryId);

    // Position the modal near the cursor but ensure it stays on screen
    const modalStyle = {
        position: 'fixed',
        left: Math.min(x, window.innerWidth - 320), // Ensure it doesn't go off right edge
        top: Math.min(y, window.innerHeight - 200), // Ensure it doesn't go off bottom edge
        zIndex: 10000
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
            <div className="categorize-overlay" onClick={onClose} />

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
