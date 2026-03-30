import React from 'react';
import { createPortal } from 'react-dom';
import '../../styles/confirmation-dialog.css';

const ConfirmationDialog = ({ message, onConfirm, onCancel }) => {
    const handleOverlayClick = (e) => {
        // Only close if clicking directly on the overlay, not on the dialog content
        if (e.target === e.currentTarget) {
            onCancel();
        }
    };

    const handleDialogClick = (e) => {
        // Stop propagation to prevent clicks inside dialog from closing it
        e.stopPropagation();
    };

    const handleButtonClick = (e, handler) => {
        // Stop propagation and call the handler
        e.stopPropagation();
        handler();
    };

    return createPortal(
        <div 
            className="confirmation-dialog-overlay" 
            onClick={handleOverlayClick}
        >
            <div 
                className="confirmation-dialog" 
                onClick={handleDialogClick}
                onMouseDown={handleDialogClick}
            >
                <div className="confirmation-message">{message}</div>
                <div className="confirmation-buttons">
                    <button 
                        className="confirm-button" 
                        onClick={(e) => handleButtonClick(e, onConfirm)}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        Confirm
                    </button>
                    <button 
                        className="cancel-button" 
                        onClick={(e) => handleButtonClick(e, onCancel)}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmationDialog;
