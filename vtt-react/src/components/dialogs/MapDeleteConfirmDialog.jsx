import WowWindow from '../windows/WowWindow';
import './MapDeleteConfirmDialog.css';

const MapDeleteConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    mapName,
    position = { x: 400, y: 300 }
}) => {
    if (!isOpen) return null;

    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <WowWindow
            title="Delete Map?"
            isOpen={isOpen}
            onClose={onClose}
            defaultSize={{ width: 480, height: 260 }}
            defaultPosition={position}
            isModal={true}
            resizable={false}
        >
            <div className="map-delete-confirm-dialog">
                <div className="dialog-content">
                    <div className="dialog-icon">⚠️</div>
                    <div className="dialog-message">
                        <p>Delete <strong>"{mapName}"</strong>?</p>
                        <p className="dialog-submessage">This action cannot be undone.</p>
                    </div>
                </div>

                <div className="dialog-actions">
                    <button
                        className="wow-button secondary"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button
                        className="wow-button danger"
                        onClick={handleConfirm}
                    >
                        Delete Map
                    </button>
                </div>
            </div>
        </WowWindow>
    );
};

export default MapDeleteConfirmDialog;
