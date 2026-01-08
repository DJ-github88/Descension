import React, { useState, useEffect } from 'react';
import { PROFESSIONAL_OBJECTS } from '../objects/ObjectSystem';
import { getIconUrl } from '../../../utils/assetManager';
import useLevelEditorStore from '../../../store/levelEditorStore';
import useMapStore from '../../../store/mapStore';
import ConnectionRenameDialog from '../ConnectionRenameDialog';
import './styles/ObjectTools.css';

const ObjectTools = ({ selectedTool, onToolSelect, settings, onSettingsChange }) => {
    const [selectedObjectType, setSelectedObjectType] = useState(undefined);
    const [objectRotation, setObjectRotation] = useState(0);
    const [objectScale, setObjectScale] = useState(1);
    const [editingConnection, setEditingConnection] = useState(null);
    const [showRenameDialog, setShowRenameDialog] = useState(false);
    
    const { dndElements, updateDndElement } = useLevelEditorStore();
    const { maps, getCurrentMapId } = useMapStore();
    const currentMapId = getCurrentMapId();
    const currentMap = maps.find(m => m.id === currentMapId);
    
    // Get connections (portals) from current map's dndElements (should match level editor store)
    const connections = dndElements.filter(el => el.type === 'portal');

    // Object categories for organization
    const objectCategories = {
        gm: {
            name: 'GM Tools',
            icon: 'Utility/Utility',
            objects: ['gmNotes']
        }
    };

    // Tool configurations
    const objectTools = [
        {
            id: 'object_place',
            name: 'Place Object',
            icon: 'Utility/Utility',
            description: 'Place objects on the grid'
        },
        {
            id: 'object_select',
            name: 'Select Object',
            icon: 'Utility/Target Crosshair',
            description: 'Select and manipulate objects'
        },
        {
            id: 'object_rotate',
            name: 'Rotate Object',
            icon: 'Utility/Swirling Vortex',
            description: 'Rotate selected objects'
        },
        {
            id: 'object_scale',
            name: 'Scale Object',
            icon: 'Utility/Resize',
            description: 'Scale selected objects'
        },
        {
            id: 'object_delete',
            name: 'Delete Object',
            icon: 'Utility/Broken',
            description: 'Remove objects from the grid'
        }
    ];

    const handleToolSelect = (toolId) => {
        onToolSelect(toolId);

        // Don't auto-select any object when Place Object is selected
        // User must explicitly choose which object to place
        if (toolId === 'object_place') {
            // Clear any previous selections
            onSettingsChange({
                selectedObjectType: undefined,
                selectedPlacementType: undefined,
                objectRotation: settings?.objectRotation || 0,
                objectScale: settings?.objectScale || 1
            });
            return;
        }

        updateSettings();
    };

    const handleObjectSelect = (objectId) => {
        setSelectedObjectType(objectId);
        // Clear connection placement type when selecting an object
        // Pass the new value directly since state updates are async
        onSettingsChange({
            selectedObjectType: objectId,
            selectedPlacementType: undefined, // Clear connection selection
            objectRotation: settings?.objectRotation || objectRotation,
            objectScale: settings?.objectScale || objectScale
        });
    };

    const handleRotationChange = (rotation) => {
        setObjectRotation(rotation);
        // Pass the new value directly since state updates are async
        onSettingsChange({
            selectedObjectType,
            objectRotation: rotation,
            objectScale
        });
    };

    const handleScaleChange = (scale) => {
        setObjectScale(scale);
        // Pass the new value directly since state updates are async
        onSettingsChange({
            selectedObjectType,
            objectRotation,
            objectScale: scale
        });
    };

    const updateSettings = () => {
        onSettingsChange({
            selectedObjectType,
            objectRotation,
            objectScale
        });
    };

    // Sync local state with settings prop
    useEffect(() => {
        if (settings?.selectedObjectType !== undefined) {
            setSelectedObjectType(settings.selectedObjectType);
        }
        if (settings?.objectRotation !== undefined) {
            setObjectRotation(settings.objectRotation);
        }
        if (settings?.objectScale !== undefined) {
            setObjectScale(settings.objectScale);
        }
    }, [settings?.selectedObjectType, settings?.objectRotation, settings?.objectScale]);

    // Initialize settings on mount
    useEffect(() => {
        onSettingsChange({
            selectedObjectType: undefined, // Don't auto-select anything
            objectRotation: 0,
            objectScale: 1
        });
    }, []); // Only run on mount

    const handleConnectionRename = (connection, newName) => {
        updateDndElement(connection.id, {
            ...connection,
            properties: {
                ...connection.properties,
                portalName: newName
            }
        });
    };

    const handleConnectionClick = (connection) => {
        setEditingConnection(connection);
        setShowRenameDialog(true);
    };

    return (
        <div className="object-tools">
            {/* Quick Action Tools */}
            <div className="tool-section">
                <h4>Quick Actions</h4>
                <div className="quick-actions">
                    <button
                        className={`action-btn primary ${selectedTool === 'object_place' ? 'active' : ''}`}
                        onClick={() => handleToolSelect('object_place')}
                        title="Place objects on the grid"
                    >
                        Place Object
                    </button>
                    <button
                        className={`action-btn ${selectedTool === 'object_select' ? 'active' : ''}`}
                        onClick={() => handleToolSelect('object_select')}
                        title="Select and manipulate objects"
                    >
                        Select
                    </button>
                    <button
                        className={`action-btn danger ${selectedTool === 'object_delete' ? 'active' : ''}`}
                        onClick={() => handleToolSelect('object_delete')}
                        title="Remove objects from the grid"
                    >
                        Delete
                    </button>
                </div>
            </div>

            {/* Object Selection */}
            {selectedTool === 'object_place' && (
                <div className="tool-section">
                    <h4>SELECT OBJECT TO PLACE</h4>
                    
                    {/* GM Notes and other objects */}
                    <div className="objects-list">
                        {/* Connection Placement Card */}
                        <div
                            className={`object-card ${settings?.selectedPlacementType === 'connection' ? 'selected' : ''}`}
                            onClick={() => {
                                // Set placement type to connection without changing the tool
                                // Clear object type when placing connections to ensure mutual exclusivity
                                setSelectedObjectType(undefined); // Clear local state too
                                onSettingsChange({
                                    ...settings,
                                    selectedPlacementType: 'connection',
                                    selectedObjectType: undefined, // Clear object type when placing connections
                                    objectRotation: settings?.objectRotation || 0,
                                    objectScale: settings?.objectScale || 1
                                });
                            }}
                            style={{ cursor: 'pointer' }}
                        >
                            <div className="object-card-content">
                                <div 
                                    className="object-card-icon"
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '32px',
                                        fontWeight: 'bold',
                                        color: '#4a90e2',
                                        backgroundColor: 'rgba(74, 144, 226, 0.1)',
                                        borderRadius: '4px',
                                        width: '48px',
                                        height: '48px'
                                    }}
                                >
                                    ◉
                                </div>
                                <div className="object-card-info">
                                    <h5 className="object-card-name">Connection</h5>
                                    <p className="object-card-description">Place a connection point on the grid</p>
                                    <span className="gm-only-badge">GM Only</span>
                                </div>
                            </div>
                        </div>

                        {Object.entries(PROFESSIONAL_OBJECTS).map(([objectId, obj]) => (
                            <div
                                key={objectId}
                                className={`object-card ${settings?.selectedObjectType === objectId ? 'selected' : ''}`}
                                onClick={() => handleObjectSelect(objectId)}
                            >
                                <div className="object-card-content">
                                    <img
                                        src={getIconUrl(obj.icon, 'abilities')}
                                        alt={obj.name}
                                        className="object-card-icon"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = getIconUrl('Utility/Utility', 'abilities');
                                        }}
                                    />
                                    <div className="object-card-info">
                                        <h5 className="object-card-name">{obj.name}</h5>
                                        <p className="object-card-description">{obj.description}</p>
                                        {obj.gmOnly && (
                                            <span className="gm-only-badge">GM Only</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Connections List */}
                    {connections.length > 0 && (
                        <>
                            <h4 style={{ marginTop: '20px', marginBottom: '10px' }}>
                                Connections ({connections.length}) ◉ {currentMap?.name || 'Default Map'}
                            </h4>
                            <div className="connections-list" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {connections.map((conn) => {
                                    const portalName = conn.properties?.portalName || 'Unnamed Connection';
                                    const isHidden = conn.properties?.isHidden === true;
                                    const destinationMapId = conn.properties?.destinationMapId;
                                    const destinationMap = maps.find(m => m.id === destinationMapId);
                                    
                                    return (
                                        <div
                                            key={conn.id}
                                            className="connection-item"
                                            onClick={() => handleConnectionClick(conn)}
                                            style={{
                                                padding: '8px',
                                                marginBottom: '4px',
                                                border: '1px solid #ddd',
                                                borderRadius: '4px',
                                                backgroundColor: isHidden ? '#f5f5f5' : '#fff',
                                                opacity: isHidden ? 0.6 : 1,
                                                cursor: 'pointer',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.backgroundColor = isHidden ? '#e8e8e8' : '#f0f0f0';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.backgroundColor = isHidden ? '#f5f5f5' : '#fff';
                                            }}
                                        >
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                <span style={{ fontSize: '16px' }}>◉</span>
                                                <div style={{ flex: 1 }}>
                                                    <div style={{ fontWeight: 'bold', fontSize: '13px' }}>
                                                        {portalName}
                                                    </div>
                                                    {destinationMap && (
                                                        <div style={{ fontSize: '11px', color: '#666' }}>
                                                            → {destinationMap.name}
                                                        </div>
                                                    )}
                                                    {isHidden && (
                                                        <div style={{ fontSize: '10px', color: '#999', fontStyle: 'italic' }}>
                                                            Hidden
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* Connection Rename Dialog */}
            {showRenameDialog && editingConnection && (
                <ConnectionRenameDialog
                    isOpen={showRenameDialog}
                    onClose={() => {
                        setShowRenameDialog(false);
                        setEditingConnection(null);
                    }}
                    connection={editingConnection}
                    onSave={(newName) => {
                        handleConnectionRename(editingConnection, newName);
                        setShowRenameDialog(false);
                        setEditingConnection(null);
                    }}
                />
            )}






        </div>
    );
};

export default ObjectTools;
