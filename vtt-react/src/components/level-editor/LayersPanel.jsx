import React from 'react';
import { showConfirm } from '../../utils/dialogService';

const LAYER_ICONS = {
    background: 'fa-image',
    terrain: 'fa-mountain',
    drawings: 'fa-pen-nib',
    walls: 'fa-draw-polygon',
    objects: 'fa-cube',
    lighting: 'fa-lightbulb',
    fog: 'fa-smog',
    grid: 'fa-th',
    overlay: 'fa-clone'
};

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

    const visibleCount = drawingLayers.filter(layer => (
        layer.id === 'grid' ? showGrid : layer.visible
    )).length;

    return (
        <aside className="vtt-layer-panel" role="dialog" aria-label="Layer manager">
            <div className="layer-panel-header">
                <div className="layer-panel-title">
                    <i className="fas fa-layer-group"></i>
                    <h4>Layers</h4>
                </div>
                <span className="layer-panel-count" title="Visible layers">{visibleCount}/{drawingLayers.length}</span>
                <button
                    className="layer-panel-toggle"
                    onClick={onToggleCollapse}
                    title="Close layers panel"
                    aria-label="Close layers panel"
                >
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <div className="layer-list">
                {drawingLayers.map(layer => {
                    const isVisible = layer.id === 'grid' ? showGrid : layer.visible;
                    const stateClasses = [
                        activeLayer === layer.id ? 'active' : '',
                        isVisible ? '' : 'layer-muted',
                        layer.locked ? 'layer-locked' : ''
                    ].filter(Boolean).join(' ');

                    return (
                        <div
                            key={layer.id}
                            className={`layer-item${stateClasses ? ` ${stateClasses}` : ''}`}
                            onClick={() => onSetActiveLayer(layer.id)}
                            title={`Set ${layer.name} as the active layer`}
                        >
                            <span className="layer-kind">
                                <i className={`fas ${LAYER_ICONS[layer.id] || 'fa-square'}`}></i>
                            </span>
                            <span className="layer-name">{layer.name}</span>
                            <div className="layer-controls">
                                <button
                                    type="button"
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
                                    aria-label={isVisible ? `Hide ${layer.name}` : `Show ${layer.name}`}
                                >
                                    <i className={`fas ${isVisible ? 'fa-eye' : 'fa-eye-slash'}`}></i>
                                </button>
                                <button
                                    type="button"
                                    className={`layer-lock ${layer.locked ? 'locked' : 'unlocked'}`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onToggleLayerLock(layer.id);
                                    }}
                                    title={layer.locked ? 'Unlock Layer' : 'Lock Layer'}
                                    aria-label={layer.locked ? `Unlock ${layer.name}` : `Lock ${layer.name}`}
                                >
                                    <i className={`fas ${layer.locked ? 'fa-lock' : 'fa-unlock'}`}></i>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="layer-panel-footer">
                <span className="layer-panel-hint">Click a layer to make it active.</span>
                <button
                    type="button"
                    className="layer-clear-btn"
                    onClick={async () => {
                        const confirmed = await showConfirm({
                            title: 'Clear All Editor Data',
                            message: 'Are you sure you want to clear ALL editor data (terrain, walls, fog, objects, drawings) for this map?',
                            subMessage: 'This cannot be undone.',
                            confirmText: 'Clear All',
                            isDestructive: true
                        });
                        if (confirmed) {
                            onClearAll();
                        }
                    }}
                >
                    <i className="fas fa-trash-alt"></i> Clear All Data
                </button>
            </div>
        </aside>
    );
};

export default LayersPanel;
