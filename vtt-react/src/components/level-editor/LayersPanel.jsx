import React from 'react';

const LayersPanel = ({
    isCollapsed,
    onToggleCollapse,
    drawingLayers,
    activeLayer,
    onSetActiveLayer,
    showGrid,
    onToggleLayerVisibility,
    onToggleLayerLock,
    onLegacyToggleLayer,
    onToggleGrid,
    onClearAll
}) => {
    if (isCollapsed) return null;

    return (
        <div className="vtt-layer-panel">
            <div className="layer-panel-header">
                <h4>Layers</h4>
                <button
                    className="layer-panel-toggle"
                    onClick={onToggleCollapse}
                    title="Collapse Layers Panel"
                >
                    ▶
                </button>
            </div>
            <div className="layer-list">
                {drawingLayers.map(layer => {
                    const isVisible = layer.id === 'grid' ? showGrid : layer.visible;
                    return (
                        <div
                            key={layer.id}
                            className={`layer-item ${activeLayer === layer.id ? 'active' : ''}`}
                            onClick={() => onSetActiveLayer(layer.id)}
                        >
                            <span className="layer-name">{layer.name}</span>
                            <div className="layer-controls">
                                <button
                                    className={`layer-visibility ${isVisible ? 'visible' : 'hidden'}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleLayerVisibility(layer.id);
                                        if (layer.id === 'grid') {
                                            onToggleGrid();
                                        } else if (layer.id === 'background') {
                                            onLegacyToggleLayer('dnd');
                                        } else {
                                            onLegacyToggleLayer(layer.id);
                                        }
                                    }}
                                    title={isVisible ? 'Hide Layer' : 'Show Layer'}
                                >
                                    <i className={`fas ${isVisible ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                                </button>
                                <button
                                    className={`layer-lock ${layer.locked ? 'locked' : 'unlocked'}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleLayerLock(layer.id);
                                    }}
                                    title={layer.locked ? 'Unlock Layer' : 'Lock Layer'}
                                >
                                    <i className={`fas ${layer.locked ? 'fa-lock' : 'fa-unlock'}`}></i>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            <div className="layer-actions">
                <button
                    className="action-btn danger"
                    onClick={() => {
                        if (window.confirm('Are you sure you want to clear ALL editor data (terrain, walls, fog, objects, drawings) for this map? This cannot be undone.')) {
                            onClearAll();
                        }
                    }}
                    style={{ width: '100%' }}
                >
                    Clear All Data
                </button>
            </div>
        </div>
    );
};

export default LayersPanel;
