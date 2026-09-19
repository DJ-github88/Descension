import React, { useState, useEffect } from 'react';
import { PROFESSIONAL_OBJECTS } from '../objects/ObjectSystem';
import useLevelEditorStore from '../../../store/levelEditorStore';
import useMapStore from '../../../store/mapStore';
import ConnectionRenameDialog from '../ConnectionRenameDialog';
import CanvasObjectThumbnail from '../objects/CanvasObjectThumbnail';
import './styles/ObjectTools.css';

const ObjectTools = ({ selectedTool, onToolSelect, settings, onSettingsChange }) => {
    const [selectedObjectType, setSelectedObjectType] = useState(undefined);
    const [objectRotation, setObjectRotation] = useState(0);
    const [objectRotationX, setObjectRotationX] = useState(0);
    const [objectRotationY, setObjectRotationY] = useState(0);
    const [objectScale, setObjectScale] = useState(1);
    const [editingConnection, setEditingConnection] = useState(null);
    const [showRenameDialog, setShowRenameDialog] = useState(false);

    const { 
        dndElements, 
        updateDndElement,
        objectManipulationEnabled,
        setObjectManipulationEnabled,
        environmentalObjects,
        removeEnvironmentalObject,
        setEnvironmentalObjectLocked
    } = useLevelEditorStore();
    const { maps, getCurrentMapId } = useMapStore();
    const currentMapId = getCurrentMapId();
    const currentMap = maps.find(m => m.id === currentMapId);
    const selectedEnvObj = (environmentalObjects || []).find(o => o.selected);

    // Get connections (portals) from current map's dndElements (should match level editor store)
    const connections = dndElements.filter(el => el.type === 'portal');

    // Object categories for organization (all 100% 3D assets)
    const categoryMetadata = {
        structures: { name: '3D Structures & Architecture', icon: 'Utility/Falling Block' },
        furniture: { name: '3D Furniture & Interior', icon: 'items/Container/Chest/stone-block-chest' },
        props: { name: '3D Props, Containers & Traps', icon: 'Fire/Fire Logs' },
        crypt: { name: '3D Crypt, Graveyard & Tombs', icon: 'items/Container/Chest/stone-block-chest' },
        nature: { name: '3D Nature & Environment', icon: 'inv_misc_tree_01' },
        lighting: { name: '3D Lighting & Banners', icon: 'inv_misc_lantern_01' },
        utility: { name: 'Utility & GM Tools', icon: 'Utility/Utility' },
        gm: { name: 'GM Notes & Markers', icon: 'Utility/Utility' }
    };

    const handleToolSelect = (toolId) => {
        onToolSelect(toolId);
        if (toolId === 'object_place') {
            onSettingsChange({
                selectedObjectType: undefined,
                selectedPlacementType: undefined,
                objectRotation: settings?.objectRotation || 0,
                objectRotationX: settings?.objectRotationX || 0,
                objectRotationY: settings?.objectRotationY || 0,
                objectScale: settings?.objectScale || 1
            });
            return;
        }
        updateSettings();
    };

    const handleObjectSelect = (objectId) => {
        if (selectedObjectType === objectId) {
            setSelectedObjectType(undefined);
            onSettingsChange({
                selectedObjectType: undefined,
                selectedPlacementType: undefined,
                objectRotation: settings?.objectRotation || objectRotation,
                objectRotationX: settings?.objectRotationX || objectRotationX,
                objectRotationY: settings?.objectRotationY || objectRotationY,
                objectScale: settings?.objectScale || objectScale
            });
            return;
        }
        setSelectedObjectType(objectId);
        onSettingsChange({
            selectedObjectType: objectId,
            selectedPlacementType: undefined,
            objectRotation: settings?.objectRotation || objectRotation,
            objectRotationX: settings?.objectRotationX || objectRotationX,
            objectRotationY: settings?.objectRotationY || objectRotationY,
            objectScale: settings?.objectScale || objectScale
        });
    };

    const updateSettings = () => {
        onSettingsChange({
            selectedObjectType,
            objectRotation,
            objectRotationX,
            objectRotationY,
            objectScale
        });
    };

    useEffect(() => {
        if (settings?.selectedObjectType !== undefined) setSelectedObjectType(settings.selectedObjectType);
        if (settings?.objectRotation !== undefined) setObjectRotation(settings.objectRotation);
        if (settings?.objectRotationX !== undefined) setObjectRotationX(settings.objectRotationX);
        if (settings?.objectRotationY !== undefined) setObjectRotationY(settings.objectRotationY);
        if (settings?.objectScale !== undefined) setObjectScale(settings.objectScale);
    }, [settings?.selectedObjectType, settings?.objectRotation, settings?.objectRotationX, settings?.objectRotationY, settings?.objectScale]);

    useEffect(() => {
        onSettingsChange({
            selectedObjectType: undefined,
            objectRotation: 0,
            objectRotationX: 0,
            objectRotationY: 0,
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
                    {/* Selected Object Action Bar */}
                    {selectedEnvObj && (
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: 12,
                            padding: '6px 12px',
                            background: 'rgba(220, 53, 69, 0.15)',
                            border: '1px solid rgba(220, 53, 69, 0.4)',
                            borderRadius: 8
                        }}>
                            <span style={{ fontSize: 11, color: '#f8d7da', fontWeight: 'bold' }}>
                                Selected: {PROFESSIONAL_OBJECTS[selectedEnvObj.type]?.name || selectedEnvObj.type}
                                {selectedEnvObj.locked ? ' (Locked)' : ''}
                            </span>
                            <div style={{ display: 'flex', gap: 6 }}>
                                <button
                                    type="button"
                                    title={selectedEnvObj.locked
                                        ? 'Unlock this object so it can be moved again'
                                        : 'Lock this object in place (no move, resize, rotate or delete)'}
                                    style={{
                                        background: selectedEnvObj.locked ? '#f59e0b' : 'rgba(245, 158, 11, 0.25)',
                                        color: selectedEnvObj.locked ? '#1f2937' : '#f59e0b',
                                        border: '1px solid rgba(245, 158, 11, 0.6)',
                                        borderRadius: 4,
                                        padding: '3px 8px',
                                        fontSize: 11,
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 5
                                    }}
                                    onClick={() => {
                                        setEnvironmentalObjectLocked(selectedEnvObj.id, !selectedEnvObj.locked);
                                    }}
                                >
                                    <i className={`fas ${selectedEnvObj.locked ? 'fa-lock-open' : 'fa-lock'}`}></i>
                                    {selectedEnvObj.locked ? 'Unlock' : 'Lock'}
                                </button>
                                <button
                                    type="button"
                                    disabled={selectedEnvObj.locked}
                                    title={selectedEnvObj.locked ? 'Unlock this object first' : 'Delete this object'}
                                    style={{
                                        background: selectedEnvObj.locked ? 'rgba(220, 53, 69, 0.35)' : '#dc3545',
                                        color: '#fff',
                                        border: 'none',
                                        borderRadius: 4,
                                        padding: '3px 8px',
                                        fontSize: 11,
                                        cursor: selectedEnvObj.locked ? 'not-allowed' : 'pointer',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: 5
                                    }}
                                    onClick={() => {
                                        removeEnvironmentalObject(selectedEnvObj.id);
                                    }}
                                >
                                    <i className="fas fa-trash-alt"></i> Delete
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Scale and Rotation Toolbar */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 14, background: 'rgba(0,0,0,0.25)', padding: '8px 12px', borderRadius: 8 }}>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: 11, color: '#aaa', display: 'block', marginBottom: 4 }}>Scale:</label>
                                <div style={{ display: 'flex', gap: 4 }}>
                                    {[0.5, 1, 1.5, 2, 3].map(sc => (
                                        <button
                                            key={sc}
                                            type="button"
                                            className={`size-btn ${(settings?.objectScale || objectScale) === sc ? 'active' : ''}`}
                                            style={{ flex: 1, padding: '3px 0', fontSize: 11, cursor: 'pointer' }}
                                            onClick={() => {
                                                setObjectScale(sc);
                                                onSettingsChange({
                                                    ...settings,
                                                    objectScale: sc
                                                });
                                            }}
                                        >
                                            {sc}x
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: 11, color: '#aaa', display: 'block', marginBottom: 4 }}>Rotation:</label>
                                <div style={{ display: 'flex', gap: 4 }}>
                                    {[0, 90, 180, 270].map(deg => (
                                        <button
                                            key={deg}
                                            type="button"
                                            className={`size-btn ${(settings?.objectRotation || objectRotation) === deg ? 'active' : ''}`}
                                            style={{ flex: 1, padding: '3px 0', fontSize: 11, cursor: 'pointer' }}
                                            onClick={() => {
                                                setObjectRotation(deg);
                                                onSettingsChange({
                                                    ...settings,
                                                    objectRotation: deg
                                                });
                                            }}
                                        >
                                            {deg}°
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 12 }}>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: 11, color: '#aaa', display: 'block', marginBottom: 4 }}>Tilt (X):</label>
                                <div style={{ display: 'flex', gap: 4 }}>
                                    {[-45, -15, 0, 15, 45].map(deg => (
                                        <button
                                            key={deg}
                                            type="button"
                                            className={`size-btn ${(settings?.objectRotationX || objectRotationX) === deg ? 'active' : ''}`}
                                            style={{ flex: 1, padding: '3px 0', fontSize: 11, cursor: 'pointer' }}
                                            onClick={() => {
                                                setObjectRotationX(deg);
                                                onSettingsChange({
                                                    ...settings,
                                                    objectRotationX: deg
                                                });
                                            }}
                                        >
                                            {deg}°
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div style={{ flex: 1 }}>
                                <label style={{ fontSize: 11, color: '#aaa', display: 'block', marginBottom: 4 }}>Roll (Y):</label>
                                <div style={{ display: 'flex', gap: 4 }}>
                                    {[-45, -15, 0, 15, 45].map(deg => (
                                        <button
                                            key={deg}
                                            type="button"
                                            className={`size-btn ${(settings?.objectRotationY || objectRotationY) === deg ? 'active' : ''}`}
                                            style={{ flex: 1, padding: '3px 0', fontSize: 11, cursor: 'pointer' }}
                                            onClick={() => {
                                                setObjectRotationY(deg);
                                                onSettingsChange({
                                                    ...settings,
                                                    objectRotationY: deg
                                                });
                                            }}
                                        >
                                            {deg}°
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div style={{ fontSize: 10, color: '#8a9bb0', lineHeight: 1.4 }}>
                            Wheel: resize • Alt+Wheel: rotate • Alt+Shift+Wheel: tilt • Shift+Wheel: roll
                        </div>
                    </div>

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
                                <div className="mini-icon">� - �</div>
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
                                    <CanvasObjectThumbnail objectType={obj.id} className="mini-img" />
                                    <div className="mini-info">
                                        <span className="mini-name">{obj.name}</span>
                                        <span className="mini-badge">GM ONLY</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Content Sections */}
                    {['structures', 'furniture', 'props', 'crypt', 'nature', 'lighting'].map(cat => (
                        <div key={cat} className="object-category-section">
                            <h5 className="category-header">{categoryMetadata[cat]?.name || cat}</h5>
                            <div className="objects-grid">
                                {groupedObjects[cat]?.map((obj) => (
                                    <div
                                        key={obj.id}
                                        className={`object-card mini ${settings?.selectedObjectType === obj.id ? 'selected' : ''}`}
                                        onClick={() => handleObjectSelect(obj.id)}
                                    >
                                        <CanvasObjectThumbnail
                                            objectType={obj.id}
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
                    <h4>Connections (� - �)</h4>
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
