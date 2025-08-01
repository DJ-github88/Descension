import React from 'react';
import './CategorizeModal.css';

const CategorizeModal = ({ categories, currentCategoryId, onMoveToCategory, onClose }) => {
    const availableCategories = categories.filter(category => category.id !== currentCategoryId);

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="categorize-modal" onClick={(e) => e.stopPropagation()}>
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
                        <div className="category-list">
                            {availableCategories.map(category => (
                                <div
                                    key={category.id}
                                    className="category-item"
                                    onClick={() => onMoveToCategory(category.id)}
                                >
                                    <span className="category-icon">📁</span>
                                    <span className="category-name">{category.name}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CategorizeModal;
