import React from 'react'; // eslint-disable-line no-unused-vars
import WowWindow from '../windows/WowWindow';
import './MapSwitchConfirmDialog.css';

const MapSwitchConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    onStay,
    newMapName,
    position = { x: 400, y: 300 }
}) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const handleStay = () => {
        onStay();
        onClose();
    };

    return (
        <WowWindow
            title="Switch Map?"
            isOpen={isOpen}
            onClose={onClose}
            defaultSize={{ width: 350, height: 180 }}
            defaultPosition={position}
            isModal={true}
        >
            <div className="map-switch-confirm-dialog">
                <div className="dialog-content">
                    <div className="dialog-message">
                        <p>Switch to <strong>"{newMapName}"</strong>?</p>
                    </div>
                </div>

                <div className="dialog-actions">
                    <button
                        className="wow-button secondary"
                        onClick={handleStay}
                    >
                        Stay Here
                    </button>
                    <button
                        className="wow-button primary"
                        onClick={handleConfirm}
                    >
                        Switch to {newMapName}
                    </button>
                </div>
            </div>
        </WowWindow>
    );
};

export default MapSwitchConfirmDialog;
