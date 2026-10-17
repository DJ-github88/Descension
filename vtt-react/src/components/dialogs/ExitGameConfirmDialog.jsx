import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import '../../styles/exit-game-dialog.css';

const ExitGameConfirmDialog = ({ gameName = 'Mythrill', onConfirm, onCancel }) => {
    // Support Escape key to cancel
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                onCancel();
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [onCancel]);

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            onCancel();
        }
    };

    const handleDialogClick = (e) => {
        e.stopPropagation();
    };

    const handleButtonClick = (e, handler) => {
        e.stopPropagation();
        handler();
    };

    return createPortal(
        <div 
            className="exit-game-dialog-overlay" 
            onClick={handleOverlayClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="exit-dialog-title"
        >
            <div 
                className="exit-game-dialog" 
                onClick={handleDialogClick}
                onMouseDown={handleDialogClick}
            >
                <button
                    className="exit-game-close-btn"
                    onClick={(e) => handleButtonClick(e, onCancel)}
                    aria-label="Cancel and close dialog"
                    title="Stay in Realm"
                >
                    <i className="fas fa-times" aria-hidden="true"></i>
                </button>

                <div className="exit-game-header">
                    <div className="exit-game-seal" aria-hidden="true">
                        <i className="fas fa-door-open"></i>
                    </div>
                    <div className="exit-game-category">Departure Confirmation</div>
                    <h2 id="exit-dialog-title" className="exit-game-title">Depart {gameName}?</h2>
                </div>

                <p className="exit-game-message">
                    Are you sure you wish to return to the realm gates? Your current campaign progress and character status remain safely archived.
                </p>

                <div className="exit-game-divider" aria-hidden="true">
                    <span className="divider-line"></span>
                    <span className="divider-gem">❦</span>
                    <span className="divider-line"></span>
                </div>

                <div className="exit-game-buttons">
                    <button 
                        className="exit-game-cancel-button" 
                        onClick={(e) => handleButtonClick(e, onCancel)}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        Stay in Realm
                    </button>
                    <button 
                        className="exit-game-confirm-button" 
                        onClick={(e) => handleButtonClick(e, onConfirm)}
                        onMouseDown={(e) => e.stopPropagation()}
                    >
                        Exit Game
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ExitGameConfirmDialog;
