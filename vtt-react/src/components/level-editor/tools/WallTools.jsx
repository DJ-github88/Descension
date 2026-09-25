import React, { useState, useEffect } from 'react';
import { getIconUrl } from '../../../utils/assetManager';
import { WALL_TYPES } from '../../../store/levelEditorStore';
import useLevelEditorStore from '../../../store/levelEditorStore';
import useGameStore from '../../../store/gameStore';
import WallTypeThumbnail from './WallTypeThumbnail';
import { hasCurvedCornerStyle } from '../three/ThreeDWallManager';
import './styles/WallTools.css';

// Using WALL_TYPES from store - removed duplicate definition

const WallTools = ({ selectedTool, onToolSelect, settings, onSettingsChange }) => {
    const [selectedWallType, setSelectedWallType] = useState('stone_wall');
    const [wallMode, setWallMode] = useState('continuous'); // continuous, rectangle
    const [doorOrientation, setDoorOrientation] = useState('horizontal'); // horizontal, vertical

    // Per-wall height editing (data consumed by SvgWallLayer, ShadowOverlay, prisms)
    const selectedWallKey = useLevelEditorStore(state => state.selectedWallKey);
    const wallData = useLevelEditorStore(state => state.wallData);
    const updateWall = useLevelEditorStore(state => state.updateWall);
    const gridSize = useGameStore(state => state.gridSize) || 50;
    const feetPerTile = useGameStore(state => state.feetPerTile) || 5;

    const selectedWall = selectedWallKey ? wallData?.[selectedWallKey] : null;
    const currentHeightWorld = Number.isFinite(selectedWall?.height) ? selectedWall.height : null;
    const currentHeightFeet = currentHeightWorld != null
        ? Math.round((currentHeightWorld / gridSize) * feetPerTile)
        : null;

    const handleWallHeightChange = (feet) => {
        if (!selectedWallKey || !selectedWall) return;
        if (feet === null) {
            updateWall(selectedWallKey, { height: null });
            return;
        }
        updateWall(selectedWallKey, { height: (feet / feetPerTile) * gridSize });
    };

    // Wall tool configurations
    const wallTools = [
        {
            id: 'wall_draw',
            name: 'Draw Wall',
            icon: 'Utility/Barred Shield',
            description: 'Draw walls between grid points'
        },
        {
            id: 'door_place',
            name: 'Place Door',
            icon: 'General/Lockpick',
            description: 'Place interactive doors'
        },
        {
            id: 'window_place',
            name: 'Place Window',
            icon: 'Utility/All Seeing Eye',
            description: 'Place windows and openings'
        },
        {
            id: 'wall_select',
            name: 'Select',
            icon: 'Utility/Target Crosshair',
            description: 'Select and move walls, doors, and windows'
        },
        {
            id: 'wall_erase',
            name: 'Erase Wall',
            icon: 'Utility/Broken',
            description: 'Remove walls from grid'
        }
    ];

    // Wall categories for organization using store WALL_TYPES. The decorative
    // segment models (stucco / diagonal / curved tower) are not drawable wall
    // types: curved corners are a per-type build style instead.
    const allWallCategories = {
        basic: {
            name: 'Basic Walls',
            icon: 'Utility/Barred Shield',
            walls: ['stone_wall', 'stone_wall_lowpoly', 'wooden_wall', 'brick_wall', 'gothic_stone']
        },
        fences: {
            name: 'Fences & Barriers',
            icon: 'Nature/Nature Natural',
            walls: ['hedge', 'iron_fence', 'wooden_fence', 'barrier_wood']
        },
        variations: {
            name: 'Variations & Parapets',
            icon: 'Utility/Barred Shield',
            walls: ['half_wall', 'wall_cracked', 'wall_gated', 'wall_arched', 'wall_broken', 'wall_shelves', 'stone_column', 'wooden_column']
        },
        advanced: {
            name: 'Advanced Materials',
            icon: 'Utility/Golden Toothed Gear',
            walls: ['metal_wall']
        },
        magical: {
            name: 'Magical Barriers',
            icon: 'Arcane/Orb Manipulation',
            walls: ['magical_barrier', 'force_wall']
        },
        interactive: {
            name: 'Interactive Elements',
            icon: 'General/Lockpick',
            walls: ['wooden_door', 'stone_door', 'town_door', 'iron_gate', 'wooden_gate', 'hedge_gate']
        },
        window: {
            name: 'Windows',
            icon: 'Utility/All Seeing Eye',
            walls: ['glass_window', 'barred_window', 'arrow_slit', 'open_window', 'town_window']
        }
    };

    // Filter categories based on selected tool
    const getCategoriesForTool = (tool) => {
        switch (tool) {
            case 'wall_draw':
                // Show all categories except interactive elements (doors) and windows
                const { interactive, window: windowCat, ...wallCategories } = allWallCategories;
                return wallCategories;
            case 'door_place':
                // Only show interactive elements (doors)
                return { interactive: allWallCategories.interactive };
            case 'window_place':
                // Only show window types
                return { window: allWallCategories.window };
            default:
                return {};
        }
    };

    const wallCategories = getCategoriesForTool(selectedTool);

    // Sync selectedWallType when selectedTool changes
    useEffect(() => {
        if (selectedTool === 'door_place') {
            if (!['wooden_door', 'stone_door'].includes(selectedWallType)) {
                setSelectedWallType('wooden_door');
                onSettingsChange({
                    selectedWallType: 'wooden_door',
                    wallMode,
                    doorOrientation
                });
            }
        } else if (selectedTool === 'window_place') {
            if (!['glass_window', 'barred_window', 'arrow_slit', 'open_window'].includes(selectedWallType)) {
                setSelectedWallType('glass_window');
                onSettingsChange({
                    selectedWallType: 'glass_window',
                    wallMode,
                    doorOrientation
                });
            }
        } else if (selectedTool === 'wall_draw') {
            const categories = getCategoriesForTool('wall_draw');
            const validWalls = Object.values(categories).flatMap(cat => cat.walls);
            if (!validWalls.includes(selectedWallType)) {
                setSelectedWallType('stone_wall');
                onSettingsChange({
                    selectedWallType: 'stone_wall',
                    wallMode,
                    doorOrientation
                });
            }
        }
    }, [selectedTool]);

    const handleToolSelect = (toolId) => {
        onToolSelect(toolId);
        
        // Auto-select appropriate wall type based on tool
        if (toolId === 'door_place') {
            const nextType = ['wooden_door', 'stone_door'].includes(selectedWallType) ? selectedWallType : 'wooden_door';
            setSelectedWallType(nextType);
            onSettingsChange({
                selectedWallType: nextType,
                wallMode,
                doorOrientation
            });
        } else if (toolId === 'window_place') {
            const nextType = ['glass_window', 'barred_window', 'arrow_slit', 'open_window'].includes(selectedWallType) ? selectedWallType : 'glass_window';
            setSelectedWallType(nextType);
            onSettingsChange({
                selectedWallType: nextType,
                wallMode,
                doorOrientation
            });
        } else if (toolId === 'wall_draw') {
            const categories = getCategoriesForTool('wall_draw');
            const validWalls = Object.values(categories).flatMap(cat => cat.walls);
            const nextType = validWalls.includes(selectedWallType) ? selectedWallType : 'stone_wall';
            setSelectedWallType(nextType);
            onSettingsChange({
                selectedWallType: nextType,
                wallMode,
                doorOrientation
            });
        } else {
            updateSettings();
        }
    };

    const handleWallTypeSelect = (wallType) => {
        setSelectedWallType(wallType);
        // Pass the new wallType directly since setState is asynchronous
        onSettingsChange({
            selectedWallType: wallType,
            wallMode,
            doorOrientation
        });
    };

    const handleWallModeChange = (mode) => {
        setWallMode(mode);
        // Pass the new mode directly since setState is asynchronous
        onSettingsChange({
            selectedWallType,
            wallMode: mode,
            doorOrientation
        });
    };

    const handleDoorOrientationChange = (orientation) => {
        setDoorOrientation(orientation);
        onSettingsChange({
            selectedWallType,
            wallMode,
            doorOrientation: orientation
        });
    };

    const updateSettings = () => {
        onSettingsChange({
            selectedWallType,
            wallMode,
            doorOrientation
        });
    };

    // Set initial settings when component mounts
    useEffect(() => {
        const initialType = selectedTool === 'door_place' 
            ? (['wooden_door', 'stone_door'].includes(selectedWallType) ? selectedWallType : 'wooden_door')
            : selectedTool === 'window_place'
            ? (['glass_window', 'barred_window', 'arrow_slit', 'open_window'].includes(selectedWallType) ? selectedWallType : 'glass_window')
            : (['stone_wall', 'wooden_wall', 'brick_wall', 'metal_wall', 'magical_barrier', 'force_wall'].includes(selectedWallType) ? selectedWallType : 'stone_wall');
        
        setSelectedWallType(initialType);
        onSettingsChange({
            selectedWallType: initialType,
            wallMode,
            doorOrientation
        });
    }, []); // Only run on mount

    const walls3DEnabled = useLevelEditorStore(state => state.walls3DEnabled ?? true);
    const setWalls3DEnabled = useLevelEditorStore(state => state.setWalls3DEnabled);
    const wallCornerStyles = useLevelEditorStore(state => state.wallCornerStyles || {});
    const setWallCornerStyle = useLevelEditorStore(state => state.setWallCornerStyle);
    const selectedCornerStyle = wallCornerStyles[selectedWallType] || 'square';
    const cornerStyleAvailable = hasCurvedCornerStyle(selectedWallType);

    return (
        <div className="wall-tools">
            {/* 3D Modular Walls Toggle */}
            <div className="tool-section" style={{ marginBottom: 12 }}>
                <div className={`mesh-3d-toggle ${walls3DEnabled ? 'active' : ''}`}>
                    <div className="mesh-3d-toggle-info">
                        <i className="fas fa-cubes"></i>
                        <div>
                            <div className="mesh-3d-toggle-title">3D Modular Walls</div>
                            <div className="mesh-3d-toggle-status">{walls3DEnabled ? 'Real 3D Mesh Walls Active' : 'SVG 2.5D Wall Layer Active'}</div>
                        </div>
                    </div>
                    <button
                        className={`mesh-3d-toggle-btn ${walls3DEnabled ? 'active' : ''}`}
                        onClick={() => setWalls3DEnabled(!walls3DEnabled)}
                    >
                        {walls3DEnabled ? 'ON' : 'OFF'}
                    </button>
                </div>
            </div>

            {/* Tool Selection */}
            <div className="tool-section">
                <h4>Wall Tools</h4>
                <div className="tool-grid">
                    {wallTools.map(tool => (
                        <button
                            key={tool.id}
                            className={`wall-tool-btn ${selectedTool === tool.id ? 'active' : ''}`}
                            onClick={() => handleToolSelect(tool.id)}
                            title={tool.description}
                        >
                            <img
                                src={getIconUrl(tool.icon, 'abilities')}
                                alt={tool.name}
                                className="tool-icon"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = getIconUrl('Utility/Utility', 'abilities');
                                }}
                            />
                            <span className="tool-name">{tool.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Wall Drawing Mode */}
            {selectedTool === 'wall_draw' && (
                <div className="tool-section">
                    <h4>Drawing Mode</h4>
                    <div className="mode-controls">
                        {[
                            { id: 'continuous', name: 'Continuous', desc: 'Draw connected walls' },
                            { id: 'rectangle', name: 'Rectangle', desc: 'Draw rectangular rooms' }
                        ].map(mode => (
                            <button
                                key={mode.id}
                                className={`mode-btn ${wallMode === mode.id ? 'active' : ''}`}
                                onClick={() => handleWallModeChange(mode.id)}
                                title={mode.desc}
                            >
                                {mode.name}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Select tool hints */}
            {selectedTool === 'wall_select' && (
                <div className="tool-section">
                    <h4>Select &amp; Adjust</h4>
                    <div className="wall-select-hints">
                        <div className="wall-select-hint-row">
                            <span className="hint-icon">🖱️</span>
                            <span><strong>Click</strong> a wall, door or window to select it</span>
                        </div>
                        <div className="wall-select-hint-row">
                            <span className="hint-icon">➤</span>
                            <span><strong>Drag</strong> the selected object to move it</span>
                        </div>
                        <div className="wall-select-hint-row">
                            <span className="hint-icon handle-demo">⦿</span>
                            <span><strong>Drag the gold handles</strong> on a selected wall to reshape or extend it</span>
                        </div>
                        <div className="wall-select-hint-row">
                            <span className="hint-icon">🚪</span>
                            <span>Doors and windows slide <strong>along walls</strong> automatically</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Selected wall height */}
            {selectedTool === 'wall_select' && (
                <div className="tool-section">
                    <h4>Wall Height</h4>
                    {selectedWall ? (
                        <>
                            <div style={{ fontSize: '12px', marginBottom: '6px', color: '#d9c8a4' }}>
                                Current: <strong>{currentHeightFeet != null ? `${currentHeightFeet} ft` : 'Default (9 ft)'}</strong>
                            </div>
                            <div className="mode-controls">
                                {[5, 10, 15, 20].map(feet => (
                                    <button
                                        key={feet}
                                        className={`mode-btn ${currentHeightFeet === feet ? 'active' : ''}`}
                                        onClick={() => handleWallHeightChange(feet)}
                                        title={`${feet} ft — taller walls hide more and cast longer sun shadows`}
                                    >
                                        {feet} ft
                                    </button>
                                ))}
                                <button
                                    className={`mode-btn ${currentHeightFeet == null ? 'active' : ''}`}
                                    onClick={() => handleWallHeightChange(null)}
                                    title="Use the default height (9 ft)"
                                >
                                    Default
                                </button>
                            </div>
                        </>
                    ) : (
                        <div style={{ fontSize: '11px', fontStyle: 'italic', color: '#a08c70' }}>
                            Select a wall to set its height.
                        </div>
                    )}
                </div>
            )}

            {/* Door/Window placement hint */}
            {(selectedTool === 'door_place' || selectedTool === 'window_place') && (
                <div className="tool-section">
                    <div style={{ 
                        fontSize: '11px', 
                        color: '#a08c70', 
                        fontStyle: 'italic',
                        padding: '8px',
                        background: 'rgba(0,0,0,0.2)',
                        borderRadius: '4px'
                    }}>
                        {selectedTool === 'door_place' 
                            ? 'Click on a wall to place a door. Orientation auto-detects from nearby walls.'
                            : 'Click on a wall to place a window opening. Windows allow vision through.'}
                    </div>
                </div>
            )}

            {/* Wall Type Selection */}
            {(selectedTool === 'wall_draw' || selectedTool === 'door_place' || selectedTool === 'window_place') && (
                <div className="tool-section">
                    <h4>Wall Types</h4>
                    {Object.entries(wallCategories).map(([categoryId, category]) => (
                        <div key={categoryId} className="wall-category">
                            <div className="category-header">
                                <img
                                    src={getIconUrl(category.icon, 'abilities')}
                                    alt={category.name}
                                    className="category-icon"
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = getIconUrl('Utility/Utility', 'abilities');
                                    }}
                                />
                                <span className="category-name">{category.name}</span>
                                <span className="category-count">{category.walls.length}</span>
                            </div>
                            <div className="wall-grid">
                                {category.walls.map(wallId => {
                                    const wall = WALL_TYPES[wallId];
                                    if (!wall) return null;

                                    return (
                                        <button
                                            key={wallId}
                                            className={`wall-tile ${selectedWallType === wallId ? 'active' : ''}`}
                                            onClick={() => handleWallTypeSelect(wallId)}
                                            title={`${wall.name} - ${wall.description}`}
                                        >
                                            <div className="wall-tile-thumb">
                                                <WallTypeThumbnail typeId={wallId} className="wall-thumb-img" />
                                                {selectedWallType === wallId && (
                                                    <span className="wall-tile-check">✓</span>
                                                )}
                                            </div>
                                            <div className="wall-tile-body">
                                                <span className="wall-tile-name">{wall.name}</span>
                                                <div className="wall-properties">
                                                    {wall.blocksMovement && (
                                                        <span className="property-badge movement-block" title="Blocks Movement">Blocks</span>
                                                    )}
                                                    {wall.blocksLineOfSight && (
                                                        <span className="property-badge vision-block" title="Blocks Vision">Sight</span>
                                                    )}
                                                    {wall.interactive && (
                                                        <span className="property-badge interactive" title="Interactive door/gate">Door</span>
                                                    )}
                                                    {wall.isWindow && (
                                                        <span className="property-badge window" title="Window opening">Window</span>
                                                    )}
                                                    {Number.isFinite(wall.heightScale) && wall.heightScale < 1 && (
                                                        <span className="property-badge low" title={`Low: ${Math.round(wall.heightScale * 100)}% of wall height`}>Low</span>
                                                    )}
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Corner build style for types with a dedicated corner model */}
            {selectedTool === 'wall_draw' && cornerStyleAvailable && (
                <div className="tool-section">
                    <h4>Corners</h4>
                    <div className="mode-controls">
                        {[
                            { id: 'square', name: 'Square', desc: 'Runs meet at the grid vertex' },
                            { id: 'curved', name: 'Curved', desc: 'A full-cell corner piece replaces the two end tiles' }
                        ].map(mode => (
                            <button
                                key={mode.id}
                                className={`mode-btn ${selectedCornerStyle === mode.id ? 'active' : ''}`}
                                onClick={() => setWallCornerStyle(selectedWallType, mode.id)}
                                title={mode.desc}
                            >
                                {mode.name}
                            </button>
                        ))}
                    </div>
                    <div className="wall-corner-hint">
                        Curved corners apply to {WALL_TYPES[selectedWallType]?.name || selectedWallType} walls only.
                    </div>
                </div>
            )}

            {/* Selected wall type details */}
            {(selectedTool === 'wall_draw' || selectedTool === 'door_place' || selectedTool === 'window_place') && WALL_TYPES[selectedWallType] && (
                <div className="tool-section">
                    <h4>Selected Type</h4>
                    <div className="wall-selected-info">
                        <div className="wall-selected-thumb">
                            <WallTypeThumbnail typeId={selectedWallType} className="wall-thumb-img" />
                        </div>
                        <div className="wall-selected-text">
                            <div className="wall-selected-name">{WALL_TYPES[selectedWallType].name}</div>
                            <div className="wall-selected-description">{WALL_TYPES[selectedWallType].description}</div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default WallTools;
