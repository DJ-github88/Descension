import React, { useState, useEffect, useMemo, useCallback } from 'react';
import WowWindow from '../windows/WowWindow';
import useMapStore from '../../store/mapStore';
import './styles/PortalConfigDialog.css';

const PortalConfigDialog = ({
    isOpen,
    onClose,
    portalData,
    onSave,
    position = { x: 300, y: 200 },
    mode = 'edit' // 'edit' for editing existing portal, 'create' for creating new portal template
}) => {
    const { maps = [], getCurrentMapId } = useMapStore();
    const currentMapId = getCurrentMapId();



    // For template creation, show all maps. For editing, filter out current map
    // In create mode, we want to show all maps including the current one
    // In edit mode, we filter out the current map to prevent self-referencing portals
    const availableMaps = useMemo(() => {
        if (!Array.isArray(maps)) {
            return [
                { id: 'test1', name: 'Test Map 1' },
                { id: 'test2', name: 'Test Map 2' },
                { id: 'test3', name: 'Test Map 3' }
            ];
        }

        const filteredMaps = mode === 'create' ? maps : maps.filter(map => map.id !== currentMapId);

        // Always provide test maps for debugging if no real maps available
        if (filteredMaps.length === 0) {
            return [
                { id: 'test1', name: 'Test Map 1' },
                { id: 'test2', name: 'Test Map 2' },
                { id: 'test3', name: 'Test Map 3' }
            ];
        }

        return filteredMaps;
    }, [maps, mode, currentMapId]);





    const [config, setConfig] = useState({
        name: 'Connection',
        destinationMapId: '',
        destinationPosition: null,
        color: '#4a90e2',
        isActive: true,
        description: ''
    });

    // Initialize config when portal data changes
    useEffect(() => {
        if (portalData) {
            setConfig({
                name: portalData.name || 'Connection',
                destinationMapId: portalData.destinationMapId || '',
                destinationPosition: portalData.destinationPosition || null,
                color: portalData.color || '#4a90e2',
                isActive: portalData.isActive !== false,
                description: portalData.description || ''
            });
        } else {
            // Reset to default values when no portal data
            setConfig({
                name: 'Connection',
                destinationMapId: '',
                destinationPosition: null,
                color: '#4a90e2',
                isActive: true,
                description: ''
            });
        }
    }, [portalData]);

    const handleSave = useCallback(() => {
        if (mode === 'edit' && !config.destinationMapId) {
            alert('Please select a destination map');
            return;
        }

        if (!config.name.trim()) {
            alert('Please enter a connection name');
            return;
        }

        const portalConfig = {
            ...config,
            position: portalData?.position || { x: 0, y: 0 }
        };

        onSave(portalConfig);
        onClose();
    }, [mode, config, portalData, onSave, onClose]);

    const handleCancel = useCallback(() => {
        onClose();
    }, [onClose]);

    const getDestinationMapName = useCallback((mapId) => {
        const map = maps.find(m => m.id === mapId);
        return map ? map.name : 'Unknown Map';
    }, [maps]);

    return (
        <WowWindow
            title={mode === 'create' ? "Create Connection" : "Configure Connection"}
            isOpen={isOpen}
            onClose={onClose}
            defaultSize={{ width: 450, height: 550 }}
            defaultPosition={position}
            className="portal-config-dialog-window"
        >
            <div className="portal-config-dialog">
                {/* Portal Identity Section */}
                <div className="config-section portal-identity">
                    <h4 className="section-title">Connection Identity</h4>
                    <div className="form-row">
                        <label className="config-label">
                            Connection Name:
                            <input
                                type="text"
                                className="wow-input"
                                value={config.name || ''}
                                onChange={(e) => setConfig(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Enter connection name..."
                            />
                        </label>
                    </div>

                    <div className="form-row">
                        <label className="config-label">
                            Description:
                            <textarea
                                className="wow-textarea"
                                value={config.description || ''}
                                onChange={(e) => setConfig(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Optional description for this connection..."
                                rows="3"
                            />
                        </label>
                    </div>

                    <div className="form-row">
                        <label className="config-label">
                            Destination Map:
                            <div className="destination-map-buttons">
                                {availableMaps.length === 0 ? (
                                    <p className="no-maps-warning">
                                        No other maps available. Create additional maps to set up connection destinations.
                                    </p>
                                ) : (
                                    <>
                                        <div className="map-selection-info">
                                            {config.destinationMapId ? (
                                                <span className="selected-map">
                                                    Selected: {getDestinationMapName(config.destinationMapId)}
                                                </span>
                                            ) : (
                                                <span className="no-selection">
                                                    {mode === 'create' ? 'No destination selected (optional)' : 'Please select a destination map'}
                                                </span>
                                            )}
                                        </div>
                                        <div className="map-buttons-grid">
                                            {availableMaps.map((map) => {
                                                const isSelected = config.destinationMapId === map.id;
                                                return (
                                                    <button
                                                        key={`map-${map.id}`}
                                                        type="button"
                                                        className={`map-button ${isSelected ? 'selected' : ''}`}
                                                        onClick={() => setConfig(prev => ({
                                                            ...prev,
                                                            destinationMapId: isSelected ? '' : map.id
                                                        }))}
                                                    >
                                                        🗺️ {map.name}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </>
                                )}
                            </div>
                        </label>
                    </div>
                </div>

                {/* Appearance Section */}
                <div className="config-section portal-appearance">
                    <h4 className="section-title">Appearance</h4>
                    <div className="form-row">
                        <label className="config-label">
                            Connection Color:
                            <div className="color-picker-container">
                                <input
                                    type="color"
                                    className="color-picker"
                                    value={config.color || '#4a90e2'}
                                    onChange={(e) => setConfig(prev => ({ ...prev, color: e.target.value }))}
                                />
                                <div
                                    className="color-preview"
                                    style={{ backgroundColor: config.color }}
                                >
                                    🌀
                                </div>
                            </div>
                        </label>
                    </div>
                </div>

                {/* Settings Section */}
                <div className="config-section portal-settings">
                    <h4 className="section-title">Settings</h4>
                    <div className="form-row">
                        <label className="config-checkbox">
                            <input
                                type="checkbox"
                                checked={config.isActive || false}
                                onChange={(e) => setConfig(prev => ({ ...prev, isActive: e.target.checked }))}
                            />
                            Connection is active
                        </label>
                        <p className="checkbox-help">
                            Inactive portals cannot be used for teleportation
                        </p>
                    </div>
                </div>

                {config.destinationMapId && (
                    <div className="portal-preview">
                        <h4>Connection Preview</h4>
                        <div className="preview-card">
                            <div className="preview-icon" style={{ color: config.color }}>
                                🌀
                            </div>
                            <div className="preview-info">
                                <div className="preview-name">{config.name}</div>
                                <div className="preview-destination">
                                    → {getDestinationMapName(config.destinationMapId)}
                                </div>
                                {config.description && (
                                    <div className="preview-description">
                                        {config.description}
                                    </div>
                                )}
                                <div className="preview-status">
                                    Status: {config.isActive ? 'Active' : 'Inactive'}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="dialog-actions">
                    <button
                        className="wow-button"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="wow-button primary"
                        onClick={handleSave}
                        disabled={!config.name || !config.name.trim()}
                    >
                        {mode === 'create' ? 'Create' : 'Save Connection'}
                    </button>
                </div>
            </div>
        </WowWindow>
    );
};

export default PortalConfigDialog;
