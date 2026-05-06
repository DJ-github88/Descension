import React, { useState, useEffect } from 'react';
import { PROFESSIONAL_OBJECTS } from '../objects/ObjectSystem';
import { getIconUrl } from '../../../utils/assetManager';
import useLevelEditorStore from '../../../store/levelEditorStore';
import useMapStore from '../../../store/mapStore';
import ConnectionRenameDialog from '../ConnectionRenameDialog';
import NuclearObjectImage from '../objects/NuclearObjectImage';
import './styles/ObjectTools.css';

const ObjectTools = ({ selectedTool, onToolSelect, settings, onSettingsChange }) => {
    const [selectedObjectType, setSelectedObjectType] = useState(undefined);
    const [objectRotation, setObjectRotation] = useState(0);
    const [objectScale, setObjectScale] = useState(1);
    const [editingConnection, setEditingConnection] = useState(null);
    const [showRenameDialog, setShowRenameDialog] = useState(false);

    const { 
        dndElements, 
        updateDndElement,
        objectManipulationEnabled,
        setObjectManipulationEnabled
    } = useLevelEditorStore();
    const { maps, getCurrentMapId } = useMapStore();
    const currentMapId = getCurrentMapId();
    const currentMap = maps.find(m => m.id === currentMapId);

    // Get connections (portals) from current map's dndElements (should match level editor store)
    const connections = dndElements.filter(el => el.type === 'portal');

    // Object categories for organization
    const categoryMetadata = {
        utility: { name: 'Utility & GM Tools', icon: 'Utility/Utility' },
        furniture: { name: 'Furniture', icon: 'items/Container/Crate/wooden-crate-brown-planks-isometric' },
        props: { name: 'Props & Decorations', icon: 'Fire/Fire Logs' },
        structures: { name: 'Structures', icon: 'Utility/Falling Block' },
        nature: { name: 'Nature', icon: 'inv_misc_tree_01' },
        lighting: { name: 'Lighting', icon: 'inv_misc_lantern_01' }
    };

    const handleToolSelect = (toolId) => {
        onToolSelect(toolId);
        if (toolId === 'object_place') {
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
        onSettingsChange({
            selectedObjectType: objectId,
            selectedPlacementType: undefined,
            objectRotation: settings?.objectRotation || objectRotation,
            objectScale: settings?.objectScale || objectScale
        });
    };

    const updateSettings = () => {
        onSettingsChange({
            selectedObjectType,
            objectRotation,
            objectScale
        });
    };

    useEffect(() => {
        if (settings?.selectedObjectType !== undefined) setSelectedObjectType(settings.selectedObjectType);
        if (settings?.objectRotation !== undefined) setObjectRotation(settings.objectRotation);
        if (settings?.objectScale !== undefined) setObjectScale(settings.objectScale);
    }, [settings?.selectedObjectType, settings?.objectRotation, settings?.objectScale]);

    useEffect(() => {
        onSettingsChange({
            selectedObjectType: undefined,
            objectRotation: 0,
            objectScale: 1
        });
    }, []);

    const handleConnectionRename = (connection, newName) => {
        updateDndElement(connection.id, {
            ...connection,
            properties: { ...connection.properties, portalName: newName }
        }, currentMapId);
    };

    const handleConnectionClick = (connection) => {
        setEditingConnection(connection);
        setShowRenameDialog(true);
    };

    // Group objects by category
    const groupedObjects = Object.entries(PROFESSIONAL_OBJECTS).reduce((acc, [id, obj]) => {
        const category = obj.category || 'misc';
        if (!acc[category]) acc[category] = [];
        acc[category].push({ id, ...obj });
        return acc;
    }, {});

    return (
        <div className="object-tools" onMouseDown={(e) => e.stopPropagation()}>
            {/* Master Interaction Control */}
            <div className="object-master-header">
                <div className="interaction-lock-banner">
                    <div className="lock-info">
                        <i className={`fas ${objectManipulationEnabled ? 'fa-lock-open' : 'fa-lock'}`}></i>
                        <div className="lock-text">
                            <span className="lock-status">{objectManipulationEnabled ? 'Interaction Unlocked' : 'Interaction Locked'}</span>
                            <span className="lock-desc">{objectManipulationEnabled ? 'Edit mode active' : 'Play mode active'}</span>
                        </div>
                    </div>
                    <div className="interaction-switch-wrapper">
                        <button 
                            className={`interaction-switch ${objectManipulationEnabled ? 'active' : ''}`}
                            onClick={() => setObjectManipulationEnabled(!objectManipulationEnabled)}
                        >
                            <div className="switch-knob"></div>
                        </button>
                    </div>
                </div>
            </div>


            {selectedTool === 'object_place' && (
                <div className="tool-section">
                    <h4>OBJECT CATALOG</h4>

                    {/* Utility Section (Connections + GM Notes) */}
                    <div className="object-category-section">
                        <h5 className="category-header">Utilities & Connections</h5>
                        <div className="objects-grid">
                            <div
                                className={`object-card mini ${settings?.selectedPlacementType === 'connection' ? 'selected' : ''}`}
                                onClick={() => {
                                    setSelectedObjectType(undefined);
                                    onSettingsChange({
                                        ...settings,
                                        selectedPlacementType: 'connection',
                                        selectedObjectType: undefined
                                    });
                                }}
                            >
                                <div className="mini-icon">◉</div>
                                <div className="mini-info">
                                    <span className="mini-name">Connection</span>
                                    <span className="mini-badge">GM ONLY</span>
                                </div>
                            </div>

                            {groupedObjects['gm']?.map((obj) => (
                                <div
                                    key={obj.id}
                                    className={`object-card mini ${settings?.selectedObjectType === obj.id ? 'selected' : ''}`}
                                    onClick={() => handleObjectSelect(obj.id)}
                                >
                                    <NuclearObjectImage src={obj.image} alt={obj.name} className="mini-img" />
                                    <div className="mini-info">
                                        <span className="mini-name">{obj.name}</span>
                                        <span className="mini-badge">GM ONLY</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content Sections */}
                    {['furniture', 'props', 'structures', 'nature', 'lighting'].map(cat => (
                        <div key={cat} className="object-category-section">
                            <h5 className="category-header">{categoryMetadata[cat].name}</h5>
                            <div className="objects-grid">
                                {groupedObjects[cat]?.map((obj) => (
                                    <div
                                        key={obj.id}
                                        className={`object-card mini ${settings?.selectedObjectType === obj.id ? 'selected' : ''}`}
                                        onClick={() => handleObjectSelect(obj.id)}
                                    >
                                        <NuclearObjectImage
                                            src={obj.image}
                                            alt={obj.name}
                                            className="mini-img"
                                        />
                                        <div className="mini-info">
                                            <span className="mini-name">{obj.name}</span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Connections List */}
            {connections.length > 0 && (
                <div className="tool-section">
                    <h4>Connections (◉)</h4>
                    <div className="connections-list">
                        {connections.map((conn) => (
                            <div
                                key={conn.id}
                                className="connection-item"
                                onClick={() => handleConnectionClick(conn)}
                            >
                                <div className="conn-info">
                                    <span className="conn-name">{conn.properties?.portalName || 'Unnamed Connection'}</span>
                                    {conn.properties?.isHidden && <span className="conn-hidden">Hidden</span>}
                                </div>
                                <div className="conn-dest">
                                    {maps.find(m => m.id === conn.properties?.destinationMapId)?.name || 'No Destination'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {showRenameDialog && editingConnection && (
                <ConnectionRenameDialog
                    isOpen={showRenameDialog}
                    onClose={() => { setShowRenameDialog(false); setEditingConnection(null); }}
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
