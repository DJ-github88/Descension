import React from 'react';
import { FaMapMarkedAlt } from 'react-icons/fa';
import WowWindow from '../windows/WowWindow';
import './MapSwitchConfirmDialog.css';

const MapSwitchConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    onStay,
    newMapName,
    thumbnail,
    position = { x: 400, y: 300 }
}) => {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    const handleStay = () => {
        onStay();
        onClose();
    };

    if (!isOpen) return null;

    return (
        <WowWindow
            title="Map Selection"
            isOpen={isOpen}
            onClose={onClose}
            defaultSize={{ width: 440, height: 380 }}
            defaultPosition={position}
            isModal={true}
            resizable={false}
        >
            <div className="map-switch-confirm-dialog">
                <div className="dialog-header-section">
                    <div className="map-preview-container">
                        {thumbnail ? (
                            <img src={thumbnail} alt={newMapName} className="map-preview-image" />
                        ) : (
                            <div className="map-preview-placeholder">
                                <FaMapMarkedAlt />
                            </div>
                        )}
                        <div className="map-preview-overlay"></div>
                    </div>
                </div>

                <div className="dialog-content-section">
                    <div className="switch-text-container">
                        <span className="switch-label">Switch To</span>
                        <h2 className="target-map-name">{newMapName}</h2>
                        <div className="separator-ornament">
                            <div className="ornament-line"></div>
                            <div className="ornament-diamond"></div>
                            <div className="ornament-line"></div>
                        </div>
                        <p className="save-warning">Your current progress on the active map will be preserved.</p>
                    </div>
                </div>

                <div className="dialog-footer-section">
                    <button
                        className="wow-button secondary"
                        onClick={handleStay}
                    >
                        Keep Current
                    </button>
                    <button
                        className="wow-button primary"
                        onClick={handleConfirm}
                    >
                        Switch Now
                    </button>
                </div>
            </div>
        </WowWindow>
    );
};

export default MapSwitchConfirmDialog;

