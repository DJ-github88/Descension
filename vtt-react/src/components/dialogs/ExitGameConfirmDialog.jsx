import React from 'react';
import { createPortal } from 'react-dom';
import '../../styles/exit-game-dialog.css';

const ExitGameConfirmDialog = ({ gameName = 'Mythrill', onConfirm, onCancel }) => {
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
            className="exit-game-dialog-overlay" 
            onClick={handleOverlayClick}
        >
            <div 
                className="exit-game-dialog" 
                onClick={handleDialogClick}
                onMouseDown={handleDialogClick}
            >
                <div className="exit-game-message">
                    Are you sure you want to exit {gameName}?
                </div>
                <div className="exit-game-buttons">
                    <button 
                        className="exit-game-confirm-button" 
                        onClick={(e) => handleButtonClick(e, onConfirm)}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        Exit Game
                    </button>
                    <button 
                        className="exit-game-cancel-button" 
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

export default ExitGameConfirmDialog;

