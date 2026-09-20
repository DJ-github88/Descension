import React, { useState, useEffect } from 'react';
import { PROFESSIONAL_OBJECTS } from '../objects/ObjectSystem';
import useLevelEditorStore from '../../../store/levelEditorStore';
import useMapStore from '../../../store/mapStore';
import ConnectionRenameDialog from '../ConnectionRenameDialog';
import CanvasObjectThumbnail from '../objects/CanvasObjectThumbnail';
import './styles/ObjectTools.css';

const TransformRow = ({ label, options, value, formatOption, onSelect }) => (
    <div className="transform-row">
        <span className="transform-label">{label}</span>
        <div className="transform-options" role="group" aria-label={label}>
            {options.map((option) => {
                const isActive = value === option;
                return (
                    <button
                        key={option}
                        type="button"
                        className={`transform-btn${isActive ? ' active' : ''}`}
                        aria-pressed={isActive}
                        title={`${label}: ${formatOption(option)}`}
                        onClick={() => onSelect(option)}
                    >
                        {formatOption(option)}
                    </button>
                );
            })}
        </div>
    </div>
);

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

    const handleTransformSelect = (field, value) => {
        const settersByField = {
            objectScale: setObjectScale,
            objectRotation: setObjectRotation,
            objectRotationX: setObjectRotationX,
            objectRotationY: setObjectRotationY
        };
        settersByField[field](value);
        onSettingsChange({ ...settings, [field]: value });
    };

    useEffect(() => {
        // Sync the local catalog selection with the store even when it is
        // cleared (tab switches write `selectedObjectType: undefined`); a stale
        // local id made the next card click toggle "off" instead of arming.
        if (settings && 'selectedObjectType' in settings) setSelectedObjectType(settings.selectedObjectType);
        if (settings?.objectRotation !== undefined) setObjectRotation(settings.objectRotation);
        if (settings?.objectRotationX !== undefined) setObjectRotationX(settings.objectRotationX);
        if (settings?.objectRotationY !== undefined) setObjectRotationY(settings.objectRotationY);
        if (settings?.objectScale !== undefined) setObjectScale(settings.objectScale);
    }, [settings?.selectedObjectType, settings?.objectRotation, settings?.objectRotationX, settings?.objectRotationY, settings?.objectScale]);

    // NOTE: the panel intentionally does not reset tool settings on mount. The
    // editor clears the catalog selection when the Objects tab is opened
    // (`handleTabChange`), and a mount-time reset raced with the sync effect:
    // it copied the previous selection into local state before clearing the
    // store, so the next catalog click toggled the object off instead of
    // arming it for placement.

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

                    {/* Transform Toolbar */}
                    <div className="transform-panel">
                        <TransformRow
                            label="Scale"
                            options={[0.5, 1, 1.5, 2, 3]}
                            value={settings?.objectScale ?? objectScale}
                            formatOption={(v) => `${v}×`}
                            onSelect={(v) => handleTransformSelect('objectScale', v)}
                        />
                        <TransformRow
                            label="Rotation"
                            options={[0, 90, 180, 270]}
                            value={settings?.objectRotation ?? objectRotation}
                            formatOption={(v) => `${v}°`}
                            onSelect={(v) => handleTransformSelect('objectRotation', v)}
                        />
                        <TransformRow
                            label="Tilt (X)"
                            options={[-45, -15, 0, 15, 45]}
                            value={settings?.objectRotationX ?? objectRotationX}
                            formatOption={(v) => `${v}°`}
                            onSelect={(v) => handleTransformSelect('objectRotationX', v)}
                        />
                        <TransformRow
                            label="Roll (Y)"
                            options={[-45, -15, 0, 15, 45]}
                            value={settings?.objectRotationY ?? objectRotationY}
                            formatOption={(v) => `${v}°`}
                            onSelect={(v) => handleTransformSelect('objectRotationY', v)}
                        />
                        <div className="transform-hint">
                            <span className="transform-hint-item"><kbd>Wheel</kbd> Resize</span>
                            <span className="transform-hint-item"><kbd>Alt</kbd>+<kbd>Wheel</kbd> Rotate</span>
                            <span className="transform-hint-item"><kbd>Alt</kbd>+<kbd>Shift</kbd>+<kbd>Wheel</kbd> Tilt</span>
                            <span className="transform-hint-item"><kbd>Shift</kbd>+<kbd>Wheel</kbd> Roll</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 4px', borderTop: '1px solid rgba(255,255,255,0.08)', marginTop: 8 }}>
                            <span style={{ fontSize: 11, color: '#cbd5e1', display: 'flex', alignItems: 'center', gap: 5 }}>
                                <i className="fas fa-magnet" style={{ color: '#00ffff' }}></i> Snap to Walls
                            </span>
                            <button
                                type="button"
                                className={`transform-chip ${(settings?.snapToWall ?? true) ? 'active' : ''}`}
                                style={{
                                    padding: '3px 10px',
                                    fontSize: 11,
                                    borderRadius: 4,
                                    background: (settings?.snapToWall ?? true) ? '#0284c7' : 'rgba(255,255,255,0.1)',
                                    color: '#fff',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                                onClick={() => {
                                    const next = !(settings?.snapToWall ?? true);
                                    onSettingsChange({ ...settings, snapToWall: next });
                                }}
                            >
                                {(settings?.snapToWall ?? true) ? 'ON' : 'OFF'}
                            </button>
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
