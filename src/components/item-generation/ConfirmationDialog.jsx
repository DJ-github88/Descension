import React from 'react';
import { createPortal } from 'react-dom';
import '../../styles/confirmation-dialog.css';

const ConfirmationDialog = ({ message, onConfirm, onCancel }) => {
    return createPortal(
        <div className="confirmation-dialog-overlay">
            <div className="confirmation-dialog">
                <div className="confirmation-message">{message}</div>
                <div className="confirmation-buttons">
                    <button className="confirm-button" onClick={onConfirm}>
                        Confirm
                    </button>
                    <button className="cancel-button" onClick={onCancel}>
                        Cancel
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default ConfirmationDialog;
