/**
 * SelectionDetailModal - Reusable modal for displaying selection details
 * 
 * Used by Race, Class, and Background selection steps to show detailed
 * information in a popup instead of a cramped side panel.
 */

import React, { useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';

const SelectionDetailModal = ({
    isOpen,
    onClose,
    onSelect,
    selectedItem,
    selectionType = 'Item',
    children,
    width = '800px',
    hideSelectButton = false
}) => {
    const handleKeyDown = useCallback((e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = '';
        };
    }, [isOpen, handleKeyDown]);

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleSelect = () => {
        if (onSelect && selectedItem) {
            onSelect(selectedItem);
        }
        onClose();
    };

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="selection-detail-modal-overlay" onClick={handleBackdropClick}>
            <div 
                className="selection-detail-modal"
                style={{ maxWidth: width }}
                onClick={(e) => e.stopPropagation()}
            >
                <div className="selection-detail-modal-header">
                    <h3 className="selection-detail-modal-title">
                        {selectedItem?.name || `${selectionType} Details`}
                    </h3>
                    <button 
                        className="selection-detail-modal-close" 
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="selection-detail-modal-body">
                    {children}
                </div>

                <div className="selection-detail-modal-footer">
                    <button 
                        className="selection-detail-modal-btn selection-detail-modal-btn-cancel" 
                        onClick={onClose}
                    >
                        <i className="fas fa-times"></i>
                        {hideSelectButton ? 'Close' : 'Cancel'}
                    </button>
                    {!hideSelectButton && (
                        <button 
                            className="selection-detail-modal-btn selection-detail-modal-btn-select" 
                            onClick={handleSelect}
                            disabled={!selectedItem}
                        >
                            <i className="fas fa-check"></i>
                            Select {selectedItem?.name || selectionType}
                        </button>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
};

export default SelectionDetailModal;
