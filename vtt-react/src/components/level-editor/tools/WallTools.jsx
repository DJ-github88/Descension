import React, { useState, useEffect } from 'react';
import { getIconUrl } from '../../../utils/assetManager';
import { WALL_TYPES } from '../../../store/levelEditorStore';
import useLevelEditorStore from '../../../store/levelEditorStore';
import useGameStore from '../../../store/gameStore';
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

    // Wall categories for organization using store WALL_TYPES
    const allWallCategories = {
        basic: {
            name: 'Basic Walls',
            icon: 'Utility/Barred Shield',
            walls: ['stone_wall', 'wooden_wall', 'brick_wall']
        },
        variations: {
            name: 'Variations & Parapets',
            icon: 'Utility/Barred Shield',
            walls: ['half_wall', 'wall_arched', 'wall_broken', 'wall_shelves', 'barrier_wood']
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
            walls: ['wooden_door', 'stone_door']
        },
        window: {
            name: 'Windows',
            icon: 'Utility/All Seeing Eye',
            walls: ['glass_window', 'barred_window', 'arrow_slit', 'open_window']
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

    return (
        <div className="wall-tools">
            {/* 3D Modular Walls Toggle */}
            <div className="tool-section" style={{ marginBottom: 12 }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '8px 12px',
                    background: walls3DEnabled ? 'linear-gradient(135deg, rgba(0,180,219,0.2), rgba(0,131,176,0.2))' : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${walls3DEnabled ? '#00b4db' : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: 8
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <i className="fas fa-cubes" style={{ color: walls3DEnabled ? '#00b4db' : '#aaa', fontSize: 16 }}></i>
                        <div>
                            <div style={{ fontSize: 13, fontWeight: 'bold', color: '#fff' }}>3D Modular Walls</div>
                            <div style={{ fontSize: 10, color: '#aaa' }}>{walls3DEnabled ? 'Real 3D Mesh Walls Active' : 'SVG 2.5D Wall Layer Active'}</div>
                        </div>
                    </div>
                    <button
                        className={`size-btn ${walls3DEnabled ? 'active' : ''}`}
                        onClick={() => setWalls3DEnabled(!walls3DEnabled)}
                        style={{ padding: '4px 10px', fontSize: 11, cursor: 'pointer' }}
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
                                            <div
                                                className="wall-preview"
                                                style={{
                                                    backgroundImage: `url(/assets/textures/walls/${wallId}.png)`,
                                                    backgroundColor: wall.color,
                                                    backgroundSize: 'cover',
                                                    backgroundPosition: 'center',
                                                    backgroundBlendMode: 'multiply',
                                                    opacity: wall.category === 'partial' ? 0.7 : 1,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    padding: '8px 6px',
                                                    minHeight: '58px',
                                                    border: selectedWallType === wallId ? '3px solid #d4af37' : '2px solid #a08c70'
                                                }}
                                            >
                                                <span
                                                    className="wall-name"
                                                    style={{
                                                        color: '#ffffff',
                                                        fontSize: '12px',
                                                        fontWeight: 'bold',
                                                        textAlign: 'center',
                                                        textShadow: '2px 2px 4px rgba(0,0,0,0.9)',
                                                        lineHeight: '1.1',
                                                        marginBottom: '4px'
                                                    }}
                                                >
                                                    {wall.name}
                                                </span>
                                                <div className="wall-properties" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', justifyContent: 'center' }}>
                                                    {wall.blocksMovement && (
                                                        <span
                                                            className="property-badge movement-block"
                                                            title="Blocks Movement"
                                                            style={{
                                                                backgroundColor: 'rgba(255, 0, 0, 0.8)',
                                                                color: '#ffffff',
                                                                fontSize: '10px',
                                                                padding: '2px 4px',
                                                                borderRadius: '3px',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            BLOCKS
                                                        </span>
                                                    )}
                                                    {wall.blocksLineOfSight && (
                                                        <span
                                                            className="property-badge vision-block"
                                                            title="Blocks Vision"
                                                            style={{
                                                                backgroundColor: 'rgba(0, 0, 255, 0.8)',
                                                                color: '#ffffff',
                                                                fontSize: '10px',
                                                                padding: '2px 4px',
                                                                borderRadius: '3px',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            VISION
                                                        </span>
                                                    )}
                                                    {wall.interactive && (
                                                        <span
                                                            className="property-badge interactive"
                                                            title="Interactive"
                                                            style={{
                                                                backgroundColor: 'rgba(0, 255, 0, 0.8)',
                                                                color: '#ffffff',
                                                                fontSize: '10px',
                                                                padding: '2px 4px',
                                                                borderRadius: '3px',
                                                                fontWeight: 'bold'
                                                            }}
                                                        >
                                                            DOOR
                                                        </span>
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


        </div>
    );
};

export default WallTools;
