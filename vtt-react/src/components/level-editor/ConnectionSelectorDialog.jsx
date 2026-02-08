import React, { useState, useMemo } from 'react';
import WowWindow from '../windows/WowWindow';
import useLevelEditorStore from '../../store/levelEditorStore';
import './styles/ConnectionSelectorDialog.css';

const ConnectionSelectorDialog = ({ isOpen, onClose, sourceConnection, maps, currentMapId, onConnect }) => {
    const [selectedConnection, setSelectedConnection] = useState(null);
    const { dndElements: currentMapDndElements } = useLevelEditorStore();

    // Get all connections from all maps
    // Use level editor store for current map (to get real-time updates), map store for other maps
    const allConnections = useMemo(() => {
        const connections = [];
        maps.forEach(map => {
            let mapConnections;
            if (map.id === currentMapId) {
                // Use level editor store for current map to get real-time updates
                mapConnections = currentMapDndElements.filter(el => el.type === 'portal' || el.type === 'connection');
            } else {
                // Use map store for other maps
                mapConnections = (map.dndElements || []).filter(el => el.type === 'portal' || el.type === 'connection');
            }
            mapConnections.forEach(conn => {
                // Skip the source connection itself
                if (map.id === currentMapId && conn.id === sourceConnection?.id) {
                    return;
                }
                connections.push({
                    ...conn,
                    mapId: map.id,
                    mapName: map.name
                });
            });
        });
        return connections;
    }, [maps, currentMapId, currentMapDndElements, sourceConnection?.id]);

    const handleConnect = () => {
        if (selectedConnection) {
            onConnect(selectedConnection);
        }
    };

    if (!isOpen) return null;

    return (
        <WowWindow
            title="Magical Connection Matrix"
            isOpen={isOpen}
            onClose={onClose}
            defaultSize={{ width: 500, height: 620 }}
            defaultPosition={{ x: 300, y: 150 }}
            className="connection-selector-window"
        >
            <div
                className="connection-selector-container"
                onClick={(e) => e.stopPropagation()}
                onMouseDown={(e) => e.stopPropagation()}
            >
                <p className="connection-selector-description">
                    Select a destination connection from the mystical weave. Players stepping into this portal will be transported instantly to the chosen anchor point.
                </p>

                {allConnections.length === 0 ? (
                    <div className="empty-connections-message">
                        <p>No other anchor points detected in the realms.</p>
                        <p style={{ fontSize: '12px', marginTop: '10px' }}>Create connections on this or other maps first.</p>
                    </div>
                ) : (
                    <div className="connection-list">
                        {allConnections.map((conn) => {
                            const isSelected = selectedConnection?.id === conn.id && selectedConnection?.mapId === conn.mapId;
                            const displayName = conn.properties?.portalName || 'Unnamed Connection';
                            const mapLabel = conn.mapId === currentMapId ? 'Current Map' : conn.mapName;

                            return (
                                <div
                                    key={`${conn.mapId}-${conn.id}`}
                                    className={`connection-item-card ${isSelected ? 'selected' : ''}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedConnection(conn);
                                    }}
                                >
                                    <div className="connection-item-header">
                                        <span className="connection-item-icon">◉</span>
                                        <span className="connection-item-name">{displayName}</span>
                                    </div>
                                    <div className="connection-item-meta">
                                        <span>Realm: {mapLabel}</span>
                                        {conn.type === 'portal' && <span style={{ opacity: 0.6 }}>[Portal]</span>}
                                    </div>
                                    {conn.properties?.description && (
                                        <div className="connection-item-description">
                                            "{conn.properties.description}"
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="connection-selector-actions">
                    <button className="wow-button" onClick={onClose}>
                        Dismiss
                    </button>
                    <button
                        className="wow-button primary"
                        onClick={handleConnect}
                        disabled={!selectedConnection}
                    >
                        Establish Link
                    </button>
                </div>
            </div>
        </WowWindow>
    );
};

export default ConnectionSelectorDialog;

