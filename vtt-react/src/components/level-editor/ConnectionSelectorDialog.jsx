import React, { useState, useMemo } from 'react';
import MythrillWindow from '../windows/MythrillWindow';
import useLevelEditorStore from '../../store/levelEditorStore';
import useInteractiveMapStore from '../../store/interactiveMapStore';
import './styles/ConnectionSelectorDialog.css';

const ConnectionSelectorDialog = ({ isOpen, onClose, sourceConnection, maps, currentMapId, onConnect }) => {
    const [selectedConnection, setSelectedConnection] = useState(null);
    const { dndElements: currentMapDndElements } = useLevelEditorStore();
    const explorationMaps = useInteractiveMapStore(state => state.maps) || [];
    const explorationPins = useInteractiveMapStore(state => state.pins) || [];

    const allConnections = useMemo(() => {
        const connections = [];

        // 1. Tactical Battle Map Connections
        (maps || []).forEach(map => {
            let mapConnections;
            if (map.id === currentMapId) {
                mapConnections = (currentMapDndElements || []).filter(el => el.type === 'portal' || el.type === 'connection');
            } else {
                mapConnections = (map.dndElements || []).filter(el => el.type === 'portal' || el.type === 'connection');
            }
            mapConnections.forEach(conn => {
                if (map.id === currentMapId && conn.id === sourceConnection?.id) {
                    return;
                }
                connections.push({
                    ...conn,
                    mapId: map.id,
                    mapName: map.name,
                    isExploration: false,
                    displayName: conn.properties?.portalName || 'Tactical Portal / Connection'
                });
            });
        });

        // 2. Exploration Scenes & Landmark Pins
        explorationMaps.forEach(expMap => {
            // Overworld/Exploration scene entry anchor
            connections.push({
                id: `exp-map-${expMap.id}`,
                mapId: expMap.id,
                mapName: expMap.name,
                isExploration: true,
                displayName: `${expMap.name} (Exploration Scene Entry)`,
                properties: {
                    portalName: `${expMap.name} (Overworld Entry)`,
                    icon: 'fa-compass'
                }
            });

            // Specific landmark pins on this exploration map
            const mapPins = explorationPins.filter(p => p.mapId === expMap.id);
            mapPins.forEach(pin => {
                connections.push({
                    id: pin.id,
                    mapId: expMap.id,
                    mapName: `${expMap.name} (Exploration)`,
                    isExploration: true,
                    displayName: `📍 ${pin.title} (${pin.type || 'POI'})`,
                    position: { x: pin.x, y: pin.y },
                    properties: {
                        portalName: pin.title,
                        icon: pin.icon || 'fa-location-dot'
                    }
                });
            });
        });

        return connections;
    }, [maps, currentMapId, currentMapDndElements, sourceConnection?.id, explorationMaps, explorationPins]);

    const handleConnect = () => {
        if (selectedConnection) {
            onConnect(selectedConnection);
        }
    };

    if (!isOpen) return null;

    return (
        <MythrillWindow
            title=""
            isOpen={isOpen}
            onClose={onClose}
            defaultSize={{ width: 560, height: 480 }}
            centered={true}
        >
            <div className="connection-selector-container">
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
                        {allConnections.map(conn => {
                            const isSelected = selectedConnection?.id === conn.id && selectedConnection?.mapId === conn.mapId;
                            const displayName = conn.displayName || conn.properties?.portalName || 'Unnamed Connection';
                            const mapLabel = conn.mapId === currentMapId ? 'Current Map' : conn.mapName;
                            const isExploration = conn.isExploration;

                            return (
                                <div
                                    key={`${conn.mapId}-${conn.id}`}
                                    className={`connection-item-card ${isSelected ? 'selected' : ''}`}
                                    onClick={() => setSelectedConnection(conn)}
                                >
                                    <div className="connection-item-header">
                                        <i className={`fas ${isExploration ? (conn.properties?.icon || 'fa-compass') : 'fa-link'} connection-item-icon-symbol`} style={isExploration ? { color: '#27ae60' } : {}}></i>
                                        <span className="connection-item-name">{displayName}</span>
                                    </div>
                                    <div className="connection-item-realm-badge">
                                        <i className={`fas ${isExploration ? 'fa-compass' : 'fa-map-marked-alt'} realm-icon`} style={isExploration ? { color: '#27ae60' } : {}}></i>
                                        <span className="realm-label">{isExploration ? 'EXPLORATION SCENE:' : 'DESTINATION REALM:'}</span>
                                        <span className="realm-name">{mapLabel}</span>
                                    </div>
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
                        className={`wow-button primary ${!selectedConnection ? 'disabled' : ''}`}
                        onClick={handleConnect}
                        disabled={!selectedConnection}
                    >
                        Establish Link
                    </button>
                </div>
            </div>
        </MythrillWindow>
    );
};

export default ConnectionSelectorDialog;
