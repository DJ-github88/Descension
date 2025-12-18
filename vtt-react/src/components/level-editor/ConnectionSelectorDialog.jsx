import React, { useState, useMemo } from 'react';
import WowWindow from '../windows/WowWindow';
import useLevelEditorStore from '../../store/levelEditorStore';

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
                mapConnections = currentMapDndElements.filter(el => el.type === 'portal');
            } else {
                // Use map store for other maps
                mapConnections = (map.dndElements || []).filter(el => el.type === 'portal');
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
            title="Connect to Another Connection"
            isOpen={isOpen}
            onClose={onClose}
            defaultSize={{ width: 500, height: 600 }}
            defaultPosition={{ x: 300, y: 200 }}
        >
            <div 
                style={{ padding: '20px' }}
                onClick={(e) => e.stopPropagation()} // Prevent clicks from closing context menu
                onMouseDown={(e) => e.stopPropagation()} // Also prevent mousedown events
            >
                <p style={{ marginBottom: '15px' }}>
                    Select a connection to link to. Players clicking on this connection will be transported to the selected connection.
                </p>
                
                {allConnections.length === 0 ? (
                    <p style={{ color: '#999', textAlign: 'center', padding: '20px' }}>
                        No other connections available. Create connections on other maps first.
                    </p>
                ) : (
                    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
                        {allConnections.map((conn) => {
                            const isSelected = selectedConnection?.id === conn.id && selectedConnection?.mapId === conn.mapId;
                            const displayName = conn.properties?.portalName || 'Unnamed Connection';
                            const mapLabel = conn.mapId === currentMapId ? '(Current Map)' : `(${conn.mapName})`;
                            
                            return (
                                <div
                                    key={`${conn.mapId}-${conn.id}`}
                                    onClick={(e) => {
                                        e.stopPropagation(); // Prevent closing the dialog
                                        setSelectedConnection(conn);
                                    }}
                                    style={{
                                        padding: '12px',
                                        marginBottom: '8px',
                                        border: isSelected ? '2px solid #4a90e2' : '1px solid #ddd',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        backgroundColor: isSelected ? '#e3f2fd' : '#fff',
                                        transition: 'all 0.2s'
                                    }}
                                >
                                    <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>
                                        ◉ {displayName}
                                    </div>
                                    <div style={{ fontSize: '12px', color: '#666' }}>
                                        {mapLabel} - Map: {conn.mapName}
                                    </div>
                                    {conn.properties?.description && (
                                        <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                                            {conn.properties.description}
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                    <button className="wow-button" onClick={onClose}>
                        Cancel
                    </button>
                    <button 
                        className="wow-button primary" 
                        onClick={handleConnect} 
                        disabled={!selectedConnection}
                    >
                        Connect
                    </button>
                </div>
            </div>
        </WowWindow>
    );
};

export default ConnectionSelectorDialog;

