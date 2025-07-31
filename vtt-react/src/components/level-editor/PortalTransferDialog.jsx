import React, { useState, useEffect } from 'react';
import WowWindow from '../windows/WowWindow';
import useMapStore from '../../store/mapStore';
import './styles/PortalTransferDialog.css';

const PortalTransferDialog = ({
    isOpen,
    onClose,
    portal,
    position = { x: 400, y: 300 }
}) => {
    const { maps, switchToMap, getCurrentMapId } = useMapStore();
    const [isTransferring, setIsTransferring] = useState(false);

    // Get destination map info
    const destinationMapId = portal?.properties?.destinationMapId;
    const destinationMap = maps.find(map => map.id === destinationMapId);
    const portalName = portal?.properties?.portalName || 'Portal';

    const handleTransfer = async () => {
        if (!destinationMapId || !destinationMap) {
            alert('Portal destination is not properly configured.');
            return;
        }

        setIsTransferring(true);
        
        try {
            // Switch to the destination map
            await switchToMap(destinationMapId);
            
            // Close the dialog
            onClose();
            
            // Show success message
            console.log(`Successfully transferred to ${destinationMap.name}`);
        } catch (error) {
            console.error('Error transferring through portal:', error);
            alert('Failed to transfer through portal. Please try again.');
        } finally {
            setIsTransferring(false);
        }
    };

    const handleStayHere = () => {
        onClose();
    };

    if (!portal || !isOpen) {
        return null;
    }

    return (
        <WowWindow
            title="Portal Transfer"
            isOpen={isOpen}
            onClose={onClose}
            defaultSize={{ width: 500, height: 420 }}
            defaultPosition={position}
            className="portal-transfer-dialog-window"
        >
            <div className="portal-transfer-dialog">
                <div className="portal-header">
                    <h2 className="portal-title">Portal Destination</h2>
                    {portal.properties?.description && (
                        <p className="portal-description">{portal.properties.description}</p>
                    )}
                </div>

                <div className="transfer-question">
                    {destinationMap ? (
                        <>
                            <p>This portal leads to:</p>
                            <div className="destination-info">
                                <span className="destination-name">🗺️ {portalName}</span>
                            </div>
                            <p className="transfer-prompt">Would you like to travel through this portal?</p>
                        </>
                    ) : (
                        <div className="no-destination">
                            <p>⚠️ This portal is not properly configured.</p>
                            <p>No destination map has been set.</p>
                        </div>
                    )}
                </div>

                <div className="dialog-actions">
                    <button
                        className="wow-button"
                        onClick={handleStayHere}
                        disabled={isTransferring}
                    >
                        Stay Here
                    </button>
                    {destinationMap && (
                        <button
                            className="wow-button primary"
                            onClick={handleTransfer}
                            disabled={isTransferring}
                        >
                            {isTransferring ? 'Transferring...' : `Travel to ${portalName}`}
                        </button>
                    )}
                </div>
            </div>
        </WowWindow>
    );
};

export default PortalTransferDialog;
