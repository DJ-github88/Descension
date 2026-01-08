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
            defaultSize={{ width: 480, height: 260 }}
            defaultPosition={position}
            isModal={true}
            resizable={false}
        >
            <div className="map-switch-confirm-dialog">
                <div className="dialog-content">
                    <div className="dialog-icon">🗺️</div>
                    <div className="dialog-message">
                        <p>Switch to <strong>"{newMapName}"</strong>?</p>
                        <p className="dialog-submessage">Current map state will be saved.</p>
                    </div>
                </div>

                <div className="dialog-actions">
                    <button
                        className="wow-button secondary"
                        onClick={handleStay}
                    >
                        Cancel
                    </button>
                    <button
                        className="wow-button primary"
                        onClick={handleConfirm}
                    >
                        Switch Map
                    </button>
                </div>
            </div>
        </WowWindow>
    );
};

export default MapSwitchConfirmDialog;
